import type { ComponentType, JSX } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import HomePage from '@/pages/index';
import StudioPage from '@/pages/studio/index'
import StudiosLayout from '@/layouts/StudiosLayout';
import { HistoryProvider } from "@/components/historyContext";


interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const router = createBrowserRouter([
  { 
    path: '/',
    element: <StudiosLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/studio/:id',
        element: <StudioPage />,
      },
      {
        path: '*', // Любой несовпадающий маршрут
        element: <Navigate to="/" />, // Перенаправление на главную
      },
    ],
  },
],
{
  basename: '/ibookly'
});

// export const routes: Route[] = [
//   { path: '/',           Component: HomePage },
//   { path: '/studio/:id', Component: StudioPage },
// ];
