<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Phase 19 — workflows-code--opencode Alignment (Part 2)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## EXECUTIVE SUMMARY

Phase 19 extends the workflows-code--opencode alignment work from Phase 17 to cover the three remaining script directories in the OpenCode framework: `install_guides/install_scripts/` (9 Bash scripts, 4,070 LOC), `mcp-code-mode/scripts/` (1 Bash + 1 Python, 452 LOC), and `workflows-documentation/scripts/` (5 Python + 1 Bash + 1 test, 3,373 LOC). All 18 scripts (~7,895 LOC total) will be brought into full compliance with the Shell/Bash and Python P0/P1 standards defined in the `workflows-code--opencode` skill.

**Key Decisions**: Scope limited to these 3 directories only (system-spec-kit already covered in Phase 17); Non-destructive alignment preserving all existing functionality.

**Critical Dependencies**: Phase 17 completion (provides the precedent patterns and updated skill standards).

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-07 |
| **Branch** | `092-javascript-to-typescript` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The `workflows-code--opencode` skill defines P0/P1/P2 coding standards for Shell/Bash and Python scripts. Phase 17 audited and remediated the `system-spec-kit` codebase (136 files) against these standards. However, three other script directories in the OpenCode framework (18 scripts, ~7,895 LOC) have never been audited and likely contain the same categories of violations: missing COMPONENT headers, inconsistent shebang lines, missing strict mode, unquoted variables, missing type hints, and inconsistent naming conventions.

### Purpose

Bring all 18 scripts across `install_scripts/`, `mcp-code-mode/scripts/`, and `workflows-documentation/scripts/` into full compliance with `workflows-code--opencode` Shell/Bash and Python P0/P1 standards, achieving framework-wide consistency.

---

## 3. SCOPE

### In Scope

- **install_guides/install_scripts/**: 9 Bash scripts (4,070 LOC)
  - `_utils.sh` (858 LOC)
  - `install-all.sh` (511 LOC)
  - `install-code-mode.sh` (426 LOC)
  - `install-chrome-devtools.sh` (396 LOC)
  - `install-figma.sh` (525 LOC)
  - `install-narsil.sh` (701 LOC)
  - `install-sequential-thinking.sh` (206 LOC)
  - `install-spec-kit-memory.sh` (302 LOC)
  - `test/run-tests.sh` (145 LOC)

- **skill/mcp-code-mode/scripts/**: 2 scripts (452 LOC)
  - `update-code-mode.sh` (145 LOC) — Bash
  - `validate_config.py` (307 LOC) — Python

- **skill/workflows-documentation/scripts/**: 7 scripts (3,373 LOC)
  - `extract_structure.py` (1,124 LOC) — Python
  - `init_skill.py` (410 LOC) — Python
  - `package_skill.py` (545 LOC) — Python
  - `quick_validate.py` (147 LOC) — Python
  - `validate_document.py` (736 LOC) — Python
  - `validate_flowchart.sh` (134 LOC) — Bash
  - `tests/test_validator.py` (277 LOC) — Python (test file)

- **Changelog updates** for each directory

### Out of Scope

- `system-spec-kit/` codebase (136 files) — already aligned in Phase 17
- TypeScript/JavaScript files — not part of this alignment pass
- Functional changes — this is style/standards alignment only
- `install_scripts/test/Dockerfile` — not a script
- `install_scripts/README.md` — documentation, not code
- `install_scripts/logs/.gitkeep` — infrastructure file

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `install_guides/install_scripts/_utils.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-all.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-code-mode.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-chrome-devtools.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-figma.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-narsil.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-sequential-thinking.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/install-spec-kit-memory.sh` | Modify | Shell P0/P1 alignment |
| `install_guides/install_scripts/test/run-tests.sh` | Modify | Shell P0/P1 alignment |
| `skill/mcp-code-mode/scripts/update-code-mode.sh` | Modify | Shell P0/P1 alignment |
| `skill/mcp-code-mode/scripts/validate_config.py` | Modify | Python P0/P1 alignment |
| `skill/workflows-documentation/scripts/extract_structure.py` | Modify | Python P0/P1 alignment |
| `skill/workflows-documentation/scripts/init_skill.py` | Modify | Python P0/P1 alignment |
| `skill/workflows-documentation/scripts/package_skill.py` | Modify | Python P0/P1 alignment |
| `skill/workflows-documentation/scripts/quick_validate.py` | Modify | Python P0/P1 alignment |
| `skill/workflows-documentation/scripts/validate_document.py` | Modify | Python P0/P1 alignment |
| `skill/workflows-documentation/scripts/validate_flowchart.sh` | Modify | Shell P0/P1 alignment |
| `skill/workflows-documentation/scripts/tests/test_validator.py` | Modify | Python P0/P1 alignment (test exemptions apply) |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All Bash scripts use `#!/usr/bin/env bash` shebang | `grep -c '#!/usr/bin/env bash'` matches script count |
| REQ-002 | All Bash scripts have COMPONENT header with dash-line dividers | Each script starts with `# -------` header block |
| REQ-003 | All Bash scripts use `set -euo pipefail` strict mode | `grep -c 'set -euo pipefail'` matches script count |
| REQ-004 | All variables double-quoted in Bash scripts | No unquoted `$VAR` expansions (except in `[[ ]]` tests) |
| REQ-005 | No commented-out code in any script | Zero `# commented-code` blocks (comments explaining WHY are fine) |
| REQ-006 | WHY comments present for complex logic | Non-obvious code blocks have explanatory comments |
| REQ-007 | All Python scripts use `#!/usr/bin/env python3` shebang | `grep -c '#!/usr/bin/env python3'` matches Python script count |
| REQ-008 | All Python scripts have COMPONENT header with dash-line dividers | Each script starts with `# -------` header block |
| REQ-009 | All Python scripts have module docstrings | Each `.py` file has a docstring after the header |
| REQ-010 | All Python functions use snake_case | No camelCase function names in Python files |
| REQ-011 | All Python constants use UPPER_SNAKE_CASE | Module-level constants follow naming convention |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Bash functions use snake_case naming | All function names match `[a-z_]+` pattern |
| REQ-013 | Local variables declared with `local` in Bash functions | No global variable leaks from functions |
| REQ-014 | Exit codes documented in Bash scripts | Scripts document their exit code meanings |
| REQ-015 | Errors written to stderr in Bash scripts | Error messages use `>&2` redirection |
| REQ-016 | TODOs include context in all scripts | Any TODO has `[context]` or description |
| REQ-017 | Type hints on ALL Python function signatures | Every `def` has parameter and return type annotations |
| REQ-018 | Google-style docstrings on Python functions | Functions have `Args:`, `Returns:`, `Raises:` sections |
| REQ-019 | Specific exception handling in Python | No bare `except:` or `except Exception:` without reason |
| REQ-020 | Early return pattern in Python functions | Guard clauses used instead of deep nesting |
| REQ-021 | Python import ordering (stdlib, third-party, local) | Imports grouped in 3 sections with blank lines |
| REQ-022 | Changelog entries for each directory | Each affected directory has changelog update |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 18 scripts pass P0 standards with zero violations
- **SC-002**: All 18 scripts pass P1 standards (or deferred with approval)
- **SC-003**: All scripts pass `bash -n` syntax check (Bash) or `python3 -c "import py_compile; py_compile.compile('file.py', doraise=True)"` (Python)
- **SC-004**: No functional regressions (all scripts behave identically)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 17 completion | Standards reference | Phase 17 is complete |
| Dependency | workflows-code--opencode skill | Defines P0/P1 standards | Skill is stable and updated |
| Risk | `set -euo pipefail` may break scripts relying on non-zero exits | High | Test each script individually after adding strict mode |
| Risk | Variable quoting changes may alter word-splitting behavior | Medium | Review each quoting change for intentional splitting |
| Risk | Python type hint additions may conflict with runtime | Low | Type hints are annotations only, no runtime effect |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable performance impact (style-only changes)

### Reliability
- **NFR-R01**: All scripts must remain functionally identical after alignment

### Maintainability
- **NFR-M01**: All scripts follow a single consistent style, reducing cognitive load for contributors

---

## 8. EDGE CASES

### Bash-Specific
- Scripts that intentionally use unquoted variables for word splitting: document with WHY comment
- Scripts that check `$?` after commands (incompatible with `set -e`): use `|| true` pattern
- `_utils.sh` is sourced, not executed directly: still needs header but shebang is optional

### Python-Specific
- `test_validator.py` is a test file: test file exemptions apply (Phase 17 ADR A7)
- Functions with complex return types: use `Optional`, `Union`, `tuple` from typing module
- Third-party imports that may not be installed: guard with try/except

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 18, LOC: 7,895, Directories: 3 |
| Risk | 12/25 | No auth, no API, no breaking changes; risk is in strict mode side effects |
| Research | 5/20 | Phase 17 provides precedent; minimal new investigation |
| Multi-Agent | 12/15 | 3 independent directory workstreams parallelizable |
| Coordination | 8/15 | Low cross-directory dependencies, shared standards |
| **Total** | **57/100** | **Level 3 (bumped to 3+ for multi-agent coordination)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `set -euo pipefail` breaks install scripts | H | M | Test each script with dry-run before committing |
| R-002 | Variable quoting alters glob/splitting behavior | M | L | Review each change contextually |
| R-003 | Type hints introduce import errors | L | L | Use `from __future__ import annotations` if needed |
| R-004 | COMPONENT header format varies from Phase 17 | L | L | Use exact same header template |

---

## 11. USER STORIES

### US-001: Framework Contributor Reads Consistent Scripts (Priority: P0)

**As a** framework contributor, **I want** all scripts across the OpenCode framework to follow the same coding standards, **so that** I can navigate and modify any script without learning directory-specific conventions.

**Acceptance Criteria**:
1. Given any Bash script in the framework, When I open it, Then I see a COMPONENT header, strict mode, and quoted variables
2. Given any Python script in the framework, When I open it, Then I see a COMPONENT header, module docstring, type hints, and snake_case naming

### US-002: CI/Linting Integration (Priority: P1)

**As a** framework maintainer, **I want** all scripts to pass the same style checks, **so that** automated linting can enforce standards uniformly.

**Acceptance Criteria**:
1. Given a Bash script, When `bash -n` runs, Then it passes with exit code 0
2. Given a Python script, When `py_compile` runs, Then it compiles without errors

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Michel Kerkmeester | Pending | |
| Implementation Review | Michel Kerkmeester | Pending | |
| Final Verification | Michel Kerkmeester | Pending | |

---

## 13. COMPLIANCE CHECKPOINTS

### Code Compliance
- [ ] All scripts follow workflows-code--opencode P0 standards
- [ ] All scripts follow workflows-code--opencode P1 standards
- [ ] No functional regressions introduced

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Michel Kerkmeester | Owner/Developer | High | Direct review |

---

## 15. CHANGE LOG

### v1.0 (2026-02-07)
**Initial specification** - Phase 19 scope defined for 3 directories, 18 scripts, ~7,895 LOC

---

## 16. OPEN QUESTIONS

- None at this time. Phase 17 precedent answers all methodological questions.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Phase 17 Reference**: See `../phase-18-workflows-code--opencode-alignment-pt-1/implementation-summary.md`
