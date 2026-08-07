---
title: "022/009 Cascade-Probe Thresholds Env-Driven"
description: "Three inline cascade-probe timing constants in auto-select.ts now accept env-var overrides. Closes one P1 multi-site audit finding."
trigger_phrases:
  - "cascade thresholds env driven"
  - "SPECKIT_CASCADE env vars"
  - "auto-select.ts timing constants"
  - "cascade probe timeout env"
  - "022 009 cascade"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/009-cascade-thresholds-env-driven` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Three cascade-probe timing constants in `auto-select.ts` (lines 96-98) were hardcoded inline literals. Operators had no way to tune the probe timeout, lock-staleness window or sleep interval without modifying source code.

The phase replaced all three `const DEFAULT_*_MS = NNNN` declarations with `parsePositiveInt(process.env.SPECKIT_CASCADE_*_MS, NNNN)` initializers. A new `parsePositiveInt(value, fallback)` helper guards against non-numeric, negative and unset env values while preserving the original defaults. One P1 multi-site audit finding was closed. The council had originally estimated six threshold sites. Investigation found three actual inline timing constants in the current file.

### Added

- `parsePositiveInt(value, fallback)` helper in `auto-select.ts` guarding env-var parsing against non-numeric, negative and unset inputs
- `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` env-var override for the cascade probe timeout (default 2500)
- `SPECKIT_CASCADE_LOCK_STALE_MS` env-var override for the lock-staleness window (default 30000)
- `SPECKIT_CASCADE_SLEEP_MS` env-var override for the cascade sleep interval (default 25)

### Changed

- `auto-select.ts` lines 96-98: three `const DEFAULT_*_MS = NNNN` module-level declarations replaced with `parsePositiveInt(process.env.SPECKIT_CASCADE_*_MS, NNNN)` initializers

### Fixed

- Cascade-probe timing was not tunable without source edits. Env-var wiring restores operator control without changing default behavior.

### Verification

| Check | Result |
|---|---|
| `npm run typecheck:root` | exit 0 |
| `grep SPECKIT_CASCADE_ auto-select.ts` | 3 hits |
| Strict-validate phase 009 (`validate.sh --strict`) | exit 0 |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | Modified | `parsePositiveInt` helper added. Three inline timing constants replaced with env-var initializers. |

### Follow-Ups

- Update `ENV_REFERENCE.md` to document `SPECKIT_CASCADE_PROBE_TIMEOUT_MS`, `SPECKIT_CASCADE_LOCK_STALE_MS` and `SPECKIT_CASCADE_SLEEP_MS` alongside the `SPECKIT_ADVISOR_*` vars from phase 004b at arc convergence.
- Consolidate `parsePositiveInt` with the similar helper at `subprocess.ts:69` to remove the duplication.
