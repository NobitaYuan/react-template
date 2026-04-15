/**
 * 登录页面
 *
 * 功能描述：
 * - 用户登录认证（对接后端 JWT 接口）
 * - 登录成功后保存 tokens 和用户信息，跳转首页
 */

import { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useUser } from '@/app/contexts/UserContext';
import * as authApi from '@/app/api/auth';

// ========================================
// 类型定义
// ========================================

interface LoginForm {
  username: string;
  password: string;
}

// ========================================
// 主组件
// ========================================

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, setUserInfo } = useUser();

  const [form] = Form.useForm<LoginForm>();

  // ========================================
  // 事件处理
  // ========================================

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 1. 调用后端登录接口，获取 tokens
      const tokenRes = await authApi.login(values);

      // 2. 先保存 tokens（写入 localStorage，后续请求拦截器会自动携带）
      login(tokenRes.access_token, tokenRes.refresh_token);

      // 3. 用 access_token 获取用户信息
      try {
        const userInfo = await authApi.getCurrentUser();
        setUserInfo(userInfo);
      } catch {
        // 获取用户信息失败不影响登录流程
      }

      message.success('登录成功');
      navigate('/', { replace: true });
    } catch (error: any) {
      // 显示后端返回的错误信息
      const errMsg = error?.detail || error?.msg || '用户名或密码错误';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 渲染
  // ========================================

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Typography.Title level={2} style={{ marginBottom: 8 }}>
            React Template
          </Typography.Title>
          <Typography.Text type="secondary">通用项目模板</Typography.Text>
        </div>

        <Form<LoginForm>
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined style={{ color: '#999' }} />} placeholder="用户名" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
