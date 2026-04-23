# CLAUDE.md

Use 'bd' for task tracking

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 运用第一性原理 思考，拒绝经验主义和路径盲从，不要假设我完全清楚目标，保持审慎，从原始需求和问题出发
> 若目标模糊请停下和我讨论，若目标清晰但路径非最优，请直接建议更短、更低成本的办法。

---

## Quick Reference (AI 必读)

当接手此项目时，**必须遵守以下核心约定**：

| 场景              | 详细说明                      |
| ----------------- | ----------------------------- |
| 创建新页面        | [查看](#1-创建新页面)         |
| 环境判断          | [查看](#2-环境判断)           |
| LocalStorage 操作 | [查看](#3-localstorage的操作) |
| Token 管理        | [查看](#4-token-管理)         |
| HTTP 请求         | [查看](#5-http-请求)          |
| UI 组件           | [查看](#6-ui-组件选择)        |
| 导入路径          | [查看](#7-导入路径规范)       |
| 代码注释          | [查看](#8-代码注释)           |
| API 接口编写      | [查看](#9-api-接口编写规范)   |
| 组件 API 接入     | [查看](#10-组件-api-接入规范) |

当识别到上述场景时，严格执行详细说明中的规范。

**当后续增加新的规范时，也必须记录在 CLAUDE.md 中，如果你不清楚该新增功能是否要成为一个新的规范，请立刻马上询问开发人员**

---

## 项目概述

**React Template** - 一个通用的 React 项目模板，集成了常用开发工具和规范，可快速启动新项目开发。

### 技术栈

- **Runtime**: React 18.3 + TypeScript
- **构建工具**: Vite (rolldown-vite wrapper)
- **UI 框架**: Ant Design 6.x (主要) + Radix UI + MUI
- **样式**: Tailwind CSS v4 + Emotion (CSS-in-JS)
- **路由**: React Router v7
- **包管理**: pnpm（必须使用）

### 快速开始

```bash
# 安装依赖（必须用 pnpm）
pnpm i

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build:prod

# 格式化代码(提交时会自动执行，一般情况下不需要手动执行)
pnpm format
```

**注意**: 项目使用 pnpm 。不要使用 npm 或 yarn。

---

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
├── contexts/                 # React Context（全局状态管理）
│   └── UserContext.tsx        # 用户认证上下文
├── api/                      # API 接口模块
│   └── auth/                 # 认证相关接口
├── hooks/                    # 通用 Hooks
│   └── usePolling.ts         # 轮询 Hook
├── utils/                    # 工具函数
│   ├── request/              # HTTP 请求封装
│   ├── localStorage/         # LocalStorage 工具
│   ├── tools.ts              # 通用工具函数
│   ├── array.ts              # 数组工具
│   ├── nev.ts                # 环境判断
│   ├── autoUpdate.ts         # 自动更新
│   └── transParams.ts        # 参数转换
├── routes.tsx                # 路由配置
└── App.tsx                   # 应用入口
```

---

## 核心约定和规范（重要）

### 1. 创建新页面

**目录结构规范：**

```
src/app/pages/YourPageName/
├── index.tsx              # 页面入口（必须）
├── components/            # 页面私有组件（可选）
│   └── SubComponent.tsx
├── hooks/                 # 页面私有 hooks（可选）
└── types.ts               # 类型定义（可选）
```

**步骤：**

1. 复制 `src/app/pages/_template/` 文件夹
2. 重命名为页面名称
3. 在 `src/app/routes.tsx` 添加懒加载路由
4. 在 `Layout.tsx` 添加菜单项

**示例：**

```tsx
// routes.tsx
const YourPage = lazy(() => import('@/app/pages/YourPageName'));

// Layout.tsx
{ key: '/your-page', icon: <Icon />, label: '页面名称' }
```

### 2. 环境判断

**必须从 `@/app/utils/nev` 导入：**

```tsx
import { isDev, isProduction, isTest } from '@/app/utils/nev';

// ✅ 正确
if (isDev) {
  console.log('开发环境');
}

// ❌ 错误 - 不要直接用
if (import.meta.env.DEV) {
}
```

**可用的导出：**

- `isDev` - 是否开发环境
- `isProduction` - 是否生产环境
- `isTest` - 是否测试环境
- `mode` - 当前环境模式字符串

### 3. LocalStorage的操作

**优先使用 `ahooks` 的 `useLocalStorageState`：**

```tsx
import { useLocalStorageState } from 'ahooks';

// ✅ 推荐 - 组件中使用
const [collapsed, setCollapsed] = useLocalStorageState<boolean>('sidebar-collapsed', {
  defaultValue: false,
});

// 状态会自动同步到 localStorage
```

**或使用 `@/app/utils/localStorage` 工具：**

```tsx
import { saveToLocal, getFromLocal, removeFromLocal } from '@/app/utils/localStorage';

// ✅ 正确 - 非 React 场景
saveToLocal('user-data', { name: 'Alice', age: 25 });
const data = getFromLocal('user-data');

// ❌ 错误 - 不要直接用
localStorage.setItem('key', JSON.stringify(value));
```

**可用方法：**

- `useLocalStorageState(key, options)` - React Hook，组件内优先使用
- `saveToLocal(key, value)` - 保存（自动 JSON 序列化）
- `getFromLocal(key)` - 获取（自动 JSON 反序列化）
- `removeFromLocal(key)` - 删除
- `clearLocal()` - 清空

### 4. Token 管理

**必须从 `@/app/utils/localStorage/token` 导入：**

```tsx
import {
  getToken,
  setToken,
  clearUserToken,
  clearAllLocalStorage,
} from '@/app/utils/localStorage/token';

// ✅ 正确
const token = getToken();
setToken('your-token-here');
clearUserToken(); // 清除 token
clearAllLocalStorage(); // 清空所有 localStorage

// ❌ 错误 - 不要直接用
localStorage.setItem('userToken', token);
```

**可用方法：**

- `getToken()` - 获取 token
- `setToken(value)` - 保存 token
- `clearUserToken()` - 清除 token
- `clearAllLocalStorage()` - 清空所有 localStorage

**常量：**

- `userTokenKey` - token 存储的键名
- `userInfoKey` - 用户信息存储的键名

### 5. HTTP 请求

**必须从 `@/app/utils/request` 导入：**

```tsx
import request from '@/app/utils/request';

// ✅ 正确
const response = await request({
  url: '/api/user/info',
  method: 'GET',
});

// 带参数的请求
const result = await request<{ data: UserInfo }>({
  url: '/api/user/update',
  method: 'POST',
  data: { name: 'Alice' },
});

// ❌ 错误 - 不要直接用 axios
import axios from 'axios';
axios.get('/api/user/info');

// ❌ 错误 - 不要直接用 fetch
fetch('/api/user/info');
```

**特性：**

- 基于 axios 封装
- 自动添加 token 到请求头
- 统一的错误处理（自动显示 message）
- 防重复提交
- 类型安全的返回值（泛型支持）
- 自动处理 401 身份验证失效

**返回格式：**

见: `src/app/utils/request/type.ts`

### 6. UI 组件选择

**优先级顺序：**

1. **Ant Design** - 大部分场景的首选
2. **Radix UI** - 复杂交互（对话框、下拉菜单等）
3. **MUI** - 特定组件需求

**注意**: `src/app/components/ui/` 中的组件是自动生成的，禁止手动编辑。

### 7. 导入路径规范

```tsx
// ✅ 使用 @ 别名
import { Button } from '@/app/components/ui/button';
import { useProject } from '@/app/contexts/ProjectContext';

// ❌ 使用通用方法或通用组件的时候，避免相对路径
import { Button } from '../../../components/ui/button';

// ✅ 使用只有当前模块才用得到的方法或组件的时候，反而要尽量使用相对路径
```

### 8. 代码注释

- 当书写一些复杂逻辑的代码时，要增加注释，说明该代码的功能和实现逻辑。
- 关于书写函数的注释，不用写那么多冗余的，就写一行说明是什么功能就行了。
  ```tsx
  /**
   * 函数功能描述
   */
  function func(params) {}
  ```
- 当代码行数比较多的时候也要适当增加以下注释，用以视觉上区分不同的功能模块。
  ```tsx
  /* ===================xxx功能===================== */
  ```

### 9. API 接口编写规范

**目录结构规范：**

```
src/app/api/
├── projects/              # Projects 相关接口
│   ├── types.ts          # 类型定义
│   └── index.ts          # API 函数
├── yourModule/            # 新增模块
│   ├── types.ts
│   └── index.ts
└── ...
```

**编写原则：**

1. **types.ts** - 只定义响应类型

   ```typescript
   // ✅ 正确 - 只定义响应类型
   export interface ProjectResponse {
     id: string;
     name: string;
     description: string;
     created_at: string;
     updated_at: string;
   }

   // ❌ 错误 - 不需要单独定义 DTO
   export interface CreateProjectDto {
     name: string;
     description?: string;
   }
   ```

2. **index.ts** - 使用 `Partial<T>` 作为请求参数

   ```typescript
   // ✅ 正确 - 使用 Partial<T>
   export function createProject(data: Partial<ProjectResponse>) {
     return request<ProjectResponse>({
       url: '/projects',
       method: 'POST',
       data,
     });
   }

   export function updateProject(projectId: string, data: Partial<ProjectResponse>) {
     return request<ProjectResponse>({
       url: `/projects/${projectId}`,
       method: 'PATCH',
       data,
     });
   }
   ```

3. **URL 规范** - 不需要 `/api` 前缀

   ```typescript
   // ✅ 正确 - axios baseURL 已配置为 '/api'
   url: '/projects';

   // ❌ 错误 - 不要重复添加
   url: '/api/projects';
   ```

4. **request 工具** - 已自动处理数据提取
   ```typescript
   // request 函数已经返回 res.data，不需要手动访问
   const response = await getProjects();
   // response 直接是 ProjectResponse[]，不需要 response.data
   ```

**完整示例：**

参考 `src/app/api/projects/` 的实现。

### 10. 组件 API 接入规范

本规范定义了在 React 组件中调用 API 时的标准模式，确保代码一致性和用户体验。

#### 10.1 状态管理

```tsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState<unknown[]>([]);
```

#### 10.2 查询操作（GET）

```tsx
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await getList();
    setData(response);
  } finally {
    setLoading(false);
  }
};

useEffect(
  () => {
    fetchData();
  },
  [
    /* 依赖项 */
  ],
);
```

#### 10.3 新增操作（POST）

```tsx
const handleAdd = async () => {
  setLoading(true);
  try {
    await create(/* 数据 */);
    await fetchData();
    message.success('成功信息');
  } finally {
    setLoading(false);
  }
};
```

#### 10.4 修改操作（PATCH）

```tsx
const handleSave = async (key: string) => {
  setLoading(true);
  try {
    await update(/* 数据 */);
    message.success('成功信息');
    await fetchData();
  } finally {
    setLoading(false);
  }
};
```

#### 10.5 删除操作（DELETE）

```tsx
const handleDelete = async (key: string) => {
  setLoading(true);
  try {
    await deleteItem(/* 数据 */);
    await fetchData();
    message.success('成功信息');
  } finally {
    setLoading(false);
  }
};
```

#### **核心原则：**

1. **loading 统一管理**：所有 API 调用前后都要正确设置 loading 状态
2. **try-finally 模式**：确保 loading 一定被重置，即使出错也不会卡住界面
3. **不使用 catch**：request 工具已自动处理错误并显示 message，组件层不需要重复处理
4. **数据统一刷新**：修改/删除操作成功后，统一调用 `fetchData()` 重新获取列表，避免数据不一致
5. **禁止手动数据操作**：不要在组件中手动 push、filter 数据，保证数据源单一

---

## Context状态管理优化手段

参考：https://juejin.cn/post/7602073088429277199#heading-20

## 关于计划（Plan）

**与项目相关的计划md文档都要写到plan文件夹中**

## 提交代码

不要在commit信息里写claudeCode水印！！！
不要在commit信息里写claudeCode水印！！！
不要在commit信息里写claudeCode水印！！！

## Code Quality

- **禁止补丁叠补丁式的修改** — 如果发现某处代码已经是 workaround 堆叠的状态，必须先重构到干净的状态再继续开发，不要在烂代码上继续打补丁
- **禁止在生产代码中使用 `any`** — 必须使用具体类型；第三方库类型缺失时可用 type assertion 并加注释说明原因
