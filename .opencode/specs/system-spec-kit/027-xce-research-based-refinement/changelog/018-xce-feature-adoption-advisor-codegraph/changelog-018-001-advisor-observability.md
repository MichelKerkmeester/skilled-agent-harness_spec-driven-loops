---
title: "Changelog: 001-advisor-observability"
description: "Advisor recommendations gained opt-in prompt-safe attribution, and advisor_status gained opt-in semantic-lane health diagnostics."
trigger_phrases:
  - "018 001 advisor observability changelog"
  - "advisor why recommended"
  - "semantic lane health"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/001-advisor-observability` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

The advisor now makes routing decisions debuggable without exposing prompt text. `advisor_recommend` can return prompt-safe `why_recommended` lane summaries, and `advisor_status` can return semantic-lane health diagnostics when explicitly requested.

### Added

- `why_recommended` attribution behind `options.includeAttribution`.
- `semanticLaneHealth` status fields behind `includeSemanticHealth` or `debug`.

### Changed

- Semantic-shadow lane records degraded-vector disabled reasons for status consumers.
- Schemas validate the new optional attribution and health fields.

### Fixed

- Operators no longer need console logs to diagnose semantic-lane degradation.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS |
| Targeted advisor tests | PASS: 3 files, 33 tests |
| Build | PASS |
| Full suite | PARTIAL: known out-of-scope settings parity failure recorded in source summary |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `handlers/advisor-recommend.ts` | Modified | Prompt-safe `why_recommended` attribution |
| `handlers/advisor-status.ts` | Modified | Semantic-lane health diagnostics |
| `lib/scorer/lanes/semantic-shadow.ts` | Modified | Disabled reasons surfaced |
| `schemas/advisor-tool-schemas.ts` | Modified | Optional field validation |
| `tests/handlers/*` | Modified | Attribution/status coverage |

### Follow-Ups

- MCP descriptor copy was outside this phase's allowed paths, so descriptor text was not updated here.
