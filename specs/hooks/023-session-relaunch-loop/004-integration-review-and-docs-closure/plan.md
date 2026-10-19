---
title: "Implementation Plan: Phase 4: integration-review-and-docs-closure"
description: "Orders the packet-closing work: a read-only cross-phase review, verified fix dispatches, the doc rollup, doc-quality scans, final live runs on AUTO runtimes and the closure checks."
trigger_phrases:
  - "integration review and docs closure plan"
  - "session relaunch closure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: integration-review-and-docs-closure

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs plus the changed code under review: CommonJS and ESM JavaScript, Bash and TypeScript from phases 001 to 003. |
| **Framework** | The sk-doc modes named per doc: sk-create-readme, sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-quality-control and sk-create-with-human-voice. |
| **Storage** | The spec packet docs, `scratch/run-ledger.md` and the G0.5 baseline recorded in it. |
| **Testing** | `node --test` and vitest re-runs, the doc validators and scans, the sync and drift checks, detached tmux live runs and `validate.sh` recursive strict. |

### Overview
The phase reviews the union of files changed by phases 001 to 003 under a read-only instruction, verifies every P0 and P1 finding before dispatching one fix per confirmed finding, then lands the doc rollup and the quality pass. It finishes with a live run per AUTO-verdict runtime and the closure checks, ending in the final honest status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented.
- [ ] Success criteria measurable.
- [ ] Dependencies identified.
- [ ] Phases 001 to 003 are Done, so the union of changed files and the recorded spike verdicts exist.
- [ ] The G0.5 baseline numbers are in the ledger.

### Definition of Done
- [ ] All five acceptance-criteria seeds are Met.
- [ ] Gate PG and the 004 closure list pass from the final state.
- [ ] The rollup docs have landed and every touched doc passes its validators.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only review, an orchestrator-verified fix loop, then the doc rollup, scans, live runs and closure, ordered so a fix never dispatches on an unverified finding.

### Key Components
- **SWE review**: a read-only pass over the union of changed files. Each finding carries a severity, a file and line, and a repro.
- **Orchestrator verification and fix loop**: every P0 and P1 finding is verified before one fix per confirmed finding is dispatched to Luna, one change each, then a re-review.
- **Luna doc lanes**: the root README mention, the spec-kit README continuity section and the final catalog and playbook indexes through the named sk-doc modes, then `sk-create-quality-control` and `sk-create-with-human-voice` over every doc touched.
- **Orchestrator evidence**: reruns of the doc scans, the per-AUTO-runtime live runs, Gate PG and the closure list.

### Data Flow
The union of changed files feeds the review. Confirmed findings feed one fix dispatch each, then a re-review. The rollup docs feed their mode validators and the scans. The AUTO verdicts feed the live runs. Everything feeds recursive strict validation and the final honest status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Lane 4.2 dispatches fixes for confirmed review findings, so each confirmed finding gets this inventory inside its fix brief before the fix lands.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Union of changed files | The producer under review | Update through one fix dispatch per confirmed finding | Re-review after each fix |
| Rollup docs and indexes | Consumers recording the feature | Update per the lane 4.3 doc list | Mode validators plus the lane 4.4 scans |
| Packet docs | Consumers holding evidence | Update with review, live-run and closure evidence | `validate.sh --strict` plus the reconciled metadata check |

Required inventories per confirmed finding:
- Same-class producers: `rg -n '<finding literal, helper or pattern>' <changed module or files>` inside the fix brief.
- Consumers of changed symbols: `rg -n '<changedSymbol or constant>' . --glob '*.ts' --glob '*.js' --glob '*.md'` inside the fix brief.
- Matrix axes: the fix brief lists the independent input axes and the required rows before the fix lands.
- Algorithm invariant: a fix touching path handling, redaction, parsing or process signalling states the invariant and its adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Run the lanes in order after phases 001 to 003 are Done. Review precedes fixes, fixes precede the doc rollup, docs precede live runs and live runs precede closure.

### Dispatch Roles

| Actor | Phase 004 responsibility | Boundary |
|-------|--------------------------|----------|
| Orchestrator | Verifies every P0 and P1 finding before any fix, dispatches one fix per confirmed finding, reruns the doc scans, runs the live runs, Gate PG and the closure list, accepts or rejects each lane and sends the final honest status. | Does not author lane code or docs before two failures. Does not revert or delete lane work. |
| Luna, cli-codex with gpt-6-luna at max effort and fast tier | Receives one fix dispatch per confirmed finding, one change each. Lands the doc rollup through the named sk-doc modes and runs `sk-create-quality-control` and `sk-create-with-human-voice` over the touched docs. | Does not run vitest or tsx checks. Does not dispatch Codex from inside Codex. |
| SWE, cli-devin with swe-2-max and dangerous permission | Runs the cross-phase review over the union of changed files under a read-only instruction and runs the phase 004 review per the roles table. | Does not probe its own runtime. Review dispatches use `--sandbox read-only`. |

### Lanes

| Lane | Actor | Deliverable and order |
|------|-------|-----------------------|
| 4.1 | SWE | Cross-phase review of the union of changed files under a read-only instruction. Every finding carries a severity, a file and line, and a repro. |
| 4.2 | You, then Luna | Verify every P0 and P1 finding yourself, since a finding is a hypothesis. Dispatch one fix per confirmed finding, one change each, then re-review. The P2 findings are listed. |
| 4.3 | Luna via the named sk-doc modes | Root `README.md` mention of `skilled-loop` through the normal README mode, the system-spec-kit `README.md` continuity section and the final catalog and playbook indexes. |
| 4.4 | Luna, then you | `sk-create-quality-control` over every doc touched and the human-voice pass through `sk-create-with-human-voice`. You rerun the scans. |
| 4.5 | You | The final live run on every runtime whose verdict is AUTO, using the live-run procedure from phase 001. |
| 4.6 | You | Closure: the checks listed below. |

### Spike Verdict Model

The verdict model is defined in phase 002 and applied in phase 003, and this phase only consumes it: AUTO when the usage signal, nudge API, arm event and seed are all verified, COMMAND-ONLY when usage, nudge or arm is unverified, and BLOCKED when the seed cannot be verified. Lane 4.5 live-runs every runtime whose verdict is AUTO. For COMMAND-ONLY or BLOCKED, nothing automatic ships, the reason is already recorded and H13 applies at closure.

### Closure List (lane 4.6, from the final state)

- `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` gives RESULT: PASSED.
- Every acceptance-criteria row has evidence.
- Completion metadata is reconciled across spec, tasks, implementation-summary and goal files.
- Task-created temporary output is removed. Scratch evidence stays only if summarized in the implementation summary and gitignored.
- Every file changed against baseline belongs to a lane file list.
- Send a final honest status naming the one thing that is the operator's to do, or say nothing is.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Review | The union of changed files from phases 001 to 003 | Read-only cross-phase review, each finding carrying a severity, a file and line, and a repro |
| Regression | The suites and sync checks after confirmed fixes land | `node --test` on explicit files, `npx vitest`, `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check`, the drift guards and `shellcheck` |
| Doc quality | Every doc touched by the packet | `validate_document.py`, `extract_structure.py` DQI, `hvr_scan.py`, `audit_readmes.py`, `check_no_hyphenated_catalog_content.py` and `validate-playbook-package.cjs` |
| Live | Each runtime whose verdict is AUTO | Detached tmux, `tmux send-keys` and `tmux capture-pane` |

### Live-Run Procedure

The phase 001 procedure, run once per AUTO runtime:

1. Use a detached tmux session. Do not run the loop inside the current session. Leave `SKILLED_LOOP_ID` unset in the launcher environment.
2. Start `SESSION_RELAUNCH_THRESHOLD=0.05 skilled-loop` and send a prompt that triggers a tool call. Use `tmux send-keys` to enter the prompt and `tmux capture-pane` to read the pane.
3. Observe the nudge in the transcript, the note moving through open, claimed and done, one hop line in `relaunch.log` and a fresh session in the same pane carrying the claim seed.
4. Force a failure. Expect a notification and an unarmed file within 30 seconds.
5. Record the command, observed evidence and exit state per runtime.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 to 003 deliverables and recorded spike verdicts | Phase gate | Required before lane 4.1 | Nothing to review and no AUTO list for lane 4.5 |
| G0.5 baseline numbers | Ledger record | Recorded in `scratch/run-ledger.md` | The sync, mirror, drift and scope deltas lose their comparison point |
| `codex` and `devin` CLIs | Executor | Logged in at G0.3 | Review, fix and doc lanes cannot dispatch (H6) |
| `tmux` | Live-run driver | Installed | Lane 4.5 live runs cannot be driven (H10) |
| sk-doc modes and shared scripts | Doc pipeline | In repo | The rollup docs and the scans cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A confirmed fix regresses a baseline check or a live run fails.
- **Procedure**: Reject the lane and re-dispatch a narrower fix against the same files. Never run `git checkout`, `restore`, `reset` or `stash` and never delete files, since the tree holds unrelated uncommitted work. Auto-compaction stays as the relaunch fallback when a hop fails.

### Applicable Halts

| ID | Trigger | Action |
|----|---------|--------|
| H2 | A target file is missing, "string not found", line numbers mismatch or a merge conflict appears. | Halt and report. |
| H3 | The repo contradicts a plan fact or two plan facts contradict each other. | Halt with LOGIC-SYNC REQUIRED and ask which truth prevails. |
| H4 | The same symptom survives three fixes. | Escalate the symptom, all three attempts, command evidence and two or three options with a recommendation. |
| H5 | A dispatch stalls. | Kill it by captured PID and re-dispatch once with a narrower brief. A second stall on the lane goes to H4. |
| H6 | Executor authentication, quota or installation fails. | Ask the operator to restore the named executor access. Do not substitute a model. |
| H7 | A lane diff is outside its file list or exits 0 with an empty diff. | Reject the lane and re-dispatch a narrower brief. |
| H8 | A sync or mirror run would change more than this plan's rows. | Do not accept generated output. Report the extra hunks. |
| H9 | A test or a live run shows a signal reaching a non-descendant PID or the wrapper acting without `SKILLED_LOOP_ID`. | Halt and report. Block the killer lane. |
| H10 | The live run cannot be driven even in tmux. | Record it, continue other work, provide the exact command and make no C3 completion claim. |
| H11 | A parent decision or criterion must change. | Amend the parent first, update the child and re-send the parent slice. |
| H12 | `packet_budget` is not ok. | Cut the goal file and recheck. Send nothing until it is ok. |
| H13 | A runtime's spike verdict is COMMAND-ONLY or BLOCKED. | Ship that runtime on the command trigger only. Record it and report PARTIAL at closure. |
| H14 | A mandatory operator wait applies to workspace choice, Devin dangerous approval or a push. | Stop and ask. The ledger records the workspace and Devin approvals for this task. |
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review and fixes (lanes 4.1, 4.2) | Phases 001 to 003 Done | Docs, live runs and closure |
| Doc rollup and quality pass (lanes 4.3, 4.4) | Confirmed fixes re-reviewed | Live runs and closure |
| Live runs (lane 4.5) | The doc rollup | Closure |
| Closure (lane 4.6) | All earlier lanes | Packet Done |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Lanes 4.1 to 4.6 | Not estimated | The approved plan gives no duration estimate. |
| **Total** | | **Not estimated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
N/A. The phase plan names no deployment backup or rollout flag.

### Rollback Procedure
The failure behavior is in the Applicable Halts table. A rejected lane is re-dispatched narrower rather than reverted.

### Data Reversal
- **Has data migrations?** The phase plan names none.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Lane 4.1 feeds the verified fixes of lane 4.2, lanes 4.3 and 4.4 land the rollup and the scans, lane 4.5 records the live runs on AUTO runtimes and lane 4.6 closes the packet. Gate PG runs after the last lane from the final state.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Lane 4.1 review | Phases 001 to 003 Done | Finding report | Lane 4.2 |
| Lane 4.2 fixes | Verified findings | Re-reviewed fixes | Lanes 4.3 and 4.4 |
| Lanes 4.3 and 4.4 | Confirmed fixes | Rollup docs and scan results | Lane 4.5 |
| Lane 4.5 | The doc rollup | Live-run records per AUTO runtime | Lane 4.6 |
| Lane 4.6 | All earlier lanes | Closure evidence and the final status | Packet Done |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Lane 4.1 reviews the union of changed files.
2. Lane 4.2 verifies findings and lands the confirmed fixes.
3. Lanes 4.3 and 4.4 land the rollup docs and the quality pass.
4. Lane 4.5 records the live runs on AUTO runtimes.
5. Lane 4.6 runs the closure list, then Gate PG and the status line.

**Total Critical Path**: No duration estimate is stated in the approved plan.

**Parallel Opportunities**:
- Parallel dispatch is allowed only for disjoint file lists.
- A review waits for the build it reviews, and here a re-review waits for its fix.
- At most one Luna and one SWE dispatch may run at a time.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Review report landed | Every finding has a severity, a file and line, and a repro | Lane 4.1 |
| M2 | Findings resolved | No confirmed P0 or P1 open and P2 findings listed | Lane 4.2 |
| M3 | Doc rollup landed | Indexes equal the files on disk and touched docs pass their validators | Lanes 4.3 and 4.4 |
| M4 | Live runs recorded | One live-run record per AUTO runtime | Lane 4.5 |
| M5 | Packet closed | Recursive strict validation RESULT: PASSED and the final status sent | Lane 4.6 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Findings are hypotheses until verified

**Status**: Accepted

**Context**: A reviewer's severity label is a claim about the code, and a fix dispatched on an unverified finding can churn the tree.

**Decision**: The orchestrator verifies every P0 and P1 finding before dispatching one fix per confirmed finding, one change each, then re-reviews.

**Consequences**:
- No fix dispatches on noise.
- Each confirmed finding gets its own dispatch, which adds an orchestrator verification step per finding.

**Alternatives Rejected**:
- None are named in the approved plan.

---

### ADR-002: Live runs only on AUTO verdicts

**Status**: Accepted

**Context**: The 002 and 003 spikes assign each runtime a verdict of AUTO, COMMAND-ONLY or BLOCKED.

**Decision**: Lane 4.5 runs the final live run on every runtime whose verdict is AUTO. COMMAND-ONLY and BLOCKED runtimes ship on the command trigger only and H13 reports PARTIAL at closure.

**Consequences**:
- Live-run evidence exists only where an automatic trigger is verified.
- A runtime without an AUTO verdict still enters the loop through `/speckit:handoff`.

**Alternatives Rejected**:
- None are named in the approved plan.

---
