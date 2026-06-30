# Deep-Review Iteration 1 — Correctness (Opus second opinion)

## State Summary

Second independent Opus 4.8 deep review of the deep-agent-improvement TWO-LANE program (phases 008-013), post-015-remediation. Iteration 1 of 10, dimension focus: **correctness**. Goal (a): confirm the 015 remediation of the 014 (cli-codex gpt-5.5) findings holds. Goal (b): hunt NEW issues a different model surfaces.

Approach: read the deep-review iteration doctrine + loop protocol, then read all in-scope shared/model-benchmark scripts and the three regression suites adversarially, with two empirical probes (materializer traversal repro, full in-scope test run).

## Dimension: Correctness

## Files Reviewed

- `scripts/shared/loop-host.cjs:87-113` (parseArgs space-form), `:130-169` (planInvocation)
- `scripts/shared/materialize-benchmark-fixtures.cjs:60-92` (fixture-id write path)
- `scripts/model-benchmark/run-benchmark.cjs:122-167` (fixture-id guard, regex DoS guard), `:382-577` (main, provenance, history)
- `scripts/model-benchmark/dispatch-model.cjs:54-234` (read-only default, cwd, sentinel)
- `scripts/model-benchmark/scorer/score-model-variant.cjs:54-258`
- `scripts/model-benchmark/scorer/grader/harness.cjs:44-262` (clampScore01)
- `scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:85-109` (isInside)
- `scripts/agent-improvement/score-candidate.cjs:171-204, 546-644` (cache key + dir)
- `scripts/shared/reduce-state.cjs`, `scripts/shared/promote-candidate.cjs`
- `scripts/tests/{loop-host,score-candidate-cache,run-benchmark-hardening}.vitest.ts`
- `commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`
- `lib/scorer/lanes/explicit.ts`

## Findings by Severity

### P1

**correctness-1-1 — Fixture-id path traversal: 015 F-P1-9 guard only hardened run-benchmark.cjs, NOT the materializer that actually writes fixture outputs first.**

The 015 fix added `assertSafeFixtureId` / `SAFE_FIXTURE_ID` to `run-benchmark.cjs` (`fixtureOutputPath`, lines 122-138). But the model-benchmark plan (`loop-host.cjs:155-158`, mirrored in the auto YAML `step_run_benchmark`) runs `materialize-benchmark-fixtures.cjs` FIRST, and that script is the real writer of `${fixture.id}.md`:

```js
// materialize-benchmark-fixtures.cjs:91
fs.writeFileSync(path.join(outputsDir, `${fixture.id}.md`), renderFixture(fixture), 'utf8');
```

No sanitization. A fixture whose in-file `id` is `../escaped` writes OUTSIDE `outputsDir` before `run-benchmark.cjs`'s guard ever fires.

Empirically confirmed: with `id:"../escaped"` and `--outputs-dir /tmp/mat-test2/outputs/sub`-style nesting, the materializer wrote `escaped.md` to the parent of `outputsDir` and exited 0 (`{"status":"fixtures-materialized",...}`). Deeper multi-level traversal ENOENTs only because no intermediate `mkdir -p` is done, but the single-level parent escape is a clean write primitive.

The 015 regression test (`run-benchmark-hardening.vitest.ts:67-79`) asserts `evil.md` is NOT created — but that assertion passes only because the test calls `runBenchmark` WITHOUT first running the materializer. In the production two-lane flow the materializer runs first, so the on-disk escape happens regardless of run-benchmark's guard. No test exercises the materializer with a hostile id (`grep` confirms zero coverage).

This is the same bug-class 014 flagged (F-P1-9), incompletely remediated: the guard landed on the second writer but not the first. Benchmark profiles/fixtures are trusted-author content today, so this is a latent traversal write rather than an open exploit (matching the project's own framing of the analogous F-P1-3 exec gate), hence P1 not P0.

## Traceability Checks

- `spec_code` (model-benchmark plan): the auto YAML promises "materialize fixtures then run-benchmark" and EC-5 ordering — code matches (`loop-host.cjs:153-159`). PASS.
- The 015 remediation claims ("fixture-id sanitize", report history, provenance, read-only dispatch default, packet-local + candidate-keyed cache) all resolve to shipped code; see confirmations. PASS, with the single materializer gap above.

## Verdict

CONDITIONAL — one new P1 (incomplete remediation of the 014 F-P1-9 traversal class). All other 015 fixes confirmed holding; 29/29 in-scope tests pass with no regression.

## Next Dimension

Security (iteration 2).
