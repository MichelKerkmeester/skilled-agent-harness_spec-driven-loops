---
title: "Tasks: Code Graph Launcher and DB Lifecycle"
description: "Task list for Code Graph Launcher and DB Lifecycle."
trigger_phrases:
  - "code-graph-launcher-and-db-lifecycle"
  - "memory leak 7"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle"
    last_updated_at: "2026-05-22T14:05:00Z"
    last_updated_by: "opencode"
    recent_action: "reconciled-completed-task-evidence"
    next_safe_action: "phase-014-b6-strict-validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0707070707070707070707070707070707070707070707070707070707070707"
      session_id: "009-memory-leak-remediation-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is scoped from the 020 and 024 memory-leak research packets."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code Graph Launcher and DB Lifecycle

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Locate the canonical DB dir resolver. Evidence: `implementation-summary.md` What Was Built records `canonical-db-dir.ts` and `resolveCanonicalDbDir(dir)`.
- [x] T002 Add `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` with `acquireOwnerLease`, `refreshOwnerLease`, `releaseOwnerLease`, `readOwnerLease`, and `classifyOwner`. Evidence: `implementation-summary.md` What Was Built + Verification anchors.
- [x] T003 Integrate `acquireOwnerLease` into `.opencode/bin/mk-code-index-launcher.cjs` startup; refuse launch if a live canonical owner exists. Evidence: `implementation-summary.md` How It Was Delivered and owner-lease/launcher test rows.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Integrate `releaseOwnerLease` plus `closeDb()` assertion into the server shutdown path for signal and exit handling. Evidence: `implementation-summary.md` What Was Built and Verification anchors.
- [x] T005 Add `closeDb()` assertion/probe that verifies the prior DB handle is closed after shutdown. Evidence: `implementation-summary.md` What Was Built and targeted close-db test row.
- [x] T006 Add `.opencode/skills/system-code-graph/mcp_server/tests/lib/canonical-db-dir.vitest.ts` covering symlink alias, EPERM, and missing dir. Evidence: `implementation-summary.md` Verification anchor.
- [x] T007 Add `.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts` covering acquire/refresh/release, stale PID, PPID-1 orphan, EPERM, child-survival, and same-effective-DB. Evidence: `implementation-summary.md` Verification anchor.
- [x] T008 Add `.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts` covering closeDb idempotence and the post-shutdown probe. Evidence: `implementation-summary.md` Verification anchor.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Locate package and workspace commands; run system-code-graph targeted tests, full tests, typecheck, and build. Evidence: `implementation-summary.md` Verification anchor.
- [x] T010 Fill `implementation-summary.md` with evidence and commit handoff. Evidence: `implementation-summary.md` Commit Handoff anchor.
- [x] T011 Run strict validation for this phase and the parent arc. Evidence: `implementation-summary.md` Verification anchor.
- [x] T012 Decide read-path friction item #16: either scoped fix if reachable or explicit follow-on note. Evidence: `implementation-summary.md` Known Limitations item 2.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-deferred P0/P1 tasks are complete. Evidence: T001-T012 are checked and cite implementation-summary anchors.
- [x] No destructive cleanup path lacks exact ownership proof. Evidence: `implementation-summary.md` Key Decisions and Known Limitations.
- [x] Validation evidence is recorded in implementation-summary.md. Evidence: `implementation-summary.md` Verification anchor.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent arc**: ../spec.md
- **Source packet 020**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research`
- **Source packet 024**: `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit`
<!-- /ANCHOR:cross-refs -->
