---
title: "Acceptance Criteria: Phase 25: deprecate-nested-changelogs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deprecate nested changelogs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/025-deprecate-nested-changelogs"
    last_updated_at: "2026-10-27T12:15:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-025-deprecate-nested-changelogs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 25: deprecate-nested-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `025-deprecate-nested-changelogs`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two closing workflows, When `rg -n "nested-changelog\|nested changelog" .skilled/commands/speckit/assets/` runs, Then it prints nothing | `rg` over `.skilled/commands/speckit/` printed nothing, exit 1. Both YAMLs parse | Met | - |
| AC-002 | REQ-002 | Given a throwaway `create.sh --phase` scaffold, When its child `spec.md` is read, Then it has no `**Changelog**:` line | A throwaway `create.sh --track zz-scratch-025 --phase` child had 0 `Changelog` hits, then was removed | Met | - |
| AC-003 | REQ-003 | Given the create-changelog workflows, When `rg -n "nested-changelog.js" .skilled/commands/create/` runs, Then it prints nothing, and the `--nested` handling stops with a notice naming `.skilled/changelog/` | `rg -n "nested-changelog.js" .skilled/commands/create/` prints nothing. The router step 2 and the YAML step 1 refuse `--nested` with the `.skilled/changelog/` notice | Met | - |
| AC-004 | REQ-004 | Given `nested-changelog.vitest.ts`, When it runs, Then it passes and pins the deprecation notice on stderr | 12 passed. Each new test failed with its fix reverted. Full suite 2241 passed, 0 failed | Met | - |
| AC-005 | REQ-005 | Given the closing `rg` sweep over the two skills and `.skilled/commands`, When it runs, Then every hit is deprecation wording, a fixture or a versioned entry | The closing sweep leaves only deprecation wording, routing aliases, generated indexes, fixtures, versioned entries and skill-owned `changelog/` folders | Met | - |
| AC-006 | REQ-006 | Given the 64 packet changelogs, When the phase closes, Then the count still prints 64 and the diff touches none | `find ... \| wc -l` printed 64, and `git status` on those paths printed nothing | Met | - |

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

Every criterion is met with the evidence named in its row.
<!-- /ANCHOR:closure -->
