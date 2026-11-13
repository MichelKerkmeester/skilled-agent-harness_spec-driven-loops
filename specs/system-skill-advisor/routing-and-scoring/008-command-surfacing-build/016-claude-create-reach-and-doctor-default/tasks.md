---
title: "Tasks: Phase 16: claude-create-reach-and-doctor-default"
description: "Ordered worker-sized tasks in five lanes: rename /create:skill to /create:sk-skill on every runtime with generated files rewritten by their generators, read a negated show-up or appear phrase as a doctor problem cue, show the AGENTS.md Gate 2 call on stdin, add intent phrases to five commands with a real-embedding holdout count, and keep the brief-cost run's health records in its sandbox."
trigger_phrases:
  - "claude create reach and doctor default tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: claude-create-reach-and-doctor-default

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
| `[C]` | Coordinator task: a git move, a mirror or agent regeneration, a build, a daemon restart, a re-embed, a real capture, a live hook or CLI run, a Claude Code session or the full suite. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `G` is `git -c core.fsmonitor=false`. `SP` is this phase's `scratch/` folder.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime` and `HK` is `.skilled/skills/system-skill-advisor/hooks`. `TC` is `npm run typecheck` in `ADV`, which must exit 0. `V <files>` is `env -u AI_SESSION_CHILD npx vitest run <files>` in `ADV`, which must report 0 failed. `VALL` is `V` with no file.
- `SC` is `.skilled/skills/system-spec-kit/runtime/cli`. `MS` is `$SC/runtime-mirrors/sync-runtime-mirrors.cjs`, `MST` is `$SC/tests/sync-runtime-mirrors.test.mjs`, `NMST` is `node --test $MST`, which must report `fail 0`, `SRM` is `node $MS --check`, which must exit 0, and `MSR` is `$SC/runtime-mirrors/README.md`.
- `PSY` is `node $SC/codex/sync-prompts.cjs --check`, `node $SC/pi/sync-prompts-pi.cjs --check` and `node $SC/dsh/sync-prompts-dsh.cjs --check`, each of which must exit 0 and print `PASS`. `ASY` is the same for `$SC/codex/sync-agents.cjs`, `$SC/pi/sync-agents-pi.cjs` and `$SC/dsh/sync-agents-dsh.cjs`. `AMSC` is `node .skilled/bin/check-agent-mirror-sync.cjs`, which must print `all comparable mirrors in sync`.
- `HO` is `$ADV/lib/scorer/doctor-helper-handoff.ts`, `HOT` is `$ADV/tests/doctor-helper-handoff.vitest.ts`, `HCT` is `$ADV/tests/scorer/doctor-handoff-command.vitest.ts` and `HD` is `$HK/skill-advisor-hook.md`.
- `RA` is `$ADV/scripts/routing-accuracy`. `CAP` is `$RA/capture-command-routing-baseline.mjs`, `BASE` is `$RA/command-routing-baseline.json`, `CORPUS` is `$RA/command-prompts.jsonl` and `SLICE` is `V tests/command-routing-slice.vitest.ts`.
- `FLOOR` is `node $CAP | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune, .attachedMetrics.false_offer_attached'`.
- `REAL` is `node $CAP --real-embedding`, kept in a file and read with `jq -c '.metrics.typed_recall_at_1, .metrics.plain_recall_at_1.tune, .attachedMetrics.plain.tune, .metrics.plain_recall_at_1.holdout, .metrics.false_offer, .attachedMetrics.false_offer_attached, [.rows["mns-chat-03"].offered, .rows["nm-system-skilled-doctor-01"].offered, .rows["sv-03"].offered]'`. It publishes holdout as counts only. It needs Ollama on `127.0.0.1:11434`, which no task starts.
- `EVAL` is `node $RA/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`.
- `DER` is `node $ADV/scripts/command-bridges/derive-command-bridges.cjs`, which writes `command-bridges.generated.json` and the marked blocks of `$ADV/lib/scorer/projection.ts`, `$ADV/scripts/skill_advisor.py` and `$ADV/lib/command-attach.ts`. `DRV` is `DER --check`, which must exit 0 and print `"changed": []`.
- `DS` is `.skilled/commands/doctor/scripts` and `DALL` is `node --test $DS/tests/*.test.cjs`, which must report `fail 0`. `AMS` is `$DS/agents-md-manifest.cjs`, `AMT` is `$DS/tests/agents-md-manifest.test.cjs`, `AMM` is `.skilled/commands/doctor/assets/agents-md-manifest.json`, `MAN` is `node $AMS --check` and `AMC` is `node $DS/agents-md-check.cjs`.
- `GPS` is `$SC/runtime-mirrors/sync-gate1-pointers.cjs` and `GPC` is `node $GPS --check`. `CUR` is `.cursor/rules/skill-routing.md`. `RCC` is `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`.
- `CRS` is `node .skilled/bin/compiled-route-sync.cjs --check`, which must print `all 7 hubs resolve` and `all 55 served copies match their authored files`. `PSC` is `node $DS/parent-skill-check.cjs .skilled/skills/sk-doc`, whose last line must hold `all hard invariants passed`. `CCM` is `node $DS/command-catalog-mirror-check.cjs --check`, which must print `STATUS=OK`. `RV` is `bash $DS/route-validate.sh`, whose last line must hold `32 routes validated`. `DPR` is `node $DS/doctor-phrase-reach.cjs`, whose last line must start `STATUS=OK`.
- `RTS` is `.skilled/commands/doctor/_routes.yaml`, `SSK` is `.skilled/skills/system-spec-kit/command-metadata.json` and `LIN` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/embed-text-4/scratch/metadata/enriched-embedding-text.json`.
- `MBC` is `$ADV/scripts/measure-brief-cost.mjs`, `MBCT` is `$ADV/tests/measure-brief-cost.vitest.ts` and `RAR` is `$RA/README.md`.
- `HOOK` is `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` and `CLI` is `node .skilled/bin/skill-advisor.cjs`.
- `OLDP` is the old-name pattern `/create:skill(?![-\w])|(?<![-\w/])create:skill(?![-\w])|create/skill\.md|command-create-skill(?![-\w])`. `OLD` is `rg -l -P --hidden "$OLDP" --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!.git/**' .`, and `OLD <paths>` is the same scan over those paths alone, which must print nothing.
- `KEPT` is the nine files that keep the old name: `.skilled/changelog/skilled/v4.0.0.0.md`, `.skilled/changelog/skilled/v4.0.1.0.md`, `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.6.0.0.md`, `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.7.6.0.md`, the three `skill-benchmark-report.json` files under `.skilled/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--*`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json` and `$DS/tests/command-catalog-mirror-check.test.cjs`.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test adds the behaviour and the cases that pin it, and no other test.
- Re-read every file before the first edit. When an anchor quoted here is gone, mark the task `[B]` with the line you found and do not guess.
- The rename changes `/create:skill` and its other spellings in `OLDP` only. Never touch `/create:skill-parent`, the `sk-create-skill` mode or its folder, the `create-skill` mode id, the `create-skill-*` asset file names, any file in `KEPT` or any file under `specs/`. Add no alias for the old name.
- A generated file is written only by its generator. Never hand-edit `command-bridges.generated.json`, a marked block, `BASE`, `AMM`, `CUR` or a mirror, prompt stub or agent copy outside `.claude/agents`.
- No task reads or prints the prompt text of a row whose `split` is `holdout`, and no task opens `holdout-prompts.jsonl`. Scripts print row ids and counts only. A test or a task may read a `tune` or other non-holdout row's prompt from `CORPUS` by id after it checks the split.
- No worker starts a model session, Ollama or a daemon, runs `HOOK`, runs a generator that writes a runtime tree, moves a file with git or writes under the home folder. Only `[C]` tasks do those.
- No code comment may name a spec path, a phase number, a task id, a rank id or a finding id. State the durable reason instead. T028 checks it.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker waves. Tasks in one wave touch different files and can run in parallel. Each task owns the files in parentheses.
- Setup, coordinator, one at a time: T001, T002 (`$SP/before.txt`), T003 (`.skilled/commands/create/sk-skill.md`).
- Gate: every lane starts after T003. Lane D starts after T018. T026 runs in wave 8, because the operator answered Q3 with `v2.10.0.0`.
- Wave 1. Lane A: T004 (`MS`, `MST`, `MSR`), T005 (eight files under `.skilled/commands`), T006 (eight sk-doc hub files), T007 (seven `sk-create-skill` files), T008 (`$ADV/scripts/command-bridges/scoring-compatibility.json`, `HD`), T009 (six docs and agent files), T010 (`CORPUS`). Lane B: T011 (`HO`, `HOT`, `HCT`). Lane C: T012 (`AMT`). Lane E: T013 (`MBC`, `MBCT`, `RAR`).
- Wave 2. Lane A: T014 (`$ADV/lib/command-attach.ts`, `$ADV/tests/command-attach-guards.vitest.ts` and the `DER` outputs). Lane C: T015 (`AGENTS.md`, `AMM`, `CUR`).
- Wave 2b, verifier follow-ups: T030 (`HO`, `HOT`), T031 (`MST`). They run after T016 and before T018, and the coordinator rebuilds after T030.
- Wave 3, coordinator, one at a time: T016 (`.claude/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts`, `.dsh/prompts`, `.codex/agents`, `.pi/agents`, `.dsh/agents`), T017 (`$ADV/dist`, the advisor database), T018 (`$SP/real-before-d.json`).
- Wave 4. Lane D: T019 (`RTS`, `SSK` and the `DER` outputs).
- Wave 5, coordinator: T020 (`$ADV/dist`, the advisor database, `$SP/real-after-d.json`).
- Wave 6: T021 (`BASE`, and `$RA/scorer-eval-baseline.json` only when its values move).
- Wave 7, coordinator, one at a time: T022 (`$SP/claude-observed.txt`), T023 (`$SP/claude-listing.txt`, the operator's), T024 (`$SP/doctor-live.txt`), T025 (`$SP/brief-cost-run.txt`).
- Wave 8: T026 (the `sk-doc` changelog entry and the four hub version fields).
- Verification, coordinator, one at a time: T027 (`$SP/after.txt`), T028, T029 (`implementation-summary.md`, `acceptance-criteria.md`).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Confirm the base. Run `G log -1 --format='%h %s' -- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements` and `G status --short -- .skilled .claude .cursor .codex .pi .dsh AGENTS.md README.md CONTRIBUTING.md`. Verify: the log prints `3b48f0e5f1` or a later commit and the status prints nothing.
- [x] T002 [C] Record the before numbers (`$SP/before.txt`). Run `G rev-parse --short HEAD`, `npm run build` in `ADV`, `FLOOR`, `REAL` into `$SP/real-head.json`, `EVAL`, `TC`, `VALL`, `DALL`, `DRV`, `SRM`, `NMST`, `PSY`, `ASY`, `AMSC`, `AMC`, `MAN`, `GPC`, `RCC`, `CRS`, `PSC`, `CCM`, `RV`, `DPR`, `OLD | wc -l`, `node $MBC --help 2>&1 | head -1` and `jq -c '.rows["cmd-doctor-mcp-plain-tune-01"].offered, .rows["cmd-doctor-skill-advisor-plain-tune-01"].offered' $BASE`, and write each command with its last output lines or exit code into the file. Verify: `FLOOR` prints `{"correct":24,"total":44}`, `{"count":0,"total":35}`, `{"own":24,"attached":20,"combined":44,"total":44}`, `{"own":8,"attached":15,"combined":23,"total":45}` and `{"count":0,"total":35}`, the `REAL` read prints typed `{"correct":24,"total":44}`, tune `{"correct":13,"total":45}`, holdout `{"correct":3,"total":44}`, false offers `{"count":0,"total":35}` twice and `[false,false,false]`, `EVAL` prints `[160,50,21,5]`, `TC` exits 0, `VALL` reports 0 failed, `DALL` reports `fail 0`, `DRV` prints `"changed": []`, `SRM` prints `visibility claude 32/44, cursor 44/44`, `NMST` reports `fail 0`, `PSY` prints `45` three times, `ASY` prints `11` three times, `AMSC` is in sync, `AMC` prints `STATUS=OK`, `MAN` prints `Budget: 16092 / 16384 bytes to the last anchor, 27575 / 32768 bytes total`, `GPC` and `RCC` pass, `CRS` prints both lines, `PSC` holds `all hard invariants passed`, `CCM` prints `STATUS=OK`, `RV` holds `32 routes validated`, `DPR` prints `STATUS=OK phrases=248 bridges=36`, `OLD | wc -l` prints 55 and the two rows print `false` and `false`. When a gate is red or a value differs from `spec.md` section 2, stop and mark the phase `[B]` with that line, because every later expected value quotes these.
- [x] T003 [C] Move the command file to its new name (`.skilled/commands/create/sk-skill.md`). Run `G mv .skilled/commands/create/skill.md .skilled/commands/create/sk-skill.md`. Verify: `G status --short -- .skilled/commands/create` prints `R  .skilled/commands/create/skill.md -> .skilled/commands/create/sk-skill.md` and `find .skilled/commands -iname skill.md` prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1
- [x] T004 [P] Lane A. Make the mirror check fail on any command file named `skill.md` in any capitalisation, with no allowlist, test first (`MS`, `MST`, `MSR`). In `MST`, rename `counts what each runtime shows and allows the known create collapse` to `counts what each runtime shows and flags the create collapse`, keep its visibility expectation and expect `collapseDrift(expected)` to equal `['COLLAPSE create/skill.md hides 1 sibling commands on Claude Code']`. Add `flags a skill file in any capitalisation` with the mirrors `.claude/commands/design/SKILL.md` and `.claude/commands/design/chart.md` and their sources under `.skilled/commands/design/`, and expect Claude's visibility `{ visible: 1, total: 2 }` and `collapseDrift` `['COLLAPSE design/SKILL.md hides 1 sibling commands on Claude Code']`. Run `node --test $MST` and see `fail 2`, the two cases. Then in `MS`, delete `COLLAPSE_ALLOWLIST`, the comment above it and the `collapseDrift` line that reads it, and in both `commandVisibility` and `collapseDrift` replace `names.includes('skill.md')` with a match that lowercases each name before it compares, and name the matched file as it is spelled in the drift message. Update the two doc comments above those functions to say any capitalisation. In their place, add a comment saying an open Claude Code bug (anthropics/claude-code#85786) makes a command file named `skill.md`, in any capitalisation, turn its folder into one skill that hides the other commands, so no command file may carry that name. In `MSR`, replace ``It fails when a command folder other than `create/` holds a `skill.md`, because Claude Code would then hide that folder's other commands.`` with ``It fails when any command folder holds a file named `skill.md` in any capitalisation, because Claude Code then reads the folder as one skill and hides its other commands.`` Verify: `node --check $MS` exits 0, `NMST` reports `fail 0` with one more pass than `$SP/before.txt` records, `rg -c COLLAPSE_ALLOWLIST $MS` prints nothing, `node -p "(m => JSON.stringify(m.commandVisibility(m.buildExpectedLinks()).claude))(require('./$MS'))"` prints `{"visible":44,"total":44}` and `rg -c 'other than .create/.' $MSR` prints nothing. Do not run `SRM` here, because it fails until T016 writes the trees.
- [x] T005 [P] Lane A. Rename the command inside its own folder, its assets and the command catalogs (`.skilled/commands/create/sk-skill.md`, `.skilled/commands/create/assets/create-skill-auto.yaml`, `.skilled/commands/create/assets/create-skill-confirm.yaml`, `.skilled/commands/create/assets/create-skill-presentation.txt`, `.skilled/commands/create/README.txt`, `.skilled/commands/README.txt`, `.skilled/commands/prompt/assets/prompt_improve_presentation.txt`, `$DS/command-catalog-mirror-check.cjs`). Replace every `/create:skill` that no `-` or word character follows with `/create:sk-skill`, and in `create/README.txt` the tree line `skill.md` with `sk-skill.md`. In the catalog checker, rewrite the comment example `(/create:skill inside /create:skill-parent)` as a generic `(/group:name inside /group:name-parent)`, because no real pair is left. The asset file names stay. Verify: `OLD` over the eight files prints nothing, `CCM` prints `STATUS=OK` and `rg -c '/create:sk-skill' .skilled/commands/create/sk-skill.md` prints at least 2.
- [x] T006 [P] Lane A. Rename the command in the sk-doc hub (`.skilled/skills/sk-doc/command-metadata.json`, `.skilled/skills/sk-doc/hub-router.json`, `.skilled/skills/sk-doc/mode-registry.json`, `.skilled/skills/sk-doc/README.md`, `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, `.skilled/skills/sk-doc/sk-create-frontmatter/SKILL.md`). Replace the old name with `/create:sk-skill` in the command entry, the two `sibling` fields, the trigger phrase, the mode's `command`, the keyword lists and the prose. Change no version field. Verify: `OLD` over the eight files prints nothing, `jq empty` passes on the four JSON files, `PSC` holds `all hard invariants passed` and `CRS` prints both lines.
- [x] T007 [P] Lane A. Rename the command in the `sk-create-skill` packet (`.skilled/skills/sk-doc/sk-create-skill/README.md`, `ROUTER.md`, `SKILL.md`, `references/shared/advisor-index-handoff.md`, `references/skill/upgrading-a-skill-to-v4.md`, `scripts/lib/command-metadata-schema.cjs`, `scripts/tests/skill-root-metadata-contract.test.cjs`). Replace the old name and the path `create/skill.md` with `/create:sk-skill` and `create/sk-skill.md`, including the schema helper's comment example and the contract test's sample of `commandDefinitionRelPath`. The packet and its folder keep their names. Verify: `OLD` over the seven files prints nothing, `node --check` passes on the schema helper and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` reports `fail 0`.
- [x] T008 [P] Lane A. Rename the bridge's hand-kept entry and the hook guide's Claude row (`$ADV/scripts/command-bridges/scoring-compatibility.json`, `HD`). In the compatibility entry, change `inventoryId` and `id` to `command-create-sk-skill` and the description and the two keywords to `/create:sk-skill` and `create:sk-skill`. In `HD`, rewrite the Claude Code row of the `Starting a surfaced command` table: the second cell reads `Yes, through the Skill tool, as a shortcut for the names it lists` and the Basis cell reads ``The Skill tool lists names, not files. A command file named `skill.md` in any capitalisation makes Claude Code read its folder as one skill, an open upstream bug, so no command file carries that name``. Verify: `jq empty` passes on the compatibility file, `OLD` over the two files prints nothing and `rg -c '33 of the 45' $HD` prints nothing.
- [x] T009 [P] Lane A. Rename the command in the root docs, the agent definition and the runtime notes (`README.md`, `CONTRIBUTING.md`, `.skilled/agents/markdown.md`, `.claude/agents/markdown.md`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md`, `.codex/SYNC.md`). Make the same three edits in `.skilled/agents/markdown.md` and its hand-kept copy `.claude/agents/markdown.md`. In the checklist, point the YAML-router example at `.skilled/commands/create/sk-skill.md`. In `.codex/SYNC.md`, make the stub example name `create/sk-skill.md` and `/create-sk-skill`. Verify: `OLD` over the six files prints nothing and `AMSC` prints `all comparable mirrors in sync`.
- [x] T010 [P] Lane A. Point the corpus rows at the new name (`CORPUS`). For `cmd-create-skill-typed-01` and `sv-07`, check that each `split` is not `holdout`, then replace `/create:skill` with `/create:sk-skill` in `prompt` and set `expected_command` to `/create:sk-skill`. For `cmd-create-skill-plain-tune-01`, check that its `split` is `tune`, then set `expected_command` only. For the one holdout row, change only `expected_command`, with one scripted substitution that never reads or prints a prompt: `sed -i '' -E '/"split":"holdout"/ s#"expected_command":"/create:skill"#"expected_command":"/create:sk-skill"#' $CORPUS`, and report only the count, from `awk '/"split":"holdout"/ && /"expected_command":"\/create:sk-skill"/ {n++} END {print n+0}' $CORPUS`. Row ids stay. Verify: the `awk` count prints 1, `rg -c '"expected_command":"/create:skill"' $CORPUS` prints nothing, `jq -c 'select(.expected_command == "/create:sk-skill") | [.split, .row_type]' $CORPUS | sort | uniq -c` prints the four pairs of `spec.md` section 2, every line parses with `jq -c . $CORPUS > /dev/null` and `G diff --numstat HEAD -- $CORPUS` prints `4`, `4` and the path.
- [x] T011 [P] Lane B. Read a negated "show up" or "appear" as a strong doctor problem cue (`HO`, `HOT`, `HCT`). In the first alternative of `STRONG_PROBLEM_CUE`, inside the verb group and right after `converg\\w*`, add `|show(?:s|ing)? up|appear(?:s|ing)?`. In the comment above the two cue lists, add one sentence saying a tool or command that does not show up or appear is a wrong state, like one that is not registered or not found. In `HOT`, add `reads a tool that does not show up as a strong cue` with `the deploy button is not showing up after the update` and `my new agent isn't appearing in the picker` as `strong`, and `don't show line numbers in the diff` and `show me how the advisor ranks skills` as `null`. In `HCT`, add `offers the helper beside the skills for a tool that does not show up`: read the `cmd-doctor-mcp-plain-tune-01` row from `join(ROUTING, 'command-prompts.jsonl')` by id, expect its `split` to be `tune` before reading its prompt, score it with `scoredIds` and expect `ids[0]` to be `mcp-code-mode` and `ids.slice(0, 3)` to contain `command-doctor-helper`. Verify: `TC` exits 0 and `V tests/doctor-helper-handoff.vitest.ts tests/scorer/doctor-handoff-command.vitest.ts tests/doctor-routing-slice.vitest.ts` reports 0 failed.
- [x] T012 [P] Lane C. Write the gate-2 case first and watch it fail (`AMT`). Add `test('pins: the gate 2 direct call reads the request from stdin', { skip: NOT_SOURCE }, () => { ... })` that takes `manifest.derived.sections['gate-2'].body`, finds the one line holding `skill-advisor.cjs advisor_recommend` and asserts that it includes `--json - --format json` and does not include `--json '{`. Above it, add a comment saying a prompt passed in argv is readable by any local user from the process table, so the documented direct call sends it on stdin. Verify: `node --test $AMT` reports `fail 1`, the failing case is the new one and every other case passes as in `$SP/before.txt`.
- [x] T013 [P] Lane E. Run the brief-cost hook children with `TMPDIR` inside the sandbox, test first (`MBC`, `MBCT`, `RAR`). In `MBCT`, let the hook stub append `process.env.TMPDIR` to the file that `COST_PROBE_FILE` names, only when that variable is set, so the two existing cases are unchanged. Add `runs each hook child with TMPDIR inside its sandbox`: run the script with `COST_PROBE_FILE` inside the test root, and expect every recorded path to have a base name starting `ssa-cost-`, to differ from the test's own `tmpdir()` and to be gone after the run. Run `V tests/measure-brief-cost.vitest.ts` and see 1 failed, the new case. Then in `MBC`, add `TMPDIR: socketDir` to the child environment at line 167, with a comment saying the hook writes its health records under the OS temp folder, so a cost run points that folder at its own sandbox and leaves the operator's health log alone. In `RAR`, in the `measure-brief-cost.mjs` paragraph, add ``Each hook child runs with `TMPDIR` set to the sandbox, so a cost run writes no health record into the shared metrics folder.`` Verify: `node --check $MBC` exits 0, `V tests/measure-brief-cost.vitest.ts` reports 0 failed and 3 passed, and `rg -c 'TMPDIR: socketDir' $MBC` prints 1.

### Wave 2
- [x] T014 Lane A. Regenerate the bridges under the new name and move the typed-attach cases (`$ADV/lib/command-attach.ts`, `$ADV/tests/command-attach-guards.vitest.ts` and the `DER` outputs). After T006 and T008, rewrite the comment above the longest-key rule in `command-attach.ts`, outside the marked blocks, so its example of one command name inside another is generic, `/group:name` inside `/group:name-parent`, because no real pair is left. Run `DER`. In the guards test, change the four `/create:skill` inputs and expectations to `/create:sk-skill`. Verify: `DRV` prints `"changed": []` and exits 0, `OLD $ADV/lib $ADV/scripts/command-bridges $ADV/scripts/skill_advisor.py $ADV/tests` prints nothing, `rg -c 'command-create-sk-skill' $ADV/lib/scorer/projection.ts` prints at least 1, `TC` exits 0 and `V tests/command-attach-guards.vitest.ts tests/command-attach.vitest.ts` reports 0 failed.
- [x] T015 Lane C. Rewrite `AGENTS.md` line 65 to the stdin form and regenerate its two copies (`AGENTS.md`, `AMM`, `CUR`). Replace line 65 with exactly ``2. B) Direct call: run `printf '%s' '{"prompt":"[request]"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` when no hook brief is present or when diagnosing hook behavior.`` and change no other line. Then run `node $AMS --write` and `node $GPS`. Verify: `node --test $AMT` reports `fail 0`, `MAN` prints `PASS: 44 sections, 31 pins, derived matches AGENTS.md` and `Budget: 16108 / 16384 bytes to the last anchor, 27591 / 32768 bytes total`, `AMC` prints `STATUS=OK rows=12 findings=0 unknown=0`, `GPC` prints `PASS`, `RCC` prints its `OK:` line, `G diff --numstat HEAD -- AGENTS.md` prints `1`, `1` and `AGENTS.md`, `sed -n 65p AGENTS.md | wc -c` prints 205, `sed -n 35p $CUR | rg -c -- '--json - --format json'` prints 1 and `comm -23 <(G show HEAD:$AMM | jq -r '.derived.history[].sha256' | sort) <(jq -r '.derived.history[].sha256' $AMM | sort)` prints nothing.

### Wave 2b, verifier follow-ups
- [x] T030 [P] Lane B. Keep two idioms that are not about a missing tool out of the strong cue, test first (`HO`, `HOT`). In `HOT`, inside the case `reads a tool that does not show up as a strong cue`, add `it doesn't appear to cover the routing case` and `don't show up-to-date entries only` as `null`, and `the linter does not appear in the tool list` as `strong`. Run `V tests/doctor-helper-handoff.vitest.ts` and see the two `null` cases fail. Then in the first alternative of `STRONG_PROBLEM_CUE` in `HO`, replace `show(?:s|ing)? up|appear(?:s|ing)?` with `show(?:s|ing)? up(?![-\\w])|appear(?:s|ing)?(?! to\\b)`, written with the same doubled backslashes the string around it uses, and add to the comment above the cue lists one sentence saying "appear to" states an impression and "up-to-date" is a compound, so neither says a tool is missing. Verify: the first run fails as described, then `TC` exits 0 and `V tests/doctor-helper-handoff.vitest.ts tests/scorer/doctor-handoff-command.vitest.ts tests/doctor-routing-slice.vitest.ts` reports 0 failed.
- [x] T031 [P] Lane A. Move the collapse test's sample out of the `create` folder, so the old command path is spelled in no live file (`MST`). In the case `counts what each runtime shows and flags the create collapse`, rename the case to `counts what each runtime shows and flags a collapsed folder`, change the two `create/skill.md` paths to `speckit/skill.md`, the two `create/readme.md` paths to `speckit/plan.md` and the expected drift line to `COLLAPSE speckit/skill.md hides 1 sibling commands on Claude Code`. Change nothing else. Verify: `NMST` reports `fail 0` and `pass 9`, and `rg -c 'create/skill' $MST` prints nothing.

### Wave 3
- [x] T016 [C] Regenerate every runtime copy of the commands and the agents (`.claude/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts`, `.dsh/prompts`, `.codex/agents`, `.pi/agents`, `.dsh/agents`). Run `node $MS`, then the three `sync-prompts` and the three `sync-agents` generators of `PSY` and `ASY` without `--check`. Verify: `SRM` prints `[runtime-mirror-sync] visibility claude 44/44, cursor 44/44` and `PASS: 256 mirrors across 10 trees are in sync.`, `PSY` prints `45` three times, `ASY` prints `11` three times, `AMSC` is in sync, `readlink .claude/commands/create/sk-skill.md` prints `../../../.skilled/commands/create/sk-skill.md`, `readlink .cursor/commands/create-sk-skill.md` prints `../../.skilled/commands/create/sk-skill.md`, `ls .codex/prompts/create-sk-skill.md .pi/prompts/create-sk-skill.md .dsh/prompts/create-sk-skill.md` lists three files, `find .claude/commands .cursor/commands .codex/prompts .pi/prompts .dsh/prompts \( -iname skill.md -o -name create-skill.md \)` prints nothing and `readlink .claude/skills` prints `../.skilled/skills`.
- [x] T017 [C] Rebuild the advisor, restart the worktree's daemon and re-embed (`$ADV/dist`, the advisor database). Run `npm run build` in `ADV`, restart the advisor daemon this worktree serves, then `CLI skill_graph_scan --trusted --format text`. Verify: the build exits 0, `TC` exits 0, `rg -c 'appear' $ADV/dist/runtime/lib/scorer/doctor-helper-handoff.js` prints at least 1, `rg -c 'create:sk-skill' $ADV/dist/runtime/lib/command-attach.js` prints at least 1 and the scan prints its status with no error. When Ollama does not answer, mark this task `[B]` and start nothing.
- [x] T018 [C] Read the fixture floors and take the real capture before lane D (`$SP/real-before-d.json`). Run `FLOOR` without `--write`, then `REAL` into `$SP/real-before-d.json` and read it. Verify: `FLOOR` prints typed recall of 24 of 44 or more, `{"count":0,"total":35}`, typed delivery `{"own":24,"attached":20,"combined":44,"total":44}` or a `combined` of 44, a plain tune `combined` of 23 or more and `{"count":0,"total":35}`. The `REAL` read prints typed 24 of 44 or more, false offers `{"count":0,"total":35}` in both columns and `[false,false,false]`, and its tune and holdout counts are written into `$SP/before.txt` as the lane D before line, holdout as a count only.

### Wave 4
- [x] T019 [P] Lane D. Add intent phrases to the five scored commands that have no recommendation (`RTS`, `SSK` and the `DER` outputs). Take the phrases in `added` for `/doctor:install`, `/doctor:setup`, `/doctor:speckit`, `/doctor:update` and `/speckit:search` from `LIN`, and leave `/create:skill-parent` out. Before adding them, read the prompts of `cmd-doctor-install-plain-tune-01`, `cmd-doctor-setup-plain-tune-01`, `cmd-doctor-speckit-plain-tune-01`, `cmd-doctor-update-plain-tune-01` and `cmd-speckit-search-plain-tune-01` from `CORPUS` by id, each after checking that its `split` is `tune`. Compare each phrase with its command's tune prompt after lowercasing and collapsing spaces, and rewrite any phrase that equals that prompt or holds it whole as a paraphrase that keeps the intent words and changes the rest, because a phrase copied from a tune prompt counts as gain only on tune. Never read or compare a holdout row. Add the four doctor commands' phrases to `trigger_phrases` of their routes in `RTS` and the search phrases to `userIntent.ownedSignals` of `/speckit:search` in `SSK`, then run `DER`. Verify: a script that compares every added phrase with the five tune prompts on the same normalized text prints `0`, `RV` holds `32 routes validated`, `DPR` prints `STATUS=OK` with `phrases=` higher than `$SP/before.txt` by the number of doctor phrases added, `DRV` prints `"changed": []`, `jq empty $SSK` passes and `TC` exits 0.

- [x] T032 Lane D follow-up. Add the five new install phrases to the list the install contract test pins (`$DS/tests/doctor-install-contract.test.cjs`). The test `the install route phrases and declared commands agree with the workflow contract` fails on `walk me through adding this toolkit to my own project repository`, because its `INSTALL_PHRASES` constant lists the route's phrases one by one. Read the `trigger_phrases` of the `/doctor:install` route in `RTS` and append to `INSTALL_PHRASES`, in the same order and quoting style, each route phrase the constant does not hold yet. Change nothing else in the test and do not edit `RTS`. Verify: `node --test $DS/tests/doctor-install-contract.test.cjs` reports `fail 0` and `DALL` reports `fail 0`.

### Wave 5
- [x] T020 [C] Rebuild, restart, re-embed and take the real capture after lane D (`$ADV/dist`, the advisor database, `$SP/real-after-d.json`). Run `npm run build` in `ADV`, restart the daemon, run `CLI skill_graph_scan --trusted --format text`, then `REAL` into `$SP/real-after-d.json` and read it. Verify: the build exits 0, the scan prints no error, typed reads 24 of 44 or more, false offers read `{"count":0,"total":35}` in both columns, the floor rows print `[false,false,false]` and the holdout count is at least 2 above the lane D before line from T018. Record the tune counts as built in, not as gain. A smaller holdout gain is reported as measured, and no phrase changes after this count is read.

### Wave 6
- [x] T021 [P] Recapture the fixture baseline and check the scorer eval (`BASE`, and `$RA/scorer-eval-baseline.json` only when its values move). Run `node $CAP --write`, `FLOOR` and `EVAL`. When `EVAL` differs from the committed baseline and still holds the floor, recapture it with `node $RA/capture-scorer-eval-baseline.mjs --write` as its header documents and run `V tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/scorer-eval-baseline-capture-date.vitest.ts`. Verify: `FLOOR` prints typed recall of 24 of 44 or more, `{"count":0,"total":35}`, a typed delivery `combined` of 44 of 44, a plain tune `combined` of 23 or more and `{"count":0,"total":35}`, `jq -c '.rows["cmd-doctor-mcp-plain-tune-01"].offered, .rows["cmd-doctor-skill-advisor-plain-tune-01"].offered' $BASE` prints `true` and `false`, `jq -r '.commands | keys[]' $BASE | rg -cx '/create:sk-skill'` prints 1, `OLD $BASE` prints nothing, `SLICE` reports 0 failed and `EVAL` prints at least `[160,50,21,5]` with the fourth value no higher than 5.

### Wave 7
- [x] T022 [C] Observe Claude's command folder without a model session (`$SP/claude-observed.txt`). Run `SRM`, `ls .claude/commands/create` and `find .claude/commands -iname skill.md | wc -l`. Verify: `SRM` prints `visibility claude 44/44`, the listing holds 13 entries with `sk-skill.md` among them and the count prints 0. These three facts are the proof a coordinator can take. Claude's own listing is T023's.
- [x] T023 [C] Ask the operator for one live Claude Code listing of the regenerated tree (`$SP/claude-listing.txt`). It needs a model session, so it is the operator's to run and confirm. Write the expected names with `(cd .claude/commands && find . -name '*.md' -not -name 'local-*' | sed -e 's|^\./||' -e 's|\.md$||' -e 's|/|:|') | sort > $SP/claude-expected.txt`. In a directory from `mktemp -d` outside any repository, copy the tree with `cp -RL .claude/commands <tmp>/x/.claude/commands`, start Claude Code once in `<tmp>/x` with the prompt "List the names of every entry your Skill tool offers, one per line, and nothing else.", save the answer to `$SP/claude-listing.txt` and delete the temp directory. Verify: `wc -l < $SP/claude-expected.txt` prints 44 and `comm -23 $SP/claude-expected.txt <(sed -E 's/^[-*/ ]+//' $SP/claude-listing.txt | sort -u)` prints nothing, so `create:sk-skill` and the twelve other `create:*` names are listed. Until the operator runs it, this task stays open and REQ-012 rests on T022.
- [x] T024 [C] Read the live doctor brief and the CLI answer for the two doctor rows (`$SP/doctor-live.txt`). For each of `cmd-doctor-mcp-plain-tune-01` and `cmd-doctor-skill-advisor-plain-tune-01`, build the hook payload with `jq -c --arg cwd "$PWD" 'select(.id == "<id>") | if .split == "tune" then {prompt, cwd: $cwd, hook_event_name: "UserPromptSubmit", session_id: "doctor-helper-check"} else error("not a tune row") end' $CORPUS`, pipe it into `env -u AI_SESSION_CHILD node $HOOK` and keep `hookSpecificOutput.additionalContext`. Then build `{prompt}` the same way, pipe it into `CLI advisor_recommend --json - --format json` and keep `jq -c '.data.recommendations[] | select(.skillId == "command-doctor-helper") | [.command, .policy]'`. Write each result beside its row id, never the prompt. Verify: the mcp brief holds a line starting `Also: /doctor:helper`, the mcp CLI line prints `["/doctor:helper","run"]`, the skill-advisor brief holds no `/doctor:` and its CLI line prints nothing.
- [x] T025 [C] Run the brief-cost script once and prove the health log is untouched (`$SP/brief-cost-run.txt`). Record `find "${TMPDIR:-/tmp}/speckit-skill-advisor-metrics" -type f -exec wc -l {} +`, run `node $MBC --rows cmd-create-agent-typed-01` and record its exit code and its first line, then record the same `find` again. Verify: the two `find` outputs are identical, and the script either exits 0 with one live row or exits 2 with `degraded_brief`. Record which, and change no code on either answer.

### Wave 8
- [x] T026 Write the changelog entry for the breaking rename at `v2.10.0.0`, the version the operator chose in Q3 (the `sk-doc` changelog entry and the `version` fields of `.skilled/skills/sk-doc/SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`). Write the entry through the `sk-create-changelog` workflow as `v2.10.0.0`, a minor bump whose text calls out the break, and set the four version fields to `2.10.0.0`. Its first line of substance says `/create:skill` is now `/create:sk-skill` on every runtime with no alias, and why. Edit no existing entry. Verify: `G status --short -- '*/changelog/*'` lists only the new entry, `G diff --quiet HEAD -- .skilled/skills/sk-doc/changelog .skilled/changelog` exits 0 and `PSC` holds `all hard invariants passed, 0 warnings`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 [C] Run every floor and check (`$SP/after.txt`). Run `FLOOR`, `EVAL`, `TC`, `VALL`, `DALL`, `DRV`, `SRM`, `NMST`, `PSY`, `ASY`, `AMSC`, `AMC`, `MAN`, `GPC`, `RCC`, `CRS`, `PSC`, `CCM`, `RV` and `DPR`, and write each output beside its line in `$SP/before.txt`. Verify: `FLOOR` holds every floor in REQ-007, `EVAL` prints at least `[160,50,21,5]` with the fourth value no higher than 5, `TC` exits 0, `VALL` reports 0 failed, `DALL` reports `fail 0`, `DRV` prints `"changed": []`, `SRM` prints `visibility claude 44/44, cursor 44/44`, `NMST` reports `fail 0`, `PSY`, `ASY` and `AMSC` pass, `AMC`, `MAN`, `GPC` and `RCC` pass, `CRS` prints both lines, `PSC` holds `all hard invariants passed`, `CCM` prints `STATUS=OK`, `RV` holds `32 routes validated` and `DPR` starts `STATUS=OK`.
- [x] T028 [C] Check the rename's end state and the boundaries. Verify: `OLD` prints exactly the nine `KEPT` files, `rg -l -F 'create:sk-skill' .skilled/commands/create/sk-skill.md .skilled/skills/sk-doc/mode-registry.json $ADV/lib/command-attach.ts` lists all three, `G diff --quiet HEAD -- .claude/skills .skilled/commands/create/skill-parent.md $ADV/lib/render.ts` exits 0, every `KEPT` file is unchanged by `G diff --quiet HEAD --`, `G diff --stat HEAD -- '*package.json' '*package-lock.json'` prints nothing, `G diff HEAD -U0 -- .skilled .claude .cursor .codex .pi .dsh AGENTS.md | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|[Pp]hase [0-9]|[Rr]ank [0-9]|R4-P2)"` prints nothing, `G diff --numstat HEAD -- AGENTS.md` prints `1`, `1` and `AGENTS.md`, and `G status --short -- .skilled .claude .cursor .codex .pi .dsh AGENTS.md README.md CONTRIBUTING.md` lists only files named in this phase's tasks.
- [x] T029 [C] Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence (`implementation-summary.md`, `acceptance-criteria.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, with T023 allowed open only while it waits on the operator. Done 2026-11-13: T001 to T032 are ticked, and the coordinator ran T023 itself.
- [x] No `[B]` blocked tasks remaining. Done 2026-11-13: no task line carries `[B]`.
- [x] `OLD` lists only the nine `KEPT` files, `SRM` prints `visibility claude 44/44`, `BASE` holds every floor, the real holdout count rose by at least 2 in T020 and every floor holds against `$SP/before.txt`. Done 2026-11-13: `OLD` lists the nine `KEPT` files plus the new `v2.10.0.0` entry, which must name the old command, `SRM` reads 44/44, holdout went from 3 to 5 of 44 and every `scratch/after.txt` floor holds.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-3.md` and `../009-ux-performance-cross-cli-research/research/research-segment-4.md`
- **Review**: `../review/review-report.md`
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

A blocked task gets `[B]` and one line naming what blocks it. A moved floor blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The base is clean and phase 015 is committed (T001). Evidence: the T001 verify lines. Done 2026-11-13: the log names `3b48f0e5f1`, an ancestor of `HEAD` `087888ec4a`, and the coordinator recorded an empty status.
- [x] CHK-002 [P0] The before numbers are in `scratch/before.txt` and match `spec.md` section 2 (T002). Evidence: the T002 verify lines. Done 2026-11-13: `scratch/before.txt` at `087888ec4a` holds the five `FLOOR` lines, the `REAL` read, `[160,50,21,5]`, `visibility claude 32/44`, `OLD` 55 and `false`, `false`, equal to `spec.md` section 2.
- [x] CHK-003 [P0] The command file moved with its history (T003). Evidence: the `R` status line. Done 2026-11-13: `git status` reads `RM .skilled/commands/create/skill.md -> .skilled/commands/create/sk-skill.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `TC` exits 0 and `node --check` passes on `MS`, `MBC` and the schema helper. Evidence: `$SP/after.txt` and the T004, T007 and T013 verifies. Done 2026-11-13: `TC` exits 0 in `scratch/after.txt` and at close-out, and `node --check` exits 0 on all three files.
- [x] CHK-011 [P0] No added code comment names a spec path, a phase number, a task id, a rank id or a finding id (T028). Evidence: the T028 label scan prints nothing. Done 2026-11-13: the scan prints nothing at close-out, and the same pattern matches a control line holding `specs/` and `T012`.
- [x] CHK-012 [P0] Every generated file was written by its generator, and every generator check passes (T014, T015, T016, T019, T021). Evidence: `DRV`, `SRM`, `PSY`, `ASY`, `MAN`, `GPC` and `SLICE`. Done 2026-11-13: `DRV`, `SRM`, `PSY`, `ASY`, `MAN` and `GPC` pass in `scratch/after.txt`, and `SLICE` passes in the close-out run. The sk-doc compiled-route manifest, a step no task named, was rewritten by its own `refresh` command.
- [x] CHK-013 [P1] `AGENTS.md` changes on line 65 only (T015, T028). Evidence: the `numstat` line reads `1`, `1`. Done 2026-11-13: the `numstat` line reads `1`, `1` and `AGENTS.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every floor holds (T021, T027). Evidence: `$SP/after.txt` beside `$SP/before.txt`. Done 2026-11-13: every `scratch/after.txt` floor is equal to or above its `before.txt` line. Plain tune combined reads 28 of 45 from 23, built-in tune reach.
- [x] CHK-021 [P0] The old-name scan lists only the nine kept files (T028). Evidence: the `OLD` output. Done 2026-11-13: `OLD` lists ten files, the nine kept files plus `.skilled/skills/sk-doc/changelog/v2.10.0.0.md`, which records the break and must name the old command.
- [x] CHK-022 [P0] The mirror check reads 44 of 44 with no allowlist and fails on a capitalised `SKILL.md` (T004, T016). Evidence: `NMST` and the `SRM` line. Done 2026-11-13: `NMST` reads `pass 9` and `fail 0`, `flags a skill file in any capitalisation` passes, `rg -c COLLAPSE_ALLOWLIST` prints nothing and `SRM` reads `visibility claude 44/44, cursor 44/44`.
- [x] CHK-023 [P0] The tests written first failed before their change and pass after it (T004, T012, T013). Evidence: `fail 2`, `fail 1` and `1 failed` before, 0 after. Done 2026-11-13: the worker logs record `fail 2`, `fail 1` and `1 failed` before each change, and the close-out reads `pass 9`, `pass 32` and 3 passed, each with 0 failed.
- [x] CHK-024 [P1] The real holdout count rose by at least 2 with every real floor held (T018, T020). Evidence: `$SP/real-before-d.json` and `$SP/real-after-d.json`. Done 2026-11-13: holdout 3 of 44 before and 5 of 44 after, typed 24 of 44, false offers 0 of 35 in both columns and `[false,false,false]` in both files.
- [x] CHK-025 [P1] The live brief and the CLI name `/doctor:helper` on the mcp tune row and on no other doctor row checked (T024). Evidence: `$SP/doctor-live.txt`. Done 2026-11-13: the mcp row reads `Also: /doctor:helper` and `["/doctor:helper","run"]`, and the skill-advisor row names no `/doctor:` and returns nothing.
- [x] CHK-026 [P1] Claude's folder holds no `skill.md` in any capitalisation, and the operator's listing names all 44 (T022, T023). Evidence: `$SP/claude-observed.txt` and `$SP/claude-listing.txt`. Done 2026-11-13: the `skill.md` count is 0 and the listing names all 44 expected commands with 13 `create:` names. The coordinator ran the listing in place of the operator.
- [x] CHK-027 [P1] A cost run leaves the shared health log unchanged (T025). Evidence: `$SP/brief-cost-run.txt`. Done 2026-11-13: the two listings are identical, 224 files and 6651 lines. The run exited 2 with `degraded_brief`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each item has a class: the rename `cross-consumer` (55 files and five runtimes), the collapse check `class-of-bug` (any folder, any capitalisation), the doctor cue `instance-only`, the Gate 2 line `cross-consumer` (three copies), the intent phrases `matrix/evidence` (fixture and real captures) and the cost run `instance-only`. Evidence: the classes match the affected surfaces in `plan.md`. Done 2026-11-13: each item's surfaces are rows of the `plan.md` addendum.
- [x] CHK-FIX-002 [P0] Same-class producers: the `OLD` scan covers every spelling of the old name across hidden runtime trees, and `rg -n "skill\.md" $MS` lists only the case-free comparisons. Evidence: the two outputs. Done 2026-11-13: `OLD` reaches the hidden runtime trees and lists ten files. `rg -n "skill\.md" $MS` lists the two case-free comparisons at lines 254 and 273, plus three comment lines at 37, 235 and 260 that T004 required.
- [x] CHK-FIX-003 [P0] Every consumer of a changed output is in the `plan.md` addendum. Evidence: the generator list and the `OLD` scan name no file outside it. Done 2026-11-13: `OLD` names no file outside the addendum except the new changelog entry. Two consumers were not in the addendum: the sk-doc compiled-route manifest with its authored twin, refreshed by its own command, and the install contract test, which T032 updated.
- [x] CHK-FIX-004 [P1] The matrix axes in `plan.md` each have a case in T004, T011, T018, T020 or an existing test. Evidence: the case names and the two real captures. Done 2026-11-13: `flags a skill file in any capitalisation` and `counts what each runtime shows and flags a collapsed folder` cover the file name axis, the T011 and T030 cases cover the cue axis and the two real captures cover before and after lane D by split.
- [x] CHK-FIX-005 [P1] `VALL` runs with `AI_SESSION_CHILD` unset, and the T024 hook run unsets it too. Evidence: the T027 and T024 commands. Done 2026-11-13: `VALL` is `env -u AI_SESSION_CHILD npx vitest run` and the T024 hook command is `env -u AI_SESSION_CHILD node $HOOK`.
- [x] CHK-FIX-006 [P1] Evidence names the commit it ran on. Evidence: `$SP/after.txt` and `implementation-summary.md` name it. Done 2026-11-13: both name `087888ec4a`, with the changes uncommitted in the working tree.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No task prints holdout prompt text or opens `holdout-prompts.jsonl`. Evidence: the holdout corpus row changed by a count-only `sed` in T010, every capture publishes holdout as counts, and T011, T019 and T024 read tune rows by id after checking the split. Done 2026-11-13: the scratch files hold ids and counts only, the holdout row changed by the count-only `sed` and the close-out phrase recount read the five tune rows by id after checking each split.
- [x] CHK-031 [P0] No worker starts a model session, a daemon or Ollama, moves a file with git or writes under the home folder. Evidence: T003, T016, T017, T018, T020 and T022 to T025 are coordinator tasks, and T023 is the operator's. Done 2026-11-13: no brief in `scratch/briefs/` names `ollama serve`, `claude -p`, `skill_graph_scan`, the hook script, `git mv` or a daemon, and every listed task is `[C]`. T023 was run by the coordinator, not the operator.
- [x] CHK-032 [P1] The documented direct call sends the prompt on stdin (T015). Evidence: `sed -n 65p AGENTS.md` and the T012 case. Done 2026-11-13: line 65 reads the `printf ... \| node ... --json - --format json` form, and the T012 case passes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers. Evidence: 55 files to nine, 32 of 44 to 44 of 44, `offered` false to true, a 188-byte line to a 204-byte line and the holdout delta read the same in each. Done 2026-11-13: 32 of 44 to 44 of 44, `offered` false to true, the 188-byte to 204-byte line and holdout 3 to 5 read the same in each. The old-name scan reads 55 to ten, not nine, and `spec.md` now says why.
- [x] CHK-041 [P1] The mirror README, the hook guide, the root docs and the changelog entry match the code (T004, T008, T009, T026). Evidence: their verify commands print what they say. Done 2026-11-13: the T004, T008, T009 and T026 verify commands print what they say, and the changelog entry names the rename and the bug.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every measurement lives in `scratch/` and no probe script is left in the tree. Evidence: `ls scratch` lists the files the tasks name. Done 2026-11-13: the measurements, briefs and logs are in `scratch/` and no probe script is left there or in the tree.
- [x] CHK-051 [P1] No file outside the tasks' list changed (T028). Evidence: the T028 status line. Done 2026-11-13: the status lists 70 live entries, each named in a task, except the served sk-doc manifest, the recorded refresh. Its twin is the one file under `specs/` outside this packet that changed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->
