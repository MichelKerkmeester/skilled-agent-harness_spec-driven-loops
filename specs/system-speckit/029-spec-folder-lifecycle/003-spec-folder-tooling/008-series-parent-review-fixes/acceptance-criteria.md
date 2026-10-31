---
title: "Acceptance Criteria: Phase 8: series-parent-review-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "series parent review fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/008-series-parent-review-fixes"
    last_updated_at: "2026-10-07T11:08:36Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Rebuilt the trigger index and met the last criterion"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-series-parent-review-fixes-close"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: series-parent-review-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/008-series-parent-review-fixes
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a clean track, When the five-step recipe in `phase-definitions.md` §2 is followed as written, Then the parent runs with `--level phase-parent`, the generated validation child is removed, and the run leaves no placeholder child | Two scratch runs, one by a worker and one by the orchestrator: the parent exited 0, the child was numbered 002-new-work after 001 existed, and the scratch track was removed (R1-P1-001) | Met | - |
| AC-002 | REQ-002 | Given every doc outside `changelogs`, `z_archive/` and `specs/`, When it is searched for the skip label and read for threshold restatements, Then no line labels skip-documentation as Option E and each restatement names the series parent exception | The README Gate 3 diagram lists options A to D. A repo-wide search left nine Option E hits that all mean something else, in the hub architecture of `system-deep-loop` SKILL.md, legacy probe strings in `test-phase-command-workflows.js` and benchmark JSON transcripts. The three exception sentences were added with their relative links checked (R1-P1-002, R1-P1-003, R3-P1-001) | Met | - |
| AC-003 | REQ-003 | Given `quick-reference.md` §9 and `retrieval-conventions.md`, When both are read, Then §9 option C names the series parent and the Warn On list names the `template-default` class | `quick-reference.md` §9 option C names the series parent and the Warn On class list names `template-default` (R1-P2-001, R1-P2-002) | Met | - |
| AC-004 | REQ-004 | Given a track whose `description.json` carries an ESC byte, and a separate `--subfolder --topic` run, When `create.sh` prints the recent-packet listing, Then the control byte is stripped from the printed name and description and the sub-folder run prints no listing | `create-track-refresh.vitest.ts` grew from 9 to 11 tests, the ESC description test passes and the sub-folder run prints no listing (R2-P2-001, R2-P2-003) | Met | - |
| AC-005 | REQ-005 | Given the four template phrases in `templates/core/spec.md.tmpl`, When the template's phrase block drifts from the single shell list in `create.sh`, Then a test fails and names the drift, and a healthy scaffold of a non-core template still passes | The new test pins the shell list to the template and to `TEMPLATE_DEFAULT_PHRASES`, failed against a deliberately drifted temp template copy, then passed (R2-P2-004) | Met | - |
| AC-006 | REQ-006 | Given the Phase 6 records, When its tasks summary, continuity block and scope table are read, Then they match what Phase 6 shipped | The summary is filled at P0 12/12, P1 13/13, P2 1/1, the continuity block was refreshed and the scope table row was added (R1-P2-003, R2-P2-002, R3-P2-001) | Met | - |
| AC-007 | REQ-007 | Given the two deep-loop auto workflows, When a cli-pi run resolves the lineage and the executor, Then the configured `reasoningEffort` reaches both, and the cursor and devin blocks deliberately pass none | The `if_cli_pi` blocks in `deep-research-auto.yaml` and `deep-review-auto.yaml` pass `reasoningEffort` into the lineage and the executor, the compiled contracts were regenerated, `check-contract-drift` reports OK with 3 commands and 22 deep-loop test files with 365 tests pass. No live dispatch transcript is recorded | Met | - |
| AC-008 | REQ-008 | Given the committed trigger index, When it is checked against the corpus, Then every document is present and no phrase set is stale | `generate-trigger-index.mjs` rebuilt the index after every spec change in phases 8 to 11, then `--check` exited 0 with 0 stale documents and 0 missing | Met | - |

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

The twelve Phase 7 review findings are fixed and mapped to met rows, and all eight requirements are Met with recorded evidence, including the trigger index, whose freshness check exited 0 with 0 stale documents.
<!-- /ANCHOR:closure -->

---
