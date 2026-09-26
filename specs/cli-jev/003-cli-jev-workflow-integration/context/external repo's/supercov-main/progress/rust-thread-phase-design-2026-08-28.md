# Rust thread-phase transport design — 2026-08-28

## Problem

Automatic `pthread_create` context inheritance is exact for threads that end
before their creating test does, but unsound for shared pools: a pool thread
created lazily during test A keeps A's context forever, so work submitted by
test B (concurrently or later) is falsely attributed to A. The old behavior
(env-context fallback) was safe (background) but inexact. Exactness requires
distinguishing thread-owned work per creating test and failing closed when a
thread's lifetime escapes its creator.

## Decision: join-bounded thread phases

Every inherited native thread runs under a fresh derived **thread-phase
context**, not the parent context directly. Offline partitioning accepts a
thread phase's records into its root test only when the thread **ended before
the root test finished** (by global transport commit order). Otherwise every
record under that thread phase is background with an explicit limitation.
This makes joined/scoped threads exact, and makes all pool work — including
work the creating test itself did on the pool — deterministic, safe
background. Teardown-racing threads that end after the test return are also
background (conservative, deterministic).

## Transport v3 (new frozen contract `rust-probe-transport-v3`)

- Magic `SCVRUST3`, header version 3; layout otherwise unchanged.
- Existing kinds: 1 hit, 2 decision, 3 ordinal hit, 4 assertion phase.
- New kind 5 **thread phase**: context = derived child, id = "", value =
  parent (8 LE) + nonce (8 LE). Child id = FNV-1a over
  `supercov-rust-thread-phase-v1\0` + parent LE + nonce LE, with the 0/MAX
  avoidance rewrite used by test/assertion ids.
- New kind 6 **thread end**: context = the thread-phase child, empty payload.
  Committed when the thread's start routine returns (normal or after unwind
  catch by the interposer wrapper — panics propagate after commit).
- New kind 7 **test boundary**: context = the exact test context, empty
  payload. Committed when the test's context is exited: by the companion's
  context guard drop in `rust-libtest-events.rs`, and by the MIR test exit
  path via new export `__supercov_rt_exit_test_context(context, previous)`
  (Return and UnwindResume blocks).

## Acceptance rule (offline, in the engine partitioner)

For a record under context C, resolve the phase chain (assertion phases and
thread phases interleave arbitrarily) to its root test context R. Collect the
thread phases T1..Tn on the chain. The record is attributed to R (through the
existing phase projection) iff every Ti has a kind-6 end whose descriptor
index precedes R's kind-7 boundary descriptor index. If R has no boundary
(killed/aborted test) or any Ti lacks an end before it, the record is
background with limitation
`RUST_THREAD_OUTLIVED_TEST: <root test>` (exact wording TBD at
implementation). Thread-phase records themselves are authenticated like
assertion phases (derived-id recomputation); tampered or unparented phases
fail closed as today.

## Ripple surface (enumerated)

1. `crates/supercov-engine/runtime-assets/rust-mmap-runtime.rs` — magic,
   kinds 5/6/7, thread-phase derivation in the pthread interposer wrapper,
   `__supercov_rt_exit_test_context` export.
2. Runtime export lists: `rust_compiler_orchestration.rs` (production static
   runtime assembly) and the corpus `buildSharedRuntime`.
3. `crates/supercov-engine/runtime-assets/rust-libtest-events.rs` — context
   guard commits the boundary on drop (companion schema version bump to 3).
4. `spikes/rustc-backend/src/main.rs` — test exit blocks call
   `__supercov_rt_exit_test_context(context, previous)`.
5. `crates/supercov-engine/src/rust_probe_transport.rs` — strict v3 parser,
   corruption tests for each new kind.
6. Partitioners: `rust_compiler_test_runner.rs`, `rust_phase_projection.rs`,
   `rust_doctest.rs` translator — chain resolution + acceptance rule +
   background limitation.
7. Contracts: new `contracts/rust-probe-transport-v3/` +
   `crates/supercov-contracts` assets and registration; companion bundle
   schema 3.
8. Corpus `scripts/rustc-backend-spike.mjs` — createTransport/readTransport
   v3, validatePhaseContexts thread-phase authentication, child_context and
   isolated-slice expectations move one level (authoredProbe under the
   thread phase whose parent is the assertion phase), nested-thread chains.
9. New pool gate: fixture with a lazily created shared worker used by two
   tests; prove the second test's pool work and the creator's own pool work
   are background with the explicit limitation, and that a joined thread
   remains exactly attributed.
10. Spike scripts that assert via engine queries (subprocess/async/custom)
    should remain valid unchanged — verify, don't assume.

## Explicitly rejected

- Reserved-ordinal sentinels to avoid a version bump (overloads probe
  semantics).
- Per-hit retired-context checks (runtime cost, still unsound during
  concurrent overlap).
- Executor-specific task instrumentation (rayon/tokio APIs are not a stable
  boundary; async tasks are already exact via coroutine markers).
