---
title: "Implementation Summary: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "The pivot seat cap now bounds one council attempt at 3 seat outputs, the dead remaining-iterations guard is gone, and a first-attempt quorum failure reopens the pivot once as attempt 2. Code, tests, workflows, references and contracts are done; the changelog, playbook and catalog pages were written at integration."
trigger_phrases:
  - "pivot hygiene implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene"
    last_updated_at: "2026-11-17T23:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the seat cap, retry, seat scoping, YAML re-entry and contracts; playbook DLR-062, changelog v2.1.4.0 and the catalog pages written at integration"
    next_safe_action: "None for this phase; the full runtime suite runs at the integration merge gate"
    packet_purpose: "Purpose: The seat cap has the scope the operator chose, the dead guard no longer pretends to protect anything, and a transient council quorum failure gets exactly one retry inside the seat budget."
    blockers: []
    key_files:
      - "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "operator-decision-012-pivot-hygiene"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "94a4cf06-5c71-4a49-952f-6bbffe1f9b56"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T16:56:43Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-pivot-hygiene |
| **Completed** | Implementation done 2026-11-17 on branch `worktrees/464-ed-012-pivot-hygiene`. T014, T015 and T018 were written at integration |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A divergent pivot's council now has the seat budget the operator chose. `maxCouncilSeatOutputs` defaults to 3 and bounds one council attempt. The check runs only when an attempt opens, so a later pivot is never refused because an earlier one used seats, and a resumed attempt holding two seat returns is not refused either. The unreachable `minRemainingIterations` comparison is gone, while the field still loads from configs and persisted limits.

A first-attempt quorum failure (a seat that does not return, or a report that does not parse) is no longer terminal. Finalize writes a `pivot_attempt_failed` event instead of `pivot_failed` and returns `retryable: true`. Prepare then reopens the same pivot as attempt 2, which has its own seat event ids (`<pivotId>:attempt-2:pivot_seat_returned:<seat>`), its own `council/attempt-2/` seat and deliberation files, and `attempt: 2` in the persisted config. A second quorum miss, or three valid seats that disagree, stays terminal. Attempt 1 keeps every id, path and config byte it had, so pivots written before this change still load.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/divergent-pivot.ts` | Modified | Per-attempt cap, dead guard removed, attempt identity, one-time retry, `runDivergentPivot` loops at most twice |
| `deep-research/scripts/divergent-research-pivot.ts`, `deep-review/scripts/divergent-review-pivot.ts` | Modified | Count seat outputs only for the pivot about to be prepared and its current attempt |
| `runtime/scripts/divergent-pivot.cjs` | Modified | Header documents the retry contract; no code change was needed |
| `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml` | Modified | `pivot_attempt` and `pivot_finalize_retryable` outputs and `step_retry_divergent_pivot_once` |
| `deep-research/references/convergence/convergence.md`, `deep-review/references/convergence/convergence.md` | Modified | Describe the retry and the 6-seat ceiling per pivot |
| `compiled/deep-research.contract.markdown`, `compiled/deep-review.contract.markdown` | Regenerated | Source digests follow the YAML and reference edits |
| `runtime/tests/integration/divergent-pivot.vitest.ts`, `runtime/tests/unit/divergent-pivot-cli.vitest.ts`, `runtime/tests/unit/divergent-pivot-seat-scope.vitest.ts` (new) | Modified, created | Cases for every requirement |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each implementation task went to DeepSeek V4.1 Flash on the OpenCode Go lane as one brief (`scratch/dispatch/`). The orchestrator read every diff and reran each check itself. Commits on the phase branch: `c06f0f06831` (cap, guard, attempt identity), `df76ba090ef` (retry), `d775beb7e75` (seat scoping, CLI contract) and the final docs and workflow commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cap council seat outputs per pivot, 3 per council attempt, with at most one retry per pivot on a quorum failure, so one pivot uses at most 6; `maxPivots: 3` still caps the run. "Council" is divergent mode's internal three-seat vote in `runtime/lib/deep-loop/divergent-pivot.ts`, not the deprecated ai-council mode. | A failed or resumed pivot no longer shrinks later pivots, and the retry fits because it gets its own 3 seats. The run ceiling rises from 9 to 18 seat outputs. A lifetime cap shared across pivots was rejected. |
| A resumed prepare reuses the persisted `usageAtStart` and `limits` | Found while building T004: a caller-reported count that changed after the pivot opened made the `pivot_started` replay and `persistConfig` throw a conflict. An opened pivot's inputs are frozen, so resume reads them back. |
| Attempt 1 writes no `attempt` key and keeps today's ids and paths | Configs and events written before this change must keep replaying byte for byte. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n 'Accepted' decision-record.md` | Prints the ADR-001 status line |
| T002 suites plus `divergent-pivot-seat-scope.vitest.ts` | 6 files, 61 passed (baseline 50 + 11 new cases) |
| `npm run typecheck` in the runtime | Exit 0 |
| YAML-reading suites (`stop-policy-yaml-parity`, `lifecycle-taxonomy-yaml-parity`, `workflow-session-id-parity` and 8 more) | 11 + 5 files pass |
| `check-contract-drift.cjs` | `OK commands=2` |
| Full runtime suite | Not run in the phase worktree; the orchestrator runs it at merge |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Changelog, playbook and catalog pages are written.** T014 is `changelog/v2.1.4.0.md`, T015 is DLR-062 and T018 is the two divergent catalog pages, all written at integration.
2. **The seat prompts do not name the attempt.** Attempt 2 dispatches the same three seat prompts; only the paths, event ids and `dispatchContext.round` differ.
<!-- /ANCHOR:limitations -->

---
