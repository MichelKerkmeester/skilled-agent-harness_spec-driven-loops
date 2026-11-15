---
title: "Implementation Summary"
description: "The post-dispatch gate every review and research iteration runs now fails a non-native iteration that names no executor with executor_missing, and leaves native runs, unconfigured runs and fan-out lineages alone."
trigger_phrases:
  - "dsh verify iteration executor implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/022-dsh-verify-iteration-executor"
    last_updated_at: "2026-11-15T08:30:00Z"
    last_updated_by: "template-author"
    recent_action: "Built and verified the phase"
    next_safe_action: "Release the phase with a changelog and a version bump"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-dsh-verify-iteration-executor"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 022-dsh-verify-iteration-executor |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The gate the review and research workflows actually run now checks which executor ran the iteration. A CLI iteration whose executor audit never landed fails with `executor_missing` instead of passing as verified.

### Phase 22: dsh-verify-iteration-executor

`verify-iteration.cjs` reads the run's executor kind from `deep-review-config.json` or `deep-research-config.json`. When the kind is not native, the iteration must name an executor on its own record or on an `iteration_start` or `iteration` row of the same iteration, which is where the pre-dispatch audit puts it. A native run, a run with no config or no executor block and a fan-out lineage are not checked, because no executor row is written there by design. The four workflows now list `executor_missing` among the gate's reasons.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modified | The `executor_missing` reason, the config read, the lineage exemption and the check after the route proof |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts` | Modified | Eight executor provenance cases |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modified | `executor_missing` and one sentence on it in each `command_note` |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown` | Regenerated | They pin the workflow digests. The AI Council contract regenerated unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The script at `e70f6d44267` ran first on scratch copies of two real review folders and passed every iteration. The baseline suite ran with every changed file put back at `HEAD`. The check and the tests went in next, then the fail-first run with the script at `HEAD`, the real copies again, the typecheck, the drift check and the full suite. Nothing was committed, and the changelog and version bump are left to the caller.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the executor kind from the run config | Every workflow writes the config beside the state log before the first dispatch, so no YAML step needs a new argument |
| Accept the `iteration_start` row on a log with no ledger too | This gate runs before the post-dispatch patch, so on such a log the pre-dispatch row is the only executor record at gate time |
| Exempt a fan-out lineage on any of three signals | A CLI lineage runs its iterations inline and skips the pre-dispatch audit, and lineage configs in `specs/` mark themselves inconsistently. `SPECKIT_FANOUT_LINEAGE_ID`, a lineage key in the config or a `lineages/<label>` artifact directory each suffice |
| Write a short predicate instead of importing the documented validator's check | That check is private to a TypeScript module, and this script runs under plain Node with CommonJS imports only |
| Pair every passing case with a failing control | An exemption alone passes on the old script too, so each case asserts the bare shape fails before asserting the exempt one passes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Touched file | PASS. `Tests  39 passed (39)`, up from 31 |
| Fail first | PASS. With the script at `HEAD` the file printed `8 failed \| 31 passed (39)`, every failure an assertion |
| Real 019 copy | PASS. `OK iteration 1 complete`, exit 0. The same copy with the executor removed from its `iteration_start` row exits 1 with `executor_missing` |
| Real 006 copy | Each of the five iterations exits 1 with `executor_missing`. That is right: the run names `cli-deepseek-harness` and its iterations predate the executor audit, so none names an executor |
| Typecheck | PASS. `npm run typecheck` exit 0 |
| Contract drift | PASS. `[CONTRACT DRIFT] OK commands=3` after the regeneration, four `STALE_SOURCE_DIGEST` lines before it |
| Full deep-loop suite | PASS. `Tests  2998 passed \| 9 skipped (3007)` against a baseline of `2990 passed \| 9 skipped (2999)`, no failure in either |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fan-out lineage carries no executor check.** Its executor lives in the runner's `invocation-metadata.json`, not in the state log, so the gate cannot read it there. Checking it would mean teaching the gate that file.
2. **The documented validator still differs on a log with no ledger.** `validateIterationOutputs` accepts the `iteration_start` row only on a ledger-backed log. No workflow step runs it, so nothing fails today.
<!-- /ANCHOR:limitations -->

---
