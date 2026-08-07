---
title: cli-external-orchestration
description: One hub that routes cross-AI work to the external CLI that fits it best: OpenCode, Claude Code, Codex, Cursor, Devin or Pi, each dispatched as a nested workflow packet under a single advisor identity.
trigger_phrases:
  - "opencode cli"
  - "claude cli"
  - "codex cli"
  - "codex exec"
  - "delegate to codex"
  - "cursor cli"
  - "cursor agent"
  - "devin cli"
  - "delegate to devin"
  - "pi cli"
  - "delegate to pi"
  - "cli dispatch"
  - "cross-ai delegation"
version: 1.3.0.0
---

# cli-external-orchestration

> Cross-AI work means more than one external CLI runtime on your machine. This hub routes each coding, review, research or delegation request to the CLI that fits it best, dispatched as a nested workflow packet under one advisor identity.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Cross-AI CLI dispatch: coding, review, research, delegation and second opinions through six external CLI runtimes |
| **Invoke with** | Gate 2 keyword routing such as "cli dispatch" or "delegate to codex". No mode has a bound slash command (`command: null`) |
| **Routes to** | `cli-opencode/`, `cli-claude-code/`, `cli-codex/`, `cli-cursor/`, `cli-devin/` or `cli-pi/` via `mode-registry.json` (all mutating packets, `mutatesWorkspace: true`) |
| **Produces** | A dispatched OpenCode, Claude Code, Codex, Cursor, Devin or Pi session whose writes land in this repo's workspace. Each mode's self-invocation guard blocks a runtime from dispatching itself |

---

## 2. OVERVIEW

### Why This Hub Exists

Your machine runs more than one external AI runtime, each with its own CLI and its own failure modes. Picking one by habit is guesswork: the session runs, but it may not fit the task. The hub makes the choice deliberate. One advisor identity reads the request and picks the external CLI that fits it best. Then it dispatches the matching workflow packet.

### What It Does

The hub holds no packet-local logic. Every request routes to exactly one of six nested workflow packets through `hub-router.json` and `mode-registry.json`. The hub itself keeps just its `SKILL.md` and the registry files. Each mode packet keeps its own contract, references, playbook and changelog.

### The Mode Roster

| Mode | What the packet dispatches |
|---|---|
| **`cli-opencode`** ([README](./cli-opencode/README.md), [SKILL.md](./cli-opencode/SKILL.md)) | OpenCode CLI dispatch: full-runtime and parallel sessions, detached sessions, the plugin, skill, MCP and Spec-Kit-Memory runtime plus small-model dispatch for DeepSeek, Kimi, MiniMax, MiMo and GLM. Small-model prompt profiles: [`../sk-prompt/sk-prompt-models/README.md`](../sk-prompt/sk-prompt-models/README.md) |
| **`cli-claude-code`** ([README](./cli-claude-code/README.md), [SKILL.md](./cli-claude-code/SKILL.md)) | Claude Code CLI dispatch: Anthropic-backed extended thinking, surgical code edits, structured JSON-schema output, agent delegation and cross-AI second opinions |
| **`cli-codex`** ([README](./cli-codex/README.md), [SKILL.md](./cli-codex/SKILL.md)) | Codex CLI dispatch: OpenAI-backed coding, repo analysis, PR review, web research and cross-model validation. Fails closed when the `codex` binary is absent |
| **`cli-cursor`** ([README](./cli-cursor/README.md), [SKILL.md](./cli-cursor/SKILL.md)) | Cursor CLI dispatch: Composer-model dispatch, read-only `--mode plan` and `--mode ask` exploration, native git worktree isolation, a cloud `worker` and a shared `.cursor/` hooks, MCP and rules config surface with the Cursor editor |
| **`cli-devin`** ([README](./cli-devin/README.md), [SKILL.md](./cli-devin/SKILL.md)) | Devin CLI dispatch: Cognition-backed cloud coding via `devin -p`, subagent delegation via `run_subagent`, cloud handoff via `/handoff`, MCP host integration and multi-model dispatch. Availability-gated on `command -v devin` |
| **`cli-pi`** ([README](./cli-pi/README.md), [SKILL.md](./cli-pi/SKILL.md)) | Pi CLI dispatch: guarded headless print, JSON-event and RPC dispatch, native skills and extensions plus community packages. Availability-gated on `command -v pi`, with failure exit codes that are unreliable so callers inspect output |

---

## 3. QUICK START

**Step 1: Invoke it.** Gate 2 keyword routing matches trigger phrases such as "cli dispatch" or "delegate to codex". No slash command exists for any of the six modes (`command: null`).

**Step 2: Dispatch the mode that fits the request.**

| Mode | Example prompt |
|---|---|
| `cli-opencode` | `Run this task through opencode run with the deepseek provider.` |
| `cli-claude-code` | `Use cli-claude-code to get an Anthropic-backed second opinion.` |
| `cli-codex` | `Use cli-codex for an OpenAI-backed code review and web-research pass.` |
| `cli-cursor` | `Use cli-cursor to get Composer's opinion on this diff.` |
| `cli-devin` | `Use cli-devin for a Cognition-backed multi-model code review.` |
| `cli-pi` | `Use cli-pi for a guarded headless JSON-event review.` |

**Step 3: Confirm the dispatch.** The session runs under the target CLI and its writes land in this repo's workspace. When a request names several modes at once, the `tieBreak` order runs them as an `orderedBundle`. Read the mode's `SKILL.md` for its exact dispatch contract before relying on the result.

---

## 4. HOW IT WORKS

### The Routing Chain

Routing reads `hub-router.json` for signals and vocabulary classes, then `mode-registry.json` for packet identity and tool surface. The registry also carries the advisor routing fields. When a request names several modes at once, `routerPolicy.tieBreak` orders `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` as an `orderedBundle`. `defaultMode` is `cli-opencode`. Genuinely unclear or contradictory intent still defers to disambiguation instead of defaulting silently.

### The Guard Rails

Four behaviors keep dispatch honest:

- `cli-codex` fails closed when the binary is absent. `cli-devin` and `cli-pi` gate routing on `command -v`.
- The self-invocation guard blocks a runtime from dispatching itself.
- One `graph-metadata.json` carries the single advisor identity for all six modes, unioning their intent signals, trigger phrases, domains and outward edges.
- Each mode keeps its own `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/` and `changelog/`. Its `references/providers-and-models.md` is the single source for that mode's providers, model ids, effort tiers and dispatch shapes.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Hub

Use the hub when a request belongs to an external CLI runtime: full-runtime OpenCode work, an Anthropic-backed second opinion, an OpenAI-backed review and research pass, Composer's view on a diff, Cognition-backed cloud coding or a guarded headless Pi run. If the request is about code inside this repo, the hub dispatches the session and `sk-code` owns the work inside it. If the request is about documentation, `sk-doc` handles it directly and this hub does not write docs.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-prompt` | `cli-opencode` small-model dispatch is a sentinel for `sk-prompt/sk-prompt-models` profiles (enhances edge, weight 0.5) |
| `system-spec-kit` | Manual dependency. A full-runtime `cli-opencode` dispatch carries the Spec-Kit-Memory runtime |
| `sk-code` | Owns code implementation, review and debugging inside the dispatched session |
| `system-deep-loop` | Related. Ablation-suite and worker-farm patterns dispatch parallel `cli-opencode` sessions |
| `mcp-code-mode` | Related. The MCP execution substrate a dispatched session can reach once running |
| `sk-doc` | Sibling parent hub whose structure this hub mirrors |

---

## 6. VERIFICATION

| Check | How to run it |
|---|---|
| Hub structure | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` exits 0 with 0 invariant failures and 0 warnings |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/cli-external-orchestration/README.md --type readme` exits 0 and reports zero issues |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Hub runtime instructions and routing logic |
| [`mode-registry.json`](./mode-registry.json) | Packet identity, tool surface and advisor routing for the six modes |
| [`hub-router.json`](./hub-router.json) | Signal and vocabulary routing that precedes the registry |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory of hub dispatch capabilities |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate hub routing |
