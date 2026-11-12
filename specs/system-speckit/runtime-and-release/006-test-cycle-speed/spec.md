---
title: "Test Cycle Speed"
description: "A series of measured changes that make the Skilled test suites faster. It closes when CI runner timing is recorded and every follow-up cut is built or rejected with evidence."
trigger_phrases:
  - "test cycle speed phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed"
    last_updated_at: "2026-11-10T18:27:35Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-test-cycle-speed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Test Cycle Speed

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/340-local-test-scope` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 006-test-cycle-speed |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child passes `validate.sh --strict`, and phase 5 records CI timing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skilled test suites took too long to run locally. The first phase cut the deep-loop suite from 1,130 s to about 505 s and made spec-kit's `npm test` cover what CI covers. The research after it found one cut ready to try, one that needs care, and a missing measurement on the CI runner.

### Purpose
Make the suites faster one measured change at a time. Each change keeps every test and assertion. Each one is reverted when it does not save at least 10%.

> **Phase-parent note:** This spec.md is the only authored document at the parent level. Plans, tasks and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five cuts already built, in phase 1.
- A fresh per-file profile, the `upgrade-legacy` split, the `fanout-run` split and CI timing, in phases 2 to 5.

### Out of Scope
- Ledger read caching in production code - the research found it is not a lever.
- Deleting or weakening tests.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `S/vitest.config.ts`, `D/vitest.config.ts` | Modify | 001, 004, 005 | Parallel files, the serial list and a CI cap if needed |
| `S/cli/tests/upgrade-legacy*.vitest.ts` | Modify, Create | 003 | The split |
| `S/scripts/run-cli-tests.sh`, `.github/workflows/spec-kit-check.yml` | Modify | 001, 003 | How the cli lane runs |
| `D/tests/unit/fanout-run*.vitest.ts` | Modify, Create | 004 | The split |

`S` is `.skilled/skills/system-spec-kit/runtime`. `D` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-five-cuts/ | Stop running deep-loop twice, add the cli lane, parallel files, and the research | Complete |
| 2 | 002-fresh-timing-profile/ | Time every test file after the cuts | Complete |
| 3 | 003-split-upgrade-legacy/ | Split the slowest cli file into four | Complete: cli lane 397-430 s to 198-219 s |
| 4 | 004-split-fanout-run/ | Split the largest serial deep-loop file and promote safe pieces | Rejected: about 5 percent when stable, reverted |
| 5 | 005-ci-runner-timing/ | Read CI's own run times and decide a worker cap | Complete: no cap needed |
| 6 | 006-overlay-replaced-subtree-repin/ | Overlay engine: a re-pin copy's file inside a replaced folder is not a live edit | Complete |
| 7 | 007-test-and-ci-bloat-research/ | Research which tests, CI workflows and hook checks are bloat, and rank the cuts by time saved. Research only | Complete: the wait is the slowest workflow, three changes shorten it |
| 8 | 008-spec-kit-check-parallel-jobs/ | Run the three sequential `Spec-Kit Check` suites as parallel jobs | Complete: slowest job 384 to 627 s on three runs against 867 s |
| 9 | 009-legacy-lane-overlap-measurement/ | Measure how far the legacy lanes repeat the CLI vitest project | Measured: 6 overlapping tests, keep the lanes |
| 10 | 010-sk-doc-tests-path-filter/ | Run 54 of the sk-doc script tests only when sk-doc paths change | Complete: both workflows pass on the pull request |
| 11 | 011-sparse-checkout-rollout/ | Sparse checkout for workflows that read only named paths | Complete for five workflows, two reverted: checkout 2 to 6 s against 55 to 74 s |
| 12 | 012-advisor-suite-parallel-trial/ | Trial the advisor suite with files in parallel | Rejected: 213 s to about 100 s, but one timing test failed two of three runs, reverted |
| 13 | 013-advisory-checks-blocking-gates/ | Make the 13 gate-critical node suites blocking | Complete for 12 suites: the job also builds the skill advisor, and the stdin deadline suite went back to report-only after it lost a timing race on one of six runs |
| 14 | 014-dead-runner-and-step-cleanup/ | Remove the sharded runner nothing calls and one duplicated workflow step | Complete |
| 15 | 015-hook-suite-job-split/ | Move the hook vitest suites into their own workflow | Complete: both workflows pass on the pull request |
| 16 | 016-local-test-timing-profile/ | Time the three local test commands once each | Measured: 914 s, 211 s and 527 s |
| 17 | 017-specs-artifact-tracking-decision/ | Measure the tracked research and scratch files and write the options | Measured: 88,151 files, decision is the operator's |
| 18 | 018-cli-vitest-shards/ | Run the CLI vitest job as three shards | Complete: shards at 170, 213 and 277 s against 384 to 627 s for the one job |
| 19 | 019-local-test-speedups/ | Cut local spec-kit and deep-loop test time without removing a test | Complete: spec-kit 667 s to 256 s and deep-loop 497 s to 225 s locally. The runner's deep-loop step is unchanged at about 350 s |
| 20 | 020-test-speed-followups/ | Retry a failed install, fix two racy test deadlines and stop five test files leaving temp folders | Complete: pull request 101 passed 39 checks with the hook deadline suite blocking again. The retry is proven against a stand-in npm only |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Phases 3 and 4 start only when phase 2 says go
- Phase 5 can run at any time after phase 1, since it reads CI history

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-five-cuts | 002-fresh-timing-profile | The cuts are pushed | `git log origin/main` holds the cut commits |
| 002-fresh-timing-profile | 003-split-upgrade-legacy | Phase 2 says go for phase 3 | Phase 2's summary names the number |
| 003-split-upgrade-legacy | 004-split-fanout-run | Phase 2 says go for phase 4 | Phase 2's summary names the number |
| 004-split-fanout-run | 005-ci-runner-timing | Phase 1 is pushed and CI has run at least twice | `gh run list` shows the runs |
| 005-ci-runner-timing | 006-overlay-replaced-subtree-repin | Independent; added to the series at the operator's request | The overlay test files pass |
| 006-overlay-replaced-subtree-repin | 007-test-and-ci-bloat-research | Independent; added to the series at the operator's request | `007-test-and-ci-bloat-research/research/` holds a `research.md` |
| 007-test-and-ci-bloat-research | 008-spec-kit-check-parallel-jobs | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 008-spec-kit-check-parallel-jobs | 009-legacy-lane-overlap-measurement | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 009-legacy-lane-overlap-measurement | 010-sk-doc-tests-path-filter | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 010-sk-doc-tests-path-filter | 011-sparse-checkout-rollout | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 011-sparse-checkout-rollout | 012-advisor-suite-parallel-trial | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 012-advisor-suite-parallel-trial | 013-advisory-checks-blocking-gates | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 013-advisory-checks-blocking-gates | 014-dead-runner-and-step-cleanup | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 014-dead-runner-and-step-cleanup | 015-hook-suite-job-split | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 015-hook-suite-job-split | 016-local-test-timing-profile | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 016-local-test-timing-profile | 017-specs-artifact-tracking-decision | Independent; each phase builds one research finding | The earlier phase is committed on the branch |
| 017-specs-artifact-tracking-decision | 018-cli-vitest-shards | Independent; phase 18 follows the runner figures from pull request 97 | The earlier phase is committed on the branch |
| 018-cli-vitest-shards | 019-local-test-speedups | Independent; phase 19 targets local runs, which the CI phases did not change | The earlier phase is on main |
| 019-local-test-speedups | 020-test-speed-followups | Independent; phase 20 closes three follow-ups that phases 13 and 19 recorded | The earlier phase is on main |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The phase parent tracks the five test-cycle phases and the condition that closes the series.
<!-- /ANCHOR:requirements -->
