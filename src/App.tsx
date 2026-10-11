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
  Users,
  Briefcase,
  Globe,
  Share2,
  Download,
  Languages,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Edit3,
  CheckCheck
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  LangCode,
  SUPPORTED_LANGUAGES,
  APP_TARGET_LANGUAGES,
  TRANSLATIONS,
  PresetItem
} from './i18n';

interface RoleState {
  id: string;
  enabled: boolean;
  count: string;
  customPermissions?: string;
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

const INTERVIEW_STEPS_LABELS: Record<
  LangCode,
  {
    stepNames: string[];
    q1Title: string;
    q1Sub: string;
    q2Title: string;
    q2Sub: string;
    q3Title: string;
    q3Sub: string;
    q4Title: string;
    q4Sub: string;
    q5Title: string;
    q5Sub: string;
    doneTitle: string;
    doneSub: string;
    nextBtn: string;
    prevBtn: string;
    finishBtn: string;
    editBtn: string;
    voiceAnswerBtn: string;
    voiceListening: string;
    printNowBigBtn: string;
  }
> = {
  vi: {
    stepNames: [
      '1. Thông tin & Lĩnh vực',
      '2. Ý tưởng & Mục tiêu',
      '3. Ngôn ngữ & Tính năng',
      '4. Người dùng & Tiến độ',
      '5. Ghi âm & Hình ảnh',
      '✅ Hoàn thành & In Phiếu'
    ],
    q1Title: 'Câu 1/5: Chào bạn! Bạn muốn thiết kế Web App cho đơn vị và lĩnh vực nào?',
    q1Sub: 'Bạn có thể chạm chọn mẫu gợi ý bên dưới, gõ phím hoặc bấm nút Mic 🎙️ để nói trực tiếp.',
    q2Title: 'Câu 2/5: Bài toán khó khăn hiện tại và ý tưởng chính của bạn là gì?',
    q2Sub: 'Chạm chọn các mục phù hợp hoặc bấm "🎙️ Trả lời bằng giọng nói" để kể nhanh ý tưởng của bạn.',
    q3Title: 'Câu 3/5: Bạn muốn Web App hỗ trợ những ngôn ngữ và tính năng kỹ thuật nào?',
    q3Sub: 'Tích chọn ngôn ngữ hiển thị (Việt, Anh, Hoa, Nhật, Hàn) và hạ tầng mong muốn.',
    q4Title: 'Câu 4/5: Những ai sẽ sử dụng hệ thống này và tiến độ bạn mong muốn?',
    q4Sub: 'Chọn các nhóm người dùng cần phân quyền và thời gian dự kiến triển khai.',
    q5Title: 'Câu 5/5: Bạn có muốn Ghi âm lời nhắn, Chụp ảnh mẫu hoặc Đính kèm file không?',
    q5Sub: 'Không bắt buộc — Bạn có thể ghi âm giọng nói, chụp ảnh bản vẽ tay/màn hình mẫu hoặc nhấn Hoàn thành ngay!',
    doneTitle: '🎉 Đã hoàn thành Phiếu Yêu Cầu Thiết Kế Web & Ứng Dụng!',
    doneSub: 'Kiểm tra lại tóm tắt bên dưới và bấm "In Phiếu Yêu Cầu (1 Trang A4)", "Tải PDF" hoặc gửi qua Email / Zalo.',
    nextBtn: 'Tiếp theo',
    prevBtn: 'Quay lại',
    finishBtn: 'Hoàn thành Phỏng vấn',
    editBtn: 'Sửa lại câu trả lời',
    voiceAnswerBtn: '🎙️ Bấm để Nói câu trả lời (Chuyển giọng nói thành chữ)',
    voiceListening: '🔴 Đang nghe bạn nói... (Bấm để dừng)',
    printNowBigBtn: '🖨️ IN PHIẾU YÊU CẦU RA GIẤY A4 (1 TRANG)'
  },
  en: {
    stepNames: [
      '1. Contact & Domain',
      '2. Idea & Goals',
      '3. Languages & Tech',
      '4. Users & Timeline',
      '5. Voice & Photos',
      '✅ Finish & Print A4'
    ],
    q1Title: 'Step 1/5: Welcome! What organization and industry is this Web App for?',
    q1Sub: 'Tap a quick template below, type briefly, or click the Mic 🎙️ button to speak.',
    q2Title: 'Step 2/5: What current challenges and core ideas do you want to solve?',
    q2Sub: 'Tap the matching tags or click "🎙️ Answer by Voice" to describe your idea effortlessly.',
    q3Title: 'Step 3/5: Which languages and technical features should the Web App include?',
    q3Sub: 'Select target languages (Vietnamese, English, Chinese, Japanese, Korean) and platform specs.',
    q4Title: 'Step 4/5: Who will use this Web App and what is your expected timeline?',
    q4Sub: 'Select user roles and your preferred delivery schedule.',
    q5Title: 'Step 5/5: Would you like to Record a Voice Note, Snap a Photo, or Attach Files?',
    q5Sub: 'Optional — Record voice instructions, snap a sketch/screenshot, or click Finish right away!',
    doneTitle: '🎉 Your Web Application Design Brief is Ready!',
    doneSub: 'Review your summary below and click "Print 1-Page A4 Brief", "Download PDF", or send via Email / Zalo.',
    nextBtn: 'Next Step',
    prevBtn: 'Back',
    finishBtn: 'Finish Interview',
    editBtn: 'Edit Answers',
    voiceAnswerBtn: '🎙️ Tap to Speak Your Answer (Voice-to-Text)',
    voiceListening: '🔴 Listening to you... (Tap to stop)',
    printNowBigBtn: '🖨️ PRINT REQUEST BRIEF (1-PAGE A4)'
  },
  zh: {
    stepNames: [
      '1. 基本信息与领域',
      '2. 核心创意与目标',
      '3. 语言与技术功能',
      '4. 用户权限与周期',
      '5. 录音与拍照附件',
      '✅ 完成并打印A4'
    ],
    q1Title: '第 1/5 步：您好！请问您想为哪个单位和行业定制 Web 应用？',
    q1Sub: '您可以点击下方快速模板、打字输入，或点击麦克风 🎙️ 直接语音输入。',
    q2Title: '第 2/5 步：目前面临的痛点问题以及您的核心想法是什么？',
    q2Sub: '点击适合的选项，或点击“🎙️ 语音回答”直接口述您的想法。',
    q3Title: '第 3/5 步：您希望 Web 应用支持哪些语言与技术功能？',
    q3Sub: '勾选需要集成的语言（越、英、中、日、韩）及界面风格。',
    q4Title: '第 4/5 步：哪些人员会使用该系统？您期望的开发周期是？',
    q4Sub: '选择用户角色权限及期望的上线时间。',
    q5Title: '第 5/5 步：是否需要录制语音留言、拍照上传样图或添加附件？',
    q5Sub: '选填 — 您可以直接录音、拍摄手稿/参考界面，或立即点击完成！',
    doneTitle: '🎉 您的 Web 应用程序设计需求表已完成！',
    doneSub: '请确认下方摘要，点击“打印单页A4需求表”、“下载PDF”或通过邮件 / Zalo 发送。',
    nextBtn: '下一步',
    prevBtn: '上一步',
    finishBtn: '完成填写',
    editBtn: '修改内容',
    voiceAnswerBtn: '🎙️ 点击语音回答 (自动语音转文字)',
    voiceListening: '🔴 正在倾听您的语音... (点击停止)',
    printNowBigBtn: '🖨️ 打印需求表 (标准单页 A4)'
  },
  ja: {
    stepNames: [
      '1. 基本情報・分野',
      '2. 課題とアイデア',
      '3. 言語・技術仕様',
      '4. 利用者・納期',
      '5. 録音・写真添付',
      '✅ 完了＆A4印刷'
    ],
    q1Title: '質問 1/5：どの企業・分野向けのWebアプリをご希望ですか？',
    q1Sub: 'テンプレートをタップするか、短い文字入力またはマイク 🎙️ で音声入力できます。',
    q2Title: '質問 2/5：現在の課題や実現したいコアアイデアは何ですか？',
    q2Sub: '当てはまる項目を選ぶか、「🎙️ 音声で回答」を押して自由にお話しください。',
    q3Title: '質問 3/5：搭載したい言語や技術機能・デザインは？',
    q3Sub: '対応言語（ベトナム語・英語・中国語・日本語・韓国語）と仕様を選択してください。',
    q4Title: '質問 4/5：利用するユーザー層とご希望の納期は？',
    q4Sub: 'ユーザーの役割（権限）と開発スケジュールを選択してください。',
    q5Title: '質問 5/5：音声録音や参考写真の撮影・ファイル添付はありますか？',
    q5Sub: '任意 — 音声メモの録音、手書き案のカメラ撮影、またはそのまま「完了」を押せます！',
    doneTitle: '🎉 Webアプリ開発 要件ヒアリングシートが完成しました！',
    doneSub: '内容をご確認の上、「A4（1枚）印刷」「PDF保存」またはメール / Zaloで送信してください。',
    nextBtn: '次へ進む',
    prevBtn: '戻る',
    finishBtn: '回答を完了する',
    editBtn: '回答を修正する',
    voiceAnswerBtn: '🎙️ 音声で回答する (音声テキスト変換)',
    voiceListening: '🔴 音声を聞き取り中... (タップで停止)',
    printNowBigBtn: '🖨️ 要件シートを印刷する (A4用紙 1枚)'
  },
  ko: {
    stepNames: [
      '1. 기본 정보 & 분야',
      '2. 아이디어 & 목표',
      '3. 지원 언어 & 기술',
      '4. 사용자 & 일정',
      '5. 음성 녹음 & 사진',
      '✅ 완료 & A4 인쇄'
    ],
    q1Title: '질문 1/5: 안녕하세요! 어떤 기업/분야의 웹앱을 제작하고 싶으신가요?',
    q1Sub: '아래 템플릿을 터치하거나 짧게 타이핑 또는 마이크 🎙️ 버튼으로 말씀해 주세요.',
    q2Title: '질문 2/5: 현재 해결하고 싶은 문제점과 핵심 아이디어는 무엇인가요?',
    q2Sub: '항목을 선택하시거나 "🎙️ 음성으로 답변하기"를 눌러 편하게 말씀해 주세요.',
    q3Title: '질문 3/5: 웹앱에 탑재할 언어와 기술 사양·디자인 스타일은?',
    q3Sub: '지원 언어(베트남어, 영어, 중국어, 일본어, 한국어)와 주요 기능을 선택해 주세요.',
    q4Title: '질문 4/5: 어떤 사용자들이 이용하며, 희망하시는 개발 일정은 언제인가요?',
    q4Sub: '권한별 사용자 그룹과 희망 제작 일정을 선택해 주세요.',
    q5Title: '질문 5/5: 음성 녹음, 참고 사진 촬영 또는 파일 첨부가 필요하신가요?',
    q5Sub: '선택 사항 — 음성 녹음이나 스케치 사진 촬영을 추가하거나 바로 완료를 누르세요!',
    doneTitle: '🎉 웹 & 애플리케이션 맞춤 설계 요청서가 완성되었습니다!',
    doneSub: '아래 요약 내용을 확인하시고 "A4 1장 인쇄", "PDF 다운로드" 또는 이메일 / Zalo로 전송하세요.',
    nextBtn: '다음 단계',
    prevBtn: '이전',
    finishBtn: '작성 완료하기',
    editBtn: '내용 수정하기',
    voiceAnswerBtn: '🎙️ 음성으로 답변 말하기 (음성 텍스트 자동 변환)',
    voiceListening: '🔴 말씀을 듣고 있습니다... (중지하려면 터치)',
    printNowBigBtn: '🖨️ 요청서 인쇄하기 (A4 1장 맞춤)'
  }
};

export default function App() {
  // Active UI Language (vi, en, zh, ja, ko)
  const [lang, setLang] = useState<LangCode>('vi');
  const t = TRANSLATIONS[lang];
  const wiz = INTERVIEW_STEPS_LABELS[lang];
  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  // Current Interview Step: 1..5 = Interview Questions, 6 = Completed Summary & Print Screen
  const [step, setStep] = useState<number>(1);

  // 1. General Info
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [timelineIdx, setTimelineIdx] = useState<number>(1);

  // 2. Pain Points & Goals
  const [painPointsIdx, setPainPointsIdx] = useState<number[]>([0, 1]);
  const [goalsIdx, setGoalsIdx] = useState<number[]>([0, 1]);
  const [customNote, setCustomNote] = useState('');

  // 3. Technical, Scale, Security, Style & Target App Languages (Việt, Anh, Hoa, Nhật, Hàn)
  const [infraIdx, setInfraIdx] = useState<number[]>([0, 2, 3]);
  const [scaleIdx, setScaleIdx] = useState<number[]>([0, 1]);
  const [securityIdx, setSecurityIdx] = useState<number[]>([0]);
  const [styleIdx, setStyleIdx] = useState<number>(0);
  const [selectedAppLangsIdx, setSelectedAppLangsIdx] = useState<number[]>([0, 1]);

  // 4. Roles & Permissions
  const [roleStates, setRoleStates] = useState<RoleState[]>([
    { id: 'admin', enabled: true, count: '1 - 2' },
    { id: 'manager', enabled: true, count: '2 - 5' },
    { id: 'staff', enabled: true, count: '5 - 30' },
    { id: 'customer', enabled: true, count: 'Unlimited' }
  ]);

  // 5. Voice Recording, Speech-to-Text, Camera Photos & Attachments
  const [docTypesIdx, setDocTypesIdx] = useState<number[]>([0]);
  const [referenceLink, setReferenceLink] = useState('');
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);

  // Audio Recording & Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [dictatingField, setDictatingField] = useState<string | null>(null);

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

  const handleSwitchLanguage = (newLang: LangCode) => {
    setLang(newLang);
    if (activePreset) {
      const presetInNewLang = TRANSLATIONS[newLang].presets.find((p) => p.id === activePreset);
      if (presetInNewLang) {
        setProjectName(presetInNewLang.projectName);
        setCustomNote(presetInNewLang.customNote);
      }
    }
    const meta = SUPPORTED_LANGUAGES.find((l) => l.code === newLang);
    if (meta) {
      showToast(`${meta.flag} ${meta.fullName}`);
    }
  };

  const applyPreset = (preset: PresetItem) => {
    setActivePreset(preset.id);
    setProjectName(preset.projectName);
    setPainPointsIdx(preset.painPointsIdx);
    setGoalsIdx(preset.goalsIdx);
    setInfraIdx(preset.infraIdx);
    setScaleIdx(preset.scaleIdx);
    setSecurityIdx(preset.securityIdx);
    setStyleIdx(preset.styleIdx);
    setCustomNote(preset.customNote);
    showToast(`✓ ${preset.label}`);
  };

  const resetForm = () => {
    setActivePreset(null);
    setCompanyName('');
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setProjectName('');
    setTimelineIdx(1);
    setPainPointsIdx([0]);
    setGoalsIdx([0]);
    setCustomNote('');
    setInfraIdx([0, 2, 3]);
    setScaleIdx([0, 1]);
    setSecurityIdx([0]);
    setStyleIdx(0);
    setSelectedAppLangsIdx([0, 1]);
    setRoleStates([
      { id: 'admin', enabled: true, count: '1 - 2' },
      { id: 'manager', enabled: true, count: '2 - 5' },
      { id: 'staff', enabled: true, count: '5 - 30' },
      { id: 'customer', enabled: true, count: 'Unlimited' }
    ]);
    setDocTypesIdx([]);
    setReferenceLink('');
    setCapturedImages([]);
    setAttachedDocs([]);
    setAudioUrl(null);
    setAudioBlob(null);
    setStep(1);
    showToast('✓ Đã làm mới từ đầu');
  };

  // Universal Voice-to-Text Dictation for any field ('projectName' | 'customNote' | 'companyName')
  const toggleFieldDictation = (
    fieldKey: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      startRecording();
      return;
    }

    if (dictatingField === fieldKey && recognitionRef.current) {
      recognitionRef.current.stop();
      setDictatingField(null);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLangMeta.speechLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setDictatingField(fieldKey);
    recognition.onend = () => setDictatingField(null);
    recognition.onerror = () => setDictatingField(null);
    recognition.onresult = (event: any) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) {
        setter((prev) => (prev ? `${prev.trim()} ${text}` : text));
        showToast(`🎙️ "${text}"`);
      }
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  // Full Voice Audio Recorder + Live Speech-to-Text
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
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = currentLangMeta.speechLang;
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
          }
        };
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          // Ignore
        }
      }
    } catch {
      alert(
        'Vui lòng cấp quyền Microphone trên trình duyệt để ghi âm, hoặc chọn Đính kèm file.'
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
    showToast('🎙️ Đã lưu bản ghi âm giọng nói!');
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
    showToast('📎 Đã đính kèm tài liệu!');
    e.target.value = '';
  };

  // Resolved selected strings in active language
  const selectedPainPoints = painPointsIdx.map((i) => t.painPointsOptions[i]).filter(Boolean);
  const selectedGoals = goalsIdx.map((i) => t.goalsOptions[i]).filter(Boolean);
  const selectedInfra = infraIdx.map((i) => t.infraOptions[i]).filter(Boolean);
  const selectedScale = scaleIdx.map((i) => t.scaleOptions[i]).filter(Boolean);
  const selectedSecurity = securityIdx.map((i) => t.securityOptions[i]).filter(Boolean);
  const selectedStyle = t.styleOptions[styleIdx] || t.styleOptions[0];
  const selectedTimeline = t.timelineOptions[timelineIdx] || t.timelineOptions[1];
  const selectedDocTypes = docTypesIdx.map((i) => t.docTypesOptions[i]).filter(Boolean);
  const appLangOptions = APP_TARGET_LANGUAGES[lang];
  const selectedAppLangs = selectedAppLangsIdx.map((i) => appLangOptions[i]).filter(Boolean);

  // Build formatted summary text for Email & Zalo
  const buildFormattedBriefText = () => {
    const activeRoles = roleStates
      .map((rs, idx) => {
        const trans = t.defaultRoles[idx];
        return {
          ...rs,
          name: trans?.name || rs.id,
          permissions: rs.customPermissions ?? trans?.permissions ?? ''
        };
      })
      .filter((r) => r.enabled)
      .map((r) => `  • ${r.name} (${r.count} user): ${r.permissions}`)
      .join('\n');

    const lines = [
      `📋 ${t.a4MainTitle} — DUY ANH DIGITAL LAB`,
      `${t.a4DateLabel}: ${todayStr} | Ngôn ngữ: ${currentLangMeta.fullName}`,
      `--------------------------------------------------`,
      `${t.a4Sec1Title}:`,
      `• ${t.companyLabel}: ${companyName || '---'}`,
      `• ${t.contactLabel}: ${contactName || '---'}`,
      `• ${t.phoneLabel}: ${contactPhone || '---'}${contactEmail ? ` | Email: ${contactEmail}` : ''}`,
      `• ${t.projectLabel}: ${projectName || '---'}`,
      `• ${t.timelineLabel} ${selectedTimeline}`,
      ``,
      `${t.a4Sec2Title}:`,
      `• Pain Points: ${selectedPainPoints.join(', ') || '---'}`,
      `• Goals: ${selectedGoals.join(', ') || '---'}`,
      `• ${t.customNoteLabel} ${customNote || '---'}`,
      ``,
      `${t.a4Sec3Title}:`,
      `• ${t.a4ColInfra}: ${selectedInfra.join(', ')}`,
      `• ${t.a4ColScale}: ${selectedScale.join(', ')}`,
      `• 🌐 App Target Languages: ${selectedAppLangs.join(', ') || 'Tiếng Việt'}`,
      `• ${t.a4ColSec}: ${selectedSecurity.join(', ')} | Style: ${selectedStyle}`,
      ``,
      `${t.a4Sec4Title}:`,
      activeRoles || '  • Default',
      ``,
      `${t.a4Sec5Title}:`,
      `• Documents: ${selectedDocTypes.join(', ') || '---'}`,
      `• Voice Recording: ${audioUrl ? `Yes (${formatDuration(recordingSeconds)})` : 'No'}`,
      `• Captured Photos: ${capturedImages.length > 0 ? `${capturedImages.length} (${capturedImages.map((i) => i.name).join(', ')})` : 'No'}`,
      `• Attached Files: ${attachedDocs.length > 0 ? attachedDocs.map((d) => d.name).join(', ') : 'No'}`,
      `• Reference Link: ${referenceLink || '---'}`,
      `--------------------------------------------------`,
      `🌐 Portfolio: https://duy-anh-digital-lab.vercel.app | https://ungdung.vercel.app`,
      `📧 Email: anhpob@gmail.com | 💬 Zalo: +84 908 095693`
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

      if (renderH > maxH) {
        renderH = maxH;
        renderW = renderH * ratio;
      }

      const xOffset = (pageWidth - renderW) / 2;
      const yOffset = margin;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, renderW, renderH);

      const safeName = (companyName || contactName || projectName || 'Brief')
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .slice(0, 24);
      const fileName = `Phieu-Yeu-Cau-WebApp-${safeName}-${lang.toUpperCase()}.pdf`;
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
      showToast('📄 Đã tải File PDF (Chuẩn 1 Trang A4)!');
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
            title: `Web App Brief - ${companyName || contactName || 'Duy Anh Digital Lab'}`,
            text,
            files: filesToShare
          });
          return;
        } else {
          await nav.share({
            title: `Web App Brief - ${companyName || contactName || 'Duy Anh Digital Lab'}`,
            text
          });
          return;
        }
      } catch {
        // Fallback
      }
    }
    await navigator.clipboard.writeText(text);
    showToast('✓ Đã sao chép toàn bộ nội dung!');
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
          `[Web App Brief - ${lang.toUpperCase()}] ${companyName || contactName || projectName || 'New Client'}`
        );
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('Language', currentLangMeta.fullName);
        formData.append('Company / Org', companyName || '---');
        formData.append('Contact Person', contactName || '---');
        formData.append('Phone / Zalo', contactPhone || '---');
        formData.append('Email', contactEmail || '---');
        formData.append('Project Name', projectName || '---');
        formData.append('Timeline', selectedTimeline);
        formData.append('Pain Points', selectedPainPoints.join(', '));
        formData.append('Expected Goals', selectedGoals.join(', '));
        formData.append('Custom Idea', customNote || '---');
        formData.append('Tech & Scale', `${selectedInfra.join(', ')} | ${selectedScale.join(', ')}`);
        formData.append('Target App Languages', selectedAppLangs.join(', '));
        formData.append('UI Style', selectedStyle);
        formData.append('Reference Link', referenceLink || '---');
        formData.append('Full Summary', summaryText);

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
      `[Web App Brief] ${companyName || contactName || projectName || 'Client'} - ${todayStr}`
    );
    const body = encodeURIComponent(buildFormattedBriefText());
    window.location.href = `mailto:anhpob@gmail.com?subject=${subject}&body=${body}`;
  };

  const openGmailWeb = () => {
    const subject = encodeURIComponent(
      `[Web App Brief] ${companyName || contactName || projectName || 'Client'} - ${todayStr}`
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

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-br from-slate-50 via-white to-amber-50/40 text-slate-900">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="no-print fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-300 font-bold text-base px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-amber-400/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ==================== BRIGHT INTERACTIVE INTERVIEW WIZARD ==================== */}
      <div className="no-print flex-1 flex flex-col justify-between max-w-5xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-5">
        {/* TOP HEADER: Brand + 5 Languages + Progress Stepper */}
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-sm">
            {/* Logo & Title */}
            <a
              href="https://duy-anh-digital-lab.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 group"
            >
              <img
                src="/logo-duyanhlab.jpg"
                alt="Duy Anh Digital Lab"
                className="h-11 sm:h-12 w-auto rounded-xl border border-slate-200 shadow-sm object-cover"
              />
              <div>
                <div className="text-xs sm:text-sm font-extrabold tracking-wider text-amber-700 uppercase">
                  DUY ANH LAB • digital
                </div>
                <h1 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {t.headerTitle}
                </h1>
              </div>
            </a>

            {/* 5-Language Switcher (Chữ to, sáng rõ) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <Languages className="w-4 h-4 text-slate-600 ml-1 hidden sm:inline" />
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSwitchLanguage(l.code)}
                  className={`text-sm font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    lang === l.code
                      ? 'bg-slate-900 text-amber-300 shadow-md scale-105'
                      : 'text-slate-700 hover:bg-white hover:text-slate-950'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Step Progress Pills (1..5 + Done) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {wiz.stepNames.map((label, idx) => {
              const sNum = idx + 1;
              const isCurrent = step === sNum;
              const isPassed = step > sNum;
              return (
                <button
                  key={sNum}
                  type="button"
                  onClick={() => setStep(sNum)}
                  className={`text-xs sm:text-sm font-bold py-2.5 px-2 rounded-xl border transition truncate text-center ${
                    isCurrent
                      ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md ring-2 ring-amber-400/50'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-800'
                  }`}
                >
                  {isPassed && sNum < 6 ? `✓ ${label}` : label}
                </button>
              );
            })}
          </div>
        </header>

        {/* CENTER INTERVIEW CARD (ONLY SHOWS 1 STEP AT A TIME — LARGE FONT, BRIGHT & CLEAN) */}
        <main className="my-3 sm:my-4 flex-1 flex flex-col justify-center">
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-8 shadow-xl transition-all">
            {/* ==================== STEP 1: THÔNG TIN LIÊN HỆ & MẪU DỰ ÁN ==================== */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {wiz.q1Title}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-600 mt-1">{wiz.q1Sub}</p>
                </div>

                {/* Quick Presets (Chữ to) */}
                <div>
                  <div className="text-sm sm:text-base font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>{t.quickPresetLabel}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {t.presets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className={`text-left text-base sm:text-lg font-bold p-3.5 rounded-2xl border-2 transition flex items-center justify-between ${
                          activePreset === preset.id
                            ? 'bg-amber-50 border-amber-600 text-slate-950 shadow-md'
                            : 'bg-slate-50/80 border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-white'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {activePreset === preset.id && (
                          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Large Input Fields with Mic Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-base sm:text-lg font-bold text-slate-800">
                        {t.projectLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleFieldDictation('projectName', setProjectName)}
                        className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border transition ${
                          dictatingField === 'projectName'
                            ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                            : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                        <span>
                          {dictatingField === 'projectName' ? wiz.voiceListening : t.dictateBtn}
                        </span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder={t.projectPlaceholder}
                      className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-xl font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                      {t.contactLabel}
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={t.contactPlaceholder}
                      className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-bold text-amber-800 mb-1.5">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full bg-amber-50/40 focus:bg-white border-2 border-amber-400 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-bold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                      {t.companyLabel}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t.companyPlaceholder}
                      className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-1.5">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 2: BÀI TOÁN & Ý TƯỞNG (GÕ PHÍM HOẶC GHI ÂM GIỌNG NÓI) ==================== */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {wiz.q2Title}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-600 mt-1">{wiz.q2Sub}</p>
                </div>

                {/* Pain Points (Chữ to) */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                    {t.painPointsLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {t.painPointsOptions.map((item, idx) => {
                      const active = painPointsIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(painPointsIdx, setPainPointsIdx, idx)}
                          className={`text-left text-base sm:text-lg font-semibold px-4 py-3 rounded-2xl border-2 transition flex items-center gap-3 ${
                            active
                              ? 'bg-amber-50 border-amber-600 text-slate-950 font-bold shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-400'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                              active ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {active ? '✓' : '+'}
                          </span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expected Goals (Chữ to) */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                    {t.goalsLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {t.goalsOptions.map((item, idx) => {
                      const active = goalsIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(goalsIdx, setGoalsIdx, idx)}
                          className={`text-left text-base sm:text-lg font-semibold px-4 py-3 rounded-2xl border-2 transition flex items-center gap-3 ${
                            active
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-400'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                              active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {active ? '✓' : '+'}
                          </span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Big Conversational Answer Box + Prominent Voice Answer Button */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <label className="text-base sm:text-xl font-extrabold text-slate-900">
                      {t.customNoteLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleFieldDictation('customNote', setCustomNote)}
                      className={`text-sm sm:text-base font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition ${
                        dictatingField === 'customNote'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                      <span>
                        {dictatingField === 'customNote'
                          ? wiz.voiceListening
                          : wiz.voiceAnswerBtn}
                      </span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder={t.customNotePlaceholder}
                    className="w-full bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl p-4 text-base sm:text-xl font-medium text-slate-900 placeholder-slate-400 outline-none resize-none transition"
                  />
                </div>
              </div>
            )}

            {/* ==================== STEP 3: NGÔN NGỮ LỰA CHỌN & TÍNH NĂNG KỸ THUẬT ==================== */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {wiz.q3Title}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-600 mt-1">{wiz.q3Sub}</p>
                </div>

                {/* 5 Target App Languages (Việt, Anh, Hoa, Nhật, Hàn) - Big Buttons */}
                <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 sm:p-5">
                  <label className="block text-base sm:text-xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <Languages className="w-6 h-6 text-amber-700" />
                    <span>{t.appLangLabel}</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {appLangOptions.map((label, idx) => {
                      const active = selectedAppLangsIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            toggleIndex(selectedAppLangsIdx, setSelectedAppLangsIdx, idx)
                          }
                          className={`text-base sm:text-lg font-bold py-3.5 px-3 rounded-2xl border-2 transition flex items-center justify-center gap-2 ${
                            active
                              ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md'
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

                {/* Infrastructure & Core Features */}
                <div>
                  <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                    {t.infraLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {t.infraOptions.map((item, idx) => {
                      const active = infraIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(infraIdx, setInfraIdx, idx)}
                          className={`text-left text-base sm:text-lg font-semibold px-4 py-3 rounded-2xl border-2 transition flex items-center gap-3 ${
                            active
                              ? 'bg-sky-50 border-sky-600 text-sky-950 font-bold shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                              active ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {active ? '✓' : '+'}
                          </span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scale & Design Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                      {t.scaleLabel}
                    </label>
                    <div className="space-y-2">
                      {t.scaleOptions.map((item, idx) => {
                        const active = scaleIdx.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleIndex(scaleIdx, setScaleIdx, idx)}
                            className={`w-full text-left text-base font-semibold px-4 py-2.5 rounded-xl border-2 transition flex items-center gap-2.5 ${
                              active
                                ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span>{active ? '✓' : '+'}</span>
                            <span>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                        {t.styleLabel}
                      </label>
                      <div className="space-y-2">
                        {t.styleOptions.map((st, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setStyleIdx(idx)}
                            className={`w-full text-left text-base font-semibold px-4 py-2.5 rounded-xl border-2 transition flex items-center justify-between ${
                              styleIdx === idx
                                ? 'bg-amber-50 border-amber-600 text-slate-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                            }`}
                          >
                            <span>{st}</span>
                            {styleIdx === idx && (
                              <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 4: PHÂN QUYỀN NGƯỜI DÙNG & TIẾN ĐỘ ==================== */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {wiz.q4Title}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-600 mt-1">{wiz.q4Sub}</p>
                </div>

                {/* Roles Cards (Chữ to, dễ bấm) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {roleStates.map((role, idx) => {
                    const trans = t.defaultRoles[idx];
                    const displayPerm = role.customPermissions ?? trans?.permissions ?? '';
                    return (
                      <div
                        key={role.id}
                        className={`p-4 rounded-2xl border-2 transition ${
                          role.enabled
                            ? 'bg-white border-slate-900 shadow-md'
                            : 'bg-slate-100 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <label className="flex items-center gap-2.5 cursor-pointer text-base sm:text-lg font-extrabold text-slate-900">
                            <input
                              type="checkbox"
                              checked={role.enabled}
                              onChange={(e) => {
                                const next = [...roleStates];
                                next[idx].enabled = e.target.checked;
                                setRoleStates(next);
                              }}
                              className="accent-slate-900 w-5 h-5 rounded"
                            />
                            <span>{trans?.name}</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-semibold text-slate-500">
                              {t.roleQtyLabel}
                            </span>
                            <input
                              type="text"
                              value={role.count}
                              onChange={(e) => {
                                const next = [...roleStates];
                                next[idx].count = e.target.value;
                                setRoleStates(next);
                              }}
                              className="w-24 bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1 text-sm sm:text-base font-bold text-slate-900 text-center outline-none"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={displayPerm}
                          onChange={(e) => {
                            const next = [...roleStates];
                            next[idx].customPermissions = e.target.value;
                            setRoleStates(next);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2 text-sm sm:text-base text-slate-700 outline-none"
                          placeholder={t.rolePermPlaceholder}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Timeline & Security */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                      {t.timelineLabel}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {t.timelineOptions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTimelineIdx(idx)}
                          className={`text-left text-base sm:text-lg font-bold px-4 py-3 rounded-2xl border-2 transition flex items-center justify-between ${
                            timelineIdx === idx
                              ? 'bg-amber-50 border-amber-600 text-slate-950 shadow-sm'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <span>{item}</span>
                          {timelineIdx === idx && (
                            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2">
                      {t.securityLabel}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {t.securityOptions.map((item, idx) => {
                        const active = securityIdx.includes(idx);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleIndex(securityIdx, setSecurityIdx, idx)}
                            className={`text-left text-base sm:text-lg font-semibold px-4 py-3 rounded-2xl border-2 transition flex items-center gap-3 ${
                              active
                                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
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
              </div>
            )}

            {/* ==================== STEP 5: GHI ÂM GIỌNG NÓI, CHỤP ẢNH MẪU & ĐÍNH KÈM ==================== */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {wiz.q5Title}
                  </h2>
                  <p className="text-sm sm:text-lg text-slate-600 mt-1">{wiz.q5Sub}</p>
                </div>

                {/* 3 Giant Action Cards: Record Voice | Camera Capture | Attach File */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Voice Recording */}
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex flex-col items-center justify-center gap-2.5 p-6 rounded-3xl bg-rose-50 hover:bg-rose-100/80 border-2 border-rose-300 text-rose-950 transition shadow-sm group"
                    >
                      <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Mic className="w-8 h-8" />
                      </div>
                      <span className="text-lg sm:text-xl font-extrabold text-center">
                        {t.recordVoiceTitle}
                      </span>
                      <span className="text-sm font-medium text-rose-700">
                        {t.recordVoiceSub}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex flex-col items-center justify-center gap-2.5 p-6 rounded-3xl bg-rose-600 text-white border-2 border-rose-700 animate-pulse shadow-xl"
                    >
                      <Square className="w-12 h-12 fill-white" />
                      <span className="text-xl font-extrabold">
                        {t.stopRecordingBtn} ({formatDuration(recordingSeconds)})
                      </span>
                      <span className="text-sm">{t.recordingSub}</span>
                    </button>
                  )}

                  {/* Card 2: Camera Capture */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2.5 p-6 rounded-3xl bg-sky-50 hover:bg-sky-100/80 border-2 border-sky-300 text-sky-950 transition shadow-sm group"
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-center">
                      {t.cameraTitle}
                    </span>
                    <span className="text-sm font-medium text-sky-700">{t.cameraSub}</span>
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageInputChange}
                    className="hidden"
                  />

                  {/* Card 3: Attach Files */}
                  <button
                    type="button"
                    onClick={() => fileUploadRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2.5 p-6 rounded-3xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-300 text-amber-950 transition shadow-sm group"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Paperclip className="w-8 h-8" />
                    </div>
                    <span className="text-lg sm:text-xl font-extrabold text-center">
                      {t.attachTitle}
                    </span>
                    <span className="text-sm font-medium text-amber-800">{t.attachSub}</span>
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
                  <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                      <Volume2 className="w-6 h-6 text-rose-600 shrink-0" />
                      <audio src={audioUrl} controls className="h-10 w-full max-w-md" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadVoiceRecording}
                        className="text-sm font-bold px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> {t.downloadAudioBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAudioUrl(null);
                          setAudioBlob(null);
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Captured Images Preview */}
                {capturedImages.length > 0 && (
                  <div className="p-4 rounded-2xl bg-sky-50/60 border-2 border-sky-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-sky-900 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> {t.capturedImagesLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => photoUploadRef.current?.click()}
                        className="text-sm font-bold text-sky-700 underline"
                      >
                        {t.addMorePhotoBtn}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {capturedImages.map((img) => (
                        <div
                          key={img.id}
                          className="relative h-24 rounded-xl overflow-hidden border-2 border-white shadow bg-white"
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
                            className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
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

                {/* Attached Docs List */}
                {attachedDocs.length > 0 && (
                  <div className="space-y-2">
                    {attachedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between text-base font-semibold bg-slate-100 border border-slate-300 px-4 py-2.5 rounded-xl"
                      >
                        <span className="truncate flex items-center gap-2 text-slate-800">
                          <FileText className="w-5 h-5 text-amber-700 shrink-0" />
                          {doc.name} <span className="text-slate-500">({doc.size})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachedDocs((prev) => prev.filter((d) => d.id !== doc.id))
                          }
                          className="text-slate-500 hover:text-rose-600 ml-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reference Link & Existing Doc Checkboxes */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {t.docTypesOptions.map((item, idx) => {
                      const active = docTypesIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(docTypesIdx, setDocTypesIdx, idx)}
                          className={`text-sm sm:text-base font-semibold px-3.5 py-2 rounded-xl border transition ${
                            active
                              ? 'bg-slate-900 text-amber-300 border-slate-900 font-bold'
                              : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-white'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {item}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="url"
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    placeholder={t.refLinkPlaceholder}
                    className="w-full bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-slate-900 rounded-2xl px-4 py-3 text-base sm:text-lg font-medium text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* ==================== STEP 6: MÀN HÌNH HOÀN THÀNH & BẤM IN PHIẾU YÊU CẦU ==================== */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center space-y-2 pb-2 border-b border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mb-1">
                    <CheckCheck className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {wiz.doneTitle}
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                    {wiz.doneSub}
                  </p>
                </div>

                {/* GIANT PRIMARY CTA: IN PHIẾU YÊU CẦU (1 TRANG A4) & TẢI PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handlePrintA4}
                    className="py-5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                  >
                    <Printer className="w-7 h-7 shrink-0" />
                    <span>{wiz.printNowBigBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="py-5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5"
                  >
                    <FileDown className="w-7 h-7 shrink-0" />
                    <span>
                      {isGeneratingPdf ? t.generatingPdf : `${t.downloadPdfBtn} (1 Trang A4)`}
                    </span>
                  </button>
                </div>

                {/* Secondary Actions: Send Email, Send Zalo, Preview A4 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenSendChannel('email')}
                    className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition"
                  >
                    <Mail className="w-6 h-6 shrink-0" />
                    <div className="text-left leading-tight">
                      <div>{t.sendEmailBtn}</div>
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
                      <div>{t.sendZaloBtn}</div>
                      <div className="text-xs font-semibold opacity-90">+84 908 095693</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowA4Preview(true)}
                    className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-6 h-6 text-slate-700" />
                    <span>{t.previewA4Btn}</span>
                  </button>
                </div>

                {/* Compact Readable Summary Card with Quick Edit Buttons */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 text-base">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-900 text-lg">
                      📋 Tóm tắt thông tin bạn đã chọn:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm font-bold text-amber-800 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" /> {wiz.editBtn}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm sm:text-base">
                    <div>
                      <span className="text-slate-500 font-medium">{t.projectLabel}: </span>
                      <strong className="text-slate-900">{projectName || '---'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">{t.contactLabel} / SĐT: </span>
                      <strong className="text-slate-900">
                        {contactName || companyName || '---'} ({contactPhone || '---'})
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">🌐 Ngôn ngữ Web App: </span>
                      <strong className="text-amber-800">{selectedAppLangs.join(', ')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Tiến độ & Giao diện: </span>
                      <strong className="text-slate-900">
                        {selectedTimeline} • {selectedStyle}
                      </strong>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500 font-medium">Mục tiêu & Ý tưởng: </span>
                      <strong className="text-slate-900">
                        {[...selectedGoals, customNote].filter(Boolean).join(' — ') || '---'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOTTOM NAVIGATION BAR INSIDE INTERVIEW CARD */}
            <div className="mt-7 pt-4 border-t-2 border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-base sm:text-lg font-bold px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-2 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{wiz.prevBtn}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-semibold px-4 py-2.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.resetBtn}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < 6 && (
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="text-sm sm:text-base font-bold px-4 py-3 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    Đi tới Hoàn thành &amp; In A4 →
                  </button>
                )}

                {step < 5 && (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="text-base sm:text-xl font-extrabold px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 shadow-lg flex items-center gap-2.5 transition transform hover:translate-x-0.5"
                  >
                    <span>{wiz.nextBtn}</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                )}

                {step === 5 && (
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="text-base sm:text-xl font-extrabold px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center gap-2.5 transition transform hover:scale-105"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>{wiz.finishBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== EXACT FOOTER FROM UNGDUNG.VERCEL.APP ==================== */}
      <footer id="about" className="no-print bg-[#050B14] border-t border-amber-500/20 text-slate-300 text-sm">
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

      {/* ==================== MODAL GỬI EMAIL / ZALO KÈM FILE ĐÍNH KÈM ==================== */}
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
                      ⏳ Đang đồng thời gửi bản sao tự động tới <strong>anhpob@gmail.com</strong>...
                    </div>
                  )}
                  {sendModal.channel === 'email' && sendModal.cloudSent && (
                    <div className="text-xs sm:text-sm text-emerald-700 mt-1 font-semibold">
                      ✅ Đã gửi trực tuyến thành công tới <strong>anhpob@gmail.com</strong>!
                    </div>
                  )}
                </div>
              </div>

              {/* Step 1: Download PDF / Audio */}
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
                    <span>{isGeneratingPdf ? t.generatingPdf : 'Tải PDF (1 Trang A4)'}</span>
                  </button>
                  {audioUrl && (
                    <button
                      type="button"
                      onClick={downloadVoiceRecording}
                      className="px-4 py-2 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 font-bold flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.downloadAudioBtn}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNativeShareWithFiles}
                    className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{t.quickShareBtn}</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Open Email or Zalo */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-900">
                  {sendModal.channel === 'email'
                    ? '2. Mở ứng dụng Email (Đã điền sẵn người nhận anhpob@gmail.com):'
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
                {t.a4CloseBtn}
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
            ? 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto py-6 px-3 flex flex-col items-center'
            : 'fixed -left-[9999px] top-0 pointer-events-none opacity-0'
        }
      >
        {showA4Preview && (
          <div className="no-print max-w-[210mm] w-full mb-3 flex flex-wrap items-center justify-between gap-2 bg-white border-2 border-slate-300 px-4 py-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                {t.a4PreviewBanner}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">{t.a4PreviewSub}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintA4}
                className="px-4 py-2 rounded-xl bg-slate-900 text-amber-300 font-bold text-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> {t.printA4Btn}
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4" />{' '}
                {isGeneratingPdf ? t.generatingPdf : t.downloadPdfBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowA4Preview(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 text-sm font-bold flex items-center gap-1"
              >
                <X className="w-4 h-4" /> {t.a4CloseBtn}
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
          <div className="flex items-center justify-between border-b-2 border-[#0C1B2E] pb-2 mb-2">
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
                <h1 className="text-[14px] font-extrabold text-[#0C1B2E] uppercase tracking-tight">
                  {t.a4MainTitle}
                </h1>
                <div className="text-[9.5px] text-slate-600">
                  {t.a4HeaderSub} | {t.a4DateLabel}: <strong>{todayStr}</strong>
                </div>
              </div>
            </div>
            <div className="text-right text-[9.5px] bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5">
              <div className="font-bold text-[#0C1B2E]">{t.a4EcosystemTitle}</div>
              <div className="font-mono text-[9px] text-slate-700">duy-anh-digital-lab.vercel.app</div>
              <div className="font-mono text-[9px] text-slate-700">ungdung.vercel.app</div>
            </div>
          </div>

          {/* 1. THÔNG TIN CHUNG */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              {t.a4Sec1Title}
            </div>
            <div className="border border-slate-300 rounded-b p-2 grid grid-cols-2 gap-x-4 gap-y-1 bg-slate-50/40">
              <div>
                <span className="font-semibold text-slate-700">{t.companyLabel}: </span>
                <span className="font-bold text-slate-950">
                  {companyName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">{t.projectLabel}: </span>
                <span className="font-bold text-slate-950">
                  {projectName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">{t.contactLabel}: </span>
                <span className="font-bold text-slate-950">
                  {contactName || '............................................................'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">{t.phoneLabel}: </span>
                <span className="font-bold text-slate-950">
                  {contactPhone || '..............................'}
                  {contactEmail ? ` | ${contactEmail}` : ''}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-700">{t.timelineLabel} </span>
                <span className="font-bold text-[#0C1B2E]">{selectedTimeline}</span>
              </div>
            </div>
          </div>

          {/* 2. HIỆN TRẠNG & BÀI TOÁN CẦN GIẢI QUYẾT */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              {t.a4Sec2Title}
            </div>
            <div className="border border-slate-300 rounded-b p-2 space-y-1.5">
              <div>
                <div className="font-semibold text-slate-800 mb-0.5">• {t.painPointsLabel}</div>
                <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                  {t.painPointsOptions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900">
                        {painPointsIdx.includes(idx) ? '[✓]' : '[ ]'}
                      </span>
                      <span
                        className={
                          painPointsIdx.includes(idx) ? 'font-bold text-slate-950' : 'text-slate-600'
                        }
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-800 mb-0.5">• {t.goalsLabel}</div>
                <div className="grid grid-cols-3 gap-1 text-[9.5px]">
                  {t.goalsOptions.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="font-mono font-bold text-slate-900">
                        {goalsIdx.includes(idx) ? '[✓]' : '[ ]'}
                      </span>
                      <span
                        className={
                          goalsIdx.includes(idx) ? 'font-bold text-slate-950' : 'text-slate-600'
                        }
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1 border-t border-dashed border-slate-300">
                <span className="font-semibold text-slate-800">• {t.customNoteLabel} </span>
                <span className="text-slate-950 font-medium">
                  {customNote ||
                    '................................................................................................................................................................................'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. YÊU CẦU KỸ THUẬT, NGÔN NGỮ & TÍNH NĂNG CỐT LÕI */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              {t.a4Sec3Title}
            </div>
            <div className="border border-slate-300 rounded-b p-2">
              <div className="grid grid-cols-3 gap-2 text-[9.5px]">
                <div className="border-r border-slate-200 pr-2">
                  <div className="font-bold text-[#0C1B2E] mb-1 underline">{t.a4ColInfra}</div>
                  {t.infraOptions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1 mb-0.5">
                      <span className="font-mono font-bold">
                        {infraIdx.includes(idx) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={infraIdx.includes(idx) ? 'font-bold' : ''}>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-r border-slate-200 pr-2">
                  <div className="font-bold text-[#0C1B2E] mb-1 underline">{t.a4ColScale}</div>
                  {t.scaleOptions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1 mb-0.5">
                      <span className="font-mono font-bold">
                        {scaleIdx.includes(idx) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={scaleIdx.includes(idx) ? 'font-bold' : ''}>{item}</span>
                    </div>
                  ))}
                  <div className="mt-1 pt-1 border-t border-slate-200">
                    <span className="font-bold text-[#0C1B2E] block mb-0.5">
                      🌐 {t.appLangLabel}
                    </span>
                    <div className="font-bold text-slate-900">
                      {selectedAppLangs.join(' • ') || '🇻🇳 Tiếng Việt'}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#0C1B2E] mb-1 underline">{t.a4ColSec}</div>
                  {t.securityOptions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1 mb-0.5">
                      <span className="font-mono font-bold">
                        {securityIdx.includes(idx) ? '[✓]' : '[ ]'}
                      </span>
                      <span className={securityIdx.includes(idx) ? 'font-bold' : ''}>{item}</span>
                    </div>
                  ))}
                  <div className="mt-1 pt-1 border-t border-slate-200">
                    <span className="font-semibold">{t.styleLabel} </span>
                    <span className="font-bold">{selectedStyle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. PHÂN QUYỀN NGƯỜI DÙNG (ROLES & PERMISSIONS) */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              {t.a4Sec4Title}
            </div>
            <table className="w-full border-collapse border border-slate-300 text-[9.5px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 px-2 py-1 text-left w-1/4">
                    {t.a4RoleCol}
                  </th>
                  <th className="border border-slate-300 px-2 py-1 text-center w-24">
                    {t.a4QtyCol}
                  </th>
                  <th className="border border-slate-300 px-2 py-1 text-left">{t.a4PermCol}</th>
                </tr>
              </thead>
              <tbody>
                {roleStates.map((r, idx) => {
                  const trans = t.defaultRoles[idx];
                  const perm = r.customPermissions ?? trans?.permissions ?? '';
                  return (
                    <tr key={r.id}>
                      <td className="border border-slate-300 px-2 py-1 font-semibold">
                        <span className="font-mono mr-1">{r.enabled ? '[✓]' : '[ ]'}</span>
                        {trans?.name}
                      </td>
                      <td className="border border-slate-300 px-2 py-1 text-center font-medium">
                        {r.enabled ? `${r.count}` : '---'}
                      </td>
                      <td className="border border-slate-300 px-2 py-1 text-slate-700">
                        {r.enabled ? perm : t.a4NotUsed}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. TÀI LIỆU ĐÍNH KÈM, GHI ÂM & HÌNH ẢNH MẪU */}
          <div className="mb-2">
            <div className="bg-[#0C1B2E] text-white font-bold text-[10.5px] px-2 py-0.5 rounded-t uppercase tracking-wide">
              {t.a4Sec5Title}
            </div>
            <div className="border border-slate-300 rounded-b p-2 space-y-1 text-[9.5px]">
              <div className="grid grid-cols-3 gap-1">
                {t.docTypesOptions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="font-mono font-bold">
                      {docTypesIdx.includes(idx) ? '[✓]' : '[ ]'}
                    </span>
                    <span className={docTypesIdx.includes(idx) ? 'font-bold' : ''}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <div>
                  <span className="font-semibold">{t.a4AudioAndFiles}</span>
                  <span>
                    {audioUrl ? `Voice (${formatDuration(recordingSeconds)}); ` : ''}
                    {attachedDocs.length > 0
                      ? attachedDocs.map((d) => d.name).join(', ')
                      : !audioUrl
                      ? '---'
                      : ''}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">{t.a4RefLink}</span>
                  <span className="underline">
                    {referenceLink || '................................................................'}
                  </span>
                </div>
              </div>

              {capturedImages.length > 0 && (
                <div className="pt-1 border-t border-slate-200">
                  <div className="font-semibold mb-1">{t.a4AttachedPhotos}</div>
                  <div className="grid grid-cols-4 gap-2">
                    {capturedImages.map((img) => (
                      <div
                        key={img.id}
                        className="border border-slate-300 rounded p-0.5 text-center"
                      >
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
              <div className="font-extrabold text-[#0C1B2E] uppercase">{t.a4FooterTitle}</div>
              <div>
                {t.a4FooterExplore}{' '}
                <strong className="text-[#0C1B2E]">https://duy-anh-digital-lab.vercel.app</strong>{' '}
                &amp; <strong className="text-[#0C1B2E]">https://ungdung.vercel.app</strong>
              </div>
              <div>{t.a4FooterDomains}</div>
            </div>
            <div className="text-right shrink-0 pl-3 border-l border-slate-300">
              <div className="font-bold text-[#0C1B2E]">{t.a4FooterContact}</div>
              <div>
                Email: <strong>anhpob@gmail.com</strong>
              </div>
              <div>
                Zalo / Tel: <strong>+84 908 095693</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
