---
title: P0 — Safety & Boundary Discipline
description: Quality validation checklist for Rust interop code in the OpenCode development environment. — P0 — Safety & Boundary Discipline.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# P0 — Safety & Boundary Discipline

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

