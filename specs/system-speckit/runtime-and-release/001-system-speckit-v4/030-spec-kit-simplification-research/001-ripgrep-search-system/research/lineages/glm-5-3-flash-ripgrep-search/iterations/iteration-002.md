# Iteration 2: Lookup correctness — tokenization, candidate gate, scoring, match classes, exit codes, edge inputs

## Focus

`lookup-trigger-index.mjs` end to end: load-time shape assertions, tokenization floors, the `includes()` candidate gate, `scorePhrase` classes, spec-folder scoping, exit-code contract, CLI parsing edge inputs — each claim checked against behavior or code.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F2.1 | `lookup-trigger-index.mjs:139-152`; empirical | Claimed: the SQL gate admitted mid-token substrings, so `includes()` reproduces it exactly. Actual: code confirms — any query token appearing anywhere in a phrase key (e.g. `context` inside `subcontext`) admits the phrase. High recall by design; combined with the 0.000-partial tail (F1.6) this is the documented trade, not a bug. | P2 (documented trade) | Document. |
| F2.2 | `lib/normalize.mjs:60-76, 82-108`; empirical `lookup "ab"` | Claimed: candidate-gate floor 3, cap 8; scoring floor 2. Actual: confirmed — "ab" discards with `below-min-token-length`, exit 1; empty prompt → exit 1; `--limit` without value → exit 2. Matches the documented contract (`references/memory/memory-system.md:31`, `trigger-config.md:97`). | P2 (positive) | Document. |
| F2.3 | `lookup-trigger-index.mjs:97-108` | Claimed: `specFolderMatches` = folder equality or descendant. Actual: prefix logic `folder === specFolder \|\| folder.startsWith(specFolder + '/')` is exact — no `specs/foo-bar` matching `specs/foo` — and null scope scans everything. Correct. | P2 (positive) | Document. |
| F2.4 | `lookup-trigger-index.mjs:63-70`; `lib/artifact.mjs:196-262` | Claimed: fail-closed on malformed artifact. Actual: `loadIndex` runs `assertTriggerIndexShape` — schemaVersion pin (2), normalization block present, postings non-empty arrays with in-range integer path ids. A truncated or hand-edited index is refused with exit 2 rather than silently narrowing results. Matches generator publish gate. | P2 (positive) | Document. |
| F2.5 | `lookup-trigger-index.mjs:206-236` | Claimed: strict CLI parsing. Actual: `--limit` rejects `2junk`/`1.9` via `^\d+$`; bare `--` makes everything after it prompt text; `--json`, `--no-index-hash` are boolean; unknown flags throw → exit 2. `--limit 0` returns ALL results (`limit > 0` guard) — sensible but undocumented in `memory-system.md:31`'s exit-code table row. | P2 | Document `--limit 0` = unlimited in the conventions doc. |
| F2.6 | `lookup-trigger-index.mjs:117-134`; observed "save context memory" run | Claimed: document keeps best phrase score; ties break by match-class rank then path. Actual: confirmed by code; observed output shows all-zero partial tail ordered by path (consistent with F1.6). One subtlety: `scorePhrase` returns `null` for single-token phrases (no containment/overlap path), so every one-token trigger phrase in the index can only ever match via exact equality — a phrase like `ripgrep` can never match a multi-token query even when the query contains that token, because the candidate gate admits the key but scoring yields `partial/0.0` unless the whole query equals the phrase. | P1 (documented classes vs actual achievable classes for 1-token phrases; a real precision/behavior gap between the declared class ladder and what single-token phrases can earn) | Document the single-token-phrase limitation in `retrieval-conventions.md` §8, or allow token-overlap scoring for single-token phrases. |
| F2.7 | `lib/normalize.mjs:118-138` | Claimed: coverage ≥ 0.8 for token-overlap. Actual: `overlap / tokens.length` uses query-token count as denominator with the 0.8 floor — a 4-token query needs 4 of 4 matched tokens (`0.75 < 0.8` means 3/4 = 0.75 *fails* the floor — only exact 4/4 passes at ≥0.8 granularity for n≤4; first n where 4/5=0.8 passes is n=5). The 0.8 threshold therefore behaves as "all tokens" for queries of 1–4 tokens and "≥80%" only from 5 tokens up. | P2 | Document: for ≤4-token queries the floor is effectively 100% token coverage. |
| F2.8 | empirical, `lookup "save context memory"` | Exit 0 with 1091 candidate phrases and only 0.000-partial rows in the top 5 — the strongest trigger phrases in the repo (`save context memory`-family phrases declared by save docs) are not reachable as exact/containment matches for this common operator phrasing, while thousands of gate-admitted noise phrases fill the cap. Utility of the keyed lane for its most canonical query is weak. | P2 (utilization) | Note in ledger: consider surfacing scored-class rows before partials in the human format. |

Ruled out: "exit code 1 on candidates" (exit 0 observed); "shape assertion absent" (present, both ends); "parse failure crash" (caught → exit 2).

## Sources Consulted

- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (full read, this iteration)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs` (scoring section re-read)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/artifact.mjs` (shape assertions)
- Empirical: lookup edge-input runs (read-only)

## Assessment

- newInfoRatio: 0.9 — mostly new scoring/edge findings; gate floor/cap facts overlap iteration 1.
- Novelty justification: F2.6 (single-token phrase scoring gap) and F2.7 (0.8 floor = 100% coverage for ≤4-token queries) are newly derived from code, not recorded anywhere in the packet.

## Reflection

- Worked: reading normalize.mjs against observed lookup behavior exposed two non-obvious scoring interactions.
- Failed: initial plan to diff a pinned golden fixture set was dropped — no golden fixture for lookup answers exists in fixtures/ (only generation fixtures), itself a small utilization gap.
- Ruled out: golden-fixture parity check (no fixture exists).

## Recommended Next Focus

Iteration 3: `/speckit:search` vs its contract — presentation asset compliance, unsupported-feature list, and the conventions doc's declared third lane ("concept lane", `retrieval-conventions.md:33,40,42`) against the documented two-lane reality in `search.md:138` and the charter's unsupported-feature list.
