---
title: "Acceptance Criteria: Phase 6: fix-write-recipe-move-destination"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fix write recipe move destination acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination"
    last_updated_at: "2026-10-23T13:49:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-write-recipe-fixes-006-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: fix-write-recipe-move-destination

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/041-write-recipe-fixes/006-fix-write-recipe-move-destination
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the start commit, When T004 has run, Then the recipe holds no `  <spec-folder>` line and holds `  specs/system-speckit/078-opencode-authoring-recipe` | `grep -cF -- '  <spec-folder>' "$RECIPE"` prints `0` and `grep -cF -- '  specs/system-speckit/078-opencode-authoring-recipe' "$RECIPE"` prints `1. Observed: `0` and `1` after T004 | Met | - |
| AC-002 | REQ-002 | Given T004 has run, When the Step 2 block is read, Then one sentence after the closing fence says the track is an example and the reader substitutes the track they selected | `grep -cF -- 'track in the destination above is an example' "$RECIPE"` prints `1`, and `sed -n '46,58p' "$RECIPE"` shows it after the fenc. Observed: `1`, and the sentence sits after the closing fence of Step 2 | Met | - |
| AC-003 | REQ-003 | Given the 054 ledger, When T005 and T007 have run, Then every owner `041-006` row is `APPLIED` or `SKIP-GONE` and no such row's evidence reproduces | `grep -c '^BLOCKED ' scratch/census.txt` prints `0` and `grep -c '^YES ' scratch/recheck.txt` prints `0. Observed: `0` and `0`. `census.txt` holds `SKIP-GONE L-C-024` | Met | - |
| AC-004 | REQ-004 | Given the phase is closing, When `git diff --name-only` is compared with the start commit, Then the only path outside this folder is the recipe file | `wc -l < scratch/changed-files.txt` prints `1` and `grep -c '^\.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe\.md$' scratch/changed-files.txt` prints `1. Observed: `1` and `1` | Met | - |
| AC-005 | REQ-005 | Given the suite end run, When T008 compares it with the 054 phase 001 start summary, Then the three compared lines are identical | T008 prints `SUITE_MATCH`, or `REF-SUBSTITUTED` is recorded in `goal.md` section 4 when the 054 file is absen. Observed: T008 printed `SUITE_MATCH` | Met | - |
| AC-006 | REQ-006 | Given the review reply, When T009 returns, Then each finding is applied or recorded with a reason | `grep -cvE '^(P[012]) \|^NO FINDINGS$' scratch/review/T009.txt` prints `0` and the T010 count in `goal.md` section 4 equals the number of finding. Observed: `0`. The reply is `NO FINDINGS`, so the T010 count is 0 | Met | - |

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

The phase closed with all six rows Met on evidence observed on the final tree.
<!-- /ANCHOR:closure -->
