---
title: Byte-for-Byte Determinism & Parity
description: Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment. — Byte-for-Byte Determinism & Parity.
trigger_phrases:
  - "byte for byte determinism parity"
  - "rust determinism and parity"
  - "rust quality guidance"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Byte-for-Byte Determinism & Parity

Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Provides focused Rust guidance for byte-for-byte determinism & parity in the OpenCode development environment.

### When to Use

- Implementing or reviewing Rust code covered by this topic
- Preserving TypeScript interoperability and deterministic behavior
- Applying the corresponding Rust standards at an implementation boundary

---

## 2. BYTE-FOR-BYTE DETERMINISM AND PARITY

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

## 3. RELATED RESOURCES

- [style_guide.md](../style_guide/overview_and_file_header.md) - Formatting, naming, ownership, and Rust/TypeScript coexistence conventions
- [quick_reference.md](../quick_reference/overview_and_boundary_template.md) - Copy-paste Rust boundary templates, Cargo commands, and deterministic recipes
