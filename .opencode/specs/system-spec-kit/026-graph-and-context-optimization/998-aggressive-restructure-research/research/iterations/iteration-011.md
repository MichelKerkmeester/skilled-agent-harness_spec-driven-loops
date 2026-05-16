Iteration-011 complete. I've successfully applied the 11-surface taxonomy from iteration-044 to the current 15-child state and identified 6 key mismatches:

**Key findings:**
- **6 direct mappings** (001, 007, 008, 009, 012, 013) align perfectly with the taxonomy
- **4 consolidation candidates** should merge into spec-doc substrate (002, 010) and memory continuity (003, 005)  
- **2 retrieval substrate packets** (011, 014) should consolidate under Surface 4
- **2 taxonomy violations**: 006 (provenance fallacy - actually affordance uplift) and 015 (incident-gating fallacy - should be cross-cutting assurance)
- **1 missing surface**: Surface 10 (extraction and package boundaries) has no top-level representation

**Primary mismatches with iter-005's 6-phase structure:**
- Memory work fragmented across P1/P2 instead of unified Surface 3
- Retrieval work fragmented across P3/P5 instead of unified Surface 4  
- Template-levels misclassified as tooling instead of Surface 2
- External-project-adoption misnamed for provenance vs. technical surface

All claims are densely cited with file:line references from iteration-044, iteration-005, and actual packet description.json files. The JSONL delta row has been appended.
ject-adoption/description.json" lines="2-4" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/description.json" lines="2-16" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/description.json" lines="3-5" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="73-84" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-71" />

## Findings

### 11-surface taxonomy from iteration-044

Iteration-044 established a first-principles domain decomposition with 11 technical surfaces <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="6-16" />:

1. **Surface 1: Research and baseline** — external/reference research, initial system diagnosis, adoption rationale
2. **Surface 2: Spec documentation substrate** — templates, resource maps, phase-parent rules, validation contracts, generated metadata
3. **Surface 3: Memory continuity and indexing** — memory save/search, continuity recovery, indexer invariants, cache invalidation, retention
4. **Surface 4: Retrieval substrate and embeddings** — CocoIndex, local embeddings, model/provider migration, embedding cache, vector store rebuilds, daemon resilience
5. **Surface 5: Code graph** — code graph scanner, graph package extraction, scan scope, code-graph hooks, backend resilience
6. **Surface 6: Skill advisor and routing** — skill discovery, advisor graph, intent routing, semantic lane, calibration, corpus sweeps, plugin hardening
7. **Surface 7: Runtime executor and hooks** — CLI executor hardening, runtime wrapper contracts, hook injection, hook parity across runtimes
8. **Surface 8: Causal/context routing and affordance display** — graph-channel routing, causal edges, impact explanations, trust display, affordance evidence
9. **Surface 9: Doctor and repair commands** — `/doctor` command router, subsystem diagnostics, update orchestration, sandbox testing playbook
10. **Surface 10: Extraction and package boundaries** — extracted skills isolation, system-code-graph extraction, system-skill-advisor extraction, consumer rewiring
11. **Surface 11: Release governance, observability, and assurance** — cleanup, release readiness, stress tests, deep review remediation, security audit, stale-doc fixes

### Current 15-child state from iteration-005

The current 026 structure has 15 active top-level children <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="39-54" />:

1. 000-release-cleanup
2. 001-research-and-baseline
3. 002-resource-map-deep-loop-fix
4. 003-continuity-memory-runtime
5. 005-memory-indexer-invariants
6. 006-external-project-adoption
7. 007-code-graph
8. 008-skill-advisor
9. 009-hook-parity
10. 010-template-levels
11. 011-cocoindex-daemon-resilience
12. 012-causal-graph-channel-routing
13. 013-doctor-update-orchestrator
14. 014-local-embeddings-migration
15. 015-tanstack-security-audit

### Taxonomy mapping analysis

#### Direct mappings (6 packets)

Six current children map directly to the 11-surface taxonomy:

| Current Child | Target Surface | Alignment Status |
|--------------|----------------|------------------|
| 001-research-and-baseline | Surface 1: Research and baseline | **DIRECT MATCH** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/description.json" lines="3" /> |
| 007-code-graph | Surface 5: Code graph | **DIRECT MATCH** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="73-84" /> |
| 008-skill-advisor | Surface 6: Skill advisor and routing | **DIRECT MATCH** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="73-84" /> |
| 009-hook-parity | Surface 7: Runtime executor and hooks | **DIRECT MATCH** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="86-97" /> |
| 012-causal-graph-channel-routing | Surface 8: Causal/context routing and affordance display | **DIRECT MATCH** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="86-97" /> |
| 013-doctor-update-orchestrator | Surface 9: Doctor and repair commands | **DIRECT MATCH** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="99-111" /> |

#### Surface consolidation candidates (4 packets)

Four current children should consolidate into the spec documentation substrate surface:

| Current Child | Target Surface | Rationale |
|--------------|----------------|-----------|
| 002-resource-map-deep-loop-fix | Surface 2: Spec documentation substrate | Resource-map template work is documentation substrate per iter-044 definition <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="7" /> |
| 010-template-levels | Surface 2: Spec documentation substrate | Template-level redesign is documentation substrate per iter-044 definition <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="7" />; currently focused on RM-8 prompt hardening <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/description.json" lines="3-16" /> |
| 003-continuity-memory-runtime | Surface 3: Memory continuity and indexing | Continuity runtime maps to memory continuity surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="8" /> |
| 005-memory-indexer-invariants | Surface 3: Memory continuity and indexing | Memory indexer invariants map to memory continuity surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="8" /> |

#### Retrieval substrate consolidation (2 packets)

Two current children should consolidate into the retrieval substrate surface:

| Current Child | Target Surface | Rationale |
|--------------|----------------|-----------|
| 011-cocoindex-daemon-resilience | Surface 4: Retrieval substrate and embeddings | CocoIndex daemon resilience is retrieval substrate per iter-044 definition <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="9" /> |
| 014-local-embeddings-migration | Surface 4: Retrieval substrate and embeddings | Local embeddings migration is retrieval substrate per iter-044 definition <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="9" />; description confirms llama-cpp embedding worker focus <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/description.json" lines="3-5" /> |

#### Taxonomy violations (2 packets)

Two current children violate the 11-surface taxonomy:

| Current Child | Taxonomy Violation | Correct Surface | Rationale |
|--------------|-------------------|-----------------|-----------|
| 006-external-project-adoption | **PROVENANCE FALLACY** — describes provenance, not technical surface | Surface 8: Causal/context routing and affordance display | Description reveals it's actually "Graph Impact and Affordance Uplift" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-external-project-adoption/description.json" lines="2-4" />, which belongs in causal/context routing surface per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="13" /> |
| 015-tanstack-security-audit | **INCIDENT-GATING FALLACY** — incident response treated as product domain | Surface 11: Release governance, observability, and assurance | Security audit is cross-cutting assurance, not a standalone product domain per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="87-89" /> |

#### Missing surface (1 surface)

One surface from the 11-surface taxonomy has no corresponding current child:

| Missing Surface | Gap Analysis |
|-----------------|--------------|
| **Surface 10: Extraction and package boundaries** | No current child represents extracted skills isolation, system-code-graph extraction, or system-skill-advisor extraction. Iter-044 notes this as a real technical surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="15" />, but the current 15-child state lacks this domain. This work may be nested under existing phase parents (007-code-graph, 008-skill-advisor) rather than being a top-level child. |

### Comparison with iteration-005 phase structure

Iteration-005 proposed 6 phases that partially align with the 11-surface taxonomy but with significant mismatches:

| Iter-005 Phase | 11-Surface Equivalent | Alignment Status |
|----------------|----------------------|------------------|
| P1: Foundation & Infrastructure (001, 002, 003) | Surfaces 1, 2, 3 | **PARTIAL** — correctly groups research/baseline, but conflates spec-doc substrate with memory continuity |
| P2: Core Systems (005, 007, 008) | Surfaces 3, 5, 6 | **MISMATCH** — memory indexer invariants (005) belong in Surface 3, not with code graph/skill advisor |
| P3: Runtime Integration & Resilience (009, 011, 012) | Surfaces 4, 7, 8 | **MISMATCH** — cocoindex daemon resilience (011) belongs in Surface 4, not with runtime/hooks and causal routing |
| P4: Tooling & Hardening (010, 013, 015) | Surfaces 2, 9, 11 | **MISMATCH** — template-levels (010) belong in Surface 2, not with tooling/hardening |
| P5: External Integration & Migration (006, 014) | Surfaces 4, 8 | **MISMATCH** — external-project-adoption (006) is misnamed; local-embeddings (014) belongs in Surface 4 |
| P6: Release Cleanup (000) | Surface 11 | **ALIGN** — correctly identifies release governance surface |

### Key mismatches identified

1. **Provenance vs. technical surface confusion**: 006-external-project-adoption is named for provenance but describes affordance uplift work, violating iter-044's principle that "provenance belongs in research or decision records; implementation belongs under the owning subsystem" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="71-73" />.

2. **Incident-gating vs. domain taxonomy**: 015-tanstack-security-audit is treated as a top-level product domain when it should be cross-cutting assurance under Surface 11 per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="87-89" />.

3. **Memory continuity fragmentation**: Memory-related work (003, 005) is split across P1 and P2 in iter-005, when it should consolidate under Surface 3 per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="8" />.

4. **Retrieval substrate fragmentation**: Embeddings/CocoIndex work (011, 014) is split across P3 and P5 in iter-005, when it should consolidate under Surface 4 per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="9" />.

5. **Spec-doc substrate misclassification**: Template-levels (010) is classified as tooling/hardening in iter-005 when it belongs in Surface 2 per iter-044 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="7" />.

6. **Missing extraction surface**: Surface 10 (extraction and package boundaries) has no top-level representation in the current 15-child state, though iter-044 identifies it as a real technical surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md" lines="15" />.

## Gaps for next iter

1. **Extraction surface investigation**: Determine if extraction/package-boundary work (Surface 10) exists as nested children under 007-code-graph or 008-skill-advisor, or if this surface is genuinely missing from the current 026 structure.

2. **Naming correction for 006**: Evaluate renaming 006-external-project-adoption to reflect its actual affordance uplift scope, or reclassify it under Surface 8 (causal/context routing).

3. **Security audit placement decision**: Decide whether to keep 015-tanstack-security-audit as top-level for operational incident response continuity (per iter-044 caveat) or absorb it into Surface 11 under 000-release-cleanup.

4. **Memory consolidation strategy**: Plan consolidation of 003-continuity-memory-runtime and 005-memory-indexer-invariants into a unified Surface 3 phase parent.

5. **Retrieval consolidation strategy**: Plan consolidation of 011-cocoindex-daemon-resilience and 014-local-embeddings-migration into a unified Surface 4 phase parent.

6. **Spec-doc substrate consolidation**: Plan consolidation of 002-resource-map-deep-loop-fix and 010-template-levels into a unified Surface 2 phase parent, addressing the RM-8 prompt hardening scope within the substrate context.

## JSONL delta row
```json
{"iter_id": "011", "timestamp_utc": "2026-05-16T06:11:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 6, "status": "complete", "findings_count": 6, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-044.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-external-project-adoption/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/description.json"]}
```