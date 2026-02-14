# Ralph Demo - Calculator Project

这是一个使用 Ralph 自主 AI 代理循环开发的演示项目。Ralph 会自动实现 PRD 中定义的所有用户故事。

## 项目简介

本项目实现了一个简单的命令行计算器，支持基本的算术运算（加、减、乘、除）。

## Ralph 环境设置

### 前置要求

1. **安装 Claude Code CLI**（推荐用于此演示）：
```bash
npm install -g @anthropic-ai/claude-code
```

2. **安装 jq**（用于解析 JSON）：
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Arch Linux
sudo pacman -S jq
```

### 运行 Ralph

确保你已经登录 Claude Code：
```bash
claude --auth
```

然后运行 Ralph 循环：
```bash
./scripts/ralph/ralph.sh --tool claude 10
```

这会启动最多 10 次迭代，每次迭代会：
1. 读取 `prd.json` 找到下一个未完成的用户故事
2. 实现该用户故事
3. 运行质量检查（typecheck, test）
4. 提交代码
5. 更新 `prd.json` 标记为已完成
6. 将学习内容追加到 `progress.txt`

## 项目结构

```
.
├── scripts/
│   └── ralph/
│       ├── ralph.sh          # Ralph 主循环脚本
│       └── CLAUDE.md         # Claude Code 的提示词模板
├── prd.json                  # 产品需求文档（PRD）
├── progress.txt              # Ralph 的进度和学习日志
├── package.json              # Node.js 项目配置
├── tsconfig.json             # TypeScript 配置
└── src/                      # 源代码目录（由 Ralph 创建）
```

## 用户故事

项目包含以下用户故事（按优先级排序）：

1. **US-001**: 创建计算器模块和加法函数
2. **US-002**: 添加减法函数
3. **US-003**: 添加乘法函数
4. **US-004**: 添加除法函数（含除零处理）
5. **US-005**: 创建命令行界面

## 手动验证

在 Ralph 运行完成后，你可以手动验证计算器：

```bash
# 构建项目
npm run build

# 运行测试
npm test

# 使用计算器
node dist/cli.js add 5 3        # 输出: 8
node dist/cli.js subtract 10 4   # 输出: 6
node dist/cli.js multiply 3 7    # 输出: 21
node dist/cli.js divide 15 3      # 输出: 5
```

## 工作原理

### Ralph 的核心概念

1. **每次迭代都是全新的上下文**
   - 每次迭代启动一个新的 AI 实例
   - 记忆通过 git 历史和 `progress.txt` 持久化

2. **小任务原则**
   - 每个用户故事应该足够小，可以在一个上下文窗口内完成
   - 避免太大的任务（如"构建整个仪表板"）

3. **反馈循环**
   - Typecheck 捕获类型错误
   - 测试验证行为
   - CI 必须保持绿色

4. **学习记录**
   - Ralph 会将学到的模式记录到 `progress.txt`
   - 更新相关目录的 `CLAUDE.md` 文件
   - 未来迭代可以从这些学习中受益

## 调试

查看当前状态：
```bash
# 查看哪些故事已完成
cat prd.json | jq '.userStories[] | {id, title, passes}'

# 查看之前迭代的学习
cat progress.txt

# 查看 git 历史
git log --oneline -10
```

## 自定义

你可以根据项目需求自定义 `scripts/ralph/CLAUDE.md`：
- 添加项目特定的质量检查命令
- 包含代码库约定
- 添加常见陷阱

## 参考资料

- [Ralph GitHub 仓库](https://github.com/snarktank/ralph)
- [Claude Code 文档](https://claude.com/claude-code)
