---
title: "Plan: code-opencode Language-Slice Intent Gate"
description: "Atomic per-language intent split in code-opencode + mirrored parent projection, verified against the three sk-code drift guards and before/after benchmark baselines."
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/005-code-opencode-language-gate"
    last_updated_at: "2026-07-09T10:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the atomic split plan"
    next_safe_action: "Execute the split + run the three drift guards"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Plan: code-opencode Language-Slice Intent Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
One atomic router change (authored directly — correctness-critical): split code-opencode's
`LANGUAGE_STANDARDS` into four per-language intents and mirror the parent projection, keeping all three
sk-code drift guards green and the hub run un-regressed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- `sk-code-router-sync` + `surface-slice-sync` + `parent-hub-vocab-sync` vitests all green.
- code-opencode child + sk-code hub benchmark before→after; no hub regression.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
code-opencode owns an inline child router; the sk-code parent `smart_routing.md` holds a flat
projection that must equal the union of the surface children (re-prefixed) plus a parent-owned tier.
The split changes both, symmetrically, so the union invariant holds. code-webflow keeps a lumped
`LANGUAGE_STANDARDS` (a frontend task legitimately spans CSS + HTML + JS), so only code-opencode and the
parent change.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Capture before baselines (child + hub).
2. Split code-opencode `INTENT_SIGNALS` + `RESOURCE_MAP`.
3. Mirror the parent machine block (RESOURCE_MAP move + INTENT_SIGNALS add).
4. Update the three scenarios' `expected_intent`.
5. Run the three drift guards + re-benchmark; confirm improvement and no hub regression.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Deterministic: the three drift-guard vitests (20 tests) prove structural consistency; the benchmark
before/after proves the routing reduction; `routeSkillResources` per scenario confirms the language
slice narrows to the language trio.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- The sk-code drift-guard vitests and the Lane C benchmark harness (both in-repo).
- The turnkey design in `../004-cross-skill-routing-sweep/assets/code-opencode-language-split-design.md`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert the code-opencode `SKILL.md` and parent `smart_routing.md` edits and the three scenarios'
`expected_intent` — all additive-or-regroup edits with no data loss; the drift guards confirm the
pre-change union is restored.
<!-- /ANCHOR:rollback -->
