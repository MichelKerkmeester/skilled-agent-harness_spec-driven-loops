---
title: "Deep Research Dashboard — Crawlable Commit History (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Dashboard — Crawlable Commit History (deepseek lineage)

## Lifecycle

- Status: complete
- Session: `fanout-deepseek-1789111510857-0nqzvk`
- Executor: `cli-pi` / `deepseek-v4.1-flash` / `max`
- Iterations: 10 / 10
- Stop policy: `max-iterations`
- Convergence threshold: `0.05`
- Terminal reason: `maxIterationsReached`

## Iterations

| Iteration | Focus | Status | newInfoRatio | Findings |
|---:|---|---|---:|---:|
| 1 | The contract and its hook | complete | 1.00 | 14 |
| 2 | What the history actually contains | complete | 0.90 | 10 |
| 3 | The search surfaces | complete | 0.85 | 10 |
| 4 | Identifier design | complete | 0.85 | 10 |
| 5 | Body and trailer shape | complete | 0.80 | 10 |
| 6 | Conventions already in the world | complete | 0.60 | 8 |
| 7 | The retrofit mapping | complete | 0.85 | 10 |
| 8 | Rewrite mechanics and alternatives | complete | 0.80 | 10 |
| 9 | Citation remap and blast radius | complete | 0.80 | 10 |
| 10 | Enforcement, tooling and the phase plan | complete | 0.75 | 10 |

## Questions

- Answered: 10 / 10 angles
- Open research questions: 0
- Open contract decisions carried forward: 10 (see strategy §11A and research.md S8)

## Convergence

- Trend: `1.00 → 0.90 → 0.85 → 0.85 → 0.80 → 0.60 → 0.85 → 0.80 → 0.80 → 0.75`
- Rolling average (last 3): 0.7833 > 0.05
- Composite stop telemetry: none satisfied before the cap (anti-convergence guard honored)
- Terminal reason: `maxIterationsReached` (hard cap bypasses early-convergence synthesis)

## Headline findings

- The enforced contract blocks numeric scopes; the only collision-free placements are the subject (budget cost) and the final trailer block (free). — iteration 1
- 9,112 live commits, 73% subject-grammar compliant, 34% packet-mappable; live ref landscape drifts while you plan. — iterations 2, 7
- `--grep` is the only general message surface; AND queries resolve 2 commits today; pickaxe is useless for messages; trailer extraction loses 66% of `Refs:` to placement. — iteration 3
- Packet-derived hyphen id in a final trailer block, minted by a locked high-water allocator; message text is the only address that survives rewrites and is indexed everywhere. — iterations 4-6
- Rewrite via `filter-repo --commit-callback` on a mirror; remap 1,700 prefix-matching + 294 full-SHA citations (5,560 decoys) + 460 message-internal cites; rollback = restore from bare backup. — iterations 8-9

## Next Focus

Synthesis complete. The next packet action is phase 002 — contract freeze (key set, id shape, fallback namespace, enforcement level, cherry-pick policy), gated on operator approval.
