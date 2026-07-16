# Iteration 001 — Inventory Pass (dimension: inventory)

## Dispatcher
- **Run:** 1 of 20
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** inventory (map-building pass; no findings required)
- **Budget profile:** scan (target 9-11 tool calls)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`, base `f05bdac2cf`)
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)

## Files Reviewed
This is an inventory enumeration, not a content review. Tool actions used:
- `git diff --stat` / `--name-only` / `--numstat` over the range.
- Targeted churn ranking of source (`*.ts/*.cjs/*.js/*.sh`), tests, config, changelogs.
- Anchor greps in the top-3 source hotspots + the 4 socket-server copies (drift/refactor verification).

### Diff surface totals
- **2161 files** changed, **+83,987 / −26,134** lines across the range.
- The vast majority is docs/changelogs/spec-metadata (charter: ~1314 changelog/docs + ~183 spec-metadata).
- **50 core source files** (`*.ts/*.cjs/*.js/*.sh`, excluding tests) — the reviewable code surface.
- **61 test files** changed (A6).
- **63 `.gemini/**` files DELETED** (A8 gemini-removal). 125 changelog docs touched (A9).

## Source churn ranking (hotspots)

| Rank | Churn (Δ lines) | File | Angle | Risk note |
|------|-----------------|------|-------|-----------|
| 1 | 748 (+748 −0) | `mcp_server/lib/causal/relation-backfill.ts` | **A3** | Brand-new file; conflict-guard ordering, dryRun-default-true, honest-count, in-transaction edge invalidation. Highest absolute churn. |
| 2 | 416 (+393 −23) | `bin/mk-spec-memory-launcher.cjs` | **A1** | Lease-CAS / heartbeat / owner-lease fsync-exclusive write / reclaim boundary. Top runtime-coordination concern given the session's git-index race. |
| 3 | 402 (+402 −0) | `shared/ipc/socket-server.ts` | **A1/A4/A5** | New canonical shared socket server (close()/fsync/TOCTOU/`isWithinRoot`). |
| 4 | 314 (+8 −306) | `system-skill-advisor/.../lib/ipc/socket-server.ts` | **A1** | Collapsed to 22-line re-export shim (see drift note). |
| 5 | 307 (+286 −21) | `mcp_server/handlers/memory-save.ts` | **A2** | Enrichment-deferred default, transaction wrapping, rollback, entity-density cache invalidation, E08x error classes. |
| 6 | 256 (+8 −248) | `mcp_server/lib/ipc/socket-server.ts` | **A1** | Collapsed to 22-line re-export shim. |
| 7 | 189 (+186 −3) | `mcp_server/handlers/causal-graph.ts` | **A3/A7** | causal_unlink, tombstones, handler surface. |
| 8 | 169 (+144 −25) | `deep-loop-runtime/scripts/fanout-run.cjs` | **A6** | Fan-out non-zero-exit-as-success (known memory: `deep-loop-fanout-spawnsync-serialization`). |
| 9 | 165 (+130 −35) | `system-code-graph/.../lib/ipc/socket-server.ts` | **A1** | Full 402-line copy of shared socket server. |
| 10 | 169 (+169 −0) | `013-.../scratch/impl-workflow.js` | (scratch) | Spec-scratch artifact, NOT runtime; deprioritize. |

### Mid-tier source (correctness/traceability secondary targets)
- `mcp_server/tool-schemas.ts` (54), `handlers/memory-search.ts` (50), `lib/ops/job-queue.ts` (48), `context-server.ts` (46) — A4 shutdown/WAL + A7 schema parity.
- `handlers/save/post-insert.ts` (43, A2 exec-status collapse), `handlers/memory-context.ts` (39), `schemas/tool-input-schemas.ts` (37, A7).
- `lib/graph/graph-metadata-parser.ts` (25), `handlers/mutation-hooks.ts` (21, A2 cache invalidation), `handlers/save/response-builder.ts` (21, A2 E08x), `lib/embedders/embedding-reconcile.ts` (20).
- `bin/lib/model-server-supervision.cjs` (21), `bin/lib/launcher-ipc-bridge.cjs` (19, A1 owner socket-path staleness), `bin/lib/launcher-session-proxy.cjs` (14, A1).
- `lib/causal/relation-coverage.ts` (15, A3), `lib/validation/orchestrator.ts` (5, **A5 validator entry-guard bypass** — small diff but flagged P0-candidate hypothesis).

### Top test churn (A6)
- `relation-backfill-similarity.vitest.ts` (394, new), `launcher-lease.vitest.ts` (289, +230 −59 — un-skipped, socket-listen timing racy hypothesis), `relation-backfill-unit.vitest.ts` (229, new), `fanout-run.vitest.ts` (228), `relation-backfill-conflict.vitest.ts` (225, new — contradiction-cycle coverage), `model-server-demand-probe.vitest.ts` (193, new), `handler-causal-graph.vitest.ts` (176), `ipc-socket-toctou.vitest.ts` (158, new, A5), `launcher-ipc-bridge-probe.vitest.ts` (122), `tool-contract-parity.vitest.ts` (61, A7).

## Traceability Checks
- **Iteration number:** JSONL had 1 line (`type:"config"`, 0 `type:"iteration"`). Derived iteration = 1. Matches dispatch. No mismatch.
- **Lineage:** sessionId `2026-06-05T11:16:17Z`, generation 1, lineageMode new, releaseReadinessState in-progress — consistent across config.json + state.jsonl config line + registry.
- **Range integrity verified:** `git rev-parse` confirms HEAD `12de3d3a7e` and base `a9e9bdb0a5^` = `f05bdac2cf`.

## Integration Evidence
- None inspected this pass beyond the diff surface. Socket-server copies verified by line-count + numstat only (see drift note); deferred to A1 content pass.

## Edge Cases
1. **Socket-server "copy drift" reframed (verification, not a finding yet):** The charter hypothesized drift. Evidence: `shared/ipc/socket-server.ts` (402 lines, new) and `system-code-graph/.../lib/ipc/socket-server.ts` (402 lines) are full copies; `mcp_server/lib/ipc/socket-server.ts` (−248) and `system-skill-advisor/.../lib/ipc/socket-server.ts` (−306) collapsed to **22-line re-export shims**. This is a consolidation-toward-shared, with code-graph holding a *parallel full copy* rather than the shim. The real A1/A5 question for iter 2+/7: does the code-graph 402-line copy stay byte-equivalent to `shared/`, and do the two 22-line shims re-export the same surface? Recorded as a hotspot, not a finding.
2. **`013-.../scratch/impl-workflow.js` (169 lines):** spec-scratch artifact under a sibling spec folder, not runtime code. Deprioritized; out of the core code surface.
3. **`.gemini/**` 63 deletions:** A8 dangling-ref risk is in the *remaining* configs/agent-mirrors/docs/scripts that may still reference gemini, not in the deletions themselves. A8 pass (iter 10) must grep surviving files for dangling gemini refs.
4. **code-graph MCP disconnected** (per strategy Known Context): structural search unavailable; using Grep+Read+git, which is sufficient for diff-scoped review.

## Confirmed-Clean Surfaces
- None asserted — inventory pass makes no clean claims. Surfaces are mapped, not cleared.

## Ruled Out
- Nothing ruled out this pass (no findings attempted by design).

## Next Focus
- **Dimension:** correctness
- **Focus area:** A1 launcher/IPC concurrency — `bin/mk-spec-memory-launcher.cjs` (churn 416) lease-CAS TOCTOU, owner-lease exclusive write (`writeOwnerLeaseFileExclusive` ~288-294 uses `wx` flag + fsync — verify CAS atomicity vs `readLeaseFile`/`writeOwnerLeaseFile` ~281-294 non-exclusive path), heartbeat/proxy-stdout collision (`LEASE_HELD_BY` stdout write ~183 vs bridge stdio), stale-heartbeat reclaim boundary (~92-97), owner socket-path staleness (`bin/lib/launcher-ipc-bridge.cjs` ~344-350).
- **Reason:** Highest runtime-coordination risk; the live session hit a concurrent-session git-index race, and the launcher is the lease/coordination authority. Top-2 churn after the new A3 file.
- **Rotation status:** inventory complete; entering correctness rotation (iters 2-6).
- **Blocked/productive carry-forward:** Productive — socket-server consolidation question (edge case 1) feeds A1 (iter 2) and A5 (iter 7). A3 relation-backfill.ts (churn 748) is the single largest hotspot, queued for iter 4.
- **Required evidence:** file:line CAS sequence in launcher lease path; compare exclusive vs non-exclusive lease writers; confirm whether `LEASE_HELD_BY` stdout can interleave with proxied client stdio on a bridged secondary.
