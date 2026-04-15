/**
 * 全局用户状态管理
 *
 * 功能：
 * - 管理 access_token、refresh_token 和用户信息
 * - 封装 login / logout 方法
 * - 刷新页面时从 localStorage 恢复状态
 *
 * 注意：导航由调用方自行处理（login 后 navigate('/')，logout 后 navigate('/login')）
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  getToken,
  setToken as saveToken,
  clearUserToken,
  getRefreshToken,
  setRefreshToken as saveRefreshToken,
  clearRefreshToken,
  userInfoKey,
} from '@/app/utils/localStorage/token';
import { getFromLocal, saveToLocal } from '@/app/utils/localStorage';
import type { UserResponse } from '@/app/api/auth';

// ========================================
// 类型定义
// ========================================

/** 用户信息 - 直接复用后端 UserResponse 类型 */
export type UserInfo = UserResponse;

interface UserContextType {
  /** 当前 access_token */
  token: string | null;
  /** 当前 refresh_token */
  refreshToken: string | null;
  /** 当前用户信息 */
  userInfo: UserInfo | null;
  /** 是否已认证 */
  isAuthenticated: boolean;
  /** 登录 - 保存 tokens 和用户信息（导航由调用方处理） */
  login: (accessToken: string, refreshToken: string, userInfo?: UserInfo) => void;
  /** 登出 - 清除所有用户数据（导航由调用方处理） */
  logout: () => void;
  /** 更新用户信息 */
  setUserInfo: (info: UserInfo) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ========================================
// Provider
// ========================================

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初始化时从 localStorage 恢复状态
  const [token, setTokenState] = useState<string | null>(() => getToken() ?? null);
  const [refreshTokenState, setRefreshTokenState] = useState<string | null>(
    () => getRefreshToken() ?? null,
  );
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(
    () => (getFromLocal(userInfoKey) as UserInfo) ?? null,
  );

  const isAuthenticated = useMemo(() => !!token, [token]);

  /* =================== 登录 ====================== */
  const login = useCallback((accessToken: string, newRefreshToken: string, info?: UserInfo) => {
    saveToken(accessToken);
    saveRefreshToken(newRefreshToken);
    setTokenState(accessToken);
    setRefreshTokenState(newRefreshToken);

    if (info) {
      saveToLocal(userInfoKey, info);
      setUserInfoState(info);
    }
  }, []);

  /* =================== 登出 ====================== */
  const logout = useCallback(() => {
    clearUserToken();
    clearRefreshToken();
    localStorage.removeItem(userInfoKey);
    setTokenState(null);
    setRefreshTokenState(null);
    setUserInfoState(null);
  }, []);

  /* =================== 更新用户信息 ====================== */
  const setUserInfo = useCallback((info: UserInfo) => {
    saveToLocal(userInfoKey, info);
    setUserInfoState(info);
  }, []);

  const value = useMemo<UserContextType>(
    () => ({
      token,
      refreshToken: refreshTokenState,
      userInfo,
      isAuthenticated,
      login,
      logout,
      setUserInfo,
    }),
    [token, refreshTokenState, userInfo, isAuthenticated, login, logout, setUserInfo],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ========================================
// Hooks
// ========================================

/** 获取用户上下文 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
