import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || "ar");

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);

    // كلاس على الـ body للتحكم بالخطوط
    document.body.classList.remove("font-ar", "font-en");
    document.body.classList.add(lang === "ar" ? "font-ar" : "font-en");
  }, [lang]);

  const changeLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  const toggleLanguage = () => {
    changeLanguage(lang === "ar" ? "en" : "ar");
  };

  return (
    <LanguageContext.Provider
      value={{ lang, changeLanguage, toggleLanguage, isRTL: lang === "ar" }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
