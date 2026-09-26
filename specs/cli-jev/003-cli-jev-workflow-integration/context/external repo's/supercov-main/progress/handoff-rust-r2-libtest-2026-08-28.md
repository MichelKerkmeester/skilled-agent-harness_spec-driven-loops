# Supercov Rust R2/libtest handoff — 2026-08-28

## Resolution — later on 2026-08-28

The full-corpus stop failure below was resolved. A focused raw-transport
reproduction proved the missing `0:authoredProbe` observation moved to the
exact authenticated assertion phase of `tests::child_context` (the thread is
spawned during `assert_eq!` argument evaluation), not to the bare base test
context this handoff predicted. The isolated check around line 6710 was a
second stale expectation with the same cause and was corrected too. Both
corpus expectations now require the assertion-phase pair and explicitly reject
background-zero and base-context attribution. The complete corpus, all focused
gates and the full workspace suite passed afterward; the checkpoint is
recorded in `progress/current-execution-plan-2026-08-26.md`,
`progress/engine-master-plan-2026-08-24.md` and
`contracts/rust-coverage-v1/traceability.md`. The five focused compiler gates
are wired as `test:rust-compiler-spikes`, the never-constructed
`DestinationExists` builder error was removed, and
`spikes/rustc-backend/.supercov-cargo-*` workspace mirrors are now gitignored
(they are the production CLI's regenerable isolation caches).

## Stop point

The user explicitly asked the current agent to stop all implementation and
hand off. No process from the Rust spikes is still running. Nothing in this
worktree was committed, pushed, published or run through GitHub Actions during
this session.

Repository: `/Users/domas/Developer/supercorp/supercov`

- branch: `main`
- public HEAD: `fcb9345` (`Harden JavaScript coverage for agent workflows`)
- public package remains `supercov@0.0.17`
- worktree: intentionally very dirty; preserve all existing work
- governing plan: `progress/engine-master-plan-2026-08-24.md`
- sequenced plan: `progress/current-execution-plan-2026-08-26.md`

Do not use GitHub Actions for ordinary development validation. The user has
asked that hosted minutes be conserved; use local gates and reserve hosted
matrices for genuinely necessary release/platform checks.

## Active goal

Complete and publicly ship Supercov's independently correct,
zero-configuration Rust-language coverage frontend on the sole Rust engine
while preserving the verified JavaScript/TypeScript frontend as a regression
invariant. Close Rust R1-R4 without shortcuts: exact semantics, denominator,
test/worker/retry/assertion attribution, crash-safe lifecycle, independent
rustc/LLVM oracle validation, platform gates, dogfood and fair cold/cold plus
warm/warm overhead no greater than 1.10x. Rust remains private and fail-closed
until every promotion gate passes. Python resumes only after public Rust is
complete. The deferred strict-unmatched-waiver behavior and reachability-aware
E2E migration query are explicitly out of scope.

## Architectural state

- JavaScript/TypeScript uses the Rust engine in production. The old
  TypeScript/Babel engine is already removed.
- Rust-language coverage is private and fail-closed.
- R0 is green.
- R1 and R2 are in progress.
- R3 (Supercov-on-Supercov dogfood) and R4 (performance/platform/public
  promotion) remain open.
- The corrected R2 architecture runs each Cargo test artifact once through
  stock libtest, preserving the user's exact argv, scheduling and presentation.
  A rustc-commit-matched libtest companion emits authenticated libtest events,
  exact in-process test contexts and one shared mmap transport partitioned
  offline by context.
- The old public concrete/process-per-test Rust route still exists in
  `crates/supercov-engine/src/rust_run.rs` and related code. It must remain
  fail-closed and eventually be removed after the compiler path passes all
  promotion gates; do not publicly enable the compiler candidate yet.

## Work completed in the latest session

### 1. Stock-libtest argument fidelity

`crates/supercov-engine/src/rust_test_runner.rs` now projects only selection
arguments into libtest discovery. Actual stock execution receives the original
argv unchanged. Presentation and scheduling options are preserved. `--list`
and `--help` remain deliberately fail-closed non-execution surfaces.

### 2. Persisted transport and zero-test background evidence

`crates/supercov-engine/src/rust_compiler_test_runner.rs` strictly recombines
and repartitions persisted units before trusting them. Physical
`runner-invocation` health is separate from zero-copy `test-attempt` health.
Background evidence can be published even when no test is selected, without
inventing an attempt.

### 3. Libtest bundle schema isolation

`RUST_LIBTEST_COMPANION_BUNDLE_SCHEMA_VERSION` is now 2. Bundle contracts and
artifact names use schema 2, preventing accidental reuse of an older canonical
artifact with incompatible semantics.

### 4. Automatic native thread and subprocess context propagation

`crates/supercov-engine/runtime-assets/rust-mmap-runtime.rs` now contains
private macOS/Linux interposers:

- `pthread_create` captures the active test/assertion context and installs it
  in the new native thread, restoring the child afterward;
- `posix_spawn` and `posix_spawnp` replace an existing
  `SUPERCOV_RUST_CONTEXT_ID` only in the child environment;
- explicit `Command.env_remove(SUPERCOV_RUST_CONTEXT_ID)` remains an
  authenticated opt-out and produces background evidence;
- the parent/global environment is never mutated.

Focused gates passed for executor migration/cancellation and three concurrent
libtest threads with inherited, explicitly contextless and late child
processes.

Remaining propagation gates are important: direct `fork`/`execve`, custom
`pre_exec`, pre-existing task pools and Windows have not yet been proven. Do
not claim full arbitrary-process/platform support.

### 5. Crash-safe exact-libtest companion builder

The large builder was moved out of the CLI into
`crates/supercov-engine/src/rust_libtest_companion.rs` as
`build_exact_rust_libtest_companion`. The CLI hidden command is now a thin
wrapper.

Implemented properties:

- completed patched source trees are strictly authenticated and reused;
- source identity rejects unknown fields, compiler/runtime mismatch, changed
  exact toolchain source and changed patched-tree bytes;
- source preparation and companion publication use persistent kernel locks;
- killed holders release locks automatically;
- on Unix, the builder duplicates the locked open-file description into the
  rustc child before exec, so killing the builder cannot let a recovery process
  publish over a compiler still writing;
- stale cleanup is limited to exact builder-owned partial prefixes and refuses
  symlinks/special files;
- build output and publication partials have RAII cleanup;
- artifact and containing directory bytes are synced before bundle
  publication;
- existing final artifacts must be byte-identical;
- completed bundle/artifact/source identities are reselected and verified.

The builder lock is bounded at five minutes, so a genuine stuck owner produces
an explicit error rather than an indefinite silent wait. Windows lock-handle
inheritance is not implemented; Rust remains private there.

### 6. New lifecycle spike

`scripts/rust-libtest-builder-lifecycle-spike.mjs` is new. It proved with the
real toolchain that two simultaneous builders converge on the same bundle and
that SIGKILL recovery publishes one authenticated companion with no partial
debris. It is not yet wired into a standard package script/release gate.

## Local gates that passed

All of these passed after the latest changes:

- `cargo test --workspace`
  - CLI: 20/20
  - contracts: 19/19
  - engine: 313/313
- `cargo clippy --workspace --all-targets -- -D warnings`
- `cargo fmt --all -- --check`
- `npm run test:runtime` (8/8)
- `npm run test:rust-assets` (24 packaged assets exact)
- `node scripts/package-preflight.mjs`
- `node scripts/rust-libtest-companion-spike.mjs`
- `node scripts/rust-async-attribution-spike.mjs`
- `node scripts/rust-subprocess-attribution-spike.mjs`
- `node scripts/rust-custom-harness-spike.mjs`
- `node scripts/rust-libtest-builder-lifecycle-spike.mjs`

The last four/five focused compiler gates take roughly one minute each locally.

## Full-corpus stop failure

The post-change full run was executed locally:

```text
node scripts/rustc-backend-spike.mjs
```

It ran for about 30 minutes and reached the final comparison, then failed:

```text
AssertionError: general point instrumentation lost previously proven
exact-context observations: 0:9107668194261872945
at scripts/rustc-backend-spike.mjs:6645
```

This is very likely a stale corpus expectation caused by the intentionally new
thread inheritance behavior, not lost product evidence:

- `9107668194261872945` is `authoredProbe`;
- line 6640 explicitly expects ``0:${authoredProbe}`` in
  `previouslyProvenContextPairs`;
- context `0` is background, despite the assertion text saying
  "exact-context";
- the fixture `tests::child_context` at
  `spikes/rustc-backend/fixture/src/lib.rs:1019` runs
  `std::thread::spawn(|| authored(true))`;
- before the new `pthread_create` interposer this child observation was context
  zero;
- after automatic propagation it should be owned by the exact
  `tests::child_context` context;
- the same script's later isolated check (around lines 6678-6715) already
  requires `authoredProbe` under `isolatedTestContext`, which agrees with the
  new architecture.

Do not simply delete the expectation. First inspect the full concurrent raw
transport and prove exactly where the observation moved. Then replace the
background pair with the deterministic `testContextId('tests::child_context')`
pair and add an explicit negative assertion that this invocation no longer
appears under context zero. Also check that no unrelated background evidence
was promoted. Rerun the focused concurrent slice if it can be extracted; the
entire corpus must then pass again before recording the checkpoint.

## Recommended immediate sequence

1. Instrument/debug only the concurrent section around
   `scripts/rustc-backend-spike.mjs:6460-6720` and dump the matching
   `(context, ordinal)` records for `authoredProbe`.
2. Confirm the sole missing `0` observation became
   `testContextId('tests::child_context')`, with no duplication or leakage.
3. Correct the stale corpus assertion factually and add the negative background
   assertion.
4. Rerun:
   - `node scripts/rust-async-attribution-spike.mjs`
   - `node scripts/rust-subprocess-attribution-spike.mjs`
   - `node scripts/rust-custom-harness-spike.mjs`
   - `node scripts/rust-libtest-builder-lifecycle-spike.mjs`
5. Rerun `cargo test --workspace`, clippy, format, runtime/assets/preflight.
6. Rerun the complete `node scripts/rustc-backend-spike.mjs` corpus. Treat any
   semantic/evidence difference as a release blocker.
7. Only after every gate is green, update
   `progress/current-execution-plan-2026-08-26.md`,
   `progress/engine-master-plan-2026-08-24.md` and
   `contracts/rust-coverage-v1/traceability.md` with a dated, exact checkpoint.

## Important review points before accepting the builder work

- Add or retain platform-specific proof for the `dlsym`/pthread/spawn ABI on
  macOS and Linux GNU/musl. Current focused proof is macOS.
- Prove thread-creation failure, nested threads, concurrent different test
  contexts, `posix_spawnp`, child launch failure and explicit env removal.
- Decide and implement direct `fork`/`execve`/custom `pre_exec` propagation or
  an explicit fail-closed detection boundary.
- Implement/prove Windows process/lock inheritance before Windows promotion.
- `RustLibtestCompanionError::DestinationExists` may now be obsolete after
  authenticated reuse; clean it only after confirming no caller needs it.
- The new lifecycle spike is not in `package.json`; wire it into the appropriate
  local/manual Rust gate after the full corpus is green.
- `--list` and `--help` stock-libtest modes remain explicit open surfaces.

## Dirty worktree warning

The dirty tree predates and includes much more than the latest builder patch:
approximately 8,727 insertions and 1,089 deletions across 42 tracked files,
plus new compiler/runtime/spike files and fixtures. Do not reset, checkout or
discard it. In particular, preserve the untracked Rust fixtures and the
existing `spikes/rustc-backend/.supercov-cargo-eecdd71bbfdc99dd1531da73/`
directory until its ownership is understood.

Relevant new/untracked files include:

- `crates/supercov-engine/runtime-assets/rust-libtest-events.rs`
- `crates/supercov-engine/src/rust_libtest_companion.rs`
- `crates/supercov-engine/src/rust_libtest_events.rs`
- `scripts/rust-async-attribution-spike.mjs`
- `scripts/rust-custom-harness-spike.mjs`
- `scripts/rust-libtest-builder-lifecycle-spike.mjs`
- `scripts/rust-libtest-companion-spike.mjs`
- `scripts/rust-subprocess-attribution-spike.mjs`
- the async/custom/libtest-presentation/subprocess/no-std fixtures under
  `spikes/rustc-backend/`

Debug scratch may also remain outside the repository from earlier work,
including narrowly named `/tmp/supercov-libtest-debug.*` and
`/var/folders/.../T/supercov-rust-*-attribution-*` directories. Treat those as
cleanup candidates only after resolving exact ownership; they are not part of
the repository checkpoint.

## Publication state

Do not publish this state. Rust remains private, the full corpus is not green,
and no formal R2 checkpoint was written for the latest changes. There is no
commit to push and no release to trigger.
