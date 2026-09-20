---
title: "Implementation Plan: Advisor Ingestion Seam"
description: "Design-first plan: verify the watcher's startup-only discovery, decide the closure mechanism against daemon-safety constraints, implement with integration coverage, document the refresh step in both journeys, and add routing-evidence guidance."
trigger_phrases:
  - "advisor ingestion seam plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/026-advisor-ingestion-seam"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-advisor-ingestion-seam"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Advisor Ingestion Seam

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Design before code: this touches the shared advisor daemon, so the mechanism choice gets its own decision record with the trade-offs argued from the live watcher source, then a bounded implementation with an integration test that proves create-to-discover on a warm daemon.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Integration proof | scaffold → mechanism → advisor resolves the new skill, warm daemon, no restart |
| Advisor daemon suite | green, no watcher-latency regression |
| Docs | both journeys name the same refresh step |
| Review | SOL adversarial pass before landing (shared-runtime blast radius) |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three candidate mechanisms, one chosen in Phase 1: (a) watcher additionally watches the skills directory for new top-level roots (zero manual steps; fs-watch churn risk), (b) the fleet gate or scaffolder triggers a targeted graph scan on success (deterministic, no daemon change to fs behavior; adds a tool-side call), (c) documented manual refresh only (no code risk; keeps a manual step forever). The decision record argues from watcher source, daemon-safety precedent, and hook-latency rules.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify and decide

Re-verify startup-only discovery at the execution tip; write the decision record choosing the mechanism.

### Phase 2: Implement the mechanism

Bounded change in the advisor daemon/tooling per the decision, with unit + integration coverage.

### Phase 3: Document both journeys

create-skill workflow end and advisor lifecycle notes name the refresh step; scaffold notes flag slug-only routing defaults.

### Phase 4: Routing-evidence guidance

Trigger-design step tied to scored fields; attributed-recommendation smoke test documented (or gated, per the open question).

### Phase 5: Adversarial review and landing

SOL pass over the daemon diff; full advisor suite; land via rebase-and-push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Integration test is the centerpiece (create → discover, warm daemon); watcher unit coverage for the mechanism; existing advisor suite as the regression net.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Lens-3 evidence; the advisor daemon/watcher source; sibling 024 should land first so the journey the integration test walks is the fixed one.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Mechanism isolated in its own commits; revert restores startup-only discovery with the documented manual step remaining as the fallback closure.
<!-- /ANCHOR:rollback -->
