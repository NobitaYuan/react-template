---
name: drawio-standards-zh
description: 专业 draw.io 图表格式规范 — 配色方案、XML 结构、样式属性和布局规则，用于创建精美的图表。在用户需要创建任何具有专业格式的 draw.io 图表时使用。
---

# Draw.io 规范

创建精美 draw.io 图表的专业格式规范。配色方案、XML 结构、样式属性和布局规则，让任何图表看起来都像专业顾问制作的。

---

## 配色方案

专业图表的一致配色系统：

| 颜色 | Hex（填充） | Hex（描边） | 用途 |
|-------|-----------|-------------|---------|
| **蓝色** | `#dae8fc` | `#6c8ebf` | 主要元素、标准步骤、所有者角色 |
| **绿色** | `#d5e8d4` | `#82b366` | 积极状态、开始/结束节点、团队角色、快速阶段 |
| **黄色** | `#fff2cc` | `#d6b656` | 判断、警告、工具、时间轴条 |
| **紫色** | `#e1d5e7` | `#9673a6` | AI 辅助步骤、自动化、AI 角色 |
| **红色** | `#f8cecc` | `#b85450` | 瓶颈、慢速阶段、空缺/手动角色 |
| **蓝紫色** | `#d0cee2` | `#56517e` | 共享角色（所有者 + AI） |
| **浅灰色** | `#f5f5f5` | `#666666` | 标题、数据框、注释 |

---

## 样式属性

### 形状

```
圆角矩形：   rounded=1; whiteSpace=wrap; fillColor=#dae8fc; strokeColor=#6c8ebf
菱形（判断）：rhombus; whiteSpace=wrap; fillColor=#fff2cc; strokeColor=#d6b656
椭圆（开始/结束）：ellipse; whiteSpace=wrap; fillColor=#d5e8d4; strokeColor=#82b366
数据框：      rounded=0; fillColor=#f5f5f5; strokeColor=#666666; fontSize=10
泳道标题：    swimlane; fillColor=#f5f5f5; fontStyle=1
虚线（空缺）：rounded=1; fillColor=#f8cecc; strokeColor=#b85450; dashed=1
```

### 连接线

```
标准箭头：     edgeStyle=orthogonalEdgeStyle; rounded=1
交接箭头：     edgeStyle=orthogonalEdgeStyle; dashed=1
肘形连接器：   edgeStyle=elbowEdgeStyle; rounded=1
```

### 文本

```
粗体文本：     fontStyle=1
斜体文本：     fontStyle=2
粗体 + 斜体：  fontStyle=3
小号文本：     fontSize=10
大标题：       fontSize=14; fontStyle=1
```

---

## 布局规则

- **一致的流向** — 选择自上而下或从左到右，保持一致
- **元素间最小间距 40px**
- **标签在形状内部** — 边的标签在箭头上
- **菱形判断** — 用带标签的箭头清晰分支是/否
- **出口箭头从步骤右侧引出**，入口箭头从左侧进入
- **汇总注释** — 添加显示计数的注释（例如："所有者: 3 步 / AI: 7 步"）

---

## 泳道布局算法（强制）

**本节控制元素在泳道内的定位方式。在编写任何 XML 之前必须遵循此规范。**

泳道整洁与否取决于一件事：**盒子放置的位置**。如果盒子放置得当，箭头会自动路由。如果盒子被塞进列中，箭头就会缠绕。

### 泳道池结构

使用 draw.io 原生泳道和自动堆叠车道：

```xml
<!-- 带有自动堆叠车道的池 -->
<mxCell id="pool-1" value="流程名称" style="swimlane;childLayout=stackLayout;resizeParent=1;resizeParentMax=0;horizontal=0;startSize=20;horizontalStack=0;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontStyle=1;" vertex="1" parent="1">
    <mxGeometry x="40" y="40" width="800" height="400" as="geometry"/>
</mxCell>

<!-- 车道自动垂直堆叠 -->
<mxCell id="lane-1" value="所有者" style="swimlane;startSize=20;horizontal=0;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="pool-1">
    <mxGeometry x="20" width="780" height="100" as="geometry"/>
</mxCell>

<mxCell id="lane-2" value="AI" style="swimlane;startSize=20;horizontal=0;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="pool-1">
    <mxGeometry x="20" y="100" width="780" height="100" as="geometry"/>
</mxCell>
```

关键属性：`childLayout=stackLayout`（车道自动堆叠）、`resizeParent=1`（池自动调整大小）、`startSize=20`（紧凑的车道标签）、`horizontal=0`（车道自上而下堆叠）。

### 7 条核心规则

**规则 1：每个槽位一个元素。** "槽位" = 一个车道 × 一个 X 位置。永远不要在同一个阶段列中垂直堆叠两个元素。如果同一车道同一阶段有 2 个活动，水平展开它们。

**规则 2：箭头只能向右或向下。** 永远不要向上、永远不要向左、永远不要穿过另一个元素。放置任何元素之前，检查："从上一个元素到这个元素的箭头能否不穿过另一个盒子到达？"如果不能，将此元素右移直到路径畅通。例外：跨车道返回箭头作为 L 形向上，当目标在源右侧时。

**规则 3：向下的箭头必须是直接的。** 只有当目标元素直接在源下方（X 位置相同或非常接近）时，箭头才应该向下。如果需要向下和向右，先将目标元素向右偏移，使箭头能够形成干净的 L 形。

**规则 4：阶段之间留有水平空间。** 阶段 1 最后一个元素和阶段 2 第一个元素之间的间隙至少 60px。这为箭头在间隙中垂直路由提供了空间，不会穿过元素。

**规则 5：更宽比更高好。** 有疑问时，增加水平空间。1200px 宽、箭头整齐的泳道比 760px 宽、箭头乱成一团的泳道更好。

**规则 6：扇出目标放在不同的行，收敛目标放在两者右侧。** 当一个元素扇出到两个后续收敛的目标时：
- 将第一个扇出目标放在第 1 行（与源同一行）
- 将第二个扇出目标放在第 2 行（相对于第一个向右偏移）
- 将收敛目标放在第 2 行，在两个扇出目标的右侧
- 这确保进入收敛目标的两条箭头都向右

**规则 7：在多行车道中，每个元素都有自己的 X。** 两个 X 相同但 Y 不同的元素会造成垂直交通堵塞。将所有元素水平交错放置。

### 5 步放置流程

#### 第 1 步：构建连接图

在触碰任何坐标之前，列出每个元素及其连接：

```
1. 构思内容（所有者）-> 录制视频（所有者）
2. 录制视频（所有者）-> 编辑视频（AI）
3. 编辑视频（AI）-> CTA 播放（AI）
4. 编辑视频（AI）-> 描述链接（AI）
...
```

#### 第 2 步：找到主流程路径

识别从起点到终点的最长路径。这成为图表的"脊椎"。

#### 第 3 步：首先放置主路径

从左到右遍历主路径：
- 同一车道，下一步：X += 180（盒子宽度 + 间隙）
- 不同车道，下一步：X += 140（创建干净的斜线）

#### 第 4 步：放置分支元素

对于不在主路径上的每个元素：
- 与源同一车道，并行活动：如果没有箭头交叉，放在同一 X 但不同 Y 的位置
- 不同车道：放在源和目标之间的 X 位置

**关键测试：** 放置每个分支元素后，追踪每条到/从它的箭头。它是否穿过任何其他盒子？如果是，将此元素右移直到畅通。

#### 第 5 步：箭头审查

检查每条箭头：
1. 它是否穿过另一个元素？将目标右移
2. 它是否与另一条箭头重叠？偏移锚点（`exitY=0.25` vs `exitY=0.75`）
3. 它是一条长斜线吗？改成 L 形

### 视觉模式：好与坏

#### 跨车道交接

```
错误（箭头穿过"发布社区"）：

所有者 | [构思]->[录制]->[发布社区]
      |            |  ^ 箭头穿过发布社区！
------|            v
AI    |         [编辑视频]

正确（目标向右偏移，箭头有清晰路径）：

所有者 | [构思]->[录制]---------->[发布社区]
      |             \
------|              \             （清晰的垂直间隙）
AI    |           [编辑视频]
```

#### 扇出（一个源，多个目标）

```
错误（所有目标在同一 X，箭头重叠）：

所有者 | [录制]---+
------|            +--->[编辑视频]
AI    |            +--->[描述]
------|            +--->[CTA 叠加]
输出   |

正确（目标向右交错，每个箭头有自己的路径）：

所有者 | [录制]--------+
------|                  \
AI    |            [编辑视频]--->[描述]
------|                                  \
输出   |                              [CTA 叠加]
```

#### 并行活动（同一车道）

```
错误（垂直堆叠，箭头缠绕）：

所有者 | [构思]
      | [录制]     <- 两者的箭头都向右并交叉
------|

正确（并排，顺序）：

所有者 | [构思]--->[录制]
------|
```

#### 收敛箭头（多个源，一个目标）

```
错误（所有箭头到达同一点）：

AI    | [Claude 草稿]---+
      | [Substack]-------+>[最终输出]  <- 箭头堆积
------|                  |
输出   | [审核]---------+

正确（从不同侧到达）：

AI    | [Claude 草稿]-->[Substack 交付]
------|                          \
输出   |                    [最终输出]<--[审核]
```

#### 父子关系布局（子元素填满父盒子）

```
错误（子元素超出父盒子边界）：

+----------------------------------+
| 父容器                            |
| [子1] [子2] [子3] [子4] [子5] [子6] [子7] → 子元素超出边界
+----------------------------------+

正确（子元素保持间距填满父盒子，最后一行拉伸）：

+----------------------------------+
| 父容器  |
| [ 子1 ]  [ 子2 ]  [ 子3 ]  [ 子4 ] |
| [     子5     ]  [     子6     ] |
+----------------------------------+
```

### 间距参考

| 测量项 | 值 |
|-------------|-------|
| 同一车道下一步 | X += 180px |
| 跨车道下一步 | X += 140px |
| 阶段间隙 | 60px 清晰 |
| 最小盒子水平间隙 | 60px |
| 车道高度（1 排盒子） | 100-120px |
| 车道高度（2 排盒子） | 160-180px |
| 池宽度 | 动态：`80 + (列数 x 180) + 40`，最小 880px |

### 箭头样式

```xml
<mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#666666;strokeWidth=2;"
        edge="1" parent="pool-id" source="step-a" target="step-b">
    <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

`rounded=1` 软化弯角。`orthogonalEdgeStyle` 提供直角路由。`jettySize=auto` 从盒子边缘添加智能间距。

**跨车道箭头的出口/入口锚点：**
- 向右和向下：`exitX=1;exitY=0.5` -> `entryX=0;entryY=0.5`
- 直向下：`exitX=0.5;exitY=1` -> `entryX=0.5;entryY=0`
- 同一盒子两条箭头：一个用 `exitY=0.25`，另一个用 `exitY=0.75`

### 质量检查清单

在完成任何泳道之前：
- 没有箭头穿过任何元素
- 没有两条箭头重叠超过 20px
- 每条向下的箭头连接到正下方的元素
- 每条跨车道箭头形成干净的 L 形
- 扇出目标已交错（不是都在同一 X）
- 池宽度足够（留白是可以的）

---

## XML 结构

每个 `.drawio` 文件必须遵循此结构：

```xml
<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <!-- 所有图表元素，parent="1" -->
  </root>
</mxGraphModel>
```

**关键规则：**
- 单元格 `id="0"` 是根层，`id="1"` 是默认父级
- 所有元素使用 `parent="1"`（或泳道容器的父级）
- 为每个 `mxCell` 使用唯一的 `id` 值
- 转义特殊字符：`&amp;`、`&lt;`、`&gt;`、`&quot;`
- 永远不要在 XML 注释内使用 `--`

### 形状示例

```xml
<mxCell id="2" value="流程步骤" style="rounded=1;whiteSpace=wrap;fillColor=#dae8fc;strokeColor=#6c8ebf;"
        vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
</mxCell>
```

### 连接器示例

```xml
<mxCell id="edge1" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=1;"
        edge="1" source="step1" target="step2" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 带标签的连接器

```xml
<mxCell id="edge2" value="是" style="edgeStyle=orthogonalEdgeStyle;rounded=1;"
        edge="1" source="decision1" target="step3" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

---
