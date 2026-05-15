I'm in read-only mode as specified in the task. Here is the iteration-038.md content for you to save manually:

```markdown
# Iter 038 — Track 9: high-risk merges + mitigation

## Question / Evidence / Findings

### High-risk merges

| Merge | What's lost | Mitigation | Revised outcome |
|-------|-------------|------------|-----------------|
| **Phase 2: 004-runtime-executor-hardening → 003-continuity-memory-runtime** (per iter 002 merge candidate) | The distinct "runtime executor hardening" narrative and its 3 child phases (001-foundational-runtime, 002-sk-deep-cli-runtime-execution, 003-system-hardening) would be absorbed into 003. The phase-parent wrapper structure that preserves the original consolidation artifact (per iter 002:62-66) would be lost. The implementation evidence for these child phases (minimal per iter 002:24) would become harder to trace. | **Preserve-in-decision-record**: Create a decision record in the merged phase documenting the merge rationale, the original 004 structure, and the 3 child phases. Keep the child phase folders as nested children under the merged phase to preserve their individual implementation details. | **Proceed with mitigation** - Merge 004 into 003 but preserve child phase structure and document the merge in a decision record. The merged phase retains the "Runtime and Memory Optimization" scope but acknowledges the consolidation. |
| **Phase 5: 008-skill-advisor internal structure** (missing internal phases per iter 003) | The 26 nested children of 008-skill-advisor (per iter 003:93-120) lack the coherent narrative arc that code graph (7 phases per iter 018) and local embeddings (10 phases per iter 010) have. Without internal phase structure, the skill advisor evolution is harder to understand and execute. The thematic grouping (search/routing, graph, hooks, plugins, standards) loses its execution sequence. | **Split-into-two-merges**: (1) Propose internal phase structure for 008-skill-advisor to match the granularity of other phase parents, based on the lifecycle stages identified in iter 003 (research → implementation → calibration). (2) If internal phases cannot be proposed without deeper analysis, keep as-is with a decision record explaining why internal phases are deferred. | **Proceed with mitigation option 2** - Keep 008-skill-advisor as-is but add a decision record explaining that internal phase structure is deferred pending deeper analysis of the 26 children. The phase parent remains coherent as a thematic grouping. |
| **Phase 11: 015-extracted-skills-isolation** (packet does not exist per iter 036:183) | This phase is based on a packet reference in graph-metadata.json (line 23) that does not exist in the filesystem. If included in the target-state proposal, it would create a phantom phase with no implementation artifacts. The rationale (per iter 037:68-72) is weakened by this discrepancy. | **Abort-this-merge**: Remove Phase 11 from the target-state proposal. Verify whether 015-extracted-skills-isolation is a planned packet (not yet created) or a stale reference. If planned, defer to a future phase; if stale, remove from graph-metadata.json. | **ABORT** - Remove Phase 11 from the target-state proposal. The packet does not exist in the filesystem and cannot be included without verification. This reduces the phase count from 13 to 12. |
| **Phase 13: 000-release-cleanup positioning** (at 000 in graph-metadata.json per iter 037:83) | The phase parent is at 000 (the first child in graph-metadata.json), suggesting it is a meta-phase or pre-existing work that should not be in the linear sequence with other phases. If treated as Phase 13, it creates a false dependency where release cleanup appears to be the final phase when it may be ongoing or pre-existing work. | **Keep-original-spec-as-archive**: Treat 000-release-cleanup as a special case (meta-phase) that exists outside the linear phase sequence. Document it as "pre-existing / ongoing cleanup work" rather than Phase 13. The 2 nested children (014-phase-parent-documentation, 015-mcp-runtime-stress-remediation) remain under 000 but are not part of the target-state phase sequence. | **Proceed with mitigation** - Remove Phase 13 from the linear target-state sequence. Treat 000-release-cleanup as a meta-phase that exists outside the phase proposal. This reduces the phase count from 12 to 11. |

### Aborted merges (if any)

| Merge | Reason to abort | Alternative |
|-------|-----------------|--------------|
| **Phase 11: 015-extracted-skills-isolation** | The packet does not exist in the filesystem (per iter 036:183). Including it in the target-state proposal would create a phantom phase with no implementation artifacts. The graph-metadata.json reference (line 23) may be stale or point to planned work that was never created. | Verify the packet status: (1) If planned but not yet created, defer to a future phase after the packet is created. (2) If stale reference, remove from graph-metadata.json and omit from the target-state proposal. The extracted skills isolation work may be covered under other phases (e.g., Phase 1 research, or as part of the skill advisor extraction work in 008/022-system-skill-advisor-extraction per iter 003:121). |

### Revised phase list summary

- **High-risk merges proceeding with mitigation:** 3 (Phase 2, Phase 5, Phase 13)
- **Aborted merges:** 1 (Phase 11)
- **Net target phase count:** 11 (down from 13 due to Phase 11 abort and Phase 13 reclassification as meta-phase)

**Revised phase sequence:**
1. Phase 1: Research and Baseline
2. Phase 2: Runtime and Memory Optimization (with 004 merged into 003, child phases preserved)
3. Phase 3: External Project Adoption
4. Phase 4: Code Graph Capability
5. Phase 5: Skill Advisor Capability (with decision record deferring internal phases)
6. Phase 6: Hook Parity Remediation
7. Phase 7: CocoIndex Daemon Resilience
8. Phase 8: Causal Graph Channel Routing
9. Phase 9: Doctor Update Orchestrator
10. Phase 10: Local Embeddings Setup
11. Phase 12: TanStack Security Audit (renumbered from 12 to 11)

**Meta-phase (outside linear sequence):**
- 000-release-cleanup: Pre-existing / ongoing cleanup work with 2 nested children (014-phase-parent-documentation, 015-mcp-runtime-stress-remediation)

## Gaps / JSONL delta row

### Gaps for next iteration
- Need to verify the status of 015-extracted-skills-isolation (planned vs. stale reference) and update graph-metadata.json accordingly
- Need to create decision records for Phase 2 (merge rationale) and Phase 5 (deferred internal phases)
- Need to document 000-release-cleanup as a meta-phase outside the linear sequence
- Need to renumber Phase 12 to Phase 11 in the target-state proposal
- Should verify that the cumulative size estimates for phase parents accurately reflect the consolidation work after these mitigations

### JSONL delta row

```json
{"iter_id": "038", "timestamp_utc": "2026-05-15T21:24:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 9, "status": "complete", "high_risk_merges": 3, "aborted_merges": 1, "original_phase_count": 13, "revised_phase_count": 11, "meta_phases": 1, "mitigation_strategies": ["preserve-in-decision-record", "split-into-two-merges", "abort-this-merge", "keep-original-spec-as-archive"], "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-002.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-003.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-036.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-037.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json"]}
```
```

Please also append the following JSONL row to `research/deep-research-state.jsonl`:

```json
{"iter_id": "038", "timestamp_utc": "2026-05-15T21:24:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 9, "status": "complete", "high_risk_merges": 3, "aborted_merges": 1, "original_phase_count": 13, "revised_phase_count": 11, "meta_phases": 1, "mitigation_strategies": ["preserve-in-decision-record", "split-into-two-merges", "abort-this-merge", "keep-original-spec-as-archive"], "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-002.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-003.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-036.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-037.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json"]}
```
