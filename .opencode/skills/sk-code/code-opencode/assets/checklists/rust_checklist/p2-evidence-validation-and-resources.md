---
title: P2, Review Evidence, Validation Commands & Resources
description: Quality validation checklist for Rust interop code in the OpenCode development environment. — P2, Review Evidence, Validation Commands & Resources.
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# P2, Review Evidence, Validation Commands & Resources

## 4. P2 - RECOMMENDED

These improve quality but can be deferred with justification.

### Advisory Clippy Review

```markdown
- [ ] Advisory `clippy::pedantic` and `clippy::nursery` findings were reviewed
```

**Evidence**: Attach advisory output and the disposition of relevant findings.

Do not deny either lint group wholesale. Promote individually stable, valuable lints into workspace policy.

### Semantic Newtypes

```markdown
- [ ] Newtypes protect real score, rank, identifier, or validated-boundary semantics
```

**Evidence**: List introduced or intentionally omitted newtypes and the invariant each decision protects.

**Correct**:

```rust
#[derive(Debug, Clone, Copy)]
struct FiniteScore(f64);

impl TryFrom<f64> for FiniteScore {
    type Error = KernelError;

    fn try_from(value: f64) -> Result<Self, Self::Error> {
        value
            .is_finite()
            .then_some(Self(value))
            .ok_or(KernelError::NonFiniteScore)
    }
}
```

Do not introduce wrapper types without a real invariant or semantic distinction.

### Standard Trait Implementations

```markdown
- [ ] Standard traits are implemented where semantically valid
```

**Evidence**: Record relevant decisions for `Debug`, `Clone`, `Copy`, `Eq`, `Ord`, `Hash`, `Default`, `From`, and `TryFrom`.

Do not derive `Eq`, `Ord`, or `Hash` for floating-point values unless a validated wrapper defines the required semantics.

### Boundary Allocation Review

```markdown
- [ ] Boundary allocations and copies were reviewed without making zero-copy an API promise
```

**Evidence**: Attach profiles or measurements for material boundary allocations and document any retained copy.

Owned inputs are the safe default for async and cross-thread work. Zero-copy napi/WASM views require measured benefit, an explicit ownership protocol, and boundary review.

### Benchmark Targets Compile

```markdown
- [ ] Criterion benchmark targets compile and run as test targets on pull requests
```

**Evidence**: Attach `cargo test --benches` output and the benchmark target configuration.

Use Criterion with `harness = false`. Benchmark compilation catches drift without treating noisy performance values as correctness gates.

### Layered Performance Reporting

```markdown
- [ ] Kernel, serialization, and boundary costs are reported separately
```

**Evidence**: Link benchmark results for `kernel`, `serialization`, and `boundary_batch`.

End-to-end numbers alone cannot identify whether a regression belongs to the algorithm, canonical serialization, or Node/WASM crossing.

### Measurement Before Complexity

```markdown
- [ ] Tokio, Rayon, unsafe, allocator, and WASM-size changes have measurement evidence
```

**Evidence**: Attach the baseline, experiment, target matrix, and measured result that justifies the added mechanism.

Use `twiggy` before WASM allocator or size-specific optimization changes. Parallel floating-point work additionally requires a fixed reduction tree and cross-target goldens.

---

## 5. REVIEW EVIDENCE TEMPLATE

For formal findings-first review output, use `sk-code`'s code-review mode as the baseline and treat this file as Rust surface evidence.

```markdown
## Rust Standards Surface Evidence

- [ ] Rust standards validated in `rust_checklist.md`
- [ ] Universal standards validated in `universal_checklist.md`
- [ ] Findings severity/order produced with `sk-code/code-review/references/quick_reference.md`
- [ ] Baseline security, quality, and test checks sourced from `sk-code`'s code-review mode
- [ ] Surface-specific deviations documented with file:line evidence

## Rust Review Evidence

- Rust files reviewed:
- Boundary targets reviewed:
- TypeScript oracle commit:
- Golden corpus manifest:
- Exact byte-parity command:
- Native artifact/load evidence:
- WASM/WASI artifact/load evidence:
- Determinism permutation evidence:
- Unsafe blocks reviewed:
- `// SAFETY:` invariants and tests:
- Lint suppressions reviewed:
- Node-API/Node/libc target matrix:
- Supply-chain reports:
- Deferred P1/P2 items and approval:
```

---

## 6. VALIDATION COMMANDS

```bash
# Verify formatting
cargo fmt --all -- --check

# Compile every workspace target against the lockfile
cargo check --workspace --all-targets --locked

# Enforce warnings and the committed workspace lint policy
cargo clippy --workspace --all-targets --locked -- -D warnings

# Run workspace tests
cargo test --workspace --locked

# Reject rustdoc warnings
RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked

# Build release artifacts with release-profile semantics
cargo build --workspace --release --locked

# Compile and run benchmark targets as tests
cargo test --workspace --benches --locked

# Review advisory lint groups without making them blanket blockers
cargo clippy --workspace --all-targets --locked -- \
  -W clippy::pedantic \
  -W clippy::nursery

# Check dependency licenses, bans, advisories, and sources
cargo deny check

# Check the committed lockfile for known vulnerabilities
cargo audit

# Record third-party audit coverage
cargo vet --locked

# Confirm the P1 parity lint policy is committed
rg -n '^(unwrap_used|expect_used|panic|float_cmp|as_conversions|indexing_slicing)\s*=\s*"deny"' \
  --glob 'Cargo.toml'

# Find panic-prone operations requiring review
rg -n '\.(unwrap|expect)\(|panic!\(|partial_cmp\([^)]*\)\.unwrap\(\)|\[[^]]+\]' \
  --glob '*.rs'

# Find unsafe code and required adjacent invariants
rg -n 'unsafe\b|// SAFETY:' --glob '*.rs'

# Find parity-visible unstable sorting
rg -n 'sort_unstable|sort_unstable_by|sort_unstable_by_key' --glob '*.rs'

# Find collection types whose iteration order requires review
rg -n '\b(HashMap|HashSet)\b' --glob '*.rs'

# Prevent automatic snapshot acceptance in CI
CI=true INSTA_UPDATE=no cargo test --workspace --locked

# Verify native and WASM targets separately
cargo check --workspace --all-targets --locked
cargo check --workspace --target wasm32-unknown-unknown --locked

# Force the napi-rs WASI fallback during its JavaScript integration suite
NAPI_RS_FORCE_WASI=error npm test

# Regenerate TypeScript-oracle goldens into a temporary directory,
# then require a byte-for-byte clean recursive diff
npm run generate:rust-parity-goldens -- --output "$TMPDIR/rust-parity-goldens"
diff -ru tests/goldens "$TMPDIR/rust-parity-goldens"
```

Run repository-specific native platform, WASI target, sidecar, package clean-install, and exact byte-parity commands in addition to this baseline.

---

## 7. RELATED RESOURCES

### Checklists
- [universal_checklist.md](../universal_checklist.md) - Language-agnostic checks

### Style Guide
- [Rust Style Guide](../../../references/rust/style_guide/overview-and-file-header.md)
- [Rust Quality Standards](../../../references/rust/quality_standards/overview-and-data-ownership.md)
- [Rust Quick Reference](../../../references/rust/quick_reference/overview-and-boundary-template.md)
