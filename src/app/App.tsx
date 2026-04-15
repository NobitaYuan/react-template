import React from 'react';
import { RouterProvider } from 'react-router';
import { ConfigProvider, App as AntApp } from 'antd';
import { router } from './routes';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </AntApp>
    </ConfigProvider>
  );
}
