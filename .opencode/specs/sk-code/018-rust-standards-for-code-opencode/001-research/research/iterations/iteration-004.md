<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 4 angle A4 — FFI/interop non-negotiables (double-weight) -->

I’ll inspect the repository’s deep-research contract and Rust/interop evidence, then verify external claims against canonical napi-rs, wasm-bindgen, and cxx documentation. This is a read-only research pass; no repository files will be modified.
The repository confirms an active research packet at `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research`, with A4 explicitly double-weighted and research-only. I’m grounding this round in its current strategy/state and the concrete TypeScript determinism implementations before resolving boundary-specific rules.
## Round 4 — A4: FFI / Interop Non-Negotiables

### Repository Contract

**Confirmed:** Rust is being evaluated only as a napi-rs/WASM/sidecar component behind the existing TypeScript/Node MCP backend. Its outputs must preserve six-decimal scores, stable ordering/tie-breaks, and deterministic IDs. [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/research/deep-research-strategy.md:7] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/research/deep-research-strategy.md:9-11]

**Confirmed:** Current TypeScript implementations round to six decimals, sort equal scores by stable string keys, and derive IDs from canonical SHA-256 inputs. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:320-342] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:303-328] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/code-graph-query-latency.bench.ts:59-76]

Therefore, every Rust boundary must be treated as a versioned protocol, not as an implementation detail. Rust must return the same JS-visible values, error shapes, ordering, and serialized bytes as TypeScript.

### 1. napi-rs Boundary

#### DTO and ABI Stability

- Export only a narrow adapter layer with `#[napi]`; keep algorithmic/domain types private. `#[napi(object)]` copies fields between Rust structs and JavaScript objects, so it is a DTO conversion, not shared object identity. [SOURCE: https://napi.rs/docs/concepts/object]
- Freeze each exported DTO’s JS property names, optionality, null/undefined behavior, number representation, and generated TypeScript declaration. Changing a Rust field type can be a JS API break even when Rust still compiles.
- Use fixed-width integers at the boundary. Never expose `usize`/`isize`: their width is target-dependent. Values beyond JavaScript’s safe integer range require an explicitly agreed `BigInt` or decimal-string representation.
- Do not expose Rust enums through incidental ordinal values. Export stable string discriminants or explicit numeric codes whose mapping is parity-tested.
- Use `Buffer`/typed arrays for binary or dense numeric payloads, not arrays of boxed JS numbers.
- Borrowed slices such as `&[u8]` and `BufferSlice<'env>` are zero-copy only for the synchronous callback lifetime. They must not escape or cross `await`. [SOURCE: https://napi.rs/docs/concepts/typed-array]
- Owned `Buffer` and typed-array wrappers can outlive the call, but JavaScript may retain and mutate their shared backing store. Their `Send`/`Sync` implementations do not synchronize bytes. Copy before worker-thread processing unless an explicit cross-language ownership protocol forbids concurrent access. [SOURCE: https://napi.rs/docs/concepts/typed-array]
- Returning `Vec<u8>.into()` may transfer its allocation without copying, but runtimes can reject external buffers and force a copy; Electron’s memory cage is one documented case. Zero-copy is therefore an optimization, never a semantic contract. [SOURCE: https://napi.rs/docs/concepts/typed-array]
- `BufferSlice::from_external` is unsafe and requires pointer validity, compatible layout, exactly-once cleanup, and correct behavior whether finalization occurs immediately after fallback copying or later during GC. It is prohibited without a documented ownership invariant and boundary test. [SOURCE: https://napi.rs/docs/concepts/typed-array]
- `External<T>` is an opaque Rust-owned handle that JavaScript can only pass back to Rust. Use it for large native state when JS must not inspect or serialize that state; never place values needed for deterministic persistence, worker transfer, or API output solely inside an `External<T>`. [SOURCE: https://napi.rs/docs/concepts/external]
- Never derive output order from `HashMap` iteration. Materialize and sort records by the exact TypeScript comparator before DTO conversion. This protects stable sort/tie-break and serialized-byte parity. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:336-342]

#### Error Propagation

- Every recoverable exported operation returns `napi::Result<T>`. napi-rs converts synchronous `Err` values into thrown JS errors and asynchronous `Err` values into Promise rejections. Argument-conversion failures can still throw synchronously before an async function creates its Promise. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- Define stable machine-readable error codes with a custom status type implementing `AsRef<str>`. `Status` is primarily a Node-API status taxonomy and is insufficient as the domain-error protocol. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- Freeze and parity-test `name`, `code`, `message`, `cause`, and whether failure is synchronous or a Promise rejection. TypeScript declarations do not encode thrown exceptions. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- Use `Env::throw_type_error` for invalid JS types, `throw_range_error` for valid types outside accepted bounds, and ordinary coded errors for domain failures. Return immediately after `throw_*`; further Node-API calls with a pending exception can replace or obscure it. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- Do not let `anyhow` formatting define the public error contract: its automatic conversion uses `GenericFailure` and formatted text. Map domain errors explicitly when callers branch on codes or inspect causes. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- `AsyncTask::reject` returning `Ok(fallback)` fulfills rather than rejects the Promise. Such recovery is allowed only when the TypeScript implementation has the identical fallback contract. [SOURCE: https://napi.rs/docs/concepts/error-handling]

#### Async and Threading

- Use `AsyncTask` for bounded CPU/blocking work on libuv’s worker pool. `Task::compute` runs off the JS thread; `resolve`, `reject`, and JS-value creation run on the JS thread. Never touch `Env`, scoped JS values, or raw `napi_value`s in `compute`. [SOURCE: https://napi.rs/docs/concepts/async-task]
- Use exported `async fn`/napi-rs Tokio support for genuinely asynchronous Rust operations. Do not introduce Tokio merely to wrap CPU work, and do not run blocking work on Tokio executor threads.
- Cancellation of `AsyncTask` is only reliable before libuv starts the task. Once started, cancellation does not guarantee computation stops. Cancellation behavior must therefore not affect deterministic state commits. [SOURCE: https://napi.rs/docs/concepts/async-task]
- JavaScript values are thread-affine. Native threads may invoke JS only through `ThreadsafeFunction`; its argument and result payloads must be `'static` owned Rust data. [SOURCE: https://napi.rs/docs/concepts/threadsafe-function]
- Prefer `CalleeHandled = true` so Rust failures reach an error-first JS callback. With `CalleeHandled = false`, native errors cannot cross through the callback, and a thrown JS exception can reach `napi_fatal_exception`. [SOURCE: https://napi.rs/docs/concepts/threadsafe-function]
- Bound `ThreadsafeFunction` queues. In non-blocking mode, handle `QueueFull`; in blocking mode, account for producer backpressure. Never let thread scheduling determine externally visible result order: attach deterministic sequence keys and reorder before emission. [SOURCE: https://napi.rs/docs/concepts/threadsafe-function]
- Weak thread-safe functions do not keep Node alive and do not guarantee queued callback delivery before exit. Do not use weak mode for required protocol results. [SOURCE: https://napi.rs/docs/concepts/threadsafe-function]

#### Panic Safety

- A panic is never an error channel. No reachable `unwrap`, `expect`, indexing panic, or assertion may depend on JS-controlled input.
- An uncaught panic in a synchronous generated callback can terminate Node. `#[napi(catch_unwind)]` converts an unwind panic to `GenericFailure`, but only under `panic=unwind`; it cannot catch aborting panics or prove state consistency. [SOURCE: https://napi.rs/docs/concepts/error-handling]
- Corrected safety statement: a Rust panic crossing a non-unwind C ABI boundary is guaranteed to abort safely; a foreign exception entering Rust through such a boundary is undefined behavior. It is not accurate to describe every escaping Rust panic as UB. [SOURCE: https://doc.rust-lang.org/nomicon/ffi.html#ffi-and-unwinding]
- Policy: use `Result` for all expected failures; apply `#[napi(catch_unwind)]` at every public export that can reach third-party or historically panic-prone Rust; convert the caught panic to a stable internal-error code; and perform no partial externally visible state mutation before the fallible section completes.
- `panic = "abort"` is acceptable only if deliberate whole-process termination is the documented invariant-failure policy. It is incompatible with `catch_unwind` recovery. [SOURCE: https://napi.rs/docs/concepts/error-handling]

#### Node-API Floor and Packaging

- Compile against the lowest Node-API level that supplies every used feature, encode the corresponding `napiN` feature and `engines.node`, and run blocking tests on the oldest claimed Node version. napi-rs currently offers levels 1-9 and defaults scaffolds to level 4; async features can raise the effective floor. [SOURCE: https://napi.rs/docs/more/support-compatibility]
- Keep the addon runtime floor separate from the build-tool floor: current `@napi-rs/cli` requires modern Node, but the produced addon may target older Node-API-compatible runtimes. [SOURCE: https://napi.rs/docs/more/support-compatibility]
- Node-API is ABI-stable across compatible Node releases only when the addon stays within Node-API. Direct V8, Node C++, and libuv APIs do not share that guarantee. [SOURCE: https://nodejs.org/api/n-api.html#implications-of-abi-stability]
- Therefore, do not use `node-abi` to produce one binary per Node major for a pure napi-rs addon. Build by Node-API level plus OS/architecture/libc. `node-abi`-style per-major artifacts become necessary only after violating the Node-API-only constraint.
- Prefer `@napi-rs/cli`’s platform-package model: root package plus exact-version optional packages such as `@scope/pkg-linux-x64-gnu` and `@scope/pkg-linux-x64-musl`. Each platform package declares `os`, `cpu`, and `libc`; the generated loader selects it. [SOURCE: https://napi.rs/docs/deep-dive/release]
- glibc and musl are distinct targets and packages. A Linux x64 build is not one universal Linux artifact. Test real or faithful glibc and musl environments, including the oldest claimed libc floor. [SOURCE: https://napi.rs/docs/more/support-compatibility]
- `prebuildify --napi` is a viable alternative that packages Node-API prebuilds, but it must not coexist with an independent napi-rs platform loader. Choose one packaging system. [SOURCE: https://github.com/prebuild/prebuildify#readme]
- Releases must gate artifact completeness before publishing the root package. napi-rs multi-package publication is non-atomic, and the root may otherwise reference a missing platform package. [SOURCE: https://napi.rs/docs/deep-dive/release]
- **Inferred repo baseline:** one MCP package currently pins Node `>=24 <25`; this does not establish a universal engine range for every MCP subsystem. A future addon must inherit its actual host package’s tested Node range rather than assume the range globally. [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/package.json:42-44]

### 2. wasm-bindgen / wasm-pack Boundary

#### DTO and ABI Stability

- Place `#[wasm_bindgen]` only on the narrow JS-facing adapter. Keep domain logic in ordinary Rust types and functions so native and WASM adapters can share parity-tested behavior. `#[wasm_bindgen]` controls exported JS functions and structs. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/attributes/on-rust-exports/index.html]
- Use direct wasm-bindgen scalar/string types for small stable signatures. Use `JsValue` plus `serde-wasm-bindgen::{from_value,to_value}` for structured DTOs. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/arbitrary-data-with-serde.html]
- Freeze the serializer configuration. `serde-wasm-bindgen` defaults include `None -> undefined`, maps -> JavaScript `Map`, byte buffers -> `Uint8Array`, and large integer behavior that differs from JSON. `Serializer::json_compatible()` changes several representations at once. [SOURCE: https://docs.rs/serde-wasm-bindgen/latest/serde_wasm_bindgen/]
- Never serialize a `HashMap` directly into parity-sensitive output. Its iteration order is unsuitable for byte-stable output, and the default adapter emits a JS `Map`. Convert to a sorted sequence or `BTreeMap`, with an explicit serializer configuration and golden JS-shape tests. [SOURCE: https://docs.rs/serde-wasm-bindgen/latest/serde_wasm_bindgen/]
- Do not use raw `JsValue` as an untyped protocol escape hatch. Deserialize immediately into a validated DTO and serialize from a canonical DTO so nullability, number widths, and map ordering remain testable.
- Wasm linear memory and JS memory are separate domains. Borrowed numeric slices are exposed through typed-array views of Wasm memory; those views are call/lifetime-sensitive and can be invalidated by memory growth. Treat arbitrary JS-to-Wasm payload transfer as potentially copying unless a reviewed explicit memory-view protocol proves otherwise. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/number-slices.html]
- `Vec<T>`/`Box<[T]>` conversions produce JS arrays or typed arrays according to element type. Their convenience conversion is not a license to assume stable zero-copy ownership. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/boxed-slices.html]

#### Error Propagation

- Export fallible functions as `Result<T, E>` where `E: Into<JsValue>`. `Ok` becomes the JS value and `Err` throws a JS exception. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html]
- Convert domain errors to a stable JS object/Error shape with fixed `name`, `code`, `message`, and optional structured details. Do not expose `Debug` output or Serde parser wording as protocol text.
- Imported JS functions that may throw must use `#[wasm_bindgen(catch)]` and return `Result`; otherwise JS exceptions are not represented as ordinary Rust errors. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html]
- Parity tests must execute the generated JS wrapper, not only Rust unit tests, because exception conversion and DTO serialization occur in generated glue.

#### Panic Safety

- Panics are not recoverable protocol errors. On `wasm32-unknown-unknown`, panic paths ultimately trap/abort rather than producing the required typed JS error. Avoid `unwrap`, unchecked indexing, and panic-based validation in exported call graphs. [SOURCE: https://rustwasm.github.io/docs/book/reference/code-size.html]
- Use `Result` at every fallible export. If a panic hook is installed for diagnostics, it must not be mistaken for recovery and must not alter output bytes.
- Keep mutation transactional: validate and compute into owned Rust state, then emit the result. A trap must not leave partially updated JS-visible state.

#### Build, Size, and Threading

- Select one explicit `wasm-pack --target` per consumer:
  - `nodejs` for the existing CommonJS Node backend.
  - `bundler` only when the repository’s bundler owns Wasm loading.
  - `web` for direct browser ESM with manual initialization.
  These outputs are not interchangeable. [SOURCE: https://rustwasm.github.io/docs/wasm-pack/commands/build.html]
- For a Node MCP backend, `nodejs` is the conservative default unless its package is explicitly ESM-only and the chosen modern wasm-bindgen target is verified against that runtime.
- Use release builds and measure before adopting size-specific settings. `lto = true`, `opt-level = "s"`/`"z"`, and `wasm-opt` can reduce output, but `"s"` may be smaller than `"z"` and size can trade against runtime performance. [SOURCE: https://rustwasm.github.io/docs/book/reference/code-size.html]
- Use `twiggy` to identify retained-size contributors before changing APIs or allocators. [SOURCE: https://rustwasm.github.io/docs/book/reference/code-size.html]
- Do not encode `wee_alloc` as the default. The historical Rust-Wasm guide recommends it for tiny, allocation-light programs, while current crate documentation describes first-fit allocation and potentially poor allocation-heavy performance; the old rustwasm documentation site is no longer maintained. The requested “deprecation” is not confirmed by current crate docs, so the defensible standard is “measure, do not default.” [SOURCE: https://rustwasm.github.io/docs/book/reference/code-size.html] [SOURCE: https://docs.rs/wee_alloc/latest/wee_alloc/]
- Assume single-threaded WASM. Threading requires atomics-enabled standard-library builds, shared memory, workers, target-specific glue, and browser isolation headers; bundler support and blocking behavior have additional constraints. [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/examples/raytrace.html]
- Single-threaded execution matters to MCP latency: CPU-heavy WASM called synchronously blocks the Node event loop. Chunk work, move it to a Worker, or prefer a napi-rs `AsyncTask`/sidecar when sustained parallel CPU is required.
- Threading must not change deterministic reductions. Parallel workers may compute independent pieces, but final aggregation and tie-breaking must occur in one canonical order.

### 3. cxx Boundary

**Applicability:** cxx is not a Node or WebAssembly binding. It applies only if a Rust module must reuse an existing C++ library or a required dependency exposes C++ rather than C/Rust APIs. No current research evidence establishes such a dependency, so cxx must not become a default layer.

#### DTO/ABI, Errors, Panics, and Packaging

- Define the complete boundary in `#[cxx::bridge]`; use only cxx-supported shared structs, opaque types, `UniquePtr`, `Box`, strings, slices, and vectors. cxx generates both sides and static assertions to check the declared boundary. [SOURCE: https://cxx.rs/]
- Keep C++ objects opaque unless their shared layout is genuinely part of the protocol. Do not expose STL implementation details or compiler-specific class layouts.
- Translate failures into `Result` at the cxx bridge, then translate again into the stable napi-rs/WASM JS error protocol. C++ exception text must not become a public deterministic error code.
- Never permit Rust panics or arbitrary C++ exceptions to unwind through an ordinary C ABI. Rust panic through a non-unwind boundary aborts; a foreign exception entering Rust through it is undefined behavior. [SOURCE: https://doc.rust-lang.org/nomicon/ffi.html#ffi-and-unwinding]
- Package the C++ runtime and native dependencies per target. cxx does not remove compiler, standard-library, OS, architecture, or libc compatibility concerns; those become additional dimensions in the napi-rs platform matrix.
- A cxx-backed Node addon must still expose only Node-API at its outer Node boundary. Direct V8/Node C++ APIs would forfeit Node-major ABI stability. [SOURCE: https://nodejs.org/api/n-api.html#implications-of-abi-stability]

### Encode-this

- **(style_guide)** Keep napi-rs, wasm-bindgen, and cxx annotations in thin adapter modules; domain logic must not depend on JS values or runtime handles.
- **(style_guide)** Export explicit versioned DTOs with fixed-width numbers, stable field names, explicit nullability, and explicit enum discriminants. Contract: **DTO/ABI parity**.
- **(quality_standards)** Require `napi::Result<T>` or `Result<T, JsValue>` for every recoverable boundary failure; freeze and golden-test JS `name`, `code`, `message`, `cause`, and throw-versus-rejection behavior. Contract: **error-shape parity**.
- **(quality_standards)** Ban panic-dependent validation and reachable `unwrap`/`expect` on boundary-controlled data; use `#[napi(catch_unwind)]` where unwind recovery is intended and never combine that expectation with `panic=abort`. Contract: **process-safety**.
- **(quality_standards)** Copy JS-owned buffers before asynchronous or cross-thread mutation unless a documented ownership protocol proves exclusive access; zero-copy is never an API guarantee. Contract: **memory-safety and byte parity**.
- **(quality_standards)** Ban `HashMap` iteration from DTO serialization, hashing inputs, ranking output, and error details; canonicalize keys and sort with the exact TypeScript comparator. Contract: **stable-order and deterministic-hash parity**.
- **(quick_reference)** napi-rs: borrowed slice for synchronous read-only access; owned copy for async work; `External<T>` for opaque pass-back handles; `AsyncTask` for libuv work; `ThreadsafeFunction` for native-thread-to-JS callbacks.
- **(quick_reference)** WASM: `serde-wasm-bindgen` serializer options are protocol settings; pin them, avoid raw `JsValue`, and assume single-threaded execution and boundary copies unless explicitly proven otherwise.
- **(checklist)** Compare native and WASM adapters against TypeScript golden fixtures for six-decimal numbers, equal-score tie-breaks, deterministic IDs, serialized bytes, DTO shape, and errors. Contract: **byte-for-byte parity**.
- **(checklist)** Declare the Node-API level, oldest tested Node release, OS/architecture/libc matrix, glibc floor, and generated TypeScript declarations; test every claimed target with the exact publish artifact.
- **(checklist)** Publish napi-rs platform packages through exact-version `optionalDependencies`; gate glibc, musl, macOS, and Windows artifact completeness before publishing the root package.
- **(checklist)** Select exactly one `wasm-pack` target per consumer and record compressed `.wasm` size; use `twiggy` before allocator or `opt-level` changes.
- **(checklist)** Introduce cxx only for a concrete C++ dependency; require a bridge-level error mapping, no cross-boundary unwinding, and inclusion of C++ runtime compatibility in the platform matrix.
