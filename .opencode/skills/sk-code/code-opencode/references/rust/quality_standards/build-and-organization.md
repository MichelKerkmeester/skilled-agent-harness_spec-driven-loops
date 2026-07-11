---
title: Cargo/Build Baseline & Module Organization
description: Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment. — Cargo/Build Baseline & Module Organization.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Cargo/Build Baseline & Module Organization

## 10. CARGO, BUILD, AND VERIFICATION BASELINE

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

- **[P1]** Use `deny`, not `forbid`, so a narrow reviewed local exception remains possible.
- **[P1]** Every `#[allow(...)]` must include a durable `reason`.
- **[P1]** Keep suppressions local to the smallest applicable item.
- **[P1]** Do not add crate-wide `#![deny(warnings)]`; CI owns the zero-warning policy.
- **[P2]** Review `clippy::pedantic` and `clippy::nursery`.
- **[P2]** Promote individually useful stable lints rather than denying those groups wholesale.

```rust
#[allow(
    clippy::float_cmp,
    reason = "signed zero is part of the serialized-number parity contract"
)]
fn is_negative_zero(value: f64) -> bool {
    value == 0.0 && value.is_sign_negative()
}
```

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
- **[P0]** Generate expected outputs only from the pinned TypeScript oracle.
- **[P0]** Never automatically accept changed goldens or snapshots in CI.
- **[P1]** Commit minimized property-test regressions.
- **[P1]** Promote every minimized parity failure into the concrete golden corpus.

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

## 11. MODULE AND BOUNDARY ORGANIZATION

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
