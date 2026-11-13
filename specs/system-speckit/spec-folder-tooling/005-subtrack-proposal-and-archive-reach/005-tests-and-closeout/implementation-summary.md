---
title: "Implementation Summary"
description: "Five vitest suites with 33 cases now cover the relocation engine, the sub-track proposal, archive numbering and the two archive modes. The full suite passes with 5 files and 34 tests more than the baseline and no failure. Ten acceptance criteria are Met and one is Superseded by a decision record."
trigger_phrases:
  - "tests and closeout implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout"
    last_updated_at: "2026-11-13T15:00:54Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phases 004 and 005 and set all five phases to Complete"
    next_safe_action: "Review the branch, then decide on push and merge"
    blockers: []
    key_files:
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout/tasks.md"
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/005-tests-and-closeout/acceptance-criteria.md"
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-tests-and-closeout"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "ea5a4165-ad5f-43b5-9127-8fda5eee165b"
      workspace: "/Users/michelkerkmeester/worktrees/public/364-subtrack-proposal-archive-reach"
      savedAt: "2026-11-13T15:00:54Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-tests-and-closeout |
| **Completed** | 2026-11-13. Suites committed as `5fefd819e1` and `36b3a68ab7`. Closed with ten criteria `Met` and AC-008 `Superseded` by ADR-001 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Five new vitest suites with 33 cases now fail when the relocation engine, the sub-track proposal, archive numbering, archive search or archive validation breaks. The full `npm test` run exits 0 with 211 files and 2558 tests passed, which is 5 files and 34 tests more than the baseline, and 0 failed in both runs.

### Phase 5: tests-and-closeout

You can now change `relocate.mjs`, `suggest-subtracks.mjs`, the numbering in `create.sh`, `rg-wrapper.mjs` or `validate.sh` and get a red test when the behavior of phases 001 to 004 breaks. Each suite builds its own tree in a temp directory and removes it, so no run moves or writes a file in the real repository.

The phase also ran the checks of the approved plan outside vitest. The sample map passed as a dry run on the real tree and applied in a throwaway clone, where a second apply had nothing to do. The sweep is clean, and the archive-only phrase is found only with `--include-archive`. No production file changed in this phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Created | 12 cases: move, renumber, re-parent, five refusals each asserting exit 2 and an unchanged tree, dry run by default, a second apply that changes nothing, an empty map as nothing to do and an inbound reference rewrite with the prefix-id pair |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts` | Created | 6 cases: the whole-track map, the threshold, a track that holds no packets, the present-time fit, a missing track and an unchanged tree |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-numbering.vitest.ts` | Created | 4 cases: specs root, track, sub-track and a lower-only archive |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts` | Created | 6 cases: the default vector, the archive vector in parity with the shared lane, the archive-only phrase, the label beside a live hit, the metadata lane and the argument parsing |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-archive-recursive.vitest.ts` | Created | 5 cases: an archived packet at track, sub-track and phase depth, the flag without `--recursive` and a symlinked `z_archive` |
| `scratch/final-npm-test.txt` | Created | The summary lines of the final `npm test` run |
| `decision-record.md` | Modified | ADR-001, which accepts the fixture track for AC-008 on the operator's answer Q003 |
| The documents of this phase and of phase 004, the parent `spec.md` phase map and the `goal.md` logs | Modified | Evidence, closed rows and phase states |
| `spec.md` and `acceptance-criteria.md` of phases 001 to 003 | Modified | The status field only, set to Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

DeepSeek V4.1 Flash wrote the five suites through the dsh harness, one file per dispatch. Each worker changed one expected value, saw its suite fail with 1 failed, restored it and saw it pass, with the failing output in its report. The orchestrator then ran the five files together, 31 passed and exit 0, and did not repeat the break. `subtrack-tree.mjs` was not changed. The suites are in commit `5fefd819e1`. Commit `36b3a68ab7` then added one empty-input case each to `relocate.vitest.ts` and `suggest-subtracks.vitest.ts`. Both pass, and the five files hold 33 cases.

The orchestrator ran the full `npm test` next and saved its summary in `scratch/final-npm-test.txt`. It then ran the real-tree checks in this order: the sample map as a dry run on the real tree, the same map with `--apply` twice in a throwaway clone of the final commit, the proposal on a 10-packet fixture track in that clone, the sweep on this worktree and the archive-only phrase with and without `--include-archive`. A Fable 5.2 documents worker recorded the evidence and ran the strict recursive validation.

The closeout came after that. The orchestrator regenerated the trigger index and committed it as `f1cfed3d20`, and `generate-trigger-index.mjs --check` then exited 0 with 0 untrusted docs. It reran the full `npm test` at that commit and replaced `scratch/final-npm-test.txt`. It deleted the throwaway clone. A final Fable 5.2 documents worker wrote ADR-001, closed the open rows, set the five phases and the parent to Complete and ran the strict recursive validation last.

The branch `worktrees/364-subtrack-proposal-archive-reach` holds ten commits, in order: `fc218a0d48` for the phase 001 code, `1dab14c217` for the plan, `b8912b831c` for the phase 002 code, `3f2c1f9d61` for the phase 002 documents, `5f3e19712e` for the phase 003 code and 40 keep files, `ccfb6a5313` for the phase 002 and 003 documents, `05a83a7d88` for the phase 004 code, `55e73d37b5` for the regenerated metadata, `a637944644` for the phase 004 documents and `5fefd819e1` for these suites. Three later commits follow: `36b3a68ab7` for the two empty-input cases, `c21b0cc040` for the closeout documents and `f1cfed3d20` for the trigger index. The final closeout edits are not committed. Nothing is pushed or merged.

Three operator decisions of this session are recorded in `decision-record.md`, each asked through the question tool. Two shaped phase 004 and are part of the state these suites test: "Commit everything, add hook" for the description cache and "Fix repair-derived" for the archived parent ids. The third, "Accept the fixture (Recommended)", is Q003 and closes AC-008 through ADR-001.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| One file per dispatch | Each worker owned one suite, so a failing case pointed at one file and one report |
| Stub the follow-up tools in `relocate.vitest.ts` | As built: the temp repository runs the real `relocate.mjs`, `refresh-track-roots.mjs` and `lib/track-roots.mjs`. The six other tools the engine calls afterwards are stubs there. Why the worker chose stubs was not recorded. The clone run covers the full chain |
| Leave `subtrack-tree.mjs` unchanged | No suite needed an archived packet option in the shared builder. Four suites build their trees with their own helpers |
| Run the proposal check on a fixture track | No real flat track holds more than eight live packets. The largest, `cli-classifier`, holds 6. Phase 002 used the same 10-packet fixture |
| Mark AC-008 `Superseded` and not `Met`. Operator decision | The row says a real flat track and was not observed on one. The operator accepted the fixture, recorded as Q003 and ADR-001 in `decision-record.md`. `Superseded` keeps the criterion as written and names the decision that replaces it |
| Leave the "deeper than one sub-track" message alone | The worker noted that this message in `checkDestinationShape` looks unreachable because an earlier check refuses first. It is an observation and no case fails on it. This phase changes no production code |
| Check the search through the wrapper | `rg-wrapper.mjs` is the wrapper `/speckit:search` documents, so it was run directly. The slash command itself was not run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

Every row is an orchestrator run of 2026-11-13 unless it names another source.

| Check | Result |
|-------|--------|
| Baseline before the packet's first edit, `../001-relocation-engine/scratch/baseline.txt` | Exit 0. 206 files passed and 3 skipped, 2524 tests passed and 20 skipped, 0 failed |
| The five new files run together, at commit `5fefd819e1` | 31 passed, exit 0: 11, 5, 4, 6 and 5 cases |
| The two empty-input cases of commit `36b3a68ab7` | "treats an empty map as nothing to do" and "prints no map for a track that holds no packets" both pass. The five files now hold 12, 6, 4, 6 and 5 cases, 33 in all |
| Build dispatches: each suite seen failing once | Each worker changed one expected value, saw 1 failed, restored it and saw the pass. Reported by the workers with the failing output. Not repeated by the orchestrator |
| `npm test`, final at commit `f1cfed3d20`, in `scratch/final-npm-test.txt` | Exit 0. 211 files passed and 3 skipped, 2558 tests passed and 20 skipped, 0 failed in every legacy stage. Delta: 5 files and 34 tests more, 0 failures in both |
| Real tree: `relocate.mjs --map 001-relocation-engine/scratch/sample-map.json` | Exit 1 with `moves=1 moved=0 rewrites=33 identity=1 roots=3 ledger=1`. `git status --porcelain` identical before and after |
| Clone with its own runtime build: the same map with `--apply` | Exit 0 with "applied 1 move(s)", sweep ok and validate `RESULT: PASSED` for the moved packet |
| Clone: a second `--apply` | Exit 0 with "nothing to do" |
| Earlier clone that borrowed the worktree's build | Failed at the repair step with "dist is stale". The same map rerun after a build finished the move with "finished 1 earlier move(s)", which also shows the resume path |
| Clone: `suggest-subtracks.mjs --track demo` on a committed 10-packet fixture track | Exit 0 with a 10-entry map |
| Clone: `relocate.mjs --map` on that map | Exit 1, not 2, with `moves=10 moved=0 rewrites=11 identity=10 roots=3 ledger=10` |
| `sweep-track-roots.mjs` on this worktree | Exit 0 with "all track roots match their declared children" and no missing-archive line |
| `rg-wrapper.mjs path "skill routing refactor"` | Exit 1 with 0 paths |
| The same with `--include-archive` | Exit 0 with 2 paths under `specs/sk-doc/z_archive/019-skill-routing-refactor/`, each ending `[archived]` |
| Goal criterion 3: the `find` for sub-track archives | 40 paths |
| Goal criterion 4, in the clone: `create.sh --track demo --skip-branch` beside a live `specs/demo/001-a` and an archived `specs/demo/z_archive/007-b` | Created `008-next-one`. `archive-numbering.vitest.ts` asserts the same |
| `generate-trigger-index.mjs --check`, after the index was regenerated and committed as `f1cfed3d20` | Exit 0 with 0 untrusted docs |
| The throwaway clone, after `rm -rf` | `ls` on its path printed "No such file or directory" |
| Closeout worker: a search of the five test files | No `git mv`, no spec path, no task id and no requirement id. The one `.env` string is a path to an absent file in the temp root. A reading, not a run |
| Final closeout worker: every line of `relocate.vitest.ts`, `rg-include-archive.vitest.ts` and `suggest-subtracks.vitest.ts` | Each case asserts an exit code, script output, a built argument vector or the tree on disk. No case only re-asserts a framework or language guarantee. A reading, not a run |
| Final closeout worker: `rg -c "\| Unmet \|"` over the five `acceptance-criteria.md` files | Printed nothing |
| Closeout worker: the unfilled-token search of `tasks.md` T016 over the five `implementation-summary.md` files | Printed nothing |
| Final closeout worker: `validate.sh` on the packet with `--strict --recursive`, after the last document edit | `RESULT: PASSED` six times |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **`relocate.vitest.ts` does not run the full chain.** Its temp repository runs the real `relocate.mjs`, `refresh-track-roots.mjs` and `lib/track-roots.mjs`. `repair-derived.cjs`, `sweep-track-roots.mjs`, `validate.sh`, `migrate-generated-json`, `generate-trigger-index.mjs` and `cite-drift-scan.mjs` are stubs there. After a change to one of them, apply a sample map in a throwaway clone with its own runtime build.
2. **No real track has exercised the proposal.** The whole-track map was checked on a 10-packet fixture. The operator accepted that through ADR-001, so AC-008 is `Superseded` and not `Met`. Run `suggest-subtracks.mjs` on the first real flat track that grows past eight live packets and pass its map to `relocate.mjs --map` as a dry run.
3. **The trigger index goes stale when a document changes.** The check exited 0 at `f1cfed3d20`. It was not rerun after the final closeout edits to these documents. Run `generate-trigger-index.mjs --check` before the branch is pushed, and regenerate the index when it exits 1.
4. **The break-and-restore check was not repeated.** Each worker reported its suite failing once with the output. The orchestrator ran only the passing state. The two empty-input cases of commit `36b3a68ab7` have no recorded failing run.
5. **A clone needs its own runtime build.** A clone that borrowed the worktree's build failed at the repair step with "dist is stale". Run the build in the clone before `--apply`.
6. **One message in `relocate.mjs` looks unreachable.** The "deeper than one sub-track" message in `checkDestinationShape` sits behind an earlier refusal. It was left alone and no case targets it.
7. **Three search cases skip without ripgrep.** The search behavior cases of `rg-include-archive.vitest.ts` use `it.skipIf` when ripgrep is missing, so a green run on a machine without it proves only the recipe shape and the argument parsing.
8. **The CHK-012 row rests on two readers.** The orchestrator read two of the five test files in full and the final closeout worker read the other three. Neither is a run.
<!-- /ANCHOR:limitations -->

---
