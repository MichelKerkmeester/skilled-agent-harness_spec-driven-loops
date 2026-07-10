---
title: "Tasks: mk-code-index reconnecting session proxy"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code-index reconnecting proxy tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy"
    last_updated_at: "2026-06-07T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked implementation + verification tasks complete"
    next_safe_action: "Phase 021 orphan-sweeper activation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-020-code-index-reconnecting-proxy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: mk-code-index reconnecting session proxy

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm `createSessionProxy` accepts an injectable `classify` + the mk-spec-memory reference wiring
- [x] T002 Confirm mk-code-index used the raw bridge (no `bridge` option) and ran via an unguarded IIFE
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `createClassifyFrame` factory; rebuild default `classifyFrame` from it; export it (`launcher-session-proxy.cjs`)
- [x] T004 Add code-graph replayable/unsafe sets + `classifyCodeIndexFrame` + `bridgeStdioThroughSessionProxy` (`mk-code-index-launcher.cjs`)
- [x] T005 Pass `bridge: bridgeStdioThroughSessionProxy` to the lease-holder check; add `require.main` guard + module.exports (`mk-code-index-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `node --check` both files + 13-assertion require smoke (guard inert; classifier correct)
- [x] T007 Add `launcher-code-index-proxy.vitest.ts`; confirm session-proxy default classifier unchanged
- [x] T008 Full launcher suite green (code-index proxy + session-proxy + watchdog + reap + persistent-log)
- [x] T009 `validate.sh --strict` for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Tests + syntax verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
