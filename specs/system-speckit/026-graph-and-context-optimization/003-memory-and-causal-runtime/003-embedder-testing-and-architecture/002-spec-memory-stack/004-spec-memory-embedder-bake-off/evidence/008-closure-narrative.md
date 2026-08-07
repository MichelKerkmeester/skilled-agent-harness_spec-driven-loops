# 008 — Closure narrative for cat-24/409 (51/51 FAILs)

> Retrospective single-doc summary of the 008 mk-spec-memory stress-test closure path. Chains 8 commits + 4 ADRs into one read.

## Headline

**008 closed: 51/51 FAILs resolved.** The last gap (cat-24/409 — paraphrase recall) was closed via post-surgery fixture + nomic activation + retrieval-rescue layer default-on. Later re-verified with jina-v3 as production winner (ADR-012, commit `1aa46e523`).

## Path: 1/10 → 9/10

| Stage | top-3 on cat-24/409 | What changed | Commit / ADR |
|---|---|---|---|
| Baseline | **1/10** | embeddinggemma-300m, original fixture | (pre-016 baseline) |
| Same-shape dense swap (best of 5) | **5/10** | nomic-embed-text-v1.5 (same dim, code-tunable embedder) | ADR-006 (`218f888b9` — but later ROLLBACK because still below PASS) |
| Fixture surgery + nomic | **6/10** | Orphan-row prune + stale-fixture repair + nomic active | ADR-009 (`ef8a00b6e`) |
| Rescue layer (opt-in) + post-surgery | **8/10** ✅ | Rescue layer = trigger-lane boost + sibling-doc canonicalization + (initially-inactive) cross-encoder rerank | ADR-010 (`489d4e0d7`) — initial PASS claim was on stale dist; see Post-Publish Verification |
| Rescue layer default-on | (no change, still 8/10) | `SPECKIT_RERANK_LAYER` flag default flip | ADR-011 (`19bd78000`) |
| Post-rebuild D-RETRY | **8/10** ✅ confirmed | After dist rebuild — rescue layer ACTUALLY firing this time; flips OFF 4/10 → ON 8/10 | D-RETRY (`e964ba505`) |
| Production candidate sweep | **9/10** ✅ | jina-embeddings-v3 + rescue beats nomic+rescue on both quality AND latency | ADR-012 (`1aa46e523`) |

## The detour: dist staleness

Between commit `489d4e0d7` (rescue layer landed in source) and the D-RETRY `e964ba505`, the rescue layer **was never actually firing** because `mcp_server/dist/` was 3 hours stale (last `npm run build` at 11:58 vs rescue commits at 14:00-15:00).

- ADR-010 (initial "rescue closes 24/409 at 8/10") was unverifiable at the time it shipped.
- ADR-011 (default-on flip) was a runtime no-op.
- ADR-012 (jina production winner) is the FIRST measurement post-rebuild — and the only one with a sound verification chain.

**Recovery commits:**
- `7e5146202` → reverted via `54188cf66` (originally bundled dist + corruption; clean re-commit as `b9437fcc9`)
- D-RETRY dispatch + dist rebuild + retroactive 51/51 verification (`e964ba505`)
- Prevention: `ab7f17ae1` shipped `tests/dist-freshness.vitest.ts` to catch the same class of bug

## The 5-embedder swap leaderboard (no rescue, baseline)

| Embedder | dim | cat-24/409 top-3 | Verdict |
|---|---|---|---|
| embeddinggemma-300m (baseline) | 768 | 1/10 | floor |
| mxbai-embed-large-v1 | 1024 | 2/10 | ADR-001 ROLLBACK |
| nomic-embed-text-v1.5 | 768 | 5/10 | best dense swap; ADR-006 |
| jina-embeddings-v3 | 1024 | 4/10 | promising baseline; production winner with rescue |
| bge-m3 | 1024 | 2/10 | ADR-007 ROLLBACK |
| snowflake-arctic-embed-l-v2.0 | 1024 | 1/10 | ADR-008 ROLLBACK |

Conclusion: **no pure dense swap closes cat-24/409 alone**. Rescue layer is the multiplier.

## With rescue layer (ADR-012)

| Embedder | cat-24/409 | Median ms | p95 ms | Outcome |
|---|---|---|---|---|
| **jina-embeddings-v3** | **9/10** | 893 | 1465 | 🏆 production |
| nomic-embed-text-v1.5 | 8/10 | 922 | 3045 | runner-up |
| embeddinggemma-300m (baseline) | 7/10 | 787 | 936 | baseline with rescue — rejected (no-swap path insufficient) |

## Open items (post-008)

- **cat-24/402 + 24/408** remain FAIL under rescue. They're not the 008 closure gate but should be flagged when those scenarios become load-bearing.
- **51/51 verdict assumes** the ADR-012 measurement holds. Periodic regression check recommended after any major embedder or rescue-layer change.

## Cross-references

- `decision-record.md` — ADRs 001-012
- `INDEX.md` — all evidence files
- `jina-runtime-measurements.md` — runtime resource snapshot
- `d-rescue-layer-cost-benefit.md` — ON vs OFF benchmark
- `embedder-comparison-with-rescue.jsonl` — 3-row authoritative leaderboard
- `cat-24-409-audit.md` — fixture audit (ADR-009 source)
- `corpus-hygiene-cleanup.md` — orphan-row prune evidence
- `../../../000-release-cleanup/005-stress-test/008-spec-memory-mcp-stress-test/implementation-summary.md` — packet 008 summary
