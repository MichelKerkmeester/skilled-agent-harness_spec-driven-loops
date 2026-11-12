---
title: "Implementation Summary"
description: "Every local test command now has a current number: the spec-kit chain took 913.63 s, the advisor suite 210.52 s and the deep-loop suite 527.21 s on 2026-11-12, and all three passed."
trigger_phrases:
  - "local test timing profile implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile"
    last_updated_at: "2026-11-12T08:22:02Z"
    last_updated_by: "orchestrator"
    recent_action: "Timed the three local test commands once each and recorded the figures"
    next_safe_action: "None. The figures are the baseline for any later local speed-up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-local-test-timing-profile"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-local-test-timing-profile |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The next decision about local test speed can now start from a current number instead of a stale one. Each of the three local test commands ran once under a wall-clock timer, and the wait and exit status went into one record beside the run conditions that make the seconds readable.

### Phase 16: local-test-timing-profile

The phase measures what exists and changes no product file. It confirmed the three declared scripts, ran each runtime's `npm test` exactly once under `/usr/bin/time -p`, and wrote the `real` line and the shell's exit status into `scratch/local-test-timings.md`. All three suites passed, so every row can serve as a baseline.

The declared commands differ in what they cover, and the record keeps that visible. The spec-kit command chains three lanes (`test:core`, `test:cli`, `test:spec-validation`), so its 913.63 s is the whole chain and not the cli lane alone. The advisor and deep-loop commands each run one vitest pass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/local-test-timings.md` | Created | One row per runtime with the command, wall seconds, exit status and the run conditions |
| `spec.md` | Modified | REQ-003 and SC-002 now compare against the setup baseline of six pre-existing paths instead of claiming a clean tree |
| `plan.md` | Modified | Definition of Done carries the same baseline correction |
| `tasks.md` | Modified | Task state, plus T010's expectation and the reason it changed from zero to five |
| `implementation-summary.md` | Modified | This record |
| `graph-metadata.json` | Modified | Derived index refreshed by the validator's Draft auto-repair after the packet edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran from the repository root in this order.

1. Confirmed the three declared scripts with `node -p` on each `package.json`: `node scripts/run-tests.mjs`, `vitest run` and `vitest run --no-coverage`.
2. Captured the setup baseline: `git status --porcelain --untracked-files=no` listed five paths inside the three runtimes and six under `.skilled/skills`, all from sibling packets.
3. Created `scratch/local-test-timings.md` with the date, Node v26.13.0, the one-run condition, the timer explanation and the pass/fail rule.
4. Before each run, confirmed `pgrep -fl vitest` found no vitest process, then ran `(cd <runtime> && /usr/bin/time -p npm test)` once and read the `real` line and the exit status.
5. Wrote each row immediately after its run, then reran the structural checks over the finished record.

No build ran before any timing, and no test, config, workflow or source file changed. Each lane of the spec-kit chain carries the same 600 s bound; its last lane printed `[test-bound] healthy invocation completed in 94374ms; bound 600000ms; margin 505626ms`, and no lane reported a timeout, so no row records a bound hit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Time `npm test` rather than the inner script | That is the command an operator types and the one each `package.json` declares, so npm startup is part of the wait being measured. |
| One run per suite, no median | The ask is a current number. Repeats are a trial with its own overhead and its own gate, and one row is enough to show the order of magnitude that a later cut can target. |
| Repeat the T010 check against the setup baseline instead of reverting the five paths | The five tracked modifications belong to sibling packets in the same worktree. Reverting them would destroy in-flight work outside this phase's scope, and the identical before-and-after lists already prove the three runs changed nothing. |
| Keep all three rows although the deep-loop number moved up | A slower current number is the finding, not a reason to discard it. The earlier 504-511 s figure predates the latest changes, and the record labels its own conditions. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 declared spec-kit script | `node scripts/run-tests.mjs` |
| T002 declared advisor script | `vitest run` |
| T003 declared deep-loop script | `vitest run --no-coverage` |
| T004 table header | `rg -c` printed `1` |
| T005 spec-kit row | `rg -c` printed `1` |
| T006 advisor row | `rg -c` printed `1` |
| T007 deep-loop row | `rg -c` printed `1` |
| T008 complete rows | `rg -c` printed `3` |
| T009 data rows only | `rg -c` printed `3` |
| T010 tracked files inside the three runtimes | `wc -l` printed `5`, the same five paths as the setup baseline |
| T011 this summary names all three runtimes | `rg -c` printed `3` |
| REQ-004 one-run phrase | `rg -c 'one run per suite'` printed `1` |
| SC-002 tracked files under `.skilled/skills` | `wc -l` printed `6`, the same six paths as the setup baseline |
| Packet validator (`validate.sh --strict --quiet`) | `RESULT: PASSED (errors=0 warnings=0)` |

### Measurements

| Runtime | Command | Wall seconds | Exit | Suite result |
|---------|---------|--------------|------|--------------|
| `.skilled/skills/system-spec-kit/runtime` | `npm test` | 913.63 | 0 | pass, 84 passed / 0 failed / 0 skipped, `RESULT: PASSED` |
| `.skilled/skills/system-skill-advisor/runtime` | `npm test` | 210.52 | 0 | pass, 161 files, 1387 tests, 8 skipped |
| `.skilled/skills/system-deep-loop/runtime` | `npm test` | 527.21 | 0 | pass, 173 files, 2885 tests, 8 skipped |

Raw timer lines: spec-kit `real 913.63 / user 911.23 / sys 1442.63`; advisor `real 210.52 / user 122.94 / sys 18.60`; deep-loop `real 527.21 / user 299.24 / sys 231.00`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One observation per suite on a working desktop.** The three numbers come from one machine on one day, with the desktop's usual applications open at a load average between 9 and 15 on 18 cores. They show the order of magnitude a cut can target, not a variance band; a repeat series would need its own phase.
2. **The spec-kit figure covers three lanes.** The 913.63 s is the whole declared chain, so it is not comparable with the older "cli lane near 200" figure, which measured one lane alone. Read it as the wait an operator feels for that command.
3. **The worktree was not clean at setup.** Five tracked paths inside the three runtimes and six under `.skilled/skills` were already modified by sibling packets. The phase proves the three runs added nothing to those lists, not that the tree is clean. The packet's original zero expectation was corrected to the measured baseline.
4. **The suites were timed as they are today.** The spec-kit lane carries an uncommitted `package.json` edit from a sibling packet that removed `test:sharded`, so the measured command is the declared command on this tree rather than the one on the default branch.
<!-- /ANCHOR:limitations -->
