---
title: "Acceptance Criteria: Phase 13: goal-chat-send-shape"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/038-goal-unification/013-goal-chat-send-shape"
    last_updated_at: "2026-09-16T19:03:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed every criterion with observed evidence"
    next_safe_action: "Operator review of the AGENTS.md goal posture wording, then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: goal-chat-send-shape

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/038-goal-unification/013-goal-chat-send-shape
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a goal document with numbered headings, dividers, comments, a table and bullets, When `renderChatSlice` renders it, Then no numbered heading, comment or divider remains and the title, table and bullets stay | `.opencode/hooks/goal/lib/goal-slice.test.cjs:83` failed at `:115` against the unchanged module and passes after the change, suite 16 of 16 | Met | - |
| AC-002 | REQ-001 | Given the parent goal, When `goal.cjs packet` reads it, Then its `chat_slice` carries no `<!--`, no divider line and no numbered heading | `.opencode/hooks/goal/bin/goal.cjs:215` printed `packet_durable_chars=3990` and a `chat_slice` of 3,661 characters with 0 comments, 0 divider lines and 0 numbered headings | Met | - |
| AC-003 | REQ-002 | Given an agent reading a goal send surface, When it decides what goal text to send, Then the surface names the chat slice and the 4,000-character cap | `AGENTS.md:187`, `.opencode/skills/system-spec-kit/SKILL.md:483`, `goal-set-string-playbook.md:82-94`, `speckit-plan.yaml:197`, `speckit-implement.yaml:162`, `speckit-complete.yaml:255`, both resume assets at `:47`, `goal-slice.cjs:211` | Met | - |
| AC-004 | REQ-002 | Given the three lifecycle workflows, When the goal offer contract test runs, Then their goal blocks are still byte-identical | `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:117` passes, file 5 of 5 | Met | - |
| AC-005 | REQ-002 | Given a pending resend, When the reminder renders, Then it names the chat slice and carries the 4000-character cap | `.opencode/hooks/goal/lib/goal-slice.test.cjs:203`, goal hook suites 136 of 136, goal plugin suites 147 of 147 | Met | - |
| AC-006 | REQ-003 | Given the edited goal template, When the golden snapshot file runs without `-u`, Then the whole file passes | `.opencode/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:76` passes, file 12 of 12 after one snapshot update | Met | - |
| AC-007 | REQ-004 | Given binding row 013 in the parent, When the parent's durable slice is measured, Then it stays at or under 4,000 characters | Row at `specs/system-speckit/033-system-speckit-v4/038-goal-unification/goal.md:90`, and `extractDurableSlice` measures the parent slice at 3,990 characters, below the error tier | Met | - |

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

AC-001 and AC-003 carried this packet. The renderer already stripped comments and dividers, so the
failure was never missing code: every surface an agent reads told it to send the anchors-included
durable slice, and nothing stated a cap on the sent text. The test proves the one code change, and
the cited lines prove the rule now sits where the send decision is made.

Two things were consciously left out. No length enforcement was written, because the operator placed
the rule in the docs and the reminder. The resend paragraphs inside existing packet `goal.md` files
were not rewritten, because the `AGENTS.md` row overrides them on every turn.
<!-- /ANCHOR:closure -->
