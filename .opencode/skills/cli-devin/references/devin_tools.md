---
title: "Devin CLI — Unique Capabilities + Cross-CLI Comparison"
description: "Devin-specific capabilities (cloud handoff, four-model preset, ACP, MCP, rules/skills) with the cross-CLI comparison table cli-codex / cli-claude-code / cli-gemini / cli-opencode."
---

# Devin CLI — Unique Capabilities + Cross-CLI Comparison

What sets Devin apart in the cli-* family, and the comparison table the calling AI uses to decide which sibling to dispatch.

---

## 1. OVERVIEW

This reference documents the Devin-specific capabilities that distinguish cli-devin from its four sibling cli-* skills. Section 2 enumerates Devin-unique features (local-to-cloud handoff, four-model preset, two-tier permission modes, `devin acp`, `devin mcp`, rules + skills, slash commands). Section 3 provides the cross-CLI comparison matrix. Section 4 maps task types to the right cli-* skill. Section 5 details permission-mode mappings vs the family. Section 6 lists current limitations. Section 7 links related resources.

---

## 2. UNIQUE CAPABILITIES

### 2.1 Local-to-Cloud Handoff (the headline)

Devin can migrate a live local session to a Cognition-hosted cloud VM that keeps working asynchronously after the operator closes the laptop and returns a PR. **No other family member has this.** See [cloud_handoff.md](./cloud_handoff.md).

| Property | Value |
|----------|-------|
| Initiated by | Operator, from inside the live `devin` TUI |
| Approval gate | Required at the cli-devin layer (operator confirmation in same turn) |
| Return artifact | PR URL + summary |
| Async | Yes — cloud session runs after the local one ends |
| Cost | Consumes Devin units; requires provisioned account |

### 2.2 Four-Model Preset (SWE-1.6 default + DeepSeek v4 primary for complex + GLM 5.1 / Kimi k2.6 fallbacks)

Devin ships a single binary fronting four frontier models. The calling AI selects per dispatch via `--model <id>` or mid-session via `/model <name>`.

| Model | Best For |
|-------|----------|
| **Cognition SWE-1.6** ★ default | Context gathering, tool use, simple-to-medium well-defined code tasks |
| **DeepSeek v4** | **Primary for complex tasks** (ambiguous, multi-step, reasoning-bound, large refactors) |
| **GLM 5.1** | Complex-task **fallback** (agentic / tool-use, MCP chains) |
| **Kimi k2.6** | Complex-task **fallback** (large-context shape) |

### 2.3 Permission Modes (two-tier risk taxonomy)

Devin's `--permission-mode` enumeration has two values that map cleanly to the family's risk taxonomy. (Defense in depth: layer `--sandbox` on top of `--permission-mode dangerous` for OS-level enforcement — see §2.8.)

| Mode | Behavior | Family Analog |
|------|----------|---------------|
| `auto` (default) | Auto-approves read-only tools; prompts on write / exec actions | Codex `--ask-for-approval on-request` / `--sandbox workspace-write` |
| `dangerous` | Auto-approves all tools; no prompts. Operator approval REQUIRED | Codex `--full-auto` / `--sandbox danger-full-access` / `--dangerously-skip-permissions` |

### 2.3a `--sandbox` Flag (OS-level process sandboxing, Research Preview)

Layered on top of `--permission-mode`. macOS seatbelt / Linux bwrap+seccomp enforce the active Read/Write permission scopes at the OS level. The strongest configuration for destructive automation: `--permission-mode dangerous --sandbox`.

### 2.4 `devin acp` (Agent Client Protocol server)

Devin can run as an ACP server, embeddable in ACP-aware clients. cli-opencode has a similar `acp` mode; the distinction is that Devin's ACP server fronts Devin's full autonomous loop rather than a single one-shot dispatch.

### 2.5 `devin mcp` (MCP server management)

`devin mcp {add, list, login}` — same MCP-server-management surface as `codex mcp`. OAuth login via `devin mcp login <name>` is convenient when integrating with services that require OAuth.

### 2.6 `devin rules` + `devin skills`

Profile-scoped behavioral surfaces:
- **Rules** — persistent behavioral constraints loaded automatically per session
- **Skills** — reusable routines the Devin agent loop can invoke

Cross-CLI analogs:
- cli-claude-code: skills + agents
- cli-codex: profiles (`-p <name>`)
- cli-opencode: agents (`--agent <slug>`)
- cli-gemini: GEMINI.md project context

### 2.7 Slash Commands (12)

Inside the interactive TUI:
- **Mode**: `/mode`, `/plan` (read-only)
- **Conversation**: `/clear`, `/fork [step]`, `/revert <step>`, `/steps`
- **Utility**: `/ask <q>`, `/model [name]`, `/context`, `/help`

`/fork` and `/revert` are the family's most fine-grained history surface — comparable to `git rebase -i` for conversation state.

---

## 3. CROSS-CLI COMPARISON

How Devin compares to the four siblings on the dimensions that drive cli-* routing decisions.

| Capability | cli-claude-code | cli-codex | cli-gemini | cli-opencode | cli-devin |
|------------|-----------------|-----------|------------|--------------|-----------|
| **Default model** | Sonnet 4.6 | GPT-5.5 medium fast | Gemini 2.5 Pro | opencode-go/deepseek-v4 | SWE-1.6 normal |
| **Multi-model preset in one binary** | No | No | No | Many via provider gateway | Yes (4 frontier models: SWE-1.6 default + DeepSeek v4 + GLM 5.1 + Kimi k2.6) |
| **Web search** | No | `--search` live | Google Search | Via plugins | No |
| **Code review** | Agent-based | `/review` diff-aware | Manual prompt | `@review` agent | Built-in agent loop |
| **Sandbox / permission control** | Permission modes | 3 sandbox modes + approval policies | `--yolo` flag | Permission system | 2 permission modes (`auto`/`dangerous`) |
| **Image input** | No | `--image` | No | No | No |
| **Session resume** | Continue / resume | Resume / fork / history | Memory tool | `--continue` / `-s <id>` / `--fork` / share URL | `--continue` / `--resume <id>` / `list` |
| **Cloud execution** | No | `codex cloud` (remote task exec) | No | Via `--attach <url>` to remote server | **Async cloud handoff with PR return** |
| **MCP support** | Native | `codex mcp` | No | Native | `devin mcp` + OAuth |
| **ACP server** | No | No | No | `acp` mode | `devin acp` |
| **Profile / agent / skill surface** | Skills + agents | `-p <profile>` | GEMINI.md | `--agent <slug>` | Rules + skills + MCP (profile-scoped) |
| **JSON output** | No | Capture last message `-o file.txt` | `-o json` flag | `--format json` event stream | **UNVERIFIED** (claimed by web search, not in official docs) |
| **Cross-repo dispatch** | No | No | No | `--dir <path>` | No |
| **Hooks** | Settings-based | Native hooks via `~/.codex/hooks.json` | No | Plugin system | Yes — Claude-Code-compatible hooks via `.devin/hooks.v1.json` (see <https://cli.devin.ai/docs/extensibility/hooks/overview>) |
| **Self-invocation guard** | Yes | Yes | Yes | Yes (ADR-001 layered detection) | Yes (DEVIN_* env + ancestry + lockfile speculation) |
| **Family stdin-redirect convention** | Standard | Standard (per memory) | Standard | Standard (`</dev/null` required) | Standard (`</dev/null` required) |

---

## 4. WHEN TO PICK CLI-DEVIN OVER A SIBLING

| Task | Pick | Why |
|------|------|-----|
| Context gathering, tool use, simple-to-medium well-defined code task | cli-devin (SWE-1.6 default) | SWE-1.6 is the right shape for clearly-defined work inside the Devin agent loop |
| Complex task (ambiguous / multi-step / reasoning-bound) | cli-devin (DeepSeek v4) | DeepSeek v4 is the documented primary for complex work in cli-devin |
| Complex task that didn't fit DeepSeek v4 (agentic / MCP-heavy) | cli-devin (GLM 5.1 fallback) | GLM 5.1 is the documented complex-task fallback for agentic / tool-use shape |
| Complex task that didn't fit DeepSeek v4 (large context) | cli-devin (Kimi k2.6 fallback) | Kimi k2.6 is the documented complex-task fallback for large-context shape |
| Long-running work, operator stepping away | cli-devin (cloud handoff) | Only family member with async cloud-VM handoff |
| Pure one-shot code generation with GPT-5.5 | cli-codex | Devin does not include GPT-5.5 in its model preset; cli-codex owns OpenAI-backed dispatch |
| Web research (live browsing) | cli-codex (`--search`) or cli-gemini (Google Search) | Devin does not have a web-search flag |
| Full plugin/skill/MCP/Spec-Kit-Memory runtime | cli-opencode | OpenCode is the runtime-bridge skill |
| Image input | cli-codex (`--image`) | Devin does not have image input |
| Cross-repo dispatch | cli-opencode (`--dir`) | Only OpenCode has explicit cross-repo flag |

---

## 5. PERMISSION MODES VS FAMILY

Detailed mapping for callers composing dispatches.

| Devin Mode | cli-codex Equivalent | cli-claude-code | cli-opencode | Notes |
|------------|----------------------|-----------------|--------------|-------|
| `auto` | `--ask-for-approval on-request` (or default `untrusted`) + `--sandbox workspace-write` | Permission mode default | Permission system default | Pauses for confirmation on destructive ops |
| `dangerous` | `--full-auto` / `--sandbox danger-full-access` + `--ask-for-approval never` | `--dangerously-skip-permissions` | `--dangerously-skip-permissions` | Auto-approves all actions; no prompts; explicit operator approval REQUIRED |

When mapping across CLIs, choose the LOWEST permission tier that still completes the task. Never escalate silently — record operator approval in the dispatch log.

---

## 6. LIMITATIONS

- No web search (use cli-codex `--search` or cli-gemini Google Search).
- No image input (use cli-codex `--image`).
- No `--reasoning-effort` flag (model choice is the lever).
- `--json` flag unverified (treat output as free-form unless empirically confirmed).
- Session-state directory layout not publicly documented; self-invocation guard's lockfile probe is speculative.
- Cloud handoff is operator-initiated from the TUI, not via a one-shot flag; the calling AI cannot fully automate it.

---

## 7. RELATED RESOURCES

- [SKILL.md](../SKILL.md)
- [cli_reference.md](./cli_reference.md)
- [integration_patterns.md](./integration_patterns.md)
- [agent_delegation.md](./agent_delegation.md)
- [cloud_handoff.md](./cloud_handoff.md)
