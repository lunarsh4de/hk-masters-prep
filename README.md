# 港硕行前备忘录

一个无需后端的可编辑行前清单，可直接部署到 GitHub Pages。

## 功能

- 勾选进度、关键待办统计和出发倒计时
- 增删改分类与事项，支持分类排序和拖动事项
- 搜索、状态筛选、单/双列和紧凑视图
- 私人备注自动保存在浏览器本地
- JSON 导出与导入，方便跨设备备份
- 通过系统分享菜单发送完整清单到苹果备忘录，或复制为文本
- 灰色可选建议，可按个人情况一键加入清单
- 香港入境处、海关、金管局等官方攻略入口及小红书经验搜索
- 打印清单和复制进度摘要

## 本地打开

直接打开 `index.html` 即可使用。为获得与 GitHub Pages 一致的效果，也可以启动静态服务器：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 部署到 GitHub Pages

推送到 GitHub 后：

1. 在仓库的 `Settings > Pages` 中，将 `Source` 设为 `Deploy from a branch`。
2. 选择 `main` 分支和根目录 `/ (root)`，然后保存。
3. 等待部署完成后，访问 Pages 页面显示的网址。

## 数据说明

清单和备注默认保存在浏览器的 `localStorage` 中，不会自动上传到 GitHub。换浏览器或清理网站数据前，请从更多菜单选择“导出备份”，之后可通过“导入备份”恢复。

封面照片由 [Luise and Nic](https://unsplash.com/photos/epaE0jEOc0Y) 拍摄，来源于 Unsplash。
