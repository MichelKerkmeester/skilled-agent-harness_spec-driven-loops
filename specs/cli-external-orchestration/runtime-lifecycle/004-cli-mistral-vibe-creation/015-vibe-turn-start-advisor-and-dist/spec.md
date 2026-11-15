---
title: "Feature Specification: Phase 15: vibe-turn-start-advisor-and-dist"
description: "A Vibe session gets no skill advisor brief per prompt and no dist-freshness recheck after an edit, although Vibe's pre_agent and post_tool hooks can both add context the model reads. This phase adds a pre_agent turn-start composer whose first part is the advisor brief, and a non-strict post_tool dist-freshness hook."
trigger_phrases:
  - "vibe turn start advisor and dist"
  - "phase 15 vibe turn start"
  - "vibe pre_agent advisor brief"
  - "vibe dist freshness post_tool"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: vibe-turn-start-advisor-and-dist

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
| **Phase** | 15 of 21 |
| **Predecessor** | 014-vibe-journal-fixture-and-reader |
| **Successor** | 016-vibe-turn-end-guards |
| **Handoff Criteria** | A main-session keyed run's journal shows the advisor brief added to the prompt, a child keyed run's journal shows a dist warning appended to an edit result, and the composer accepts new parts without a new `hooks.toml` entry |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: One `pre_agent` turn-start composer, with the advisor brief as its only part for now, and one `post_tool` dist-freshness hook. The later parts (completion advisory, save nudge, compaction context, relaunch claim) belong to phases 016 to 019.

**Dependencies**:
- Phase 011's `session-start.mjs`, whose fixed, fail-open part list (`.skilled/hooks/session-lifecycle/vibe/session-start.mjs:121-126`) is the composer's model.
- Phase 014 is the predecessor in the linear order. This phase needs none of its facts, because `pre_agent` and `post_tool` context are already observed or documented.
- The shared advisor handler `handleClaudeUserPromptSubmit` in `.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js`, which the dsh adapter already calls (`.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:122-128`).

**Deliverables**:
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` and the advisor part `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`.
- `.vibe/plugins/repo-guards/dist-freshness.mjs`.
- `vibe` in the advisor's runtime label list, and both hooks registered in `.vibe/hooks.toml`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every other governed runtime injects the skill advisor brief on each prompt, but a Vibe session sees it only if the model runs the skill step itself. Vibe's `pre_agent` hook can add `additional_context` after the user's message, and that text stays in the conversation (Vibe hook reference `vibe/plugins/builtins/vibe/skills/vibe/SKILL.md`, the `pre_agent` event-specific payloads). Separately, the dist-freshness check runs only once, at session start, inside the `session_start` composer (`.skilled/hooks/session-lifecycle/vibe/session-start.mjs:96`). An edit to a watched package mid-session leaves the model trusting a stale build. Two more blockers: the advisor's runtime label list has no `vibe` (`.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts:10-18`), and the dsh adapter keeps its directive receipts in memory, which a per-call Vibe hook process cannot.

### Purpose
Each operator prompt in a main Vibe session carries the advisor routing head only when it changed and the directive block once per session, and each edit to a watched package source returns a staleness warning with its tool result.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c "type = \"pre_agent\"" .vibe/hooks.toml
1
$ rg -n "dist-freshness|check-dist-staleness" .vibe/hooks.toml; echo "exit=$?"
exit=1
$ rg -n "'dsh'|'vibe'" .skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts
17:  'dsh',
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `pre_agent` turn-start composer, with `match = "main"` and a fixed, fail-open part list, that returns the joined parts as `hook_specific_output.additional_context`.
- Add the advisor part. It skips a blank prompt, `AI_SESSION_CHILD=1` and a subagent, and it calls the shared handler with runtime `vibe` and the session id, so the shared cross-process directive store dedupes the directive block.
- Add `vibe` to `ADVISOR_RUNTIME_VALUES`, and rebuild the advisor dist.
- Add a non-strict `post_tool` dist-freshness hook. It checks the edited file on `write_file` and `edit`, and on `bash` or `process_start` only when the command runs `validate.sh` or a dispatch. It adds a warning only.
- Register both hooks in `.vibe/hooks.toml`, keeping the `$(git rev-parse --show-toplevel)` command form the home renderer needs.

### Out of Scope
- Folding `spec-gate-classify` into the composer - it stays its own `pre_agent` entry, so a composer failure cannot open the spec gate.
- Advisor briefs for subagents - `session_start` and this composer skip subagents, matching how a child is treated elsewhere.
- An advisor status tool - Vibe has no plugin tool registry.
- Warning before a risky shell command runs - `pre_tool` can only deny or rewrite, not add context (Vibe hook reference, the reply-schema section).
- The later composer parts - phases 016 to 019.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Create | The `pre_agent` composer, with an ordered part list |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Create | The advisor part |
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts` | Modify | Add `vibe` |
| `.vibe/plugins/repo-guards/dist-freshness.mjs` | Create | The non-strict `post_tool` staleness check |
| `.vibe/hooks.toml` | Modify | One `pre_agent` entry and two `post_tool` entries for dist freshness |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | Create | Composer, skip and fail-open cases |
| `.vibe/plugins/repo-guards/tests/dist-freshness.test.mjs` | Create | Edit, matched shell and unmatched shell cases |
| `.skilled/hooks/session-lifecycle/vibe/README.md`, `.skilled/hooks/dist-freshness/README.md`, `.vibe/SYNC.md` | Modify | The Vibe rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A main-session prompt carries the advisor brief | A keyed fixture run with the rendered home hooks shows a `pre_agent` `hook_completed` record whose added context starts with `Advisor:` |
| REQ-002 | An edit to a watched package source returns a staleness warning | The dist-freshness test feeds a `post_tool` payload for a stale watched file and gets `additional_context` with `STALE DIST WARNING` |
| REQ-003 | Neither hook ever blocks | Both entries are non-strict, and malformed stdin gives exit 0 with empty output in each test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Neither the routing head nor the directive block repeats unchanged | Two composer calls with the same session id and the same route produce the routing head and the `Directives:` block once, using the shared file-backed directive store for the block and a per-session head receipt for the head |
| REQ-005 | Children and subagents get no brief | The composer test with `AI_SESSION_CHILD=1`, and with a non-null `parent_session_id`, prints empty output |
| REQ-006 | The added latency stays within a limit | `scratch/latency.md` records the median, 95th percentile and maximum wall time of 20 composer calls on a warm advisor; the 95th percentile is at most 1500 ms, or the number is recorded and the operator decides before phase 016 |
| REQ-007 | The home renderer still renders the new entries | `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` prints `fail 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs .vibe/plugins/repo-guards/tests/dist-freshness.test.mjs` prints `fail 0`.
- **SC-002**: A main-session keyed run's journal holds the `pre_agent` advisor context, and a child keyed run's journal holds a `post_tool` dist warning on a `write_file`, both recorded in `scratch/keyed-run/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor dist rebuild after adding `vibe` | High: an unbuilt label drops the brief's metrics, and the handler may reject the runtime | Run the advisor `build` script, then check `rg -n vibe` on the built runtime-values file |
| Risk | `pre_agent` context stays in the conversation, so briefs accumulate | Med: context grows each turn | The shared directive lifecycle sends the directive block once per session, and the advisor part sends the routing head only when it changed from the session's last one |
| Risk | A slow advisor delays every message, since the first message waits for `pre_agent` hooks | Med | A timeout on the entry, a fail-open part, and the REQ-006 measurement before rollout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- UNVERIFIED: does the shared handler emit the routing head every turn, or only when it changes? `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:248-253` covers the directive block only, so the advisor part keeps its own per-session head receipt. T018 checks it.
- UNVERIFIED: does `handleClaudeUserPromptSubmit` accept the Vibe payload's `prompt` and `session_id` fields as the Claude shape does? The dsh adapter maps its own payload, so this adapter maps the Vibe fields the same way.
<!-- /ANCHOR:questions -->

---
