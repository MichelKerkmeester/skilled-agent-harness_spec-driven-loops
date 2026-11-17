# DRV-070 live walk, review completed-run extension

Walked 2026-11-17 in a throwaway detached worktree at `6953b67c5dd`, on fixture `specs/z_scratch/996-review-extend-rewalk` (never merged), with cli-pi `deepseek-v4.1-flash-1017` at max effort, `--max-iterations=2 --stop-policy=max-iterations`, then `--extend=3`. Result: PASS on all six Pass/Fail rules. An earlier walk on `f122b4185ca` FAILED the count (2 iterations counted as 1 run), which led to the fix in `6953b67c5dd`.

## Summary

| Signal | Before | After |
|---|---|---|
| Iteration files and rows | 2 | 5 |
| Dispatch receipts | 6 | 12 |
| `maxIterations` | 2 | 5 |
| `continuedFromRun` | null | 2 |
| `lineageMode` | new | completed-continue |
| `extended` rows (`rg -c '"event":"extended"'`) | 0 | 1 |
| `resumed` rows | 0 | 0 |
| `run_extended` ledger receipt | none | seq 15, `deep-review.ledger.run-extended` |
| Snapshot | none | `review-report-v1-r2.md`, sha256 `db1e408f…4e03c`, equal to the prior `review-report.md` |

Session id `2026-11-17T22:12:11Z` and generation 1 were kept. Extend step output: `{"continuedFromRun":2,"newMaxIterations":5,"newMaxDurationMinutes":240,"warning":null}`.

## Recorded state

```text
== before
iteration_files=2 (iteration-001.md iteration-002.md )
iteration_rows=2
receipts=dispatch-review-i1-g1.completion.json dispatch-review-i1-g1.intent.json dispatch-review-i2-g1.attempt-1.completion.json dispatch-review-i2-g1.attempt-1.intent.json dispatch-review-i2-g1.completion.json dispatch-review-i2-g1.intent.json 
extended_rg=rg_exit=1
resumed_rg=rg_exit=1
extended_jq=0 resumed_jq=0
config={"sessionId":"2026-11-17T22:12:11Z","generation":1,"maxIterations":2,"lineageMode":"new","continuedFromRun":null,"status":"complete"}
report_sha=db1e408f039aeefc9362ca671ce6388599cedb14ba6364f16b0dcedc5754e03c  review-report.md
review-report.md
== after
iteration_files=5 (iteration-001.md iteration-002.md iteration-003.md iteration-004.md iteration-005.md )
iteration_rows=5
receipts=dispatch-review-i1-g1.completion.json dispatch-review-i1-g1.intent.json dispatch-review-i2-g1.attempt-1.completion.json dispatch-review-i2-g1.attempt-1.intent.json dispatch-review-i2-g1.completion.json dispatch-review-i2-g1.intent.json dispatch-review-i3-g1.completion.json dispatch-review-i3-g1.intent.json dispatch-review-i4-g1.completion.json dispatch-review-i4-g1.intent.json dispatch-review-i5-g1.completion.json dispatch-review-i5-g1.intent.json 
extended_rg=1
rg_exit=0
resumed_rg=rg_exit=1
extended_jq=1 resumed_jq=0
config={"sessionId":"2026-11-17T22:12:11Z","generation":1,"maxIterations":5,"lineageMode":"completed-continue","continuedFromRun":2,"status":"complete"}
snapshot=./review-report-v1-r2.md
snapshot_sha=db1e408f039aeefc9362ca671ce6388599cedb14ba6364f16b0dcedc5754e03c  review-report-v1-r2.md
report_sha=d5d90f804508a7d45e9f54d9511508f86889aa64526b368bbb913f47502306d3  review-report.md
extended_row={"type":"event","event":"extended","sessionId":"2026-11-17T22:12:11Z","generation":1,"lineageMode":"completed-continue","continuedFromRun":2,"extension":{"addedIterations":3,"elapsedMinutesAtExtension":12,"newMaxDurationMinutes":240,"newMaxIterations":5,"priorMaxDurationMinutes":120,"priorMaxIterations":2},"timestamp":"2026-11-17T22:24:44.560Z"}
```
