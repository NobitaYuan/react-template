/**
 * 环境判断工具
 */

/**
 * 是否为开发环境
 */
export const isDev = import.meta.env.DEV;

/**
 * 是否为生产环境
 */
export const isProduction = import.meta.env.PROD;

/**
 * 当前环境模式
 */
export const mode = import.meta.env.MODE;

/**
 * 是否为测试环境
 */
export const isTest = mode === 'test';
