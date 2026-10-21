---
title: "Acceptance Criteria: Phase 3: reap-orphaned-model-server"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "reap orphaned model server acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory/003-reap-orphaned-model-server"
    last_updated_at: "2026-10-21T14:17:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked AC-001 to AC-004 Met with tests and a live reap"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-reap-orphaned-model-server"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: reap-orphaned-model-server

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-reap-orphaned-model-server
**Level:** 2
**Status:** Complete
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an alive recorded model server with parent PID 1 running `hf-model-server.cjs`, When a supervisor starts its demand listener, Then it reaps that server and listens | `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:320`; live 2026-10-21: a real `hf-model-server.cjs` with parent PID 1 (581 MB) was reaped by the real preflight, which then listened | Met | - |
| AC-002 | REQ-002 | Given a recorded server whose parent is a live launcher, or a recorded pid running another command, or an unreadable parent, When the listener starts, Then nothing is signalled and it backs off | `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:427` (live launcher parent), `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:440` (other command), `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:454` and `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:468` (unreadable parent or command), `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:345` (pid changed before the reap), `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:369` (pid already dead), `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:387` (pid survives SIGKILL, socket kept), `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:409` (kill switch); removing any guard fails a test | Met | - |
| AC-003 | REQ-003 | Given the orphan reap, When it completes, Then no give-up cooldown is armed | `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:320` asserts no cooldown is armed; a confirmed reap clears an old cooldown and the pid file | Met | - |
| AC-004 | REQ-004 | Given a launcher killed with `kill -9`, When the advisor starts again, Then no model server has parent PID 1 and the next embedding is served | live 2026-10-21 with the real preflight, probe, `ps` reads and signal: default reaps the orphan (no model server left after), `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` leaves it running; the full launcher run with `kill -9` was not driven, because a launcher spawns its model server only on embed demand (see phase 001 ADR-002) | Met | - |

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

The guard tests and a live reap of a real orphaned model server carried the phase. The reap was driven through the real preflight rather than a killed launcher, which spawns a model server only on embed demand.
<!-- /ANCHOR:closure -->
