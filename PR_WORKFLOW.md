# PR 审核流程

## 概述

使用 Pull Request 管理人才库和资源池，所有变更都经过审核。

---

## 架构

```
grassroots-project/tasks/
├── .github/
│   ├── pull_request_template.md    # PR 模板
│   └── labels.yaml                  # 标签配置
└── data/
    ├── people.md                    # 人才库数据
    └── resources.md                 # 资源池数据
```

---

## 自动验证

### 1. PR 标题前缀

必须包含以下之一：
- `[成员]` — 人才库变更
- `[资源]` — 资源池变更
- `[任务]` — 任务相关
- `[其他]` — 其他变更

**正确示例**：
- `[成员] 添加张三到人才库`
- `[资源] 更新项目基金状态`

**错误示例**：
- 添加张三 ❌
- 更新资源池 ❌

### 2. PR 模板填写

必须填写完整：
- ✅ 变更类型（勾选）
- ✅ 变更内容（具体说明）
- ✅ 变更原因（为什么要改）

### 3. 数据文件格式

**人才库（data/people.md）**：
- 必须字段：加入时间、技能标签、时间承诺、当前任务、历史贡献
- 格式：Markdown 三级标题 + 列表

**资源池（data/resources.md）**：
- 必须字段：类型、描述、当前状态、负责人
- 格式：Markdown 三级标题 + 列表

---

## 使用流程

### 1. 添加成员

```bash
# 1. Fork 仓库
# 2. Clone 到本地
git clone https://github.com/YOUR_USERNAME/tasks.git
cd tasks

# 3. 创建分支
git checkout -b member/add-zhangsan

# 4. 编辑 data/people.md
# 添加成员信息

# 5. 提交
git add data/people.md
git commit -m "[成员] 添加张三到人才库"

# 6. 推送
git push origin member/add-zhangsan

# 7. 在 GitHub 创建 Pull Request
# 填写 PR 模板，说明变更原因
```

### 2. 更新成员信息

```bash
# 创建分支
git checkout -b member/update-zhangsan-tasks

# 编辑 data/people.md
# 更新当前任务或历史贡献

# 提交
git commit -m "[成员] 更新张三的任务完成情况"

# 推送并创建 PR
```

### 3. 添加资源

```bash
# 创建分支
git checkout -b resource/add-figma-account

# 编辑 data/resources.md
# 添加资源信息

# 提交并创建 PR
```

### 4. 更新资源状态

```bash
# 创建分支
git checkout -b resource/update-figma-status

# 编辑 data/resources.md
# 修改当前状态：可用 → 已占用

# 提交并创建 PR
```

---

## 审核标准

### 人才库变更

- ✅ 已通过筛选问卷
- ✅ 技能标签合理（不要太多）
- ✅ 时间承诺真实（不要夸大）
- ✅ 有明确当前任务（加入时可为无）
- ✅ 历史贡献与任务编号对应

### 资源池变更

- ✅ 资源描述清晰
- ✅ 负责人明确且真实
- ✅ 状态更新合理（不会频繁切换）
- ✅ 使用说明完整
- ✅ 有相关链接（如果有）

---

## 前端集成

网站使用 `gh-api.js` 获取数据：

```javascript
// 获取人才库
import { fetchPeoplePool, parsePeoplePool } from './gh-api.js';

const poolData = await fetchPeoplePool();
const members = parsePeoplePool(poolData.body);

// 获取资源池
import { fetchResourcePool, parseResourcePool } from './gh-api.js';

const resourceData = await fetchResourcePool();
const resources = parseResourcePool(resourceData.body);
```

---

## 故障排除

### PR 验证失败

**问题**：GitHub Actions 显示 ❌

**解决**：
1. 检查 PR 标题是否包含正确前缀
2. 确认 PR 模板已填写完整
3. 检查数据文件格式是否正确
4. 查看失败原因的详细日志

### 数据文件格式错误

**问题**：验证脚本报告格式错误

**解决**：
1. 对照模板检查字段
2. 确保使用中文冒号 `：`
3. 检查三级标题格式 `### 名字`
4. 确保字段加粗 `**字段名**`

### 前端数据不更新

**问题**：网站显示旧数据

**解决**：
1. 确认 PR 已合并
2. 等待 GitHub Pages 更新（约 1-2 分钟）
3. 刷新页面（清除缓存）

---

## 最佳实践

1. **分支命名**：使用有意义的前缀
   - `member/add-name` — 添加成员
   - `member/update-name` — 更新成员
   - `resource/add-name` — 添加资源
   - `resource/update-name` — 更新资源

2. **提交信息**：包含前缀和简短描述
   - `[成员] 添加张三到人才库`
   - `[资源] 更新项目基金状态`

3. **PR 描述**：说明变更原因
   - 为什么需要这次变更？
   - 变更后的预期效果是什么？

4. **及时更新**：
   - 领取任务后立即更新"当前任务"
   - 完成任务后移至"历史贡献"
   - 使用资源后更新状态

5. **保持格式一致**：
   - 统一使用中文冒号
   - 统一日期格式 `YYYY-MM-DD`
   - 统一技能标签用逗号分隔
