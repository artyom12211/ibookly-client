// historyContext.tsx
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useLocation, Location } from 'react-router-dom';

interface HistoryContextType {
  historyStack: string[];
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
  children: ReactNode;
}

export function HistoryProvider({ children }: HistoryProviderProps) {
  const location: Location = useLocation();
  const [historyStack, setHistoryStack] = useState<string[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      const newIndex: number = window.history.state?.idx ?? 0;
      setHistoryStack((prev: string[]) => prev.slice(0, newIndex + 1));
    };

    window.addEventListener('popstate', handlePopState);

    setHistoryStack((prev: string[]) => {
      const currentPath = location.pathname;
      const lastPath = prev[prev.length - 1];

      // Игнорируем Telegram-путь
      // if (currentPath.startsWith('/tgWebAppData')) {
      //   return prev; // Не добавляем в стек
      // }

      if (lastPath !== currentPath) {
        return [...prev, currentPath];
      }
      return prev;
    });

    return () => window.removeEventListener('popstate', handlePopState);
  }, [location]);

  const contextValue: HistoryContextType = { historyStack };

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryStack(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryStack must be used within a HistoryProvider');
  }
  return context;
}