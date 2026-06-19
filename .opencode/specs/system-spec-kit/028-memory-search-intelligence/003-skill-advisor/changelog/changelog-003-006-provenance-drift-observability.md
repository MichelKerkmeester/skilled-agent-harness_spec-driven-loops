---
title: "Changelog: Skill Advisor Provenance Guard, Drift Observability and Named Skips"
description: "Chronological changelog for the Skill Advisor provenance guard, drift observability and named-skip phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/006-provenance-drift-observability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

One scorer candidate shipped default-off. The self-recommendation guard now threads optional producer identity through explicit-author evidence and centralizes advisor self-recommendation handling behind `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`. Default behavior remains byte-identical. The attested drift sweep and named skip taxonomy remain pending because the calibration store still uses an ephemeral tmpdir window instead of a durable attested-baseline substrate.

### Added

- Added optional producer identity to scorer lane matches.
- Added a default-off self-recommendation guard that generalizes the existing advisor self-penalties.
- Added focused tests for flag-off behavior, flag-on behavior and non-advisor byte-equivalence.

### Changed

- Scoped the guard to advisor self-recommendation vectors rather than banning all authored-content self-scoring.
- Kept drift observability and named skip reasons behind the durable baseline dependency.
- Updated the phase docs to show one implemented default-off candidate and two pending substrate-backed candidates.

### Fixed

- Removed the stale planning-only status for the self-recommendation guard.
- Preserved the existing explicit-author symmetry for non-advisor skills.
- Confirmed that the drift and skip candidates cannot truthfully report without the durable attested-baseline path.

### Verification

| Check | Result |
|-------|--------|
| Typecheck | PASS, 0 errors |
| Focused provenance tests | PASS, 5 tests |
| Broad related Vitest | 119 passed, 2 skipped, 2 baseline parity failures unchanged |
| Alignment drift | PASS, 37 files scanned |
| Comment hygiene spot check | PASS |
| Strict validation | PASS after packet docs were updated |
| Durable baseline blocker | CONFIRMED, calibration records still use an ephemeral record root |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Updated | One candidate done, two pending with substrate gate |
| `plan.md` | Updated | Substrate-first sequencing |
| `tasks.md` | Updated | Implemented guard tasks and pending drift/skip work |
| `checklist.md` | Updated | Verification evidence |
| `implementation-summary.md` | Updated | Closeout status |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/types.ts` | Modified | Optional producer identity |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modified | Producer identity only when requested by the guard path |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Default-off self-recommendation guard |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` | Created | Guard and byte-equivalence coverage |

### Follow-Ups

- Move drift observability and named skip reasons onto the durable attested-baseline substrate.
- Keep the self-recommendation guard scoped to the advisor vector. Do not turn it into a blanket authored-content penalty.
- Resolve stale-embedder-space metadata when the durable baseline schema is designed.
