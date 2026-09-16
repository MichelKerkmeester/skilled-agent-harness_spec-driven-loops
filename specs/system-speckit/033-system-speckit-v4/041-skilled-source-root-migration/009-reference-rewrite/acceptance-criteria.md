---
title: "Acceptance Criteria: Phase 9: reference-rewrite"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the acceptance criteria for the reference rewrite"
    next_safe_action: "Meet the criteria once phase 008 validates and setup tasks T001 to T010 pass"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-009-acceptance-criteria"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: reference-rewrite

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite
**Level:** 2
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every batch has landed, When `rewrite-batch.py --census` runs over all manifests, Then R1 is 0, R2 matches 004's decision and X equals the T005 baseline | `python3 scratch/rewrite-batch.py --census --all-manifests` output compared with `scratch/census-baseline.json` | Unmet | - |
| AC-002 | REQ-002 | Given the freeze baseline from T010, When the phase tip is compared with it, Then no hash differs and the diff over F1 to F3 is empty | `git ls-files -s` over the 968 freeze paths diffed against `scratch/freeze-baseline.tsv`, plus `git diff --name-only <base>..HEAD` limited to the F1 to F3 globs printing nothing | Unmet | - |
| AC-003 | REQ-003 | Given a batch commit, When V1, V3 and V4 run against its base SHA, Then every changed path sits inside the manifest, the report or a named generator output, added lines equal removed lines per file and no `R` status appears | `python3 scratch/rewrite-batch.py --verify --manifest scratch/batch-manifests/batch-NN.json` exits 0 for every batch, with `git diff --numstat` and `git diff --name-status` against the batch base | Unmet | - |
| AC-004 | REQ-004 | Given a batch has passed V1 to V5, When its group suite from `plan.md` runs, Then it exits 0 before the next brief goes out | Suite command, exit code and output tail in each `scratch/batch-reports/batch-NN-report.md`, plus the T042 full-suite run | Unmet | - |
| AC-005 | REQ-005 | Given generator closeout is done, When the final rescan runs over tracked files outside `specs/`, Then it reports `unclassified=0` and the independent recount agrees | `python3 scratch/rescan-references.py` output showing `unclassified=0` plus the T039 GPT-5.6 recount | Unmet | - |
| AC-006 | REQ-006 | Given the 98 manual rows, When the phase closes, Then 39 carry a disposition with evidence in `goal.md`, the 53 rows of 005 and 006 each show a commit in those phases and the 3 rows of 010 appear in its `tasks.md` | `goal.md` log, `git log --oneline -- <path>` for each 005 and 006 row plus `../010-machine-and-consumer-cutover/tasks.md` | Unmet | - |
| AC-007 | REQ-007 | Given the final tree, When every generator named in `plan.md` runs its check, Then each exits 0 and no batch diff holds a generated path outside a named generator run | Generator check exit codes recorded at T037 plus V4 in every batch report | Unmet | - |
| AC-008 | REQ-008 | Given the phase scripts, the 19 batches marked 2F and the rescan count, When GPT-5.6 reviews each one read-only, Then no P0 or P1 finding stays open | Review records attached to T004, to each 2F batch report and to T039 | Unmet | - |
| AC-009 | REQ-009 | Given the phase commit range, When its history is read with file status, Then no `R` status and no path under `containment/` or `lineages/` appears | `git log --name-status <base>..HEAD` output captured at T041 | Unmet | - |

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

Every criterion is Unmet because execution has not started: it waits on phases 003 to 008. Nothing has been waived.
<!-- /ANCHOR:closure -->
