# React Template

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)](https://vitejs.dev)

通用的 React 项目模板，集成常用开发工具和规范，可快速启动新项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18.3 + TypeScript |
| 构建 | Vite 7.x (rolldown-vite) |
| UI | Ant Design 6.x + Radix UI + MUI |
| 样式 | Tailwind CSS v4 + Emotion (CSS-in-JS) |
| 路由 | React Router v7 |
| 包管理 | pnpm (必须) |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建
pnpm build:prod

# 格式化代码（提交时自动执行）
pnpm format
```

## 项目结构

```
src/app/
├── pages/                    # 功能页面
│   ├── Dashboard/            # 工作台（首页示例）
│   ├── Login/                # 登录页
│   ├── UserManagement/       # 用户管理（CRUD 示例）
│   └── _template/            # 页面模板（复制此文件夹创建新页面）
├── components/
│   ├── ui/                   # Radix UI 组件（自动生成，勿编辑）
│   ├── Layout.tsx            # 主布局组件
│   └── ErrorBoundary.tsx     # 错误边界
├── contexts/
│   └── UserContext.tsx        # 用户认证上下文
├── api/
│   └── auth/                 # 认证相关接口
├── hooks/                    # 通用 Hooks
├── utils/                    # 工具函数（请求封装、存储、环境判断等）
├── routes.tsx                # 路由配置
└── App.tsx                   # 应用入口
```

## 内置功能

- 登录/注销 + Token 自动管理
- 路由守卫（未登录自动跳转）
- Ant Design 布局（侧边栏 + 顶栏）
- HTTP 请求封装（axios，自动 token、错误处理、防重复提交）
- 用户管理 CRUD 示例
- 页面模板（`_template/`）用于快速创建新页面
- Husky + oxfmt 提交时自动格式化

## 使用方式

1. 复制本项目到新目录
2. 修改 `package.json` 中的 `name`
3. 修改 `.env` 中的 `VITE_APP_TITLE`
4. 修改 `vite.config.ts` 中的 `API_TARGET` 为你的后端地址
5. `pnpm install && pnpm dev` 启动开发

详细开发规范请参考 [CLAUDE.md](CLAUDE.md)。
