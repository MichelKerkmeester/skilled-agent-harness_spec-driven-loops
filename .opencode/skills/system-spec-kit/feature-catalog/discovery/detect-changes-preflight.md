---
title: "detect_changes preflight (Code Graph)"
description: "Read-only Code Graph handler that maps a unified-diff input to the structural symbols it touches via line-range overlap, refusing to answer when the graph is stale so callers never see a false-safe \"no impact\" result."
trigger_phrases:
  - "detect changes preflight"
  - "detect_changes"
  - "map diff to affected symbols"
  - "code graph change-safety check"
  - "unified-diff impact analysis"
version: 3.6.0.7
---

# detect_changes preflight (Code Graph)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Read-only Code Graph handler that maps a unified-diff input to the structural symbols it touches via line-range overlap, refusing to answer when the graph is stale so callers never see a false-safe "no impact" result.

`detect_changes` is the first Code Graph "change-safety" surface in Public. A reviewer pastes a `git diff`, the handler walks each hunk against the persisted `code_nodes` table, and the response lists every symbol whose source range intersects an added or removed line — with hard refuse semantics on any non-fresh readiness state.

---

## 2. HOW IT WORKS

### Entry Point & Routing


### Pipeline Architecture

Order of operations is fixed by the P1 safety invariant (pt-02 §12 RISK-03):

1. Canonicalize `rootDir` via `realpathSync` and verify it stays within the workspace (parity with `handlers/scan.ts`).
2. Call `ensureCodeGraphReady(rootDir, { allowInlineIndex: false, allowInlineFullScan: false })`. The read path NEVER triggers a silent reindex; operators choose when scans run.
3. If readiness freshness is anything other than `'fresh'`, return `status: 'blocked'` with a `blockedReason` describing the readiness state — empty `affectedSymbols[]` is forbidden on stale/empty/error.
4. Only after readiness clears does the handler parse the diff (`lib/diff-parser.ts`) and walk hunks against `queryOutline(filePath)` rows.

Symbol attribution uses pure line-range overlap: a hunk `(newStart, newLines)` or `(oldStart, oldLines)` that intersects a node's `[startLine, endLine]` range marks the node affected. Synthetic per-file `module` nodes are excluded so they don't drown per-symbol signal. Diff paths are resolved with `graphDb.resolveSubjectFilePath` so they map to the same canonical paths the indexer persists.

### Edge Cases & Caveats



---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|

### Validation And Tests

| File | Type | Role |
|---|---|---|

---

## 4. SOURCE METADATA
- Group: Discovery
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `discovery/detect-changes-preflight.md`

- Phase / sub-phase: `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes`
- Research basis: pt-02 §4 (Code Graph findings, `detect_changes` row), §11 Packet 1, §12 RISK-03 (false-safe changed-symbol impact)
- Decision record: 012/decision-record.md ADR-012-001 (clean-room), ADR-012-002 (sub-phase split)
Related references:
- [health-diagnostics-memoryhealth.md](../../feature-catalog/discovery/health-diagnostics-memoryhealth.md) — Health diagnostics (memory_health)
- [session-bootstrap-reader-ready-context.md](../../feature-catalog/discovery/session-bootstrap-reader-ready-context.md) — Session bootstrap reader-ready context
