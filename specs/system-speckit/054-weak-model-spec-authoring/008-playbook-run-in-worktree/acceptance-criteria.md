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
    last_updated_by: "conductor"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `BASE_REF`, When T005 and T006 have run, Then the worktree exists on its numbered branch, provisioning ends with `0 failed` and no `FOREIGN` line appears | `grep -c '^FOREIGN ' scratch/worktree/own-code.txt` prints `0` and `test -f "$WT/.skilled/skills/system-spec-kit/runtime/dist/lib/validation/orchestrator.js"` prints `ORCH_OK`. Observed: `grep -c ^FOREIGN scratch/worktree/own-code.txt` printed `0`, five `OWN` lines, `exit=0`, `provisioned: 11 installed, 5 built, 3 already present, 0 failed`, and `ORCH_OK` (console copy in `scratch/worktree/t006-console.txt`, taken before the worktree was removed) (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/worktree/provision-exit.txt:1 and specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/worktree/own-code.txt:1) | Met | - |
| AC-002 | REQ-002 | Given the playbook index, When T004 runs, Then `scratch/scenarios.tsv` holds exactly eight unique labels and every file exists | `wc -l < scratch/scenarios.tsv` prints `8` and `awk -F'\t' 'NF != 6' scratch/scenarios.tsv` prints nothing Observed: `wc -l` printed `8` and the `NF != 6` awk printed nothing (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/scenarios.tsv:8) | Met | - |
| AC-003 | REQ-003 | Given the eight scenarios, When T009 and T010 have run, Then every scenario has a non-empty run file and one verdict row | `find scratch/runs -name '*.txt' \| wc -l` prints at least `8` and `rg -c '^S[1-8]\t(PASS\|FAIL\|FIXED\|ESCALATED\|SCENARIO_DEFECT)\t' scratch/results.tsv` prints `8`. Observed: the run directory holds 28 `.txt` files (eight run files plus sidecars) and the verdict regex printed `8` (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/results.tsv:8) | Met | - |
| AC-004 | REQ-004 | Given the verdict rows, When T013 has run, Then the report holds `README.md`, `results.csv`, `source.md` and eight outcome files, and `README.md` has ten numbered sections | `find <report> -maxdepth 1 -type f \| wc -l` prints `3`, `find <report>/outcomes -name '*.json' \| wc -l` prints `8` and `rg -c '^## [0-9]+\. ' <report>/README.md` prints `10`. Observed: the report folder holds `3` top-level files, `8` outcome files and `10` numbered sections (see .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--manual-testing-playbook--weak-model-authoring/results.csv:9) | Met | - |
| AC-005 | REQ-005 | Given the phase has run, When T015 has run, Then the primary checkout shows no path outside this phase folder, the report folder and the one index row | `grep -c '^PRIMARY_CLEAN$' scratch/primary-status.txt` prints `1`. Observed: `grep -c ^PRIMARY_CLEAN$` printed `1`; MAIN status was 341 lines before and 341 after with an empty diff (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/primary-status.txt:1) | Met | - |
| AC-006 | REQ-006 | Given the report is written, When T016 has run, Then the removal gate printed `REMOVAL_OK`, the directory is gone and the branch is gone | `grep -c '^REMOVAL_OK$' scratch/worktree/removal.txt` prints `1`, `grep -c '^WORKTREE_GONE$' scratch/worktree/removal.txt` prints `1` and `grep -c '^BRANCH_GONE$' scratch/worktree/removal.txt` prints `1`. Observed: `REMOVAL_OK`, `WORKTREE_GONE` and `BRANCH_GONE` each printed `1` (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/worktree/removal.txt:8) | Met | - |
| AC-007 | REQ-007 | Given the report and the runs, When T017 and T018 have run, Then every finding is applied or recorded with a reason | `test -s scratch/review/T017.txt` passes and `grep -cvE '^(P0\|P1\|P2) \|^NO FINDINGS$' scratch/review/T017.txt` prints `0`, and the T018 counts match Observed: `T017.txt` is non-empty, the non-finding line count printed `0`, and T018 printed `findings=3` and `unrecorded=0` (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/review/T017.txt:1) | Met | - |
| AC-008 | REQ-008 | Given a failed scenario, When the fix loop runs, Then it makes at most three fix briefs, each with one ALLOWED WRITE PATH, and leaves an `ESCALATED` row after the third failure | `find scratch/fix -name '<label>-*.txt' \| wc -l` prints `3` or less and every brief holds one path Observed: no scenario failed, so `scratch/fix/` holds `0` briefs, which is within the limit of 3 (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/results.tsv:1) | Met | - |
| AC-009 | REQ-009 | Given a fix changed a file inside the worktree, When T016 has run, Then untracked scratch output is cleared, the worktree diff and status are saved under `scratch/fixes/` and every changed path in the status file appears in the patch | `grep -c '^SCRATCH_CLEAN$' scratch/worktree/removal.txt` prints `1`, `grep -c '^PATCH_SAVED$' scratch/worktree/removal.txt` prints `1`, `grep -c '^STATUS_SAVED$' scratch/worktree/removal.txt` prints `1`, `grep -c '^PATCH_GATE_COVERED$' scratch/fixes/gate.txt` prints `1` and `grep -c '^UNPATCHED ' scratch/fixes/gate.txt` prints `0`. Observed: `SCRATCH_CLEAN`, `PATCH_SAVED` and `STATUS_SAVED` each printed `1` in `removal.txt`, `PATCH_GATE_COVERED` printed `1` and `UNPATCHED` printed `0` in `gate.txt` (see specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/worktree/removal.txt:1 and specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/scratch/fixes/gate.txt:2) | Met | - |

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

All nine rows are Met with observed evidence. The eight scenarios passed, the worktree and its branch are gone, the primary checkout is unchanged and the read-only review returned three P2 lines, all applied.
<!-- /ANCHOR:closure -->
