Iteration-007 complete. I've successfully analyzed the 010-template-levels parent retention decision and rehoming targets for children 004, 005, 006, and 009.

**Key findings:**
- **KEEP 010-template-levels as a parent** - it represents a coherent template-system architecture domain with clear narrative arc, distinct from 002-resource-map-deep-loop-fix's infrastructure focus
- **KEEP 004, 005, 006 in 010-template-levels** - these are template-system followup work (validation, documentation alignment, command surface alignment)
- **REHOME 009-rm-8-prompt-hardening to 013-doctor-update-orchestrator** - this is security/hardening work that consolidates with existing RM-8 remediation in 013

The output includes dense file:line citations, a summary table, metadata inconsistency findings, and 6 gaps for the next iteration. The required JSONL delta row has been appended.
de/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/graph-metadata.json" lines="6-13" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/spec.md" lines="44-76" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/004-deferred-followups/spec.md" lines="33-36" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment/spec.md" lines="38-42" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment/spec.md" lines="42-46" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/009-rm-8-prompt-hardening/spec.md" lines="56-68" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/description.json" lines="2-8" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-006.md" lines="62-76" />

## Findings

### Parent retention decision: KEEP 010-template-levels as a parent

**Rationale for keeping 010-template-levels as a parent:**

1. **Domain coherence**: 010-template-levels represents a coherent architectural domain — the spec-kit template-system rework with a clear narrative arc spanning investigation (001), greenfield redesign (002), implementation planning (003), and alignment followups (004-006) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/spec.md" lines="44-52" />. This is a natural phase-parent structure that should be preserved.

2. **Scope mismatch with 002-resource-map-deep-loop-fix**: 002-resource-map-deep-loop-fix focuses on resource-map templates and deep-loop artifact placement infrastructure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/spec.md" lines="44-76" />, which is a different technical domain from template-system architecture. Absorbing 010 into 002 would conflate two distinct concerns.

3. **Phase classification mismatch**: Per iteration-005, 010-template-levels resides in Phase 4: Tooling & Hardening (alongside 013-doctor-update-orchestrator and 015-tanstack-security-audit) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="99-111" />, while 002-resource-map-deep-loop-fix resides in Phase 1: Foundation & Infrastructure (alongside 001-research-and-baseline and 003-continuity-memory-runtime) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md" lines="60-71" />. Absorption would violate the phase taxonomy.

4. **Child count and structure**: 010-template-levels has 6 listed children in graph-metadata.json (001-006) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/graph-metadata.json" lines="6-13" />, plus an unlisted 009 child. 002-resource-map-deep-loop-fix has only 3 children (001-003). Absorbing 010's children into 002 would significantly imbalance the parent structure.

**Recommendation: KEEP 010-template-levels as a parent. Do NOT absorb into 002-resource-map-deep-loop-fix.**

### Rehoming decisions for 004, 005, 006, 009

#### 004-deferred-followups: KEEP in 010-template-levels

**Rationale**: 004-deferred-followups implements ten P1/P2 items deferred from 003-template-greenfield-impl Gate 7, including validation hot-path performance, manifest schema, migration policy, and session-lineage semantics <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/004-deferred-followups/spec.md" lines="33-36" />. This is core template-system work that is tightly coupled to the 001-003 implementation phases. Rehoming would break the logical narrative arc.

**Recommendation: KEEP 004-deferred-followups in 010-template-levels.**

#### 005-skill-references-assets-alignment: KEEP in 010-template-levels

**Rationale**: 005-skill-references-assets-alignment audits the AI-facing system-spec-kit skill documentation surface (SKILL.md, references/, assets/) for alignment with the manifest-backed template and validation system shipped in packets 003 and 004 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment/spec.md" lines="38-42" />. This is specifically about aligning documentation with the template-system changes, making it a natural followup to the core template work.

**Recommendation: KEEP 005-skill-references-assets-alignment in 010-template-levels.**

#### 006-command-md-yaml-alignment: KEEP in 010-template-levels

**Rationale**: 006-command-md-yaml-alignment audits spec_kit command Markdown and YAML workflow assets for stale template-system references and missing current feature notes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment/spec.md" lines="42-46" />. Like 005, this is about aligning command surfaces with template-system changes, making it a logical followup within the template-system domain.

**Recommendation: KEEP 006-command-md-yaml-alignment in 010-template-levels.**

#### 009-rm-8-prompt-hardening: REHOME to 013-doctor-update-orchestrator

**Rationale**: 009-rm-8-prompt-hardening hardens the deep-review iteration prompt template to prevent destructive scope violations by adding an explicit allowed-write list and banning destructive shell verbs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/009-rm-8-prompt-hardening/spec.md" lines="56-68" />. This is security/hardening work, not template-system architecture.

**Rehome target**: 013-doctor-update-orchestrator, which already has child 003-rm8-013-remediation-doc-honesty-security addressing RM-8 findings for the doctor commands <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/description.json" lines="2-8" />. Consolidating RM-8 work under 013 creates a logical home for security/hardening remediation efforts.

This aligns with the iteration-006 recommendation that M9 (010→013) is RECOMMENDED for 009-rm-8-prompt-hardening to consolidate RM-8 security work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-006.md" lines="62-76" />.

**Proposed rehome**: Move 010-template-levels/009-rm-8-prompt-hardening → 013-doctor-update-orchestrator/006-rm-8-prompt-hardening (next available child number; 013 currently has children 001, 002, 003, 004, 005).

**Recommendation: REHOME 009-rm-8-prompt-hardening to 013-doctor-update-orchestrator.**

### Summary table

| Child | Current Parent | Recommendation | Target | Rationale |
|-------|---------------|----------------|--------|-----------|
| 004-deferred-followups | 010-template-levels | KEEP | 010-template-levels | Core template-system validation followup; tightly coupled to 001-003 |
| 005-skill-references-assets-alignment | 010-template-levels | KEEP | 010-template-levels | Documentation alignment with template-system changes |
| 006-command-md-yaml-alignment | 010-template-levels | KEEP | 010-template-levels | Command surface alignment with template-system changes |
| 009-rm-8-prompt-hardening | 010-template-levels | REHOME | 013-doctor-update-orchestrator | Security/hardening work; consolidates with existing RM-8 remediation in 013/003 |

### Metadata inconsistencies identified

1. **010-template-levels graph-metadata.json**: Lists only 6 children (001-006) but 009-rm-8-prompt-hardening exists on disk and is not listed <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/graph-metadata.json" lines="6-13" />. This is a metadata inconsistency that should be corrected regardless of the rehoming decision.

2. **010-template-levels spec.md phase map**: Lists phase 009-rm-8-prompt-hardening as "Pending" but does not include it in the phase transition rules or handoff criteria <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/spec.md" lines="92-92" />. This suggests 009 was added as an ad-hoc security followup rather than being part of the original phase plan.

## Gaps for next iter

1. **013 child numbering validation**: Confirm the correct child number for 009-rm-8-prompt-hardening under 013-doctor-update-orchestrator (currently has children 001, 002, 003, 004, 005; determine if 006 is available or if renumbering is needed).

2. **010-template-levels metadata cleanup**: After 009 rehoming, update 010-template-levels/graph-metadata.json to remove 009 (if it exists) and ensure 004-006 are properly listed.

3. **013-doctor-update-orchestrator metadata update**: After 009 rehoming, update 013-doctor-update-orchestrator/graph-metadata.json to include the new 006 child.

4. **Cross-reference validation**: Identify any cross-references to 010-template-levels/009 in other packets that would need updating after rehoming.

5. **Dependency validation**: Verify that 009-rm-8-prompt-hardening has no dependencies on other 010-template-levels children that would break after rehoming.

6. **Phase parent coherence validation**: Validate that both 010-template-levels and 013-doctor-update-orchestrator remain coherent phase parents after the proposed rehome.

## JSONL delta row

```json
{"iter_id": "007", "timestamp_utc": "2026-05-16T06:05:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 3, "status": "complete", "findings_count": 5, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-005.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/graph-metadata.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-deep-loop-fix/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/004-deferred-followups/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/009-rm-8-prompt-hardening/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-006.md"]}
```