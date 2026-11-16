---
title: "Feature Specification: Phase 1: hop-recall-baseline"
description: "Measures, before any runtime code is built, whether a session that claims a handoff recovers a detail the handoff note left out, and whether it reads the sender's transcript on its own. The recorded rate is the go or no-go gate for the five phases that follow."
trigger_phrases:
  - "hop recall baseline"
  - "phase 1 hop recall baseline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: hop-recall-baseline

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-history-core-relocation |
| **Handoff Criteria** | The measurement is recorded and the operator has answered go, as the parent spec's phase handoff table requires. Both arm pages pass the playbook validator, every counted run has an observed line, and `goal.md` §4 holds the threshold and the answer. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the history-lookup-inside-the-handover specification.

**Scope Boundary**: Measurement only. This phase writes two playbook pages and records what it observes. It changes no runtime file.

**Dependencies**:
- A hop started through `.skilled/bin/skilled-loop`, because only the wrapper relaunches a session with the claim seed.
- The manual-testing-playbook operator-scenario contract, enforced by `validate-playbook-package.cjs`.
- `tmux`, so the operator can type into the sender and the receiver and capture both panes.

**Deliverables**:
- `hop-recall-conversation.md`, the arm where the lookup CLI is on disk.
- `hop-recall-baseline-conversation.md`, the arm where the CLI is hidden.
- A `### Recorded Results` table in each page, one row per counted run.
- The threshold and the GO or NO-GO answer in `goal.md` §4.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The handover starts a fresh session near the context limit, so the receiver holds only the four sections of the handoff note. The history lookup that could recover a missing detail is offered only after a compaction, which the hop is designed to prevent. Nobody has measured whether a receiver recovers such a detail on its own, so phases 002 to 006 would be built on an assumption.

### Purpose
Record, per runtime, whether a receiving session recovers a code the handoff note left out, and whether it reads the sender's transcript on its own, so the operator can answer go or no-go before any code is written.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n --include-zero --sort path -c 'historyLocator' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:0
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:0
.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:16
```

The compaction adapter names `historyLocator` 16 times. The handover core and its CLI name it 0 times, so a hop mints no locator and prints no lookup offer.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the two arm pages, each a full operator scenario with its procedure, observed line, pass or fail rule and failure triage.
- Record one observed line per counted run in each page's `### Recorded Results` table.
- State the decision rule that turns the recorded lines into GO or NO-GO.
- Record the operator's threshold and the answer in `goal.md` §4.

### Out of Scope
- Any runtime code change - the phase measures today's behaviour, so a fix would invalidate the baseline.
- An offer in the claim output - phase 004 owns it.
- A locator minted at `prepare` - phase 003 owns it.
- Pi, OpenCode and Codex as required arms - they are optional follow-ups after Claude Code.
- A lookup across runtimes, and a lookup further back than the sender session.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md` | Create | Arm A: the hop with the lookup CLI on disk and no offer. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-baseline-conversation.md` | Create | Arm B: the same hop with the lookup CLI hidden. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | Modify | One index row per arm page. |
| `goal.md` | Modify | The recorded threshold and the GO or NO-GO answer. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both arm pages exist and satisfy the operator-scenario contract. | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --repo-root . --skills-root .skilled/skills` prints `scenarios=126 violations=0`. |
| REQ-002 | Each arm page carries a `### Recorded Results` table with one row per counted run. | Each page's table holds one row per counted run and every row's `answer` reads `correct`, `wrong` or `missing`. |
| REQ-003 | A run counts only when the note reached `claimed`, the note does not hold the code, and the receiver session id differs from the sender's. | Every counted row comes from a note that reached `claimed`, shows `note_leaked=0`, and its receiver id differs from the note filename suffix. |
| REQ-004 | The phase states the decision rule and records the operator's threshold and answer. | `goal.md` §4 holds one `Threshold:` line and one `Decision:` line naming GO or NO-GO. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Both pages name Pi, OpenCode and Codex as optional follow-ups, with the enable flag and, for Codex, the hook-trust precondition. | `rg -l 'Pi, OpenCode and Codex'` finds both pages, and each page names `SYSTEM_SESSION_RELAUNCH_ENABLED=1` and `trust_hooks`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The playbook validator prints `scenarios=126 violations=0` after both pages are registered.
- **SC-002**: Each arm's table holds at least the operator's run count for Claude Code, and every row carries `answer`, `lookup_attempted`, `native_recall`, `transcript_read` and `note_leaked`.
- **SC-003**: `git status --porcelain -- .skilled/hooks .skilled/skills/system-spec-kit/runtime` prints nothing, so no runtime file changed.

### Decision Rule

A run counts when `note_leaked=0`, the receiver session id differs from the sender's, and the note reached `claimed`. Let `lost` be the counted runs whose `answer` is `wrong` or `missing` and whose `transcript_read=0`, and `total` the counted runs.

- **GO** when `lost / total >= T`.
- **NO-GO** when `lost / total < T`.
- With `total=0`, or with `T` unset, the phase is undecidable and phase 002 does not start.

`T` is the operator's threshold and is UNKNOWN until the operator sets it. A NO-GO stops the packet or rescopes it; it never starts phase 002. The lookup-present arm does not change the verdict: it records `lookup_attempted`, which phase 004 uses to word the offer.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.skilled/bin/skilled-loop` and the Claude Code hooks | No hop, so no measurement | Start with `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, and record a runtime that cannot hop as SKIP with its blocker. |
| Dependency | `tmux` | The operator cannot type into the sender and the receiver | Drive the procedure by hand in one terminal and record the pane text by hand. |
| Risk | The sender writes the code into the note | A correct answer that proves nothing | Record `note_leaked`; a leaked run is not counted. |
| Risk | The receiver reads the sender's transcript | A correct answer from a path the offer would replace | Record `transcript_read`; the decision rule counts it as self-serve, not as recovery. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What threshold `T` turns the measured loss rate into GO? Decision: UNKNOWN, the operator sets it before phase 002.
- How many runs per arm per runtime count toward `T`? Decision: UNKNOWN, part of the same operator answer.
- Does the lookup-present arm need a pasted command to stand in for the phase 004 offer? Decision: no, a pasted command would coach the behaviour under test, so the arm only puts the CLI on disk.
<!-- /ANCHOR:questions -->

---
