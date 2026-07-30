# Iteration 008 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:35:14.143Z
- New findings: 3 (of 3 reported; prior total 23)
- Coverage: {"filesExamined":27,"keyPaths":[".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs",".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs"]}

## Summary
Read the shared host, promotion and rollback paths, model-benchmark runner and sweep flow, and the skill-benchmark executors. The strongest risk is fail-open promotion arithmetic: malformed or non-finite score fields bypass numeric gates and can authorize a canonical write. The benchmark sweep can also score raw event JSON as assistant output when a valid stream contains no text events. The direct rollback path accepts caller-supplied backup bytes without proving their provenance.

## Findings
- [P1] F-008-01 Non-finite score values bypass promotion gates @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs:518
  - evidence: The benchmark gate uses `Number(benchmarkReport.aggregateScore || 0) < BENCHMARK_AGGREGATE_GATE`; Lane A uses the same pattern for `Number(score.score || 0)` and `Number(scoreDelta || 0)` at lines 593-605. `Number('not-a-number')` produces NaN, and comparisons with NaN are false, so malformed score or delta evidence can pass these gates and reach promotion.
  - recommendation: Require finite numeric values before every promotion comparison and fail closed on absent, NaN, Infinity, or non-numeric score, delta, aggregate, and threshold fields.
- [P1] F-008-02 Benchmark sweep scores raw event JSON when assistant text is absent @ .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:322
  - evidence: `dispatchCell` assigns `assistantText` with `extractAssistantText(stdout) || stdout`. For a syntactically valid JSONL event stream containing no `type:'text'` events, the parser returns an empty assistant string, so the fallback uses raw event JSON; line 326 then marks the dispatch successful when that JSON is non-empty and sends it to scoring.
  - recommendation: Preserve an empty parsed assistant output and mark text-less streams unscorable. Only fall back to raw stdout when parsing reports an actual error.
- [P1] F-008-03 Direct rollback trusts an unbound backup file @ .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:144
  - evidence: After checking target, manifest, configuration, and allowed roots, the direct rollback path executes `fs.copyFileSync(backup, target)` and emits `status:'rolled_back'`. It does not require an acceptance record, compare the backup hash with a recorded pre-promotion hash, or establish that the backup is the archived preimage. Any readable file under the allowed roots can therefore be restored as a successful rollback.
  - recommendation: Require rollback evidence containing the recorded pre-promotion hash, verify the backup against it before copying, and reject unbound direct backup paths.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 8,
  "dimension": "correctness",
  "summary": "Read the shared host, promotion and rollback paths, model-benchmark runner and sweep flow, and the skill-benchmark executors. The strongest risk is fail-open promotion arithmetic: malformed or non-finite score fields bypass numeric gates and can authorize a canonical write. The benchmark sweep can also score raw event JSON as assistant output when a valid stream contains no text events. The direct rollback path accepts caller-supplied backup bytes without proving their provenance.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Non-finite score values bypass promotion gates",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      "line": 518,
      "evidence": "The benchmark gate uses `Number(benchmarkReport.aggregateScore || 0) < BENCHMARK_AGGREGATE_GATE`; Lane A uses the same pattern for `Number(score.score || 0)` and `Number(scoreDelta || 0)` at lines 593-605. `Number('not-a-number')` produces NaN, and comparisons with NaN are false, so malformed score or delta evidence can pass these gates and reach promotion.",
      "recommendation": "Require finite numeric values before every promotion comparison and fail closed on absent, NaN, Infinity, or non-numeric score, delta, aggregate, and threshold fields."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Benchmark sweep scores raw event JSON when assistant text is absent",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs",
      "line": 322,
      "evidence": "`dispatchCell` assigns `assistantText` with `extractAssistantText(stdout) || stdout`. For a syntactically valid JSONL event stream containing no `type:'text'` events, the parser returns an empty assistant string, so the fallback uses raw event JSON; line 326 then marks the dispatch successful when that JSON is non-empty and sends it to scoring.",
      "recommendation": "Preserve an empty parsed assistant output and mark text-less streams unscorable. Only fall back to raw stdout when parsing reports an actual error."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Direct rollback trusts an unbound backup file",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs",
      "line": 144,
      "evidence": "After checking target, manifest, configuration, and allowed roots, the direct rollback path executes `fs.copyFileSync(backup, target)` and emits `status:'rolled_back'`. It does not require an acceptance record, compare the backup hash with a recorded pre-promotion hash, or establish that the backup is the archived preimage. Any readable file under the allowed roots can therefore be restored as a successful rollback.",
      "recommendation": "Require rollback evidence containing the recorded pre-promotion hash, verify the backup against it before copying, and reject unbound direct backup paths."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 27,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/codex-executor.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/browser-executor.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs"
    ]
  }
}
```