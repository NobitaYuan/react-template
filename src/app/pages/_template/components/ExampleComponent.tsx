/**
 * [组件名称]
 *
 * 功能描述：
 * - 主要功能
 * - 使用示例
 */

import React from 'react';
import { Space, Typography } from 'antd';

const { Text } = Typography;

// ========================================
// 类型定义
// ========================================

interface ExampleComponentProps {
  /**
   * 显示的文本内容
   */
  text: string;
  /**
   * 点击回调
   */
  onClick?: () => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

// ========================================
// 组件实现
// ========================================

/**
 * [组件描述 - 会在 IDE 中显示]
 *
 * @example
 * ```tsx
 * <ExampleComponent
 *   text="Hello"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */
export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  text,
  onClick,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Space onClick={handleClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <Text type={disabled ? 'secondary' : undefined}>{text}</Text>
    </Space>
  );
};
