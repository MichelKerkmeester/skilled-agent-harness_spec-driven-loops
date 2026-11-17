---
title: "Goal: Forward the Claude config dir on single-executor research cli-claude-code dispatch"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "research claude config dir goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/002-research-claude-config-dir"
    last_updated_at: "2026-11-17T17:15:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-child-authoring-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Forward the Claude config dir on single-executor research cli-claude-code dispatch

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A single-executor deep-research run on `cli-claude-code` runs under the configured Claude config dir, and a run with no configured dir behaves as it does today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The config-dir flag is optional on research and stays required on review. |
| D2 | Fan-out dispatch is not changed; it already routes the config dir (research §13 D2). |
| D3 | No other slice is a prerequisite. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts` exits 0 with the new research config-dir cases.
- [x] The new research config-dir case in `dispatch-iteration.vitest.ts` fails against the pre-change `dispatch-iteration.cjs`.
- [x] `grep -n "claude-config-dir" .skilled/commands/deep/assets/deep-research.yaml` prints the `if_cli_claude_code` command line.
- [x] `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` exits 0.
- [ ] The `runtime/manual-testing-playbook` index lists a research config-dir scenario written by `/create:manual-testing-playbook`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase spec authored | Done | `spec.md`, `plan.md`, `tasks.md` written 2026-11-17; implementation not started |
| Baseline (T001) | Done | 2026-11-17 on integration tip `c898b3ad9a3`: the three suites 3 files, 23 passed. Full suite: the integration gate on that tip (3136 passed, 9 skipped, 1 load-sensitive `fanout-pool` failure that passes alone) |
| Implementation | Done | 2026-11-17, branch `worktrees/465-ed-002-research-claude-config-dir`: commits `510e0906284` (script and tests) and the YAML/contract commit. Three suites 27 passed + 2 skipped in-session, all 10 dispatch cases pass detached; criteria 1-4 checked. Criterion 5 (playbook) waits for @markdown in integration |

### Deviations and findings

| Item | Note |
|------|------|
| Inherited `CLAUDE_CONFIG_DIR` with no configured dir | Open question: should research strip it? Not in scope, because stripping it changes every default research run. |
| Plan review amendments 2026-11-17 | Applied the Fable 5.2 plan review: the test homes moved from the stress, `cli-matrix` and `combo-matrix` suites, which never run `dispatch-iteration.cjs`, to `dispatch-iteration.vitest.ts` and `executor-audit-cli-branch-receipts.test.ts`; a review required-flag reference case is added first; the test command runs from `runtime/`; the research contract is regenerated; the playbook scenario goes through `/create:manual-testing-playbook`. |
| Claude ancestry and the shim cases | The recursion guard refuses a nested cli-claude-code dispatch whenever `claude` is in the process ancestry, so the two recorder-shim cases skip under a Claude Code session (`it.skipIf(underClaudeAncestry)`) and pass in a run detached from that tree. Criterion 1's suite exits 0 either way. |
| Missing-dir wording | `validateClaudeConfigDir` checks the location (`~/.claude*` or a repo-local `.claude*`), not existence, for both loops. The REQ-005 case therefore uses a dir outside those roots; research now refuses exactly what review refuses. |
<!-- /ANCHOR:log -->
