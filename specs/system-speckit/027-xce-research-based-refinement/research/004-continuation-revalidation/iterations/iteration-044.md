# Iteration 044: Memory write safety revalidation

## Scope
Revalidate `002-memory-write-safety` against current `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/storage/consolidation.ts`, and `mcp_server/lib/governance/memory-retention-sweep.ts`. Confirm whether `createdBy === 'auto'` and tier-blind delete remain.

## Method
- Read packet state first from the continuation artifact root.
- Read the 002 spec and the three current production files named in the dispatch.
- Searched current repository code for provenance, retention, and tier fields; findings are based on current files only.

## Cited Findings
1. The 002 problem statement is stale only in path spelling, not substance: the spec names older `mcp_server/lib/causal/...` and `mcp_server/lib/memory/...` paths [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety/spec.md:79], while current files exist at `mcp_server/lib/storage/causal-edges.ts`, `mcp_server/lib/storage/consolidation.ts`, and `mcp_server/lib/governance/memory-retention-sweep.ts` [INFERENCE: based on current Glob results resolving those three files].
2. The narrow auto-provenance cap still exists in `causal-edges.ts`: insert strength is capped only when `createdBy === 'auto'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:269], and edge-count bounds are also applied only for `createdBy === 'auto'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:282]. Therefore `auto-session` would still bypass both checks.
3. The consolidation cap remains tier/provenance-narrow in the same way: Hebbian strengthening caps automatic edges only when `edge.created_by === 'auto'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts:356]. Therefore an `auto-session` edge can be strengthened above `MAX_AUTO_STRENGTH` in the consolidation path.
4. The manual-edge overwrite gap still exists: conflict lookup selects only `id` and `strength` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:313], then an existing row is updated with the new `strength`, `evidence`, and `created_by` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:326]. Because current code never reads existing `created_by`, it cannot preserve a manual edge from an automatic/reducer upsert.
5. The retention sweep remains tier-blind at selection and deletion time: `RetentionExpiredRow` contains ids, path, tenant/user/agent/session, and `deleteAfter`, but no `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, or `last_accessed` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:17]. The select query filters only `delete_after IS NOT NULL` and expired time [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:52], and the loop calls `vectorIndex.deleteMemory(candidate.id, database)` after only a TOCTOU expiry check [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:204].
6. The schema has the fields needed for the planned tier-aware guard: `memory_index` includes `decay_half_life_days`, `is_pinned`, `access_count`, `last_accessed`, `importance_tier`, and `delete_after` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2605]. This confirms 002 can be implemented as a localized select/decision change rather than a schema prerequisite.

## Negative Knowledge / Ruled-Out Directions
- Do not treat path drift as resolution; the current files moved from the spec's older path names, but the same logic is still present.
- Do not assume current schema protects high-tier rows automatically; the retention query does not select or branch on the tier fields.
- Do not rely on consolidation to correct insert-time provenance; consolidation repeats the same narrow `auto` check.
- Do not implement reducer work before this packet; the manual-overwrite and `auto-session` gaps still make reducer writes unsafe.

## Answer / Decision
`002-memory-write-safety` remains valid and should stay P0. The three stated gaps are still present in current production code: `createdBy === 'auto'` remains narrow, manual causal edges can still be overwritten on conflict, and retention deletion remains tier-blind.

## Next-Step Recommendation
Implement a shared or mirrored `isAutoEdgeCreator(createdBy)` predicate for `auto` plus `auto-*`, extend the conflict lookup to include existing `created_by` and skip automatic overwrites of non-auto rows, and add a tier-aware/pinned retention decision before deletion.
