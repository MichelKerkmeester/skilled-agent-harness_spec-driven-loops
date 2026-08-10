---
title: "Tasks: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "Execution ledger for fixed OpenCode goal-state keys, safe legacy migration, active Devin goal-residue removal, and final verification."
trigger_phrases:
  - "opencode goal optimization tasks"
  - "devin goal residue tasks"
  - "goal state migration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T17:45:00Z"
    last_updated_by: "codex"
    recent_action: "Task graph established"
    next_safe_action: "Implement the failing storage tests"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OpenCode Goal Optimization and Devin Goal Remnant Removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the OpenCode plugin and all storage consumers (`.opencode/plugins/mk-goal.js`). [EVIDENCE: `rg` producer/consumer inventory and full source read completed.]
- [x] T002 Inventory focused tests, active goal docs, mirror exceptions, and Devin goal remnants. [EVIDENCE: `.opencode/hooks/goal/README.md:1` anchors the active inventory; historical spec matches are excluded.]
- [x] T003 Capture the 119/119 focused baseline. [EVIDENCE: `node --test` reported 119 passed and 0 failed.]
- [x] T004 Reproduce the long-id `ENAMETOOLONG` failure with an isolated state root. [EVIDENCE: 140-character id resolved to a 285-character basename and failed with `ENAMETOOLONG`.]
- [x] T005 Scaffold and author the Level-2 Phase 6 packet from manifest templates. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` exist.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add fixed-key and raw-id privacy tests (`mk-goal-state.test.cjs`).
- [ ] T007 Add the long-session success regression (`mk-goal-state.test.cjs`).
- [ ] T008 Add legacy active migration and target-conflict tests (`mk-goal-state.test.cjs`).
- [ ] T009 Add malformed and mismatched legacy-state tests (`mk-goal-state.test.cjs`).
- [ ] T010 Add legacy archive migration/history tests (`mk-goal-lifecycle.test.cjs`).
- [ ] T011 Implement SHA-256 keys and active-state adoption (`mk-goal.js`).
- [ ] T012 Implement archive adoption and cache invalidation (`mk-goal.js`).
- [ ] T013 Remove stale runtime-mirror Devin goal prose (`command-scope.cjs`, `sync-runtime-mirrors.cjs`).
- [ ] T014 Remove active goal-specific Devin rows and prompts from operator docs.
- [ ] T015 Update current packet and handover runtime truth without rewriting historical evidence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run focused state and lifecycle tests during repair.
- [ ] T017 Run all seven focused OpenCode goal test files and compare with baseline.
- [ ] T018 Run syntax, comment-hygiene, and OpenCode alignment gates.
- [ ] T019 Run active Devin goal-residue and unchanged-runtime-boundary scans.
- [ ] T020 Run sk-doc structure/validation checks for modified goal docs.
- [ ] T021 Reconcile checklist, implementation summary, parent map, handover, description, and graph metadata.
- [ ] T022 Run strict child validation and recursive strict parent validation from final state.
- [ ] T023 Inspect scoped diff/status and remove task-created renderer and backup residue.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T023 tasks are marked `[x]` with evidence in `checklist.md` and `implementation-summary.md`.
- [ ] No `[B]` blocked task remains.
- [ ] The focused suite has zero failures and no test-count regression from the 119-test baseline.
- [ ] Active Devin goal-remnant scan returns zero matches in the declared current surfaces.
- [ ] Strict Phase 6 and recursive packet validation exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Parent packet**: `../spec.md`
- **Predecessor handover**: `../005-verification-and-validation/handover.md`
<!-- /ANCHOR:cross-refs -->
