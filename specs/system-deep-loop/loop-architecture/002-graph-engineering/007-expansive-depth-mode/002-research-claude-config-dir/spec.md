---
title: "Feature Specification: Forward the Claude config dir on single-executor research cli-claude-code dispatch"
description: "A single-executor deep-research run on cli-claude-code drops a configured config dir and rejects an explicit --claude-config-dir, so the iteration runs under whatever CLAUDE_CONFIG_DIR the parent shell had. This phase forwards the configured dir on research the way review already does."
trigger_phrases:
  - "research claude config dir"
  - "forward the claude config dir on single executor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Forward the Claude config dir on single-executor research cli-claude-code dispatch

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None (independent slice, depends on: none) |
| **Successor** | None (independent slice) |
| **Source** | `../research/research.md` §13 D2, §20 Slice B |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A single-executor deep-research run on `cli-claude-code` silently drops a configured `config.executor.configDir`, and an explicit `--claude-config-dir` makes `dispatch-iteration.cjs` raise a UsageError, because the flag is accepted only for `--loop-type review`. The iteration then runs under whatever `CLAUDE_CONFIG_DIR` the parent shell happened to export, so an operator who routes research to a specific Claude account gets the wrong account with no warning. Fan-out runs are not affected.

### Purpose
A research iteration on `cli-claude-code` runs under the configured Claude config dir when one is set, and behaves exactly as today when none is set.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ grep -n "claude-config-dir" .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml | cut -c1-140
.skilled/commands/deep/assets/deep-review.yaml:1519:            node .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs
$ grep -n "claudeReview" .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs
213:  const claudeReview = values.executor === 'cli-claude-code' && values.loopType === 'review';
214:  if (claudeReview && !hasFlag(values, 'claudeConfigDir')) {
217:  if (!claudeReview && hasFlag(values, 'claudeConfigDir')) {
```
The research YAML has no `--claude-config-dir` hit, the review YAML has one at line 1519, and line 217 rejects the flag for every non-review loop.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Accept `--claude-config-dir` as an optional flag for `--executor cli-claude-code --loop-type research` in `validateFlags`, keeping it required for review and rejected for every other executor.
- Validate the dir and bind it as `CLAUDE_CONFIG_DIR` in `runClaude` for research when the flag is given, the same path review takes today.
- Pass `--claude-config-dir "{optional_claude_config_dir}"` from the research YAML `if_cli_claude_code` branch, with the same render hint review uses, and omit the flag when the rendered value is empty.
- Confirm the executor audit row records the configured dir for research, and change `executor-audit.ts` only if it does not.
- Regenerate the research compiled command contract after the YAML edit, and write the user-visible behavior as a manual testing playbook scenario through `/create:manual-testing-playbook`.

### Out of Scope
- Fan-out dispatch (`fanout-run.cjs:3962`, `:3995`) - research §13 D2 records that fan-out already routes the config dir.
- Clearing an inherited `CLAUDE_CONFIG_DIR` when no dir is configured - that would change every default research run; it is an open question in `goal.md`, not part of this phase.
- Making the flag required on research - it would break every default research run that sets no config dir.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` | Modify | `validateFlags` (lines 213-220) allows the optional flag on research; `runClaude` (line 355) validates it for research; the research executor object (line 407) carries `configDir` and the research branch binds `CLAUDE_CONFIG_DIR` in the guarded env, as the review branch does at lines 364 and 388-390 |
| `.skilled/commands/deep/assets/deep-research.yaml` | Modify | `if_cli_claude_code` command (line 1442) forwards the configured dir with a render hint |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Read, modify only if needed | line 1119 already reads `executor.configDir`, so setting it on the research executor object should be enough |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate | `compile-command-contracts.cjs --command deep/research --write`, because the contract digests the research YAML |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/dispatch-iteration.vitest.ts` | Modify | the flag cases (lines 45-93 hold the existing refusal cases): the missing review required-flag reference case, research accepted, empty value, missing dir, `cli-codex` rejected, and the child-env case through a recorder `claude` shim on `PATH` |
| `.skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modify | research twin of the claude-code branch receipt case (lines 164-224): the audit row carries the configured dir |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Read, rerun | pins the `if_cli_claude_code` branch in both YAMLs (line 20); must stay green after the YAML edit |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/executor/` | Modify through `/create:manual-testing-playbook` | one scenario: research on `cli-claude-code` runs under the configured Claude config dir |

`tests/stress/cli-adapter/cli-claude-code.vitest.ts`, `tests/unit/cli-matrix.vitest.ts` and `tests/unit/combo-matrix.vitest.ts` are not test homes for this change: the stress suite drives `fanout-run.cjs`, `cli-matrix` tests a local `buildDispatchCommand`, and `combo-matrix` is a `fanout-run.cjs` matrix. None of them runs `dispatch-iteration.cjs`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `dispatch-iteration.cjs --executor cli-claude-code --loop-type research --claude-config-dir <dir>` no longer raises a UsageError. | A new case in `dispatch-iteration.vitest.ts` passes the flag on research and asserts the exit is not 64 and stderr has no usage error; the case fails on the current code with "flag '--claude-config-dir' is only valid with --executor cli-claude-code --loop-type review". |
| REQ-002 | A research dispatch given `--claude-config-dir <dir>` runs the Claude child with `CLAUDE_CONFIG_DIR=<dir>`, overriding an inherited `CLAUDE_CONFIG_DIR`. | A `dispatch-iteration.vitest.ts` case puts a recorder `claude` shim first on `PATH` (the recorder pattern of `executor-audit-cli-branch-receipts.test.ts:44`), spawns the script with a clean env carrying a different inherited `CLAUDE_CONFIG_DIR`, and asserts the shim saw `<dir>`. The receipts suite drives the audit wrapper directly and never runs `runClaude`, so it cannot prove this. |
| REQ-003 | A research dispatch with no `--claude-config-dir` behaves exactly as today. | The existing cases in `dispatch-iteration.vitest.ts`, `executor-audit-cli-branch-receipts.test.ts` and `executor-branch-contract.vitest.ts` pass unchanged, and the full runtime suite shows no new failure against the baseline. |
| REQ-004 | The research YAML forwards `config.executor.configDir` on the `cli-claude-code` branch and passes no flag when it is unset. | `grep -n "claude-config-dir" .skilled/commands/deep/assets/deep-research.yaml` prints the `if_cli_claude_code` command line, and the render hint states that an unset dir expands to no flag. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A research `--claude-config-dir` pointing at a missing dir fails before any prompt file is read, as review does. | A `dispatch-iteration.vitest.ts` case passes a nonexistent dir on research and asserts the `validateClaudeConfigDir` error with no prompt read. |
| REQ-006 | Review keeps its current contract: the flag stays required for review, and any executor other than `cli-claude-code` still rejects it. | No test pins the review required flag today, so a reference case asserting "missing required flag '--claude-config-dir'" for review is added to `dispatch-iteration.vitest.ts` first and passes before and after the change; a new case asserts `--executor cli-codex --loop-type research --claude-config-dir <dir>` still raises a UsageError. |
| REQ-007 | The research compiled contract matches its sources after the YAML edit. | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` exits 0. |
| REQ-008 | The behavior has a manual testing playbook scenario. | `/create:manual-testing-playbook system-deep-loop update --path .skilled/skills/system-deep-loop/runtime/manual-testing-playbook` adds a scenario under `executor/` and the package index lists it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/dispatch-iteration.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts` exits 0 with the new research config-dir cases included.
- **SC-002**: The new research config-dir case fails when run against the pre-change `dispatch-iteration.cjs`, so it proves the fix rather than restating it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None. Slice B depends on no other slice (research §20). | None | None needed |
| Risk | Compiled-contract drift: the research contract digests `deep-research.yaml`, so `check-contract-drift` fails the full gate until it is regenerated, and phases 001, 010, 012 and 013 regenerate the same file. | Med | Regenerate as the last implementation task, and regenerate again on the merged tree instead of resolving digest lines by hand. |
| Risk | The YAML renders `--claude-config-dir ""` when no dir is set, and the empty value is read as a set flag. | Low: default-path risk is LOW per research §20, but an empty value must not reach `validateClaudeConfigDir` | Treat an empty value as absent in `validateFlags`, and cover it with a test that passes `--claude-config-dir ""` on research and asserts today's behavior. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should a research run with no configured dir strip an inherited `CLAUDE_CONFIG_DIR`? Recorded in `goal.md`; this phase keeps today's behavior because stripping it changes every default research run.
<!-- /ANCHOR:questions -->

---
