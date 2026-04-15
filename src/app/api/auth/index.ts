/**
 * Auth API
 *
 * 认证与用户管理相关接口
 * 基于 API.md 文档 Auth 章节
 * baseURL 已统一为 /api，URL 自带 /auth 前缀
 */

import request from '@/app/utils/request';
import type { TokenResponse, UserResponse } from './types';

/* =================== 认证 ====================== */

/** 用户登录 */
export function login(data: { username: string; password: string }) {
  return request<TokenResponse>({
    url: '/auth/login',
    method: 'POST',
    data,
  });
}

/** 刷新 access_token */
export function refreshToken(refresh_token: string) {
  return request<TokenResponse>({
    url: '/auth/refresh',
    method: 'POST',
    data: { refresh_token },
  });
}

/* =================== 用户信息 ====================== */

/** 获取当前登录用户信息 */
export function getCurrentUser() {
  return request<UserResponse>({
    url: '/auth/me',
    method: 'GET',
  });
}

/** 修改当前用户密码 */
export function changePassword(data: { old_password: string; new_password: string }) {
  return request<{ message: string }>({
    url: '/auth/change-password',
    method: 'POST',
    data,
  });
}

/* =================== 用户管理（管理员） ====================== */

/** 创建新用户 */
export function createUser(data: Partial<UserResponse> & { password: string }) {
  return request<UserResponse>({
    url: '/auth/users',
    method: 'POST',
    data,
  });
}

/** 获取所有用户列表 */
export function getUsers() {
  return request<UserResponse[]>({
    url: '/auth/users',
    method: 'GET',
  });
}

/** 编辑用户信息 */
export function updateUser(userId: number, data: Partial<UserResponse> & { password?: string }) {
  return request<UserResponse>({
    url: `/auth/users/${userId}`,
    method: 'PATCH',
    data,
  });
}

// 导出所有类型
export * from './types';
