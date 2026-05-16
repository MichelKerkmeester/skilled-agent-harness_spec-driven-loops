Iteration 017 complete. I've successfully analyzed the cross-026 reorganization opportunities and written the findings to `research/iterations/iteration-017.md`.

**Key findings:**

1. **003 should absorb 005-memory-indexer-invariants** — YES recommendation based on Surface 3 consolidation opportunity, phase structure mismatch correction (memory work split across P1/P2), and scope coherence (003 covers runtime infrastructure, 005 covers indexer correctness invariants)

2. **012-causal-graph-channel-routing should absorb 006-external-project-adoption** — YES recommendation based on taxonomy violation correction (006 is a provenance fallacy, actually graph impact/affordance uplift), Surface 8 alignment, and naming correction opportunity

3. **Cross-phase restructure opportunities** — Identified additional consolidation opportunities for Surface 2 (002+010 with caution), Surface 4 (011+014), and Surface 11 (015 into 000 with prefix preservation)

All claims are densely cited with file:line references from iterations 005, 007, 008, 011, 012 and actual packet description.json files. The JSONL delta row has been appended.
Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/description.json" lines="4-9" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/description.json" lines="16-17" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-causal-graph-channel-routing/description.json" lines="4-5" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-external-project-adoption/description.json" lines="3-4" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="119-122" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="128-134" />

## Findings

### Finding 1: 003 should absorb 005-memory-indexer-invariants

**Recommendation: YES — 003-continuity-memory-runtime should absorb 005-memory-indexer-invariants**

**Rationale:**

1. **Surface 3 consolidation opportunity**: Iteration-011 identified both 003-continuity-memory-runtime and 005-memory-indexer-invariants as Surface 3 (Memory continuity and indexing) consolidation candidates <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="82-86" />. Both packets belong to the same technical surface.

2. **Phase structure mismatch correction**: Iteration-005 split memory work across P1 (Foundation & Infrastructure, containing 003) and P2 (Core Systems, containing 005) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-84" />. Iteration-011 identified this as a mismatch: "Memory continuity fragmentation: Memory-related work (003, 005) is split across P1 and P2 in iter-005, when it should consolidate under Surface 3" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="119-122" />.

3. **Scope coherence**: 003-continuity-memory-runtime contains 4 children focused on memory runtime infrastructure (cache-warning-hooks, memory-quality-remediation, continuity-refactor-gates, memory-save-rewrite) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/description.json" lines="4-9" />. 005-memory-indexer-invariants is a Level 3 packet covering memory-indexer invariant tracks (E_LINEAGE fix, candidate_changed fix, index-scope exclusions, constitutional-tier invariants) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/description.json" lines="16-17" />. These are logically complementary: 003 covers runtime infrastructure, 005 covers indexer correctness invariants.

4. **Implementation approach**: 005 should become 003-continuity-memory-runtime/005-memory-indexer-invariants (preserving the 005 child number within the 003 parent). This would create a unified Surface 3 phase parent with 5 children covering all memory continuity and indexing work.

### Finding 2: 012-causal-graph-channel-routing should absorb 006-external-project-adoption

**Recommendation: YES — 012-causal-graph-channel-routing should absorb 006-external-project-adoption**

**Rationale:**

1. **Taxonomy violation correction**: Iteration-011 identified 006-external-project-adoption as a taxonomy violation: "PROVENANCE FALLACY — describes provenance, not technical surface" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="96-104" />. The description reveals it's actually "Graph Impact and Affordance Uplift" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-external-project-adoption/description.json" lines="3-4" />, which belongs in Surface 8 (Causal/context routing and affordance display) per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="96-104" />.

2. **Surface 8 alignment**: 012-causal-graph-channel-routing is the Surface 8 direct match <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="67-75" />. 006's actual scope (graph impact and affordance uplift) aligns with Surface 8's definition: "Causal/context routing and affordance display — graph-channel routing, causal edges, impact explanations, trust display, affordance evidence" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="37" />.

3. **Naming correction opportunity**: Absorbing 006 into 012 provides an opportunity to correct the provenance-fallacy naming. The current name "external-project-adoption" describes provenance (external project pt-01 + pt-02 adoption) rather than the actual technical work (graph impact and affordance uplift). Under 012, the packet could be renamed to reflect its actual affordance-uplift scope.

4. **Current 012 structure**: 012-causal-graph-channel-routing currently has 2 children (001-initial-delivery, 002-deep-review-remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-causal-graph-channel-routing/description.json" lines="4-5" />. Absorbing 006 would add graph impact and affordance uplift work, creating a more complete Surface 8 phase parent.

5. **Implementation approach**: 006 should become 012-causal-graph-channel-routing/003-graph-impact-affordance-uplift (next available child number after 002). The packet should be renamed from "external-project-adoption" to "graph-impact-affordance-uplift" to reflect its actual scope and correct the provenance fallacy.

### Finding 3: Cross-phase restructure opportunities

**Additional consolidation opportunities identified:**

1. **Surface 2 consolidation**: Iteration-011 identified 002-resource-map-deep-loop-fix and 010-template-levels as Surface 2 consolidation candidates <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="76-86" />. Both are spec-documentation substrate work (resource-map templates and template-level redesign). However, iteration-007 recommended keeping 010-template-levels as a separate parent due to domain coherence <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-007.md" lines="20-33" />. Surface 2 consolidation should proceed with caution.

2. **Surface 4 consolidation**: Iteration-011 identified 011-cocoindex-daemon-resilience and 014-local-embeddings-migration as Surface 4 consolidation candidates <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="87-95" />. Both are retrieval substrate work (CocoIndex daemon resilience and local embeddings migration). This consolidation would create a unified Surface 4 phase parent.

3. **Surface 11 consolidation**: 015-tanstack-security-audit is cross-cutting assurance work that should belong to Surface 11 (Release governance, observability, and assurance) per iteration-011 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="96-104" />. Iteration-008 recommended absorbing 015 into 000-release-cleanup <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-008.md" lines="42-52" />. However, iteration-012 recommended preserving 015's prefix for security incident response continuity <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-012.md" lines="74-78" />. Surface 11 consolidation should preserve the 015 prefix.

## Gaps for next iter

1. **003/005 absorption execution plan**: Determine the implementation approach for absorbing 005 into 003 (child numbering, metadata updates, cross-reference cleanup, dependency validation).

2. **006/012 absorption execution plan**: Determine the implementation approach for absorbing 006 into 012 (renaming from "external-project-adoption" to "graph-impact-affordance-uplift", child numbering, metadata updates).

3. **Surface 4 consolidation validation**: Validate that 011-cocoindex-daemon-resilience and 014-local-embeddings-migration consolidation is appropriate given their different scopes (daemon resilience vs. embeddings migration).

4. **Surface 2 consolidation decision**: Re-evaluate Surface 2 consolidation (002+010) given iteration-007's recommendation to keep 010 as a separate parent for domain coherence.

5. **Cross-phase dependency mapping**: Map dependencies between the proposed consolidated structures to ensure no functional dependencies would be broken by the reorganizations.

6. **Metadata synchronization strategy**: Develop a comprehensive metadata synchronization strategy for all proposed absorptions (graph-metadata.json updates, spec.md phase map updates, resource-map.md updates).

## JSONL delta row
{"iter_id": "017", "timestamp_utc": "2026-05-16T06:20:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 9, "status": "complete", "findings_count": 3, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-causal-graph-channel-routing/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-external-project-adoption/description.json"]}
