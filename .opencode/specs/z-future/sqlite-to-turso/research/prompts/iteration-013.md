You are one ADVERSARIAL verification seat executing iteration 13 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

MISSION: earlier iterations produced the CHANGED/REFUTED verdicts below about Turso v0.7.0-pre.6 (vendored at .opencode/specs/z_future/sqlite-to-turso/external/turso-main/). Your job is to ATTEMPT TO REFUTE each one with fresh, independent evidence from the vendored source. Do NOT trust the earlier citations — re-locate the evidence yourself (different files where possible: tests, core implementation, bindings — not just COMPAT.md). Default to skepticism: a claim survives only if you find positive evidence.

THIS ITERATION FOCUS: W5 adversarial: driver/API and pragma family

CLAIMS TO ADVERSARIALLY VERIFY:
- CLAIM-1 (gap 3 refuted): the Turso JS SDK at 0.7.0-pre.6 implements a .pragma() method in BOTH the async and the ./compat sync API. Verify in bindings/javascript source, not docs.
- CLAIM-2 (CONTRADICTION to resolve): iteration 1 said the parameterized form wal_checkpoint(TRUNCATE) is unsupported at engine level; iteration 5 said PRAGMA wal_checkpoint(TRUNCATE) is exercised directly in vendored tests and works for local files. Find the truth: locate the pragma handler in core/ AND any tests; state exactly which checkpoint forms work.
- CLAIM-3 (CONTRADICTION to resolve): iteration 1 said PRAGMA synchronous supports only OFF/FULL (NORMAL unsupported); iteration 9 said synchronous=NORMAL IS accepted and honored. Locate the synchronous pragma parser in core/ and state the accepted values.
- CLAIM-4: ATTACH DATABASE and DETACH DATABASE are fully supported (statement matrix + working translation). Verify in core/ translation and tests.
- CLAIM-5 (gap 9 changed): VACUUM INTO works unconditionally (no experimental flag) while bare in-place VACUUM is experimental-gated. Verify in the vacuum translation code.
- CLAIM-6 (iter-10): the engine supports schema-qualified PRAGMA (e.g. active_vec.journal_mode) against ATTACHed databases. Verify translate_pragma handling of qualified names.
- CLAIM-7 (gap 16 changed): the package exports a better-sqlite3-compatible SYNC compat API (./compat) with transaction(fn) including .deferred/.immediate/.exclusive variants. Verify in bindings/javascript package exports + compat implementation.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents. Web access is unavailable in your sandbox — use only the vendored tree and the repository.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 13: W5 adversarial: driver/API and pragma family
## Focus
(one paragraph)
## Findings
(one bullet per claim verified; EACH starts with NEW|PARTIAL|KNOWN, then a verdict CONFIRMED|OVERTURNED|NUANCED, then your independent evidence with [SOURCE: path:line])
## Ruled Out
## Dead Ends
## Sources Consulted
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)

