import { useLaunchParams, miniApp, useSignal, initData } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { 
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  HashRouter,
  RouterProvider,
  useNavigate
} from 'react-router-dom';

import { router } from '@/navigation/routes.tsx';
// import { routes } from '@/navigation/routes.tsx';
import { useEffect } from 'react';


function AppContent() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export function App() {
  const lp       = useLaunchParams();
  const isDark   = useSignal(miniApp.isDark);

  useEffect(() => {
    const html = document.getElementsByTagName('html')[0]
    if (html) {
      html.classList.remove('dark')
      isDark && html.classList.add('dark')
    }
  }, [isDark])


  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <AppContent />
    </AppRoot>
  );
}
