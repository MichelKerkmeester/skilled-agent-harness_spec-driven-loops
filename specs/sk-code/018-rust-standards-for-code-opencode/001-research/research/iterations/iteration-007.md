<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 7 angle A7 — New-language registration mechanics -->

SKILL ROUTING: User specified “ONE round of a deep-research pass” → `deep-research`. I’ll inspect the workflow contract, then trace the requested routing and drift-guard files without modifying the repository.
The checked-in layout differs from the prompt’s premise: the parent `SKILL.md` contains the registry router but no `RESOURCE_MAP` union. I’m tracing the actual union projection and its guard now so the final distinguishes confirmed mechanics from inferred changes rather than inventing parent lines.
## Round 7 — A7: New-Language Registration Mechanics

### Confirmed Topology

**[CONFIRMED]** Language registration is subordinate to the existing `OPENCODE` surface, not a new `sk-code` mode or surface. The parent hub routes workflow and surface packets through `mode-registry.json`; language-specific resource slicing happens inside `code-opencode`. [SOURCE: .opencode/skills/sk-code/SKILL.md:48-57] [SOURCE: .opencode/skills/sk-code/SKILL.md:86-117]

**[CONFIRMED]** `code-opencode` uses two-stage detection:

1. Work under `.opencode/` selects the `OPENCODE` surface.
2. Extensions and local markers select the language-specific standards. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:16-18]

The shared detection contract confirms extension-first sub-detection and maps each language to `code-opencode/references/<language>/`. [SOURCE: .opencode/skills/sk-code/shared/references/stack_detection.md:84-97]

**[CONFIRMED]** The prompt's statement that the parent `.opencode/skills/sk-code/SKILL.md` contains the `RESOURCE_MAP` union is not literally true in the current tree. That file contains the mode-registry router and points routing responsibilities into nested packets and `shared/references/smart_routing.md`. [SOURCE: .opencode/skills/sk-code/SKILL.md:48-50] The actual parent surface-union projection is `.opencode/skills/sk-code/shared/references/smart_routing.md`, whose machine-readable block starts at line 297 and whose `RESOURCE_MAP` starts at line 341. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:297-301] [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:341-476]

### Existing Python Wiring

**[CONFIRMED]** Python demonstrates the complete language-registration path:

| Layer | Python registration |
|---|---|
| Surface prose detection | `.py` plus `argparse` selects Python. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:18] |
| Child intent signal | `PYTHON` recognizes `python`, `.py`, and `docstring`. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:56-65] |
| Child resource map | `PYTHON` loads the three files under `references/python/`. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:107-111] |
| Shared detection table | `.py` maps to `code-opencode/references/python/`. [SOURCE: .opencode/skills/sk-code/shared/references/stack_detection.md:84-94] |
| Parent intent projection | The parent machine block contains a `PYTHON` signal. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:334-338] |
| Parent resource projection | Python paths are re-prefixed with `code-opencode/`. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:466-470] |
| Human-facing overlay | The OpenCode language table names the Python trio and checklist. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:212-220] |
| Replay detection | `.py` or `argparse` selects `python`; `python` is in `OPENCODE_LANGUAGES`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:362-373] |
| Folder guard | `python` appears in `KNOWN_LANGUAGES`. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py:13-16] |
| Quality checklist | `python_checklist.md` is part of `CODE_QUALITY`. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:77-83] |
| Alignment verifier | `.py` is discovered and dispatched to Python-specific checks. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:31-42] [SOURCE: .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:288-313] |
| Hub vocabulary | `python` is a lexical signal for the existing `code-opencode` surface. [SOURCE: .opencode/skills/sk-code/hub-router.json:66-73] |

Rust should follow this chain, while its authored standards remain specifically about napi-rs/WASM boundaries and byte-for-byte parity rather than greenfield Rust services.

### Child Registration

**[INFERRED RECOMMENDATION]** Add Rust to the `code-opencode` detection paragraph:

> `.rs`, with `Cargo.toml` or `Cargo.lock` as local fallback markers, selects Rust after the `OPENCODE` surface has already been established.

This preserves the current surface-first architecture and extension-first language selection. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:16-18] [SOURCE: .opencode/skills/sk-code/shared/references/stack_detection.md:84-97]

**[INFERRED RECOMMENDATION]** Add this exact child intent entry:

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
        "cdylib",
    ],
},
```

The key and unit weight match the existing language entries. The keyword set intentionally identifies Rust through the repo's actual Node/WASM boundary vocabulary rather than generic backend terminology. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:56-66]

**[INFERRED RECOMMENDATION]** Add this exact child resource entry:

```python
"RUST": [
    "references/rust/style_guide.md",
    "references/rust/quality_standards.md",
    "references/rust/quick_reference.md",
],
```

This mirrors the JavaScript, TypeScript, Python, and shell three-document contract. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:97-116]

The three documents must encode napi-rs/WASM interoperability and deterministic parity requirements, including six-decimal formatting, stable ordering and tie-breaks, deterministic IDs, and deterministic hash/iteration behavior. A generic Rust service guide would satisfy routing shape while failing the required behavioral contract.

**[INFERRED RECOMMENDATION]** Complete the child packet wiring:

- Add `Rust — references/rust/` to the human-facing reference map. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:26-34]
- Add `assets/checklists/rust_checklist.md` to `CODE_QUALITY`. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:77-83]
- Add `rust_checklist.md` to the language-quality asset inventory. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:127-133]
- Add `rust` to `KNOWN_LANGUAGES`; otherwise `references/rust/` is reported as an orphan folder. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py:13-33]
- Add `.rs: "rust"` to `SUPPORTED_EXTENSIONS` if the alignment verifier is expected to include Rust files. Its current discovery loop ignores every extension absent from that dictionary. [SOURCE: .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:31-42] [SOURCE: .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py:116-129]

### Parent Union

**[INFERRED RECOMMENDATION]** Add `RUST` to the machine-readable parent projection in `shared/references/smart_routing.md`:

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
        "cdylib",
    ],
},
```

Also extend `LANGUAGE_STANDARDS` with the same Rust-identifying terms so broad “language standards” routes remain discoverable. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:319-339]

The corresponding parent `RESOURCE_MAP` entry must be the child paths with exactly one `code-opencode/` prefix:

```python
"RUST": [
    "code-opencode/references/rust/style_guide.md",
    "code-opencode/references/rust/quality_standards.md",
    "code-opencode/references/rust/quick_reference.md",
],
```

That prefix transformation is the enforced formula: `${surface}/${child-relative-path}`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:168-180]

If `rust_checklist.md` is added to the child `CODE_QUALITY` entry, the parent `CODE_QUALITY` entry must contain:

```text
code-opencode/assets/checklists/rust_checklist.md
```

The guard compares resources per intent, so placing the checklist only under `RUST` would not mirror the child's `CODE_QUALITY` ownership. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:168-192]

The human-facing OpenCode language overlay must also gain a `RUST` row naming the trio and checklist. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:193-220]

### Runtime Detection

**[INFERRED RECOMMENDATION]** Extend `stack_detection.md` with:

```markdown
| RUST | `.rs`; fallback markers `Cargo.toml`, `Cargo.lock` | `code-opencode/references/rust/` |
```

Markers must be evaluated only after `OPENCODE` wins surface detection; otherwise an unrelated Cargo project outside `.opencode/` could be incorrectly claimed by this surface. The current contract explicitly detects surface before language. [SOURCE: .opencode/skills/sk-code/shared/references/stack_detection.md:16-30] [SOURCE: .opencode/skills/sk-code/shared/references/stack_detection.md:84-97]

**[INFERRED RECOMMENDATION]** Update deterministic router replay as executable parity with the authored router:

- Add `.rs`, `cargo.toml`, and `cargo.lock` to the OpenCode surface regex. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:351-360]
- Add `rust` to `OPENCODE_LANGUAGES`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:362-367]
- Detect Rust from `.rs`, Cargo markers, `napi-rs`, or `wasm-bindgen`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:367-373]
- Add routing fixtures covering `.rs`, Cargo-only, napi-rs, wasm-bindgen, and Rust-plus-TypeScript parity prompts.

There is a contract conflict that must be resolved for Rust. `code-opencode/SKILL.md` says “one language per task,” while shared detection says multi-language changes load every touched language. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:120-125] [SOURCE: .opencode/skills/sk-code/shared/references/stack_detection.md:97-99] The replay currently returns only one language and filters all other language folders. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:366-373] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:440-455]

For napi-rs/WASM work, this cannot remain first-match-only: Rust and TypeScript frequently constitute one parity boundary. The correct model is a detected-language set, loading Rust plus every touched boundary language while retaining shared guidance. This directly protects byte-for-byte parity reviews from losing either side of the implementation.

### Registry Files

**[CONFIRMED]** `mode-registry.json` requires no new mode. `code-opencode` is already the registered read-only `surface` packet with `backendKind: evidence-base`; Rust is a language slice inside that packet. [SOURCE: .opencode/skills/sk-code/mode-registry.json:80-97]

**[INFERRED RECOMMENDATION]** Do not add a `rust` `workflowMode`, packet, or surface entry to `mode-registry.json`. Such an entry would incorrectly elevate a language into a separate advisor-visible routing axis, contrary to the current packet model. [SOURCE: .opencode/skills/sk-code/mode-registry.json:5-18] [SOURCE: .opencode/skills/sk-code/SKILL.md:52-57]

**[INFERRED RECOMMENDATION]** Update only `hub-router.json`'s existing `code-opencode-runtime` vocabulary:

```json
"keywords": [
  "typescript",
  "python",
  "shell",
  "json",
  "jsonc",
  "config",
  "rust",
  ".rs",
  "cargo.toml",
  "cargo.lock",
  "napi-rs",
  "wasm-bindgen"
]
```

The `code-opencode` router signal already consumes that vocabulary class and points to `code-opencode/SKILL.md`; no new signal or resource pointer is required. [SOURCE: .opencode/skills/sk-code/hub-router.json:27-36] [SOURCE: .opencode/skills/sk-code/hub-router.json:66-73]

### Drift Guard

**[CONFIRMED]** The relevant union guard is outside the `sk-code` subtree:

```text
.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
```

`shared/references/smart_routing.md` names this file and provides its standalone Vitest command. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:297-301]

It checks:

- The machine router parses and produces more than 50 paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:85-90]
- Every machine-router path resolves under the hub or a registered packet root. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:92-98]
- Hub-root routable reference/asset Markdown is represented, excluding three internal routing documents. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:23-28] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:52-67] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:100-105]
- Every explicit full path extracted from the prose surface maps appears in the machine map. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:70-83] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:107-110]
- Each child surface has a non-empty map and every child path exists relative to that child. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:144-166]
- For every intent, the parent map equals the set-union of child paths re-prefixed with `code-webflow/` or `code-opencode/`, plus a fixed parent-owned allowlist. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:113-134] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:168-192]

The equality is set-based, not byte-order-based: it detects missing child projections, parent surface paths owned by no child, and non-surface parent paths outside the allowlist, but it does not enforce list ordering or duplicate preservation. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:177-192]

### Encode-this

- **(style_guide)** Register Rust only inside the existing `code-opencode` surface; never create a Rust workflow mode or independent surface. [Contract: napi-rs/WASM interop boundary]
- **(quick_reference)** Detect Rust after `OPENCODE`: `.rs` first, then local `Cargo.toml`/`Cargo.lock`, napi-rs, or wasm-bindgen markers.
- **(quality_standards)** Load `references/rust/{style_guide,quality_standards,quick_reference}.md`; those documents must prioritize Node/WASM ABI behavior and byte-for-byte parity over greenfield-service conventions. [Contract: six-decimal formatting, stable sort/tie-breaks, deterministic IDs, deterministic hash/iteration order]
- **(checklist)** Add `rust_checklist.md` to child and parent `CODE_QUALITY` maps and require parity fixtures that compare Rust output byte-for-byte with the TypeScript implementation. [Contract: TypeScript/Rust parity]
- **(quick_reference)** Mirror child `RUST` paths in the parent projection by prepending exactly `code-opencode/`.
- **(quality_standards)** Replace first-match OpenCode language filtering with a touched-language set for Rust interop work; Rust-plus-TypeScript tasks must load both standards slices. [Contract: napi-rs/WASM boundary parity]
- **(checklist)** Add `rust` to `KNOWN_LANGUAGES`, `.rs` to verifier discovery, Rust vocabulary to `hub-router.json`, and Rust detection to `router-replay.cjs`.
- **(checklist)** Run the router-sync Vitest guard and the stack-folder guard; require no dead child paths, no missing parent projection, and no orphan `references/rust/` folder.
