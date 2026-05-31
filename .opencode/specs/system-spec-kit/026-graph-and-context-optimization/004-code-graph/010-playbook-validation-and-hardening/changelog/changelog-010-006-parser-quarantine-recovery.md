---
title: "Code Graph Phase 010-006: Parser Quarantine Recovery"
description: "Added a production recovery path for the global tree-sitter parser quarantine. An explicit full scan now clears the quarantine and rebuilds the WASM parser on a fresh heap, so a single B2 fault no longer blocks the graph until a daemon restart."
trigger_phrases:
  - "parser quarantine recovery"
  - "resetParserHealth production"
  - "tree-sitter B2 fault recovery"
  - "f-runtime-2 fix"
  - "quarantined parser full scan"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/006-parser-quarantine-recovery` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

Finding F-RUNTIME-2 identified a permanent-until-restart fault: a single B2 error ("memory access out of bounds") set the module-level parser health to `quarantined`, causing every subsequent parse to return a sentinel. An explicit full scan then produced zero nodes, which the zero-node guard rejected to protect the graph. The runtime stayed stranded until a launcher restart. Playbook scenarios 002, 005, 022 and 024 were all blocked by this fault.

A new exported `resetParserHealth()` function was added to `tree-sitter-parser.ts`. It performs a full reset: clears the quarantine flag, nulls the parser instance and init promise and clears the grammar cache. The next `getParser()` call sees `isReady()` as false and re-runs full initialization on a clean WASM heap. The full-scan handler in `scan.ts` calls `resetParserHealth()` before `indexFiles()` when `args.incremental === false`. Incremental scans intentionally do not trigger a reset, preserving the existing safety for routine reads. The single-B2 quarantine trigger itself is unchanged.

Build and all 54 vitest tests passed. Three previously blocked scenarios (002, 005, 024) passed live. Scenario 022 returned PARTIAL because the chosen test subject had no transitive dependents, not because of a tool defect.

### Added

- `resetParserHealth()` exported from `mcp_server/lib/tree-sitter-parser.ts`. Performs a full heap reset: clears quarantine flag, nulls parser instance and init promise, clears grammar cache.
- Recovery test in `parser-skip-list.vitest.ts` covering the full reset path: quarantine triggered, reset called, `isReady()` false, parser re-engages on next `getParser()`.
- `resetParserHealth` mock added to `code-graph-scan.vitest.ts` so the scan handler tests remain isolated.

### Changed

- `mcp_server/handlers/scan.ts` now calls `resetParserHealth()` at the start of an explicit full scan (`args.incremental === false`), before `indexFiles()` runs. Routine incremental scans are not affected.

### Fixed

- A single B2 parser fault previously stranded the runtime until a daemon restart. Explicit full scans now clear the quarantine and rebuild the WASM parser instance.
- Playbook scenarios 002, 005 and 024 were blocked by F-RUNTIME-2. All three now pass.

### Verification

| Check | Result |
|-------|--------|
| tsc build | PASS (BUILD_OK) |
| vitest parser-skip-list + code-graph-scan | PASS (54/54) |
| verify_alignment_drift.py (mcp_server) | PASS (125 files, 0 violations) |
| Live: scenario 002 (was SKIP) | PASS. 57 content edits, broad-stale block, requiredAction:code_graph_scan |
| Live: scenario 005 (was SKIP) | PASS. verify#1 blocked, rescan ACCEPTED (2425 nodes, no zero_node_scan_rejected), verify#2 ok + pass-rate |
| Live: scenario 024 (was SKIP) | PASS. multi-file diff, 2 affectedFiles, 16 symbols, canonicalized, empty-diff error |
| Live: scenario 022 (was SKIP) | PARTIAL. single non-blocked, union 7 >= 1, minConfidence <= unfiltered all hold. Transitive == nontransitive because the test subject had a single importer (shallow topology), not a tool defect. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts` | Modified | Added `resetParserHealth()`: full reset of quarantine flag, parser instance, init promise, grammar cache |
| `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` | Modified | Calls `resetParserHealth()` before `indexFiles()` when `args.incremental === false` |
| `.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts` | Modified | Recovery test: full reset triggers `isReady` false then re-engages on next call |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Added `resetParserHealth` to the parser mock for scan handler test isolation |

### Follow-Ups

- Re-verify scenario 022 with a subject that has multi-hop transitive dependents to demonstrate that `transitive > nontransitive` holds for a deep topology.
- Consider persisting quarantine state across process restarts as an operator-visibility enhancement (out of scope for this packet, no correctness impact).
