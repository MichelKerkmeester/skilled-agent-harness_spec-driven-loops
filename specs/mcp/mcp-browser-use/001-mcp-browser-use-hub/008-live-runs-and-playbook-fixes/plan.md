---
title: "Implementation Plan: Phase 8: live-runs-and-playbook-fixes"
description: "Record the operator-approved live Bladebro and Aside runs, add the Bladebro attach-mode scenario and package, correct the scenario forms the live runs showed to be wrong, and prove each one with its validator."
trigger_phrases:
  - "live runs and playbook fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: live-runs-and-playbook-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node.js, Python 3, Markdown, JSON |
| **Framework** | Skilled parent-hub skill layout with `sk-create-manual-testing-playbook` and `sk-create-feature-catalog` |
| **Storage** | None. Run output is plain files in each report folder |
| **Testing** | `record-playbook-run.cjs`, `validate-playbook-package.cjs`, `validate_catalog_package.py`, `validate.sh --strict` |

### Overview
The live runs were recorded with `record-playbook-run.cjs`, which writes `README.md`, `results.csv` and `source.md` into a dated report folder. Each run's verdicts come from the scenario files as they stood at the run. Where a scenario form failed on the installed tool, the form was corrected in its playbook and the playbook validator was re-run. Bladebro's catalog, examples and MCP server docs follow the sibling mode packages. This packet records all of that, and it runs no new browser step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <child> --strict` and the same for the parent print `RESULT: PASSED`
- [x] `validate-playbook-package.cjs` exits 0 with `violations=0` for the three browser hub packages, and `validate_catalog_package.py` exits 0 for Bladebro
- [x] Docs updated (spec, plan, tasks, acceptance criteria, implementation summary, goal)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Recorded evidence over a scenario corpus. Scenarios are inputs and are never rewritten by a run. Each run writes a new report folder, and a changed result gets a new folder rather than an overwrite.

### Key Components
- **Run folders**: one per mode and date, holding `README.md` (tally and table), `results.csv` (one row per scenario) and `source.md` (where the raw evidence lives).
- **BB-015 and its package**: `real-browser/attach-mode-reads.md`, listed in the section 12 cross-reference index and in the feature catalog.
- **Bladebro package additions**: `feature-catalog/` (root plus 17 entries), `examples/` (README plus three scripts) and `mcp-servers/` (two READMEs).
- **Form fixes**: corrected scenario steps in the Chrome DevTools and Aside playbooks, each validated by the playbook validator.

### Data Flow
Scenario file, then a live run on the operator's machine, then `record-playbook-run.cjs`, then a run folder, then one index row in that mode's `benchmark/reports/README.md`. Validators read the playbook and catalog trees and write nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Bladebro playbook root and section 12 index | Lists scenarios and their feature files | Update: 15 scenarios, root 1.1.0.0, latest-run line | `validate-playbook-package.cjs --package mcp-browser-use/mcp-bladebro` exits 0, `scenarios=15` |
| Chrome DevTools playbook | Lists 30 scenarios with CLI and Code Mode forms | Update: form fixes in nine scenarios, root 1.0.6.0. BDG-015 unchanged | Validator exits 0 with `violations=0`. It reports two pre-existing census warnings |
| Aside playbook | Lists 29 scenarios | Update: REPL and form fixes, root 1.0.3.0 | Validator exits 0 with `violations=0`. It reports one pre-existing census warning |
| Benchmark report indexes (Bladebro and Aside) | One index row per report folder | Update: one row each for the two new runs | `grep -n "2026-11-22" <README>` shows the row |
| Stale Aside `SKILL.md`, references and feature catalog; Chrome references; Code Mode `SKILL.md` and CM-012 | Still show the old forms | Not changed. Listed as open items in spec section 10 | Not verified by this packet |

Required inventories:
- Same-class producers: `rg -n "page\.on\(|page\.context\(|/tmp/" .skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook` lists the forms that the fixes replaced. This packet does not re-run that search.
- Consumers of changed symbols: the Bladebro section 12 index and the feature catalog list BB-015. The playbook validator checks the cross-reference.
- Matrix axes: N/A. No parser or resolver changed.
- Algorithm invariant: N/A.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Playbook contract | Bladebro, Aside and Chrome DevTools packages: scenario count, categories, cross-references, census | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package <id>` |
| Catalog contract | Bladebro feature catalog: entries, categories, cross-references | `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` |
| Record integrity | Run folders: CSV rows, README tallies, no contact or account data | `awk` over `results.csv`, `grep -rEc` for email patterns |
| Spec contract | This child and its parent | `validate.sh <folder> --strict` |
| Live runs | Scenario steps on the operator's machine | Operator-approved only. Already performed, recorded in the run folders |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bladebro 4.8.2 installed on macOS arm64 | External | Green | The Bladebro live runs cannot be repeated |
| Aside 1.26.626.1517 signed in to the operator's ClickUp session | External | Green | The Aside signed-in scenarios cannot be repeated |
| Port 9333 for attach mode | External | Green while Aside runs with the debug flag. The port is closed now | BB-015 cannot run again until Aside is relaunched with the flag |
| Playbook and catalog validators in sk-doc | Internal | Green | Scenario changes cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator fails after a later edit, or a recorded verdict is found to be wrong.
- **Procedure**: a wrong verdict is handled by a new dated run folder, following the playbook's own rule, and the old folder stays for the record. A playbook or catalog change is reverted with `git revert` once committed, or by restoring the file from git before commit. The 505 worktree deletion cannot be reversed, because the folder is gone.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: scaffold and level | The level helper and the 007 precedent | Every file in this packet |
| Implementation: runs, scenario fixes, catalog, worktree removal | Operator approvals and the live runs | Verification |
| Verification: validators, record checks, `validate.sh --strict` | Implementation | Closure and the commit gate |
<!-- /ANCHOR:phase-deps -->

---
