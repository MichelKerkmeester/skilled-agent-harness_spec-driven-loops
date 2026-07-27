---
title: cli-external-orchestration
description: Parent hub for external CLI dispatch, routing to cli-opencode (OpenCode CLI orchestration), cli-claude-code (Claude Code CLI orchestration), cli-codex (Codex CLI orchestration), cli-cursor (Cursor CLI orchestration), cli-devin (Devin CLI orchestration), and cli-pi (Pi CLI orchestration) through mode-registry.json.
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
version: 1.1.0.0
---

# cli-external-orchestration

> One advisor identity, six workflow modes: dispatch the OpenCode CLI for full-runtime and parallel sessions, the Claude Code CLI for Anthropic-backed reasoning and structured cross-AI handoff, the Codex CLI for OpenAI-backed coding, review, and web research, the Cursor CLI for Composer-model dispatch and read-only plan/ask exploration, the Devin CLI for Cognition-backed multi-model coding, subagent delegation, cloud handoff, and cross-model validation, or the Pi CLI for guarded headless coding, JSON-event output, RPC integration, and native-resource and community-package workflows.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Cross-AI CLI dispatch. Full-runtime OpenCode orchestration (parallel and detached sessions, small-model dispatch), Claude Code orchestration (extended thinking, surgical edits, structured output, agent delegation), Codex orchestration (OpenAI-backed coding, review, web research, and cross-model validation), Cursor orchestration (Composer-model dispatch, read-only plan/ask exploration, native worktree/cloud-worker escape hatches), Devin orchestration (Cognition-backed multi-model coding, subagent delegation, cloud handoff, and cross-model validation), or Pi orchestration (guarded print, JSON-event and RPC dispatch, native skills/extensions, and community packages) |
| **Invoke with** | Keyword routing through Gate 2. None of the six modes has a bound slash command (`command: null`) |
| **Routes to** | `cli-opencode/`, `cli-claude-code/`, `cli-codex/`, `cli-cursor/`, `cli-devin/`, or `cli-pi/` (all mutating workflow packets, `mutatesWorkspace: true`) via `mode-registry.json` |
| **Produces** | A dispatched OpenCode, Claude Code, Codex, Cursor, Devin, or Pi CLI session whose writes land in this repo's workspace. Each mode's self-invocation guard blocks a runtime from dispatching itself |

---

## 2. OVERVIEW

`cli-external-orchestration` is a parent hub: it holds no packet-local logic and routes every request to exactly one of six nested workflow packets through `mode-registry.json` and `hub-router.json`.

- **`cli-opencode/`**: OpenCode CLI orchestration. Covers external dispatch, in-OpenCode parallel and detached sessions, the full plugin, skill, MCP and Spec-Kit-Memory runtime, small-model dispatch (DeepSeek, Kimi, MiniMax, MiMo, GLM). Small-model prompt-craft profiles: [`../sk-prompt/prompt-models/README.md`](../sk-prompt/prompt-models/README.md). Dispatch contract: [`cli-opencode/SKILL.md`](cli-opencode/SKILL.md). Setup and orientation: [`cli-opencode/README.md`](cli-opencode/README.md).
- **`cli-claude-code/`**: Claude Code CLI orchestration. Covers Anthropic-backed extended thinking, surgical code editing, structured JSON-schema output, agent delegation, cross-AI second opinions. Dispatch contract: [`cli-claude-code/SKILL.md`](cli-claude-code/SKILL.md). Setup and orientation: [`cli-claude-code/README.md`](cli-claude-code/README.md).
- **`cli-codex/`**: Codex CLI orchestration. Covers OpenAI-backed coding, repo analysis, PR review, web research, cross-model validation, and fail-closed availability/self-invocation guards. Dispatch contract: [`cli-codex/SKILL.md`](cli-codex/SKILL.md). Setup and orientation: [`cli-codex/README.md`](cli-codex/README.md).
- **`cli-cursor/`**: Cursor CLI orchestration. Covers Composer-model dispatch (Cursor's own native model), read-only `--mode plan`/`--mode ask` exploration, native git worktree isolation, a cloud `worker`, and a shared `.cursor/` hooks/MCP/rules config surface with the Cursor editor. Dispatch contract: [`cli-cursor/SKILL.md`](cli-cursor/SKILL.md). Setup and orientation: [`cli-cursor/README.md`](cli-cursor/README.md).
- **`cli-devin/`**: Devin CLI orchestration. Covers Cognition-backed cloud coding via `devin -p`, subagent delegation via `run_subagent`, cloud handoff via `/handoff`, MCP host integration, multi-model dispatch, and availability-gated routing on `command -v devin`. Dispatch contract: [`cli-devin/SKILL.md`](cli-devin/SKILL.md). Setup and orientation: [`cli-devin/README.md`](cli-devin/README.md).
- **`cli-pi/`**: Pi CLI orchestration. Covers guarded headless print, JSON-event, and RPC dispatch, native skills/extensions, community-package dispatch, and availability-gated routing on `command -v pi`; failure exit codes are unreliable, so callers inspect output. Dispatch contract: [`cli-pi/SKILL.md`](cli-pi/SKILL.md). Setup and orientation: [`cli-pi/README.md`](cli-pi/README.md).

Routing reads `hub-router.json` for signals and vocabulary classes, then `mode-registry.json` for packet identity, tool surface and advisor routing. `routerPolicy.tieBreak` orders `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, and `cli-pi` when multiple are explicitly requested (an `orderedBundle` outcome), and `defaultMode` is `cli-opencode`, but genuinely unclear or contradictory dispatch intent still defers to disambiguation instead of defaulting silently.

All six packets keep their own `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/` and `changelog/` (`cli-opencode/` additionally keeps `scripts/`). The hub carries the single `graph-metadata.json` advisor identity for all six, unioning their intent signals, trigger phrases, domains and outward edges.

---

## 3. QUICK START

**OpenCode CLI dispatch:**

```text
Run this task through opencode run with the deepseek provider.
```

**Claude Code CLI dispatch:**

```text
Use cli-claude-code to get an Anthropic-backed second opinion.
```

**Codex CLI dispatch:**

```text
Use cli-codex for an OpenAI-backed code review and web-research pass.
```

**Cursor CLI dispatch:**

```text
Use cli-cursor to get Composer's opinion on this diff.
```

**Devin CLI dispatch:**

```text
Use cli-devin for a Cognition-backed multi-model code review.
```

**Pi CLI dispatch:**

```text
Use cli-pi for a guarded headless JSON-event review.
```

---

## 4. RELATED SKILLS

| Skill | Relationship |
|---|---|
| `sk-prompt` | Enhances edge (weight 0.5). `cli-opencode`'s small-model dispatch is a sentinel for `sk-prompt/prompt-models` profiles |
| `system-spec-kit` | Manual dependency. A full-runtime `cli-opencode` dispatch carries the Spec-Kit-Memory runtime |
| `sk-code` | Code implementation, review and debugging, not CLI dispatch. This hub orchestrates the dispatch, `sk-code` owns the work inside it |
| `system-deep-loop` | Related. Ablation-suite and worker-farm patterns that dispatch parallel `cli-opencode` sessions |
| `mcp-code-mode` | Related. The MCP execution substrate a dispatched CLI session can reach once running |
| `sk-doc` | Documentation and component authoring, the sibling parent hub this one's structure mirrors |

---

## 5. VERIFICATION

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration
```

Expected: 0 invariant failures, 0 warnings.
