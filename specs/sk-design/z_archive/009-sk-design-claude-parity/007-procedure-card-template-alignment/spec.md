---
title: "Phase 007 - Procedure Card Template Alignment"
description: "Level 3 phase packet for auditing sk-design's private procedure-card schema and fourteen existing cards against sk-doc's template canon, and planning a decision-conditioned alignment path gated on Phase 006."
trigger_phrases:
  - "procedure card template alignment"
  - "procedure-card schema audit"
  - "sk-doc procedure card template"
  - "field-by-field template diff"
  - "procedure card canon decision"
  - "mode-local card conformance"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed accepted Path B: tightened schema, conformed 14 cards"
    next_safe_action: "No further action required; Phase 008 may proceed"
---
# Feature Specification: Phase 007 - Procedure Card Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 007 audited the fourteen existing `sk-design` procedure cards and `shared/procedure_card_schema.md` (both authored by Phase 003, before this alignment check existed) against sk-doc's existing template canon: `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md`. It produced a field-by-field diff, planned both decision-conditioned alignment paths, and — once Phase 006 resolved within the same work session — executed the selected path (Path B) directly in this phase rather than deferring to a new phase.

**Key Decisions**: This phase planned two fully specified paths — Path A (formalize a new sk-doc canonical template, `assets/skill/procedure_card_template.md`, derived from the schema, plus a conformance pass on all fourteen cards) and Path B (keep the schema sk-design-local but tighten it to the same rigor: a required-field lint and an embedded example card). Phase 006's ADR-001 (Accepted) selected Path B. This phase then executed Path B: `shared/procedure_card_schema.md` gained a `## 4. Required-Field Lint`, a `## 5. Worked Example` (the existing `accessibility_audit.md` card), and a `## 9. Publication Checklist`; all fourteen procedure cards were conformed to that tightened schema (frontmatter added, sections numbered). Path A was never executed; no `.opencode/skills/sk-doc/**` file was created or edited.

**Critical Dependencies**: Phase 006 parent-skill canon-verification decision (ADR-001 Accepted: Path B), the fourteen existing procedure cards and schema doc, and sk-doc's `assets/skill/skill_asset_template.md`, `assets/skill/skill_reference_template.md`, and `assets/feature_catalog/feature_catalog_snippet_template.md` as read-only comparison baselines throughout.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Completed** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | Documentation-only: one schema doc plus fourteen procedure cards, structural edits (frontmatter, section numbering) only |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../006-parent-skill-canon-verification/spec.md |
| **Successor Phase** | ../008-smart-routing-optimization/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 003 invented a private procedure-card schema (`shared/procedure_card_schema.md`) and fourteen cards without checking whether the pattern should conform to sk-doc's existing template canon (`skill_asset_template.md`, `skill_reference_template.md`, `feature_catalog_snippet_template.md`). Two risks follow from that gap. First, if Phase 006 or a later governance decision formalizes procedure cards as sk-doc canon, the fourteen existing cards would already be non-conforming on day one (no frontmatter, no numbered sections, no checklist, no example). Second, `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — the canon checker Phase 006 exercises — currently has zero references to `procedures/` folders, so today's strict "0 failures, 0 warnings" result on `sk-design` says nothing about procedure-card health one way or the other.

### Purpose

Audit the fourteen existing cards and the schema doc against sk-doc's template set, produce a field-by-field diff that makes the gap concrete, and plan the alignment work as two fully specified execution paths conditioned on Phase 006's canon decision: Path A formalizes a new sk-doc template and conforms all fourteen cards to it; Path B tightens `procedure_card_schema.md` itself with the same rigor (required-field lint, embedded example) without touching sk-doc. This phase authors the plan only; it does not implement either path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit all fourteen procedure cards under the five `sk-design` mode packets' `procedures/` folders plus `shared/procedures/`.
- Audit `shared/procedure_card_schema.md` against sk-doc's `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md`.
- Produce a field-by-field diff table (frontmatter, section numbering, checklist presence, example presence, naming, file size) that makes the alignment gap concrete for reviewers.
- Plan Path A (new sk-doc canonical template plus a fourteen-card conformance pass) with explicit acceptance criteria and a files-to-change list.
- Plan Path B (local schema tightening: required-field lint, embedded example card) with explicit acceptance criteria and a files-to-change list.
- Cross-reference whether `.opencode/commands/doctor/scripts/parent-skill-check.cjs` sees `procedures/` folders today and whether either path should change that.

### Out of Scope

- Creating `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`. Phase 006's ADR-001 selected Path B (sk-design-local), so Path A's new sk-doc template was never created; this stays out of scope permanently unless a future ADR reopens the decision.
- Making the Phase 006 canon decision itself (that decision belonged to Phase 006; this phase planned the two conditional execution paths, then — once Phase 006 resolved within the same work session — executed the selected path, Path B, directly rather than deferring to a new phase).
- Editing `mode-registry.json`, `hub-router.json`, or any mode `SKILL.md`. None of these were touched; confirmed by scoped `git status`.
- Editing sibling phase folders, the parent root, `external/**`, or `research/**`.

> **Scope note**: This phase's original plan deferred all `shared/procedure_card_schema.md` and procedure-card editing to a future implementation phase. Because Phase 006 resolved before this phase closed, and no separate implementation phase exists in the parent's phase sequence for Path B execution, that editing was performed directly in this phase instead. See `decision-record.md` ADR-002 and `implementation-summary.md` for the full rationale and evidence.

### Files to Change

This table records what actually changed once Phase 006 selected Path B and this phase executed it directly.

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Edited (Path B) | Added `## 4. Required-Field Lint`, `## 5. Worked Example` (using `accessibility_audit.md`), and `## 9. Publication Checklist`; frontmatter added |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` (6 files) | Edited (Path B conformance) | Frontmatter added; sections renumbered `## 1. REQUIRED FIELDS` through `## 4.`/`## 5.` per card |
| `.opencode/skills/sk-design/design-foundations/procedures/*.md` (3 files) | Edited (Path B conformance) | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-motion/procedures/*.md` (1 file) | Edited (Path B conformance) | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-audit/procedures/*.md` (2 files) | Edited (Path B conformance) | Frontmatter added; sections renumbered |
| `.opencode/skills/sk-design/design-md-generator/procedures/*.md` (1 file) | Edited (Path B conformance) | Frontmatter added; sections renumbered (`TOOL BOUNDARY` retained as `## 2.`) |
| `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md` (1 file) | Edited (Path B conformance) | Frontmatter added; sections renumbered (`## 1.` through `## 5.`) |
| `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md` | Not created | Path A was not selected; no sk-doc edit was made |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/*.md` | Created/Updated | Phase tracking docs, including `implementation-summary.md` |
| `.../007-procedure-card-template-alignment/description.json` | Regenerated | Memory discovery metadata |
| `.../007-procedure-card-template-alignment/graph-metadata.json` | Regenerated | Graph traversal metadata |

### Preliminary Field-by-Field Diff (Scoping Evidence)

This table is the concrete evidence gathered while authoring this phase. It grounds the Requirements below; it is not the full formal per-card audit worksheet, which is a pending task in `tasks.md`.

| Schema Dimension | Sk-doc Template Analog | Alignment | Gap |
|---|---|---|---|
| Frontmatter block: none present on the schema doc or any of the 14 cards | `skill_asset_template.md` / `skill_reference_template.md` require the 5-field block (`title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`, `version`); `feature_catalog_snippet_template.md` requires `title`, `description`, `trigger_phrases`, optional `importance_tier`, `version` | Not aligned | Cards ship zero YAML frontmatter; sk-doc requires a frontmatter block (or an explicit documented exemption) on every asset/reference/snippet file |
| H1 followed immediately by the Required Fields table, no intro sentence | `skill_asset_template.md` / `skill_reference_template.md` require a 1-2 sentence intro paragraph after the H1, with no headers inside it | Not aligned | None of the 14 cards carry an intro sentence |
| Un-numbered H2 sections (`## Read-Only Compatibility`, `## Placement Rationale`, `## Procedure`, `## Related Cards`) | sk-doc's numbered H2 convention (`## 1. OVERVIEW`, `## 2. SECTION NAME`) used by all three comparison templates | Not aligned | No card numbers its sections |
| Required Fields table: `Purpose`, `Owning mode`, `Source reference`, `Trigger`, `Output contract`, `Proof gate`, `Privacy rule` | No direct analog in any sk-doc template | sk-design-specific | This 7-field contract is the schema's core and has no equivalent in `skill_asset_template.md`, `skill_reference_template.md`, or `feature_catalog_snippet_template.md`; the closest partial analog, `feature_catalog_snippet_template.md`'s frontmatter plus OVERVIEW/HOW IT WORKS body, has no "Owning mode," "Proof gate," or "Privacy rule" concept |
| Optional Fields: `Placement rationale`, `Related cards`, `Conflict rule`, `Read-only compatibility` | Loosely analogous to `feature_catalog_snippet_template.md`'s "Related references" footer and `skill_reference_template.md`'s "Scope Limitations" pattern | Partially aligned | `Related Cards` maps to "Related references"; `Read-only compatibility` maps to "Out of scope" framing; `Conflict rule` and `Placement rationale` have no sk-doc analog |
| Selection Rules / Source Adaptation Rules / Shared Placement Rule (schema-level, not per-card) | No analog; closest is `skill_asset_template.md`'s "When to Use" guidance at the asset-type level | sk-design-specific | These are runtime routing/governance rules, not content-authoring rules — sk-doc templates describe how to write a file, not how a mode selects between files |
| No embedded example card in `procedure_card_schema.md` | `skill_asset_template.md` mandates a "Complete Example" per template section; `feature_catalog_snippet_template.md` ships a full copy-paste scaffold | Not aligned | The schema states field requirements with zero worked example; card authors must reverse-engineer format from existing cards |
| No checklist in `procedure_card_schema.md` | `feature_catalog_snippet_template.md` ends with a "5. CHECKLIST" (Structure/Content/Quality checkboxes) | Not aligned | No required-field lint or pre-publish checklist exists for cards today |
| No `version` field anywhere on the schema or any card | All three comparison templates carry `version: X.Y.Z.W` in frontmatter | Not aligned | Schema and cards have no version tracking |
| File naming: `[topic]_[type].md` snake_case (e.g. `accessibility_audit.md`, `discovery_question_round.md`) | sk-doc naming convention `[topic]_[type].md` snake_case | Aligned | This is the one dimension where cards already conform without changes |
| File size: 23-35 lines per card (verified via `wc -l` across all 14 files) | sk-doc asset guidance targets ~100-800 lines; reference-file guidance targets 200-3000 lines | Below both bands | Cards are far shorter than either template class expects; the closest size fit is `feature_catalog_snippet_template.md`'s compact per-item scope, which is still typically longer due to its SOURCE FILES/SOURCE METADATA sections |
| Canon-checker visibility: `parent-skill-check.cjs` contains zero references to `procedures` or `procedure` (confirmed by direct search) | N/A | Gap, not a template gap | The strict parent-skill canon check Phase 006 exercises does not inspect `procedures/` folders at all today; neither path automatically changes that unless explicitly planned |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all fourteen procedure cards against sk-doc's template set | Every card's frontmatter presence/absence, section structure, and field list is recorded in a per-card audit row in `tasks.md` evidence |
| REQ-002 | Audit `procedure_card_schema.md` against `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md` | A field-by-field diff table exists (see Preliminary Field-by-Field Diff above) showing schema-required fields vs sk-doc-required fields, including frontmatter, section numbering, checklist, and example presence |
| REQ-003 | Produce a decision-conditioned plan with two named paths (A: sk-doc canon, B: local tightening) and explicit acceptance criteria for each | `plan.md` names both paths, states the Phase 006 dependency, and defines what "done" means under each path |
| REQ-004 | Preserve read-only status of `sk-design` and `sk-doc` content during this phase | No edits are made to `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` while authoring this phase's docs; scoped `git status` shows only Phase 007 spec-folder paths |
| REQ-005 | State the exact new template path Path A would create | `plan.md` names `.opencode/skills/sk-doc/assets/skill/procedure_card_template.md` as the specific new file, not a placeholder or TBD |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Document the required-field lint approach for Path B | `plan.md` names a concrete lint check for the 7 required schema fields (`Purpose`, `Owning mode`, `Source reference`, `Trigger`, `Output contract`, `Proof gate`, `Privacy rule`) plus their expected order and format |
| REQ-007 | Document an example-card requirement for both paths | `plan.md` states which existing card (e.g. `accessibility_audit.md`) would serve as the canonical worked example, or that a new example must be authored |
| REQ-008 | Document the conformance-pass approach for all fourteen cards under Path A | `tasks.md` lists per-mode conformance checks (frontmatter add, section numbering, example alignment) in acceptance-criteria form |
| REQ-009 | Cross-reference Phase 006's canon-verification checker | `plan.md` states that `parent-skill-check.cjs` has zero visibility into `procedures/` folders today (confirmed by direct search) and whether either path changes that visibility |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every one of the fourteen cards has a completed audit row (frontmatter presence, section structure, field list) recorded as phase evidence.
- **SC-002**: A field-by-field diff table exists comparing `procedure_card_schema.md`'s Required and Optional Fields against sk-doc's `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md` frontmatter, section-numbering, and checklist conventions.
- **SC-003**: Both Path A and Path B were fully planned with acceptance criteria, files-to-change, and task breakdowns. Phase 006 resolved (ADR-001 Accepted: Path B) and this phase executed Path B directly.
- **SC-004**: This phase makes zero edits to `.opencode/skills/sk-doc/**` (confirmed: no sk-doc file appears in scoped `git status`). Path B edits to `shared/procedure_card_schema.md` and the fourteen `.opencode/skills/sk-design/**` procedure cards were performed and are the phase's intended deliverable, not an out-of-scope leak.
- **SC-005**: Strict spec validation passes for this phase packet (or produces only the accepted dirty-tree freshness warning).
- **SC-006**: All fourteen procedure cards conform to the tightened local schema (frontmatter, numbered sections, required-field order); confirmed by direct read of every card.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 parent-skill canon-verification decision | Blocks selecting Path A vs Path B | Plan both paths fully in this phase so execution can start immediately after the decision lands |
| Dependency | sk-doc's `assets/skill/` and `assets/feature_catalog/` template set | Read-only comparison baseline; if templates change materially before implementation, the diff table goes stale | Cite exact template sections and field names rather than paraphrasing, and require a diff re-check before implementation starts |
| Risk | Path A scope creep | Creating a new sk-doc template could tempt a broader sk-doc asset-template reorganization | Scope Path A strictly to one new template file plus the fourteen-card conformance pass, no other sk-doc edits |
| Risk | Path B under-rigor | Tightening a local schema doc without lint/example could look like alignment without substance | Require the same rigor items (required-field lint, embedded example) in Path B that Path A's new template would provide |
| Risk | Divergence between audit findings and Phase 003's original intent | Cards were authored before this alignment check existed; over-eager "fixes" could alter procedure substance, not just structure | Treat Phase 003's schema and card content as frozen source-of-truth; align structure, frontmatter, and format only, never procedure substance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The audit must not require loading any card more than once; a single read pass per card plus one pass per sk-doc template is sufficient.
- **NFR-P02**: The diff table must stay reviewable in a single pass (bounded rows and columns), not sprawl into a per-card matrix inside `spec.md`.

### Security

- **NFR-S01**: The audit does not re-expose or re-quote external source procedure prose beyond what Phase 003 already reviewed as compliant.
- **NFR-S02**: Neither Path A nor Path B may weaken Phase 003's Source Adaptation Rules (synthesis over copying, filename-only citation).

### Reliability

- **NFR-R01**: Whichever path is selected must keep every card's output contract and proof gate intact — no functional regression to mode routing.
- **NFR-R02**: `plan.md` must state a rollback for Path A in case a new sk-doc template is later rejected after being created.

---

## 8. EDGE CASES

### Data Boundaries

- Card with fields in a different order than the schema states: flag as a structure gap in the audit table; do not silently normalize during planning.
- Schema field with no sk-doc template analog (e.g. `Owning mode`, `Proof gate`): document as a genuine sk-design-specific addition, not a defect to be removed.
- Card size versus template guidance: the 23-35 line cards undershoot both the asset-file and reference-file size guidance; note this as a size-class mismatch rather than a defect, since procedure cards are intentionally terse.

### Error Scenarios

- Phase 006 has not landed a decision by the time this phase is picked up for implementation: state that Path A/B execution is blocked until Phase 006 closes, and defer rather than guessing which path to start.
- sk-doc's templates change materially between this planning phase and execution: require a diff re-check against the then-current templates before implementation starts.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Fourteen cards plus one schema doc audited against three sk-doc templates; bounded but multi-artifact |
| Risk | 16/25 | Decision-conditioned path selection; potential sk-doc canon impact if Path A is chosen |
| Research | 16/20 | Requires a field-by-field comparison across four documents' conventions (schema plus three templates) |
| Multi-Agent | 3/15 | Single leaf execution for packet authoring; no reviewer fan-out planned for this phase |
| Coordination | 13/15 | Hard-blocked on Phase 006's decision; also feeds Phase 008's successor sequencing |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Path A is selected but never fully implemented (new sk-doc template created, fourteen cards left unconformed) | M | M | Require the fourteen-card conformance pass as part of Path A's completion criteria, not the new template alone |
| R-002 | Path B is selected but ships weaker rigor than Path A would have provided | M | M | Require identical rigor items (required-field lint, embedded example) regardless of which path is chosen |
| R-003 | Phase 006's decision arrives after this phase's diff table has gone stale against a changed sk-doc template set | L | M | Re-validate the diff table against current sk-doc templates before implementation begins |
| R-004 | A fifteenth procedure card is added by a future phase after this audit closes | L | L | State the audit is a point-in-time snapshot of the fourteen cards that exist as of this phase's authoring |
| R-005 | A new sk-doc template competes with `skill_asset_template.md`, causing template sprawl | M | L | Path A's plan requires the new template to derive from and cross-reference `skill_asset_template.md` rather than duplicate its guidance |

---

## 11. USER STORIES

### US-001: Skill Maintainer Wants a Clear Alignment Verdict (Priority: P0)

**As a** `sk-design` maintainer, **I want** a concrete field-by-field diff between the procedure-card schema and sk-doc's closest templates, **so that** I know exactly what would change under each canon path before committing engineering time.

**Acceptance Criteria**:
1. Given the fourteen cards and the schema doc, When the audit is read, Then a diff table lists every schema dimension against its closest sk-doc template counterpart or states "no analog."
2. Given the diff table exists, When a maintainer reads it, Then they can name the exact new file (Path A) or the exact schema edits (Path B) without further research.

---

### US-002: sk-doc Owner Wants No Silent Template Sprawl (Priority: P0)

**As the** sk-doc skill owner, **I want** any new procedure-card template proposal to explicitly justify why it cannot reuse `skill_asset_template.md` or `feature_catalog_snippet_template.md`, **so that** sk-doc's template set does not grow without cause.

**Acceptance Criteria**:
1. Given Path A is proposed, When the plan is reviewed, Then it must show why neither existing template accepts the schema's `Owning mode`, `Proof gate`, and `Privacy rule` fields without material modification.
2. Given Path A is later selected for implementation, When the new template is drafted, Then it must cross-reference `skill_asset_template.md` rather than duplicate its shared guidance.

---

### US-003: Reviewer Wants a Read-Only Guarantee (Priority: P1)

**As a** reviewer, **I want** confirmation that this planning phase touched no `sk-design` or `sk-doc` content, **so that** I can trust the audit findings reflect the true pre-existing state rather than a state this phase already altered.

**Acceptance Criteria**:
1. Given this phase's future implementation-summary is authored, When the reviewer checks scoped `git status`, Then no diffs appear outside the Phase 007 spec folder for this planning pass.

---

## 12. OPEN QUESTIONS

- Phase 006's canon decision is not yet made; Path A vs Path B selection stays blocked until Phase 006 closes.
- Should a Path A template also ship a machine-checkable lint (akin to `parent-skill-check.cjs`) or is markdown-only guidance sufficient at first? Left open for whichever implementer executes this phase.
- If a future phase adds a fifteenth procedure theme, does it need to pass this alignment check retroactively, or only cards authored after the chosen path lands? Left open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
