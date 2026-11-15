---
title: "Acceptance Criteria: Phase 1: voice-rule-tooling-and-pilot"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "voice rule tooling and pilot acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/001-voice-rule-tooling-and-pilot"
    last_updated_at: "2026-11-15T06:37:28Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-voice-rule-tooling-and-pilot"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: voice-rule-tooling-and-pilot

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `001-voice-rule-tooling-and-pilot`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the amended rule, When a voice pass targets a released changelog, Then it may edit it only when a spec packet records the operator's approval | `rg -n 'operator-approved retrofit' .skilled/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md .skilled/skills/sk-doc/sk-create-with-human-voice/SKILL.md` prints one line in each file Evidence: `SKILL.md:109` and `scope-and-exemptions.md:81` each print one line. | Met | - |
| AC-002 | REQ-002 | Given the rewrite brief, When an executor reads it, Then the fact rules come before every style rule and allow added sentences | `rg -n 'keep every fact' ../scratch/brief-rewrite.md` prints a line above the first style rule Evidence: `brief-rewrite.md:12` holds it, above STYLE RULES, and the brief lets a paragraph split. | Met | - |
| AC-003 | REQ-003 | Given a pilot file, When its rewrite fails a gate three times, Then the driver restores it byte for byte | `git diff --quiet HEAD -- <file>` exits 0 for every row marked restored in `../scratch/state.jsonl` Evidence: No pilot file was restored. A forced run with a worker returning a broken file ended `restored 3`, and `git diff --quiet HEAD` exited 0. | Met | - |
| AC-004 | REQ-004 | Given the 20 pilot files, When the kept rewrites are measured, Then sentences average 10 words or less and none runs past 22 | `measure-voice.py` on the kept files prints `avg_words` of 10 or less and `sentences_over_22=0` Evidence: `avg_words=9.0`, `sentences_over_22=0`. | Met | - |
| AC-005 | REQ-004 | Given the kept pilot rewrites, When the fact check and the operator read them, Then nothing is dropped, added or changed | Fact-check rows in `../scratch/state.jsonl` list no finding, and `implementation-summary.md` quotes the operator's approval Evidence: Each pilot row's last fact check passed with no finding. The operator answered "Approve (Recommended)", then "Approve final pilot (Recommended)" for the final state after the review fixes and 4 reruns. | Met | - |
| AC-006 | REQ-005 | Given the 55 files with a hard blocker, When they are classified, Then each one is a fix or a recorded self-reference | `../scratch/hard-blockers.md` lists 55 rows, each with a class Evidence: 55 rows: 54 fix, 1 self-reference. | Met | - |
| AC-007 | REQ-006 | Given the pilot run, When its state rows are summed, Then input and output tokens are reported beside the parent estimate | `implementation-summary.md` names both sums and the projected total Evidence: 1,023,037 tokens, 80.4M projected, against the 600M mid estimate. | Met | - |
| AC-008 | REQ-007 | Given the phase lists, When they are counted, Then they cover the scope list exactly | `cat ../scratch/lists/0*.txt \| wc -l` prints 1571 with no duplicate line Evidence: 1571, no duplicate, after the two templates were dropped. | Met | - |
| AC-009 | REQ-008 | Given a pilot rewrite, When its `export.json` is read, Then it shows `exit_code` 0, `outcome` `finished` and `thinking` `high`, and the repository config still pins `max` | `state.jsonl` rows carry `thinking` `high`, and `rg -c 'thinking = "max"' .vibe/config.toml` prints 2 Evidence: 20 rows `thinking` `high` with `0/finished`, and 2 `max` rows remain. | Met | - |
| AC-010 | REQ-009 | Given a pilot fact check, When the driver runs it, Then it calls `gpt-6-luna` at `xhigh` on the `fast` tier with no write access | The driver's dispatch line in `state.jsonl` names `gpt-6-luna`, `xhigh`, `fast` and `--sandbox read-only` Evidence: Pilot rows predate the `verifier` field, so the evidence is driver lines 337 to 342. Later rows carry `verifier` with the four values. | Met | - |

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

Every criterion is unmet, because the phase has not started.
<!-- /ANCHOR:closure -->
