# Getting started

Open your project in a coding agent that can run terminal commands, then paste
this prompt:

```text supercov-prompt
Measure code coverage with npx supercov and write one missing test.
Only change tests. Rerun the full test suite and show me the test you
added and the before-and-after coverage.
```

Your agent can install Supercov if needed. It runs the commands and edits the
tests; you don't need to do those steps yourself.

To score the code itself rather than its tests, set a [Jev](https://typesafe.ai)
key and ask:

```text supercov-prompt
Measure code quality with npx supercov.
```

See [Understanding quality](https://supercov.com/docs/quality).

For security surface with the same key, ask:

```text supercov-prompt
Find security issues with npx supercov security and show me what it found.
```

Supercov asks twelve security checks of every file and shows each finding
with the line and the code on it. See
[Security surface](https://supercov.com/docs/security).

When it finishes, review the test change and coverage comparison in your
conversation. Ask separately if you want a commit or pull request.

No account, config file, import, custom reporter, or hosted service is required.
Supercov supports JavaScript, TypeScript, Rust, Python, Ruby, Go, Java, and Kotlin today.

## What the agent does

The commands below show how the agent measures coverage and checks its work.
You can also run them yourself if you prefer using the terminal.

### 1. Run your real test command

The agent runs your repository's complete test suite through Supercov:

```sh supercov-example
npx supercov -- npm test
```

Everything after `--` is the command Supercov measures. The agent should use
the same complete command your project uses before merging or deploying.
If the project has several suites, tell it which one to use.

Supercov runs that command in an isolated, instrumented copy of the project.
The command keeps its normal arguments, environment, output, and exit status.
If one command launches several supported runners, their evidence lands in one
run.

### 2. Read the first result

The agent reads the newest run:

```sh supercov-example
npx supercov runs latest
```

The summary answers three practical questions:

1. Did the test command pass?
2. How much behavior did the suite cover?
3. Is anything genuinely uncovered, or was some code impossible to measure?

An uncovered gap is a candidate for a test. A measurement limit is different:
it means Supercov cannot honestly account for that code yet. Do not try to test
away a measurement limit.

### 3. Choose one useful gap

The agent asks for a short list of gaps, then inspects one file. It uses your
project's file paths in place of the examples:

```sh supercov-example
npx supercov runs latest gaps --limit 10
npx supercov runs latest file app/checkout/session.ts
```

It can use more specific queries to understand the gap:

```sh supercov-example
npx supercov runs latest decision app/checkout/session.ts:64
npx supercov runs latest line app/checkout/session.ts:64
```

`file` is usually the best place to start. `decision` explains missing boolean
outcomes and MC/DC witnesses. `line` shows the obligations and tests associated
with one source line.

#For a human review, create one interactive file from the same stored evidence:

```sh
npx supercov report
```

It opens locally with run comparison, prioritized gaps, source context, test
attribution, and scope. No test rerun or server is required.

## 4. Add a test and prove the gain

The agent writes one focused test with a meaningful assertion. It then reruns
the same complete command and compares the two runs:

```sh supercov-example
npx supercov -- npm test
npx supercov diff <previous-run-id> latest
```

A useful change leaves the suite passing and shows the expected gain without
an unexplained loss elsewhere. Review what the new test actually checks, not
just the percentage.

For a recorded example and prompts for longer runs, see
[Agent workflow](agent-loop.md).

## Environment requirements

These requirements apply wherever the agent runs commands: your machine,
a container, or a remote workspace. The agent can check them and tell you
if anything is missing.

- macOS (arm64 or x64), Linux (arm64 or x64, glibc 2.28 or newer or musl), or
  Windows (arm64 or x64);
- Node.js 22 or newer when using the npm package;
- a working test command, including its dependencies, environment variables,
  and any local services;
- for Rust, the Rust 1.95 toolchain;
- for Go, Go 1.22 or newer;
- for Java and Kotlin, JDK 17 or newer, with Maven or Gradle;
- for Python, CPython 3.9 or newer with pytest or unittest;
- for Ruby, Ruby 3.4 or newer with RSpec, Minitest, test-unit or Cucumber (3.3 measures lines, methods and simple branches only).

The CLI is a native binary. `npx supercov` picks the build for your operating
system and architecture, and nothing is compiled on install; the same binary is
on PyPI as `supercov-cli` (`uvx --from supercov-cli supercov`) and on RubyGems
as `supercov` (`gem install supercov`), at the same version, and the source is
on crates.io (`cargo install supercov`). The first invocation may download
Supercov from the registry. Supercov itself does not upload your source or
coverage evidence to a Supercov service.

Whichever language your project is in, you should not have to install another
one first. Go runs it the way Go runs any tool, and without touching your
`go.mod`:

```sh supercov
go run github.com/supercorp-ai/supercov/cmd/supercov@latest -- go test ./...
```

Homebrew installs the same binary for everything else, a JVM project included:

```sh
brew install supercorp-ai/tap/supercov
```

## Files and cleanup

Completed runs live under `.supercov/runs/`. Supercov also keeps an isolated
workspace for instrumented builds. These files are local and ignored by Git.
Supercov does not rewrite your source, tests, imports, runner configuration,
dependencies, or ordinary build output.

```sh supercov
npx supercov runs clean --dry-run   # preview what would be removed
npx supercov runs clean --keep 20   # keep the 20 newest runs
npx supercov runs clean             # remove all runs and the build cache
```

If the first run does not look right, go to [Troubleshooting](troubleshooting.md)
before changing the project.

## Next

- [Agent workflow](agent-loop.md) — run a safe, repeatable coverage loop.
- [Supported suites](supported-suites.md) — check languages, runners, and limits.
- [Coverage model](coverage-model.md) — understand gaps, metrics, and measurement limits.
- [CLI reference](cli.md) — find every command and filter.
