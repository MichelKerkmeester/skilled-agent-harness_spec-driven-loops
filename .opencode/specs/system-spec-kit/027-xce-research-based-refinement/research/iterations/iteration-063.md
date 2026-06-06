# Iteration 063 — 026-dedup: 005 metadata-promoter vs shipped relation-backfill.ts

**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant xhigh (read-only). **Status:** complete. **newInfoRatio:** 0.35. **Findings:** 6.
**Raw analysis:** `research/prompts/iteration-063.out`

### FINDINGS

[F-063-01] `relation-backfill.ts` promotes spec-document chains, lineage predecessor links, optional cached similarity `supports`, and optional structural supersession `contradicts`; it writes only when `dryRun:false` and emits `createdBy:'auto'`. `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:165-170`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:390-398`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:403-412`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:421-429`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:443-449`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:491-515`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:651-658`

[F-063-02] `relation-backfill.ts` does not promote packet metadata fields; its scans are DB rows from `memory_index`, `memory_lineage`, `related_memories`, and `superseded_by_memory_id`, not `graph-metadata.json.parent_id/children_ids`, `manual.*`, or `description.json.parentChain`. `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:390-449`

[F-063-03] `manual.depends_on/supersedes/related_to` are already wired through graph metadata parsing into causal links, but they are inserted as default `created_by='manual'`, not `auto`: `depends_on -> blocks -> enabled(reverse)`, `supersedes -> supersedes`, `related_to -> supports`. `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1361-1366`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:318-335`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67-73`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:412-418`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:253-261`

[F-063-04] `parent_id`, `children_ids`, and `parentChain` are parsed/indexed today, not promoted to causal edges: graph metadata stores `parent_id/children_ids`, graph index text prints them, description metadata parses `parentChain`, but graph metadata causal extraction only returns `metadata.manual`, and description metadata returns `emptyCausalLinks()`. `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61-70`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1125-1134`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1320-1328`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:262-294`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480-490`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:558-560`

[F-063-05] `causal_edges` has `extracted_at` and `created_by`, but no `extraction_method` or edge-level `confidence`; the only shown `confidence` migration/table column is for `memory_index`. `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:713-728`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1381-1396`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1954-1957`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2624`

[F-063-06] 005 is already partially audit-rescoped to skip `manual.*`, but its P0 requirements still redundantly require `depends_on` and `supersedes` promotion. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:108`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:122-135`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:183-186`

### NARROWED_SCOPE_005

- KEEP: index-time promoter for `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain` only. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:146-148`

- KEEP: packet-id normalization, target memory resolution, unresolved-target warnings, idempotent insertion, and manual-edge preservation policy. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:127`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:134-135`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:193-195`

- KEEP: add/plumb causal-edge provenance columns `confidence` and `extraction_method`; preserve existing `extracted_at` and `created_by`. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:128-133`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:713-728`

- REFINE: remove stale `description.json.parent_id` wording; live `description.json` metadata has `parentChain`, while `parent_id` belongs to graph metadata. `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:503-513`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61-66`

- DROP: `manual.depends_on/supersedes/related_to` auto-promotion from 005; those are already promoted through the causal-links processor as manual edges. `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:124`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67-73`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:253-261`

- DROP: any spec-document-chain, lineage-predecessor, similarity-supports, or supersession-contradicts backfill work; that is shipped in `relation-backfill.ts`. `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:165-170`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:202-206`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:271-279`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:310-315`

### VERDICT

005 = KEEP-NARROWED: relation-backfill covers DB-derived maintenance backfill, while 005 still owns index-time promotion of parsed packet metadata gaps plus missing edge provenance columns. `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:342-349`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:122-135`

### RULED_OUT

- MERGE-INTO-relation-backfill: wrong lifecycle surface; relation-backfill is optional stats-time backfill with dry-run default, while 005 is post-index metadata promotion. `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:110-123`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:950-962`

- REMOVE: false because `parent_id/children_ids/parentChain` are parsed but not promoted. `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:262-294`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480-490`

- Auto-promote `manual.*` as `auto`: redundant and changes current provenance from default manual. `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:412-418`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:253-261`

### METRICS

newInfoRatio: 0.35

novelty: Audit largely confirmed; the useful delta is exact live provenance and the stale `description.json.parent_id`/P0 manual-triplet cleanup.

status: complete

sources: `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:165-170`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:390-449`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:491-515`, `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts:651-658`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1125-1134`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1320-1366`, `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61-70`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:262-294`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480-490`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:503-513`, `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:558-560`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67-73`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:412-418`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:253-261`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:713-728`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1381-1396`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:122-152`
