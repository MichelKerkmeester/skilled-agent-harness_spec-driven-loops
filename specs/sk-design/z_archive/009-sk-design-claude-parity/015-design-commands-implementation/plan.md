---
title: "Implementation Plan: Phase 015 - Design Commands Router+Assets Implementation"
description: "Plan for executing Phase 013's router+assets split across all five /design:* commands, keeping workflow YAML proportional to a single-mode application."
trigger_phrases:
  - "phase 015 plan"
  - "design command implementation plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/015-design-commands-implementation"
    last_updated_at: "2026-07-06T19:40:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and checklist.md, then build the 20 command files starting with interface"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-commands-impl-015"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 015 - Design Commands Router+Assets Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers, YAML workflow assets, plain-text presentation contracts |
| **Framework** | `sk-doc` `create-command` packet contract; reference shape `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt` |
| **Storage** | `.opencode/commands/design/` (5 router files) + `.opencode/commands/design/assets/` (15 new asset files) |
| **Testing** | Spec strict validation, structural diff against the five original command files, frontmatter/tool-surface parity check |

### Overview

Execute Phase 013's design exactly: for each of the five modes, extract routing-bearing content into a thin router, execution steps into `_auto.yaml`/`_confirm.yaml`, and display content into `_presentation.txt`. Build `interface` first (most complex — has a task-lane menu) as the reference shape, then adapt the same shape for `foundations`, `motion`, `audit`, `md-generator`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 013's plan.md and decision-record.md read in full
- [x] All five current command files read in full
- [x] `create-command` SKILL.md and `command_presentation_template.md` read in full
- [x] Reference shape (`speckit/plan.md` + presentation.txt) read for section order

### Definition of Done
- [ ] Five routers + fifteen assets created
- [ ] Structural diff confirms no behavior drift beyond the added `:auto`/`:confirm` dimension
- [ ] `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin router + three owned assets per mode, per Phase 013's design. Workflow YAML stays proportional: `role`/`purpose`/`action`, `operating_mode`, `user_inputs` (from PRECONDITIONS), `workflow` (load hub SKILL.md -> load mode SKILL.md -> apply mode to `$ARGUMENTS` -> return STATUS, mirroring the current CHOREOGRAPHY steps 1-4), `deliverable` (from EMIT DELIVERABLE), and `task_projections` where the mode has advisory verbs. This deliberately does NOT mirror `speckit:plan`'s scale (multi-step gated workflow, agent dispatch, quality-gate scoring) — that complexity belongs to spec-kit's own domain, not a single mode-application command that already delegates its real workflow logic to the mode's own `SKILL.md`.

### Key Components

- **Thin router**: Router Contract, Owned Assets table, Mode Routing (parse `:auto`/`:confirm`, apply ADR-002's completeness rule when no suffix), Execution Targets, Presentation Boundary, Workflow Summary. Retains USER INTENT, INTERNAL BINDING, task lanes (interface only), sibling-discriminator table, PRECONDITIONS gate conditions, REGISTER dial names.
- **`_auto.yaml`**: role/purpose/action, `operating_mode: {workflow: single_pass, approvals: none}`, `user_inputs` (from PRECONDITIONS), `workflow` steps (load hub, load mode SKILL.md, apply mode, return STATUS), `deliverable` fields (from EMIT DELIVERABLE), auto-resolution notes.
- **`_confirm.yaml`**: same steps as auto, `operating_mode: {approvals: consolidated_prompt_once}`, shows the consolidated prompt from the presentation asset before the workflow steps run.
- **`_presentation.txt`**: Consolidated Prompt Template (per-mode primary input + register + task-lane-if-applicable + execution-mode question, per ADR-001's fixed order), Auto Resolution Table (per ADR-002), STATUS templates (OK/ASK/FAIL/DEFER from the current INSTRUCTIONS Step 2), Next-Step Suggestions (from PIPELINE & HANDOFF / HANDOFF GRAMMAR), Example Usage (from EXAMPLE).

### Content-Inventory Mapping (Executed, Per Mode)

Same mapping as Phase 013 plan.md § 3 Architecture, now executed rather than planned:

| Current Section | Destination |
|---|---|
| Frontmatter | Router, values unchanged |
| USER INTENT, INTERNAL BINDING | Router body |
| Task lanes (interface only) | Router body |
| Sibling-discriminator | Router body |
| PRECONDITIONS (conditions) | Router Mode Routing; (Ask-first wording) -> presentation Consolidated Prompt |
| REGISTER (dial names) | Router; (Ask-first wording) -> presentation Consolidated Prompt |
| INSTRUCTIONS Step 1 | `_auto.yaml`/`_confirm.yaml` workflow steps |
| INSTRUCTIONS Step 2 (STATUS lines) | Presentation Results Display |
| CHOREOGRAPHY | `_auto.yaml`/`_confirm.yaml` workflow steps |
| EMIT DELIVERABLE | `_auto.yaml`/`_confirm.yaml` deliverable fields |
| PIPELINE & HANDOFF, HANDOFF GRAMMAR | Presentation Next-Step Suggestions |
| EXAMPLE | Presentation Example Usage |
| TASK PROJECTIONS | `_auto.yaml`/`_confirm.yaml` (verb handling) + presentation (menu wording, where advisory verbs exist) |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/design/interface.md` | Flat command | Rewrite to thin router | Structural diff |
| `.opencode/commands/design/foundations.md` | Flat command | Rewrite to thin router | Structural diff |
| `.opencode/commands/design/motion.md` | Flat command | Rewrite to thin router | Structural diff |
| `.opencode/commands/design/audit.md` | Flat command | Rewrite to thin router | Structural diff |
| `.opencode/commands/design/md-generator.md` | Flat command, Write/Edit/Bash tools | Rewrite to thin router, same tool surface | Structural diff + frontmatter diff |
| `.opencode/commands/design/assets/` | Does not exist | New directory, 15 files | Directory listing |
| `sk-design` hub + 5 mode packets | Routing target | Unchanged | `git status` shows no edit under `.opencode/skills/sk-design/**` |

Required inventories:
- Same-class producers: the five `/design:*` commands, classified by tool surface (`md-generator` writes; the other four are read-only).
- Consumers of changed symbols: none outside the command layer — the `sk-design` hub's routing table and mode `SKILL.md` files are read, never written, by this phase.
- Matrix axes: mode x {router section, workflow-YAML step, presentation-asset section, preserved dial/lane/discriminator}.
- Algorithm invariant: the split may add `:auto`/`:confirm`, but may not change a task lane, sibling discriminator, precondition, register dial, deliverable field, or handoff grammar line.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read Phase 013's plan.md, decision-record.md, checklist.md
- [x] Read all five current command files
- [x] Read `create-command` SKILL.md and `command_presentation_template.md`
- [x] Read the reference shape (`speckit/plan.md` + presentation.txt)

### Phase 2: Implementation
- [ ] Build `interface` router + 3 assets (reference shape, has task lanes)
- [ ] Build `foundations` router + 3 assets
- [ ] Build `motion` router + 3 assets
- [ ] Build `audit` router + 3 assets
- [ ] Build `md-generator` router + 3 assets (distinct tool surface)

### Phase 3: Verification
- [ ] Structural diff: every original section traced to its destination asset for all five modes
- [ ] Frontmatter diff: `description`/`argument-hint`/`allowed-tools` unchanged per mode
- [ ] `validate.sh --strict` on this phase folder
- [ ] Update Phase 013's `implementation-summary.md` cross-reference
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This phase's own Level 3 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
| Structural diff | Every relocated section, all 5 modes | Manual side-by-side review against the git history of the original 5 files |
| Boundary audit | No edit outside `.opencode/commands/design/**` | `git status --short -- .opencode/skills/sk-design .opencode/skills/sk-doc` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013 plan.md + decision-record.md | Design source | Complete, read in full | Blocks correct split |
| Five original command files | Source of truth | Read in full, unmodified until this phase's writes | Blocks accurate relocation |
| `sk-design` hub + mode-registry.json | Routing contract | Unchanged | Blocks correct mode-binding wording if it changes mid-phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Structural diff finds a behavior change beyond the added interaction dimension.
- **Procedure**: `git diff`/`git restore` the affected router or asset file back to the pre-phase state (the five original flat commands), fix the drift, re-diff.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 013 docs, 5 original files | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Already complete |
| Implementation | High | 20 files, uniform shape |
| Verification | Medium | Structural diff across 5 modes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm no `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` file touched
- [ ] Confirm all 5 original command files' content is accounted for in the new router+assets set

### Rollback Procedure
1. Identify the drifted mode.
2. Restore that mode's router/assets from the original single-file content.
3. Re-run the structural diff.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Revert the router/asset docs only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 013 plan.md + decision-record.md
        |
        v
Five original /design:* command files ---> Router+assets build (per mode) ---> Structural-diff verification
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Build interface (reference shape)** - CRITICAL
2. **Adapt shape for foundations/motion/audit/md-generator** - CRITICAL
3. **Structural-diff verification** - CRITICAL

**Parallel Opportunities**: none meaningful — one implementer building 20 closely-related files benefits from doing them sequentially against one held mental model of the shape, not from parallelizing across modes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|-------------------|
| M1 | Interface shape validated | Router + 3 assets built and internally consistent |
| M2 | All 5 modes built | 20 files total on disk |
| M3 | Verified | Structural diff + strict validation pass |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISIONS

| Decision | Rationale | Consequence |
|----------|-----------|-------------|
| Keep workflow YAML proportional to a single-mode application, not `speckit:plan`'s scale | The mode packets' own `SKILL.md` files already own the real workflow logic and quality gates; duplicating that complexity in the command YAML would be redundant and would drift from the mode packets over time | Each `_auto.yaml`/`_confirm.yaml` stays in the tens of lines, not hundreds |
| Build interface first as the reference shape | It is the most complex mode (task-lane menu) so its shape generalizes downward cleanly to the simpler four | Foundations/motion/audit/md-generator reuse interface's section shape with mode-specific content substituted |
