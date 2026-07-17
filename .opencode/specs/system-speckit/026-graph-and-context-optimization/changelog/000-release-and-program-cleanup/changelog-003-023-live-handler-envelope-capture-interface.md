---
title: "Live Handler Envelope Capture Seam [003-fix-mcp-runtime-stress-findings/023]"
description: "A focused Vitest file closes the v1.0.3 live-handler envelope gap. The test calls handleMemorySearch end-to-end with deterministic fixtures and proves SearchDecisionEnvelope emission plus decision-audit JSONL write from the real handler path."
trigger_phrases:
  - "live handler envelope capture"
  - "handler-memory-search-live-envelope"
  - "search decision envelope audit test"
  - "handleMemorySearch behavioral seam"
  - "decision audit JSONL capture"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/023-live-handler-envelope-capture-interface` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The v1.0.3 stress test (Phase H) attempted to capture live `SearchDecisionEnvelope` rows from `handleMemorySearch` but failed with an embedding-readiness timeout caused by a vestigial gate. Once a prior packet removed that gate, the capture path was unblocked but no behavioral test existed to prove it worked. This packet adds `handler-memory-search-live-envelope.vitest.ts`, a single focused test that calls `handleMemorySearch` with deterministic pipeline fixtures, verifies both camelCase and snake_case `SearchDecisionEnvelope` fields in the MCP response. It reads back a real JSONL row from `SPECKIT_SEARCH_DECISION_AUDIT_PATH`. The test runs `handleMemorySearch`, `buildSearchDecisionEnvelope` and `recordSearchDecision` as production code, mocking only `executePipeline` at the retrieval boundary.

### Added

- `handler-memory-search-live-envelope.vitest.ts` test file at `mcp_server/tests/`, providing a deterministic behavioral seam for live handler envelope attachment and decision-audit JSONL emission
- Leading layer-disclosure comment in the test file stating which layers are real and which are mocked

### Changed

- None.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/handler-memory-search-live-envelope.vitest.ts` | PASS after packet 025: TC-3 is a normal passing assertion |
| `npx tsc --noEmit` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Created (NEW) | Behavioral seam for live handler envelope attachment and decision-audit JSONL emission |
| `spec.md` | Modified | Continuity and status update for current implementation state |
| `plan.md` | Created (NEW) | Level 1 implementation plan |
| `tasks.md` | Created (NEW) | Level 1 task ledger |

### Follow-Ups

- TC-3 was originally shipped as a visible gap marker in this packet. Packet 025 wired `memory_search` to pass snapshot-derived `degradedReadiness` into `buildSearchDecisionEnvelope`, converting the marker into a normal passing assertion.
- The advisor shadow JSONL sink is not exercised in this test. The advisor handler owns that path. The test file documents this boundary. Coverage of the shadow path remains a separate concern.
