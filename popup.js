// ═══════════════════════════════════
//  Following Manager — popup.js v3
// ═══════════════════════════════════

const i18n = {
  en: {
    appName: 'Following Manager', following: 'Following', followers: 'Followers',
    tabList: 'List', tabStats: 'Stats', tabSettings: 'Settings',
    scanFollowing: 'Scan following list', scanFollowers: 'Scan followers list',
    all: 'All', followBack: 'Follow back', noFollowBack: 'No follow back',
    followBackYou: 'Follows you', noFollowBackYou: "Doesn't follow",
    youFollowBack: 'You follow back', youDontFollow: "You don't follow",
    searchPlaceholder: 'Search name, handle, bio…',
    filterAll: 'All', filterVerified: 'Verified', filterUnverified: 'Not verified',
    filterActivity: 'Activity', filter30: 'Inactive 30+ days', filter60: 'Inactive 60+ days',
    filter90: 'Inactive 90+ days', filterNever: 'No tweets', filterMaxFollowers: 'Max followers',
    selectAll: 'All', selectNoBack: 'No follow back', selectNoBackFollowers: "Don't follow back",
    emptyState: 'Not scanned yet.<br/>Go to your Following page and scan.',
    emptyStateFollowers: 'Not scanned yet.<br/>Go to your Followers page and scan.',
    unfollowSelected: 'Unfollow selected', removeSelected: 'Remove selected followers',
    pause: 'Pause', resume: 'Resume',
    confirmAction: 'Are you sure? Click again — {n} {action}',
    unfollow: 'unfollow', remove: 'remove',
    statTotal: 'Following', statTotalFollowers: 'Followers',
    statMutual: 'Follow back', statMutualFollowers: 'You follow back',
    statNoBack: 'No follow back', statNoBackFollowers: "You don't follow",
    statVerified: 'Verified', statUnfollowed: 'Unfollowed', statRemoved: 'Removed',
    recentActions: 'Recent unfollows', recentActionsFollowers: 'Recent removals',
    settingsSpeed: 'Speed & safety', settingsMinDelay: 'Min delay (sec)',
    settingsMaxDelay: 'Max delay (sec)', settingsDailyCap: 'Daily limit',
    settingsBatchSize: 'Batch size', settingsBatchPause: 'Batch pause (min)',
    settingsProtectMutuals: 'Protect mutual follows',
    saveSettings: 'Save settings', savedSettings: 'Saved ✓',
    settingsHint: 'Uses X internal API with random delays and daily limits.',
    goToPage: 'Go to x.com/YourHandle/{page} first.',
    refreshing: 'Checking X tab…', collecting: 'Collecting…',
    collectingApi: 'API… {n}', collectingDom: 'Scrolling… {n}',
    rateLimit: '⏳ Rate limit! Wait {n} min…',
    found: '{n} accounts ({method}) — {back} follow back',
    error: 'Error: {reason}', queueStarted: '{action} queue: {n} remaining',
    queueEmpty: 'Queue empty — mutual follows are protected.',
    queueRemaining: '{n} remaining · Today: {count}/{cap}',
    batchPause: ' · Batch pause: {n} min', todayCount: 'Today: {count}/{cap}',
    goToFollowing: 'Following', goToFollowers: 'Followers',
  },
  fa: {
    appName: 'مدیریت فالوینگ', following: 'فالوینگ', followers: 'فالوورها',
    tabList: 'لیست', tabStats: 'آمار', tabSettings: 'تنظیمات',
    scanFollowing: 'اسکن لیست دنبال‌شونده‌ها', scanFollowers: 'اسکن لیست فالوورها',
    all: 'همه', followBack: 'فالو می‌کنن', noFollowBack: 'فالو نمی‌کنن',
    followBackYou: 'فالو‌بک دادی', noFollowBackYou: 'فالو‌بک ندادی',
    youFollowBack: 'فالو‌بک دادم', youDontFollow: 'فالو‌بک ندادم',
    searchPlaceholder: 'جستجوی نام، هندل، بیو…',
    filterAll: 'همه', filterVerified: 'وریفای', filterUnverified: 'غیروریفای',
    filterActivity: 'فعالیت', filter30: 'غیرفعال ۳۰+ روز', filter60: 'غیرفعال ۶۰+ روز',
    filter90: 'غیرفعال ۹۰+ روز', filterNever: 'بدون توییت', filterMaxFollowers: 'حداکثر فالوور',
    selectAll: 'همه', selectNoBack: 'فالو-نکرده‌ها', selectNoBackFollowers: 'بدون فالو‌بک',
    emptyState: 'اسکن نشده.<br/>به صفحه Following بروید و اسکن کنید.',
    emptyStateFollowers: 'اسکن نشده.<br/>به صفحه Followers بروید و اسکن کنید.',
    unfollowSelected: 'آنفالو موارد انتخاب‌شده', removeSelected: 'حذف فالورهای انتخاب‌شده',
    pause: 'توقف', resume: 'ادامه',
    confirmAction: 'مطمئنی؟ دوباره بزن — {n} {action}',
    unfollow: 'آنفالو', remove: 'حذف',
    statTotal: 'کل دنبال‌شونده‌ها', statTotalFollowers: 'کل فالوورها',
    statMutual: 'فالو می‌کنن', statMutualFollowers: 'فالو‌بک دادم',
    statNoBack: 'فالو نمی‌کنن', statNoBackFollowers: 'فالو‌بک ندادم',
    statVerified: 'وریفای', statUnfollowed: 'آنفالوشده', statRemoved: 'حذفشده',
    recentActions: 'آخرین آنفالوها', recentActionsFollowers: 'آخرین حذف‌ها',
    settingsSpeed: 'سرعت و ایمنی', settingsMinDelay: 'حداقل فاصله (ثانیه)',
    settingsMaxDelay: 'حداکثر فاصله (ثانیه)', settingsDailyCap: 'سقف روزانه',
    settingsBatchSize: 'تعداد هر batch', settingsBatchPause: 'استراحت batch (دقیقه)',
    settingsProtectMutuals: 'محافظت از فالوهای متقابل',
    saveSettings: 'ذخیره تنظیمات', savedSettings: 'ذخیره شد ✓',
    settingsHint: 'از API داخلی X با تاخیر تصادفی و سقف روزانه استفاده می‌کنه.',
    goToPage: 'به x.com/YourHandle/{page} بروید.',
    refreshing: 'بررسی تب X…', collecting: 'در حال جمع‌آوری…',
    collectingApi: 'API… {n}', collectingDom: 'اسکرول… {n}',
    rateLimit: '⏳ ریت لیمت! {n} دقیقه صبر کنید…',
    found: '{n} حساب ({method}) — {back} فالو‌بک',
    error: 'خطا: {reason}', queueStarted: 'صف {action}: {n} مورد',
    queueEmpty: 'صف خالی — فالو‌بک‌دارها محافظت شده‌اند.',
    queueRemaining: '{n} باقی‌مانده · امروز: {count}/{cap}',
    batchPause: ' · استراحت: {n} دقیقه', todayCount: 'امروز: {count}/{cap}',
    goToFollowing: 'Following', goToFollowers: 'Followers',
  }
};

let lang = 'en';
function t(k, v) { let s = (i18n[lang] && i18n[lang][k]) || i18n.en[k] || k; if (v) for (const [a, b] of Object.entries(v)) s = s.replace('{' + a + '}', b); return s; }

function applyLang() {
  document.body.classList.toggle('lang-en', lang === 'en');
  document.body.classList.toggle('lang-fa', lang === 'fa');
  document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if (i18n[lang][k] || i18n.en[k]) el.textContent = t(k); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
  document.getElementById('langToggle').textContent = lang === 'en' ? 'FA' : 'EN';
  updateLabels();
}

const $ = id => document.getElementById(id);
const els = {
  modeFollowing: $('modeFollowing'), modeFollowers: $('modeFollowers'),
  accountLabel: $('accountLabel'), langToggle: $('langToggle'),
  scanBtn: $('scanBtn'), scanBtnLabel: $('scanBtnLabel'), scanStatus: $('scanStatus'),
  followbackSegment: $('followbackSegment'),
  segCountAll: $('segCountAll'), segCountBack: $('segCountBack'), segCountNoBack: $('segCountNoBack'),
  segLabelGood: $('segLabelGood'), segLabelBad: $('segLabelBad'),
  searchInput: $('searchInput'), filtersToggle: $('filtersToggle'), extraFilters: $('extraFilters'),
  verifiedFilter: $('verifiedFilter'), inactiveFilter: $('inactiveFilter'), maxFollowersInput: $('maxFollowersInput'),
  selectAllBox: $('selectAllBox'), selectNoBackBtn: $('selectNoBackBtn'), selectNoBackLabel: $('selectNoBackLabel'),
  selectedCount: $('selectedCount'), userList: $('userList'), emptyState: $('emptyState'), emptyStateText: $('emptyStateText'),
  unfollowSelectedBtn: $('unfollowSelectedBtn'), actionBtnLabel: $('actionBtnLabel'),
  pauseBtn: $('pauseBtn'), queueStatus: $('queueStatus'),
  statTotal: $('statTotal'), statTotalLabel: $('statTotalLabel'), statVerified: $('statVerified'),
  statMutual: $('statMutual'), statMutualLabel: $('statMutualLabel'),
  statNoBack: $('statNoBack'), statNoBackLabel: $('statNoBackLabel'),
  statUnfollowed: $('statUnfollowed'), statActionLabel: $('statActionLabel'),
  recentUnfollows: $('recentUnfollows'), recentTitle: $('recentTitle'),
  minDelay: $('minDelay'), maxDelay: $('maxDelay'), dailyCap: $('dailyCap'),
  batchSize: $('batchSize'), batchPauseMin: $('batchPauseMin'), protectMutuals: $('protectMutuals'),
  saveSettingsBtn: $('saveSettingsBtn'),
};

let currentUsers = [], selected = new Set(), pollTimer = null, mutualMode = 'all', mode = 'following';
const bg = msg => chrome.runtime.sendMessage(msg);
async function getActiveXTab() { const t = await chrome.tabs.query({ url: ['https://x.com/*', 'https://twitter.com/*'] }); return t[0] || null; }

// Tabs
function switchTab(n) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === n));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + n));
}
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

// Lang
els.langToggle.addEventListener('click', () => { lang = lang === 'en' ? 'fa' : 'en'; applyLang(); renderList(); });

// Mode
function updateLabels() {
  const m = mode === 'following';
  els.scanBtnLabel.textContent = t(m ? 'scanFollowing' : 'scanFollowers');
  els.emptyStateText.innerHTML = t(m ? 'emptyState' : 'emptyStateFollowers');
  els.actionBtnLabel.textContent = t(m ? 'unfollowSelected' : 'removeSelected');
  els.segLabelGood.textContent = t(m ? 'followBack' : 'youFollowBack');
  els.segLabelBad.textContent = t(m ? 'noFollowBack' : 'youDontFollow');
  els.selectNoBackLabel.textContent = t(m ? 'selectNoBack' : 'selectNoBackFollowers');
  els.statTotalLabel.textContent = t(m ? 'statTotal' : 'statTotalFollowers');
  els.statMutualLabel.textContent = t(m ? 'statMutual' : 'statMutualFollowers');
  els.statNoBackLabel.textContent = t(m ? 'statNoBack' : 'statNoBackFollowers');
  els.statActionLabel.textContent = t(m ? 'statUnfollowed' : 'statRemoved');
  els.recentTitle.textContent = t(m ? 'recentActions' : 'recentActionsFollowers');
}

function setMode(m) {
  mode = m; mutualMode = 'all';
  document.querySelectorAll('.seg-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  selected.clear();
  document.body.classList.toggle('mode-following', m === 'following');
  document.body.classList.toggle('mode-followers', m === 'followers');
  els.modeFollowing.classList.toggle('active', m === 'following');
  els.modeFollowers.classList.toggle('active', m === 'followers');
  updateLabels(); loadState();
}
els.modeFollowing.addEventListener('click', () => setMode('following'));
els.modeFollowers.addEventListener('click', () => setMode('followers'));

// Filters
els.filtersToggle.addEventListener('click', () => els.extraFilters.classList.toggle('open'));
els.followbackSegment.addEventListener('click', e => {
  const b = e.target.closest('.seg-btn'); if (!b) return;
  mutualMode = b.dataset.mutual;
  document.querySelectorAll('.seg-btn').forEach(x => x.classList.toggle('active', x === b));
  renderList();
});

function applyFilters() {
  const q = els.searchInput.value.trim().toLowerCase(), v = els.verifiedFilter.value, ia = els.inactiveFilter.value;
  const mf = els.maxFollowersInput.value ? +els.maxFollowersInput.value : null, now = Date.now();
  return currentUsers.filter(u => {
    if (q && !(u.name + ' ' + u.handle + ' ' + u.bio).toLowerCase().includes(q)) return false;
    if (v === 'verified' && !u.verified) return false;
    if (v === 'unverified' && u.verified) return false;
    if (mutualMode === 'hide' && u.mutual) return false;
    if (mutualMode === 'only' && !u.mutual) return false;
    if (ia !== 'all') {
      if (ia === 'never') { if (u.lastTweetAt) return false; }
      else { const d = +ia; if (!u.lastTweetAt) return false; if ((now - new Date(u.lastTweetAt).getTime()) / 864e5 < d) return false; }
    }
    if (mf !== null) { if (u.followersCount == null || u.followersCount > mf) return false; }
    return true;
  });
}

function ini(n, h) { const s = (n || h || '?').trim().split(/\s+/).filter(Boolean); return s.length >= 2 ? (s[0][0] + s[1][0]).toUpperCase() : s[0].slice(0, 2).toUpperCase(); }
function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
function fmt(n) { return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n); }

function renderList() {
  const f = applyFilters();
  els.userList.innerHTML = '';
  if (currentUsers.length === 0) { els.userList.appendChild(els.emptyState); updSel(); return; }
  if (f.length === 0) { const e = document.createElement('div'); e.className = 'empty'; e.innerHTML = '<p>' + (lang === 'fa' ? 'موردی پیدا نشد.' : 'No results.') + '</p>'; els.userList.appendChild(e); updSel(); return; }
  for (const u of f) {
    const row = document.createElement('div');
    row.className = 'user-row ' + (u.mutual ? 'mutual-yes' : 'mutual-no');
    const bt = u.mutual ? (mode === 'following' ? t('followBackYou') : t('youFollowBack')) : (mode === 'following' ? t('noFollowBackYou') : t('youDontFollow'));
    const bc = u.mutual ? 'badge mutual' : 'badge nomutual';
    row.innerHTML =
      '<input type="checkbox" data-handle="' + u.handle + '"' + (selected.has(u.handle) ? ' checked' : '') + '/>' +
      '<div class="ava">' + esc(ini(u.name, u.handle)) + '</div>' +
      '<div class="usr"><div class="usr-top"><span class="usr-name">' + esc(u.name) + '</span>' +
      (u.verified ? '<span class="badge verified">✓</span>' : '') +
      '<span class="' + bc + '">' + esc(bt) + '</span></div>' +
      '<div class="usr-handle">@' + u.handle + (u.followersCount != null ? ' · ' + fmt(u.followersCount) : '') + (u.location ? ' · ' + esc(u.location) : '') + '</div>' +
      (u.bio ? '<div class="usr-bio">' + esc(u.bio) + '</div>' : '') +
      (u.lastTweetAt ? '<div class="usr-bio">' + (lang === 'fa' ? 'آخرین توییت: ' : 'Last tweet: ') + new Date(u.lastTweetAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US') + '</div>' : '') +
      '</div>';
    row.querySelector('input').addEventListener('change', e => { if (e.target.checked) selected.add(u.handle); else selected.delete(u.handle); updSel(); });
    els.userList.appendChild(row);
  }
  updSel();
}

function updSel() {
  els.selectedCount.textContent = selected.size;
  els.unfollowSelectedBtn.disabled = selected.size === 0;
  if (pendingConfirm) { pendingConfirm = false; els.actionBtnLabel.textContent = mode === 'following' ? t('unfollowSelected') : t('removeSelected'); }
  const f = applyFilters();
  els.selectAllBox.checked = f.length > 0 && f.every(u => selected.has(u.handle));
  const total = currentUsers.length, back = currentUsers.filter(u => u.mutual).length;
  els.segCountAll.textContent = fmt(total); els.segCountBack.textContent = fmt(back); els.segCountNoBack.textContent = fmt(total - back);
}

els.selectAllBox.addEventListener('change', e => { const f = applyFilters(); if (e.target.checked) f.forEach(u => selected.add(u.handle)); else f.forEach(u => selected.delete(u.handle)); renderList(); });
els.selectNoBackBtn.addEventListener('click', () => { const nb = currentUsers.filter(u => !u.mutual); const all = nb.length > 0 && nb.every(u => selected.has(u.handle)); if (all) nb.forEach(u => selected.delete(u.handle)); else nb.forEach(u => selected.add(u.handle)); renderList(); });
[els.searchInput, els.verifiedFilter, els.inactiveFilter, els.maxFollowersInput].forEach(el => { el.addEventListener('input', renderList); el.addEventListener('change', renderList); });

// Scan
els.scanBtn.addEventListener('click', async () => {
  els.scanStatus.textContent = t('refreshing');
  const tab = await getActiveXTab();
  if (!tab) { els.scanStatus.textContent = lang === 'fa' ? 'یک تب از x.com باز کنید.' : 'Open an x.com tab.'; return; }
  let info; try { info = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_INFO' }); } catch { els.scanStatus.textContent = lang === 'fa' ? 'صفحه را رفرش کنید.' : 'Refresh the page.'; return; }
  const ok = mode === 'following' ? info.onFollowingPage : info.onFollowersPage;
  if (!ok) { els.scanStatus.textContent = t('goToPage', { page: mode === 'following' ? t('goToFollowing') : t('goToFollowers') }); return; }
  const account = info.profileHandle;
  els.scanStatus.textContent = t('collecting'); els.scanBtn.disabled = true;
  const listener = msg => { if (msg.type === 'SCRAPE_PROGRESS') els.scanStatus.textContent = t(msg.method === 'api' ? 'collectingApi' : 'collectingDom', { n: msg.count }); };
  chrome.runtime.onMessage.addListener(listener);
  try {
    const res = await chrome.tabs.sendMessage(tab.id, { type: mode === 'following' ? 'SCRAPE_FOLLOWING' : 'SCRAPE_FOLLOWERS' });
    chrome.runtime.onMessage.removeListener(listener);
    if (res && res.ok) {
      await bg({ type: mode === 'following' ? 'SAVE_FOLLOWING' : 'SAVE_FOLLOWERS', account, users: res.users });
      els.scanStatus.textContent = t('found', { n: res.users.length, method: res.method === 'api' ? 'API' : 'DOM', back: res.users.filter(u => u.mutual).length });
      await loadState();
    } else els.scanStatus.textContent = t('error', { reason: res ? res.reason : 'unknown' });
  } catch (err) { chrome.runtime.onMessage.removeListener(listener); els.scanStatus.textContent = t('error', { reason: err.message }); }
  finally { els.scanBtn.disabled = false; }
});

// Action
let pendingConfirm = false;
els.unfollowSelectedBtn.addEventListener('click', async () => {
  if (selected.size === 0) return;
  if (!pendingConfirm) {
    pendingConfirm = true;
    const n = selected.size, w = mode === 'following' ? t('unfollow') : t('remove');
    els.actionBtnLabel.textContent = t('confirmAction', { n, action: w });
    setTimeout(() => { if (pendingConfirm) { pendingConfirm = false; els.actionBtnLabel.textContent = mode === 'following' ? t('unfollowSelected') : t('removeSelected'); } }, 5000);
    return;
  }
  pendingConfirm = false;
  const handles = Array.from(selected);
  els.actionBtnLabel.textContent = '…'; els.unfollowSelectedBtn.disabled = true;
  let res;
  try {
    if (mode === 'following') res = await bg({ type: 'START_QUEUE', handles });
    else { const entries = handles.map(h => { const u = currentUsers.find(x => x.handle === h); return { handle: h, userId: u ? u.userId : null }; }); res = await bg({ type: 'START_REMOVE_QUEUE', entries }); }
  } catch (err) { els.queueStatus.textContent = t('error', { reason: err.message }); els.actionBtnLabel.textContent = mode === 'following' ? t('unfollowSelected') : t('removeSelected'); els.unfollowSelectedBtn.disabled = false; return; }
  selected.clear(); renderList();
  els.actionBtnLabel.textContent = mode === 'following' ? t('unfollowSelected') : t('removeSelected');
  if (!res || !res.ok) { els.queueStatus.textContent = t('error', { reason: 'queue failed' }); return; }
  if (res.queued === 0) { els.queueStatus.textContent = t('queueEmpty'); return; }
  els.queueStatus.textContent = t('queueStarted', { action: mode === 'following' ? t('unfollow') : t('remove'), n: res.queued });
  els.pauseBtn.style.display = 'block'; els.pauseBtn.textContent = t('pause'); startPolling();
});

els.pauseBtn.addEventListener('click', async () => {
  const state = (await bg({ type: 'GET_STATE' })).state;
  if (mode === 'following') {
    if (state.queueRunning) { await bg({ type: 'PAUSE_QUEUE' }); els.pauseBtn.textContent = t('resume'); }
    else { await bg({ type: 'RESUME_QUEUE' }); els.pauseBtn.textContent = t('pause'); }
  } else {
    if (state.removeQueueRunning) { await bg({ type: 'PAUSE_REMOVE_QUEUE' }); els.pauseBtn.textContent = t('resume'); }
    else { await bg({ type: 'RESUME_REMOVE_QUEUE' }); els.pauseBtn.textContent = t('pause'); }
  }
});

els.saveSettingsBtn.addEventListener('click', async () => {
  await bg({ type: 'UPDATE_SETTINGS', settings: { minDelaySec: +els.minDelay.value || 5, maxDelaySec: +els.maxDelay.value || 7, dailyCap: +els.dailyCap.value || 100, batchSize: +els.batchSize.value || 40, batchPauseMin: +els.batchPauseMin.value || 15, protectMutuals: els.protectMutuals.checked } });
  els.saveSettingsBtn.textContent = t('savedSettings'); setTimeout(() => els.saveSettingsBtn.textContent = t('saveSettings'), 1200);
});

// Poll
function startPolling() { if (pollTimer) clearInterval(pollTimer); pollTimer = setInterval(refreshQ, 1500); refreshQ(); }
async function refreshQ() {
  const { state } = await bg({ type: 'GET_STATE' }); if (!state) return;
  const running = mode === 'following' ? state.queueRunning : state.removeQueueRunning;
  const queue = mode === 'following' ? (state.queue || []) : (state.removeQueue || []);
  const dc = mode === 'following' ? state.dailyCount : (state.removeDailyCount || { count: 0 });
  if (queue.length > 0 || running) {
    els.pauseBtn.style.display = 'block'; els.pauseBtn.textContent = running ? t('pause') : t('resume');
    let ex = '';
    if (state.lastAction && state.lastAction.type === 'batch_pause' && state.lastAction.resumeAt > Date.now()) ex = t('batchPause', { n: Math.ceil((state.lastAction.resumeAt - Date.now()) / 6e4) });
    els.queueStatus.textContent = t('queueRemaining', { n: queue.length, count: dc.count, cap: state.settings.dailyCap }) + ex;
  } else {
    els.pauseBtn.style.display = 'none'; els.queueStatus.textContent = dc ? t('todayCount', { count: dc.count, cap: state.settings.dailyCap }) : '';
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }
  const acct = state.activeAccount;
  if (acct && state.accounts[acct]) { currentUsers = mode === 'following' ? (state.accounts[acct].following || []) : (state.accounts[acct].followers || []); renderList(); renderInsights(state); }
}

function renderInsights(state) {
  if (!state) return;
  const d = state.activeAccount ? state.accounts[state.activeAccount] : null;
  const list = mode === 'following' ? (d ? d.following || [] : []) : (d ? d.followers || [] : []);
  const act = mode === 'following' ? (d ? d.unfollowed || [] : []) : (d ? d.removed || [] : []);
  const bc = list.filter(u => u.mutual).length;
  els.statTotal.textContent = list.length; els.statMutual.textContent = bc; els.statNoBack.textContent = list.length - bc;
  els.statVerified.textContent = list.length ? Math.round((list.filter(u => u.verified).length / list.length) * 100) + '%' : '0%';
  els.statUnfollowed.textContent = act.length;
  els.recentUnfollows.innerHTML = '';
  act.slice(-15).reverse().forEach(u => { const r = document.createElement('div'); r.className = 'recent-row'; r.innerHTML = '<span>@' + esc(u.handle) + '</span><span>' + new Date(u.at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US') + '</span>'; els.recentUnfollows.appendChild(r); });
}

async function loadState() {
  const { state } = await bg({ type: 'GET_STATE' }); if (!state) return;
  els.accountLabel.textContent = state.activeAccount ? '@' + state.activeAccount : '—';
  els.minDelay.value = state.settings.minDelaySec; els.maxDelay.value = state.settings.maxDelaySec;
  els.dailyCap.value = state.settings.dailyCap; els.batchSize.value = state.settings.batchSize;
  els.batchPauseMin.value = state.settings.batchPauseMin; els.protectMutuals.checked = state.settings.protectMutuals;
  const acct = state.activeAccount;
  currentUsers = acct && state.accounts[acct] ? (mode === 'following' ? state.accounts[acct].following || [] : state.accounts[acct].followers || []) : [];
  renderList(); renderInsights(state);
  const hasQ = mode === 'following' ? (state.queue && state.queue.length > 0) : (state.removeQueue && state.removeQueue.length > 0);
  if (hasQ) startPolling();
}

// Init
document.body.classList.add('mode-following');
lang = navigator.language.startsWith('fa') ? 'fa' : 'en';
applyLang(); loadState();
