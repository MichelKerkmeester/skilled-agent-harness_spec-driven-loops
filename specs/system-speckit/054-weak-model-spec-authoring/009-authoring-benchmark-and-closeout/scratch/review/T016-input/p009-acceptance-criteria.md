---
title: "Acceptance Criteria: Phase 9: authoring-benchmark-and-closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "authoring benchmark and closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout"
    last_updated_at: "2026-10-25T09:10:15Z"
    last_updated_by: "worker"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: authoring-benchmark-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout
**Level:** 3
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh Level 2 scaffold on the final tree, When T004 has run, Then `hints-v2.3.txt` holds every distinct value token and `anchors-v2.3.txt` holds four anchor counts, and the track is gone | `wc -l < scratch/baseline/hints-v2.3.txt` is above 50, `wc -l < scratch/baseline/anchors-v2.3.txt` prints `4`, and `test ! -e specs/zz-bench-hints` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given three final runs, When T006 has run after the third, Then `baseline.json` holds three runs, each with its run number and five metrics | `jq '.runs \| length' scratch/baseline/baseline.json` prints `3` and `jq '.runs[] \| keys \| length'` prints `6` three times | Unmet | - |
| AC-003 | REQ-003 | Given the v2.3 token form, When the final side is measured, Then M2 counts bare v2.2 hints plus value tokens, the rule is an accepted ADR, and the command is the one in T006 | `rg -c 'ADR-001' plan.md` is at least `1`, `rg -c 'M2 is the sum of two occurrence counts' plan.md` is at least `1`, and the M2 value in `baseline.json` is an integer | Unmet | - |
| AC-004 | REQ-004 | Given both `baseline.json` files, When T007 has run, Then `delta.md` holds the minimum, the maximum and the mean per metric per side and the no-significance sentence | `jq '.metrics \| length' scratch/baseline/delta.json` prints `5`, `grep -cE '^\| (strict_passed\|leftover_hints\|missing_anchors\|out_of_scope_writes\|seconds) \|' scratch/baseline/delta.md` prints `5`, and `grep -c 'cannot support a significance claim' scratch/baseline/delta.md` prints `1` | Unmet | - |
| AC-005 | REQ-005 | Given `delta.json`, When T008 has run, Then the report folder follows the grammar, `README.md` holds ten sections, `results.csv` holds six rows and the index gains one row | The T008 verify prints `6`, `10`, `1` and `NAME_OK` | Unmet | - |
| AC-006 | REQ-006 | Given the packet is closed, When recursive strict validation runs, Then the last `RESULT:` line reads `PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict \| grep 'RESULT:' \| tail -1` prints `RESULT: PASSED` | Unmet | - |
| AC-007 | REQ-007 | Given the packet is closed, When T009 and T011 have run, Then the global entry and the two nested files exist and pass their checks | `ls` lists the three paths, `validate_document.py` prints `Total issues: 0` for each, and `hvr_scan.py` prints `hard blockers: 0` for the global entry | Unmet | - |
| AC-008 | REQ-008 | Given the published docs, When T012 has run, Then the generator check exits 0 and only the four index artifacts changed in that step | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0 and the T012 diff line prints `0` | Unmet | - |
| AC-009 | REQ-009 | Given the packet folders on disk, When T013 has run, Then the dry rerun reports up to date and the stored children equal the disk children | `system-speckit: up to date` with exit 0, and `cmp` prints `CHILDREN_MATCH` | Unmet | - |
| AC-010 | REQ-010 | Given the closed packet, When T014 has run, Then the parent and nine child goals pass, the parent map holds nine `Complete` rows and the 041 row reads `Complete` | Ten `RESULT: PASSED (5/5 checks)` lines, the map counts `9` and `0`, and `rg -c '006-fix-write-recipe-move-destination.*Complete'` prints `1` | Unmet | - |
| AC-011 | REQ-011 | Given the seven parent criteria, When T015 has run, Then `criteria.txt` holds seven PASS lines and T017 ticked seven boxes | `grep -c '^C[1-7] PASS ' scratch/closeout/criteria.txt` prints `7` and the completion anchor holds seven `[x]` rows | Unmet | - |
| AC-012 | REQ-012 | Given the phase start status, When T017 compares it with the final status, Then only this phase folder and the paths in `spec.md` section 3 differ | The status delta names no path outside the declared list | Unmet | - |
| AC-013 | REQ-013 | Given the closeout diff, When T016 returns, Then each finding is applied or recorded with a reason | `scratch/review/T016.txt` exists and `T016_COUNTS_MATCH` prints | Unmet | - |
| AC-014 | REQ-014 | Given the closed summary, When T010 has run, Then the operator handoff block names the push as the operator's step and states that the phase made one local commit and pushed nothing | `grep -c 'Operator handoff' implementation-summary.md` prints `1` and `grep -c 'one local commit' implementation-summary.md` prints `1` | Unmet | - |
| AC-015 | REQ-015 | Given the closed packet, When T010 and T017 have run, Then spec, acceptance rows, continuity, goal and summary claim one state | `rg -c '\| Met \| - \|' acceptance-criteria.md` prints `15`, every completed document reads `Complete`, and `completion_pct` reads `100` | Unmet | - |

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

**Closeable:** No

The phase has not started. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
