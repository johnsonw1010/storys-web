/* =========================================================
   Storys — Brand Data
   ---------------------------------------------------------
   This is the only file you need to edit when adding,
   updating, or correcting a brand. All pages auto-render
   from this list.
   ========================================================= */

export type Category =
  | "food"
  | "fashion"
  | "wellness"
  | "tech"
  | "media"
  | "travel"
  | "platform"
  | "community"
  | "retail"
  | "creator"
  | "education"
  | "mobility"
  | "investment";

export type BrandType = "retail" | "online";

export interface Location {
  nameZh: string;
  nameEn: string;
  addressZh: string;
  addressEn: string;
  lat: number;
  lng: number;
  gmaps?: string;
}

export interface Episode {
  num: number | null;
  titleZh: string;
  appleId: string | null;
}

export interface Brand {
  id: string;
  nameZh: string;
  nameEn: string;
  category: Category;
  type: BrandType;
  descZh: string;
  descEn: string;
  domain: string;
  website: string;
  episodes: Episode[];
  locations?: Location[];
  logo?: boolean;
  image?: string;
}

export const SHOW_ID = "1779337239";
export const SHOW_URL = `https://podcasts.apple.com/tw/podcast/id${SHOW_ID}`;

/**
 * Resolve a brand's display logo URL.
 *   - If the brand has a hand-curated PNG in public/brand/logos/{id}.png
 *     (marked via `logo: true` on the Brand), use that.
 *   - Otherwise fall back to a Google favicon for the brand's domain.
 */
export function brandLogoUrl(
  brand: Pick<Brand, "id" | "domain" | "logo">,
): string {
  return brand.logo
    ? `/brand/logos/${brand.id}.png`
    : `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`;
}

export const BRANDS: Brand[] = [
  // ============================================================
  // RETAIL — brands you can walk into and shop
  // ============================================================
  {
    id: "zhenfan",
    logo: true,
    nameZh: "真芳 碳烤吐司",
    nameEn: "Zhen Fang",
    category: "food",
    type: "retail",
    descZh: "把台式早餐做到極致的當代炭烤吐司品牌。",
    descEn: "A modern Taiwanese breakfast brand reimagining charcoal-grilled toast.",
    domain: "zhenfang.com.tw",
    website: "https://www.zhenfang.com.tw",
    episodes: [
      { num: 5, titleZh: "真芳炭烤土司｜創辦人 Russell 張文哲", appleId: "1000683093233" },
      { num: 6, titleZh: "真芳｜訪後收穫 & 觀眾提問", appleId: "1000684914835" },
    ],
    locations: [
      { nameZh: "信義創始店", nameEn: "Xinyi (Original)",
        addressZh: "台北市信義區忠孝東路四段559巷16弄17號",
        addressEn: "No. 17, Aly. 16, Ln. 559, Sec. 4, Zhongxiao E. Rd., Xinyi Dist., Taipei",
        lat: 25.042401, lng: 121.564244 },
      { nameZh: "民生松江店", nameEn: "Minsheng-Songjiang",
        addressZh: "台北市中山區民生東路二段129號",
        addressEn: "No. 129, Sec. 2, Minsheng E. Rd., Zhongshan Dist., Taipei",
        lat: 25.058086, lng: 121.532289 },
      { nameZh: "大安和平店", nameEn: "Da'an-Heping",
        addressZh: "台北市大安區和平東路二段209號",
        addressEn: "No. 209, Sec. 2, Heping E. Rd., Da'an Dist., Taipei",
        lat: 25.025193, lng: 121.542559 },
      { nameZh: "長安天津店", nameEn: "Chang'an-Tianjin",
        addressZh: "台北市中山區長安東路一段19號",
        addressEn: "No. 19, Sec. 1, Chang'an E. Rd., Zhongshan Dist., Taipei",
        lat: 25.049633, lng: 121.522984 },
      { nameZh: "民生敦北店", nameEn: "Minsheng-Dunbei",
        addressZh: "台北市松山區民生東路四段105號",
        addressEn: "No. 105, Sec. 4, Minsheng E. Rd., Songshan Dist., Taipei",
        lat: 25.058189, lng: 121.552629 },
      { nameZh: "內湖港墘店", nameEn: "Neihu-Gangqian",
        addressZh: "台北市內湖區港墘路169號",
        addressEn: "No. 169, Gangqian Rd., Neihu Dist., Taipei",
        lat: 25.076768, lng: 121.575348 },
    ],
  },

  {
    id: "vacanza",
    logo: true,
    nameZh: "Vacanza Accessory",
    nameEn: "Vacanza Accessory",
    category: "fashion",
    type: "retail",
    descZh: "以「日常感」聞名的台灣輕珠寶品牌，全台逾 30 個據點。",
    descEn: "A Taiwan-born jewelry label known for everyday-wearable design — 30+ locations nationwide.",
    domain: "vacanza.com.tw",
    website: "https://www.vacanza.com.tw",
    episodes: [
      { num: 9,  titleZh: "Vacanza｜創辦人 亦 & 蟲蟲 Part 1/5", appleId: "1000697737498" },
      { num: 10, titleZh: "Vacanza｜Part 2/5｜結識蟲蟲與品牌起源", appleId: "1000697737497" },
      { num: 11, titleZh: "Vacanza｜Part 3/5｜東區開店的真正原因", appleId: "1000698809014" },
      { num: 12, titleZh: "Vacanza｜Part 4/5｜三年成長五倍的秘訣", appleId: "1000698809074" },
      { num: 13, titleZh: "Vacanza｜Part 5/5｜夫妻共創與永續經營", appleId: "1000698809052" },
      { num: 14, titleZh: "Vacanza｜訪後收穫 & 觀眾提問", appleId: "1000699729058" },
    ],
    locations: [
      { nameZh: "Vacanza Lab 實驗店", nameEn: "Vacanza Lab",
        addressZh: "台北市中山區中山北路二段36巷37號1F",
        addressEn: "1F, No. 37, Ln. 36, Sec. 2, Zhongshan N. Rd., Zhongshan Dist., Taipei",
        lat: 25.054359, lng: 121.520707 },
      { nameZh: "Vacanza Crush", nameEn: "Vacanza Crush",
        addressZh: "台北市中山區中山北路二段42巷25號",
        addressEn: "No. 25, Ln. 42, Sec. 2, Zhongshan N. Rd., Zhongshan Dist., Taipei",
        lat: 25.054768, lng: 121.520851 },
      { nameZh: "Vacanza Tea Time 信義威秀", nameEn: "Vacanza Tea Time — Xinyi Vieshow",
        addressZh: "台北市信義區松壽路20號",
        addressEn: "No. 20, Songshou Rd., Xinyi Dist., Taipei",
        lat: 25.035641, lng: 121.567405 },
      { nameZh: "Vacanza Park 台北車站店", nameEn: "Vacanza Park — Taipei Station",
        addressZh: "台北市大同區承德路一段1號B1F",
        addressEn: "B1F, No. 1, Sec. 1, Chengde Rd., Datong Dist., Taipei",
        lat: 25.049090, lng: 121.516784 },
      { nameZh: "Vacanza Coffee Town 中山店", nameEn: "Vacanza Coffee Town",
        addressZh: "台北市大同區南京西路25巷4-1號",
        addressEn: "No. 4-1, Ln. 25, Nanjing W. Rd., Datong Dist., Taipei",
        lat: 25.053843, lng: 121.520279 },
      { nameZh: "誠品松菸概念店", nameEn: "Eslite Songshan",
        addressZh: "台北市信義區菸廠路88號2F",
        addressEn: "2F, No. 88, Yancang Rd., Xinyi Dist., Taipei",
        lat: 25.044737, lng: 121.561111 },
      { nameZh: "信義新光三越專櫃", nameEn: "Shin Kong Mitsukoshi Xinyi A8",
        addressZh: "台北市信義區松高路12號",
        addressEn: "No. 12, Songgao Rd., Xinyi Dist., Taipei",
        lat: 25.038813, lng: 121.566800 },
      { nameZh: "Lalaport 南港", nameEn: "Lalaport Nangang",
        addressZh: "台北市南港區經貿二路131號3F",
        addressEn: "3F, No. 131, Jingmao 2nd Rd., Nangang Dist., Taipei",
        lat: 25.059345, lng: 121.617583 },
    ],
  },

  {
    id: "backerfounder",
    logo: true,
    nameZh: "貝殼放大",
    nameEn: "Backer-Founder",
    category: "platform",
    type: "retail",
    descZh: "華語世界最大的群眾集資顧問公司，從 0 到 50 億的集資推手。",
    descEn: "The largest crowdfunding agency in the Chinese-speaking world — over NT$5B raised for clients.",
    domain: "backer-founder.com",
    website: "https://backer-founder.com",
    episodes: [
      { num: 15, titleZh: "貝殼放大｜創辦人 林大涵", appleId: "1000701804283" },
      { num: 16, titleZh: "貝殼放大｜訪後收穫 & 觀眾提問", appleId: "1000703674337" },
    ],
    locations: [
      { nameZh: "貝殼放大 總部", nameEn: "Backer-Founder HQ",
        addressZh: "台北市萬華區大理街132之7號1樓",
        addressEn: "1F, No. 132-7, Dali St., Wanhua Dist., Taipei",
        lat: 25.034068, lng: 121.496682 },
    ],
  },

  {
    id: "cofit",
    logo: true,
    nameZh: "Cofit 群健",
    nameEn: "Cofit",
    category: "wellness",
    type: "retail",
    descZh: "結合營養師與 AI 的個人化健康管理平台，全台最大線上營養師團隊。",
    descEn: "A personalized health platform combining registered dietitians with AI — Taiwan's largest online dietitian team.",
    domain: "cofit.me",
    website: "https://events.cofit.me",
    episodes: [
      { num: 19, titleZh: "Cofit & 初日醫學｜Part 1", appleId: "1000710194273" },
      { num: 23, titleZh: "Cofit｜主持人訪後收穫", appleId: "1000712363677" },
    ],
    locations: [
      { nameZh: "Cofit 總部", nameEn: "Cofit HQ",
        addressZh: "台北市中山區松江路363號12樓",
        addressEn: "12F, No. 363, Songjiang Rd., Zhongshan Dist., Taipei",
        lat: 25.063826, lng: 121.533458 },
    ],
  },

  {
    id: "appworks",
    logo: true,
    nameZh: "AppWorks 之初加速器",
    nameEn: "AppWorks",
    category: "investment",
    type: "retail",
    descZh: "大東南亞最大的新創加速器與創投，培育超過 500 家新創。",
    descEn: "Greater Southeast Asia's largest startup accelerator and venture capital — 500+ portfolio companies.",
    domain: "appworks.tw",
    website: "https://appworks.tw",
    episodes: [
      { num: 39, titleZh: "AppWorks｜創辦人 林之晨 Jamie", appleId: "1000736340024" },
      { num: 40, titleZh: "AppWorks 訪後回顧｜解讀 Jamie 林之晨", appleId: "1000738440284" },
    ],
    locations: [
      { nameZh: "AppWorks 辦公室", nameEn: "AppWorks Office",
        addressZh: "台北市信義區基隆路一段178號6F",
        addressEn: "6F, No. 178, Sec. 1, Keelung Rd., Xinyi Dist., Taipei",
        lat: 25.042394, lng: 121.564965 },
    ],
  },

  {
    id: "dengyi",
    logo: true,
    nameZh: "登義漢方",
    nameEn: "Dengyi",
    category: "wellness",
    type: "retail",
    descZh: "百年漢方藥行的當代轉譯，把中醫帶回日常。",
    descEn: "A century-old Chinese medicine house translated for modern daily life.",
    domain: "dengyi1985.com",
    website: "https://www.dengyi1985.com",
    episodes: [
      { num: 49, titleZh: "登義漢方｜營運長 吳孟宸", appleId: "1000758618871" },
      { num: 50, titleZh: "登義 訪後回顧｜從夕陽產業到百貨新星", appleId: "1000761504794" },
    ],
    locations: [
      { nameZh: "登義參藥行（新莊輔大店）", nameEn: "Dengyi (Xinzhuang Fu Jen)",
        addressZh: "新北市新莊區建福路59巷8號",
        addressEn: "No. 8, Ln. 59, Jianfu Rd., Xinzhuang Dist., New Taipei City",
        lat: 25.027264, lng: 121.427194 },
    ],
  },

  {
    id: "kure8",
    logo: true,
    nameZh: "KURE8 8酵茶",
    nameEn: "KURE8 Kombucha",
    category: "food",
    type: "retail",
    descZh: "全台首間主打康普茶的手搖飲料品牌，現拉精釀、微氣泡。",
    descEn: "Taiwan's first kombucha-led tea bar — small-batch brewed with sparkling fruit notes.",
    domain: "kure8kombucha.com",
    website: "https://www.kure8kombucha.com",
    episodes: [
      { num: 51, titleZh: "KURE8｜創辦人 Nehemiah", appleId: "1000764276375" },
    ],
    locations: [
      { nameZh: "大安復興店", nameEn: "Da'an-Fuxing Flagship",
        addressZh: "台北市大安區復興南路二段9號",
        addressEn: "No. 9, Sec. 2, Fuxing S. Rd., Da'an Dist., Taipei",
        lat: 25.032701, lng: 121.543793 },
      { nameZh: "南港店", nameEn: "Nangang",
        addressZh: "台北市南港區興東街3號",
        addressEn: "No. 3, Xingdong St., Nangang Dist., Taipei",
        lat: 25.055594, lng: 121.612945 },
      { nameZh: "大安忠孝店", nameEn: "Da'an-Zhongxiao",
        addressZh: "台北市大安區忠孝東路四段181巷7弄3號",
        addressEn: "No. 3, Aly. 7, Ln. 181, Sec. 4, Zhongxiao E. Rd., Da'an Dist., Taipei",
        lat: 25.042191, lng: 121.550946 },
    ],
  },

  {
    id: "chill-ice-bath",
    nameZh: "Chill Ice Bath",
    nameEn: "Chill",
    category: "wellness",
    type: "retail",
    descZh: "台灣第一家以冷熱療法為核心的恢復空間，由 Jacky 創立。",
    descEn: "Taiwan's first contrast-therapy recovery studio — founded by Jacky.",
    domain: "chilltaiwan.substack.com",
    website: "https://www.instagram.com/chill.taiwan/",
    episodes: [
      { num: null, titleZh: "Chill Ice Bath｜創辦人 Jacky", appleId: null },
    ],
    locations: [
      { nameZh: "Chill 大安店", nameEn: "Chill — Da'an",
        addressZh: "台北市大安區敦化南路二段63巷46號",
        addressEn: "No. 46, Ln. 63, Sec. 2, Dunhua S. Rd., Da'an Dist., Taipei",
        lat: 25.030889, lng: 121.551169 },
    ],
  },

  {
    id: "nubra",
    logo: true,
    nameZh: "NuBra 絕世好波",
    nameEn: "NuBra",
    category: "fashion",
    type: "retail",
    descZh: "風靡全球的隱形內衣品牌，在台灣以 nu9 經營專櫃與旗艦店。",
    descEn: "The globally-loved adhesive bra, operated in Taiwan as nu9 with department-store counters and a Xinyi flagship.",
    domain: "nu9.com.tw",
    website: "https://www.nu9.com.tw",
    episodes: [
      { num: 41, titleZh: "NuBra Taiwan｜創辦人 小慧姊", appleId: "1000740517642" },
      { num: 42, titleZh: "NuBra 訪後回顧｜解讀小慧姐", appleId: "1000742525950" },
    ],
    locations: [
      { nameZh: "NuBra 信義旗艦店", nameEn: "NuBra Xinyi Flagship",
        addressZh: "台北市信義區松高路12號2樓",
        addressEn: "2F, No. 12, Songgao Rd., Xinyi Dist., Taipei",
        lat: 25.038813, lng: 121.566800 },
    ],
  },

  // ============================================================
  // ONLINE — service companies, marketplaces, platforms, creators
  // ============================================================
  {
    id: "phrozen",
    logo: true,
    nameZh: "Phrozen 普羅森",
    nameEn: "Phrozen",
    category: "tech",
    type: "online",
    descZh: "全球領先的 LCD 3D 列印機品牌，總部位於新竹。",
    descEn: "A leading global LCD 3D printer brand, headquartered in Hsinchu.",
    domain: "phrozen3d.com",
    website: "https://phrozen3d.com",
    episodes: [
      { num: 1, titleZh: "Phrozen 普羅森｜創辦人 Ray 吳彞任", appleId: "1000676700378" },
      { num: 2, titleZh: "Phrozen｜訪後收穫 & 聽眾提問", appleId: "1000678337524" },
    ],
  },

  {
    id: "tixcraft",
    logo: true,
    nameZh: "拓元售票 tixCraft",
    nameEn: "tixCraft",
    category: "platform",
    type: "online",
    descZh: "台灣最大的售票平台之一，承接無數演唱會與表演。",
    descEn: "One of Taiwan's largest ticketing platforms, powering countless live shows.",
    domain: "tixcraft.com",
    website: "https://tixcraft.com",
    episodes: [
      { num: 3, titleZh: "拓元售票｜創辦人 KT", appleId: "1000679943845" },
      { num: 4, titleZh: "拓元售票｜訪後收穫 & 聽眾提問", appleId: "1000681602676" },
    ],
  },

  {
    id: "kkday",
    logo: true,
    nameZh: "KKday 酷遊天",
    nameEn: "KKday",
    category: "travel",
    type: "online",
    descZh: "亞洲領先的旅遊體驗預訂平台，總部位於台北。",
    descEn: "Asia's leading travel-experiences marketplace, headquartered in Taipei.",
    domain: "kkday.com",
    website: "https://www.kkday.com",
    episodes: [
      { num: 7, titleZh: "酷遊天 KKday｜創辦人 陳明明", appleId: "1000689073825" },
      { num: 8, titleZh: "KKday｜訪後收穫 & 觀眾提問", appleId: "1000693768117" },
    ],
  },

  {
    id: "4foodie",
    logo: true,
    nameZh: "4Foodie",
    nameEn: "4Foodie",
    category: "media",
    type: "online",
    descZh: "美食愛好者的內容社群，從 IG 起家的吃貨宇宙。",
    descEn: "A food-lover's content community born on Instagram.",
    domain: "instagram.com",
    website: "https://www.instagram.com/4foodie",
    episodes: [
      { num: 17, titleZh: "4Foodie｜創辦人 徐詩晴 Ava", appleId: "1000705474928" },
      { num: 18, titleZh: "4Foodie｜訪後收穫 & 觀眾提問", appleId: "1000708387751" },
    ],
  },

  {
    id: "cyberbiz",
    logo: true,
    nameZh: "CYBERBIZ 順立智慧",
    nameEn: "CYBERBIZ",
    category: "platform",
    type: "online",
    descZh: "全方位的台灣電商開店平台，賦能上萬個品牌。",
    descEn: "A full-stack Taiwanese e-commerce platform empowering thousands of brands.",
    domain: "cyberbiz.io",
    website: "https://www.cyberbiz.io",
    episodes: [
      { num: 24, titleZh: "CYBERBIZ｜Part 1", appleId: "1000714418540" },
      { num: 29, titleZh: "CYBERBIZ｜主持人訪後收穫", appleId: "1000716398883" },
    ],
  },

  {
    id: "popdaily",
    logo: true,
    nameZh: "PopDaily 波波黛莉",
    nameEn: "PopDaily",
    category: "media",
    type: "online",
    descZh: "台灣女性世代最大的生活媒體與社群。",
    descEn: "Taiwan's largest lifestyle media platform for the next-gen female audience.",
    domain: "popdaily.com.tw",
    website: "https://www.popdaily.com.tw",
    episodes: [
      { num: 30, titleZh: "PopDaily & 阿金人生進化中｜創辦人", appleId: "1000718528705" },
      { num: 31, titleZh: "PopDaily 訪後收穫 & 十場訪談回顧", appleId: "1000720813139" },
    ],
  },

  {
    id: "pressplay",
    logo: true,
    nameZh: "PressPlay",
    nameEn: "PressPlay",
    category: "creator",
    type: "online",
    descZh: "華語最大的創作者訂閱與課程平台。",
    descEn: "The largest Chinese-language creator subscription and course platform.",
    domain: "pressplay.cc",
    website: "https://www.pressplay.cc",
    episodes: [
      { num: 32, titleZh: "PressPlay｜共同創辦人 林鼎鈞 Dennis", appleId: "1000722716287" },
      { num: 33, titleZh: "PressPlay 訪後 & Storys 品牌 Rebrand", appleId: "1000724645734" },
    ],
  },

  {
    id: "speak",
    nameZh: "Speak",
    nameEn: "Speak",
    category: "education",
    type: "online",
    descZh: "用 AI 對話練習口說的英文學習 app，由 12 歲上大學的天才創辦。",
    descEn: "An AI-powered conversational English-learning app — co-founded by a child prodigy who entered college at 12.",
    domain: "speak.com",
    website: "https://www.speak.com",
    episodes: [
      { num: 34, titleZh: "Speak｜Cofounder & CTO Andrew Hsu", appleId: "1000727120488" },
      { num: 36, titleZh: "He Wrote a Book at 13… Now Building $1B AI", appleId: "1000729417747" },
      { num: 43, titleZh: "12 歲上大學的 AI 傳奇｜Andrew Hsu", appleId: "1000744368136" },
    ],
  },

  {
    id: "wemo",
    logo: true,
    nameZh: "WeMo Scooter",
    nameEn: "WeMo Scooter",
    category: "mobility",
    type: "online",
    descZh: "台灣首個共享電動機車服務，城市移動的綠色解方。",
    descEn: "Taiwan's first shared e-scooter service — sustainable urban mobility.",
    domain: "wemoscooter.com",
    website: "https://www.wemoscooter.com",
    episodes: [
      { num: 37, titleZh: "WeMo｜共同創辦人 吳昕霈 Jeffrey", appleId: "1000731878500" },
      { num: 38, titleZh: "WeMo 訪後回顧 & 討論", appleId: "1000733944393" },
    ],
  },

  {
    id: "nunox",
    logo: true,
    nameZh: "NunoX",
    nameEn: "NunoX",
    category: "tech",
    type: "online",
    descZh: "用 AI 把布料數位化的 SaaS，重塑紡織業數位流程。",
    descEn: "An AI SaaS digitizing textiles — transforming how the apparel industry works.",
    domain: "nunox.ai",
    website: "https://nunox.ai",
    episodes: [
      { num: 44, titleZh: "NunoX｜創辦人 謝賀祥 Jac", appleId: "1000746018831" },
      { num: 45, titleZh: "NunoX 訪後回顧｜解讀 Jac 謝賀祥", appleId: "1000747996663" },
    ],
  },

  {
    id: "megan",
    nameZh: "Megan Chang",
    nameEn: "Megan Chang",
    category: "creator",
    type: "online",
    descZh: "Soft Skill Savant — 把職場軟實力說得既誠實又有力的創作者。",
    descEn: "Soft Skill Savant — a creator translating workplace soft skills with honesty and power.",
    domain: "softskillsavant.com",
    website: "https://www.softskillsavant.com",
    episodes: [
      { num: 47, titleZh: "Megan｜揭秘 10 年創業韌性", appleId: "1000753021284" },
      { num: 48, titleZh: "Megan 訪後回顧｜國民閨密的真實力", appleId: "1000755928779" },
    ],
  },
];
