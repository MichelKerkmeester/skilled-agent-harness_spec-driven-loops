---
title: "Changelog: Measurement Baseline for Fable-5 Efficiency [144-operate-like-fable-5/003-measurement-baseline]"
description: "Chronological changelog for the Fable-5 measurement baseline phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/003-measurement-baseline` (Level 3)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5`

### Summary

The measurement phase makes fable-5 efficiency measurable instead of rhetorical. It defines the baseline needed for later governor and doctrine phases to prove movement against a captured reference. The planned delivery includes a `fable-metrics.cjs` script over the phase 002 corpus, post-dispatch behavioral advisories and a doctor or benchmark route that remains read-only.

### Added

- None.

### Changed

- Defined the fable-5 measurement baseline so behavioral efficiency can be measured rather than asserted.
- Anchored later governor and doctrine phases to a captured reference.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Phase status | PENDING: gates are defined in `checklist.md` and will run `validate.sh` plus relevant vitest suites once this phase is built. |
| `fable-metrics.cjs` over the 002 corpus | PENDING: will report the five metrics and per-lineage coverage. |
| `route-validate.sh` for the new route | PENDING: will confirm `mutating: read-only`. |
| Vitest non-blocking advisory fixture | PENDING: will confirm a tripping input stays non-blocking. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| _No file-level detail recorded._ | N/A | The extracted baseline records planned measurement behavior without file-level detail. |

### Follow-Ups

- CHK-001 Five metric definitions and the C1, C2 and C3 scope documented in `spec.md`.
- CHK-002 Runtime-agnostic approach and read-only delivery defined in `plan.md`.
- CHK-003 Phase 002 lineage state files confirmed present as the baseline corpus.
- CHK-010 `fable-metrics.cjs` contains no `~/.claude` or hard-coded `projects/` path. Grep is clean and the script takes a path argument.
- CHK-011 `fable-metrics.cjs` runs on the 002 corpus without an unhandled crash on malformed or partial state.
- CHK-012 Defensive parsing skips and counts malformed JSONL lines instead of treating them as fatal.
