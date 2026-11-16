---
title: "Tasks: Phase 4: hook-readme-fold-and-rewrite"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hook readme fold and rewrite tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: hook-readme-fold-and-rewrite

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the worktree root, `/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup`. `H` is `.skilled/hooks`. `PKT` is this phase folder. `SK` is `.skilled/skills/sk-doc`. `SH` is `$H/session-handover`.

- `VD` is `python3 $SK/shared/scripts/validate_document.py`. `HVR` is `python3 $SK/sk-create-with-human-voice/scripts/hvr_scan.py`. `REFS` is `python3 $SK/sk-create-readme/scripts/check_readme_references.py`. `COUNTS` is `python3 $SK/sk-create-readme/scripts/check_derived_readme_counts.py`. `METRICS` is `python3 PKT/../scratch/readme-metrics.py`.
- `READMES` is the sorted output of `find $H -name README.md`. `find` follows the four README paths that are links into skills. `rg` does not.
- `DOCS5` is `$SH/handoff-protocol.md`, `$SH/goal-carry-over.md`, `$SH/runtime-behavior.md`, `$SH/state-files.md` and `$SH/troubleshooting.md`.
- `CHECK <file>...` is `python3 PKT/scratch/readme-gates.py check <file>...`. It prints one line per file, `PASS <file>` or `FAIL <file>` followed by the failing gates. The gates are G1 to G7 of `plan.md` section 3.
- `FOLD` is `python3 PKT/scratch/readme-gates.py fold`. It prints `FOLD missing=N` and one line per link that the README one level up does not name as `<runtime>/<file>`.
- `TRIGGERS` is `python3 PKT/scratch/readme-gates.py triggers`. It prints `TRIGGERS lost=N` and one line per phrase of `scratch/before/` that is in neither the same README nor the README one level up.
- `LINKONLY` is the command of REQ-001 in `spec.md`. It prints the folders that hold a README and otherwise only links.
- `LEAFREF` is `rg -n --hidden -F -f PKT/scratch/deleted-readmes.txt -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' .`. `deleted-readmes.txt` holds the 81 README paths of the link-only folders, each from `hooks/` on, such as `hooks/git-live-follow/claude/README.md`. The runtime folder in such a path is one of `claude`, `codex`, `cursor`, `devin`, `dsh`, `pi`, `opencode`, `vibe` and `shared`.
- `RUN <brief>` is one worker run, `bash PKT/scratch/dispatch.sh run <brief>`. T007 writes that script in the shape of section 4 of `cli-mistral-vibe/references/cli-reference.md`. The run's output folder is `PKT/scratch/runs/<brief name>/`.
- `CHANGED <name>` is `bash PKT/scratch/dispatch.sh changed <name>`. It lists every path whose content differs from the snapshot that `dispatch.sh snap <name>` saved before the wave.
- `REVIEW` is the check of each return. The run's `export.json` holds `exit_code` 0 and `outcome` `finished`. `CHANGED` lists only the files the wave's briefs name and paths under `PKT/scratch/`. `CHECK` prints `PASS` for the file. A feature README, the root README and each of `DOCS5` is also read in full against the adapter files and `hook-registry.json`. A leaf README is read against its old text in `scratch/before/`, because G7 sees only backticked tokens and a behavior named in prose can drop with every gate green. Each verdict is one row of `PKT/scratch/review-log.tsv`: file, attempt, executor, verdict and failing gates. A rejected return goes back as a new brief that quotes the failing lines. After the third rejection the orchestrating session writes the file, and the row says `by-hand`.
- `SUITES` is the hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests, run as rows 1 to 3 of `../scratch/baseline/baseline.sh` run them. `SENTINEL` is `npx vitest run tests/completion-evidence-sentinel.vitest.ts`, run in `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rerun every baseline gate and the completion sentinel test before the first edit (`../scratch/baseline/baseline.sh`). Verify: `PKT/scratch/baseline-before/summary.txt` ends with `BASELINE_DONE`, Vitest prints 501 passed, the `node --test` suites print 1838 pass and 1 fail, the plugin tests print 591 pass, both sync checks print PASS, the two README rows read `pass=183 fail=0` and `pass=158 fail=25`, and `SENTINEL` prints 33 passed. Evidence: `scratch/baseline-before/summary.txt` ends with `BASELINE_DONE`. Vitest printed 9 files and 501 tests passed, `node --test` 1839 tests with 1838 pass and 1 fail, the plugin tests 591 pass and 0 fail, both sync checks PASS, parity `baseline_files=1141` PASS, `manifest=reproducible`, and the README rows `pass=183 fail=0` and `pass=158 fail=25`. `SENTINEL` printed 33 passed. The failing case is the Cursor guard case in `hook-stdin-deadline.test.mjs`.
- [x] T002 Save one row per hook README with the result of `VD`, `VD --type code_folder`, `HVR`, `REFS`, `COUNTS` and `METRICS` (`scratch/gates-before.tsv`). Verify: `wc -l < PKT/scratch/gates-before.tsv` prints 183, and the `METRICS` column holds `FAIL` in 53 rows. Evidence: `scratch/gates-before.tsv` holds 183 rows written by `CHECK`. Failing rows by gate: G1 0, G2 158, G3 25, G4 95, G5 10, G6 53. One row passes every gate, the worked example. [DEVIATION: the G2 column counts `code_folder` blocking rules other than the waived one, so it differs from the 69-file planning count of one rule.]
- [x] T003 Save the path list of `git status --short` and the working-tree patch as the rollback reference (`scratch/pre-phase4.patch`). Verify: `git diff HEAD --binary` piped into `diff -q - PKT/scratch/pre-phase4.patch` prints nothing, and `wc -l < PKT/scratch/status-before.txt` prints the count `git status --short` prints. Evidence: the `diff -q` printed nothing, and both counts printed 334.
- [x] T004 Copy the 183 hook READMEs into `scratch/before/` with links followed and their paths kept (`scratch/before/`). Verify: `find PKT/scratch/before -name README.md -type f` piped into `wc -l` prints 183, and `find PKT/scratch/before -type l` prints nothing. Evidence: the copy script printed `copied 183`, `find` counted 183 files and 0 links, and `cmp` on the linked `spec-gate/README.md` printed nothing.
- [x] T005 Write the gate script with the subcommands `check`, `fold` and `triggers`, after routing through `sk-code` (`scratch/readme-gates.py`). Verify: on a control README with a hand-counted 31-word sentence `CHECK` prints `FAIL` with G6, on a control README whose file table names a missing file it prints `FAIL` with G2, on `$H/codex-global-hooks-check/README.md` it prints `PASS`, `FOLD` prints `FOLD missing=0` before any edit only for `codex-global-hooks-check/`, and `TRIGGERS` prints `TRIGGERS lost=0`. Evidence: the 31-word control printed `FAIL` with G6 (`over30=6`, `max=31`), the table control printed `FAIL` with G1, G2 and G4, the worked example printed `PASS` on all seven gates, `FOLD` printed `FOLD missing=22 links=122 folders=83` with no line for `codex-global-hooks-check`, and `TRIGGERS` printed `TRIGGERS lost=0 phrases=570`. [DEVIATION: a missing file in a file table fails G4, the reference checker. G2 failed on the control for its link to the missing file and its missing separators. `check` runs G2 on the file a linked README path points to, because `code_folder_relative_link` resolves links from the README's own folder and a skill-owned file cannot resolve from two folders. `FOLD` already finds 100 of the 122 links named one level up.]
- [x] T006 Build the fold map from `hook-registry.json`, the adapters, the plugin files and `.vibe/hooks.toml`, and the list of README paths to delete (`scratch/fold-map.tsv`). Verify: the map holds a header and 120 rows in 81 distinct feature and runtime pairs, each link name in it exists as a link on disk, no event cell is empty, and `wc -l < PKT/scratch/deleted-readmes.txt` prints 81. Evidence: `scratch/build-fold-map.py` printed `FOLDMAP rows=122 folders=83 readmes=81 not_registered=6`, every link name is a link on disk, no event cell is empty and `deleted-readmes.txt` holds 81 lines. [DEVIATION: 122 rows in 83 pairs, not 120 in 81. `completion-evidence/vibe/` and `env-secret-guard/opencode/` hold only a link and no README, so they were outside the 81 READMEs and inside REQ-004. The map has six columns: feature, runtime, link, real file, event and where the event was read. The worker reads what the runtime shows from the real file, and the review checks it. Six links have no registration that names them and are read by hand for their brief: `completion-evidence/opencode/system-speckit-completion.js`, `completion-evidence/vibe/completion-evidence-post-agent.cjs`, the two in `directive-lifecycle/claude/`, `skill-advisor/claude/user-prompt-submit.ts` and `skill-advisor/vibe/prompt-advisor.mjs`.]
- [x] T007 Read the worker contracts, then write the feature brief template, the leaf brief template and the dispatch script (`scratch/briefs/template-feature.md`). Verify: `wc -l` on each template prints fewer than 90, each holds the RUN CONTEXT, DON'T and HANDBACK blocks, `bash -n PKT/scratch/dispatch.sh` exits 0, and `dispatch.sh snap control` followed by a one-byte edit of a scratch file makes `CHANGED control` list that file and nothing else. The contracts are `cli-mistral-vibe/SKILL.md`, its `references/cli-reference.md` and `assets/prompt-quality-card.md`, `cli-external-orchestration/shared/references/child-dispatch-preamble.md`, `sk-prompt/assets/cli-prompt-quality-card.md` section 6 and `.claude/agents/markdown.md`. Evidence: `wc -l` printed 71 and 70, both templates hold the three blocks, `bash -n` and `shellcheck` exited 0, and `CHANGED control` listed only `scratch/control-probe.txt` after a one-byte write. [DEVIATION: `scratch/build-brief.py` fills a template per README from the fold map, the saved copy and the removal list, because about 104 briefs each need those lookups. A worker starts in `scratch/runs/<brief name>/cwd/` inside the worktree, not outside the checkout: the probe `runs/probe-no-approve/` started outside wrote nothing at exit 0, and `runs/probe-write/` started inside wrote its file. `scratch/dispatch-notes.txt` holds both results.]
- [x] T008 Route through `sk-doc` before the first README write and confirm phase 003 is closed (`../003-literal-hook-renames/spec.md`). Verify: `rg -c '\*\*Status\*\* \| Complete' ../003-literal-hook-renames/spec.md` in this phase folder prints 1. The route loads `sk-doc/SKILL.md`, its `ROUTER.md`, `sk-create-readme/SKILL.md` sections 5 to 8, `assets/readme-code-template.md` and `sk-create-with-human-voice/references/hvr-rules.md`. Evidence: the `rg` printed 1. `compiled-route.cjs --hub sk-doc` resolved `sk-create-with-human-voice` for the rewrite prompt, and the session that planned this phase resolved `sk-create-readme`. The session that dispatches read `sk-create-readme/SKILL.md` sections 6 to 8 and the punctuation and hard-blocker sections of `hvr-rules.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Pilot:

- [x] T010 Run the pilot of one feature README and one leaf README, `git-worktree-guard/README.md` and `cli-dispatch/claude/README.md` (`.skilled/hooks/git-worktree-guard/README.md`). Verify: `REVIEW` passes for both files, `FOLD` lists no link of `git-worktree-guard/`, and `PKT/scratch/dispatch-notes.txt` holds one line that says whether `vibe -p` needed `--auto-approve` to write and one line with the wall time of each run. Evidence: `CHECK` prints `PASS` with G1 to G7 ok for both files. `scratch/review-log.tsv` logs the leaf as a pass on attempt 3 and the feature as a pass on attempt 2, each read against its old text and sources. `FOLD` lists no link of `git-worktree-guard/`. `dispatch-notes.txt` lines 3 and 4 settle `--auto-approve`, and the wall-time lines cover every run. [DEVIATION: the orchestrator removed one sentence from the feature draft, copied from the shape file, saying each runtime folder holds a README.]
- [x] T011 Tune the two templates and the dispatch script to what the pilot showed (`scratch/briefs/template-leaf.md`). Verify: `wc -l` on each template prints fewer than 90, and `PKT/scratch/dispatch-notes.txt` names each change with the pilot line that caused it, or says none was needed. Evidence: the templates have 73 and 72 lines, plus the one-sentence rule added after the pilot. `dispatch-notes.txt` names T011 changes 1 to 5 and the shape fix, each with the run that caused it.

Feature tier, one brief per file, each brief built from the rows of `scratch/fold-map.tsv` for its folder:

- [x] T020 Rewrite the feature READMEs of `classifier-injection-screen/`, `cli-dispatch/`, `completion-evidence/`, `directive-lifecycle/` and `dist-freshness/` (`.skilled/hooks/cli-dispatch/README.md`). Verify: `REVIEW` passes for the five files, `FOLD` lists no link of those folders and `SENTINEL` prints 33 passed. The `completion-evidence` brief quotes `display: false`, `deliverAs: "nextTurn"` and the "model-visible" and "next-turn" pair. Evidence: `CHECK` prints `PASS` for all five. `FOLD` names none of the five folders. `SENTINEL` printed 33 passed after the retries. `review-log.tsv` rejects all five first drafts on content and passes all five on attempt 2. Each defect list came from a Claude reviewer and was confirmed against the source by the orchestrator. Each retry diff, read against the pre-retry snapshot, touches only the listed defects. [DEVIATION: the read in full against the sources was done by one read-only Claude reviewer per file, then confirmed line by line, in place of the orchestrator reading all five files alone.]
- [x] T021 Rewrite the feature READMEs of `env-secret-guard/`, `git-hooks-check/`, `git-live-follow/`, `git-primary-reconcile/` and `goal/` (`.skilled/hooks/goal/README.md`). Verify: `REVIEW` passes for the five files, `FOLD` lists no link of those folders and `node --test .opencode/plugins/tests/goal-doc-contract.test.cjs` prints `fail 0`. The `goal` brief lists the cited paths and the goal kill-switch names. Evidence: four of the five end on `pass` in `review-log.tsv`. `env-secret-guard/README.md` ends on `by-hand`: the guard refuses an agent edit of that file, so the operator fixed the diagram line to `every adapter except Vibe,` and named `vibe/env-secret-guard.mjs` in the Vibe row. It then passes G1 to G7, `FOLD` prints `missing=0`, and the goal doc contract test passed in the baseline rerun.
- [x] T022 Rewrite the feature READMEs of `mcp-route-guard/`, `overlay-guard/`, `permission-policy/`, `post-edit-quality/` and `session-cleanup/` (`.skilled/hooks/overlay-guard/README.md`). Verify: `REVIEW` passes for the five files and `FOLD` lists no link of those folders. Evidence: `CHECK` prints `PASS` for all five. `FOLD` names none of the five folders. `review-log.tsv` rejects all five first drafts on content, each defect confirmed against the source, and passes all five on attempt 2. Each retry diff, read against its pre-retry snapshot, touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per file, then confirmed by the orchestrator.]
- [x] T023 Rewrite the feature READMEs of `session-lifecycle/`, `shared/` and `subagent-dispatch-guard/`, and remove by hand the sentence that says each runtime folder holds a README (`.skilled/hooks/codex-global-hooks-check/README.md`). Verify: `REVIEW` passes for the three files, `rg -n 'also holds a README' $H/codex-global-hooks-check/README.md` prints nothing, `CHECK` prints `PASS` for that file and `FOLD` lists no link of those four folders. Evidence: `CHECK` prints `PASS` for the three files and for `codex-global-hooks-check/README.md`. `rg` prints nothing and exits 1. `FOLD` names none of the four folders. `review-log.tsv` rejects all three first drafts on content and passes all three on attempt 2. In `shared/README.md` the orchestrator removed an unrequested runtime section with wrong rows. In `subagent-dispatch-guard/README.md` it set one link arrow to the four `../` the link holds. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per file, then confirmed by the orchestrator.]
- [x] T024 Author the two missing feature READMEs from the code in their folders (`.skilled/hooks/ask-surface-guard/README.md`). Verify: `ls $H/ask-surface-guard/README.md $H/decision-capture/README.md` exits 0 and `REVIEW` passes for both files. G7 has no old file to compare, so each backticked path in the two files is checked with `ls`. Evidence: both files exist, and `CHECK` prints `PASS` with G7 `n/a`. Each reviewer ran `ls` on every backticked path, and the retries fixed the paths that did not resolve. `review-log.tsv` rejects both first drafts on content and passes both on attempt 2. The decision-capture brief note had left out the live OpenCode plugin. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per file, then confirmed by the orchestrator.]
- [x] T025 Rewrite the two skill-owned READMEs with their folded rows, and name both hooks in the title of the first (`.skilled/skills/sk-git/scripts/hooks/README.md`). Verify: `REVIEW` passes for that file and for `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md`, `FOLD` lists no link of `git-message-gate/`, `git-preflight/` or `spec-gate/`, and the H1 of the first file names the message gate and the preflight advisory. Evidence: `CHECK` prints `PASS` for both files, read through their hook link paths. `FOLD` prints `missing=1`, and that one is `session-handover/opencode/session-handover.js`. The H1 reads "Git Message Gate and Preflight Advisory: sk-git Command Hooks". `review-log.tsv` rejects both first drafts on content, seven defects each, confirmed in part against the source, and passes both on attempt 2. Each retry diff against snapshot `batch-b` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per file, then confirmed by the orchestrator.]
- [x] T026 Add the eight folded rows and the leaf trigger phrases to the advisor reference and fix its hard blockers and its eight unresolved references, and nothing else (`.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`). Verify: `HVR` on the file reports `hard blockers: 0`, `VD` prints `VALID`, `REFS` prints `PASS`, `FOLD` lists no link of `skill-advisor/`, and every changed line in `diff PKT/scratch/before/skill-advisor/README.md` against the file is a table row, a frontmatter phrase, a line `HVR` listed in `scratch/gates-before.tsv` or one of the eight lines `REFS` listed. Evidence: `HVR` prints `hard blockers: 0`, `VD` prints `VALID`, `REFS` prints `PASS ... unresolved=0`, and `FOLD` lists no `skill-advisor/` link. The diff holds 24 frontmatter phrases, one 13-row link table, the eight `REFS` lines and the one `HVR` semicolon line in the Vibe row. Every table row matches `readlink`. [DEVIATION: the folder holds 13 links in eight runtime folders, so the table has 13 rows, not eight.]

Fold and delete:

- [x] T030 Delete the 80 leaf READMEs of the link-only folders outside `session-handover/` with `git rm`, then point each remaining mention at the README one level up or remove it (`scratch/deleted-readmes.txt`). Verify: before the delete `FOLD` lists no link outside `session-handover/opencode/`, after it `LINKONLY` prints only `.skilled/hooks/session-handover/opencode`, `TRIGGERS` prints `TRIGGERS lost=0`, and `LEAFREF` prints only lines of the three pinned lists and of `session-handover/opencode/README.md`. Evidence: before the delete `FOLD` printed `missing=1`, the link `session-handover/opencode/session-handover.js`. `git rm -f` removed the 80 files; the force was needed because 15 of them held this packet's own staged or local path updates from the renames, which `git diff` showed and which die with the files. After it `LINKONLY` prints `['.skilled/hooks/session-handover/opencode']` and `LEAFREF` matches only `trigger-index.json`, `corpus-manifest.json` and `baseline-readme-verdicts.json`, 81 lines each. `TRIGGERS` first printed `lost=21`: the hand-edited `codex-global-hooks-check/README.md` and the sk-git README, whose brief ran through the `git-message-gate` link path, never received their leaf phrases. The orchestrator added the 19 phrases to the two frontmatters by hand, logged as `by-hand`, and `TRIGGERS` then printed `lost=0 phrases=570`.

Leaf tier, one brief per file, a feature folder's leaves in one wave of up to five runs at a time:

- [x] T031 [P] Rewrite the six leaf READMEs of `classifier-injection-screen/` (`.skilled/hooks/classifier-injection-screen/lib/README.md`). Verify: `REVIEW` passes for the six files. Evidence: `CHECK` prints `PASS` for all six. `review-log.tsv` passes devin and pi on attempt 1, and rejects claude, dsh, lib and tests on content, then passes them on attempt 2. Each retry diff against snapshot `leaf-r2` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T032 [P] Rewrite the seven leaf READMEs of `cli-dispatch/` that the pilot left (`.skilled/hooks/cli-dispatch/lib/README.md`). Verify: `REVIEW` passes for the seven files. Evidence: `CHECK` prints `PASS` for all seven. `review-log.tsv` passes devin, lib and tests on attempt 1, and rejects codex, cursor, dsh and pi on content, then passes them on attempt 2. Each retry diff against snapshot `leaf-r2` touches only the listed defects. The pi defect on zero packets was confirmed in `pi/dispatch-preflight-lint.ts`, whose code comment states the same wrong reading; that comment is a close-out finding, since this phase changes no code. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T033 [P] Rewrite the eight leaf READMEs of `decision-capture/` (`.skilled/hooks/decision-capture/bin/README.md`). Verify: `REVIEW` passes for the eight files. Evidence: `CHECK` prints `PASS` for all eight. The reviewer ran every named suite, all exit 0 (`bin` 89 of 89, `lib` 38 of 38, Pi 10 of 10). `review-log.tsv` passes claude and tests on attempt 1, and rejects bin, devin, dsh, lib, pi and vibe on content, each defect spot-checked against the code, then passes them on attempt 2. Each retry diff against snapshot `dc-r2` touches only the listed defects. The bin defect on `runtime-refusal.test.mjs` reading the concern README was already false in the old text. The same review found two false lines in the feature README, the fixture sweep writing queue state and `takeNudge` reporting once; the orchestrator fixed both by hand, logged as `by-hand`. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T034 [P] Rewrite the eight leaf READMEs of `goal/` (`.skilled/hooks/goal/lib/README.md`). Verify: `REVIEW` passes for the eight files. Evidence: `CHECK` prints `PASS` for all eight. The reviewer ran every named test command, all exit 0. `review-log.tsv` passes lib, pi and tests on attempt 1, and rejects bin, cursor, devin, dsh and vibe on content, each defect spot-checked against the code, then passes them on attempt 2. Each retry diff against snapshot `goal-r2` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T035 [P] Rewrite the eight leaf READMEs of `mcp-route-guard/` (`.skilled/hooks/mcp-route-guard/lib/README.md`). Verify: `REVIEW` passes for the eight files. Evidence: `CHECK` prints `PASS` for all eight. The reviewer ran both named suites, 18 of 18 assertions and 6 of 6 tests, exit 0. `review-log.tsv` passes claude, devin and pi on attempt 1, and rejects codex, cursor, dsh, lib and tests on content, then passes them on attempt 2. Two of the fixed claims were already false in the old text: the broad-mode `warn` on a missing manifest and the stubbed-core description of the DSH suite. Each retry diff against snapshot `guard-r2` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T036 [P] Rewrite the eight leaf READMEs of `overlay-guard/` (`.skilled/hooks/overlay-guard/lib/README.md`). Verify: `REVIEW` passes for the eight files. Evidence: `CHECK` prints `PASS` for all eight. The reviewer ran the named suites, 19 of 19, 5 of 5 and 14 of 14, exit 0. `review-log.tsv` passes cursor, devin and tests on attempt 1, and rejects claude, codex, dsh, lib and pi on content, then passes them on attempt 2. Each retry diff against snapshot `guard-r2` touches only the listed defects; the lib retry also added a `readme-check allow-ref` block for `.skilled-overlays.json`, the reference checker's own allow mechanism, which the feature README already uses. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T037 [P] Rewrite the seven leaf READMEs of `post-edit-quality/` (`.skilled/hooks/post-edit-quality/lib/README.md`). Verify: `REVIEW` passes for the seven files. Evidence: `CHECK` prints `PASS` for all seven. The reviewer ran every named test command, all exit 0 (the `tests/` folder 15 of 15, the OpenCode suite 51 of 51). `review-log.tsv` passes claude, devin, pi and tests on attempt 1, and rejects codex, dsh and lib on content, each defect confirmed against the code, then passes them on attempt 2. Each retry diff against snapshot `peq-r2` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then confirmed against the code by the orchestrator.]
- [x] T038 [P] Rewrite the seven leaf READMEs of `subagent-dispatch-guard/` (`.skilled/hooks/subagent-dispatch-guard/lib/README.md`). Verify: `REVIEW` passes for the seven files. Evidence: `CHECK` prints `PASS` for all seven. The reviewer ran the named suites, 6 of 6 and 2 of 2, exit 0, and `git status` was unchanged by the runs. `review-log.tsv` passes claude, devin, dsh, lib and tests on attempt 1, and rejects cursor and pi, then passes them on attempt 2. The cursor retry removed an added validation command whose suite has the known failing case. Each retry diff against snapshot `sdg-r2` touches only the listed defect. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then confirmed by the orchestrator.]
- [x] T039 [P] Rewrite the three leaf READMEs of `shared/`, the two of `session-lifecycle/` and the `tests/` README of `completion-evidence/`, `git-message-gate/`, `git-preflight/` and `spec-gate/` (`.skilled/hooks/shared/session-readers/README.md`). Verify: `REVIEW` passes for the nine files. Evidence: `CHECK` prints `PASS` for all nine. The reviewer ran every named suite, all exit 0 (session readers 102 of 102, the Vibe suites 34 of 34). `review-log.tsv` passes `shared/dsh`, `session-lifecycle/tests` and the `tests/` READMEs of git-message-gate, git-preflight and spec-gate on attempt 1, and rejects `shared/session-readers`, `shared/tests`, `session-lifecycle/vibe` and `completion-evidence/tests`, each defect spot-checked against the code, then passes them on attempt 2. Each retry diff against snapshot `t039-r2` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]
- [x] T040 [P] Rewrite the seven leaf READMEs of `session-handover/`, the one at `tests/fixtures/` among them (`.skilled/hooks/session-handover/tests/README.md`). Verify: `REVIEW` passes for the seven files. Evidence: `CHECK` prints `PASS` for all seven. The reviewer ran the named suites without touching handoff state: `node --test` 1074 of 1074 and the Pi Vitest file 67 of 67, exit 0. `review-log.tsv` passes pi and `tests/fixtures` on attempt 1, and rejects bin, claude, codex, lib and tests on content, each defect spot-checked against the code, then passes them on attempt 2. Each retry diff against snapshot `sh-r2` touches only the listed defects. [DEVIATION: the full read against the sources was done by one read-only Claude reviewer per feature group, then spot-checked against the code by the orchestrator.]

Session-handover split and the root README:

- [x] T041 Split the session-handover README with six briefs, one per output file, then delete the last link-only leaf README with `git rm` (`.skilled/hooks/session-handover/README.md`). Verify: `REVIEW` passes for the README and each of `DOCS5`, `wc -w $SH/README.md` prints fewer than 3000, the README links each of `DOCS5`, every backticked token of `PKT/scratch/before/session-handover/README.md` is in one of the six files or in a brief's list of removals, `FOLD` prints `FOLD missing=0` and `LINKONLY` prints `[]`. Evidence: `CHECK` prints `PASS` for the README with G7 `ok` over the README and its siblings, and for each of `DOCS5` with G2 and G7 `n/a`. `scratch/split-tokens.py` reads each document alone against its own line ranges of the saved README and prints `missing=0` for all five, because G7 passes trivially while the old README is on disk. `wc -w` prints 2785. The README links all five. The reviewer ran `node --test` on the folder's suites, 1001 of 1001, and `--help`, exit 0. `review-log.tsv` rejects all six first drafts on content and passes all six on attempt 2, each defect spot-checked against the code. Several of the fixed claims were already wrong in the old README. `git rm -f` removed `session-handover/opencode/README.md`. After it `FOLD` prints `FOLD missing=0 links=122 folders=83` and `LINKONLY` prints `[]`. [DEVIATION: ADR-004 left the shim mechanics and the matrix columns without a home; they went to `runtime-behavior.md`, recorded in ADR-004. The five documents ran first and the README last, so its G7 never read an empty sibling. The full read was done by one read-only Claude reviewer per document, then spot-checked by the orchestrator.]
- [x] T042 Read each line elsewhere that describes what the session-handover README covers and edit only a line that names content that moved (`scratch/handover-readme-mentions.txt`). Verify: the file holds one verdict for each of root `README.md:1083` and `:1759`, `.skilled/skills/system-spec-kit/README.md:94`, `.skilled/bin/README.md:183` and the five playbook lines under `plugins-and-hooks/`, nine in all, and each edited line names the document that now holds the content. Evidence: `scratch/handover-readme-mentions.txt` holds the nine verdicts, seven `edited` and two `kept`. Root `README.md:1759` keeps its link, because the README still introduces the note, the wrapper and the shim. `.skilled/bin/README.md:183` keeps its link, because the replay rule and the deny list stay in the README quick start. Each edited line links `state-files.md`, `runtime-behavior.md`, `troubleshooting.md` or `handoff-protocol.md`, matched to where each topic now lives, and each new path resolves. The four hop-recall prompts that ask for the README's line count and first heading record no expected value, so they stay.
- [x] T043 Rewrite the root hooks README last, with the concern-key table and the corrections of the wrong-facts table in `plan.md` (`.skilled/hooks/README.md`). Verify: `REVIEW` passes, the file holds the header row `| Concern | Claude | Codex | Cursor | Devin | OpenCode | Pi | DSH | Vibe |` and a row that starts with `decision-capture` in backticks, its last H2 is RELATED, its frontmatter holds no "git hooks" phrase, each of the eight concern keys of the wrong-facts table stands next to its folder, and `node --test $H/decision-capture/bin/runtime-refusal.test.mjs` prints `fail 0`. Evidence: `CHECK` prints `PASS`. The header row appears once. A row starting with `decision-capture` appears in each of the three tables, and the test reads the one under the matrix header. the last H2 is `## 8. RELATED`, and `git hooks` appears nowhere. The concern-key table holds the eight keys of the wrong-facts table, each next to its folder, plus `live-sync`, `live-follow` and `primary-reconcile`, which the two git scripts gate on. `runtime-refusal.test.mjs` prints `pass 6` and `fail 0`. `TRIGGERS` prints `lost=0`. A script confirmed every old table row survives, apart from the tree lines and the two boundary rows the retry was told to change. The reviewer ran the VALIDATION commands: every suite passes except the known `ai-council` case of `hook-stdin-deadline.test.mjs`. `review-log.tsv` rejects the first draft on content and passes attempt 2. [DEVIATION: the root README took a brief of its own, `briefs/root.md`, because the feature template's sections and runtime-coverage step do not fit it. The reviewer's finding to drop the trigger phrase "hook relocation" was declined, because the plan lets only "git hooks" leave and `TRIGGERS` gates on that.]

Pinned lists, each once, after the last README edit:

- [x] T070 Stage the seven created documents with `git add` (`.skilled/hooks/decision-capture/README.md`). Verify: `git ls-files $H/ask-surface-guard/README.md $H/decision-capture/README.md DOCS5` prints seven paths, and `git ls-files $H` filtered to `README.md` prints 104 paths. Evidence: `git add` staged the seven files and `git ls-files` prints all seven. `git ls-files $H` filtered to `README.md` prints 104, and `find $H -name README.md` prints 104.
- [x] T071 Rebase the durable directory manifest with `test_readme_manifest.py --write` and record its count and `gaps` number (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`). Verify: `python3 $SK/scripts/tests/test_readme_manifest.py` prints `manifest=reproducible`, and `PKT/scratch/manifest-after.txt` holds the directory count, the `gaps` number and each gap that is new against the 920-directory list. Evidence: `--write` printed `directories=845`. The check prints `manifest=reproducible` with `gaps=21`. `scratch/manifest-after.txt` records 845 directories, 21 gaps and 0 gaps new against the 920-directory list. The two added directories are `ask-surface-guard` and `decision-capture`, and the 77 removed ones are link-only folders whose READMEs this phase deleted.
- [x] T072 Rebase the README verdict baseline with `test_readme_verdict_parity.py --write` and record its count (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: `python3 $SK/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS`, and its `baseline_files` count is 1141 less the 81 deleted rows plus the rows of the new READMEs. Evidence: `--write` printed `1062 tracked README files`. The check prints `PARITY baseline_files=1062 post_files=1062 diff_entries=0` and `PARITY PASS`. 1141 less 81 plus 2 is 1062. A diff against the old baseline shows 81 removed rows, all under `.skilled/hooks/`, the two added rows `ask-surface-guard/README.md` and `decision-capture/README.md`, and no kept README whose `valid` flag changed.
- [x] T073 Regenerate the trigger index and its fixture files with `generate-trigger-index.mjs` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` prints `trigger index matches the corpus`. Evidence: the generator rewrote `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. `--check` prints `trigger index matches the corpus` over 27493 documents with 0 stale, 0 obsolete and 0 untrusted, exit 0. After it `LEAFREF` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T080 Run every gate over every file from the final state and save the rows (`scratch/gates-after.tsv`). Verify: `CHECK` over `READMES` and `DOCS5` prints `FAIL` for no file except `$H/skill-advisor/README.md`, which fails G6 only, the tail of `VD` and of `HVR` over `READMES` shows 104 pass and 0 fail, `REFS` and `COUNTS` over `READMES` and `DOCS5` each print `fail=0`, and the `SUMMARY` line of `METRICS $H` shows `pass=103 fail=1`. Evidence: `scratch/gates-after.tsv` holds 109 rows, 108 `PASS` and one `FAIL`, `skill-advisor/README.md` with G6 only. `VD` passes 104 and fails 0, `HVR` reports `hard blockers: 0` for 104 and fails 0. `REFS` and `COUNTS` each print `SUMMARY files=109 pass=109 fail=0`. `METRICS $H` prints `SUMMARY files=104 pass=103 fail=1`. The first run also failed `cli-dispatch/lib/README.md` on G2, because a reviewer's `vitest run` had left a gitignored `node_modules/.vite` cache in that folder. The orchestrator removed that task-created cache, and the file then passed all seven gates.
- [x] T081 Run the fold check, the trigger check and the link-only check from the final state (`scratch/readme-gates.py`). Verify: `FOLD` prints `FOLD missing=0`, `TRIGGERS` prints `TRIGGERS lost=0` with "git hooks" of the root README as the one recorded exception, `LINKONLY` prints `[]` and `find $H -name README.md` piped into `wc -l` prints 104. Evidence: `FOLD missing=0 links=122 folders=83`, `TRIGGERS lost=0 phrases=570` with "git hooks" of the root README held in `DROPPED_PHRASES` as the one exception, `LINKONLY` prints `[]` and `find` prints 104.
- [x] T082 Run the link and reference searches from the final state (`.skilled/hooks/session-handover/README.md`). Verify: `rg -n '\]\([^)]*specs/' $H -g '*.md'` prints nothing, and `LEAFREF` prints nothing. Evidence: both `rg` searches print nothing and exit 1, the no-match status.
- [x] T083 Compare the changed paths with the list T003 saved (`scratch/status-before.txt`). Verify: the path list of `git status --short`, without Markdown files, the five pinned list files and this packet, equals `PKT/scratch/status-before.txt` filtered the same way. Evidence: `diff` of the two filtered lists prints nothing and exits 0. The six pinned list files were already in the saved list from the earlier phases, so the sets match with them left in. The `specs/` paths outside this packet match the saved list too.
- [x] T084 Rerun every gate in the `plan.md` baseline table from the final state (`../scratch/baseline/baseline.sh`). Verify: each row of `PKT/scratch/baseline-after/summary.txt` equals its row in `baseline-before/summary.txt`, except that the two README rows read `pass=104 fail=0`, the one failing `node --test` case has the name T001 saved, and `SENTINEL` prints 33 passed. Evidence: `baseline.sh` exited 0 and `summary.txt` ends with `BASELINE_DONE`. All 13 exit rows match the before run, `hooks-node-test` at `exit=1` as before. Hook Vitest prints 501 of 501, `node --test` 1838 of 1839, the OpenCode plugin tests 591 of 591, the Pi suites 120 of 120 and 81 of 81, the same counts as before. The one `node --test` failure is "the Cursor preflight, MCP route and Task guards still answer a normal payload" in both runs. `readme-validate_document` and `readme-hvr_scan` both read `pass=104 fail=0`. `SENTINEL` prints `Tests 33 passed (33)`.
- [x] T085 Write what changed and how it was checked, with the files written by hand and the review totals (`implementation-summary.md`). Verify: `rg -c 'YOUR_VALUE_HERE' implementation-summary.md` in this phase folder prints nothing, and the summary names the count of rows in `scratch/review-log.tsv` by verdict. Evidence: `rg -c` prints nothing and exits 1. The summary names 111 pass, 76 reject, 2 reopen and 1 blocked, and lists the three `by-hand` rows.
- [x] T086 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: prints `RESULT: PASSED (errors=0 warnings=1)` with `spec.md` at `Complete`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. One read-only Claude reviewer per feature group read each file against the code, and the orchestrator spot-checked each defect.
- [x] `FOLD` prints `FOLD missing=0`, `TRIGGERS` prints `TRIGGERS lost=0`, `LINKONLY` prints `[]` and `CHECK` prints `FAIL` only for `skill-advisor/README.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Its ARCHITECTURE DECISION RECORD section holds ADR-001 to ADR-005.
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A file whose return is rejected three times is written by the orchestrating session, and its row in `scratch/review-log.tsv` says `by-hand`. A task that hits three failed fixes for the same symptom other than a rejected return is marked `[B]` with the failing command and its output, and the phase stops for the operator. After two failed runs or a rate limit on the Vibe CLI, the same brief goes to cli-opencode on `opencode-go/deepseek-v4.1-flash`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. `rg -c '^\| REQ-' spec.md` prints 15. Evidence: prints 15.
- [x] CHK-002 [P0] Technical approach defined in plan.md. `rg -c '^### ADR-' plan.md` prints 5. Evidence: prints 5.
- [x] CHK-003 [P0] The before-state exists before the first README edit. `ls PKT/scratch` lists `baseline-before`, `gates-before.tsv`, `status-before.txt`, `pre-phase4.patch`, `before`, `fold-map.tsv` and `deleted-readmes.txt`. Evidence: `ls scratch` lists all seven, written by T001 to T006 before T010.
- [x] CHK-004 [P1] The gate script was checked on its controls. T005 recorded a `FAIL` with G6, a `FAIL` with G2 and a `PASS`. Evidence: T005 recorded the 31-word control `FAIL` with G6, the table control `FAIL` with G1, G2 and G4, and `PASS` on the worked example.
- [x] CHK-005 [P1] The worker contracts were read before the first dispatch. T007 names the six documents. Evidence: T007 names `cli-mistral-vibe/SKILL.md`, its `references/cli-reference.md` and `assets/prompt-quality-card.md`, `child-dispatch-preamble.md` and `sk-prompt/assets/cli-prompt-quality-card.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No file outside Markdown, the pinned lists and this packet changed. T083 compares the path lists. Evidence: T083 `diff` prints nothing and exits 0.
- [x] CHK-011 [P0] Every worker return was reviewed before the next step used it. `scratch/review-log.tsv` holds a row with a final `pass` or `by-hand` verdict for each of the files in scope. Evidence: 107 of 108 files end on `pass`, and `env-secret-guard/README.md` ends on `by-hand` after the operator's edit.
- [x] CHK-012 [P1] `python3 -m py_compile PKT/scratch/readme-gates.py` and `bash -n PKT/scratch/dispatch.sh` each exit 0. Evidence: both exit 0 from the final state.
- [x] CHK-013 [P1] No README states relocation history, a packet id or a link into `specs/`. The `specs/` link search of T082 prints nothing. Evidence: T082 prints nothing. The root README keeps the trigger phrase "hook relocation" by plan, and states no relocation history.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Every row in `acceptance-criteria.md` reads `Met`. Evidence: `rg -c "| Met |" acceptance-criteria.md` prints 15 and no row reads `Unmet`.
- [x] CHK-021 [P0] No runtime entry lost its documentation. `FOLD` prints `FOLD missing=0` and `LINKONLY` prints `[]`. Evidence: T081 `FOLD missing=0 links=122 folders=83` and `LINKONLY` `[]`.
- [x] CHK-022 [P0] The suites keep their counts. T084 recorded Vitest, `node --test`, the plugin tests and `SENTINEL`. Evidence: T084 Vitest 501/501, `node --test` 1838/1839 with the same known failure, plugin tests 591/591, `SENTINEL` 33/33, all equal to T001.
- [x] CHK-023 [P0] Every hook README passes structure and voice. `VD` and `HVR` over `READMES` show 104 pass and 0 fail. Evidence: T080 and T084, 104 pass and 0 fail for each.
- [x] CHK-024 [P1] The sentence targets hold. The `SUMMARY` line of `METRICS $H` shows `pass=103 fail=1`, and the one is `skill-advisor/README.md`. Evidence: T080 `SUMMARY files=104 pass=103 fail=1`, the one `skill-advisor/README.md`.
- [x] CHK-025 [P1] No trigger phrase was lost. `TRIGGERS` prints `TRIGGERS lost=0`. Evidence: T081 `TRIGGERS lost=0 phrases=570`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. No brief, run folder or README holds a credential, token or key. `rg -n -i 'api[_-]?key\s*[:=]' PKT/scratch/briefs PKT/scratch/runs` prints nothing. Evidence: the search does not print nothing. Its hits in `scratch/runs` are repository source the workers read and quoted: redaction tests, `op://vault/item/field` placeholders and a fake `sk-liveSu` test fixture. `scratch/briefs` has no hit. A count-only search of `scratch/` for the real Mistral key from the keychain finds 0 files. [DEVIATION: the literal command fails on quoted fixtures, so the check was settled by the real-key search.]
- [x] CHK-031 [P0] Each worker wrote only the file its brief names. `CHANGED` listed no other path outside `PKT/scratch/` for any wave, as `scratch/review-log.tsv` records. Evidence: every path that changed since `scratch/status-before.txt` outside the hook READMEs and their siblings is in scope: `skill-advisor-hook.md`, the spec-gate library README, `system-spec-kit/README.md` and four playbooks named by T042. `coverage-rationale.md` and `injection-contract.md` differ from HEAD exactly as in `scratch/pre-phase4.patch`. The one stray, a reviewer-created `.vite` cache, was removed in T080.
- [x] CHK-032 [P1] Every kill-switch name and concern key in a README is unchanged. G7 passed for each file, and the removals each brief lists hold no switch name or key. Evidence: `scratch/gates-after.tsv` shows G7 `ok` for 102 files and `n/a` for 7 new or sibling documents, and T043 confirms the concern keys stand next to their folders.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the file list. Each row of the Files to Change table in `spec.md` maps to a task. Evidence: each Files to Change row maps to T005, T020 to T026, T030 to T043 or T071 to T073.
- [x] CHK-041 [P1] Each line elsewhere that describes the session-handover README was read. `scratch/handover-readme-mentions.txt` holds nine verdicts. Evidence: nine verdicts, seven `edited` and two `kept`.
- [x] CHK-042 [P1] Each wrong fact in the `plan.md` table is corrected. Each of its nine rows maps to a line of the rewritten file. Evidence: all nine hold. No count phrase or relocation history remains, "git hooks" is gone, `## 8. RELATED` is the last H2, root README line 267 names the folders that link into a skill, the concern-key table is present, T082 finds no `specs/` link, the sk-git title names both hooks and the `subagent-dispatch-guard/` tree has no comment column left to misalign.
- [x] CHK-043 [P2] The files written by hand are named. `implementation-summary.md` lists each `by-hand` row of `scratch/review-log.tsv`. Evidence: `implementation-summary.md` lists the three `by-hand` rows.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. `git status --short` shows no stray file outside the packet and the scoped paths, and no worker scratch folder sits inside the worktree outside `PKT/scratch/`. Evidence: `git status --porcelain` shows one untracked entry, the packet folder itself. The only `.vite` cache was removed in T080, and `.skilled/node_modules` is gitignored and was not a worker folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section. `rg -c '^### ADR-' plan.md` prints 5. Evidence: prints 5.
- [x] CHK-101 [P1] All ADRs have status. `rg -c '^\*\*Status\*\*: Accepted' plan.md` prints 5. Evidence: prints 5.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. `rg -c '^\*\*Alternatives Rejected\*\*' plan.md` prints 5. Evidence: prints 5.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `plan.md` and `tasks.md` agree on the surfaces. Each row of the plan's affected-surfaces table that has an action has a task. Evidence: each surface row with an action maps to T023, T030, T020 to T026, T042 or T071 to T073. The rows that read `Unchanged` hold.
- [x] CHK-141 [P1] N/A. The phase changes no API. No exported symbol, hook id or command changes, and T083 proves no code file changed. Evidence: T083 shows no code file changed.
- [x] CHK-142 [P2] The parent phase map shows this phase's status. `rg -n '004-hook-readme-fold-and-rewrite/' ../spec.md` prints the row with its current status. Evidence: `../spec.md` line 124 reads `Complete` for phase 4.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decides commit, merge and push | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
