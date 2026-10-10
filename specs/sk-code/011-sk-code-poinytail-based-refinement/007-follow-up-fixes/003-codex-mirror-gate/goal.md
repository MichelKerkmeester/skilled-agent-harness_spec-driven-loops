---
title: "Goal: Phase 3: codex-mirror-gate"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate"
    last_updated_at: "2026-10-10T05:36:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-003-codex-mirror-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: codex-mirror-gate

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the agent-mirror gate check Codex agent mirrors in its checker and in both pre-commit hooks, so a commit that changes a `.codex/agents/<name>.toml` file is compared with its canonical agent body and an orphaned Codex mirror blocks the commit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The change adds `codex` to the checker's agent path pattern, to the staged-path filter of both pre-commit hooks, and to the checker's orphan check. The shared library, its runtime list and the Codex content comparison do not change. |
| D2 | The orphan check gets one explicit `.codex/agents/<name>.toml` entry beside the Claude entry. It does not derive the list from `RUNTIME_MIRRORS`. |
| D3 | `.pi/agents/`, `.cursor/agents/`, `.devin/agents/` and `.hermes/agents/` stay outside the gate. Plan.md records the gap, and a separate decision brings them in. |
| D4 | The regression cases go into the existing `check-agent-mirror-sync.vitest.ts` and are written before the checker edit, so their first run shows them failing. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs .codex/agents/code.toml; echo "exit=$?"` prints a line containing `1 agent(s) checked`, then `exit=0`. Covers REQ-001.
- [ ] `(cd .skilled/skills/system-deep-loop/deep-improvement/scripts && ../../../system-spec-kit/node_modules/.bin/vitest run shared/tests/check-agent-mirror-sync.vitest.ts); echo "exit=$?"` prints `Tests  6 passed (6)`, then `exit=0`. The six cases include the three Codex cases, one of which proves that a Codex mirror with no canonical blocks. Covers REQ-002 and REQ-006.
- [ ] `grep -n 'claude|codex)/agents' .skilled/hooks/git/pre-commit .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"` prints two lines, one at line 87 and one at line 170, then `exit=0`. Covers REQ-003.
- [ ] `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all; echo "exit=$?"` prints `12 agent(s) checked`, then `exit=0`. Covers REQ-004.
- [ ] `bash -n .skilled/hooks/git/pre-commit && bash -n .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"` prints only `exit=0`. Covers REQ-005.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate --strict` prints `RESULT: PASSED`.
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
| Codex path names one agent (criterion 1, REQ-001) | Done | `1 agent(s) checked — all mirrors in sync — OK`, exit 0 (orchestrator rerun) |
| Vitest file passes six cases, orphan case included (criterion 2, REQ-002, REQ-006) | Done | `Tests  6 passed (6)`, exit 0; 3 of 6 failed before the checker edit |
| Both hooks carry the Codex alternative (criterion 3, REQ-003) | Done | matches at lines 87 and 170 |
| `--all` still prints 12 agents (criterion 4, REQ-004) | Done | `12 agent(s) checked`, exit 0 |
| Both hooks parse with `bash -n` (criterion 5, REQ-005) | Done | exit 0 |
| Validate prints `RESULT: PASSED` (criterion 6) | Done | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| The global hook path runs the main checkout's copy of the second hook | Found at planning. `core.hooksPath` links `pre-commit` to `Public/.skilled/scripts/git-hooks/pre-commit` in the main checkout, which still has the old filter. Commits made in this worktree keep the old filter until the change reaches that checkout. Not fixed in this phase. |
| `.pi/agents/` has the same gap | Found at planning and measured with the checker. Recorded in plan.md, not fixed (D3). |
<!-- /ANCHOR:log -->
