---
title: P1 — Required
description: Quality validation checklist for Rust interop code in the OpenCode development environment. — P1 — Required.
trigger_phrases:
  - "rust p1 required checks"
  - "rust boundary dto review"
  - "rust interop quality gate"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# P1 — Required

Required Rust interop checks for boundary contracts, compatibility, deterministic behavior, and release quality.

## 1. OVERVIEW

### Purpose

This split checklist defines the required Rust quality checks that must pass or receive explicit approval to defer.

### Usage

Apply this file after both P0 Rust checklist files and record evidence for every applicable check.

---

## 2. P1 - REQUIRED

These must be addressed or receive explicit approval to defer.

### Owned Boundary DTOs

```markdown
- [ ] Exported DTOs are owned and contain no borrowed fields or public lifetimes
```

**Evidence**: List exported DTOs and confirm they use owned values such as `String`, `Vec<T>`, fixed-width numbers, booleans, and owned nested DTOs.

**Correct**:

```rust
#[derive(Debug)]
pub struct QueryDto {
    pub text: String,
    pub tags: Vec<String>,
}
```

**Wrong**:

```rust
pub struct QueryDto<'a> {
    pub text: &'a str,
    pub tags: &'a [&'a str],
}
```

Copy JS-owned memory before async or cross-thread work unless an explicit ownership protocol proves exclusive access.

### Fixed-Width and Range-Checked Integers

```markdown
- [ ] Boundary integers are fixed-width and range-checked
```

**Evidence**: Record every integer field crossing the boundary and its JavaScript range policy.

**Correct**:

```rust
fn parse_limit(value: i64) -> Result<u32, KernelError> {
    u32::try_from(value).map_err(|_| KernelError::InvalidLimit)
}
```

Do not expose `usize` or `isize`. Represent values outside JavaScript’s safe integer range through the agreed `BigInt` or decimal-string contract.

### Fallible Conversions Use `TryFrom`

```markdown
- [ ] `From` is used only for infallible conversions and fallible validation uses `TryFrom`
```

**Evidence**: Provide reviewed `From`, `Into`, `TryFrom`, and `TryInto` implementations with the validation contract for each fallible conversion.

**Correct**:

```rust
impl TryFrom<QueryDto> for CoreQuery {
    type Error = KernelError;

    fn try_from(value: QueryDto) -> Result<Self, Self::Error> {
        if value.text.is_empty() {
            return Err(KernelError::EmptyQuery);
        }

        Ok(Self { text: value.text })
    }
}
```

Implement `From` or `TryFrom` directly rather than implementing `Into` or `TryInto`.

### Typed Core Errors

```markdown
- [ ] Core errors use typed `thiserror` enums and pure-core public APIs do not expose `anyhow`
```

**Evidence**: List public core `Result` signatures and their concrete error types.

`anyhow` may be appropriate in internal application orchestration. It is not an exported core contract because adapters need exhaustive, stable error mapping.

### Exhaustive Boundary Error Mapping

```markdown
- [ ] Every core error variant has exhaustive napi-rs and WASM/WASI mapping
```

**Evidence**: Link each core error enum to every boundary mapping and tests that fail compilation or behavior checks when a variant is omitted.

**Correct**:

```rust
fn error_code(error: &KernelError) -> &'static str {
    match error {
        KernelError::EmptyQuery => "EMPTY_QUERY",
        KernelError::NonFiniteScore => "NON_FINITE_SCORE",
        KernelError::InvalidLimit => "INVALID_LIMIT",
    }
}
```

Do not use a wildcard arm for a versioned error contract.

### Error Envelope Golden Tests

```markdown
- [ ] JavaScript error name, code, message, cause, and throw or rejection behavior are golden-tested
```

**Evidence**: Provide fixture names for every error variant and boundary mode, including rejected async operations and synchronous throws.

Structured Rust error equality does not replace observation from JavaScript.

### Independent Native and WASM Features

```markdown
- [ ] Native and WASM features compile and test independently
```

**Evidence**: Record separate native and WASM/WASI commands with successful outputs.

Feature combinations must not accidentally hide target-specific imports, serializers, or error mappings.

### Complete Rust Quality Gate

```markdown
- [ ] Formatting, locked checks, Clippy, tests, rustdoc, and release builds pass
```

**Evidence**: Attach the complete command output or CI job links for the gate sequence in section 6.

All dependency-resolving CI commands use `--locked`.

### CI Clippy Deny List

```markdown
- [ ] CI denies `unwrap_used`, `expect_used`, `panic`, `float_cmp`, `as_conversions`, and `indexing_slicing`
```

**Evidence**: Link the workspace lint configuration and successful Clippy job.

**Required configuration**:

```toml
[workspace.lints.clippy]
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"
```

Use `deny`, not `forbid`, so an exceptional local suppression remains possible after review.

### Narrow Lint Suppressions

```markdown
- [ ] Every lint suppression is narrow and includes a durable reason
```

**Evidence**: List all new or changed `allow` attributes and the contract-specific reason for each.

**Approved pattern**:

```rust
#[allow(
    clippy::float_cmp,
    reason = "Exact equality is required by the serialized parity fixture"
)]
fn bytes_match_expected(left: f64, right: f64) -> bool {
    left == right
}
```

Crate-wide suppressions require explicit approval.

### MSRV and Pinned Stable Toolchain

```markdown
- [ ] The declared MSRV and pinned stable toolchain are tested
```

**Evidence**: Record `rust-version`, `rust-toolchain.toml`, the exact MSRV job, and the pinned stable job.

Default new crates to Edition 2024. Use Edition 2021 only for a verified compatibility requirement predating Rust 1.85.

### Native Platform Package Loading

```markdown
- [ ] Every supported native platform package has a real-load and clean-install test
```

**Evidence**: Provide the OS, CPU, and libc matrix with package-selection, clean-install, and actual addon-load results.

Exact-version optional platform packages must be published before the root package. Treat glibc and musl as separate targets.

### Runtime Compatibility Floors

```markdown
- [ ] The oldest claimed Node version and libc floor are exercised
```

**Evidence**: Record the lowest Node-API level, `engines.node` floor, oldest Node test, and glibc or musl target evidence.

Addon runtime support and `@napi-rs/cli` build-tool requirements are separate compatibility claims.

### Forced WASI Fallback

```markdown
- [ ] Forced WASI tests use `NAPI_RS_FORCE_WASI=error`
```

**Evidence**: Attach the forced-fallback command and proof that the WASI artifact, rather than the native addon, handled the request.

```bash
NAPI_RS_FORCE_WASI=error npm test
```

Native and WASI are independent release targets and both require artifact-level parity.

### Golden Provenance and Checksums

```markdown
- [ ] Goldens record oracle provenance and input/output checksums
```

**Evidence**: Link the golden manifest containing the TypeScript oracle commit, generator command, encoding, newline policy, comparison mode, and SHA-256 values.

A fixture without provenance cannot establish which TypeScript behavior it protects.

### Property Regression Corpus

```markdown
- [ ] `proptest-regressions` is committed and minimized failures are promoted to concrete fixtures
```

**Evidence**: Link the committed regression seeds and the concrete golden fixture created for each minimized parity failure.

Property tests discover cases. Concrete oracle-generated fixtures preserve them as durable release contracts.

### Determinism Permutation Tests

```markdown
- [ ] Determinism tests permute insertion order and rerun in fresh processes
```

**Evidence**: Attach permutation seeds, repeated-process results, and cross-target byte comparisons.

Tests must cover maps, sets, graph edges, equal scores, duplicate records, and parallel completion order where applicable.

### Public API Documentation

```markdown
- [ ] Public APIs document errors, panics, safety, ownership, and protected parity contracts
```

**Evidence**: List the reviewed public items and successful rustdoc warning gate.

**Minimum**:

```rust
/// Produces the canonical boundary bytes.
///
/// # Errors
///
/// Returns [`KernelError`] when the DTO violates the TypeScript boundary
/// contract.
///
/// # Panics
///
/// This function does not panic for validated or JavaScript-controlled input.
pub fn execute(input: QueryDto) -> Result<Vec<u8>, KernelError> {
    let request = CoreQuery::try_from(input)?;
    core::execute(request)
}
```

Unsafe public APIs also require a `# Safety` section describing caller obligations.

### Supply-Chain Gates

```markdown
- [ ] `cargo-deny` and `cargo-audit` pass and `cargo-vet` status is recorded
```

**Evidence**: Attach `cargo deny check`, `cargo audit`, and `cargo vet --locked` reports with approved exceptions.

Commit `deny.toml` and `Cargo.lock`. Pin scanner and CI action versions.

### No Unnecessary C++ Boundary

```markdown
- [ ] `cxx` is absent unless a concrete C++ dependency requires it
```

**Evidence**: Record dependency search results or the approved C++ dependency, compiler/runtime matrix, and cross-boundary unwinding controls.

Do not add `cxx` merely to bridge TypeScript and Rust. napi-rs, WASM/WASI, or a narrow sidecar protocol own those boundaries.

### Arithmetic Semantics Reviewed

```markdown
- [ ] Integer and floating-point operations preserve release and cross-target semantics
```

**Evidence**: Record reviewed uses of `checked_*`, `wrapping_*`, `saturating_*`, narrowing conversions, `mul_add`, transcendental operations, and release overflow checks.

Use wrapping only when modulo arithmetic is the named algorithm. Use saturation only when clamping is the TypeScript contract.

---
