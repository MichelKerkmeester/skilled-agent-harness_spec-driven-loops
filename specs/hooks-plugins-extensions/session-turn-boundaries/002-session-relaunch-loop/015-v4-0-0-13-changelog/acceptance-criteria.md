---
title: "Acceptance Criteria: Phase 15: v4-0-0-13-changelog"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v4 0 0 13 changelog acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog"
    last_updated_at: "2026-10-20T17:00:00Z"
    last_updated_by: "worker"
    recent_action: "Met all four criteria with validator output and line evidence"
    next_safe_action: "Commit worktree 172 and merge it to main"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 15: v4-0-0-13-changelog

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog
**Level:** 2
**Status:** Complete
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the local and upstream changelog folders and tags, When the entry is written, Then it sits at `.skilled/changelog/skilled/v4.0.0.13.md` with a version strictly greater than any other and the five frontmatter keys | Evidence: the highest local and `origin/main` entry is v4.0.0.12, tag `v4.0.0.12` exists and no v4.0.0.13 file or tag exists locally or on origin, so v4.0.0.13 is a build bump. Frontmatter keys at `v4.0.0.13.md:2` (`title`), `:3` (`description`), `:4` (`trigger_phrases`), `:9` (`importance_tier`) and `:10` (`contextType`) | Met | - |
| AC-002 | REQ-002 | Given the entry's handover text, When it is read against the session-relaunch README, Then the handover leads and every claim matches | Evidence: the title, opening at `v4.0.0.13.md:12` to `:16` and first glance bullets at `:30` to `:34` lead with the handover. Claims match `.skilled/hooks/session-relaunch/README.md`: 0.80 threshold and second nudge 0.05 above at `:96` and `:180`, five automatic runtimes and Cursor and Devin on the command trigger at `:19` and `:90`, the seven shim functions and the symlinked `.skilled` at `:82` to `:88`, the Hermes plugin line and alias rule at `:90`, the 30000 ms deadline and notice title at `:124`, the hop cap of 10 at `:182` and the ten-minute age limit at `:183`, no nudge outside the loop at `:112` | Met | - |
| AC-003 | REQ-003 | Given a release with a breaking rename and ten or more changes, When the format is chosen, Then the entry uses the expanded format | Evidence: the entry has Why This Release (`:22`), What's New at a Glance (`:28`), three area sections (`:42`, `:62`, `:74`), a bold Breaking line for the `OPENCODE` to `SKILLED` surface id change (`:80`) and Upgrade Notes (`:84`). The scope since `0ead854621` spans the handover, OpenCode dual compatibility, the rename, the deep-loop row migration, the new CI suites and worktree bun provisioning | Met | - |
| AC-004 | REQ-004 | Given the finished entry, When the sk-doc checks run, Then they pass | Evidence: `validate_document.py .skilled/changelog/skilled/v4.0.0.13.md` printed VALID with 0 issues, rc 0. `hvr_scan.py` reported 0 hard blockers and a mechanical ceiling of 97/100, and its 9 oxford-comma candidates are all clause joins, not series. `extract_structure.py` checklist failed: 0 | Met | - |

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

All four criteria are Met. The v4.0.0.13 entry exists with a unique build version, leads with the in-session handover in claims that match the session-relaunch README, uses the expanded format with the breaking rename marked and passes the sk-doc checks. No GitHub release was published and no component changelog was written.
<!-- /ANCHOR:closure -->
