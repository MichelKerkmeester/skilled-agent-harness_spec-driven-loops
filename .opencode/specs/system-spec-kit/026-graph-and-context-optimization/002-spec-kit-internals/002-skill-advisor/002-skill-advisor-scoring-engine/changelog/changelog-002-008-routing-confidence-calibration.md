---
title: "Changelog: Lane evidence damping investigation"
description: "Investigated per-lane evidence-confidence damping to reduce explicit and lexical lane over-fire on ambiguous prompts. An 84-combination sweep found no improvement. Production code was reverted and the empirical record is preserved as a research finding."
trigger_phrases:
  - "advisor routing calibration"
  - "lane evidence damping"
  - "explicit lexical over-fire fix"
  - "advisor recall lift damping"
  - "damping sweep results"
importance_tier: "normal"
contextType: "research"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/008-routing-confidence-calibration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The skill advisor scoring engine was investigated for a lane evidence damping mechanism that would reduce explicit and lexical lane contributions when their raw evidence is thin. Codex built a damping prototype with six configuration shapes and ran a sweep across 84 weight-by-damping-by-corpus combinations. No damping configuration beat the undamped baseline on either corpus. One configuration actively regressed the harder corpus. Production code was reverted after the findings.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- Strict spec validation: PASS
- Sweep ran 84 combinations across 7 weight vectors, 6 damping configs, and 2 corpora: PASS
- Every combination on the 24-prompt corpus maintained full today-correct accuracy at 1.0000: PASS
- Recommendation cites specific delta numbers from the sweep data: PASS
- All production damping code reverted, confirmed by empty git diff on the affected source and test files: PASS
- `research/damping-sweep-results.md`: empirical record of the full sweep matrix

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/damping-sweep-results.md` | Created | 84-combination empirical record of all weight by damping by corpus sweep results |
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation |

### Follow-Ups

- Resolve the three pre-existing vitest suite failures (one plugin-bridge baseline, two parity drift from parallel-session skill folder introductions) before any future damping or fusion work.
- Revisit damping with different function shapes or a larger real-telemetry corpus once the underlying suite baseline is clean.
- None.
