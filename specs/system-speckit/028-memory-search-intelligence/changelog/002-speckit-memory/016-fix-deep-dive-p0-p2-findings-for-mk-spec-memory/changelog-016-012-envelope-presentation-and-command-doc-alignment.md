---
title: "Changelog: Envelope Presentation and Command-Doc Alignment [016/012-envelope-presentation-and-command-doc-alignment]"
description: "Collapsed the memory_search envelope to a single casing, closed a pagination cursor tenant leak and re-aligned the drifted command-doc claims across both command trees behind a new byte-parity gate."
trigger_phrases:
  - "envelope presentation changelog"
  - "cursor scope tenant leak fix"
  - "command tree byte parity"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/012-envelope-presentation-and-command-doc-alignment/` (Level 2)
> Parent packet: `.opencode/specs/system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The `memory_search` envelope was 17.6KB for five results. Every telemetry block was emitted twice, once camelCase and once snake_case. The token budget was enforced before the graph, routing and envelope data were attached, so `meta.tokenCount` described a payload that no longer existed. This phase emits exactly one casing per block. It moves budget enforcement to after attach so `tokenCount` reflects the final payload. It compacts metadata before result rows when over budget. A pagination cursor tenant leak was closed. The two command trees had about 18 claims drifted from code and those were re-aligned, including the tool count from 39 to 41. A new byte-parity validate rule now fails on drift between the trees. The live 5-result envelope under 6KB target is a daemon-side capture pending, the structural reductions are unit-verified. Shipped in `a24517e016`.

### Added

- A byte-parity script comparing the two command trees, wired into `validate.sh` as a new `COMMAND_TREE_PARITY` rule.

### Changed

- The envelope emits one casing per block, camelCase, with the snake_case twins removed and their readers updated.
- Budget enforcement moves to after attach so `meta.tokenCount` reflects the final serialized payload within ten percent.
- `memory_context`'s delegated search envelope is de-nested with structured `data` at the top level instead of a JSON-in-string blob.
- The CLI `--format text` path renders one minimal row per result with an explicit notice for suppressed blocks.
- The command-doc battery was re-aligned in both trees. The tool count corrected from 39 to 41 because phase 009 added two tools, `/spec_kit:resume` corrected to `/speckit:resume`, the hybrid-decay default documented as on and the `code_graph_scan` and `code_graph_status` rows corrected to their real direct-MCP surface.

### Fixed

- The pagination cursor stored a server-side `scopeKey` but trusted the client offset, so a forged or cross-scope cursor could walk another tenant's result set. The resolve path now requires the decoded offset to match the server's recorded `nextOffset` for that scopeKey and denies a forged or tampered cursor.
- Session-dedup marks a result sent only after budget truncation, so a trimmed row is re-eligible on the next call.
- A row gets the `semantic_match` label only when vector attribution is real.
- A resume-ladder row reports `fingerprintStatus:'verified'` only when an expected fingerprint was actually compared.

### Verification

- `npx tsc --build` exit 0.
- 012 targeted vitest 601 passed, 15 skipped, across 13 suites. Integrated sweep 563 passed.
- REQ verification by three parallel xhigh reviewers, 6 of 12 on the first pass then 12 of 12.
- Cursor tenant leak closed. Server-side offset match and forged-cursor denial confirmed.
- Doc-drift battery reported zero in-scope drift and the dual-tree byte-parity holds.
- `validate.sh --strict` pass.
- Live 5-result envelope under 6KB not measured. Daemon-side capture pending.

### Files Changed

- `mcp_server/handlers/memory-search.ts` emits the single-casing envelope.
- `mcp_server/lib/search/progressive-disclosure.ts` moves the budget after attach.
- `mcp_server/handlers/memory-context.ts` de-nests the delegated envelope.
- `scripts/validate-command-tree-parity.sh` is the new parity gate.

### Follow-Ups

- The live envelope byte count is daemon-side. Run the live capture after the daemon leases restart.
- Code effects apply on the next daemon-lease restart.
