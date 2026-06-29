---
title: "D6-R4 — INTERACTION STATE MATRIX proof lane"
description: "Port the nine-part interaction state matrix (states/events/transitions/forbidden/guards/uiByState/recovery/a11y/reducedMotion) into three mirrored homes — the context loading contract field shape + one HARD GATE row, a conditional fillable proof-card section, and a binary interface pre-flight section feeding the verdict — so a stateful surface must model its interaction states before a ship/ready/done claim."
trigger_phrases:
  - "d6-r4 interaction state matrix"
  - "interaction state design build"
  - "stateful ui proof lane design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/004-interaction-state-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record presence-enforceable vs triggering/modeling-advisory split"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D6-R4 — INTERACTION STATE MATRIX proof lane

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
| **Feeds** | D1 |
| **Completed** | 2026-06-29 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Stateful UI work — loading, error, empty, disabled, multi-step, optimistic-update flows — is where craft most often leaks: an interface looks finished at the happy path and falls apart at the error, empty, or pending state. sk-design covered interaction states only as prose inside interface/harden/polish craft; there was no checkable lane that forced a stateful surface to enumerate its states, prove every event has a defined transition, and prove every error has a way out. designer-skills-main's state-machine skill supplies the missing modeling shape (states / events / transitions / forbidden / guards) that sk-design otherwise carries only as implicit craft.

### Purpose
Port the nine-part matrix shape into three mirrored homes so interaction-state coverage becomes a fillable, binary-checkable conditional lane rather than implicit craft, and bind a stateful surface's ship/ready/done claim to a modeled matrix through the existing Interface Pre-Flight HARD gate.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the nine-part `INTERACTION STATE MATRIX` field shape (states / events / transitions / forbidden / guards / uiByState / recovery / a11y / reducedMotion) to `context_loading_contract.md` §4 REQUIRED PROOF FIELDS, plus one conditional row in the §5 HARD GATES table
- Mirror the lane as a conditional fillable `## 8. INTERACTION STATE MATRIX` section on `proof_of_application_card.md` (fill only for stateful surfaces)
- Mirror the lane as a binary `## 11. INTERACTION STATE MATRIX` section on `interface_preflight_card.md` whose boxes feed the verdict, and renumber the existing VERDICT section 11 → 12

### Out of Scope
- `mode-registry.json` trigger aliases — a named deferred follow-up; the trigger cues live in the contract as documented vocabulary, not new registry aliases
- A per-state-machine auto-parser in `proof_check.py` — a named deferred follow-up, deliberately not built this phase
- `context_loaded_card.md` and the audit/foundations cards — out of scope, untouched

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modify | Add the nine-part matrix field shape under §4 REQUIRED PROOF FIELDS and one conditional row in the §5 HARD GATES table; additive, no existing field removed |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modify | Add a conditional fillable `## 8. INTERACTION STATE MATRIX` section over the same nine dimensions, marked stateful-only |
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Modify | Add a binary `## 11. INTERACTION STATE MATRIX` section feeding the verdict; renumber the existing VERDICT section to `## 12` — the only existing-text edit |
| `.opencode/skills/sk-design/mode-registry.json` | Unchanged | Out of scope; not edited |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Unchanged | Out of scope; not edited; auto-parser deferred |
| `.opencode/skills/sk-design/shared/assets/context_loaded_card.md` | Unchanged | Out of scope; not edited |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the nine-part matrix field shape to the contract | `context_loading_contract.md` §4 carries the `INTERACTION STATE MATRIX` field shape over states / events / transitions / forbidden / guards / uiByState / recovery / a11y / reducedMotion, in the same fenced form as the existing conditional proof blocks |
| REQ-002 | Add one conditional matrix row to the §5 HARD GATES table | The §5 table carries a matrix row blocking a stateful surface's ship/ready/done claim before its states/transitions/guards/recovery/reduced-motion handling are modeled; non-stateful surfaces mark N/A; every existing gate row unchanged |
| REQ-003 | Mirror the lane on both cards, binary boxes feeding the verdict | The proof card has the conditional `## 8` section; the pre-flight card has the binary `## 11` section feeding the SHIP/FIX verdict; the existing VERDICT renumbered to `## 12` without dropping, adding, or rewording any box in §1-§10 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Field set consistent across all three homes | The nine-part field set is identical across the contract shape, the proof-card rows, and the pre-flight boxes |
| REQ-005 | Evergreen + scope clean | No spec/packet/phase IDs or spec paths in any of the three shipped files; only the three named files modified; `mode-registry.json`, `proof_check.py`, and `context_loaded_card.md` untouched |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The nine-part matrix shape is present in `context_loading_contract.md` §4 plus the §5 HARD GATE row; the proof card carries `## 8. INTERACTION STATE MATRIX`; the pre-flight card carries the `## 11` matrix section; the pre-flight VERDICT is now `## 12`.
- **SC-002**: The only edit to existing text is the VERDICT 11 → 12 renumber on the pre-flight card (§1-§10 verbatim, no other section renumbered); the contract change is purely additive (0 lines removed).
- **SC-003**: `hubRoute` holds 28/23/5/0 — the contract and the two cards are not hubRoute fixture sources, so routing replay is unaffected; the evergreen scan is clean; and the change set is the three in-scope files only.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Whether a surface is "stateful enough" to trigger the lane is caller judgment | The gate cannot decide for a live prompt whether the lane applies | **Recorded as advisory.** The contract documents the trigger cues; live triggering outside a fixture corpus stays caller judgment, not a deterministic gate |
| Risk | Whether the modeled states/transitions/guards are correct and complete is not machine-checkable | A checkbox can prove presence, never modeling quality | **Recorded as advisory.** Only structural presence and cross-card consistency are enforced; modeling quality stays taste/advisory |
| Risk | No per-state-machine auto-parser this phase | The lane is auditor-walked, not auto-parsed | **Deferred follow-up named.** `mode-registry.json` aliases and a `proof_check.py` per-state-machine auto-parser are recorded as a named follow-up, not silently claimed |
| Dependency | The existing Interface Pre-Flight HARD gate | Green | The binary matrix boxes are walked under the same mechanical rule as every other box — a single failed applicable box blocks a ship/ready/done claim |
| Dependency | designer-skills-main state-machine modeling shape | Green (corpus) | Supplies the source vocabulary for the nine matrix fields |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Integrity
- **NFR-I01**: The port is additive — the contract gains the field shape and one gate row with nothing removed, and the only existing-text edit anywhere is the pre-flight VERDICT 11 → 12 renumber.
- **NFR-I02**: For a non-stateful surface the lane is marked N/A and the cards behave exactly as before, consistent with the existing N/A boxes (grid/bento, real imagery).

### Consistency
- **NFR-C01**: `context_loading_contract.md` is the single place the field shape is defined; the proof card and the pre-flight card are projections of it, and the nine-part field set is identical across all three homes.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Conditional behavior
- **Non-stateful surface**: marks the lane N/A and passes exactly as before — no new required box bites.
- **Stateful surface, complete matrix**: every applicable box checked → SHIP.
- **Stateful surface, gap**: a missing recovery / forbidden / guard box → FIX at the existing Interface Pre-Flight gate.

### No-regression
- **Existing pre-flight boxes §1-§10**: unchanged in text and position; the VERDICT renumber adds and removes no box.
- **`proof_check.py` four-field gate**: untouched, so its parse over the proof card is byte-for-byte unchanged; the new `## 8` section is conditional reader content it does not parse.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: Three Markdown artifacts — one contract (field shape + one gate row), one proof card (one conditional fillable section), and one pre-flight card (one binary section + a single VERDICT renumber).
- **Risk concentration**: The only judgment-bearing surface is whether a live surface is stateful enough to trigger the lane and whether the modeled states/transitions/guards are correct; both stay advisory. Everything structural — presence, cross-card consistency, the binary boxes, and the VERDICT renumber — is checkable, and the existing Interface Pre-Flight gate bites on the boxes. The blast radius is the design proof surface only; the registry, `proof_check.py`, and hubRoute fixtures stay untouched.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the matrix enforceable? **RESOLVED: Yes, via the existing Interface Pre-Flight HARD gate.** The binary matrix boxes block a stateful surface's ship/ready/done claim, walked by the auditor (not a new auto-parser). Presence and cross-card consistency are structurally checkable.
- Is live triggering enforceable? **RESOLVED: No — advisory.** Whether a given surface is stateful enough to require the lane is caller judgment; the contract documents the trigger cues, but live triggering outside a fixture corpus is not deterministic.
- Is modeling quality enforceable? **RESOLVED: No — advisory.** Whether the modeled states, transitions, and guards are correct and complete cannot be proven by a checkbox; only structural presence is enforced, never the quality of the model.
- Is an auto-parser built this phase? **RESOLVED: No — deferred.** A per-state-machine auto-parser in `proof_check.py` and `mode-registry.json` trigger aliases are a named follow-up; this phase ships no new script or registry change.

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
- Additive nine-part INTERACTION STATE MATRIX lane mirrored across the contract (field shape + one §5 HARD GATE row), the proof card (## 8 conditional fillable), and the pre-flight card (## 11 binary feeding the verdict; VERDICT 11->12 the only existing-text edit)
- Honest split: presence + cross-card consistency + the binary pre-flight boxes enforceable via the existing Interface Pre-Flight HARD gate; live triggering + modeling quality advisory
- Deferred follow-up named: a per-state-machine auto-parser (proof_check.py) + mode-registry.json aliases; no script or registry change this phase
- hubRoute 28/23/5/0 unaffected (the cards are not hubRoute fixture sources); GENERATED_METADATA regenerated by the orchestrator
-->
</content>
</invoke>
