---
title: Rust Style Guide
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment.
trigger_phrases:
  - "opencode rust style guide"
  - "rust file header format"
  - "rust formatting standards"
  - "rust typescript interop style"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Style Guide

Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Defines consistent styling rules for Rust used as napi-rs, WASM/WASI, or sidecar compute modules alongside the existing TypeScript/Node MCP backend.

The primary requirement is not merely idiomatic Rust. Rust implementations MUST preserve the observable TypeScript contract byte for byte, including six-decimal numeric behavior, stable comparator chains, deterministic identifiers, key order, serialized number spelling, DTO shapes, and JavaScript error behavior.

### When to Use

- Writing new Rust files under an OpenCode workspace
- Extracting measured compute kernels from TypeScript
- Implementing napi-rs, WASM/WASI, or sidecar adapters
- Reviewing Rust naming, formatting, ownership, or module organization
- Maintaining byte-for-byte parity with a TypeScript oracle
- Defining Rust DTOs consumed by JavaScript or TypeScript

### Repository Non-Negotiables

1. **The interop boundary is a stability contract.**
   - Exported names, DTO fields, optionality, discriminants, numeric representations, buffer ownership, generated declarations, error codes, messages, and throw-versus-rejection behavior are versioned contracts.
   - Contract protected: **DTO/ABI and JavaScript error-shape parity**.
   - Keep MCP transport, public tool schemas, daemon wiring, feature flags, and fallback selection in TypeScript.
   - Keep napi-rs, wasm-bindgen, Node handles, and runtime values out of the pure core.

2. **Determinism means byte-for-byte TypeScript parity.**
   - The release assertion is equivalent to comparing the bytes emitted by the TypeScript oracle and Rust boundary.
   - Preserve numeric operations independently. TypeScript `toFixed(6)`, scaled `Math.round`, and fixed-six textual formatting are not interchangeable.
   - Preserve comparator chains, terminal tie-breaks, identifier preimages, UTF-8 encoding, delimiters, hash algorithms, lowercase hexadecimal output, truncation, key order, omission behavior, and serialized number spelling.
   - Contracts protected: **six-decimal score parity, stable sort parity, deterministic-ID parity, deterministic iteration order, and serialized-output parity**.

3. **No `unsafe` without a documented invariant and tests.**
   - Pure-core crates use `#![forbid(unsafe_code)]`.
   - Boundary crates use `#![deny(unsafe_op_in_unsafe_fn)]`.
   - Every permitted unsafe block requires an adjacent `// SAFETY:` explanation and tests that exercise both valid inputs and challenged preconditions.
   - Contract protected: **FFI memory safety and boundary integrity**.

4. **Panics are not boundary errors.**
   - JavaScript-controlled input must not reach `unwrap`, `expect`, unchecked indexing, explicit `panic!`, or assertion-dependent validation.
   - Recoverable failures use typed `Result` values and exhaustive adapter mappings.
   - Contract protected: **Node process survival, WASM trap avoidance, and JavaScript error-shape parity**.

---

## 2. FILE HEADER FORMAT

All Rust source files MUST begin with a module header block identifying the module.

Crate roots add crate-level safety and documentation attributes before the module header. Ordinary module files begin directly with the header.

### Module Template

```rust
// ───────────────────────────────────────────────────────────────────
// MODULE: [Module Name]
// ───────────────────────────────────────────────────────────────────
```

### Pure-Core Crate Root Template

```rust
#![forbid(unsafe_code)]

// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Ranking Core
// ───────────────────────────────────────────────────────────────────
```

### Boundary Crate Root Template

```rust
#![deny(unsafe_op_in_unsafe_fn)]

// ───────────────────────────────────────────────────────────────────
// MODULE: Node.js Ranking Adapter
// ───────────────────────────────────────────────────────────────────
```

### Requirements

- Box width: 67 characters total
- Module name: Left-aligned within the header
- Pure core: `#![forbid(unsafe_code)]` at the crate root
- FFI or runtime adapter: `#![deny(unsafe_op_in_unsafe_fn)]` at the crate root
- Crate attributes: Before the module header
- Module documentation: After the module header and before imports
- Imports: After module documentation
- No generated timestamp, packet identifier, ticket identifier, or transient ownership marker
- No copied TypeScript file path unless it is part of a durable compatibility contract

**Rationale**: The crate-level attribute states the safety policy enforced by the compiler. The module header makes mixed TypeScript/Rust workspaces easier to navigate without embedding transient project-management data.

### Full Header Example

```rust
#![forbid(unsafe_code)]

// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Ranking Core
// ───────────────────────────────────────────────────────────────────

//! Computes canonical ranking output compatible with the TypeScript oracle.
//!
//! Sorting and numeric normalization in this crate protect byte-for-byte
//! parity across native and WASM targets.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

use std::cmp::Ordering;

use serde::{Deserialize, Serialize};

use crate::error::CoreError;
use crate::ids::SymbolId;
```

### Binary Entry Point Template

Sidecar binaries MAY permit `anyhow` at the outermost application shell. Domain and parity-sensitive operations remain typed in the core.

```rust
// ───────────────────────────────────────────────────────────────────
// MODULE: Ranking Sidecar
// ───────────────────────────────────────────────────────────────────

use anyhow::Context;

use ranking_core::run_request;

fn main() -> anyhow::Result<()> {
    let input = std::fs::read_to_string("/dev/stdin")
        .context("failed to read sidecar request")?;

    let output = run_request(&input)
        .context("failed to execute ranking request")?;

    println!("{output}");
    Ok(())
}
```

`anyhow` is acceptable here because `main` is the outer application shell. It is not acceptable in the public API of `ranking_core`.

---

## 3. EDITION, TOOLCHAIN, AND COMPILATION BASELINE

### Workspace Configuration Is Authoritative

Rust crates MUST inherit the edition, minimum supported Rust version, dependency versions, lint policy, and release policy from the workspace root where Cargo supports inheritance.

```toml
# Cargo.toml
[workspace]
resolver = "2"
members = [
  "crates/core",
  "crates/napi",
  "crates/wasm",
]

[workspace.package]
edition = "2024"
rust-version = "1.85"
license = "MIT"

[workspace.dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
thiserror = "2"

[workspace.lints.rust]
unsafe_code = "deny"

[workspace.lints.clippy]
all = "warn"
pedantic = "warn"
```

Member crates inherit the shared policy:

```toml
# crates/core/Cargo.toml
[package]
name = "ranking-core"
version = "0.1.0"
edition.workspace = true
rust-version.workspace = true
license.workspace = true

[dependencies]
serde.workspace = true
serde_json.workspace = true
thiserror.workspace = true

[lints]
workspace = true
```

### Edition Rules

- Use the edition selected by the owning workspace.
- Do not set a different edition in an individual member without a documented compatibility requirement.
- Do not rely on implicit edition behavior when generated bindings, macros, or build tooling require a specific edition.
- Keep edition upgrades workspace-wide so native, WASM, sidecar, tests, and examples compile under one language baseline.

### Minimum Supported Rust Version

The workspace `rust-version` is a compilation contract.

- Do not use syntax or standard-library APIs newer than the declared version.
- Do not raise `rust-version` in one crate only.
- Verify the declared minimum version in CI, not only the latest stable toolchain.
- Pin toolchain components when reproducibility requires a checked-in `rust-toolchain.toml`.

```toml
# rust-toolchain.toml
[toolchain]
channel = "1.85.0"
components = ["clippy", "rustfmt"]
profile = "minimal"
targets = ["wasm32-unknown-unknown"]
```

The exact channel and targets must match the repository's active workspace policy. Do not copy this example without reconciling it with the owning `Cargo.toml`.

### Compilation Baseline

All Rust work MUST pass the workspace-equivalent of:

```bash
cargo fmt --all --check
cargo check --workspace --all-targets
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace
```

Target-specific crates also require their target build:

```bash
cargo check -p ranking-wasm --target wasm32-unknown-unknown
cargo build -p ranking-napi --release
```

### Feature Rules

Separate native and WASM integrations so unsupported combinations are not accidentally compiled together.

```toml
[features]
default = []
native = ["dep:napi", "dep:napi-derive"]
wasm = ["dep:wasm-bindgen"]

[dependencies]
napi = { version = "3", optional = true }
napi-derive = { version = "3", optional = true }
wasm-bindgen = { version = "0.2", optional = true }
```

Do not place mutually incompatible adapter dependencies in the pure core. Prefer separate adapter crates over a dense matrix of target-specific conditionals.

### Release Semantics

Do not depend on debug-only overflow checks, assertion behavior, or profile-specific floating-point transformations.

```rust
pub fn checked_increment(value: u32) -> Result<u32, &'static str> {
    value.checked_add(1).ok_or("counter overflow")
}
```

Explicit checked behavior protects parity across development, release, native, and WASM builds.

---

## 4. SECTION ORGANIZATION

Large Rust files use numbered section dividers. Small modules do not need dividers when ordinary Rust structure is clearer.

### Section Divider Template

```rust
// ───────────────────────────────────────────────────────────────────
// 1. [SECTION NAME]
// ───────────────────────────────────────────────────────────────────
```

Use one divider format consistently within a file. Rust source uses line-comment dividers; do not alternate between line and block dividers.

### Standard Source Order

| Order | Section Name | Purpose |
|-------|--------------|---------|
| 1 | IMPORTS | Standard-library, third-party, and crate imports |
| 2 | CONSTANTS | Stable configuration and numeric constants |
| 3 | TYPES | Structs, enums, traits, and newtypes |
| 4 | CONVERSIONS | `From` and `TryFrom` implementations |
| 5 | HELPERS | Private utility functions |
| 6 | CORE LOGIC | Public and private implementation |
| 7 | TESTS | Unit tests in `#[cfg(test)] mod tests` |

Number sections from the first divider actually present. The module header does not count.

### Complete Organization Example

```rust
#![forbid(unsafe_code)]

// ───────────────────────────────────────────────────────────────────
// MODULE: Score Normalization
// ───────────────────────────────────────────────────────────────────

use std::cmp::Ordering;

use thiserror::Error;

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCORE_SCALE: f64 = 1_000_000.0;

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct FiniteScore(f64);

#[derive(Debug, Error, PartialEq)]
pub enum ScoreError {
    #[error("score must be finite")]
    NonFinite,
}

// ───────────────────────────────────────────────────────────────────
// 3. CONVERSIONS
// ───────────────────────────────────────────────────────────────────

impl TryFrom<f64> for FiniteScore {
    type Error = ScoreError;

    fn try_from(value: f64) -> Result<Self, Self::Error> {
        if value.is_finite() {
            Ok(Self(value))
        } else {
            Err(ScoreError::NonFinite)
        }
    }
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

impl FiniteScore {
    #[must_use]
    pub fn value(self) -> f64 {
        self.0
    }

    #[must_use]
    pub fn scaled_round(self) -> f64 {
        (self.0 * SCORE_SCALE).round() / SCORE_SCALE
    }

    #[must_use]
    pub fn total_cmp(self, other: Self) -> Ordering {
        self.0.total_cmp(&other.0)
    }
}

// ───────────────────────────────────────────────────────────────────
// 5. TESTS
// ───────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::FiniteScore;

    #[test]
    fn rejects_non_finite_scores() {
        assert!(FiniteScore::try_from(f64::NAN).is_err());
    }
}
```

### Module and Workspace Layout

Use a pure core with thin runtime adapters:

```text
Cargo.toml
Cargo.lock
rust-toolchain.toml
crates/
  core/
    Cargo.toml
    src/
      lib.rs
      dto.rs
      error.rs
      ids.rs
      ranking.rs
  napi/
    Cargo.toml
    src/
      lib.rs
  wasm/
    Cargo.toml
    src/
      lib.rs
  sidecar/
    Cargo.toml
    src/
      main.rs
```

### Module Responsibilities

- `core` owns algorithms, validation, normalization, numeric parity, sorting, hashing, deterministic IDs, and transport-neutral domain types.
- `napi` owns Node conversion, generated TypeScript declarations, JavaScript error mapping, and thread-affinity rules.
- `wasm` owns JavaScript/WASM conversion, trap avoidance, and WASM-specific exports.
- `sidecar` owns framing, process I/O, and outer-shell diagnostics.
- Adapters MUST NOT duplicate scoring, sorting, hashing, rounding, identifier generation, or business validation.
- Use one workspace lockfile.
- Keep native and WASM dependencies out of the core dependency graph.

### Module Visibility

Default to private modules and private fields. Export the smallest stable API required by adapters.

```rust
mod ids;
mod ranking;

pub use ids::SymbolId;
pub use ranking::{rank_candidates, Candidate, RankedCandidate};
```

Avoid broad `pub mod` declarations when callers need only selected types or functions.

---

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

## 8. COMMENTING AND RUSTDOC RULES

### Comment Principles

1. Explain durable constraints, invariants, and tradeoffs.
2. Explain WHY the code differs from an obvious alternative.
3. Name the parity, ownership, safety, or error contract protected.
4. Do not restate syntax or mechanics.
5. Do not keep commented-out code.
6. Do not embed transient packet, task, checklist, ADR, ticket, or spec-folder identifiers.
7. Keep comments accurate when behavior changes.

### Comment Examples

```rust
// The identifier is the terminal key so equal scores never inherit input order.
candidates.sort_by(compare_candidates);

// Normalize negative zero because the JavaScript wire contract emits positive zero.
let score = if score == 0.0 { 0.0 } else { score };

// Copy before scheduling because JavaScript retains ownership of the source buffer.
let owned_input = input.to_vec();
```

Avoid comments that narrate mechanics:

```rust
// Sort the candidates.
candidates.sort_by(compare_candidates);

// Convert the input into a vector.
let owned_input = input.to_vec();
```

### Capitalization

Comment prose starts with a capital letter and ends with punctuation when it is a complete sentence.

Exceptions include:

- `rustfmt` directives
- `clippy` lint names
- Code identifiers at the beginning of a fragment
- Standard tags such as `TODO`, when the repository permits them
- `// SAFETY:` invariants

### `// SAFETY:` Comments

Every allowed unsafe block requires an adjacent `// SAFETY:` comment describing all relevant assumptions:

- Pointer validity
- Length and alignment
- Initialization
- Aliasing
- Lifetime
- Ownership
- Cleanup responsibility
- Thread affinity

```rust
fn copy_bytes(pointer: *const u8, length: usize) -> Vec<u8> {
    assert!(!pointer.is_null() || length == 0);

    // SAFETY: A non-null pointer is required for non-empty input, the caller
    // guarantees `length` initialized bytes, and the bytes are copied before
    // this function returns, so no borrowed view escapes.
    let bytes = unsafe { std::slice::from_raw_parts(pointer, length) };

    bytes.to_vec()
}
```

This pattern belongs only in a reviewed boundary crate. The pure core uses `#![forbid(unsafe_code)]`.

An unsafe block also requires:

- A test exercising the valid path
- A test challenging enforceable preconditions
- Boundary documentation stating ownership and lifetime
- Review of cleanup and thread-affinity behavior

### Rustdoc Scope

Document all public boundary types and operations. Document private items when their invariants are not obvious from types and names.

Use:

- `//!` for crate and module documentation
- `///` for item documentation
- Markdown headings for contract sections
- Compilable examples
- Intra-doc links where practical

### Public Operation Template

```rust
/// Parses and validates a stable symbol identifier.
///
/// The identifier is normalized once and then used as part of the
/// deterministic hash preimage.
///
/// # Errors
///
/// Returns [`SymbolIdError`] when `value` is empty or contains an unsupported
/// character.
///
/// # Examples
///
/// ```
/// # use std::error::Error;
/// #
/// # fn main() -> Result<(), Box<dyn Error>> {
/// let id = SymbolId::try_from("memory.search")?;
/// assert_eq!(id.as_str(), "memory.search");
/// # Ok(())
/// # }
/// #
/// # #[derive(Debug)]
/// # struct SymbolId(String);
/// #
/// # impl SymbolId {
/// #     fn as_str(&self) -> &str {
/// #         &self.0
/// #     }
/// # }
/// #
/// # #[derive(Debug)]
/// # struct SymbolIdError;
/// #
/// # impl std::fmt::Display for SymbolIdError {
/// #     fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
/// #         formatter.write_str("invalid symbol identifier")
/// #     }
/// # }
/// #
/// # impl Error for SymbolIdError {}
/// #
/// # impl TryFrom<&str> for SymbolId {
/// #     type Error = SymbolIdError;
/// #
/// #     fn try_from(value: &str) -> Result<Self, Self::Error> {
/// #         if value.is_empty() {
/// #             Err(SymbolIdError)
/// #         } else {
/// #             Ok(Self(value.to_owned()))
/// #         }
/// #     }
/// # }
/// ```
pub fn parse_symbol_id(value: &str) -> Result<SymbolId, SymbolIdError> {
    SymbolId::try_from(value)
}

#[derive(Debug)]
pub struct SymbolId(String);

impl SymbolId {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

#[derive(Debug)]
pub struct SymbolIdError;

impl std::fmt::Display for SymbolIdError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str("invalid symbol identifier")
    }
}

impl std::error::Error for SymbolIdError {}

impl TryFrom<&str> for SymbolId {
    type Error = SymbolIdError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        if value.is_empty() {
            Err(SymbolIdError)
        } else {
            Ok(Self(value.to_owned()))
        }
    }
}
```

Examples for fallible operations use `?`, not `unwrap` or `expect`.

### Required Rustdoc Sections

Use exact standard headings where applicable:

- `# Errors` for fallible public operations
- `# Panics` when a public operation can panic
- `# Safety` for every `unsafe fn`
- `# Examples` for public operations and non-obvious public types

Do not add `# Panics` merely to say a function never panics. Prefer an API whose signature and implementation avoid panic paths.

### Boundary Documentation

Every exported napi-rs, WASM, WASI, or sidecar operation documents:

- Input ownership and copy behavior
- Output ownership
- JavaScript error code and shape
- Synchronous throw versus Promise rejection
- Numeric normalization behavior
- Complete comparator or hash preimage when relevant
- Serialization and key order when observable
- The parity or interop contract protected

Example:

```rust
/// Ranks candidates using the canonical TypeScript comparator.
///
/// Input strings and candidate records are copied before native worker
/// execution. Invalid input rejects the returned Promise with code
/// `INVALID_INPUT`. Equal scores are ordered by identifier and then source
/// index, protecting stable sort and serialized-output parity.
```

### Lint Suppressions

Lint suppressions require a durable reason and the narrowest possible scope.

```rust
#[allow(clippy::cast_precision_loss)]
fn age_as_score_input(age_seconds: u32) -> f64 {
    // Every u32 value is exactly representable in an f64 mantissa.
    f64::from(age_seconds)
}
```

Do not add crate-wide `allow` attributes to silence ordinary quality findings.

---

## 9. RUST/TYPESCRIPT INTEROP AND COEXISTENCE

Rust supplements the existing TypeScript/Node backend. It does not replace transport ownership or redefine public MCP behavior.

### Responsibility Split

| TypeScript/Node Owns | Rust Owns |
|----------------------|-----------|
| MCP transport and tool schemas | Measured compute kernels |
| Daemon and CLI wiring | Validation internal to a kernel |
| Feature flags and fallback selection | Deterministic ranking and hashing |
| Public request routing | Canonical numeric operations |
| Compatibility orchestration | Transport-neutral domain types |
| JavaScript fallback behavior | Narrow napi-rs/WASM/sidecar adapters |

Move code into Rust only when measurement justifies the added boundary and build complexity.

### Pure Core and Thin Adapters

The core API accepts transport-neutral, owned inputs and returns transport-neutral, owned outputs.

```rust
#![forbid(unsafe_code)]

use thiserror::Error;

#[derive(Debug, Clone)]
pub struct Candidate {
    pub id: String,
    pub score: f64,
}

#[derive(Debug, Clone)]
pub struct RankedCandidate {
    pub id: String,
    pub score: f64,
}

#[derive(Debug, Error)]
pub enum CoreError {
    #[error("candidate identifier must not be empty")]
    EmptyIdentifier,

    #[error("candidate score must be finite")]
    NonFiniteScore,
}

pub fn rank_candidates(
    candidates: Vec<Candidate>,
) -> Result<Vec<RankedCandidate>, CoreError> {
    let mut ranked = candidates
        .into_iter()
        .map(|candidate| {
            if candidate.id.is_empty() {
                return Err(CoreError::EmptyIdentifier);
            }

            if !candidate.score.is_finite() {
                return Err(CoreError::NonFiniteScore);
            }

            Ok(RankedCandidate {
                id: candidate.id,
                score: candidate.score,
            })
        })
        .collect::<Result<Vec<_>, _>>()?;

    ranked.sort_by(|left, right| {
        right
            .score
            .total_cmp(&left.score)
            .then_with(|| left.id.cmp(&right.id))
    });

    Ok(ranked)
}
```

The adapter performs DTO conversion and stable error mapping, not ranking logic.

### Owned Versus Borrowed Boundary Types

Export owned, materialized values:

- `String`
- `Vec<T>`
- Fixed-width integers such as `u32`, `i64`, and `u64`
- `f64` only with explicit finite-value and numeric-parity handling
- `bool`
- Passive boundary structs
- `Result<OwnedOutput, BoundaryError>`

Do not export:

- `&str`
- `&[T]`
- `Cow<'a, T>`
- Public lifetime parameters
- Iterators
- Internal graph references
- Core builders
- Type-state objects
- `usize` or `isize`

Borrow inside the core:

```rust
fn canonical_identifier(namespace: &str, name: &str) -> String {
    format!("{namespace}:{name}")
}
```

Materialize at the boundary:

```rust
#[derive(Debug)]
struct IdentifierRequest {
    namespace: String,
    name: String,
}

fn handle_identifier(request: IdentifierRequest) -> String {
    canonical_identifier(&request.namespace, &request.name)
}
```

### Buffer Ownership

JavaScript-owned memory MUST be copied before asynchronous or cross-thread work unless a reviewed ownership protocol proves exclusive access for the full operation.

```rust
fn prepare_async_input(input: &[u8]) -> Vec<u8> {
    // The worker receives owned bytes because JavaScript may mutate or release
    // the source buffer after this synchronous boundary call returns.
    input.to_vec()
}
```

Zero-copy napi-rs or WASM views are synchronous optimization exceptions. They require:

- Benchmark evidence
- Explicit lifetime and mutation rules
- Thread-affinity documentation
- Safety review
- Tests that challenge ownership assumptions

### Fixed-Width Integers

Use fixed-width integers at every JavaScript-visible boundary.

```rust
#[derive(Debug)]
struct PaginationDto {
    offset: u32,
    limit: u32,
}
```

Never expose `usize` or `isize`; their width varies by target.

Integers outside JavaScript's safe range require an explicitly versioned representation:

```rust
#[derive(Debug)]
struct LargeCounterDto {
    decimal_value: String,
}
```

Use JavaScript `BigInt` only when both the binding technology and TypeScript contract explicitly require it.

### DTO Validation

Boundary DTOs are passive and versioned. Convert them immediately into validated private-field core types.

```rust
use thiserror::Error;

#[derive(Debug)]
struct SearchOptionsDto {
    limit: u32,
    minimum_score: f64,
}

#[derive(Debug)]
struct SearchOptions {
    limit: u32,
    minimum_score: FiniteScore,
}

#[derive(Debug, Clone, Copy)]
struct FiniteScore(f64);

#[derive(Debug, Error)]
enum OptionsError {
    #[error("limit must be greater than zero")]
    EmptyLimit,

    #[error("minimum score must be finite")]
    NonFiniteScore,
}

impl TryFrom<SearchOptionsDto> for SearchOptions {
    type Error = OptionsError;

    fn try_from(dto: SearchOptionsDto) -> Result<Self, Self::Error> {
        if dto.limit == 0 {
            return Err(OptionsError::EmptyLimit);
        }

        if !dto.minimum_score.is_finite() {
            return Err(OptionsError::NonFiniteScore);
        }

        Ok(Self {
            limit: dto.limit,
            minimum_score: FiniteScore(dto.minimum_score),
        })
    }
}
```

### `From` and `TryFrom`

Use `From` only when conversion is:

- Infallible
- Lossless
- Value-preserving
- Unsurprising

```rust
#[derive(Debug)]
struct RankedCandidate {
    id: String,
    score: f64,
}

#[derive(Debug)]
struct RankedCandidateDto {
    id: String,
    score: f64,
}

impl From<RankedCandidate> for RankedCandidateDto {
    fn from(candidate: RankedCandidate) -> Self {
        Self {
            id: candidate.id,
            score: candidate.score,
        }
    }
}
```

Use `TryFrom` for:

- DTO validation
- Finite-number checks
- Integer narrowing
- Enum parsing
- Identifier normalization
- Any conversion that can reject or alter invalid input

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum MemoryState {
    Active,
    Archived,
}

#[derive(Debug, PartialEq, Eq)]
struct StateParseError;

impl TryFrom<&str> for MemoryState {
    type Error = StateParseError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value {
            "active" => Ok(Self::Active),
            "archived" => Ok(Self::Archived),
            _ => Err(StateParseError),
        }
    }
}
```

Implement `From` or `TryFrom`, not `Into` or `TryInto`, directly.

### Enum Representation

Use stable string discriminants or explicit numeric codes at the boundary. Never export incidental Rust ordinals.

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
enum MemoryTierDto {
    Constitutional,
    Working,
    LongTerm,
}
```

Do not use `variant as u8` as a wire contract unless every numeric code is explicit and versioned.

Use `#[non_exhaustive]` only when wildcard evolution is intentional. Adapter error mappings SHOULD remain exhaustive so new variants cannot silently receive the wrong JavaScript code.

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

- [quality_standards.md](./quality_standards.md) - Ownership, safety, ABI contracts, error translation, concurrency, Cargo, and parity gates
- [quick_reference.md](./quick_reference.md) - Copy-paste Rust boundary templates, deterministic recipes, and build commands
