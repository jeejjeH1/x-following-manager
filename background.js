// background.js — MV3 service worker
const ALARM_NAME = 'unfollow-tick';
const DEFAULT_SETTINGS = { minDelaySec: 5, maxDelaySec: 7, dailyCap: 100, protectMutuals: true, batchSize: 40, batchPauseMin: 15 };

function todayKey() { return new Date().toISOString().slice(0, 10); }

async function getState() {
  const { state } = await chrome.storage.local.get('state');
  if (state) {
    state.settings = { ...DEFAULT_SETTINGS, ...state.settings };
    if (typeof state.batchCount !== 'number') state.batchCount = 0;
    if (!state.removeQueue) state.removeQueue = [];
    if (typeof state.removeQueueRunning !== 'boolean') state.removeQueueRunning = false;
    if (!state.removeDailyCount) state.removeDailyCount = { date: todayKey(), count: 0 };
    if (typeof state.removeBatchCount !== 'number') state.removeBatchCount = 0;
    return state;
  }
  return {
    accounts: {},
    activeAccount: null,
    settings: DEFAULT_SETTINGS,
    queue: [],
    queueRunning: false,
    queueAccount: null,
    dailyCount: { date: todayKey(), count: 0 },
    batchCount: 0,
    lastAction: null,
    removeQueue: [],
    removeQueueRunning: false,
    removeDailyCount: { date: todayKey(), count: 0 },
    removeBatchCount: 0,
  };
}

async function setState(state) { await chrome.storage.local.set({ state }); }

async function findXTab() {
  const tabs = await chrome.tabs.query({ url: ['https://x.com/*', 'https://twitter.com/*'] });
  return tabs[0] || null;
}

async function sendToContent(tabId, msg) { return chrome.tabs.sendMessage(tabId, msg); }

function randomDelayMs(state) {
  const min = (state.settings.minDelaySec ?? 5) * 1000;
  const max = (state.settings.maxDelaySec ?? 12) * 1000;
  return Math.floor(min + Math.random() * Math.max(1, max - min));
}

async function scheduleNextTick(delayMs) {
  const minutes = Math.max(delayMs / 60000, 0.05);
  await chrome.alarms.create(ALARM_NAME, { delayInMinutes: minutes });
}

// ---------- Unfollow queue ----------
async function processQueueTick() {
  let state = await getState();
  if (!state.queueRunning || state.queue.length === 0) return;
  if (state.dailyCount.date !== todayKey()) state.dailyCount = { date: todayKey(), count: 0 };
  if (state.dailyCount.count >= state.settings.dailyCap) { state.lastAction = { type: 'paused_daily_cap', at: Date.now() }; state.queueRunning = false; await setState(state); return; }
  const tab = await findXTab();
  if (!tab) { state.lastAction = { type: 'error', reason: 'no_x_tab_open', at: Date.now() }; await setState(state); await scheduleNextTick(30000); return; }
  const handle = state.queue[0];
  let result;
  try { result = await sendToContent(tab.id, { type: 'UNFOLLOW_HANDLE', handle }); }
  catch (err) { result = { ok: false, reason: 'content_unreachable: ' + String(err && err.message ? err.message : err) }; }
  state = await getState();
  state.queue = state.queue.filter((h) => h !== handle);
  const acct = state.activeAccount;
  if (acct && state.accounts[acct] && result && result.ok) {
    state.dailyCount.count += 1;
    state.accounts[acct].unfollowed = state.accounts[acct].unfollowed || [];
    state.accounts[acct].unfollowed.push({ handle, at: Date.now() });
    state.accounts[acct].following = (state.accounts[acct].following || []).filter((u) => u.handle !== handle);
  }
  state.lastAction = { type: result && result.ok ? 'unfollowed' : 'failed', handle, reason: result && result.reason, at: Date.now() };
  if (state.queue.length > 0 && state.queueRunning) {
    state.batchCount = (state.batchCount || 0) + 1;
    const bs = state.settings.batchSize || 40;
    const bp = (state.settings.batchPauseMin || 15) * 60000;
    if (state.batchCount >= bs) { state.batchCount = 0; state.lastAction = { ...state.lastAction, type: 'batch_pause', at: Date.now(), resumeAt: Date.now() + bp }; await setState(state); await scheduleNextTick(bp); }
    else { await setState(state); await scheduleNextTick(randomDelayMs(state)); }
  } else { state.queueRunning = false; await setState(state); }
}

// ---------- Remove follower queue ----------
async function processRemoveQueueTick() {
  let state = await getState();
  if (!state.removeQueueRunning || state.removeQueue.length === 0) return;
  if (state.removeDailyCount.date !== todayKey()) state.removeDailyCount = { date: todayKey(), count: 0 };
  if (state.removeDailyCount.count >= state.settings.dailyCap) { state.lastAction = { type: 'paused_daily_cap_remove', at: Date.now() }; state.removeQueueRunning = false; await setState(state); return; }
  const tab = await findXTab();
  if (!tab) { state.lastAction = { type: 'error', reason: 'no_x_tab_open', at: Date.now() }; await setState(state); await scheduleNextTick(30000); return; }
  const entry = state.removeQueue[0];
  const handle = typeof entry === 'string' ? entry : entry.handle;
  const userId = typeof entry === 'object' ? entry.userId : null;
  let result;
  try { result = await sendToContent(tab.id, { type: 'REMOVE_FOLLOWER_HANDLE', handle, userId }); }
  catch (err) { result = { ok: false, reason: 'content_unreachable: ' + String(err && err.message ? err.message : err) }; }
  state = await getState();
  state.removeQueue = state.removeQueue.filter((e) => (typeof e === 'string' ? e : e.handle) !== handle);
  const acct = state.activeAccount;
  if (acct && state.accounts[acct] && result && result.ok) {
    state.removeDailyCount.count += 1;
    state.accounts[acct].removed = state.accounts[acct].removed || [];
    state.accounts[acct].removed.push({ handle, at: Date.now() });
    state.accounts[acct].followers = (state.accounts[acct].followers || []).filter((u) => u.handle !== handle);
  }
  state.lastAction = { type: result && result.ok ? 'removed_follower' : 'remove_failed', handle, reason: result && result.reason, at: Date.now() };
  if (state.removeQueue.length > 0 && state.removeQueueRunning) {
    state.removeBatchCount = (state.removeBatchCount || 0) + 1;
    const bs = state.settings.batchSize || 40;
    const bp = (state.settings.batchPauseMin || 15) * 60000;
    if (state.removeBatchCount >= bs) { state.removeBatchCount = 0; state.lastAction = { ...state.lastAction, type: 'batch_pause', at: Date.now(), resumeAt: Date.now() + bp }; await setState(state); await scheduleNextTick(bp); }
    else { await setState(state); await scheduleNextTick(randomDelayMs(state)); }
  } else { state.removeQueueRunning = false; await setState(state); }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) { processQueueTick(); processRemoveQueueTick(); }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    const state = await getState();
    if (msg.type === 'GET_STATE') {
      sendResponse({ ok: true, state });
    } else if (msg.type === 'SAVE_FOLLOWING') {
      const { account, users } = msg;
      state.accounts[account] = state.accounts[account] || { following: [], followers: [], unfollowed: [], removed: [], whitelist: [] };
      state.accounts[account].following = users;
      state.accounts[account].scrapedAt = Date.now();
      state.activeAccount = account;
      await setState(state);
      sendResponse({ ok: true });
    } else if (msg.type === 'SAVE_FOLLOWERS') {
      const { account, users } = msg;
      state.accounts[account] = state.accounts[account] || { following: [], followers: [], unfollowed: [], removed: [], whitelist: [] };
      state.accounts[account].followers = users;
      state.accounts[account].followersScrapedAt = Date.now();
      state.activeAccount = account;
      await setState(state);
      sendResponse({ ok: true });
    } else if (msg.type === 'UPDATE_SETTINGS') {
      state.settings = { ...state.settings, ...msg.settings };
      await setState(state);
      sendResponse({ ok: true });
    } else if (msg.type === 'START_QUEUE') {
      let handles = msg.handles || [];
      if (state.settings.protectMutuals && state.activeAccount) {
        const acct = state.accounts[state.activeAccount];
        const mutualSet = new Set((acct?.following || []).filter((u) => u.mutual).map((u) => u.handle));
        handles = handles.filter((h) => !mutualSet.has(h));
      }
      if (state.dailyCount.date !== todayKey()) state.dailyCount = { date: todayKey(), count: 0 };
      const tab = await findXTab();
      if (!tab) { await setState(state); sendResponse({ ok: false, queued: 0, reason: 'no_x_tab_open' }); return; }
      if (state.dailyCount.count >= state.settings.dailyCap) { await setState(state); sendResponse({ ok: false, queued: 0, reason: 'daily_cap_reached' }); return; }
      state.queue = handles;
      state.queueRunning = handles.length > 0;
      state.queueAccount = state.activeAccount;
      state.batchCount = 0;
      await setState(state);
      if (handles.length > 0) await scheduleNextTick(500);
      sendResponse({ ok: true, queued: handles.length });
    } else if (msg.type === 'START_REMOVE_QUEUE') {
      let entries = msg.entries || [];
      if (state.settings.protectMutuals && state.activeAccount) {
        const acct = state.accounts[state.activeAccount];
        const mutualSet = new Set((acct?.followers || []).filter((u) => u.mutual).map((u) => u.handle));
        entries = entries.filter((e) => !mutualSet.has(e.handle));
      }
      if (state.removeDailyCount.date !== todayKey()) state.removeDailyCount = { date: todayKey(), count: 0 };
      const tab = await findXTab();
      if (!tab) { await setState(state); sendResponse({ ok: false, queued: 0, reason: 'no_x_tab_open' }); return; }
      if (state.removeDailyCount.count >= state.settings.dailyCap) { await setState(state); sendResponse({ ok: false, queued: 0, reason: 'daily_cap_reached' }); return; }
      state.removeQueue = entries;
      state.removeQueueRunning = entries.length > 0;
      state.removeBatchCount = 0;
      await setState(state);
      if (entries.length > 0) await scheduleNextTick(500);
      sendResponse({ ok: true, queued: entries.length });
    } else if (msg.type === 'PAUSE_QUEUE') { state.queueRunning = false; await setState(state); await chrome.alarms.clear(ALARM_NAME); sendResponse({ ok: true });
    } else if (msg.type === 'RESUME_QUEUE') { state.queueRunning = state.queue.length > 0; await setState(state); if (state.queueRunning) await scheduleNextTick(500); sendResponse({ ok: true });
    } else if (msg.type === 'PAUSE_REMOVE_QUEUE') { state.removeQueueRunning = false; await setState(state); await chrome.alarms.clear(ALARM_NAME); sendResponse({ ok: true });
    } else if (msg.type === 'RESUME_REMOVE_QUEUE') { state.removeQueueRunning = state.removeQueue.length > 0; await setState(state); if (state.removeQueueRunning) await scheduleNextTick(500); sendResponse({ ok: true });
    } else if (msg.type === 'CLEAR_QUEUE') { state.queue = []; state.queueRunning = false; await setState(state); await chrome.alarms.clear(ALARM_NAME); sendResponse({ ok: true });
    }
  })();
  return true;
});
