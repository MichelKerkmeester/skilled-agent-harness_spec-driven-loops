---
title: "Changelog: Phase 24: typed-command-ambiguity [054-weak-model-spec-authoring/024-typed-command-ambiguity]"
description: "Chronological changelog for the Phase 24: typed-command-ambiguity phase."
trigger_phrases:
  - "weak model spec authoring typed command ambiguity changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-27

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/024-typed-command-ambiguity` (Level 2)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

A typed /deep:research :auto prompt now routes to system-deep-loop with no ambiguity flag, and the flag as a whole stops firing on noise: 78 of 261 labelled prompts are flagged instead of 110, with the same 202 correct top skills and no top skill changed.

### Added

- [P] Let a floored member cluster on the score margin alone when the top is not floored, and add wideAmbiguityMembers (ambiguity.ts). Verify: with the exception switched off, advisor-quality-049-003.vitest.ts prints 1 failed | 17 passed (18); with it on, it passes.
- [P] Make the brief trust the scorer's boolean and name a cluster member after "vs" ($R/lib/render.ts, skill-advisor-brief.ts). Verify: advisor-renderer.vitest.ts passes its new precomputed and "vs" cases.
- CHK-003 Dependencies identified: the advisor runtime build, rebuilt before the harness and probes.
- CHK-010 npm run typecheck and npm run build exit 0 in the advisor runtime.
- CHK-011 No new warning: the build prints no TypeScript error.
- CHK-012 An older payload without ambiguous or the new fields still renders: the brief re-derives when the flag is missing.

### Changed

- Reproduce the flag on the typed prompt. Verify: the live probe printed ambiguous: true, system-deep-loop 0.564694 over system-spec-kit 0.564693.
- Record the typed-command seed that held a skill down as heldBelow ($R/lib/scorer/fusion.ts, types.ts), and skip that pair in the cluster (ambiguity.ts). Verify: typed-command-routing.vitest.ts failed 2 of 8 before, 8 of 8 after.
- [P] Mark floored confidence as confidenceFloored in confidenceFor (fusion.ts, types.ts). Verify: npm run typecheck exits 0.
- Point the low-info abstention at wideAmbiguityMembers (fusion.ts). Verify: the harness shows 0 top changes over 261 prompts.
- Run the P0 regression set and the Python twin. Verify: overall_pass: true with no failures, and pass=85, fail=0.
- Run the full advisor suite and the live probe. Verify: 0 failed files, and the probe prints ambiguous: false.

### Fixed

- Get an independent design review with measurements. Verify: the Opus high review scored 261 labelled prompts: 110 flagged, 202 correct, and option (d) at 78 flagged, 202 correct, 0 top changes.
- Rerun the 261-prompt harness on the real build. Verify: flags 110 to 78, correct 202 to 202, top changes 0, and the typed prompt reads ambiguous false.
- CHK-021 Manual check: the 261-prompt harness on the real build gives 202 correct, 0 top changes, 78 flags.
- CHK-FIX-001 Finding class: class-of-bug, a floor counted as a tie for every task prompt.
- CHK-FIX-002 Same-class producers: every floor branch in confidenceFor sets the mark; the adjacent-confidence uncertainty bump (fusion.ts) shares the noise and is recorded as a limitation.
- CHK-FIX-003 Consumers: scorer flag, brief renderer, hook CLI fallback, brief builder and the low-info abstention; the Python twin path re-derives and is recorded.

### Verification

- Held-pair tests on the old code - 2 of 8 failed; 8 of 8 pass after
- Floor test with the exception off - `1 failed \
- 261-prompt harness on the real build - Flags 110 to 78, correct 202 to 202, top changes 0
- P0 regression set - overall_pass: true, failures: []
- Python twin - pass=85, fail=0
- Full advisor suite - Test Files 150 passed (150), `Tests 1253 passed \
- Live probe, typed /deep:research :auto - system-deep-loop 0.56469, ambiguous: false
- Typecheck and build - exit 0

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts` | Modified | heldBelow and confidenceFloored on a recommendation |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | Record the holding seed and floored confidence; abstention reads the wide set |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Modified | Held-pair and floor exceptions; wideAmbiguityMembers |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts, lib/skill-advisor-brief.ts` | Modified | Trust the scorer's boolean; "vs" names a cluster member |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts, handlers/advisor-recommend.ts, hooks/lib/skill-advisor-cli-fallback.ts` | Modified | Carry heldBelow through the public output |
| `.skilled/skills/system-skill-advisor/runtime/tests/ (typed-command routing, quality 049-003, legacy renderer)` | Modified | Failing-first tests |
| `.skilled/skills/system-skill-advisor/SKILL.md, changelog/v0.17.7.0.md, Hermes copy` | Modified, Created | Release 0.17.7.0 |
| `.gitignore` | Modified | /specs/other/ kept local, at the operator's request |

### Follow-Ups

- The Python fallback re-derives the flag the old way. When the advisor falls back to skill_advisor.py, the brief has no scorer verdict and clusters by the plain 0.05 rule. Port the floor rule to the twin if that path matters.
- A related uncertainty bump keeps the floor noise. fusion.ts adds 0.04 uncertainty when adjacent candidates' confidences are within 0.05, which floored skills still trigger.
- cli-classifier replay baselines will move. They build clusters from ambiguousWith; refresh them on their next run.
