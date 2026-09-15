---
title: "Acceptance Criteria: Phase 6: ledger-stem-producers"
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
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/007-ledger-stem-producers"
    last_updated_at: "2026-09-15T22:55:00Z"
    last_updated_by: "ledger-stem-producers"
    recent_action: "Recorded the criteria and their evidence"
    next_safe_action: "Repair or waive AC-008 once the client-side stress assertion lands"
    blockers:
      - "AC-008: tests/stress/cli-adapter/fanout.vitest.ts fails after another track's executor preflight"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ledger-stem-producers"
      parent_session_id: null
    completion_pct: 88
    open_questions:
      - "Who repairs the stress assertion the executor preflight invalidated?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: ledger-stem-producers

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-ledger-stem-producers
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given both lanes' frozen stem arrays, When the census is read, Then every registered stem is either spoken by a named producer or reserved with its reason | `node scripts/check-ledger-stem-producers.cjs` exits 0 reporting registered 61, spoken 5, reserved 56 and zero violations; the census consts are at runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:586 and runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:426 | Met | - |
| AC-002 | REQ-002 | Given a producer that writes an unregistered spelling, When the checker runs, Then it exits 2 naming the rule instead of passing | fixture cases at runtime/tests/unit/check-ledger-stem-producers.vitest.ts:177 (reserved stem emitted) and runtime/tests/unit/check-ledger-stem-producers.vitest.ts:188 (unregistered emitter), plus the real-tree run | Met | - |
| AC-003 | REQ-003 | Given this change set, When the deep-loop suite runs, Then it exits zero | `npx vitest run --no-coverage`: 153 of 154 files and 2676 of 2685 tests pass; the one red asserts at runtime/tests/stress/cli-adapter/fanout.vitest.ts:521 and is stale against the executor probe added by commit `2a84717ed3` in another track, the same external red the sibling packet logs already record | Unmet | - |
| AC-004 | REQ-004 | Given the flat gate summary and the typed per-finding record, When either payload is posted under the other's stem, Then both are rejected | cross-post case at runtime/tests/unit/deep-review-ledger-schema.vitest.ts:915, and the fold case at runtime/tests/unit/deep-review-projections-contract.vitest.ts:299 asserting the typed adjudication array stays empty | Met | - |
| AC-005 | REQ-005 | Given a shadow output whose config row carries keys the projection does not rebuild, When a replace is attempted, Then it is refused and the published bytes are unchanged | guard call site at runtime/lib/legacy-projections/shadow-projection-store.ts:573 and its refusal case at runtime/tests/unit/legacy-projections.test.ts:661 | Met | - |
| AC-006 | REQ-006 | Given frames reachable at either root, When the ledger-backing gate runs, Then the result names the root that backed the run | runtime/scripts/verify-iteration.cjs:202 returns the frames root and kind; cases at runtime/tests/unit/verify-iteration.vitest.ts:355 cover the parent root, the artifact-dir root, the kill switch and pre-authority | Met | - |
| AC-007 | REQ-007 | Given a reader of either mode's state references, When they look for the ledger vocabulary, Then the document names the registry, the census, the checker and the projection's ceiling | the review section at .opencode/skills/system-deep-loop/deep-review/references/state/state-format.md:554 and the research section at .opencode/skills/system-deep-loop/deep-research/references/state/state-format.md:128; `node scripts/check-contract-drift.cjs` reports `OK commands=3` after regeneration | Met | - |
| AC-008 | REQ-008 | Given an authority root, When the independent verifier runs, Then its stored, default and malformed paths and its arguments behave as documented | runtime/tests/unit/verify-authority-cli.vitest.ts:114 covers ten cases: six stored final records, six reversible records, an empty root, a malformed record, a legacy writer, a removed mode and four argument paths | Met | - |

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

AC-001, AC-002 and AC-004 through AC-008 carry the packet: the census is declared and enforced, the adjudication split is settled with proofs, and a lossy projection replace is refused loudly. AC-003 is unmet and the packet stays open, because the suite's single red belongs to another track's executor preflight and this packet must not repair a boundary it does not own.
<!-- /ANCHOR:closure -->
