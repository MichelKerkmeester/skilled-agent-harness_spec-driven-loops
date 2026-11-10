---
title: "Acceptance Criteria: Phase 8: track-subtrack-regrouping"
description: "Closure criteria for the approved regrouping of ten large Skilled tracks into 40 named subtracks, with per-track validation and link gates."
trigger_phrases:
  - "track subtrack regrouping acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-track-subtrack-regrouping"
    last_updated_at: "2026-11-10T05:05:28Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-track-subtrack-regrouping"
      parent_session_id: null
    completion_pct: 0
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

**Packet:** `system-speckit/044-named-subtracks-and-host-repos/008-track-subtrack-regrouping`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the ten approved maps, When movable active packets are regrouped, Then every assigned packet appears exactly once under its mapped subtrack with its slug preserved, while pinned packets, `z_archive/`, and the seven smaller tracks stay in place. | Planned check: compare `rg --files specs/<track>` with each approved map and inspect the pinned and archive paths. | Unmet | - |
| AC-002 | REQ-002 | Given the 40 approved subtracks, When their descriptors and track-root metadata are updated, Then each `description.json` has `level` set to `sub-track` and each track sweep prints `all track roots match`. | Planned check: inspect each new `description.json`, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs/<track>` for each qualifying track. | Unmet | - |
| AC-003 | REQ-003 | Given moved packet paths, When live tracked locators are rewritten and historical event records are preserved, Then the markdown link checker reports 0 broken links. | Planned check: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 0 broken links. Compare preserved changelogs, research and review iterations, `.jsonl` streams, `scratch/`, `evidence/`, and test fixtures with the scoped exclusions. | Unmet | - |
| AC-004 | REQ-004 | Given a processed track, When its three required gates run before its one commit, Then the sweep prints `all track roots match`, recursive strict validation has no more failed folders than the track baseline, and the link checker reports 0 broken links. | Planned checks: `node .skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs --specs specs/<track>`, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<track> --recursive --strict`, and `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`. | Unmet | - |
| AC-005 | REQ-005 | Given all ten track changes, When the trigger-index generator runs after them, Then the generated trigger index is rebuilt. | Planned check: run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` after all ten tracks and record the actual output. | Unmet | - |

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

**Closeable:** No

Every criterion remains Unmet while the regrouping is still in progress.
<!-- /ANCHOR:closure -->
