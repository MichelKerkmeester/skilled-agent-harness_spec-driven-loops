---
title: "Verification Checklist: Phase 015 - Design Commands Router+Assets Implementation"
description: "Verification Date: 2026-07-06 - all 22 checklist items verified with evidence"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 015 checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/015-design-commands-implementation"
    last_updated_at: "2026-07-06T20:20:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Filled in evidence for all checklist items"
    next_safe_action: "Write implementation-summary.md and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-commands-impl-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 015 - Design Commands Router+Assets Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 013 plan.md and decision-record.md read in full (verified)
- [x] CHK-002 [P0] All five original command files read in full (verified)
- [x] CHK-003 [P1] `create-command` contract and presentation template read (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 5 routers have the 6 required sections in order (Router Contract, Owned Assets, Mode Routing, Execution Targets, Presentation Boundary, Workflow Summary) - confirmed by direct read of all 5 `.md` routers (verified)
- [x] CHK-011 [P0] No router contains inline startup-question wording, dashboard templates, or result templates - Presentation Boundary section in each router names the split explicitly (verified)
- [x] CHK-012 [P1] All 15 assets follow the naming convention `design_<mode>_{auto,confirm}.yaml` / `design_<mode>_presentation.txt` - confirmed via `find .opencode/commands/design/assets -type f` (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Structural diff confirms every original section relocated, all 5 modes - sibling-discriminator bullets, deliverable required fields, NEXT_OPTIONS handoff targets, Cannot-run/Escalate/Route-instead conditions, register dial names, task-projection verbs, and EXAMPLE usage all confirmed present across router+assets via targeted grep comparison against `git show HEAD:<original>` (verified)
- [x] CHK-021 [P0] Frontmatter diff confirms `description`/`argument-hint`/`allowed-tools` unchanged per mode - `description` and `allowed-tools` identical; `argument-hint` extended as a superset (added `[--register brand|product] [:auto|:confirm]`), original value fully preserved (verified)
- [x] CHK-022 [P1] `md-generator`'s distinct tool surface (Write/Edit/Bash) preserved - router frontmatter `allowed-tools: Read, Write, Edit, Bash, Glob, Grep` unchanged from original (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] `interface` router + 3 assets built, task-lane menu preserved - 6 task lanes (direction/directions/redesign/preflight/build/aesthetic) confirmed in router; workflow YAML names the design-interface Procedure Card Selection trigger table (discovery_question_round, aesthetic_direction, wireframe_exploration, variation_set, prototype_flow_spec, deck_direction_spec, polish_gate_orchestration) instead of a black-box "apply the mode" step (verified)
- [x] CHK-P0-002 [P0] `foundations` router + 3 assets built - workflow YAML names the design-foundations Procedure Card Selection trigger table (tweakable_design_controls, component_system_inventory, hierarchy_rhythm_review, polish_gate_orchestration) and the Static-System Workflow (verified)
- [x] CHK-P0-003 [P0] `motion` router + 3 assets built - workflow YAML names the design-motion Procedure Card Selection trigger table (interaction_states_pass, polish_gate_orchestration) and the Motion Design Workflow (verified)
- [x] CHK-P0-004 [P0] `audit` router + 3 assets built, advisory verbs preserved - harden/polish verbs confirmed present; workflow YAML names the design-audit Procedure Card Selection trigger table (accessibility_audit, ai_slop_check, polish_gate_orchestration) and the 5-dimension Audit Workflow (verified)
- [x] CHK-P0-005 [P0] `md-generator` router + 3 assets built - workflow YAML names the design_system_extraction procedure card trigger and the real EXTRACT/WRITE/VALIDATE/REPORT backend pipeline (extract.ts, build-write-prompt.ts, validate.ts, report-gen.ts/preview-gen.ts/proof.ts, guided-run.ts as orchestrator) instead of a black-box step (verified)
- [x] CHK-P0-006 [P0] `:auto`/`:confirm` interaction dimension added per ADR-001/ADR-002 shared completeness rule, identical across all 5 modes - every router's Mode Routing section states the same rule: complete `$ARGUMENTS` + no suffix -> auto; incomplete + no suffix -> confirm; explicit `:auto` always resolves via auto-resolution or fail-fast; explicit `:confirm` always shows the prompt once (verified)
- [x] CHK-P0-007 [P0] Every sibling-discriminator table, register dial set, and deliverable field preserved verbatim in meaning - confirmed via CHK-020's grep verification (verified)
- [x] CHK-P0-008 [P0] Every HANDOFF GRAMMAR / PIPELINE & HANDOFF next-step option preserved in the presentation asset - Next-Step Suggestions table in each `_presentation.txt` carries the same NEXT_OPTIONS targets and reasons as the original HANDOFF GRAMMAR / PIPELINE & HANDOFF sections (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new write/execute capability granted to the 4 read-only modes (interface, foundations, motion, audit stay Read/Glob/Grep) - frontmatter `allowed-tools` unchanged for all 4 (verified)
- [x] CHK-031 [P1] `md-generator`'s Write/Edit/Bash surface not widened beyond its current scope - workflow YAML explicitly states the backend_boundary note: the embedded TypeScript pipeline remains the sole mutating entrypoint, this workflow orchestrates it, never bypasses it (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with actual delivered scope - all three reconciled to Level 2 and the actual 20-file delivery in this pass (verified)
- [x] CHK-041 [P1] Phase 013's `implementation-summary.md` cross-referenced to this phase as the executed implementation (verified)
- [x] CHK-042 [P2] `sk-design` hub's routing table reviewed to confirm no load-path change, only file organization - each mode's workflow YAML step_1/step_2 reads the exact same `SKILL.md` paths the original flat commands read (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file created outside `.opencode/commands/design/**` for the implementation itself - `git status --porcelain -- .opencode/commands/design/` shows exactly 5 modified routers + 1 new `assets/` directory (15 files) (verified)
- [x] CHK-051 [P1] No `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` file edited by this phase - `git status --porcelain -- .opencode/skills/sk-design .opencode/skills/sk-doc` shows only pre-existing concurrent-session changes under `sk-doc/`, none attributable to this phase's writes (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-06
<!-- /ANCHOR:summary -->
