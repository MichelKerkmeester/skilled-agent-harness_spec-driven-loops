---
title: "Goal: Phase 6: deep-review-2-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep review 2 remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation"
    last_updated_at: "2026-10-18T19:42:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Dispatch WS-A, the core library, with its named tests first"
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
# Goal: Phase 6: deep-review-2-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every confirmed finding of the round-2 deep review of the session relaunch loop is fixed and tested, and the fixed loop passes a fresh review and the four live runtime playbooks.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every code fix starts with a named test that fails on the code before the fix. |
| D2 | Repo-root resolution has one shared resolver, and the override is `SESSION_RELAUNCH_REPO_ROOT`. The generic `REPO_ROOT` is no longer read. |
| D3 | R1-P2-003 stays disproved, and the three duplicates fold into their primaries. Changing that set is an amendment. |
| D4 | Operator direction of 2026-10-19: "We fix all gaps". Every gap a live playbook run finds in the hook is fixed with a test, and the phase closes on a frozen-code round where all four runtimes finish with zero operator input. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Each of the twelve active findings has a named test that failed before its fix and passes after, with `node --test` on the changed files ending `# fail 0`. Red mirror: 407 tests, 136 fail against HEAD `b830fd0276`; final: 448 tests, `fail 0`
- [x] `rg -n "REPO_ROOT" .skilled/hooks/session-relaunch .skilled/bin` shows only the shared resolver (`resolveRepoRoot` in `lib/nudge.cjs:203`) and unrelated repo scripts, and the CLI, `nudge.cjs` and the Pi adapter all call it
- [x] A fresh review of the changed code confirms no open finding among the twelve. rv3: 0 P0, 0 P1, 7 new P2, all fixed
- [x] The full gate is at or above the phase 005 closure counts (node 448 vs 375, pytest 62, Pi vitest 27 vs 21, registration 7, tsc 0, shellcheck 0, drift 4/4)
- [x] Live playbooks pass for Pi, OpenCode, Claude and Codex from the final state, with their output named in `implementation-summary.md`. Round 9: loops 78793, 78816, 78834, 78800, zero operator prompts
- [x] Every live-playbook gap is fixed with a test and re-run (REQ-007, G1 to G25 in `spec.md` section 4.1)
- [x] `repair-derived.cjs --folder <006> --apply` exits 0 and `validate.sh <006> --strict` prints `RESULT: PASSED`
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
| Five docs authored (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`) | Done | This folder; authored from `review/review-report.md` and the verification table |
| WS-A core library | Done | `tasks.md` T006 to T011 |
| WS-B killer | Done | `tasks.md` T012 to T019 |
| WS-C CLI | Done | `tasks.md` T020 to T024 |
| WS-D repo root | Done | `tasks.md` T025 to T028 |
| WS-E docs | Done | `tasks.md` T029 to T032 |
| WS-F verification and closure | Done | `tasks.md` T033 to T042 |
| WS-G live gaps (REQ-007) | Done | `tasks.md` T043 to T054; `spec.md` section 4.1 |

### Deviations and findings

| Item | Note |
|------|------|
| Parent `spec.md` edit | A parallel worker landed the six-children count, the phase 005 and 006 scope bullets and the files rows; this phase closed the phase-map row and replaced the 006 files row with the real paths |
| The builder lane is cli-pi with DeepSeek V4.1 Flash max | Dispatch is the orchestrator's; the markdown agent does not dispatch builders |
| The D1 and D2 lane logs were overwritten | Later lanes of the same name replaced them, so the red mirror run is the red evidence of record |
| G20 and G21 are framework gates, not hook defects | Recorded as known limitations in `implementation-summary.md`, not as met work |
| The OpenCode default model fails provider routing | The live runs select `openai/gpt-6-luna` explicitly; recorded as a limitation |
<!-- /ANCHOR:log -->
