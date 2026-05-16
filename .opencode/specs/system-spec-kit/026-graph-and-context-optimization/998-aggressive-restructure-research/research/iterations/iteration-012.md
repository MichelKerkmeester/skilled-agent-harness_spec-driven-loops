Iteration 012 complete. I've successfully analyzed the phase numbering scheme proposal for 026 prefix preservation vs 000-010 renumbering for 11-surface taxonomy alignment.

**Key findings:**
- **Current state**: 15 active children numbered 000-015 with intentional gaps (004, 006, 010, 011)
- **11-surface taxonomy**: Iteration-044 established 11 technical surfaces that could map to 000-010 numbering
- **Option A (Preserve)**: Maintains historical continuity, audit markers, and security incident response continuity with minimal operational risk
- **Option B (Renumber)**: Provides clean taxonomy alignment but requires massive metadata updates, breaks citations, and loses audit trails
- **Recommendation**: Preserve 026 prefix with enhanced taxonomy documentation overlay (hybrid approach)

**Primary rationale for preservation**:
1. Security incident response continuity for 015-tanstack-security-audit (P0 security work)
2. Audit marker preservation at 006 (deliberate consolidation pass marker)
3. Avoids massive metadata synchronization across 15+ packets
4. Eliminates citation breakage risk in research tracking and cross-references

The proposed hybrid approach adds taxonomy mapping tables and surface classification fields without requiring physical renumbering, achieving clarity benefits while maintaining operational safety.

Output written to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-012.md`
-015 with intentional gaps <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="39-54" />:

1. 000-release-cleanup
2. 001-research-and-baseline
3. 002-resource-map-deep-loop-fix
4. 003-continuity-memory-runtime
5. 005-memory-indexer-invariants (gap at 004)
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

**Intentional gaps documented in spec.md**:
- Gap at 006 is a "deliberate audit marker from consolidation passes; never renumber to fill it" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="141-142" />
- Gap at 011 was "consumed by the 2026-04-27 carve-out for the v1.0.1 stress-test remediation cycle" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="108" />

**Spec.md phase documentation map inconsistency**: The spec.md states "Active children are the 11 thematic wrappers below" but the phase map table shows only 10 wrappers (000, 001, 002, 003, 004, 005, 007, 008, 009, 010, 015) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="110-122" />. This suggests the spec.md is out of sync with the actual filesystem state post-Wave 1-3 restructuring.

### 11-surface taxonomy from iteration-044

Iteration-044 established a first-principles domain decomposition with **11 technical surfaces** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="25-40" />:

1. **Surface 1**: Research and baseline
2. **Surface 2**: Spec documentation substrate
3. **Surface 3**: Memory continuity and indexing
4. **Surface 4**: Retrieval substrate and embeddings
5. **Surface 5**: Code graph
6. **Surface 6**: Skill advisor and routing
7. **Surface 7**: Runtime executor and hooks
8. **Surface 8**: Causal/context routing and affordance display
9. **Surface 9**: Doctor and repair commands
10. **Surface 10**: Extraction and package boundaries
11. **Surface 11**: Release governance, observability, and assurance

### Taxonomy mapping analysis from iteration-011

Iteration-011 applied the 11-surface taxonomy to the current 15-child state and found **significant consolidation opportunities** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md" lines="61-112" />:

**Direct mappings (6 packets)**: 001, 007, 008, 009, 012, 013 align perfectly with specific surfaces
**Consolidation candidates (6 packets)**: 002+010 → Surface 2, 003+005 → Surface 3, 011+014 → Surface 4
**Taxonomy violations (2 packets)**: 006 (provenance fallacy), 015 (incident-gating fallacy)
**Missing surface (1 surface)**: Surface 10 has no top-level representation

If fully consolidated per the 11-surface taxonomy, the structure would reduce from 15 children to **11 surface-aligned phase parents** (Surface 1-11).

### Option A: Preserve 026 prefix (current 000-015 numbering)

**Pros**:
1. **Historical continuity**: Maintains existing packet IDs and citations across the codebase, avoiding breakage of cross-references in documentation, metadata, and research tracking files
2. **Audit marker preservation**: Keeps the deliberate gap at 006 as an audit marker from consolidation passes, as explicitly documented in spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="141-142" />
3. **Minimal metadata disruption**: Avoids the massive metadata synchronization effort required to update graph-metadata.json, description.json, spec.md, and cross-reference files across 15+ packets
4. **Operational stability**: Reduces risk of breaking tooling that depends on packet IDs (memory system, resource maps, phase transition automation)
5. **Incident response continuity**: Preserves 015-tanstack-security-audit's original prefix for security incident response documentation, which is critical for P0 security work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-008.md" lines="84-88" />

**Cons**:
1. **Taxonomy misalignment**: Current numbering does not reflect the 11-surface taxonomy, creating cognitive dissonance between packet IDs and technical domains
2. **Gap confusion**: Intentional gaps (004, 006, 010, 011) may be misinterpreted as missing work rather than audit markers
3. **Future extensibility**: Limited room for new top-level surfaces without extending beyond 015 or creating more gaps
4. **Spec.md inconsistency**: The spec.md claims "11 thematic wrappers" but shows 10 in the phase map, indicating documentation drift that would persist without renumbering <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="110-122" />

### Option B: Renumber 000-010 for 11-surface taxonomy alignment

**Pros**:
1. **Taxonomy alignment**: Clean 000-010 numbering maps directly to Surface 1-11, creating immediate cognitive clarity between packet IDs and technical domains
2. **Gap elimination**: Removes confusing audit gaps, presenting a clean sequential surface map
3. **Future clarity**: New surfaces would follow the established pattern (011 for Surface 12, etc.)
4. **Documentation consistency**: Resolves the spec.md inconsistency by aligning the "11 thematic wrappers" claim with actual numbering
5. **First-principles purity**: Aligns with iteration-044's first-principles domain decomposition, supporting the theoretical rigor of the restructure

**Cons**:
1. **Massive metadata disruption**: Would require updating graph-metadata.json, description.json, spec.md, resource-map.md, and cross-reference files across 15+ packets, plus all research tracking files that reference packet IDs
2. **Citation breakage**: All existing cross-references to packet IDs (in research iterations, council deliberations, handover docs, etc.) would break and require remediation
3. **Audit marker loss**: The deliberate gap at 006 would be lost, eliminating the audit trail from consolidation passes
4. **Incident response risk**: Renumbering 015-tanstack-security-audit would break security incident response continuity, which is unacceptable for P0 security work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-008.md" lines="84-88" />
5. **Tooling breakage**: Memory system, resource maps, and phase transition automation that depend on packet IDs would require updates and testing
6. **Operational risk**: High probability of missing edge cases in cross-reference updates, leading to broken links and metadata inconsistency

### Recommended approach: Hybrid preservation with taxonomy documentation

**Recommendation: Preserve 026 prefix (Option A) with enhanced taxonomy documentation**

**Rationale**:
1. **Operational safety**: The metadata disruption and citation breakage risks of Option B outweigh the theoretical benefits of taxonomy alignment
2. **Security continuity**: 015-tanstack-security-audit must keep its original prefix for incident response continuity <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-008.md" lines="84-88" />
3. **Audit trail preservation**: The gap at 006 is a deliberate audit marker that should be preserved per spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="141-142" />
4. **Taxonomy clarity without renumbering**: The 11-surface taxonomy can be documented as a conceptual overlay without requiring physical renumbering

**Implementation proposal**:
1. **Keep current 000-015 numbering** for all 15 active children
2. **Add taxonomy mapping table** to 026/spec.md that maps each packet ID to its corresponding Surface 1-11 classification (from iteration-011 findings)
3. **Preserve audit gaps** (004, 006, 010, 011) with enhanced documentation explaining their origin
4. **Update spec.md phase map** to accurately reflect the 15 active children (fixing the "11 thematic wrappers" inconsistency)
5. **Add surface-cross-reference index** in each packet's description.json indicating its 11-surface taxonomy classification
6. **Document consolidation opportunities** in a separate "future taxonomy alignment" section without executing renumbering

**Surface mapping overlay for current packets** (based on iteration-011 analysis):

| Packet ID | Current Name | Surface Classification | Notes |
|-----------|--------------|------------------------|-------|
| 000 | release-cleanup | Surface 11 | Release governance |
| 001 | research-and-baseline | Surface 1 | Direct match |
| 002 | resource-map-deep-loop-fix | Surface 2 | Consolidate with 010 |
| 003 | continuity-memory-runtime | Surface 3 | Consolidate with 005 |
| 005 | memory-indexer-invariants | Surface 3 | Consolidate with 003 |
| 006 | external-project-adoption | Surface 8 | Taxonomy violation (provenance fallacy) |
| 007 | code-graph | Surface 5 | Direct match |
| 008 | skill-advisor | Surface 6 | Direct match |
| 009 | hook-parity | Surface 7 | Direct match |
| 010 | template-levels | Surface 2 | Consolidate with 002 |
| 011 | cocoindex-daemon-resilience | Surface 4 | Consolidate with 014 |
| 012 | causal-graph-channel-routing | Surface 8 | Direct match |
| 013 | doctor-update-orchestrator | Surface 9 | Direct match |
| 014 | local-embeddings-migration | Surface 4 | Consolidate with 011 |
| 015 | tanstack-security-audit | Surface 11 | Cross-cutting assurance |

### Cost-benefit summary

| Dimension | Option A (Preserve) | Option B (Renumber) |
|-----------|---------------------|---------------------|
| **Operational risk** | Low (minimal changes) | High (massive metadata updates) |
| **Taxonomy clarity** | Medium (requires documentation overlay) | High (direct ID-to-surface mapping) |
| **Security continuity** | Preserved (015 keeps prefix) | Broken (015 would renumber) |
| **Audit trail** | Preserved (gap at 006) | Lost (gap eliminated) |
| **Implementation cost** | Low (documentation updates) | High (metadata synchronization) |
| **Future extensibility** | Medium (extend beyond 015) | High (clean 000-010 pattern) |

## Gaps for next iter

1. **Taxonomy documentation format**: Design the schema for the taxonomy mapping table to be added to 026/spec.md (JSON vs. Markdown table vs. YAML frontmatter)

2. **Surface-cross-reference field**: Determine the correct field name and format for adding surface classification to description.json files (e.g., `surface_classification`, `taxonomy_surface`, `domain_surface`)

3. **Consolidation execution plan**: If the consolidation opportunities from iteration-011 are pursued (002+010, 003+005, 011+014), determine whether consolidation should preserve the lower prefix or create new consolidated packets

4. **Taxonomy violation remediation**: For packets 006 and 011 that violate the taxonomy, decide whether to rename/reclassify or document as exceptions

5. **Missing surface investigation**: Determine if Surface 10 (extraction and package boundaries) should be created as a new top-level packet or documented as nested under existing parents

6. **Spec.md phase map fix**: Update the spec.md phase map to accurately reflect 15 active children instead of the inconsistent "11 thematic wrappers" claim

## JSONL delta row

```json
{"iter_id": "012", "timestamp_utc": "2026-05-16T06:12:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 6, "status": "complete", "findings_count": 6, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-011.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-008.md"]}
```