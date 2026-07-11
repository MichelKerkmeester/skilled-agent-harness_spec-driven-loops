---
title: Determinism, Parity & Common Recipes
description: Copy-paste boundary templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode. — Determinism, Parity & Common Recipes.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Determinism, Parity & Common Recipes

## 11. DETERMINISM, PARITY, AND COMMON RECIPES

### Finite Score and Signed-Zero Policy

```rust
use thiserror::Error;

#[derive(Debug, Error)]
enum ScoreError {
    #[error("score must be finite")]
    NonFinite,
}

fn normalize_score(value: f64) -> Result<f64, ScoreError> {
    if !value.is_finite() {
        return Err(ScoreError::NonFinite);
    }

    // This boundary contract serializes both signs of zero as positive zero.
    Ok(if value == 0.0 { 0.0 } else { value })
}
```

Do not normalize `-0.0` unless the TypeScript oracle does. Test `value.to_bits()` when signed zero is contractually observable.

### TypeScript `Math.round(value * 1e6) / 1e6`

```rust
const SCALE: f64 = 1_000_000.0;

fn quantize_like_math_round_six(value: f64) -> Result<f64, ScoreError> {
    if !value.is_finite() {
        return Err(ScoreError::NonFinite);
    }

    let scaled = value * SCALE;
    if !scaled.is_finite() {
        return Err(ScoreError::NonFinite);
    }

    let floor = scaled.floor();
    let fraction = scaled - floor;
    let rounded = if fraction < 0.5 { floor } else { floor + 1.0 };

    let rounded = if rounded == 0.0 && scaled.is_sign_negative() {
        -0.0
    } else {
        rounded
    };

    Ok(rounded / SCALE)
}
```

JavaScript `Math.round` resolves exact halfway cases toward positive infinity and can return negative zero. Rust `f64::round` resolves halfway cases away from zero and is not a compatible substitute.

### TypeScript `Number(value.toFixed(6))`

`toFixed(6)` is a decimal conversion contract, not binary `f64::round`. Keep it separate from the `Math.round` helper. The following bounded implementation uses the exact binary value and decimal integer arithmetic for finite values whose absolute magnitude is below `1e21`:

```rust
use num_bigint::BigUint;
use num_traits::{One, Zero};
use thiserror::Error;

const DECIMAL_PLACES: usize = 6;
const DECIMAL_SCALE: u64 = 1_000_000;

#[derive(Debug, Error)]
enum FixedError {
    #[error("value must be finite")]
    NonFinite,

    #[error("absolute value must be below 1e21")]
    OutOfContractRange,

    #[error("generated decimal could not be parsed as f64")]
    Parse,
}

fn quantize_like_number_to_fixed_six(value: f64) -> Result<f64, FixedError> {
    let text = to_fixed_six_text(value)?;
    text.parse::<f64>().map_err(|_| FixedError::Parse)
}

fn to_fixed_six_text(value: f64) -> Result<String, FixedError> {
    if !value.is_finite() {
        return Err(FixedError::NonFinite);
    }
    if value.abs() >= 1e21 {
        return Err(FixedError::OutOfContractRange);
    }

    let negative = value < 0.0;
    let rounded = rounded_scaled_integer(value.abs(), DECIMAL_SCALE);
    let mut digits = rounded.to_str_radix(10);

    if digits.len() <= DECIMAL_PLACES {
        let zeros = "0".repeat(DECIMAL_PLACES + 1 - digits.len());
        digits = format!("{zeros}{digits}");
    }

    let split = digits.len() - DECIMAL_PLACES;
    let sign = if negative { "-" } else { "" };
    Ok(format!("{sign}{}.{}", &digits[..split], &digits[split..]))
}

fn rounded_scaled_integer(value: f64, scale: u64) -> BigUint {
    if value == 0.0 {
        return BigUint::zero();
    }

    let bits = value.to_bits();
    let exponent_bits = ((bits >> 52) & 0x7ff) as i32;
    let fraction_bits = bits & ((1_u64 << 52) - 1);

    let (significand, binary_exponent) = if exponent_bits == 0 {
        (BigUint::from(fraction_bits), -1_074)
    } else {
        (
            BigUint::from((1_u64 << 52) | fraction_bits),
            exponent_bits - 1_023 - 52,
        )
    };

    let numerator = significand * BigUint::from(scale);
    if binary_exponent >= 0 {
        return numerator << usize::try_from(binary_exponent).unwrap_or_default();
    }

    let shift = usize::try_from(-binary_exponent).unwrap_or_default();
    let denominator = BigUint::one() << shift;
    let quotient = &numerator / &denominator;
    let remainder = numerator % &denominator;

    if (&remainder << 1_usize) >= denominator {
        quotient + BigUint::one()
    } else {
        quotient
    }
}
```

The bounded range is deliberate. ECMAScript switches to ordinary number-to-string behavior at `1e21`; implement and golden-test that separate path only if the boundary contract permits values in that range. Do not replace this helper with `format!("{value:.6}")`, `f64::to_string`, `ryu`, or `serde_json`.

### Fixed-Six Text

```rust
fn fixed_six_text(value: f64) -> Result<String, FixedError> {
    to_fixed_six_text(value)
}
```

Keep fixed-six text separate from numeric quantization. `"1.230000"` and the number `1.23` are not byte-equivalent wire values.

### Stable Sort With Terminal Tie-Break

```rust
use std::cmp::Ordering;

#[derive(Debug)]
struct Candidate {
    score: f64,
    source_priority: u32,
    id: String,
}

fn compare_candidates(left: &Candidate, right: &Candidate) -> Ordering {
    right
        .score
        .total_cmp(&left.score)
        .then_with(|| left.source_priority.cmp(&right.source_priority))
        .then_with(|| left.id.cmp(&right.id))
}

fn sort_candidates(candidates: &mut [Candidate]) {
    candidates.sort_by(compare_candidates);
}
```

Validate scores as finite before sorting. Verify that Rust string ordering matches the permitted TypeScript identifier alphabet. Do not assume equivalence with `localeCompare`.

Never use `sort_unstable*` for parity-visible output, stable input order as the final tie-break, or `partial_cmp(...).unwrap()`.

### Exact Deterministic-ID Construction

```rust
use sha2::{Digest, Sha256};

fn deterministic_id(namespace: &str, source_id: &str, text: &str) -> String {
    let mut hasher = Sha256::new();

    // These fields, separators, UTF-8 bytes, and their order define the ID contract.
    hasher.update(namespace.as_bytes());
    hasher.update(b"\0");
    hasher.update(source_id.as_bytes());
    hasher.update(b"\0");
    hasher.update(text.as_bytes());

    let digest = hasher.finalize();
    hex::encode(digest).chars().take(24).collect()
}
```

The TypeScript oracle defines:

- Included fields
- Field order
- Delimiters and escaping
- UTF-8 encoding
- Hash algorithm
- Lowercase or uppercase encoding
- Truncation unit and length

Do not improve or redesign the preimage inside a parity migration.

### BTreeMap Canonicalization

```rust
use std::collections::BTreeMap;

fn canonical_object(
    entries: impl IntoIterator<Item = (String, String)>,
) -> BTreeMap<String, String> {
    entries.into_iter().collect()
}
```

### Collect-and-Sort Canonicalization

```rust
fn canonical_edges(
    edges: impl IntoIterator<Item = (String, String)>,
) -> Vec<(String, String)> {
    let mut edges: Vec<_> = edges.into_iter().collect();
    edges.sort_by(|left, right| {
        left.0
            .cmp(&right.0)
            .then_with(|| left.1.cmp(&right.1))
    });
    edges.dedup();
    edges
}
```

### Canonical Byte Serialization

```rust
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
enum SerializationError {
    #[error("canonical JSON serialization failed: {0}")]
    Json(#[from] serde_json::Error),
}

fn canonical_json_line<T: Serialize>(
    value: &T,
) -> Result<Vec<u8>, SerializationError> {
    let mut bytes = serde_json::to_vec(value)?;
    bytes.push(b'\n');
    Ok(bytes)
}
```

Use structs for fixed field order and `BTreeMap` for dynamic object keys. `serde_json` is acceptable only when golden fixtures prove that field omission, escaping, numeric spelling, and newline behavior match the TypeScript serializer. Semantic JSON comparison is diagnostic only.

### Narrow Unsafe Wrapper

```rust
#![deny(unsafe_op_in_unsafe_fn)]

use thiserror::Error;

#[derive(Debug, Error, PartialEq, Eq)]
enum CopyError {
    #[error("requested prefix exceeds the source length")]
    LengthOutOfRange,
}

fn copy_prefix(bytes: &[u8], length: usize) -> Result<Vec<u8>, CopyError> {
    if length > bytes.len() {
        return Err(CopyError::LengthOutOfRange);
    }

    // SAFETY: bytes.as_ptr() is valid and aligned for u8 reads, length was
    // checked against the live slice, the source remains borrowed for the
    // operation, and the returned Vec owns a copy rather than an alias.
    let prefix = unsafe { std::slice::from_raw_parts(bytes.as_ptr(), length) };
    Ok(prefix.to_vec())
}

#[cfg(test)]
mod tests {
    use super::{copy_prefix, CopyError};

    #[test]
    fn copies_a_valid_prefix() -> Result<(), CopyError> {
        assert_eq!(copy_prefix(b"abcdef", 3)?, b"abc");
        Ok(())
    }

    #[test]
    fn rejects_a_length_beyond_the_live_slice() {
        assert_eq!(
            copy_prefix(b"abc", 4),
            Err(CopyError::LengthOutOfRange),
        );
    }

    #[test]
    fn accepts_an_empty_prefix() -> Result<(), CopyError> {
        assert!(copy_prefix(b"", 0)?.is_empty());
        Ok(())
    }
}
```

The pure core uses `#![forbid(unsafe_code)]`; place reviewed unsafe wrappers in the narrow boundary crate. Every unsafe block needs an adjacent invariant, an exercising test, and a precondition-challenge test.

### Golden Replay Across Boundaries

```bash
# Generate expected bytes only from the pinned TypeScript oracle
node test/oracle/generate-goldens.mjs \
  --inputs test/goldens/inputs \
  --output /tmp/typescript-goldens

# Require committed expected bytes to match the oracle exactly
diff -ru test/goldens/expected /tmp/typescript-goldens

# Replay the same corpus through every shipped Rust boundary
cargo test -p ranking-core --test parity_golden --locked
cargo test -p ranking-napi --test boundary_native --locked
cargo test -p ranking-wasm --test boundary_wasm --locked

# Compare output as raw bytes without JSON normalization
cmp test/goldens/expected/results.jsonl \
  target/parity/native/results.jsonl
cmp test/goldens/expected/results.jsonl \
  target/parity/wasm/results.jsonl
cmp test/goldens/expected/results.jsonl \
  target/parity/wasi/results.jsonl
```

Goldens cover halfway values, adjacent floats, negative zero, non-finite policy, every comparator branch, Unicode, missing versus null, permuted insertion order, and deterministic-ID preimages.

### Determinism Replay

```bash
for seed in 1 2 3 4 5; do
  PARITY_SEED="$seed" cargo test -p ranking-core --test determinism --locked
done
```

Also rerun in fresh processes so process-randomized hash state and incidental initialization order cannot remain hidden.

### Forced WASI Fallback

```bash
NAPI_RS_FORCE_WASI=error \
  node test/boundary/forced-wasi-fallback.mjs
```

The test must fail if the native addon loads successfully or if the fallback silently uses a different ABI. Compare the forced-WASI output and JavaScript error behavior against the same TypeScript oracle and native golden corpus.

---

## 12. RELATED RESOURCES

- [style_guide.md](../style_guide/overview-and-file-header.md) - Detailed formatting, naming, module, and interop rules
- [quality_standards.md](../quality_standards/overview-and-data-ownership.md) - Safety, boundary, determinism, and verification requirements
