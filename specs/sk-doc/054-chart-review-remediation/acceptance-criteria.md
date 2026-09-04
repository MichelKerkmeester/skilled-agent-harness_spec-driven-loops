---
title: "Acceptance Criteria: Chart review remediation"
description: "The closure gate for the review remediation, each row carrying the command that was run and what it printed."
trigger_phrases:
  - "chart remediation criteria"
  - "chart review closure gate"
  - "black cell acceptance"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/054-chart-review-remediation"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Re-ran every row and recorded what it printed"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - "scratch/negative-controls.txt"
      - "scratch/headline-audit.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-054-chart-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Four checker holes are recorded rather than closed, each with the mutation that proves it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/054-chart-review-remediation |
| **Source** | A fresh review of the chart skill, run after the overhaul closed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a class with no fill paints black, When any finite value is banded, Then it lands on a class the stylesheet defines | The band arithmetic clamps both ends. Probed at a zero, a negative and a fraction below one: before the fix the row read three cells of an undefined class, after it reads two empty cells and a defined step | Met | - |
| AC-002 | REQ-002 | Given a claim about a picture, When it is made, Then a render backs it | Both rows rendered at 900 by 6000 with the scheme pinned light, kept beside each other in the probe record | Met | - |
| AC-003 | REQ-003 | Given a form with a palette ceiling, When data passes it, Then the mark takes a defined fill and a notice names the count | Five forms measured before and after. Black pixels fall to zero in every one, and the notice element goes from absent to present | Met | - |
| AC-004 | REQ-004 | Given a headline is an argument, When it is checked against its own block, Then it is true or rewritten | All twenty-seven recomputed. Eight rewritten, nineteen stand, four of those after a reading that could have gone either way and is recorded | Met | - |
| AC-005 | REQ-005 | Given the corpus check is the gate, When it runs from the final state, Then it passes | `check-corpus.cjs --render` prints `RESULT: PASSED` with zero errors, and a second run repeats it because a browser open can die transiently | Met | - |
| AC-006 | REQ-006 | Given a reversed ramp reads as consistent with itself, When a rule guards the mapping, Then it catches the reversal | A new rule of 99 assertions. The five mappings reversed gives four failures naming the file and the class. The same mutation with the rule unwired passes, which is the control | Met | - |
| AC-007 | REQ-007 | Given every form sets attributes through one helper, When a size off the scale goes through it, Then the rule sees it | The type-scale rule now covers the helper path and reports 302 assertions. A size off the scale handed to the helper fails. With the new path disabled it passes | Met | - |
| AC-008 | REQ-008 | Given a table is wider than a phone, When the page is measured at 500 units, Then the document does not scroll sideways | The two files that overflowed now report a document width equal to the viewport, with the table still wider and panning inside its own region | Met | - |
| AC-009 | REQ-009 | Given three axis captions collided with their own ticks, When boxes are measured again, Then none collides | The collision count reads zero, against three before | Met | - |
| AC-010 | REQ-010 | Given a hole is left open, When it is recorded, Then the mutation that proves it is kept | Seven mutations kept with their output, each with a wired and an unwired run. Four holes are recorded rather than closed, with what a fix would cost | Met | - |
| AC-011 | REQ-011 | Given documents disagreed, When each is settled, Then it is corrected or the reason it stands is written | Handled in the document pass, with every changed document moving its version | Met | - |
| AC-012 | REQ-012 | Given prose is authored here, When it is scanned, Then it carries no hard blocker | `hvr_scan.py` reports zero on every document in this packet | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE

**Closeable:** Yes. Twelve rows met, none waived, none superseded.

Four checker holes are deliberately left open and recorded: the motion rule matches its guard
string anywhere in a stylesheet rather than beside each animation, a web font declared inside an
at-rule slips the external-resource rule, the accessibility rule's table half is satisfied by a
commented-out attribute, and a corner held in a variable slips the radius rule. Each has a
mutation that proves it. They are named here so a later pass does not have to rediscover them.
<!-- /ANCHOR:closure -->

---

<!-- ANCHOR:traceability -->
## 4. TRACEABILITY

| REQ | AC-IDs |
|-----|--------|
| REQ-001 | AC-001 |
| REQ-002 | AC-002 |
| REQ-003 | AC-003 |
| REQ-004 | AC-004 |
| REQ-005 | AC-005 |
| REQ-006 | AC-006 |
| REQ-007 | AC-007 |
| REQ-008 | AC-008 |
| REQ-009 | AC-009 |
| REQ-010 | AC-010 |
| REQ-011 | AC-011 |
| REQ-012 | AC-012 |
<!-- /ANCHOR:traceability -->
