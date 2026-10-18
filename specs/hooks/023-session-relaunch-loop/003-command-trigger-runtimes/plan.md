---
title: "Implementation Plan: Phase 3: command-trigger-runtimes"
description: "Spike verdicts per runtime, stub tests first, wrapper case arms, AUTO-gated adapters, command mirrors and docs for Codex, Cursor, Devin and Hermes."
trigger_phrases:
  - "command trigger runtimes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: command-trigger-runtimes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node built-ins only, `.cjs`/`.mjs` hooks (no build step); bash for `.skilled/bin/skilled-loop` |
| **Framework** | `.skilled/hooks/` concern pattern, `hook-registry.json` rendered by `sync-hook-registrations.cjs`, runtime mirrors via `sync-runtime-mirrors.cjs` |
| **Storage** | `${XDG_RUNTIME_DIR:-os.tmpdir()}/skilled-relaunch/` state dir; `.skilled/skills/.state/session-relaunch/handoffs/` notes (gitignored) |
| **Testing** | `node --test` on explicit `.test.cjs` files, vitest for adapter suites, `shellcheck` on the wrapper |

### Overview

Phase 3 proves how Codex, Cursor, Devin and Hermes enter the session-relaunch loop. A per-runtime spike captures the seed syntax, any firing event and the command-mirror form. Stub tests and wrapper case arms make the `/speckit:handoff` path work everywhere, and arm-plus-kill adapters exist only where the spike verdict is `AUTO`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (AC-001 to AC-005 in `acceptance-criteria.md`)
- [ ] Tests passing (`node --test` ends `# fail 0`, vitest suites green where adapters exist)
- [ ] Docs updated (spec/plan/tasks plus the lane 3.6 doc set)
- [ ] Gate PG items 1 to 10 pass from the final state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral core plus thin per-runtime adapters, the same shape as the sk-git preflight concern: one core under `.skilled/hooks/session-relaunch/`, one thin adapter dir per runtime.

### Key Components
- **`skilled-loop` case arms** (`.skilled/bin/skilled-loop`, bash): one arm per verified runtime. Each exports `SKILLED_LOOP_ID=$$`, runs the runtime in the foreground, and on exit relaunches with the seed `[session-relaunch] claim and continue handoff <path>` when `shouldRelaunch` passes. No resume flags.
- **Per-runtime adapter dirs** (`.skilled/hooks/session-relaunch/<runtime>/`): an arm hook that marks the pending file armed and spawns the killer. Built only where the verdict is `AUTO` and the event is confirmed to fire.
- **`hook-registry.json` rows and generated settings**: registered once and rendered by `sync-hook-registrations.cjs`.
- **`/speckit:handoff` mirrors**: the manual trigger in each runtime's verified form. Devin has no command-file system, so its form comes from the Devin spike.
- **`lib/killer.cjs`** (built in phase 001, reused unchanged): SIGTERM only to wrapper descendants when the session is idle, guarded by `SKILLED_LOOP_ID`.

### Data Flow
Handoff note written and `prepare` run, pending file recorded. The runtime exits. The wrapper checks `shouldRelaunch` (armed, under 10 minutes old, under 10 hops), cds to the recorded cwd and starts the runtime with the claim seed. The fresh session claims the note, then runs `/speckit:resume` when the note names a packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/skilled-loop` | Wrapper with the claude case arm from 001 | update: add one case arm per verified runtime | stub-runtime wrapper test per runtime |
| `.skilled/hooks/session-relaunch/<runtime>/` | Only `claude/` exists from 001 | update: add `AUTO` runtime adapter dirs | directory listing plus `hook-registry.json` rows |
| `hook-registry.json` and generated settings | Holds the 001 rows, `sync --check` green at baseline | update: add only this phase's rows | `sync-hook-registrations.cjs --check` exits 0, delta is this phase only |
| `/speckit:handoff` mirrors | Claude-era mirrors from 001 | update: add the spike-verified form per runtime | `sync-runtime-mirrors.cjs --check` at baseline or better |
| `.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/README.md` | Concern README and coverage index | update: runtime matrix and coverage rows | `validate_document.py` exits 0 |
| `feature-catalog/context-preservation/` and `manual-testing-playbook/plugins-and-hooks/` | Entry and scenario set from 001 | update: catalog row and one scenario doc per runtime | mode validators in plan section 11 item 6 |
| `lib/relaunch-core.cjs`, `lib/context-usage.cjs`, `lib/killer.cjs` | Core from 001 | unchanged: not a consumer of this phase | `node --test` stays at `# fail 0` |

Required inventories:
- Same-class producers: `rg -n 'case .* in|SKILLED_LOOP_ID' .skilled/bin/skilled-loop` before adding an arm.
- Consumers of changed rows: `rg -n 'session-relaunch' .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/ .claude .codex .cursor .devin` before registering.
- Matrix axes: the spike verdict matrix is the axis table: 4 runtimes x (seed, event, mirror form, verdict).
- Algorithm invariant: no adapter and no registry row may exist for a runtime without a captured firing event.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Ordered steps follow the lane table in the approved plan's phase 003 subsection. `tasks.md` owns the task checkboxes and task state.

### Actor roles (from plan section 4)

| Actor | Does here | Never does |
|-------|-----------|------------|
| **Orchestrator (Claude)** | Writes briefs, dispatches, monitors, keeps the ledger, runs every vitest, tsx and live check, accepts or rejects each lane, runs gate PG | Authors code or docs in a lane before two failures; reverts or deletes anyone's work |
| **Luna** (cli-codex, `gpt-6-luna`, max, fast) | Writes tests first, builds wrapper arms and `AUTO` adapters, writes docs through the named sk-doc modes, reviews SWE diffs read-only, probes Devin's runtime in the spike | Runs vitest or tsx checks; probes its own runtime |
| **SWE** (cli-devin, `swe-2-max`, `dangerous`) | Probes Codex, Cursor and Hermes in the spike, builds the command mirrors, reviews every Luna diff | Probes its own runtime |

### Ordered lanes

1. **Lane 3.1, spike.** SWE probes Codex, Cursor and Hermes. Luna probes Devin. Per runtime: the interactive seed syntax, whether a Stop or sessionEnd event fires (with a captured event), and the command-mirror form. Captures land in `scratch/`.
2. **Lane 3.2, tests first.** Luna writes stub-runtime wrapper tests per runtime, plus adapter tests only where the verdict is `AUTO`. A red run is recorded before build lanes start.
3. **Lane 3.3, wrapper arms.** Luna adds one `skilled-loop` case arm per verified runtime. SWE reviews the diff.
4. **Lane 3.4, adapters and registry.** Luna builds arm-plus-kill adapters and `hook-registry.json` rows only where the verdict is `AUTO` and the event is confirmed to fire. SWE reviews. Then `sync-hook-registrations.cjs` runs.
5. **Lane 3.5, command mirrors.** SWE writes `/speckit:handoff` mirrors in the form lane 3.1 found, then runs `sync-runtime-mirrors.cjs --check`.
6. **Lane 3.6, docs.** Luna lands the README runtime matrix, the catalog entry, scenarios per runtime and coverage rows through the named sk-doc modes.
7. **Lane 3.7, gate.** The orchestrator runs gate PG (plan section 11) from the final state.

### Spike verdict model

| Verdict | Meaning | Consequence |
|---------|---------|-------------|
| `AUTO` | Seed syntax, firing event and mirror form all verified with evidence | Wrapper arm plus adapter plus registry row |
| `COMMAND-ONLY` | Usage, nudge or arm is unverified | Command trigger only, no automatic artifact |
| `BLOCKED` | The seed cannot be verified | Command trigger only, no automatic artifact |

For `COMMAND-ONLY` or `BLOCKED`, build nothing automatic for that runtime, record why, and apply H13.

### Halts that apply (from plan section 8)

| ID | Trigger | Action |
|----|---------|--------|
| H2 | Target file missing, "string not found", line numbers mismatch, or a merge conflict | Halt and report |
| H3 | A plan fact contradicts the repo or another plan fact | Halt and ask: "LOGIC-SYNC REQUIRED: [A] contradicts [B]. Which truth prevails?" |
| H4 | The same symptom survives three fixes | Escalate with symptom, attempts, evidence and options |
| H5 | A dispatch is stalled (15 min no growth, or 60 min wall clock) | Kill by PID, re-dispatch once narrower; second stall goes to H4 |
| H6 | Executor auth, quota or install failure | Ask the operator to run `codex login` or `devin auth login`; never substitute a model |
| H7 | Diff outside the lane file list, or exit 0 with an empty diff | Reject and re-dispatch narrower; second rejection counts toward H4 |
| H8 | A sync or mirror run would change more than this phase's rows | Do not accept the generated output; report the extra hunks |
| H9 | A test shows a signal reaching a non-descendant pid, or the wrapper acting without `SKILLED_LOOP_ID` | Halt and report; block the killer-touching lane |
| H13 | A runtime's spike verdict is `COMMAND-ONLY` or `BLOCKED` | Ship that runtime on the command trigger only, record it, report PARTIAL at closure |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Stub wrapper | One stub runtime per verified runtime: seed text, cwd change, no resume flag, decline on stale or unarmed file, hop cap | `node --test` with a stub on PATH |
| Adapter | Nudge once at or above threshold and arm only on a pending file, `AUTO` runtimes only | vitest in the `.opencode/plugins/tests/` style where the runtime uses one |
| Sync checks | Registry and mirror trees | `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` |
| Shell | `.skilled/bin/skilled-loop` | `shellcheck` run directly (no `.sh` extension) |
| Gate | PG items 1 to 10 from plan section 11 | orchestrator-run commands |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 core (`relaunch-core.cjs`, `context-usage.cjs`, `session-relaunch.cjs`, `killer.cjs`, `skilled-loop`, `/speckit:handoff`) | Internal | Yellow (001 in flight) | No build lane can start |
| `hook-registry.json` plus `sync-hook-registrations.cjs` | Internal | Green | No adapter registration |
| `sync-runtime-mirrors.cjs` | Internal | Green | No mirror landing |
| `codex` CLI (Luna's executor) | External | Green (G0.3 logged in) | Luna lanes stop; H6 |
| `devin` CLI (SWE's executor) | External | Green (G0.3 logged in) | SWE lanes stop; H6 |
| `shellcheck`, `node` | External | Green | Test and gate lanes stop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a sync run changes more than this phase's rows (H8), or a verdict flips a runtime out of `AUTO`.
- **Procedure**: remove the added case arms, adapter dirs, registry rows and mirror files, then rerun `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check`. No commits exist in this run, so nothing needs git-level reverts; rejected diffs are re-dispatched narrower, never restored.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Lane 3.1 (spike) ──► Lane 3.2 (tests) ──► Lanes 3.3, 3.4, 3.5 (build) ──► Lane 3.6 (docs) ──► Lane 3.7 (gate PG)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Spike (3.1) | Phase 001 artifacts | Tests, all build lanes |
| Tests (3.2) | Spike fixtures | Build lanes |
| Build (3.3, 3.4, 3.5) | Tests plus verdicts | Docs, gate |
| Docs (3.6) | Build results and the verdict matrix | Gate |
| Gate PG (3.7) | All lanes | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Spike (3.1) | High | 4 runtime probes with captured evidence |
| Tests (3.2) | Med | Stub harness plus fixtures |
| Build (3.3-3.5) | Med | Small arms, adapters and mirrors |
| Docs (3.6) | Med | Four doc deliverables via sk-doc modes |
| Gate (3.7) | Low | Orchestrator-run checks |
| **Total** | | **One autonomous run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `git status --porcelain` and the G0.5 numbers are in the run ledger
- [ ] `SYSTEM_SESSION_RELAUNCH_DISABLED` kill switch still honored
- [ ] `git add -N` run on new files before the drift-guard gate

### Rollback Procedure
1. Disable the concern with `SYSTEM_SESSION_RELAUNCH_DISABLED`
2. Remove this phase's arms, adapters, registry rows and mirrors
3. Rerun both sync CLIs with `--check` and confirm exit 0
4. Report the rollback in the run ledger

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; state files under the tmp state dir and `.skilled/skills/.state/` are gitignored and disposable
<!-- /ANCHOR:enhanced-rollback -->


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────────────┐     ┌──────────────┐     ┌──────────────┐
│  Lane 3.1    │────►│  Lane 3.2    │────►│  Build lanes            │────►│  Lane 3.6    │────►│  Lane 3.7    │
│  spike x4    │     │  tests first │     │  3.3 arms, 3.4 AUTO     │     │  docs        │     │  gate PG     │
│              │     │              │     │  adapters, 3.5 mirrors  │     │              │     │              │
└──────────────┘     └──────────────┘     └─────────────────────────┘     └──────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spike (3.1) | 001 artifacts | Verdict matrix, captures | All later lanes |
| Tests (3.2) | Spike fixtures | Red-then-green suite | Build lanes |
| Wrapper arms (3.3) | Verified seeds | `skilled-loop` case arms | Gate |
| Adapters (3.4) | `AUTO` verdicts plus firing events | Adapter dirs, registry rows | Docs matrix |
| Mirrors (3.5) | Spike mirror forms | `/speckit:handoff` mirrors | Docs matrix |
| Docs (3.6) | Build outcomes | README matrix, catalog, scenarios, coverage | Gate |
| Gate PG (3.7) | All lanes | ACCEPTED phase | Phase 004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Lane 3.1 spike** - four runtime probes - CRITICAL
2. **Lane 3.2 tests** - stub wrapper suite - CRITICAL
3. **Lanes 3.3 and 3.4 build** - arms plus adapters - CRITICAL
4. **Lane 3.5 mirrors** - command form per runtime - CRITICAL
5. **Lane 3.6 docs** - four doc deliverables - CRITICAL
6. **Lane 3.7 gate PG** - section 11 checks - CRITICAL

**Total Critical Path**: all seven lanes run in order inside one autonomous run

**Parallel Opportunities**:
- Luna and SWE may run concurrently only when their lane file lists do not overlap, per the operator's parallel answer
- The four spike probes split across SWE (Codex, Cursor, Hermes) and Luna (Devin)
- A review always waits for the build it reviews
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Spike matrix complete | Four rows with quoted evidence and verdicts | Lane 3.1 done |
| M2 | Tests green and builds landed | `# fail 0`, arms and `AUTO` adapters in place | Lanes 3.2 to 3.5 done |
| M3 | Docs landed | Matrix, catalog, scenarios and coverage pass validators | Lane 3.6 done |
| M4 | Gate PG passed | Section 11 items 1 to 10 verified from the final state | Lane 3.7 done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Command trigger is the baseline for all four runtimes

**Status**: Accepted

**Context**: Codex, Cursor, Devin and Hermes expose no usage signal, so the threshold nudge cannot fire for them.

**Decision**: `/speckit:handoff` is the entry point on every one of the four runtimes unless a spike verifies an automatic event.

**Consequences**:
- The trigger is identical across runtimes and needs no signal
- Operators on `COMMAND-ONLY` or `BLOCKED` runtimes must run the command by hand

**Alternatives Rejected**:
- Guessing an event per runtime: rejected because an adapter that never fires is worse than a manual trigger, and the plan forbids unverified automation

### ADR-002: Adapters only where a captured event fires

**Status**: Accepted

**Context**: A registry row for an event that never fires leaves dead hooks and a false sense of coverage.

**Decision**: Arm-plus-kill adapters and registry rows exist only where the spike captured the event firing and the verdict is `AUTO`. Cursor `stop` is not wired because the Cursor event list has no `stop` event.

**Consequences**:
- Every shipped adapter is backed by captured evidence
- Runtimes without evidence stay on the command trigger

**Alternatives Rejected**:
- Shipping adapters on documentation claims alone: rejected, the plan requires a captured event

### ADR-003: Probe assignment keeps workers off their own runtime

**Status**: Accepted

**Context**: A worker probing the runtime it runs inside would contaminate the spike evidence.

**Decision**: SWE probes Codex, Cursor and Hermes; Luna probes Devin.

**Consequences**:
- Spike evidence describes the runtime from outside it
- Devin's probe runs under Codex, the only other executor

**Alternatives Rejected**:
- Each worker probing its own runtime: rejected, it violates the plan's rule

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target files match the lane file lists above
- [ ] Know the verification command for the task before starting it
- [ ] Confirm the runtime being probed is not the worker's own runtime

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute lanes in order: spike, tests, build, docs, gate; parallel work only on disjoint file lists |
| TASK-SCOPE | Touch only the files the lane names; a diff outside the list is rejected (H7) |
| TASK-VERIFY | The orchestrator reruns the lane's checks from the final state; a worker's DONE claim is not acceptance |
| TASK-EVIDENCE | Every verdict and gate claim carries a command, an exit code and a quoted artifact |

### Status Reporting Format

`STATUS <gate> | <phase/lane> | evidence: <cmd> rc=<n> | open halts: <ids or none> | next: <lane>`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact and the halt id in the run ledger
3. Continue with the next unblocked lane; a second stall on the same lane goes to H4
<!-- /ANCHOR:ai-execution -->

---

