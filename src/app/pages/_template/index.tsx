/**
 * [页面名称]
 *
 * 功能描述：
 * - 主要功能1
 * - 主要功能2
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// ========================================
// 类型定义
// ========================================

interface Props {
  // 如果有 props，在这里定义
}

// ========================================
// 主组件
// ========================================

const PageName: React.FC<Props> = () => {
  // ========================================
  // 状态管理
  // ========================================

  const [state, setState] = useState<string>('');

  // ========================================
  // 副作用
  // ========================================

  useEffect(() => {
    // 初始化逻辑
  }, []);

  // ========================================
  // 事件处理
  // ========================================

  const handleAction = () => {
    // 处理逻辑
  };

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
      {/* ========================================
          页面标题和操作区（固定不滚动）
          ======================================== */}
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
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>📌 页面标题</h1>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>页面描述信息，说明当前页面的用途</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleAction}>
          操作按钮
        </Button>
      </div>

      {/* ========================================
          固定内容区域（可选，不参与滚动）
          例如：统计卡片、筛选器等
          ======================================== */}
      <div style={{ flexShrink: 0, marginBottom: 16 }}>{/* 固定内容 */}</div>

      {/* ========================================
          滚动内容区域
          这里放置需要滚动的内容
          ======================================== */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: 4,
          paddingLeft: 8,
        }}
      >
        {/* 滚动内容 */}
        <Card>{/* 页面主要内容 */}</Card>
      </div>

      {/* ========================================
          弹窗/抽屉等
          ======================================== */}
    </div>
  );
};

export default PageName;
