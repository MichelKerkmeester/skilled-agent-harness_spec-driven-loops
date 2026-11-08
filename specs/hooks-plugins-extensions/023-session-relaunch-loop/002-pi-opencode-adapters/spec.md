---
title: "Feature Specification: Pi and OpenCode adapters"
description: "Phase 2 verifies Pi and OpenCode event support before adding automatic triggers. The phase builds on the shared core and uses the command trigger when a runtime spike does not verify automatic behavior."
trigger_phrases:
  - "Pi and OpenCode adapters"
  - "phase 002 Pi OpenCode relaunch"
  - "automatic triggers for Pi and OpenCode"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Pi and OpenCode adapters

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 2 verifies Pi and OpenCode usage events, nudge APIs, arm events, interactive seed and name flags and plugin locations. The spike assigns AUTO, COMMAND-ONLY, or BLOCKED. The remaining lanes add tests, adapters, verified wrapper arms, runtime documentation and Gate PG checks.

**Key Decisions**: AUTO requires verification of items (a) to (d). A COMMAND-ONLY or BLOCKED verdict uses the command trigger and has no automatic build under H13.

**Critical Dependencies**: Lane 2.1 evidence supplies the fixtures for lane 2.2. Wrapper arms depend on lane 2.1 verifying each runtime's seed and name flags.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | worktrees/142-session-relaunch-loop |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-claude-relaunch-loop |
| **Successor** | 003-command-trigger-runtimes |
| **Handoff Criteria** | All six acceptance criteria are Met, Gate PG passes and the phase documents pass strict validation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 2 of the session relaunch loop. Its objective is automatic triggers for Pi and OpenCode where the spike verifies support, using the shared core.

**Scope Boundary**: Lanes 2.1 through 2.7 in the approved plan.

**Dependencies**:
- Lane 2.1 records runtime evidence before lane 2.2 writes tests from its fixtures.
- Wrapper arms are limited to runtimes whose seed and name flags lane 2.1 verifies.

**Deliverables**:
- Pi TypeScript adapter and relative .pi/extensions symlink.
- OpenCode plugin and browsability symlink under session-relaunch/opencode/.
- Wrapper case arms for runtimes whose seed and name flags are verified.
- Adapter tests, runtime documentation and Gate PG evidence.

<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The approved plan marks Pi message_end usage and OpenCode event info.tokens as unverified. Lane 2.1 must also verify each runtime's nudge API, arm event, interactive seed and name flags and plugin directory.

### Purpose
Verify automatic triggers for Pi and OpenCode, then build them on the shared core only where the spike confirms support.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Spike evidence for Pi and OpenCode usage shape, nudge API, arm event, interactive seed and name flags and plugin directory.
- Adapter tests written first with lane 2.1 fixtures.
- The Pi adapter and relative .pi/extensions symlink.
- The OpenCode plugin and browsability symlink under session-relaunch/opencode/.
- Wrapper case arms for runtimes whose seed and name flags are verified.
- The concern README runtime rows, catalog entry, Pi and OpenCode scenarios and coverage matrix rows.
- The phase documents in this packet and the Gate PG checks.

### Out of Scope
- Automatic builds for COMMAND-ONLY or BLOCKED runtimes. H13 assigns those runtimes to the command trigger.
- Changes to the shared core, which this phase uses.
- Work on runtimes outside Pi and OpenCode, which the other phases cover.
- Resume flags in the wrapper.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/pi/ and .pi/extensions/ | Create | Pi TypeScript adapter and relative symlink. |
| The OpenCode plugin directory verified in lane 2.1 and session-relaunch/opencode/ | Create | OpenCode plugin and browsability symlink. |
| .skilled/bin/skilled-loop | Modify | Add case arms only when the runtime seed and name flags are verified. |
| Adapter test files | Create | Tests use lane 2.1 fixtures and follow the `.opencode/plugins/tests/*.test.cjs` style. |
| Concern README, feature catalog, manual testing playbook and coverage matrix | Modify | Add the runtime rows, catalog entry, scenarios and coverage rows named in lane 2.6. |
| spec.md, plan.md, tasks.md and acceptance-criteria.md | Modify | Record the phase requirements, lane order and closure checks. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Record one spike verdict for Pi and one for OpenCode. Each verdict row includes evidence for usage shape, nudge API, arm event, interactive seed and name flags and plugin directory. Assign AUTO only when (a) to (d) are all verified. Assign COMMAND-ONLY when usage, nudge or arm is unverified. Assign BLOCKED when the seed cannot be verified. |
| REQ-002 | Write the adapter tests before the adapters, use fixtures from lane 2.1 and make `npx vitest run --config .skilled/hooks/vitest.config.ts <test files>` pass. |
| REQ-003 | Make `pi --offline --approve -p "list your available tools" </dev/null` exit 0 and make `node -e "import('<plugin path>').then(()=>console.log('ok'))"` print `ok`. |
| REQ-004 | Add a fixture test that shows one nudge at or above the threshold and one re-nudge at +5%, with arming only when a pending file exists. |
| REQ-005 | For each verified runtime, make the stub-runtime wrapper test assert the seed, cwd change and absence of a resume flag. |
| REQ-006 | Make the phase documents and runtime documentation exist and pass their validators. |

### P1 - Required (complete OR user-approved deferral)

No additional P1 requirements are defined in the approved plan.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each Pi and OpenCode verdict follows the spike model and includes the evidence named in REQ-001.
- **SC-002**: All six acceptance criteria are Met and Gate PG passes before phase handoff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Lane 2.1 spike evidence | Adapter fixtures and wrapper arms depend on verified runtime details. | Use the recorded evidence before tests and only add wrapper arms for verified seed and name flags. |
| Risk | Usage, nudge or arm support is unverified, or the interactive seed cannot be verified. | The runtime receives COMMAND-ONLY or BLOCKED and has no automatic build. | Record the reason and use the command trigger under H13. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
No separate phase 2 performance target is stated in the approved plan.

### Security
No separate phase 2 security requirement is stated in the approved plan.

### Reliability
Each runtime follows its spike verdict. COMMAND-ONLY and BLOCKED runtimes use the command trigger only under H13.

---

## 8. EDGE CASES

### Spike Gaps
- If usage, nudge or arm support is unverified, the verdict is COMMAND-ONLY.
- If the interactive seed cannot be verified, the verdict is BLOCKED.

### Runtime Behavior
- For either verdict, build nothing automatic for that runtime.
- Record why and use the command trigger under H13.

---

## 9. COMPLEXITY ASSESSMENT

The approved plan does not assign numeric complexity scores to phase 2.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | N/A | Not scored in the approved plan. |
| Risk | N/A | Not scored in the approved plan. |
| Research | N/A | Not scored in the approved plan. |
| Multi-Agent | N/A | Not scored in the approved plan. |
| Coordination | N/A | Not scored in the approved plan. |
| **Total** | **N/A** | **Level 3, as declared in this packet.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Lane 2.1 does not verify usage, nudge or arm support, or cannot verify the interactive seed. | No automatic build for that runtime. | Not scored in the approved plan. | Record the verdict reason and use the command trigger under H13. |

---

## 11. USER STORIES

### US-001: Verified automatic triggers

**As an** operator, **I want** Pi and OpenCode to use automatic triggers only when the spike verifies support, **so that** those runtimes use the shared core only where the plan permits.

**Acceptance criteria:** REQ-001 to REQ-006.

---

### US-002: Command trigger for unsupported automatic paths

**As an** operator, **I want** COMMAND-ONLY and BLOCKED runtimes to use the command trigger, **so that** the phase does not build unverified automatic behavior.

**Acceptance criteria:** REQ-001 and REQ-006.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Do the Pi and OpenCode spikes verify their usage events, nudge APIs, arm events and interactive seed and name flags well enough for an AUTO verdict?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent packet: ../spec.md
- Implementation plan: plan.md
- Task breakdown and verification checklist: tasks.md
- Closure criteria: acceptance-criteria.md

