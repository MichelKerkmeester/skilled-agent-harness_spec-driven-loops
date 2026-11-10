# Iteration 9: Severity roll-up + stress-testing the two most challengeable P2 claims

## Focus

Re-verify every P1 row's evidence, dedupe merged rows into the final ledger shape, and empirically stress the two P2s most likely wrong: F2.7 (0.8 floor degenerates to ~100% coverage for ≤4-token queries) and F5.3 (latency target vs measurement). Also re-probe F2.8's "keyed lane weak for canonical query" with a distinctive query.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F9.1 | empirical re-probe of F2.7 (`scorePhrase` via direct ESM import) | Claimed (F2.7): for ≤4-token queries the 0.8 floor is effectively full coverage. Actual: **confirmed** — 3/4 shared tokens (coverage 0.75) → `null` (rejected); 4/5 shared (0.8) → `token-overlap`, score 0.600. So a 4-token query needs 4/4 matches; partial-token-overlap scoring only becomes achievable at 5+ query tokens. Code-backed and now probe-backed. | P2 (stands) | (Unchanged: document the effective floor.) |
| F9.2 | empirical re-probe of F5.3 | Claimed (F5.3): `<50ms` doc target conflicts with measured 61–91 ms and the fixture's own 200 ms budget. Actual: stands — today's cold probes re-read 67–85 ms wall; nothing changed. | P2 (stands) | (Unchanged.) |
| F9.3 | empirical re-probe of F2.8 with a distinctive query ("trigger index generator") | Claimed (F2.8): keyed lane weak for its most canonical query. Actual: **refined** — for a distinctive query the lane works exactly as designed: three `exact` hits at score 1.000 (the retrieval README + the phase spec + implementation summary) surface ahead of the 0.000-partial tail. The weakness is specific to fuzzy multi-word operator phrasing that matches no author phrase ("save context memory") — which is the declared trade of an author-controlled field (conventions §8), not a defect. F2.8 narrows to: the partial tail is noise in human output (F1.6 already covers the render fix); the lane itself is sound for distinctive queries. | P2 (narrowed) | Drop F2.8's "lane utility weak" framing from the ledger; keep the F1.6 render recommendation only. |
| F9.4 | P1 ledger dedup + re-verification | Full P1 census re-checked at current evidence: **F1.1** (three inconsistent committed snapshots; hashes re-confirmed this iteration's set-diff) — stands, merged with **F4.9** (same root cause, caller-side view) and **F8.5** (ownership chain) into one ledger row: *freshness invariant enforced at three partial points, no whole-corpus verifier*. **F2.6** (single-token phrases can only match by exact equality — `scorePhrase` returns null below 2 phrase tokens, `normalize.mjs:118-121`) — stands, code re-read confirmed. **F3.1+F5.1** (concept-lane rows + "Both index artifacts") — stands, merged into one contract-repair row. **F3.2** (search.md inline recipe drift) — stands. **F4.1** (Gate 1 lookup has no mechanical executor) — stands, hook re-grep this iteration still zero. **F4.3** (doctor lacks manifestHash comparison) — stands, merged with F1.1 family as the fix vehicle. **F6.5** (measure-cold-lookup orphaned) — stands. **F7.4** (retrofit-convention displacement) — stands, explicitly out-of-scope to execute. Final P1 count: **7 rows**. | — (ledger consolidation) | Carry to synthesis verbatim. |
| F9.5 | F2.6 cross-check against the class ladder | Claimed: single-token phrases score only via exact equality. Actual: re-read `normalize.mjs:118-121` — `phraseTokenSet.size < 2` → null after the exact-equality test; containment and overlap both require ≥2 phrase tokens. Consequence: a 1-token phrase like `ripgrep` (if declared) admits candidates via the gate (substring) but scores `partial/0.0` for every multi-token query — it can never rank. Whether any live 1-token phrases exist: spot-check of the index's phrase keys shows multi-token phrases dominate (35,281 keys; tokenized sample all ≥2 tokens — single-word trigger phrases are rare in practice because the sanitizer/filters discourage them: `trigger-phrase-sanitizer.vitest.ts`, `no-prose-bigrams` suites). Severity holds at P1-as-documented-gap (a declared class the ladder advertises but single-token phrases cannot reach), with mitigated real-world incidence. | P1 (stands, incidence note added) | (Unchanged: document or allow single-token overlap scoring.) |
| F9.6 | newInfoRatio honesty check on convergence telemetry | Claimed (charter): exactly 10 iterations, no early convergence; convergence treated as telemetry only. Actual: per-iteration newInfoRatio trajectory 1.0, 0.9, 1.0, 0.85, 0.7, 0.7, 0.8, 0.55, (this iter ~0.45) — the curve is descending but the charter's broadened-angle mandate kept producing first-recorded rows each pass; the stop reason will be `maxIterationsReached`, not convergence. | — (telemetry) | Record in convergence report. |

Ruled out: F2.8 as originally framed (refined by F9.3); "F2.7 overstated" (probe confirms); "any P1 loses its evidence path on re-check" (none did).

## Sources Consulted

- Direct ESM probes of `lib/normalize.mjs` scoring (3/4, 4/5, 3/5-nominally-4/5 token cases)
- `lib/normalize.mjs:118-138` (re-read for F9.5)
- Lookup JSON run for "trigger index generator" (distinctive-query control)
- P1 rows from iterations 1–8 (ledger re-verification pass)

## Assessment

- newInfoRatio: 0.45 — mostly verification and consolidation; F9.3's refinement and F9.5's incidence note are the new content.
- Novelty justification: the distinctive-query control test and the single-token incidence check are new evidence; the dedup produces the final ledger shape.

## Reflection

- Worked: adversarially re-probing my own two weakest claims before synthesis — both survived, one needed a scope correction (F9.3), which is exactly what this pass was for.
- Failed: my third probe comment mislabeled 4/5 as 3/5; caught by recomputing the shared-token set before writing the row.
- Ruled out: see above.

## Recommended Next Focus

Iteration 10 (final): ledger consolidation + open-question audit — assemble the cited defect-and-simplification ledger in the synthesis; verify every charter q-* is answered or explicitly carried as open; close the loop.
