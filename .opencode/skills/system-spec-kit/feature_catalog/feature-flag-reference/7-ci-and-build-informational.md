---
title: "7. CI and Build (informational)"
description: "This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational)."
trigger_phrases:
  - "ci and build informational"
  - "git branch annotation"
  - "ci metadata variables"
  - "checkpoint branch context"
version: 3.6.0.12
---

# 7. CI and Build (informational)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 7. CI and Build (informational).

These are informational CI metadata variables, not feature toggles. They annotate records with branch context for traceability but do not change retrieval, scoring, or storage behavior.

---

## 2. HOW IT WORKS

These variables are read at runtime to annotate checkpoint and evaluation records with source-control context. They are not feature flags and have no effect on search or storage behavior.

> This category no longer enumerates flags — the authoritative, always-current list lives in
> [`ENV_REFERENCE.md` → Feature Flags Reference Table](../../mcp_server/ENV_REFERENCE.md#feature-flags-reference-table).
> Duplicating it here caused drift (survivor flags went missing); the catalog now points to the single source.

---

## 3. SOURCE FILES

Source file references are listed in the ENV_REFERENCE.md flag table linked above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature-flag-reference/7-ci-and-build-informational.md`
Related references:
- [6-debug-and-telemetry.md](6-debug-and-telemetry.md) — 6. Debug and Telemetry
- [audit-phase-020-mapping-note.md](audit-phase-020-mapping-note.md) — Feature flag reference mapping note
