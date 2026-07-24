---
title: cli-cursor
description: Cross-AI dispatcher that delegates a task to Cursor's terminal coding agent (cursor-agent) for sandboxed coding, Composer-model dispatch, read-only plan/ask exploration, and a second-model opinion.
trigger_phrases:
  - "cursor"
  - "cursor cli"
  - "cursor agent"
  - "composer"
  - "delegate to cursor"
  - "second opinion"
version: 1.0.0.0
---

# cli-cursor

> Dispatch a task to Cursor's `cursor-agent` CLI and get back sandboxed code generation, Composer-model output or a read-only plan/ask exploration, without leaving your current runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Sandboxed coding, Composer-model dispatch, read-only plan/ask exploration, and cross-model validation through Cursor's `cursor-agent` CLI |
| **Invoke with** | "cursor", "cursor agent", "composer", "second opinion" or auto-routing on Cursor keywords |
| **Works on** | Any external runtime (Claude Code, Codex, raw shell) that needs to reach the `cursor-agent` binary |
| **Produces** | Code edits in a workspace, text responses, and read-only plan/ask analyses |

---

## 2. OVERVIEW

### Why This Skill Exists

A non-Cursor assistant has no built-in way to reach the `cursor-agent` binary. When a task wants Cursor's own model (Composer), a read-only plan/ask pass, or a second AI opinion, the caller either hand-builds fragile `cursor-agent -p` invocations and picks flags by trial, or skips the capability. The worst trap: `cursor-agent -p` exits `0` even when the account isn't authenticated, so a naive exit-code check reports success on a dispatch that never reached a model. Cursor also shares its entire config surface (`hooks.json`, `mcp.json`, rules) with the Cursor editor, so a dispatched CLI session silently inherits the operator's editor-level configuration unless that's understood up front. If the calling assistant is itself `cursor-agent`, a circular self-dispatch burns tokens for no value. This skill standardizes the dispatch, runs a text-based auth pre-flight and guards against self-invocation, so the caller never builds its own CLI wrapper.

### What It Does

cli-cursor is the single routing point for external runtimes that need Cursor CLI. A smart router scores the task against intent signals (code generation, review, Composer dispatch, read-only plan/ask, agent delegation) and loads only the references that match. It fails closed when `command -v cursor-agent` cannot resolve the binary, and a self-invocation guard — built from live-confirmed `CURSOR_AGENT`/`CURSOR_CONVERSATION_ID` env signals plus process-ancestry — refuses to load if the caller is already inside Cursor CLI. Orchestrated execution delegates to the shipped deep-loop runtime; this packet does not build a second adapter.

It does not write application code or manage spec folders. `sk-code` owns code standards and tests. `system-spec-kit` owns spec folders, memory and continuity. cli-cursor dispatches to Cursor and hands the result back to the caller.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v cursor-agent
```

If nothing prints, install it with `curl https://cursor.com/install -fsS | bash`.

**Step 2: Run the default dispatch.**

```bash
cursor-agent -p "Add input validation to src/utils.ts" \
  --output-format text \
  --model auto \
  --auto-review \
  --sandbox enabled \
  2>&1
```

You get the file edited in place inside your workspace. For a read-only task like exploration or Q&A, use `--mode plan` or `--mode ask` instead.

**Step 3: Reach for Composer when the task wants Cursor's own model.**

```bash
cursor-agent -p "Review this diff for correctness" \
  --output-format text \
  --model composer-2.5 \
  --sandbox enabled \
  2>&1
```

You get a response from Cursor's own native model rather than a hosted frontier provider.

**Step 4: Run a read-only exploration pass.**

```bash
cursor-agent -p "Explain how the auth flow works in this repo" \
  --mode ask \
  --model auto \
  2>&1
```

You get an analysis with no file writes — `--mode ask`/`--mode plan` are read-only regardless of approval flags.

---

## 4. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI composes a prompt with the right model and approval mode. The shared deep-loop runtime constructs and runs the `cursor-agent` process, Cursor returns the result, and the caller validates and integrates it. The packet owns routing and availability checks; `system-deep-loop/runtime/scripts/fanout-run.cjs` owns execution.

### The Two Silent Traps

Two Cursor CLI behaviors punish operators who do not know them. A reader who learns them here never hits them.

**Trap 1: the always-zero exit code.** `cursor-agent -p` returns exit code `0` even when the account is not authenticated — it prints `Error: Authentication required...` to output instead of failing the process. A naive `if [ $? -eq 0 ]` check reports success on a dispatch that never reached a model. Always inspect output text for an authentication error, never trust the exit code alone.

**Trap 2: the shared editor config surface.** Unlike sibling CLIs with a tool-private config directory, Cursor CLI reads the exact same `.cursor/`/`~/.cursor/` files as the Cursor editor — `hooks.json`, `mcp.json`, `rules/`. A dispatched `cursor-agent` silently inherits whatever hooks, MCP servers, and rules the operator's editor already has configured, which can surprise an orchestrator expecting a clean, isolated session. See `references/shared-editor-config.md`.

### The Self-Invocation Guard

If the agent reading this skill is itself running inside Cursor CLI, the skill refuses to load. The guard checks three layers in order:

1. `CURSOR_AGENT=1`, set unconditionally whenever the current process runs under `cursor-agent` (confirmed live), or `CURSOR_CONVERSATION_ID` (the confirmed session-id marker).
2. Process ancestry, where a `cursor-agent` parent in the tree trips the guard — matched against the canonical binary name, never the `agent` alias.
3. A best-effort session probe in place of a lock file, since no lock-file convention is documented for Cursor CLI (weaker than the sibling packets' third layer, and documented as such).

When any layer matches, the skill returns a refusal and loads nothing. The cli-X family exists for cross-AI delegation. A running CLI skill never dispatches itself.

### Model Selection And Execution Modes

`auto` (Cursor's own router) is the skill default. **Composer** (`composer-2.5` / `composer-2.5-fast`) is Cursor's own native model — reach for it when the task specifically wants Cursor's house model rather than a hosted frontier provider. Effort tiers are baked directly into a model's id (`gpt-5.2-high`, `claude-opus-4-8-xhigh`) — there is no `--reasoning-effort` flag and the parameterized `model[effort=...]` bracket some sibling CLIs support is rejected outright by Cursor CLI.

Three execution modes govern how a dispatch behaves: the default agent mode (reads and writes, gated by approval flags), `--mode plan` (read-only planning), and `--mode ask` (read-only Q&A). Approval is a separate axis from the sandbox: `--auto-review` ("Smart Auto") auto-runs safe actions and prompts for the rest; `--force`/`--yolo` ("Run Everything") never prompts; omitting both leaves Cursor's own default prompt-and-block behavior in place, which cannot proceed unattended.

### Auth Pre-Flight And Memory Handback

cli-cursor authenticates through Cursor account OAuth (`cursor-agent login`) or headless `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`. Before the first dispatch the skill checks `cursor-agent about` for "Not logged in" in the output text; if found, it surfaces `cursor-agent login` and waits rather than dispatching. When the caller needs to keep a Cursor session's context, a 7-step Memory Handback extracts it and persists it through `generate-context.js` (full procedure in `system-spec-kit/references/cli/memory-handback.md`).

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-cursor when a task benefits from Cursor's own Composer model, a read-only `--mode plan`/`--mode ask` pass, or a second-AI opinion on code quality. Skip it for simple tasks the caller can answer directly, for interactive terminal work (use `cursor-agent` directly) and for deep extended-thinking analysis where a sibling CLI already covers that need better.

### Sibling Boundaries

The cli-X skills each dispatch to a different provider and never overlap.

| Skill | Provider | When to reach for it |
|---|---|---|
| `cli-cursor` | Cursor (Composer + hosted frontier roster) | Composer-model dispatch, read-only plan/ask exploration, native worktree/cloud-worker escape hatches |
| `cli-codex` | OpenAI | Sandboxed coding, repo analysis, PR review, web research |
| `cli-claude-code` | Anthropic | Deep reasoning, diff-based edits, `--json-schema` output, agent delegation |
| `cli-opencode` | OpenCode | Full OpenCode runtime dispatch, in-OpenCode parallel sessions |

If you are already inside one runtime, the matching cli-X skill refuses to load. Use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-cursor dispatches the work, sk-code governs the quality of what comes back. |
| `system-spec-kit` | Owns spec folders, memory and continuity. The Memory Handback bridges a Cursor session back into the caller's spec folder. |
| `sk-prompt/prompt-models` | Owns per-model prompt-craft profiles. Consult it before composing a prompt for a profiled model. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: cursor-agent` | CLI not installed or PATH not updated | `curl https://cursor.com/install -fsS \| bash`, then restart your terminal |
| Output contains `Error: Authentication required` (exit code still `0`) | Not logged in, or headless auth env vars unset | Run `cursor-agent login`, or set `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN` |
| Task ran but no files changed | `--mode plan`/`--mode ask` was used, or neither `--auto-review` nor `--force` was passed | Use the default agent mode with `--auto-review` or `--force` for edit tasks |
| `Cannot use this model: <id>[effort=...]` | Parameterized model bracket syntax, not supported by Cursor CLI | Use an exact enumerated id instead (e.g. `gpt-5.2-high`, from `cursor-agent --list-models`) |
| `Self-invocation refused` | The caller is already inside Cursor CLI (`CURSOR_AGENT`/`CURSOR_CONVERSATION_ID` set, or `cursor-agent` ancestry) | Use a different runtime or exit the current Cursor session first |
| Dispatch behaves differently than expected, or an unexpected hook fires | Cursor CLI shares config with the editor (`hooks.json`/`mcp.json`/`rules/`) | Read `references/shared-editor-config.md`; consider a workspace-isolation flag |
| `Workspace Trust Required` | Cursor CLI does not trust the target directory yet | Pass `--trust` (or `--force`/`--yolo`) for a directory you control |

---

## 7. FAQ

**Q: Why not just call `cursor-agent -p` directly from my shell?**

A: You can. This skill exists for when an external AI assistant (Claude Code, Codex) needs to dispatch to Cursor programmatically. It handles model selection, approval mapping, auth pre-flight and the self-invocation guard so the calling AI does not have to.

**Q: When do I pick Composer over a hosted frontier model?**

A: Pick `composer-2.5`/`composer-2.5-fast` when the task specifically wants Cursor's own house model. Pick a hosted-frontier id (`gpt-5.2-high`, `claude-opus-4-8-xhigh`, etc.) when the task wants a specific provider's model at a specific effort tier, dispatched through Cursor's roster.

**Q: The task ran but nothing changed. What happened?**

A: Either the dispatch used `--mode plan`/`--mode ask` (both read-only regardless of approval flags), or neither `--auto-review` nor `--force` was passed, leaving Cursor's own prompt-and-block default in place with nothing to answer the prompt unattended.

**Q: Does Cursor CLI use a `--reasoning-effort` flag like some sibling CLIs?**

A: No. Effort tiers are baked into the model id itself (`gpt-5.2-high`, `claude-opus-4-8-xhigh`), and the parameterized `model[effort=...]` bracket syntax is rejected outright by the CLI — confirmed live, not assumed from documentation.

**Q: When do I pick Cursor over Codex or Claude Code?**

A: Reach for Cursor when the task specifically wants Composer, a read-only plan/ask pass, or Cursor's unique worktree/cloud-worker surfaces. Reach for Codex for OpenAI-backed sandboxed coding and web research, or Claude Code for deep extended thinking.

---

## 8. VERIFICATION

The skill ships a manual testing playbook with per-feature scenarios (authored in a later phase of the same creation packet).

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-external-orchestration/cli-cursor/README.md --type readme` reports zero issues |
| Default dispatch | `cursor-agent -p "Say hello" --model auto --output-format text --sandbox enabled` returns a greeting |
| Auth pre-flight | `cursor-agent about` output text does not contain "Not logged in" |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/cli-reference.md`](./references/cli-reference.md) | Complete CLI subcommands, flags, auth and troubleshooting reference |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | Cross-AI orchestration patterns and workflows |
| [`references/cursor-tools.md`](./references/cursor-tools.md) | Cursor-unique surfaces: native worktree, cloud worker, plugin marketplace, MCP |
| [`references/hook-contract.md`](./references/hook-contract.md) | Cursor's shared hooks.json contract |
| [`references/shared-editor-config.md`](./references/shared-editor-config.md) | The shared `.cursor/`/`~/.cursor/` editor-config surface |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | Execution-mode roster and delegation patterns |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | Fast-path prompt discipline and the CLEAR check |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-paste prompt templates for common tasks |
