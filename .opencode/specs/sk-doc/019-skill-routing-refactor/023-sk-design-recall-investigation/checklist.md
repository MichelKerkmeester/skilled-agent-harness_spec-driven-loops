---
title: "Checklist: Close the sk-design routed-intra recall gap"
description: "Verification checklist for the two recall fixes."
trigger_phrases:
  - "sk-design recall investigation"
  - "routed-intra recall"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

# Checklist: Close The sk-design Routed-Intra Recall Gap

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Check items only with evidence: a gate number, a per-scenario diff, or a commit hash.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 CONDITIONAL 92 baseline captured before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-002 Intents are phrase-scoped to the two probes, not broad INTERFACE keywords -- commit 8cb2e8dfdc
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 Per-scenario diff shows exactly SR-004 and PB-007 moving to recall 1.0
- [x] CHK-004 sk-prompt 100 / sk-code 96 / sk-doc 98 unchanged; 84-link set constant
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 sk-design no longer CONDITIONAL; PASS 95, D1intra 100
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-006 One config file changed; no credentials or unrelated behavior
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-007 LUNA findings + verification recorded in research.md; SR-004 disagreement documented
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 Single fix commit (8cb2e8dfdc); docs separate
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All checks pass with evidence; sk-design reaches PASS with only the two targeted scenarios moving.
<!-- /ANCHOR:summary -->
