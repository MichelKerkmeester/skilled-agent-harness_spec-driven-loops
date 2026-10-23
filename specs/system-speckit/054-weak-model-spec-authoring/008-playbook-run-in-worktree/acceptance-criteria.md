---
title: "Acceptance Criteria: Phase 8: playbook-run-in-worktree"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook run in worktree acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree"
    last_updated_at: "2026-10-23T13:45:00Z"
    last_updated_by: "scaffold"
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
# Acceptance Criteria: Phase 8: playbook-run-in-worktree

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree
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
| AC-001 | REQ-001 | Given `BASE_REF`, When T005 and T006 have run, Then the worktree exists on its numbered branch, provisioning ends with `0 failed` and no `FOREIGN` line appears | `grep -c '^FOREIGN ' scratch/worktree/own-code.txt` prints nothing and `test -f "$WT/.skilled/skills/system-spec-kit/runtime/dist/lib/validation/orchestrator.js"` prints `ORCH_OK` | Unmet | - |
| AC-002 | REQ-002 | Given the playbook index, When T004 runs, Then `scratch/scenarios.tsv` holds exactly eight unique labels and every file exists | `wc -l < scratch/scenarios.tsv` prints `8` and `awk -F'\t' 'NF != 6' scratch/scenarios.tsv` prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given the eight scenarios, When T009 and T010 have run, Then every scenario has a non-empty run file and one verdict row | `find scratch/runs -name '*.txt' \| wc -l` prints at least `8` and `rg -c '^S[1-8]\t(PASS\|FAIL\|FIXED\|ESCALATED\|SCENARIO_DEFECT)\t' scratch/results.tsv` prints `8` | Unmet | - |
| AC-004 | REQ-004 | Given the verdict rows, When T013 has run, Then the report holds `README.md`, `results.csv`, `source.md` and eight outcome files, and `README.md` has ten numbered sections | `find <report> -maxdepth 1 -type f \| wc -l` prints `3`, `find <report>/outcomes -name '*.json' \| wc -l` prints `8` and `rg -c '^## [0-9]+\. ' <report>/README.md` prints `10` | Unmet | - |
| AC-005 | REQ-005 | Given the phase has run, When T015 has run, Then the primary checkout shows no path outside this phase folder, the report folder and the one index row | `grep -c '^PRIMARY_CLEAN$' scratch/primary-status.txt` prints `1` | Unmet | - |
| AC-006 | REQ-006 | Given the report is written, When T016 has run, Then the removal gate printed `REMOVAL_OK`, the directory is gone and the branch is gone | `grep -c '^REMOVAL_OK$' scratch/worktree/removal.txt` prints `1`, `grep -c '^WORKTREE_GONE$' scratch/worktree/removal.txt` prints `1` and `grep -c '^BRANCH_GONE$' scratch/worktree/removal.txt` prints `1` | Unmet | - |
| AC-007 | REQ-007 | Given the report and the runs, When T017 and T018 have run, Then every finding is applied or recorded with a reason | `test -s scratch/review/T017.txt` passes and `grep -cvE '^(P0\|P1\|P2) \|^NO FINDINGS$' scratch/review/T017.txt` prints `0`, and the T018 counts match | Unmet | - |
| AC-008 | REQ-008 | Given a failed scenario, When the fix loop runs, Then it makes at most three fix briefs, each with one ALLOWED WRITE PATH, and leaves an `ESCALATED` row after the third failure | `find scratch/fix -name '<label>-*.txt' \| wc -l` prints `3` or less and every brief holds one path | Unmet | - |
| AC-009 | REQ-009 | Given a fix changed a file inside the worktree, When T016 has run, Then the worktree diff and status are saved under `scratch/fixes/` and every changed path in the status file appears in the patch | `grep -c '^PATCH_GATE_COVERED$' scratch/fixes/gate.txt` prints `1` and `grep -c '^UNPATCHED ' scratch/fixes/gate.txt` prints `0` | Unmet | - |

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
