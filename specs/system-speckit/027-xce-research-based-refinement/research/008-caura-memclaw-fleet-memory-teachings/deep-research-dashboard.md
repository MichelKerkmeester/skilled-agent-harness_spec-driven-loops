# Deep-Research Dashboard — 008 caura-memclaw teachings

**Lineage:** 2026-06-06-008-caura-memclaw-teachings · generation 1 · executor cli-opencode openai/gpt-5.5-fast variant=high read-only

## Summary

- Iterations completed: **20** (001-020) · status insight: 20/20
- Total findings: **133** · total tokens: **2,225,889** · cost: 0 (OpenAI oauth subscription)
- Verdict tallies (from headline verdicts): ADAPT 28, ADOPT 13, DOWNGRADE 5, REFUTED 4, REJECT 3, DEFER 2, UPHELD 2

## Novelty by round (convergence signal)

| Round | Iters | avg newInfoRatio | findings |
|---|---|---:|---:|
| R1 breadth | 001-004 | 0.75 | 19 |
| R2 breadth | 005-008 | 0.79 | 20 |
| R3 breadth | 009-012 | 0.80 | 20 |
| R4 deep | 013-016 | 0.73 | 45 |
| R5 adversarial | 017-020 | 0.50 | 29 |

## Iterations

| Iter | Round          | Focus                                                        | Status  | Findings | newInfoRatio | tokens   |
| ------| ----------------| --------------------------------------------------------------| ---------| ---------:| -------------:| ---------:|
| 001  | R1 breadth     | write-safety / dedup / idempotency / provenance              | insight | 5        | 0.78         | 130,300 |
| 002  | R1 breadth     | recall / search / retrieval architecture                     | insight | 4        | 0.68         | 155,800 |
| 003  | R1 breadth     | governance / trust tiers / scoping / audit                   | insight | 5        | 0.68         | 129,486 |
| 004  | R1 breadth     | self-improving memory / outcome propagation loop             | insight | 5        | 0.86         | 147,463 |
| 005  | R2 breadth     | indexing / embedding / enrichment pipeline                   | insight | 5        | 0.78         | 96,814  |
| 006  | R2 breadth     | entity / relationship / graph modeling                       | insight | 5        | 0.78         | 117,657 |
| 007  | R2 breadth     | lifecycle / retention / archive / purge / tombstones         | insight | 5        | 0.72         | 84,068  |
| 008  | R2 breadth     | event-driven async pipeline + reconciliation/consistency     | insight | 5        | 0.86         | 106,739 |
| 009  | R3 breadth     | recall ranking / activation / decay                          | insight | 5        | 0.78         | 120,702 |
| 010  | R3 breadth     | performance: latency + token-efficiency                      | insight | 5        | 0.84         | 107,648 |
| 011  | R3 breadth     | MCP surface design + API surface governance                  | insight | 5        | 0.78         | 93,128  |
| 012  | R3 breadth     | benchmark / eval methodology                                 | insight | 5        | 0.78         | 116,031 |
| 013  | R4 deep        | DEEP write-safety internals + SQLite adoption sketch         | insight | 12       | 0.82         | 127,246 |
| 014  | R4 deep        | DEEP self-improving loop -> 027/008 shadow-first reducer des | insight | 15       | 0.74         | 87,222  |
| 015  | R4 deep        | DEEP incremental indexing/enrichment -> 027/003 design       | insight | 8        | 0.74         | 108,839 |
| 016  | R4 deep        | DEEP relationship + lifecycle/tombstone -> 027/004+005 desig | insight | 10       | 0.64         | 97,955  |
| 017  | R5 adversarial | ADVERSARIAL refute write-safety/indexing/reconciliation teac | insight | 4        | 0.7          | 69,506  |
| 018  | R5 adversarial | ADVERSARIAL refute self-improving / 027-008 reducer teaching | insight | 9        | 0.34         | 71,635  |
| 019  | R5 adversarial | ADVERSARIAL refute relationship/lifecycle/governance teachin | insight | 4        | 0.25         | 118,626 |
| 020  | R5 adversarial | ADVERSARIAL refute MCP/perf/eval + final negative-knowledge  | insight | 12       | 0.72         | 139,024 |

