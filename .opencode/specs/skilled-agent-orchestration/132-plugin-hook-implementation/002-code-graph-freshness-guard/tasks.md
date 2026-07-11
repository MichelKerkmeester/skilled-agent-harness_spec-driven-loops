---
title: "Tasks: Incremental Code-Graph Freshness Guard"
description: "Task breakdown for the post-edit code-graph freshness guard: shared core, OpenCode adapter, Claude adapter, settings.json/README wiring, and the first pinning test. Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code graph freshness tasks"
  - "freshness core tasks"
  - "warm-only scan tasks"
  - "post-edit guard tasks"
  - "code-graph-freshness-guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/002-code-graph-freshness-guard"
    last_updated_at: "2026-07-11T08:51:11.174Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 task breakdown across Setup / Implementation / Verification"
    next_safe_action: "Await approval, then start T001 (create the runtime tree and state-dir constants)"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/plugins/mk-code-graph-freshness.js"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-code-graph-freshness-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Incremental Code-Graph Freshness Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Create the greenfield runtime tree `runtime/lib/code-graph/` and `runtime/hooks/claude/` under `system-code-graph` (`.opencode/skills/system-code-graph/runtime/`)
- [ ] T002 Define the state dir and log constants: `.opencode/skills/.code-graph-freshness-state` (sibling to `.loop-guard-state`) and the bounded append-only log path
- [ ] T003 [P] Port the atomic hex-keyed state write, sweep/retention, and append-log helpers from `dispatch-guard.cjs` (`.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement `evaluateEdit({filePath,sessionID,now,projectDir,env})` gate chain: paths -> in-scope filter -> empty gate -> debounce -> warm probe -> concurrency -> scan (`.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs`)
- [ ] T005 Implement `drainPending()`, `sweepStaleFreshnessState()`, `probeDaemonWarm()`, and `appendFreshnessLog()`; keep the core output-free and non-dispatching (`.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs`)
- [ ] T006 Build the OpenCode adapter: default-export-only factory, `tool.execute.after` normalize + detached spawn + in-memory `setTimeout` drain, `event` session lifecycle, test surface on `__test` (`.opencode/plugins/mk-code-graph-freshness.js`)
- [ ] T007 Build the Claude adapter: stdin JSON reader, `tool_name in {Write,Edit}` gate, detached spawn on `scan`, always `process.exit(0)`, `main().catch(() => process.exit(0))` (`.opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs`)
- [ ] T008 Wire the Claude adapter as a SECOND command inside the existing PostToolUse `Write|Edit` array without replacing sk-code's hook (`.claude/settings.json`)
- [ ] T009 Register the plugin in the catalog and note its default-export-only, fail-open posture (`.opencode/plugins/README.md`)
- [ ] T010 Add fail-open try/catch around every adapter hook and detached+unref `stdio:'ignore'` spawn; clear `.scan.lock` on child exit (both adapter files)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Author the first pinning test: seed hex(sessionID) state with `firstPendingAt = now-25000ms`, a fresh `.code-graph-owner.json` (`lastHeartbeatIso=now`, `ttlMs=60000`), and a non-empty `.code-graph-readiness.json`; assert `decision==='scan'` and `dispatch.args` includes `--warm-only` and `{"incremental":true}` (`.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.vitest.ts`)
- [ ] T012 Add the two guarantee assertions: flip heartbeat to `now-90000ms` -> `defer-cold` with no dispatch; set readiness `graphFreshness:'empty'` -> `defer-empty` (`.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.vitest.ts`)
- [ ] T013 Add debounce, scope-filter, and drain unit cases; run adapter smoke, `opencode-plugins-folder-purity`, and command-tree parity
- [ ] T014 Manual dry run: an in-scope edit (`src/foo.ts`) and an out-of-scope edit (`.opencode/skills/x/SKILL.md`); confirm scan vs out-of-scope skip and no TUI output
- [ ] T015 Update documentation (spec/plan/tasks/checklist/decision-record) and the phase changelog entry
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
