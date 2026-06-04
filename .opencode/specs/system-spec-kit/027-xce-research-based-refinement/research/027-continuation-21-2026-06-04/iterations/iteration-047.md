# Iteration 047: Metadata Edge Promoter

## Focus
Revalidated prior finding 005 against current `description.json` / `graph-metadata.json` semantics and existing causal link promotion paths. The selected interpretation is deterministic structured metadata promotion only; LLM extraction and inferred prose links remain out of scope.

## Findings
1. Manual `graph-metadata.json` relationships are already deterministically parsed into causal-link buckets: `manual.depends_on` becomes `blocks`, `manual.supersedes` becomes `supersedes`, and `manual.related_to` becomes `related_to`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1338] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1340] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1341] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1342]
2. The causal-link processor maps those buckets to concrete relations: `blocks` reverses into `ENABLED`, `supersedes` maps to `SUPERSEDES`, `related_to` maps to `SUPPORTS`, and `derived_from` is available but is not populated by current graph metadata extraction. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:69] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:70] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:71] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:72]
3. Current graph-metadata extraction leaves `derived_from` empty even though the schema has deterministic `parent_id` and `children_ids`; therefore parent/child promotion remains a real gap. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:483] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:487] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:65] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:66]
4. `description.json` parent-chain data is parsed and normalized for indexing text/trigger phrases, but it is not returned as `CausalLinks`; this confirms the `description.json.parentChain` promotion gap. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:503] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:558] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:576] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:584]
5. Existing scan-time `createSpecDocumentChain()` creates intra-folder document-chain edges by document type, not packet metadata parent/child edges; it is complementary and should not be mistaken for the metadata edge promoter. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:852] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:884] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:906] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:859]
6. The 005 spec's field table remains accurate: already wired manual edges are deterministic, while `graph-metadata.json.parent_id`, `graph-metadata.json.children_ids`, and `description.json.parentChain` remain deterministic gaps requiring a promoter. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:142] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:145] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:146] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:147]

## Ruled Out
- Ruled out treating `createSpecDocumentChain()` as parent/child metadata promotion: it selects document types within a single `spec_folder`, while the target promoter needs cross-packet metadata relationships. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:884] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:872]
- Ruled out promoting `derived.last_active_child_id` in this pass because the 005 spec explicitly excludes it due to recency semantics. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:151]

## Dead Ends
- Searching only the graph-metadata schema is insufficient: schema proves `parent_id` and `children_ids` exist, but parser return shape proves they are not converted into current causal links. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480]

## Edge Cases
- Ambiguous input: "parent/child/manual edges" could mean existing manual pipeline only or new promoter scope; this iteration separates already wired manual edges from missing deterministic parent/child edges.
- Contradictory evidence: none.
- Missing dependencies: no packet-local `resource-map.md` was present; current code and phase spec were sufficient. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-state.jsonl:1]
- Partial success: complete for code/document revalidation; no implementation or runtime migration validation was attempted.

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1338-1343`
- `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:480-490`, `:558-590`
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:61-70`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67-73`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:852-906`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:859-896`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-metadata-edge-promoter/spec.md:138-170`

## Assessment
- New information ratio: 0.60
- Questions addressed: deterministic metadata edges and existing promotion paths.
- Questions answered: prior finding 005 remains valid; manual edges are already wired, parent/child and description parent-chain promotion remain missing.

## Reflection
- What worked and why: comparing schema, parser output, and processor mappings separated data availability from promotion behavior.
- What did not work and why: document-chain scan code initially looked relevant but proved to be same-folder document linking, not packet hierarchy promotion.
- What I would do differently: next implementation planning should define canonical target resolution before coding promoter writes.

## Recommended Next Focus
For reducer promotion: keep 005 scope, but explicitly preserve the current manual-edge pipeline while adding deterministic `parent_id`, inferred `children_ids`, and `description.parentChain` promoter logic with idempotent edge upserts.
