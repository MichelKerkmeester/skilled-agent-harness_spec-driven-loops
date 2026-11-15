---
title: "Feature Specification: Phase 23: dsh-lineage-executor-check"
description: "The post-dispatch gate skips the executor check for every fan-out lineage, so a CLI lineage passes even when nothing records which executor ran it. This phase checks a lineage against the invocation-metadata.json the fan-out runner writes, and lets the documented validator take the iteration_start row on a log with no ledger."
trigger_phrases:
  - "dsh lineage executor check"
  - "phase 23 dsh lineage executor check"
  - "lineage invocation metadata executor check"
  - "fan-out lineage executor_missing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: dsh-lineage-executor-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/404-dsh-lineage-executor-check` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-dsh-verify-iteration-executor |
| **Successor** | None |
| **Handoff Criteria** | Each new test fails on the old code and passes on the new, the typecheck exits 0, the contract drift check prints OK and the full suite shows no new failure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the DeepSeek Harness creation specification. Phase 022 recorded two known limitations: a fan-out lineage carries no executor check, and `validateIterationOutputs` takes the `iteration_start` row only on a ledger-backed log. This phase closes both.

**Scope Boundary**: the lineage branch of the executor check in `verify-iteration.cjs`, the opening-row condition in `post-dispatch-validate.ts`, their tests and the `executor_missing` sentence in the two workflows.

**Dependencies**:
- Phase 022, which added the executor check to `verify-iteration.cjs`
- The fan-out runner, which writes `invocation-metadata.json` into each lineage directory before it spawns the lineage

**Deliverables**:
- A CLI lineage passes the gate when its `invocation-metadata.json` names the executor kind its config names, and fails with `executor_missing` otherwise
- `validateIterationOutputs` takes the executor from the iteration's `iteration_start` row on any log
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`verify-iteration.cjs` returns early for any fan-out lineage, so a CLI lineage passes the executor check whether or not anything records its executor. The fan-out runner does record it, in `invocation-metadata.json` beside the lineage's config, but the gate never reads that file. Separately the documented validator `validateIterationOutputs` ignores the `iteration_start` row on a log with no ledger, where the pre-dispatch audit puts the executor too.

### Purpose
A CLI lineage is checked against the runner's executor record, and both executor checks read the same rows.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The script at `HEAD` (`e263e5481e7`) ran on 2026-11-15 against scratch copies of two real DeepSeek Harness lineages and of one of them with its `invocation-metadata.json` removed.
```text
$ node scripts/verify-iteration.cjs --loop-type review --artifact-dir <copy>/review/lineages/dsh-1 --iteration 1
OK iteration 1 complete: narrative + route-proof + delta
exit 0
$ node scripts/verify-iteration.cjs --loop-type review --artifact-dir <copy>/review/lineages/dsh-1-nometa --iteration 1
OK iteration 1 complete: narrative + route-proof + delta
exit 0
$ node scripts/verify-iteration.cjs --loop-type research --artifact-dir <copy>/research/lineages/deepseek-1 --iteration 1
OK iteration 1 complete: narrative + route-proof + delta
exit 0
```
Both configs name `"kind": "cli-deepseek-harness"`. The copy with no metadata file passes the same as the one that has it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `effectiveConfig.kind` from the lineage's `invocation-metadata.json` when the run is a fan-out lineage with a non-native executor kind.
- Pass that lineage iteration when the file names the configured kind, and fail it with `executor_missing` when the file is absent, unreadable, names no kind or names another kind.
- Drop the ledger condition from the opening-row check in `validateIterationOutputs`.
- Reword the `executor_missing` sentence in the two workflows and regenerate their compiled contracts.

### Out of Scope
- A changelog and a version bump - the caller releases the phase.
- An exemption for lineage folders that predate the metadata file - the gate runs only on a live iteration, and the runner writes the file before every spawn.
- Changing how the fan-out runner writes the file - it already writes it before every dispatch, retries and resumes included.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | The lineage branch reads `invocation-metadata.json` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | The opening row counts on a log with no ledger |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | The lineage cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modify | The no-ledger opening-row case |
| `.skilled/commands/deep/assets/deep-review.yaml`, `deep-research.yaml` | Modify | The `executor_missing` sentence in each `command_note` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown` | Regenerate | The contracts pin the workflow digests |
| `.skilled/skills/system-deep-loop/changelog/v2.0.2.0.md`, and the version in the hub `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` | Create, Modify | The release |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A CLI lineage whose `invocation-metadata.json` names the configured kind passes | The matching-metadata case passes on each of the three lineage signals |
| REQ-002 | A CLI lineage with no metadata file, or one that names no kind or another kind, fails with `executor_missing` | The missing-metadata case passes, and fails on the old script |
| REQ-003 | A native lineage and a lineage whose config has no executor block still pass | The exempt-lineage case passes, and fails on the old script through its paired control |
| REQ-004 | `validateIterationOutputs` takes the executor from the `iteration_start` row of a log with no ledger | The no-ledger opening-row case passes, and fails on the old module |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The two workflows describe the lineage check, and the compiled contracts match | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK` |
| REQ-006 | No existing test breaks | The full deep-loop suite shows no failure the baseline lacks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new case fails with the source at `HEAD` and passes with the change.
- **SC-002**: The real `dsh-1` lineage copy still passes, and the same copy with no metadata file exits 1 with `executor_missing`.
- **SC-003**: `npm run typecheck` exits 0, the drift check prints OK and the full suite shows no new failure against the baseline in `tasks.md` T002.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The fan-out runner writes `invocation-metadata.json` before it spawns a lineage | Without it every CLI lineage would fail | The write sits in the pool worker after the command build and before the spawn, so every attempt rewrites it. In a survey of 681 lineage configs under `specs/`, all 303 folders whose config and metadata both name a kind name the same one |
| Risk | A lineage folder that predates the metadata file fails when an old iteration is checked again | Low | The gate runs only on a new iteration of a live run, which the current runner always launches with the file. Phase 022 took the same stance on old non-lineage runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a lineage folder with no metadata file stay exempt as an older run? Decision: no. Nothing tells an older folder from a current one whose file is missing, and no live path reaches an older folder.
- Do salvage or a dry run need an exemption? Decision: no. Salvage runs after the lineage exits, in the folder that already holds the file, and never runs the gate. The fan-out runner has no dry-run mode.
<!-- /ANCHOR:questions -->

---
