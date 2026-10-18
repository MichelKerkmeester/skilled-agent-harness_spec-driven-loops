---
title: "Implementation Plan: Phase 8: doctor-and-ci"
description: "Write a battery with one leg per check, fixture tests for each leg, a route doc, and a CI workflow. Two live probes settle the v1 load trigger and the v2 service rule before any battery code is written."
trigger_phrases:
  - "doctor and ci plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: doctor-and-ci

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (`.cjs`) for the battery and its tests. YAML for the workflow. Markdown for the route doc. |
| **Framework** | None. The battery uses Node built-ins and `node:test`. |
| **Storage** | The battery writes its JSON summary and its response files to the output path only. |
| **Testing** | `node --test` on the battery's fixture suite, run by `run-all.sh`. Live battery runs, the broken-copy proof and actionlint, all run by the orchestrator. |

### Overview
The battery has two legs, one per family. The v1 leg lists the plugin files, reads the log bytes that a load trigger appends, and classifies each plugin. The v2 leg reads the plugin and skill lists from a running service through the raw query, and it repeats the read within a fixed bound. Each leg returns one of four results: PASS, FAIL, DEGRADED or SKIP. The exit code follows the result. The CI workflow installs each pinned package into its own prefix and runs the battery with `--json`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The v1 load trigger is settled (Q4), or the phase records that the v1 leg will report DEGRADED.
- [ ] The v2 service rule is settled (Q5). Without a decision, the CI leg does not get wired.
- [ ] Q1 is answered. The route entry is either written or held in the log.

### Definition of Done
- [ ] Every acceptance criterion is Met or Waived with an ADR.
- [ ] The battery exits 0 on 1.19.3 with family v1, and exits 0 on 2.0.32 with family v2, from a live run recorded in the log.
- [ ] The broken-copy run exits 1 and names the plugin.
- [ ] actionlint exits 0 with no output on the workflow.
- [ ] The workflow is untracked, unstaged and unpushed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A collector reads the world, and pure leg functions judge the record. The fixture tests drive the leg functions with records and never start a real binary. The live run drives the collector against the installed binaries.

### Key Components
- **Family selector**: runs `--version` on the candidates `$OPENCODE_BIN`, `opencode`, `opencode2`, and keeps the one whose parsed major matches the requested family. It refuses when two candidates report the same major and the family is not decided.
- **v1 collector**: runs `opencode debug config` with stdin closed and XDG_DATA_HOME in a temporary folder, writes the output to a file, and reads the plugin specs. It then runs the import harness in a child node process, which loads each top-level plugin file through its v1 entry and prints one JSON line per file (amended at build time, `scratch/decisions.txt` 2).
- **v2 collector**: starts a private `opencode2 serve --port <free>` with OPENCODE_DB and XDG_DATA_HOME in a temporary folder, reads the listening line and the password from its stdout, reads `/api/plugin` and `/api/skill` through `opencode2 api --server` with the password in OPENCODE_PASSWORD, repeats the plugin read until two consecutive non-zero counts match within the bound, and stops the server on every exit path (amended at build time, `scratch/decisions.txt` 3 and 6).
- **Legs**: `plugin-load` (v1), `plugin-active` (v2), `skill-visible` (v2), and `family-present` (both). Each returns PASS, FAIL, DEGRADED or SKIP with a reason.
- **Reporter**: prints one line per leg, or the JSON summary with `--json`. The exit code is the worst result: crash 2, then fail 1, then degraded or skipped 3, then pass 0.

### Data Flow
Arguments reach the family selector. The selector returns a binary and its major. The matching collector writes its raw output and returns a record. Each leg reads the record and returns a result. The reporter prints the results, and the exit code follows the worst result.

### Applicability matrix (required rows, listed before implementation)

| Row | Input | Result |
|-----|-------|--------|
| R1 | family v1, all plugin files listed and each loaded | PASS |
| R2 | family v1, one plugin file missing from the list | FAIL, naming the file |
| R3 | family v1, the harness reports one plugin failed (import throws, no v1 entry, or the entry returns no object) | FAIL, naming the plugin and the reason |
| R4 | family v1, `debug config` exits non-zero or prints no parseable JSON | FAIL |
| R5 | family v1, the harness prints no parseable line for a plugin | DEGRADED |
| R6 | family v2, every plugin `active` | PASS |
| R7 | family v2, one plugin with another status | FAIL, naming the plugin and status |
| R8 | family v2, counts never equal across the bounded reads | DEGRADED |
| R9 | family v2, the private server prints no listening line or no password in time | DEGRADED, and the server is stopped |
| R15 | family v2, a top-level plugin file with no `/api/plugin` entry under the root | FAIL, naming the file |
| R10 | family v2 requested, only a v1 binary found | SKIP for v2, never FAIL |
| R11 | family both, one family installed | SKIP for the missing family |
| R12 | zero plugin files | FAIL |
| R13 | output path not writable | exit 2 |
| R14 | unknown argument | usage text, exit 2 |

Each row maps to one test in the fixture suite.

### Required inventories
- The plugin list: the top-level `.opencode/plugins/*.js` files, counted at run time. The number 16 is not written into the battery.
- The version rule: the parse in 006 (`^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$`). The battery holds its own copy, and its fixture test uses the same list of version strings as 006.
- The exit taxonomy: 0 pass, 1 fail, 2 usage or crash, 3 degraded or skipped. This matches the doctor battery convention in iteration-017.

Adversarial table for the parser and the family selector:

| Case class | Input | Expected |
|------------|-------|----------|
| Delimiter | `1.19.3\r\n` | major 1 |
| Joined input | `1.19.3 2.0.32` | major 1, the first token wins |
| Outside root | a `--root` without `.opencode/plugins` | FAIL, naming the root |
| No-op | empty `--version` output | candidate skipped, and the family is SKIP |
| Fallback | the probe throws | candidate skipped, never assumed |
| Hostile root | `--root` with spaces and `$(id)` in its name | one argv entry, and no shell runs |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase adds a battery, a route doc and a workflow. It changes no existing behaviour. The route entry in `_routes.yaml` is a change to an existing file, and it waits for Q1.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and their state.

### 4.1 Ordered steps

1. **Probe the v1 trigger (Orchestrator).** Find one command that loads the repo's plugins and needs no model call (Q4). Candidates: `opencode debug agent <name>`, and a `run` under the guard's escape. Record the log size before and after, and the lines that appear. Save the output under `scratch/probes/`. Rollback: delete `scratch/probes/`.
2. **Probe the v2 service rule (Orchestrator).** With a read-only process listing, check whether a service runs. If one runs, read `/api/plugin` to a file. Do not run any command that could start a service. If none runs, record that the leg reads SKIP by default, and stop for a decision if a start is needed. Rollback: none, because this step only reads.
3. **Decisions (Orchestrator).** Settle Q1 to Q9 from steps 1 and 2, and amend spec.md where a probe changed the design. A missing Q5 decision stops the workflow step. Rollback: restore the amended document from its last copy.
4. **Red tests (Luna).** Write the fixture suite for rows R1 to R14, the adversarial table, and the probe-count case. Rollback: delete the test file.
5. **Red run (Orchestrator).** Run the suite and record the first failing assertion for each row. Rollback: none, because this step only reads.
6. **Battery (Luna).** Write `opencode-version-battery.cjs` with the collector, the legs and the reporter. Rollback: delete the file.
7. **Battery doc (DeepSeek).** Document the battery in `.skilled/command-support/doctor/scripts/README.md`, from the leg list and the exit taxonomy in the battery, in place of the route doc, which waits for Q1 (`scratch/decisions.txt` 15). Rollback: restore the README from its copy.
8. **Doc review (Luna).** Check the README section against the battery's flags, legs and exit codes. Make no edits. Rollback: none.
9. **Workflow (Luna).** Write `.github/workflows/opencode-dual-version.yml` with a matrix over `opencode-ai@1.19.3` and `@opencode/cli@2.0.32`, each in its own npm prefix, and a `both` job for isolation. Upload the JSON summary as an artifact. Rollback: delete the file.
10. **Code review (DeepSeek).** Review the battery, its tests and the workflow against `sk-code/sk-code-opencode`, findings first. Make no edits. Rollback: none.
11. **Fixes (Luna).** Fix each confirmed P0 and P1 finding. Copy each file to `scratch/backup/fix-<n>/` first. Rollback: restore from that copy.
12. **Route entry (Luna, only after Q1).** Add the `/doctor:opencode` entry to `_routes.yaml`, or leave the task `[B]`. Copy the file first. Rollback: restore `_routes.yaml` from that copy.
13. **Green run (Orchestrator).** Run the fixture suite through `run-all.sh`. Record the output. Rollback: none.
14. **Live battery, v1 (Orchestrator).** Run the battery with `--family=v1 --json` against the installed 1.19.3 binary, and save the output. Rollback: delete the output under `scratch/`.
15. **Live battery, v2 (Orchestrator).** Run the battery with `--family=v2 --json` against the installed 2.0.32 binary, which starts and stops its own private server, and save the output. Rollback: delete the output under `scratch/`.
16. **Broken copy (Orchestrator).** Copy the plugin folder and `opencode.json` into `scratch/broken-root/`, break one plugin in the copy, and run the battery with the copy as its root. Expect exit 1 and the plugin named. Rollback: delete `scratch/broken-root/`.
17. **Lint (Orchestrator).** Run actionlint on the workflow. Rollback: none.
18. **Process check (Orchestrator).** Compare the process list before and after steps 14 to 16. Expect no change. Rollback: none.
19. **Final state (Orchestrator).** Confirm the workflow is untracked and unstaged, and nothing was pushed. Delete `scratch/`. Rollback: none.

### 4.2 Dispatch plan

- **Luna, GPT-6 Luna max fast through cli-codex.** Steps 4, 6, 9, 11 and 12. Code and the workflow.
- **DeepSeek, DeepSeek V4.1 Flash max through cli-devin.** Steps 7 and 10. The route doc, and the code review.
- **Orchestrator.** Steps 1, 2, 3, 5, 8 (the review of the doc), 13 to 19, and every live run. The live runs start real OpenCode processes, and the Pi guard blocks a nested `opencode run`.
- **Cross-family rule.** DeepSeek reviews Luna's code (step 10). Luna reviews DeepSeek's doc (step 8).

### 4.3 Live run rules

- Each live run uses a read-only process listing before and after, and records both.
- The v2 read uses `GET` only.
- The v1 legs read `debug config` and the import harness; 1.19.3 has no plugin log line to window (`scratch/decisions.txt` 2).
- The battery never runs inside a Pi session. The orchestrator runs it from a shell.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture unit | Rows R1 to R14, the adversarial table, the probe-count case | `node --test`, run through `run-all.sh` |
| Live | The v1 and v2 legs against the installed binaries | The orchestrator, running the battery |
| Negative | The broken copy | The orchestrator, running the battery against `scratch/broken-root/` |
| Workflow lint | The workflow | `actionlint` |
| Route validation | The route entry, if written | `route-validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A v1 load trigger (Q4) | External | Unknown until step 1 | The v1 leg reports DEGRADED |
| A running v2 service (Q5) | External | Unknown until step 2 | The v2 leg reports SKIP |
| Plugins 002 and 003 | Internal | Not started | The battery reports FAIL on unported plugins |
| actionlint | External | Installed, 1.7.12 | The workflow cannot be linted |
| `run-all.sh` | Internal | Present | The fixture suite does not run in the doctor set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the battery returns a wrong result on a known-good install, or a live run changes a process or an install.
- **Procedure**: delete the battery, its tests, the route doc and the workflow, and restore `_routes.yaml` from its copy. Stop the phase and report any process or install change to the operator. Do not use `git checkout` on `_routes.yaml`, because the worktree holds other uncommitted work.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Step 1 (Probe v1) ──┐
Step 2 (Probe v2) ──┴──► Step 3 (Decisions) ──► Step 4 (Red tests) ──► Step 5 (Red run) ──► Step 6 (Battery)
                                                                                                  │
                    Step 7 (Route doc) ──► Step 8 (Doc review)                                    │
                    Step 9 (Workflow) ───────────────────────────────────┐                        │
                                                                         ▼                        ▼
                                              Step 10 (Review) ──► Step 11 (Fixes) ──► Step 13 (Green run)
                                                                                                  │
                                              Steps 14 to 16 (Live and broken copy) ◄─────────────┘
                                                                                                  │
                                              Step 17 (Lint) ──► Step 18 (Process check) ──► Step 19 (Final state)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Probes and decisions | None | Every code step |
| Battery and tests | Decisions | Live runs |
| Route doc and workflow | Decisions | Lint |
| Live runs | Green run | Final state |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Probes and decisions (steps 1 to 3) | Medium | Two orchestrator probes, one decision pass |
| Core implementation (steps 4 to 9) | High | Three Luna dispatches, one DeepSeek dispatch |
| Verification (steps 10 to 19) | High | One review, one fix dispatch, and the live and lint runs |
| **Total** | | **About six dispatches and four orchestrator passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The probe outputs are saved under `scratch/probes/` (steps 1 and 2).
- [ ] `_routes.yaml` is copied to `scratch/backup/` before any change to it (step 12).
- [ ] No feature flag exists. The battery, the route doc and the workflow are new, so the rollback is deletion.

### Rollback Procedure
1. Delete the battery, its tests, the route doc and the workflow.
2. Restore `_routes.yaml` from `scratch/backup/` if step 12 ran.
3. Confirm the process list matches its state before the live runs.
4. Report the failing leg and its reason to the operator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The battery writes only to `scratch/` and to the output path.
<!-- /ANCHOR:enhanced-rollback -->
