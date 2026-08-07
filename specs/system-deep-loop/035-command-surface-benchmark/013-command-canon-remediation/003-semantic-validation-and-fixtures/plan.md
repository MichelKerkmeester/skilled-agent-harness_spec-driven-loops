---
title: "Implementation Plan: semantic validation and fixtures"
description: "Plan for the W1/W2/W6 semantic-validation phase: canonize the mode-completeness rule, add gate-obligation and mode-completeness checks to the command adapter, close the reference-coverage family omission, and guard each new invariant with an independent mutation fixture detected by both the adapter and the reference oracle."
status: in_progress
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T13:20:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-2 doc set for semantic-validation phase"
    next_safe_action: "Canonize W6 mode-completeness in Step 10, then build the checks"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: semantic validation and fixtures

<!-- ANCHOR:summary -->
## 1. SUMMARY

Enforce three of the command contract's behavioral invariants that today's checks miss. Add a gate-obligation check (W1) and a mode-completeness check (W6) to the sk-doc-command adapter, both reading the phase-001 contract for per-family `input.required`, `supported_modes`, and `execution_targets`. Close the reference-coverage omission (W2) by deriving the family set from the real command tree instead of a hard-coded `['create', 'deep', 'design']`. Write the W6 canon into create-command Step 10 first. Guard each new invariant with one independent mutation fixture detected by both the adapter and the boundary-protected reference oracle, then regenerate the frozen expectations.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The gate-obligation check flags a required-input router missing its gate and passes a conformant one.
- The mode-completeness check flags a declared mode missing its YAML or EXECUTION TARGETS row.
- Reference coverage reports all six families with no hard-coded family list.
- One mutation fixture fails per new invariant; the adapter and the reference oracle agree on the full fixture set.
- Step 10 documents mode completeness before the check enforces it.
- The adapter differential test and `reference-oracle --verify` are both green; packet `validate.sh --strict` is Errors:0.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The two new checks live in the sk-doc-command adapter as dimension checks alongside the existing S1–S5 checks, so they flow through the same `makeFinding` shape, dedup, and known-deviation suppression. Both read the phase-001 `command_contract.json` to resolve, per family, whether input is required and which modes are supported — the contract is the single source, so the checks do not re-hard-code family behavior. The gate-obligation check (a new S-dimension) confirms a required-input router carries the mandatory gate or the router-gate input-surface. The mode-completeness check confirms every supported mode has both its `_auto.yaml` / `_confirm.yaml` and an EXECUTION TARGETS row, upgrading the existing reachability logic to completeness.

The reference-coverage fix derives `validate-command-references.cjs`'s family set from the command tree (the directories under `.opencode/commands/` minus the shared `assets` / `scripts` excludes), removing the hard-coded omission.

For W2's "independent mutation fixtures," each new invariant is implemented twice: once in the adapter and once in the boundary-protected `reference-oracle.cjs` classifier, which the adapter is forbidden to import. A mutation fixture per invariant is added to the fixture mutation manifest, the frozen expectations are regenerated with `reference-oracle --freeze`, and the adapter differential test proves the two independent implementations agree.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canonize (W6, REQ-005)
Write the mode-completeness rule into create-command Step 10: every mode a command advertises must have both its workflow YAML and an EXECUTION TARGETS row. The W1 gate obligation is already canon in Step 7.

### Phase 2: Coverage (W2, REQ-004)
Derive the reference-check family set from the command tree in `validate-command-references.cjs`, run the check across all six families, and resolve any real reference failure surfaced by the newly covered speckit/memory/doctor assets.

### Phase 3: Checks (W1, W6, REQ-001/002)
Add the gate-obligation and mode-completeness dimension checks to the adapter, contract-driven, and confirm they fire on a crafted defect and stay silent on the conformant corpus.

### Phase 4: Fixtures and oracle (W2, REQ-003)
Implement the same two invariants in the reference oracle, add one mutation fixture per invariant, bump the oracle's fixture-count invariants, regenerate the frozen expectations, and confirm the adapter differential test and `--verify` are both green.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Exercise each check against a crafted defect and the conformant real corpus: the gate-obligation check must fail a required-input router with its gate removed and pass the intact one; the mode-completeness check must fail a command whose advertised mode lacks its YAML or EXECUTION TARGETS row. Run the reference-coverage check across all six families and confirm no hard-coded omission remains. Regenerate the frozen expectations and confirm the adapter differential test reports the new fixtures and the independent oracle `--verify` agrees on all of them.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the phase-001 `command_contract.json` for per-family input and mode facts, and on the phase-002 fixture-oracle harness for the mutation-fixture mechanism. Independent of phase 004 (census/taxonomy) and phase 005 (generation). Feeds phase 005, which generates routers whose completeness this phase now enforces.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two adapter checks and their oracle counterparts, restore the hard-coded family list, remove the new mutation fixtures, and re-freeze the expectations to the prior fixture set. The Step 10 canon addition is documentation and can be reverted independently. No runtime dispatch behavior changes.
<!-- /ANCHOR:rollback -->
