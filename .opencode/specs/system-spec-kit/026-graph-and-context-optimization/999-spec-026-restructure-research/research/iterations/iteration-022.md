I'm in read-only mode as specified in the task. Here is the complete iteration-022.md content for you to save manually:

```markdown
---

# Iteration 022 — Track 5 (009-hook-parity deep-read) — Consolidated Phase-List Proposal

**Date:** 2026-05-15
**Track:** 5 (009-hook-parity deep-read)
**Research Question:** For `026/009-hook-parity/` post-restructure: phase list? per-phase fields? deletes? reduction?

---

## 1. Synthesis: Keep / Merge / Delete

Based on iterations 019 (catalog), 020 (classification), and 021 (overlap detection):

### Keep (6 packets)
**Rationale:** Load-bearing packets solving distinct problems with ongoing value. No merge opportunity due to distinct runtime-specific contracts and verification evidence.

**Group A: Runtime Hook Parity Core (5 packets)**
- 001-hook-parity-remediation
- 002-copilot-hook-parity-remediation
- 003-codex-hook-parity-remediation
- 004-claude-hook-findings-remediation
- 005-opencode-plugin-loader-remediation

**Group B: Documentation Alignment (1 packet)**
- 008-docs-impact-remediation

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="138-147" />

### Merge (2 packets)
**Rationale:** Both packets modify the same file (`.claude/settings.local.json`), both are Level 1, both were reverted then reapplied together, 007 depends on 006. Conservative merge preserves Level 1/Level 3 distinction while consolidating Copilot wrapper integration work.

**Merge 007 → 006:**
- 007-copilot-writer-wiring (absorbed into 006-copilot-wrapper-schema-fix)
- Rationale: Sequential dependency (007 depends on 006), same file modification, both Level 1, both reverted/reapplied together <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md" lines="26-50" />

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md" lines="26-50" />

### Delete (0 packets)
**Rationale:** All 8 packets are load-bearing. No packets are delete candidates per iter 020 classification. Each packet delivers critical runtime fixes or documentation alignment that would regress if deleted.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="152-155" />

---

## 2. Proposed Phase List

**Total Phases:** 3
**Fields per phase:** id, name, description, constituent_children, retained_target

### Phase 001: Runtime Hook Parity Core
**id:** 001
**name:** Runtime Hook Parity Core
**description:** Foundational hook parity remediation across all runtimes (OpenCode, Codex, Copilot, Claude) addressing defects discovered on 2026-04-21/22. Includes general runtime parity (001) and runtime-specific remediations (002-005) for OpenCode plugin bridge, Codex advisor hooks, Copilot startup routing, Claude hook findings, and plugin loader crashes.
**constituent_children:** [001-hook-parity-remediation, 002-copilot-hook-parity-remediation, 003-codex-hook-parity-remediation, 004-claude-hook-findings-remediation, 005-opencode-plugin-loader-remediation]
**retained_target:** 001-hook-parity-remediation (foundational packet, represents completion of core parity arc)

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="38-47" />

### Phase 002: Copilot Wrapper Integration
**id:** 002
**name:** Copilot Wrapper Integration
**description:** Copilot-specific wrapper schema fix and writer wiring for .claude/settings.local.json cross-runtime compatibility. Resolves schema collision between Copilot and Claude (006) and enables per-prompt refresh of managed Copilot context block (007). Both packets were reverted then reapplied together; consolidated into single phase to capture coherent Copilot wrapper integration narrative.
**constituent_children:** [006-copilot-wrapper-schema-fix (merged, absorbs 007-copilot-writer-wiring)]
**retained_target:** 006-copilot-wrapper-schema-fix (rebranded to "copilot-wrapper-integration", represents completion of wrapper integration)

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md" lines="26-50" />

### Phase 003: Documentation Alignment
**id:** 003
**name:** Documentation Alignment
**description:** Documentation impact remediation for hook/daemon parity changes. Aligns 13 documentation files (hook_system.md, SKILL.md, ARCHITECTURE.md, AGENTS.md, install guides, feature catalog, testing playbook) with shipped runtime behavior from packets 001-007. Reconciles docs with changed runtime hook contracts, advisor delivery, plugin-loader semantics, and Copilot wrapper schema.
**constituent_children:** [008-docs-impact-remediation]
**retained_target:** 008-docs-impact-remediation (standalone documentation remediation, represents completion of docs alignment)

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="57-62" />

---

## 3. Reduction Count

**Current State:**
- Total packets: 8
- Direct children under 009-hook-parity: 8 NNN-name directories
- Non-NNN directories: 2 (changelog/, research/)

**Proposed State:**
- Active phases: 3 (001-003)
- Active packets: 7 (001-006, 008)
- Merged packets: 1 (007 absorbed into 006)
- Non-NNN directories: 2 (changelog/, research/ retained)

**Reduction:**
- Direct children reduction: 8 → 3 phases (62.5% reduction)
- Packet reduction: 8 → 7 packets (12.5% reduction)
- Archive consolidation: 0 packets (all load-bearing, no archive phases)

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="15-31" />

---

## 4. Phase Rationale

### Phase 001: Runtime Hook Parity Core
**Rationale:** Group A (001-005) represents the main arc of hook parity remediation across all runtimes. 001 is the foundational general runtime parity packet; 002-005 are runtime-specific remediations that build on it. Each packet addresses distinct runtime-specific contracts (OpenCode, Codex, Copilot, Claude) with specific root causes and verification evidence. No consolidation opportunity; merging would obscure runtime-specific implementation details. Consolidated into single phase to capture the coherent cross-runtime parity narrative.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md" lines="83-113" />

### Phase 002: Copilot Wrapper Integration
**Rationale:** Packets 006 and 007 form a sequential dependency pair addressing Copilot-specific wrapper issues. Both modify `.claude/settings.local.json`, both are Level 1, both were reverted then reapplied together, 007 depends on 006 (schema fix prerequisite). Conservative merge (007 into 006) preserves the Level 1/Level 3 distinction (keeping 002 as Level 3 runtime-specific parity separate from Level 1 wrapper fixes) while consolidating the coherent Copilot wrapper integration narrative. Alternative aggressive merge (006+007 into 002) was considered but rejected to preserve architectural clarity.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md" lines="53-80" />

### Phase 003: Documentation Alignment
**Rationale:** Packet 008 is a standalone documentation remediation packet with clear scope (align docs with shipped behavior). It serves as the cleanup phase of the arc, reconciling documentation with behavioral changes introduced by packets 001-007. Not a merge candidate because it has distinct purpose (documentation alignment) and serves as the final phase of the hook parity remediation narrative.

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="124-135" />

---

## 5. Implementation Notes

### Merge Implementation
- **007 → 006:** Rebrand 006 to "copilot-wrapper-integration", add 007's writer-wiring requirements as Phase 2 of 006, preserve 007's verification evidence in 006's implementation-summary, delete 007 packet folder after merge.
- Update 006 spec.md to reflect consolidated scope (schema fix + writer wiring).
- Update 006 implementation-summary.md to include 007's delivery evidence.

### Graph Metadata Updates
- Remove 007 from 009's `children_ids` list.
- Add `merged_children_ids` field to 009's graph-metadata.json: [007]
- Update 006's graph-metadata.json to reflect merged scope.

### Documentation Updates
- In 009's parent description.json, update to reflect 3-phase structure.
- Document phase list in 009's graph-metadata.json or description.json.
- Update handover.md to reflect new phase structure.

### Status Drift Remediation
- Update parent graph-metadata.json status for 002 (currently in_progress, should be complete per spec.md) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="158-166" />
- Update parent graph-metadata.json status for 005 (currently in_progress, should be complete per spec.md) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md" lines="158-166" />

---

## 6. Current Child Accounting

**All 8 current children accounted for:**

| Packet | Disposition | Target Phase |
|--------|-------------|--------------|
| 001 | Keep | Phase 001 |
| 002 | Keep | Phase 001 |
| 003 | Keep | Phase 001 |
| 004 | Keep | Phase 001 |
| 005 | Keep | Phase 001 |
| 006 | Keep (absorbs 007) | Phase 002 |
| 007 | Merge → 006 | Phase 002 |
| 008 | Keep | Phase 003 |

**Total:** 8 packets
**Keep:** 6 packets (001-006, 008)
**Merge:** 2 packets (007 absorbed into 006)
**Archive:** 0 packets

**Evidence:** <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="15-31" />

---

## 7. Verification

**Mapping Verification:**
- Every current child (001-008) accounted for in disposition table ✓
- 5 fields per proposed phase (id, name, description, constituent_children, retained_target) ✓
- Numeric reduction explicit (8→3 phases, 8→7 packets) ✓

**Evidence Citation:**
- All dispositions cite evidence from iter 019 (catalog), iter 020 (classification), iter 021 (overlap detection) ✓
- Per-phase rationale cites specific file:line references ✓

---

## 8. Next Steps (Track 9)

Track 5 closes here. This consolidated phase-list proposal feeds into Track 9 (implementation planning for 026 restructure).

**Track 9 Input:**
- 3-phase structure for 009-hook-parity
- 7 active packets (load-bearing)
- 1 merged packet (007 absorbed into 006)
- 0 archived packets (all load-bearing)
- Implementation notes for merge operation and status drift remediation

**Track 9 Scope:**
- Apply phase list to 009-hook-parity graph-metadata.json
- Execute merge operation (007→006)
- Update graph-metadata with merged_children_ids
- Remediate status drift for 002 and 005
- Update documentation to reflect new phase structure

---

## JSONL Entry (to append):

```json
{"iter_id": "022", "timestamp_utc": "2026-05-15T23:02:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 5, "status": "complete", "current_children": 8, "proposed_phases": 3, "active_packets": 7, "merged_packets": 1, "archived_packets": 0, "reduction_percent": 62.5, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-020.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-021.md"]}
```
```

**To complete this iteration, please:**
1. Write the above content to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-022.md`
2. Append the JSONL row to `research/deep-research-state.jsonl`
