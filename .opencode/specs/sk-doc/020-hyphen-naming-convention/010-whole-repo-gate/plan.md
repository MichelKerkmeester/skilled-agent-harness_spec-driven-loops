---
title: "Implementation Plan: whole-repo verification gate (020 phase 010)"
description: "Implementation Plan for phase 010 of the 020 kebab-case filesystem-naming program: evaluate the completed migration against the scope-aware naming, reference, Git-history, and full-suite gate contract."
trigger_phrases:
  - "whole-repo verification gate implementation plan"
  - "hyphen naming phase 010 implementation plan"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/010-whole-repo-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/010-whole-repo-gate"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Defined the candidate-scoped gate sequence and evidence aggregation"
    next_safe_action: "Execute after phase 009 and use the phase 000 command matrix as the test authority"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/decision-record.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/010-whole-repo-gate/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The gate is a conjunction: one failed domain fails the candidate."
      - "The phase 000 baseline and frozen map are the measurement authorities."
---
# Implementation Plan: Whole-repo verification gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Whole repository and migration worktree (phase 010) |
| **Change class** | Evidence-based verification gate |
| **Execution** | Candidate SHA compared with immutable BASE and frozen rename map |

### Overview
The gate runs independent naming, reference, history, and behavior checks, then evaluates them as one candidate-scoped verdict. The implementation produces evidence and a pass/fail report; it does not fix files, rewrite paths, or reinterpret a failed measurement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 000 baseline evidence identifies BASE SHA, command matrix, discovery counts, and Lane C comparison values.
- [ ] The classified rename map is frozen, hashed, and available for reference and Git-history comparison.
- [ ] Phase 009 alias-removal evidence is green and the candidate worktree contains the completed migration.
- [ ] The verifier can run the full toolchain in the isolated worktree without relying on a raced external dependency tree.

### Definition of Done
- [ ] The `--all` naming gate reports zero in-scope violations and zero unknown classifications.
- [ ] Reference resolution reports zero unresolved targets and every dynamic site is dispositioned.
- [ ] Git reports every mapped migration as `R`/`Rnn`, with no delete-plus-add replacement.
- [ ] All baseline validation, build, typecheck, test, discovery, import/path/link, and benchmark checks pass.
- [ ] The report pins all inputs and outputs and records a single final verdict.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Input identity**: BASE SHA, candidate SHA, frozen map hash, and tool-version manifest are immutable report inputs.
- **Naming domain**: scope-aware `--all` guard over tracked filesystem names, with policy classifications for exemptions and frozen surfaces.
- **Reference domain**: rename-map-driven resolver plus dynamic-site disposition ledger for module, path-value, shell, registry, and markdown-link references.
- **History domain**: raw `git diff --name-status --find-renames=50%` output reconciled one-to-one with the frozen map.
- **Behavior domain**: phase 000's strict validation and complete test/build/benchmark matrix, with discovery and scenario parity.
- **Verdict**: an aggregator marks pass only when every P0 domain passes and the evidence report is complete.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Load and verify the phase 000 baseline, candidate SHA, frozen map hash, and phase 009 handoff evidence.
- [ ] Confirm the worktree and verifier outputs are isolated; record tool versions and the Git rename similarity threshold.

### Phase 2: Core Verification
- [ ] Run the scope-aware whole-tree naming guard and reconcile every exemption/frozen result.
- [ ] Run the reference checker, dynamic-site ledger, import/path/link checks, and fail on unresolved or zero-file scans.
- [ ] Compare the frozen map to Git `R` statuses and reject any delete-plus-add pair or unexpected rename.
- [ ] Run every command from the phase 000 validation/test matrix, including strict validation, builds, typechecks, tests, discovery counts, and Lane C.

### Phase 3: Verification
- [ ] Cross-check all domain outputs against the same candidate SHA and BASE SHA.
- [ ] Confirm the candidate report contains commands, exit codes, counts, logs, and explicit failures or passes.
- [ ] Issue the blocking verdict only after the checklist's P0 items pass and no tracked file was mutated by verification.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Run the scope-aware `--all` guard; require exit 0, zero in-scope violations, and complete exemption/frozen classifications. |
| REQ-002 | Run the rename-map-driven reference checker and dynamic-site ledger; require zero unresolved references, all dynamic sites dispositioned, and a non-zero scan count. |
| REQ-003 | Compare `git diff --name-status --find-renames=50% BASE CANDIDATE` with the frozen map; require one `R`/`Rnn` row per map pair and no source `D` plus target `A`. |
| REQ-004 | Rerun the entire phase 000 validation/test command matrix; require exit 0, strict validation success, and baseline-equivalent discovery counts. |
| REQ-005 | Compare import/path/link outputs and fixed-seed Lane C scenario IDs/scores with the phase 000 baseline; require zero broken targets and no unapproved score regression. |
| REQ-006 | Review the report for pinned SHAs, map hash, tool versions, commands, exit codes, logs, counts, and clean tracked state. |
| REQ-007 | Reconcile the final naming and reference outputs against the policy exemption table and frozen-surface inventory. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The gate consumes phase 000 baseline and worktree evidence, the phase 001 policy, the frozen rename map and reference tooling, all migration-phase handoffs, and phase 009 alias-removal evidence. Phase 011 depends on this report and reruns the same contract after integration.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The gate itself is read-only with respect to tracked migration content. If a domain fails, stop and return the candidate to its owning migration phase; do not weaken the criterion or edit the report to hide the failure. Discard only generated verifier output, and retain the failed evidence for diagnosis. Integration rollback belongs to phase 011.
<!-- /ANCHOR:rollback -->
