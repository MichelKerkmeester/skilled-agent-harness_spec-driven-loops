---
title: "Implementation Plan: Phase 3: manual-runner"
description: "Build the `bots` CLI and a runner that follows the research.md §8 order for the manual trigger, importing loop-lock, the executor audit and the append gateway from system-deep-loop. Add the needs-you decision queue and one allowlist entry. Prove each stop layer and refusal with a fixture bot."
trigger_phrases:
  - "manual runner plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: manual-runner

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CLI, TypeScript runtime modules, matching `system-deep-loop/runtime/` |
| **Framework** | None. Imports from `system-deep-loop/runtime/lib/` |
| **Storage** | Switches, leases, needs-you items and the generation stamp under the user-level state root that phase 1 fixes. Run folders under the resolved Skilled tree at `.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`, which git ignores |
| **Testing** | Vitest, as the deep-loop runtime uses, plus fixture bots under the tests folder |

### Overview
Create a `bots` CLI and a runner that runs one manual bot in a shared checkout in the research.md §8 order. The runner reuses the deep-loop lease, executor audit, append gateway and heartbeat rather than writing its own. A run that needs a person parks as a needs-you item, and the bot's other runs are held while it is open. Phase 5's `bots answer` turns the answer into a `resume` request, and this runner starts the resumed run. Each stop layer, refusal and record field is proven with a fixture bot and a test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 1 is closed: its record schema, state-root layout, `awaiting-decision` exit and item schema exist in its packet

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The phase test suite run under Vitest exits 0, and `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` prints nothing
- [ ] The deep-loop suite reports the same pass count before and after the allowlist entry
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin CLI, ordered pipeline.

### Key Components
- **`bots` CLI** (`.skilled/bin/bots.cjs`): parses the verb and id, exits loudly on an unknown option and calls the runner, the switch writer or the needs-you module. It exits with one code for a refusal before dispatch, one for a run failure and one for `awaiting-decision`.
- **Runner**: walks the §8 order and releases the lease in a `finally` path, including on a signal. It returns the refusal or run outcome to its caller and writes the generation stamp after each terminal record.
- **Posture validator**: maps the declared isolation and sandbox class against the executor kind and refuses what cannot be honored.
- **Switches**: write and read the disable and pause files under the state root.
- **Dispatch**: builds the allowlisted environment, sets `SKILLED_BOT_RUN_ID`, writes the exemption, the bound spec folder and the decision-marker rule into the prompt, applies `timeoutSeconds` and records budget reach. It parses the `[NEEDS-DECISION]` marker from the captured output. It exports the body-secret predicate for phase 2's checker.
- **Needs-you**: writes one item per parked run, reads items with expiry applied, tells the runner whether a bot has an open item for the hold and builds the resumed prompt. Phase 5's `bots answer` records answers (operator decision D12).

### Data Flow
The CLI resolves the bot id to its `BOT.md`. The runner reads the disable switch, takes the lease, reads the pause file, runs the precheck and validates posture. It then writes the dispatch snapshot, dispatches headless through a `cli-external-orchestration` packet and appends one result event through the append gateway. The run record at `<state root>/<identity key>/records/<run id>.json` names the ledger, receipt and observability locations in the run folder under `<skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/<run id>/`. Before the lease, the runner refuses a bot that has an open needs-you item with the cause `awaiting-decision-hold`. When the output holds a decision marker, the runner writes one item under `<state root>/<identity key>/needs-you/` and ends as `awaiting-decision`. The runner then rewrites the generation stamp under `<state root>/<repository identity>/`. Phase 5's `bots answer` records the answer on the item, rewrites the stamp and enqueues one `resume` request. Phase 5's drain later hands that request to the runner, which starts a new run with the resumed prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase builds new behavior and fixes no reported finding. One shared surface changes, so it is listed here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `EXECUTOR_COMMON_ENV_ALLOWLIST`, `executor-audit.ts:150`, read by `isAllowedExecutorEnvKey` at `:304` | Owned by `system-deep-loop`. Decides which parent keys reach every non-native child | Update: add `SKILLED_BOT_RUN_ID` | T025 and the deep-loop suite in T023 |
| Callers of `buildExecutorDispatchEnv`: `runtime/scripts/dispatch-iteration.cjs`, `runtime/scripts/fanout-run.cjs`, `.skilled/commands/deep/assets/deep-review.yaml`, `.skilled/commands/deep/assets/deep-research.yaml` | Dispatch deep-loop children | Unchanged. They never set the key, so the child sees nothing new | `rg -n 'SKILLED_BOT_RUN_ID' .skilled` lists only the allowlist and the bots skill |
| Tests: `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, `executor-audit-receipts.test.ts`, `executor-audit-cli-branch-receipts.test.ts` | Pin allowlist and dispatch behavior | Unchanged, rerun | Same pass count before and after |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the phase 1 record schema and the five deep-loop modules this phase imports. Implementation creates the CLI, switches, posture validator, dispatch, runner and needs-you module in that order. Verification runs each fixture bot and the test suite and checks every record and item field.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Posture matrix, switch paths, environment allowlist, secret-literal detector, failure classing, decision-marker parser, item expiry | Vitest |
| Integration | `bots run` on fixture bots: happy path, disabled, paused, failing and `[SILENT]` precheck, unhonorable posture, concurrent run, killed run, timeout, decision marker, open-item hold. `bots inbox` on fixture items, and a direct runner call with a `resume` request | Vitest driving the CLI |
| Manual | One real manual bot against one admitted executor kind, then a read of its run record | Terminal |

Tests point the state root and the Skilled-tree root at temp folders, so no fixture run writes into the real `.skilled/skills/.state/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-contracts-and-state-root` | Internal phase | Yellow: planned | The runner has no record schema, item schema or state root to write to |
| `system-deep-loop/runtime/lib/deep-loop/` (loop-lock, executor-config, executor-audit, lifecycle-taxonomy) | Internal library | Green: exists | Lease and dispatch audit would need reimplementing |
| `system-deep-loop/runtime/lib/mode-append-gateway/` | Internal library | Green: exists | Retry by ledger replay is not possible |
| `cli-external-orchestration` packets | Internal skill | Green: exists | No headless dispatch path |

Phase 2 runs in parallel and is not a dependency. Phases 4 and 5 depend on this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run writes outside its run folder, the state root or its bound spec folder, a switch fails to stop a run or the deep-loop suite regresses.
- **Procedure**: revert the phase's commits. New code is additive under `.skilled/skills/system-skilled-bots/` and `.skilled/bin/bots.cjs`. The one deep-loop change is the `SKILLED_BOT_RUN_ID` entry, and removing it restores the allowlist. Delete the fixture state root and the fixture Skilled-tree root used by the tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read `spec.md`, this plan and `tasks.md` before the first edit.
- Confirm the task's files sit under `.skilled/skills/system-skilled-bots/`, `.skilled/bin/bots.cjs` or the one allowlist line.
- Know the task's verify command before starting it.

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in the order of the dependency graph below |
| TASK-SCOPE | Touch only the files the task names. Report anything else as a finding |
| TASK-VERIFY | Run the task's verify command and read its output before marking it done |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` with the blocking fact beside it.
2. Continue with the next unblocked task.
3. Escalate after two blocked tasks or two failed fixes for the same symptom.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close, and the start of phases 4 and 5 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│   CLI    │──►│ Switches │──►│ Posture  │──►│ Dispatch │
└──────────┘   └──────────┘   └──────────┘   └────┬─────┘
                                                  │
                                            ┌─────▼─────┐   ┌───────────┐
                                            │  Runner   │──►│ Needs-you │
                                            └───────────┘   └───────────┘
```

Phase 5 sits outside this graph. Its drain and its `bots answer` call into the runner and the needs-you module (operator decision D12).

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| CLI | Phase 1 | Verb parsing and exit codes | Every other component's CLI test |
| Switches | CLI | Disable and pause files | Runner |
| Posture | Phase 1 definition format | Honored posture or refusal | Runner |
| Dispatch | Posture, allowlist entry | Child run, marker parse, body-secret predicate | Runner, phase 2 |
| Runner | Switches, posture, dispatch | Terminal record, stamp, refusal outcome | Needs-you, phases 4 and 5 |
| Needs-you | Runner | Items, the open-item check for the hold, resumed prompt | Phase 7 rows, phase 5's `bots answer` |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup and CLI (T001 to T006)** - about half a day - CRITICAL
2. **Dispatch and runner (T009 to T014, T024 to T026)** - about two days - CRITICAL
3. **Needs-you and hold (T027 to T029, T034) and verification (T015 to T023, T031, T032)** - about one and a half days - CRITICAL

**Total Critical Path**: about four days of build after phase 1 closes. No task waits on a later phase.

**Parallel Opportunities**:
- Switches (T007) and posture (T008) can run at the same time.
- Setup reads T002 to T005 can run at the same time.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | First end-to-end manual run | `bots run <fixture-id>` exits 0 and `records/` holds one terminal record that points to its run folder | After phase 1 closes |
| M2 | Phase closed | Every row in `acceptance-criteria.md` is `Met` or `Superseded`. Phases 4 and 5 may start | After M1 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions live in `decision-record.md`: ADR-001 (decision queue, Accepted), ADR-002 (posture matrix, Proposed), ADR-003 (body-secret detection, Proposed), ADR-004 (retry by ledger replay, Proposed) and ADR-005 (run marker allowlist entry, Accepted).

---
