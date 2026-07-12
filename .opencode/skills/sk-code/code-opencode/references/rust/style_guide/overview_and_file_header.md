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

