---
title: "Acceptance Criteria: Review gateway accepts the canonical iteration record"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review gateway iteration acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-gateway-iteration-record"
    last_updated_at: "2026-10-02T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Review gateway records the canonical iteration record; byte comparison fixed"
    next_safe_action: "Commit in worktree 078 on the operator's go-ahead"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Review gateway accepts the canonical iteration record

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/038-review-gateway-iteration-record
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a canonical review iteration record, When `append-mode-event.cjs --mode review` records it, Then it exits 0 and the state log holds a row equal to the record | `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts:860`; on main the same real record exits 1 | Met | - |
| AC-002 | REQ-001 | Given the five real iteration records of the 2026-10-02 hook review (11 to 23 KB), When each is recorded, Then all exit 0 and project back deep-equal | Manual run in the scratchpad: 5 of 5 exit 0, 5 of 5 deep-equal | Met | - |
| AC-003 | REQ-002 | Given the stem tables, When the schema, census and state-contract suites run, Then the stem is registered, spoken and unwrapped | `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-contract.vitest.ts:99`; `.skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts:224`; `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts:593` | Met | - |
| AC-004 | REQ-003 | Given a review row of another type, When it is recorded, Then it is refused with the original message | `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts:927` | Met | - |
| AC-005 | REQ-004 | Given the final state, When typecheck and every suite touching these modules run, Then nothing fails that passed before | tsc exit 0; full runtime suite 2,852 passed, 5 failed, and the same 5 fail on main (3 render-command-contract, 2 check-contract-drift) | Met | - |
| AC-006 | REQ-005 | Given an event whose canonical bytes exceed 10,000, When it is recorded, Then it is accepted | `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts:904`; `.skilled/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts:733`; on the old comparison a 9,800-character string was already refused | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All six criteria are Met. The real records that main refuses now record and come back unchanged. The agent, prompt template and workflow were left as they are, because they already describe the record the gateway now accepts.
<!-- /ANCHOR:closure -->
