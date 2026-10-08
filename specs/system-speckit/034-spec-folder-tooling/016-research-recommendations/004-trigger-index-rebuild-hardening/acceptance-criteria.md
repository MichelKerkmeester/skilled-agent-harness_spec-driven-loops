---
title: "Acceptance Criteria: Phase 4: trigger-index-rebuild-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "trigger index rebuild hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-trigger-index-rebuild-hardening"
    last_updated_at: "2026-10-08T04:22:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: trigger-index-rebuild-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-002 | REQ-002 | Given the generator writes four files, When the workflow commits, Then all four files are staged and present in the tree | Run `git ls-tree HEAD` on the commit and verify `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, and `phrase-variants.json` are all present | Unmet | - |
| AC-003 | REQ-003 | Given a successful push scenario, When the commit succeeds, Then the subsequent push attempt uses a distinct error message for non-fast-forward vs auth failure | Push to a test branch twice rapidly to create a race, and verify the error message mentions "rebase" when retrying | Unmet | - |
| AC-005 | REQ-005 | Given a non-fast-forward error during push, When the retry logic runs, Then the job fetches and rebases to the branch tip, regenerates the index, runs `--check`, and retries the push once | Trigger on a stale commit to main; verify the log shows "git fetch", "git rebase", one `generate-trigger-index.mjs` and `--check` before the second push attempt; verify the final commit's index matches the tip's corpus | Unmet | - |
| AC-006 | REQ-006 | Given a commit whose subject starts with the rebuild subject but is not the job's own rebuild commit, When it is pushed, Then the job runs; and given the job's own rebuild commit, Then it is skipped | Read the `if:` on the job: an exact match or a marker check, not `startsWith`. Confirm on one push of each kind | Unmet | - |

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

**Closeable:** No (Phase is planned, not built)

When the phase is built and all AC rows show `Met`, this packet may close. AC-001 and AC-004 (token hidden from checkout, token scoped to a main-only environment) were removed before any build, because the operator decided on 2026-10-08 to leave the token as it is. Their IDs are not reused.
<!-- /ANCHOR:closure -->
