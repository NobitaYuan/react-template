// 在应用入口文件中使用: 如 main.js, app.jsx
import { Modal } from 'antd';
import { createVersionPolling } from 'version-polling';

export function autoUpadte() {
  try {
    createVersionPolling({
      pollingInterval: 60 * 1000, // 单位为毫秒
      silent: import.meta.env.MODE === 'development', // 开发环境下不检测
      onUpdate: (self) => {
        // 当检测到有新版本时，执行的回调函数，可以在这里提示用户刷新页面
        // const result = confirm('页面有更新，点击确定刷新页面！')
        // if (result) {
        //   self.onRefresh()
        // } else {
        //   self.onCancel()
        // }
        // 强制更新可以用alert

        // alert('有新版本，请刷新页面');

        Modal.confirm({
          title: '系统提示！',
          content: `系统有更新，刷新页面以获取最新版本。使用旧版本可能会影响您的使用体验哦~`,
          okText: '刷新',
          cancelText: '稍后我自己刷新',
          onOk: () => {
            self.onRefresh();
          },
          onCancel: () => {
            self.onCancel();
          },
        });
      },
    });
  } catch (error) {
    console.error('autoUpadte error:', error);
  }
}
