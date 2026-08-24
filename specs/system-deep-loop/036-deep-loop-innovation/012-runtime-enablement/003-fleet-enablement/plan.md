---
title: "Implementation Plan: Fleet Enablement"
description: "Plan for a resumable serial driver that enables the six remaining deep-loop modes with per-mode parity gates and stop-on-first-failure."
trigger_phrases:
  - "fleet enablement plan"
  - "serial enablement driver"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/003-fleet-enablement"
    last_updated_at: "2026-08-24T08:00:07Z"
    last_updated_by: "claude"
    recent_action: "Built the driver, CLI and both suites; 12 guards proven by negative control"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "No mode can reach cutover_ready, so no mode can be enabled"
      - "deep-improvement-common has no working name on the append CLI"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/fleet-enablement/enablement-driver.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/enable-modes.cjs"
    completion_pct: 65
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fleet Enablement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Six mode protocol sets, six composition seams, six authority records, one new driver |
| **Change class** | Repetition of a proven procedure, automated |
| **Authority** | Moves for six modes, one at a time, forward only |
| **Blast radius** | High in aggregate, bounded per step by stop-on-first-failure |

The engineering here is in the driver's failure behaviour, not in the per-mode work. The per-mode work is already
known from the pilot.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Blocking |
|------|---------|----------|
| Predecessor | `002` checklist fully `[x]` with evidence | Yes |
| Dry run | Driver reports per-mode intent, changes nothing | Yes |
| Injected failure | Driver stops; later modes provably untouched | Yes |
| Resume | Remaining modes enabled without re-flipping earlier ones | Yes |
| Per-mode reader contracts | Each mode's manifest-derived readers pass | Yes |
| Final state | All seven authority records read as ledger | Yes |
| Spec validation | `validate.sh <this folder> --strict` Errors: 0 | Yes |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The driver is a loop over an ordered mode list. Each iteration performs the pilot's procedure for one mode: migrate
the protocol, wire the seam, capture parity, gate, flip, verify readers.

Two design choices carry the weight.

**State is external.** The driver records per-mode outcome as it goes, so a stop is resumable and a resumed run knows
which modes are already done. Without this, a failure on mode four means re-running modes one to three, and re-flipping
an already-flipped mode is not a no-op.

**Failure stops the loop.** Continuing past a failure would leave a fleet in a state nobody can describe: some modes on
ledger, some on legacy, one half-migrated. Stopping leaves a state that is unpleasant but exactly known.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the projection manifest and derive each mode's reader set from its own entries; treat a mode with no entry as a failure to investigate, not as a mode with nothing to project.
- Fix and record the mode order.
- Capture the pre-run authority record bytes for all seven modes.

### Phase 2: Implementation
- Build the driver loop with external per-mode state and stop-on-first-failure.
- Implement the per-mode step as the pilot's procedure, parameterised by mode.
- Add a dry-run path that reports per-mode intent and touches no authority record.
- Ensure each call requests exactly one mode, so `MULTI_MODE_REQUEST_REJECTED` is never reachable from the driver.

### Phase 3: Verification
- Dry run over all six modes; confirm no authority record changed.
- Inject a failure on one mode; confirm the driver stops and that later modes' records are byte-identical to the pre-run capture.
- Resume; confirm the remaining modes enable and the earlier ones are not re-flipped.
- Run each mode's reader contract against its own projected files.
- Read all seven authority records independently and confirm ledger authority.
- Confirm the completed run required no operator input.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The injected-failure test is the one that matters. A driver that works when everything works is not evidence of
anything; the question is what it leaves behind when mode four fails. That test asserts on the bytes of the untouched
modes' records, not on the driver's own log, because the log is the thing under test.

The dry run is checked the same way: by comparing authority records before and after, not by reading what the driver
printed.

Per-mode reader contracts are run per mode. Reusing the pilot's consumer list across the fleet would test the pilot six
times.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | State | Note |
|------------|-------|------|
| `002-deep-research-enablement` | Predecessor | Supplies the proven per-mode procedure |
| Projection manifest | Landed | Source of each mode's reader set |
| `AuthorityFlipCoordinator` | NOT wired | Assumed wired by the pilot; it has no production caller, so the serial constraint it would enforce is unenforced |
| Mode registry | Landed | Source of the canonical mode list |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

None, by operator decision — the same forward-only policy as the pilot.

What replaces it is the stop-on-first-failure behaviour. A rollback would restore a previous state; stopping preserves
a known one. The distinction matters because the recovery action for a mid-fleet failure is to fix the cause and resume,
and resuming from a known partial state is tractable in a way that unwinding six flips would not be.
<!-- /ANCHOR:rollback -->
