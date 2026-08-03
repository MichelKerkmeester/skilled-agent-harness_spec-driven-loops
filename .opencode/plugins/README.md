---
title: "OpenCode Plugin Entrypoints"
description: "JavaScript plugin entrypoints for context injection, lifecycle handling, policy guards, runtime tools and post-action checks."
trigger_phrases:
  - "OpenCode plugins"
  - "plugin entrypoints"
  - "OpenCode hook events"
---

# OpenCode Plugin Entrypoints

---

## 1. OVERVIEW

`.opencode/plugins/` contains the JavaScript modules that OpenCode discovers as local plugins. Each module exposes a default plugin factory that registers tools, hook handlers or lifecycle handlers with the host.

The directory inventory is authoritative for the auto-loaded plugin surface. Shared policy cores stay under their owning skill. Plugin adapters translate OpenCode events into those cores and keep terminal output out of the TUI.

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `mk-cli-dispatch-audit.js` | Records redacted dispatch telemetry after completed CLI calls. |
| `mk-codex-hooks-watchdog.js` | Watches Codex hook installation and reports drift. |
| `mk-completion-sentinel.js` | Checks completion evidence at session lifecycle points. |
| `mk-deep-loop-guard.js` | Checks deep-loop Task dispatches and repeat handoffs. |
| `mk-dist-freshness-guard.js` | Reports stale compiled outputs and invalidates diagnostics. |
| `mk-git-preflight-advisory.js` | Advises on Git command scope before execution. |
| `mk-goal.js` | Stores and injects session goals and lifecycle state. |
| `mk-mcp-route-guard.js` | Advises when native MCP calls should use Code Mode. |
| `mk-post-edit-quality.js` | Runs bounded post-edit quality checks. |
| `mk-skill-advisor.js` | Injects skill-routing guidance and exposes advisor status. |
| `mk-spec-gate.js` | Classifies and evaluates mutation-gate state. |
| `mk-spec-memory.js` | Injects Spec Kit continuity and exposes memory status. |
| `mk-speckit-completion.js` | Exposes read-only completion evidence. |
| `session-cleanup.js` | Performs bounded session and host cleanup. |
| `tests/` | Contains the plugin regression suites. |

## 3. HOOK MODEL

Plugin factories register tools, `tool.execute.before`, `tool.execute.after`, system transforms, lifecycle events and disposal hooks. Advisory checks remain fail-open unless their own contract enables rejection.

## 4. BOUNDARIES

- Plugin files own the OpenCode transport boundary.
- Shared policy and runtime-neutral logic belongs under the owning skill.
- Plugins do not print warnings to standard output or standard error.
- Plugin tests stay under `tests/`.

## 5. VALIDATION

Run the Node regression command from the repository root:

```bash
node --test .opencode/plugins/tests/*.test.cjs
```

Expected result: Node discovers every current CJS test file and reports the suite result. A failing test is a validation failure.

## 6. RELATED

- [`Plugin tests`](./tests/README.md)
- [`Shared skill cores`](../skills/)
