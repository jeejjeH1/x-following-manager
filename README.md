# X Following Manager

A Chrome extension to scan, filter, and bulk unfollow accounts on X/Twitter — with API-first approach and built-in safety controls.

## Features

- **API-first scraping** — uses X's internal API (`friends/list.json`, `followers/list.json`) for fast, reliable data collection
- **Follower management** — scan and remove followers who don't follow you back
- **Smart filtering** — search by name/handle/bio, filter by verified status, activity, follower count
- **Follow-back detection** — instantly see who follows you back and who doesn't
- **Batch unfollow/remove** — with random delays, daily caps, and batch pauses to avoid rate limits
- **Mutual follow protection** — skips accounts that follow you back (toggle on/off)
- **Background queue** — works even when the popup is closed (keeps an x.com tab open)
- **Bilingual** — English and Persian (Farsi) with one-click language switch
- **Dark theme** — yellow & grey design

## Install (Developer / Unpacked Mode)

1. Open `chrome://extensions` in Chrome (or Quetta Browser on Android).
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `x-following-manager` folder.
4. Pin the extension icon to your toolbar.

## How to Use

### Unfollow Following
1. Navigate to `https://x.com/YOUR_HANDLE/following` (must be logged in).
2. Click the extension icon and press **Scan following list**.
3. Use the segmented filter to show: All / Follow back / No follow back.
4. Select accounts to unfollow using checkboxes (or use "No follow back" quick select).
5. Click **Unfollow selected** and confirm.

### Remove Followers
1. Navigate to `https://x.com/YOUR_HANDLE/followers`.
2. Switch the mode to **Followers** at the top.
3. Click **Scan followers list**.
4. Filter by "You don't follow" and select accounts.
5. Click **Remove selected followers**.

## How It Works

The extension uses X's internal API endpoints — the same ones the website calls when you load your Following/Followers page:

| Endpoint | Purpose |
|---|---|
| `GET /1.1/friends/list.json` | Scrape following list |
| `GET /1.1/followers/list.json` | Scrape followers list |
| `POST /1.1/friendships/destroy.json` | Unfollow a user |
| `POST /1.1/friendships/remove.json` | Remove a follower |
| `POST /1.1/blocks/create.json` | Block (fallback for remove) |
| `POST /1.1/blocks/destroy.json` | Unblock (fallback) |

Uses your existing session cookies (`ct0` CSRF token + bearer token) — no passwords or OAuth required.

## Safety Features

- **Random delays** between actions (default 5–12 seconds)
- **Daily cap** to limit actions per day (default 100)
- **Batch pauses** — takes a break every N actions
- **Mutual follow protection** — enabled by default to avoid unfollowing people who support you

All settings are configurable in the Settings tab.

## Settings

| Setting | Default | Description |
|---|---|---|
| Min delay | 5s | Minimum wait between actions |
| Max delay | 7s | Maximum wait between actions |
| Daily limit | 100 | Max actions per day |
| Batch size | 40 | Actions before a longer pause |
| Batch pause | 15 min | Rest duration between batches |
| Protect mutuals | On | Skip mutual follows |

## Tech Stack

- Chrome Extension Manifest V3
- Pure vanilla JS (no frameworks, no dependencies)
- X internal REST API
- Service Worker (background.js) for queue processing

## Disclaimer

Use this tool responsibly. Automated actions on X may violate their Terms of Service. Keep speeds low and use at your own risk.

## License

MIT
