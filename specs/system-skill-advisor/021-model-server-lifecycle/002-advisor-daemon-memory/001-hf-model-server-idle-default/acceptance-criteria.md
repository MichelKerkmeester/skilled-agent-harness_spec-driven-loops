---
title: "Acceptance Criteria: Phase 1: hf-model-server-idle-default"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hf model server idle default acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory/001-hf-model-server-idle-default"
    last_updated_at: "2026-10-21T11:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked AC-001 to AC-004 and AC-006 Met, AC-005 superseded by ADR-002"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-hf-model-server-idle-default"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: hf-model-server-idle-default

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-hf-model-server-idle-default
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
| AC-001 | REQ-001 | Given the variable unset, When `getModelServerIdleConfig()` runs, Then it returns `enabled: true` with the chosen default in milliseconds | Node config probe PASS (exit 0); implementation `.skilled/bin/lib/model-server-supervision.cjs:229`, regression case `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:143` (suite run by the orchestrator: embedders 90 passed, 2 skipped) | Met | - |
| AC-002 | REQ-002 | Given the variable set to `0`, When the config is read, Then eviction is disabled | Node config probe PASS (exit 0); implementation `.skilled/bin/lib/model-server-supervision.cjs:231`, regression case `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts:156` (suite run by the orchestrator: embedders 90 passed, 2 skipped) | Met | - |
| AC-003 | REQ-003 | Given an evicted model server, When the next embedding request arrives, Then its cold-start time is measured three times and recorded | `implementation-summary.md:63-64`: two warm-cache reloads, 462 ms and 407 ms, measured the eviction cost; a third run (20,303 ms) was a first-time model download and is excluded | Met | - |
| AC-004 | REQ-004 | Given the env docs, When read, Then they state the new default and the `0` opt-out | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:295`, `.env.example:256`; `validate_document.py --type reference --blocking-only` printed VALID (exit 0) | Met | - |
| AC-005 | REQ-001 | Given a live launcher with no traffic, When the default timeout passes, Then its model server process is gone and the next advisor query brings it back | `ps` before and after, advisor query output | Superseded | ADR-002 |
| AC-006 | REQ-001 | Given the launcher supervision code with a short idle timeout, When the server has embedded once and then idles, Then it is evicted and the demand listener re-arms so the next embed respawns it; and with the variable unset the timeout is 600000 ms | `launcher-model-server-idle-eviction.vitest.ts` "evicts only after a successful idle embed and re-arms the lazy demand listener" and the default cases; embedders suite 90 passed, 2 skipped; launcher-ipc-bridge, demand-probe and respawn-lock suites 29 passed; advisor `launcher-bootstrap` 20 passed | Met | - |

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

The measurement and the unit and supervision tests carried the phase. The live check at the real 10-minute default was superseded by ADR-002, because the shared model server socket only starts through a launcher with spawn authority.
<!-- /ANCHOR:closure -->
