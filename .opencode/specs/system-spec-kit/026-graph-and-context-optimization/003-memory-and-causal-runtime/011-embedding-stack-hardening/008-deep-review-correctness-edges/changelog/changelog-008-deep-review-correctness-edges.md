# Changelog — 008: Deep-review correctness edges

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Modified `mcp_server/lib/governance/memory-retention-sweep.ts` to add isStillExpired re-check inside delete transaction for DR-014 (retention sweep TOCTOU data-loss fix)
- Modified `mcp_server/lib/embedders/execution-router.ts` to re-create adapter on dimension mismatch for DR-013 (adapter cache ignored dimensions fix)
- Modified `shared/embeddings/auto-select.ts` to prefer explicit EMBEDDINGS_PROVIDER for DR-001/015 (bootstrap ignored explicit provider fix)
- Added regression tests: memory-retention-sweep.vitest.ts (TOCTOU guard), execution-router.vitest.ts (dimension mismatch), embedder-auto-selection.vitest.ts (explicit provider precedence)
- Dispositioned DR-002-P1-002 as no-change (intentional graceful degradation) and DR-017 as already fixed

## Why
The 20-iteration deep review flagged seven correctness findings as "isolated." Re-validation showed the first-pass analysis was uneven: one finding was already fixed, one was mis-located and mis-framed (its "fail-open" is intentional graceful degradation), and the rest needed concrete design decisions rather than rote patches.

## Verification
- TS build (@spec-kit/shared + @spec-kit/mcp-server): PASS — exit 0
- memory-retention-sweep.vitest.ts: PASS — 10/10 (incl. TOCTOU guard)
- embedders/execution-router.vitest.ts: PASS — 14/14 (incl. dim-mismatch)
- embedder-auto-selection.vitest.ts: PASS — 9/9 (incl. explicit-provider precedence)
- validate.sh --strict (this packet): PASS
