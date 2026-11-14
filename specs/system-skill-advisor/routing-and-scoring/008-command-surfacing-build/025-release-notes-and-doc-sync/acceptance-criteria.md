---
title: "Acceptance Criteria: Phase 25: release-notes-and-doc-sync"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "release notes and doc sync acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/025-release-notes-and-doc-sync"
    last_updated_at: "2026-11-14T12:45:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 once phases 019 to 024 are Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-025-release-notes-and-doc-sync"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 25: release-notes-and-doc-sync

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 025-release-notes-and-doc-sync
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the extended entry, When the shape check runs and the three section headings are searched, Then it prints `PASS` and each heading is found once | `check_changelog_shape.py` prints `SUMMARY files=1 pass=1 fail=0`, and `rg -c -e '^## (Command Fit|One Head on Every Runtime|Workflow Measure)$'` over `v1.1.0.0.md` prints 3 (T015) | Unmet | - |
| AC-002 | REQ-002 | Given every line the phase added to the seven files, When each number is looked up in `scratch/release-facts.txt`, Then each is found beside its source line and a verifier that did not write the lines agrees | `rg -c -e '^UNTRACED' scratch/fact-check.txt` prints nothing and the file holds one `verifier: PASS` line (T016) | Unmet | - |
| AC-003 | REQ-003 | Given the added changelog lines, When they are searched for gain wording, Then only the limits sentence is found | The gain search of T016 prints one line, the sentence that ends `more often.` | Unmet | - |
| AC-004 | REQ-004 | Given the `command-attach.ts` row of the lib README, When it is searched, Then it names `commandOnlyMentioned` and the three gated creation commands | `rg -c 'commandOnlyMentioned' runtime/lib/README.md` prints 1 and the document check exits 0 (T009) | Unmet | - |
| AC-005 | REQ-005 | Given the tests README and the command meaning page, When they are searched for `17 cases`, Then nothing is found and both hold the count the test run printed | `rg -c -F '17 cases'` over both files prints nothing (T010, T012) | Unmet | - |
| AC-006 | REQ-006 | Given the advisor recommend page, When it is searched, Then it says the first recommendation gets its command under every request shape and names when a command is withheld | `rg -c -F 'under every request shape'` prints 1 and `rg -c -e 'refuses or asks about'` prints 1 (T011) | Unmet | - |
| AC-007 | REQ-007 | Given the doctor command page and the command bridges README, When each is searched for the companion line, Then each shows it with `(<policy>)` and says when it is left out | `rg -c -F 'Also: /doctor:<command> <target> (<policy>)'` prints 1 for each file (T013, T014) | Unmet | - |
| AC-008 | REQ-008 | Given the phase diff, When the changed files outside `specs/` are listed and each is checked, Then the list is the seven files, each document check exits 0 and the catalog package check exits 0 | The checks of T015 and T017 | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

The phase is planned and not built, so every row is unmet.
<!-- /ANCHOR:closure -->
