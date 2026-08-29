<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 6 angle A6 — code-opencode language-standard convention -->

The round is read-only and tightly scoped to six repository artifacts. I’ll load the mandated deep-research workflow, then extract the exact document architecture and line-anchored Rust template without modifying files.
## Round 6 — A6: Canonical `code-opencode` Rust Language-Standard Convention

### Confirmed Surface Contract

**Confirmed:** `code-opencode` treats each supported language as a three-document bundle: `style_guide.md`, `quality_standards.md`, and `quick_reference.md`. Routing loads only the detected language’s trio, while shared language-agnostic material remains separate. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:26-40]

**Confirmed:** Language-specific quality gates live under `assets/checklists/`, separate from the trio. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:127-133]

**Confirmed:** The surface currently has no Rust detection signal, resource-map entry, checklist entry, or language reference directory. Adding Rust therefore requires coordinated routing and asset registration, not merely three new documents. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:56-117]

**Confirmed:** The surface says one language should be selected per task, with cross-language rules delegated to the shared tier. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-125]

**Inferred requirement:** Rust must be one language slice even when it interoperates with TypeScript. Rust-specific documents should own Rust-side napi-rs/WASM ABI, serialization, numeric formatting, deterministic ordering, and parity rules; reusable language-neutral rules should remain in `references/shared/`.

### Trio Responsibilities

| Document | Confirmed responsibility | Required Rust adaptation |
|---|---|---|
| `style_guide.md` | Formatting, naming, file structure, imports, comments, and language/coexistence conventions. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-32] | Rust source organization and naming, with boundary-specific rules for exported napi-rs/wasm-bindgen names, DTO fields, generated bindings, feature gates, and TypeScript-visible representations. |
| `quality_standards.md` | Semantic engineering policy: type modeling, safety, public API contracts, documentation, errors, async behavior, compiler/build baseline, and module organization. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:20-31] | Rust safety and correctness at the Node/WASM boundary, including deterministic serialization, byte-for-byte parity, panic containment, error translation, numeric equivalence, ownership across FFI, and release/build verification. |
| `quick_reference.md` | Copy-paste templates and compact lookup material, explicitly deferring explanations to the other two documents. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:20-30] | Ready-to-use native-addon/WASM module templates, parity-safe conversion snippets, deterministic collection/sort recipes, error mappings, and exact verification commands. |

**Confirmed tone:** The trio is operational and normative rather than essay-like. It uses `MUST`, `NEVER`, `Rule`, `Policy`, `Correct`, `Wrong`, rationale paragraphs, decision tables, and executable examples. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:34-57] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:104-137]

**Confirmed depth:** Top-level subjects use numbered, all-caps H2 headings; focused decisions use H3 headings; concrete rules are followed by examples, exception conditions, or rationale. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-38] [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:34-69]

**Confirmed:** Numbered all-caps section headings are themselves a checklist requirement. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:114-120]

### Style Guide Skeleton

The TypeScript style guide establishes this exact structural pattern:

1. `OVERVIEW`
   - `Purpose`
   - `When to Use`  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-31]
2. `FILE HEADER FORMAT`
   - Mandatory rule
   - Template
   - Requirements
   - Rationale
   - Full example  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:34-72]
3. Language mode or compilation semantics
   - TypeScript uses `STRICT MODE`; Rust should use `EDITION, TOOLCHAIN, AND COMPILATION BASELINE`.  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:76-105]
4. `SECTION ORGANIZATION`
   - Divider/template conventions
   - Standard ordering table
   - Language-specific difference
   - Full section example  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:109-175]
5. `NAMING CONVENTIONS`
   - One H3 per symbol category
   - Correct/incorrect examples
   - Boundary exceptions
   - Summary table  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:179-378]
6. `FORMATTING RULES`
   - Indentation, braces, punctuation, line length, multiline forms, trailing separators  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:382-496]
7. `IMPORT ORDERING`
   - Group order
   - Boundary-specific path/module behavior
   - Re-export forms  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:500-555]
8. `COMMENTING RULES`
   - Quantity and purpose
   - Durable `WHY`, not mechanics
   - Forbidden ephemeral identifiers
   - Documentation-comment handoff to quality standards  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:559-619]
9. `MIXED JS/TS COEXISTENCE PATTERNS`
   - Cross-language imports
   - Optional dependencies
   - compatibility aliases
   - transitional compiler settings  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:624-707]
10. `RELATED RESOURCES`
    - Links to the other two trio documents  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:711-714]

**Inferred Rust rule:** Section 9 is load-bearing. It must become `RUST/TYPESCRIPT INTEROP AND COEXISTENCE`, not a generic “advanced patterns” section. It should cover napi-rs, wasm-bindgen, generated `.d.ts`/JS glue, JS-visible naming, serialization boundaries, native/WASM feature separation, and parity-preserving conversion rules.

### Quality Standards Skeleton

The TypeScript quality document establishes this pattern:

1. `OVERVIEW`
   - Purpose
   - When to use  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:20-31]
2. Primary language modeling decision guide
   - Alternatives
   - Correct examples
   - Decision-summary table  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:34-100]
3. Safety policies
   - Preferred safe construct
   - Prohibited or restricted construct
   - Narrow exceptions with justification  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:104-198]
4. State/domain modeling
   - Recommended representation
   - State-machine example  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:202-254]
5. Standard-library abstractions
   - Prefer built-ins over custom substitutes
   - Table plus project examples  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:258-302]
6. Public API signatures
   - Explicit public contracts
   - More permissive private-helper policy
   - Rationale  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:306-335]
7. Public documentation
   - Function, interface, class, generic, and tag examples  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:339-465]
8. Typed errors
   - Base error form
   - Stable code map
   - Catch/narrowing behavior  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:469-555]
9. Async/concurrency patterns
   - Typed async signatures
   - Parallelism
   - Partial failure
   - Error wrapper  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:559-623]
10. Compiler/build baseline
    - Current repository reality
    - Baseline configuration
    - Build and rebuild workflow
    - Verification table
    - Workspace/package exceptions  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:627-809]
11. Module organization
    - Source/output relationship
    - Public export organization  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:813-858]
12. `RELATED RESOURCES`  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:862-865]

**Inferred Rust rule:** Rust’s quality document should preserve the progression but replace language-specific subjects with boundary-focused equivalents. Its central quality axis is not “idiomatic Rust” alone; it is whether Rust reproduces the TypeScript implementation’s externally observable bytes, ordering, identifiers, errors, and numeric text.

### Quick Reference Skeleton

The quick reference compresses the other two documents into direct-use material:

1. `OVERVIEW`
   - Purpose
   - Links to detailed documents
   - One concise repository-baseline warning  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:20-30]
2. `COMPLETE FILE TEMPLATE`  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:34-133]
3. `NAMING CHEAT SHEET`  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:137-156]
4. `SECTION ORDERING`  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:160-169]
5. Compact language-signature patterns  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:173-238]
6. Common standard-library/type patterns  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:242-272]
7. Import/export templates  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:276-322]
8. Error-handling patterns  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:326-426]
9. Public-documentation template  
   [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:430-446]
10. Compiler/build quick reference  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:450-521]
11. Common one-liners  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:525-555]
12. `RELATED RESOURCES`  
    [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:559-562]

**Inferred Rust rule:** The Rust quick reference must not introduce policy absent from the detailed documents. It should provide exact snippets for napi-rs and wasm-bindgen exports, six-decimal formatting, stable sort tie-breaks, deterministic ID/hash generation, ordered serialization, panic-to-JS-error conversion, and TypeScript/Rust golden-test commands.

### Checklist Convention

**Confirmed:** A per-language checklist has metadata, title, one-sentence purpose, and an overview explicitly requiring the universal checklist alongside the language checklist. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:1-24]

**Confirmed priority model:**

| Priority | Meaning | Enforcement |
|---|---|---|
| P0 | Hard blocker | Must fix before commit |
| P1 | Required | Must fix or receive explicit approval |
| P2 | Recommended | May defer with justification |

[SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:26-33]

**Confirmed item shape:** Each item normally contains an H3 rule name, a literal checkbox, and then a required form, correct/wrong examples, exception, or short rationale. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:36-76]

**Confirmed:** The checklist ends with:
- A formal review evidence template. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:357-369]
- Validation commands. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:373-390]
- Related resources. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:394-401]

**Inferred Rust priority allocation:**
- P0: any violation capable of changing JS-visible bytes, six-decimal formatting, ordering/tie-breaks, IDs, hash/iteration order, serialized shape, panic behavior, or napi-rs/WASM parity.
- P1: explicit boundary types, stable error translation, checked conversions, public API documentation, toolchain/build compatibility, and cross-runtime golden tests.
- P2: idiomatic refinements that cannot affect observable parity.

### Playbook Entry Convention

**Confirmed:** A language-routing playbook entry is intentionally minimal. Its frontmatter contains:
- Scenario ID
- `language-standards` category
- Routing title
- Expected intent
- Exactly the language trio under `expected_resources`
- Version  
[SOURCE: .opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/001-typescript-standards.md:1-11]

**Confirmed:** The body contains:
- Scenario title
- `## 2. SCENARIO CONTRACT`
- Prompt summary
- Expected intent
- An exact prompt in a fenced `text` block  
[SOURCE: .opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/001-typescript-standards.md:13-23]

**Confirmed inconsistency:** The TypeScript entry declares `expected_intent: TYPESCRIPT` in frontmatter but says `Expected intent: LANGUAGE_STANDARDS` in the body. [SOURCE: .opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/001-typescript-standards.md:5-9] [SOURCE: .opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/001-typescript-standards.md:15-18]

**Inferred template decision:** The Rust entry should reproduce the structural shape but must use one canonical expected-intent value consistently in both locations. The router’s language signals use language-specific labels such as `TYPESCRIPT`; therefore `RUST` is the structurally consistent value once Rust routing exists. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:56-66]

### Non-Negotiables Placement

**Confirmed:** Surface-wide non-negotiables live centrally in `SKILL.md`, under `## 3. SURFACE STANDARDS (the non-negotiables)`, and are framed as short bold imperatives followed by scope and verification consequences. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-125]

**Confirmed:** Detailed language blockers are repeated as P0 checklist items rather than expanded inside `SKILL.md`. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:36-122]

**Inferred Rust placement:**
- Put the cross-cutting parity invariant in `SKILL.md`: Rust modules are compatibility implementations, not independent behavior authorities.
- Put detailed deterministic-output rules in Rust `quality_standards.md`.
- Put directly testable parity violations in Rust checklist P0.
- Put copy-ready compliant implementations in Rust `quick_reference.md`.
- Put purely lexical formatting and naming rules in Rust `style_guide.md`.

## Canonical Rust Template

### `references/rust/style_guide.md`

```markdown
---
title: Rust Style Guide
description: Formatting, naming, source organization, and TypeScript-boundary conventions for Rust modules in OpenCode.
trigger_phrases:
  - "opencode rust style guide"
  - "rust napi module style"
  - "rust wasm module style"
  - "rust typescript interop naming"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Style Guide

[One-sentence scope.]

---

## 1. OVERVIEW
### Purpose
### When to Use

## 2. FILE HEADER FORMAT
### Template
### Requirements
### Full Header Example

## 3. EDITION, TOOLCHAIN, AND COMPILATION BASELINE
### Supported Edition
### Toolchain Pinning
### Required Compiler and Lint Settings
### Native Addon vs WASM Feature Boundaries

## 4. SECTION ORGANIZATION
### Section Divider Template
### Standard Section Order
### Boundary Module Example

## 5. NAMING CONVENTIONS
### Crates and Modules
### Types and Traits
### Functions and Variables
### Constants and Statics
### napi-rs Export Names
### wasm-bindgen Export Names
### TypeScript DTO and Serialized Field Names
### Boundary Exceptions
### Naming Summary Table

## 6. FORMATTING RULES
### rustfmt Is Authoritative
### Line Width and Multiline Forms
### Match Expressions
### Builder and Iterator Chains
### Attribute Ordering
### Numeric Literal and Float-Formatting Conventions

## 7. IMPORT AND MODULE ORDERING
### std, External Crates, Local Modules
### Type and Value Re-exports
### Feature-Gated Imports
### Generated Binding Modules

## 8. COMMENTING AND RUSTDOC RULES
### Explain Durable Constraints
### Public Boundary Documentation
### Safety Comments
### Forbidden Ephemeral References

## 9. RUST/TYPESCRIPT INTEROP AND COEXISTENCE
### napi-rs Boundary Modules
### wasm-bindgen Boundary Modules
### JS-Visible Names and Shapes
### Native/WASM Feature Separation
### Generated JavaScript and TypeScript Bindings
### Compatibility Aliases
### Deterministic Boundary Representations

## 10. RELATED RESOURCES
```

This preserves the style guide’s overview, file-format, language-mode, organization, naming, formatting, imports, comments, coexistence, and related-resource progression. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-714]

### `references/rust/quality_standards.md`

```markdown
---
title: Rust Quality Standards
description: Safety, interop, determinism, parity, errors, async behavior, and build standards for Rust modules in OpenCode.
trigger_phrases:
  - "opencode rust quality standards"
  - "napi rust parity"
  - "wasm rust determinism"
  - "rust typescript byte parity"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Quality Standards

[One-sentence scope emphasizing compatibility with existing TypeScript behavior.]

---

## 1. OVERVIEW
### Purpose
### When to Use

## 2. OWNED VS BORROWED DATA DECISION GUIDE
### Boundary Inputs
### Internal Domain Types
### Boundary Outputs
### Decision Summary

## 3. SAFETY AND INTEROP POLICIES
### No Uncontained Panics Across Boundaries
### Checked Numeric Conversions
### UTF-8 and Byte Buffer Ownership
### Restricted unsafe
### Boundary Validation
### Permitted Exceptions

## 4. DOMAIN AND STATE MODELING
### Enums and Tagged States
### Exhaustive Matching
### TypeScript-Visible Discriminants
### State Machine Pattern

## 5. STANDARD COLLECTION AND SERIALIZATION TYPES
### Deterministic Collections
### Ordered Serialization
### Stable Map and Set Projection
### Avoiding Hash-Iteration Leakage

## 6. PUBLIC API AND ABI CONTRACTS
### Explicit napi-rs Signatures
### Explicit wasm-bindgen Signatures
### JavaScript Number, BigInt, String, and Buffer Mapping
### TypeScript Declaration Compatibility
### Native/WASM API Parity

## 7. RUSTDOC AND BOUNDARY DOCUMENTATION
### Public Function Documentation
### Type Documentation
### Error and Panic Documentation
### Determinism and Parity Documentation

## 8. ERROR AND PANIC TRANSLATION
### Stable Error Codes
### napi-rs Error Mapping
### wasm-bindgen Error Mapping
### Panic Containment
### TypeScript-Compatible Error Messages

## 9. ASYNC, THREADING, AND RUNTIME PATTERNS
### Node Runtime Boundaries
### WASM Execution Constraints
### Send and Sync Requirements
### Blocking Work
### Deterministic Parallel Reduction

## 10. CARGO, BUILD, AND VERIFICATION BASELINE
### Cargo.toml Baseline
### Crate Types and Features
### napi-rs Build Workflow
### wasm-bindgen Build Workflow
### Formatting, Clippy, Tests, and Artifact Builds
### Cross-Language Golden Tests

## 11. MODULE AND BOUNDARY ORGANIZATION
### Core Logic vs Adapter Layers
### Native Adapter
### WASM Adapter
### Shared Deterministic Core
### Generated Bindings and Distribution Artifacts

## 12. BYTE-FOR-BYTE DETERMINISM AND PARITY
### Six-Decimal Float Formatting
### Stable Sort and Explicit Tie-Breaks
### Deterministic IDs
### Hash and Iteration Order
### Canonical Serialization
### TypeScript/Rust Golden Fixtures
### Native/WASM/TypeScript Three-Way Parity Gate

## 13. RELATED RESOURCES
```

The extra parity section is justified by the round’s framing invariant; it specializes the quality document’s established role as the home for semantic policies, public contracts, errors, async behavior, compiler baseline, and module organization. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quality_standards.md:104-865]

### `references/rust/quick_reference.md`

```markdown
---
title: Rust Quick Reference
description: Copy-paste napi-rs, wasm-bindgen, deterministic-output, and parity-safe Rust patterns for OpenCode.
trigger_phrases:
  - "opencode rust quick reference"
  - "rust napi template"
  - "rust wasm template"
  - "rust parity cheat sheet"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Quick Reference

[One-sentence lookup purpose.]

---

## 1. OVERVIEW
## 2. COMPLETE NAPI-RS MODULE TEMPLATE
## 3. COMPLETE WASM-BINDGEN MODULE TEMPLATE
## 4. NAMING CHEAT SHEET
## 5. SECTION ORDERING
## 6. BOUNDARY TYPE MAPPING
## 7. IMPORT, MODULE, AND EXPORT TEMPLATES
## 8. ERROR AND PANIC MAPPING
## 9. RUSTDOC TEMPLATE
## 10. CARGO AND BUILD QUICK REFERENCE
## 11. DETERMINISTIC OUTPUT RECIPES
### Six-Decimal Float Formatting
### Stable Sort With Tie-Breaks
### Deterministic IDs
### Ordered Map Serialization
### Canonical Byte Output
## 12. PARITY TEST RECIPES
### TypeScript vs Native Addon
### TypeScript vs WASM
### Native Addon vs WASM
## 13. COMMON ONE-LINERS
## 14. RELATED RESOURCES
```

This follows the quick reference’s template-first, cheat-sheet, error, documentation, build, one-liner, and cross-link pattern while making parity recipes first-class. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:20-562]

### `assets/checklists/rust_checklist.md`

```markdown
---
title: Rust Code Quality Checklist
description: Quality, interop, determinism, and parity validation for Rust modules in OpenCode.
trigger_phrases:
  - "opencode rust checklist"
  - "rust napi parity checklist"
  - "rust wasm quality validation"
  - "rust deterministic output check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Rust Code Quality Checklist

## 1. OVERVIEW
### Purpose
### Priority Levels

## 2. P0 - HARD BLOCKERS
### TypeScript-Visible Output Is Byte-for-Byte Equivalent
### Six-Decimal Float Formatting Is Exact
### Sort Order and Tie-Breaks Are Explicit
### IDs Are Deterministic
### Hash or Collection Iteration Order Cannot Leak
### Serialization Is Canonical
### Native Addon and WASM Outputs Match
### Panics Cannot Cross an Interop Boundary
### JS-Visible Types and Error Shapes Match
### No Commented-Out Code
### Purposeful WHY Comments
### Numbered ALL-CAPS Sections

## 3. P1 - REQUIRED
### Public Boundary Types Are Explicit
### Numeric Conversions Are Checked
### napi-rs and wasm-bindgen Errors Are Stable
### Core Logic Is Shared Across Adapters
### Public APIs Have Rustdoc
### Cargo Features Separate Native and WASM Boundaries
### Formatting and Clippy Pass
### Cross-Language Golden Tests Pass
### KISS / DRY / SOLID Checks

## 4. P2 - RECOMMENDED
### Standard Types Preferred Over Custom Equivalents
### Newtypes Protect Boundary Semantics
### Immutable Data Used Where Appropriate
### Allocations and Clones Reviewed at Boundaries

## 5. CHECKLIST TEMPLATE
## 6. VALIDATION COMMANDS
## 7. RELATED RESOURCES
```

This preserves the checklist’s priority model, checkbox-plus-evidence structure, formal review handoff, validation commands, and related resources. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:20-401]

### `manual_testing_playbook/language-standards/NNN-rust-standards.md`

```markdown
---
id: OC-NNN
category: language-standards
title: 'Rust standards routing'
expected_intent: RUST
expected_resources:
  - references/rust/style_guide.md
  - references/rust/quality_standards.md
  - references/rust/quick_reference.md
version: 1.0.0.0
---

# OC-NNN: Rust standards routing

## 2. SCENARIO CONTRACT

- Prompt: `For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.`
- Expected intent: `RUST`

**Exact prompt**:
```text
For an OpenCode Rust napi-rs or WASM module, apply the Rust standards and TypeScript parity contracts before I implement a feature.
```
```

This reproduces the existing playbook structure while removing its frontmatter/body intent mismatch. [SOURCE: .opencode/skills/sk-code/code-opencode/manual_testing_playbook/language-standards/001-typescript-standards.md:1-23]

### Required Router Registration

**Inferred additions to `SKILL.md`:**
- Add Rust to the language-standard reference map.
- Add a `RUST` intent signal covering `rust`, `.rs`, `cargo`, `napi-rs`, `wasm-bindgen`, and `wasm`.
- Add `references/rust/style_guide.md`, `quality_standards.md`, and `quick_reference.md` under `RESOURCE_MAP.RUST`.
- Add `assets/checklists/rust_checklist.md` under `CODE_QUALITY`.
- Add Rust to the surface description and language-detection prose.
- Add the parity invariant under surface non-negotiables.

These locations are dictated by the existing detector, intent signal map, resource map, checklist map, and non-negotiables section. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:14-18] [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:42-117] [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-131]

### Encode-this

- `(style_guide)` Require numbered, all-caps H2 sections; use H3 for focused decisions; include rules, examples, exceptions, and rationale. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/style_guide.md:20-57]
- `(style_guide)` Reserve a dedicated `RUST/TYPESCRIPT INTEROP AND COEXISTENCE` section for napi-rs, wasm-bindgen, generated bindings, JS-visible names, and boundary representations.
- `(quality_standards)` State that Rust modules are compatibility implementations of existing TypeScript behavior, not independent behavior authorities. Contract: **TypeScript/Rust behavioral parity**.
- `(quality_standards)` Require exact six-decimal formatting at every JS-visible textual or byte boundary. Contract: **six-decimal float formatting**.
- `(quality_standards)` Require total ordering with explicit deterministic tie-breaks; never rely on unstable or incidental collection order. Contract: **stable sort/tie-break parity**.
- `(quality_standards)` Require deterministic ID generation from the same canonical inputs and algorithm used by TypeScript. Contract: **deterministic ID parity**.
- `(quality_standards)` Prohibit exposing hash-map, hash-set, or parallel iteration order to serialized or returned output. Contract: **deterministic hash/iteration order**.
- `(quality_standards)` Require canonical field order, omission behavior, number representation, and byte encoding for serialized outputs. Contract: **byte-for-byte serialization parity**.
- `(quality_standards)` Require one shared deterministic core with thin napi-rs and wasm-bindgen adapters. Contract: **native-addon/WASM parity**.
- `(quick_reference)` Include copy-paste recipes for exact float formatting, stable sorting, deterministic IDs, ordered serialization, panic translation, and three-way TypeScript/native/WASM golden tests.
- `(checklist)` Classify every observable parity violation as P0; stylistic Rust idioms that cannot affect output remain P2.
- `(checklist)` Require golden fixtures comparing TypeScript, napi-rs, and WASM output byte-for-byte before commit. Contract: **three-way parity gate**.
- `(checklist)` Preserve the P0/P1/P2 enforcement model and end with review evidence, validation commands, and related resources. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:26-33] [SOURCE: .opencode/skills/sk-code/code-opencode/assets/checklists/typescript_checklist.md:357-401]
- `(quick_reference)` Keep explanations in `style_guide.md` and `quality_standards.md`; the quick reference contains concise templates and executable recipes. [SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/quick_reference.md:20-30]
- `(quality_standards)` Put the central Rust parity invariant in `SKILL.md`, detailed policies in `quality_standards.md`, P0 enforcement in `rust_checklist.md`, and compliant snippets in `quick_reference.md`. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-125]
