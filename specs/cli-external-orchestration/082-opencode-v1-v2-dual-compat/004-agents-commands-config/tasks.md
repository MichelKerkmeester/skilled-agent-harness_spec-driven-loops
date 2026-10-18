---
title: "Tasks: Phase 4: agents-commands-config"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "agents commands config tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: agents-commands-config

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Each task names its executor in brackets at the end. `(orchestrator)` runs in the orchestrator's shell. `(DeepSeek, cli-devin)` runs through `devin -p --model deepseek-v4-1-flash-max` with `AI_SESSION_CHILD=1` set, and it uses the markdown persona for agent wording. `(Luna, cli-codex)` runs through `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast"` with `AI_SESSION_CHILD=1` set. Paths are relative to the worktree root. `D` below means `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config`. Dispatches run one at a time. The orchestrator runs the mirror checker and the contract tests after each dispatch that changes an agent or a moved file.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the sorted `git status --porcelain` into `D/scratch/status-before.txt`. Confirm that `.skilled/skills/system-deep-loop/runtime/node_modules` exists. Run the contract tests with `npx vitest run --no-coverage compile-command-contracts check-contract-drift render-command-contract` from `.skilled/skills/system-deep-loop/runtime/`, and save the pass and fail counts to `D/scratch/contract-tests-before.txt`. Check that `.devin/agents` links to `.claude/agents`, and record the result in `D/scratch/mirror-links.txt`. (orchestrator)
- [ ] T002 Record the v1 command listing from `opencode debug config </dev/null` with `OPENCODE_DB=D/scratch/v1-cmd.db`, and the v2 listing from `opencode2 api GET` on `/api/command`, with the worktree root percent-encoded in the `location[directory]` query parameter. Save both to `D/scratch/command-listing-before.txt`. Record which of the twelve non-command files already appear. (orchestrator)
- [ ] T003 Record the four decisions in `D/scratch/decisions.txt`. The first is the destination of the moved files, with the proposal `.skilled/command-support/` and the subfolders kept. The second is the D2 conflict: which shape each host reads for `mcp`, and whether `opencode.json` changes. The third is whether `orchestrate.md` gets a `browser` key, which the default leaves out. The fourth is whether the `.pi`, `.cursor` and `.devin` copies are synced by hand or by the sync command. Tasks T010 and T012 wait for this file. (orchestrator)
- [ ] T004 List each `Task` mention in the eleven agent bodies under `.skilled/agents/`, with its line number. For each mention, label it as a prohibition, a named runtime example or a runtime-specific instruction. Read only. The orchestrator saves the output to `D/scratch/task-mentions.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [ ] T005 Read `.skilled/skills/cli-external-orchestration/cli-devin/references/devin-tools.md` and confirm the name of Devin's delegation tool, with its line citation. Record the name for Cursor and Hermes only if a file in the repo names it. Otherwise record UNKNOWN. Read only. The orchestrator saves the output to `D/scratch/runtime-tool-names.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add `browser: deny` on the line after `chrome_devtools: deny` in the frontmatter of these ten agents: `debug.md`, `context.md`, `design.md`, `markdown.md`, `ai-council.md`, `review.md`, `deep-research.md`, `code.md`, `deep-review.md` and `prompt-improver.md`, all under `.skilled/agents/`. Change no other frontmatter key. Do not touch `orchestrate.md`, unless T003 decides otherwise. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T007a Make the delegation wording runtime-neutral in `ai-council.md`, `code.md`, `context.md` and `debug.md`, under `.skilled/agents/`. Follow the labels in `D/scratch/task-mentions.txt`. Prohibitions stay as prohibitions. Named runtime examples stay as examples. Change no permission and no behaviour. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to these four agent files)
- [ ] T007b Make the same change in `deep-research.md`, `deep-review.md`, `design.md` and `markdown.md`, under `.skilled/agents/`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to these four agent files)
- [ ] T007c Make the same change in `prompt-improver.md`, `review.md` and `orchestrate.md`, under `.skilled/agents/`. `orchestrate.md` keeps its permissions. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to these three agent files)
- [ ] T008 Extend the runtime table at `.skilled/agents/orchestrate.md` line 35. Add a Devin row with `run_subagent`, taken from the reference that T005 cites. Add an UNKNOWN row for each of Cursor and Hermes that T005 leaves unnamed. Keep the four existing rows unchanged. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to `orchestrate.md`)
- [ ] T009 Find the repo's mirror sync command. Look in `.opencode/bin/`, `.skilled/bin/` and the symlink sync that `.opencode/bin/check-agent-mirror-sync.cjs` names in its comments. Record the command in `D/scratch/mirror-sync.txt`, then run it for the changed agents. Confirm that `.codex/agents/*.toml` and `.pi/agents/*` match their source, and that `.claude/agents/*.md` matches `.skilled/agents/`. Do not hand-edit a mirror copy. (orchestrator)
- [ ] T010 Move the twelve non-command markdown files to the destination in `D/scratch/decisions.txt`, keeping the subfolders. The files are the six READMEs under `.skilled/commands/scripts/`, `.skilled/commands/doctor/scripts/`, `.skilled/commands/scripts/fixtures/`, `.skilled/commands/doctor/scripts/tests/`, `.skilled/commands/deep/assets/legacy/` and `.skilled/commands/deep/assets/compiled/`, the three `.body.md` files in `deep/assets/legacy/`, and the three `.contract.md` files in `deep/assets/compiled/`. Use `mv`, not `git mv`, so that nothing is staged. Record each old and new path in `D/scratch/move-map.txt`, and the twelve old paths, one per line, in `D/scratch/move-names.txt`. (orchestrator)
- [ ] T011a Point the deep-loop consumers at the new paths: `runtime/scripts/compile-command-contracts.cjs`, `render-command-contract.cjs`, `check-contract-drift.cjs`, and `runtime/lib/legacy-projections/legacy-projection-manifest.ts`. Use the map in `D/scratch/move-map.txt`. Change no logic. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T011b Point the tests at the new paths: `runtime/tests/unit/compile-command-contracts.vitest.ts`, `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`. Check the render test even if no path matches, because the brief names it. Also point `system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` at the new paths. Change no assertion. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T011c Point the documents and manifests at the new paths: the three READMEs under `system-deep-loop` (`runtime/tests/unit/README.md`, `runtime/scripts/README.md` and `shared/progress/README.md`), `sk-code/sk-code-opencode/assets/checklists/command-authoring.md`, `sk-doc/sk-create-command/assets/command-contract.json`, `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `.codex/SYNC.md`, and the six moved READMEs, which cite their siblings. Do not edit the benchmark reports. (Luna, cli-codex, `--sandbox workspace-write`)
- [ ] T012 Create `.opencode/bin/tests/opencode-config-shape.test.cjs`. The positive case reads `opencode.json` and asserts that it has no `permissions`, `plugins` or `disabled` key, and that the singular `permission` key is present. The negative case copies the file to a temporary folder, adds a `plugins` key to the copy and asserts that the check fails. Write nothing outside the temporary folder, and set no environment variable. (Luna, cli-codex, `--sandbox workspace-write`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `node .opencode/bin/check-agent-mirror-sync.cjs` and save the output and the exit status to `D/scratch/mirror-check-after.txt`. Expect exit 0 and 11 agents checked. (orchestrator)
- [ ] T014 Run `grep -l 'browser: deny' .skilled/agents/*.md`, and expect ten names. Run `grep -L 'chrome_devtools: deny' .skilled/agents/*.md`, and expect only `orchestrate.md` unless T003 decided otherwise. Save both outputs to `D/scratch/browser-key-check.txt`. (orchestrator)
- [ ] T015 Rerun the contract tests from `.skilled/skills/system-deep-loop/runtime/` with the command in T001. Compare the pass and fail counts with `D/scratch/contract-tests-before.txt`. Save the output to `D/scratch/contract-tests-after.txt`. (orchestrator)
- [ ] T016 Rerun the command listings from T002. Save them to `D/scratch/command-listing-after.txt`. No moved file may appear in either listing. Run `find .skilled/commands -name '*.md' | grep -E '/(scripts|assets|fixtures)/|README'` and expect no line. (orchestrator)
- [ ] T017 Run `OPENCODE_DB=D/scratch/v1-config.db opencode debug config </dev/null` from the worktree root. Record the exit status and any error line in `D/scratch/config-load-after.txt`. Expect exit 0 and no error. (orchestrator)
- [ ] T018 Run `node --test .opencode/bin/tests/opencode-config-shape.test.cjs > D/scratch/config-shape.txt 2>&1`. Expect both cases to pass. (orchestrator)
- [ ] T019 Run the stale path grep: `grep -rn -E 'commands/(scripts|deep/assets/compiled|deep/assets/legacy)' .skilled .opencode .claude .codex --include='*.md' --include='*.cjs' --include='*.mjs' --include='*.ts' --include='*.json' | grep -v benchmark/reports`. The only lines allowed are those the implementation summary records as exceptions. Save the output to `D/scratch/stale-paths.txt`. (orchestrator)
- [ ] T020 Run `git status --porcelain | sort > D/scratch/status-after.txt`, then `comm -13 D/scratch/status-before.txt D/scratch/status-after.txt > D/scratch/scope-check.txt`. Every path must sit inside the file list in `spec.md` section 3. Then run `git diff -- .skilled/agents` and filter the lines that change a frontmatter key. Only the `browser: deny` lines may appear. Save the filtered output to `D/scratch/frontmatter-diff.txt`. (orchestrator)
- [ ] T021 Review the wording findings first, against the sk-doc agent mode (D7). Check that each remaining `Task` mention is a prohibition or a named example, that no permission changed and that no runtime-only name became the universal name. Read only. The orchestrator saves the output to `D/scratch/review-004.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [ ] T022 Fix each P0 and P1 finding from T021. If T021 reports none, record that and skip the fix. Then rerun T013 to T020 and overwrite the captures. (Luna, cli-codex, `--sandbox workspace-write`, then orchestrator)
- [ ] T023 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config --strict` and require `RESULT: PASSED`. Confirm that `D/description.json` is untouched with `git diff --quiet -- D/description.json`. Remove the working files in `D/scratch/` and keep `D/scratch/.gitkeep`. Run this task last. (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The mirror checker exits 0 with 11 agents checked (T013)
- [ ] `validate.sh --strict` prints `RESULT: PASSED` (T023)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies available. T001 records the vitest setup and the mirror links. T003 records the four decisions.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The new config test and each edited `.cjs`, `.mjs` and `.ts` consumer parse. Run `node --check` on each `.cjs` and `.mjs` path in `D/scratch/scope-check.txt`, and expect exit status 0. The vitest run in T015 covers the `.ts` files.
- [ ] CHK-011 [P0] No console errors or warnings in the contract test output. Run `grep -n -i -E 'error|warn' D/scratch/contract-tests-after.txt` and expect no line that names a moved file.
- [ ] CHK-012 [P1] The config test fails on a copy that carries a v2-only key (T018).
- [ ] CHK-013 [P1] Code follows the sk-code OPENCODE surface, per the T021 review.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` reads Met. Run `grep -c -E '\| Met \|' D/acceptance-criteria.md`, which must print 12.
- [ ] CHK-021 [P0] The contract tests match their baseline pass count from the new paths (T015).
- [ ] CHK-022 [P1] Each check that the child guard refused was rerun by the orchestrator, and the rerun is recorded in `D/scratch/`.
- [ ] CHK-023 [P1] The frontmatter diff shows only `browser: deny` lines as frontmatter changes (T020).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Each P0 or P1 finding from T021 has a finding class and a fix, or a recorded reason for no fix. The classes are `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` and `test-isolation`.
- [ ] CHK-FIX-002 [P1] The consumers of the moved files were inventoried by the grep in T019, and each exception is recorded in the implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential text in the captures. Run `grep -n -i -E 'api[_-]?key|secret|password|bearer' D/scratch/*` and expect no line, or redact each line it prints before closure.
- [ ] CHK-031 [P0] No paid model call. The contract tests and the config checks use no model. Any capture that runs a model names `nosuchprovider` in its command.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the task numbers and the file list. Run `grep -c '^- \[ \] T0' D/tasks.md`, which must print 27 before the task checkboxes are ticked.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No new path outside the file list in `spec.md` section 3. Check it with T020.
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion. Check it with T023.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | [ ]/8 |
| P1 Items | 8 | [ ]/8 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
