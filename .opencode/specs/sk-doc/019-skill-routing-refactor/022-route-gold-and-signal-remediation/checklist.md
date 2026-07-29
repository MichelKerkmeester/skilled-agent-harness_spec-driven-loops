---
title: "Checklist: Clear the two hubs' BLOCKED route-gold verdicts"
description: "Verification checklist for the sk-design signal fix and sk-code gold authoring."
trigger_phrases:
  - "route gold remediation checklist"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor"
---

# Checklist: Clear The Two Hubs' BLOCKED Route-Gold Verdicts

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

- [x] CHK-001 Pre-change baselines captured (/tmp/rm-baseline-sk-{design,code}) before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-002 Lane 1 added one interface-quality vocab class + one signal wire; nothing else touched — commit 0536eed47e
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 Exactly SR-002.P3 and AI-001.P4 moved (84→100, route-gold pass); zero other rows — verified per-scenario diff
- [x] CHK-004 Exactly the ten scenarios moved to pass; route-gold failures now empty — commit ae83eb38be
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 sk-design CONDITIONAL 92, sk-code PASS 96 — neither BLOCKED
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-006 Lane 1 = one config file; Lane 2 = deletions-only in playbook gold; no other behavior touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-007 New baselines recorded in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 0536eed47e (Lane 1) and ae83eb38be (Lane 2), disjoint file sets
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Both lanes complete and verified; both target hubs off BLOCKED with only the targeted scenarios moving.
<!-- /ANCHOR:summary -->
