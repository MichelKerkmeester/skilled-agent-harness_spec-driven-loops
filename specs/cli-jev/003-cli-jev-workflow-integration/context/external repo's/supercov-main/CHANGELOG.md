# Changelog

## Unreleased

**Changed**

- `supercov security` reads what the code under review is: a `target/` directory is build output only when Cargo, Maven, Gradle, sbt or Leiningen owns it, minified and vendored JavaScript is left out, and JSON is read only when it configures something. On the 72 held-out RealVuln repositories F1 rises from 0.42 to 0.44, and one repository whose code sat in `target/` goes from no findings to 11 of its 21 labelled weaknesses. `security scope`, `--dry-run` and `patch` list the files a run reads.
- `quality` and `security` exit 0 for a report in which some files could not be assessed, and say how many on stderr; 2 means none could.
- Each Vitest, Jest and node:test test is recorded by appending to a journal instead of writing and syncing a file. A 63,740-test Vitest suite that did not finish in seven minutes now records in under two.
- Instrumenting a long JavaScript file takes time proportional to its length; a 16,000-line file takes under two seconds where 8,000 lines took over a minute and a half.
- Code a probe already recorded runs at close to its own speed: a repeat is one inline comparison, and a script's top-level code no longer records every repeat again. A million-iteration lru-cache loop took 177 s outside a test and 1.6 s inside one; it now takes 0.9 s and 0.8 s (0.06 s without Supercov), and minimatch's backtracking guard test passes its one-second limit.
- `assertions report` says whether the run needs attention whatever the filter, takes `--compact`, several `--file`s and `--id`, and a JavaScript build runs through the package manager that started the tests, or as `SUPERCOV_BUILD_COMMAND` names it.

**Fixed**

- A test that replaces `globalThis.Buffer`, as axios's `toFormData` tests do, no longer fails under Supercov: the runtime and the evidence journal keep the Buffer they loaded with.
- A Python script that tests both import and run as `python path/script.py` keeps the lines its imports ran: the direct run made the whole file unmeasured, and one project lost 43 files and six points of line coverage to it. The file is flagged as a lower bound, and a file only ever run directly is still left out. Reported by [@maik-intellicoach](https://github.com/maik-intellicoach). (#40)
- `python -m py_compile` in a measured test writes plain bytecode. (#40)
- A Python or Ruby command that fails before any test reports an outcome, such as pytest refusing an unknown option, is reported as that command's failure, not as a Supercov bug.
- A JavaScript file the project tells git to ignore, such as a generated bundle, is not counted as its source. Actual's 5 MB ignored bundle had made setup take over 30 minutes.
- Instrumenting a file with long non-ASCII lines takes time proportional to its length.
- A browser test that installs fake timers no longer holds its evidence back until it advances the clock.
- Linters, formatters and `tsc --noEmit` run by the test command read the project as written: ESLint, Prettier, standard, xo and the like see each file as its author wrote it and never see Supercov's `.supercov` directory. semver, js-yaml and picomatch failed their lint step on instrumented code.
- A TypeScript test compiled by `tsc --strict` keeps its type narrowing: an assertion runs in place instead of in a callback, so `if (prior !== undefined) assert.ok(prior < id)`, an array built in a loop, and an `asserts` signature typecheck as they do without Supercov (uuid failed its build with TS18048, TS7034 and TS7005).
- `util.promisify(execFile)` and `util.promisify(exec)` resolve `{ stdout, stderr }` under Supercov, and `exec` with options works; commander's CLI tests read `undefined`. A child given its own environment, as execa's `extendEnv: false` gives chalk's fixtures, no longer inherits the parent's.
- A command that runs the same Jest tests twice, as ms does in Node's environment and then the edge runtime's, opens: the second run's phases no longer repeat the first's, and a test fails if either run failed.
- A build that compiles instrumented sources to another directory and bundles them there, as lru-cache does with esbuild, finds the runtime.
- Sources bundled for a browser by karma, testem, airtap, zuul or mochify carry the runtime, so debug's karma suite runs, and the runtime parses as ES2019 for the bundlers that stop there.
- The test command sees a git repository of its own, with the project's HEAD, remotes and branches: npm's `template-oss-check` failed semver's posttest without one. A test's commits stay in it.
- tap's own coverage gate no longer fails a run under Supercov, whose probes it measured as uncovered branches; its report is unchanged.
- An install a tool makes inside the project, such as tap's plugins in `.tap/plugins`, is not half copied back: its manifest and lockfile stay behind with the dependencies that never flow back, and the tool installs them again.
- JSX in a `.js` file is measured instead of failing the run before any test.
- A run whose tests leave async work running into the next test opens: axios's ended with `Failed to open coverage index … unknown frontend phase reference`. A leftover no longer carries the ended test's phase, and runs recorded by 2.0.1 open too.
- Tests that pollute `Object.prototype`, as axios's prototype-pollution tests do, pass under Supercov as they do without it.
- An application served as plain `<script>` files is measured, and so are its classic and dedicated workers; a worker blocked in `Atomics.wait` no longer stalls the suite, and a test whose worker could not be read is reported as a lower bound.
- A TypeScript test typechecks under `tsc --strict` after instrumentation, and `@ts-expect-error` stays on the line it guards: test files are edited in place rather than reprinted.
- A TypeScript Playwright config in a CommonJS package keeps its settings.
- An assertion or node whose text repeats in its file keeps its explanation when a line is added above it, and a flow can watch the HTML or CSS a browser test renders.
- Benchmarks (`*.bench.ts`) are not counted as application source.
- A file larger than the model accepts is windowed or skipped with a reason, not sent and refused with HTTP 400.
- `supercov docs` prints commands the way you started Supercov: `npx supercov` from npm, the `go run` command from Go, and `supercov` from the PyPI, Ruby and Rust packages. Guides that wrote a bare `supercov …` no longer print a command a JavaScript project cannot run.
- The security guide quotes the 2.0.1 benchmark on 72 RealVuln repositories (F1 0.42, 10 seconds and about 5 cents a repository) with a link to every scanner's results.

## 2.0.1

**Added**

- A Supercov plugin for coding agents. The agent uses Supercov on its own when asked for tests, coverage, refactoring or a security scan, and runs the scan when `TYPESAFE_API_KEY` is set instead of asking again. It installs in Claude Code (`/plugin marketplace add supercorp-ai/supercov`), Codex (`codex plugin marketplace add supercorp-ai/supercov`) and Gemini CLI (`gemini extensions install https://github.com/supercorp-ai/supercov`). Cursor and GitHub Copilot read the same plugin, and `npx skills add supercorp-ai/supercov` adds the skills to other agents.
- Four commands in Claude Code and Gemini CLI: `/supercov:coverage` writes one test for untested code and reports coverage before and after, `/supercov:security` and `/supercov:quality` check the repository or a change, and `/supercov:review` checks a branch for what it introduced.
- The skills point agents at `supercov docs`, so they follow the installed version, and a check fails the build when a command they or the guides name stops existing.

**Fixed**

- `supercov security` without `TYPESAFE_API_KEY` says security needs the key, not quality.

## 2.0.0

**Breaking**

- `supercov clean` is removed. Use `supercov runs clean` for runs and `supercov quality clean` for assessments, with the same `--keep` and `--dry-run`. Cleaning runs never removes an assessment, which costs money and cannot be reproduced from the repository.
- Evidence written by 2.0.0 cannot be read by 1.x. 2.0.0 reads 1.x evidence.

**Added**

- `supercov security`: twelve security checks asked of every file with [Jev](https://typesafe.ai), from secrets and injection to mass assignment and weakened configuration, each mapped to its CWE classes. A file is clean or names what fired, with the line and code where the model confirms one. On fifteen held-out repositories of the RealVuln corpus it scores F1 0.47 (precision 54%, recall 41%) for about two cents a repository, where Semgrep scores 0.14; authorisation stays file-level. See [Security surface](docs/security.md).
- `security patch` reports what a change introduced, and `quality patch` asks the security checks too. `--run latest` shows which flagged files no test executes.
- `supercov report` writes one self-contained interactive HTML file from stored runs: whether a run passed and is still current, what changed since the run before, and which line, branch or MC/DC condition to test next. It opens without a server, network or Supercov, so it can be attached to a pull request. It carries assertion coverage and saved quality and security assessments on the same timeline. See [Portable HTML reports](docs/reports.md).
- `supercov quality` and `supercov security` can use Jev through another provider, such as OpenRouter, with the variables TypeSafe's SDKs read: `TYPESAFE_BASE_URL` and `TYPESAFE_DEFAULT_MODEL`. See [Use Jev through another provider](docs/quality.md#use-jev-through-another-provider). Contributed by [@untitaker](https://github.com/untitaker). (#47)
- A quality snapshot records which source it read: the run's source digest and a SHA-256 per file.

**Changed**

- Subprocess-heavy Python suites run several times faster. A child interpreter took about 930 ms to start under 1.2.0 and now takes about 17.6 ms, against 13.4 ms without Supercov: 7,107 tests starting 16,787 interpreters run in 309 s against 226 s. (#40)
- Python runs finish sooner: h11's 3,900 tests take 4.2 s against 2.3 s without Supercov, and its archive shrinks from 70 MB to 32 MB. Every measured obligation, vector and test is the same as before.
- Publication analyses a run once and writes the query index, assertion map and summary from that analysis, so the first query no longer analyses it again, in about a third of the memory.

**Fixed**

- A measured child process no longer changes what its test sees: descriptors, stderr, output, exit status and isolated, positional or bytes environments are what they are without Supercov. Reported by [@maik-intellicoach](https://github.com/maik-intellicoach). (#40)
- `runs latest files` and `runs latest file <path>` agree on a Python script that runs only as a child process. (#40)
- Instrumented bytecode no longer reaches ordinary Python caches. Discard caches 1.2.0 wrote; see [troubleshooting](docs/troubleshooting.md). (#40)
- `.supercov/` ignores itself in git. (#40)
- A suite mixing pytest and unittest publishes.
- A `match` statement without a catch-all case is measured instead of failing to compile.
- A process that outlives the test command, such as multiprocessing's resource tracker, no longer fails the run with `could not read Python evidence`.
- The timings line reports publication as its own phase, and its total is the command's wall time.

## 1.2.0

**Changed**

- Python suites run nearly four times faster under Supercov. On h11's 3,900 tests, pytest's own session takes 3.4 to 3.9 seconds where 1.1.1 took 12.8 to 14.1, against 2.0 to 2.3 without Supercov, on CPython 3.13 and 3.14 alike; the whole command takes 18 to 22 seconds rather than 32 to 36.
- Python is measured by probes compiled into each measured module as it is imported, replacing the `sys.monitoring` observer, which is removed rather than kept behind a switch. Nothing on disk changes, and tracebacks keep their line numbers.
- CPython 3.9, 3.10 and 3.11 are measured. 3.12 was the floor.
- Decisions the observer left out of the denominator without saying so are measured: on h11, 704 branches and 172 conditions rather than 692 and 160. A Python project's branch and condition totals can rise for that reason alone.
- A process that ends mid-test -- `os._exit`, SIGTERM, SIGKILL, a killed xdist worker -- keeps what it executed.
- Running under `-X no_debug_ranges` no longer removes lines from the measurement.

**Fixed**

- A Python suite using `pytest-subtests` published no result. Each subtest is reported under its test's `call` phase, so one phase arrived several times and the run was refused. A phase reported more than once is now one phase, and a failing subtest still fails its test. Thanks to [@maik-intellicoach](https://github.com/maik-intellicoach), whose 6,872-test run lost 2 hours 43 minutes to it. (#40)
- When Supercov itself fails a run, what the run measured is kept in `.supercov/failed-evidence/<run id>` and the failure names that path, instead of being deleted with the work directory. Reported by [@maik-intellicoach](https://github.com/maik-intellicoach). (#40)
- A thread started by a measured test is freed when it ends, rather than when the cycle collector next runs.
- A `match` case with an or-pattern whose first alternative fails is no longer also reported as not selected.
- Opening a run's index verifies its pages about five times faster on Arm macOS and Linux, where the CPU's SHA-256 instructions were going unused, and an index stores each list of tests once however many lines name it: a real 206 MB index came out a quarter smaller.

## 1.1.1

**Fixed**

- `SUPERCOV_SOURCE_ROOTS` narrows what is measured in every language. It was read on the JavaScript path alone while the reference described it without one, so a Python project that set it measured everything anyway: a vendored tree beside a flat layout came out at 660 files instead of about fifteen. If you already set it on a Python, Ruby, Go, Rust or JVM project, this release measures the roots you named and nothing else, and your numbers will change accordingly. A root is a directory or a single file, since a flat layout keeps its own modules at the root, and `supercov runs latest scope` lists what was kept and what was left out. (#35)
- Roots that name nothing to measure are refused, with the name quoted, rather than published as a run over zero files. (#35)
- A Python suite whose threads outlive its tests no longer ends with a `FileExistsError` from the collector. (#35)
- `supercov runs latest` costs what it shows rather than what it could show. A summary of a 300-file project took 21 seconds and 4 GB of memory, and 81 seconds where files are as long as generated bindings; it now takes 8 and 9 seconds. What it prints is unchanged. (#35)
- `go run github.com/supercorp-ai/supercov/cmd/supercov@latest` asks GitHub again when it answers with a gateway timeout, rate-limits the request or drops the connection, instead of ending the install outright. It says so while it waits.

## 1.1.0

**Added**

- `--exact-attribution` credits every test with what it reached, by running the suite in order: `-parallel=1` in Go, and JUnit's parallel execution turned off in the workspace copy. Without it a suite that runs its tests at once is measured as its author runs it, and what overlapped is recorded against the run rather than against a test.
- A measurement says how its tests were attributed, so coverage that belongs to no single test is visible rather than implied.

**Fixed**

- A Go package whose tests all call `t.Parallel()` published no run at all and exited 1. Probes are a store into one shared array, so what a test reaches while others run beside it cannot be credited to it — but the coverage is real and the package was fully measured. The run is published, and each parallel test is named, carries its real outcome, and is credited with nothing. (#30)
- Go 1.26's `new(value)` failed to parse, and a single unparseable file silently zeroed the whole measurement: 0 files measured, exit 0. The value form is read, and a file Supercov cannot parse is reported rather than taking the run down with it. (#31)
- A Ruby test's coverage is read as the lower bound it is. `Coverage.start(oneshot_lines: true)` reports a line once per process, so a line some earlier test reached first is missing from this one's record. It is marked partial rather than presented as the whole of what the test ran.
- Cleaning old runs kept the largest run IDs rather than the newest runs.

**Changed**

- `supercov` with no arguments lists the supported languages, each with its own install and start command.
- A source-discovery scope is reported in the language that was measured.

## 1.0.1

**Changed**

- `supercov` with no arguments names the product and leads with quality. Quality, coverage and assertions each get a section in the same shape, in that order, replacing the two paragraphs about passing a test command and the lone pointer to the assertion map schema.
- Getting started opens on a score, with a prompt to paste rather than a shell export, and the starter prompt everywhere is now `Measure code quality with npx supercov and show me the weakest files.`

## 1.0.0

**Added**

- `supercov quality` scores your code with [Jev](https://typesafe.ai). Twelve named properties are asked of each file as yes/no questions and Supercov does the arithmetic, so every part of a score is a claim you can check against the file. With no argument it assesses the repository you are in.
- `supercov quality patch` reports what a change introduced: the same properties asked differentially, plus six risk checks for a credential in source, untrusted input in a query, a change to who may do what, a test that now checks less, a schema migration, and debugging left behind. With no range it reviews uncommitted work, or your whole branch when the tree is clean. `--annotate github` prints workflow annotations and `--run <id>` marks findings in code no test exercises.
- `quality gaps`, `file`, `scope`, `snapshots`, `show` and `diff` read a saved assessment with no key and no network. `diff` reports what declined between two.
- Source files are found the way coverage finds them, across every supported language. `SUPERCOV_SOURCE_ROOTS` declares them explicitly.

## 0.0.55

**Fixed**

- Mixed Vitest Node and Browser Mode projects now get the correct runtime and browser evidence commands for each resolved project, including inherited configurations, project globs and project selection. Browser module-initialization coverage is preserved separately from per-test evidence.
- React Native and Expo JavaScript tests work with Babel-transformed runtime imports and Jest's jsdom setup. Expo's forwarding launcher preserves the original Jest configuration instead of recursively loading the generated configuration.
- Manifest-declared Jest setup files are excluded from application instrumentation, so injected bindings do not break hoisted mock factories. Duplicate test names remain distinct from retries, including parameterized cases and delayed retries.
- Jest captures per-test coverage after teardown, preserving React effect cleanup executed by Testing Library.

**Added**

- A runnable React example shows how displayed values, accessible names, disabled states and error messages can remain unchecked at 100% line coverage, and how targeted assertions catch four concrete regressions.
- Regression checks cover mixed Vitest projects, React hydration in jsdom and Chromium, and React Native/Expo component tests. Nightly checks run pinned Bulletproof React and Bluesky JavaScript suites with documented configuration and exclusions.

## 0.0.54

**Added**

- Vitest Browser Mode is measured per test, like any other Vitest run. A browser-mode project collected no tests at all: Supercov injected its node setup, which reaches `node:fs`, and Vite externalises that for the client, so the suite failed before a single test was collected. Browser mode now gets a setup that can run in a browser, and its evidence travels over Vitest's own browser command channel -- awaited as part of the test, with the test file taken from Vitest rather than from the browser realm, and working for every provider.
- An expression rendered inside JSX is measured on its own. A JSX tree is a single statement, so `aria-label={label(state)}` and a child `{formatted(value)}` were counted as covered the moment the component rendered once, even when the expression never evaluated. It is also the seam a UI assertion attaches to: with one statement for the whole tree, `toHaveAccessibleName` naming the attribute and `toHaveTextContent` naming the child could not be told apart, and neither could be credited. Only expressions that can independently fail to evaluate become obligations -- `{value}` is reached exactly when the tree is, and `onClick={() => save()}` is measured where the handler is called rather than where it is created.
- `expect.element(...)`, `expect.soft(...)` and `expect.poll(...)` are recognised as assertions. The chain root is a member call rather than a bare `expect`, which left every Vitest Browser Mode UI assertion without a passing occurrence and so unable to earn credit.

**Upgrading**

- A project with JSX gains obligations for the expressions rendered inside it, so its line and statement percentages move. Measured on three React codebases, the obligation count grew 2.3%, 5.5% and 9.5%; roughly four in five containers earn nothing. A project sitting at 100% may drop: the expressions it gains were being reported as covered without evidence that they ever evaluated.

## 0.0.53

**Fixed**

- An assertion inside a validator callback records its own passing occurrence. `assert.throws(fn, validator)` is the standard way to assert *what* an error says rather than only that one was thrown, so the inner assertions are the interesting ones -- and every nested assertion phase was skipped, leaving them with no passing occurrence and so unable to earn credit however carefully they were mapped. The same call seen twice, once through the module proxy, is still recorded once.
- A branch outcome is recorded when it happens rather than when control leaves the construct, so a `catch` or loop body that calls `process.exit()` no longer reports its outcome as never taken. The commit sat in the generated `finally`, which `process.exit()` skips; statement probes fire in place and survived, so the report contradicted itself -- crediting every line inside a catch while reporting the catch as unentered. On a project holding 100% the only way to make it agree was to delete a correct error path.

## 0.0.52

**Added**

- The map report says when a `watch` entry changes what a flow rests on. Naming a file that already holds the flow's nodes widens it to the whole file, so a neighbouring function's body is a review again -- sometimes what the author means, never something that should happen unsaid. Naming a file it already depends on whole, such as its own test, is redundant and reported.

**Changed**

- A change assessment's `affectedFlows` is the author's judgement -- the flows this change invalidates -- and no longer restates every known dependent. Only the flows it names lose their acknowledgement, so one explanation can answer for a change that touches no claim.

**Fixed**

- A `for...of` over an array that cannot be empty no longer carries a zero-iteration obligation no test could ever reach. It applies to a non-empty array literal, or a `const` bound to one that nothing else in the file can touch; a spread element does not count, since it may contribute nothing. Decided from syntax and symbol resolution alone -- a type can be asserted or optimistic, and an obligation dropped on a wrong answer is a branch that runs and is never reported again.
- A JavaScript or TypeScript comment containing `</script` no longer makes its file impossible to instrument. Code generators rewrite it inside comments so output cannot close an HTML `<script>` element early; the restore read the two spellings as different comments and, matching in source order, one it could not recognise consumed the rest. A comment that genuinely cannot be restored is now named, rather than reported as counts that are usually equal.
- A word in a test filename no longer overrides a runner that can only drive the whole system. A Playwright spec named `checkout-integration.spec.ts` was reported as an integration test, hiding browser evidence from E2E coverage. A directory still outranks the runner; among path tokens the most specific wins, so a spec under `tests/e2e/` is no longer read as integration.
- A change in the assertions view no longer grows with the project, so none can outgrow the JSON page cap and become unfetchable. `knownFlows` and `exposed.tests` are now a sample with an exact count (`exposed.testCount` is new); one oversized item made the pagination loop skip a change silently.
- Recording a change assessment no longer de-acknowledges every flow it names. The exhaustive list was mandatory and naming a flow cost its credit, so one no-op manifest edit could take a whole map to zero asserted statements.
- A stale flow names what moved. A map edit said `claim or inputs changed; needs rechecking` whatever the author had done, and now names the part -- the explanation, the watch list, the nodes; the basis is one hash, so the parts are recorded separately. A change in a whole-file dependency no longer blames the declaration that changed for holding a node it does not hold.
- Removing a `watch` entry that Supercov reports as redundant no longer restates the claim. Such an entry never became one of the flow's dependencies, but was still part of what the acknowledgement rested on, so deleting it cost a full re-acknowledgement.

## 0.0.51

**Added**

- `supercov runs <id> tests affected` names the tests of a run that the changes since it could have reached: a change in code the test ran, in its test file, or in the shape of a file it ran code in. A change confined to code the test never ran does not count, nor do comments, blank lines or trailing whitespace. `--names` and `--files` print one line per test for a runner's filter; a dependency, configuration or toolchain change affects every test and says so; a file added since the run is outside every record, and the working-tree check says that too.
- Each run records what every test executed, declaration by declaration, in the run's own state. Assertion change records say which tests ran the changed code and how many flows that exposes (`exposed`), alongside the `knownFlows` the change made stale, so the one assessment a change asks for is asked of the right people -- and a change no selected test ran is not asked about at all.

**Changed**

- An acknowledged assertion flow now goes stale for a change to what its claim rests on and for nothing else: the declaration holding each of its nodes and the top level of that file, the file's set of declarations, the test it applies to, a watched file, its assertion, the run's context. Editing another function in a node's file is a notice on the flow (`notices` in the report), not a review. Editing a comment, a blank line or trailing whitespace is nothing, in every language; a comment the language itself reads -- a Go `//go:` directive, a Ruby magic comment, a Rust doctest -- still counts. Each reason names what moved and where the flow sits: `src/server.js: Server.start (line 12) changed (holds this flow's return:31)`.
- A node keeps its acknowledgement when code is added or removed above it, in another declaration or in comments; pointing it at another statement of the same text does not.
- Acknowledgement tokens are now `scov3:` and pin the code a claim rests on rather than the bytes of whole files. Tokens from earlier releases still parse; each such flow reads as needing acknowledgement, with that as its reason, once. Copy the current `expectedBasis` after rereading the claim.

**Fixed**

- A node whose statement appears twice in its file was reported "changed or ambiguous" whenever the file changed anywhere, though it sat untouched at its recorded line.

## 0.0.50

**Added**

- Supercov installs from Homebrew: `brew install supercorp-ai/tap/supercov`. The same prebuilt binary every other channel ships, at the same version, with nothing compiled on install.
- A Go project can run Supercov with Go and nothing else: `go run github.com/supercorp-ai/supercov/cmd/supercov@latest -- go test ./...`. Like any `go run` with a version suffix it ignores the `go.mod` in the current directory, so it neither needs nor touches your module. Every language Supercov measures now has a way in that does not start by installing a different one.

## 0.0.49

**Added**

- Supercov measures Go, Java and Kotlin: lines, branches, functions and MC/DC, on the same footing as every other language. `npx supercov -- go test ./...`, `npx supercov -- mvn test`, `npx supercov -- ./gradlew test`.
- Go runs on `go test` with exact per-test attribution and one evidence file per test package. `-count=1` is added unless your command says otherwise, so a cached package cannot report as covered without running. A `go.work` workspace gets a runtime per module, and a nested `go.mod` no workspace names is left alone. A test that calls `t.Parallel()` counts run-wide rather than being attributed by guesswork.
- Java and Kotlin attribute through each framework's own lifecycle rather than rewritten test sources: JUnit 5, JUnit 4 through Vintage, Kotest and Spock through one JUnit Platform listener, and TestNG through a listener of its own, each data-provider invocation its own test.
- A JUnit 4 suite reaches the platform through Vintage. Supercov adds the engine to its copy of a Maven module and measures it; a Gradle module is named in the output and left alone instead, because putting the platform on a JUnit 4 classpath makes Gradle pick a provider that finds no engine and fails the suite. Add `junit-vintage-engine` and `useJUnitPlatform()` and Supercov measures it.
- Multi-module Maven and Gradle builds are measured module by module and merged, including builds that fork several JVMs to run tests in parallel — `maxParallelForks`, `forkCount`. Kotlin Multiplatform layouts are measured where the JVM is the only target.
- Supercov instruments an isolated copy and leaves your own build untouched. Conditions the compiler reads are left exactly as written — Java's pattern `instanceof` and record patterns, Kotlin's `is` and null comparisons — so such a branch is measured from its arms and carries no condition vectors. Every surface left unmeasured is named in the run's limitations, including a source file the parser could not read.
- Assertion maps inventory `t.Error`, `t.Fatal` and testify for Go, and `assertSomething`, `assertThat` and `fail` for the JVM, which covers JUnit, TestNG, AssertJ, Hamcrest and kotlin.test.

## 0.0.48

**Added**

- `supercov runs <id> check` fails CI below a coverage floor, reading a recorded run without rerunning tests. Floors are set per metric (`--min-lines`, `--min-branches`, `--min-mcdc` and the rest) and `--per-file` applies them to every file with eligible obligations. They compare the counts, never a rounded percentage, so 9,999 covered lines of 10,000 fails a 100% floor. Insufficient evidence — a failed suite, a stale run, a metric with nothing eligible, one left partly measured, or one the adapter never records — ends with `2` rather than passing.
- `supercov runs <id> patch --base <ref>` reports coverage of the lines a change touches, against the merge base rather than the target branch's tip. The denominator is changed lines the run measured, so comments, blanks and declarations fall out by the adapter's own judgement, and deleted lines are excluded. A change with nothing executable says so instead of claiming 100%, and changed product source missing from the run is named rather than counted as covered. `--annotate github` emits workflow annotations, needing no token.
- `supercov runs <id> report --format lcov|cobertura|html` exports a run. All three read the view the gates read, so a consumer's totals are the ones Supercov enforced. Files are written atomically and kept unless `--force`.
- The HTML report is one self-contained document that opens offline from a CI artifact, with a filterable file table and a source view marking each line in words and a glyph as well as colour. Uncovered, not applicable, partly measured and stale stay distinct rather than collapsing into one score; source is embedded only when the run still matches the checkout.
- Assertion reports carry `advisories`, the first naming a `watch` on a file already tracked run-wide.

**Changed**

- Each invalidation signal now costs what it is worth, so maps need one review after upgrading and then stop being disturbed by changes that alter nothing.

**Fixed**

- Cutting a release costs nothing. Manifests are fingerprinted by what they declare rather than their bytes, and a flow watching one is covered run-wide — together, 62% of supergateway's manifest edits.
- Upgrading Supercov no longer marks maps or stored runs stale; only an instrumenter contract change does. Merging and the build caches still see that digest.
- A dependency upgrade is one change to assess, not staleness on every flow, and credit is retained meanwhile.
- The ambient environment left run identity for Rust, Python and Ruby. Linters, formatters, type checkers and coverage settings are no longer execution context; Babel, tsconfig and pytest still are.
- Published crates carry the project README again.

## 0.0.47

**Added**

- Assertion coverage measures Python and Ruby, alongside JavaScript, TypeScript and Rust. Runs record which assertion each test reached and where it is written, so an agent can explain them and earn statement credit. Covers pytest, unittest, RSpec, Minitest, test-unit and Cucumber.
- Python and Ruby test results name the file a test is defined in, which is what an assertion map's test selector needs.

**Changed**

- Neither runtime reports an assertion's column, so a line is credited only when the inventory holds exactly one assertion on it. Put two assertions on separate lines.
- pytest's assertion-pass hook stays armed for a whole test rather than disarming after the first assertion, so every site is recorded. pytest now builds an explanation per passing assertion.

**Fixed**

- Assertion review tokens no longer depend on the ambient environment. A different directory, terminal or Node install previously marked every flow stale at once. Name variables in `SUPERCOV_ASSERTION_CONTEXT_ENV` when a suite needs them. Maps need one review after upgrading.
- Assertion line reports count only lines a statement can be claimed on. Continuation lines and nested function bodies were wrongly in the denominator. The statement percentage is unaffected.

## 0.0.46

**Fixed**

- JavaScript and TypeScript assertion coverage excludes imports known to disappear during compilation. Value imports, side-effect imports and ambiguous compiler settings remain measured. Reports explain excluded statements; rerun tests to collect the corrected denominator.
- Preserve test ownership through HTTP requests, WebSocket upgrades and child processes. Node test cleanup assertions retain their evidence, while shared setup stays separate from individual tests. Skipped and TODO tests remain visible without receiving passing assertion credit.
- Repeated assertion reports reuse cached calculations while checking current source and map freshness. Corrupt caches rebuild automatically without changing authored maps.

**Added**

- Assertion details explain why each mapped source node receives credit or remains context only. Large flows support paginated node and edge views with compact output.
- Evidence diagnostics distinguish missing execution, setup or background work, unobserved assertions and non-passing test selectors. Test-kind reports recognize common E2E and integration file names and disclose runner defaults.
- Updated CLI reference and assertion guides cover mapping, validation, percentage, gaps and reuse after edits. The same guides ship with the CLI and on supercov.com, with a shared sync command and publication checks to prevent drift.

## 0.0.45

**Added**

- Agent-authored assertion maps for JavaScript and TypeScript. Each test run creates `assertions.json`; an agent records which exact assertions observe which source statements. Start with `supercov docs assertion-agent`.
- The regular coverage report shows agent-assessed assertion percentage beside Lines, Branches and MC/DC. Untouched maps and unresolved changes show explicit status instead of a misleading zero. This score does not prove mutation resistance or mapping completeness.
- New runs reuse compatible mappings. Freshness is tracked per flow; changed files enter an impact queue. Read-only validation supplies acknowledgement tokens for the agent to save in the map.
- Inspect assertions with `runs <run> assertions` and `assertion <id>`. Read matching current code with `source <path>`. File hashes support reuse without archiving the whole codebase.
- Rust-generated JSON Schema, paginated validation, source diagnostics and CI gates for current mappings, passing evidence and percentage. Guides ship with installed packages. Async operands, parameterized tests, CommonJS matchers and Playwright fixtures retain exact assertion evidence.

**Changed**

- Agent-authored maps replace experimental mechanical assertion inference. Ordinary execution-phase links no longer award assertion credit. Assertion analysis requires current source matching the run; rerun tests after edits to inherit mappings.

## 0.0.44

**Fixed**

- Repeated Node test registrations no longer overwrite one another's evidence. Same-name loop entries, nested subtests and worker executions retain distinct attempts. Rerun tests to collect evidence missing from older archives.
- Preserve test provenance in paths containing parentheses and retain passed tests whose source registration cannot be resolved. Unsupported assertion operands report analysis limits instead of misleading missing-test claims.
- Bind awaited native assertions to their own source witnesses. Resolve native assertion imports and distinguish checked operands from diagnostic arguments, self-comparisons and shared-input comparisons.

**Added**

- Query-time analysis of bounded console-mock histories, selected counts and payloads, primitive decisions, direct returns and synchronous exception completion. Inline `observes` hints can guide supported checks against an existing passing assertion; they do not change test outcomes or replace missing assertions.
- Decision evidence distinguishes bounded source-model results from branch-observation heuristics. Unsupported cases remain unresolved; assertion evidence is not a global assertion score or a guarantee that arbitrary edits are safe.

## 0.0.43

**Added**

- npm JS/TS assertion evidence: `runs <run> assertions`, pageable `--evidence`, and validated `--pragmas` with passing-assertion witnesses. Supports TypeScript 5.8.3 and native 7.0.2 across supported platforms, including Alpine and Windows. Source/compiler freshness is checked. Existing probes are retained; results are candidates, not a verified safety percentage.
- Python and Ruby link pre-assertion execution evidence to passing assertions: pytest, unittest, Minitest, RSpec, Cucumber and test-unit.
- A reproducible checkout walkthrough demonstrates coverage gaps and stronger assertions. Public guides ship with installed packages.

**Changed**

- Ruby 3.4+ avoids repeated branch/method-table sampling without changing coverage results; Ruby 3.3 retains its existing path.

**Fixed**

- Rust test filters are honored, function locations exclude doc comments, and interrupted runs clean up test processes, including through Windows Job Objects.
- Ruby test-unit outcomes, class-variable assignments, UTF-8 source, guarded pattern matching and constant boolean arms are handled correctly. Ractor blocks retain line coverage with explicit probe limitations.
- Jest preserves user configuration and records exact per-test identities, parameterized tests, retries, final outcomes and assertion phases.

## 0.0.42

**Added**

- Rust coverage says whether a test checked what it ran. Evidence a thread recorded before passing an `assert!`, `assert_eq!` or `assert_ne!` links to that assertion, so a line reads "linked to a passing assertion", not "execution only". On hyper: 6,204 of 6,707 covered lines.
- `runs <run> file <path> --json` reports `totalLines` and `coveredLines`; `SUPERCOV_PHASE_TIMING=1` breaks the Rust workspace phase down.

**Fixed**

- Found by checking Rust coverage per file against `cargo llvm-cov` over 26 crates: code that could never be covered was counted as uncovered. A module behind an off `#[cfg]` (memchr's 816 lines for other architectures), a `const fn` body, a `GlobalAlloc` impl and a proc-macro crate's own code are reported as unmeasured now. memchr reads 84.4%, was 63.2%.
- A module declared inside `cfg_if!` or `cfg_select!` is measured; hashbrown's NEON group was invisible.
- Instrumenting a crate that turns the prelude off, or an attributed macro statement, no longer breaks the build (tracing, hyper, tokio).
- A limitation is reported at its own site and real severity: a boundary of the denominator no longer reads as "Instrumentation Incomplete".

**Changed**

- Preparing a Rust workspace parses each file once instead of twice.

## 0.0.41

**Added**

- Arguments of the std expression macros (`assert!`, `assert_eq!`, `println!`, `format!`, `write!`, `vec!`, `dbg!`, `panic!`, `matches!`, ...) are measured. An `assert!` condition is a decision with its own condition vectors; `matches!` is a boolean decision unless it already serves as an `if` condition.

**Fixed**

- Found by running the Rust frontend over 21 real crates (bytes, serde_json, regex, serde, tokio, ...) under `cargo test` and `cargo nextest run`: `if let`/`while let` before edition 2024 became a let chain; a message-less `assert!` lost its panic text; `#[path = "../src/..."]` and symlinked modules were rejected; a word a newer edition reserves failed to parse; `should_panic` doctests went unmatched; proc-macro crate tests lacked the dynamic library path; a trailing attributed macro became an unstable attributed expression; `assert!` over a `&bool` failed to compile; tests ran in the workspace root, not their package directory. All match plain Cargo.
- Deep recursion no longer overflows: probe frames shrank and test processes get a 16 MiB stack via `RUST_MIN_STACK`.
- `SUPERCOV_RUST_DUMP_FAILED_INSTRUMENTATION=<dir>` dumps failed transforms.

**Changed**

- Rust probes cost less in hot loops: repeated hits and decisions dedupe without locks (a decision from about 190ns to 70ns).

## 0.0.40

**Added**

- Doctests are measured: `cargo test` runs them with Supercov standing in for rustdoc, each in its own process, attributed by name, merged and standalone alike.
- `cargo nextest run` works on the public path. Supercov is nextest's target runner: scheduling, retries, filters and exit status are untouched, each attempt is recorded, and a pass on retry is flaky.
- Every Rust branch obligation has a probe: match arms, `&&` and `||`, `for` and `while` loops, `?`, let chains (pattern outcomes derived exactly from where the chain stopped) and attributed statements. Only const contexts and macro expansions remain declared.

**Fixed**

- A doctest-only crate reported zero tests; the test count names tests, not attempts.
- Only files rustc compiles are instrumented: crate roots and the modules reached through `mod`, `#[path]` and literal `include!`. A `.rs` file embedded with `include_str!` stays as written.
- Evidence files name their instrumentation, so a program a test builds and runs with its own probes no longer breaks the run.
- The last arm of an exhaustive match no longer demands an impossible "not selected" outcome.

## 0.0.39

**Added**

- `cargo binstall supercov` downloads the prebuilt binary from the GitHub release instead of compiling from source.
- Rust suites run on Windows. The probe runtime maps its evidence file through a Windows file mapping and hooks thread and process creation through the executable's import table, so threads and children started inside a test stay attributed to it.
- Ruby 4.0 is supported and verified.

**Fixed**

- On Windows, a Python run measured nothing: the project root reached the runtime with a `\\?\` prefix its files lacked. A Ruby run could not start `rspec`, a batch shim. Both work now, and both runtimes warn when a run executes files but none under the root.
- A plain `npm ci` installed native binaries from an older release: the lockfile named one version beside a tarball URL of another.

**Notes**

- Python 3.12 to 3.14, Ruby 3.3 to 4.0 and Rust suites are verified on Linux, macOS and Windows; the Rust frontend runs in CI for the first time.

## 0.0.38

**Fixed**

- The engine crate packages the runtime shims it embeds, so the published crates build from their source again. 0.0.37 reached crates.io only as `supercov-contracts`; `supercov-engine` and `supercov` resume here.

## 0.0.37

**Added**

- PyPI (`supercov-cli`), RubyGems (`supercov`) and crates.io (`supercov`) are published with every release at the same version as npm: a wheel for each of the eight platforms, a gem for the seven Ruby has a platform for, and the source crates. The release also attaches every file to its GitHub release.

**Fixed**

- Linux builds require glibc 2.28 rather than 2.39, so they run on Debian 12, Ubuntu 22.04, RHEL 9 and Amazon Linux 2023 -- the base of most Node container images -- instead of only on distributions as new as Ubuntu 24.04.

**Changed**

- Preparing a run no longer forces each generated file to disk. Those files are rebuilt, or restored from a digest-verified cache, on every run, so the wait bought nothing: setup drops from 290-310 ms to about 50 ms on Windows, and from 400 ms to 14 ms on macOS.

## 0.0.36

**Added**

- Windows builds for x64 and arm64. `npx supercov` selects them automatically. JavaScript and TypeScript suites are verified on Windows; Python, Ruby, and Rust suites are not yet.

**Fixed**

- Navigations inside a Playwright context launched outside the fixtures — a persistent profile, or a `newContext` from test code — now carry the test's identity, so a cross-site iframe's document requests are attributed to the test instead of the run. Headers the suite configured on that context are kept, and restored when the test ends.
- A test that starts a server with `execSync("npm run start")`, or any launch handed to the shell as one string, now gets the project built first, the same as `spawn("npm", ["run", "start"])` did. The string form is how most suites start the server they test against, and it was still reaching a gateway that had never been built.

**Changed**

- The Python package now states what it supports: CPython 3.12 or newer, which is what `sys.monitoring` requires, instead of the 3.8 its metadata claimed. Package homepages point at supercov.com, the npm description lists Ruby, and the README documents the supported operating systems and architectures.

## 0.0.35

**Fixed**

- Coverage a process buffered is no longer lost when a signal ends it, so a server or gateway a test kills in teardown keeps the coverage it produced.
- Instrumented TypeScript carries the generated-source exemption under a direct test command, not only a Supercov-orchestrated build, so a project that compiles inside its own test command builds under measurement.
- A project whose tests launch a package script that runs compiled output is built before the runner, instead of the run reaching a gateway that was never built.
- A Ruby process killed before it could report no longer leaves its lines reading as uncovered. Ruby reads its coverage as the interpreter exits, so a process that never gets there takes with it whatever it observed since the last test boundary; the run now declares that gap, which blocks completeness, rather than counting it against the code.

## 0.0.34

**Fixed**

- Lines no frontend could measure are no longer counted in the line total, where they previously skewed the ratio.
- The instrumentation banner no longer displaces a `#!` line, which broke builds of projects with an executable entry point.
- Instrumented build output no longer overwrites the project's own build output.
- Generated runtime modules are now `.mjs`, so loaders that treat `node_modules` as CommonJS, such as `ts-node/esm`, link them correctly.

## 0.0.33

**Added**

- Ruby coverage for RSpec, Minitest, test-unit and Cucumber. Runs use the project's own interpreter and bundle; Supercov only adds a `-r` entry to `RUBYOPT`.
- Exact MC/DC, loop and iterator iteration, short-circuit assignment (`||=`, `&&=`), case and safe-navigation selection, and rescue handling, on top of Ruby's `Coverage` module.

**Fixed**

- A Python run's stale check no longer compares it against JavaScript inputs.

**Notes**

- Ruby 3.4 and newer measure everything. Ruby 3.3 measures through `Coverage` alone and declares the rest.

## 0.0.32

**Added**

- Playwright browsers and contexts launched by project fixtures or test code are measured, including persistent contexts, remote and standalone launches, raw `Browser.newContext` pages, and pages closed before teardown.

**Fixed**

- Collector fixtures apply to every test-shaped facade export while preserving the facade's own overrides.
- Browser phase ids are scoped to the attempt that minted them, so a shared persistent context no longer leaks a prior test's phase into later evidence.

## 0.0.31

**Added**

- CPython 3.12–3.14 coverage for pytest and unittest through `sys.monitoring`, measuring the project in place with no source rewriting and no copied workspace.
- Exact line, branch, decision and MC/DC obligations, with attribution for pytest workers, retries, phases, threads, subprocesses and multiprocessing, and kill-resilient mmap evidence.
- Python setup documentation and a CPython compatibility matrix.

## 0.0.30

**Fixed**

- A comment leading a parenthesised `return` argument was restored on its own line, letting automatic semicolon insertion read `return;` and change program behaviour under measurement. Restored comments now land only where a line break is inert.
- The instrumented workspace is self-contained when mounted into a VM or container: nested `node_modules` are cloned copy-on-write on APFS or hard-linked elsewhere, and dependency trees never sync back to the project.
- Regenerated bundler output no longer makes a run read as stale as soon as it finishes.

## 0.0.29

**Fixed**

- Source discovery no longer counts tooling as source: nested checkouts, root-level tool directories, generated trees and hashed bundler output are skipped, packages declared in `workspaces` are found wherever they live, and functions passed to compile-time macros are left as written.
- Evidence written by clones of one process, such as VM pools restored from a shared snapshot, no longer corrupts a run. Writers carry per-instance tokens and rotate on collision, and a torn line costs one record instead of the whole run.

## 0.0.28

**Changed**

- Everything Supercov writes now lives under a single `.supercov` directory — runs, locks and the instrumented workspace cache — which writes its own Git ignore rule.

## 0.0.27

**Added**

- Files the wrapped command creates or changes are synced back to the project, so updated snapshots, generated fixtures and test reports land where the plain command would have put them. Changes to instrumented sources and deletions are reported rather than applied.
- Every npm release now also publishes a GitHub release.

**Changed**

- The workspace container moved from `supercov/` to a hidden `.supercov-workspace/`, migrating existing caches automatically.

## 0.0.26

**Changed**

- A test run in an ecosystem Supercov does not support is recognised from the command or manifests and reported by name instead of producing an empty measurement.

**Fixed**

- The test command is authoritative, so a stray `package.json` can no longer route a `go test` run into JavaScript measurement.

## 0.0.25

**Fixed**

- Instrumented JavaScript suites run at baseline speed again. Evidence transports batch per event-loop turn and per macrotask instead of writing per record, taking a latency-sensitive UI flow from 2.4x baseline to 1.08x with byte-equivalent evidence.

**Added**

- The phase-timing benchmark harness that found it.

## 0.0.24

**Fixed**

- Suites that re-export Playwright's `test` and `expect` through their own fixture package link again. On 0.0.23 every spec importing a facade helper failed to link and Playwright discovered zero tests.

## 0.0.23

**Fixed**

- Interactive terminals no longer hang when a workspace phase outlives the quiet period. The spinner is gone; long silent phases print one static status line.
- Instrumented sources reach browser bundles through a dependency-free capability seam, so Vite builds no longer fail on Node builtins.

**Changed**

- Symlinks escaping the project are omitted with a diagnostic instead of refusing the run.
- The canonical contract no longer advertises the removed waivers surface.
