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
    packet_pointer: "hooks/009-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T21:28:22Z"
    last_updated_by: "codex"
    recent_action: "All post-review implementation repairs and content checks passed"
    next_safe_action: "After authorized delivery, rerun the default strict child and recursive parent gates"
    blockers:
      - "Default strict continuity freshness rejects the intentionally uncommitted packet diff."
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
- [x] T011 Implement SHA-256 keys and active-state adoption (`mk-goal.js`). [EVIDENCE: final focused OpenCode suite passes 128/128.]
- [x] T012 Implement archive adoption and cache invalidation (`mk-goal.js`). [EVIDENCE: lifecycle and system-transform regressions pass.]
- [x] T013 Remove stale runtime-mirror Devin goal prose (`command-scope.cjs`, `sync-runtime-mirrors.cjs`). [EVIDENCE: active residue scan is zero; the final filtered runtime mirror check passes 165 links across eight trees.]
- [x] T014 Remove active goal-specific Devin rows and prompts from operator docs. [EVIDENCE: `rg -n -i devin` across the declared active goal surfaces exits with no match.]
- [x] T015 Update current packet, runtime goal playbooks, and handover truth without rewriting historical evidence. [EVIDENCE: `validate-playbook-package.cjs` reports zero goal-file violations and `validate_document.py` passes all ten goal documents.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run focused state and lifecycle tests during repair. [EVIDENCE: `.opencode/plugins/tests/mk-goal-{state,lifecycle}.test.cjs` passed before the full run.]
- [x] T017 Run all seven focused OpenCode goal test files and compare with baseline. [EVIDENCE: 128/128 pass, up from 119/119.]
- [x] T018 Run syntax, comment-hygiene, and OpenCode alignment gates. [EVIDENCE: `node --check`, `check-comment-hygiene.sh`, and `verify_alignment_drift.py` pass; alignment scans 42 files with zero findings.]
- [x] T019 Run active Devin goal-residue and unchanged-runtime-boundary scans. [EVIDENCE: zero active matches and zero `.devin`/`cli-devin` worktree diff.]
- [x] T020 Run sk-doc structure/validation checks for modified goal docs. [EVIDENCE: `validate_document.py` passes ten goal documents; `validate-playbook-package.cjs` reports zero goal-file violations.]
- [x] T021 Reconcile checklist, implementation summary, parent map, handover, description, graph metadata, and continuity fingerprints. [EVIDENCE: final `validate.sh --strict` generated-metadata integrity and drift gates pass for Phase 6 and its parent.]
- [B] T022 Run strict child validation and recursive strict parent validation from a clean delivered state. [EVIDENCE: the default child exits 0 with 0 errors/warnings; the recursive parent exits 2 with 0 errors/1 parent `dirty_tree` warning while all six children pass.]
- [x] T023 Inspect scoped diff/status and remove task-created residue. [EVIDENCE: `git diff --check` passes, the temporary-artifact scan is empty, and exact scoped status contains only approved surfaces.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Post-Review Repair

- [x] T024 Block archive traversal and overwrite from hostile stored goal identifiers. [EVIDENCE: replace, clear, complete, legacy-migration, and symlink-escape regressions pass in the 49/49 core suite.]
- [x] T025 Serialize same-scope lifecycle mutations and legacy migration across processes. [EVIDENCE: 40/40 concurrent turn updates survive; terminal and migration race regressions pass.]
- [x] T026 Derive scope keys from canonical workspace, runtime, and session identity. [EVIDENCE: `JSON.stringify([workspace, runtime, sessionId])`, nested-repository, cross-runtime, and shared-state-root regressions pass.]
- [x] T027 Fix long-session OpenCode deletion and require embedded legacy session identity. [EVIDENCE: long-id clear and deletion plus missing-identity regressions pass in the 70/70 targeted OpenCode suite.]
- [x] T028 Exclude the OpenCode-only goal command from Claude's checked-in discovery tree. [EVIDENCE: `.claude/commands` is a real filtered tree, the exclusive router is absent, and mirror validation passes 165 links across eight trees.]
- [x] T029 Add adversarial, concurrency, migration, workspace, deletion, and discovery regressions. [EVIDENCE: the complete cross-runtime suite grows to 91/91 and the complete OpenCode suite grows to 128/128.]
- [B] T030 Rerun the authoritative verification matrix and reconcile all completion evidence. [EVIDENCE: 49/49 targeted core, 70/70 targeted OpenCode, 91/91 cross-runtime, 128/128 complete OpenCode, 165/8 mirrors, static/document gates, wrapper separation, and scoped diff checks are recorded; the default strict delivery-state check remains blocked by the required uncommitted packet diff.]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T022 and T030 remain blocked only on an authorized clean delivery state; all implementation tasks are `[x]` with evidence.
- [ ] No `[B]` blocked task remains after the repaired packet paths are delivered cleanly.
- [x] The focused suite has zero failures and increases from 119 to 128 tests.
- [x] Active Devin goal-remnant scan returns zero matches in the declared current surfaces.
- [ ] Default strict Phase 6 and recursive packet validation exit 0 after the repaired packet paths are clean.
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
