---
title: "Plan: Phase 2 — Intentional-Simplification (ceiling:) Convention"
description: "Implementation plan for the neutral ceiling: comment convention (sk-code) + the P2-downgrade evidence rule (sk-code-review)."
trigger_phrases:
  - "phase 2 plan ceiling comment"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/146-sk-code-ponytail-based-refinement/002-ceiling-comment-convention
    last_updated_at: 2026-06-13T14:55:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 2 implemented and verified; 2 doc additions"
    next_safe_action: "/speckit:plan Phase 3"
---
# Plan: Phase 2 — Intentional-Simplification (ceiling:) Convention

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Document a neutral `ceiling:` comment convention for deliberate shortcuts in sk-code's universal style guide, and add a rule in sk-code-review §7 that a concrete `ceiling:` comment is P2-downgrade evidence against over-engineering false positives — never for security/correctness. Two reference-doc additions; no code, no checker change.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The convention is documented as durable WHY (allowed by the comment-hygiene policy), with a neutral prefix, not the ponytail brand.
- Explicit: do NOT add `ceiling:` to the hygiene allowed-pattern list (would create a same-line bypass).
- The downgrade rule applies to P2 KISS/YAGNI only; never security/auth/persistence/sandboxing/public-contract/correctness.
- Severity model + `Review status:` contract untouched.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two reference docs. `code_style_guide.md` §4 COMMENTING gains a "Mark intentional simplifications" subsection. `code_quality_checklist.md` §7 gains an "Intentional-simplification evidence" note after the existing severity guidance. No scripts, no checker, no SKILL.md routing change.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surface: OPENCODE (markdown reference docs). Files: `sk-code/references/universal/code_style_guide.md`, `sk-code-review/references/code_quality_checklist.md`. Verification: alignment-drift (markdown is out of scope for the code comment-hygiene checker).

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Step 1: Read §4 COMMENTING (code_style_guide.md) + §7 (code_quality_checklist.md) for exact placement.
- Step 2: Insert the "Mark intentional simplifications" subsection (neutral `ceiling:`; durable WHY; no brand; no allow-list entry).
- Step 3: Insert the "Intentional-simplification evidence" downgrade note (P2 KISS/YAGNI only; never security/correctness).
- Step 4: Verify alignment-drift + diff scope.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code tests. Verification = alignment-drift exit 0 on both skills, diff inspection (exactly the two additions, no existing line altered), and confirming the convention text matches the existing comment-hygiene policy (durable WHY, no brand, no allow-list change).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 1 (shares the §7 area) — landed first. The convention (`ceiling:` in sk-code) is documented before the reviewer relies on it.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two reference-doc additions — no behavior, scripts, or checker change. Trivial git revert; each addition is independent.

<!-- /ANCHOR:rollback -->
