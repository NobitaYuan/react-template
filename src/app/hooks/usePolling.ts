import { useRef, useState, useEffect } from 'react';
import { message } from 'antd';

interface UsePollingOptions<T> {
  /**
   * 轮询检查函数，返回当前数据
   */
  fetchFn: () => Promise<T[]>;
  /**
   * 数据更新回调
   */
  onDataUpdate: (data: T[]) => void;
  /**
   * 轮询间隔（毫秒），默认 3000ms
   */
  interval?: number;
  /**
   * 最大轮询次数，默认 600 次（30分钟）
   */
  maxPolls?: number;
  /**
   * Loading 消息文本
   */
  loadingMessage?: string;
  /**
   * 成功消息模板，接收 { count: number }
   */
  successMessage?: string | ((count: number) => string);
  /**
   * 超时消息
   */
  timeoutMessage?: string;
  /**
   * 生成接口调用函数
   */
  generateFn: () => Promise<void>;
}

/**
 * 轮询 Hook - 用于异步生成任务的结果轮询
 *
 * @example
 * ```tsx
 * const { startPolling, isPolling } = usePolling({
 *   fetchFn: async () => await getRecommendations(projectId),
 *   onDataUpdate: (data) => setRoutes(data),
 *   generateFn: async () => await generateRecommendations(projectId),
 *   loadingMessage: '正在生成推荐方案...',
 *   successMessage: (count) => `成功生成 ${count} 个方案！`,
 * });
 *
 * <Button onClick={startPolling} loading={isPolling}>
 *   生成推荐
 * </Button>
 * ```
 */
export function usePolling<T>(options: UsePollingOptions<T>) {
  const {
    fetchFn,
    onDataUpdate,
    interval = 3000,
    maxPolls = 20 * 30, // 30分钟
    loadingMessage = '正在处理，请稍候...',
    successMessage,
    timeoutMessage = '处理超时，请稍后手动刷新查看',
    generateFn,
  } = options;

  const pollingIntervalRef = useRef<number | null>(null);
  const loadingInstanceRef = useRef<(() => void) | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [originalLength, setOriginalLength] = useState(0);

  /**
   * 关闭 loading 消息
   */
  const closeLoading = () => {
    if (loadingInstanceRef.current) {
      loadingInstanceRef.current();
      loadingInstanceRef.current = null;
    }
  };

  // 组件卸载时清除轮询和 loading
  useEffect(() => {
    return () => {
      // 清除轮询定时器
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      // 关闭 loading 消息
      closeLoading();
    };
  }, []);

  /**
   * 开始轮询
   */
  const startPolling = async () => {
    try {
      setIsPolling(true);

      // 先获取当前数据作为基准
      const initialData = await fetchFn();
      setOriginalLength(initialData.length);

      // 保存 loading 实例
      loadingInstanceRef.current = message.loading(loadingMessage, 0);

      // 调用生成接口
      await generateFn();

      // 开始轮询
      let pollCount = 0;

      pollingIntervalRef.current = window.setInterval(async () => {
        pollCount++;

        try {
          const response = await fetchFn();

          // 更新数据
          onDataUpdate(response);

          // 检查是否有新数据
          if (response.length > originalLength) {
            // 清除轮询
            stopPolling();

            setIsPolling(false);
            closeLoading();

            const newCount = response.length - originalLength;
            if (successMessage) {
              const msg =
                typeof successMessage === 'function' ? successMessage(newCount) : successMessage;
              message.success(msg);
            } else {
              message.success(`成功生成 ${newCount} 条数据！`);
            }
          } else if (pollCount >= maxPolls) {
            // 超过最大轮询次数
            stopPolling();
            setIsPolling(false);
            closeLoading();
            message.warning(timeoutMessage);
          }
        } catch (error) {
          console.error('轮询失败：', error);
        }
      }, interval);
    } catch (error) {
      console.error('生成失败：', error);
      setIsPolling(false);
      closeLoading();
      message.error('生成失败，请重试');
    }
  };

  /**
   * 停止轮询
   */
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
}
