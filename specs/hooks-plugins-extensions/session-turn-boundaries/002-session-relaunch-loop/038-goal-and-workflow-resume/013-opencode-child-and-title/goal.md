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
| D4 | `.opencode/plugins/session-relaunch.js` and `.opencode/plugins/tests/session-relaunch.test.cjs` change. Amended by the operator on 2026-11-13: `.opencode/plugins/lib/v2-bridge.js` gains one `session.update` method on its client, with a test in `.opencode/plugins/tests/v2-bridge.test.cjs`, and nothing else in the bridge changes. |
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
- [ ] `git diff --name-only -- .opencode` lists only `.opencode/plugins/session-relaunch.js`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `.opencode/plugins/lib/v2-bridge.js` and `.opencode/plugins/tests/v2-bridge.test.cjs`.
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
| Child gate decision | Build | 2026-11-13, live on OpenCode 2.2.7: the parent's bridged `session.idle` arrived at 10:02:06 while the child's `sleep 90` shell ran until 10:03:24 (`scratch/trace-child-idle.jsonl` lines 167 and 169, `Verdict: yes`). The child's `session.created` carries the parent id at `properties.parentID`, not at `properties.info.parentID` (lines 80 and 81, `Child parentID: yes`) |
| Title decision | Build | 2026-11-13, live on OpenCode 2.2.7: `PATCH /api/session/{id}` returned 204 and the read-back showed the new title (`scratch/live-title.md`, `Title verdict: yes`). The bridged client has no `update` (`Client update: undefined`, trace line 2), while the native `ctx.session.update` is a function (trace line 1). The title needs one bridge method. The operator answered "Amend scope (Recommended)" on 2026-11-13: one `session.update` method on the bridge's client with a test in the bridge suite |
| T001, T002 and T004 live checks | Done | 2026-11-13: run by an Opus sub-agent through `opencode serve` and HTTP in a `git clone --shared` copy, since a builder may not start an OpenCode session. The orchestrator opened every cited trace line, and confirmed the copy is deleted and server pid 88042 is gone |
| T017 bridged title call | Done | 2026-11-13, live on OpenCode 2.2.7 at commit 195f1d764c: with `SKILLED_LOOP_NAME` set on the server, a claim seed stored with no model turn renamed the session 93 ms later. The native call takes `{ sessionID, title }` as built (`scratch/live-title-bridge.md`, `Bridge title verdict: yes`) |
| T005 suite baseline | Done | 2026-11-13: `node --test .opencode/plugins/tests/session-relaunch.test.cjs` printed `pass 65`, `fail 0`, exit 0 before any test edit |
| Operator green light | Done | 2026-11-13: the operator gave the green light to build this phase, with both the child gate and the title decisions recorded as Build |
| T006 to T011 built test first | Done | 2026-11-13: five must-fail test entries in `scratch/red.txt` (T006, T007 twice, T015, T009) hold their failing runs before the edits, and `scratch/green.txt` holds the passing runs; `node --test .opencode/plugins/tests/session-relaunch.test.cjs` prints 71 pass, 0 fail |
| T012 and T013 | Done with an ambient caveat | 2026-11-13: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .opencode/plugins/tests/*.test.cjs` prints 593 pass, 0 fail, and `node --check .opencode/plugins/session-relaunch.js` exits 0. The host's `OPENCODE_DB=opencode-v1.db` leaks into `session-history-lookup.test.cjs`, so the literal command without that removal fails that one unrelated test |
| T017 live bridge title | Blocked | Needs a live OpenCode 2.2.7 claim seed, which a builder may not start. `scratch/live-title-bridge.md` is not written and AC-008 stays Unmet |

### Deviations and findings

| Item | Note |
|------|------|
| The record is gone at seed time | `consume` unlinks the record under its lock before the receiver starts (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:735` to `:739`), so the research's "the record's name" cannot be read by the plugin. The plan reads `SKILLED_LOOP_NAME`, which the wrapper exports (`.skilled/bin/skilled-loop:778`, `:785`) |
| The plugin client on OpenCode 2 has no `update` | `dualPlugin` hands the server a v1 client with only `messages`, `promptAsync`, `create`, `prompt` and `delete` (`.opencode/plugins/lib/v2-bridge.js:218` to `:279`). The installed v2 SDK has `session.update` with a `title` body key (`.opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/sdk.gen.js:2091`, `:2098`). Open question: if T002 shows the title works but `Client update: undefined`, may this phase add an `update` method to `.opencode/plugins/lib/v2-bridge.js`? |
| A deferred arm needs a second trigger | Returning early at the parent idle alone would leave the hop unarmed until the parent's next idle, which may never come. The plan adds the arm at the last child idle |
| Child detection on OpenCode 2 is unproven | The bridge wraps a v2 `session.*` event without `info` as `info: { id }` (`.opencode/plugins/lib/v2-bridge.js:421`, `:439`), so a child is recognised only if OpenCode puts `parentID` in the event data. T001 records it |
| The plugin misses a 2.2.7 child today | `.opencode/plugins/session-relaunch.js` reads the parent id at `properties.info.parentID` only. OpenCode 2.2.7 sends it at the top level of the event data and the bridge builds `info: { id }`, so the sub-agent of the trace was not recognised as a child. The child gate has to read `properties.parentID` as well |
| No `session.updated` or `session.status` on 2.2.7 | Neither event appeared in the plugin stream or in a parallel `GET /api/event` capture. A child's busy state shows as `session.execution.started` and its end as `session.execution.succeeded`, which the bridge also delivers as `session.idle`. T006 to T008 use those events, not a status event |
| Routes in T001 and T002 | On 2.2.7 the API lives under `/api/session/...` with HTTP Basic auth. `POST /experimental/session/{id}/background` returned 405 and `PATCH /session/{id}` returned 405. The calls that worked were `POST /api/session/{id}/background` and `PATCH /api/session/{id}`, both 204 |
| Model id for the trace | `llmgateway-providers/alibaba/deepseek-v4.1-flash-1017` failed with 403 on a coding plan. The trace ran on `llmgateway/deepseek-v4.1-flash-1017`, the same model under its gateway id |
| A child busy event the inventory cannot see | T008 names `session.execution.started` as the busy signal, but `.opencode/plugins/tests/plugin-inventory.json` does not list that event and the manifest is outside this phase's write paths. A literal comparison fails `plugin-inventory.test.cjs` ("handles session.execution.started"). The plugin therefore treats a tracked child as busy from its creation and clears that state on `session.idle` or `session.deleted`; the T006 and T007 tests pass unchanged |
| The full plugin suite inherits `OPENCODE_DB` | This OpenCode host exports `OPENCODE_DB=opencode-v1.db`. `session-history-lookup.test.cjs` writes `opencode.db` and passes `process.env` through, so the history CLI reads `opencode-v1.db`, finds no store and answers `store_unreadable`. The failure is outside this phase and disappears with `env -u OPENCODE_DB`; the suite then prints 593 pass, 0 fail |
| The `.skilled` diff holds another builder's work | `git diff --name-only -- .opencode .skilled` lists this phase's four files under `.opencode` plus the concurrent `.skilled/hooks/session-relaunch` and `.skilled/bin/skilled-loop` work of another builder. The scoped `.opencode` diff is exactly the four planned files |
| Node 26 prints the spec reporter | The red and green evidence uses Node 26's default spec reporter, so `^not ok` and `^# fail 0` never appear. The same runs print `✖` and `ℹ fail 0`; `scratch/red.txt` holds five failing test entries and `scratch/green.txt` holds six `ℹ fail 0` runs |
| The goal completion list predated the bridge amendment | Section 3 named only the plugin and its test, while D4 and the spec's Files to Change include the bridge and its test. The criteria now name all four files and scope the diff to `.opencode`, since the concurrent builder owns `.skilled` |
| CHK-001 count | It expected 7 REQ rows; the operator's amendment added REQ-008, so `spec.md` holds 8 and the check now says 8 |
<!-- /ANCHOR:log -->
