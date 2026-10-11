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
  Download,
  Languages
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

export default function App() {
  // Active UI Language (vi, en, zh, ja, ko)
  const [lang, setLang] = useState<LangCode>('vi');
  const t = TRANSLATIONS[lang];
  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  // 1. General Info
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [timelineIdx, setTimelineIdx] = useState<number>(1);

  // 2. Pain Points & Goals (stored as option indices so switching language translates them seamlessly!)
  const [painPointsIdx, setPainPointsIdx] = useState<number[]>([0, 1]);
  const [goalsIdx, setGoalsIdx] = useState<number[]>([0, 1]);
  const [customNote, setCustomNote] = useState('');

  // 3. Technical, Scale, Security, Style & Target App Languages (Việt, Anh, Hoa, Nhật, Hàn)
  const [infraIdx, setInfraIdx] = useState<number[]>([0, 2, 3]);
  const [scaleIdx, setScaleIdx] = useState<number[]>([0, 1]);
  const [securityIdx, setSecurityIdx] = useState<number[]>([0]);
  const [styleIdx, setStyleIdx] = useState<number>(0);
  // Selected languages for the customer's Web App (indices 0..4 => Việt, Anh, Hoa, Nhật, Hàn)
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

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isDictating, setIsDictating] = useState(false);

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
    // If active preset was selected, update projectName & customNote to match the new language
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
    showToast('✓ Reset');
  };

  // Voice Recorder + Speech Recognition in active language (vi-VN, en-US, zh-CN, ja-JP, ko-KR)
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

      // Also start SpeechRecognition in current language to auto-transcribe
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
          // Ignore speech recognition start error
        }
      }
    } catch {
      alert(
        'Không thể truy cập Microphone / Microphone permission denied. Please allow microphone access or use Attach File.'
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
    showToast('🎙️ Saved Voice Recording!');
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
    recognition.lang = currentLangMeta.speechLang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsDictating(true);
    recognition.onend = () => setIsDictating(false);
    recognition.onerror = () => setIsDictating(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) {
        setCustomNote((prev) => (prev ? `${prev.trim()}. ${text}` : text));
        showToast('✓ Voice transcribed!');
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
        showToast(`📷 + ${customName || file.name}`);
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
    showToast('📎 File attached!');
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
      `${t.a4DateLabel}: ${todayStr} | UI Language: ${currentLangMeta.fullName}`,
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

      // Strictly fit on 1 single A4 page
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
      const fileName = `WebApp-Brief-${safeName}-${lang.toUpperCase()}.pdf`;
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
      showToast('📄 PDF (1-Page A4) downloaded!');
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
    a.download = `Voice-Brief-${Date.now().toString().slice(-4)}.webm`;
    a.click();
  };

  // Native Share (Mobile / iPad / Modern Browsers)
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
    showToast('✓ Copied to clipboard!');
  };

  // Trigger Email / Zalo Submission Flow
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
      showToast('✓ Copied! Paste (Ctrl+V) into Zalo chat.');
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
        <header className="shrink-0 bg-[#0C1B2E]/95 border-b border-[#DFC89A]/20 px-3 sm:px-5 py-1.5">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-1.5">
            {/* Row 1: Brand + 5-Language Switcher + Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Brand & Title */}
              <div className="flex items-center gap-2.5">
                <a
                  href="https://duy-anh-digital-lab.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5"
                  title="Duy Anh Digital Lab"
                >
                  <img
                    src="/logo-duyanhlab.jpg"
                    alt="Duy Anh Digital Lab"
                    className="h-9 w-auto rounded-lg border border-[#DFC89A]/40 object-cover shadow-md group-hover:border-[#DFC89A] transition"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#DFC89A]">
                        DUY ANH LAB • digital
                      </span>
                      <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DFC89A]/15 text-[#DFC89A] border border-[#DFC89A]/30">
                        <Sparkles className="w-2.5 h-2.5" /> {t.headerBadge}
                      </span>
                    </div>
                    <h1 className="text-xs sm:text-[15px] font-bold text-white leading-tight">
                      {t.headerTitle}
                    </h1>
                  </div>
                </a>
              </div>

              {/* 5-Language Switcher (Việt, Anh, Hoa, Nhật, Hàn) */}
              <div className="flex items-center gap-1 bg-[#07111E] border border-[#DFC89A]/30 rounded-full px-2 py-1 shadow-inner">
                <Languages className="w-3.5 h-3.5 text-[#DFC89A] mr-0.5 hidden sm:inline" />
                <span className="text-[10px] text-slate-400 font-medium mr-1 hidden xl:inline">
                  {t.uiLangLabel}
                </span>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSwitchLanguage(l.code)}
                    className={`text-[11px] px-2 py-0.5 rounded-full transition flex items-center gap-1 ${
                      lang === l.code
                        ? 'bg-[#DFC89A] text-[#07111E] font-extrabold shadow'
                        : 'text-slate-300 hover:text-[#DFC89A] hover:bg-slate-800/70'
                    }`}
                    title={l.fullName}
                  >
                    <span>{l.flag}</span>
                    <span>{l.shortLabel}</span>
                  </button>
                ))}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowA4Preview(true)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-[#DFC89A] border border-[#DFC89A]/30 flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.previewA4Btn}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintA4}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600 flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-[#DFC89A]" />
                  <span>{t.printA4Btn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#DFC89A]/20 hover:bg-[#DFC89A]/30 text-[#DFC89A] border border-[#DFC89A]/50 flex items-center gap-1.5 transition"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isGeneratingPdf ? t.generatingPdf : t.downloadPdfBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSendChannel('email')}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#DFC89A] to-[#C9AD76] text-[#07111E] hover:brightness-110 flex items-center gap-1.5 shadow-md transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.sendEmailBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSendChannel('zalo')}
                  className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 shadow-md transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t.sendZaloBtn}</span>
                </button>
              </div>
            </div>

            {/* Row 2: 1-Click Templates Bar */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 thin-scroll border-t border-slate-800/80 pt-1">
              <span className="text-[11px] text-[#DFC89A] font-semibold mr-1 shrink-0">
                {t.quickPresetLabel}
              </span>
              {t.presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border transition shrink-0 ${
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
                className="text-[11px] text-slate-400 hover:text-rose-300 px-2 py-0.5 rounded-full border border-slate-800 hover:border-rose-400/40 flex items-center gap-1 shrink-0 ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetBtn}</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN 3-COLUMN BENTO GRID (STRICTLY 1 SCREEN ON DESKTOP) */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-5 py-2 grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:overflow-hidden">
          {/* ==================== COLUMN 1: THÔNG TIN CHUNG & BÀI TOÁN (4 COLS) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-2 lg:overflow-y-auto thin-scroll pr-0.5">
            {/* Section 1: Thông tin chung */}
            <section className="bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-2.5 shadow-lg">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                  <Briefcase className="w-4 h-4" />
                  {t.sec1Title}
                </h2>
                <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  {t.sec1Badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    {t.companyLabel}
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t.companyPlaceholder}
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    {t.contactLabel}
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={t.contactPlaceholder}
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#DFC89A] mb-0.5 font-semibold">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full bg-[#07111E] border border-[#DFC89A]/50 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-300 mb-0.5 font-medium">
                    {t.projectLabel}
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder={t.projectPlaceholder}
                    className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Tiến độ kỳ vọng */}
              <div className="mt-1.5">
                <span className="block text-[11px] text-slate-400 mb-1">{t.timelineLabel}</span>
                <div className="grid grid-cols-2 gap-1">
                  {t.timelineOptions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTimelineIdx(idx)}
                      className={`text-[11px] px-2 py-1 rounded-md border text-left truncate transition ${
                        timelineIdx === idx
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
            <section className="flex-1 bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-2.5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4" />
                    {t.sec2Title}
                  </h2>
                  <span className="text-[10px] text-slate-400">{t.sec2Badge}</span>
                </div>

                {/* Pain Points */}
                <div className="mb-1.5">
                  <p className="text-[11px] text-slate-300 font-medium mb-1">
                    {t.painPointsLabel}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {t.painPointsOptions.map((item, idx) => {
                      const active = painPointsIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(painPointsIdx, setPainPointsIdx, idx)}
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
                <div className="mb-1.5">
                  <p className="text-[11px] text-slate-300 font-medium mb-1">{t.goalsLabel}</p>
                  <div className="flex flex-wrap gap-1">
                    {t.goalsOptions.map((item, idx) => {
                      const active = goalsIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(goalsIdx, setGoalsIdx, idx)}
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
                    {t.customNoteLabel}
                  </label>
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border transition ${
                      isDictating
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-[#132640] text-[#DFC89A] border-[#DFC89A]/40 hover:bg-[#DFC89A]/20'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isDictating ? t.dictatingBtn : t.dictateBtn}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder={t.customNotePlaceholder}
                  className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none resize-none transition"
                />
              </div>
            </section>
          </div>

          {/* ==================== COLUMN 2: KỸ THUẬT, NGÔN NGỮ & PHÂN QUYỀN (4 COLS) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-2 lg:overflow-y-auto thin-scroll pr-0.5">
            {/* Section 3: Yêu cầu kỹ thuật, Ngôn ngữ & Giao diện */}
            <section className="bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-2.5 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                  <Layers className="w-4 h-4" />
                  {t.sec3Title}
                </h2>
                <span className="text-[10px] text-slate-400">{t.sec3Badge}</span>
              </div>

              {/* Hạ tầng & Dữ liệu */}
              <div className="mb-1.5">
                <p className="text-[11px] text-slate-300 font-medium mb-1">{t.infraLabel}</p>
                <div className="flex flex-wrap gap-1">
                  {t.infraOptions.map((item, idx) => {
                    const active = infraIdx.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleIndex(infraIdx, setInfraIdx, idx)}
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
              <div className="mb-1.5">
                <p className="text-[11px] text-slate-300 font-medium mb-1">{t.scaleLabel}</p>
                <div className="flex flex-wrap gap-1">
                  {t.scaleOptions.map((item, idx) => {
                    const active = scaleIdx.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleIndex(scaleIdx, setScaleIdx, idx)}
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

              {/* NGÔN NGỮ LỰA CHỌN CHO WEB APP (VIỆT, ANH, HOA, NHẬT, HÀN) */}
              <div className="mb-1.5 p-2 rounded-lg bg-[#07111E]/90 border border-[#DFC89A]/40">
                <p className="text-[11px] text-[#DFC89A] font-bold mb-1 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  {t.appLangLabel}
                </p>
                <div className="flex flex-wrap gap-1">
                  {appLangOptions.map((label, idx) => {
                    const active = selectedAppLangsIdx.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          toggleIndex(selectedAppLangsIdx, setSelectedAppLangsIdx, idx)
                        }
                        className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                          active
                            ? 'bg-[#DFC89A] text-[#07111E] border-[#DFC89A] font-extrabold shadow-sm'
                            : 'bg-[#0C1B2E] border-slate-700 text-slate-300 hover:border-[#DFC89A]/60'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bảo mật & Phong cách thiết kế */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
                <div>
                  <p className="text-[11px] text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#DFC89A]" />
                    {t.securityLabel}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {t.securityOptions.map((item, idx) => {
                      const active = securityIdx.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleIndex(securityIdx, setSecurityIdx, idx)}
                          className={`text-[10px] px-1.5 py-0.5 rounded border transition ${
                            active
                              ? 'bg-purple-500/20 border-purple-400/70 text-purple-200 font-semibold'
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
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1 font-medium">
                    {t.styleLabel}
                  </label>
                  <select
                    value={styleIdx}
                    onChange={(e) => setStyleIdx(Number(e.target.value))}
                    className="w-full bg-[#07111E] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-[#DFC89A] font-semibold outline-none"
                  >
                    {t.styleOptions.map((st, idx) => (
                      <option key={idx} value={idx}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section 4: Phân quyền người dùng (Roles & Permissions) */}
            <section className="flex-1 bg-[#0C1B2E]/90 border border-slate-800/90 rounded-xl p-2.5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                    <Users className="w-4 h-4" />
                    {t.sec4Title}
                  </h2>
                  <span className="text-[10px] text-slate-400">{t.sec4Badge}</span>
                </div>

                <div className="space-y-1">
                  {roleStates.map((role, idx) => {
                    const trans = t.defaultRoles[idx];
                    const displayPerm = role.customPermissions ?? trans?.permissions ?? '';
                    return (
                      <div
                        key={role.id}
                        className={`p-1.5 rounded-lg border transition ${
                          role.enabled
                            ? 'bg-[#07111E]/90 border-slate-700/90'
                            : 'bg-[#07111E]/30 border-slate-800/50 opacity-55'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white">
                            <input
                              type="checkbox"
                              checked={role.enabled}
                              onChange={(e) => {
                                const next = [...roleStates];
                                next[idx].enabled = e.target.checked;
                                setRoleStates(next);
                              }}
                              className="accent-[#DFC89A] w-3.5 h-3.5 rounded"
                            />
                            <span>{trans?.name}</span>
                          </label>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">{t.roleQtyLabel}</span>
                            <input
                              type="text"
                              value={role.count}
                              onChange={(e) => {
                                const next = [...roleStates];
                                next[idx].count = e.target.value;
                                setRoleStates(next);
                              }}
                              className="w-20 bg-[#0C1B2E] border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-[#DFC89A] text-center outline-none"
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
                          className="w-full bg-transparent border-b border-slate-800 focus:border-[#DFC89A] text-[11px] text-slate-300 outline-none py-0.5"
                          placeholder={t.rolePermPlaceholder}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* ==================== COLUMN 3: GHI ÂM, CHỤP ẢNH, ĐÍNH KÈM & GỬI NGAY (4 COLS) ==================== */}
          <div className="lg:col-span-4 flex flex-col gap-2 lg:overflow-y-auto thin-scroll pr-0.5">
            {/* Section 5: Ghi âm, Chụp ảnh & Đính kèm (Zero-Typing) */}
            <section className="bg-[#0C1B2E]/90 border border-[#DFC89A]/30 rounded-xl p-2.5 shadow-lg">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-[#DFC89A] flex items-center gap-1.5 uppercase tracking-wide">
                  <Mic className="w-4 h-4" />
                  {t.sec5Title}
                </h2>
                <span className="text-[10px] bg-[#DFC89A]/15 text-[#DFC89A] px-2 py-0.5 rounded-full font-semibold">
                  {t.sec5Badge}
                </span>
              </div>

              {/* 3 Big Fast Media Buttons: Voice Record | Camera Capture | Attach File */}
              <div className="grid grid-cols-3 gap-1.5 mb-2">
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
                      {t.recordVoiceTitle}
                    </span>
                    <span className="text-[9px] text-rose-300/80">{t.recordVoiceSub}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-rose-600 text-white border border-rose-300 animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    <span className="text-[11px] font-bold">
                      {t.stopRecordingBtn} ({formatDuration(recordingSeconds)})
                    </span>
                    <span className="text-[9px]">{t.recordingSub}</span>
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
                    {t.cameraTitle}
                  </span>
                  <span className="text-[9px] text-sky-300/80">{t.cameraSub}</span>
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
                    {t.attachTitle}
                  </span>
                  <span className="text-[9px] text-[#DFC89A]/80">{t.attachSub}</span>
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
                <div className="mb-2 p-1.5 rounded-lg bg-[#07111E] border border-rose-400/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Volume2 className="w-4 h-4 text-rose-400 shrink-0" />
                    <audio src={audioUrl} controls className="h-7 w-full max-w-[190px]" />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={downloadVoiceRecording}
                      className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[#DFC89A] flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> {t.downloadAudioBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioUrl(null);
                        setAudioBlob(null);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400"
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
                      <ImageIcon className="w-3 h-3" /> {t.capturedImagesLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => photoUploadRef.current?.click()}
                      className="text-[10px] text-[#DFC89A] underline"
                    >
                      {t.addMorePhotoBtn}
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {capturedImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative group h-11 rounded-lg overflow-hidden border border-slate-700 bg-slate-900"
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
                          className="absolute top-0.5 right-0.5 bg-slate-950/80 text-rose-400 rounded-full p-0.5"
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
                <div className="mb-1.5 space-y-1">
                  {attachedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between text-[11px] bg-[#07111E] border border-slate-800 px-2 py-0.5 rounded"
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
              <div className="mb-1.5">
                <p className="text-[11px] text-slate-300 font-medium mb-1">{t.docTypesLabel}</p>
                <div className="flex flex-wrap gap-1">
                  {t.docTypesOptions.map((item, idx) => {
                    const active = docTypesIdx.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleIndex(docTypesIdx, setDocTypesIdx, idx)}
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
                  placeholder={t.refLinkPlaceholder}
                  className="w-full bg-[#07111E] border border-slate-700/80 focus:border-[#DFC89A] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </section>

            {/* Section 6: Hộp Gửi Yêu Cầu & Xuất File 1 Trang A4 */}
            <section className="flex-1 bg-gradient-to-br from-[#132640] via-[#0C1B2E] to-[#07111E] border border-[#DFC89A]/40 rounded-xl p-2.5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#DFC89A]">
                    {t.sec6Title}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-medium">{t.sec6Badge}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-2">{t.sec6Desc}</p>

                <div className="grid grid-cols-2 gap-2 mb-1.5">
                  {/* Send Email */}
                  <button
                    type="button"
                    onClick={() => handleOpenSendChannel('email')}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#DFC89A] to-[#C9AD76] text-[#07111E] font-extrabold text-xs shadow-lg hover:brightness-110 transition"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <div className="text-left leading-tight">
                      <div>{t.sendEmailBtn}</div>
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
                      <div>{t.sendZaloBtn}</div>
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
                    <span>{t.printA4Btn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="py-1.5 px-2 rounded-lg bg-[#07111E]/90 hover:bg-slate-800 text-[#DFC89A] border border-[#DFC89A]/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isGeneratingPdf ? t.generatingPdf : t.downloadPdfBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShareWithFiles}
                    className="py-1.5 px-2 rounded-lg bg-[#07111E]/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t.quickShareBtn}</span>
                  </button>
                </div>
              </div>

              {/* Device Compatibility Badge */}
              <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#DFC89A]" /> {t.deviceBadge}
                </span>
                <a
                  href="/Web_App_Brief_Form.docx"
                  download
                  className="text-[#DFC89A] hover:underline flex items-center gap-0.5"
                >
                  <Download className="w-3 h-3" /> {t.wordTemplateBtn}
                </a>
              </div>
            </section>
          </div>
        </main>

        {/* BOTTOM FOOTER: DUY ANH DIGITAL LAB (.vercel.app) INTRODUCTION */}
        <footer className="shrink-0 bg-[#050C16] border-t border-[#DFC89A]/25 px-3 sm:px-5 py-1.5">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-[#DFC89A] tracking-wide flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                DUY ANH DIGITAL LAB:
              </span>
              <span className="text-slate-300 text-[11px]">{t.footerDesc}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <a
                href="https://duy-anh-digital-lab.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-full bg-[#DFC89A]/15 hover:bg-[#DFC89A]/30 text-[#DFC89A] border border-[#DFC89A]/40 font-bold text-[11px] flex items-center gap-1 transition"
              >
                <span>🌐 duy-anh-digital-lab.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://ungdung.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] flex items-center gap-1 transition"
              >
                <span>🚀 ungdung.vercel.app</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="mailto:anhpob@gmail.com"
                className="text-[11px] text-slate-300 hover:text-[#DFC89A] font-medium px-1"
              >
                📧 anhpob@gmail.com
              </a>
              <a
                href="https://zalo.me/84908095693"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-300 hover:text-sky-200 font-semibold px-1"
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
                    ? 'Email: anhpob@gmail.com'
                    : 'Zalo: +84 908 095693'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSendModal({ open: false, channel: null, sendingCloud: false, cloudSent: false })
                }
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
                    Đã sao chép toàn bộ nội dung Phiếu Yêu Cầu vào bộ nhớ tạm (Clipboard)!
                  </div>
                  {sendModal.channel === 'email' && sendModal.sendingCloud && (
                    <div className="text-[11px] text-amber-300 mt-1">
                      ⏳ Đang gửi bản sao trực tuyến tới <strong>anhpob@gmail.com</strong>...
                    </div>
                  )}
                  {sendModal.channel === 'email' && sendModal.cloudSent && (
                    <div className="text-[11px] text-emerald-300 mt-1">
                      ✅ Đã gửi trực tuyến thành công tới <strong>anhpob@gmail.com</strong>!
                    </div>
                  )}
                </div>
              </div>

              {/* Step 1: Download PDF / Audio / Images if user wants to attach */}
              <div className="p-3 rounded-xl bg-[#07111E] border border-slate-800 space-y-2">
                <div className="font-bold text-[#DFC89A]">
                  1. Tải File PDF (1 Trang A4) / Ghi âm để đính kèm:
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    className="px-3 py-1.5 rounded-lg bg-[#DFC89A]/20 hover:bg-[#DFC89A]/30 text-[#DFC89A] border border-[#DFC89A]/50 font-semibold flex items-center gap-1.5"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{isGeneratingPdf ? t.generatingPdf : 'PDF (1-Page A4)'}</span>
                  </button>
                  {audioUrl && (
                    <button
                      type="button"
                      onClick={downloadVoiceRecording}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadAudioBtn} (.webm)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNativeShareWithFiles}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t.quickShareBtn}</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Open Email or Zalo */}
              <div className="p-3 rounded-xl bg-[#07111E] border border-slate-800 space-y-2">
                <div className="font-bold text-white">
                  {sendModal.channel === 'email'
                    ? '2. Mở ứng dụng Email (Đã điền sẵn người nhận anhpob@gmail.com):'
                    : '2. Mở Zalo +84 908 095693 và nhấn Dán (Ctrl+V):'}
                </div>

                {sendModal.channel === 'email' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openMailClient}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#DFC89A] to-[#C9AD76] text-[#07111E] font-extrabold flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Mở App Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={openGmailWeb}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-[#DFC89A]" />
                      <span>Mở Gmail Web</span>
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
                        showToast('✓ Copied!');
                      }}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4 text-[#DFC89A]" />
                      <span>Copy Text</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setSendModal({ open: false, channel: null, sendingCloud: false, cloudSent: false })
                }
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
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
            ? 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm overflow-y-auto py-6 px-3 flex flex-col items-center'
            : 'fixed -left-[9999px] top-0 pointer-events-none opacity-0'
        }
      >
        {showA4Preview && (
          <div className="no-print max-w-[210mm] w-full mb-3 flex flex-wrap items-center justify-between gap-2 bg-[#0C1B2E] border border-[#DFC89A]/40 px-4 py-2.5 rounded-xl shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#DFC89A]">
                {t.a4PreviewBanner}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">{t.a4PreviewSub}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintA4}
                className="px-3 py-1.5 rounded-lg bg-[#DFC89A] text-[#07111E] font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> {t.printA4Btn}
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />{' '}
                {isGeneratingPdf ? t.generatingPdf : t.downloadPdfBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowA4Preview(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> {t.a4CloseBtn}
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
                {/* Col A */}
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

                {/* Col B: Scale + Target Languages (Việt, Anh, Hoa, Nhật, Hàn) */}
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

                {/* Col C */}
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

              {/* Render up to 4 captured images compactly so A4 stays 1 page */}
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
