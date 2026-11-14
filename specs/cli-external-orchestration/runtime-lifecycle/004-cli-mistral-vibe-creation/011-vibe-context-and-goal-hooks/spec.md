---
title: "Feature Specification: Phase 11: vibe-context-and-goal-hooks"
description: "A Vibe dispatch starts with no bound packet goal and no session context, because no Vibe hook exists in this repository. This phase adds one session_start hook that carries the packet goal slice and session context through the hook's additional_context, and proves it with a fixture test and a dispatch."
trigger_phrases:
  - "vibe context and goal hooks"
  - "phase 11 vibe context and goal hooks"
  - "vibe session_start goal slice"
  - "vibe goal bridge"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: vibe-context-and-goal-hooks

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-hub-registration-and-routing |
| **Successor** | 012-playbook-docs-and-closeout |
| **Handoff Criteria** | A dispatch's first turn carries the goal slice and the fixture test passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: One Vibe `session_start` hook and its fixture test. It injects context only and builds no goal object, command or tool.

**Dependencies**:
- Phase 008 (`008-vibe-repo-guards`), which settles the hook wire format and authors `.vibe/hooks.toml`. Phase 010 precedes this one in the linear order but is not a dependency.
- `MISTRAL_API_KEY` exported for the first-turn dispatch check.

**Deliverables**:
- A Vibe goal adapter under `.skilled/hooks/goal/vibe/` and a session-start adapter under `.skilled/hooks/session-lifecycle/vibe/`, registered as one `session_start` entry.
- A fixture test that proves the injected slice equals what `goal.cjs packet` prints.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every other governed runtime receives the bound packet goal and session context at start, but no `.vibe/` folder and no Vibe adapter exist, so a Vibe dispatch runs without either. Vibe has no goal service that reads `goal.md`, and its only start-of-session injection point is the `session_start` hook's `additional_context`.

### Purpose
A Vibe dispatch bound to a packet starts with that packet's goal `chat_slice` and the session context in its first turn.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .vibe; echo "exit=$?"
ls: .vibe: No such file or directory
exit=1
$ ls .skilled/hooks/goal/vibe .skilled/hooks/session-lifecycle/vibe; echo "exit=$?"
ls: .skilled/hooks/goal/vibe: No such file or directory
ls: .skilled/hooks/session-lifecycle/vibe: No such file or directory
exit=1
$ P=specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation
$ SCRATCH=<session scratchpad directory>
$ node .skilled/hooks/goal/bin/goal.cjs packet $P/003-dsh-mistral-route --workspace "$PWD" > $SCRATCH/pkt.txt; echo "exit=$?"
exit=0
$ rg -o '^(STATUS=OK ACTION=packet|chat_slice=|packet_budget=\w+)' $SCRATCH/pkt.txt
STATUS=OK ACTION=packet
packet_budget=unknown
chat_slice=
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a Vibe goal adapter that resolves the bound packet and returns the exact `chat_slice` that `goal.cjs packet` prints for it.
- Add a Vibe session-start adapter that composes that slice with the session-prime context into one `additional_context` value.
- Register the session-start adapter as one `session_start` entry in `.vibe/hooks.toml`.
- Add a fixture test for the slice, the no-packet case and fail-open behavior on malformed input.
- Add the Vibe row to the goal and session-lifecycle READMEs and name the hook in `.vibe/SYNC.md`.

### Out of Scope
- A goal object, `/goal` command or goal tool for Vibe - the research goal bridge row maps to `session_start` `additional_context` only.
- Per-turn goal refresh, verification or continuation - a print-mode dispatch is one task, and goal verification would need a strict `post_agent`, which Vibe rejects.
- Session-relaunch and compaction recovery - deferred, because Vibe has no idle or compaction event and only an outer supervisor could drive it.
- Turn-stopping guards - deferred, because `post_agent` cannot be strict.
- ACP supervisor sessions - deferred until print mode is proven, so the hook targets print-mode dispatches only.
- Sandbox mode - deferred, because Vibe has no sandbox CLI or config field.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | Create | Packet resolution and `chat_slice` rendering |
| `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` | Create | Fixture test |
| `.skilled/hooks/goal/vibe/README.md` | Create | Adapter README |
| `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` | Create | The registered entry that composes slice and session context |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Create | Adapter README |
| `.vibe/hooks.toml` | Modify | One `session_start` entry |
| `.vibe/SYNC.md` | Modify | Names the hook |
| `.skilled/hooks/goal/README.md`, `.skilled/hooks/session-lifecycle/README.md` | Modify | Vibe rows in the runtime matrices |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hook's slice equals the `goal.cjs packet` slice | The fixture test compares the injected text with the `chat_slice` line `goal.cjs packet <fixture packet>` prints and passes |
| REQ-002 | A dispatch's first turn carries the slice | A keyed print-mode dispatch bound to a packet repeats that packet's Objective line when asked for it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No bound packet means no goal text | With no packet variable set, the fixture test shows the hook output carries no goal heading |
| REQ-004 | The hook fails open | Malformed input yields an empty context and exit 0 in the fixture test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` prints `fail 0`.
- **SC-002**: One keyed dispatch bound to a packet shows that packet's Objective line in its first reply, recorded in `scratch/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 008's hook wire format and `.vibe/hooks.toml` | High: the input payload and the reply shape are UNKNOWN until 008 settles them | Setup reads 008's settled format before any code, and the adapter isolates parsing in one function |
| Dependency | `MISTRAL_API_KEY` for the first-turn check | High: no dispatch proof without it | The fixture test proves the slice offline, and the dispatch check waits for the key |
| Risk | Two `session_start` entries could merge or override each other in ways this repository has not observed | Med | One registered entry composes both texts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does a Vibe hook process inherit the dispatch environment, so a `VIBE_SPEC_FOLDER` variable can name the packet? UNKNOWN until phase 008's wire format.
- Should the hook inject when `goal.cjs packet` prints `packet_budget=unknown`, as it does for `003-dsh-mistral-route` today?
<!-- /ANCHOR:questions -->

---
