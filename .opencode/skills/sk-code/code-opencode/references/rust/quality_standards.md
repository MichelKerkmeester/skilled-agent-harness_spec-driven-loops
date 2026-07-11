---
title: Rust Quality Standards
description: Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment.
trigger_phrases:
  - "opencode rust quality standards"
  - "owned vs borrowed rust decision"
  - "rust safety and interop policies"
  - "cargo verification baseline"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Quality Standards

Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Establishes the quality standards that all Rust code in the OpenCode development environment must follow.

Rust in this repository is a compatibility implementation for measured compute kernels behind an existing TypeScript/Node MCP backend. napi-rs, WASM/WASI, and sidecar boundaries must preserve the established JavaScript contract rather than introduce independent behavior.

The release-level parity assertion is:

```rust
assert_eq!(
    typescript_oracle(input).as_bytes(),
    rust_boundary(input)?.as_bytes(),
);
```

Semantic JSON equality is diagnostic only. Acceptance requires byte-for-byte equality wherever output is observable.

### Severity Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| **P0** | Hard blocker affecting safety, ABI compatibility, process survival, or byte parity | Must be corrected before merge or release |
| **P1** | Required engineering standard | Must be satisfied unless a narrow, reviewed exception is documented |
| **P2** | Recommended quality improvement | Apply when relevant; record why it is deferred when omission is material |

### Repository Non-Negotiables

- **[P0] The interop boundary is a stability contract.** Exported DTO names, field names, optionality, discriminants, numeric representations, buffer ownership, generated TypeScript declarations, error codes, error messages, and throw-versus-rejection behavior are versioned contracts. This protects **DTO/ABI and JavaScript error-shape parity**.
- **[P0] Determinism means byte-for-byte TypeScript parity.** Preserve numeric operations, comparator chains, identifier preimages, UTF-8 encoding, delimiters, key order, omission behavior, and serialized number spelling. This protects **six-decimal score parity, stable sort parity, deterministic-ID parity, deterministic iteration order, and serialized-output parity**.
- **[P0] No `unsafe` is permitted without a documented invariant and tests.** The pure core forbids unsafe code. Every permitted boundary unsafe block requires an adjacent `// SAFETY:` explanation, an exercising test, and a precondition-challenge test. This protects **FFI memory safety and boundary integrity**.
- **[P0] Panics are not boundary errors.** JavaScript-controlled input must not reach `unwrap`, `expect`, unchecked indexing, explicit `panic!`, or assertion-dependent validation. This protects **Node process survival, WASM trap avoidance, and JavaScript error-shape parity**.
- **[P0] TypeScript remains the behavior authority.** MCP transport, public tool schemas, daemon and CLI wiring, feature flags, and fallback selection remain in TypeScript. Rust adapters expose only narrow, measured kernels. This protects **transport compatibility and fallback behavior**.

### When to Use

- Writing or reviewing Rust core modules
- Adding napi-rs, wasm-bindgen, WASI, or sidecar adapters
- Migrating a TypeScript compute path to Rust
- Defining Rust DTOs, errors, serialization, or public exports
- Configuring Cargo, Clippy, rustfmt, MSRV, or supply-chain gates
- Testing native, WASM, or WASI artifacts against the TypeScript oracle
- Evaluating async, threading, zero-copy, or unsafe optimizations

---

## 2. OWNED VS BORROWED DATA DECISION GUIDE

### Boundary Rule

**[P0] Export owned, materialized values across JavaScript, WASM, sidecar, thread, and async boundaries.** Borrowed data must not outlive the Rust call frame or depend on JavaScript garbage-collector reachability. This protects **buffer ownership and ABI lifetime integrity**.

Approved boundary types include:

- **[P1]** `String`
- **[P1]** `Vec<T>`
- **[P1]** Fixed-width integers such as `u32`, `i64`, and `u64`
- **[P1]** `f64` with explicit finite-value and parity validation
- **[P1]** `bool`
- **[P1]** Owned DTO structs
- **[P1]** `Option<OwnedType>`
- **[P1]** `Result<OwnedOutput, BoundaryError>`

Do not export:

- **[P0]** `&str` or `&[T]`
- **[P0]** DTO fields containing references
- **[P0]** Public lifetime parameters
- **[P0]** `Cow<'a, T>` across the boundary
- **[P0]** Iterators or closures
- **[P0]** Internal graph references
- **[P0]** Rust builders or type-state values
- **[P0]** `usize` or `isize`
- **[P0]** JavaScript handles captured by background work

### Decision Summary

| Situation | Preferred Form | Severity | Contract Protected |
|-----------|----------------|----------|--------------------|
| Core helper reads text temporarily | `&str` | P1 | Allocation clarity |
| Core helper reads a slice temporarily | `&[T]` | P1 | Allocation clarity |
| napi-rs or WASM input DTO | Owned struct | P0 | Boundary lifetime integrity |
| Async or cross-thread input | Owned, `Send + 'static` data | P0 | Thread and runtime safety |
| Returned text or bytes | `String` or `Vec<u8>` | P0 | ABI ownership |
| Optional JS field | `Option<T>` with verified omission/null mapping | P0 | DTO parity |
| Integer boundary value | Fixed-width integer plus range validation | P0 | Cross-platform ABI parity |
| Internal read-only alternate representation | `Cow<'_, T>` | P2 | Allocation efficiency |
| Synchronous zero-copy view | Reviewed exception with explicit lifetime proof | P0 | Memory safety |

### Borrow Internally, Own at Boundaries

**[P1] Borrow within the pure core when the caller controls the lifetime.** This avoids unnecessary allocation without exposing lifetime coupling through the ABI.

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct NormalizedQuery(String);

#[derive(Debug, thiserror::Error)]
pub enum QueryError {
    #[error("query must not be empty")]
    Empty,
}

impl NormalizedQuery {
    pub fn parse(input: &str) -> Result<Self, QueryError> {
        let normalized = input.trim().to_lowercase();

        if normalized.is_empty() {
            return Err(QueryError::Empty);
        }

        Ok(Self(normalized))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }

    pub fn into_string(self) -> String {
        self.0
    }
}
```

- **[P1]** Use `as_*` for cheap borrowed views.
- **[P1]** Use `to_*` for conversions that perform work or allocate.
- **[P1]** Use `into_*` for consuming conversions.
- **[P1]** Convert boundary DTOs into validated core types immediately.

### Owned Boundary Conversion

**[P1] Use `TryFrom` for boundary validation.** Fallible conversion must not be hidden inside an infallible `From` implementation. This protects **input-validation and error-shape parity**.

```rust
#[derive(Debug, Clone)]
pub struct SearchInputDto {
    pub query: String,
    pub limit: u32,
}

#[derive(Debug, Clone)]
pub struct SearchInput {
    query: NormalizedQuery,
    limit: usize,
}

#[derive(Debug, thiserror::Error)]
pub enum SearchInputError {
    #[error(transparent)]
    Query(#[from] QueryError),

    #[error("limit must be between 1 and 100")]
    InvalidLimit,
}

impl TryFrom<SearchInputDto> for SearchInput {
    type Error = SearchInputError;

    fn try_from(dto: SearchInputDto) -> Result<Self, Self::Error> {
        if !(1..=100).contains(&dto.limit) {
            return Err(SearchInputError::InvalidLimit);
        }

        let limit = usize::try_from(dto.limit)
            .map_err(|_| SearchInputError::InvalidLimit)?;

        Ok(Self {
            query: NormalizedQuery::parse(&dto.query)?,
            limit,
        })
    }
}
```

### Copying and Zero-Copy

- **[P0] Copy JavaScript-owned memory before async or cross-thread work** unless a reviewed ownership protocol proves exclusive access for the complete operation. This protects **memory safety and deterministic input capture**.
- **[P0] Do not retain borrowed WASM linear-memory views across calls that can grow memory.** This protects **WASM view validity**.
- **[P1] Treat boundary copies as the default cost of a clear ownership contract.**
- **[P2] Review allocations and clones after correctness and parity are established.**
- **[P2] Consider zero-copy only after benchmarks show a material benefit.**
- **[P0] Zero-copy must not become an undocumented API promise.**

---

## 3. SAFETY AND INTEROP POLICIES

### Pure Core Safety

**[P0] Pure core crates must forbid unsafe code.**

```rust
#![forbid(unsafe_code)]
```

The core owns validation, normalization, numeric behavior, sorting, hashing, deterministic IDs, and transport-neutral domain logic. It must not depend on:

- **[P0]** `napi`
- **[P0]** `napi-derive`
- **[P0]** `wasm-bindgen`
- **[P0]** `JsValue`
- **[P0]** Node handles
- **[P0]** WASM runtime values

This separation protects **core reproducibility across native, WASM, WASI, and sidecar targets**.

### Boundary Crate Safety

**[P0] Boundary crates must deny unsafe operations inside unsafe functions.**

```rust
#![deny(unsafe_op_in_unsafe_fn)]
```

**[P0] Every allowed unsafe block requires all of the following:**

1. An adjacent `// SAFETY:` comment stating the durable invariant.
2. A safe wrapper that validates caller-controlled preconditions.
3. An exercising test for valid inputs.
4. A precondition-challenge test.
5. Review of validity, length, alignment, initialization, aliasing, lifetime, ownership, cleanup, and thread affinity where applicable.

```rust
#[derive(Debug, thiserror::Error)]
pub enum BufferError {
    #[error("buffer pointer must not be null")]
    Null,

    #[error("buffer length exceeds the supported maximum")]
    TooLarge,
}

const MAX_BUFFER_LENGTH: usize = 16 * 1024 * 1024;

pub fn copy_foreign_buffer(
    pointer: *const u8,
    length: usize,
) -> Result<Vec<u8>, BufferError> {
    if pointer.is_null() {
        return Err(BufferError::Null);
    }

    if length > MAX_BUFFER_LENGTH {
        return Err(BufferError::TooLarge);
    }

    // SAFETY: The caller's FFI contract guarantees `pointer` references
    // `length` initialized bytes for this synchronous call. The null and
    // maximum-length preconditions are checked above, and the bytes are copied
    // before the foreign owner can reclaim or mutate the allocation.
    let bytes = unsafe { std::slice::from_raw_parts(pointer, length) };

    Ok(bytes.to_vec())
}

#[cfg(test)]
mod tests {
    use super::{copy_foreign_buffer, BufferError};

    #[test]
    fn copies_valid_foreign_bytes() -> Result<(), BufferError> {
        let source = [1_u8, 2, 3, 4];
        let copied = copy_foreign_buffer(source.as_ptr(), source.len())?;

        assert_eq!(copied, source);
        Ok(())
    }

    #[test]
    fn rejects_null_pointer() {
        let result = copy_foreign_buffer(std::ptr::null(), 1);

        assert!(matches!(result, Err(BufferError::Null)));
    }
}
```

### Unsafe Exception Scope

- **[P0]** Never place unsafe code in a broad utility module.
- **[P0]** Keep unsafe blocks as small as possible.
- **[P0]** Do not suppress `unsafe_code` across an entire workspace.
- **[P1]** Isolate required unsafe code in a boundary-specific module.
- **[P1]** Expose only a safe, validated API from that module.
- **[P0]** Do not use unsafe code solely to avoid a measured-insignificant allocation.
- **[P0]** Do not permit unwinding across FFI boundaries.

### JavaScript and WASM Interop

- **[P0]** Do not access `Env`, `JsObject`, `JsUnknown`, `JsBuffer`, `JsFunction`, or equivalent runtime handles off the JavaScript thread.
- **[P0]** Do not retain WASM `JsValue` references in transport-neutral core state.
- **[P0]** Validate external DTOs before invoking core algorithms.
- **[P0]** Preserve JavaScript-visible field names through adapter rename attributes rather than changing Rust core naming.
- **[P0]** Preserve missing-versus-`null` behavior exactly.
- **[P0]** Preserve synchronous throw versus Promise rejection behavior exactly.
- **[P1]** Keep generated TypeScript declarations under review as ABI artifacts.
- **[P1]** Use the lowest proven Node-API level that supports all required APIs.

### Integer and Buffer Safety

- **[P0]** Never expose `usize` or `isize` at an ABI boundary.
- **[P0]** Use `TryFrom` for integer narrowing and architecture-dependent conversion.
- **[P0]** Represent integers outside JavaScript's safe integer range through an explicit `BigInt` or decimal-string contract.
- **[P1]** Use `checked_*` operations for lengths, offsets, counts, buffer sizes, and boundary calculations.
- **[P0]** Use `wrapping_*` only when modulo arithmetic is part of the named algorithm.
- **[P0]** Use `saturating_*` only when clamping matches the TypeScript contract.
- **[P0]** Enable overflow checks in release profiles as defense in depth.

```toml
[profile.release]
overflow-checks = true
```

---

## 4. DOMAIN AND STATE MODELING

### Newtypes for Parity-Sensitive Values

**[P1] Use private-field newtypes when primitive values carry distinct validation or parity semantics.**

Appropriate examples include:

- **[P1]** `SymbolId` for deterministic identifiers
- **[P1]** `SkillId` for validated identifiers
- **[P1]** `FiniteScore` for finite numeric values
- **[P1]** `Rank` where zero-based and one-based values must not mix
- **[P1]** `ErrorCode` for stable JavaScript error codes

```rust
#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
pub struct FiniteScore(f64);

#[derive(Debug, thiserror::Error)]
pub enum ScoreError {
    #[error("score must be finite")]
    NonFinite,
}

impl TryFrom<f64> for FiniteScore {
    type Error = ScoreError;

    fn try_from(value: f64) -> Result<Self, Self::Error> {
        if !value.is_finite() {
            return Err(ScoreError::NonFinite);
        }

        Ok(Self(value))
    }
}

impl FiniteScore {
    pub fn get(self) -> f64 {
        self.0
    }
}
```

- **[P0]** Reject non-finite values unless the boundary contract explicitly defines their encoding.
- **[P0]** Normalize or preserve `-0.0` according to the TypeScript oracle.
- **[P1]** Keep fields private so invalid values cannot be constructed directly.
- **[P1]** Serialize newtypes to the existing TypeScript primitive representation.
- **[P2]** Implement common traits only where their semantics are valid.

### State as Enums

**[P1] Model mutually exclusive states with enums rather than independent booleans.** This protects **domain-state validity and discriminant parity**.

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { endpoint: String },
    Failed { code: String, message: String },
}

pub fn connection_summary(state: &ConnectionState) -> String {
    match state {
        ConnectionState::Disconnected => "Not connected".to_owned(),
        ConnectionState::Connecting { attempt } => {
            format!("Connecting (attempt {attempt})")
        }
        ConnectionState::Connected { endpoint } => {
            format!("Connected to {endpoint}")
        }
        ConnectionState::Failed { code, message } => {
            format!("Error {code}: {message}")
        }
    }
}
```

- **[P0]** Export enums using stable string discriminants or explicit numeric codes.
- **[P0]** Never expose incidental Rust ordinal values as the JavaScript contract.
- **[P1]** Map every exported discriminant explicitly in adapters.
- **[P0]** Treat an unhandled adapter variant as a compile-time failure, not a wildcard fallback.
- **[P1]** Use `#[non_exhaustive]` only when wildcard evolution is intentional.
- **[P0]** Do not use `#[non_exhaustive]` to hide missing error or ABI mappings.

### Conversion Policies

| Conversion | Use | Severity |
|------------|-----|----------|
| `From<T>` | Infallible, lossless, value-preserving conversion | P1 |
| `TryFrom<T>` | Validation, narrowing, parsing, or normalization can fail | P1 |
| `AsRef<T>` | Cheap borrowed view | P2 |
| `IntoIterator` | Natural collection traversal without ABI exposure | P2 |
| `as` cast | Only a reviewed conversion proven not to narrow or alter semantics | P0 |
| Public builder | Avoid at JS/WASM boundary | P1 |

- **[P1]** Implement `From` or `TryFrom`, not `Into` or `TryInto`, directly.
- **[P0]** Do not use `as` for boundary narrowing.
- **[P1]** Use complete options DTOs at JavaScript boundaries.
- **[P2]** Use builders only for genuinely complex internal construction.
- **[P2]** Use type-state only when it prevents a real invalid transition.
- **[P0]** Keep builders and type-state representations out of the exported ABI.

---

## 5. STANDARD COLLECTION AND SERIALIZATION TYPES

### Collection Selection

**[P1] Prefer standard collections and make observable ordering explicit.**

| Requirement | Type | Severity | Notes |
|-------------|------|----------|-------|
| Sequence preserving explicit order | `Vec<T>` | P1 | Canonicalize before export |
| Canonical key order | `BTreeMap<K, V>` | P0 | Preferred for parity-visible maps |
| Canonical unique values | `BTreeSet<T>` | P0 | Ordered deduplication |
| Deterministic insertion order | `IndexMap<K, V>` | P1 | Use only when insertion order is contractual |
| Internal unordered lookup | `HashMap<K, V>` | P1 | Never leak iteration order |
| Internal unordered membership | `HashSet<T>` | P1 | Never leak iteration order |
| FIFO work queue | `VecDeque<T>` | P2 | Use when queue operations are material |

### Observable Hash Iteration

**[P0] `HashMap` and `HashSet` iteration must never influence output, serialization, hashing, deterministic IDs, traversal order, or ranking.** This protects **deterministic iteration and serialized-output parity**.

```rust
use std::collections::HashMap;

pub fn canonical_entries(
    values: &HashMap<String, u32>,
) -> Vec<(&str, u32)> {
    let mut entries: Vec<_> = values
        .iter()
        .map(|(key, value)| (key.as_str(), *value))
        .collect();

    entries.sort_by(|left, right| left.0.cmp(right.0));
    entries
}
```

- **[P0]** Do not rely on a deterministic hasher to make hash-table iteration contractual.
- **[P0]** Do not rely on input insertion order unless the contract explicitly defines it.
- **[P1]** Collect and sort unordered data before any observable operation.
- **[P1]** Prefer `BTreeMap` when canonical key order is always required.

### Serialization DTOs

**[P0] Boundary DTOs are passive, owned, and versioned.** Serialization must preserve the TypeScript contract for field names, field order, omission, nullability, escaping, encoding, and number spelling.

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResultDto {
    pub id: String,
    pub score: f64,
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub explanation: Option<String>,
}
```

- **[P0]** Verify that `skip_serializing_if` matches TypeScript omission behavior.
- **[P0]** Do not use `Option<T>` without testing missing, `null`, and present cases.
- **[P0]** Do not flatten structures unless the TypeScript schema already does so.
- **[P0]** Do not accept unknown fields silently when the established TypeScript validator rejects them.
- **[P1]** Use explicit serde attributes for JavaScript-visible names.
- **[P1]** Convert serialized DTOs to private core types before processing.

### Canonical Serialization

**[P0] Generic `serde_json::to_string` is not automatically a TypeScript-compatible serializer.** It may differ in key order, number spelling, escaping, or omission behavior. This protects **serialized-output parity**.

```rust
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum CanonicalJsonError {
    #[error("failed to serialize canonical output: {0}")]
    Serialize(#[from] serde_json::Error),
}

pub fn serialize_canonical<T>(
    value: &T,
) -> Result<Vec<u8>, CanonicalJsonError>
where
    T: Serialize,
{
    let text = serde_json::to_string(value)?;
    Ok(text.into_bytes())
}
```

The helper above is acceptable only after fixtures establish that its exact output matches the TypeScript oracle for the relevant DTO.

- **[P0]** Compare serialized bytes without normalization.
- **[P0]** Preserve UTF-8 encoding and newline policy.
- **[P0]** Preserve object-key order.
- **[P0]** Preserve JavaScript number spelling.
- **[P0]** Preserve escaping behavior.
- **[P0]** Do not use pretty printing unless whitespace is contractual.
- **[P1]** Centralize canonical serialization rather than configuring it ad hoc in adapters.

---

## 6. PUBLIC API AND ABI CONTRACTS

### Explicit Public Signatures

**[P1] Public Rust APIs require explicit parameter, return, and error types.** Public signatures are reviewable contracts and must not change accidentally through inference.

```rust
#[derive(Debug, Clone)]
pub struct RankRequest {
    pub query: String,
    pub candidates: Vec<CandidateDto>,
}

#[derive(Debug, Clone)]
pub struct CandidateDto {
    pub id: String,
    pub score: f64,
}

#[derive(Debug, Clone)]
pub struct RankedCandidateDto {
    pub id: String,
    pub score: f64,
    pub rank: u32,
}

pub fn rank_candidates(
    request: RankRequest,
) -> Result<Vec<RankedCandidateDto>, RankError> {
    rank_validated(request)
}
```

- **[P0]** Export owned DTOs only.
- **[P0]** Use fixed-width numbers at ABI boundaries.
- **[P0]** Preserve JavaScript-visible names and optionality.
- **[P0]** Preserve generated TypeScript declaration shapes.
- **[P1]** Keep exported functions narrow.
- **[P1]** Keep core-only types private to the core crate.
- **[P0]** Do not expose Rust implementation details such as lifetimes, iterators, trait objects, or generic builders.

### napi-rs Contract

**[P0] napi-rs adapters must translate DTOs and errors without duplicating core behavior.** This protects **native-addon and TypeScript parity**.

```rust
use napi_derive::napi;

#[napi(object)]
pub struct RankRequestJs {
    pub query: String,
    pub candidates: Vec<CandidateJs>,
}

#[napi(object)]
pub struct CandidateJs {
    pub id: String,
    pub score: f64,
}

#[napi(object)]
pub struct RankedCandidateJs {
    pub id: String,
    pub score: f64,
    pub rank: u32,
}

#[napi(js_name = "rankCandidates")]
pub fn rank_candidates_js(
    request: RankRequestJs,
) -> napi::Result<Vec<RankedCandidateJs>> {
    let core_request = request
        .try_into()
        .map_err(map_core_error)?;

    rank_candidates(core_request)
        .map(|results| results.into_iter().map(Into::into).collect())
        .map_err(map_core_error)
}
```

- **[P0]** The adapter must not implement scoring, rounding, sorting, hashing, or validation.
- **[P0]** Generated declaration names must match the existing TypeScript API.
- **[P0]** Native errors must match JavaScript `name`, `code`, `message`, and rejection behavior.
- **[P1]** Select and test the lowest supported Node-API level.
- **[P1]** Test the oldest claimed Node version.

### WASM Contract

**[P0] WASM exports must preserve the same DTO and output contract as native exports unless a distinct ABI is explicitly intended.**

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = rankCandidates)]
pub fn rank_candidates_wasm(input: JsValue) -> Result<JsValue, JsValue> {
    let request: RankRequestDto = serde_wasm_bindgen::from_value(input)
        .map_err(|error| boundary_error("E030", error.to_string()))?;

    let ranked = rank_candidates(request.try_into().map_err(map_wasm_error)?)
        .map_err(map_wasm_error)?;

    serde_wasm_bindgen::to_value(&ranked)
        .map_err(|error| boundary_error("E040", error.to_string()))
}
```

- **[P0]** Serializer configuration must be explicit and golden-tested.
- **[P0]** WASM traps must not replace established JavaScript errors.
- **[P0]** Promise behavior must match the TypeScript contract.
- **[P1]** Test the built WASM artifact through its real JavaScript loader.
- **[P0]** Do not claim WASM parity from core-only tests.

### Sidecar Contract

- **[P0]** Sidecar protocols must define framing, encoding, field order, newline behavior, exit codes, and stderr behavior.
- **[P0]** Platform-native path formatting must not leak into parity-visible output.
- **[P0]** Sidecar process failures must map to stable TypeScript errors.
- **[P1]** Use one transport-neutral core shared with native and WASM adapters.
- **[P1]** Test the packaged executable, not only a library call.

### Versioning and Packaging

- **[P0]** Treat DTO and generated declaration changes as ABI changes.
- **[P0]** Treat glibc and musl as separate release targets.
- **[P1]** Publish exact-version optional platform packages per OS, CPU, and libc target.
- **[P0]** Gate root-package publication on complete platform-package publication.
- **[P0]** Use one napi-rs packaging system; do not combine incompatible generated and independent loaders.
- **[P1]** Prefer napi-rs's generated WASI fallback when preserving the native Node-facing API.
- **[P0]** Treat native and WASI as independent release targets.
- **[P0]** Introduce `cxx` only for a concrete C++ dependency and prohibit cross-boundary unwinding.

---

## 7. RUSTDOC AND BOUNDARY DOCUMENTATION

### Public Documentation Policy

**[P1] Every public operation must document its purpose, contract, errors, ownership, and parity-sensitive behavior.**

```rust
/// Ranks candidates using the same comparator and quantization contract as
/// the TypeScript implementation.
///
/// Results are ordered by descending score and then ascending stable
/// identifier. The returned DTOs own all strings and can cross an async or FFI
/// boundary without borrowing caller memory.
///
/// # Errors
///
/// Returns [`RankError::NonFiniteScore`] when a candidate contains a non-finite
/// score, and [`RankError::TooManyCandidates`] when the boundary limit is
/// exceeded.
///
/// # Panics
///
/// This function does not panic for caller-controlled input.
///
/// # Examples
///
/// ```
/// # use ranking_core::{rank_candidates, CandidateDto, RankRequest};
/// # fn main() -> Result<(), Box<dyn std::error::Error>> {
/// let ranked = rank_candidates(RankRequest {
///     query: "rust".to_owned(),
///     candidates: vec![CandidateDto {
///         id: "candidate-a".to_owned(),
///         score: 0.75,
///     }],
/// })?;
///
/// assert_eq!(ranked[0].id, "candidate-a");
/// # Ok(())
/// # }
/// ```
pub fn rank_candidates(
    request: RankRequest,
) -> Result<Vec<RankedCandidateDto>, RankError> {
    rank_validated(request)
}
```

### Required Rustdoc Sections

| Section | Required When | Severity |
|---------|---------------|----------|
| Summary | Every public item | P1 |
| Extended behavior | Contract is not obvious from the signature | P1 |
| `# Errors` | Function returns `Result` | P1 |
| `# Panics` | Function can panic under any condition | P1 |
| `# Safety` | Every `unsafe fn` | P0 |
| `# Examples` | Public operation or nontrivial type | P1 |
| Ownership behavior | Boundary data is copied, retained, or transferred | P0 |
| Parity contract | Output is compared with TypeScript | P0 |

### Boundary Documentation

**[P0] Every exported adapter operation must document:**

- Ownership and copying behavior
- Accepted DTO shape
- Missing-versus-`null` behavior
- JavaScript error `name`, `code`, and message policy
- Synchronous throw versus Promise rejection
- Numeric quantization operation
- Complete comparator chain
- Deterministic-ID preimage where applicable
- Serialization and key order
- Native, WASM, WASI, or sidecar availability
- The named parity or interop contract protected

### Documentation Rules

- **[P1]** Examples must use `?` rather than `unwrap` or `expect`.
- **[P1]** Examples must compile as doctests where practical.
- **[P1]** Comments explain durable reasons and contracts, not mechanics.
- **[P0]** Every unsafe block has an adjacent `// SAFETY:` comment.
- **[P0]** A distant module-level safety explanation does not replace the adjacent invariant.
- **[P1]** Document the exact circumstances under which errors occur.
- **[P1]** Keep docs synchronized with generated TypeScript declarations.
- **[P0]** Do not claim parity, thread safety, zero-copy behavior, or target support without tests.

---

## 8. ERROR AND PANIC TRANSLATION

### Typed Core Errors

**[P1] Core public operations return typed domain errors.** Use `thiserror` for stable variants and structured adapter-relevant context.

```rust
#[derive(Debug, thiserror::Error)]
pub enum RankError {
    #[error("candidate '{id}' has a non-finite score")]
    NonFiniteScore { id: String },

    #[error("candidate count {actual} exceeds maximum {maximum}")]
    TooManyCandidates { actual: usize, maximum: usize },

    #[error("candidate identifier must not be empty")]
    EmptyIdentifier,
}
```

- **[P1]** Keep core errors free of Node and WASM runtime types.
- **[P1]** Include structured context needed by adapters.
- **[P0]** Do not expose unstable debug formatting as a JavaScript error message.
- **[P0]** Do not use `anyhow` in pure-core public APIs or exported functions.
- **[P2]** `anyhow` may be used in a sidecar `main`, build tool, or outermost non-ABI application shell.

### Exhaustive Adapter Mapping

**[P0] Each adapter owns one exhaustive mapping from core errors to the stable JavaScript error protocol.** This protects **error-code and error-shape parity**.

```rust
fn error_code(error: &RankError) -> &'static str {
    match error {
        RankError::NonFiniteScore { .. } => "E030",
        RankError::TooManyCandidates { .. } => "E030",
        RankError::EmptyIdentifier => "E030",
    }
}

fn map_core_error(error: RankError) -> napi::Error {
    let code = error_code(&error);
    napi::Error::new(
        napi::Status::InvalidArg,
        format!("{code}: {error}"),
    )
}
```

- **[P0]** Do not add a wildcard arm that collapses new variants into a generic error.
- **[P0]** Golden-test error `name`, `code`, `message`, optional `cause`, and details.
- **[P0]** Golden-test synchronous throw versus Promise rejection.
- **[P1]** Keep error codes stable and programmatically accessible.
- **[P1]** Centralize adapter mapping to prevent drift between exports.

### Panic Policy

**[P0] JavaScript-controlled input must not reach:**

- `unwrap`
- `expect`
- Explicit `panic!`
- Unchecked indexing
- `partial_cmp(...).unwrap()`
- Assertions used as validation
- Integer operations whose overflow behavior changes by profile

```rust
pub fn candidate_at(
    candidates: &[CandidateDto],
    index: usize,
) -> Result<&CandidateDto, RankError> {
    candidates.get(index).ok_or(RankError::TooManyCandidates {
        actual: index,
        maximum: candidates.len(),
    })
}
```

- **[P0]** Use `get` or pattern matching instead of unchecked indexing on caller-controlled offsets.
- **[P0]** Use `ok_or` or `ok_or_else` instead of `unwrap`.
- **[P0]** Validate floating-point values before comparison.
- **[P0]** Do not use `catch_unwind` as ordinary error handling.
- **[P1]** Panic only for genuinely unreachable internal invariants.
- **[P0]** No panic may cross napi-rs, WASM, WASI, C++, or sidecar protocol boundaries.

### Error Testing

- **[P1]** Test every core error variant.
- **[P0]** Test every adapter mapping.
- **[P0]** Test malformed and adversarial DTOs.
- **[P0]** Test native and WASM error parity independently.
- **[P1]** Test boundary limits and integer conversion failures.
- **[P0]** Verify that failures return errors instead of aborting, trapping, or terminating the process.

---

## 9. ASYNC, THREADING, AND RUNTIME PATTERNS

### Default Execution Model

**[P1] Keep parsing, validation, scoring, ranking, hashing, canonicalization, and serialization preparation synchronous in the core.**

Use asynchronous execution only when the operation performs:

- Measured CPU or blocking work that would materially block Node
- Genuine Rust-owned asynchronous I/O
- A sidecar protocol requiring asynchronous process I/O

### napi-rs AsyncTask

**[P1] Use napi-rs `AsyncTask` for measured CPU or blocking work.** Marshal owned DTOs before `compute` and return owned core results.

```rust
use napi::bindgen_prelude::{AsyncTask, Task};
use napi::{Env, JsObject};

pub struct RankTask {
    input: RankRequest,
}

impl Task for RankTask {
    type Output = Vec<RankedCandidateDto>;
    type JsValue = Vec<RankedCandidateJs>;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        rank_candidates(self.input.clone()).map_err(map_core_error)
    }

    fn resolve(
        &mut self,
        _env: Env,
        output: Self::Output,
    ) -> napi::Result<Self::JsValue> {
        Ok(output.into_iter().map(Into::into).collect())
    }
}

#[napi_derive::napi(js_name = "rankCandidatesAsync")]
pub fn rank_candidates_async(
    input: RankRequestJs,
) -> napi::Result<AsyncTask<RankTask>> {
    let owned_input = input.try_into().map_err(map_core_error)?;
    Ok(AsyncTask::new(RankTask { input: owned_input }))
}
```

- **[P0]** Do not access JavaScript values or `Env` inside `compute`.
- **[P0]** Do not borrow DTO fields into background work.
- **[P0]** Preserve Promise rejection shape.
- **[P1]** Resolve JavaScript values on the JavaScript thread.
- **[P1]** Capture an immutable owned input snapshot before scheduling.

### Tokio Policy

- **[P1]** Use Tokio only for genuine Rust-owned asynchronous I/O.
- **[P0]** Do not introduce a second runtime when the host already provides the required scheduling model.
- **[P1]** Document runtime ownership and shutdown behavior.
- **[P0]** Do not hold JavaScript runtime handles across `.await`.
- **[P1]** Apply explicit timeouts and cancellation behavior where the TypeScript contract defines them.
- **[P2]** Measure runtime startup, memory, and binary-size costs before adoption.

### Rayon and Parallelism

- **[P2]** Use Rayon only after benchmark evidence demonstrates a meaningful batch-size benefit.
- **[P0]** Canonicalize parallel results before returning them.
- **[P0]** Attach deterministic sequence keys to work items and restore contractual order before JavaScript emission.
- **[P0]** Do not let thread completion order affect output.
- **[P0]** Do not perform parity-visible parallel floating-point reductions unless the reduction tree is fixed and cross-target golden-tested.
- **[P1]** Keep small batches synchronous when scheduling overhead exceeds measured benefit.

```rust
#[derive(Debug)]
struct Sequenced<T> {
    sequence: usize,
    value: T,
}

fn restore_sequence<T>(
    mut values: Vec<Sequenced<T>>,
) -> Vec<T> {
    values.sort_by_key(|entry| entry.sequence);
    values.into_iter().map(|entry| entry.value).collect()
}
```

### WASM Runtime Rules

- **[P1]** Assume baseline WASM is single-threaded.
- **[P0]** Promise bridging does not justify claims of CPU parallelism.
- **[P0]** Do not enable WASM threads without artifact-level compatibility and determinism tests.
- **[P0]** Treat WASI threading support as a separate release target.
- **[P1]** Test forced WASI fallback behavior through the real loader.

---

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

## 12. BYTE-FOR-BYTE DETERMINISM AND PARITY

### Acceptance Standard

**[P0] Rust output must be byte-for-byte identical to the pinned TypeScript oracle for every migrated behavior and every shipped boundary.**

```rust
pub fn assert_byte_parity(
    typescript_bytes: &[u8],
    rust_bytes: &[u8],
) {
    assert_eq!(rust_bytes, typescript_bytes);
}
```

Semantic comparisons may help diagnose a mismatch, but they do not satisfy parity.

### Numeric Contracts

**[P0] Preserve each TypeScript numeric operation independently.** These operations are not interchangeable:

```typescript
Number(value.toFixed(6))
Math.round(value * 1_000_000) / 1_000_000
value.toFixed(6)
```

Their Rust equivalents must be separate, named helpers with differential fixtures.

- **[P0]** Do not replace a TypeScript operation with `format!("{value:.6}")` unless fixed-six text is the contract.
- **[P0]** Do not assume Rust `round` matches JavaScript `Math.round`, especially for negative halfway values.
- **[P0]** Do not assume `f64::to_string`, `ryu`, or `serde_json` matches JavaScript number spelling.
- **[P0]** Handle `-0.0` according to the oracle.
- **[P0]** Reject or encode non-finite values exactly as TypeScript does.
- **[P0]** Do not introduce `mul_add` without fixtures proving unchanged rounding.
- **[P0]** Avoid platform-variable transcendental operations unless quantized and cross-target tested.

```rust
#[derive(Debug, thiserror::Error)]
pub enum QuantizeError {
    #[error("value must be finite")]
    NonFinite,

    #[error("quantized value is outside the supported range")]
    OutOfRange,
}

pub fn quantize_math_round_six(
    value: f64,
) -> Result<f64, QuantizeError> {
    if !value.is_finite() {
        return Err(QuantizeError::NonFinite);
    }

    let scaled = value * 1_000_000.0;
    let rounded = (scaled + 0.5).floor();
    let result = rounded / 1_000_000.0;

    if !result.is_finite() {
        return Err(QuantizeError::OutOfRange);
    }

    Ok(result)
}
```

The helper above models JavaScript's positive-direction halfway behavior, but it is acceptable only after differential fixtures cover positive and negative halfway values, adjacent floats, signed zero, and range limits.

### Stable Sorting

**[P0] Every observable sort requires a complete comparator ending in a deterministic unique key.** This protects **ranking and serialized-order parity**.

```rust
use std::cmp::Ordering;

#[derive(Debug, Clone)]
pub struct RankedCandidate {
    pub id: String,
    pub score: FiniteScore,
    pub source_priority: u32,
}

pub fn sort_candidates(
    candidates: &mut [RankedCandidate],
) {
    candidates.sort_by(|left, right| {
        right
            .score
            .get()
            .total_cmp(&left.score.get())
            .then_with(|| {
                left.source_priority.cmp(&right.source_priority)
            })
            .then_with(|| left.id.cmp(&right.id))
    });
}
```

- **[P0]** Preserve every comparator key and its direction.
- **[P0]** End with a deterministic unique key.
- **[P0]** Do not rely on stable input order as the final tie-break.
- **[P0]** Do not use `sort_unstable*` for parity-visible output.
- **[P0]** Do not use `partial_cmp(...).unwrap()`.
- **[P0]** Verify Rust lexical comparison against the permitted TypeScript identifier alphabet.
- **[P0]** Do not assume Rust ordering matches `localeCompare`.

### Deterministic Identifiers

**[P0] Deterministic IDs must preserve the exact preimage contract.**

The contract includes:

- Input fields
- Field order
- Delimiters
- Missing-value representation
- UTF-8 encoding
- Hash algorithm
- Lowercase or uppercase hexadecimal encoding
- Prefixes
- Truncation length

```rust
use sha2::{Digest, Sha256};

pub fn deterministic_id(
    namespace: &str,
    source_id: &str,
    ordinal: u32,
) -> String {
    let preimage = format!("{namespace}\0{source_id}\0{ordinal}");
    let digest = Sha256::digest(preimage.as_bytes());
    let hexadecimal = hex::encode(digest);

    hexadecimal[..24].to_owned()
}
```

- **[P0]** Do not replace delimiters.
- **[P0]** Do not reorder fields.
- **[P0]** Do not normalize Unicode unless TypeScript does.
- **[P0]** Do not use platform-native path separators in a preimage.
- **[P0]** Do not change hash libraries without byte-level fixtures.
- **[P0]** Do not truncate before encoding when the oracle truncates after encoding.

### Stable Map and Traversal Order

- **[P0]** Do not expose hash-table iteration order.
- **[P0]** Do not expose filesystem enumeration order.
- **[P0]** Do not expose database row order without an explicit complete ordering.
- **[P0]** Do not expose graph insertion order unless it is contractual.
- **[P0]** Do not expose thread or task completion order.
- **[P1]** Permute insertion order in determinism tests.
- **[P1]** Repeat tests in fresh processes to detect randomized iteration.
- **[P1]** Sort graph nodes and edges by complete stable keys before traversal when traversal order is observable.

### Serialized Output

**[P0] Preserve the complete serialized-byte contract:**

- Field order
- Key spelling
- Omitted versus present fields
- `null` behavior
- Number spelling
- String escaping
- UTF-8 encoding
- Newline policy
- Trailing newline behavior
- Array order
- Whitespace
- Error payload shape

- **[P0]** Do not parse and reserialize expected output before comparison.
- **[P0]** Do not normalize whitespace, paths, Unicode, or line endings in the acceptance test.
- **[P0]** Do not accept semantic JSON equality as release evidence.
- **[P1]** Provide diagnostic structural diffs in addition to the authoritative byte diff.

### Cross-Target Parity Matrix

| Path | Required Evidence | Severity |
|------|-------------------|----------|
| TypeScript oracle | Pinned commit and generated expected bytes | P0 |
| Pure Rust core | Golden replay | P0 |
| napi-rs native addon | Packaged artifact load and golden replay | P0 |
| wasm-bindgen | Built artifact load and golden replay | P0 |
| napi-rs WASI fallback | Forced fallback load and golden replay | P0 |
| Sidecar | Packaged executable protocol replay | P0 |

Force napi-rs WASI fallback tests where supported:

```bash
NAPI_RS_FORCE_WASI=error npm test
```

- **[P0]** A core-only pass does not establish boundary parity.
- **[P0]** A native pass does not establish WASM or WASI parity.
- **[P0]** Compilation does not establish artifact loadability.
- **[P0]** Every shipped target must replay the same committed inputs without normalization.
- **[P0]** Golden expected output must be generated by TypeScript, never authored by Rust.
- **[P0]** CI must never automatically accept changed golden output.

### Required Parity Test Inventory

- **[P1]** `parity_golden.rs`
- **[P1]** `determinism.rs`
- **[P1]** `property_parity.rs`
- **[P1]** `boundary_native.rs`
- **[P1]** `boundary_wasm.rs`
- **[P1]** `error_parity.rs`

Every parity failure is a compatibility defect until the TypeScript contract is intentionally changed and all consumers, fixtures, declarations, and boundaries are updated together.

---

## 13. RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Formatting, naming, ownership, and Rust/TypeScript coexistence conventions
- [quick_reference.md](./quick_reference.md) - Copy-paste Rust boundary templates, Cargo commands, and deterministic recipes
