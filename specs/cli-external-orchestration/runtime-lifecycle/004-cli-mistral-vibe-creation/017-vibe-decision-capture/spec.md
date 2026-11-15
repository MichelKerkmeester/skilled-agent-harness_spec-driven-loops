---
title: "Feature Specification: Phase 17: vibe-decision-capture"
description: "An operator's answer to a Vibe question is never queued as a decision record, because no Vibe capture adapter exists and the plugin classification wrongly said Vibe has no question tool. Vibe ships ask_user_question, so this phase adds a silent post_tool adapter, a save-time journal sweep and a turn-start save nudge."
trigger_phrases:
  - "vibe decision capture"
  - "phase 17 vibe decision capture"
  - "vibe ask_user_question capture"
  - "vibe sweep decisions"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: vibe-decision-capture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 21 |
| **Predecessor** | 016-vibe-turn-end-guards |
| **Successor** | 018-vibe-compaction-context |
| **Handoff Criteria** | A Vibe `ask_user_question` payload produces queue records in the fixture test, and the sweep replays a recorded journal into the same keys |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Capture of answered `ask_user_question` calls into the shared decision queue, a save-time sweep of the Vibe journal, and the save nudge. No change to the queue core's record shape.

**Dependencies**:
- Phase 014 (`014-vibe-journal-fixture-and-reader`): item (d), whether `post_tool` fires for `ask_user_question` and its `tool_output` shape, and the journal reader the sweep uses.
- Phase 015 (`015-vibe-turn-start-advisor-and-dist`): the turn-start composer the save nudge rides on.
- Phase 016 precedes this one in the linear order but is not a dependency.

**Deliverables**:
- A silent, non-strict `post_tool` adapter that appends records to the queue.
- A Vibe sweep that replays a journal at save time.
- A turn-start part that reports the pending answer count once.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/hooks/decision-capture/` has adapters for Claude, Devin, DSH and Pi but none for Vibe, so an answer the operator gives through Vibe's `ask_user_question` tool (`vibe/core/tools/builtins/ask_user_question.py`) is lost to `/speckit:save`. The shared normalizer cannot simply be reused: it expects `answers` as an object keyed by question text, while Vibe's `UserQuestionResult` returns a list of `{question, answer, is_other}` (`vibe/questions.py:58-68`), and the Measured Behavior block shows that list yields zero records.

### Purpose
Every answered Vibe `ask_user_question` call lands in the decision queue with the same key whether the live hook or the save-time sweep wrote it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/017-vibe-decision-capture/scratch/norm-probe.mjs "$PWD"
records=0
exit=0
$ ls .skilled/hooks/decision-capture
bin
claude
devin
dsh
lib
pi
tests
$ ls .skilled/hooks/decision-capture/bin | rg -c vibe; echo "exit=$?"
exit=1
```

`scratch/norm-probe.mjs` imports `normalizeAskUserQuestion` from `.skilled/hooks/decision-capture/lib/capture-core.mjs` and passes one question with `toolResponse = {answers: [{question: 'Which route?', answer: 'A', is_other: false}], cancelled: false}`, the shape `vibe/questions.py:58-68` declares.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a Vibe answer mapper that turns the `answers` list into the question-keyed object the shared normalizer reads, and yields no records for `cancelled: true`.
- Add a silent, non-strict `post_tool` adapter matched to `ask_user_question` that appends the mapped records through `appendRecords`, keyed on `tool_call_id`.
- Add a Vibe sweep that replays a session journal through the phase 014 reader and appends the answers the live hook missed, under the same keys.
- Wire that sweep into `/speckit:save`: the save command and the save workflow reference list one sweep per runtime, and without a Vibe line nothing calls `sweep-vibe.mjs`.
- Add a turn-start part that calls `takeNudge` and injects a one-line save reminder when the count rises.
- Register the adapter as one `post_tool` entry in `.vibe/hooks.toml`.

### Out of Scope
- A change to `normalizeAskUserQuestion` or the queue record shape - every other runtime's keys depend on it, so the Vibe shape is mapped in the adapter.
- The plain-chat question candidates `sweep-transcript.mjs` lists for Claude - no Vibe consumer needs them yet.
- A Vibe column in the hooks README coverage row - `runtime-refusal.test.mjs` pins seven runtime cells, so phase 021 decides that column for every concern at once.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` | Create | Exports `vibeAnswerRecords` (the list-to-object mapper) and the journal sweep CLI |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` | Create | Mapper, cancel and sweep cases over a recorded or synthetic journal |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` | Create | The live `post_tool` adapter |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.test.mjs` | Create | Payload fixture cases |
| `.skilled/hooks/decision-capture/vibe/README.md` | Create | Adapter README |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modify | The save-nudge part |
| `.vibe/hooks.toml` | Modify | One non-strict `post_tool` entry, `match = "ask_user_question"` |
| `.skilled/hooks/decision-capture/bin/README.md` | Modify | The `sweep-vibe` rows |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | Modify | The save-nudge cases for REQ-005 |
| `.skilled/commands/speckit/save.md` | Modify | Run `sweep-vibe.mjs` on Vibe in the decision-sweep step (lines 67-70) and add it to the command table (lines 114-116), so the save calls the sweep this phase builds |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Name Vibe and `sweep-vibe.mjs` in the "Sweep commands by runtime" line (line 279) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A Vibe answer list becomes queue records | The adapter test feeds the Measured Behavior payload and the queue gains one record whose answer is `A` |
| REQ-002 | The adapter is silent and fails open | Every adapter fixture case prints nothing on stdout and exits 0, including malformed stdin and a payload for another tool |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A cancelled question yields no record | A payload with `cancelled: true` leaves the queue unchanged |
| REQ-004 | Hook and sweep write the same key | The sweep test replays a journal whose answer the hook already queued, and the queue holds one record, not two |
| REQ-005 | The save nudge fires once per rise | The turn-start part injects the reminder when `takeNudge` returns a new count and injects nothing on the next turn at the same count, proven by the save-nudge cases in `turn-start.test.mjs` |
| REQ-006 | A live capture is observed | An operator-run interactive session that answers one question leaves one record in the queue, or the phase records why the run could not show it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/decision-capture/vibe/ask-capture-post-tool.test.mjs .skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` prints `fail 0`.
- **SC-002**: `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` still prints `fail 0`.
- **SC-003**: `rg -c 'match = "ask_user_question"' .vibe/hooks.toml` prints 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 014 item (d): whether `post_tool` fires for `ask_user_question` and the `tool_output` shape hooks receive | High: the adapter's input is a source reading until a run shows it | The fixture tests use the declared model shape; the live check is an operator TUI procedure, and the sweep still captures at save time if the hook never fires |
| Dependency | Phase 015's turn-start composer | Low: only the nudge needs it | The queue fills without the nudge; `/speckit:save` drains it either way |
| Risk | A print-mode run has no question tool, so headless dispatches capture nothing | Low | By design: a dispatched child has no operator to answer |
| Risk | The hook sees a qualified tool name and the `match` misses it | Med | The adapter accepts the short and any `<group>.ask_user_question` name; the TUI procedure confirms the match fires |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- UNVERIFIED: that `post_tool` fires for `ask_user_question`. Vibe's hook reference says `post_tool` fires only when the tool body ran, and the question tool runs through the host's user-input request (`mistralai_vibe_local_harness/vibe/_host.py:2896`), not a tool body. Phase 014 item (d) settles it; if it does not fire, the sweep is the only capture path and REQ-006 is amended.
- UNVERIFIED: whether `tool_output` carries the `answers` list as `vibe/questions.py` declares it or only `tool_output_text`.
<!-- /ANCHOR:questions -->

---
