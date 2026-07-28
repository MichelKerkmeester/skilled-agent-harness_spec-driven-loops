---
title: "Implementation Summary: Rename the sk-design mode packets to the sk- prefix"
description: "Move design-interface, design-md-generator and design-mcp-open-design to their sk-design-* names, holding the pre-existing BLOCKED-BY-ROUTE-GOLD 91 verdict constant rather than fixing it."
trigger_phrases:
  - "sk-design mode rename"
  - "sk-design-interface rename"
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
| **Spec Folder** | 004-sk-design-rename |
| **Completed** | 2026-07-28 |
| **Level** | 1 |
| **Commits** | 0aea994055 (adjuncts 22934f0c49, 9597bf683f) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All three packets moved and renamed across registry, router, frontmatter, gold and smart-routing. LUNA's three self-verification benchmark runs auto-archived under benchmark/reports/ and were stripped with their index rows. A string-final old path (no trailing slash) survived in doctor-mcp-install.yaml line 208 and the card-sync checker; both fixed and the shape swept repo-wide. Deep-alignment adapter fixes landed separately.
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

Lane C reproduced BLOCKED-BY-ROUTE-GOLD 91 exactly — the pre-existing route-gold block is held constant, not repaired. Link set constant.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

Historical surfaces (benchmark report archives, changelogs, spec research logs, scorer caches) intentionally retain old names as a record of what ran.
<!-- /ANCHOR:limitations -->
