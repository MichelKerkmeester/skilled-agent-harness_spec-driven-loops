# Code Wave 1 — Adversarial Re-Verification Verdict (UNCOMMITTED diffs)

Verifier: fresh Fable 5 seat, 2026-06-12. Scope: tri-006, tri-124, tri-125, tri-179, tri-182 per `/tmp/fable-verify-codewave1.md`. Original proofs consulted: `l9-still-real-partA.md`, `l9-still-real-partC.md`, `l9-still-real-partD.md`.

## Verdicts

| Finding | Verdict | One-line reason |
| ------- | ------- | --------------- |
| tri-006 | **INCOMPLETE** | All originally-cited sites fixed and probe-proven, but one same-class raw `${spec_folder}/%` scope clause survives in `lib/search/vector-index-store.ts:1884/1888` (`get_constitutional_memories`) — the "ALL scope clauses" claim is false. |
| tri-124 | **CLOSED** | Drift guard derives live tokens from source; 18-flag ceiling list + frozen literal 54-token snapshot exactly cover the 72 live `SPECKIT_*` tokens; a new token provably fails the guard. |
| tri-125 | **CLOSED** | New header (38 rules / 66 fixtures / last 067, registry-authoritative wording) matches the live registry (38 unique `rule_id`s) and fixture dir (66 numbered, last `067-checklist-uppercase-x`). |
| tri-179 | **CLOSED** | `--min-total-cases` (default 50) wired into `gates` → `overall_pass` → exit code; `metrics["total_cases"]` exists; fixture is exactly 50 lines, all 50 parse. |
| tri-182 | **INCOMPLETE** | Attempt gate dropped as sketched, but in production the change is a behavioral no-op: the fallback always rewrites `result` and every real fallback failure (including its own timeout) carries `errorCode: 'NON_ZERO_EXIT'`, never `'TIMEOUT'` — the marker is still unreachable on the default path, which was the finding's exact complaint. |
| Coherence (021 summary) | **OVERCLAIMS** | `implementation-summary.md` limitation #3 now says "All scope clauses now route through a shared escaped pattern helper" — falsified by the tri-006 survivor above; the FTS5/vector/hybrid/keyword lane claims themselves match the diff. |

Tests (both green): `tests/hooks/codex-user-prompt-submit-hook.vitest.ts` 9/9; spec-kit batch `bm25-index` + `bm25-security` + `hybrid-search` + `flag-ceiling` = 4 files, 256/256.

---

## Evidence

### tri-006 — spec-folder LIKE scoping (INCOMPLETE)

Fixed and verified:
- `lib/search/vector-index-types.ts`: new `escapeLikePattern` (backslash-first, then `%`, then `_`) + `specFolderLikePattern` (`<escaped>/%`).
- `lib/search/vector-index-queries.ts`: `appendSpecFolderScope` (:90-91) + 3 inline sites (`get_memories_by_folder` :280/:282, `multi_concept_search` :541/:571, `keyword_search` :862-863) all now `LIKE ? ESCAPE '\'` with the escaped pattern.
- `lib/search/sqlite-fts.ts:180-188`: SQL changed from `LIKE ? || '/%'` to `LIKE ? ESCAPE '\'`; param shape consistently changed to the full escaped pattern (`specFolderLikePattern(specFolder)` replaces the second raw `specFolder`; SQL no longer appends `'/%'`). Consistent — hunt (c) satisfied.
- `lib/search/hybrid-search.ts` ×2 (`exactTriggerSearch` :697-698, `structuralSearch` :2148-2149).

In-memory sqlite probe (better-sqlite3, helpers + clause literals copied verbatim from source): rows `abc/x`, `a_c/y`; scope `a_c`:
- OLD clause (`LIKE ?` + raw `a_c/%`): returns `["abc/x","a_c/y"]` — widened (also reproduced with the old FTS shape `LIKE ? || '/%'`).
- NEW clause (both the template-literal form from vector-index-queries.ts and the double-quoted form from sqlite-fts.ts): returns `["a_c/y"]` only.
- ESCAPE literal renders as exactly ONE character, charCode 92 (single backslash), in BOTH string forms — hunt (b) satisfied; the `\\` in TS source is correct for template literals and double-quoted strings alike.
- Positive control: scope `abc` still returns `abc/x`.
- Escaped pattern for `a_c` = `a\_c/%`.

Survivor (hunt (a) hit): `lib/search/vector-index-store.ts:1884` `AND (m.spec_folder = ? OR m.spec_folder LIKE ?)` with `:1888` `params = [spec_folder, `${spec_folder}/%`]` — `get_constitutional_memories()`. Live code: called from `vector-index-queries.ts:406` (every scoped vector search's constitutional block) and `:479` (`get_constitutional_memories_public` → `vector-store.ts:372-373`). Same widening class: a scope of `a_c` pulls `abc/*` constitutional rows. Repo-wide sweeps (`spec_folder LIKE`, `${...folder...}/%`, `'/%'` concatenations across mcp_server lib/handlers/scripts/shared, dist and tests excluded) found no other survivor.

Residual wart: two parallel `escapeLikePattern` helpers now exist (`handlers/handler-utils.ts:25`, which does NOT escape backslash, and the new `lib/search/vector-index-types.ts:29`, which does). Not a defect in this fix; consolidation candidate.

### tri-124 — flag-ceiling drift guard (CLOSED)

- `tests/flag-ceiling.vitest.ts` drift guard reads `lib/search/search-flags.ts` source via `readFileSync(new URL(...))`, extracts `SPECKIT_[A-Z0-9_]+` tokens, and asserts each is in `ALL_SPECKIT_FLAGS` (18 unique) ∪ `ACKNOWLEDGED_UNCEILINGED_FLAGS` (54 unique, hand-typed literal array — confirmed FROZEN, not derived).
- Live source declares exactly 72 unique tokens; 18 + 54 = 72; cross-check: 0 uncovered, 0 overlap between the two lists.
- Failure mode proven by construction: a new `SPECKIT_X` token in search-flags.ts (code or comment) lands in `liveTokens`, is in neither literal list, so `unknown = ['SPECKIT_X']` and `expect(unknown).toEqual([])` fails. The snapshot cannot silently absorb it.
- Suite passes today (part of the 256-green run).
- Residuals (acceptable, noted): guard is one-directional — a flag REMOVED from search-flags.ts leaves a stale acknowledged entry without failing; regex also counts tokens appearing only in comments (over-trigger, safe direction); a dynamically-constructed env name (`process.env[variableName]`, search-flags.ts:28) would evade the regex, but all 72 flags are literal in the file today.

### tri-125 — extended-validation header counts (CLOSED)

- New header: "validation rule registry (38 rules at last recount) and the numbered fixture corpus (66 fixtures, last 067)… the registry is the authoritative inventory."
- Live registry `scripts/lib/validator-registry.json`: 38 entries, 38 unique `rule_id`s.
- Live fixtures `scripts/tests/test-fixtures/`: 66 dirs matching `^[0-9]{3}-`, last = `067-checklist-uppercase-x`.
- The "at last recount"/registry-authoritative wording reduces future drift risk vs the old hard counts.
- Out-of-scope residual from the original finding: `test-fixtures/README.md` §3 topology still untouched (no mention of fixtures past 051).

### tri-179 — regression corpus-size gate (CLOSED)

- `skill_advisor_regression.py`: `--min-total-cases` (type int, default 50) added (:250-255); gate `"total_cases": metrics["total_cases"] >= args.min_total_cases` added to `gates` (:297); `overall_pass = all(gates.values())` (:299); `return 0 if overall_pass else 1` (:325). A shrunken fixture now exits 1.
- `metrics["total_cases"]` exists (:210, `total = len(results)` at :183); `load_jsonl` skips blank/malformed lines, so truncation or corruption both shrink `total` and trip the gate (fail-loud).
- Fixture `scripts/fixtures/skill_advisor_regression_cases.jsonl`: exactly 50 lines, all 50 parse as JSON cases (verified by direct parse). Gate passes today at the boundary (50 >= 50).
- `python3 -m py_compile` clean.
- Nit: the report's `thresholds` block omits `min_total_cases` (gates dict carries the outcome; threshold value itself is not echoed).

### tri-182 — codex hook timeout marker (INCOMPLETE)

What shipped: `hooks/codex/user-prompt-submit.ts:365` condition changed from `!cliFallbackAttempted && fail_open && TIMEOUT` to `fail_open && TIMEOUT` — the letter of the fix sketch. Suite 9/9 green.

Four-combination matrix (the brief's hunt), against `hooks/lib/skill-advisor-cli-fallback.ts`:
1. **native-TIMEOUT × fallback not run** → result keeps native `fail_open`/`TIMEOUT` → marker fires. Correct — but in production `buildCliBrief` is always `buildSkillAdvisorBriefFromCli` (non-null) and `shouldTrySkillAdvisorCliFallback` returns true for any briefless `fail_open` (:160-168), so this combination only occurs under dependency injection (tests), not in production.
2. **native-TIMEOUT × fallback ran × fallback success** → `resultFromCliData` (:430-) returns `ok`/`skipped`/`degraded`-class shapes (or `fail_open` + `NON_ZERO_EXIT` when freshness unavailable); never `TIMEOUT` → marker skipped. Correct.
3. **native-TIMEOUT × fallback ran × fallback failure (incl. the fallback's own timeout)** → `result` is wholesale-replaced (`result = await buildCliBrief(...)`, :339) by `failOpenResult` which hard-codes `diagnostics.errorCode: 'NON_ZERO_EXIT'` at its single construction site (:408) for ALL six failure paths — paths-missing, probe-fail, **cli.timedOut (reason 'timeout', timedOut: true)**, spawn-error, non-zero-exit, bad-JSON. `withCliFallbackEnvelope` (:131-136) only spreads top-level envelope keys; diagnostics untouched. So the final result is `fail_open` + `NON_ZERO_EXIT` → **marker does NOT fire**. This is the exact default-path bypass tri-182 complained about, still present.
4. **no native TIMEOUT** → condition false; and since the real fallback can never fabricate `errorCode: 'TIMEOUT'`, the gate-drop introduces no false markers. Correct.

Net: old condition fired iff `attempted === false` ∧ final TIMEOUT; new fires iff final TIMEOUT; whenever `attempted === true` the fallback rewrites `result` to something that is never TIMEOUT-coded — so old and new conditions are **production-equivalent** and the operator-visible timeout warning (`emitTimeoutFallbackWarning` + `timeoutFallbackOutput()`) remains unreachable on the default path. The new code comment ("when the CLI fallback ran and also timed out, `result` still reads fail_open/TIMEOUT") is factually false. No test pins the marker (zero `timeoutFallbackOutput`/`emitTimeoutFallbackWarning` references in any test; the hook vitest only exercises PARSE_FAIL and happy paths).

### Coherence — 021-hybrid-search implementation-summary (OVERCLAIMS)

Limitation #3 rewritten to "since addressed (2026-06-12)… **All scope clauses** now route through a shared escaped pattern helper paired with `ESCAPE '\'`". The named lanes (FTS5, vector queries, hybrid/keyword) match the diff, but the universal claim is falsified by the `get_constitutional_memories` survivor (`vector-index-store.ts:1884/1888`). After that site is fixed the sentence becomes true as written; alternatively narrow it to the named lanes.

---

## Follow-ons

1. **(tri-006, blocking its CLOSED)** Route `get_constitutional_memories` (`lib/search/vector-index-store.ts:1884/1888`) through `specFolderLikePattern` + `ESCAPE '\'`; then the 021 summary's "All scope clauses" claim becomes accurate. Cache note: results are memoized per `build_constitutional_cache_key(spec_folder, …)`, so the widened rows also persist in cache until TTL.
2. **(tri-182, blocking its CLOSED)** Make the marker reachable on the default path: either have `failOpenResult` emit `errorCode: 'TIMEOUT'` when `args.timedOut === true` (and arguably when the native result was TIMEOUT and the fallback failed for any reason), or widen the hook condition to also check the fallback envelope (`result.timedOut === true || reason === 'timeout'`). Fix the now-false comment at `user-prompt-submit.ts:360-364` in the same change.
3. **(tri-182)** Add a test that pins the marker: native TIMEOUT + real-shaped fallback failure (NON_ZERO_EXIT / timedOut) must produce `timeoutFallbackOutput()`. Today a mock fallback returning `errorCode: 'TIMEOUT'` would pass the new condition while the real builder never produces that shape — a test-reality divergence trap.
4. **(hygiene)** Consolidate the duplicate `escapeLikePattern` helpers (`handlers/handler-utils.ts:25` — no backslash escaping — vs `lib/search/vector-index-types.ts:29`); the handler-utils variant paired with un-ESCAPE'd LIKEs is the tri-049 class.
5. **(tri-125 residual, pre-existing)** `scripts/tests/test-fixtures/README.md` §3 topology still ends at 051; refresh or mark the registry/dir as authoritative there too.
6. **(tri-179 nit)** Echo `min_total_cases` in the report's `thresholds` block for self-describing reports.
7. **(tri-124 residual, acceptable)** Drift guard is one-directional; an optional reverse assertion (every acknowledged token still exists in source) would catch stale snapshot entries.
