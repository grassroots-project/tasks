# Grassroots 任务池系统

基于 GitHub 的免费任务池系统，无需额外基础设施。

## 架构

```
前端（静态网页）
  ↓ GitHub API
GitHub Issues（任务池）
  ↓
GitHub Labels（优先级、状态、技能）
  ↓
GitHub Issues（人才库、资源池）
```

## 核心组件

### 1. 任务池（GitHub Issues）
- 每个任务是一个 Issue
- 用标签表示优先级（p0/p1/p2）、状态（待领/进行中/已完成）、技能
- 使用模板创建任务，结构统一

### 2. 人才库（GitHub Issue）
- 用一个专门的 Issue 记录所有成员
- 包含：技能、时间承诺、当前任务、历史贡献

### 3. 资源池（GitHub Issue）
- 用一个专门的 Issue 记录所有资源
- 包含：资源类型、描述、可用状态、负责人

### 4. 前端（tasks.html）
- 调用 GitHub API 动态加载任务
- 支持按优先级、状态过滤
- 纯静态，可部署到 GitHub Pages

## 使用指南

### 第一步：创建 GitHub 仓库

1. 在 GitHub 创建新仓库：`grassroots-project/tasks`
2. 设置为 Public（因为是开放的协作）

### 第二步：配置 Issues 模板

将 `issue-templates/task_template.md` 复制到：
```
.github/ISSUE_TEMPLATE/task_template.md
```

### 第三步：配置标签

GitHub 目前不支持通过文件自动配置标签，需要在仓库界面手动创建：

1. 进入仓库 → Issues → Labels
2. 创建以下标签：

**优先级**：
- `p0` (红色) - 必须先做（启动阶段）
- `p1` (黄色) - 重要但不紧急（1-2个月内）
- `p2` (绿色) - 探索性任务（可以延后）

**状态**：
- `待领` (紫色) - 没人做
- `进行中` (绿色) - 有人正在做
- `已完成` (灰色) - 已完成

**技能**：
- `文案` - 文案、写作
- `视频` - 视频制作、剪辑
- `设计` - UI/UX、平面设计
- `技术` - 编程、开发
- `运营` - 社群运营、用户增长
- `沟通` - 沟通、社交
- `社交` - 社交、人脉

### 第四步：创建人才库 Issue

1. 创建新 Issue，标题：`[人才库] 成员列表`
2. 添加标签：`人才库`
3. 复制 `templates/people-pool.md` 的内容到 Issue 正文

### 第五步：创建资源池 Issue

1. 创建新 Issue，标题：`[资源池] 资源列表`
2. 添加标签：`资源池`
3. 复制 `templates/resource-pool.md` 的内容到 Issue 正文

### 第六步：部署前端

将以下文件复制到 `grassroots-project/website` 仓库：
- `tasks.html` - 任务池前端页面
- `gh-api.js` - GitHub API 调用代码

### 第七步：添加初始任务

使用模板创建任务：
1. 点击 "New issue"
2. 选择 "新任务" 模板
3. 填写任务详情
4. 选择适当的标签

## 工作流程

### 添加任务
1. 点击任务池页面的 "+ 添加任务" 按钮
2. 填写任务模板
3. 选择优先级、技能标签
4. 创建 Issue

### 认领任务
1. 在任务 Issue 中评论：`@你的名字 认领这个任务`
2. 将标签从 `待领` 改为 `进行中`
3. 将自己设置为 Assignee

### 完成任务
1. 在任务 Issue 中评论工作结果
2. 将标签改为 `已完成`
3. 在人才库 Issue 中更新自己的历史贡献

### 加入人才库
1. 找到人才库 Issue
2. 编辑 Issue（或通过 PR）
3. 添加自己的信息到成员列表

## 技术说明

### GitHub API 使用
- 使用公开 API，无需认证
- 速率限制：60 requests/hour per IP
- 如果需要更高频率，可以配置 Personal Access Token

### 前端部署
- 纯静态页面，无需后端
- 可部署到 GitHub Pages、Vercel、Netlify
- 支持响应式设计

### 扩展可能
- GitHub Projects：看板视图（可视化）
- GitHub Actions：自动更新任务状态
- GitHub Discussions：讨论区

## 优点

1. **完全免费**：GitHub 免费账户足够
2. **开箱即用**：Issues、标签、评论都是现成的
3. **无需运维**：GitHub 负责基础设施
4. **易于协作**：Fork、PR、Issue 都是标准流程
5. **透明公开**：所有人都能看到任务和进度


