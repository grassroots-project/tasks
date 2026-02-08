import os
import re
import sys

# 检查 people.md
if os.path.exists('data/people.md'):
    with open('data/people.md', 'r') as f:
        content = f.read()
    if '# 人才库' not in content:
        print('❌ people.md 缺少标题 # 人才库')
        sys.exit(1)
    if '## 现有成员' not in content:
        print('❌ people.md 缺少 ## 现有成员 章节')
        sys.exit(1)
    members = re.findall(r'### (.+)', content)
    if not members:
        print('❌ people.md 没有找到任何成员')
        sys.exit(1)
    for m in members:
        pattern = r'### ' + m + r'.*?- \*\*加入时间\*\*：.*?- \*\*技能标签\*\*：.*?- \*\*时间承诺\*\*：.*?- \*\*当前任务\*\*：.*?- \*\*历史贡献\*\*：'
        if not re.search(pattern, content, re.DOTALL):
            print(f'❌ 成员 {m} 缺少必要字段')
            print('必要字段：加入时间、技能标签、时间承诺、当前任务、历史贡献')
            sys.exit(1)
    print(f'✅ people.md 格式正确（{len(members)} 个成员）')

# 检查 resources.md
if os.path.exists('data/resources.md'):
    with open('data/resources.md', 'r') as f:
        content = f.read()
    if '# 资源池' not in content:
        print('❌ resources.md 缺少标题 # 资源池')
        sys.exit(1)
    if '## 资源列表' not in content:
        print('❌ resources.md 缺少 ## 资源列表 章节')
        sys.exit(1)
    resources = re.findall(r'### (.+)', content)
    if not resources:
        print('❌ resources.md 没有找到任何资源')
        sys.exit(1)
    for r in resources:
        pattern = r'### ' + r + r'.*?- \*\*类型\*\*：.*?- \*\*描述\*\*：.*?- \*\*当前状态\*\*：.*?- \*\*负责人\*\*：'
        if not re.search(pattern, content, re.DOTALL):
            print(f'❌ 资源 {r} 缺少必要字段')
            print('必要字段：类型、描述、当前状态、负责人')
            sys.exit(1)
    print(f'✅ resources.md 格式正确（{len(resources)} 个资源）')
