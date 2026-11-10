---
title: "Implementation Plan: Phase 9: sk-code-opencode-alignment"
description: "Review every changed code file against the sk-code OPENCODE surface, fix the P0 and P1 findings through Luna, have DeepSeek review each fix, then run the gates."
trigger_phrases:
  - "sk code opencode alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: sk-code-opencode-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ESM), shell, JSON and YAML config |
| **Framework** | OpenCode plugin host (v1 1.19.3 and v2 2.0.32) on Node.js |
| **Storage** | None |
| **Testing** | `node --test` for the plugin and dispatch suites, vitest for the deep-loop runtime and the four sk-code drift guards |

### Overview
This phase reads the 002 to 008 diffs and reviews each changed code file findings-first against the sk-code-opencode language checklists. Luna writes the fixes for every P0 and P1 finding in short batches. DeepSeek reviews each fix diff, and the orchestrator runs the drift guards, the comment-hygiene check and every suite that phases 002 to 008 touched.

Amended at the start of the build (scratch/decisions.txt 0): the operator asked for DeepSeek wherever possible, so DeepSeek reviewed the 002 to 006 code and wrote every fix, and Luna reviewed the 007 and 008 code and each fix diff. Steps 5, 6, 8, 9 and 10 below name the original executors.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 002 to 008 are closed and their diffs are readable
- [ ] The phase 001 baseline file exists and holds a count for every suite
- [ ] The Files to Change table in spec.md matches the 002 to 008 diffs

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, with evidence
- [ ] `findings.md` lists no P0 or P1 finding with status Open
- [ ] Every touched suite passes at or above its baseline count
- [ ] Spec, plan and tasks match what was done
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Review, fix, review, gate. A findings ledger drives the fix batches, and each fix batch gets a cross-family review before its rows close.

### Key Components
- **Findings ledger (`findings.md`)**: One row per finding, with severity, finding class, file, status and evidence.
- **Fix batch**: One Luna dispatch that edits only the files named in the ledger rows it closes.
- **Review dispatch**: One DeepSeek dispatch that returns findings or confirms a fix. It writes nothing to the repo.
- **Gate runner**: The orchestrator's own runs of `run-all-drift-guards.sh`, `check-comment-hygiene.sh` and the touched suites.

### Data Flow
The 002 to 008 diffs feed the inventory. The inventory feeds the review dispatches, and their findings enter the ledger. The orchestrator assigns each P0 and P1 row to a fix batch. Luna edits the code, DeepSeek reviews the diff and the orchestrator reruns the affected gate before it marks the row Closed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes findings, and some of them touch path handling and the version parser, so this addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Changed code files from phases 002 to 008 | Own the plugin, guard, runtime and install behaviour | Update only where a P0 or P1 finding names the file | `run-all-drift-guards.sh` and the suite for each file |
| Same-class producers | Other files that repeat the defect pattern | Inventory first, then fix the same class in the same batch | The `rg` output saved in `findings.md` |
| Consumers of changed symbols | Callers and tests of a changed function or constant | Update, or record as unchanged with the grep result | The `rg` output saved in `findings.md` |
| Version parser in `fanout-run.cjs` (phase 006) | Parses `--version` output into a major version | Check the algorithm invariant below | The parser unit tests |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`, run once for each finding class that has a P0 or P1 row.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.js' --glob '*.cjs' --glob '*.mjs' --glob '*.sh'`.
- Matrix axes: language (JavaScript, shell, JSON and YAML) times finding class. Each changed file gets one row, and the row count is written into `findings.md` before the review starts.
- Algorithm invariant: `1.19.3` and `opencode v2.0.32` parse to majors 1 and 2. Output that does not parse is refused, never guessed. Adversarial cases for the parser:
  - an empty string
  - a binary name with no version
  - a version with a suffix such as `-rc.1`
  - a path that contains `1.`
  - output that prints two version strings

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered Steps and Dispatch Plan

Each step names its executor. The orchestrator runs every gate and every suite itself, because the codex sandbox cannot run them all. Steps 5, 6 and 10 are the cross-family reviews. DeepSeek reviews code that Luna wrote in phases 002 to 008, and it reviews each Luna fix. Each dispatch brief covers one batch of related findings and stays short.

1. **Inventory (orchestrator).** Run `git status --short` and `git diff --stat` for the 002 to 008 changes. Reconcile the Files to Change table in spec.md. Create `findings.md` with its header and one row per changed file. Rollback: delete `findings.md` if the phase is abandoned.
2. **Baseline (orchestrator).** Copy each suite's pass count from `../001-unknowns-and-baseline/baseline.json` into `findings.md`. Read only, so no rollback applies.
3. **Pre-fix copies (orchestrator).** Copy each changed file into `scratch/pre-fix/` before its first fix batch. Rollback: copy the saved file back over the repo file, then rerun its suite.
4. **Gate baseline (orchestrator).** Run `run-all-drift-guards.sh` and `check-comment-hygiene.sh` on the changed files before any fix, and record the exit codes. Read only, so no rollback applies.
5. **Review, JavaScript files (DeepSeek through cli-devin).** One dispatch per plugin or runtime group. The brief loads `sk-code` in review mode (`sk-code/sk-code-review`) with the sk-code-opencode surface bundled, names its JavaScript checklist and asks for findings-first output. The reviewer returns text, and the orchestrator writes the rows. Read only, so no rollback applies.
6. **Review, shell and config files (DeepSeek through cli-devin).** The brief loads `sk-code` in review mode with the sk-code-opencode surface bundled, names the shell and config checklists and asks for findings-first output. Read only, so no rollback applies.
7. **Classify findings (orchestrator).** Read each cited line, confirm or reject each finding and assign its severity and finding class. A finding is a hypothesis until its line is read. Rollback: none, this step edits ledger rows only.
8. **Fix batch, JavaScript (Luna through cli-codex).** One brief per batch of related P0 and P1 rows. The brief names the files, the rows and the adversarial cases. Luna edits only the named files and adds tests in the file's test folder. Rollback: copy the pre-fix copy back from `scratch/pre-fix/`, then rerun the affected suite.
9. **Fix batch, shell and config (Luna through cli-codex).** The same brief rules as step 8. Rollback: copy the pre-fix copy back from `scratch/pre-fix/`, then rerun the affected gate.
10. **Fix review (DeepSeek through cli-devin).** A cross-family review of each fix diff against the finding it claims to close. Read only, so no rollback applies.
11. **Close rows (orchestrator).** Mark a row Closed only after the orchestrator reruns the gate or suite that the finding names, and reads its output and exit status. Rollback: set the row back to Open in `findings.md`.
12. **Gates (orchestrator).** Run `run-all-drift-guards.sh`, the hygiene check on the final file set and every touched suite. Compare each count with the baseline. A failing gate sends its finding back to step 8 or 9. This step changes no repo file.
13. **Close the packet (orchestrator).** Run `validate.sh` on this folder with `--strict`, fill `implementation-summary.md` and the acceptance rows and clear `scratch/` as CHK-051 requires. Rollback: this step edits only files in this folder, so restore any row or summary line from the text in `findings.md`.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Plugin tests from phases 002 and 003, and dispatch tests from phase 005 | `node --test` on the test files those phases added |
| Integration | Deep-loop runtime suites touched by phase 006 | `npm test` in `.skilled/skills/system-deep-loop/runtime/` (vitest) |
| Gate | Drift guards and comment hygiene | `run-all-drift-guards.sh` and `check-comment-hygiene.sh` |
| Manual | Not applicable | The review reads code and runs no user journey, so no browser check applies |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002 to 008 closed | Internal | Yellow (pending) | The file list and the review cannot start |
| `001-unknowns-and-baseline/baseline.json` | Internal | Yellow (pending) | Suite counts cannot be compared |
| cli-codex with GPT-6 Luna max fast | External | Yellow (not yet run) | Fix batches cannot run. Retry once, then stop the step |
| cli-devin with DeepSeek V4.1 Flash max | External | Yellow (not yet run) | Reviews cannot run. Retry once, then stop the step |
| sk-code-opencode drift guards and hygiene checker | Internal | Green (present in the tree, not yet run for this phase) | The gate cannot run. Repair the guard before the phase closes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix breaks a suite that passed at baseline and one batch cannot repair it, or a gate fails after the phase closes.
- **Procedure**: Restore each changed file from its pre-fix copy in `scratch/pre-fix/`, set the affected ledger rows back to Open, rerun the suite and the gate and record the rollback in `findings.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Step | Depends On | Blocks |
|------|------------|--------|
| 1 Inventory | Phases 002 to 008 closed | 2, 3, 4 |
| 2 Baseline | 1 and the phase 001 baseline | 12 |
| 3 Pre-fix copies | 1 | 8, 9 |
| 4 Gate baseline | 1 | 5, 6 |
| 5 and 6 Reviews | 4 | 7 |
| 7 Classify | 5 and 6 | 8, 9 |
| 8 and 9 Fixes | 3 and 7 | 10 |
| 10 Fix review | 8 and 9 | 11 |
| 11 Close rows | 10 | 12 |
| 12 Gates | 2 and 11 | 13 |
| 13 Close the packet | 12 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and baseline | Low | One orchestrator pass |
| Reviews | Medium | Scales with the changed file count from the 002 to 008 diffs |
| Fix batches and fix review | High | Scales with the count of P0 and P1 findings |
| Gates and close | Medium | Scales with the suite count in the baseline |
| **Total** | | Not estimated in hours. The 002 to 008 diffs set the size. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-fix copies saved to `scratch/pre-fix/` before the first fix batch
- [ ] Baseline counts copied from `001-unknowns-and-baseline/baseline.json`
- [ ] Feature flag: not applicable, because the phase changes no runtime flag

### Rollback Procedure
1. Stop the current fix batch and leave its ledger rows Open.
2. Copy the affected files back from `scratch/pre-fix/`.
3. Rerun the affected suite and `run-all-drift-guards.sh`.
4. Record the rollback in `findings.md` with its reason.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The phase changes code only.
<!-- /ANCHOR:enhanced-rollback -->
