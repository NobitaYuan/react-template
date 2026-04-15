import React, { useMemo, memo, useCallback, useState } from 'react';
import { useLocalStorageState } from 'ahooks';
import {
  Layout as AntLayout,
  Menu,
  Space,
  Avatar,
  Dropdown,
  Modal,
  Form,
  Input,
  Button,
  message,
  type MenuProps,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useUser } from '@/app/contexts/UserContext';
import * as authApi from '@/app/api/auth';

const { Header, Sider, Content } = AntLayout;

// Memo化的导航菜单组件
const MemoizedMenu = memo<{
  collapsed: boolean;
  selectedKeys: string[];
  onClick: (info: { key: string }) => void;
}>(({ collapsed, selectedKeys, onClick }) => (
  <Menu
    mode="inline"
    selectedKeys={selectedKeys}
    onClick={onClick}
    items={[
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: '工作台',
      },
    ]}
    style={{
      background: '#001529',
      borderRight: 'none',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
    }}
    theme="dark"
  />
));

MemoizedMenu.displayName = 'MemoizedMenu';

const Layout: React.FC = () => {
  const appTitle = import.meta.env.VITE_APP_TITLE;

  const CollapsedWidth = 60 as const;

  const [collapsed, setCollapsed] = useLocalStorageState<boolean>('sidebar-collapsed', {
    defaultValue: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userInfo } = useUser();

  /* =================== 修改密码弹窗 ====================== */
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [changePwdLoading, setChangePwdLoading] = useState(false);
  const [changePwdForm] = Form.useForm();

  const handleChangePassword = async (values: { old_password: string; new_password: string }) => {
    setChangePwdLoading(true);
    try {
      await authApi.changePassword(values);
      message.success('密码修改成功');
      setChangePwdOpen(false);
      changePwdForm.resetFields();
    } finally {
      setChangePwdLoading(false);
    }
  };

  /* =================== 下拉菜单项 ====================== */
  const isAdmin = userInfo?.role === 'admin';

  const dropdownItems = useMemo<MenuProps['items']>(() => {
    const items: NonNullable<MenuProps['items']> = [
      {
        key: 'change-password',
        icon: <KeyOutlined />,
        label: '修改密码',
        onClick: () => setChangePwdOpen(true),
      },
    ];
    if (isAdmin) {
      items.push({
        key: 'user-management',
        icon: <TeamOutlined />,
        label: '用户管理',
        onClick: () => navigate('/user-management'),
      });
    }
    items.push(
      { type: 'divider' as const },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: () => {
          logout();
          navigate('/login', { replace: true });
        },
      },
    );
    return items;
  }, [isAdmin, logout, navigate]);

  // 缓存选中的菜单keys
  const selectedKeys = useMemo(() => [location.pathname], [location.pathname]);

  const handleMenuClick = useCallback(
    (info: { key: string }) => {
      navigate(info.key);
    },
    [navigate],
  );

  return (
    <>
      <AntLayout style={{ minHeight: '100vh' }}>
        {/* 侧边导航栏 */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          collapsedWidth={CollapsedWidth}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div
            style={{
              height: 64,
              margin: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {collapsed ? '' : appTitle}
          </div>
          <MemoizedMenu
            collapsed={collapsed}
            selectedKeys={selectedKeys}
            onClick={handleMenuClick}
          />
        </Sider>
        <AntLayout
          style={{
            marginLeft: collapsed ? CollapsedWidth : 200,
            transition: 'margin-left 0.2s',
            height: '100vh',
          }}
        >
          {/* 顶部导航栏 */}
          <Header
            style={{
              padding: '0 24px',
              height: 48,
              lineHeight: '48px',
              background: '#ffffff',
              boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
              />
            </Dropdown>
          </Header>
          {/* 主内容区域 */}
          <Content
            style={{
              margin: '16px',
              padding: '24px',
              background: '#f0f2f5',
              minHeight: 280,
              overflowY: 'auto',
              backgroundColor: '#fff',
              borderRadius: 8,
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>

      {/* =================== 修改密码弹窗 ====================== */}
      <Modal
        title="修改密码"
        open={changePwdOpen}
        onCancel={() => {
          setChangePwdOpen(false);
          changePwdForm.resetFields();
        }}
        footer={null}
      >
        <Form form={changePwdForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="old_password"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="确认新密码"
            dependencies={['new_password']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setChangePwdOpen(false);
                  changePwdForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={changePwdLoading}>
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Layout;
