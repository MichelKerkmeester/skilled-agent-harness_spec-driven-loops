Iteration 006 complete. I've successfully:

1. **Applied sequential thinking** with 5 thoughts before producing output
2. **Read prior iterations** (001-005) to understand the 6-phase structure from iteration-005 and the 008-skill-advisor clustering from iteration-004
3. **Analyzed 008 child rehoming** - determined that the "hardening" cluster (007, 009, 010, 011) should NOT be rehomed to Phase 4: Tooling & Hardening because they are skill-advisor-specific, not general tooling
4. **Analyzed M8/M9 rehome targets**:
   - **M8 (010→008)**: NOT RECOMMENDED for 005-skill-references-assets-alignment (system-spec-kit skill documentation ≠ skill-advisor routing system)
   - **M9 (010→013)**: RECOMMENDED for 009-rm-8-prompt-hardening (consolidates RM-8 security work; 013 already has RM-8 remediation child; Phase 4 appropriate for hardening)
5. **Cited all claims** with 8 file:line citations using `<ref_file>` tags
6. **Identified 6 gaps** for the next iteration including child numbering, metadata updates, dependency validation, and cross-reference updates
7. **Appended JSONL delta row** with required fields

**Key findings**: 
- 008-skill-advisor children are appropriately classified and should remain in Phase 2: Core Systems
- M9 rehome of 009-rm-8-prompt-hardening to 013-doctor-update-orchestrator is recommended to consolidate RM-8 security work
- M8 rehome of 005-skill-references-assets-alignment to 008-skill-advisor is not recommended due to scope mismatch

Output written to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-006.md`
y/spec.md" lines="1-75" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/spec.md" lines="31-113" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/009-skill-advisor-plugin-hardening/spec.md" lines="30-90" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/010-skill-advisor-standards-alignment/spec.md" lines="30-80" />

## Findings

### 008 child rehoming proposal after sub-phase definition

Based on the 6-phase structure established in iteration-005, 008-skill-advisor resides in **Phase 2: Core Systems** alongside 005-memory-indexer-invariants and 007-code-graph <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="73-85" />. Iteration-004 clustered the 26 children of 008-skill-advisor into 5 topic categories, including a "hardening" cluster (4 packets: 007, 009, 010, 011) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-004.md" lines="124-131" />.

**Analysis of hardening cluster for potential rehoming to Phase 4: Tooling & Hardening:**

1. **007-skill-advisor-hook-surface**: Proactive skill-advisor integration across all CLI runtimes via hook infrastructure. This is core skill-advisor functionality, not general tooling <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/spec.md" lines="31-52" />.

2. **009-skill-advisor-plugin-hardening**: Plugin-specific hardening (per-instance state, in-flight dedup, size caps) for the skill-advisor plugin. This is skill-advisor-specific, not general tooling <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/009-skill-advisor-plugin-hardening/spec.md" lines="30-44" />.

3. **010-skill-advisor-standards-alignment**: Standards alignment for the skill-advisor plugin (ESM exemption, JSDoc, code style). This is skill-advisor-specific, not general tooling <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/010-skill-advisor-standards-alignment/spec.md" lines="30-53" />.

**Proposal: NO REHOMING recommended for 008-skill-advisor children.**

The "hardening" cluster children are skill-advisor-specific hardening items that belong in Phase 2: Core Systems with the rest of 008-skill-advisor. They are not general tooling/hardening that would apply across the codebase (which is the focus of Phase 4: Tooling & Hardening). The current classification from iteration-004 and phase assignment from iteration-005 are appropriate.

### 010-template-levels rehome targets (M8/M9)

Per the 998 spec.md, M8 and M9 are LOW_PRIORITY items from iter 045:
- **M8 (010→008)**: Move 010-template-levels children to 008-skill-advisor <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md" lines="70-71" />
- **M9 (010→013)**: Move 010-template-levels children to 013-doctor-update-orchestrator <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md" lines="70-71" />

#### M8 (010→008) analysis: 005-skill-references-assets-alignment

**Candidate packet**: 010-template-levels/005-skill-references-assets-alignment

**Description**: Audits the AI-facing system-spec-kit skill documentation surface (SKILL.md, references/, assets/) for alignment with the manifest-backed template and validation system <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment/spec.md" lines="1-42" />.

**Assessment**: NOT RECOMMENDED for rehoming to 008-skill-advisor.

**Rationale**: 
- This packet is about the system-spec-kit skill's documentation (SKILL.md, references/, assets/), not the skill-advisor routing system
- 008-skill-advisor is about the advisor routing/scoring infrastructure that recommends skills to agents
- The system-spec-kit skill is a completely different component from the skill-advisor system
- This packet belongs in 010-template-levels as it's about template system documentation alignment post-003/004 template rework

#### M9 (010→013) analysis: 009-rm-8-prompt-hardening

**Candidate packet**: 010-template-levels/009-rm-8-prompt-hardening

**Description**: Hardens the deep-review iteration prompt template to prevent destructive scope violations by adding explicit allowed-write list and banning destructive shell verbs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/009-rm-8-prompt-hardening/spec.md" lines="31-67" />.

**Assessment**: RECOMMENDED for rehoming to 013-doctor-update-orchestrator.

**Rationale**:
- 013-doctor-update-orchestrator already has child 003-rm8-013-remediation-doc-honesty-security which addresses RM-8 findings for the doctor commands <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/spec.md" lines="31-60" />
- Both 010/009 and 013/003 are RM-8 related work (prompt hardening vs. command remediation)
- Consolidating RM-8 work under 013 creates a logical home for security/hardening remediation efforts
- 010-template-levels is primarily about template system architecture (001-003 core phases), with 004-009 as followups. RM-8 prompt hardening is security work, not template architecture
- 013-doctor-update-orchestrator is in Phase 4: Tooling & Hardening per iteration-005, which is the appropriate phase for security/hardening work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="99-111" />

**Proposed rehome**: Move 010-template-levels/009-rm-8-prompt-hardening → 013-doctor-update-orchestrator/006-rm-8-prompt-hardening (next available child number)

### Summary of rehoming recommendations

| Move ID | Source | Target | Recommendation | Rationale |
|---------|--------|--------|----------------|-----------|
| M8 | 010-template-levels/005-skill-references-assets-alignment | 008-skill-advisor | **NOT RECOMMENDED** | System-spec-kit skill documentation ≠ skill-advisor routing system |
| M9 | 010-template-levels/009-rm-8-prompt-hardening | 013-doctor-update-orchestrator | **RECOMMENDED** | Consolidates RM-8 security work; 013 already has RM-8 remediation child; Phase 4 appropriate for hardening |

## Gaps for next iter

1. **013 child numbering**: If M9 rehome proceeds, determine the correct child number for 009-rm-8-prompt-hardening under 013 (currently 013 has children 001, 003, 004, 005; need to determine if 002 exists or should be renumbered)
2. **010-template-levels parent metadata**: If 009 is rehomed, update 010-template-levels/graph-metadata.json and phase documentation map to reflect the removal
3. **013 parent metadata**: If 009 is rehomed, update 013-doctor-update-orchestrator/graph-metadata.json to include the new child
4. **Dependency validation**: Verify that 009-rm-8-prompt-hardening has no dependencies on other 010-template-levels children that would break after rehoming
5. **Cross-reference updates**: Identify any cross-references to 010-template-levels/009 in other packets that would need updating after rehoming
6. **Phase parent validation**: Validate that both 010-template-levels and 013-doctor-update-orchestrator remain coherent phase parents after the proposed rehome

## JSONL delta row

```json
{"iter_id": "006", "timestamp_utc": "2026-05-16T06:04:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 2, "status": "complete", "findings_count": 3, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-004.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/009-rm-8-prompt-hardening/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security/spec.md"]}
```