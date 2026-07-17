---
title: "Causal Relation-Coverage Reporting Honesty"
description: "Corrected memory_causal_stats relationCoverage metadata so it stops advertising an unimplemented autonomous relation backfill and the no-op memory_health autoRepair command."
trigger_phrases:
  - "causal relation coverage honesty"
  - "relation coverage misleading hint"
  - "memory_causal_stats autorepair no op"
  - "autonomous causal relation backfill not implemented"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/019-causal-relation-coverage-honesty` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

`memory_causal_stats` relation coverage advertised an autonomous causal relation backfill and pointed callers at `memory_health({ autoRepair: true, confirmed: true })`. The packet artifacts verified that `relation-coverage.ts` is a pure reporter, autoRepair does not balance relation types and `lastBackfillAt` is always null.

This packet changed the reporter contract to say the backfill job is not implemented and has no runnable command. The remediation hint now names the real mechanisms: post-insert enrichment on save for `supports` edges and explicit `memory_causal_link` usage for typed relations. The actual autonomous relation-inference backfill remains out of scope.

### Added

- `backfillJob.implemented` on relation coverage output.
- Unit coverage for implemented false, null command, honest hints, met targets and empty graphs.
- Output assertions that surfaced hints do not instruct callers to run autoRepair.

### Changed

- `backfillJob.command` widened to `string | null` and now returns `null`.
- Relation coverage remediation hint rewritten to describe real edge creation paths.

### Fixed

- Misleading relation coverage guidance that implied `memory_health({ autoRepair })` could backfill relation coverage.
- A runnable-looking command string for an autonomous relation backfill that does not exist.

### Verification

| Check | Result |
|-------|--------|
| Reporter source review | PASS. Packet tasks record confirmation that `relation-coverage.ts` is a pure reporter and autoRepair writes no relation backfill |
| Build | PASS. `npm run build` exit 0 |
| Relation coverage tests | PASS. 5 tests passed across 2 files |
| Deploy | Pending. Packet tasks record deployment with the front-proxy recycle packet still open |
| Live `memory_causal_stats` verification | Pending |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts` | Modified | Added `implemented: false`, set command to `null` and rewrote the remediation hint |
| `.opencode/skills/system-spec-kit/mcp_server/tests/relation-coverage-unit.vitest.ts` | Added | Covered the honest relation coverage contract |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts` | Modified | Asserted output exposes `implemented: false`, null command and no autoRepair hint |

### Follow-Ups

- Deploy with the front-proxy recycle hardening packet and verify `memory_causal_stats` shows the honest hint.
- Build the actual semantic relation-inference backfill in a separate packet if the caused and contradicts targets should rise automatically.
