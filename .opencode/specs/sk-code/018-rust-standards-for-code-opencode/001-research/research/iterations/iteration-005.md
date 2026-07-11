<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 5 angle A5 — Determinism/parity + async + unsafe -->

I’ll ground the round in the repository’s actual TypeScript parity and native-module conventions, then verify each Rust recommendation against canonical documentation. This is read-only research; no spec-folder write path is needed.
The required memory trigger lookup timed out, so no stored context is being treated as evidence. Skill routing uses the explicit deep-research round plus the runtime’s `sk-code` recommendation; I’m loading both the deep-research method and the `code-opencode` surface rules before inspecting repository files.
The packet confirms A5 is specifically the byte-stability round and that no Rust or skill source may be changed. The first repository search also shows no checked-in Rust yet, so the standard must preserve existing TypeScript behavior at future native boundaries rather than normalize behavior after migration.
## Round 5 — A5: Determinism/Parity, Async, and Unsafe

### Contract Baseline

**Confirmed repo behavior:** Rust must reproduce multiple existing TypeScript contracts, not one generic “six-decimal” policy:

- Symbol BM25 returns numeric scores produced through `Number(value.toFixed(6))`, then ranks by rounded score, file path, start line, and symbol ID. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:303-328]
- Skill-advisor shadow scores use `Math.round(value * 1_000_000) / 1_000_000`, followed by score-descending and skill-ID tie-breaking. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:315-343]
- Code-graph candidate selection uses a complete comparator chain ending in symbol ID and describes the fallback as deterministic file ordering. [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:357-378]
- Stable IDs are SHA-256 over explicitly delimited canonical fields, truncated to a specified hexadecimal length. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:111-121]
- The research packet makes byte-for-byte determinism, six-decimal scores, stable tie-breaking, and deterministic IDs mandatory for every Rust recommendation. [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/research/deep-research-strategy.md:7-17]

**Inferred standard consequence:** “Equivalent numeric result” is insufficient. Each migrated path needs a named parity function and shared golden vectors because the repository currently uses at least two different rounding algorithms.

### Float Formatting and Quantization

#### Fixed-six textual output

**Confirmed external behavior:** Rust floating-point precision syntax prints exactly the requested number of digits after the decimal point; `format!("{value:.6}")` therefore produces fixed-six text. Rust formatting uses round-half-to-even and is locale-independent. [SOURCE: https://doc.rust-lang.org/std/fmt/]

**Non-negotiable:** Use `format!("{value:.6}")` only where the contract is explicitly a fixed-width textual field. It must not silently replace either repository numeric-rounding idiom.

The distinction matters:

- `format!("{value:.6}")` returns text and preserves trailing zeroes.
- `Number(value.toFixed(6))` returns a JavaScript number, discarding textual zero padding.
- Rust fixed formatting uses half-even rounding, while ECMAScript `toFixed` specifies its own decimal-selection algorithm and tie behavior. [SOURCE: https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.tofixed]
- The repository’s `Math.round(value * 1_000_000) / 1_000_000` contract is yet another operation. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:341-343]

**Required implementation design:** define separate pure-core helpers corresponding to the actual TypeScript operations, for example conceptually `quantize_like_js_to_fixed_6` and `quantize_like_js_math_round_6`. Each helper requires cross-language golden tests covering exact halfway values, adjacent representable values, negative values, `-0.0`, large magnitudes, and non-finite inputs.

#### Shortest-round-trip formatting

**Confirmed external behavior:** `ryu` converts binary floating-point values to short decimal strings, but its documented formatting choices can differ even from Rust standard-library formatting, including scientific-notation selection. [SOURCE: https://docs.rs/ryu/latest/ryu/]

ECMAScript `Number::toString` separately specifies decimal selection, tie resolution, and fixed-versus-exponential rendering thresholds. [SOURCE: https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring]

**Non-negotiable:** Do not claim that `ryu`, `f64::to_string`, or `serde_json` reproduces JavaScript `Number` serialization byte-for-byte merely because each provides shortest-round-trip output. Use one only after exhaustive parity fixtures against the supported Node runtime. If exact JavaScript spelling remains required and parity is unproven, keep final number-to-text serialization in TypeScript.

#### Non-finite values and floating-point operations

**Confirmed external behavior:** `f64::total_cmp` supplies a total order across ordinary values, signed zeroes, infinities, and NaNs; many transcendental `f64` operations have explicitly unspecified precision that can vary by platform or Rust version. [SOURCE: https://doc.rust-lang.org/std/primitive.f64.html#method.total_cmp]

**Non-negotiable:**

- Reject non-finite scores before quantization, sorting, hashing, or FFI return unless the TypeScript contract explicitly defines their encoding.
- Use `total_cmp` when an internal collection genuinely permits all `f64` values.
- Do not treat `total_cmp`’s ordering of `-0.0` and NaN payloads as JavaScript parity. Normalize or reject those values according to the boundary contract.
- Avoid platform-variable transcendental operations in byte-parity paths unless their results are quantized and proven through cross-target golden tests.
- Do not introduce `mul_add` opportunistically: fused and unfused arithmetic can round differently. [SOURCE: https://doc.rust-lang.org/std/primitive.f64.html#method.mul_add]

### Sorting and Total Orders

**Confirmed external behavior:** Rust `slice::sort` is stable, preserving the relative order of equal elements; `sort_unstable` does not preserve it. Comparator implementations must define a valid order. [SOURCE: https://doc.rust-lang.org/std/primitive.slice.html#method.sort] [SOURCE: https://doc.rust-lang.org/std/primitive.slice.html#method.sort_unstable]

**Confirmed repo behavior:** Observable ranking already uses explicit comparator chains such as score descending, file path, start line, and symbol ID. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:323-328] Candidate generation similarly breaks equal-confidence ties by source skill ID. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:41-59]

**Non-negotiable:**

1. Every observable Rust sort must define a complete key chain ending in a deterministic unique key.
2. Never use “stable sort preserves input order” as the final tie-break. Input may originate from a hash table, filesystem scan, SQLite query without `ORDER BY`, libuv scheduling, or Rayon work completion.
3. Prohibit `sort_unstable*` for parity-visible output. It may be used for private scratch data only when equal-item order is provably unobservable.
4. For floats, use `total_cmp` or reject non-finite values before comparison; never use `partial_cmp(...).unwrap()`.
5. Preserve the TypeScript string-comparison contract explicitly. Rust `str::cmp` is an ordinal Unicode-scalar comparison, while repository comparators currently call JavaScript `localeCompare`. Therefore, Rust and TypeScript must share an ASCII/bytewise canonical comparator or prove equivalence over the permitted identifier alphabet. This equivalence is currently **inferred, not confirmed**. [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:363-369]
6. Golden parity tests must shuffle the same input repeatedly and assert identical output bytes. This catches hidden dependence on input order.

### Maps, Sets, IDs, and Serialization Order

**Confirmed external behavior:** `std::collections::HashMap` uses a randomly seeded default hasher, and its iterators visit entries in arbitrary order. [SOURCE: https://doc.rust-lang.org/std/collections/struct.HashMap.html]

`IndexMap` provides a consistent order determined by insertion and removal history, not hash values. [SOURCE: https://docs.rs/indexmap/latest/indexmap/map/struct.IndexMap.html]

**Non-negotiable:**

- Use `BTreeMap`/`BTreeSet` when canonical key order is the desired output order.
- Use `IndexMap` only when insertion order is itself part of the contract and produced deterministically.
- A fixed hasher does not by itself define a canonical serialization order. It is acceptable only for internal lookup, followed by explicit sorting before any observable output.
- Never serialize, hash, generate IDs from, or return an iterator directly from `HashMap`/`HashSet`.
- Canonicalize object keys before JSON encoding whenever byte equality matters.
- Preserve exact hash input framing, algorithm, encoding, and truncation. The current symbol-ID contract is UTF-8 SHA-256 over `filePath::fqName::kind`, truncated to 16 hexadecimal characters. [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:111-116]
- Add ambiguity tests for delimiter-containing fields. **Inferred risk:** concatenation with `::` is deterministic but is not structurally collision-free if fields can contain the delimiter; Rust must preserve the existing algorithm for parity rather than “improve” it unilaterally.

### Integer and Overflow Semantics

**Confirmed external behavior:** ordinary integer overflow can panic when overflow checking is enabled, while Rust exposes explicit checked, wrapping, saturating, and overflowing operations. [SOURCE: https://doc.rust-lang.org/reference/expressions/operator-expr.html#overflow] [SOURCE: https://doc.rust-lang.org/std/primitive.u64.html#method.checked_add]

**Non-negotiable:**

- Do not let release-profile `overflow-checks` determine production semantics.
- Use `checked_*` for lengths, offsets, scores, counts, buffer sizes, FFI conversions, and ID components; convert failure to a typed boundary error.
- Use `wrapping_*` only where modulo arithmetic is the named algorithm, such as a specified hash primitive.
- Use `saturating_*` only where clamping is explicitly the TypeScript contract.
- Use `TryFrom` for narrowing conversions rather than `as`.
- At Node/WASM boundaries, validate integers against the existing JavaScript representation and schema before conversion. Do not expose a Rust integer wider than the TypeScript contract and assume napi-rs or wasm-bindgen will preserve it unchanged.
- Set `overflow-checks = true` for release parity builds as defense in depth, but retain explicit arithmetic semantics in code.
- Rust formatting is locale-independent, so numeric protocol output must use standard formatting or a contract-specific formatter, never locale-aware libraries. [SOURCE: https://doc.rust-lang.org/std/fmt/#localization]

### Async and Parallelism

#### Default architecture

**Non-negotiable:** Keep parsing, scoring, ranking, hashing, canonicalization, and serialization preparation in a synchronous pure-core crate. Async belongs at the host boundary, not in the deterministic algorithm.

#### napi-rs

**Confirmed external behavior:** napi-rs `AsyncTask` runs `Task::compute` on a libuv worker and `resolve` on the JavaScript main thread; JavaScript values cannot be created during `compute`. [SOURCE: https://napi.rs/docs/concepts/async-task]

Use `AsyncTask` when a measured CPU-bound pure-core operation would block Node materially. Marshal owned DTOs before `compute`, perform deterministic synchronous work there, then convert the completed DTO in `resolve`.

Do not add Tokio merely to return a JavaScript `Promise`. `AsyncTask` already provides the Node boundary’s scheduling and Promise shape.

#### Tokio

Use Tokio only for a Rust-owned sidecar that performs substantial asynchronous I/O, or for a native module whose Rust implementation must coordinate genuinely asynchronous Rust I/O. Tokio warns that CPU-heavy work inside futures can prevent executor progress; its blocking pool has a large default limit, and it recommends bounding CPU work or considering Rayon. [SOURCE: https://docs.rs/tokio/latest/tokio/task/fn.spawn_blocking.html]

**Inferred standard consequence:** A napi-rs addon should not stack Tokio’s blocking pool beneath libuv by default. That introduces two schedulers, harder cancellation, and oversubscription without improving deterministic core logic.

#### Rayon

Rayon is data-parallel work-stealing infrastructure, not an async-I/O runtime. [SOURCE: https://docs.rs/rayon/latest/rayon/]

Use Rayon only after benchmarks show that a sufficiently large batch amortizes scheduling and FFI costs. Parallel workers may compute independent items, but final collection, deduplication, floating-point accumulation, and sorting must be canonicalized synchronously. Parallel floating-point reduction is forbidden in parity paths unless a fixed reduction tree is specified and golden-tested.

#### WASM

`wasm-bindgen-futures` bridges Rust futures and JavaScript Promises; exporting an async Rust function produces a Promise, but that alone does not provide CPU parallelism. [SOURCE: https://rustwasm.github.io/docs/wasm-bindgen/reference/js-promises-and-rust-futures.html]

Default WASM modules to synchronous deterministic computation. Use Promise/Future bridging only for actual asynchronous JavaScript APIs. Rayon on non-threaded targets has limited support, so it must not be assumed available or beneficial for the baseline WASM artifact. [SOURCE: https://docs.rs/rayon/latest/rayon/#targets-without-threading]

### Unsafe Discipline

**Confirmed external guidance:** Unsafe blocks should be small and enclosed behind safe abstractions. Rust convention uses `SAFETY` comments to state the obligations of unsafe functions and why each unsafe operation satisfies them. [SOURCE: https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html]

Rust 2024 warns on unsafe operations inside an `unsafe fn` unless each operation is enclosed in an explicit unsafe block. [SOURCE: https://doc.rust-lang.org/edition-guide/rust-2024/unsafe-op-in-unsafe-fn.html]

**Non-negotiable:**

- Pure core: `#![forbid(unsafe_code)]` by default.
- Boundary crate: unsafe is allowed only where required by FFI, raw buffers, or a measured zero-copy implementation.
- Every unsafe block requires an adjacent `// SAFETY:` comment naming pointer validity, length, alignment, initialization, aliasing, lifetime, thread-affinity, and ownership assumptions relevant to that block.
- Every unsafe block requires a test that executes the operation and at least one test that challenges its preconditions.
- Enable `#![deny(unsafe_op_in_unsafe_fn)]`.
- Keep unsafe in the smallest private module and expose a safe typed API to the pure core.
- No performance-motivated unsafe without benchmark evidence and parity tests against the safe implementation.
- Panics must not cross the Node/WASM boundary; boundary code must convert failures into the established error envelope.

Miri is an official dynamic undefined-behavior detector and can run test suites, but it tests only executed paths and does not prove soundness. [SOURCE: https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html#using-miri-to-check-unsafe-code] Miri also lacks support for most real FFI, so CI must run it over the pure core and any independently testable unsafe wrappers, while napi-rs/WASM boundary behavior needs native integration tests. [SOURCE: https://github.com/rust-lang/miri]

### Encode-this

- **(style_guide)** Define separate Rust helpers for JS `toFixed(6)`-style numeric quantization, JS `Math.round(*1e6)/1e6`, and fixed-six textual formatting; never substitute one for another. Contract: **six-decimal score parity**.
- **(quality_standards)** Require Node-vs-Rust golden vectors for halfway values, adjacent floats, negative zero, non-finite values, and serialization spelling. Contract: **byte-for-byte float parity**.
- **(quality_standards)** Forbid claims that `ryu`, `f64::to_string`, or `serde_json` matches JavaScript shortest formatting without exhaustive runtime fixtures. Contract: **structured-JSON byte parity**.
- **(style_guide)** Require observable sorts to use an explicit total-order key ending in a deterministic unique ID; never rely on input order or sort stability. Contract: **stable ranking/tie-break parity**.
- **(checklist)** Reject `partial_cmp(...).unwrap()` in parity paths; require finite-value validation or `total_cmp` plus an explicit NaN/signed-zero policy. Contract: **score-order parity**.
- **(style_guide)** Prohibit `HashMap`/`HashSet` iteration from reaching serialized output, hashes, IDs, or FFI results; use `BTreeMap`, deterministic `IndexMap`, or collect-and-sort. Contract: **observable-order parity**.
- **(quick_reference)** Preserve exact ID hash inputs, delimiters, UTF-8 encoding, algorithm, lowercase hex encoding, and truncation length. Contract: **deterministic-ID parity**.
- **(quality_standards)** Use explicit `checked_*`, `wrapping_*`, or `saturating_*` arithmetic according to the named contract; enable release overflow checks as defense in depth. Contract: **cross-build integer parity**.
- **(style_guide)** Keep the pure core synchronous and deterministic; use napi-rs `AsyncTask` only at the Node boundary, Tokio only for genuine Rust-owned async I/O, and Rayon only for benchmark-proven batch CPU work with canonical finalization. Contract: **Node responsiveness without ranking drift**.
- **(quality_standards)** Forbid parallel floating-point reductions unless the reduction tree is fixed and cross-target golden-tested. Contract: **six-decimal score parity**.
- **(style_guide)** Apply `#![forbid(unsafe_code)]` to the pure core and `#![deny(unsafe_op_in_unsafe_fn)]` to boundary crates.
- **(checklist)** Require every unsafe block to have an adjacent `// SAFETY:` invariant, an exercising test, bounded safe abstraction, Miri coverage where supported, and native napi-rs/WASM integration coverage where Miri cannot execute FFI. Contract: **FFI memory-safety and boundary integrity**.
