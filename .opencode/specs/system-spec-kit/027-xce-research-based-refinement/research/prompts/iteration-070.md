DEEP-RESEARCH

# Deep-Research Iteration 070 — 006 write-path/statediff rescope to async post-insert-enrichment model

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 026 SHIPPED async post-insert enrichment default-on: `memory_save` returns immediately with `enrichmentStatus: deferred`; a bounded background scheduler runs graph/entity enrichment AFTER commit (escape hatch `SPECKIT_POST_INSERT_ENRICHMENT_SYNC`). Live files seen in iter-068: `handlers/memory-save.ts`, `handlers/save/post-insert.ts`, `handlers/save/enrichment-state.ts`.
- 027 Phase 006 (`006-write-path-reconciliation`) = introduce a typed desired/prior `DiffAction[]` reconciliation layer (insert/upsert/replace/delete) for memory parent/child rows, with subscribers — an EXPLICIT reconciliation aid, not an implicit source of truth (iter-048).
- The audit said: no `statediff`/`DiffAction`/target-sink code exists; writes are still imperative; but async post-insert enrichment changed the model → rescope `memory_save` conversion to async/pending-marker REPLAY, not same-response graph writes.

## FOCUS — answer only this
Determine how 006's statediff/DiffAction layer must rescope given the shipped async-enrichment model, and confirm no statediff code exists yet.
Read/grep:
1. `grep -rn "DiffAction\|statediff\|reconcile\|target.*sink\|TrackingRecordTransition" .opencode/skills/system-spec-kit/mcp_server/lib/ .opencode/skills/system-spec-kit/mcp_server/handlers/` (confirm absence).
2. `handlers/memory-save.ts` + `handlers/save/post-insert.ts` + `handlers/save/enrichment-state.ts` — what is the async/pending-marker model? where would a DiffAction reconciliation hook fit (sync write path vs deferred enrichment replay)?
3. `006-write-path-reconciliation/spec.md` (the desired/prior model; strip its coco statediff-vocabulary research-basis per iter-062 REWRITE — keep the local DiffAction model).

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-070-NN]`. Cover: absence of statediff code; the async enrichment model shape; where DiffAction reconciliation belongs given async (sync-row-write reconciliation vs deferred graph-enrichment replay); whether "same-response graph writes" is even possible now.

### RESCOPE_006
Bullets: the async-aware rescope — what 006 builds (typed DiffAction for parent/child rows + subscribers) and how it interacts with deferred enrichment (pending-marker replay), NOT same-response graph writes.

### VERDICT
006 = {NEEDS-RESCOPE | ...} + headline.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
