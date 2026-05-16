I'm in read-only mode as specified in the task. Here is the iteration-040.md content for you to save manually:

```markdown
# Iter 040 — Track 10: sample-query proof points

## Question / Evidence / Findings

### Sample queries

| Query | Current path | Current hops | Proposed path | Proposed hops | Savings |
|-------|--------------|--------------|----------------|----------------|---------|
| "How was hook parity testing built?" | Open 009-hook-parity → scan 8 NNN-name directories → open 001-hook-parity-remediation (contains testing evidence) | 3 hops (parent → scan → target) | Open Phase 6: Hook Parity Remediation → Phase 001: Runtime Hook Parity Core → open 001-hook-parity-remediation | 3 hops (phase → subphase → target) | 0 hops (same) |
| "Where is the code-graph extraction history?" | Open 007-code-graph → scan 40 packets across 7 internal phases → locate extraction packet in Phase 2 or Phase 3 | 4 hops (parent → scan → internal phase → target) | Open Phase 4: Code Graph Capability → Phase 2 or Phase 3 (internal) → locate extraction packet | 3 hops (phase → internal phase → target) | 1 hop saved |
| "How was the resource map template created?" | Open 002-resource-map-template → scan 3 sub-phases → open 002-resource-map-template-creation | 3 hops (parent → scan → target) | Open Phase 1: Research and Baseline → open 002-resource-map-and-deep-loop-fix → scan 3 sub-phases → open 002-resource-map-template-creation | 4 hops (phase → parent → scan → target) | -1 hop (worse) |
| "How was the cli-devin deep-loop iter contract designed?" | Uncertain: could be in 002-resource-map-template (003-deep-loop-integration) or 014-local-embeddings-setup-a (059-deep-loop foundation) → requires opening both → scan 3 sub-phases in 002 or 4 packets in 059 → locate deep-loop contract design | 5-6 hops (uncertain parent → scan → target) | Open Phase 1: Research and Baseline (contains 002 with deep-loop integration) OR Phase 10: Local Embeddings Setup (contains 059 deep-loop foundation) → locate deep-loop contract design | 2-3 hops (phase → target) | 3-4 hops saved |
| "How was the doctor command consolidation done?" | Open 013-doctor-update-orchestrator → scan 5 packets → open consolidation packet | 3 hops (parent → scan → target) | Open Phase 9: Doctor Update Orchestrator → scan 4 internal phases → open consolidation packet | 3 hops (phase → scan → target) | 0 hops (same) |

### Aggregate

- **Total hops saved across 5 queries:** 3 hops (1 + 3 + 4, accounting for the -1 regression on query 3)
- **First-pick correctness improvement:** 40% (2/5 queries have improved first-pick certainty: code-graph extraction and deep-loop contract design)

**Breakdown:**
- Query 1 (hook parity): No change (3 hops both paths) - phase parent structure doesn't improve this lookup
- Query 2 (code-graph extraction): 1 hop saved (4 → 3 hops) - Phase 4 provides clearer top-level entry point
- Query 3 (resource map): 1 hop regression (3 → 4 hops) - Phase 1 adds an extra layer by grouping 001 and 002
- Query 4 (deep-loop contract): 3-4 hops saved (5-6 → 2-3 hops) - Significant improvement because proposed phases clarify where deep-loop work lives (Phase 1 for integration, Phase 10 for methodology)
- Query 5 (doctor consolidation): No change (3 hops both paths) - phase parent structure doesn't improve this lookup

### Conclusion

The proposed restructure improves recall by **reducing search ambiguity for cross-cutting concerns** (deep-loop contract design) and **providing clearer top-level entry points for major subsystems** (code graph extraction). The 40% first-pick correctness improvement comes from queries that were previously uncertain about which parent to open. However, the restructure introduces a regression for queries targeting specific packets that get grouped into broader phases (resource map template), adding an extra navigation layer. The net hop savings (3 across 5 queries) is modest, suggesting the primary benefit is cognitive—reducing uncertainty about where to look rather than dramatically shortening navigation paths.

**Key insight:** The proposed phase structure's main value is in **semantic clustering**—grouping related work under descriptive phase names that make it easier to guess the right starting point. This is most valuable for cross-cutting concerns (deep-loop methodology) and large subsystems (code graph) where the current 22-child flat structure creates uncertainty. For narrowly scoped packets (resource map template), the phase grouping adds navigation overhead without semantic benefit.

## Gaps / JSONL delta row

### Gaps for next iteration
- Sample queries are based on iteration read-throughs; could be validated by simulating actual lookup attempts with a user unfamiliar with 026 structure
- Hop counts are estimates based on described structures; actual user behavior may vary (e.g., users might use search tools instead of manual navigation)
- The analysis assumes users navigate hierarchically; semantic search or code graph tools might change lookup dynamics entirely
- Query 3's regression (resource map) suggests that not all groupings improve recall—may need to evaluate whether Phase 1 should remain split or if 002 should be a standalone phase

### JSONL delta row

```json
{"iter_id": "040", "timestamp_utc": "2026-05-16T03:40:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 10, "status": "final", "sample_queries": 5, "total_hops_saved": 3, "first_pick_correctness_improvement": 0.4, "regressions": 1, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-022.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-010.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-014.md"]}
```
```

Please also append the following JSONL row to `research/deep-research-state.jsonl`:

```json
{"iter_id": "040", "timestamp_utc": "2026-05-16T03:40:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 10, "status": "final", "sample_queries": 5, "total_hops_saved": 3, "first_pick_correctness_improvement": 0.4, "regressions": 1, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-022.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-010.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-014.md"]}
```
