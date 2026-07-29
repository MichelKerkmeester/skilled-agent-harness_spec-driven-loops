---
title: "Feature Specification: Clear the two hubs' BLOCKED route-gold verdicts"
description: "Fix the two sk-design router-signal misses and author the missing sk-code surface-detection route gold, taking both hubs off BLOCKED-BY-ROUTE-GOLD for the first time."
trigger_phrases:
  - "route gold remediation"
  - "sk-design router miss"
  - "sk-code missing gold"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Clear The Two Hubs' BLOCKED Route-Gold Verdicts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-skill-routing-refactor/022-route-gold-and-signal-remediation |
| **Level** | 2 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Owner** | The sk-design and sk-code hub routing surfaces |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk- prefix rename left sk-design and sk-code at `BLOCKED-BY-ROUTE-GOLD aggregate=91`. The
post-rename remediation proved (byte-for-byte, after fully renaming the fixture gold) that stale gold
is NOT the cause. Two genuinely different, pre-existing defects hold the block:

**sk-design — two router-signal misses.** Two playbook scenarios expect the interface mode but the
router selects nothing:

- `SR-002.P3`: expects `sk-design-interface`, router returns `[]`.
- `AI-001.P4`: expects `sk-design-interface`, router returns `[]`.

Both are 014-consolidation fallout: `foundations` and `motion` folded into `interface`, but the
folded vocabulary (static visual-system phrasings and temporal/motion phrasings) is not fully wired
into `interface`'s `routerSignals` in `sk-design/hub-router.json`, so those prompts route nowhere.

**sk-code — ten surface-detection scenarios with no typed gold.** Ten playbook scenarios
(`SD-001/002`, `LS-001..004`, `CS-001/003/005/007`) carry no `expected_intent` / `expected_workflow_mode`
/ `expected_resources` at all. The router observes a real surface route, but with empty expected gold
the route-gold scorer fails them. These are surface-detection scenarios that either need typed gold
authored or an explicit no-route-gold exemption if surface detection is out of route-gold scope.

### Purpose

Take both hubs off BLOCKED with the minimal correct change: wire the folded vocabulary into
sk-design's interface signals, and resolve the sk-code gold gap — without moving any other scenario.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lane 1: `sk-design/hub-router.json` `routerSignals` for the interface mode, confirmed against the two failing scenarios' vocabulary.
- Lane 2: typed route gold for the ten sk-code surface-detection scenarios, OR a documented no-route-gold exemption, whichever the Lane-2 investigation establishes as correct.
- Re-recording both hub baselines once the block clears.

### Out of Scope
- Any mode rename (021 owns that, complete).
- sk-prompt and sk-doc, which already PASS and must not move.
- The skill-benchmark scoring engine itself.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-design's two misses route to interface | SR-002.P3 and AI-001.P4 observe `sk-design-interface`; no other sk-design scenario changes |
| REQ-002 | sk-code's ten scenarios pass route-gold | Each scenario carries correct typed gold (or a justified exemption); route-gold scorer stops failing them |
| REQ-003 | Both hubs clear BLOCKED | sk-design and sk-code no longer report BLOCKED-BY-ROUTE-GOLD; the new aggregate is recorded as the baseline |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No collateral movement | sk-prompt PASS 100 and sk-doc PASS 98 reproduce exactly; per-scenario diff on the touched hubs shows only the targeted scenarios changing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both hubs come off BLOCKED-BY-ROUTE-GOLD with the twelve named scenarios passing and every other scenario unchanged; sk-prompt and sk-doc untouched; the new baselines recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A routerSignals edit over-routes other vocabulary into interface | Confirm the exact folded-vocabulary tokens against the two scenarios first; re-gate with a full per-scenario diff, accept only the two targeted rows moving |
| Authoring sk-code gold that encodes the wrong surface | Derive each scenario's expected surface from the scenario's own stated detection intent, not from the current observed route |

**Dependencies:** the pre-change per-scenario baselines captured for sk-design and sk-code.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. Whether sk-code surface-detection scenarios should carry route gold at all, or are legitimately a
   surface-only concern that the route-gold scorer should exempt. Lane 2's first step settles this
   from the scorer contract before any gold is authored.
<!-- /ANCHOR:questions -->
