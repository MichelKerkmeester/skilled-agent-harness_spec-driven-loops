---
title: "Implementation Summary: Code-Graph Bug Remediation"
description: "Delivered fail-safe code graph scan promotion, parser-error graph preservation, durable diagnostics, orphan-edge filtering, and regression coverage for Phase 026/007/012/004."
trigger_phrases:
  - "026/007/012/004 implementation summary"
  - "code graph remediation delivered"
  - "zero_node_scan_rejected delivered"
  - "parse diagnostics delivered"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/004-zero-node-and-parser-remediation"
    last_updated_at: "2026-05-06T06:13:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented and verified code graph remediation fixes"
    next_safe_action: "Use final status report evidence for review or commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
    session_dedup:
      fingerprint: "sha256:a5e46142e7a8efc84bdc08ffa91efbea14222c3581c5a8eb3eeda6781fc434fb"
      session_id: "026-007-012-004-zero-node-and-parser-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P0 and top P1 remediation implemented with regression tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Code-Graph Bug Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `004-zero-node-and-parser-remediation` |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code graph now treats bad scans as untrusted candidates instead of authoritative replacements. A zero-node full scan over a populated graph returns `zero_node_scan_rejected`, parser runtime errors preserve the last successful per-file graph, and operators get durable parse diagnostics through scan and status responses.

### P0 Safety Fixes

- **F-002**: `code_graph_scan` computes candidate persistable nodes before pruning. If a full scan has 0 persistable nodes while the existing graph has nodes, the handler blocks promotion unless `forceZeroNodeReset: true` is passed.
- **F-003**: `persistIndexedFileResult()` now diverts `parseHealth === "error"` results into `parse_diagnostics` and skips graph row replacement for that file.

### P1 Hardening

- **F-006**: Added a read-path manifest regression proving a broad-scan manifest matches the readiness comparison.
- **F-008**: Live git head, scope, provenance, edge baseline, and enrichment metadata now promote only when scan health is promotable.
- **F-009**: `replaceEdges()` filters edges whose source node no longer exists and runs orphan cleanup after insertion.
- **F-010**: Full scans record the candidate manifest when per-file parse errors are nonfatal.
- **F-011**: Added `parse_diagnostics` storage plus scan/status summaries with affected file count and recent errors.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Modified | Added zero-node guard, promotion gate, manifest loosening, diagnostics response. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts` | Modified | Preserved prior graph rows on parser runtime errors. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` | Modified | Added diagnostics schema/API, failed scan metadata, orphan-edge filtering. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modified | Surfaced parse diagnostics and stale-but-valid file count. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modified | Exposed `forceZeroNodeReset`. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Validated `forceZeroNodeReset`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/*.vitest.ts` | Modified | Added code graph regression coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Covered new scan schema argument. |
| `specs/.../004-zero-node-and-parser-remediation/*` | Created/Modified | Added Level 2 packet artifacts and completion evidence. |
| `specs/.../011-real-world-usefulness-test-planning/graph-metadata.json` | Modified | Added `004-zero-node-and-parser-remediation` child pointer. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation landed in the existing handler and DB boundaries instead of creating a parallel persistence path. Tests cover the P0 data-loss scenarios first, then P1 metadata, manifest, edge, diagnostics, and schema behaviors. `npm run build` regenerated the local dist output for the MCP server.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Block zero-node full scans before pruning. | Pruning first was the destructive bug; the prior populated graph is the safer state unless the caller explicitly forces a reset. |
| Preserve graph rows for `parseHealth === "error"`. | Runtime parser errors do not prove the file has no symbols; they prove the new parse result is not trustworthy. |
| Keep failed-scan metadata separate. | Live scan metadata drives read-path trust, so failed candidates must not make stale graph state look current. |
| Make diagnostics additive. | The DB can expose operator evidence without requiring destructive migration or breaking existing readers. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused regression subset | PASS: `4 passed`, `103 passed`. |
| Code graph suite | PASS: `20 passed`, `262 passed`. |
| Tool input schema suite | PASS: `1 passed`, `86 passed`. |
| TypeScript build | PASS: `npm run build` completed with exit 0. |
| OpenCode alignment drift | PASS with 6 warnings in unrelated pre-existing files under `mcp_server/lib/*`; no errors. |
| Child strict validation | PASS: `004-zero-node-and-parser-remediation --strict` exited 0. |
| Parent strict validation | PASS: `011-real-world-usefulness-test-planning --strict` exited 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Alignment warnings remain outside scope.** `verify_alignment_drift.py` reported six missing module headers in unrelated existing files. This packet did not modify those files.
2. **Failed-scan history is last-record only.** The remediation persists the latest failed scan record in metadata rather than a full history table. That satisfies the operator need for the current failure without expanding scope.
<!-- /ANCHOR:limitations -->
