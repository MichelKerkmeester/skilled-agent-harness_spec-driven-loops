---
title: "Acceptance Criteria: Layout Probes for the Skilled Source-Root Move"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "skilled layout probe acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes"
    last_updated_at: "2026-09-16T18:17:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored one criterion per requirement, all Unmet"
    next_safe_action: "Run the probes in tasks.md order, then mark each criterion with its record"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-003-acceptance-criteria"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Layout Probes for the Skilled Source-Root Move

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/003-layout-probes
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
| AC-001 | REQ-001 | Given the seven runtimes at the versions recorded in `probes/probe-environment.md`, When units U1 to U7 return and the orchestrator checks them, Then every surface row reads `configurable`, `fixed name` or `UNKNOWN` and each of its citations is marked matched | Verification tables in `probes/runtime-root-configurability.md`, produced by T006 and T007 | Met | Waived: 6 of 243 U1 to U7 citations are struck (listed in the record); no verdict rests on a struck citation alone |
| AC-002 | REQ-002 | Given baseline, shape A and shape B link clones, When rows R1 to R13 run in those clones and rows R1 and R13 run in a shape B2 clone, Then each of the 41 runs records loaded, not loaded, blind or a named reason, and every shape result has a positive baseline behind it | Run table in `probes/runtime-symlink-resolution.md`, produced by T011 and T012 | Met | - |
| AC-003 | REQ-003 | Given a sandbox repository whose `pre-commit` and `pre-push` under `core.hooksPath` dangle, When a commit and a push run beside a non-executable control and a failing control, Then exit status, stderr and whether each commit and push landed are recorded | `probes/dangling-hook-behavior.md`, produced by T013 | Met | - |
| AC-004 | REQ-004 | Given shape A and shape B clones with staged edits under `.skilled/agents/` and `.skilled/skills/`, When `pre-commit` and `pre-push` run under `bash -x`, Then each of the 12 gates records its script check, filter match count and branch taken | 24-row table in `probes/gate-filters-under-linked-root.md`, produced by T009 | Met | - |
| AC-005 | REQ-005 | Given a full clone at the base SHA, When the r1 and r2 commits are measured, Then rename and deletion counts at three limits, both guard verdicts, both pre-push outcomes, five follow samples and the checkout over ignored files are recorded | `probes/rename-rehearsal.md`, produced by T014 | Met | - |
| AC-006 | REQ-006 | Given the home locations listed in plan.md P8, When the scan runs, Then every matching file appears with match counts and key paths, and no value appears in the record | `probes/home-state-enumeration.md`, produced by T003 | Met | Waived: the full 668-row table stays out of this public repository because it names private repositories and home files; the record carries every live file and aggregate counts for the rest |
| AC-007 | REQ-007 | Given worktree 055 and the main checkout, When the P9 lists are built and unit U10 classifies them, Then every entry under `.opencode/` or naming it carries a class and a producer citation or `UNKNOWN` | `probes/untracked-ignored-files.md`, produced by T017 and T018 | Met | - |
| AC-008 | REQ-008 | Given the T001 status captures and the T004 guard snapshot, When every probe has finished, Then both checkouts differ from their captures only by `probes/` and this folder's documents, and every guarded home file keeps its hash | Comparison section of `probes/probe-environment.md`, produced by T021 | Met | Waived: the main checkout also carries 22 lines from this session's operator-approved goal-send edits in 038/013, none from a probe |
| AC-009 | REQ-009 | Given a record written from a lane return, When it is reviewed, Then it holds the brief verbatim, the dispatch command, the exit status and one matched-or-struck row per returned citation | Verification sections of the four lane-produced records, produced by T007 and T019 | Met | - |
| AC-010 | REQ-010 | Given the nine probe records, When each is read to its end, Then it closes with one implication line each for shapes A, B and C | `rg -c '^- Shape [ABC]:' probes/*.md` reports 3 for every probe record, checked in T020 | Met | - |
| AC-011 | REQ-011 | Given the council-graph writer and a `/tmp` copy of the database, When unit U8 returns and the cell count runs, Then the rebuild command, its inputs and its path handling are cited, and path-bearing cells are counted per column | `probes/council-graph-rebuild.md`, produced by T015 and T019 | Met | - |
| AC-012 | REQ-012 | Given the 35 recorded-fixture rows from map C, When unit U9 returns, Then each fixture carries one assertion class and a test `path:line`, or is marked unread | 35-row table in `probes/fixture-path-assertions.md`, produced by T016 and T019 | Met | - |

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

No probe has run, so every criterion is Unmet. This statement is rewritten when the packet closes, naming the criteria that carried it and anything consciously left out.
<!-- /ANCHOR:closure -->
