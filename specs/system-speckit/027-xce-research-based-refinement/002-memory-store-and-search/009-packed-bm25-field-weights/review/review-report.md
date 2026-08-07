# Deep Review Report — 014 Packed BM25 + Field Weights

Review target: `system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights` (packed in-memory BM25 engine + BM25F field weights; commit e78430e7d2).
Mode: autonomous fan-out (`/deep:start-review-loop` via `fanout-run.cjs`), 3× cli-opencode `gpt-5.5-fast --variant high`, strongest-restriction merge.

---

## 1. Executive Summary

**Verdict: FAIL (provisional — P0s pending adversarial verification)** | P0: 2 · P1: 2 · P2: 2

Strongest-restriction merge locked FAIL on two raw P0 findings. Per deep-review doctrine, raw P0s from narrow gpt-5.5 lineages MUST survive a fresh-Fable adversarial verification before the FAIL is treated as real — narrow seats over-rate, and a key severity factor is whether the packed BM25 engine is **default-on or opt-in/shadow** (an opt-in engine's warmup bug is latent, not production-blocking). One raw P0 is a **test-fixture-quality** claim (the RAM-budget fixture is mostly stop words) which is likely not a production P0 at all. A fresh Fable 5 adversarially verifies each P0/P1 and establishes the enablement state before remediation.

---

## 2. Findings (raw — pending Fable adjudication)

- **P0-1 (raw) · correctness · `lib/search/bm25-index.ts`** — Async packed-BM25 warmup reportedly never finalizes the last non-empty batch (postings incomplete after warmup). VERIFY: read the async warmup batch loop + `finalizePackedPostings()` (~510) — is the final batch flushed? AND establish whether packed BM25 is default-on or opt-in (ENABLE_BM25 / engine-selection flag) — opt-in downgrades severity.
- **P0-2 (raw) · test-validity · `lib/eval/fixtures/bm25-packed-fixture.ts`** — The current-corpus RAM-budget fixture is mostly stop words and does not exercise body postings, so the RAM gate may not validate the real memory profile. This is a **fixture/test-quality** issue (the fixture does not ship) — likely a P1 test-validity finding, not a production P0. VERIFY + reclassify.
- **P1-1 · test-validity · `lib/eval/fixtures/bm25-packed-fixture.ts`** — Warmup/RSS gate uses synthetic repeated filler instead of the full current corpus (related to P0-2). Fix: exercise a representative body-posting corpus in the RAM gate.
- **P1-2 · correctness · `lib/search/hybrid-search.ts` (~428-442)** — Fallback scoped BM25 applies the `limit` at `index.search(query, limit)` BEFORE the spec-folder DB-side filter, so scoping can return fewer than `limit` results (top-N global candidates then filtered down). VERIFY: is the limit applied pre-filter? Fix: filter to scope first, then limit.
- **P2-1 · traceability · `014/graph-metadata.json`** — `key_files` includes out-of-scope drift files not belonging to this packet. Fix: prune to in-scope files.
- **P2-2 · traceability · `014/spec.md`** — A shipped open question remains unresolved though implementation answered the contingency. Fix: resolve/close the open question.

---

## 3. Convergence & Attribution

| Lineage | Executor | Verdict |
|---------|----------|---------|
| gpt-1/2/3 | cli-opencode / gpt-5.5-fast-high | FAIL (raw P0s) |

Merge policy: strongest-restriction (active P0 → FAIL). **This verdict is provisional**: a fresh Fable 5 agent adversarially verifies each P0 (read the actual code, establish enablement state, distinguish production-code from test-fixture issues) and each P1 before any remediation. P0s refuted on verification are downgraded with rationale (per the iteration adversarial-replay gate).

## 4. Verdict & Next Steps

**FAIL (provisional)** — pending Fable adversarial verification of the 2 P0s. Likely outcome: P0-2 reclassifies to a test-validity P1 (fixture, not shipped); P0-1's severity hinges on warmup correctness AND the engine's enablement state. Real production-code defects (warmup finalize; limit-before-filter) get behavior-correct fixes; test-fixture + traceability findings get their respective fixes. Remediation closes the verdict.
