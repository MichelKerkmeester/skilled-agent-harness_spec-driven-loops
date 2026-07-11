---
title: Rust/TypeScript Interop — Model & Boundary Types
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment. — Rust/TypeScript Interop — Model & Boundary Types.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust/TypeScript Interop — Model & Boundary Types

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
