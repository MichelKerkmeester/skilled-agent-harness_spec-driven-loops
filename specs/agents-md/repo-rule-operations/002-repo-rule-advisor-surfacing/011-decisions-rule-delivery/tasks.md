---
title: "Tasks: Phase 11: decisions-rule-delivery"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "decisions rule delivery tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: decisions-rule-delivery

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Find every copy of the Gate 3 notice (`spec-gate-core.mjs`). Verify: `rg -l "where this change should live"` lists the core and its test only.
- [x] T002 Check why extra directive lines were removed (commit `f4ead54766`). Verify: `git show f4ead54766` states the enforcer-versus-disposition rule.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the recommend-one sentence to `GATE_3_MUTATION_NOTICE` and its byte pin (`spec-gate-core.mjs`, `spec-gate-core.test.mjs`). Verify: `node --check` exits 0.
- [x] T004 Add "recommend one" to the Gate 3 options label and shorten the D line (`AGENTS.md`). Verify: `agents-md-manifest.cjs --check` reports 16,376 of 16,384 prefix bytes.
- [x] T005 Regenerate the manifest (`agents-md-manifest.json`). Verify: `agents-md-manifest.cjs --check` prints PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the spec-gate suite (`tests/hooks/spec-gate-core.test.mjs`). Verify: `pass 107 fail 0 skipped 3`.
- [x] T007 Run the AGENTS.md check (`agents-md-check.cjs --source`). Verify: `STATUS=OK rows=12 findings=0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
