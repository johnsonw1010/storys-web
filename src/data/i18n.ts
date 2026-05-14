/* =========================================================
   i18n — Traditional Chinese (default) + English.
   Shared keys live here; page-specific keys can live with
   their page or be added below.
   ========================================================= */

export type Lang = "zh" | "en";

export const LANGS: Lang[] = ["zh", "en"];

export const I18N: Record<Lang, Record<string, string>> = {
  zh: {
    "meta.title": "Storys — 創業之聲",
    "meta.description": "Storys Podcast 訪談每一位創辦人。地圖、品牌、節目，盡在這裡。",

    // global navigation
    "nav.home": "首頁",
    "nav.map": "地圖",
    "nav.episodes": "節目",
    "nav.about": "關於",
    "nav.team": "團隊",
    "nav.contact": "聯絡",
    "nav.apply": "申請受訪",
    "nav.online": "線上品牌",

    // home
    "home.hero.eyebrow": "Storys Podcast｜原 創業之聲",
    "home.hero.title": "從第一步，",
    "home.hero.titleAccent": "到每一步。",
    "home.hero.titleEn": "first step to every step",
    "home.hero.sub": "我們訪談每一位創辦人——從第一步走到每一步。把他們的故事帶回到他們親手蓋起的場域。",
    "home.hero.ctaListen": "收聽 Storys",
    "home.hero.ctaMap": "瀏覽地圖",
    "home.featured.title": "受訪品牌",
    "home.featured.sub": "點擊任一品牌，前往地圖查看完整資訊。",
    "home.featured.cta": "看所有品牌",
    "home.latest.title": "最新節目",
    "home.latest.cta": "看全部節目",
    "home.about.title": "關於 Storys",
    "home.about.body": "我們紀錄每一位創辦人的旅程——從沒沒無聞到被聽見。",
    "home.about.cta": "認識我們",

    // map (carried from original v3-immersive scope)
    "map.title": "實體據點地圖",
    "map.titleEn": "Retail Map",
    "map.sub": "點擊任一據點，查看品牌資訊、Apple Podcasts 集數與 Google Maps 路線。",
    "map.searchPlaceholder": "搜尋品牌或類別⋯",
    "map.allCategories": "全部",
    "map.locationLabel": "個據點",
    "map.locationsLabel": "個據點",
    "map.directions": "Google Maps",
    "map.episode": "聽這集",
    "map.episodeShort": "EP",
    "map.website": "官方網站",
    "map.empty": "找不到符合的品牌。",
    "map.brandCount": "間品牌",
    "map.locationCount": "個據點",
    "map.featuredLabel": "最新訪談",

    "online.title": "線上品牌",
    "online.titleEn": "Online Directory",
    "online.sub": "服務型公司、平台、媒體與創作者——沒有店面，但同樣值得認識。",
    "online.episode": "聽這集",
    "online.website": "造訪網站",
    "online.episodes": "集",

    // episodes
    "episodes.title": "所有節目",
    "episodes.sub": "我們訪談的每一位創辦人。點擊收聽。",
    "episodes.listenApple": "在 Apple Podcasts 收聽",
    "episodes.listenSpotify": "在 Spotify 收聽",
    "episodes.subscribe": "訂閱節目",
    "episodes.empty": "節目正在同步中⋯",

    // about
    "about.eyebrow": "關於 Storys",
    "about.title": "Make it on the Storys Map.",
    "about.titleZh": "在 Storys Map 上，留下你的座標。",
    "about.body": "Storys Podcast（原 創業之聲）紀錄每一位創辦人從第一步到每一步的旅程。這張地圖讓我們的聽眾走進這些品牌——支持那些勇敢起步的人，把每一段故事帶回到他們親手蓋起的場域。",
    "about.cta": "收聽 Storys Podcast",

    // team
    "team.title": "團隊",
    "team.sub": "錄音室裡的三個聲音。",

    // contact
    "contact.title": "聯絡 Storys",
    "contact.sub": "想合作、贊助、加入嘉賓名單？來信告訴我們。",
    "contact.general.title": "一般聯絡",
    "contact.sponsor.title": "贊助 / 業配合作",
    "contact.field.name": "你的名字",
    "contact.field.email": "Email",
    "contact.field.message": "訊息",
    "contact.field.company": "公司 / 品牌",
    "contact.field.budget": "預估預算",
    "contact.field.window": "理想時程",
    "contact.submit": "送出",
    "contact.success": "已收到，感謝你的訊息。我們會盡快回覆。",

    // apply
    "apply.title": "申請受訪",
    "apply.sub": "我們想認識你的品牌。填一份簡短的表單，我們會跟你聯絡。",
    "apply.field.brand": "品牌名稱",
    "apply.field.founder": "創辦人名字",
    "apply.field.website": "官方網站",
    "apply.field.story": "為什麼想上 Storys？",
    "apply.field.timing": "理想錄音時間",
    "apply.submit": "送出申請",

    // newsletter
    "news.title": "訂閱 Storys 電子報",
    "news.sub": "每當新一集上線，我們會寄一封簡短的信給你。",
    "news.placeholder": "你的 email",
    "news.submit": "訂閱",
    "news.success": "已訂閱，感謝！",

    // footer
    "footer.tag": "從第一步，到每一步 · first step to every step",
    "footer.copy": "© 2026 Storys Podcast · JJT Production",
    "footer.listenOn": "在這裡收聽",

    // category labels
    "cat.food": "餐飲",
    "cat.fashion": "時尚",
    "cat.wellness": "健康",
    "cat.tech": "科技",
    "cat.media": "媒體",
    "cat.travel": "旅遊",
    "cat.platform": "平台",
    "cat.community": "社群",
    "cat.retail": "零售",
    "cat.creator": "創作者",
    "cat.education": "教育",
    "cat.mobility": "移動",
    "cat.investment": "創投",
  },

  en: {
    "meta.title": "Storys — A Podcast for Founders",
    "meta.description": "Storys interviews the founders behind the brands we love. Map, episodes, the whole thing — here.",

    "nav.home": "Home",
    "nav.map": "Map",
    "nav.episodes": "Episodes",
    "nav.about": "About",
    "nav.team": "Team",
    "nav.contact": "Contact",
    "nav.apply": "Apply",
    "nav.online": "Online",

    "home.hero.eyebrow": "Storys Podcast · formerly 創業之聲",
    "home.hero.title": "First step,",
    "home.hero.titleAccent": "to every step.",
    "home.hero.titleEn": "從第一步，到每一步",
    "home.hero.sub": "We interview the founders behind the brands we love — from their very first step to every one after.",
    "home.hero.ctaListen": "Listen to Storys",
    "home.hero.ctaMap": "Open the map",
    "home.featured.title": "Featured brands",
    "home.featured.sub": "Tap any brand to see them on the map.",
    "home.featured.cta": "See all brands",
    "home.latest.title": "Latest episodes",
    "home.latest.cta": "All episodes",
    "home.about.title": "About Storys",
    "home.about.body": "We document the journey of founders — from unheard to heard.",
    "home.about.cta": "Meet the team",

    "map.title": "Retail Map",
    "map.titleEn": "實體據點地圖",
    "map.sub": "Tap any pin to open the brand, the Apple Podcasts episode, and Google Maps directions.",
    "map.searchPlaceholder": "Search brand or category…",
    "map.allCategories": "All",
    "map.locationLabel": "location",
    "map.locationsLabel": "locations",
    "map.directions": "Google Maps",
    "map.episode": "Listen to episode",
    "map.episodeShort": "EP",
    "map.website": "Visit site",
    "map.empty": "No brands match that search.",
    "map.brandCount": "brands",
    "map.locationCount": "locations",
    "map.featuredLabel": "Latest interview",

    "online.title": "Online Directory",
    "online.titleEn": "線上品牌",
    "online.sub": "Service companies, platforms, media and creators — no storefront, but every bit as worth knowing.",
    "online.episode": "Listen",
    "online.website": "Website",
    "online.episodes": "episodes",

    "episodes.title": "All Episodes",
    "episodes.sub": "Every founder we've interviewed. Tap to listen.",
    "episodes.listenApple": "Listen on Apple Podcasts",
    "episodes.listenSpotify": "Listen on Spotify",
    "episodes.subscribe": "Subscribe",
    "episodes.empty": "Episodes are syncing…",

    "about.eyebrow": "About Storys",
    "about.title": "Make it on the Storys Map.",
    "about.titleZh": "在 Storys Map 上，留下你的座標。",
    "about.body": "Storys Podcast (formerly 創業之聲) documents the journey of founders from their very first step to every one after. This map lets our listeners walk into the brands themselves — to support the people brave enough to begin, by stepping into the spaces they built.",
    "about.cta": "Listen to Storys Podcast",

    "team.title": "The Team",
    "team.sub": "Three voices in the studio.",

    "contact.title": "Contact Storys",
    "contact.sub": "Want to partner, sponsor, or pitch a guest? Drop us a line.",
    "contact.general.title": "General contact",
    "contact.sponsor.title": "Sponsor Storys",
    "contact.field.name": "Your name",
    "contact.field.email": "Email",
    "contact.field.message": "Message",
    "contact.field.company": "Company / brand",
    "contact.field.budget": "Estimated budget",
    "contact.field.window": "Ideal timing",
    "contact.submit": "Send",
    "contact.success": "Got it — thanks. We'll get back to you soon.",

    "apply.title": "Apply to be a guest",
    "apply.sub": "We'd love to hear about your brand. Fill in a short form and we'll be in touch.",
    "apply.field.brand": "Brand name",
    "apply.field.founder": "Founder name",
    "apply.field.website": "Website",
    "apply.field.story": "Why Storys?",
    "apply.field.timing": "Ideal recording window",
    "apply.submit": "Submit application",

    "news.title": "Subscribe to the Storys newsletter",
    "news.sub": "We'll send you a short note whenever a new episode lands.",
    "news.placeholder": "your@email.com",
    "news.submit": "Subscribe",
    "news.success": "Subscribed — thanks!",

    "footer.tag": "first step to every step · 從第一步，到每一步",
    "footer.copy": "© 2026 Storys Podcast · JJT Production",
    "footer.listenOn": "Listen on",

    "cat.food": "Food & Drink",
    "cat.fashion": "Fashion",
    "cat.wellness": "Wellness",
    "cat.tech": "Tech",
    "cat.media": "Media",
    "cat.travel": "Travel",
    "cat.platform": "Platform",
    "cat.community": "Community",
    "cat.retail": "Retail",
    "cat.creator": "Creator",
    "cat.education": "Education",
    "cat.mobility": "Mobility",
    "cat.investment": "Investment",
  },
};

export type I18nKey = keyof (typeof I18N)["zh"];

export function t(key: string, lang: Lang = "zh"): string {
  return I18N[lang]?.[key] ?? I18N.zh[key] ?? key;
}
