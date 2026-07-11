---
title: Formatting Rules & Import/Module Ordering
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment. — Formatting Rules & Import/Module Ordering.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Formatting Rules & Import/Module Ordering

## 6. FORMATTING RULES

### rustfmt Is Authoritative

All Rust code MUST be formatted by the workspace-pinned `rustfmt`.

```bash
cargo fmt --all
cargo fmt --all --check
```

Do not hand-format code against `rustfmt`. If formatting is unsuitable, simplify the code before adding formatter overrides.

### Indentation

- **Size**: 4 spaces
- **Tabs**: Never use literal tabs in source
- **Continuation**: Let `rustfmt` determine continuation indentation

### Braces

Use standard Rust brace placement:

```rust
if condition {
    run_primary();
} else {
    run_fallback();
}

fn run_primary() {}

fn run_fallback() {}
```

### Semicolons

Use semicolons for statements and omit the semicolon from an expression intentionally returned from a block.

```rust
fn doubled(value: u32) -> u32 {
    value * 2
}

fn record(value: u32, output: &mut Vec<u32>) {
    output.push(value);
}
```

Do not add `return` solely to avoid understanding a short tail expression. Use explicit `return` for early exits.

```rust
fn normalize(value: f64) -> Result<f64, &'static str> {
    if !value.is_finite() {
        return Err("value must be finite");
    }

    Ok(value)
}
```

### Line Length

- Follow the workspace `rustfmt` configuration.
- Prefer source that remains readable near 100 characters.
- Allow formatter-controlled exceptions for URLs, generated names, and signatures that become less readable when manually decomposed.
- Do not use `#[rustfmt::skip]` for ordinary handwritten code.

### Trailing Commas

Use trailing commas in multiline structs, enums, calls, arrays, tuples, and parameter lists.

```rust
struct SearchConfig {
    query: String,
    limit: u32,
    include_metadata: bool,
}

fn search(
    config: &SearchConfig,
    candidates: &[Candidate],
) -> Result<Vec<Candidate>, SearchError> {
    Ok(candidates.to_vec())
}

#[derive(Clone)]
struct Candidate;

#[derive(Debug)]
struct SearchError;
```

### Multiline Types

Break complex types at logical boundaries. Introduce a descriptive type alias when it clarifies a domain concept rather than merely shortening a line.

```rust
use std::collections::BTreeMap;

type RankedByGroup = BTreeMap<String, Vec<RankedCandidate>>;

#[derive(Debug)]
struct RankedCandidate {
    id: String,
    score: f64,
}

fn group_ranked_candidates(
    candidates: impl IntoIterator<Item = RankedCandidate>,
) -> RankedByGroup {
    let mut grouped = BTreeMap::new();

    for candidate in candidates {
        grouped
            .entry(candidate.id.clone())
            .or_insert_with(Vec::new)
            .push(candidate);
    }

    grouped
}
```

### Match Formatting

Prefer exhaustive `match` expressions for boundary-relevant enums and errors.

```rust
enum CoreError {
    InvalidInput,
    NonFiniteScore,
    InternalInvariant,
}

fn error_code(error: &CoreError) -> &'static str {
    match error {
        CoreError::InvalidInput => "INVALID_INPUT",
        CoreError::NonFiniteScore => "NON_FINITE_SCORE",
        CoreError::InternalInvariant => "INTERNAL_INVARIANT",
    }
}
```

Do not add a wildcard arm merely to silence a new variant in an adapter. Exhaustive matching protects JavaScript error-code parity.

### Numeric Literals

Use separators when they clarify scale:

```rust
const MICROS_PER_UNIT: f64 = 1_000_000.0;
const MAX_SAFE_INTEGER: u64 = 9_007_199_254_740_991;
```

Do not use magic constants for parity-sensitive operations. Name the scale, radix, delimiter, truncation length, and algorithm parameters.

### Deterministic Collection Formatting

Use canonical collection types when order is observable:

```rust
use std::collections::BTreeMap;

fn canonical_metadata() -> BTreeMap<String, String> {
    BTreeMap::from([
        ("kind".to_owned(), "memory".to_owned()),
        ("state".to_owned(), "active".to_owned()),
    ])
}
```

Do not rely on `HashMap` or `HashSet` iteration for:

- Serialized output
- Hash preimages
- Deterministic identifiers
- Ranking or traversal
- Snapshot text
- JavaScript-visible arrays
- Diagnostic output covered by golden fixtures

### Sorting Rules

Every observable sort MUST use a complete comparator with a deterministic unique terminal key.

```rust
use std::cmp::Ordering;

#[derive(Debug, Clone)]
struct RankedCandidate {
    id: String,
    score: f64,
    source_index: u32,
}

fn sort_candidates(candidates: &mut [RankedCandidate]) {
    candidates.sort_by(|left, right| {
        right
            .score
            .total_cmp(&left.score)
            .then_with(|| left.id.cmp(&right.id))
            .then_with(|| left.source_index.cmp(&right.source_index))
    });
}
```

Requirements:

- Reject non-finite values before sorting unless their order is explicitly contracted.
- Do not use `partial_cmp(...).unwrap()`.
- Do not use `sort_unstable*` for parity-visible output.
- Do not treat stable input order as the terminal tie-break.
- Verify lexical ordering against the permitted TypeScript identifier alphabet.
- Do not assume Rust `str::cmp` is equivalent to locale-sensitive JavaScript comparison.

### Numeric Parity Helpers

Keep distinct TypeScript operations in distinct helpers.

```rust
const SIX_DECIMAL_SCALE: f64 = 1_000_000.0;

fn round_scaled_six(value: f64) -> Result<f64, &'static str> {
    if !value.is_finite() {
        return Err("value must be finite");
    }

    let rounded = (value * SIX_DECIMAL_SCALE).round() / SIX_DECIMAL_SCALE;
    Ok(if rounded == 0.0 { 0.0 } else { rounded })
}

fn fixed_six_text(value: f64) -> Result<String, &'static str> {
    if !value.is_finite() {
        return Err("value must be finite");
    }

    Ok(format!("{value:.6}"))
}
```

These helpers demonstrate separate operations; they do not establish TypeScript equivalence by themselves. JavaScript and Rust differ on rounding edge cases, negative zero, and number spelling. Each parity helper requires exhaustive fixtures generated by the pinned TypeScript oracle.

Never substitute one of the following without fixture evidence:

- `format!("{value:.6}")`
- `f64::to_string`
- A shortest-round-trip formatter
- `serde_json` number serialization
- `(value * scale).round() / scale`

---

## 7. IMPORT AND MODULE ORDERING

### Import Group Order

Rust imports follow a three-group ordering with blank lines between groups:

```rust
// 1. Standard library
use std::cmp::Ordering;
use std::collections::BTreeMap;

// 2. Third-party crates
use serde::{Deserialize, Serialize};
use thiserror::Error;

// 3. Current crate
use crate::error::CoreError;
use crate::ids::SymbolId;
```

Within each group:

- Let `rustfmt` normalize brace layout.
- Sort imports lexically.
- Prefer one import tree per root where it remains readable.
- Do not use wildcard imports outside tightly scoped test preludes or established macro preludes.
- Keep trait imports visible when they enable methods whose origin would otherwise be unclear.

### `self`, `super`, and `crate`

Use absolute `crate::` paths for ordinary cross-module imports. Use `super::` for parent-relative test or implementation details when the relationship is local and stable.

```rust
use crate::error::CoreError;
use crate::ranking::RankedCandidate;
```

Unit tests commonly import the module under test through `super`:

```rust
#[cfg(test)]
mod tests {
    use super::{round_scaled_six, SIX_DECIMAL_SCALE};

    #[test]
    fn scale_is_six_decimal_places() {
        assert_eq!(SIX_DECIMAL_SCALE, 1_000_000.0);
        assert_eq!(round_scaled_six(1.0), Ok(1.0));
    }
}
```

### Module Declaration Order

Place module declarations after imports and before ordinary types or functions unless the crate root uses declarations as its primary index.

```rust
mod dto;
mod error;
mod ids;
mod ranking;

pub use dto::{SearchOptions, SearchResult};
pub use error::CoreError;
pub use ids::SymbolId;
pub use ranking::rank_candidates;
```

### Re-Exports

Re-export only the intended stable surface.

```rust
mod error;
mod ranking;

pub use error::CoreError;
pub use ranking::{rank_candidates, Candidate, RankedCandidate};
```

Avoid:

```rust
pub use ranking::*;
```

Broad re-exports make accidental API growth difficult to detect and can expose adapter-internal types.

### Macro Imports

Import derive macros and attributes explicitly:

```rust
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use thiserror::Error;
```

Do not use `#[macro_use] extern crate ...` in modern Rust.

### Conditional Imports

Keep target-specific imports close to the target-specific module. Prefer separate adapter crates. When conditional compilation is necessary, make it explicit:

```rust
#[cfg(feature = "native")]
use napi::bindgen_prelude::Buffer;

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::JsValue;
```

Do not conditionally import runtime values into the pure core.

### Dependency Direction

The permitted dependency direction is:

```text
napi adapter ─┐
wasm adapter ─┼──> pure core
sidecar ──────┘
```

The pure core MUST NOT depend on:

- `napi`
- `napi-derive`
- `wasm-bindgen`
- `JsValue`
- Node handles
- WASM runtime handles
- Sidecar framing or process I/O

This protects the transport-neutral core contract and prevents runtime-specific behavior from changing deterministic algorithms.

---

