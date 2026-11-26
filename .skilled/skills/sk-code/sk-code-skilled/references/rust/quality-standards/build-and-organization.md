---
title: Cargo/Build Baseline & Module Organization
description: Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment. — Cargo/Build Baseline & Module Organization.
trigger_phrases:
  - "cargo build baseline module organization"
  - "rust build and organization"
  - "rust quality guidance"
importance_tier: normal
contextType: implementation
version: 1.0.4.0
---

# Cargo/Build Baseline & Module Organization

Open this when you are bootstrapping a Rust crate or splitting a workspace and need the edition, MSRV, Clippy and test-layout choices settled.

---

## 1. OVERVIEW

### Purpose

Sets the Cargo, verification and module-organization baseline that keeps a Rust workspace reproducible from build through release.

### When to Use

- Bootstrapping a crate or reviewing its edition, MSRV, rustfmt or Clippy baseline
- Choosing the verification and test layout, including property or golden tests
- Splitting a workspace into core and boundary crates
- Organizing features, modules or re-exports

---

## 2. CARGO, BUILD, AND VERIFICATION BASELINE

### Edition, Toolchain, and MSRV

**[P1] New Rust crates default to Edition 2024.**

```toml
[workspace.package]
edition = "2024"
rust-version = "1.85"
```

- **[P1]** Declare `rust-version`.
- **[P1]** Test the exact declared MSRV.
- **[P1]** Test a pinned current stable toolchain.
- **[P1]** Use Edition 2021 only for a verified pre-1.85 compatibility need.
- **[P0]** Do not raise MSRV accidentally through dependency updates.

### rustfmt Baseline

**[P1] Commit `rustfmt.toml` at the workspace root.**

```toml
edition = "2024"
style_edition = "2024"
max_width = 100
newline_style = "Unix"
```

Run:

```bash
cargo fmt --all -- --check
```

- **[P1]** Formatting checks must run in CI.
- **[P0]** Preserve Unix newlines in parity fixtures and generated output.
- **[P1]** Do not manually format against rustfmt output.

### Clippy Baseline

Run the required CI tier:

```bash
cargo clippy --workspace --all-targets --locked -- -D warnings
```

**[P1] Commit the following parity and boundary lints:**

```toml
[workspace.lints.clippy]
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"
```

| Lint | Severity | Contract Protected |
|------|----------|--------------------|
| `unwrap_used` | P0 | Boundary process survival |
| `expect_used` | P0 | Boundary process survival |
| `panic` | P0 | Node/WASM error translation |
| `float_cmp` | P1 | Explicit numeric semantics |
| `as_conversions` | P1 | Range and ABI correctness |
| `indexing_slicing` | P1 | Caller-controlled bounds safety |

A single-crate application with no workspace sets the same lints in its own `Cargo.toml`, under `[lints.clippy]`, with compiler lints under `[lints.rust]` (rust-anything, `Cargo.toml:42-46`). A lint group such as `all` takes `priority = -1`, so the single lints, at the default priority 0, override the group.

```toml
[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
all = { level = "warn", priority = -1 }
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"
```

- **[P1]** Use `deny`, not `forbid`, so a narrow reviewed local exception remains possible.
- **[P1]** Every lint suppression must include a durable `reason`.
- **[P1]** Suppress with `#[expect(lint, reason = "...")]`, not `#[allow]`, so the compiler reports the suppression once the code no longer triggers the lint (rust-anything, `skills/rust-anything/SKILL.md:151-152`). `#[expect]` needs Rust 1.81, below the 1.85 floor above.
- **[P1]** Keep suppressions local to the smallest applicable item.
- **[P1]** Do not add crate-wide `#![deny(warnings)]`; CI owns the zero-warning policy.
- **[P2]** Review `clippy::pedantic` and `clippy::nursery`.
- **[P2]** Promote individually useful stable lints rather than denying those groups wholesale.

```rust
#[expect(
    clippy::float_cmp,
    reason = "exact equality is part of the serialized-number parity contract"
)]
fn same_serialized_number(left: f64, right: f64) -> bool {
    left == right
}
```

An expectation that never fires fails `-D warnings` as `unfulfilled_lint_expectations`. Clippy's `float_cmp` does not fire on a comparison with zero, so a signed-zero check such as `value == 0.0 && value.is_sign_negative()` needs no suppression at all.

### Required Verification

```bash
cargo fmt --all -- --check
cargo check --workspace --all-targets --locked
cargo clippy --workspace --all-targets --locked -- -D warnings
cargo test --workspace --locked
RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked
cargo build --workspace --release --locked
```

- **[P1]** Run all commands from the Cargo workspace root.
- **[P1]** Use `--locked` in reproducible CI and release gates.
- **[P0]** Test each shipped artifact, not only the pure core.
- **[P0]** Run native, WASM, WASI, and sidecar checks separately where enabled.
- **[P0]** Do not claim target support from compilation alone; require load and parity tests.

### Testing Layout

```text
crates/core/
  src/
    lib.rs
    error.rs
    ids.rs
    ranking.rs
  tests/
    common/
      mod.rs
    parity_golden.rs
    determinism.rs
    property_parity.rs
    error_parity.rs

crates/napi/
  tests/
    boundary_native.rs

crates/wasm/
  tests/
    boundary_wasm.rs
```

- **[P1]** Unit-test private invariants under `#[cfg(test)]`.
- **[P1]** Put public-contract tests in `tests/*.rs`.
- **[P1]** Put shared integration helpers in `tests/common/mod.rs`.
- **[P0]** Where TypeScript is the oracle, generate expected outputs only from the pinned TypeScript oracle. A port of another program takes its expected outputs from the original's recorded cases, per `determinism-and-parity.md` §Porting Against a Recorded Original.
- **[P0]** Never automatically accept changed goldens or snapshots in CI.
- **[P1]** Commit minimized property-test regressions.
- **[P1]** Promote every minimized parity failure into the concrete golden corpus.

**[P1] A binary's tests run the built executable and assert on its process contract.** Cargo sets `CARGO_BIN_EXE_<name>` to the built binary's path, and the test runs it with `std::process::Command` (rust-anything, `tests/rules.rs:11`).

```rust
use std::process::Command;

const APP: &str = env!("CARGO_BIN_EXE_app");

#[test]
fn version_prints_to_stdout_and_exits_zero() -> Result<(), Box<dyn std::error::Error>> {
    let output = Command::new(APP).arg("--version").output()?;
    assert_eq!(output.status.code(), Some(0));
    assert!(output.stderr.is_empty());
    assert!(!output.stdout.is_empty());
    Ok(())
}
```

- **[P1]** Put these tests in `tests/*.rs`. Cargo sets `CARGO_BIN_EXE_<name>` only for integration tests and benchmarks, not for unit tests under `#[cfg(test)]`.
- **[P1]** Assert on stdout, stderr and the exit status together, because together they are the process contract.
- **[P2]** Recorded CLI cases may be trycmd files: a `<case>.toml` holding the arguments, environment and exit code, beside `.stdin`, `.stdout` and `.stderr` files, which a Rust test runs once the binary exists (rust-anything, `docs/whole-apps.md:97-99`).
- **[P0]** A child process that the binary or a test starts sends its stdout to stderr or a pipe, never to a stream whose protocol the parent owns, such as an MCP server's stdout (rust-anything, `docs/pitfalls.md:65-66`).

### Property and Golden Testing

**[P1] Differential property generators should emphasize:**

- Six-decimal rounding boundaries and adjacent floats
- `-0.0`
- Finite extremes
- Defined non-finite cases
- Equal and nearly equal scores
- Every comparator tie-break branch
- Unicode and combining characters
- Missing versus `null`
- Permuted map, set, and graph insertion order
- Empty, duplicate, cyclic, dangling, and depth-truncated graphs

- **[P0]** Record the TypeScript oracle commit.
- **[P0]** Record the generator command.
- **[P0]** Record encoding and newline policy.
- **[P0]** Record comparison mode.
- **[P0]** Record input and output SHA-256 values.
- **[P1]** Regenerate goldens into a temporary directory and require a clean recursive diff.
- **[P1]** Use one long-lived Node oracle process for large property runs where practical.
- **[P0]** Use snapshots only after canonicalization.
- **[P0]** Structured snapshots are diagnostic and are not parity oracles.
- **[P1]** Set `CI=true` and `INSTA_UPDATE=no` in CI.

### Supply-Chain Verification

Run:

```bash
cargo deny check
cargo audit
cargo vet --locked
```

- **[P1]** Commit `deny.toml`.
- **[P1]** Run `cargo deny check` as a blocking gate.
- **[P1]** Run `cargo audit` against the committed `Cargo.lock`.
- **[P1]** Pin scanner and CI action versions.
- **[P2]** Start `cargo vet --locked` as advisory while policy is being established.
- **[P1]** Make `cargo vet` blocking after audit criteria, imports, and exceptions are committed.
- **[P0]** Review exceptions for scope, owner, reason, and expiry.

### Benchmarking

- **[P2]** Use Criterion with `harness = false`.
- **[P2]** Benchmark core kernels, serialization, and boundary batches separately.
- **[P2]** Run `cargo test --benches` on pull requests to verify benchmark compilation.
- **[P2]** Measure regressions on a pinned runner.
- **[P0]** Never weaken zero-tolerance correctness parity because performance measurements are noisy.
- **[P2]** Use `twiggy` before WASM allocator or size-optimization changes.
- **[P2]** Measure before adopting Tokio, Rayon, unsafe zero-copy, alternate allocators, or target-specific optimization.

---

## 3. MODULE AND BOUNDARY ORGANIZATION

### Workspace Layout

**[P1] Separate the transport-neutral core from thin boundary crates.**

```text
Cargo.toml
Cargo.lock
rustfmt.toml
deny.toml
crates/
  core/
    Cargo.toml
    src/
      lib.rs
      dto.rs
      error.rs
      ids.rs
      ranking.rs
      serialization.rs
  napi/
    Cargo.toml
    src/
      lib.rs
      error.rs
      conversion.rs
  wasm/
    Cargo.toml
    src/
      lib.rs
      error.rs
      conversion.rs
  sidecar/
    Cargo.toml
    src/
      main.rs
```

```toml
[workspace]
resolver = "3"
members = [
  "crates/core",
  "crates/napi",
  "crates/wasm",
]

[workspace.package]
edition = "2024"
rust-version = "1.85"
```

**[P1] An app-style binary keeps its logic in a library and its process surface in the binary.** One package can hold both. `src/lib.rs` declares the modules that do the work, and `src/main.rs` holds the clap derive parser, the match that sends each subcommand to a library function and the printing (rust-anything, `src/lib.rs:10-40`, `src/main.rs:19-35`, `src/main.rs:834-836`).

```text
Cargo.toml
Cargo.lock
src/
  lib.rs
  report.rs
  main.rs
tests/
  cli.rs
```

```rust
use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "app", version, about = "Report on a folder")]
struct Cli {
    #[command(subcommand)]
    command: Cmd,
}

#[derive(Subcommand)]
enum Cmd {
    /// Print a report for one folder.
    Report {
        /// Folder to read.
        #[arg(default_value = ".")]
        root: PathBuf,
    },
}
```

- **[P1]** Derive the parser with clap's `derive` feature, so each subcommand and flag is a typed field and its doc comment is its help text (rust-anything, `Cargo.toml:16`, `src/main.rs:52-62`).
- **[P1]** Keep each command's work in the library, so integration tests and other binaries call it without starting the process (rust-anything, `tests/rules.rs:7-9`).
- **[P1]** Map the outcome to an exit code in one place, per `docs-errors-and-async.md` §Application Entry Point.

A terminal screen built on ratatui and crossterm follows the same split. This set holds no rendering or terminal-state rules for it, because rust-anything, the source the app rules here rest on, has no terminal UI.

### Responsibility Matrix

| Module | Owns | Must Not Own | Severity |
|--------|------|--------------|----------|
| `core` | Validation, normalization, rounding, sorting, hashing, IDs, domain errors | Node/WASM handles or transport behavior | P0 |
| `napi` | napi-rs DTO conversion and error mapping | Duplicate core algorithms | P0 |
| `wasm` | wasm-bindgen conversion and error mapping | Duplicate core algorithms | P0 |
| `sidecar` | Protocol framing and process lifecycle | Independent business behavior | P0 |
| TypeScript | MCP transport, public schemas, feature flags, fallback selection | Divergent Rust-specific semantics | P0 |

### Core Organization

- **[P0]** Keep parity-sensitive algorithms in one transport-neutral implementation.
- **[P1]** Keep domain errors near domain logic.
- **[P1]** Keep boundary DTO conversion separate from core algorithms.
- **[P1]** Keep deterministic-ID construction in a dedicated module.
- **[P1]** Keep canonical serialization centralized.
- **[P0]** Do not allow adapters to fork numeric, ordering, hashing, or validation behavior.

### Feature Organization

- **[P1]** Separate native and WASM features.
- **[P0]** Do not accidentally compile unsupported target combinations.
- **[P1]** Use workspace-level edition, MSRV, dependency, lint, and release policy.
- **[P1]** Keep one workspace lockfile.
- **[P0]** Do not permit target-specific dependencies to change core semantics.
- **[P1]** Test feature combinations intentionally rather than relying on default features.

### Re-Exports

**[P1] Re-export a deliberate public API rather than exposing internal module topology.**

```rust
mod dto;
mod error;
mod ids;
mod ranking;

pub use dto::{CandidateDto, RankRequest, RankedCandidateDto};
pub use error::RankError;
pub use ranking::rank_candidates;
```

- **[P1]** Keep internal helpers private.
- **[P1]** Avoid broad wildcard re-exports.
- **[P0]** Do not expose adapter-only types from the core.
- **[P1]** Review public API changes as compatibility changes.

---

