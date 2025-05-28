# Git Commit Smart

> AI-powered Git commit message generation tool using Large Language Models (LLM)

> ⚠️ **Under Development**: This project is actively being developed. Configuration standards are not yet finalized and may change.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features ✨

- 🤖 Automatically generates commit messages using LLM
- 🔍 Analyzes git diffs to understand code changes
- 📝 Supports conventional commit format
- ⚡ Works with both staged and unstaged changes
- 🛠️ Extensible tool system for future enhancements

## Prerequisites

- Node.js 18+
- Bun 1.0+
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/git-commit-for-llm.git
cd git-commit-for-llm

# Install dependencies
bun install

# Build the project (if needed)
bun run start
```

## Usage

1. Make some changes to your code
2. Stage your changes (if needed)
3. Run the following command:

```bash
bun start
```

## Configuration

Create a `.env` file in the root directory with your LLM API key:
(Only support DeepSeek Now.Sorry.)

```env
LLM_TOKEN=your_api_key_here
```

## How It Works

1. The tool scans your git repository for changes
2. It analyzes the diffs using an LLM
3. The LLM suggests a commit message following conventional commit format
4. The commit is automatically created with the suggested message

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
