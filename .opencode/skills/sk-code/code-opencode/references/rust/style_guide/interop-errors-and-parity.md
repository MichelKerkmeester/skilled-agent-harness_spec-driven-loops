---
title: Rust/TypeScript Interop — Errors, Parity & Related Resources
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment. — Rust/TypeScript Interop — Errors, Parity & Related Resources.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust/TypeScript Interop — Errors, Parity & Related Resources

### Error Style

Core public operations return domain-specific `Result` values backed by `thiserror`.

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum RankingError {
    #[error("candidate identifier must not be empty")]
    EmptyIdentifier,

    #[error("candidate score must be finite")]
    NonFiniteScore,

    #[error("candidate limit {limit} exceeds maximum {maximum}")]
    LimitExceeded {
        limit: u32,
        maximum: u32,
    },
}
```

Rules:

- Core errors contain adapter-relevant structured context.
- Core errors contain no napi-rs, WASM, or Node runtime types.
- `anyhow` is prohibited in pure-core public APIs and exported functions.
- `anyhow` MAY be used in sidecar `main`, build tooling, and the outermost non-ABI shell.
- Every adapter owns one exhaustive mapping from core errors to stable JavaScript errors.
- Error messages and codes covered by TypeScript contracts are golden-tested.
- Panic only for an impossible internal invariant, never for recoverable boundary input.

### Exhaustive Adapter Error Mapping

```rust
#[derive(Debug)]
struct JsErrorShape {
    code: &'static str,
    message: String,
}

fn map_ranking_error(error: RankingError) -> JsErrorShape {
    match error {
        RankingError::EmptyIdentifier => JsErrorShape {
            code: "INVALID_IDENTIFIER",
            message: error.to_string(),
        },
        RankingError::NonFiniteScore => JsErrorShape {
            code: "NON_FINITE_SCORE",
            message: error.to_string(),
        },
        RankingError::LimitExceeded { .. } => JsErrorShape {
            code: "LIMIT_EXCEEDED",
            message: error.to_string(),
        },
    }
}
```

The adapter must also preserve whether the existing TypeScript operation throws synchronously or rejects a Promise.

### Panic-Free Boundary Validation

Do not use:

```rust
let score = input.parse::<f64>().unwrap();
let first = candidates[0].clone();
let ordering = left.score.partial_cmp(&right.score).unwrap();
```

Use typed failures:

```rust
use std::num::ParseFloatError;

fn parse_score(input: &str) -> Result<f64, ParseFloatError> {
    input.parse::<f64>()
}

fn first_candidate(candidates: &[String]) -> Option<&str> {
    candidates.first().map(String::as_str)
}
```

JavaScript-controlled data must not reach:

- `unwrap`
- `expect`
- Unchecked indexing
- `panic!`
- `unreachable!`
- Assertions used as validation
- `partial_cmp(...).unwrap()`

### Deterministic Identifiers

Identifier generation preserves the exact TypeScript preimage contract:

- Input fields
- Field order
- Separators
- UTF-8 encoding
- Hash algorithm
- Lowercase hexadecimal encoding
- Truncation length

```rust
use sha2::{Digest, Sha256};

fn deterministic_id(namespace: &str, name: &str) -> String {
    let preimage = format!("{namespace}\0{name}");
    let digest = Sha256::digest(preimage.as_bytes());
    let hexadecimal = format!("{digest:x}");
    hexadecimal[..24].to_owned()
}
```

This example is correct only if the TypeScript oracle uses the same fields, NUL delimiter, UTF-8 bytes, SHA-256, lowercase hexadecimal output, and 24-character truncation. Never infer those details from a semantically similar implementation.

### Stable Serialization

Do not assume `serde_json` reproduces JavaScript byte output automatically.

Potential differences include:

- Number spelling
- Negative zero
- Exponent notation
- Omitted versus `null` fields
- Escaping
- Key order
- Non-finite values
- Map iteration order

Use passive DTOs and canonical maps:

```rust
use std::collections::BTreeMap;

use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SearchResponse {
    results: Vec<SearchResult>,
    metadata: BTreeMap<String, String>,
}

#[derive(Debug, Serialize)]
struct SearchResult {
    id: String,
    score: f64,
}
```

Byte-for-byte fixtures remain required even when the Rust structure appears equivalent to the TypeScript object.

### Async and Threading

Keep parsing, scoring, ranking, hashing, canonicalization, and serialization preparation synchronous in the core.

Use napi-rs `AsyncTask` only for measured CPU or blocking work that would materially block Node.

Before worker execution:

- Convert JavaScript values into owned DTOs.
- Copy JavaScript-owned buffers.
- Validate cheap structural constraints.
- Do not retain `Env`, `JsValue`, or thread-affine handles.

After worker execution:

- Reorder results by deterministic sequence keys.
- Canonicalize output synchronously.
- Map typed errors on the JavaScript thread.

Use Tokio only for genuine Rust-owned asynchronous I/O. Use Rayon only after benchmark evidence demonstrates a useful batch-size threshold.

Parity-visible floating-point reductions MUST NOT run in nondeterministic parallel order. If parallel reduction is unavoidable, fix the reduction tree and golden-test it across every supported target.

Baseline WASM is single-threaded. Promise bridging does not create CPU parallelism.

### napi-rs Export Example

```rust
use napi::bindgen_prelude::{Error, Status};
use napi_derive::napi;

#[napi(object)]
pub struct CandidateDto {
    pub id: String,
    pub score: f64,
}

#[napi(js_name = "rankCandidates")]
pub fn rank_candidates(candidates: Vec<CandidateDto>) -> napi::Result<Vec<CandidateDto>> {
    let mut candidates = candidates;

    if candidates.iter().any(|candidate| !candidate.score.is_finite()) {
        return Err(Error::new(
            Status::InvalidArg,
            "NON_FINITE_SCORE: candidate score must be finite",
        ));
    }

    candidates.sort_by(|left, right| {
        right
            .score
            .total_cmp(&left.score)
            .then_with(|| left.id.cmp(&right.id))
    });

    Ok(candidates)
}
```

In production, ranking belongs in the pure core and the adapter converts DTOs and errors only. The example shows the JavaScript-visible naming and owned boundary shape.

### wasm-bindgen Export Example

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = normalizeScore)]
pub fn normalize_score(value: f64) -> Result<f64, JsValue> {
    if !value.is_finite() {
        return Err(JsValue::from_str(
            "NON_FINITE_SCORE: score must be finite",
        ));
    }

    let normalized = (value * 1_000_000.0).round() / 1_000_000.0;
    Ok(if normalized == 0.0 { 0.0 } else { normalized })
}
```

The exact rounding implementation and error shape require differential fixtures against the TypeScript oracle before release.

### Coexistence and Fallbacks

TypeScript retains fallback selection. Rust adapters expose capability; they do not silently choose themselves.

```typescript
const result = flags.nativeRanking && nativeAddon !== null
  ? await nativeAddon.rankCandidates(input)
  : await rankCandidatesTypeScript(input);
```

Both paths must emit identical bytes for the supported input domain. A semantic deep-equality test is useful for diagnosis but does not replace the byte comparison.

### Differential Test Contract

The release-level assertion is:

```rust
fn assert_byte_parity(
    typescript_bytes: &[u8],
    rust_bytes: &[u8],
) {
    assert_eq!(typescript_bytes, rust_bytes);
}
```

Golden fixtures MUST originate from the pinned TypeScript oracle. Rust must not author or automatically accept its own expected output.

Parity fixtures cover:

- Six-decimal edge cases
- Positive and negative halfway values
- Negative zero
- Very small and very large finite numbers
- Complete sorting ties
- Identifier alphabet boundaries
- Unicode and UTF-8 preimages
- Optional and omitted fields
- Empty collections
- Map and object ordering
- Error codes and exact messages
- Synchronous throws and Promise rejections
- Native and WASM artifacts

---

## 10. RELATED RESOURCES

- [quality_standards.md](../quality_standards/overview-and-data-ownership.md) - Ownership, safety, ABI contracts, error translation, concurrency, Cargo, and parity gates
- [quick_reference.md](../quick_reference/overview-and-boundary-template.md) - Copy-paste Rust boundary templates, deterministic recipes, and build commands
