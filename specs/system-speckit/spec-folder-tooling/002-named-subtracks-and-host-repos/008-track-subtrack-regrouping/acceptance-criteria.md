---
title: "Acceptance Criteria: Phase 8: track-subtrack-regrouping"
description: "Closure criteria for moving 174 active packets into 39 named subtracks across ten Skilled tracks, with aligned packet metadata and passing validation gates."
trigger_phrases:
  - "track subtrack regrouping acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping"
    last_updated_at: "2026-11-10T06:31:28Z"
    last_updated_by: "codex"
    recent_action: "Met every criterion with track and metadata evidence"
    next_safe_action: "Review the closed phase record"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-track-subtrack-regrouping"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: track-subtrack-regrouping

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the ten approved maps, When the 174 active packets are regrouped, Then each appears once under its mapped subtrack with its slug preserved. The pinned packets and `z_archive/` stay in place, and the seven smaller tracks remain flat. | Evidence: `tasks.md:49`, `tasks.md:50`, `tasks.md:51`, `tasks.md:52`, `tasks.md:53`, `tasks.md:54`, `tasks.md:55`, `tasks.md:56`, `tasks.md:57`, `tasks.md:58`, `tasks.md:136`, `tasks.md:191`. The ten track commits recorded the mapped changes. The final map audit found 39 subtracks and numbering from 001 with no gaps. The two pinned packets remained flat. | Met | - |
| AC-002 | REQ-002 | Given the 39 approved subtracks, When their descriptors and track-root metadata are updated, Then each `description.json` has `level` set to `sub-track` and each track sweep prints `all track roots match their declared children`. | Evidence: `tasks.md:137` and `tasks.md:138`. All ten strict validations passed with 224 passed and 0 failed. | Met | - |
| AC-003 | REQ-003 | Given moved packet paths, When live tracked locators are rewritten and historical event records are preserved, Then the markdown link checker reports 0 broken links. | Evidence: `tasks.md:150` and `tasks.md:180`. Each track link check printed `0 broken markdown links`. Commit `e7ed23d545` restored 18 benchmark-report and baseline files to their recorded content. Older commit trailers retain their old paths. Commit `82d616acc5` repaired the five broken links by rewriting only link targets in three report sources. | Met | - |
| AC-004 | REQ-004 | Given a processed track, When its three required gates run before its one commit, Then all three pass. The sweep prints `all track roots match their declared children`, strict validation has no more failed folders than the track baseline, and the link check reports 0 broken links. | Evidence: `tasks.md:148`, `tasks.md:149` and `tasks.md:150`. All ten sweeps printed the required line. Strict validation totaled 224 passed and 0 failed. Link checks printed `0 broken markdown links`. | Met | - |
| AC-005 | REQ-005 | Given all ten track changes, When the trigger-index generator runs after them, Then the generated trigger index is rebuilt. | Evidence: `tasks.md:77` and `tasks.md:151`. `generate-trigger-index.mjs` exited 0 in commit `eb512ee196` and ran again in merge `26edf50b63`. | Met | - |
| AC-006 | REQ-006 | Given a packet moved into a subtrack, When its folder number and JSON metadata are checked, Then its number, `specId`, `parentChain`, `packet_id`, `spec_folder`, `parent_id` and `children_ids` match its folder and actual ancestors. | Evidence: `tasks.md:152`. 0 of 311 flat-track and 0 of 2521 regrouped `description.json` files were out of line. All 2521 `graph-metadata.json` files matched their folders. The subtrack numbering starts at 001 with no gaps. | Met | - |

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

Every criterion is Met with evidence recorded in `tasks.md`, and nothing was waived.
<!-- /ANCHOR:closure -->
