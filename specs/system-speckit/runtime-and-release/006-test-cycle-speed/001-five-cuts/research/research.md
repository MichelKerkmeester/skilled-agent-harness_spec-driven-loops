# Research: Making the Test Cycle Faster After the Five Cuts

Two lineages ran ten iterations each: `luna-max` (GPT-6 Luna, max effort, through cli-codex) and `deepseek-flash-max` (DeepSeek v4.1 flash max, through cli-devin). Both stopped at the iteration cap, not at convergence. Their full reports are in `lineages/luna-max/research.md` and `lineages/deepseek-flash-max/research.md`. The merged registry holds 89 findings, and `fanout-attribution.md` shows which lineage found what.

This synthesis keeps only what was checked against the code or the measured runs. Each claim below says how it was checked.

## 1. Short Answer

One cut is ready to try: split `upgrade-legacy.vitest.ts` into shards. It sets the `cli` lane's time, and its cost scales with its 65 tests. A second idea, moving `fanout-run` out of the serial group, is contradicted by an observed failure and needs a test first. Two open items are not levers: the "300 s import time" is a summed figure, and the ledger read cache already exists where it helps.

## 2. What Was Checked

**The import figure is a sum, not elapsed time.** Confirmed. Vitest computes it as `sum(files, (file) => file.collectDuration)` at `.skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2465`. With 18 workers, 302 s summed is roughly 17 s of wall time. DeepSeek found this. Luna treated the figure as wall time. The packet docs made the same mistake and are corrected.

**`upgrade-legacy` resets its sandbox after each test.** Confirmed. The file has 65 `it` blocks, and three describe blocks call `afterEach(resetSandbox)` at lines 231, 1932 and 2272. The reset restamps every `dist` file at line 120. So its cost scales with the test count, and shards with their own sandboxes would divide it.

**`fanout-run` has no elapsed upper-bound assertion.** Confirmed by reading the file, which has no `toBeLessThan` on a duration. DeepSeek concluded it cannot fail under load. That conclusion is contradicted. In the parallel run with the default worker count, two `fanout-run` tests failed: a manifest dispatch got a null exit code, and a churn check sampled per heartbeat found no burst. Both depend on timing even without an upper bound.

**The heavy core-lane files.** Partly confirmed. `progressive-validation.vitest.ts` exists in `runtime/tests/`, the core lane. The 85 s and 84 s files DeepSeek named belong to the deep-loop suite, not the core lane.

**Ledger read caching.** Confirmed by both lineages. `singleWriterReadCache` is opt-in, is cleared on every append, and is already enabled in `fanout-effect-dispatch.ts`. Enabling it in the append gateway would not help, because each gateway call is one process doing one append.

## 3. Recommendations

1. **Take a per-file profile of both suites first.** Run each once with `--reporter=json` on a quiet machine. Every estimate in both reports rests on pre-cut numbers.
2. **Shard `upgrade-legacy.vitest.ts`.** Split it into about four files, each with its own sandbox, and keep the seven order-dependent tests together. Update `run-cli-tests.sh` and the CI step that names the file. Prove it with the same test count before and after and three passing runs. DeepSeek estimates the lane falls from about 400 s to 100 to 140 s. That is unmeasured.
3. **Try `fanout-run` in the parallel group only after a split, and only per test.** First split it by describe block. Then move one piece at a time, and return any piece that fails once under load.
4. **Measure the CI runner.** Both reports agree the 18-core Mac numbers do not carry over. Run the suites on `ubuntu-latest` at 1, 2, 4 and default workers, and set a cap from the median.
5. **Leave the ledger and import time alone.** Neither is a lever for test speed.

## 4. Not Recommended

- `isolate: false` for the core lane. It shares module state across 129 files to cut a summed figure.
- Raising `maxWorkers`. The core lane already uses every core.
- Vitest's `--shard` for the `cli` lane. It divides files, not tests inside one file.
- Loosening any elapsed-time assertion to move a file out of the serial group.

## 5. Open Questions

- What the per-file timings are after all five cuts. The profile behind the earlier ranking came from before the cuts.
- How long both suites take on the CI runner.
- Whether the `fanout-run` failures under load were the default worker count or the file itself. They have not been reproduced at 8 workers.

## 6. Convergence

| Lineage | Iterations | Last three new-information ratios | Stop reason |
|---|---|---|---|
| `luna-max` | 10 | 0.50, 0.75, 0.75 | Iteration cap |
| `deepseek-flash-max` | 10 | 0.90, 0.35, 0.25 | Iteration cap |

Neither lineage reached the 0.05 threshold. Luna was still finding new material. DeepSeek's last two iterations found little.
