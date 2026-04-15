import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { isDev } from '@/app/utils/nev';
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 错误边界组件
 *
 * 捕获子组件树中的 JavaScript 错误，记录错误日志，
 * 并显示备用 UI 而不是使整个应用崩溃
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 可以将错误日志上报给服务器
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // TODO: 这里可以添加错误上报逻辑
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // 刷新页面以重置应用状态
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f0f2f5',
          }}
        >
          <Result
            status="error"
            title="页面出错了"
            subTitle="抱歉，页面遇到了一些问题。我们已经记录了这个问题，请稍后再试。"
            extra={
              <Button type="primary" onClick={this.handleReset}>
                刷新页面
              </Button>
            }
          >
            {this.state.error && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#fff',
                  borderRadius: 4,
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <p style={{ fontSize: 12, color: '#666' }}>
                  <strong>错误详情：</strong>
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: '#999',
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.message}
                </p>
                {isDev && (
                  <pre
                    style={{
                      fontSize: 11,
                      color: '#666',
                      background: '#f5f5f5',
                      padding: 8,
                      borderRadius: 4,
                      overflow: 'auto',
                    }}
                  >
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
