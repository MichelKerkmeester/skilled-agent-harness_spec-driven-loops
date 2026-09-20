---
title: "Tasks: Phase 007 - Procedure Card Template Alignment"
description: "Completed task breakdown and evidence for Path B procedure-card schema tightening and fourteen-card conformance verification."
trigger_phrases:
  - "phase 007 tasks"
  - "procedure-card audit tasks"
  - "template alignment task breakdown"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed Path B conformance, reconciled docs, ran strict validation"
    next_safe_action: "No further action required; Phase 008 may proceed."
---
# Tasks: Phase 007 - Procedure Card Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Check Phase 006 decision. Evidence: `../006-parent-skill-canon-verification/decision-record.md` ADR-001 is Accepted and states Phase 007 should design an sk-design-local procedure-card template rather than a new sk-doc template family.
- [x] T002 Read all fourteen procedure-card files under `.opencode/skills/sk-design/*/procedures/*.md` and `.opencode/skills/sk-design/shared/procedures/*.md`. Evidence: the audit table below records frontmatter, section headings, and required-field order for all 14 cards.
- [x] T003 [P] Read `.opencode/skills/sk-design/shared/procedure_card_schema.md` in full. Evidence: the schema now contains frontmatter, `## 4. Required-Field Lint`, `## 5. Worked Example`, `## 9. Publication Checklist`, the seven required fields, optional fields, selection rules, source adaptation rules, and shared placement rule.
- [x] T004 Confirm `.opencode/commands/doctor/scripts/parent-skill-check.cjs` has no reference to `procedures` or `procedure` via direct search. Evidence: Grep tool search for `procedures|procedure` returned `No files found`.

### Procedure Card Audit Evidence

All fourteen cards use YAML frontmatter with `version: 1.0.0.0`, an H1 matching the title, a one-sentence intro, `## 1. REQUIRED FIELDS`, `| Field | Value |`, and the required field order `Purpose -> Owning mode -> Source reference -> Trigger -> Output contract -> Proof gate -> Privacy rule`.

| Card | Owning Location | Frontmatter | Section Headings | Field Order |
|---|---|---|---|---|
| `design-interface/procedures/aesthetic_direction.md` | `design-interface` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
| `design-interface/procedures/deck_direction_spec.md` | `design-interface` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE` | Conforms |
| `design-interface/procedures/discovery_question_round.md` | `design-interface` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `CONFLICT RULE` | Conforms |
| `design-interface/procedures/prototype_flow_spec.md` | `design-interface` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `CONFLICT RULE` | Conforms |
| `design-interface/procedures/variation_set.md` | `design-interface` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
| `design-interface/procedures/wireframe_exploration.md` | `design-interface` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `CONFLICT RULE` | Conforms |
| `design-foundations/procedures/component_system_inventory.md` | `design-foundations` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `CONFLICT RULE` | Conforms |
| `design-foundations/procedures/hierarchy_rhythm_review.md` | `design-foundations` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
| `design-foundations/procedures/tweakable_design_controls.md` | `design-foundations` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
| `design-motion/procedures/interaction_states_pass.md` | `design-motion` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `CONFLICT RULE` | Conforms |
| `design-audit/procedures/accessibility_audit.md` | `design-audit` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
| `design-audit/procedures/ai_slop_check.md` | `design-audit` | Present with version | `REQUIRED FIELDS`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
| `design-md-generator/procedures/design_system_extraction.md` | `design-md-generator` | Present with version | `REQUIRED FIELDS`, `TOOL BOUNDARY`, `PROCEDURE`, `CONFLICT RULE` | Conforms |
| `shared/procedures/polish_gate_orchestration.md` | `shared`; reviewer `design-audit` | Present with version | `REQUIRED FIELDS`, `PLACEMENT RATIONALE`, `READ-ONLY COMPATIBILITY`, `PROCEDURE`, `RELATED CARDS` | Conforms |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Read `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md` in full. Evidence: it requires frontmatter with version, a 1-2 sentence intro, numbered sections, complete examples, and a publication checklist.
- [x] T006 Read `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` in full. Evidence: it requires frontmatter with version, a short intro before `## 1. OVERVIEW`, numbered H2 sections, and reference-size guidance.
- [x] T007 Read `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md` in full. Evidence: it requires frontmatter, a per-item file scaffold, source metadata, related references, and a terminal checklist.
- [x] T008 Build the field-by-field diff table. Evidence: `spec.md` contains the diff table covering frontmatter, intro convention, section numbering, required fields, optional fields, rules, example, checklist, versioning, naming, file size, and checker visibility.
- [x] T009 Draft Path A. Evidence: `plan.md` and `decision-record.md` name `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`; Phase 006 later rejected executing that path for this phase.
- [x] T010 Draft the Path A conformance task list. Evidence: the six owning locations and counts are recorded as `design-interface` x6, `design-foundations` x3, `design-motion` x1, `design-audit` x2, `design-md-generator` x1, and `shared` x1; Path B superseded executing that list.
- [x] T011 Execute Path B. Evidence: `shared/procedure_card_schema.md` contains required-field lint for the seven fields in order and uses `accessibility_audit.md` as the embedded worked example; all fourteen cards conform to that local schema.
- [x] T012 Define acceptance criteria and files-to-change tables. Evidence: `implementation-summary.md` records the Path B acceptance result and file ledger.
- [x] T013 Document canon-checker cross-reference. Evidence: `plan.md` and `implementation-summary.md` record that `parent-skill-check.cjs` has zero `procedure` or `procedures` matches and that this phase does not extend checker coverage.
- [x] T014 Define rollback guidance. Evidence: `plan.md` keeps Path A rollback guidance; `implementation-summary.md` records Path B rollback as reverting `shared/procedure_card_schema.md` and affected procedure-card structural edits if needed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run strict validation for the Phase 007 packet: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment --strict` and record the exit code. Evidence: run after metadata regeneration in this reconciliation pass; final exit code recorded in `implementation-summary.md`.
- [x] T016 Verify no unintended edits landed outside the allowed Phase 007 write scope. Evidence: `git status --short -- .opencode/skills/sk-design .opencode/commands/design .opencode/specs/sk-design/009-sk-design-claude-parity` shows exactly the schema doc plus fourteen procedure cards changed under `sk-design`, zero changes under `.opencode/commands/design`, and this phase's own spec-tree entry (pre-existing untracked parent packet).
- [x] T017 Verify every row in the field-by-field diff table has an explicit sk-doc analog or a stated "no analog," with no blank or TBD cells. Evidence: `spec.md` diff rows all include an analog/verdict/gap entry.
- [x] T018 Verify Path B is selected by Phase 006, while Path A remains historical planning only. Evidence: Phase 006 ADR-001 Accepted Path B; no sk-doc template was created.
- [x] T019 Regenerate `description.json` and `graph-metadata.json` for this phase packet as the final step, after all content edits are complete. Evidence: regenerated via the scoped backfill/description scripts after this reconciliation pass's content edits were finished.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied or superseded by the accepted Phase 006 Path B decision.
- [x] All tasks required for audit, Path B implementation evidence, metadata regeneration, and strict validation are marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remain; Phase 006 has selected Path B.
- [x] Strict validation passes for the phase packet or produces only the accepted dirty-tree freshness warning.
- [x] This phase claims Path B completion only; Path A remains unexecuted and no sk-doc template was created.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
