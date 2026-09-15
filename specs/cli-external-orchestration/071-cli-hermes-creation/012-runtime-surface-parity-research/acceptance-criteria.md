---
title: "Acceptance Criteria: Phase 1: runtime-surface-parity-research"
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
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research"
    last_updated_at: "2026-09-15T15:52:45Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion met with its evidence recorded"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-012-runtime-surface-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: runtime-surface-parity-research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research
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
| AC-001 | REQ-001 | Given the seven runtime mirrors, When ten iterations run with no early convergence, Then each closes its chartered angle | Ten iteration files, 111KB total, one per chartered angle; stop policy max-iterations | Met | - |
| AC-002 | REQ-002 | Given the iterations, When synthesised, Then research.md carries every deliverable the charter names | research.md, 323 lines: corrected command matrix, surface parity table across seven runtimes, the Devin boundary with proof per row, ranked recommendations, six-phase decomposition | Met | - |
| AC-003 | REQ-003 | Given a charter premise contradicted by evidence, When found, Then the contradiction is recorded rather than the premise preserved | Two corrections stated first and used throughout: the authored command surface is 35 rather than the charter's 46, with the difference explained as asset and script markdown; and Devin's commands were removed by operator directive in commit a2241041b0, not never built | Met | - |
| AC-004 | REQ-004 | Given a missing surface, When judged, Then absence a runtime cannot load is recorded as correct rather than as a gap | Five of six command mirrors are correct by an exclusion policy the lane located; only Devin's zero is a real absence, and it is a recorded operator decision | Met | - |

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
