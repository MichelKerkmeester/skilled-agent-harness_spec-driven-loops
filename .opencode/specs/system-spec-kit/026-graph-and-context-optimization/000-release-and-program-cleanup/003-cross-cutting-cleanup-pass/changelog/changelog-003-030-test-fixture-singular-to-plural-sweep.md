---
title: "026/000/003-030: Test Fixture Singular-to-Plural Path Sweep"
description: "A two-pass perl sweep replaced 30 singular .opencode/skill path references with plural .opencode/skills across 7 advisor test files, dropping the advisor-suite failure count from 37 to 4."
trigger_phrases:
  - "test fixture singular plural sweep"
  - "advisor test path rename 37 failures"
  - "opencode skill to skills test fixtures"
  - "perl sweep advisor vitest"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-09

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/030-test-fixture-singular-to-plural-sweep` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Packet 096 renamed production paths from singular `.opencode/skill/` to plural `.opencode/skills/` per the official opencode.ai documentation, but 7 advisor-test fixtures continued using the old singular form. That mismatch caused 37 advisor-suite failures because the production resolver's strict sentinel (`SKILL.md`) looked for the plural path and found nothing in the fixture temporary directory.

A two-pass mechanical sweep fixed all 30 occurrences. Pass 1 used a single-line sed substitution for the common inline forms. Pass 2 used `perl -0777` in slurp mode to catch the split-line forms where `.opencode` and `skill` appeared on separate lines inside a tuple literal. After the sweep, grep confirmed zero residual singular references. The build exited clean. The advisor-suite failure count fell from 37 to 4. The 4 remaining failures are unrelated to path naming: alias canonicalization rules, Python-TS parity corpus mismatches, Python compat harness wiring.

### Added

None.

### Changed

- 5 singular `.opencode/skill` path occurrences in `legacy/advisor-freshness.vitest.ts` updated to plural, including one multi-line split form handled by the perl slurp pass
- 2 path occurrences in `lifecycle-derived-metadata.vitest.ts` updated to plural
- 1 path occurrence in `daemon-watcher-resource-leaks-049-005.vitest.ts` updated to plural
- 2 path occurrences in `daemon-freshness-foundation.vitest.ts` updated to plural
- 3 path occurrences in `scorer/projection-fallback-049-005.vitest.ts` updated to plural
- 3 path occurrences in `scorer/native-scorer.vitest.ts` updated to plural (one residual failure in this file is unrelated)

### Fixed

- 14 singular path occurrences in `handlers/advisor-status.vitest.ts` corrected, closing the largest single source of advisor fixture failures
- Advisor-suite failure count reduced from 37 to 4 by aligning fixture paths with the production rename from packet 096

### Verification

| Test | Status | Notes |
|------|--------|-------|
| `npm run build` | Pass | Exits 0, no compilation errors |
| Advisor suite | 4 failures | Down from 37 pre-sweep. Delta = 33 failures closed. |
| Grep residual check | Clean | `rg "'\.opencode/skill\b` returns 0 hits across the 7 affected test files |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-freshness.vitest.ts` | Modified | 5 path occurrences updated to plural. Multi-line split form fixed by perl slurp pass. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/lifecycle-derived-metadata.vitest.ts` | Modified | 2 path occurrences updated to plural. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/daemon-watcher-resource-leaks-049-005.vitest.ts` | Modified | 1 path occurrence updated to plural. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/daemon-freshness-foundation.vitest.ts` | Modified | 2 path occurrences updated to plural. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/projection-fallback-049-005.vitest.ts` | Modified | 3 path occurrences updated to plural. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Modified | 3 path occurrences updated to plural. One residual test failure is unrelated to the rename. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-status.vitest.ts` | Modified | 14 path occurrences updated to plural. Largest contributor to the pre-sweep failure total. |

### Follow-Ups

- Investigate the 4 residual advisor-suite failures: alias canonicalization in `scorer/native-scorer.vitest.ts`, Python-TS parity in `parity/python-ts-parity.vitest.ts`, Python compat harness wiring in the two `compat/` tests. Track under the skill-advisor backlog.
