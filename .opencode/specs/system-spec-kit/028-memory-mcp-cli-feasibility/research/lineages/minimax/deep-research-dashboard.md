# Deep Research Dashboard — `minimax` lineage

> Reducer-owned. Auto-generated from `deep-research-state.jsonl` and `findings-registry.json`. Do not edit by hand.

## 0. Lineage

| Field | Value |
|-------|-------|
| Lane label | `minimax` |
| Session id | `fanout-minimax-1780735927714-4462h3` |
| Parent session id | `dr-20260606T105055-fanout028` |
| Mode | research |
| Executor | cli-opencode / `minimax-coding-plan/MiniMax-M3` (reasoning=high, 1500s ceiling) |
| Generation | 1 |
| Created | 2026-06-06T08:50:55Z |
| Status | **complete** (synthesis phase starting) |

## 1. Iteration Table

| run | focus | newInfoRatio | findings | status | timestamp |
|-----|-------|--------------|----------|--------|-----------|
| 1 | KQ1 — 37-tool parity matrix | 0.95 | 9 | complete | 2026-06-06T08:55:00Z |
| 2 | KQ2 — daemon-dependency audit | 0.75 | 8 | complete | 2026-06-06T09:00:00Z |
| 3 | KQ3 — MCP-only affordances | 0.65 | 9 | complete | 2026-06-06T09:05:00Z |
| 4 | KQ4 — integration-surface migration | 0.45 | 8 | complete | 2026-06-06T09:10:00Z |
| 5 | KQ5 — architecture comparison | 0.50 | 8 | complete | 2026-06-06T09:15:00Z |

## 2. Question Status

| id | label | status |
|----|-------|--------|
| kq1 | KQ1 — parity matrix | **answered** (5/37 already ported, 32 port-able, 0 truly lost in handler sense) |
| kq2 | KQ2 — daemon-dependency audit | **answered** (6 services catalogued, 24/37 daemon-free, 13/37 soft, 0 hard; per-arch loss table built) |
| kq3 | KQ3 — MCP-only affordances | **answered** (5 affordances catalogued A1..A5; only A5 is lost in (a); 4x5 cross-runtime matrix built) |
| kq4 | KQ4 — integration-surface migration | **answered** (5 surfaces S1..S5; 28 files / ~125 refs; S1+S2+S4+S5 = 1-3 days; S3 = 1-3 weeks gate) |
| kq5 | KQ5 — architecture comparison | **answered** (5-dim scoring; (a)=0.45, (b)=0.92, (c)=0.97; risk register 9 risks; **verdict: GO with (c)**) |

## 3. Convergence Trend

- Iter 1 newInfoRatio: 0.95 (first broad pass; expected).
- Iter 2 newInfoRatio: 0.75 (substantial net-new evidence).
- Iter 3 newInfoRatio: 0.65 (KQ3 territory has the most per-runtime "diff"; replacements are concrete but vary).
- Iter 4 newInfoRatio: 0.45 (well-known surface; value is in the exact counts).
- Iter 5 newInfoRatio: 0.50 (synthesis iteration; combines KQ1..KQ4 into a single answer).
- Rolling avg (5 iter): 0.66. Convergence threshold 0 = forced full budget; composite stop requires question-entropy ≥ 0.85 OR all 5 KQs answered. **Both conditions satisfied at iter 5.**

## 4. Dead Ends

- "11 CLIs" framing as broad parity (10/11 are operational utilities).
- KQ1-only verdict (KQ3 protocol affordances not yet evaluated).
- "Single-writer = daemon-resident" — interprocess by design.
- "Warm session briefs = daemon hot-cache" — per-session SQLite rows.
- A1 tool-schema auto-discovery as a uniform problem — per-runtime.
- A5 auto-surface as a single replacement problem — architecture-dependent.
- S2 as "just search-and-replace" — inline calls need CLI flag-syntax rewrite.
- S3 as "just config edit" — OpenCode `tools:` block is the migration critical path.
- "Single-binary CLI form" — multi-process by design.
- "Atomic migration" — composable per-tool and per-runtime.
- (a) as the recommended architecture — operational cost exceeds migration saving.

## 5. Blocked Stops

(none — convergence achieved at max iterations + all-questions-answered)

## 6. Graph Convergence

(not yet applicable; coverage-graph not used in this research-only packet)

## 7. Next Focus

**SYNTHESIS:** compile `research.md` from the 5 iteration files into a single verdict-shaped report for the orchestrator's merge step. Final verdict: **GO with architecture (c) — hybrid CLI that auto-spawns the daemon on demand.**
