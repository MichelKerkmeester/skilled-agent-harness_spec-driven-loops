# Deep Review Strategy — 021-cooperative-heavy-phases (lineage p021-opus-1)

<!-- ANCHOR:topic -->
## Topic
Single-pass (maxIterations=1) fan-out review of packet `021-cooperative-heavy-phases`: the daemon stays *responsive* (not merely un-reaped) through its heavy reindex tail phases via (1) an event-loop lag sampler + per-phase wall-clock, (2) a chunked/cancellable trigger-embedding-backfill, and (3) per-tail-phase maintenance-marker refresh.
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
- [x] correctness — chunk/delete-scoping and cancel boundaries verified sound; no P0/P1.
- [x] security — N/A (internal daemon maintenance; no external input/credentials; logs emit phase names + lag ms only).
- [x] traceability — REQ-001 PASS (lag) / partial (per-phase timing main-path-only); REQ-002 PASS+tested; REQ-003 FAIL on no-files branch (F001); REQ-004 recorded read-only.
- [x] maintainability — doc drift (F002), cosmetic trailing yield (F003).
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings
- P0: 0
- P1: 1 (F001) — +1
- P2: 2 (F002, F003) — +2
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked
- Reading the feat commit diff (`372bb0f2cd`) plus the full transaction body pinned the delete scoping as per-memory-id, confirming chunk safety without running the suite.
- Walking both scan exit paths (no-files early return vs main tail) surfaced the REQ-003 coverage gap that the diff alone hid.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed
- Re-executing the vitest suite was blocked by interactive command approval in this autonomous lineage; fell back to static test-logic verification + the implementation-summary's recorded 6/6 PASS.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches
- (none)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled Out Directions
- "Chunking breaks whole-corpus delete reconciliation" — deletes are per-memory-id (trigger-embedding-backfill.ts:208-226).
- "Yield inside a transaction" — the `await setImmediate` is strictly between self-contained chunk transactions (253-258).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus
Wrap the four tail phases in the `files.length === 0` branch with `timedPhase` (or hoist the helper above the branch) so REQ-003 holds on every scan path; reconcile spec/plan/summary wording (F002).
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context
- `resource-map.md` not present. Skipping coverage gate.
- Level 1 packet (no checklist.md) — checklist_evidence protocol exempt.
- Predecessors 018/019/020 establish the cooperative-yield idiom, the maintenance marker, and the marker's `onPhase`→`refresh()` wiring reused here.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status
- Core — `spec_code`: partial (REQ-003 fail on no-files branch). `checklist_evidence`: n/a (Level 1 exempt).
- Overlay — `feature_catalog_code`: n/a. `playbook_capability`: n/a.
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review
| File | Coverage |
|------|----------|
| `mcp_server/handlers/memory-index.ts` | reviewed (lag sampler, timedPhase, isCancelled threading, both call sites, both exit paths) |
| `mcp_server/lib/search/trigger-embedding-backfill.ts` | reviewed (chunk loop, delete scoping, cancel boundaries, cache-hit yield, status) |
| `mcp_server/tests/trigger-embedding-backfill.vitest.ts` | reviewed (3 new cases, logic verified statically) |
| `021-.../spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | reviewed (REQ/AC traceability) |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries
- maxIterations: 1 (single-pass fan-out lineage `p021-opus-1`)
- dimensions: correctness, security, traceability, maintainability
- severityThreshold: P2
- Target files READ-ONLY; no fixes applied.
<!-- /ANCHOR:review-boundaries -->

<!-- ANCHOR:non-goals -->
## Non-Goals
- Launcher adopt/reap re-verification (REQ-004 declared no-change; out of this read's scope to fully re-confirm).
- Live single-launcher deploy-time lag read (deploy-time check per SC-002).
<!-- /ANCHOR:non-goals -->

<!-- ANCHOR:stop-conditions -->
## Stop Conditions
- maxIterations (1) reached → synthesize.
<!-- /ANCHOR:stop-conditions -->
