以下是 `.opencode/skills/mcp-chrome-devtools/` 的完整事实地图：

---

## 1. 目的

该技能协调两个互补的 Chrome 浏览器调试路径：一个快速的、对 AI token 友好的命令行 (`bdg`) 和一个在 TypeScript 中将浏览器操作与其他工具链接起来的 MCP 后备方案。

## 2. 问题

从 AI 代理或终端驱动浏览器非常消耗 token — Puppeteer 等重型框架将数兆字节的依赖项注入每个自动化工件，而详细输出使 LLM 上下文窗口膨胀，成本高昂。直接的 CDP (Chrome DevTools Protocol) 访问可以解决这个问题，但是在没有自我发现机制的情况下，在 53 个域中硬编码 300 多个方法名会导致脆弱、对版本敏感的脚本。此外，没有单个工具同时擅长快速、低 token 的终端使用，以及在 TypeScript 代码块中与 Figma、日志工具或数据库结合进行浏览器自动化。该技能提供了两种专门的路径，而不是强制采用一种尺寸适应所有的解决方案：一种优先考虑速度和可组合性，另一种优先考虑集成。

## 3. 模式与能力

**两种路径及选择时机：**

| 路径 | 优先顺序 | 时机 |
|---|---|---|
| **bdg CLI** (`browser-debugger-cli@alpha`) | 主要（默认） | 低 token、独立的浏览器任务；发现驱动的工作流程（`--list`/`--describe`/`--search`）；CI/CD 脚本 |
| **Chrome DevTools MCP 通过 Code Mode** | 后备 | `--isolated=true` 下的并行浏览器实例；在单个 `call_tool_chain()` TypeScript 块中与其他 MCP 工具（例如 Figma）链接 |

**路由规则：** 一个意图评分器根据请求中的关键词（CLI、MCP、INSTALL、TROUBLESHOOT、AUTOMATION）以及运行时信号（`command -v bdg` 与 `code_mode_configured`）加权得分。CLI 获胜，如果 `bdg` 可用；如果需要并行实例或多工具链接，MCP 获胜。当得分都在彼此的 1.0 范围内时，出现歧义，将加载两个路径的参考文档。

**具体能力（每条一行）：**

- **截图** — CLI：`bdg dom screenshot <path>`；MCP：`take_screenshot`
- **网络捕获 (HAR)** — CLI：`bdg network har <path>`；MCP：N/A（CDP 方法子集）
- **控制台日志** — CLI：`bdg console --list`；MCP：`list_console_messages`
- **视口调整大小** — CLI：`bdg cdp Emulation.setDeviceMetricsOverride`；MCP：`resize_page`
- **DOM 查询** — CLI：`bdg dom query "<selector>"`；MCP：N/A
- **JavaScript 执行** — CLI：`bdg dom eval "<expression>"`；MCP：`fill`、`click`
- **点击和表单填充** — CLI：原始 CDP `Input.dispatchMouseEvent`；MCP：`click`、`fill`
- **键盘/悬停** — CLI：原始 CDP；MCP：`press_key`、`hover`
- **等待** — CLI：`sleep` / 脚本；MCP：`wait_for`
- **Cookie 管理** — CLI：`bdg network getCookies`、`bdg cdp Network.setCookie`；MCP：N/A
- **页面导航/标签页** — CLI：`bdg <url>`、单会话；MCP：`navigate_page`、`new_page`、`select_page`、`close_page`
- **会话生命周期** — CLI：`bdg status`、`bdg stop` + `trap`；MCP：`try/finally` 包装的 `close_page`
- **CDP 方法发现** — CLI：`bdg cdp --list`、`--describe <Domain>`、`--search <term>`；MCP：`search_tools()`
- **并行实例** — 仅限 MCP，通过注册为 `chrome_devtools_1`、`chrome_devtools_2` 等的独立 `--isolated=true` 服务器

## 4. 调用

**bdg CLI 路径（主要）：**

先决条件：Node.js 18+，Chrome/Chromium/Edge。通过 `command -v bdg` 检查；使用以下命令安装：

```
npm install -g browser-debugger-cli@alpha
```

使用 `bdg --version 2>&1` 进行验证。配置：没有必需的文件。环境变量包括 `CHROME_PATH`（如果 Chrome 未自动检测到）、`CHROME_HEADLESS=true`（CI/无显示器）、`BDG_TIMEOUT`（默认 30000ms）。

关键子命令：`bdg <url>`（启动会话）、`bdg status`、`bdg stop`、`bdg dom screenshot <path>`、`bdg console --list`、`bdg dom query "<selector>"`、`bdg dom eval "<expr>"`、`bdg network har <path>`、`bdg network getCookies`、`bdg cdp --list`、`bdg cdp --describe <Domain>`、`bdg cdp --search <keyword>`、`bdg cdp <Method> '<json>'`。

**MCP 路径（后备）：**

先决条件：Code Mode MCP 服务器已在 `.mcp.json`（Claude Code）或 `opencode.json`（OpenCode）中注册，`.utcp_config.json` 文件中有 Chrome DevTools MCP 条目。通过 `npm` 中的 `chrome-devtools-mcp@latest` 提供 MCP 服务器本身。

工具命名约定：`{manual_name}.{manual_name}_{tool_name}`。例如，`.utcp_config.json` 中名为 `chrome_devtools_1` 的手册会生成 `chrome_devtools_1.chrome_devtools_1_take_screenshot({})`。

调用模式：所有 MCP 浏览器操作都在 `call_tool_chain()` TypeScript 块内运行，包装在 `try/finally` 中以便清理。

安装指南路径：`INSTALL_GUIDE.md` 涵盖了这两种路径。安装脚本：`scripts/install.sh` 自动化 `bdg` CLI 的安装。

## 5. 关键文件

| 文件 | 目的 |
|---|---|
| `SKILL.md` | 权威的技能定义：路由逻辑（完整的 Python 伪代码）、规则（总做/从不做）、意图信号、加载级别、快速参考 |
| `README.md` | 面向用户的指南，内容与 SKILL.md 重叠：概述、功能、结构、配置、使用示例、故障排除、FAQ |
| `INSTALL_GUIDE.md` | 独立的、逐步安装指南（CLI + MCP），带有分阶段验证关卡、安全检查表和独立版本号 (2.1.0) |
| `references/cdp_patterns.md` | CDP 域模式和 Unix 管道示例（727 行） |
| `references/session_management.md` | 会话生命周期、重试逻辑、并发、状态持久性（696 行） |
| `references/troubleshooting.md` | 诊断顺序、错误代码表、平台特定修复（836 行） |
| `examples/README.md` | 关于三个生产示例脚本的指南（377 行） |
| `examples/animation-testing.sh` | CI 脚本：根据阈值断言布局计数、样式重算计数的动画测试 |
| `examples/multi-viewport-test.sh` | CI 脚本：跨 5 个设备配置文件检查控制台错误 |
| `examples/performance-baseline.sh` | CI 脚本：捕获指标、HAR、截图、控制台和 DOM 统计信息的带时间戳的快照 |
| `scripts/install.sh` | 用于检测和安装 `browser-debugger-cli@alpha` 的自动化安装脚本（399 行） |
| `graph-metadata.json` | 机器可读的技能图元数据：边、域、意图信号、派生触发短语 |
| `changelog/v1.0.7.0.md` | 发布说明：从标题中删除装饰性符号 |
| `changelog/v1.0.8.0.md` | 发布说明（比 SKILL.md 声明的版本更新）：澄清主要指南与补充指南 |
| `manual_testing_playbook/` | 7 个子目录（CLI 生命周期、协议发现、DOM/截图、控制台/网络、MCP 并行、恢复）+ 顶级手册 Markdown — 在任何主要的技能文件中都没有记录 |

## 6. 边界

- **不是测试框架：** 该技能没有断言库、POM 模式或视觉回归工具。复杂的 UI 测试套件应使用 Puppeteer 或 Playwright。
- **跨浏览器限制：** 仅限 Chrome、Chromium 和基于 Chromium 的 Edge。不支持 Firefox、Safari、WebKit。如果请求跨浏览器测试（SKILL.md §4 升级条件），则升级。
- **不支持 Windows 原生：** 没有 WSL 的 Windows（带有 Git Bash 的 PowerShell/cmd）是硬性禁止的 — SKILL.md §4 NEVER 规则。
- **MCP 传输不属于该技能：** `call_tool_chain()` 机制、`.utcp_config.json` 解析和 MCP 服务器注册属于兄弟技能 `mcp-code-mode`。此技能仅对 Chrome DevTools MCP **工具名称**和**配置片段**有意见。
- **不自行安装 Chrome：** 该技能需要预先存在的 Chrome/Chromium 安装。它设置 `CHROME_PATH` 但不安装浏览器二进制文件。
- **不对 `assets/` 目录：** 尽管 SKILL.md §2 和 §8 引用了 `assets/` 模板目录，但它并不存在。没有可供加载的基于模板的工件。
- **不管理 Chrome 配置文件或扩展程序：** 没有用于持久配置文件、扩展程序加载或隐身模式的工具。它是原始 CDP 浏览器控制。

## 7. 故障排除和常见问题

**常见的故障模式（从 `references/troubleshooting.md` 和 README §7 中汇总）：**

1. ***未找到 `bdg` 命令*** — 未安装或 `npm` 全局 bin 不在 `$PATH` 中。修复：`npm install -g browser-debugger-cli@alpha`，然后将 `$(npm config get prefix)/bin` 添加到 `$PATH`。
2. ***未找到 Chrome/Chromium 可执行文件*** — Chrome 的自动检测失败。修复：显式设置 `CHROME_PATH` 环境变量。
3. ***另一个会话已处于活动状态*** — 先前的 `bdg` 会话未停止。修复：`bdg stop 2>&1`，或针对僵尸进程的 `kill "$(pgrep -f 'node.*browser-debugger-cli')"`。
4. ***`jq` 解析错误*** — 未捕获的 stderr 污染了 stdout JSON。修复：在所有 `bdg` 命令后追加 `2>&1`。
5. ***方法未找到*** — CDP 方法名称是猜测的，而不是发现的。修复：始终使用 `bdg cdp --search <term>` → `--describe <Method>` → 执行，而不是硬编码方法名称。
6. ***MCP 工具丢失*** — `.utcp_config.json` 缺少 `chrome_devtools` 条目，或会话需要重新启动。
7. ***Linux 命名空间/沙箱错误*** — 需要用户命名空间或沙箱标志。修复：首选 `sudo sysctl -w kernel.unprivileged_userns_clone=1`；最后的手段：`--no-sandbox`。

**用户实际会问的 4 个问题：**

1. “我什么时候应该使用 bdg CLI 而不是 MCP 路径？” → 默认使用 CLI。仅当您已经在 `call_tool_chain()` 块中并且需要与其他 MCP 工具（Figma 等）链接，或者需要并行的独立浏览器实例进行并排比较时，才切换到 MCP。
2. “如何防止浏览器进程在多次脚本运行中累积？” → 在每个 shell 脚本的顶部注册 `trap "bdg stop 2>&1" EXIT INT TERM`。对于 MCP，始终将浏览器调用包装在 `try/finally` 中，并在 `finally` 中调用 `close_page`。
3. “bdg 可以在没有显示器的 Docker/CI 中运行吗？” → 可以。在环境中设置 `CHROME_HEADLESS=true`，并且（仅在 Linux 上）`CHROME_FLAGS="--disable-gpu --disable-dev-shm-usage --remote-debugging-address=127.0.0.1"`。`examples/` 中的三个 shell 脚本就是为此目的而编写的。
4. “为什么我的 CDP 命令失败并显示 '方法未找到'？” → 不要猜测方法名。方法名因 Chrome 版本而异。请改用: `bdg cdp --search <term>` 查找当前名称，`bdg cdp --describe <Method>` 在调用前确认签名。

## 8. 过时的事实

以下是与 `SKILL.md` 相比，当前 `README.md` 中不准确、已更改或令人困惑的内容：

1. **版本已过时。** README（第 37 行）和 SKILL.md（第 5 行）都声明版本 `1.0.7.0`。`changelog/` 目录包含 `v1.0.8.0.md`（日期为 2026-02-20），这意味着当前的技能版本是 `1.0.8.0`。README 的版本落后 1 个版本。

2. **CDP 方法数量 — README 和 INSTALL_GUIDE 之间存在冲突。** README 声称“300 多个 CDP 方法”（第 27、164 行）并且 SKILL.md 同意（第 37、251 行）。`INSTALL_GUIDE.md` 声称“644 CDP 方法”（第 116 行）和“全部 644 个方法”（第 678 行）。这两个数字（~300 对比 644）在没有重新验证的情况下无法调和 — 一个文档是不正确的。UNKNOWN 哪个是正确的。

3. **`INSTALL_GUIDE.md` 中的 CLI 子命令名称与 SKILL.md 和 README 中的名称不同。** INSTALL_GUIDE 使用简化的形式（`bdg screenshot`、`bdg console logs`、`bdg js`、`bdg har export`、`bdg network cookies`），而 SKILL.md 和 README 使用完整的命名空间形式（`bdg dom screenshot`、`bdg console --list`、`bdg dom eval`、`bdg network har`、`bdg network getCookies`）。这是一个事实上的冲突 — 目前尚不清楚简化的形式是否真的有效，或者 INSTALL_GUIDE 是否记录了不存在的别名。UNKNOWN。

4. **`INSTALL_GUIDE.md` 中的 MCP 包版本与 README 中的不同。** README 固定了 `chrome-devtools-mcp@0.26.0`（第 240 行）。INSTALL_GUIDE 使用 `chrome-devtools-mcp@latest`（第 347、367 行）。第一个是具体的、可重现的；第二个是一个移动的目标。

5. **README 中的目录树（§4，第 188-203 行）缺少三个现有条目：** `changelog/`（5 个文件）、`manual_testing_playbook/`（7 个子目录 + 一个顶级 Markdown 文件）和 `graph-metadata.json`。

6. **SKILL.md 引用了不存在的 `assets/` 目录。** SKILL.md §2 伪代码中的 `RESOURCE_BASES` 元组包含 `SKILL_ROOT / "assets"`（第 68 行），并且 §8（第 329 行）指示“在存在时从 `assets/` 加载模板”。磁盘上不存在 `assets/` 目录。如果 SKILL.md 是规范性的，那么 README 中列出的结构中不应该出现它，但 README 的目录树中也没有提到 `assets/` — 因此 README 正确省略了它，而 SKILL.md 则错误地引用了它。
