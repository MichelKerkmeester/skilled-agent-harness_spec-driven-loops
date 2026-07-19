---
title: "code_graph_scan"
description: "Manual maintenance tool that scans workspace files, indexes structural nodes/edges and optionally runs the gold-query verifier after explicit full scans."
trigger_phrases:
  - "code_graph_scan"
  - "system-code-graph feature catalog"
importance_tier: "important"
version: 1.2.0.13
---

# code_graph_scan

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`code_graph_scan` is the explicit refresh path for the structural graph. It supports incremental scans, full scans, Git HEAD full-reindex promotion, detector provenance summaries, edge enrichment summaries and optional gold-battery verification.

The reindex writer is bitemporal. When the default-off `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` flag is on, a reindex closes superseded edges by stamping `invalid_at` at the next graph generation instead of deleting them, so prior generations stay readable through the as-of readers. With the flag off the writer keeps its delete-and-replace behavior. The default-off `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` flag enables the staleness-repair reverse-dependency expansion: when a stale file's reindex changes its symbol identity, every importer of that file is pulled back into the parse batch so cross-file edges rebind to the new symbol ids. That expansion is bounded by the `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP` degree cap, default 15: a renamed hot dependency whose importer fan-in degree exceeds the cap drops out of the force-parse set and its importers rebind lazily on their next edit. A cap of zero leaves every refactored dependency in, byte-identical to the uncapped path, and the cap reads only inside the force-parse branch, so it has no effect while the force-parse flag is off.

Edge storage carries an optional closed-vocabulary guard. The default-off `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` flag applies the governance-vocabulary edge classification at database init: it backfills any out-of-vocabulary `edge_type` values, then rebuilds the `code_edges` table with a `CHECK` constraint that admits only the known edge-type vocabulary, so a later write of an unrecognized edge type is rejected at the storage layer. With the flag off the constraint is absent and the edge surface accepts any `edge_type`.

The scan response's edge-enrichment summary reads the same default-off `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` flag documented for the write path in [`../edge-confidence-and-provenance/edge-confidence-differentiation.md`](../../feature-catalog/edge-confidence-and-provenance/edge-confidence-differentiation.md). `summarizeGraphEdgeEnrichment()` classifies each scanned `CALLS` edge's `evidenceClass` (treating `AMBIGUOUS` as weak evidence alongside `INFERRED`) and substitutes the legacy uniform `0.8/INFERRED/heuristic` tier for `CALLS` edges specifically while the flag is off, mirroring the same fix applied to `code_graph_query` and `code_graph_context` output. Every other edge type resolves its own constant confidence by construction and is unaffected either way. See [`../edge-confidence-and-provenance/edge-evidence-classification.md`](../../feature-catalog/edge-confidence-and-provenance/edge-evidence-classification.md) for the full shared read-path contract.

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual MCP maintenance call. Read paths may recommend it, but they do not run a broad full scan.

### Class

manual. `code_graph_scan`, verify, status and doctor commands remain the manual control plane.

### Caveats / Fallback

Run full scans in a disposable workspace for destructive exclude/prune checks. `verify:true` only runs after `incremental:false`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp-server/handlers/scan.ts:177-230` | Handler | resolves scan arguments and executes `indexFiles()` |
| `.opencode/skills/system-code-graph/mcp-server/handlers/scan.ts:241-278` | Handler | prunes removed files and persists indexed results |
| `.opencode/skills/system-code-graph/mcp-server/handlers/scan.ts:307-360` | Handler | returns scan counts, readiness, provenance and verification fields |
| `.opencode/skills/system-code-graph/mcp-server/lib/code-graph-db.ts` | Library | bitemporal close-and-insert reindex writer that stamps `invalid_at` on superseded edges under the bitemporal-reads flag, plus the governance-vocabulary edge-type `CHECK` migration gated by `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` |
| `.opencode/skills/system-code-graph/mcp-server/lib/structural-indexer.ts` | Library | reverse-dependency force-parse expansion gated by `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE` and bounded by the degree cap, default 15 |
| `.opencode/skills/system-code-graph/mcp-server/handlers/scan.ts:109-160` | Handler | `summarizeGraphEdgeEnrichment()`: AMBIGUOUS-as-weak-evidence classification and CALLS-only flag-off normalization for the scan response's edge-enrichment summary |
| `.opencode/skills/system-code-graph/mcp-server/tool-schemas.ts:19-48` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/manual-scan-verify-status/` | Manual Playbook | Operator-facing manual scenarios for this feature category |
| `.opencode/skills/system-code-graph/mcp-server/tests/code-graph-scan.vitest.ts` | Automated test | AMBIGUOUS-CALLS-edge classified as `inferred_heuristic` in the edge-enrichment summary |
| `.opencode/skills/system-code-graph/mcp-server/tests/code-graph-cross-file-edges.vitest.ts` | Automated test | cross-file `0.75/INFERRED` and `0.3/AMBIGUOUS` confidence-tier writes surfaced by the summary |

## 4. SOURCE METADATA

- Group: Manual scan verify status
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `manual-scan-verify-status/code-graph-scan.md`

Related references:

- [02-code-graph-verify.md](../../feature-catalog/manual-scan-verify-status/code-graph-verify.md)
- [03-code-graph-status.md](../../feature-catalog/manual-scan-verify-status/code-graph-status.md)
- [../edge-confidence-and-provenance/edge-confidence-differentiation.md](../../feature-catalog/edge-confidence-and-provenance/edge-confidence-differentiation.md)
- [../edge-confidence-and-provenance/edge-evidence-classification.md](../../feature-catalog/edge-confidence-and-provenance/edge-evidence-classification.md)
- [../../manual-testing-playbook/manual-scan-verify-status/code-graph-scan-incremental.md](../../manual-testing-playbook/manual-scan-verify-status/code-graph-scan-incremental.md)
