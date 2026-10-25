---
title: "Implementation Summary"
description: "In progress, only the gate-scan slice delivered: this phase teaches the gate-input check to scan composite actions — the scan loop, the description-as-label rule and four fixture cases are in place but uncommitted, and D5 is recorded — while the baseline, the cache probe, the composite action and its adoptions, the merge, the substitutions, the pip cache, the checkout trial and the delta remain."
trigger_phrases:
  - "setup caching provisioning implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the warm-run saving and the AC-006 ruling"
    next_safe_action: "Build the hook-and-plugin merge (T030)"
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
    completion_pct: 10
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
| **Completed** | Gate-scan slice only (uncommitted); everything else pending |
| **Level** | 3 |
| **Status** | In progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Only the gate-scan slice is delivered, and it is uncommitted: `.github/scripts/check-gate-inputs.sh` carries the guarded `.github/actions/**` scan loop and the `(name|description):` label branch, and `.github/scripts/tests/check-gate-inputs.test.sh` carries fixture cases 50-53, which print `check-gate-inputs: 54 passed, 0 failed`. `scratch/decisions.md` records `D5=approve`. Everything else is pending: the T002/T003 baseline and inventory, T010's rule comment, T011's `scratch/phase-result.md`, T011A's commit of the two gate files, the cache probe, the composite action, the five adoptions, the merge, the substitutions, the pip cache, the checkout trial, the delta and closure.

### Phase 4: setup-caching-provisioning

When it is built, `.github/actions/setup/action.yml` restores a cache, sets up bun, runs the repository's own `provision_worktree` and saves on a miss, and the five provisioning jobs in `.github/workflows/hooks-node-tests.yml`, `.github/workflows/opencode-plugin-tests.yml` and `.github/workflows/opencode-dual-version.yml` call it instead of installing a 2.22 GB tree set from scratch. The gate at `.github/scripts/check-gate-inputs.sh` learns to scan `.github/actions/**` first, so the new shared unit is inside the gate's surface from its first commit. The hook suites and the plugin suites then share one job, ten multi-install workflows route their repeated `npm ci` blocks through the action, four `setup-python` steps cache pip, and `.github/workflows/rule-canary-sync.yml` trials a partial checkout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/scripts/check-gate-inputs.sh` | Modified, uncommitted | The guarded `.github/actions/**` scan loop and the `description:` label branch are in; the rule comment (T010) is still pending |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Modified, uncommitted | All four cases in; the suite prints `54 passed, 0 failed` |
| `.github/actions/setup/action.yml` | Planned create | Restore, pinned bun setup, `provision_worktree`, conditional save |
| `.github/workflows/hooks-node-tests.yml` | Planned delete | Its steps and rationale move into the plugin workflow |
| `.github/workflows/opencode-plugin-tests.yml` | Planned modify | The action call, the union trigger, the three hook steps, the rename, the cold input and the weekly schedule |
| `.github/workflows/opencode-dual-version.yml` | Planned modify | The action call in both jobs, the cold input, the filters and the deleted bun bootstrap |
| `.github/workflows/routing-registry-drift.yml`, `spec-kit-check.yml` | Planned modify | One action call per job; the sk-vision build step is dropped because the provision list builds the bundle |
| Eight more multi-install workflows | Planned modify | One action call per install block, kept only where the warm step drops |
| `naming-standard-guard.yml`, `sk-doc-rename-harness.yml`, `sk-doc-script-tests.yml`, `spec-kit-check.yml` | Planned modify | `cache: pip` with the workflow file as the dependency path |
| `.github/workflows/rule-canary-sync.yml` | Planned modify | `filter: blob:none`, then a sparse cone when it saves less than 10 s |
| `.github/workflows/README.md` | Planned modify | One row for the merged workflow, and the deleted file dropped from the path-filtered row |
| `scratch/` | Partially created | `decisions.md` exists with `D5=approve`; `phase-baseline.md`, `cache-probe/summary.md`, `npm-dedupe.md`, `checkout-probe.md` and `phase-result.md` are pending |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered so far as a partial first tier: T001's `D5=approve` is recorded, and T004 to T009 — the scan loop, the label branch and the four fixtures — landed uncommitted ahead of the baseline (deviation recorded in the 2026-10-24 amendment). Still planned: T002/T003's baseline and inventory, T010's comment, T011's result file and T011A's commit, then the cache probe and the action (T012 to T014A), the adoptions, merge, substitutions, pip cache and checkout trial (T015 to T070), and the gates plus the 24 h delta (T071 to T074). The gates today read `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0` with `RESULT: PASSED` and `check-gate-inputs: 54 passed, 0 failed`.
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
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0`, `RESULT: PASSED`; the `files=46` arm waits on the action (AC-001, AC-013) |
| `bash .github/scripts/tests/check-gate-inputs.test.sh` | `54 passed, 0 failed`, all four new labels present (AC-002, met) |
| YAML parse of every workflow and the action | Exit `0` over the workflows today; the action-file arm waits on T014 (AC-013) |
| Cold dispatch and warm run | Run 2026-10-24 and green; after the `~/.npm` drop a clean warm provision step is 29 to 34 s against the 56 to 67 s baseline, a 31 s saving at the median (AC-006, `scratch/cache-adoption-runs.md` Round 2) |
| Merged-job log | Not run; the merge is unbuilt (AC-008) |
| `scratch/phase-result.md` against the 002 baseline | Not run; T002 takes the 001-dataset fallback until the 002 baseline exists (AC-014) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No number is measured yet.** Every saving in this packet comes from `001-research/research/synthesis-reviews/final-review.md` and is restated as a target, not an observation. `scratch/phase-result.md` replaces it with a measured delta against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`.
2. **The cache budget is unverified here.** The 2.22 GB set is documented to compress to roughly 0.7-1 GB per entry against a 10 GB budget, and T013 measures the real entry before the action is built.
3. **The gate work is uncommitted.** T004 to T009 live only in the working tree; T011A's commit is what makes them durable, and T010's comment and T011's result file are still open inside the same slice.
4. **The baseline is not recorded yet.** T002 falls back to the 001 dataset and labels it provisional, because no research figure may stand in for a measured before number; the 002 24 h snapshot is still absent.
<!-- /ANCHOR:limitations -->

---
