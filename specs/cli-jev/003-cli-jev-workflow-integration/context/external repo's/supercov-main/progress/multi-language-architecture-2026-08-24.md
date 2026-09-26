# Multi-language coverage architecture — Phase 6 (2026-08-24)

Companion to `engine-master-plan-2026-08-24.md` and
`engine-research-2026-08-24.md`. Target: eventually every language at the
same evidence quality Supercov gives JavaScript today — structural MC/DC,
per-test attribution, assertion linkage — not a degraded second tier.

## Product rule: Supercov measures every user run

Every user run is measured entirely by Supercov. coverage.py, LLVM
source-coverage/profdata, Go native coverage and comparable external engines
are development-only differential oracles. They may run in Supercov's own CI
and generate checked-in conformance facts, but they are never invoked,
imported, configured or required by a user's run. There is no native-coverage
fallback and no lower-quality product tier.

The existing test command is the only user configuration. Supercov discovers
the launch graph, instruments the isolated workspace with its own probes and
automatically injects the smallest unavoidable target-language runtime and
runner hooks. The same rule applies to interpreted and compiled languages.

## What "full quality" decomposes into

The coverage-confidence boundary is unchanged and language-independent:

1. **Structural completeness** — every measured obligation was observed.
2. **Causal confidence** — which test observed it, whether execution was
   linked to a recognised passing assertion, and through which test kind.
3. **Semantic correctness** — whether the assertion checks the right
   behaviour. Out of reach in every language, forever, without an independent
   specification or fault injection.

Only two things actually vary per language:

- **where Supercov-owned probes are inserted** (source transform, IR/MIR pass,
  compiler/plugin API), and
- **how the current test/phase identity propagates** to a probe.

Everything else — the evidence archive contract, the analysis engine, MC/DC
pair search, the query surface, waivers, the run store, `diff` — is shared
and is never rewritten per language. Probe v2's per-decision bitmap model is
deliberately language-neutral so that this stays true.

This boundary is now executable rather than prose-only in
`contracts/frontend-v1`. Each frontend emits one contribution with a complete
manifest plus one capability declaration for every runner actually observed
in that run. Structural limitations are frontend-wide; attribution
limitations are runner-specific. Any non-exact identity axis requires an
explicit limitation, and parallel-unattributed execution cannot claim exact
test/action/assertion causality. The Rust contracts crate rejects malformed or
internally impossible declarations. The first analyzer-entry validator also
requires exact agreement with manifest limitation IDs and actually observed
runners; validates run/worker/test/retry scope; and rejects unknown, duplicate
or cyclic phase causality before shared analysis. Persisting declarations in a
versioned archive namespace begins with the first owned Python frontend. Every
frontend must use this exact protocol rather than introducing an
ecosystem-specific report model.

## Rust ownership boundary

Supercov has one engine, not one implementation per ecosystem. The default is
Rust for discovery, isolated-workspace construction, ahead-of-run transforms,
manifest generation, process supervision, evidence framing/compression,
merging, attribution analysis, MC/DC pair search, indexing, querying, diffs,
retention and every agent-facing response. This includes work that is merely
"fast enough" in a target language: the reason to centralise it is correctness
and maintainability as much as speed.

A target-language component is justified only when it must run inside the host
to access capabilities a static Rust process cannot observe safely:

- module/import and dynamic-code hooks;
- test, worker, retry and phase lifecycle callbacks;
- async/task-local context propagation;
- assertion-framework callbacks;
- compiler or IR APIs that are only stable through that toolchain;
- the allocation-free probe fast path itself.

Those components are versioned shims over frozen contracts. They activate an
epoch, update local probe state, and emit records; they do not calculate a
coverage score or own a second report model. For languages that can be
pre-instrumented in the isolated workspace, the Rust frontend does that work
and the shim handles only modules generated or loaded after launch. If a host
requires its native compiler library (a plausible OCaml frontend case), that
adapter is treated like a compiler plugin feeding the Rust engine—not an
excuse to fork analysis logic.

## Owned frontend and independent oracle

Each language has two deliberately separate systems:

1. **Product frontend.** Supercov-owned instrumentation emits probe-v2 state,
   with a thread-local/task-local epoch selecting the active arena and thin
   Supercov-generated assertion/runner shims. This is the only measurement
   path available in a user run.
2. **Development oracle.** Supercov's conformance suite invokes the strongest
   independent engine available on pinned programs and compares its structural
   facts with the owned frontend. Oracle importers are compile-gated test
   infrastructure, are not packaged as runtime dependencies and cannot be
   selected by product orchestration.

The oracle prevents a novel frontend from validating itself. It does not
define Supercov's denominator: where an external engine cannot express a
Supercov obligation, independent golden models and language specifications
cover the gap. The product contract never shrinks to match an oracle's cap or
granularity.

## The attribution ladder

This is the load-bearing insight. Attribution quality is a property of the
execution model, not of the language:

| Rung | Execution model | Attribution | Cost |
| --- | --- | --- | --- |
| 1 | Process per test | **Exact** — no interleaving exists to disambiguate | Supercov probe buffer per process |
| 2 | Serial within one process | **Exact** — swap/reset Supercov arenas at test boundaries | Small generated runner shim |
| 3 | Parallel within one process, context propagated | **Exact** — owned probes, task-local epoch selects arena | Supercov source/IR/MIR instrumentation |
| 4 | Parallel, no context propagation | Aggregate only | Declared limitation, never faked |

Rung 1 is the *common case* for modern Rust: `cargo nextest`'s whole
architecture is process-per-test. It is not an edge case, and its attribution
is strictly better than our JS path because there is no interleaving at all.
Rung 3 requires the owned frontend's context carrier; thread-local access on
x86-64/ARM64 is a couple of instructions, comparable to native counter
increments.

## Assertion linkage mechanisms, in order of preference

1. **Official framework listener APIs** — best available, no source rewriting,
   more reliable than what we do in JS today. GoogleTest's
   `TestEventListener::OnTestPartResult` reports every assertion with its
   result; Catch2 has equivalents.
2. **Macro or header shims** — workspace-only, no user repo changes.
   `assert()` comes from `<assert.h>` (shadow via forced include);
   Rust `assert!`/`assert_eq!` and third-party assertion macros
   (`pretty_assertions`, `claim`) are macros, so they are syntactically
   identifiable and hygienic — *easier* to wrap than JS's dynamically
   imported `expect`.
3. **Workspace source transform** — the JS approach, for languages with
   neither of the above.

Go deserves a note: it has no macros, but `testing.T` is passed *explicitly*
to every test and `t.Error`/`t.Fatal` are ordinary methods on it. That value
identifies the test better than any ambient context, which sidesteps the
goroutine-local problem for attribution entirely.

## Per-language matrix

| Language | Supercov product insertion | Development oracle only | Attribution | Assertion linkage |
| --- | --- | --- | --- | --- |
| JavaScript/TS | Rust source transform + generated JS/browser runtime | Test262 semantics; Clang golden MC/DC models | rung 3, AsyncLocalStorage carrier | source transform for native `assert` and imported `expect` |
| Python | Rust source transform + generated stdlib import hook | coverage.py statements/arcs; CPython corpus | rung 3, `contextvars` carrier | generated pytest hook plus assertion-source instrumentation |
| Rust | owned rustc MIR/LLVM plugin or source transform, decided by S8 | rustc/LLVM coverage and rustc corpus | rung 1–3 depending runner | `assert!` macro shim; runner APIs |
| C/C++ | owned LLVM pass/source transform | clang `-fcoverage-mcdc`, GCC/LLVM corpora, csmith | rung 1–3 depending runner | GoogleTest/Catch2 listeners and forced-include assertion shim |
| Go | owned source transform/compiler hook | `go test -cover` and Go corpus | explicit `testing.T` plus owned goroutine context | instrument `testing.T` outcomes and assertion helpers |
| OCaml | compiler-libs/PPX frontend emitting probe v2 | independently selected native oracle | runner-dependent and declared | framework hooks/PPX assertion sites |
| JVM / Ruby / PHP | owned bytecode/source/runtime hooks | independently selected per language | TBD before support | TBD before support |

## Ship gate: no language without its own oracle

**Principle: a language does not ship until it has (a) a semantic-equivalence
corpus proving our instrumentation preserves program behaviour, (b) an
explicitly declared attribution tier per supported runner, and (c) its
limitations enumerated in the measurement model.**

This is the real cost driver, and it is what makes "perfect accuracy" a
checkable claim rather than marketing. JavaScript's credibility rests on
65,053 baseline-passing Test262 scenarios plus the independent Clang/LLVM
MC/DC oracle. The equivalents:

- **Rust** — rustc's own test suite; MC/DC cross-checked in development against
  rustc's native coverage output on the same programs.
- **C/C++** — GCC/LLVM torture tests plus csmith-generated programs;
  MC/DC cross-checked against `llvm-cov` (already our oracle today).
- **Python** — CPython's test suite; development-only cross-check against
  coverage.py for statement/branch agreement plus independent MC/DC goldens.
- **Go** — Go's own test suite; development-only cross-check against
  `go test -cover`.

A language whose corpus is not green is a language we do not claim support
for. No exceptions, including for demo purposes.

## Known limits — per-language and shared

1. **Semantic correctness** — unchanged, language-independent, permanent.
2. **Coverage build ≠ release build.** Instrumenting at low optimisation
   changes what a "decision" is once inlining and branch folding apply. Every
   C/C++ coverage tool carries this caveat; we document it rather than
   pretend otherwise.
3. **Monomorphisation and macro instantiation is a design decision, not a
   bug.** One source decision instantiates N times across Rust generics and
   C++ templates. Per-instantiation and per-source-location MC/DC are both
   defensible; LLVM merges by location. We must pick one, document it, and
   probably offer expansion as an option.
4. **Work-stealing async requires ecosystem cooperation.** Thread-local
   breaks across await points in tokio; correct attribution needs task-locals
   or `tracing`-style span propagation. This is the same dependency as our JS
   reliance on AsyncLocalStorage — solvable, not free.
5. **`unsafe`, inline asm, FFI boundaries, `dlopen`, JIT, `include!`** —
   uninstrumentable; declared through the limitation machinery we already
   have. The JIT/`dlopen` class is the direct analog of JS `eval`: no stable
   pre-run denominator exists.
6. **Cross-language runs already work.** The coverage carrier is HTTP headers
   and environment variables, which is language-neutral by construction — a
   Playwright test driving a Rust server needs no new transport, only a
   collector on the server side.

## New spikes

- **S8 (→ Phase 6, Rust): insertion-point ADR.** Establish rustc's MC/DC
  support status and stability; then decide owned insertion between a rustc
  MIR pass, an out-of-tree LLVM plugin, and a source transform. Must include
  the *ongoing maintenance cost* of tracking LLVM/rustc release cadence,
  which is the dominant long-term cost of this phase. Exit: written ADR with
  a maintenance-burden estimate per option.
- **S9 (→ Phase 6, C/C++): oracle boundary.** Determine clang's current
  per-decision condition cap and whether it is configurable. Our JS
  implementation already observes decisions with 10 conditions; if clang
  cannot express those, its oracle comparison must declare that boundary and
  independent goldens must cover the remainder. Exit: cap and comparison
  boundary documented.
- **S10 (→ Phase 6): attribution-ladder validation.** End-to-end proof of
  rung 1 on a real repository: instrument a Rust crate with Supercov-owned
  probes, run under `cargo nextest`, and produce per-test evidence in our
  archive format. A separate development job compares structural verdicts
  with `llvm-cov`; the product run does not invoke it. Exit: a fixture in the
  golden corpus, in the same shape as today's JS fixtures.

## Ordering

Language order: Python first (already Phase 5 — largest agent-coded
ecosystem, and the stdlib import-hook mechanism is de-risked by Python and
pytest itself), then Rust, then C/C++, then Go. JVM/Ruby/PHP only
once the shared core has absorbed four languages without accumulating
per-language special cases in the engine.

Within each language the sequence is:

1. **Freeze the language coverage model** independently from any oracle.
2. **Build the development oracle harness** and checked-in differential facts;
   compile-gate it away from normal product builds.
3. **Implement owned insertion and the complete manifest** in Rust, with only
   the smallest generated target-language runtime required at execution.
4. **Add automatic launch-graph and runner integration** so the pre-existing
   test command is sufficient.
5. **Add exact attribution and assertion linkage** through official runner,
   compiler, macro or framework surfaces and owned context propagation.
6. **Make semantic, oracle, concurrency, crash and package corpora green.**
   Support is not claimed before this point.
7. **Dogfood arbitrary real repositories** and verify that removing every
   external coverage dependency leaves results unchanged.
