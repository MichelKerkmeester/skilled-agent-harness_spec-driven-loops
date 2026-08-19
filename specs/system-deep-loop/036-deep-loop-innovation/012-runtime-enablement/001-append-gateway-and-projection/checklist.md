---
title: "Checklist: Append Gateway and Legacy Projection"
description: "Blocking verification contract for the append gateway: receipts, proven refusals, fenced concurrency, and a six-consumer reader contract on the projected legacy file."
trigger_phrases:
  - "append gateway checklist"
  - "reader contract verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking verification contract"
    next_safe_action: "Capture the runtime suite baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Projection-refresh failure mode after a durable append"
    answered_questions: []
---
# Checklist: Append Gateway and Legacy Projection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item stays pending until its evidence exists as a command output or a file, not as a claim. Two rules override
convenience here. A refusal test counts only after it has been observed failing with its guard removed. A suite result
counts only as a delta against the baseline captured before the first edit.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Runtime unit suite baseline captured with counts and any pre-existing failures before any source edit (SC-006)
- [ ] CHK-002 [P0] The six executable consumers of the legacy state file re-confirmed by search rather than assumed from this document (REQ-005, SC-005)
- [ ] CHK-003 [P1] Projection manifest entry for the target surface read and its refresh boundary noted (REQ-004)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The gateway composes existing substrate; fencing, authorization, and serialization are not re-implemented (REQ-003)
- [ ] CHK-005 [P0] No caller supplies actor, capability, or commit; bindings resolve from the environment (REQ-006)
- [ ] CHK-006 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids appear in code comments
- [ ] CHK-007 [P1] Refusals name the failing check rather than returning a bare boolean (REQ-002)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Append returns a receipt and the event reads back through the ledger's own read path (REQ-001, SC-001)
- [ ] CHK-009 [P0] Envelope refusal test passes and was observed red with its guard removed (REQ-002, SC-002)
- [ ] CHK-010 [P0] Authorization refusal test passes and was observed red with its guard removed (REQ-002, SC-002)
- [ ] CHK-011 [P0] Two racing appends both succeed, ledger totally ordered, no lost write (REQ-003, SC-003)
- [ ] CHK-012 [P1] Projection refresh occurs at the manifest's declared boundary (REQ-004)
- [ ] CHK-013 [P1] Chosen projection-failure mode implemented and tested
- [ ] CHK-014 [P0] Full suite re-run and reported as a delta against the captured baseline (SC-006)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-015 [P0] `fanout-run.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005)
- [ ] CHK-016 [P0] `fanout-merge.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005)
- [ ] CHK-017 [P0] `fanout-salvage.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005)
- [ ] CHK-018 [P0] `verify-iteration.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005)
- [ ] CHK-019 [P0] `reduce-state.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005)
- [ ] CHK-020 [P0] `divergent-research-pivot.ts` runs against a projected file; exit status recorded (REQ-005, SC-005)
- [ ] CHK-021 [P1] Any difference between a projected file and an agent-written one is enumerated and each difference justified (SC-004)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] No mode's authority state changed by this phase (REQ-008)
- [ ] CHK-023 [P0] No call site outside this phase invokes the gateway yet (REQ-008)
- [ ] CHK-024 [P0] The legacy writer remains canonical and untouched (REQ-008)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] The projection-failure decision is recorded with its reasoning rather than left implied by the code
- [ ] CHK-026 [P1] `implementation-summary.md` records the baseline, the delta, and the negative-control outcomes
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P2] New module lives under `runtime/lib/mode-append-gateway/` with an `index.ts` re-export
- [ ] CHK-028 [P2] Tests live in `runtime/tests/unit/` and match the suite's include pattern
- [ ] CHK-029 [P2] Evidence files live in this folder's `scratch/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-030 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-031 [P0] Every item above is `[x]` with evidence, or the phase is not complete
- [ ] CHK-032 [P0] The CLI entry point appends and projects without a TypeScript caller (REQ-007)
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | All stages complete, evidence written |
| Verifier | Re-ran the gates independently rather than reading the builder's report |
<!-- /ANCHOR:sign-off -->
