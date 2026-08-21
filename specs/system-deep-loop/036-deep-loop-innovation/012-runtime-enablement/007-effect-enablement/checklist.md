---
title: "Checklist: Effect Enablement"
description: "Blocking verification contract for the fail-closed effect producer: intent-before-spawn, the fail-closed negative control, coverage reading real records, and no regression."
trigger_phrases:
  - "effect enablement checklist"
  - "fail-closed producer verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/007-effect-enablement"
    last_updated_at: "2026-08-21T15:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the blocking verification contract"
    next_safe_action: "Execute CHK-001 baseline and CHK-002 contract read"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Effect Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

The safety property is that a real dispatch cannot happen without a preceding durable effect intent. No item here is
advisory. The fail-closed result counts only when a perturbed durable append has been shown to make the same seam spawn
zero children.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Runtime suite baseline captured before any edit (SC-004)
- [ ] CHK-002 [P0] The effect-ledger id the reader expects and the intent payload shape are read from the shipped contracts, not guessed (REQ-005)
- [ ] CHK-003 [P0] A bare dispatch today is confirmed by execution to write zero effect records, and the reader refuses over the absent ledger (REQ-005)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] A durable effect-intent record is written before the spawn crosses the process boundary (REQ-001)
- [ ] CHK-005 [P0] An effect-confirmation record is written after the dispatch settles, sharing the intent's effect id (REQ-002, REQ-004)
- [ ] CHK-006 [P0] On a failed durable intent append, no child process is spawned; the refusal is loud and structured (REQ-003)
- [ ] CHK-007 [P1] The edit to the 007-owned dispatch file is confined to effect recording; no unrelated hot-path behavior is added (REQ-007)
- [ ] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] A real dispatch writes exactly one intent and one confirmation sharing an effect id, proven by reading the ledger (SC-001)
- [ ] CHK-010 [P0] The intent's sequence precedes the spawn on a real dispatch (REQ-001)
- [ ] CHK-011 [P0] Fail-closed negative control: perturbing only the durable append spawns zero children; restoring spawns one; both outcomes recorded (SC-002)
- [ ] CHK-012 [P0] The restart-facts reader over the populated ledger returns non-empty coverage instead of the empty-list pass (SC-003)
- [ ] CHK-013 [P1] Full suite re-run and reported as a delta against the baseline (SC-004)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-014 [P0] The best-effort receipt pair around the spawn is unchanged in behavior (REQ-006)
- [ ] CHK-015 [P1] No effect record is written where no real external action occurs — the producer sits at the spawn, not a ledger append (SC-001)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P0] The fail-closed refusal cannot be bypassed by a caller: no dispatch path reaches the spawn without the durable intent (REQ-003)
- [ ] CHK-017 [P1] The perturbation used for the negative control is fully discarded; no source change remains (SC-002)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-018 [P1] `implementation-summary.md` records the intent/confirm evidence, the fail-closed negative control, and the coverage proof
- [ ] CHK-019 [P2] The cross-packet authorization is recorded so the owning packet's next reader understands why the file changed here
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-020 [P2] Evidence files live in this folder's `scratch/`
- [ ] CHK-021 [P2] The scoped diff touches only the seam, its effect-ledger construction, and the tests (SC-005)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-022 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-023 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Producer wired, fail-closed proven, evidence written |
| Verifier | Re-ran the negative control and the coverage proof independently |
<!-- /ANCHOR:sign-off -->
