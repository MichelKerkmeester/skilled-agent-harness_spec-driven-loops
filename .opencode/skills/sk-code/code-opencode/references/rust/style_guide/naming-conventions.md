---
title: Naming Conventions
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment. — Naming Conventions.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Naming Conventions

## 5. NAMING CONVENTIONS

### Types and Traits

**Style**: `UpperCamelCase`

```rust
struct SearchResult {
    score: f64,
}

enum MemoryState {
    Active,
    Archived,
}

trait EmbeddingProvider {
    fn embed(&self, input: &str) -> Result<Vec<f32>, EmbedError>;
}

#[derive(Debug)]
struct EmbedError;
```

Treat acronyms as words:

```rust
struct UuidParser;
struct HttpClient;
struct WasmAdapter;
struct NapiErrorMapper;
```

Do not use `UUIDParser`, `HTTPClient`, or `WASMAdapter`.

### Functions, Methods, Variables, and Modules

**Style**: `snake_case`

```rust
mod score_normalization;

fn calculate_decay_score(age_seconds: u64) -> f64 {
    1.0 / (1.0 + age_seconds as f64)
}

let search_results = Vec::<String>::new();
let should_retry = false;
```

### Constants and Statics

**Style**: `SCREAMING_SNAKE_CASE`

```rust
const MAX_QUERY_LENGTH: usize = 10_000;
const SCORE_SCALE: f64 = 1_000_000.0;
static SUPPORTED_TARGETS: &[&str] = &["native", "wasm"];
```

A local immutable binding remains `snake_case`; not every `let` binding is a constant.

### Generic Parameters

Use short uppercase names for familiar generic roles and descriptive `UpperCamelCase` names when multiple parameters would otherwise be ambiguous.

```rust
fn identity<T>(value: T) -> T {
    value
}

fn transform<Input, Output, Error>(
    input: Input,
    operation: impl FnOnce(Input) -> Result<Output, Error>,
) -> Result<Output, Error> {
    operation(input)
}
```

### Getter Names

Omit `get_` for ordinary, side-effect-free accessors.

```rust
struct Candidate {
    id: String,
    score: f64,
}

impl Candidate {
    fn id(&self) -> &str {
        &self.id
    }

    fn score(&self) -> f64 {
        self.score
    }
}
```

Use a verb when the operation performs work, I/O, mutation, or validation:

```rust
fn load_config() -> Result<String, std::io::Error> {
    std::fs::read_to_string("config.json")
}

fn validate_score(value: f64) -> Result<f64, &'static str> {
    value.is_finite().then_some(value).ok_or("score must be finite")
}
```

### Conversion Method Prefixes

| Prefix | Meaning | Example |
|--------|---------|---------|
| `as_` | Cheap borrowed view | `as_str()` |
| `to_` | Work or allocation | `to_canonical_json()` |
| `into_` | Consumes `self` | `into_inner()` |

```rust
#[derive(Debug, Clone)]
struct SymbolId(String);

impl SymbolId {
    fn as_str(&self) -> &str {
        &self.0
    }

    fn to_lowercase_hex(&self) -> String {
        self.0.to_ascii_lowercase()
    }

    fn into_inner(self) -> String {
        self.0
    }
}
```

Do not name an allocating clone `as_bytes_owned`; use `to_bytes`. Do not name a borrowed view `to_str`; use `as_str`.

### Newtypes

Use private-field newtypes for validated or parity-sensitive primitives.

```rust
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct SymbolId(String);

impl SymbolId {
    #[must_use]
    pub fn as_str(&self) -> &str {
        &self.0
    }
}
```

Recommended newtypes include:

- `SymbolId` for deterministic identifiers
- `SkillId` for validated identifiers
- `FiniteScore` for finite values and centralized quantization
- `Rank` where zero-based and one-based semantics differ

Derive only traits whose semantics are correct for the domain. In particular, do not derive `Eq` or `Ord` for raw floating-point fields.

### Boolean Names

Rust predicates SHOULD read naturally:

```rust
let is_valid = true;
let has_results = !results.is_empty();
let can_retry = attempts < MAX_RETRIES;
let should_emit_metadata = options.include_metadata;
```

Predicate methods MAY omit `is_` when Rust convention is clearer:

```rust
fn empty(&self) -> bool {
    self.items.is_empty()
}
```

Prefer established standard-library vocabulary such as `is_empty`, `contains`, and `starts_with`.

### File and Module Names

**Style**: `snake_case` with `.rs`

```text
memory_search.rs
vector_index.rs
path_security.rs
embedding_provider.rs
```

Crate package names use `kebab-case` in `Cargo.toml`; the Rust crate identifier is automatically exposed with underscores.

```toml
[package]
name = "ranking-core"
```

```rust
use ranking_core::rank_candidates;
```

### JavaScript-Visible Names

Core Rust names remain idiomatic. Preserve established JavaScript `camelCase` names with adapter attributes.

```rust
use napi_derive::napi;

#[napi(js_name = "calculateDecayScore")]
pub fn calculate_decay_score(age_seconds: u32) -> f64 {
    1.0 / (1.0 + f64::from(age_seconds))
}
```

For wasm-bindgen:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = calculateDecayScore)]
pub fn calculate_decay_score(age_seconds: u32) -> f64 {
    1.0 / (1.0 + f64::from(age_seconds))
}
```

Do not contaminate core naming with JavaScript casing:

```rust
// Incorrect Rust API shape:
fn calculateDecayScore(_age_seconds: u32) -> f64 {
    0.0
}
```

### DTO Field Names

Boundary DTO fields and serialized keys MUST match the TypeScript contract exactly. Use rename attributes instead of non-idiomatic core fields.

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SearchOptionsDto {
    max_results: u32,
    include_metadata: bool,
}
```

Use explicit field renames when the contract is irregular:

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct ModelDto {
    #[serde(rename = "modelID")]
    model_id: String,
}
```

### Naming Summary Table

| Element | Convention | Example |
|---------|------------|---------|
| Structs | `UpperCamelCase` | `SearchResult` |
| Enums | `UpperCamelCase` | `MemoryState` |
| Enum variants | `UpperCamelCase` | `MemoryState::LongTerm` |
| Traits | `UpperCamelCase` | `EmbeddingProvider` |
| Type aliases | `UpperCamelCase` | `ScoreMap` |
| Generic parameters | Uppercase/`UpperCamelCase` | `T`, `Input` |
| Functions | `snake_case` | `load_config` |
| Methods | `snake_case` | `canonical_bytes` |
| Variables | `snake_case` | `search_results` |
| Modules | `snake_case` | `score_normalization` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Statics | `SCREAMING_SNAKE_CASE` | `SUPPORTED_TARGETS` |
| Files | `snake_case.rs` | `memory_search.rs` |
| Crate packages | `kebab-case` | `ranking-core` |
| JavaScript exports | Existing contract | `calculateDecayScore` |
| Serialized fields | Existing contract | `includeMetadata` |

---

