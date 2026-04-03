# 项目改动记录

---

## 2026-04-03

### 功能优化

#### 1. 责任人字段改为下拉选择
**需求：** 将责任人由 input 修改为 select 下拉选择

**改动：**
- 主页责任人字段：`el-input` → `el-select`（disabled 状态）
- Dialog 编辑框责任人字段：`el-input` → `el-select`（可编辑）
- 实现部门→班组→责任人三级级联筛选

**实现方案：**
- 页面挂载时一次性加载全部数据（部门、班组、责任人）
- 前端根据选择筛选选项
- Dialog 打开时根据已有数据初始化筛选选项

**新增数据属性：**
- `respEmployeeOptions` - 全部责任人
- `dialogRespTeamOptions` - dialog 班组（根据部门筛选）
- `dialogRespEmployeeOptions` - dialog 责任人（根据班组筛选）

**新增方法：**
- `onRespDeptChange(dept)` - 部门变化时筛选班组
- 修改 `onRespTeamChange()` - 班组变化时筛选责任人
- 修改 `handleOpenDialog()` - 打开 dialog 时初始化筛选选项

---

#### 2. 规范 console.log 打印
**需求：** 统一 console.log 格式，只保留接口请求/返回打印

**改动：**
- 统一格式：`console.log('中文提示：', JSON.parse(JSON.stringify(参数)))`
- 删除所有调试用 console.log（8处）
- 将 config.js 中的打印迁移至 Vue 组件
- 补充缺少的接口返回打印

**保留的打印（13处）：**
| 位置 | 内容 | 类型 |
|------|------|------|
| 715 | 获取责任部门返回 | 接口返回 |
| 831 | 保存问题项参数 | 请求参数 |
| 833 | 保存问题项返回 | 接口返回 |
| 931 | 推送飞书参数 | 请求参数 |
| 933 | 推送飞书返回 | 接口返回 |
| 997 | 检验项查询参数 | 请求参数 |
| 999 | 查询检验项返回 | 接口返回 |
| 1134 | 添加问题参数 | 请求参数 |
| 1136 | 添加问题返回 | 接口返回 |
| 1176 | 删除问题参数 | 请求参数 |
| 1178 | 删除问题返回 | 接口返回 |
| 1586 | 同步工位参数 | 请求参数 |
| 1590 | 同步工位返回 | 接口返回 |

---

### 修改的文件清单

### 新增（2 个）
1. `MEMORY.md` - 项目记忆文件
2. `AGENT.md` - AI 工作规范

### 修改（2 个）
1. `src/views/Home/index.vue` - 责任人下拉、级联筛选、console.log 规范
2. `public/js/config.js` - 删除 console.log

---

### Git 提交记录
```
527af4a feat: 优化责任人选填和console.log打印
```

---

**记录时间：** 2026-04-03  
**记录人：** CodeBuddy Code
