// GitHub API 配置
const CONFIG = {
  owner: 'grassroots-project',
  repo: 'tasks',
  // 可选：如果仓库是私有的，需要 Personal Access Token
  // token: 'your_github_token'
};

// GitHub API 基础 URL
const API_BASE = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}`;

// 设置 API 请求头
function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (CONFIG.token) {
    headers['Authorization'] = `token ${CONFIG.token}`;
  }
  return headers;
}

// 获取所有 Issues（任务）
export async function fetchTasks() {
  try {
    const response = await fetch(
      `${API_BASE}/issues?state=open&sort=created&direction=desc&per_page=100`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

// 获取人才库（从数据文件）
export async function fetchPeoplePool() {
  try {
    const response = await fetch(
      `${API_BASE}/contents/data/people.md`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch people data');
    const data = await response.json();
    // 解码 base64 内容
    const content = atob(data.content);
    return {
      body: content,
      html_url: `${data.html_url}`,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching people pool:', error);
    return null;
  }
}

// 获取资源池（从数据文件）
export async function fetchResourcePool() {
  try {
    const response = await fetch(
      `${API_BASE}/contents/data/resources.md`,
      { headers: getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch resource data');
    const data = await response.json();
    // 解码 base64 内容
    const content = atob(data.content);
    return {
      body: content,
      html_url: `${data.html_url}`,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error fetching resource pool:', error);
    return null;
  }
}

// 解析人才库 Markdown
export function parsePeoplePool(markdown) {
  const lines = markdown.split('\n');
  const members = [];
  let currentMember = null;

  for (const line of lines) {
    if (line.startsWith('### ')) {
      // 保存上一个成员
      if (currentMember) {
        members.push(currentMember);
      }
      // 开始新成员
      currentMember = {
        name: line.replace('### ', '').trim(),
        joined: '',
        skills: '',
        time: '',
        current: '',
        history: ''
      };
    } else if (currentMember && line.includes('：')) {
      const [key, value] = line.split('：');
      const trimmedKey = key.trim().replace(/\*\*/g, '');
      switch (trimmedKey) {
        case '加入时间':
          currentMember.joined = value.trim();
          break;
        case '技能标签':
          currentMember.skills = value.trim();
          break;
        case '时间承诺':
          currentMember.time = value.trim();
          break;
        case '当前任务':
          currentMember.current = value.trim();
          break;
        case '历史贡献':
          currentMember.history = value.trim();
          break;
      }
    }
  }

  // 保存最后一个成员
  if (currentMember) {
    members.push(currentMember);
  }

  return members;
}

// 解析资源池 Markdown
export function parseResourcePool(markdown) {
  const lines = markdown.split('\n');
  const resources = [];
  let currentResource = null;

  for (const line of lines) {
    if (line.startsWith('### ')) {
      // 保存上一个资源
      if (currentResource) {
        resources.push(currentResource);
      }
      // 开始新资源
      currentResource = {
        name: line.replace('### ', '').trim(),
        type: '',
        description: '',
        status: '',
        owner: '',
        instructions: '',
        link: ''
      };
    } else if (currentResource && line.includes('：')) {
      const [key, value] = line.split('：');
      const trimmedKey = key.trim().replace(/\*\*/g, '');
      switch (trimmedKey) {
        case '类型':
          currentResource.type = value.trim();
          break;
        case '描述':
          currentResource.description = value.trim();
          break;
        case '当前状态':
          currentResource.status = value.trim();
          break;
        case '负责人':
          currentResource.owner = value.trim();
          break;
        case '使用说明':
          currentResource.instructions = value.trim();
          break;
        case '链接':
          currentResource.link = value.trim();
          break;
      }
    }
  }

  // 保存最后一个资源
  if (currentResource) {
    resources.push(currentResource);
  }

  return resources;
}

// 解析任务标签
export function parseTaskLabels(labels) {
  const result = {
    priority: null,
    status: null,
    skills: []
  };

  for (const label of labels) {
    const name = label.name;
    if (['p0', 'p1', 'p2'].includes(name)) {
      result.priority = name;
    } else if (['待领', '进行中', '已完成'].includes(name)) {
      result.status = name;
    } else {
      result.skills.push(name);
    }
  }

  return result;
}

// 从任务描述中提取字段
export function parseTaskDescription(body) {
  const result = {
    description: '',
    skills: '',
    time: '',
    links: '',
    assignee: ''
  };

  if (!body) return result;

  const lines = body.split('\n');
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.slice(3).trim();
    } else if (currentSection && line.trim()) {
      switch (currentSection) {
        case '任务描述':
          result.description += line + '\n';
          break;
        case '技能要求':
          result.skills = line.trim();
          break;
        case '预期时间':
          result.time = line.trim();
          break;
        case '相关链接':
          result.links = line.trim();
          break;
        case '领取':
          result.assignee = line.trim();
          break;
      }
    }
  }

  return result;
}

// 渲染任务卡片
export function renderTaskCard(issue) {
  const labels = parseTaskLabels(issue.labels);
  const details = parseTaskDescription(issue.body);

  const priorityColors = {
    p0: 'bg-red-500',
    p1: 'bg-yellow-500',
    p2: 'bg-green-500'
  };

  const priorityText = {
    p0: '必须先做',
    p1: '重要不紧急',
    p2: '探索性'
  };

  const statusColors = {
    待领: 'bg-purple-500',
    进行中: 'bg-green-500',
    已完成: 'bg-gray-500'
  };

  return `
    <div class="task-card">
      <h3><a href="${issue.html_url}" target="_blank">${issue.title}</a></h3>
      <div class="task-meta">
        <span class="priority ${priorityColors[labels.priority] || 'bg-gray-500'}">
          ${priorityText[labels.priority] || '未知优先级'}
        </span>
        <span class="status ${statusColors[labels.status] || 'bg-gray-500'}">
          ${labels.status || '待领'}
        </span>
        ${labels.skills.length > 0 ? `
          <span class="skills">
            ${labels.skills.join(', ')}
          </span>
        ` : ''}
      </div>
      ${details.time ? `<div class="task-time">⏱ ${details.time}</div>` : ''}
      ${details.description ? `<div class="task-description">${details.description.trim()}</div>` : ''}
      ${details.assignee ? `<div class="task-assignee">👤 ${details.assignee}</div>` : ''}
    </div>
  `;
}

// 渲染任务列表
export function renderTaskList(tasks, filter = {}) {
  let filteredTasks = tasks.filter(issue => !issue.pull_request);

  if (filter.priority) {
    filteredTasks = filteredTasks.filter(issue =>
      issue.labels.some(label => label.name === filter.priority)
    );
  }

  if (filter.status) {
    filteredTasks = filteredTasks.filter(issue =>
      issue.labels.some(label => label.name === filter.status)
    );
  }

  if (filter.skill) {
    filteredTasks = filteredTasks.filter(issue =>
      issue.labels.some(label => label.name === filter.skill)
    );
  }

  if (filteredTasks.length === 0) {
    return '<p class="no-tasks">没有找到任务</p>';
  }

  return filteredTasks.map(issue => renderTaskCard(issue)).join('');
}
