---
title: "Acceptance Criteria: Phase 10: verification-and-release"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "verification and release acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/010-verification-and-release"
    last_updated_at: "2026-10-30T14:30:39Z"
    last_updated_by: "markdown-agent-010"
    recent_action: "Read CI on main for the release commit and turned the last acceptance row"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-verification-and-release"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does every workflow run for the release commit conclude success? Twelve runs, every one success"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: verification-and-release

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/010-verification-and-release
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase 1 baseline, When `package_skill.py --check --strict` runs on every shipped skill, Then each verdict matches the baseline | `scratch/after.md:71` T004: 13 of 13 roots printed `Result: PASS` at exit 0, the same verdicts as the baseline, measured at `0a8bd93611` | Met | - |
| AC-002 | REQ-002 | Given the final tree, When `capture-scorer-eval-baseline.mjs` runs without `--write`, Then it reads 155/195, 49/66 and 19/24 | `scratch/after.md:96` T005: the scorer JSON reads 155/195, 49/66 and 19/24, exit 0, no `--write`, measured at `0a8bd93611` | Met | - |
| AC-003 | REQ-003 | Given the final tree, When `leaf-route-replay.cjs \| grep ^total` runs, Then it prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50` | `scratch/after.md:127` T006: the replay printed that line at exit 0, measured at `0a8bd93611` | Met | - |
| AC-004 | REQ-004 | Given the final tree, When `run-all.sh` runs, Then every suite prints PASS | `scratch/after.md:139` T007: `7 suite(s) passed, 0 failed`, exit 0, measured at `0a8bd93611` | Met | - |
| AC-005 | REQ-005 | Given the temp-repo harness, When convert runs on a scratch plain skill and a scratch pre-migration skill, Then each ends strict PASS and its `.skilled/changelog/<name>` link resolves to `v<version>.md` | `scratch/after.md:158` and `scratch/after.md:429`: both conversions printed `Result: PASS`, `ls` printed `v1.0.0.0.md` and `v1.11.5.0.md`, and each apply exited 0 with all six integration rows reporting, measured at `665c2ba863`. The same two endings were driven at the workflow level in `scratch/workflow-run.md`: line 327 ends the declined run at `STATUS=CANCELLED ACTION=cancelled` and line 347 records the tree identical to its opening read, while line 639 ends the accepted run at `STATUS=OK` and line 652 reports its four post-checks passing, their outputs at lines 563 to 613 | Met | - |
| AC-006 | REQ-006 | Given the setup presentation, When `/doctor:setup` runs, Then it lists `/doctor:sk-skill check` and `/doctor:sk-skill convert` | `scratch/after.md:820` T010: `rg -c` printed 2, both rows in the target list the run renders first, measured at `0a8bd93611` | Met | - |
| AC-007 | REQ-007 | Given the router and presentation, When `validate_document.py .skilled/commands/doctor/sk-skill.md --type command` and `route-validate.sh` run, Then both exit 0 and the validator prints `Total issues: 0` | `scratch/after.md:837` T011: `Total issues: 0` at exit 0, `20 routes validated` at exit 0, measured at `0a8bd93611` | Met | - |
| AC-008 | REQ-008 | Given the merge commit on main, When `gh run list --branch main` is read for it, Then every run concludes `success` or is switched off | `scratch/after.md:905` T014: `gh run list --commit 5dc15c537385ce2a40d7b1797b23b3c8afea9f22 --json name,status,conclusion` printed 12 runs, every one `"status":"completed"` and `"conclusion":"success"`, with none switched off. The three earlier landing commits read the same way: `0a8bd93611` 19 runs, `c6bee18a45` 15 runs and `afb71aa136` 15 runs, every run success | Met | - |
| AC-009 | REQ-009 | Given the release, When `validate_document.py` runs on the new `.skilled/changelog/skilled/` entry with `--type changelog`, Then it exits 0 | `scratch/after.md:872` T013: `VALID` with `Total issues: 0` at exit 0, re-read at `665c2ba863` after two bullets were added | Met | - |

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

All nine rows are met against recorded runs. Eight were measured in the worktree and two of those were rerun at `665c2ba863` after the conversion fixes. AC-008 is the post-merge read, and it holds too: every workflow run for the release commit `5dc15c5373` concluded success, as did every run for the three commits the program landed under.
<!-- /ANCHOR:closure -->
