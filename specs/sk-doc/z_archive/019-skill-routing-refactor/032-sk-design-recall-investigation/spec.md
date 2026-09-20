---
title: "Feature Specification: Close the sk-design routed-intra recall gap"
description: "Fix the two playbook scenarios dragging sk-design's D1intra recall, taking the hub from CONDITIONAL to PASS."
trigger_phrases:
  - "sk-design recall investigation"
  - "routed-intra recall"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Close The sk-design Routed-Intra Recall Gap

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/032-sk-design-recall-investigation |
| **Level** | 2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Executors** | GPT-5.6-LUNA xhigh via cli-pi (read-only investigation); orchestrator verified and applied |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Clearing sk-design's BLOCKED-BY-ROUTE-GOLD (packet 022) surfaced a latent recall advisory:
CONDITIONAL 92, headline bottleneck `routed-intra`. Two playbook scenarios dragged D1intra (98/100)
because the shared surface router the benchmark reads
(`sk-design/shared/references/smart-routing.md`) did not load resources those scenarios expect:

- **PB-007** (recall 0.5): a multi-direction request. The packet declares `VARIATION_DIVERSITY ->
  variation-diversity.md`, but the shared surface router's INTERFACE map omitted it, so the router
  loaded `brief-to-dials.md` (1 of 2 expected) and not the variation guidance.
- **SR-004** (recall 0.4): an ownership probe ("which packet owns the pre-delivery scoring logic").
  Its vocabulary matched no surface intent, so the router loaded nothing, though the scenario expects
  the interface preflight card.

### Purpose
Take sk-design to PASS by loading exactly the resources each scenario expects, moving no other scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Two narrow intents in `sk-design/shared/references/smart-routing.md` (INTENT_SIGNALS + RESOURCE_MAP), phrase-scoped to the two probes.

### Out of Scope
- Any other hub; the packet SKILL.md routers (the benchmark reads the shared surface router); PB-007's D3 over-routing precision, a separate pre-existing dimension.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SR-004 loads its expected resource | SR-004 recall -> 1.0 via the probe's own vocabulary; the scenario's assertion is preserved, not trimmed |
| REQ-002 | PB-007 loads its expected resources | PB-007 recall -> 1.0 |
| REQ-003 | No collateral movement | Exactly SR-004 and PB-007 move; the other three hubs and the link set are unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- D1intra 98 -> 100; sk-design CONDITIONAL 92 -> PASS 95; per-scenario diff shows only the two targets moving.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A new intent over-routes into other scenarios | Keywords are phrase-scoped to the two probes; per-scenario diff confirmed only the two targets moved |
| A dispatched model's recommendation is wrong | Both findings verified against the files; SR-004's proposed trim was refuted and corrected to a wire (see decision record) |

**Dependencies:** the CONDITIONAL 92 baseline captured after packet 022's route-gold fix.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. PB-007 still has low D3 over-routing precision because INTERFACE loads its full resource set for a
   narrow request. That is a pre-existing precision dimension, out of this recall packet's scope.
<!-- /ANCHOR:questions -->
