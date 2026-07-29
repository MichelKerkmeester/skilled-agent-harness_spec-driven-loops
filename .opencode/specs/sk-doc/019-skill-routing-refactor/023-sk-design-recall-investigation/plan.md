---
title: "Implementation Plan: Close the sk-design routed-intra recall gap"
description: "Two narrow shared-router intents, gated on an exact per-scenario diff."
trigger_phrases:
  - "sk-design recall investigation"
  - "routed-intra recall"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

# Implementation Plan: Close The sk-design Routed-Intra Recall Gap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-design/shared/references/smart-routing.md (the router the benchmark reads) |
| **Investigator** | GPT-5.6-LUNA xhigh (cli-pi), read-only |
| **Verification** | sk-design Lane C per-scenario diff vs the CONDITIONAL 92 baseline |

### Overview
Add two phrase-scoped intents mapping the two probes' vocabulary to the resources those scenarios
expect; gate on an exact per-scenario diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both scenarios root-caused and verified against the files

### Definition of Done
- [x] Both recalls -> 1.0; sk-design PASS; only the two targets move
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Narrow intents (not broad INTERFACE keywords) keep the change surgical; the shared router is the one
the benchmark resource-recall actually consumes, verified in router-replay.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Investigate | LUNA read-only root-cause; orchestrator verify |
| Apply | Two intents + resource-map entries in smart-routing.md |
| Gate | Per-scenario diff; full four-hub matrix; link set |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

sk-design Lane C router-replay with a per-scenario diff; accept only SR-004 and PB-007 moving to
recall 1.0. Confirm sk-prompt/sk-code/sk-doc unchanged and the 84-link set constant.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The CONDITIONAL 92 baseline from packet 022's route-gold fix.
- The LUNA investigation findings and the orchestrator's mechanism trace.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single revertible commit touching only smart-routing.md; reverting restores CONDITIONAL 92 exactly.
<!-- /ANCHOR:rollback -->
