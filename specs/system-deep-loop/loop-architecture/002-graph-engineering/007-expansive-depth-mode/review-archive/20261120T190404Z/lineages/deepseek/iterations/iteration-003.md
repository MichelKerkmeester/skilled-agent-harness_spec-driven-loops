# Iteration 3 - F-1-007 correctness: divergent pivot, continuity thread and coverage-graph signals

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-007, dimension correctness. Node scope: `divergent-pivot.ts`, `divergent-review-pivot.ts`, `divergent-research-pivot.ts`, `divergent-pivot.cjs`, `continuity-thread.cjs` and `runtime/lib/coverage-graph`.
- Operator review focus covered in this iteration: overengineering (two retry control paths and the double config write judged against the current requirement), operator UX (pivot failure reasons, the terminal-frontier gate text, and the accepted-direction handoff), cross-CLI/OS parity (pivot paths remain repo-relative and the retry step exists in both YAMLs).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` -- attempt identity, preflight, seat-cap per attempt, council paths, pending/finalize, retry loop, lifecycle events.
- `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` -- read-only guard, path-shaped scope stripping, frontier-unanswered seeds, open-frontier gate, identity and seat-usage scoping.
- `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` -- identity derivation, attempt-aware seat usage.
- `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` -- prepare/record-seat/finalize surface and retry documentation.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` -- carried-forward question filter, leaf-focus step, next-focus precedence.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` -- `SOURCE_QUALITY_CLASS` vocabulary.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts` -- unclassified sources no longer raise diversity.
- `.skilled/commands/deep/assets/deep-review.yaml:1422-1547` and `.skilled/commands/deep/assets/deep-research.yaml:1316-1400` -- divergent branch eligibility, retry re-entry and result application.
- Traceability sources: `011-review-frontier-mode` REQ-007, AC-008 and plan lines 67/71; `012-pivot-hygiene` REQ-002/REQ-005/REQ-007/REQ-008; `010-research-frontier-mode` REQ-005/REQ-008.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **REQ-007 and AC-008 promise pivot-candidate admission the pivot branch never performs** -- .skilled/commands/deep/assets/deep-review.yaml:1429 -- `011` REQ-007 requires that an accepted pivot candidate be "routed through admission" (`011-review-frontier-mode/spec.md:147`), AC-008 repeats it and records the evidence as "the YAML frontier_gate routes an accepted candidate through step_frontier_admit" (`011-review-frontier-mode/acceptance-criteria.md:63`), and the plan says the pivot "hands an accepted candidate to admission" and "may run and propose more nodes through admission" (`plan.md:67`, `:71`). The implemented branch says the opposite: "with the frontier terminal the leaf gets no FRONTIER block, so the pivot adds no frontier node" (`deep-review.yaml:1429`), and its completed path only sets `next_dimension: "{pivot_result.restoredFocus}"` and re-reduces (`:1541-1547`). `step_frontier_admit` reads `frontier_proposal` rows from the iteration delta (`:2051`); the pivot result writes no such row, so no accepted candidate ever reaches the node store.
Finding class: class-of-bug
Scope proof: `rg -n "frontier-admit|admit" .skilled/commands/deep/assets/deep-review.yaml` lists the seed, the budget step, the STUCK close, the activation close and `step_frontier_admit`; none sits in the `if_completed` pivot branch at `:1504-1547`. `rg -n "frontier_proposal" .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` prints nothing, so the pivot emits no proposal row for its selected candidate.
Affected surface hints: ["deep-review.yaml divergent pivot frontier_gate", "deep-review.yaml step_apply_divergent_pivot_result", "step_frontier_admit", "divergent-review-pivot.ts accepted candidate", "011 AC-008 evidence"]
Case: a review run closes all frontier nodes, the frontier_drained stop makes the pivot eligible, the Council accepts a read-only direction for a subsystem the frontier closed as exhausted, and the direction becomes only focus text; the frontier store stays terminal, `registry.frontier` gains no node for it, and the next stop can form `frontier_drained` again without the accepted direction ever becoming tracked frontier depth.

Claim adjudication:
```json
{
  "type": "spec-contradiction",
  "claim": "The pivot branch adopts an accepted direction as next_dimension and never routes it through frontier admission, contrary to REQ-007 and AC-008.",
  "evidenceRefs": [
    "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/spec.md:147",
    "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/acceptance-criteria.md:63",
    "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/plan.md:67",
    ".skilled/commands/deep/assets/deep-review.yaml:1429",
    ".skilled/commands/deep/assets/deep-review.yaml:1541",
    ".skilled/commands/deep/assets/deep-review.yaml:2051"
  ],
  "counterevidenceSought": "Searched the whole review YAML for an admission call in the pivot branch and found only the post-dispatch step that reads iteration deltas; checked the review pivot script for a frontier_proposal writer (none); considered whether 'admission' could mean the pivot's own candidate dedupe, but AC-008 names step_frontier_admit explicitly.",
  "alternativeExplanation": "The YAML clause reads as a deliberate later decision that a pivot direction should be focus text rather than frontier depth, because a new frontier node would reopen the veto the pivot just passed; if that is the ruling, REQ-007, AC-008 and the plan are the stale surfaces.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if 'admission' in REQ-007 is ruled to mean the pivot candidate dedupe rather than step_frontier_admit, or if a later step writes the selected candidate as a frontier proposal."
}
```

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `012` REQ-002/REQ-005/REQ-007/REQ-008 and `010` REQ-005/REQ-008 match the code (attempt-scoped ids and paths, per-attempt seat cap checked only on open, 3 or 6 recorded outputs, legacy config load, scoped usage). `011` REQ-007's admission clause does not: the pivot completed path adopts focus text only (`deep-review.yaml:1541-1547`). |
| `checklist_evidence` | partial | AC-008's gating and seed halves are met (`divergent-review-pivot.ts:311-330`, `:398-410`); its admission evidence claim is not met by the branch it cites. |

## Integration Evidence

- `.skilled/commands/deep/assets/deep-review.yaml:1422-1496` runs prepare, one seat at a time, record-seat, finalize and the one-time retry through the real CLI subcommands; `step_retry_divergent_pivot_once` re-enters prepare once and stops when `pivot_attempt == 2`.
- `.skilled/commands/deep/assets/deep-research.yaml:1316-1400` carries the same retry wiring for the research pivot, so the retry is not review-only.
- `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs:1-25` documents the prepare-only mode ownership and the retry contract the YAML implements.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:679-690` consumes the `SOURCE_QUALITY_CLASS` vocabulary exported from `coverage-graph-query.ts:138-150`, and `upsert.cjs:236-300` derives the class before the signal reads it.

## Edge Cases

- Attempt 2 lives under `council/attempt-2/` while `config.json`, `state.jsonl` and `report.md` stay shared (`divergent-pivot.ts:844-861`); a resumed attempt 2 therefore reads the shared config, and the config rewrite compares against the attempt-1 record before overwriting. A crash between the two writes leaves attempt 1 persisted with the attempt-failed event durable, which re-enters the same branch on the next prepare.
- `maxCouncilSeatOutputs` is now per council attempt, so a pivot may record 6 seat returns while the field reads 3 (`divergent-pivot.ts:292`, `:1589`); REQ-002 and REQ-005 require exactly that, so the count is not a lifetime cap.
- `minRemainingIterations` is still parsed, persisted and accepted but no longer refuses a pivot (`divergent-pivot.ts:749-760`; test at `divergent-pivot.vitest.ts:574-584`); REQ-004 retires the guard deliberately.
- The research pivot does not seed frontier revisits because the sixth source is specified only in the deep-review convergence reference; the research convergence reference does not carry it.

## Confirmed-Clean Surfaces

- Attempt identity is complete: seat events, deliberation, seat paths and config `attempt`/`invariants.rounds` are attempt-scoped, attempt-1 ids and paths stay unchanged, and `buildPivotCouncilPaths` rejects any attempt other than 1 or 2.
- The seat cap is evaluated only when an attempt opens (`durableSeatEvents.size === 0`), so resuming an attempt that already holds two seat returns is not refused.
- A second quorum miss and an agreement failure both fail closed without a third attempt; `pivot_attempt_failed` is written only for a first-attempt quorum miss.
- The review pivot refuses an open or active frontier before preparing, seeds only `exhausted` or `blocked` nodes, and strips path-shaped scope entries before the read-only mutation scan.
- `buildCarriedForwardOpenQuestions` drops resolved and non-question-shaped items only when they are not registry questions, and `deriveNextFocusFromContinuity` places the leaf recommendation ahead of the carried-forward step but behind the terminal sentinel, as REQ-001/REQ-002/REQ-005 require.
- `computeResearchSourceDiversityFromData` no longer counts `unclassified` as a distinct source kind, and the class vocabulary is derived at the upsert choke point rather than trusted from a leaf.

## Ruled Out

- Retrying the library `runDivergentPivot` loop and the YAML step in two places: the library is the packaged transaction API and the YAML must orchestrate native seat dispatch across steps, so neither can own the other's retry; two instances do not justify a shared abstraction.
- Recording six seat outputs for an attempt-1 quorum miss that returned only two: REQ-002 explicitly defines the recorded total as `3 * attempt`.
- Overwriting the pivot config twice when attempt 2 opens: the first write replays the attempt-1 record and the second adopts attempt 2; a crash between them is recoverable and leaves no contradictory state.
- A research frontier revisit source: missing by design; the sixth source is a deep-review-only sentence.

## Next Focus

- Dimension: security on F-1-003 (fan-out runner and merge trust boundaries).
- Reason: all three dealt nodes now have correctness covered; security is the next uncovered dimension on the first node and the fan-out path handles executor commands, env allowlists and cross-lineage input.
- Required evidence: `fanout-run.cjs` command construction and env pass-through, `fanout-merge.cjs` input validation, and the executor guard helpers they call.
- Rotation status: F-1-003, F-1-005 and F-1-007 each have correctness covered; security is uncovered on all three.

Review verdict: CONDITIONAL
