---
title: "Plan: Phase 6 — Optional Add-ons"
description: "Implementation plan for the optional ADOPT-LATER add-ons: anti-stall rule + review-depth alias (shipped), benchmark metric + hooks (deferred, operator-optional)."
trigger_phrases:
  - "phase 6 plan optional addons"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement/006-optional-addons"
    last_updated_at: 2026-06-13T17:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 6: anti-stall + depth alias shipped; benchmark + hooks deferred"
    next_safe_action: "Operator: request benchmark metric or hooks if wanted"
---
# Plan: Phase 6 — Optional Add-ons

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Ship the two low-risk, high-value ADOPT-LATER add-ons — an implementer anti-stall rule (sk-code §4) and a `SK_CODE_REVIEW_DEPTH` review-depth env alias (sk-code-review §9.3). Defer the two heavier/marginal add-ons — a benchmark LOC/over-engineering metric and the runtime startup/typing hooks — as operator-optional, with documented rationale.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The anti-stall rule never licenses silent scope-cutting (SCOPE-LOCK preserved); the "question" half routes through scope-amendment.
- The depth alias only names existing tiers; floors (ALWAYS tier, security minimums, P0/P1/P2) immutable; `lite` maps to the existing M-2 safe-skip.
- Each shipped add-on is independent + reversible; no severity/contract change.
- Deferred items are documented with rationale and remain available on request.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two markdown additions: an ALWAYS bullet in `sk-code/SKILL.md` §4, and a new `### 9.3` subsection in `sk-code-review/SKILL.md` §9 (mirroring the `SK_CODE_REVIEW_MIN_CHANGED_LINES` env idiom). The deferred benchmark metric would touch `deep-improvement/scripts/model-benchmark/*`; the deferred hooks would touch `sk-code/scripts/hooks/` + 3-runtime settings.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surface: OPENCODE. Files edited: `sk-code/SKILL.md`, `sk-code-review/SKILL.md`. Verification: alignment-drift + diff inspection (pure insertions, no contract drift).

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Step 1: Add the anti-stall ALWAYS bullet (sk-code §4).
- Step 2: Add the `SK_CODE_REVIEW_DEPTH` §9.3 alias subsection (sk-code-review §9).
- Step 3: Verify alignment-drift + scope.
- Deferred (documented, operator-optional): #9 benchmark LOC/over-engineering metric in the Lane B sweep; #11 startup/typing hooks.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`verify_alignment_drift.py` (sk-code + sk-code-review) → exit 0; diff inspection (pure insertions, correct placement, no severity/contract change).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The depth alias names the existing ON_DEMAND tier + M-2 gate. The anti-stall rule pairs with the existing Escalation Discipline. Deferred items depend on the existing sweep harness / runtime hook surface respectively.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two SKILL.md additions — pure doc inserts, independently reversible, no contract impact.

<!-- /ANCHOR:rollback -->
