---
title: "Tasks: Realign + Relocate the Styles Manual-Testing Playbook"
description: "Task breakdown for converting the styles playbook to the create-manual-testing-playbook package shape, relocating it, and updating inbound references. Planning — all tasks pending."
trigger_phrases:
  - "styles playbook relocate tasks"
  - "create-manual-testing-playbook task breakdown"
  - "styles playbook per-feature files"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/010-manual-testing-playbook-and-db-readme/001-playbook-realign-and-relocate"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored L2 tasks for playbook realign"
    next_safe_action: "Start Phase 1 setup"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/styles/tests/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-001-playbook-realign-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Realign + Relocate the Styles Manual-Testing Playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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
## Phase 1: Setup

- [ ] T001 Confirm the four category folders and feature-ID policy (preserve DB-01..08 / CMD-01..03 vs migrate) [15m]
- [ ] T002 Confirm `styles/docs/README.md` disposition (delete-with-move vs keep `docs/`) [5m]
- [ ] T003 Create `styles/manual-testing-playbook/` root + category folders (`database-adapter/`, `database-indexer-retrieval/`, `database-operator/`, `interface-commands/`) [10m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Root Playbook
- [ ] T004 Author root `manual-testing-playbook/manual-testing-playbook.md` from `assets/manual-testing-playbook-template.md` (overview, preconditions, evidence rules, review + orchestration, category summaries) [1h]

### Per-Feature Files (from `assets/manual-testing-playbook-snippet-template.md`)
- [ ] T005 [P] DB-01 adapter-defaults-to-legacy (`database-adapter/`) [15m]
- [ ] T006 [P] DB-02 database-test-suite-green (`database-indexer-retrieval/`) [15m]
- [ ] T007 [P] DB-04 indexer-lifecycle-publish (`database-indexer-retrieval/`) [15m]
- [ ] T008 [P] DB-05 retrieval-eligibility-first-rrf (`database-indexer-retrieval/`) [15m]
- [ ] T009 [P] DB-06 vector-drain-reclaims-stale-job (`database-indexer-retrieval/`) [15m]
- [ ] T010 [P] DB-03 legacy-engine-unregressed (`database-operator/`) [15m]
- [ ] T011 [P] DB-07 operator-surface (`database-operator/`) [15m]
- [ ] T012 [P] DB-08 generation-retention (`database-operator/`) [15m]
- [ ] T013 [P] CMD-01 interface-command-routing (`interface-commands/`) [15m]
- [ ] T014 [P] CMD-02 creation-contract-blocks (`interface-commands/`) [15m]
- [ ] T015 [P] CMD-03 design-namespace-retired (`interface-commands/`) [15m]

### Reconciliation
- [ ] T016 Reconcile every verdict to `PASS`/`FAIL`/`SKIP`; map each former `PARTIAL` explicitly [20m]
- [ ] T017 Synchronize prompt text across scenario contract, execution table, and root summary [20m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Relocate
- [ ] T018 Delete `styles/docs/manual-testing-playbook.md` [5m]
- [ ] T019 Update `styles/tests/README.md:16` link `../docs/manual-testing-playbook.md` -> `../manual-testing-playbook/manual-testing-playbook.md` [5m]
- [ ] T020 Resolve `styles/docs/README.md` and remove `styles/docs/` if it ends up empty [5m]

### Verification
- [ ] T021 Run `validate_document.py --type reference` on the root playbook [5m]
- [ ] T022 Run `extract_structure.py` on the root playbook [5m]
- [ ] T023 Manual spot-check per-feature files (frontmatter, numbered sections, dividers, prompt sync, feature-ID count = 11) [15m]
- [ ] T024 Confirm markdown link guard is clean across the moved package + updated references [5m]

### Documentation
- [ ] T025 Update `spec.md` status and complete `implementation-summary.md` with evidence [10m]
- [ ] T026 Mark all `checklist.md` items with evidence [10m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Root playbook passes shared validation
- [ ] Per-feature spot-check passed (11 feature IDs, one file each)
- [ ] Inbound references resolve; markdown link guard clean
- [ ] `checklist.md` fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
