---
title: "Implementation Plan: Reconstruct the sk-design motion mode"
description: "This plan turns the intact design-motion source into a Level-2 reconstruction packet. The approach is source-first, read-only, and limited to the four requested packet documents, with no runtime skill execution or invented shared handoff schema."
trigger_phrases:
  - "motion reconstruction plan"
  - "temporal interaction plan"
  - "animation choreography workflow"
  - "motion handoff plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/003-design-motion"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted motion reconstruction plan"
    next_safe_action: "Review plan against motion source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
      - ".opencode/skills/sk-design/design-motion/references/"
      - ".opencode/skills/sk-design/design-motion/procedures/"
      - ".opencode/skills/sk-design/design-motion/assets/"
      - ".opencode/specs/sk-design/003-design-motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-motion-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design motion mode
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
Read the intact design-motion source, its seven references, procedure card, assets, required templates, and validated Level-2 example before drafting. Record the motion contract, restraint gate, routing boundaries, read-only surface, procedure rule, handoff ownership, and verification limits in the four packet documents without executing the skill or claiming runtime results.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to design-motion/SKILL.md and its references, procedure, and assets.
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
- Mode contract: motion owns the temporal layer and uses the source-defined Read, Grep, and Glob tool surface.
- Restraint and routing: run the frequency, keyboard, purpose, and register gate first, then classify temporal intent and load only matching resources.
- Motion workflow: choose purpose, budget, timing, easing, staging, material, states, reduced-motion behavior, and performance constraints.
- Procedure and assets: select at most one matching private procedure card and apply the pattern, presence, and performance cards when their triggers match.
- Handoff: name the implementation mechanism and stack boundary for sk-code without migrating or mixing animation systems inside one surface.

### Data Flow
The request selects the public motion mode and temporal concern. The mode reads the motion-budget register and restraint gate, scores one or two intents, loads the corpus map and matching references/assets, captures the target interaction and states, selects one procedure or the baseline fallback, and produces proof plus a bounded sk-code handoff. Direct execution retains this flow with Read, Glob, and Grep only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .opencode/skills/sk-design/design-motion/SKILL.md | Shipped motion mode contract | Unchanged; source of truth | Compare packet claims with activation, routing, workflow, rules, success, and integration sections. |
| .opencode/skills/sk-design/design-motion/references/ | Temporal guidance and source traceability | Unchanged; cited evidence | Confirm each of the seven cited paths supports only the motion guidance recorded here. |
| .opencode/skills/sk-design/design-motion/procedures/ | Private interaction-state procedure | Unchanged; cited support | Confirm the trigger, output contract, proof gate, privacy rule, and no-card fallback remain source-defined. |
| .opencode/skills/sk-design/design-motion/assets/ | Pattern, presence, and performance cards | Unchanged; cited evidence | Confirm all three asset paths and their build-side checks are represented without claiming execution. |
| .opencode/skills/sk-design/shared/register.md and sk_code_handoff.md | Shared pointers named by the motion source | Unchanged; not redefined here | Keep the packet limited to the motion-budget and stack-boundary fields named by SKILL.md. |
| .opencode/specs/sk-design/003-design-motion/ | Reconstruction packet | Create exactly spec.md, plan.md, tasks.md, and checklist.md | Inspect file list, frontmatter, anchors, banner, metadata row, and traceability manually. |

Required inventories:
- Same-class producers: not applicable; this is documentation reconstruction and does not change runtime producers.
- Consumers of changed symbols: not applicable; no source symbol, API field, or implementation contract is changed.
- Matrix axes: temporal concern, intent scoring, resource-loading level, procedure-card selection, execution surface, motion budget, reduced-motion bar, performance constraints, and handoff mechanism.
- Algorithm invariant: no packet statement may expand behavior beyond SKILL.md and its cited references/procedure/assets; no runtime execution or shared-schema reconstruction is attributed to motion.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the full design-motion SKILL.md.
- [ ] Read every file under its references/ folder.
- [ ] Read the procedure card and every file under its assets/ folder.
- [ ] Read the four Level-2 manifest templates and the validated Level-2 reference packet.
- [ ] Record motion ownership, boundaries, routing, tool surface, procedure rule, proof fields, and handoff boundary.

### Phase 2: Core Implementation
- [ ] Author spec.md with the reconstruction banner, metadata row, source-faithful requirements, edge cases, and traceability section.
- [ ] Author plan.md with source-first phases, affected surfaces, testing strategy, dependencies, and rollback.
- [ ] Author tasks.md with bounded setup, authoring, and structural-verification work.
- [ ] Author checklist.md with Level-2 verification items and explicit N/A treatment for non-code checks.

### Phase 3: Verification
- [ ] Inspect all frontmatter for required keys, exactly four trigger phrases, and the complete continuity block.
- [ ] Inspect every required anchor pair, the spec banner, the exact Spec Folder row, and well-formed tables.
- [ ] Confirm the packet contains only the four requested files and no generated metadata.
- [ ] Confirm no claim says that a validator, generator, node/npm command, git command, runtime skill, or downstream script was executed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Motion ownership, restraint gate, routing, rules, success criteria, and integration points | Read and manual comparison |
| Resource traceability | Seven references, one procedure, and three assets cited in spec.md | Read and manual path inspection |
| Packet structure | Frontmatter, markers, metadata row, and balanced anchors | Read, Grep, and manual inspection |
| Scope check | Exactly four authored files under the target packet | Glob |
| Runtime behavior | Not executed by this reconstruction | None; downstream checks remain downstream |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact design-motion SKILL.md | Internal source | Available | The packet cannot make source-faithful claims without it. |
| Motion references, procedure, and assets | Internal source | Available | Restraint, timing, interaction, presence, performance, reduced-motion, and card details would be incomplete. |
| Level-2 manifest templates | Internal format | Available | Missing markers or anchors would make the packet non-conformant. |
| Validated Level-2 reference packet | Internal example | Available | Depth and structure would be less directly calibrated. |
| Shared register, sk_code_handoff, and polish pointers | Sibling source | Named by SKILL.md | Preserve pointers and avoid inventing their undisclosed schemas. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: A source comparison shows unsupported behavior, a required structural constraint fails, or the reconstruction is rejected.
- Procedure: Remove only the four newly authored packet files under .opencode/specs/sk-design/003-design-motion/ and leave the intact motion source, references, procedure, assets, shared files, and other packets unchanged.
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
