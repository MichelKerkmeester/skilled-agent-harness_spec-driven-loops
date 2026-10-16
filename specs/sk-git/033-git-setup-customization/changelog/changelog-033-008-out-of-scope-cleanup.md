---
title: "Changelog: Phase 8: out-of-scope-cleanup [033-git-setup-customization/008-out-of-scope-cleanup]"
description: "Chronological changelog for the Phase 8: out-of-scope-cleanup phase."
trigger_phrases:
  - "git setup customization out of scope cleanup changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-16

> Spec folder: `specs/sk-git/033-git-setup-customization/008-out-of-scope-cleanup` (Level 1)
> Parent packet: `specs/sk-git/033-git-setup-customization`

### Summary

The sk-code drift guards pass again, every doctor script has a test, no Hermes mirror header breaks the Human Voice Rules, and sk-create-command states one place for the mandatory input gate. All four issues held when checked against the code, and all four are fixed.

### Added

- Run every gate and record the result lines. See implementation-summary.md Verification.
- Update implementation-summary.md and save continuity

### Changed

- Verify each issue against the code and record baselines (drift guards, drift verifier suite, doctor runner, Hermes sync check). All four held. Baselines: drift guards 1 guard FAILED with 16 ROUTER-DEAD-PATH errors, drift verifier 27 passed, doctor runner 7 suites passed with node:test 332/332, Hermes sync PASS: 68.
- All tasks marked [x]
- No [B] blocked tasks remaining
- Manual verification passed

### Fixed

- Issue 1: skip spec evidence in the router dead-path walk, with a test (verify_alignment_drift.py, test_verify_alignment_drift.py). FIXED: check_router_paths() now calls the existing is_unscanned_record_path(). Drift guards all 4 guards PASSED, verifier 28 passed.
- Issue 2: add the phrase-reach suite and restore the coverage claim (tests/doctor-phrase-reach.test.cjs, scripts/README.md, tests/README.md). FIXED: 2 tests pass, node:test in the runner 334/334. The README names skill-graph-freshness.cjs as the one script whose test lives in the advisor runtime.
- Issue 3: drop the header semicolons, update the marker pattern and regenerate the mirrors (sync-skills-hermes.cjs, verify_alignment_drift.py, .hermes/skills/*/SKILL.md). FIXED: 68 mirrors regenerated, the diff touches only the 68 marker lines and the 57 skill-header sentence lines, header semicolons 0 in all 68, PASS: 68 Hermes skill copies in sync.
- Issue 4: state one gate position across sk-create-command (SKILL.md, README.md, references, assets/command-template.md, playbook). FIXED in the direction the shipped commands follow, not the proposed one: the gate sits after the H1 and its purpose line, before any workflow step. Eight of the nine shipped commands with a MANDATORY INPUT GATE follow it. Three template skeletons and the worked example moved their gate below the H1.
- Mutation check for each code fix. Old router walk: the evidence test fails. Freshness refusal disabled: the stale-build test fails. Old marker pattern: the generated-copy test fails. Each fix restored and rechecked.

### Verification

- run-all-drift-guards.sh - Before: 1 guard FAILED (16 errors). After: exit 0, all 4 guards PASSED, 278 non-blocking warning(s)
- Drift verifier suite - 27 passed before, 28 passed after
- Doctor tests/run-all.sh - Before and after 7 suite(s) passed, 0 failed. node:test 332/332 before, 334/334 after. unittest 10, bash 35, 18 and 21, vitest 18, unchanged
- doctor-phrase-reach.cjs - STATUS=OK phrases=82 bridges=15, exit 0
- sync-skills-hermes.cjs --check - PASS: 68 Hermes skill copies in sync. Generator suite 4/4
- sync-runtime-mirrors.cjs --check - PASS: 185 mirrors across 8 trees are in sync.
- Mutation checks - Old router walk, disabled freshness refusal and old marker pattern each made their test fail
- hvr_scan.py and validate_document.py - No new hard blocker on any touched doc. 0 issues from validate_document.py on each

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modified | Router walk skips spec evidence, marker pattern follows the new header |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modified | Evidence-skip test, marker fixture |
| `.skilled/commands/doctor/scripts/tests/doctor-phrase-reach.test.cjs` | Created | Passing run and stale-build exit 2 |
| `.skilled/commands/doctor/scripts/README.md, tests/README.md` | Modified | Coverage claim and suite row |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modified | Header without semicolons |
| `.hermes/skills/*/SKILL.md (68)` | Regenerated | Header lines, plus the sk-create-command body lines |
| `.skilled/skills/sk-doc/sk-create-command/ SKILL.md, README.md, references/argument-hints-and-modes.md, references/common-pitfalls.md, references/worked-example.md, assets/command-template.md, two playbook files` | Modified | One gate position |

### Follow-Ups

- Pre-existing HVR blockers stay. sk-create-command SKILL.md (31), references/common-pitfalls.md (2), references/worked-example.md (2) and references/argument-hints-and-modes.md (1) had these before this phase, on lines it did not change. Counts are unchanged.
- doctor/git.md is the one shipped command outside the gate rule. It puts the gate before the H1, because phase 7 moved it there to meet the old wording. Moving it back was out of scope. Four other commands (deep/ai-council.md, deep/research.md, deep/review.md, prompt/improve.md) put the gate inside section 1. That still meets the rule, though the skeletons show it before section 1.
- The phrase-reach happy path needs a fresh advisor build. A stale local build makes it fail with exit 2. CI builds the runtime first.
