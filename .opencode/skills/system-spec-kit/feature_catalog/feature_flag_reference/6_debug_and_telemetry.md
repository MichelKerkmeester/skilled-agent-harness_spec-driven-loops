---
title: "6. Debug and Telemetry"
description: "This document captures the implemented behavior, source references, and validation scope for 6. Debug and Telemetry."
trigger_phrases:
  - "debug and telemetry"
  - "log level configuration"
  - "speckit debug flags"
  - "retrieval telemetry settings"
version: 3.6.0.24
---

# 6. Debug and Telemetry

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 6. Debug and Telemetry.

These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default.

---

## 2. HOW IT WORKS

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
- Feature file path: `feature_flag_reference/6_debug_and_telemetry.md`
Related references:
- [5-embedding-and-api.md](5_embedding_and_api.md) — 5. Embedding and API
- [7-ci-and-build-informational.md](7_ci_and_build_informational.md) — 7. CI and Build (informational)
