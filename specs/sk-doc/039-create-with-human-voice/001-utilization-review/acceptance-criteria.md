---
title: "Acceptance Criteria: Phase 1: utilization-review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/039-create-with-human-voice/001-utilization-review"
    last_updated_at: "2026-09-02T18:52:04Z"
    last_updated_by: "utilization-review"
    recent_action: "Met all nine acceptance criteria and recorded the command behind each"
    next_safe_action: "Hand the six write-ups to the operator for a decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: utilization-review

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 039-create-with-human-voice/001-utilization-review
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every Verification cell names a command and the output it must print. `PKT` stands for
`.opencode/skills/sk-doc/sk-create-with-human-voice`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given nine playbook scenarios, When the review closes, Then each carries an outcome and its evidence | `implementation-summary.md` heading `Playbook Results` lists nine rows, each with a verdict and a measured number, evidence at `implementation-summary.md:60` | Met | - |
| AC-002 | REQ-002 | Given the mode's own report template, When it is scanned, Then it reports no hard blocker | `python3 $PKT/scripts/hvr_scan.py $PKT/assets/voice-report-template.md` prints `hard blockers:          0` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/assets/voice-report-template.md:43` | Met | - |
| AC-003 | REQ-002 | Given the five edited files, When each is validated, Then each passes the sk-doc document contract | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <absolute path>` prints `VALID` with `Total issues: 0` and exits 0, for each of the five, evidence at `.opencode/skills/sk-doc/scripts/validate_document.py:246` | Met | - |
| AC-004 | REQ-001 | Given the two shipped fixtures, When the control pair runs after the fixes, Then both report what they reported before | `python3 $PKT/scripts/hvr_scan.py $PKT/scripts/tests/fixtures/voice-dirty.md` prints `hard blockers:          6`, `mechanical deductions:  -33`, `mechanical ceiling:     67/100` and exits 1. The clean fixture prints `no mechanical findings`, `100/100` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md:130` | Met | - |
| AC-005 | REQ-004 | Given the playbook was edited, When its package contract is re-checked, Then it still passes with a nonzero operator count | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package $PKT/manual-testing-playbook` prints `PASS package=sk-doc/sk-create-with-human-voice ... operator=9 ... violations=0 warnings=0` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:12` | Met | - |
| AC-006 | REQ-002 | Given the shipped worked example, When the file it cites is scanned, Then the example's rows match the output | `python3 $PKT/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-repo-rule/README.md` prints the same six grouped rows the example lists: `harness` x2 hard, `do` x7, `take` x3, `get` x1, `might` x1 and `, and` x9, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md:113` | Met | - |
| AC-007 | REQ-003 | Given eight newcomer prompts, When each is routed, Then the result is recorded whether or not it reaches the mode | `implementation-summary.md` heading `Newcomer Routing` lists eight prompts with the skill, the score and the selected workflow mode or the absence of one, evidence at `implementation-summary.md:75` | Met | - |
| AC-008 | REQ-005 | Given findings outside the mode's authority, When the review closes, Then each is written up with the observation behind it | `implementation-summary.md` heading `Write-Ups` lists six entries, each naming the command or file that produced it, evidence at `implementation-summary.md:110` | Met | - |
| AC-009 | REQ-002 | Given this phase folder, When it is validated, Then it passes strict validation with its rule lines visible | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/sk-doc/039-create-with-human-voice/001-utilization-review --strict` prints `RESULT: PASSED`, evidence at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1` | Met | - |

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

AC-001, AC-004 and AC-005 carried the packet: the playbook ran for the first time, the
controls held either side of the fixes, and the operator contract survived the playbook
edit. Consciously left out: the two scoring systems in the standard, the hub routing
vocabulary and the scanner's template detection, all three written up rather than changed
because each is a decision rather than a repair.
<!-- /ANCHOR:closure -->
