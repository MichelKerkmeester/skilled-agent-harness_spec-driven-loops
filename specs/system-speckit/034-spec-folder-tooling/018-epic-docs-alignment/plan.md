---
title: "Implementation Plan: Phase 18: epic-docs-alignment"
description: "Plan for closing the 26 documentation findings from the docs audit of the spec-folder tooling epic, in four doc lanes, a changelog lane, a review round and a status lane."
trigger_phrases:
  - "epic docs alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: epic-docs-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, checked by the repository's own Node and Python validators |
| **Framework** | None. Each document follows its sk-doc template and the spec-folder contract |
| **Storage** | Git, on the branch `worktrees/091-consolidate-small-packets` |
| **Testing** | Playbook, catalog, link, document, Gate 3 parity, hook gate and doctor compat checks, plus `validate.sh --strict` |

### Overview
This phase closes the 26 findings in `scratch/audit-findings.md`. Every fix is a documentation change, so no code, test or workflow changes. Each doc now describes the code as it ships. The work runs in four doc lanes with disjoint file sets, then a changelog lane, then a fresh read-only review and one fix round, then a status lane for the parent specs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (spec.md section 5 and acceptance-criteria.md)
- [x] Dependencies identified (section 6 below)

### Definition of Done
- [x] All acceptance criteria met (acceptance-criteria.md, AC-001 to AC-005)
- [x] Tests passing: the doctor compat suite runs 21 of 21 and the Gate 3 parity suite runs 12 of 12 (scratch/evidence)
- [x] Docs updated: spec, plan, tasks and implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation lanes with disjoint file ownership. Each lane owns a set of document types, so no two lanes edit the same file. The review follows the lanes, the fix round follows the review, and the changelog and status lanes run last.

### Key Components
- **Lane A, playbooks**: F01, F02, F09 (scenarios) and F11. Files: the sk-git and system-spec-kit manual testing playbooks.
- **Lane B, feature catalogs**: F03, F09 (entries) and the catalog side of F13. Files: the system-spec-kit feature catalog.
- **Lane C, READMEs and references**: F08, F10, the README side of F13, F14, F15, F16, F17, F21, F22, F23, F24 and F25 (references). Files: the spec tooling README, the sweep, retrieval library and test-fixture READMEs, the hook test README, path-scoped rules, worked examples and trigger config.
- **Lane D, doctor, env, hooks and root docs**: F04, F05, F06, F07, F12, F18, F19, F20 and the command asset side of F25. Files: the system-spec-kit and root READMEs, the commands README, ENV-REFERENCE, `.env.example`, the doctor test README, the git-hooks README and `speckit-implement.yaml`.
- **Changelog lane**: F26, the two release changelogs and the SKILL.md version bump to 2.7.1.0.
- **Status lane**: F27, the stale status cells in the 034 and 016 parent specs.

### Data Flow
The audit names each finding with its file and line. Each lane reads the named line, checks the claim against the code line it describes, and edits only the files it owns. The review reads the changed docs against the code. The fix round repairs what the review finds. The gates write their output to `scratch/evidence`, and the commits group the changes by lane.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase changes documentation only. It changes no producer, helper, parser, path handler, security control or persisted data, so the addendum's inventories do not apply. The per-finding class and consumer inventory is recorded in `tasks.md` under Fix Completeness.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the setup, implementation, review and verification task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Playbook validation | Both playbook packages | `validate-playbook-package.cjs` with `--package system-spec-kit` and `--package sk-git` |
| Catalog validation | The system-spec-kit feature catalog | `validate_catalog_package.py --package system-spec-kit` |
| Link check | All markdown in the repository | `check-markdown-links.cjs` |
| Document validation | Each changed or new markdown file outside `specs/` | `validate_document.py`, one run per file |
| Gate 3 parity | The twelve Gate 3 menu files | `gate-3-menu-parity.test.mjs` |
| Hook gates | The shipped pre-commit and pre-push gates | `git-hook-gates.cjs list` |
| Doctor compat | The `/doctor:update` compat action and check phase | `doctor-update-compat.test.cjs` |
| Removed behavior | Removed flags and old gate counts in the docs | `rg` over `.skilled`, `README.md` and `.env.example` |
| Spec strict validation | This packet and both parent packets | `validate.sh --strict` and `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 16 and 17 shipped | Internal | Green | The docs would describe behavior that is not yet live |
| Validators under `.skilled/` | Internal | Green on the current tree | No gate result to cite |
| `origin/main` reachable for the push | External | Checked at push time | The push waits, and a rebase reruns the spec validates |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate fails after the push, or a changed doc is shown to disagree with the code.
- **Procedure**: revert the three commits in reverse order (packet, changelogs, docs) with new `git revert` commits, and push those reverts. No history is rewritten and nothing is force-pushed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: audit read and gates on the current tree | None | Lanes A to D and the status lane |
| Lanes A to D (disjoint files) | Setup | Changelog lane |
| Changelog lane | Lanes A to D | Review |
| Review and fix round | Lanes A to D and the changelog lane | Gates |
| Status lane (F27) | Setup | Gates |
| Gates and strict spec validation | Review and fix round, status lane | Commits |
| Commits and push | Gates and strict spec validation | Close-out |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and audit read | Low | Not recorded |
| Lanes A to D | Medium | Not recorded |
| Changelog lane | Low | Not recorded |
| Review and fix round | Medium | Not recorded |
| Gates, spec validation, commits and push | Medium | Not recorded |

The phases were not timed in this record, so this table claims no durations.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: not needed, because every change is in git history
- [x] Feature flag configured: not applicable, documentation only
- [x] Monitoring alerts set: not applicable, the CI run is the only signal

### Rollback Procedure
1. Revert the packet commit with `git revert`.
2. Revert the changelog commit with `git revert`.
3. Revert the documentation commit with `git revert`.
4. Rerun the gates in `scratch/evidence` and compare them with the recorded results.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The change is documentation only.
<!-- /ANCHOR:enhanced-rollback -->
