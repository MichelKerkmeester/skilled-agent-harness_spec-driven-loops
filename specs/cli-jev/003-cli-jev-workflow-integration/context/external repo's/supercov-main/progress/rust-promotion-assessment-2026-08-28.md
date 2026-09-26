# Rust production promotion assessment — 2026-08-28

## How the public route flips (R2 → public)

Today `supercov <cargo test…>` detects Rust and enters the legacy
source-instrumentation route (`rust_run::run_direct_rust` from
`crates/supercov-cli/src/main.rs`). The compiler route
(`rust_compiler_run::run_direct_rust_compiler`) is reachable only through the
hidden `__run-rust-compiler` command and currently runs with
`require_public_capabilities: false` against the spike-built companion.

The promotion mechanism already exists and is capability-gated:
`RustCompilerCompanionCapabilities::is_public_ready()` requires all six
handshake bits (expanded-HIR provenance, runtime MIR probes, generated-source
provenance, CTFE tracing, rustdoc doctest tracing, exact test-harness
attribution). Promotion therefore means:

1. Ship a production compiler companion (the spike wrapper's functionality
   productized into a shipped binary per native target, handshake-bound to the
   exact rustc commit) — the largest remaining engineering item.
2. Route the public CLI Rust path to the compiler orchestration with
   `require_public_capabilities: true`.
3. Delete `rust_run.rs` and its integrations once R3/R4 gates pass, migrating
   any still-unique lifecycle/cache behavior.
4. Update fixtures/gates that exercise the legacy route.

None of this should begin until the thread-phase transport v3 work is green,
R3 dogfood has run against the compiler route, and the R4 performance gates
pass on it.

## Windows plan (blocked on a Windows environment)

- Builder: implement lock-handle inheritance for the libtest companion
  builder (the Unix path duplicates the locked open-file description into the
  rustc child; Windows needs handle inheritance through
  `PROC_THREAD_ATTRIBUTE_HANDLE_LIST` or an equivalent kill-on-close Job
  Object arrangement consistent with `lifecycle.rs`).
- Propagation: the pthread/posix_spawn/exec interposers are POSIX-only; the
  Windows analogue needs a decision between detours-style interposition
  (heavy) and an explicit fail-closed boundary (threads/processes created by
  Windows APIs run background with a limitation). Recommendation: fail-closed
  boundary first — it is sound, cheap, and consistent with keeping Rust
  private on Windows until real interposition is proven.
- Proof requires a Windows machine or deliberate hosted runs; per repo
  policy, batch those into a single hosted matrix when the rest of R2 is
  locally green, rather than iterating over CI.

## Linux GNU/musl proof status

A container gate exists (session scratchpad `linux-proof.sh`): rust:1.95
image, tree copy, full toolchain, all five focused spikes. It reached the
toolchain step and was interrupted first by host-disk exhaustion, then by
colima VM metadata corruption that needs a manual VM recreate
(`colima delete -f && colima start`) the permission classifier would not let
the agent run. Rerun it after the VM is recreated and after the thread-phase
v3 work lands (the proof must cover the final runtime, not the interim one).
musl needs the same script against a musl-host toolchain image; expect
rustc-dev component availability to be the sticking point on Alpine.

Update 2026-08-29 — the glibc proof is green (all five focused gates on
`aarch64-unknown-linux-gnu`). The musl attempt characterized two hard
blockers that keep Rust-language coverage fail-closed on musl hosts:

1. Alpine's rustup `rustc-dev` ships the compiler internals without rlibs,
   and musl's default `+crt-static` forces fully static linking, so a
   rustc_private wrapper only builds with `-C target-feature=-crt-static`
   (verified: it then builds cleanly).
2. More fundamentally, default static musl test binaries have no dynamic
   linker, so the `dlsym(RTLD_NEXT)` interposers cannot resolve the real
   `pthread_create`/`posix_spawn`/exec symbols at all. Supporting static musl
   requires a different propagation strategy — the compiler wrapper injecting
   `-Wl,--wrap=<symbol>` link args and `__wrap_`/`__real_` shims — or an
   explicit fail-closed boundary (threads/processes on static musl attribute
   to background with a limitation).

Neither is required for the JavaScript frontend's musl native packages,
which need no interposers. Rust on musl stays private until one of the two
strategies is implemented and proven.


## R4 performance findings from R3 iteration (2026-08-29)

- Per-invocation companion selection content-hashes multi-megabyte binaries
  (wrapper + libtest artifact) on every rustc proxy call. With unoptimized
  sha2 in dev builds this alone added tens of seconds per crate and blew
  gate-stage budgets; fixed for dev builds via profile overrides
  (`[profile.dev.package.sha2/digest/block-buffer] opt-level = 3`). For R4:
  release builds are fast, but per-crate re-hashing is still O(binary size ×
  crates) — consider a per-run selection cache keyed by content hash.
- The compiler trace (`<pid>-<crate>.jsonl`) records one line per HIR body
  for EVERY crate, including out-of-source-root dependencies that contribute
  zero obligations. Compiling this workspace's dependency graph wrote ~33GB
  of traces (zerocopy 4.4GB, object 4.3GB, syn 3.3GB) and nearly filled the
  disk. For R4: skip or aggressively summarize trace records for bodies
  outside the source root — they carry no evidence value and dominate run
  I/O and disk footprint.
