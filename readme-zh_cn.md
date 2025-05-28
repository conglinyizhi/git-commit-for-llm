# Git Commit 智能提交工具

（其他语言的 readme 基于简体中文版本翻译）

> 基于大语言模型 (LLM) 的智能 Git 提交信息生成工具

> ⚠️ **开发中**：本项目正在积极开发中，配置标准尚未最终确定，可能会发生变化。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 功能特点 ✨

- 🤖 使用大语言模型自动生成提交信息
- 🔍 分析 git 差异以理解代码变更

## 环境要求

- Node.js 18 或更高版本
- Bun 1.0 或更高版本
- Git

## 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/git-commit-for-llm.git
cd git-commit-for-llm

# 安装依赖
pnpm install

# 运行
bun run start
```

## 使用方法

1. 对代码进行一些更改
2. 将更改添加到暂存区（如果需要）
3. 运行以下命令：

```bash
bun start
```

## 配置

在项目根目录创建 `.env` 文件，并添加你的 LLM API 密钥：

> 当前只支持 DeepSeek，抱歉

```env
LLM_TOKEN=你的API密钥
```

## 工作原理

1. 工具会扫描你的 git 仓库中的变更
2. 使用大语言模型分析代码差异
3. 根据分析结果，按照约定式提交规范生成提交信息
4. 自动使用生成的提交信息创建提交

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。
