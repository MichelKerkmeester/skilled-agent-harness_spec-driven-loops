# Trusting a result

Coverage is useful only when the test command still behaves normally and the
report distinguishes what was covered from what could not be measured.
Supercov is designed to fail clearly rather than turn uncertainty into a clean
percentage.

## Review a test written by an agent

Before merging, check three things:

1. **The complete wrapped test command passes.** A focused test command is useful
   during iteration, but it is not the final gate.
2. **The diff shows the expected gain.** Look for unexplained coverage losses or
   a changed source boundary.
3. **The test protects behavior.** It should make a meaningful assertion without
   weakening existing assertions or changing application code for the metric.

```sh supercov
npx supercov diff <baseline-run> <new-run>
npx supercov runs <new-run> test "new test name"
```

Keep the compared run ids in the pull request or agent summary when the result
needs to be reviewed later.

## Read the status honestly

Supercov separates four states:

- **covered** — the obligation was measured and observed;
- **uncovered** — it was measured but not observed, so a test may close it;
- **measurement limit** — Supercov could not establish a complete boundary;
- **stale** — the run is valid history but no longer describes the current
  workspace.

```sh supercov
npx supercov runs latest
npx supercov runs latest scope
npx supercov runs latest gaps
```

Do not treat a measurement limit as a test-writing task. Read its reason, fix
source scope or configuration when possible, and otherwise report the boundary.

## How Supercov avoids false confidence

- The coverage denominator is derived before the suite runs, so adding tests
  cannot silently redefine 100%.
- Instrumentation runs in an isolated copy instead of rewriting your source.
- Evidence is attributed to a test only when the runner exposes a reliable
  identity; everything else remains aggregate or background evidence.
- Completed runs are immutable and checked against the current workspace.
- Missing, corrupt, contradictory, or unsupported evidence is surfaced as a
  limitation instead of being guessed or discarded.

## What happens when code cannot be measured safely

Some code observes its own source text, creates source dynamically, or executes
behind a launcher Supercov cannot see. Forcing ordinary instrumentation through
those boundaries could change behavior or invent a denominator.

Supercov leaves the affected behavior uninstrumented and reports the location
and reason. Likewise, coverage from a runner without exact test identity stays
aggregate instead of being assigned to whichever test happened to be nearby.

## How releases are checked

Release checks cover program behavior before and after instrumentation, line and
branch results, decision vectors and MC/DC, supported JavaScript, TypeScript,
Rust, Python, and Ruby runner contracts, Chromium, Firefox, and WebKit
execution, clean installation, interrupted-run recovery, and isolated
publication.

JavaScript behavior is exercised against a pinned TC39 Test262 corpus. MC/DC
cases are also compared with an independent LLVM implementation so a
self-consistent calculation error does not pass unnoticed. Python and Ruby
gates run real suites through their supported runners and assert the resulting
coverage totals, test identity, and measurement limits.

Rust numbers are also checked against an independent LLVM line-coverage
oracle over real crates. `npm run oracle:rust` runs the same tests plain, under
the oracle, and under Supercov on twenty-six crates from bytes to tokio,
compares line coverage file by file, and fails if Supercov ran any suite
differently from plain Cargo. The two tools count differently — the oracle
counts every executable region after monomorphisation, Supercov the lines its
own obligations sit on — so the per-file comparison is read by a person: a file
at 0% in one and 70% in the other means lost evidence or a wrong denominator,
and this check found five such defects before 0.0.42. It runs locally and
costs no hosted minutes; `scripts/rust-coverage-oracle.mjs` documents what
each flag means.

These checks reduce risk; they do not replace reviewing the assertions and
behavior protected by a new test.

See [Runs and evidence](evidence.md) for immutable run ids, comparisons, and
retention.
