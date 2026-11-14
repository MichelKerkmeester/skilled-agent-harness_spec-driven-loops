---
title: "Goal: Phase 13: conformance-stamp-pin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "conformance stamp pin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin"
    last_updated_at: "2026-11-14T09:20:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built and verified the per-runtime stamp pin, all criteria met"
    next_safe_action: "The orchestrator commits the test file and runs T014 against the fix commit"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-conformance-stamp-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the conformance suite fail when either side of the stamp split changes? Yes, three saved red runs show one case failing each."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: conformance-stamp-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The shared conformance case for a Stop that cannot arm states for each runtime whether the record is stamped, so the suite fails when Claude stops stamping or when Codex starts.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | One test file changes: `tests/adapter-conformance.test.cjs`. No adapter, no core file and no other test changes, per parent D2. |
| D2 | The adapter table says which runtime stamps, and the helper reads it. The helper holds no runtime name. |
| D3 | A change to an assertion cannot fail first as a new test does. Parent D1 is met by three working-tree mutations that each turn a case red and are reverted before the commit. |
| D4 | The case states that Codex does not stamp. Making Codex stamp belongs to a later packet, which then changes one mark in the table on purpose. |
| D5 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `scratch/hole.txt` shows the no-target case passing under the old helper with the `markParked` call at `claude/stop-arm.mjs:183` removed.
- [x] `scratch/red-claude.txt` prints `✖ claude: an arm leaves the record pending when no process below the loop is found`, `scratch/red-codex.txt` prints the same line for `codex`, and `scratch/red-unmarked.txt`, saved with the mark taken off the Claude entry of the adapter table, prints the `claude` line again.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no process below the loop' .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`.
- [x] `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude .skilled/hooks/session-relaunch/codex .skilled/hooks/session-relaunch/lib` exits 0 before the commit.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the test count saved in `scratch/baseline.txt`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin --strict` prints `RESULT: PASSED`.
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
| Review finding | Done | 2026-11-14. Review A, P2: the shared no-target case no longer pins either behavior, because `assertStillPending` strips `deferredAt` for every runtime |
| Code read | Done | 2026-11-14 at `be1aebb9f3`: the helper at `adapter-conformance.test.cjs:412` to `:418`, its one use at `:465`, and `markDeferred` found under `claude/` only. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` was written with the build |
| Build | Done | 2026-11-14: T001 to T016 complete. T001 records the known baseline and T002 to T016 ran. `scratch/hole.txt` shows the old helper blind to the removed stamp, `scratch/red-claude.txt`, `scratch/red-codex.txt` and `scratch/red-unmarked.txt` each fail one case, `scratch/green.txt` passes both, and `scratch/suite.txt` prints tests 1550, pass 1550, fail 0, exit 0. Only `adapter-conformance.test.cjs` changed |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Hole not run | That the suite stays green without the Claude stamp follows from line 415 and was not run by the planner. T003 ran it and `scratch/hole.txt` prints both cases passing with fail 0 |
| Runtimes that run the case | Read as Claude and Codex, because the case is skipped for a runtime whose killer target is its own process (`adapter-conformance.test.cjs:485`). T002 printed those two names |
| Later packet | Review A recommends moving the stamp into the core arm path so Codex gets it. Parent D2 bars the Codex adapter, so it is recorded in the parent log as a later packet |
| Third mutation | 2026-11-14: a verifier found that both planned mutations reach one branch, a stamp expected and none found. A third mutation, the mark taken off the Claude entry of the table, now proves the other branch, where a runtime that should not stamp does. It was added to REQ-002, AC-003, criterion 2 and decision D3, and as task T016. T016 ran and `scratch/red-unmarked.txt` exits 1 with the Claude case red |
| Red before the edit | An assertion change cannot fail before it is written, so `scratch/red.txt` holds the first failing run of the changed case, taken with the Claude stamp removed. `scratch/hole.txt` shows the old helper passing under the same removal, which is the hole this phase closes |
<!-- /ANCHOR:log -->
