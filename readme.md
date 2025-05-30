# Git Commit Smart Assistant

[简体中文](./readme-zh_cn.md)

> An intelligent Git commit message generation tool based on Large Language Models (LLM)

> ⚠️ **Under Development**: This project is actively being developed, configuration standards are not yet finalized and may change.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features ✨

- 🤖 Automatically generates commit messages using LLM
- 🔍 Analyzes git diffs to understand code changes

## Requirements

- TypeScript runtime (e.g. Bun (recommended) or Node.js)
- Git

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/git-commit-for-llm.git
cd git-commit-for-llm

# Install dependencies
pnpm install

# Uh...run? It should work this way, but the experience might not be great
bun run start
```

## Usage

1. Make some code changes
2. Stage the changes (if needed)
3. Run the following command:

```bash
bun start
```

## Configuration

Create a `.env` file in the project root directory and add your LLM API key:

> Currently only DeepSeek is supported, sorry

```env
LLM_TOKEN=your_api_key
```

## How It Works

1. The tool scans changes in your git repository
2. Uses LLM to analyze code differences
3. Generates commit messages following Conventional Commits specification
4. Automatically creates commits using the generated messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
