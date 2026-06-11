# Deep Review Report — 027/021 hybrid-search scope-then-limit

**Target:** the `bm25Search` fix (over-fetch → filter → slice) in `hybrid-search.ts`.
**Method (proportional rigor):** the surface is a single ~15-line function plus 3 fail-on-old-code tests, so this used 3 narrow-lens seats (cli-opencode gpt-5.5-fast, xhigh) + direct remediation + full-suite re-verification, rather than a 5-seat fanout. The seats found a real flaw the original fix *introduced*, which is exactly what the review existed to catch.

## Seat coverage (3 iterations)

| Seat | Lens | Outcome |
|------|------|---------|
| 1 | Correctness / over-fetch bounds | **P0** the corpus-sized over-fetch overflows the metadata `IN (...)` lookup (+ ruled_out: filter-before-slice ✓, fail-closed ✓, parity ✓, edges ✓) |
| 2 | Security / FTS / SQL | **P1** unbounded `IN (...)` placeholder count; **P0** pre-existing FTS `LIKE` wildcard widening (+ ruled_out: fail-closed ✓, prefix-boundary ✓, FTS filters-before-LIMIT ✓) |
| 3 | Test rigor / perf / scope | **P1** no combined scope+deprecated test; **P2** broad-query candidate cost (+ ruled_out: scope ✓, doc accuracy ✓, hygiene ✓) |

## Findings + disposition

- **Over-fetch overflows the metadata `IN (...)` lookup (seats 1 P0 / 2 P1): CONFIRMED — introduced by the original fix.** Fetching `documentCount` candidates binds one SQL parameter per candidate; on a corpus larger than SQLite's bind-parameter limit the query throws and the catch returns `[]`, so scoped searches under-return *worse* than the original bug. **Remediated:** the metadata lookup now resolves ids in batches of 500, so the parameter count is bounded regardless of candidate-set size.
- **Fail-closed after wasted over-fetch (seat 2 P2): remediated** — the `specFolder && !db` fail-closed check now runs *before* the search, so a scoped query without DB metadata returns `[]` without an over-fetch.
- **Missing combined scope+deprecated test (seat 3 P1): remediated** — added a regression test where the top-ranked hits are out-of-scope, deprecated, or both, asserting only the in-scope non-deprecated survivors fill the limit.
- **FTS `LIKE` wildcard widening (seat 2 P0): pre-existing, OUT OF SCOPE.** The FTS lane (`sqlite-fts.ts`) was untouched by this phase. Real-world exposure is nil (spec-folder ids are `[0-9a-z-]+`, no `%`/`_`); logged as a separate hardening follow-up in Known Limitations.
- **Broad-query candidate cost (seat 3 P2): accepted/documented.** Bounded by corpus size, only on the in-memory fallback lane; the docs disclose it.
- **Negative-limit inconsistency (seat 1 P2): accepted** — callers clamp to positive; pre-existing.

## Verification after remediation

- `tsc --noEmit`: 0. `tests/hybrid-search.vitest.ts`: **98/98** (was 97; +combined-filter test). `validate.sh --strict` (021): 0/0. Comment hygiene: clean. No production scope drift (only `hybrid-search.ts` + its test).

**Disposition:** 021 review complete; the original fix's `IN (...)` overflow regression caught and remediated (chunked lookup); fail-closed reordered; combined-filter test added; FTS `LIKE` hardening logged as a pre-existing follow-up.
