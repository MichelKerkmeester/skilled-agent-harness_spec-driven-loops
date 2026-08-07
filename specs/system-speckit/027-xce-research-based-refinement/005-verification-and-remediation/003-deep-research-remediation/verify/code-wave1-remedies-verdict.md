# Code Wave 1 — Remedies Re-Verification Verdict (UNCOMMITTED diffs)

Verifier: fresh Fable 5 seat, 2026-06-12. Scope: ONLY the two remedies for the INCOMPLETEs in `code-wave1-verdict.md` (tri-006 survivor fix, tri-182 marker reachability fix) plus the 021 coherence sentence.

## Verdicts

| Finding | Verdict | One-line reason |
| ------- | ------- | --------------- |
| tri-006 | **CLOSED** | The `get_constitutional_memories` survivor now routes through `specFolderLikePattern` + `ESCAPE '\'`; runtime SQL proven to carry exactly ONE backslash (charCode 92); sqlite probe shows the widening is gone; repo re-sweep finds zero other raw `/%` LIKE pushes. |
| tri-182 | **CLOSED** | `nativeTimedOut` is captured from the NATIVE result before the fallback reassigns it, and the marker condition `fail_open && (TIMEOUT || nativeTimedOut)` makes the timeout warning reachable on the default path (native timeout + fallback NON_ZERO_EXIT failure) — the exact gap the original INCOMPLETE named. Suite 9/9 green. |
| Coherence (021 summary) | **TRUE** | With the constitutional survivor fixed, "All scope clauses now route through a shared escaped pattern helper paired with `ESCAPE '\'`" is accurate: all 8 spec-folder scope sites call `specFolderLikePattern`, and no `spec_folder LIKE` without `ESCAPE` survives in mcp_server source. |

Tests: `tests/hooks/codex-user-prompt-submit-hook.vitest.ts` 9/9 (advisor mcp_server); `tests/hybrid-search.vitest.ts` 98/98 (spec-kit mcp_server, compiles/exercises the modified vector-index lane).

---

## Evidence

### tri-006 — get_constitutional_memories survivor (CLOSED)

Diff (uncommitted, `lib/search/vector-index-store.ts`):
- `:42` imports `specFolderLikePattern` from `./vector-index-types.js` (export confirmed at `vector-index-types.ts:34`).
- `:1885` clause is now `${spec_folder ? "AND (m.spec_folder = ? OR m.spec_folder LIKE ? ESCAPE '\\')" : ''}` — a double-quoted string inside the template literal.
- `:1889` params are now `[spec_folder, specFolderLikePattern(spec_folder)]` (was raw `` `${spec_folder}/%` ``).

CRITICAL CHECK — single-backslash proof (node probe, exact nesting reconstructed: double-quoted `"… ESCAPE '\\'"` interpolated into the template literal; helpers copied verbatim from `vector-index-types.ts`):
- Rendered SQL `ESCAPE '…'` payload = `"\\"` (JSON-escaped), **length 1, charCodes `[92]`** — exactly ONE backslash at runtime. The `\\` in TS source is the double-quoted-string escape for one literal backslash; template-literal interpolation inserts the string value verbatim with no re-escaping.

In-memory sqlite widening probe (better-sqlite3; constitutional-shaped tables `memory_index` + `active_memory_projection`, rows `abc/x`, `a_c/y`, `a_c`, all tier=constitutional/status=success; exact rendered SQL from source):
- NEW clause, scope `a_c`, param `a\_c/%`: returns `['a_c','a_c/y']` — exact match + true child only.
- OLD clause (pre-fix shape `LIKE ?` + raw `a_c/%`): returns `['a_c','a_c/y','abc/x']` — widened (the original defect, reproduced).
- Positive control, scope `abc`: returns `['abc/x']`.

Repo-wide re-sweep (lib/handlers/shared/scripts of spec-kit mcp_server; dist + tests excluded):
- `${…}/%` template pushes: ONLY `vector-index-types.ts:35` — inside `specFolderLikePattern` itself (escaped by construction). Zero raw call-site pushes.
- `'/%'` and `"/%"` concatenations: zero.
- `spec_folder LIKE` without `ESCAPE`: zero.
- All 8 spec-folder scope call sites route through the helper: `hybrid-search.ts:698,2149`; `vector-index-queries.ts:91,282,571,863`; `vector-index-store.ts:1889`; `sqlite-fts.ts:187`.
- Remaining parameterized LIKEs are different classes: fixed literals (`memory-index-alias.ts:207-235`, `db-helpers.ts:31`, `embedding-reconcile.ts:279/446`), `%token%` concept matches (`hybrid-search.ts:692/708`, `causal-boost.ts:684`, `recovery-payload.ts:256`, `retrieval-rescue.ts:297`), and `corrections.ts:628` whose param is `Correction#<integer-id>:%` (id-derived, no metacharacters possible) — none are folder-derived scope clauses.

Deploy note: `dist/lib/search/vector-index-store.js:1541` already carries the fixed clause — dist was rebuilt; runtime form is consistent with source.

Residual (pre-noted, unchanged): duplicate `escapeLikePattern` helpers still exist (`handlers/handler-utils.ts` variant does not escape backslash); consolidation candidate, not part of this remedy.

### tri-182 — codex hook timeout marker (CLOSED)

Diff (uncommitted, `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts`):
- `:341` `const nativeTimedOut = result.status === 'fail_open' && result.diagnostics?.errorCode === 'TIMEOUT';` — evaluated BEFORE the `if (buildCliBrief && cliFallbackAttempted)` block reassigns `result` (code-order verified), so it reads the NATIVE result.
- `:369` marker condition is now `result.status === 'fail_open' && (result.diagnostics?.errorCode === 'TIMEOUT' || nativeTimedOut)`.
- The previously-false comment is replaced by an accurate one (fallback failures surface as NON_ZERO_EXIT; the captured native-timeout fact keeps the branch reachable).

Four-combination matrix, verified against `hooks/lib/skill-advisor-cli-fallback.ts`:
- **(a) native TIMEOUT, no fallback available** (`buildCliBrief === null`, DI/tests only — in production `shouldTrySkillAdvisorCliFallback` (:160-168) returns true for any brief-less `fail_open`): `result` keeps native `fail_open`/`TIMEOUT` → marker fires via BOTH disjuncts. Correct.
- **(b) native TIMEOUT, fallback succeeds**: `resultFromCliData` (:430-) yields `ok` (live/stale + ≥1 passing rec) or `skipped` (no recs / freshness absent) — final status not `fail_open` → marker does NOT fire. Correct. **Assumption check:** a mechanically-successful fallback (CLI exit 0, JSON parsed) CAN still return `fail_open` — `resultStatus` (:381-389) maps `freshness === 'unavailable'` to `fail_open` with `errorCode: 'NON_ZERO_EXIT'` (:459). In that sub-case the marker fires via `nativeTimedOut`. Judged **correct, not misleading**: the end-to-end outcome is genuinely fail_open with no brief delivered, and a native timeout genuinely occurred — warning the operator is the right signal. Minor precision wart: the emitted diagnostic says `errorDetails: 'cold-start timeout'`, which shadows the fallback's own distinct unavailability reason; acceptable, non-blocking.
- **(c) native TIMEOUT, fallback fails**: `failOpenResult` (:391-428) is the single construction site for ALL failure paths (paths-missing, probe-fail, the fallback's own timeout, spawn-error, non-zero-exit, bad-JSON) and hard-codes `status: 'fail_open'` + `diagnostics.errorCode: 'NON_ZERO_EXIT'` (`timedOut` goes only into the envelope, not diagnostics). First disjunct false; `nativeTimedOut` true → **marker FIRES**. This is the previously-unreachable default path — the original INCOMPLETE's exact complaint, now fixed.
- **(d) native non-timeout failure** (e.g. PARSE_FAIL/NON_ZERO_EXIT native, or degraded+unavailable): `nativeTimedOut` false; no production code path (`failOpenResult`, `resultFromCliData`) ever writes `errorCode: 'TIMEOUT'`, so the first disjunct cannot become true post-fallback → marker does NOT fire. No false positives.

Test run: `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/hooks/codex-user-prompt-submit-hook.vitest.ts` → **9/9 passed**.

Runtime-form note: the codex hook has no dist mirror — it runs from the `.ts` source that carries the fix.

Residual (follow-on 3 from the prior verdict, NOT part of this remedy's scope): still no test pins the marker (zero `timeoutFallbackOutput`/`emitTimeoutFallbackWarning` references in the test file; it is unchanged in this diff). The combination-(c) reachability is proven here by code-path analysis, not by an automated regression test — recommend adding one.

### Coherence — 021-hybrid-search implementation-summary (TRUE)

`021-hybrid-search-scope-then-limit/implementation-summary.md:118`: "All scope clauses now route through a shared escaped pattern helper paired with `ESCAPE '\'`" — now TRUE as written: the constitutional survivor was the only remaining raw spec-folder `/%` LIKE, the re-sweep above finds zero others, and all 8 scope sites call `specFolderLikePattern`.
