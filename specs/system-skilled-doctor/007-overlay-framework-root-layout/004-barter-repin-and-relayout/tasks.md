---
title: "Tasks: Phase 4: barter-repin-and-relayout"
description: "Ordered tasks for one ai-speckit session: stage and run the re-pin of ai-speckit/skilled onto the Skilled commit carrying phases 1-3, verify and commit it, then at once relay out every overlay source, fix every old source path and commit that as the third step."
trigger_phrases:
  - "barter repin and relayout tasks"
  - "ai-speckit re-pin and relayout task list"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: barter-repin-and-relayout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

All commands run from the ai-speckit root, `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit`, in one session. Shell variables:
- `ENG` is `node .skilled/commands/doctor/scripts/overlay-engine.cjs`, always run inside `skilled/` as `(cd skilled && $ENG ...)`. Each `/doctor:overlay` target runs the same engine command behind the operator's yes.
- `UP` is `/Users/michelkerkmeester/MEGA/Development/Skilled`. `BO` is `skilled/barter-overlays`. `C` is the id on this phase's Target Skilled commit line.
- `S` is the session's own scratch folder, or `mktemp -d` when it has none. It is outside both repositories.
- `OFF` is the off-layout count, printed with the in-sync count: `(cd skilled && $ENG status --json) | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log("offLayout="+r.offLayout.length+" in-sync="+r.counts["in-sync"])})'`. Never count with `grep -c '^LAYOUT'`: status caps LAYOUT lines at 20 and its overflow line also starts with `LAYOUT`.
- `TESTS` is `node --test $(find $BO \( -name relayout-runs -o -name repin-runs \) -prune -o \( -name '*.test.cjs' -o -name '*.test.mjs' \) -print)`. It finds the test files at old and new paths alike.
- The probe, where `PROBE` is `$S/probe-<n>`: `mkdir -p "$PROBE/tree" "$PROBE/overlays" && printf '{ "overlayDir": "../overlays" }\n' > "$PROBE/tree/.skilled-overlays.json" && node -e 'const e=require(process.argv[1]); try { console.log(e.resolveOverlayDir(process.argv[2])) } catch (err) { console.log(err.message) }' "$PWD/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs" "$PROBE/tree"`

**Ordering guarantee**: from T010 (the live re-pin) to T020 (the relayout) no `--adopt` runs and no overlay source is edited, apart from T019's changelog record, which edits one existing source in place and adds no entry. T020 runs in this session directly after T019.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm phase 3 recorded the target commit (`$UP/specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md`). Verify: `rg -n 'Target Skilled commit: [0-9a-f]{40}' $UP/specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md` prints one line.
- [ ] T002 Confirm `C` exists upstream and descends from the current pin (`$UP`). Verify: `git -C $UP merge-base --is-ancestor b0a3b9f2edbf0dde902929b69c6db5afd051f418 $C` exits 0.
- [ ] T003 Record the starting working tree, which holds unrelated changes (`$S/porcelain-before.txt`). Verify: `git status --porcelain > $S/porcelain-before.txt && wc -l < $S/porcelain-before.txt` prints a count, written into this task line (79 on 2026-11-20).
- [ ] T004 Run the baseline through `/doctor:overlay status`, engine `(cd skilled && $ENG status)` (`$BO/overlay-manifest.json`). Verify: it prints `RESULT: PASSED` and exits 0, as in spec Measured Behavior.
- [ ] T005 Record the test baseline before any change (`tests/run-all.sh`, the `BO` test files). Verify: `bash tests/run-all.sh` and `$TESTS` both exit 0, and their pass and fail counts are written into this task line.
- [ ] T006 Run the probe with `PROBE=$S/probe-1` against the old engine (`skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: it prints `.skilled-overlays.json names a folder outside the tree root: ../overlays` (`overlay-engine.cjs:443`).
- [ ] T007 Confirm no relayout target or backup exists yet (`$BO`). Verify: `ls -d $BO/framework $BO/root $BO/relayout-runs` prints "No such file or directory" for all three.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T008 Start `/doctor:overlay repin --upstream $UP --to $C` and read its staged report; the route stages first on its own (`overlay.md:110`), engine `(cd skilled && $ENG repin --upstream $UP --to $C --stage $S/stage-1)` (`skilled/`). Verify: the report lists no blocked overlay other than `adopted-skilled-commands-doctor-routes-yaml` and no failed check, and `git status --porcelain | diff - $S/porcelain-before.txt` prints nothing.
- [ ] T009 Rebase `adopted-skilled-commands-doctor-routes-yaml` onto upstream `C`: take the new upstream text that phase 3 wrote at `_routes.yaml:699` into the copy's matching sentence at `:708`, keep Barter's own edits, and set `pinnedSha256` to the sha256 of the new upstream file (`$BO/skilled/commands/doctor/_routes.yaml`). Verify: `(cd skilled && $ENG repin --upstream $UP --to $C --stage $S/stage-2)` prints no `blocked` line and exits 0.
- [ ] T010 Answer yes and let the route run the live re-pin, engine `(cd skilled && $ENG repin --upstream $UP --to $C)` (`$BO/overlay-manifest.json`). Verify: it exits 0, prints its run id (written into this task line), and `node -p "require('./skilled/barter-overlays/overlay-manifest.json').pin.commit"` prints `$C`.
- [ ] T011 Record each `not-copied` and `STALE` line T010 printed, with its decision, in this task's note; defer every decision that needs an `--adopt` to its own change after T040, and halt and ask the operator on any `STALE` line, because it fails status and the commit gate and its fix is an overlay edit the ordering guarantee forbids here (`$BO/overlay-manifest.json`). Verify: the count of decisions in this note equals the count of `not-copied` plus `STALE` lines in the T010 output, and `git status --porcelain -- $BO` lists no source file T010 did not write.
- [ ] T012 Re-read through `/doctor:overlay status`, engine `(cd skilled && $ENG status)`, then `OFF` (`$BO/sync-state.json`). Verify: status prints `RESULT: PASSED` and exits 0, the `compiled-routing-byte-parity` and `repin-survival` verify steps (`$BO/overlay-manifest.json:1536-1560`) are on no `MISS` line, and `OFF` prints `offLayout=` at least 131 and an in-sync count, both written into this task line.
- [ ] T013 Run a second apply, engine `(cd skilled && $ENG apply)` (`$BO/sync-state.json`). Verify: it prints `0 changed` and exits 0.
- [ ] T014 Run `/doctor:update record-base`, the next step `overlay.md:116` names after a clean re-pin (`skilled/.skilled/skills/.state/doctor-update/base.json`). Verify: the workflow ends with a `STATUS=OK` line; the exact wording is UNKNOWN until it runs.
- [ ] T015 Run the probe with `PROBE=$S/probe-2` against the new vendored engine (`skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: it prints a resolved label for `../overlays` and no `names a folder outside the tree root` line; the label's exact form is phase 1's and is UNKNOWN until it lands.
- [ ] T016 [P] Run every overlay test on the new pin (`$BO/**/*.test.cjs`, `$BO/**/*.test.mjs`). Verify: `$TESTS` exits 0 and prints `# fail 0`.
- [ ] T017 [P] Run CI's suite on the new pin (`tests/run-all.sh`). Verify: `bash tests/run-all.sh` exits 0.
- [ ] T018 Commit the re-pin through Barter's commit flow, staging only the paths the re-pin and T009 wrote (`skilled/`, `.index/` when it changed). Verify: `node skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --check "<the git add command>" --cwd .` allows it, `git diff --cached --stat` names no path outside them, and `git log -1 --format=%s` prints `chore(overlays): re-pin Skilled to <first 7 of C>`.
- [ ] T019 Record the re-pin in the current release entry at its old source path and commit it (`$BO/skilled/changelog/skilled-coder/v4.1.0.0.md`, or whichever entry is current). Verify: `git log -1 --format=%s` prints `docs(changelog): record the <first 7 of C> re-pin in <that release>`, and `git status --porcelain | diff - $S/porcelain-before.txt` prints nothing.
- [ ] T020 Run `/doctor:overlay apply --relayout` at once and answer yes; the route then runs `apply` itself (`overlay.md` step 11) (`$BO/overlay-manifest.json`). Verify: the engine prints `backup barter-overlays/relayout-runs/<stamp>`, one `moved` line per copy, two `relinked` lines, then `N moved` with N equal to the count of `moved` lines, `rg -n '"source": "skilled/' $BO/overlay-manifest.json` prints nothing, and `node -e 'const m=require(process.argv[1]); const bad=m.overlays.flatMap(e=>[e.source,e.fragment,e.base]).filter(v=>typeof v==="string"&&!/^(framework|root)\//.test(v)); console.log("off-rule="+bad.length)' "$PWD/$BO/overlay-manifest.json"` prints `off-rule=0`.
- [ ] T021 Run a separate apply as the destination check, engine `(cd skilled && $ENG apply)` (`$BO/sync-state.json`). Verify: it prints `0 changed`, `OFF` prints `offLayout=0` and the in-sync count from T012, `git status --short -- skilled ':!skilled/barter-overlays'` adds only `skilled/.skilled/changelog/sk-git-skilled` and `skilled/.skilled/changelog/skilled-coder` to the T019 state, and `git diff $BO/sync-state.json` shows at most the two link records, now naming `../../barter-overlays/framework/...`.
- [ ] T022 Point the guard path at the framework source, `'..','skilled','bin',...` to `'..','framework','bin',...` at `:16` (`$BO/tests/compiled-route-guard.test.cjs`). Verify: `node --test $BO/tests/compiled-route-guard.test.cjs` exits 0.
- [ ] T023 Add one `..` and name `framework/skills/sk-git/...` at the climb on `:24` (`$BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs`). Verify: `node --test $BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` exits 0.
- [ ] T024 Name `framework/hooks/...` at `:41` and add `root\/` to the refusal regexes at `:102,109` (`$BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs`). Verify: `node --test $BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` exits 0.
- [ ] T025 Check each fixture source path at `:149-201` against the new rule and fix the ones that name an old source (`$BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`). Verify: `node --test $BO/framework/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs` exits 0.
- [ ] T026 Make the new mode's source `framework/skills/sk-code/...` in `MODE_REL` (`:40`), the inline source rule (`:58`) and the next-step text (`:113-114,124-127`, including the bare `skilled/skills/sk-code/assets/router-source.json` at `:127`) (`init-repository.sh`). Verify: `rg -n 'destination.slice\(1\)|barter-overlays/skilled/|MODE_REL="skilled/|(^|[^./])skilled/skills/sk-code/assets' init-repository.sh` prints nothing.
- [ ] T027 Change the source segment after `barter-overlays/` to `framework/skills/sk-code/...` at `:41,47,53,63,64,70,97`, keeping the folder name (`tests/init-repository.test.sh`). Verify: `bash tests/init-repository.test.sh` exits 0, and `rg -n 'barter-overlays/skilled/|"source": "skilled/|source !== "skilled/' tests/init-repository.test.sh` prints nothing.
- [ ] T028 Change the mode paths the test expects at `:169-173` to `barter-overlays/framework/skills/sk-code/...`, keeping the folder name (`tests/node-version-policy.test.sh`). Verify: `bash tests/node-version-policy.test.sh` exits 0.
- [ ] T029 Restate the source rule at `:54,426-432`, redraw the layout tree at `:434-452` as `framework/` and `root/`, and update the source paths at `:139,202,214,234,357,458` (`$BO/README.md`). Verify: `rg -n 'leading dot dropped|barter-overlays/(skilled|opencode|pi|vibe)/' $BO/README.md` prints nothing, and the tree lists `framework/` and `root/`.
- [ ] T030 Name `skilled/barter-overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md` at `:324` and fix the source path at `:327` (`$BO/root/AGENTS.md`). Verify: `rg -n 'barter-overlays/(skilled|opencode|pi|vibe)/' $BO/root/AGENTS.md` prints nothing.
- [ ] T031 Restate the rule at `:50,59` and update the source paths at `:48,52,101,146` (`$BO/framework/repo-rules/barter-overlay-first.md`). Verify: `rg -n 'leading dot dropped|without the leading dot|barter-overlays/(skilled|opencode|pi|vibe)/|barter-overlays/(AGENTS|REPO RULES)\.md' $BO/framework/repo-rules/barter-overlay-first.md` prints nothing.
- [ ] T032 Update the source paths in the sk-git and sk-code docs, the five that name `barter-overlays/skilled/` or `barter-overlays/opencode/` and every other hit b-barter lists, each checked against the rule (`$BO/framework/skills/`). Verify: `rg -n 'barter-overlays/(skilled|opencode|pi|vibe)/' $BO/framework/skills` prints nothing.
- [ ] T033 Change only the source segment after `barter-overlays/` to `framework/skills/...` at `README.md:105,428`, `CONTRIBUTING.md:26-171` and `developer-questions.md:7`, keeping the folder name for phase 5 (`README.md`, `CONTRIBUTING.md`, `developer-questions.md`). Verify: `rg -n 'barter-overlays/(skilled|opencode|pi|vibe)/' README.md CONTRIBUTING.md developer-questions.md` prints nothing.
- [ ] T034 Write the destinations of the edited sources through `/doctor:overlay apply` (`skilled/.skilled/`, `skilled/AGENTS.md`, `skilled/.cursor/rules/repo-local.md`). Verify: `(cd skilled && $ENG apply)` exits 0, and `rg -n 'barter-overlays/skilled/' skilled/AGENTS.md skilled/.cursor/rules/repo-local.md` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T035 Run status on the final state, then a second apply (`$BO/overlay-manifest.json`). Verify: `(cd skilled && $ENG status)` prints `RESULT: PASSED` and no line starting `LAYOUT`, `OFF` prints `offLayout=0`, and `(cd skilled && $ENG apply)` prints `0 changed`.
- [ ] T036 [P] Run every overlay test and CI's suite on the new layout (`$BO/**/*.test.cjs`, `$BO/**/*.test.mjs`, `tests/run-all.sh`). Verify: `$TESTS` exits 0 with `# fail 0`, `bash tests/run-all.sh` exits 0, and neither shows a failure absent from T005.
- [ ] T037 Grep for any old source path left (`ai-speckit/`). Verify: `rg -n --hidden 'barter-overlays/(skilled|opencode|pi|vibe)/|barter-overlays/(AGENTS\.md|REPO RULES\.md|opencode\.json|utcp_config\.json)' --glob '!specs/**' --glob '!**/changelog/**' --glob '!.index/**' --glob '!.git/**' --glob '!**/relayout-runs/**' --glob '!**/repin-runs/**' .` prints nothing, and `rg -n '"source": "skilled/' $BO/overlay-manifest.json` prints nothing.
- [ ] T038 Confirm the relayout moved the three hook sources without changing a byte, before commit 3 (`$BO/framework/hooks/`, `$BO/framework/skills/sk-git/scripts/hooks/`, `$BO/root/opencode/scripts/git-hooks/`). Verify: `for f in framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs root/opencode/scripts/git-hooks/pre-commit:opencode/scripts/git-hooks/pre-commit; do [ "$(git hash-object $BO/${f%%:*})" = "$(git rev-parse HEAD:$BO/${f#*:})" ] && echo same; done` prints `same` three times.
- [ ] T039 Commit the relayout and its path fixes through Barter's commit flow, staging with a plain `git add -- <paths>` and no `-A` or pathspec magic, which the git-write gate refuses while another track has changes (`barter-git-write-gate.mjs:964`): `$BO/framework $BO/root $BO/skilled $BO/opencode $BO/pi $BO/vibe $BO/AGENTS.md "$BO/REPO RULES.md" $BO/opencode.json $BO/utcp_config.json $BO/overlay-manifest.json $BO/sync-state.json $BO/README.md $BO/tests skilled/.skilled skilled/AGENTS.md skilled/.cursor/rules/repo-local.md init-repository.sh tests README.md CONTRIBUTING.md developer-questions.md`, plus `.index/` when it changed. Verify: `node skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --check "<that git add command>" --cwd .` allows it, `git diff --cached --stat` lists no path under `relayout-runs/`, `git show --stat HEAD` lists none either, and `git log --format=%s -3` prints this commit above the T019 and T018 subjects.
- [ ] T040 Delete the relayout backup once verification has passed (`$BO/relayout-runs/`). Verify: `ls $BO/relayout-runs` prints "No such file or directory", and `git status --porcelain | diff - $S/porcelain-before.txt` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] On pin `C`, `(cd skilled && $ENG status)` prints `RESULT: PASSED` and `OFF` prints `offLayout=0`, the parent's 004-to-005 handoff check
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`, `../scratch/design-notes.md` ("Barter sequencing") and `../scratch/inventory/b-barter.md` section A, "Phase 004, relayout part"
- **Command**: `.skilled/commands/doctor/overlay.md` in the Skilled checkout, for the `status`, `repin` and `apply --relayout` routes
<!-- /ANCHOR:cross-refs -->

---
