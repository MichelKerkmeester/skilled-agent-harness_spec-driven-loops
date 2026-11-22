---
title: "Implementation Plan: Phase 1: run-recorder-and-validator"
description: "Add one recorder that owns run folders, hand the conversation runner's output to it and make the validator fail a root without the results marker."
trigger_phrases:
  - "run recorder and validator plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: run-recorder-and-validator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, Markdown |
| **Framework** | Skilled sk-doc mode packet |
| **Storage** | Files under `<skill>/benchmark/reports/` |
| **Testing** | Self-running node test scripts, the fleet validator, `validate_document.py` |

### Overview
The recorder reuses the validator's own markdown walk and id extraction, so it accepts exactly the ids the validator sees. The runner may not write into the repository, so it leaves `scenario.json` in its `--out` folder and prints the recorder command. The validator moves only the marker check from warning to error and adds coverage as a report.
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
- [x] The three node test files exit 0 and the fleet validator exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One writer per artifact: the recorder is the only code that creates a run folder.

### Key Components
- **`record-playbook-run.cjs`**: plans the record, refuses on any problem, then writes three files and the index row.
- **`run-conversation-scenario.cjs`**: writes `scenario.json` and prints the `save results:` command.
- **`validate-playbook-package.cjs`**: fails a root without the marker, and reports coverage on request.

### Data Flow
A CSV or the runner's `--out` folder goes into the recorder. The recorder reads the playbook for its ids and writes into the sibling `benchmark/reports/`. The validator reads those `results.csv` files back for coverage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Fleet validator run in CI | Fails closed on violations | The marker is now a violation | `playbook-operator-contract.yml` runs `--strict`, which exits 0 after phase 2 |
| README audit manifest | Freezes durable directories | Regenerated | `test_readme_manifest.py` exits 0 |

Required inventories:
- Same-class producers: the recorder is the only writer of run folders. Harness runs write their own seven-file set and stay unchanged.
- Consumers of changed symbols: the runner imports `extractFeatureId` and `extractFrontmatter`, and the recorder imports `walkMarkdown` too.
- Matrix axes: CSV input and runner input, each with a new and an existing index.
- Algorithm invariant: a refused record writes nothing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the runner's `result.json` shape, the validator's id extraction and the run index formats. Implementation adds the recorder, the runner hand-off, the validator change and the docs. Verification runs the three node test files, the fleet validator and the doc validators. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Recorder happy path, refusals and runner hand-off | `tests/record-playbook-run.test.cjs` |
| Integration | Marker error and coverage through the CLI, runner `scenario.json` | The two existing test files |
| Manual | Fleet validator before and after | `validate-playbook-package.cjs --json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| tmux | External | Green | The runner tests that play the fake subject cannot run |
| Phase 2 backfill | Internal | Green | The fleet fails 11 roots until it lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate fails after the change, or the operator rejects it.
- **Procedure**: everything sits on branch `worktrees/514-playbook-run-recording`. Before a merge, `git checkout -- <file>` restores a tracked file and deleting the three new files undoes the rest. After a merge, `git revert` on the phase commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Recorder | The validator's exported helpers | Runner hand-off, docs |
| Marker error | Final template text | Phase 2 |
<!-- /ANCHOR:phase-deps -->

---
