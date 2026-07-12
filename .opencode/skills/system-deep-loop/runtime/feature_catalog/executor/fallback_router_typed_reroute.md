---
title: "Fallback-router typed reroute"
description: "Adds typed fallback-route metadata, route trace fields, and startup graph validation for executor fallback routing."
trigger_phrases:
  - "fallback-router typed reroute"
  - "fallback-router-typed-reroute"
  - "fallback-router typed reroute runtime"
  - "executor fallback-router typed reroute"
version: 1.4.0.15
---

# Fallback-router typed reroute

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds typed fallback-route metadata, route trace fields, and startup graph validation for executor fallback routing.

This feature belongs to the executor group and is catalogued as F042 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Fallback routes can declare success and failure targets, every decision can carry `routeGroupId` and `hopIndex`, and `validateFallbackGraph()` checks missing targets, cycles, scope widening, and hop limits before dispatch.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/deep-loop/fallback-router.ts` | Runtime | typed fallback-router reroute + graph preflight. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/unit/fallback-router.vitest.ts` | Test | Primary regression coverage for Fallback-router typed reroute. |

---

## 4. SOURCE METADATA

- Group: Executor
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F042
- Feature file path: `executor/fallback-router-typed-reroute.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//015-fallback-router-typed-reroute`
- Primary sources: `lib/deep-loop/fallback-router.ts`, `tests/unit/fallback-router.vitest.ts`
Related references:
- [executor](../executor/) — Executor category
