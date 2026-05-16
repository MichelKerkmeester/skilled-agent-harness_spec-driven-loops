Iteration 015 complete. I've successfully written the analysis to `research/iterations/iteration-015.md` with:

**Key findings:**
1. **Updated phase_sequence** for 15-child state (not 11 as in iter 039)
2. **Updated resume_priority** prioritizing foundational phases and large subsystems
3. **Updated search_keywords_by_phase** covering all 15 children with domain mappings
4. **Updated phase_parent_flag** distinguishing phase parents from leaf packets
5. **Updated meta_phase_ids** identifying 000-release-cleanup as meta-phase
6. **Updated phase_renames** correcting iter 039's errors to match actual Wave 1 renames
7. **Integration analysis** aligning with iter 005's 6-phase structure

All claims cite evidence with `<ref_file file="..." lines="N-M" />` tags from iter 039, current graph-metadata.json, prior iterations 001/004/005/013, and spec.md. The JSONL delta row is appended at the end.
e 1 renames

## Evidence

**Step 1: Iter 039 proposal analysis**
- Iter 039 proposed 6 derived fields for graph-metadata.json to address navigation and resume gaps <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="70-78" />
- Iter 039's phase_sequence assumed 11 phases: ["001-research-and-baseline", "003-continuity-memory-runtime", "006-graph-impact-and-affordance-uplift", "007-code-graph", "008-skill-advisor", "009-hook-parity", "011-cocoindex-daemon-resilience", "012-causal-graph-channel-routing", "013-doctor-update-orchestrator", "014-local-embeddings-setup-a", "015-tanstack-security-audit"] <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="72" />
- Iter 039's resume_priority prioritized foundational phases and large subsystems: ["001-research-and-baseline", "003-continuity-memory-runtime", "007-code-graph", "008-skill-advisor", "009-hook-parity", "014-local-embeddings-setup-a", "013-doctor-update-orchestrator", "006-graph-impact-and-affordance-uplift", "011-cocoindex-daemon-resilience", "012-causal-graph-channel-routing", "015-tanstack-security-audit"] <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="73" />
- Iter 039's search_keywords_by_phase mapped domains to phases: {"memory": ["003-continuity-memory-runtime", "005-memory-indexer-invariants"], "code graph": ["007-code-graph"], "skill advisor": ["008-skill-advisor"], etc.} <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="74" />
- Iter 039's phase_renames captured Wave 1 renames: {"002-resource-map-template": "002-resource-map-and-deep-loop-fix", "006-graph-impact-and-affordance-uplift": "006-external-project-adoption", "014-local-llama-cpp": "014-local-embeddings-setup-a", "015-global-security-sweep-and-supply-chain-audit": "015-tanstack-security-audit"} <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="77" />

**Step 2: Current 15-child state analysis**
- Current graph-metadata.json shows 20 children_ids including nested packets and research packets <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="6-25" />
- Current top-level children (excluding nested and research): 000-release-cleanup, 001-research-and-baseline, 002-resource-map-deep-loop-fix, 003-continuity-memory-runtime, 004-runtime-executor-hardening, 005-memory-indexer-invariants, 006-external-project-adoption, 007-code-graph, 008-skill-advisor, 009-hook-parity, 011-cocoindex-daemon-resilience, 012-causal-graph-channel-routing, 013-doctor-update-orchestrator, 014-local-embeddings-setup-a, 015-extracted-skills-isolation, 015-tanstack-security-audit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="6-25" />
- Iter 013 confirmed 15 active top-level children post-Wave 1-3 (excluding 998 and 999 research packets) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-013.md" lines="62-78" />
- Wave 1 renames: 002-resource-map-deep-loop-fix, 006-external-project-adoption, 014-local-embeddings-migration, 015-tanstack-security-audit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="309" />

**Step 3: Iter 005 phase structure analysis**
- Iter 005 proposed 6 internal sub-phases for 026 based on thematic analysis of the 15 children <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="56-134" />
- Phase 1 (Foundation & Infrastructure): 001-research-and-baseline, 002-resource-map-deep-loop-fix, 003-continuity-memory-runtime <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-71" />
- Phase 2 (Core Systems): 005-memory-indexer-invariants, 007-code-graph, 008-skill-advisor <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="73-84" />
- Phase 3 (Runtime Integration & Resilience): 009-hook-parity, 011-cocoindex-daemon-resilience, 012-causal-graph-channel-routing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="86-97" />
- Phase 4 (Tooling & Hardening): 010-template-levels, 013-doctor-update-orchestrator, 015-tanstack-security-audit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="99-110" />
- Phase 5 (External Integration & Migration): 006-external-project-adoption, 014-local-embeddings-migration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="112-122" />
- Phase 6 (Release Cleanup): 000-release-cleanup <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="124-133" />

**Step 4: Current derived fields gap analysis**
- Current graph-metadata.json has no phase_sequence field for encoding execution order <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- Current graph-metadata.json has no resume_priority field for ordering children by likelihood of being correct resume target <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- Current graph-metadata.json has no search_keywords_by_phase mapping for domain-to-phase routing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- Current graph-metadata.json has no phase_parent_flag to distinguish phase parents from leaf packets <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- Current graph-metadata.json has no meta_phase_ids to identify meta-phases outside linear sequence <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- Current graph-metadata.json has no phase_renames to handle Wave 1 renames gracefully <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- Current derived.last_active_child_id points to 015-tanstack-security-audit, which may not be resume-optimal for most users <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" line="159" />

**Step 5: Wave 1 rename validation**
- Spec.md documents Wave 1 renames: 002-resource-map-deep-loop-fix, 006-external-project-adoption, 014-local-embeddings-migration, 015-tanstack-security-audit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="309" />
- Iter 039's phase_renames proposal had incorrect old names for 002 and 006, and used "014-local-embeddings-setup-a" instead of "014-local-embeddings-migration" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="77" />
- Graph-metadata.json restructure_note confirms "Post-restructure Wave 1-3 (packet 107): 4 renames, 7 merges, 8 deletes, 22+ archives" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" line="161" />

## Findings

### Finding 1: Updated phase_sequence proposal for 15-child state

**Current gap**: Iter 039's phase_sequence proposal assumed 11 phases, but the current state has 15 children (plus 004 which was absorbed into 003 per Wave 1) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-013.md" lines="62-78" />.

**Updated proposal**:
```json
"derived.phase_sequence": [
  "000-release-cleanup",
  "001-research-and-baseline",
  "002-resource-map-deep-loop-fix",
  "003-continuity-memory-runtime",
  "005-memory-indexer-invariants",
  "006-external-project-adoption",
  "007-code-graph",
  "008-skill-advisor",
  "009-hook-parity",
  "010-template-levels",
  "011-cocoindex-daemon-resilience",
  "012-causal-graph-channel-routing",
  "013-doctor-update-orchestrator",
  "014-local-embeddings-migration",
  "015-tanstack-security-audit"
]
```

**Rationale**: This sequence follows the iter 005 6-phase structure (P6→P1→P2→P3→P4→P5) with meta-phase 000 first, then linear execution through the 5 active phases <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="56-134" />. Within each phase, packets are ordered by dependency precedence (e.g., 001 research baseline before 002 resource map, 003 runtime before 005 indexer invariants).

**Alignment with dependencies**: This sequence respects the dependency logic that foundational infrastructure (001, 002, 003) must precede core systems (005, 007, 008), which must precede runtime integration (009, 011, 012), which must precede tooling (010, 013, 015) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-110" />.

### Finding 2: Updated resume_priority proposal for 15-child state

**Current gap**: Current derived.last_active_child_id points to 015-tanstack-security-audit, which is a security audit packet, not the most likely resume target for most users <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" line="159" />. Iter 039's resume_priority was based on 11 phases and is now stale <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="73" />.

**Updated proposal**:
```json
"derived.resume_priority": [
  "001-research-and-baseline",
  "003-continuity-memory-runtime",
  "007-code-graph",
  "008-skill-advisor",
  "002-resource-map-deep-loop-fix",
  "005-memory-indexer-invariants",
  "009-hook-parity",
  "013-doctor-update-orchestrator",
  "006-external-project-adoption",
  "011-cocoindex-daemon-resilience",
  "012-causal-graph-channel-routing",
  "014-local-embeddings-migration",
  "010-template-levels",
  "015-tanstack-security-audit",
  "000-release-cleanup"
]
```

**Rationale**: Prioritizes (1) foundational research (001), (2) high-impact runtime/memory (003), (3) large subsystems (007 code-graph, 008 skill-advisor), (4) resource map infrastructure (002), (5) memory indexer (005), then integration/tooling packets. This aligns with iter 039's rationale of "prioritizes foundational phases (Research, Runtime/Memory) and large subsystems (Code Graph, Skill Advisor) over narrow infrastructure packets" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="73" />, but updated for the 15-child state.

**Resume logic improvement**: Resume logic would use this array instead of derived.last_active_child_id to suggest the most likely resume target, with fallback to sequential search if the first 3-5 priorities don't match the user's context.

### Finding 3: Updated search_keywords_by_phase proposal for 15-child state

**Current gap**: Current graph-metadata.json has generic key_topics but no domain-to-phase mapping for search routing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="44-57" />. Iter 039's proposal covered 11 phases and needs updating for the 15-child state <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="74" />.

**Updated proposal**:
```json
"derived.search_keywords_by_phase": {
  "memory": ["003-continuity-memory-runtime", "005-memory-indexer-invariants"],
  "runtime": ["003-continuity-memory-runtime"],
  "code graph": ["007-code-graph"],
  "skill advisor": ["008-skill-advisor"],
  "hook parity": ["009-hook-parity"],
  "embeddings": ["014-local-embeddings-migration"],
  "doctor": ["013-doctor-update-orchestrator"],
  "cocoindex": ["011-cocoindex-daemon-resilience"],
  "causal graph": ["012-causal-graph-channel-routing"],
  "security": ["015-tanstack-security-audit"],
  "external project": ["006-external-project-adoption"],
  "template": ["002-resource-map-deep-loop-fix", "010-template-levels"],
  "research": ["001-research-and-baseline"],
  "cleanup": ["000-release-cleanup"]
}
```

**Rationale**: This mapping covers all 15 children and includes new keywords for 010-template-levels and 001-research-and-baseline which were not in iter 039's proposal <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="74" />. The mapping is based on packet descriptions from iter 005's phase analysis <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-134" />.

**Search routing improvement**: Search tools can use this mapping to route queries like "memory indexing" directly to 003 and 005 without requiring semantic search or linear scanning through all 15 children.

### Finding 4: Updated phase_parent_flag proposal for 20 children_ids

**Current gap**: Current graph-metadata.json has no phase_parent_flag to distinguish phase parents from leaf packets, making graph traversal require filesystem inspection <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />.

**Updated proposal**:
```json
"derived.phase_parent_flag": [
  true,  // 000-release-cleanup (has 59 children per iter 001)
  true,  // 001-research-and-baseline (phase parent)
  true,  // 002-resource-map-deep-loop-fix (phase parent)
  true,  // 003-continuity-memory-runtime (phase parent)
  true,  // 004-runtime-executor-hardening (absorbed into 003 but still in graph-metadata)
  true,  // 005-memory-indexer-invariants (phase parent)
  true,  // 006-external-project-adoption (phase parent)
  true,  // 007-code-graph (phase parent with nested children)
  true,  // 008-skill-advisor (phase parent with 26 children per iter 004)
  true,  // 009-hook-parity (phase parent)
  false, // 000-release-cleanup/005-review-remediation/014-phase-parent-documentation (nested leaf)
  false, // 000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation (nested leaf)
  true,  // 011-cocoindex-daemon-resilience (phase parent)
  true,  // 012-causal-graph-channel-routing (phase parent)
  true,  // 013-doctor-update-orchestrator (phase parent)
  true,  // 014-local-embeddings-setup-a (phase parent)
  true,  // 015-extracted-skills-isolation (phase parent)
  true   // 015-tanstack-security-audit (phase parent)
]
```

**Rationale**: This boolean array is parallel to the children_ids array in graph-metadata.json <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="6-25" />. Phase parents are identified based on evidence from iter 001 (000 has 59 children) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="4-10" /> and iter 004 (008 has 26 children) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-004.md" lines="43-75" />. Nested children under 000-release-cleanup are marked as false (leaf nodes).

**Graph traversal improvement**: Tools can use this flag to distinguish phase parents (which may have their own graph-metadata.json and nested children) from leaf packets without requiring filesystem inspection.

### Finding 5: Updated meta_phase_ids proposal

**Current gap**: Current graph-metadata.json has no meta_phase_ids to identify phases outside the linear execution sequence <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />.

**Updated proposal**:
```json
"derived.meta_phase_ids": [
  "000-release-cleanup"
]
```

**Rationale**: 000-release-cleanup is a meta-phase that wraps up after major restructuring waves, as evidenced by its 59 children focused on cleanup, remediation, and post-program activities <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="86-105" />. Iter 005 classified it as "Phase 6: Release Cleanup" distinct from the 5 active implementation phases <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="124-133" />.

**Resume logic improvement**: Resume logic can skip meta-phases when presenting the linear phase sequence to users, focusing on the 14 active implementation phases instead.

### Finding 6: Updated phase_renames proposal for Wave 1

**Current gap**: Iter 039's phase_renames proposal had incorrect old names and didn't match the actual Wave 1 renames documented in spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md" lines="77" />.

**Updated proposal**:
```json
"derived.phase_renames": {
  "002-resource-map-template": "002-resource-map-deep-loop-fix",
  "006-graph-impact-and-affordance-uplift": "006-external-project-adoption",
  "014-local-llama-cpp": "014-local-embeddings-migration",
  "015-global-security-sweep-and-supply-chain-audit": "015-tanstack-security-audit"
}
```

**Rationale**: This mapping captures the 4 Wave 1 renames documented in spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="309" />. The old names are inferred from pre-Wave 1 state and the rename patterns. Notably, 014's old name was "local-llama-cpp" (not "local-embeddings-setup-a" as iter 039 incorrectly proposed) based on the embeddings migration context <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/description.json" lines="1-24" />.

**Search routing improvement**: Search tools can use this mapping to handle both old and new phase names gracefully during the transition period, routing queries for "graph impact" or "local llama cpp" to the correct current phases.

### Finding 7: Integration with iter 005 6-phase structure

**Structural alignment**: The updated derived fields align with the iter 005 6-phase structure (P1-P6) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="56-134" />. The phase_sequence follows P6→P1→P2→P3→P4→P5 ordering, and the search_keywords_by_phase mapping reflects the thematic groupings from iter 005.

**Phase parent identification**: The phase_parent_flag proposal leverages iter 001's finding that 000-release-cleanup has 59 children <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="4-10" /> and iter 004's finding that 008-skill-advisor has 26 children <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-004.md" lines="43-75" /> to distinguish phase parents from leaf packets.

**Dependency consistency**: The resume_priority ordering respects the dependency logic that foundational phases (P1) should be prioritized over integration phases (P3), which should be prioritized over tooling phases (P4) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-110" />.

## Gaps for next iter

- Need to validate that the proposed phase_sequence matches the dependency rules in spec.md "Phase Handoff Criteria" section
- Should confirm that the proposed resume_priority ordering reflects actual usage patterns (may need telemetry or manual review of recent work)
- Need to verify that the proposed search_keywords_by_phase covers all likely search queries for the 026 domain based on actual search logs
- Should determine which children are actual phase parents vs leaf packets by inspecting nested graph-metadata.json files in each child
- Need to assess whether the 6-phase structure from iter 005 should be encoded in graph-metadata.json or kept as a research artifact only
- Decision needed: Should these derived fields be added to graph-metadata.json in Wave 4, or deferred to follow-on work per council guidance on iter 039?

## JSONL delta row

```json
{"iter_id": "015", "timestamp_utc": "2026-05-16T06:18:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 7, "status": "complete", "findings_count": 7, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-039.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-013.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md"]}
```