---
title: "Feature Specification: Phase 14: vibe-journal-fixture-and-reader"
description: "Three Vibe parity designs rest on facts only a run can show: whether the final reply is in the session journal when a post_agent hook starts, how a compaction is recorded, and whether post_tool fires on ask_user_question. This phase records those facts in keyed fixture runs and builds the shared Vibe journal reader the later hooks use."
trigger_phrases:
  - "vibe journal fixture and reader"
  - "phase 14 vibe journal fixture"
  - "vibe post_agent fixture"
  - "vibe session journal reader"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: vibe-journal-fixture-and-reader

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 21 |
| **Predecessor** | 013-vibe-audit-fixes |
| **Successor** | 015-vibe-turn-start-advisor-and-dist |
| **Handoff Criteria** | `scratch/facts.md` answers each fixture question with a journal excerpt or names it interactive-only, and the reader's tests pass on the recorded journals |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Keyed fixture runs that observe Vibe behavior, plus one read-only journal reader. No turn-end, capture or compaction hook is registered in `.vibe/hooks.toml`; phases 016 to 018 do that.

**Dependencies**:
- Phase 008's fixture runner `.vibe/plugins/repo-guards/fixtures/run-fixture.sh`, which builds a trusted throwaway project, runs one keyed `vibe -p` turn and reads the journal.
- `MISTRAL_API_KEY` exported for the keyed runs.
- Phase 013 is first in the linear order but is not a dependency.

**Deliverables**:
- Fixture `hooks.toml` files and capture scripts for the `post_agent` and compaction probes, with each run's journal excerpt in `scratch/`.
- `.skilled/hooks/shared/session-readers/vibe.mjs`: the read-only Vibe journal reader, with tests.
- `scratch/facts.md`: one answer per fixture question, the evidence behind it, and the consequence for phases 016 to 018.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The turn-end guard, decision capture and compaction designs each rest on a reading of Vibe's source that no run has shown. Three things are known from source only. A `post_agent` deny becomes a retry (`mistralai_vibe_local_harness/vibe/_foreign_hooks.py:836-841`), capped at three per turn (`_local_actions.py:1084-1096`). The hook payload carries no reply text, only `transcript_path`, which is the session storage root (`_foreign_hooks.py:275-285`). A compaction is recorded as `context_compacted` (`mistralai_vibe_local_harness/protocol.py:1419-1427`). Nobody knows yet whether the final reply is on disk when a `post_agent` hook starts, what a compaction entry looks like on disk, or whether `post_tool` fires for `ask_user_question`. And no reader turns a Vibe journal into anything a hook can use.

### Purpose
Each fact that phases 016 to 018 rely on is observed in a recorded run, or named as interactive-only with a written operator procedure, and one shared reader gives those phases the last reply, the current turn's tool calls and the compactions since a watermark.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c "type = \"post_agent\"" .vibe/hooks.toml; echo "exit=$?"
exit=1
$ ls .skilled/hooks/shared/session-readers/vibe.mjs
ls: .skilled/hooks/shared/session-readers/vibe.mjs: No such file or directory
$ node -e <count journal records by type> 011/.../journal/0000000000000001.jsonl
{"command_reserved":1,"core_input":7,"projection_delta":14,"action_intent":6,"action_result":6,"receipt_succeeded":1}
$ rg -c "context_compacted|completion_succeeded" <that journal>
4
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record a `post_agent` hook's stdin, and whether the final reply's journal record exists when the hook starts.
- Record a `post_agent` deny producing a retry turn, the third deny being force-accepted, and whether the journal keeps the same `turn_id` through each retry, so phase 016 can key its once-per-turn rule on it.
- Force one compaction in a keyed run through a fixture model row with a small `max_context_length`, and record the on-disk shape of its journal entry. A low `auto_compact_threshold` cannot do it: Vibe raises any threshold below max(min(50000, window/2), 10000) (`mistralai_vibe_local_harness/vibe/completion_profile/bounds.py:40-47`).
- Find out whether `post_tool` fires on `ask_user_question`. Headless runs list no such tool, so this item may close as interactive-only, with a written TUI procedure.
- Build the read-only journal reader, and test it on copies of the recorded journals.

### Out of Scope
- Registering any of the new hooks in `.vibe/hooks.toml` - phases 016, 017 and 018 own the registrations.
- Turning the reader into a `HistoryEntry` projection for history lookup - phase 018 decides that once the compaction shape is known.
- Changing `run-fixture.sh` beyond one optional fixture-config argument - it always copies the repository config today (`run-fixture.sh:16`), so the compaction fixture's own config would never be read. Without the argument it behaves as now.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.vibe/plugins/repo-guards/fixtures/post-agent/hooks.toml` | Create | One `post_agent` capture hook, and a deny variant |
| `.vibe/plugins/repo-guards/fixtures/post-agent/capture-post-agent.sh` | Create | Appends stdin and a directory listing of `transcript_path` to a log; optionally prints a deny |
| `.vibe/plugins/repo-guards/fixtures/run-fixture.sh` | Modify | An optional fourth argument that replaces the copied repository config |
| `.vibe/plugins/repo-guards/fixtures/compaction/config.toml` | Create | The repository's rows plus a fixture model row with a small `max_context_length`, so one run compacts |
| `.skilled/hooks/shared/session-readers/vibe.mjs` | Create | `loadVibeSession`, plus `lastAssistantText`, `turnToolCalls`, `compactionsSince` and `turnId` helpers |
| `.skilled/hooks/shared/session-readers/index.mjs` | Modify | A `vibe` row in `capabilities` with `status: 'gated'` and its loader; phase 018 promotes it |
| `.skilled/hooks/shared/session-readers/README.md` | Modify | The Vibe row and its source fields |
| `.skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` | Create | Tests on redacted copies of the recorded journals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `post_agent` payload and the final reply's visibility are observed | `scratch/facts.md` quotes the captured stdin, and states whether the reply record existed at hook start, citing the capture log |
| REQ-002 | A `post_agent` deny's effect is observed | The deny run's journal shows a retry turn carrying the deny reason, a run that always denies shows the turn accepted after the third retry, and `scratch/facts.md` states whether `turn_id` stays the same through the retries |
| REQ-003 | The reader returns the last reply from a recorded journal | `node --test .skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` prints `fail 0`, with a case asserting the exact reply text of the 011 scratch-cwd run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A compaction's journal shape is observed | `scratch/facts.md` quotes one `context_compacted` record from a keyed run, and the reader test covers `compactionsSince` against it |
| REQ-005 | The `ask_user_question` hook behavior is answered or handed off | `scratch/facts.md` either quotes a `post_tool` payload for the tool, or says interactive-only and gives the TUI steps the operator runs |
| REQ-007 | The reader exposes the current turn id | A test asserts `turnId` returns the recorded `turn_id` of the 011 scratch-cwd run's last turn |
| REQ-006 | The reader never writes and never throws across its boundary | A test asserts the journal bytes and modification time are unchanged after a read, and that a missing path returns `{ ok: false, code }` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/shared/tests/session-readers/vibe-reader.test.mjs` prints `fail 0`.
- **SC-002**: `rg -c '^## Q' scratch/facts.md` prints 4, and each section ends with `Answer:` and `Consequence:` lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MISTRAL_API_KEY` for the keyed runs | High: no observation without it | The reader is built and tested on the existing recorded journals first; the probes wait for the key |
| Risk | The journal is Vibe's internal recovery format and can change in an upgrade | High: a reader that silently returns nothing disables the turn-end guard | `meta.json` carries no version, and `export.json` (which records `vibe_version`) is written only when the run ends. So the reader validates the record shapes it depends on, and returns `{ ok: false, code: 'unsupported_format' }` when none match, never an empty success. A pinned `3.1.2` fixture test catches a format change on upgrade |
| Risk | A forced compaction may need more turns than one prompt gives, or Vibe may refuse a very small window | Med | A fixture model row with a small `max_context_length` drops the threshold floor to 10,000 tokens (`bounds.py:40-47`); the probe prompt reads past that. The exact window value is UNVERIFIED until the run. If Vibe refuses the window, the fallback is `/compact` in an interactive session (a `manual` trigger, `protocol.py:1426`), recorded by the operator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- UNVERIFIED: is the final reply's `completion_succeeded` record on disk before a `post_agent` hook starts? Fable inferred yes from the 011 journal order; REQ-001 observes it.
- UNVERIFIED: is a `context_compacted` record written to the journal in the same shape as `protocol.py:1419-1427`? No recorded journal has a compaction yet.
- UNVERIFIED: does `post_tool` fire for `ask_user_question`, and what is its `tool_output`? `vibe/questions.py:58-68` gives the result model, but the headless journals list no such tool.
<!-- /ANCHOR:questions -->

---
