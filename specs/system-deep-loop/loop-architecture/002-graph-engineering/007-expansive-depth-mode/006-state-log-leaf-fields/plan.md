---
title: "Implementation Plan: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "Widen the research upcast, ledger schema, type and projection so route-proof, telemetry, findingsCount and keyQuestions reach the state log, as the operator decided on 2026-11-17. This switches the findings gate and the focusAlignment guard on for every research run."
trigger_phrases:
  - "state log leaf fields plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ledger schema, upcast, projection); the CommonJS consumers (`verify-iteration.cjs`, `convergence.cjs`) are read, not changed |
| **Framework** | system-deep-loop runtime, append-only ledger with legacy JSONL projections |
| **Storage** | JSONL files: `deep-research-state.jsonl`, `deltas/iter-NNN.jsonl`, the research ledger |
| **Testing** | Vitest, run from `.skilled/skills/system-deep-loop/runtime` with `npm test -- <file>` |

### Overview
The operator chose to widen the upcast (`decision-record.md` ADR-001, 2026-11-17). The plan carries `findingsCount`, `keyQuestions` and the route-proof and telemetry fields through the four-point drop chain so they land on the state-log row. A new findings-gate case and a new `focusAlignment` case prove the two checks now run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `decision-record.md` ADR-001 is `Accepted` with option 1 named
- [ ] The four drop-chain sites still match `legacy-compatibility.ts:643-660`, `deep-research-ledger-schema.ts:657-660`, `deep-research-ledger-types.ts:185-200`, `deep-research-contract.ts:312-325`
- [ ] The REQ-007 suites pass on the unchanged tree (baseline captured)

### Definition of Done
- [ ] Every P0 requirement in `spec.md` is met
- [ ] `npm test -- tests/unit/verify-iteration.vitest.ts tests/integration/convergence-script.vitest.ts` passes with the two new cases
- [ ] The REQ-007 suites pass, and the delta against the baseline is reported
- [ ] Changelog entry written (REQ-008)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ledger upcast and projection.

### Key Components
- **Research upcast** (`legacy-compatibility.ts`): without the change it keeps five inputs and drops every other leaf field.
- **Ledger stem rule and type** (`deep-research-ledger-schema.ts`, `deep-research-ledger-types.ts`): `isData` checks exact fields (`hasExactFields`, :1060), so a field the stem rule does not list fails validation and the upcast change alone would be rejected.
- **Projection writer** (`legacy-projections/deep-research-contract.ts`): it writes a fixed ten-key row, so new data fields would never reach the state log without it.
- **Consumers** (`verify-iteration.cjs` gate at :533, `convergence.cjs` guard at :871): unchanged; they read the projected state row, which now carries the fields.

### Data Flow
Leaf writes the narrative, a delta row and a state record. The gateway appends the record through the upcast to the ledger, and the projection rebuilds `deep-research-state.jsonl`. After the change the extra fields survive every step and the two consumers read them from the state log.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the operator's decision in `decision-record.md` and captures the REQ-007 baseline. Implementation edits the upcast, stem rule, type and projection. Verification runs the two new cases, the REQ-004 regression fixture and the REQ-007 suites. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Proving tests from parent `research.md` §20 Slice F: `append-mode-event-cli`, `append-mode-event-legacy-seam`, `check-projection-coverage` and `deep-research-projections-contract`, plus two new cases: route-proof survival and findings-gate-runs. This plan adds the `focusAlignment` case because REQ-003 needs it. Before merge, replay this packet's generation-2 deltas through `verify-iteration` and the convergence guard to see how often the newly live checks fire on real leaf output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator decision on parent §12 item 6 is recorded (ADR-001 Accepted, option 1). No other slice must land first. Slice J (`../010-research-frontier-mode/`) waits on this one.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: research runs start failing verification or blocking stops at a rate the replay did not predict. Revert the slice's commit. Ledgers written while the change was live carry extra optional fields, which the old narrow schema rejects through the same exact-field check, so the revert must keep the stem rule tolerant of those fields.
<!-- /ANCHOR:rollback -->

---
