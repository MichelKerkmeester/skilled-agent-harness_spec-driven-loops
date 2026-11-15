---
title: "Feature Specification: Phase 22: dsh-verify-iteration-executor"
description: "The post-dispatch gate the review and research workflows actually run, verify-iteration.cjs, never checks which executor ran an iteration, so a non-native iteration whose executor audit never landed passes as verified. This phase makes that gate fail such an iteration with executor_missing and leaves native runs and fan-out lineages alone."
trigger_phrases:
  - "dsh verify iteration executor"
  - "phase 22 dsh verify iteration executor"
  - "verify-iteration executor_missing"
  - "executed post-dispatch gate executor identity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: dsh-verify-iteration-executor

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
| **Branch** | `worktrees/403-dsh-verify-iteration-executor` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-dsh-remaining-direct-writers |
| **Successor** | None |
| **Handoff Criteria** | The executor tests pass and fail on the old script, the real 019 review copy passes, the typecheck exits 0 and the contract drift check prints `[CONTRACT DRIFT] OK commands=3` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the DeepSeek Harness creation specification. Phase 021 listed as its first known limitation that the executed gate does not read the executor. The operator asked on 2026-11-15 to make the executed post-dispatch gate check executor identity.

**Scope Boundary**: the executor check in `verify-iteration.cjs`, its tests and the reason lists in the four review and research workflows. Nothing else changes.

**Dependencies**:
- Phases 019 to 021, which put a non-native executor on the iteration's `iteration_start` row before the leaf runs

**Deliverables**:
- `verify-iteration.cjs` fails a non-native iteration that names no executor with `executor_missing`
- Native runs, runs whose config has no executor block and fan-out lineages pass as today
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each review and research workflow runs `verify-iteration.cjs` in its `post_dispatch_validate` step, and that script checks the narrative, the state record, the delta and the route proof but never the executor. The documented `validateIterationOutputs` holds the `executor_missing` check, yet no workflow step runs it. So an iteration that ran under a CLI executor and whose executor audit never landed is counted as verified.

### Purpose
The executed gate fails a non-native iteration that names no executor, and passes every iteration where no executor row is written by design.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The script at `HEAD` (`e70f6d44267`) ran on 2026-11-15 against scratch copies of the real phase 019 review folder, the same copy with the executor removed from its `iteration_start` row and the older phase 006 review folder, whose five iterations predate the executor audit.
```text
$ node <HEAD verify-iteration.cjs> --loop-type review --artifact-dir <copy of 019 review> --iteration 1
OK iteration 1 complete: narrative + route-proof + delta
exit 0
$ node <HEAD verify-iteration.cjs> --loop-type review --artifact-dir <019 copy, executor removed> --iteration 1
OK iteration 1 complete: narrative + route-proof + delta
exit 0
$ for i in 1 2 3 4 5; do node <HEAD verify-iteration.cjs> --loop-type review --artifact-dir <copy of 006 review> --iteration $i; done
OK iteration 1 complete: narrative + route-proof + delta
OK iteration 2 complete: narrative + route-proof + delta
OK iteration 3 complete: narrative + route-proof + delta
OK iteration 4 complete: narrative + route-proof + delta
OK iteration 5 complete: narrative + route-proof + delta
```
Both configs name `"kind": "cli-deepseek-harness"`. Neither the stripped copy nor the 006 log has an `executor` key on any row, and every iteration passes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the run's executor kind from `deep-review-config.json` or `deep-research-config.json` in the artifact directory, the way the executor audit resolves it.
- Fail the iteration with the `executor_missing` reason when that kind is non-native and neither the iteration record nor an `iteration_start` or `iteration` row of the same iteration names an executor.
- Skip the check for a native kind, a missing config or executor block and a fan-out lineage.
- Name `executor_missing` in the reason list of the four `post_dispatch_validate` steps and regenerate the compiled contracts.

### Out of Scope
- A changelog and a version bump - the caller releases the phase.
- `validateIterationOutputs`, the documented validator - no workflow step runs it, and phase 021 settled its opening-row rule.
- The reason lists' older gaps, such as `findings_not_enumerated` - they predate this phase and nothing here makes them wrong.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | The `executor_missing` reason, the config read, the lineage exemption and the check |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modify | Eight executor provenance cases |
| `.skilled/skills/system-deep-loop/changelog/v2.0.1.0.md`, and the version in the hub `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` | Create, Modify | The release |
| `.skilled/commands/deep/assets/deep-review.yaml`, `deep-research.yaml` | Modify | `executor_missing` in each `command_note` reason list |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown` | Regenerate | The contracts pin the workflow digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A non-native iteration with no executor on its record or on an `iteration_start` row of the same iteration fails with `executor_missing` | The `fails executor_missing` and `another iteration` cases pass, and fail on the old script |
| REQ-002 | An executor on the iteration's `iteration_start` row passes, on a log with a ledger beside it and on one without | The two `accepts the executor on the ... iteration_start row` cases pass, and fail on the old script |
| REQ-003 | A native run, a run with no config or no executor block and a fan-out lineage pass | The `leaves native runs` and `exempts a fan-out lineage` cases pass, and fail on the old script through their paired control |
| REQ-004 | The real phase 019 review copy passes | `verify-iteration.cjs --loop-type review --artifact-dir <copy> --iteration 1` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The four workflows name `executor_missing` among the gate's reasons, and the compiled contracts match | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` |
| REQ-006 | Research is checked the same way as review | The `checks a research run` case passes, and fails on the old script |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new case in `verify-iteration.vitest.ts` fails with the script at `HEAD` and passes with the change.
- **SC-002**: The full deep-loop suite fails no test in a changed file or one that loads a changed module, against the baseline in `tasks.md` T002.
- **SC-003**: `npm run typecheck` exits 0 and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The pre-dispatch audit writes the `iteration_start` row before the leaf runs | Without it every non-native iteration would fail | Phases 019 to 021 shipped it in all four workflows, and the real 019 review copy passes |
| Risk | A path that never writes an executor row fails a legitimate iteration | High | Fan-out lineages are exempt on any of three signals, and native and unconfigured runs are skipped |
| Risk | A run resumed from before the audit fails its new iterations if the audit does not run | Low | The audit runs before every non-native dispatch, so each new iteration gets its row. Only a re-check of an old iteration fails, as the 006 copy shows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the check accept the `iteration_start` row on a log with no ledger? Decision: yes. The post-dispatch executor patch runs after this gate, so at gate time the pre-dispatch row is the only executor record on such a log.
- Should the script import the documented validator's opening-row check? Decision: no. That check is a private function in a TypeScript module, and this script runs under plain Node with CommonJS imports only.
<!-- /ANCHOR:questions -->

---
