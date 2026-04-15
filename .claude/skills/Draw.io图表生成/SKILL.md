---
name: Draw.io图表生成
description: 根据文本内容自动生成 draw.io 可直接导入的 XML 图表文件
---

## 触发词
`drawio`

## 描述
根据文本内容自动生成 draw.io 可直接导入的 XML 图表文件。

## 使用场景
当用户需要以下类型的图表时，使用此 Skill：
- 系统架构图
- 流程图
- 时序图
- 层次结构图
- 思维导图
- 网络拓扑图

## 触发条件
当用户说以下类似语句时触发：
- "生成 draw.io 图表"
- "生成架构图"
- "把这段文本转换为 draw.io"
- "创建系统设计图"
- "生成流程图"

---

## 生成规则

### 1. 图表类型识别
根据内容自动判断类型：
- **架构图**：多层结构、系统组件 → 垂直分层布局
- **流程图**：步骤、决策、箭头流向 → 水平/垂直流向布局
- **时序图**：时间顺序、交互过程 → 水平时间轴布局
- **层次图**：树形结构、包含关系 → 从上到下或从左到右展开

### 2. 视觉风格
- **配色**：淡雅色系（pastel colors），每层/每模块使用不同主题色
- **形状**：
  - 默认使用直角矩形（`rounded=0`），不使用圆角
  - **优先使用厂商图标**：对于知名技术栈，优先使用对应的厂商图标库（见下方厂商图标库部分）
- **边框**：浅色边框，strokeWidth=1-2
- **透明度**：背景容器使用 opacity=80 产生层次感

### 3. 厂商图标库

项目内置了各大厂商的专业图标库，使用 `shape=mxgraph.前缀.图标名` 即可调用，如果能在里面找到图标就使用，没有就不强求。

**可用图标库**（位于 `drawio_icon_names/` 目录）：

| 厂商/类别 | 图标前缀 | 文件位置 | 适用场景 |
|-----------|---------|---------|---------|
| **Kubernetes** | `mxgraph.kubernetes.*` | `kubernetes/` | 容器编排（pod, node, deploy, svc, ingress 等） |
| **阿里云** | `mxgraph.alibaba_cloud.*` | `alibaba（阿里巴巴）/` | 阿里云服务（mysql, redis, mongodb, postgresql, ack_kubernetes 等） |
| **AWS** | `mxgraph.aws4.*` | `aws（亚马逊）/` | AWS 服务（ec2, rds, api_gateway, lambda, documentdb 等） |
| **Azure** | `mxgraph.azure.*` | `azure（微软Azure）/` | Azure 云服务 |
| **Google Cloud** | `mxgraph.gcp2.*` | `gcp（谷歌云）/` | GCP 云服务 |
| **IBM Cloud** | `mxgraph.ibm_cloud.*` | `ibm_cloud（IBM云）/` | IBM 云服务 |
| **Cisco** | `mxgraph.cisco.*` | `cisco（思科）/` | 网络设备、路由器、交换机 |
| **OpenStack** | `mxgraph.openstack.*` | `openstack/` | OpenStack 私有云 |
| **Atlassian** | `mxgraph.atlassian.*` | `atlassian/` | Jira, Confluence 等协作工具 |
| **Citrix** | `mxgraph.citrix.*` | `citrix（思杰）/` | 虚拟化、桌面云 |
| **Salesforce** | `mxgraph.salesforce.*` | `salesforce/` | CRM 相关 |

**使用方式**：

```xml
<!-- 方式1：使用厂商图标（推荐） -->
<mxCell id="pod1" value="Pod" style="shape=mxgraph.kubernetes.pod;fillColor=#C8E6C9;strokeColor=#66BB6A;" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="50" height="50" as="geometry" />
</mxCell>

<!-- 方式2：使用阿里云 MySQL 图标 -->
<mxCell id="mysql" value="MySQL" style="shape=mxgraph.alibaba_cloud.mysql;fillColor=#FFF;strokeColor=#666;" vertex="1" parent="1">
  <mxGeometry x="150" y="50" width="50" height="50" as="geometry" />
</mxCell>

<!-- 方式3：传统矩形样式（当没有合适图标时） -->
<mxCell id="custom" value="自定义组件" style="rounded=0;fillColor=#E1BEE7;strokeColor=#9C27B0;" vertex="1" parent="1">
  <mxGeometry x="250" y="50" width="120" height="40" as="geometry" />
</mxCell>
```

**图标查找技巧**：
- 图标名称格式：`mxgraph.{厂商}.{产品名}`
- 例如：`mxgraph.kubernetes.pod`、`mxgraph.alibaba_cloud.redis_kvstore`、`mxgraph.aws4.rds`
- 各厂商的具体图标名称列表见对应的 `*_names.txt` 文件

---

#### ⚠️ 厂商图标尺寸规则（重要）

- 厂商图标必须使用**正方形尺寸**，推荐 `50x50`、`60x60` 或 `80x80`
- **不要使用长方形尺寸**（如 160x50），会导致图标显示异常
- 当组件使用厂商图标时，该组件的 `width` 和 `height` 必须相等
- 布局计算时需要考虑正方形组件的实际占用空间

**示例**：
```
✅ 正确：width="60" height="60"
❌ 错误：width="160" height="50"
```

#### ⚠️ 文字位置规则（重要）

**父容器/层标题**：必须添加 `verticalAlign=top;`
```
style="...;verticalAlign=top;"
```

**厂商图标组件**：必须使用 `verticalLabelPosition=bottom;verticalAlign=top;` 让文字显示在图标外面
```
style="...;verticalLabelPosition=bottom;verticalAlign=top;"
```

**普通矩形组件**：不需要特殊设置，文字默认居中显示

---

### 4. 组件设计原则

- **独立方框**：每个内容项使用独立的 `<mxCell>` 元素
- **禁止换行堆叠**：不要使用 `&#xa;` 在一个方框内显示多行文本，应拆分为多个独立方框
- **标题与内容分离**：标题和详细描述分别用独立的方框
- **容器结构**：父级容器必须添加 `container=1` 到 style 属性
- **父子关系**：子元素必须设置 `parent` 属性指向父容器的 ID
- **相对坐标**：子元素的坐标（x, y）是相对于父容器的相对位置
- **字体加粗规则**：
  - 父级容器/层标题：`fontStyle=1`（加粗）
  - 子元素组件：`fontStyle=0`（不加粗）

### 5. 布局规范

**容器尺寸统一**（⚠️ 重要）：
- 所有父级容器宽度必须一致
- 父容器之间的间距至少要 `40` 单位
- 子元素间距统一：保持严格一致（建议 **10 单位**）
- 内部边距统一标准：
  - 左边距：`40` 单位（第一个子元素 x 坐标）
  - 上边距：`50` 单位
  - 右边距：`40` 单位（容器宽 - 最右子元素的 x+width）
  - 下边距：`40` 单位（容器高 - 最下子元素的 y+height）

**字体大小规范**：
- 主标题：`fontSize=22`
- 层标题：`fontSize=16`
- 子元素内容：`fontSize=14`

**对齐**：同层级组件垂直对齐或水平对齐

**连接规则**：
- 使用 `<mxCell>` 的 `edge="1"` 属性创建箭头连接
- **必须同时指定 `source` 和 `target`**，让箭头准确吸附到节点
- 箭头样式：`endArrow=classic;html=1;strokeWidth=2`
- 层间连接：`source="当前层ID" target="下一层ID"`
- 组件间连接：`source="源组件ID" target="目标组件ID"`

### 6. 颜色方案（推荐）

| 用途 | 填充色 | 边框色 |
|------|--------|--------|
| 第一层 | `#E8F5E9` / `#C8E6C9` | `#66BB6A` |
| 第二层 | `#E3F2FD` / `#BBDEFB` | `#42A5F5` |
| 第三层 | `#FFF3E0` / `#FFE0B2` | `#FF9800` |
| 第四层 | `#F3E5F5` / `#E1BEE7` | `#9C27B0` |
| 背景容器 | 同色系浅色 | 同色系深色 |

### 7.其他
- 每个文本块必须是独立的方框，不能使用换行符堆叠
- XML 语法必须正确，确保能被 draw.io 正确解析
- 保持整体布局美观、层次清晰

---

## 输出格式

生成完整的 XML 文件，包含：

```xml
<mxfile host="app.diagrams.net" modified="..." agent="Claude Code" version="24.0.0">
  <diagram name="图表名称" id="...">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- 组件定义 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 输出说明

生成完成后告知用户：
1. XML 文件的保存路径
2. 配色方案说明
3. 如何导入 draw.io（其他 → 编辑绘图 → 将xml内容复制进入即可）
