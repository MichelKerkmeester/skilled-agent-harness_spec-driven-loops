---
title: "Tasks: Phase 23: vibe-review-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe review remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: vibe-review-remediation

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

- [x] T001 Scaffold this phase under packet 004 and point 022 and the parent at it (`023-vibe-review-remediation/`, `../spec.md`). Verify: `rg -n '023-vibe-review-remediation' ../spec.md ../022-vibe-hook-playbook-and-live-scenarios/spec.md` prints three lines.
- [x] T002 Label the three stale verdict rows and the claims built on them before any rerun (`../022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md`, its `implementation-summary.md`, `../spec.md`). Verify: `rg -c 'before the automatic tier' ../022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` prints 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Pin `deepseek-flash` in the runner's Vibe home and record `vibe_model` from the session metadata (`run-conversation-scenario.cjs`). Verify: `node tests/run-conversation-scenario.test.cjs` prints `PASS conversation runner suite`.
- [x] T004 [P] VIB-HK-007: one turn reads both files and writes `answer.txt`, so a tool call follows the compaction; `launch_setup` drops the runner's pin before its own (`hook-scenarios/compaction-post-tool.md`). Verify: the playbook validator prints `violations=0`.
- [x] T005 [P] VIB-HK-006: the `compact` check waits for the finished checkpoint (`hook-scenarios/turn-start-compaction-reinjection.md`). Verify: `rg -c 'generationStatus' hook-scenarios/turn-start-compaction-reinjection.md` prints 2.
- [x] T006 [P] VIB-HK-005: seed `src/uploader.mjs` and name it in the prompt (`hook-scenarios/turn-start-save-nudge.md`). Verify: the scenario's setup run in an empty folder writes the module.
- [x] T007 Detector: every consumed id joins the seen list, an empty journal folder measures 0, the state folder must exist, and the watermark order is documented (`compaction-context.mjs`). Verify: `node --test compaction-context.test.mjs` prints `pass 15`, and the three new behavior tests fail on the old file.
- [x] T008 Withdraw an armed hand-over only on a `pre_agent` that carries a typed prompt (`handover-parts.mjs`). Verify: `node --test tests/vibe-adapters.test.cjs` prints `fail 0`, and the new test fails on the old file.
- [x] T009 [P] Correct the doc drift: both goal READMEs, the session-lifecycle README, the `turn-start.mjs` header, `guards-and-hooks.md`, both feature catalogs, the playbook's verdict pointer, the over-width comment in `relaunch-core.cjs`. Verify: `rg -n 'nothing re-injects it after compaction' .skilled` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun VIB-HK-004 to 008 live with the pin, then VIB-HK-003 to 007 again on the merged code (`scratchpad/run-batch.sh`). Verify: each `scratch/live/VIB-HK-00N/vibe/result.json` under 022 reads `"verdict": "PASS"` with a `vibe_model`.
- [x] T011 Update the verdict table, 022's summary and the parent row from the reruns. Verify: `rg -c 'before the automatic tier' ../022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` prints 0.
- [x] T012 Record a disposition for every review finding (`implementation-summary.md`). Verify: each finding id in `../review/review-report.md` section 3 appears in the disposition table.
- [x] T014 Rerun VIB-HK-027 live: a full hop and a withdraw probe (`scratch/harness/`). Verify: `node scratch/harness/score.cjs scratch/runs/hop4-vibe` prints `"score": "5/5"`, and `scratch/runs/wd3-vibe/relaunch.log` holds `withdrawn` with `reason=user-message`; `hop3` and `wd2` are the same pair from before the last merge.
- [x] T015 Rerun every other runner scenario with the pin; fix the scenario gaps it finds in VIB-HK-001, 012 and 022. Verify: every `result.json` under 022's `scratch/live/` reads PASS with a `vibe_model`.
- [x] T016 [P] Add VIB-HK-028 and run it live (`hook-scenarios/turn-start-advisor-uptake.md`). Verify: `scratch/live/VIB-HK-028/vibe/turns/uptake/check.txt` prints `advised-skill-loaded`.
- [x] T017 [P] Ignore lineage Vibe homes and exports (`.gitignore`). Verify: `git check-ignore` matches a file under `review/lineages/vibe-1/vibe-home/`.
- [x] T013 Recursive strict validation of the parent. Verify: `validate.sh ../ --recursive --strict` prints `RESULT: PASSED`.
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
- **Review**: See `../review/review-report.md`
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

- [x] CHK-010 [P0] Code passes lint/format checks: `node --check` on each changed module exits 0
- [x] CHK-011 [P0] No console errors or warnings in the unit suites
- [x] CHK-012 [P1] Error handling implemented: every changed hook path still returns an empty string on failure
- [x] CHK-013 [P1] Code follows project patterns: comments state the reason, no ids
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: the five live reruns
- [x] CHK-022 [P1] Edge cases tested: empty restore, catch-up, missing folder, empty journal folder, blank prompt
- [x] CHK-023 [P1] Error scenarios validated: a missing folder falls back, a blank prompt leaves the record armed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: see the disposition table in `implementation-summary.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the `payload.cwd` state path appears once in the detector (`stateDirFor`); the `arm` cwd appears in the Vibe, Claude and Codex adapters and stays shared.
- [x] CHK-FIX-003 [P0] Consumer inventory: `writeWatermark` and `measureJournal` have no caller outside `compaction-context.mjs`; `pinVibeModel` and `vibeSessionModels` are new exports used by the runner and its suite.
- [x] CHK-FIX-004 [P0] Path fix adversarial cases: a relative folder, a missing absolute folder and an existing one; the first two fall back to the checkout.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: five scenarios by one pinned model.
- [x] CHK-FIX-006 [P1] Hostile env variant: the detector tests pass an empty `env`, so no packet resolves from the caller's shell.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `f8dcf4940db` plus this phase's diff; each `result.json` carries its start time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the payload folder must exist as a directory
- [x] CHK-032 [P1] Auth/authz: not applicable, the hooks run as the operator
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated: goal and session-lifecycle READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: live evidence under 022's `scratch/live/`, drafts in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion: untracked snapshot files left out of the commit
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
