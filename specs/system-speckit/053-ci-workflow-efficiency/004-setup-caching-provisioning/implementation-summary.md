---
title: "Implementation Summary"
description: "Built and measured: the gate scans composite actions, the cached setup action and its adoptions, the hook and plugin merge, the kept install substitution, the pip caches and the sparse checkout are on main, the 14-row phase delta is recorded and all 17 criteria are met."
trigger_phrases:
  - "setup caching provisioning implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-25T20:28:31Z"
    last_updated_by: "markdown"
    recent_action: "Evidence recorded: 17/17 criteria met, 24/26 checks ticked"
    next_safe_action: "Tick CHK-022 and CHK-FIX-006 after the 2026-10-26T04:17Z cold run, then commit T074"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-004-setup-caching-provisioning"
      parent_session_id: null
    completion_pct: 99
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-setup-caching-provisioning |
| **Completed** | Built and measured 2026-10-25 |
| **Level** | 3 |
| **Status** | Closeable, two P1 checks wait on the 2026-10-26T04:17Z scheduled cold run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The workflow work is on `main`. `.github/scripts/check-gate-inputs.sh` scans `.github/actions/**`, `.github/actions/setup/action.yml` restores a cache, sets up bun, runs the repository's own `provision_worktree` and saves on a miss, the hook suites and the plugin suites share one job, one install substitution is kept where its warm step drops, four `setup-python` steps cache pip, and `.github/workflows/rule-canary-sync.yml` uses a sparse checkout. The 14-row phase delta is in `scratch/phase-result.md` (T072), all 17 acceptance rows are `Met` (T073), and the closure commit (T074) waits on the first scheduled cold run.

### Phase 4: setup-caching-provisioning

The gate learned to scan composite actions first, so the shared unit was inside the gate's surface from its first commit. The action then replaced the from-scratch install of a 2.22 GB tree set in the provisioning jobs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/scripts/check-gate-inputs.sh`, `.github/scripts/tests/check-gate-inputs.test.sh` | Modified (`cd58109fc5`, `a393488d82`) | The guarded `.github/actions/**` scan loop, the `description:` label branch and the fixture cases; the suite prints `57 passed, 0 failed` |
| `.github/actions/setup/action.yml` | Created (`fafaaa4e49`, keyed in `5efe36e731`, `~/.npm` dropped in `a4d92ea8e0`) | Restore, pinned bun setup, `provision_worktree`, conditional save |
| `.github/workflows/opencode-plugin-tests.yml`, `opencode-dual-version.yml` | Modified (`68e735d630`) | The action call at four sites |
| `.github/workflows/hooks-node-tests.yml` | Deleted (`2759de1119`) | Its steps moved into `opencode-plugin-tests.yml` |
| `.github/workflows/routing-registry-drift.yml` and ten more | Modified (`1c0c3534cf`), nine restored (`b5451258b2`) | One install substitution kept, `routing-registry-drift`, per `scratch/npm-dedupe.md` |
| `naming-standard-guard.yml`, `sk-doc-rename-harness.yml`, `sk-doc-script-tests.yml`, `spec-kit-check.yml` | Modified (`1c0c3534cf`) | `cache: pip` with a dependency path |
| `.github/workflows/rule-canary-sync.yml` | Modified (`ea39cd7b2c`) | The sparse checkout, the faster green variant in `scratch/checkout-probe.md` |
| `.github/workflows/README.md` | Modified (`2759de1119`) | One row for the merged workflow |
| `scratch/` | Created | `decisions.md`, `phase-baseline.md`, `cache-probe/summary.md`, `npm-dedupe.md`, `checkout-probe.md`, `phase-result.md` (its `## Phase delta` is T072), and the T072 raw data `runs-after.json` and `runs-after-jobs/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered by `tasks.md` T001 to T073, one commit per concern: the gate scan (`cd58109fc5`, then `a393488d82`), the action (`fafaaa4e49`, `5efe36e731`, `a4d92ea8e0`), the adoptions (`68e735d630`), the merge (`2759de1119`), the substitutions (`1c0c3534cf`, then `b5451258b2`) and the checkout variant (`ea39cd7b2c`). On the final tree `a60192ef4e` the gate prints `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` with `RESULT: PASSED` and the fixture suite prints `57 passed, 0 failed` (`scratch/phase-result.md`, `## Final gates`). T072 measured the 24 h delta from the T070G push, T073 closed the criteria. T074, the closure commit, waits for checklist rows CHK-022 and CHK-FIX-006, which need the first scheduled cold run (due 2026-10-26T04:17Z).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scan composite actions before the first action exists | The gate is the sole enforcer of the twin and input rules, and the action is the one CI surface it did not read |
| Provision on a hit and save only on a miss | The repository's own walk stays the authority, and a half-provisioned tree cannot be written back |
| Glob every lockfile and add no `restore-keys` | The walk accepts a tree by dependency name, so a key that misses a lockfile yields a green run with wrong versions |
| Keep the cold path on a weekly schedule | A warm cache hides a broken cold install, and the schedule is the only thing that exercises it without a person remembering |
| Keep an install substitution only when its warm step drops | The review's 20-40 runner-min/day is arithmetic on medians, and a lean job's cold run installs the whole list |
| Merge the hook tests into the plugin workflow | One provision replaces two, worth 124 runner-min/day standalone and about 27 after R1 and R14 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0`, `RESULT: PASSED` on the final tree (AC-001, AC-013) |
| `bash .github/scripts/tests/check-gate-inputs.test.sh` | `57 passed, 0 failed`, all four new labels present (AC-002) |
| YAML parse of every workflow and the action | Exit `0` over every workflow and the action (AC-013) |
| Cold dispatch and warm run | Run 2026-10-24 and green; after the `~/.npm` drop a clean warm provision step is 29 to 34 s against the 56 to 67 s baseline, a 31 s saving at the median (AC-006, `scratch/cache-adoption-runs.md` Round 2) |
| Merged-job log | The merge landed in `2759de1119` (AC-007, AC-008 `Met`, `scratch/phase-result.md`, `## R15 merge`) |
| `scratch/phase-result.md` against the baseline | 14 rows (grep prints `14`), 3079 to 1212 billed runner-min per 24 h, -1867 raw with phases 002 and 003 inside it. The merged row is 437 to 108. Per-run medians fell for the merged job (two runs of 4 and 3 min become one of 4), `rule-canary-sync` (2 to 1), `command-tree-parity` (4 to 3) and `spec-kit-check` (25 to 19), and rose for `sk-doc-script-tests` (6 to 7, cause unknown) (AC-014 `Met`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The raw delta is not this phase alone.** The before figures are the 001 dataset, the source T002's fallback names, because the 002 window opens after this phase's first changes reached main. So the raw delta also carries phase 002's fan-out removal, phase 003's path filters and a different day's traffic. The per-run medians are the part this phase changes, and that split is inferred: no window with this phase reverted was run.
2. **Two baselines are unmeasured.** `skill-advisor-stress` and `naming-standard-guard` had no runs in the 001 window, so their +18 and +4 have no measured before figure.
3. **Two samples are thin or skewed.** `naming-standard-guard` had two and `sk-doc-rename-harness` four completed runs in the window. 11 of 15 `spec-kit-check` runs failed at `Runtime vitest project`, and its four green runs bill a median of 17.5 min.
4. **One per-run regression is unexplained.** `sk-doc-script-tests` rose from 6 to 7 billed min per run, and no job was profiled step by step to find why.
5. **The scheduled cold run has not fired yet.** The weekly cron `17 4 * * 1` first fires on 2026-10-26T04:17Z, so the cold path is proven by the `cold: true` dispatches only. Checklist rows CHK-022 and CHK-FIX-006 in `tasks.md` stay open until that run is green.
<!-- /ANCHOR:limitations -->

---
