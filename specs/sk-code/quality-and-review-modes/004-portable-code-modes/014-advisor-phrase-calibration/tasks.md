---
title: "Tasks: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor phrase calibration tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`RT` is `.skilled/skills/system-skill-advisor/runtime`. Every command runs from the worktree root unless it starts with `cd RT`. `PY` is `/opt/homebrew/bin/python3`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm or refute the cause with the scorer's own lane breakdown on a fixture skill (scratch probe over `scoreAdvisorPrompt` `laneContributions`, real projection plus one fixture skill). Verify: `browser agent` top was the fixture surface at 0.544667 over mcp-tooling 0.533608 with explicit evidence `["author:browser","author:browser"]` (raw 1.000) against `["author:browser agent"]` (raw 0.880); `css extraction` top was the fixture surface at 0.603467 over sk-design 0.582933. With the words declared in one field only, explicit was 0.700 and both hubs won. Cause confirmed and refined: the two hits are one word scored once per field.
- [x] T002 Confirm the same fault in the Python mirror (temp skills root). Verify: `css extraction` ranked `fixture-generic-surface` 0.78 (`!css(keyword), !css(signal)`) over `fixture-design-hub` 0.69.
- [x] T003 Capture the vitest baseline (`cd RT && npx vitest run`). Verify: `Test Files 153 passed (153)`, `Tests 1301 passed | 8 skipped (1309)`, exit 0. A fresh worktree first failed four graph-sensitive tests until its gitignored `runtime/database/skill-graph.sqlite` was indexed through `skill_graph_scan`.
- [x] T004 Capture the Python baseline (`PY RT/tests/python/test_skill_advisor.py`). Verify: `Summary: pass=87, fail=0`, exit 0.
- [x] T005 Capture the routing-accuracy baseline (`node RT/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`). Verify: full corpus 155/195, holdout 49/66, ambiguity 19/24, unknown 13, gold-none false fire 5, buckets review 25/31, memory_save 27/32, delegation 13/13; equal to the committed `scorer-eval-baseline.json`.
- [x] T006 Capture the reach baselines. Verify: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` prints `STATUS=OK phrases=118 bridges=22`, exit 0; `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --json` reports 7 hubs, 506 declared phrases, 3 unreachable all `allowed`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add the TypeScript fixture test before the fix (`RT/tests/scorer/declared-phrase-specificity.vitest.ts`). Verify: `cd RT && npx vitest run tests/scorer/declared-phrase-specificity.vitest.ts` on the unchanged lane printed `expected 'fixture-generic-surface' to be 'fixture-automation-hub'`, `expected 'fixture-generic-surface' to be 'fixture-design-hub'`, `Tests 3 failed (3)`, exit 1.
- [x] T008 Count a repeated author phrase once per skill (`RT/lib/scorer/lanes/explicit.ts`). Verify: the same command prints `Tests 3 passed (3)`, exit 0. Narrowed to bare words in T019.
- [x] T009 Add the Python fixture test (`RT/tests/python/test_skill_advisor.py`, `test_declared_phrase_specificity`). Verify: against a scratch copy carrying `git show HEAD:` of `skill_advisor.py`, both `T243-SA-030a` and `T243-SA-030b` printed `FAIL` with `fixture-generic-surface` 0.78 over the hub 0.69.
- [x] T010 Skip a repeated keyword under a rival exact phrase (`RT/scripts/skill_advisor.py`). Verify: `PY RT/tests/python/test_skill_advisor.py` prints `PASS: T243-SA-030a`, `PASS: T243-SA-030b`, `Summary: pass=89, fail=0`, exit 0. The first attempt, a plain dedup, failed the legacy corpus parity (`expected 111 to be 113`) and the divergence ratchet (`rr-iter3-151`, `rr-hub6-206`), so it was narrowed (ADR-001).
- [x] T011 Write the changelog entry and step the carrier (`.skilled/skills/system-skill-advisor/changelog/v0.17.15.0.md`, `SKILL.md` `version: 0.17.15.0`). Verify: `PY .skilled/skills/sk-doc/shared/scripts/validate_document.py <entry> --json` prints `"total_issues": 0`; origin/main's newest entry is `v0.17.12.0`.
- [x] T012 Sync Hermes copies. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` prints `Wrote 1 of 67 Hermes skill copies; pruned 0`, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rebuild the runtime (`npm --prefix RT run build`). Verify: exit 0 and `grep -c scoredPhrases RT/dist/runtime/lib/scorer/lanes/explicit.js` prints 3; the daemon's lane breakdown for `mobbin onboarding patterns` shows mcp-tooling explicit raw 0.7, not the 1.0 a repeat would give.
- [x] T014 Rerun the full vitest suite. Verify: `Test Files 154 passed (154)`, `Tests 1304 passed | 8 skipped (1312)`, exit 0 (baseline plus the new file and its 3 tests). Superseded by T025.
- [x] T015 Rerun the parity and divergence ratchets verbosely (`npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/compat/python-compat.vitest.ts --reporter=verbose`). Verify: every python-ts parity, divergence ratchet, eval ratchet and legacy corpus parity case prints a check mark, exit 0.
- [x] T016 Rerun the routing-accuracy capture. Verify: the metrics object is identical to T005.
- [x] T017 Rerun both reach probes. Verify: doctor reach output is byte-identical to T006 (`STATUS=OK phrases=118 bridges=22`); router reach reports the same 506 phrases and the same 3 allowed rows.
- [x] T018 Validate the packet (`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --recursive --strict`). Verify: prints `RESULT: PASSED`.

### Review fix round 1

- [x] T019 Collapse only single-word repeats in TypeScript (`RT/lib/scorer/lanes/explicit.ts`, `tokenize(normalized, true).length <= 1`). Verify: `help me with markdown notes in this repo` scores mcp-tooling 0.715388 over sk-doc 0.688114 on both the unchanged build and this one (pinned probe regime); the reviewer had measured sk-doc 0.688117 over mcp-tooling 0.674887 on the all-repeats version.
- [x] T020 Add the multi-word control (`declared-phrase-specificity.vitest.ts`, `keeps a multi-word phrase declared in both fields counting twice`). Verify: evidence is `['author:markdown notes', 'author:markdown notes']` and score 1; passes.
- [x] T021 Restrict the Python skip to one-token keywords (`RT/scripts/skill_advisor.py`, `_repeats_word_of_rival_phrase`). Verify: Python suite `Summary: pass=89, fail=0`, exit 0.
- [x] T022 Add the cross-scorer case that spawns Python on the fixture skills root (`declared-phrase-specificity.vitest.ts`, `ranks the declaring hub first in TypeScript and in the Python fallback alike`). Verify: against HEAD sources the file prints `Tests 4 failed | 1 passed (5)` with `native` and `python` both `fixture-generic-surface`; after, `Tests 5 passed (5)`.
- [x] T023 Add four guard rows to the harder corpus and recapture the divergence ledger (`harder-intent-prompt-corpus.ts`, `local-native-approved-divergences.json`). Verify: the capture prints `"corpusSize":221,"currentDivergences":75,"priorEntries":74,"added":["harder:c2182871dbf3"],"resolved":[],"changed":[]`; the Python skip fires on `delegate to opencode` and `opencode cli`; HEAD and new Python give the same top on all four rows.
- [x] T024 Run the 320-prompt repeat probe on the unchanged build and this build (scratch `tsmoved.mjs` over the reviewer's `probe-prompts.json`). Verify: 0 top-1 moved; 56 top scores changed.
- [x] T025 Rerun every gate after a fresh rebuild. Verify: vitest `Test Files 154 passed (154)`, `Tests 1306 passed | 8 skipped (1314)`, exit 0; Python 89/0; eval capture metrics and hashes identical to the committed baseline; doctor reach byte-identical; router reach 506 phrases, same 3 allowed rows. A first run failed four CLI tests with `daemon launcher exited with code 1` because restoring the sources after the HEAD comparison left them newer than `dist/`; a rebuild cleared it.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every gate in Phase 3 equals its Phase 1 baseline, with only the new tests added
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A gate that moves against its baseline blocks close; the fix is narrowed or not shipped.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md and ADR-001
- [x] CHK-003 [P1] Baselines captured before the first scorer edit (T003 to T006)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm --prefix RT run build` (tsc over `tsconfig.build.json`) exits 0
- [x] CHK-011 [P0] The Python harness imports and runs the changed module with `fail=0`
- [x] CHK-012 [P1] No new error path: the dedup adds a set lookup and a subset test
- [x] CHK-013 [P1] Comments state the durable reason and carry no packet or task ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Each new test fails before and passes after (T007 to T010)
- [x] CHK-021 [P0] Full vitest and Python suites pass (T014, T010)
- [x] CHK-022 [P1] Edge cases covered: two distinct declared words still add, and a multi-word phrase declared twice still counts twice
- [x] CHK-023 [P1] Regression path checked: the two prompts the plain Python dedup broke route correctly again (T010)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` (one producer per scorer, consumed by fusion, confidence and ranking).
- [x] CHK-FIX-002 [P0] Same-class producers: the explicit lane's author loop is the one place `intentSignals` and `keywords` are summed; the slash-target list already dedups with a `Set`. In Python, the keyword pass and `_apply_signal_boosts` are the two producers.
- [x] CHK-FIX-003 [P0] Consumers: `_apply_signal_boosts` has one caller; fusion, confidence and evidence readers are unchanged and their ratchets pass.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction surface.
- [x] CHK-FIX-005 [P1] Matrix: field (one or two) x phrase (bare word or multi-word) x words (repeat or distinct) x scorer (TypeScript or Python); the tests cover a bare-word repeat on both scorers, a multi-word repeat and distinct words on TypeScript.
- [x] CHK-FIX-006 [P1] Env pinned: gates run under the capture scripts' own regime (empty DB dir, semantic off, private roots unset).
- [x] CHK-FIX-007 [P1] Evidence is against worktree HEAD `667e4a011d` plus this packet's uncommitted diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets touched
- [x] CHK-031 [P0] N/A: no new input surface; the scorer reads the same metadata
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec, plan, tasks and ADR name the same two rules
- [x] CHK-041 [P1] Each code change carries a WHY comment
- [x] CHK-042 [P2] Changelog entry written; no README describes the per-field sum
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probes and before/after captures live in the session scratchpad, outside the repository
- [x] CHK-051 [P1] The packet `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
