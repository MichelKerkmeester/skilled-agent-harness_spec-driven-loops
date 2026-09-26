![Coverage, security and code quality for coding agents](https://raw.githubusercontent.com/supercorp-ai/supercov/main/supercov.jpg)

**Coverage, security and code quality for coding agents**

**Supercov tells your coding agent what to fix and what to test.** It scores your code quality and flags security risks with [Jev](https://typesafe.ai), runs the test command you already use, and turns uncovered paths into small, actionable queries. Your agent picks a target, writes a focused test or a focused refactor, proves what improved, and keeps going.

Paste this to your coding agent to start:

```text supercov-prompt
Measure code quality with npx supercov.
```

Scoring needs a [TypeSafe AI](https://typesafe.ai) API key, and your coding agent will usually ask you for it. It costs about a cent per megabyte of source. Coverage needs no account, config file, import, custom reporter, or hosted service. Supercov is local, free, open source, and MIT licensed.

[Website](https://supercov.com) · [Documentation](https://supercov.com/docs) · [npm](https://www.npmjs.com/package/supercov) · [GitHub](https://github.com/supercorp-ai/supercov)

Supported languages: [JavaScript](https://supercov.com/docs/javascript) · [TypeScript](https://supercov.com/docs/javascript) · [Rust](https://supercov.com/docs/rust) · [Python](https://supercov.com/docs/python) · [Ruby](https://supercov.com/docs/ruby) · [Go](https://supercov.com/docs/go) · [Java](https://supercov.com/docs/java) · [Kotlin](https://supercov.com/docs/kotlin).

In Claude Code, Codex and Gemini CLI you can also [install it as a plugin](#give-supercov-a-job).

Supported by [Supercorp](https://supercorp.ai).

[Agent workflow](https://supercov.com/docs/agent-loop): ask your coding agent
to add a test in your own project, with a recorded example to follow along.

## Score your code

```bash
export TYPESAFE_API_KEY=...   # get one at https://typesafe.ai
npx supercov quality
```

No arguments and no configuration. It finds your source, asks Jev a set of
yes/no questions about each file, and does the arithmetic itself, so every part
of a score is a claim you can check against the file.

```
Quality weak (3.8/10) over 163 files.
  11 good, 52 fair, 100 weak.

Weakest:
  weak  runtime/python/supercov_runtime.py
        long_method 0.96, deep_nesting 0.92, complex_conditional 0.89, +9 more
  weak  crates/supercov-engine/src/assertion_store.rs
        long_method 0.96, deep_nesting 0.91, complex_conditional 0.86, +8 more
```

Narrow to what fired, read one file in full, or review a change:

```bash
npx supercov quality gaps
npx supercov quality file src/server.ts
npx supercov quality patch                    # your uncommitted work, or your branch
npx supercov quality patch --annotate github  # workflow annotations, no token
```

Jev charges for what it reads and nothing for what it writes, so a megabyte of
source costs a little over a cent. Answers are cached by content, so a second
run pays only for what changed. See [Understanding quality](docs/quality.md).

## Find security risks

```bash
npx supercov security
npx supercov security patch   # what a change introduced
```

Twelve security checks asked of every file with the same key, from injection
and secrets in source to paths and redirects taken from a request. Nothing is
averaged: a file is clean, or it names what fired, with the line and the code on
it where Jev confirms one. See [Security surface](docs/security.md).

## Start with the suite you already have

```bash
npx supercov -- npm test
```

Other ways in, all the same binary at the same version: `brew install
supercorp-ai/tap/supercov`, or for a Go project `go run
github.com/supercorp-ai/supercov/cmd/supercov@latest`.

Everything after `--` is your test command. Supercov runs it without changing your source, tests, runner configuration, or normal build output.

Then read the result and ask what is still uncovered:

```bash
npx supercov runs latest
```

```
run run_7fc676ba671d42be
command: npm test

Coverage
  Lines      100.00% (5/5)
  Branches   66.67% (4/6)
  MC/DC      33.33% (1/3)
```

```bash
npx supercov runs latest gaps --limit 10
```

```
Coverage gaps — only files with unresolved obligations

src/pricing.js
  uncovered: lines 0  statements 1  functions 0  branch outcomes 0  MC/DC conditions 2
```

After your agent adds a test, rerun the complete suite and prove the gain:

```bash
npx supercov -- npm test
npx supercov diff <previous-run-id> latest
```

Want to hand the evidence to a person? Generate one private, interactive file:

```bash
npx supercov report
```

The report opens in your browser with up to ten recent runs in a visual history.
Selecting a run compares it with the previous snapshot automatically. It has no
server, external assets, account, or file picker. It is written to
`.supercov/reports/`, where the store's own `.gitignore` keeps it out of git.
You can attach that one file directly to a pull request; a reviewer downloads
it and double-clicks it.

Use whichever complete test command the repository already trusts:

```bash
npx supercov -- npx playwright test
npx supercov -- pnpm test:e2e
npx supercov -- cargo test
npx supercov -- cargo nextest run
npx supercov -- pytest
npx supercov -- python -m unittest
npx supercov -- bundle exec rspec
```

## Map what assertions check

Each normal test run creates an assertion map automatically. An agent can
optionally fill in what the assertions check:

```sh
npx supercov runs latest assertions --json
# Pin the returned run ID. Inspect assertions and the source that ran:
npx supercov runs <run> assertion <assertion-id>
npx supercov runs <run> source src/example.ts
# Edit assertions.json, then validate and acknowledge:
npx supercov runs <run> assertions validate --json
# Copy examined expectedBasis tokens into assertions.json; save again.
npx supercov runs <run> assertions check --require-mappings --json
npx supercov runs <run>  # includes the assertion percentage in the regular report
```

After code or tests change, run the same test command again. Supercov reuses the
newest available map for that command and language and identifies dirty flows. Rust owns
validation, change tracking and reporting; the agent supplies semantic reasoning.
The score is agent-assessed and separate from MC/DC. See
[assertion maps](docs/assertion-maps.md) for the format and JS/TS limits, or run
`npx supercov docs assertion-agent` for the agent workflow. `npx supercov assertions schema`
exports the editor schema; `assertions validate --file <path>` checks JSON syntax.

## Give Supercov a job

Paste one of these prompts into Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, or any coding agent that can run terminal commands.

Or install the agent skill, and your agent reaches for Supercov on its own when you ask for tests, coverage, refactoring or a security scan. In Claude Code:

```text
/plugin marketplace add supercorp-ai/supercov
/plugin install supercov@supercov
```

In Codex:

```bash
codex plugin marketplace add supercorp-ai/supercov
codex plugin add supercov@supercov
```

In Gemini CLI:

```bash
gemini extensions install https://github.com/supercorp-ai/supercov
```

For Cursor, GitHub Copilot and other agents that read skills: `npx skills add supercorp-ai/supercov`.

The Claude Code plugin and the Gemini CLI extension also add four commands you can type:

| Command | What it does |
| --- | --- |
| `/supercov:coverage [test command]` | Writes one test for code no test reaches, and reports coverage before and after |
| `/supercov:security [patch]` | Scans the repository, or a change, for security vulnerabilities |
| `/supercov:quality [patch]` | Ranks files by code smells, or checks what a change introduced |
| `/supercov:review [--base ref]` | Checks a branch or uncommitted change for security and quality problems |

### Write the first useful test

```text
Measure code coverage with `npx supercov`. Use the coverage evidence to choose
one useful missing test. Only edit tests. Run the repository's complete test
suite through Supercov again and report what improved.
```

### Use leftover tokens on coverage

```text
Measure code coverage with `npx supercov` and write tests til 100%. Only edit
tests. Keep going while useful gaps remain.

Run the repository's complete test suite through Supercov. Use
`npx supercov runs latest gaps --limit 5` to choose one useful target at a
time. Write a focused test, rerun the same complete suite, and use
`npx supercov diff <previous-run-id> latest` to verify the gain.

Never weaken assertions or change application code to make coverage easier.
Stop if the suite fails, the evidence is incomplete, or no useful gaps remain.
```

## The agent loop

1. **Run the real suite.** Supercov executes the command after `--` in an isolated workspace.
2. **Find one useful gap.** Short, paginated queries show uncovered files, lines, branches, decisions, and value paths without loading a large HTML report into context.
3. **Write one focused test.** The coding agent changes tests—not application code or coverage configuration.
4. **Rerun and prove the gain.** `diff` shows exactly what the new test covered.
5. **Repeat while useful gaps remain.** Failed tests, incomplete evidence, or ambiguous scope stay visible instead of being rounded away.

Supercov supplies the coverage signal and evidence. It does not host, schedule, or replace your coding agent.

## Use leftover tokens on coverage

Before a reset—or overnight—turn idle agent time into coverage that stays with the repository. Each pass closes a small number of useful gaps and finishes with evidence that the tests still pass and coverage improved.

## Use it in a software factory

Add Supercov as a repeatable quality loop in an automated software factory. Your factory schedules the work; Supercov gives each agent a bounded next task and an immutable record of the result.

Every pass runs the real suite, chooses an uncovered path, writes a focused test, reruns, and proves the gain. Fresh executable evidence lets agents keep iterating around the clock while failed tests and regressions stop the loop before they ship.

## Coverage agents can act on

From lines and branches to MC/DC, every gap becomes a concrete test target. Supercov measures:

- lines, statements, functions, and branches;
- MC/DC independence witnesses;
- optional-chain, default-value, and logical-assignment paths;
- `try`/`catch` and zero-iteration control-flow paths; and
- per-test provenance where the runner exposes exact test boundaries.

The denominator comes from source structure before the run, so adding or removing tests cannot silently change what 100% means. Ambiguous source scope, uninstrumented code, and missing evidence remain visible as completeness blockers.

## Install for your language

Measuring a project should not start by installing another language. The same binary, at the same version, from one release:

```bash
npx supercov -- npm test                                 # npm
uvx --from supercov-cli supercov -- pytest               # PyPI
gem install supercov && supercov -- bundle exec rspec    # RubyGems
cargo binstall supercov && supercov -- cargo test        # crates.io
go run github.com/supercorp-ai/supercov/cmd/supercov@latest -- go test ./...   # Go
brew install supercorp-ai/tap/supercov && supercov -- ./gradlew test           # Homebrew
```

`pip install supercov-cli` and `gem install supercov` install a wheel or gem that carries the binary for your platform; nothing is compiled. `cargo binstall` downloads that same binary from the GitHub release, while plain `cargo install supercov` builds it from source and needs Rust 1.95.

A Go project needs Go and nothing else. Like any `go run` with a version suffix it resolves by module path and ignores the `go.mod` in your current directory, so it neither needs nor touches your module.

Java and Kotlin have no registry of their own here, so a JVM project takes the binary directly -- Homebrew above, `npx` if Node is already present, or the platform archive from the [latest release](https://github.com/supercorp-ai/supercov/releases/latest). Maven and Gradle are driven as your test command, not as a plugin. Supercov adds the JUnit Platform launcher its measurement needs to the build file inside its own isolated workspace copy -- your `pom.xml` or `build.gradle` is never edited.

## Supported languages

| Language | Status | Install | Start with |
| --- | --- | --- | --- |
| [JavaScript](https://supercov.com/docs/javascript) | Available | nothing, `npx` fetches it | `npx supercov -- npm test` |
| [TypeScript](https://supercov.com/docs/javascript) | Available | nothing, `npx` fetches it | `npx supercov -- npm test` |
| [Rust](https://supercov.com/docs/rust) | Available | `cargo install supercov` | `supercov -- cargo test` |
| [Python](https://supercov.com/docs/python) | Available | `python -m pip install supercov-cli` | `supercov -- python -m pytest` |
| [Ruby](https://supercov.com/docs/ruby) | Available | `gem install supercov` | `supercov -- bundle exec rspec` |
| [Go](https://supercov.com/docs/go) | Available | nothing, `go run` fetches it | `go run github.com/supercorp-ai/supercov/cmd/supercov@latest -- go test ./...` |
| [Java](https://supercov.com/docs/java) | Available | `brew install supercorp-ai/tap/supercov` | `supercov -- mvn test` |
| [Kotlin](https://supercov.com/docs/kotlin) | Available | `brew install supercorp-ai/tap/supercov` | `supercov -- ./gradlew test` |
| Zig | Coming soon | — | — |
| PHP | Coming soon | — | — |
| C | Coming soon | — | — |

The `npx` path requires Node.js 22 or newer; the other installs need no Node. Rust support currently uses Rust 1.95; cargo-nextest 0.9.138 and 0.9.140 are supported. Python support requires CPython 3.9 or newer and measures pytest and unittest runs. Ruby support requires Ruby 3.3 or newer (3.4 or newer for full measurement) and measures RSpec, Minitest, test-unit and Cucumber runs. Go support requires Go 1.22 or newer and measures `go test`. Java and Kotlin support requires a JDK 17 or newer with Maven or Gradle, and measures every JUnit Platform engine -- JUnit 5, JUnit 4 through Vintage, Kotest and Spock -- as well as TestNG.

## Supported operating systems and architectures

The CLI is a single native binary. `npx supercov` selects the build for the machine it runs on; nothing is compiled during installation.

| Operating system | Architectures | Notes |
| --- | --- | --- |
| macOS | arm64 (Apple silicon), x64 (Intel) | macOS 11 or newer |
| Linux | arm64, x64 | glibc 2.28 or newer (Debian 10, Ubuntu 18.10, RHEL 8 and later), or musl (Alpine); chosen automatically |
| Windows | arm64, x64 | Windows 10 or newer |

JavaScript, TypeScript, Python, Ruby, Rust, Go, Java and Kotlin suites are verified on Linux, macOS and Windows -- CPython 3.9 through 3.14 (on arm64 Windows, 3.9 and 3.10 as the x64 builds, since python.org publishes no arm64 build before 3.11), Ruby 3.3, 3.4 and 4.0, and Go 1.22, 1.25, 1.26 and 1.27 on every one, and JDK 17 and 21 on every one that has them (Temurin publishes no 17 for arm64 Windows, so that pairing is 21 alone). Containers, VMs, and remote executors run the same Linux builds. Every release publishes the same binaries to npm, PyPI (`supercov-cli`, a wheel per platform) and RubyGems (`supercov`, a gem per platform except arm64 Windows, which Ruby has no platform for), and the source to crates.io (`supercov`).

## Supported test suites

Supercov uses exact per-test attribution where an adapter is available. For other supported runners, it reports aggregate structural coverage instead of guessing which test covered a path.

| Runner | Coverage attribution |
| --- | --- |
| Playwright | Exact per test, worker, retry, outcome, action, and assertion phase |
| Vitest | Exact per test, with setup execution kept separate |
| Jest | Exact per test, including parameterized tests; exact `expect` occurrence identity for assertion maps |
| `node:test` | Exact per test |
| AVA and Mocha | Aggregate structural coverage |
| Cargo's standard libtest runner | Exact test, attempt, and passing-assertion identity |
| rustdoc doctests | Exact per doctest |
| cargo-nextest | Exact test, attempt, retry, and binary identity |
| RSpec | Exact example and before/example/after phase identity |
| Minitest and test-unit | Exact test and setup/test/teardown identity |
| Cucumber | Exact scenario and hook-phase identity |

Supercov works with Vite, Next, Turbopack, Webpack, esbuild, SWC, and projects with no build step. One command can collect evidence from several supported runners into a single run.

See [Supported languages and test suites](https://supercov.com/docs/supported-suites) for exact compatibility and attribution boundaries.

## Read the result

```bash
# Recent runs and the latest summary
npx supercov runs --limit 5
npx supercov runs latest

# The most useful open coverage obligations
npx supercov runs latest gaps --limit 10

# Details for a file or source location
npx supercov runs latest file app/checkout/session.ts
npx supercov runs latest decision app/checkout/session.ts:64
npx supercov runs latest line app/checkout/session.ts:64

# What changed between two runs
npx supercov diff <previous-run-id> latest

# A portable interactive report for a person
npx supercov report
```

Collections accept `--limit` and `--offset` and print a copyable next-page command. Machine-readable output is available with `--json` when an integration needs it.

## Local, private, and zero-edit

Everything Supercov writes lives under one hidden `.supercov/` directory: run evidence in `.supercov/runs/<run-id>/` and the isolated build cache in `.supercov/workspaces/`. It ignores itself in Git, so there is nothing to add to your `.gitignore`.

The Supercov CLI does not contact a Supercov service during a coverage run. Package tools such as `npx` may contact the npm registry to download Supercov when it is not already cached.

Supercov does not rewrite your source files, tests, imports, reporter list, runner configuration, dependency tree, or normal build output. An existing user-created `supercov/` directory is never adopted.

```bash
npx supercov runs clean --dry-run   # preview cleanup
npx supercov runs clean --keep 20   # keep the 20 newest runs
npx supercov runs clean             # remove all runs and the build cache
```

## Documentation

- [Getting started](https://supercov.com/docs/getting-started)
- [Understanding quality](https://supercov.com/docs/quality)
- [Agent workflow](https://supercov.com/docs/agent-loop)
- [Understanding assertions](docs/assertions.md)
- [Troubleshooting](https://supercov.com/docs/troubleshooting)
- [CLI reference](https://supercov.com/docs/cli)
- [Supported languages and test suites](https://supercov.com/docs/supported-suites)
- [Understanding coverage](https://supercov.com/docs/coverage-model)
- [Runs and evidence](https://supercov.com/docs/evidence)
- [Portable HTML reports](https://supercov.com/docs/reports)
- [Files, privacy, and cleanup](https://supercov.com/docs/workspace-isolation)
- [Trusting a result](https://supercov.com/docs/verification)
- [Speed and storage](https://supercov.com/docs/performance)

## Free and open source

[MIT licensed](LICENSE). Inspect, extend, and run it anywhere.

## Contributors

- [@DaVinciTachyon](https://github.com/DaVinciTachyon)
- [@Uhbif2](https://github.com/Uhbif2)
- [@maik-intellicoach](https://github.com/maik-intellicoach)
- [@untitaker](https://github.com/untitaker)
