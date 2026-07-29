---
title: "Implementation Plan: Clear the two hubs' BLOCKED route-gold verdicts"
description: "Two lanes: wire folded vocabulary into sk-design interface signals, and resolve the sk-code surface-detection gold gap, each gated on an exact per-scenario diff."
trigger_phrases:
  - "route gold remediation plan"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

# Implementation Plan: Clear The Two Hubs' BLOCKED Route-Gold Verdicts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | sk-design/hub-router.json (routerSignals); sk-code surface-detection playbook gold |
| **Executor** | Orchestrator for the sk-design signal edit (small, behavior-changing); GPT-5.6-SOL medium for sk-code gold authoring |
| **Verification** | Per-hub Lane C router-replay with a full per-scenario diff against pre-change snapshots |

### Overview
Lane 1 confirms the folded-vocabulary gap and makes the minimal interface-signal edit. Lane 2 first
decides gold-vs-exemption from the scorer contract, then applies it. Each lane re-gates before commit;
only the targeted scenarios may move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Twelve failing scenarios identified with expected-vs-observed evidence
- [x] Pre-change per-scenario baselines capturable from the live benchmark

### Definition of Done
- [ ] Both hubs off BLOCKED; twelve scenarios pass
- [ ] Per-scenario diff shows only targeted rows moving; sk-prompt/sk-doc unchanged
- [ ] New baselines recorded in the implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Lane 1 is a config edit to one file with live routing impact, so the orchestrator makes it directly
after confirming the exact tokens. Lane 2 is fixture-gold authoring with no runtime impact, suited to
a dispatched agent. Both are independent, revertible commits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Lane 1 confirm | Read SR-002 / AI-001 vocabulary; locate the folded-vocabulary gap in interface routerSignals |
| Lane 1 fix | Minimal signal edit; re-gate; commit |
| Lane 2 decide | Read the route-gold scorer contract: is surface-detection route-gold-scored? |
| Lane 2 apply | Author typed gold OR add the exemption; re-gate; commit |
| Baseline | Record the new aggregates as the post-remediation baselines |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: Lane C router-replay per hub with a per-scenario diff against the pre-change snapshot.
sk-design Lane 1 accepts exactly two moved rows (SR-002.P3, AI-001.P4 → interface); sk-code Lane 2
accepts exactly the ten named rows flipping to pass. sk-prompt and sk-doc gates must reproduce. Any
frozen-scorer digest touched requires a deliberate re-pin (none expected — these are data/config, not
scorer code).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Pre-change per-scenario benchmark snapshots for sk-design and sk-code.
- The route-gold scorer contract (to settle the sk-code gold-vs-exemption question).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each lane is a single revertible commit. Lane 1 touches one config file; reverting restores the prior
routing exactly. Lane 2 touches only fixture/playbook gold; reverting restores the prior BLOCKED state
without runtime effect.
<!-- /ANCHOR:rollback -->
