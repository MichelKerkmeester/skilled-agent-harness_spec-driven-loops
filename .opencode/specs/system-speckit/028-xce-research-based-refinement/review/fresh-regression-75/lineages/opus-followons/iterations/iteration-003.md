# Seat opus-followons — iteration 3 (global #38)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-followons
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I've now personally verified every hypothesis. Here is my review.

## Review — seat `opus-followons`

**Scope traced:** the FTS5 query builder (`lexical-normalizer.ts`, `sqlite-fts.ts`), every SQL `LIKE` scope/recall predicate in `mcp_server/lib/search/**`, the IPC accept/refuse path (`shared/ipc/socket-server.ts`, `launcher-session-proxy.cjs`), and the probe budget (`launcher-ipc-bridge.cjs`, plugin bridge `mk-spec-memory-bridge.mjs`).

### Follow-on #1 — FTS5 LIKE-metachar hardening (regression-check)
The documented fix (route every `specFolder` scope clause through `specFolderLikePattern()` + `ESCAPE '\'`) is **complete and correct** at all scope sites I read: `sqlite-fts.ts:181`, `vector-index-queries.ts:90/282/541/862`, `vector-index-store.ts:1941`, `hybrid-search.ts:715/2176`. Escape char (`\`) and SQL `ESCAPE '\'` are consistent. Confirmed.

I chased five additional `LIKE '%token%'` sites a first sweep flagged as unescaped, and **personally refuted four as false positives** — their inputs are normalized to `[a-z0-9]` upstream before reaching the LIKE, so `%`/`_` can never arrive:
- `hybrid-search.ts:710/712/726` — tokens from `normalizeTriggerText` → `replace(/[^a-z0-9]+/g,' ')` (hybrid-search.ts:653). Safe.
- `retrieval-rescue.ts:299` — tokens from `normalizeText` → same `[^a-z0-9]` strip (retrieval-rescue.ts). Safe.
- `causal-boost.ts:685` and `recovery-payload.ts` — concepts come from a fixed alias vocabulary via `nounPhrases` → `replace(/[^\p{L}\p{N}\s-]/gu,' ')`. Safe.

**One genuine gap survived:** `graph-search-fn.ts:263` (the FTS5-unavailable fallback) escapes raw user `query` with `query.replace(/[%_]/g, '\\$&')` — `%` and `_` only, **not backslash** — yet pairs it with `ESCAPE '\'` (lines 273/278). This diverges from the canonical `escapeLikePattern()` (which escapes `\` first). A query containing a literal `\` is left as a dangling escape introducer in the pattern, so SQLite either raises a runtime error or mis-matches. Narrow trigger (fallback path + backslash in query), but a real correctness inconsistency the sweep's "shared helper everywhere" intent missed. **P2.**

### Follow-on #2 — IPC "busy" reply on refused connections
`socket-server.ts:303-308` refuses at-capacity (`activeSockets.size >= maxClients`, default 64) with `socket.end(); socket.destroy()` and **no reply**. A liveness probe (`launcher-ipc-bridge.cjs` `probeDaemon`, deepProbe) then reads `closed-before-reply` → `dead`, and after the bounded retries `maybeBridgeLeaseHolder` returns `respawn` — i.e. a healthy-but-saturated daemon can be falsely reaped under fan-out. This is exactly the **documented, filed, deferred** follow-on (spec 004-007 `spec.md:80`, `implementation-summary.md:95`, `tasks.md:77`). Per review rules, a documented deferred design state is not a fresh defect; I am **not** raising it as a finding, only confirming the latent path is real and the deferral is accurate.

### Follow-on #3 — configurable bridge probe budget
The **launcher** probe budget is fully configurable and bounded: `SPECKIT_PROBE_TIMEOUT_MS` (default 5000, clamped ≤6999), `SPECKIT_LEASE_PROBE_RETRIES`, `…_RETRY_TIMEOUT_MS` (1500), `…_RETRY_BACKOFF_MS` (250); worst case 6750ms < 7000ms grace. The **plugin** warm-probe (`mk-spec-memory-bridge.mjs:12` `DEFAULT_PROBE_TIMEOUT_MS = 100`) is still hardcoded (overridable only via an `input.probeTimeoutMs` the plugin never passes, no env var). This too is the **documented deferred** follow-on (spec 004-007 `implementation-summary.md:96`), and its failure mode is graceful (returns retryable `exitCode 75`). Not a fresh defect — confirmed deferred, not regressed.

**Net:** the epic's claimed remediations hold up; the only thing prior passes missed is the backslash gap in the legacy fallback escaper. One P2.

```json
{"seat":"opus-followons","model":"claude-opus-4-8","angle":"Carried follow-on: FTS5 LIKE-metachar scope hardening + IPC \"busy\" reply on refused connections + configurable bridge probe budget.","verdict":"PASS","summary":"Scope-hardening sweep is complete/correct; 4 flagged LIKE sites refuted (inputs normalized to [a-z0-9]). One real gap: fallback escaper omits backslash. Busy-reply & plugin 100ms probe are documented-deferred, not defects.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/search/lexical-normalizer.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-types.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts",".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts",".opencode/bin/lib/launcher-ipc-bridge.cjs",".opencode/bin/lib/launcher-session-proxy.cjs",".opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs"],"findings":[{"severity":"P2","dimension":"correctness","title":"FTS5-fallback LIKE escaper omits backslash, diverging from canonical helper","file":".opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:263","evidence":"queryCausalEdgesLikeFallback escapes raw user query with `query.replace(/[%_]/g, '\\\\$&')` (only % and _) then binds `%${escaped}%` into `content_text LIKE ? ESCAPE '\\\\' OR title LIKE ? ESCAPE '\\\\'` (lines 273,278). The canonical escapeLikePattern() in vector-index-types.ts:29 escapes backslash FIRST (\\\\->\\\\\\\\) before % and _; this site does not.","why":"With ESCAPE '\\\\' active, a literal backslash in the query becomes a dangling escape introducer. If followed by a non-wildcard char, SQLite raises a runtime LIKE error (the .all() at line 282 is not wrapped in try/catch in the read excerpt, so it propagates); if at a wildcard boundary it silently alters matching. The epic's stated remediation was that all LIKE patterns route through one shared escaped helper — this hand-rolled escaper was missed.","recommendation":"Replace `query.replace(/[%_]/g, '\\\\$&')` with the shared escapeLikePattern(query) from vector-index-types.ts so backslash is neutralized consistently with every other LIKE site; keep the existing ESCAPE '\\\\' clause."}]}
```
