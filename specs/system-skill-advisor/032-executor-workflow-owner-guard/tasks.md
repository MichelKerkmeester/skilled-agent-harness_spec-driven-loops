---
title: "Tasks: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test"
description: "Ordered tasks for the workflow-owner guard, the divergence ratchet cause and the skill-root inventory record. Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "executor workflow owner guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the whole advisor suite for a baseline (`.skilled/skills/system-skill-advisor/runtime`). Verify: `./node_modules/.bin/vitest run` printed `Test Files  7 failed | 143 passed (150)` and `Tests  7 failed | 1246 passed | 8 skipped (1261)`, exit 1.
- [x] T002 Capture the live advisor output for the two prompts. Verify: `advisor_recommend` listed `cli-external-orchestration` 0.95 above `system-deep-loop` 0.9248 and 0.9324.
- [x] T003 Read `fusion.ts` `hasExplicitWorkflowSignal` and the abstain and route branches of `applyExecutorDelegationOverride` (`lib/scorer/executor-delegation.ts`). Verify: the route branch at the lift loop is the only place that puts the hub first.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the five new tests before the code (`tests/scorer/executor-delegation.vitest.ts`). Verify: against the old module two of the five fail, the three plain delegations pass.
- [x] T005 Add the workflow-owner guard (`lib/scorer/executor-delegation.ts`, `WORKFLOW_OWNER_SKILL_IDS`, `hasExplicitWorkflowMatch`, owner branch before the final return). Verify: `vitest run tests/scorer/executor-delegation.vitest.ts` prints `Tests  14 passed (14)`.
- [x] T006 Rebuild the runtime (`.skilled/skills/system-skill-advisor/runtime`). Verify: `npm run typecheck` and `npm run build` exit 0 and `grep -c WORKFLOW_OWNER dist/runtime/lib/scorer/executor-delegation.js` prints 6.
- [x] T007 Find why the ratchet counts 76 divergences against 74 ledger entries. Verify: bisecting `lib/` and `skill_advisor.py` back to the ledger commit left the two divergences in place; unsetting `SPECKIT_PRIVATE_SKILL_ROOTS` made the ratchet pass 9 of 9.
- [x] T008 Make the ratchet hermetic against private skills (`tests/parity/local-native-divergence-ratchet.vitest.ts`, `scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs`). Verify: with the variable still exported, the ratchet prints `Tests  9 passed (9)`.
- [x] T009 Record the skill-root reader inventory fix another agent made (`router-replay-lib.cjs`, `skill-root-reader-inventory.test.cjs`). Verify: `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` prints `pass 70`, `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the whole advisor suite after the ratchet fix. Verify: `Tests  5 failed | 1253 passed | 8 skipped (1266)`, exit 1, the five all private-skill suites.
- [x] T014 Clear the private skill roots variable in the five suites and restore it afterwards (`tests/doctor-routing-slice.vitest.ts`, `tests/legacy/advisor-corpus-parity.vitest.ts`, `tests/parity/python-ts-parity.vitest.ts`, `tests/parity/holdout-independent.vitest.ts`, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts`). Verify: each file passes alone with the variable exported (2, 1, 2, 6 and 7 tests).
- [x] T015 Check the confidence of `delegate this refactor to codex using gpt-6.1 terra` on the old module and the new one. Verify: both print `cli-external-orchestration:0.82:0.26`; `resolveExecutorDelegation` returns `null` for it on both, so Task 1 did not lower it and no change was made.
- [x] T016 Rebuild after the probe bumped the source mtime. Verify: `npm run build` exits 0 and `tests/cli-exit-taxonomy.vitest.ts` plus `tests/skill-advisor-cli-job-semantics.vitest.ts` print `Tests  9 passed (9)`.
- [x] T011 Run the drift guard and deep parity suites. Verify: `vitest run tests/routing-registry-drift-guard.vitest.ts tests/routing-parity-deep-skills.vitest.ts tests/routing-parity-deep-council.vitest.ts` prints `Tests  21 passed (21)`, exit 0.
- [x] T012 Read the live CLI output for the two prompts. Verify: `system-deep-loop` 0.9248 then `cli-external-orchestration` 0.9238, and 0.9324 then 0.9314.
- [x] T013 Validate the packet. Verify: `validate.sh specs/system-skill-advisor/039-executor-workflow-owner-guard --strict` prints `RESULT: PASSED`.

- [x] T017 Follow-up: baseline the split-handoff gap. Verify: before the change `resolveExecutorDelegation` returned null for `delegate this refactor to codex using gpt-6.1 terra` and the new tests printed `Tests  4 failed, 24 passed (28)`.
- [x] T018 Check whether `codex` alone should be an alias. Verify: `cli-codex` aliases in `cli-external-orchestration/mode-registry.json` are `codex cli`, `codex exec`, `delegate to codex`, `cli-codex`, `codex sandbox`; the bare noun `codex` already enters `orchestratorNouns` from the packet name, so no metadata or hardcoded alias is needed and none was added.
- [x] T019 Add the split-handoff match to the TypeScript resolver (`lib/scorer/executor-delegation.ts`, `SPLIT_HANDOFF_OBJECT`, `matchesSplitHandoff`, noun filter in `resolveExecutorDelegation`). Verify: `vitest run tests/scorer/executor-delegation.vitest.ts` prints `Tests  28 passed (28)`.
- [x] T020 Mirror it in the Python scorer (`scripts/skill_advisor.py`, `_matches_split_handoff`). Verify: the TS-native == Python fixture test passes on the four new fixture cases.
- [x] T021 Add the split-handoff and prose cases to the shared fixture and the handler count (`tests/parity/fixtures/executor-delegation-cases.json`, `tests/handlers/advisor-validate.vitest.ts`, `scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: delegation bucket 9 to 13 in the baseline, `advisor-validate` expects 13, `vitest run tests/parity` prints `Tests  60 passed (60)`.
- [x] T022 Failing-first against `HEAD`'s module. Verify: with `HEAD`'s `executor-delegation.ts` swapped in, the run printed `Tests  8 failed, 20 passed (28)` (three split cases, the two fixture tests, the two workflow-owner tests that `HEAD` also lacks, and the codex 0.95 lift); the edited module was restored and 28 of 28 pass.
- [x] T023 Rebuild and read the live CLI. Verify: `npm run typecheck` and `npm run build` exit 0; the codex prompt prints `cli-external-orchestration 0.95 0.2` with target `cli-codex`; `delegate the decision to the team` and `hand off to QA` print no recommendations.
- [x] T024 Whole advisor suite after the follow-up. Verify: `Test Files  150 passed (150)`, `Tests  1272 passed, 8 skipped (1280)`, exit 0 (variable exported); drift guard plus both deep parity suites `Tests  21 passed (21)`.
- [x] T025 Follow-up: find the date-dependent input. Verify: `scoreDerivedLane` (`lib/scorer/lanes/derived.ts`) passes `skill.derivedGeneratedAt` and the scoring clock to `derivedAgeMultiplier` (`lib/lifecycle/age-haircut.ts`), a 90-day half-life floored at 0.1; capturing at `2027-03-05` instead of `2026-10-11` printed full corpus 154 and ambiguity 17 against 155 and 19.
- [x] T026 Pin the scoring date in the capture script (`scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`). Verify: the date comes from `SPECKIT_EVAL_BASELINE_SCORING_DATE`, else the baseline's recorded `capturedAt`, never the wall clock; an invalid date exits 2; the script also clears `SPECKIT_PRIVATE_SKILL_ROOTS`.
- [x] T027 Recapture with `--write`, replacing the hand edit. Verify: `git diff` of `scorer-eval-baseline.json` shows only `capturedAtSha` and delegation 9 to 13; `capturedAt` stays `2026-10-11` and the full-corpus (155) and ambiguity (19) numbers are unchanged.
- [x] T028 Prove determinism. Verify: two captures under injected wall clocks `2026-10-27` and `2027-03-05` produced byte-identical output (`cmp` silent); a control with the scoring date moved to `2027-03-05` printed 154.
- [x] T029 Add the capture-date test first and run it on `HEAD`'s script (`tests/parity/scorer-eval-baseline-capture-date.vitest.ts`). Verify: `Tests  2 failed (2)` on `HEAD`'s script, `Tests  2 passed (2)` on the new one.
- [x] T030 Rerun the gates. Verify: full suite `Test Files  151 passed (151)`, `Tests  1274 passed, 8 skipped (1282)` (one earlier run had a single transient `daemon-watcher-new-root-ingestion` failure that passes alone and on rerun); drift guard plus deep parity `Tests  21 passed (21)`; `tests/parity` `Tests  62 passed (62)`; `npm run typecheck` exit 0.
- [x] T031 Alignment follow-up baseline. Verify: whole advisor suite printed `Test Files  1 failed | 153 passed (154)`, `Tests  1 failed | 1325 passed | 8 skipped (1334)`, exit 1; the one failure was `scorer-eval-baseline-capture-date` reading `capturedAtSha` `65bafca332` and then `5fd869a67c` because another session committed mid-run.
- [x] T032 Capture live before-routes for the five prompts (`advisor_recommend` with `includeAttribution`). Verify: `packet-local changelog` and `Document a packet-local changelog.` ranked system-spec-kit first; the iteratively executor prompt ranked cli-external-orchestration 0.95 first; the turn-off prompt tied sk-git, sk-code and system-spec-kit at 0.82 (ambiguous); `how do I set SPECKIT_WORKTREE_AUTOREAP=0` returned nothing.
- [x] T033 Write the new tests before the code (`tests/scorer/route-gates.vitest.ts`, `tests/scorer/executor-delegation.vitest.ts`, `tests/routing-parity-deep-skills.vitest.ts`, golden rows). Verify: the four files printed `Tests  8 failed | 73 passed (81)` on the unchanged scorer.
- [x] T034 Stop reading `packet-local` as corpus-study vocabulary when it qualifies a changelog (`lib/scorer/fusion.ts`). Verify: `tests/scorer/packet-local-changelog.vitest.ts` prints `Tests  2 failed (2)` with `HEAD`'s `fusion.ts` swapped in and `Tests  2 passed` on the edit; `ci-router-vocabulary-reach.cjs --hub sk-doc` prints `outranked=  0` and `RESULT: PASSED`.
- [x] T035 Add `iteratively` to the research-loop and review-loop words (`lib/scorer/lanes/explicit.ts`) and to the Python deep-mode loop words (`scripts/skill_advisor.py`). Verify: route-gates, the iteratively executor case and `INV-009` pass.
- [x] T036 Add the sweep vocabulary to sk-git (`.skilled/skills/sk-git/graph-metadata.json`). Verify: `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts` prints `Tests  3 failed | 1 passed (4)` on `HEAD`'s metadata and passes on the edit.
- [x] T037 Find the holdout drop the first full run showed (`holdout top-1 live=48/66 baseline=49`). Verify: dropping one phrase at a time showed only `speckit_worktree_autoreap` moved `P1-REVIEW-006` ("auto review this PR") to sk-git, through the token `autoreap` that `phraseVariants` derives and the lexical prefix rule in `lib/scorer/text.ts` matches against `auto`; with it removed the holdout scored `correct=49/66`.
- [x] T038 Move the two short changelog prompts out of the golden fixture into `tests/scorer/packet-local-changelog.vitest.ts`, because `prompt-policy-gold-replay` declines them as `below_prompt_policy_threshold`. Verify: golden, prompt-policy replay, holdout, scorer-eval ratchet and both new scorer files print `Tests  50 passed (50)`.
- [x] T039 Catalogue executor delegation (`feature-catalog/scorer-fusion/executor-delegation.md`, `feature-catalog/feature-catalog.md`) and regenerate the leaf manifest. Verify: `validate_catalog_package.py --package system-skill-advisor` prints `PASS: 0 violations`; `ci-skill-root-metadata.cjs` prints `checked=14 passed=14 failed=0` after `--fix`, which changed only the advisor's `leaf-manifest.json` and `leaf-aliases.json`.
- [x] T040 Decide the fast-mode mapping prompt. Verify: live it ties three skills at 0.82 with no skill owning the Pi fast-mode extension in its metadata; left unchanged, reason in `implementation-summary.md`.
- [x] T041 Release 0.17.18.0 (`changelog/v0.17.18.0.md`, `SKILL.md`) after `git fetch origin main` showed 0.17.17.0 as the highest on both sides. Verify: `sync-skills-hermes.cjs` wrote 1 of 67 copies and `--check` printed `PASS: 67 Hermes skill copies in sync`.
- [x] T042 Rebuild and read the live CLI. Verify: `npm run typecheck` and `npm run build` exit 0; live routes recorded in `spec.md` Measured Behavior.
- [x] T043 Whole advisor suite after the follow-up. Verify: `Test Files  156 passed (156)`, `Tests  1339 passed | 8 skipped (1347)`, exit 0, against the T031 baseline of 1325 passed and 1 race failure in 154 files; the 13 new tests account for the delta and neither the scorer-eval baseline nor the divergence ledger needed a recapture. `python3 tests/python/test_skill_advisor.py` prints `pass=89, fail=0`.

- [x] T044 Second alignment pass baseline. Verify: whole advisor suite `Test Files  1 failed | 155 passed (156)`, `Tests  1 failed | 1338 passed | 8 skipped (1347)`; the failure was `scorer-eval-baseline-capture-date` reading `capturedAtSha` `382e4b6955` then `4e7538a4aa`, the commit another session made at 07:57 during the 07:55 run, and the file passed alone afterwards (`Tests  2 passed (2)`). `python3 tests/python/test_skill_advisor.py` printed `pass=89, fail=0`.
- [x] T045 Capture live and Python before-routes. Verify: recorded in `spec.md` Measured Behavior; the Python fallback listed the hub first on all four workflow-owned prompts.
- [x] T046 Add four `workflow-owner` cases to the shared fixture and a Python order test (`tests/parity/fixtures/executor-delegation-cases.json`, `tests/scorer/executor-delegation.vitest.ts`). Verify: before the port the run printed `Tests  2 failed | 28 passed (30)`, both failures on the Python side (`python=cli-external-orchestration`).
- [x] T047 Port the guard to the Python fallback (`scripts/skill_advisor.py`, `_apply_workflow_owner_guard`, `_executor_lift_id`, `_is_loop_workflow_request`, the `_workflow_evidence` flag). Verify: `Tests  31 passed (31)`; the plain delegations keep the hub first.
- [x] T048 Move the delegation bucket total in `tests/handlers/advisor-validate.vitest.ts` from 13 to 17.
- [x] T049 Enumerate the prefix rule's partial matches over the six prompt corpora. Verify: 46 pairs from 416 prompts, compounds such as `open -> opencode` and `launch -> launchpad` among real suffixes such as `refactor -> refactoring`.
- [x] T050 Write the prefix tests first (`tests/scorer/lexical-candidate-dedup.vitest.ts`, `tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts`). Verify: `Tests  1 failed | 5 passed (6)` (`expected 0.15 to be +0`) and `Tests  1 failed | 5 passed (6)` (`expected null to be 'sk-git'`) on the unchanged code.
- [x] T051 Credit only a suffix extension in `scoreTokenOverlap` (`lib/scorer/text.ts`, `extendsBySuffix`). Verify: the prefix tests pass; `tests/parity`, `doctor-routing-slice`, `advisor-corpus-parity` and `advisor-validate` printed `Tests  1 failed | 74 passed (75)`, the one failure the expected delegation bucket move.
- [x] T052 Declare `speckit_worktree_autoreap` and `worktree autoreap` for sk-git (`.skilled/skills/sk-git/graph-metadata.json`). Verify: the sk-git and prefix files print `Tests  12 passed (12)`.
- [x] T053 Negative control: the new metadata with the old rule. Verify: `holdout top-1 regressed: live=48/66 baseline=49` and "auto review this PR" ranked sk-git; the rule was restored.
- [x] T054 Typecheck, build and recapture. Verify: `npm run typecheck` exit 0, `npm run build` completed; a dry capture on the stale `dist/` had shown holdout 48, the capture on the fresh build matched the baseline except `capturedAtSha` and delegation 13 to 17, and `--write` recorded exactly that.
- [x] T055 Live checks after the change. Verify: recorded in `spec.md` Measured Behavior.
- [x] T056 Router vocabulary reach for every hub. Verify: `RESULT: PASSED` with `outranked=  0` for sk-doc, sk-code, sk-design, system-deep-loop, cli-external-orchestration, cli-classifier and mcp-tooling.
- [x] T057 Release 0.17.19.0 after `git fetch origin main` showed 0.17.18.0 as the highest on both sides (`changelog/v0.17.19.0.md`, `SKILL.md`), correct the catalog's Python guard sentence. Verify: `sync-skills-hermes.cjs` wrote 1 of 67 copies, `--check` printed `PASS: 67 Hermes skill copies in sync`; `validate_catalog_package.py` printed `PASS: 0 violations`; `ci-skill-root-metadata.cjs` printed `checked=14 passed=14 failed=0`; `python3 tests/python/test_skill_advisor.py` printed `pass=89, fail=0`.
- [x] T058 Whole advisor suite after the second pass. Verify: `Test Files  156 passed (156)`, `Tests  1345 passed | 8 skipped (1353)`, exit 0, HEAD `4e7538a4aa` before and after the run; against the T044 baseline the six new tests account for the delta.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in the advisor runtime exits 0
- [x] CHK-011 [P0] No new comment names a spec, packet or task id (`git diff` of the four code files)
- [x] CHK-012 [P1] A workflow owner without a passing recommendation or explicit evidence falls through to the old lift
- [x] CHK-013 [P1] The guard mirrors `hasExplicitWorkflowSignal` and imports nothing from `fusion.ts`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`)
- [x] CHK-021 [P0] Live `advisor_recommend` output checked for both prompts
- [x] CHK-022 [P1] The three plain delegation prompts still route to the CLI hub first
- [x] CHK-023 [P1] The new tests fail on the old module
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: executor-over-workflow ordering is `class-of-bug` (any delegation cue beside a workflow-owned prompt); the ratchet failure is `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n CLI_HUB_SKILL_ID lib` shows the abstain branch, which suppresses and never lifts, so only the route branch needed the guard.
- [x] CHK-FIX-003 [P0] Consumers: `fusion.ts` calls `applyExecutorDelegationOverride` once and reads the returned array; the output shape is unchanged.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction logic changed.
- [x] CHK-FIX-005 [P1] Matrix axes: owner (deep-loop, spec-kit) by evidence (explicit, none) by threshold (pass, fail). The tests cover deep-loop with explicit evidence and three no-owner prompts; the other rows fall through to the unchanged lift.
- [x] CHK-FIX-006 [P1] Hostile env variant run: the full suite with `SPECKIT_PRIVATE_SKILL_ROOTS` exported and with it unset both print `Tests  1258 passed | 8 skipped (1266)`, exit 0.
- [x] CHK-FIX-007 [P1] Evidence pinned to the working tree on top of `bd57319633`; nothing is committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A: no credential, network or file write added
- [x] CHK-031 [P0] N/A: no external input parsed
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the five files and the two other-agent files
- [x] CHK-041 [P1] Comments in `executor-delegation.ts` state the durable reason only
- [x] CHK-042 [P2] README not edited, as instructed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live in the session scratchpad; the temporary probe test under `tests/` was deleted (`git status` lists no `zz-probe`)
- [x] CHK-051 [P1] `scratch/` in this packet holds only what the scaffold created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---



