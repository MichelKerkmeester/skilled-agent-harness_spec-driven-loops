---
title: "Feature Specification: Mode Projection Contracts"
description: "Build the missing legacy-projection contracts for the nine mode-owned census surfaces, so every retired direct-append writer is replaced by a ledger-fold projection that keeps its legacy file current for the consumers that still read it."
trigger_phrases:
  - "mode projection contracts"
  - "legacy projection coverage"
  - "projection contract build"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
    last_updated_at: "2026-08-23T06:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built six ledger-fold projection contracts; reclassified three non-foldable surfaces"
    next_safe_action: "Proceed to 004-legacy-writer-retirement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-surface-fold.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-projection-coverage.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Only mode-owned surfaces block writer retirement; the twelve infrastructure surfaces do not"
      - "Three mode-owned surfaces are reducer output or operator input, not ledger folds"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Mode Projection Contracts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-23 |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves; a losing writer gains its projection replacement |

> Phase adjacency under `012-runtime-enablement`: this child was created after `003-fleet-enablement` moved
> every mode to ledger authority, when the fleet's own reader-contract requirement (each mode's legacy files
> must be produced by its projection) was found unmet for every mode except the pilot. It is a prerequisite
> for `004-legacy-writer-retirement`.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The fleet flip moved all eight modes to ledger authority, but the projection library ships exactly one
contract — `research-state`. The projection coverage checker names nine mode-owned census surfaces as
projectable-but-uncovered. A surface with no contract is never refreshed from the ledger: an append for that
mode records the event but leaves its legacy file untouched. The consumers that still read those legacy files
directly — `reduce-state.cjs` reads `deep-review-state.jsonl`, and its siblings read the alignment,
council, and improvement files — would read a stale or absent file the moment its direct-append writer is
retired. The retirement phase cannot proceed safely against a surface whose replacement does not exist.

### Purpose

Build a real projection contract for each of the nine mode-owned uncovered surfaces, so that after its
direct-append writer is retired the same legacy file is produced from the ledger, byte-for-byte compatible
with the consumer that reads it.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** In every confirmed case the actor is the
> operator or a stale local file, not a remote attacker. Read every P0 and P1 below as **cutover-readiness
> and robustness risk, not breach risk**.

### Non-Goals

- Changing any mode's authority record. Authority moved in `003`; this phase touches no record.
- Building contracts for the twelve infrastructure surfaces (fanout, loop-guard, observability, compiled
  command manifest, and the like). Their writers are not mode-owned and are out of the retirement's scope.
- Retiring any writer or editing any protocol document. That is `004`.
- Migrating consumers to read the ledger. The design keeps legacy files as the consumer-facing surface,
  produced by the projection.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `LegacyProjectionContract` factory for each of the nine mode-owned uncovered surfaces, folding that
  mode's ledger events into the exact legacy row/file shape its consumer parses.
- Registration of each new contract in the projection coverage checker's covered set and the library index.
- A test per contract that folds synthetic ledger events and asserts the projected bytes, and a proof that
  the real consumer reads the projected file and reduces it without corruption.

### Out of Scope

- Infrastructure-owned surfaces, writer retirement, protocol-document edits, and the whole-system gate.

### Affected Surfaces

| Surface | Change |
|---------|--------|
| `lib/legacy-projections/` | Nine new contract factories, exported from the index |
| `scripts/check-projection-coverage.cjs` | Nine surfaces move from the uncovered set to the covered set |
| `tests/unit/` | A materialization + real-consumer test per contract |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Each of the nine mode-owned uncovered surfaces has a real, exported projection contract factory.
- **REQ-002**: Each contract folds its mode's ledger events into the legacy file shape its consumer parses.
- **REQ-003**: The real consumer reads the projected file and reduces it without a corruption warning.
- **REQ-004**: The coverage checker reports the nine surfaces as covered, with the mode-owned uncovered count at zero.
- **REQ-005**: Each contract is proven by a materialization test that folds events and asserts the projected bytes.
- **REQ-006**: Each contract's identity fields (foldId, serializerId, legacyWriter, readers) agree with its manifest row.
- **REQ-007**: No authority record changes during this phase.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-projection-coverage.cjs` reports `modeOwned.uncovered` as `0`.
- **SC-002**: For each surface, a materialization test folds synthetic events and asserts the exact projected bytes.
- **SC-003**: For each surface, the real consumer runs against the projected file and reports no corruption.
- **SC-004**: Every new contract's identity fields match its manifest row, proven by the contract-manifest agreement check.
- **SC-005**: All authority records are byte-identical to their pre-phase state.
- **SC-006**: The runtime suite's failed-test count does not increase against the captured baseline.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Consequence | Mitigation |
|------|-------------|------------|
| A contract's row shape is plausible but wrong | The consumer reads the projected file and mis-reduces or warns | SC-003 runs the real consumer, not a mirror of it, against the projected file |
| A contract passes its own test but never runs on a real append | A green that cannot observe the append path | The materialization test drives the same fold the gateway uses, and the coverage checker proves the surface is wired |
| A mixed-format surface has several files under one row | One file is projected, another silently is not | The contract enumerates every file the manifest path template names |

**Dependencies**: `003-fleet-enablement` (all modes on ledger authority). Blocks `004-legacy-writer-retirement`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None requiring an operator. Whether a mixed surface's files share one fold or need several is an
implementation choice recorded per surface in the summary.
<!-- /ANCHOR:questions -->
