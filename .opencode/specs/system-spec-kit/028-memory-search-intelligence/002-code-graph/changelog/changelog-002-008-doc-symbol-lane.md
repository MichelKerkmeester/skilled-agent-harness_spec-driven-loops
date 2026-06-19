---
title: "Changelog: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease) [002-code-graph/008-doc-symbol-lane]"
description: "Chronological changelog for the Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease) phase."
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

This sub-phase built two independent, additive capability adds against confirmed seams. The code graph's doc lane now stops being a write-only content-hash and starts answering questions: markdown headings become queryable heading nodes nested by level, and json/jsonc/yaml/yml/toml keys become key nodes, all with deterministic ids that stay stable across rescans, all from a local regex/key walk with no LLM and no network. Track B gives the launcher its first lease-churn classification: lease lifecycle transitions get names and counter payloads, routed through a no-op-default sink until a real metrics sink exists.

### Added

- Confirm the SymbolKind union line and generateSymbolId kind-agnosticism (indexer-types.ts:13-16, :100) — union extended; existing ID helper used by new kinds
- Track A: add non-code render tolerance for heading/key kinds (REQ-004) (code-graph-context.ts)
- Track A: build extractMarkdownHeadings(content) — ATX ^#{1,6} + Setext, fenced-code-aware, parent-CONTAINS-child nesting by level, content-derived ids (REQ-001) (lib/doc-symbol-extractor.ts)
- Track A: build extractConfigKeys(content, language) — json/yaml/toml top-level + nested shallow key walk → key nodes, content-derived ids (REQ-002) (lib/doc-symbol-extractor.ts)
- [P] Track B: add the sink-agnostic emitLeaseMetric(class, …) stub, no-op default, no behavior change without a sink (REQ-008) (mk-code-index-launcher.cjs)
- CHK-001 Requirements documented in spec.md — REQ-001..008 cover deterministic heading/key extraction, SymbolKind extension, render tolerance, additive-off-boundary, glob decision, and the Q7 classifier + no-op emit

### Changed

- Confirm the live language === 'doc' early-return line range (currently :1237-1249) (.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts) — confirmed and replaced in the doc branch only
- [P] Inventory SymbolKind consumers + code-graph-context render path for closed-vocab assumptions — render path now has explicit heading/key coverage
- [P] Confirm the default-glob */.md omission and decide json/yaml/toml-first vs markdown opt-in — markdown remains opt-in; config docs exercise the lane by default
- [P] Confirm zero existing doc-symbol / lease-metric tokens — baseline had no extractor/emit tokens before this phase
- Track A: extend SymbolKind union with 'heading' \| 'key' (REQ-003) (indexer-types.ts:13-16)
- Track A: replace the empty if (language === 'doc') early-return with the extractor output, preserving contentHash/parseHealth:'clean'/detectorProvenance (REQ-001/002/005) (structural-indexer.ts:1237-1249)

### Fixed

- Track B: lease classifier returns the correct class per transition; emitLeaseMetric() no-ops with no sink and changes no lease decision (REQ-007/008)
- CHK-FIX-001 Each actionable finding has a finding class — doc-lane capability-add and launcher observability classes both implemented
- CHK-FIX-002 Same-class producer inventory completed, or instance-only proven by grep — the === 'doc' early-return is the single parse seam; launcher emit tokens were absent at baseline
- CHK-FIX-003 Consumer inventory completed for changed helpers/schema/response fields — SymbolKind consumers inventoried; context render path covered for heading and key
- CHK-FIX-004 Parser/redaction fixes include adversarial table tests — fenced-block #, ATX/Setext headings, malformed json, and nested config keys covered
- CHK-FIX-005 Matrix axes and row count listed before completion — axes covered: markdown heading variants, json/jsonc/yaml/yml/toml config formats, malformed json, and lease transition classes

### Verification

- Q5-C1 markdown-heading extraction (ATX/Setext, fenced-skip, nesting) - PASS — doc-symbol-extractor.vitest.ts
- Q5-C1 config-key extraction (json/jsonc/yaml/yml/toml shallow walk) - PASS — doc-symbol-extractor.vitest.ts; persistence-facing counts in code-graph-indexer.vitest.ts
- SymbolKind union admits `'heading' - 'key'`; stable ids
- Non-code render tolerance in code-graph-context - PASS — code-graph-context-handler.vitest.ts
- Idempotence — rescan yields byte-identical doc nodes/edges - PASS — doc-symbol-extractor.vitest.ts
- Markdown glob decision recorded (json/yaml/toml-first) - PASS — default globs remain markdown opt-in; config docs exercise the lane
- Q7-lease classifier per transition + no-op-default emit - PASS — launcher-lease.vitest.ts
- validate.sh --strict on this folder - To run after doc reconciliation

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- No commit hash. User requested no git commit, so evidence is the local dirty diff plus verification commands.
- Markdown stays opt-in. The heading extractor is inert for .md until */.md is added by a caller; json/yaml/toml exercise the lane immediately.
- Q7 has nowhere to emit by default. There is no metrics sink on the launcher today, so emitLeaseMetric() no-ops by default and no dashboard is wired. The classifier is the durable deliverable; actual telemetry is gated on a later sink decision.
- No benefit number is measured. The phase proves capability and regression safety, not retrieval lift.
