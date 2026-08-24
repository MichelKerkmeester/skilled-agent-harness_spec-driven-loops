---
title: "Feature Specification: Deep-Research Enablement"
description: "Migrate the deep-research write protocol onto the append gateway and move its authority to the typed ledger, proving the pattern end to end on the pilot mode before the fleet follows."
trigger_phrases:
  - "deep-research enablement"
  - "pilot mode authority move"
  - "protocol migration to gateway"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Drove the pilot flip and post-flip fan-out end to end; resolved directive handling by pinning"
    next_safe_action: "Proceed to 003-fleet-enablement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-pilot-flip.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No rollback window; the flip is direct and forward-only"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Deep-Research Enablement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | Authority moves in this phase, forward only |

> Phase adjacency under `012-runtime-enablement` (navigation order): predecessor `001-append-gateway-and-projection`;
> successor `003-fleet-enablement`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Deep-research state is produced by agents following prose. `references/state/state-jsonl.md` instructs leaf agents to
append records to `deep-research-state.jsonl` directly. Nothing validates those records, nothing serialises concurrent
leaves, and nothing issues a receipt. The typed ledger sits beside that file with no path into it.

Once the gateway exists, the protocol is the only thing still routing writes around it. A gateway nobody is told to
call changes nothing.

### Purpose

Make deep-research the first mode whose canonical writes go through the gateway, then move its authority to the typed
ledger. The pilot exists to find the problems that only appear on a live mode, while the blast radius is one mode
rather than seven.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the operator or
> a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness and robustness risk,
> not breach risk**.

### Non-Goals

- The other six modes. They follow in `003` once this pattern is proven.
- Deleting the direct-append instructions. They stop being canonical here and are removed in `004`.
- Any rollback mechanism. The operator ratified a direct flip with no rollback window.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update the deep-research state protocol so agents call the gateway instead of appending to the file.
- Wire the shared composition seam used by both deep-research command variants so the canonical persistence boundary
  resolves through the gateway.
- Capture shadow-parity evidence on live-shaped runs before the flip, and refuse to flip on divergence.
- Execute the authority move through `requestCutover` with bindings resolved from the environment.
- Prove the fan-out orchestration still works, because it reads the state file during a run and is the highest-traffic
  consumer.

### Out of Scope

- Other modes, legacy-writer deletion, the whole-system gate, and closeout documentation.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `deep-research/references/state/` | Protocol text now names the gateway |
| Deep-research composition seam | Resolves the persistence boundary through the gateway |
| Mode authority record | Moves from legacy to ledger, once |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Both deep-research command variants reach the same composition seam; no variant keeps a private path.
- **REQ-002**: The protocol documents direct agents to the gateway, with the direct-append instruction removed from the
  canonical path.
- **REQ-003**: Shadow parity is captured on live-shaped runs and shows zero divergence before the flip is requested.
- **REQ-004**: A divergent or stale parity result blocks the flip; it does not warn and continue.
- **REQ-005**: The flip is executed through `requestCutover`, with actor, capability, and commit resolved from the
  environment rather than supplied.
- **REQ-006**: The fan-out orchestration completes a real multi-leaf run after the flip.
- **REQ-007**: The legacy state file remains readable throughout, because six consumers depend on it.
- **REQ-008**: No other mode's authority record changes during this phase.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A census proves both command variants reach the seam, by execution rather than by reading imports.
- **SC-002**: A parity run on live-shaped input reports zero divergence, and a deliberately perturbed run reports
  divergence — the oracle is shown to be capable of failing.
- **SC-003**: The flip produces a transition event, one epoch, and one canonical route.
- **SC-004**: A real fan-out run completes after the flip, with its leaves writing through the gateway.
- **SC-005**: Every one of the six legacy-file consumers still runs after the flip.
- **SC-006**: No non-pilot mode's authority record differs from its pre-flip bytes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| The flip is irreversible by policy | A defect discovered after the flip must be fixed forward | Parity is a blocking pre-flip gate, and the fan-out proof runs on a real multi-leaf run rather than a fixture |
| Agents keep appending directly out of habit | Two writers, no ordering | The protocol's direct-append instruction is removed from the canonical path here, and enforced in `004` |
| Fan-out reads the state file mid-run | A live run breaks in a way fixtures would not show | SC-004 runs the real orchestration, not a stub |
| Parity oracle is narrower than believed | A green parity result that could not have gone red | SC-002 requires a perturbed run to actually diverge |

**Dependencies**: `001-append-gateway-and-projection` complete with its reader contract green.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The rollback policy is settled: direct flip, no window. Bindings resolve from the environment. The
remaining unknowns are implementation details that the census in Phase 1 will answer rather than decisions needing an
operator.
<!-- /ANCHOR:questions -->
