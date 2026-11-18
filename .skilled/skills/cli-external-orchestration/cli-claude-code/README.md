---
title: cli-claude-code
description: Cross-AI dispatcher that lets a non-Claude runtime delegate a task to Anthropic's Claude Code CLI for deep reasoning, surgical code edits, structured output and agent delegation.
trigger_phrases:
  - "claude code"
  - "claude cli"
  - "delegate to claude"
  - "extended thinking"
  - "deep reasoning"
  - "anthropic"
version: 1.5.9.0
---

# cli-claude-code

> Hand a demanding reasoning task or a diff-based edit to the `claude` CLI and receive output your own runtime can check and apply.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Reasoning-heavy analysis, diff-based edits, schema-checked JSON and second-AI review through the `claude` CLI |
| **Invoke with** | "claude code", "delegate to claude", "extended thinking" or a hub route on those signals |
| **Works on** | Any runtime outside Claude Code that can reach the `claude` binary |
| **Produces** | Validated text, schema-checked JSON, diff-based edits and agent results |

### What It Does

cli-claude-code lets a runtime outside Claude Code hand one scoped task to the `claude` binary and receive a result it can validate. The hub routes here when a prompt names Claude Code, the `claude` CLI, extended thinking or a deep-reasoning handoff. The packet then supplies the availability probe and the OAuth pre-flight. It also refuses to load when the caller is already inside Claude Code.

Start from `claude -p "<prompt>" --model claude-sonnet-5-5 --output-format text </dev/null 2>&1`. For a research or review lineage, the shared deep-loop runtime runs the process with executor kind `cli-claude-code`.

The packet does not own code standards or spec folders. `sk-code` owns code standards and verification. `system-spec-kit` owns spec folders and session continuity. cli-claude-code dispatches the task and hands the result back.

### Why This Skill Exists

A non-Claude assistant has no built-in path to the `claude` binary. A hand-built dispatch means guessing flags and meeting an expired OAuth session halfway through a task. If the caller is itself Claude Code, the dispatch loops back on itself and burns tokens for no result.

This packet fixes one dispatch shape and guards the edges. The availability probe runs first. An OAuth check runs before the first call, so a missing session surfaces as a login prompt rather than a failed dispatch. The self-invocation guard stops a nested run. The caller never builds its own wrapper.

### The Agent Layer

The packet routes to 11 Claude Code agents with `--agent <name>`. Each definition lives in the runtime's `.claude/agents/` directory. The roster groups by the job the caller hands over.

| Group | Agents | Delegated work |
|---|---|---|
| **Explore and diagnose** | `context`, `debug` | Read-only codebase mapping and fresh-perspective root-cause work |
| **Build and review** | `code`, `review` | Application-code implementation through `sk-code` and a read-only quality or security review |
| **Document and prompt** | `markdown`, `prompt-improver` | Template-first documentation and a dispatch-ready prompt package |
| **Research, plan and design** | `deep-research`, `deep-review`, `ai-council`, `orchestrate`, `design` | One research pass, one review pass, multi-strategy planning, agent coordination and UI value decisions |

Pair a read-only agent with `--permission-mode plan`. `deep-review` and `prompt-improver` are command-owned, so reach them through their commands rather than a dispatch. A one-shot `deep-research` dispatch is allowed outside the iterative loop. The full roster and its invocation patterns live in [agent-delegation.md](./references/agent-delegation.md).

---

## 2. QUICK START

**Step 1: Verify the CLI is installed.**

```bash
command -v claude
```

The command prints the binary path, such as `/Users/you/.local/bin/claude`. An empty output means the binary is absent. Install it with `npm install -g @anthropic-ai/claude-code` and open a new terminal.

**Step 2: Run the default dispatch.**

```bash
claude -p "Explain the dependency injection in src/app.ts" \
  --model claude-sonnet-5-5 \
  --output-format text \
  2>&1 </dev/null
```

The response text prints to stdout. `2>&1` folds stderr into the same stream, so a warning or error appears beside the answer instead of vanishing. `</dev/null` closes stdin, because an open stdin can hang a print-mode run with no output.

**Step 3: Raise the depth for a reasoning task.**

```bash
claude -p "Weigh the trade-offs between a monolith and services for this codebase" \
  --model claude-opus-5-5 \
  --effort high \
  --output-format text \
  2>&1 </dev/null
```

You receive an analysis at high effort from the packet's deep-reasoning pin. Raise the level to `xhigh` or `max` when `high` leaves the question open.

**Step 4: Ask for schema-checked JSON.**

```bash
claude -p "Analyze src/utils.ts and return the function signatures" \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array"}}}' \
  --output-format json \
  2>&1 </dev/null
```

The command returns a JSON envelope with `result`, `cost`, `duration` and `session_id` fields. The content follows the schema you passed. A mismatch reports a schema validation failure.

---

## 3. HOW IT WORKS

### The Dispatch Lifecycle

The calling AI stays the conductor. It classifies the task and composes a prompt with file anchors, then picks a model and an effort level. The packet supplies the guard checks and the flag shape. Claude Code runs the task with its own tools and returns output. The caller validates that output, then integrates it or asks for a second pass.

The packet owns routing, the `command -v claude` probe, prompt construction and the self-invocation guard. For a research or review lineage, `../../system-deep-loop/runtime/scripts/fanout-run.cjs` owns process construction and execution under executor kind `cli-claude-code`. A single build or doc dispatch uses the child dispatch envelope in [providers-and-models.md](./references/providers-and-models.md) §5. No packet-local wrapper sits between the two.

```text
┌──────────────────────────────┐
│ Task in the calling runtime  │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Hub selects cli-claude-code  │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Availability probe and       │
│ self-invocation guard        │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ OAuth pre-flight             │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Prompt, model and effort     │
│ selection                    │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ claude -p dispatch           │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Caller validates the output  │
└──────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Integrate the result         │
└──────────────────────────────┘
```

### The Self-Invocation Guard

A `claude -p` dispatch must never run from inside Claude Code. The guard reads `$CLAUDECODE` first, because Claude Code sets it at session start. It then walks the process ancestry for a `claude` parent and looks for a lock at `~/.claude/state/<id>/lock`. A match on any layer returns the refusal message and loads nothing.

Inside Claude Code, dispatch a native subagent through the Agent tool instead. The subagent runs at the session's effort level unless its agent definition names a different one.

### The Packet Files

The folder holds the routing contract, two prompt assets, five references and a manual playbook.

```text
cli-claude-code/
+-- SKILL.md                       # Runtime rules, dispatch contract and the four gotchas
+-- ROUTER.md                      # Intent map, resource map and the self-invocation guard
+-- README.md                      # This file
+-- hard-rules.json                # Dispatch preflight: stdin redirect and permission-mode risk
+-- assets/
|   +-- prompt-quality-card.md     # Fast-path prompt discipline, ALWAYS loaded
|   `-- prompt-templates.md        # Copy-paste prompt templates per task
+-- references/
|   +-- cli-reference.md           # Flags, commands, auth, permission modes, troubleshooting, ALWAYS loaded
|   +-- providers-and-models.md    # Model ids, the default pin and the --effort mapping
|   +-- agent-delegation.md        # The 11-agent roster and invocation patterns
|   +-- integration-patterns.md    # Cross-AI orchestration patterns
|   `-- claude-tools.md            # Unique capabilities and a comparison with OpenCode
+-- manual-testing-playbook/       # Playbook index plus 12 scenario categories
+-- benchmark/                     # Dated run reports under reports/
`-- changelog/                     # One entry per release
```

Read [`ROUTER.md`](./ROUTER.md#3-machine-router) before you pick a reference. Its `ALWAYS` tier loads [cli-reference.md](./references/cli-reference.md) and [prompt-quality-card.md](./assets/prompt-quality-card.md) on every invocation, then each resource intent adds its own pair. DESIGN is a handoff and loads no file.

### Auth Pre-Flight And Memory Handback

cli-claude-code authenticates through the Claude subscription OAuth only. It never uses an `ANTHROPIC_API_KEY`. The pre-flight reads `claude auth status` once per session. If the reply shows no session, surface `claude auth login` for the interactive browser flow or `claude setup-token` for CI, then wait. Never dispatch on a guessed auth state or swap in a key.

When the caller needs a Claude Code session's context, the 7-step Memory Handback extracts the `MEMORY_HANDBACK` section into structured JSON, scrubs secrets and writes the payload through `generate-context.js`. The full procedure lives in [memory-handback.md](../../system-spec-kit/references/cli/memory-handback.md).

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for cli-claude-code when a task wants deeper reasoning than the caller gives, a diff-based edit that preserves existing patterns, schema-checked JSON or a second review pass on security. It also fits an agent-delegated task that matches one of the roster agents.

Skip it for a quick task the caller can answer directly or for interactive terminal work where you run `claude` by hand. Live web research belongs elsewhere too, because Claude Code has no `--search` flag. Route that work to cli-opencode.

### Sibling Boundaries

The cli-X packets each dispatch to a different binary and never overlap.

| Skill | When to reach for it |
|---|---|
| `cli-claude-code` | Reasoning passes, diff-based edits, `--json-schema` output and agent delegation through Claude Code |
| `cli-codex` | Sandboxed coding, repo analysis, PR review and web research |
| `cli-opencode` | Full OpenCode runtime dispatch, including parallel detached sessions |
| `cli-cursor` | Composer-model work with read-only plan and ask passes |
| `cli-devin` | Print-mode coding through `devin -p`, with subagent delegation and a cloud handoff through `/handoff` |
| `cli-pi` | Guarded headless print and JSON-event dispatch |
| `cli-deepseek-harness` | Pinned headless one-task dispatch, experimental |
| `cli-mistral-vibe` | Pinned print-mode one-task dispatch with the outcome read from `export.json`, experimental |

Most packets refuse to load inside their own runtime. A Pi session may still dispatch `cli-pi`, and `cli-opencode` accepts an explicit request for a parallel detached session. Otherwise use a different runtime or exit first.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns code standards and verification. cli-claude-code dispatches the work and sk-code governs what comes back |
| `system-spec-kit` | Owns spec folders and session continuity. The Memory Handback bridges a Claude Code session into the caller's packet |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: claude` | The binary is absent from PATH | `npm install -g @anthropic-ai/claude-code`, then open a new terminal |
| `401 Unauthorized` | No Claude subscription OAuth session or an expired one | `claude auth login` or `claude setup-token` on CI |
| A dispatch hangs with no output | stdin stayed open in print mode | Append `</dev/null` to the command |
| `Self-invocation refused` | The caller runs inside Claude Code | Dispatch a native subagent instead. Otherwise exit the session and use another runtime |
| `unrecognized_model` for `claude-fable-5-5` | The current Fable has a different id | Pass `claude-fable-5-1` or `--model fable` and let the installed CLI resolve its Fable |
| `Agent not found` | The name is not in the runtime's agent directory | Run `claude agents list` and use a listed name |
| Schema validation failed | The output did not match the `--json-schema` you passed | Check the schema shape, then rerun with `--output-format json` |
| Context too large | The prompt named a broad path | Reference single files with `@./path/to/file` and split the task |

---

## 6. FAQ

### Why not call `claude` from my shell directly?

You can. This packet exists for an external assistant that dispatches programmatically. It supplies the model pin, the permission mode, the OAuth pre-flight and the self-invocation guard, so the caller does not hand-build a wrapper per task.

### When should I raise `--effort`?

`--effort high` covers code generation, review and debugging. Move to `xhigh` for architecture work and subtle root causes. Use `max` for the hardest problems where cost is secondary. Every roster model accepts all five levels. A dispatch that omits the flag inherits the effort from the machine's settings or the model's built-in default.

### What does `--permission-mode plan` change?

It makes the run read-only. Claude Code can read and analyze but cannot write files or run shell commands, so the mode suits review and exploration. The default mode asks before each write. `bypassPermissions` approves everything and needs explicit user consent first.

### What happens if I dispatch from inside Claude Code?

The guard checks the `$CLAUDECODE` marker and the process ancestry. A state lock under `~/.claude/state/` also counts as a match, so the run refuses before any dispatch. You receive the refusal message. Dispatch a native subagent instead. Otherwise run the task from a runtime outside Claude Code.

### How does the Memory Handback carry a session into my spec folder?

It extracts the session's `MEMORY_HANDBACK` section into structured JSON, scrubs secrets and writes the payload through `generate-context.js --stdin`. The steps and caveats live in [memory-handback.md](../../system-spec-kit/references/cli/memory-handback.md).

---

## 7. VERIFICATION

The packet ships 54 manual scenarios in 12 categories. A scenario run is complete only after its outcome is recorded under `benchmark/reports/<dated-run-label>/`.

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-claude-code/README.md --type readme` reports `✅ VALID` with zero issues |
| Playbook structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/manual-testing-playbook.md --type playbook` reports `✅ VALID` with zero issues |
| Availability | `command -v claude` prints a binary path before any dispatch |
| Auth | `claude auth status` reports an authenticated session, as the playbook's global preconditions require |
| Behavior | The scenarios in [manual-testing-playbook.md](./manual-testing-playbook/manual-testing-playbook.md) pass with a valid OAuth session. Each result is recorded under `benchmark/reports/` |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime rules, dispatch contract and the four gotchas |
| [`ROUTER.md`](./ROUTER.md#3-machine-router) | Machine router with intent and resource maps and loading levels |
| [`references/cli-reference.md`](./references/cli-reference.md) | Flags, commands, auth, permission modes and troubleshooting |
| [`references/providers-and-models.md`](./references/providers-and-models.md) | Model ids, the default pin and the `--effort` mapping |
| [`references/agent-delegation.md`](./references/agent-delegation.md) | The 11-agent roster and invocation patterns |
| [`references/integration-patterns.md`](./references/integration-patterns.md) | Cross-AI orchestration patterns where the caller conducts |
| [`references/claude-tools.md`](./references/claude-tools.md) | Unique capabilities and a comparison with OpenCode |
| [`assets/prompt-quality-card.md`](./assets/prompt-quality-card.md) | Fast-path prompt discipline, ALWAYS loaded |
| [`assets/prompt-templates.md`](./assets/prompt-templates.md) | Copy-paste prompt templates per task |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The 54-scenario validation contract |
| [`benchmark/README.md`](./benchmark/README.md) | The dated run reports and their index |
| [`hard-rules.json`](./hard-rules.json) | The dispatch preflight rules |

<!-- readme-check
allow-ref /Users/you/.local/bin/claude | sample output of `command -v claude`, which prints an absolute path on the reader's machine
-->
