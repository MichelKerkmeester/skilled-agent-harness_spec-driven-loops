---
title: "Goal: Phase 13: opencode-child-and-title"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "opencode child and title goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/013-opencode-child-and-title"
    last_updated_at: "2026-11-13T08:49:36Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: opencode-child-and-title

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** On OpenCode, a parent session does not hand over while one of its sub-agents is busy, and a receiver that claims a seed carries the launch name as its title, each built only where a live check on OpenCode 2.2.7 shows it can work.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Nothing is implemented until the operator gives the green light. |
| D2 | Live checks come first. The event trace and the title call run in a throwaway clone, never in the working checkout, and every non-interactive `opencode run` passes `-m <provider/model>`. |
| D3 | A change whose live check refutes it is dropped, and its evidence and a decision record replace its acceptance rows. |
| D4 | Only `.opencode/plugins/session-relaunch.js` and `.opencode/plugins/tests/session-relaunch.test.cjs` change. A title that works only through a new `.opencode/plugins/lib/v2-bridge.js` method stops the phase for a scope question. |
| D5 | The title reads `SKILLED_LOOP_NAME`, because `consume` deletes the record before the receiver starts. Phase 012 may move the source, and this phase follows it. |
| D6 | Test first. Each must-fail test holds a recorded failing run before its source edit. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n '^Verdict: (yes|no)' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/scratch/trace-child-idle.md` prints 1 line.
- [ ] `rg -n '^Title verdict: (yes|no)' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/scratch/live-title.md` prints 1 line.
- [ ] `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title/acceptance-criteria.md` prints 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title --strict` prints `RESULT: PASSED`.
- [ ] `git diff --name-only -- .opencode .skilled` lists only `.opencode/plugins/session-relaunch.js` and `.opencode/plugins/tests/session-relaunch.test.cjs`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning | Done | 2026-11-13: spec, plan, tasks, criteria and goal written from `../research/research.md` section 9 ranks 7 and 10. Baseline `node --test .opencode/plugins/tests/session-relaunch.test.cjs` printed pass 65, fail 0, exit 0 |
| Child gate decision | Pending | Waits on the T001 trace |
| Title decision | Pending | Waits on the T002 call |

### Deviations and findings

| Item | Note |
|------|------|
| The record is gone at seed time | `consume` unlinks the record under its lock before the receiver starts (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:735` to `:739`), so the research's "the record's name" cannot be read by the plugin. The plan reads `SKILLED_LOOP_NAME`, which the wrapper exports (`.skilled/bin/skilled-loop:778`, `:785`) |
| The plugin client on OpenCode 2 has no `update` | `dualPlugin` hands the server a v1 client with only `messages`, `promptAsync`, `create`, `prompt` and `delete` (`.opencode/plugins/lib/v2-bridge.js:218` to `:279`). The installed v2 SDK has `session.update` with a `title` body key (`.opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/sdk.gen.js:2091`, `:2098`). Open question: if T002 shows the title works but `Client update: undefined`, may this phase add an `update` method to `.opencode/plugins/lib/v2-bridge.js`? |
| A deferred arm needs a second trigger | Returning early at the parent idle alone would leave the hop unarmed until the parent's next idle, which may never come. The plan adds the arm at the last child idle |
| Child detection on OpenCode 2 is unproven | The bridge wraps a v2 `session.*` event without `info` as `info: { id }` (`.opencode/plugins/lib/v2-bridge.js:421`, `:439`), so a child is recognised only if OpenCode puts `parentID` in the event data. T001 records it |
<!-- /ANCHOR:log -->
