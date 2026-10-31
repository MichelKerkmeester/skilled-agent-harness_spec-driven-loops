# SWE lineage dashboard

Session `fanout-swe-1790457982528-yjdrdz`. Status complete. stopReason `maxIterationsReached`. Convergence mode `off` — telemetry only.

| Iteration | Angle | newInfoRatio | Findings |
|---|---|---|---|
| 1 | swe-01 R1 as code: `score-jev-tiebreak.mjs` function by function | 0.85 | 6 |
| 2 | swe-02 R19 census as code over the transcript format | 0.92 | 6 |
| 3 | swe-03 R2 zero-call slice and redaction unit cases as code | 0.85 | 7 |
| 4 | swe-04 R20 lint as code + one skip-line contract | 0.85 | 6 |
| 5 | swe-05 build order in code: files, LOC, tests, switches, rollback | 0.75 | 5 |

Ranks unchanged from BASE §11. Clauses added: decided = movable rows with `gold_demoted` apart; `-s -` on every `choice` call; `unmeasured_timeout` for hung spawns; `replay_version=` per reconstructed brief; `unclear` kept as its own row; scratch fixtures excluded from the goal corpus; `skipped:`/`refused:` naming unified on 002's split.

Cross-lineage: Q25 answered negatively here (47 boundaries, no PreCompact hookEvent) but deepseek-02 saw a `hook_success`/`SessionStart:compact` record — merged design reads recorded first, replays as fallback. mimo-03's verifier-use census was filled in passing: 5/5 records `not_evaluated`, D2 closed, R2 arm unbuildable today.

Sibling files read: deepseek iteration-005, grok iteration-005, mimo iteration-002 (W2/W3 checks).
