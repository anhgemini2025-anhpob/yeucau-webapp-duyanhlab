export type LangCode = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

export interface LangMeta {
  code: LangCode;
  flag: string;
  shortLabel: string;
  fullName: string;
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LangMeta[] = [
  { code: 'vi', flag: '🇻🇳', shortLabel: 'Việt', fullName: 'Tiếng Việt', speechLang: 'vi-VN' },
  { code: 'en', flag: '🇬🇧', shortLabel: 'Anh (EN)', fullName: 'English (Tiếng Anh)', speechLang: 'en-US' },
  { code: 'zh', flag: '🇨🇳', shortLabel: 'Hoa (中文)', fullName: '中文 (Tiếng Hoa)', speechLang: 'zh-CN' },
  { code: 'ja', flag: '🇯🇵', shortLabel: 'Nhật (日本語)', fullName: '日本語 (Tiếng Nhật)', speechLang: 'ja-JP' },
  { code: 'ko', flag: '🇰🇷', shortLabel: 'Hàn (한국어)', fullName: '한국어 (Tiếng Hàn)', speechLang: 'ko-KR' }
];

export const APP_TARGET_LANGUAGES: Record<LangCode, string[]> = {
  vi: ['🇻🇳 Tiếng Việt', '🇬🇧 Tiếng Anh (English)', '🇨🇳 Tiếng Hoa (中文)', '🇯🇵 Tiếng Nhật (日本語)', '🇰🇷 Tiếng Hàn (한국어)'],
  en: ['🇻🇳 Vietnamese', '🇬🇧 English', '🇨🇳 Chinese (中文)', '🇯🇵 Japanese (日本語)', '🇰🇷 Korean (한국어)'],
  zh: ['🇻🇳 越南语', '🇬🇧 英语 (English)', '🇨🇳 中文 (华语)', '🇯🇵 日语 (日本語)', '🇰🇷 韩语 (한국어)'],
  ja: ['🇻🇳 ベトナム語', '🇬🇧 英語 (English)', '🇨🇳 中国語 (中文)', '🇯🇵 日本語', '🇰🇷 韓国語 (한국어)'],
  ko: ['🇻🇳 베트남어', '🇬🇧 영어 (English)', '🇨🇳 중국어 (中文)', '🇯🇵 일본어 (日本語)', '🇰🇷 한국어']
};

export interface PresetItem {
  id: string;
  label: string;
  projectName: string;
  painPointsIdx: number[];
  goalsIdx: number[];
  infraIdx: number[];
  scaleIdx: number[];
  securityIdx: number[];
  styleIdx: number;
  customNote: string;
}

export interface RoleTranslation {
  id: string;
  name: string;
  count: string;
  permissions: string;
}

export interface TranslationDict {
  headerBadge: string;
  headerTitle: string;
  quickPresetLabel: string;
  resetBtn: string;
  previewA4Btn: string;
  printA4Btn: string;
  downloadPdfBtn: string;
  generatingPdf: string;
  sendEmailBtn: string;
  sendZaloBtn: string;
  uiLangLabel: string;

  // Section 1
  sec1Title: string;
  sec1Badge: string;
  companyLabel: string;
  companyPlaceholder: string;
  contactLabel: string;
  contactPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  projectLabel: string;
  projectPlaceholder: string;
  timelineLabel: string;
  timelineOptions: string[];

  // Section 2
  sec2Title: string;
  sec2Badge: string;
  painPointsLabel: string;
  painPointsOptions: string[];
  goalsLabel: string;
  goalsOptions: string[];
  customNoteLabel: string;
  customNotePlaceholder: string;
  dictateBtn: string;
  dictatingBtn: string;

  // Section 3
  sec3Title: string;
  sec3Badge: string;
  infraLabel: string;
  infraOptions: string[];
  scaleLabel: string;
  scaleOptions: string[];
  securityLabel: string;
  securityOptions: string[];
  styleLabel: string;
  styleOptions: string[];
  appLangLabel: string;

  // Section 4
  sec4Title: string;
  sec4Badge: string;
  roleQtyLabel: string;
  rolePermPlaceholder: string;
  defaultRoles: RoleTranslation[];

  // Section 5
  sec5Title: string;
  sec5Badge: string;
  recordVoiceTitle: string;
  recordVoiceSub: string;
  stopRecordingBtn: string;
  recordingSub: string;
  cameraTitle: string;
  cameraSub: string;
  attachTitle: string;
  attachSub: string;
  downloadAudioBtn: string;
  capturedImagesLabel: string;
  addMorePhotoBtn: string;
  docTypesLabel: string;
  docTypesOptions: string[];
  refLinkPlaceholder: string;

  // Section 6
  sec6Title: string;
  sec6Badge: string;
  sec6Desc: string;
  quickShareBtn: string;
  deviceBadge: string;
  wordTemplateBtn: string;

  // Footer
  footerDesc: string;

  // A4 Print Sheet
  a4PreviewBanner: string;
  a4PreviewSub: string;
  a4CloseBtn: string;
  a4HeaderSub: string;
  a4MainTitle: string;
  a4DateLabel: string;
  a4EcosystemTitle: string;
  a4Sec1Title: string;
  a4Sec2Title: string;
  a4Sec3Title: string;
  a4Sec4Title: string;
  a4Sec5Title: string;
  a4ColInfra: string;
  a4ColScale: string;
  a4ColSec: string;
  a4RoleCol: string;
  a4QtyCol: string;
  a4PermCol: string;
  a4NotUsed: string;
  a4AudioAndFiles: string;
  a4RefLink: string;
  a4AttachedPhotos: string;
  a4FooterTitle: string;
  a4FooterExplore: string;
  a4FooterDomains: string;
  a4FooterContact: string;

  // Presets
  presets: PresetItem[];
}

export const TRANSLATIONS: Record<LangCode, TranslationDict> = {
  vi: {
    headerBadge: '1-Page Smart Brief',
    headerTitle: 'PHIẾU YÊU CẦU THIẾT KẾ WEB & ỨNG DỤNG',
    quickPresetLabel: 'Mẫu nhanh:',
    resetBtn: 'Làm mới',
    previewA4Btn: 'Xem A4',
    printA4Btn: 'In A4',
    downloadPdfBtn: 'Tải PDF',
    generatingPdf: 'Đang tạo...',
    sendEmailBtn: 'Gửi Email',
    sendZaloBtn: 'Gửi Zalo',
    uiLangLabel: 'Ngôn ngữ:',

    sec1Title: '1. Thông tin Liên hệ & Dự án',
    sec1Badge: 'Điền cực ngắn',
    companyLabel: 'Tên Doanh nghiệp / Tổ chức',
    companyPlaceholder: 'VD: Công ty ABC / Cá nhân...',
    contactLabel: 'Người đại diện / Liên hệ',
    contactPlaceholder: 'VD: Anh Minh / Chị Lan...',
    phoneLabel: 'SĐT / Zalo nhận phản hồi *',
    phonePlaceholder: 'VD: 0908 xxx xxx',
    emailLabel: 'Email (Nếu có)',
    emailPlaceholder: 'VD: ten@congty.com',
    projectLabel: 'Tên Web App dự kiến / Lĩnh vực',
    projectPlaceholder: 'VD: App Quản lý Hợp đồng, Báo cáo Thuế HKD, Trợ lý AI...',
    timelineLabel: 'Tiến độ & Phương án triển khai mong muốn:',
    timelineOptions: [
      '⚡ Cần gấp (3 - 7 ngày)',
      '📅 Tiêu chuẩn (2 - 4 tuần)',
      '🚀 Phát triển theo giai đoạn',
      '💡 Tư vấn phương án tối ưu'
    ],

    sec2Title: '2. Hiện trạng & Mục tiêu Kỳ vọng',
    sec2Badge: 'Chạm để chọn',
    painPointsLabel: 'Khó khăn hiện tại cần giải quyết (Pain points):',
    painPointsOptions: [
      'Excel / Sổ sách rời rạc',
      'Mất thời gian tổng hợp báo cáo',
      'Khó kiểm soát tiến độ & nhân sự',
      'Chưa có công cụ AI hỗ trợ chuyên môn',
      'Khách hàng khó đặt lịch / tra cứu',
      'Phần mềm cũ chậm, khó dùng trên ĐT'
    ],
    goalsLabel: 'Mục tiêu kỳ vọng lớn nhất khi làm Web App:',
    goalsOptions: [
      'Tự động hóa quy trình 80-90%',
      'Quản lý tập trung Real-time',
      'Trợ lý AI tư vấn / R&D / Phân tích',
      'Khách tự đặt lịch / Tra cứu dễ dàng',
      'Dashboard biểu đồ trực quan',
      'Tăng uy tín & Chuyển đổi khách hàng'
    ],
    customNoteLabel: 'Ý tưởng cốt lõi / Yêu cầu riêng (Must-have):',
    customNotePlaceholder: 'Gõ ngắn gọn 1-2 câu, hoặc bấm Đọc thành chữ / Ghi âm ở cột phải...',
    dictateBtn: 'Đọc thành chữ',
    dictatingBtn: 'Đang nghe...',

    sec3Title: '3. Kỹ thuật, Ngôn ngữ & Giao diện',
    sec3Badge: 'Đa thiết bị',
    infraLabel: 'Hạ tầng, Dữ liệu & Tiện ích:',
    infraOptions: [
      'Cloud (Đám mây - Khuyên dùng)',
      'Máy chủ nội bộ (Local/On-premise)',
      'Dữ liệu Real-time (Tức thời)',
      'Xuất Excel / In PDF chuẩn A4',
      'Kết nối Zalo / Email / VietQR'
    ],
    scaleLabel: 'Quy mô & Nền tảng sử dụng:',
    scaleOptions: [
      'Đa thiết bị (ĐT, iPad, Laptop)',
      'Dưới 100 người dùng/lúc',
      '100 - 1.000 người dùng/lúc',
      'Trên 1.000 người dùng/lúc'
    ],
    securityLabel: 'Bảo mật & Tiêu chuẩn:',
    securityOptions: [
      'Mã hóa mật khẩu / Phân quyền',
      'Xác thực 2 lớp (OTP/Email)',
      'Lưu vết lịch sử thao tác (Log)',
      'Tiêu chuẩn riêng (Tài chính / Y tế)'
    ],
    styleLabel: 'Phong cách giao diện:',
    styleOptions: [
      'Sang trọng (Navy & Gold)',
      'Hiện đại Sáng sủa (Clean SaaS)',
      'Dashboard Dữ liệu Chuyên sâu',
      'Theo màu Thương hiệu riêng'
    ],
    appLangLabel: 'Ngôn ngữ tích hợp trong Web App (Chọn 1 hoặc nhiều):',

    sec4Title: '4. Phân quyền Người dùng (Roles)',
    sec4Badge: 'Tích & sửa nhanh',
    roleQtyLabel: 'SL:',
    rolePermPlaceholder: 'Quyền hạn chính (Xem, Thêm, Sửa, Xóa, Duyệt...)',
    defaultRoles: [
      {
        id: 'admin',
        name: 'Admin (Quản trị)',
        count: '1 - 2',
        permissions: 'Toàn quyền cấu hình hệ thống, phân quyền, quản lý dữ liệu & báo cáo tổng'
      },
      {
        id: 'manager',
        name: 'Quản lý (Manager)',
        count: '2 - 5',
        permissions: 'Xem Dashboard, duyệt yêu cầu/báo cáo, kiểm soát công việc bộ phận'
      },
      {
        id: 'staff',
        name: 'Nhân viên (Staff)',
        count: '5 - 30',
        permissions: 'Nhập liệu, xử lý nghiệp vụ hàng ngày theo quyền được giao'
      },
      {
        id: 'customer',
        name: 'Khách hàng / Đối tác',
        count: 'Tự do',
        permissions: 'Tra cứu thông tin, gửi yêu cầu, đặt lịch hoặc tải kết quả PDF'
      }
    ],

    sec5Title: '5. Ghi âm, Chụp hình & Đính kèm',
    sec5Badge: 'Không cần gõ nhiều!',
    recordVoiceTitle: 'Ghi âm Yêu cầu',
    recordVoiceSub: 'Nói trực tiếp',
    stopRecordingBtn: 'Dừng',
    recordingSub: 'Đang thu âm...',
    cameraTitle: 'Chụp ảnh Mẫu',
    cameraSub: 'Mở Camera / Ảnh',
    attachTitle: 'Đính kèm File',
    attachSub: 'Excel, Word, Ảnh',
    downloadAudioBtn: 'Tải file',
    capturedImagesLabel: 'Ảnh chụp / Mẫu đính kèm (Tự động in vào A4):',
    addMorePhotoBtn: '+ Thêm ảnh',
    docTypesLabel: 'Tài liệu sẵn có để ánh xạ (Mapping) quy trình & dữ liệu:',
    docTypesOptions: [
      'File Excel / Google Sheets đang dùng',
      'Quy trình làm việc (Word / Flowchart)',
      'Biểu mẫu giấy đang dùng (Chụp ảnh)',
      'Ảnh chụp màn hình phần mềm cũ',
      'Bản vẽ tay ý tưởng / Trang web mẫu'
    ],
    refLinkPlaceholder: '🔗 Dán link web mẫu hoặc Google Drive (Có thể bấm Ctrl+V dán ảnh)...',

    sec6Title: '🚀 Hoàn tất & Gửi Yêu Cầu Ngay',
    sec6Badge: 'Phản hồi 24/7',
    sec6Desc: 'Sau khi chọn xong, bạn có thể In / Xuất gọn 1 trang PDF A4 hoặc gửi trực tiếp kèm file ghi âm & hình ảnh qua Email hoặc Zalo:',
    quickShareBtn: 'Đính kèm nhanh',
    deviceBadge: 'Điện thoại • iPad • Laptop • Máy ảnh',
    wordTemplateBtn: 'Mẫu Word (.docx)',

    footerDesc: 'Hệ sinh thái Web App chuyên sâu & Giải pháp AI thực chiến (Báo cáo thuế HKD, R&D Mỹ phẩm & F&B, Quản lý Hợp đồng, SCM, ERP Nông nghiệp, Đào tạo & Trợ lý Ngân hàng).',

    a4PreviewBanner: '📄 Xem trước Bản In Chuẩn 1 Trang Giấy A4',
    a4PreviewSub: '(Tự động căn vừa khít 1 trang A4 khi In hoặc Xuất PDF)',
    a4CloseBtn: 'Đóng',
    a4HeaderSub: 'Tiếp nhận & Tư vấn: anhpob@gmail.com | Zalo / Hotline: +84 908 095693',
    a4MainTitle: 'BẢNG YÊU CẦU THIẾT KẾ ỨNG DỤNG WEB (WEB APP BRIEF)',
    a4DateLabel: 'Ngày lập',
    a4EcosystemTitle: 'HỆ SINH THÁI WEB APP',
    a4Sec1Title: '1. Thông tin chung & Liên hệ',
    a4Sec2Title: '2. Hiện trạng & Bài toán cần giải quyết',
    a4Sec3Title: '3. Yêu cầu Kỹ thuật, Ngôn ngữ & Phong cách Giao diện',
    a4Sec4Title: '4. Phân quyền Người dùng (Roles & Permissions)',
    a4Sec5Title: '5. Tài liệu Đính kèm, Ghi âm & Hình ảnh Tham khảo',
    a4ColInfra: 'Hạ tầng & Dữ liệu',
    a4ColScale: 'Quy mô & Ngôn ngữ App',
    a4ColSec: 'Bảo mật & Giao diện',
    a4RoleCol: 'Vai trò (Role)',
    a4QtyCol: 'Số lượng',
    a4PermCol: 'Quyền hạn chính (Xem, Thêm, Sửa, Xóa, Duyệt báo cáo...)',
    a4NotUsed: 'Không sử dụng',
    a4AudioAndFiles: '• Ghi âm & File đính kèm: ',
    a4RefLink: '• Link tham khảo / Drive: ',
    a4AttachedPhotos: '• Hình ảnh chụp / Giao diện mẫu đính kèm:',
    a4FooterTitle: 'DUY ANH DIGITAL LAB — HỆ SINH THÁI ỨNG DỤNG WEB CHUYÊN SÂU & GIẢI PHÁP AI',
    a4FooterExplore: 'Khám phá các dự án thực tế tại:',
    a4FooterDomains: 'Lĩnh vực tiêu biểu: Báo cáo Thuế HKD • AI Advisor & Đào tạo • R&D Mỹ phẩm & F&B • Quản lý Hợp đồng & SCM • ERP Nông nghiệp • Trợ lý Ngân hàng.',
    a4FooterContact: 'LIÊN HỆ TRIỂN KHAI',

    presets: [
      {
        id: 'erp',
        label: '🏢 Quản lý DN / Hợp đồng',
        projectName: 'Hệ thống Quản lý Hợp đồng & Vận hành Doanh nghiệp',
        painPointsIdx: [0, 1, 2],
        goalsIdx: [0, 1, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 1],
        securityIdx: [0, 2],
        styleIdx: 0,
        customNote: 'Cần quản lý khách hàng, hợp đồng, nhắc việc tự động và xuất phiếu/báo cáo chuẩn trên 1 trang A4.'
      },
      {
        id: 'tax',
        label: '📊 Thuế HKD / Tài chính',
        projectName: 'Ứng dụng Quản lý Doanh thu & Báo cáo Thuế Hộ Kinh Doanh',
        painPointsIdx: [0, 1],
        goalsIdx: [0, 4, 5],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 1],
        securityIdx: [0, 3],
        styleIdx: 1,
        customNote: 'Tự động tổng hợp sổ doanh thu, chi phí, xuất tờ khai / báo cáo thuế nhanh gọn và chính xác.'
      },
      {
        id: 'ai',
        label: '🤖 Trợ lý AI / R&D',
        projectName: 'Hệ thống AI Advisor Tư vấn Chuyên môn & Tra cứu Công thức',
        painPointsIdx: [3, 4],
        goalsIdx: [2, 1, 5],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0],
        styleIdx: 0,
        customNote: 'Tích hợp AI tra cứu dữ liệu chuyên ngành (Mỹ phẩm / F&B / Y tế / Ngân hàng), gợi ý giải pháp và xuất báo cáo.'
      },
      {
        id: 'crm',
        label: '🛒 Bán hàng / CRM',
        projectName: 'Web App Đặt lịch Dịch vụ & Chăm sóc Khách hàng CRM',
        painPointsIdx: [4, 0],
        goalsIdx: [3, 5, 0],
        infraIdx: [0, 2, 4],
        scaleIdx: [0, 2],
        securityIdx: [0, 1],
        styleIdx: 3,
        customNote: 'Khách hàng thao tác siêu nhanh trên điện thoại, đặt yêu cầu/lịch hẹn và nhận thông báo qua Zalo/Email.'
      },
      {
        id: 'edu',
        label: '🎓 Đào tạo / E-Learning',
        projectName: 'Nền tảng Đào tạo Nội bộ, Học & Thi Trực tuyến Thông minh',
        painPointsIdx: [2, 3],
        goalsIdx: [0, 2, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0, 2],
        styleIdx: 1,
        customNote: 'Hỗ trợ bài giảng tương tác, phát âm / ghi âm, chấm điểm tự động và theo dõi năng lực học viên.'
      },
      {
        id: 'landing',
        label: '🌐 Landing Page Cao cấp',
        projectName: 'Landing Page Giới thiệu Thương hiệu & Thu thập Yêu cầu Khách hàng',
        painPointsIdx: [4, 5],
        goalsIdx: [5, 3],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 3],
        securityIdx: [0],
        styleIdx: 0,
        customNote: 'Thiết kế sang trọng trên 1 màn hình, tương thích mọi thiết bị, cho phép khách gửi yêu cầu hoặc in 1 trang A4.'
      }
    ]
  },

  en: {
    headerBadge: '1-Page Smart Brief',
    headerTitle: 'WEB & APPLICATION DESIGN REQUEST BRIEF',
    quickPresetLabel: 'Quick Templates:',
    resetBtn: 'Reset',
    previewA4Btn: 'A4 Preview',
    printA4Btn: 'Print A4',
    downloadPdfBtn: 'Save PDF',
    generatingPdf: 'Generating...',
    sendEmailBtn: 'Send Email',
    sendZaloBtn: 'Send Zalo',
    uiLangLabel: 'Language:',

    sec1Title: '1. Contact & Project Info',
    sec1Badge: 'Quick Fill',
    companyLabel: 'Company / Organization Name',
    companyPlaceholder: 'e.g., ABC Corp / Personal...',
    contactLabel: 'Contact Person',
    contactPlaceholder: 'e.g., Mr. John / Ms. Anna...',
    phoneLabel: 'Phone / Zalo / WhatsApp *',
    phonePlaceholder: 'e.g., +84 908 xxx xxx',
    emailLabel: 'Email Address',
    emailPlaceholder: 'e.g., name@company.com',
    projectLabel: 'Expected Web App Name / Industry',
    projectPlaceholder: 'e.g., Contract ERP, Tax Reporting App, AI Advisor...',
    timelineLabel: 'Expected Timeline & Delivery Plan:',
    timelineOptions: [
      '⚡ Urgent (3 - 7 days)',
      '📅 Standard (2 - 4 weeks)',
      '🚀 Phased Development',
      '💡 Recommend Optimal Plan'
    ],

    sec2Title: '2. Current Challenges & Goals',
    sec2Badge: 'Tap to Select',
    painPointsLabel: 'Current Challenges to Solve (Pain points):',
    painPointsOptions: [
      'Scattered Excel / Manual Paperwork',
      'Time-consuming Report Compilation',
      'Hard to Track Progress & Staff',
      'Lack of Specialized AI Assistant',
      'Hard for Clients to Book / Lookup',
      'Legacy Software Slow on Mobile'
    ],
    goalsLabel: 'Primary Expected Goals for this Web App:',
    goalsOptions: [
      'Automate 80-90% of Workflows',
      'Centralized Real-time Management',
      'AI Advisor / R&D / Smart Analytics',
      'Self-Service Client Booking / Lookup',
      'Visual Executive Dashboards',
      'Boost Brand Trust & Conversion'
    ],
    customNoteLabel: 'Core Idea / Custom Workflow (Must-have):',
    customNotePlaceholder: 'Type 1-2 short sentences, or click Voice-to-Text / Record Voice on the right...',
    dictateBtn: 'Voice to Text',
    dictatingBtn: 'Listening...',

    sec3Title: '3. Tech Specs, Languages & UI Style',
    sec3Badge: 'All Devices',
    infraLabel: 'Infrastructure, Data & Utilities:',
    infraOptions: [
      'Cloud Hosting (Recommended)',
      'On-Premise / Local Server',
      'Real-time Data Sync',
      'Export Excel / 1-Page A4 PDF Print',
      'Zalo / Email / Payment / API Integration'
    ],
    scaleLabel: 'User Scale & Platforms:',
    scaleOptions: [
      'All Devices (Phone, iPad, Laptop)',
      'Under 100 concurrent users',
      '100 - 1,000 concurrent users',
      'Over 1,000 concurrent users'
    ],
    securityLabel: 'Security & Compliance:',
    securityOptions: [
      'Password Encryption & Role Access',
      'Two-Factor Auth (OTP / Email)',
      'User Activity Audit Logs',
      'Industry Compliance (Finance / Healthcare)'
    ],
    styleLabel: 'UI Design Style:',
    styleOptions: [
      'Luxury Executive (Navy & Gold)',
      'Modern Clean SaaS (Light & Airy)',
      'Data-Dense Analytics Dashboard',
      'Custom Brand Identity Colors'
    ],
    appLangLabel: 'Languages to Build into Web App (Select 1 or more):',

    sec4Title: '4. User Roles & Permissions',
    sec4Badge: 'Quick Edit',
    roleQtyLabel: 'Qty:',
    rolePermPlaceholder: 'Main permissions (View, Add, Edit, Delete, Approve...)',
    defaultRoles: [
      {
        id: 'admin',
        name: 'Admin (Administrator)',
        count: '1 - 2',
        permissions: 'Full system configuration, user roles, master data & executive reports'
      },
      {
        id: 'manager',
        name: 'Manager (Supervisor)',
        count: '2 - 5',
        permissions: 'View dashboards, approve requests/reports, manage team workflows'
      },
      {
        id: 'staff',
        name: 'Staff (Operator)',
        count: '5 - 30',
        permissions: 'Daily data entry and task processing based on assigned permissions'
      },
      {
        id: 'customer',
        name: 'Client / Partner',
        count: 'Unlimited',
        permissions: 'Lookup status, submit requests, book appointments, download PDF'
      }
    ],

    sec5Title: '5. Voice Note, Camera Photo & Files',
    sec5Badge: 'Zero-Typing Needed!',
    recordVoiceTitle: 'Record Voice Note',
    recordVoiceSub: 'Speak directly',
    stopRecordingBtn: 'Stop',
    recordingSub: 'Recording...',
    cameraTitle: 'Snap Photo / Sketch',
    cameraSub: 'Open Camera / Photo',
    attachTitle: 'Attach Files',
    attachSub: 'Excel, Word, Images',
    downloadAudioBtn: 'Save Audio',
    capturedImagesLabel: 'Captured Photos / UI References (Auto-printed on A4):',
    addMorePhotoBtn: '+ Add Photo',
    docTypesLabel: 'Available Documents for Workflow & Database Mapping:',
    docTypesOptions: [
      'Current Excel / Google Sheets',
      'Workflow Document (Word / Flowchart)',
      'Paper Forms (Photo Capture)',
      'Legacy Software Screenshots',
      'Hand Sketch / Reference Website'
    ],
    refLinkPlaceholder: '🔗 Paste reference website or Google Drive link (Or press Ctrl+V to paste image)...',

    sec6Title: '🚀 Complete & Submit Brief Now',
    sec6Badge: '24/7 Fast Response',
    sec6Desc: 'Once selected, you can Print / Export a 1-Page A4 PDF or send directly with voice & photo attachments via Email or Zalo:',
    quickShareBtn: 'Quick Share',
    deviceBadge: 'Mobile • iPad • Laptop • Camera',
    wordTemplateBtn: 'Word Form (.docx)',

    footerDesc: 'Specialized Web App Ecosystem & Applied AI Solutions (Business Tax, Cosmetics & F&B R&D, Contract & SCM ERP, Smart Education & Executive Banking Assistants).',

    a4PreviewBanner: '📄 1-Page A4 Print Preview',
    a4PreviewSub: '(Automatically scaled to fit strictly 1 single A4 page when printed or saved as PDF)',
    a4CloseBtn: 'Close',
    a4HeaderSub: 'Inquiries & Consulting: anhpob@gmail.com | Zalo / Hotline: +84 908 095693',
    a4MainTitle: 'WEB APPLICATION DESIGN REQUEST BRIEF',
    a4DateLabel: 'Date',
    a4EcosystemTitle: 'WEB APP ECOSYSTEM',
    a4Sec1Title: '1. General & Contact Information',
    a4Sec2Title: '2. Current Challenges & Expected Goals',
    a4Sec3Title: '3. Technical Requirements, App Languages & UI Style',
    a4Sec4Title: '4. User Roles & Permissions',
    a4Sec5Title: '5. Attached Documents, Voice Note & Visual References',
    a4ColInfra: 'Infrastructure & Data',
    a4ColScale: 'Scale & App Languages',
    a4ColSec: 'Security & UI Style',
    a4RoleCol: 'Role',
    a4QtyCol: 'Users',
    a4PermCol: 'Key Permissions (View, Create, Edit, Delete, Approve...)',
    a4NotUsed: 'Not enabled',
    a4AudioAndFiles: '• Voice Note & Attached Files: ',
    a4RefLink: '• Reference / Drive Link: ',
    a4AttachedPhotos: '• Captured Photos / Reference UI Screenshots:',
    a4FooterTitle: 'DUY ANH DIGITAL LAB — SPECIALIZED WEB APP ECOSYSTEM & AI SOLUTIONS',
    a4FooterExplore: 'Explore live production apps at:',
    a4FooterDomains: 'Key Domains: Tax & Finance • AI Advisor & EdTech • Cosmetics & F&B R&D • Contract & SCM • Agriculture ERP • Banking Assistant.',
    a4FooterContact: 'CONTACT & DEPLOYMENT',

    presets: [
      {
        id: 'erp',
        label: '🏢 Enterprise / Contract ERP',
        projectName: 'Enterprise Contract & Operations Management Web App',
        painPointsIdx: [0, 1, 2],
        goalsIdx: [0, 1, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 1],
        securityIdx: [0, 2],
        styleIdx: 0,
        customNote: 'Manage clients, contracts, automated reminders, and export executive 1-page A4 reports.'
      },
      {
        id: 'tax',
        label: '📊 Tax & Finance',
        projectName: 'Business Revenue & Tax Reporting Web Application',
        painPointsIdx: [0, 1],
        goalsIdx: [0, 4, 5],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 1],
        securityIdx: [0, 3],
        styleIdx: 1,
        customNote: 'Automatically consolidate revenue, expenses, and export accurate tax declarations.'
      },
      {
        id: 'ai',
        label: '🤖 AI Advisor / R&D',
        projectName: 'AI Expert Advisor & Formula R&D Knowledge Platform',
        painPointsIdx: [3, 4],
        goalsIdx: [2, 1, 5],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0],
        styleIdx: 0,
        customNote: 'Integrate specialized AI for R&D lookup (Cosmetics / F&B / Healthcare / Banking) and instant recommendations.'
      },
      {
        id: 'crm',
        label: '🛒 Sales & Booking CRM',
        projectName: 'Online Service Booking & Client CRM Web App',
        painPointsIdx: [4, 0],
        goalsIdx: [3, 5, 0],
        infraIdx: [0, 2, 4],
        scaleIdx: [0, 2],
        securityIdx: [0, 1],
        styleIdx: 3,
        customNote: 'Fast mobile booking experience for clients with automated Zalo/Email notifications.'
      },
      {
        id: 'edu',
        label: '🎓 EdTech / E-Learning',
        projectName: 'Smart E-Learning, Training & Online Assessment Platform',
        painPointsIdx: [2, 3],
        goalsIdx: [0, 2, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0, 2],
        styleIdx: 1,
        customNote: 'Interactive lessons, voice pronunciation practice, automated grading, and student analytics.'
      },
      {
        id: 'landing',
        label: '🌐 Executive Landing Page',
        projectName: 'High-Converting Brand Landing Page & Smart Brief Portal',
        painPointsIdx: [4, 5],
        goalsIdx: [5, 3],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 3],
        securityIdx: [0],
        styleIdx: 0,
        customNote: 'Luxury single-screen design compatible with all devices, 1-page A4 print & instant inquiry submission.'
      }
    ]
  },

  zh: {
    headerBadge: '一页式智能需求表',
    headerTitle: '网站与Web应用程序定制设计需求表',
    quickPresetLabel: '快速模板:',
    resetBtn: '重置',
    previewA4Btn: '预览A4',
    printA4Btn: '打印A4',
    downloadPdfBtn: '下载PDF',
    generatingPdf: '生成中...',
    sendEmailBtn: '发送邮件',
    sendZaloBtn: '发送Zalo',
    uiLangLabel: '语言:',

    sec1Title: '1. 联系信息与项目概况',
    sec1Badge: '极简填写',
    companyLabel: '公司 / 机构名称',
    companyPlaceholder: '例如：ABC公司 / 个人...',
    contactLabel: '联系人姓名',
    contactPlaceholder: '例如：陈先生 / 林女士...',
    phoneLabel: '电话 / Zalo / 微信 *',
    phonePlaceholder: '例如：+84 908 xxx xxx',
    emailLabel: '电子邮箱 (选填)',
    emailPlaceholder: '例如：name@company.com',
    projectLabel: '预计Web应用名称 / 所属行业',
    projectPlaceholder: '例如：合同管理系统、税务申报系统、AI智能顾问...',
    timelineLabel: '期望开发周期与部署方案:',
    timelineOptions: [
      '⚡ 加急上线 (3 - 7天)',
      '📅 标准开发 (2 - 4周)',
      '🚀 分阶段迭代开发',
      '💡 请提供最优方案建议'
    ],

    sec2Title: '2. 现状痛点与预期目标',
    sec2Badge: '点击选择',
    painPointsLabel: '当前急需解决的痛点问题:',
    painPointsOptions: [
      'Excel表格分散 / 手工记录繁琐',
      '汇总报表耗费大量时间',
      '难以实时管控进度与人员',
      '缺乏AI专业辅助工具',
      '客户预约或查询不便',
      '旧系统缓慢、手机端体验差'
    ],
    goalsLabel: '开发此Web应用的最大期望目标:',
    goalsOptions: [
      '实现80-90%流程自动化',
      '实时集中化管理数据',
      '集成AI智能顾问 / 研发分析',
      '客户自助预约与便捷查询',
      '可视化数据图表看板',
      '提升品牌形象与客户转化率'
    ],
    customNoteLabel: '核心创意 / 专属功能需求 (Must-have):',
    customNotePlaceholder: '简短输入1-2句话，或点击右侧“语音转文字 / 录音”...',
    dictateBtn: '语音输入',
    dictatingBtn: '正在倾听...',

    sec3Title: '3. 技术要求、语言与界面风格',
    sec3Badge: '全设备兼容',
    infraLabel: '基础设施与核心功能:',
    infraOptions: [
      '云端部署 Cloud (推荐)',
      '本地服务器部署 (On-premise)',
      '实时数据同步 (Real-time)',
      '导出Excel / 标准单页A4打印',
      '对接Zalo / 邮件 / 支付接口'
    ],
    scaleLabel: '用户规模与运行平台:',
    scaleOptions: [
      '全设备自适应 (手机, iPad, 电脑)',
      '100人以下同时在线',
      '100 - 1,000人同时在线',
      '1,000人以上同时在线'
    ],
    securityLabel: '安全标准与权限:',
    securityOptions: [
      '密码加密与严格权限控制',
      '双重验证 (OTP / 邮箱)',
      '操作历史日志追踪 (Log)',
      '行业专属标准 (金融 / 医疗)'
    ],
    styleLabel: '界面设计风格:',
    styleOptions: [
      '高端商务黑金 (Navy & Gold)',
      '现代清新简约 (Clean SaaS)',
      '专业数据看板 (Dashboard)',
      '定制企业品牌专属配色'
    ],
    appLangLabel: 'Web应用需支持的语言 (可多选):',

    sec4Title: '4. 用户角色与权限分配 (Roles)',
    sec4Badge: '一键勾选',
    roleQtyLabel: '人数:',
    rolePermPlaceholder: '主要权限 (查看、新增、修改、删除、审批报表...)',
    defaultRoles: [
      {
        id: 'admin',
        name: '系统管理员 (Admin)',
        count: '1 - 2',
        permissions: '系统全局配置、账号权限分配、核心数据管理与总览报表'
      },
      {
        id: 'manager',
        name: '部门主管 (Manager)',
        count: '2 - 5',
        permissions: '查看数据看板、审批业务申请与报表、管理部门进度'
      },
      {
        id: 'staff',
        name: '普通员工 (Staff)',
        count: '5 - 30',
        permissions: '日常数据录入、按分配权限处理业务流程'
      },
      {
        id: 'customer',
        name: '客户 / 合作伙伴',
        count: '不限',
        permissions: '在线查询进度、提交需求、预约服务或下载PDF报告'
      }
    ],

    sec5Title: '5. 语音录音、拍照上传与附件',
    sec5Badge: '免打字极速提交!',
    recordVoiceTitle: '录制语音需求',
    recordVoiceSub: '直接口述想法',
    stopRecordingBtn: '停止录音',
    recordingSub: '录音中...',
    cameraTitle: '拍照 / 上传样图',
    cameraSub: '打开相机 / 相册',
    attachTitle: '添加附件文件',
    attachSub: 'Excel, Word, 图片',
    downloadAudioBtn: '下载录音',
    capturedImagesLabel: '已拍照片 / 参考界面 (自动排版至A4打印页):',
    addMorePhotoBtn: '+ 添加图片',
    docTypesLabel: '现有流程与数据库映射参考资料:',
    docTypesOptions: [
      '正在使用的Excel / Google表格',
      '工作流程图 / Word文档',
      '现有纸质表单 (拍照上传)',
      '旧软件界面截图',
      '手绘草图 / 喜欢的参考网站'
    ],
    refLinkPlaceholder: '🔗 粘贴参考网站链接或网盘链接 (支持按 Ctrl+V 直接粘贴截图)...',

    sec6Title: '🚀 完成并立即提交需求',
    sec6Badge: '24/7 快速响应',
    sec6Desc: '选择完成后，您可以直接打印/导出单页A4 PDF，或连同录音与照片通过邮件或Zalo发送：',
    quickShareBtn: '一键分享附件',
    deviceBadge: '手机 • iPad • 笔记本电脑 • 相机',
    wordTemplateBtn: 'Word模板 (.docx)',

    footerDesc: '专业级Web应用生态系统与AI实战解决方案（税务申报、化妆品与食品研发、合同与供应链管理、农业ERP、在线教育与银行高管助手）。',

    a4PreviewBanner: '📄 标准单页A4打印预览',
    a4PreviewSub: '(打印或导出PDF时自动精准缩放至1页A4纸内)',
    a4CloseBtn: '关闭',
    a4HeaderSub: '需求接收与咨询: anhpob@gmail.com | Zalo / 热线: +84 908 095693',
    a4MainTitle: 'WEB应用程序定制设计需求表 (WEB APP BRIEF)',
    a4DateLabel: '日期',
    a4EcosystemTitle: 'WEB应用生态系统',
    a4Sec1Title: '1. 基本信息与联系方式',
    a4Sec2Title: '2. 现状痛点与预期解决目标',
    a4Sec3Title: '3. 技术要求、支持语言与界面风格',
    a4Sec4Title: '4. 用户角色与权限分配 (Roles & Permissions)',
    a4Sec5Title: '5. 附件资料、语音记录与参考图片',
    a4ColInfra: '基础设施与数据',
    a4ColScale: '规模与应用语言',
    a4ColSec: '安全标准与界面',
    a4RoleCol: '角色名称',
    a4QtyCol: '用户数量',
    a4PermCol: '主要权限说明 (查看、新增、修改、删除、审批...)',
    a4NotUsed: '未启用',
    a4AudioAndFiles: '• 语音及附件文件: ',
    a4RefLink: '• 参考链接 / 网盘: ',
    a4AttachedPhotos: '• 附带参考图片 / 拍照草图:',
    a4FooterTitle: 'DUY ANH DIGITAL LAB — 专业级WEB应用生态与AI解决方案',
    a4FooterExplore: '访问实战项目作品集:',
    a4FooterDomains: '核心领域: 税务与财务 • AI顾问与培训 • 化妆品与食品研发 • 合同与供应链 • 农业ERP • 银行管理助手。',
    a4FooterContact: '联系与项目部署',

    presets: [
      {
        id: 'erp',
        label: '🏢 企业管理 / 合同ERP',
        projectName: '企业合同与业务运营综合管理Web系统',
        painPointsIdx: [0, 1, 2],
        goalsIdx: [0, 1, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 1],
        securityIdx: [0, 2],
        styleIdx: 0,
        customNote: '需要管理客户、合同进度、自动提醒，并支持一键导出标准单页A4报表。'
      },
      {
        id: 'tax',
        label: '📊 税务申报 / 财务管理',
        projectName: '营收管理与智能税务申报Web应用',
        painPointsIdx: [0, 1],
        goalsIdx: [0, 4, 5],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 1],
        securityIdx: [0, 3],
        styleIdx: 1,
        customNote: '自动汇总营收与成本账目，快速准确生成税务申报表与财务统计。'
      },
      {
        id: 'ai',
        label: '🤖 AI智能顾问 / 研发',
        projectName: 'AI专家顾问与配方研发知识库系统',
        painPointsIdx: [3, 4],
        goalsIdx: [2, 1, 5],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0],
        styleIdx: 0,
        customNote: '集成行业专属AI（化妆品/食品/医疗/金融），智能检索数据并生成专业报告。'
      },
      {
        id: 'crm',
        label: '🛒 销售与预约 CRM',
        projectName: '客户服务预约与CRM管理Web应用',
        painPointsIdx: [4, 0],
        goalsIdx: [3, 5, 0],
        infraIdx: [0, 2, 4],
        scaleIdx: [0, 2],
        securityIdx: [0, 1],
        styleIdx: 3,
        customNote: '客户可在手机端极速预约与查询，系统自动通过Zalo/邮件发送提醒。'
      },
      {
        id: 'edu',
        label: '🎓 在线培训 / E-Learning',
        projectName: '智能在线培训、语言学习与考核平台',
        painPointsIdx: [2, 3],
        goalsIdx: [0, 2, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0, 2],
        styleIdx: 1,
        customNote: '支持互动课程、语音跟读评测、自动批改打分与学员学习进度追踪。'
      },
      {
        id: 'landing',
        label: '🌐 高端品牌着陆页',
        projectName: '高端品牌展示与客户需求收集Landing Page',
        painPointsIdx: [4, 5],
        goalsIdx: [5, 3],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 3],
        securityIdx: [0],
        styleIdx: 0,
        customNote: '单屏高端视觉设计，全设备兼容，支持客户在线提交需求或打印单页A4。'
      }
    ]
  },

  ja: {
    headerBadge: '1ページ完結スマート要件表',
    headerTitle: 'Webアプリ・システム開発 要件ヒアリングシート',
    quickPresetLabel: 'テンプレート:',
    resetBtn: 'リセット',
    previewA4Btn: 'A4プレビュー',
    printA4Btn: 'A4印刷',
    downloadPdfBtn: 'PDF保存',
    generatingPdf: '作成中...',
    sendEmailBtn: 'メール送信',
    sendZaloBtn: 'Zalo送信',
    uiLangLabel: '言語:',

    sec1Title: '1. お客様情報・プロジェクト概要',
    sec1Badge: '簡単入力',
    companyLabel: '会社名・組織名',
    companyPlaceholder: '例：株式会社ABC / 個人...',
    contactLabel: 'ご担当者名',
    contactPlaceholder: '例：田中 太郎...',
    phoneLabel: '電話番号 / Zalo *',
    phonePlaceholder: '例：+84 908 xxx xxx',
    emailLabel: 'メールアドレス (任意)',
    emailPlaceholder: '例：name@company.com',
    projectLabel: '予定アプリ名 / 業種・分野',
    projectPlaceholder: '例：契約管理システム、税務レポート、AIアドバイザー...',
    timelineLabel: 'ご希望の納期・開発プラン:',
    timelineOptions: [
      '⚡ お急ぎ (3〜7日)',
      '📅 標準プラン (2〜4週間)',
      '🚀 フェーズ分け開発',
      '💡 最適なプランを提案してほしい'
    ],

    sec2Title: '2. 現状の課題と達成したい目標',
    sec2Badge: 'タップで選択',
    painPointsLabel: '現在抱えている課題 (Pain points):',
    painPointsOptions: [
      'Excelや紙の管理が煩雑・分散',
      'レポート集計に時間がかかる',
      '進捗やスタッフ管理が難しい',
      '専門業務を支援するAIツールがない',
      '顧客の予約・照会が不便',
      '既存システムが遅くスマホで見づらい'
    ],
    goalsLabel: 'Webアプリ導入の主な目標:',
    goalsOptions: [
      '業務プロセスの80〜90%を自動化',
      'リアルタイムで一元管理',
      'AIアドバイザー・R&D分析の導入',
      '顧客自身の簡単予約・ステータス照会',
      '直感的なグラフ・ダッシュボード',
      'ブランド信頼度と成約率の向上'
    ],
    customNoteLabel: 'コアアイデア・独自機能のご要望 (Must-have):',
    customNotePlaceholder: '短く1〜2行入力するか、右側の「音声入力 / 録音」をご利用ください...',
    dictateBtn: '音声入力',
    dictatingBtn: '聞き取り中...',

    sec3Title: '3. 技術仕様・対応言語・デザイン',
    sec3Badge: '全端末対応',
    infraLabel: 'インフラ・データ・連携機能:',
    infraOptions: [
      'クラウド環境 Cloud (推奨)',
      'オンプレミス / 社内サーバー',
      'リアルタイムデータ同期',
      'Excel出力 / A4一枚ぴったり印刷',
      'Zalo / メール / 決済・API連携'
    ],
    scaleLabel: '利用規模・対応デバイス:',
    scaleOptions: [
      '全デバイス対応 (スマホ, iPad, PC)',
      '同時接続 100名未満',
      '同時接続 100〜1,000名',
      '同時接続 1,000名以上'
    ],
    securityLabel: 'セキュリティ・基準:',
    securityOptions: [
      '暗号化・ロール別アクセス権限',
      '2段階認証 (OTP / メール)',
      '操作履歴ログの記録 (Audit Log)',
      '業界別基準 (金融・医療など)'
    ],
    styleLabel: 'UIデザインスタイル:',
    styleOptions: [
      'ラグジュアリー (Navy & Gold)',
      'モダン＆クリーン (Clean SaaS)',
      '高密度データダッシュボード',
      '自社ブランドカラーに合わせる'
    ],
    appLangLabel: 'Webアプリに搭載する言語 (複数選択可):',

    sec4Title: '4. ユーザー権限設定 (Roles)',
    sec4Badge: '簡単チェック',
    roleQtyLabel: '人数:',
    rolePermPlaceholder: '主な権限 (閲覧、追加、編集、削除、承認...)',
    defaultRoles: [
      {
        id: 'admin',
        name: '管理者 (Admin)',
        count: '1 - 2',
        permissions: 'システム全体設定、権限管理、マスターデータ・全社レポート管理'
      },
      {
        id: 'manager',
        name: 'マネージャー (Manager)',
        count: '2 - 5',
        permissions: 'ダッシュボード閲覧、申請・レポート承認、部門業務の管理'
      },
      {
        id: 'staff',
        name: 'スタッフ (Staff)',
        count: '5 - 30',
        permissions: '日常のデータ入力、担当業務の処理'
      },
      {
        id: 'customer',
        name: '顧客・取引先',
        count: '無制限',
        permissions: '情報照会、リクエスト送信、予約、PDF出力'
      }
    ],

    sec5Title: '5. 音声録音・カメラ撮影・資料添付',
    sec5Badge: '文字入力不要！',
    recordVoiceTitle: '音声で要件録音',
    recordVoiceSub: 'マイクで話すだけ',
    stopRecordingBtn: '停止',
    recordingSub: '録音中...',
    cameraTitle: 'カメラ撮影 / 画像',
    cameraSub: 'カメラ・写真を選択',
    attachTitle: 'ファイル添付',
    attachSub: 'Excel, Word, 画像',
    downloadAudioBtn: '音声保存',
    capturedImagesLabel: '撮影写真・参考画面 (A4印刷シートに自動配置):',
    addMorePhotoBtn: '+ 写真追加',
    docTypesLabel: '業務フロー・DB設計の参考資料:',
    docTypesOptions: [
      '現在使用中のExcel / スプレッドシート',
      '業務フロー図 (Word / Flowchart)',
      '紙の帳票・伝票 (カメラ撮影)',
      '既存ソフトの画面キャプチャ',
      '手書きラフ案 / 参考Webサイト'
    ],
    refLinkPlaceholder: '🔗 参考サイトやGoogleドライブのURL (Ctrl+Vでスクショ貼付も可)...',

    sec6Title: '🚀 完了＆今すぐ要件を送信',
    sec6Badge: '24時間迅速対応',
    sec6Desc: '選択後、A4用紙1枚に収まるPDFの印刷・保存、または録音や写真と一緒にメール・Zaloで直接送信できます：',
    quickShareBtn: 'ファイル共有',
    deviceBadge: 'スマホ • iPad • PC • カメラ対応',
    wordTemplateBtn: 'Word様式 (.docx)',

    footerDesc: '専門特化型Webアプリ＆実践AIソリューション（税務申告、化粧品・食品R&D、契約・SCM管理、農業ERP、教育＆銀行経営アシスタント）。',

    a4PreviewBanner: '📄 A4（1枚完結）印刷プレビュー',
    a4PreviewSub: '(印刷またはPDF保存時、自動的にA4用紙1枚に収まります)',
    a4CloseBtn: '閉じる',
    a4HeaderSub: '受付・ご相談: anhpob@gmail.com | Zalo / 電話: +84 908 095693',
    a4MainTitle: 'Webアプリケーション開発 要件ヒアリングシート (WEB APP BRIEF)',
    a4DateLabel: '作成日',
    a4EcosystemTitle: 'WEB APP ECOSYSTEM',
    a4Sec1Title: '1. お客様情報・ご連絡先',
    a4Sec2Title: '2. 現状の課題と期待する導入効果',
    a4Sec3Title: '3. 技術要件・対応言語・UIデザインスタイル',
    a4Sec4Title: '4. ユーザー権限設定 (Roles & Permissions)',
    a4Sec5Title: '5. 添付資料・音声メモ・参考画像',
    a4ColInfra: 'インフラ＆データ',
    a4ColScale: '規模＆搭載言語',
    a4ColSec: 'セキュリティ＆UI',
    a4RoleCol: 'ロール (役割)',
    a4QtyCol: 'ユーザー数',
    a4PermCol: '主な権限内容 (閲覧、作成、編集、削除、承認など)',
    a4NotUsed: '対象外',
    a4AudioAndFiles: '• 音声録音・添付ファイル: ',
    a4RefLink: '• 参考URL / Drive: ',
    a4AttachedPhotos: '• 添付写真・参考UI画面:',
    a4FooterTitle: 'DUY ANH DIGITAL LAB — 専門Webアプリエコシステム＆AIソリューション',
    a4FooterExplore: '稼働中の実績ポートフォリオ:',
    a4FooterDomains: '主な実績分野: 税務・財務 • AIアドバイザー＆教育 • 化粧品・食品R&D • 契約＆SCM • 農業ERP • 銀行アシスタント',
    a4FooterContact: 'お問い合わせ・開発窓口',

    presets: [
      {
        id: 'erp',
        label: '🏢 業務・契約管理 ERP',
        projectName: '全社契約管理・業務オペレーションWebシステム',
        painPointsIdx: [0, 1, 2],
        goalsIdx: [0, 1, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 1],
        securityIdx: [0, 2],
        styleIdx: 0,
        customNote: '顧客・契約管理、自動リマインド、A4一枚に収まる定型レポート出力を実現したい。'
      },
      {
        id: 'tax',
        label: '📊 税務・財務レポート',
        projectName: '売上管理・税務申告自動化Webアプリ',
        painPointsIdx: [0, 1],
        goalsIdx: [0, 4, 5],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 1],
        securityIdx: [0, 3],
        styleIdx: 1,
        customNote: '売上・経費データを自動集計し、正確な税務レポートや帳票をワンクリックで出力。'
      },
      {
        id: 'ai',
        label: '🤖 AIアドバイザー / R&D',
        projectName: 'AI専門アドバイザー＆処方R&Dナレッジシステム',
        painPointsIdx: [3, 4],
        goalsIdx: [2, 1, 5],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0],
        styleIdx: 0,
        customNote: '専門データ（化粧品・食品・医療・金融）をAIで検索・分析し、最適解とレポートを生成。'
      },
      {
        id: 'crm',
        label: '🛒 予約・顧客管理 CRM',
        projectName: 'オンライン予約＆顧客管理（CRM）Webアプリ',
        painPointsIdx: [4, 0],
        goalsIdx: [3, 5, 0],
        infraIdx: [0, 2, 4],
        scaleIdx: [0, 2],
        securityIdx: [0, 1],
        styleIdx: 3,
        customNote: 'スマホから簡単に予約・照会でき、Zaloやメールで自動通知を送る仕組み。'
      },
      {
        id: 'edu',
        label: '🎓 教育・Eラーニング',
        projectName: 'スマート社内研修・語学学習・オンライン試験プラットフォーム',
        painPointsIdx: [2, 3],
        goalsIdx: [0, 2, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0, 2],
        styleIdx: 1,
        customNote: '双方向レッスン、音声録音・発音チェック、自動採点、受講者の進捗可視化。'
      },
      {
        id: 'landing',
        label: '🌐 高級ランディングページ',
        projectName: 'ブランド紹介＆スマート要件受付ランディングページ',
        painPointsIdx: [4, 5],
        goalsIdx: [5, 3],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 3],
        securityIdx: [0],
        styleIdx: 0,
        customNote: '1画面完結の洗練されたデザイン、全端末対応、A4一枚印刷および即座の問い合わせ送信。'
      }
    ]
  },

  ko: {
    headerBadge: '1페이지 스마트 의뢰서',
    headerTitle: '웹 & 애플리케이션 맞춤 설계 요청서',
    quickPresetLabel: '빠른 템플릿:',
    resetBtn: '초기화',
    previewA4Btn: 'A4 미리보기',
    printA4Btn: 'A4 인쇄',
    downloadPdfBtn: 'PDF 저장',
    generatingPdf: '생성 중...',
    sendEmailBtn: '이메일 전송',
    sendZaloBtn: 'Zalo 전송',
    uiLangLabel: '언어:',

    sec1Title: '1. 연락처 및 프로젝트 기본 정보',
    sec1Badge: '초간단 입력',
    companyLabel: '회사 / 기관명',
    companyPlaceholder: '예: ABC 주식회사 / 개인...',
    contactLabel: '담당자 성함',
    contactPlaceholder: '예: 김민수 / 박지영...',
    phoneLabel: '연락처 / Zalo / 카카오톡 *',
    phonePlaceholder: '예: +84 908 xxx xxx',
    emailLabel: '이메일 (선택)',
    emailPlaceholder: '예: name@company.com',
    projectLabel: '예상 웹앱 명칭 / 비즈니스 분야',
    projectPlaceholder: '예: 계약 관리 ERP, 세무 신고 앱, AI 전문 어드바이저...',
    timelineLabel: '희망 개발 일정 및 진행 방식:',
    timelineOptions: [
      '⚡ 긴급 제작 (3 - 7일)',
      '📅 표준 개발 (2 - 4주)',
      '🚀 단계별 고도화 개발',
      '💡 최적의 일정/예산 제안 요청'
    ],

    sec2Title: '2. 현재 문제점 및 기대 목표',
    sec2Badge: '터치하여 선택',
    painPointsLabel: '현재 해결하고 싶은 가장 큰 어려움 (Pain points):',
    painPointsOptions: [
      '분산된 엑셀 / 수기 장부 관리의 불편함',
      '보고서 취합에 너무 많은 시간 소요',
      '업무 진행상황 및 직원 관리의 어려움',
      '전문 업무를 돕는 AI 도구의 부재',
      '고객의 예약 및 실시간 조회 불편',
      '기존 프로그램이 느리고 모바일 사용이 불편함'
    ],
    goalsLabel: '웹앱 제작을 통해 기대하는 핵심 목표:',
    goalsOptions: [
      '업무 프로세스 80-90% 자동화',
      '실시간 중앙 집중식 통합 관리',
      'AI 전문 상담 / R&D / 데이터 분석 탑재',
      '고객 셀프 예약 및 간편 조회',
      '직관적인 통계 대시보드 구현',
      '브랜드 신뢰도 및 고객 전환율 상승'
    ],
    customNoteLabel: '핵심 아이디어 / 필수 맞춤형 기능 (Must-have):',
    customNotePlaceholder: '짧게 1~2문장으로 입력하시거나 우측의 음성 인식 / 녹음 기능을 사용해 보세요...',
    dictateBtn: '음성 텍스트 변환',
    dictatingBtn: '듣는 중...',

    sec3Title: '3. 기술 사양, 지원 언어 및 디자인',
    sec3Badge: '모든 기기 호환',
    infraLabel: '인프라, 데이터 및 편의 기능:',
    infraOptions: [
      '클라우드 서버 Cloud (권장)',
      '사내 자체 서버 (On-premise)',
      '실시간 데이터 동기화 (Real-time)',
      '엑셀 다운로드 / A4 1장 맞춤 인쇄',
      'Zalo / 이메일 / 결제 / 외부 API 연동'
    ],
    scaleLabel: '사용자 규모 및 플랫폼:',
    scaleOptions: [
      '모든 기기 호환 (스마트폰, iPad, 노트북)',
      '동시 접속 100명 미만',
      '동시 접속 100 ~ 1,000명',
      '동시 접속 1,000명 이상'
    ],
    securityLabel: '보안 및 표준 규격:',
    securityOptions: [
      '비밀번호 암호화 및 직급별 권한 분리',
      '2단계 인증 (OTP / 이메일)',
      '작업 이력 로그 기록 (Audit Log)',
      '산업별 특수 보안 기준 (금융 / 의료)'
    ],
    styleLabel: '선호하는 UI 디자인 스타일:',
    styleOptions: [
      '고급스러운 비즈니스 (Navy & Gold)',
      '모던하고 깔끔한 스타일 (Clean SaaS)',
      '전문 데이터 분석 대시보드형',
      '브랜드 고유 컬러 맞춤형'
    ],
    appLangLabel: '웹앱에 탑재할 언어 선택 (다중 선택 가능):',

    sec4Title: '4. 사용자 권한 설정 (Roles)',
    sec4Badge: '간편 체크',
    roleQtyLabel: '인원:',
    rolePermPlaceholder: '주요 권한 (열람, 추가, 수정, 삭제, 보고서 승인...)',
    defaultRoles: [
      {
        id: 'admin',
        name: '최고 관리자 (Admin)',
        count: '1 - 2',
        permissions: '시스템 전체 설정, 권한 부여, 마스터 데이터 및 종합 보고서 관리'
      },
      {
        id: 'manager',
        name: '매니저 (Manager)',
        count: '2 - 5',
        permissions: '대시보드 열람, 요청/보고서 승인, 부서 업무 현황 관리'
      },
      {
        id: 'staff',
        name: '실무 직원 (Staff)',
        count: '5 - 30',
        permissions: '일일 데이터 입력 및 담당 업무 처리'
      },
      {
        id: 'customer',
        name: '고객 / 파트너사',
        count: '무제한',
        permissions: '진행 상태 조회, 요청 접수, 예약 신청 및 PDF 결과물 다운로드'
      }
    ],

    sec5Title: '5. 음성 녹음, 카메라 촬영 및 파일 첨부',
    sec5Badge: '타이핑 없이 간편하게!',
    recordVoiceTitle: '음성으로 요구사항 녹음',
    recordVoiceSub: '마이크로 바로 말하기',
    stopRecordingBtn: '녹음 중지',
    recordingSub: '녹음 중...',
    cameraTitle: '카메라 촬영 / 샘플 사진',
    cameraSub: '카메라 / 사진첩 열기',
    attachTitle: '자료 파일 첨부',
    attachSub: '엑셀, 워드, 이미지',
    downloadAudioBtn: '음성 저장',
    capturedImagesLabel: '촬영한 사진 / 참고 화면 (A4 인쇄물에 자동 포함):',
    addMorePhotoBtn: '+ 사진 추가',
    docTypesLabel: '업무 프로세스 및 DB 설계를 위한 보유 자료:',
    docTypesOptions: [
      '현재 사용 중인 엑셀 / 구글 시트',
      '업무 프로세스 문서 (워드 / 순서도)',
      '기존 종이 양식 (사진 촬영본)',
      '기존 프로그램 화면 캡처',
      '손그림 스케치 / 참고 웹사이트'
    ],
    refLinkPlaceholder: '🔗 참고 웹사이트 또는 구글 드라이브 링크 붙여넣기 (Ctrl+V로 캡처 이미지 바로 붙여넣기 가능)...',

    sec6Title: '🚀 작성 완료 및 즉시 전송',
    sec6Badge: '24/7 신속 피드백',
    sec6Desc: '선택을 마친 후 A4 1장 분량의 PDF로 인쇄/저장하거나 녹음 파일 및 사진과 함께 이메일 또는 Zalo로 바로 전송하세요:',
    quickShareBtn: '파일과 함께 공유',
    deviceBadge: '스마트폰 • iPad • 노트북 • 카메라 완벽 호환',
    wordTemplateBtn: '워드 양식 (.docx)',

    footerDesc: '전문 웹 애플리케이션 생태계 & 실전 AI 솔루션 (세무 신고, 화장품 & 식음료 R&D, 계약 & 공급망 SCM, 농업 ERP, 스마트 교육 & 은행 경영 비서).',

    a4PreviewBanner: '📄 A4 1장 맞춤 인쇄 미리보기',
    a4PreviewSub: '(인쇄 또는 PDF 저장 시 자동으로 A4 용지 1장에 완벽히 맞춰집니다)',
    a4CloseBtn: '닫기',
    a4HeaderSub: '접수 및 상담: anhpob@gmail.com | Zalo / 직통전화: +84 908 095693',
    a4MainTitle: '웹 애플리케이션 맞춤 설계 요청서 (WEB APP BRIEF)',
    a4DateLabel: '작성일',
    a4EcosystemTitle: 'WEB APP ECOSYSTEM',
    a4Sec1Title: '1. 기본 정보 및 연락처',
    a4Sec2Title: '2. 현재 문제점 및 해결 목표',
    a4Sec3Title: '3. 기술 사양, 지원 언어 및 UI 디자인 스타일',
    a4Sec4Title: '4. 사용자 권한 설정 (Roles & Permissions)',
    a4Sec5Title: '5. 첨부 자료, 음성 녹음 및 참고 이미지',
    a4ColInfra: '인프라 및 데이터',
    a4ColScale: '규모 및 지원 언어',
    a4ColSec: '보안 및 UI 스타일',
    a4RoleCol: '역할 (Role)',
    a4QtyCol: '인원수',
    a4PermCol: '주요 권한 (열람, 추가, 수정, 삭제, 보고서 승인 등)',
    a4NotUsed: '미사용',
    a4AudioAndFiles: '• 음성 녹음 및 첨부 파일: ',
    a4RefLink: '• 참고 링크 / 드라이브: ',
    a4AttachedPhotos: '• 첨부된 촬영 사진 / 참고 UI 화면:',
    a4FooterTitle: 'DUY ANH DIGITAL LAB — 전문 웹앱 생태계 & AI 솔루션',
    a4FooterExplore: '실제 구축 포트폴리오 확인:',
    a4FooterDomains: '주요 분야: 세무/재무 • AI 어드바이저 & 교육 • 화장품 & F&B R&D • 계약 & SCM • 농업 ERP • 은행 경영 비서.',
    a4FooterContact: '구축 문의 및 연락처',

    presets: [
      {
        id: 'erp',
        label: '🏢 기업 관리 / 계약 ERP',
        projectName: '기업 계약 및 비즈니스 운영 통합 관리 웹앱',
        painPointsIdx: [0, 1, 2],
        goalsIdx: [0, 1, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 1],
        securityIdx: [0, 2],
        styleIdx: 0,
        customNote: '고객 및 계약 관리, 자동 알림, A4 1장 규격의 보고서 출력이 필요합니다.'
      },
      {
        id: 'tax',
        label: '📊 세무 신고 / 재무 관리',
        projectName: '사업자 매출 관리 및 세무 신고 자동화 웹앱',
        painPointsIdx: [0, 1],
        goalsIdx: [0, 4, 5],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 1],
        securityIdx: [0, 3],
        styleIdx: 1,
        customNote: '매출 및 비용 장부를 자동으로 취합하고 정확한 세무 신고서를 원클릭으로 생성합니다.'
      },
      {
        id: 'ai',
        label: '🤖 AI 어드바이저 / R&D',
        projectName: 'AI 전문가 상담 및 배합비 R&D 지식 플랫폼',
        painPointsIdx: [3, 4],
        goalsIdx: [2, 1, 5],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0],
        styleIdx: 0,
        customNote: '화장품/식품/의료/금융 등 전문 데이터를 AI로 검색·분석하고 최적의 솔루션을 제안합니다.'
      },
      {
        id: 'crm',
        label: '🛒 판매 / 예약 CRM',
        projectName: '온라인 서비스 예약 및 고객 관리(CRM) 웹앱',
        painPointsIdx: [4, 0],
        goalsIdx: [3, 5, 0],
        infraIdx: [0, 2, 4],
        scaleIdx: [0, 2],
        securityIdx: [0, 1],
        styleIdx: 3,
        customNote: '고객이 스마트폰에서 빠르게 예약·조회하고 Zalo 및 이메일로 자동 알림을 받습니다.'
      },
      {
        id: 'edu',
        label: '🎓 교육 / E-Learning',
        projectName: '스마트 사내 교육, 어학 학습 및 온라인 평가 플랫폼',
        painPointsIdx: [2, 3],
        goalsIdx: [0, 2, 4],
        infraIdx: [0, 2, 3],
        scaleIdx: [0, 2],
        securityIdx: [0, 2],
        styleIdx: 1,
        customNote: '양방향 강의, 음성 녹음 및 발음 연습, 자동 채점, 학습자 성취도 분석을 지원합니다.'
      },
      {
        id: 'landing',
        label: '🌐 프리미엄 랜딩페이지',
        projectName: '브랜드 소개 및 스마트 고객 의뢰 수집 랜딩페이지',
        painPointsIdx: [4, 5],
        goalsIdx: [5, 3],
        infraIdx: [0, 3, 4],
        scaleIdx: [0, 3],
        securityIdx: [0],
        styleIdx: 0,
        customNote: '한 화면에 들어오는 고급스러운 디자인, 모든 기기 호환, A4 1장 인쇄 및 간편 전송.'
      }
    ]
  }
};
