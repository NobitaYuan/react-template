// 睡眠
export const sleep = (n: number = 0.5) => {
  return new Promise((resolve) => {
    setTimeout(resolve, n * 1000);
  });
};

/**
 * 根据value获取对应的label文本
 */
export const getOptionsLabel = <T extends Record<string, any>>(
  val: any,
  options: T[],
  keys?: { label?: keyof T; value?: keyof T },
) => {
  const { label = 'label', value = 'value' } = keys || {};
  const result = options.find((item) => {
    return item[value] === val;
  });
  if (!result) return val;
  return result[label];
};

/**
 * 创建事件监听器的控制函数
 */
export const getDocumentEventControl = <K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
): [() => void, () => void] => {
  const addEvent = () => {
    document.addEventListener(type, listener, options);
  };
  const removeEvent = () => {
    document.removeEventListener(type, listener, options);
  };
  return [addEvent, removeEvent];
};

/**
 * 创建window的事件监听器的控制函数
 */
export const getWindowEventControl = <K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
): [() => void, () => void] => {
  const addEvent = () => {
    window.addEventListener(type, listener, options);
  };
  const removeEvent = () => {
    window.removeEventListener(type, listener, options);
  };
  return [addEvent, removeEvent];
};

/**
 * 保留n位小数
 */
export const numToFixed = (num: number, fixedNum: number = 2) => {
  if (typeof num !== 'number') return num;
  return Number(num.toFixed(fixedNum));
};
