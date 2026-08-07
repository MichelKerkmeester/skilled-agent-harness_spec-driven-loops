---
title: "Decision Record: Drift-Marker Native Consolidation"
description: "Implementation decisions for the shared compiled drift-marker writer."
trigger_phrases:
  - "drift marker native consolidation decision"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Drift-Marker Native Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

## ADR-001: Reuse the Existing Lock-Reclaim Primitive

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-10 |

### Context

The git hook requires the mutex owner-liveness behavior while preserving its shorter recovery
window.

### Decision

Add `staleMs` as an optional second argument to `isReclaimableLock`, defaulting to the existing
five-minute `LOCK_STALE_MS`. The drift-marker entrypoint passes `45_000` explicitly and uses
`createInterprocessLock` to create `owner.json`.

### Consequences

Existing save callers preserve their five-minute behavior. Drift-marker locks gain immediate
dead-owner reclaim and retain their 45-second unknown-owner fallback.

## ADR-002: Retain the Environment-Variable Diff Transport

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-10 |

### Context

The hook already supplies diff text, repository root, and source through three environment
variables.

### Decision

Keep `MEMORY_DRIFT_DIFF`, `MEMORY_DRIFT_REPO_ROOT`, and `MEMORY_DRIFT_SOURCE` unchanged. The
shell helper delegates to the compiled entrypoint with the same environment contract.

### Consequences

`post-commit`, `post-merge`, and `post-rewrite` require no changes and retain their non-fatal
`|| true` behavior.
