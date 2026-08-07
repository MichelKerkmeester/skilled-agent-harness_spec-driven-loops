---
title: "Phase 1: sk-code-review Checklist Rows (reinvent-the-wheel / needed-ness / replacement)"
description: "Add purely-additive review checklist rows to sk-code-review: hand-rolled-stdlib + native-duplication checks, a 'was this asked for?' needed-ness prompt, and a 'what replaces this?' field on the removal plan. Lowest-risk ponytail transplant."
trigger_phrases:
  - "phase 1 sk-code-review rows"
  - "reinvent the wheel review check"
  - "needed-ness prompt"
  - "replacement field removal plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement/001-skreview-checklist-rows"
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 1 planned from 146 research recs #2/#6/#7"
    next_safe_action: "/speckit:implement — add the three checklist rows + needed-ness prompt"
---
# Phase 1: sk-code-review Checklist Rows

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-13 |
| **Parent** | `142-sk-code-ponytail-based-refinement` (phase 1 of 6) |
| **Source recs** | research.md #2 (stdlib/native rows), #6 (needed-ness prompt), #7 (replacement field) |
| **Risk** | Very low — additive checklist text; severity stays P2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-code-review's `code_quality_checklist.md` has generic KISS/DRY rows but **no explicit check** for code that hand-rolls something the standard library already ships, or that duplicates a native platform feature (verified absent — 0 grep hits). Its KISS section asks "is this the simplest form?" but not "should this newly-added code exist at all?". And `removal_plan.md` deletion rows don't state **what replaces** removed code. Ponytail's review skill names exactly these three gaps.

### Purpose
Add three purely-additive review rows so reviewers consistently catch reinvented-stdlib / native-duplication, flag unrequested new code for removal (not just simplification), and make deletions concrete. No workflow, severity-model, or output-contract change.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A "hand-rolled standard-library behavior" row and a "native platform/runtime duplication" row in `code_quality_checklist.md` §6 Maintainability.
- A needed-ness prompt in §7 KISS: "Was this code asked for? If the requirement were dropped, would anything break? If not → removal candidate" — recommend removal (cross-ref `removal_plan.md`), P2 default / P1 only if it adds attack-surface, contract, or regression risk.
- A `Replacement` field on the `removal_plan.md` §2 table (nothing / stdlib API / native feature / shorter equivalent).

### Out of Scope
- The `shrink` row (deferred to Phase 6 — style-churn risk).
- Any new findingClass or severity tier (explicitly rejected by research #7/DO-NOT-ADOPT).
- sk-code (implementer) changes — handled in later phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code-review/references/code_quality_checklist.md` | Update | Add stdlib + native rows (§6) and the needed-ness prompt (§7). |
| `.opencode/skills/sk-code-review/references/removal_plan.md` | Update | Add the `Replacement` field to the §2 table. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | stdlib + native rows added | Two new rows in §6 Maintainability naming hand-rolled-stdlib and native-duplication; phrased as P2 maintainability checks. |
| REQ-002 | Needed-ness prompt added | §7 KISS gains the "was this asked for?" prompt that routes to a removal recommendation, P2 default / P1 if risk; cross-references `removal_plan.md` rather than duplicating it. |
| REQ-003 | Replacement field added | `removal_plan.md` §2 table gains a `Replacement` column. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No severity-model change | P0/P1/P2 contract untouched; over-engineering findings default P2; no numeric gate introduced. |
| REQ-005 | No duplication of existing guidance | New rows do not restate the CLAUDE.md anti-pattern table or existing KISS/DRY rows; they name the specific missing check. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A review of code that reinvents a stdlib function now has a checklist row that catches it.
- **SC-002**: A review of unrequested new code surfaces a removal recommendation (not just "simplify").
- **SC-003**: `validate.sh <skill-or-doc> --strict` (or sk-code-review's own checks) pass; no severity/output-contract drift.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reviewers over-apply "reinvent the wheel" to legitimate custom code | Noise | Phrase as "prefer the standard API when behavior AND edge cases match"; keep P2. |
| Risk | Needed-ness prompt becomes a license to delete required code | Lost requirements | Route through removal_plan; P1 only on real risk; never suppress security/correctness. |
| Dependency | None — pure additive doc edits | — | Can ship independently of all other phases. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: New rows are self-contained and cross-reference (not duplicate) `removal_plan.md` and the CLAUDE.md anti-pattern table.

### Consistency
- **NFR-C01**: Wording matches the existing checklist row style (imperative, evidence-oriented).

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Intentional reinvention**: a hand-rolled version chosen for a real reason (perf, a stdlib edge-case gap) — the row should prompt a question, not an automatic finding; pairs with the Phase 2 ceiling-comment convention.
- **Removal of code with a consumer but no requirement**: the needed-ness prompt targets exactly this (code that *has* a caller but answers no stated requirement).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact §6 row wording — finalize during implementation against the live checklist style.
- Whether the needed-ness prompt is one row or a row + a review-prompt line (research #7 suggested both).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Trivial complexity: three additive rows across two reference docs, no code, no workflow change. Risk is low and isolated. The only judgment is wording to avoid false positives, mitigated by the P2 default and cross-references.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent / research**: `../research/research.md` (recs #2, #6, #7), `../spec.md`
- **Targets**: `.opencode/skills/sk-code-review/references/code_quality_checklist.md`, `removal_plan.md`
- **Sibling phase**: `../002-ceiling-comment-convention` (the ceiling-comment pairing for false-positive control)

<!-- /ANCHOR:related-docs -->
