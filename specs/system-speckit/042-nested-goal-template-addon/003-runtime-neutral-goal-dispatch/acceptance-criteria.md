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
      fingerprint: "sha256:08ed79b5b5bd0259496e9337c31fa1f8eba14c224248864e6cf9d10cbeb61ebb"
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
| AC-001 | REQ-001 | Given the set action, When it dispatches, Then it resolves by runtime rather than naming one runtime's tool unconditionally | `speckit-plan-auto.yaml:134` `dispatch_by_runtime`, in all six workflow assets | Met | - |
| AC-002 | REQ-002 | Given the offer action, When it runs, Then it calls no tool | Offer and skip name no tool; `speckit-plan-auto.yaml:134` dispatches by runtime instead | Met | - |
| AC-003 | REQ-003 | Given a command file naming the goal document, When the contract test runs, Then it passes | Control A exits 0 (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:109`) | Met | - |
| AC-004 | REQ-004 | Given a genuinely stale command reference, When the contract test runs, Then it still fails | Control B exits 1 against `staleCommandRef` (`.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:106`) | Met | - |
| AC-005 | REQ-005 | Given a runtime that documents no adapter, When the set action resolves, Then it hands off rather than fabricating one | `speckit-plan-auto.yaml:151` `status_tool_by_runtime` hands off rather than naming an adapter | Met | - |

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

All five criteria met. Both directions of the assertion change were proven: a spec-document reference passes and a stale command reference still fails.
<!-- /ANCHOR:closure -->
