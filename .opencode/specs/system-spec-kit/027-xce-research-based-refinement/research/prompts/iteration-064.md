DEEP-RESEARCH

# Deep-Research Iteration 064 — 026-dedup: 002 created_by-clobber P0 vs shipped causal conflict guard

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite every claim `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 026 SHIPPED a causal "conflict guard" that refuses to invalidate an existing valid edge (closing a case where a `contradicts` run over a reciprocal lineage pair could silently undo a valid `caused` edge).
- 027 Phase 002 (`002-memory-write-safety`) listed 3 P0s. The 2026-06-05 audit said all 3 P0s were still ABSENT: (#1) no `isAutoEdgeCreator`/`auto-session` predicate; (#2) `insertEdge` still clobbers `created_by` on conflict; (#3) retention sweep deletes by `delete_after` only. The audit said live files are `lib/storage/causal-edges.ts`, `lib/storage/consolidation.ts`, `lib/governance/memory-retention-sweep.ts` (the spec's `lib/causal/`/`lib/memory/` paths are STALE).

## FOCUS — answer only this
For 002's THREE P0s, determine current truth against live code: still-real, partially-covered-by-the-shipped-conflict-guard, or closed. Pay special attention to P0 #2 (created_by clobber on conflict) vs the shipped conflict guard — are they the same code path or different?
Read/grep the live mcp_server lib:
1. `grep -rn "created_by\|createdBy\|ON CONFLICT\|isAutoEdgeCreator\|auto-session" .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
2. the conflict-guard code (grep for the guard that "refuses to invalidate a valid edge", likely in causal-edges.ts or a relation/backfill file)
3. `lib/governance/memory-retention-sweep.ts` (retention deletes by delete_after only? tier/pin-aware?)
4. `002-memory-write-safety/spec.md` (the 3 P0 definitions + stale paths)

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-064-NN] <claim>` + `file:line`. Per P0: state {STILL-REAL | PARTIAL | CLOSED} with the live code citation. Explicitly compare P0 #2's clobber path to the shipped conflict guard's path.

### P0_STATUS_TABLE
`P0 | claim | status (STILL-REAL/PARTIAL/CLOSED) | live file:line | live path (corrected)`

### VERDICT
002 = {STILL-RELEVANT-REPATH | NARROW | REMOVE} + which P0s survive + the path corrections needed.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
