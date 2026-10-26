---
title: "Acceptance Criteria: Phase 4: doctrine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "phase 4 doctrine acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/004-doctrine"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "spec-doc"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-doctrine-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 4: doctrine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/004-doctrine
**Level:** 2
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Every command runs from the repository root.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Iron Law 3 at line 109 of `.skilled/skills/sk-code/shared/references/phase-detection.md` still says the surface needs the user to name it, When task T003 lands, Then the amended sentence sits on line 109 | `rg -n "An UNKNOWN surface gets only the universal floor" .skilled/skills/sk-code/shared/references/phase-detection.md` prints one line starting `109:` | Unmet | - |
| AC-002 | REQ-002 | Given the UNKNOWN row and order step 4 in `.skilled/skills/sk-code/shared/references/stack-detection.md` still say any standard applies, When task T004 lands, Then both lines name the built-in checks | `rg -n "built-in checks" .skilled/skills/sk-code/shared/references/stack-detection.md` prints two lines, starting `32:` and `49:` | Unmet | - |
| AC-003 | REQ-003 | Given the UNKNOWN row and the restraint citation in `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` still carry the old wording, When task T005 lands, Then the new wording sits on lines 122 and 57 | `rg -n "The universal floor in sections 3 to 5" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line starting `122:`. `rg -n "Restraint Signals table in the repository" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line starting `57:` | Unmet | - |
| AC-004 | REQ-004 | Given the universal floor and the mechanical floor are not yet defined, When tasks T006 and T007 land, Then the floor is defined, and the plain JavaScript parse finding is marked heuristic | `rg -n "universal floor is sections 3 to 5" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line. `rg -n "^### Mechanical Floor" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line. `rg -n "heuristic and does not block" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line | Unmet | - |
| AC-005 | REQ-005 | Given `universal-checklist.md` still describes itself as applying to all code files, When task T010 lands, Then its heading names the SKILLED house checklist and the old phrase is gone | `rg -n "^# SKILLED House Code Quality Checklist" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints `14:`. `rg -n "apply to all code files" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints no line | Unmet | - |
| AC-006 | REQ-006 | Given three checklist lines still name an operator-private skill id, When task T011 lands, Then no file in the checklist folder names an operator-private skill id | `rg -l "local-" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` prints nothing | Unmet | - |
| AC-007 | REQ-007 | Given CHK-CSS-09 is tagged P0, When task T012 lands, Then it is tagged P2 | `rg -n "CHK-CSS-09" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` prints one line starting `65:` that contains `[P2]` | Unmet | - |
| AC-008 | REQ-008 | Given each changed package still holds its starting version and no entry for this phase, When tasks T018 to T020 land, Then each package shows a higher version and no released changelog line is deleted | `rg -n "^version:" .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints three values above their starting values. `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git diff --numstat HEAD -- .skilled/skills/sk-code/changelog .skilled/skills/sk-code/sk-code-quality/changelog .skilled/skills/sk-code/sk-code-skilled/changelog` prints no row whose second column is not `0` | Unmet | - |
| AC-009 | REQ-009 | Given the eleven edited docs, the two SKILL.md files and the new changelog files are changed, When task T022 runs, Then the document validator accepts each changed Markdown file | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` exits 0 for each changed Markdown file | Unmet | - |
| AC-010 | REQ-009 | Given the doctrine changes touch the sk-code surfaces the drift guards read, When task T023 runs, Then the four drift guards pass | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, and its last line reads `run-all-drift-guards: all 4 guards PASSED`. The baseline at authoring time was that line with 10 non-blocking warnings | Unmet | - |
| AC-011 | REQ-009 | Given the packet folder holds the finished spec files, When task T026 runs, Then the strict validator passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/004-doctrine --strict --no-recursive` prints `RESULT: PASSED` as its last line, with `Errors: 0` | Unmet | - |
| AC-012 | REQ-010 | Given the review-severity column is proposed, When task T008 lands and task T021 completes, Then four tables carry the column and ADR-003 records each row that review changed | `rg -c "Review severity" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints `4`. ADR-003 in `decision-record.md` lists each changed row | Unmet | - |
| AC-013 | REQ-011 | Given the verification template reads PASS and BLOCKED, and the style guide names this user's projects, When tasks T013 and T014 land, Then the runner gate values replace both | `rg -n "Gate Result" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` prints lines starting `53:` and `76:`, each naming `NO_BLOCKER_FOUND`. `rg -n -F "this user's projects" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints no line | Unmet | - |
| AC-014 | REQ-012 | Given the P0 table in `.skilled/skills/sk-code/sk-code-quality/SKILL.md` has no link to standards section 3, When task T015 lands, Then the link sentence sits above the table, and ESCALATE IF item 1 names the UNVERIFIED rule in place of ambiguous surface detection | `rg -n "tier rules and the P0 categories" .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints one line starting `192:`, and `rg -n -F 'Surface detection is ambiguous' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints no line | Unmet | - |
| AC-015 | REQ-013 | Given the implement, debug and verify handoff lines do not yet name the runner or the envelope fields, When tasks T016 and T017 land, Then each line names them | `rg -n "quality-gate.cjs" .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md` prints four lines, starting `41:` and `119:` in the implement file and `41:` and `147:` in the debug file. `rg -n "never supplies" .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line starting `55:`. `rg -n "checker_outputs" .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line starting `56:` | Unmet | - |
| AC-016 | REQ-014 | Given workflow step 2 still runs the comment-hygiene checker first, When task T009 lands, Then step 2 runs the runner first | `rg -n "quality-gate.cjs" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line numbered from 131 to 140 | Unmet | - |

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

All sixteen rows are `Unmet`. The phase has not started. Rows close only after tasks T001 to T028 run, and each close needs the evidence named in its Verification cell.
<!-- /ANCHOR:closure -->
