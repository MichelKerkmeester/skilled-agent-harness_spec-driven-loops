---
title: "Feature Specification: Phase 31: relaunch-model-and-effort"
description: "An automatic relaunch rebuilds the runtime's command line with the model only, and only the model the operator typed at launch. The receiver loses the sender's effort on every runtime, and a model or effort changed inside the session. This phase makes the receiver start on the model and effort the sender was using."
trigger_phrases:
  - "relaunch model and effort"
  - "phase 31 relaunch model and effort"
  - "hop keeps model"
  - "relaunch effort flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 31: relaunch-model-and-effort

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
| **Branch** | `worktrees/220-relaunch-cancel-and-test-isolation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 31 of 31 |
| **Predecessor** | 030-opencode2-killer-target |
| **Successor** | None |
| **Handoff Criteria** | On every runtime with a launch flag for it, a relaunched session starts on the sender's model and effort, proven by wrapper tests per runtime and a live hop on each runtime with credentials |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the session relaunch loop specification.

**Scope Boundary**: What `skilled-loop` passes to a relaunched runtime about model and effort, where the sender's current model and effort are read from, and the docs and tests for both.

**Dependencies**:
- Phase 030, which changed the same wrapper and must be committed first.

**Deliverables**:
- The wrapper replays the launch effort flag next to the launch model on every relaunch.
- The sender's current model and effort, where the runtime exposes them, override the launch values for the next hop.
- A per-runtime table of what is carried, from where, and what cannot be.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`build_relaunch_arguments` in `.skilled/bin/skilled-loop` rebuilds the relaunch command from the model, provider, name and Pi extension flags only. An effort flag the operator launched with (`claude --effort`, `pi --thinking`, `hermes chat --reasoning`, `codex -c model_reasoning_effort=`) is dropped, so every receiver runs at the runtime's default effort. The model it does carry is the one typed at launch, so a model or effort the operator switched to inside the session is lost too.

### Purpose
After an automatic hand-over, the receiver runs on the same model and effort as the sender, on every runtime that can be told them at launch, and the docs say plainly where that is not possible.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Launch carry.** The wrapper captures each runtime's effort flag from the first launch, as it captures the model today, and replays it on every relaunch.

  | Runtime | Model flag | Effort flag |
  |---------|-----------|-------------|
  | Claude 2.1.310 | `--model` | `--effort <level>` |
  | Codex 0.164.0 | `-m` | `-c model_reasoning_effort=<level>` |
  | Pi 1.4.0 | `--model` (with `--provider`) | `--thinking <level>`, or a `:<thinking>` suffix on the model |
  | Hermes 0.21.1 | `-m` (with `--provider`) | `--reasoning <level>` |
  | Cursor Agent 2026.09.28 | `--model` | inside the model, `name[effort=high]` |
  | Devin 3000.11.205 | `--model` | none in `--help` |
  | OpenCode 2.1.4 | none on the TUI root | none on the TUI root |

- **Live carry.** At `prepare` and `keep`, record the sender's current model and effort when its own state proves them, and let the wrapper prefer those over the launch values for that hop. Known sources: the Codex session log's `turn_context` (model and effort), the Claude session log (model per assistant message; the effort source still has to be found), the Pi extension context, and the model the OpenCode plugin receives per request. Hermes, Cursor and Devin need a source found or are recorded as launch-carry only.
- A value is passed only in the runtime's own flag syntax, and an unrecognised value is not passed.
- Tests per runtime in `skilled-loop.test.cjs`, and the CLI and adapter tests for the recorded values.
- A live hop per runtime with credentials that shows the receiver's model and effort.
- Docs: the session-relaunch README, ENV-REFERENCE if a switch is added, the handoff command, the relaunch playbooks and the feature catalog entry.

### Out of Scope
- OpenCode 2's TUI. It has no model or effort flag at launch, and neither `OPENCODE_CONFIG_CONTENT` nor `OPENCODE_CONFIG` adds a config source (checked with `opencode debug config`). It may keep the sender's model through its own last-used state, which the live hop checks and records, but the wrapper cannot set it.
- Changing a runtime's default model or effort.
- Carrying other launch flags, such as permission or sandbox modes, which the wrapper already passes or drops as it does today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/bin/skilled-loop | Modify | Capture and replay the effort flag; prefer recorded live values |
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Modify | Read the sender's model and effort per runtime |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | Modify | Record them at `prepare` and `keep`; report them to the wrapper |
| .skilled/hooks/session-relaunch/tests/*.test.cjs | Modify | Failing-first tests per runtime |
| .skilled/hooks/session-relaunch/README.md | Modify | What is carried per runtime and the limits |
| .skilled/commands/speckit/handoff.md | Modify | Same, in one line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A relaunch replays the effort flag the first launch carried, in that runtime's syntax, on Claude, Codex, Pi and Hermes |
| REQ-002 | A relaunch keeps the model the first launch carried on every runtime with a model flag, as today, including Cursor's bracketed effort |
| REQ-003 | When the sender's current model or effort is proven from its own state, the next hop uses it in place of the launch value |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A runtime with no source or no flag for a value is named in the README with what the receiver gets instead |
| REQ-005 | A live hop on each runtime with credentials shows the receiver's model and effort match the sender's |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A wrapper test per runtime fails on the current wrapper and passes on the fix, and the relaunch gate is at its baseline plus those tests.
- **SC-002**: The README table says, per runtime, what a receiver starts on.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recorded value from a session log is wrong or stale | Med | Prefer it only when it comes from the sender's latest turn; fall back to the launch value |
| Risk | A value the runtime rejects stops the relaunch | High | Pass only values in a known level list or the runtime's own model id, and test the reject path |
| Dependency | Credentials and quota for live hops | Med | Record a skip; never count a skip as a pass |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reading the live values reads one session file tail or one adapter value at `prepare`.

### Security
- **NFR-S01**: A recorded value is passed as one argument, never through a shell string.

### Reliability
- **NFR-R01**: A missing or unreadable value falls back to the launch value, never to a failed relaunch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An effort level outside the runtime's list: not passed.
- A Pi model with a `:<thinking>` suffix and a `--thinking` flag: the wrapper passes what the operator gave and does not add a second.

### Error Scenarios
- The session log has no model entry yet: the launch value is used.

### State Transitions
- The operator switches model mid-session, then the session hands over: the receiver starts on the switched model where the runtime exposes it.
- A second hop: the values recorded for that hop win, not the first launch's.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Seven runtimes, wrapper, CLI and adapters |
| Risk | 14/25 | A bad flag stops a relaunch |
| Research | 14/20 | Live sources for Claude effort, Hermes, Cursor and Devin are unknown |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where Claude Code records the session's current effort level, and whether Hermes, Cursor and Devin expose the current model and effort to their hooks or logs.
<!-- /ANCHOR:questions -->

---
