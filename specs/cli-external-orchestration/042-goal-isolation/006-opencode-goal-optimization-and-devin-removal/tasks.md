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
    last_updated_at: "2026-08-10T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "All implementation and verification tasks completed"
    next_safe_action: "Monitor digest-keyed state and compatibility migration during normal use"
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

- [x] T006 Add fixed-key and raw-id privacy tests (`mk-goal-state.test.cjs`). [EVIDENCE: state suite covers 64-hex keys, non-reversible names, and distinct sessions.]
- [x] T007 Add the long-session success regression (`mk-goal-state.test.cjs`). [EVIDENCE: a 140-character session id sets and reads through a 69-character `<digest>.json` basename.]
- [x] T008 Add legacy active migration and target-conflict tests (`mk-goal-state.test.cjs`). [EVIDENCE: valid adoption and occupied-target authority pass.]
- [x] T009 Add malformed and mismatched legacy-state tests (`mk-goal-state.test.cjs`). [EVIDENCE: both fail closed while preserving the source.]
- [x] T010 Add legacy archive migration/history tests (`mk-goal-lifecycle.test.cjs`). [EVIDENCE: history remains complete without duplicates.]
- [x] T011 Implement SHA-256 keys and active-state adoption (`mk-goal.js`). [EVIDENCE: focused OpenCode suite passes 125/125.]
- [x] T012 Implement archive adoption and cache invalidation (`mk-goal.js`). [EVIDENCE: lifecycle and system-transform regressions pass.]
- [x] T013 Remove stale runtime-mirror Devin goal prose (`command-scope.cjs`, `sync-runtime-mirrors.cjs`). [EVIDENCE: active residue scan is zero; runtime mirror check passes 131 links across seven trees.]
- [x] T014 Remove active goal-specific Devin rows and prompts from operator docs. [EVIDENCE: `rg -n -i devin` across the declared active goal surfaces exits with no match.]
- [x] T015 Update current packet, runtime goal playbooks, and handover truth without rewriting historical evidence. [EVIDENCE: `validate-playbook-package.cjs` reports zero goal-file violations and `validate_document.py` passes all ten goal documents.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run focused state and lifecycle tests during repair. [EVIDENCE: `.opencode/plugins/tests/mk-goal-{state,lifecycle}.test.cjs` passed before the full run.]
- [x] T017 Run all seven focused OpenCode goal test files and compare with baseline. [EVIDENCE: 125/125 pass, up from 119/119.]
- [x] T018 Run syntax, comment-hygiene, and OpenCode alignment gates. [EVIDENCE: `node --check`, `check-comment-hygiene.sh`, and `verify_alignment_drift.py` pass; alignment scans 42 files with zero findings.]
- [x] T019 Run active Devin goal-residue and unchanged-runtime-boundary scans. [EVIDENCE: zero active matches and zero `.devin`/`cli-devin` worktree diff.]
- [x] T020 Run sk-doc structure/validation checks for modified goal docs. [EVIDENCE: `validate_document.py` passes ten goal documents; `validate-playbook-package.cjs` reports zero goal-file violations.]
- [x] T021 Reconcile checklist, implementation summary, parent map, handover, description, and graph metadata. [EVIDENCE: `generate-description.js` and `backfill-graph-metadata.js` refresh the completed Phase 6 and parent packet.]
- [x] T022 Run strict child validation and recursive strict parent validation from final state. [EVIDENCE: `validate.sh 006-opencode-goal-optimization-and-devin-removal --strict` and `validate.sh 042-goal-isolation --strict --recursive` exit 0.]
- [x] T023 Inspect scoped diff/status and remove task-created renderer and backup residue. [EVIDENCE: `git diff --check` passes and final `find` output contains no backup/render directory.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T023 tasks are marked `[x]` with evidence in `checklist.md` and `implementation-summary.md`.
- [x] No `[B]` blocked task remains.
- [x] The focused suite has zero failures and increases from 119 to 125 tests.
- [x] Active Devin goal-remnant scan returns zero matches in the declared current surfaces.
- [x] Strict Phase 6 and recursive packet validation exit 0.
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
