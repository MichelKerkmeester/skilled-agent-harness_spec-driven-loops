---
title: "Tasks: Close the sk-design routed-intra recall gap"
description: "Investigate, apply two intents, gate per-scenario."
trigger_phrases:
  - "sk-design recall investigation"
  - "routed-intra recall"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

# Tasks: Close The sk-design Routed-Intra Recall Gap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Capture the CONDITIONAL 92 baseline and identify the two low-recall scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T101 LUNA xhigh read-only investigation (cli-pi); orchestrator verify against files + router-replay
- [x] T102 Resolve the SR-004 disagreement (wire, not trim) with the operator
- [x] T103 Add PREFLIGHT_OWNERSHIP and VARIATION_DIVERSITY intents to smart-routing.md; commit 8cb2e8dfdc
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T201 Per-scenario diff: exactly SR-004 and PB-007 move (recall -> 1.0); D1intra 98 -> 100
- [x] T202 sk-design PASS 95; other three hubs and 84-link set unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All tasks complete with evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Investigation: `./research.md`, `./luna-raw-findings.txt`
- Prior packet: `../022-route-gold-and-signal-remediation/`
<!-- /ANCHOR:cross-refs -->
