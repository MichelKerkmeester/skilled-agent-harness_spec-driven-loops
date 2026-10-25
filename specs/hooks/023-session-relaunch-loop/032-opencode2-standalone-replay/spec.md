---
title: "Feature Specification: Phase 32: opencode2-standalone-replay"
description: "The wrapper relaunches OpenCode 2 without --standalone, so the receiver lands on the shared background service, holds no loop id and never arms a second hop."
trigger_phrases:
  - "opencode2 standalone replay"
  - "phase 32 opencode2 standalone replay"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 32: opencode2-standalone-replay

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `scaffold/032-opencode2-standalone-replay` |
| **Parent Spec** | ../spec.md |
| **Phase** | 32 of 32 |
| **Predecessor** | 031-relaunch-model-and-effort |
| **Successor** | None |
| **Handoff Criteria** | A two-hop live OpenCode 2 run without a PATH shim passes, and the relaunch gate is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the Replay OpenCode 2 standalone on every launch specification.

**Scope Boundary**: The `skilled-loop` wrapper and its shell shim, for OpenCode 2 only: which flags a launch and a relaunch carry, and which subcommands skip the wrapper. Carrying the sender's model and effort is the next phase and stays out.

**Dependencies**:
- The OpenCode 2 hop fix from the previous phase, which this phase completes.

**Deliverables**:
- The wrapper adds `--standalone` to the first launch and to every relaunch when `opencode --help` lists it.
- The relaunch drops `-m` on OpenCode 2, because its root command rejects it.
- The shell shim passes the OpenCode 2 management subcommands through.
- The docs that told the operator to pass `--standalone` by hand are corrected.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The wrapper rebuilds an OpenCode relaunch as `[-m model] --prompt seed`, so a `--standalone` the operator passed is never replayed. OpenCode 2 then starts the receiver on its shared background service, which holds no `SKILLED_LOOP_ID`, so the second hop never arms. The earlier live hop hid this, because its harness put a PATH shim in front of OpenCode that added `--standalone` to every call. A replayed `-m` also breaks the relaunch outright, because the OpenCode 2 root command rejects it with a usage error.

### Purpose
An operator who types plain `opencode` under the wrapper gets a loop that hops repeatedly on OpenCode 2, with no flag to remember.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Detect OpenCode 2 by its help listing `--standalone`, a capability check rather than a version check.
- Add `--standalone` on the first launch and in the relaunch arguments, unless the operator passed `--server`.
- Drop the `-m` replay on OpenCode 2, and keep it on OpenCode 1.
- Add the OpenCode 2 subcommands `api`, `service`, `reload`, `pair` and `mini` to the shim's pass-through list.
- Correct the docs that said to start OpenCode 2 with `--standalone`.

### Out of Scope
- Carrying the sender's model and effort across the hop - the next phase owns it.
- Making `opencode mini` loop - it is a different interface and passes through unwrapped.
- Any change to the OpenCode plugin or the killer - the earlier phase fixed those.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | Capability probe, `--standalone` on launch and relaunch, `-m` dropped on OpenCode 2, `--server` warning |
| `.skilled/bin/skilled-loop-shell.sh` | Modify | Pass the OpenCode 2 management subcommands through |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | Stub answers `--help`; five OpenCode cases |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modify | Pass-through rows for the new subcommands |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Adapter row and the OpenCode 2 paragraph |
| `.skilled/hooks/goal/goal-plugin.md` | Modify | The wrapper adds the flag itself |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modify | GR-O1 names the wrapper, not the harness, as the source of the flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On OpenCode 2 the first launch and every relaunch carry `--standalone` exactly once, unless the launch carries `--server` |
| REQ-002 | On OpenCode 2 the relaunch carries no `-m`; on a build whose help does not list `--standalone` the launch and the `-m` replay are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A launch with `--server` stays on that server and prints a warning that the loop cannot arm |
| REQ-004 | A live two-hop OpenCode 2 run with no PATH shim hops twice |
| REQ-005 | The docs no longer tell the operator to pass `--standalone` for the loop |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The wrapper tests that name `--standalone` fail on the old wrapper and pass on the new one, and the relaunch gate stays green against its baseline of 837.
- **SC-002**: The live run records two relaunch decisions and two claimed notes with no shim on the PATH.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The installed OpenCode 2 and its model credentials for the live run | The unit proof still holds, the live proof waits | Report the live run as not done |
| Risk | A later OpenCode 2 build renames `--standalone` | Med | The probe reads the help, so the launch falls back to the plain form instead of failing |
| Risk | `mini` accepts `-m` and `--standalone` but passes through unwrapped | Low | Documented in the README; wrapping it needs the flag after the subcommand |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The probe is one `opencode --help` call per wrapper start, which does not open a session.

### Security
- **NFR-S01**: The probe reads help text only and sends nothing to a model.

### Reliability
- **NFR-R01**: A probe that fails or prints nothing leaves the launch exactly as it was.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No arguments: `--standalone` becomes the only argument.
- Operator passes `--standalone`: it is not added a second time.
- Operator passes `--server` or `--server=<url>`: nothing is added and a warning prints.

### Error Scenarios
- Probe prints help to stderr or exits non-zero: the output is still read and a non-zero exit is ignored.
- OpenCode 1: the help has no `--standalone`, so nothing changes.

### State Transitions
- A second hop after a relaunch: the relaunch arguments carry `--standalone`, so the receiver arms again.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One script, one shim, two test files, four docs |
| Risk | 8/25 | Every OpenCode 2 launch under the wrapper changes |
| Research | 4/20 | OpenCode 2 flags probed on 2.1.4 |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether `opencode mini` should loop later. It needs `--standalone` after the subcommand, so it is left for an operator decision.
<!-- /ANCHOR:questions -->

---


