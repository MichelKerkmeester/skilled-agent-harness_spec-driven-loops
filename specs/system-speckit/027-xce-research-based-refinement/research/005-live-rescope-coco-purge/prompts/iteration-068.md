DEEP-RESEARCH

# Deep-Research Iteration 068 — 003 incremental-index vs shipped self-maintaining memory_index_scan

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 026 SHIPPED a self-maintaining `memory_index_scan` (collapses redundant concurrent scans, sweeps orphans, re-points relocated spec folders, reports state via `memory_health`). Also async post-insert enrichment.
- 027 Phase 003 (`003-incremental-index-foundation`) plans: `memoization_records` table, `dependency_edges`, chunk-fingerprint columns, `canonical-fingerprint.ts`, `memo.ts`, chunk kinds, chunk line spans — to make indexing skip unchanged stages (currently file-level mtime/hash).
- The audit said 003 STILL-RELEVANT (no memo/DAG/fingerprint columns; indexing still mtime/hash at `incremental-index.ts:173-224`); recent async/orphan commits did NOT add memo/DAG. VERIFY against live code.

## FOCUS — answer only this
Confirm whether the shipped self-maintaining `memory_index_scan` (or async enrichment) added ANY of 003's planned primitives, and what 003's remaining foundation scope is.
Read/grep:
1. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts` (is indexing still file-level mtime/hash? any memo/chunk-fingerprint?).
2. `grep -rn "memoization_records\|dependency_edges\|canonical.fingerprint\|chunk_fingerprint\|memo\b" .opencode/skills/system-spec-kit/mcp_server/lib/` (do these exist live?).
3. The `memory_index_scan` handler (what does the self-maintaining scan actually do — collapse/orphan/re-point only, or more?).
4. `003-incremental-index-foundation/spec.md` (planned primitives; strip its coco research-basis per iter-062 REWRITE).

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-068-NN]`. Cover: indexing granularity today; absence of memo/DAG/fingerprint; what memory_index_scan self-maintenance does (and does NOT) overlap; any async-enrichment overlap.

### RESIDUAL_SCOPE_003
Bullet list of what 003 still must build (post-026) vs anything now redundant.

### VERDICT
003 = {STILL-RELEVANT | NARROW | ...} + headline.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
