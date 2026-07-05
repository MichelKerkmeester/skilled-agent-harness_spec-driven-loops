---
title: "Changelog: Subsystem: Skill Interconnection — Advisor Routing Projection [005-skill-interconnection/root]"
description: "Chronological changelog for the Subsystem: Skill Interconnection — Advisor Routing Projection spec root."
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

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/005-skill-interconnection` (Level 2)

### Summary

Phase 006 shipped advisor routing projection from the workflow mode registry. It generated alias projection with drift protection and published resolved `workflowMode` values in advisor responses so callers can see the chosen route.

### Before vs After

**Before**

The advisor did not publish the resolved workflow mode in its responses and alias projection from the mode registry was not automatically generated with a drift guard. That left routing interconnection dependent on duplicated or implicit knowledge.

**After**

The advisor now gets an auto-generated alias projection from the mode registry, protected by a hash drift guard. Advisor responses also publish the resolved `workflowMode`, giving downstream callers the routing decision in a stable field. The advisor tests passed and the typecheck and drift checks were green.

**Impact**

Workflow routing is now visible rather than implied. The advisor can expose which mode it resolved and the alias projection stays tied to the registry instead of drifting as a separate hand-maintained surface.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-advisor-routing-projection` | Complete | Auto-generated alias projection from the mode-registry with a hash drift-guard, and published the resolved workflowMode in advisor responses. 29 advisor tests pass; typecheck/drift green. |

### Added

- No new additions recorded.

### Changed

- This is Phase 5 of the 123-agent-loops-improved subsystem groups.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
