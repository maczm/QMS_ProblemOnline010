# Agent 工作规范

本文档定义了 AI Agent 在本项目中的工作流程和规范，确保代码质量、可追溯性和知识传承。

> **适用工具:** CodeBuddy Code、Qoder CLI、Codex、Claude Code、OpenCode、Trae 等 AI 编程助手

---

## 一、会话初始化

每次新会话开始时，Agent 应首先阅读以下文档以了解项目状态:

### 1. 项目文档
| 文档 | 说明 | 优先级 |
|------|------|--------|
| `AGENT.md` | 工作规范(本文档) | 必须 |
| `MEMORY.md` | 项目记忆 | 必须 |
| `CHANGELOG.md` | 项目改动记录 | 推荐 |

### 2. 记忆系统
不同工具的记忆文件路径不同:

| 工具 | 记忆文件路径 |
|------|-------------|
| CodeBuddy Code | `~/.codebuddy/projects/{project}/memory/MEMORY.md` |
| Claude Code | `~/.claude/memory/MEMORY.md` 或 CLAUDE.md |
| Qoder CLI | 项目根目录 `.qoder/memory.md` |

### 3. 确认当前状态
- 检查 `git status` 了解未提交的更改
- 检查开发服务器是否运行
- 了解当前分支

---

## 二、代码变更规范

每次代码变更后，Agent 必须:

### 1. 更新 CHANGELOG.md
```markdown
## YYYY-MM-DD

### 功能优化
### Bug 修复
### 新增功能

**文件清单:** 新增/删除/修改的文件列表
**记录时间:** 时间戳
```

### 2. 更新记忆文件
- 记录新的架构决策
- 记录解决方案和调试经验
- 更新已解决的问题列表

---

## 三、版本控制规范

### 提交信息规范
- **语言:** 简体中文
- **格式:** `<类型>: <描述>`
- **类型:**
  - `feat:` - 新增功能
  - `fix:` - 修复 Bug
  - `refactor:` - 重构代码
  - `docs:` - 文档更新
  - `style:` - 样式调整
  - `chore:` - 构建/工具变动

### 示例
```
feat: 责任人字段改为下拉选择
fix: 修复级联筛选问题
docs: 更新 MEMORY.md 和 CHANGELOG.md
```

---

## 四、代码质量要求

### 编码前
- 先阅读相关代码，理解现有实现
- 遵循项目现有代码风格
- 查看记忆文件中的架构决策

### 编码时
- 避免过度设计，保持简洁
- 添加必要的注释(复杂逻辑)

### 编码后
- 检查是否有 lint 错误
- 验证功能是否正常工作
- 更新相关文档
- 提交 Git

---

## 五、项目特定约定

### 技术栈
- Vue 2 + JavaScript
- Element UI 组件库
- Vuex 状态管理
- Vue Router 路由

### 数据加载方式
- 使用全局 `window` 函数回调方式
- 示例：`window.getRespDept((res) => { ... })`

### console.log 规范
```javascript
// 正确格式
console.log('中文提示：', JSON.parse(JSON.stringify(参数)));

// 只在 Vue 组件中打印，不在 config.js 中打印
```

---

**最后更新:** 2026-04-03  
**维护者:** CodeBuddy Code
