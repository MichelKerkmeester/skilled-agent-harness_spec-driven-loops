---
title: "Changelog: Routing parity CI [021-open-ends-remediation/004-routing-parity-ci]"
description: "Chronological changelog for the Routing parity CI phase."
trigger_phrases:
  - "open ends remediation routing parity ci changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-11

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/004-routing-parity-ci` (Level 1)
> Parent packet: `specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation`

### Summary

A new disagreement between the advisor's Python and TypeScript scorers now fails CI, and so does a new prompt shared between the holdout and any test that scores prompts. Before this phase no workflow ran the divergence ratchet, and the ratchet passed only on a machine where the advisor daemon had built a skill graph.

### Added

- Before and after test matrix T1 to T7 (implementation-summary.md)
- Ledger, changelog and version bump (implementation-summary.md, system-skill-advisor changelog)

### Changed

- Reproduce the ratchet baseline with no built skill graph: 2 of 6 failed (local-native-divergence-ratchet.vitest.ts)
- Show a calendar-only top-1 flip: at 2027-01-01 rr-iter3-166 flips (local-native-divergence-ratchet.vitest.ts)
- [P] Measure every scoring surface's overlap with the holdout (holdout-independent.vitest.ts)
- R8 regime header (local-native-divergence-ratchet.vitest.ts)
- R3 pinned clock plus a freshly indexed skill graph read by both scorers (local-native-divergence-ratchet.vitest.ts)
- R5 declared scoring surfaces, allowed-overlap map and corpus-reader scan (holdout-independent.vitest.ts)

### Fixed

- Five-iteration deep review and fixes (review/)

### Verification

- Parity suites (ratchet, holdout, capture workspace root) - PASS, 19 tests in 3 files
- Added CI time, measured locally - About 6.7 s for the ratchet and 1.9 s for the holdout check, median of three runs at load 7. The ratchet took 10.8 s at load 34. setup-python was not measured locally
- Full system-skill-advisor vitest - 4 failed, 1042 passed, 6 skipped, at load 7. The final rerun caught a regression from the capture fix: the workspace-root test expected the first missing module to be fusion.js, and it went from 4 failures to 4 passes once it accepted any built module. The 4 remaining failures (python-compat, advisor-corpus-parity, advisor-graph-health, skill-advisor-cli-parity) are in the set that failed before this phase's tests ran, and none reads a file this phase changed
- Advisor probe batteries - CLI and --via python both print positives 17/17 and false positives 0/5, exit 0
- compiled-route-sync --check, compiled-route-guard, Hermes sync --check, trigger index --check - All exit 0
- actionlint on the workflow - PASS, no output, exit 0
- Strict validation - RESULT: PASSED on the final state
- Tasks complete - 13 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.github/workflows/routing-registry-drift.yml` | Modified | Python setup and two blocking steps in golden-prompt-gate |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modified | Fresh graph, pinned clock, regime header, self-checks, python-less skip |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | Modified | Every scoring surface, per-corpus allowed-overlap map, backed declarations |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Top-level scoringInstant; no entry changed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | Modified | Capture in the ratchet's regime and record the instant |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts` | Modified | Accept any missing built module, since the capture now loads the skill-graph module before the scorer |
| `.skilled/skills/system-skill-advisor/SKILL.md, changelog/v0.15.4.0.md, .hermes/skills/system-skill-advisor/SKILL.md` | Modified, Created | Version 0.15.4.0 and its mirror |

### Follow-Ups

- Live-daemon parity is not covered. The ratchet shows harness-regime parity only, as its header says. A prompt such as rr-iter3-168 can route differently in the live daemon and still pass.
- The version may collide at merge. Sibling phases bump system-skill-advisor in parallel, so the integrator may renumber 0.15.4.0.
- Pre-existing advisor suite failures. Four test files fail in this worktree with or without this change: python-compat, advisor-corpus-parity, advisor-graph-health and skill-advisor-cli-parity. They are outside this phase's scope.
