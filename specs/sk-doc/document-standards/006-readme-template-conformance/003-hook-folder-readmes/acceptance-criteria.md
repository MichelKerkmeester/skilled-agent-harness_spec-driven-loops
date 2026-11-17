---
title: "Acceptance Criteria: Phase 3: hook-folder-readmes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hook folder readmes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes"
    last_updated_at: "2026-11-16T15:20:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hook-folder-readmes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: hook-folder-readmes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/document-standards/006-readme-template-conformance/003-hook-folder-readmes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 26 READMEs, When `h2model.py` and a read of the opening run on each, Then an H1 naming the concern comes first, every H2 is numbered, ALL CAPS, named in the folder scaffold's section model and preceded by `---`, and RUNTIME COVERAGE has a row for each of the eight runtimes | `h2model.py` printed `SUBSET` and `rtcheck.py` printed `OK` for all 25 files, and each opens with an H1 | Met | - |
| AC-002 | REQ-002 | Given the 26 files, When `validate_document.py` runs on each, Then each prints `VALID` | `baseline-003-after.tsv`: 25 of 25 `✅ VALID` | Met | - |
| AC-003 | REQ-003 | Given the 26 files, When `hvr_scan.py` runs on each, Then each reports `hard blockers: 0` | `baseline-003-after.tsv`: `hard=0` on all 25 lines | Met | - |
| AC-004 | REQ-004 | Given the 26 files, When the link checker runs over them, Then it reports 0 problems for outbound links and for anchored links into them from the rest of the repository | `readme_links.py` printed `0 problems` over 185 outbound links | Met | - |
| AC-005 | REQ-005 | Given a rewritten README, When a session that did not write it checks each path, command, count and list against the hook folder, its adapters and the files that register them, Then every claim holds or was corrected | Review Record in `implementation-summary.md`, one line per README | Met | - |
| AC-006 | REQ-006 | Given the rewritten READMEs and the rebuilt verdict baseline, When goal-doc-contract.test.cjs, completion-evidence-sentinel.vitest.ts, advisor-runtime-list-parity.vitest.ts, git-setup-check.test.cjs, the verdict parity test and the sk-doc suite run, Then all pass | Consumer passes, `PARITY PASS` and the sk-doc suite at exit 0, listed in `implementation-summary.md` | Met | - |
| AC-007 | REQ-007 | Given a command block in a README, When a reader looks below it, Then the expected output or result is stated | Every command block is followed by its expected result, checked by script over all 25 | Met | - |
| AC-008 | REQ-008 | Given the baseline ceilings, When the voice scan runs after the rewrite, Then no README's mechanical ceiling is lower than its baseline | Before and after ceilings in `implementation-summary.md`. None ends below its baseline | Met | - |
| AC-009 | REQ-009 | Given the phase is done, When `implementation-summary.md` is read, Then it holds the before and after validator, voice and link results for all 26 files | `implementation-summary.md` Verification section | Met | - |

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

**Closeable:** Yes

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
