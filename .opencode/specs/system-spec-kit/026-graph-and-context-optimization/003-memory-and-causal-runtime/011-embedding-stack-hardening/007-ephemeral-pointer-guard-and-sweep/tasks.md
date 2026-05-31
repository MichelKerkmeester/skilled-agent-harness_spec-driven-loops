---
title: "Tasks: Ephemeral-pointer guard + comprehensive comment sweep"
description: "Task tracker for building the sk-code §4 comment guard and sweeping the tree guard-clean."
trigger_phrases:
  - "ephemeral pointer guard sweep tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/007-ephemeral-pointer-guard-and-sweep"
    last_updated_at: "2026-05-29T21:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Sweep complete; tree guard-clean"
    next_safe_action: "Commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003173"
      session_id: "031-007-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Ephemeral-pointer guard + comprehensive comment sweep

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Author the guard `scripts/validation/ephemeral-pointer-audit.mjs` (comment-region detector, stdlib only)
- [x] T002 Tune precision: self-exclusion + `Safeguard #N` internal-enumeration carve-out; validate BAD/GOOD fixture

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Parallel sweep — 11 agents over disjoint roots, each self-verifying to guard-clean (253 fixed)
- [x] T004 Fix 8 whole-tree stragglers the batching missed: lib/telemetry, scripts/extractors, scripts/optimizer + 3 fixture-annotation FPs
- [x] T005 Reconcile false positives (Safeguard #N enumeration; fixture-value annotations) — guard tuned / comments rephrased

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Whole-tree guard → 0 violations (exit 0)
- [x] T007 Build both workspaces (exit 0); zero `dist/` drift; `node --check` touched `.cjs`
- [x] T008 Commit guard + sweep + packet docs with explicit pathspecs; verify `git show HEAD --name-only`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Guard-clean + builds pass + committed

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: ../006-comment-ephemeral-pointer-cleanup

<!-- /ANCHOR:cross-refs -->
