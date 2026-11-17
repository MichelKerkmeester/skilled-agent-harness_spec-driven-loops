---
title: "Implementation Plan: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "Widen the research upcast, ledger schema, type and projection so route-proof, telemetry, findingsCount and keyQuestions reach the state log, as the operator decided on 2026-11-17. This switches the findings gate and the focusAlignment guard on for every research run, so the guard is scoped to the latest record and tolerates a question-id prefix."
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
| **Language/Stack** | TypeScript (ledger schema, upcast, projection); CommonJS consumers. `convergence.cjs` changes its `focusAlignment` scope and comparison; `verify-iteration.cjs` changes one comment and one warning string only |
| **Framework** | system-deep-loop runtime, append-only ledger with legacy JSONL projections |
| **Storage** | JSONL files: `deep-research-state.jsonl`, `deltas/iter-NNN.jsonl`, the research ledger |
| **Testing** | Vitest, run as `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/<path>` |

### Overview
The operator chose to widen the upcast (`decision-record.md` ADR-001, 2026-11-17). The plan carries the ten REQ-005 fields through the four-point drop chain so they land on the state-log row, adds `findingsCount` and `keyQuestions` to the prompt pack's record shape, and makes the `focusAlignment` guard recoverable and prefix-tolerant. Cases prove the two checks now run, that route proof survives the projection, and that each reducer consumer behaves as stated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `decision-record.md` ADR-001 is `Accepted` with option 1 named
- [ ] The four drop-chain sites still match `legacy-compatibility.ts:643-660`, `deep-research-ledger-schema.ts:657-660`, `deep-research-ledger-types.ts:185-200`, `deep-research-contract.ts:312-325`
- [ ] The REQ-006 suites pass on the unchanged tree (baseline captured)
- [x] The `../013-no-redispatch-landed-iteration/` open question on landed-iteration redispatch reasons is decided, or 013 is scheduled after this phase (decided 2026-11-17, 013 ADR-001)

### Definition of Done
- [ ] Every P0 requirement in `spec.md` is met
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/append-mode-event-cli.vitest.ts tests/unit/append-mode-event-legacy-seam.vitest.ts tests/unit/check-projection-coverage.vitest.ts tests/unit/deep-research-projections-contract.vitest.ts tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/verify-iteration.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/prompt-pack.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/integration/convergence-script.vitest.ts` passes with the new cases, and the delta against the baseline is reported
- [ ] The research compiled contract is regenerated, and `check-contract-drift` passes
- [ ] Changelog entry written (REQ-007) and the playbook scenario written (REQ-012)
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
- **Prompt pack record shape** (`prompt-pack-iteration.md.tmpl:66`): today it names neither `findingsCount` nor `keyQuestions`, while the agent's shape (`.skilled/agents/deep-research.md:246`) names both. It gains both, with `keyQuestions` as the exact strategy text.
- **Consumers**:
  - `verify-iteration.cjs` findings gate (:533-550): logic unchanged, now fed. Its route-proof comment (:498-501) and warning (:567) are reworded.
  - `convergence.cjs` `focusAlignment` (:871-885): changed to evaluate only the latest record that carries both lists and to compare normalized text with a leading question-id prefix removed.
  - Research reducer (`deep-research/scripts/reduce-state.cjs`): unchanged, newly fed at :2492-2496 (single key question resolves it), :1737-1742 and :1986 (`sourcesQueried`) and :2948-2950 (dashboard columns).

### Data Flow
Leaf writes the narrative, a delta row and a state record. The gateway appends the record through the upcast to the ledger, and the projection rebuilds `deep-research-state.jsonl`. After the change the REQ-005 fields survive every step and the consumers read them from the state log.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms the decision record and captures the REQ-006 baseline. Implementation edits the upcast, stem rule, type and projection, the pack record shape, the `focusAlignment` guard and the stale `verify-iteration` text, then regenerates the research compiled contract as its last step. Verification adds the cases, reruns the suites, replays the generation-2 deltas, and writes the changelog entry and the playbook scenario. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Proving tests from parent `research.md` §20 Slice F: `append-mode-event-cli`, `append-mode-event-legacy-seam`, `check-projection-coverage` and `deep-research-projections-contract`, plus two new cases: route-proof survival (REQ-008) and findings-gate-runs (REQ-002). This plan adds the `focusAlignment` failed, recovery and prefixed-shape cases (REQ-003, REQ-009, REQ-004), one case per reducer consumer (REQ-010) and a record-shape case in `prompt-pack.vitest.ts` (REQ-011). Every run uses `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/<path>`. Before merge, replay this packet's generation-2 deltas through `verify-iteration` and the convergence guard to see how often the newly live checks fire on real leaf output.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator decision on parent §12 item 6 is recorded (ADR-001 Accepted, option 1). No slice must land first by contract, but this phase builds after `../001-completed-run-extension/` on the four ledger files, and the `../013-no-redispatch-landed-iteration/` open question was decided on 2026-11-17 (013 ADR-001: `findings_not_enumerated` skips the redispatch), because making `findings_not_enumerated` live would otherwise bring back the redispatch 013 removes. The template and the research compiled contract are shared with `../005-prompt-pack-contract-alignment/` and `../010-research-frontier-mode/`: regenerate the contract after each merge. Slice J (`../010-research-frontier-mode/`) waits on this one.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: research runs start failing verification or blocking stops at a rate the replay did not predict. Revert the slice's commit and regenerate the research compiled contract. Ledgers written while the change was live carry extra optional fields, which the old narrow schema rejects through the same exact-field check, so the revert must keep the stem rule tolerant of those fields.
<!-- /ANCHOR:rollback -->

---
