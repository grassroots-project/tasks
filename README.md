# Grassroots 任务池系统

基于 GitHub 的免费任务池系统，无需额外基础设施。

## 架构

```
前端（静态网页）
  ↓ GitHub API
GitHub Issues（任务池）
GitHub Labels（优先级、状态、技能）
data/people.md（人才库）
data/resources.md（资源库）
```

## 核心组件

### 1. 任务池（GitHub Issues）
- 每个任务是一个 Issue
- 用标签表示优先级（P0/P1/P2）、状态（待领/进行中/已完成）、技能
- 使用模板创建任务，结构统一

### 2. 人才库（data/people.md）
- 以 Markdown 文件管理成员信息
- 包含：技能、时间承诺、当前任务、历史贡献
- 通过 PR 流程更新，所有变更经过审核

### 3. 资源库（data/resources.md）
- 以 Markdown 文件管理资源信息
- 包含：资源类型、描述、可用状态、负责人
- 通过 PR 流程更新

### 4. 前端
- 调用 GitHub API 动态加载任务和数据
- 支持按优先级、状态过滤
- 纯静态，可部署到 GitHub Pages

## 使用指南

### 添加任务
1. 在仓库中点击 "New issue"
2. 选择 "新任务" 模板
3. 填写任务详情
4. 选择适当的标签（优先级 + 技能）

### 认领任务
1. 在任务 Issue 中评论认领
2. 将标签从 `待领` 改为 `进行中`
3. 将自己设置为 Assignee
4. 更新 data/people.md 中的"当前任务"

### 完成任务
1. 在任务 Issue 中评论工作结果
2. 将标签改为 `已完成`
3. 更新 data/people.md 中的"历史贡献"

### 加入人才库
1. Fork 仓库
2. 编辑 `data/people.md`，添加自己的信息
3. 提交 PR（标题前缀 `[成员]`）
4. 等待审核合并

详细 PR 流程见 [PR_WORKFLOW.md](PR_WORKFLOW.md)

## 标签体系

**优先级**：P0（必须先做）/ P1（重要不紧急）/ P2（探索性）

**状态**：待领 / 进行中 / 已完成

**技能**：文案 / 视频 / 设计 / 技术 / 运营 / 沟通 / 社交

## 技术说明

- GitHub 公开 API，速率限制 60 req/h（无认证）
- `gh-api.js` 封装了任务、人才库、资源库的数据获取和解析
- `validate_files.py` 用于 PR 自动验证数据格式
- GitHub Actions 自动检查 PR 标题和数据格式

## 优点

1. **完全免费**：GitHub 免费账户足够
2. **开箱即用**：Issues、标签、PR 都是现成的
3. **无需运维**：GitHub 负责基础设施
4. **易于协作**：Fork、PR 是标准流程
5. **透明公开**：所有人都能看到任务和进度
