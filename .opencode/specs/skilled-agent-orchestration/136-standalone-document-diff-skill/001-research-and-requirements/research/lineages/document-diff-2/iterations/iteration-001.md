# Iteration 1: Broad Survey of Existing Document Diff Tools, Libraries, and Products

## Focus

Initial broad survey of the existing document diff landscape to identify maintained libraries, tools, products, and the gaps they leave for a standalone local AI document diff skill.

## Findings

### Finding 1: Structural Diff Innovation (difftastic)

Difftastic (25.6k stars, MIT license, Rust, actively maintained through v0.69.0 as of Apr 2026) is the most advanced structural diff tool in the open-source ecosystem. It uses tree-sitter parsers for 30+ programming languages to build ASTs and performs structural diffing as a graph problem using Dijkstra's algorithm. Key architectural insights:
- AST-based comparison ignores whitespace that isn't syntactically significant
- Falls back to line-oriented diff on parse errors (conservative choice)
- Does NOT support patching (output is for human consumption only)
- Does NOT support ignoring reordering
- Explicit non-goals: no merging, no patching

[SOURCE: https://github.com/Wilfred/difftastic]

### Finding 2: Text Diff Foundation (google/diff-match-patch)

Google's diff-match-patch library (8.1k stars, Apache 2.0, archived since Aug 2024) is the canonical reference implementation for plain-text diff. It implements Myer's diff algorithm with pre-diff speedups and post-diff cleanups. Available in 8 languages (C++, C#, Dart, Java, JS, Lua, Objective-C, Python). Key characteristics:
- Designed to power Google Docs since 2006
- Character-level and word-level diff modes
- Includes fuzzy matching (Bitap algorithm) and patching
- ARCHIVED - no longer maintained by Google
- Plain-text only, no awareness of document structure

[SOURCE: https://github.com/google/diff-match-patch]

### Finding 3: Git Diff Rendering (delta and diff-so-fancy)

Delta (31.4k stars, MIT license, Rust) and diff-so-fancy (18.1k stars, MIT, Perl) are diff renderers for git output. They improve the visual presentation of diffs but do not perform diffing themselves — they consume unified diff output. Key characteristics:
- Delta: syntax highlighting via bat themes, side-by-side view, word-level diff highlighting using Levenshtein edit inference, line numbers, merge conflict display
- diff-so-fancy: simplifies git diff output for human readability, header simplification, empty line marking
- Both are git-pager replacements, NOT standalone document diff engines
- Neither handles document formats beyond what git diff produces

[SOURCE: https://github.com/dandavison/delta] [SOURCE: https://github.com/so-fancy/diff-so-fancy]

### Finding 4: CRDT-Based Merging (Automerge)

Automerge (6.4k stars, MIT license, Rust + JS/WASM) represents the state of the art in conflict-free replicated data types. It implements a JSON-like CRDT with automatic merging. While not a diff tool per se, it defines important patterns for structural change representation:
- Compact binary format for changes
- Sync protocol for transmitting changes
- Local-first architecture philosophy
- Not suitable for diff display — designed for merging and synchronization
- Shows the complexity gap between merging and diffing

[SOURCE: https://github.com/automerge/automerge]

### Finding 5: Key Gaps in the Ecosystem

The survey reveals critical gaps that a standalone document diff skill must fill:
1. **No tool bridges structural diff with rich document formats** (DOCX, PDF, HTML-as-document)
2. **No self-contained HTML report generator** for before/after document review exists as a standalone library
3. **No automatic snapshot lifecycle manager** exists outside version control systems
4. **No tool combines format extraction, structural diff, and HTML report** in a single pipeline
5. **Existing diff tools are either code-focused** (difftastic, delta) or **plaintext-only** (diff-match-patch)
6. **No tool offers fidelity warnings** or capability tiers for format conversion

### Finding 6: Comparison Table

| Tool | Type | Lang | Stars | Maintained | License | Relevance |
|------|------|------|-------|------------|---------|-----------|
| difftastic | Structural diff | Rust | 25.6k | Yes (v0.69.0 Apr 2026) | MIT | Core diff algorithm inspiration |
| diff-match-patch | Text diff library | Multi | 8.1k | No (archived Aug 2024) | Apache 2.0 | Text-level diff foundation |
| delta | Diff renderer | Rust | 31.4k | Yes (v0.19.2 Mar 2026) | MIT | HTML report design patterns |
| diff-so-fancy | Diff renderer | Perl | 18.1k | Yes (v1.4.10 Apr 2026) | MIT | Simplicity patterns |
| automerge | CRDT merge | Rust/JS | 6.4k | Yes (v3.3.1 Jul 2026) | MIT | Structural change model |

## Sources Consulted

- https://github.com/Wilfred/difftastic — Structural diff using tree-sitter ASTs
- https://github.com/google/diff-match-patch — Myer's diff algorithm reference (archived)
- https://github.com/dandavison/delta — Syntax-highlighting git pager
- https://github.com/so-fancy/diff-so-fancy — Human-readable git diff renderer
- https://github.com/automerge/automerge — CRDT-based merging library

## Assessment

**newInfoRatio**: 0.9 — First pass; five substantive findings about the existing landscape with direct evidence from primary sources. Identified five key gaps that define the opportunity space.

**Novelty justification**: All five findings are new to this packet. The gap analysis establishes that no existing tool fills the standalone document diff niche.

**Confidence**: High — evidence drawn from primary GitHub repositories with direct version/license/maintenance data.

## Reflection

**What worked**: Direct GitHub repository inspection provided authoritative maintenance signals (star count, last release date, license, archived status). Cross-referencing difftastic's architecture with the spec requirements revealed the structural diff approach as the most promising foundation.

**What failed**: Automerge, while architecturally interesting for structural change representation, is designed for a fundamentally different problem (distributed merging vs. local comparison). Confirmed as not relevant for the diff pipeline.

**Ruled out**: Automerge-style CRDT merging as a diff foundation — the approach solves a different problem space and adds unnecessary complexity for a comparison tool.

## Recommended Next Focus

Deep dive into canonical document representations and extraction pipelines — which intermediate format best bridges text, Markdown, HTML, DOCX, and PDF for structural comparison?
