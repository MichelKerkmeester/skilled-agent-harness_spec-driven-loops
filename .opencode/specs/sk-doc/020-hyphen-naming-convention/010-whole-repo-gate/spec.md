---
title: "Feature Specification: whole-repo verification gate (032 phase 010)"
description: "The migration needs one evidence-based end-state gate that proves the scope-aware filesystem naming rule, reference closure, Git rename history, and the complete validation and test baseline all hold on the same candidate commit. This phase defines that gate and records exact pass measurements; it does not repair failures or perform the migration."
trigger_phrases:
  - "whole-repo verification gate"
  - "hyphen naming phase 010"
  - "kebab-case migration final gate"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/010-whole-repo-gate"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the whole-repo gate contract and its evidence domains"
    next_safe_action: "Run the gate against the completed migration candidate after phase 009 alias removal"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/009-remove-transition-aliases/checklist.md"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The gate evaluates one candidate SHA against the pinned BASE and the frozen, classified rename map."
      - "A Git rename must be observable as R-status; a delete plus add pair is not an acceptable substitute."
      - "The exemption set is scope-aware and includes Python files/package directories, generated/lockfile output, tool-mandated names, and frozen surfaces."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Whole-repo verification gate

> Phase adjacency under the 032 parent: prerequisite `009-remove-transition-aliases`; successor `011-integrate-and-closeout`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/010-whole-repo-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 010 of the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Individual migration phases can be green while the repository still contains an in-scope snake_case path, a stale reference, a delete-plus-add disguised as a rename, or a test suite that no longer discovers the same cases. Without a single candidate-level gate, those failures can be hidden by phase boundaries or by running checks against different commits.

This phase defines one blocking, evidence-pinned verification gate. It measures the scope-aware filesystem state, reference closure, rename history, and full validation/test behavior against the same candidate SHA and the immutable baseline, then returns a pass only when every domain passes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the scope-aware whole-tree naming guard and prove that no in-scope snake_case filesystem name remains outside the declared exemption and frozen sets.
- Run the rename-map-driven reference checker across imports, requires, shell sourcing, registries, path-valued configuration, markdown links, and dispositioned dynamic sites; require zero unresolved references.
- Compare the frozen source-to-target map with Git rename status and prove every migrated pair is recorded as `R`/`Rnn`, not as an independent delete and add.
- Re-run the full strict validation, build, typecheck, test, discovery-count, import/path/link, and Lane C benchmark suite captured by the phase 000 baseline.
- Produce a candidate report containing the BASE SHA, candidate SHA, rename-map hash, command lines, exit codes, counts, and failure evidence.

### Out of Scope
- Performing, repairing, or re-batching filesystem renames or reference rewrites; failures stop the gate and return to the owning migration phase.
- Changing the naming policy, the exemption boundary, the frozen-history rule, or the transition-alias behavior.
- Rebasing, merging, fast-forwarding, or parent closeout; phase 011 consumes this gate after integration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Phase 000 baseline evidence | Read | Supplies the immutable BASE SHA, census, discovery counts, command matrix, and benchmark comparison values. |
| Frozen classified rename map | Read | Supplies the expected source-to-target pairs, classifications, and map hash. |
| Candidate verification report | Create | Records measurements, command results, discrepancies, and the final gate verdict. |
| Migration worktree | Verify only | The gate must not rewrite tracked files or accept generated mutations as fixes. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No in-scope snake_case filesystem names remain | The scope-aware `--all` guard exits 0 and reports zero violations; every excluded name is attributable to the policy exemption or frozen-surface classification, with no unknown bucket. |
| REQ-002 | Every reference is updated or dispositioned | The rename-map-driven scan resolves all module/path/link/registry/shell references with zero unresolved results; every dynamic `require`, `source`, glob, or equivalent site has a recorded disposition; a zero-file scan fails. |
| REQ-003 | Rename history is preserved | Against the same BASE and candidate SHAs, `git diff --name-status --find-renames=50%` reports an `R` status for every frozen map rename pair; no pair appears as source `D` plus target `A`, and the observed rename set matches the map. |
| REQ-004 | The full validation and test suite is green | Every command in the phase 000 validation/test matrix exits 0 on the candidate; strict validation has no errors, test/build/typecheck suites discover the baseline-equivalent cases, and no required suite reports zero tests. |
| REQ-005 | Behavioral parity is measured, not inferred | Import/path/link checks report zero broken targets; Lane C scenario IDs match the baseline and its fixed-seed score does not regress; any intentional baseline difference is documented and approved before a pass. |
| REQ-006 | Gate evidence is reproducible and candidate-scoped | The report pins BASE SHA, candidate SHA, rename-map hash, tool versions, commands, exit codes, counts, and logs for all domains; verification leaves no unexpected tracked mutation. |
| REQ-007 | Exemptions and frozen history remain untouched | No Python filename/package directory, generated or lockfile output, tool-mandated name, code identifier, data key, frontmatter field, or frozen surface is counted as an in-scope failure or rewritten as part of this gate. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The naming, reference, history, and behavior domains all pass for one candidate SHA.
- **SC-002**: The candidate report is sufficient for an independent verifier to reproduce the verdict from the pinned baseline.
- **SC-003**: Phase 011 can consume the report without treating an unmeasured or partial result as a green gate.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The gate is only meaningful if every domain uses the same candidate SHA and the frozen map is hashed with the same BASE. Git rename detection can vary with similarity thresholds, so the threshold and raw status output must be recorded. Static reference checks can miss dynamic sites, so the dynamic-site disposition ledger and non-zero scan-count rule are blocking. Test suites can pass while discovering fewer cases, so discovery parity and the phase 000 baseline are part of the pass condition.

The gate depends on phase 000 baseline evidence, the completed migration and alias-removal phases, the frozen classified rename map, and the installed toolchain in the isolated worktree. It intentionally does not repair any failure; the owning phase must correct and resubmit the candidate.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must identify the authoritative phase 000 command matrix and the exact similarity threshold used for Git rename measurement before the gate starts.
<!-- /ANCHOR:questions -->
