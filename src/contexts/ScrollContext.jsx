import { createContext, useContext, useState, useCallback } from "react";

const ScrollContext = createContext(null);

export function ScrollProvider({ children }) {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const updateMouse = useCallback((x, y) => {
    setMousePos({ x, y });
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        activeSection,
        setActiveSection,
        scrollProgress,
        setScrollProgress,
        mousePos,
        updateMouse,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx)
    throw new Error("useScrollContext must be used within ScrollProvider");
  return ctx;
}
