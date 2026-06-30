# Resource Map — 032 infra root-cause deep research

Evidence sources consulted across iterations 001–003, grouped by sub-question. All references are read-only; no source/git/DB mutations were made during research.

## SQ1 — Substrate 5-vs-4 (test bug)
| File | Lines | Role |
|---|---|---|
| `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | 31–47 | The stale assertion: requests 4 scenarios, asserts 4 rows + all PASS |
| `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | 47–62 | Scenario parser (split/Set-dedup/sort — cannot duplicate) |
| ↳ same | 326–338, 626–630 | `connectSharedClient` failure → `runner:<name>` diagnostic row pushed before scenario rows |
| ↳ same | 445–459 | Tool-availability gate → SKIP when client absent |
| ↳ same | 582–590, 607–638 | Single TSV write in `finally`; builds **only** `clients.mk_spec_memory` (one daemon) |
| `mcp_server/stress_test/substrate/README.md` | 17–18 | Conflicting claim of two daemons (Memory + Code Graph) |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` | 1–6 | Captured TSV: header + `runner:mk-spec-memory`(FAIL,−32000), 403/404/407/410 |
| `manual_testing_playbook/24--local-llm-query-intelligence/{403,404,407}-*.md` | 41/46/44 | Confirm 403/404/407 require Code Graph |

## SQ2 — Memory PRIMARYKEY recurrence (production defect)
| File | Lines | Role |
|---|---|---|
| `mcp_server/lib/search/vector-index-store.ts` | 739, 746, 1270, 1297 | `.unclean-shutdown` written on every DB open |
| ↳ same | 1353, 1366–1369 | Marker removed only after WAL checkpoint + detach + `db.close()` |
| `mcp_server/lib/search/vector-index-mutations.ts` | 264, 363 | `INSERT INTO memory_index` (embedded + deferred save paths) |
| `mcp_server/lib/search/vector-index-schema.ts` | 2452–2458 | `memory_fts_insert` trigger mirrors `new.id` into `memory_fts` |
| `mcp_server/context-server.ts` | 360–380 | Boot FTS integrity probe — **detect-only**, no repair |
| ↳ same | 1473, 1491, 1507, 1528, 1543 | `fatalShutdown()` clean path — time-bounded, not barrier-verified |
| ↳ same | 1634, 1636, 1648, 1649, 2070 | Direct `process.exit(1)` paths that bypass `closeDb()` |
| `mcp_server/handlers/memory-crud-health.ts` | 623, 639, 654, 662 | Confirmation-gated `autoRepair` FTS rebuild (the only repair) |
| `032/implementation-summary.md` | 50, 79 | Repair chose FTS-shadow rebuild after ruling out duplicate source IDs |

## SQ3 — Graph-metadata churn (fixed, re-verified)
| File | Lines | Role |
|---|---|---|
| `mcp_server/lib/graph/graph-metadata-schema.ts` | 57–58 | Declares `last_active_child_id` / `last_active_at` |
| `mcp_server/lib/graph/graph-metadata-parser.ts` | 1096, 1098, 1135, 1170, 1258 | Preserve pointers; skip no-op timestamp rewrites |
| `scripts/core/workflow.ts` | 1679–1705 | Canonical save refreshes only `validatedSpecFolderPath` |
| `scripts/graph/backfill-graph-metadata.ts` | 7–8, 70–72, 193–194 | Broad walk confined to explicit backfill tool / default root |
| `scripts/tests/graph-metadata-refresh.vitest.ts` | 131, 148 | Regression coverage |

## SQ4 — Common cause (launcher respawn, no clean-close barrier)
| File | Lines | Role |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | 878–883 | Healthy live lease holder is bridged, not clobbered |
| ↳ same | 283, 292–301 | `reapLeaseChildBeforeRespawn` SIGTERM→SIGKILL |
| ↳ same | 321–322, 329, 336, 343–347 | Respawn locks guard duplicate respawners, **not** DB closure; relaunch after reap |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | 126, 164, 191, 202, 343–346 | Deep JSON-RPC probe; no `initialize` reply → `action: respawn` |
| `.opencode/bin/lib/model-server-supervision.cjs` | 19 | `RESPAWN_REAP_GRACE_MS` constant |
| `031/009/implementation-summary.md` | 55, 111 | 031/009 coverage deterministic, not live |
| `mcp_server/tests/launcher-lease.vitest.ts` | 173–174 | Real-process lease suite is **skipped** |

## Loop artifacts
| File | Role |
|---|---|
| `research/deep-research-strategy.md` | Charter (SQ1–SQ4, stop conditions) |
| `research/iteration-001.md` · `002` · `003` | Per-iteration findings + negative knowledge |
| `research/deep-research-state.jsonl` | newInfoRatio / answered / open per iteration |
| `research/research.md` | This loop's synthesis + recommended fixes (F1–F4) |
