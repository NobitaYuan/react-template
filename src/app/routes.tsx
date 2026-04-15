import React, { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, Outlet, redirect, useLocation, useNavigate } from 'react-router';
import Layout from '@/app/components/Layout';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { useUser } from '@/app/contexts/UserContext';
import { Spin } from 'antd';
import { getToken } from '@/app/utils/localStorage/token';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/app/pages/Dashboard').then((m) => ({ default: m.default })));
const UserManagement = lazy(() =>
  import('@/app/pages/UserManagement').then((m) => ({ default: m.default })),
);
const Login = lazy(() => import('@/app/pages/Login').then((m) => ({ default: m.default })));

// 加载中组件
const PageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: 16,
      color: '#1890ff',
    }}
  >
    <Spin size="large" description="加载中..." />
  </div>
);

// 包装组件，添加 Suspense
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => {
  return () => (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

// ============ 路由守卫相关 ============

/**
 * Auth 检查 loader - 所有受保护的路由都会经过这里
 */
const protectedLoader = () => {
  const token = getToken();
  if (!token) {
    return redirect('/login');
  }
  return null;
};

/**
 * 受保护的布局
 */
const ProtectedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useUser();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, token, navigate]);

  return (
    <ErrorBoundary>
      <Layout />
    </ErrorBoundary>
  );
};

// ============ 路由配置 ============
export const router = createBrowserRouter([
  // --- 公开路由（不需要登录） ---
  {
    Component: () => <Outlet />,
    children: [
      {
        path: '/login',
        Component: withSuspense(Login),
      },
    ],
  },

  // --- 受保护的路由（需要登录） ---
  {
    loader: protectedLoader,
    Component: ProtectedLayout,
    children: [
      {
        index: true,
        Component: withSuspense(Dashboard),
      },
      {
        path: 'user-management',
        Component: withSuspense(UserManagement),
      },
      {
        path: '*',
        Component: withSuspense(Dashboard),
      },
    ],
  },
]);
