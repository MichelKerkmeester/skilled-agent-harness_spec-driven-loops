# Speed and storage

A Supercov run includes your test command, an instrumented build, and evidence
publication. The first pass is usually the slowest; repeated passes can reuse
the isolated build when the relevant inputs have not changed.

## See where the time went

```sh supercov
npx supercov runs latest
```

The summary separates:

| Phase | What it includes |
| --- | --- |
| Initialization | Recovery, project discovery, and input checks |
| Workspace preparation | Refreshing the isolated project copy |
| Adapter setup | Preparing the runner integration |
| Instrumented build | Building measured source, or almost nothing on a cache hit |
| Test command | The wrapped command, including browser, VM, or remote latency |
| Evidence publication | Validating and storing the completed run |

The line Supercov prints when a run ends also reports publication: analysing
the evidence once for the stored query views, the summary and the assertion
map. That is why the first query after a run opens at once rather than
analysing the evidence itself.

The first `npx` invocation may also download the package. That download happens
before Supercov starts and is not coverage-engine overhead.

## Keep an agent loop fast

- Keep the isolated build cache between passes.
- Avoid changing dependencies, build configuration, or toolchains during the
  loop unless the test requires it.
- Query the stored run instead of rerunning merely to open another view.
- Write one related test at a time, then rerun.
- Use a focused test command while iterating when appropriate, but finish with
  the same complete command used for the baseline.

Supercov reuses an instrumented build only when source, dependencies,
configuration, toolchain, build mode, and instrumenter identity match. A
possible mismatch triggers a fresh build rather than risking stale coverage.

## Use focused runs carefully

A narrow test command can shorten the inner loop:

```sh supercov
npx supercov -- npx vitest run app/checkout/session.test.ts
```

That run has a narrower evidence set than the complete suite. Before reporting
success, rerun the repository's full command and compare against a full-suite
baseline.

## Measure overhead in your project

Compare the original and wrapped command under similar cache conditions:

```sh supercov
/usr/bin/time -p npm test
/usr/bin/time -p npx supercov -- npm test
```

Alternate the two commands several times and compare typical runs. Do not
compare a cold package, browser, build, or VM cache with a warm one. Supercov
never runs the test command a second time automatically because suites may write
data, call paid services, or be intentionally non-repeatable.

### Python subprocesses

Interpreter count matters as well as test count. Each child initializes the
Python runtime before executing user code, so a suite that launches thousands
of short-lived interpreters can have more overhead than a single-process suite
with the same number of tests. Tight child-startup deadlines can also expire
before the child produces its first output.

Supercov prepares the run's probe index once and lets later interpreters load
file and decision data as needed. The compiled-module cache is separate: it
avoids compiling unchanged measured source, while the prepared index avoids
repeatedly parsing and indexing the entire coverage plan.

Optional unittest and concurrency adapters install when their libraries are
imported, rather than importing those libraries into every helper process.
Libraries already loaded when measurement starts are patched immediately.

For development, `python3 scripts/python-startup-benchmark.py` measures cold
initialization and repeated child startup against a synthetic plan. Use
`--runtime /path/to/checkout/runtime/python` to compare implementations. This
isolates startup cost; it does not predict a complete suite's slowdown, which
also includes measured execution, concurrency and evidence publication.

For an end-to-end subprocess workload, build a release binary and run:

```sh
cargo build --release -p supercov
python3 scripts/python-subprocess-benchmark.py \
  --output /tmp/supercov-subprocess-benchmark \
  --children 1000 --tests 400 \
  --binary candidate="$PWD/target/release/supercov"
```

Use a new output directory for each experiment. The fixture defaults to 321
source files and saves plain/measured timings, CLI phase timings, child latency,
test outcomes and coverage summaries. Add another `--binary label=/path` to
compare builds; measured coverage and outcomes must agree. Vary `--calls` for
hot execution, `--statements` for plan size, `--decision-width` for wider MC/DC
regions, or `--workers` for concurrent children. `--mode noop` isolates helpers
that run no measured source; `--mode script` exercises native entry scripts and
allows the corrected unmeasured-file denominator to differ between versions.

## Understand disk usage

Each completed run stores compressed evidence and metadata under
`.supercov/runs/<run-id>/`. Query views are derived from that evidence rather
than stored as a full report for every filter.

The isolated workspace may be larger because it can contain an instrumented
build cache. Supercov does not delete history in the background.

```sh supercov
npx supercov runs clean --dry-run
npx supercov runs clean --keep 20
npx supercov runs clean
```

Use `--dry-run` to preview cleanup. Keep enough run history for active reviews
and automation; remove the cache only when reclaiming space matters more than a
faster next run.

## Keep assertion investigation fast

Save `assertions.json` and query the run to see the updated score. Supercov does
not rerun tests or call a model to calculate the report. Repeated queries reuse
the previous assessment while checking that your source still matches the run.
Editing the map automatically refreshes that assessment.

For large maps, ask for a short page instead of the whole graph. Within one
flow, `--view nodes` or `--view edges` pages the details; `--compact` omits repeated
source text while keeping locations and credit reasons. See
[Investigating assertion evidence](assertion-evidence.md#read-a-large-flow).

The disposable `assertions.report.cache.json` and `assertions.summary.cache.json`
files live beside the map. A missing or damaged cache is rebuilt. Removing it affects the next query's speed, not
your saved explanations.
