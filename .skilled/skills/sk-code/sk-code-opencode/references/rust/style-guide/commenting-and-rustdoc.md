---
title: Commenting & Rustdoc Rules
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment. — Commenting & Rustdoc Rules.
trigger_phrases:
  - "commenting rustdoc rules"
  - "rust commenting and rustdoc"
  - "rust style guidance"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Commenting & Rustdoc Rules

Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Provides focused Rust guidance for commenting & rustdoc rules in the OpenCode development environment.

### When to Use

- Implementing or reviewing Rust code covered by this topic
- Preserving TypeScript interoperability and deterministic behavior
- Applying the corresponding Rust standards at an implementation boundary

---

## 2. COMMENTING AND RUSTDOC RULES

### Comment Principles

1. Explain durable constraints, invariants, and tradeoffs.
2. Explain WHY the code differs from an obvious alternative.
3. Name the parity, ownership, safety, or error contract protected.
4. Do not restate syntax or mechanics.
5. Do not keep commented-out code.
6. Do not embed transient packet, task, checklist, ADR, ticket, or spec-folder identifiers.
7. Keep comments accurate when behavior changes.

### Comment Examples

```rust
// The identifier is the terminal key so equal scores never inherit input order.
candidates.sort_by(compare_candidates);

// Normalize negative zero because the JavaScript wire contract emits positive zero.
let score = if score == 0.0 { 0.0 } else { score };

// Copy before scheduling because JavaScript retains ownership of the source buffer.
let owned_input = input.to_vec();
```

Avoid comments that narrate mechanics:

```rust
// Sort the candidates.
candidates.sort_by(compare_candidates);

// Convert the input into a vector.
let owned_input = input.to_vec();
```

### Capitalization

Comment prose starts with a capital letter and ends with punctuation when it is a complete sentence.

Exceptions include:

- `rustfmt` directives
- `clippy` lint names
- Code identifiers at the beginning of a fragment
- Standard tags such as `TODO`, when the repository permits them
- `// SAFETY:` invariants

### `// SAFETY:` Comments

Every allowed unsafe block requires an adjacent `// SAFETY:` comment describing all relevant assumptions:

- Pointer validity
- Length and alignment
- Initialization
- Aliasing
- Lifetime
- Ownership
- Cleanup responsibility
- Thread affinity

```rust
fn copy_bytes(pointer: *const u8, length: usize) -> Vec<u8> {
    assert!(!pointer.is_null() || length == 0);

    // SAFETY: A non-null pointer is required for non-empty input, the caller
    // guarantees `length` initialized bytes, and the bytes are copied before
    // this function returns, so no borrowed view escapes.
    let bytes = unsafe { std::slice::from_raw_parts(pointer, length) };

    bytes.to_vec()
}
```

This pattern belongs only in a reviewed boundary crate. The pure core uses `#![forbid(unsafe_code)]`.

An unsafe block also requires:

- A test exercising the valid path
- A test challenging enforceable preconditions
- Boundary documentation stating ownership and lifetime
- Review of cleanup and thread-affinity behavior

### Rustdoc Scope

Document all public boundary types and operations. Document private items when their invariants are not obvious from types and names.

Use:

- `//!` for crate and module documentation
- `///` for item documentation
- Markdown headings for contract sections
- Compilable examples
- Intra-doc links where practical

### Public Operation Template

```rust
/// Parses and validates a stable symbol identifier.
///
/// The identifier is normalized once and then used as part of the
/// deterministic hash preimage.
///
/// # Errors
///
/// Returns [`SymbolIdError`] when `value` is empty or contains an unsupported
/// character.
///
/// # Examples
///
/// ```
/// # use std::error::Error;
/// #
/// # fn main() -> Result<(), Box<dyn Error>> {
/// let id = SymbolId::try_from("memory.search")?;
/// assert_eq!(id.as_str(), "memory.search");
/// # Ok(())
/// # }
/// #
/// # #[derive(Debug)]
/// # struct SymbolId(String);
/// #
/// # impl SymbolId {
/// #     fn as_str(&self) -> &str {
/// #         &self.0
/// #     }
/// # }
/// #
/// # #[derive(Debug)]
/// # struct SymbolIdError;
/// #
/// # impl std::fmt::Display for SymbolIdError {
/// #     fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
/// #         formatter.write_str("invalid symbol identifier")
/// #     }
/// # }
/// #
/// # impl Error for SymbolIdError {}
/// #
/// # impl TryFrom<&str> for SymbolId {
/// #     type Error = SymbolIdError;
/// #
/// #     fn try_from(value: &str) -> Result<Self, Self::Error> {
/// #         if value.is_empty() {
/// #             Err(SymbolIdError)
/// #         } else {
/// #             Ok(Self(value.to_owned()))
/// #         }
/// #     }
/// # }
/// ```
pub fn parse_symbol_id(value: &str) -> Result<SymbolId, SymbolIdError> {
    SymbolId::try_from(value)
}

#[derive(Debug)]
pub struct SymbolId(String);

impl SymbolId {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug)]
pub struct SymbolIdError;

impl std::fmt::Display for SymbolIdError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str("invalid symbol identifier")
    }
}

impl std::error::Error for SymbolIdError {}

impl TryFrom<&str> for SymbolId {
    type Error = SymbolIdError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        if value.is_empty() {
            Err(SymbolIdError)
        } else {
            Ok(Self(value.to_owned()))
        }
    }
}
```

Examples for fallible operations use `?`, not `unwrap` or `expect`.

### Required Rustdoc Sections

Use exact standard headings where applicable:

- `# Errors` for fallible public operations
- `# Panics` when a public operation can panic
- `# Safety` for every `unsafe fn`
- `# Examples` for public operations and non-obvious public types

Do not add `# Panics` merely to say a function never panics. Prefer an API whose signature and implementation avoid panic paths.

### Boundary Documentation

Every exported napi-rs, WASM, WASI, or sidecar operation documents:

- Input ownership and copy behavior
- Output ownership
- JavaScript error code and shape
- Synchronous throw versus Promise rejection
- Numeric normalization behavior
- Complete comparator or hash preimage when relevant
- Serialization and key order when observable
- The parity or interop contract protected

Example:

```rust
/// Ranks candidates using the canonical TypeScript comparator.
///
/// Input strings and candidate records are copied before native worker
/// execution. Invalid input rejects the returned Promise with code
/// `INVALID_INPUT`. Equal scores are ordered by identifier and then source
/// index, protecting stable sort and serialized-output parity.
```

### Lint Suppressions

Lint suppressions require a durable reason and the narrowest possible scope.

```rust
#[allow(clippy::cast_precision_loss)]
fn age_as_score_input(age_seconds: u32) -> f64 {
    // Every u32 value is exactly representable in an f64 mantissa.
    f64::from(age_seconds)
}
```

Do not add crate-wide `allow` attributes to silence ordinary quality findings.

---

