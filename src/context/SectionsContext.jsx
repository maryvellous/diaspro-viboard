import React, { createContext, useContext, useState, useEffect } from 'react';

const SectionsContext = createContext();

export function SectionsProvider({ children }) {
  const [enabledSections, setEnabledSectionsState] = useState({
    spotify: true,
    pinterest: false,
  });

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getStoreData().then((store) => {
        if (store && store.enabledSections) {
          setEnabledSectionsState((prev) => ({
            ...prev,
            ...store.enabledSections,
          }));
        }
      });
    }
  }, []);

  const updateSection = (key, value) => {
    setEnabledSectionsState((prev) => {
      const updated = { ...prev, [key]: value };
      if (window.electronAPI) {
        window.electronAPI.setStoreData('enabledSections', updated);
      }
      return updated;
    });
  };

  return (
    <SectionsContext.Provider value={{ enabledSections, updateSection }}>
      {children}
    </SectionsContext.Provider>
  );
}

export const useSections = () => useContext(SectionsContext);
