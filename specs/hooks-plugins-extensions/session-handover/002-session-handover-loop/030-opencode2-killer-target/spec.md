---
title: "Feature Specification: Phase 30: opencode2-killer-target"
description: "On OpenCode 2 the relaunch killer signalled the plugin's own process, which is a server the TUI starts, so the server died, the TUI stayed up and no relaunch followed. This phase makes the plugin signal the loop's direct child, the process the wrapper waits on."
trigger_phrases:
  - "opencode2 killer target"
  - "phase 30 opencode2 killer target"
  - "opencode 2 relaunch hop"
  - "killer target pid opencode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 30: opencode2-killer-target

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | 029-relaunch-evidence-gaps-and-playbook-drift |
| **Successor** | None |
| **Handoff Criteria** | A live OpenCode 2 hop through the real wrapper reaches its receiver, and the relaunch and plugin gates are at their baselines plus the new test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the session relaunch loop specification.

**Scope Boundary**: The pid the OpenCode relaunch plugin hands to the killer, its test, the live hop rerun, and the doc lines that say the OpenCode 2 hop fails.

**Dependencies**:
- Phase 028, whose live run found the defect (`028-goal-rebind-live-proof-and-docs/scratch/opencode-a-hop-attempt/`) and whose harness this phase reruns.

**Deliverables**:
- The plugin signals the loop's direct child.
- A test that fails on the earlier code.
- A live OpenCode 2 hop with a goal, and the 028 criterion for it updated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The OpenCode relaunch plugin passes its own `process.pid` to the killer. On OpenCode 2 the plugin runs in a `serve --stdio` server that the TUI starts, so the killer ended the server, the TUI stayed up showing "Connection lost", the wrapper never regained control and no relaunch followed. A probe in this phase confirmed the shape: the plugin's pid was the server's and its parent was the TUI.

The first rerun with that fixed found a second defect behind it. The killer signalled the TUI, the TUI exited and `should-relaunch` approved the hop, but OpenCode 2.1.4 exits 130 on SIGTERM as well as on SIGINT (measured in this phase). The wrapper reads 130 as the operator's interrupt, so it printed the manual claim command and stopped.

The second rerun found a third. The TUI took about 6.2 seconds to exit after SIGTERM (4.8 seconds in the first rerun), past the killer's 5-second post-signal grace, so the killer timed out, disarmed the record and the wrapper declined the hop as `not-armed`.

### Purpose
An OpenCode 2 session started by the wrapper with a private server relaunches when its hand-over is armed, as OpenCode 1 does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The plugin hands the killer the loop's direct child, found by the shared `findLoopChildPid` walk from its own pid, and keeps its own pid when the walk finds nothing.
- One test that places the plugin host one process below the loop's child, as OpenCode 2 does.
- The killer stamps `signalledAt` on the record it is about to signal, in the same locked step as its last check, and a new arm clears the stamp. `should-relaunch` reports `signalled`, and the wrapper reads exit 130 as an interrupt only when the record was not signalled.
- The killer's post-signal grace goes from 5 to 15 seconds, so a runtime that shuts down as slowly as OpenCode 2 still finds its record armed.
- Rerun the phase 028 OpenCode goal hop with the fixes, and update 028's OpenCode 2 hop criterion with the result.
- Correct the docs that say the OpenCode 2 hop fails.

### Out of Scope
- OpenCode 2's default shared background service. The plugin runs in a service that no wrapper started, which holds no `SKILLED_LOOP_ID`, so nothing arms there. Making the wrapper start OpenCode 2 with `--standalone` changes how every operator session runs, so it is the operator's decision.
- The wrapper's `-m` relaunch argument. The wrapper adds `-m` on a relaunch only when the operator's first launch passed it (`.skilled/bin/skilled-loop:384` clears it, `:427` captures it), and OpenCode 2 rejects that first launch the same way, so a relaunch repeats the operator's own command.
- The killer's ancestry check. It already accepts the loop's child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/plugins/session-relaunch.js | Modify | Hand the killer the loop's direct child |
| .opencode/plugins/tests/session-relaunch.test.cjs | Modify | Test the target when the host sits below the loop's child |
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Modify | `markSignalled`, and a new arm drops a signal stamp |
| .skilled/hooks/session-relaunch/lib/killer.cjs | Modify | The last check before the signal is the guarded stamp; the post-signal grace is 15 seconds |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Modify | `should-relaunch` reports `signalled` |
| .skilled/bin/skilled-loop | Modify | Exit 130 after a signalled record is a hop, not an interrupt |
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | Modify | The stamp names only the watched arm, and a re-arm clears it |
| .skilled/hooks/session-relaunch/tests/killer.test.cjs | Modify | A signal leaves the stamp |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | Modify | Exit 130 with a signalled record relaunches |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | Modify | The decision JSON carries `signalled` |
| .skilled/hooks/session-relaunch/README.md | Modify | State the OpenCode 2 hop result and the shared-service limit |
| .skilled/hooks/goal/goal-plugin.md | Modify | Same |
| .skilled/commands/speckit/handoff.md | Modify | Same |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md | Modify | Record the hop result |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md | Modify | Same |
| ../028-goal-rebind-live-proof-and-docs/acceptance-criteria.md | Modify | The OpenCode 2 hop criterion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When the plugin host is a descendant of the loop's direct child, the killer is handed that child's pid |
| REQ-002 | When the walk finds no loop child, the plugin keeps handing its own pid, so OpenCode 1 and every existing case behave as before |
| REQ-003 | A live OpenCode 2 hop through the real wrapper ends the sender, relaunches, and the receiver claims the note |
| REQ-005 | A runtime exit of 130 after the killer signalled the record relaunches, and one with no signal still prints the manual command and exits 130 |
| REQ-006 | A target that exits within 15 seconds of SIGTERM leaves its record armed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The docs that say the OpenCode 2 hop fails state the result and the shared-service limit |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new test fails on the earlier code and passes on the fix, and the relaunch and plugin gates are at their baselines plus that one test.
- **SC-002**: The hop's relaunch log shows `killer-signal` for the TUI's pid, followed by a relaunch and a claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The walk reads the process table at idle | Low | One `ps` call per arm, the same call Hermes makes |
| Risk | A host far below the loop names a child that is not the runtime | Low | The wrapper's only child while the runtime runs is the runtime, and the killer still checks ancestry |
| Dependency | OpenAI quota for the live hop | Med | The hop is a record of what ran; a quota failure is recorded, not treated as a pass |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One process-table read per arm.

### Security
- **NFR-S01**: The killer's ancestry check is unchanged, so no pid outside the loop can be signalled.

### Reliability
- **NFR-R01**: A failed process-table read falls back to the plugin's own pid.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A loop id that is not a pid: the walk finds nothing, so the plugin hands its own pid, as before.

### Error Scenarios
- `ps` fails or times out: the plugin hands its own pid.

### State Transitions
- OpenCode 1, where the plugin runs in the TUI: the walk returns the plugin's own pid.
- OpenCode 2 on its default shared service: no loop id reaches the plugin, so nothing arms (out of scope).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function in one plugin, one test, doc lines |
| Risk | 10/25 | Chooses which process a signal ends |
| Research | 8/20 | One probe confirmed the process shape |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the wrapper start OpenCode 2 with `--standalone`, so the loop works on a default launch? This is the operator's decision.
<!-- /ANCHOR:questions -->

---
