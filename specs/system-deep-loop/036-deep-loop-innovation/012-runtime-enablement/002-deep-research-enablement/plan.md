---
title: "Implementation Plan: Deep-Research Enablement"
description: "Plan for migrating the deep-research write protocol onto the append gateway, proving shadow parity on live-shaped runs, and executing the pilot authority move."
trigger_phrases:
  - "deep-research enablement plan"
  - "pilot flip plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Executed the plan through the pilot flip and post-flip fan-out on real evidence"
    next_safe_action: "Proceed to 003-fleet-enablement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No rollback window; forward-only"
---
# Implementation Plan: Deep-Research Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Deep-research protocol documents, composition seam, mode authority record |
| **Change class** | Protocol migration plus one irreversible authority move |
| **Authority** | Legacy until the parity gate passes; ledger afterwards, permanently |
| **Blast radius** | High: deep-research is a live mode driving multi-model fan-out runs |

This is the phase where the substrate stops being dark. Everything before it was additive.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Blocking |
|------|---------|----------|
| Predecessor | `001` checklist fully `[x]` with evidence | Yes |
| Suite baseline and delta | `npx vitest run` before and after, compared | Yes |
| Parity, positive | Live-shaped run reports zero divergence | Yes |
| Parity, negative control | Perturbed run reports divergence | Yes — a green that cannot go red is not evidence |
| Fan-out proof | A real multi-leaf run completes post-flip | Yes |
| Reader contract | All six consumers still run | Yes |
| Spec validation | `validate.sh <this folder> --strict` Errors: 0 | Yes |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two things change and they are deliberately separated in time.

First the **write path**: the protocol stops telling agents to append to the file and starts telling them to call the
gateway. At this point the mode is still legacy-authoritative — the gateway writes to the ledger, the projection keeps
the file current, and parity can compare the two.

Then the **authority**: once parity is green on live-shaped runs, `requestCutover` moves the mode's canonical route to
the ledger. The projection continues, so the file stays readable; what changes is which side is the source of truth.

Separating them is what makes the parity gate meaningful. If authority moved at the same moment the write path did,
there would be no window in which both sides are populated and comparable.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Census both deep-research command variants by execution, and identify the one shared composition seam they both reach.
- Capture the runtime suite baseline and the pre-flip bytes of every mode's authority record.
- Confirm the predecessor's reader contract is green against the current projection, not against an older run.

### Phase 2: Implementation
- Route the seam's canonical persistence boundary through the gateway.
- Rewrite the protocol documents so the canonical instruction is to call the gateway; remove the direct-append instruction from the canonical path.
- Run live-shaped deep-research runs with both writers active and collect shadow-parity evidence.
- Perturb one side deliberately and confirm parity reports divergence, then discard the perturbation.
- Execute `requestCutover` for `deep-research` only, with bindings resolved from the environment.

### Phase 3: Verification
- Confirm the transition produced one event, one epoch, and one canonical route.
- Run a real multi-leaf fan-out to completion and confirm leaves wrote through the gateway.
- Re-run all six legacy-file consumers and record exit statuses.
- Diff every non-pilot authority record against its pre-flip bytes.
- Re-run the full suite and report the delta; run strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The load-bearing test here is not a unit test. It is a real fan-out run, because fan-out is the consumer that reads
the state file while it is being written, and because fixtures have already been shown to hide problems that live runs
surface.

The parity negative control matters as much as the parity result. A parity oracle that reports zero divergence because
its comparison surface is too narrow reads exactly like a healthy one. Perturbing a side and requiring divergence is
the cheapest way to tell the two apart, and this epic has already produced one finding of precisely that kind.

Unit coverage follows the gateway phase's pattern: refusals proven by negative control, suite results reported as a
delta against a captured baseline.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | State | Note |
|------------|-------|------|
| `001-append-gateway-and-projection` | Predecessor | Must be complete with the reader contract green |
| Shadow-parity framework | Landed | Verified independent on all six modes earlier in this epic |
| `AuthorityFlipCoordinator` | Landed, unwired | This phase is its first real caller |
| Cutover binding resolver | Landed | Supplies actor, capability, and commit |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

There is none, by operator decision. The flip is direct and forward-only: no rollback window, no dual-authority
period, no restoration drill.

That is a deliberate trade. It removes the coordination burden of maintaining two authoritative paths, and it moves
all the safety budget into the pre-flip gates. The practical consequence is that the parity gate and the fan-out proof
are not advisory — they are the entire safety margin, and a failure in either stops the phase rather than triggering a
recovery procedure.

If a defect appears after the flip, the response is a forward fix in a new phase, not a reversal.
<!-- /ANCHOR:rollback -->
