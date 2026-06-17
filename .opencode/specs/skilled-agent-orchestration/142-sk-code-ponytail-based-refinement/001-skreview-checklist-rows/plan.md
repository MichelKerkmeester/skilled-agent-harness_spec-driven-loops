---
title: "Plan: Phase 1 — sk-code-review Checklist Rows"
description: "Implementation plan for the three additive sk-code-review checklist rows (stdlib/native, needed-ness, replacement)."
trigger_phrases:
  - "phase 1 plan sk-code-review rows"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/001-skreview-checklist-rows
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 1 planned from 146 research recs #2/#6/#7"
    next_safe_action: "/speckit:implement — add the rows + needed-ness prompt"
---
# Plan: Phase 1 — sk-code-review Checklist Rows

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add three additive review rows to sk-code-review reference checklists: a hand-rolled-stdlib check and a native-duplication check (§6 Maintainability), a "was this asked for?" needed-ness prompt (§7 KISS) routed to a removal recommendation, and a `Replacement` field on the removal-plan table. Pure doc edits; no workflow, severity, or output-contract change.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- New rows match the existing checklist row style (imperative, evidence-oriented).
- Over-engineering stays P2 by default; no numeric gate; P0/P1/P2 contract untouched.
- Rows cross-reference (not duplicate) `removal_plan.md` and the CLAUDE.md anti-pattern table.
- `validate.sh <spec> --strict` green; a sample review exercises each new row.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two reference docs only. `code_quality_checklist.md` gains two §6 rows + one §7 prompt; `removal_plan.md` §2 table gains one column. No scripts, no SKILL.md routing change, no CI change. The needed-ness prompt is a checklist line plus an optional review-prompt line, both pointing at `removal_plan.md`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surface: OPENCODE (sk-code-review reference markdown). Files: `code_quality_checklist.md`, `removal_plan.md`. No code, no tests-as-code; verification is doc-review + a dry-run review pass.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Step 1: Read the live `code_quality_checklist.md` §6/§7 + `removal_plan.md` §2 to match wording/style.
- Step 2: Add the two §6 rows (hand-rolled-stdlib, native-duplication) with "prefer the standard API when behavior AND edge cases match" guardrail.
- Step 3: Add the §7 needed-ness prompt + review-prompt line; cross-ref `removal_plan.md`; P2 default / P1 if risk.
- Step 4: Add the `Replacement` column to `removal_plan.md` §2.
- Step 5: Dry-run a review against a snippet that reinvents a stdlib call + adds unrequested code; confirm the rows fire.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code tests. Verification = (a) `validate.sh --strict` on this phase folder, (b) a manual dry-run review that the new rows catch reinvented-stdlib + unrequested code and that the removal recommendation names a replacement, (c) confirm no severity/output-contract drift (grep the SKILL.md final-line contract unchanged).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- None. Pure additive doc edits; independent of all other phases. (Phase 2 later builds the ceiling-comment pairing for false-positive control.)

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two reference-doc edits — no behavior, scripts, or CI involved. Trivial git revert.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Standalone. Steps run in sequence within this phase; no cross-phase blockers. Pairs conceptually with Phase 2 (ceiling comments) but does not depend on it.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

~30-60 min: three short doc edits + a dry-run review. <50 LOC-equivalent of markdown.

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Each of the three rows is independently revertible. No migration, no data, no CI state. Safe to land and revert per-row.

<!-- /ANCHOR:enhanced-rollback -->
