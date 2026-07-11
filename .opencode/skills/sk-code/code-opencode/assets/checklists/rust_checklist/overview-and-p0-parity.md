---
title: Rust Code Quality Checklist
description: Quality validation checklist for Rust interop code in the OpenCode development environment.
trigger_phrases:
  - "opencode rust checklist"
  - "rust quality validation checklist"
  - "rust byte parity check"
  - "napi wasm rust review"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Code Quality Checklist

Quality validation checklist for Rust compute kernels and napi-rs, WASM/WASI, or sidecar boundaries that must preserve existing TypeScript behavior byte for byte.

---

## 1. OVERVIEW

### Purpose

Specific quality checks for Rust files in the OpenCode development environment. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

This checklist treats the TypeScript implementation as the compatibility oracle. Semantic equivalence is insufficient where Rust output crosses an existing JavaScript boundary: serialized bytes, six-decimal numeric behavior, sort order, deterministic identifiers, DTO declarations, and error behavior must match the established TypeScript contract exactly.

### Scope

Apply this checklist to:

- Pure Rust compute kernels introduced behind an existing TypeScript/Node MCP backend.
- napi-rs native addons.
- wasm-bindgen or napi-rs WASI fallback modules.
- Sidecar processes that exchange deterministic bytes or DTOs with Node.
- Rust serialization, ranking, hashing, graph, search, or numeric code whose output is observable from TypeScript.

TypeScript retains ownership of MCP transport, public tool schemas, daemon and CLI wiring, feature flags, and fallback selection. Rust adapters stay narrow and expose measured compute kernels rather than duplicating orchestration.

### Protected Contracts

| Contract | Required outcome |
|----------|------------------|
| Serialized-output parity | TypeScript and every shipped Rust boundary return identical bytes |
| Six-decimal numeric parity | Each migrated path reproduces its exact TypeScript operation |
| Sort parity | Every observable comparator has the same complete key chain and terminal tie-break |
| Deterministic-ID parity | Preimage fields, order, delimiters, UTF-8 bytes, hash, encoding, and truncation match |
| DTO/ABI parity | Names, fields, optionality, discriminants, declarations, and ownership remain compatible |
| Error-shape parity | JavaScript error name, code, message, cause, and throw or rejection behavior match |
| Boundary integrity | Panics and undocumented unsafe operations never cross the interop boundary |
| Adapter consistency | Deterministic business logic exists once in the pure core |

### Priority Levels

| Level | Meaning       | Enforcement                       |
|-------|---------------|-----------------------------------|
| P0    | HARD BLOCKER  | Must fix before commit            |
| P1    | Required      | Must fix or get explicit approval |
| P2    | Recommended   | Can defer with justification      |

---

## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Byte-for-Byte TypeScript Parity

```markdown
- [ ] TypeScript and every shipped Rust boundary produce byte-for-byte identical output
```

**Evidence**: Record the oracle command, Rust boundary commands, fixture manifest, target matrix, and clean recursive byte diff.

**Required assertion**:

```rust
fn assert_boundary_parity(
    oracle_bytes: &[u8],
    native_bytes: &[u8],
    wasm_bytes: &[u8],
) {
    assert_eq!(oracle_bytes, native_bytes);
    assert_eq!(oracle_bytes, wasm_bytes);
}
```

Parsed JSON equality is diagnostic only. It cannot approve differences in key order, number spelling, escaping, omission, or newline behavior.

### Exact Numeric Operation Parity

```markdown
- [ ] Each migrated numeric path reproduces its exact TypeScript operation
```

**Evidence**: Identify the TypeScript operation for every migrated numeric path and link it to the Rust helper and parity fixtures.

Do not collapse distinct TypeScript operations into one generic “round to six decimals” helper. Preserve whether the source uses `Number(value.toFixed(6))`, `Math.round(value * 1_000_000) / 1_000_000`, or fixed-six textual output.

**Correct**:

```rust
fn quantize_scaled_round(value: f64) -> f64 {
    (value * 1_000_000.0).round() / 1_000_000.0
}

fn fixed_six_text(value: f64) -> String {
    format!("{value:.6}")
}
```

Use each helper only after fixtures prove it matches the corresponding JavaScript operation, including signed-zero and number-spelling policy.

**Wrong**:

```rust
fn universal_six_decimal_rule(value: f64) -> String {
    format!("{value:.6}")
}
```

The wrong version changes a numeric contract into a fixed-width textual contract.

### Numeric Edge-Case Goldens

```markdown
- [ ] Golden fixtures cover halfway values, adjacent floats, negative zero, non-finite policy, and JavaScript number spelling
```

**Evidence**: Provide fixture paths and test names covering positive and negative halfway cases, adjacent representable floats, `-0.0`, finite extremes, and every defined non-finite input.

**Minimum test shape**:

```rust
#[test]
fn numeric_parity_corpus_is_byte_exact() {
    for fixture in load_numeric_fixtures() {
        let actual = run_rust_boundary(&fixture.input);
        assert_eq!(fixture.expected_bytes, actual);
    }
}
```

The fixture loader and boundary runner must compare original bytes without normalizing JSON.

### Complete Stable Comparator

```markdown
- [ ] Every observable sort has a complete comparator ending in a deterministic unique key
```

**Evidence**: Record each observable sort location, its TypeScript comparator chain, and tests that exercise every tie-break branch.

**Correct**:

```rust
use std::cmp::Ordering;

#[derive(Debug)]
struct RankedItem {
    score: f64,
    rank: u32,
    id: String,
}

fn compare_ranked(left: &RankedItem, right: &RankedItem) -> Ordering {
    right
        .score
        .total_cmp(&left.score)
        .then_with(|| left.rank.cmp(&right.rank))
        .then_with(|| left.id.cmp(&right.id))
}

fn sort_ranked(items: &mut [RankedItem]) {
    items.sort_by(compare_ranked);
}
```

The key sequence and ascending or descending direction must match TypeScript exactly. `total_cmp` is acceptable only when its treatment of signed zero and non-finite values matches the established contract.

### No Parity-Visible Unstable Ordering

```markdown
- [ ] No parity-visible path uses unstable sorting, incidental input order, or partial comparison unwraps
```

**Evidence**: Provide search results for `sort_unstable`, `sort_unstable_by`, `partial_cmp`, and ordering assumptions, plus the reviewed disposition of every hit.

**Wrong**:

```rust
items.sort_unstable_by(|left, right| {
    right.score.partial_cmp(&left.score).unwrap()
});
```

This can panic on `NaN`, omits terminal tie-breaks, and permits equal elements to reorder.

**Approved exception**: Unstable sorting is allowed only when order is provably unobservable and a test demonstrates that no boundary output depends on it. Record the approval and proof.

### Deterministic Identifier Construction

```markdown
- [ ] Deterministic IDs preserve exact fields, order, delimiters, UTF-8 bytes, hash algorithm, lowercase encoding, and truncation
```

**Evidence**: Record the TypeScript preimage construction, hash algorithm, encoding, truncation length, and cross-language golden vectors.

**Correct pattern**:

```rust
use sha2::{Digest, Sha256};

fn deterministic_id(namespace: &str, name: &str) -> String {
    let mut preimage = Vec::new();
    preimage.extend_from_slice(namespace.as_bytes());
    preimage.push(b':');
    preimage.extend_from_slice(name.as_bytes());

    let digest = Sha256::digest(preimage);
    hex::encode(digest)[..16].to_owned()
}
```

The delimiter, algorithm, lowercase hexadecimal encoding, and truncation above are examples only. The implementation must reproduce the existing TypeScript contract rather than adopt a new format.

### Deterministic Collection and Iteration Order

```markdown
- [ ] No hash-map, set, filesystem, database, thread, or parallel completion order leaks into output
```

**Evidence**: Provide insertion-order permutation tests, fresh-process reruns, and an inventory of parity-visible collection traversals.

**Correct**:

```rust
use std::collections::BTreeMap;

fn ordered_entries(values: BTreeMap<String, u64>) -> Vec<(String, u64)> {
    values.into_iter().collect()
}
```

**Also correct when TypeScript uses a custom order**:

```rust
use std::collections::HashMap;

fn ordered_entries(values: HashMap<String, u64>) -> Vec<(String, u64)> {
    let mut entries: Vec<_> = values.into_iter().collect();
    entries.sort_by(|left, right| left.0.cmp(&right.0));
    entries
}
```

Do not replace the TypeScript order with lexical ordering unless lexical ordering is the established contract.

### Canonical Serialization Parity

```markdown
- [ ] Field order, omission, nullability, number representation, escaping, encoding, and newline behavior match TypeScript
```

**Evidence**: Provide byte-level fixtures for missing versus `null`, Unicode and escaping, numeric edge cases, empty containers, and final newline behavior.

**Correct pattern**:

```rust
use serde::Serialize;

#[derive(Serialize)]
struct SearchOutput {
    id: String,
    score: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    metadata: Option<String>,
}

fn serialize_output(output: &SearchOutput) -> serde_json::Result<Vec<u8>> {
    serde_json::to_vec(output)
}
```

Struct field declaration order and `serde` attributes are contract-relevant. A generic map serializer is not a substitute for an explicitly ordered boundary DTO.

### Cross-Boundary Oracle Parity

```markdown
- [ ] napi-rs, native platform packages, WASM/WASI, and sidecar outputs match the same TypeScript oracle where enabled
```

**Evidence**: List every shipped boundary and platform target with its artifact-level replay command and clean byte comparison.

Core-only parity is insufficient. Packaging, adapter conversion, serializer configuration, and runtime-specific error handling can alter observable output.
