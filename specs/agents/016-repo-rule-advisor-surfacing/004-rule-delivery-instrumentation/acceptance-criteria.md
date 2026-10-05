---
title: "Acceptance Criteria: Rule delivery instrumentation"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation"
    last_updated_at: "2026-10-04T15:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Rule delivery instrumentation

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given fixtures with distinctive marker strings, When the analyzer runs, Then no marker appears in its output | pytest `test_output_carries_no_transcript_text` at `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py:75`, passing, text and JSON modes | Met | - |
| AC-002 | REQ-002 | Given fixtures with a write before and after a `REPO RULES.md` read, When the analyzer runs, Then it reports one miss and one hit with denominator 2 | pytest `test_gate5_counts_a_write_before_and_after_the_index_read` at `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py:106`, passing: every-write 1 of 2, first-write 1 of 1 | Met | - |
| AC-003 | REQ-003 | Given a fixture with a `Read`, a `cat` and an injection of the same rule across two windows, When the analyzer runs, Then each channel and window is counted | pytest `test_channels_and_windows_are_counted_separately` at `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py:124`, passing | Met | - |
| AC-004 | REQ-004 | Given two rule versions in git history, When replies fall on each side, Then the split assigns them correctly | pytest `test_replies_split_by_the_rule_version_live_at_their_time` at `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py:158`, passing | Met | - |
| AC-005 | REQ-005 | Given a Codex session fixture, When the analyzer runs, Then it reports a Codex row | pytest `test_codex_session_produces_a_codex_row` at `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py:184`, passing | Met | - |
| AC-006 | SC-001 | Given the evidence pack's window and arguments, When the analyzer runs, Then its `Read`-channel counts match | `--until 2026-10-04T13:13:10Z --channels read,shell,other` printed table 219/1063/86 and semicolon 37.0% of 138, 17.0% of 1015, 43.7% of 215, matching `../002-rule-concision-and-loading/prep/evidence-pack.md:45` | Met | - |
| AC-007 | REQ-008 | Given phase 006 has not started, When the baseline is committed, Then `baselines/` holds the report | `specs/agents/016-repo-rule-advisor-surfacing/004-rule-delivery-instrumentation/baselines/2026-10-04-baseline.txt:1`, committed with this phase before any 006 rule commit | Met | - |

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

All seven criteria are met by passing pytest cases, an exact rerun of the evidence pack and the committed baseline. Adapters for Devin, Cursor, Pi and OpenCode were left out, because each keeps a readable transcript and no experiment needs them yet.
<!-- /ANCHOR:closure -->
