<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 2 angle A2 — Tooling & lint tiers -->

I’ll anchor the round in the repo’s actual Rust/interop evidence first, then verify each tooling recommendation against canonical upstream documentation. The output will distinguish confirmed repository facts from inferences and classify every recommendation as CI-gate or advisory.
Skill routing: user explicitly requested a deep-research pass for the `code-opencode` surface; advisor independently selected `sk-code` (0.95 confidence) and `system-deep-loop` research mode (0.8408). The memory trigger lookup timed out, so I’m proceeding from directly verified repository and canonical-source evidence rather than treating unavailable memory as fact.
The repository evidence fixes two important policy choices: this standard is for a future boundary crate, not an existing Rust workspace, and parity failures are explicitly release-blocking at six-decimal scoring and stable ordering seams. I’m therefore separating reproducibility controls that belong in source (`Cargo.toml`, `rustfmt.toml`, lint policy) from checks that should stay CI-owned so compiler/tool updates do not silently redefine the crate contract.
## Round 2 — A2: Tooling and Lint Tiers

### Repository Contract

- **CONFIRMED:** Rust is planned as a napi-rs, WASM, or sidecar boundary over the existing TypeScript/Node backend, with six-decimal scores, stable ordering, deterministic IDs, and byte-for-byte parity as non-negotiable behavior. [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:64] [SOURCE: .opencode/specs/sk-code/018-rust-standards-for-code-opencode/001-research/spec.md:70]
- **CONFIRMED:** Current TypeScript scoring rounds to six decimal places, while recommendation ordering uses score followed by a stable `skillId` tie-break. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:291] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:301] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:337] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:341]
- **CONFIRMED:** Database iteration order previously made equal-score graph output non-reproducible; the corrective contract uses content-derived keys and a total comparator robust to `NaN` and negative zero. [SOURCE: .opencode/specs/system-code-graph/001-code-graph-core/before-vs-after.md:13] [SOURCE: .opencode/specs/system-code-graph/001-code-graph-core/before-vs-after.md:17]
- **INFERRED:** Rust tooling must therefore reject implicit panic paths, lossy casts, unchecked indexing, accidental float equality, and unreviewed iteration-order dependence more aggressively than a generic application crate. These are plausible sources of cross-boundary semantic drift, not mere style defects.

### rustfmt

**CI-GATE:** Commit `rustfmt.toml`, use stable rustfmt, and run:

```bash
cargo fmt --all -- --check
```

`--check` exits nonzero when formatting would change. [SOURCE: https://github.com/rust-lang/rustfmt#verifying-code-is-formatted]

Pin only stable, output-relevant settings:

```toml
edition = "2024"
style_edition = "2024"
max_width = 100
newline_style = "Unix"
```

- `edition` controls parsing, while `style_edition` controls formatting behavior. Editors may invoke `rustfmt` directly, which otherwise can disagree with `cargo fmt`; pin both. [SOURCE: https://doc.rust-lang.org/edition-guide/rust-2024/rustfmt-style-edition.html]
- `newline_style = "Unix"` prevents platform-dependent source-file line endings. `max_width` limits formatter churn without adopting unstable formatting options. [SOURCE: https://rust-lang.github.io/rustfmt/]
- Do not pin a broad inventory of default knobs. Every extra override creates maintenance cost and can amplify formatter-version churn without defending an interop or parity contract.
- Formatting is a source-consistency gate, not proof of runtime byte parity. Generated JSON, hashes, score strings, native-addon output, and WASM output still require golden parity tests.

### Edition and MSRV

**CI-GATE:** New crates should default to Edition 2024 and declare an explicit `rust-version`:

```toml
[package]
edition = "2024"
rust-version = "1.85"
```

Edition 2024 requires Rust 1.85.0. [SOURCE: https://doc.rust-lang.org/edition-guide/rust-2024/index.html] Cargo uses `rust-version` to reject unsupported compilers and to inform dependency selection. [SOURCE: https://doc.rust-lang.org/cargo/reference/rust-version.html]

Policy:

- Use Edition 2024 unless the supported napi-rs/WASM build matrix demonstrably requires a compiler older than 1.85; only then use Edition 2021.
- Treat `1.85` as the Edition 2024 floor, not an automatically truthful MSRV. Set `rust-version` to the oldest compiler actually exercised in CI.
- Run one CI job on the declared MSRV and another on the pinned current stable toolchain. Never use `--ignore-rust-version` in CI.
- Raise MSRV deliberately when dependencies or required language features demand it; Cargo describes changing `rust-version` as a minor incompatibility. [SOURCE: https://doc.rust-lang.org/cargo/reference/rust-version.html]

### Clippy Tiers

#### Default Tier

**CI-GATE:**

```bash
cargo clippy --workspace --all-targets --locked -- -D warnings
```

Clippy’s default invocation enables `clippy::all`; `-D warnings` promotes both Clippy and rustc warnings to errors. [SOURCE: https://doc.rust-lang.org/clippy/usage.html]

Do not put `#![deny(warnings)]` in crate source:

- New compiler or Clippy warnings can break the crate merely because the toolchain changed.
- Source-level denial is harder to vary between the MSRV, current-stable, generated bindings, tests, and target-specific builds.
- Keep “zero warnings” as a CI policy on pinned toolchains. Keep durable correctness lints in `[workspace.lints]`. Rust supports manifest-level lint configuration and priority. [SOURCE: https://doc.rust-lang.org/cargo/reference/manifest.html#the-lints-section] [SOURCE: https://doc.rust-lang.org/rustc/lints/levels.html]

#### Explicit Parity Tier

**CI-GATE:** Cherry-pick these restriction lints rather than enabling `clippy::restriction` wholesale; Clippy explicitly warns that the complete restriction group contains conflicting or unidiomatic rules. [SOURCE: https://doc.rust-lang.org/clippy/usage.html]

```toml
[workspace.lints.clippy]
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
float_cmp = "deny"
as_conversions = "deny"
indexing_slicing = "deny"
```

| Lint | Rule and parity rationale |
|---|---|
| `clippy::unwrap_used` | Deny in production. Missing data, poisoned locks, conversion failures, and boundary decoding must become typed errors rather than process-threatening panics. napi-rs expects recoverable failures as `napi::Result`; wasm-bindgen converts exported `Result::Err` into a JS exception. [SOURCE: https://napi.rs/docs/concepts/error-handling] [SOURCE: https://wasm-bindgen.github.io/wasm-bindgen/reference/types/result.html] |
| `clippy::expect_used` | Deny for the same reason. A better message does not turn an interop panic into a stable JS error contract. |
| `clippy::panic` | Deny explicit `panic!` in production paths. napi-rs states that an uncaught synchronous panic can terminate the process and that panic is not a substitute for `Result`. [SOURCE: https://napi.rs/docs/concepts/error-handling#panics-are-not-ordinary-errors] |
| `clippy::float_cmp` | Deny ordinary `f32`/`f64` equality. Compare using the specified rounding/serialization contract or a documented tolerance. Exact parity tests should preferably compare six-decimal serialized strings or bytes; a scoped exception is valid only when exact IEEE bits are the contract. [SOURCE: https://rust-lang.github.io/rust-clippy/master/index.html#float_cmp] |
| `clippy::as_conversions` | Deny implicit `as` conversions because they may silently truncate, wrap, lose precision, or reinterpret values. Use `From`, `TryFrom`, or explicit boundary conversion helpers. This protects score, ID, length, and JS-number conversion contracts. [SOURCE: https://rust-lang.github.io/rust-clippy/master/index.html#as_conversions] |
| `clippy::indexing_slicing` | Deny unchecked indexing in production parsing, DTO conversion, ranking, and serialization. Use `.get()`, iterators, or a checked invariant; an out-of-range input must return the same error shape across native and WASM boundaries, not panic. [SOURCE: https://rust-lang.github.io/rust-clippy/master/index.html#indexing_slicing] |

Scoped exceptions are permitted in tests or proven low-level boundary code, but must be narrow and reasoned:

```rust
#[allow(
    clippy::float_cmp,
    reason = "golden test asserts the contractually rounded six-decimal value"
)]
```

Use `deny`, not `forbid`, so a reviewed local exception remains possible. Rust’s `forbid` level cannot normally be lowered by nested attributes. [SOURCE: https://doc.rust-lang.org/rustc/lints/levels.html]

#### Pedantic and Nursery

**ADVISORY:**

```bash
cargo clippy --workspace --all-targets --locked -- \
  -W clippy::pedantic \
  -W clippy::nursery
```

- `clippy::pedantic` is intentionally opinionated and may produce false positives; review it, then promote individually valuable lints into the committed CI tier. [SOURCE: https://doc.rust-lang.org/clippy/usage.html]
- Keep `clippy::nursery` advisory because its lint set is less mature and more likely to change with toolchains.
- Do not combine blanket pedantic/nursery warnings with `-D warnings`; that accidentally turns the advisory inventory into an unstable release gate.

### Cargo Workflow

The minimum Rust gate should be:

```bash
cargo fmt --all -- --check
cargo check --workspace --all-targets --locked
cargo clippy --workspace --all-targets --locked -- -D warnings
cargo test --workspace --locked
RUSTDOCFLAGS="-D warnings" cargo doc --workspace --no-deps --locked
cargo build --workspace --release --locked
```

- **CI-GATE:** `cargo check` is the fast type/borrow gate, but it omits final code generation and cannot replace the release build. [SOURCE: https://doc.rust-lang.org/cargo/commands/cargo-check.html]
- **CI-GATE:** `cargo test` executes unit, integration, and documentation tests. Boundary crates additionally require Node-driven napi-rs tests or wasm-bindgen tests against the TypeScript fixtures; Rust-only tests cannot prove JS exception shape or byte parity. [SOURCE: https://doc.rust-lang.org/cargo/commands/cargo-test.html] [SOURCE: https://napi.rs/docs/concepts/error-handling]
- **CI-GATE:** `cargo doc --no-deps` with `RUSTDOCFLAGS="-D warnings"` validates the local public boundary documentation without spending time on dependency docs. [SOURCE: https://doc.rust-lang.org/cargo/commands/cargo-doc.html]
- **CI-GATE:** Use `--locked` for all reproducibility-sensitive CI commands. Cargo documents that it fails when the lockfile is absent or would change and explicitly identifies deterministic CI as a use case. [SOURCE: https://doc.rust-lang.org/cargo/commands/cargo-check.html#manifest-options]
- **CI-GATE:** Check every supported artifact target separately. A native host check does not validate `wasm32-unknown-unknown`; similarly, a WASM check does not compile napi-rs-only code.
- **ADVISORY until features exist:** Use `--all-features` only when features are compatible. Otherwise commit an explicit feature/target matrix; blindly combining mutually exclusive napi-rs and WASM features can test an unsupported configuration rather than either real artifact.

### Release Profiles

Profiles can alter optimization, linking, panic strategy, and artifact shape, but they do not establish semantic determinism. Six-decimal formatting, total ordering, deterministic IDs, and ordered serialization must be enforced in code and golden tests. Cargo documents `lto`, `codegen-units`, and `panic` as compilation controls. [SOURCE: https://doc.rust-lang.org/cargo/reference/profiles.html]

Recommended baseline:

```toml
[profile.release]
lto = "thin"
codegen-units = 1
panic = "unwind"
```

- **CI-GATE:** Pin the release profile so local and CI artifacts do not silently use different workspace-root settings.
- `codegen-units = 1` trades compile time for a single optimization unit; `lto = "thin"` is a reasonable native-addon baseline, but both are performance/artifact controls, not substitutes for parity tests. [SOURCE: https://doc.rust-lang.org/cargo/reference/profiles.html#codegen-units] [SOURCE: https://doc.rust-lang.org/cargo/reference/profiles.html#lto]
- **Do not set `panic = "abort"` for an in-process napi-rs addon by default.** napi-rs can translate a caught unwind to a JS error only under an unwind-capable strategy; `panic = "abort"` cannot be caught and can terminate the Node process. [SOURCE: https://napi.rs/docs/concepts/error-handling#panics-are-not-ordinary-errors]
- A custom WASM release profile may use `panic = "abort"` only when all recoverable failures already use `Result` and JS tests prove the trap/error behavior matches the declared boundary contract.
- A sidecar may use `panic = "abort"` only when process termination, exit code, stderr, restart, and request-failure mapping are explicitly part of the Node-side protocol.
- Cargo’s test harness ignores the profile panic setting and requires unwind behavior, so release-artifact integration tests are required to exercise abort-configured artifacts. [SOURCE: https://doc.rust-lang.org/cargo/reference/profiles.html#panic]

### Supply Chain

| Tool | Status | Required use |
|---|---|---|
| `cargo-deny` | **CI-GATE** | Run `cargo deny check` with committed `deny.toml`. Gate licenses, duplicate/banned crates, advisories, and non-approved sources. cargo-deny defines these four check classes and runs all by default. [SOURCE: https://embarkstudios.github.io/cargo-deny/checks/index.html] |
| `cargo-audit` | **CI-GATE** | Run `cargo audit` against committed `Cargo.lock` as the dedicated RustSec vulnerability gate. This intentionally overlaps cargo-deny advisories: security-advisory failure should not depend solely on the broader policy tool. [SOURCE: https://docs.rs/cargo-audit/latest/cargo_audit/] |
| `cargo-vet` | **ADVISORY during bootstrap; CI-GATE after policy adoption** | Initialize audit criteria/imports/exceptions, commit the `supply-chain/` state, then run `cargo vet --locked` in CI. cargo-vet verifies that third-party dependencies satisfy trusted audits and supports temporary exceptions for gradual adoption. [SOURCE: https://mozilla.github.io/cargo-vet/] [SOURCE: https://mozilla.github.io/cargo-vet/configuring-ci.html] |

Tool binaries or CI actions must be version-pinned. An unpinned scanner can change policy semantics independently of the crate and produce non-reproducible gate results.

### Encode-this

- **[quality_standards]** Make `cargo fmt --all -- --check` a CI gate; pin `edition`, `style_edition`, `max_width`, and Unix newlines in `rustfmt.toml`.
- **[quality_standards]** Default new boundary crates to Edition 2024; declare `rust-version`, test that exact MSRV, and use Edition 2021 only for a verified pre-1.85 build requirement.
- **[quality_standards]** Gate default Clippy/rustc warnings with CI-owned `-D warnings`; prohibit source-wide `#![deny(warnings)]`.
- **[quality_standards]** Deny `unwrap_used`, `expect_used`, and `panic` in production code; require typed `Result` propagation across napi-rs/WASM boundaries. Contract: **interop error-shape/process-survival parity**.
- **[quality_standards]** Deny `float_cmp`; require six-decimal serialization or an explicitly documented comparison rule. Contract: **six-decimal score parity**.
- **[quality_standards]** Deny `as_conversions`; require checked boundary conversions. Contract: **score/ID/length representation parity**.
- **[quality_standards]** Deny `indexing_slicing`; require checked access or a locally documented proof. Contract: **panic-free untrusted DTO handling**.
- **[quality_standards]** Keep blanket `clippy::pedantic` and `clippy::nursery` advisory; promote selected lints individually.
- **[quick_reference]** Publish the ordered gate: fmt, check, Clippy, test, rustdoc, release build, then Node/WASM golden parity tests.
- **[checklist]** Require `--locked`, explicit native/WASM target jobs, and an explicit feature matrix.
- **[quality_standards]** Use `panic = "unwind"` for napi-rs; permit abort only for tested WASM/sidecar profiles whose failure protocol is explicit. Contract: **Node process and JS error parity**.
- **[quality_standards]** State that LTO and codegen-unit settings affect artifacts/performance, not deterministic scores, IDs, ordering, hashes, or serialization.
- **[checklist]** Gate `cargo-deny` and `cargo-audit`; introduce `cargo-vet` as advisory, then make it blocking once committed audit policy and exceptions exist.
