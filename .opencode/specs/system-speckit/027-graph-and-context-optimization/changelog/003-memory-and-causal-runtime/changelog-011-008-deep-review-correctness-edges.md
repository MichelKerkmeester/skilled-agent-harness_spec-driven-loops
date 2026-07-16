

---
title: "Deep-review correctness edges (re-validated)"
description: "Three deep-review correctness fixes re-validated at HEAD and shipped with regression tests. Retention sweep now re-checks expiration inside the delete transaction to prevent data loss. Adapter cache now re-creates on dimension mismatch. Explicit EMBEDDINGS_PROVIDER now takes precedence in the auto-select cascade."
trigger_phrases:
  - "deep review correctness edges"
  - "retention toctou adapter-cache provider-precedence fixes"
  - "C2 isolated correctness fixes re-validation"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/008-deep-review-correctness-edges` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

Three deep-review correctness fixes, each independently re-validated at HEAD and shipped with a regression test. Two further findings were dispositioned after re-validation rather than patched.

### Added
- None.

### Changed

- Adapter cache now re-creates when a cached adapter has a different dimension than requested, while preserving the provider:model key so teardown is unaffected.
- Auto-select cascade now moves an explicit EMBEDDINGS_PROVIDER to the front, preferring it before falling back to the cascade, mirroring resolveProvider() precedence.

### Fixed

- Retention sweep now re-checks expiration inside the delete transaction, so a row un-expired by a concurrent writer between selection and deletion is not accidentally deleted.

### Verification

- TS build (@spec-kit/shared + @spec-kit/mcp-server), PASS, exit 0
- memory-retention-sweep.vitest.ts, PASS, 10/10 (incl. TOCTOU guard)
- embedders/execution-router.vitest.ts, PASS, 14/14 (incl. dim-mismatch)
- embedder-auto-selection.vitest.ts, PASS, 9/9 (incl. explicit-provider precedence)
- validate.sh --strict (this packet), PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | isStillExpired in-tx guard + testables export |
| `mcp_server/lib/embedders/execution-router.ts` | Modified | Re-create adapter on dimension mismatch |
| `shared/embeddings/auto-select.ts` | Modified | Prefer explicit EMBEDDINGS_PROVIDER |
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | TOCTOU-guard test |
| `mcp_server/tests/embedders/execution-router.vitest.ts` | Modified | Dimension-mismatch test |
| `mcp_server/tests/embedder-auto-selection.vitest.ts` | Modified | Explicit-provider precedence test |

### Follow-Ups

- DR-002-P1-002 left as-is. If a future requirement demands hard cross-process exclusivity (no degradation), the fs-lock timeout path would need an opt-in fail-closed mode, a separate decision.
- DR-014 guard is unit-tested at the predicate level. A true select-then-concurrent-update-then-delete race needs multi-process injection, the predicate test asserts the guard's correctness directly.
- Cluster findings excluded. DR-005/006/012/016/011/020 + DR-001-P1-002 + DR-002-P1-001 + OR-R-01 are the coordinated single-writer/durability packet (009), not this one.
