# Supercov handoff — 2026-08-24

## Takeover state

- Repository: `https://github.com/supercorp-ai/supercov`
- Local checkout: `/Users/domas/Developer/supercorp/supercov`
- Release commit and tag: `f3d4bac6c16cb5fda444dede233bf283191e5724`, `v0.0.9`
- npm: `supercov@0.0.9` is published and is the `latest` dist-tag.
- Trusted-publishing run: `https://github.com/supercorp-ai/supercov/actions/runs/32719608973`
- CI result: release check, all 16 pinned Test262 shards, and npm publication passed.
- Do not publish another version for every small change. The user explicitly wants
  changes accumulated into meaningful release batches to conserve GitHub Actions
  minutes.

The release tag points at the product commit. This handoff is intentionally a
post-release commit on `main`, so it can record verified publication rather than
an expected outcome.

## Product intent

The intended UX remains zero-edit and runner-independent:

```sh
npx supercov -- npm test
```

Supercov must follow whatever the already-working command launches, instrument
only an isolated workspace, and produce local evidence that agents can query in
small bounded pieces. It must not require application imports, runner config
changes, provider names, a resident service, or mutation of the user's ordinary
build. Specific adapters are acceptable for runner-level test attribution;
remote/container discovery must remain capability-based rather than contain
hardcoded knowledge of Supermachine or Essential Apps.

## What v0.0.9 completed

### Native `node:test` assertion attribution

- ESM and CommonJS imports of `assert`, `node:assert`, and their strict variants
  are transparently adapted for project-owned tests.
- Default, named, namespace, destructured and `Assert` instance methods retain
  native values, errors and asynchronous behaviour.
- A workspace-only source transform opens the assertion phase before assertion
  arguments evaluate, allowing application execution used to compute the
  asserted value to receive assertion-linked confidence.
- Imported Jest-style `expect(...).to*()` matchers in native `node:test` files
  receive the same phase treatment without modifying the test repository.
- The generic node fixture now proves four exact test scopes, four assertion
  phases and 100% assertion-linked MC/DC.

Primary files: `src/nodeAssertionInstrumenter.ts`, `src/nodeAssertAdapter.ts`,
`src/nodeAssert.ts`, `src/nodeAssertStrict.ts`, `src/nodeTest.ts`, and
`src/runtime.ts`.

### Optional-call completeness without semantic changes

Optional function and method calls now record short-circuit and continuation
alternatives while preserving:

- receiver and `this` binding;
- getter, computed-key and argument evaluation exactly once;
- whole-chain short-circuiting;
- `super` calls;
- `delete` reference semantics; and
- ordinary private optional method calls such as `this.#method?.()`.

The four optional-call limitations present in the preceding self-run are gone.
Differential fixtures cover nested receivers, `super`, `delete`, private methods,
skipped keys and skipped arguments.

### Runtime and transport hardening

- The generated collector runtime has a genuinely isolated state key. A prior
  broad string replacement could make collector and application runtimes share
  the application state after build-time constant folding.
- Worker threads inherit the Supercov preload even when a test supplies its own
  `execArgv`; eval workers bootstrap it from their unchanged source string.
- Concurrent cloned runtimes with identical PIDs and counters retain unique
  evidence records.
- Local Node evidence is buffered and deduplicated per attempt instead of
  writing every hot-loop hit as a small file.

### Test262 and cache handling

- The pinned TC39 Test262 checkout lives at `.cache/test262` inside this
  repository and is ignored by Git.
- `npm run test:test262` uses that location by default. The README documents the
  one-time shallow clone.
- `.cache` is excluded from source discovery, isolated workspace copying and
  run-integrity test fingerprints. Before the final fix, Test262 contributed
  roughly 54,000 false test fingerprints to an ordinary self-run; the final run
  correctly fingerprints 64 test files.
- The complete local corpus covered 41,593 eligible files and 65,053
  baseline-passing scenarios with zero transformation or semantic-equivalence
  failures. Release CI repeated the pinned corpus in 16 green shards.

## Final verification evidence

The following passed on the 0.0.9 tree before tagging:

```sh
npm run release:check
npm run test:fixture
npm run test:filesystem
npm run test:test262 -- --limit 250 --minimum 200
```

`release:check` included 146/146 native tests, TypeScript checking, clean-room
isolation, packed `npx`, the independent Clang/LLVM MC/DC oracle, and performance
budgets. All Playwright, Vitest, Jest, native `node:test`, Vite, esbuild, Webpack,
SWC, Next, opaque CommonJS/ESM remote-launch, distributed merge and agent-query
fixtures passed. macOS filesystem/crash recovery passed.

Final benchmark:

- 500-file transform median: 1008.2 ms; p95: 1048.4 ms
- generated output expansion: 7.35x
- synthetic runtime overhead: 1.14x
- 500-file isolated workspace median: 77.9 ms; p95: 82.5 ms

## Latest self-dogfood run

Run ID: `2026-08-24T10-56-54-932Z`

- 146 tests passed; no failed, flaky, skipped, timed-out or unknown attempts.
- Measurement is complete: zero limitations, blockers or evidence corruptions.
- Source scope: 39 included, 79 excluded, zero ambiguous.
- Coverage: lines 55.78%, statements 54.15%, functions 49.16%, branches
  36.38%, MC/DC 20.90%.
- Confidence: 1,013 asserted lines, 1,750 execution-only lines and 2,190
  unexecuted lines; 78 MC/DC conditions have assertion-linked witnesses.
- Timings: initialization 65.6 ms, workspace 82.7 ms, adapter setup 94.2 ms,
  instrumented build 1049.5 ms, tests 21.7 s, evidence publication 293.8 ms,
  total 23.7 s.
- Raw evidence: 25.2 MB uncompressed, 1.63 MB compressed.

This is an honest dogfood baseline, not a claim that Supercov itself has complete
coverage. It proves that the tool can instrument and query its own native
`node:test` suite without measurement gaps.

## Coverage-confidence boundary

Supercov separates three claims that must not be conflated:

1. **Structural completeness:** every measured code obligation was observed.
2. **Causal confidence:** the observation was merely executed, action-linked,
   or occurred in a chain ending in a recognised passing assertion.
3. **Semantic correctness:** the assertion checks the right product behaviour.

Supercov can prove the first and provide evidence for the second. It cannot
prove the third without an independent specification or fault-injection method.
The user's intended working assumption is: if the tests and their assertions
are correct, 100% measurement-complete structural coverage plus strong asserted
and end-to-end attribution is good evidence that exercised implementation
behaviour is verified. Do not market it as proof that software has no bugs.

The explicit model still does not cover every input value or semantic partition,
every complete execution path, or every concurrency/order interleaving. Runtime
source created through `eval`/`Function` has no stable pre-run denominator.
Destructuring defaults in classic `for` initializers remain an explicit blocker
when found. A rare optional private member reached through an optional receiver,
such as `object?.#method?.()`, remains a semantic-safety boundary; ordinary
`this.#method?.()` is supported.

Native assertions and imported native-test `expect` matchers have explicit
assertion phases. Arbitrary custom assertion libraries still receive accurate
execution and test attribution but may remain execution-only unless a safe,
general recognition mechanism is added. Do not guess assertion attribution from
timing. Early cross-origin iframe events can likewise have exact structural/test
attribution but only fallback action confidence.

## Recommended next work

1. **Continue the agentic dogfood loop on Supercov itself.** Use `coverage gaps`,
   `file`, `decision`, `covers`, and `test` to select one high-value MC/DC gap,
   add one focused test, rerun, and prove the change with `diff`. Prefer closing
   correctness-sensitive transformer/runtime gaps rather than chasing easy
   lines.
2. **Dogfood unrelated repositories.** Keep a small compatibility matrix across
   Playwright, Vitest, Jest and native `node:test`, plus at least one unsupported
   runner that should degrade honestly to aggregate/background evidence.
3. **Broaden assertion confidence cautiously.** Investigate a generic adapter
   contract for Chai and custom expect libraries. Never label calls as assertions
   from a name heuristic alone.
4. **Keep measuring overhead.** Self-instrumentation is intentionally hostile:
   transformer fuzz loops amplify every runtime probe. Preserve the checked
   budgets and investigate regressions before relaxing them.
5. **Reconcile the local documentation drafts before committing them.** The
   following files exist untracked on this Mac and were deliberately excluded
   from 0.0.9 because at least `docs/evidence.md` says there is no query cache,
   while the product now uses an integrity-checked lazy query index:
   `docs/agent-loop.md`, `docs/cli.md`, `docs/coverage-model.md`,
   `docs/evidence.md`, `docs/getting-started.md`, `docs/supported-suites.md`, and
   `docs/verification.md`. Review each against current behaviour; do not bulk-add
   them.

## Commands for the next agent

```sh
cd /Users/domas/Developer/supercorp/supercov
git status --short
npm ci
npm test

# Run Supercov on itself.
node bin/supercov.js -- npm test
node bin/supercov.js runs latest coverage
node bin/supercov.js runs latest coverage gaps --metric mcdc

# Test262 is already cloned locally and ignored.
npm run test:test262 -- --limit 250 --minimum 200
```

Use immutable run IDs rather than `latest` when an agent loop spans sessions.
Do not silently prune run history, publish HTML, modify application source to
make coverage easier, or publish another npm version until a meaningful batch
is ready.
