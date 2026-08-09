# Iteration 10: Maintainability, Drift, Comments, Structure

## Focus

Assess vendored-fork drift risk, the ownership-boundary maintainability, comment hygiene on the non-DeepSeek sections, monolith structure, and which levers would keep the findings of iterations 1-9 from regressing.

## Findings

**F10-1. Comment hygiene is clean: zero ephemeral artifact labels in code comments.**
A targeted grep across `index.ts` for the repo's forbidden ephemeral labels (dates like `2026-08-08`, packet numbers `039`/`004-`, `phase`/`packet`/`ADR`/`specs/` references) returns ZERO matches. Comments carry durable WHY rationale (e.g. the wire-order comment at :1518-1540, the gate-order rationale at :8068-8080, the responses-bypass safety analysis at :7941-7966). The fork's code comments satisfy the comment-hygiene standard; the artifact-labeled narration lives correctly in `CHANGES-FROM-UPSTREAM.md` (a changelog, where it belongs). No cleanup needed. [SOURCE: index.ts grep; CHANGES-FROM-UPSTREAM.md]

**F10-2. The ownership boundary is a hardcoded exact-match allowlist duplicated across two forks, kept in sync only by a shared fixture — new-model additions are a silent drift hazard.**
`isDeepPiOwned` (index.ts:1462-1465, provider `deepseek` + id in {flash, pro}) and deep-pi's `isDeepPiModel` (eligibility.ts:11-12, same two ids) duplicate the same allowlist. The shared fixture `.pi/extensions/shared/deepseek-ownership.json` pins both predicates and the composition test catches any drift between them (tests/ownership-composition.test.ts:85-116). The fixture's `excluded` list explicitly names `opencode/deepseek-v4-flash-free` and `opencode-go/deepseek-v4-flash` as NOT owned — corroborating F1-1 that those two remain pi-cache-optimizer surface. But the fixture can only pin KNOWN models: adding a new deepseek model id (e.g. `deepseek-v4-pro-max`) requires editing BOTH forks AND the fixture, and a miss on either side silently produces overlap (both extensions react) or a gap (neither owns), with no automated detection for the new id. The guard's exact-match design is deliberate (CHANGES-FROM-UPSTREAM.md:24) but is the single highest-drift maintainability point in the fork. [SOURCE: index.ts:1462-1465; .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:11-12; .pi/extensions/shared/deepseek-ownership.json; tests/ownership-composition.test.ts]

**F10-3. Vendored-fork drift tracking is manual-only.**
The vendored copy is pinned to upstream v2.8.0 / fork commit `5132d137` (CHANGES-FROM-UPSTREAM.md:9-15), with the only drift check being a historical `diff -rq` against the pinned commit (:45). There is no automated upstream-sync or drift-check mechanism; upstream advances independently and future upstream fixes/features would never be merged. For a 9,239-line vendored monolith this is a real maintenance liability — the vendor boundary is a point-in-time snapshot with no re-sync story. [SOURCE: CHANGES-FROM-UPSTREAM.md:9-15,45]

**F10-4. `tsc --noEmit` is clean and the structure is sectioned but monolithic; the test seam is `__internals_for_tests`.**
`tsc --noEmit` exits 0. The file uses numbered section markers (e.g. "6. CACHE PROVIDER ADAPTERS" :2979-2981, "7. CACHE STATS AND PERSISTENCE" :4002-4004, "8. DIAGNOSTICS AND JSONC EDITING" :4759-4761) giving coarse navigation over 9,239 lines. Tests couple through the `__internals_for_tests` export (:7043) — a broad but legitimate seam. The maintainability verdict is a consequence of iterations 1-9: none of the defects found (F2-2 prompt_cache_key no-self-heal, F3-1 silent stat loss, F4-1 TTL-repair unreachable, F9-4 denominator loss) has a regression test (F6-1), so the monolith's low-level churn risk is unpinned. [SOURCE: index.ts:2979, 4002, 4759, 7043; tsc run]

## Ruled Out

- A comment-hygiene violation in index.ts: grep returns zero ephemeral labels (F10-1).
- Whether upstream has since advanced: unverifiable offline; F10-3 is framed as risk, not observed divergence.

## Assessment

- **newInfoRatio**: 0.60 — F10-2 (new-model ownership drift hazard) and F10-3 (manual-only vendor drift) are the concrete maintainability findings; F10-1 is a clean bill; F10-4 frames the test-seam relationship.
- **Confidence**: High for F10-1/F10-2/F10-4 (direct reads + grep + tsc), Medium for F10-3 (upstream state unobserved).

## Reflection

- What worked: grepping for ephemeral labels gave a definitive hygiene verdict cheaply; reading the shared fixture closed the loop on F1-1.
- What failed: offline session cannot confirm whether upstream v2.8.0 has since moved.
- Ruled out: comment-hygiene violation; observed upstream drift.

## Recommended Next Focus

Synthesis. All 10 iterations complete; the findings now cover correctness (F3-1, F4-1, F8-1), economics (F2-2, F2-4, F9-1/3/4), provider coverage (F1-1, F1-2, F8-5), maintainability (F5-2/3, F10-2/3), and test coverage (F6-1/2). Compile `research.md`, reconcile with the phase parent, and produce the convergence report.
