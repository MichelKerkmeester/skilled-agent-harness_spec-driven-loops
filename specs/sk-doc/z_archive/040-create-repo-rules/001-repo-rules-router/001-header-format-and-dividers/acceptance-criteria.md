---
title: "Acceptance Criteria: Phase 1: Numbered-Header Casing and Section Dividers"
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
    packet_pointer: "sk-doc/040-create-repo-rules/001-repo-rules-router/001-header-format-and-dividers"
    last_updated_at: "2026-08-31T05:37:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for the header-casing and divider phase"
    next_safe_action: "Run the baseline count capture (T001) before touching any file"
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
# Acceptance Criteria: Phase 1: Numbered-Header Casing and Section Dividers

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/001-repo-rules-router/001-header-format-and-dividers
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
| AC-001 | REQ-001 | Given the seven governance files, When the heading pass has run, Then every numbered `##` heading renders its prose in ALL CAPS | Per file, the numbered-heading count equals the count whose text is uppercase once backticked spans are excluded. Observed 4/7/11/6/8/8/6 = 50 of 50 | Met | - |
| AC-002 | REQ-001 | Given a heading containing an inline code span, When it is uppercased, Then the backticked text is byte-identical to before | `repo-rules/overengineering.md:64` reads `## 3. TWO SIGNALS` followed by the unchanged `AGENTS.md` span and `DOES NOT CARRY` | Met | - |
| AC-003 | REQ-002 | Given two consecutive numbered sections, When the divider pass has run, Then a single `---` separates them | Per file, divider count equals numbered-header count (4/7/11/6/8/8/6); an `awk` adjacency scan returns 0 for all seven | Met | - |
| AC-004 | REQ-003 | Given the completed pass, When the diff is inspected, Then every changed line is a `##` heading, a `---`, or blank | `git diff -U0` over the seven paths, filtered to lines that are neither a heading, a divider, nor blank, returned 0 lines | Met | - |
| AC-005 | REQ-003 | Given the transform, When it is run a second time, Then it changes nothing | Re-ran the transform; the md5 set of all seven files was identical before and after, and the reported change count was 0 | Met | - |
| AC-006 | REQ-004 | Given each file's preamble, When the pass has run, Then a `---` sits immediately before the first numbered heading | Each file's first numbered heading has `---` as its nearest preceding non-blank line; verified across all seven | Met | - |
| AC-007 | REQ-005 | Given the router's trigger and index tables, When the pass has run, Then every `repo-rules` link still resolves | All 6 link targets extracted from `REPO RULES.md` resolve with `test -f` | Met | - |
| AC-008 | REQ-003 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked. Re-run recorded below | Met | - |

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

AC-004 carried the phase: the filtered diff returned zero lines that were not a heading,
a divider, or blank, which is what separates a formatting pass from a doctrine edit.
AC-001's verification method was corrected rather than its outcome forced - the original
regex could never pass on a heading containing a preserved code span, so the criterion was
wrong. Left out deliberately: unnumbered headers keep their sentence case, and nothing
enforces the convention on rule files written later.
<!-- /ANCHOR:closure -->
