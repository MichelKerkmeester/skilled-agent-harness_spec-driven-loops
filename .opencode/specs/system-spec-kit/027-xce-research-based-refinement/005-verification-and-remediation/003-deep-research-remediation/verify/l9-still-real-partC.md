# L9 Still-Real Verification — Part C (17 findings)

Fresh-verifier sweep, 2026-06-12. Each finding re-checked against current code/docs with overtake-honesty against today's shipped lanes (single-writer DB lock, secret scrubber, hash-only fingerprints, --command dispatch protocol, apply-pipeline gates, launcher lifecycle doc reconciliation, detect_changes adoption, advisor doc batch).

## Summary Table

| Finding | Sev | Verdict | Fix class | Anchor evidence |
|---|---|---|---|---|
| tri-111 | P2 | STILL-REAL | code-small | vector-index-store.ts:2072-2094, 1077-1081 |
| tri-113 | P2 | STILL-REAL | code-small | checkpoints table = 0 rows; checkpoints/ = README + .needs-rebuild; no scheduler/health warning |
| tri-114 | P2 | OVERTAKEN | — | database/README.md overview + backups/README.md now document root-level `.corrupt-*`/`.pre-repair-*` convention |
| tri-116 | P3 | OVERTAKEN | — | tests/index-dedup-projection-evicted.vitest.ts pins the invariant |
| tri-117 | P2 | STILL-REAL | code-small | memory-crud-health.ts:1202-1254; hybrid-search.ts:336-357 |
| tri-118 | P2 | STILL-REAL | doc-only | handlers/README.md:115 vs memory-crud-health.ts:1250-1254 |
| tri-121 | P2 | STILL-REAL | code-small | memory-search.ts:640-644, 710-715, 1456, 1508; retrieval-observability.ts:153-155, 192-193 |
| tri-122 | P2 | STILL-REAL | code-small | memory-search.ts:1261-1263; search-results.ts:834-857, 1103-1108 |
| tri-123 | P2 | STILL-REAL | code-small | feature-flag-governance.md:36-57 still manual; no ENV_REFERENCE diff guard in tests |
| tri-124 | P2 | STILL-REAL | code-small | flag-ceiling.vitest.ts:30-52 lists 18; search-flags.ts declares 72 unique SPECKIT_* tokens |
| tri-125 | P2 | STILL-REAL | doc-only | test-validation-extended.sh:5-6 (13/52 claim); registry = 38 rules; fixtures to 067; fixtures README topology ends at 051 |
| tri-126 | P2 | STILL-REAL | doc-only | zero CLI front-door mentions in either INSTALL_GUIDE.md |
| tri-127 | P2 | STILL-REAL | doc-only | plugin_bridges/README.md:28-30, 43 vs actual dir contents |
| tri-129 | P2 | STILL-REAL | code-careful | vitest.stress.config.ts:13-18; no write-path/action-batch suite under stress_test/ |
| tri-134 | P2 | STILL-REAL | doc-only | 004 spec.md:134 vs semantic-trigger-matcher.ts:54, 467 |
| tri-135 | P2 | STILL-REAL | code-careful | trigger-goldens.json:3-8 SYNTHETIC 48d; trigger-latency-budget.vitest.ts:7-16; no live 768d harness |
| tri-142 | P3 | STILL-REAL | code-small | cli-offline-smoke.cjs:52-56 cwd=repoRoot; code-index-cli-harness.ts:178-180 cwd=worktreeRoot; tri-daemon-drill cwd==sandbox root (coincides with __dirname) |

**Tally: 15 STILL-REAL / 2 OVERTAKEN / 0 MOVED / 0 REFUTED**

---

## Per-Item Notes

### tri-111 — STILL-REAL (code-small)
`vector-index-store.ts:2072-2094` still runs `PRAGMA quick_check(1)` on every boot where the `.unclean-shutdown` marker exists, then rewrites the marker at :2094. Marker JSON (:1077-1081) carries only `pid`/`databasePath`/`startedAt` — no probe receipt, epoch, or DB-state key (mtime/size/WAL). A crash-loop on a large healthy DB pays the synchronous probe on every boot exactly as described. No receipt mechanism found anywhere in the file (`rg receipt` = 0 hits).

### tri-113 — STILL-REAL (code-small; doc-only operator policy is the cheap alternative)
Live DB: `select count(*) from checkpoints` = 0; `database/checkpoints/` holds only `README.md` + `.needs-rebuild`. No scheduler/cadence anywhere (`setInterval|schedule|cron` = 0 hits in handlers/checkpoints.ts and lib/storage/checkpoints.ts); `memory-crud-health.ts` has zero checkpoint mentions, so memory_health emits no "no recent restore point" warning. Checkpoints remain explicit-tool + pre-destructive only. None of today's lanes touched cadence.

### tri-114 — OVERTAKEN (doc reconciliation shipped)
The cited contract drift is fixed in the docs. `database/README.md` (Overview bullets + subdirectory paragraph) now says repair/corruption artifacts land "beside the live database" as root-level `.corrupt-*`/`.pre-repair-*` copies while `backups/` "remains an operator-maintained holding area... with no wired runtime writer". `database/backups/README.md` §1-2 explicitly documents the parent-level convention, including naming-table rows for `../context-index.sqlite.corrupt-*` and `../context-index.sqlite.pre-repair-*` with "apply the same retention rule". That is exactly fix-sketch option 2 (document the parent-level convention). Observed state (root-level `corrupt-20260606/20260612/20260612b`, `pre-repair-20260611/20260612`; empty `backups/`) now matches the documented contract.

### tri-116 — OVERTAKEN (regression test exists)
The requested guard shipped as `mcp_server/tests/index-dedup-projection-evicted.vitest.ts`: it inserts a logical-key row, deletes its `active_memory_projection` row, then asserts `index_memory_deferred` updates the orphan instead of throwing (plus a stale-file_path variant). If anyone reintroduced `JOIN active_memory_projection` into the same-key write guard, the orphan becomes invisible and the test's `.not.toThrow()` fails with SQLITE_CONSTRAINT_UNIQUE — the exact invariant the fix sketch asked to pin. The corrected lookup itself is intact (`vector-index-store.ts:1785-1807`, projection-free with an explanatory comment; unique index at `vector-index-schema.ts:1841-1853`).

### tri-117 — STILL-REAL (code-small)
`memory-crud-health.ts:1202-1254` still narrows the routing block to `graphChannelInvocationRate`, `channelInvocationRates`, `totalRecorded`, `windowSize`. `hybrid-search.ts:336-357` still tracks `graphHits`, `graphOnlyResults`, `multiSourceResults`, `graphHitRate` — none surface in memory_health or routing-telemetry.ts (0 hits). Degree still has no contribution metric. Value-vs-cost question remains unanswerable from the health surface.

### tri-118 — STILL-REAL (doc-only)
`handlers/README.md:115` still claims `data.routing` surfaces "graphChannelInvocationRate and per-channel counts"; `memory-crud-health.ts:1250-1254` returns rates only (`channelInvocationRates`), no `channelInvocationCounts`. One-line README fix or expose counts.

### tri-121 — STILL-REAL (code-small)
`stampFinalRankScores` (memory-search.ts:640-644) computes from the pre-dedup list length; `reconcilePostFormatResultSet` (:710-715) still only renumbers `why_ranked.rank` and is invoked after post-format dedup at :1456 and :1508. `retrieval-observability.ts:153-155` + :192-193 stamp `effectiveScore`/`scoreSource: 'finalRank'` from that stale `finalRankScore`. The regression test (`handler-memory-search.vitest.ts` dedup-trace case, ~:426-430) asserts repaired rank only — effectiveScore staleness is unpinned and unfixed.

### tri-122 — STILL-REAL (code-small)
`memory-search.ts:1261-1263` stamps `finalRankScore` on raw rows before formatting; the formatted envelope (`search-results.ts:834-857`) carries no `finalRankScore`/`sourceScores`; `attachExplainabilityToResults` runs on those narrowed rows at :1103-1108. Debug explainability for folder-boosted rankings is still derived from fallback formatted fields, not the finalRank score why_ranked used.

### tri-123 — STILL-REAL (code-small)
`manual_testing_playbook/17--governance/feature-flag-governance.md:36-40` still lists the manual pseudo-steps ("enumerate flags", "verify each flag row", "record any flag"); failure triage (:57 region) still says to diff by hand. The only test reading `ENV_REFERENCE.md` is `scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts`, which checks a single flag's default — not a code-declared-vs-documented diff. No executable governance guard exists.

### tri-124 — STILL-REAL (code-small)
`flag-ceiling.vitest.ts:30` still claims "All SPECKIT_* feature flags from search-flags.ts"; the hand-maintained array (:33-52) holds 18 flags and the self-governance footer (~:193-198) repeats the full-coverage claim. `search-flags.ts` currently declares 72 unique `SPECKIT_*` tokens (e.g. `SPECKIT_HYDE`, `SPECKIT_DUAL_RETRIEVAL`, `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_LLM_REFORMULATION` — all absent from the test). Drift has widened since the finding; the test still passes while missing most active gates.

### tri-125 — STILL-REAL (doc-only)
`scripts/tests/test-validation-extended.sh:5-6` still says "all 13 validation rules, 52 test fixtures". `scripts/lib/validator-registry.json` now defines 38 rule entries (was 29 at finding time — worse); fixtures run to `067-checklist-uppercase-x` (66 fixtures); `test-fixtures/README.md` §3 topology still ends at `046-051`. Counts should be generated, or at minimum refreshed.

### tri-126 — STILL-REAL (doc-only)
`system-spec-kit/mcp_server/INSTALL_GUIDE.md` and `system-code-graph/INSTALL_GUIDE.md` contain zero mentions of `spec-memory.cjs`/`code-index.cjs`/`skill-advisor.cjs`, `list-tools`, or `--warm-only`; verification still stops at dist-file/MCP checks. The CLI front doors are now a documented primary fallback path (CLAUDE.md, ENV_REFERENCE dual-stack rows) yet remain unverified at install time.

### tri-127 — STILL-REAL (doc-only)
`plugin_bridges/` contains `README.md`, `mk-spec-memory-bridge.mjs`, `spec-kit-opencode-message-schema.mjs`. `plugin_bridges/README.md:28-30` (tree) and :43 (key-file table) still list the removed `spec-kit-skill-advisor-bridge.mjs` and omit `mk-spec-memory-bridge.mjs` entirely — even though `mcp_server/README.md:37` correctly describes the spec-memory bridge. Directory README refresh needed.

### tri-129 — STILL-REAL (code-careful)
`mcp_server/vitest.stress.config.ts:13-18` includes only `mcp_server/stress_test/**` and excludes `mcp_server/tests/**`. No file under `stress_test/` matches reconcile/write-path/action-batch (0 hits); the substrate suites cover secret-scrub floods, v-rule floods, idempotency races, query expansion — not concurrent scan/save/delete action-batch reconciliation with subscriber fan-out. Gap unchanged.

### tri-134 — STILL-REAL (doc-only)
`004-tests-goldens-shadow-eval/spec.md:134` (REQ-011) still requires "`semantic_trigger_skipped_uncached` logged". `semantic-trigger-matcher.ts:54` types the status union and :467 returns `no_query_embedding`; `semantic_trigger_skipped_uncached` appears nowhere in mcp_server TS (0 hits). Cheapest honest fix: amend the spec acceptance wording to the shipped `no_query_embedding` diagnostic; otherwise implement the named event.

### tri-135 — STILL-REAL (code-careful)
`tests/fixtures/trigger-goldens.json:3-8` still declares SYNTHETIC 48-d engineered vectors (with an explicit honesty disclaimer); `trigger-goldens.vitest.ts` scores precision/recall over them; `trigger-latency-budget.vitest.ts:7-16` budgets synthetic work units (1,920), not live p95. No live-768d evaluation harness exists (shadow-* files are scoring/feedback infrastructure, not trigger eval). Partial mitigation by design: the shadow-telemetry threshold-band runtime + union promotion gate is the intended live-evidence channel, and the fixture's honesty metadata guards against citing synthetic pass rates — but the finding's core claim (machinery proven, live 768d readiness not) remains accurate.

### tri-142 — STILL-REAL (code-small)
`cli-offline-smoke.cjs:52-56` still forces `cwd: repoRoot` when spawning the absolute shims; `code-index-cli-harness.ts` spawns with `cwd: worktreeRoot` (:178-180); advisor test utils resolve the shim from repoRoot likewise. The newer `tri-daemon-drill.vitest.ts` does run all three shims from a /tmp sandbox, but it runs sandbox *copies* with `cwd === sandbox root`, so `__dirname`-based and cwd-based self-resolution coincide there — it cannot detect a regression that switches resolution to `process.cwd()`. The exact property (repo-absolute shim invoked from an arbitrary unrelated cwd) is still unpinned by any test.
