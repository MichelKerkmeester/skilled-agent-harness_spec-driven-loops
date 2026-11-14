---
title: "Goal: Phase 20: question-guard-killer-gone"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "question guard killer gone goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/020-question-guard-killer-gone"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the armable verdict fix"
    next_safe_action: "The builder implements the split tests and the condition"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/subagent-guard.mjs", ".skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-question-guard-killer-gone"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a killer spawn failure always leave the record armed? Both spawn-error tests say yes."
    answered_questions:
      - "Does the guard deny for both armable reasons? Yes, the review finding F1 asks for every armable verdict."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: question-guard-killer-gone

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude question dialog is refused while this session's hand-over can still be armed, whether the record is pending or armed with no live killer, and it is allowed once a live killer owns the loop's lock.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Deny for every armable verdict the core reports, which is `pending` and `killer-gone`. The whole-epic review of 2026-11-14 found the one-state condition. |
| D2 | Allow only when `armableRecord` refuses with `killer-live`. Every other refusal already allows. |
| D3 | Split the armed-record test in two, with no live killer denied and a live killer allowed. The lock is owned by `process.pid`, as the live-killer test writes it. |
| D4 | Add one throwing-read test as evidence for a phase 1 row that has only a source reading. That test cannot fail first, because the fail-open path does not change. Parent D1's failing-first rule is met by the killer-gone denial test. |
| D5 | The Claude adapter only, per parent D2. No module, record key or log event, per parent D3. |
| D6 | No live hop is run, and nothing is merged or pushed without the operator, per parent D4. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The red run saved in `scratch/red.txt` shows the killer-gone denial failing before the source edit, and `scratch/green.txt` shows it passing after.
- [ ] `scratch/control.txt` shows the live-killer control passing, and the run exits 0 with `fail 0`.
- [ ] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with `fail 0`, saved to `scratch/guard-suite.txt`.
- [ ] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and two more tests than `scratch/baseline.txt`.
- [ ] `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more, and `validate.sh 020-question-guard-killer-gone --strict` prints `RESULT: PASSED`.
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
| Review finding | Done | 2026-11-14, the whole-epic review finding F1, CONFIRMED against the tree at `fa6a56f0fc`: the guard denies only a `pending` verdict, and an armed record with no live killer reports `killer-gone` |
| Operator decision | Done | 2026-11-14: fix every P2 finding as new children from 020, one child per code fix with a test that fails first, and the document fixes in one shared child |
| Code read | Done | 2026-11-14 at `fa6a56f0fc`: the condition at `claude/subagent-guard.mjs:84`, both armable reasons at `lib/relaunch-core.cjs:1180` and `:1183`, the spawn-failure test at `tests/claude-adapters.test.cjs:1001` and the armed-record test at `tests/subagent-guard.test.cjs:313` |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written |
| Build | Pending | The builder runs T001 to T015 and records the runs under `scratch/` |
| Fix commit | Pending | Recorded after the build |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| The evidence test cannot fail first | The throwing-read path already fails open. The test proves 001 AC-005, which had a source reading only, and it is marked as such in D4. The failing-first test for this phase's code change is the killer-gone denial. |
| Why the armed-no-killer state matters | A killer spawn failure leaves the record armed. The next Stop re-arms it, so a dialog opened in between waits for a turn end that no Stop reaches. |
<!-- /ANCHOR:log -->
