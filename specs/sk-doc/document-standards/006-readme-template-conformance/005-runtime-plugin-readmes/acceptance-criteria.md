---
title: "Acceptance Criteria: Phase 5: runtime-plugin-readmes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "runtime plugin readmes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes"
    last_updated_at: "2026-11-16T15:20:17Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-runtime-plugin-readmes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: runtime-plugin-readmes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes
**Level:** 2
**Status:** Draft
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 8 READMEs, When `h2model.py` and a read of the opening run on each, Then the H1 names the runtime and its entries, and every H2 is numbered, ALL CAPS, named in the template's section model and preceded by `---` | `h2model.py` and a read of each opening, recorded per file in `implementation-summary.md` | Unmet | - |
| AC-002 | REQ-002 | Given the 8 files, When `validate_document.py` runs on each, Then each prints `VALID` | The after run of the baseline script, one `✅ VALID` per line | Unmet | - |
| AC-003 | REQ-003 | Given the 8 files, When `hvr_scan.py` runs on each, Then each reports `hard blockers: 0` | The after run of the baseline script, `hard=0` on all 8 lines | Unmet | - |
| AC-004 | REQ-004 | Given the 8 files, When the link checker runs over them, Then it reports 0 problems for outbound links and for anchored links into them from the rest of the repository | `readme_links.py` prints `0 problems` | Unmet | - |
| AC-005 | REQ-005 | Given a rewritten README, When a session that did not write it checks each path, command, count and list against the folder's entries, their real files and the runtime config that loads them, Then every claim holds or was corrected | The review record in `implementation-summary.md`, one line per README | Unmet | - |
| AC-006 | REQ-006 | Given the rewritten READMEs and the rebuilt verdict baseline, When goal-doc-contract.test.cjs, the verdict parity test and the sk-doc suite run, Then all pass | The commands and their pass lines in `implementation-summary.md` | Unmet | - |
| AC-007 | REQ-007 | Given a command block in a README, When a reader looks below it, Then the expected output or result is stated | Review of each README's code blocks, recorded with AC-005 | Unmet | - |
| AC-008 | REQ-008 | Given the baseline ceilings, When the voice scan runs after the rewrite, Then no README's mechanical ceiling is lower than its baseline | Before and after ceilings side by side in `implementation-summary.md` | Unmet | - |
| AC-009 | REQ-009 | Given the phase is done, When `implementation-summary.md` is read, Then it holds the before and after validator, voice and link results for all 8 files | `implementation-summary.md` Verification section | Unmet | - |

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

The rewrite has not started, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
