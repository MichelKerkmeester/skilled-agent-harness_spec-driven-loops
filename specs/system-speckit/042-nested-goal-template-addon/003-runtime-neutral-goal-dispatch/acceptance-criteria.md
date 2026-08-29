---
title: "Acceptance Criteria: Runtime-Neutral Goal Dispatch"
description: "Make the speckit goal offer dispatch by runtime instead of calling one runtime's tool, and make the stale-filename assertion path-specific so a spec document named goal.md stops colliding with it."
trigger_phrases:
  - "runtime neutral goal"
  - "goal offer dispatch"
  - "stale filename assertion"
  - "goal_prompt_choice"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/003-runtime-neutral-goal-dispatch"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the dispatch table and tighten the assertion"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-003-runtime-neutral-goal-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The offer stays tool-free; only the set action dispatches, and it dispatches per runtime"
---

# Acceptance Criteria: Runtime-Neutral Goal Dispatch

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/042-nested-goal-template-addon/003-runtime-neutral-goal-dispatch
**Level:** 2
**Status:** Draft
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the set action, When it dispatches, Then it resolves by runtime rather than naming one runtime's tool unconditionally | Recorded at implementation | Unmet | - |
| AC-002 | REQ-002 | Given the offer action, When it runs, Then it calls no tool | Recorded at implementation | Unmet | - |
| AC-003 | REQ-003 | Given a command file naming the goal document, When the contract test runs, Then it passes | Recorded at implementation | Unmet | - |
| AC-004 | REQ-004 | Given a genuinely stale command reference, When the contract test runs, Then it still fails | Recorded at implementation | Unmet | - |
| AC-005 | REQ-005 | Given a runtime that documents no adapter, When the set action resolves, Then it hands off rather than fabricating one | Recorded at implementation | Unmet | - |

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

**Closeable:** No

Open until this phase is implemented and each criterion carries observed evidence.
<!-- /ANCHOR:closure -->
