I'm in read-only mode as specified in the task. Here is the iteration-039.md content for you to save manually:

```markdown
# Iter 039 — Track 10: parent doc layout

## Question / Evidence / Findings

### Current organization gaps

**spec.md gaps:**
- **Phase sequence buried in table format** — The "PHASE DOCUMENTATION MAP" section (lines 106-122) lists 11 wrappers in a table with "Folder | Theme | Notes" columns, but this doesn't emphasize the execution sequence or priority. The table format makes it hard to scan "where should I start?" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="106-122" />
- **Stale phase count** — The spec.md still references "10-wrapper active surface" (line 44, line 83) but the target-state proposal from iter 035-038 proposes 11 phases (after reclassification). The spec.md is out of sync with the research target state. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" line="44" />
- **No resume/search guidance** — There's no explicit section answering "where do I resume?" or "which phase handles X domain?" The "Phase Handoff Criteria" (lines 143-152) describes dependencies but doesn't provide entry-point guidance for common resume scenarios. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="143-152" />
- **Abstract state model** — The "Current State Model" (lines 124-133) defines abstract states (implemented, narrowed, reopened, still-open) but doesn't map these to specific phases, making it hard to use for resume prioritization. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="124-133" />
- **Historical narrative dominates** — The Executive Summary (lines 42-48) focuses on consolidation history (29→9→10 wrappers) rather than the current phase sequence and domain coverage. This prioritizes archival narrative over actionable navigation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="42-48" />

**resource-map.md gaps:**
- **Incorrect child count** — The summary claims "12 children" (line 32) but graph-metadata.json shows 20 children (lines 6-25). This discrepancy suggests the resource map is stale and doesn't reflect the current filesystem state. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md" line="32" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="6-25" />
- **Artifact-type organization** — The resource map is organized by artifact type (Documents, Specs, Config) rather than by phase or domain. This makes it hard to answer "which phase owns this artifact?" or "show me all artifacts for Phase 4". <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md" lines="42-107" />
- **No phase cross-reference** — There's no mapping between resource paths and their owning phases. A user searching for "code graph upgrade" cannot easily find that this belongs to Phase 4 (007-code-graph). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md" lines="42-107" />
- **Stub sections dominate** — Sections 4-13 (Agents, Author Instructions, Commands, Meta, READMEs, Scripts, Skills, Tests, WHEN TO USE THIS TEMPLATE) are all stubs with "TODO: backfill with real content" (lines 127-195). This suggests the resource map is incomplete and not a reliable navigation aid. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md" lines="127-195" />

**graph-metadata.json gaps:**
- **last_active_child_id is not resume-optimal** — The `derived.last_active_child_id` points to `015-global-security-sweep-and-supply-chain-audit` (line 159), which is a security audit packet, not the most likely resume target for most users. Resume should prioritize active implementation phases (e.g., Phase 1 Research, Phase 2 Runtime/Memory). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" line="159" />
- **No phase sequence field** — There's no `derived.phase_sequence` array to encode the execution order (Phase 1 → Phase 2 → ... → Phase 11). Resume logic cannot infer the correct sequence without this explicit ordering. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- **No search keyword mapping** — There's no `derived.search_keywords_by_phase` object to map common search queries (e.g., "memory", "code graph", "hook parity") to their owning phases. Search tools must rely on generic `key_topics` which don't include the new phase names from iter 035. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="44-57" />
- **No phase parent flag** — There's no `derived.phase_parent_flag` to distinguish phase parents (e.g., 007-code-graph, 008-skill-advisor) from leaf packets. Graph traversal cannot determine which children are phase parents without filesystem inspection. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />
- **No resume priority field** — There's no `derived.resume_priority` array to order children by likelihood of being the correct resume target. Resume logic defaults to `last_active_child_id` which may not be optimal. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" lines="33-161" />

### Proposed 026/spec.md structure

- **Section 1: QUICK START (new)** — One-paragraph "where to start" guidance with 3 common resume scenarios (new to 026, resuming after break, searching for specific domain). This addresses the gap of no resume/search entry-point guidance.
- **Section 2: PHASE SEQUENCE (new)** — Ordered list of 11 phases with one-line descriptions, not a table. Emphasizes execution order and domain coverage. Replaces the buried table format in the current "PHASE DOCUMENTATION MAP".
- **Section 3: PHASE DOMAIN MAP (new)** — Maps common search keywords to phases (e.g., "memory" → Phase 2, "code graph" → Phase 4, "hook parity" → Phase 6). Enables search-to-phase routing.
- **Section 4: RESUME SCENARIOS (new)** — 3-5 common resume scenarios with recommended phase entry points (e.g., "resuming memory work" → Phase 2, "resuming code graph" → Phase 4). Provides explicit resume guidance.
- **Section 5: EXECUTIVE SUMMARY (keep, move down)** — Historical consolidation narrative (29→9→10 wrappers) moved after the actionable sections. Preserves archival context but doesn't dominate navigation.
- **Section 6: METADATA (keep)** — Standard spec metadata fields.
- **Section 7: PROBLEM & PURPOSE (keep)** — Problem statement and purpose.
- **Section 8: SCOPE (keep)** — In/out scope and files to change.
- **Section 9: PHASE DOCUMENTATION MAP (keep, refactor)** — Detailed phase table moved after the high-level sequence. Now serves as detailed reference rather than primary navigation.
- **Section 10: Current State Model (keep)** — Abstract state definitions.
- **Section 11: Phase Transition Rules (keep)** — Dependency rules.
- **Section 12: Phase Handoff Criteria (keep)** — Handoff verification.
- **Section 13: REQUIREMENTS (keep)** — P0/P1 requirements.
- **Section 14: Acceptance Scenarios (keep)** — Acceptance test scenarios.
- **Section 15: SUCCESS CRITERIA (keep)** — Success criteria.
- **Section 16: RISKS & DEPENDENCIES (keep)** — Risk matrix.
- **Section 17: NON-FUNCTIONAL REQUIREMENTS (keep)** — NFRs.
- **Section 18: EDGE CASES (keep)** — Edge cases.
- **Section 19: COMPLEXITY ASSESSMENT (keep)** — Complexity scoring.
- **Section 20: RISK MATRIX (keep)** — Risk details.

### Proposed 026/resource-map.md structure

- **Section 1: Summary (keep, update)** — Update child count from 12 to 20 to match graph-metadata.json. Add phase-centric summary (e.g., "11 phases, 5 phase parents with nested children").
- **Section 2: PHASE-TO-ARTIFACT MAP (new)** — Reverse mapping: for each phase, list its key artifacts (spec.md, description.json, graph-metadata.json, child packets). Enables "show me everything for Phase 4" queries.
- **Section 3: DOMAIN-TO-PHASE CROSS-REFERENCE (new)** — Maps domains (memory, code graph, skill advisor, hook parity, etc.) to their owning phases and key artifacts. Bridges search queries to phase-specific resources.
- **Section 4: Documents (keep, refactor)** — Keep artifact-type organization but add "Phase" column to each row. Enables artifact-type queries while maintaining phase cross-reference.
- **Section 5: Specs (keep, refactor)** — Keep artifact-type organization but add "Phase" column to each row.
- **Section 6: Config (keep, refactor)** — Keep artifact-type organization but add "Phase" column to each row.
- **Section 7: Agents (keep, backfill)** — Remove stub, backfill with actual agent references if any.
- **Section 8: Commands (keep, backfill)** — Remove stub, backfill with actual command references if any.
- **Section 9: Meta (keep, backfill)** — Remove stub, backfill with actual meta references if any.
- **Section 10: READMEs (keep, backfill)** — Remove stub, backfill with actual README references if any.
- **Section 11: Scripts (keep, backfill)** — Remove stub, backfill with actual script references if any.
- **Section 12: Skills (keep, backfill)** — Remove stub, backfill with actual skill references if any.
- **Section 13: Tests (keep, backfill)** — Remove stub, backfill with actual test references if any.
- **Section 14: WHEN TO USE THIS TEMPLATE (keep, backfill)** — Remove stub, backfill with actual guidance if relevant.

### Proposed graph-metadata.json derived fields

- **`derived.phase_sequence`** — Array of phase IDs in execution order: `["001-research-and-baseline", "003-continuity-memory-runtime", "006-graph-impact-and-affordance-uplift", "007-code-graph", "008-skill-advisor", "009-hook-parity", "011-cocoindex-daemon-resilience", "012-causal-graph-channel-routing", "013-doctor-update-orchestrator", "014-local-embeddings-setup-a", "015-tanstack-security-audit"]`. Rationale: Enables resume logic to infer the correct sequence without filesystem inspection.
- **`derived.resume_priority`** — Array of phase IDs ordered by likelihood of being the correct resume target: `["001-research-and-baseline", "003-continuity-memory-runtime", "007-code-graph", "008-skill-advisor", "009-hook-parity", "014-local-embeddings-setup-a", "013-doctor-update-orchestrator", "006-graph-impact-and-affordance-uplift", "011-cocoindex-daemon-resilience", "012-causal-graph-channel-routing", "015-tanstack-security-audit"]`. Rationale: Prioritizes foundational phases (Research, Runtime/Memory) and large subsystems (Code Graph, Skill Advisor) over narrow infrastructure packets.
- **`derived.search_keywords_by_phase`** — Object mapping search keywords to phase IDs: `{"memory": ["003-continuity-memory-runtime", "005-memory-indexer-invariants"], "runtime": ["003-continuity-memory-runtime", "004-runtime-executor-hardening"], "code graph": ["007-code-graph"], "skill advisor": ["008-skill-advisor"], "hook parity": ["009-hook-parity"], "embeddings": ["014-local-embeddings-setup-a"], "doctor": ["013-doctor-update-orchestrator"], "cocoindex": ["011-cocoindex-daemon-resilience"], "causal graph": ["012-causal-graph-channel-routing"], "security": ["015-tanstack-security-audit"], "external project": ["006-graph-impact-and-affordance-uplift"]}`. Rationale: Enables search tools to route queries to the correct phase without semantic search.
- **`derived.phase_parent_flag`** — Boolean array parallel to `children_ids` indicating which children are phase parents: `[true, true, true, true, true, false, true, true, true, true, true, true, true, true, true, false, true, true, true, true]`. Rationale: Enables graph traversal to distinguish phase parents from leaf packets without filesystem inspection.
- **`derived.meta_phase_ids`** — Array of phase IDs that are meta-phases (outside linear sequence): `["000-release-cleanup"]`. Rationale: Enables resume logic to skip meta-phases when presenting the linear phase sequence.
- **`derived.phase_renames`** — Object mapping old names to new names per iter 033: `{"002-resource-map-template": "002-resource-map-and-deep-loop-fix", "006-graph-impact-and-affordance-uplift": "006-external-project-adoption", "014-local-llama-cpp": "014-local-embeddings-setup-a", "015-global-security-sweep-and-supply-chain-audit": "015-tanstack-security-audit"}`. Rationale: Enables search tools to handle old and new phase names gracefully during transition.

## Gaps / JSONL delta row

### Gaps for next iteration
- Need to verify that the proposed `derived.phase_sequence` matches the dependency rules in spec.md "Phase Handoff Criteria"
- Need to validate that the proposed `derived.resume_priority` ordering reflects actual usage patterns (may need telemetry or manual review)
- Should confirm that the proposed `derived.search_keywords_by_phase` covers all likely search queries for the 026 domain
- Need to update the resource-map.md child count from 12 to 20 and backfill stub sections before proposing the restructure
- Should verify that the proposed spec.md section ordering doesn't break existing tooling that expects specific section anchors

### JSONL delta row

```json
{"iter_id": "039", "timestamp_utc": "2026-05-16T03:41:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 10, "status": "complete", "spec_md_gaps_identified": 5, "resource_map_md_gaps_identified": 4, "graph_metadata_json_gaps_identified": 5, "proposed_spec_sections": 20, "proposed_resource_map_sections": 14, "proposed_derived_fields": 6, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-038.md"]}
```
```

Please also append the following JSONL row to `research/deep-research-state.jsonl`:

```json
{"iter_id": "039", "timestamp_utc": "2026-05-16T03:41:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 10, "status": "complete", "spec_md_gaps_identified": 5, "resource_map_md_gaps_identified": 4, "graph_metadata_json_gaps_identified": 5, "proposed_spec_sections": 20, "proposed_resource_map_sections": 14, "proposed_derived_fields": 6, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-038.md"]}
```
