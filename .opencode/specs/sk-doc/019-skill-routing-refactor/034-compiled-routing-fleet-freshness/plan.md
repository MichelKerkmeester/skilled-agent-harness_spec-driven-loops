---
title: "Implementation Plan: Compiled-Routing Fleet Freshness Repair"
description: "Re-mint the four stale hubs, surface the real compile error for the three non-compiling hubs and fix their inputs, re-mint them, and prove the guard green locally and in live CI with zero routing-behavior movement."
trigger_phrases:
  - "fleet freshness implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T19:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ceremony completed: guard fresh x7, gates exact, CI green"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Restore all seven activated hubs to fresh compiled-routing manifests: mechanical re-mints for the four stale hubs, diagnose-then-fix for the three whose inputs no longer compile, with the routing gate set re-run after every mint to prove scoring behavior never moves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The guard exits 0 locally; the CI step passes on a live run; every compile failure's real exception is recorded before its fix; the capture pins, corpus gate, golden prompts, and ratchet show zero movement after the re-mints; no manifest hand-edited, no engine code changed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two independent failure classes behind one red step. Stale-manifest hubs (`mcp-tooling`, `sk-code`, `sk-design`, `system-deep-loop`) have valid, compilable inputs whose serving manifest merely lags — the shipped `compiled-route-manifest.cjs refresh` verb regenerates them. Non-compiling hubs (`cli-external-orchestration`, `sk-doc`, `sk-prompt`) fail inside the policy compiler, and the tool boundary swallows the exception into a `compile-error` cause code — so diagnosis reaches under the tool to the compiler invocation itself, captures the real error per hub, and the fix lands in the authored routing inputs, never in the engine. Graduated hubs carry bespoke shadow-child compilers with their own packet-kind vocabularies, which is the likeliest seam for a shared root cause.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the pre-change guard verdict and the full routing-gate baseline. Implementation re-mints the four stale hubs, then per non-compiling hub: surface the real error, fix the input, re-mint. Verification re-runs the guard and the complete routing gate set locally, then confirms the CI step green on a live run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The guard is the gate under repair, so it is checked by exit code before and after. Behavioral safety rides on the already-proven routing gate set: scorer-eval capture against its exact pins, the Python corpus gate at CI floors, golden prompts, and the ratchet — re-run after the stale re-mints and again after the compile fixes, with any movement treated as a regression to diagnose rather than accept.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None upstream in this packet's own track. The routing workflow's executability repair (landed by the sibling remediation program) is what makes the live-CI confirmation possible at all. The shipped compiled-routing tooling is treated as execution authority; this packet adds no adapter.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Manifests are regenerated files under version control: reverting the packet's commits restores every previous manifest byte-for-byte, returning the fleet to today's (stale-but-serving-legacy) state. Input fixes for the non-compiling hubs are ordinary tracked edits with the same revert path. Nothing in this packet touches engine, compiler, or guard code, so rollback cannot affect the tooling itself.
<!-- /ANCHOR:rollback -->
