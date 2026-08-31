---
title: "Acceptance Criteria: Phase 5: Communication Rule and Per-Section Rule Pointers"
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
    packet_pointer: "sk-doc/040-create-repo-rules/001-repo-rules-router/005-communication-rule-and-cross-references"
    last_updated_at: "2026-08-31T10:21:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for the communication rule and pointer phase"
    next_safe_action: "Run the packet gate and record the result"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: Communication Rule and Per-Section Rule Pointers

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/001-repo-rules-router/005-communication-rule-and-cross-references
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given section 8's original rules, When the move is complete, Then every one is present in the new rule or the remnant | Parity check against the committed text recovered from git, not from memory: 17 rules and clauses, 0 lost | Met | - |
| AC-002 | REQ-002 | Given a short factual reply with no complex or ambiguous framing, When the router is consulted, Then the communication trigger still fires | The trigger row reads "write any substantive reply" as its first clause, and section 8's remnant states the breadth in bold | Met | - |
| AC-003 | REQ-003 | Given a turn where no rule file has loaded, When delivery would conflict with rigor, Then section 8 still binds | Both clauses present in the 8-line remnant: "Delivery never softens rigor" and "voice is not a performance ... keep the answer" | Met | - |
| AC-004 | REQ-004 | Given any `AGENTS.md` section with a governing rule, When a reader reaches it, Then it names that rule by a resolving link | 18 pointer insertions; all 8 rule files reachable, each named from 2 to 4 sections; 0 broken links | Met | - |
| AC-005 | REQ-005 | Given the `AGENTS.md` edits, When the record is checked, Then operator approval is on file | Approval given in the request that opened this phase - both the section-8 move and the per-section pointers were operator-directed; recorded in the implementation summary | Met | - |
| AC-006 | REQ-006 | Given the seven sibling rules, When the new file is compared, Then it carries the same anatomy and phase 1's format | `Fires when`, one binding sentence, 11 numbered sections all uppercase and sequential with 11 dividers, closing self-check | Met | - |
| AC-007 | REQ-007 | Given each moved rule, When a reader asks how to apply it, Then the file answers | Every numbered section carries the how and names the failure it prevents - the standard section 8 set for others and did not meet itself | Met | - |
| AC-008 | REQ-008 | Given doctrine owned by another rule, When the new file needs it, Then it links rather than restates | Registers cross-reference `uncertainty-and-honesty.md` section 6; best-practice restraint cross-references `overengineering.md`; neither is re-explained | Met | - |
| AC-009 | REQ-009 | Given the router's scope statement, When the eighth rule is added, Then delivery is inside the stated scope | Scope statement widened to name how the resulting reply reads, and to record that this rule's trigger is unlike the others | Met | - |
| AC-010 | REQ-010 | Given a section with no governing rule, When the pointers are audited, Then it has none | Comment Hygiene, Gates 1 through 4, and Violation Recovery carry no pointer; the absence is required rather than incidental | Met | - |
| AC-011 | REQ-001 | Given the always-loaded document, When the net change is measured, Then it is reported in whichever direction it went | `AGENTS.md` 497 to 507 lines: section 8 gave back 26, the 18 pointers cost 36. The document **grew by 10 lines** - stated rather than framed as a reduction | Met | - |
| AC-012 | REQ-006 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked. Re-run recorded below | Met | - |

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

AC-001 and AC-011 carried the phase. Nothing section 8 bound was lost, checked against
the committed text rather than recalled, and the line accounting is reported as what it
is - the always-loaded document grew by ten lines, because full discoverability cost
more than the section-8 reduction saved. Left out deliberately: any compaction of the
pointers into a central table, which would re-centralize what the operator asked to
distribute. Open and unresolvable here: whether the writing register actually goes quiet
in practice, which only live sessions can show.
<!-- /ANCHOR:closure -->
