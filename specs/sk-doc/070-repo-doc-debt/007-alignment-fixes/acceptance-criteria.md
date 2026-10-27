---
title: "Acceptance Criteria: doc checker accuracy and README debt fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/007-alignment-fixes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "lane-l5"
    recent_action: "Recorded evidence for every criterion"
    next_safe_action: "None; criteria are met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-l5-doc-checker-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: doc checker accuracy and README debt fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/070-repo-doc-debt/007-alignment-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the HEAD scripts, When the new tests run, Then each checker change's test fails; on the new scripts all pass | 9 of 15 failed before (exit 1); 15 passed after (exit 0); the flowchart test exits 1 before and 0 after | Met | - |
| AC-002 | REQ-001 | Given the final tree, When `run-script-tests.sh` runs, Then every test passes | 42 of 42 suite files pass, `all sk-doc script tests passed`, exit 0 with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false` | Met | - |
| AC-003 | REQ-002 | Given every tracked non-spec `.md` file, When `validate_document.py` runs, Then exit-1 files fall and none goes from 0 to 1 | 4,075 to 2,900; 1,164 companions and 11 fixture files move from 1 to 0; no 0 to 1 change | Met | - |
| AC-004 | REQ-002 | Given every tracked README, When the reference checker runs, Then unresolved hits fall and a removed sample is false positives | 5,760 to 9; removed hits are slash commands, names that exist elsewhere, import specifiers, home or absolute paths, build outputs and prose, plus corrected README debt; the 9 left are a negative fixture, legacy-layout mentions and an on-demand folder. Merged with main's release, the repo-wide total is 1,069 lines in 326 of 979 READMEs, against 1,567 in 356 for main's checker on the same tree | Met | - |
| AC-005 | REQ-002 | Given every tracked README, When the count checker runs, Then failing claims fall and a removed sample is prose | 801 to 76; every sampled removal is prose, the stale `.claude/hooks/` and md-generator counts are corrected, and sampled remaining hits are true on disk. Merged with main's release, the repo-wide total is 83 lines in 55 of 979 READMEs, against 110 in 72 for main's checker on the same tree | Met | - |
| AC-006 | REQ-003 | Given the two READMEs, When read, Then no spec folder is cited and the label matches its link | the new link resolves; label reads `../sk-code-skilled/assets/checklists/` | Met | - |
| AC-007 | REQ-004 | Given the restored checks, When each reported reference and count is read against disk, Then it is corrected or classified | a stale `gone.py` table row and a `+-- gone.sh` tree line fail in `test_stale_inventory_rows_and_tree_lines_fail`; the listed READMEs are corrected; remaining hits are classified in the implementation summary | Met | - |
| AC-008 | REQ-002 | Given the checkers merged with main's false-positive release, When both run over every tracked README, Then no README fails that main's checker passes and the root README passes both | the failing-README set of each merged checker is a subset of main's; root README `references=266 unresolved=0 allowed=7` and `claims=1 failures=0`; both self-tests and the 27 checker tests pass | Met | - |

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

Every criterion is met. The script suite passes with fsmonitor off, and the merged checkers fail no README that main's checker passes. The hits that remain are a negative fixture, accurate legacy-layout mentions and count claims the checker cannot prove from a folder listing, classified in the implementation summary.
<!-- /ANCHOR:closure -->
