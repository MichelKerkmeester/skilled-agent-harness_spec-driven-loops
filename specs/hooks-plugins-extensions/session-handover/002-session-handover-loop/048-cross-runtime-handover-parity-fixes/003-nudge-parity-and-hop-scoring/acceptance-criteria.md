---
title: "Acceptance Criteria: Phase 3: nudge-parity-and-hop-scoring"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "nudge parity and hop scoring acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/003-nudge-parity-and-hop-scoring"
    last_updated_at: "2026-11-15T19:49:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-nudge-parity-and-hop-scoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: nudge-parity-and-hop-scoring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `003-nudge-parity-and-hop-scoring`
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given two commits racing on one session at the same level, When both run, Then exactly one delivers, and a claim older than ten seconds is taken over | `nudge.test.cjs` race and stale-claim cases, each failing with the claim removed. Observed: the race and stale-claim tests in `nudge.test.cjs` pass. Skipping the second decision fails two tests, and dropping the held-claim check fails four | Met | - |
| AC-002 | REQ-002 | Given a held claim, When the Claude, Codex or Vibe nudge path decides to nudge, Then it stays quiet | A held-claim case per runtime, each failing with the old write restored. Observed: the held-claim tests on Claude, Codex and Vibe pass, and removing each adapter's null check fails its test | Met | - |
| AC-003 | REQ-003 | Given the baseline counts, When the handover and Vibe lifecycle suites run, Then 0 fail | Suite summary lines. Observed: handover `tests 1039`, `fail 0`; Vibe lifecycle `tests 37`, `fail 0` | Met | - |
| AC-004 | REQ-004 | Given a saved run, When `score.cjs` scores it, Then it reports whether the receiver stated the side word and whether the note held it | `score.cjs` output on the saved 047 `hard2-vibe` run. Observed: `score.cjs` on the saved 047 `hard2-vibe` run prints `sideWordStated: true` and `sideWordInNote: false` | Met | - |
| AC-005 | REQ-005 | Given phases 001 and 002 built, When one live Pi hop and one live OpenCode hop run with a side word, Then each relaunches and the receiver reports the side word through History Lookup | Run folders under `../scratch/runs/` with `score.cjs` output. Observed: `live1-opencode` 5/5, side word absent from the note and loaded by history id. `live1-pi` 5/5, but the sender wrote the side word into the note, so no lookup was needed. `live2-pi` relaunched (4/5): the receiver ran the printed browse, which returned turns 6 to 2 with tool-call JSON previews, and it declined to guess the side word | Unmet | - |

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

AC-005 is unmet: the OpenCode receiver recovered the side word through History Lookup, but no Pi receiver did.
<!-- /ANCHOR:closure -->
