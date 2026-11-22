---
title: "Implementation Plan: Phase 3: hub-reports-destination"
description: "Add an opt-in --reports flag to the recorder and the conversation runner, guard it so a run cannot land outside its owning hub, then point the three affected playbook roots at it and save the cli-mistral-vibe verdicts as recorder reports."
trigger_phrases:
  - "hub reports destination plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: hub-reports-destination

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS `.cjs`) and Markdown |
| **Framework** | Skilled manual testing playbook packages |
| **Storage** | Run folders under `benchmark/reports/` (`results.csv`, `README.md`, `source.md`) and the reports index |
| **Testing** | The recorder, runner and package validator test files, and `validate-playbook-package.cjs --package` |

### Overview
The recorder gains one optional flag that names a hub's reports folder. The flag is checked before any write, so a path outside the owning hub is refused. The conversation runner forwards the flag into the save command it prints. The three playbook roots then name the flag, and the 25 cli-mistral-vibe blocks move into recorder-written report folders.
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
- [x] `node scripts/tests/record-playbook-run.test.cjs` exits 0 and `node --test scripts/tests/run-conversation-scenario.test.cjs` reports `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
An opt-in destination on an existing writer. The default path does not change, and the flag only moves the owner.

### Key Components
- **`resolveReports(playbookRoot, reports)`**: returns the owner skill, the reports folder and a refusal reason when the path is not `benchmark/reports` or its skill does not contain the playbook.
- **`record-playbook-run.cjs --reports DIR`**: calls `resolveReports` before any write and names the owning hub in the index and `source.md` when the flag is set.
- **`run-conversation-scenario.cjs --reports DIR`**: adds the flag to the `save results:` command it prints.

### Data Flow
The runner writes `scenario.json` and its output. The printed save command carries `--reports`. The recorder resolves the owner, writes the run folder under that owner's `benchmark/reports/` and adds a row to its index. A playbook root names the same command, so an operator copies a working line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase adds a destination and does not fix a reported defect. The consumers of the changed command are listed for the record.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `record-playbook-run.cjs` | Writes run folders | Update: adds `--reports` | `record-playbook-run.test.cjs` exits 0 |
| `run-conversation-scenario.cjs` | Prints the save command | Update: forwards `--reports` | `run-conversation-scenario.test.cjs` reports `fail 0` |
| The three playbook roots | Name the save command | Update: name `--reports` | `validate-playbook-package.cjs --package` exits 0 for each |
| `validate-playbook-package.cjs` | Reads the results block marker | Unchanged | Exits 0 with no violations on the three roots |

Required inventories:
- Same-class producers: `rg -n -- "'--reports'|--reports" .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts` lists the recorder and runner.
- Consumers of changed symbols: `rg -n 'resolveReports' .skilled/skills/sk-doc` lists the recorder, its export and its test.
- Matrix axes: flag set or unset; the path inside or outside the owner; the path ending in `benchmark/reports` or not.
- Algorithm invariant: N/A. No parser or path resolver changed beyond the refusal rules above.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the recorder's default destination, the runner's printed command and the three roots' current result blocks. Implementation adds `--reports` to the recorder and runner, points the roots at it, moves the 25 cli-mistral-vibe blocks and documents the flag. Verification runs the three test files, the package validator on the three roots and the count of blocks left in the scenario files. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveReports` and the recorder's refusal rules | `record-playbook-run.test.cjs` (`runHubReports`, 8 assertions) |
| Integration | The runner's printed save command, and the package validator on the three roots | `run-conversation-scenario.test.cjs`, `validate-playbook-package.cjs --package <root>` |
| Manual | A dry run into the sk-code hub | `record-playbook-run.cjs --dry-run --reports .skilled/skills/sk-code/benchmark/reports` exits 0 and writes nothing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js (runs the `.cjs` scripts and their tests) | External | Green | No recorder or test run |
| Phase 1 recorder and runner hand-off | Internal | Green | The flag has no base to extend |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a test in the three suites fails, or a playbook root stops validating.
- **Procedure**: nothing is committed. Restore each listed file with `git checkout --` from HEAD, which puts the 25 cli-mistral-vibe blocks back into their scenario files, and remove the two new report folders and the reports index by hand after reading them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 recorder and runner | Implementation |
| Implementation | Setup reads | Verification |
| Verification | Implementation | The operator's commit |
<!-- /ANCHOR:phase-deps -->

---
