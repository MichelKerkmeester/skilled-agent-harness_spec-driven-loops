---
title: "Tasks: Validation + cleanup"
description: "Final validation and cleanup task ledger."
trigger_phrases:
  - "code graph validation cleanup tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/020-validation-and-cleanup"
    last_updated_at: "2026-05-14T08:43:25Z"
    last_updated_by: "codex"
    recent_action: "All tasks complete"
    next_safe_action: "Commit + ship"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Validation + cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Run system-spec-kit typecheck. Evidence: exit 0.
- [x] T002 Run system-code-graph typecheck. Evidence: exit 0 with local offline compiler.
- [x] T003 Run full system-code-graph Vitest. Evidence: exit 0, 33 passed, 1 skipped.
- [x] T004 Run system-spec-kit handler smoke tests. Evidence: exit 0, 1 passed, 1 skipped.
- [x] T005 Run gold-query verifier. Evidence: exit 0, 17 passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Fix validation-only package boundary fallout in `system-code-graph/tsconfig.json`.
- [x] T011 Fix moved-test imports and test cwd/temp workspace behavior.
- [x] T012 Add system-code-graph mcp_server asset allowlist for verifier test batteries.
- [x] T013 Compare old/new DB row counts. Evidence: `OLD_NODES=59816 NEW_NODES=59816`.
- [x] T014 Delete old system-spec-kit code-graph DB fallback after parity.
- [x] T015 Clear active stale old-path references. Evidence: `STALE_REFS_REMAINING=0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Create 006 spec packet.
- [x] T021 Update parent 014 graph metadata and spec continuity.
- [x] T022 Update 007 phase map row for 014 to complete.
- [x] T023 Run strict 006 validation.
- [x] T024 Run recursive 014 validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] Full validation suite green.
- [x] Parent 014 marked complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `007-code-graph/013-system-code-graph-extraction`
- Predecessor: `014/005-doc-and-runtime-migration`
- New skill: `.opencode/skills/system-code-graph/`
<!-- /ANCHOR:cross-refs -->
