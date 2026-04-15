/**
 * Auth API Types
 *
 * 认证与用户管理相关接口的响应类型
 * 基于 API.md 文档 Auth 章节
 */

/** 登录/刷新 token 响应 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/** 用户信息响应 */
export interface UserResponse {
  id: number;
  username: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
