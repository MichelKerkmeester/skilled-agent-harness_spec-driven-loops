---
title: "Feature Specification: Variant Parameter Contract"
description: "The live-variant numeric knobs were not a transport-facing contract, so Figma, Open Design, and live each read density/scale/color independently. This adds a six-column knob-schema contract plus a stdlib gate that fails any blank required cell or a knob that drops a canonical transport, while whether the ranges produce good variants stays advisory."
trigger_phrases:
  - "d1-r12 variant parameter contract"
  - "variant parameter contract design build"
  - "transport variant knob schema"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/012-variant-parameter-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record schema-declared-vs-runtime-conformance-advisory split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/variant_parameter_contract.md"
      - ".opencode/skills/sk-design/shared/scripts/variant_parameter_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic bite as a checker vs prose-only resolved to a new stdlib gate mirroring numeric_law_check.py / proof_check.py"
      - "The contract is internal transport schema, not a user-facing pick-a-vibe chooser; the value ranges are transport-facing bounds, not selectable dials"
---
# Feature Specification: Variant Parameter Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `012-variant-parameter-contract` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The live-variant numeric knobs (density, type-scale, color-amount, structure, pairing) were not a transport-facing contract. Each transport (Figma, Open Design, live) interpreted the knobs independently with no shared schema declaring each knob's range, the mode that owns it, or which transports must honor it. A knob could silently drop a transport, or leave a range or owner blank, and nothing caught it.

### Purpose
Codify the knobs as one transport-facing contract: a six-column schema table that gives every knob a single row naming its range/values, step, owner mode, per-transport coverage, and the caveat that keeps it honest. Back it with a deterministic stdlib gate that fails when any knob leaves a required cell blank or omits a canonical transport. The contract is internal schema for transport handoff, never a user-facing pick-a-vibe chooser. The gate proves the contract is declared, complete, and transport-covered; it states honestly that whether the ranges produce good variants, whether a renderer honors a range at runtime, and whether the owner-mode home is best all stay advisory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `shared/assets/variant_parameter_contract.md` carrying the fixed six-column knob-schema table `[Knob, Range/Values, Step, Owner Mode, Transports, Caveat]` with the five knobs fully populated, plus an Overview that names the not-a-chooser boundary and the declared-vs-runtime split, and an Application Notes block.
- A new `shared/scripts/variant_parameter_check.py` (stdlib only) that parses the table, fails any incomplete required cell naming the knob + column, and fails a knob that omits a canonical transport naming the knob + transport.

### Out of Scope
- Any change to existing mode docs, the register, token files, or the sibling gates (`numeric_law_check.py`, `proof_check.py`).
- Any judgment of whether the chosen ranges produce good variants, whether a live transport honors a knob's range at render time, or whether the owner-mode home is the best one; that stays advisory and needs rendered review.
- Surfacing the knobs to the user as selectable dials; the ranges are transport-facing bounds, not a menu.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/shared/assets/variant_parameter_contract.md` | Create | Six-column knob-schema table with five fully populated knobs (density, type-scale, color-amount, structure, pairing), each declaring all three canonical transports; Overview (not-a-chooser + declared-vs-runtime split); Application Notes; gate hint |
| `sk-design/shared/scripts/variant_parameter_check.py` | Create | Stdlib gate that parses the table, fails an incomplete required cell, and fails a knob missing a canonical transport; mirrors the `numeric_law_check.py` / `proof_check.py` convention |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The contract carries the fixed six-column table with all five knobs present and fully populated | The table renders `[Knob, Range/Values, Step, Owner Mode, Transports, Caveat]` in order with `density 0.6-1.4`, `type-scale 0.85-1.3`, `color-amount 0-1`, `structure`, and `pairing` rows each filled |
| REQ-002 | Each knob declares all three canonical transports (`figma`, `open-design`, `live`) | Dropping a transport from any knob yields a non-zero exit naming the knob + missing transport (e.g. `density: missing transport live`) |
| REQ-003 | `variant_parameter_check.py` fails any incomplete required cell (`Knob`, `Range/Values`, `Owner Mode`, `Transports`, `Caveat`) | Blanking a required cell yields a non-zero exit naming the knob + column; `Step` is informational, so an explicit `n/a` for a categorical knob is valid |
| REQ-004 | The gate grades the full matrix deterministically | Complete contract → 0, blanked required cell → 1, dropped transport → 1, no-rows table → 1, usage / unreadable file → 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The schema-declared-vs-runtime-conformance boundary is written into the contract | The Overview states the gate proves declaration + completeness + transport coverage, not that a range produces good variants, that a renderer honors it at runtime, or that the owner-mode home is best |
| REQ-006 | Additive, evergreen, and scope-clean | The change set is exactly the two new files; no spec/packet/phase IDs or `specs/` paths in either; no existing mode doc, register, token file, or sibling gate edited; the hub-route replay baseline (23/5/0) is unaffected (no corpus touched) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `variant_parameter_contract.md` carries the six-column table with all five knobs fully populated and all three canonical transports declared per knob, plus the Overview and Application Notes blocks.
- **SC-002**: `variant_parameter_check.py` grades the matrix deterministically — complete → 0, a blanked required cell → 1 naming the knob + column, a dropped transport → 1 naming the knob + transport, a no-rows table → 1, usage → 2 — verified independently without pipe-masking.
- **SC-003**: The contract names the not-a-chooser boundary and the declared-vs-runtime split; the change set is the two new files only, evergreen and scope-clean (no sibling gate, register, or token file touched).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The schema is mechanically enforceable, but whether the chosen ranges produce good variants is not | Med | State the split in the Overview: the gate proves the contract is declared + complete + transport-covered; whether the ranges produce tasteful variants, whether a live transport honors a range at render time, and whether the owner-mode home is best stay advisory and need rendered review. The gate certifies no taste |
| Risk | A knob could silently drop a transport while the row otherwise reads complete | Med | The gate names every canonical transport per row and fails a knob that omits any (`<knob>: missing transport <name>`); a row that looks complete in prose still fails |
| Risk | The contract could be mistaken for a user-facing pick-a-vibe chooser | Med | The Overview labels it internal transport schema, not a menu; the value ranges are transport-facing bounds, never surfaced as selectable dials, and grounded design judgment still decides the variant |
| Dependency | `shared/scripts/numeric_law_check.py` / `proof_check.py` (stdlib gate convention) | Internal | The checker mirrors the pattern (arg parser, exit 0/1/2, optional `--json`); no new dependency |
| Dependency | Python 3 stdlib (`re`) | External | No schema gate possible without it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The column order and the canonical transport set are fixed, so a new knob inherits the same gate shape and the same transport-completeness rule without a doc rewrite.

### Reliability
- **NFR-R01**: The table parse and the transport-completeness check are deterministic: the same contract returns the same exit code and the same FAIL lines on every run.

### Integrity
- **NFR-I01**: The contract declares knobs, ranges, owners, and transports and relocates no mode's rendering logic; it carries no false trust signal that a complete schema is a runtime-conformant or tasteful one.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A fully populated, transport-covered contract satisfies the gate; whether its ranges are good is out of reach and stays advisory.
- `Step` is informational, so an explicit `n/a` for a categorical knob (`structure`, `pairing`) is valid, not a blank; only the five required columns gate.

### Error Scenarios
- A blanked required cell fails naming the knob + column (`type-scale: blank range/values`).
- A knob omitting a canonical transport fails naming the knob + transport (`density: missing transport live`).
- A table with no knob rows fails (`variant-knob rows missing`); a no-argument call or an unreadable file exits 2 with no false pass.

### State Transitions
- The three layers stay distinct: the contract declares the schema, the gate proves it is complete and transport-covered, and rendered review decides whether the variant is good. A complete contract is the floor, never the verdict.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Two additive new files: one shared contract table plus one stdlib gate |
| Risk | 6/25 | Additive and reversible (delete the two files); a gate can misfire on an honest contract, mitigated by the matrix tests |
| Research | 6/20 | Re-reading register / dials / token_starter for owner values and the `numeric_law_check.py` / `proof_check.py` convention |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the contract eventually carry a per-transport conformance probe that checks a live renderer honors a knob's range at render time? Today the gate proves the contract is declared, complete, and transport-covered (every knob names `figma`/`open-design`/`live`), but it cannot prove a live transport actually honors the range when it renders. A rendered conformance probe is the natural follow-up and is recorded here so a later phase can pick it up deliberately rather than as silent scope drift.
- Where does the schema-declared-vs-runtime-conformance split land? The declaration floor is mechanically enforceable: the row-completeness check and the transport-completeness check are deterministic, so a blank required cell and a dropped transport are loud and blocking. Whether the chosen ranges produce good variants, whether a renderer honors a range at runtime, and whether the owner-mode home is best stay advisory and need rendered or behavioral review. The gate makes the declaration bite; it never certifies runtime conformance or taste.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
