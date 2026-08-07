# Iteration 1: All dimensions — correctness, security, traceability, maintainability

## Focus
Single-iteration review (maxIterations=1) of packet `021-cooperative-heavy-phases`. Covered all four dimensions over the three changed source/test files from commit `372bb0f2cd`:
- `mcp_server/handlers/memory-index.ts` (lag sampler, `timedPhase`, `isCancelled` threading)
- `mcp_server/lib/search/trigger-embedding-backfill.ts` (chunked phrase sync, cancel, cache-hit yield, `cancelled` status)
- `mcp_server/tests/trigger-embedding-backfill.vitest.ts` (3 new cancel/yield cases)
Cross-referenced against `spec.md` (REQ-001..004), `plan.md`, `tasks.md` (T001–T012), `implementation-summary.md`.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 3 source/test + 5 spec docs
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60 (P1 present → above convergence floor)

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: REQ-003 marker-refresh/timing not applied on the `files.length === 0` scan branch, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-790,802-804`. The no-files early-return branch runs the same four tail phases — `runGlobalOrphanSweep()` (line 788), `runPostInsertEnrichmentRepairBackfill()` (789), `runNearDuplicateRepairBackfill()` (790), `runTriggerEmbeddingBackfill(...)` (802) — **without** the `timedPhase` wrapper (defined at line 1224, applied only on the main path at lines 1234/1241/1256/1259). REQ-003's acceptance criterion is "The orphan-sweep, enrichment-repair, trigger-backfill, and near-dup-repair phases **each** enter via `timedPhase`, which fires `ctx.onPhase` and thereby `maintenance.refresh()`." On this branch `onPhase` is never fired for the tail phases, so they do not refresh the marker and emit no `phase=<name> ms=` line. The branch returns at line 846, so it is a distinct execution path (not a fall-through), and it is the routine steady-state path for a background incremental scan that finds no changed files yet still runs the periodic tail repairs. `isCancelled` *is* threaded into the no-files trigger-backfill call (802-804), and the event-loop lag sampler *is* active on this branch (set up at 507-521 before the branch), so the gap is specifically the per-phase marker refresh + per-phase wall-clock attribution. Claim-adjudication packet below.

### P2, Suggestion
- **F002**: Doc-vs-code drift — `implementation-summary.md` overstates `timedPhase` coverage, `.opencode/specs/.../021-cooperative-heavy-phases/implementation-summary.md:60`. The summary states "`timedPhase` enters each un-yielded tail phase (orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair) via `ctx.onPhase`" as an unqualified claim, but it holds only for the main scan path, not the `files.length === 0` branch (see F001). The same unqualified framing appears in `spec.md:106` (scope) and `plan.md:64`. Traceability/maintainability: a future reader trusting the summary would not know the no-files path is uncovered.
- **F003**: Redundant trailing yield after the final phrase-sync chunk, `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:253-258`. `await new Promise(setImmediate)` runs unconditionally after every `syncPhraseChunk`, including the last chunk, costing one wasted macrotask hop per backfill. Harmless and within budget; a `offset + PHRASE_SYNC_CHUNK_ROWS < sourceRows.length` guard would skip it. Cosmetic.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | memory-index.ts:788-804 vs spec.md:139 (REQ-003) | REQ-001 (lag sampler) PASS both paths; REQ-001 per-phase timing PASS main path only; REQ-002 (chunk/cancel/cache-yield/status) PASS + unit-tested; REQ-003 FAIL on no-files branch (F001); REQ-004 (no launcher change) recorded, read-only — not independently re-verified here |
| checklist_evidence | n/a | hard | no checklist.md (Level 1) | Level 1 packet exempt; verification table in implementation-summary.md:89-96 used instead |
| feature_catalog_code | n/a | advisory | — | No catalog claims in scope |
| playbook_capability | n/a | advisory | — | No playbook in scope |

## Assessment
- New findings ratio: 0.60 — one P1 keeps the ratio above the convergence floor; single-iteration cap reached.
- Dimensions addressed: correctness (chunk/delete-scoping verified correct), security (N/A — internal daemon maintenance, no external input/credentials; log lines emit only phase names + lag ms), traceability (REQ mapping above), maintainability (doc drift F002, cosmetic F003).
- Novelty justification: REQ-002 deliverable is correct and well-tested; the residual risk concentrates in REQ-003's path coverage.

### Correctness notes (confirmed, no finding)
- Chunked `syncPhraseChunk` is safe: `deleteStaleForMemory` (trigger-embedding-backfill.ts:208-226) scopes deletes to a single `memory_id`, and chunk slicing is on `sourceRows` (one row per memory ordered by id), so no chunk deletes another chunk's rows. Per-chunk atomicity is sound (upserts idempotent via `ON CONFLICT DO UPDATE`).
- Cancel boundaries are correct: cancel check at the top of each chunk (247-252) and each embedding row (274-279) → cancel-immediate yields 0 rows, cancel-after-chunk-1 yields exactly 200 (matches the unit assertions at vitest lines for `cancelAfter(0)`/`cancelAfter(1)`).
- Lag sampler: `setInterval` drift, `unref()`'d, cleared in `finally` (1477-1481) with a final `max-event-loop-lag` log. Sound.
- `timedPhase` logs elapsed in a `finally`, so a throwing phase still reports. Sound.

## Ruled Out
- "Chunking breaks whole-corpus delete reconciliation": ruled out — deletes are per-memory-id, not whole-corpus (trigger-embedding-backfill.ts:208-226).
- "Yield inside a transaction risks partial commit": ruled out — the `await setImmediate` is strictly between self-contained chunk transactions (253-258), never inside `database.transaction(...)`.

## Dead Ends
- Re-executing the vitest suite: blocked by interactive command approval in this autonomous lineage; test logic verified statically and implementation-summary records 6/6 PASS.

## Recommended Next Focus
Wrap the four tail phases in the `files.length === 0` branch with the same `timedPhase` helper (or hoist the helper above the branch) so REQ-003 holds on every scan path; then reconcile the spec/plan/summary wording (F002).

---

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "REQ-003's per-tail-phase marker refresh and per-phase wall-clock are not applied on the files.length===0 scan branch, leaving its orphan-sweep, enrichment-repair, trigger-backfill, and near-dup-repair phases without onPhase/maintenance.refresh() or phase= timing.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788-790",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:802-804",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:846",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1224-1259"
  ],
  "counterevidenceSought": "Read the no-files branch (785-883) end-to-end for any timedPhase/onPhase call — none present; confirmed timedPhase is defined at 1224 (after the branch returns at 846) and applied only on the main path at 1234/1241/1256/1259; confirmed the lag sampler at 507-521 is set up before the branch so lag logging still covers it; confirmed isCancelled IS threaded at 802-804. Did not read the background runner wiring that creates/holds the marker, so whether the marker is even held on the no-files path is unverified.",
  "alternativeExplanation": "The no-files branch could be unreachable on the marker-holding background path (e.g. background reindex always passes force=true → files.length>0), which would make the marker-refresh gap moot and reduce this to a pure diagnostics-coverage gap (P2). This is not confirmed from the reviewed files.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "Confirm the marker-holding background scan path never takes the files.length===0 branch (or that all no-files tail phases are provably bounded below the 180s TTL with the trigger-backfill flag in every supported state) → downgrade to P2 diagnostics-coverage.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: REQ-003 acceptance criterion unmet on a reachable scan branch" }
  ]
}
```

Review verdict: CONDITIONAL
