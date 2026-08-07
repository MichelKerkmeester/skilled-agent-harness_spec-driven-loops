# Deep Review Report — 027/017 BM25 Warmup Churn Reduction

**Target:** commit `573904538b` — no-copy chunked packed postings + Uint8/16/32 typed-array width promotion + free-after-pack in `bm25-index.ts`, with the hard RSS gate re-enabled.
**Method:** 5 independent narrow-lens seats (cli-opencode gpt-5.5-fast, xhigh), then a fresh Fable 5 adversarial synthesis-check, then remediation.

## Seat coverage (5 iterations)

| Seat | Lens | Outcome |
|------|------|---------|
| 1 | Ranking parity (byte-identical) | Clean — chased the conditional body-normalization lead and ruled it out |
| 2 | Memory-safety / use-after-free / leak | Clean |
| 3 | Typed-array width promotion | 1× P2 (promotion boundaries not directly asserted) |
| 4 | Test rigor / RSS-gate soundness | 1× P0 + 2× P1 + 2× P2 (+ 2 ruled_out) |
| 5 | Adversarial edge / scope / hygiene | 1× P2 doc-accuracy (+ 5 ruled_out: hygiene, degenerate docs, chunk growth, field-weight tunability, scope) |

Production code (parity, memory-safety, scope, hygiene) came back **clean**. All findings were test-quality or documentation.

## Fable 5 adversarial adjudication

- **F1 — RSS gate samples final, not peak (seat 4 P0): DOWNGRADED to P2.** Worker-arena reuse is theoretical here (`fileParallelism:false`, vitest `isolate:true`, and this is the first test in the file); spike-released-before-sample is unlikely (synchronous loop, tiny chunks, sample immediately after finalize). Worth a small hardening, not a P0.
- **F2 — Width-promotion branches untested (seats 3+4): CONFIRMED P1.** Verified all three axes stay below thresholds (doc id ≤10,244; per-field tf single-digit; vocab ~15k), so the promotion code never executes under any existing test, while being production-reachable (an index >65,535 rows, or a token repeated >255× in one document). A widening-copy bug would silently break the byte-identical guarantee. **Centerpiece fix.**
- **F3 — RSS gate bypasses production `rebuildFromDatabase` path: DOWNGRADED to P2, WONTFIX.** The wrapper funnels into the identical packing code the gate already drives at full corpus size; the 600-doc test covers the wrapper's own batching/free logic.
- **F4 — impl-summary overclaims byte-identical evidence: CONFIRMED P2 (mandatory doc fix).** `hybrid-search.vitest.ts` pins `legacy-inmemory` and is not packed-parity evidence; `SPECKIT_BM25_RSS_GATE=1` no longer exists; "byte-identical scores" overstates `toBeCloseTo(…,10)` (ordering is exact via `toEqual`).
- **F5 — wall-clock latency assertion: CONFIRMED P2, WONTFIX** (4× headroom, fix on first observed flake).
- **F6 — duplicate of F2.**

## Remediation (this commit)

1. **F2/F6** — added `describe('packed BM25 width promotion')` to `bm25-packed-inmemory.vitest.ts`: forces tf 256 and 65536 (Uint8→16→32 with a narrow doc first so the widening copy runs twice), doc ids past 65535, and term ids past 65535; asserts the stored values survive the `widened.set(chunk)` copy intact. All pass — the production widening code is correct, now covered.
2. **F1** — the RSS gate now samples RSS during warmup (every 1,024 docs + once after finalize) and asserts the peak delta ≤ 150 MB. Peak-sampled spike = **136.5 MB** (was 134.3 MB final-sampled). Retires the final-vs-peak argument.
3. **F4** — corrected `implementation-summary.md` verification claims (removed the nonexistent env var, reattributed parity evidence to the packed warmed-vs-direct check + MRR baseline, softened "byte-identical scores" to "identical ordering, scores to 1e-10"); updated the figure to 136.5 MB across spec.md/implementation-summary.md.

**WONTFIX (documented):** F3 (production wrapper shares the measured packing code), F5 (latency headroom).

## Verification after remediation

- `vitest bm25-packed-inmemory` — 9/9 PASS (was 6/6); peak warmup RSS spike 136.5 MB ≤ 150 MB.
- `tsc --noEmit` — 0 diagnostics.
- Comment hygiene — clean (no ephemeral labels in changed code).
- No production code (`bm25-index.ts`) change was required.

**Disposition:** 017 review complete; production code confirmed sound; test + doc gaps remediated.
