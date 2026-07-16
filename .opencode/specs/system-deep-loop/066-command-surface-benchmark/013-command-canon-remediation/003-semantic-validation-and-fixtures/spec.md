---
title: "Feature Specification: semantic validation and fixtures"
description: "Backlog W1/W2/W6: enforce the command contract's behavioral invariants, not just section presence. Add a gate-obligation check for required-input routers, a mode-completeness check that a declared :auto/:confirm mode has both its workflow YAML and an EXECUTION TARGETS row, and close the reference-coverage omission that skips speckit/memory/doctor — each guarded by an independent mutation fixture. Canonize the new rules before enforcing them."
status: complete
trigger_phrases:
  - "semantic command validation"
  - "gate obligation check"
  - "mode completeness check"
  - "command reference coverage omission"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Built both checks + coverage fix; re-froze corpus to 15 trees; gates green"
    next_safe_action: "Commit the reconciled packet and sync to origin"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
    open_questions: []
    answered_questions:
      - "Timeout-bounds stays documentation-only for this phase; not enforced as a static fixture."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: semantic validation and fixtures

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The command validators enforce section presence and reference reachability, but not the behavioral invariants the phase-001 contract declares. A command can be canon-shaped yet contract-wrong in three concrete ways the current checks miss:

- **Input gate obligation (W1).** A router declares a required input in its `argument-hint` but omits the mandatory gate; the skill demands the gate at scale, yet nothing fails a router that drops it.
- **Mode completeness (W6).** The adapter checks that a referenced workflow YAML *exists* (reachability), not that a *declared* mode is *complete*. A command can advertise `:auto` in its hint, lack `_auto.yaml` or an `:auto` EXECUTION TARGETS row, and still pass.
- **Reference-coverage omission (W2).** `validate-command-references.cjs` hard-codes `FAMILIES = ['create', 'deep', 'design']`, so the reference-resolution check never inspects speckit, memory, or doctor asset YAMLs — three of the six families are silently uncovered.

This phase enforces these invariants. Per the "canonize before enforcing" rule, the W6 mode-completeness canon is written into the create-command skill first; the W1 gate obligation is already canon in Step 7. Each new invariant is guarded by an independent mutation fixture so the check is proven to fail on a real defect.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Add a **gate-obligation** check (W1): a router whose contract `input.required` is true must carry the mandatory input gate; dropping it is a finding.
- Add a **mode-completeness** check (W6): every mode a command declares in its hint / contract `supported_modes` must have both its workflow YAML and an EXECUTION TARGETS row.
- Write the W6 mode-completeness rule into create-command Step 10 before enforcing it.
- Close the **reference-coverage omission** (W2): derive the reference-check family set from the real command tree so no family is hard-coded out.
- Add one **independent mutation fixture per new invariant**, implemented in both the production adapter and the boundary-protected reference oracle, and regenerate the frozen expectations.

**Out of scope:**
- The versioned command contract itself, owned by phase 001.
- Router/asset generation from the contract, owned by phase 005.
- Census, cross-runtime invocation, and topology taxonomy, owned by phase 004.
- FQ-MCP tool-token validation, already folded into phase 000.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0, W1):** A gate-obligation check flags a required-input router that carries neither the inline mandatory gate nor the router-gate input-surface alternative. A conformant required-input router passes; removing the gate makes it non-compliant.
- **REQ-002 (P0, W6):** A mode-completeness check flags (P1) any command that declares a `:auto` or `:confirm` mode without both the corresponding workflow YAML and an EXECUTION TARGETS row for that mode. Completeness is checked, not only reachability.
- **REQ-003 (P0, W2):** Each new invariant (gate obligation, mode completeness) is covered by one independent mutation fixture, detected by both the production adapter and the reference oracle, with the frozen expectations regenerated and the differential test green.
- **REQ-004 (P1, W2):** Reference-coverage no longer hard-codes a family subset; all six families (create, design, speckit, memory, doctor, deep) are covered with no hard-coded omission.
- **REQ-005 (P1, W1):** The W6 mode-completeness rule is written into create-command Step 10 before the check enforces it; the W1 gate obligation is already canon in Step 7.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A required-input router with the gate passes; the same router with the gate removed fails the gate-obligation check.
- A mode-pair command missing an advertised mode's YAML or EXECUTION TARGETS row is flagged P1; a complete command passes.
- The reference-coverage check reports all six families with no hard-coded family list.
- One mutation fixture fails per new invariant, and the adapter and the independent oracle agree on the full fixture set.
- The create-command skill documents the mode-completeness rule before the check enforces it.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Depends on the phase-001 contract** for the per-family `input.required`, `supported_modes`, and `execution_targets` the checks read. The contract is shipped.
- **Fixture-oracle blast radius.** Adding fixtures regenerates the hash-locked frozen expectations and touches the boundary-protected reference oracle. This is in W2's declared scope, unlike phase 002 which stayed adapter-only. The oracle's `EXPECTED_PUBLIC_DEFECTS` / `EXPECTED_HELD_OUT` counts move with the new fixtures.
- **Coverage expansion may surface real reference failures** in speckit/memory/doctor assets that were never checked. Those are genuine findings, not regressions; any false positive from an unfamiliar reference form is fixed in the extractor, not by re-narrowing the family set.
- **Timeout-bounds invariant is uncertain** as a static check; it may be documentation-only. Recorded as an open question and deferred if it cannot fail a real mutation.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the contract's `timeout_bounds` can be enforced as a static invariant (a mutation fixture that fails) or is inherently a runtime concern and therefore documentation-only.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 002-executable-edge-route-parsing. Successor: none materialized yet; phases 004-006 are planned in the parent map.
