---
title: "Code Graph Runtime Lib: Freshness Core"
description: "Runtime-neutral policy that decides when a stale code graph should self-heal with a warm-only incremental scan."
---

# Code Graph Runtime Lib

---

## 1. OVERVIEW

`runtime/lib/code-graph/` owns the one policy module both PostToolUse hook adapters (`runtime/hooks/claude/`, `runtime/hooks/codex/`) and the OpenCode plugin (`.opencode/plugins/mk-code-graph-freshness.js`) call into after an edit lands. It decides `scan` / `defer` / `disabled` for a given file edit and returns a transport-free decision so each adapter can spawn or log in its own runtime's idiom. This module never writes to stdout or stderr and never spawns a process itself, it only persists state, so all three callers share one bounded freshness log and one state directory instead of three divergent policies.

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    CODE GRAPH FRESHNESS POLICY                    │
╰──────────────────────────────────────────────────────────────────╯

┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Claude hook   │   │ Codex hook    │   │ OpenCode      │
│ (PostToolUse) │   │ (PostToolUse) │   │ plugin        │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                             ▼
                  ┌────────────────────┐
                  │ freshness-core.cjs │
                  │ evaluateEdit()     │
                  └─────────┬──────────┘
                             │
        debounce -> empty gate -> warm probe -> lock
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
           decision: scan        decision: defer
           (adapter spawns       (adapter logs,
            detached scan)        no dispatch)
```

`evaluateEdit()` runs a fixed gate order: debounce the edit into a per-session pending set, defer on an empty graph unless the bootstrap opt-in is set, defer if the daemon heartbeat is not warm, defer on a concurrent in-flight scan lock, then return a `scan` decision with a ready-to-spawn dispatch spec.

## 3. CONTENTS

| File | Purpose |
|------|---------|
| `freshness-core.cjs` | The policy: `evaluateEdit()`, `classifyEditScope()`, debounce state read/write, scan-lock acquire/release, freshness-log append and rotation and a periodic stale-state sweep |
| `freshness-core.vitest.ts` | Unit tests pinning the scan / defer-cold / defer-empty guarantees plus debounce, scope-filter, concurrency and drain behavior against a throwaway temp project directory |

## 4. KEY EXPORTS

| Export | Purpose |
|---|---|
| `evaluateEdit(request)` | Main entrypoint, returns `{decision, dispatch?, audits, warnings}` for one file edit |
| `classifyEditScope(filePath, env)` | Decides whether an edited path is inside the currently-scoped index directories |
| `acquireScanLock` / `releaseScanLock` | Cooperative lock so two adapters never dispatch overlapping scans |
| `appendFreshnessLog` | Appends one audit or warning line to the shared rotating freshness log |
| `sweepStaleFreshnessState` / `drainPending` | Periodic cleanup of expired debounce state and archived log files |
| `resolveFreshnessPaths` | Resolves the state directory, lock path and log path for a given project directory |

## 5. VALIDATION

```bash
cd .opencode/skills/system-code-graph/runtime && npx vitest run lib/code-graph/freshness-core.vitest.ts
```

## 6. RELATED

- [`runtime/hooks/claude/`](../../hooks/claude/README.md)
- [`runtime/hooks/codex/`](../../hooks/codex/README.md)
- [`.opencode/plugins/mk-code-graph-freshness.js`](../../../../../plugins/mk-code-graph-freshness.js) for the OpenCode plugin adapter
