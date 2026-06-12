# L9 Still-Real Verification — Part A (17 findings)

Verifier: fresh Fable 5 pass, 2026-06-12. Each finding re-checked against the current working tree (branch `028-mcp-to-cli-tool-transition`). Overtake candidates from today's shipped lanes (single-writer DB lock + exit-86, secret scrubber, hash-only fingerprints, --command dispatch protocol, apply-pipeline confirm gates + retention, launcher lifecycle doc reconciliation, detect_changes review adoption, advisor doc batch) were checked per item — none of those lanes intersect these finding surfaces, except a partial doc touch on tri-056 (noted below).

## Summary

| ID | Sev | Verdict | Fix class | Anchor evidence (current) |
|---|---|---|---|---|
| tri-006 | P1 | STILL-REAL | code-small | `lib/search/vector-index-queries.ts:88-90`; `lib/search/sqlite-fts.ts:180` |
| tri-010 | P1 | STILL-REAL | code-careful | `lib/search/vector-index-queries.ts:103-120` vs `:1561,1567` |
| tri-017 | P1 | STILL-REAL | doc-only | `references/cli/memory_handback.md:46` |
| tri-018 | P1 | STILL-REAL | code-careful | `lib/governance/scope-governance.ts:287`; `handlers/memory-save.ts:3149` |
| tri-019 | P1 | STILL-REAL | code-careful | `handlers/session-learning.ts:199-205,503-505,697-699` |
| tri-044 | P1 | STILL-REAL | code-small | `scripts/tests/manual-playbook-runner.ts:264-283` |
| tri-049 | P2 | STILL-REAL | code-small | `system-code-graph/mcp_server/lib/code-graph-db.ts:1333-1334` |
| tri-053 | P2 | STILL-REAL | doc-only | `lib/telemetry/README.md:58,84,93` vs `consumption-logger.ts:91-96` |
| tri-054 | P2 | STILL-REAL | code-careful | `context-server.ts:1141-1144`; `handlers/memory-index.ts:911` |
| tri-055 | P2 | STILL-REAL | code-careful | `handlers/memory-crud-health.ts:580-581,658,692` |
| tri-056 | P2 | STILL-REAL | doc-only | `database/checkpoints/README.md:92` vs `lib/storage/checkpoints.ts:2642-2643` |
| tri-057 | P2 | STILL-REAL | code-small | `scripts/memory/cleanup-index-scope-violations.ts:322-377` |
| tri-059 | P3 | STILL-REAL | doc-only | `mcp_server/README.md:174` vs `lib/search/vector-index-schema.ts:626` |
| tri-060 | P2 | STILL-REAL | code-small | `lib/search/query-router.ts:370,438`; `handlers/memory-search.ts:973` vs `:1096-1106` |
| tri-061 | P2 | STILL-REAL | code-small | `lib/search/query-router.ts:438` vs `lib/search/hybrid-search.ts:1266-1276` |
| tri-062 | P2 | STILL-REAL | code-small | `handlers/memory-search.ts:1252-1263`; `lib/search/session-state.ts:376-394` |
| tri-063 | P3 | STILL-REAL | doc-only | `mcp_server/ENV_REFERENCE.md:127` (says 179; table parse = 237) |

Result: 17/17 STILL-REAL, 0 MOVED, 0 OVERTAKEN, 0 REFUTED. Paths below are relative to `.opencode/skills/system-spec-kit/` unless prefixed otherwise.

## Per-item notes

### tri-006 — Raw specFolder LIKE widens scoped retrieval — STILL-REAL (code-small)
`appendSpecFolderScope()` at `mcp_server/lib/search/vector-index-queries.ts:82-90` still pushes raw `` `${specFolder}/%` `` into `LIKE ?` with no escaping; same unescaped pattern at `:279`, `:540`+`:568` (params), and `:861`. `mcp_server/lib/search/sqlite-fts.ts:180` uses `LIKE ? || '/%'` with raw specFolder, and `mcp_server/lib/search/hybrid-search.ts:697` and `:2148` repeat it. `escapeLikePattern` exists in `mcp_server/handlers/handler-utils.ts:25` but is only used by causal-links-processor — zero usages in the search lib. Fix is mechanical: route all scope clauses through one helper with `ESCAPE '\'`.

### tri-010 — memory_health misses active vec_<dim> divergence — STILL-REAL (code-careful)
`getActiveVectorSourceForQuery()` (`vector-index-queries.ts:103-120`) selects `active_vec.vec_<dim>` for non-default embedders, but `verify_integrity` still hard-codes `activeVectorSchema('vec_memories')` for missing-vector (`:1561`) and total-vector (`:1567`) counts. `memory-crud-health.ts:986-1005` builds the consistency block from that report, so a healthy verdict can coexist with an incomplete `vec_768`. code-careful: integrity/repair path with autoClean semantics.

### tri-017 — Session scoping docs overclaim E_SESSION_SCOPE coverage — STILL-REAL (doc-only)
`references/cli/memory_handback.md:46` still says `memory_context`, `memory_search`, `memory_save` "and the rest" return `E_SESSION_SCOPE` for a foreign sessionId. `resolveTrustedSession` appears only in `handlers/memory-context.ts:1146`, `handlers/memory-search.ts:831`, `handlers/memory-triggers.ts:348` (plus its definition in `lib/session/session-manager.ts:413`). memory_save and other sessionId-accepting tools are unguarded, so the blanket claim remains false. Narrow the doc (or widen the gate — but that becomes tri-018/019 work).

### tri-018 — Governed ingest session boundary is only syntactic — STILL-REAL (code-careful)
`validateGovernedIngest` (`lib/governance/scope-governance.ts:250+`) only requires presence (`:287` "sessionId is required for governed ingest") and normalizes via `normalizeId` (`:221`); no trust resolution. Call sites unchanged: `handlers/memory-save.ts:3149`, `handlers/memory-index.ts:361`, `handlers/memory-ingest.ts:147` — none precede the call with `resolveTrustedSession`. Arbitrary session labels still stamp governed rows/jobs.

### tri-019 — Learning tools allow arbitrary sessionId targeting — STILL-REAL (code-careful)
`handlers/session-learning.ts:199-205` `normalizeSessionId` is trim-only. Postflight row selection uses the caller-supplied id at `:503-505`, and `memory_get_learning_history` filters by it at `:690-699`. No `resolveTrustedSession` anywhere in the file (repo grep confirms it lives only in the three tri-017 handlers).

### tri-044 — Playbook runner ingests vendored node_modules markdown — STILL-REAL (code-small)
`scripts/tests/manual-playbook-runner.ts:264-283` `readScenarioFiles()` walks every directory from PLAYBOOK_ROOT, skipping only `_deprecated`; it accepts any `.md` except `manual_testing_playbook.md`, with no dot-dir or node_modules exclusion. The hidden tree still exists: `manual_testing_playbook/.opencode/node_modules/` (with `package.json`/`package-lock.json`) sits beside the `NN--category` files, so third-party README/LICENSE markdown is discoverable as scenarios.

### tri-049 — Code graph subject fallback escapes LIKE metachars without ESCAPE — STILL-REAL (code-small)
`.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1333-1334`: `subject.replace(/[%_]/g, '\\$&')` then `LIKE ?` with no `ESCAPE '\'` clause — in SQLite the backslash is a literal, so escaped subjects containing `_`/`%` fail to match their own paths. Exact-match arms at `:1319-1331` still reduce this to fallback-only impact; the user-facing route via `handlers/query.ts:773-781` (`resolveRelationshipFilePath` → `resolveSubjectFilePath`) is unchanged.

### tri-053 — Consumption logging docs disagree on active vs inert — STILL-REAL (doc-only)
`lib/telemetry/README.md` still calls consumption-logger "Deprecated… `isConsumptionLogEnabled()` returns `false`" (`:58`), "Always false after audit" (`:84`), and lists `SPECKIT_CONSUMPTION_LOG` as "inert / Deprecated and disabled" (`:93`). Code says the opposite: `consumption-logger.ts:91-96` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')` documented "graduated, default ON", and `ENV_REFERENCE.md:364` lists default `true`. Doc reconciliation still pending.

### tri-054 — memory_index_scan runs as one foreground JSON-RPC call — STILL-REAL (code-careful)
`context-server.ts:1141-1144` awaits `dispatchTool` inline inside the CallTool handler; `handlers/memory-index.ts:911` awaits `processBatches` over all files before any response (comment at `:427` acknowledges processBatches may exceed the lease expiry). No jobId early-return or queued-scan path exists. Foreground behavior confirmed; the daemon-health impact remains plausible-but-unproven, as the original verify_proof noted.

### tri-055 — activeScanJob health signal served through the saturated path — STILL-REAL (code-careful)
`handlers/memory-crud-health.ts:580-581` derives `hasActiveScanJob` from `scan_started_at`; `:658` computes it and `:692` returns it only inside memory_health, which dispatches through the same CallTool handler (`context-server.ts:1046+`) and event loop the scan occupies. The launcher's liveness probe still requires a JSON-RPC `initialize` reply (`.opencode/bin/lib/launcher-ipc-bridge.cjs:148-161`), so during a long scan the observability signal and the liveness probe both contend with the busy loop. Mitigation note: the reap decision uses a consecutive-fail circuit with active-scan grace (comment at `launcher-ipc-bridge.cjs:405-411`), which softens the false-reap consequence but does not provide out-of-band scan-progress visibility.

### tri-056 — checkpoint README restore-backups claim vs .bak reality — STILL-REAL (doc-only)
Partially corrected, core claim remains: the key-files table now correctly attributes `restore-backups/` to `scripts/migrations/restore-checkpoint.ts` (`database/checkpoints/README.md:88`), but the Lifecycle bullet at `:92` still says `checkpoint_restore` "copies the target into `restore-backups/`". Code uses transient sibling `.bak` files: `lib/storage/checkpoints.ts:2642-2643` (`${liveMainPath}.bak`), with `.bak` rollback semantics throughout `:2666-2781`. One-bullet doc fix.

### tri-057 — cleanup-index-scope-violations deletes rows without causal-edge cleanup — STILL-REAL (code-small)
`scripts/memory/cleanup-index-scope-violations.ts` `applyCleanup` (`:322-377`) deletes from memory_history, memory_lineage, vec_memories, feedback_events, and a dozen other reference tables, then deletes `memory_index` rows (`:376`) — `causal_edges` is absent (zero matches for "causal" in the file). `lib/storage/causal-edges.ts:911-919` `findOrphanedEdges` defines exactly the dangling state this leaves behind, deferred to a later health auto-repair.

### tri-059 — mcp_server README reports stale schema version — STILL-REAL (doc-only)
`mcp_server/README.md:174` still says "`SCHEMA_VERSION` (currently `30`)" and describes only migrations 28-30; `lib/search/vector-index-schema.ts:626` defines `SCHEMA_VERSION = 37`. Stale by seven migrations.

### tri-060 — Routing telemetry counts planning/cache calls as retrieval utilization — STILL-REAL (code-small)
`recordInvocation` fires inside `routeQuery` (`lib/search/query-router.ts:370` disabled-flag arm, `:438` main arm). `handlers/memory-search.ts:973` calls `routeQuery` for queryPlan telemetry before the cache lookup at `:1096-1106` (cached payloads return at `:1105-1106` having already incremented the window), and `handlers/memory-context.ts:1815` records a plan for envelope-only calls. Utilization still conflates planning with execution.

### tri-061 — Recorded channels diverge from channels actually executed — STILL-REAL (code-small)
`query-router.ts:438` records `adjustedChannels` at routing time; `hybrid-search.ts:1266-1271` then applies `forceAllChannels` and `:1273-1276` removes caller-disallowed channels (`getAllowedChannels` at `:915-928` drops graph+degree when `useGraph === false`). Over- and under-reporting both still possible; telemetry-only drift, retrieval unaffected.

### tri-062 — Goal refinement can reintroduce why_ranked score/order drift — STILL-REAL (code-small)
`handlers/memory-search.ts:1252-1253` applies `refineForGoal`, which boosts `score` and re-sorts (`lib/search/session-state.ts:376-394`), but `stampFinalRankScores` runs only `if (folderBoostRankingApplied)` (`:1261-1263`). `lib/observability/retrieval-observability.ts:152-167` prefers `finalRankScore` and otherwise falls back through `intentAdjustedScore`/`rrfScore` before the mutated `score`, so why_ranked.effectiveScore can describe a pre-refinement score while rank reflects the post-refinement order. Explainability drift only.

### tri-063 — ENV_REFERENCE unique-variable count is stale — STILL-REAL (doc-only)
`mcp_server/ENV_REFERENCE.md:127` claims "Total unique variables documented: 179". Parsing the document's own variable table rows today yields 237 unique names (matches the prior verify_proof recount). The count line is stale relative to the table it summarizes.
