---
title: "Implementation Plan: Reconstruct the sk-design interface mode"
description: "This plan turns the intact design-interface source into a Level-2 reconstruction packet. The approach is source-first, limited to the four requested packet documents, and records direction, voice, information architecture, composition, routing, quality, and handoff without executing the skill or inventing shared schemas."
trigger_phrases:
  - "interface reconstruction plan"
  - "overall UI direction plan"
  - "design-interface workflow"
  - "interface handoff plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/002-design-interface"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Reconstructed interface source contract"
    next_safe_action: "Review packet against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/"
      - ".opencode/skills/sk-design/design-interface/assets/"
      - ".opencode/skills/sk-design/design-interface/procedures/"
      - ".opencode/specs/sk-design/002-design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-interface-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design interface mode
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter |
| **Framework** | System Spec Kit Level-2 manifest structure |
| **Storage** | None; this packet documents an existing skill |
| **Testing** | Source comparison and manual structural checks only |

### Overview
Read the intact interface source, all 19 references, the six private procedure cards, the pre-flight asset, the required templates, and the validated Level-2 example before drafting the packet. Record the source-defined direction, voice, information architecture, composition rules, routing, quality gates, and handoff boundaries in the four requested documents without executing the skill, external references, or downstream implementation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to design-interface/SKILL.md and its references/, procedures/, and assets/.
- [x] The target packet path and four-file scope are pre-approved.
- [x] The Level-2 templates and validated Level-2 reference packet have been read.

### Definition of Done
- [ ] All four files carry the required frontmatter, continuity fields, Level-2 markers, and source-specific content.
- [ ] spec.md contains the exact reconstruction banner, required Spec Folder metadata row, and Sources / Traceability section.
- [ ] Every template anchor is balanced and the packet contains no generated metadata files.
- [ ] The packet does not claim validator, generator, runtime-skill, external-reference, or downstream implementation results.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-faithful Level-2 reconstruction packet for a read-oriented design-direction skill.

### Key Components
- **Grounding and register**: name subject, audience, page job, Brand-vs-Product posture, pinned axes, existing system, and one-line Design Read before visual choices.
- **Direction and voice**: derive a compact color/type/layout/signature plan from the brief, keep copy as design material, critique generic defaults, and spend one justified risk.
- **Information architecture and composition**: use hierarchy and structural devices that encode true content, keep one job per element, choose purposeful layout families, protect action vocabulary, and apply the mechanical hero, bento, CTA, spacing, navigation, and responsive gates.
- **Resource and procedure routing**: load the default resources plus matching conditional resources, guard discovered paths, and select at most one private procedure card or state the baseline fallback.
- **Quality and handoff**: apply the objective quality floor and interface pre-flight card, then use the real-UI loop and the shared sk-code build manifest when implementation follows.

### Data Flow
Request intent selects the public interface mode or a sibling route. Interface grounds the subject and register, reads the brief into VARIANCE/MOTION/DENSITY, loads default and matching resources, captures context, chooses one procedure card when applicable, develops and critiques the direction, checks composition and quality, and hands the result to sk-code. When a real surface exists, the flow continues through reuse, render, fidelity check, targeted revision, and handoff; when subagents are unavailable, the same proof bar is followed directly with Read, Glob, and Grep.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .opencode/skills/sk-design/design-interface/SKILL.md | Shipped interface mode contract | Unchanged; source of truth | Compare packet claims with activation, routing, workflow, rules, success criteria, and integration sections. |
| .opencode/skills/sk-design/design-interface/references/ | Direction, IA, composition, quality, resource-routing, and tooling guidance | Unchanged; cited evidence | Confirm all 19 paths exist and each packet claim stays within the cited reference. |
| .opencode/skills/sk-design/design-interface/procedures/ | Six private procedure cards | Unchanged; cited evidence | Confirm trigger, output, proof, privacy, and conflict rules are not exposed as new public routes. |
| .opencode/skills/sk-design/design-interface/assets/ | Interface pre-flight card | Unchanged; cited evidence | Confirm the packet preserves its binary pass/fail role and does not claim a filled result. |
| .opencode/specs/sk-design/002-design-interface/ | Reconstruction packet | Create exactly spec.md, plan.md, tasks.md, and checklist.md | Inspect file list, frontmatter, markers, anchors, banner, metadata row, and traceability manually. |

Required inventories:
- Same-class producers: not applicable; this is documentation reconstruction and does not change the runtime skill.
- Consumers of changed symbols: not applicable; no source symbol, API field, component, token, or implementation file is changed.
- Matrix axes: mode route, register posture, pinned/free axes, Design Read dials, resource intent, procedure selection, IA/composition gate, quality floor, handoff, and sibling boundary.
- Algorithm invariant: no packet statement may expand behavior beyond SKILL.md and its cited references, procedures, and asset; no preset chooser or copied reference may be attributed to interface.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the complete design-interface SKILL.md.
- [ ] Read every file under its references/ folder.
- [ ] Read every file under its assets/ folder and all six procedure cards.
- [ ] Read the four Level-2 manifest templates and the validated Level-2 reference packet.
- [ ] Record the source-defined ownership, IA and composition rules, routing, tool surface, procedure rule, quality gates, and handoff fields.

### Phase 2: Core Implementation
- [ ] Author spec.md with the reconstruction banner, exact metadata row, source-faithful direction, voice, IA, composition, edge cases, and traceability.
- [ ] Author plan.md with the source-first approach, affected-surface map, phases, testing strategy, dependencies, and rollback.
- [ ] Author tasks.md with bounded setup, authoring, and structural-verification work.
- [ ] Author checklist.md with Level-2 verification items and explicit N/A treatment for non-code checks.

### Phase 3: Verification
- [ ] Inspect all frontmatter for the required fields, exactly four trigger phrases, and the complete continuity block.
- [ ] Inspect every required anchor pair, template marker, metadata table, banner, and source path.
- [ ] Confirm the packet contains only the four requested files and no generated metadata.
- [ ] Confirm no claim says that a validator, generator, Node/npm command, external reference lookup, runtime skill, or downstream implementation was executed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Interface ownership, direction, voice, IA, composition, routing, rules, success criteria, and integrations | Read and manual comparison |
| Resource traceability | All 19 references, six procedures, and the interface pre-flight asset cited in spec.md | Read and manual path inspection |
| Packet structure | Frontmatter, markers, metadata row, balanced anchors, and Markdown tables | Read, Grep, and manual inspection |
| Scope check | Exactly four authored files under the target packet | Read and manual file inspection |
| Runtime behavior | Not executed by this reconstruction | None; downstream design, build, and pre-flight checks remain unclaimed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact design-interface SKILL.md | Internal source | Available | The packet cannot make source-faithful claims without the mode contract. |
| Interface references, procedures, and asset | Internal source | Available | Direction, IA, composition, routing, quality, procedure, and pre-flight details would be incomplete. |
| Level-2 manifest templates | Internal format | Available | Missing markers or anchors would make the packet non-conformant. |
| Validated Level-2 reference packet | Internal example | Available | Depth and structure would be less directly calibrated. |
| Shared register, context-loading, sk-code handoff, and Code Mode pointers | Sibling source or integration | Named by SKILL.md | Preserve pointers and avoid inventing schemas or transport results outside the requested source set. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: Source comparison identifies unsupported behavior, a required structural constraint fails, or the reconstruction must be withdrawn.
- Procedure: Remove only the four newly authored packet files under .opencode/specs/sk-design/002-design-interface/ and leave the intact skill source, references, procedures, asset, shared files, and unrelated packets unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Source and template review ──► Packet authoring ──► Structural and source-fidelity inspection

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source and template review | None | Packet authoring |
| Packet authoring | Source and template review | Structural inspection |
| Structural inspection | Packet authoring | Any later packet-use claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source and template review | Medium | One complete reading pass |
| Packet authoring | Medium | One four-file drafting pass |
| Structural inspection | Low | One manual inspection pass |
| **Total** | | **Three bounded passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment, runtime change, data migration, external lookup, or skill-source edit is in scope.
- [ ] The target packet contains only the four requested documents.
- [ ] Source-faithful claims, the reconstruction banner, and the no-runtime-claim boundary remain explicit.

### Rollback Procedure
1. Stop treating the packet as authoritative if source comparison finds drift.
2. Remove the four packet documents only if the reconstruction must be withdrawn.
3. Re-read the intact source, procedures, asset, templates, and exemplar before recreating packet content.
4. Keep generated metadata absent until the orchestrator handles it after acceptance.

### Data Reversal
- Has data migrations? No.
- Reversal procedure: N/A; this packet creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->
