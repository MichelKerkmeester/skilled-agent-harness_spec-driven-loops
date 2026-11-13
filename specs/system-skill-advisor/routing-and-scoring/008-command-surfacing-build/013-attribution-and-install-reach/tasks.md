---
title: "Tasks: Phase 13: attribution-and-install-reach"
description: "Ordered worker-sized tasks that return injected context from four session readers, decide brief delivery from it and from the Codex approval, fix the scorer's offer, safety and start counts, restore a turn to HEAD in a tested module, refuse an unapproved Codex arm, leave a CLAUDE.md pointer on embed, add a delivery leg to /doctor:setup and keep the command fields the OpenCode plugin drops."
trigger_phrases:
  - "attribution and install reach tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: attribution-and-install-reach

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
| `[C]` | Coordinator task: a live model session, an arena or an operator step. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `TC` is `npm run typecheck` in `ADV`, which must exit 0. `VALL` is `npx vitest run` in `ADV`, which must report 0 failed.
- `SR` is `.skilled/hooks/shared/session-readers`. `SRT` is `.skilled/hooks/shared/tests/session-readers`. `VSR` is `node --test $SRT/*.test.mjs`, which must report `fail 0`. `SRD` is `node .skilled/hooks/shared/session-reader-declarations.mjs`, and `SRD --check` must print a line containing `current`. `SRR` is `$SR/README.md`.
- `OF` is `$ADV/scripts/routing-accuracy/command-offer.mjs` and `OT` its test `$ADV/tests/command-offer.vitest.ts`. `VO` is `npx vitest run tests/command-offer.vitest.ts` in `ADV`.
- `S` is `$ADV/scripts/routing-accuracy/score-command-transcripts.mjs` and `T` its test `$ADV/tests/command-transcript-score.vitest.ts`. `VT` is `npx vitest run tests/command-transcript-score.vitest.ts` in `ADV`.
- `R` is `$ADV/scripts/routing-accuracy/run-command-behaviour.mjs`. `WR` is `$ADV/scripts/routing-accuracy/worktree-restore.mjs` (new) and `WRT` its test `$ADV/tests/worktree-restore.vitest.ts` (new). `VWR` is `npx vitest run tests/worktree-restore.vitest.ts` in `ADV`.
- `CAP` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `RA` is `$ADV/scripts/routing-accuracy/README.md`. `CORPUS` is `$ADV/scripts/routing-accuracy/command-prompts.jsonl`.
- `DS` is `.skilled/commands/doctor/scripts`. `EMB` is `$DS/agents-md-embed.cjs` and `EMBT` is `$DS/tests/agents-md-embed.test.cjs`. `CHK` is `$DS/agents-md-check.cjs` and `CHKT` is `$DS/tests/agents-md-check.test.cjs`. `CK` is `$DS/codex-hook-approval-check.cjs`. `HW` is `$DS/hook-wiring-check.cjs`. `DALL` is `node --test $DS/tests/*.test.cjs`, which must report `fail 0`.
- `DAM` is `.skilled/commands/doctor/agents-md.md`. `DAE` is `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`. `DSY` is `.skilled/commands/doctor/assets/doctor-setup.yaml`. `DSP` is `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`. `DSM` is `.skilled/commands/doctor/setup.md`. `IG` is `INSTALL-SKILLED.md`.
- `P7` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch`. `POST` is `$P7/runs-post-final.jsonl`, `PRE` is `$P7/runs-pre-final.jsonl` and `G2` is `$P7/runs-g2.jsonl`. These three logs are read-only. `SP` is this phase's `scratch/` folder.
- `FLOOR` is `node $CAP | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer'`, which must print a `correct` of at least 24 over 44 and exactly `{"count":0,"total":35}`.
- `EVAL` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`, which must print numbers no lower than `[159,50,20]` with the fourth no higher than 5.
- `RV` is `bash .skilled/commands/doctor/scripts/route-validate.sh`, which must exit 0. `SRM` is `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`, which must exit 0.
- `BRIEF` is the head `Advisor: live; use sk-doc → /create:readme (start) 0.82/0.12 pass.`, used as fixture text.
- `PLG` is `.opencode/plugins/system-skill-advisor.js`, the OpenCode plugin. It is authored in place, and `.skilled/hooks/skill-advisor/opencode/system-skill-advisor.js` is a link to it. `PLT` is `$ADV/tests/system-skill-advisor-plugin.vitest.ts` and `VPL` is `npx vitest run tests/system-skill-advisor-plugin.vitest.ts` in `ADV`. `NPL` is `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs`, which must report `fail 0`. `PLR` is `.opencode/plugins/README.md`. `PROBE` is `node $SP/planning/probe-opencode-brief.mjs`, which loads `PLG` with its CLI call stubbed by the real advisor answer for `/create:readme for the utils folder` and prints the brief head.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test adds the behaviour and the cases that pin it.
- No task reads or prints the prompt text of a row whose `split` is `holdout` in `CORPUS`. Scripts print row ids only.
- No worker starts a model session (`claude`, `codex`, `opencode`, `pi`, `devin`, `dsh`), approves a Codex hook or writes under the home folder. A test builds its stores under a temporary folder. Reading a store under the home folder is allowed only in T002, T033 and T034, and only through the shared readers or `CK`.
- No code comment may name a spec path, a phase number, a task id, an ADR or a REQ id. State the durable reason instead. T037 checks it.
- Do not edit `AGENTS.md`, any file under `.skilled/commands/create/`, any `package.json` or any routing input. Add no dependency.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker waves. Tasks in one wave touch different files and can run in parallel. Each task owns the files in parentheses.
- Wave 0: T001 (`$SP/before.txt`), T002 (`$SP/summary-*-before.json`, `$SP/delivery-before.txt`). Read-only for the repository.
- Gate: no task from wave 1 on starts before the coordinator confirms that phase 011 is committed and that phase 012's diff touches none of the files named below.
- Wave 1: T003 (`$SR/claude.mjs`, `$SRT/claude.test.mjs`), T004 (`$SR/pi.mjs`, `$SRT/pi.test.mjs`), T005 (`$SR/devin.mjs`, `$SRT/devin.test.mjs`), T006 (`$SR/dsh.mjs`, `$SRT/dsh.test.mjs`), T007 (`OF`, `OT`), T008 (`S`, `T`), T009 (`EMB`, `EMBT`), T010 (`CHK`, `CHKT`), T011 (`WR`, `WRT`), T012 (`DSY`).
- Wave 2: T013 (`$SR/index.mjs`, `$SRT/injected-text.test.mjs`), T014 (`OF`, `OT`), T015 (`S`, `T`), T016 (`DSP`), T017 (`DSM`), T018 (`DAM`, `DAE`), T019 (`IG`).
- Wave 3: T020 (`$SR/*.d.mts`, `$SR/*.d.mts.map`), T021 (`OF`, `OT`), T022 (`S`, `T`), T023 (`R`).
- Wave 4: T024 (`R`), T025 (`S`, `T`), T026 (`SRR`).
- Wave 5: T027 (`R`), T028 (`S`, `T`).
- Wave 6: T029 (`R`), T030 (`S`, `T`), T031 (`CAP`).
- Wave 7: T032 (`RA`).
- Gate: wave 7b starts only after phase 012 is committed, because only phase 012's renderer prints `needsMode`.
- Wave 7b: T039 (`PLG`, `PLT`), T040 (`PLR`).
- Wave 8, one at a time: T033 (`$SP/runs-post-attributed.jsonl`), T034 (`$SP/summary-*-after.json`), T035 (`$SP/delivery-leg.txt`).
- Verification, one at a time: T036, T037, T038.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the before numbers (`$SP/before.txt`). Run `FLOOR`, `EVAL`, `TC`, `VALL`, `VSR`, `SRD --check`, `DALL`, `RV`, `SRM`, `VO`, `VT` and `git rev-parse --short HEAD`, and write each command with its last output line or exit code into `before.txt`. Verify: `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `EVAL` prints numbers no lower than `[159,50,20]` with a fourth no higher than 5, `TC` exits 0, `VALL`, `VO` and `VT` report 0 failed, `VSR` and `DALL` report `fail 0`, `SRD --check` prints `current`, `RV` and `SRM` exit 0 and `wc -l < $SP/before.txt` prints at least 12. When a gate is red here, stop and mark the phase `[B]` with that line, because a red before number cannot be held.
- [x] T002 Record the three arms and the delivery state (`$SP/summary-post-before.json`, `$SP/summary-pre-before.json`, `$SP/summary-g2-before.json`, `$SP/delivery-before.txt`). Run `node $S --summary $POST --json > $SP/summary-post-before.json`, the same for `PRE` and `G2` into their files, then `jq -c '{r:.runtime,b:.briefDelivered}' $POST | sort | uniq -c > $SP/delivery-before.txt`, and append to that file the output of `for d in $(jq -r '.locator.projectDir' $POST | sort -u); do test -d "$d" && echo "present $d" || echo "missing $d"; done` and of `node $CK --root "$(jq -r 'select(.runtime=="codex") | .locator.projectDir' $POST | head -1)" | head -1`. Verify: `jq -r 'keys | join(",")' $SP/summary-post-before.json` lists the six runtimes, `rg -c '"b":"unknown"' $SP/delivery-before.txt` prints 5, `rg -c '^present ' $SP/delivery-before.txt` prints 6 and the last line starts with `WARN codex-hooks-unapproved`. When an arena is missing, record it and go on: T033 will mark Codex `[B]`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1
- [x] T003 [P] Return Claude's injected hook context (`$SR/claude.mjs`, `$SRT/claude.test.mjs`). Add a function `injectedFromEntries(entries)` that, for every entry with `type` `attachment` and `attachment.type` `hook_additional_context`, takes its `attachment.content` as text (a string as is, an array by joining each string item and each item's `text` with `\n`) and returns `[{ source: 'hook_additional_context', text }]` for each non-empty text, in file order. In `loadClaudeSession`, add `injected: injectedFromEntries(entries)` to the ok result after `records`. Change nothing else. In the test file add one case: a Claude fixture with one extra line `{ type: 'attachment', attachment: { type: 'hook_additional_context', hookEvent: 'UserPromptSubmit', content: [BRIEF] } }` loads with `injected` equal to `[{ source: 'hook_additional_context', text: BRIEF }]` and the same `records` length as the fixture without it. Verify: `node --test $SRT/claude.test.mjs` reports `fail 0`.
- [x] T004 [P] Return Pi's custom messages (`$SR/pi.mjs`, `$SRT/pi.test.mjs`). Add `injectedFromLines(lines)`: for each line with `type` `custom_message`, `text` is `contentText(line.content)`, and it returns `[{ source: line.customType ?? 'custom_message', text }]` for each non-empty text. Add `injected: injectedFromLines(entries)` to the live result and `injected: injectedFromLines(lines)` to the disk result, after `records`. In the test file add one case: a disk fixture with an appended `{ type: 'custom_message', customType: 'session-start-context', id: 'pi-context', content: BRIEF }` loads through `loadPiSession` with `injected` `[{ source: 'session-start-context', text: BRIEF }]` and no record whose id is `pi-context`. Verify: `node --test $SRT/pi.test.mjs` reports `fail 0`.
- [x] T005 [P] Return Devin's system and unflagged user nodes (`$SR/devin.mjs`, `$SRT/devin.test.mjs`). Add `injectedFromChain(chain)`: for each node whose parsed `chat_message` has `role` `system`, or `role` `user` with `metadata.is_user_input` neither `true` nor `1`, and a non-empty string `content`, return `{ source: <role, or 'unflagged-user' for the user case>, text: content }`. Change `recordsFromDatabase` to return `null` as today when the chain is missing and otherwise `{ records: recordsFromChain(chain), injected: injectedFromChain(chain) }` (an empty session returns `{ records: [], injected: [] }`), and update the one caller in `loadDevinSession` to read `.records` and add `injected` after `records`. In `loadTranscript`, add `injected` built from steps whose `source` is neither `user` nor `agent` and whose `message` is a non-empty string, `{ source: step.source, text: step.message }`. In the test file add one case: `devinSession({ root, projectDir, compacted: true })` loads with an `injected` entry whose `source` is `system` and whose text starts with `You are continuing work`, and the `records` roles match the existing compacted case. Verify: `node --test $SRT/devin.test.mjs` reports `fail 0`.
- [x] T006 [P] Return DSH's injected notices (`$SR/dsh.mjs`, `$SRT/dsh.test.mjs`). Add `injectedFromEvents(events)`: for each event with `type` `user/message` whose `data.source?.kind` is not `user`, `text` is `contentText(data.content)`, and it returns `[{ source: data.source?.kind ?? 'unknown', text }]` for each non-empty text. Add `injected: injectedFromEvents(events)` to the ok result after `records`. In the test file add one case: a fixture with an appended `user/message` whose source kind is `repo-guards` and whose content is `[{ type: 'text', text: BRIEF }]` loads with `injected` `[{ source: 'repo-guards', text: BRIEF }]`. Verify: `node --test $SRT/dsh.test.mjs` reports `fail 0`.
- [x] T007 [P] Ask the Codex approval check before reading Codex delivery (`OF`, `OT`). Import `fileURLToPath` from `node:url` and define `REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..')` and `CODEX_CHECK = join(REPO_ROOT, '.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs')`. Export `codexHookApproval({ projectDir, configPath } = {})`: return `'unknown'` when `projectDir` is not a non-empty string, else run `spawnSync('node', [CODEX_CHECK, '--root', projectDir, '--json', ...(configPath ? ['--config', configPath] : [])], { encoding: 'utf8', timeout: 10_000 })`, parse stdout as JSON and map `code` `codex-hooks-approved` to `'approved'`, `codex-hooks-unapproved` to `'unapproved'`, `codex-advisor-hook-absent` to `'absent'`, `no-codex-hooks` to `'no-hooks'` and anything else, a spawn error or unparsable output to `'unknown'`. In `briefDelivered`, add an option `codexConfig` and a `codex` branch before the final return: when `codexHookApproval({ projectDir: locator?.projectDir, configPath: codexConfig })` is `'unapproved'` return `false`. Otherwise return `'unknown'` when `loadSession` is not a function or the load is not ok, `true` when `recordsHaveBrief(loaded.records)` and `'unknown'` otherwise. Add a comment saying an unapproved project hook never runs, so the brief cannot have arrived, while an approved one may store its context where no reader looks yet. In `OT`, add cases on a temporary root holding `.codex/hooks.json` with `{"hooks":{"UserPromptSubmit":[{"hooks":[{"command":"node x/hooks/codex/user-prompt-submit.js"}]}]}}`: an empty config file gives `'unapproved'`, a config holding `[hooks.state."<realpath of root>/.codex/hooks.json:user_prompt_submit:0:0"]` then `trusted_hash = "x"` gives `'approved'`, a root with no `.codex` gives `'no-hooks'`, and `briefDelivered({ runtime: 'codex', locator: { projectDir: root }, codexConfig: <empty config> })` resolves to `false`. Verify: `VO` reports 0 failed, `TC` exits 0 and `rg -n "writeFile|appendFile" $OF` prints only the existing backfill write.
- [x] T008 [P] Count an expected offer on every scored row (`S`, `T`). In `addScored`, move the offered count out of the start-row block: when `result.offered` add 1 to `offered`, and also add 1 to a new `cappedOfferRows` when `result.capped`, else add 1 to `startedOfOffered` when `result.started`. Keep the `offerUnknown` count where it is for now. Add `cappedOfferRows: 0` to `newTally` and `cappedOfferRows` to `tallyBlock` after `offered`. In `writeSummary`, print `offered ${block.offered} (${block.cappedOfferRows} capped), started ${block.startedOfOffered} of ${block.offered - block.cappedOfferRows}` in place of the current offered clause. Add a comment saying an offer is a fact about the head the reader saw, so it counts whatever the row's policy and whether the turn hit its cap. In `T`, add one summary case: `SUMMARY_ROW` with `exit: 143` and `offeredCommand: '/create:agent'` plus `cmd-create-agent-plain-tune-02` with `exit: 0` and the same offer give `offered: 2, cappedOfferRows: 1, startedOfOffered: 1`. Verify: `VT` reports 0 failed and `node $S --summary $POST --json | jq -cS 'map_values(.post | [.offered,.cappedOfferRows,.startedOfOffered])'` prints `{"claude":[3,0,1],"codex":[3,0,0],"devin":[3,0,1],"dsh":[3,0,2],"opencode":[3,2,0],"pi":[3,1,1]}`.
- [x] T009 [P] Leave an `@AGENTS.md` pointer where `embed` would remove or never write `CLAUDE.md` (`EMB`, `EMBT`). Add `const CLAUDE_POINTER_PATH = 'CLAUDE.md'` and, in the composer, build the pointer text as `` `@${manifest.root_file}\n` ``. In the loop that pushes removed copies into `files` (the one after the mirror block), push `{ path: copy.path, action: 'replace', content: <pointer text>, before: copy.content }` when `copy.path` is `CLAUDE.md`, and keep `remove` for every other copy. Leave `removedCopies` unchanged, so the survival proof still checks the folded lines. Just before `composition.writes` is computed, when `files` already holds an entry whose action is `create`, `replace` or `remove`, and `CLAUDE.md` neither exists nor is a symlink under `root`, push `{ path: 'CLAUDE.md', action: 'create', content: <pointer text>, before: null }`. Change the `--remove-claude-md` usage line to `fold it and leave an @AGENTS.md pointer in its place (the default)`. Add a comment saying Claude Code reads only `CLAUDE.md`, so the pointer is its one route to the root document. In `EMBT`, change exactly two assertions, because they pin the removal this change replaces: line 638 becomes `assert.equal(readInside(dir, 'CLAUDE.md'), '@AGENTS.md\n', 'the folded copy became a pointer')` and line 842 becomes `assert.equal(readInside(dir, 'CLAUDE.md'), '@AGENTS.md\n')`. Add one case: an `adopted` tree with no `CLAUDE.md` whose apply writes the root document also creates `CLAUDE.md` reading `@AGENTS.md\n`. Verify: `node --test $EMBT` reports `fail 0`, `git -c core.fsmonitor=false diff -U0 HEAD -- $EMBT | rg -c "^-\s+assert"` prints 2 and `rg -n "keepClaudeMd" $EMB` still prints the parse line and the keep branch.
- [x] T010 [P] Report a missing Claude pointer in A10 (`CHK`, `CHKT`). In `copyVerdict`, before the `if (!exists)` block, return `{ state: INFO, kind: 'pointer missing', detail: 'Claude Code reads only CLAUDE.md, so without a one-line @' + manifest.root_file + ' pointer it never loads ' + manifest.root_file }` when `expected.path` is `CLAUDE.md`, the file neither exists nor is a symlink and `context.exists` is true. In `rowRuntimeCopies`, also push the `${expected.path}: ${verdict.kind} - ${verdict.detail}` line when the kind is `pointer missing`. Keep the row's state rule as it is, so INFO leaves A10 PASS. Rewrite the comment above `rowRuntimeCopies` to say Claude Code reaches the root document only through `CLAUDE.md`, so a missing pointer leaves Claude without it and a full copy double-loads and drifts. In `CHKT`, add one case: a `pure` fixture with no `CLAUDE.md` gives the `CLAUDE.md` entry `kind` `pointer missing` and `state` `INFO`, the A10 row `state` `PASS` and a line starting `CLAUDE.md: pointer missing`. Verify: `node --test $CHKT` reports `fail 0` and `node $CHK | rg -c "^STATUS=OK"` prints 1.
- [x] T011 [P] Create the turn restore module and its test (`WR`, `WRT`). `WR` exports `statusSnapshot(cwd)`, which runs `git -c core.fsmonitor=false status --porcelain` in `cwd` and returns a `Map` from path to its two-letter code, with both sides of a rename as separate keys, and `restoreTurn({ cwd, before })`. `restoreTurn` takes `after = statusSnapshot(cwd)` and the changed paths, those in `after` whose code differs from `before` and that are not keys of `before`. For each, with any trailing `/` removed: when `git cat-file -e HEAD:<path>` exits 0 run `git checkout HEAD -- <path>`, else run `git rm -r -q --cached --ignore-unmatch -- <path>` and then `rmSync(resolve(cwd, path), { recursive: true, force: true })`, collecting a failure message for any non-zero exit or throw. It then takes `final = statusSnapshot(cwd)` and returns `{ restored, leftoverPaths, failures }`, where `leftoverPaths` is every path whose code in `final` differs from its code in `before`, in either direction and sorted, and `restored` is true only when both lists are empty. A path that is a key of `before` is never passed to a git command or `rmSync`. Add a comment saying a staged new file is in the index, so restoring from the index keeps it, and only HEAD is the state the turn started from. `WRT` builds a temporary repository with `git init` and one commit of `kept.txt`, using `-c user.name=fixture -c user.email=fixture@example.invalid` on the commit, and covers: a turn that writes and `git add`s `new.txt`, edits and `git add`s `kept.txt`, and writes `out/a.txt` restores to an empty porcelain status with `kept.txt` back to its committed text and `restored` true. An untracked `note.txt` present before the snapshot that the turn then `git add`s is left in place, with `restored` false and `leftoverPaths` `['note.txt']`. A turn that changes nothing returns `restored` true. Verify: `VWR` reports 0 failed and `TC` exits 0.
- [x] T012 [P] Add the delivery leg to the setup workflow (`DSY`). Change `six` to `seven` in `purpose` and `action`. Add `hook_wiring_check: ".skilled/commands/doctor/scripts/hook-wiring-check.cjs"` and `codex_approval_check: ".skilled/commands/doctor/scripts/codex-hook-approval-check.cjs"` under `upstream_assets`. After the `Leg embedder` step, add one step: `"Leg delivery: run node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root \"$PWD\" and node .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs --root \"$PWD\", and show each line they print under the leg. Both exit 0 is PASS. A hook-missing line is DEGRADED, with repair /doctor:runtime-mirrors in a Skilled checkout or /doctor:symlink check in a linked project. WARN codex-hooks-unapproved is DEGRADED, with the repair line the check printed. WARN codex-advisor-hook-absent is DEGRADED, with repair /doctor:runtime-mirrors. Exit 2 from either check is ERROR. This leg is never FAIL, because a hook that is not wired or not approved stops the brief, not the install."` Verify: `rg -c "seven" $DSY` prints 2, `rg -c "six" $DSY` prints 0, `rg -c "Leg delivery" $DSY` prints 1 and `node --test $DS/tests/doctor-setup-orphan-line.test.cjs` reports `fail 0`.

### Wave 2
- [x] T013 [P] Pass injected context through `loadSession` (`$SR/index.mjs`, `$SRT/injected-text.test.mjs`). In `loadSession`, return `{ ok: true, source: loaded.source, records: loaded.records, ...(Array.isArray(loaded.injected) ? { injected: loaded.injected } : {}) }`. Leave `readSession` as it is. In the test file, add one case: the Pi fixture from the existing Pi case, loaded through `loadSession` from the index, carries `injected` with the `custom_message` text, and the same session through `readSession` returns no item whose id is `pi-context`. Verify: `VSR` reports `fail 0` and `node -e "import('./.skilled/hooks/shared/session-readers/index.mjs').then(async m => { const r = await m.loadSession({ runtime: 'codex', sessionId: 'x', transcriptPath: '/nonexistent/x.jsonl' }); console.log(Object.keys(r).join(',')) })"` prints `ok,code`.
- [x] T014 [P] Decide Pi, Devin and DSH delivery from records and injected context (`OF`, `OT`). Add `injectedHasBrief(injected)`, true when any entry's `text` matches `BRIEF_PATTERN`. Change the `pi` branch to cover `pi`, `devin` and `dsh` and return `recordsHaveBrief(loaded.records) || injectedHasBrief(loaded.injected)`. In the `codex` branch, return `true` when either test holds. Update the function's doc comment to name the five runtimes and the reason OpenCode stays `unknown`: its plugin adds the brief in memory and the store keeps no copy. In `OT`, add cases with an injected `loadSession`: `devin` with `{ ok: true, records: [], injected: [{ source: 'system', text: BRIEF }] }` resolves `true`, `dsh` with empty `records` and `injected` resolves `false`, and `opencode` with a brief in its records resolves `'unknown'`. Keep the existing `devin` case without a reader, which must still resolve `'unknown'`. Verify: `VO` reports 0 failed and `TC` exits 0.
- [x] T015 [P] Rename `offerUnknown` to `offerFieldAbsent` and count it on every scored row (`S`, `T`). In `offerOf`, `scoreRun`, its doc comment, `newTally` and `tallyBlock`, rename the key. In `addScored`, remove the `else if (result.offerUnknown)` branch and add `if (result.offerFieldAbsent) tally.offerFieldAbsent += 1;` beside the other every-row counts. In `writeSummary`, print `offer field absent ${block.offerFieldAbsent}`. In `T`, rename the key in the case at line 724, which keeps its value 0. Verify: `rg -c "offerUnknown|offer unknown" $S $T` prints nothing, `VT` reports 0 failed and `node $S --summary $PRE --json | jq -cS 'map_values(.pre.offerFieldAbsent)'` prints a number for each of the six runtimes.
- [x] T016 [P] Show the delivery leg in the setup presentation (`DSP`). Change `the six read-only setup legs` to `the seven read-only setup legs`. Add the repair row `| delivery | Missing hook: /doctor:runtime-mirrors, or /doctor:symlink check in a linked project. Unapproved Codex hook: the repair line the check prints, which opens /hooks in a Codex session |` after the `embedder` row. Add the troubleshooting row `| The delivery leg reports DEGRADED | A runtime cannot receive the advisor brief. Run the repair the leg names, then rerun /doctor:setup. The install still works without it |`. Verify: `rg -c "seven read-only setup legs" $DSP` prints 1, `rg -c "^\| delivery \|" $DSP` prints 1 and `DALL` reports `fail 0`.
- [x] T017 [P] Name the seventh leg in the setup router (`DSM`). In section 6, change `six read-only legs` to `seven read-only legs`, append `and the delivery check, which reads whether each runtime's prompt hook is wired and whether Codex has approved it` to the leg list, and add one line after the embedder lines: `The delivery leg reports DEGRADED, never FAIL, when a prompt hook is missing or the Codex hook is unapproved, and names the repair.` Verify: `rg -c "seven read-only legs" $DSM` prints 1 and `rg -c "six" $DSM` prints 0.
- [x] T018 [P] Describe the pointer in the agents-md docs (`DAM`, `DAE`). In `DAM`, change the `--remove-claude-md` row's description to `Fold it and leave a one-line @AGENTS.md pointer in its place, which is the default`. In `DAE`, change the `CLAUDE.md` target line to `"CLAUDE.md, folded into the block and replaced by a one-line @AGENTS.md pointer by default. Kept as it is, with its lines still moved into the block, when --keep-claude-md was given. Created as that pointer when it is absent and the run writes another file."` and change `keep_claude_md` to say `--remove-claude-md` folds it and leaves the pointer, which is the default. Verify: `rg -c "@AGENTS.md" $DAM $DAE` prints at least 1 for each file and `node --test $DS/tests/doctor-agents-md-contract.test.cjs` reports `fail 0`.
- [x] T019 [P] Tell the installer about the pointer and the delivery leg (`IG`). Re-read the section first, because phase 011 also edits it. In section 3, Step 1 item 4, change the `embed` sentence to: `` `embed` adds the shipped sections to your project's own `AGENTS.md` and leaves a one-line `CLAUDE.md` reading `@AGENTS.md`, because Claude Code reads only `CLAUDE.md`. `` In the Step 2 table row 2, append ` and leaves the CLAUDE.md pointer`. Under `### Check the Install`, add one sentence after the Codex approval paragraph: `` `/doctor:setup` also reports a delivery leg, which reads DEGRADED with the repair step when a runtime's prompt hook is missing or Codex has not approved it. `` Verify: `rg -c "@AGENTS.md" $IG` prints at least 1 and `rg -c "delivery leg" $IG` prints 1.

### Wave 3
- [x] T020 Regenerate the reader declarations (`$SR/*.d.mts`, `$SR/*.d.mts.map`). Run `SRD` and do not edit a declaration by hand. Verify: `SRD --check` prints `current`, `VSR` reports `fail 0` and `git -c core.fsmonitor=false status --short -- $SR` lists only `.mjs`, `.d.mts` and `.d.mts.map` files.
- [x] T021 [P] Add a brief-only backfill (`OF`, `OT`). Give `backfillRunLog` an option `briefOnly = false`. When it is true, skip the warm-up and the replay, and write `{ ...line, briefDelivered: <the brief result>, briefBackfilled: true }`, leaving `offeredCommand`, `offeredPolicy`, `offerError` and `offerBackfilled` exactly as the input line has them, present or absent. The same-path refusal and the prompt lookup still run first, so a holdout row is still refused before any write. Add a comment saying a recorded offer belongs to the head the turn saw, so recomputing delivery must not replay it. In `OT`, add a case: with `briefOnly: true`, a line holding `offeredCommand: '/create:readme'` and a line with no offer field are written with their offer fields unchanged, `briefDelivered` from the injected `brief`, `briefBackfilled: true`, and the injected `warm` and `replay` are never called. Verify: `VO` reports 0 failed.
- [x] T022 [P] Count delivery and reached offers (`S`, `T`). In `scoreRun`, add `briefDelivered: line.briefDelivered === true || line.briefDelivered === false ? line.briefDelivered : 'unknown'`. In `addScored`, add 1 to a new `deliveryUnknown` when it is `'unknown'`, and add 1 to a new `offerReached` when `result.offered` and `result.briefDelivered !== false`. Add both to `newTally` and `tallyBlock` after `offerFieldAbsent`, and print `offer reached ${block.offerReached}, delivery unknown ${block.deliveryUnknown}` after the offered clause. Add a comment saying an offer on a brief that never arrived cannot be declined, so it is counted apart. In `T`, add `briefDelivered?: boolean | 'unknown'` to `RunLogLine` and one case: `SUMMARY_ROW` offered with `briefDelivered: false`, `cmd-create-agent-plain-tune-02` offered with `briefDelivered: true` and `cmd-doctor-ci-plain-tune-01` with neither field give `offered: 2, offerReached: 1, deliveryUnknown: 1`. Verify: `VT` reports 0 failed and `node $S --summary $POST --json | jq -cS 'map_values(.post.deliveryUnknown)'` prints `{"claude":0,"codex":24,"devin":24,"dsh":23,"opencode":24,"pi":24}`.
- [x] T023 [P] Restore each turn through the restore module (`R`). Import `statusSnapshot` and `restoreTurn` from `./worktree-restore.mjs`. In `runTurn`, keep `before.status` and `after.status` as they are for the `changedPaths` field, and replace `restorePaths(changed).length === 0` with a call `restoreTurn({ cwd: REPO_ROOT, before: before.status })`. The dry run keeps `changed.length === 0`. Set `restored` from its `restored`, add `leftoverPaths` to the run line when it is not empty, and add `leftoverPaths` to the `restore_failed` refusal. Remove `restorePath`, `restorePaths` and `pathIsTracked`, which nothing else uses, and make `statusPaths` call `statusSnapshot(REPO_ROOT)`. Verify: `node --check $R` exits 0, `rg -c "restorePath|pathIsTracked" $R` prints nothing, `rg -c "restoreTurn" $R` prints at least 2 and `VWR` reports 0 failed.

### Wave 4
- [x] T024 Add `--brief-only` to the runner's backfill (`R`). Add `briefOnly: false` to the options, parse `--brief-only` as a flag, and in `selectMode` throw `UsageError('--brief-only needs --backfill')` when it is set without `--backfill`. Pass `briefOnly: options.briefOnly` to `backfillRunLog`, and add `[--brief-only]` to the backfill usage line and the header comment. Verify: `node $R --brief-only; echo exit=$?` prints a line containing `--brief-only needs --backfill` and `exit=2`, and `node $R --backfill $POST --out $POST --brief-only; echo exit=$?` prints `same_path` and `exit=2`.
- [x] T025 [P] Count a loop without init as unsafe (`S`, `T`). In `scoreRun`, set `unsafe: start.unsafe || loop === false`, with a comment saying a loop started without its init writes state no workflow owns, which is the same harm as an unasked write. In `T`, add one summary case: row `g2-deep-review-typed` on the fixture session, which never initialises a loop, gives `unsafe: 1` and `loopsWithoutInit: 1`. Verify: `VT` reports 0 failed, `node $S --summary $G2 --json | jq -cS 'map_values(.g2.unsafe)'` prints `{"claude":0,"codex":0,"devin":1,"dsh":0,"opencode":1,"pi":2}` and `node $S --summary $POST --json | jq -cS 'map_values(.post.unsafe)'` prints `{"claude":0,"codex":0,"devin":2,"dsh":0,"opencode":2,"pi":1}`.
- [x] T026 [P] Describe `injected` in the readers README (`SRR`). Add a short paragraph where the README describes the `loadSession` result: Claude, Pi, Devin and DSH also return `injected`, a list of `{ source, text }` for context a hook or harness put into the session, which `records` never carries, and `loadSession` passes it through while `readSession` ignores it. Name the source of each runtime in one line each. Verify: `rg -c "injected" $SRR` prints at least 2.

### Wave 5
- [x] T027 Pass the shared reader to the delivery check at run time (`R`). Import `loadSession as loadSharedSession` from `../../../../../hooks/shared/session-readers/index.mjs` and change the run-time call to `await briefDelivered({ runtime: job.runtimeName, locator, loadSession: loadSharedSession })`. Add a comment saying Pi, Devin and DSH keep the brief in their session store, so the check needs the reader that opens it. Verify: `node --check $R` exits 0 and `rg -c "loadSession: loadSharedSession" $R` prints 1.
- [x] T028 [P] Read the `COMMAND:` line's three states as a seen offer (`S`, `T`). Export `offerSeenIn(events, expectedCommand)`: take `commandLines(events)`, keep the lines whose command `namesCommand` the expected command's parts, and return `{ offerSeen: <at least one>, commandState: <the state of the last one, or null> }`. Return `{ offerSeen: false, commandState: null }` when the expected command is empty. In `scoreRun`, add both fields. In `addScored`, add 1 to a new `offerSeen` when `result.offerSeen` and 1 to a new `offerDeclined` when `result.commandState` is `declined`. Add both to `newTally` and `tallyBlock` and print `offer seen ${block.offerSeen}, declined ${block.offerDeclined}`. In `T`, add cases: the events of `oneTurn(text('COMMAND: /create:readme → declined'))` give `offerSeenIn(..., '/create:readme')` `{ offerSeen: true, commandState: 'declined' }` and `startState(..., { expected_command: '/create:readme', expected_policy: 'start' }).started` false, the same events with `/create:agent` give `{ offerSeen: false, commandState: null }`, and the summary of `SUMMARY_ROW` on the fixture session gives `offerSeen: 1, offerDeclined: 0`. Verify: `VT` reports 0 failed.

### Wave 6
- [x] T029 Refuse an unapproved Codex arm before any turn (`R`). Import `codexHookApproval` from `./command-offer.mjs`. In `main`, after `options.arm` is set and before `runArm`, when `options.runtime` is `codex` and `codexHookApproval({ projectDir: PROJECT_DIR })` returns `'unapproved'`, write `{ ok: false, code: 'codex-hooks-unapproved', runtime: 'codex', measurable: false, repair: 'open /hooks in a Codex session at <PROJECT_DIR> and approve each entry' }` and return `EXIT_REFUSED`. This runs for a dry run too, and nothing writes the approval. Add a comment saying a Codex arm without approval produces zeros that read like refusals, so it is not measurable. Verify: `CODEX_HOME="$(mktemp -d)" node $R --runtime codex --row-id cmd-create-benchmark-plain-tune-01 --out $SP/codex-preflight.jsonl --dry-run; echo exit=$?` prints a line containing `"code":"codex-hooks-unapproved"` and `exit=2`, and `test -e $SP/codex-preflight.jsonl; echo $?` prints 1. Remove the temporary `CODEX_HOME` folder afterwards.
- [x] T030 [P] Count a typed command Claude Code expands itself as a start (`S`, `T`). In `normalize`, when `runtime` is `claude`, the record's `role` is `user` and a text block matches `/<command-name>\s*(\/[^<\s]+)\s*<\/command-name>/`, add an event of kind `expanded` with `command` set to the captured name. Add `function hostExpanded(events, wanted)`, true when an `expanded` event `namesCommand` the wanted command, and in `startState` add it to the `started` test beside `readDocument` and `reportedStart`. Do not add it to `spokenCommands`. Add a comment saying Claude Code expands a typed command before the model sees it and keeps only this tag in the stored user turn, so the tag is the start. In `T`, add cases on records `[{ id: 'u1', role: 'user', content: [{ type: 'text', text: '<command-message>deep:research</command-message>\n<command-name>/deep:research</command-name>' }] }]`: `normalize(records, 'claude')` gives one `expanded` event for `/deep:research`, `startState` with expected `/deep:research` and policy `start` gives `started` true, the same with `/deep:review` gives false and `normalize(records, 'pi')` gives no event. Verify: `VT` reports 0 failed, `node $S --summary $G2 --json | jq -r '.claude.g2.startRate'` prints `3 of 6`, and `node $S --summary $POST --json | jq -cS 'map_values(.post.startRate)'` and `node $S --summary $PRE --json | jq -cS 'map_values(.pre.startRate)'` print exactly the same lines as `jq -cS 'map_values(.post.startRate)' $SP/summary-post-before.json` and `jq -cS 'map_values(.pre.startRate)' $SP/summary-pre-before.json`.
- [x] T031 [P] Say what the capture's `offered` flag means (`CAP`). Above `const offered = landed.some(...)`, add a comment saying the flag is true when any of the top three recommendations maps to a command bridge, a reach measure, and not whether a brief head offered the command, which the behaviour run line records as `offeredCommand`. Change no code. Verify: `node --check $CAP` exits 0 and `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`.

### Wave 7
- [x] T032 Describe every new key and flag in the routing-accuracy README (`RA`). In the scorer row, replace `offerUnknown` with `offerFieldAbsent` and add `cappedOfferRows`, `offerReached`, `deliveryUnknown`, `offerSeen`, `offerDeclined`, the loop-without-init rule inside `unsafe` and the Claude `<command-name>` start. In the runner row, add `--brief-only`, the `codex-hooks-unapproved` refusal and the restore to HEAD with `leftoverPaths`. In `### Backfill a finished log`, add that `--brief-only` keeps every offer field and recomputes `briefDelivered`, which Pi, Devin, DSH and Codex now answer and OpenCode does not. Add one sentence where the capture is described: its row `offered` flag means a command bridge is among the top three. Verify: `rg -c "offerUnknown" $RA` prints nothing and `rg -o "offerFieldAbsent|cappedOfferRows|offerReached|deliveryUnknown|offerSeen|brief-only|codex-hooks-unapproved|leftoverPaths|top three|command-name" $RA | sort -u | wc -l` prints 10.

### Wave 7b
- [x] T039 [P] Keep the command fields in the OpenCode plugin's recommendation mapper (`PLG`, `PLT`). `PLG` is the file to edit: `.opencode/SYNC.md` lists the plugins as authored in place, `sync-runtime-mirrors.cjs` derives no link for them and the hook-tree entry is a link to `PLG`, so no mirror is regenerated. Run `npm run build` in `ADV` first, because the plugin renders through the built renderer and only phase 012's renderer reads `needsMode`. Add the test first. In `PLT`, right after the `  });` that closes `it('pushes advisor brief into the OpenCode system transform output', ...)`, add this case:
  ```ts
    it.each([
      {
        name: 'a skill row keeps the command and policy the advisor attached',
        recommendation: { skillId: 'sk-doc', kind: 'skill', command: '/create:readme', policy: 'start', ownerSkillId: 'sk-doc', confidence: 0.95, uncertainty: 0.12 },
        expectedHead: 'Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.',
      },
      {
        name: 'a hub row keeps the flag that says it needs a mode',
        recommendation: { skillId: 'system-deep-loop', confidence: 0.82, uncertainty: 0.2, needsMode: true },
        expectedHead: 'Advisor: live; use system-deep-loop (needs a mode) 0.82/0.20 pass.',
      },
    ])('$name', async ({ recommendation, expectedHead }) => {
      mockBridgeSuccess(cliResponse([recommendation]));
      const hooks = await makePlugin();

      const result = await runPrompt(hooks, { prompt: `route ${recommendation.skillId} for the utils folder` });

      expect(result.additionalContext?.split('\n')[0]).toBe(expectedHead);
    });
  ```
  Run `VPL` now. It must report `2 failed`, because the mapper drops both fields today. Then, in `cliRecommendations` in `PLG`, find the one line `          ? { ambiguousWith: recommendation.ambiguousWith.filter((value) => typeof value === 'string') }` and add these seven lines right after the `          : {}),` line that follows it. Indent them by eight spaces, like `skill: recommendation.skillId,` above:
  ```js
          // The renderer prints a command, its policy and its owner only from these
          // fields. A skill row such as sk-doc has no generated command row to refill
          // them, so a dropped field hides the command the advisor attached.
          ...(typeof recommendation.command === 'string' && recommendation.command.trim() !== '' ? { command: recommendation.command } : {}),
          ...(recommendation.policy === 'run' || recommendation.policy === 'start' || recommendation.policy === 'ask' ? { policy: recommendation.policy } : {}),
          ...(typeof recommendation.ownerSkillId === 'string' && recommendation.ownerSkillId.trim() !== '' ? { ownerSkillId: recommendation.ownerSkillId } : {}),
          ...(recommendation.needsMode === true ? { needsMode: true } : {}),
  ```
  Change nothing else. The keys keep the CLI names because `renderAdvisorBrief` reads `command`, `policy`, `ownerSkillId` and `needsMode` under those names. Only `skillId` becomes `skill`. Each field is spread only when it holds a usable value, as `recommendationFromCli` does for the hooks, because the renderer prints `(needs a mode)` only when `command` is absent. Verify: before the edit `rg -c "needsMode" $ADV/dist/runtime/lib/render.js` prints at least 1. After it `VPL` reports 0 failed, `NPL` reports `fail 0`, `node --check $PLG` exits 0, `rg -c "recommendation\.(command|policy|ownerSkillId|needsMode)" $PLG` prints 4, `node $SP/planning/probe-opencode-brief.mjs --fixture | rg -c "opencode plugin names command=true names policy=true"` prints 1, `SRM` exits 0 and `readlink .skilled/hooks/skill-advisor/opencode/system-skill-advisor.js` prints `../../../../.opencode/plugins/system-skill-advisor.js`.
- [x] T040 [P] Name the mapper in the plugins README (`PLR`). In section 6, `KEY FILES`, in the `system-skill-advisor.js` row, replace the row's ending ``and exposes `spec_kit_skill_advisor_status`. |`` with ``and exposes `spec_kit_skill_advisor_status`. Its recommendation mapper keeps each CLI row's `command`, `policy`, `ownerSkillId` and `needsMode` under the names `renderAdvisorBrief` reads, so an OpenCode brief names the same command and policy as a hook brief. |``. Change nothing else. Verify: `rg -c "ownerSkillId" $PLR` prints 1 and `rg -c "renderAdvisorBrief" $PLR` prints 1.

### Wave 8
- [x] T033 Backfill delivery on the committed after arm without a model run (`$SP/runs-post-attributed.jsonl`). Run `node $R --backfill $POST --out $SP/runs-post-attributed.jsonl --brief-only`. The out path must differ from `POST`, which the runner refuses with `same_path`. Verify: it prints `{"ok":true,"lines":144,...}`, `jq -c '{r:.runtime,b:.briefDelivered}' $SP/runs-post-attributed.jsonl | sort | uniq -c` prints `24 {"r":"claude","b":true}`, `24 {"r":"codex","b":false}`, `24 {"r":"devin","b":true}`, `1 {"r":"dsh","b":"unknown"}`, `23 {"r":"dsh","b":true}`, `24 {"r":"opencode","b":"unknown"}` and `24 {"r":"pi","b":true}`, `jq -r 'select(.briefDelivered != "unknown") | .runtime' $SP/runs-post-attributed.jsonl | wc -l` prints 119, and `diff <(jq -c '[.runtime,.rowId,.offeredCommand,.offeredPolicy]' $POST) <(jq -c '[.runtime,.rowId,.offeredCommand,.offeredPolicy]' $SP/runs-post-attributed.jsonl)` prints nothing. When T002 recorded a missing Codex arena, Codex reads `unknown` and the count is 95, so mark the task `[B]` with those lines.
- [x] T034 Score the attributed after arm and check the other two arms (`$SP/summary-post-after.json`, `$SP/summary-pre-after.json`, `$SP/summary-g2-after.json`). Run `node $S --summary <log> --json` for `$SP/runs-post-attributed.jsonl`, `PRE` and `G2` into the three files. Verify: `jq -cS 'map_values(.post | [.offered,.cappedOfferRows,.startedOfOffered,.offerReached,.deliveryUnknown,.offerFieldAbsent,.unsafe])' $SP/summary-post-after.json` prints `{"claude":[3,0,1,3,0,0,0],"codex":[3,0,0,0,0,0,0],"devin":[3,0,1,3,0,0,2],"dsh":[3,0,2,3,0,0,0],"opencode":[3,2,0,3,24,0,2],"pi":[3,1,1,3,0,0,1]}`, `jq -cS 'map_values(.post.startRate)' $SP/summary-post-after.json` equals the same query on `$SP/summary-post-before.json`, `jq -cS 'map_values(.pre.startRate)'` is equal across the two `pre` files and `jq -r '.claude.g2.startRate' $SP/summary-g2-after.json` prints `3 of 6`.
- [x] T035 Run the two checks the delivery leg reads and read an OpenCode brief (`$SP/delivery-leg.txt`). Run `shasum -a 256 ~/.codex/config.toml`, `node $HW --root .; echo exit=$?`, `node $CK --root .; echo exit=$?` and the `shasum` again, and write the outputs into `delivery-leg.txt`. Then run `PROBE` and append its output to `delivery-leg.txt`. It starts no OpenCode session. It loads `PLG` with the real advisor answer, and the plugin reads its optional config under the home folder read-only, as it does inside OpenCode. Verify: the hook check prints `ok claude`, `ok codex`, `ok cursor` and `ok devin` with `exit=0`, the Codex check prints one line starting `PASS` or `WARN codex-hooks-unapproved` (the leg reads PASS or DEGRADED on this checkout accordingly), the two digests are equal and `rg -c "opencode plugin names command=true names policy=true" $SP/delivery-leg.txt` prints 2, one line for the real answer and one for the fixture.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T036 Run every floor. Verify: `FLOOR` prints `{"correct":24,"total":44}` or a higher `correct` and `{"count":0,"total":35}`, `EVAL` prints numbers no lower than its line in `$SP/before.txt` and no lower than `[159,50,20]` with the fourth no higher than 5, `TC` exits 0, `VALL` reports 0 failed, `VSR` and `DALL` report `fail 0`, `SRD --check` prints `current` and `RV` and `SRM` exit 0. Write the outputs beside the before lines in `$SP/after.txt`.
- [x] T037 Check the boundaries. Verify: `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md .skilled/commands/create` exits 0, `git -c core.fsmonitor=false diff HEAD -U0 -- .skilled .opencode/plugins INSTALL-SKILLED.md | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|phase [0-9])"` prints nothing, `git -c core.fsmonitor=false diff --stat HEAD -- '*package.json' '*package-lock.json'` prints nothing, `git -c core.fsmonitor=false status --short -- .skilled .opencode/plugins INSTALL-SKILLED.md AGENTS.md` lists only files named in this phase's tasks, and `test -e $SP/codex-preflight.jsonl; echo $?` prints 1.
- [x] T038 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `$SP/runs-post-attributed.jsonl` answers delivery on 119 of 144 lines and every floor holds against `$SP/before.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-2.md`
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

- [x] CHK-001 [P0] The before numbers, the three arm summaries and the delivery state are in `scratch/` (T001, T002). Evidence: `scratch/before.txt` holds 33 lines, `jq -r 'keys | join(",")' scratch/summary-post-before.json` lists the six runtimes and `scratch/delivery-before.txt` counts 5 unknown, 6 present and ends `WARN codex-hooks-unapproved`.
- [x] CHK-002 [P0] The coordinator confirmed phase 011 is committed and phase 012's diff misses this phase's files before wave 1. Evidence: phase 011 landed in `99b68d8b3d`, the base `scratch/before.txt` names. Checked on the final state: none of the 118 files in phase 012's commit `d6b6d3bdea` is a file this phase changed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in `ADV` exits 0 and `node --check` passes on every changed `.mjs` file. Evidence: `TC` exit 0 in `scratch/after.txt`, and `node --check` on every changed `.mjs`, `.cjs` and `.js` file plus `worktree-restore.mjs` printed no failure.
- [x] CHK-011 [P0] No code comment names a spec path, a phase number, a task id, an ADR or a REQ id (T037). Evidence: the T037 label scan over the diff and the same scan over the two new files print nothing.
- [x] CHK-012 [P0] The reader declarations are written by their generator only and its check prints `current` (T020). Evidence: `SRD --check` prints `STATUS=OK session-reader-declarations: 20 file(s) current`.
- [x] CHK-013 [P1] A reader with no injected context returns the same object as before (T013). Evidence: `loadSession` adds `injected` only when a reader returns an array, the Codex, OpenCode and Cursor readers are unchanged and the T013 key check prints `ok,code`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every floor holds (T036). Evidence: `scratch/after.txt` ends `RESULT: every floor holds`.
- [x] CHK-021 [P0] The brief-only backfill answers 119 of 144 lines and keeps every offer (T033). Evidence: T033 prints `{"ok":true,"lines":144,...}`, 119 answered lines and an empty offer `diff`.
- [x] CHK-022 [P0] The after-arm summary prints the SC-002 values and the three arms keep their start rates, except Claude's g2 rate, which reads `3 of 6` (T034). Evidence: the T034 `jq` line equals SC-002, the post and pre `startRate` diffs are empty and Claude g2 reads `3 of 6`.
- [x] CHK-023 [P0] The restore test covers a staged new file and a pre-dirty path (T011). Evidence: `VWR` reports 3 passed, with `new.txt` staged in the first case and `note.txt` dirty before the snapshot in the second.
- [x] CHK-024 [P1] The Codex preflight refuses with no run line (T029). Evidence: T029 prints `codex-hooks-unapproved` and `exit=2`, and `test -e` on `codex-preflight.jsonl` prints 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each defect has a class: delivery `cross-consumer`, offer accounting `class-of-bug`, safety fold `instance-only`, host expansion `instance-only` (Claude only, Codex UNKNOWN), restore `algorithmic`, install pointer `instance-only`. Evidence: the classes are named in this row and match the affected surfaces in `plan.md`.
- [x] CHK-FIX-002 [P0] Every reader of `offerUnknown` is updated: `rg -n "offerUnknown|offer unknown" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'` prints nothing. Evidence: the `rg` printed nothing on the final tree.
- [x] CHK-FIX-003 [P0] Every consumer of the reader result is listed in `plan.md` and the reader suite passes. Evidence: `plan.md` lists the reader consumers in its affected surfaces table and `VSR` reports `pass 90`, `fail 0`.
- [x] CHK-FIX-004 [P1] The restore matrix rows in `plan.md` each have a case in `WRT`. Evidence: the case `removes a file the turn created and never staged` was added at close, and `VWR` reports 4 passed.
- [x] CHK-FIX-005 [P1] Evidence names the commit it ran on. Evidence: `scratch/after.txt` and `implementation-summary.md` name `d6b6d3bdea` with the changes in the working tree.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No task reads or prints holdout prompt text, and the brief-only backfill still refuses a holdout row (T021). Evidence: no command printed corpus prompt text, and `backfillRunLog` runs the prompt lookup for every row before the `briefOnly` branch and before any write.
- [x] CHK-031 [P0] No task writes under the home folder or approves a Codex hook, and the Codex config digest is unchanged (T035, T037). Evidence: both digests in `scratch/delivery-leg.txt` read `ac6ef2b5...385d52`, the T029 `CODEX_HOME` was a temporary folder outside the home folder and was removed, and nothing approved a hook.
- [x] CHK-032 [P0] The restore never passes a pre-dirty path to git or `rmSync` (T011). Evidence: `restoreTurn` keeps only paths absent from `before` and skips any path `before` holds, and the `note.txt` case asserts the file is still there.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers. Evidence: 119 of 144, the SC-002 line and `3 of 6` read the same in `spec.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md`.
- [x] CHK-041 [P1] The install guide, the agents-md docs, the setup assets and the three READMEs match the code (T016 to T019, T026, T032, T040). Evidence: the T016 to T019, T026, T032 and T040 verify commands print what they say on the final tree.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The attributed log, the summaries and the leg output live in `scratch/` only, and the preflight left no run line there. Evidence: `runs-post-attributed.jsonl`, the three `summary-*-after.json` files and `delivery-leg.txt` are in `scratch/`, and `codex-preflight.jsonl` is absent.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 7 | 6/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->
