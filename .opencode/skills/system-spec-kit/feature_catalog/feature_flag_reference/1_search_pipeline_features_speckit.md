---
title: "Search Pipeline Features (SPECKIT_*)"
description: "Feature flag reference for the Spec Kit Memory search pipeline controls, compatibility shims, and retrieval-shaping toggles."
trigger_phrases:
  - "search pipeline features"
  - "SPECKIT_* feature flags"
  - "search pipeline feature flags"
  - "retrieval-shaping toggles"
  - "speckit flag reference"
version: 3.6.0.55
---

# Search Pipeline Features (SPECKIT_*)

<!-- sk-doc-template: skill_asset_feature_catalog -->

This document captures the implemented behavior, source references, and validation scope for the search-pipeline flag surface that is still read by code or intentionally retained as a live compatibility shim. The live set focuses on current search controls plus any compatibility shims that remain in code, so operators can separate active behavior from retired rollout history without treating old state-machine language as the current story.

---

## 1. OVERVIEW

This feature-reference file mirrors the feature-catalog snippet pattern: a short explanation of the flag family, the full current-reality table, and the source metadata needed to keep docs, implementation, and validation aligned.

These flags turn major retrieval behaviors on or off, including fallback logic, reranking, telemetry, and compatibility shims, so operators can reason about quality, speed, and safety from one place.

---

## 2. HOW IT WORKS

> This category no longer enumerates flags — the authoritative, always-current list lives in
> [`ENV_REFERENCE.md` → Feature Flags Reference Table](../../mcp_server/ENV_REFERENCE.md#feature-flags-reference-table).
> Duplicating it here caused drift (survivor flags went missing); the catalog now points to the single source.

Note: `hybrid-search.ts` always calls `hybridAdaptiveFuse()`, and that helper reads `SPECKIT_ADAPTIVE_FUSION` via `isAdaptiveFusionEnabled()`. In practice, the flag remains live: it selects between intent-aware adaptive fusion and standard fixed fusion, with rollout behavior still applied through `SPECKIT_ROLLOUT_PERCENT`.

Roadmap flag entries in this table describe live runtime resolvers, not frozen import-time snapshots. The roadmap flag resolver reads `process.env` when helpers are called, and the default-off adaptive-ranking setting stays false until an explicit canonical opt-in.

---

## 3. SOURCE FILES

Source file references are listed in the ENV_REFERENCE.md flag table linked above.

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_flag_reference/1_search_pipeline_features_speckit.md`
Related references:
- [2-session-and-cache.md](2_session_and_cache.md) — 2. Session and Cache
