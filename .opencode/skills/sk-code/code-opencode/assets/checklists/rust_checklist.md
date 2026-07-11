---
title: Rust Code Quality Checklist
description: Quality validation checklist for Rust interop code in the OpenCode development environment.
trigger_phrases:
  - "opencode rust checklist"
  - "rust quality validation checklist"
  - "rust byte parity check"
  - "napi wasm rust review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Code Quality Checklist

Quality validation checklist for Rust compute kernels and napi-rs, WASM/WASI, or sidecar boundaries that must preserve existing TypeScript behavior byte for byte.

---

## 1. OVERVIEW

### Purpose

Specific quality checks for Rust files in the OpenCode development environment. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

This checklist treats the TypeScript implementation as the compatibility oracle. Semantic equivalence is insufficient where Rust output crosses an existing JavaScript boundary: serialized bytes, six-decimal numeric behavior, sort order, deterministic identifiers, DTO declarations, and error behavior must match the established TypeScript contract exactly.

### Scope

Apply this checklist to:

- Pure Rust compute kernels introduced behind an existing TypeScript/Node MCP backend.
- napi-rs native addons.
- wasm-bindgen or napi-rs WASI fallback modules.
- Sidecar processes that exchange deterministic bytes or DTOs with Node.
- Rust serialization, ranking, hashing, graph, search, or numeric code whose output is observable from TypeScript.

TypeScript retains ownership of MCP transport, public tool schemas, daemon and CLI wiring, feature flags, and fallback selection. Rust adapters stay narrow and expose measured compute kernels rather than duplicating orchestration.

### Protected Contracts

| Contract | Required outcome |
|----------|------------------|
| Serialized-output parity | TypeScript and every shipped Rust boundary return identical bytes |
| Six-decimal numeric parity | Each migrated path reproduces its exact TypeScript operation |
| Sort parity | Every observable comparator has the same complete key chain and terminal tie-break |
| Deterministic-ID parity | Preimage fields, order, delimiters, UTF-8 bytes, hash, encoding, and truncation match |
| DTO/ABI parity | Names, fields, optionality, discriminants, declarations, and ownership remain compatible |
| Error-shape parity | JavaScript error name, code, message, cause, and throw or rejection behavior match |
| Boundary integrity | Panics and undocumented unsafe operations never cross the interop boundary |
| Adapter consistency | Deterministic business logic exists once in the pure core |

### Priority Levels

| Level | Meaning       | Enforcement                       |
|-------|---------------|-----------------------------------|
| P0    | HARD BLOCKER  | Must fix before commit            |
| P1    | Required      | Must fix or get explicit approval |
| P2    | Recommended   | Can defer with justification      |

---

## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Byte-for-Byte TypeScript Parity

```markdown
- [ ] TypeScript and every shipped Rust boundary produce byte-for-byte identical output
```

**Evidence**: Record the oracle command, Rust boundary commands, fixture manifest, target matrix, and clean recursive byte diff.

**Required assertion**:

```rust
fn assert_boundary_parity(
    oracle_bytes: &[u8],
    native_bytes: &[u8],
    wasm_bytes: &[u8],
) {
    assert_eq!(oracle_bytes, native_bytes);
    assert_eq!(oracle_bytes, wasm_bytes);
}
```

Parsed JSON equality is diagnostic only. It cannot approve differences in key order, number spelling, escaping, omission, or newline behavior.

### Exact Numeric Operation Parity

```markdown
- [ ] Each migrated numeric path reproduces its exact TypeScript operation
```

**Evidence**: Identify the TypeScript operation for every migrated numeric path and link it to the Rust helper and parity fixtures.

Do not collapse distinct TypeScript operations into one generic “round to six decimals” helper. Preserve whether the source uses `Number(value.toFixed(6))`, `Math.round(value * 1_000_000) / 1_000_000`, or fixed-six textual output.

**Correct**:

```rust
fn quantize_scaled_round(value: f64) -> f64 {
    (value * 1_000_000.0).round() / 1_000_000.0
}

fn fixed_six_text(value: f64) -> String {
    format!("{value:.6}")
}
```

Use each helper only after fixtures prove it matches the corresponding JavaScript operation, including signed-zero and number-spelling policy.

**Wrong**:

```rust
fn universal_six_decimal_rule(value: f64) -> String {
    format!("{value:.6}")
}
```

The wrong version changes a numeric contract into a fixed-width textual contract.

### Numeric Edge-Case Goldens

```markdown
- [ ] Golden fixtures cover halfway values, adjacent floats, negative zero, non-finite policy, and JavaScript number spelling
```

**Evidence**: Provide fixture paths and test names covering positive and negative halfway cases, adjacent representable floats, `-0.0`, finite extremes, and every defined non-finite input.

**Minimum test shape**:

```rust
#[test]
fn numeric_parity_corpus_is_byte_exact() {
    for fixture in load_numeric_fixtures() {
        let actual = run_rust_boundary(&fixture.input);
        assert_eq!(fixture.expected_bytes, actual);
    }
}
```

The fixture loader and boundary runner must compare original bytes without normalizing JSON.

### Complete Stable Comparator

```markdown
- [ ] Every observable sort has a complete comparator ending in a deterministic unique key
```

**Evidence**: Record each observable sort location, its TypeScript comparator chain, and tests that exercise every tie-break branch.

**Correct**:

```rust
use std::cmp::Ordering;

#[derive(Debug)]
struct RankedItem {
    score: f64,
    rank: u32,
    id: String,
}

fn compare_ranked(left: &RankedItem, right: &RankedItem) -> Ordering {
    right
        .score
        .total_cmp(&left.score)
        .then_with(|| left.rank.cmp(&right.rank))
        .then_with(|| left.id.cmp(&right.id))
}

fn sort_ranked(items: &mut [RankedItem]) {
    items.sort_by(compare_ranked);
}
```

The key sequence and ascending or descending direction must match TypeScript exactly. `total_cmp` is acceptable only when its treatment of signed zero and non-finite values matches the established contract.

### No Parity-Visible Unstable Ordering

```markdown
- [ ] No parity-visible path uses unstable sorting, incidental input order, or partial comparison unwraps
```

**Evidence**: Provide search results for `sort_unstable`, `sort_unstable_by`, `partial_cmp`, and ordering assumptions, plus the reviewed disposition of every hit.

**Wrong**:

```rust
items.sort_unstable_by(|left, right| {
    right.score.partial_cmp(&left.score).unwrap()
});
```

This can panic on `NaN`, omits terminal tie-breaks, and permits equal elements to reorder.

**Approved exception**: Unstable sorting is allowed only when order is provably unobservable and a test demonstrates that no boundary output depends on it. Record the approval and proof.

### Deterministic Identifier Construction

```markdown
- [ ] Deterministic IDs preserve exact fields, order, delimiters, UTF-8 bytes, hash algorithm, lowercase encoding, and truncation
```

**Evidence**: Record the TypeScript preimage construction, hash algorithm, encoding, truncation length, and cross-language golden vectors.

**Correct pattern**:

```rust
use sha2::{Digest, Sha256};

fn deterministic_id(namespace: &str, name: &str) -> String {
    let mut preimage = Vec::new();
    preimage.extend_from_slice(namespace.as_bytes());
    preimage.push(b':');
    preimage.extend_from_slice(name.as_bytes());

    let digest = Sha256::digest(preimage);
    hex::encode(digest)[..16].to_owned()
}
```

The delimiter, algorithm, lowercase hexadecimal encoding, and truncation above are examples only. The implementation must reproduce the existing TypeScript contract rather than adopt a new format.

### Deterministic Collection and Iteration Order

```markdown
- [ ] No hash-map, set, filesystem, database, thread, or parallel completion order leaks into output
```

**Evidence**: Provide insertion-order permutation tests, fresh-process reruns, and an inventory of parity-visible collection traversals.

**Correct**:

```rust
use std::collections::BTreeMap;

fn ordered_entries(values: BTreeMap<String, u64>) -> Vec<(String, u64)> {
    values.into_iter().collect()
}
```

**Also correct when TypeScript uses a custom order**:

```rust
use std::collections::HashMap;

fn ordered_entries(values: HashMap<String, u64>) -> Vec<(String, u64)> {
    let mut entries: Vec<_> = values.into_iter().collect();
    entries.sort_by(|left, right| left.0.cmp(&right.0));
    entries
}
```

Do not replace the TypeScript order with lexical ordering unless lexical ordering is the established contract.

### Canonical Serialization Parity

```markdown
- [ ] Field order, omission, nullability, number representation, escaping, encoding, and newline behavior match TypeScript
```

**Evidence**: Provide byte-level fixtures for missing versus `null`, Unicode and escaping, numeric edge cases, empty containers, and final newline behavior.

**Correct pattern**:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct SearchOutput {
    id: String,
    score: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    metadata: Option<String>,
}

fn serialize_output(output: &SearchOutput) -> serde_json::Result<Vec<u8>> {
    serde_json::to_vec(output)
}
```

Struct field declaration order and `serde` attributes are contract-relevant. A generic map serializer is not a substitute for an explicitly ordered boundary DTO.

### Cross-Boundary Oracle Parity

```markdown
- [ ] napi-rs, native platform packages, WASM/WASI, and sidecar outputs match the same TypeScript oracle where enabled
```

**Evidence**: List every shipped boundary and platform target with its artifact-level replay command and clean byte comparison.

Core-only parity is insufficient. Packaging, adapter conversion, serializer configuration, and runtime-specific error handling can alter observable output.

### DTO and ABI Parity

```markdown
- [ ] JavaScript-visible DTOs, generated TypeScript declarations, enum discriminants, and error envelopes match
```

**Evidence**: Attach generated declaration diffs, DTO golden fixtures, and an explicit field-by-field review of names, optionality, nullability, discriminants, and numeric representations.

**Correct**:

```rust
#[napi(object)]
pub struct SearchResultDto {
    pub id: String,
    pub score: f64,
    pub source_kind: String,
}
```

Use napi-rs or wasm-bindgen rename attributes when the JavaScript contract requires camelCase. Do not contaminate pure-core Rust naming to achieve boundary spelling.

Boundary contracts must not expose `usize`, `isize`, borrowed fields, Rust ordinal enum values, or integers that exceed JavaScript’s safe range without an explicit `BigInt` or decimal-string contract.

### Stable JavaScript Error Shape

```markdown
- [ ] Error name, code, message, cause, and throw-versus-rejection behavior match TypeScript
```

**Evidence**: Provide golden tests for every error variant through each shipped boundary, including synchronous and asynchronous entry points.

**Correct core error**:

```rust
use thiserror::Error;

#[derive(Debug, Error)]
enum KernelError {
    #[error("query must not be empty")]
    EmptyQuery,
    #[error("score must be finite")]
    NonFiniteScore,
}
```

Adapters must map every variant exhaustively. Adding a core variant without updating all napi-rs and WASM/WASI mappings is a blocker.

### No Panic or Trap Across the Boundary

```markdown
- [ ] No JavaScript-controlled path can panic or trap instead of returning the established error shape
```

**Evidence**: Provide reviewed search results for `unwrap`, `expect`, `panic!`, unchecked indexing, assertions used for input validation, and `partial_cmp(...).unwrap()`.

**Correct**:

```rust
fn first_byte(input: &[u8]) -> Result<u8, KernelError> {
    input.first().copied().ok_or(KernelError::EmptyQuery)
}
```

**Wrong**:

```rust
fn first_byte(input: &[u8]) -> u8 {
    input[0]
}
```

Assertions may protect impossible internal invariants in tests. They must not validate JS-controlled data in production boundary paths.

### Unsafe Forbidden in the Pure Core

```markdown
- [ ] The pure core declares `#![forbid(unsafe_code)]`
```

**Evidence**: Record the pure-core crate path and the successful compiler or lint command proving unsafe code is forbidden.

**Required crate attribute**:

```rust
#![forbid(unsafe_code)]
```

The pure core must not depend on `napi`, `napi-derive`, `wasm-bindgen`, `JsValue`, Node handles, or WASM runtime values.

### Boundary Unsafe Discipline

```markdown
- [ ] Every boundary unsafe block has an adjacent safety invariant, a safe wrapper, an exercising test, and a precondition-challenge test
```

**Evidence**: List every unsafe block with file and line, its safe wrapper, exercising test, and precondition-challenge test.

**Required boundary baseline**:

```rust
#![deny(unsafe_op_in_unsafe_fn)]
```

**Approved pattern**:

```rust
fn copy_bytes(pointer: *const u8, length: usize) -> Option<Vec<u8>> {
    if pointer.is_null() {
        return (length == 0).then(Vec::new);
    }

    // SAFETY: The caller guarantees `pointer` references `length` initialized
    // bytes for this call. The slice is copied before the foreign buffer can
    // be released or mutated.
    let bytes = unsafe { std::slice::from_raw_parts(pointer, length) };
    Some(bytes.to_vec())
}
```

The invariant must address every relevant validity, length, alignment, initialization, aliasing, lifetime, ownership, cleanup, and thread-affinity assumption.

### No Adapter Logic Duplication

```markdown
- [ ] Adapters do not duplicate deterministic ranking, hashing, sorting, rounding, or validation logic
```

**Evidence**: Provide a boundary-to-core call map showing that napi-rs, WASM/WASI, and sidecar adapters convert DTOs, invoke one core implementation, and map results or errors.

**Correct**:

```rust
fn execute_boundary(input: InputDto) -> Result<OutputDto, BoundaryError> {
    let request = CoreRequest::try_from(input)?;
    let result = core::execute(request)?;
    Ok(OutputDto::from(result))
}
```

Adapters may own ABI conversion and runtime-specific error construction. They must not fork deterministic core algorithms.

### Oracle-Generated Goldens Only

```markdown
- [ ] Golden expected files were generated only by the pinned TypeScript oracle
```

**Evidence**: Record the oracle commit, generator command, encoding, newline policy, input checksum, and expected-output checksum in the golden manifest.

Rust may replay committed inputs and compare output. Rust must not author or bless its own expected parity output.

### No Automatic Golden Acceptance

```markdown
- [ ] CI cannot automatically accept changed goldens or snapshots
```

**Evidence**: Provide CI configuration showing regeneration into a temporary directory, a clean recursive diff, `CI=true`, and `INSTA_UPDATE=no`.

**Required environment**:

```bash
export CI=true
export INSTA_UPDATE=no
```

Any changed golden requires deliberate oracle regeneration and review. A Rust implementation change cannot update expected output in the same unreviewed step.

### House Style Preserved

```markdown
- [ ] Numbered ALL-CAPS sections and durable WHY comments satisfy repository style
```

**Evidence**: Record the reviewed files and any justified deviations.

Comments explain the parity, ownership, safety, or interop contract that makes a choice necessary. They do not narrate obvious mechanics or include temporary planning identifiers.

---

## 3. P1 - REQUIRED

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

## 4. P2 - RECOMMENDED

These improve quality but can be deferred with justification.

### Advisory Clippy Review

```markdown
- [ ] Advisory `clippy::pedantic` and `clippy::nursery` findings were reviewed
```

**Evidence**: Attach advisory output and the disposition of relevant findings.

Do not deny either lint group wholesale. Promote individually stable, valuable lints into workspace policy.

### Semantic Newtypes

```markdown
- [ ] Newtypes protect real score, rank, identifier, or validated-boundary semantics
```

**Evidence**: List introduced or intentionally omitted newtypes and the invariant each decision protects.

**Correct**:

```rust
#[derive(Debug, Clone, Copy)]
struct FiniteScore(f64);

impl TryFrom<f64> for FiniteScore {
    type Error = KernelError;

    fn try_from(value: f64) -> Result<Self, Self::Error> {
        value
            .is_finite()
            .then_some(Self(value))
            .ok_or(KernelError::NonFiniteScore)
    }
}
```

Do not introduce wrapper types without a real invariant or semantic distinction.

### Standard Trait Implementations

```markdown
- [ ] Standard traits are implemented where semantically valid
```

**Evidence**: Record relevant decisions for `Debug`, `Clone`, `Copy`, `Eq`, `Ord`, `Hash`, `Default`, `From`, and `TryFrom`.

Do not derive `Eq`, `Ord`, or `Hash` for floating-point values unless a validated wrapper defines the required semantics.

### Boundary Allocation Review

```markdown
- [ ] Boundary allocations and copies were reviewed without making zero-copy an API promise
```

**Evidence**: Attach profiles or measurements for material boundary allocations and document any retained copy.

Owned inputs are the safe default for async and cross-thread work. Zero-copy napi/WASM views require measured benefit, an explicit ownership protocol, and boundary review.

### Benchmark Targets Compile

```markdown
- [ ] Criterion benchmark targets compile and run as test targets on pull requests
```

**Evidence**: Attach `cargo test --benches` output and the benchmark target configuration.

Use Criterion with `harness = false`. Benchmark compilation catches drift without treating noisy performance values as correctness gates.

### Layered Performance Reporting

```markdown
- [ ] Kernel, serialization, and boundary costs are reported separately
```

**Evidence**: Link benchmark results for `kernel`, `serialization`, and `boundary_batch`.

End-to-end numbers alone cannot identify whether a regression belongs to the algorithm, canonical serialization, or Node/WASM crossing.

### Measurement Before Complexity

```markdown
- [ ] Tokio, Rayon, unsafe, allocator, and WASM-size changes have measurement evidence
```

**Evidence**: Attach the baseline, experiment, target matrix, and measured result that justifies the added mechanism.

Use `twiggy` before WASM allocator or size-specific optimization changes. Parallel floating-point work additionally requires a fixed reduction tree and cross-target goldens.

---

## 5. REVIEW EVIDENCE TEMPLATE

For formal findings-first review output, use `sk-code`'s code-review mode as the baseline and treat this file as Rust surface evidence.

```markdown
## Rust Standards Surface Evidence

- [ ] Rust standards validated in `rust_checklist.md`
- [ ] Universal standards validated in `universal_checklist.md`
- [ ] Findings severity/order produced with `sk-code/code-review/references/quick_reference.md`
- [ ] Baseline security, quality, and test checks sourced from `sk-code`'s code-review mode
- [ ] Surface-specific deviations documented with file:line evidence

## Rust Review Evidence

- Rust files reviewed:
- Boundary targets reviewed:
- TypeScript oracle commit:
- Golden corpus manifest:
- Exact byte-parity command:
- Native artifact/load evidence:
- WASM/WASI artifact/load evidence:
- Determinism permutation evidence:
- Unsafe blocks reviewed:
- `// SAFETY:` invariants and tests:
- Lint suppressions reviewed:
- Node-API/Node/libc target matrix:
- Supply-chain reports:
- Deferred P1/P2 items and approval:
```

---

## 6. VALIDATION COMMANDS

```bash
# Verify formatting
cargo fmt --all -- --check

# Compile every workspace target against the lockfile
cargo check --workspace --all-targets --locked

# Enforce warnings and the committed workspace lint policy
cargo clippy --workspace --all-targets --locked -- -D warnings

# Run workspace tests
cargo test --workspace --locked

# Reject rustdoc warnings
RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked

# Build release artifacts with release-profile semantics
cargo build --workspace --release --locked

# Compile and run benchmark targets as tests
cargo test --workspace --benches --locked

# Review advisory lint groups without making them blanket blockers
cargo clippy --workspace --all-targets --locked -- \
  -W clippy::pedantic \
  -W clippy::nursery

# Check dependency licenses, bans, advisories, and sources
cargo deny check

# Check the committed lockfile for known vulnerabilities
cargo audit

# Record third-party audit coverage
cargo vet --locked

# Confirm the P1 parity lint policy is committed
rg -n '^(unwrap_used|expect_used|panic|float_cmp|as_conversions|indexing_slicing)\s*=\s*"deny"' \
  --glob 'Cargo.toml'

# Find panic-prone operations requiring review
rg -n '\.(unwrap|expect)\(|panic!\(|partial_cmp\([^)]*\)\.unwrap\(\)|\[[^]]+\]' \
  --glob '*.rs'

# Find unsafe code and required adjacent invariants
rg -n 'unsafe\b|// SAFETY:' --glob '*.rs'

# Find parity-visible unstable sorting
rg -n 'sort_unstable|sort_unstable_by|sort_unstable_by_key' --glob '*.rs'

# Find collection types whose iteration order requires review
rg -n '\b(HashMap|HashSet)\b' --glob '*.rs'

# Prevent automatic snapshot acceptance in CI
CI=true INSTA_UPDATE=no cargo test --workspace --locked

# Verify native and WASM targets separately
cargo check --workspace --all-targets --locked
cargo check --workspace --target wasm32-unknown-unknown --locked

# Force the napi-rs WASI fallback during its JavaScript integration suite
NAPI_RS_FORCE_WASI=error npm test

# Regenerate TypeScript-oracle goldens into a temporary directory,
# then require a byte-for-byte clean recursive diff
npm run generate:rust-parity-goldens -- --output "$TMPDIR/rust-parity-goldens"
diff -ru tests/goldens "$TMPDIR/rust-parity-goldens"
```

Run repository-specific native platform, WASI target, sidecar, package clean-install, and exact byte-parity commands in addition to this baseline.

---

## 7. RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [Rust Style Guide](../../references/rust/style_guide.md)
- [Rust Quality Standards](../../references/rust/quality_standards.md)
- [Rust Quick Reference](../../references/rust/quick_reference.md)
