---
title: cli-cursor
description: "Safe cross-AI dispatch into Cursor: sandboxed coding, Composer-model work, read-only plan or ask exploration and second-model opinions, all delivered through the `cursor-agent` CLI without leaving the calling runtime."
trigger_phrases:
  - "cursor"
  - "cursor cli"
  - "cursor agent"
  - "composer"
  - "delegate to cursor"
  - "second opinion"
version: 1.4.8.0
---

# cli-cursor

> Hand a coding or analysis task to Cursor CLI from your own assistant, with the model, the approval mode and the account check settled before anything runs.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Sending a coding or analysis task from your runtime to Cursor CLI |
| **Invoke with** | "cursor", "cursor agent", "composer" or "second opinion" |
| **Works on** | Any runtime outside Cursor that can reach `cursor-agent` |
| **Produces** | Workspace edits and text answers returned to the caller |

### What It Does

cli-cursor is the routing point for a runtime outside Cursor that needs `cursor-agent`. It picks an execution mode and a model from a fixed allowlist, confirms the binary is installed and the account is signed in, then hands the task over. It refuses to load when the caller already runs inside Cursor CLI. It does not own code standards or spec folders: `sk-code` governs what comes back, and `system-spec-kit` owns the spec folder and the memory handback that follows it.

### The Dispatch Guard Rails

Five guards sit between a request and a `cursor-agent` process. Each one closes a failure that a hand-built command line tends to leave open.

| Guard | What it does |
|---|---|
| **Smart router** | Scores the request against intent signals, then loads only the references that match |
| **Model allowlist** | Holds `--model` to 29 exact ids and rejects `auto` before a command is built |
| **Auth pre-flight** | Reads `cursor-agent about` output text and stops on `Not logged in` |
| **Self-invocation guard** | Reads the Cursor env markers and the process tree, then refuses to load |
| **Memory handback** | Extracts a live session's context and saves it through `generate-context.js` |

---

## 2. QUICK START

**Step 1: Confirm the binary resolves.**

```bash
command -v cursor-agent
```

The path prints, for example `/Users/you/.local/bin/cursor-agent`. An empty result means the CLI is missing, and `curl https://cursor.com/install -fsS | bash` installs it.

**Step 2: Check the account.**

```bash
cursor-agent about
```

The output carries the CLI version and a `User Email` line. A real address means the session is signed in. `Not logged in` means every dispatch fails until `cursor-agent login` completes or `CURSOR_API_KEY` is set.

**Step 3: Run the default dispatch.**

```bash
cursor-agent -p "Add input validation to src/utils.ts" \
  --model composer-2.5 \
  --auto-review \
  --sandbox enabled \
  --output-format text \
  2>&1 </dev/null
```

Text mode prints the model's final answer, and the edit lands in the workspace. The process exits 0 whether or not the dispatch worked, so read the output text.

**Step 4: Run a read-only pass.**

```bash
cursor-agent -p "Explain how the auth flow works in this repo" \
  --mode ask \
  --model composer-2.5 \
  2>&1 </dev/null
```

An answer prints and no file changes. `--mode plan` and `--mode ask` stay read-only whatever approval flag you pass.

---

## 3. HOW IT WORKS

A dispatch starts when the calling assistant decides a task belongs at Cursor. The skill scores the request and loads the references that match. It then confirms `cursor-agent` is on PATH before it builds a command. For a research or review lineage the shared runtime takes over: `fanout-run.cjs` runs with executor kind `cli-cursor` and owns process construction. A single build or doc dispatch uses the child envelope in the models reference instead.

```text
┌──────────────────────────────┐
│ Task in the calling runtime  │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Router picks the intent      │
│ and its references           │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Availability probe, then     │
│ the account check            │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Self-invocation guard        │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ cursor-agent -p with a model │
│ and an approval mode         │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Caller reads the output text │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Caller validates and         │
│ integrates the result        │
└──────────────────────────────┘
```

### The Two Silent Traps

Two `cursor-agent` behaviors punish a caller that assumes a normal CLI. Learn them here and a dispatch stops surprising you.

**Trap 1: an authentication failure still exits 0.** A `cursor-agent -p` run that failed to authenticate still exits 0, and it prints the authentication error to the output instead of failing the process. A guard that checks `$?` reports success on a dispatch with no answer. Read the output text.

**Trap 2: the editor's config is the CLI's config.** Cursor CLI reads the same `.cursor/` and `~/.cursor/` files the editor reads, `hooks.json` and `mcp.json` among them. A dispatched session inherits whatever hooks and MCP servers the operator's editor already has, and the rule files in that surface apply too. The sibling CLIs each keep a tool-private config directory, and Cursor keeps none. The shared-config reference lists the flags that narrow what a run can see.

### The Self-Invocation Guard

A CLI skill that dispatches itself burns tokens and returns nothing the caller could not have produced alone. When the caller already runs inside Cursor CLI, cli-cursor refuses to load. It checks three layers in order.

1. The `CURSOR_AGENT` marker, which Cursor sets on every process under `cursor-agent`, and the `CURSOR_CONVERSATION_ID` session id.
2. A `cursor-agent` process in the parent tree. The match uses the canonical binary name, never the bare `agent` alias, which could collide with an unrelated command.
3. A best-effort probe of `~/.cursor` alongside `CURSOR_INVOKED_AS`. Cursor CLI documents no lock-file convention, so this layer is weaker than the sibling packets' third layer.

When any layer matches, the skill returns a refusal and loads nothing. That is a routing rule, not a limitation: the cli-X family exists for cross-CLI delegation.

### Model Selection And Approval

`--model` is scoped to 29 exact ids, and `auto` is excluded because it can resolve to an id outside the set. The ids are listed in the models reference. Effort lives in the id suffix: there is no `--reasoning-effort` flag, and the `model[effort=...]` bracket is rejected with `Cannot use this model`. Pick the id that carries the tier you want, such as `cursor-grok-4.6-high`.

Approval and sandbox are separate switches. `--auto-review` runs safe tool calls and prompts for the rest. `--force` or `--yolo` never prompts. `--sandbox enabled` confines writes to the working directory. Pass neither approval flag and Cursor's own prompt-and-block default applies, which cannot proceed unattended.

The deep-loop adapter maps that onto a lineage command. Either write mode runs with `--force`, because a leaf has no stdin to answer a Smart Auto prompt. A read-only leaf runs `--mode plan --trust` against a neutral empty workspace, which loads no repo hooks or MCP config, and re-adds the repository as a read root with `--add-dir`.

### The File Map

```text
.skilled/skills/cli-external-orchestration/cli-cursor/
+-- SKILL.md                    # Runtime rules and dispatch gotchas
+-- ROUTER.md                   # Intent map, resource map and guard pseudocode
+-- README.md                   # This file
+-- hard-rules.json             # Two preflight checks: stdin redirect and availability
+-- assets/                     # Prompt mechanics and copy-paste prompts
+-- benchmark/                  # Stored validation reports
+-- changelog/                  # One entry per skill version
+-- manual-testing-playbook/    # 40 scenarios across 13 categories
`-- references/                 # Seven deep-dive files, loaded by intent
```

`references/cli-reference.md` and `assets/prompt-quality-card.md` load on every invocation. Every other path waits for an intent to select it.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-cursor when the task wants a second model's opinion on a change, or when a plan or an explanation should come back with no writes. It also fits a first pass on a well-scoped edit that the caller will review, and the opt-in worktree and cloud-worker surfaces when the operator asks for them. Skip it when the caller already holds the context, and skip it for a full-screen interactive session where `cursor-agent` runs by hand.

### Sibling Boundaries

The eight cli-X packets split by the CLI they drive. Most refuse to load when the caller already runs inside that same CLI, so a misroute fails closed rather than nesting two sessions. `cli-opencode` accepts an explicit parallel detached request, and `cli-pi` is exempt.

| Skill | Reach for it when |
|---|---|
| `cli-cursor` | The task wants Cursor's own model, a read-only plan or ask pass, or Cursor's worktree and cloud surfaces |
| `cli-codex` | The task wants sandboxed coding, repo analysis or live web research through Codex |
| `cli-claude-code` | The task wants extended reasoning or `--json-schema` output |
| `cli-opencode` | The caller needs a full OpenCode runtime session |
| `cli-devin` | The task should run through Devin's print mode, or hand off to a cloud Devin session with `/handoff` |
| `cli-pi` | The caller needs guarded headless print or JSON-event dispatch |
| `cli-deepseek-harness` | The caller needs a pinned one-task headless dispatch with the prompt on stdin |
| `cli-mistral-vibe` | The caller needs a print-mode one-task dispatch that reports through `export.json` |

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns the code standards and verification that judge what comes back |
| `system-spec-kit` | Owns spec folders, memory and continuity, including the handback procedure |
| `sk-prompt` | Owns the prompt framework and the CLEAR check the prompt card delegates to |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: cursor-agent` | Not installed, or PATH not updated | `curl https://cursor.com/install -fsS \| bash`, then open a new terminal |
| Output holds `Error: Authentication required` while the exit code is `0` | No signed-in session | `cursor-agent login`, or set `CURSOR_API_KEY` |
| `cursor-agent status` says `Login successful` while `about` says `Not logged in` | `status` reads a stale cache | Trust the `User Email` line in `about` |
| Task ran but no file changed | A read-only mode, or no approval flag | Default agent mode with `--auto-review` or `--force` |
| `Cannot use this model: <id>[...]` | The bracket form is not supported | Use the exact id that carries the tier |
| `cli-cursor model '<id>' is not in the enforced allowlist` | The id sits outside the 29 | Pick an allowed id, or ask the operator to widen the set |
| `Self-invocation refused` | The caller already runs inside Cursor CLI | Use another runtime, or exit the Cursor session first |
| An unexpected hook fires | The CLI reads the editor's `.cursor/hooks.json` | Read the shared-config reference before isolating the run |
| `Workspace Trust Required` | The directory is not trusted yet | Pass `--trust` for a directory you control |
| Skill-advisor answers come back `degraded: true` under `--sandbox enabled` | The sandbox cannot reach the advisor socket | Run with `--sandbox disabled` when the live answer matters |

---

## 6. FAQ

### Why not call `cursor-agent -p` from a shell script?

You can. The skill is for a calling assistant rather than a person: it picks the model and the approval mode itself, and it reads the account state before the first dispatch.

### The task ran and nothing changed. What happened?

One of two things. The run used `--mode plan` or `--mode ask`, which are read-only, or it passed neither `--auto-review` nor `--force`, so Cursor's prompt-and-block default applied and nothing answered the prompt.

### Does Cursor CLI support a reasoning-effort flag?

No. Effort is part of the model id. `cursor-agent` rejects a `model[effort=...]` bracket with `Cannot use this model`, so pick the id that carries the tier you want.

### Why is `--model` limited to 29 ids?

Cursor's live roster carries more than 150 ids, and they drift between releases. Most of them carry no prompt guidance in this packet. A fixed set of 29 keeps a dispatch reproducible and stops a fallback from landing on a model nobody chose.

---

## 7. VERIFICATION

The packet ships a manual playbook of 40 scenarios across 13 categories, plus a hermetic stress matrix for the adapter. A scenario ends in PASS or FAIL, and a SKIP is allowed only with a named blocker.

| Check | How to run it |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-cursor/README.md --type readme` prints `✅ VALID` and `Total issues: 0` |
| Playbook structure | The same command with `--type playbook` on `manual-testing-playbook/manual-testing-playbook.md` prints `✅ VALID` |
| Account pre-flight | `cursor-agent about` shows a `User Email` address rather than `Not logged in` |
| Stress matrix | `cd .skilled/skills/system-deep-loop/runtime && ./node_modules/.bin/vitest run tests/stress/cli-adapter/cli-cursor.vitest.ts --no-coverage` reports one passed test file with no failures |
| Manual playbook | Run the scenarios and record each verdict under `benchmark/reports/<run-label>/` |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime rules and dispatch gotchas |
| [`ROUTER.md`](./ROUTER.md#3-machine-router) | Intent map, resource map and the guard pseudocode |
| [`references/cli-reference.md`](./references/cli-reference.md) | Flags, auth, output handling and troubleshooting |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | The 29 model ids, defaults and the dispatch envelope |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | Cross-AI patterns and approval strategy |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | Execution-mode roster and session continuity |
| [`references/cursor-tools.md`](./references/cursor-tools.md) | Worktree, cloud worker, plugin marketplace and MCP |
| [`references/hook-contract.md`](./references/hook-contract.md) | The shared `hooks.json` schema and event delivery |
| [`references/shared-editor-config.md`](./references/shared-editor-config.md) | The shared `.cursor/` surface and isolation flags |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | Prompt mechanics for a Cursor dispatch |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-paste prompts by task |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The 40-scenario validation gate |
| [`hard-rules.json`](./hard-rules.json) | Two preflight checks read by the dispatcher |
| [`benchmark/README.md`](./benchmark/README.md) | Stored validation reports for the goal-hook scenario |
