---
title: "Changelog: Code-Graph Bug Remediation [008-real-world-usefulness-test-planning/005-fix-zero-node-and-parser-issues]"
description: "Chronological changelog for the Code-Graph Bug Remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/005-fix-zero-node-and-parser-issues` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

The code graph now treats bad scans as untrusted candidates instead of authoritative replacements. A zero-node full scan over a populated graph returns zero_node_scan_rejected, parser runtime errors preserve the last successful per-file graph, and operators get durable parse diagnostics through scan and status responses.

### Added

- Zero-node scan guard in scan.ts blocks destructive promotion when a full scan returns zero indexed nodes over a populated graph.
- forceZeroNodeReset option exposed in public and internal code_graph_scan schemas.
- Parse-error preservation in ensure-ready.ts diverts parseHealth error results to parse_diagnostics and skips graph row replacement.
- Durable parse_diagnostics schema and API in code-graph-db.ts with scan and status summaries.
- Orphan-edge filtering in replaceEdges() removes edges with missing source nodes after insertion.
- Candidate manifest recording decoupled from nonfatal per-file parse errors.
- Regression tests for zero-node guard, parse-error preservation, orphan edges, manifest behavior, and diagnostics.

### Changed

- Live scan metadata (git head, scope, provenance) promotes only when scan health is promotable.
- Full scans with parse errors below the fatal ratio still record the candidate manifest.
- Status handler surfaces parse diagnostics and stale-but-valid file count.

### Fixed

- Zero-node full scan no longer prunes and promotes over a populated graph; returns zero_node_scan_rejected instead.
- Parser runtime errors no longer overwrite a file's last successful structural graph with empty error state.
- Orphan edges with missing source nodes are filtered and cleaned after replacement.

### Verification

- Focused regression subset - PASS: 4 passed, 103 passed.
- Code graph suite - PASS: 20 passed, 262 passed.
- Tool input schema suite - PASS: 1 passed, 86 passed.
- TypeScript build - PASS: npm run build completed with exit 0.
- OpenCode alignment drift - PASS with 6 warnings in unrelated pre-existing files under mcp_server/lib/*; no errors.
- Child strict validation - PASS: 005-fix-zero-node-and-parser-issues --strict exited 0.
- Parent strict validation - PASS: 011-real-world-usefulness-test-planning --strict exited 0.
- Tasks complete - 26 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Added zero-node guard, promotion gate, manifest loosening, diagnostics response. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modified | Preserved prior graph rows on parser runtime errors. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Modified | Added diagnostics schema/API, failed scan metadata, orphan-edge filtering. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modified | Surfaced parse diagnostics and stale-but-valid file count. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Exposed forceZeroNodeReset. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Validated forceZeroNodeReset. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/*.vitest.ts` | Modified | Added code graph regression coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Covered new scan schema argument. |
| `specs/.../005-fix-zero-node-and-parser-issues/*` | Created/Modified | Added Level 2 packet artifacts and completion evidence. |
| `specs/.../011-real-world-usefulness-test-planning/graph-metadata.json` | Modified | Added 005-fix-zero-node-and-parser-issues child pointer. |

### Follow-Ups

- Alignment warnings remain outside scope. verify_alignment_drift.py reported six missing module headers in unrelated existing files; this packet did not modify those files.
- Failed-scan history is last-record only. The remediation persists the latest failed scan record in metadata rather than a full history table.
