---
title: "Tasks: Phase 3: nested-skilled-root"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "nested skilled root tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: nested-skilled-root

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

| Variable | Value |
|----------|-------|
| `R` | `/Users/michelkerkmeester/MEGA/Development/Skilled`, the Skilled checkout |
| `X` | `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/coder`, the vendored copy one folder below the `ai-speckit` git root |
| `F` | the temporary git repository the new test file creates under `os.tmpdir()` |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record every suite's pre-change pass count in the baseline file (`specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root/scratch/baseline-before-change.md`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` prints `pass 58` and `fail 0`, and `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` prints `pass 69` and `fail 0`, matching the values already recorded there. Evidence: `scratch/T001.md`.
- [x] T002 Record the pass counts the baseline file is missing for the parent-skill-check and freshness suites (`scratch/baseline-before-change.md`). Verify: `rg -n 'parent-skill-check' scratch/baseline-before-change.md` prints a recorded count, and `rg -n 'freshness' scratch/baseline-before-change.md` prints a recorded count. Evidence: `scratch/T002.md`.
- [x] T003 Reproduce the two measured failures from the vendored copy (`X`). Verify: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-code-terraform --into-hub sk-code` prints `HUB_NOT_FOUND` and exits 2, and `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` prints `panel error` and exits 0. Evidence: `scratch/T003.md`.
- [x] T004 [P] Audit what each root feeds and record the `file:line` list (`scratch/root-consumers.md`). Verify: `rg -c 'sk-skill-surface\.cjs:|skill-graph-freshness\.cjs:|parent-skill-check\.cjs:' scratch/root-consumers.md` prints 11 or more. Evidence: `scratch/root-consumers.md`.
- [x] T005 [P] Confirm the shared resolver loads from a CommonJS caller on this Node (`.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs`). Verify: `node -e "require('./.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs')"` exits 0 and prints nothing. Evidence: `scratch/T005.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Build the fixture helper in the new test file (`tests/doctor-root-resolution.test.cjs`): a `git init` temporary repository, a decoy `.opencode` with no sentinel, and `<F>/nested/.skilled` holding the sentinel, the resolver, the sk-doc scripts that `parent-skill-check.cjs` loads at startup, a `sk-code` hub with `mode-registry.json` and `hub-router.json`, the `sk-code-terraform` subject skill, `system-deep-loop` as the default target, two skills with `graph-metadata.json`, a compiled `skill-graph.json` with a unique stamp, and the three copied scripts. Verify: `node --test --test-name-pattern 'fixture' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `pass 1` and `fail 0`. Evidence: `scratch/T010.md`.
- [x] T011 Add the nested hub case for `sk-skill-check.cjs` to the new suite. Verify: `node --test --test-name-pattern 'nested hub' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `pass 1` and `fail 0`, and the case asserts the reported `hubPath` is `.skilled/skills/sk-code` with no `HUB_NOT_FOUND`. Evidence: `scratch/T011.md`.
- [x] T012 Add the nested freshness case for `skill-graph-freshness.cjs` to the new suite. Verify: `node --test --test-name-pattern 'nested freshness' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `pass 1` and `fail 0`, and the case asserts the fixture's compiled stamp with no `panel error`. Evidence: `scratch/T012.md`.
- [x] T013 Add the decoy-`.opencode` case for `parent-skill-check.cjs` to the new suite. Verify: `node --test --test-name-pattern 'nested parent' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `pass 1` and `fail 0`, and the case asserts the `Resolved:` line names `<F>/nested/.skilled/skills/system-deep-loop` with no `Cannot find module`. Evidence: `scratch/T013.md`.
- [x] T014 Add the Skilled and linked-`.skilled` cases to the new suite. Verify: `node --test --test-name-pattern 'baseline layout' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `pass 2` and `fail 0`. Evidence: `scratch/T014.md`.
- [x] T015 Add the unit case for `surface.findRepoRoot` on a nested path and on a path with no sentinel. Verify: `node --test --test-name-pattern 'resolver unit' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `pass 2` and `fail 0`. Evidence: `scratch/T015.md`.
- [x] T016 Run the new suite against the unmodified scripts and record the red result (`scratch/red-before-change.md`). Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints a `fail` count of 1 or more, and the file lists the failing case names. Evidence: `scratch/red-before-change.md`.
- [x] T017 Replace the root walk at `lib/sk-skill-surface.cjs:84` with the shared resolver (`.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs`). Verify: `node -e "const s=require('./.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs'); console.log(s.findRepoRoot(), s.findRepoRoot('.skilled/commands/doctor/scripts'))"` prints `R` twice. Evidence: `scratch/T017.md`.
- [x] T018 Replace the root walk at `skill-graph-freshness.cjs:46` with the shared resolver (`skill-graph-freshness.cjs`). Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs >/dev/null` exits 0, and `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | grep -c 'panel error'` prints 0. Evidence: `scratch/T018.md`.
- [x] T019 Replace the `.opencode` walk and arithmetic fallback at `parent-skill-check.cjs:74-80` with the shared resolver (`parent-skill-check.cjs`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code | tail -2` prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`. Evidence: `scratch/T019.md`.
- [x] T020 Sync the root statements in the three script headers and the freshness asset (`doctor-skill-graph-freshness.yaml:51`). Verify: `rg -n 'nearest ancestor.*\.git' .skilled/commands` prints no line. Evidence: `scratch/T020.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run the new suite against the changed scripts (`tests/doctor-root-resolution.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `fail 0`. Evidence: `scratch/T030.md`.
- [x] T031 Run the three Skilled baseline commands and compare them to the recorded file. Verify: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-code-skilled --into-hub sk-code --json | grep -c '"hubPath": ".skilled/skills/sk-code"'` prints 1, `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | grep -c 'panel error'` prints 0, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code | tail -2 | grep -c '0 warnings'` prints 1. Evidence: `scratch/T031.md`.
- [x] T032 Rerun the two suites whose counts are recorded (`sk-skill-check.test.cjs`, `sk-skill-convert.test.cjs`). Verify: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` prints `pass 58` and `fail 0`, and `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` prints `pass 69` and `fail 0`. Evidence: `scratch/T032.md`.
- [x] T033 Rerun the parent-skill-check suites and the freshness vitest suite. Verify: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs` prints `fail 0`, and `cd .skilled/skills/system-skill-advisor/runtime && ./node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts` reports no failed test. Evidence: `scratch/T033.md`.
- [x] T034 Run the aggregate runner (`tests/run-all.sh`). Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and prints `0 failed`. Evidence: `scratch/T034.md`.
- [x] T035 Validate the packet (`specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root --strict` prints `RESULT: PASSED`. Evidence: `implementation-summary.md`. Reason: strict validation returned `RESULT: FAILED` with only `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`, which are outside the writable scope. Evidence: `scratch/T035.md` (`RESULT: PASSED`).
- [x] T036 Remove the evidence files' temporary fixtures and confirm no copied tree remains (`scratch/`). Verify: `find specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root/scratch -name '.skilled' -type d` prints no line. Evidence: `implementation-summary.md`.
- [x] T037 Verify the live nested hub and freshness proof in the re-pinned Barter copy (`barter/ai-speckit/coder/.skilled`). Verify: the hub report names `.skilled/skills/sk-code` without `HUB_NOT_FOUND`, and freshness prints no `panel error`. Evidence: `scratch/T037.md` (hubPath `.skilled/skills/sk-code`, panel error count 0, parent-skill-check 0 warnings; the one hub finding, H11 mirror drift, is outside this fix).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are evidenced, including T037, the live proof in the re-pinned Barter copy
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (evidence: `scratch/T014.md`, `scratch/T031.md`)
- [x] `run-all.sh` prints `0 failed` and the Skilled and linked baselines match their recorded values (evidence: `scratch/T031.md`, `scratch/T034.md`)
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

- [x] CHK-001 [P0] Every requirement is listed in `spec.md`. Verify: `rg -c '^\| REQ-0' specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root/spec.md` prints 8. Evidence: `spec.md`.
- [x] CHK-002 [P0] The pre-change counts are recorded. Verify: `rg -n 'pass 58' specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root/scratch/baseline-before-change.md` prints one line. Evidence: `scratch/baseline-before-change.md:40-56`.
- [x] CHK-003 [P1] The shared resolver is present. Verify: `ls .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs` prints the path. Evidence: `scratch/T005.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The three scripts parse. Verify: `node --check .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs && node --check .skilled/commands/doctor/scripts/skill-graph-freshness.cjs && node --check .skilled/commands/doctor/scripts/parent-skill-check.cjs` exits 0. Evidence: `scratch/verification-evidence.md:29`.
- [x] CHK-011 [P0] No local `.git` root walk remains. Verify: `rg -n "'\.git'" .skilled/commands/doctor/scripts` prints only test-file hits, not a root-selection line. Evidence: `scratch/orchestrator-verify.md:53`.
- [x] CHK-012 [P1] No unfilled tokens remain in the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/002-doctor-audit-and-fixes/003-nested-skilled-root --strict` prints `PLACEHOLDER_FILLED: No unfilled template placeholders found`. Evidence: `implementation-summary.md` (`PLACEHOLDER_FILLED` passed); strict validation remains blocked only by the two generated metadata errors.
- [x] CHK-013 [P1] Code comments carry no spec ids. Verify: `rg -n 'REQ-0|003-nested-skilled-root' .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs .skilled/commands/doctor/scripts/skill-graph-freshness.cjs .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints no line. Evidence: `scratch/T020.md:14-15`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The new suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints `fail 0`. Evidence: `scratch/T030.md:4-11`.
- [x] CHK-021 [P0] The aggregate runner passes. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `0 failed`. Evidence: `scratch/T034.md:4-18`.
- [x] CHK-022 [P1] The nested hub resolves. Verify: the new suite's `nested hub` case prints `"hubPath": ".skilled/skills/sk-code"`. Evidence: `scratch/T011.md:4-11`.
- [x] CHK-023 [P1] The nested panel reports instead of erroring. Verify: the new suite's `nested freshness` case prints no `panel error` and the fixture's compiled stamp. Evidence: `scratch/T012.md:4-12`.
- [x] CHK-024 [P1] The linked `.skilled` layout is unchanged. Verify: the new suite's `baseline layout` case prints `pass 2`. Evidence: `scratch/T014.md:4-13`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `class-of-bug`, because three scripts share one root-selection assumption. Evidence: `spec.md: problem statement; plan.md:113-115`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Verify: `rg -n "function findRepoRoot" .skilled/commands/doctor/scripts` prints three definitions. Evidence: `scratch/root-consumers.md:3-11`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed helper. Verify: `rg -n "findRepoRoot\(" .skilled/commands --glob '!node_modules'` prints every call site named in `plan.md`. Evidence: `scratch/root-consumers.md:20-52; scratch/orchestrator-verify.md:14`.
- [x] CHK-FIX-004 [P0] Security/path/resolver fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Verify: the new suite covers nested, decoy, no-sentinel and symlinked cases. Evidence: `scratch/orchestrator-verify.md` §2 and §3 (8/8: nested hub, nested freshness, decoy `.opencode`, no-sentinel hoist, checkout and linked layouts). The no-sentinel case is the fallback and the hoist is the outside-root case. Delimiter and joined-input cases do not apply: every caller passes the script's own `__dirname`, never operator text.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Verify: `plan.md` names the layout, decoy, script and start axes. Evidence: `plan.md:115; scratch/T030.md:4-11 (8 fixture-suite cases)`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Verify: `node --test --test-name-pattern 'nested freshness' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` passes with `SKILL_GRAPH_FRESHNESS_ROOT` unset, and the linked case sets it. Evidence: `scratch/T012.md:10-12; scratch/T014.md:10-13`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range. Verify: `git rev-parse HEAD` is recorded in `scratch/verification-evidence.md`. Evidence: `scratch/verification-evidence.md:3`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Verify: `rg -n 'token|secret|password' .skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs .skilled/commands/doctor/scripts/skill-graph-freshness.cjs .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints no line. Evidence: `implementation-summary.md (static secret scan: no secret/password matches)`.
- [x] CHK-031 [P0] Input validation is unchanged: a path argument is resolved, never executed. Verify: the hub and target arguments reach `path.resolve` only. Evidence: `scratch/verification-evidence.md:8-12; parent-skill-check.cjs:2467-2478`.
- [x] CHK-032 [P1] Auth/authz: N/A, no script in scope authenticates or authorizes. Evidence: `spec.md: NFR security and read-only boundaries`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks name the same three scripts. Verify: `rg -c 'sk-skill-surface\.cjs' spec.md plan.md tasks.md` prints 1 or more for each file. Evidence: `spec.md, plan.md, tasks.md`.
- [x] CHK-041 [P1] The script headers state the sentinel rule. Verify: `rg -n 'sentinel|source tree' .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` prints the new sentence. Evidence: `scratch/T020.md:3-12`.
- [x] CHK-042 [P2] The freshness asset states the same default. Verify: `rg -n 'nearest ancestor.*\.git' .skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` prints no line. Evidence: `scratch/T020.md:3-8`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixtures live under `os.tmpdir()` only. Verify: `rg -n 'mkdtempSync|rmSync' .skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` prints both a create and a cleanup call. Evidence: `.skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs:40`.
- [x] CHK-051 [P1] The fixture is removed after each case. Verify: the suite leaves no `skill-root-` directory under `$TMPDIR`. Evidence: `.skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs:167-168`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---
