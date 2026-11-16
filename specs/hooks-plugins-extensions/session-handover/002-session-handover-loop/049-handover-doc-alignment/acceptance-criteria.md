---
title: "Acceptance Criteria: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover doc alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/049-handover-doc-alignment"
    last_updated_at: "2026-11-16T07:07:40Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-049-handover-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 049-handover-doc-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 45 findings outside 411's rewrite, When the fix briefs ran, Then each is fixed or left with a reason the code confirms | G1 to G4 lanes `ok`, 26 files changed; L1-14 and L3-16 true after the shim change and C7 already fixed on main, all three confirmed by the Opus review (`lib/README.md:29`, `handoff.md:196`, `system-spec-kit/README.md:92`) | Met | - |
| AC-002 | REQ-002 | Given a shell that sources the shim, When `vibe` opens a session, Then it runs under skilled-loop, and a non-session vibe command runs directly | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/skilled-loop-shell.test.cjs` prints `pass 37`, `fail 0`; with vibe removed from the resolver the bash and zsh vibe cases fail | Met | - |
| AC-003 | REQ-003 | Given 13 findings in READMEs 411 rewrote, When they were sent to that session, Then each is resolved | 411 reported 10 already fixed on `0c6cd13ab0e`, 2 fixed in `0af73b5d4d5` on origin/main, and the shim list folded into this pass as S1 to S3 | Met | - |
| AC-004 | REQ-004 | Given the full change, When a fresh Opus medium agent reviewed it against the code, Then no P0 or P1 remains | Review found 1 P1 and 4 P2, all applied in `cdfcfd079f1` with the text the review quoted | Met | - |
| AC-005 | REQ-005 | Given the worktree diff against main, When it is listed, Then only scoped files change | `git diff --stat origin/main...HEAD` lists the shim, its suite, the hand-over docs, the harness and this packet | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
