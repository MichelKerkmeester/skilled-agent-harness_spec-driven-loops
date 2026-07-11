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

- [style_guide.md](../style_guide/overview-and-file-header.md) - Full Rust style and interop documentation
- [quality_standards.md](../quality_standards/overview-and-data-ownership.md) - Safety, parity, and verification requirements

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

