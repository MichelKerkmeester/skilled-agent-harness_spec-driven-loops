---
title: "Goal: Remediate the eight findings of the in-session handover review of the session relaunch loop"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation"
    last_updated_at: "2026-11-12T14:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Fixed the four second-review findings and reran the gate"
    next_safe_action: "Merge worktree 351 once the operator decides"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Remediate the eight findings of the in-session handover review of the session relaunch loop

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The session relaunch loop runs only a wrapper it can trust, reads only a state directory it has checked, keeps a session's launch flags across a hop, measures Claude's fill against a known window, denies every lifecycle command to a sub-agent, reclaims a stale lock once and starts without a leftover record.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One child phase per review finding, in the order of the phase map. Findings 4 and 8 share phase 004. Each code change lands with a test that failed before it |
| D2 | Phases 001 to 005 start together. Phase 006 waits for 002 and phase 007 waits for 003, because each pair edits one file |
| D3 | No phase changes the relaunch record format or adds a module |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-shim-wrapper-trust | `001-shim-wrapper-trust/goal.md` |
| 002-state-dir-read-check | `002-state-dir-read-check/goal.md` |
| 003-launch-flag-replay | `003-launch-flag-replay/goal.md` |
| 004-claude-window-unknown | `004-claude-window-unknown/goal.md` |
| 005-subagent-guard-cancel-consume | `005-subagent-guard-cancel-consume/goal.md` |
| 006-append-lock-stale-reclaim | `006-append-lock-stale-reclaim/goal.md` |
| 007-loop-start-record-cleanup | `007-loop-start-record-cleanup/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation --recursive --strict` prints `RESULT: PASSED` for the parent and each of the seven children
- [x] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/*/acceptance-criteria.md` prints no line
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0
- [x] `node --test .opencode/plugins/tests/session-relaunch.test.cjs` exits 0
- [x] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0
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
| Phase parent and seven children scaffolded | Done | `create.sh --phase --path ... --phase-names ... --with-goal --level 2` exit 0 on 2026-11-12 |
| Baseline before the phases | Done | 2026-11-12 review: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` 813 of 813, the OpenCode plugin suite 65 of 65 and the Pi vitest suite 59 of 59, each exit 0 |
| Operator decision: DeepSeek route | Done | 2026-11-12, asked how DeepSeek V4.1 Flash should author the phase documents after the cli-opencode self-invocation guard matched OPENCODE_API_KEY: answered OpenCode anyway. Dispatches ran as llmgateway/deepseek-v4.1-flash-1017 at max through OpenCode 2.2.5 |
| Operator decision: workspace | Done | 2026-11-12, asked where the planning packet is written: answered New git worktree. Created worktrees/351-session-relaunch-review-remediation with worktree-naming.sh create, then provisioned it |
| Phase 001-shim-wrapper-trust | Done | 2026-11-12: strict validation PASSED 0 errors 0 warnings, 8 of 8 criteria Met, shim file 30 of 30 and the relaunch suite 827 of 827. Luna built in three passes, SWE reviewed through Devin, the orchestrator reran every command |
| Phase 002-state-dir-read-check | Done | 2026-11-12: strict validation PASSED, 4 of 4 criteria Met, relaunch suite 831 of 831, OpenCode plugin 65 of 65, Pi 59 of 59. Luna built in two passes, SWE reviewed through Devin with PASS |
| Phase 003-launch-flag-replay | Done | 2026-11-12: strict validation PASSED, 7 of 7 criteria Met, wrapper tests 181 of 181, relaunch suite 846 of 846, OpenCode plugin 65 of 65, Pi 59 of 59. Luna built in six passes, SWE reviewed through Devin |
| Phase 004-claude-window-unknown | Done | 2026-11-12: strict validation PASSED, 7 of 7 criteria Met, relaunch suite 852 of 852, OpenCode plugin 65 of 65, Pi 59 of 59. Luna built in two passes, SWE reviewed through Devin, the orchestrator wired the doctor files |
| Phase 005-subagent-guard-cancel-consume | Done | 2026-11-12: strict validation PASSED, 5 of 5 criteria Met, guard file 14 of 14, relaunch suite 855 of 855, OpenCode plugin 65 of 65, Pi 59 of 59. DeepSeek V4.1 Flash built in two passes through OpenCode Go at the operator's request, SWE reviewed through Devin with PASS |
| Phase 006-append-lock-stale-reclaim | Done | 2026-11-12: strict validation PASSED, 5 of 5 criteria Met, core file 148 of 148, relaunch suite 861 of 861, stress probe 0 overlaps with eight and sixteen waiters. The operator amended the design to a reclaim directory after the frozen rename design measured 127 to 176 overlaps per 60 rounds. DeepSeek V4.1 Flash built in three passes, SWE reviewed through Devin |
| Phase 007-loop-start-record-cleanup | Done | 2026-11-12: strict validation PASSED, 3 of 3 criteria Met, wrapper file 184 of 184, relaunch suite 862 of 862, OpenCode plugin 65 of 65, Pi 59 of 59. DeepSeek V4.1 Flash built in two passes, SWE reviewed through Devin with PASS and no finding |
| Operator decision: builder | Done | 2026-11-12, during phase 004 the operator wrote: Prefer deepseek v4.1 flash max opencode go as worker. Phases 005, 006 and 007 were built by `opencode-go/deepseek-v4.1-flash` at max through OpenCode 2.2.7. Phases 001 to 004 were built by Luna through `codex exec`. SWE through Devin reviewed every phase |
| Operator decision: lock design | Done | 2026-11-12, asked which stale-lock design phase 006 ships after the frozen rename design measured 127 to 176 overlaps per 60 rounds of eight waiters: answered Reclaim directory |
| Goal gate | Done | 2026-11-12, from the final working tree: `validate.sh --recursive --strict` printed `RESULT: PASSED` eight times and `RESULT: FAILED` never, the Unmet search printed no line, the relaunch suite ran 862 of 862, the OpenCode plugin suite 65 of 65 and the Pi suite 59 of 59, each exit 0. The three suite runs are in `scratch/final-relaunch.txt`, `scratch/final-opencode.txt` and `scratch/final-pi.txt` |
| Operator decision: commit | Done | 2026-11-12, asked through the question tool how the worktree is landed: answered Commit on worktree branch. The commits go through sk-git on `worktrees/351-session-relaunch-review-remediation`, with no merge and no push |
| Operator decision: second review | Done | 2026-11-12, asked whether the later correction passes of phases 004 to 007 get another review: answered Run one more SWE review |
| Operator decision: self-invocation guard | Done | 2026-11-12, asked whether the cli-opencode guard is fixed so `OPENCODE_API_KEY` alone does not trip it: answered Fix it now. It is a separate packet, `cli-external-orchestration/opencode-platform/004-self-invocation-guard-api-key`, in the same worktree |
| Operator decision: trigger index | Done | 2026-11-12, asked when the trigger index is rebuilt: answered Rebuild with the commit, as its own chore commit |
| Second review | Done | 2026-11-12, SWE through Devin, read-only, on the later passes of phases 004 to 007: PASS with four P2. The orchestrator confirmed each one, two by a probe against the unchanged checkout and one by removing the cleanup from the wrapper. DeepSeek V4.1 Flash fixed them in two passes, test first |
| Goal gate, repeated | Done | 2026-11-12, from the final working tree after the second review: the relaunch suite ran 865 of 865, the OpenCode plugin suite 65 of 65 and the Pi suite 59 of 59, each exit 0, and the three `scratch/final-*.txt` files hold these runs |

### Deviations and findings

| Item | Note |
|------|------|
| Phase qualification | `recommend-level.sh --recommend-phases --loc 700 --files 22` scored 10 of 50 and did not recommend phases. The operator asked for phases, and the layout follows `033-research-remediation` |
| Child level | `recommend-level.sh` printed Level 0 or 1 for each child. The children are Level 2, because the parent goal workflow needs each child's `acceptance-criteria.md` |
| D2, phase order | The phases ran one at a time, 001 to 007, and not five together. The cli skills allow one external dispatch at a time, and the builders share one worktree |
| Builder, against the parent packet's D5 | The parent packet names Luna as the builder. The operator's instruction of 2026-11-12 moved the builds of phases 005 to 007 to DeepSeek V4.1 Flash through OpenCode Go. The parent packet's goal was not changed |
| Scope added by reviews | Ten requirements were added to the children after reviews or the orchestrator's own reading: 001 REQ-007 and REQ-008, 002 REQ-004, 004 REQ-006 and REQ-007, 005 REQ-005, 006 REQ-005 and its design amendment, and the symlink case of 007. Each is recorded in its child |
| Suite environment | This session runs inside a relaunch loop, so every suite run removed the `SKILLED_LOOP_*` variables and `AI_SESSION_CHILD` with `env -u` first. With `AI_SESSION_CHILD=1` set, 28 adapter cases fail, which a probe confirmed on an unchanged case |
| Second review, no new requirement ids | The four findings of the second review were fixed without a new requirement or criterion row. Each is recorded in its child's implementation summary and goal log: 002 and 004 for the nudge state, 006 for `withStateLock`, 007 for the symlink case |
| Self-invocation guard | The guard fix is not part of this packet. It is `cli-external-orchestration/opencode-platform/004-self-invocation-guard-api-key`, committed apart |
<!-- /ANCHOR:log -->
