---
title: "Implementation Plan: Phase 4: parent-and-nested-goal-authoring"
description: "Plan the parent and nested goal authoring reference, its mode links, and a strict fixture that proves every phase child is bound."
trigger_phrases:
  - "parent goal authoring plan"
  - "phase binding workflow"
  - "goal retrofit fixture"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: parent-and-nested-goal-authoring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with repository shell and TypeScript utilities |
| **Framework** | system-spec-kit goal template and inline gate renderer |
| **Storage** | Packet goal.md files; one proof fixture under this phase’s scratch directory |
| **Testing** | validate.sh --strict and a manual child-directory-to-binding-row count |

### Overview
The phase creates one authoring reference and links it from the mode’s references index and SKILL.md. The workflow reads the parent Phase Documentation Map, checks the direct child directories, derives each child goal from that child’s spec.md and acceptance-criteria.md, and renders a missing phase-parent goal through the phase-level template. The `create.sh --phase --with-goal` path scaffolds child goals but renders the parent spec separately, so a missing parent goal is an explicit retrofit operation (specs/sk-doc/060-create-goal-mode/spec.md:119-129; .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-105; .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:444-463, 1275-1335, 1492-1504; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 satisfies the incoming handoff recorded in the parent map (specs/sk-doc/060-create-goal-mode/spec.md:144).
- [ ] The parent map, parent goal contract, renderer, and validator source are available.
- [ ] Phase 002 has created the target mode packet with SKILL.md and references/README.md (specs/sk-doc/060-create-goal-mode/spec.md:122).

### Definition of Done
- [ ] The reference defines top-level, parent, child, retrofit, and phase-add operations.
- [ ] The mode index and SKILL.md load the reference at the right authoring steps.
- [ ] The fixture has equal child-directory and binding-row counts and passes strict validation on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, with no SPECDOC_SUFFICIENCY_006.
- [ ] The phase packet passes the requested strict validator gate.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A mode reference document with explicit workflow entry points and two reader links, following the archived phase pattern described by the mode-anatomy audit (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:58; specs/sk-doc/z_archive/040-create-repo-rules/005-agents-md-integration/spec.md:91-98).

### Key Components
- **Parent and nested goal reference**: Defines the five authoring operations and conflict rules.
- **Mode links**: references/README.md routes the reference; SKILL.md loads it during parent and child authoring.
- **Scratch fixture**: Exercises a phase parent with three on-disk child phases and three matching binding rows.

### Data Flow
The parent spec supplies the phase map. The filesystem supplies the child-folder set. Each child’s own spec.md and acceptance-criteria.md supply its objective and criteria. The workflow renders goal documents from the canonical goal template, then compares the fixture’s child and binding counts and runs strict validation (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-105; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282; .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1064-1080).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation workflow phase, not a code fix. The phase plans no system-spec-kit changes (specs/sk-doc/060-create-goal-mode/spec.md:94-98).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| goal.md.tmpl and inline-gate-renderer.sh | Canonical goal structure and level rendering | Read only; use phase level for a missing phase-parent goal | Rendered phase fixture contains the binding section (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-91; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282) |
| Parent spec and child spec/acceptance-criteria files | Sources for the map, phase focus, and phase criteria | Read only during goal authoring | Inventory every direct child folder and trace its own source pair |
| spec-doc-structure.ts | Checks the durable budget and listed binding targets | Read only; no completeness amendment in this phase | Compare directory and row counts separately (.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080) |
| Mode reference, references/README.md, and SKILL.md | Workflow and its two navigation points | Create or modify | Reference link resolves and SKILL.md names the load step (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:58; specs/sk-doc/z_archive/040-create-repo-rules/005-agents-md-integration/spec.md:91-98) |

Required inventories:
- Same-class producers: Not applicable; no defect or code producer is changed.
- Consumers of changed symbols: Not applicable; no shared code symbol changes. The two documentation consumers are listed in the surface table.
- Matrix axes: top-level, phase parent, nested child, retrofit, and phase added; goal present or absent; map and directory matching or mismatched.
- Algorithm invariant: the parent goal contains exactly one valid row per direct phase-child directory; no row is guessed from missing source data.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in tasks.md. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Step | Files | Tools and commands | Observable check |
|------|-------|--------------------|------------------|
| 1. Inventory sources | Parent spec, parent goal, on-disk child folders, each child spec.md and acceptance-criteria.md | rg --files on the packet; find direct child directories; nl -ba on the parent map and child source files | The recorded map and directory sets match; any mismatch is reported before a goal is written. |
| 2. Author and route the workflow | Create .skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md; modify references/README.md and SKILL.md | Markdown editor; source citations from the goal template, renderer, validator, and playbook | The reference names all five operations, precedence, amendment and resend rules; both mode links resolve. |
| 3. Build the fixture | Create scratch/001-parent-and-nested-goals-fixture/ with one parent and three phase children | Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --path specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture --phase --phases 3 --phase-names source-audit,goal-authoring,binding-check --level 2 --with-goal 'Parent and nested goal fixture'`; complete its generated fixture placeholders; render the missing parent goal with `bash .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh --level phase --out-dir specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`; fill one binding row per generated child; use `nl -ba` to compare the map, rows, and child sources (create flags and phase-parent/child generation: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:83-102, 150-155, 183-215, 1194-1256, 1275-1335, 1492-1504; renderer output naming: .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282). | The fixture has three phase-child directories, three child goal.md files, and three parent binding rows. |
| 4. Verify the fixture and packet | Scratch fixture and this phase folder | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture --strict; then bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring --strict | Fixture command exits 0, prints RESULT: PASSED, and has zero SPECDOC_SUFFICIENCY_006 findings; the phase-folder validator output is recorded with any generated-metadata findings left for the orchestrator. |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable; this phase adds no code | None |
| Integration | Three-child phase-parent fixture, every child goal and binding row | validate.sh --strict; manual count comparison |
| Manual | Walk through top-level, parent, child, retrofit, and phase-add paths | Read the reference against the parent goal template and playbook |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 mode packet and Phase 003 authoring rubric | Internal | Pending in parent map | Do not author until the packet exists and the incoming handoff passes (specs/sk-doc/060-create-goal-mode/spec.md:122, 144) |
| Parent Phase Documentation Map and bound parent decisions | Internal | Available | Without them, binding rows and precedence cannot be derived (specs/sk-doc/060-create-goal-mode/spec.md:119-129; specs/sk-doc/060-create-goal-mode/goal.md:49-54) |
| Goal template, renderer, and validator | Internal | Available | Without the template and renderer, the workflow cannot preserve the phase binding contract (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:75-105; .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:231-282) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reference contradicts the parent goal contract, or the fixture fails because the workflow leaves a phase child unbound.
- **Procedure**: Restore the pre-phase copies of the existing references/README.md and SKILL.md, remove the newly created parent-and-nested-goals.md and scratch fixture, then rerun strict validation on this phase folder. Do not change the system-spec-kit template, renderer, validator, or any real packet goal.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and inventory | Phase 003 handoff | Authoring |
| Authoring and mode links | Setup and inventory | Fixture |
| Fixture construction | Authoring and mode links | Verification |
| Verification | Fixture construction | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory | Low | 1-2 hours |
| Core workflow and mode links | Medium | 4-6 hours |
| Fixture and strict verification | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture pre-phase copies of existing references/README.md and SKILL.md.
- [ ] Feature flag: Not applicable; no runtime behavior is added.
- [ ] Monitoring: Not applicable; no production service is changed.

### Rollback Procedure
1. Restore only the pre-phase copies of references/README.md and SKILL.md.
2. Remove the new parent-and-nested-goals.md reference and this phase’s scratch fixture.
3. Confirm neither mode document links to the removed reference.
4. Rerun strict validation on this phase folder and leave acceptance criteria Unmet until the gate passes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; the phase changes documentation and a scratch fixture only.
<!-- /ANCHOR:enhanced-rollback -->

---

