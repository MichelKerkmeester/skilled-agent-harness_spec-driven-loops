# Verification Checklist: Spec-Kit Script Refactoring

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md sections 1-11 complete with 6 tasks, complexity assessment, risk matrix
  
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md sections 1-7 complete with 3-phase approach, dependency graph, ADR summaries
  
- [ ] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: No external dependencies — all refactoring is internal (plan.md section 6)

---

## Code Quality

### POSIX Portability (T4.6)

- [ ] CHK-005 [P0] All sed/grep patterns POSIX-compatible
  - **Evidence**: 5 fixes applied (T001-T005), tested on macOS bash 3.2 and Linux bash 5.x
  - **Verification**: `bash --version` on both platforms, scripts execute without errors

### TypeScript Quality (T6.1)

- [ ] CHK-010 [P0] All catch blocks use `:unknown` typing (CAT-6)
  - **Evidence**: 11 instances fixed across 7 files (T006-T012), `tsc --noEmit` passes
  - **Verification**: `grep -r "catch (" scripts/core/ scripts/lib/ scripts/spec/` shows no untyped catches

- [ ] CHK-011 [P1] Non-null assertions eliminated (CAT-7)
  - **Evidence**: 7 instances fixed across 4 files (T013-T016), replaced with null checks or optional chaining
  - **Verification**: `grep -r "!" scripts/**/*.ts | grep -v "!=="` shows no `!` operators

- [ ] CHK-012 [P0] Build succeeds without errors or warnings
  - **Evidence**: `npm run build` exit code 0, no TypeScript errors
  - **Verification**: Build log shows "✓ Built in Xms"

---

## Module Extraction (T6.2, T6.3)

### JSONC Parser (T6.3)

- [ ] CHK-030 [P0] JSONC parser extracted and both files updated
  - **Evidence**: 
    - `scripts/shared/utils/jsonc-strip.ts` created with Parser A logic (T017)
    - `scripts/core/config.ts` imports `stripJsoncComments` (T018)
    - `scripts/lib/content-filter.ts` imports `stripJsoncComments` (T019)
  - **Verification**: Both `config.jsonc` and `filters.jsonc` parse correctly

- [ ] CHK-031 [P1] JSONC parser edge cases tested
  - **Evidence**: Test file `scripts/tests/jsonc-strip.test.ts` created (T020) with URL/string/nested comment tests
  - **Verification**: `npm test -- jsonc-strip.test.ts` passes all cases

### workflow.ts Extraction (T6.2)

- [ ] CHK-040 [P0] All 4 modules extracted from workflow.ts
  - **Evidence**: 
    - `scripts/core/quality-scorer.ts` created (~130 LOC, T021)
    - `scripts/core/topic-extractor.ts` created (~90 LOC, T022)
    - `scripts/core/file-writer.ts` created (~35 LOC, T032)
    - `scripts/core/memory-indexer.ts` created (~140 LOC, T033)
  - **Verification**: workflow.ts ≤430 LOC (was 866 LOC), imports all 4 modules

- [ ] CHK-041 [P1] workflow.ts imports updated and functional
  - **Evidence**: T034 complete, workflow.ts imports resolve, `tsc --noEmit` passes
  - **Verification**: `node scripts/dist/memory/generate-context.js` runs without import errors

- [ ] CHK-042 [P1] Stale test import fixed
  - **Evidence**: T035 complete, test-integration.js line 324 imports from correct module
  - **Verification**: Test file runs without "module not found" errors

---

## Shell Modularization (T6.4)

- [ ] CHK-050 [P1] Shell library modules created
  - **Evidence**: 
    - `scripts/lib/shell-common.sh` created (~25 LOC, T023)
    - `scripts/lib/git-branch.sh` created (~100 LOC, T024)
    - `scripts/lib/template-utils.sh` created (~35 LOC, T025)
  - **Verification**: Each file has proper shebang, POSIX-compatible, sourceable

- [ ] CHK-051 [P1] Scripts source shell libraries correctly
  - **Evidence**: 
    - `create.sh` sources 3 lib/ modules (T026)
    - `validate.sh` sources shell-common.sh (T038)
  - **Verification**: `bash -n create.sh validate.sh` syntax checks pass, scripts execute

---

## Dynamic Template Composition (T4.5)

- [ ] CHK-060 [P0] Template fragments created
  - **Evidence**: 
    - `templates/addendum/level3-arch/spec-prefix.md` (T027)
    - `templates/addendum/level3-arch/spec-suffix.md` (T027)
    - `templates/addendum/level3plus-govern/spec-prefix.md` (T028)
    - `templates/addendum/level3plus-govern/spec-suffix.md` (T028)
  - **Verification**: Fragment content matches original heredoc sections

- [ ] CHK-061 [P0] Composition helper functions implemented
  - **Evidence**: T029 complete, `extract_core_body()`, `renumber_sections()`, `compose_footer()` in compose.sh
  - **Verification**: Functions handle edge cases (no sections, empty fragments)

- [ ] CHK-062 [P0] L3/L3+ spec composition cases rewritten
  - **Evidence**: T030-T031 complete, heredocs replaced with fragment concatenation
  - **Verification**: `compose.sh --verify` shows no drift, composed templates identical to baseline

---

## Template Externalization (T6.4 Phase 3)

- [ ] CHK-070 [P1] Sharded templates directory created
  - **Evidence**: `scripts/templates/sharded/` exists with 4 template files (~227 LOC, T036)
  - **Verification**: File content identical to original heredocs

- [ ] CHK-071 [P1] create.sh references sharded templates
  - **Evidence**: T037 complete, heredocs replaced with `cat templates/sharded/...`
  - **Verification**: `create.sh --json` output unchanged from baseline

---

## Testing

- [ ] CHK-080 [P0] Build verification passes
  - **Evidence**: T039 complete, `tsc --noEmit` and `npm run build` exit code 0
  - **Verification**: No errors, no warnings, dist/ directory populated

- [ ] CHK-081 [P0] All existing tests pass
  - **Evidence**: T040 complete, test suite runs without failures
  - **Verification**: Test output shows "X tests passed, 0 failed"

- [ ] CHK-082 [P0] Script verification passes
  - **Evidence**: T041 complete
    - `compose.sh --verify` shows no drift
    - `create.sh --json` output identical to pre-refactor baseline
  - **Verification**: Diff output empty or only whitespace changes

---

## Documentation

- [ ] CHK-090 [P1] implementation-summary.md complete
  - **Evidence**: T042 complete, summary documents:
    - All files changed with LOC deltas
    - Lessons learned from extractions
    - Verification results
  - **Verification**: Summary synchronized with spec/plan/tasks/checklist

- [ ] CHK-091 [P1] All spec documents synchronized
  - **Evidence**: spec.md, plan.md, tasks.md, checklist.md, decision-record.md all reference same 6 tasks
  - **Verification**: Cross-references consistent, no orphaned sections

---

## File Organization

- [ ] CHK-100 [P1] Temp files in scratch/ only
  - **Evidence**: No temp files in project root or spec folder root
  - **Verification**: `find . -maxdepth 1 -type f -name "*.tmp" -o -name "temp*"` returns empty

- [ ] CHK-101 [P1] scratch/ cleaned before completion
  - **Evidence**: `scratch/` directory empty or contains only documented artifacts
  - **Verification**: `ls -la scratch/` shows expected contents

- [ ] CHK-102 [P2] Findings saved to memory/
  - **Evidence**: Context saved via `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - **Verification**: memory/ contains timestamped context file with ANCHOR tags

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD]

---

## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-110 [P0] Architecture decisions documented in decision-record.md
  - **Evidence**: All 5 ADRs present (ADR-001 through ADR-005)
  - **Verification**: Each ADR has Status, Date, Context, Decision, Alternatives, Five Checks

- [ ] CHK-111 [P1] All ADRs have status (Proposed/Accepted)
  - **Evidence**: All 5 ADRs marked "Accepted" with date 2026-02-12
  - **Verification**: No ADRs in "Proposed" state at completion

- [ ] CHK-112 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR has Alternatives section with pros/cons table
  - **Verification**: "Why Chosen" rationale present for each decision

---

## L3: RISK VERIFICATION

- [ ] CHK-120 [P1] Risk matrix reviewed and mitigations in place
  - **Evidence**: spec.md section 10 has 5 risks (R-001 through R-005) with mitigations
  - **Verification**: Tasks T029, T041, T023-T025, T020, T040 implement mitigations

- [ ] CHK-121 [P1] Critical path dependencies verified
  - **Evidence**: plan.md section L3 Critical Path shows 7-11 hour estimate
  - **Verification**: Phase 1 → T4.5 → Phase 3 dependencies satisfied

- [ ] CHK-122 [P2] Milestone completion documented
  - **Evidence**: M1, M2, M3 milestones tracked in tasks.md section L3
  - **Verification**: All milestone tasks complete before claiming milestone

---

## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-130 [P1] No performance regression (NFR-P01)
  - **Evidence**: compose.sh and create.sh runtime within ±5% of baseline
  - **Verification**: `time compose.sh --level 3` and `time create.sh --json` measurements

- [ ] CHK-131 [P2] Memory usage unchanged
  - **Evidence**: TypeScript build memory footprint similar to baseline
  - **Verification**: `npm run build` memory usage from process monitor

---

## L3+: DEPLOYMENT READINESS

- [ ] CHK-140 [P0] Rollback procedure documented and tested
  - **Evidence**: plan.md section 7 + L2 Enhanced Rollback documents git revert procedure
  - **Verification**: Git tag `pre-110-refactor` exists for rollback target

- [ ] CHK-141 [P1] No breaking changes to external APIs
  - **Evidence**: All scripts maintain same CLI interface, --json output unchanged
  - **Verification**: Public functions and script arguments identical to baseline

---

## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-150 [P1] Coding standards followed
  - **Evidence**: TypeScript uses strict mode, shell scripts POSIX-compatible
  - **Verification**: `tsc --noEmit` passes, scripts run on bash 3.2

- [ ] CHK-151 [P1] No new security vulnerabilities
  - **Evidence**: JSONC parser does not execute code, no eval() or Function() calls
  - **Verification**: `grep -r "eval\|Function(" scripts/` returns no matches

- [ ] CHK-152 [P2] License compliance verified
  - **Evidence**: All code is internal, no new external dependencies added
  - **Verification**: `package.json` dependencies unchanged

---

## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-160 [P1] All spec documents synchronized
  - **Evidence**: spec.md, plan.md, tasks.md, checklist.md, decision-record.md cross-reference same 6 tasks
  - **Verification**: No orphaned sections, all task IDs map correctly

- [ ] CHK-161 [P2] Code comments adequate
  - **Evidence**: Extracted modules have JSDoc comments for public functions
  - **Verification**: `tsc --noEmit` generates no documentation warnings

---

## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Primary Developer | Owner | [ ] Approved | |
| @speckit | Documentation Specialist | [ ] Approved | |
| @review | Quality Assurance | [ ] Approved | |

---

<!--
LEVEL 3+ CHECKLIST (~330 lines)
- L2 core verification + L3 architecture/risk + L3+ governance
- Full progressive enhancement: L2 ⊂ L3 ⊂ L3+
- 31 P0 items, 13 P1 items, 1 P2 item
- Evidence fields specify exact verification method
- Task cross-references (T###) for traceability
- Architecture and risk verification from L3
- Performance, deployment, compliance from L3+
- Sign-off table for governance workflow
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
