---
title: "OpenCode CLI - Unique Capabilities and Comparison"
description: "Documents the value props that distinguish opencode run from raw model dispatch: full plugin/skill/MCP runtime context, parallel detached sessions, structured event stream, agent dispatch, and cross-repo working directory routing."
trigger_phrases:
  - "opencode unique capabilities"
  - "opencode full runtime dispatch"
  - "opencode structured event stream"
  - "opencode cross-repo dispatch"
  - "opencode vs sibling cli skills"
importance_tier: normal
contextType: general
version: 1.4.16.0
---

# OpenCode CLI - Unique Capabilities

What `opencode run` brings that the sibling cli-* dispatches do not. Each capability includes the invocation shape and the use case where it pays off. Each shape is shown for OpenCode 2 (2.3.2).

---

## 1. OVERVIEW

### Purpose

The sibling cli-* skills (cli-claude-code, cli-codex) dispatch a raw model or external autonomous CLI behind a thin wrapper. The dispatched tool loads no OpenCode project plugin runtime, no OpenCode skills, and no MCP tools unless the calling AI manually attaches files or pastes context.

`opencode run` is different. It spawns a full OpenCode session. That session loads:

1. Every plugin registered in the project's `opencode.json`
2. Every skill under `.skilled/skills/`
3. Every MCP tool wired through `opencode.json` and `.utcp_config.json`
4. The project's CLAUDE.md / AGENTS.md instructions
5. The project's spec folders and their continuity docs

The cli-opencode skill exists because no sibling provides this. It is the bridge between an external AI and the full plugin / skill / MCP runtime this repo defines.

### When to Use

- A dispatch needs the project's plugin, skill or MCP runtime (§2)
- The task needs a parallel detached session (§3)
- The calling AI must parse a structured event stream instead of prose (§4)
- The dispatch must run as a named agent definition (§5)
- The dispatch must target another repository's runtime (§6)

**Version baseline.** This reference is pinned to OpenCode 2 at 2.3.2, the only supported version. Observations that name 2.0.32 were read on that release and have not been re-read on 2.3.2. Later versions are unsupported until re-verified. The install and upgrade path is in [`install-and-versions.md`](./install-and-versions.md).

---

## 2. FULL PLUGIN, SKILL, AND MCP RUNTIME

### What it does

When `opencode run` starts a session, the runtime loads every plugin, skill, and MCP server the project configures. The dispatched agent has access to:

- All `Skill` invocations the calling AI has access to (system-spec-kit, sk-doc, `sk-code` surface routing, etc.)
- All MCP tools (the Skill Advisor's routing tools, and Code Mode's manuals for ClickUp / Figma / GitHub / Notion / Obsidian and the other external services)
- Every project-local plugin
- The repo's CLAUDE.md / AGENTS.md instruction set as the system prompt

Whether OpenCode 2 loads the same runtime is unverified on OpenCode 2.0.32.

### Why it matters

A Claude Code CLI dispatch via `claude -p "<prompt>"` runs raw Claude with no plugins and no MCP. To get the same plugin / skill / MCP context inside Claude Code the operator would need to run a TUI session and import the project. That is not a one-shot invocation.

`opencode run` is the only one-shot path that loads the full runtime.

### Invocation shape

```bash
cd "$REPO_ROOT" && opencode run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "Analyze the skill-advisor daemon health using advisor_status, then propose three improvements with concrete file:line citations." </dev/null
```

The effort level rides the model id as a `#<level>` suffix and the working directory moves into a `cd`. OpenCode 2.0.32 listed no `opencode-go` provider on this machine (2.3.2 listed `opencode-go/` ids on 2026-11-19), so confirm that `opencode models --standalone` lists the `<provider>/` prefix of the model you pass to `-m`, before the first dispatch (a 2.0.32 run used `llmgateway/deepseek-v4.1-flash-1017#max`). On OpenCode 2.0.32, `--agent <slug>` runs the session as that agent, but these examples omit it and use the default agent.

Whether the dispatched session loads the `system-skill-advisor` skill, calls `advisor_status` (an MCP tool), inspects the daemon state, and writes the proposal back through the normal `/speckit:save` continuity pipeline is unverified on OpenCode 2.0.32.

---

## 3. PARALLEL DETACHED SESSIONS

### What it does

A second `opencode run` invocation from inside an existing OpenCode session spawns a separate session with its own session id. A dispatch that must reach a specific server passes `--server <url>`; `run` has no port flag. Nothing is published: `--share` is not a `run` flag, so no dispatch passes it. The original session continues unaffected.

### Why it matters

For ablation suites, worker farms, and parallel research sweeps, the operator wants N sessions running concurrently. Each session must have:

- A unique session id (not a fork of the parent)
- Its own message history, addressable through `opencode session export <id>`
- The same plugin / skill / MCP runtime as the parent

The skill's smart router gates this use case behind ADR-001's self-invocation signal. When the signal trips AND the prompt explicitly names a parallel detached session, the router permits the dispatch. Otherwise it refuses (see `./integration-patterns.md` for the full decision tree).

### Invocation shape

```bash
# Start a headless server with `opencode serve`, then dispatch into it
cd "$REPO_ROOT" && opencode run --server http://127.0.0.1:4096 \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "Research one open question for the approved spec folder and write the findings to scratch/iteration-N.md." </dev/null
```

---

## 4. STRUCTURED EVENT STREAM

### What it does

`--format json` emits a newline-delimited JSON stream with typed events: `step_start`, `tool_use`, `text` and `step_finish`. Each event carries the session id in `sessionID`.

### Why it matters

External runtimes (Claude Code, OpenCode, Copilot) parse the event stream incrementally to surface tool calls and partial messages without waiting for the full response. The schema is stable enough to write thin adapters that translate OpenCode events into the calling AI's native event format.

### Invocation shape

```bash
cd /repo && opencode run --standalone \
  --format json \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  "<prompt>" </dev/null 2>/dev/null | while IFS= read -r line; do
    type=$(echo "$line" | jq -r '.type')
    case "$type" in
      step_start) echo "sessionID=$(echo "$line" | jq -r '.sessionID')" ;;
      tool_use) echo "tool=$(echo "$line" | jq -r '.part.tool')" ;;
      step_finish) echo "step_finish=$(echo "$line" | jq -r '.part.reason')" ;;
    esac
  done
```

---

## 5. AGENT DISPATCH VIA `--agent`

### What it does

The `--agent <slug>` flag loads an agent definition from `.opencode/agents/<slug>.md`, which in this repository links to `.skilled/agents/`, where the files are edited. The frontmatter pins the model, tool permissions, and system prompt. Specialized agents (`deep-research`, `deep-review`, `context`, `review`, `ai-council`, etc.) provide domain-specific behavior the calling AI can target. OpenCode 2.0.32 loads the same definitions and registers their mode, permissions and temperature. With the `openai-compatible` provider package, the only one tested, it does not send that temperature to the provider, so an agent's `temperature` has no effect there. Whether it applies those permissions during a run is unverified on OpenCode 2.0.32. No repo agent pins a model, so a pinned model against `-m` is untested there.

### Why it matters

Sibling cli-* skills that have agent equivalents (cli-claude-code's `--agent` flag, cli-codex's `-p <profile>` flag) only see the calling AI's perspective. cli-opencode dispatches into a session where the calling AI's prompt is shaped by the agent's frontmatter: its own routing decisions, its own tool permissions, its own constraints.

### Invocation shape

```bash
cd /repo && opencode run --standalone \
  --agent deep-review \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "Run iteration 3 of the deep-review loop for the approved spec folder. State file: review/deep-review-state.jsonl." </dev/null
```

See `./agent-delegation.md` for the full routing matrix.

---

## 6. CROSS-REPO DISPATCH VIA A START DIRECTORY

### What it does

The session's working directory is the directory the dispatch starts in, so a cross-repo dispatch is a `cd` into the target repo. `run` has no directory flag, and `--server <url>` attaches to a running OpenCode server instead of starting a private one.

### Why it matters

A calling AI in one repo (e.g. a sibling project) can dispatch into a different repo's plugin / skill / MCP runtime without leaving its own session. cli-opencode is the only cli-* skill that documents the cross-repo dispatch pattern, because the `cd` into the target repo is what loads that repo's plugin / skill / MCP runtime.

### Invocation shape

```bash
# From a session in repo A, dispatch into repo B's runtime
cd /path/to/other-repo && opencode run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max \
  --format json \
  "Use Barter's spec-kit to draft a Level 1 spec for the X feature. Save context after." </dev/null
```

---

## 7. STATE COMPARISON WITH SIBLING CLI BINARIES

| Sibling | Persistent state | Memory continuity | Plugin runtime |
|---------|-------------------|-------------------|----------------|
| cli-claude-code | Per-session conversation log | `--continue` / `--resume <id>` | None (raw Claude) |
| **cli-opencode** | Shared `~/.local/share/opencode/` SQLite database + storage tree (`opencode.db`, `storage/`, `snapshot/`), inspectable per-session via `opencode session export <id>` | `--continue` / `-s <id>` / `--fork` | **Full plugin + skill + MCP** |

The shared session database at `~/.local/share/opencode/` is what makes use case 2 (parallel detached sessions) possible. Each session id is independently addressable via `opencode session export <id>`, even though sessions share the same underlying database rather than each getting its own filesystem directory. Whether OpenCode 2 keeps the same database layout is unverified on OpenCode 2.0.32.

---

## 8. RELATED RESOURCES

- `./cli-reference.md` - Full subcommand and flag reference
- `./integration-patterns.md` - Three use cases with prompt templates
- `./agent-delegation.md` - Agent routing matrix
- `../assets/prompt-templates.md` - Copy-paste templates per use case
- `../SKILL.md` - Skill entry point and routing summary
- `../ROUTER.md` §3 - Machine router: intent map, resource map and loading levels
