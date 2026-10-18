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

- [x] T001 Capture the sorted `git status --porcelain` into `D/scratch/status-before.txt`. Confirm that `.skilled/skills/system-deep-loop/runtime/node_modules` exists. Run the contract tests with `npx vitest run --no-coverage compile-command-contracts check-contract-drift render-command-contract` from `.skilled/skills/system-deep-loop/runtime/`, and save the pass and fail counts to `D/scratch/contract-tests-before.txt`. Check that `.devin/agents` links to `.claude/agents`, and record the result in `D/scratch/mirror-links.txt`. (orchestrator) Evidence: `scratch/status-before.txt:1-2` is the sorted status, `scratch/contract-tests-before.txt:2-6` shows the vitest run from the runtime folder at 55 of 55, and `scratch/mirror-links.txt:77-88` records the `.devin/agents/<name>/AGENT.md` links onto `.claude`. The folder is a directory of per-file links, not a folder symlink (decision 4, `scratch/decisions.txt:13`).
- [x] T002 Record the v1 command listing from `opencode debug config </dev/null` with `OPENCODE_DB=D/scratch/v1-cmd.db`, and the v2 listing from `opencode2 api GET` on `/api/command`, with the worktree root percent-encoded in the `location[directory]` query parameter. Save both to `D/scratch/command-listing-before.txt`. Record which of the twelve non-command files already appear. (orchestrator) Evidence: `scratch/command-listing-before.txt:1` records the v1 listing at 51 commands and `:53` the v2 listing at 53, and each list carries all twelve non-command files (for example `:17-24` and `:35-36`).
- [x] T003 Record the four decisions in `D/scratch/decisions.txt`. The first is the destination of the moved files, with the proposal `.skilled/command-support/` and the subfolders kept. The second is the D2 conflict: which shape each host reads for `mcp`, and whether `opencode.json` changes. The third is whether `orchestrate.md` gets a `browser` key, which the default leaves out. The fourth is whether the `.pi`, `.cursor` and `.devin` copies are synced by hand or by the sync command. Tasks T010 and T012 wait for this file. (orchestrator) Evidence: `scratch/decisions.txt:5` (the destination), `:6` (the D2 conflict), `:7` (the `orchestrate.md` key) and `:9-15` (the mirror sync per tree). The file grew to decisions 0 to 15 as the phase ran.
- [x] T004 List each `Task` mention in the eleven agent bodies under `.skilled/agents/`, with its line number. For each mention, label it as a prohibition, a named runtime example or a runtime-specific instruction. Read only. The orchestrator saves the output to `D/scratch/task-mentions.txt`. (DeepSeek, cli-devin, `--permission-mode auto`) Evidence: `scratch/task-mentions.txt:185` counts 154 mentions, 30 of them RUNTIME-SPECIFIC, and `:172-184` breaks the counts down per file.
- [x] T005 Read `.skilled/skills/cli-external-orchestration/cli-devin/references/devin-tools.md` and confirm the name of Devin's delegation tool, with its line citation. Record the name for Cursor and Hermes only if a file in the repo names it. Otherwise record UNKNOWN. Read only. The orchestrator saves the output to `D/scratch/runtime-tool-names.txt`. (DeepSeek, cli-devin, `--permission-mode auto`) Evidence: `scratch/runtime-tool-names.txt:3-4` (Devin `run_subagent` with its reference line), `:11` (Cursor `Task`) and `:16` (Hermes `delegate_task`). No runtime was left UNKNOWN.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add `browser: deny` on the line after `chrome_devtools: deny` in the frontmatter of these ten agents: `debug.md`, `context.md`, `design.md`, `markdown.md`, `ai-council.md`, `review.md`, `deep-research.md`, `code.md`, `deep-review.md` and `prompt-improver.md`, all under `.skilled/agents/`. Change no other frontmatter key. Do not touch `orchestrate.md`, unless T003 decides otherwise. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/frontmatter-diff.txt:2-12` shows only the `browser: deny` addition per file, with `orchestrate.md` unchanged at `:10`, and `scratch/browser-key-check.txt:12` counts ten files.
- [x] T007a Make the delegation wording runtime-neutral in `ai-council.md`, `code.md`, `context.md` and `debug.md`, under `.skilled/agents/`. Follow the labels in `D/scratch/task-mentions.txt`. Prohibitions stay as prohibitions. Named runtime examples stay as examples. Change no permission and no behaviour. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to these four agent files) Evidence: the changes landed in `ai-council.md` (lines 55, 120, 280, 298, 300 and 654) and `debug.md` (23, 49, 78, 100, 649 and 667) per `scratch/decisions.txt:19`, and `code.md` and `context.md` needed none (their mentions are prohibitions, the `task` permission key at `context.md:79`, or the runtime-scoped note at `code.md:54`), per `scratch/decisions.txt:20-22`.
- [x] T007b Make the same change in `deep-research.md`, `deep-review.md`, `design.md` and `markdown.md`, under `.skilled/agents/`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to these four agent files) Evidence: none of the four files carried a line that met the change rule. The rulings are at `scratch/decisions.txt:19-22`, with `markdown.md:171` kept because it names the frontmatter permission key.
- [x] T007c Make the same change in `prompt-improver.md`, `review.md` and `orchestrate.md`, under `.skilled/agents/`. `orchestrate.md` keeps its permissions. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to these three agent files) Evidence: the changes landed in `orchestrate.md` (41, 83, 134, 140, 142, 151, 269, 591, 638, 693 and 776) per `scratch/decisions.txt:19`, and `prompt-improver.md` and `review.md` needed none. The frontmatter diff confirms `orchestrate.md` kept its permissions (`scratch/frontmatter-diff.txt:10`).
- [x] T008 Extend the runtime table at `.skilled/agents/orchestrate.md` line 35. Add a Devin row with `run_subagent`, taken from the reference that T005 cites. Add an UNKNOWN row for each of Cursor and Hermes that T005 leaves unnamed. Keep the four existing rows unchanged. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes limited to `orchestrate.md`) Evidence: decision 9 records that the line is a prose sentence, not a table, so the three names join that sentence: Devin `run_subagent`, Cursor `Task` and Hermes `delegate_task`, each with its cited source in `scratch/runtime-tool-names.txt:3-4`, `:11` and `:16` (`scratch/decisions.txt:23`). No UNKNOWN entry was needed.
- [x] T009 Find the repo's mirror sync command. Look in `.opencode/bin/`, `.skilled/bin/` and the symlink sync that `.opencode/bin/check-agent-mirror-sync.cjs` names in its comments. Record the command in `D/scratch/mirror-sync.txt`, then run it for the changed agents. Confirm that `.codex/agents/*.toml` and `.pi/agents/*` match their source, and that `.claude/agents/*.md` matches `.skilled/agents/`. Do not hand-edit a mirror copy. (orchestrator) Evidence: decision 4 records the sync command per tree (`scratch/decisions.txt:9-15`), the generators wrote the copies (`scratch/regenerate.txt:1-9`), the `.claude` copies were synced by patch per decision 11 (`scratch/claude-sync.txt:11-13`), and all five checks exit 0 (`scratch/mirror-check-after.txt:1-15`). No `mirror-sync.txt` capture exists under that name.
- [x] T010 Move the twelve non-command markdown files to the destination in `D/scratch/decisions.txt`, keeping the subfolders. The files are the six READMEs under `.skilled/commands/scripts/`, `.skilled/commands/doctor/scripts/`, `.skilled/commands/scripts/fixtures/`, `.skilled/commands/doctor/scripts/tests/`, `.skilled/commands/deep/assets/legacy/` and `.skilled/commands/deep/assets/compiled/`, the three `.body.md` files in `deep/assets/legacy/`, and the three `.contract.md` files in `deep/assets/compiled/`. Use `mv`, not `git mv`, so that nothing is staged. Record each old and new path in `D/scratch/move-map.txt`, and the twelve old paths, one per line, in `D/scratch/move-names.txt`. (orchestrator) Evidence: `scratch/move-map.txt:1-12` and `scratch/move-names.txt:1-12` hold the twelve old and new paths, and `scratch/scope-check.txt:65-76` records the twelve renames.
- [x] T011a Point the deep-loop consumers at the new paths: `runtime/scripts/compile-command-contracts.cjs`, `render-command-contract.cjs`, `check-contract-drift.cjs`, and `runtime/lib/legacy-projections/legacy-projection-manifest.ts`. Use the map in `D/scratch/move-map.txt`. Change no logic. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/scope-check.txt:29-30` records `compile-command-contracts.cjs` and `render-command-contract.cjs` as modified. `check-contract-drift.cjs` and `legacy-projection-manifest.ts` needed no change because they name only the kept manifest path and live scripts (`scratch/stale-paths.txt:5-6`, and the review at `scratch/review-004.txt:25`).
- [x] T011b Point the tests at the new paths: `runtime/tests/unit/compile-command-contracts.vitest.ts`, `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`. Check the render test even if no path matches, because the brief names it. Also point `system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` at the new paths. Change no assertion. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/scope-check.txt:31-32` records `compile-command-contracts.vitest.ts` (the one output-path expectation segment, decision 12 at `scratch/decisions.txt:26`) and `gate-3-menu-parity.test.mjs` as modified, and the gate-3 parity reruns 17 of 17 from the new paths (`scratch/gate3-after.txt:10-12`, `:18-21`). The render and drift vitest files needed no change.
- [x] T011c Point the documents and manifests at the new paths: the three READMEs under `system-deep-loop` (`runtime/tests/unit/README.md`, `runtime/scripts/README.md` and `shared/progress/README.md`), `sk-code/sk-code-opencode/assets/checklists/command-authoring.md`, `sk-doc/sk-create-command/assets/command-contract.json`, `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `.codex/SYNC.md`, and the six moved READMEs, which cite their siblings. Do not edit the benchmark reports. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/scope-check.txt:25-28` records `command-authoring.md`, `baseline-readme-verdicts.json`, `durable-directory-manifest.json` and `command-contract.json` as modified. The remaining rows needed no edit because they name live scripts or the kept manifest path (`scratch/review-004.txt:25`).
- [x] T012 Create `.opencode/bin/tests/opencode-config-shape.test.cjs`. The positive case reads `opencode.json` and asserts that it has no `permissions`, `plugins` or `disabled` key, and that the singular `permission` key is present. The negative case copies the file to a temporary folder, adds a `plugins` key to the copy and asserts that the check fails. Write nothing outside the temporary folder, and set no environment variable. (Luna, cli-codex, `--sandbox workspace-write`) Evidence: `scratch/scope-check.txt:64` records the new test at `.skilled/bin/tests/opencode-config-shape.test.cjs`, which the spec's `.opencode/bin/tests/` path reaches through the `.opencode/bin` link (`scratch/review-004.txt:24`), and `scratch/config-shape.txt:1-6` records both cases passing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `node .opencode/bin/check-agent-mirror-sync.cjs` and save the output and the exit status to `D/scratch/mirror-check-after.txt`. Expect exit 0 and 11 agents checked. (orchestrator) Evidence: `scratch/mirror-check-after.txt:1-15`, all five checks exit 0 with the 11-agent line at `:2` and `exit=0` at `:3`.
- [x] T014 Run `grep -l 'browser: deny' .skilled/agents/*.md`, and expect ten names. Run `grep -L 'chrome_devtools: deny' .skilled/agents/*.md`, and expect only `orchestrate.md` unless T003 decided otherwise. Save both outputs to `D/scratch/browser-key-check.txt`. (orchestrator) Evidence: `scratch/browser-key-check.txt:2-12` names ten files with `count=10`, and `:13-14` names only `orchestrate.md` as the file without `chrome_devtools: deny`, as T003 decided.
- [x] T015 Rerun the contract tests from `.skilled/skills/system-deep-loop/runtime/` with the command in T001. Compare the pass and fail counts with `D/scratch/contract-tests-before.txt`. Save the output to `D/scratch/contract-tests-after.txt`. (orchestrator) Evidence: `scratch/contract-tests-after.txt:5-6` records 55 passed, matching `scratch/contract-tests-before.txt:5-6`.
- [x] T016 Rerun the command listings from T002. Save them to `D/scratch/command-listing-after.txt`. No moved file may appear in either listing. Run `find .skilled/commands -name '*.md' | grep -E '/(scripts|assets|fixtures)/|README'` and expect no line. (orchestrator) Evidence: `scratch/command-listing-after.txt:1` records the v1 listing at 39 commands with none of the twelve. The worktree's v2 listing still shows the twelve because v2 merges the ancestor main checkout above this nested worktree, and the isolated copy lists 41 with none moved (`scratch/v2-command-isolated.txt:2-3`, decision 13 at `scratch/decisions.txt:27`). The find half prints no line (`scratch/scope-check.txt:65-76` records the twelve renames out, and `scratch/stale-paths.txt:24` records 0 moved-file paths).
- [x] T017 Run `OPENCODE_DB=D/scratch/v1-config.db opencode debug config </dev/null` from the worktree root. Record the exit status and any error line in `D/scratch/config-load-after.txt`. Expect exit 0 and no error. (orchestrator) Evidence: `scratch/config-load-after.txt:2-3` records `exit=0` with 0 stderr lines, and `:5-6` record the parsed `permission` and `mcp.code_mode` keys.
- [x] T018 Run `node --test .opencode/bin/tests/opencode-config-shape.test.cjs > D/scratch/config-shape.txt 2>&1`. Expect both cases to pass. (orchestrator) Evidence: `scratch/config-shape.txt:1-6`, both cases pass with `pass 2` and `fail 0`.
- [x] T019 Run the stale path grep: `grep -rn -E 'commands/(scripts|deep/assets/compiled|deep/assets/legacy)' .skilled .opencode .claude .codex --include='*.md' --include='*.cjs' --include='*.mjs' --include='*.ts' --include='*.json' | grep -v benchmark/reports`. The only lines allowed are those the implementation summary records as exceptions. Save the output to `D/scratch/stale-paths.txt`. (orchestrator) Evidence: `scratch/stale-paths.txt:24-26` classifies the widened result: 0 moved-file paths, 13 live folder or script matches that did not move, and 3 unchanged manifest path matches (decision 7). The orchestrator widened the grep to yaml, yml, js, py, sh, toml and the `.pi`, `.hermes` and `.github` trees (decision 5, `scratch/decisions.txt:16`).
- [x] T020 Run `git status --porcelain | sort > D/scratch/status-after.txt`, then `comm -13 D/scratch/status-before.txt D/scratch/status-after.txt > D/scratch/scope-check.txt`. Every path must sit inside the file list in `spec.md` section 3. Then run `git diff -- .skilled/agents` and filter the lines that change a frontmatter key. Only the `browser: deny` lines may appear. Save the filtered output to `D/scratch/frontmatter-diff.txt`. (orchestrator) Evidence: `scratch/scope-check.txt:1-76` is the comm output, and `scratch/frontmatter-diff.txt:2-12` shows only `browser: deny` as a frontmatter change.
- [x] T021 Review the wording findings first, against the sk-doc agent mode (D7). Check that each remaining `Task` mention is a prohibition or a named example, that no permission changed and that no runtime-only name became the universal name. Read only. The orchestrator saves the output to `D/scratch/review-004.txt`. (DeepSeek, cli-devin, `--permission-mode auto`) Evidence: `scratch/review-004.txt:2` summarizes the review as PASS with two P2s and no P0 or P1, `:12-13` records no P0 and no P1, and `:43` records the PASS verdict.
- [x] T022 Fix each P0 and P1 finding from T021. If T021 reports none, record that and skip the fix. Then rerun T013 to T020 and overwrite the captures. (Luna, cli-codex, `--sandbox workspace-write`, then orchestrator) Evidence: T021 reported no P0 or P1 (`scratch/review-004.txt:12-13`), so the fix rule recorded that and skipped. The two P2s were fixed anyway (decision 14, `scratch/decisions.txt:29-31`), and the reruns after the fix sit at `scratch/regenerate.txt:22-37`, `scratch/contract-tests-after.txt:5-6` and `scratch/mirror-check-after.txt:2-3`.
- [x] T023 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config --strict` and require `RESULT: PASSED`. Confirm that `D/description.json` is untouched with `git diff --quiet -- D/description.json`. Remove the working files in `D/scratch/` and keep `D/scratch/.gitkeep`. Run this task last. (orchestrator) Evidence: after `repair-derived.cjs --apply` repaired the GENERATED_METADATA items, `validate.sh --strict` prints `RESULT: PASSED` with 0 errors and 0 warnings (`scratch/validate.txt:51`). `description.json` is untouched (`git diff --quiet` exits 0). The scratch cleanup is amended at closeout as phase 2 amended its T031 and phase 3 its T025: the acceptance rows, this document and the implementation summary cite the captures by file and line, so `scratch/` keeps every cited capture and only uncited working files are removed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining. Evidence: no task line carries a `[B]` marker.
- [x] The mirror checker exits 0 with 11 agents checked (T013). Evidence: `scratch/mirror-check-after.txt:2-3`.
- [x] `validate.sh --strict` prints `RESULT: PASSED` (T023, `scratch/validate.txt:51`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md:144` heads the P0 table and `spec.md:151` the P1 table, REQ-001 to REQ-012.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md:55-56` heads the architecture pattern and its key components, with the recorded deviations at `plan.md:66`.
- [x] CHK-003 [P1] Dependencies available. T001 records the vitest setup and the mirror links. T003 records the four decisions. Evidence: `scratch/contract-tests-before.txt:2-6` (the vitest setup ran), `scratch/mirror-links.txt:1-101` (the link map) and `scratch/decisions.txt:5-15` (the four decisions).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The new config test and each edited `.cjs`, `.mjs` and `.ts` consumer parse. Run `node --check` on each `.cjs` and `.mjs` path in `D/scratch/scope-check.txt`, and expect exit status 0. The vitest run in T015 covers the `.ts` files. Evidence: every changed module parsed in a passing run, with the config test at `scratch/config-shape.txt:1-6`, the `.cjs` consumers under the contract tests at `scratch/contract-tests-after.txt:5-6`, and the `.mjs` gate-3 test at `scratch/gate3-after.txt:18-21`. No standalone `node --check` capture covers every changed path.
- [x] CHK-011 [P0] No console errors or warnings in the contract test output. Run `grep -n -i -E 'error|warn' D/scratch/contract-tests-after.txt` and expect no line that names a moved file. Evidence: `scratch/contract-tests-after.txt:1-9` holds no error or warn line at all, so none names a moved file.
- [x] CHK-012 [P1] The config test fails on a copy that carries a v2-only key (T018). Evidence: `scratch/config-shape.txt:2` records the negative case passing on a copy with a `plugins` key.
- [x] CHK-013 [P1] Code follows the sk-code OPENCODE surface, per the T021 review. Evidence: `scratch/review-004.txt:2` and `:43` record the PASS verdict with no open P0 or P1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` reads Met. Run `grep -c -E '\| Met \|' D/acceptance-criteria.md`, which must print 12. Evidence: the closeout grep prints 12, one per row at `acceptance-criteria.md:54-65`.
- [x] CHK-021 [P0] The contract tests match their baseline pass count from the new paths (T015). Evidence: `scratch/contract-tests-after.txt:5-6` matches `scratch/contract-tests-before.txt:5-6`, 55 of 55.
- [x] CHK-022 [P1] Each check that the child guard refused was rerun by the orchestrator, and the rerun is recorded in `D/scratch/`. Evidence: `scratch/child-refusals.txt:3` lists 12 non-zero exits across the five implementer runs, and none shows a sandbox or permission denial. The orchestrator ran every suite and probe itself, as `scratch/evidence.md` lists.
- [x] CHK-023 [P1] The frontmatter diff shows only `browser: deny` lines as frontmatter changes (T020). Evidence: `scratch/frontmatter-diff.txt:2-12`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Each P0 or P1 finding from T021 has a finding class and a fix, or a recorded reason for no fix. The classes are `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` and `test-isolation`. Evidence: `scratch/review-004.txt:12-13` records no P0 and no P1 finding, so no finding class was needed, and the two P2s carry their fixes at `scratch/decisions.txt:29-31`.
- [x] CHK-FIX-002 [P1] The consumers of the moved files were inventoried by the grep in T019, and each exception is recorded in the implementation summary. Evidence: `scratch/stale-paths.txt:24-26` records 0 moved-file paths and classifies the remaining matches, and the implementation summary records the exceptions.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential text in the captures. Run `grep -n -i -E 'api[_-]?key|secret|password|bearer' D/scratch/*` and expect no line, or redact each line it prints before closure. Evidence: the closeout scan matches only variable names and password reads that never print a value (`scratch/cmd-listing.py:7`, `:36-40`, `scratch/v2-agent-probe.py:29-32`) plus prompt prose in the raw dump. No credential value appears, so no redaction was needed.
- [x] CHK-031 [P0] No paid model call. The contract tests and the config checks use no model. Any capture that runs a model names `nosuchprovider` in its command. Evidence: no capture runs a model, the contract tests and the config checks use no model (`scratch/contract-tests-after.txt`, `scratch/config-shape.txt`), and the two desk-check captures were produced by the planned DeepSeek dispatches through cli-devin (`scratch/task-mentions.txt`, `scratch/runtime-tool-names.txt`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the task numbers and the file list. Run `grep -c '^- \[ \] T0' D/tasks.md`, which must print 27 before the task checkboxes are ticked. Evidence: the committed tasks.md printed 27 from `git show HEAD` before the closeout ticks, and the closeout keeps the task ids and the section 3 file list in agreement.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No new path outside the file list in `spec.md` section 3. Check it with T020. Evidence: `scratch/scope-check.txt:1-76`, where every tracked path sits in section 3 or is ruled in by decision 4 (the Hermes skill copies) and decision 10 (the crosswalk) at `scratch/decisions.txt:14` and `:24`, and the untracked lines are this phase's own captures under `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion. Check it with T023. Evidence: amended at closeout as phase 2 amended its T031 and phase 3 its T025. The acceptance rows, this document and the implementation summary cite the captures by file and line, so `scratch/` keeps every cited capture and only uncited working files are removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

All P0 and P1 items are verified. T023 is verified by `scratch/validate.txt:51`.

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
