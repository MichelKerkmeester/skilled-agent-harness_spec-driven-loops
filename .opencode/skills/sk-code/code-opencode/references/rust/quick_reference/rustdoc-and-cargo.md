---
title: Rustdoc Template & Cargo/Build Quick Reference
description: Copy-paste boundary templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode. — Rustdoc Template & Cargo/Build Quick Reference.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rustdoc Template & Cargo/Build Quick Reference

## 9. RUSTDOC TEMPLATE

```rust
/// Canonicalizes records for JavaScript serialization.
///
/// Output keys are ordered lexically and scores use the operation-specific
/// six-decimal quantizer. These rules protect serialized-output and numeric
/// parity with the TypeScript oracle.
///
/// # Errors
///
/// Returns [`CoreError::NonFiniteScore`] when a score is `NaN` or infinite.
/// Returns [`CoreError::DuplicateId`] when deterministic IDs collide.
///
/// # Panics
///
/// This function does not panic for validated boundary input.
///
/// # Examples
///
/// ```
/// use ranking_core::{canonicalize, CanonicalizeRequestDto};
///
/// # fn run() -> Result<(), ranking_core::CoreError> {
/// let request = CanonicalizeRequestDto {
///     records: Vec::new(),
/// };
/// let output = canonicalize(request)?;
/// assert!(output.records.is_empty());
/// # Ok(())
/// # }
/// # run()?;
/// # Ok::<(), ranking_core::CoreError>(())
/// ```
pub fn canonicalize(
    request: CanonicalizeRequestDto,
) -> Result<CanonicalizeOutputDto, CoreError> {
    // ...
}
```

For unsafe APIs, also document the caller obligations:

```rust
/// Copies `length` initialized bytes from `pointer`.
///
/// # Safety
///
/// `pointer` must be non-null and valid for reads of `length` initialized
/// bytes. The region must remain alive and immutable for the duration of the
/// call, and `length` must not exceed `isize::MAX`.
pub unsafe fn copy_foreign_bytes(
    pointer: *const u8,
    length: usize,
) -> Result<Vec<u8>, BoundaryError> {
    // ...
}
```

Public boundary documentation states:

- Ownership and copy behavior
- Stable JavaScript error code and shape
- Synchronous throw versus Promise rejection behavior
- Comparator chain or deterministic-ID preimage where observable
- Serialization and map ordering
- The parity or interop contract protected

---

## 10. CARGO AND BUILD QUICK REFERENCE

### Workspace Baseline

```toml
# Cargo.toml
[workspace]
resolver = "3"
members = ["crates/core", "crates/napi", "crates/wasm"]

[workspace.package]
edition = "2024"
rust-version = "1.85"
license = "MIT"

[workspace.lints.rust]
unsafe_op_in_unsafe_fn = "deny"

[workspace.lints.clippy]
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"

[profile.release]
overflow-checks = true
lto = "thin"
codegen-units = 1
```

Each member opts into workspace policy:

```toml
[package]
name = "ranking-core"
version = "0.1.0"
edition.workspace = true
rust-version.workspace = true
license.workspace = true

[lints]
workspace = true
```

### rustfmt Baseline

```toml
# rustfmt.toml
edition = "2024"
style_edition = "2024"
max_width = 100
newline_style = "Unix"
```

### Complete Gate Sequence

```bash
cargo fmt --all -- --check
cargo check --workspace --all-targets --locked
cargo clippy --workspace --all-targets --locked -- -D warnings
cargo test --workspace --locked
RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked
cargo build --workspace --release --locked
cargo deny check
cargo audit
```

Run the complete sequence before claiming the Rust workspace is verified.

### Advisory Clippy Review

```bash
cargo clippy --workspace --all-targets --locked -- \
  -W clippy::pedantic \
  -W clippy::nursery
```

Pedantic and nursery findings are advisory. Promote stable, relevant individual lints instead of denying either group wholesale.

### Core and Native Targets

```bash
# Pure core
cargo test -p ranking-core --locked

# Host native addon
cargo build -p ranking-napi --release --locked

# Explicit native target
cargo build -p ranking-napi \
  --release \
  --locked \
  --target aarch64-apple-darwin
```

Use the lowest proven Node-API level supporting the required APIs. Test the oldest declared Node version and every published OS, CPU, and libc package.

### wasm-bindgen Target

```bash
rustup target add wasm32-unknown-unknown

cargo build -p ranking-wasm \
  --release \
  --locked \
  --target wasm32-unknown-unknown

wasm-bindgen \
  --target nodejs \
  --out-dir dist/wasm \
  target/wasm32-unknown-unknown/release/ranking_wasm.wasm
```

Use this target only for an intentionally distinct wasm-bindgen ABI.

### napi-rs WASI Target

```bash
rustup target add wasm32-wasip1-threads

cargo build -p ranking-napi \
  --release \
  --locked \
  --target wasm32-wasip1-threads
```

Prefer napi-rs's generated WASI fallback when native and WASI must preserve the same Node-facing addon API.

### Feature Isolation

```bash
cargo check -p ranking-core --no-default-features --locked
cargo check -p ranking-napi --no-default-features --features native-addon --locked
cargo check -p ranking-wasm --no-default-features --features wasm --locked
```

### Supply-Chain Gates

```bash
cargo deny check
cargo audit
cargo vet --locked
```

`cargo deny` and `cargo audit` are blocking when configured. Record `cargo vet` status while policy is advisory, then make it blocking after criteria, imports, and exceptions are committed.

---

