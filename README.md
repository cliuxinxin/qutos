# 每日名言 - Daily Quotes

一个简洁优雅的静态网站，每次访问或刷新都会显示一条随机的名人名言，为您带来每日的启发与思考。

## 🌟 特性

- **📱 响应式设计** - 完美适配桌面端、平板和手机
- **🎲 随机名言** - 每次刷新获取随机的励志名言
- **🎨 现代化界面** - 渐变背景、毛玻璃效果、优雅动画
- **📋 一键分享** - 支持一键复制名言到剪贴板
- **⌨️ 快捷键支持** - 空格键/回车键换名言，Ctrl+C 复制
- **🚀 纯静态** - 无需服务器，可直接部署到 GitHub Pages

## 📊 数据源

本项目包含超过 **48,000+** 条精选名人名言，涵盖：
- 著名企业家、思想家的励志语录
- 历史名人的智慧箴言
- 现代成功人士的人生感悟
- 各国谚语和格言

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + 原生 JavaScript
- **样式**: CSS Grid/Flexbox + CSS 动画
- **字体**: Google Fonts (Merriweather + Noto Sans SC)
- **数据**: JSON 格式存储
- **部署**: GitHub Pages

## 📦 项目结构

```
qutos/
├── index.html          # 主页面
├── styles.css          # 样式文件  
├── script.js           # JavaScript 功能
├── qutos.json          # 名言数据库
└── README.md           # 项目说明
```

## 🚀 部署到 GitHub Pages

### 方法一：通过 GitHub 网页界面

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Add quotes website"
   git push origin main
   ```

2. **启用 GitHub Pages**
   - 进入您的 GitHub 仓库页面
   - 点击 **Settings** 标签页
   - 在左侧菜单中找到 **Pages**
   - 在 **Source** 部分选择 **Deploy from a branch**
   - **Branch** 选择 `main`
   - **Folder** 选择 `/ (root)`
   - 点击 **Save**

3. **访问网站**
   - 等待 1-2 分钟构建完成
   - 访问 `https://你的用户名.github.io/qutos`

### 方法二：通过 GitHub CLI (推荐)

如果您安装了 GitHub CLI：

```bash
# 创建仓库并推送
gh repo create qutos --public --source=. --remote=origin --push

# 启用 GitHub Pages
gh api repos/:owner/qutos/pages -X POST -f source='{\"branch\":\"main\",\"path\":\"/\"}'
```

## 🎯 使用说明

- **🔄 换一句**: 点击"换一句"按钮、按空格键、回车键，或直接点击名言卡片
- **📋 复制分享**: 点击"复制分享"按钮，或使用 Ctrl+C (Mac: Cmd+C) 快捷键
- **📱 移动端**: 完美支持手机和平板访问

## 🔧 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/你的用户名/qutos.git
   cd qutos
   ```

2. **启动本地服务器**
   ```bash
   # 使用 Python (推荐)
   python -m http.server 8000
   # 或使用 Python 3
   python3 -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   ```

3. **访问网站**
   打开浏览器访问 `http://localhost:8000`

## 🎨 自定义

### 修改样式主题

编辑 `styles.css` 文件中的 CSS 变量：

```css
/* 修改主色调 */
background: linear-gradient(135deg, #你的颜色1 0%, #你的颜色2 100%);

/* 修改字体 */
font-family: '你喜欢的字体', serif;
```

### 添加更多名言

在 `qutos.json` 文件中添加新的名言：

```json
{
  "quotes": [
    {
      "id": 新ID,
      "quote": "您的名言内容",
      "author": "作者名字"
    }
  ]
}
```

## 📝 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ IE 不支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 联系

如果您有任何问题或建议，欢迎通过 GitHub Issues 联系。

---

**⭐ 如果这个项目对您有帮助，请给它一个星标！**