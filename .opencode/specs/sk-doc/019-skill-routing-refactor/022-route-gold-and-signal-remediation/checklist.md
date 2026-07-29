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

- [ ] CHK-001 Pre-change per-scenario baselines captured for both hubs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-002 Lane 1 signal edit is minimal and targets only the folded-vocabulary gap
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 sk-design per-scenario diff shows exactly SR-002.P3 and AI-001.P4 moving to interface
- [ ] CHK-004 sk-code per-scenario diff shows exactly the ten named scenarios passing route-gold
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 Both hubs no longer report BLOCKED-BY-ROUTE-GOLD
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-006 No credentials or unrelated behavior changes in either lane commit
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-007 New post-remediation baselines recorded in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-008 One commit per lane; no cross-lane bleed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Pending lane execution.
<!-- /ANCHOR:summary -->
