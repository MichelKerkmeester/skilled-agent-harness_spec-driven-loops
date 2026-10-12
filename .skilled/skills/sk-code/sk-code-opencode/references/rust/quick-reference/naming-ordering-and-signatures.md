---
title: Naming, Section Ordering & Signature Patterns
description: Copy-paste boundary templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode. — Naming, Section Ordering & Signature Patterns.
trigger_phrases:
  - "naming section ordering signature patterns"
  - "rust naming ordering and signatures"
  - "rust quick reference"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Naming, Section Ordering & Signature Patterns

Copy-paste boundary templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode.

---

## 1. OVERVIEW

### Purpose

Provides focused Rust guidance for naming, section ordering & signature patterns in the OpenCode development environment.

### When to Use

- Implementing or reviewing Rust code covered by this topic
- Preserving TypeScript interoperability and deterministic behavior
- Applying the corresponding Rust standards at an implementation boundary

---

## 2. NAMING CHEAT SHEET

| Element | Convention | Example |
|---|---|---|
| Crates | `kebab-case` package name | `ranking-core` |
| Crate imports | `snake_case` | `ranking_core` |
| Modules and files | `snake_case` | `error_mapping.rs` |
| Functions | `snake_case` | `load_config` |
| Local variables | `snake_case` | `search_results` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Structs | `UpperCamelCase` | `SearchResult` |
| Enums | `UpperCamelCase` | `MemoryState` |
| Enum variants | `UpperCamelCase` | `InvalidParameter` |
| Traits | `UpperCamelCase` | `CanonicalSerialize` |
| Type parameters | Short `UpperCamelCase` | `T`, `TResult` |
| Lifetimes | Short lowercase | `'a`, `'input` |
| Cheap borrowed view | `as_*` | `as_bytes` |
| Allocating conversion | `to_*` | `to_canonical_json` |
| Consuming conversion | `into_*` | `into_inner` |
| Boolean predicates | `is_*`/`has_*`/`can_*` | `is_finite` |
| napi-rs JS export | Rust `snake_case`, explicit JS rename | `#[napi(js_name = "rankItems")]` |
| wasm-bindgen JS export | Rust `snake_case`, explicit JS rename | `#[wasm_bindgen(js_name = rankItems)]` |
| JS-visible fields | Existing TypeScript spelling | `sourceId` |
| Feature flags | `kebab-case` | `native-addon` |

Treat acronyms as words: use `Uuid`, `HttpClient`, and `WasiAdapter`, not `UUID`, `HTTPClient`, or `WASIAdapter`.

Omit `get_` from ordinary getters:

```rust
impl RankedItem {
    pub fn score(&self) -> f64 {
        self.score
    }
}
```

Keep core naming idiomatic. Preserve existing JavaScript names through boundary attributes or serialization configuration rather than introducing camelCase into core Rust symbols.

---

## 3. SECTION ORDERING

```text
1. CRATE ATTRIBUTES       (unsafe and lint policy)
2. MODULE DECLARATIONS    (mod and public module declarations)
3. IMPORTS                (std, third-party, local)
4. TYPE DEFINITIONS       (DTOs, domain types, errors)
5. CONSTANTS              (contract and configuration values)
6. TRAIT IMPLEMENTATIONS  (From, TryFrom, standard traits)
7. PUBLIC OPERATIONS      (documented crate/module API)
8. PRIVATE HELPERS        (validation and deterministic kernels)
9. TESTS                  (unit tests in cfg(test))
```

For a workspace:

```text
core       algorithms, validation, normalization, sorting, hashing, IDs
napi       napi-rs DTO conversion and JavaScript error mapping
wasm       wasm-bindgen DTO conversion and JavaScript error mapping
sidecar    process protocol only, if a measured sidecar is justified
```

Adapters must not duplicate scoring, sorting, hashing, rounding, deterministic-ID construction, or business validation.

---

## 4. BOUNDARY TYPE AND SIGNATURE PATTERNS

### Owned Boundary DTOs

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchRequestDto {
    pub query: String,
    pub limit: u32,
    pub tags: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResultDto {
    pub id: String,
    pub score: f64,
    pub metadata: std::collections::BTreeMap<String, String>,
}
```

Export owned, materialized values:

- `String`, not `&str` or `Cow<'a, str>`
- `Vec<T>`, not slices or iterators
- Fixed-width integers, not `usize` or `isize`
- Passive DTO structs, not builders or internal graph references
- `Result<OwnedOutput, BoundaryError>`, not panic-dependent validation

Integers outside JavaScript's safe integer range require an explicit `BigInt` or decimal-string contract.

### Fallible DTO Conversion

```rust
use std::num::NonZeroU32;

use thiserror::Error;

#[derive(Debug)]
struct SearchLimit(NonZeroU32);

#[derive(Debug, Error)]
enum ValidationError {
    #[error("limit must be between 1 and 1000")]
    InvalidLimit,
}

impl TryFrom<u32> for SearchLimit {
    type Error = ValidationError;

    fn try_from(value: u32) -> Result<Self, Self::Error> {
        if value > 1_000 {
            return Err(ValidationError::InvalidLimit);
        }

        NonZeroU32::new(value)
            .map(Self)
            .ok_or(ValidationError::InvalidLimit)
    }
}
```

Use `From` only when conversion is infallible, lossless, and value-preserving. Use `TryFrom` for validation, finite-number checks, narrowing, enum parsing, and identifier normalization.

### Synchronous napi-rs Export

```rust
use napi::Result;
use napi_derive::napi;

#[napi(js_name = "canonicalizeRecords")]
pub fn canonicalize_records(input: RecordsDto) -> Result<CanonicalRecordsDto> {
    execute(input).map_err(to_napi_error)
}
```

A synchronous boundary failure throws using the established JavaScript error shape.

### napi-rs AsyncTask

```rust
use napi::bindgen_prelude::AsyncTask;
use napi::{Env, Result, Task};
use napi_derive::napi;

struct CanonicalizeTask {
    input: Option<OwnedInput>,
}

impl Task for CanonicalizeTask {
    type Output = OwnedOutput;
    type JsValue = OutputDto;

    fn compute(&mut self) -> Result<Self::Output> {
        let input = self.input.take().ok_or_else(internal_state_error)?;
        core::canonicalize(input).map_err(to_napi_error)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output.into())
    }
}

#[napi(js_name = "canonicalizeRecordsAsync")]
fn canonicalize_records_async(input: InputDto) -> AsyncTask<CanonicalizeTask> {
    AsyncTask::new(CanonicalizeTask {
        input: Some(input.into()),
    })
}
```

`compute` receives only owned Rust data. Do not retain `JsObject`, `JsUnknown`, `Buffer`, typed-array views, references into JavaScript memory, or `Env` for off-thread use.

### wasm-bindgen Export

```rust
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = canonicalizeRecords)]
pub fn canonicalize_records(input: JsValue) -> Result<JsValue, JsValue> {
    let input: InputDto = serde_wasm_bindgen::from_value(input)
        .map_err(|error| to_js_error("INVALID_PARAMETER", &error.to_string()))?;

    let output = core::canonicalize(input)
        .map_err(core_error_to_js)?;

    let serializer = serde_wasm_bindgen::Serializer::json_compatible();
    output
        .serialize(&serializer)
        .map_err(|error| to_js_error("SERIALIZATION_FAILED", &error.to_string()))
}
```

A wasm-bindgen `Err(JsValue)` becomes a JavaScript exception or Promise rejection according to the exported function's synchronous or asynchronous ABI. Golden-test that behavior rather than assuming it.

### Stable Exported Enums

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum SearchMode {
    Exact,
    Semantic,
    Hybrid,
}
```

Use stable strings or explicit numeric codes. Never expose an enum's incidental Rust ordinal with an unchecked cast.

---

