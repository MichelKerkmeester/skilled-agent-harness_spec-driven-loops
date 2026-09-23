---
title: "Implementation Plan: CI Cleanup Follow-ups"
description: "Level 2 implementation plan for phase 054. It removes the spec gate /tmp location exemption so a repository under /tmp is gated like any other and drops the CI TMPDIR workaround that existed only because of the old rule. It also moves six recorded cli-jev probe scripts to pipefail and corrects the two playbooks that described the old rule and the old count."
trigger_phrases:
  - "ci cleanup follow-ups"
  - "spec gate tmp exemption"
  - "cli-jev pipefail"
  - "tmpdir ci workaround"
  - "spec gate under tmp"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CI Cleanup Follow-ups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ESM for the gate, YAML for the CI workflow and bash for the probe scripts |
| **Framework** | the spec-kit runtime hook library with the node test runner and vitest |
| **Storage** | None |
| **Testing** | node --test for the spec-gate suites and vitest for the runtime root project |

### Overview
Phase 050 left two loose ends. The spec gate exempted every write under /tmp and /private/tmp by location, and six recorded cli-jev probe scripts carried only `set -u`. This plan removes the location rule so a repository under /tmp is gated like any other, drops the CI TMPDIR workaround that existed only because of the old rule, moves the six scripts to `set -uo pipefail`, and corrects the docs that described the old rule and the old count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (the Problem and Decisions sections of the evidence pack fix the scope)
- [x] Success criteria measurable (REQ-001 to REQ-005 with AC-001 to AC-005 are all Met)
- [x] Dependencies identified (see section 6)

### Definition of Done
- [x] All acceptance criteria met (AC-001 to AC-005 are Met)
- [x] Tests passing (if applicable) (core suite 108 of 108, root project 1,292 passed with 0 failed)
- [x] Docs updated (spec/plan/tasks) (T007, T008 and T012 are done)
The packet is complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: targeted fix at the producer with a red to green regression test

### Key Components
- **spec gate exemption rule**: `isExemptTargetPath` in `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` decides which writes skip the gate.
- **core spec-gate suite**: `spec-gate-core.test.mjs` builds workspaces through `makeWorkspace` and holds the new /tmp regression test.
- **CI workflow step**: the "Runtime vitest project" step of `.github/workflows/spec-kit-check.yml`, which carried the TMPDIR workaround.
- **playbook docs**: the spec-mutation gate playbook and the codex hook parity playbook, which described the old rule and the old count.
- **cli-jev probe scripts**: six recorded scripts that now run under pipefail.

### Data Flow
The gate helper reads the target path and the repo root and then allows or denies the write. The test suite builds each workspace under a chosen base dir and feeds it to the gate. Every suite runs twice, once with TMPDIR=/tmp and once with the default temp dir. The drift guard scans the six probe scripts last.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Producer: `isExemptTargetPath` and `isUnderAnyRoot` in `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Exempts writes under /tmp and /private/tmp by location | Update. Remove the helper and the /tmp and /private/tmp clause and reword the doc comment | Core suite 108 of 108 with TMPDIR=/tmp and with the default temp dir |
| Consumer: `spec-gate-core.test.mjs` | Exercises the gate through `makeWorkspace` | Update. `makeWorkspace` takes a base directory with default `os.tmpdir()` and the new test "a repository rooted under /tmp is gated like any other" expects deny under enforcement | The new test failed against the old gate and passes after the change |
| Consumer: `.github/workflows/spec-kit-check.yml` "Runtime vitest project" step | Worked around the old rule by pointing TMPDIR at the runner temp dir | Update. Remove the 4-line TMPDIR workaround | `grep -c TMPDIR spec-kit-check.yml` returns 0 |
| Docs: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Describes the fixture location and the expected test count | Update. Step 3 accepts any fixture location, /tmp included, and step 2 expects 108 tests | Repo-wide search finds no other text with the old rule or the old 107 count |
| Docs: `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Says the core exempts /tmp | Update. Step 1 drops that sentence | Repo-wide search as above |
| Producer: the six cli-jev probe scripts under `benchmark/reports/2026-09-20-hub-routing-baseline/raw/` and `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/` | Record probe runs scanned by the sk-code drift guard | Update. `set -u` becomes `set -uo pipefail` | `bash -n` on all six is ok and the drift guards report Errors 0 |

Required inventories:
- Same-class producers: `rg -n 'isUnderAnyRoot|isExemptTargetPath' .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/` to list the exemption helper and clause at the gate.
- Consumers of changed symbols: `rg -n 'isExemptTargetPath|TMPDIR|107' . --glob '*.ts' --glob '*.js' --glob '*.mjs' --glob '*.yml' --glob '*.md'` to list every remaining reference to the rule, the workaround and the old count.
- Matrix axes: the four spec-gate suites (core, devin, cursor and Pi) and the two temp dir settings (TMPDIR=/tmp and the default). Measured before the change with TMPDIR=/tmp the core suite failed 16 tests, the devin suite 6 and the cursor suite 8.
- Algorithm invariant: a write under /tmp is never exempt by location and only the out-of-repo rule can exempt a path. The adversarial case is a repository rooted under /tmp, as when a test workspace lands under `os.tmpdir()` on a runner whose temp dir is /tmp. The gate must deny there under enforcement.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
T001 through T012 are done. The packet is complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core spec-gate suite `spec-gate-core.test.mjs` (108 tests) | `node --experimental-test-module-mocks --test spec-gate-core.test.mjs` with TMPDIR=/tmp and with the default temp dir |
| Unit | devin (15), cursor (17) and Pi (9) spec-gate suites | the node test runner for each suite with TMPDIR=/tmp and with the default temp dir |
| Integration | Runtime root vitest project (1,292 passed, 0 failed, 13 skipped) | the root vitest project with TMPDIR=/tmp, after building the gitignored dists the suites import |
| Integration | The six cli-jev probe scripts parse and the drift guards pass | `bash -n` on the six scripts and `run-all-drift-guards.sh` (2 guards passed, Errors 0) |
| Manual | CI and docs carry no trace of the old rule or the old count | `grep -c TMPDIR spec-kit-check.yml` returns 0 and a repo-wide search finds no other text with the /tmp exemption or the old 107 count |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The gitignored dist of `sk-communication/cli-communication-projection` | Internal | Green | The root vitest import fails until the dist is built. CI builds it at `spec-kit-check.yml` line 84 and a fresh worktree has not |
| Phases 051 to 053 and 055 | External | Green | They belong to other sessions and share no files with this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a spec-gate suite fails or the drift guard reports errors after these commits land.
- **Procedure**: revert commits 9b95bd06b1 and 9ace27983c on branch worktrees/066-ci-cleanup-follow-ups.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T002) ──────────┐
                           ├──► Core (T003, T006-T009) ──► Verify (T004-T005, T010-T012)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (T001-T002) | None | Core |
| Core (T003, T006-T009) | Setup | Verify |
| Verify (T004-T005, T010-T012) | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | N/A - insufficient source context | N/A - insufficient source context |
| Core Implementation | N/A - insufficient source context | N/A - insufficient source context |
| Verification | N/A - insufficient source context | N/A - insufficient source context |
| **Total** | | **N/A - insufficient source context** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): N/A - the changes cover gate code, tests, CI config, docs and probe scripts only
- [ ] Feature flag configured: N/A - insufficient source context
- [ ] Monitoring alerts set: N/A - insufficient source context

### Rollback Procedure
1. Stop any run that depends on the new gate rule.
2. Revert commits 9b95bd06b1 and 9ace27983c.
3. Verify the rollback by running the core spec-gate suite and the drift guards again.
4. Notify stakeholders: N/A - insufficient source context.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

