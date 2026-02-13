# Tasks: Phase 19 — workflows-code--opencode Alignment (Part 2)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) — Est. LOC changed`

---

## Phase 1: install_scripts Core (5 scripts, ~2,722 LOC)

**Constraint**: `_utils.sh` MUST be completed first (sourced by all other install scripts).

- [ ] T001 Align `_utils.sh` to Shell P0/P1 standards (`install_guides/install_scripts/_utils.sh`) — ~150-200 LOC
  - Shebang, COMPONENT header, strict mode, variable quoting, snake_case functions, local vars, WHY comments, remove commented-out code
- [ ] T002 [P] Align `install-all.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-all.sh`) — ~80-120 LOC
- [ ] T003 [P] Align `install-code-mode.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-code-mode.sh`) — ~70-100 LOC
- [ ] T004 [P] Align `install-figma.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-figma.sh`) — ~80-120 LOC
- [ ] T005 [P] Align `install-narsil.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-narsil.sh`) — ~100-150 LOC

**Phase 1 Verification**:
- [ ] T006 Run `bash -n` on all 5 Phase 1 scripts
- [ ] T007 Verify `_utils.sh` functions still sourced correctly by other scripts

---

## Phase 2: install_scripts Remaining (4 scripts, ~1,349 LOC)

- [ ] T008 [P] Align `install-chrome-devtools.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-chrome-devtools.sh`) — ~60-90 LOC
- [ ] T009 [P] Align `install-sequential-thinking.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-sequential-thinking.sh`) — ~30-50 LOC
- [ ] T010 [P] Align `install-spec-kit-memory.sh` to Shell P0/P1 standards (`install_guides/install_scripts/install-spec-kit-memory.sh`) — ~50-70 LOC
- [ ] T011 [P] Align `test/run-tests.sh` to Shell P0/P1 standards (`install_guides/install_scripts/test/run-tests.sh`) — ~20-30 LOC

**Phase 2 Verification**:
- [ ] T012 Run `bash -n` on all 4 Phase 2 scripts
- [ ] T013 Verify all 9 install scripts source `_utils.sh` correctly

---

## Phase 3: mcp-code-mode Scripts (2 scripts, ~452 LOC)

- [ ] T014 Align `update-code-mode.sh` to Shell P0/P1 standards (`skill/mcp-code-mode/scripts/update-code-mode.sh`) — ~25-40 LOC
- [ ] T015 Align `validate_config.py` to Python P0/P1 standards (`skill/mcp-code-mode/scripts/validate_config.py`) — ~60-100 LOC
  - Shebang, COMPONENT header, module docstring, type hints, snake_case, UPPER_SNAKE_CASE constants, Google-style docstrings, specific exceptions, early return, import ordering

**Phase 3 Verification**:
- [ ] T016 Run `bash -n` on `update-code-mode.sh`
- [ ] T017 Run `py_compile` on `validate_config.py`

---

## Phase 4: workflows-documentation Scripts (7 scripts, ~3,373 LOC)

- [ ] T018 Align `extract_structure.py` to Python P0/P1 standards (`skill/workflows-documentation/scripts/extract_structure.py`) — ~150-250 LOC
  - Largest Python script (1,124 LOC); expect significant type hint additions
- [ ] T019 [P] Align `validate_document.py` to Python P0/P1 standards (`skill/workflows-documentation/scripts/validate_document.py`) — ~100-150 LOC
- [ ] T020 [P] Align `package_skill.py` to Python P0/P1 standards (`skill/workflows-documentation/scripts/package_skill.py`) — ~80-120 LOC
- [ ] T021 [P] Align `init_skill.py` to Python P0/P1 standards (`skill/workflows-documentation/scripts/init_skill.py`) — ~60-90 LOC
- [ ] T022 [P] Align `quick_validate.py` to Python P0/P1 standards (`skill/workflows-documentation/scripts/quick_validate.py`) — ~20-40 LOC
- [ ] T023 Align `validate_flowchart.sh` to Shell P0/P1 standards (`skill/workflows-documentation/scripts/validate_flowchart.sh`) — ~20-30 LOC
- [ ] T024 Align `tests/test_validator.py` to Python P0/P1 standards (`skill/workflows-documentation/scripts/tests/test_validator.py`) — ~40-60 LOC
  - Test file exemptions apply (Phase 17 ADR A7: relaxed docstring, type hint, and header requirements)

**Phase 4 Verification**:
- [ ] T025 Run `bash -n` on `validate_flowchart.sh`
- [ ] T026 Run `py_compile` on all 6 Python files (including test)
- [ ] T027 Run `python3 tests/test_validator.py` to verify tests still pass

---

## Phase 5: Changelog Updates + Final Verification

- [ ] T028 Update or create changelog for `install_guides/install_scripts/`
- [ ] T029 Update or create changelog for `skill/mcp-code-mode/`
- [ ] T030 Update or create changelog for `skill/workflows-documentation/`
- [ ] T031 Run full verification sweep: `bash -n` on all 11 Bash scripts
- [ ] T032 Run full verification sweep: `py_compile` on all 7 Python files
- [ ] T033 Create implementation-summary.md with metrics and decisions

---

## Completion Criteria

- [ ] All tasks T001-T033 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 18 scripts pass syntax verification
- [ ] All scripts functionally unchanged
- [ ] Changelogs updated for all 3 directories

---

## AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [ ] Load `spec.md` and verify scope hasn't changed
2. [ ] Load `plan.md` and identify current phase
3. [ ] Load `tasks.md` and find next uncompleted task
4. [ ] Verify task dependencies are satisfied
5. [ ] Load `checklist.md` and identify relevant P0/P1 items
6. [ ] Check for blocking issues in `decision-record.md`
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm understanding of success criteria
9. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | `_utils.sh` (T001) must complete before T002-T005 |
| TASK-SCOPE | Style changes only, no functional modifications |
| TASK-VERIFY | Run syntax check after each script alignment |
| TASK-DOC | Update task status immediately on completion |

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [bash -n exit code, py_compile result]
- **Blockers**: [None | Description]
- **Next**: T### - [Next task]
```

---

## Workstream Organization

### Workstream A: Install Scripts (W-A)
- [ ] T001-T007 (Phase 1)
- [ ] T008-T013 (Phase 2)

### Workstream B: MCP Code Mode (W-B)
- [ ] T014-T017 (Phase 3)

### Workstream C: Workflows Documentation (W-C)
- [ ] T018-T027 (Phase 4)

### Workstream D: Verification (W-D)
- [ ] T028-T033 (Phase 5) — blocked until W-A, W-B, W-C complete

---

## Estimated LOC Impact Summary

| Phase | Scripts | Source LOC | Est. LOC Changed |
|-------|---------|------------|------------------|
| Phase 1 | 5 | 2,722 | ~480-690 |
| Phase 2 | 4 | 1,349 | ~160-240 |
| Phase 3 | 2 | 452 | ~85-140 |
| Phase 4 | 7 | 3,373 | ~470-740 |
| Phase 5 | N/A | N/A | ~50-100 |
| **Total** | **18** | **7,895** | **~1,245-1,910** |

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
