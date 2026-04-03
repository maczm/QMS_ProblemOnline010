# QMS_ProblemOnline010 项目记忆

> 本文档为项目公共记忆文件，供所有 AI 工具共享使用。

## 项目概述
Vue 2 + Element UI 的质量管理系统问题在线模块，用于移动端质检问题管理。

## 技术栈
- Vue 2.6.14
- Vue Router 3.5.1
- Vuex 3.6.2
- Element UI 2.15.14
- Axios (HTTP 请求)
- XLSX (Excel 处理)

## 开发命令
```bash
npm run serve   # 启动开发服务器
npm run build   # 构建生产版本
npm run lint    # 运行代码检查
```

## 关键文件路径

### 页面组件
- `src/views/Home/index.vue` - 主页面组件（核心）

### API 层
- `public/js/config.js` - API 接口模拟文件（核心）

### 配置文件
- `vue.config.js` - Vue CLI 配置
- `babel.config.js` - Babel 配置
- `jsconfig.json` - JS 项目配置

## 架构决策

### 数据加载方式
- 使用全局 `window` 函数回调方式加载数据，而非传统的 Axios/Fetch
- 示例：`window.getRespDept((res) => { ... })`

### console.log 规范
- 格式：`console.log('中文提示：', JSON.parse(JSON.stringify(参数)))`
- 只保留接口请求参数和返回结果打印
- 删除调试用 console.log
- 接口打印统一放在 Vue 组件中，不在 config.js 中打印

### 级联选择方案
- 页面加载时一次性加载全部数据（部门、班组、责任人）
- 前端根据选择筛选选项，避免多次请求

## 数据结构

### 责任部门
```javascript
respDeptOptions: [
  { value: "部门1", label: "部门1" }
]
```

### 责任班组
```javascript
respTeamOptions: [
  { value: "班组1", label: "班组1", dept: "部门1" }  // dept 关联部门
]
```

### 责任人
```javascript
respEmployeeOptions: [
  { value: "员工1", label: "员工1", team: "班组1" }  // team 关联班组
]
```

## 已完成的优化

### 2026-04-03
1. **责任人字段改为下拉选择** - 由 input 改为 select，实现部门→班组→责任人三级级联筛选
2. **规范 console.log 打印** - 统一格式，只保留接口请求/返回打印，删除调试日志

---

**最后更新:** 2026-04-03
**维护者:** CodeBuddy Code
