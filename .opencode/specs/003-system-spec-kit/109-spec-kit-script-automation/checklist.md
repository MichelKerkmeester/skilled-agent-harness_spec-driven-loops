# Verification Checklist: Spec Kit Script Automation & Cleanup

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation
- [ ] CHK-001 [P0] Requirements documented in spec.md (29 issues cataloged, 6 task groups defined)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (7 phases, dependency order established)
- [ ] CHK-003 [P0] Dependencies identified and available (TypeScript 5.x, Vitest, Bash, Node.js 18+)

---

## Phase 1: Dead Code Elimination
- [ ] CHK-010 [P0] Workspace search confirms shared/chunking.ts chunkContent has zero consumers
- [ ] CHK-011 [P0] chunkContent function deleted OR consolidation decision documented
- [ ] CHK-012 [P0] 9 internal-only exports removed from core/workflow.ts (only runWorkflow remains exported)
- [ ] CHK-013 [P0] DataSource type removed from loaders/data-loader.ts
- [ ] CHK-014 [P0] existingDirs unused variable bug fixed in spec-folder/directory-setup.ts
- [ ] CHK-015 [P0] SpecFolderInfo interface removed from spec-folder/folder-detector.ts
- [ ] CHK-016 [P0] Workspace search confirms validation-utils.ts has zero consumers OR consumers found
- [ ] CHK-017 [P0] validation-utils.ts deleted OR wired up if consumers exist
- [ ] CHK-018 [P0] loadConfig dead export removed from core/config.ts
- [ ] CHK-019 [P0] Vestigial lazy loading comments removed from core/workflow.ts
- [ ] CHK-020 [P0] Dead exports removed from spec-folder/alignment-validator.ts (detectWorkDomain, calculateAlignmentScoreWithDomain, extractObservationKeywords, parseSpecFolderTopic)
- [ ] CHK-021 [P0] spec-folder/index.ts barrel updated to remove dead re-exports
- [ ] CHK-022 [P0] Test suite passes after Phase 1 (npm test exit code 0, no regressions)

---

## Phase 2: DRY Consolidation
- [ ] CHK-030 [P1] validateNoLeakedPlaceholders consolidated to single canonical location
- [ ] CHK-031 [P1] validateAnchors consolidated to single canonical location
- [ ] CHK-032 [P1] All consumers updated to use consolidated validators
- [ ] CHK-033 [P1] extractKeyTopics duplication investigated (workflow.ts vs session-extractor.ts)
- [ ] CHK-034 [P1] extractKeyTopics merged OR divergence documented with justification
- [ ] CHK-035 [P1] validateContentAlignment and validateFolderAlignment merged into single domain-aware function
- [ ] CHK-036 [P1] All consumers updated to use merged alignment validation function
- [ ] CHK-037 [P1] Archive filtering regex consolidated with filterArchiveFolders function
- [ ] CHK-038 [P1] 3 duplicate error messages in folder-detector.ts consolidated to single source
- [ ] CHK-039 [P1] Test suite passes after Phase 2 (npm test exit code 0, no regressions)

---

## Phase 3: Bug Fixes
- [ ] CHK-040 [P0] existingDirs bug verified fixed (from T005), regression test added
- [ ] CHK-041 [P0] Inconsistent _source/_isSimulation markers fixed in loaders/data-loader.ts
- [ ] CHK-042 [P0] Section numbering collision fixed in core/workflow.ts (no duplicate "Section 6")
- [ ] CHK-043 [P0] Import guard added to memory/cleanup-orphaned-vectors.ts (if require.main === module)
- [ ] CHK-044 [P0] OPTIONAL_PLACEHOLDERS refactored to data-driven configuration in renderers/template-renderer.ts
- [ ] CHK-045 [P0] Test suite passes after Phase 3 (npm test exit code 0, no regressions)

---

## Phase 4: Automation Improvements (Code)
- [ ] CHK-050 [P1] --dry-run flag added to memory/cleanup-orphaned-vectors.ts
- [ ] CHK-051 [P1] Dry-run logic implemented: reports orphaned vectors without deletion
- [ ] CHK-052 [P1] rank-memories.ts imports redirected from MCP barrel to shared/ directly
- [ ] CHK-053 [P1] Test imports updated to use dist/ paths (TypeScript migration complete)
- [ ] CHK-054 [P1] Config value validation added to core/config.ts (type guards, range checks)
- [ ] CHK-055 [P1] Current compose.sh L3/L3+ hardcoded templates analyzed (structure documented)
- [ ] CHK-056 [P1] Dynamic composition logic designed for L3/L3+ (matches L1/L2 pattern)
- [ ] CHK-057 [P1] Dynamic L3 spec.md composition implemented in templates/compose.sh
- [ ] CHK-058 [P1] Dynamic L3+ spec.md composition implemented in templates/compose.sh
- [ ] CHK-059 [P1] Golden file tests created for template composition (byte-for-byte verification)
- [ ] CHK-060 [P1] compose.sh tested on macOS and Linux, sed differences documented
- [ ] CHK-061 [P1] compose.sh sed portability improved OR platform requirements documented
- [ ] CHK-062 [P1] Test suite + golden files pass after Phase 4 (npm test + golden file comparison exit 0)

---

## Phase 5: Documentation Fixes
- [ ] CHK-070 [P1] Lazy loading description removed from core/README.md (outdated pattern)
- [ ] CHK-071 [P1] data.messages example fixed in loaders/README.md (property verified to exist)
- [ ] CHK-072 [P1] Import paths corrected in renderers/README.md
- [ ] CHK-073 [P1] Function signatures corrected in renderers/README.md (match TypeScript definitions)
- [ ] CHK-074 [P1] templates/README.md updated to acknowledge L3/L3+ dynamic composition
- [ ] CHK-075 [P2] Automated import path validation script created for READMEs
- [ ] CHK-076 [P2] Automated README validation passes (all import paths resolve correctly)

---

## Phase 6: Code Quality & Standards Alignment
- [ ] CHK-100 [P1] All TypeScript files audited for workflows-opencode file headers
- [ ] CHK-101 [P1] Missing file headers added to all .ts files
- [ ] CHK-102 [P1] All TypeScript files audited for section dividers
- [ ] CHK-103 [P1] Section divider inconsistencies fixed across all .ts files
- [ ] CHK-104 [P1] Naming conventions audited (camelCase, PascalCase, SCREAMING_SNAKE_CASE)
- [ ] CHK-105 [P1] Naming convention violations fixed across all .ts files
- [ ] CHK-106 [P1] runWorkflow() function analyzed (398 lines, logical sections identified)
- [ ] CHK-107 [P1] Validation logic extracted from runWorkflow() into separate functions
- [ ] CHK-108 [P1] Extraction logic extracted from runWorkflow() into separate functions
- [ ] CHK-109 [P1] Rendering logic extracted from runWorkflow() into separate functions
- [ ] CHK-110 [P1] File writing logic extracted from runWorkflow() into separate functions
- [ ] CHK-111 [P1] runWorkflow() refactor verified: all sub-functions <100 lines
- [ ] CHK-112 [P2] create.sh script analyzed (928 lines, reusable logic identified)
- [ ] CHK-113 [P2] Directory creation logic extracted to sourced library (spec/lib/)
- [ ] CHK-114 [P2] Template copying logic extracted to sourced library (spec/lib/)
- [ ] CHK-115 [P2] Validation logic extracted to sourced library (spec/lib/)
- [ ] CHK-116 [P2] create.sh updated to source external libraries
- [ ] CHK-117 [P2] JSONC parser in config.ts evaluated (keep or replace decision made)
- [ ] CHK-118 [P2] If replacing: jsonc-parser dependency added, config.ts updated
- [ ] CHK-119 [P2] If keeping: zero-dependency justification documented in decision-record.md
- [ ] CHK-120 [P2] Console output patterns standardized (emoji unicode escapes vs literals)
- [ ] CHK-121 [P1] workflows-opencode standards compliance audit run on all .ts files
- [ ] CHK-122 [P1] Compliance score ≥95% verified (if <95%, violations fixed)
- [ ] CHK-123 [P1] Test suite passes after Phase 6 (npm test exit code 0, no regressions)

---

## Phase 7: Final Verification
- [ ] CHK-130 [P0] Full test suite passes (800+ tests, zero regressions, exit code 0)
- [ ] CHK-131 [P0] TypeScript build succeeds (tsc --build produces 177 dist/ files)
- [ ] CHK-132 [P0] Build time measured <10 seconds (no performance regression)
- [ ] CHK-133 [P0] Golden file tests pass for template composition (byte-for-byte match verified)
- [ ] CHK-134 [P1] Automated import path validation passes for all READMEs
- [ ] CHK-135 [P1] workflows-opencode standards compliance audit run (final verification)
- [ ] CHK-136 [P1] Compliance score ≥95% verified (final check)
- [ ] CHK-137 [P0] Workspace search confirms zero remaining dead code (no unused exports)
- [ ] CHK-138 [P0] All DRY violations consolidated (manual code review confirms single sources of truth)
- [ ] CHK-139 [P0] All 5 bugs fixed and verified (manual checklist review)
- [ ] CHK-140 [P1] Final compliance report generated (scores, test results, build metrics)
- [ ] CHK-141 [P1] implementation-summary.md updated with complete results

---

## Code Quality
- [ ] CHK-150 [P0] TypeScript strict mode compliance maintained (no new errors)
- [ ] CHK-151 [P0] No console errors or warnings during build
- [ ] CHK-152 [P1] Error handling complete for all file I/O operations
- [ ] CHK-153 [P1] Code follows workflows-opencode TypeScript patterns (file headers, section dividers, naming)

---

## Testing
- [ ] CHK-160 [P0] All acceptance criteria met for dead code elimination (7 instances removed)
- [ ] CHK-161 [P0] All acceptance criteria met for bug fixes (5 bugs fixed)
- [ ] CHK-162 [P1] All acceptance criteria met for DRY consolidation (5 consolidations complete)
- [ ] CHK-163 [P1] All acceptance criteria met for automation improvements (6 improvements complete)
- [ ] CHK-164 [P1] All acceptance criteria met for documentation fixes (5 READMEs accurate)
- [ ] CHK-165 [P1] Edge cases tested (empty chunking consumers, template composition with custom addendums)
- [ ] CHK-166 [P1] Error scenarios validated (build failure rollback, test failures after consolidation, compose.sh sed failures)

---

## Security
- [ ] CHK-170 [P0] No new filesystem access patterns outside workspace boundaries
- [ ] CHK-171 [P0] Path traversal protections in shared/utils/path-security.ts remain intact
- [ ] CHK-172 [P1] Dry-run mode prevents accidental destructive operations (cleanup-orphaned-vectors.ts)

---

## Documentation
- [ ] CHK-180 [P1] spec.md, plan.md, tasks.md, checklist.md, decision-record.md synchronized
- [ ] CHK-181 [P1] All code comments adequate for refactored functions
- [ ] CHK-182 [P1] All 5 READMEs updated with accurate examples (core/, loaders/, renderers/, templates/)
- [ ] CHK-183 [P2] Decision rationale documented for JSONC parser (ADR-005 in decision-record.md)
- [ ] CHK-184 [P2] Template composition changes documented in templates/README.md

---

## File Organization
- [ ] CHK-190 [P1] No temp files in project root (all temporary work in scratch/)
- [ ] CHK-191 [P1] scratch/ cleaned before completion (debug logs, test artifacts removed)
- [ ] CHK-192 [P2] Key findings saved to memory/ (dead code analysis, DRY consolidation decisions, compose.sh rewrite approach)

---

## Verification Summary
| Category | Total Items | Verified | % Complete |
|----------|-------------|----------|------------|
| Pre-Implementation | 3 | 0 | 0% |
| Phase 1 (Dead Code) | 13 | 0 | 0% |
| Phase 2 (DRY) | 10 | 0 | 0% |
| Phase 3 (Bugs) | 6 | 0 | 0% |
| Phase 4 (Automation Code) | 13 | 0 | 0% |
| Phase 5 (Automation Docs) | 7 | 0 | 0% |
| Phase 6 (Quality) | 24 | 0 | 0% |
| Phase 7 (Verification) | 12 | 0 | 0% |
| Code Quality | 4 | 0 | 0% |
| Testing | 7 | 0 | 0% |
| Security | 3 | 0 | 0% |
| Documentation | 5 | 0 | 0% |
| File Organization | 3 | 0 | 0% |
| **TOTAL** | **110** | **0** | **0%** |

---

## L3: ARCHITECTURE VERIFICATION
- [ ] CHK-200 [P0] ADR-001 implemented (incremental cleanup over big-bang refactor)
- [ ] CHK-201 [P0] ADR-002 implemented (dead code removal before DRY consolidation)
- [ ] CHK-202 [P0] ADR-003 implemented (TypeScript project references preserved)
- [ ] CHK-203 [P0] ADR-004 implemented (dynamic template composition replacing hardcoded L3/L3+)
- [ ] CHK-204 [P1] ADR-005 decision made (JSONC parser keep or replace)
- [ ] CHK-205 [P1] All ADRs have status (Proposed/Accepted/Deprecated/Superseded)
- [ ] CHK-206 [P1] Alternatives documented for all architectural decisions

---

## L3: RISK VERIFICATION
- [ ] CHK-210 [P1] R-001 mitigated (comprehensive workspace search before dead code deletion)
- [ ] CHK-211 [P1] R-002 mitigated (golden file testing for template composition)
- [ ] CHK-212 [P1] R-003 mitigated (incremental refactoring with test coverage at each step)
- [ ] CHK-213 [P1] R-004 mitigated (compose.sh tested on macOS + Linux OR portable alternative)
- [ ] CHK-214 [P2] R-005 mitigated (automated import path validation for READMEs)
- [ ] CHK-215 [P1] Risk matrix reviewed and all mitigations verified
- [ ] CHK-216 [P1] Critical path dependencies verified (Phases 1→2→3→4+5→6→7)

---

## L3: MILESTONE VERIFICATION
- [ ] CHK-220 [P0] M1 (Clean Baseline) achieved: All dead code removed, tests pass
- [ ] CHK-221 [P1] M2 (DRY Complete) achieved: All duplication eliminated, single sources of truth
- [ ] CHK-222 [P0] M3 (Bug-Free) achieved: All 5 bugs fixed, no unused variables
- [ ] CHK-223 [P1] M4 (Automation Ready) achieved: Dry-run modes present, imports corrected
- [ ] CHK-224 [P1] M5 (Docs Accurate) achieved: All READMEs validated, examples work
- [ ] CHK-225 [P1] M6 (Standards Compliant) achieved: 95%+ compliance score, runWorkflow refactored
- [ ] CHK-226 [P0] M7 (Production Ready) achieved: All gates passed, compliance report generated

---

## L3+: PERFORMANCE VERIFICATION
- [ ] CHK-230 [P1] Build time remains <10 seconds (NFR-P01)
- [ ] CHK-231 [P1] Memory usage during build <500MB (NFR-P02)
- [ ] CHK-232 [P2] No performance regression detected (build time comparison before/after)

---

## L3+: DEPLOYMENT READINESS
- [ ] CHK-240 [P0] Rollback procedure documented (git revert strategy in plan.md)
- [ ] CHK-241 [P1] Each phase committed independently (rollback safety)
- [ ] CHK-242 [P1] No breaking changes to external APIs (runWorkflow signature unchanged)
- [ ] CHK-243 [P2] Migration guide provided for compose.sh changes (if user-facing)

---

## L3+: COMPLIANCE VERIFICATION
- [ ] CHK-250 [P1] TypeScript strict mode compliance maintained (no new errors)
- [ ] CHK-251 [P1] workflows-opencode standards met (file headers, section dividers, naming)
- [ ] CHK-252 [P1] No new ESLint warnings introduced
- [ ] CHK-253 [P2] License compliance verified (no new dependencies added)

---

## L3+: DOCUMENTATION VERIFICATION
- [ ] CHK-260 [P1] All 5 spec documents synchronized (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- [ ] CHK-261 [P1] All 5 READMEs accurate (core/, loaders/, renderers/, templates/, shared/)
- [ ] CHK-262 [P1] Code comments updated for refactored functions (runWorkflow sub-functions)
- [ ] CHK-263 [P2] Inline documentation matches actual behavior (no outdated comments)
- [ ] CHK-264 [P2] Migration notes documented for breaking changes (if any)

---

## L3+: SIGN-OFF
| Approver | Role | Status | Date | Evidence |
|----------|------|--------|------|----------|
| @speckit maintainer | Owner | Pending | TBD | Phase 1 completion report |
| @speckit maintainer | Owner | Pending | TBD | Phase 2 completion report |
| @speckit maintainer | Owner | Pending | TBD | Phase 3 completion report |
| @speckit maintainer | Owner | Pending | TBD | Phase 4+5 completion report |
| @speckit maintainer | Owner | Pending | TBD | Phase 6 completion report |
| @speckit maintainer | Owner | Pending | TBD | Phase 7 final compliance report |
