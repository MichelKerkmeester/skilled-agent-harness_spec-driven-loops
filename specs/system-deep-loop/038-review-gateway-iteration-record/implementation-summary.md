---
title: "Implementation Summary"
description: "A review iteration can record its state through the gateway again: the canonical record the agent, prompt and workflow describe is accepted in review mode, and events over 10 KB are no longer refused in any mode."
trigger_phrases:
  - "review gateway iteration summary"
  - "canonical bytes comparison fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-gateway-iteration-record"
    last_updated_at: "2026-10-02T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Review gateway records the canonical iteration record; byte comparison fixed"
    next_safe_action: "Commit in worktree 078, then merge to main on the operator's go-ahead"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs"
      - ".skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-review-gateway-iteration-record |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-review iteration can record its state again. The agent, its iteration prompt and its workflow all hand the append gateway one `type:"iteration"` record, and in review mode the gateway refused it as an unrecognized format, so every review iteration failed its state step whatever the executor. It now records that record whole under a new stem, `deep_review.iteration_recorded`, and the state log carries it back as the same row.

### Fixing it exposed a second defect

The first real record still failed, with "JSON value exceeds structural limits". Two checks in the shared authorized ledger compared canonical event bytes by turning each byte array into canonical JSON, which allows 10,000 nodes and counts one per byte. Any event over about 10 KB was refused, in every mode. Both checks now compare the bytes directly through one helper, `canonicalBytesEqual`, and all five real records from the 2026-10-02 hook review (11 to 23 KB) record and come back unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts`, `deep-review-ledger-schema.ts` | Modified | Register the stem |
| `runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Modified | Route it like `iteration_error` |
| `runtime/lib/legacy-projections/deep-review-state-contract.ts` | Modified | Unwrap the record |
| `runtime/scripts/append-mode-event.cjs` | Modified | Wrap a bare review iteration record |
| `runtime/lib/event-envelope/canonical-json.ts`, `index.ts` | Modified | `canonicalBytesEqual` |
| `runtime/lib/authorized-ledger/transition-authorization-gateway.ts`, `append-only-ledger.ts` | Modified | Compare bytes directly |
| Six test files | Modified | Schema, census, projection, envelope and gateway tests |
| `runtime/feature-catalog/script-entry-points/append-mode-event-script.md` | Modified | Name the accepted shape |
| `runtime/lib/event-envelope/README.md`, `runtime/scripts/README.md` | Modified | List `canonicalBytesEqual` and `append-mode-event.cjs`, found missing by a read-only audit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Claude wrote each change as a literal brief and DeepSeek V4.1 Flash at max effort applied it through cli-opencode in worktree 078, in three dispatches. Between dispatches Claude ran the typecheck and the suites, and after the second one sent a real record through the gateway, which is how the byte-comparison defect surfaced. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the gateway, not the agent, template and workflow | All three already describe the record; the gateway was the one out of step |
| One `record: json` field instead of an exact-field schema | The record's optional fields vary with review depth and executor |
| Wrap only `type:"iteration"` in review mode | Other legacy review rows keep their pinned refusal |
| Compare bytes element by element | Serializing bytes as JSON re-validated them as a document, one node per byte |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck | Clean before and after |
| Full runtime suite (159 files) | 2,852 passed, 5 failed, 8 skipped in 23 minutes. The 5 are 3 render-command-contract and 2 check-contract-drift tests, which fail the same way on main |
| Authorized-ledger concurrency test | Passed in the full run; failed once in an earlier targeted parallel run ("Ledger writer lock identity changed before release"); passed 3 of 3 alone and 111 of 111 with the envelope and ledger suites |
| Real records | 5 of 5 recorded, 5 of 5 projected deep-equal; main refuses the same records |
| Size boundary | Before: a 9,800-character string refused. After: records of 11 to 23 KB accepted |

Commands, run from `.skilled/skills/system-deep-loop/runtime/`: `npm run typecheck`, `npx vitest run tests/unit/event-envelope.vitest.ts tests/unit/authorized-ledger.vitest.ts` for the envelope and ledger suites, and `node scripts/append-mode-event.cjs --mode review` fed each real record for the round trip.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The canonical JSON limits still apply to the event itself** (10,000 nodes, depth 64, 1 MB). A review record beyond those is refused with that reason.
<!-- /ANCHOR:limitations -->

---
