# 刷题仔

本地刷题工具。导入题库 JSON 后，可做顺序练习、随机练习、分类练习、背题、模拟考试，带错题本与统计。

题库与学习记录全部存在浏览器本地（IndexedDB），不上传任何服务器。

## 这是什么

一个 PWA（渐进式网页应用），6 个文件，纯静态，无后端、无数据库、无外链。

## 部署

任选一种静态托管，把本目录全部文件放到**根目录**即可。

### GitHub Pages

1. 新建一个 public 仓库
2. 上传本目录的 6 个文件到仓库根目录
3. Settings → Pages → Source 选 `Deploy from a branch`，分支 `main`，目录 `/ (root)`
4. 等一两分钟，访问 `https://<用户名>.github.io/<仓库名>/`

### Cloudflare Pages

1. 新建项目 → 直接上传（Direct Upload）
2. 把本目录拖进去
3. 得到 `https://<项目名>.pages.dev`

## 装到手机主屏

必须通过 https 访问（`file://` 打不开，Service Worker 也注册不了）。

- **iPhone Safari**：分享按钮 → 添加到主屏幕
- **安卓 Chrome**：菜单 → 添加到主屏幕

装好后有独立图标、全屏无地址栏，打开过一次之后断网也能用。

## 首次使用

点「导入题库」，选一个符合格式的 JSON 文件。格式说明见转换器项目里的 `tools/schema.md`。

导入只做一次，之后题库存在手机本地。

## 更新

替换 `index.html` 后，把 `sw.js` 里的 `VERSION` 加一（例如 `v1.1.0` → `v1.1.1`），已安装的旧版本才会清掉缓存、拿到新版。

## 兼容性

- 需要支持 IndexedDB 的现代浏览器（Safari 12+ / Chrome 70+）
- Service Worker 与「添加到主屏幕」需要 https 或 localhost
