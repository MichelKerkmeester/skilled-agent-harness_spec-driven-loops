# Iteration 064 — 026-dedup: 002 P0s vs shipped conflict guard (all 3 STILL-REAL; P0-2 distinct path)

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.72. **Findings:** 5.
**Raw analysis:** `research/prompts/iteration-064.out`

### FINDINGS
[F-064-01] P0-1 is STILL-REAL: `auto-session` is not treated as auto; live cap logic still checks only `createdBy === 'auto'` and consolidation still checks only `edge.created_by === 'auto'`. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:269`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:270`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:356`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:357`

[F-064-02] P0-2 is STILL-REAL for the actual clobber bug: `insertEdge` finds an existing same `(source,target,relation,anchors)` row, then unconditionally updates `created_by = ?`, so an auto/reducer upsert can still overwrite manual provenance. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:313`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:326`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:331`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:336`

[F-064-03] The shipped conflict guard is a different path from P0-2: it skips inferred edges whose pair has a valid conflicting relation before contradiction detection can invalidate the old edge; it does not guard same-relation upserts or preserve `created_by` on the row update path. `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:548`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:554`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:661`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:675`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:681`

[F-064-04] The guard partially covers only the adjacent invalidation risk: `detectContradictions` invalidates existing valid conflicting edges, while `hasConflictingValidEdge` prevents those conflict-prone inferred edges from reaching that invalidation path. `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:84`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:105`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:110`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:686`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:701`

[F-064-05] P0-3 is STILL-REAL: retention selection and revalidation are still `delete_after`-only, and destructive deletion runs after only `isStillExpired`, with no selected `importance_tier`, `is_pinned`, or protected-tier decision. `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:52`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:65`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:74`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:204`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:210`

### P0_STATUS_TABLE
`P0 | claim | status | live file:line | live path`

`P0-1 | auto-session/auto-* provenance must get auto caps | STILL-REAL | causal-edges.ts:270; consolidation.ts:357 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts; .opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts`

`P0-2 | reducer/auto upsert must not overwrite manual created_by | STILL-REAL | causal-edges.ts:326-338; relation-backfill.ts:661-681 | .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

`P0-3 | retention sweep must be tier/pin-aware before delete | STILL-REAL | memory-retention-sweep.ts:52-68; memory-retention-sweep.ts:204-211 | .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`

### VERDICT
002 = STILL-RELEVANT-REPATH. All three P0s survive. P0-2 is not closed by the shipped conflict guard; the guard protects conflicting-relation invalidation, while the clobber bug is same-key `insertEdge` update provenance overwrite. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:326`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:331`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:675`

Path corrections: use live paths under `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts`, and `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`; current `spec.md` already lists those storage/governance suffixes. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:142`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:143`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:144`

### RULED_OUT
- CLOSED for P0-1 ruled out: both live cap sites still use exact `auto` equality. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:270`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:357`
- CLOSED for P0-2 ruled out: same-row upsert still sets `created_by = ?`. `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:326`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:331`
- CLOSED for P0-3 ruled out: retention deletion still follows expired `delete_after` plus `deleteMemory`. `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:65`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:210`

### METRICS
newInfoRatio: 0.72

novelty: The key new distinction is that the shipped conflict guard covers conflicting-relation invalidation, not P0-2’s same-key `created_by` overwrite.

status: complete

sources: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:269`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:270`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:313`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:326`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:331`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:356`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:357`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:548`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:554`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:661`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:675`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:52`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:65`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:210`
