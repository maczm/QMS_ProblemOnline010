# QMS InspectionOnline — Vue 2 质检巡检在线模块

## 技术栈
- Vue 2 + Element UI + vue-cli
- axios、file-saver、lib-flexible
- JavaScript（非 TypeScript）

## 构建命令
- `npm run serve` — 启动开发服务器
- `npm run build` — 生产构建
- `npm run lint` — ESLint 检查

## 项目说明
质检巡检在线模块，嵌入 Apriso MES 宿主系统运行。
通过 `window` 全局函数与宿主通信，`src/PublicMethods/dbucTrtl.js` 提供公共方法。
