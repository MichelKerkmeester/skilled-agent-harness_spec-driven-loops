---
title: "Implementation Summary"
description: "Built and open: the gate scans composite actions, the cached setup action and its adoptions, the hook and plugin merge, the kept install substitution, the pip caches and the sparse checkout are on main. The 14-row phase delta (T072) and the closure (T073, T074) remain."
trigger_phrases:
  - "setup caching provisioning implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-25T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Delivered files listed"
    next_safe_action: "T072 phase delta, then T073 and T074"
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
    completion_pct: 94
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
| **Completed** | Built, closure open (T072 to T074) |
| **Level** | 3 |
| **Status** | In progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The workflow work is on `main`. `.github/scripts/check-gate-inputs.sh` scans `.github/actions/**`, `.github/actions/setup/action.yml` restores a cache, sets up bun, runs the repository's own `provision_worktree` and saves on a miss, the hook suites and the plugin suites share one job, one install substitution is kept where its warm step drops, four `setup-python` steps cache pip, and `.github/workflows/rule-canary-sync.yml` uses a sparse checkout. What remains is the 14-row phase delta in `scratch/phase-result.md` (T072) and the closure (T073, T074).

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
| `scratch/` | Created | `decisions.md`, `phase-baseline.md`, `cache-probe/summary.md`, `npm-dedupe.md`, `checkout-probe.md` and `phase-result.md` (its delta table is T072) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered by `tasks.md` T001 to T071, one commit per concern: the gate scan (`cd58109fc5`, then `a393488d82`), the action (`fafaaa4e49`, `5efe36e731`, `a4d92ea8e0`), the adoptions (`68e735d630`), the merge (`2759de1119`), the substitutions (`1c0c3534cf`, then `b5451258b2`) and the checkout variant (`ea39cd7b2c`). On the final tree `a60192ef4e` the gate prints `files=45 inputs_resolved=250 dynamic_inputs=39 twin_pairs=336 failures=0` with `RESULT: PASSED` and the fixture suite prints `57 passed, 0 failed` (`scratch/phase-result.md`, `## Final gates`). T072 to T074 are still open.
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
| `scratch/phase-result.md` against the baseline | The 14-row delta table is T072 (AC-014 `Unmet`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No number is measured yet.** Every saving in this packet comes from `001-research/research/synthesis-reviews/final-review.md` and is restated as a target, not an observation. `scratch/phase-result.md` replaces it with a measured delta against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`.
2. **The cache budget is unverified here.** The 2.22 GB set is documented to compress to roughly 0.7-1 GB per entry against a 10 GB budget, and T013 measures the real entry before the action is built.
3. **The gate work is committed.** The scan landed in `cd58109fc5` and the ignored-output fix in `a393488d82`.
4. **The phase delta is not recorded yet.** `scratch/phase-baseline.md` exists, and T072 writes the 14-row delta against it into `scratch/phase-result.md`.
<!-- /ANCHOR:limitations -->

---
