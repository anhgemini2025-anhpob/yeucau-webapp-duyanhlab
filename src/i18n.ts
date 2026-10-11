export type LangCode = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

export interface LangMeta {
  code: LangCode;
  badge: string;
  shortLabel: string;
  fullName: string;
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LangMeta[] = [
  { code: 'vi', badge: 'VI', shortLabel: 'Tiếng Việt', fullName: 'Tiếng Việt', speechLang: 'vi-VN' },
  { code: 'en', badge: 'EN', shortLabel: 'English', fullName: 'English (Tiếng Anh)', speechLang: 'en-US' },
  { code: 'zh', badge: 'ZH', shortLabel: '中文 (Hoa)', fullName: '中文 (Tiếng Hoa)', speechLang: 'zh-CN' },
  { code: 'ja', badge: 'JA', shortLabel: '日本語 (Nhật)', fullName: '日本語 (Tiếng Nhật)', speechLang: 'ja-JP' },
  { code: 'ko', badge: 'KO', shortLabel: '한국어 (Hàn)', fullName: '한국어 (Tiếng Hàn)', speechLang: 'ko-KR' }
];

export const APP_TARGET_LANGUAGES: Record<LangCode, string[]> = {
  vi: ['Tiếng Việt', 'Tiếng Anh (English)', 'Tiếng Hoa (中文)', 'Tiếng Nhật (日本語)', 'Tiếng Hàn (한국어)'],
  en: ['Vietnamese', 'English', 'Chinese (中文)', 'Japanese (日本語)', 'Korean (한국어)'],
  zh: ['越南语 (Tiếng Việt)', '英语 (English)', '中文 (华语)', '日语 (日本語)', '韩语 (한국어)'],
  ja: ['ベトナム語', '英語 (English)', '中国語 (中文)', '日本語', '韓国語 (한국어)'],
  ko: ['베트남어', '영어 (English)', '중국어 (中文)', '일본어 (日本語)', '한국어']
};

export const WORLD_LANGUAGES_LIST: string[] = [
  '🌐 Đa ngôn ngữ toàn cầu (Tất cả 100+ ngôn ngữ)',
  'Tiếng Pháp (Français / French)',
  'Tiếng Đức (Deutsch / German)',
  'Tiếng Nga (Русский / Russian)',
  'Tiếng Tây Ban Nha (Español / Spanish)',
  'Tiếng Bồ Đào Nha (Português / Portuguese)',
  'Tiếng Ý (Italiano / Italian)',
  'Tiếng Thái (ภาษาไทย / Thai)',
  'Tiếng Lào (ພາສາລາວ / Lao)',
  'Tiếng Campuchia (ភាសាខ្មែរ / Khmer)',
  'Tiếng Indonesia (Bahasa Indonesia)',
  'Tiếng Mã Lai (Bahasa Melayu / Malay)',
  'Tiếng Philippines (Tagalog / Filipino)',
  'Tiếng Myanmar (မြန်မာဘာသာ / Burmese)',
  'Tiếng Ấn Độ (हिन्दी / Hindi)',
  'Tiếng Ả Rập (العربية / Arabic)',
  'Tiếng Hà Lan (Nederlands / Dutch)',
  'Tiếng Ba Lan (Polski / Polish)',
  'Tiếng Thổ Nhĩ Kỳ (Türkçe / Turkish)',
  'Tiếng Thụy Điển (Svenska / Swedish)',
  'Tiếng Đan Mạch (Dansk / Danish)',
  'Tiếng Na Uy (Norsk / Norwegian)',
  'Tiếng Phần Lan (Suomi / Finnish)',
  'Tiếng Séc (Čeština / Czech)',
  'Tiếng Hungary (Magyar / Hungarian)',
  'Tiếng Hy Lạp (Ελληνικά / Greek)',
  'Tiếng Do Thái (עברית / Hebrew)',
  'Tiếng Ba Tư (فارسی / Persian)',
  'Tiếng Ukraina (Українська / Ukrainian)',
  'Tiếng Rumani (Română / Romanian)',
  'Tiếng Bulgaria (Български / Bulgarian)',
  'Tiếng Croatia (Hrvatski / Croatian)',
  'Tiếng Serbia (Српски / Serbian)',
  'Tiếng Slovakia (Slovenčina / Slovak)',
  'Tiếng Slovenia (Slovenščina / Slovenian)',
  'Tiếng Băng Đảo (Íslenska / Icelandic)',
  'Tiếng Quốc tế (Esperanto)',
  'Tiếng Bengali (বাংলা / Bengali)',
  'Tiếng Urdu (اردو / Urdu)',
  'Tiếng Tamil (தமிழ் / Tamil)',
  'Tiếng Nepal (नेपाली / Nepali)',
  'Tiếng Sinhala (සිංහල / Sri Lanka)',
  'Tiếng Mông Cổ (Монгол / Mongolian)',
  'Tiếng Kazakh (Қазақ тілі / Kazakh)',
  'Tiếng Uzbek (Oʻzbek / Uzbek)',
  'Tiếng Swahili (Kiswahili / Châu Phi)',
  'Tiếng Afrikaans (Nam Phi)'
];
