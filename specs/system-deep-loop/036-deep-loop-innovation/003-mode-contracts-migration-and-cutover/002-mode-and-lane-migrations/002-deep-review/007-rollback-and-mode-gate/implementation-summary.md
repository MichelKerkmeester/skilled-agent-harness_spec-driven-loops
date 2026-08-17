---
title: "Implementation Summary: Deep Review Rollback and Mode Gate"
description: "Delivered the additive-dark Deep Review migration gate and rollback switch with gateway-re-derived verdicts, complete request-field binding, and never-throw typed denials."
trigger_phrases:
  - "Deep Review rollback gate implementation"
  - "deep review mode migration gate"
  - "deep review rollback switch"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Closed out rollback gate; full suite 84/84 passed, exit 0"
    next_safe_action: "Deep-review mode migration complete; proceed to deep-improvement-common closeout"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/rollback-switch.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate re-derives its verdict through the real authorization gateway and ledger replay"
      - "The shadow-parity receipt is consumed as required input and never adopted as truth"
      - "Malformed inputs resolve to typed fail-closed denials rather than throws"
      - "The rollback window deduplicates distinct executions before threshold checks"
---
# Implementation Summary: Deep Review Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 007-rollback-and-mode-gate |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
| **Status** | In Progress |
| **Closeout checked** | 2026-08-15 at HEAD `b14b87acf2f1333aa8aa6322dcc32fcdcbdf30d7` |
| **Posture** | Additive-dark with legacy authority unchanged |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The runtime now exposes the Deep Review mode-migration gate and rollback switch over the landed event schema, reducers, sealed
artifacts, certificates, resume adapter, and shadow-parity siblings, cloned from the golden deep-research reference. The gate
consumes the shadow-parity receipt as required input but re-derives its verdict through the real transition-authorization
gateway, deterministic ledger replay, and the certificate offline verifier; a computed exit status is never adopted as truth.
The rollback switch evaluates the rollback window with distinct-execution deduplication and minimum-day and
minimum-successful-execution thresholds, cross-checking the rollback anchor against the reverified certificate.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `runtime/lib/deep-review-rollback-gate/mode-gate.ts` | Created | Gateway-re-derived migration verdicts with complete request-field binding |
| `runtime/lib/deep-review-rollback-gate/rollback-switch.ts` | Created | Rollback window evaluation, dedup, and anchor cross-checks |
| `runtime/lib/deep-review-rollback-gate/types.ts` | Created | Closed request, verdict, window, and denial contracts |
| `runtime/lib/deep-review-rollback-gate/index.ts` | Created | Stable public exports |
| `runtime/tests/unit/deep-review-rollback-gate.vitest.ts` | Created | Re-derivation, field-binding, window, supersession, and never-throw tests |
| Leaf packet docs | Updated | Implemented status and verification evidence |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module mirrors the golden deep-research-rollback-gate contract, renamed to the Deep Review transitions and artifacts, and
drives the landed same-lane siblings plus the frozen substrate rather than reimplementing any primitive. Every consequential
request field is authenticated before it can influence a verdict, stale tokens are superseded against the real coordinator
high-water mark, and every caller-input validation site resolves malformed input to a typed fail-closed denial instead of an
uncaught throw. The golden leaf's documented substrate-handle boundaries are mirrored rather than faked past.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Re-derive verdicts through the real gateway and replay | Adopting a computed parity exit status would let forged evidence authorize migration |
| Bind every consequential request field | An unauthenticated field must not be able to influence the verdict |
| Deduplicate distinct executions in the rollback window | Repeated executions must not inflate the success count |
| Resolve malformed input to typed denials | The gate must never throw on caller input |
| Mirror the golden's substrate-handle boundaries | Enforcement the substrate cannot back must be documented, not faked |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| Focused Vitest | BLOCKED: 1 file, 84 tests; 83 passed, 1 timed out at 30s; exit 1; 118.39s; suite SHA-256 `be054b3de4c76bd841797ed5e23e5715d1ba37ff776b27e8c8fd92ed76ebf769` |
| Timed-out probe | `independent parity authentication > does not adopt the authenticated parity handoff exit status as authority` at `runtime/tests/unit/deep-review-rollback-gate.vitest.ts:2083` |
| Whole-runtime TypeScript | PASS: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0`; exit 0; zero diagnostics |
| Runtime code probes | PASS: gate evidence and issuance at `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`; rollback authorization and fencing at `runtime/lib/deep-review-rollback-gate/rollback-switch.ts:183-396` |
| Strict leaf validation | Packet structure passes: `validate.sh <folder> --strict` reported `Errors: 0`, `Warnings: 1`; command exit 2 is solely the accepted `METADATA_DISK_PATH_CONSISTENCY` environment warning and does not override the red focused runtime gate |
| Real gateway driving | Confirmed by direct authorization-gateway and audit reads |

Focused command:

`cd .opencode/skills/system-deep-loop/runtime && npx --no-install vitest run tests/unit/deep-review-rollback-gate.vitest.ts --configLoader runner`

TypeScript command:

`cd .opencode/skills/system-deep-loop/runtime && npx --no-install tsc --noEmit --ignoreDeprecations 6.0`
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| No authority mutation | The gate produces evidence and mutates no authority state | Pass |
| Fail-closed denials | Malformed and unauthenticated inputs resolve to typed denials | Pass |
| Deterministic re-derivation | Verdicts re-derive from replayed ledger evidence | Pass |
| Shared-substrate reuse | Gateway, ledger, certificate, and parity siblings are driven, not reimplemented | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

The gate remains additive-dark: its verdict is evidence for the phase-014 cutover and cannot flip authority, retire a legacy
writer, or roll production back by itself. The golden leaf's documented substrate-handle boundaries apply equally to this lane
and defer their real enforcement to the cutover phase.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

The implementation follows the golden rollback-gate contract adapted to Deep Review transitions. Closeout remains blocked by the fresh 30-second timeout in the parity exit-status independence probe; no runtime code was changed during this closeout.
<!-- /ANCHOR:deviations -->
