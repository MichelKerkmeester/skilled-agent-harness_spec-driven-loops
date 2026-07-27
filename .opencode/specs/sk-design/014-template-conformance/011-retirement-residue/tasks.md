---
title: "Tasks: Close retirement residue + finish interrupted design-interface leaf docs"
description: "Task breakdown for the two independent tracks: fix five vocabulary-residue sites, and verify-then-reconcile 006-009's leaf documentation."
trigger_phrases:
  - "retirement residue tasks"
  - "audit foundations vocabulary cleanup tasks"
  - "design-interface leaf docs finish tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across two tracks"
    next_safe_action: "Start T001"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/006-scripts/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Close retirement residue + finish interrupted design-interface leaf docs
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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Track A — vocabulary residue, ~1h]

- [ ] T001 [P] Re-confirm + fix procedure-card inventory (`design-md-generator/SKILL.md:246`) [15m]
- [ ] T002 [P] Re-confirm + fix `foundations`/`audit` test cases (`compiled-routing/.../006-sk-design/fixtures/canary-cases.v1.json`) [15m]
- [ ] T003 [P] Re-confirm + fix sk-design row (`.opencode/install-guides/README.md`) [10m]
- [ ] T004 [P] Re-confirm + fix `invocation_aliases` (`sk-doc/create-command/assets/command-contract.json:81`) [10m]
- [ ] T005 [P] Re-confirm + fix mode-count claim (`manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md:34`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Track B — leaf verification, ~2h]

- [ ] T006 Read `006-scripts/spec.md` in full; inspect `design-interface/scripts/` on disk (`002-design-interface/006-scripts/spec.md`) [20m]
- [ ] T007 Reconcile `006-scripts/checklist.md` + `implementation-summary.md` to verified state (`006-scripts/`) [15m]
- [ ] T008 Read `007-feature-catalog/spec.md` in full; inspect `design-interface/feature-catalog/` on disk (`007-feature-catalog/spec.md`) [20m]
- [ ] T009 Reconcile `007-feature-catalog/checklist.md` + `implementation-summary.md` to verified state (`007-feature-catalog/`) [15m]
- [ ] T010 Read `008-manual-testing-playbook/spec.md` in full; inspect `design-interface/manual-testing-playbook/` on disk (`008-manual-testing-playbook/spec.md`) [20m]
- [ ] T011 Reconcile `008-manual-testing-playbook/checklist.md` + `implementation-summary.md` to verified state (`008-manual-testing-playbook/`) [15m]
- [ ] T012 Read `009-changelog/spec.md` in full; inspect `design-interface/changelog/` on disk (`009-changelog/spec.md`) [20m]
- [ ] T013 Reconcile `009-changelog/checklist.md` + `implementation-summary.md` to verified state (`009-changelog/`) [15m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

- [ ] T014 `rg -n "foundations|audit"` across all five Track A sites returns nothing (no path) [10m]
- [ ] T015 Cross-read each of `006-009`'s checklist vs. implementation-summary for consistency (no path) [10m]
- [ ] T016 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/011-retirement-residue --strict` exits 0 (no path) [5m]
- [ ] T017 Mark this packet's own checklist.md items with evidence (`checklist.md`) [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] No Track B checklist mark is unsupported by real evidence
- [ ] `design-motion/`-internal residue explicitly deferred, not touched
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
