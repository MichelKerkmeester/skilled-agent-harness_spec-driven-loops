---
title: "D6-R5 — DECISION RATIONALE proof lane"
description: "Add a conditional six-field DECISION RATIONALE lane across three sk-design homes — the context loading contract field shape + one HARD GATE row, a conditional fillable proof-card section, and an opt-in --require-decision-rationale flag with a validator in proof_check.py — so direction, pattern-break, and handoff work must record decision, options, evidence, trade-offs, a validation plan, and source proofs before the choice hardens."
trigger_phrases:
  - "d6-r5 decision rationale lane"
  - "decision rationale design build"
  - "proof check decision rationale flag"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/005-decision-rationale-lane"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record opt-in flag + enforce-presence vs soundness-advisory split"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D6-R5 — DECISION RATIONALE proof lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | hybrid |
| **Dimension** | D6 — Corpus Ports |
| **Feeds** | D3 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Direction-setting, pattern-breaking, and handoff design work is where unjustified choices ship: a worker picks a direction, breaks an established pattern, or hands rationale to the next context, and the reason for the choice lives only in transient prose, if anywhere. designer-skills-main's design-rationale skill defines a structured rationale shape — decision, options considered, evidence, trade-offs, validation — but sk-design had no machine-checkable lane that forced any of it to be recorded, so significant design choices could harden with their reasoning never captured.

### Purpose
Port the rationale shape into the design proof surface as a conditional six-field lane — `decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]` — so triggering work must record what was decided, what was weighed, what evidence informed it, the trade-offs accepted, a validation plan, and cited source proofs. Bind it to delivery through an opt-in `proof_check.py --require-decision-rationale` flag that fails closed on a missing or placeholder field when asserted, while leaving legacy reports and non-triggering work untouched.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the conditional six-field `DECISION RATIONALE` field shape (`decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]`) to `context_loading_contract.md` §4 REQUIRED PROOF FIELDS, plus one conditional row in the §5 HARD GATES table, naming the direction/pattern-break/handoff trigger
- Mirror the lane as a conditional fillable `## 9. DECISION RATIONALE` section on `proof_of_application_card.md` over the same six fields, with a gate-invocation note
- Extend `proof_check.py` with an opt-in `--require-decision-rationale` flag plus `_validate_decision_rationale` and `_find_decision_rationale_rows`, modeled on the existing `--require-application-witness` validator

### Out of Scope
- The default proof gate behaviour — unchanged; the new flag is opt-in and legacy reports degrade gracefully
- `audit_contract.md`, `mode-registry.json`, and `interface_preflight_card.md` — not touched by this lane
- The `--require-observation-triad` extension — a sibling adds it to `proof_check.py` after this lane; this is the first of two extensions and does not build the second

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modify | Append the six-field `### Decision Rationale` shape under §4 and one conditional row to the §5 HARD GATES table; additive, no existing field removed |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modify | Append the conditional fillable `## 9. DECISION RATIONALE` section over the six fields, with the opt-in gate-invocation note |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modify | Add the opt-in `--require-decision-rationale` flag, `_validate_decision_rationale`, and `_find_decision_rationale_rows`, cloning the application-witness validator; default gate unchanged |
| `.opencode/skills/sk-design/shared/audit_contract.md` | Unchanged | Out of scope; not edited |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Out of scope; not edited |
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Unchanged | Out of scope; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the six-field rationale shape to the contract | `context_loading_contract.md` §4 carries the `DECISION RATIONALE` field shape over `decision`, `optionsConsidered[]`, `evidenceSources[]`, `tradeoffs[]`, `validationPlan`, `sourceProofs[]`, with the direction/pattern-break/handoff trigger named; non-triggering work marks N/A |
| REQ-002 | Add one conditional rationale row to the §5 HARD GATES table | The §5 table carries a row blocking a direction/pattern-break/handoff claim before the six fields are recorded; every existing gate row unchanged |
| REQ-003 | Add the opt-in flag + validator to the checker, fail-closed when asserted | `proof_check.py --require-decision-rationale` exits non-zero on a missing/placeholder field; a complete six-field section passes; the default gate (no flag) is byte-behaviour-identical to before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Field set consistent across the contract, card, and checker | The same six field names appear in the contract shape, the proof-card rows, and the validator's canonical field set |
| REQ-005 | Existing flags + base gate non-regressed; evergreen + scope clean | `--require-source-proof` and `--require-application-witness` behave identically before and after; `py_compile` passes; no spec/packet/phase IDs in shipped files; only the three named files modified |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The six-field shape is present in `context_loading_contract.md` §4 plus the §5 HARD GATE row; the proof card carries `## 9. DECISION RATIONALE`; `proof_check.py` carries the opt-in `--require-decision-rationale` flag, `_validate_decision_rationale`, and `_find_decision_rationale_rows`.
- **SC-002**: Asserted, the validator bites — a complete six-field table returns `ok:True` with `missing:[]`; a table whose `validationPlan` row is absent returns `decision-rationale field missing: validationPlan` with `ok:False`; a report with no rationale section returns `decision-rationale rows missing` with `ok:False`.
- **SC-003**: The flag is opt-in and the default gate is unchanged — a legacy report without the section passes a plain run exactly as before; `--require-source-proof` and `--require-application-witness` are non-regressed; the contract and card are append-only (R4's interaction-state-matrix lane and existing fields preserved, 0 removed); `audit_contract.md`, `mode-registry.json`, and `interface_preflight_card.md` are untouched; the evergreen scan is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Whether a prompt is a triggering one (direction / pattern-break / handoff) is caller judgment | The checker cannot decide for a live prompt whether the lane applies | **Recorded as advisory.** The contract documents the trigger; live triggering stays caller judgment, and the flag is asserted only for triggering work |
| Risk | Whether the recorded options, trade-offs, and validation plan are SOUND is not machine-checkable | A present `validationPlan` is not a correct one | **Recorded as advisory.** The validator enforces field presence and well-formedness only; reasoning soundness stays a review judgment |
| Risk | A new required gate could break legacy reports | A non-opt-in gate would fail every report lacking the section | **Opt-in by design.** `--require-decision-rationale` is off by default; a legacy report degrades gracefully and passes a plain run unchanged |
| Dependency | The existing `--require-application-witness` validator | Green | The clone template for `_validate_decision_rationale` + `_find_decision_rationale_rows` and the flag wiring through `check()` / `main()` |
| Dependency | The SOURCE PROOF table convention | Green | `sourceProofs[]` points back to it by reference rather than redefining a source format |
| Dependency | Sibling `--require-observation-triad` extension to `proof_check.py` | Pending | This lane lands first; the sibling appends the second flag after it, so the checker carries them in order with no collision |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The port is additive — the contract gains the field shape and one gate row with nothing removed, the card gains one section, and the checker gains one validator and one opt-in flag; no existing field, gate, validator, or flag is altered.
- **NFR-I02**: For non-triggering work the lane is marked N/A and the surface behaves exactly as before; the flag is asserted only for triggering work.

### Consistency
- **NFR-C01**: `context_loading_contract.md` is the single place the field shape is defined; the proof card and the checker's canonical field set are projections of it, and the six field names are identical across all three homes.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Validator behaviour (asserted flag)
- **Complete six-field section**: every field present and non-placeholder → `ok:True`, `missing:[]`.
- **Single field absent** (e.g. `validationPlan` row removed): → `ok:False`, `missing` names the field (`decision-rationale field missing: validationPlan`).
- **Section present, all placeholders**: → `ok:False`, `missing` names every placeholder field.
- **No rationale section at all**: → `ok:False`, `missing:['decision-rationale rows missing']`.

### No-regression
- **Default gate (no flag)**: a legacy report carries no `decision_rationale` result and its `missing` set is unchanged; behaviour is identical pre- and post-build.
- **Existing flags**: `--require-source-proof` and `--require-application-witness` validators and their wiring are untouched and behave identically.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Three artifacts — one contract (six-field shape + one gate row), one proof card (one conditional fillable section), and one Python checker (one validator, one row finder, one opt-in flag threaded through `check()` and `main()`).
- **Risk concentration**: The only judgment-bearing surfaces are whether a live prompt triggers the lane and whether the recorded reasoning is sound; both stay advisory. Everything structural — field presence, well-formedness, cross-home field-set consistency, and fail-closed-when-asserted — is checkable by the validator. The blast radius is the design proof surface only; the audit contract, mode registry, and pre-flight card stay untouched, and the default gate is unchanged.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is field presence enforceable? **RESOLVED: Yes, when the flag is asserted.** `proof_check.py --require-decision-rationale` fails closed on a missing or placeholder field; a complete six-field section passes. Presence and well-formedness are code-enforced.
- Is rationale soundness enforceable? **RESOLVED: No — advisory.** Whether the recorded options, trade-offs, and validation plan are correct cannot be proven by the checker; a present `validationPlan` is not a correct one. Soundness stays a review judgment.
- Is live triggering enforceable? **RESOLVED: No — advisory.** Whether a given prompt is a direction/pattern-break/handoff one is caller judgment; the contract documents the trigger, but the flag is asserted by the caller, not inferred by the checker.
- Does the lane break legacy reports? **RESOLVED: No — opt-in, graceful degradation.** The flag is off by default; the default gate is byte-behaviour-identical, and a legacy report without the section passes a plain run unchanged.
- Is this the only checker extension? **RESOLVED: No — first of two.** A sibling adds `--require-observation-triad` to `proof_check.py` after this lane; this phase ships the decision-rationale flag only and does not build the observation triad.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Additive conditional six-field DECISION RATIONALE lane across the contract (§4 field shape + one §5 HARD GATE row), the proof card (## 9 conditional fillable), and proof_check.py (opt-in --require-decision-rationale flag + _validate_decision_rationale + _find_decision_rationale_rows)
- Honest split: field presence + well-formedness code-enforced when the flag is asserted; rationale soundness + live triggering advisory
- Opt-in by design: the default gate is unchanged and legacy reports degrade gracefully; first of two proof_check.py extensions (sibling adds --require-observation-triad later)
- Scope clean (3 files, append-only); audit_contract.md / mode-registry.json / interface_preflight_card.md untouched; GENERATED_METADATA regenerated by the orchestrator
-->
