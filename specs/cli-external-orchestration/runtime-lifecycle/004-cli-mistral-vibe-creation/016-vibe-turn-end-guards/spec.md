---
title: "Feature Specification: Phase 16: vibe-turn-end-guards"
description: "A Vibe turn that ends with a prose option menu or an unproven completion claim goes unchecked, because no post_agent hook exists in this repository and the plugin classification called both guards not portable. Vibe's post_agent deny injects its reason as a retry message, so this phase adds one turn-end composer that sends a prose menu back once and records a completion advisory for the next turn."
trigger_phrases:
  - "vibe turn end guards"
  - "phase 16 vibe turn end guards"
  - "vibe post_agent ask surface"
  - "vibe completion evidence"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: vibe-turn-end-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 21 |
| **Predecessor** | 015-vibe-turn-start-advisor-and-dist |
| **Successor** | 017-vibe-decision-capture |
| **Handoff Criteria** | The turn-end fixture shows one prose-menu turn retried once and a completion claim's advisory delivered on the next turn |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: One `post_agent` composer with two parts, the ask-surface reprompt and the completion-evidence advisory, plus the one turn-start part that delivers the advisory. No other turn-end guard.

**Dependencies**:
- Phase 014 (`014-vibe-journal-fixture-and-reader`): the shared journal reader that returns the turn's last assistant text and tool calls, and the fixture runs that settle whether the reply is on disk when `post_agent` starts and whether a deny produces a retry. This phase builds nothing until 014 records both.
- Phase 015 (`015-vibe-turn-start-advisor-and-dist`): the turn-start composer the completion advisory is delivered through.

**Deliverables**:
- A turn-end composer registered as one `post_agent` entry with `match = "main"`.
- An ask-surface part and a completion-evidence part, each with a fixture test.
- A turn-start part that injects a pending completion advisory once.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.vibe/hooks.toml` registers no `post_agent` hook and `ask-surface-core.cjs` has no Vibe row, so a Vibe turn that ends with a prose option menu or an unproven "done" claim reaches the operator unchecked. The plugin classification marked both guards not portable because `post_agent` cannot be strict, but Vibe's own hook reference says a `post_agent` deny injects its `reason` as a retry user message, capped at three per turn (Vibe `SKILL.md`, the `decision: "deny"` table), and the harness maps that deny to a retry (`mistralai_vibe_local_harness/vibe/_foreign_hooks.py:836-841`).

### Purpose
A main Vibe turn that closes with a prose option menu is sent back once with the ask-surface reprompt, and a completion claim leaves an advisory the model sees on its next turn.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "vibe" .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs; echo "exit=$?"
exit=1
$ ls .skilled/hooks/ask-surface-guard .skilled/hooks/completion
.skilled/hooks/ask-surface-guard:
claude
codex
devin
dsh
fixtures
lib
pi
tests

.skilled/hooks/completion:
claude
codex
cursor
devin
dsh
opencode
pi
README.md
tests
$ rg -c "type = \"post_agent\"" .vibe/hooks.toml; echo "exit=$?"
exit=1
$ rg -o "type = \"[a-z_]+\"" .vibe/hooks.toml | sort | uniq -c
   2 type = "post_tool"
   1 type = "pre_agent"
   7 type = "pre_tool"
   1 type = "session_end"
   1 type = "session_start"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `vibe: ['ask_user_question']` to `QUESTION_TOOLS` in the ask-surface core, so `repromptFor('vibe')` names Vibe's question tool.
- Add an ask-surface part that reads the turn through the 014 journal reader, calls `evaluateTurn` with `surfaceAvailable: false` for a child session, a subagent or a session whose tool catalog lacks `ask_user_question`, and returns a deny with `repromptFor('vibe')` at most once per turn through `markTurn`, keyed on the `turn_id` the 014 reader's `turnId` helper returns. A retry user message keeps the harness's `turn_id`, so the key stays fixed across the retries Vibe counts for that turn.
- Add a completion part that runs `evaluateCompletionEvidence` with the folder `VIBE_SPEC_FOLDER` names, logs the advisory, and writes a pending advisory file. It never denies.
- Add a turn-end composer that runs both parts in order, always lets the completion part write, and prints at most one deny.
- Add a turn-start part, inside the 015 composer, that injects a pending completion advisory once and deletes it.

### Out of Scope
- A blocking completion gate - the completion README keeps the sentinel advisory-only (`.skilled/hooks/completion/README.md:133`).
- Turn-end guards for subagents - `match = "main"` keeps the retry budget on the operator's turn, and a subagent has no operator to ask.
- A Vibe column in the shared hooks runtime matrices - it touches every concern row, so phase 021 decides it with the doc corrections.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Modify | Add the `vibe` row to `QUESTION_TOOLS` |
| `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs` | Create | Ask-surface part over the 014 reader |
| `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs` | Create | Completion part; real file, as every completion adapter lives under `runtime/hooks/{runtime}/` |
| `.skilled/hooks/completion/vibe/completion-evidence-post-agent.cjs` | Create (symlink) | Symlink to the real adapter, as the completion README requires |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | Create | The one registered `post_agent` composer |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modify | Add the pending-advisory part to the 015 composer |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` | Create | Fixture tests for both parts and the composer |
| `.vibe/hooks.toml` | Modify | One `post_agent` entry, `match = "main"`, in the `$(git rev-parse --show-toplevel)` form |
| `.skilled/hooks/completion/README.md`, `.skilled/hooks/session-lifecycle/vibe/README.md` | Modify | Vibe rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A prose-menu turn is sent back once | The composer fixture with a prose-menu journal prints one deny whose reason equals `repromptFor('vibe')`; the same turn key a second time prints nothing, and a retry that arrives with the same `turn_id` does not fire the reprompt again |
| REQ-002 | The composer never blocks on its own failure | Malformed stdin, a missing journal or a part that throws yields exit 0 and empty stdout in the fixture test |
| REQ-003 | A headless or child session is never reprompted | With `AI_SESSION_CHILD=1`, a set `parent_session_id`, or a journal whose tool catalog lacks `ask_user_question`, the fixture prints no deny |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A completion claim leaves a next-turn advisory | A claim journal with `VIBE_SPEC_FOLDER` set writes one pending advisory file; the turn-start part injects it once and the file is gone after |
| REQ-005 | The completion part never denies | Every completion fixture case prints no `decision` field from the completion part |
| REQ-006 | A live retry is observed | One operator-run interactive session records a retry user message carrying the reprompt in its journal. A print-mode run cannot show it, because it has no question tool and the part passes it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` prints `fail 0`.
- **SC-002**: `node --test .skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs` still prints `fail 0` after the `vibe` row lands.
- **SC-003**: `rg -c 'type = "post_agent"' .vibe/hooks.toml` prints 1 and `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` prints `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 014's journal reader and its `post_agent` fixture facts | High: the `post_agent` payload carries no assistant text, only `transcript_path`, so without the reader the parts have nothing to judge | Setup halts until 014 records that the final reply is on disk at hook time; if it is not, the ask-surface part moves to the next turn's `pre_agent` and this spec is amended |
| Dependency | Phase 015's turn-start composer | Med: the completion advisory has no delivery seam without it | The pending file is still written and logged, so the advisory survives in the log until 015 lands |
| Risk | The session journal is Vibe's internal recovery format, so an upgrade can change it silently | Med | The reader and its fixtures pin Vibe 3.1.2; a parse miss fails open and the fixture test fails on the recorded journal |
| Risk | The three-retry cap is shared by every `post_agent` hook | Low | One composer, one deny per operator message |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- UNVERIFIED: whether the final assistant reply is in the journal when the `post_agent` hook starts. Phase 014 settles it.
- UNVERIFIED: the turn key for `markTurn`. The `post_agent` payload has no `turn_id` (Vibe `SKILL.md` wire protocol), so the key comes from the 014 reader's `turnId` helper. A user-message id would change on every retry, because a deny injects a new retry user message (Vibe `SKILL.md`:987), and the reprompt could then fire up to three times. The harness counts retries per `turn_id` (`mistralai_vibe_local_harness/vibe/_local_actions.py`:1087), which suggests the id survives a retry; 014 T006 records whether the journal shows it.
- UNVERIFIED: the qualified tool name hooks see for the question tool. The host runs it as `ask_user_question` (`mistralai_vibe_local_harness/vibe/_host.py:2896`); the part accepts both the short and any `<group>.ask_user_question` form.
<!-- /ANCHOR:questions -->

---
