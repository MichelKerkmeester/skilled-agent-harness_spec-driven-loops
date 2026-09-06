---
title: "Acceptance Criteria: Phase 7: memory-command-family-naming-decision"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/007-memory-command-family-naming-decision"
    last_updated_at: "2026-09-05T11:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed Stage B inside 002-scripts-into-runtime-nesting"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files:
      - "decision-record.md"
      - "scratch/code-path-followups.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-007-memory-command-family-naming-decision-stage-a"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: memory-command-family-naming-decision

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/007-memory-command-family-naming-decision
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two naming options, When `spec.md` is read, Then each option's blast radius is grouped by consumer class with a reproducible `rg` command | `spec.md:74-88` (Scope, Files to Change); `decision-record.md:44-52` (ADR-001 consumer-class table) | Met | - |
| AC-002 | REQ-002 | Given the operator's decision, When it is made, Then `decision-record.md` exists in this folder and names the chosen option before any rename work is scheduled | `decision-record.md:60` names Option B, hard cutover | Met | - |
| AC-003 | REQ-003 | Given Option A is chosen, When the decision record is written, Then it also names the follow-on documentation task (README/ARCHITECTURE/`memory-system.md` clarification) rather than leaving it implicit | `decision-record.md:60` — not applicable, Option B was chosen | Superseded | ADR-001 |
| AC-004 | REQ-004 | Given Option B is chosen, When the follow-on execution packet is opened, Then its scope explicitly names `runtime/hooks/claude/session-stop.ts:73-76` | Stage B executed inside `specs/system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/002-scripts-into-runtime-nesting/` per an operator-approved scope amendment (shared blast radius with the scripts -> runtime/cli move); that packet's `implementation-summary.md` records all four `session-stop.ts` fallback candidates rewritten and verified | Met | - |

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

Note: AC-003 and AC-004 are mutually exclusive by construction - only the row matching the eventual decision applies. The non-applicable row should be marked `Superseded` once the decision is recorded, naming the resulting `decision-record.md` as its ADR.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001, AC-002 are Met, AC-003 is Superseded (Option B was chosen), and AC-004 is Met: Stage B executed inside `002-scripts-into-runtime-nesting/` per an operator-approved scope amendment rather than a separately Gate-3'd packet, rewriting `runtime/hooks/claude/session-stop.ts:73-76`'s four fallback candidates and every other code-path consumer named in `scratch/code-path-followups.md`.
<!-- /ANCHOR:closure -->
