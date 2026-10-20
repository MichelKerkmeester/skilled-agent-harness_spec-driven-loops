---
title: "Feature Specification: Phase 17: hop-history"
description: "An automatic hop leaves no record the operator can find later: relaunch.log sits in a temporary directory and nobody watches every terminal. This phase adds a persistent hop history, a history command, a last-hop line in /doctor:setup and an opt-in macOS notice per hop."
trigger_phrases:
  - "hop history"
  - "phase 17 hop history"
  - "session relaunch history command"
  - "hop notice"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 17: hop-history

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/175-session-relaunch-hop-history` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-handover-trigger-review |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the session-relaunch suite passes and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Session relaunch loop specification.

**Scope Boundary**: A persistent record of every hop, a way to read it, and an optional desktop notice. The hop path itself does not change.

**Dependencies**:
- Phases 001 to 016, which built and reviewed the hop path: the CLI, the killer and the handoff notes.
- The hook-flags file, which already carries the per-repository switches.

**Deliverables**:
- `lib/hop-history.cjs` and the four recorded events.
- The `history [--last <count>]` subcommand.
- A last-hop line in `/doctor:setup`.
- The `SESSION_RELAUNCH_NOTIFY_HOPS` switch, off by default.
- Tests and docs for all of it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator has never seen an automatic hop happen, because they do not watch every terminal. The only record is `relaunch.log`, which lives in a temporary directory the system clears and which mixes hops with declines and arm events. One real hop did happen on 2026-10-20 at 12:37, and it took a manual search of that log to find it.

### Purpose
Every hop leaves a line the operator can read later in one command or in `/doctor:setup`. On the operator's own machine, each hand-over also shows a macOS notice.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A hop history file at `.skilled/skills/.state/session-relaunch/hop-history.log`, gitignored, beside the handoff notes.
- Four events: `handed-over` when the wrapper decides to relaunch, `claimed` and `done` from the receiving session, and `timed-out` from the killer.
- `session-relaunch.cjs history [--last <count>]`.
- An informational last-hop line in `/doctor:setup` that never changes its status.
- `SESSION_RELAUNCH_NOTIFY_HOPS`, read from the hook-flags file or the environment, off by default.
- Tests, the concern README, the tests README, ENV-REFERENCE, `hook-flags.env.example`, the feature catalog entry and the root README.

### Out of Scope
- Recording hops that happened before this phase, because no source holds them reliably.
- A sixth `/doctor:setup` leg, because a missing hop is not a failure.
- Notices on Linux or Windows, because the existing killer notice is macOS-only too.
- Turning the notice on in the shipped example file, because clones should opt in themselves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/hop-history.cjs` | Create | Record, read and notify |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `history` subcommand, and records on relaunch, claim and complete |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | Records `timed-out` |
| `.skilled/hooks/session-relaunch/tests/hop-history.test.cjs` | Create | Eight tests |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs`, `session-relaunch-cli.test.cjs` | Modify | Timeout line and the new subcommand |
| `.skilled/commands/doctor/setup.md`, `assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt` | Modify | Last-hop line |
| `.skilled/hooks/hook-flags.env.example`, `system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | The notice switch |
| Session-relaunch README, tests README, feature catalog entry, root `README.md` | Modify | Docs |
| v4.0.0.13 changelog, hooks README, bin README, system-spec-kit README and catalog index, the Claude relaunch playbook, the `/doctor:setup` playbook scenario | Modify | Rollup: the hop history and the notice switch in every doc that describes the loop or `/doctor:setup` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each hop writes `handed-over`, `claimed` and `done` lines, and a killer timeout writes `timed-out`, to a persistent gitignored file. |
| REQ-002 | A failed history write never fails or delays the hop it describes. |
| REQ-003 | `session-relaunch.cjs history` prints the latest lines, says plainly when nothing is recorded yet, and rejects a bad `--last` with exit 2. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `/doctor:setup` shows the last hop as information that never changes its status. |
| REQ-005 | `SESSION_RELAUNCH_NOTIFY_HOPS` shows a macOS notice on each hand-over. It is off by default, documented, and turned on only in this machine's gitignored hook-flags file. |
| REQ-006 | The README, tests README, ENV-REFERENCE, example flags file, feature catalog and root README describe the history and the switch. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live Claude hop writes all three hop lines, and `history` prints them.
- **SC-002**: The session-relaunch suite passes with the new tests and no other count change.
- **SC-003**: A clone without the switch sees no notice.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A history write throws inside the hop path | High | Every write is wrapped and returns a boolean |
| Risk | `osascript` hangs | Med | It runs with a three-second timeout and its output is ignored |
| Risk | A test writes into the real repository's history | Low | Every new test sets `SESSION_RELAUNCH_REPO_ROOT` to a sandbox |
| Dependency | The hook-flags reader | Notice switch unreadable | The CLI already resolves switches through it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Recording adds one append per event and no network call.

### Security
- **NFR-S01**: The history file is created with mode 0600 in a 0700 directory, and the goal text is cut to 120 characters.

### Reliability
- **NFR-R01**: Tabs and line breaks inside a field are flattened so one event stays one line.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No history file yet: `history` prints `no hop recorded yet` and the path, and exits 0.
- A goal longer than 120 characters: cut with an ellipsis.
- `--last zero` or a negative count: exit 2.

### Error Scenarios
- The note cannot be read: the line still lands, with empty goal and cwd fields.
- The state directory cannot be written: the hop goes on and nothing is recorded.

### State Transitions
- A declined relaunch: nothing is recorded.
- A run outside the loop: `claim` and `complete` still record, with `-` as the hop number.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One new module, three call sites, one doctor step, docs |
| Risk | 6/25 | Additive and best effort, off the hop's critical path |
| Research | 4/20 | Where the existing log lives and why it is not enough |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
