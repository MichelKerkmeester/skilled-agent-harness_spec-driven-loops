---
title: "Tasks: sk-doc Validator Notices and Dead Playbook Citations"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-doc Validator Notices and Dead Playbook Citations

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Rerun `git log -5 --format='%h %ad %s' --date=short` and `git status --short` on every path in the spec's Files to Change table. Stop and report if any path changed after 2026-09-27 or holds uncommitted work
- [ ] T002 Reopen every cited line at the build HEAD: `validate_document.py:255-256`, `quick_validate.py:239-251`, `deep-research-presentation.txt:233-236` and `:379-388`, the playbook rows at `exhausted-approach-respect.md:119`, `pause-sentinel-halt.md:105` and `session-capturing-pipeline-quality-coverage.md:100`, `:117-118`. Update the pins in this phase's docs if a line moved
- [ ] T003 Run `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and save the failing set by name to `scratch/suite-baseline.txt` (expected on 2026-09-27: the four files named in REQ-006)
- [ ] T004 [P] Rerun the two fallback probes with `--json` and save their output and exit status to `scratch/fallback-baseline.txt`: `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` (exit 0) and `.skilled/repo-rules/communication.md` (exit 1)
- [ ] T005 [P] Recount non-qualified MCP tokens in `allowed-tools` across tracked markdown outside `specs/` with `is_non_fq_mcp_token` and `iter_allowed_tools` from `quick_validate.py`. Expect 0. Stop and report if any skill carries one
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Separate the README default from the path rules so `validate_document()` can tell it was hit, keeping `detect_document_type()`'s signature and return value (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`)
- [ ] T007 Append one `document_type_fallback` warning with a `fix_hint` naming `--type` when `doc_type` was `None` on entry and the default was hit. `valid` and `exit_code` stay computed from blocking errors only (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`)
- [ ] T008 Make the MCP-token branch return invalid for every package kind and add the rule to the docstring's `Validates:` list (`.skilled/skills/sk-doc/shared/scripts/quick_validate.py`)
- [ ] T009 [P] Add two pytest cases: an untyped document with no `doc_type` carries the warning and keeps its exit code, and the same document with `doc_type='readme'` carries none (`.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py`)
- [ ] T010 [P] Add two cases to the runner: a skill fixture with `allowed-tools: [Read, mcp__code_mode]` is invalid, and one with `mcp__code_mode__*` is valid (`.skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py`)
- [ ] T011 Update the "Wrong document type detected" row to say a fallback now prints a `document_type_fallback` warning (`.skilled/skills/sk-doc/README.md`)
- [ ] T012 [P] Repoint the source rows: `research.md:307-317` becomes `.skilled/commands/deep/assets/deep-research-presentation.txt:379-388` and `research.md:176-185` becomes `.skilled/commands/deep/assets/deep-research-presentation.txt:233-236`, anchor text unchanged (`exhausted-approach-respect.md`, `pause-sentinel-halt.md`)
- [ ] T013 [P] Remove capture rows `:117-118` and extend the note at `:100` to say the two `memory-pipeline-regressions.vitest.ts` rows were removed because the file no longer imports `../../shared/embeddings` (`session-capturing-pipeline-quality-coverage.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Rerun the two fallback probes and compare with `scratch/fallback-baseline.txt`: the same exit codes and a `document_type_fallback` entry in `warnings` for both
- [ ] T015 Run `ONLY_TESTS="test_structure_validation.py test_quick_validate_086.py" bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and read `PASS` for both
- [ ] T016 Run `rg -n -e 'deep/research\.md:307' -e 'deep/research\.md:176' -e 'regressions\.vitest\.ts:67' -e 'regressions\.vitest\.ts:109' .skilled/skills` and read no output. Run `sed -n '379,388p'` and `sed -n '233,236p'` on the presentation file and read the anchor text
- [ ] T017 Run `validate_document.py` on each of the three edited playbook files and read `VALID` and `playbook_feature` with exit 0
- [ ] T018 Rerun the full owner suite and compare its failing set by name with `scratch/suite-baseline.txt`. No new name may appear
- [ ] T019 Mark each row of `acceptance-criteria.md` with its evidence, fill `implementation-summary.md`, empty `scratch/` except `.gitkeep`, then run `validate.sh --strict` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---



