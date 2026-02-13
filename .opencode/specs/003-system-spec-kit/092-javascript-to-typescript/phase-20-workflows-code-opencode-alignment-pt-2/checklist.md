# Verification Checklist: Phase 19 — workflows-code--opencode Alignment (Part 2)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3plus-govern | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Task breakdown in tasks.md
- [ ] CHK-004 [P1] Phase 17 implementation-summary.md reviewed for precedent

---

## Shell/Bash P0 Standards

- [ ] CHK-010 [P0] All 11 Bash scripts use `#!/usr/bin/env bash` shebang
- [ ] CHK-011 [P0] All 11 Bash scripts have COMPONENT header with `# -------` dash-line dividers
- [ ] CHK-012 [P0] All 11 Bash scripts use `set -euo pipefail` strict mode
- [ ] CHK-013 [P0] All variables double-quoted in Bash scripts (except inside `[[ ]]`)
- [ ] CHK-014 [P0] No commented-out code in Bash scripts
- [ ] CHK-015 [P0] WHY comments present for complex logic in Bash scripts

**Evidence format**: `[grep output showing compliance across all files]`

---

## Shell/Bash P1 Standards

- [ ] CHK-020 [P1] All Bash functions use snake_case naming
- [ ] CHK-021 [P1] Local variables declared with `local` in Bash functions
- [ ] CHK-022 [P1] Exit codes documented in Bash scripts (header or inline)
- [ ] CHK-023 [P1] Error messages use `>&2` stderr redirection
- [ ] CHK-024 [P1] TODOs include context/description

---

## Python P0 Standards

- [ ] CHK-030 [P0] All 7 Python files use `#!/usr/bin/env python3` shebang
- [ ] CHK-031 [P0] All 7 Python files have COMPONENT header with `# -------` dash-line dividers
- [ ] CHK-032 [P0] All 7 Python files have module docstrings
- [ ] CHK-033 [P0] All Python functions use snake_case naming
- [ ] CHK-034 [P0] All Python constants use UPPER_SNAKE_CASE
- [ ] CHK-035 [P0] No commented-out code in Python files
- [ ] CHK-036 [P0] WHY comments present for complex logic in Python files

**Evidence format**: `[grep output showing compliance across all files]`

---

## Python P1 Standards

- [ ] CHK-040 [P1] Type hints on ALL Python function signatures (except test file)
- [ ] CHK-041 [P1] Google-style docstrings on Python functions
- [ ] CHK-042 [P1] Specific exception handling (no bare `except:`)
- [ ] CHK-043 [P1] Early return pattern used where applicable
- [ ] CHK-044 [P1] Import ordering: stdlib, third-party, local (3 groups)

---

## Syntax Verification

- [ ] CHK-050 [P0] `bash -n` passes for all 11 Bash scripts (exit code 0)
  - [ ] `_utils.sh`
  - [ ] `install-all.sh`
  - [ ] `install-code-mode.sh`
  - [ ] `install-chrome-devtools.sh`
  - [ ] `install-figma.sh`
  - [ ] `install-narsil.sh`
  - [ ] `install-sequential-thinking.sh`
  - [ ] `install-spec-kit-memory.sh`
  - [ ] `test/run-tests.sh`
  - [ ] `update-code-mode.sh`
  - [ ] `validate_flowchart.sh`
- [ ] CHK-051 [P0] `py_compile` passes for all 7 Python files (exit code 0)
  - [ ] `validate_config.py`
  - [ ] `extract_structure.py`
  - [ ] `init_skill.py`
  - [ ] `package_skill.py`
  - [ ] `quick_validate.py`
  - [ ] `validate_document.py`
  - [ ] `tests/test_validator.py`

---

## Functional Integrity

- [ ] CHK-060 [P0] No functional regressions — scripts behave identically before and after
- [ ] CHK-061 [P1] `_utils.sh` functions still sourced correctly by install-*.sh scripts
- [ ] CHK-062 [P1] `tests/test_validator.py` test suite still passes

---

## Documentation

- [ ] CHK-070 [P1] Spec/plan/tasks synchronized and reflect final state
- [ ] CHK-071 [P1] Changelog entries added for each affected directory
- [ ] CHK-072 [P1] implementation-summary.md created with metrics
- [ ] CHK-073 [P2] Decision-record.md updated with any runtime decisions

---

## Test File Exemptions (per Phase 17 ADR A7)

The following P1 standards are relaxed for `tests/test_validator.py`:

- [ ] CHK-080 [P2] Test file COMPONENT header (recommended but not required)
- [ ] CHK-081 [P2] Test function docstrings (test name should be self-documenting)
- [ ] CHK-082 [P2] Test function type hints (test assertions make types implicit)

---

## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale

---

## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (git revert individual files)
- [ ] CHK-121 [P1] Each phase committed separately for granular rollback

---

## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] All scripts comply with workflows-code--opencode P0 standards
- [ ] CHK-131 [P1] All scripts comply with workflows-code--opencode P1 standards (or deferred)

---

## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Owner/Developer | [ ] Approved | |

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | [ ]/18 |
| P1 Items | 18 | [ ]/18 |
| P2 Items | 5 | [ ]/5 |

**Verification Date**: [YYYY-MM-DD]
