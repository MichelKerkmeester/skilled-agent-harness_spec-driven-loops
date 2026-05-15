I cannot write files due to read-only mode constraints. Here is the iteration-014.md content as required:

---

# Iteration 014 — Track 3 (013-doctor-update-orchestrator consolidated phase-list proposal)

## Research Question

For `026/013-doctor-update-orchestrator/` post-restructure:

1. Proposed phase list?
2. Each phase: name / description / constituent / rationale / retained-target
3. Deletes?
4. Numeric reduction?

## Evidence

**Step 1: Iter 011 + 012 + 013 output synthesis**
- Iter 011 cataloged 5 NNN-name children under 013-doctor-update-orchestrator/ and identified main arc (004 → 005) as complete <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-011.md" lines="39-53" />
- Iter 012 classified each packet: 001+002 superseded by router arc, 003 remediation complete, 004+005 main arc complete <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md" lines="59-103" />
- Iter 013 identified overlap pair (001 + 002) and proposed merge target, confirmed 004+005 as load-bearing siblings, confirmed 003 as distinct remediation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-013.md" lines="44-112" />

**Step 2: Supersession metadata verification**
- 001 spec.md line 61: "Superseded By ../004-router-phase/ and ../005-cutover-phase/" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md" line="61" />
- 002 spec.md line 68: "Superseded By ../004-router-phase/ and ../005-cutover-phase/" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md" line="68" />
- 001 implementation-summary: "COMPLETE (~95%)" with 34 files delivered <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/implementation-summary.md" lines="1-4" />
- 002 implementation-summary: "COMPLETE (~95%)" with 70+ files delivered <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/implementation-summary.md" lines="1-4" />
- 003 implementation-summary: "complete" with 30 P1 + 28/30 P2 findings resolved <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/implementation-summary.md" line="32" />
- 004 + 005 parent graph-metadata.json status: "complete" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/graph-metadata.json" lines="52-233" />

**Step 3: Two-phase rollout pattern analysis**
- 004 spec.md: Phase 1 additive router alongside legacy commands <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" lines="65-68" />
- 005 spec.md: Phase 2 hard cutover from legacy commands to router-based entrypoints <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" lines="67-70" />
- 004 → 005 dependency: 004 lists 005 as successor, 005 lists 004 as predecessor <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md" line="56" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md" line="57" />

## Findings

### Proposed phase list

| Phase | Name | Description | Constituent (current → proposed) | Rationale | Retained-target |
|-------|------|-------------|----------------------------------|-----------|-----------------|
| **Phase 1** | Doctor Runtime Foundation (Historical) | Original doctor command implementation and validation layer, superseded by router consolidation. Preserved as historical artifact for context. | 001-doctor-commands + 002-sandbox-testing-playbook → 001-doctor-runtime-foundation-historical | Both packets explicitly superseded by 004+005, both ~95% complete, form natural implementation+validation pairing. Merging consolidates superseded work into coherent historical packet while reducing packet count. | Archive as historical artifact; not load-bearing for current runtime surface. |
| **Phase 2** | Doctor Router Consolidation - Phase 1 (Additive) | Additive rollout of router-based doctor command surface alongside legacy commands for validation window. | 004-router-phase → 002-router-phase (renumbered) | Core of router consolidation arc. Ships /doctor router, /doctor:mcp, _routes.yaml, route-validate.sh, cross-runtime mirrors. Additive delivery allows safe validation before hard cutover. | Load-bearing: defines new canonical entrypoints for doctor commands. |
| **Phase 3** | Doctor Router Consolidation - Phase 2 (Cutover) | Hard cutover from 10 legacy /doctor:* commands to 3 router-based entrypoints. Irreversible transition to final state. | 005-cutover-phase → 003-cutover-phase (renumbered) | Completes router consolidation arc. Deletes 9 old .md files + 9 old .toml files, updates playbook/harness invocations, refreshes advisor indices. Two-phase pattern (additive → cutover) is deliberate safety mechanism. | Load-bearing: irreversible transition to final architecture. |
| **Phase 4** | Deep-Review Remediation (Doc Honesty + Security) | Remediation of deep-review CONDITIONAL verdict: doc honesty fixes, security hardening, cross-runtime mirrors. | 003-rm8-013-remediation-doc-honesty-security → 004-remediation-doc-honesty-security (renumbered) | Standalone remediation packet with clear scope. Resolved all 30 P1 + 28/30 P2 findings. Security hardening (flock, cap_drop, narrowed mounts) and cross-runtime mirrors are load-bearing improvements. | Load-bearing: completed remediation with verification evidence. |

### Deletes

**Packet deletions (merged into Phase 1):**
- `001-doctor-commands/` — Merged into `001-doctor-runtime-foundation-historical/`
- `002-sandbox-testing-playbook/` — Merged into `001-doctor-runtime-foundation-historical/`

**Directory deletions (non-NNN):**
- `review/` — Deep-review artifacts can be archived or moved to parent 013 review directory if needed
- `review_archive/` — Archived deep-review from 2026-05-11, can be deleted or moved to parent 013 archive

**Rationale for deletes:**
- 001 + 002 are superseded by the router consolidation arc (004 + 005) and no longer load-bearing
- Merging preserves historical context while reducing packet count from 5 to 4
- Non-NNN directories are operational artifacts that don't need to persist in the restructured phase list

### Numeric reduction

**Current state:**
- 5 NNN-name packets (001, 002, 003, 004, 005)
- 2 non-NNN directories (review/, review_archive/)
- **Total: 7 directories**

**Proposed state:**
- 4 NNN-name packets (001-historical, 002-router-phase, 003-cutover-phase, 004-remediation)
- 0 non-NNN directories (review/ archived or moved, review_archive/ deleted)
- **Total: 4 directories**

**Reduction:**
- NNN-name packets: 5 → 4 (20% reduction)
- Non-NNN directories: 2 → 0 (100% reduction)
- **Overall: 7 → 4 directories (43% reduction)**

### Mapping verification

**Every current child accounted for:**
- ✅ 001-doctor-commands → Merged into Phase 1 (001-doctor-runtime-foundation-historical)
- ✅ 002-sandbox-testing-playbook → Merged into Phase 1 (001-doctor-runtime-foundation-historical)
- ✅ 003-rm8-013-remediation-doc-honesty-security → Renumbered to Phase 4 (004-remediation-doc-honesty-security)
- ✅ 004-router-phase → Renumbered to Phase 2 (002-router-phase)
- ✅ 005-cutover-phase → Renumbered to Phase 3 (003-cutover-phase)
- ✅ review/ → Archived or moved to parent 013
- ✅ review_archive/ → Deleted or moved to parent 013 archive

**All 5 fields per phase populated:**
- ✅ Phase 1: Name, Description, Constituent, Rationale, Retained-target
- ✅ Phase 2: Name, Description, Constituent, Rationale, Retained-target
- ✅ Phase 3: Name, Description, Constituent, Rationale, Retained-target
- ✅ Phase 4: Name, Description, Constituent, Rationale, Retained-target

**Numeric reduction explicit:**
- ✅ 7 → 4 directories (43% reduction)
- ✅ 5 → 4 NNN-name packets (20% reduction)
- ✅ 2 → 0 non-NNN directories (100% reduction)

---

**JSONL row to append:**
```json
{"iter_id": "014", "timestamp_utc": "2026-05-15T20:48:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 3, "status": "complete", "findings_count": 4, "gaps_count": 0, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-011.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-013.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/001-doctor-commands/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-sandbox-testing-playbook/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/implementation-summary.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/004-router-phase/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/005-cutover-phase/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/graph-metadata.json"]}
```
