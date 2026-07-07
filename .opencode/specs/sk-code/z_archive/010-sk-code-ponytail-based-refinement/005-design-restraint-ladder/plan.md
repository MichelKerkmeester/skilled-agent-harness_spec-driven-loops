---
title: "Plan: Phase 5 — Design Restraint Ladder"
description: "Implementation plan for the pre-write Design Restraint Ladder in sk-code's always-loaded quality doc + phase model, with router-sync integration proof."
trigger_phrases:
  - "phase 5 plan design restraint ladder"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/005-design-restraint-ladder
    last_updated_at: 2026-06-13T17:10:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 5 implemented + verified; router-sync guard green"
    next_safe_action: "/speckit:plan Phase 6 (optional)"
---
# Plan: Phase 5 — Design Restraint Ladder

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add a pre-write Design Restraint Ladder (the 6-rung "do you really need this?" gate) to sk-code's always-loaded `code_quality_standards.md`, plus a gating precondition at the Phase 0->1 transition and a Phase 1 Overview note — framed as a post-read, post-routing, implementation-gated reflex that does not change surface precedence or the Iron Law.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The ladder runs AFTER surface + intent routing and is gated to implementation intent — it consumes the detected surface, never competes with OPENCODE>WEBFLOW>UNKNOWN precedence.
- Zero new files, zero new RESOURCE_MAP entries, zero routable-doc changes — so the router-sync drift guard stays valid.
- Integration proof: the `sk-code-router-sync.vitest.ts` guard passes after the change.
- "Challenge the requirement" routes through scope-amendment/escalation, never silent scope-cutting; Phase 3 verification (Iron Law) still required.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three prose edits to existing files: a ~13-line `### Design Restraint Ladder (pre-write)` subsection in `code_quality_standards.md` §1 (always loaded via DEFAULT_RESOURCE), a one-line augmentation of the `0 -> 1` transition in `phase_detection.md`, and a one-cell augmentation of the Phase 1 Requirement in the SKILL.md Phase Overview table. No code, no new routes, no detection-logic change.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surface: OPENCODE. Files: `references/universal/code_quality_standards.md`, `references/phase_detection.md`, `SKILL.md`. Verification: alignment-drift + the router-sync vitest + a grep proof that detection logic is untouched.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Step 1: Confirm `code_quality_standards.md` is in DEFAULT_RESOURCE (always loaded) and is NOT a RESOURCE_MAP intent key (so a subsection adds no routable entry).
- Step 2: Add the ladder subsection (rungs framed as post-read, surface-flavored, YAGNI routes through scope-amendment).
- Step 3: Augment the 0->1 transition + the Phase 1 Overview cell; cross-reference (not restate) the CLAUDE.md anti-pattern table.
- Step 4: Prove integration — run the router-sync guard; confirm surface precedence + detection logic untouched.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`verify_alignment_drift.py` → exit 0; the `sk-code-router-sync.vitest.ts` guard (run via `deep-improvement/scripts` vitest config) → 4/4 pass; grep proof that SKILL.md §2 Smart Routing / `stack_detection.md` are unchanged; scope = exactly the 3 edited files.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `code_quality_standards.md` must be always-loaded (DEFAULT_RESOURCE) — confirmed. The router-sync guard for the integration proof. Conceptually pairs with Phase 1's review-side checklist rows.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three prose hunks — no code, no routes, no detection change. Fully reversible with zero residual effect; the router stays green either way.

<!-- /ANCHOR:rollback -->
