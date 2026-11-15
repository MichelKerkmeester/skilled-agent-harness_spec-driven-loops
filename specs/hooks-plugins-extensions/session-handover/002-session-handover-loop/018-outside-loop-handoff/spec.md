---
title: "Feature Specification: Phase 18: outside-loop-handoff"
description: "A session started without skilled-loop got no handoff request, lost detail to auto-compaction and left no trace. This phase gives it a note-only nudge, a keep command, a pointer back to the note after a Claude compaction and an open-notes line in the hop history."
trigger_phrases:
  - "outside loop handoff"
  - "phase 18 outside loop handoff"
  - "session relaunch keep command"
  - "compact pointer"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: outside-loop-handoff

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/187-outside-loop-handoff` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-hop-history |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the session-relaunch and Pi suites pass and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Session relaunch loop specification.

**Scope Boundary**: What a session outside `skilled-loop` is asked to do near its context limit, how it finds its note after a compaction, and how the operator sees notes nobody claimed. The hop inside the loop does not change.

**Dependencies**:
- Phase 017, whose hop history this phase writes to and reads.
- The shared nudge module that all five automatic adapters call.

**Deliverables**:
- The note-only nudge outside the loop.
- `session-relaunch.cjs keep` and the `note-kept` history event.
- The Claude `compact-pointer` hook on `SessionStart`.
- The open-notes line in `history` and `/doctor:setup`.
- Tests, docs and release notes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-10-20 two Claude sessions on the figjam packet wrote handoff notes that never went anywhere, because they started before the shell shim and so ran outside the loop. Since the fix that day, the nudge stays silent outside the loop. One of those sessions then reached 93% of its window, compacted, and had to work out its merge decisions again from a thin summary. Nothing recorded that it had hit the threshold, and the two orphaned notes showed up nowhere.

### Purpose
A session outside the loop keeps its exact state on disk at the threshold, finds it again after a compaction, and leaves a trace the operator can see.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Outside the loop, the nudge asks for the note, a continuity save when a packet is bound, and `keep`, never `prepare`.
- `keep --handoff <path> [--session <id>] [--runtime <runtime>]`: validate, record `note-kept`, print the claim and complete commands, exit 0; exit 2 inside the loop.
- An open note this session wrote silences further nudges outside the loop.
- A Claude `SessionStart` hook that, after a compaction, resets the nudge level and points the session at its open note.
- An `open notes:` line in `history` and in `/doctor:setup`.

### Out of Scope
- Compaction hooks for Codex, Pi, OpenCode and Hermes. `keep` prints the claim command for them, and the operator's case was Claude.
- Moving a running session into the loop. A process cannot be re-parented under a new wrapper.
- Filling `spec_folder` from the bound packet. No adapter receives it today, inside or outside the loop.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Outside-loop decision, note-only text, `claimCommandFor`, `afterCompaction` seed text |
| `.skilled/hooks/session-relaunch/lib/hop-history.cjs` | Modify | `note-kept` event, `openNotes`, `openNotesLine` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `keep` subcommand, shared note check, open-notes line in `history` |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Create | The post-compaction pointer |
| `hook-registry.json`, `.claude/settings.json`, `.claude/hooks/compact-pointer.mjs` | Modify / Create | Registration and its rendered and mirrored forms |
| Session-relaunch tests, Pi test, registry sync test | Modify | Outside-loop behaviour, `keep`, open notes, compact pointer, binding count |
| `doctor-setup.yaml`, `doctor-setup-presentation.txt` | Modify | Open-notes line |
| Concern, tests, hooks, OpenCode plugins, system-spec-kit and root READMEs; `/speckit:handoff`; feature catalog entry and index; Claude and Pi/OpenCode playbooks; `/doctor:setup` scenario | Modify | Docs |
| `v4.0.0.13.md`, `system-spec-kit/changelog/v2.8.5.0.md`, `system-spec-kit/SKILL.md`, Hermes mirror | Modify / Create | Release notes and version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Outside the loop, every automatic adapter's nudge asks for the note and `keep`, and never for `prepare`. |
| REQ-002 | `keep` validates the note like `prepare`, records `note-kept`, prints the claim and complete commands and exits 0 outside the loop, and exits 2 inside it. |
| REQ-003 | Inside the loop, the nudge and `prepare` behave exactly as before. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | After a Claude compaction, the session's nudge level resets and the session receives claim instructions for its open note, unless a prepared hop owns the note. |
| REQ-005 | `history` and `/doctor:setup` name the count and the oldest note while any handoff note is open. |
| REQ-006 | The docs that describe the nudge, the CLI, the history and `/doctor:setup` say what happens outside the loop. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live Claude session outside the loop writes its note and runs `keep`, then after `/compact` claims and completes it, and the history shows `note-kept`, `claimed` and `done`.
- **SC-002**: The session-relaunch and Pi suites pass with the new tests.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The outside-loop text asks for `prepare` and the session stops | High | Tests assert `keep` and the absence of `prepare` for all five adapters |
| Risk | The pointer claims a note a prepared hop owns | High | It checks `handoffPending` first, and a test fails without that check |
| Risk | Re-nudges repeat while the note is being written | Med | An open note this session wrote silences the nudge outside the loop |
| Dependency | Claude's `SessionStart` `source: compact` field | No pointer | Verified live on 2026-10-21 |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The open-note check reads the handoffs directory only once the fill passes the threshold.

### Security
- **NFR-S01**: `keep` resolves the note path through the same in-repository check as `prepare`.

### Reliability
- **NFR-R01**: The pointer and `keep` never fail a session: a state or log write failure is logged or ignored.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No open note after a compaction: the pointer resets the level and adds nothing.
- A `SessionStart` from a fresh start or a resume: the pointer does nothing.

### Error Scenarios
- `keep` inside the loop: exit 2, naming `prepare`.
- An invalid note: `keep` exits 2 with the same reason `prepare` gives.

### State Transitions
- A note written but not yet kept: the next nudge stays quiet, and the pointer still finds it after a compaction.
- A note claimed after a compaction: the open-notes line drops it and the next fill nudges again.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two library changes, one subcommand, one new hook, docs across a dozen files |
| Risk | 8/25 | Changes a documented behaviour outside the loop; inside the loop is untouched |
| Research | 4/20 | Live evidence from the figjam session and the handoff notes |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
