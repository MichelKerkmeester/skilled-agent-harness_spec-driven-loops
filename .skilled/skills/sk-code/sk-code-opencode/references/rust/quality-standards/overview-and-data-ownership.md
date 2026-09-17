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

### When to Use

- Writing or reviewing Rust core modules
- Adding napi-rs, wasm-bindgen, WASI, or sidecar adapters
- Migrating a TypeScript compute path to Rust
- Defining Rust DTOs, errors, serialization, or public exports
- Configuring Cargo, Clippy, rustfmt, MSRV, or supply-chain gates
- Testing native, WASM, or WASI artifacts against the TypeScript oracle
- Evaluating async, threading, zero-copy, or unsafe optimizations


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

