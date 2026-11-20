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
| AC-001 | REQ-001 | Given the phase commit, When the Measured Behavior target command runs, Then it prints `6 targets: tune rebuild skill-budget parent-skill skill-graph-freshness router-reach` and `doctor-skill-advisor-embedder.yaml` does not exist | The command's output and `test -e` printing 1 (T004, T005) | Unmet | - |
| AC-002 | REQ-002 | Given the edited router doc and presentation, When the live `route-validate.sh` runs, Then it exits 0, prints `31 routes validated` and passes J1, and the menu and accepted answers read 1 to 6 with no gap or section 8 | The validator's exit status and count, and a read of the menu (T007, T008, T032) | Unmet | - |
| AC-003 | REQ-003 | Given the edited setup files, When the Measured Behavior leg command runs, Then it prints `sk-code sk-git trigger-index runtime-mirrors advisor delivery`, and no setup file says seven or names an embedder leg | The leg command and the T010 to T012 greps | Unmet | - |
| AC-004 | REQ-004 | Given the edited install workflow, presentation and test, When `node --test doctor-install-contract.test.cjs` runs, Then it reports `fail 0` and `5) /doctor:setup` is the last step in both the workflow and the presentation | The test run and the T013 and T014 greps | Unmet | - |
| AC-005 | REQ-005 | Given the phase commit, When `git grep -l include-semantic-health -- .skilled/commands/doctor` runs, Then it prints nothing | The empty grep output (T036) | Unmet | - |
| AC-006 | REQ-006 | Given both compatibility rows removed and the generator run, When `derive-command-bridges.cjs --check` runs, Then it prints `"status":"fresh"` with `"doctorRoutes":35`, and no file under the advisor names `command-doctor-skill-advisor-embedder` | The `--check` JSON and the empty `git grep -l` (T026, T027, T033) | Unmet | - |
| AC-007 | REQ-007 | Given the phase commit, When `run-all.sh`, the drift guard, the mirror check and the link check run, Then `run-all.sh` exits 0, the drift guard passes, the mirror check prints `PASS` and the link check reports 0 broken | Each command's output and exit status (T031, T033, T034) | Unmet | - |
| AC-008 | REQ-008 | Given the edited route contract test, When `grep -c '^test('` and `node --test` run on it, Then the count is 7, no embedder constant or helper remains, and it reports `fail 0` | The count, the empty grep and the test run (T009) | Unmet | - |
| AC-009 | REQ-009 | Given the edited install docs, When the REQ-009 grep and the `lanes/lexical.js` import run, Then the grep prints nothing, `INSTALL-GUIDE.md` sections run 0 to 13, and the import exits 0 | The grep, the heading list and the import's exit status (T028 to T030) | Unmet | - |
| AC-010 | REQ-010 | Given the cost script deleted, When `git grep -l measure-embedder-cost -- . ':!specs'` runs, Then it prints nothing | The empty grep output (T024, T025, T036) | Unmet | - |
| AC-011 | REQ-011 | Given the edited phrase-reach script, When `node --test doctor-phrase-reach.test.cjs` runs, Then it reports `fail 0` and the script no longer sets `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` | The test run and the T023 grep | Unmet | - |
| AC-012 | REQ-012 | Given the phase commit, When the model-server file grep and `shasum -a 256 heldout.jsonl` run, Then the grep lists the same eight files as at the start commit and the hash is still `e5a41fbcad7db0bd8f5e67034579b74573c6eedf096b60b378d393c32f143191` | The file list, `git diff --stat` over the orphan files and the hash (T003, T037) | Unmet | - |
| AC-013 | REQ-013 | Given phase 001's recorded advisor baseline, When `npm test` runs in the advisor runtime, Then no test that passed in the baseline fails | The test summary set against the baseline row (T035) | Unmet | - |
| AC-014 | REQ-014 | Given the phase commit, When the T036 lane-word grep and the residue check's repo mode run, Then the grep prints nothing and the check lists no doctor path outside the eight model-server files and neither install doc | The empty T036 grep, written with plain pipes in `tasks.md`, and the residue check's JSON (T038) | Unmet | - |

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

**Closeable:** No

Every criterion is Unmet until the doctor edits, the bridge regeneration and the install doc edits land.
<!-- /ANCHOR:closure -->