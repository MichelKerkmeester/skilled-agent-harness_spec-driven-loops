---
title: Toolchain, Compilation Baseline & Project Structure
description: Formatting standards, naming conventions, and TypeScript interoperability rules for Rust files in the OpenCode development environment. — Toolchain, Compilation Baseline & Project Structure.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Toolchain, Compilation Baseline & Project Structure

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
