# Research Synthesis — Rust Standards for `code-opencode` (Packet 018 / Phase 001)

> Merged synthesis of a 10-round deep-research pass. **Manually orchestrated** through `cli-opencode`: nine parallel-batched evidence rounds plus one synthesis round, every dispatch `openai/gpt-5.6-sol-fast --variant high`, conducted by Claude Code (not the `/deep:research` runner, per operator direction). Research-only — no Rust was written and no skill source was modified.

## 1. Run Provenance

| Field | Value |
|---|---|
| Executor | `cli-opencode` → `openai/gpt-5.6-sol-fast`, `--variant high` |
| Orchestration | Manual (Claude Code as conductor; 3 waves of 3 evidence rounds + 1 synthesis) |
| Rounds | 10 (9 evidence + 1 synthesis) |
| Evidence volume | ~177 KB across 9 iteration files |
| Citations | ~415 `[SOURCE:]` markers (repo `path:line` + external Rust doc URLs) |
| Raw rounds | `research/iterations/iteration-001..009.md` |
| State log | `research/deep-research-state.jsonl` |
| Agents | read-only research (no `--dangerously-skip-permissions`); Claude wrote all spec-folder artifacts |
| Date | 2026-07-11 |

## 2. Angle Coverage (all 11 answered)

| Round | Angle | Iteration file |
|---|---|---|
| 1 | A1 — Core idioms & API design | `iterations/iteration-001.md` |
| 2 | A2 — Tooling & lint tiers | `iterations/iteration-002.md` |
| 3 | A3 — Testing & benchmarking (TS↔Rust parity) | `iterations/iteration-003.md` |
| 4 | A4 — FFI/interop non-negotiables (double-weight) | `iterations/iteration-004.md` |
| 5 | A5 — Determinism/parity + async + unsafe | `iterations/iteration-005.md` |
| 6 | A6 — code-opencode language-standard convention | `iterations/iteration-006.md` |
| 7 | A7 — New-language registration mechanics | `iterations/iteration-007.md` |
| 8 | A9 + A10 — Cross-language template & Rust placement | `iterations/iteration-008.md` |
| 9 | A8 + A4(2nd) — Validation surface + Rust packaging | `iterations/iteration-009.md` |
| 10 | A11 — Synthesis (this document) | — |

## 3. Verification Addendum (Claude, post-synthesis)

The synthesis manifest was cross-checked against the live repository. **Load-bearing file targets are CONFIRMED**, with one material charter correction the research surfaced:

| Claim | Status |
|---|---|
| Parent-hub `RESOURCE_MAP` is **NOT** in `sk-code/SKILL.md` | ✅ CONFIRMED — `grep RESOURCE_MAP sk-code/SKILL.md` returns 0. **This corrects the 018 charter/spec, which assumed the union lived in `sk-code/SKILL.md`.** |
| The real parent union lives in `shared/references/smart_routing.md` | ✅ CONFIRMED — `INTENT_SIGNALS` at L319, `RESOURCE_MAP` at L341 (file is 488 lines) |
| Drift guard = `sk-code-router-sync.vitest.ts` | ✅ CONFIRMED — file present (8.5 KB) |
| `code-opencode/SKILL.md` has `INTENT_SIGNALS` + `RESOURCE_MAP` | ✅ CONFIRMED — L56 / L68 (the synthesis's "97-116" over-estimates; structure is correct) |
| `verify_stack_folders.py` `KNOWN_LANGUAGES` must gain `rust` | ✅ CONFIRMED — L15 = `{typescript, javascript, python, shell, config}` |
| `router-replay.cjs`, `hub-router.json` present; `mode-registry.json` two-axis model (code-opencode is a **surface**, Rust a language slice) | ✅ CONFIRMED |

**Caveat:** exact line numbers in the deliverables below are model estimates and drift by a few lines from the live files. Phase 002 MUST re-anchor each edit to the current line at apply time. The **file targets and structure are correct.**

---
# Deliverable 1 — Rust Standard Synthesis

## Repository Non-Negotiables

1. **The interop boundary is a stability contract.**
   - Exported napi-rs, WASM/WASI, or sidecar DTO names, field names, optionality, discriminants, numeric representations, buffer ownership, generated TypeScript declarations, error codes, error messages, and throw-versus-rejection behavior are versioned contracts.
   - Contract protected: **DTO/ABI and JavaScript error-shape parity**.
   - Keep MCP transport, public tool schemas, daemon/CLI wiring, feature flags, and fallback selection in TypeScript. Rust exposes only measured compute kernels through narrow adapters.
   - `core` must not depend on `napi`, `napi-derive`, `wasm-bindgen`, `JsValue`, Node handles, or WASM runtime values.

2. **Determinism means byte-for-byte TypeScript parity.**
   - The release assertion is `typescript_oracle(input).as_bytes() == rust_boundary(input).as_bytes()`.
   - Semantic JSON equality is diagnostic only.
   - Preserve each existing TypeScript numeric operation independently:
     - `Number(value.toFixed(6))`
     - `Math.round(value * 1_000_000) / 1_000_000`
     - Fixed-six textual output only where the wire contract explicitly requires it.
   - Preserve complete comparator chains, terminal deterministic tie-breaks, identifier hash preimages, UTF-8 encoding, delimiters, lowercase hexadecimal encoding, truncation length, key ordering, omission behavior, and serialized number spelling.
   - Contracts protected: **six-decimal score parity, stable sort/tie-break parity, deterministic-ID parity, deterministic hash/iteration order, and serialized-output parity**.

3. **No `unsafe` without a documented invariant and a test.**
   - The pure core uses `#![forbid(unsafe_code)]`.
   - Boundary crates use `#![deny(unsafe_op_in_unsafe_fn)]`.
   - Every allowed unsafe block has an adjacent `// SAFETY:` comment covering the relevant validity, length, alignment, initialization, aliasing, lifetime, ownership, cleanup, and thread-affinity assumptions.
   - Every unsafe block has an exercising test and at least one precondition-challenge test.
   - Contract protected: **FFI memory safety and boundary integrity**.

4. **Panics are not boundary errors.**
   - JS-controlled input must not reach `unwrap`, `expect`, unchecked indexing, explicit `panic!`, or assertion-dependent validation.
   - Recoverable failures use typed `Result`; adapters exhaustively map them into stable JavaScript errors.
   - Contract protected: **Node process survival, WASM trap avoidance, and error-shape parity**.

## `references/rust/style_guide.md`

### Section Skeleton

1. `OVERVIEW`
2. `FILE HEADER FORMAT`
3. `EDITION, TOOLCHAIN, AND COMPILATION BASELINE`
4. `SECTION ORGANIZATION`
5. `NAMING CONVENTIONS`
6. `FORMATTING RULES`
7. `IMPORT AND MODULE ORDERING`
8. `COMMENTING AND RUSTDOC RULES`
9. `RUST/TYPESCRIPT INTEROP AND COEXISTENCE`
10. `RELATED RESOURCES`

This preserves the established style-guide progression while making the existing mixed-language section Rust-specific. [SOURCE: `.opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-714`] [SOURCE: iteration-006:32-86]

### Consolidated Rules

#### Idioms and Naming

- Use Rust API Guidelines casing:
  - `UpperCamelCase` for types and traits.
  - `snake_case` for functions, variables, and modules.
  - `SCREAMING_SNAKE_CASE` for constants.
  - Treat acronyms as words, such as `Uuid`, not `UUID`.
- Use `as_*` only for cheap borrowed views, `to_*` for work or allocation, and `into_*` for consuming conversions.
- Omit `get_` from ordinary Rust getters.
- Preserve existing JavaScript camelCase export names with napi-rs or wasm-bindgen rename attributes rather than contaminating core Rust naming.
- JS-visible DTO fields and serialized keys must match the TypeScript contract exactly.
- Apply `C-CASE`, `C-CONV`, `C-GETTER`, `C-COMMON-TRAITS`, `C-SERDE`, `C-STRUCT-PRIVATE`, `C-SEALED`, `C-EXAMPLE`, and `C-FAILURE`.
- Use `#[non_exhaustive]` only when wildcard evolution is intentional. Do not hide new error variants from exhaustive adapter mappings.

#### Ownership and Boundary Types

- Export owned, materialized DTOs: `String`, `Vec<T>`, fixed-width numbers, booleans, boundary structs, and `Result<OwnedOutput, BoundaryError>`.
- Do not export borrowed fields, `&str`, `&[T]`, `Cow<'a, T>`, public lifetime parameters, iterators, internal graph references, or Rust builders.
- Borrow internally in the pure core.
- Treat zero-copy napi/WASM views as reviewed synchronous optimization exceptions.
- Copy JS-owned memory before async or cross-thread work unless an explicit ownership protocol proves exclusive access.
- Use fixed-width integers at boundaries; never expose `usize` or `isize`.
- Represent integers outside JavaScript’s safe range through an explicitly agreed `BigInt` or decimal-string contract.
- Use stable string discriminants or explicit numeric codes for exported enums; never expose incidental Rust ordinal values.
- Keep boundary DTOs passive and versioned; convert immediately into validated private-field core types.

#### API Design and Conversion

- Use private-field newtypes for parity-sensitive primitives:
  - `SymbolId` for deterministic identifiers.
  - `SkillId` for validated identifiers.
  - `FiniteScore` for finite values and centralized quantization.
  - `Rank` where zero-based versus one-based semantics matter.
- Use `From` only for infallible, lossless, value-preserving conversions.
- Use `TryFrom` for DTO validation, finite-number checks, integer narrowing, enum parsing, and ID normalization.
- Implement `From`/`TryFrom`, not `Into`/`TryInto` directly.
- Serialize newtypes to the existing TypeScript primitive representation.
- Use builders only for genuinely complex core construction.
- Keep builders and type-state private to the core; JavaScript supplies complete options DTOs.
- Use type-state only when it prevents a real invalid transition that threatens schema, index, or deterministic-output integrity.

#### Deterministic Data Handling

- Define separate helpers for:
  - TypeScript `toFixed(6)`-style numeric quantization.
  - TypeScript `Math.round(* 1e6) / 1e6`.
  - Fixed-six text formatting.
- Never substitute `format!("{value:.6}")`, `f64::to_string`, `ryu`, or `serde_json` for a TypeScript numeric/serialization contract without exhaustive fixtures.
- Reject non-finite scores unless their boundary encoding is explicitly defined.
- Normalize or reject `-0.0` according to the TypeScript oracle.
- Every observable sort must use a complete comparator ending in a deterministic unique key.
- Do not use stable input order as the terminal tie-break.
- Prohibit `sort_unstable*` for parity-visible output.
- Do not use `partial_cmp(...).unwrap()` in parity paths.
- Verify whether Rust lexical comparison matches the permitted TypeScript identifier alphabet; do not assume equivalence with `localeCompare`.
- Do not let `HashMap`/`HashSet` iteration reach output, serialization, hashing, IDs, traversal order, or ranking.
- Use `BTreeMap`/`BTreeSet` for canonical key order.
- Use `IndexMap` only when deterministic insertion order is itself contractual.
- Preserve exact ID input fields, order, separators, encoding, hash algorithm, lowercase output, and truncation.

#### Error Style

- Core public operations return `Result<T, CoreError>` or another domain-specific `thiserror` type.
- Core errors carry structured adapter-relevant context but no Node/WASM runtime types.
- `anyhow` is prohibited in pure-core public APIs and exported functions.
- `anyhow` may be used in sidecar `main`, CLI/build tooling, or the outermost non-ABI application shell.
- Each adapter owns one exhaustive conversion from core errors to the stable JavaScript error protocol.
- Panic only for violated internal invariants, never recoverable boundary failures.

#### Module and Workspace Layout

```text
Cargo.toml
Cargo.lock
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
    src/lib.rs
  wasm/
    Cargo.toml
    src/lib.rs
```

- `core` owns algorithms, validation, normalization, rounding, sorting, hashing, IDs, and transport-neutral DTOs.
- `napi` and `wasm` are thin adapters over `core`.
- Adapters must not duplicate scoring, sorting, hashing, rounding, or business validation.
- A sidecar, if justified, is another thin member over the same core.
- Keep one workspace lockfile and centralize edition, MSRV, dependency, lint, and release policy at the workspace root.
- Keep native and WASM features separated so unsupported combinations are not accidentally built.

#### Async and Concurrency

- Keep parsing, scoring, ranking, hashing, canonicalization, and serialization preparation synchronous in the core.
- Use napi-rs `AsyncTask` for measured CPU/blocking work that would materially block Node.
- Marshal owned DTOs before `AsyncTask::compute`; do not access JS values or `Env` off the JS thread.
- Use Tokio only for genuine Rust-owned asynchronous I/O.
- Use Rayon only after benchmark evidence shows a batch-size benefit.
- Canonicalize parallel results synchronously.
- Forbid parity-visible parallel floating-point reductions unless the reduction tree is fixed and golden-tested.
- Attach deterministic sequence keys to native-thread results and reorder before JS emission.
- Assume baseline WASM is single-threaded; Promise bridging does not create CPU parallelism.

#### Comments and Documentation

- Number H2 sections and use all-caps headings.
- Explain durable constraints and boundary contracts, not mechanics or ephemeral packet/task identifiers.
- Every public operation includes a compilable example using `?`, not `unwrap`.
- Document exact `# Errors`, `# Panics`, and `# Safety` conditions where applicable.
- Boundary documentation states:
  - Ownership/copy behavior.
  - JS error code and shape.
  - Synchronous throw versus Promise rejection.
  - Complete comparator or hash preimage.
  - Serialization order.
  - The named parity/interop contract protected.

## `references/rust/quality_standards.md`

### Section Skeleton

1. `OVERVIEW`
2. `OWNED VS BORROWED DATA DECISION GUIDE`
3. `SAFETY AND INTEROP POLICIES`
4. `DOMAIN AND STATE MODELING`
5. `STANDARD COLLECTION AND SERIALIZATION TYPES`
6. `PUBLIC API AND ABI CONTRACTS`
7. `RUSTDOC AND BOUNDARY DOCUMENTATION`
8. `ERROR AND PANIC TRANSLATION`
9. `ASYNC, THREADING, AND RUNTIME PATTERNS`
10. `CARGO, BUILD, AND VERIFICATION BASELINE`
11. `MODULE AND BOUNDARY ORGANIZATION`
12. `BYTE-FOR-BYTE DETERMINISM AND PARITY`
13. `RELATED RESOURCES`

Rules in Sections 2–12 carry explicit P0/P1/P2 labels.

### P0 — Hard Blockers

- Any TypeScript↔Rust serialized-byte mismatch.
- Any mismatch in six-decimal numeric behavior or JS number spelling.
- Any missing comparator key or nondeterministic terminal tie-break.
- Any difference in deterministic-ID preimage, encoding, algorithm, or truncation.
- Any observable dependence on hash-map, set, filesystem, database, thread, or work-completion order.
- Any napi-rs/WASM/WASI DTO, generated declaration, error shape, or throw/rejection mismatch.
- Any panic-dependent boundary validation or JS-controlled path reaching `unwrap`, `expect`, `panic!`, unchecked indexing, or `partial_cmp(...).unwrap()`.
- Any unsafe block without an adjacent `// SAFETY:` invariant and tests.
- Any duplication of core ranking, hashing, sorting, rounding, or validation in an adapter.
- Any golden output authored by Rust rather than generated by the pinned TypeScript oracle.
- Any automatic snapshot/golden acceptance in CI.
- Any native/WASM/WASI target claimed without artifact-level parity and load tests.
- Any parallel floating-point reduction without a fixed reduction tree and cross-target goldens.
- Any release-profile-dependent integer semantics.
- Any Rust output using locale-dependent formatting or platform-native path behavior.

### P1 — Required

#### Formatting, Edition, and MSRV

- Commit `rustfmt.toml`:

```toml
edition = "2024"
style_edition = "2024"
max_width = 100
newline_style = "Unix"
```

- Default new crates to Edition 2024.
- Declare `rust-version`; test that exact MSRV and a pinned current stable toolchain.
- Use Edition 2021 only for a verified pre-1.85 compatibility need.
- Keep zero-warning policy in CI; do not add crate-wide `#![deny(warnings)]`.

#### Clippy CI Tier

Run:

```bash
cargo clippy --workspace --all-targets --locked -- -D warnings
```

Commit these durable parity lints in `[workspace.lints.clippy]`:

```toml
[workspace.lints.clippy]
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"
```

- Use `deny`, not `forbid`, so a narrowly reviewed local exception remains possible.
- Every `#[allow(...)]` includes a durable `reason`.
- Keep `clippy::pedantic` and `clippy::nursery` advisory; promote individual stable lints rather than denying either group wholesale.

#### Arithmetic and Floating Point

- Use `checked_*` for lengths, offsets, scores, counts, buffer sizes, and boundary conversions.
- Use `wrapping_*` only where modulo arithmetic is the named algorithm.
- Use `saturating_*` only where clamping is the TypeScript contract.
- Use `TryFrom`, not `as`, for narrowing conversions.
- Enable release overflow checks as defense in depth.
- Do not introduce `mul_add` in a parity path without fixtures proving the changed rounding.
- Avoid platform-variable transcendental operations unless quantized and cross-target tested.

#### Testing and Parity

- Unit-test private invariants under `#[cfg(test)]`.
- Put public-contract tests in `tests/*.rs`.
- Put shared integration helpers in `tests/common/mod.rs`.
- Maintain:
  - `parity_golden.rs`
  - `determinism.rs`
  - `property_parity.rs`
  - `boundary_native.rs`
  - `boundary_wasm.rs`
  - `error_parity.rs`
- Generate expected output only from the TypeScript oracle.
- Record oracle commit, generator command, encoding, newline policy, comparison mode, and input/output SHA-256 values.
- Regenerate goldens into a temporary directory and require a clean recursive diff.
- Replay committed inputs through the core and every shipped boundary without normalization.
- Use differential `proptest` generators weighted toward:
  - Rounding boundaries and adjacent floats.
  - `-0.0`, finite extremes, and defined non-finite cases.
  - Equal and nearly equal scores.
  - Every tie-break branch.
  - Unicode and combining characters.
  - Missing versus `null`.
  - Permuted maps, sets, and graph edges.
  - Empty, duplicate, cyclic, dangling, and depth-truncated graph cases.
- Commit `proptest-regressions`.
- Promote every minimized parity failure into the concrete golden corpus.
- Run property testing through one long-lived Node oracle process where practical.
- Use `insta::assert_snapshot!` only on already canonicalized bytes/text.
- Structured snapshots are diagnostic, not parity oracles.
- Set `CI=true` and `INSTA_UPDATE=no`.

#### Boundary and Packaging

- Choose the lowest proven Node-API level supporting all used APIs.
- Declare the matching `napiN` feature and tested `engines.node` floor.
- Test the oldest claimed Node release.
- Keep addon runtime support separate from `@napi-rs/cli` build-tool requirements.
- Publish exact-version optional platform packages per OS/CPU/libc target.
- Treat glibc and musl as separate targets.
- Require real-load and clean-install package-selection tests.
- Gate complete platform publication before publishing the root package.
- Choose one napi-rs packaging system; do not combine the generated platform loader with an independent prebuild loader.
- Prefer napi-rs’s generated WASI fallback when preserving the same Node-facing addon API.
- Use a separate wasm-bindgen `nodejs` target only for an intentionally distinct WASM ABI.
- Force WASI fallback tests with `NAPI_RS_FORCE_WASI=error`.
- Treat native and WASI as independent release targets.
- Introduce `cxx` only for a concrete C++ dependency; include C++ compiler/runtime compatibility in the platform matrix and prohibit cross-boundary unwinding.

#### Supply Chain

- Gate `cargo deny check` with committed `deny.toml`.
- Gate `cargo audit` against committed `Cargo.lock`.
- Start `cargo vet --locked` as advisory during policy bootstrap; make it blocking after audit criteria, imports, and exceptions are committed.
- Pin scanner/action versions.

### P2 — Recommended

- Review `clippy::pedantic` and `clippy::nursery` output.
- Use common traits where semantically valid.
- Prefer standard collection and conversion types over custom substitutes.
- Use newtypes where they protect real boundary semantics.
- Review boundary allocations and clones, but do not trade away ownership clarity for speculative zero-copy.
- Use Criterion with `harness = false`.
- Benchmark `kernel`, `serialization`, and `boundary_batch` separately.
- Run `cargo test --benches` on pull requests.
- Measure regressions on a pinned runner; never weaken zero-tolerance correctness parity because performance measurements are noisy.
- Use `twiggy` before WASM allocator or optimization changes.
- Measure before adopting `wee_alloc`, size-specific optimization, Tokio, Rayon, or unsafe zero-copy.

## `references/rust/quick_reference.md`

### Section Skeleton

1. `OVERVIEW`
2. `COMPLETE RUST BOUNDARY MODULE TEMPLATE`
3. `NAMING CHEAT SHEET`
4. `SECTION ORDERING`
5. `BOUNDARY TYPE AND SIGNATURE PATTERNS`
6. `COLLECTION AND CONVERSION PATTERNS`
7. `IMPORT, MODULE, AND EXPORT TEMPLATES`
8. `ERROR AND PANIC MAPPING`
9. `RUSTDOC TEMPLATE`
10. `CARGO AND BUILD QUICK REFERENCE`
11. `DETERMINISM, PARITY, AND COMMON RECIPES`
12. `RELATED RESOURCES`

### Required Recipes

- Pure-core plus thin napi-rs and wasm-bindgen/WASI adapter template.
- Owned DTO conversion with `TryFrom`.
- Domain `thiserror` plus exhaustive adapter mappings.
- napi-rs synchronous export returning `napi::Result<T>`.
- napi-rs `AsyncTask` with owned input and no off-thread JS handles.
- wasm-bindgen export returning `Result<T, JsValue>`.
- Explicit `serde-wasm-bindgen` serializer configuration.
- Stable sort with a complete comparator and terminal unique ID.
- Finite-score validation and explicit signed-zero policy.
- Separate TypeScript-compatible quantization helpers.
- Exact deterministic-ID construction.
- `BTreeMap` or collect-and-sort canonicalization.
- Canonical byte serialization.
- Narrow lint suppression with a durable `reason`.
- Unsafe wrapper with adjacent `// SAFETY:` invariant.
- TypeScript/native/WASM/WASI golden replay.
- Forced WASI fallback invocation.
- Complete gate sequence:

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

- Separate target commands for native and `wasm32-unknown-unknown` or `wasm32-wasip1-threads`.
- Advisory Clippy invocation:

```bash
cargo clippy --workspace --all-targets --locked -- \
  -W clippy::pedantic \
  -W clippy::nursery
```

## `assets/checklists/rust_checklist.md`

### Section Skeleton

1. `OVERVIEW`
2. `P0 - HARD BLOCKERS`
3. `P1 - REQUIRED`
4. `P2 - RECOMMENDED`
5. `REVIEW EVIDENCE TEMPLATE`
6. `VALIDATION COMMANDS`
7. `RELATED RESOURCES`

The overview must require the universal checklist alongside the Rust checklist. Each item uses an H3 rule name, literal checkbox, concrete evidence field, and where useful a correct/wrong example or approved exception.

### P0 Checkbox Items

- [ ] TypeScript and every shipped Rust boundary produce byte-for-byte identical output.
- [ ] Each migrated numeric path reproduces its exact TypeScript operation; fixed-six text is used only where textual fixed width is contractual.
- [ ] Golden fixtures cover halfway values, adjacent floats, negative zero, non-finite policy, and JS number spelling.
- [ ] Every observable sort has a complete comparator ending in a deterministic unique key.
- [ ] No parity-visible path uses `sort_unstable*`, incidental input order, or `partial_cmp(...).unwrap()`.
- [ ] Deterministic IDs preserve exact fields, order, delimiters, UTF-8 bytes, hash algorithm, lowercase encoding, and truncation.
- [ ] No `HashMap`/`HashSet`, filesystem, database, thread, or parallel completion order leaks into output.
- [ ] Serialized field order, omission behavior, nullability, number representation, escaping, encoding, and newline behavior match TypeScript.
- [ ] napi-rs, native platform packages, WASM/WASI, and sidecar outputs match the same oracle where enabled.
- [ ] JS-visible DTOs, generated TypeScript declarations, enum discriminants, and error envelopes match.
- [ ] No JS-controlled path can panic or trap instead of returning the established error shape.
- [ ] The pure core forbids unsafe code.
- [ ] Every boundary unsafe block has an adjacent `// SAFETY:` invariant, safe wrapper, exercising test, and precondition-challenge test.
- [ ] Adapters do not duplicate deterministic core logic.
- [ ] Golden expected files were generated only by the pinned TypeScript oracle.
- [ ] CI cannot automatically accept changed goldens or snapshots.
- [ ] Numbered all-caps sections and durable WHY comments satisfy house style.

### P1 Checkbox Items

- [ ] Exported DTOs are owned and contain no borrowed fields or public lifetimes.
- [ ] Boundary integers are fixed-width and range-checked.
- [ ] `From` is used only for infallible conversions; fallible validation uses `TryFrom`.
- [ ] Core errors are typed with `thiserror`; `anyhow` does not appear in pure-core public APIs.
- [ ] Every core error variant has exhaustive napi-rs and WASM/WASI mapping.
- [ ] JS error `name`, `code`, `message`, `cause`, and throw/rejection behavior are golden-tested.
- [ ] Native and WASM features compile and test independently.
- [ ] `cargo fmt`, locked checks, Clippy, tests, rustdoc, and release builds pass.
- [ ] CI denies `unwrap_used`, `expect_used`, `panic`, `float_cmp`, `as_conversions`, and `indexing_slicing`.
- [ ] Every lint suppression is narrow and justified.
- [ ] The declared MSRV and pinned stable toolchain are tested.
- [ ] Every supported native platform package has a real-load and clean-install test.
- [ ] The oldest claimed Node version and libc floor are exercised.
- [ ] Forced WASI tests use `NAPI_RS_FORCE_WASI=error`.
- [ ] Goldens record oracle provenance and checksums.
- [ ] `proptest-regressions` is committed and minimized failures are promoted to concrete fixtures.
- [ ] Determinism tests permute insertion order and rerun in fresh processes.
- [ ] Public APIs document errors, panics, safety, ownership, and protected parity contracts.
- [ ] `cargo-deny` and `cargo-audit` pass; `cargo-vet` status is recorded.
- [ ] cxx is absent unless a concrete C++ dependency requires it.

### P2 Checkbox Items

- [ ] Advisory pedantic/nursery findings were reviewed.
- [ ] Newtypes protect real score, rank, or identifier semantics.
- [ ] Standard traits are implemented where semantically valid.
- [ ] Boundary allocations and copies were reviewed without making zero-copy an API promise.
- [ ] Criterion benchmark targets compile on pull requests.
- [ ] Kernel, serialization, and boundary costs are reported separately.
- [ ] Tokio, Rayon, unsafe, allocator, and WASM-size changes have measurement evidence.

### Review Evidence Template

```markdown
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

# Deliverable 2 — Upgrade Manifest

## A. New Files

Create exactly:

1. `.opencode/skills/sk-code/code-opencode/references/rust/style_guide.md`
2. `.opencode/skills/sk-code/code-opencode/references/rust/quality_standards.md`
3. `.opencode/skills/sk-code/code-opencode/references/rust/quick_reference.md`
4. `.opencode/skills/sk-code/code-opencode/assets/checklists/rust_checklist.md`
5. `.opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/004-rust-standards.md`

Do not create:

- A `code-rust` surface.
- A Rust workflow mode.
- A fourth Rust reference document.
- A new shared interop document.
- A Rust crate or application implementation.

Rust is a language slice of the existing `code-opencode` surface. [SOURCE: `.opencode/skills/sk-code/mode-registry.json:80-97`] [SOURCE: iteration-008:159-196]

## B. `.opencode/skills/sk-code/code-opencode/SKILL.md`

### Detection Rule

Edit the language-detection prose at lines `16-18`:

```markdown
`.rs` selects Rust; when no Rust file is present, local `Cargo.toml` or `Cargo.lock`
markers select Rust after the OPENCODE surface has already been established.
napi-rs and wasm-bindgen vocabulary are additional intent signals, not
cross-project surface detectors.
```

This preserves surface-first, extension-first detection. [SOURCE: `.opencode/skills/sk-code/code-opencode/SKILL.md:16-18`] [SOURCE: `.opencode/skills/sk-code/shared/references/stack_detection.md:84-97`]

### Human-Facing Reference Map

At lines `26-40`, add:

```markdown
- Rust — `references/rust/`
  - `style_guide.md`
  - `quality_standards.md`
  - `quick_reference.md`
```

### `RUST` Intent Signal

At lines `56-66`, add:

```python
"RUST": {
    "weight": 1,
    "keywords": [
        "rust",
        ".rs",
        "cargo.toml",
        "cargo.lock",
        "napi-rs",
        "napi_rs",
        "#[napi]",
        "wasm-bindgen",
        "wasm_bindgen",
        "#[wasm_bindgen]",
        "wasi",
        "cdylib",
    ],
},
```

The unit weight and language-specific key match existing entries. [SOURCE: `.opencode/skills/sk-code/code-opencode/SKILL.md:56-66`]

### `RUST` Resource Map

At lines `97-116`, add:

```python
"RUST": [
    "references/rust/style_guide.md",
    "references/rust/quality_standards.md",
    "references/rust/quick_reference.md",
],
```

### `CODE_QUALITY` Registration

At lines `77-83`, add:

```python
"assets/checklists/rust_checklist.md",
```

Also list `rust_checklist.md` in the human-facing language-quality inventory at lines `127-133`.

### Surface Non-Negotiable

At lines `120-125`, add a compact surface-wide rule:

```markdown
- **Rust preserves the TypeScript contract.** Rust napi-rs, WASM/WASI, and
  sidecar modules are compatibility implementations, not independent behavior
  authorities. JS-visible bytes, six-decimal numeric behavior, comparator
  tie-breaks, deterministic IDs, collection order, DTOs, and error shapes must
  remain identical to the TypeScript oracle.
```

### Multi-Language Interop Resolution

Reconcile the current “one language per task” wording at lines `120-125` with shared multi-language detection:

- Single-language work loads one language trio.
- A task touching both Rust and TypeScript loads both trios plus shared guidance.
- This is required for napi-rs/WASM parity reviews and must not remain first-match-only.

[SOURCE: `.opencode/skills/sk-code/code-opencode/SKILL.md:120-125`] [SOURCE: `.opencode/skills/sk-code/shared/references/stack_detection.md:97-99`]

## C. Parent-Hub Resource Union

### Required Correction

`.opencode/skills/sk-code/SKILL.md` does **not** currently contain the machine-readable parent `RESOURCE_MAP`. It contains the mode-registry router and delegates smart routing to nested/shared resources. Therefore, phase 002 must not invent a `RESOURCE_MAP` block in that file. [SOURCE: `.opencode/skills/sk-code/SKILL.md:48-50`] [SOURCE: `.opencode/skills/sk-code/SKILL.md:86-117`]

The actual parent-hub union projection is:

```text
.opencode/skills/sk-code/shared/references/smart_routing.md
```

Its machine block begins around lines `297-301`, and its parent `RESOURCE_MAP` spans lines `341-476`. [SOURCE: `.opencode/skills/sk-code/shared/references/smart_routing.md:297-301`] [SOURCE: `.opencode/skills/sk-code/shared/references/smart_routing.md:341-476`]

### Parent `RUST` Intent

Add the same `RUST` intent signal used by the child router. Also extend `LANGUAGE_STANDARDS` vocabulary with Rust, `.rs`, Cargo, napi-rs, wasm-bindgen, and WASI terms.

### Exact Re-Prefixed Parent Entry

```python
"RUST": [
    "code-opencode/references/rust/style_guide.md",
    "code-opencode/references/rust/quality_standards.md",
    "code-opencode/references/rust/quick_reference.md",
],
```

### Parent `CODE_QUALITY` Addition

```python
"code-opencode/assets/checklists/rust_checklist.md",
```

The checklist belongs under `CODE_QUALITY`, not under `RUST`, because the guard compares resources per intent.

### Human-Facing Parent Overlay

At lines `193-220`, add a `RUST` row naming:

- `code-opencode/references/rust/style_guide.md`
- `code-opencode/references/rust/quality_standards.md`
- `code-opencode/references/rust/quick_reference.md`
- `code-opencode/assets/checklists/rust_checklist.md`

### Drift-Guard Expectation

The exact guard is:

```text
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
```

It must prove:

- Every routed path exists.
- Every routable reference/asset is covered.
- Every child path is projected into the parent with exactly one `code-opencode/` prefix.
- The parent map equals the set union of child maps plus the fixed parent-owned allowlist.
- No unowned parent path or missing Rust child projection exists.

[SOURCE: `sk-code-router-sync.vitest.ts:85-110`] [SOURCE: `sk-code-router-sync.vitest.ts:144-192`]

## D. Other Registration Touchpoints

### `.opencode/skills/sk-code/shared/references/stack_detection.md`

Add:

```markdown
| RUST | `.rs`; fallback markers `Cargo.toml`, `Cargo.lock`; napi-rs/wasm-bindgen vocabulary | `code-opencode/references/rust/` |
```

Rules:

- Evaluate Cargo markers only after `OPENCODE` surface detection.
- Permit a touched-language set so Rust-plus-TypeScript work loads both trios.

### `.opencode/skills/sk-code/hub-router.json`

Extend the existing `code-opencode-runtime` vocabulary with:

```json
"rust",
".rs",
"cargo.toml",
"cargo.lock",
"napi-rs",
"napi_rs",
"wasm-bindgen",
"wasm_bindgen",
"wasi",
"cdylib"
```

Do not add a new hub signal or resource pointer. [SOURCE: `.opencode/skills/sk-code/hub-router.json:27-36`] [SOURCE: `.opencode/skills/sk-code/hub-router.json:66-73`]

### `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py`

Add `"rust"` to `KNOWN_LANGUAGES`.

Green behavior:

- `references/rust/` is recognized.
- No orphan-language-folder diagnostic is emitted.

[SOURCE: `verify_stack_folders.py:13-33`]

### `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py`

Add:

```python
".rs": "rust",
```

to `SUPPORTED_EXTENSIONS`.

Also add Rust dispatch/validation behavior rather than merely discovering `.rs` files. Rust checks should cover:

- Boundary ownership and borrowed-field violations.
- `unwrap`/`expect`/panic-sensitive exported paths.
- Missing `// SAFETY:` comments.
- Unchecked parity-visible sorting or hash iteration where mechanically detectable.
- Cargo/native/WASM module classification.

Update:

```text
.opencode/skills/sk-code/code-opencode/assets/scripts/test_verify_alignment_drift.py
```

with Rust discovery and dispatch fixtures.

[SOURCE: `verify_alignment_drift.py:31-42`] [SOURCE: `verify_alignment_drift.py:116-129`] [SOURCE: `verify_alignment_drift.py:288-313`]

### `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`

Update:

- OpenCode surface regex with `.rs`, `Cargo.toml`, and `Cargo.lock`.
- `OPENCODE_LANGUAGES` with `rust`.
- Rust detection for `.rs`, Cargo markers, napi-rs, wasm-bindgen, WASI, and `cdylib`.
- Language selection from first-match scalar to a touched-language set for Rust/TypeScript interop.
- Resource filtering so Rust-plus-TypeScript parity scenarios retain both language trios and shared guidance.

Add replay fixtures for:

- `.rs` path.
- Cargo-only workspace marker.
- napi-rs prompt.
- wasm-bindgen prompt.
- WASI fallback prompt.
- Rust-plus-TypeScript byte-parity prompt.
- Rust quality/checklist prompt.

[SOURCE: `router-replay.cjs:351-373`] [SOURCE: `router-replay.cjs:440-455`]

### Shared Reference Updates

Edit `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns.md`:

- Add Rust to declared language scope.
- Add Rust trio links.
- Name the shared contracts:
  - Six-decimal numeric behavior.
  - Stable ordering/tie-breaks.
  - Deterministic IDs.
  - Deterministic hash/iteration behavior.
  - Byte-for-byte differential fixtures.

Edit `.opencode/skills/sk-code/code-opencode/references/shared/code_organization.md`:

- Add `references/rust/` to the language directory layout.
- Add Rust unit/integration test conventions to test-file tables.
- Keep general module placement shared; keep Cargo/napi-rs/wasm-bindgen mechanics in the Rust trio.

[SOURCE: `universal_patterns.md:20-35`] [SOURCE: `universal_patterns.md:535-543`] [SOURCE: `code_organization.md:400-425`] [SOURCE: `code_organization.md:629-639`]

### `.opencode/skills/sk-code/mode-registry.json`

No edit.

Rust remains a language slice inside the existing `code-opencode` surface. Adding a Rust workflow mode or surface would violate the two-axis architecture. [SOURCE: `.opencode/skills/sk-code/mode-registry.json:4-18`] [SOURCE: `.opencode/skills/sk-code/mode-registry.json:80-97`]

## E. Rust Playbook Entry

Create `.opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/004-rust-standards.md`:

```markdown
---
id: OC-004
category: language-standards
title: 'Rust standards routing'
expected_intent: RUST
expected_resources:
  - references/rust/style_guide.md
  - references/rust/quality_standards.md
  - references/rust/quick_reference.md
version: 1.0.0.0
---

# OC-004: Rust standards routing

## 2. SCENARIO CONTRACT

- Prompt: `For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.`
- Expected intent: `RUST`

**Exact prompt**:

```text
For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.
```
```

Use `RUST` consistently in frontmatter and body; do not repeat the existing TypeScript scenario’s intent mismatch. [SOURCE: `.opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/001-typescript-standards.md:1-23`]

# Deliverable 3 — Template-Conformance Map

## Conformance Principle

“Aligned 1:1” means Rust uses the same three-document responsibilities, frontmatter, directive tone, numbered all-caps H2 structure, overview-first progression, examples/tables/rationale, and final sibling links. It does not require identical section counts: existing TypeScript, Python, and Shell standards already vary by language. [SOURCE: iteration-008:21-53]

## Style Guide Map

| Rust section | Existing trio role | Tier |
|---|---|---|
| `1. OVERVIEW` | Purpose and use conditions | Shared-tier structure |
| `2. FILE HEADER FORMAT` | File identity and header convention | Shared-tier structure with Rust examples |
| `3. EDITION, TOOLCHAIN, AND COMPILATION BASELINE` | Language mode/compilation semantics | Rust-specific |
| `4. SECTION ORGANIZATION` | Standard source ordering and section layout | Shared-tier structure with Rust ordering |
| `5. NAMING CONVENTIONS` | Symbol naming and boundary exceptions | Shared-tier role; Rust-specific rules |
| `6. FORMATTING RULES` | Authoritative formatter and multiline forms | Rust-specific |
| `7. IMPORT AND MODULE ORDERING` | Dependency/import grouping and re-exports | Shared-tier role; Rust-specific syntax |
| `8. COMMENTING AND RUSTDOC RULES` | Durable WHY comments and public documentation | Shared-tier policy plus Rust-specific rustdoc/SAFETY |
| `9. RUST/TYPESCRIPT INTEROP AND COEXISTENCE` | Existing mixed-language/coexistence slot | Rust-specific and load-bearing |
| `10. RELATED RESOURCES` | Links to sibling trio documents | Shared-tier structure |

## Quality Standards Map

| Rust section | Existing trio role | Tier |
|---|---|---|
| `1. OVERVIEW` | Scope and enforcement model | Shared-tier structure |
| `2. OWNED VS BORROWED DATA DECISION GUIDE` | Primary language-modeling decision guide | Rust-specific |
| `3. SAFETY AND INTEROP POLICIES` | Safe/default constructs and restricted exceptions | Rust-specific |
| `4. DOMAIN AND STATE MODELING` | State and domain representation | Shared-tier role; Rust-specific implementation |
| `5. STANDARD COLLECTION AND SERIALIZATION TYPES` | Prefer standard abstractions and define observable behavior | Rust-specific parity rules |
| `6. PUBLIC API AND ABI CONTRACTS` | Explicit public signatures/contracts | Shared-tier role; Rust-specific ABI |
| `7. RUSTDOC AND BOUNDARY DOCUMENTATION` | Public documentation requirements | Shared-tier role; Rust-specific tags |
| `8. ERROR AND PANIC TRANSLATION` | Typed errors and stable codes | Shared-tier role; Rust-specific mapping |
| `9. ASYNC, THREADING, AND RUNTIME PATTERNS` | Async/concurrency policy | Rust-specific |
| `10. CARGO, BUILD, AND VERIFICATION BASELINE` | Compiler/build baseline and verification matrix | Rust-specific |
| `11. MODULE AND BOUNDARY ORGANIZATION` | Source/output/public-export organization | Shared-tier role; Rust-specific adapters |
| `12. BYTE-FOR-BYTE DETERMINISM AND PARITY` | Additional repository-critical semantic gate | Rust-specific, justified extension |
| `13. RELATED RESOURCES` | Links to sibling trio documents | Shared-tier structure |

Every thematic rule is labeled P0, P1, or P2 even though the document remains organized by engineering concern. The separate Rust checklist is organized directly by P0/P1/P2.

## Quick Reference Map

| Rust section | Existing trio role | Tier |
|---|---|---|
| `1. OVERVIEW` | Lookup scope and links to detailed docs | Shared-tier structure |
| `2. COMPLETE RUST BOUNDARY MODULE TEMPLATE` | Complete file/template first | Rust-specific |
| `3. NAMING CHEAT SHEET` | Compact naming table | Shared-tier role; Rust-specific syntax |
| `4. SECTION ORDERING` | Standard file/module order | Shared-tier role |
| `5. BOUNDARY TYPE AND SIGNATURE PATTERNS` | Common language-signature patterns | Rust-specific |
| `6. COLLECTION AND CONVERSION PATTERNS` | Standard-library/type patterns | Rust-specific |
| `7. IMPORT, MODULE, AND EXPORT TEMPLATES` | Import/export recipes | Shared-tier role; Rust-specific syntax |
| `8. ERROR AND PANIC MAPPING` | Error-handling recipes | Rust-specific |
| `9. RUSTDOC TEMPLATE` | Public-documentation template | Shared-tier role; Rust-specific syntax |
| `10. CARGO AND BUILD QUICK REFERENCE` | Compiler/build commands | Rust-specific |
| `11. DETERMINISM, PARITY, AND COMMON RECIPES` | Common one-liners plus repository-critical recipes | Rust-specific |
| `12. RELATED RESOURCES` | Links to sibling trio documents | Shared-tier structure |

This keeps the quick reference at the established twelve-section shape. [SOURCE: iteration-008:97-115]

## Interop and Build Placement

| Content | Placement |
|---|---|
| JS-visible naming, DTO shapes, owned conversions, boundary module style | `references/rust/style_guide.md` |
| napi-rs/WASM/WASI correctness, ABI policy, panic/error mapping, Cargo features, platform matrix, parity gates | `references/rust/quality_standards.md` |
| Binding templates, deterministic snippets, Cargo/build/test commands | `references/rust/quick_reference.md` |
| P0/P1/P2 evidence and review enforcement | `assets/checklists/rust_checklist.md` |
| Language-neutral parity-contract definitions | Existing `references/shared/universal_patterns.md` |
| General module/test-directory organization | Existing `references/shared/code_organization.md` |

Do not create a new shared interop file. napi-rs, wasm-bindgen, WASI, Cargo, ownership, and unsafe mechanics remain in the Rust trio. Only language-neutral contract vocabulary and cross-language differential-testing principles belong in `references/shared/`. [SOURCE: iteration-008:127-157] [SOURCE: iteration-008:180-196]

# Deliverable 4 — Gate Plan

Run all commands from the repository root after phase 002 creates the Rust files and completes every registration edit.

## 1. Parent-Hub Drift Guard

```bash
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
```

Green means:

- Vitest exits `0`.
- Every routed Rust path exists.
- The Rust child map is non-empty.
- The child `RUST` trio appears in the parent map with exactly one `code-opencode/` prefix.
- `rust_checklist.md` appears in child and parent `CODE_QUALITY`.
- Parent resources equal the re-prefixed child union plus the fixed parent-owned allowlist.
- No Rust reference or checklist is orphaned.
- No unrelated parent-only resource is introduced.

This is the actual parent/child union guard. [SOURCE: `.opencode/skills/sk-code/shared/references/smart_routing.md:297-301`] [SOURCE: `sk-code-router-sync.vitest.ts:144-192`]

## 2. Deterministic Skill-Benchmark Router Replay

Regenerate Mode A:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/sk-code/code-opencode \
  --outputs-dir .opencode/skills/sk-code/code-opencode/benchmark/router-mode-a \
  --trace-mode router
```

Fail closed on the generated report:

```bash
node -e '
const r = require("./.opencode/skills/sk-code/code-opencode/benchmark/router-mode-a/skill-benchmark-report.json");
const allPassed = r.funnel?.passed === r.coverage?.scored;
if (
  r.verdict !== "PASS" ||
  r.gate?.gateFailed ||
  r.gate?.d5Score !== 100 ||
  !allPassed
) {
  console.error(JSON.stringify({
    verdict: r.verdict,
    gate: r.gate,
    funnel: r.funnel,
    coverage: r.coverage
  }, null, 2));
  process.exit(1);
}
'
```

Green means:

- Report `verdict` is `PASS`.
- `gate.gateFailed` is false.
- D5 connectivity is `100`.
- Every scored scenario passes.
- `OC-004` selects intent `RUST`.
- `OC-004` returns exactly the Rust trio.
- `.rs`, Cargo-only, napi-rs, wasm-bindgen, and WASI fixtures select Rust.
- Rust-plus-TypeScript parity fixtures retain both language slices.
- No existing TypeScript, Python, or Shell scenario regresses.
- Generated JSON and Markdown reports are reviewed.

The benchmark process exiting `0` is not sufficient; the orchestrator can write a failing report and still return success. [SOURCE: `run-skill-benchmark.cjs:208-218`] [SOURCE: iteration-009:30-48]

## 3. Stack-Folder and Alignment Verification

Run the existing scripts through their supported invocation documented in the surface; at minimum, phase 002 must execute the concrete files:

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py
```

```bash
python3 .opencode/skills/sk-code/code-opencode/assets/scripts/test_verify_alignment_drift.py
```

Green means:

- Both commands exit `0`.
- `references/rust/` is a known language folder.
- `.rs` files are discovered as Rust.
- Rust alignment fixtures dispatch to Rust checks.
- Existing language discovery remains green.

These checks supplement, but do not replace, the three packet-level completion gates.

## 4. Strict Phase Validation

The owning implementation phase is named by the phase-parent contract:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/sk-code/018-rust-standards-for-code-opencode/002-upgrade \
  --strict
```

Also validate the phase parent after phase metadata is reconciled:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/sk-code/018-rust-standards-for-code-opencode \
  --strict
```

Green means:

- Each command exits `0`.
- Phase 002 contains its required spec documents and generated metadata.
- Checklist evidence records the drift guard and router replay results.
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, continuity metadata, and parent phase status agree.
- No placeholder, evidence, command-parity, metadata, or continuity-freshness error remains.
- The parent identifies `002-upgrade/` as completed only after all implementation gates pass.

The phase parent explicitly names `002-upgrade/` and requires drift guard, router replay, and strict validation before completion. [SOURCE: `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/spec.md:99-116`]

---

## Non-Goals Honored

- No Rust was written, no crate scaffolded, no skill source modified — all deferred to phase `002-upgrade/`.
- No live Rust-vs-TypeScript benchmarking (owned by the rewrite-research packets `system-code-graph/011`, `system-skill-advisor/013`, `system-speckit/030`).

## Handoff to Phase 002 (`002-upgrade/`)

Deliverable 2 (Upgrade Manifest) + Deliverable 4 (Gate Plan) are the mechanical input. Recommended apply order:

1. Create the 5 new files (Rust trio + `rust_checklist.md` + playbook `004-rust-standards.md`).
2. Edit `code-opencode/SKILL.md` — detection (`.rs` + `Cargo.toml`/`Cargo.lock`), `RUST` `INTENT_SIGNALS`, `RUST` `RESOURCE_MAP`, `CODE_QUALITY` checklist registration, and the surface non-negotiable.
3. Add the re-prefixed parent `RUST` union entry in **`shared/references/smart_routing.md`** (NOT `sk-code/SKILL.md`) + parent `CODE_QUALITY`.
4. Update the registration touchpoints: `shared/references/stack_detection.md`, `hub-router.json`, `verify_stack_folders.py` (`KNOWN_LANGUAGES`), `verify_alignment_drift.py` (+ its test), `router-replay.cjs` (+ fixtures), and the shared trio (`universal_patterns.md`, `code_organization.md`).
5. Run the 4-part gate plan (drift-guard vitest → skill-benchmark router replay with fail-closed JSON assertion → stack-folder/alignment verifiers → `validate.sh --strict`).

**Multi-language routing note (from Deliverable 2B):** the current "one language trio per task" wording is first-match-only; a napi-rs/WASM parity task legitimately touches both Rust and TypeScript, so phase 002 must allow a *touched-language set* rather than a single winner. This is a behavior change to reconcile, not just an additive entry.

## Evidence Discipline

Every finding in the round files carries `[SOURCE: path:line]` (repo) or `[SOURCE: url]` (external Rust docs). External Rust claims derive from the model's knowledge of canonical sources (Rust API Guidelines, rustfmt, Clippy, napi.rs, the wasm-bindgen book); repo claims were read directly by the agents and the load-bearing subset re-verified by Claude (§3). Confirmed-vs-inferred is stated where it matters; the interop/parity framing invariant is applied to every Rust recommendation.
