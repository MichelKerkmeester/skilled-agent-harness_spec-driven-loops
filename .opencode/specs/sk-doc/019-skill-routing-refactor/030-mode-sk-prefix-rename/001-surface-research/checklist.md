---
title: "Checklist: Find every surface an sk- prefix rename touches"
description: "Verification checklist for the two-lineage rename surface research."
trigger_phrases:
  - "sk rename research checklist"
importance_tier: "critical"
contextType: "research"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
---

# Checklist: Find Every Surface An sk- Prefix Rename Touches

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Check items only with evidence: a file that exists, a command that ran, or a commit hash.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 Scope fixed to the four sk- hubs and executors chosen — evidence: operator decisions recorded in parent spec.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-002 Research is read-only; no code changed in this phase — evidence: phase commits contain only spec-folder files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 Both lineages produced research.md — evidence: research/lineages/grok-4-5-high/research.md and research/lineages/glm-5-2/research.md
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-004 Surface classes cover typed, path and prose positions — evidence: contract sections in ../002-rename-contract-and-map/contract.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-005 No secrets or credentials in research output — evidence: lineage files reviewed at merge time
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 Findings frozen into contract.md and rename-map.json before execution — evidence: commit 6645d48d6a
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-007 Lineage outputs live under this phase's research/ tree — evidence: research/lineages/ layout
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All seven checks pass with evidence; the research phase is complete and its output is the frozen
phase 002 contract.
<!-- /ANCHOR:summary -->
