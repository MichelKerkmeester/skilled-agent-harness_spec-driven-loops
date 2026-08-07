---
title: "Tasks: semantic validation and fixtures"
description: "Task breakdown for the W1/W2/W6 semantic-validation phase: canonize mode completeness, close the reference-coverage omission, add the gate-obligation and mode-completeness checks, and guard each new invariant with an independent mutation fixture. Built and verified."
status: complete
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/003-semantic-validation-and-fixtures"
    last_updated_at: "2026-07-16T15:00:00Z"
    last_updated_by: "claude"
    recent_action: "Built both checks + coverage fix; re-froze corpus to 15 trees; gates green"
    next_safe_action: "Commit the reconciled packet and sync to origin"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/specs/system-deep-loop/035-command-surface-benchmark/002-deterministic-fixtures-oracle/oracle/reference-oracle.cjs"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: semantic validation and fixtures

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task carries its verification evidence. All tasks are complete: the canon (T001), the coverage fix (T002), the two adapter checks (T003-T004), the oracle counterparts and fixtures (T005), and the full gate run (T006).
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Canonized the mode-completeness rule in create-command Step 10: every advertised mode must have both its workflow YAML and an EXECUTION TARGETS row. Evidence: Step 10 now carries a `Mode completeness` paragraph, and `validate_document.py --type skill` on `create-command/SKILL.md` reports only the two pre-existing `non_sequential_numbering` warnings (unchanged from HEAD), no new issues.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 — Derived the reference-check family set from the command tree in validate-command-references.cjs and confirmed the newly covered families resolve. Evidence: `discoverFamilies()` replaced the hard-coded `['create','deep','design']`; the run reports `[create, deep, design, doctor, memory, speckit]` across 69 asset files, and doctor runtime-generated artifacts are skipped so remaining misses are 0. `--self-test` reports all three cases PASS.
- [x] T003 — Added the gate-obligation check to the adapter: a required-input router that owns its gate but omits argument-hint is a P0 finding. Evidence: a scratch tree with `argument-hint` removed from `doctor/mcp.md` yields one `CMD-S3-GATE-OBLIGATION-UNMET`; the real corpus yields none.
- [x] T004 — Added the mode-completeness check to the adapter: a mode-pair router that does not reference the workflow asset for an advertised core mode is a P1 finding. Evidence: a scratch tree with the confirm-workflow reference removed from `deep/alignment.md` yields one `CMD-S3-MODE-INCOMPLETE`; the real corpus yields none.
- [x] T005 — Implemented both invariants in the reference oracle (no adapter/oracle import either way), added one mutation fixture per invariant, and re-froze the expectations. Evidence: `build-fixtures.cjs` materialized 15 trees (10 public defects, 4 held-out, 1 clean); the oracle froze 15 expectation sets; the adapter differential test reports `PASS fixtures=15` and oracle `--verify` reports `PASS all=15`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Ran the full gate set: adapter differential test `PASS fixtures=15`, reference-oracle `--verify` `PASS all=15`, reference-coverage check clean across the six families, and packet strict validation. Evidence: all four gates green; `validate.sh --strict` on this folder is recorded in implementation-summary.md.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The gate-obligation and mode-completeness checks fire on a real defect and stay silent on the conformant corpus; reference coverage names all six families with no hard-coded omission; one mutation fixture fails per new invariant with the adapter and independent oracle in agreement; Step 10 documents mode completeness before enforcement; and every gate is green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation`. Predecessor: 002-executable-edge-route-parsing. Successor: none materialized yet; phases 004-006 are planned in the parent map.
<!-- /ANCHOR:cross-refs -->
