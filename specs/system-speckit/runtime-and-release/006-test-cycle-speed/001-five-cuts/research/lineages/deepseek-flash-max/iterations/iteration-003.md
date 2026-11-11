# Iteration 3: Where the core lane's import time comes from, and whether it can be cut

## Focus

The packet names the spec-kit core lane's roughly 300 s of import time as its third open item and calls it "the largest share". Iteration 1 found that Vitest reports import as a sum over files rather than wall time. This iteration tested that against the lane's actual shape: how many files, how large their module graphs are, how many workers run them, and whether any per-file import cost could be on the critical path.

## Actions Taken

1. Read the core lane's Vitest config for include set, setup file, parallelism and any worker cap.
2. Confirmed Vitest's default worker count from its own CLI code and from `os.availableParallelism()` on this machine.
3. Walked the static import graph of every core test file, resolving relative, `@lib` and `@spec-kit/shared` specifiers, and recorded module count and source bytes per file.
4. Compared the packet's two published import figures against the file counts they were measured on.
5. Located the instruments Vitest already provides for a per-file and per-module split.

## Findings

1. The core lane is one project collecting 129 files with `fileParallelism: true` and no `maxWorkers` setting, so Vitest's default decides the pool size. That default is `os.availableParallelism()`, which is 18 on this machine. `[SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:26]` `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/cli-api.B0Pz1_R7.js:2355]` `[SOURCE: measured: os.availableParallelism() = 18]`
2. The static graph measurement across all 129 core test files totals 1087 module instances and 15.4 MB of TypeScript source: median 46 KB per file, and the largest is `graph-metadata-schema.vitest.ts` at 747 KB over 38 modules. No single test file imports an enormous graph, so the import cost is spread thin rather than concentrated in one outlier. `[SOURCE: measured: static import-graph walk over 129 files → 1087 modules, 15417 KB, median 46 KB]`
3. At 18 workers, a summed import figure of 302 s contributes about 17 s of wall time even if the work balanced perfectly. It therefore cannot be the largest share of a 348-399 s lane, which settles iteration 1's finding 8 in the concrete case: the metric measures total work, not elapsed time. `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2465]` `[SOURCE: measured: os.availableParallelism() = 18]`
4. The packet's two import numbers are not comparable with each other. `spec.md` records 338 s of import for 299 files, and the implementation summary records import "still 302 s" after cut 1 removed 173 of those files. Per file that is 1.1 s before the cut and 2.4 s after it, so at least one of the two is a different measurement rather than the same metric on a smaller set. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:49]` `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:71]`
5. The core lane's wall time is explained by a heavy tail, not by a sum: the packet's own profile names three files at 151 s, 85 s and 84 s. Those three alone exceed 300 s of work, and with 18 workers they can land on one worker in sequence, which is enough to set a 348-399 s lane. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59]`
6. The config already carries the instrument for a per-file answer: Vitest's `experimental.importDurations` prints a per-module import breakdown, and `--reporter=json` reports per-file collect and test durations, so the split can be obtained in one run with no code change. `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2490]` `[SOURCE: .skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/coverage.DM_a_rWm.js:550]`

## Ruled Out

- **Cutting import time as a wall-clock lever.** At 18 workers the summed figure is a small fraction of the lane's wall; the critical path is the heavy tail. `[SOURCE: measured: os.availableParallelism() = 18]`
- **Blaming one pathological import graph.** The largest graph is 747 KB over 38 modules, and the median file is 46 KB, so there is no outlier to fix.
- **Raising `maxWorkers`.** It is already unbounded and resolves to the core count; raising it past 18 would oversubscribe a machine that also runs child processes.
- **Turning on `isolate: false` to make imports free.** It would cut the summed import figure but share module state across 129 files, which trades a measured metric for unmeasured flakiness and changes what each test proves.

## Dead Ends

- No per-file timing exists for the core lane in the packet, so finding 5 rests on the pre-cut profile's three numbers plus worker arithmetic rather than a current measurement.

## Edge Cases

- Ambiguous input: "the 300 s import time" was read as the summed figure Vitest prints in its summary line, not as a serial phase. Finding 3 is the resolution.
- Contradictory evidence: the packet's 338 s and 302 s figures disagree once divided by their file counts. Both are preserved with their sources in finding 4; the question is treated as answered on the mechanism, not on which number is right.
- Missing dependencies: no per-file timing data for the current 129-file run.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:26`
- `.skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/cli-api.B0Pz1_R7.js:2355`
- `.skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2465`
- `.skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/index.UpGiHP7g.js:2490`
- `.skilled/skills/system-spec-kit/node_modules/vitest/dist/chunks/coverage.DM_a_rWm.js:550`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:49`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:59`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:71`
- measured: static import-graph walk over 129 core test files → 1087 module instances, 15 417 KB, median 46 KB, max 747 KB / 38 modules
- measured: `os.availableParallelism()` = 18

## Assessment

- New information ratio: 0.92
- Questions addressed: Q3 (where the core lane's import time comes from and which parts can be cut)
- Questions answered: Q3

## Reflection

- What worked and why: dividing a summed metric by the worker count is what turned "import is the largest share" into a small wall-clock contribution. The same arithmetic pointed at the three named heavy files as the real floor.
- What did not work and why: the static walk can size graphs but cannot time module evaluation, so finding 2 bounds the transform work without measuring it.
- What I would do differently: enable `experimental.importDurations` in a scratch run before writing any cut for this lane, because one instrumented run would replace findings 2 and 5 with measurements.

## Recommended Next Focus

The heavy tail is now the strongest lead in the core lane, and the same shape appeared in the deep-loop suite. Before proposing a scheduler change, confirm which files hold the tail with `--reporter=json`. Then take Q4, the ledger read-caching question, because it is the only remaining item that changes production code and therefore needs the clearest risk statement.

## Questions Answered

- Where do the roughly 300 s of import time in the spec-kit core lane come from, and which parts can be cut?

## Questions Remaining

- 3 of 5 key questions remain open.
