---
title: "Changelog: Fanout Timeout Override [009-research-backlog-remediation/002-fanout-timeout-override]"
description: "Chronological changelog for the Fanout Timeout Override phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation`

### Summary

The per-lineage fan-out timeout ceiling was hardcoded at four hours with no operator escape hatch. An optional `--lineage-timeout-hours` override now replaces the ceiling constant while leaving the computed formula and default behavior unchanged.

### Added

- Add `--lineage-timeout-hours <N>` CLI flag parsed through the existing `parseOptionalNumber` helper.
- Add 3 new tests covering the default-unchanged case, the override-raises-ceiling case and the override-below-computed-value-has-no-effect case.

### Changed

- `computeLineageTimeoutMs()` now takes an optional second parameter that replaces the hardcoded 4-hour ceiling when finite and positive, leaving the `iters * timeoutSeconds * 2` formula and `Math.min` structure untouched.
- Exported `computeLineageTimeoutMs()` for direct unit testing and guarded the tsx-bootstrap re-exec with a `require.main === module` check so requiring the module for tests does not trigger a subprocess re-exec.
- Documented the new flag in `.opencode/commands/deep/research.md` and `.opencode/commands/deep/review.md`.

### Fixed

- No fixes recorded. This is an additive capability, not a bug fix.

### Verification

- Targeted `fanout-run.vitest.ts` run, PASS, 34 of 34 tests including the 3 new timeout-override tests.
- Full `deep-loop-runtime` Vitest suite run, PASS with the same pre-existing unrelated baseline failures noted throughout this remediation phase.
- Direct diff review confirmed the override preserves the existing ceiling formula rather than replacing it.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Added the timeout-override parameter, CLI parsing and the `require.main` guard. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added the 3 timeout-override tests. |
| `.opencode/commands/deep/research.md`, `.opencode/commands/deep/review.md` | Modified | Documented the new flag. |

### Follow-Ups

- None. The change is fully additive and does not require a follow-up.
