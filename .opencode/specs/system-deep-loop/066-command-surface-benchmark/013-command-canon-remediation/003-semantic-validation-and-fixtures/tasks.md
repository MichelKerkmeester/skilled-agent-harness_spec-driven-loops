---
title: "Tasks: semantic validation and fixtures"
description: "Task breakdown for the W1/W2/W6 semantic-validation phase: canonize mode completeness, close the reference-coverage omission, add the gate-obligation and mode-completeness checks, and guard each new invariant with an independent mutation fixture. Scaffolded; not yet implemented."
status: in_progress
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T13:20:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-2 doc set for semantic-validation phase"
    next_safe_action: "Canonize W6 mode-completeness in Step 10, then build the checks"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/066-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: semantic validation and fixtures

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists the verification that will confirm it when the work is done. All tasks are open: this phase is scaffolded and not yet implemented.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Canonize the mode-completeness rule in create-command Step 10: every advertised mode must have both its workflow YAML and an EXECUTION TARGETS row. Verification when done: Step 10 states the completeness rule and the skill still passes structural validation.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 — Derive the reference-check family set from the command tree in validate-command-references.cjs and resolve any real reference failure surfaced by the newly covered families. Verification when done: the coverage report names all six families with no hard-coded list, and the check exits clean.
- [ ] T003 — Add the gate-obligation check to the adapter: a required-input router missing its gate is a finding. Verification when done: a required-input router with its gate removed fails and the conformant corpus passes.
- [ ] T004 — Add the mode-completeness check to the adapter: an advertised mode missing its YAML or EXECUTION TARGETS row is a P1 finding. Verification when done: a crafted incomplete mode fails and the conformant corpus passes.
- [ ] T005 — Implement the gate-obligation and mode-completeness invariants in the reference oracle, add one mutation fixture per invariant, and regenerate the frozen expectations. Verification when done: the adapter differential test reports the new fixtures and the oracle --verify agrees on all of them.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Run the full gate set: adapter differential test, reference-oracle --verify, reference-coverage check, and packet strict validation. Verification when done: all gates green and validate.sh --strict is Errors:0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The gate-obligation and mode-completeness checks fire on a real defect and stay silent on the conformant corpus; reference coverage names all six families with no hard-coded omission; one mutation fixture fails per new invariant with the adapter and independent oracle in agreement; Step 10 documents mode completeness before enforcement; and every gate is green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation`. Predecessor: 002-executable-edge-route-parsing. Successor: none materialized yet; phases 004-006 are planned in the parent map.
<!-- /ANCHOR:cross-refs -->
