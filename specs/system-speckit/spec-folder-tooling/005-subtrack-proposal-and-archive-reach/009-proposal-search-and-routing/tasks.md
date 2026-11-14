---
title: "Tasks: Phase 9: proposal-search-and-routing"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "proposal search and routing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: proposal-search-and-routing

<!-- SPECKIT_LEVEL: 1 -->

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

`K` is `.skilled/skills/system-spec-kit`. `C` is `$K/runtime/cli`. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `RG` is `node $C/retrieval/rg-wrapper.mjs`. `V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `$C`. `PIN` is the scoring regime of `$ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`, lines 53 to 61. `SCORE` is the command in `spec.md` section 4 that prints one prompt's ranked skills under `PIN`. `SCRATCH` is a `mktemp -d` copy of the tooling with its own git repository, deleted when the phase closes. Build it by copying `.skilled` without any `node_modules` folder and linking `.skilled/skills/system-spec-kit/node_modules`, which is 504M, into the copy.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce A11, A12, B7 and B8 and save each command with its output and exit status, the A12 runs in `SCRATCH` and the B7 and B8 scores from `SCORE` with three control prompts, one that asks for work on the sk-code skill itself, `track down why a vitest suite is flaky` and `keep track of the open review comments` (`scratch/reproduce.txt`). Verify: `rg -c '^## (A11|A12|B7|B8)' scratch/reproduce.txt` prints 4, and each section shows what the review reports or states the difference. Evidence: scratch/reproduce.txt holds the B7 and B8 scores; A11 and A12 were reproduced as failing tests, see scratch/build-evidence-code.md.
- [x] T002 List every reader of the path recipe's JSON record (`scratch/path-record-readers.txt`). Verify: `rg -n 'rg-wrapper' .skilled --glob '!*.vitest.ts' --glob '!node_modules/**'` output is saved with one line per reader saying how it reads `paths`. Evidence: scratch/path-record-readers.txt: no production reader reads paths.
- [x] T003 Save the suite baseline and the scorer baseline before any edit (`scratch/baseline.txt`). Verify: the file holds the output of `V tests/rg-include-archive.vitest.ts tests/rg-wrapper-recipes.vitest.ts tests/suggest-subtracks.vitest.ts` with `exit=0`, and the JSON that `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` prints. Evidence: scratch/baseline.txt: 39 passed, exit 0, and the scorer JSON.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing cases for the path record: an archive-only phrase and a live-only phrase (`$C/tests/rg-include-archive.vitest.ts`). Verify: `V tests/rg-include-archive.vitest.ts` fails on the archive-only case only. Evidence: scratch/build-evidence-code.md.
- [x] T005 Name the archived paths in the JSON record of the path recipe (`$C/retrieval/rg-wrapper.mjs`). Verify: `RG path "sk-doc agent template alignment" --include-archive --json --limit 2 | node -e 'const r=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(r.paths.length,(r.archivedPaths||[]).length)'` prints `2 2`, where it printed `2 0` before the change. Evidence: COUNT printed 2 2, 2 0 before.
- [x] T006 Add the failing cases that feed the printed map to the relocate preflight: an undeclared folder with the group's name, and a packet named `003_under` (`$C/tests/suggest-subtracks.vitest.ts`). Verify: `V tests/suggest-subtracks.vitest.ts` fails on the two new cases only. Evidence: scratch/build-evidence-code.md.
- [x] T007 Seed the used group names with every existing folder of the track (`$C/spec/suggest-subtracks.mjs`). Verify: in `SCRATCH`, `relocate.mjs --map <printed map>` exits 1 for the track with the undeclared folder. Evidence: scratch/build-evidence-code.md.
- [x] T008 Report a packet not named `NNN-slug` and print no map (`$C/spec/suggest-subtracks.mjs`). Verify: in `SCRATCH`, `suggest-subtracks.mjs --track demo` prints a line that names `003_under`, prints no map and exits 0. Evidence: scratch/build-evidence-code.md.
- [x] T009 Reword the archive-search signal so no word of four or more letters in it sits inside `findings` or `research`, and it uses none of `find`, `search`, `locate` (`$K/graph-metadata.json`). Verify: under `PIN`, the system-spec-kit score for the `rr-iter3-135` prompt equals its score with the signal removed, and `SCORE` for `look up a phrase in the archived spec packets` returns system-spec-kit first. Evidence: Signal now "quote a phrase in archived spec packets"; rr-iter3-135 score equal with and without it (0.613602). scratch/after.txt.
- [B] T010 Reword the sub-track signals until the three track prompts route to system-spec-kit, or mark this task `[B]` and write the question in `goal.md` (`$K/graph-metadata.json`). Verify: under `PIN`, `suggest sub-tracks for the sk-code track`, the sk-git form and the sk-doc form each return system-spec-kit first, the three T001 control prompts keep their top skill, no signal added or reworded holds a skill or track name, and every corpus row whose top skill changed is listed in `goal.md` section 4 as a sub-track or archive request. A new divergence in `$ADV/tests/parity/fixtures/local-native-approved-divergences.json` marks this task `[B]`, and that file is not edited. Evidence: Blocked: the best wording without a skill or track name left the sk-code prompt 0.017779 short and was reverted. Question for the operator in goal.md. scratch/after.txt.
- [x] T011 Take `origin/main` into the branch, then regenerate the compiled skill graph with its writer (`$ADV/scripts/skill-graph.json`). Verify: `git merge-base --is-ancestor origin/main HEAD` exits 0, `python3 $ADV/scripts/skill_graph_compiler.py --export-json` exits 0 and `git diff --stat -- $ADV/scripts/skill-graph.json` lists the file. Evidence: origin/main merged as a30d7c01e8; compiler --export-json exit 0. scratch/build-evidence-signals.md.
- [x] T012 Recapture the scorer baseline with its writer if a number moved (`$ADV/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` output differs from `scratch/baseline.txt` only in the numbers listed in `goal.md` section 4, or does not differ. Evidence: Full corpus 161 to 160, only rr-iter3-135 moved; recaptured with --write.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the four reproductions from T001 (`scratch/after.txt`). Verify: `rg -c '^## (A11|A12|B7|B8)' scratch/after.txt` prints 4 and each section shows the output its requirement names. Evidence: scratch/after.txt has the four sections.
- [x] T014 Confirm the text output of the path recipe is unchanged (`$C/retrieval/rg-wrapper.mjs`). Verify: `RG path "sk-doc agent template alignment" --include-archive --limit 2` prints the same lines as the copy saved in `scratch/reproduce.txt`. Evidence: Text output compared old against new: identical, 14 lines (scratch/path-record-readers.txt).
- [x] T015 Run the three suites and compare with the baseline (`scratch/baseline.txt`). Verify: `V tests/rg-include-archive.vitest.ts tests/rg-wrapper-recipes.vitest.ts tests/suggest-subtracks.vitest.ts` exits 0 and its passed count is the baseline count plus the new cases. Evidence: 43 passed against a baseline of 39, exit 0; full CLI suite 2599 passed, 0 failed.
- [x] T016 Run the two ratchet suites of the advisor (`$ADV/tests/parity/scorer-eval-baseline-ratchet.vitest.ts`). Verify: from `$ADV`, `node_modules/.bin/vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts` exits 0 with both files passed, `git diff --stat -- $ADV/tests/parity/fixtures/local-native-approved-divergences.json` prints nothing, and the output is saved in `scratch/after.txt`. Evidence: Parity suites 8 files, 64 passed, exit 0; full advisor suite 1716 passed.
- [x] T017 Confirm no added code comment names a spec path, a packet number or a finding id (`$C/spec/suggest-subtracks.mjs`). Verify: `git diff -U0 -- $C/retrieval $C/spec $C/tests` shows no added comment line with such a label. Evidence: Added comment lines checked: no spec path, packet number or finding id.
- [x] T018 Validate this phase folder (`spec.md`). Verify: `bash $C/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`. Evidence: validate.sh --strict prints RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T010 is blocked)
- [x] No `[B]` blocked tasks remaining, or T010 is blocked with the operator's answer recorded in `goal.md` - T010 is blocked and its question is in goal.md
- [x] Manual verification passed
- [ ] `scratch/after.txt` shows marked archived paths, a map the preflight accepts and system-spec-kit first for the three track prompts - not met for the three track prompts, T010 is blocked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `../scratch/review-20261114-core-code.md` and `../scratch/review-20261114-merge-fixes-and-hub-vocabulary.md`
<!-- /ANCHOR:cross-refs -->

---
