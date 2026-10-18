---
title: "Implementation Plan: Claude relaunch loop"
description: "This plan orders the Claude relaunch work from transcript and hook evidence through tests, implementation, review, documentation and the live run. It keeps the 80% trigger and auto-compaction fallback from the approved plan."
trigger_phrases:
  - "Claude relaunch implementation plan"
  - "session relaunch lanes"
  - "Claude live relaunch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Claude relaunch loop

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS and ESM JavaScript plus Bash, using Node built-ins only. |
| **Framework** | Claude hook adapters, the session wrapper and the /speckit:handoff command. |
| **Storage** | Runtime state under XDG_RUNTIME_DIR or os.tmpdir(), handoff notes under the ignored Skilled state path and an append-only relaunch log. |
| **Testing** | node:test, Vitest, shellcheck, documentation validators and a detached tmux live run. |

### Overview
The phase adds the shared relaunch core, usage reader, CLI and killer before wiring Claude hooks and the wrapper. The 80% nudge prepares a handoff, Stop arms the pending state and the wrapper starts a fresh session with the claim seed after the prior session exits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented.
- [ ] Success criteria measurable.
- [ ] Dependencies identified.
- [ ] Lane 1.0 and 1.1 evidence available for Gate S1.
- [ ] Gate G1 has passed before any build dispatch.

### Definition of Done
- [ ] All ten acceptance-criteria seeds are Met.
- [ ] Gate PG passes from the final state.
- [ ] The phase docs have landed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A runtime-neutral Node core with thin Claude adapters and a Bash wrapper.

### Key Components
- relaunch-core.cjs validates and transitions handoff and relaunch state.
- context-usage.cjs reads the latest transcript usage fields and resolves the effective window.
- session-relaunch.cjs prepares, claims and completes a handoff.
- killer.cjs signals only an idle runtime process descended from the wrapper.
- Claude context-nudge.mjs, stop-arm.mjs, hook registry rows and skilled-loop connect the runtime.
- /speckit:handoff starts the manual handoff flow.

### Data Flow
Claude usage reaches the context reader. At or above 80%, the nudge directs the model to write the note, save the packet when bound and run prepare. Stop arms a pending relaunch and starts the killer. After the runtime exits, skilled-loop starts a fresh Claude session with the claim seed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a feature. The approved plan names no bug finding or remediation work, so the fix inventory does not apply.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Fix finding inventory | Not part of this feature phase. | N/A | Phase acceptance criteria and Gate PG. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Run the phases in order after the parent goal gate G1 passes. Spikes precede tests, tests precede builds, reviews follow builds, documentation follows reviews and Gate PG follows documentation.

### Dispatch Roles

| Actor | Phase 001 responsibility | Boundary |
|-------|--------------------------|----------|
| Orchestrator | Runs create.sh, authors the five goal files, sends the parent slice, dispatches and monitors lanes, records the ledger, runs vitest, tsx and live checks, accepts or rejects lane work. | Does not author lane code or docs before two failures. Does not revert or delete lane work. |
| Luna, cli-codex with gpt-6-luna at max effort and fast tier | Drafts spec docs, writes tests first, builds the shared core, CLI, killer, wrapper, Pi and OpenCode code, drafts docs through the named sk-doc modes and reviews SWE diffs read-only. | Does not run vitest or tsx checks and does not dispatch Codex from inside Codex. |
| SWE, cli-devin with swe-2-max and dangerous permission | Runs command-dependent spikes, builds Claude adapters and the command, reviews Luna diffs, runs the sk-code-opencode alignment review and probes Codex's runtime in spikes. | Does not probe its own runtime. |

### Lanes

| Lane | Actor | Deliverable and order |
|------|-------|-----------------------|
| 1.0 | You, read-only | Confirm usage fields from this session transcript, list project and user Stop registrations and inspect usage before compaction in a compacted transcript. |
| 1.1 | SWE | Run a throwaway headless Claude spike with a temporary hook that dumps PostToolUse and Stop stdin. Redact the output and add scratch/.gitignore. Do not edit checked-in settings. |
| Gate S1 | You | After lanes 1.0 and 1.1, record the PostToolUse and Stop payloads, usage field names, compaction verdict against 400000 of 500000 tokens and duplicate Stop registration result in implementation-summary.md. Gate S1 precedes lane 1.2. |
| 1.2 | Luna | Write all section 9 tests first for the core, CLI, context reader, Claude wrapper arm and killer. Use fixtures from lanes 1.0 and 1.1. Record a red run in the ledger before lane 1.3 starts. |
| 1.3 | Luna, then SWE review | Build relaunch-core.cjs, context-usage.cjs and session-relaunch.cjs. SWE reviews the Luna diff after the build. |
| 1.4 | Luna, then SWE review | Build killer.cjs and the Claude arm of skilled-loop. SWE reviews the Luna diff after the build. |
| 1.5 | SWE, then Luna read-only review | Build Claude adapters and registry rows, run sync-hook-registrations.cjs, then review the SWE diff. |
| 1.6 | SWE via sk-create-command, then Luna read-only review | Create /speckit:handoff and its mirrors, then run sync-runtime-mirrors.cjs and /doctor:runtime-mirrors. |
| 1.7 | Luna via the named sk-doc modes | Complete every document listed below with its mode-specific checks. |
| 1.8 | You | Run Gate PG from the final state, then run the live Claude relaunch. |

### Docs for 001

- Add all five switches to system-spec-kit/runtime/ENV-REFERENCE.md and .skilled/hooks/hook-flags.env.example. Add the kill-switch row to .skilled/hooks/README.md.
- Create .skilled/hooks/session-relaunch/README.md through sk-create-readme. Cover usage, the handoff protocol, relaunch-file states and troubleshooting.
- Update .skilled/hooks/README.md with the concern index, directory tree and coverage matrix row.
- Update .skilled/hooks/injection-contract.md with the nudge row.
- Update .skilled/bin/README.md for skilled-loop.
- Add a feature-catalog entry under system-spec-kit/feature-catalog/context-preservation/ and update the feature-catalog.md index through sk-create-feature-catalog.
- Add Claude scenarios in system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md and update the playbook index through sk-create-manual-testing-playbook. Mark each scenario automatable or live.

### Gate S1 Evidence Already Recorded

Lane 1.0 recorded the usage fields input_tokens, cache_creation_input_tokens and cache_read_input_tokens. The ledger records a proven verdict that 400000 tokens is below the observed compaction boundaries. It also records duplicate Stop registrations in project and user settings. Lane 1.1 still supplies the PostToolUse and Stop payload shapes.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core validation and transitions, CLI exit codes, context usage resolution, wrapper behavior and killer safety. | node:test with explicit files. |
| Integration | Hook registration rows and generated settings. | sync-hook-registrations.cjs --check and hook-registration-sync.vitest.ts. |
| Manual | Claude nudge, handoff states, wrapper hop and failure recovery. | Detached tmux session, tmux send-keys and tmux capture-pane. |

### Live-Run Procedure

1. Use a detached tmux session. Do not run the loop inside the current session. Leave SKILLED_LOOP_ID unset in the launcher environment.
2. Start SESSION_RELAUNCH_THRESHOLD=0.05 skilled-loop and send a prompt that triggers a tool call. Use tmux send-keys to enter the prompt and tmux capture-pane to read the pane.
3. Observe the nudge in the transcript, the note moving through open, claimed and done, one hop line in relaunch.log and a fresh session in the same pane carrying the claim seed.
4. Force a failure. Expect a notification and an unarmed file within 30 seconds.
5. Record the command, observed evidence and exit state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Captured lane 1.0 and 1.1 evidence | Phase gate | Lane 1.0 recorded in the ledger. Lane 1.1 is required for Gate S1. | Lane 1.2 cannot start until Gate S1 is complete. |
| Node built-ins | Runtime | Listed in the approved design. | The core and context reader must not add a build step or non-built-in dependency. |
| hook-registry.json and sync-hook-registrations.cjs | Repo runtime mirror | Used by the Claude adapters. | Registration acceptance cannot pass. |
| Claude hook and command mirrors | Runtime integration | Created by lanes 1.5 and 1.6. | Claude hooks and /speckit:handoff cannot pass their mirror checks. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hop fails or a killer cannot complete its idle-session action.
- **Procedure**: Auto-compaction stays as the fallback when a hop fails. After 30 seconds the killer gives up, unarms the file and sends a notification with the manual command. The plan defines no separate phase rollback.
### Phase Halts and Common Halts

| ID | Trigger | Action |
|----|---------|--------|
| H1 | The spike disproves that 80% lands before compaction. | Halt and report the numbers. Keep the 80% decision unchanged and stop the 001 build. |
| H2 | A target file is missing, "string not found", line numbers mismatch or a merge conflict appears. | Halt and report. |
| H3 | The repo contradicts a plan fact or two plan facts contradict each other. | Halt with LOGIC-SYNC REQUIRED and ask which truth prevails. |
| H4 | The same symptom survives three fixes. | Escalate the symptom, all three attempts, command evidence and two or three options with a recommendation. |
| H5 | A dispatch stalls. | Kill it by captured PID and re-dispatch once with a narrower brief. A second stall on the lane goes to H4. |
| H6 | Executor authentication, quota or installation fails. | Ask the operator to restore the named executor access. Do not substitute a model. |
| H7 | A lane diff is outside its file list or exits 0 with an empty diff. | Reject the lane and re-dispatch a narrower brief. |
| H8 | A sync or mirror run would change more than this plan's rows. | Do not accept generated output. Report the extra hunks. |
| H9 | A test shows a signal reaching a non-descendant PID or the wrapper acting without SKILLED_LOOP_ID. | Halt and report. Block the killer lane. |
| H10 | The live run cannot be driven even in tmux. | Record it, continue other work, provide the exact command and make no C3 completion claim. |
| H11 | A parent decision or criterion must change. | Amend the parent first, update the child and re-send the parent slice. |
| H12 | packet_budget is not ok. | Cut the goal file and recheck. Send nothing until it is ok. |
| H14 | A mandatory operator wait applies to workspace choice, Devin dangerous approval or a push. | Stop and ask. The ledger records the workspace and Devin approvals for this task. |
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Lane 1.0 | None | Gate S1 |
| Lane 1.1 | Lane 1.0 capture setup | Gate S1 |
| Gate S1 | Lanes 1.0 and 1.1 | Lane 1.2 |
| Lane 1.2 | Gate S1 | Lane 1.3 |
| Lanes 1.3 and 1.4 | Lane 1.2 tests | Lane 1.5 |
| Lane 1.5 | Lanes 1.3 and 1.4 | Lane 1.6 |
| Lane 1.6 | Lane 1.5 | Lane 1.7 |
| Lane 1.7 | Lane 1.6 | Lane 1.8 |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Lanes 1.0 to 1.8 | Not estimated | The approved plan gives no duration estimate. |
| **Total** | | **Not estimated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
N/A. The phase plan names no deployment backup or rollout flag.

### Rollback Procedure
The failure behavior is in the Phase Halts and Common Halts table. Auto-compaction remains the fallback when a hop fails.

### Data Reversal
- **Has data migrations?** The phase plan names none.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Lane 1.0 and lane 1.1 lead to Gate S1, then lane 1.2 tests, lanes 1.3 and 1.4 builds, lane 1.5 adapters, lane 1.6 command, lane 1.7 documentation and lane 1.8 Gate PG plus the live run.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Lanes 1.0 and 1.1 | None | S1 evidence | Lane 1.2 |
| Gate S1 | S1 evidence | Recorded payload and compaction verdict | Lane 1.2 |
| Lane 1.2 | Gate S1 | Tests and red-run evidence | Lanes 1.3 and 1.4 |
| Lanes 1.3 and 1.4 | Lane 1.2 | Reviewed core, CLI, killer and wrapper | Lane 1.5 |
| Lanes 1.5 and 1.6 | Prior reviewed builds | Claude adapters and handoff command | Lane 1.7 |
| Lane 1.7 | Reviewed code and command | Phase documentation | Lane 1.8 |
| Lane 1.8 | All earlier lanes | Gate PG and live-run evidence | Phase closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Lanes 1.0 and 1.1 establish the transcript and hook evidence.
2. Gate S1 records the evidence before tests start.
3. Lane 1.2 writes tests before lanes 1.3 and 1.4 build.
4. Lanes 1.5 and 1.6 finish the Claude hooks and command before lane 1.7 docs.
5. Lane 1.8 runs Gate PG and the live Claude hop.

**Total Critical Path**: No duration estimate is stated in the approved plan.

**Parallel Opportunities**:
- Parallel dispatch is allowed only for disjoint file lists.
- A review waits for the build it reviews.
- At most one Luna and one SWE dispatch may run at a time.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | S1 evidence ready | All four S1 answers recorded. | After lanes 1.0 and 1.1. |
| M2 | Test suite ready | Red run recorded before lane 1.3 and the explicit test suite passes. | Lane 1.2. |
| M3 | Core and wrapper reviewed | Core, CLI, killer and wrapper builds pass their named reviews. | Lanes 1.3 and 1.4. |
| M4 | Claude hooks and command reviewed | Registration and mirror checks pass at baseline or better. | Lanes 1.5 and 1.6. |
| M5 | Documentation ready | Each listed doc exists and passes its mode validator. | Lane 1.7. |
| M6 | Phase gate and live run | Gate PG passes and the Claude live hop is recorded. | Lane 1.8. |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: 80% trigger with compaction fallback

**Status**: Accepted

**Context**: The phase objective sets the trigger at 80% and keeps auto-compaction as the fallback when a hop fails.

**Decision**: Use the 80% trigger and leave autoCompactEnabled and autoCompactWindow unchanged.

**Consequences**:
- A successful hop can start a fresh Claude session in the same terminal.
- Auto-compaction remains available when a hop fails.

**Alternatives Rejected**:
- None are named in the approved plan.

---
