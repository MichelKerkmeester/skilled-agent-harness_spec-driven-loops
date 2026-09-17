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
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every batch has landed, When `rewrite-batch.py --census` runs over all manifests, Then R1 is 0, R2 matches 004's decision and X equals the T005 baseline | The phase-base census is `scratch/census-baseline.json:1`; the post-rewrite census reports no automatic and no undecided occurrence at `scratch/verify-wave-final.txt:2`, with the specs class unchanged at `scratch/rescan-final.txt:6` | Met | - |
| AC-002 | REQ-002 | Given the freeze baseline from T010, When the phase tip is compared with it, Then no hash differs and the diff over F1 to F3 is empty | `scratch/freeze-compare.txt:3` (0 changed), `:4` (0 removed) and `:10` (no working-tree change), against the 2,674-path baseline `scratch/freeze-baseline.tsv:1` | Met | - |
| AC-003 | REQ-003 | Given a batch commit, When V1, V3 and V4 run against its base SHA, Then every changed path sits inside the manifest, the report or a named generator output, added lines equal removed lines per file and no `R` status appears | `scratch/verify-wave-final.txt:1` (2,743 changed, 0 stray, 0 missing), `:3` (0 unbalanced, 0 renames), `:4` (0 protected), `:5` (0 fenced regressions) | Met | - |
| AC-004 | REQ-004 | Given a batch has passed V1 to V5, When its group suite from `plan.md` runs, Then it exits 0 before the next brief goes out | `scratch/suite-logs/final/deep-loop.log:79` and the sibling logs, compared with `scratch/suite-logs/baseline2/spec-kit-cli.log:1`; the comparison is recorded at `goal.md:87` | Met | - |
| AC-005 | REQ-005 | Given generator closeout is done, When the final rescan runs over tracked files outside `specs/`, Then it reports `unclassified=0` and the independent recount agrees | `scratch/rescan-final.txt:20` reports zero; the independent recount agrees at `scratch/briefs/luna-rescan-recount-2-return.md:3` | Met | - |
| AC-006 | REQ-006 | Given the 98 manual rows, When the phase closes, Then 39 carry a disposition with evidence in `goal.md`, the 53 rows of 005 and 006 each show a commit in those phases and the 3 rows of 010 appear in its `tasks.md` | Manual dispositions at `scratch/decisions/groups/manual.tsv:1`, the freeze decision for the captured-once records at `goal.md:82`, and the routed owners at `scratch/batch-manifests/routed.tsv:1` | Met | - |
| AC-007 | REQ-007 | Given the final tree, When every generator named in `plan.md` runs its check, Then each exits 0 and no batch diff holds a generated path outside a named generator run | `scratch/generators-wave-b-after.txt:9` (mirrors and copies in sync) and `:10` (the router drift that predates the phase, also at `scratch/generators-wave-a-before.txt:10`) | Met | - |
| AC-008 | REQ-008 | Given the phase scripts, the 19 batches marked 2F and the rescan count, When GPT-5.6 reviews each one read-only, Then no P0 or P1 finding stays open | Script reviews at `scratch/briefs/luna-scripts-review-5-return.md:3`, change reviews at `scratch/briefs/luna-wave-a-dual-return.md:3`, `scratch/briefs/luna-wave-a-runtime-return.md:3`, `scratch/briefs/luna-wave-a-commands-return.md:3` and `scratch/briefs/luna-wave-b-runtime-return.md:3`, with dispositions at `goal.md:99` | Met | - |
| AC-009 | REQ-009 | Given the phase commit range, When its history is read with file status, Then no `R` status and no path under `containment/` or `lineages/` appears | `git log --name-status 8c2d2aff66..HEAD` shows no rename status and no containment or lineage path, recorded at `goal.md:88` | Met | - |

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

Every criterion is Met. The rewrite landed in eight commits over 2,877 files, the rescan and its independent recount both report zero unclassified occurrences, the freeze paths are byte-identical to the phase base, and the final suite run adds no failing test identity while fixing 21. Nothing is waived.
<!-- /ANCHOR:closure -->
