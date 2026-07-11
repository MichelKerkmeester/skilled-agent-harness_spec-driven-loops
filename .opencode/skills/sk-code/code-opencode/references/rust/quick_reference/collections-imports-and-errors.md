---
title: Collections, Imports/Exports & Error Mapping
description: Copy-paste boundary templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode. — Collections, Imports/Exports & Error Mapping.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Collections, Imports/Exports & Error Mapping

## 6. COLLECTION AND CONVERSION PATTERNS

### Canonical Map

```rust
use std::collections::BTreeMap;

fn canonical_metadata(
    entries: impl IntoIterator<Item = (String, String)>,
) -> BTreeMap<String, String> {
    entries.into_iter().collect()
}
```

Use `BTreeMap` when key order is observable through serialization, hashing, IDs, traversal, or output. A `HashMap` may be used internally only when its iteration order cannot escape.

### Collect and Sort

```rust
fn canonical_pairs(
    entries: impl IntoIterator<Item = (String, String)>,
) -> Vec<(String, String)> {
    let mut entries: Vec<_> = entries.into_iter().collect();
    entries.sort_by(|left, right| {
        left.0
            .cmp(&right.0)
            .then_with(|| left.1.cmp(&right.1))
    });
    entries
}
```

Use a complete comparator. Do not rely on stable input order as an implicit final tie-break.

### Fallible Collection

```rust
fn parse_ids(values: Vec<String>) -> Result<Vec<SymbolId>, ParseIdError> {
    values
        .into_iter()
        .map(SymbolId::try_from)
        .collect()
}
```

### Fixed-Width Boundary Conversion

```rust
use thiserror::Error;

#[derive(Debug, Error)]
enum CountError {
    #[error("count exceeds the u32 boundary")]
    OutOfRange,
}

fn boundary_count(value: usize) -> Result<u32, CountError> {
    u32::try_from(value).map_err(|_| CountError::OutOfRange)
}
```

Do not use `as` for narrowing conversions.

### Borrow in the Core, Own at the Boundary

```rust
fn score_text(text: &str, terms: &[String]) -> f64 {
    terms
        .iter()
        .filter(|term| text.contains(term.as_str()))
        .count() as f64
}

pub fn score_request(request: ScoreRequestDto) -> Result<ScoreOutputDto, CoreError> {
    let score = score_text(&request.text, &request.terms);
    ScoreOutputDto::try_from(score)
}
```

When `as` conversions are denied, replace the final conversion with an explicitly reviewed helper or a checked intermediate type appropriate to the domain.

### IndexMap Exception

```rust
use indexmap::IndexMap;

fn insertion_ordered_fields() -> IndexMap<String, String> {
    IndexMap::new()
}
```

Use `IndexMap` only when deterministic insertion order is itself the documented contract. If canonical key order is required, prefer `BTreeMap`.

---

## 7. IMPORT, MODULE, AND EXPORT TEMPLATES

### Import Ordering

```rust
// 1. Standard library
use std::cmp::Ordering;
use std::collections::BTreeMap;
use std::path::Path;

// 2. Third-party crates
use serde::{Deserialize, Serialize};
use thiserror::Error;

// 3. Local crate modules
use crate::error::CoreError;
use crate::ids::SymbolId;
use crate::ranking::RankedItem;
```

Let `rustfmt` normalize each group. Avoid wildcard imports outside a tightly scoped prelude or test module.

### Module Declaration

```rust
// lib.rs
mod dto;
mod error;
mod ids;
mod ranking;

pub use dto::{RankRequestDto, RankedItemDto};
pub use error::CoreError;
pub use ranking::rank_items;
```

Keep implementation modules private and re-export the intentional public surface.

### Restricted Re-export

```rust
pub(crate) use crate::ids::SymbolId;
pub use crate::ranking::{rank_items, RankedItem};
```

Use `pub(crate)` for workspace-internal details. Do not expose core internals merely because an adapter needs them; define a deliberate adapter-facing API.

### Feature-Gated Boundary Modules

```rust
#[cfg(feature = "native-addon")]
mod napi_adapter;

#[cfg(feature = "wasm")]
mod wasm_adapter;
```

Prefer separate adapter crates when dependencies would otherwise contaminate the pure core.

### Cargo Feature Declaration

```toml
[features]
default = []
native-addon = ["dep:napi", "dep:napi-derive"]
wasm = ["dep:wasm-bindgen", "dep:serde-wasm-bindgen"]

[dependencies]
napi = { version = "3", optional = true }
napi-derive = { version = "3", optional = true }
serde-wasm-bindgen = { version = "0.6", optional = true }
wasm-bindgen = { version = "0.2", optional = true }
```

Native and WASM features must compile independently. Do not make boundary runtimes default dependencies of the core.

---

## 8. ERROR AND PANIC MAPPING

### Domain Error

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("query must not be empty")]
    EmptyQuery,

    #[error("score must be finite")]
    NonFiniteScore,

    #[error("record not found: {id}")]
    NotFound { id: String },

    #[error("canonical serialization failed: {message}")]
    Serialization { message: String },
}
```

Core errors carry structured adapter-relevant context but no napi-rs, wasm-bindgen, Node, or WASM runtime types. Do not expose `anyhow::Error` from pure-core public APIs.

### Exhaustive napi-rs Mapping

```rust
use napi::{Error, Status};

fn to_napi_error(error: CoreError) -> Error {
    let (status, code) = match error {
        CoreError::EmptyQuery => (Status::InvalidArg, "INVALID_PARAMETER"),
        CoreError::NonFiniteScore => (Status::InvalidArg, "INVALID_SCORE"),
        CoreError::NotFound { .. } => (Status::GenericFailure, "NOT_FOUND"),
        CoreError::Serialization { .. } => {
            (Status::GenericFailure, "SERIALIZATION_FAILED")
        }
    };

    Error::new(status, format!("{code}: {error}"))
}
```

Do not add a wildcard arm. New core variants must force every adapter mapping to be reviewed.

### Exhaustive WASM Mapping

```rust
fn core_error_to_js(error: CoreError) -> JsValue {
    let code = match error {
        CoreError::EmptyQuery => "INVALID_PARAMETER",
        CoreError::NonFiniteScore => "INVALID_SCORE",
        CoreError::NotFound { .. } => "NOT_FOUND",
        CoreError::Serialization { .. } => "SERIALIZATION_FAILED",
    };

    to_js_error(code, &error.to_string())
}
```

Golden-test JavaScript `name`, `code`, `message`, `cause`, and synchronous throw versus Promise rejection behavior.

### Guard Clauses

```rust
fn validate_score(value: f64) -> Result<f64, CoreError> {
    if !value.is_finite() {
        return Err(CoreError::NonFiniteScore);
    }

    Ok(if value == 0.0 { 0.0 } else { value })
}
```

Do not allow JavaScript-controlled input to reach:

- `unwrap` or `expect`
- Explicit `panic!`
- Unchecked indexing
- `partial_cmp(...).unwrap()`
- Assertions used as recoverable validation
- Integer or allocation overflow

### Panic Containment

Prevent panics by construction. A panic hook or `catch_unwind` is not a substitute for typed validation. If an external callback can unwind, contain it only at the narrowest reviewed native boundary and preserve the established error shape.

Never permit unwinding across FFI.

### Narrow Lint Suppression

```rust
#[allow(
    clippy::indexing_slicing,
    reason = "the preceding length equality check proves both indices are in bounds"
)]
fn compare_equal_length(left: &[u8], right: &[u8]) -> bool {
    if left.len() != right.len() {
        return false;
    }

    for index in 0..left.len() {
        if left[index] != right[index] {
            return false;
        }
    }

    true
}
```

Keep suppressions local and explain the durable invariant. Do not suppress a lint crate-wide to avoid fixing boundary-controlled code.

---

