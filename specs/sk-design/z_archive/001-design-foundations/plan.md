---
title: "Implementation Plan: Reconstruct the sk-design foundations mode"
description: "This plan turns the intact design-foundations source into a Level-2 reconstruction packet. The approach is source-first, read-only, and limited to the four requested packet documents, with no runtime skill execution or invented handoff schema."
trigger_phrases:
  - "foundations reconstruction plan"
  - "static visual system plan"
  - "sk-design foundations workflow"
  - "design token handoff plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/001-design-foundations"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted foundations reconstruction implementation plan"
    next_safe_action: "Review plan against source boundaries"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/SKILL.md"
      - ".opencode/skills/sk-design/design-foundations/references/"
      - ".opencode/skills/sk-design/design-foundations/assets/"
      - ".opencode/specs/sk-design/001-design-foundations/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-foundations-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design foundations mode
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
Read the intact foundations source, its references and assets, the required templates, and the validated Level-2 example before drafting the packet. Record the static-system contract, routing boundaries, read-only surface, procedure-card rule, and handoff ownership in spec.md, plan.md, tasks.md, and checklist.md without executing the skill or claiming runtime verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to design-foundations/SKILL.md and its references/assets.
- [x] The target packet path and four-file scope are pre-approved.
- [x] The Level-2 templates and validated Level-2 reference packet have been read.

### Definition of Done
- [ ] All four files carry the required frontmatter, continuity fields, Level-2 markers, and source-specific content.
- [ ] spec.md contains the reconstruction banner, required Spec Folder metadata row, and Sources / Traceability section.
- [ ] Every template anchor is balanced and the packet contains no generated metadata files.
- [ ] The packet does not claim validator, generator, runtime-script, or skill execution results.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-faithful Level-2 reconstruction packet.

### Key Components
- Mode contract: foundations owns the static visual system and uses the reference-base, non-mutating Read/Glob/Grep surface.
- Smart routing: classify the static axis, load the corpus map and matching resources, guard paths, and use the source fallback when confidence is low.
- Static workflow: identify system role, ground constraints, build color/type/layout/data layers, apply anti-slop checks, and prepare proof.
- Procedure selection: choose at most one matching private procedure card or state the baseline no-procedure fallback.
- Handoff: fill the shared sk_code_handoff envelope with the foundations-owned fields; sk-code implements the resulting tokens and breakpoints.

### Data Flow
Request intent selects the public foundations mode and static axis. The mode records the register, role, evidence, pinned tokens, target platforms, accessibility bar, and unknowns; loads only the matching references; applies at most one procedure card; produces proof and a shared implementation handoff. Direct execution retains this flow with Read, Glob, and Grep only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .opencode/skills/sk-design/design-foundations/SKILL.md | Shipped foundations mode contract | Unchanged; source of truth | Compare packet claims with the source sections and wording. |
| .opencode/skills/sk-design/design-foundations/references/ | Axis guidance, router behavior, examples, and traceability | Unchanged; cited evidence | Confirm each cited path is real and its use is limited to stated guidance. |
| .opencode/skills/sk-design/design-foundations/assets/ | Token and contrast scaffolds | Unchanged; cited evidence | Confirm token-starter and contrast-inventory claims remain conditional and downstream where specified. |
| .opencode/skills/sk-design/shared/sk_code_handoff.md | Shared handoff envelope named by the source | Unchanged; not redefined here | Keep the packet limited to the foundations-owned fields named in SKILL.md. |
| .opencode/specs/sk-design/001-design-foundations/ | Reconstruction packet | Create exactly spec.md, plan.md, tasks.md, and checklist.md | Inspect file list, frontmatter, anchors, banner, and traceability manually. |

Required inventories:
- Same-class producers: not applicable; this is documentation reconstruction and does not change runtime producers.
- Consumers of changed symbols: not applicable; no source symbol, API field, or implementation token is changed.
- Matrix axes: public mode contract, static axis, resource-loading level, procedure-card selection, execution surface, handoff fields, and downstream verification.
- Algorithm invariant: no packet statement may expand behavior beyond SKILL.md and its cited references/assets; no runtime script or workspace mutation is attributed to foundations.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the full design-foundations SKILL.md.
- [ ] Read every file in its references/ and assets/ folders.
- [ ] Read the four Level-2 manifest templates and the validated Level-2 reference packet.
- [ ] Record the source-defined ownership, boundaries, routing, tool surface, procedure rule, and handoff fields.

### Phase 2: Core Implementation
- [ ] Author spec.md with the reconstruction banner, metadata row, source-faithful requirements, edge cases, and traceability section.
- [ ] Author plan.md with the source-first approach, affected-surface map, phases, and no-runtime-execution boundary.
- [ ] Author tasks.md with setup, authoring, and structural-verification tasks.
- [ ] Author checklist.md with Level-2 verification items and explicit N/A treatment for non-code checks.

### Phase 3: Verification
- [ ] Inspect all frontmatter for four trigger phrases and the complete continuity block.
- [ ] Inspect every required anchor pair and the spec banner and metadata row.
- [ ] Confirm the packet contains only the four requested files and no generated metadata.
- [ ] Confirm no claim says that a validator, generator, deterministic script, or runtime skill execution was performed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Mode ownership, routing, rules, success criteria, and integration points | Read and manual comparison |
| Resource traceability | References and assets cited in spec.md | Glob and manual path inspection |
| Packet structure | Frontmatter, markers, metadata row, and balanced anchors | Read, Grep, and manual inspection |
| Scope check | Exactly four authored files under the target packet | Glob |
| Runtime behavior | Not executed by this reconstruction | None; downstream checks remain downstream |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact design-foundations SKILL.md | Internal source | Available | The packet cannot make source-faithful claims without it. |
| Foundations references and assets | Internal source | Available | Axis details, router behavior, token scaffolding, and contrast boundaries would be incomplete. |
| Level-2 manifest templates | Internal format | Available | Missing markers or anchors would make the packet non-conformant. |
| Validated Level-2 reference packet | Internal example | Available | Depth and structure would be less directly calibrated. |
| Shared register, context-loading, and sk_code_handoff pointers | Sibling source | Named by SKILL.md | The packet must preserve pointers and avoid inventing their undisclosed schemas. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: A source comparison shows that a packet statement is unsupported, a required structural constraint fails, or the reconstruction is rejected.
- Procedure: Remove only the four newly authored packet files under .opencode/specs/sk-design/001-design-foundations/ and leave the intact skill source, references, assets, and shared files unchanged.
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
- [ ] No deployment, runtime change, data migration, or skill-source edit is in scope.
- [ ] The target packet contains only the four requested documents.
- [ ] Source-faithful claims and the reconstruction banner remain explicit.

### Rollback Procedure
1. Stop treating the packet as authoritative if source comparison finds drift.
2. Remove the four packet documents only if the reconstruction must be withdrawn.
3. Re-read the intact source and templates before recreating any packet content.
4. Keep generated metadata absent until the orchestrator handles it after acceptance.

### Data Reversal
- Has data migrations? No.
- Reversal procedure: N/A; this packet creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->
