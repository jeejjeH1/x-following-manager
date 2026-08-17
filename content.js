// content.js — runs in the page context of x.com / twitter.com
// API strategy: friends/list.json (following) + friends/followers.json (followers)
// + friendships/destroy.json (unfollow) + friendships/remove.json (remove follower)

(() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const PUBLIC_BEARER =
    'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

  function getCsrfToken() {
    const m = document.cookie.match(/(?:^|;\s*)ct0=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function getCurrentHandle() {
    const el = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"] [dir="ltr"]');
    if (el && el.textContent.startsWith('@')) return el.textContent.slice(1);
    return null;
  }

  // ---------- API strategy ----------

  async function apiFetch(path, { method = 'GET', params = null, body = null } = {}) {
    const csrf = getCsrfToken();
    if (!csrf) throw new Error('no_csrf_token');
    let url = `https://x.com/i/api/1.1${path}`;
    if (params) url += '?' + new URLSearchParams(params).toString();
    const headers = {
      authorization: `Bearer ${PUBLIC_BEARER}`,
      'x-csrf-token': csrf,
      'x-twitter-active-user': 'yes',
      'x-twitter-auth-type': 'OAuth2Session',
      'x-twitter-client-language': 'en',
    };
    let fetchBody;
    if (body) {
      headers['content-type'] = 'application/x-www-form-urlencoded';
      fetchBody = new URLSearchParams(body).toString();
    }
    const res = await fetch(url, { method, headers, body: fetchBody, credentials: 'include' });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`api_${res.status}: ${text.slice(0, 200)}`);
    }
    return res.json();
  }

  function mapUser(u, isFollowers) {
    return {
      handle: u.screen_name,
      name: u.name,
      bio: u.description || '',
      verified: !!(u.verified || u.is_blue_verified || u.ext_is_blue_verified || u.verified_type),
      mutual: isFollowers ? !!u.following : !!u.followed_by,
      followersCount: typeof u.followers_count === 'number' ? u.followers_count : null,
      followingCount: typeof u.friends_count === 'number' ? u.friends_count : null,
      location: u.location || '',
      lastTweetAt: u.status && u.status.created_at ? u.status.created_at : null,
      userId: u.id_str || null,
    };
  }

  async function apiScrapeList(endpoint, screenName, isFollowers, onProgress) {
    let cursor = '-1';
    const users = [];
    let guard = 0;
    while (cursor && cursor !== '0' && guard < 300) {
      const data = await apiFetch(endpoint, {
        params: { screen_name: screenName, count: 200, cursor, skip_status: false, include_user_entities: false },
      });
      const list = data.users || [];
      for (const u of list) {
        users.push(mapUser(u, isFollowers));
      }
      onProgress && onProgress(users.length);
      cursor = data.next_cursor_str;
      guard += 1;
      if (!list.length) break;
      await sleep(350 + Math.random() * 350);
    }
    return users;
  }

  async function apiScrapeFollowing(screenName, onProgress) {
    return apiScrapeList('/friends/list.json', screenName, false, onProgress);
  }

  async function apiScrapeFollowers(screenName, onProgress) {
    return apiScrapeList('/followers/list.json', screenName, true, onProgress);
  }

  async function apiUnfollow(handle) {
    await apiFetch('/friendships/destroy.json', { method: 'POST', body: { screen_name: handle } });
  }

  async function apiRemoveFollower(handle, userId) {
    if (userId) {
      try {
        await apiFetch('/friendships/remove.json', { method: 'POST', body: { user_id: String(userId) } });
        return;
      } catch (err) {
        console.warn('[XFM] remove failed, trying block/unblock:', err.message);
      }
    }
    await apiFetch('/blocks/create.json', { method: 'POST', body: userId ? { user_id: String(userId) } : { screen_name: handle } });
    await sleep(500 + Math.random() * 500);
    await apiFetch('/blocks/destroy.json', { method: 'POST', body: userId ? { user_id: String(userId) } : { screen_name: handle } });
  }

  // ---------- DOM strategy (fallback) ----------

  function getUserCells() {
    return Array.from(document.querySelectorAll('[data-testid="UserCell"]'));
  }

  function parseUserCell(cell) {
    const linkEl = cell.querySelector('a[role="link"][href^="/"]');
    if (!linkEl) return null;
    const href = linkEl.getAttribute('href') || '';
    const handle = href.replace(/^\//, '').split('/')[0];
    if (!handle || handle.includes('?')) return null;
    const allText = cell.innerText || '';
    const lines = allText.split('\n').map((s) => s.trim()).filter(Boolean);
    const name = lines[0] || handle;
    const verified = !!cell.querySelector('svg[aria-label="Verified account"], [data-testid="icon-verified"], [data-testid="icon-verified-gold"], [data-testid="icon-verified-government"]');
    const mutual = /Follows you/i.test(allText);
    const handleLineIdx = lines.findIndex((l) => l.replace('@', '') === handle);
    let bio = '';
    if (handleLineIdx !== -1) {
      bio = lines.slice(handleLineIdx + 1).filter((l) => !/^Follows you$/i.test(l)).join(' ').trim();
    }
    return { handle, name, bio, verified, mutual, followersCount: null, followingCount: null, location: '', lastTweetAt: null, userId: null };
  }

  async function autoScrollAndCollect({ maxIdleRounds = 6, scrollDelay = 700, onProgress } = {}) {
    const seen = new Map();
    let idleRounds = 0;
    let lastHeight = 0;
    for (const cell of getUserCells()) {
      const u = parseUserCell(cell);
      if (u) seen.set(u.handle, u);
    }
    onProgress && onProgress(seen.size);
    while (idleRounds < maxIdleRounds) {
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(scrollDelay);
      for (const cell of getUserCells()) {
        const u = parseUserCell(cell);
        if (u && !seen.has(u.handle)) seen.set(u.handle, u);
      }
      onProgress && onProgress(seen.size);
      const newHeight = document.body.scrollHeight;
      if (newHeight === lastHeight) idleRounds += 1;
      else { idleRounds = 0; lastHeight = newHeight; }
    }
    return Array.from(seen.values());
  }

  async function findCellForHandle(handle, { maxScrolls = 40, scrollDelay = 500 } = {}) {
    window.scrollTo(0, 0);
    await sleep(scrollDelay);
    for (let i = 0; i < maxScrolls; i++) {
      for (const cell of getUserCells()) {
        const linkEl = cell.querySelector('a[role="link"][href^="/"]');
        if (!linkEl) continue;
        const cellHandle = (linkEl.getAttribute('href') || '').replace(/^\//, '').split('/')[0];
        if (cellHandle === handle) return cell;
      }
      window.scrollBy(0, window.innerHeight * 0.85);
      await sleep(scrollDelay);
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 5) break;
    }
    return null;
  }

  async function domUnfollow(handle) {
    const cell = await findCellForHandle(handle);
    if (!cell) return { handle, ok: false, reason: 'not_found_in_list' };
    const btn = cell.querySelector('button[data-testid$="-unfollow"], button[data-testid$="-following"]');
    if (!btn) return { handle, ok: false, reason: 'button_not_found' };
    btn.scrollIntoView({ block: 'center' });
    await sleep(300 + Math.random() * 300);
    btn.click();
    let confirmBtn = null;
    for (let i = 0; i < 20; i++) { confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]'); if (confirmBtn) break; await sleep(150); }
    if (!confirmBtn) return { handle, ok: false, reason: 'no_confirm_dialog' };
    await sleep(200 + Math.random() * 300);
    confirmBtn.click();
    await sleep(400 + Math.random() * 300);
    return { handle, ok: true };
  }

  async function domRemoveFollower(handle) {
    const cell = await findCellForHandle(handle);
    if (!cell) return { handle, ok: false, reason: 'not_found_in_list' };
    const moreBtn = cell.querySelector('button[aria-label="More"], button[aria-label="بیشتر"], [data-testid="userActions"]');
    if (!moreBtn) return { handle, ok: false, reason: 'more_button_not_found' };
    moreBtn.scrollIntoView({ block: 'center' });
    await sleep(300 + Math.random() * 300);
    moreBtn.click();
    let removeBtn = null;
    for (let i = 0; i < 20; i++) {
      for (const item of document.querySelectorAll('[role="menuitem"], [role="option"]')) {
        if ((item.textContent || '').toLowerCase().match(/remove|حذف/)) { removeBtn = item; break; }
      }
      if (removeBtn) break;
      await sleep(150);
    }
    if (!removeBtn) { document.body.click(); return { handle, ok: false, reason: 'remove_menu_not_found' }; }
    await sleep(200 + Math.random() * 300);
    removeBtn.click();
    let confirmBtn = null;
    for (let i = 0; i < 20; i++) { confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]'); if (confirmBtn) break; await sleep(150); }
    if (!confirmBtn) return { handle, ok: false, reason: 'no_confirm_dialog' };
    await sleep(200 + Math.random() * 300);
    confirmBtn.click();
    await sleep(400 + Math.random() * 300);
    return { handle, ok: true };
  }

  // ---------- message handling ----------

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    (async () => {
      try {
        if (msg.type === 'GET_PAGE_INFO') {
          const url = new URL(location.href);
          const parts = url.pathname.split('/').filter(Boolean);
          sendResponse({
            ok: true,
            onFollowingPage: parts[1] === 'following',
            onFollowersPage: parts[1] === 'followers',
            profileHandle: parts[0] || null,
            currentHandle: getCurrentHandle(),
          });
        } else if (msg.type === 'SCRAPE_FOLLOWING') {
          const url = new URL(location.href);
          const parts = url.pathname.split('/').filter(Boolean);
          const screenName = parts[0];
          try {
            const users = await apiScrapeFollowing(screenName, (count) => {
              chrome.runtime.sendMessage({ type: 'SCRAPE_PROGRESS', count, method: 'api' }).catch(() => {});
            });
            sendResponse({ ok: true, users, method: 'api' });
          } catch (err) {
            console.warn('[XFM] API scrape following failed:', err.message);
            sendResponse({ ok: false, reason: err.message });
          }
        } else if (msg.type === 'SCRAPE_FOLLOWERS') {
          const url = new URL(location.href);
          const parts = url.pathname.split('/').filter(Boolean);
          const screenName = parts[0];
          try {
            const users = await apiScrapeFollowers(screenName, (count) => {
              chrome.runtime.sendMessage({ type: 'SCRAPE_PROGRESS', count, method: 'api' }).catch(() => {});
            });
            sendResponse({ ok: true, users, method: 'api' });
          } catch (err) {
            console.warn('[XFM] API scrape followers failed:', err.message);
            sendResponse({ ok: false, reason: err.message });
          }
        } else if (msg.type === 'UNFOLLOW_HANDLE') {
          try {
            await apiUnfollow(msg.handle);
            sendResponse({ handle: msg.handle, ok: true, method: 'api' });
          } catch (err) {
            sendResponse({ handle: msg.handle, ok: false, reason: err.message });
          }
        } else if (msg.type === 'REMOVE_FOLLOWER_HANDLE') {
          try {
            await apiRemoveFollower(msg.handle, msg.userId);
            sendResponse({ handle: msg.handle, ok: true, method: 'api' });
          } catch (err) {
            sendResponse({ handle: msg.handle, ok: false, reason: err.message });
          }
        }
      } catch (err) {
        sendResponse({ ok: false, reason: String(err && err.message ? err.message : err) });
      }
    })();
    return true;
  });
})();
