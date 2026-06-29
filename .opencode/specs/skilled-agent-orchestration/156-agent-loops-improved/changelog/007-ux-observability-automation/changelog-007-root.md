---
title: "Changelog: Subsystem: UX, Observability, and Automation [007-ux-observability-automation/root]"
description: "Chronological changelog for the Subsystem: UX, Observability, and Automation spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/007-ux-observability-automation` (Level 2)

### Summary

Phase 007 shipped operator-facing loop controls and visibility: dashboard trends, telemetry heartbeat lifecycle, normalized observability events, run-now control, per-iteration memory refresh and dry-run boundaries. It made long runs easier to inspect, nudge and rehearse without changing the core loop behavior.

### Before vs After

**Before**

Long loop runs had weaker operator feedback. The dashboard did not show trend sparklines, telemetry rows did not carry a started, progress and terminal heartbeat lifecycle, observability emitters did not share one normalized envelope and a paused run had no shipped one-shot run-now sentinel. Deep research did not refresh memory after each iteration and there was no first-class dry-run halt at the major mutation and dispatch boundaries.

**After**

The dashboard now renders a TREND section with new-information and score sparklines plus a flatline advisory event. Deep research emits serialized-diff-gated telemetry heartbeat rows and five emitters now route through a shared observability event normalizer and append helper. A run-now check consumes a one-shot sentinel before pause, convergence and dispatch, then emits requested or rejected events. Each iteration now runs a non-fatal memory save or upsert and refreshes memory context before the next prompt. The loop also has a first-class `--dry-run` flag with halt hooks at dispatch, state mutation, reducer refresh and child spawn boundaries.

**Impact**

An operator can see trend shape, heartbeat state, normalized events and dry-run stops instead of inferring them from scattered output. A paused loop can be nudged once, memory context refreshes between iterations and dry-run can exercise the control path without crossing mutation boundaries.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-dashboard-sparkline-trend` | Complete | Added renderSparkline(history, opts) + a '## 5. TREND' dashboard section (newInfoRatio + score sparklines) + a trend_flatline advisory event in reduce-state.cjs (purely additive). Unit tests pass. |
| `002-single-loop-telemetry-heartbeat` | Complete | Added step_telemetry_heartbeat (started/progress/terminal lifecycle rows) to deep_research_auto.yaml and a serialized-diff gate in atomic-state.ts suppressing no-change telemetry row writes. 11/11 atomic-state tests pass; YAML parses. |
| `003-unified-observability-event-envelope` | Complete | New observability-events.cjs (normalizeObservabilityEvent/appendObservabilityEvent) with the 5 emitters (fanout-run, convergence, status, council round-state, research yaml) routed through it. Additive; parity + envelope tests 20/20; drift clean. |
| `004-run-now-control` | Complete | Added step_run_now_check to deep_research_auto.yaml: detect and consume a one-shot run-now sentinel before pause/convergence/dispatch, with a pause-check and run_now_requested/rejected events (additive). 3/3 YAML-control tests pass. |
| `005-per-iteration-memory-upsert` | Complete | memory_save/upsert step after each iteration + memory_context refresh before the next prompt (non-fatal on MCP error) in deep_research_auto.yaml. YAML parses; additive. |
| `006-loop-wide-dry-run` | Complete | First-class --dry-run flag + halt hooks at dispatch/state-mutation/reducer-refresh/child-spawn boundaries + dry_run_halt events (research.md + deep_research_confirm.yaml). YAML parses; additive. |

### Added

- No new additions recorded.

### Changed

- This is Phase 6 of the 156-agent-loops-improved subsystem groups.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
