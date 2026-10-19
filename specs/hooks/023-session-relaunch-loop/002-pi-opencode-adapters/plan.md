---
title: "Implementation Plan: Pi and OpenCode adapters"
description: "The plan verifies each runtime's usage, nudge and arm events, interactive seed and name flags and plugin directory before adapter work. Luna writes tests first, builds only work supported by the spike and receives a SWE review before Gate PG."
trigger_phrases:
  - "Pi and OpenCode adapters plan"
  - "phase 002 implementation plan"
  - "Pi OpenCode Gate PG"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Pi and OpenCode adapters

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Pi adapter uses TypeScript. The OpenCode plugin language is not set in the approved plan. |
| **Framework** | Pi extension API and OpenCode plugin API, as verified in lane 2.1. |
| **Storage** | The shared relaunch core owns relaunch state and handoff notes. |
| **Testing** | Adapter tests use Vitest. Gate PG includes the Pi load smoke and OpenCode import smoke. |

### Overview
Lane 2.1 records the Pi and OpenCode event shapes, APIs, seed and name flags and plugin locations. Lanes 2.2 to 2.6 add tests, verified adapters and wrapper arms, then update the runtime docs. Lane 2.7 runs Gate PG and the Pi and OpenCode smoke checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase scope and six acceptance criteria are recorded in spec.md and acceptance-criteria.md.
- [ ] Lane 2.1 evidence is available before tests use its fixtures.
- [ ] The shared core from Phase 1 is the target for the Pi and OpenCode adapters.

### Definition of Done
- [ ] The runtime verdicts and their evidence follow the model in spec.md.
- [ ] Tests and smoke checks pass.
- [ ] The phase documentation and runtime docs pass their validators.
- [ ] Gate PG passes with an explicit RESULT: PASSED.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A runtime-neutral core with thin runtime adapters.

### Key Components
- Pi TypeScript adapter under .skilled/hooks/session-relaunch/pi/ and its relative .pi/extensions/ symlink.
- OpenCode plugin in the directory lane 2.1 verifies and its browsability symlink under session-relaunch/opencode/.
- Wrapper case arms for runtimes whose seed and name flags lane 2.1 verifies.

### Data Flow
Lane 2.1 captures each runtime's payload and verifies its APIs. Lane 2.2 uses those fixtures in adapter tests. The Pi and OpenCode adapters use the verified nudge and arm APIs with the shared core. The wrapper starts a runtime only when lane 2.1 verifies its seed and name flags.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds runtime adapters and documentation. The approved plan names no bug fix or review finding for this phase, so this addendum does not apply.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Pi runtime | Supplies lane 2.1 evidence for usage, nudge, arm, seed and name flags and plugin location. | Verify in lane 2.1. | Approved plan §7.2, AC-2.1 evidence. |
| OpenCode runtime | Supplies lane 2.1 evidence for usage, nudge, arm, seed and name flags and plugin location. | Verify in lane 2.1. | Approved plan §7.2, AC-2.1 evidence. |
| Shared relaunch core | Receives the verified runtime adapters. | Use the existing core. | Approved plan §6 and §7.2. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Actor Roles

| Actor | Phase 2 role |
|-------|--------------|
| SWE | Runs the Pi and OpenCode spike in lane 2.1 and reviews each Luna build before acceptance. |
| Luna | Writes tests first, builds the Pi and OpenCode adapters and verified wrapper arms, then updates docs through the matching sk-doc modes. |
| Orchestrator | Accepts or rejects lanes, runs the Vitest and runtime checks and owns Gate PG, including the Pi load smoke and OpenCode import smoke. |

### Ordered Lane Steps

| Step | Lane | Actor | Deliverable |
|------|------|-------|-------------|
| 1 | 2.1 | SWE | Spike for Pi and OpenCode. Verify usage event shape, nudge API, arm event, interactive seed and name flags and real plugin directory. Record evidence as help output, source quotes or captured events. |
| 2 | 2.2 | Luna | Write adapter tests first, using lane 2.1 fixtures and the .opencode/plugins/tests/*.test.cjs style. |
| 3 | 2.3 | Luna, then SWE review | Build the Pi TypeScript adapter under .skilled/hooks/session-relaunch/pi/ and the relative .pi/extensions/ symlink. |
| 4 | 2.4 | Luna, then SWE review | Build the OpenCode plugin and its browsability symlink under session-relaunch/opencode/. |
| 5 | 2.5 | Luna, then SWE review | Add wrapper case arms only for runtimes whose seed and name flags lane 2.1 verifies. |
| 6 | 2.6 | Luna | Update concern README runtime rows, the catalog entry, Pi and OpenCode scenarios and coverage matrix rows through the matching sk-doc modes. |
| 7 | 2.7 | Orchestrator | Run Gate PG, the Pi load smoke and the OpenCode import smoke. |

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Pi and OpenCode adapter fixtures and wrapper behavior. | npx vitest run --config .skilled/hooks/vitest.config.ts <test files> |
| Integration | Pi offline load smoke. | pi --offline --approve -p "list your available tools" </dev/null |
| Integration | OpenCode plugin import smoke. | node -e "import('<plugin path>').then(()=>console.log('ok'))" |
| Manual | Pi and OpenCode playbook scenarios. | Run scenarios and record results under the plan's Gate PG procedure. |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 shared relaunch core | Internal | Used by this phase | Adapter work cannot target the planned shared core. |
| Pi and OpenCode event and plugin evidence | Runtime | Lane 2.1 verifies it | Unverified usage, nudge or arm support receives COMMAND-ONLY. An unverified seed receives BLOCKED. H13 then uses the command trigger only. |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Lane 2.1 assigns COMMAND-ONLY or BLOCKED, or a halt in this plan applies.
- **Procedure**: Build nothing automatic for that runtime, record why and use the command trigger under H13. Reject any sync or mirror output that contains extra changes under H8.

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Lane 2.1 spike evidence
  precedes lane 2.2 adapter tests
  precedes lanes 2.3 and 2.4 adapter builds and reviews
  precedes lane 2.5 wrapper case arms and review
  precedes lane 2.6 documentation
  precedes lane 2.7 Gate PG

| Lane | Depends On | Blocks |
|------|------------|--------|
| 2.1 | Pi and OpenCode runtime evidence | Tests and any adapter or wrapper work that depends on unverified details. |
| 2.2 | Lane 2.1 fixtures | Adapter builds in lanes 2.3 and 2.4. |
| 2.3 | Lane 2.1 evidence and lane 2.2 tests | Pi adapter review and later lane work. |
| 2.4 | Lane 2.1 evidence and lane 2.2 tests | OpenCode plugin review and later lane work. |
| 2.5 | Verified seed and name flags | Wrapper review and Gate PG. |
| 2.6 | Spike verdicts and implementation results | Gate PG. |
| 2.7 | Lanes 2.1 to 2.6 | Phase acceptance. |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

The approved plan sets no lane duration or effort estimate for phase 2.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Spike, lane 2.1 | Not estimated | Not stated in approved plan. |
| Tests and builds, lanes 2.2 to 2.5 | Not estimated | Not stated in approved plan. |
| Documentation and Gate PG, lanes 2.6 and 2.7 | Not estimated | Not stated in approved plan. |
| **Total** | | **Not estimated in approved plan.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created: no data change is named for phase 2.
- [ ] Feature flag: the shared core defines SYSTEM_SESSION_RELAUNCH_DISABLED.
- [ ] Monitoring alerts: no phase 2 alert is named in the approved plan.

### Rollback Procedure
1. For COMMAND-ONLY or BLOCKED, build nothing automatic and use the command trigger under H13.
2. Reject sync or mirror output with changes beyond the planned rows under H8.
3. Keep the work within the phase lane file lists under approved plan §11.8.

### Data Reversal
- **Has data migrations?** No data migration is named in the approved plan.
- **Reversal procedure**: N/A.

<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

2.1 Pi and OpenCode spikes
  precede 2.2 adapter tests
  precede 2.3 Pi adapter and review
  precede 2.4 OpenCode plugin and review
  precede 2.5 wrapper arms and review
  precede 2.6 documentation
  precede 2.7 Gate PG

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Pi spike | Runtime evidence from lane 2.1 | Pi verdict row and evidence | Pi tests and adapter work. |
| OpenCode spike | Runtime evidence from lane 2.1 | OpenCode verdict row and evidence | OpenCode tests and plugin work. |
| Adapter tests | Lane 2.1 fixtures | Pi and OpenCode test results | Adapter builds. |
| Pi adapter | AUTO verdict and lane 2.2 tests | Pi adapter and relative extension symlink | Wrapper review and Gate PG. |
| OpenCode plugin | AUTO verdict and lane 2.2 tests | Plugin and browsability symlink | Wrapper review and Gate PG. |
| Wrapper arms | Verified seed and name flags | Case arms only for verified runtimes | Gate PG. |
| Documentation | Lane verdicts and implementation results | README rows, catalog entry, scenarios and coverage rows | Gate PG. |
| Gate PG | Lanes 2.1 to 2.6 | Phase check results | Phase handoff. |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Lane 2.1 records both spike verdicts and evidence. Duration is not estimated in the approved plan.
2. Lane 2.2 writes adapter tests from lane 2.1 fixtures. Duration is not estimated in the approved plan.
3. Lanes 2.3 and 2.4 build and review the adapters after tests. Duration is not estimated in the approved plan.
4. Lane 2.5 adds and reviews wrapper case arms for verified seed and name flags. Duration is not estimated in the approved plan.
5. Lane 2.6 updates the runtime docs. Duration is not estimated in the approved plan.
6. Lane 2.7 runs Gate PG and both smoke checks. Duration is not estimated in the approved plan.

**Total Critical Path**: Not estimated in the approved plan.

**Parallel Opportunities**:
- The phase lane table specifies no parallel build path. Each SWE review follows its Luna build.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Pi and OpenCode spike evidence | Each runtime has a verdict row with evidence. | Lane 2.1 |
| M2 | Adapter tests, builds and reviews | Tests use lane 2.1 fixtures and reviews follow each build. | Lanes 2.2 to 2.5 |
| M3 | Runtime documentation and Gate PG | Docs pass their validators and Gate PG passes. | Lanes 2.6 and 2.7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

No phase-specific architecture decision record is named in the approved plan.

### ADR-001: Not defined for this phase

**Status**: Not defined in the approved plan.

**Context**: The phase objective uses the shared core and adds Pi and OpenCode triggers where verified.

**Decision**: No phase-specific decision is recorded here.

**Consequences**:
- The runtime spike determines which automatic work proceeds.
- COMMAND-ONLY or BLOCKED runtimes use the command trigger under H13.

**Alternatives Rejected**:
- No rejected alternative is named in the approved plan.

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
1. Read spec.md and confirm the phase scope and requirements.
2. Read plan.md and identify the next lane in the approved order.
3. Read tasks.md and select the next unchecked task.
4. Confirm lane prerequisites, including lane 2.1 evidence before tests and builds.
5. Check acceptance-criteria.md and the matching approved plan §11 verification item.
6. Check the applicable halt in approved plan §8 before proceeding.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run lanes in approved order. Write tests before adapter builds. |
| TASK-SCOPE | Touch only the file list for the current lane. |
| TASK-VERIFY | Run the approved plan §11 check before accepting a lane. |
| TASK-REVIEW | SWE reviews each Luna build before orchestrator acceptance. |
| TASK-DOC | Luna updates docs through the matching sk-doc modes and runs their validators. |

### Status Reporting Format

Use the approved plan's status line:
`STATUS <gate> | <phase/lane> | evidence: <cmd> rc=<n> | open halts: <ids or none> | next: <lane>`

### Blocked Task Protocol
- Record the blocking fact and evidence in tasks.md and the lane ledger.
- Apply the matching halt below. Stop the affected lane or the full phase as the halt requires.
- Continue only when the halt action allows it.

| Halt | Trigger | Action |
|------|---------|--------|
| H2 | Target file missing, string not found, line numbers mismatch or merge conflict. | Halt and report. |
| H3 | A plan fact contradicts the repo or another plan fact. | Halt with LOGIC-SYNC REQUIRED and ask which truth prevails. |
| H4 | The same symptom survives three fixes. | Escalate the symptom, attempts and evidence, then give two or three options and a recommendation. |
| H5 | A dispatch is stalled. | Kill by captured PID and re-dispatch once with a narrower brief. A second stall on the same lane goes to H4. |
| H6 | Executor auth, quota or install failure. | Ask the operator to run codex login or devin auth login. Do not substitute a model. |
| H7 | A diff is outside the lane file list or exits 0 with an empty diff. | Reject and re-dispatch narrower. A second rejection counts toward H4. |
| H8 | A sync or mirror run would change more than this plan's rows. | Do not accept the generated output and report the extra hunks. |
| H11 | A parent decision or criterion must change. | Amend the parent first, update the child, re-print and resend the slice. |
| H13 | A runtime verdict is COMMAND-ONLY or BLOCKED. | Build nothing automatic for it, record why, use the command trigger and report PARTIAL. |
| H14 | A mandatory operator wait applies, including any push. | Stop and ask. |

<!-- /ANCHOR:ai-execution -->

---

