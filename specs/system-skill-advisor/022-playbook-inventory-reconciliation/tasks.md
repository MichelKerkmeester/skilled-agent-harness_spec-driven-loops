---
title: "Tasks: Playbook Inventory Reconciliation"
description: "Task breakdown for reconciling the manual-testing-playbook table + inventory test to the real 47 kebab-named scenario files."
trigger_phrases:
  - "playbook inventory tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/022-playbook-inventory-reconciliation"
    last_updated_at: "2026-08-16T04:15:28Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled 43 stale round-trip links + the kebab dir glob; inventory test green, tsc exit 0"
    next_safe_action: "Commit the two-file reconciliation; land on v4 + main per operator gate"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Playbook Inventory Reconciliation

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

- [x] T001 Enumerate the real corpus: `find manual-testing-playbook -mindepth 2 -name '*.md' ! -name README.md` → 47 files across 9 kebab dirs
- [x] T002 Confirm no depth-2 `README.md` (disk `.md` count == scenario count == 47) and no hidden top-level dirs
- [x] T003 Map every table row to a real file: `47/47` linked rows map one-to-one to disk files; `CL-004` is an unlinked "not yet authored" placeholder (no file, invisible to the test)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the 43 stale round-trip links `](../manual-testing-playbook/<cat>/<file>)` → `](<cat>/<file>)` in `manual-testing-playbook.md` (the 4 already-correct direct links untouched)
- [x] T005 Fix the one stale test mechanic: directory glob `/^\d{2}--/` → `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` in `manual-testing-playbook.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Inventory test green: `vitest run tests/manual-testing-playbook.vitest.ts` → 1 passed
- [x] T007 Typecheck: `tsc --noEmit --composite false -p tsconfig.build.json` exit 0
- [x] T008 Diff review: doc is 43↔43 link-prefix swaps only; test is one regex line; no `.skip`/removed assertion/lowered count
- [x] T009 `validate.sh --strict` exits clean on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Inventory test green because the doc matches reality; the row↔file equality + `existsSync` checks preserved
- [x] No scenario fabricated or dropped (47 ↔ 47, one-to-one)
- [x] Closes sibling packet 021's `manual-testing-playbook` residual
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
