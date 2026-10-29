---
title: "Acceptance Criteria: Phase 2: remaining-references"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "remaining references acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/074-reference-template-debt/002-remaining-references"
    last_updated_at: "2026-10-29T23:59:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Marked AC-009 and AC-010 Met after the format-spec exemption landed"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-277-reference-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: remaining-references

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/074-reference-template-debt/002-remaining-references
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 22 fixable references, When `validate_document.py` runs on each, Then every one prints `Total issues: 0` | `validate-all.py` over the 33 changed docs lists 33 OK rows with 0 issues, and the 22 references had 22 issues before | Met | - |
| AC-002 | REQ-001 | Given all 454 tracked references, When the validator reruns, Then no file that passed before fails now | before 389 OK, 61 FAIL, 4 SKIPPED, after the fixes 445 OK, 5 FAIL, 4 SKIPPED, and after the exemption 445 OK, 0 FAIL, 9 SKIPPED, with 0 files that were OK and are not OK now | Met | - |
| AC-003 | REQ-002 | Given every moved citation, When the old target heading is compared with the new one read from the new text, Then the two have the same words | `apply-2/summary.txt` reads `files=33 rows=36 mismatches=0 left_alone=16` | Met | - |
| AC-004 | REQ-002 | Given the changed docs, When every reference inside them is rescanned, Then none points at a missing section, and no anchor link into a renumbered doc exists | `verify-2` reads `checked=3 dangling=0`, and `rg` for `<doc>.md#` finds 0 while the same search finds the known `ROUTER.md#3-machine-router` links | Met | - |
| AC-005 | REQ-001 | Given each changed doc and its HEAD version, When the allowed edits are removed from both, Then no line differs | `preserved` reads `files=33 differing=0` | Met | - |
| AC-006 | REQ-003 | Given the hub set, When the leaf replay runs before and after, Then the totals line and the report are unchanged | `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` both times and `cmp` prints nothing | Met | - |
| AC-007 | REQ-004 | Given the 12 touched skills, When the package checks run, Then each passes | `package_skill.py --check --strict` prints `Result: PASS` 12 times, `parent-skill-check.cjs` on sk-design prints `OK`, every `generate-leaf-manifest.cjs --check` reports no stale manifest and the Hermes check prints `PASS: 65 Hermes skill copies in sync` | Met | - |
| AC-008 | REQ-005 | Given the 12 newest changelog entries, When each is validated, Then each gained one bullet and prints `Total issues: 0` | `validate-changelogs.tsv` lists 12 OK rows with 0 issues | Met | - |
| AC-009 | REQ-006 | Given the four sample `DESIGN.md` files, When the failing list is read, Then they are either fixed or exempted with a recorded reason | ADR-001 Accepted: `FORMAT_SPEC_FILES` in `validate_document.py` lists their exact path suffixes. The four report SKIPPED with the reason `Format spec: its section numbers are the DESIGN.md format's ids`, the four `writing-notes.md` siblings report 0 issues and are not skipped, and `pytest -q` over `test_format_spec_exclusion.py` and `test_instruction_file_exclusion.py` printed `4 passed` | Met | - |
| AC-010 | REQ-006 | Given `design-md-format.md`, When the failing list is read, Then it is either fixed or exempted with a recorded reason | ADR-002 Accepted: its exact suffix is in the same list and it reports SKIPPED. The sweep over all 454 references reads 445 OK, 0 FAIL, 9 SKIPPED, and only the five named rows changed (FAIL to SKIPPED) | Met | - |

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

All ten criteria are met. ADR-001 and ADR-002 are Accepted and implemented as one exact-suffix list in `validate_document.py` with its own test, so no tracked reference fails the validator.
<!-- /ANCHOR:closure -->
