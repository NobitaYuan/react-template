/**
 * 用户管理页面（管理员）
 *
 * 功能描述：
 * - 用户列表展示（Table）
 * - 创建/编辑/禁用用户
 * - 重置用户密码
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import * as authApi from '@/app/api/auth';
import type { UserResponse } from '@/app/api/auth';

// ========================================
// 类型定义
// ========================================

interface CreateUserForm {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

interface EditUserForm {
  username: string;
  role: 'admin' | 'user';
  is_active: boolean;
  password?: string;
}

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

// ========================================
// 主组件
// ========================================

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);

  // 弹窗状态
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetPwdModalOpen, setResetPwdModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  const [createForm] = Form.useForm<CreateUserForm>();
  const [editForm] = Form.useForm<EditUserForm>();
  const [resetPwdForm] = Form.useForm<ResetPasswordForm>();

  // ========================================
  // 数据加载
  // ========================================

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authApi.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================================
  // 创建用户
  // ========================================

  const handleCreate = async (values: CreateUserForm) => {
    setLoading(true);
    try {
      await authApi.createUser(values);
      message.success('创建用户成功');
      setCreateModalOpen(false);
      createForm.resetFields();
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 编辑用户
  // ========================================

  const openEditModal = (user: UserResponse) => {
    setCurrentUser(user);
    editForm.setFieldsValue({
      username: user.username,
      role: user.role,
      is_active: user.is_active,
    });
    setEditModalOpen(true);
  };

  const handleEdit = async (values: EditUserForm) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await authApi.updateUser(currentUser.id, values);
      message.success('编辑用户成功');
      setEditModalOpen(false);
      editForm.resetFields();
      setCurrentUser(null);
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 切换启用/禁用
  // ========================================

  const handleToggleActive = async (user: UserResponse) => {
    setLoading(true);
    try {
      await authApi.updateUser(user.id, { is_active: !user.is_active });
      message.success(user.is_active ? '已禁用用户' : '已启用用户');
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 重置密码
  // ========================================

  const openResetPwdModal = (user: UserResponse) => {
    setCurrentUser(user);
    resetPwdForm.resetFields();
    setResetPwdModalOpen(true);
  };

  const handleResetPassword = async (values: ResetPasswordForm) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await authApi.updateUser(currentUser.id, { password: values.password });
      message.success('重置密码成功');
      setResetPwdModalOpen(false);
      resetPwdForm.resetFields();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 表格列定义
  // ========================================

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>{isActive ? '启用' : '禁用'}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: UserResponse) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => openResetPwdModal(record)}
          >
            重置密码
          </Button>
          <Popconfirm
            title={record.is_active ? '确定禁用该用户？' : '确定启用该用户？'}
            onConfirm={() => handleToggleActive(record)}
          >
            <Button
              type="link"
              size="small"
              danger={record.is_active}
              icon={record.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
            >
              {record.is_active ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ========================================
  // 渲染
  // ========================================

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* =================== 页面标题和操作区 ====================== */}
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>用户管理</h1>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>管理系统用户账号与权限</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          创建用户
        </Button>
      </div>

      {/* =================== 用户列表 ====================== */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingLeft: 8 }}>
        <Card>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>

      {/* =================== 创建用户弹窗 ====================== */}
      <Modal
        title="创建用户"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue="user" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '普通用户', value: 'user' },
                { label: '管理员', value: 'admin' },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setCreateModalOpen(false);
                  createForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* =================== 编辑用户弹窗 ====================== */}
      <Modal
        title="编辑用户"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          editForm.resetFields();
          setCurrentUser(null);
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select
              options={[
                { label: '普通用户', value: 'user' },
                { label: '管理员', value: 'admin' },
              ]}
            />
          </Form.Item>
          <Form.Item name="is_active" label="状态" valuePropName="checked">
            <Select
              options={[
                { label: '启用', value: true },
                { label: '禁用', value: false },
              ]}
            />
          </Form.Item>
          <Form.Item name="password" label="新密码（留空则不修改）">
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setEditModalOpen(false);
                  editForm.resetFields();
                  setCurrentUser(null);
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* =================== 重置密码弹窗 ====================== */}
      <Modal
        title={`重置密码 - ${currentUser?.username ?? ''}`}
        open={resetPwdModalOpen}
        onCancel={() => {
          setResetPwdModalOpen(false);
          resetPwdForm.resetFields();
          setCurrentUser(null);
        }}
        footer={null}
      >
        <Form form={resetPwdForm} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            name="password"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
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
                  setResetPwdModalOpen(false);
                  resetPwdForm.resetFields();
                  setCurrentUser(null);
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
