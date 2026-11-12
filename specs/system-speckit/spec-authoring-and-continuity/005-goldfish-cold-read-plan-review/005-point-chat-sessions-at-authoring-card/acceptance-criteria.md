---
title: "Acceptance Criteria: Phase 5: point-chat-sessions-at-authoring-card"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "point chat sessions authoring card"
  - "phase 5 authoring card routing"
  - "spec gate mutation notice"
  - "IMPLEMENT write intent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card"
    last_updated_at: "2026-11-12T01:58:02Z"
    last_updated_by: "codex"
    recent_action: "Aligned acceptance evidence with the verified closeout receipts"
    next_safe_action: "Review the recorded closeout before reopening this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-point-chat-sessions-at-authoring-card"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 5: point-chat-sessions-at-authoring-card

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-point-chat-sessions-at-authoring-card
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given carrier edits were pending, When T001 to T003 checked the pre-edit snapshot and advisor result, Then they confirmed 2 scaffold output blocks, 1 notice return with 7 adapters that load the gate core, and 1 instruction to read ROUTER.md, and recorded the valid advisor result. | tasks.md T001-T003 and CHK-023; pre-edit HEAD receipts at `../scratch/build-evidence.md:128-131`; the adapter count is 7 and the adapter files were unchanged at `../scratch/build-evidence.md:161`; the non-degraded advisor result is at `../scratch/build-evidence.md:141` and child 001 `scratch/trust-checks.md`. | Met | - |
| AC-002 | REQ-002 | Given the first unbound file mutation is requested, When the shared notice is shown, Then its direct sentence names the canonical spec authoring card. | tasks.md T009-T011 (T009 exact sentence; T010 count `1`; T011 `../scratch/build-evidence.md:52`, exit 0, `pass 110`, `fail 0`) | Met | - |
| AC-003 | REQ-003 | Given standard and phase scaffolds are created, When each Next steps section is printed, Then both contain the canonical authoring-card path. | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:24,2209,2418`; scaffold helpers assert the path at `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts:50,67`; `../scratch/build-evidence.md:153` records exit 0 and 6 passing tests. | Met | - |
| AC-004 | REQ-004 | Given the measured plain-language write prompt, When the router's word-boundary rule is applied to it, Then an IMPLEMENT keyword matches and IMPLEMENT still loads the authoring-card resource. Phase 007 later moved the six verbs to a WRITE intent that loads only the card; the same prompt now matches WRITE, and `check-card-sync.sh` prints `PASS intent-WRITE`. | tasks.md T012-T013 (T012 printed `['add']`; T013 printed count `1` and `CARD SYNC OK`) | Met | - |

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

All four acceptance criteria are Met. The pre-edit carrier counts, adapter count and T004 intermediate state are supported by `../scratch/build-evidence.md:128-132,141,161-163`. The focused test receipts remain at lines 52 and 153.
<!-- /ANCHOR:closure -->
