---
title: Rust Quick Reference
description: Copy-paste boundary templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode.
trigger_phrases:
  - "opencode rust quick reference"
  - "rust boundary module template"
  - "napi-rs wasm template"
  - "rust determinism recipes"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Quick Reference

Copy-paste templates, naming conventions, deterministic recipes, and Cargo commands for Rust development in OpenCode.

---

## 1. OVERVIEW

### Purpose

Quick-access reference card for Rust compute kernels and their JavaScript boundaries. For detailed explanations, see:

- [style_guide.md](./style_guide.md) - Full Rust style and interop documentation
- [quality_standards.md](./quality_standards.md) - Safety, parity, and verification requirements

Rust supplements the existing TypeScript/Node MCP backend. Keep MCP transport, public tool schemas, daemon and CLI wiring, feature flags, and fallback selection in TypeScript. Move only measured compute kernels behind narrow napi-rs, WASM/WASI, or sidecar adapters.

### Repository Non-Negotiables

| Rule | Required pattern | Contract protected |
|---|---|---|
| Thin boundaries | Pure Rust core plus transport-only adapters | DTO/ABI and JavaScript error-shape parity |
| Byte parity | Compare exact TypeScript and Rust output bytes | Serialized-output parity |
| Separate numeric helpers | Preserve each TypeScript rounding operation independently | Six-decimal score parity |
| Complete ordering | End every observable comparator with a deterministic unique key | Stable sort and tie-break parity |
| Exact IDs | Preserve preimage fields, order, delimiters, UTF-8, hash, encoding, and truncation | Deterministic-ID parity |
| Canonical collections | Use `BTreeMap`, `BTreeSet`, or explicit sorting before output | Deterministic hash and iteration order |
| No boundary panic | Map recoverable failures through typed `Result` values | Node process survival, WASM trap avoidance, and error-shape parity |
| Reviewed unsafe | Adjacent `// SAFETY:` invariant, safe wrapper, and tests | FFI memory safety and boundary integrity |

The release assertion is byte-oriented:

```rust
assert_eq!(
    typescript_oracle_bytes,
    rust_boundary_bytes,
    "semantic equality does not satisfy the parity contract",
);
```

---

## 2. COMPLETE RUST BOUNDARY MODULE TEMPLATE

Use a workspace with a pure core and separate napi-rs and wasm-bindgen adapters:

```text
Cargo.toml
Cargo.lock
crates/
  core/
    Cargo.toml
    src/lib.rs
  napi/
    Cargo.toml
    src/lib.rs
  wasm/
    Cargo.toml
    src/lib.rs
```

### Pure Core

```rust
// crates/core/src/lib.rs
#![forbid(unsafe_code)]

use std::cmp::Ordering;
use std::collections::BTreeSet;

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use thiserror::Error;

const SCORE_SCALE: f64 = 1_000_000.0;
const ID_HEX_LENGTH: usize = 24;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RankRequestDto {
    pub query: String,
    pub items: Vec<RankItemDto>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RankItemDto {
    pub source_id: String,
    pub text: String,
    pub score: f64,
}

#[derive(Debug, Clone)]
pub struct RankRequest {
    query: String,
    items: Vec<RankItem>,
}

#[derive(Debug, Clone)]
struct RankItem {
    id: String,
    text: String,
    score: FiniteScore,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RankedItem {
    pub id: String,
    pub text: String,
    pub score: f64,
    pub rank: u32,
}

#[derive(Debug, Clone, Copy)]
struct FiniteScore(f64);

impl FiniteScore {
    fn new(value: f64) -> Result<Self, CoreError> {
        if !value.is_finite() {
            return Err(CoreError::NonFiniteScore);
        }

        let quantized = quantize_like_math_round_six(value)?;
        let normalized = if quantized == 0.0 { 0.0 } else { quantized };
        Ok(Self(normalized))
    }

    fn get(self) -> f64 {
        self.0
    }
}

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("query must not be empty")]
    EmptyQuery,

    #[error("source ID must not be empty")]
    EmptySourceId,

    #[error("score must be finite")]
    NonFiniteScore,

    #[error("score cannot be scaled without overflow")]
    ScoreOverflow,

    #[error("duplicate deterministic ID: {0}")]
    DuplicateId(String),

    #[error("result count exceeds the u32 boundary")]
    ResultCountOverflow,
}

impl TryFrom<RankRequestDto> for RankRequest {
    type Error = CoreError;

    fn try_from(dto: RankRequestDto) -> Result<Self, Self::Error> {
        if dto.query.is_empty() {
            return Err(CoreError::EmptyQuery);
        }

        let items = dto
            .items
            .into_iter()
            .map(RankItem::try_from)
            .collect::<Result<Vec<_>, _>>()?;

        Ok(Self {
            query: dto.query,
            items,
        })
    }
}

impl TryFrom<RankItemDto> for RankItem {
    type Error = CoreError;

    fn try_from(dto: RankItemDto) -> Result<Self, Self::Error> {
        if dto.source_id.is_empty() {
            return Err(CoreError::EmptySourceId);
        }

        let id = deterministic_id(&dto.source_id, &dto.text);
        Ok(Self {
            id,
            text: dto.text,
            score: FiniteScore::new(dto.score)?,
        })
    }
}

/// Ranks owned input with a complete, deterministic comparator.
///
/// The comparator ends with a unique lowercase hexadecimal ID, protecting the
/// stable sort and tie-break parity contract.
///
/// # Errors
///
/// Returns [`CoreError`] when validation fails, IDs collide, or the result
/// count cannot be represented by the JavaScript boundary DTO.
pub fn rank_items(dto: RankRequestDto) -> Result<Vec<RankedItem>, CoreError> {
    let request = RankRequest::try_from(dto)?;
    let _query = request.query;

    let mut seen = BTreeSet::new();
    for item in &request.items {
        if !seen.insert(item.id.clone()) {
            return Err(CoreError::DuplicateId(item.id.clone()));
        }
    }

    let mut items = request.items;
    items.sort_by(compare_rank_items);

    items
        .into_iter()
        .enumerate()
        .map(|(index, item)| {
            let rank = u32::try_from(index)
                .map_err(|_| CoreError::ResultCountOverflow)?
                .checked_add(1)
                .ok_or(CoreError::ResultCountOverflow)?;

            Ok(RankedItem {
                id: item.id,
                text: item.text,
                score: item.score.get(),
                rank,
            })
        })
        .collect()
}

fn compare_rank_items(left: &RankItem, right: &RankItem) -> Ordering {
    right
        .score
        .get()
        .total_cmp(&left.score.get())
        .then_with(|| left.id.cmp(&right.id))
}

fn quantize_like_math_round_six(value: f64) -> Result<f64, CoreError> {
    if !value.is_finite() {
        return Err(CoreError::NonFiniteScore);
    }

    let scaled = value * SCORE_SCALE;
    if !scaled.is_finite() {
        return Err(CoreError::ScoreOverflow);
    }

    let floor = scaled.floor();
    let fraction = scaled - floor;
    let rounded = if fraction < 0.5 { floor } else { floor + 1.0 };
    let signed = if rounded == 0.0 && scaled.is_sign_negative() {
        -0.0
    } else {
        rounded
    };

    Ok(signed / SCORE_SCALE)
}

fn deterministic_id(source_id: &str, text: &str) -> String {
    let mut hasher = Sha256::new();

    // Field order and delimiters are part of the deterministic-ID parity contract.
    hasher.update(b"rank-item\0");
    hasher.update(source_id.as_bytes());
    hasher.update(b"\0");
    hasher.update(text.as_bytes());

    let digest = hasher.finalize();
    hex::encode(digest).chars().take(ID_HEX_LENGTH).collect()
}
```

### Thin napi-rs Adapter

```rust
// crates/napi/src/lib.rs
#![deny(unsafe_op_in_unsafe_fn)]

use napi::bindgen_prelude::AsyncTask;
use napi::{Env, Error, Result, Status, Task};
use napi_derive::napi;
use ranking_core::{
    rank_items as rank_core, CoreError, RankItemDto as CoreRankItemDto,
    RankRequestDto as CoreRankRequestDto, RankedItem as CoreRankedItem,
};

#[napi(object)]
pub struct RankItemDto {
    pub source_id: String,
    pub text: String,
    pub score: f64,
}

#[napi(object)]
pub struct RankRequestDto {
    pub query: String,
    pub items: Vec<RankItemDto>,
}

#[napi(object)]
pub struct RankedItemDto {
    pub id: String,
    pub text: String,
    pub score: f64,
    pub rank: u32,
}

impl From<RankRequestDto> for CoreRankRequestDto {
    fn from(dto: RankRequestDto) -> Self {
        Self {
            query: dto.query,
            items: dto
                .items
                .into_iter()
                .map(|item| CoreRankItemDto {
                    source_id: item.source_id,
                    text: item.text,
                    score: item.score,
                })
                .collect(),
        }
    }
}

impl From<CoreRankedItem> for RankedItemDto {
    fn from(item: CoreRankedItem) -> Self {
        Self {
            id: item.id,
            text: item.text,
            score: item.score,
            rank: item.rank,
        }
    }
}

fn to_napi_error(error: CoreError) -> Error {
    let (status, code) = match error {
        CoreError::EmptyQuery | CoreError::EmptySourceId => {
            (Status::InvalidArg, "INVALID_PARAMETER")
        }
        CoreError::NonFiniteScore | CoreError::ScoreOverflow => {
            (Status::InvalidArg, "INVALID_SCORE")
        }
        CoreError::DuplicateId(_) => (Status::GenericFailure, "DUPLICATE_ID"),
        CoreError::ResultCountOverflow => (Status::GenericFailure, "RESULT_OVERFLOW"),
    };

    Error::new(status, format!("{code}: {error}"))
}

fn execute(input: RankRequestDto) -> Result<Vec<RankedItemDto>> {
    rank_core(input.into())
        .map(|items| items.into_iter().map(RankedItemDto::from).collect())
        .map_err(to_napi_error)
}

#[napi(js_name = "rankItems")]
pub fn rank_items(input: RankRequestDto) -> Result<Vec<RankedItemDto>> {
    execute(input)
}

pub struct RankTask {
    input: Option<RankRequestDto>,
}

impl Task for RankTask {
    type Output = Vec<CoreRankedItem>;
    type JsValue = Vec<RankedItemDto>;

    fn compute(&mut self) -> Result<Self::Output> {
        let input = self.input.take().ok_or_else(|| {
            Error::new(Status::GenericFailure, "INTERNAL_STATE: task input missing")
        })?;

        rank_core(input.into()).map_err(to_napi_error)
    }

    fn resolve(&mut self, _env: Env, output: Self::Output) -> Result<Self::JsValue> {
        Ok(output.into_iter().map(RankedItemDto::from).collect())
    }
}

#[napi(js_name = "rankItemsAsync")]
pub fn rank_items_async(input: RankRequestDto) -> AsyncTask<RankTask> {
    // Only owned Rust data enters the worker; no Env or JavaScript handle crosses threads.
    AsyncTask::new(RankTask { input: Some(input) })
}
```

The synchronous export returns `napi::Result<T>`. Use `AsyncTask` only for measured CPU or blocking work that would materially block Node. Convert JavaScript values into owned Rust DTOs before `compute`; JavaScript handles and `Env` remain on the JavaScript thread.

### Thin wasm-bindgen Adapter

```rust
// crates/wasm/src/lib.rs
#![deny(unsafe_op_in_unsafe_fn)]

use js_sys::{Error as JsError, Reflect};
use ranking_core::{rank_items as rank_core, CoreError, RankRequestDto};
use serde::Serialize;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = rankItems)]
pub fn rank_items(input: JsValue) -> Result<JsValue, JsValue> {
    let request: RankRequestDto = serde_wasm_bindgen::from_value(input)
        .map_err(|error| js_error("INVALID_PARAMETER", &error.to_string()))?;

    let output = rank_core(request)
        .map_err(core_error_to_js)?;

    let serializer = serde_wasm_bindgen::Serializer::json_compatible();
    output
        .serialize(&serializer)
        .map_err(|error| js_error("SERIALIZATION_FAILED", &error.to_string()))
}

fn core_error_to_js(error: CoreError) -> JsValue {
    let code = match error {
        CoreError::EmptyQuery | CoreError::EmptySourceId => "INVALID_PARAMETER",
        CoreError::NonFiniteScore | CoreError::ScoreOverflow => "INVALID_SCORE",
        CoreError::DuplicateId(_) => "DUPLICATE_ID",
        CoreError::ResultCountOverflow => "RESULT_OVERFLOW",
    };

    js_error(code, &error.to_string())
}

fn js_error(code: &str, message: &str) -> JsValue {
    let error = JsError::new(message);

    // A newly created Error is extensible; setting code preserves the JS error-shape contract.
    let _set_result = Reflect::set(
        error.as_ref(),
        &JsValue::from_str("code"),
        &JsValue::from_str(code),
    );

    error.into()
}
```

Keep serializer configuration explicit. `Serializer::json_compatible()` produces JavaScript-compatible values, but exact field order, omission behavior, integer representation, and number spelling still require golden tests against the TypeScript oracle.

---

## 3. NAMING CHEAT SHEET

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

## 4. SECTION ORDERING

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

## 5. BOUNDARY TYPE AND SIGNATURE PATTERNS

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

## 9. RUSTDOC TEMPLATE

```rust
/// Canonicalizes records for JavaScript serialization.
///
/// Output keys are ordered lexically and scores use the operation-specific
/// six-decimal quantizer. These rules protect serialized-output and numeric
/// parity with the TypeScript oracle.
///
/// # Errors
///
/// Returns [`CoreError::NonFiniteScore`] when a score is `NaN` or infinite.
/// Returns [`CoreError::DuplicateId`] when deterministic IDs collide.
///
/// # Panics
///
/// This function does not panic for validated boundary input.
///
/// # Examples
///
/// ```
/// use ranking_core::{canonicalize, CanonicalizeRequestDto};
///
/// # fn run() -> Result<(), ranking_core::CoreError> {
/// let request = CanonicalizeRequestDto {
///     records: Vec::new(),
/// };
/// let output = canonicalize(request)?;
/// assert!(output.records.is_empty());
/// # Ok(())
/// # }
/// # run()?;
/// # Ok::<(), ranking_core::CoreError>(())
/// ```
pub fn canonicalize(
    request: CanonicalizeRequestDto,
) -> Result<CanonicalizeOutputDto, CoreError> {
    // ...
}
```

For unsafe APIs, also document the caller obligations:

```rust
/// Copies `length` initialized bytes from `pointer`.
///
/// # Safety
///
/// `pointer` must be non-null and valid for reads of `length` initialized
/// bytes. The region must remain alive and immutable for the duration of the
/// call, and `length` must not exceed `isize::MAX`.
pub unsafe fn copy_foreign_bytes(
    pointer: *const u8,
    length: usize,
) -> Result<Vec<u8>, BoundaryError> {
    // ...
}
```

Public boundary documentation states:

- Ownership and copy behavior
- Stable JavaScript error code and shape
- Synchronous throw versus Promise rejection behavior
- Comparator chain or deterministic-ID preimage where observable
- Serialization and map ordering
- The parity or interop contract protected

---

## 10. CARGO AND BUILD QUICK REFERENCE

### Workspace Baseline

```toml
# Cargo.toml
[workspace]
resolver = "3"
members = ["crates/core", "crates/napi", "crates/wasm"]

[workspace.package]
edition = "2024"
rust-version = "1.85"
license = "MIT"

[workspace.lints.rust]
unsafe_op_in_unsafe_fn = "deny"

[workspace.lints.clippy]
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"

[profile.release]
overflow-checks = true
lto = "thin"
codegen-units = 1
```

Each member opts into workspace policy:

```toml
[package]
name = "ranking-core"
version = "0.1.0"
edition.workspace = true
rust-version.workspace = true
license.workspace = true

[lints]
workspace = true
```

### rustfmt Baseline

```toml
# rustfmt.toml
edition = "2024"
style_edition = "2024"
max_width = 100
newline_style = "Unix"
```

### Complete Gate Sequence

```bash
cargo fmt --all -- --check
cargo check --workspace --all-targets --locked
cargo clippy --workspace --all-targets --locked -- -D warnings
cargo test --workspace --locked
RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked
cargo build --workspace --release --locked
cargo deny check
cargo audit
```

Run the complete sequence before claiming the Rust workspace is verified.

### Advisory Clippy Review

```bash
cargo clippy --workspace --all-targets --locked -- \
  -W clippy::pedantic \
  -W clippy::nursery
```

Pedantic and nursery findings are advisory. Promote stable, relevant individual lints instead of denying either group wholesale.

### Core and Native Targets

```bash
# Pure core
cargo test -p ranking-core --locked

# Host native addon
cargo build -p ranking-napi --release --locked

# Explicit native target
cargo build -p ranking-napi \
  --release \
  --locked \
  --target aarch64-apple-darwin
```

Use the lowest proven Node-API level supporting the required APIs. Test the oldest declared Node version and every published OS, CPU, and libc package.

### wasm-bindgen Target

```bash
rustup target add wasm32-unknown-unknown

cargo build -p ranking-wasm \
  --release \
  --locked \
  --target wasm32-unknown-unknown

wasm-bindgen \
  --target nodejs \
  --out-dir dist/wasm \
  target/wasm32-unknown-unknown/release/ranking_wasm.wasm
```

Use this target only for an intentionally distinct wasm-bindgen ABI.

### napi-rs WASI Target

```bash
rustup target add wasm32-wasip1-threads

cargo build -p ranking-napi \
  --release \
  --locked \
  --target wasm32-wasip1-threads
```

Prefer napi-rs's generated WASI fallback when native and WASI must preserve the same Node-facing addon API.

### Feature Isolation

```bash
cargo check -p ranking-core --no-default-features --locked
cargo check -p ranking-napi --no-default-features --features native-addon --locked
cargo check -p ranking-wasm --no-default-features --features wasm --locked
```

### Supply-Chain Gates

```bash
cargo deny check
cargo audit
cargo vet --locked
```

`cargo deny` and `cargo audit` are blocking when configured. Record `cargo vet` status while policy is advisory, then make it blocking after criteria, imports, and exceptions are committed.

---

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

- [style_guide.md](./style_guide.md) - Detailed formatting, naming, module, and interop rules
- [quality_standards.md](./quality_standards.md) - Safety, boundary, determinism, and verification requirements
