---
title: "Implementation Plan: Phase 007 - Procedure Card Template Alignment"
description: "Plan for auditing sk-design's private procedure-card schema and fourteen existing cards against sk-doc's template canon, and executing whichever alignment path Phase 006 selects."
trigger_phrases:
  - "phase 007 plan"
  - "procedure-card template alignment plan"
  - "sk-doc canon path A"
  - "local schema tightening path B"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed Path B directly after Phase 006 resolved"
    next_safe_action: "No further action required; Phase 008 may proceed"
---
# Implementation Plan: Phase 007 - Procedure Card Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter, sk-doc template comparison |
| **Framework** | Spec Kit Level 3 packet layered on the existing `sk-design` five-mode architecture and sk-doc's asset/reference/feature-catalog template canon |
| **Storage** | File-based spec packet; audit findings recorded in `spec.md`; conditional new template file only if Phase 006 selects Path A |
| **Testing** | Spec strict validation, placeholder scan, field-by-field diff completeness review, canon-checker cross-reference (`parent-skill-check.cjs`) |

### Overview

This phase will audit `sk-design`'s fourteen procedure cards and `shared/procedure_card_schema.md` against sk-doc's `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md`, then plan a decision-conditioned alignment path gated on Phase 006's canon-verification outcome: Path A formalizes a new sk-doc canonical template and conforms all fourteen cards to it; Path B tightens the existing schema doc locally with the same rigor. This phase authors the plan only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 006 parent-skill canon-verification phase is authored and Accepted (ADR-001: Path B).
- [x] All fourteen existing procedure-card files and `shared/procedure_card_schema.md` were read at `.opencode/skills/sk-design/*/procedures/*.md` and `.opencode/skills/sk-design/shared/{procedure_card_schema.md,procedures/*.md}`.
- [x] sk-doc's `assets/skill/skill_asset_template.md`, `assets/skill/skill_reference_template.md`, and `assets/feature_catalog/feature_catalog_snippet_template.md` were read as comparison baselines.
- [x] The implementation boundary permitted edits within this Phase 007 packet plus the Path B targets named in `spec.md`'s Files to Change table (`shared/procedure_card_schema.md` and the fourteen procedure cards); `.opencode/skills/sk-doc/**` stayed read-only throughout.

### Definition of Done

- [x] Every one of the fourteen cards has an audit row recording frontmatter presence, section structure, and field list (see `tasks.md` Procedure Card Audit Evidence table).
- [x] A field-by-field diff table compares the schema's 7 required plus 4 optional fields against the closest sk-doc template's frontmatter and section conventions (see `spec.md` Preliminary Field-by-Field Diff).
- [x] Both Path A and Path B were planned with acceptance criteria, files-to-change, and a task breakdown; Phase 006 resolved (Path B) and this phase executed Path B directly.
- [x] Strict spec validation for this phase packet is run and its exit code recorded in `implementation-summary.md`. `implementation-summary.md` is created because implementation (Path B execution) did happen in this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Comparative template audit with a decision-conditioned dual-path plan, gated on an external phase's (006) canon decision.

### Key Components

- **Card inventory audit**: A per-card comparison of each of the fourteen cards' actual structure against the schema's Required/Optional Fields table and against sk-doc's frontmatter/numbering/checklist conventions.
- **Template comparison matrix**: The schema's dimensions mapped against `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md`, recorded as the Preliminary Field-by-Field Diff in `spec.md`.
- **Path A plan**: A new `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`, derived from `procedure_card_schema.md`'s field contract but reformatted into sk-doc's frontmatter + numbered-section + checklist + example conventions, plus a fourteen-card conformance task list.
- **Path B plan**: `procedure_card_schema.md` tightened in place with a required-field lint section and one embedded example card, with zero sk-doc edits.
- **Canon cross-reference**: Confirmation that `.opencode/commands/doctor/scripts/parent-skill-check.cjs`'s strict checks contain no reference to `procedures/` folders today, and a note on whether either path should extend that checker's coverage in a future phase.

### Data Flow

This phase reads the fourteen cards, the schema doc, and the three sk-doc templates; it produces a diff table and two fully specified execution plans in `spec.md`/`plan.md`/`tasks.md`; it writes nothing outside the Phase 007 spec folder. A later phase, picked up only after Phase 006's decision lands, consumes this plan to execute Path A or Path B.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase 007 spec packet | Planning and continuity surface | Authored Level 3 docs; no implementation | `validate.sh <phase-root> --strict` |
| `shared/procedure_card_schema.md` | Current sk-design-local card contract | Read-only in this phase; conditional target for Path A/B | Diff table in `spec.md` cites exact fields |
| Fourteen `sk-design` procedure cards | Existing private mode-local and shared cards | Read-only in this phase; audited, not edited | Per-card audit rows planned in `tasks.md` |
| sk-doc `assets/skill/` and `assets/feature_catalog/` templates | Comparison baseline | Read-only source evidence | Cited by exact section name in the diff table |
| `parent-skill-check.cjs` canon checker | Strict parent-skill canon gate exercised by Phase 006 | Read-only; searched for `procedures` references | `grep` confirmed zero matches |

Required inventories:
- Same-class producers: The fourteen procedure-card files, one per mode-owned or shared theme, classified by owning mode.
- Consumers of changed symbols: sk-doc's template canon and the parent-skill canon checker, both reviewed for whether they already account for procedure cards (they do not).
- Matrix axes: Schema dimension, sk-doc template analog, alignment verdict, concrete gap.
- Algorithm invariant: A planning-phase audit may record findings and propose paths, but it may not edit `sk-design/**` or `sk-doc/**` content.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Card and Schema Audit

- [ ] Read all fourteen procedure-card files and record frontmatter presence, section structure, and field order for each.
- [ ] Read `shared/procedure_card_schema.md` in full and extract its Required Fields, Optional Fields, Selection Rules, Source Adaptation Rules, and Shared Placement Rule.
- [ ] Confirm `.opencode/commands/doctor/scripts/parent-skill-check.cjs` has no reference to `procedures/` or `procedure`.

### Phase 2: Template Comparison

- [ ] Read `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md` in full.
- [ ] Build the field-by-field diff table: for every schema dimension, name the closest sk-doc analog or state "no analog."
- [ ] Classify each row as Aligned, Partially aligned, Not aligned, or sk-design-specific.

### Phase 3: Dual-Path Plan Authoring

- [ ] Draft Path A: new template path, derivation approach, cross-reference requirement to `skill_asset_template.md`, and the fourteen-card conformance task list.
- [ ] Draft Path B: schema-tightening approach, required-field lint definition, and the embedded-example-card requirement.
- [ ] Write acceptance criteria and a files-to-change table for each path so either is immediately executable once Phase 006 resolves.

### Phase 4: Verification and Handoff

- [ ] Run strict spec validation for this phase packet.
- [ ] Confirm no edits landed outside the Phase 007 packet during authoring.
- [ ] Confirm the plan states the Phase 006 dependency explicitly and does not silently assume either path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Required Level 3 docs and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict` |
| Placeholder scan | Template placeholders and sample residue | Validator output plus targeted text search if validation flags issues |
| Boundary audit | No edits outside Phase 007 root during packet authoring | `git diff -- .opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment` |
| Diff completeness review | Every schema dimension has a sk-doc analog or an explicit "no analog" verdict | Manual reviewer pass against the Preliminary Field-by-Field Diff in `spec.md` |
| Canon-checker cross-reference | Confirm `parent-skill-check.cjs` visibility claim | `grep -n "procedures\|procedure" .opencode/commands/doctor/scripts/parent-skill-check.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 006 parent-skill canon-verification decision | Internal phase | Not yet authored as of this phase | Blocks Path A/B selection; both paths remain planned but neither is executed |
| Fourteen existing procedure cards + schema doc | Source material | Read-only, available | Blocks the audit if cards are moved or renamed before this plan is executed |
| sk-doc `assets/skill/` + `assets/feature_catalog/` templates | Comparison baseline | Read-only, available | Blocks the diff if templates change materially before implementation |
| Existing five-mode `sk-design` architecture | Internal contract | Preserved | Blocks mode-local placement assumptions if the mode registry changes first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase packet validation fails in a way that cannot be corrected within the packet boundary, or the executed Path B edits are later found to be incorrect.
- **Procedure**: `git diff`/`git status` first to inspect the exact changed lines. If rollback is needed, revert only `.opencode/skills/sk-design/shared/procedure_card_schema.md` and the fourteen named procedure-card files (structural edits only — frontmatter and section numbering; no procedure-substance changes were made), plus this Phase 007 folder's own docs. No `.opencode/skills/sk-doc/**` content was ever touched, so no sk-doc rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 006 canon-verification decision -> Phase 007 audit + dual-path plan -> Phase 008 smart-routing optimization
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Card and Schema Audit | Phase 006 authored or explicitly noted pending | Template Comparison |
| Template Comparison | Card and Schema Audit | Dual-Path Plan Authoring |
| Dual-Path Plan Authoring | Template Comparison | Verification and Handoff |
| Verification and Handoff | Dual-Path Plan Authoring | Phase completion; downstream Path A/B execution |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Card and Schema Audit | Medium | 1-2 hours |
| Template Comparison | Medium | 1-2 hours |
| Dual-Path Plan Authoring | High | 2-4 hours |
| Verification and Handoff | Low | 0.5-1 hour |
| **Total** | | **4.5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Confirmed edits were allowed within the Phase 007 packet plus the named Path B targets (`shared/procedure_card_schema.md`, fourteen procedure cards) before executing them.
- [x] Confirmed no parent, sibling, external, or research folders were modified during packet authoring or Path B execution (scoped `git status` shows only the Path B targets and this phase's own untracked folder).
- [x] Confirmed the Path A template path was reviewed and not created; the Path B lint approach was reviewed and implemented as `## 4. Required-Field Lint`.

### Rollback Procedure

1. `git diff`/`git status` first to confirm the exact scope of any regression before reverting.
2. Revert only the Phase 007 packet docs if a doc-only correction is needed.
3. If the executed Path B edits need reversal: revert `shared/procedure_card_schema.md` and the fourteen named procedure-card files only (structural edits — frontmatter, section numbering — not procedure substance). `mode-registry.json`, `hub-router.json`, and mode `SKILL.md` files were never touched.
4. Re-run strict spec validation after any correction.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the Phase 007 planning docs and/or the Path B schema/card edits as needed; no persisted user data is touched by this phase, and no `sk-design`/`sk-doc` content beyond the named Path B targets was ever edited.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Fourteen procedure cards + schema doc
        |
        v
Card and schema audit ---> Template comparison ---> Dual-path plan authoring ---> Verification
        ^                          |
        |                          v
Phase 006 canon decision --> Path A/B execution gate (future phase)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Card and schema audit | Fourteen cards, schema doc | Per-card structure inventory | Template comparison |
| Template comparison | Card audit, sk-doc templates | Field-by-field diff table | Dual-path plan authoring |
| Path A plan | Diff table, sk-doc conventions | New-template spec + conformance task list | Future implementation (if selected) |
| Path B plan | Diff table, schema conventions | Tightening spec + lint definition | Future implementation (if selected) |
| Verification | Both path plans | Strict validation evidence | Phase completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Card and schema audit** - 1-2 hours - CRITICAL
2. **Template comparison** - 1-2 hours - CRITICAL
3. **Dual-path plan authoring** - 2-4 hours - CRITICAL
4. **Verification and handoff** - 0.5-1 hour - CRITICAL

**Total Critical Path**: 4.5-9 hours

**Parallel Opportunities**:
- Path A and Path B drafting can proceed in parallel once the diff table is stable, since neither depends on the other's content.
- The canon-checker cross-reference can run at any point after the audit phase, independent of the diff-table work.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Audit ready | All fourteen cards and the schema doc have recorded structure findings | After card and schema audit |
| M2 | Diff ready | Field-by-field diff table covers every schema dimension with an explicit sk-doc analog or "no analog" verdict | After template comparison |
| M3 | Dual-path plan ready | Both Path A and Path B have acceptance criteria, files-to-change, and task breakdowns | Before verification |
| M4 | Phase ready | Strict validation passes and the Phase 006 dependency is stated explicitly | Phase completion |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISIONS

| Decision | Rationale | Consequence |
|----------|-----------|-------------|
| Plan both paths instead of guessing Phase 006's outcome | Keeps this phase useful regardless of which way the canon decision lands, and avoids re-research after Phase 006 closes | This phase carries slightly more authoring weight than a single-path plan would |
| Treat the diff table as scoping evidence, not the full formal audit | Lets `spec.md` stay reviewable while `tasks.md` still tracks the complete per-card audit as pending work | The formal audit worksheet remains a task, not a finished deliverable, in this phase |
| Require identical rigor (lint + example) in both paths | Prevents Path B from becoming a lower-effort shortcut relative to Path A | Path B's scope is larger than a minimal doc edit would be |
| Require Path A to cross-reference `skill_asset_template.md` rather than duplicate it | Prevents sk-doc template sprawl if Path A is later selected | Path A's new template must explicitly justify what it adds beyond the existing asset template |

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the current task scope permits edits only inside this Phase 007 packet before any writes.
- Confirm the fourteen cards, schema doc, and three sk-doc templates are all readable without modification.
- Confirm Phase 006's status (authored or not) is checked and stated rather than assumed.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Complete the card-and-schema audit before drafting either path. |
| TASK-SCOPE | Make zero edits to `sk-design/**` or `sk-doc/**` during this planning phase. |
| TASK-PROOF | Every planned path must include acceptance criteria and a files-to-change table, not prose intent alone. |

### Status Reporting Format

Use `STATUS=<planned|blocked|validated> PHASE=007 DETAIL=<short detail>` for handoff updates.

### Blocked Task Protocol

If Phase 006 has not landed a decision when this phase is picked up for execution, both Path A and Path B stay in `planned` status; do not default to either path without an explicit decision record amendment.
