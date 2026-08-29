<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 8 angle A9+A10 — Cross-language template & Rust placement -->

This is a read-only, repository-evidence research pass with no file mutation. Skill routing: user explicitly directed “ONE round of a deep-research pass,” so I’m loading that workflow first, then I’ll inspect the required standards and registry with line-level citations.
The workflow contract confirms this prompt is a single LEAF research iteration: one focus, repository citations, no implementation, and no sub-dispatch. I’ll treat the requested Markdown response as the iteration artifact content and keep the analysis bounded to template conformance and placement.
## Round 8 — A9 + A10: Cross-Language Template and Rust Placement

### A9 — Conformance Map

#### Canonical Trio Contract

**Confirmed:** TypeScript, Python, and Shell use the same three-file language packet:

| File | Stable responsibility | Rust conformance |
|---|---|---|
| `style_guide.md` | File structure, naming, formatting, imports, comments, language idioms | Rust syntax, naming, module layout, formatting, documentation, boundary naming |
| `quality_standards.md` | Correctness policy, error handling, testing, tooling, build/runtime requirements | Determinism, interop safety, `unsafe`, error mapping, testing, Cargo/build matrix |
| `quick_reference.md` | Copy-ready template, naming table, common patterns, commands/checklist | Native/WASM templates, parity-safe snippets, build/test commands, compact checklist |

The directory model explicitly places each language’s trio beneath `code-opencode/references/`, while `references/shared/` holds cross-language principles. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/code_organization.md:400-425]

#### Shared Document Skeleton

**Confirmed:** All nine language files follow this document-level shape:

1. YAML frontmatter with title, description, trigger phrases, tier, context type, and version.
2. H1 plus one-sentence scope statement.
3. Numbered uppercase H2 sections.
4. `## 1. OVERVIEW` with `### Purpose`.
5. Dense language-specific sections containing rules, examples, tables, and rationale/evidence.
6. A final related-resources section linking the sibling trio files.

This structure appears consistently in TypeScript, Python, and Shell. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:1-34] [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/style_guide.md:1-42] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/style_guide.md:1-43]

**Decision:** Rust should reproduce this document skeleton exactly. The section names after `OVERVIEW` should follow Rust’s actual concerns rather than imitate another language mechanically.

#### Style Guide Template

**Confirmed common core:**

| Concern | TypeScript | Python | Shell | Rust disposition |
|---|---:|---:|---:|---|
| File/header structure | Yes | Yes | Yes | Required |
| Section organization | Yes | Yes | Yes | Required |
| Naming conventions | Yes | Yes | Yes | Required |
| Formatting | Yes | Yes | Implicit throughout | Required |
| Imports/dependencies | Yes | Yes | Sourcing equivalent | Required |
| Comments/documentation | Yes | Yes | Yes | Required |
| Error-handling idioms | Split across files | Yes | Yes | Rust-specific placement |
| Related resources | Final section | Final section | Final section | Required |

TypeScript makes type definitions and package/module behavior prominent. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:109-175] Python emphasizes type hints and docstrings. [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/style_guide.md:198-298] Shell emphasizes strict mode, quoting, process behavior, and output handling. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/style_guide.md:87-125] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/style_guide.md:339-437]

**Confirmed latitude:** The languages agree on document purpose and tone, not identical section names or ordering. TypeScript has ten numbered sections, Python nine, and Shell twelve. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-34] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:711-714] [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/style_guide.md:20-42] [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/style_guide.md:476-485] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/style_guide.md:20-43] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/style_guide.md:617-625]

**Inferred Rust structure:**

1. Overview
2. File and crate structure
3. Naming conventions
4. Formatting and imports
5. Ownership and borrowing conventions
6. Public APIs and documentation
7. Error and result style
8. Interop-boundary style
9. Comments and `unsafe` documentation
10. Related resources

Rust’s standard naming conventions should follow the Rust API Guidelines rather than inherit TypeScript casing mechanically. [SOURCE: https://rust-lang.github.io/api-guidelines/naming.html]

#### Quality Standards Template

**Confirmed common core:** Quality files define enforceable correctness requirements, error behavior, validation patterns, testing/tooling, and review handoff or related references. [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/quality_standards.md:20-38] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/quality_standards.md:20-38] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:20-31]

**Confirmed latitude:** P0/P1/P2 is strongly established by Python and Shell but is not the organizing skeleton of TypeScript quality standards. [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/quality_standards.md:26-36] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/quality_standards.md:26-36] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:34-104]

**Decision:** Rust should use P0/P1/P2 because parity and ABI violations are merge blockers:

- **P0:** byte mismatch, ordering mismatch, unstable IDs, panic crossing an interop boundary, unsound `unsafe`, incompatible napi-rs/WASM contract, or missing parity coverage.
- **P1:** undocumented public boundary, lossy conversion, incomplete error mapping, missing target-specific test, or unjustified lint suppression.
- **P2:** readability and non-contractual idiomatic improvements.

The authoritative Rust quality document should include:

1. P0/P1/P2 gates.
2. Deterministic serialization and formatting.
3. Stable ordering and tie-break rules.
4. Deterministic identifiers, hashing, and iteration.
5. napi-rs and wasm-bindgen boundary contracts.
6. Panic, error, and JavaScript exception mapping.
7. `unsafe` and FFI review requirements.
8. Native/WASM build profiles and feature gates.
9. Differential and golden parity tests.
10. `cargo fmt`, Clippy, tests, and target checks.

Clippy is the canonical Rust lint collection and supports lint-level enforcement. [SOURCE: https://rust-lang.github.io/rust-clippy/] FFI requires explicit attention to representation, ownership, and safety boundaries. [SOURCE: https://doc.rust-lang.org/nomicon/ffi.html]

#### Quick Reference Template

**Confirmed:** All three quick references have exactly twelve numbered sections, beginning with `OVERVIEW`, immediately presenting a complete/file template, then compact lookup material, and ending with related resources. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:20-34] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:559-562] [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/quick_reference.md:20-30] [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/quick_reference.md:381-411] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/quick_reference.md:20-30] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/quick_reference.md:471-501]

**Decision:** Rust’s quick reference should remain a lookup card, not a compressed essay. It should contain:

- A minimal crate/module template.
- A napi-rs export template.
- A wasm-bindgen export template.
- Naming and module-order tables.
- `Result` and boundary-error patterns.
- Six-decimal formatting examples.
- Stable sort with explicit final tie-break.
- Ordered-map or pre-sorted serialization examples.
- Deterministic-ID construction.
- `cargo fmt`, Clippy, native-test, WASM-test, and parity-test commands.
- A P0/P1/P2 checklist.
- Related resources.

#### Tone and Depth

**Confirmed:** The house tone is directive and operational: `MUST`, `ALWAYS`, `NEVER`, `Policy`, `CORRECT`, `WRONG`, short rationale, and copy-ready examples. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:34-56] [SOURCE: .opencode/skills/sk-code/code-opencode/references/python/quality_standards.md:36-42] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shell/quality_standards.md:36-68]

**Decision:** Rust guidance should avoid generic “prefer idiomatic Rust” language. Every strong rule should identify either:

- The concrete defect prevented.
- The boundary behavior preserved.
- The parity contract defended.
- The command or test that enforces it.

### Shared Versus Rust-Specific Content

#### Belongs in `references/shared/`

**Confirmed:** Shared documentation owns language-neutral naming, comments, section progression, module responsibility, dependency grouping, security, and cross-language alignment examples. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/universal_patterns.md:20-35] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/universal_patterns.md:166-230] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/code_organization.md:133-170] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/code_organization.md:211-224]

The following additions belong there:

- Rust added to the declared language scope, which currently stops at JavaScript, TypeScript, Python, Shell, and JSON/JSONC. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/universal_patterns.md:20-25]
- Rust added to language-specific resource links. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/universal_patterns.md:535-543]
- Rust added to the directory layout and test-file convention tables. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/code_organization.md:400-425] [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/code_organization.md:629-639]
- A language-neutral rule that implementations sharing a behavioral contract must produce canonically equivalent externally observable output.
- Cross-language names for the four parity contracts: six-decimal formatting, stable ordering/tie-breaks, deterministic IDs, and deterministic hash/iteration behavior.
- A cross-language requirement for differential fixtures against the TypeScript reference implementation.

#### Remains Rust-Specific

The following belongs only in `references/rust/`:

- Cargo workspace and feature layout.
- `rustfmt` and Clippy configuration.
- Ownership, borrowing, lifetimes, `Send`/`Sync`, and interior mutability.
- `Result`, panic containment, and Rust error types.
- `unsafe` documentation and FFI invariants.
- napi-rs attributes, JavaScript value conversion, and Node exception mapping.
- wasm-bindgen attributes, supported boundary types, and WASM-specific error conversion.
- Ordered collection selection and explicit sorting in Rust.
- Native addon and WASM build commands.
- Target-specific unit, integration, and differential test commands.

napi-rs and wasm-bindgen expose different binding mechanisms and supported boundary representations, so their mechanics require Rust-local treatment even when they defend the same external parity contract. [SOURCE: https://napi.rs/docs/concepts/values] [SOURCE: https://rustwasm.github.io/docs/wasm-bindgen/reference/types.html]

### A10 — Placement Decision

#### Rust Is a `code-opencode` Language

**Confirmed:** `sk-code` has two axes: acting workflow modes and read-only domain-evidence surfaces. A surface is not a programming language packet. [SOURCE: .opencode/skills/sk-code/mode-registry.json:4-18]

**Confirmed:** The only registered surfaces are `code-webflow` and `code-opencode`. `code-opencode` is the evidence surface for OpenCode system code. [SOURCE: .opencode/skills/sk-code/mode-registry.json:15-19] [SOURCE: .opencode/skills/sk-code/mode-registry.json:80-97]

**Confirmed:** Languages are already represented as sibling reference directories inside `code-opencode`, not as surfaces. [SOURCE: .opencode/skills/sk-code/code-opencode/references/shared/code_organization.md:402-425]

**Decision:** Rust belongs at:

```text
.opencode/skills/sk-code/code-opencode/references/rust/
├── style_guide.md
├── quality_standards.md
└── quick_reference.md
```

A separate `code-rust` surface would conflate the language axis with the domain-evidence surface axis and would require unnecessary registry/router expansion. Rust modules implementing native or WASM acceleration for the existing Node MCP backend remain OpenCode system code.

#### Interop and Build Placement

**Confirmed precedent:** TypeScript keeps mixed-language interop in its language style guide, authoritative build/package rules in quality standards, and executable commands in quick reference. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:624-707] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:627-724] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:450-521]

**Decision:** Follow that precedent:

| Content | Placement |
|---|---|
| Boundary naming, exported shapes, conversion style | `rust/style_guide.md` |
| napi-rs/WASM correctness, panic/error mapping, parity gates, Cargo features, target build matrix | `rust/quality_standards.md` |
| Binding templates, deterministic snippets, build/test commands | `rust/quick_reference.md` |
| Language-neutral parity contract definitions | Existing `shared/universal_patterns.md` |
| General module placement and test-directory rules | Existing `shared/code_organization.md` |

Do **not** create a new shared interop document. The cross-language portion is small enough to extend `universal_patterns.md`, while napi-rs, wasm-bindgen, Cargo, and Rust safety mechanics are language-specific.

Do **not** create a Rust-only interop sub-document initially. The established packet contract is a trio, and the TypeScript precedent already accommodates substantial interop/build content inside that trio. Splitting Rust prematurely would weaken discoverability and create a fourth file absent from other language packets.

### Encode-this

- **(style_guide)** Rust is a language packet under `code-opencode/references/rust/`, never a separate `code-rust` surface.
- **(style_guide)** Public Rust boundary names and serialized field names must match the TypeScript/Node contract exactly; internal Rust identifiers may follow Rust naming conventions.
- **(style_guide)** Every `unsafe` block must state the durable safety invariant, especially ownership, lifetime, representation, and thread assumptions at napi-rs or WASM boundaries.
- **(quality_standards)** Treat any byte mismatch between TypeScript and Rust output as P0. Contract: **byte-for-byte parity**.
- **(quality_standards)** Format contract-visible floating-point values through one canonical six-decimal path and verify edge cases with golden fixtures. Contract: **six-decimal float formatting**.
- **(quality_standards)** Every contract-visible sort must specify all tie-break keys and end in a deterministic total tie-break. Contract: **stable ordering/tie-breaks**.
- **(quality_standards)** Never derive external output from unspecified hash-map iteration; sort entries or use an explicitly ordered representation before serialization. Contract: **deterministic hash/iteration order**.
- **(quality_standards)** Deterministic IDs must use the same normalized inputs, field order, encoding, and hash algorithm as the TypeScript implementation. Contract: **deterministic IDs**.
- **(quality_standards)** Panics must not cross napi-rs or wasm-bindgen exports; exported operations must map failures to the established JavaScript error contract.
- **(quality_standards)** Require differential tests that execute identical fixtures through TypeScript and every enabled Rust target, comparing exact bytes rather than semantic JSON equality. Contract: **byte-for-byte parity**.
- **(quality_standards)** Native-addon and WASM builds must be independently compiled and tested; success on one target is not evidence for the other. Contract: **interop target parity**.
- **(quick_reference)** Include copy-ready napi-rs and wasm-bindgen export templates, canonical six-decimal formatting, total-order sorting, deterministic-ID construction, and ordered serialization.
- **(checklist)** Block completion unless formatting, Clippy, native tests, WASM tests, and TypeScript-versus-Rust golden parity tests all pass.
- **(checklist)** Add Rust to shared language scope, resource links, directory examples, and test-file conventions without moving Rust-specific interop mechanics into shared documentation.
