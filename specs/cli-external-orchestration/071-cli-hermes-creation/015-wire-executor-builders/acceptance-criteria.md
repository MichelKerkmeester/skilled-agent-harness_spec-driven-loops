---
title: "Acceptance Criteria: Phase 3: wire-executor-builders"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/015-wire-executor-builders"
    last_updated_at: "2026-09-15T16:29:33Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion met with its evidence recorded"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-015-wire-executor-builders"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: wire-executor-builders

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/015-wire-executor-builders
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an absent Claude or OpenCode binary, When a lineage command is built, Then it refuses before spawning | Exercised directly against an empty PATH: both refuse with "executor unavailable: command -v ... failed"; with a real PATH the Claude path builds, and the OpenCode path stops on an unrelated sandbox-mode constraint rather than the probe | Met | - |
| AC-002 | REQ-002 | Given a Hermes lineage naming a persona, When its command and environment are built, Then the mirrored agent skill is preloaded and the persona variable is set | Runner unit suite test "preloads the mirrored agent skill when a lineage names a persona"; builder exercised directly and emits the preload flag | Met | - |
| AC-003 | REQ-003 | Given a persona name the repo plugin would reject, When the command is built, Then it is refused | Same test asserts the throw; exercised directly, an invalid name is refused with "is not a valid agent name" | Met | - |
| AC-004 | REQ-004 | Given a lineage naming no persona, When its command is built, Then no preload flag is added | Same test asserts the absence; the runner suite is 151 passing, one added and none removed | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
