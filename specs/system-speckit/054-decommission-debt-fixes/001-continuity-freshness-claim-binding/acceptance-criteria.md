---
title: "Acceptance Criteria: Phase 1: continuity-freshness-claim-binding"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/001-continuity-freshness-claim-binding"
    last_updated_at: "2026-09-05T06:13:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-001-continuity-freshness-claim-binding"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: continuity-freshness-claim-binding

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/001-continuity-freshness-claim-binding
**Level:** 2
**Status:** Planned
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the binding decision is implemented, When `continuity-freshness.ts` is read, Then a code comment and this spec both state that `implementation-summary.md`'s `session_dedup.fingerprint` is the sole attestation point for a completion claim | `rg -n "attestation" .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` finds the binding comment | Unmet | - |
| AC-002 | REQ-002 | Given packet `052-memory-decommission-landing` (real, zero-fingerprint, Status Complete), When `SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder specs/system-speckit/052-memory-decommission-landing --json` runs, Then the result code is the completion-freshness verdict (`zero_fingerprint`), not the unrelated timestamp `stale` verdict | Command output's `code` field | Unmet | - |
| AC-003 | REQ-003 | Given a document with a fresh completion claim and no existing fingerprint, When the continuity writer saves it, Then `session_dedup.fingerprint` is a real, non-`ZERO_CONTINUITY_FINGERPRINT` SHA-256 value | New assertion in `generate-context-cli-authority.vitest.ts` or `generate-context-save-lock.vitest.ts` | Unmet | - |
| AC-004 | REQ-004 | Given the eight skip codes, When `validate.sh --strict --json` runs on a packet in each skip state, Then the JSON output distinguishes each skip code from a verified pass, and the aggregate exit code for every packet in `049-memory-decommission/`, `052-memory-decommission-landing/` and `053-spec-kit-runtime-rename/` is unchanged from the T001 baseline | `validate.sh --strict` before/after diff | Unmet | - |
| AC-005 | REQ-005 | Given the CLI opt-in gate and the exported function, When both are exercised in a test, Then the current asymmetry (CLI gated, function unguarded) is either removed or pinned as intentional by an explicit assertion | `continuity-freshness.vitest.ts` new case | Unmet | - |
| AC-006 | REQ-006 | Given the four new scenarios, When `continuity-freshness.vitest.ts` runs, Then all four pass alongside the existing five passing cases and the one pre-existing `it.fails.skip` | `npm run test:runtime` (or the workspace command running this suite) | Unmet | - |

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

All six criteria are Unmet; implementation has not started.
<!-- /ANCHOR:closure -->
