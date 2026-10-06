---
title: "Deep Review Iteration 001 — deep-loop fan-out dispatch and append gateway"
trigger_phrases: []
---

# Iteration 1: Correctness — deep-loop fan-out dispatch and the append gateway path

## Focus

Dimension: **correctness**. Slice: the fan-out runner and everything that writes lineage state —
`runtime/scripts/fanout-run.cjs` (dispatch, timeout, exit-code gates, stop-policy validation),
`runtime/scripts/fanout-salvage.cjs` (post-exit write-failure recovery), `runtime/scripts/fanout-merge.cjs`
(strongest-restriction merge), `runtime/scripts/fanout-pool.cjs` (K-in-flight pool), and the
`mode-append-gateway` / `authorized-ledger` write path that owns `deep-review-state.jsonl`.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (lines 630-690, 685-870, 930-1080, 1640-1740, 1900-2040, 2666-2720, 2872-2990, 3700-3850)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs` (full)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` (lines 29-56, 437-500, 822-932, 942-980)
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` (lines 346-505)
- `.skilled/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs` (lines 95-260)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts` (lines 240-300)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts` (lines 480-578)
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` (lines 90-533)

## Findings

### P0 Findings

None.

### P1 Findings

- **F001**: Fan-out salvage appends to the lineage state log directly instead of through the append gateway — `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:170` — The post-exit salvage path writes its `salvaged_from_stdout` event with `mergeJsonlUnderLock(stateLogPath, [eventRecord])`, which is a raw locked JSONL rewrite (`lib/deep-loop/jsonl-repair.ts:282-296` -> `writeJsonlRecordsAtomic`), not an append through `append-mode-event.cjs`. The skill contract and the iteration prompt pack both say the gateway is the only writer of `deep-review-state.jsonl`. Two concrete failures follow. (1) Durability: the gateway refreshes the state log from the ledger after every authorized append and `shadow-projection-store.ts:548-577` either appends a true suffix or `writeTextAtomic`-replaces the whole file; a direct row breaks the watermark digest, so the very next gateway append replaces the projection and the salvage event is dropped. A retried or resumed lineage therefore reports zero salvage in `fanout-merge.cjs:966`'s attribution table for a lineage that required salvage. (2) Governance: `check-direct-append.cjs:223-253` compares the legacy file digest against the gateway watermark and reports `status: 'violation'` once the mode reaches ledger authority; the direct salvage row is exactly that divergence, and that check is part of the iteration verifier. The direct-append guard only returns `not-enforced` while the mode is on `legacy_authoritative`, which is the pre-flip state this release is actively leaving.

  Finding class: `cross-consumer`
  Scope proof: Read the full salvage path, the raw writer it calls, the projection refresh that owns the same file, the guard that detects divergence, and the merge consumer that reads the event.
  Affected surface hints: [`scripts/fanout-salvage.cjs`, `scripts/fanout-run.cjs`, `lib/deep-loop/jsonl-repair.ts`, `lib/legacy-projections/shadow-projection-store.ts`, `scripts/fanout-merge.cjs`, `scripts/check-direct-append.cjs`]

  Claim adjudication:

  ```json
  {
    "type": "contract-bypass",
    "claim": "The fan-out salvage sweep writes deep-review-state.jsonl directly, bypassing the append gateway, so its event is not ledger-backed, is erased by the next gateway projection refresh, and reads as a gateway-bypass violation under ledger authority.",
    "evidenceRefs": [
      ".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:170",
      ".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:162-171",
      ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts:282-296",
      ".skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts:548-577",
      ".skilled/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs:223-253",
      ".skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:966",
      ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-salvage.vitest.ts:131-134"
    ],
    "counterevidenceSought": "Checked whether mergeJsonlUnderLock is a gateway-backed writer (it is a raw locked JSONL rewrite, jsonl-repair.ts:282); checked whether the projection preserves direct rows (it replaces unless the current bytes are a digest-valid prefix of the projection, shadow-projection-store.ts:556-577); checked whether the guard already treats this as sanctioned (check-direct-append.cjs:145-172 returns not-enforced only while authority state is legacy_authoritative); checked the unit test, which asserts the row lands in the state log but never re-appends through the gateway afterwards.",
    "alternativeExplanation": "The direct write may be deliberate telemetry, sanctioned while the mode is on legacy authority, and consumed only before any later append. That reading fails on two observed points: the retrieval path it feeds (fanout-merge.cjs:966) runs after the lineage settles and can be preceded by a retry attempt's gateway append, and the guard the repo itself wires into iteration verification classifies the same bytes as a violation once authority flips.",
    "finalSeverity": "P1",
    "confidence": 0.85,
    "downgradeTrigger": "Downgrade to P2 if a documented authority exemption states that fan-out salvage may write the projection directly under all authority states, or if the salvage event is moved off the projection (delta or ledger) while the guard is updated to exempt this writer."
  }
  ```

### P2 Findings

None.

## Claim Adjudication

One P1 finding. Hunter pass: the direct writer is `mergeJsonlUnderLock`, not the gateway — verified by reading both call sites. Skeptic pass: is the event perhaps re-projected from the ledger? No — `salvaged_from_stdout` is not a `deep_review.*` ledger stem and the salvage path never touches the ledger. Referee pass: severity held at P1 because the current authority state does not corrupt required iteration evidence, but the write is a live contract bypass with a mechanical durability loss and a guard the repo already ships.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Total-install traceability pass scheduled for iteration 8; this iteration checked behavior against the deep-review skill contract text only. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "Fan-out merge violates strongest-restriction": ruled out on read — `mergeReviewRegistries` counts only `disposition === 'active'` findings and maps any active P0 to FAIL before P1 to CONDITIONAL (fanout-merge.cjs:843-847, 889-901).
- "The lineage completion check can pass without route-proof records": ruled out — `retainIterationRecords` prefers the gateway copy and `forcedDepthIterationViolation` requires exactly iterations 1..cap on both disk and state log (fanout-run.cjs:726-790).
- "Pi's exit code is treated as a success signal": ruled out — `cli-pi` non-zero exits are explicitly tolerated and the artifact gate decides instead (fanout-run.cjs:3782-3787).
- "The pool can settle a worker twice or drop a rejected result": ruled out on read — `settleItem` never throws, and every outcome resolves to a `fulfilled`/`rejected` result slot (fanout-pool.cjs:346-407).

## Dead Ends

- Re-running the fan-out or salvage unit suites to reproduce the direct write live: not attempted — lineage containment forbids commands that write outside the lineage directory (vitest caches and temp fixtures).

## Assessment

- New findings ratio: 1.0 (one new P1; weighted total = weighted new = 5)
- Dimensions addressed: correctness
- Novelty justification: first pass over the fan-out write path; the salvage writer was compared against the gateway contract, the projection refresh, and the guard.

## Next Focus

Dimension: correctness. Focus area: deep-loop reducer, convergence, and synthesis close-out (`reduce-state.cjs`, `convergence.cjs`, `synthesis-closeout.cjs`, `iteration-findings.cjs`), following any path that touches the state log or registry. Required evidence: file:line for each claim, with the reducer's own parsing rules in hand. Rotations status: correctness slice 2 of 3.

Review verdict: CONDITIONAL
