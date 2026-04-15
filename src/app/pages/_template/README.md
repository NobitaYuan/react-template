# 页面模板使用说明

## 快速创建新页面

1. **复制模板文件夹**

   ```bash
   cp -r src/app/pages/_template src/app/pages/YourPageName
   ```

2. **重命名和编辑**
   - 将 `index.tsx` 中的 `PageName` 改为实际名称
   - 删除不需要的模板组件
   - 根据需求添加私有组件到 `components/` 目录

3. **注册路由**
   在 `src/app/routes.tsx` 添加：

   ```tsx
   const YourPageName = lazy(() => import('@/app/pages/YourPageName'));
   ```

4. **添加菜单项**
   在 `src/app/components/Layout.tsx` 的菜单配置中添加：
   ```tsx
   {
     key: '/your-route',
     icon: <YourIcon />,
     label: '页面名称',
   }
   ```

---

## 页面结构模式

模板采用 **Flex 布局 + 独立滚动** 的结构模式：

```
┌─────────────────────────────────────────┐
│  📌 页面标题区                [操作按钮] │  ← 固定不滚动
│  页面描述信息                          │
├─────────────────────────────────────────┤
│  固定内容区（可选）                    │  ← 固定不滚动
│  - 统计卡片                            │
│  - 筛选器                              │
├─────────────────────────────────────────┤
│                                         │
│  滚动内容区                            │  ← 可滚动
│  - 列表内容                            │
│  - 表格数据                            │
│  - 其他可滚动内容                      │
│                                         │
└─────────────────────────────────────────┘
```

### 关键样式说明

| 区域       | 样式关键字                                               | 作用                 |
| ---------- | -------------------------------------------------------- | -------------------- |
| 外层容器   | `display: flex; flexDirection: column; overflow: hidden` | 建立 flex 布局       |
| 标题区     | `flexShrink: 0`                                          | 固定不滚动           |
| 固定内容区 | `flexShrink: 0`                                          | 固定不滚动           |
| 滚动区     | `flex: 1; overflowY: auto`                               | 占据剩余空间并可滚动 |

---

## 参考示例

- **Dashboard 页面** - 完整的页面结构示例
- **组件模板** - `components/ExampleComponent.tsx`
