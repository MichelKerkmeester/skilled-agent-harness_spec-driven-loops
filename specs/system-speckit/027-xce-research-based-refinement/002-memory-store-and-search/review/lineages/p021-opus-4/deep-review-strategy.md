# Deep Review Strategy — 021-cooperative-heavy-phases (lineage p021-opus-4)

<!-- ANCHOR:topic -->
## Topic
Review the 021-cooperative-heavy-phases packet: scan event-loop lag instrumentation, trigger-embedding-backfill chunking/cancellation, and per-tail-phase maintenance-marker refresh, all in the spec-memory MCP daemon. Confirm the daemon stays responsive (not merely un-reaped) through its heaviest reindex phases and that the four REQs resolve to shipped behavior.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions (remaining)
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions
- [x] correctness — drift math sound, no double-run, no yield-in-transaction, no timer leak. PASS.
- [x] security — parameterized SQL, no new inputs/credentials, backfill gated off. PASS.
- [x] traceability — REQ-001..REQ-004 all map to shipped code; checklist N/A (L1). PASS.
- [x] maintainability — durable WHY comments, comment-hygiene clean; one doc-wording nit (F001). PASS w/ advisory.
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings
- P0: 0
- P1: 0
- P2: 2 (F001 doc "byte-identical" wording; F002 incremental-path missing per-phase marker refresh)
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked
- Iter 1: reading the shipped diff (`git show 372bb0f2cd`) plus the four spec docs side-by-side made REQ→code mapping direct.
- Iter 1: grepping the two `runTriggerEmbeddingBackfill` call sites + branch guards settled the "double-run?" question by static scope analysis.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed
- Iter 1: re-running the unit suite / `tsc` to independently confirm the summary's "6/6 PASS" — permission-gated in this review session. Verified the test logic by reading instead.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches
- None.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled Out Directions
- Double trigger-backfill per scan (mutually-exclusive branches).
- Yield-inside-transaction corruption (`await setImmediate` is between chunk transactions).
- Lag-timer leak (cleared in `finally`, `unref`'d).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus
None — coverage complete, verdict stable at PASS. Loop stopped at maxIterations=1 (fan-out lineage).
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context
- Level 1 packet, 3-file blast radius; predecessor 020-maintenance-grace-background-embedding.
- `resource-map.md` not present. Skipping coverage gate.
- Branch `system-speckit/027-xce-research-based-refinement`; shipped commit `372bb0f2cd`.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status
- Core: `spec_code` = pass (REQ-001..004); `checklist_evidence` = n/a (Level 1, no checklist.md).
- Overlay: `feature_catalog_code` = n/a (no catalog claim references this internal path).
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review
| File | Coverage | Verdict |
|------|----------|---------|
| handlers/memory-index.ts | full (diff + surrounding scan structure) | PASS w/ F001, F002 (P2) |
| lib/search/trigger-embedding-backfill.ts | full | PASS |
| tests/trigger-embedding-backfill.vitest.ts | full (logic read, not executed) | PASS |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries
- maxIterations: 1 (fan-out lineage p021-opus-4)
- severityThreshold: P2
- Observation-only: no code modified.
<!-- /ANCHOR:review-boundaries -->
