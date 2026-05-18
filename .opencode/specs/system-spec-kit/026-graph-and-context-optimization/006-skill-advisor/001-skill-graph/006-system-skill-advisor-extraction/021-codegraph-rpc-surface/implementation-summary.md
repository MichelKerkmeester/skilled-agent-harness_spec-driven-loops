---
title: "Implementation Summary: Code Graph RPC Classifier Surface"
description: "mk-code-index now owns query-intent classification over MCP, and spec-kit no longer carries a local classifier shim."
trigger_phrases:
  - "021 implementation summary"
  - "classifier RPC summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/021-codegraph-rpc-surface"
    last_updated_at: "2026-05-15T09:20:31Z"
    last_updated_by: "codex"
    recent_action: "Verified classifier RPC surface"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/tool-schemas.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-codegraph-rpc-surface |
| **Completed** | 2026-05-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mk-code-index` now exposes query-intent classification through `code_graph_classify_query_intent`. Spec-kit no longer duplicates classifier keywords and patterns locally; `memory_context` reaches across the same MCP boundary used for graph context.

### MCP Classifier Tool

The code-graph package gained a tool descriptor, dispatcher case, and handler for `code_graph_classify_query_intent`. The handler wraps the existing `classifyQueryIntent()` function from `mcp_server/lib/query-intent-classifier.ts` and returns the canonical classifier result in the existing text JSON envelope.

### Spec-Kit Boundary Cutover

`code-graph-boundary.ts` now validates the RPC payload and returns the classification result to spec-kit callers. The old local keyword and pattern heuristic was removed, and `memory-context.ts` now awaits the async boundary call.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | Modified | Add the 11th tool descriptor. |
| `.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts` | Modified | Register validation and dispatch. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/classify-query-intent.ts` | Created | Wrap canonical classifier logic. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/index.ts` | Modified | Export the new handler. |
| `.opencode/skills/system-code-graph/mcp_server/tests/handlers/classify-query-intent.vitest.ts` | Created | Cover MCP dispatch behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` | Modified | Replace local shim with RPC wrapper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modified | Await the async classifier. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts` | Modified | Assert classifier behavior through the async boundary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the existing mk-code-index registration pattern: schema first, handler next, dispatcher registration, then consumer cutover. Focused tests first caught stale generated/runtime artifacts and the old sync test assumption; rebuilding code-graph dist and updating the active test closed both issues.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep classifier logic unchanged | The mandate is surface exposure, not behavior tuning. |
| Return `{ status: 'ok', data }` from the handler | Existing mk-code-index handlers use text JSON envelopes rather than `structuredContent`. |
| Make spec-kit classifier async | The existing boundary RPC helper is async and already used by `memory_context` for graph context. |
| Rebuild code-graph dist for live MCP verification | The launcher skips rebuilding when artifacts exist, so stale dist can hide source changes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Code-graph typecheck | PASS: `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit`. |
| Spec-kit typecheck | PASS: `npx tsc -p tsconfig.json --noEmit`. |
| Focused code-graph tests | PASS: 2 files, 15 tests. |
| Focused spec-kit runtime-routing test | PASS: 1 file, 26 tests. |
| Code-graph full Vitest | FAIL baseline-class: 50 files passed, 1 skipped, 2 failed; 514 passed, 9 skipped, 5 failed. Failures are unrelated `code_graph_context` shared-schema registration checks and symlink hardening. |
| Advisor full Vitest | PASS: 53 files, 368 passed, 4 skipped. |
| Spec-kit full Vitest | FAIL baseline-class: 566 files passed, 15 skipped, 22 failed; 10,909 passed, 87 skipped, 105 failed. Expected baseline was around 114 failures; focused classifier path is green. |
| Live MCP list | PASS: `opencode mcp list` shows `mk_code_index` connected. |
| Live MCP tools | PASS via direct MCP SDK `listTools()`: 11 tools, including `code_graph_classify_query_intent`. Local `opencode mcp` has no `tools` subcommand in this installed CLI. |
| Strict validate | PASS: packet 021 and parent phase folder. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The checked-in code-graph root `.js` siblings are still used by some tests; they were updated alongside TypeScript for parity.
2. `opencode mcp tools mk_code_index` is unavailable in the installed CLI, so live tool listing used a direct MCP SDK client against the same launcher.
<!-- /ANCHOR:limitations -->
