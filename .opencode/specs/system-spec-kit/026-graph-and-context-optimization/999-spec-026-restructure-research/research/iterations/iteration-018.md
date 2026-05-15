I'm in read-only mode. Let me provide the iteration-018.md content and JSONL entry for manual application.

---

## Iteration 018 Output

The iteration-018.md file should be written to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-018.md`

### Content:

```markdown
---

# Iteration 018 — Track 4 (007-code-graph deep-read) — Consolidated Phase-List Proposal

**Date:** 2026-05-15
**Track:** 4 (007-code-graph deep-read)
**Research Question:** For `026/007-code-graph/` post-restructure: phase list? per-phase fields? deletes? reduction?

---

## 1. Synthesis: Keep / Merge / Delete

Based on iterations 015 (catalog), 016 (classification), and 017 (overlap detection):

### Keep (16 packets)
**Rationale:** Load-bearing siblings solving distinct problems with ongoing value. No later packet supersedes their work.

**Group A: Early Code Graph Core (8 packets)**
- 001-code-graph-upgrades
- 003-code-graph-context-and-scan-scope
- 004-code-graph-hook-improvements
- 005-code-graph-advisor-refinement
- 006-code-graph-doctor-command
- 007-code-graph-resilience-research
- 008-code-graph-backend-resilience
- 009-end-user-scope-default

**Group B: Meta-Research and Scope Expansion (4 packets)**
- 010-fix-iteration-quality-meta-research
- 011-broader-scope-excludes-and-granular-skills
- 012-real-world-usefulness-test
- 013-doctor-apply-mode-phase-b

**Group C: Extraction Phase (3 packets)**
- 014-system-code-graph-extraction
- 015-design-and-decision-record
- 021-mcp-topology-pivot

**Group D: Final Polish and Integration (1 packet)**
- 040-three-way-isolation-finalize

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="208-236" />

### Merge (6 packets)
**Rationale:** Implementation superseded by later work; consolidate as historical context.

**Merge 002 → 014:**
- 002-code-graph-self-contained-package (partial migration, superseded by 014 full extraction)

**Merge 016-020 → 014:**
- 016-scaffold-skill (scaffold now part of live skill)
- 017-physical-move-and-database (move completed, now part of live skill)
- 018-rewire-consumers-and-tool-registration (rewire completed, now part of live skill)
- 019-doc-and-runtime-migration (doc migration completed, now part of live docs)
- 020-validation-and-cleanup (validation completed, now part of live skill verification)

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="34-111" />

### Delete (18 packets)
**Rationale:** Transient cleanup problems solved; deep review quality gates passed; packets serve as historical record only.

**Post-Extraction Cleanup (9 packets):**
- 022-orphan-code-graph-db-cleanup
- 023-tsconfig-references-restructure
- 024-mcp-tool-rename-mk-code-index
- 025-skill-docs-sk-doc-alignment
- 026-system-spec-kit-codegraph-residue-audit
- 027-readmes-update
- 028-architecture-md
- 029-public-readme-update
- 030-manual-testing-verification

**Deep Review Campaign Artifacts (4 packets):**
- 031-deep-review-campaign-010-016
- 032-deep-review-remediation
- 033-deferred-fix-followup
- 034-mcp-namespace-operational-sweep

**Comprehensive Deep Review Artifacts (3 packets):**
- 037-system-code-graph-comprehensive-deep-review
- 038-system-code-graph-deep-review-remediation
- 039-system-code-graph-deferred-followon

**Final Polish Documentation (1 packet):**
- 035-code-folder-readmes

**CLI Devin Integration (1 packet):**
- 036-cli-devin-code-graph-hook

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="116-205" />

---

## 2. Proposed Phase List

**Total Phases:** 7
**Fields per phase:** id, name, description, packet_ids, status

### Phase 001: Foundational Code Graph Capability
**id:** 001
**name:** Foundational Code Graph Capability
**description:** Build foundational code-graph subsystem including detector provenance, blast-radius correctness, edge enrichment, hook integration, doctor command surface, resilience research, backend hardening, and end-user scope defaults.
**packet_ids:** [001, 003, 004, 005, 006, 007, 008, 009]
**status:** complete

### Phase 002: Quality Meta-Research and Scope Expansion
**id:** 002
**name:** Quality Meta-Research and Scope Expansion
**description:** Investigate fix iteration quality guardrails, expand default excludes to broader .opencode folders, implement granular skill selection, define real-world usefulness test framework, and complete doctor apply-mode phase B.
**packet_ids:** [010, 011, 012, 013]
**status:** complete

### Phase 003: System Code Graph Extraction
**id:** 003
**name:** System Code Graph Extraction
**description:** Extract code-graph subsystem from system-spec-kit into standalone `.opencode/skills/system-code-graph/` skill. Includes design research (ADR-001), physical move, consumer rewire, doc migration, validation, and ADR-002 standalone MCP topology pivot. Consolidates 002, 016-020 as historical context.
**packet_ids:** [014, 015, 021]
**status:** complete

### Phase 004: Isolation Finalization
**id:** 004
**name:** Isolation Finalization
**description:** Complete three-way isolation such that system-spec-kit can be deleted without breaking system-code-graph or system-skill-advisor. Duplicate symbols locally, drop @spec-kit/shared dependency, verify cross-skill independence.
**packet_ids:** [040]
**status:** in_progress

### Phase 005: Archive — Post-Extraction Cleanup
**id:** 005
**name:** Archive — Post-Extraction Cleanup
**description:** Historical archive of one-off cleanup operations after extraction: DB cleanup, tsconfig restructure, tool rename, doc alignment, residue audit, README updates, architecture doc, public README, testing verification. Problems solved; packets preserved as audit trail.
**packet_ids:** [022, 023, 024, 025, 026, 027, 028, 029, 030]
**status:** archived

### Phase 006: Archive — Deep Review Campaigns
**id:** 006
**name:** Archive — Deep Review Campaigns
**description:** Historical archive of deep review quality gates on extraction packets 010-016: review campaign, remediation, deferred followon, operational sweep. Quality gate passed; findings resolved. Preserved as historical record.
**packet_ids:** [031, 032, 033, 034]
**status:** archived

### Phase 007: Archive — Comprehensive Deep Review
**id:** 007
**name:** Archive — Comprehensive Deep Review
**description:** Historical archive of comprehensive deep review quality gate on extracted system-code-graph skill: comprehensive review, remediation, deferred followon, CLI Devin hook integration. Quality gate passed; findings resolved. Preserved as historical record.
**packet_ids:** [035, 036, 037, 038, 039]
**status:** archived

---

## 3. Reduction Count

**Current State:**
- Total packets: 40
- Direct children under 007-code-graph: 40

**Proposed State:**
- Active phases: 4 (001-004)
- Archive phases: 3 (005-007)
- Active packets: 16 (load-bearing)
- Archived packets: 18 (cleanup + review artifacts)
- Merged packets: 6 (002, 016-020 consolidated into phase 003)

**Reduction:**
- Direct children reduction: 40 → 7 phases (82.5% reduction)
- Active surface reduction: 40 → 16 packets (60% reduction)
- Archive consolidation: 18 packets → 3 archive phases (83.3% consolidation)

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="241-256" />

---

## 4. Phase Rationale

### Phase 001: Foundational Code Graph Capability
**Rationale:** Group A (001-009) represents foundational code-graph capability building before extraction. All packets are load-bearing with distinct, ongoing value. No consolidation opportunity. Consolidated into single phase to capture early narrative arc.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="24-97" />

### Phase 002: Quality Meta-Research and Scope Expansion
**Rationale:** Group B (010-013) represents quality meta-research and scope expansion. All packets are load-bearing with distinct problems: fix iteration quality, broader excludes, real-world testing, doctor apply-mode. No consolidation opportunity. Consolidated into single phase to capture quality narrative arc.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="100-132" />

### Phase 003: System Code Graph Extraction
**Rationale:** Group C (014, 015, 021) represents the extraction arc. 014 is the main extraction parent; 015 provides ADR-001 historical context; 021 provides ADR-002 standalone MCP topology. Packets 002, 016-020 are merge-candidates consolidated into this phase as historical context. This phase captures the complete extraction narrative.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="84-111" />

### Phase 004: Isolation Finalization
**Rationale:** Packet 040 is load-bearing and in-progress. This is the final step to achieve complete isolation such that system-spec-kit can be deleted without breaking system-code-graph or system-skill-advisor. Kept as separate phase to track critical completion.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="341-348" />

### Phase 005: Archive — Post-Extraction Cleanup
**Rationale:** Packets 022-030 are delete-candidates. These one-off cleanup packets solved transient cleanup problems after extraction. The cleanup is complete; these packets serve as historical audit trail only. Consolidated into single archive phase for preservation.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="116-145" />

### Phase 006: Archive — Deep Review Campaigns
**Rationale:** Packets 031-034 are delete-candidates. The deep review campaigns and their remediations are complete. The review packets document quality gates that have been passed. Consolidated into single archive phase for preservation.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="149-169" />

### Phase 007: Archive — Comprehensive Deep Review
**Rationale:** Packets 035-039 are delete-candidates. The comprehensive deep review and CLI Devin hook integration are complete. These packets document quality gates that have been passed. Consolidated into single archive phase for preservation.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md" lines="172-205" />

---

## 5. Implementation Notes

### Merge Implementation
- **002 → 014:** Add 002 as historical context in 014's spec.md (acknowledgement section already exists at 014 spec.md:94). Remove 002 packet folder.
- **016-020 → 014:** Consolidate 016-020 implementation summaries into 014 as annex sections. Remove individual packet folders after preserving implementation summaries.

### Archive Implementation
- Move all 18 archived packets (022-030, 031-034, 035-039) to `007-code-graph/archive/` subdirectory.
- Preserve remediation evidence (032, 038) as reference within archive.
- Add `archived_children_ids` field to 007's graph-metadata.json to track what was consolidated.

### Graph Metadata Updates
- Remove archived packet IDs from 007's `children_ids` list.
- Add `archived_children_ids` field: [022, 023, 024, 025, 026, 027, 028, 029, 030, 031, 032, 033, 034, 035, 036, 037, 038, 039]
- Add `merged_children_ids` field: [002, 016, 017, 018, 019, 020]

### Documentation Updates
- In 007's parent spec.md, add section explaining which packets were consolidated/archived and why.
- Document phase list in 007's description.json or graph-metadata.json.
- Update handover.md to reflect new phase structure.

---

## 6. Current Child Accounting

**All 40 current children accounted for:**

| Packet | Disposition | Target Phase |
|--------|-------------|--------------|
| 001 | Keep | Phase 001 |
| 002 | Merge → 014 | Phase 003 |
| 003 | Keep | Phase 001 |
| 004 | Keep | Phase 001 |
| 005 | Keep | Phase 001 |
| 006 | Keep | Phase 001 |
| 007 | Keep | Phase 001 |
| 008 | Keep | Phase 001 |
| 009 | Keep | Phase 001 |
| 010 | Keep | Phase 002 |
| 011 | Keep | Phase 002 |
| 012 | Keep | Phase 002 |
| 013 | Keep | Phase 002 |
| 014 | Keep | Phase 003 |
| 015 | Keep | Phase 003 |
| 016 | Merge → 014 | Phase 003 |
| 017 | Merge → 014 | Phase 003 |
| 018 | Merge → 014 | Phase 003 |
| 019 | Merge → 014 | Phase 003 |
| 020 | Merge → 014 | Phase 003 |
| 021 | Keep | Phase 003 |
| 022 | Archive | Phase 005 |
| 023 | Archive | Phase 005 |
| 024 | Archive | Phase 005 |
| 025 | Archive | Phase 005 |
| 026 | Archive | Phase 005 |
| 027 | Archive | Phase 005 |
| 028 | Archive | Phase 005 |
| 029 | Archive | Phase 005 |
| 030 | Archive | Phase 005 |
| 031 | Archive | Phase 006 |
| 032 | Archive | Phase 006 |
| 033 | Archive | Phase 006 |
| 034 | Archive | Phase 006 |
| 035 | Archive | Phase 007 |
| 036 | Archive | Phase 007 |
| 037 | Archive | Phase 007 |
| 038 | Archive | Phase 007 |
| 039 | Archive | Phase 007 |
| 040 | Keep | Phase 004 |

**Total:** 40 packets
**Keep:** 16 packets
**Merge:** 6 packets
**Archive:** 18 packets

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="15-58" />

---

## 7. Verification

**Mapping Verification:**
- Every current child (001-040) accounted for in disposition table ✓
- 5 fields per proposed phase (id, name, description, packet_ids, status) ✓
- Numeric reduction explicit (40→7 phases, 40→16 active packets) ✓

**Evidence Citation:**
- All dispositions cite evidence from iter 015 (catalog), iter 016 (classification), iter 017 (overlap detection) ✓
- Per-phase rationale cites specific file:line references ✓

---

## 8. Next Steps (Track 9)

Track 4 closes here. This consolidated phase-list proposal feeds into Track 9 (implementation planning for 026 restructure).

**Track 9 Input:**
- 7-phase structure for 007-code-graph
- 16 active packets (load-bearing)
- 18 archived packets (cleanup + review artifacts)
- 6 merged packets (consolidated into phase 003)
- Implementation notes for merge/archive/graph-metadata updates

**Track 9 Scope:**
- Apply phase list to 007-code-graph graph-metadata.json
- Execute merge operations (002→014, 016-020→014)
- Execute archive operations (022-030, 031-034, 035-039 → archive/)
- Update graph-metadata with archived_children_ids and merged_children_ids
- Update documentation to reflect new phase structure

---

**JSONL Entry (to append):**

```json
{"iter_id": "018", "timestamp_utc": "2026-05-15T22:57:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 4, "status": "complete", "current_children": 40, "proposed_phases": 7, "active_packets": 16, "archived_packets": 18, "merged_packets": 6, "reduction_percent": 82.5, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md"]}
```
```

### JSONL Entry to Append to `research/deep-research-state.jsonl`:

```json
{"iter_id": "018", "timestamp_utc": "2026-05-15T22:57:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 4, "status": "complete", "current_children": 40, "proposed_phases": 7, "active_packets": 16, "archived_packets": 18, "merged_packets": 6, "reduction_percent": 82.5, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md"]}
```

---

## Summary

**Iteration 018 Complete:**

- **Synthesized keep/merge/delete:** 16 keep, 6 merge, 18 delete based on iter 015-017 findings
- **Proposed 7-phase structure:** 4 active phases (001-004), 3 archive phases (005-007)
- **5 fields per phase:** id, name, description, packet_ids, status
- **Reduction quantified:** 40→7 phases (82.5% reduction), 40→16 active packets (60% reduction)
- **All 40 children accounted for:** Complete disposition table with evidence citations
- **Implementation notes provided:** Merge operations, archive operations, graph-metadata updates
- **Track 4 closure:** Feeds into Track 9 implementation planning

The consolidated phase-list proposal addresses the research question with complete evidence citation from iterations 015, 016, and 017.
