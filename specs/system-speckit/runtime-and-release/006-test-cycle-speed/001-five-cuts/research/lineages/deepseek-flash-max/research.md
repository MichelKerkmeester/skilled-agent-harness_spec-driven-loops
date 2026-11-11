# Research: Faster Skilled test cycle after the five cuts

**Run**: `deepseek-flash-max` fan-out lineage · 10 iterations · maxIterations reached
**Packet**: `specs/system-speckit/runtime-and-release/005-test-cycle-speed`
**Baselines** (the packet's own measurements, 18-core Mac): deep-loop suite 504-511 s · spec-kit `npm test` 841-911 s (core lane 348-399 s, cli lane 397-430 s, validation about 90 s).

---

## 1. The short answer

Two cuts survive, both structural, neither touching an assertion:

| # | Cut | File | Estimated saving | Confidence |
|---|-----|------|------------------|------------|
| A | Move `fanout-run` and `postflip-fanout` into the parallel project, and split `fanout-run` four ways | `system-deep-loop/runtime/vitest.config.ts` + `tests/unit/fanout-run.vitest.ts` | deep-loop 504-511 s → about 350-360 s (about 150 s) | estimate over measured baselines |
| B | Split `upgrade-legacy.vitest.ts` into four shards, each with its own sandbox, behind a shared harness helper | `system-spec-kit/runtime/cli/tests/` + `run-cli-tests.sh` + `spec-kit-check.yml` | cli lane about 400 s → about 100-140 s (about 270 s) | estimate over measured baselines |

Two open items from the packet are closed as **not levers**: the core lane's "300 s of import time" is a summed metric, not wall time (section 3.3), and the ledger read-caching idea is already built, tested, and enabled where it helps (section 3.4).

---

## 2. What the evidence says about the shape of the problem

### 2.1 The suite times are not set by sums; they are set by critical paths

Vitest's summary prints `Duration <wall> (transform, setup, import, tests, environment)`, and only the wall is elapsed time. `import` is `sum(files, file => file.collectDuration)` — a total across every test file, computed in parallel across workers. `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2465]` `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2474]`

At 18 workers, 302 s of summed import is about 17 s of wall. It cannot be the largest share of a 348-399 s lane. `[SOURCE: measured: os.availableParallelism() = 18]`

### 2.2 The heavy tail, not the average, sets each lane

The packet's own profile names three core-lane files at 151 s, 85 s and 84 s. Three files that size can land on one worker in sequence and set a 348-399 s lane on their own. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59]`

The deep-loop suite has the same shape from the other direction: a 265 s serial group of twelve files runs on one worker after the parallel group finishes.

### 2.3 Process chains dominate the two slowest files

`upgrade-legacy.vitest.ts` makes 105 process-shaped calls across 65 tests, and each call is a chain: `node upgrade-legacy.mjs` → `bash validate.sh` per packet → two node processes per validation. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:951]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:405]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:421]`

Bare process startup is not the cost (node 0.020 s, bash and git under 0.005 s); the cost is each child's module load plus its work.

---

## 3. The four open items, resolved

### 3.1 The cli lane's `upgrade-legacy` file — **Cut B**

The cost is spread, not concentrated: 65 tests, 105 process calls, the ten heaviest at 36% of them, nine tests with none. `[SOURCE: measured: per-test call count → 65 tests, 105 calls, top-10 share 36%]`

The second component is the sandbox reset, paid 58 times: `git reset --hard` over a 3115-file repository, six path removals, and a `utimesSync` pass over 734 `dist` files. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:132]`

Because both components scale with the test count, sharding divides both. 58 of the 65 tests are provably order-independent (three of five describes call `afterEach(resetSandbox)`); the seven that are not stay together in one shard. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:231]`

**Change surface**: four live lines name the file — `run-cli-tests.sh` lines 7 and 9 (run and exclude) and `spec-kit-check.yml` lines 153 and 155. The exclude must become a glob that matches the shards, and the run step must keep naming exact paths so a rename still fails loudly. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:9]` `[SOURCE: .github/workflows/spec-kit-check.yml:153]`

**Not a lever**: Vitest's native `--shard` distributes files, not tests, so it cannot divide one file. The repo's `test:sharded` runner also runs its shards serially on purpose because concurrent shards contend for shared temp roots and databases. `[SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:9]`

### 3.2 The twelve serial deep-loop files — **Cut A**

The twelve are six real surfaces: seven are 7-line wrappers around `defineAdapterStressSuite`. Only four carry a load-sensitive upper bound on a child process, and those are the ones whose serial placement a timing assertion justifies: `cli-codex` at 1000 ms, `stress/fanout` at 12 000 ms, `lineage-timestamp-window` at 60 000 ms, and `db-open-close`'s 1000 ms lock wait. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:112]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:31]`

`fanout-run.vitest.ts` has **no elapsed upper-bound assertion**: its timing assertions are string ordering, lower bounds (`completedSlotMs >= 4_200`), and a 5000 ms poll cap. Lower bounds cannot fail under load. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:5112]`

It is also the suite's largest block at 157 s, and it is divisible: 44 describes, one `afterEach`, no shared fixture, no `require.cache` manipulation, no global stubbing. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:519]`

Moving it in does not stretch the parallel group: that group's wall is about 239-246 s (504-511 minus 265), larger than the 157 s block, and four-way split each piece is about 40 s.

**Keep serial**: `db-open-close` (its purpose is a lock race), `lineage-timestamp-window` (60 s child bound), `cli-codex` and `stress/fanout` (1 s and 12 s child bounds).

### 3.3 The core lane's import time — **not a lever**

The core lane is 129 files on 18 workers with no `maxWorkers` cap. Their static import graphs total 1087 module instances and 15.4 MB, median 46 KB per file, max 747 KB over 38 modules — no outlier to fix. `[SOURCE: measured: static import-graph walk over 129 files → 1087 modules, 15 417 KB, median 46 KB]`

At 18 workers, 302 s summed is about 17 s of wall. The lane's wall is the heavy tail (section 2.2).

The packet's two import numbers are also not comparable: 338 s for 299 files and 302 s for 126 files is 1.1 s and 2.4 s per file, so at least one is a different measurement. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:49]` `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:71]`

**Do not** turn on `isolate: false` to cut the sum: it shares module state across 129 files and trades a summed metric for unmeasured flakiness.

### 3.4 Ledger read caching — **already built, and not a lever**

`singleWriterReadCache` exists, is opt-in, memoizes one verified scan per process, and is nulled on every append. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:389]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]`

The gateway never enables it, and enabling it there would not help: one invocation is one process doing one append, and the append is what invalidates the memo. It is already enabled where it pays (`fanout-effect-dispatch.ts:420`) and already tested (`ledger-read-cache.vitest.ts`). `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:420]`

The real per-append cost is elsewhere: `append-mode-event.cjs` is a TSX bootstrap that re-executes itself as a child with `--import tsx` and loads a 79-module, 1.09 MB TypeScript graph, with no `dist/` to fall back on. `[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:15]` `[SOURCE: measured: import-graph walk → 79 modules, 77 .ts files, 1089 KB]`

### 3.5 A smaller CI runner

Both suites run on `ubuntu-latest` (51- and 34-minute job timeouts, no shard matrix). `[SOURCE: .github/workflows/spec-kit-check.yml:98]` `[SOURCE: .github/workflows/deep-loop-runtime.yml:45]`

Ranking for a small runner: (1) shrink the serial group, which is core-count independent; (2) split heavy files, which shortens every runner's critical path; (3) cut summed import work, worth about 17 s at 18 cores; (4) ledger caching, nothing.

The core lane's parallel efficiency is poor — about 1.3-1.4×, possibly near 1.0× — so a four-core runner would cost about the same wall, not more. `[INFERENCE: 302 s summed import plus test time against a 348-399 s wall]`

---

## Eliminated Alternatives

- **Cutting node startup.** Measured at 0.020 s per start; 74 spawns are about 1.5 s.
- **Shrinking the upgrade-legacy sandbox copy.** 35.8 MB of 3115 files, paid once.
- **Removing upgrade-legacy's second validation pass.** It is the proof that a repair worked.
- **Merging `validate.sh`'s freshness check into the orchestrator.** Saves about 20 ms and weakens a fail-closed guard.
- **Cutting individual heavy tests in upgrade-legacy.** The top ten are 36% of the calls.
- **`describe.concurrent` inside a shared-sandbox file.** The shared baseline would become the assertion.
- **Native `--shard` for the cli lane.** Shards by file, cannot divide one file.
- **Raising `maxWorkers`.** Already unbounded at the core count.
- **`isolate: false` for the core lane.** Trades a summed metric for unmeasured flakiness.
- **Enabling or extending the ledger read cache.** Nulled on append; extending it risks stale heads.
- **A CI shard matrix as the first move.** Both jobs fit their timeouts.

## Divergence Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated: none. The run never re-entered a direction after ruling it out.
- Remaining frontier: the per-file timing baseline, which no iteration could take inside this lineage's write surface.

---

## 4. How each cut must be proven

Every estimate here is arithmetic over the packet's measured baselines. The gate is a run, not another pass.

1. **Baseline first**: run each suite once with `--reporter=json` on a quiet machine and keep the per-file durations.
2. **Count guard**: record `vitest list` counts before and after. The packet's own cut 1 used this (302 files → 129).
3. **Repeat the run** after the cut with the same command, same machine, no other load.
4. **Reject the cut** if the wall does not fall by at least 10%, if any file or test count changes, or if a timing-sensitive test fails once under load. The packet's three deep-loop runs spread by 7 s (about 1.4%), so a single pair cannot separate a saving from noise.
5. **Small-runner check**: repeat with `--maxWorkers=4`. A saving that only exists at 18 workers does not help the machine that gates merges.

Failure handling per cut:

- **Cut A** failing under load means a timing test broke. Raise the poll cap or return that one test to the serial project. Never loosen an elapsed assertion.
- **Cut B** failing its count guard usually means the `--exclude` line still names the old file and the shards ran twice. Check both processes' counts.

---

## 5. Open Questions

1. The per-file timing baseline for both suites — the one input every estimate lacks. Take it with `--reporter=json`; `experimental.importDurations` also prints a per-module breakdown if the import figure ever needs to be explained again.
2. Whether `fanout-run`'s four-way split is balanced by seconds rather than by test counts. The 18-test `max-iterations` block may be cheap and the 8-test adapter blocks expensive.
3. Whether the core lane's three heavy files (151 s, 85 s, 84 s) are still the heavy files after cuts 4 and 5. The numbers come from the pre-cut profile.
4. The `ubuntu-latest` wall for both suites. No CI timing history is checked in; the four-worker proxy is the only estimate available here.

## 6. References

- Packet: `spec.md`, `plan.md`, `implementation-summary.md`, `tasks.md`
- Iterations: `iterations/iteration-001.md` … `iteration-010.md`; deltas in `deltas/`
- Registry: `findings-registry.json`; dashboard: `deep-research-dashboard.md`
- Configs: `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`, `.skilled/skills/system-spec-kit/vitest.config.ts`, `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`
- Runners: `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs`, `run-cli-tests.sh`, `run-tests-sharded.mjs`
- Workflows: `.github/workflows/spec-kit-check.yml`, `.github/workflows/deep-loop-runtime.yml`
- `resource-map.md` is not present in this packet; no map citation is claimed.

---

## Appendix: Convergence Report

- Stop reason: maxIterationsReached (10 of 10)
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0 of the five key questions; 4 follow-ups recorded in section 5
- newInfoRatio trend: 0.93, 0.86, 0.92, 0.95, 0.92, 0.88, 0.90, 0.90, 0.35, 0.25
- Convergence threshold: 0.05 (not reached; the loop ended on the iteration cap)
- Quality notes: every finding carries a `[SOURCE: …]` or `[INFERENCE: …]` marker; three findings that rest on arithmetic are labelled as estimates and paired with the measurement that would settle them.
