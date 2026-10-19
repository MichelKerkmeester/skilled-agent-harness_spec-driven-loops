---
title: "Goal: Phase 1: claude-relaunch-loop"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claude relaunch loop goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/001-claude-relaunch-loop"
    last_updated_at: "2026-10-16T20:16:20Z"
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
# Goal: Phase 1: claude-relaunch-loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude Code session started through `skilled-loop` writes a handoff note at 80% of its context window, ends itself and continues in a fresh session in the same terminal, with auto-compaction left untouched as the fallback.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The trigger fires at 0.80 of the effective window, resolved from `SESSION_RELAUNCH_WINDOW_TOKENS`, then `autoCompactWindow`, then the model default. `autoCompactEnabled` and `autoCompactWindow` never change. |
| D2 | The handoff note is a standalone file under `.skilled/skills/.state/session-relaunch/handoffs/`, linked to a spec packet through its `spec_folder` field when one is bound. |
| D3 | Code uses Node built-ins only with no build step, follows sk-code-opencode, and every test is seen failing before its implementation exists. |
| D4 | The killer signals only a process descended from the `SKILLED_LOOP_ID` wrapper, and the wrapper never passes a resume or continue flag. |
| D5 | Luna (cli-codex gpt-6-luna, max, fast) builds, SWE (cli-devin swe-2-max) reviews each Luna diff, and the orchestrator reruns every check before accepting a lane. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` ends with `fail 0`, and the run ledger records a red run of the same suite before implementation began
- [x] `sync-hook-registrations.cjs --check` exits 0 and `hook-registration-sync.vitest.ts` passes
- [x] `run-all-drift-guards.sh` exits 0 and `shellcheck .skilled/bin/skilled-loop` exits 0
- [x] A live tmux run of `SESSION_RELAUNCH_THRESHOLD=0.05 skilled-loop` shows the handoff note move from open to claimed to done and one relaunch line in `relaunch.log`
- [x] The concern README, the feature-catalog entry and `session-relaunch-claude.md` each pass `validate_document.py`
- [x] `validate.sh` on this phase prints `RESULT: PASSED` and all 10 rows in its `acceptance-criteria.md` are Met
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
| Goal authored | Done | Orchestrator, 2026-10-16 |
| Live relaunch test: handoff note written, continuity saved | Done | handoff 20261017T045139Z-3fc977dc.md (row written by the live session's /speckit:save) |
| Phase 001 closed | Done | All six criteria checked; 102 tests pass; strict validation PASSED; run-ledger.md, Phase 001 closure |

### Deviations and findings

| Item | Note |
|------|------|
| Deviations | Recorded in implementation-summary.md and run-ledger.md: S1 answers kept in the ledger first, three generator runs and a pinned-count bump by the orchestrator, a one-token playbook fix, and the lane 1.4 brief that skipped the deep path |
<!-- /ANCHOR:log -->
