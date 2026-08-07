# RSS Probe Evidence — Realistic-Fixture Budget Re-Validation (2026-06-11)

After replacing the stop-word `FIXTURE_FILLER` (which indexed **zero** body
postings) with a per-doc-varying, non-stop-word vocabulary at the same byte
target (69.2 MB / 10,245 docs), the packed-engine RAM gate was re-measured.

## Measurements

| Metric | Value | Budget | Verdict |
|--------|-------|--------|---------|
| RSS spike, committed gate (synchronous bulk add) | 686.8 MB | 150 MB | **BREACH (4.6x)** |
| RSS spike, batched warmup probe (yields every 250 docs, `--expose-gc`) | 799.4 MB | 150 MB | **BREACH** |
| RSS retained after forced `gc()` | 797.7 MB | — | V8 keeps committed pages in-run |
| **Retained heap after forced `gc()`** | **104.9 MB** | 150 MB | **WITHIN budget** |
| Warmup latency (committed gate) | 1,997 ms | 10,000 ms | within budget |
| Corpus shape | 10,245 docs, termCount 14,434, avgDocLength 975 | — | realistic (conservative vs Heaps-law ~400 distinct/doc) |

## Interpretation

- The packed engine's **retained** data structures (Uint32Array postings +
  per-doc term-key arrays) hold ~105 MB at the realistic corpus — the design
  goal (vs 300–600 MB legacy estimate) is met on retained heap.
- The **RSS spike** breach is allocation churn during tokenization/warmup
  (char-by-char token building, transient body strings, mutable `number[]`
  postings growth) — V8 commits ~700–800 MB of heap pages and does not
  decommit them within the run. Batching with event-loop yields does not help;
  the boot warmup path (`setTimeout(0)` chains) has the same shape.
- Tokenizer changes are explicitly out of scope for this packet (spec §3), so
  the churn cannot be remediated here.

## Consequence

Spec REQ-001's acceptance criteria state: "budget breach fails the phase and
fires the minisearch contingency decision." The RAM gate test is therefore
left failing by design, and the §7 contingency question is escalated for a
buy-vs-build / budget-amendment decision. See `spec.md` §7.

Probe script preserved as `rss-probe.vitest.ts.txt` in this folder
(run from `mcp_server/` with `NODE_OPTIONS='--expose-gc'`).
