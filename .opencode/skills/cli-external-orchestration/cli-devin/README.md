---
title: cli-devin
description: Cross-AI dispatcher that delegates a task to Cognition's Devin CLI for multi-model coding, subagent delegation, cloud handoff and cross-model validation.
trigger_phrases:
  - "devin"
  - "devin cli"
  - "cognition"
  - "cloud handoff"
  - "subagent delegation"
  - "second opinion"
  - "cross-validate"
version: 1.2.0.0
---

# cli-devin

> Delegates focused tasks to Cognition's Devin CLI: multi-model coding, subagent delegation, cloud handoff and a second opinion, all from inside your current runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Cross-AI delegation: coding, review, research, subagent tasks or cloud handoff through Cognition's Devin CLI, with a second-model opinion on demand |
| **Invoke with** | "devin", "cognition", "cloud handoff", "subagent delegation", "second opinion" or "cross-validate", plus the router intent keywords |
| **Works on** | Any external runtime (Claude Code, Codex, Cursor, OpenCode or raw shell) that can reach the `devin` binary |
| **Produces** | Code edits, structured reviews, subagent task results, cloud sessions with their own VM and web-enriched research |

---

## 2. OVERVIEW

### Why This Skill Exists

A long generation, an independent review, a browser-heavy task or a security audit can drain your context window and bias your own judgment. cli-devin hands such tasks to Cognition's Devin CLI, which runs its own agent in its own context with a model of your choice. The calling AI stays the conductor. The skill exists so a second AI can work on your codebase without you switching runtimes or babysitting a session.

### What It Does

The skill routes a request through the smart router, picks a curated model and a permission mode, then dispatches with `devin -p`. It can delegate to Devin's native subagents through `run_subagent`, move a session to the cloud with `/handoff`, attach MCP servers with `devin mcp add` and continue or resume past sessions with `devin -c` and `devin -r`. Orchestrated dispatches run through the shared deep-loop runtime, which is the single execution adapter for this skill. Direct `devin -p` snippets in this README are operator reference and manual-testing examples. SKILL.md owns the routing contract and the hard rules.

### The Delegation Layer

| Capability | What the skill can operate |
|---|---|
| **Multi-model dispatch** | a curated roster of four families (GLM-5.2, SWE-1.7, Grok 4.5 and DeepSeek V4 Pro) chosen per dispatch with `--model` |
| **Subagent delegation** | read-only and full-access workers through `run_subagent`, plus custom `.devin/agents/<name>/AGENT.md` profiles |
| **Cloud handoff** | a cloud VM with its own shell, browser and repo access via `/handoff` |
| **Session management** | continue and resume workflows with `devin -c` and `devin -r <session-id>` |
| **MCP integration** | external MCP servers attached with `devin mcp add` and listed with `devin mcp list` |

Subagents take a profile, not a model. `subagent_explore` runs on the cheap default and `subagent_general` inherits the parent model. To pin a model on a write-capable subagent, define a custom profile with a `model:` field. The full roster and dispatch shapes live in `references/providers-and-models.md`.

### What This Skill Does Not Own

- It does not replace the calling runtime. The calling AI stays the conductor and verifies every result.
- It does not build a second execution adapter. The shared deep-loop runtime owns process construction. SKILL.md owns routing and prompt construction.
- It never dispatches into a session already running inside Devin. A running CLI skill never dispatches itself.
- It does not own application-code standards. Dispatched sessions load `sk-code` for surface standards and verification.

---

## 3. QUICK START

**Step 1: Confirm the binary and the login.**

```bash
command -v devin
devin auth status
```

`command -v` prints the binary path. `devin auth status` prints the logged-in state. When the login is missing, complete it before dispatching.

**Step 2: Install and authenticate when missing.**

```bash
devin setup
curl -fsSL https://devin.ai/install | bash
devin auth login
devin --version
```

`devin setup` runs the interactive wizard and the one-liner installs without it. `devin auth login` opens the browser OAuth flow. The CLI does not use an API key. Use `--force-manual-token-flow` on SSH-only machines. `devin --version` prints the installed version, for example `3000.2.17`.

**Step 3: Run the default dispatch.**

```bash
devin -p --model swe --permission-mode accept-edits -- "Add input validation to src/utils.ts" 2>&1
```

The default model is `swe` (alias for `swe-1-7-lightning`) and the default permission mode is `accept-edits`. Success looks like the file edited in place plus a text response on stdout. `devin -p` is non-interactive and exits after one turn.

**Step 4: Hand a long-running task to the cloud.**

```bash
devin -- "Fix the flaky integration tests in CI, then run the full suite to confirm"
```

Inside the session, type `/handoff fix the flaky integration tests in CI`. The cloud session gets its own VM with a shell, browser and full repo access. It keeps working after you disconnect. Track it from the terminal or the Devin web app.

---

## 4. HOW IT WORKS

### The Smart Router

The router scores the request against weighted intent signals (generation, review, research, architecture, delegation, handoff, templates, patterns) and loads the matching references. `references/cli-reference.md` and `assets/prompt-quality-card.md` load on every invocation. Two hard rules gate every dispatch: the `command -v devin` availability probe and the self-invocation guard.

### The Dispatch Envelope

A non-interactive dispatch is one command with four load-bearing parts: the model, the permission mode, the `--` separator before the prompt and `2>&1` so errors surface. `devin -p` exits after one turn, so multi-turn work uses `devin -c` or `devin -r <session-id>`. In scripts, pass the model explicitly every time and redirect stdin from `/dev/null` inside loops so the child does not drain the loop's input.

### Permission Modes as the Autonomy Lever

Devin has no headless reasoning-effort flag. Autonomy is set through the permission mode. `devin -p` defaults to `auto`, which is read-only, so file-modification tasks silently prompt or no-op without a higher mode.

| Mode | Flag value | What it approves | Use for |
|---|---|---|---|
| **Auto** | `auto` | read-only tools, prompting for writes and shell commands | review, analysis, research or security work (`devin -p` default) |
| **Accept Edits** | `accept-edits` | workspace edits plus read-only tools, prompting for shell | code generation and refactoring (skill default) |
| **Smart** | `smart` | actions a fast model judges safe | trusted workflows with judgment calls |
| **Dangerous** | `dangerous` | every tool without prompting | full trust, explicit user approval required |

The `--sandbox` flag wraps the session in OS-enforced filesystem and network boundaries. On Linux it needs `devin sandbox setup`, which installs `bwrap` and `socat`. macOS works out of the box.

### The Self-Invocation Guard

The skill refuses to load when the calling session is itself running inside Devin. Detection reads `$DEVIN_PROJECT_DIR` and the process ancestry, then probes for active-session credentials. A circular dispatch burns tokens and never converges, so the refusal is a hard rule.

### Safety Invariants

- Run `command -v devin` before every dispatch and refuse the route when the binary is missing.
- Capture stderr with `2>&1` so rate-limit messages and errors surface.
- Verify Devin output before applying it with syntax checks, lint, type checks or the project test suite.
- Include the active spec folder in the dispatch prompt so the delegated agent skips the interactive gate question.
- Never use `--permission-mode dangerous` without explicit user approval.
- Never send secrets (API keys, passwords, tokens or credentials) inside a dispatch prompt.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Use cli-devin when the task benefits from a second AI perspective: an independent code review, a security audit, a generation pass, parallel research or a long-running task that should keep working after you disconnect. Do not use it for quick tasks the calling agent can finish faster, nor for interactive refinement that needs the full-screen REPL (run `devin` directly instead).

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor` and `cli-pi` | sibling dispatchers in the cli-* family, one dispatch at a time unless the operator authorizes parallel |
| `sk-code` | owns the application-code standards a dispatched session loads for review or generation |
| `system-deep-loop` | owns the shared fan-out runtime that executes orchestrated cli-devin dispatches |
| `sk-prompt` | owns per-model prompt-craft when the target model has a profile |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: devin` | CLI not installed or PATH not updated | Run `devin setup` or the install one-liner, then restart the terminal |
| Auth error on dispatch | Devin account OAuth not configured or expired | Run `devin auth login` (browser flow) or `devin auth login --force-manual-token-flow` on SSH machines |
| Task ran but no files changed | `devin -p` defaults to `auto`, which is read-only | Pass `--permission-mode accept-edits` or higher |
| Delegated agent stalls on a spec-folder prompt | `devin -p` cannot answer interactive questions | Pass the active spec folder with the pre-approved marker, otherwise ask the user before dispatching |
| Self-invocation refused | The calling session is already inside Devin | Use a different runtime or exit the Devin session first |
| Cloud handoff fails | Network issue or uncommitted changes block the transfer | Commit or stash the changes and verify connectivity to `app.devin.ai` |
| Background subagent denied tools | Background workers cannot prompt for new permissions | Pre-approve the tools in the session or resume the subagent in the foreground |
| Slow response | Large context or complex task | Split the task, pin `swe-1-7-lightning` for quick edits, use `auto` for pure analysis or raise the model tier for hard reasoning |
| `--sandbox` not available | Platform prerequisites missing | Run `devin sandbox setup` (Linux needs `bwrap` and `socat`). macOS works out of the box |

Full recovery procedures live in `references/cli-reference.md` and `references/integration-patterns.md`.

---

## 7. FAQ

**Q: When should I dispatch to Devin instead of doing the work myself?**

A: When the task benefits from a second AI perspective or a fresh context window: independent review, generation at scale, subagent research or long-running work. If the calling agent already holds the context and can finish quickly, doing it directly is faster.

**Q: Which model should I pick?**

A: The default `swe` (alias for `swe-1-7-lightning`) balances speed and cost. Use `grok-4-5-high` for reasoning-heavy work, `glm-5-2` for general generation, `swe-1-7` for max-effort SWE work and `swe-1-7-lightning` for quick edits. The curated roster lives in `references/providers-and-models.md` and the full family list is available through `devin models list`.

**Q: Can Devin keep working after I close my laptop?**

A: Yes, with `/handoff`. The session moves to a cloud VM with its own shell and browser plus full repo access. It keeps running after you disconnect. Track it from the terminal or the Devin web app. Hand off only long-running, browser-dependent, CI-like or high-parallelism work.

**Q: Where do dispatch defaults live?**

A: User defaults live in `~/.config/devin/config.json` and project defaults in `.devin/config.json`. Pass `--model` and `--permission-mode` explicitly in scripts so the caller's config cannot change the dispatch.

**Q: Does this skill run Devin directly?**

A: Orchestrated dispatches run through the shared deep-loop runtime (`fanout-run.cjs`, executor kind `cli-devin`), the single execution adapter for this skill. The skill owns routing and prompt construction plus the availability probe. Direct `devin -p` snippets in this README are operator reference and manual-testing examples.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-external-orchestration/cli-devin/README.md --type readme` reports zero issues |
| Voice and punctuation | the em dash, semicolon, Oxford comma and banned-word greps return zero prose matches |
| Manual scenarios | `manual-testing-playbook/manual-testing-playbook.md` runs every dispatch scenario in the catalog |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime router, hard rules and the full rule set |
| [`references/cli-reference.md`](./references/cli-reference.md) | CLI subcommands, flags, permission modes, auth pre-flight and troubleshooting |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | Single-source catalog of the curated model families, aliases and defaults |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | Dispatch shapes and the failure-mode matrix |
| [`references/devin-tools.md`](./references/devin-tools.md) | Built-in capabilities: `run_subagent`, `/handoff`, MCP and session management |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | Subagent profile roster, routing table and custom AGENT.md patterns |
| [`references/cloud-handoff.md`](./references/cloud-handoff.md) | `/handoff` mechanics, use cases and state transfer |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | Fast-path prompt discipline and the CLEAR check |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-paste prompt templates for common tasks |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Devin-native manual validation scenarios |
