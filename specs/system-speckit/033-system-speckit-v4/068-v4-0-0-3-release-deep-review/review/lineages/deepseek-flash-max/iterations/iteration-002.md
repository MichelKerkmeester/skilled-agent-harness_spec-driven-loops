---
title: "Deep Review Iteration 002 — deep-loop reducer, convergence, synthesis close-out"
trigger_phrases: []
---

# Iteration 2: Correctness — reducer, convergence, and synthesis close-out

## Focus

Dimension: **correctness**. Slice: the state-consuming half of the deep-loop —
`runtime/scripts/reduce-state.cjs` (registry construction, dimension coverage, terminal stop,
dashboard verdict), `runtime/scripts/convergence.cjs` (graph convergence CLI and composite score),
`runtime/scripts/synthesis-closeout.cjs` (synthesis invariants and staged events), the review
projection contracts (`legacy-projections/deep-review-*.ts`, `legacy-projection-manifest.ts`),
and the workflow's own state-write and stop protocol in `.skilled/commands/deep/assets/deep-review-auto.yaml`.
Carried finding F001 was re-verified against the workflow contract text in this slice.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (lines 298-334, 831-1000, 1370-1480, 1537-1630, 1680-1760, 1816-1905, 2090-2240, 2240-2320)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` (lines 298-334, 338-380, 672-720, 790-916)
- `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` (full, 1-533)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts` (lines 80-264)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-deltas-contract.ts` (lines 24-200)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts` (lines 60-120)
- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` (lines 225-258, 445-535)
- `.skilled/commands/deep/assets/deep-review-auto.yaml` (lines 95-140, 463-509, 628-648, 649-788)

## Findings

### P0 Findings

None.

### P1 Findings

No new P1. Carried F001 (iteration 1) re-verified and strengthened:

- **F001**: Fan-out salvage appends to the lineage state log directly instead of through the append gateway — `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:170` — Re-read the direct write against the workflow's own state-write contract, which states the rule in the strongest terms: `state_write_protocol` in `deep-review-auto.yaml` declares the gateway as the mechanism for "every append_to_jsonl and append_jsonl directive", and its contract text says "There is no direct-append exception. state_log is a projection the gateway rebuilds from the ledger, so a row written beside it is dropped by the next refresh" (`.skilled/commands/deep/assets/deep-review-auto.yaml:97-117`). The salvage sweep is not an append_jsonl directive and does not route through the gateway, so it is the one writer in the shipped deep-loop tree that contradicts that sentence; the durability and guard consequences recorded in iteration 1 stand unchanged.

  Finding class: `cross-consumer`
  Scope proof: Same code paths as iteration 1 plus the workflow contract text that generalizes the prohibition beyond directives.
  Affected surface hints: [`scripts/fanout-salvage.cjs`, `commands/deep/assets/deep-review-auto.yaml`, `lib/legacy-projections/shadow-projection-store.ts`, `scripts/check-direct-append.cjs`]

### P2 Findings

None.

## Claim Adjudication

No new P0/P1 findings, so no new claim packets. F001's packet from iteration 1 applies unchanged; this iteration added the workflow contract as corroborating evidence, not as a new finding.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Full traceability pass scheduled for iteration 8. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "The leaf-written `review/deltas/iter-NNN.jsonl` files are overwritten by the gateway's projection refresh": ruled out — the deltas surface carries a registered contract and a manifest entry with `refreshBoundary: 'event'`, but the gateway refresh resolves only the `review-state` surface (`append-mode-event.ts:467-475` -> `resolveDefaultProjectionContract`, which returns the state contract), and the deltas contract is constructed only in the census checker and its tests. The leaf-owned delta files are not gateway-published today.
- "The workflow calls `convergence.cjs` with flags the script rejects": ruled out — the YAML passes `--spec-folder/--loop-type/--session-id/--convergence-mode` and the script's main path requires exactly those (convergence.cjs:672-716).
- "The review init step still writes the config row directly": ruled out in-range — commit `ef155cf8f4` moved init onto `deep_review.run_initialized` through the gateway; the current YAML init step records the event via `append-mode-event.cjs` and never touches the log directly (deep-review-auto.yaml:463-509).
- "The reducer can report a terminal stop without a synthesis event": ruled out — `buildTerminalStopState` requires an event row named `synthesis_complete` that is not older than the last iteration or lifecycle event (reduce-state.cjs:1617-1655).
- "The review projection cannot survive any extra row": ruled out — the attribution-collapse invariant only guards the first (config) row, which is why the salvage row is silently dropped rather than blocking the append; this is consistent with F001's failure mode, not a separate defect.

## Dead Ends

- Executing the convergence script against this lineage's own state to compare graph signals with the documented 3-signal vote: not attempted — it would write observability events outside the lineage directory, and the run keeps convergence as telemetry under `stopPolicy: max-iterations`.

## Assessment

- New findings ratio: 0.0 (no new findings; weighted new = 0)
- Dimensions addressed: correctness
- Novelty justification: this slice closed the state-consuming half of the deep-loop. The reducer's registry construction, dimension coverage, terminal-stop derivation, dashboard verdict, and the synthesis close-out invariant set were read end to end and agree with each other and with the shipped contracts; the key negative results are recorded in Ruled Out. F001 remains the only active finding.

## Next Focus

Dimension: security. Focus area: deep-loop locks, fencing, authority, and path containment (`scripts/loop-lock.cjs`, `lib/locks-and-fencing/**`, `lib/authority-root/**`, `lib/per-mode-authority-flip/**`, `lib/write-set-conflict-graph/**`), plus containment behavior in `fanout-run.cjs`. Required evidence: file:line for each claim about what a lock or fence does and does not cover. Rotations status: correctness slice 3 of 3 (security pass next).

Review verdict: CONDITIONAL
