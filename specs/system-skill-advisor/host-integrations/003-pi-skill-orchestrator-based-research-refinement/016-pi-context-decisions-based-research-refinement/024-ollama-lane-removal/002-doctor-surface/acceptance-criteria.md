---
title: "Acceptance Criteria: Phase 2: doctor-surface"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor surface acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface"
    last_updated_at: "2026-11-20T21:51:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-doctor-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: doctor-surface

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/002-doctor-surface
**Level:** 3
**Status:** Draft
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase commit, When the Measured Behavior target command runs, Then it prints `6 targets: tune rebuild skill-budget parent-skill skill-graph-freshness router-reach` and `doctor-skill-advisor-embedder.yaml` does not exist | The command's output and `test -e` printing 1 (T004, T005). Observed: on the uncommitted working tree over `35983033f76`, the command printed `6 targets: tune rebuild skill-budget parent-skill skill-graph-freshness router-reach` and `test -e` printed 1 | Met | - |
| AC-002 | REQ-002 | Given the edited router doc and presentation, When the live `route-validate.sh` runs, Then it exits 0, prints `31 routes validated` and passes J1, and the menu and accepted answers read 1 to 6 with no gap or section 8 | The validator's exit status and count, and a read of the menu (T007, T008, T032). Observed: `route-validate.sh` exit 0, `31 routes validated`, J1 PASS; menu, answers and help read 1 to 6 with no gap, and section 8 is gone | Met | - |
| AC-003 | REQ-003 | Given the edited setup files, When the Measured Behavior leg command runs, Then it prints `sk-code sk-git trigger-index runtime-mirrors advisor delivery`, and no setup file says seven or names an embedder leg | The leg command and the T010 to T012 greps. Observed: the leg command printed `sk-code sk-git trigger-index runtime-mirrors advisor delivery`; the T010 to T012 greps printed nothing for seven and embedder | Met | - |
| AC-004 | REQ-004 | Given the edited install workflow, presentation and test, When `node --test doctor-install-contract.test.cjs` runs, Then it reports `fail 0` and `5) /doctor:setup` is the last step in both the workflow and the presentation | The test run and the T013 and T014 greps. Observed: `node --test` pass 17, fail 0; `5) /doctor:setup` is the last step in the workflow line and the presentation block | Met | - |
| AC-005 | REQ-005 | Given the phase commit, When `git grep -l include-semantic-health -- .skilled/commands/doctor` runs, Then it prints nothing | The empty grep output (T036). Observed: the grep printed nothing, exit 1 | Met | - |
| AC-006 | REQ-006 | Given both compatibility rows removed and the generator run, When `derive-command-bridges.cjs --check` runs, Then it prints `"status":"fresh"` with `"doctorRoutes":35`, and no file under the advisor names `command-doctor-skill-advisor-embedder` | The `--check` JSON and the empty `git grep -l` (T026, T027, T033). Observed: `--check` exit 0 printed `"status":"fresh"`, `"doctorRoutes":35`, `"changed":[]`; the `git grep -l` printed nothing | Met | - |
| AC-007 | REQ-007 | Given the phase commit, When `run-all.sh`, the drift guard, the mirror check and the link check run, Then `run-all.sh` exits 0, the drift guard passes, the mirror check prints `PASS` and the link check reports 0 broken | Each command's output and exit status (T031, T033, T034). Observed: `run-all.sh` exit 0, `7 suite(s) passed, 0 failed` (node:test 1417 pass, 0 fail; 1422 at start, the 5 deleted embedder tests); drift guard 6 passed; mirror check `PASS: 260 mirrors across 10 trees are in sync.`; link check `15275 links checked, 0 broken`, exit 0 | Met | - |
| AC-008 | REQ-008 | Given the edited route contract test, When `grep -c '^test('` and `node --test` run on it, Then the count is 7, no embedder constant or helper remains, and it reports `fail 0` | The count, the empty grep and the test run (T009). Observed: count 7; `rg -c -i 'EMBEDDER_\|embedder'` printed nothing; `node --test` pass 7, fail 0 | Met | - |
| AC-009 | REQ-009 | Given the edited install docs, When the REQ-009 grep and the `lanes/lexical.js` import run, Then the grep prints nothing, `INSTALL-GUIDE.md` sections run 0 to 13, and the import exits 0 | The grep, the heading list and the import's exit status (T028 to T030). Observed: the grep printed nothing; headings run `## 0.` to `## 13.`; the `lanes/lexical.js` import exited 0 after the clean build | Met | - |
| AC-010 | REQ-010 | Given the cost script deleted, When `git grep -l measure-embedder-cost -- . ':!specs'` runs, Then it prints nothing | The empty grep output (T024, T025, T036). Observed: the grep printed nothing, exit 1 | Met | - |
| AC-011 | REQ-011 | Given the edited phrase-reach script, When `node --test doctor-phrase-reach.test.cjs` runs, Then it reports `fail 0` and the script no longer sets `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` | The test run and the T023 grep. Observed: `node --test doctor-phrase-reach.test.cjs` pass 3, fail 0; the T023 rg printed nothing | Met | - |
| AC-012 | REQ-012 | Given the phase commit, When the model-server file grep and `shasum -a 256 heldout.jsonl` run, Then the grep lists the same eight files as at the start commit and the hash is still `e5a41fbcad7db0bd8f5e67034579b74573c6eedf096b60b378d393c32f143191` | The file list, `git diff --stat` over the orphan files and the hash (T003, T037). Observed: 8 files, identical to the start list; `git diff --stat` over the orphan files printed nothing; hash `e5a41fbcad7db0bd8f5e67034579b74573c6eedf096b60b378d393c32f143191` | Met | - |
| AC-013 | REQ-013 | Given phase 001's recorded advisor baseline, When `npm test` runs in the advisor runtime, Then no test that passed in the baseline fails | The test summary set against the baseline row (T035). Observed: `npm test` exit 0, 196 files, 2568 passed, 8 skipped, 0 failed against the baseline 2570 passed; the two fewer are the head-length cases for the removed embedder rows, not failures | Met | - |
| AC-014 | REQ-014 | Given the phase commit, When the T036 lane-word grep and the residue check's repo mode run, Then the grep prints nothing and the check lists no doctor path outside the eight model-server files and neither install doc | The empty T036 grep, written with plain pipes in `tasks.md`, and the residue check's JSON (T038). Observed: the T036 grep printed nothing; repo mode lists only `orphan-process-check.cjs` and its test under the doctor folder, both model-server files, and neither install doc (live 309 to 283) | Met | - |

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

All fourteen rows are Met on the uncommitted working tree over `35983033f76`, and closure waits for the conductor's commit and implementation summary.
<!-- /ANCHOR:closure -->