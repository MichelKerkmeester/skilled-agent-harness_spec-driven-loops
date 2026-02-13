# Tasks: Command Alignment (Post JS-to-TS Migration)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

**Replace Pattern**: `scripts/memory/generate-context.js` → `scripts/dist/memory/generate-context.js`

---

## Phase 1: Fix generate-context.js Paths in Command .md Files

- [ ] T001 [P] [P0] Fix path in complete.md line 382 (`command/spec_kit/complete.md`) → CHK-020
- [ ] T002 [P] [P0] Fix path in handover.md line 323 (`command/spec_kit/handover.md`) → CHK-020
- [ ] T003 [P] [P0] Fix paths in plan.md lines 449, 455 (`command/spec_kit/plan.md`) → CHK-020
- [ ] T004 [P] [P0] Fix paths in research.md lines 575, 596, 624, 858 (`command/spec_kit/research.md`) → CHK-020
- [ ] T005 [P] [P0] Fix path in agent.md line 549 (`command/create/agent.md`) → CHK-020
- [ ] T006 [P] [P0] Fix paths in save.md lines 282, 424, 457-458, 477, 499, 502, 877 (`command/memory/save.md`) → CHK-020

**Phase Gate**: `grep -r "scripts/memory/generate-context.js" .opencode/command/**/*.md` returns 0 results → CHK-021

---

## Phase 2: Fix generate-context.js Paths in YAML Asset Files

- [ ] T007 [P] [P0] Fix path in spec_kit_research_auto.yaml line 976 (`command/spec_kit/assets/`) → CHK-022
- [ ] T008 [P] [P0] Fix path in spec_kit_research_confirm.yaml line 1069 (`command/spec_kit/assets/`) → CHK-022
- [ ] T009 [P] [P0] Fix path in spec_kit_complete_auto.yaml line 1896 (`command/spec_kit/assets/`) → CHK-022
- [ ] T010 [P] [P0] Fix path in spec_kit_complete_confirm.yaml line 1790 (`command/spec_kit/assets/`) → CHK-022
- [ ] T011 [P] [P0] Fix path in spec_kit_implement_auto.yaml (`command/spec_kit/assets/`) → CHK-022
- [ ] T012 [P] [P0] Fix path in spec_kit_implement_confirm.yaml (`command/spec_kit/assets/`) → CHK-022
- [ ] T013 [P] [P0] Fix path in create_agent.yaml line 386 (`command/create/assets/`) → CHK-022

**Phase Gate**: `grep -r "scripts/memory/generate-context.js" .opencode/command/**/*.yaml` returns 0 results → CHK-023

---

## Phase 3: Fix create-spec-folder.sh References

Replace: `create-spec-folder.sh` → `create.sh` (at `scripts/spec/create.sh`)

- [ ] T014 [P] [P1] Fix reference in spec_kit_complete_auto.yaml line 1136 (`command/spec_kit/assets/`) → CHK-024
- [ ] T015 [P] [P1] Fix reference in spec_kit_complete_confirm.yaml line 1142 (`command/spec_kit/assets/`) → CHK-024
- [ ] T016 [P] [P1] Fix reference in spec_kit_plan_auto.yaml line 676 (`command/spec_kit/assets/`) → CHK-024
- [ ] T017 [P] [P1] Fix reference in spec_kit_plan_confirm.yaml line 710 (`command/spec_kit/assets/`) → CHK-024

**Phase Gate**: `grep -r "create-spec-folder.sh" .opencode/command/` returns 0 results → CHK-025

---

## Phase 4: Verification

- [ ] T018 [P0] Run full grep validation for old generate-context.js paths → CHK-021, CHK-023
- [ ] T019 [P0] Run full grep validation for create-spec-folder.sh → CHK-025
- [ ] T020 [P0] Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help` → CHK-026
- [ ] T021 [P1] Review git diff for unintended changes → CHK-027
- [ ] T022 [P1] Verify all changed files parse correctly (no broken YAML/Markdown) → CHK-028

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification phase passed (grep + runtime + diff)
- [ ] All P0 checklist items verified

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T006 | CHK-020 (per-file path fix) | P0 | [ ] |
| T006 | CHK-021 (md grep validation) | P0 | [ ] |
| T007-T013 | CHK-022 (per-file path fix) | P0 | [ ] |
| T013 | CHK-023 (yaml grep validation) | P0 | [ ] |
| T014-T017 | CHK-024 (script ref fix) | P1 | [ ] |
| T017 | CHK-025 (script ref grep) | P1 | [ ] |
| T020 | CHK-026 (runtime smoke) | P0 | [ ] |
| T021 | CHK-027 (diff review) | P1 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Phase 1 Complete
- [ ] All P0 .md path fix tasks done (T001-T006)
- [ ] grep returns 0 for old path in .md files

### Gate 2: Phase 2 Complete
- [ ] All P0 .yaml path fix tasks done (T007-T013)
- [ ] grep returns 0 for old path in .yaml files

### Gate 3: Phase 3 Complete
- [ ] All P1 script ref tasks done (T014-T017)
- [ ] grep returns 0 for `create-spec-folder.sh`

### Gate 4: Verification Complete
- [ ] Runtime smoke test passes (T020)
- [ ] Diff review clean (T021)

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| None | — | — | — |

---

## L3: ARCHITECTURE TASKS

### ADR Implementation

| Task ID | ADR Reference | Description | Status |
|---------|---------------|-------------|--------|
| T001-T013 | ADR-001 | Update paths (chosen over shim approach) | [ ] |

---

## L3: MILESTONE TRACKING

| Milestone | Target | Tasks Required | Status |
|-----------|--------|----------------|--------|
| M1 | Phase 1 | T001-T006 | [ ] |
| M2 | Phase 2 | T007-T013 | [ ] |
| M3 | Phase 4 | T018-T022 | [ ] |

---

## L3: RISK MITIGATION TASKS

| Task ID | Risk ID | Mitigation Action | Priority | Status |
|---------|---------|-------------------|----------|--------|
| T021 | R-001 | Review diff to catch unintended symlink propagation | P1 | [ ] |
| T022 | R-002 | Validate YAML/MD structure not broken by edits | P1 | [ ] |
