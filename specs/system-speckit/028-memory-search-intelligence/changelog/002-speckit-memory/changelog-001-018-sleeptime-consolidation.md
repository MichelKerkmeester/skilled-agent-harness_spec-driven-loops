---
title: "Changelog: Async Sleep-Time Consolidation [001-speckit-memory/018-sleeptime-consolidation]"
description: "Chronological changelog for the async sleep-time consolidation phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/018-sleeptime-consolidation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped the safe core for off-turn sleep-time consolidation behind default-off flags. The bounded tool-rule governor and a shadow agent scaffold are delivered, while the synchronous save path stays unchanged. Off-turn dispatch, live archival writes and benchmark promotion remain pending. The packet stays default-off, shadow-first and governor-first because it mutates archival memory outside the foreground turn. Commit `8f8776e329` carried the governor and scaffold with a passing governor test.

### Added

- Added the bounded sleep-time governor in `lib/cognitive/sleeptime-governor.ts` with step caps, cost ceiling, ACL allowlist and typed aborts.
- Added the shadow agent scaffold in `lib/cognitive/sleeptime-agent.ts` that returns would-archive ranges without archival writes by default.
- Added the default-off `SPECKIT_SLEEPTIME_CONSOLIDATION` and `SPECKIT_SLEEPTIME_LIVE_WRITE` flags.

### Changed

- Captured the governor-first design for bounded off-turn consolidation.
- Kept synchronous reconsolidation separate from the shadow background agent.
- Shipped shadow telemetry plumbing before any archival mutation.

### Fixed

_No fixes recorded._

### Verification

- Strict phase validation: PASS.
- Governor bounds and shadow-default tests: PASS via `tests/sleeptime-governor.vitest.ts`.
- Off-turn dispatch, cursor idempotency and live archival telemetry remain pending.

### Files Changed

- `lib/cognitive/sleeptime-governor.ts`: bounded phases, step cap, cost ceiling, ACL allowlist and typed aborts.
- `lib/cognitive/sleeptime-agent.ts`: shadow scaffold driving range selection through the governor.
- `lib/search/search-flags.ts`: default-off consolidation and live-write opt-in flags.
- `tests/sleeptime-governor.vitest.ts`: governor bounds, shadow default and live-write opt-in coverage.

### Follow-Ups

- Build the governor before the off-turn agent.
- Keep the default state shadow or dry-run.
- Validate idempotency against the consolidation cursor and clock host before write-mode promotion.
