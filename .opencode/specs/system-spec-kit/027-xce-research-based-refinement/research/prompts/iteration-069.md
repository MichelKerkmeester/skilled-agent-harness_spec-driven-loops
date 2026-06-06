DEEP-RESEARCH

# Deep-Research Iteration 069 — 004 tombstones: live delete-site inventory + lifecycle_generation collision

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 027 Phase 004 (`004-causal-edge-tombstones`) adds a tombstone lifecycle: read-before-delete tombstone before any hard-delete of an active causal edge; planned `lib/causal/sweep.ts`, a tombstone table, and `memory_health` orphan repair.
- The audit said: deletes still hard-delete; `deleteEdge()` runs `DELETE FROM causal_edges WHERE id=?` and `deleteEdgesForMemory()` runs `DELETE FROM ...`; the caller inventory is STALE — extra hard-delete sites exist at `vector-index-mutations.ts:137`, `checkpoints.ts:1668`, `corrections.ts:611`. Also a NAME COLLISION: 004's planned `lifecycle_generation` collides with the existing in-memory `causalEdgesGeneration` cache counter. VERIFY.

## FOCUS — answer only this
Produce the COMPLETE live inventory of every site that hard-deletes `causal_edges` rows, and resolve the lifecycle_generation naming collision.
Do:
1. `grep -rn "DELETE FROM causal_edges\|deleteEdge\|deleteEdgesForMemory\|causalEdgesGeneration\|lifecycle_generation" .opencode/skills/system-spec-kit/mcp_server/lib/ .opencode/skills/system-spec-kit/mcp_server/handlers/`
2. Confirm each site (causal-edges.ts, vector-index-mutations.ts, checkpoints.ts, corrections.ts, anywhere else) with file:line.
3. Read `004-causal-edge-tombstones/spec.md` for the planned tombstone routing + the `lifecycle_generation` field; strip its coco research-basis per iter-062 REWRITE.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-069-NN]`. Cover: every live hard-delete site (confirm/expand the audit's 4); the lifecycle_generation vs causalEdgesGeneration collision (are they the same concept? persisted vs in-memory?).

### DELETE_SITE_INVENTORY
`site | file:line | deletes causal_edges? | must route through tombstone?`

### SCOPE_FIX_004
Bullets: caller routing expansion to ALL sites; the persisted-lifecycle-gen vs cache-counter naming disambiguation; tombstone table + sweep.ts placement (lib/causal/ exists).

### VERDICT
004 = {NEEDS-RESCOPE | ...} + headline.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
