<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 1 angle A1 — Core idioms & API design -->

I’ll run this as a read-only deep-research round, grounding repo claims in files actually read and external claims in canonical Rust, napi-rs, and wasm-bindgen documentation. No repository files will be modified.
Skill routing: user explicitly requested a deep-research pass; the advisor also routes to `system-deep-loop` research mode and `sk-code` above threshold. The memory trigger lookup timed out, so I’m retrying it while loading both workflow contracts before inspecting evidence.
The memory service timed out on all three bounded attempts, so no continuity context is available from it. The loaded deep-research contract normally requires command-owned state files, but this request explicitly asks for one output-only round; I will not silently create a research packet and will instead perform the requested single read-only iteration, with repo claims limited to directly inspected evidence.
The repository already has the exact research packet at `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/`; its charter confirms this is A1 and defines the napi/WASM plus deterministic-parity framing. I’m now anchoring recommendations against that packet, the live TypeScript ranking code, and the existing `code-opencode` language-document structure before checking canonical external guidance.
## Round 1 - A1: Core Idioms & API Design

### Repository Ground Truth

**Confirmed.** This round is research-only and specifically covers ownership, `Result`, `thiserror`/`anyhow`, newtypes, builders, conversions, workspace layout, and the Rust API Guidelines. Rust must target napi-rs/WASM/sidecar integration with the existing TypeScript backend, preserving six-decimal values, stable tie-breaks, deterministic IDs, and byte-level output parity. [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:64] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:70] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:180]

**Confirmed.** These are active implementation contracts, not hypothetical style preferences:

- Advisor weights and scores are explicitly rounded to six decimals. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:152] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:701]
- Advisor ordering uses score, RRF rank or confidence, then lexical skill ID as the terminal tie-break. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:727]
- Code-graph result ordering uses explicit multi-field comparators ending in symbol ID. [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:357]
- BM25 candidates are rounded to six decimals and sorted by score, file path, line, and symbol ID. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:303]
- Symbol IDs are the first 16 hexadecimal characters of SHA-256 over `filePath + "::" + fqName + "::" + kind`. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:111]

### Ownership and FFI-Facing APIs

**Confirmed externally.** napi-rs owned primitive conversions such as `String`, integers, and floats copy values into Rust-owned data, while JavaScript handle wrappers and borrowed slices remain tied to a Node-API scope. Borrowed buffer views cannot cross asynchronous boundaries; owned wrappers or copies can. [SOURCE: https://napi.rs/docs/concepts/understanding-lifetime]

**Confirmed externally.** A napi-rs `#[napi(object)]` is an owned plain-object shape cloned from JavaScript, and mutations to that Rust value do not mutate the original object. [SOURCE: https://napi.rs/docs/concepts/values]

**Confirmed externally.** wasm-bindgen can export owned generated class values and references to those classes, but this is a wrapper-managed JavaScript class model rather than a general mechanism for exposing arbitrary Rust lifetime parameters. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/exported-rust-types.html]

**Inferred rule to encode.**

- Exported napi and WASM functions MUST accept and return owned, materialized DTOs: `String`, `Vec<T>`, numbers, booleans, boundary structs, and `Result<OwnedOutput, BoundaryError>`.
- Exported DTOs MUST NOT contain borrowed fields such as `&str`, `&[T]`, or `Cow<'a, T>`, and exported function signatures MUST NOT expose user-visible lifetime parameters.
- The pure core MAY use borrowing internally, for example `fn rank(input: &RankRequest) -> Result<RankResponse, CoreError>` or helpers over `&str` and slices. The adapter owns conversion into and out of that core call.
- Zero-copy napi views are an explicit synchronous optimization exception, not the default API style. They require a documented scope, no async/thread escape, and parity tests against the owned path. [SOURCE: https://napi.rs/docs/concepts/understanding-lifetime]
- Do not expose Rust builders, iterator objects, borrowed views, or internal graph references to JavaScript. Materialize the final DTO before crossing either boundary.
- Treat the owned DTO boundary as part of the deterministic ABI: field names, optional-value representation, number representation, collection order, and error shape require napi/WASM/TypeScript golden parity tests.

This deliberately spends one allocation or conversion at the boundary to keep ownership, lifetime, and serialization behavior identical across both transports. Optimizing that copy is subordinate to the repository's parity contract.

### Error Architecture

**Confirmed externally.** Public library errors should implement `std::error::Error`, `Display`, `Debug`, and normally `Send + Sync`; `()` is not an appropriate public error type. [SOURCE: https://rust-lang.github.io/api-guidelines/interoperability.html#c-good-err]

**Confirmed externally.** `thiserror` derives standard `Error`, `Display`, `source`, and `From` implementations without becoming part of the public API contract itself. Its documentation explicitly points to `anyhow` as the convenient error type for application code. [SOURCE: https://docs.rs/thiserror/latest/thiserror/]

**Confirmed externally.** `anyhow` is a trait-object-based error type intended for application-level error propagation and contextual diagnostics. [SOURCE: https://docs.rs/anyhow/latest/anyhow/]

**Confirmed externally.** napi-rs turns `napi::Result<T>` failures into synchronous exceptions or Promise rejections. It supports custom stable error codes, while automatic `anyhow::Error` conversion produces `GenericFailure`; its own guidance says to map explicitly when callers need stable machine-readable codes or structured causes. [SOURCE: https://napi.rs/docs/concepts/error-handling]

**Confirmed externally.** wasm-bindgen exports `Result<T, E>` when `T` is convertible to JavaScript and `E: Into<JsValue>`; `Err` becomes a JavaScript exception. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html]

**Inferred rule to encode.**

```rust
#[derive(Debug, thiserror::Error)]
pub enum CoreError {
    #[error("invalid score for {field}")]
    InvalidScore { field: &'static str },

    #[error("invalid identifier: {value}")]
    InvalidId { value: String },

    #[error("ranking input is empty")]
    EmptyInput,
}
```

- Pure-core public functions MUST return `Result<T, CoreError>` or a similarly domain-specific `thiserror` type.
- Error variants MUST carry structured context needed by both wrappers, but MUST NOT carry napi, wasm-bindgen, `JsValue`, or Node environment types.
- `anyhow::Result` MUST NOT appear in pure-core public APIs or exported napi/WASM functions.
- `anyhow` MAY be used in a sidecar `main`, CLI orchestration, build tooling, or the outermost non-ABI application layer where contextual diagnostics matter more than machine-readable variants.
- Each adapter MUST contain one exhaustive conversion from `CoreError` to its boundary representation:
  - napi: stable code, stable message, and preserved cause where applicable.
  - WASM: an explicitly constructed JavaScript error value carrying the same stable code and message.
- The TypeScript-facing `code`, `message`, sync-throw versus Promise-rejection behavior, and failure category MUST be parity-tested across napi and WASM. napi-rs specifically requires testing JavaScript error shape rather than only the Rust `Result`. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- Recoverable input, conversion, and parity failures return `Err`; panics are reserved for violated internal invariants. napi-rs warns that uncaught synchronous panics may terminate the process. [SOURCE: https://napi.rs/docs/concepts/error-handling]

### Newtypes and Conversions

**Confirmed externally.** Newtypes provide zero-cost static distinctions between values with the same underlying representation. [SOURCE: https://rust-lang.github.io/api-guidelines/type-safety.html#c-newtype]

**Confirmed externally.** `From` is for infallible, lossless, value-preserving, obvious conversions; fallible conversions belong in `TryFrom`. Implementing `From` automatically supplies `Into`, and implementing `TryFrom` supplies `TryInto`. [SOURCE: https://doc.rust-lang.org/std/convert/trait.From.html] [SOURCE: https://doc.rust-lang.org/std/convert/trait.TryFrom.html]

**Inferred rule to encode.**

- Use newtypes for values whose representation is primitive but whose parity semantics are not:
  - `SymbolId(String)` for the deterministic SHA-256-derived ID contract.
  - `SkillId(String)` where identifier validation differs from arbitrary text.
  - `Score(f64)` or `FiniteScore(f64)` where construction must reject non-finite values and centralize six-decimal normalization.
  - `Rank(usize)` where zero-based versus one-based meaning would otherwise be ambiguous.
- Keep newtype fields private and validate through constructors or `TryFrom`.
- Use `From` only when conversion cannot fail or alter meaning.
- Use `TryFrom<BoundaryDto>` for JavaScript-to-core validation, including finite-number checks, integer range checks, enum validation, and ID normalization.
- Implement `From<CoreResponse> for BoundaryResponse` only when serialization cannot fail.
- Never implement `Into` or `TryInto` directly; implement their reciprocal traits. [SOURCE: https://rust-lang.github.io/api-guidelines/interoperability.html#c-conv-traits]
- At the JS boundary, serialize newtypes to the existing primitive representation. Do not expose wrapper objects that would change the TypeScript API or JSON bytes.
- The ID newtype MUST preserve the exact current hash input order, separators, SHA-256 encoding, truncation length, and lowercase hexadecimal output. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:111]

### Builders and Type-State

**Confirmed externally.** Builders are appropriate for complex construction involving many inputs, optional configuration, compound values, or multiple flavors. Required inputs belong in the builder constructor; configuration methods should chain; a terminal method builds the result. Non-consuming builders are preferred when construction does not require ownership transfer. [SOURCE: https://rust-lang.github.io/api-guidelines/type-safety.html#c-builder]

**Inferred rule to encode.**

- Use a builder only for complex core configuration, not for every DTO.
- Do not export a Rust builder through napi or wasm-bindgen. JavaScript supplies one complete options DTO; the wrapper validates it and constructs the core builder internally.
- Builder terminal methods that validate configuration MUST return `Result<T, CoreError>`.
- Type-state is justified only when it prevents a real invalid core transition, such as `Unloaded -> Loaded -> ReadyToQuery`, and the invalid state would otherwise threaten index, schema, or deterministic-output integrity.
- Do not use type-state for ordinary optional configuration or FFI DTO validation. Generic state parameters and `PhantomData` add no value at the JavaScript boundary and complicate two-wrapper parity.
- Type-state remains private to the pure core; wrappers expose a stable, non-generic operation or class surface.

### Crate and Workspace Layout

**Confirmed externally.** Cargo workspaces manage multiple packages together, share one lockfile and target directory, and allow common package metadata, dependencies, and lint policy at the workspace root. [SOURCE: https://doc.rust-lang.org/cargo/reference/workspaces.html]

**Confirmed repo constraint.** The intended implementation has two JavaScript-facing transports and a pure core, with no Rust or crate scaffolding permitted during this research phase. [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:70] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:105]

**Inferred rule to encode.**

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

- `core` owns algorithms, deterministic normalization, typed IDs, domain errors, and transport-neutral request/response types.
- `core` MUST NOT depend on `napi`, `napi-derive`, `wasm-bindgen`, `js-sys`, or Node/WASM runtime types.
- `napi` and `wasm` depend on `core`; neither adapter may reimplement ranking, rounding, sorting, hashing, or business validation.
- Each adapter owns only boundary DTO conversion, exported names, error translation, and transport-specific lifecycle concerns.
- Shared dependencies, edition, MSRV, lint policy, and release profile belong in the workspace root where practical. [SOURCE: https://doc.rust-lang.org/cargo/reference/workspaces.html]
- A sidecar, if later justified, is a fourth thin binary member over the same `core`, not a second implementation.

### API Guidelines to Encode

#### Naming

**Confirmed externally.** C-CASE requires `UpperCamelCase` for types and traits, `snake_case` for functions and modules, and `SCREAMING_SNAKE_CASE` for constants. Acronyms are words, so use `Uuid`, not `UUID`. [SOURCE: https://rust-lang.github.io/api-guidelines/naming.html#c-case]

**Rule.** Apply idiomatic Rust names inside all crates. Use napi/wasm rename attributes only where preserving the existing JavaScript/TypeScript export name requires camelCase. The Rust and JS names may differ; the emitted JS name is the compatibility contract.

**Confirmed externally.** C-CONV reserves `as_` for free borrowed views, `to_` for work or allocation, and `into_` for consuming conversion. [SOURCE: https://rust-lang.github.io/api-guidelines/naming.html#c-conv]

**Rule.** Name representation access according to actual cost and ownership. In particular, do not call an allocating boundary conversion `as_*`, and use `into_inner` for consuming a validated newtype.

**Confirmed externally.** C-GETTER omits `get_` for ordinary getters and uses `field()` / `field_mut()`. [SOURCE: https://rust-lang.github.io/api-guidelines/naming.html#c-getter]

**Rule.** Core getters follow Rust naming. JavaScript-visible names preserve the existing TypeScript API through adapter-specific renaming rather than contaminating core naming.

#### Common Traits and Serde

**Confirmed externally.** C-COMMON-TRAITS says crate-owned types should eagerly implement applicable traits including `Clone`, equality/order traits, `Hash`, `Debug`, `Display`, and `Default`. [SOURCE: https://rust-lang.github.io/api-guidelines/interoperability.html#c-common-traits]

**Rule.** Every public type derives `Debug`; DTOs normally derive `Clone` and `PartialEq`. IDs derive `Eq`, `Ord`, and `Hash`. Do not derive `Eq`, `Ord`, or `Hash` for raw `f64` score containers; compare normalized ranking keys with an explicit total-order policy. Trait derivation must support, not silently redefine, the TypeScript sort contract.

**Confirmed externally.** C-SERDE recommends `Serialize` and `Deserialize` for data structures and allows optional feature-gating. [SOURCE: https://rust-lang.github.io/api-guidelines/interoperability.html#c-serde]

**Rule.** Transport-neutral DTOs that participate in JSON/IPC parity derive Serde traits. Wire field names and enum representations must be explicit and frozen by golden tests. Serialization must not rely on `HashMap` iteration order; ordered output must be represented as sorted sequences or deterministic map types before serialization.

#### Future-Proofing

**Confirmed externally.** C-STRUCT-PRIVATE treats public fields as a strong representation commitment and recommends private fields except for passive C-style data structures. [SOURCE: https://rust-lang.github.io/api-guidelines/future-proofing.html#c-struct-private]

**Rule.** Core domain types use private fields. Boundary DTOs are the narrow exception because they are passive wire data; napi-rs additionally requires public fields for `#[napi(object)]`. Keep those DTOs in adapter modules and convert immediately into validated core types. [SOURCE: https://napi.rs/docs/concepts/values]

**Confirmed externally.** `#[non_exhaustive]` permits future fields or variants and forces downstream wildcard handling. [SOURCE: https://doc.rust-lang.org/reference/attributes/type_system.html#the-non_exhaustive-attribute]

**Rule.** Use `#[non_exhaustive]` only when downstream wildcard behavior is intentional. Do not apply it automatically to `CoreError` if exhaustive adapter matching is the compile-time alarm that forces every new error variant to receive a stable napi/WASM code. FFI wire enums require explicit unknown-value policy rather than relying on a Rust-only attribute.

**Confirmed externally.** C-SEALED protects traits intended only for crate-owned implementations. [SOURCE: https://rust-lang.github.io/api-guidelines/future-proofing.html#c-sealed]

**Rule.** Seal extension traits whose implementation affects hashing, ordering, rounding, or serialization. Do not expose open downstream implementation points that can produce values violating parity contracts.

#### Documentation

**Confirmed externally.** C-EXAMPLE calls for useful rustdoc examples on public items, applied within reason. C-FAILURE requires `# Errors`, `# Panics`, and `# Safety` sections where applicable. [SOURCE: https://rust-lang.github.io/api-guidelines/documentation.html#c-example] [SOURCE: https://rust-lang.github.io/api-guidelines/documentation.html#c-failure]

**Rule.**

- Every public core operation gets a compilable example demonstrating owned input and `Result` handling.
- Every fallible function documents exact error categories.
- Any panic condition documents the violated invariant.
- Examples use `?`, not `unwrap`. [SOURCE: https://rust-lang.github.io/api-guidelines/documentation.html#c-question-mark]
- FFI wrapper docs additionally state JavaScript error code, synchronous throw versus Promise rejection, ownership/copy behavior, and the parity contract protected.
- Deterministic operations document the complete comparator, rounding point, hash preimage, and serialization order rather than merely claiming “deterministic.”

### Encode-this

- **(style_guide)** Export owned DTOs across napi/WASM; keep borrowing and lifetimes internal to `core`. Contract: FFI ownership and async-lifetime safety.
- **(quality_standards)** `core` returns typed `thiserror` errors; only sidecar/application shells may use `anyhow`; adapters map every error to identical stable JS codes and messages. Contract: napi/WASM error-shape parity.
- **(quality_standards)** Keep `core` free of napi, wasm-bindgen, `JsValue`, and runtime environment types; adapters contain conversion only. Contract: two-transport behavioral parity.
- **(style_guide)** Use validated private-field newtypes for IDs, scores, and ranks; implement `From` only for infallible conversions and `TryFrom` for boundary validation. Contract: deterministic IDs and six-decimal scoring.
- **(quality_standards)** Centralize rounding, hashing, comparator chains, and output ordering in `core`; adapters MUST NOT duplicate them. Contract: byte-for-byte output parity.
- **(style_guide)** Builders and type-state stay core-internal; use them only for genuinely complex construction or invalid state transitions, never as the JavaScript API.
- **(quality_standards)** Workspace layout is `core` plus thin `napi` and `wasm` members, sharing one lockfile and workspace policy.
- **(checklist)** Verify exported structs contain no borrowed fields or public lifetime parameters.
- **(checklist)** Verify all boundary DTO conversions are owned, validated, and parity-tested in both adapters.
- **(checklist)** Verify score ordering uses the full TypeScript comparator and terminal lexical tie-break, not partial floating-point comparison. Contract: stable sort/tie-break parity.
- **(checklist)** Verify symbol-ID hash algorithm, preimage order, separators, truncation, and lowercase hex match TypeScript exactly. Contract: deterministic-ID parity.
- **(quick_reference)** Apply C-CASE, C-CONV, C-GETTER, C-COMMON-TRAITS, C-SERDE, C-STRUCT-PRIVATE, C-SEALED, C-EXAMPLE, and C-FAILURE; use `#[non_exhaustive]` only when wildcard evolution is intentional.
