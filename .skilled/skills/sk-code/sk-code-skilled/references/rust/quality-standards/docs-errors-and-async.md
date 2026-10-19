---
title: Rustdoc, Error/Panic Translation & Async Patterns
description: Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment. — Rustdoc, Error/Panic Translation & Async Patterns.
trigger_phrases:
  - "rustdoc error panic translation async patterns"
  - "rust docs errors and async"
  - "rust quality guidance"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rustdoc, Error/Panic Translation & Async Patterns

Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Provides focused Rust guidance for rustdoc, error/panic translation & async patterns in the OpenCode development environment.

### When to Use

- Implementing or reviewing Rust code covered by this topic
- Preserving TypeScript interoperability and deterministic behavior
- Applying the corresponding Rust standards at an implementation boundary

---

## 2. RUSTDOC AND BOUNDARY DOCUMENTATION

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

## 3. ERROR AND PANIC TRANSLATION

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

## 4. ASYNC, THREADING, AND RUNTIME PATTERNS

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

