---
title: "Implementation Plan: Manual Playbook Sweep Findings Remediation [template:level_2/plan.md]"
description: "Per-finding root-cause hypotheses and proposed fixes, grouped by theme, updated dynamically as new FAILs are confirmed."
trigger_phrases:
  - "playbook sweep findings remediation plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Manual Playbook Sweep Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

## Approach

For each FAIL scenario, this plan states: the observed symptom (from the scenario's own Evidence/VERDICT text), a root-cause hypothesis, the files most likely responsible (per the scenario's own Failure Triage pointers where present), and a proposed fix direction. Entries are grouped by theme where a shared root cause is plausible. **No fix has been implemented yet** — this is planning only, per REQ scope. Each hypothesis must be re-verified against real code before any change lands (a dispatch's self-reported root cause is a hypothesis, not a fact).

---

## Group A: Feature-flag / kill-switch propagation bugs

FIVE findings now show the same shape: a boolean env flag doesn't actually control its feature's effect, despite unit tests passing. This is a strong signal there may be ONE shared root cause (e.g. a common flag-reading utility that's broken, or a caching layer that ignores flag state) rather than 5 independent bugs -- worth checking for a shared pattern before fixing each individually. Members: REQ-110 (SPECKIT_GRAPH_UNIFIED), REQ-113 (SPECKIT_MEMORY_ADAPTIVE_RANKING), REQ-200 (ENABLE_BM25), REQ-211 (SPECKIT_CAUSAL_BOOST / isCausalBoostEnabled), REQ-212 (SPECKIT_COMMUNITY_SEARCH_FALLBACK), REQ-214 (isContextHeadersEnabled / contextual tree injection) -- SIX findings now, strong signal of a shared root cause worth investigating as ONE fix before touching each site individually.

### REQ-110 — `SPECKIT_GRAPH_UNIFIED=false` doesn't disable graph signals
- **Symptom**: `meta.cacheHit: true`, `killSwitchActive:false`, `graphSignalsApplied:true`, `selectedChannels` still includes `graph`/`degree` even with the flag off.
- **Root-cause hypothesis**: Stage 2 of the unified retrieval pipeline reads a cached result computed while the flag was on, or checks the flag at the wrong stage boundary (a caching/staleness issue, not a missing flag-check).
- **Affected files**: graph contribution trace metadata path (`graphContribution` in the unified retrieval Stage 2 code), CTE/query-plan construction for graph channels.
- **Proposed fix**: Ensure the flag is re-checked (not just cached) at Stage 2 entry; invalidate `cacheHit` when the flag state differs from the cached computation's flag state.

### REQ-113 — `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` doesn't emit `adaptiveShadow` proposal
- **Symptom**: Flag-on run produces no `adaptiveShadow` proposal payload; flag-off run also produces no proposal output (expected — but flag-on should differ from flag-off and doesn't).
- **Root-cause hypothesis**: The proposal-emission code path is gated on a second condition beyond the flag (e.g. a minimum access/validation signal count) that isn't being met in the test scenario, OR the emission path was never wired to this flag.
- **Affected files**: Adaptive-ranking proposal emission logic; bounded delta cap check.
- **Proposed fix**: Verify adaptive signals are actually being recorded from access/validation events first (per the scenario's own triage); if they are, trace why the bounded delta cap or emission gate suppresses output.

---

## Group B: "Read-only" paths that mutate data

### REQ-156 — `indexMemoryDeferred` "read-only" same-path update mutates `encoding_intent`
- **Symptom**: Correct intent labels assigned/persisted for document/code/structured examples, but a same-path update changed row `id: 2`'s `encoding_intent` from `"code"` to `"document"` — this path is documented/expected to be read-only for existing rows.
- **Root-cause hypothesis**: The deferred indexing path recomputes `encoding_intent` on every pass (including for already-indexed rows) instead of only computing it once at first-index time, and the recompute uses a different/updated classification heuristic than the original.
- **Affected files**: Intent classification rules, metadata persistence in the deferred-indexing write path.
- **Proposed fix**: Gate the `encoding_intent` write behind an "is this a first-time index" check, or make the deferred path explicitly skip re-classification of fields that already have a value (true read-only-on-existing-rows semantics).

---

## Group C: Scoring / fusion pipeline gaps

Three findings all touch the Stage-2 scoring/fusion pipeline; worth investigating as one connected root cause before assuming three separate bugs.

### REQ-129 — Stage-2 score sync missing for non-hybrid path
- **Symptom**: `searchType: "hybrid"`, `isHybrid: true`, `intentWeightsApplied: "off"`, no Step 4 `intentAdjustedScore`, no trace-level Math.max sync progression — for a request expected to take the non-hybrid path.
- **Root-cause hypothesis**: The request is being routed into the hybrid path even when non-hybrid was expected/requested, OR the non-hybrid path exists but never runs the Math.max score-sync step that the hybrid path does.
- **Affected files**: Stage-2 intent weighting logic, `resolveEffectiveScore` fallback chain.
- **Proposed fix**: First confirm routing (is this scenario actually reaching non-hybrid code, or mis-routed into hybrid?) — the fix branches depending on that answer.

### REQ-133 — Channel min-representation ignores `QUALITY_FLOOR=0.005`
- **Symptom**: Top-k representation logic present, but channels scoring `0.004`/`0.001` (below the `0.005` floor) still receive representative slots/promotions.
- **Root-cause hypothesis**: The quality-floor check is applied before min-representation guarantees are computed, so min-representation's "ensure every channel gets ≥1 slot" logic overrides the floor instead of being bounded by it.
- **Affected files**: Channel min-representation algorithm, quality-floor threshold check ordering.
- **Proposed fix**: Apply the quality floor as a hard filter before min-representation selection, not after (or make min-representation floor-aware).

### REQ-134 — `confidenceTruncation` metadata missing from real traces
- **Symptom**: Synthetic long-tail test passes (cliff detection + documented tests), but a real long-tail query's trace doesn't expose `thresholdMultiplier`/`medianGap`/`cutoffGap`/`minResultsGuaranteed`.
- **Root-cause hypothesis**: The metadata is computed but only attached to the trace object in the synthetic-test code path, not in the real query execution path (a wiring gap between test harness and production trace assembly).
- **Affected files**: Cliff-detection algorithm's trace-metadata emission.
- **Proposed fix**: Confirm the metadata computation itself runs on real queries (add a log/assert), then trace why it isn't reaching the trace object that ships to callers.

---

## Group D: Individual findings (no shared theme identified yet)

### REQ-003 — BM25 re-index gate
- **Symptom**: Gate doesn't reliably detect trigger mutations vs FTS5-only lexical updates.
- **Fix direction**: Inspect `syncChangedRows()`; ensure BM25 enablement state is checked separately from generic FTS5 sync evidence.

### REQ-004 — Bounded graph walk trace fields missing
- **Fix direction**: `mcp_server/formatters/search-results.ts`, `mcp_server/lib/search/hybrid-search.ts` — confirm bounded-graph fields are populated in the trace envelope; cross-check against `search-results-format.vitest.ts`.

### REQ-015 — Trigger-phrase matching cache/reload issue
- **Fix direction**: Verify `idx_trigger_cache_source` index exists; confirm reload query filters to successful rows with non-empty trigger phrases.

### REQ-016 — `memory_context` specFolder/intent mismatch
- **Fix direction**: Check intent resolution when specFolder is provided without explicit intent.

### REQ-030 — `memory_list` filter/specFolder issue
- **Fix direction**: Verify specFolder path resolution under active filters.

### REQ-032 — `session_health` backend unavailable
- **Symptom** (from log, since the scenario file itself has no dedicated Evidence section): `backend unavailable`, `ECONNREFUSED`, `exitCode: 75`.
- **Fix direction**: This looks like the recurring spec-memory-daemon-not-warm environmental gap seen across the sweep (same signature as several BLOCKED scenarios), not necessarily a code bug in `session_health` itself — **needs re-verification with the daemon warm** before treating this as a fix target.

### REQ-033 — `session_resume` phase-parent redirect not visible
- **Symptom** (from log): target identified, child continuity returned before parent history, but explicit phase-parent redirect/listing wasn't visible.
- **Fix direction**: Check `session_resume`'s phase-parent detection branch — confirm it fires and its output ordering places parent-listing before child continuity when the target is a phase parent.

### REQ-039 — `detectRuntimeMismatch` assertion/count drift
- **Fix direction**: Re-run `npm test -- --run tests/startup-checks.vitest.ts -t detectRuntimeMismatch`; inspect `startup-checks.ts` for stale count assumptions.

### REQ-040 — Spec docs disappear under `qualityGateMode: 'warn-only'`
- **Fix direction**: `handlers/memory-index.ts` — verify warn-only mode doesn't accidentally exclude spec docs from the scan results it returns.

### REQ-048 — Needs-rebuild sentinel survives successful boot rebuild
- **Fix direction**: `runCheckpointNeedsRebuildRepair` (`mcp_server/context-server.ts`) and `repairNeedsRebuildSentinel` (`mcp_server/lib/storage/checkpoints.ts`) — confirm the sentinel is cleared on the success path, not just attempted.

### REQ-056 — `memory_causal_stats` rejects `scope` parameter
- **Fix direction**: Add `scope` to the accepted parameter schema for `memory_causal_stats`, or document why it's intentionally excluded and fix the scenario's expectation instead.

### REQ-059 — Empty learning history when history expected
- **Fix direction**: `memory_get_learning_history` query — verify the underlying query isn't over-filtering (e.g. wrong status enum, wrong date range default).

### REQ-062 — Terse FAIL, no evidence
- **Fix direction**: **Needs re-verification** — the dispatch's own output didn't cite concrete evidence, so no fix should be proposed until this scenario is re-run with a stricter evidence requirement.

### REQ-064 — Eval report returns 0 eval runs/sprint groups
- **Fix direction**: `handlers/eval-reporting.ts`, `lib/eval/reporting-dashboard.ts` — confirm the "active data set" the report reads from actually contains the eval runs used for this test, or that report is reading the wrong DB/table scope.

### REQ-074 — `Math.max/min` spread still throws `RangeError`
- **Fix direction**: A prior fix (P0-6 era per playbook ID 083) replaced some but not all spread call sites — grep for remaining `Math.max(...arr)`/`Math.min(...arr)` patterns and replace with a stack-safe reduce.

### REQ-077 — Dedup writes 5 rows instead of 1
- **Fix direction**: Dedup lookup query currently uses `(canonical_file_path = ? OR file_path = ?)` plus a nullable `IS NULL OR = ?` predicate — this OR-shape likely matches too broadly or too narrowly depending on which column is populated; needs a single canonical-path resolution before the dedup check runs, not an OR across two possibly-divergent columns.

### REQ-079 — Logger gate active when expected inert
- **Fix direction**: Inert/active mode toggle — confirm the toggle's default state and that `E_SESSION_SCOPE` isn't being thrown before the inert check is reached.

### REQ-085 — Retrieval events not logged to eval tables
- **Fix direction**: Confirm eval DB write path is actually invoked from `memory_search`/`memory_context` handlers (may be entirely unwired for these two tools, not just misconfigured).

### REQ-087 — int8 quantization no-go criteria not reaffirmed
- **Fix direction**: Not a code fix — re-run the benchmark with current data, compare against the original no-go thresholds, and update the decision record with fresh numbers (confirm the no-go still holds, or document that it no longer does).

### REQ-126 — Vitest baseline count mismatch
- **Fix direction**: Likely a stale scenario-doc expectation (350 vs a now-larger 365-test suite) — confirm current passing count is legitimate (no real regression) via `npm test`, then correct the scenario file's expected baseline rather than changing code.

### REQ-174 — `memory_context` folder-routing fails with `E_SESSION_SCOPE`
- **Symptom**: Creation and folder-discovery validation pass, but the folder-routing check on `memory_context` fails with `E_SESSION_SCOPE` instead of producing routing evidence.
- **Root-cause hypothesis**: `generateFolderDescriptions`'s preference/repair logic likely has a stale-detection or missing-file fallback bug that leaves the session scope unresolved before routing runs.
- **Affected files**: description.json generation (`create.sh`), stale-detection mtime comparison, `generateFolderDescriptions` preference/repair path, realpath containment check.
- **Proposed fix**: Trace why `E_SESSION_SCOPE` fires — check whether it's a genuine scope-resolution bug or a symptom of the repair path not running before the routing check reads folder state.

### REQ-175 — `vec_memories`/`vec_768` dual-write desync + broken KNN distance
- **Symptom**: `vec_memories` has 17 rows, `vec_768` has 18464 (18456 rows missing from `vec_memories`); KNN rank-1 result returns the seed row but with distance `1.37` instead of `0` (should be an exact self-match); the expected factory log at `/tmp/mk-spec-memory-daemon.log` doesn't exist.
- **Root-cause hypothesis**: Three related but distinct issues — (1) the dual-write to both vector tables isn't transactionally coupled, so `vec_memories` silently falls far behind `vec_768`; (2) `vec_memories`'s blob format doesn't match `vec_<dim>`'s embedding-buffer encoding, breaking distance computation even for identical vectors; (3) the factory/shard-fallback log path may have changed or logging was disabled.
- **Affected files**: `mcp_server/lib/embedders/reindex.ts` (`writeVectorsToShard`, `writeVectorsToKnn`), `to_embedding_buffer(embedding)` call sites, `shared/embeddings/factory.ts::readActiveOllamaEmbedderFromDb`.
- **Proposed fix**: This is the highest-severity finding so far (real data-integrity gap, not just a metadata/UX issue) — prioritize: (a) confirm the dual-write transaction actually wraps both INSERTs, (b) confirm both tables use the identical blob encoding for the same embedding, (c) confirm the shard-fallback filename pattern and log path are current.

### REQ-176 — Quality-check retry loop ignores `maxRetries` override
- **Symptom**: Low-quality content retried once and rejected with reason `after 1 auto-fix attempt(s)`, but the caller submitted `maxRetries: 2` — the loop stopped after 1 attempt instead of honoring the configured max.
- **Root-cause hypothesis**: The retry loop likely has a hardcoded default (1 attempt) that isn't reading the caller-supplied `maxRetries` option, or reads it but off-by-one/early-exits before reaching the configured count.
- **Affected files**: Quality-check retry loop, rejection-reason message generation.
- **Proposed fix**: Confirm `maxRetries` is actually threaded from the call site into the retry loop's condition; check for an off-by-one in the loop bound vs the rejection message's attempt count.

---

## Group E: Pipeline-architecture findings (14--pipeline-architecture category)

### REQ-183 — DB hot-rebinding fails with invalid tier + missing update marker
- **Symptom**: Mutation command fails with `ERROR: Invalid tier "scratch". Must be one of: constitutional, critical, important, normal, temporary, deprecated`; `.db-updated` marker file absent; `memory_health()` reports `degraded` not healthy afterward.
- **Root-cause hypothesis**: The scenario's own test command may be using a stale/invalid tier value (`scratch`) that was never a valid enum member — worth checking whether this is a scenario-doc bug (wrong tier name in the test command) vs a real gap in tier validation. Separately, the missing `.db-updated` marker and degraded health suggest the hot-rebind path doesn't fully complete even when it should.
- **Affected files**: DB_UPDATED_FILE marker detection logic, DB reinitialization/cache-clearing path.
- **Proposed fix**: First confirm whether `scratch` was ever a valid tier (check the enum and the scenario doc's history) — if the scenario doc is simply wrong, fix the doc; if `scratch` should be valid, add it to the enum. Independently investigate why `.db-updated` isn't being written and why health stays degraded.

### REQ-185 — DB path resolution diverges between shared resolver and eval entry points
- **Symptom**: For the same `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` env vars, the shared resolver resolves to `.../database/spec-kit-a/context-index.sqlite` but some eval entry points resolve to `.../database/context-index.sqlite` (missing the `spec-kit-a` segment).
- **Root-cause hypothesis**: Not every consumer imports the shared DB-path resolver module — some eval scripts likely hardcode or independently construct the DB path, missing whatever logic adds the `spec-kit-a` subdirectory segment.
- **Affected files**: Shared DB-path resolver module, eval entry-point scripts that construct DB paths independently.
- **Proposed fix**: Audit all DB-path construction call sites; replace any independent path construction in eval entry points with the shared resolver import. This is a real correctness risk (different processes could read/write different DB files without realizing it).

### REQ-188 — Embedding model IDs don't match scenario expectation
- **Symptom**: Expected `unsloth/bge-base-en-v1.5-GGUF` / `onnx-community/bge-base-en-v1.5-ONNX`; actual local defaults are `nomic-embed-text-v1.5` / `nomic-ai/nomic-embed-text-v1.5`.
- **Root-cause hypothesis**: Most likely the embedding model catalog was intentionally changed (nomic replacing bge as the default) and the scenario doc is stale — but this needs confirmation before assuming it's not a real regression, since a silent default-model change could affect embedding quality/compatibility for existing vectors.
- **Affected files**: `mcp_server/api/providers.ts`, `shared/embeddings.ts` (or scenario doc if confirmed stale).
- **Proposed fix**: Check git history for when the default model changed and why; if intentional, correct the scenario doc; if accidental, revert or investigate.

### REQ-190 — Learned-trigger feedback blocked by shadow-period gate
- **Symptom**: `memory_validate` returns `applied: false, reason: "shadow_period"` — a helpful validation never persists a learned trigger, contradicting the scenario's expectation that it should.
- **Root-cause hypothesis**: This may be working-as-designed (a shadow period intentionally delays trigger application) but the scenario's own Expected section wasn't updated to account for it, OR the shadow period is misconfigured/never expires in this environment.
- **Affected files**: Trigger-learning pipeline, safeguard/shadow-period configuration.
- **Proposed fix**: Confirm the shadow-period's intended duration and whether the test environment should have exited it; if working as designed, correct the scenario's Expected section instead of the code.

### REQ-192 — Legacy V1 pipeline not fully removed
- **Symptom**: Scenario expects zero V1 pipeline references; `postSearchPipeline` (`mcp_server/handlers/memory-search.ts`) and `isPipelineV2Enabled()` (`mcp_server/tests/pipeline-v2.vitest.ts`) still exist; `memory-search.ts` calls `executePipeline()`.
- **Root-cause hypothesis**: The V1→V2 migration was left partially complete — dead V1 code paths and a feature-flag check (`isPipelineV2Enabled`) remain even though V2 should now be the only path.
- **Affected files**: `mcp_server/handlers/memory-search.ts`, `mcp_server/tests/pipeline-v2.vitest.ts`.
- **Proposed fix**: Remove the remaining V1 code path and the now-unnecessary V2 feature-flag check, confirming `executePipeline()` fully replaces `postSearchPipeline` behavior first.

### REQ-193 — Lineage backfill rollback drill: tests pass, evidence transcript incomplete
- **Symptom**: `memory-lineage-backfill.vitest.ts` passes fully, but the observed transcript didn't show the required execution/rollback evidence the scenario expects to see.
- **Root-cause hypothesis**: This looks like a dispatch-evidence-capture gap (the model didn't paste enough transcript detail) rather than a real code bug — the underlying tests did pass.
- **Affected files**: N/A pending re-verification; possibly `lib/storage/lineage-state.ts` / migration checkpoint scripts if a re-run genuinely can't produce the expected evidence.
- **Proposed fix**: **Needs re-verification** — re-run with an explicit instruction to capture full rollback-drill transcript output before concluding there's a real gap.

### REQ-194 — Lineage state active-projection/asOf resolution: tests pass, coverage evidence incomplete
- **Symptom**: `memory-lineage-state.vitest.ts` passes fully, but the transcript didn't show both valid/malformed lineage cases plus timestamp-order coverage.
- **Root-cause hypothesis**: Same shape as REQ-193 — likely a dispatch-evidence-capture gap, not a code bug, since the test suite itself passed.
- **Affected files**: N/A pending re-verification; possibly `validateTransitionInput()` in `lib/storage/lineage-state.ts` if a re-run surfaces a real gap.
- **Proposed fix**: **Needs re-verification** — re-run with explicit instruction to demonstrate both valid/malformed cases and timestamp-order assertions in the captured evidence.

### REQ-200 — `ENABLE_BM25` defaults to enabled instead of documented default-disabled
- **Symptom**: `bm25-index.ts` returns `true` when `ENABLE_BM25` is unset, contradicting the expected opt-in/default-disabled behavior; retrieval path also reported degraded readiness despite a fast (2778ms) quick-search completion.
- **Root-cause hypothesis**: The flag check likely uses `!== 'false'` (defaults to true) instead of `=== 'true'` (defaults to false), inverting the intended opt-in semantics.
- **Affected files**: `bm25-index.ts` enablement check; separately, degraded-readiness reporting despite fast completion may be a distinct instrumentation bug worth checking.
- **Proposed fix**: Invert the enablement check's default; verify no other code path relies on the current (wrong) default being `true`.

### REQ-205 — `SPECKIT_STRICT_SCHEMAS=false` doesn't relax strict validation
- **Symptom**: With `SPECKIT_STRICT_SCHEMAS=false`, an extra `bogus` parameter is still rejected — strict mode's unknown-parameter rejection is present in both CLI/server-boundary paths and per-tool dispatch regardless of the flag.
- **Root-cause hypothesis**: `tool-schemas.ts` likely applies `.strict()` unconditionally rather than branching to `.passthrough()` (or omitting `.strict()`) when the flag is false.
- **Affected files**: `tool-schemas.ts`.
- **Proposed fix**: Add the `.strict()`/`.passthrough()` branch keyed on `SPECKIT_STRICT_SCHEMAS`, applied consistently at both the CLI/server boundary and per-tool dispatch layers.

### REQ-208 — Tri-daemon spawn drill: respawn-lock/reap-divergence failure
- **Symptom**: Gated run fails at `tests/tri-daemon-drill.vitest.ts:385:44` — `expected [1,1,1] to deeply equal [+0,+0,+0]`; ungated run skips as expected (so the gating itself works).
- **Root-cause hypothesis**: Per the scenario's own triage, this pattern (all three counts at 1 instead of 0) suggests either a duplicate-owner failure (respawn-lock serialization not preventing a second spawn) or reap-divergence (a launcher's SIGTERM behavior changed — spec-memory should transparently recycle, the other two daemons should exit cleanly).
- **Affected files**: Daemon launcher respawn-lock/SIGTERM handling; cross-check related scenarios 423 (lease-probe retry reap hardening) and 426 (daemon ownership re-election) if they've run.
- **Proposed fix**: Needs careful investigation given multi-daemon lifecycle complexity — trace which of the three daemons produced the non-zero count and whether it's a duplicate-spawn or an unreaped-orphan pattern before changing lock/reap logic.

### REQ-211 — Causal boost never applies despite default-on
- **Symptom**: Vitest suites pass, temporary causal edges created/cleaned up correctly, but the live default-on `memory_search` trace shows `causalBoostApplied: "off"`, `causalBoosted: 0` — boost never actually applies.
- **Root-cause hypothesis**: Same shape as Group A (see above) — `isCausalBoostEnabled()` may not be reading `SPECKIT_CAUSAL_BOOST` at actual request time (reads a stale/cached value, or reads it at the wrong stage).
- **Affected files**: `mcp_server/lib/search/causal-boost.ts` (seed selection, weighted CTE, relation multipliers, ceilings), `mcp_server/lib/search/pipeline/stage2-fusion.ts` (must invoke boost after RRF), `isCausalBoostEnabled()`.
- **Proposed fix**: Check whether `isCausalBoostEnabled()` shares a flag-reading pattern with REQ-110/113/200/212 — if so, this may be fixable as one shared-utility fix rather than 5 separate ones.

### REQ-212 — Community-search fallback never surfaces despite default-on
- **Symptom**: Default-on `memory_search` returns weak results but `communityInjected: 0`, `fallbackPolicy.mode: "none"`, `graphContribution.injected: false` — even though direct scoring shows a relevant community exists (1.0 vs 0.0 for the unrelated one). Flag-off repeat attempts also hit retryable IPC errors (`socket closed before response`, `exitCode: 75`).
- **Root-cause hypothesis**: Same shape as Group A — `SPECKIT_COMMUNITY_SEARCH_FALLBACK` may not be read correctly at request time. The IPC errors on flag-off repeats look like a separate, likely environmental (daemon-warmth) issue, not the same bug.
- **Affected files**: `mcp_server/lib/search/community-search.ts` (`searchCommunities` word-overlap scorer), the fallback invocation site's weak-result threshold check, `SPECKIT_COMMUNITY_SEARCH_FALLBACK` read.
- **Proposed fix**: Same as REQ-211 — check for a shared flag-reading root cause across Group A first.

### REQ-214 — Contextual tree injection header never applies despite default/enabled mode
- **Symptom**: Enabled/default mode returns `content: null` / `contentError: "File not found"` instead of the expected `[parent > child — description]` header-injected content; observed snippet begins with `Packet: ...` instead.
- **Root-cause hypothesis**: Sixth Group A member — `isContextHeadersEnabled` in `search-flags.ts` likely shares the same flag-reading defect as the other five.
- **Affected files**: `lib/search/hybrid-search.ts` (`injectContextualTree`), `lib/search/search-flags.ts` (`isContextHeadersEnabled`), description cache population.
- **Proposed fix**: Same as REQ-211/212 — investigate the shared Group A root cause first.

### Group A shared-root-cause investigation (supersedes individual REQ-110/113/200/211/212/214 fixes if confirmed)
With six independent flag-gated features all failing to apply their effect despite passing unit tests, the highest-leverage fix is to find whatever these six flag reads have in common (e.g. a shared config-loading utility that caches env vars at process start instead of reading them per-request, or a request-context object that doesn't thread flag state through to the stage that needs it) and fix it once. Recommended first step for the next fix-dispatch round: grep for how each of the six flags (`SPECKIT_GRAPH_UNIFIED`, `SPECKIT_MEMORY_ADAPTIVE_RANKING`, `ENABLE_BM25`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_COMMUNITY_SEARCH_FALLBACK`, context-headers flag) is actually read in code, and check whether they all go through the same helper (e.g. a `getFlag()`/`isFeatureEnabled()` utility) with one bug, vs six genuinely separate call sites.

<!-- /ANCHOR:plan-body -->
