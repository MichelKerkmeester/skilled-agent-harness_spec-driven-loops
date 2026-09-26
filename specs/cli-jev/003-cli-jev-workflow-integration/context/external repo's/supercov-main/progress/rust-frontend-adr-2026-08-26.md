# Rust frontend insertion and attribution ADR — 2026-08-26

Status: accepted for private implementation. Rust is not yet a claimed product
frontend.

## Implementation checkpoint — 2026-08-26

The private architecture now runs end to end through the public command path:

- command intent plus manifest fallback detects JavaScript, Python and Rust;
  a pure `cargo test` invocation selects Rust automatically, while a genuinely
  mixed command fails closed until combined polyglot publication exists;
- Cargo metadata discovers every workspace member inside Supercov's isolated
  copy, the owned source transform injects a generated std-only runtime, and
  the user's checkout is never edited;
- Cargo builds once, Supercov enumerates three libtest artifacts in its own
  workspace, and each selected test executes in a separate process with exact
  run/worker/test/retry/phase identity;
- strict owned observations publish as evidence v3 and the shared Rust
  analyzer, typed index and agent queries read them without a Rust-specific
  report path;
- Supercov dogfood completed 165 tests with zero failures and published run
  `2026-08-25T21-52-35-740Z`; `runs latest coverage` reconstructed 39 Rust
  files and correctly reported the private model as measurement-incomplete;
- fresh-run integrity and staleness are language-aware, custom run IDs sort by
  `startedAt`, JavaScript waivers cannot contaminate Rust queries, ignored
  libtest cases are recorded as skipped, and passing per-test processes are
  quiet while failures retain stdout/stderr.

This does not make Rust public-ready. Cargo test-name/libtest filters, doctest
execution, nextest/cross, macro-expanded/generated code, const/no_std targets,
the remaining structural branch probes and assertion linkage are still release
blockers. Unsupported mixed-language execution already refuses partial output;
the remaining runner variants must follow the same fail-closed rule.

### Measured performance checkpoint

The initial 1.10x target is not met and remains a release blocker. On the
Supercov workspace on this machine:

- warm uninstrumented `cargo test --workspace`: 2.89–3.01s;
- clean-target uninstrumented run: 20.67s;
- owned Rust coverage after the workspace fix: 33.15s, or 1.60x cold/cold and
  roughly 11x against a warm ordinary run;
- covered breakdown: 75.5ms workspace, 3.91s transformation/setup, 21.43s
  clean instrumented build, 6.09s parallel process-per-test execution, and
  1.63s evidence publication.

The first dogfood implementation accidentally omitted root `target/` from the
isolated-copy exclusions and cloned roughly 24GB of Cargo artifacts per run.
That path measured 25.65s; after excluding `target/` and copying small files
normally instead of invoking per-file APFS clonefile, the same warm internal
copy command measured 0.97s including Cargo launcher startup (actual copy work
about 0.1–0.2s). Parallel exact-test processes reduced execution from 8.30s to
6.09s. Reaching 1.10x now requires a crash-safe, fingerprinted instrumented
Cargo cache/stable workspace plus reductions in transformation, process and
archive overhead; no performance claim should use a warm baseline against a
fresh Supercov target.

An exact-input stable workspace prototype on 2026-08-26 moved all generated
state under `.supercov/cache/workspace/<project>` and authenticated the input
fingerprint, transformed sources, toolchain, command and emitted libtest
artifacts before reuse. This removed the repeated transformation and Cargo
compile, but did not satisfy the release gate:

- fair clean/clean copies: ordinary 24.87s, Supercov 34.06s = **1.37x**;
- fair warm/warm copies: ordinary 2.74s, Supercov 11.11s = **4.05x**;
- warm Supercov internals: 1.70s cache authentication, 0.25s setup, 0.78s
  Cargo validation, 4.72s exact process-per-test execution, 1.55s archive
  publication, plus cache publication and lifecycle overhead.

The old top-level `supercov/workspace/` location was self-invalidating when
dogfooding this repository because it appeared to be project input. New state
must remain inside `.supercov`; marked old workspace stores are migrated to
deferred trash. The remaining gap is architectural rather than a build-cache
problem: exact attribution needs an owned in-process libtest context carrier,
and evidence must be buffered/encoded without expanding and compressing the
same repeated identities per test. Process-per-test remains the correctness
fallback until the in-process path passes the same attribution and crash
gates.

## Product boundary

Rust user runs are measured only by Supercov-owned probes. `rustc -C
instrument-coverage`, LLVM profiles and `llvm-cov` are development oracles;
they are not invoked by the product, required on the user's machine, or used
as a degraded fallback. The existing Cargo test command remains the only user
configuration.

## Decision

The first owned Rust frontend has four layers:

1. Cargo metadata identifies workspace packages, targets, crate roots and
   source ownership in the isolated Supercov workspace.
2. A pinned, lossless rust-analyzer concrete-syntax frontend discovers source
   obligations and applies byte-range edits ahead of compilation. It never
   rewrites the user's real checkout.
3. A generated, std-only Rust probe runtime is compiled with the instrumented
   crates. Product execution does not depend on an external coverage crate.
4. Cargo builds tests once with `--no-run --message-format=json`. Supercov
   enumerates the resulting libtest binaries and runs each selected test in a
   separate supervised process. The process environment carries exact run,
   worker, test, retry and phase identity, so observations from every
   instrumented workspace crate share one exact test identity without relying
   on unstable libtest callbacks or thread-local test discovery.

Process-per-test is the initial correctness architecture, not an optimisation.
It preserves exact attribution across ordinary threads, async executors and
workspace-crate boundaries. Batched in-process execution may be added later
only with an equally exact runner/context carrier.

## Why not the other insertion points

- A custom `rustc_driver`/MIR pass uses permanently unstable compiler APIs,
  requires the exact compiler internals plus `rustc-dev` and LLVM libraries,
  and must be built for each rustc revision. It is not a universal stable-Cargo
  bootstrap.
- An out-of-tree LLVM pass is tied to rustc's exact LLVM ABI and sees lowered
  control flow after important Rust source structure and macro provenance have
  been transformed. It is a poor authority for the source denominator and
  per-condition MC/DC identities.
- Stable `-C instrument-coverage` is intentionally retained as an independent
  structural oracle. Its profile format may require LLVM tools matching the
  compiler, and consuming it in user runs would violate Supercov's ownership
  rule.

Cargo's documented `RUSTC_WORKSPACE_WRAPPER` remains useful for observing the
actual compiler launch graph and preventing uninstrumented workspace members
from silently entering a run. It does not itself provide instrumentation.

## Frozen initial Rust coverage model

The private frontend will emit evidence v3 with a Rust-specific coverage model
and explicit obligations for:

- executable statements and function/closure entries;
- `if`, `while`, match guards and assertion conditions;
- source-ordered atomic conditions in `&&`/`||` control decisions, preserving
  probe-v2's unreached/false/true ternary vectors;
- true/false outcomes, logical short-circuit/right-evaluated outcomes;
- zero/entered outcomes for `for` and `while` loops;
- selected/not-selected match arms and `?` continue/early-return outcomes.

The model is source-oriented. Generic monomorphisations share their source
obligation, matching the user-visible question "is this source behavior
covered?"; an expansion/instantiation query can be added without changing the
base denominator.

## Private-stage limitations and release blockers

The first source frontend must declare, never hide, any unmeasured surface:

- declarative-macro bodies and proc-macro/derive-generated executable code;
- build-script/generated Rust outside the frozen source graph;
- `const` evaluation and `const fn` contexts where runtime calls are illegal;
- `no_std` and unsupported targets until an allocation-free compatible runtime
  exists;
- doctests until rustdoc launch and source mapping are owned;
- inline assembly, FFI implementation bodies and dynamically loaded code;
- tests that cannot be reproduced as an exact libtest process.

These limitations make early Supercov dogfood diagnostic, not GA. Complete
Rust support requires either closing them in the lossless frontend or adding a
versioned compiler-expansion backend. If a compiler backend is required,
Supercov will ship automatically selected packages keyed by rustc commit and
platform; it will not ask users to install or configure third-party coverage.

## Correctness gates

Before public Rust support:

1. original and instrumented programs must have identical values, panics,
   stdout/stderr, drops, side-effect ordering, borrow behavior and test results;
2. checked-in statement/branch facts must agree with the rustc/LLVM development
   oracle wherever the models overlap;
3. independent MC/DC goldens must cover short-circuiting, masking, overloaded
   calls around conditions, panics, `?`, matches and loops;
4. macros, generics, async, threads, subprocesses, retries, ignored tests,
   fixtures, workspaces and crash recovery need black-box corpora;
5. evidence v3, attribution, query, minimization, integrity and cleanup use the
   existing shared Rust engine without a Rust-only analyzer;
6. Supercov must dogfood its own full Rust workspace with source unchanged and
   every limitation visible in the query model.

## Decision evidence

This decision was checked against rustc 1.95.0 (LLVM 22.1.2). The official
rustc documentation describes stable `-C instrument-coverage` as LLVM
intrinsic/profile instrumentation and warns that compatible LLVM tools may
need to match the compiler. The rustc development guide states that external
compiler-driver APIs are inherently unstable and require compiler/LLVM
components. Cargo documents `RUSTC_WORKSPACE_WRAPPER` as a stable wrapper for
workspace-member rustc invocations.

- https://doc.rust-lang.org/rustc/instrument-coverage.html
- https://rustc-dev-guide.rust-lang.org/rustc-driver/external-rustc-drivers.html
- https://rustc-dev-guide.rust-lang.org/rustc-driver/intro.html
- https://doc.rust-lang.org/cargo/reference/environment-variables.html
