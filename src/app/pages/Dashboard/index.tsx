import React from 'react';
import { Button, Space, Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * Dashboard 工作台页面
 */
const Dashboard: React.FC = () => {
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
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
            <RocketOutlined style={{ marginRight: 8 }} />
            工作台
          </h1>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
            欢迎使用 React Template 项目模板
          </p>
        </div>
      </div>

      {/* =================== 内容区域 ====================== */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: 4,
          paddingLeft: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            textAlign: 'center',
          }}
        >
          <RocketOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
          <Title level={3}>开始使用</Title>
          <Paragraph style={{ color: '#666', maxWidth: 480, fontSize: 16 }}>
            这是一个通用的 React 项目模板，集成了 Ant Design、Radix UI、Tailwind CSS
            等常用工具库。请根据你的业务需求修改页面内容。
          </Paragraph>
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" size="large">
              开始开发
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
