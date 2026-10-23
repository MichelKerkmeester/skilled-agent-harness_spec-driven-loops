---
title: "Implementation Summary"
description: "Planned, not built: this phase probes the spec-kit CLI vitest project under file parallelism, flips the cli project or shards the step, re-checks the three real-failure workflows and fixes what is still red without a retry, adds a fast-fail contract-drift step, and records the five single old failures closed. Nothing in this folder has been implemented yet."
trigger_phrases:
  - "slow and failing tests implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
    last_updated_at: "2026-10-23T14:20:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded the planned scope and the not-built state"
    next_safe_action: "Run tasks.md from T001"
    blockers:
      - "002-rebuild-fanout-removal baseline pending; the 001 dataset stands in as provisional"
      - "runtime/cli/dist and the deep-loop and advisor trees are not installed in this worktree"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
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
| **Spec Folder** | 005-slow-and-failing-tests |
| **Completed** | Not built |
| **Level** | 3 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing. This packet is a plan, and no file under `.github/` or `.skilled/` has changed. The plan is carried by `spec.md` (REQ-001 to REQ-007), `plan.md` (the L3 dependency graph, critical path, milestones and AI execution framework), `tasks.md` (T001 to T040), `acceptance-criteria.md` (AC-001 to AC-011), `decision-record.md` (ADR-001 to ADR-010) and `goal.md`.

### Phase 5: slow-and-failing-tests

When it is built, `.skilled/skills/system-spec-kit/vitest.config.ts:67` runs the `cli` project's 183 test files in parallel, or `.github/workflows/spec-kit-check.yml:124-128` runs them as two shards when the probe collides, so the `CLI vitest project` step falls from 791 s to under 400 s. `scratch/r19-probe.md` records the serial baseline, the three parallel runs and the one outcome token. `scratch/r21-recheck.md` records the latest 40 runs of deep-loop-runtime, diagram-corpus and skill-advisor-stress, one root-cause row per live class, the five single old failures closed, the no-retry proof and the green streaks. `.github/workflows/deep-loop-runtime.yml` gains a `check-contract-drift.cjs` step above the suite, so a stale compiled contract fails in seconds instead of after the whole run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Planned modify | `fileParallelism: true` at `:67` with a behavioural reason, and a comment at `:14-17` that no longer claims both projects are serial |
| `.github/workflows/spec-kit-check.yml` | Planned modify only when the probe collides | Two `--shard` halves inside the `CLI vitest project` step at `:124-128`, with both statuses propagated |
| `.github/workflows/deep-loop-runtime.yml` | Planned modify | A `check-contract-drift.cjs` step between the install step at `:51-57` and the suite at `:59-60` |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown` | Planned modify only when the checker exits 2 | The regenerated contract, written by `compile-command-contracts.cjs --write` |
| `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md` | Planned modify only when diagram-corpus still fails | The `version:` line at `:9`, inside the anchor's major.minor era |
| `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` | Planned modify only when skill-advisor-stress still fails | The default import at `:20` and the three assertions at `:101-104` |
| `scratch/r19-probe.md`, `scratch/r20-ci-step.md`, `scratch/r21-recheck.md` | Planned create | The probe rows and outcome, the before and after step seconds with the 5-run streak, and the re-check tables with the root causes and the five stale rows |
| `scratch/r19-*.log`, `scratch/r21-*-runs.json`, `scratch/r21-*-failures.log`, `scratch/gate-run.log`, `scratch/validate.log` | Planned create | The raw evidence every acceptance row cites |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned in three tiers, in `tasks.md`: the reference timing and the provisioned tree (T001, T002); the probe header, the serial baseline, the one-setting copy and three parallel runs, the deleted copy and the recorded outcome (T003 to T010); the config flip or the two-way shard (T011 to T014); the three 40-run pulls, the re-check tables and the root causes (T015 to T022); the drift verdict, the regeneration, the fast-fail step and its negative proof (T023 to T026); the two conditional fixes, the five stale confirmations and the no-retry proof (T027 to T030); then the gates, two commits, the post-change step measurement, the 5- and 10-run streaks, the acceptance rows, the packet validation and the closure commit (T031 to T040). The gates are `bash .github/scripts/check-gate-inputs.sh`, its fixture suite, the YAML parse of every workflow and `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probe on a copy, then change the real config | The real file stays untouched until the setting is proven three times against the real suite |
| Flip the `cli` project only | It is the wall-clock tail; the root, advisor and deep-loop suites share mutable state |
| A two-way shard inside the existing step | It keeps the job count and the check name, so phase 007 measures the same shape |
| A behavioural comment with no packet id | The reason stays readable after the packet closes, and the pre-commit gate passes |
| Re-pull 40 runs before fixing anything | The newest runs of two workflows already pass, so the research counts are stale |
| Fix causes and add no retry | The failures correlate across workflows, which is a defect signature, not flake |
| Fail a stale contract in seconds | The class recurs on any contract-source edit, and the suite only reports it after about 12 minutes |
| File a cause for a workflow that stays red | The phase closes on evidence rather than on a colour |
| Record the five old failures closed | A later green run is the proof, and a re-fix would touch files the failure no longer reaches |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -cE '^outcome: (parallel\|shard)$' scratch/r19-probe.md` | Planned: `1` (AC-001) |
| `grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.ts` | Planned: `1`, with `fileParallelism: false` still `1` (AC-002, AC-011) |
| The `CLI vitest project` step on the first post-change run | Planned: under `400` s, against `791` in run `39909844384` (AC-003) |
| `grep -c '^all_green: true$' scratch/r20-ci-step.md` | Planned: `1` over 5 runs (AC-003) |
| `scratch/r21-recheck.md` root-cause rows | Planned: one per live class, each with a test, a class and a seven-character SHA (AC-004) |
| `grep -c '\| closed \|' scratch/r21-recheck.md` | Planned: `5` (AC-005) |
| The three workflows' 10-run streak | Planned: `3` `all_green=true count=10` lines, or a `filed` row per red workflow (AC-006) |
| `rg -n 'retry\|rerun\|continue-on-error'` over the three workflows | Planned: `0` lines, and `retry-proof: clean` recorded (AC-007) |
| `bash .github/scripts/check-gate-inputs.sh` | Planned: `RESULT: PASSED` (AC-008) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PWD/…/005-slow-and-failing-tests" --strict` | Planned: `RESULT: PASSED` (AC-008) |
| The fast-fail step against a stale contract | Planned: exit `2` with `STALE_SOURCE_DIGEST`, then exit `0` after the restore (AC-009) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No number is measured yet.** Every figure in this packet comes from `001-research/research/synthesis-reviews/final-review.md` and is restated as a target, not an observation. `scratch/r20-ci-step.md` replaces the 791 s reference with a measured after number.
2. **The 400 s ceiling is absolute, not a ratio.** The step's samples span 776 to 950 s, and a later run reads 642 s, so the acceptance reads the first post-change run rather than a percentage of 791.
3. **The probe cannot run in this worktree as it stands.** `.skilled/skills/system-spec-kit/node_modules` exists, but `runtime/cli/dist` and the deep-loop and advisor trees do not, so T002 builds and installs before T004.
4. **Two workflows cannot be dispatched.** deep-loop-runtime and skill-advisor-stress have no `workflow_dispatch`, so their 10-run streaks wait on repository traffic; T037 files a cause when a workflow cannot reach ten.
5. **The five stale failures are recorded, not fixed.** A later green run proves each one stale, and no file outside this phase changes for them.
<!-- /ANCHOR:limitations -->

---
