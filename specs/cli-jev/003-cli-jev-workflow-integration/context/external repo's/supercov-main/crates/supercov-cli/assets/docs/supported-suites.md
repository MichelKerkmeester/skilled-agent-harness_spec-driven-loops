# Supported languages and test suites

Supercov supports JavaScript, TypeScript, Rust, Python, Ruby, Go, Java, and Kotlin today. Start with
the same test command the repository already uses; Supercov detects supported
runners inside that command.

```sh
npx supercov -- npm test
npx supercov -- npx playwright test
npx supercov -- cargo test
npx supercov -- pytest
npx supercov -- rspec
npx supercov -- go test ./...
npx supercov -- mvn test
```

## Language support

| Language | Status | Start with |
| --- | --- | --- |
| JavaScript | Available | `npx supercov -- npm test` |
| TypeScript | Available | `npx supercov -- npm test` |
| Rust | Available | `npx supercov -- cargo test` |
| Python | Available | `npx supercov -- pytest` |
| Ruby | Available | `npx supercov -- rspec` |
| Go | Available | `npx supercov -- go test ./...` |
| Java | Available | `npx supercov -- mvn test` |
| Kotlin | Available | `npx supercov -- ./gradlew test` |
| Zig | Coming soon | — |
| PHP | Coming soon | — |
| C | Coming soon | — |

The npm-distributed CLI requires Node.js 22 or newer for every language.

## What exact and aggregate mean

**Exact attribution** means Supercov knows which test, attempt, retry, and
runner produced the coverage. Queries such as `test`, `passed`, and `failed`
can use that identity.

**Aggregate coverage** means Supercov knows the source executed but cannot
truthfully assign it to one test. Whole-run `gaps` and `file` queries still
work; per-test questions are limited.

Supercov reports the level it actually observed. It does not guess.

## JavaScript and TypeScript

| Runner | Attribution |
| --- | --- |
| Playwright | Exact per test, worker, retry, outcome, action, and assertion phase |
| Vitest | Exact per test, with setup execution kept separate; Browser Mode included |
| Jest | Exact per test, including parameterized tests, with the user's own configuration, setup files and reporters kept; passing `expect` occurrences are identified for assertion maps |
| `node:test` | Exact per test |
| AVA and Mocha | Aggregate structural coverage |
| Other Node-based runners | Aggregate when their processes remain visible to Supercov |
| Browser component runners without an adapter | Aggregate structural coverage |

One command may launch several runners. Supercov combines their evidence into
one run and preserves runner identity wherever the runner exposes it.

### Vitest Browser Mode

Vitest Browser Mode runs the test file in a real browser. Supercov measures it
per test like any other Vitest run: lines, branches, MC/DC and assertion
coverage. Combined Node/browser projects are configured after Vitest resolves
inline definitions, config-file references, globs and project selection.
Evidence travels over Vitest's own browser command channel; the compatibility
suite exercises Chromium through the Playwright provider.

Component code is instrumented the same way as any other source, with one
addition that matters most here. A JSX tree is a single statement, so an
expression rendered inside it -- `aria-label={label(state)}`, a child
`{formatted(value)}` -- is measured on its own rather than counted as covered
because the component rendered once. This is also what lets a UI assertion be
explained precisely: `toHaveAccessibleName` names the attribute and
`toHaveTextContent` names the child, and each is credited separately.

Expressions that cannot independently fail to evaluate do not become
obligations. `{value}` is reached exactly when the tree is, and
`onClick={() => save()}` is measured where the handler is called rather than
where it is created.

`expect.element(...)`, `expect.soft(...)` and `expect.poll(...)` are recognised
as assertions, so their passing occurrences are available to assertion maps.

### React and React Native

React components can use Testing Library with Vitest/jsdom, Vitest Browser Mode,
or Babel/Jest. React Native and Expo component tests run through their existing
Jest presets, including native mocks. This is JavaScript component-test coverage:
it does not measure Hermes, native modules, simulator/device execution, Detox or
Maestro. React SSR hydration is exercised in jsdom and Chromium; this does not
establish Next.js Server Components, streaming SSR or server actions.

An assertion map can explain which displayed value, accessible name, disabled
state or error message a test checks. JSX expression coverage and a passing
assertion are evidence for reviewing that explanation, not automatic semantic
proof. A button being rendered does not establish that its disabled state was
checked. Keep your existing runner and matchers.

The [React verification example](https://github.com/supercorp-ai/supercov/tree/main/examples/react-verification)
shows a fully executed checkout whose weak tests accept four UI regressions,
then adds four precise assertions and independently checks the broken copies.
The agent-authored maps credit only those four UI expressions.

### Builds and source formats

JavaScript and TypeScript projects may use Vite, Next, Turbopack, Webpack,
esbuild, SWC, `tsc`, or no build step. ESM, CommonJS, JavaScript, JSX,
TypeScript, and TSX are supported.

Supercov instruments an isolated copy. It does not ask you to add an import,
reporter, plugin, or alternate build output.

If tests import compiled output such as `dist/` or launch a script that uses it,
Supercov runs the project's build inside the isolated copy before testing.
Keep using your normal test and build commands. Instrumentation does not
require changing the project's TypeScript settings.

For assertion maps, Node, Vitest, Jest and Playwright's Node-side assertions
supply supported passing-occurrence evidence. Custom assertion wrappers and
browser-side checks can have additional observation limits. See
[Assertion evidence](assertion-evidence.md) before interpreting a missing occurrence.

### Browsers, servers, and child processes

Playwright support includes Chromium, Firefox, and WebKit, along with pages,
frames, popups, workers, request contexts, WebSockets, and test-launched child
processes where the runner exposes their identity.

Browsers a suite launches itself are covered too. A fixture that calls
`chromium.launchPersistentContext`, or `launch`/`connect` and hands out its own
contexts and pages in place of Playwright's `page` fixture, is adopted by each
test's collector: its pages are read before the fixture closes them, and a
context kept for the whole worker follows the current test's identity. Actions
on such pages are not recorded as separate phases, so their evidence is
attributed to the test and its assertions rather than to individual clicks.

Node child processes inherit coverage automatically. Long-running servers get
a short drain window after the test command finishes so buffered evidence can
arrive. Work without a reliable test identity is kept as background coverage
instead of being assigned to an arbitrary test.

A child a test stops in teardown keeps the coverage it produced. Buffered
evidence is written when a terminating signal arrives—`SIGTERM`, `SIGINT`,
`SIGHUP`—not only when the process exits on its own, so killing a gateway
after the request it served does not lose the request. The program's own
signal handling is untouched: a process with no handler still dies from the
signal exactly as it would unmeasured, and one with its own handler keeps
it. `SIGKILL` cannot be caught by anything and is the one stop that loses
whatever was still buffered.

## Rust

| Runner | Attribution | Current requirement |
| --- | --- | --- |
| Cargo's standard libtest runner | Exact test, attempt, and passing-assertion identity | Rust 1.95; run with `npx supercov -- cargo test` |
| rustdoc doctests | Exact doctest identity; every doctest runs in a process of its own | Rust 1.95; part of `npx supercov -- cargo test` |
| cargo-nextest | Exact test, attempt, retry, and binary identity | cargo-nextest 0.9.138 or 0.9.140 |

Supercov preserves Cargo's test selection, scheduling, fail-fast behavior,
environment and exit status. Doctests run with their own identities; nextest
retries remain separate attempts.

Measured source follows the modules rustc compiles, including `#[path]` and
literal `include!` calls. Undeclared `.rs` files are not treated as application
modules. Statements, functions, branches, boolean decisions, loops and error
propagation are measured. Const contexts and macro expansions remain visible
with explicit measurement limitations.

Use the repository's normal flags after the wrapped command:

```sh
npx supercov -- cargo test --workspace
npx supercov -- cargo nextest run --workspace
```

`cross` is not supported yet. Unsupported command shapes fail with an
explanation instead of silently falling back to plausible but inaccurate
attribution.

## Python

| Runner | Attribution | Current requirement |
| --- | --- | --- |
| pytest | Exact test, worker, retry, and setup/call/teardown phase identity | CPython 3.9 or newer; run with `npx supercov -- pytest` or `python -m pytest` |
| pytest-xdist | Exact per worker | Workers inherit the run through the environment |
| pytest-rerunfailures | Exact per attempt; flaky tests are reported as such | |
| `python -m unittest` | Exact test and setUp/test/tearDown phase identity | Serial in-process; skips and expected failures are recorded; subtest failures roll up to the parent test |

Your project runs in place with its own interpreter and virtual environment.
Supercov adds its runner hooks through the process environment and places a
probe for every obligation into each measured module as it is imported --
nothing on disk changes, and tracebacks keep their line numbers. You do not
need to rewrite tests or configure a different build.

Coverage includes statements, functions, boolean decisions, loops,
comprehensions, short-circuit operators, `match` cases and exception paths.
Child interpreters, threads and thread pools can retain the calling test's
identity. The report also distinguishes execution before a passing assertion
from later execution. These phase records alone do not prove which values the
assertion checks.

Interpreters launched with `-I`, `-E` or `-S` ignore the required startup hook
and are not measured. Code compiled from strings at runtime has no source
obligations. A measured module imported before Supercov starts, or compiled
past the import system, runs without probes; the run names it as a limitation
rather than reporting it uncovered. What a test executed survives the process
being killed -- `os._exit`, SIGTERM or SIGKILL -- but a corrupt or exhausted
evidence channel fails the run rather than reporting partial data as complete.

```sh
npx supercov -- pytest
npx supercov -- python -m pytest -n 4
npx supercov -- uv run pytest
npx supercov -- python -m unittest
```

## Ruby

| Runner | Attribution | Current requirement |
| --- | --- | --- |
| RSpec | Exact example and before/example/after phase identity | Ruby 3.4 or newer for full measurement; run with `npx supercov -- rspec` or `bundle exec rspec` |
| Minitest (including Minitest::Spec and ActiveSupport::TestCase) | Exact test and setup/test/teardown identity; a test's coverage is a lower bound (see below); skips recorded | `ruby -Itest ...`, `rake test`, `rails test` |
| test-unit | Exact test and setup/test/teardown identity; omissions and pendings recorded | `ruby -Itest ...`, `rake test` |
| parallel_tests, Rails process workers | Exact per worker process | Workers inherit the run through `RUBYOPT`; verified on a Rails app with bootsnap, Zeitwerk and two forked workers |
| Thread-parallel Minitest (`parallelize_me!`, `parallelize(with: :threads)`) | Probe observations exact per test; line, method and simple-branch observations made while phases overlapped go to the run, declared | |
| Cucumber | Exact scenario identity (`features/x.feature:LINE`), hook steps as setup/teardown | `cucumber`, `bundle exec cucumber` |

Ruby reports a line the first time it executes and never again, which is what
makes collecting coverage cheap enough to leave on. So a test is credited with
the lines it was first to reach, and a later test running the same lines is
credited with none of them: what a test is credited with is really its own, and
what it is not credited with is not evidence it did not run the code.

Totals are unaffected — every line is credited to exactly one test. What this
changes is per-test reporting: `npx supercov runs <id> test <name>` gives its
numbers as "at least", and `tests affected` reports a test whose own record
cannot settle the question as **undetermined** rather than unaffected, so
`--names` includes it in the set to run.

Your project runs in place with its own interpreter and bundle. Supercov loads
through `RUBYOPT`; application files on disk and their backtrace line numbers
stay unchanged. RSpec, Minitest and test-unit assertions can identify execution
before a passing assertion. That timing evidence alone does not show which
values the assertion checks.

Ruby 3.4 and newer support statement, method, branch and MC/DC measurement,
including loops, iterator blocks, short-circuit operators, pattern matching,
optional calls and exception paths. Ruby 3.3 supplies Ruby's own line, method
and branch coverage; obligations requiring additional instrumentation are
reported as measurement limits.

Some constructs have narrower coverage. Code in a non-main Ractor keeps line
coverage but may lack other observations. Certain nested-return expressions
limit normal-completion measurement. Constant predicates are folded as Ruby
folds them, so unreachable alternatives do not become obligations.

If a file cannot be instrumented safely, Supercov loads it unchanged and reports
the remaining limits. To apply that fallback to a known incompatible file, set
`SUPERCOV_RUBY_SKIP_PROBES` to a comma-separated list of path fragments. This
reduces measurement; it is not a way to claim that skipped obligations are covered.

A Spring preloader started before the run has no coverage hook. Restart it
within the measured command. JRuby and TruffleRuby are not supported.

Stop test-owned Ruby servers with `SIGTERM` or wait for normal exit so they can
report their evidence. `SIGKILL` and `exit!` can lose observations since the last
test boundary. A process that does not report leaves a measurement limit; its
missing evidence is not counted as uncovered application code.

```sh
npx supercov -- rspec
npx supercov -- bundle exec rspec
npx supercov -- ruby -Itest test/shapes_test.rb
npx supercov -- bin/rails test
```

## Crediting a test with what it reached

Most runners attribute exactly at no cost: Supercov runs each Rust test in its
own process, Python's workers are processes, and JavaScript keeps a coverage
map per test. Two cases cannot, because probes are a store into one array the
whole process shares and two tests running at once cannot both be credited
with what they reached:

| | Left as written | `--exact-attribution` |
| --- | --- | --- |
| A Go test calling `t.Parallel()` | counted run-wide | announced after it resumes, with `-parallel=1` |
| A JUnit suite with parallel execution enabled | counted run-wide | run in order |

```sh supercov
npx supercov --exact-attribution -- go test ./...
```

By default your command runs as you wrote it, and the run says what it could
not credit. `--exact-attribution` buys that back by running the suite in order,
which costs whatever its parallelism was worth — on sixteen I/O-bound JUnit
tests across fifteen cores, 3.6x. Either way the coverage totals are the same;
what changes is whether a line can be traced to the test that ran it.

`npx supercov runs latest` reports which you got, under `Attribution`.

## Go

| Runner | Attribution | Current requirement |
| --- | --- | --- |
| `go test` | Exact per test | Go 1.22 or newer |
| A test that calls `t.Parallel()` | Aggregate: its coverage counts run-wide | — |
| An `Example` with an `Output` comment, and a `Fuzz` target's seed corpus | Aggregate: measured, but named by no test | — |

Supercov instruments an isolated copy of the module and runs your own command
against it. Your tree is not touched, and your test sources are not rewritten
beyond one deferred line per test that binds it to its evidence.

`go test` builds one binary per package, so each test package records its own
evidence and Supercov merges them. It also caches packages that passed, and a
cached package does not run — so Supercov adds `-count=1` unless your command
already says otherwise, and tells you it did.

A test that calls `t.Parallel()` runs alongside others. Probes are a store into
one array shared by the process, so nothing can say which of two concurrent
tests reached a line. That coverage is reported against the run rather than
assigned to a test by guesswork: the lines count as covered, and no test claims
them. It counts only when the run passed, for the same reason a failing test's
coverage never counts — a failed run cannot say which of it came from the test
that failed.

An `Example` with an `Output` comment and a `Fuzz` target's seed corpus are
measured the same way: `go test` runs both, and what they reach is real
coverage no test can claim.

Such a test is still recorded as having run, with its outcome, and credited
with no coverage. `npx supercov runs <id> test <name>` says that rather than
reporting zeroes, coverage percentages leave it out, and `tests affected` lists
it as **undetermined**: nothing can say a change missed it, so `--names`
includes it in the set to run. A package where every test calls `t.Parallel()`
is published like any other.

A file Supercov cannot parse is a hole, not the end of the run. It is named on
the line that reports the result and recorded in the run, and a run is refused
only when nothing is left to measure.

Supercov also writes evidence as the suite runs, not only at the end. Go offers
no way to run code on `os.Exit`, and a `TestMain` need not reach the `m.Run()`
call Supercov wraps — `goleak.VerifyTestMain(m)` runs the suite and exits
itself. Without periodic writes such a run recorded nothing at all.

For assertion maps, `t.Error`, `t.Errorf`, `t.Fatal`, `t.Fatalf` and testify's
`assert` and `require` are inventoried. A Go test states its claim with an `if`
and reports the violation, so the report is the site.

A repository with several modules works either way it is laid out. A directory
with a `go.mod` of its own that no `go.work` names is a different module, and
`go test ./...` walks past it, so Supercov leaves it alone. A `go.work`
workspace has no module at its root, so each module it names gets a runtime of
its own.

```sh
npx supercov -- go test ./...
npx supercov -- go test -run TestParser ./internal/...
npx supercov -- go test ./core/... ./app/...
```

## Java and Kotlin

| Runner | Attribution | Current requirement |
| --- | --- | --- |
| JUnit 5 (Jupiter) | Exact per test | JDK 17 or newer, Maven or Gradle |
| JUnit 4 (through Vintage) | Exact per test | — |
| Kotest | Exact per test, under the names Kotest itself reports | — |
| Spock | Exact per feature, under the names Spock itself reports | — |
| TestNG | Exact per test, each data-provider invocation its own | — |
| JUnit 4 alone | Exact per test, through Vintage — see below | Maven |

Multi-module builds are measured module by module: each compiles its own source
set and forks its own JVM, so each gets a runtime and records evidence of its
own, and the run merges them. A build that forks several JVMs to run tests in
parallel — Gradle's `maxParallelForks`, surefire's `forkCount` — is measured
the same way: each JVM writes evidence of its own and the run merges every
one.

Attribution comes from the framework's own lifecycle rather than from rewritten
test sources: a JUnit Platform listener sees every engine built on the platform,
which is what covers Kotest and Spock, whose tests are not annotated methods any
rewriter could find. TestNG is not a platform engine and has a listener of its
own. Tests keep the names their framework chose, so a coverage report and a test
report name the same thing.

JUnit 4 on its own is not a platform engine and does not run on one. Maven and
Gradle choose a test provider from what is on the classpath, so putting the
platform there makes the build pick a provider that finds no engine and fail.
For a Maven module, Supercov adds `junit-vintage-engine` to the copy — the
platform's own way of running exactly those JUnit 4 tests through the lifecycle
it listens to — and measures them; your own build still runs JUnit 4 as it did.
A Gradle module is left alone and told about rather than broken.

Supercov instruments an isolated copy and leaves your build file alone. In the
copy it adds a test-scoped `junit-platform-launcher`, because the listener is
compiled from the project's test sources and neither Maven nor Gradle puts that
API on the compile classpath; it disables JUnit's parallel execution, keeping
whatever else your `junit-platform.properties` set; and it stops the copy
failing its build on warnings, because the copy holds instrumented code your
project never wrote a style policy for. Warnings are still reported.

If tests do run concurrently anyway, Supercov says so and stops attributing
rather than reporting numbers nobody can trust: statements and branches still
count run-wide, and condition coverage is dropped, because concurrent
evaluations corrupt the state it is computed from.

Some conditions are read by the compiler as well as evaluated at runtime, and
those Supercov leaves exactly as written. `x instanceof String s`, a record
deconstruction pattern, and Kotlin's `x is String` or `x != null` all narrow a
type for the code beneath them; wrapping such a condition to observe its
operands would take the narrowing away and the code would stop compiling. An
`if` is still measured — which way it went is recorded from inside its arms
instead — but it carries no condition vectors, so it contributes no MC/DC
obligation. A loop is a harder case: it has one arm, and no place to record an
exit a `break` would not also reach, so a loop whose condition narrows a type
carries no branch obligation at all rather than one no test could close. The
same goes for a loop over a constant, `while (true)`, which can only go one
way. A Kotlin `contract { }` has to stay the first statement of its function,
so the probe that records the function being entered is written after it.

Every one of these is named in the run: ask for `npx supercov runs latest
limitations` and each appears with its file, its line, and why it was left
alone. A source file the parser cannot read is declared there too, so a hole in
the denominator stays visible after the build log is gone.

For assertion maps, forms spelled `assertSomething`, `assertThat` or `fail` are
inventoried, which covers JUnit, TestNG, AssertJ, Hamcrest and kotlin.test.
Kotest's infix matchers are not.

```sh
npx supercov -- mvn test
npx supercov -- ./gradlew test
npx supercov -- ./mvnw verify
```

## Containers, VMs, and remote execution

Supercov can collect from supported processes launched through a container, VM,
or remote executor when it can see the launch boundary, carry the instrumented
workspace into that environment, and receive evidence back.

Mounted workspaces and local child-process launchers are the most direct path.
If an executor hides how code is launched or cannot return evidence, Supercov
reports the missing boundary rather than claiming unseen code was measured.

## If your runner is not listed

For a Node-based runner, try the complete command and inspect the result:

```sh
npx supercov -- npm test
npx supercov runs latest runners
npx supercov runs latest scope
```

Aggregate coverage may already be useful even without exact per-test identity.
If a supported runner appears incomplete, see [Troubleshooting](troubleshooting.md)
and include the exact command and runner output when opening an issue.
