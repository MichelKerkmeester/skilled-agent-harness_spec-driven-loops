---
title: "Code Graph Phase 011: Parser stopped silently failing in production"
description: "The MCP server runs from a compiled dist directory. The tree-sitter parser was loading grammars via a relative path that did not exist there. The parser fell back to a regex extractor that caught only the first three callable nodes per file, leaving 60-80% of symbols missing from the index."
trigger_phrases:
  - "phase 011 changelog"
  - "tree-sitter dist path fix"
  - "cross-file calls resolution"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-03

> Spec folder: `026-graph-and-context-optimization/005-code-graph/010-broader-excludes-and-granular-skills` (Level 2)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

This was the worst silent regression in the entire code-graph track.

The MCP server runs from a compiled `dist/` directory. The tree-sitter parser (the engine that reads source files and extracts symbols) loads its language grammars (TypeScript, JavaScript, Python, bash) from `.wasm` files. The original grammar path was a relative walk: `../../node_modules/tree-sitter-wasms/out/...`. That relative path was correct from the source location at `code_graph/lib/`, but **wrong from the compiled location at `dist/code_graph/lib/`** because `dist/` has no `node_modules` child.

The parser load silently failed. The parser then fell back to a regex extractor that only caught the first three callable nodes per file. Result: 60 to 80 percent of symbols were missing from the index in production, and the only signal something was wrong was that searches felt thin.

After this phase, the parser uses Node's built-in module resolution (`require.resolve('tree-sitter-wasms/package.json')`), which works regardless of whether the code runs from source or compiled output. Cross-file `CALLS` edges that used to disappear into "unresolved" now actually resolve to their target functions, and the readiness contract reports correct freshness and recommended actions.

### Added

- Granular per-skill scope controls on top of the phase 009 foundation. You can now opt in to specific skill folders rather than all-or-nothing.
- Stored scope fingerprint v2 with sorted include and exclude globs so two scans with the same scope but different glob ordering produce the same fingerprint.

### Changed

- Grammar resolution moved from a fragile relative path to a proper module resolution call. Both source and compiled locations now resolve to the same `.wasm` files.
- Cross-file `CALLS` edge resolution upgraded to actually link function calls across files. The previous logic produced unresolved edges in most cross-file cases.
- Readiness contract output upgraded with concrete `freshness` and `action` fields so callers know whether a scan is needed and what kind.

### Fixed

- The dist-vs-source path bug. This was a P0 silent regression that left the index 60-80 percent incomplete in production.
- Cross-file `CALLS` edges that were being recorded as unresolved when both files were in scope.
- Readiness state transitions that produced stale `action: 'full_scan'` recommendations on already-fresh indexes.

### Verification

- A fresh broad-scope scan after the fix produced 56,843 nodes, an order of magnitude more than the regex-fallback baseline of around 5,000 nodes.
- Vitest suite for `code_graph` passed.
- Manual probe: `code_graph_query({ operation: 'calls_to', subject: 'someFn' })` returned cross-file callers that previously came back empty.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/tree-sitter-parser.ts` | New `getGrammarPath()` helper uses `require.resolve` against `tree-sitter-wasms/package.json`. Falls back to the legacy relative walk only when resolution fails. |
| `code_graph/lib/structural-indexer.ts` | Cross-file `CALLS` edge resolution upgraded to follow imports through the symbol table. |
| `code_graph/lib/index-scope-policy.ts` | Added per-skill granular controls and v2 fingerprint with sorted globs. |
| `code_graph/handlers/status.ts` | Readiness fields refined. |

Commit: `49e5f48c6`.

### Follow-Ups

- Phase 012/007 later discovered that tree-sitter-bash.wasm itself ships with a missing exported symbol that causes a different kind of failure on certain bash content. That fix is independent of the path fix delivered here.
