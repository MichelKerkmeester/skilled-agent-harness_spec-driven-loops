---
title: "Implementation Summary: Freeze the rename contract and map"
description: "One frozen contract and machine-readable map: 21 workflowModes, 20 packet directories, the shared-packet exception, gate definitions and history exclusions."
trigger_phrases:
  - "rename contract freeze"
  - "sk rename map"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-rename-contract-and-map |
| **Completed** | 2026-07-28 |
| **Level** | 1 |
| **Commits** | 6645d48d6a |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`contract.md` (LUNA-authored, orchestrator-amended) and the frozen `rename-map.json`: 21 workflowMode
renames, 20 directory renames, the single shared-packet exception (sk-create-skill-parent keeps its
distinguishing suffix while sharing packet sk-create-skill), per-hub reproduction gates, history
exclusions, and the execution division of labor. During execution, three assumptions were falsified
and recorded as amendments: 8.1 playbook gold is wider than expected_intent; 8.2 smart-routing
resource arrays are a path surface; 8.3 cross-hub inbound path references move with the hub commit.
<!-- /ANCHOR:what-built -->


---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Executed under the phase 002 contract: orchestrator-performed git moves, dispatched-model edit passes, and orchestrator verification of every claim against the Lane C gate and link baseline before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Hold pre-existing verdicts constant (including BLOCKED states) | The rename must be behavior-preserving; fixing unrelated gold would blend two changes |
| Regenerate generated artifacts instead of editing them | Hand-edits to manifests drift from their generators |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

Map rows validated against the on-disk packet inventory of all four hubs; every phase 003-006 gate
cites the pre-captured baselines this phase froze; contract committed before the first hub commit.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

Historical surfaces (benchmark report archives, changelogs, spec research logs, scorer caches) intentionally retain old names as a record of what ran.
<!-- /ANCHOR:limitations -->
