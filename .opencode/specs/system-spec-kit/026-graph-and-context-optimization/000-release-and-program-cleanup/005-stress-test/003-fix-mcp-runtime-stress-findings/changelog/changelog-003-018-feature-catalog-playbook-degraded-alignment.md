---
title: "Catalog and playbook degraded-alignment: docs align three operator surfaces with the shipped code-graph degraded-readiness envelope"
description: "Three documentation surfaces updated to match the shipped runtime contract: per-handler fallbackDecision bullets in the auto-trigger catalog page, shared-vocabulary plus handler-local shape paragraphs in the readiness-contract catalog page. rankingSignals corrected from object to array of strings in the CocoIndex routing playbook."
trigger_phrases:
  - "catalog playbook degraded alignment"
  - "018 feature catalog degraded"
  - "rankingSignals array of strings"
  - "fallbackDecision per-handler bullets"
  - "code graph readiness contract handler-local"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/018-feature-catalog-playbook-degraded-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

Three operator-facing documentation surfaces drifted from the shipped runtime contract in ways that led operators to construct wrong payloads and misread handler response shapes. The auto-trigger catalog page described `fallbackDecision` recovery routing as a single universal contract across handlers. The readiness-contract catalog page implied one shared response type covers all three handlers. The CocoIndex routing playbook described `rankingSignals` as an object instead of an array of strings.

This packet corrected all three surfaces. The auto-trigger page now lists per-handler bullets for `code_graph_query`, `code_graph_context` plus `code_graph_status` and carries a footnote pointing at packet 016 for the canonical context readiness-crash field. The readiness-contract page now states the rule explicitly: shared vocabulary (`readiness`, `canonicalReadiness`, `trustState`) with handler-local payload fields, backed by concrete per-handler paragraphs. The playbook page now states `rankingSignals (array of strings)` matching the Zod schema `z.array(z.string()).optional()` at `mcp_server/schemas/tool-input-schemas.ts:482-492` and updates the Pass/Fail criterion accordingly. Operators following any of these pages now construct correct payloads on the first try.

### Added

None.

### Changed

- Auto-trigger catalog page: single `fallbackDecision` bullet split into three per-handler bullets (query, context, status) with a `[^c016]` footnote pointing at packet 016's implementation-summary for the canonical context readiness-crash field path
- Readiness-contract catalog page: explicit "shared vocabulary, handler-local payload fields" rule added, followed by three concrete per-handler paragraphs covering `code_graph_query`, `code_graph_context` plus `code_graph_status`
- CocoIndex routing playbook page: `rankingSignals (object)` corrected to `rankingSignals (array of strings)`, Zod schema line range `mcp_server/schemas/tool-input-schemas.ts:482-492` cited, Pass/Fail criterion updated to assert `Array<string>` shape

### Fixed

- Auto-trigger catalog page implied a universal `fallbackDecision` contract across all handlers. It now accurately describes per-handler recovery-routing payloads.
- Readiness-contract catalog page implied one shared response type covers all three handlers. It now states the shared-vocabulary rule and per-handler shape explicitly.
- CocoIndex routing playbook described `rankingSignals` as an object. Operators constructing telemetry payloads now see the correct `Array<string>` shape on the first read.

### Verification

| Check | Result |
|-------|--------|
| Auto-trigger catalog page re-read | PASS. Three per-handler bullets present (query, context, status). Footnote `[^c016]` cites absolute spec-folder path of 016's implementation-summary and the review-report §3 / §7 Packet A as binding-expectation fallback. |
| Readiness-contract catalog page re-read | PASS. Explicit "shared vocabulary, handler-local payload fields" rule present. Three per-handler paragraphs (query, context, status) present. |
| CocoIndex routing playbook page re-read | PASS. Wording is `rankingSignals (array of strings)`. Expected paragraph cites `mcp_server/schemas/tool-input-schemas.ts:482-492`. Pass/Fail asserts `Array<string>` shape. |
| Cross-doc consistency check | PASS. "shared vocabulary, handler-local payload fields" appears verbatim in both feature catalog pages. |
| No code files modified (REQ-004) | PASS per commit `d8a100ee`. Only `.md` and `.json` files appear in the diff for this packet's working set. |
| Packet validation (`validate.sh --strict`) | PENDING. Final validator run to be confirmed by operator. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` | Modified | Per-handler bullets for query, context, status. Footnote citing 016 implementation-summary by absolute path. |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Modified | Shared-vocabulary rule stated explicitly. Concrete per-handler shape paragraphs added. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | Modified | `rankingSignals (array of strings)` with Zod schema cite. Pass/Fail criterion updated. |
| `spec.md` | Created | Packet spec documenting REQ-001 through REQ-006. |
| `plan.md` | Created | Packet plan. |
| `tasks.md` | Created | Packet tasks (T101-T104). |
| `checklist.md` | Created | Packet verification checklist. |
| `description.json` | Created | Spec metadata (specId 018). |
| `graph-metadata.json` | Created | Graph metadata with parent_id 011 and dependency edges to 016, 014, 015. |
| `implementation-summary.md` | Created | Full implementation narrative with What Was Built, How It Was Delivered, Key Decisions, Verification. |

### Follow-Ups

- Run `validate.sh --strict` against the packet folder to record a final PASS for SC-002.
- Once packet 016 is fully landed, re-read the auto-trigger catalog page to confirm the `[^c016]` footnote wording is still accurate against 016's shipped contract. If 016 ships a different field name than `fallbackDecision`, queue a Packet C-prime single-edit patch.
- Confirm `git diff --name-only` for the packet's working set shows no `.ts`, `.js`, `.py`, `.sh` files (REQ-004 and SC-004 evidence).
