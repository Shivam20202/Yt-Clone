import { createContext, useContext, useState, useEffect } from 'react';

//Sidebar opening and closing context
const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const getInitial = () => (window.innerWidth >= 1024 ? 'expanded' : 'closed');
  const [mode, setMode] = useState(getInitial);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1024) {
        setMode((prev) => (prev === 'mobile-open' ? 'mobile-open' : 'closed'));
      } else {
        setMode((prev) => (prev === 'mobile-open' ? 'expanded' : prev === 'closed' ? 'mini' : prev));
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggle = () => {
    if (window.innerWidth < 1024) {
      setMode((prev) => (prev === 'mobile-open' ? 'closed' : 'mobile-open'));
    } else {
      setMode((prev) => (prev === 'expanded' ? 'mini' : 'expanded'));
    }
  };

  const close = () => setMode((prev) => (window.innerWidth < 1024 ? 'closed' : prev));

  return (
    <SidebarContext.Provider value={{ mode, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
