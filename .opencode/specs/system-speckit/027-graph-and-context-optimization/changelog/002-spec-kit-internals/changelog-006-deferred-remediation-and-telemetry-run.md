---
title: "Phase 006: Deferred remediation and telemetry run"
description: "Shipped static measurement harness, live-session wrapper, and analyzer. Track 1 (Codex config) blocked by sandbox. 90% complete."
trigger_phrases:
  - "phase 006 changelog"
  - "deferred remediation telemetry"
  - "smart router measurement report"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 2)
> Parent packet: `027-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

Phase 024 shipped the measurement machinery that Phases 020-023 deferred: a static 200-prompt harness, an observe-only live-session wrapper, and a JSONL analyzer. The static report processed 200/200 prompts and measured 112/200 advisor top-1 matches against corpus labels. The requested Codex config writes (Track 1) were blocked by the sandbox. The packet is 90% complete with one blocked track.

### Added

- `smart-router-measurement.ts`: static corpus harness running 200 prompts through `buildSkillAdvisorBrief`.
- `smart-router-measurement-report.md`: full 200-prompt static measurement report.
- `smart-router-measurement-results.jsonl`: per-prompt output plus summary row.
- `live-session-wrapper.ts`: observe-only live-session read recorder with `configureSmartRouterSession()` and `onToolCall()`.
- `LIVE_SESSION_WRAPPER_SETUP.md`: runtime setup guide for Claude, Codex, Gemini, and Copilot.
- `smart-router-analyze.ts`: compliance JSONL analyzer with aggregation.

### Changed

- Static measurement report now also inspects the live wrapper telemetry file and blocks routing-readiness claims until real wrapper records include observed reads.
- Static telemetry records kept separate from live-wrapper evidence so downstream measurement can distinguish them.

### Fixed

- 112/200 advisor top-1 matches measured on the 200-prompt corpus.

### Verification

- Static harness processed 200/200 prompts.
- `smart-router-analyze.ts` reads and aggregates compliance JSONL correctly.
- Strict validation passed on the spec folder.
- Track 1 blocked: `.codex` writes denied by sandbox (`Operation not permitted`).

### Files Changed

| File | What changed |
|------|--------------|
| `scripts/observability/smart-router-measurement.ts` | New static harness |
| `scripts/observability/smart-router-measurement-report.md` | New measurement report |
| `scripts/observability/smart-router-measurement-results.jsonl` | New per-prompt output |
| `scripts/observability/live-session-wrapper.ts` | New live-session recorder |
| `scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md` | New setup guide |
| `scripts/observability/smart-router-analyze.ts` | New analyzer |
| `scripts/observability/smart-router-analyze-report-*.md` | New analysis report |

### Follow-Ups

- Track 1 blocked: retry Codex config writes outside the sandbox.
- Live-wrapper evidence must be collected from actual runtime sessions before routing-readiness can be claimed.
