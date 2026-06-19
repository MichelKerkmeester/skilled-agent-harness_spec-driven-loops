---
title: "Changelog: Enrichment Observability Read-Side Gauges [001-speckit-memory/013-enrichment-observability]"
description: "Chronological changelog for the enrichment observability read-side gauges phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/013-enrichment-observability` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The Memory MCP now exposes the background enrichment backlog as read-side health data. Pending and failed counts were already surfaced and this phase extends the same health query with oldest-pending timestamp and age. The gauges reuse existing columns, add no migration and degrade neutrally if a schema edge appears.

### Added

- Added oldest-pending timestamp and age to the background enrichment health block.
- Added tests for known-age, empty backlog and missing-column behavior.

### Changed

- Extended the existing backlog query instead of creating new state.
- Preserved neutral degradation when backlog columns are unavailable.

### Fixed

- Made a stalled enrichment backlog visible to operators without changing the scheduler.

### Verification

- Pending and failed gauges: PASS from the shipped record.
- Lag gauge: PASS.
- Typecheck: PASS.
- Health edge Vitest: PASS, baseline 11 tests and final 13 tests.
- Mutation check: PASS.
- Build: PASS.
- Strict phase validation: PASS.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Returns pending and failed enrichment stats |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | Adds backlog lag query and health output |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts` | Modified | Adds lag and degradation coverage |

### Follow-Ups

- Treat effort as structural inference, not a benchmarked performance claim.
- Keep the gauge read-only. It observes backlog age but does not retry, drain or steer the scheduler.
