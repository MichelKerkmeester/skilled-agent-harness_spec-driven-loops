---
title: Domain Modeling, Collections & Public API/ABI Contracts
description: Ownership, safety, interop, error handling, async patterns, Cargo baseline, and byte-for-byte TypeScript parity standards for Rust in the OpenCode development environment. — Domain Modeling, Collections & Public API/ABI Contracts.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Domain Modeling, Collections & Public API/ABI Contracts

## 4. DOMAIN AND STATE MODELING

### Newtypes for Parity-Sensitive Values

**[P1] Use private-field newtypes when primitive values carry distinct validation or parity semantics.**

Appropriate examples include:

- **[P1]** `SymbolId` for deterministic identifiers
- **[P1]** `SkillId` for validated identifiers
- **[P1]** `FiniteScore` for finite numeric values
- **[P1]** `Rank` where zero-based and one-based values must not mix
- **[P1]** `ErrorCode` for stable JavaScript error codes

```rust
#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
pub struct FiniteScore(f64);

#[derive(Debug, thiserror::Error)]
pub enum ScoreError {
    #[error("score must be finite")]
    NonFinite,
}

impl TryFrom<f64> for FiniteScore {
    type Error = ScoreError;

    fn try_from(value: f64) -> Result<Self, Self::Error> {
        if !value.is_finite() {
            return Err(ScoreError::NonFinite);
        }

        Ok(Self(value))
    }
}

impl FiniteScore {
    pub fn get(self) -> f64 {
        self.0
    }
}
```

- **[P0]** Reject non-finite values unless the boundary contract explicitly defines their encoding.
- **[P0]** Normalize or preserve `-0.0` according to the TypeScript oracle.
- **[P1]** Keep fields private so invalid values cannot be constructed directly.
- **[P1]** Serialize newtypes to the existing TypeScript primitive representation.
- **[P2]** Implement common traits only where their semantics are valid.

### State as Enums

**[P1] Model mutually exclusive states with enums rather than independent booleans.** This protects **domain-state validity and discriminant parity**.

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { endpoint: String },
    Failed { code: String, message: String },
}

pub fn connection_summary(state: &ConnectionState) -> String {
    match state {
        ConnectionState::Disconnected => "Not connected".to_owned(),
        ConnectionState::Connecting { attempt } => {
            format!("Connecting (attempt {attempt})")
        }
        ConnectionState::Connected { endpoint } => {
            format!("Connected to {endpoint}")
        }
        ConnectionState::Failed { code, message } => {
            format!("Error {code}: {message}")
        }
    }
}
```

- **[P0]** Export enums using stable string discriminants or explicit numeric codes.
- **[P0]** Never expose incidental Rust ordinal values as the JavaScript contract.
- **[P1]** Map every exported discriminant explicitly in adapters.
- **[P0]** Treat an unhandled adapter variant as a compile-time failure, not a wildcard fallback.
- **[P1]** Use `#[non_exhaustive]` only when wildcard evolution is intentional.
- **[P0]** Do not use `#[non_exhaustive]` to hide missing error or ABI mappings.

### Conversion Policies

| Conversion | Use | Severity |
|------------|-----|----------|
| `From<T>` | Infallible, lossless, value-preserving conversion | P1 |
| `TryFrom<T>` | Validation, narrowing, parsing, or normalization can fail | P1 |
| `AsRef<T>` | Cheap borrowed view | P2 |
| `IntoIterator` | Natural collection traversal without ABI exposure | P2 |
| `as` cast | Only a reviewed conversion proven not to narrow or alter semantics | P0 |
| Public builder | Avoid at JS/WASM boundary | P1 |

- **[P1]** Implement `From` or `TryFrom`, not `Into` or `TryInto`, directly.
- **[P0]** Do not use `as` for boundary narrowing.
- **[P1]** Use complete options DTOs at JavaScript boundaries.
- **[P2]** Use builders only for genuinely complex internal construction.
- **[P2]** Use type-state only when it prevents a real invalid transition.
- **[P0]** Keep builders and type-state representations out of the exported ABI.

---

## 5. STANDARD COLLECTION AND SERIALIZATION TYPES

### Collection Selection

**[P1] Prefer standard collections and make observable ordering explicit.**

| Requirement | Type | Severity | Notes |
|-------------|------|----------|-------|
| Sequence preserving explicit order | `Vec<T>` | P1 | Canonicalize before export |
| Canonical key order | `BTreeMap<K, V>` | P0 | Preferred for parity-visible maps |
| Canonical unique values | `BTreeSet<T>` | P0 | Ordered deduplication |
| Deterministic insertion order | `IndexMap<K, V>` | P1 | Use only when insertion order is contractual |
| Internal unordered lookup | `HashMap<K, V>` | P1 | Never leak iteration order |
| Internal unordered membership | `HashSet<T>` | P1 | Never leak iteration order |
| FIFO work queue | `VecDeque<T>` | P2 | Use when queue operations are material |

### Observable Hash Iteration

**[P0] `HashMap` and `HashSet` iteration must never influence output, serialization, hashing, deterministic IDs, traversal order, or ranking.** This protects **deterministic iteration and serialized-output parity**.

```rust
use std::collections::HashMap;

pub fn canonical_entries(
    values: &HashMap<String, u32>,
) -> Vec<(&str, u32)> {
    let mut entries: Vec<_> = values
        .iter()
        .map(|(key, value)| (key.as_str(), *value))
        .collect();

    entries.sort_by(|left, right| left.0.cmp(right.0));
    entries
}
```

- **[P0]** Do not rely on a deterministic hasher to make hash-table iteration contractual.
- **[P0]** Do not rely on input insertion order unless the contract explicitly defines it.
- **[P1]** Collect and sort unordered data before any observable operation.
- **[P1]** Prefer `BTreeMap` when canonical key order is always required.

### Serialization DTOs

**[P0] Boundary DTOs are passive, owned, and versioned.** Serialization must preserve the TypeScript contract for field names, field order, omission, nullability, escaping, encoding, and number spelling.

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResultDto {
    pub id: String,
    pub score: f64,
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub explanation: Option<String>,
}
```

- **[P0]** Verify that `skip_serializing_if` matches TypeScript omission behavior.
- **[P0]** Do not use `Option<T>` without testing missing, `null`, and present cases.
- **[P0]** Do not flatten structures unless the TypeScript schema already does so.
- **[P0]** Do not accept unknown fields silently when the established TypeScript validator rejects them.
- **[P1]** Use explicit serde attributes for JavaScript-visible names.
- **[P1]** Convert serialized DTOs to private core types before processing.

### Canonical Serialization

**[P0] Generic `serde_json::to_string` is not automatically a TypeScript-compatible serializer.** It may differ in key order, number spelling, escaping, or omission behavior. This protects **serialized-output parity**.

```rust
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum CanonicalJsonError {
    #[error("failed to serialize canonical output: {0}")]
    Serialize(#[from] serde_json::Error),
}

pub fn serialize_canonical<T>(
    value: &T,
) -> Result<Vec<u8>, CanonicalJsonError>
where
    T: Serialize,
{
    let text = serde_json::to_string(value)?;
    Ok(text.into_bytes())
}
```

The helper above is acceptable only after fixtures establish that its exact output matches the TypeScript oracle for the relevant DTO.

- **[P0]** Compare serialized bytes without normalization.
- **[P0]** Preserve UTF-8 encoding and newline policy.
- **[P0]** Preserve object-key order.
- **[P0]** Preserve JavaScript number spelling.
- **[P0]** Preserve escaping behavior.
- **[P0]** Do not use pretty printing unless whitespace is contractual.
- **[P1]** Centralize canonical serialization rather than configuring it ad hoc in adapters.

---

## 6. PUBLIC API AND ABI CONTRACTS

### Explicit Public Signatures

**[P1] Public Rust APIs require explicit parameter, return, and error types.** Public signatures are reviewable contracts and must not change accidentally through inference.

```rust
#[derive(Debug, Clone)]
pub struct RankRequest {
    pub query: String,
    pub candidates: Vec<CandidateDto>,
}

#[derive(Debug, Clone)]
pub struct CandidateDto {
    pub id: String,
    pub score: f64,
}

#[derive(Debug, Clone)]
pub struct RankedCandidateDto {
    pub id: String,
    pub score: f64,
    pub rank: u32,
}

pub fn rank_candidates(
    request: RankRequest,
) -> Result<Vec<RankedCandidateDto>, RankError> {
    rank_validated(request)
}
```

- **[P0]** Export owned DTOs only.
- **[P0]** Use fixed-width numbers at ABI boundaries.
- **[P0]** Preserve JavaScript-visible names and optionality.
- **[P0]** Preserve generated TypeScript declaration shapes.
- **[P1]** Keep exported functions narrow.
- **[P1]** Keep core-only types private to the core crate.
- **[P0]** Do not expose Rust implementation details such as lifetimes, iterators, trait objects, or generic builders.

### napi-rs Contract

**[P0] napi-rs adapters must translate DTOs and errors without duplicating core behavior.** This protects **native-addon and TypeScript parity**.

```rust
use napi_derive::napi;

#[napi(object)]
pub struct RankRequestJs {
    pub query: String,
    pub candidates: Vec<CandidateJs>,
}

#[napi(object)]
pub struct CandidateJs {
    pub id: String,
    pub score: f64,
}

#[napi(object)]
pub struct RankedCandidateJs {
    pub id: String,
    pub score: f64,
    pub rank: u32,
}

#[napi(js_name = "rankCandidates")]
pub fn rank_candidates_js(
    request: RankRequestJs,
) -> napi::Result<Vec<RankedCandidateJs>> {
    let core_request = request
        .try_into()
        .map_err(map_core_error)?;

    rank_candidates(core_request)
        .map(|results| results.into_iter().map(Into::into).collect())
        .map_err(map_core_error)
}
```

- **[P0]** The adapter must not implement scoring, rounding, sorting, hashing, or validation.
- **[P0]** Generated declaration names must match the existing TypeScript API.
- **[P0]** Native errors must match JavaScript `name`, `code`, `message`, and rejection behavior.
- **[P1]** Select and test the lowest supported Node-API level.
- **[P1]** Test the oldest claimed Node version.

### WASM Contract

**[P0] WASM exports must preserve the same DTO and output contract as native exports unless a distinct ABI is explicitly intended.**

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = rankCandidates)]
pub fn rank_candidates_wasm(input: JsValue) -> Result<JsValue, JsValue> {
    let request: RankRequestDto = serde_wasm_bindgen::from_value(input)
        .map_err(|error| boundary_error("E030", error.to_string()))?;

    let ranked = rank_candidates(request.try_into().map_err(map_wasm_error)?)
        .map_err(map_wasm_error)?;

    serde_wasm_bindgen::to_value(&ranked)
        .map_err(|error| boundary_error("E040", error.to_string()))
}
```

- **[P0]** Serializer configuration must be explicit and golden-tested.
- **[P0]** WASM traps must not replace established JavaScript errors.
- **[P0]** Promise behavior must match the TypeScript contract.
- **[P1]** Test the built WASM artifact through its real JavaScript loader.
- **[P0]** Do not claim WASM parity from core-only tests.

### Sidecar Contract

- **[P0]** Sidecar protocols must define framing, encoding, field order, newline behavior, exit codes, and stderr behavior.
- **[P0]** Platform-native path formatting must not leak into parity-visible output.
- **[P0]** Sidecar process failures must map to stable TypeScript errors.
- **[P1]** Use one transport-neutral core shared with native and WASM adapters.
- **[P1]** Test the packaged executable, not only a library call.

### Versioning and Packaging

- **[P0]** Treat DTO and generated declaration changes as ABI changes.
- **[P0]** Treat glibc and musl as separate release targets.
- **[P1]** Publish exact-version optional platform packages per OS, CPU, and libc target.
- **[P0]** Gate root-package publication on complete platform-package publication.
- **[P0]** Use one napi-rs packaging system; do not combine incompatible generated and independent loaders.
- **[P1]** Prefer napi-rs's generated WASI fallback when preserving the native Node-facing API.
- **[P0]** Treat native and WASI as independent release targets.
- **[P0]** Introduce `cxx` only for a concrete C++ dependency and prohibit cross-boundary unwinding.

---

