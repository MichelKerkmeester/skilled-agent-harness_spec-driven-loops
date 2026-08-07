---
title: "Changelog: Agentic Tool-Loop Recall Strategy [001-speckit-memory/016-iterative-agentic-recall]"
description: "Chronological changelog for the agentic tool-loop recall strategy phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/016-iterative-agentic-recall` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The gate-zero half of the agentic recall packet is built. A bounded loop governor and default-off agentic recall flag now exist, with deterministic tests proving step caps, cost ceilings, forced final answers, ACL failure, tool failure and flag-off disablement. Router wiring remains pending because it requires a public mode-enum change and a live LLM provider. Benchmark promotion remains pending because no real latency, cost or determinism numbers exist yet.

### Added

- Added the pure agentic loop governor with injected step provider and tool executor.
- Added the default-off `SPECKIT_AGENTIC_RECALL` flag.
- Added deterministic governor tests.

### Changed

- Left the deterministic `memory_context` router untouched until a public mode contract change is approved.
- Registered the new flag in the flag ceiling guard.

### Fixed

- Closed the unbounded-loop risk before any agentic router wiring can occur.
- Corrected the stale planning-only summary to reflect the governor and flag delivery.

### Verification

- Typecheck: PASS.
- Governor suite: PASS, 18 tests.
- Flag fail-closed behavior: PASS.
- Deterministic search core and memory-context router: unchanged for this phase.
- Strict phase validation: PASS.
- Router isolation and live benchmark remain pending.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/search/agentic-loop-governor.ts` | Created | Bounded controller with typed loop results |
| `mcp_server/lib/search/search-flags.ts` | Modified | Adds the default-off agentic recall flag |
| `mcp_server/tests/agentic-loop-governor.vitest.ts` | Created | Covers bounds, failures, ACL and determinism |
| `mcp_server/tests/flag-ceiling.vitest.ts` | Modified | Registers the new flag with the drift guard |

### Follow-Ups

- Wire the agentic route only with a public mode enum change and a live LLM provider.
- Run a seeded benchmark before any promotion decision.
- Keep the flag default-off until latency, cost and determinism data support promotion.
