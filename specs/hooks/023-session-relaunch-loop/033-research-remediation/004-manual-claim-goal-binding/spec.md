---
title: "Feature Specification: Phase 4: manual-claim-goal-binding"
description: "A manual first launch started from the printed claim command drops the goal packet the handoff note carries, so the receiver starts unbound on every runtime."
trigger_phrases:
  - "manual claim goal binding"
  - "phase 4 manual claim goal binding"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: manual-claim-goal-binding

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 (wave 3, after 002) |
| **Predecessor** | ../003-manual-claim-live-settings/spec.md |
| **Successor** | ../005-persisted-hops-validation/spec.md |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the two test commands in `plan.md` pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the research remediation packet. The build order is the wave order in `../spec.md`, not the folder order: this phase runs in wave 3 after 002 is Complete.

**Scope Boundary**: The first-launch path of `.skilled/bin/skilled-loop`, a seed parser and `usableGoalPacket` in `relaunch-core.cjs`, the CLI's use of that helper, their tests and the matching README lines.

**Dependencies**:
- Phase 002 (consume-locked-withdraw) is Complete.

**Deliverables**:
- A core claim-seed parser, the inverse of `specFolderSuffix`.
- `usableGoalPacket` moved into the core and imported by the CLI.
- A wrapper first-launch step that binds the note's packet for a seeded start.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A first launch unsets the goal packet and claim seed so an outer session's values never leak in (`.skilled/bin/skilled-loop:470-474`). A manual claim started by the printed command is a first launch, so it never carries the note's goal packet (`.skilled/hooks/session-relaunch/README.md:193`; research section 9 finding 4). On a hop the wrapper exports `SESSION_RELAUNCH_GOAL_PACKET` and, for Hermes, `HERMES_SPEC_FOLDER` (`skilled-loop:755-784`), and Claude starts on the `/goal` slice. A manual receiver gets none of that on any runtime.

### Purpose
A manual first launch that carries a claim seed binds the goal packet of the note it names on every runtime that takes one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A core function that parses a claim seed (`[session-relaunch] claim and continue handoff <path>`, with the optional `SPEC_FOLDER_MARKER` suffix built by `specFolderSuffix`, `relaunch-core.cjs:45-47` and `:89-93`) into note path and spec folder.
- `usableGoalPacket` moved from `bin/session-relaunch.cjs:376-381` into the core, with `resolvedSwitches` and `goalRoots` passed in or moved with it.
- A first-launch step in `skilled-loop`, after the `--no-daemon` and `--standalone` prepends end at `:635`, that finds the claim seed in `launch_arguments`, reads the named note and, only when it is open and inside the repository, exports its packet. It edits the operator's arguments in place and never calls `build_relaunch_arguments`, which runs only on a hop.
- Tests in `skilled-loop.test.cjs`, `relaunch-core.test.cjs` and `goal-handover.test.cjs`, and README line 193 plus the goal section near lines 164-174.

### Out of Scope
- The claim step itself - phase 003 and 008 own its settings and errors.
- Consume - phase 002 owns it; this phase only keeps its goal-switch behaviour.
- Devin and Cursor hop behaviour - unchanged; only their manual first launch gains the packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | Seeded first launch reads the note and exports its packet |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Add the seed parser and `usableGoalPacket` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Import `usableGoalPacket` from the core and drop the local copy |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Round-trip and export tests |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | Seeded first-launch table tests |
| `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` | Modify | Keep consume's goal-switch path covered after the move |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Line 193 and the goal section near 164-174 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A core function parses a claim seed into note path and spec folder and is the inverse of the seed builder. |
| REQ-002 | `usableGoalPacket` lives in `relaunch-core.cjs`; the CLI imports it and keeps no copy. |
| REQ-003 | A manual first launch with a seed for an open in-repo note with a usable packet exports `SESSION_RELAUNCH_GOAL_PACKET`, sets `HERMES_SPEC_FOLDER` on Hermes and starts Claude on the `/goal` slice. |
| REQ-004 | A seed for a note that is not open, outside the repository, or with no usable packet exports nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The test "wrapper drops a goal packet inherited from an outer session on every launch" (`skilled-loop.test.cjs` near line 2684) stays green unedited. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **AC-001**: **Given** a seed built by the core for a note path and spec folder, **When** the parser reads it, **Then** it returns the same path and folder, including the `none` Skip form. Verify: `relaunch-core.test.cjs` round-trip test, red before.
- **AC-002**: **Given** a manual Pi, OpenCode, Codex, Devin or Cursor first launch with a seed for an open note holding a packet, **When** the runtime starts, **Then** its environment holds `SESSION_RELAUNCH_GOAL_PACKET=<packet>`. Verify: table test with a stub runtime.
- **AC-003**: **Given** the same on Hermes and Claude, **When** they start, **Then** Hermes has `HERMES_SPEC_FOLDER=<packet>`, and on Claude with a renderable slice the seed element is replaced by `/goal <slice>`, `SKILLED_LOOP_CLAIM_SEED` holds the seed and every other operator argument is kept in place. Verify: one test per seed position (at least Claude positional and one flag form such as OpenCode `--prompt`, Hermes `-q` or Devin `--`) plus one with `--standalone` prepended.
- **AC-004**: **Given** a seed for a claimed note or a note outside the repo, **When** the launch starts, **Then** no packet is exported. Verify: test.
- **AC-005**: **Given** an outer `SESSION_RELAUNCH_GOAL_PACKET` and no seed, **When** the wrapper launches, **Then** the inherited test passes unchanged. Verify: test run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 Complete | This phase waits | Build in wave order from `../spec.md` |
| Risk | Reading a note at first launch adds a node call to every seeded start | Low | Only seeded starts pay it; unseeded starts skip the call |
| Risk | Moving `usableGoalPacket` changes consume's goal-switch behaviour | Med | Move it with unchanged logic; `goal-handover.test.cjs` runs here |
| Dependency | Phase 006, built after this one, changes the goal-switch handling around consume and `usableGoalPacket` | Med | This phase moves `usableGoalPacket` into the core with unchanged logic, so 006 edits the moved copy in `relaunch-core.cjs` |
| Risk | The seed sits at a different position per runtime and the prepends shift indices | Med | Scan `launch_arguments` after `:635` by prefix, never by fixed index; tests cover positional, a flag form and `--standalone` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An unseeded first launch makes no extra node call.
- **NFR-P02**: A seeded first launch adds one node call that reads one note.

### Security
- **NFR-S01**: Only a note path inside the repository is read; any other path exports nothing.
- **NFR-S02**: The packet must pass `goalPacketProblem` before it is exported, so a packet that lost its `goal.md` is dropped.

### Reliability
- **NFR-R01**: A failed note read or parse exports nothing and the launch still starts.
- **NFR-R02**: The inherited-packet drop at `skilled-loop:473-474` runs before the seed step on every launch.
- **NFR-R03**: A first launch keeps every operator argument; only the seed element may be replaced, and only on Claude.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a first launch with no prompt or a prompt that is not a seed exports nothing.
- Maximum length: a seed with a spec folder suffix parses the same as one without it.
- Invalid format: a seed whose suffix fails `validSpecFolder` returns no spec folder.

### Error Scenarios
- External service failure: a missing or unreadable note exports nothing.
- Network timeout: not applicable; the read is local.
- Concurrent access: a note claimed between print and launch is no longer open, so nothing is exported.

### State Transitions
- Partial completion: a packet whose `goal.md` was removed after the note was written exports nothing.
- Session expiry: the goal switch off in resolved settings exports nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Seven files, one shell path and two JS modules |
| Risk | 12/25 | Environment precedence and path handling at launch |
| Research | 5/20 | Done in the parent research, section 9 finding 4 |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `resolvedSwitches` and `goalRoots` move into the core or be passed to `usableGoalPacket` as arguments? The builder picks the one that keeps consume unchanged.
- None others at planning time.
<!-- /ANCHOR:questions -->
