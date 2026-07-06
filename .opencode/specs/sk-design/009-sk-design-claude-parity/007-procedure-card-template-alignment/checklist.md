---
title: "Verification Checklist: Phase 007 - Procedure Card Template Alignment"
description: "Executed Level 3 verification checklist for the audited procedure-card template alignment and executed Path B schema/card conformance."
trigger_phrases:
  - "phase 007 checklist"
  - "procedure-card alignment verification"
  - "template diff review"
importance_tier: "high"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all Phase 007 checklist rows with fresh evidence after Path B execution."
    next_safe_action: "No further action required; Phase 008 may proceed."
---
# Verification Checklist: Phase 007 - Procedure Card Template Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | Hard blocker | Cannot claim phase implementation complete until verified |
| **[P1]** | Required | Must complete or receive explicit approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` with audit scope, diff-table scope, and no public-facing or public-taxonomy change implied [EVIDENCE: `spec.md` §3 Scope and Preliminary Field-by-Field Diff table.]
  - **Evidence**: `spec.md` §3 names the audit and diff-table scope explicitly; Path B's execution only tightens a private, sk-design-local schema and its fourteen private cards — no public `sk-design` mode, taxonomy, or routing surface changed.
- [x] CHK-002 [P0] Technical approach defined in `plan.md` with a decision-conditioned Path A / Path B structure and an explicit Phase 006 dependency [EVIDENCE: `plan.md` §1/§4 name both paths and the Phase 006 gate.]
  - **Evidence**: `plan.md` names both paths with acceptance criteria; Phase 006's ADR-001 (Accepted: Path B) is cited as the resolving dependency.
- [x] CHK-003 [P0] Decision record documents why this phase plans both paths instead of pre-selecting one [EVIDENCE: `decision-record.md` ADR-001.]
  - **Evidence**: `decision-record.md` ADR-001 records the rationale (plan both, avoid guessing Phase 006's outcome) with a 4-option Alternatives Considered table and 5/5 Five Checks PASS.
- [x] CHK-004 [P1] Dependencies on Phase 006 and on sk-doc's template set are understood before implementation starts; all fourteen procedure-card files and the three sk-doc templates were read and cited [EVIDENCE: `tasks.md` T001-T007.]
  - **Evidence**: `tasks.md` T001 cites Phase 006's Accepted ADR-001; T002-T003 read all fourteen cards and the schema; T005-T007 read `skill_asset_template.md`, `skill_reference_template.md`, and `feature_catalog_snippet_template.md` in full, independently re-confirmed present and untouched at `.opencode/skills/sk-doc/assets/skill/` and `.opencode/skills/sk-doc/assets/feature_catalog/`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The field-by-field diff table covers frontmatter, intro convention, section numbering, the Required Fields table, Optional Fields, Selection/Adaptation/Placement rules, example presence, checklist presence, versioning, naming, and file size [EVIDENCE: `spec.md` Preliminary Field-by-Field Diff, 12 rows.]
  - **Evidence**: `spec.md`'s diff table has 12 rows covering every dimension named in this check; each row states an explicit sk-doc analog, "sk-design-specific," or "Aligned"/"Not aligned" verdict.
- [x] CHK-011 [P0] Every one of the fourteen procedure cards has an audit row recording frontmatter presence, section structure, and field order [EVIDENCE: `tasks.md` Procedure Card Audit Evidence table, 14 rows.]
  - **Evidence**: `tasks.md`'s audit table lists all fourteen cards with owning location, frontmatter presence, section headings, and field-order verdict; independently re-confirmed by direct `grep -E "^## "` on all fourteen files, which matches the table exactly.
- [x] CHK-012 [P0] Path A names the exact new template path (`.opencode/skills/sk-doc/assets/skill/procedure_card_template.md`) rather than a placeholder [EVIDENCE: `spec.md` REQ-005, `plan.md` §3.]
  - **Evidence**: `spec.md` REQ-005 and `plan.md`'s Key Components both name the exact path. The file was never created; confirmed by scoped `git status` showing no `.opencode/skills/sk-doc/**` change.
- [x] CHK-013 [P0] Path A's plan does not silently expand the public `sk-design` taxonomy; it only proposes a new sk-doc authoring template plus a conformance pass on existing private cards [EVIDENCE: `spec.md`/`plan.md` scope Path A to one new file plus fourteen-card conformance.]
  - **Evidence**: `plan.md`'s Architecture Decisions table requires Path A to cross-reference `skill_asset_template.md` rather than duplicate it; no public mode, `mode-registry.json`, or `hub-router.json` change is proposed by either path.
- [x] CHK-014 [P1] Path B's plan states the required-field lint definition (7 fields, in order, non-empty) with the same rigor Path A would provide [EVIDENCE: `shared/procedure_card_schema.md` `## 4. Required-Field Lint`.]
  - **Evidence**: The executed schema's `## 4. Required-Field Lint` states a 10-point lint including the 7 required fields in order (Purpose, Owning mode, Source reference, Trigger, Output contract, Proof gate, Privacy rule) and non-empty-value requirements.
- [x] CHK-015 [P1] The plan cross-references `skill_asset_template.md` for Path A instead of duplicating its shared guidance [EVIDENCE: `plan.md` Architecture Decisions table.]
  - **Evidence**: `plan.md`'s Architecture Decisions table states this requirement explicitly for whichever future implementer might revisit Path A.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every diff-table row states an explicit sk-doc analog or an explicit "no analog" verdict; no blank or TBD cells [EVIDENCE: `spec.md` diff table, all 12 rows populated.]
  - **Evidence**: Direct read of `spec.md`'s Preliminary Field-by-Field Diff table confirms no blank/TBD cell across all 12 rows.
- [x] CHK-021 [P0] The canon-checker cross-reference claim (`parent-skill-check.cjs` has zero `procedures` references) is verified by a direct search command, not assumed [EVIDENCE: `grep -n "procedures\|procedure" .opencode/commands/doctor/scripts/parent-skill-check.cjs` returns no output.]
  - **Evidence**: Re-run fresh during this verification pass: `grep -n "procedures\|procedure" .opencode/commands/doctor/scripts/parent-skill-check.cjs` produced zero matches, confirming `tasks.md` T004's claim.
- [x] CHK-022 [P0] Neither path's plan requires editing procedure content in a way that would violate Phase 003's Source Adaptation Rules [EVIDENCE: executed edits are structural only (frontmatter, numbering); Purpose/Trigger/Output contract/Proof gate text is byte-identical to the pre-existing cards.]
  - **Evidence**: `git diff` on all fourteen cards shows only frontmatter insertion and `##` heading renumbering; the Required Fields table rows (Purpose, Owning mode, Source reference, Trigger, Output contract, Proof gate, Privacy rule) are unchanged text.
- [x] CHK-023 [P1] The plan states which existing card would serve as the schema's embedded worked example if Path B is selected [EVIDENCE: `shared/procedure_card_schema.md` `## 5. Worked Example` uses `accessibility_audit.md` verbatim.]
  - **Evidence**: The executed schema's `## 5. Worked Example` embeds the `accessibility_audit.md` card's full content as the canonical example, matching `plan.md`'s REQ-007 requirement.
- [x] CHK-024 [P1] The plan's acceptance criteria distinguish structural alignment (frontmatter, numbering, checklist) from procedure-substance changes, and scope this phase to the former only [EVIDENCE: `decision-record.md` ADR-002 Implementation section.]
  - **Evidence**: ADR-002's Implementation section states plainly that no procedure-card substance (Purpose/Owning mode/Source reference/Trigger/Output contract/Proof gate/Privacy rule content) changed — structural alignment only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Both Path A and Path B declare a files-to-change table [EVIDENCE: `spec.md` Files to Change table; `tasks.md` T009-T014.]
  - **Evidence**: `spec.md`'s Files to Change table lists the schema doc, all six owning-location card buckets, and the conditional Path A template path with actual (not planned) change types recorded post-execution.
- [x] CHK-031 [P0] Both Path A and Path B declare acceptance criteria sufficient to start implementation without further scoping [EVIDENCE: `plan.md` §4 Phase 3; both paths' criteria were sufficient — Path B executed with zero re-scoping.]
  - **Evidence**: Path B was executed directly from this phase's own pre-existing plan with no additional research or re-scoping required, confirming the acceptance criteria were sufficient.
- [x] CHK-032 [P1] The Path A conformance task list names each of the six mode-owning locations (`design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, `shared`) and the exact card count each owns [EVIDENCE: `tasks.md` T010.]
  - **Evidence**: `tasks.md` T010 records the six locations and counts (6/3/1/2/1/1 = 14), matching the actual card inventory confirmed by direct file listing.
- [x] CHK-033 [P1] `implementation-summary.md` is present because Path B was executed in this phase; its absence would now be a defect, not an expected omission [EVIDENCE: `implementation-summary.md` created in this verification pass.]
  - **Evidence**: `implementation-summary.md` now exists, documenting the executed Path B evidence, files changed, and verification results. Its earlier absence (before this verification pass) was a real gap that this pass closed, not an intentional omission — the original "planning only" framing was superseded once Phase 006 resolved and Path B was executed within this same phase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No hardcoded secrets or private external notes appear in any of this phase's docs [EVIDENCE: full read of all Phase 007 docs; none found.]
  - **Evidence**: Review of `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` confirms no secrets or private external notes.
- [x] CHK-041 [P0] This phase's docs do not expose or re-quote external source procedure prose beyond what Phase 003 already reviewed as compliant [EVIDENCE: cards cite external sources by filename only (e.g. `accessibility-audit.md`); no source prose reproduced.]
  - **Evidence**: The worked example and all fourteen cards cite `Source reference` by filename only; no external prompt body or source excerpt appears in the schema or any card.
- [x] CHK-042 [P1] Neither Path A nor Path B proposes weakening Phase 003's filename-only source-citation rule [EVIDENCE: `shared/procedure_card_schema.md` `## 7. Source Adaptation Rules` unchanged in substance, still requires filename-only citation.]
  - **Evidence**: The executed schema's `## 7. Source Adaptation Rules` (renumbered from the pre-existing section, content preserved) still states "Cite only the external source filename" and "Do not include long source excerpts... or proprietary prompt text."
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` stay synchronized and consistent on the Path A / Path B framing [EVIDENCE: this verification pass reconciled all five docs to the executed Path B state.]
  - **Evidence**: All five docs now state Status Complete / ADR-001 and ADR-002 Accepted / Path B executed, with `spec.md`'s Files to Change table, `plan.md`'s Definition of Done, `tasks.md`'s Phase 3 tasks, and `checklist.md` (this file) all reconciled to the same evidence in this pass.
- [x] CHK-051 [P0] `description.json` and `graph-metadata.json` exist in the Phase 007 root, generated as the final step after all content edits [EVIDENCE: both regenerated after this reconciliation pass's content edits were complete.]
  - **Evidence**: Both files were regenerated via the scoped backfill/description scripts as the last step, after all content edits in this pass were finished.
- [x] CHK-052 [P1] Every doc in this phase states the actual completion status and makes no conflicting completion claim about Path A or Path B implementation [EVIDENCE: `spec.md`/`plan.md` Status fields read "Complete"; Path A is explicitly stated as never executed.]
  - **Evidence**: `spec.md` Metadata Status is "Complete"; every doc distinguishes Path B (executed) from Path A (planned only, never executed) consistently.
- [x] CHK-053 [P1] No standard spec artifact in this phase includes a Table of Contents section [EVIDENCE: none of the six docs contain a `## Table of Contents` or `## TOC` heading.]
  - **Evidence**: Confirmed by direct read of all six Phase 007 docs; no TOC heading present in any.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] This phase's authoring writes only inside `.opencode/specs/sk-design/009-sk-design-claude-parity/007-procedure-card-template-alignment/` plus the named Path B execution targets [EVIDENCE: scoped `git status --short` shows exactly this phase's folder (untracked) plus `shared/procedure_card_schema.md` and the fourteen procedure cards (modified), nothing else.]
  - **Evidence**: `git status --short -- .opencode/skills/sk-design .opencode/commands/design .opencode/specs/sk-design/009-sk-design-claude-parity` lists exactly 15 modified `sk-design` files (schema + 14 cards) and one untracked spec-tree entry (this parent packet, pre-existing from the 2026-07-06 track rename); no `.opencode/commands/design/**` change.
- [x] CHK-061 [P1] Scoped `git status --short -- .opencode/skills/sk-design .opencode/skills/sk-doc` shows changes only to the Path B execution targets, none to `sk-doc` [EVIDENCE: 15 files changed, all under `sk-design`; zero under `sk-doc`.]
  - **Evidence**: The 15 changed files are `shared/procedure_card_schema.md` plus the fourteen procedure cards, all under `.opencode/skills/sk-design/`; `.opencode/skills/sk-doc/**` shows zero changes.
- [x] CHK-062 [P1] No stray or scratch artifacts exist under the Phase 007 packet [EVIDENCE: directory listing shows exactly the eight expected files.]
  - **Evidence**: `ls` of the Phase 007 folder shows `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` — no extras.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 11 | 11/11 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-06 — Path B execution and full-packet reconciliation pass.
**Verified By**: claude-sonnet-5.
**Gate Status**: CLOSED. All P0/P1/P2 items are verified with fresh evidence: all fourteen cards conform to the tightened schema, the canon-checker cross-reference is re-confirmed empty, and `spec.md`/`plan.md`/`tasks.md`/`decision-record.md`/`implementation-summary.md` are synchronized on the executed Path B state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision is documented in `decision-record.md` [EVIDENCE: ADR-001 (plan both paths) and ADR-002 (execute Path B directly), both Accepted.]
- [x] CHK-101 [P1] Alternatives include pre-selecting Path A only, pre-selecting Path B only, deferring all planning until Phase 006 closes, and planning both [EVIDENCE: ADR-001 Alternatives Considered, 4 options scored.]
- [x] CHK-102 [P1] Rejection rationale is documented for pre-selecting a single path ahead of Phase 006's decision [EVIDENCE: ADR-001 Alternatives Considered table, "Cons" column for both single-path options.]
- [x] CHK-103 [P2] A migration path is documented if a partial procedure-card alignment effort already exists elsewhere before this phase [EVIDENCE: none existed; Phase 003 was the sole prior author, confirmed by the audit.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] The audit reads each card and each sk-doc template exactly once, avoiding redundant re-reads [EVIDENCE: `tasks.md` T002-T007 single-pass reads.]
- [x] CHK-111 [P1] The diff table stays reviewable in a single pass rather than sprawling into a per-card matrix inside `spec.md` [EVIDENCE: `spec.md` diff table is 12 rows; per-card detail lives in `tasks.md` instead.]
- [x] CHK-112 [P2] A performance benchmark is documented if a runtime lint mechanism is added under Path A or Path B [EVIDENCE: the executed Path B lint (`## 4. Required-Field Lint`) is a manual pre-publish checklist, not a runtime mechanism; no benchmark applies.]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure is documented in `plan.md` for the executed Path B edits [EVIDENCE: `plan.md` §7 Rollback Plan names the exact files to revert.]
- [x] CHK-121 [P0] Implementation boundary is confirmed for the write performed to `sk-design/**`; `sk-doc/**` stayed untouched [EVIDENCE: scoped `git status` shows 15 `sk-design` files changed, 0 `sk-doc` files changed.]
- [x] CHK-122 [P1] Handoff notes identify Phase 006 as the resolving dependency that this phase then executed against [EVIDENCE: `implementation-summary.md` Follow-Up Items.]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] Source-adaptation rules from Phase 003 remain intact and unweakened by either planned path [EVIDENCE: `## 7. Source Adaptation Rules` content preserved verbatim in the executed schema, only renumbered.]
- [x] CHK-131 [P1] Source citations for the newly embedded example card remain filename-only, consistent with existing cards [EVIDENCE: `## 5. Worked Example` cites `accessibility-audit.md` by filename only.]
- [x] CHK-132 [P1] Neither planned path proposes exposing external prompt bodies beyond what Phase 003 already reviewed [EVIDENCE: no source prose appears anywhere in the executed schema or any card.]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents remain synchronized once this phase's authoring pass is complete, and strict validation is run [EVIDENCE: strict validation run after this reconciliation pass; exit code recorded in `implementation-summary.md`.]
- [x] CHK-141 [P1] Metadata remains discoverable through `description.json` and `graph-metadata.json`, regenerated after the final content edit pass [EVIDENCE: both regenerated last, after all content edits.]
- [x] CHK-142 [P2] Knowledge-transfer notes are added if this phase's plan changes any maintainer-facing workflow beyond its own packet docs [EVIDENCE: no maintainer-facing workflow outside this packet changed; the schema/card edits are internal to `sk-design`'s existing private convention.]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Pending | Not yet reviewed |
| Implementer | Phase owner | Complete | 2026-07-06 |
| Reviewer | Alignment reviewer | Complete | 2026-07-06 |
<!-- /ANCHOR:sign-off -->
