---
title: "Checklist: whole-repo verification gate (017 phase 010)"
description: "Blocking SOL verifier contract for phase 010: prove the scope-aware naming end state, reference closure, Git rename history, and full validation/test baseline on one candidate SHA."
trigger_phrases:
  - "whole-repo verification gate checklist"
  - "hyphen naming phase 010 checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/010-whole-repo-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-whole-repo-gate"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking whole-repo gate checks and the L3 evidence contract"
    next_safe_action: "Run against the completed migration candidate after phase 009 handoff"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/000-worktree-baseline-and-census"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/010-whole-repo-gate/decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Whole-repo verification gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 010. The report must pin the BASE SHA, candidate SHA, frozen rename-map hash, tool versions, and Git similarity threshold; record every command, exit code, count, log, and scenario result; and fail on zero-file scans, zero-test suites, unexpected tracked mutation, or an omitted domain. One failed P0 domain fails the whole candidate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 000 baseline evidence identifies the immutable BASE SHA, complete command matrix, discovery counts, exemption/frozen inventory, and Lane C comparison values.
- [ ] CHK-002 [P0] The classified rename map is frozen and its hash is recorded; every candidate is classified without an unknown bucket.
- [ ] CHK-003 [P1] Phase 009 handoff evidence is green and the candidate worktree uses the isolated dependency installation.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The gate evaluates the same candidate SHA against the same BASE SHA and map hash across every domain.
- [ ] CHK-005 [P1] Verification changes no code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python filenames/package directories, tool-mandated names, or frozen history.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] The scope-aware `--all` naming guard exits 0, reports zero in-scope snake_case filesystem names, and accounts for every exemption and frozen path.
- [ ] CHK-007 [P0] The rename-map-driven reference scan reports zero unresolved imports, requires, path values, shell sources, registries, and markdown links; every dynamic site is dispositioned and the scan count is non-zero.
- [ ] CHK-008 [P0] `git diff --name-status --find-renames=50% BASE CANDIDATE` reports `R`/`Rnn` for every frozen map pair, with no source `D` plus target `A` replacement and no unexpected rename.
- [ ] CHK-009 [P0] Every phase 000 strict-validation command exits 0 with no strict errors.
- [ ] CHK-010 [P0] Every phase 000 build, typecheck, and test command exits 0; each required suite discovers the baseline-equivalent cases and no required suite reports zero tests.
- [ ] CHK-011 [P0] Whole-repo import/path/link checks report zero broken targets and fixed-seed Lane C scenario IDs match the baseline with no unapproved score regression.
- [ ] CHK-012 [P1] Verification leaves no unexpected tracked mutation; the clean-state check is recorded after all commands finish.
- [ ] CHK-018 [P0] The naming, reference, history, and behavior outputs are independently present and the final verdict is their conjunction, not a best-effort aggregate.
- [ ] CHK-019 [P1] The frozen map, exemption inventory, dynamic-site ledger, and baseline command matrix reconcile without an unowned or unknown entry.
- [ ] CHK-020 [P1] Lane C uses the phase 000 fixed seed and reports scenario IDs plus score comparison; a count-only comparison is insufficient.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] The evidence report contains the exact command, exit code, output/count, and source artifact for every P0 domain.
- [ ] CHK-014 [P1] Any intentional baseline difference is documented with its disposition and approval; it is not silently treated as parity.
- [ ] CHK-021 [P0] The final scope reconciliation proves the only remaining snake_case filesystem names belong to the declared Python, generated/lockfile, tool-mandated, or frozen classes.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-015 [P2] The verifier does not weaken path boundaries, allowlists, sandbox posture, or the exemption classifier to obtain a pass.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-016 [P1] The decision record, plan, tasks, and candidate report state the same pass criteria and measurement sources.
- [ ] CHK-022 [P1] An independent reviewer can reproduce the verdict from the pinned SHAs, map hash, commands, exit codes, counts, and referenced logs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P1] The report and generated logs are tied to the candidate SHA and do not mutate the tracked migration tree during verification.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is acceptable only when all P0 checks pass and the report proves the complete candidate-level conjunction. A green sub-suite, a partial scan, or a Git delete-plus-add result is not a gate pass.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the report records the exact measurements, and the candidate is ready for phase 011's rebase-and-rerun closeout.
<!-- /ANCHOR:sign-off -->
