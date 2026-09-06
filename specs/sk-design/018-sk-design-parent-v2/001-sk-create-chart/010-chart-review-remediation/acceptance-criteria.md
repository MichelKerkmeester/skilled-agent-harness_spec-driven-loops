---
title: "Acceptance Criteria: Chart review remediation"
description: "The closure gate for the review remediation, each row carrying the command that was run and what it printed, including the pass that closed the recorded holes."
trigger_phrases:
  - "chart remediation criteria"
  - "chart review closure gate"
  - "black cell acceptance"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/010-chart-review-remediation"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed the recorded-hole row against its own mutations and controls"
    next_safe_action: "None open"
    blockers: []
    key_files:
      - "scratch/negative-controls.txt"
      - "scratch/headline-audit.txt"
      - "scratch/checker-holes-closed.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-054-chart-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The recorded checker holes are closed, each watched failing on its own mutation against its own unwired control"
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
| **Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/010-chart-review-remediation |
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
| AC-010 | REQ-010 | Given a hole is left open, When it is recorded, Then the mutation that proves it is kept | Seven mutations kept with their output, each with a wired and an unwired run. Four holes were recorded with what a fix would cost, and a later pass closed all five the packet named: eleven more mutations in `scratch/checker-holes-closed.txt`, every one red against the rule and green against a copy of the checker with that single assertion switched off. The plain corner the radius rule always caught is kept among them, red under both the new pattern and the old, so widening the rule can be shown not to have dropped it | Met | - |
| AC-011 | REQ-011 | Given documents disagreed, When each is settled, Then it is corrected or the reason it stands is written | Handled in the document pass, with every changed document moving its version | Met | - |
| AC-012 | REQ-012 | Given prose is authored here, When it is scanned, Then it carries no hard blocker | `hvr_scan.py` reports zero on every document in this packet | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE

**Closeable:** Yes. Twelve rows met, none waived, none superseded.

The four checker holes this packet left open are closed, along with the fifth it believed it had
closed and had only closed for the colour words somebody had thought to list. Naming them here is
what let the later pass start from the mutation rather than from the search, which is the whole
reason a recorded hole is worth more than a forgotten one.

Each took the different parser that recording it said it would need, and the reason for recording
rather than widening held: the corpus check reads 3,231 assertions from the final state against
3,113 before, and none of the twenty-one shipped forms started failing. What is left is stated in
the checker's `scripts/README.md` beside the rule it belongs to, and none of it is a file passing
while it is wrong.
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
