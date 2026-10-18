---
title: "Implementation Plan: Phase 10: documentation-sweep"
description: "Route every touched doc to its sk-doc mode, write each change through DeepSeek with the markdown persona, review it through Luna, then gate it with the validators, the DQI score and the human-voice check."
trigger_phrases:
  - "documentation sweep plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: documentation-sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, with JSON and Python validators |
| **Framework** | The sk-doc hub: its modes, its validators and its quality scorer |
| **Storage** | None |
| **Testing** | `validate_document.py`, the package checks, `extract_structure.py` for DQI, `hvr_scan.py` for voice, and a grep for the v1-only flags |

### Overview
This phase writes the doc changes that phases 002 to 009 need, one doc or small group per dispatch. DeepSeek writes each change with the markdown persona inlined, Luna reviews it and the orchestrator runs every validator, score, package check and search. Each touched doc gets one row in `doc-inventory.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 009 is closed, so the code the docs describe is settled
- [ ] The doc inventory exists and lists every touched doc with its sk-doc mode
- [ ] The T004 grep result for the playbook set is recorded

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, with evidence
- [ ] Every row in `doc-inventory.md` shows a passing validator, a DQI score of 75 or higher and a human-voice result
- [ ] Spec, plan and tasks match what was done
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mode-routed doc sweep. Each doc is routed to one sk-doc mode, written by one dispatch, reviewed by one dispatch and gated by one validator.

### Key Components
- **Doc inventory (`doc-inventory.md`)**: One row per touched doc, with its mode, its validator, its DQI score and its human-voice result.
- **Writer dispatch**: One DeepSeek dispatch through cli-devin, with the markdown persona from `.claude/agents/markdown.md` inlined.
- **Reviewer dispatch**: One Luna dispatch through cli-codex that returns findings and writes nothing.
- **Gate runner**: The orchestrator's own runs of the validators, `extract_structure.py`, `hvr_scan.py` and the search.

### Data Flow
The diffs from phases 002 to 009 and the grep in step 2 feed the inventory. Each row goes to one writer dispatch. Luna reviews the result, DeepSeek fixes any finding and the orchestrator runs the gates for that row and records the results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase changes docs only and fixes no code finding. The consumer search in step 12 covers every doc that names a v1-only flag or version, so no other surface is affected.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered Steps and Dispatch Plan

Each step names its executor. DeepSeek dispatches always inline the markdown persona from `.claude/agents/markdown.md`, name the sk-doc mode and its validator, and cover one doc or one small doc group. The orchestrator runs every validator, score, package check and search itself. Step 8 is the cross-family review, because Luna reviews the DeepSeek output.

1. **Inventory (orchestrator).** Read `git status --short` for the changes from phases 002 to 009. List each touched doc in `doc-inventory.md` with its sk-doc mode, its validator and its type flag. Rollback: delete `doc-inventory.md` if the phase is abandoned.
2. **Search for the v1-only set (orchestrator).** Run `rg -n -e '--command' -e '--dir' -e '--share' -e '--port' -e '--pure' -e '--variant' -e '1\.3\.17' .skilled/skills/cli-external-orchestration`. Add every file with a hit to the inventory. Read only, so no rollback applies.
3. **Playbook set (orchestrator).** Count and list the playbook files with `find .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook -name '*.md'`, and record the set in `doc-inventory.md`. Read only, so no rollback applies.
4. **Pre-write copies (orchestrator).** Copy each inventory doc into `scratch/pre-write/` before its first write. Rollback: copy the saved file back over the doc, then rerun its validator.
5. **Write, READMEs and cli-opencode skill docs (DeepSeek through cli-devin).** One dispatch per doc. Covers `.opencode/plugins/README.md`, the changed script-folder READMEs, `SKILL.md` and `README.md`. The `SKILL.md` brief names the line sites from `research/iterations/iteration-013.md` F7. Rollback: copy the pre-write copy back, then rerun the validator.
6. **Write, references and assets (DeepSeek through cli-devin).** One dispatch per file. Covers `cli-reference.md`, `providers-and-models.md` and `prompt-templates.md`. Each `--variant` example gets its v2 `#variant` twin, and each v1-only flag row gets a v2 column value. Rollback: copy the pre-write copy back, then rerun the validator.
7. **Write, playbook scenarios (DeepSeek through cli-devin).** One dispatch per scenario group. Each changed scenario gets a version banner and a v2 twin where the v1 flag set appears. Rollback: copy the pre-write copy back, then rerun the playbook package check.
8. **Write, catalog entries and changelog (DeepSeek through cli-devin).** One dispatch for the catalog entries and one for the changelog entry. Rollback: copy the pre-write copy back, then rerun the catalog and validator checks.
9. **Review each change (Luna through cli-codex).** Findings only. Luna reads each changed doc against its sk-doc mode and returns text. Read only, so no rollback applies.
10. **Fix review findings (DeepSeek through cli-devin).** One dispatch per doc that has findings. The brief quotes each finding and asks for the minimal edit. Rollback: copy the pre-write copy back, then rerun the validator.
11. **Validate each doc (orchestrator).** Run `validate_document.py` with the type from the inventory, run `extract_structure.py` and read `dqi.total`, and run `hvr_scan.py`. Record each result in `doc-inventory.md`. Read only, so no rollback applies.
12. **Validate packages and search (orchestrator).** Run `validate_skill_package.py` on each changed skill, `validate-playbook-package.cjs --package` on each changed playbook package and `validate_catalog_package.py` on each changed catalog. Run the step 2 search again and read every hit. Read only, so no rollback applies.
13. **Validate the phase 007 and 008 docs (orchestrator).** Run `validate_document.py` on `install-and-versions.md` and on the `/doctor:opencode` route doc, with the skill reference type and the command type. Read only, so no rollback applies.
14. **Close the packet (orchestrator).** Run `validate.sh` on this folder with `--strict`, fill `implementation-summary.md`, and clear `scratch/` except `.gitkeep`. Rollback: restore any summary line from the results in `doc-inventory.md`.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Each touched doc | `validate_document.py <doc> --type <type>` from `.skilled/skills/sk-doc/shared/scripts/` |
| Package | Each changed skill, hub and playbook package | `validate_skill_package.py`, `validate-playbook-package.cjs --package` and `validate_catalog_package.py --package` |
| Quality | Each touched doc | `extract_structure.py <doc>` for `dqi.total`, and `hvr_scan.py <doc>` for voice |
| Search | Touched docs | `rg` for the v1-only flags, with each hit read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 009 closed | Internal | Yellow (pending) | The docs would describe code that is still moving |
| `.claude/agents/markdown.md` persona | Internal | Green (present in the tree) | DeepSeek lacks the doc standard unless the persona is inlined |
| cli-devin with DeepSeek V4.1 Flash max | External | Yellow (not yet run) | Writes and fixes cannot run. Retry once, then stop that doc |
| cli-codex with GPT-6 Luna max fast | External | Yellow (not yet run) | Reviews cannot run. Retry once, then stop that review |
| sk-doc validators and scorer | Internal | Green (present in the tree, not yet run for this phase) | The gate cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc change breaks a validator that passed before, or a sweep edit states a behaviour that the code does not support.
- **Procedure**: Copy the pre-write copy from `scratch/pre-write/` back over the doc, rerun its validator and mark its row in `doc-inventory.md` as reverted with the reason.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Step | Depends On | Blocks |
|------|------------|--------|
| 1 Inventory | Phase 009 closed | 2, 3, 4 |
| 2 Search | 1 | 4, 5, 6, 7, 8 |
| 3 Playbook set | 1 | 7 |
| 4 Pre-write copies | 1 and 2 | 5, 6, 7, 8 |
| 5 to 8 Writes | 4 | 9 |
| 9 Review | 5 to 8 | 10 |
| 10 Fix review | 9 | 11 |
| 11 Validate each doc | 10 | 12, 13 |
| 12 Validate packages and search | 11 | 14 |
| 13 Validate phase 007 and 008 docs | 11 | 14 |
| 14 Close the packet | 12 and 13 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and search | Low | One orchestrator pass |
| Writes | High | Scales with the inventory row count, one dispatch per doc or group |
| Review and fix review | Medium | One review per written doc |
| Gates and close | Medium | Scales with the inventory row count |
| **Total** | | Not estimated in hours. The inventory sets the size. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-write copies saved to `scratch/pre-write/` before the first write
- [ ] Playbook set from step 3 recorded in `doc-inventory.md`
- [ ] Feature flag: not applicable, because the phase changes no runtime flag

### Rollback Procedure
1. Stop the current writer dispatch and leave its inventory row marked In Progress.
2. Copy the affected docs back from `scratch/pre-write/`.
3. Rerun the validator for each restored doc, and the package check for each restored package.
4. Record the rollback in `doc-inventory.md` with its reason.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The phase changes docs only.
<!-- /ANCHOR:enhanced-rollback -->
