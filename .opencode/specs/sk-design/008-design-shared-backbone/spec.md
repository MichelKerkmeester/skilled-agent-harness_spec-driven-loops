---
title: "Feature Specification: Reconstruct the sk-design shared backbone"
description: "The sk-design shared backbone had no tracked packet, while its intact source defines the register, context-loading, proof, dispatch, token, procedure, script, benchmark, and feature-catalog contracts consumed by the design modes. This reconstruction records those source-defined boundaries and current-state artifacts without adding behavior."
trigger_phrases:
  - "sk-design shared backbone reconstruction"
  - "design context loading contract"
  - "shared design proof gates"
  - "sk-design benchmark and feature catalog"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/008-design-shared-backbone"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Draft shared backbone reconstruction"
    next_safe_action: "Review packet against source files"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/feature_catalog/"
      - ".opencode/specs/sk-design/008-design-shared-backbone/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-shared-backbone-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design shared backbone
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/shared/, .opencode/skills/sk-design/benchmark/, and .opencode/skills/sk-design/feature_catalog/. Verify against that source before treating any line as authoritative.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | 0055-skilled-migration-000-scaffold |
| **Spec Folder** | 008-design-shared-backbone |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design family shares a backbone of register, context, proof, transport-boundary, token, procedure, and verification contracts, but this packet was absent from git and memory. The intact shared source, benchmark snapshots, and feature catalog describe current behavior and evidence that need to be made inspectable without turning a reconstruction into a new runtime contract.

### Purpose
Reconstruct a Level-2 packet that records the shared sk-design backbone, its source-defined gates and boundaries, and its benchmark and catalog evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Brand-versus-Product register, six downstream dials, register card, and register-first context-loading rule.
- Context manifests, build bundles, proof fields, hard gates, dispatch manifests, and the design proof token contracts.
- Shared token vocabulary, cognitive and numeric law references, procedure-card schema, the shared polish procedure, and variant parameters.
- The deterministic shared scripts and their source-defined validation responsibilities, including their test file.
- The benchmark README, frozen baseline, after snapshots, trace-mode distinctions, recorded scores, and stated measurement gaps.
- The feature catalog's manager-shell intake, visible plan, proof cadence, transport-versus-taste boundary, and private procedure-card inventory.
- Source and traceability records for the 24 shared files, 15 benchmark files, and 6 feature-catalog files read for this reconstruction.

### Out of Scope
- Changing any file under the intact sk-design skill, benchmark, or feature-catalog source trees.
- Implementing, re-running, or modifying the deterministic scripts, benchmark harness, transports, mode packets, or procedure-card consumers.
- Assigning mode-specific craft behavior that the shared source only names as owned by interface, foundations, motion, audit, md-generator, or sk-code.
- Treating benchmark reports as fresh runtime results or converting a recorded measurement gap into a skill defect.
- Creating description.json, graph-metadata.json, implementation-summary.md, scratch files, or any packet file beyond the four requested documents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/008-design-shared-backbone/spec.md | Create | Level-2 reconstruction specification for the shared backbone. |
| .opencode/specs/sk-design/008-design-shared-backbone/plan.md | Create | Source-faithful reconstruction plan and boundaries. |
| .opencode/specs/sk-design/008-design-shared-backbone/tasks.md | Create | Task breakdown for authoring and checking the packet. |
| .opencode/specs/sk-design/008-design-shared-backbone/checklist.md | Create | Level-2 verification checklist for the reconstruction draft. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve register-first context loading. | The packet records Brand and Product posture, the six dials, register-first files, context-manifest fields, smallest useful build bundle, and the rule that claims name the files behind them. |
| REQ-002 | Preserve proof and boundary contracts. | The packet records the required proof fields, hard gates, DESIGN_DISPATCH_MANIFEST v1, DESIGN_BOUNDARY_PROOF v1, DESIGN_PROOF_TOKEN v1, raw-byte and canonicalization rules, and fail-closed boundary behavior. |
| REQ-003 | Preserve the transport, procedure, and handoff boundaries. | The packet keeps design judgment in sk-design, treats transports as evidence or artifact movers, keeps private cards behind public mode selection, and records the shared sk-code handoff ownership without inventing a mode schema. |
| REQ-004 | Preserve source-defined verification surfaces. | The packet identifies the shared scripts, the command-surface test, their actual checks, the benchmark dimensions and trace modes, and the feature-catalog verifier cadence without claiming that any check was run. |
| REQ-005 | Preserve reconstruction scope and uncertainty. | The packet is marked as a reconstruction draft, cites the intact source paths, distinguishes recorded benchmark evidence from current execution, and does not add behavior absent from the source. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve shared vocabulary and numeric guidance. | The packet records token roles, cognitive-law usage, numeric law ownership and enforcement status, and the variant-parameter ownership and transport rows. |
| REQ-007 | Preserve procedure-card schema and selection. | The packet records required card fields, placement rules, exact-trigger preference, narrower-output selection, no-card fallback, and read-only or mutating boundary statements. |
| REQ-008 | Preserve benchmark and feature-catalog traceability. | Sources / Traceability names the real shared, benchmark, and feature-catalog paths, including baseline and after snapshots and the six catalog files. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes the shared backbone as common contracts and evidence surfaces consumed by the design modes, without promoting it to a new public mode.
- **SC-002**: The packet captures register and context loading, proof fields and gates, dispatch and token validation, and the transport-versus-taste boundary.
- **SC-003**: The packet captures private procedure-card schema and selection, shared assets, numeric and token vocabulary, and deterministic script responsibilities.
- **SC-004**: The packet records the benchmark baseline and after snapshots with their trace-mode, coverage, score, and measurement-gap caveats.
- **SC-005**: Every source claim in the reconstruction can be traced to an intact path listed in Sources / Traceability, and no runtime execution is claimed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Mode packets and transport implementations are referenced by the shared contracts but are outside this source set. | Reconstructing their detailed behavior here would overstate the shared backbone. | Record ownership and real sibling paths only where the shared source names them; keep mode craft out of scope. |
| Dependency | Benchmark reports are rendered artifacts with router and live trace modes. | A report headline can be mistaken for a current runtime verdict or for browser-complete coverage. | Preserve each report's trace mode, unscored dimensions, and browser-harness caveat. |
| Risk | Proof cards and deterministic scripts define hard gates, while this packet is documentation only. | A reader could mistake source-defined gate rules for checks performed during reconstruction. | State the gate responsibilities and keep execution results unclaimed. |
| Risk | The feature catalog reports a 14-card family inventory, while this source set contains the shared card and catalog references to mode-local cards. | The inventory count could be confused with a reconstructed copy of all mode-local cards. | Attribute the count to the catalog and cite the listed mode-local paths without copying their undisclosed contents. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target is specified by the shared backbone; benchmark D3 values are report evidence with mode-specific caveats.
- **NFR-P02**: The proof and token contracts prioritize explicit evidence and bounded canonicalization; this packet makes no latency or throughput claim.

### Security
- **NFR-S01**: DESIGN_PROOF_TOKEN v1 binds file hashes, payload digests, time, single-use nonce and run identity, surface, and workflow modes; validators fail closed on required-input or reconstruction failure.
- **NFR-S02**: Source-proof validation resolves cited paths inside the repository root and rejects path escape, unreadable sources, malformed hashes, or mismatched raw-byte hashes.

### Reliability
- **NFR-R01**: Register, context-manifest, proof-card, dispatch, and handoff contracts expose the evidence needed at their boundaries; missing proof blocks the corresponding claim.
- **NFR-R02**: Router and live benchmark reports distinguish scored, unscored, routed-out, and harness-blocked scenarios instead of treating all rows as the same evidence.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Ambiguous register: apply the source's first-match order of task cue, surface in focus, and declared register; ask only when a missing fact could change routing or acceptance, with Product as the safer default for unlabeled internal surfaces.
- Build work spanning modes: use the smallest useful bundle named by the context contract, including interface, foundations, register and dials, preflight, matching foundation axes, and audit references when audit or readiness claims are in scope.
- Stateful or global surfaces: fill the interaction-state matrix for stateful work and the locale-stress lane for global or localized work; mark non-applicable lanes N/A where the contract allows it.

### Error Scenarios
- Missing context: block design decisions until required files are named in the context manifest.
- Missing proof: do not make ready, ship, audit, accessibility, release, or production-ready claims; return the gap to the owning mode or gate.
- Invalid proof token or dispatch envelope: reject missing, malformed, stale, replayed, mismatched, or unresolvable evidence as required by the v1 contracts.
- No private procedure match: keep the selected public mode's baseline behavior and do not create a public route or extra tool permission.
- Transport conflict: return transport output to the selected mode or audit for acceptance; transport output does not decide taste, accessibility, responsiveness, or production readiness.

### State Transitions
- Intake to work: set the register, load the context manifest, then choose the mode or bundle before design or transport decisions.
- Design to implementation: emit the shared sk-code handoff with the fields owned by the selected mode; sk-code implements and verifies rather than silently redesigning.
- Canonical skill change: use the adoption gate before promoting a lineage recommendation into canonical skill files.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Shared contracts, four assets, one shared procedure, eight gate scripts plus a test, 15 benchmark files, and 6 feature-catalog files. |
| Risk | 10/25 | The main risks are boundary invention, stale benchmark interpretation, and confusing source-defined gates with executed checks. |
| Research | 16/20 | Reconstruction required reading the complete shared, benchmark, and feature-catalog source sets plus the required templates and exemplar. |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The shared source names mode-owned contracts and downstream consumers, but this packet does not define their undisclosed schemas or implementation details.
<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY

The following intact paths were read as reconstruction evidence. They are source references, not additional behavior.

### Shared backbone

- .opencode/skills/sk-design/shared/anti_slop_principles.md
- .opencode/skills/sk-design/shared/assets/context_loaded_card.md
- .opencode/skills/sk-design/shared/assets/proof_of_application_card.md
- .opencode/skills/sk-design/shared/assets/register_card.md
- .opencode/skills/sk-design/shared/assets/variant_parameter_contract.md
- .opencode/skills/sk-design/shared/cognitive_laws.md
- .opencode/skills/sk-design/shared/context_loading_contract.md
- .opencode/skills/sk-design/shared/design_dispatch_boundary.md
- .opencode/skills/sk-design/shared/design_proof_token.md
- .opencode/skills/sk-design/shared/design_token_vocabulary.md
- .opencode/skills/sk-design/shared/numeric_design_laws.md
- .opencode/skills/sk-design/shared/procedure_card_schema.md
- .opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md
- .opencode/skills/sk-design/shared/register.md
- .opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs
- .opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs
- .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs
- .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs
- .opencode/skills/sk-design/shared/scripts/md_table.py
- .opencode/skills/sk-design/shared/scripts/numeric_law_check.py
- .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs
- .opencode/skills/sk-design/shared/scripts/proof_check.py
- .opencode/skills/sk-design/shared/scripts/variant_parameter_check.py
- .opencode/skills/sk-design/shared/sk_code_handoff.md

### Benchmark evidence

- .opencode/skills/sk-design/benchmark/README.md
- .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json
- .opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.md
- .opencode/skills/sk-design/benchmark/after_009/report.json
- .opencode/skills/sk-design/benchmark/after_009/report.md
- .opencode/skills/sk-design/benchmark/after_012_routing_rigor/report.json
- .opencode/skills/sk-design/benchmark/after_012_routing_rigor/report.md
- .opencode/skills/sk-design/benchmark/after_016_hub_routing/report.json
- .opencode/skills/sk-design/benchmark/after_016_hub_routing/report.md
- .opencode/skills/sk-design/benchmark/after_018_transport_integration/report.json
- .opencode/skills/sk-design/benchmark/after_018_transport_integration/report.md
- .opencode/skills/sk-design/benchmark/after_022_coverage_fill/report.json
- .opencode/skills/sk-design/benchmark/after_022_coverage_fill/report.md
- .opencode/skills/sk-design/benchmark/after_d3_proxy/skill-benchmark-report.json
- .opencode/skills/sk-design/benchmark/after_d3_proxy/skill-benchmark-report.md

The benchmark README defines the Lane C dimensions as D1 routing, D2 discovery, D3 efficiency, D4 usefulness, and D5 connectivity. The frozen router baseline is CONDITIONAL at 69/100 with D1 intra, D2, and the D5 hard gate at 100, D3 at 0 because of the stated Mode-A measurement gap, and D1 inter and D4 unscored. The stored after_009 report remains CONDITIONAL at 69/100 with 18 scored scenarios; after_012_routing_rigor and after_d3_proxy record router PASS at 100/100. The live after_016_hub_routing and after_018_transport_integration reports record PASS at 93/100, and after_022_coverage_fill records live PASS at 94/100. The live reports retain the browser-stage funnel caveat and leave D1 inter and D4 unscored; these are recorded artifacts, not fresh verification in this packet.

### Feature catalog

- .opencode/skills/sk-design/feature_catalog/feature_catalog.md
- .opencode/skills/sk-design/feature_catalog/manager_shell/context_first_intake_and_visible_plan.md
- .opencode/skills/sk-design/feature_catalog/manager_shell/proof_gates_and_verifier_cadence.md
- .opencode/skills/sk-design/feature_catalog/manager_shell/transport_vs_taste_separation.md
- .opencode/skills/sk-design/feature_catalog/procedure_card_system/procedure_card_inventory.md
- .opencode/skills/sk-design/feature_catalog/procedure_card_system/procedure_card_schema_and_selection.md

The feature catalog states that the hub routes one public design-family identity to five mode packets, gathers context, names proof, and keeps private procedure cards behind public routes. It records context-first intake and visible plans, verifier cadence before ready claims, transport-versus-taste separation, and a 14-card private procedure inventory. Those statements remain attributed to the catalog.

---

## RELATED DOCUMENTS

- Implementation Plan: See plan.md
- Task Breakdown: See tasks.md
- Verification Checklist: See checklist.md
