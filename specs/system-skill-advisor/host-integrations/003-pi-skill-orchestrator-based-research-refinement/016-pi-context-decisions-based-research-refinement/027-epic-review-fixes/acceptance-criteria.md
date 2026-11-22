---
title: "Acceptance Criteria: Fix the findings of the fresh epic review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "epic review fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes"
    last_updated_at: "2026-11-22T10:06:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-epic-review-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Fix the findings of the fresh epic review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 027-epic-review-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When `git grep -n 'resolvedCalibration\|CALIBRATION_OVERRIDE'` runs outside `specs/` and changelogs, Then it prints nothing | The grep exited 1 with no output after T004 and T009 `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:179` `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:308` | Met | - |
| AC-002 | REQ-001 | Given an operator sets both location keys, When the launcher builds the daemon env, Then both keys are in it and an unlisted key is not | `launcher-bootstrap.vitest.ts` case "passes the documented feedback-records and route-denylist locations through to the child env" passes `.skilled/bin/system-skill-advisor-launcher.cjs:142` `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:172` | Met | - |
| AC-003 | REQ-002 | Given the apply phase YAML, When the contract suite runs, Then a case runs `report_command` and `apply_command` on a fixture checkout and both exit 0 with `mode`, `exitCode 0` and an empty `askFirst` | `node --test doctor-update-contract.test.cjs` printed `tests 21`, `pass 21`, `fail 0` `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:252` | Met | - |
| AC-004 | REQ-002 | Given `--verbose` is added to the YAML apply command, When the new case runs, Then it fails, and after the file is restored it passes | The mutated run exited 1 on that case; `git diff --quiet` on the restored YAML exited 0 `.skilled/commands/doctor/assets/doctor-update-apply.yaml:222` | Met | - |
| AC-005 | REQ-003 | Given the final tree, When the gate set in plan.md section 5 runs, Then every gate exits 0 and the advisor suite keeps 4 skipped | `implementation-summary.md` Verification table `implementation-summary.md:133` | Met | - |
| AC-006 | REQ-004 | Given the final tree, When `git grep score-outcome-rerank` runs outside `specs/`, Then it prints nothing, and the holdout ratchet passes | The grep exited 1; the holdout ratchet printed `6 passed (6)` `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:87` | Met | - |
| AC-007 | REQ-005 | Given the final tree, When the scorer-eval baseline ratchet runs with no recapture, Then it passes, which shows default scoring did not move | `scorer-eval-baseline-ratchet.vitest.ts` printed `7 passed (7)` `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:156` `implementation-summary.md:134` | Met | - |
| AC-008 | REQ-006 | Given the Python fallback, When the Python suite and the corpus and divergence ratchets run, Then all pass with the baseline counts | Python suite `pass=123, fail=0` before and after; corpus ratchet exit 0; divergence ratchet `9 passed (9)` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1899` `implementation-summary.md:136` | Met | - |
| AC-009 | REQ-007 | Given the primary checkout, When its advisor `dist/` is listed, Then no `semantic-shadow` file and no `embedders` folder remain, and the projection fixture names no embedding column | `ls dist/runtime/lib/scorer/lanes \| grep -c semantic` printed 0; `ls -d dist/runtime/lib/embedders` reported no such file; `grep -c embedding projection-fallback-049-005.vitest.ts` printed 0 `.skilled/skills/system-skill-advisor/runtime/tests/scorer/projection-fallback-049-005.vitest.ts:71` | Met | - |
| AC-010 | REQ-008 | Given the 016 parent, When `grep -n '027-epic-review-fixes' spec.md` runs, Then it prints row 27 and its handoff row | Two lines printed `../spec.md:163` | Met | - |
| AC-011 | REQ-003 | Given this packet and its parent, When `validate.sh --strict` runs, Then each prints `RESULT: PASSED` | `implementation-summary.md` Verification table `implementation-summary.md:143` | Met | - |
| AC-012 | REQ-009 | Given the Python native bridge, When `_native_bridge_env` builds the child env from both location keys and an unlisted key, Then it keeps exactly the two location keys | Python suite BRIDGE-ENV PASS `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:238` `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2755` | Met | - |
| AC-013 | REQ-009 | Given an override folder that excludes `sk-git`, When the fallback scores "create a git worktree and commit the changes", Then `sk-git` is absent, and it returns when a local file holds an empty list, and a hub row that executor delegation adds back is dropped too | Python suite ROUTE-EXCL PASS, `before=['sk-git', ...]`; the case failed with the loop skip removed and again with only the final drop removed `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:407` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5008` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5141` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:84` `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2715` | Met | - |
| AC-014 | REQ-010 | Given the apply phase YAML, When the cleanup case runs, Then the apply command exits 0 with no answer, with `delete` and with `keep`, and the case fails when the YAML offers `remove` instead of `delete` | `doctor-update-contract.test.cjs` printed `pass 21`; the mutation with `remove` in place of `delete` exited 1 and the restored YAML matched `git diff --quiet` `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:272` | Met | - |
| AC-015 | REQ-011 | Given the final tree, When `git grep 'HOOK_CACHE_HIT_P95\|HOOK_FAILOPEN\|AlertThresholds\|own explicit workflow signal'` runs outside `specs/` and changelogs, Then it prints nothing | The grep exited 1 with no output `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:65` `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:342` | Met | - |
| AC-016 | REQ-012 | Given the launcher's child env list, When BRIDGE-PARITY compares it with the bridge's list and the launcher-only set, Then no key is missing, and a lane-weights override changes the bridge child's top result | Python suite BRIDGE-PARITY PASS with 37 launcher keys, BRIDGE-SCORER PASS with `plain=[('sk-git', 0.9436)] weighted=[('system-spec-kit', 0.82)]`; both failed with the lane-weights key removed `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:242` `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:255` `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2779` `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2800` | Met | - |
| AC-017 | REQ-012 | Given `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` set to 0.6, 1.7 or a word, When the Python default is resolved, Then it is 0.6, 0.8 and 0.8 | Python suite THRESHOLD-ENV PASS `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2331` `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2831` | Met | - |
| AC-018 | REQ-013 | Given "review the code for the iterative solver" and its twin with "recursive", When the scorer ranks both, Then they share a top skill that is not the loop hub, and the gate offers no run for either | `deep-loop-ask-routing.vitest.ts` minimal-pair cases pass; the command corpus rows `nm-system-deep-loop-10` to `12` show `offered: false` with sk-code on top `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:292` `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:449` `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:95` `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts:99` | Met | - |
| AC-019 | REQ-013, REQ-014 | Given the shared fixture, When the native test and the Python DEEP-LOOP-GATE case read it, Then every case matches in both, and restoring the bare loop words fails 6 native cases | Native fixture test 28 of 28, the 27 cases plus the both-sides check, and Python DEEP-LOOP-GATE PASS; the restored bare words failed 6 cases `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:1` | Met | - |
| AC-020 | REQ-014 | Given the Python fallback, When it scores a stuck-run complaint, a blog post about the loop and a counted research ask, Then the first has no run row, the second has no loop hub, and the third keeps its run row | Python suite DEEP-LOOP-FALLBACK PASS; it failed with the gate call removed `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4607` `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2881` | Met | - |
| AC-021 | REQ-015 | Given a running process that has read the exclusion list, When the file is rewritten and then a local override is added, Then each change takes effect without a cache reset, and the prompt cache signature carries the file's stamp | `route-exclusions.vitest.ts` new case passes and failed with the stamp check removed `.skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94` `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:72` `.skilled/skills/system-skill-advisor/runtime/tests/route-exclusions.vitest.ts:139` | Met | - |
| AC-022 | REQ-016 | Given `ENV-REFERENCE.md`, When it is searched for the four keys and the timing note, Then each key has a row and the note says when a running daemon picks up a change | Rows and note present `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:306` `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:330` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met with the output each one observed.
<!-- /ANCHOR:closure -->
