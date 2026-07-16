---
title: "Implementation Plan: Cross-Skill Routing Sweep"
description: "Review-hardened phasing: a non-scoring D3 diagnostic + triage, hand-sweep the hardest skill (deep-improvement), then an optimizer proven on two shapes before fanning out — per two fresh reviews (Opus 4.8 + Sonnet 5)."
trigger_phrases:
  - "cross-skill routing sweep plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/004-cross-skill-routing-sweep"
    last_updated_at: "2026-07-09T06:41:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran Phase 0 read-only triage for the cross-skill routing sweep"
    next_safe_action: "Hand-sweep deep-improvement, then build the optimizer from two shapes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "D3 = Option G + non-scoring diagnostic; detector-first / hand-sweep-hardest — two fresh reviews converged"
---
# Implementation Plan: Cross-Skill Routing Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---
<!-- ANCHOR:summary -->
## 1. SUMMARY
Detector-first, then hand-sweep deep-improvement, then automate from two shapes. D3 stays Option G (per-scenario gold) plus a non-scoring `D3-ex-default` diagnostic; the general engine exclusion was rejected by both reviews.
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- No index/catalog file wired into an intent; exempt files go on an intentionally-unrouted allowlist.
- No gold=router-output tautology; every new intent has an adversarial sibling + passes contamination-lint.
- Parent union + parent re-benchmark clean in each skill's exit.
<!-- /ANCHOR:quality-gates -->

---
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The `D3-ex-default` diagnostic (waste minus the skill's DEFAULT tier) separates the harmless DEFAULT-tier artifact (gold-align) from genuine over-routing (intent-gate). Gold=design stays honest because every flagged skill has a lean 1-2 file DEFAULT tier (unlike code-review's 5). The optimizer is proven on code-review + deep-improvement + a negative test before any fan-out.
<!-- /ANCHOR:architecture -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
0. Diagnostic + triage (read-only) — this phase.
1. Detector + hand-sweep deep-improvement (independent sign-off).
2. Optimizer (two shapes + negative test) + fan-out (human-approved patches; workers re-benchmark only).
3. Re-baseline + CI gate (orphans ⊆ allowlist) + doctrine update.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Diagnostic validated by hand on known cases; hand-sweep re-benchmark; optimizer RED/GREEN on 2 shapes + a planted over-router negative test; per-skill Mode-A + parent re-benchmark.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| 001/002/003 shipped | Met | The scorer/parser fixes + methodology + command this builds on |
| Two fresh reviews | Met | Resolved the D3 mechanism + sequencing |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: A sweep proposes gaming (index-file wiring, tautological gold) or regresses the parent.
- **Procedure**: Reject the proposal (propose-by-default); revert the per-skill additive diff.
<!-- /ANCHOR:rollback -->
