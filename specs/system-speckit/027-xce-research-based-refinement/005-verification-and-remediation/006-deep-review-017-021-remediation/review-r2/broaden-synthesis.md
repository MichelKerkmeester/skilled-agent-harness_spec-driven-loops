# Broaden Round — gpt-5.5 Deep Review (Synthesis)

Independent broaden-scope review beyond the 017-021 fixes, run as 30 gpt-5.5-fast xhigh passes across three code-area scopes (10 each), then triaged by 8 refute-first verifiers and remediated. Remediation committed at `55b977951d`.

## Scopes (10 passes each, ~6-wide parallel)
- **A — Search & retrieval** (`lib/search/*`: pipeline, fusion, confidence, calibration, retrieval, rescue)
- **B — Store / index / lifecycle** (`handlers/memory-*`, `lib/storage`, `lib/ops` — non-search 002 surface)
- **C — Server infrastructure** (`handlers`, `lib/providers`, launcher, IPC, daemon lifecycle)

## Raw → verified
30 lineages produced **52 distinct findings (1 P0, ~47 P1, 4 P2)**. Exact-title dedup fragmented near-duplicates; clustered into ~12 themes. 8 refute-first verifiers (one per theme, read the cited code, defaulted to NOT-REAL on intentional behavior) reduced these to **9 real fixes**. gpt-5.5 over-rated severity (most "P1" were really P2; one by-design "P0"-adjacent finding refuted), consistent with round-1.

## Disposition

### Fixed (9) — committed `55b977951d`, tsc clean, 448 affected tests pass + new P0 test, 0 new failures vs baseline
| # | Finding | Fix |
|---|---|---|
| 1 (P0) | retrieval-rescue injects unscoped Stage-2 backfill/sibling rows after Stage-1 scoping (default-on cross-tenant/cross-scope leak; lone injection path skipping the re-filter the constitutional + community paths perform) | re-apply governance + spec_folder prefix boundary to injected rows (`retrieval-rescue.ts`, `stage2-fusion.ts`) + regression test |
| 2 | community-fallback ignores specFolder (members fetched without folder predicate) | spec_folder prefix filter on members (`memory-search.ts`) |
| 3 | summary-embedding lane: global LIMIT before scope, exact-match drops descendants, weaker active filter | scope pushed into SQL (cap after scope), prefix-aware folder match, active/expiry/status gate (`memory-summaries.ts`, `stage1-candidate-gen.ts`) |
| 4 | folderBoost cache collision (key omits folderBoost) | folderBoost added to cache key (`search-utils.ts`, `memory-search.ts`) |
| 5 | folderBoost similarity clamp ceiling `1.0` on a 0–100 scale (collapses boosted hits) | ceiling `1.0` → `100` (`memory-search.ts`) |
| 6 | retrievalLevel advertised but strict-rejected by the public schema | added to memory_search schema + accurate entity/community description (`tool-schemas.ts`) |
| 7 | memory_save stats the raw caller path before allowed-root validation (existence oracle/TOCTOU) | probe after validation (`memory-save.ts`) |
| 8 | hf-model-server checks socket-dir ownership only on reclaim, not first-bind | assert unconditionally after mkdir (`hf-model-server.cjs`) |
| 9 | scan stale-cleanup deletes causal edges before the row in two transactions | wrap edge+row delete in one transaction, row-first (`memory-index.ts`) |

Doc reconciliation folded into the above: `includeArchived` reworded to a documented no-op; ENV_REFERENCE `tcp://` daemon-IPC claim dropped (deliberately unix-only; tcp:// was reviewed-and-declined in packet 026).

### Refuted / not-real (by verification)
- **memory_delete id+specFolder** — `id` is a globally-unique PRIMARY KEY; precedence documented + unit-tested. No cross-scope risk.
- **session-proxy replays memory_save** — secondary writes are rowid-keyed idempotent (vector DELETE-then-INSERT, entity REPLACE, causal IGNORE) + primary content-hash dedup; no corruption.
- **retention-sweep skips delete_after** — finding inverted the logic; sweep selects exactly on `delete_after`.
- **atomic-save commits index before file promotion** — real ordering but documented crash window, recovered at startup by `recoverPendingFiles`.
- **cancelled-scan persists writes** — durable + inline-cache-cleared; only a ≤60s self-expiring tool-cache staleness.

### Deferred (real but out of scope for a batch fix)
- **soft-delete tombstone visibility + child cascade** — REAL only when `SPECKIT_SOFT_DELETE_TOMBSTONES` is ON, which **defaults OFF**; `ENV_REFERENCE.md` explicitly says keep OFF until recall filters `deleted_at IS NULL`. Completing it (the `deleted_at IS NULL` recall filters across ~8 query paths + child cascade + tests) is a deliberate maintainer deferral, not a regression → **dedicated follow-on packet**, not bundled here.

## Method notes
- 6-wide parallel via 3 staggered scope-fanouts (staggered launches dodge the cli-opencode 4+-simultaneous-launch race).
- Scope briefs gained an explicit MCP-fallback section (use the warm-daemon CLI front doors / Grep-Read instead of blocking on a wedged MCP call).
- Baseline→delta confirmed by stashing the changed file and reproducing the 2 pre-existing failures identically.
