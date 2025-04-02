import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    feedback: "Feedback and help",
    loginTitle: "Log in to TikTok",
    loginSubtitle:
      "Manage your account, check notifications, comment on videos, and more.",
    useQR: "Use QR code",
    useCredentials: "Use phone / email / username",
    continueWith: "Continue with",
    termsText: "By continuing, you agree to TikTok's",
    termsLink: "Terms of Service",
    andText: "and confirm that you have read TikTok's",
    privacyLink: "Privacy Policy",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    // Sound Library translations
    soundLibraryTitle: "Unlimited sounds library",
    soundLibraryDescription: "Use these sounds to prevent your 1 Minute+ videos from being muted. Unlimited sounds have no limit on usage duration.",
    howToUse: "How to use?",
    playlists: "Playlists",
    library: "Library",
    theme: "Theme",
    style: "Style",
    duration: "Duration",
    sortByHot: "Sort by Hot",
    searchPlaceholder: "Press enter to search",
    soundColumn: "Sound",
    themeColumn: "Theme",
    styleColumn: "Style",
    durationColumn: "Duration",
    languageColumn: "Language",
    actionColumn: "Action",
    trending: "Trending",
    popMusic: "Pop Music",
    vlog: "Vlog",
    lightMusic: "Light Music",
  },
  es: {
    feedback: "Comentarios y ayuda",
    loginTitle: "Iniciar sesión en TikTok",
    loginSubtitle:
      "Gestiona tu cuenta, consulta las notificaciones, comenta videos y más.",
    useQR: "Usar código QR",
    useCredentials: "Usar teléfono / correo / usuario",
    continueWith: "Continuar con",
    termsText: "Al continuar, aceptas los",
    termsLink: "Términos de Servicio",
    andText: "de TikTok y confirmas que has leído la",
    privacyLink: "Política de Privacidad",
    noAccount: "¿No tienes una cuenta?",
    signUp: "Regístrate",
    // Sound Library translations
    soundLibraryTitle: "Biblioteca de sonidos ilimitada",
    soundLibraryDescription: "Usa estos sonidos para evitar que tus videos de más de 1 minuto sean silenciados. Los sonidos ilimitados no tienen límite de duración de uso.",
    howToUse: "¿Cómo usar?",
    playlists: "Listas de reproducción",
    library: "Biblioteca",
    theme: "Tema",
    style: "Estilo",
    duration: "Duración",
    sortByHot: "Ordenar por Populares",
    searchPlaceholder: "Presiona enter para buscar",
    soundColumn: "Sonido",
    themeColumn: "Tema",
    styleColumn: "Estilo",
    durationColumn: "Duración",
    languageColumn: "Idioma",
    actionColumn: "Acción",
    trending: "Tendencias",
    popMusic: "Música Pop",
    vlog: "Vlog",
    lightMusic: "Música Suave",
  },
  hi: {
    feedback: "फीडबैक और सहायता",
    loginTitle: "टिकटॉक में लॉग इन करें",
    loginSubtitle:
      "अपना अकाउंट मैनेज करें, नोटिफिकेशन चेक करें, वीडियो पर कमेंट करें, और बहुत कुछ।",
    useQR: "QR कोड का उपयोग करें",
    useCredentials: "फोन / ईमेल / यूजरनेम का उपयोग करें",
    continueWith: "के साथ जारी रखें",
    termsText: "जारी रखकर, आप टिकटॉक की",
    termsLink: "सेवा की शर्तों",
    andText: "से सहमत हैं और पुष्टि करते हैं कि आपने टिकटॉक की",
    privacyLink: "गोपनीयता नीति",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप करें",
    // Sound Library translations
    soundLibraryTitle: "असीमित साउंड लाइब्रेरी",
    soundLibraryDescription: "अपने 1 मिनट+ वीडियो को म्यूट होने से बचाने के लिए इन साउंड का उपयोग करें। असीमित साउंड का उपयोग समय सीमा नहीं है।",
    howToUse: "कैसे उपयोग करें?",
    playlists: "प्लेलिस्ट",
    library: "लाइब्रेरी",
    theme: "थीम",
    style: "स्टाइल",
    duration: "अवधि",
    sortByHot: "लोकप्रियता के अनुसार क्रमबद्ध करें",
    searchPlaceholder: "खोजने के लिए एंटर दबाएं",
    soundColumn: "साउंड",
    themeColumn: "थीम",
    styleColumn: "स्टाइल",
    durationColumn: "अवधि",
    languageColumn: "भाषा",
    actionColumn: "कार्रवाई",
    trending: "ट्रेंडिंग",
    popMusic: "पॉप संगीत",
    vlog: "वीलॉग",
    lightMusic: "हल्का संगीत",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const value = {
    language,
    setLanguage,
    t: (key) => translations[language][key],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}