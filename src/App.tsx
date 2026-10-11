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
  ShieldCheck,
  Layers,
  Users,
  Briefcase,
  Globe,
  Smartphone,
  Share2,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface RoleConfig {
  id: string;
  name: string;
  enabled: boolean;
  count: string;
  permissions: string;
}

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

const QUICK_PRESETS = [
  {
    id: 'erp',
    label: '🏢 Quản lý DN / Hợp đồng',
    projectName: 'Hệ thống Quản lý Hợp đồng & Vận hành Doanh nghiệp',
    painPoints: ['Excel / Sổ sách rời rạc', 'Mất thời gian tổng hợp báo cáo', 'Khó kiểm soát tiến độ & nhân sự'],
    goals: ['Tự động hóa quy trình 80-90%', 'Quản lý tập trung Real-time', 'Dashboard biểu đồ trực quan'],
    infra: ['Cloud (Đám mây - Khuyên dùng)', 'Dữ liệu Real-time (Tức thời)', 'Xuất Excel / In PDF chuẩn A4'],
    scale: ['Đa thiết bị (ĐT, iPad, Laptop)', 'Dưới 100 người dùng/lúc'],
    security: ['Mã hóa mật khẩu / Phân quyền', 'Lưu vết lịch sử thao tác (Log)'],
    style: 'Sang trọng (Navy & Gold)',
    customNote: 'Cần quản lý khách hàng, hợp đồng, nhắc việc tự động và xuất phiếu/báo cáo chuẩn trên 1 trang A4.'
  },
  {
    id: 'tax',
    label: '📊 Thuế HKD / Tài chính',
    projectName: 'Ứng dụng Quản lý Doanh thu & Báo cáo Thuế Hộ Kinh Doanh',
    painPoints: ['Excel / Sổ sách rời rạc', 'Mất thời gian tổng hợp báo cáo'],
    goals: ['Tự động hóa quy trình 80-90%', 'Dashboard biểu đồ trực quan', 'Chuẩn hóa phân quyền & Bảo mật'],
    infra: ['Cloud (Đám mây - Khuyên dùng)', 'Xuất Excel / In PDF chuẩn A4', 'Kết nối Zalo / Email / VietQR'],
    scale: ['Đa thiết bị (ĐT, iPad, Laptop)', 'Dưới 100 người dùng/lúc'],
    security: ['Mã hóa mật khẩu / Phân quyền', 'Tiêu chuẩn riêng (Tài chính / Y tế)'],
    style: 'Hiện đại Sáng sủa (Clean SaaS)',
    customNote: 'Tự động tổng hợp sổ doanh thu, chi phí, xuất tờ khai / báo cáo thuế nhanh gọn và chính xác.'
  },
  {
    id: 'ai',
    label: '🤖 Trợ lý AI / R&D Chuyên gia',
    projectName: 'Hệ thống AI Advisor Tư vấn Chuyên môn & Tra cứu Công thức',
    painPoints: ['Chưa có công cụ AI hỗ trợ chuyên môn', 'Khách hàng khó đặt lịch / tra cứu'],
    goals: ['Trợ lý AI tư vấn / R&D / Phân tích', 'Quản lý tập trung Real-time', 'Tăng uy tín & Chuyển đổi khách hàng'],
    infra: ['Cloud (Đám mây - Khuyên dùng)', 'Dữ liệu Real-time (Tức thời)', 'Xuất Excel / In PDF chuẩn A4'],
    scale: ['Đa thiết bị (ĐT, iPad, Laptop)', '100 - 1.000 người dùng/lúc', 'Đa ngôn ngữ (Việt / Anh / Hàn / Trung)'],
    security: ['Mã hóa mật khẩu / Phân quyền'],
    style: 'Sang trọng (Navy & Gold)',
    customNote: 'Tích hợp AI tra cứu dữ liệu chuyên ngành (Mỹ phẩm / F&B / Y tế / Ngân hàng), gợi ý giải pháp và xuất báo cáo.'
  },
  {
    id: 'crm',
    label: '🛒 Bán hàng / Đặt lịch CRM',
    projectName: 'Web App Đặt lịch Dịch vụ & Chăm sóc Khách hàng CRM',
    painPoints: ['Khách hàng khó đặt lịch / tra cứu', 'Excel / Sổ sách rời rạc'],
    goals: ['Khách tự đặt lịch / Tra cứu dễ dàng', 'Tăng uy tín & Chuyển đổi khách hàng', 'Tự động hóa quy trình 80-90%'],
    infra: ['Cloud (Đám mây - Khuyên dùng)', 'Dữ liệu Real-time (Tức thời)', 'Kết nối Zalo / Email / VietQR'],
    scale: ['Đa thiết bị (ĐT, iPad, Laptop)', '100 - 1.000 người dùng/lúc'],
    security: ['Mã hóa mật khẩu / Phân quyền', 'Xác thực 2 lớp (OTP/Email)'],
    style: 'Theo màu Thương hiệu riêng',
    customNote: 'Khách hàng thao tác siêu nhanh trên điện thoại, đặt yêu cầu/lịch hẹn và nhận thông báo qua Zalo/Email.'
  },
  {
    id: 'edu',
    label: '🎓 Đào tạo / E-Learning',
    projectName: 'Nền tảng Đào tạo Nội bộ, Học & Thi Trực tuyến Thông minh',
    painPoints: ['Khó kiểm soát tiến độ & nhân sự', 'Chưa có công cụ AI hỗ trợ chuyên môn'],
    goals: ['Tự động hóa quy trình 80-90%', 'Trợ lý AI tư vấn / R&D / Phân tích', 'Dashboard biểu đồ trực quan'],
    infra: ['Cloud (Đám mây - Khuyên dùng)', 'Dữ liệu Real-time (Tức thời)', 'Xuất Excel / In PDF chuẩn A4'],
    scale: ['Đa thiết bị (ĐT, iPad, Laptop)', '100 - 1.000 người dùng/lúc', 'Đa ngôn ngữ (Việt / Anh / Hàn / Trung)'],
    security: ['Mã hóa mật khẩu / Phân quyền', 'Lưu vết lịch sử thao tác (Log)'],
    style: 'Hiện đại Sáng sủa (Clean SaaS)',
    customNote: 'Hỗ trợ bài giảng tương tác, phát âm / ghi âm, chấm điểm tự động và theo dõi năng lực học viên.'
  },
  {
    id: 'landing',
    label: '🌐 Landing Page Cao cấp',
    projectName: 'Landing Page Giới thiệu Thương hiệu & Thu thập Yêu cầu Khách hàng',
    painPoints: ['Khách hàng khó đặt lịch / tra cứu', 'Phần mềm cũ chậm, khó dùng trên ĐT'],
    goals: ['Tăng uy tín & Chuyển đổi khách hàng', 'Khách tự đặt lịch / Tra cứu dễ dàng'],
    infra: ['Cloud (Đám mây - Khuyên dùng)', 'Xuất Excel / In PDF chuẩn A4', 'Kết nối Zalo / Email / VietQR'],
    scale: ['Đa thiết bị (ĐT, iPad, Laptop)', 'Trên 1.000 người dùng/lúc'],
    security: ['Mã hóa mật khẩu / Phân quyền'],
    style: 'Sang trọng (Navy & Gold)',
    customNote: 'Thiết kế sang trọng trên 1 màn hình, tương thích mọi thiết bị, cho phép khách gửi yêu cầu hoặc in 1 trang A4.'
  }
];

const PAIN_POINT_OPTIONS = [
  'Excel / Sổ sách rời rạc',
  'Mất thời gian tổng hợp báo cáo',
  'Khó kiểm soát tiến độ & nhân sự',
  'Chưa có công cụ AI hỗ trợ chuyên môn',
  'Khách hàng khó đặt lịch / tra cứu',
  'Phần mềm cũ chậm, khó dùng trên ĐT'
];

const GOAL_OPTIONS = [
  'Tự động hóa quy trình 80-90%',
  'Quản lý tập trung Real-time',
  'Trợ lý AI tư vấn / R&D / Phân tích',
  'Khách tự đặt lịch / Tra cứu dễ dàng',
  'Dashboard biểu đồ trực quan',
  'Tăng uy tín & Chuyển đổi khách hàng'
];

const INFRA_OPTIONS = [
  'Cloud (Đám mây - Khuyên dùng)',
  'Máy chủ nội bộ (Local/On-premise)',
  'Dữ liệu Real-time (Tức thời)',
  'Xuất Excel / In PDF chuẩn A4',
  'Kết nối Zalo / Email / VietQR'
];

const SCALE_OPTIONS = [
  'Đa thiết bị (ĐT, iPad, Laptop)',
  'Dưới 100 người dùng/lúc',
  '100 - 1.000 người dùng/lúc',
  'Trên 1.000 người dùng/lúc',
  'Đa ngôn ngữ (Việt / Anh / Hàn / Trung)'
];

const SECURITY_OPTIONS = [
  'Mã hóa mật khẩu / Phân quyền',
  'Xác thực 2 lớp (OTP/Email)',
  'Lưu vết lịch sử thao tác (Log)',
  'Tiêu chuẩn riêng (Tài chính / Y tế)'
];

const STYLE_OPTIONS = [
  'Sang trọng (Navy & Gold)',
  'Hiện đại Sáng sủa (Clean SaaS)',
  'Dashboard Dữ liệu Chuyên sâu',
  'Theo màu Thương hiệu riêng'
];

const TIMELINE_OPTIONS = [
  '⚡ Cần gấp (3 - 7 ngày)',
  '📅 Tiêu chuẩn (2 - 4 tuần)',
  '🚀 Phát triển theo giai đoạn',
  '💡 Tư vấn phương án tối ưu'
];

const DOC_TYPE_OPTIONS = [
  'File Excel / Google Sheets đang dùng',
  'Quy trình làm việc (Word / Flowchart)',
  'Biểu mẫu giấy đang dùng (Chụp ảnh)',
  'Ảnh chụp màn hình phần mềm cũ',
  'Bản vẽ tay ý tưởng / Trang web mẫu'
];

const DEFAULT_ROLES: RoleConfig[] = [
  {
    id: 'admin',
    name: 'Admin (Quản trị)',
    enabled: true,
    count: '1 - 2',
    permissions: 'Toàn quyền cấu hình hệ thống, phân quyền, quản lý dữ liệu & báo cáo tổng'
  },
  {
    id: 'manager',
    name: 'Quản lý (Manager)',
    enabled: true,
    count: '2 - 5',
    permissions: 'Xem Dashboard, duyệt yêu cầu/báo cáo, kiểm soát công việc bộ phận'
  },
  {
    id: 'staff',
    name: 'Nhân viên (Staff)',
    enabled: true,
    count: '5 - 30',
    permissions: 'Nhập liệu, xử lý nghiệp vụ hàng ngày theo quyền được giao'
  },
  {
    id: 'customer',
    name: 'Khách hàng / Đối tác',
    enabled: true,
    count: 'Không giới hạn',
    permissions: 'Tra cứu thông tin, gửi yêu cầu, đặt lịch hoặc tải kết quả PDF'
  }
];

export default function App() {
  // 1. General Info
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [timeline, setTimeline] = useState('📅 Tiêu chuẩn (2 - 4 tuần)');

  // 2. Pain Points & Goals
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([
    'Excel / Sổ sách rời rạc',
    'Mất thời gian tổng hợp báo cáo'
  ]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Tự động hóa quy trình 80-90%',
    'Quản lý tập trung Real-time'
  ]);
  const [customNote, setCustomNote] = useState('');

  // 3. Technical, Scale, Security & Style
  const [selectedInfra, setSelectedInfra] = useState<string[]>([
    'Cloud (Đám mây - Khuyên dùng)',
    'Dữ liệu Real-time (Tức thời)',
    'Xuất Excel / In PDF chuẩn A4'
  ]);
  const [selectedScale, setSelectedScale] = useState<string[]>([
    'Đa thiết bị (ĐT, iPad, Laptop)',
    'Dưới 100 người dùng/lúc'
  ]);
  const [selectedSecurity, setSelectedSecurity] = useState<string[]>([
    'Mã hóa mật khẩu / Phân quyền'
  ]);
  const [selectedStyle, setSelectedStyle] = useState('Sang trọng (Navy & Gold)');
  const [languageNote, setLanguageNote] = useState('Tiếng Việt (Mặc định)');

  // 4. Roles & Permissions
  const [roles, setRoles] = useState<RoleConfig[]>(DEFAULT_ROLES);

  // 5. Voice Recording, Speech-to-Text, Camera Photos & Attachments
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([
    'File Excel / Google Sheets đang dùng'
  ]);
  const [referenceLink, setReferenceLink] = useState('');
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const [voiceNoteSummary, setVoiceNoteSummary] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // UI & Modal States
  const [showA4Preview, setShowA4Preview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
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

  // Handle Ctrl+V paste screenshot anywhere on the page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            addImageFile(file, `Anh-chup-man-hinh-${Date.now().toString().slice(-4)}.png`);
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

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setActivePreset(preset.id);
    setProjectName(preset.projectName);
    setSelectedPainPoints(preset.painPoints);
    setSelectedGoals(preset.goals);
    setSelectedInfra(preset.infra);
    setSelectedScale(preset.scale);
    setSelectedSecurity(preset.security);
    setSelectedStyle(preset.style);
    setCustomNote(preset.customNote);
    showToast(`Đã áp dụng mẫu: ${preset.label}`);
  };

  const resetForm = () => {
    setActivePreset(null);
    setCompanyName('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setProjectName('');
    setTimeline('📅 Tiêu chuẩn (2 - 4 tuần)');
    setSelectedPainPoints(['Excel / Sổ sách rời rạc']);
    setSelectedGoals(['Tự động hóa quy trình 80-90%']);
    setCustomNote('');
    setSelectedInfra(['Cloud (Đám mây - Khuyên dùng)', 'Dữ liệu Real-time (Tức thời)', 'Xuất Excel / In PDF chuẩn A4']);
    setSelectedScale(['Đa thiết bị (ĐT, iPad, Laptop)', 'Dưới 100 người dùng/lúc']);
    setSelectedSecurity(['Mã hóa mật khẩu / Phân quyền']);
    setSelectedStyle('Sang trọng (Navy & Gold)');
    setLanguageNote('Tiếng Việt (Mặc định)');
    setRoles(DEFAULT_ROLES);
    setSelectedDocTypes([]);
    setReferenceLink('');
    setCapturedImages([]);
    setAttachedDocs([]);
    setAudioUrl(null);
    setAudioBlob(null);
    setVoiceNoteSummary('');
    showToast('Đã làm mới toàn bộ biểu mẫu');
  };

  // Voice Recorder + Speech Recognition
  const startRecording = async () => {
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
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Also start SpeechRecognition (Vietnamese) if available to auto-transcribe
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + ' ';
            }
          }
          if (transcript.trim()) {
            setCustomNote((prev) =>
              prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()
            );
            setVoiceNoteSummary((prev) =>
              prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()
            );
          }
        };
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          // Ignore speech recognition start error if already active
        }
      }
    } catch (err) {
      alert(
        'Không thể truy cập Microphone. Vui lòng cấp quyền Micro trên trình duyệt hoặc sử dụng nút Đính kèm file ghi âm.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }
    showToast('Đã lưu bản ghi âm yêu cầu của bạn!');
  };

  // Speech-to-text only button for the note box
  const toggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      startRecording();
      return;
    }

    if (isDictating && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsDictating(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsDictating(true);
    recognition.onend = () => setIsDictating(false);
    recognition.onerror = () => setIsDictating(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) {
        setCustomNote((prev) => (prev ? `${prev.trim()}. ${text}` : text));
        showToast('Đã chuyển giọng nói thành văn bản!');
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

  // Camera & Image Handling (resizes image for fast preview & clean 1-page A4 print)
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
          ...prev.slice(0, 3), // Keep up to 4 images so A4 stays 1 page
          {
            id: `${Date.now()}-${Math.random()}`,
            name: customName || file.name,
            dataUrl: compressedDataUrl,
            file
          }
        ]);
        showToast(`Đã thêm hình ảnh: ${customName || file.name}`);
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
    showToast('Đã đính kèm tài liệu!');
    e.target.value = '';
  };

  // Build formatted summary text for Email & Zalo
  const buildFormattedBriefText = () => {
    const activeRoles = roles
      .filter((r) => r.enabled)
      .map((r) => `  • ${r.name} (${r.count} user): ${r.permissions}`)
      .join('\n');

    const lines = [
      `📋 PHIẾU YÊU CẦU THIẾT KẾ WEB & ỨNG DỤNG — DUY ANH DIGITAL LAB`,
      `Ngày lập: ${todayStr}`,
      `--------------------------------------------------`,
      `1. THÔNG TIN CHUNG:`,
      `• Đơn vị / Cá nhân: ${companyName || 'Chưa điền'}`,
      `• Người liên hệ: ${contactName || 'Chưa điền'}`,
      `• SĐT / Zalo: ${contactPhone || 'Chưa điền'}${contactEmail ? ` | Email: ${contactEmail}` : ''}`,
      `• Tên Web App dự kiến: ${projectName || 'Trao đổi trực tiếp'}`,
      `• Tiến độ mong muốn: ${timeline}`,
      ``,
      `2. HIỆN TRẠNG & MỤC TIÊU CẦN GIẢI QUYẾT:`,
      `• Khó khăn hiện tại: ${selectedPainPoints.join(', ') || 'Trao đổi thêm'}`,
      `• Mục tiêu kỳ vọng: ${selectedGoals.join(', ') || 'Trao đổi thêm'}`,
      `• Ý tưởng & Yêu cầu riêng: ${customNote || 'Không có ghi chú thêm (Xem file ghi âm / ảnh đính kèm)'}`,
      ``,
      `3. YÊU CẦU KỸ THUẬT & GIAO DIỆN:`,
      `• Hạ tầng & Tính năng: ${selectedInfra.join(', ')}`,
      `• Quy mô & Nền tảng: ${selectedScale.join(', ')} | Ngôn ngữ: ${languageNote}`,
      `• Bảo mật & Tiêu chuẩn: ${selectedSecurity.join(', ')}`,
      `• Phong cách Thiết kế: ${selectedStyle}`,
      ``,
      `4. PHÂN QUYỀN NGƯỜI DÙNG (ROLES):`,
      activeRoles || '  • Mặc định theo tư vấn của Duy Anh Digital Lab',
      ``,
      `5. GHI ÂM, HÌNH ẢNH & TÀI LIỆU ĐÍNH KÈM:`,
      `• Loại tài liệu sẵn có: ${selectedDocTypes.join(', ') || 'Chưa chọn'}`,
      `• Ghi âm giọng nói: ${audioUrl ? `Có file ghi âm (${formatDuration(recordingSeconds)})` : 'Không'}`,
      `• Ảnh chụp / Ảnh mẫu: ${capturedImages.length > 0 ? `${capturedImages.length} hình ảnh (${capturedImages.map((i) => i.name).join(', ')})` : 'Không'}`,
      `• File đính kèm: ${attachedDocs.length > 0 ? attachedDocs.map((d) => d.name).join(', ') : 'Không'}`,
      `• Link tham khảo / Drive: ${referenceLink || 'Không'}`,
      `--------------------------------------------------`,
      `🌐 Hệ sinh thái Duy Anh Digital Lab: https://duy-anh-digital-lab.vercel.app`,
      `📧 Email nhận yêu cầu: anhpob@gmail.com | 💬 Zalo: +84 908 095693`
    ];
    return lines.join('\n');
  };

  // Generate 1-Page A4 PDF Blob & Download
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

      // Strictly fit on 1 single A4 page
      if (renderH > maxH) {
        renderH = maxH;
        renderW = renderH * ratio;
      }

      const xOffset = (pageWidth - renderW) / 2;
      const yOffset = margin;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderW, renderH);

      const safeName = (companyName || contactName || projectName || 'KhachHang')
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
      showToast('Đã tải xuống File PDF chuẩn 1 trang A4!');
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
    a.download = `Ghi-am-yeu-cau-WebApp-${Date.now().toString().slice(-4)}.webm`;
    a.click();
  };

  // Native Share (Mobile / iPad / Modern Browsers) - shares PDF + Audio + Photos directly to Zalo/Email!
  const handleNativeShareWithFiles = async () => {
    const text = buildFormattedBriefText();
    const filesToShare: File[] = [];

    const pdfRes = await generateA4PdfBlob();
    if (pdfRes) {
      filesToShare.push(new File([pdfRes.blob], pdfRes.fileName, { type: 'application/pdf' }));
    }
    if (audioBlob) {
      filesToShare.push(
        new File([audioBlob], 'Ghi-am-yeu-cau.webm', { type: 'audio/webm' })
      );
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
            title: `Yêu cầu thiết kế Web App - ${companyName || contactName || 'Duy Anh Digital Lab'}`,
            text,
            files: filesToShare
          });
          return;
        } else {
          await nav.share({
            title: `Yêu cầu thiết kế Web App - ${companyName || contactName || 'Duy Anh Digital Lab'}`,
            text
          });
          return;
        }
      } catch {
        // User cancelled or fallback needed
      }
    }
    await navigator.clipboard.writeText(text);
    showToast('Đã sao chép toàn bộ nội dung yêu cầu!');
  };

  // Trigger Email / Zalo Submission Flow
  const handleOpenSendChannel = async (channel: 'email' | 'zalo') => {
    const summaryText = buildFormattedBriefText();
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Ignore clipboard permission issue
    }

    setSendModal({
      open: true,
      channel,
      sendingCloud: channel === 'email',
      cloudSent: false
    });

    if (channel === 'email') {
      // Attempt instant background submission to anhpob@gmail.com via FormSubmit AJAX
      try {
        const formData = new FormData();
        formData.append('_subject', `[Yêu Cầu Thiết Kế Web App] ${companyName || contactName || projectName || 'Khách hàng mới'}`);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('Đơn vị / Cá nhân', companyName || 'Chưa điền');
        formData.append('Người liên hệ', contactName || 'Chưa điền');
        formData.append('SĐT / Zalo', contactPhone || 'Chưa điền');
        formData.append('Email khách', contactEmail || 'Chưa điền');
        formData.append('Tên Web App dự kiến', projectName || 'Chưa điền');
        formData.append('Tiến độ', timeline);
        formData.append('Khó khăn hiện tại', selectedPainPoints.join(', '));
        formData.append('Mục tiêu kỳ vọng', selectedGoals.join(', '));
        formData.append('Ý tưởng & Yêu cầu riêng', customNote || 'Xem đính kèm');
        formData.append('Kỹ thuật & Nền tảng', `${selectedInfra.join(', ')} | ${selectedScale.join(', ')}`);
        formData.append('Phong cách thiết kế', selectedStyle);
        formData.append('Link tham khảo', referenceLink || 'Không');
        formData.append('Bản tóm tắt đầy đủ', summaryText);

        if (audioBlob) {
          formData.append('attachment_audio', audioBlob, 'Ghi-am-yeu-cau.webm');
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
      `[Yêu Cầu Thiết Kế Web App] ${companyName || contactName || projectName || 'Khách hàng'} - ${todayStr}`
    );
    const body = encodeURIComponent(buildFormattedBriefText());
    window.location.href = `mailto:anhpob@gmail.com?subject=${subject}&body=${body}`;
  };

  const openGmailWeb = () => {
    const subject = encodeURIComponent(
      `[Yêu Cầu Thiết Kế Web App] ${companyName || contactName || projectName || 'Khách hàng'} - ${todayStr}`
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
      showToast('Đã copy nội dung! Hãy nhấn Dán (Ctrl+V) vào khung chat Zalo.');
    } catch {
      // Ignore
    }
    window.open('https://zalo.me/84908095693', '_blank');
  };

  return (
    <div className="min-h-dvh lg:h-dvh lg:max-h-dvh lg:overflow-hidden flex flex-col bg-[#07111E] text-slate-100 select-none sm:select-auto">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="no-print fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#DFC89A] text-[#07111E] font-semibold text-xs sm:text-sm px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-amber-200 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-800" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ==================== INTERACTIVE SCREEN VIEW (FITS 1 SCREEN ON DESKTOP) ==================== */}
      <div className="no-print flex-1 flex flex-col lg:overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="shrink-0 bg-[#0C1B2E]/95 border-b border-[#DFC89A]/20 px-3 sm:px-5 py-2">
          <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
            {/* Brand & Title */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://duy-anh-digital-lab.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5"
                title="Truy cập Hệ sinh thái Duy Anh Digital Lab"
              >
                <img
                  src="/logo-duyanhlab.jpg"
                  alt="Duy Anh Digital Lab"
                  className="h-9 sm:h-10 w-auto rounded-lg border border-[#DFC89A]/40 object-cover shadow-md group-hover:border-[#DFC89A] transition"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#DFC89A]">
                      DUY ANH LAB • digital
                    </span>
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DFC89A]/15 text-[#DFC89A] border border-[#DFC89A]/30">
                      <Sparkles className="w-2.5 h-2.5" /> 1-Page Smart Brief
                    </span>
                  </div>
                  <h1 className="text-xs sm:text-base font-bold text-white leading-tight">
                    PHIẾU YÊU CẦU THIẾT KẾ WEB &amp; ỨNG DỤNG
                  </h1>
                </div>
              </a>
            </div>

            {/* 1-Click Templates Bar */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 thin-scroll">
              <span className="text-[11px] text-slate-400 font-medium mr-1 shrink-0 hidden xl:inline">
                Mẫu chọn nhanh:
              </span>
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition shrink-0 ${
                    activePreset === preset.id
                      ? 'bg-[#DFC89A] text-[#07111E] border-[#DFC89A] font-bold shadow'
                      : 'bg-[#132640]/80 text-slate-200 border-slate-700 hover:border-[#DFC89A]/60 hover:text-[#DFC89A]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={resetForm}
                title="Làm mới form"
                className="text-[11px] text-slate-400 hover:text-rose-300 px-2 py-1 rounded-full border border-slate-800 hover:border-rose-400/40 flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Làm mới</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowA4Preview(true)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-[#DFC89A] border border-[#DFC89A]/30 flex items-center gap-1.5 transition"
                title="Xem trước trang in A4"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem trang A4</span>
              </button>
              <button
                type="button"
                onClick={handlePrintA4}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 transition"
                title="In ra đúng 1 trang giấy A4"
              >
                <Printer className="w-3.5 h-3.5 text-[#DFC89A]" />
                <span>In A4</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#DFC89A]/20 hover:bg-[#DFC89A]/30 text-[#DFC89A] border border-[#DFC89A]/50 flex items-center gap-1.5 transition"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{isGeneratingPdf ? 'Đang tạo...' : 'Tải PDF'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenSendChannel('email')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#DFC89A] to-[#C9AD76] text-[#07111E] hover:brightness-110 flex items-center gap-1.5 shadow-md transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gửi Email</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenSendChannel('zalo')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 shadow-md transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Gửi Zalo</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN 3-COLUMN BENTO GRID (STRICTLY 1 SCREEN ON DESKTOP) */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-5 py-2.5 grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:overflow-hidden">
          {/* ==================== COLUMN 1: THÔNG TIN CHUNG & BÀI TOÁN (4 COLS) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 lg:overflow-y-auto thin-scroll pr-0.5">
            {/* Section 1: Thông tin chung */}
            <section className="bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                  <Briefcase className="w-4 h-4" />
                  1. Thông tin Liên hệ &amp; Dự án
                </h2>
                <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  Điền cực ngắn
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    Tên Doanh nghiệp / Tổ chức
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="VD: Công ty ABC / Cá nhân..."
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    Người đại diện / Liên hệ
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="VD: Anh Minh / Chị Lan..."
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#DFC89A] mb-0.5 font-semibold">
                    SĐT / Zalo nhận phản hồi *
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="VD: 0908 xxx xxx"
                    className="w-full bg-[#07111E] border border-[#DFC89A]/50 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    Email (Nếu có)
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="VD: ten@congty.com"
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    Tên Web App dự kiến / Lĩnh vực hoạt động
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="VD: App Quản lý Hợp đồng, Báo cáo Thuế HKD, Trợ lý AI Mỹ phẩm..."
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Tiến độ kỳ vọng */}
              <div className="mt-2">
                <span className="block text-[11px] text-slate-400 mb-1">
                  Tiến độ &amp; Phương án triển khai mong muốn:
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {TIMELINE_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTimeline(item)}
                      className={`text-[11px] px-2 py-1 rounded-md border text-left truncate transition ${
                        timeline === item
                          ? 'bg-[#DFC89A]/20 border-[#DFC89A] text-[#DFC89A] font-semibold'
                          : 'bg-[#07111E]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 2: Hiện trạng & Bài toán cần giải quyết */}
            <section className="flex-1 bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" />
                    2. Hiện trạng &amp; Mục tiêu Kỳ vọng
                  </h2>
                  <span className="text-[10px] text-slate-400">Chạm để chọn</span>
                </div>

                {/* Pain Points */}
                <div className="mb-2">
                  <p className="text-[11px] text-slate-300 font-medium mb-1">
                    Khó khăn hiện tại cần giải quyết (Pain points):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {PAIN_POINT_OPTIONS.map((item) => {
                      const active = selectedPainPoints.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleItem(selectedPainPoints, setSelectedPainPoints, item)}
                          className={`text-[11px] px-2 py-0.5 rounded-md border transition flex items-center gap-1 ${
                            active
                              ? 'bg-amber-500/20 border-[#DFC89A] text-[#DFC89A] font-semibold'
                              : 'bg-[#07111E]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span>{active ? '✓' : '+'}</span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Goals */}
                <div className="mb-2">
                  <p className="text-[11px] text-slate-300 font-medium mb-1">
                    Mục tiêu kỳ vọng lớn nhất khi làm Web App:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {GOAL_OPTIONS.map((item) => {
                      const active = selectedGoals.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleItem(selectedGoals, setSelectedGoals, item)}
                          className={`text-[11px] px-2 py-0.5 rounded-md border transition flex items-center gap-1 ${
                            active
                              ? 'bg-emerald-500/20 border-emerald-400/70 text-emerald-200 font-semibold'
                              : 'bg-[#07111E]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span>{active ? '✓' : '+'}</span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Short Custom Idea / Voice-to-Text Box */}
              <div className="mt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-[#DFC89A] font-semibold">
                    Ý tưởng cốt lõi / Luồng tính năng riêng (Must-have):
                  </label>
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border transition ${
                      isDictating
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-[#132640] text-[#DFC89A] border-[#DFC89A]/40 hover:bg-[#DFC89A]/20'
                    }`}
                    title="Nói bằng giọng nói để tự động điền chữ Tiếng Việt"
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isDictating ? 'Đang nghe bạn nói...' : 'Đọc thành chữ'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Gõ ngắn gọn 1-2 câu, hoặc bấm 'Đọc thành chữ' / 'Ghi âm' ở cột bên phải..."
                  className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none resize-none transition"
                />
              </div>
            </section>
          </div>

          {/* ==================== COLUMN 2: KỸ THUẬT, GIAO DIỆN & PHÂN QUYỀN (4 COLS) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 lg:overflow-y-auto thin-scroll pr-0.5">
            {/* Section 3: Yêu cầu kỹ thuật & Giao diện */}
            <section className="bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                  <Layers className="w-4 h-4" />
                  3. Yêu cầu Kỹ thuật &amp; Giao diện
                </h2>
                <span className="text-[10px] text-slate-400">Tương thích mọi thiết bị</span>
              </div>

              {/* Hạ tầng & Dữ liệu */}
              <div className="mb-2">
                <p className="text-[11px] text-slate-300 font-medium mb-1">
                  Hạ tầng, Dữ liệu &amp; Tiện ích:
                </p>
                <div className="flex flex-wrap gap-1">
                  {INFRA_OPTIONS.map((item) => {
                    const active = selectedInfra.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(selectedInfra, setSelectedInfra, item)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                          active
                            ? 'bg-[#DFC89A]/20 border-[#DFC89A] text-[#DFC89A] font-semibold'
                            : 'bg-[#07111E]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quy mô & Nền tảng */}
              <div className="mb-2">
                <p className="text-[11px] text-slate-300 font-medium mb-1">
                  Quy mô &amp; Nền tảng sử dụng:
                </p>
                <div className="flex flex-wrap gap-1">
                  {SCALE_OPTIONS.map((item) => {
                    const active = selectedScale.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(selectedScale, setSelectedScale, item)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                          active
                            ? 'bg-sky-500/20 border-sky-400/70 text-sky-200 font-semibold'
                            : 'bg-[#07111E]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bảo mật & Tiêu chuẩn */}
              <div className="mb-2">
                <p className="text-[11px] text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFC89A]" />
                  Bảo mật &amp; Tiêu chuẩn:
                </p>
                <div className="flex flex-wrap gap-1">
                  {SECURITY_OPTIONS.map((item) => {
                    const active = selectedSecurity.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(selectedSecurity, setSelectedSecurity, item)}
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                          active
                            ? 'bg-purple-500/20 border-purple-400/70 text-purple-200 font-semibold'
                            : 'bg-[#07111E]/70 border-slate-800 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phong cách thiết kế & Ngôn ngữ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    Phong cách giao diện:
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-[#07111E] border border-slate-700 rounded-lg px-2 py-1 text-xs text-[#DFC89A] font-medium outline-none"
                  >
                    {STYLE_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    Ngôn ngữ hiển thị:
                  </label>
                  <input
                    type="text"
                    value={languageNote}
                    onChange={(e) => setLanguageNote(e.target.value)}
                    placeholder="VD: Việt, Anh, Hàn, Trung..."
                    className="w-full bg-[#07111E] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 4: Phân quyền người dùng (Roles & Permissions) */}
            <section className="flex-1 bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-3 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                    <Users className="w-4 h-4" />
                    4. Phân quyền Người dùng (Roles)
                  </h2>
                  <span className="text-[10px] text-slate-400">Tích chọn &amp; sửa nhanh</span>
                </div>

                <div className="space-y-1.5">
                  {roles.map((role, idx) => (
                    <div
                      key={role.id}
                      className={`p-2 rounded-lg border transition ${
                        role.enabled
                          ? 'bg-[#07111E]/90 border-slate-700/90'
                          : 'bg-[#07111E]/30 border-slate-800/50 opacity-55'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white">
                          <input
                            type="checkbox"
                            checked={role.enabled}
                            onChange={(e) => {
                              const next = [...roles];
                              next[idx].enabled = e.target.checked;
                              setRoles(next);
                            }}
                            className="accent-[#DFC89A] w-3.5 h-3.5 rounded"
                          />
                          <span>{role.name}</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">SL:</span>
                          <input
                            type="text"
                            value={role.count}
                            onChange={(e) => {
                              const next = [...roles];
                              next[idx].count = e.target.value;
                              setRoles(next);
                            }}
                            className="w-20 bg-[#0C1B2E] border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-[#DFC89A] text-center outline-none"
                            placeholder="Số user"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={role.permissions}
                        onChange={(e) => {
                          const next = [...roles];
                          next[idx].permissions = e.target.value;
                          setRoles(next);
                        }}
                        className="w-full bg-transparent border-b border-slate-800 focus:border-[#DFC89A] text-[11px] text-slate-300 outline-none py-0.5"
                        placeholder="Quyền hạn chính (Xem, Thêm, Sửa, Xóa, Duyệt báo cáo...)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ==================== COLUMN 3: GHI ÂM, CHỤP ẢNH, ĐÍNH KÈM & GỬI NGAY (4 COLS) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 lg:overflow-y-auto thin-scroll pr-0.5">
            {/* Section 5: Ghi âm, Chụp ảnh & Đính kèm (Zero-Typing) */}
            <section className="bg-[#0C1B2E]/90 border border-[#DFC89A]/30 rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                  <Mic className="w-4 h-4" />
                  5. Ghi âm, Chụp hình &amp; Đính kèm
                </h2>
                <span className="text-[10px] bg-[#DFC89A]/15 text-[#DFC89A] px-2 py-0.5 rounded-full font-semibold">
                  Không cần gõ nhiều!
                </span>
              </div>

              {/* 3 Big Fast Media Buttons: Voice Record | Camera Capture | Attach File */}
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {/* Button 1: Voice Recording */}
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gradient-to-b from-rose-500/20 to-rose-900/20 border border-rose-400/40 hover:border-rose-400 text-rose-200 transition group"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-500/30 flex items-center justify-center group-hover:scale-110 transition">
                      <Mic className="w-4 h-4 text-rose-300" />
                    </div>
                    <span className="text-[11px] font-bold text-center leading-tight">
                      Ghi âm Yêu cầu
                    </span>
                    <span className="text-[9px] text-rose-300/80">Nói trực tiếp</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-rose-600 text-white border border-rose-300 animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    <span className="text-[11px] font-bold">
                      Dừng ({formatDuration(recordingSeconds)})
                    </span>
                    <span className="text-[9px]">Đang thu âm...</span>
                  </button>
                )}

                {/* Button 2: Direct Camera Photo Capture */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gradient-to-b from-sky-500/20 to-sky-900/20 border border-sky-400/40 hover:border-sky-400 text-sky-200 transition group"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-500/30 flex items-center justify-center group-hover:scale-110 transition">
                    <Camera className="w-4 h-4 text-sky-300" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">
                    Chụp ảnh Mẫu
                  </span>
                  <span className="text-[9px] text-sky-300/80">Mở Camera / Ảnh</span>
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageInputChange}
                  className="hidden"
                />

                {/* Button 3: Upload Files / Screenshots */}
                <button
                  type="button"
                  onClick={() => fileUploadRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-900/20 border border-[#DFC89A]/40 hover:border-[#DFC89A] text-[#DFC89A] transition group"
                >
                  <div className="w-7 h-7 rounded-full bg-[#DFC89A]/20 flex items-center justify-center group-hover:scale-110 transition">
                    <Paperclip className="w-4 h-4 text-[#DFC89A]" />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight">
                    Đính kèm File
                  </span>
                  <span className="text-[9px] text-[#DFC89A]/80">Excel, Word, Ảnh</span>
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

              {/* Audio Player if recorded */}
              {audioUrl && (
                <div className="mb-2 p-2 rounded-lg bg-[#07111E] border border-rose-400/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Volume2 className="w-4 h-4 text-rose-400 shrink-0" />
                    <audio src={audioUrl} controls className="h-7 w-full max-w-[190px]" />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={downloadVoiceRecording}
                      className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#DFC89A] flex items-center gap-1"
                      title="Tải file ghi âm để gửi kèm"
                    >
                      <Download className="w-3 h-3" /> Tải file
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioUrl(null);
                        setAudioBlob(null);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      title="Xóa ghi âm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Captured Images / Screenshots Gallery */}
              {capturedImages.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-sky-300 font-semibold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Ảnh chụp / Mẫu đính kèm ({capturedImages.length}/4 - Tự động in vào A4):
                    </span>
                    <button
                      type="button"
                      onClick={() => photoUploadRef.current?.click()}
                      className="text-[10px] text-[#DFC89A] underline"
                    >
                      + Thêm ảnh
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {capturedImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative group h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-900"
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
                          className="absolute top-0.5 right-0.5 bg-slate-950/80 text-rose-400 rounded-full p-0.5 opacity-80 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
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

              {/* Attached Documents List */}
              {attachedDocs.length > 0 && (
                <div className="mb-2 space-y-1">
                  {attachedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between text-[11px] bg-[#07111E] border border-slate-800 px-2 py-1 rounded"
                    >
                      <span className="truncate flex items-center gap-1.5 text-slate-200">
                        <FileText className="w-3 h-3 text-[#DFC89A] shrink-0" />
                        {doc.name} <span className="text-slate-500">({doc.size})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttachedDocs((prev) => prev.filter((d) => d.id !== doc.id))
                        }
                        className="text-slate-400 hover:text-rose-400 ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Mapping Checkboxes */}
              <div className="mb-2">
                <p className="text-[11px] text-slate-300 font-medium mb-1">
                  Tài liệu sẵn có để ánh xạ (Mapping) quy trình &amp; dữ liệu:
                </p>
                <div className="flex flex-wrap gap-1">
                  {DOC_TYPE_OPTIONS.map((item) => {
                    const active = selectedDocTypes.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(selectedDocTypes, setSelectedDocTypes, item)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition ${
                          active
                            ? 'bg-[#DFC89A]/20 border-[#DFC89A] text-[#DFC89A] font-semibold'
                            : 'bg-[#07111E]/70 border-slate-800 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Link tham khảo / Google Drive */}
              <div>
                <input
                  type="url"
                  value={referenceLink}
                  onChange={(e) => setReferenceLink(e.target.value)}
                  placeholder="🔗 Dán link trang web mẫu bạn thích hoặc link Google Drive / Ảnh (Có thể bấm Ctrl+V dán ảnh)..."
                  className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </section>

            {/* Section 6: Hộp Gửi Yêu Cầu & Xuất File 1 Trang A4 */}
            <section className="flex-1 bg-gradient-to-br from-[#132640] via-[#0C1B2E] to-[#07111E] border border-[#DFC89A]/40 rounded-xl p-3 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#DFC89A]">
                    🚀 Hoàn tất &amp; Gửi Yêu Cầu Ngay
                  </span>
                  <span className="text-[10px] text-emerald-300 font-medium">
                    Phản hồi nhanh 24/7
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  Sau khi chọn xong, bạn có thể <strong>In / Xuất gọn 1 trang PDF A4</strong> hoặc gửi trực tiếp kèm file ghi âm &amp; hình ảnh qua <strong>Email</strong> hoặc <strong>Zalo</strong>:
                </p>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Send Email */}
                  <button
                    type="button"
                    onClick={() => handleOpenSendChannel('email')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#DFC89A] to-[#C9AD76] text-[#07111E] font-extrabold text-xs shadow-lg hover:brightness-110 transition"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <div className="text-left leading-tight">
                      <div>Gửi Email</div>
                      <div className="text-[9px] font-semibold opacity-80">anhpob@gmail.com</div>
                    </div>
                  </button>

                  {/* Send Zalo */}
                  <button
                    type="button"
                    onClick={() => handleOpenSendChannel('zalo')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg transition"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <div className="text-left leading-tight">
                      <div>Gửi qua Zalo</div>
                      <div className="text-[9px] font-semibold opacity-85">+84 908 095693</div>
                    </div>
                  </button>
                </div>

                {/* Print A4 & Download PDF & Mobile Native Share */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrintA4}
                    className="py-1.5 px-2 rounded-lg bg-[#07111E]/90 hover:bg-slate-800 text-white border border-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#DFC89A]" />
                    <span>In 1 Trang A4</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="py-1.5 px-2 rounded-lg bg-[#07111E]/90 hover:bg-slate-800 text-[#DFC89A] border border-[#DFC89A]/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isGeneratingPdf ? 'Đang xuất...' : 'Xuất File PDF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShareWithFiles}
                    className="py-1.5 px-2 rounded-lg bg-[#07111E]/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                    title="Chia sẻ nhanh kèm File trên Điện thoại / iPad"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Đính kèm nhanh</span>
                  </button>
                </div>
              </div>

              {/* Device Compatibility Badge */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#DFC89A]" /> Điện thoại • iPad • Laptop • Máy ảnh
                </span>
                <a
                  href="/Web_App_Brief_Form.docx"
                  download
                  className="text-[#DFC89A] hover:underline flex items-center gap-0.5"
                >
                  <Download className="w-3 h-3" /> Mẫu Word (.docx)
                </a>
              </div>
            </section>
          </div>
        </main>

        {/* BOTTOM FOOTER: DUY ANH DIGITAL LAB (.vercel.app) INTRODUCTION */}
        <footer className="shrink-0 bg-[#050C16] border-t border-[#DFC89A]/25 px-3 sm:px-5 py-2">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-[#DFC89A] tracking-wide flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                DUY ANH DIGITAL LAB:
              </span>
              <span className="text-slate-300 text-[11px]">
                Hệ sinh thái Web App chuyên sâu &amp; Giải pháp AI thực chiến (Báo cáo thuế HKD, R&amp;D Mỹ phẩm &amp; F&amp;B, Quản lý Hợp đồng, SCM, ERP Nông nghiệp, Đào tạo &amp; Trợ lý Ngân hàng).
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <a
                href="https://duy-anh-digital-lab.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-full bg-[#DFC89A]/15 hover:bg-[#DFC89A]/30 text-[#DFC89A] border border-[#DFC89A]/40 font-bold text-[11px] flex items-center gap-1 transition"
              >
                <span>🌐 duy-anh-digital-lab.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://ungdung.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] flex items-center gap-1 transition"
              >
                <span>🚀 ungdung.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="mailto:anhpob@gmail.com"
                className="text-[11px] text-slate-300 hover:text-[#DFC89A] font-medium px-1.5"
              >
                📧 anhpob@gmail.com
              </a>
              <a
                href="https://zalo.me/84908095693"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-300 hover:text-sky-200 font-semibold px-1.5"
              >
                💬 Zalo: +84 908 095693
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* ==================== MODAL GỬI EMAIL / ZALO KÈM FILE ĐÍNH KÈM ==================== */}
      {sendModal.open && (
        <div className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0C1B2E] border border-[#DFC89A]/50 rounded-2xl max-w-lg w-full p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {sendModal.channel === 'email' ? (
                  <Mail className="w-5 h-5 text-[#DFC89A]" />
                ) : (
                  <MessageCircle className="w-5 h-5 text-sky-400" />
                )}
                <h3 className="font-bold text-base text-white">
                  {sendModal.channel === 'email'
                    ? 'Gửi Phiếu Yêu Cầu đến anhpob@gmail.com'
                    : 'Gửi Phiếu Yêu Cầu qua Zalo (+84 908 095693)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSendModal({ open: false, channel: null, sendingCloud: false, cloudSent: false })}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">
                    Đã tự động sao chép toàn bộ nội dung Phiếu Yêu Cầu vào bộ nhớ tạm!
                  </div>
                  {sendModal.channel === 'email' && sendModal.sendingCloud && (
                    <div className="text-[11px] text-amber-300 mt-1">
                      ⏳ Đang đồng thời gửi bản sao tự động tới hộp thư <strong>anhpob@gmail.com</strong>...
                    </div>
                  )}
                  {sendModal.channel === 'email' && sendModal.cloudSent && (
                    <div className="text-[11px] text-emerald-300 mt-1">
                      ✅ Đã gửi trực tuyến thành công tới hệ thống email <strong>anhpob@gmail.com</strong>!
                    </div>
                  )}
                </div>
              </div>

              {/* Step 1: Download PDF / Audio / Images if user wants to attach */}
              <div className="p-3 rounded-xl bg-[#07111E] border border-slate-800 space-y-2">
                <div className="font-bold text-[#DFC89A]">
                  Bước 1 (Tùy chọn): Tải File PDF 1 Trang A4 / Ghi âm để đính kèm
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-3 py-1.5 rounded-lg bg-[#DFC89A]/20 hover:bg-[#DFC89A]/30 text-[#DFC89A] border border-[#DFC89A]/50 font-semibold flex items-center gap-1.5"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isGeneratingPdf ? 'Đang tạo PDF...' : 'Tải File PDF (1 Trang A4)'}</span>
                  </button>
                  {audioUrl && (
                    <button
                      type="button"
                      onClick={downloadVoiceRecording}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải File Ghi âm (.webm)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNativeShareWithFiles}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Chia sẻ kèm File (ĐT/iPad)</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Open Email or Zalo */}
              <div className="p-3 rounded-xl bg-[#07111E] border border-slate-800 space-y-2">
                <div className="font-bold text-white">
                  {sendModal.channel === 'email'
                    ? 'Bước 2: Mở ứng dụng Email (Đã điền sẵn nội dung gửi anhpob@gmail.com)'
                    : 'Bước 2: Mở Zalo +84 908 095693 và nhấn Dán (Ctrl+V) + Đính kèm file'}
                </div>

                {sendModal.channel === 'email' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openMailClient}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#DFC89A] to-[#C9AD76] text-[#07111E] font-extrabold flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Mở App Email Mặc Định</span>
                    </button>
                    <button
                      type="button"
                      onClick={openGmailWeb}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-[#DFC89A]" />
                      <span>Mở Gmail trên Web</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openZaloChat}
                      className="py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Mở Zalo +84 908 095693</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(buildFormattedBriefText());
                        showToast('Đã sao chép lại nội dung yêu cầu!');
                      }}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4 text-[#DFC89A]" />
                      <span>Copy lại nội dung</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSendModal({ open: false, channel: null, sendingCloud: false, cloudSent: false })}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL XEM TRƯỚC TRANG IN A4 (VÀ KHU VỰC IN CHUẨN 1 TRANG A4) ==================== */}
      <div
        id="a4-print-wrapper"
        className={
          showA4Preview
            ? 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm overflow-y-auto py-6 px-3 flex flex-col items-center'
            : 'fixed -left-[9999px] top-0 pointer-events-none opacity-0'
        }
      >
        {showA4Preview && (
          <div className="no-print max-w-[210mm] w-full mb-3 flex flex-wrap items-center justify-between gap-2 bg-[#0C1B2E] border border-[#DFC89A]/40 px-4 py-2.5 rounded-xl shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#DFC89A]">
                📄 Xem trước Bản In Chuẩn 1 Trang Giấy A4
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                (Tự động căn vừa khít 1 trang A4 khi In hoặc Xuất PDF)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintA4}
                className="px-3 py-1.5 rounded-lg bg-[#DFC89A] text-[#07111E] font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> In ngay (1 trang A4)
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" /> {isGeneratingPdf ? 'Đang tạo...' : 'Tải PDF'}
              </button>
              <button
                type="button"
                onClick={() => setShowA4Preview(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Đóng
              </button>
            </div>
          </div>
        )}

        {/* ==================== THE ACTUAL 1-PAGE A4 SHEET ==================== */}
        <div
          id="a4-print-sheet"
          ref={a4SheetRef}
          className="w-[198mm] bg-white text-slate-900 p-[6mm] rounded shadow-2xl border border-slate-300 text-[10.5px] leading-[1.35] font-sans"
        >
          {/* A4 Header */}
          <div className="flex items-center justify-between border-b-2 border-[#0C1B2E] pb-2 mb-2.5">
            <div className="flex items-center gap-3">
              <img
                src="/logo-duyanhlab.jpg"
                alt="Duy Anh Digital Lab"
                className="h-12 w-auto rounded border border-slate-300 object-cover"
              />
              <div>
                <div className="text-[10px] font-extrabold tracking-widest text-[#0C1B2E] uppercase">
                  DUY ANH LAB • DIGITAL — WEB APP &amp; AI SOLUTIONS
                </div>
                <h1 className="text-[15px] font-extrabold text-[#0C1B2E] uppercase tracking-tight">
                  BẢNG YÊU CẦU THIẾT KẾ ỨNG DỤNG WEB (WEB APP BRIEF)
                </h1>
                <div className="text-[9.5px] text-slate-600">
                  Tiếp nhận &amp; Tư vấn: <strong>anhpob@gmail.com</strong> | Zalo / Hotline: <strong>+84 908 095693</strong> | Ngày lập: <strong>{todayStr}</strong>
                </div>
              </div>
            </div>
            <div className="text-right text-[9.5px] bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5">
              <div className="font-bold text-[#0C1B2E]">HỆ SINH THÁI WEB APP</div>
              <div className="font-mono text-[9px] text-slate-700">duy-anh-digital-lab.vercel.app</div>
              <div className="font-mono text-[9px] text-slate-700">ungdung.vercel.app</div>
            </div>
          </div>

          {/* 1. THÔNG TIN CHUNG */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              1. Thông tin chung &amp; Liên hệ
            </div>
            <div className="border border-slate-300 rounded-b p-2 grid grid-cols-2 gap-x-4 gap-y-1 bg-slate-50/40">
              <div>
                <span className="font-semibold text-slate-700">Tên Doanh nghiệp / Tổ chức: </span>
                <span className="font-bold text-slate-950">
                  {companyName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Tên Web App (Dự kiến): </span>
                <span className="font-bold text-slate-950">
                  {projectName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Người đại diện: </span>
                <span className="font-bold text-slate-950">
                  {contactName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">SĐT / Zalo / Email: </span>
                <span className="font-bold text-slate-950">
                  {contactPhone || '..............................'}
                  {contactEmail ? ` | ${contactEmail}` : ''}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">Tiến độ &amp; Phương án triển khai: </span>
                <span className="font-bold text-[#0C1B2E]">{timeline}</span>
              </div>
            </div>
          </div>

          {/* 2. HIỆN TRẠNG & BÀI TOÁN CẦN GIẢI QUYẾT */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              2. Hiện trạng &amp; Bài toán cần giải quyết
            </div>
            <div className="border border-slate-300 rounded-b p-2 space-y-1.5">
              <div>
                <div className="font-semibold text-slate-800 mb-0.5">
                  • Khó khăn lớn nhất trong quy trình hiện tại (Pain points):
                </div>
                <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                  {PAIN_POINT_OPTIONS.map((item) => (
                    <div key={item} className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900">
                        {selectedPainPoints.includes(item) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={selectedPainPoints.includes(item) ? 'font-bold text-slate-950' : 'text-slate-600'}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-800 mb-0.5">
                  • Mục tiêu kỳ vọng lớn nhất khi làm Web App này:
                </div>
                <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                  {GOAL_OPTIONS.map((item) => (
                    <div key={item} className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900">
                        {selectedGoals.includes(item) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={selectedGoals.includes(item) ? 'font-bold text-slate-950' : 'text-slate-600'}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1 border-t border-dashed border-slate-300">
                <span className="font-semibold text-slate-800">
                  • Mô tả ý tưởng cốt lõi / Luồng tính năng đặc thù (Must-have):{' '}
                </span>
                <span className="text-slate-950 font-medium">
                  {customNote ||
                    '................................................................................................................................................................................'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. YÊU CẦU KỸ THUẬT & TÍNH NĂNG CỐT LÕI */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              3. Yêu cầu Kỹ thuật, Quy mô &amp; Phong cách Giao diện
            </div>
            <div className="border border-slate-300 rounded-b p-2">
              <div className="grid grid-cols-3 gap-2 text-[9.5px]">
                {/* Col A */}
                <div className="border-r border-slate-200 pr-2">
                  <div className="font-bold text-[#0C1B2E] mb-1 underline">Hạ tầng &amp; Dữ liệu</div>
                  {INFRA_OPTIONS.map((item) => (
                    <div key={item} className="flex items-start gap-1 mb-0.5">
                      <span className="font-mono font-bold">
                        {selectedInfra.includes(item) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={selectedInfra.includes(item) ? 'font-bold' : ''}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Col B */}
                <div className="border-r border-slate-200 pr-2">
                  <div className="font-bold text-[#0C1B2E] mb-1 underline">Quy mô &amp; Nền tảng</div>
                  {SCALE_OPTIONS.map((item) => (
                    <div key={item} className="flex items-start gap-1 mb-0.5">
                      <span className="font-mono font-bold">
                        {selectedScale.includes(item) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={selectedScale.includes(item) ? 'font-bold' : ''}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Col C */}
                <div>
                  <div className="font-bold text-[#0C1B2E] mb-1 underline">Bảo mật &amp; Giao diện</div>
                  {SECURITY_OPTIONS.map((item) => (
                    <div key={item} className="flex items-start gap-1 mb-0.5">
                      <span className="font-mono font-bold">
                        {selectedSecurity.includes(item) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={selectedSecurity.includes(item) ? 'font-bold' : ''}>{item}</span>
                    </div>
                  ))}
                  <div className="mt-1 pt-1 border-t border-slate-200">
                    <span className="font-semibold">Phong cách: </span>
                    <span className="font-bold">{selectedStyle}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Ngôn ngữ: </span>
                    <span className="font-bold">{languageNote}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. PHÂN QUYỀN NGƯỜI DÙNG (ROLES & PERMISSIONS) */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              4. Phân quyền Người dùng (Roles &amp; Permissions)
            </div>
            <table className="w-full border-collapse border border-slate-300 text-[9.5px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 px-2 py-1 text-left w-1/4">Vai trò (Role)</th>
                  <th className="border border-slate-300 px-2 py-1 text-center w-24">Số lượng</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">
                    Quyền hạn chính (Xem, Thêm, Sửa, Xóa, Duyệt báo cáo...)
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id}>
                    <td className="border border-slate-300 px-2 py-1 font-semibold">
                      <span className="font-mono mr-1">{r.enabled ? '[✓]' : '[ ]'}</span>
                      {r.name}
                    </td>
                    <td className="border border-slate-300 px-2 py-1 text-center font-medium">
                      {r.enabled ? `${r.count} user` : '---'}
                    </td>
                    <td className="border border-slate-300 px-2 py-1 text-slate-700">
                      {r.enabled ? r.permissions : 'Không sử dụng'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. TÀI LIỆU ĐÍNH KÈM, GHI ÂM & HÌNH ẢNH MẪU */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              5. Tài liệu Đính kèm, Ghi âm &amp; Hình ảnh Tham khảo
            </div>
            <div className="border border-slate-300 rounded-b p-2 space-y-1 text-[9.5px]">
              <div className="grid grid-cols-3 gap-1">
                {DOC_TYPE_OPTIONS.map((item) => (
                  <div key={item} className="flex items-center gap-1">
                    <span className="font-mono font-bold">
                      {selectedDocTypes.includes(item) ? '[✓]' : '[ ]'}
                    </span>
                    <span className={selectedDocTypes.includes(item) ? 'font-bold' : ''}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <span className="font-semibold">• Ghi âm &amp; File đính kèm: </span>
                  <span>
                    {audioUrl ? `Có file ghi âm (${formatDuration(recordingSeconds)}); ` : ''}
                    {attachedDocs.length > 0
                      ? attachedDocs.map((d) => d.name).join(', ')
                      : !audioUrl
                      ? 'Không có file đính kèm trực tiếp'
                      : ''}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">• Link tham khảo / Drive: </span>
                  <span className="underline">{referenceLink || '................................................................'}</span>
                </div>
              </div>

              {/* Render up to 4 captured images compactly so A4 stays 1 page */}
              {capturedImages.length > 0 && (
                <div className="pt-1 border-t border-slate-200">
                  <div className="font-semibold mb-1">• Hình ảnh chụp / Giao diện mẫu đính kèm:</div>
                  <div className="grid grid-cols-4 gap-2">
                    {capturedImages.map((img) => (
                      <div key={img.id} className="border border-slate-300 rounded p-0.5 text-center">
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="h-14 w-full object-contain mx-auto"
                        />
                        <div className="text-[8px] truncate text-slate-600 mt-0.5">{img.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* A4 Footer Introducing Duy Anh Digital Lab */}
          <div className="border-t-2 border-[#0C1B2E] pt-1.5 flex items-center justify-between text-[9px] text-slate-700">
            <div>
              <div className="font-extrabold text-[#0C1B2E] uppercase">
                DUY ANH DIGITAL LAB — HỆ SINH THÁI ỨNG DỤNG WEB CHUYÊN SÂU &amp; GIẢI PHÁP AI
              </div>
              <div>
                Khám phá các dự án thực tế tại:{' '}
                <strong className="text-[#0C1B2E]">https://duy-anh-digital-lab.vercel.app</strong> &amp;{' '}
                <strong className="text-[#0C1B2E]">https://ungdung.vercel.app</strong>
              </div>
              <div>
                Lĩnh vực tiêu biểu: Báo cáo Thuế HKD • AI Advisor &amp; Đào tạo • R&amp;D Mỹ phẩm &amp; F&amp;B • Quản lý Hợp đồng &amp; SCM • ERP Nông nghiệp • Trợ lý Ngân hàng.
              </div>
            </div>
            <div className="text-right shrink-0 pl-3 border-l border-slate-300">
              <div className="font-bold text-[#0C1B2E]">LIÊN HỆ TRIỂN KHAI</div>
              <div>Email: <strong>anhpob@gmail.com</strong></div>
              <div>Zalo / ĐT: <strong>+84 908 095693</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
