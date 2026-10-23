---
title: "Implementation Summary"
description: "Planned, not built: this phase teaches the gate-input check to scan composite actions, measures a cache against the 10 GB budget, adds one composite setup action at five provisioning sites, merges the hook tests into the plugin workflow, routes ten multi-install files through the action, caches pip in four workflows and trials a partial checkout. Nothing in this folder has been implemented yet."
trigger_phrases:
  - "setup caching provisioning implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-23T13:40:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded the planned scope and the not-built state"
    next_safe_action: "D5 is answered; run tasks.md from T002"
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
    completion_pct: 0
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
| **Completed** | Not built |
| **Level** | 3 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing. This packet is a plan, and no file under `.github/` has changed. The plan is carried by `spec.md` (REQ-001 to REQ-013), `plan.md` (the L3 dependency graph, critical path, milestones and AI execution framework), `tasks.md` (82 tasks: T001-T074 plus the lettered tasks T011A, T014A, T027A, T040A, T061A, T062A, T066A and T070G), `acceptance-criteria.md` (AC-001 to AC-017), `decision-record.md` (ADR-001 to ADR-011) and `goal.md`.

### Phase 4: setup-caching-provisioning

When it is built, `.github/actions/setup/action.yml` restores a cache, sets up bun, runs the repository's own `provision_worktree` and saves on a miss, and the five provisioning jobs in `.github/workflows/hooks-node-tests.yml`, `.github/workflows/opencode-plugin-tests.yml` and `.github/workflows/opencode-dual-version.yml` call it instead of installing a 2.22 GB tree set from scratch. The gate at `.github/scripts/check-gate-inputs.sh` learns to scan `.github/actions/**` first, so the new shared unit is inside the gate's surface from its first commit. The hook suites and the plugin suites then share one job, ten multi-install workflows route their repeated `npm ci` blocks through the action, four `setup-python` steps cache pip, and `.github/workflows/rule-canary-sync.yml` trials a partial checkout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/scripts/check-gate-inputs.sh` | Planned modify | A guarded scan of `.github/actions/**`, a `description:` label branch and a rule comment that names composite actions |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Planned modify | Four cases: clean action, unresolved path, unreadable shape, description label |
| `.github/actions/setup/action.yml` | Planned create | Restore, pinned bun setup, `provision_worktree`, conditional save |
| `.github/workflows/hooks-node-tests.yml` | Planned delete | Its steps and rationale move into the plugin workflow |
| `.github/workflows/opencode-plugin-tests.yml` | Planned modify | The action call, the union trigger, the three hook steps, the rename, the cold input and the weekly schedule |
| `.github/workflows/opencode-dual-version.yml` | Planned modify | The action call in both jobs, the cold input, the filters and the deleted bun bootstrap |
| `.github/workflows/routing-registry-drift.yml`, `spec-kit-check.yml` | Planned modify | One action call per job; the sk-vision build step is dropped because the provision list builds the bundle |
| Eight more multi-install workflows | Planned modify | One action call per install block, kept only where the warm step drops |
| `naming-standard-guard.yml`, `sk-doc-rename-harness.yml`, `sk-doc-script-tests.yml`, `spec-kit-check.yml` | Planned modify | `cache: pip` with the workflow file as the dependency path |
| `.github/workflows/rule-canary-sync.yml` | Planned modify | `filter: blob:none`, then a sparse cone when it saves less than 10 s |
| `.github/workflows/README.md` | Planned modify | One row for the merged workflow, and the deleted file dropped from the path-filtered row |
| `scratch/` | Planned create | `phase-baseline.md`, `cache-probe/summary.md`, `npm-dedupe.md`, `checkout-probe.md`, `phase-result.md`, `decisions.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned as 82 tasks (T001-T074 plus the lettered tasks T011A, T014A, T027A, T040A, T061A, T062A, T066A and T070G), in three tiers, in `tasks.md`: the D5 answer, the baseline rows and the pre-change inventory (T001 to T003); the gate scan and its four fixtures, the cache probe and the action (T004 to T014A); the five adoptions with the cold path, the merge, the install substitutions, the pip cache and the checkout trial (T015 to T070); then the whole-tree gates and the 24 h delta (T071 to T074). The gates are `bash .github/scripts/check-gate-inputs.sh`, its fixture suite, the YAML parse of every workflow and the action, and one cold dispatch run beside one warm run.
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
| `bash .github/scripts/check-gate-inputs.sh` | Planned: `files=46` and `RESULT: PASSED` (AC-001, AC-013) |
| `bash .github/scripts/tests/check-gate-inputs.test.sh` | Planned: `54 passed, 0 failed` (AC-002) |
| YAML parse of every workflow and the action | Planned: exit `0` (AC-013) |
| Cold dispatch and warm run | Planned: both green, recorded in `scratch/phase-result.md` (AC-006) |
| Merged-job log | Planned: every hook and plugin suite plus the installer test (AC-008) |
| `scratch/phase-result.md` against the 002 baseline | Planned: 14 rows and a delta (AC-014) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No number is measured yet.** Every saving in this packet comes from `001-research/research/synthesis-reviews/final-review.md` and is restated as a target, not an observation. `scratch/phase-result.md` replaces it with a measured delta against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`.
2. **The cache budget is unverified here.** The 2.22 GB set is documented to compress to roughly 0.7-1 GB per entry against a 10 GB budget, and T013 measures the real entry before the action is built.
3. **R18 depends on phase 003.** `rule-canary-sync.yml` keeps `fetch-depth: 0` until that phase's R8 lands, and T067 marks R18 blocked when it has not.
4. **The phase cannot start until 002 records its baseline.** T002 falls back to the 001 dataset and labels it provisional, because no research figure may stand in for a measured before number.
<!-- /ANCHOR:limitations -->

---
