---
title: "Acceptance Criteria: Fix the findings of the fresh epic review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "epic review fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/027-epic-review-fixes"
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
| AC-001 | REQ-001 | Given the final tree, When `git grep -n 'resolvedCalibration\|CALIBRATION_OVERRIDE'` runs outside `specs/` and changelogs, Then it prints nothing | The grep exited 1 with no output after T004 and T009 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:179] [SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:308] | Met | - |
| AC-002 | REQ-001 | Given an operator sets both location keys, When the launcher builds the daemon env, Then both keys are in it and an unlisted key is not | `launcher-bootstrap.vitest.ts` case "passes the documented feedback-records and route-denylist locations through to the child env" passes [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:142] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:172] | Met | - |
| AC-003 | REQ-002 | Given the apply phase YAML, When the contract suite runs, Then a case runs `report_command` and `apply_command` on a fixture checkout and both exit 0 with `mode`, `exitCode 0` and an empty `askFirst` | `node --test doctor-update-contract.test.cjs` printed `tests 21`, `pass 21`, `fail 0` [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:252] | Met | - |
| AC-004 | REQ-002 | Given `--verbose` is added to the YAML apply command, When the new case runs, Then it fails, and after the file is restored it passes | The mutated run exited 1 on that case; `git diff --quiet` on the restored YAML exited 0 [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:222] | Met | - |
| AC-005 | REQ-003 | Given the final tree, When the gate set in plan.md section 5 runs, Then every gate exits 0 and the advisor suite keeps 4 skipped | `implementation-summary.md` Verification table [SOURCE: implementation-summary.md:109] | Met | - |
| AC-006 | REQ-004 | Given the final tree, When `git grep score-outcome-rerank` runs outside `specs/`, Then it prints nothing, and the holdout ratchet passes | The grep exited 1; the holdout ratchet printed `6 passed (6)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:87] | Met | - |
| AC-007 | REQ-005 | Given the final tree, When the scorer-eval baseline ratchet runs with no recapture, Then it passes, which shows default scoring did not move | `scorer-eval-baseline-ratchet.vitest.ts` printed `7 passed (7)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:156] [SOURCE: implementation-summary.md:110] | Met | - |
| AC-008 | REQ-006 | Given the Python fallback, When the Python suite and the corpus and divergence ratchets run, Then all pass with the baseline counts | Python suite `pass=123, fail=0` before and after; corpus ratchet exit 0; divergence ratchet `9 passed (9)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1899] [SOURCE: implementation-summary.md:112] | Met | - |
| AC-009 | REQ-007 | Given the primary checkout, When its advisor `dist/` is listed, Then no `semantic-shadow` file and no `embedders` folder remain, and the projection fixture names no embedding column | `ls dist/runtime/lib/scorer/lanes \| grep -c semantic` printed 0; `ls -d dist/runtime/lib/embedders` reported no such file; `grep -c embedding projection-fallback-049-005.vitest.ts` printed 0 [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/projection-fallback-049-005.vitest.ts:71] | Met | - |
| AC-010 | REQ-008 | Given the 016 parent, When `grep -n '027-epic-review-fixes' spec.md` runs, Then it prints row 27 and its handoff row | Two lines printed [SOURCE: ../spec.md:163] | Met | - |
| AC-011 | REQ-003 | Given this packet and its parent, When `validate.sh --strict` runs, Then each prints `RESULT: PASSED` | `implementation-summary.md` Verification table [SOURCE: implementation-summary.md:119] | Met | - |

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
