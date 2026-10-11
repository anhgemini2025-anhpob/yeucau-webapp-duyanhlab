import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Camera,
  Paperclip,
  Printer,
  FileDown,
  Mail,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Eye,
  X,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  Image as ImageIcon,
  FileText,
  Share2,
  Download,
  Languages,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Edit3,
  CheckCheck,
  User,
  Building2,
  ChevronDown,
  ChevronUp,
  Bot,
  Send,
  PhoneCall
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  LangCode,
  SUPPORTED_LANGUAGES,
  APP_TARGET_LANGUAGES
} from './i18n';

interface CapturedImage {
  id: string;
  name: string;
  dataUrl: string;
  file?: File;
}

interface AttachedDoc {
  id: string;
  name: string;
  size: string;
  file: File;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

interface CompactI18n {
  headerTitle: string;
  subHeaderNote: string;
  step1Tab: string;
  step2Tab: string;
  step3Tab: string;
  step4Tab: string;

  // Step 1
  s1Title: string;
  s1Sub: string;
  usageTypeLabel: string;
  personalUsage: string;
  companyUsage: string;
  contactNameLabel: string;
  contactNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  orgNameLabel: string;
  orgNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;

  // Step 2
  s2Title: string;
  s2Sub: string;
  wishLabel: string;
  wishPlaceholder: string;
  voiceRecordBtn: string;
  voiceRecordingActive: string;
  voiceConvertingNote: string;
  toggleSuggestionsBtn: string;
  hideSuggestionsBtn: string;
  suggestionsList: string[];
  openChatboxBtn: string;

  // Step 3 (Merged 3-4-5)
  s3Title: string;
  s3Sub: string;
  appLangLabel: string;
  userScopeLabel: string;
  userScopeOptions: string[];
  timelineLabel: string;
  timelineOptions: string[];
  attachmentSectionLabel: string;
  cameraBtn: string;
  attachFileBtn: string;
  refLinkPlaceholder: string;

  // Step 4 (Done & Print)
  doneTitle: string;
  doneSub: string;
  printBigBtn: string;
  downloadPdfBtn: string;
  sendEmailBtn: string;
  sendZaloBtn: string;
  previewA4Btn: string;
  editBtn: string;
  nextBtn: string;
  prevBtn: string;
  finishBtn: string;
  resetBtn: string;

  // Chatbox
  chatTitle: string;
  chatSub: string;
  chatGreeting: string;
  chatInputPlaceholder: string;
  chatQuickReplies: string[];
  chatApplyBtn: string;

  // A4 Sheet
  a4MainTitle: string;
  a4SubNote: string;
  a4Sec1: string;
  a4Sec2: string;
  a4Sec3: string;
  a4Sec4: string;
  a4CallbackPromise: string;
}

const COMPACT_TEXT: Record<LangCode, CompactI18n> = {
  vi: {
    headerTitle: 'PHIẾU YÊU CẦU THIẾT KẾ WEB & ỨNG DỤNG',
    subHeaderNote: 'Điền cực ngắn trong 30 giây • Chuyên viên kỹ thuật sẽ gọi lại tư vấn chi tiết',
    step1Tab: '1. Liên hệ & Mục đích',
    step2Tab: '2. Mô tả Mong muốn',
    step3Tab: '3. Ngôn ngữ & Đính kèm',
    step4Tab: '✅ Hoàn thành & In A4',

    s1Title: 'Bước 1/3: Bạn làm ứng dụng cho Cá nhân hay Công ty?',
    s1Sub: 'Chỉ cần để lại thông tin liên hệ cơ bản, đội ngũ kỹ thuật sẽ gọi lại tư vấn chi tiết cho bạn.',
    usageTypeLabel: 'Mục đích sử dụng:',
    personalUsage: '👤 Ứng dụng Cá nhân',
    companyUsage: '🏢 Phục vụ Công ty / Tổ chức',
    contactNameLabel: 'Họ tên của bạn',
    contactNamePlaceholder: 'VD: Anh Minh / Chị Lan...',
    phoneLabel: 'Số điện thoại / Zalo *',
    phonePlaceholder: 'VD: 0908 xxx xxx (Để nhân viên gọi lại)',
    orgNameLabel: 'Tên Công ty / Đơn vị (Nếu có)',
    orgNamePlaceholder: 'VD: Công ty ABC / Hộ kinh doanh...',
    emailLabel: 'Email (Không bắt buộc)',
    emailPlaceholder: 'VD: ten@gmail.com',

    s2Title: 'Bước 2/3: Mong muốn & Yêu cầu riêng của bạn là gì?',
    s2Sub: 'Bấm "Ghi âm giọng nói" để nói trực tiếp (tự động chuyển thành chữ, không cần đánh máy) hoặc nhấn xem gợi ý.',
    wishLabel: 'Mô tả mong muốn / Ý tưởng ứng dụng của bạn:',
    wishPlaceholder: 'Bấm nút Ghi âm 🎙️ bên trên để nói trực tiếp ra chữ, hoặc nhập ngắn gọn mong muốn của bạn tại đây...',
    voiceRecordBtn: '🎙️ Bấm để Ghi âm (Tự chuyển thành chữ)',
    voiceRecordingActive: '⏹️ Đang nghe & chuyển thành chữ... (Bấm để hoàn tất)',
    voiceConvertingNote: '✨ Giọng nói của bạn đang được chuyển trực tiếp thành văn bản bên dưới:',
    toggleSuggestionsBtn: '💡 Nhấn để chọn câu trả lời gợi ý (Không cần gõ)',
    hideSuggestionsBtn: 'Ẩn gợi ý câu trả lời',
    suggestionsList: [
      'Quản lý công việc, hợp đồng & xuất báo cáo tự động',
      'Thay thế file Excel / sổ sách thủ công bằng Web App trên điện thoại',
      'Ứng dụng báo cáo thuế & quản lý doanh thu Hộ kinh doanh',
      'Tích hợp Trợ lý AI tư vấn chuyên môn / tra cứu dữ liệu R&D',
      'Trang web cho khách hàng tự đặt lịch hẹn, đặt hàng & tra cứu',
      'Nền tảng đào tạo nội bộ, học ngoại ngữ & kiểm tra trực tuyến',
      'Landing Page giới thiệu công ty, sản phẩm & thu thập khách hàng'
    ],
    openChatboxBtn: '💬 Tương tác qua Chatbox thông minh',

    s3Title: 'Bước 3/3: Tùy chọn Ngôn ngữ & Đính kèm (Gọn trong 1 bước)',
    s3Sub: 'Chỉ chọn những gì bạn cần — các chi tiết kỹ thuật sâu hơn nhân viên sẽ trao đổi trực tiếp.',
    appLangLabel: '1. Ngôn ngữ hiển thị trên Web App:',
    userScopeLabel: '2. Đối tượng sử dụng chính:',
    userScopeOptions: [
      '👤 Chỉ mình tôi / Cá nhân',
      '👥 Nội bộ công ty (Admin & Nhân viên)',
      '🌐 Có cả Khách hàng / Đối tác truy cập'
    ],
    timelineLabel: '3. Thời gian mong muốn:',
    timelineOptions: [
      '⚡ Cần gấp (3 - 7 ngày)',
      '📅 Tiêu chuẩn (2 - 4 tuần)',
      '💡 Tư vấn khi gọi lại'
    ],
    attachmentSectionLabel: '4. Chụp ảnh mẫu, Ghi âm hoặc Đính kèm file sẵn có (Nếu có):',
    cameraBtn: '📷 Chụp ảnh mẫu / Màn hình',
    attachFileBtn: '📎 Đính kèm File (Excel, Word, Ảnh)',
    refLinkPlaceholder: '🔗 Dán link trang web mẫu hoặc Google Drive (Có thể bấm Ctrl+V dán ảnh)...',

    doneTitle: '🎉 Đã hoàn tất Phiếu Yêu Cầu!',
    doneSub: 'Nhân viên Duy Anh Digital Lab sẽ liên hệ lại với bạn sớm nhất. Bạn có thể In ngay ra 1 trang A4 hoặc gửi qua Email / Zalo:',
    printBigBtn: '🖨️ IN PHIẾU YÊU CẦU (CHUẨN 1 TRANG A4)',
    downloadPdfBtn: '📄 TẢI FILE PDF (1 TRANG A4)',
    sendEmailBtn: 'Gửi Email',
    sendZaloBtn: 'Gửi Zalo',
    previewA4Btn: 'Xem bản in A4',
    editBtn: 'Sửa lại thông tin',
    nextBtn: 'Tiếp theo',
    prevBtn: 'Quay lại',
    finishBtn: 'Hoàn thành',
    resetBtn: 'Làm mới',

    chatTitle: 'Trợ lý Tư vấn Duy Anh Lab',
    chatSub: 'Trả lời nhanh bằng chạm hoặc giọng nói',
    chatGreeting: 'Chào bạn! Bạn chỉ cần nhắn hoặc bấm chọn bên dưới: Bạn muốn làm ứng dụng phục vụ công việc gì? Tôi sẽ tự động tổng hợp vào phiếu cho bạn!',
    chatInputPlaceholder: 'Nhập hoặc bấm Mic 🎙️ để nói...',
    chatQuickReplies: [
      'Tôi muốn làm ứng dụng cho Công ty',
      'Tôi muốn làm ứng dụng Cá nhân',
      'Cần thay thế file Excel đang dùng',
      'Cần tích hợp AI tư vấn thông minh',
      'Nhân viên gọi lại tư vấn kỹ hơn giúp tôi'
    ],
    chatApplyBtn: 'Đóng & Lưu vào Phiếu',

    a4MainTitle: 'PHIẾU YÊU CẦU THIẾT KẾ WEB & ỨNG DỤNG (WEB APP BRIEF)',
    a4SubNote: 'Tiếp nhận: anhpob@gmail.com | Zalo / Hotline: +84 908 095693',
    a4Sec1: '1. THÔNG TIN LIÊN HỆ & MỤC ĐÍCH SỬ DỤNG',
    a4Sec2: '2. MONG MUỐN & YÊU CẦU RIÊNG CỦA KHÁCH HÀNG',
    a4Sec3: '3. NGÔN NGỮ, ĐỐI TƯỢNG SỬ DỤNG & TIẾN ĐỘ',
    a4Sec4: '4. HÌNH ẢNH MẪU, GHI ÂM & TÀI LIỆU ĐÍNH KÈM',
    a4CallbackPromise: '✔ Chuyên viên kỹ thuật Duy Anh Digital Lab sẽ liên hệ trực tiếp để tư vấn chi tiết kiến trúc & demo giải pháp.'
  },

  en: {
    headerTitle: 'WEB & APP DESIGN REQUEST BRIEF',
    subHeaderNote: 'Quick 30-second brief • Our specialist will call you back for detailed consultation',
    step1Tab: '1. Contact & Purpose',
    step2Tab: '2. Your Wishes',
    step3Tab: '3. Language & Files',
    step4Tab: '✅ Finish & Print A4',

    s1Title: 'Step 1/3: Is this Web App for Personal or Company use?',
    s1Sub: 'Leave your basic contact info — our engineering team will call you back to discuss details.',
    usageTypeLabel: 'Purpose of Use:',
    personalUsage: '👤 Personal Application',
    companyUsage: '🏢 Company / Organization',
    contactNameLabel: 'Your Name',
    contactNamePlaceholder: 'e.g., John Doe...',
    phoneLabel: 'Phone / Zalo / WhatsApp *',
    phonePlaceholder: 'e.g., +84 908 xxx xxx (For callback)',
    orgNameLabel: 'Company / Organization (Optional)',
    orgNamePlaceholder: 'e.g., ABC Corp...',
    emailLabel: 'Email (Optional)',
    emailPlaceholder: 'e.g., name@company.com',

    s2Title: 'Step 2/3: What is your main wish & custom requirement?',
    s2Sub: 'Click "Record Voice" to speak directly (auto-converts to text without typing) or tap to view sample ideas.',
    wishLabel: 'Describe your desired Web App / Custom requirements:',
    wishPlaceholder: 'Tap the Record Voice 🎙️ button above to speak directly to text, or briefly type your idea here...',
    voiceRecordBtn: '🎙️ Record Voice (Auto Speech-to-Text)',
    voiceRecordingActive: '⏹️ Listening & converting to text... (Tap to finish)',
    voiceConvertingNote: '✨ Your voice is being automatically transcribed into text below:',
    toggleSuggestionsBtn: '💡 Tap to pick sample answers (No typing needed)',
    hideSuggestionsBtn: 'Hide sample answers',
    suggestionsList: [
      'Manage tasks, contracts & export automated reports',
      'Replace scattered Excel spreadsheets with a mobile-friendly Web App',
      'Business revenue & automated tax reporting application',
      'Integrate an AI Advisor for specialized R&D / data lookup',
      'Client portal for online booking, ordering & status lookup',
      'Internal training, language learning & online testing platform',
      'High-converting brand Landing Page & lead capture'
    ],
    openChatboxBtn: '💬 Interactive Smart Chatbox',

    s3Title: 'Step 3/3: Languages & Attachments (All-in-One Compact Step)',
    s3Sub: 'Select only what you need — our specialist will clarify technical details on the phone.',
    appLangLabel: '1. Languages to support in the Web App:',
    userScopeLabel: '2. Primary Users:',
    userScopeOptions: [
      '👤 Just me / Personal use',
      '👥 Internal Team (Admin & Staff)',
      '🌐 Includes Clients / Partners access'
    ],
    timelineLabel: '3. Preferred Timeline:',
    timelineOptions: [
      '⚡ Urgent (3 - 7 days)',
      '📅 Standard (2 - 4 weeks)',
      '💡 Advise on callback'
    ],
    attachmentSectionLabel: '4. Snap Reference Photo, Voice Note, or Attach Files (Optional):',
    cameraBtn: '📷 Snap Photo / Screenshot',
    attachFileBtn: '📎 Attach File (Excel, Word, Image)',
    refLinkPlaceholder: '🔗 Paste reference link or Google Drive (Or press Ctrl+V to paste screenshot)...',

    doneTitle: '🎉 Your Request Brief is Complete!',
    doneSub: 'Our specialist will contact you shortly. You can Print a 1-Page A4 Brief now or send via Email / Zalo:',
    printBigBtn: '🖨️ PRINT REQUEST BRIEF (1-PAGE A4)',
    downloadPdfBtn: '📄 DOWNLOAD PDF (1-PAGE A4)',
    sendEmailBtn: 'Send Email',
    sendZaloBtn: 'Send Zalo',
    previewA4Btn: 'Preview A4 Sheet',
    editBtn: 'Edit Answers',
    nextBtn: 'Next',
    prevBtn: 'Back',
    finishBtn: 'Complete',
    resetBtn: 'Reset',

    chatTitle: 'Duy Anh Lab Smart Assistant',
    chatSub: 'Quick tap or voice interaction',
    chatGreeting: 'Hello! Simply tap a quick option below or speak/type what you want your Web App to do. I will add it straight to your brief!',
    chatInputPlaceholder: 'Type or tap Mic 🎙️ to speak...',
    chatQuickReplies: [
      'I need a Web App for my Company',
      'I need a Personal Web App',
      'Replace my current Excel files',
      'Integrate an AI Assistant',
      'Please call me to advise in detail'
    ],
    chatApplyBtn: 'Save & Close Chat',

    a4MainTitle: 'WEB & APPLICATION DESIGN REQUEST BRIEF',
    a4SubNote: 'Contact: anhpob@gmail.com | Zalo / Hotline: +84 908 095693',
    a4Sec1: '1. CONTACT INFORMATION & PURPOSE OF USE',
    a4Sec2: '2. CLIENT WISHES & CUSTOM REQUIREMENTS',
    a4Sec3: '3. TARGET LANGUAGES, USER SCOPE & TIMELINE',
    a4Sec4: '4. REFERENCE PHOTOS, VOICE NOTE & ATTACHMENTS',
    a4CallbackPromise: '✔ Duy Anh Digital Lab engineers will contact you directly to advise on architecture & demo solutions.'
  },

  zh: {
    headerTitle: '网站与Web应用定制需求表',
    subHeaderNote: '30秒极简填写 • 技术顾问将回电为您详细解答',
    step1Tab: '1. 联系与用途',
    step2Tab: '2. 需求描述',
    step3Tab: '3. 语言与附件',
    step4Tab: '✅ 完成并打印A4',

    s1Title: '第 1/3 步：请问该应用是个人使用还是公司使用？',
    s1Sub: '只需留下基本联系方式，我们的技术团队将回电与您沟通细节。',
    usageTypeLabel: '使用对象:',
    personalUsage: '👤 个人专属应用',
    companyUsage: '🏢 服务于公司 / 机构',
    contactNameLabel: '您的姓名',
    contactNamePlaceholder: '例如：陈先生 / 林女士...',
    phoneLabel: '联系电话 / Zalo / 微信 *',
    phonePlaceholder: '例如：+84 908 xxx xxx (方便回电沟通)',
    orgNameLabel: '公司 / 单位名称 (选填)',
    orgNamePlaceholder: '例如：ABC公司...',
    emailLabel: '电子邮箱 (选填)',
    emailPlaceholder: '例如：name@company.com',

    s2Title: '第 2/3 步：您的核心愿望与专属需求是什么？',
    s2Sub: '点击“语音录制”直接口述（完成后自动转为文字，无需打字），或点击展开参考选项。',
    wishLabel: '简述您的想法或希望解决的问题:',
    wishPlaceholder: '点击上方“语音录制 🎙️”直接说话转文字，或在此简短输入您的需求...',
    voiceRecordBtn: '🎙️ 点击录音 (自动语音转文字，免打字)',
    voiceRecordingActive: '⏹️ 正在倾听并转文字... (点击完成)',
    voiceConvertingNote: '✨ 您的语音已实时转换为以下文字：',
    toggleSuggestionsBtn: '💡 点击选择常见需求模板 (免打字)',
    hideSuggestionsBtn: '收起常见需求模板',
    suggestionsList: [
      '管理业务流程、合同并自动生成报表',
      '用手机/电脑Web应用替代繁琐的Excel表格',
      '个体工商户营收管理与智能税务申报',
      '集成AI智能顾问辅助专业研发与数据查询',
      '客户自助预约、下单与进度查询系统',
      '企业内部培训、语言学习与在线考核平台',
      '高端企业形象展示与获客Landing Page'
    ],
    openChatboxBtn: '💬 打开智能对话助手互动',

    s3Title: '第 3/3 步：支持语言与附件上传 (一页式极简汇总)',
    s3Sub: '只需勾选核心项 — 详细技术参数由工程师回电沟通。',
    appLangLabel: '1. Web应用需支持的语言:',
    userScopeLabel: '2. 主要使用人群:',
    userScopeOptions: [
      '👤 仅个人使用',
      '👥 公司内部团队 (管理员与员工)',
      '🌐 包含外部客户 / 合作伙伴访问'
    ],
    timelineLabel: '3. 期望上线时间:',
    timelineOptions: [
      '⚡ 加急 (3 - 7天)',
      '📅 标准 (2 - 4周)',
      '💡 回电时详细评估'
    ],
    attachmentSectionLabel: '4. 拍照上传参考样图、录音或现有文件 (选填):',
    cameraBtn: '📷 拍照 / 上传参考截图',
    attachFileBtn: '📎 添加文件 (Excel, Word, 图片)',
    refLinkPlaceholder: '🔗 粘贴参考网站或网盘链接 (支持 Ctrl+V 直接粘贴截图)...',

    doneTitle: '🎉 您的需求表已完成！',
    doneSub: '我们的技术顾问将尽快与您联系。您可以立即打印单页A4需求表，或通过邮件 / Zalo发送：',
    printBigBtn: '🖨️ 打印需求表 (标准单页 A4)',
    downloadPdfBtn: '📄 下载 PDF (单页 A4)',
    sendEmailBtn: '发送邮件',
    sendZaloBtn: '发送 Zalo',
    previewA4Btn: '预览 A4 打印页',
    editBtn: '修改内容',
    nextBtn: '下一步',
    prevBtn: '上一步',
    finishBtn: '完成',
    resetBtn: '重置',

    chatTitle: 'Duy Anh Lab 智能顾问助手',
    chatSub: '支持点击或语音快速互动',
    chatGreeting: '您好！无需繁琐打字，您可以直接点击下方快捷回复，或语音告诉我您想做什么应用，我会自动为您整理到需求表中！',
    chatInputPlaceholder: '输入内容或点击麦克风 🎙️ 说话...',
    chatQuickReplies: [
      '我想开发公司内部管理应用',
      '我想开发个人使用的应用',
      '希望把现有的Excel表格变成Web系统',
      '需要集成AI智能专业顾问',
      '请安排工程师电话联系我详细沟通'
    ],
    chatApplyBtn: '保存并关闭对话',

    a4MainTitle: 'WEB应用程序定制设计需求表 (WEB APP BRIEF)',
    a4SubNote: '接收邮箱: anhpob@gmail.com | Zalo / 热线: +84 908 095693',
    a4Sec1: '1. 联系信息与使用目的',
    a4Sec2: '2. 客户核心愿望与专属定制需求',
    a4Sec3: '3. 支持语言、使用人群与期望周期',
    a4Sec4: '4. 参考图片、语音记录与附件资料',
    a4CallbackPromise: '✔ Duy Anh Digital Lab 技术专家将直接与您联系，提供详细的架构建议与方案演示。'
  },

  ja: {
    headerTitle: 'Webアプリ開発 要件ヒアリングシート',
    subHeaderNote: '30秒で簡単入力 • 担当エンジニアより折り返し詳細をご案内します',
    step1Tab: '1. 連絡先・用途',
    step2Tab: '2. ご要望の記述',
    step3Tab: '3. 言語・添付資料',
    step4Tab: '✅ 完了＆A4印刷',

    s1Title: 'ステップ 1/3：個人用アプリですか？法人・社内用ですか？',
    s1Sub: 'ご連絡先のみご入力ください。詳細は担当エンジニアよりお電話・Zaloにてヒアリングいたします。',
    usageTypeLabel: 'ご利用目的:',
    personalUsage: '👤 個人用アプリケーション',
    companyUsage: '🏢 法人・社内業務向け',
    contactNameLabel: 'お名前',
    contactNamePlaceholder: '例：田中 太郎...',
    phoneLabel: '電話番号 / Zalo *',
    phonePlaceholder: '例：+84 908 xxx xxx (折り返しご連絡用)',
    orgNameLabel: '会社名・組織名 (任意)',
    orgNamePlaceholder: '例：株式会社ABC...',
    emailLabel: 'メールアドレス (任意)',
    emailPlaceholder: '例：name@company.com',

    s2Title: 'ステップ 2/3：実現したいアイデアやご要望をお聞かせください',
    s2Sub: '「音声録音」を押して話すだけで自動的にテキスト化されます（タイピング不要）。回答例から選ぶことも可能です。',
    wishLabel: 'ご希望のアプリ内容・独自要件:',
    wishPlaceholder: '上の「音声録音 🎙️」を押して話すだけで自動文字入力されます。または短くご記入ください...',
    voiceRecordBtn: '🎙️ 音声で話す (自動テキスト変換・文字入力不要)',
    voiceRecordingActive: '⏹️ 音声を聞き取り＆文字変換中... (タップで完了)',
    voiceConvertingNote: '✨ お話しいただいた内容が自動的にテキスト化されています：',
    toggleSuggestionsBtn: '💡 よくある要望例から選ぶ (タップで自動入力)',
    hideSuggestionsBtn: '要望例を閉じる',
    suggestionsList: [
      '業務・契約管理とレポートの自動出力',
      '現在のExcelや紙の管理をスマホ対応Webアプリに置き換えたい',
      '売上集計・税務申告の自動化アプリ',
      '専門データ検索・R&D支援のためのAIアドバイザー搭載',
      '顧客がオンラインで予約・注文・照会できるシステム',
      '社内研修・語学学習・オンラインテストプラットフォーム',
      'ブランド紹介＆顧客獲得用ランディングページ'
    ],
    openChatboxBtn: '💬 チャットボットと対話して入力',

    s3Title: 'ステップ 3/3：対応言語と資料添付 (1ページ集約)',
    s3Sub: '必要な項目だけ選択してください。細かい技術仕様は担当者よりご案内します。',
    appLangLabel: '1. Webアプリに搭載する言語:',
    userScopeLabel: '2. 主な利用者:',
    userScopeOptions: [
      '👤 自分のみ / 個人利用',
      '👥 社内メンバー (管理者・スタッフ)',
      '🌐 社外の顧客・取引先も利用'
    ],
    timelineLabel: '3. ご希望の時期:',
    timelineOptions: [
      '⚡ お急ぎ (3〜7日)',
      '📅 標準 (2〜4週間)',
      '💡 相談して決めたい'
    ],
    attachmentSectionLabel: '4. 参考写真の撮影・音声・既存ファイルの添付 (任意):',
    cameraBtn: '📷 カメラ撮影 / スクショ追加',
    attachFileBtn: '📎 ファイル添付 (Excel, Word, 画像)',
    refLinkPlaceholder: '🔗 参考URLやGoogleドライブのリンク (Ctrl+Vで画像貼付も可)...',

    doneTitle: '🎉 ヒアリングシートが完成しました！',
    doneSub: '担当者より速やかにご連絡いたします。A4（1枚）印刷・PDF保存、またはメール / Zaloで送信できます：',
    printBigBtn: '🖨️ 要件シートを印刷する (A4用紙 1枚)',
    downloadPdfBtn: '📄 PDFをダウンロード (A4 1枚)',
    sendEmailBtn: 'メール送信',
    sendZaloBtn: 'Zalo送信',
    previewA4Btn: 'A4プレビュー',
    editBtn: '内容を修正',
    nextBtn: '次へ',
    prevBtn: '戻る',
    finishBtn: '完了する',
    resetBtn: 'リセット',

    chatTitle: 'Duy Anh Lab スマート相談チャット',
    chatSub: 'タップまたは音声で簡単回答',
    chatGreeting: 'こんにちは！タイピングは不要です。下のボタンを押すか、作りたいアプリを音声・短文で教えてください。自動的にシートへ反映します！',
    chatInputPlaceholder: 'メッセージを入力、または 🎙️ で音声入力...',
    chatQuickReplies: [
      '社内業務用のWebアプリを作りたい',
      '個人用のアプリを作りたい',
      '現在使っているExcelをWeb化したい',
      'AIアドバイザー機能を組み込みたい',
      '電話・Zaloで詳しく相談したい'
    ],
    chatApplyBtn: 'シートに反映して閉じる',

    a4MainTitle: 'Webアプリケーション開発 要件ヒアリングシート (WEB APP BRIEF)',
    a4SubNote: '受付: anhpob@gmail.com | Zalo / 電話: +84 908 095693',
    a4Sec1: '1. ご連絡先・ご利用目的',
    a4Sec2: '2. ご希望のアプリ内容・独自要件',
    a4Sec3: '3. 対応言語・利用者層・ご希望納期',
    a4Sec4: '4. 参考画像・音声メモ・添付ファイル',
    a4CallbackPromise: '✔ Duy Anh Digital Lab のエンジニアより直接ご連絡し、最適な設計とデモをご提案いたします。'
  },

  ko: {
    headerTitle: '웹 & 앱 맞춤 설계 간편 요청서',
    subHeaderNote: '30초 초간단 작성 • 전문 엔지니어가 연락드려 상세히 상담해 드립니다',
    step1Tab: '1. 연락처 & 용도',
    step2Tab: '2. 희망사항 작성',
    step3Tab: '3. 언어 & 파일 첨부',
    step4Tab: '✅ 완료 & A4 인쇄',

    s1Title: '1/3 단계: 개인용 앱인가요, 회사 업무용인가요?',
    s1Sub: '기본 연락처만 남겨주시면 담당 엔지니어가 연락드려 세부 사항을 안내해 드립니다.',
    usageTypeLabel: '사용 목적:',
    personalUsage: '👤 개인용 애플리케이션',
    companyUsage: '🏢 회사 / 기관 업무용',
    contactNameLabel: '성함',
    contactNamePlaceholder: '예: 김민수 / 박지영...',
    phoneLabel: '연락처 / Zalo / 카카오톡 *',
    phonePlaceholder: '예: +84 908 xxx xxx (상담 연락용)',
    orgNameLabel: '회사 / 기관명 (선택)',
    orgNamePlaceholder: '예: ABC 주식회사...',
    emailLabel: '이메일 (선택)',
    emailPlaceholder: '예: name@company.com',

    s2Title: '2/3 단계: 원하시는 기능이나 특별한 요구사항은 무엇인가요?',
    s2Sub: '"음성 녹음"을 눌러 말씀하시면 자동으로 텍스트로 변환됩니다(타이핑 불필요). 예시 답변을 눌러 선택할 수도 있습니다.',
    wishLabel: '희망하시는 웹앱 아이디어 / 요구사항:',
    wishPlaceholder: '위의 "음성 녹음 🎙️" 버튼을 눌러 바로 말씀하시거나 짧게 입력해 주세요...',
    voiceRecordBtn: '🎙️ 음성으로 말하기 (자동 텍스트 변환 · 타이핑 불필요)',
    voiceRecordingActive: '⏹️ 음성을 텍스트로 변환 중... (터치하여 완료)',
    voiceConvertingNote: '✨ 말씀하신 내용이 아래에 텍스트로 자동 입력되고 있습니다:',
    toggleSuggestionsBtn: '💡 자주 찾는 요구사항 예시 보기 (터치하여 선택)',
    hideSuggestionsBtn: '예시 답변 닫기',
    suggestionsList: [
      '업무·계약 관리 및 보고서 자동 생성 시스템',
      '기존 엑셀/수기 장부를 스마트폰·PC 겸용 웹앱으로 전환',
      '매출 관리 및 세무 신고 자동화 웹앱',
      '전문 데이터 검색 및 R&D 지원을 위한 AI 어드바이저 탑재',
      '고객 셀프 예약, 주문 및 실시간 조회 웹앱',
      '사내 교육, 외국어 학습 및 온라인 테스트 플랫폼',
      '기업/브랜드 소개 및 고객 문의 수집 랜딩페이지'
    ],
    openChatboxBtn: '💬 스마트 챗봇으로 간편 대화하기',

    s3Title: '3/3 단계: 지원 언어 및 첨부파일 (한 페이지로 끝내기)',
    s3Sub: '필요한 항목만 가볍게 선택하세요 — 세부 기술 사항은 상담 시 안내해 드립니다.',
    appLangLabel: '1. 웹앱에 탑재할 언어:',
    userScopeLabel: '2. 주요 사용자:',
    userScopeOptions: [
      '👤 개인 단독 사용',
      '👥 사내 임직원 (관리자 & 직원)',
      '🌐 외부 고객 / 파트너사 함께 사용'
    ],
    timelineLabel: '3. 희망 일정:',
    timelineOptions: [
      '⚡ 긴급 (3 - 7일)',
      '📅 표준 (2 - 4주)',
      '💡 통화 후 결정'
    ],
    attachmentSectionLabel: '4. 샘플 사진 촬영, 음성 또는 보유 파일 첨부 (선택):',
    cameraBtn: '📷 카메라 촬영 / 캡처 사진',
    attachFileBtn: '📎 파일 첨부 (엑셀, 워드, 사진)',
    refLinkPlaceholder: '🔗 참고 사이트 또는 구글 드라이브 링크 (Ctrl+V로 캡처 이미지 바로 붙여넣기)...',

    doneTitle: '🎉 요청서 작성이 완료되었습니다!',
    doneSub: '담당자가 빠르게 연락드리겠습니다. 지금 바로 A4 1장으로 인쇄하거나 이메일 / Zalo로 전송할 수 있습니다:',
    printBigBtn: '🖨️ 요청서 인쇄하기 (A4 1장 맞춤)',
    downloadPdfBtn: '📄 PDF 다운로드 (A4 1장)',
    sendEmailBtn: '이메일 전송',
    sendZaloBtn: 'Zalo 전송',
    previewA4Btn: 'A4 인쇄 미리보기',
    editBtn: '내용 수정',
    nextBtn: '다음',
    prevBtn: '이전',
    finishBtn: '작성 완료',
    resetBtn: '초기화',

    chatTitle: 'Duy Anh Lab 스마트 상담 챗봇',
    chatSub: '터치나 음성으로 간편하게 답변하세요',
    chatGreeting: '안녕하세요! 길게 타이핑하실 필요 없이 아래 버튼을 누르시거나 원하시는 앱을 음성/짧은 글로 말씀해 주시면 요청서에 자동으로 정리해 드립니다!',
    chatInputPlaceholder: '메시지를 입력하거나 🎙️ 버튼으로 말씀하세요...',
    chatQuickReplies: [
      '회사 업무용 웹앱을 만들고 싶어요',
      '개인용 웹앱을 만들고 싶어요',
      '사용 중인 엑셀 파일을 웹앱으로 바꾸고 싶어요',
      'AI 상담/분석 기능을 넣고 싶어요',
      '담당자가 전화/Zalo로 상세히 상담해 주세요'
    ],
    chatApplyBtn: '요청서에 반영 후 닫기',

    a4MainTitle: '웹 & 애플리케이션 맞춤 설계 요청서 (WEB APP BRIEF)',
    a4SubNote: '접수처: anhpob@gmail.com | Zalo / 직통전화: +84 908 095693',
    a4Sec1: '1. 연락처 및 사용 목적',
    a4Sec2: '2. 고객 핵심 희망사항 및 맞춤 요구사항',
    a4Sec3: '3. 지원 언어, 주요 사용자 및 희망 일정',
    a4Sec4: '4. 참고 사진, 음성 메모 및 첨부 자료',
    a4CallbackPromise: '✔ Duy Anh Digital Lab 전문 엔지니어가 직접 연락드려 최적의 설계와 데모를 안내해 드립니다.'
  }
};

export default function App() {
  const [lang, setLang] = useState<LangCode>('vi');
  const c = COMPACT_TEXT[lang];
  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  // 3 Ultra-Simple Steps (1: Contact & Usage, 2: Wishes + Voice-to-Text + Suggestions/Chat, 3: Merged Lang/Timeline/Files, 4: Done & Print)
  const [step, setStep] = useState<number>(1);

  // Step 1 State
  const [usageType, setUsageType] = useState<'personal' | 'company'>('company');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Step 2 State: Wishes (Only 1 clean box + expandable suggestions + auto voice-to-text)
  const [wishText, setWishText] = useState('');
  const [selectedSuggestionsIdx, setSelectedSuggestionsIdx] = useState<number[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Step 3 State (Merged 3-4-5 into 1 clean screen)
  const [selectedAppLangsIdx, setSelectedAppLangsIdx] = useState<number[]>([0, 1]);
  const [userScopeIdx, setUserScopeIdx] = useState<number>(1);
  const [timelineIdx, setTimelineIdx] = useState<number>(1);
  const [referenceLink, setReferenceLink] = useState('');
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);

  // Voice Recording + Real-time Speech-to-Text
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptAccumRef = useRef<string>('');

  // Interactive Chatbox State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatRecording, setIsChatRecording] = useState(false);

  // UI & Modal States
  const [showA4Preview, setShowA4Preview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [sendModal, setSendModal] = useState<{
    open: boolean;
    channel: 'email' | 'zalo' | null;
    sendingCloud: boolean;
    cloudSent: boolean;
  }>({
    open: false,
    channel: null,
    sendingCloud: false,
    cloudSent: false
  });

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const photoUploadRef = useRef<HTMLInputElement | null>(null);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const a4SheetRef = useRef<HTMLDivElement | null>(null);

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Initialize chat greeting when language changes
  useEffect(() => {
    setChatMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: COMPACT_TEXT[lang].chatGreeting
      }
    ]);
  }, [lang]);

  // Handle Ctrl+V paste screenshot anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            addImageFile(file, `Screenshot-${Date.now().toString().slice(-4)}.png`);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3200);
  };

  const toggleIndex = (
    list: number[],
    setList: React.Dispatch<React.SetStateAction<number[]>>,
    idx: number
  ) => {
    if (list.includes(idx)) {
      setList(list.filter((i) => i !== idx));
    } else {
      setList([...list, idx].sort((a, b) => a - b));
    }
  };

  // Toggle a sample suggestion and append/remove it cleanly in wishText
  const handleToggleSuggestion = (idx: number) => {
    const textItem = c.suggestionsList[idx];
    const alreadySelected = selectedSuggestionsIdx.includes(idx);

    if (alreadySelected) {
      setSelectedSuggestionsIdx((prev) => prev.filter((i) => i !== idx));
      setWishText((prev) =>
        prev
          .split('\n')
          .filter((line) => line.trim() !== `• ${textItem}` && line.trim() !== textItem)
          .join('\n')
      );
    } else {
      setSelectedSuggestionsIdx((prev) => [...prev, idx]);
      setWishText((prev) => {
        const cleanPrev = prev.trim();
        return cleanPrev ? `${cleanPrev}\n• ${textItem}` : `• ${textItem}`;
      });
      showToast(`✓ Đã thêm vào yêu cầu!`);
    }
  };

  const resetForm = () => {
    setUsageType('company');
    setContactName('');
    setContactPhone('');
    setCompanyName('');
    setContactEmail('');
    setWishText('');
    setSelectedSuggestionsIdx([]);
    setShowSuggestions(false);
    setSelectedAppLangsIdx([0, 1]);
    setUserScopeIdx(1);
    setTimelineIdx(1);
    setReferenceLink('');
    setCapturedImages([]);
    setAttachedDocs([]);
    setAudioUrl(null);
    setAudioBlob(null);
    setLiveTranscript('');
    setStep(1);
    showToast('✓ Đã làm mới phiếu yêu cầu');
  };

  // ==================== VOICE RECORDING -> AUTO TEXT (SPEECH-TO-TEXT) ====================
  const startVoiceToTextRecording = async () => {
    setLiveTranscript('');
    finalTranscriptAccumRef.current = '';

    // 1. Start SpeechRecognition so voice is converted directly into text without typing
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLangMeta.speechLang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalChunk = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcriptPiece + ' ';
          } else {
            interim += transcriptPiece;
          }
        }
        if (finalChunk.trim()) {
          finalTranscriptAccumRef.current = `${finalTranscriptAccumRef.current} ${finalChunk.trim()}`.trim();
          setWishText((prev) => {
            const clean = prev.trim();
            return clean ? `${clean} ${finalChunk.trim()}` : finalChunk.trim();
          });
        }
        setLiveTranscript(interim);
      };

      recognition.onerror = () => {
        // Keep recording audio if speech recognition pauses
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        // Ignore
      }
    }

    // 2. Also start MediaRecorder so audio file is saved as backup attachment
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      if (SpeechRecognition) {
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = window.setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        alert('Vui lòng cấp quyền Micro trên trình duyệt để ghi âm giọng nói thành chữ.');
      }
    }
  };

  const stopVoiceToTextRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Flush any remaining interim transcript into wishText
    if (liveTranscript.trim()) {
      const leftover = liveTranscript.trim();
      setWishText((prev) => (prev.trim() ? `${prev.trim()} ${leftover}` : leftover));
      setLiveTranscript('');
    }

    setIsRecording(false);
    showToast('✅ Đã chuyển giọng nói thành văn bản (Text)!');
  };

  // Chatbox Interaction
  const handleSendChatMessage = (textToSend?: string) => {
    const msg = (textToSend ?? chatInput).trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg
    };

    // Append to wishText automatically
    if (msg.includes('Cá nhân') || msg.includes('Personal') || msg.includes('个人') || msg.includes('個人')) {
      setUsageType('personal');
    } else if (msg.includes('Công ty') || msg.includes('Company') || msg.includes('公司') || msg.includes('社内') || msg.includes('회사')) {
      setUsageType('company');
    }

    setWishText((prev) => {
      const clean = prev.trim();
      return clean ? `${clean}\n• ${msg}` : `• ${msg}`;
    });

    const botReply: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      text:
        lang === 'vi'
          ? `✔ Đã ghi nhận vào Phiếu Yêu Cầu: "${msg}". Bạn có muốn bổ sung thêm yêu cầu nào nữa không, hay nhấn "Đóng & Lưu vào Phiếu"?`
          : `✔ Added to your Request Brief: "${msg}". Anything else to add, or click "Save & Close Chat"?`
    };

    setChatMessages((prev) => [...prev, userMsg, botReply]);
    if (!textToSend) setChatInput('');
  };

  const toggleChatVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt không hỗ trợ nhận diện giọng nói trực tiếp.');
      return;
    }

    if (isChatRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsChatRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLangMeta.speechLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsChatRecording(true);
    recognition.onend = () => setIsChatRecording(false);
    recognition.onerror = () => setIsChatRecording(false);
    recognition.onresult = (e: any) => {
      const spoken = e.results[0]?.[0]?.transcript;
      if (spoken) {
        handleSendChatMessage(spoken);
      }
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Camera & Image Handling
  const addImageFile = (file: File, customName?: string) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        setCapturedImages((prev) => [
          ...prev.slice(0, 3),
          {
            id: `${Date.now()}-${Math.random()}`,
            name: customName || file.name,
            dataUrl: compressedDataUrl,
            file
          }
        ]);
        showToast(`📷 Đã thêm ảnh: ${customName || file.name}`);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => addImageFile(f));
    e.target.value = '';
  };

  const handleDocInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (f.type.startsWith('image/')) {
        addImageFile(f);
      } else {
        const sizeKB = Math.round(f.size / 1024);
        setAttachedDocs((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            name: f.name,
            size: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
            file: f
          }
        ]);
      }
    });
    showToast('📎 Đã đính kèm file!');
    e.target.value = '';
  };

  const appLangOptions = APP_TARGET_LANGUAGES[lang];
  const selectedAppLangs = selectedAppLangsIdx.map((i) => appLangOptions[i]).filter(Boolean);
  const selectedScope = c.userScopeOptions[userScopeIdx] || c.userScopeOptions[1];
  const selectedTimeline = c.timelineOptions[timelineIdx] || c.timelineOptions[1];
  const usageLabelText = usageType === 'personal' ? c.personalUsage : c.companyUsage;

  // Build concise, clean summary text for Email & Zalo
  const buildFormattedBriefText = () => {
    const lines = [
      `📋 ${c.a4MainTitle} — DUY ANH DIGITAL LAB`,
      `Ngày: ${todayStr} | Ngôn ngữ phiếu: ${currentLangMeta.fullName}`,
      `--------------------------------------------------`,
      `1. LIÊN HỆ & MỤC ĐÍCH SỬ DỤNG:`,
      `• Mục đích: ${usageLabelText}`,
      `• Người liên hệ: ${contactName || '---'}`,
      `• SĐT / Zalo: ${contactPhone || '---'}`,
      companyName ? `• Công ty / Đơn vị: ${companyName}` : null,
      contactEmail ? `• Email: ${contactEmail}` : null,
      ``,
      `2. MONG MUỐN & YÊU CẦU RIÊNG:`,
      wishText || '• Trao đổi trực tiếp khi nhân viên gọi lại',
      ``,
      `3. NGÔN NGỮ & TÙY CHỌN NHANH:`,
      `• Ngôn ngữ tích hợp: ${selectedAppLangs.join(', ') || 'Tiếng Việt'}`,
      `• Đối tượng sử dụng: ${selectedScope}`,
      `• Thời gian mong muốn: ${selectedTimeline}`,
      `• Đính kèm: ${
        [
          audioUrl ? `Ghi âm (${formatDuration(recordingSeconds)})` : '',
          capturedImages.length > 0 ? `${capturedImages.length} ảnh mẫu` : '',
          attachedDocs.length > 0 ? attachedDocs.map((d) => d.name).join(', ') : '',
          referenceLink ? `Link: ${referenceLink}` : ''
        ]
          .filter(Boolean)
          .join(' | ') || 'Không'
      }`,
      `--------------------------------------------------`,
      `🌐 Hệ sinh thái Duy Anh Digital Lab: https://ungdung.vercel.app`,
      `📧 Email: anhpob@gmail.com | 💬 Zalo: +84 908 095693`
    ].filter((l) => l !== null);
    return lines.join('\n');
  };

  // Generate 1-Page A4 PDF
  const generateA4PdfBlob = async (): Promise<{ blob: Blob; fileName: string } | null> => {
    if (!a4SheetRef.current) return null;
    setIsGeneratingPdf(true);
    try {
      const element = a4SheetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 6;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      const ratio = canvas.width / canvas.height;
      let renderW = maxW;
      let renderH = renderW / ratio;

      if (renderH > maxH) {
        renderH = maxH;
        renderW = renderH * ratio;
      }

      const xOffset = (pageWidth - renderW) / 2;
      const yOffset = margin;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderW, renderH);

      const safeName = (contactName || companyName || 'KhachHang')
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .slice(0, 24);
      const fileName = `Phieu-Yeu-Cau-WebApp-${safeName}.pdf`;
      const blob = pdf.output('blob');
      return { blob, fileName };
    } catch (error) {
      console.error('PDF generation error:', error);
      return null;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadPdf = async () => {
    const result = await generateA4PdfBlob();
    if (result) {
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.fileName;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📄 Đã tải File PDF (1 Trang A4)!');
    } else {
      window.print();
    }
  };

  const handlePrintA4 = () => {
    window.print();
  };

  const downloadVoiceRecording = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `Ghi-am-yeu-cau-${Date.now().toString().slice(-4)}.webm`;
    a.click();
  };

  const handleNativeShareWithFiles = async () => {
    const text = buildFormattedBriefText();
    const filesToShare: File[] = [];

    const pdfRes = await generateA4PdfBlob();
    if (pdfRes) {
      filesToShare.push(new File([pdfRes.blob], pdfRes.fileName, { type: 'application/pdf' }));
    }
    if (audioBlob) {
      filesToShare.push(new File([audioBlob], 'Voice-Brief.webm', { type: 'audio/webm' }));
    }
    capturedImages.forEach((img) => {
      if (img.file) filesToShare.push(img.file);
    });
    attachedDocs.forEach((doc) => {
      filesToShare.push(doc.file);
    });

    const nav = navigator as any;
    if (nav.share) {
      try {
        if (filesToShare.length > 0 && nav.canShare && nav.canShare({ files: filesToShare })) {
          await nav.share({
            title: `Phiếu Yêu Cầu Web App - ${contactName || companyName || 'Duy Anh Digital Lab'}`,
            text,
            files: filesToShare
          });
          return;
        } else {
          await nav.share({
            title: `Phiếu Yêu Cầu Web App - ${contactName || companyName || 'Duy Anh Digital Lab'}`,
            text
          });
          return;
        }
      } catch {
        // Fallback
      }
    }
    await navigator.clipboard.writeText(text);
    showToast('✓ Đã sao chép nội dung!');
  };

  const handleOpenSendChannel = async (channel: 'email' | 'zalo') => {
    const summaryText = buildFormattedBriefText();
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Ignore
    }

    setSendModal({
      open: true,
      channel,
      sendingCloud: channel === 'email',
      cloudSent: false
    });

    if (channel === 'email') {
      try {
        const formData = new FormData();
        formData.append(
          '_subject',
          `[Yêu Cầu Thiết Kế Web App] ${contactName || companyName || contactPhone || 'Khách hàng mới'}`
        );
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('Mục đích sử dụng', usageLabelText);
        formData.append('Người liên hệ', contactName || '---');
        formData.append('SĐT / Zalo', contactPhone || '---');
        formData.append('Công ty / Đơn vị', companyName || '---');
        formData.append('Email', contactEmail || '---');
        formData.append('Mong muốn & Yêu cầu riêng', wishText || 'Trao đổi khi gọi lại');
        formData.append('Ngôn ngữ tích hợp', selectedAppLangs.join(', '));
        formData.append('Đối tượng sử dụng', selectedScope);
        formData.append('Tiến độ', selectedTimeline);
        formData.append('Link tham khảo', referenceLink || '---');
        formData.append('Bản tóm tắt', summaryText);

        if (audioBlob) {
          formData.append('attachment_audio', audioBlob, 'Voice-Brief.webm');
        }
        if (capturedImages[0]?.file) {
          formData.append('attachment_photo', capturedImages[0].file, capturedImages[0].name);
        }
        if (attachedDocs[0]?.file) {
          formData.append('attachment_doc', attachedDocs[0].file, attachedDocs[0].name);
        }

        fetch('https://formsubmit.co/ajax/anhpob@gmail.com', {
          method: 'POST',
          body: formData
        })
          .then((res) => res.json())
          .then(() => {
            setSendModal((prev) => ({ ...prev, sendingCloud: false, cloudSent: true }));
          })
          .catch(() => {
            setSendModal((prev) => ({ ...prev, sendingCloud: false, cloudSent: false }));
          });
      } catch {
        setSendModal((prev) => ({ ...prev, sendingCloud: false }));
      }
    }
  };

  const openMailClient = () => {
    const subject = encodeURIComponent(
      `[Yêu Cầu Thiết Kế Web App] ${contactName || companyName || 'Khách hàng'} - ${todayStr}`
    );
    const body = encodeURIComponent(buildFormattedBriefText());
    window.location.href = `mailto:anhpob@gmail.com?subject=${subject}&body=${body}`;
  };

  const openGmailWeb = () => {
    const subject = encodeURIComponent(
      `[Yêu Cầu Thiết Kế Web App] ${contactName || companyName || 'Khách hàng'} - ${todayStr}`
    );
    const body = encodeURIComponent(buildFormattedBriefText());
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=anhpob@gmail.com&su=${subject}&body=${body}`,
      '_blank'
    );
  };

  const openZaloChat = async () => {
    const text = buildFormattedBriefText();
    try {
      await navigator.clipboard.writeText(text);
      showToast('✓ Đã copy! Hãy nhấn Dán (Ctrl+V) vào Zalo.');
    } catch {
      // Ignore
    }
    window.open('https://zalo.me/84908095693', '_blank');
  };

  const stepTabs = [c.step1Tab, c.step2Tab, c.step3Tab, c.step4Tab];

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-50 via-white to-amber-50/30 text-slate-900">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="no-print fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-300 font-bold text-base px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-amber-400/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ==================== ULTRA-SIMPLE 3-STEP INTERVIEW WIZARD ==================== */}
      <div className="no-print flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* TOP HEADER: Brand + 5 Languages */}
        <header className="space-y-3 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
            <a
              href="https://ungdung.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3"
            >
              <img
                src="/logo-duyanhlab.jpg"
                alt="Duy Anh Digital Lab"
                className="h-11 sm:h-12 w-auto rounded-xl border border-slate-200 shadow-sm object-cover"
              />
              <div>
                <div className="text-xs font-extrabold tracking-wider text-amber-700 uppercase">
                  DUY ANH LAB • digital
                </div>
                <h1 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {c.headerTitle}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5" /> {c.subHeaderNote}
                </p>
              </div>
            </a>

            {/* 5-Language Switcher */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <Languages className="w-4 h-4 text-slate-600 ml-1 hidden sm:inline" />
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`text-xs sm:text-sm font-bold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    lang === l.code
                      ? 'bg-slate-900 text-amber-300 shadow-md'
                      : 'text-slate-700 hover:bg-white hover:text-slate-950'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4-Tab Progress Bar (3 Questions + Finish) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stepTabs.map((label, idx) => {
              const sNum = idx + 1;
              const isCurrent = step === sNum;
              const isPassed = step > sNum;
              return (
                <button
                  key={sNum}
                  type="button"
                  onClick={() => setStep(sNum)}
                  className={`text-sm sm:text-base font-extrabold py-3 px-3 rounded-2xl border-2 transition truncate text-center ${
                    isCurrent
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800'
                  }`}
                >
                  {isPassed && sNum < 4 ? `✓ ${label}` : label}
                </button>
              );
            })}
          </div>
        </header>

        {/* MAIN INTERVIEW CARD */}
        <main className="flex-1 flex flex-col justify-center">
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-xl">
            {/* ==================== STEP 1/3: LIÊN HỆ & MỤC ĐÍCH (CÁ NHÂN / CÔNG TY) ==================== */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {c.s1Title}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">{c.s1Sub}</p>
                </div>

                {/* Personal vs Company Big Toggle */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2.5">
                    {c.usageTypeLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setUsageType('personal')}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                        usageType === 'personal'
                          ? 'bg-amber-50 border-amber-600 text-slate-950 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            usageType === 'personal'
                              ? 'bg-slate-900 text-amber-300'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          <User className="w-6 h-6" />
                        </div>
                        <span className="text-lg sm:text-xl font-extrabold">
                          {c.personalUsage}
                        </span>
                      </div>
                      {usageType === 'personal' && (
                        <CheckCircle2 className="w-6 h-6 text-amber-600 shrink-0" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setUsageType('company')}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                        usageType === 'company'
                          ? 'bg-amber-50 border-amber-600 text-slate-950 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            usageType === 'company'
                              ? 'bg-slate-900 text-amber-300'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-lg sm:text-xl font-extrabold">
                          {c.companyUsage}
                        </span>
                      </div>
                      {usageType === 'company' && (
                        <CheckCircle2 className="w-6 h-6 text-amber-600 shrink-0" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Simple Contact Inputs (No Expected App Name, No Clutter) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                      {c.contactNameLabel}
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={c.contactNamePlaceholder}
                      className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3.5 text-lg sm:text-xl font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-extrabold text-amber-800 mb-1.5">
                      {c.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={c.phonePlaceholder}
                      className="w-full bg-amber-50/50 focus:bg-white border-2 border-amber-400 focus:border-slate-900 rounded-2xl px-4 py-3.5 text-lg sm:text-xl font-bold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  {usageType === 'company' && (
                    <div>
                      <label className="block text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                        {c.orgNameLabel}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={c.orgNamePlaceholder}
                        className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                      />
                    </div>
                  )}

                  <div className={usageType === 'personal' ? 'sm:col-span-2' : ''}>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                      {c.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder={c.emailPlaceholder}
                      className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 2/3: CHỈ GHI NHẬN MONG MUỐN (GHI ÂM RA TEXT / GỢI Ý ẨN-HIỆN / CHATBOX) ==================== */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {c.s2Title}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">{c.s2Sub}</p>
                </div>

                {/* Big Action Bar: 1. Voice Record (Auto to Text) | 2. Toggle Suggestions | 3. Open Chatbox */}
                <div className="flex flex-wrap items-center gap-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startVoiceToTextRecording}
                      className="flex-1 min-w-[240px] py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2.5 transition"
                    >
                      <Mic className="w-6 h-6 shrink-0" />
                      <span>{c.voiceRecordBtn}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopVoiceToTextRecording}
                      className="flex-1 min-w-[240px] py-4 px-5 rounded-2xl bg-slate-900 text-amber-300 border-2 border-rose-500 font-extrabold text-base sm:text-lg shadow-xl flex items-center justify-center gap-2.5 animate-pulse"
                    >
                      <Square className="w-6 h-6 fill-rose-500 text-rose-500 shrink-0" />
                      <span>
                        {c.voiceRecordingActive} ({formatDuration(recordingSeconds)})
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className={`py-4 px-5 rounded-2xl border-2 font-extrabold text-base sm:text-lg flex items-center gap-2 transition ${
                      showSuggestions
                        ? 'bg-amber-100 border-amber-500 text-slate-950'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>{showSuggestions ? c.hideSuggestionsBtn : c.toggleSuggestionsBtn}</span>
                    {showSuggestions ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="py-4 px-5 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-extrabold text-base sm:text-lg flex items-center gap-2 transition"
                  >
                    <Bot className="w-6 h-6 text-sky-600 shrink-0" />
                    <span>{c.openChatboxBtn}</span>
                  </button>
                </div>

                {/* Expandable Sample Answers (HIDDEN BY DEFAULT SO IT DOES NOT CLUTTER THE SCREEN!) */}
                {showSuggestions && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2 animate-fadeIn">
                    <div className="text-sm sm:text-base font-bold text-amber-900 mb-1">
                      Chạm vào câu gợi ý bất kỳ để tự động điền vào ô mong muốn bên dưới:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {c.suggestionsList.map((item, idx) => {
                        const active = selectedSuggestionsIdx.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleToggleSuggestion(idx)}
                            className={`text-left text-base font-semibold px-4 py-3 rounded-xl border-2 transition flex items-start gap-2.5 ${
                              active
                                ? 'bg-slate-900 text-amber-300 border-slate-900 font-bold shadow'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
                            }`}
                          >
                            <span className="font-bold shrink-0">{active ? '✓' : '+'}</span>
                            <span>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Live Voice-to-Text Indicator */}
                {isRecording && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-base font-semibold flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shrink-0" />
                    <div>
                      <div>{c.voiceConvertingNote}</div>
                      {liveTranscript && (
                        <div className="text-slate-900 font-bold italic mt-1">
                          &quot;{liveTranscript}...&quot;
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Clean Wish Textarea */}
                <div>
                  <label className="block text-base sm:text-xl font-extrabold text-slate-900 mb-2">
                    {c.wishLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder={c.wishPlaceholder}
                    className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl p-4 text-lg sm:text-xl font-medium text-slate-900 placeholder-slate-400 outline-none resize-none transition leading-relaxed"
                  />
                </div>

                {/* Audio playback if recorded */}
                {audioUrl && (
                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-300 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                      <Volume2 className="w-5 h-5 text-rose-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-700">File ghi âm đính kèm:</span>
                      <audio src={audioUrl} controls className="h-9 w-full max-w-xs" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioUrl(null);
                        setAudioBlob(null);
                      }}
                      className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                    >
                      Xóa file âm thanh
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ==================== STEP 3/3: GỘP GỌN PHẦN 3-4-5 TRONG 1 TRANG DUY NHẤT ==================== */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {c.s3Title}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">{c.s3Sub}</p>
                </div>

                {/* 1. Target Languages (Việt, Anh, Hoa, Nhật, Hàn) */}
                <div className="bg-amber-50/60 border-2 border-amber-200 rounded-2xl p-4">
                  <label className="block text-base sm:text-lg font-extrabold text-slate-900 mb-2.5">
                    {c.appLangLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {appLangOptions.map((label, idx) => {
                      const active = selectedAppLangsIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            toggleIndex(selectedAppLangsIdx, setSelectedAppLangsIdx, idx)
                          }
                          className={`text-sm sm:text-base font-bold py-3 px-3 rounded-xl border-2 transition flex items-center justify-center gap-1.5 ${
                            active
                              ? 'bg-slate-900 text-amber-300 border-slate-900 shadow'
                              : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span>{active ? '✓' : '+'}</span>
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2 & 3. User Scope + Timeline side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <label className="block text-base sm:text-lg font-extrabold text-slate-900 mb-2">
                      {c.userScopeLabel}
                    </label>
                    <div className="space-y-2">
                      {c.userScopeOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUserScopeIdx(idx)}
                          className={`w-full text-left text-base font-bold px-3.5 py-2.5 rounded-xl border-2 transition flex items-center justify-between ${
                            userScopeIdx === idx
                              ? 'bg-slate-900 text-amber-300 border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {userScopeIdx === idx && <Check className="w-5 h-5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <label className="block text-base sm:text-lg font-extrabold text-slate-900 mb-2">
                      {c.timelineLabel}
                    </label>
                    <div className="space-y-2">
                      {c.timelineOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTimelineIdx(idx)}
                          className={`w-full text-left text-base font-bold px-3.5 py-2.5 rounded-xl border-2 transition flex items-center justify-between ${
                            timelineIdx === idx
                              ? 'bg-slate-900 text-amber-300 border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {timelineIdx === idx && <Check className="w-5 h-5 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Compact Camera / File Attachment Bar */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <label className="block text-base sm:text-lg font-extrabold text-slate-900">
                    {c.attachmentSectionLabel}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Camera className="w-5 h-5" />
                      <span>{c.cameraBtn}</span>
                    </button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageInputChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileUploadRef.current?.click()}
                      className="py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 font-extrabold text-base flex items-center justify-center gap-2 transition"
                    >
                      <Paperclip className="w-5 h-5 text-amber-600" />
                      <span>{c.attachFileBtn}</span>
                    </button>
                    <input
                      ref={fileUploadRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,audio/*"
                      onChange={handleDocInputChange}
                      className="hidden"
                    />
                  </div>

                  {/* Thumbnails if captured */}
                  {capturedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {capturedImages.map((img) => (
                        <div
                          key={img.id}
                          className="relative h-20 rounded-xl overflow-hidden border border-slate-300 bg-white"
                        >
                          <img
                            src={img.dataUrl}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCapturedImages((prev) => prev.filter((i) => i.id !== img.id))
                            }
                            className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={photoUploadRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageInputChange}
                    className="hidden"
                  />

                  {/* Attached Docs */}
                  {attachedDocs.length > 0 && (
                    <div className="space-y-1.5">
                      {attachedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between text-sm font-semibold bg-white border border-slate-200 px-3 py-2 rounded-xl"
                        >
                          <span className="truncate flex items-center gap-2 text-slate-800">
                            <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                            {doc.name} ({doc.size})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setAttachedDocs((prev) => prev.filter((d) => d.id !== doc.id))
                            }
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="url"
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    placeholder={c.refLinkPlaceholder}
                    className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-base text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* ==================== STEP 4: HOÀN THÀNH & BẤM IN PHIẾU YÊU CẦU ==================== */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2 pb-2 border-b border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCheck className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {c.doneTitle}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                    {c.doneSub}
                  </p>
                </div>

                {/* GIANT PRINT A4 & DOWNLOAD PDF BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handlePrintA4}
                    className="py-5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                  >
                    <Printer className="w-7 h-7 shrink-0" />
                    <span>{c.printBigBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="py-5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                  >
                    <FileDown className="w-7 h-7 shrink-0" />
                    <span>{isGeneratingPdf ? '...' : c.downloadPdfBtn}</span>
                  </button>
                </div>

                {/* Send Email / Zalo / Preview A4 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenSendChannel('email')}
                    className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition"
                  >
                    <Mail className="w-6 h-6 shrink-0" />
                    <div className="text-left leading-tight">
                      <div>{c.sendEmailBtn}</div>
                      <div className="text-xs font-medium opacity-90">anhpob@gmail.com</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenSendChannel('zalo')}
                    className="py-4 px-5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition"
                  >
                    <MessageCircle className="w-6 h-6 shrink-0" />
                    <div className="text-left leading-tight">
                      <div>{c.sendZaloBtn}</div>
                      <div className="text-xs font-semibold opacity-90">+84 908 095693</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowA4Preview(true)}
                    className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-6 h-6 text-slate-700" />
                    <span>{c.previewA4Btn}</span>
                  </button>
                </div>

                {/* Clean Summary Box */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2.5 text-base">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-lg">
                      📋 Tóm tắt Phiếu Yêu Cầu của bạn:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm font-bold text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" /> {c.editBtn}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-base">
                    <div>
                      <span className="text-slate-500">Mục đích: </span>
                      <strong className="text-slate-900">{usageLabelText}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Liên hệ: </span>
                      <strong className="text-slate-900">
                        {contactName || companyName || '---'} ({contactPhone || '---'})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Ngôn ngữ App: </span>
                      <strong className="text-amber-800">{selectedAppLangs.join(', ')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Tiến độ: </span>
                      <strong className="text-slate-900">{selectedTimeline}</strong>
                    </div>
                    <div className="sm:col-span-2 pt-1 border-t border-slate-200/80">
                      <span className="text-slate-500 block mb-0.5">Mong muốn &amp; Yêu cầu riêng:</span>
                      <div className="font-bold text-slate-900 whitespace-pre-line">
                        {wishText || 'Trao đổi trực tiếp khi nhân viên gọi lại'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM NAVIGATION BAR */}
            <div className="mt-7 pt-4 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-base sm:text-lg font-bold px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-2 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{c.prevBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-semibold px-4 py-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{c.resetBtn}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < 4 && (
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-sm sm:text-base font-bold px-4 py-3 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    Hoàn thành ngay →
                  </button>
                )}

                {step < 3 && (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="text-base sm:text-xl font-extrabold px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 shadow-lg flex items-center gap-2.5 transition"
                  >
                    <span>{c.nextBtn}</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-base sm:text-xl font-extrabold px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center gap-2.5 transition"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>{c.finishBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== FLOATING SMART CHATBOX BUTTON & MODAL ==================== */}
      <div className="no-print fixed bottom-5 right-5 z-40">
        {!chatOpen ? (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-sm sm:text-base shadow-2xl border-2 border-amber-400/60 transition transform hover:scale-105"
          >
            <Bot className="w-6 h-6 text-amber-300" />
            <span>{c.openChatboxBtn}</span>
          </button>
        ) : (
          <div className="w-[340px] sm:w-[400px] bg-white border-2 border-slate-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-amber-300">{c.chatTitle}</div>
                  <div className="text-[11px] text-slate-300">{c.chatSub}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto thin-scroll bg-slate-50">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:text-base leading-snug ${
                      m.sender === 'user'
                        ? 'bg-slate-900 text-amber-300 font-semibold'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Reply Chips inside Chatbox */}
            <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto thin-scroll">
              {c.chatQuickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChatMessage(qr)}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-800 border border-slate-300 shrink-0 transition"
                >
                  + {qr}
                </button>
              ))}
            </div>

            {/* Chat Input + Voice Mic */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleChatVoiceInput}
                className={`p-2.5 rounded-xl border transition shrink-0 ${
                  isChatRecording
                    ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
                title="Nói bằng giọng nói"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                placeholder={c.chatInputPlaceholder}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm sm:text-base text-slate-900 outline-none focus:border-slate-900"
              />
              <button
                type="button"
                onClick={() => handleSendChatMessage()}
                className="p-2.5 rounded-xl bg-slate-900 text-amber-300 hover:bg-slate-800 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="px-3 pb-3 bg-white">
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm"
              >
                ✓ {c.chatApplyBtn}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== EXACT FOOTER FROM UNGDUNG.VERCEL.APP ==================== */}
      <footer
        id="about"
        className="no-print bg-[#050B14] border-t border-amber-500/20 text-slate-300 text-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {/* Brand Col */}
            <div className="md:col-span-5 space-y-4">
              <a
                href="https://ungdung.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 p-2 pr-5 rounded-2xl bg-[#0A192F] border border-amber-400/40 shadow-md shadow-black/50 hover:border-amber-400 transition-all"
              >
                <img
                  src="/logo-duyanhlab.jpg"
                  alt="DUY ANH LAB • digital"
                  className="h-11 w-auto object-contain rounded"
                />
                <div className="border-l border-slate-700/60 pl-3.5">
                  <div className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wide">
                    Duy Anh Lab
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    Real-World Software Engineering
                  </div>
                </div>
              </a>

              <p className="text-slate-300 max-w-md leading-relaxed text-sm sm:text-base">
                Chuyên thiết kế &amp; phát triển các ứng dụng Web chuyên sâu, giải pháp AI và phần mềm thực chiến phục vụ mọi ý tưởng: từ kinh doanh B2B, nghiên cứu R&amp;D, quản lý hộ kinh doanh đến giáo dục học tập và đời sống.
              </p>

              <div className="text-xs text-amber-300/90 font-mono font-bold">
                &quot;MONG MUỐN → Ý TƯỞNG → HIỆN THỰC&quot;
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3.5">
              <h4 className="font-extrabold text-amber-300 text-base">Danh Mục Giải Pháp</h4>
              <ul className="space-y-2.5 text-sm sm:text-base">
                <li>
                  <a
                    href="https://ungdung.vercel.app/#featured"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    Ứng dụng tiêu biểu
                  </a>
                </li>
                <li>
                  <a
                    href="https://ungdung.vercel.app/#apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    Hệ sinh thái Web &amp; AI
                  </a>
                </li>
                <li>
                  <a
                    href="https://ungdung.vercel.app/#domains"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    Các nhóm ngành trọng điểm
                  </a>
                </li>
                <li>
                  <a
                    href="https://ungdung.vercel.app/#tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    Kiến trúc công nghệ
                  </a>
                </li>
              </ul>
            </div>

            {/* Consultation & Support Information */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="font-extrabold text-amber-300 text-base">Tư Vấn &amp; Hiện Thực Hóa</h4>
              <p className="leading-relaxed text-slate-300 text-sm">
                Bạn có ý tưởng trong cuộc sống, kinh doanh, học tập hay công việc cần hiện thực hóa thành ứng dụng Web riêng biệt? Đội ngũ kỹ thuật luôn sẵn sàng đồng hành, tư vấn kiến trúc giải pháp và phát triển sản phẩm thực tế theo yêu cầu riêng của bạn.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-amber-400/90 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Liên hệ tư vấn &amp; trao đổi dự án qua khung liên hệ trực tiếp phía trên</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="text-slate-400">
              © 2026 DUY ANH DIGITAL LAB •{' '}
              <a
                href="https://ungdung.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 font-bold hover:underline"
              >
                ungdung.vercel.app
              </a>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-amber-400 text-amber-300 hover:text-slate-950 transition-all border border-amber-400/30 font-bold cursor-pointer text-xs sm:text-sm"
            >
              <span>Về đầu trang</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* ==================== MODAL GỬI EMAIL / ZALO ==================== */}
      {sendModal.open && (
        <div className="no-print fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                {sendModal.channel === 'email' ? (
                  <Mail className="w-6 h-6 text-emerald-600" />
                ) : (
                  <MessageCircle className="w-6 h-6 text-sky-500" />
                )}
                <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                  {sendModal.channel === 'email'
                    ? 'Gửi Email: anhpob@gmail.com'
                    : 'Gửi Zalo: +84 908 095693'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSendModal({ open: false, channel: null, sendingCloud: false, cloudSent: false })
                }
                className="text-slate-400 hover:text-slate-900 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm sm:text-base leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">
                    Đã sao chép toàn bộ nội dung Phiếu Yêu Cầu vào bộ nhớ tạm!
                  </div>
                  {sendModal.channel === 'email' && sendModal.sendingCloud && (
                    <div className="text-xs sm:text-sm text-amber-800 mt-1">
                      ⏳ Đang gửi tự động tới <strong>anhpob@gmail.com</strong>...
                    </div>
                  )}
                  {sendModal.channel === 'email' && sendModal.cloudSent && (
                    <div className="text-xs sm:text-sm text-emerald-700 mt-1 font-semibold">
                      ✅ Đã gửi trực tuyến thành công tới <strong>anhpob@gmail.com</strong>!
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-900">
                  1. Tải File PDF (1 Trang A4) / Ghi âm để đính kèm:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-amber-300 font-bold flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>{c.downloadPdfBtn}</span>
                  </button>
                  {audioUrl && (
                    <button
                      type="button"
                      onClick={downloadVoiceRecording}
                      className="px-4 py-2 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 font-bold flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải Ghi âm</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNativeShareWithFiles}
                    className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Đính kèm nhanh</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-900">
                  {sendModal.channel === 'email'
                    ? '2. Mở ứng dụng Email (Đã điền sẵn anhpob@gmail.com):'
                    : '2. Mở Zalo +84 908 095693 và nhấn Dán (Ctrl+V):'}
                </div>

                {sendModal.channel === 'email' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={openMailClient}
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-2 shadow"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Mở App Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={openGmailWeb}
                      className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 font-bold flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5 text-amber-600" />
                      <span>Mở Gmail Web</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={openZaloChat}
                      className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Mở Zalo +84 908 095693</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(buildFormattedBriefText());
                        showToast('✓ Đã sao chép lại nội dung!');
                      }}
                      className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 font-bold flex items-center justify-center gap-2"
                    >
                      <Copy className="w-5 h-5 text-amber-600" />
                      <span>Copy lại nội dung</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setSendModal({ open: false, channel: null, sendingCloud: false, cloudSent: false })
                }
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-sm font-bold text-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== A4 PREVIEW & STRICT 1-PAGE A4 PRINT SHEET ==================== */}
      <div
        id="a4-print-wrapper"
        className={
          showA4Preview
            ? 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto py-6 px-3 flex flex-col items-center'
            : 'fixed -left-[9999px] top-0 pointer-events-none opacity-0'
        }
      >
        {showA4Preview && (
          <div className="no-print max-w-[210mm] w-full mb-3 flex flex-wrap items-center justify-between gap-2 bg-white border-2 border-slate-300 px-4 py-3 rounded-2xl shadow-xl">
            <span className="text-sm sm:text-base font-extrabold text-slate-900">
              📄 Xem trước Bản In Chuẩn 1 Trang Giấy A4
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintA4}
                className="px-4 py-2 rounded-xl bg-slate-900 text-amber-300 font-bold text-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> In A4
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4" /> Tải PDF
              </button>
              <button
                type="button"
                onClick={() => setShowA4Preview(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 text-sm font-bold flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Đóng
              </button>
            </div>
          </div>
        )}

        {/* THE ACTUAL 1-PAGE A4 SHEET (CLEAN, CONCISE, EXECUTIVE) */}
        <div
          id="a4-print-sheet"
          ref={a4SheetRef}
          className="w-[198mm] bg-white text-slate-900 p-[8mm] rounded shadow-2xl border border-slate-300 text-[12px] leading-[1.5] font-sans"
        >
          {/* A4 Header */}
          <div className="flex items-center justify-between border-b-2 border-[#0C1B2E] pb-3 mb-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/logo-duyanhlab.jpg"
                alt="Duy Anh Digital Lab"
                className="h-14 w-auto rounded border border-slate-300 object-cover"
              />
              <div>
                <div className="text-[11px] font-extrabold tracking-widest text-[#0C1B2E] uppercase">
                  DUY ANH LAB • DIGITAL — REAL-WORLD SOFTWARE ENGINEERING
                </div>
                <h1 className="text-[16px] font-extrabold text-[#0C1B2E] uppercase tracking-tight mt-0.5">
                  {c.a4MainTitle}
                </h1>
                <div className="text-[10.5px] text-slate-600">
                  {c.a4SubNote} | Ngày lập: <strong>{todayStr}</strong>
                </div>
              </div>
            </div>
            <div className="text-right text-[10px] bg-slate-100 border border-slate-300 rounded-lg px-3 py-2">
              <div className="font-bold text-[#0C1B2E]">HỆ SINH THÁI WEB &amp; AI</div>
              <div className="font-mono font-bold text-slate-800">ungdung.vercel.app</div>
              <div className="font-mono text-slate-600">yeucau.vercel.app</div>
            </div>
          </div>

          {/* 1. THÔNG TIN LIÊN HỆ & MỤC ĐÍCH */}
          <div className="mb-4">
            <div className="bg-[#0C1B2E] text-white font-bold text-[11.5px] px-3 py-1 rounded-t uppercase tracking-wide">
              {c.a4Sec1}
            </div>
            <div className="border border-slate-300 rounded-b p-3 grid grid-cols-2 gap-x-6 gap-y-2 bg-slate-50/50 text-[12px]">
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">• Mục đích sử dụng: </span>
                <span className="font-extrabold text-[#0C1B2E] text-[13px]">{usageLabelText}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">• Người liên hệ: </span>
                <span className="font-bold text-slate-950">
                  {contactName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">• Số điện thoại / Zalo: </span>
                <span className="font-bold text-slate-950">
                  {contactPhone || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">• Công ty / Đơn vị: </span>
                <span className="font-bold text-slate-950">
                  {companyName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">• Email: </span>
                <span className="font-bold text-slate-950">
                  {contactEmail || '............................................................'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. MONG MUỐN & YÊU CẦU RIÊNG */}
          <div className="mb-4">
            <div className="bg-[#0C1B2E] text-white font-bold text-[11.5px] px-3 py-1 rounded-t uppercase tracking-wide">
              {c.a4Sec2}
            </div>
            <div className="border border-slate-300 rounded-b p-3.5 min-h-[110px] bg-white">
              {wishText ? (
                <div className="text-[12.5px] font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                  {wishText}
                </div>
              ) : (
                <div className="text-slate-400 space-y-2">
                  <div>.......................................................................................................................................................................................</div>
                  <div>.......................................................................................................................................................................................</div>
                  <div>.......................................................................................................................................................................................</div>
                </div>
              )}
            </div>
          </div>

          {/* 3. NGÔN NGỮ, ĐỐI TƯỢNG SỬ DỤNG & TIẾN ĐỘ */}
          <div className="mb-4">
            <div className="bg-[#0C1B2E] text-white font-bold text-[11.5px] px-3 py-1 rounded-t uppercase tracking-wide">
              {c.a4Sec3}
            </div>
            <div className="border border-slate-300 rounded-b p-3 space-y-2 text-[11.5px]">
              <div>
                <span className="font-semibold text-slate-700">• Ngôn ngữ tích hợp trên Web App: </span>
                <span className="font-extrabold text-[#0C1B2E]">
                  {selectedAppLangs.join('  |  ') || '🇻🇳 Tiếng Việt'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200">
                <div>
                  <span className="font-semibold text-slate-700">• Đối tượng sử dụng chính: </span>
                  <span className="font-bold text-slate-950">{selectedScope}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">• Thời gian mong muốn: </span>
                  <span className="font-bold text-slate-950">{selectedTimeline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. HÌNH ẢNH MẪU, GHI ÂM & TÀI LIỆU ĐÍNH KÈM */}
          <div className="mb-4">
            <div className="bg-[#0C1B2E] text-white font-bold text-[11.5px] px-3 py-1 rounded-t uppercase tracking-wide">
              {c.a4Sec4}
            </div>
            <div className="border border-slate-300 rounded-b p-3 space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700">• File đính kèm / Ghi âm: </span>
                  <span className="font-bold">
                    {audioUrl ? `Đã ghi âm (${formatDuration(recordingSeconds)} - Đã chuyển thành chữ); ` : ''}
                    {attachedDocs.length > 0
                      ? attachedDocs.map((d) => d.name).join(', ')
                      : !audioUrl
                      ? 'Không có'
                      : ''}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">• Link tham khảo: </span>
                  <span className="underline">
                    {referenceLink || '................................................................'}
                  </span>
                </div>
              </div>

              {capturedImages.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="font-semibold mb-1.5">• Hình ảnh chụp / Giao diện mẫu đính kèm:</div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {capturedImages.map((img) => (
                      <div
                        key={img.id}
                        className="border border-slate-300 rounded p-1 text-center bg-slate-50"
                      >
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="h-20 w-full object-contain mx-auto"
                        />
                        <div className="text-[8.5px] truncate text-slate-600 mt-1">{img.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Callback Promise Banner */}
          <div className="mb-4 p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-[11px] font-bold text-[#0C1B2E] text-center">
            {c.a4CallbackPromise}
          </div>

          {/* A4 Footer */}
          <div className="border-t-2 border-[#0C1B2E] pt-2.5 flex items-center justify-between text-[10px] text-slate-700">
            <div>
              <div className="font-extrabold text-[#0C1B2E] uppercase">
                DUY ANH DIGITAL LAB — &quot;MONG MUỐN → Ý TƯỞNG → HIỆN THỰC&quot;
              </div>
              <div>
                Hệ sinh thái 30+ ứng dụng Web &amp; AI thực chiến:{' '}
                <strong className="text-[#0C1B2E]">https://ungdung.vercel.app</strong>
              </div>
            </div>
            <div className="text-right shrink-0 pl-4 border-l border-slate-300">
              <div className="font-bold text-[#0C1B2E]">LIÊN HỆ TƯ VẤN &amp; TRIỂN KHAI</div>
              <div>
                Email: <strong>anhpob@gmail.com</strong> | Zalo: <strong>+84 908 095693</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
