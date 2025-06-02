import { createContext, useContext, useState } from "react";

export const UserSettingsContext = createContext(); // <== Eksikse bu satırı ekle!

export const UserSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSize: "16px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.6",
  });

  return (
    <UserSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => useContext(UserSettingsContext);
