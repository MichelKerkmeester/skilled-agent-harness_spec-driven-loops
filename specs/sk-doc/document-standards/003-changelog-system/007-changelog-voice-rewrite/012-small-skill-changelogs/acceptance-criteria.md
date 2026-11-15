---
title: "Acceptance Criteria: Phase 12: small-skill-changelogs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "small skill changelogs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/003-changelog-system/007-changelog-voice-rewrite/012-small-skill-changelogs"
    last_updated_at: "2026-11-15T19:19:50Z"
    last_updated_by: "claude"
    recent_action: "Marked every criterion Met with cited evidence"
    next_safe_action: "Commit phase 012, then close the parent packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-small-skill-changelogs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: small-skill-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 007-changelog-voice-rewrite/012-small-skill-changelogs
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 98 files on the list, When the waves finish, Then each file is kept with every gate passed, recorded unchanged, done in the pilot, or restored with its last finding recorded | `scratch/evidence.txt:28` shows 69 kept, 26 at HEAD and 0 missing. The 26 are 25 unchanged files and `.skilled/skills/mcp-code-mode/changelog/v1.0.10.0.md`, whose last finding is at `scratch/evidence.txt:26`. The pilot's 3 files match HEAD at `scratch/evidence.txt:33` | Met | - |
| AC-002 | REQ-002 | Given the finished waves, When `wave-verify.cjs` runs, Then it reports no problem for a file this phase rewrote | `scratch/evidence.txt:28` lists 3 problems, and `scratch/evidence.txt:29` to `scratch/evidence.txt:31` show they are the 3 pilot files whose saved originals predate the pilot | Met | - |
| AC-003 | REQ-003 | Given the 95 queued files, When `measure-voice.py` runs after the waves, Then it prints 0 files with a hard blocker, and any sentence over 22 words sits in a restored file | `scratch/evidence.txt:9` and `scratch/evidence.txt:10` show 1 sentence over 22 words and 0 hard blockers, against the baseline at `scratch/evidence.txt:5`. `scratch/evidence.txt:11` places that sentence in `.skilled/skills/mcp-code-mode/changelog/v1.0.10.0.md` | Met | - |
| AC-004 | REQ-004 | Given a file the first wave restores, When the retry wave runs, Then its result is recorded | `scratch/evidence.txt:14` shows `restored=2`. `scratch/evidence.txt:18` to `scratch/evidence.txt:20` and `scratch/evidence.txt:23` record each retry result | Met | - |
| AC-005 | REQ-005 | Given the run state, When the phase tokens are summed, Then the total is reported | `scratch/evidence.txt:37` shows 3,236,542 tokens | Met | - |

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

Yes. Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
