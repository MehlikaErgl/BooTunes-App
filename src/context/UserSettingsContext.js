import { createContext, useContext, useState, useEffect } from "react";

export const UserSettingsContext = createContext();

export const UserSettingsProvider = ({ children }) => {
  // localStorage'dan yükleme
  const defaultSettings = {
    fontSize: "16px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.6",
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("userSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // localStorage güncellemesi
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  // ✅ Dışarıdan ayar güncelleme fonksiyonu
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => useContext(UserSettingsContext);
