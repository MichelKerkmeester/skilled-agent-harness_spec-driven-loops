<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Spec-Kit Script Refactoring

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This specification covers 6 deferred architectural refactoring tasks from spec 109-spec-kit-script-automation, targeting the system-spec-kit scripts codebase to eliminate technical debt, improve portability, and enhance maintainability without changing external behavior.

**Key Decisions**: Extract Parser A JSONC logic to shared utility (ADR-003), create shell library modules for code reuse (ADR-002), defer CLI console.* migration (ADR-004)

**Critical Dependencies**: None (all work is internal refactoring)

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-12 |
| **Branch** | `110-spec-kit-script-refactoring` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit scripts codebase has accumulated 6 architectural issues: (1) monolithic files with 800+ LOC, (2) GNU-specific sed/grep that silently fails on macOS, (3) hardcoded template composition with drift, (4) duplicated JSONC parsers with latent bugs, (5) code quality gaps in catch typing and non-null assertions, and (6) duplicated shell functions across scripts.

### Purpose
Refactor system-spec-kit scripts to achieve 100% POSIX portability, eliminate code duplication, improve maintainability through modular extraction, and reach 100% TypeScript quality compliance without changing any external behavior or APIs.

---

## 3. SCOPE

### In Scope
- T4.5: Dynamic template composition in compose.sh (eliminate 386 LOC of heredocs)
- T4.6: POSIX portability fixes for sed/grep (5 GNU-specific patterns)
- T6.1: TypeScript code quality (29 violations in catch typing + non-null assertions)
- T6.2: Extract 4 modules from workflow.ts (866 LOC → ~430 LOC)
- T6.3: Consolidate JSONC parsers (extract Parser A, replace Parser B's regex)
- T6.4: Modularize create.sh (extract 3 shell libraries + externalize templates)

### Out of Scope
- Console.* migration for CLI scripts (legitimate user output, ADR-004 defers)
- runWorkflow() internal decomposition (premature, remains orchestrational)
- New features or API changes
- Performance optimization (no measured bottlenecks)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/templates/compose.sh` | Modify | Dynamic template composition + POSIX sed fixes |
| `scripts/spec/create.sh` | Modify | POSIX portability + modularization + shell lib sourcing |
| `scripts/spec/validate.sh` | Modify | Source shell-common.sh for _json_escape() |
| `scripts/core/workflow.ts` | Modify | Extract 4 modules, reduce to ~430 LOC |
| `scripts/core/config.ts` | Modify | Extract JSONC parser to shared utility |
| `scripts/lib/content-filter.ts` | Modify | Replace naive regex with shared JSONC utility |
| `scripts/shared/utils/jsonc-strip.ts` | Create | Extracted JSONC parser (from config.ts Parser A) |
| `scripts/core/quality-scorer.ts` | Create | QualityScore interface + scoreMemoryQuality() |
| `scripts/core/topic-extractor.ts` | Create | DecisionForTopics + extractKeyTopics() |
| `scripts/core/file-writer.ts` | Create | writeFilesAtomically() |
| `scripts/core/memory-indexer.ts` | Create | DB_UPDATED_FILE, notifyDatabaseUpdated, indexMemory |
| `scripts/lib/shell-common.sh` | Create | _json_escape(), repo root detection |
| `scripts/lib/git-branch.sh` | Create | check_existing_branches(), generate_branch_name() |
| `scripts/lib/template-utils.sh` | Create | get_level_templates_dir(), copy_template() |
| `templates/sharded/` | Create | 4 externalized heredoc templates |
| `templates/addendum/level3-arch/spec-prefix.md` | Create | L3 spec header fragment |
| `templates/addendum/level3-arch/spec-suffix.md` | Create | L3 spec footer fragment |
| `templates/addendum/level3plus-govern/spec-prefix.md` | Create | L3+ spec header fragment |
| `templates/addendum/level3plus-govern/spec-suffix.md` | Create | L3+ spec footer fragment |
| 11 TypeScript files | Modify | Fix catch typing (`:unknown`) and non-null assertions |
| `test-integration.js` | Modify | Fix stale import (validateAnchors from workflow.js) |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | POSIX portability for sed/grep | All 5 GNU-specific patterns replaced, compose.sh --verify passes on macOS |
| REQ-002 | TypeScript catch typing compliance | All 11 catch blocks use `:unknown`, `tsc --noEmit` passes |
| REQ-003 | workflow.ts modularization | 4 modules extracted, workflow.ts ≤450 LOC, existing tests pass |
| REQ-004 | JSONC parser consolidation | Parser A extracted to shared utility, Parser B replaced, both config files parse correctly |
| REQ-005 | Build verification | `npm run build` succeeds without errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Dynamic template composition | compose.sh uses fragment concatenation, --verify detects no drift |
| REQ-007 | Non-null assertion elimination | 7 non-null assertions removed, `tsc --noEmit` passes |
| REQ-008 | Shell library modularization | 3 lib/ modules created, create.sh sources correctly, --json output unchanged |
| REQ-009 | Template externalization | 4 heredoc templates moved to sharded/, create.sh references files |
| REQ-010 | All ADRs documented | 5 ADRs in decision-record.md with Five Checks evaluations |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Zero POSIX compatibility failures (sed/grep work on macOS and Linux identically)
- **SC-002**: TypeScript quality at 100% for CAT-6 (catch typing) and CAT-7 (non-null assertions)
- **SC-003**: workflow.ts reduced by ≥50% (866 LOC → ≤430 LOC) with zero functional regressions
- **SC-004**: Single JSONC parser implementation, zero latent bugs (strips comments in URLs/strings correctly)
- **SC-005**: All existing tests pass, no new lint warnings

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Section renumbering in compose.sh breaks template structure | HIGH | Implement `renumber_sections()` with comprehensive test cases, --verify catches drift |
| Risk | Shell lib sourcing breaks on bash 3.2 (macOS default) | MEDIUM | Test on macOS before commit, avoid bash 4.x features |
| Risk | workflow.ts extraction introduces circular dependencies | LOW | Extract pure functions first, follow unidirectional dependency order |
| Risk | JSONC parser edge cases not covered | LOW | Parser A already handles all edge cases (URLs, strings), add regression tests |
| Dependency | None | N/A | All work is self-contained internal refactoring |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable performance regression (compose.sh, create.sh runtime within ±5%)

### Security
- **NFR-S01**: No new security vulnerabilities introduced (JSONC parser must not execute code)

### Reliability
- **NFR-R01**: 100% backward compatibility (all existing scripts and workflows continue to work)

---

## 8. EDGE CASES

### Data Boundaries
- Empty JSONC files: Parser returns empty object/array
- Template fragments with no sections: Composition skips renumbering
- Shell scripts with no shebang: lib/ modules must be sourceable in any POSIX shell

### Error Scenarios
- Template file missing: compose.sh fails with clear error message
- Invalid JSONC syntax: Parser throws descriptive error with line number
- Git branch already exists: create.sh prompts user for action

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 22, LOC: ~1500, Systems: 3 (shell scripts, TypeScript core, templates) |
| Risk | 18/25 | Auth: N, API: N, Breaking: N (internal refactoring), Portability: Y (sed/grep), Modular extraction: Y |
| Research | 14/20 | Investigation: Completed (109 research phase), Pattern analysis: Done |
| Multi-Agent | 12/15 | Workstreams: 2 (W-A Shell, W-B TypeScript) |
| Coordination | 11/15 | Dependencies: 7 blocking relationships across 6 tasks |
| **Total** | **77/100** | **Level 3+** (governance for multi-workstream coordination) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Section renumbering regex fails on edge cases | H | M | Comprehensive test suite, --verify detects drift before commit |
| R-002 | Shell lib sourcing path resolution breaks | M | L | Use `SPEC_KIT_ROOT` env var, test on macOS/Linux |
| R-003 | JSONC parser misses edge case (nested comments) | M | L | Parser A already handles, add regression test |
| R-004 | workflow.ts extraction breaks existing tests | H | L | Run tests after each extraction step, atomic commits |
| R-005 | Template externalization changes file semantics | L | L | Heredocs are static text, file contents identical |

---

## 11. USER STORIES

N/A — Internal refactoring, no user-facing changes. All improvements are developer experience and maintainability focused.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Primary Developer + AI Agents | Pending | 2026-02-12 |
| Design Review (ADRs) | Primary Developer | Pending | TBD |
| Implementation Review | Primary Developer + @review | Pending | TBD |
| Launch Approval | Primary Developer | Pending | TBD |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [x] Security review completed (no user input, no external data)
- [x] OWASP Top 10 addressed (N/A for internal scripts)
- [x] Data protection requirements met (no PII, no sensitive data)

### Code Compliance
- [ ] Coding standards followed (TypeScript strict mode, POSIX shell)
- [ ] License compliance verified (all code is internal, MIT-compatible)

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Primary Developer | Owner | High | All phases |
| @speckit | Documentation | High | Spec creation, ADR documentation |
| @review | Quality Assurance | Medium | Code review, verification |
| @debug | Debugging | Low | On-demand for blockers |

---

## 15. CHANGE LOG

### v1.0 (2026-02-12)
**Initial specification**
- Documented 6 deferred tasks from spec 109
- Defined 3-phase implementation plan
- Documented 5 ADRs for key decisions

---

## 16. OPEN QUESTIONS

None — Research completed in spec 109, all decisions documented in ADRs.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC (~230 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->
