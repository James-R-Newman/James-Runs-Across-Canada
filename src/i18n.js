import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const saved = localStorage.getItem("lang");
const browser = (navigator.language || "en").toLowerCase().startsWith("fr") ? "fr" : "en";
const lng = saved || browser;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr }
  },
  lng: saved || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
