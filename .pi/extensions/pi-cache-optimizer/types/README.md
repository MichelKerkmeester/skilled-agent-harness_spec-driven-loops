# Pi Cache Optimizer Type Declarations

---

## 1. OVERVIEW

Ambient TypeScript declaration files (`.d.ts`) that provide type coverage for Node.js built-in modules and the `@earendil-works/pi-coding-agent` package when the extension is compiled or type-checked outside its full Pi runtime environment.

---

## 2. KEY FILES

| File | Role |
| --- | --- |
| `node-shims.d.ts` | Ambient declarations for `node:crypto` (`createHash`), `node:fs/promises` (`mkdir`, `readFile`, `writeFile`, `rename`, `unlink`, `copyFile`), `node:os` (`homedir`), `node:path` (`dirname`, `join`), and the global `process` object (`env`, `platform`, `pid`). |
| `pi-coding-agent.d.ts` | Ambient declarations for `@earendil-works/pi-coding-agent`. Exports `getAgentDir`, `BuildSystemPromptOptions`, `ExtensionModel`, `ExtensionContext`, `CommandContext`, and `ExtensionAPI` with typed `on()` overloads for all six lifecycle events (`session_start`, `session_shutdown`, `model_select`, `before_agent_start`, `before_provider_request`, `after_provider_response`, `message_end`) and `registerCommand`. |

---

## 3. RELATED

- [pi-cache-optimizer README](../README.md)
- [Changes from Upstream](../CHANGES-FROM-UPSTREAM.md)
