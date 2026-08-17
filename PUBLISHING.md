# چک‌لیست انتشار در Chrome Web Store

## ۱) حساب توسعه‌دهنده
- ثبت‌نام در https://chrome.google.com/webstore/devconsole
- پرداخت یک‌بارهٔ ۵ دلار (فقط یک‌بار، برای همیشه)
- تأیید ایمیل/حساب گوگل

## ۲) فایل‌های آماده در همین پوشه
- `manifest.json` — نام، توضیح کوتاه، و پرمیشن‌های اضافی (`scripting`) که استفاده نمی‌شد حذف شد.
- `icons/` — آیکون‌های ۱۶/۴۸/۱۲۸ آماده‌ست (برند خنثی، بدون لوگوی X).
- لوگوی رسمی X که قبلاً توی هدر پاپ‌آپ بود حذف و با آیکون خنثی جایگزین شد — استفاده از لوگوی یک شرکت دیگه به‌عنوان برندینگ خودتون معمولاً باعث ریجکت‌شدن ریویو می‌شه یا مشکل علامت تجاری ایجاد می‌کنه.

## ۳) چیزهایی که هنوز باید خودتون بسازید/آپلود کنید

### الف) اسکرین‌شات (اجباری)
- حداقل ۱ عدد، حداکثر ۵ عدد
- سایز: `1280×800` یا `640×400` (px)، فرمت PNG/JPEG
- بهترین کار: خود اکستنشن رو لود کنید (`chrome://extensions` → Load unpacked)، وارد یه پروفایل X بشید، پاپ‌آپ رو باز کنید و از تب «لیست» و «آمار» اسکرین‌شات بگیرید.

### ب) آیکون فروشگاه
- همون `icons/icon128.png` کافیه (۱۲۸×۱۲۸، حاشیه‌ی خالی نداشته باشه، بک‌گراند شفاف مشکلی نداره).

### ج) تصویر تبلیغاتی کوچک (اختیاری ولی توصیه‌شده)
- سایز `440×280` برای نمایش بهتر در نتایج جستجوی استور.

## ۴) متن‌های استور (پیش‌نویس آماده)

**نام (تا ۴۵ کاراکتر):**
Following Manager for X

**توضیح کوتاه (تا ۱۳۲ کاراکتر):**
See who follows you back on X, filter your list, and bulk-unfollow safely with rate-limited pacing.

**توضیح کامل (پیش‌نویس):**
```
Following Manager helps you take control of your X (Twitter) following list.

• Scan your full following list in seconds
• Instantly see who follows you back and who doesn't
• Filter by verified status, inactivity, follower count, name or bio
• Select accounts and bulk-unfollow with randomized delays and a
  daily cap, mimicking normal manual use to keep your account safe
• Optionally protect mutual followers from being unfollowed
• Everything is stored locally in your browser — nothing is sent
  to any external server

This extension works entirely within your own logged-in X session.
It does not ask for your password and does not access any account
other than the one you're logged into.
```

**دسته‌بندی:** Productivity

**زبان:** فارسی + انگلیسی (اگه می‌خواید UI رو دوزبانه کنید، بگید تا اضافه کنم)

## ۵) سیاست حریم خصوصی (اجباری چون host_permissions دارید)

فایل `privacy-policy.html` رو توی همین پوشه ساختم. باید این فایل رو یه‌جا میزبانی کنید (نه لزوماً همراه اکستنشن) — ساده‌ترین راه‌ها:
- GitHub Pages (رایگان)
- یه صفحه‌ی ساده روی هر هاست/دامنه‌ی خودتون
- Google Sites (رایگان و سریع)

لینک نهایی رو موقع ثبت توی Developer Dashboard، بخش «Privacy practices» وارد کنید.

## ۶) توجیه پرمیشن‌ها (موقع ثبت از شما می‌پرسه)

فرم استور یه بخش «Permission justification» داره، این متن‌ها رو می‌تونید مستقیم استفاده کنید:

- **storage**: "Used to store the scanned following list, settings, and unfollow history locally on the user's device."
- **tabs**: "Used to detect the active x.com tab and confirm the user is on their Following page before scanning or acting."
- **alarms**: "Used to schedule the next queued unfollow action with a randomized delay, since the background service worker can be suspended between actions."
- **host_permissions (x.com, twitter.com)**: "Required to read the user's own following list and perform unfollow actions the user explicitly selects, within their own logged-in session."

## ۷) یک نکته‌ی مهم و صادقانه قبل از پابلیش

این اکستنشن با APIهای داخلی/private وب‌کلاینت X کار می‌کنه و به‌صورت خودکار (با تاخیر تصادفی) دکمه‌ی آنفالو رو می‌زنه. قوانین رسمی X («Automation rules») به‌صراحت **آنفالو/فالوی خودکار و انبوه** رو ممنوع کرده، حتی وقتی روی اکانت خودتونه — چون از دید X این یعنی رفتار غیرانسانی روی پلتفرم، صرف‌نظر از نیت. این یعنی:

- اکانت X کاربرانی که ازش استفاده می‌کنن ممکنه محدود یا موقتاً قفل بشه (ریسکیه که خود کاربر باید بدونه و بپذیره — به همین خاطر توصیه می‌کنم این هشدار رو توی توضیحات استور هم به‌صراحت بنویسید).
- گوگل هم گاهی اکستنشن‌هایی که به‌صورت خودکار روی پلتفرم‌های دیگه اکشن انجام میدن (حتی داخل اکانت خود کاربر) رو موقع ریویو با دقت بیشتری بررسی می‌کنه؛ ممکنه ریجکت اولیه بخوره و نیاز به توضیح بیشتر برای ریوایزر داشته باشه.
- این یه دلیل قانونی برای رد پابلیش نیست (کد شما مخرب نیست و فقط رو اکانت خود کاربر کار می‌کنه)، ولی خوبه از قبل بدونید تا با ریجکت یا ریپورت‌های احتمالی غافلگیر نشید.

اگه می‌خواید ریسک رو کم کنید، می‌تونید تنظیمات پیش‌فرض delay/دیلی‌کپ رو محافظه‌کارانه‌تر کنید (مثلاً سقف روزانه‌ی پایین‌تر، تاخیر بیشتر) — همین الان هم `protectMutuals` به‌صورت پیش‌فرض روشنه که کمک می‌کنه.

## ۸) مراحل نهایی ثبت
1. فایل‌های این پوشه رو zip کنید (فقط محتوای پوشه، نه خود پوشه به‌عنوان لایه‌ی اضافه).
2. توی Developer Dashboard → «New Item» → آپلود zip.
3. اسکرین‌شات‌ها، توضیحات، دسته‌بندی، و لینک privacy policy رو پر کنید.
4. توجیه پرمیشن‌ها رو بزنید (بخش ۶ بالا).
5. ثبت برای ریویو — معمولاً چند ساعت تا چند روز طول می‌کشه.
