---
title: "Changelog: Code Graph - Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease) [002-code-graph/008-doc-symbol-lane]"
description: "Chronological changelog for the Code Graph - Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/008-doc-symbol-lane` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

This phase adds two independent capabilities. The code graph doc lane now indexes markdown headings and config keys as stable `heading` and `key` nodes, using deterministic ids and local parsing only. The launcher also gains lease-transition classification routed through a no-op metrics sink until a real sink exists.

### Added

- `heading` and `key` symbol kinds, using the existing kind-agnostic id helper.
- `extractMarkdownHeadings(content)` with ATX, Setext and fenced-code handling.
- `extractConfigKeys(content, language)` for json, jsonc, yaml, yml and toml keys.
- Non-code render tolerance for heading and key nodes.
- Sink-agnostic lease metric emission that defaults to no-op.

### Changed

- The `language === 'doc'` branch now emits extracted nodes and edges instead of an empty content-hash row.
- Markdown remains opt-in through globs, while config files exercise the lane by default.
- Existing content hash, clean parse health and detector provenance behavior are preserved.

### Fixed

- The doc lane is no longer write-only for config files and opted-in markdown files.
- Lease lifecycle transitions now have stable classes without changing lease decisions.
- Fenced markdown headings, malformed json and nested config-key cases are covered.

### Verification

- Markdown-heading extraction, including ATX, Setext, fenced-skip and nesting - PASS: `doc-symbol-extractor.vitest.ts`
- Config-key extraction for json, jsonc, yaml, yml and toml - PASS: `doc-symbol-extractor.vitest.ts` and persistence counts in `code-graph-indexer.vitest.ts`
- SymbolKind union admits `heading` and `key`, with stable ids
- Non-code render tolerance in `code-graph-context` - PASS: `code-graph-context-handler.vitest.ts`
- Idempotence, rescan yields byte-identical doc nodes and edges - PASS: `doc-symbol-extractor.vitest.ts`
- Markdown glob decision recorded - PASS, markdown remains opt-in while config docs exercise the lane
- Lease classifier per transition with no-op-default emit - PASS: `launcher-lease.vitest.ts`
- Strict phase validation - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/doc-symbol-extractor.ts` | Added | Extracts markdown headings and config keys into stable document symbols |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modified | Extends symbol kinds for doc nodes |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Replaces the empty doc branch with extractor output |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Renders heading and key nodes safely |
| `.opencode/skills/system-code-graph/mk-code-index-launcher.cjs` | Modified | Adds lease-transition classification and no-op metric emission |
| `.opencode/skills/system-code-graph/mcp_server/tests/doc-symbol-extractor.vitest.ts` | Added | Covers heading, config-key and idempotence behavior |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | Modified | Covers persistence-facing doc node counts |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Covers lease-transition classes |

### Follow-Ups

- No commit was created by request, so evidence is the local diff plus verification commands.
- Markdown stays opt-in until a caller adds markdown globs.
- Lease metrics still need a real sink before dashboards or alerts can consume them.
- No benefit number is measured. This phase proves capability and regression safety, not retrieval lift.
