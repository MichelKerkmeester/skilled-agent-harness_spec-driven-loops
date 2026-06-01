---
title: "memory_context truncation contract + token telemetry"
description: "The memory_context handler gained three hard telemetry fields and a payload/count invariant test helper. Operators can now distinguish pre-enforcement token size from returned size. The empty fallback path is now named explicitly instead of masquerading as a normal truncated response."
trigger_phrases:
  - "memory context truncation telemetry"
  - "preEnforcementTokens returnedTokens"
  - "droppedAllResultsReason impossible_budget"
  - "token budget telemetry contract"
  - "payload count invariant memory_context"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/003-memory-context-truncation-telemetry-contract` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The 005 post-remediation verification showed that `memory_context` was reporting `actualTokens=65` against a `budgetTokens=3500` budget (1.9% utilization) while simultaneously returning an empty `count:0, results:[]` payload. The root cause was a soft contract: `actualTokens` was measured after fallback, leaving no way to distinguish the original overflow size from the returned size. An empty fallback path produced no named signal.

Three hard telemetry fields were added to `meta.tokenBudgetEnforcement` in `enforceTokenBudget()`. `preEnforcementTokens` captures the payload size before any truncation or fallback. `returnedTokens` captures the final emitted size. `droppedAllResultsReason` names the degraded outcome when the fallback chain empties the payload. The existing `actualTokens` field was kept as a backward-compatible alias of `returnedTokens`. A shared test helper `expectReturnedCountMatchesPayload()` was added to assert that `returnedResultCount` in metadata matches the actual nested `data.results.length` in the response body. All five REQs were verified by focused Vitest runs (137 tests passing) plus a live MCP probe post-rebuild.

### Added

- `preEnforcementTokens` field in `meta.tokenBudgetEnforcement`, recording payload size before any truncation or fallback path runs
- `returnedTokens` field in `meta.tokenBudgetEnforcement`, recording the final emitted payload size after enforcement
- `droppedAllResultsReason` field set to `"impossible_budget"` when the fallback chain produces an empty `results` array
- Shared test helper `expectReturnedCountMatchesPayload()` in `tests/_support/token-budget-assertions.ts` (NEW) that parses `content[0].text` and asserts `returnedResultCount` equals `data.results.length`

### Changed

- `enforceTokenBudget()` in `memory-context.ts` now captures `preEnforcementTokens` at the entry point before any truncation or fallback. Previously, only `actualTokens` (post-fallback size) was available.
- `actualTokens` is now documented as an alias of `returnedTokens`. Both fields are emitted together to preserve backward compatibility.
- `token-budget-enforcement.vitest.ts` extended with 3 new contract tests: under-budget equality invariant, over-budget telemetry split, empty-fallback `droppedAllResultsReason` assertion.
- `memory-context.vitest.ts` strengthened so the existing under-budget test now parses the nested payload and calls `expectReturnedCountMatchesPayload()`.

### Fixed

- `memory_context` was masking an empty-payload fallback as a normal truncated response. Callers saw `truncated:true` with `returnedResultCount:0` and no explanation. The `droppedAllResultsReason` field now surfaces the degraded outcome explicitly.
- The payload/count invariant between `returnedResultCount` metadata and the actual `data.results.length` in the response body was untested. The new shared helper closes that gap.

### Verification

| Check | Result |
|-------|--------|
| Focused Vitest: `npx vitest run tests/token-budget-enforcement.vitest.ts tests/memory-context.vitest.ts` | PASS. 2 files, 137 tests passed. |
| `npm run build` | PASS. `tsc --build` completed with no errors. |
| `grep -l preEnforcementTokens dist/handlers/memory-context.js` | PASS. Compiled marker found. |
| `grep -l returnedTokens dist/handlers/memory-context.js` | PASS. Compiled marker found. |
| `grep -l droppedAllResultsReason dist/handlers/memory-context.js` | PASS. Compiled marker found. |
| Live `memory_context({input:"Semantic Search", mode:"auto"})` probe | PASS. Recorded 2026-04-27T10:12:36Z. `preEnforcementTokens:7410`, `returnedTokens:1278`, `actualTokens:1278`, `enforced:true`, `truncated:true`, `originalResultCount:5`, `returnedResultCount:2`. Over-budget path with payload preserved, no `droppedAllResultsReason`. Confirms REQ-001/002/004 live. |
| REQ-001 `preEnforcementTokens` | PASS. Emitted on under-budget path, truncation path, compaction path, fallback path. |
| REQ-002 `returnedTokens` + `actualTokens` alias | PASS. Both fields emitted. Tests assert `actualTokens === returnedTokens`. |
| REQ-003 `droppedAllResultsReason` on empty fallback | PASS. `fallbackToStructuredBudget()` sets `"impossible_budget"` for empty payloads. |
| REQ-004 metadata/payload count invariant | PASS. `expectReturnedCountMatchesPayload()` called in both test files. |
| REQ-005 no truncation below 50% budget | PASS. Under-budget test (5 results, 3500-token budget) asserts `enforced:false`, `truncated:false`, equal token fields, no dropped reason. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modified | Added `preEnforcementTokens`, `returnedTokens`, `droppedAllResultsReason` to `enforceTokenBudget()`. Kept `actualTokens` as alias. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/_support/token-budget-assertions.ts` (NEW) | Added | Shared helper `expectReturnedCountMatchesPayload()` parses `content[0].text` and asserts nested results count equals metadata count. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts` | Modified | Three new contract tests added: under-budget equality, over-budget telemetry split, empty-fallback `droppedAllResultsReason` assertion. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-context.vitest.ts` | Modified | Existing truncation tests now call `expectReturnedCountMatchesPayload()` to assert the nested payload count. |

### Follow-Ups

- Restart the MCP-owning client daemon to make the patched `dist/handlers/memory-context.js` take effect in a live runtime. Packet 013 owns the canonical rebuild and restart protocol.
- Verify the 005 Probe B repro (`actualTokens=65 / budgetTokens=3500`) returns `count > 0` in `data.content[0].text` after the daemon restart.
- Consider extending `droppedAllResultsReason` with `parse_failed` and `no_survivor_fits` values if those degraded paths are encountered in follow-on stress runs.
