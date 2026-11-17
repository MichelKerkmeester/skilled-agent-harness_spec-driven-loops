---
title: "Implementation Summary: Phase 17: review-pass-two-remediation"
description: "Built and verified on 2026-11-13. The 27 P2 findings of review pass two are fixed in nine worker lanes and one coordinator edit, plus four verifier follow-ups. Every floor equals its before line, the advisor suite rose from 1758 to 1796 passed tests and all 30 acceptance rows are Met. The changes sit uncommitted in the working tree on base commit ec1869dae8."
trigger_phrases:
  - "review pass two remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation"
    last_updated_at: "2026-11-13T17:42:15Z"
    last_updated_by: "claude"
    recent_action: "Closed out phase 017, all floors equal and 30 of 30 rows Met"
    next_safe_action: "Commit the phase, then build phase 018"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/tasks.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/acceptance-criteria.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/scratch/after.txt"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/scratch/repro-after.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-review-pass-two-remediation"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "96fe92f2-be24-4324-9bfc-fe4422c8760b"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-13T17:42:15Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The widened no-edit pattern moved no holdout aggregate: EVAL reads [160,50,21,5] before and after"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 17: review-pass-two-remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-review-pass-two-remediation |
| **Completed** | 2026-11-13. AC-001 to AC-030 are `Met` |
| **Commit** | Not committed. The changes sit in the working tree on base commit `ec1869dae8` |
| **Level** | 2 |
| **Verified on** | `scratch/before.txt` ran at `ec1869dae8` before any change. `scratch/after.txt`, `scratch/after-vall.log` and `scratch/repro-after.txt` ran on the working tree over `ec1869dae8` with the changes uncommitted. The close-out reran the read-only checks named below from the same tree on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt that rules out a change in a common wording now gets no command on the hub path or the scorer path. A backfill runs no code from a folder it cannot trust. The restore removes a created file whatever its name holds. The doctor checks read a hook launch the way a shell runs it. The docs, playbook notes, catalog citations and doctor contracts say what the code does. No floor moved.

### Fix the 27 P2 findings of review pass two

- **WG1, the shared no-edit gate.** `command-attach.ts` exports `isNoEditRequest`, which folds curly apostrophes to straight ones and tests the widened `NO_EDIT_REQUEST`. `attachCommand`, both scorer gates in `fusion.ts` and `isReadOnlyExplainer` in `text.ts` call it, so `text.ts` holds no copy of the wording now. The status privacy case stores a record and checks status hides it. The attach test lost its assertion that never reached a gate. The command-bridges README names all four `CommandRow` fields, held by a test. `tsString` escapes LF, CR, U+2028 and U+2029 and is exported for its new round-trip test.
- **WG2, behaviour runner replay and restore.** `trustedCheckout` lets the backfill warm and replay only the project root or a folder holding `.git/skilled-behaviour-arena`, and any other line gets `offerError` `untrusted_checkout`. `statusSnapshot` reads `git status --porcelain -z`. An exported `armFor(options, rowIds)` runs started-command rows under `g2` and refuses a mix with `mixed_row_arms`. A g2 run line records its `fixture`, and `lineFixture` replays it.
- **WG3, measurement hygiene.** `scoreCommandCorpus` restores the nine `ENV9` variables in its `finally`. The cost script removes `AI_SESSION_CHILD` from each hook's environment.
- **WG4, transcript scorer and README.** The session form refuses `--row-id` with exit 2. The header says the scorer prints counts and verdicts per runtime and arm. The routing-accuracy README names `untrusted_checkout`, `trustedCheckout`, the g2 arm rule, `mixed_row_arms`, the recorded `fixture` and the cost script's child flag.
- **WG5, playbook and tests README.** The inventory note states 50 scenario files and none named `NNN-*.md`. The persistence paragraph names the folder results are recorded in by hand. The tests README calls the playbook test the inventory test.
- **WG6, OpenCode plugin.** The unread `compiledRouteSummary` function and its metadata field are gone. The bounding option's jsdoc says it only sets a status field. Both delivery paths have a test that asserts the `sk-doc → /create:agent (start)` head.
- **WG7, subprocess and catalog.** The stderr handler scans each chunk with a 64-character carry for the busy marker before the cap, so a marker past 1 MiB or split across two writes gets the one retry. The catalog page cites its schema and handler anchors by symbol.
- **WG8, doctor contracts.** The embed workflow gives `ERROR: the restore failed` its own exit-3 outcome. The workflow and the route name the backup folder by the first 16 characters of the plan digest, and the route names the temporary-directory fallback. `setup.md` gives the workflow's reason for absent hook health and no longer names `SKILL_ADVISOR_DEBUG`.
- **WG9, doctor checks.** `hook-wiring-check.cjs` splits a command into simple commands outside quotes and reads `env`, `bash`, `sh` and `zsh` wrappers. A10 counts only `PASS` copies as expected and names report-only copies apart.
- **WG10, coordinator.** Parent phase map row 7 says why it stays open. Rows 14 and 15 read `Complete`.

### Files Changed

`git diff ec1869dae8 --stat -- .skilled .opencode` reads 41 files changed, 958 insertions and 112 deletions. One new 33-line test file is untracked.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `lib/scorer/text.ts`, `lib/scorer/fusion.ts` | Modified | `isNoEditRequest` and its three callers (WG1) |
| `runtime/tests/command-attach-guards.vitest.ts`, `tests/scorer/read-only-explainer.vitest.ts`, `tests/command-meaning-anchor.vitest.ts`, `tests/command-attach.vitest.ts`, `tests/handlers/advisor-status.vitest.ts` | Modified | No-edit cases, README field check, deleted assertion, stored privacy record (WG1) |
| `runtime/scripts/command-bridges/derive-command-bridges.cjs`, `scripts/command-bridges/README.md` | Modified | Escaped and exported `tsString`, row field sentence (WG1) |
| `runtime/tests/derive-command-bridges-strings.vitest.ts` | Created | Round-trip test for `tsString` (WG1) |
| `runtime/scripts/routing-accuracy/command-offer.mjs`, `worktree-restore.mjs`, `run-command-behaviour.mjs` | Modified | `trustedCheckout`, NUL status, `armFor`, `lineFixture` (WG2) |
| `runtime/tests/command-offer.vitest.ts`, `tests/worktree-restore.vitest.ts`, `tests/command-behaviour-guards.vitest.ts` | Modified | Untrusted and marked checkouts, names with spaces, arm and fixture cases (WG2) |
| `runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs`, `runtime/scripts/measure-brief-cost.mjs` and their tests `tests/command-routing-slice.vitest.ts`, `tests/measure-brief-cost.vitest.ts` | Modified | Environment restore, child flag removed (WG3) |
| `runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `scripts/routing-accuracy/README.md`, `tests/command-transcript-score.vitest.ts` | Modified | Session `--row-id` refusal, header, README lines (WG4) |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`, `runtime/tests/manual-testing-playbook.vitest.ts`, `runtime/tests/README.md` | Modified | Inventory note, persistence folder, test row (WG5) |
| `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modified | Dead summary removed, jsdoc, field tests (WG6) |
| `runtime/lib/subprocess.ts`, `runtime/tests/subprocess-output-cap.vitest.ts`, `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modified | Busy scan past the cap, citations by symbol (WG7) |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/setup.md`, `scripts/tests/doctor-agents-md-contract.test.cjs`, `scripts/tests/doctor-setup-contract.test.cjs` | Modified | Restore-failure outcome, digest backup name, setup reason (WG8) |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, `agents-md-check.cjs`, `tests/hook-wiring-check.test.cjs`, `tests/agents-md-check.test.cjs` | Modified | Quote-aware launch reader, A10 count (WG9) |
| `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md` | Modified | Rows 7, 14 and 15 of the phase map (WG10) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One OpenCode worker session ran each of T003 to T035. `scratch/briefs/` holds 33 briefs, and `scratch/logs/` holds one `.out` and one `.err` file per brief. The logs do not record the worker model. Each test-first worker log records its red run before the change. Examples are T003 `20 tests | 5 failed`, T012 `TypeError: armFor is not a function` and T029 `expected 'NON_ZERO_EXIT' to be 'SQLITE_BUSY_EXHAUSTED'`. T006, T027 and T028 guard behaviour that already held, as the spec allows.

Two independent verifiers then read the wave 1 diff. `scratch/verify-wg1-4.md` and `scratch/verify-wg5-9.md` mark each of the 33 tasks PASS or CONCERN and report no P0 or P1 and nine P2 findings. `tasks.md` records the coordinator's reading that all 33 do what their line says. The coordinator built four follow-ups, T042 to T045, from five of those findings. It then ran T036 to T040 itself: the parent map edit, the rebuild and every suite, the floors, the 18 probes and the boundary checks. This close-out reran the read-only checks named in the Verification table.

### Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| T003 and REQ-001 widen `NO_EDIT_REQUEST` with a bare `no changes` | The pattern holds `make no changes\|no changes yet` (T042), and `rg -c "make no changes\|no changes yet"` on `command-attach.ts` prints 1 | Verifier finding F1 showed the bare form read "refactor the parser so there are no changes to its public api" as a no-edit request. `spec.md` REQ-001 was reworded to the narrowed form after the close-out |
| T034 skips every word starting `-` before the marker test and names seven launch shapes | T044 also reads `env -u NAME`, `node -r`, a subshell, a brace group, `exec`, a background command first and a backslash continuation as wired. It reads an unclosed quote, `node --check`, `node -e`, a launch in a comment and a script that takes its own `-c` as not wired | Verifier findings 1 and 2 in `verify-wg5-9.md`. `NT $HWT` reads `pass 28` |
| T027 gives the plugin row `skillId` `sk-doc` | The row's `skillId` is `system-spec-kit` with owner `sk-doc` (T045) | Verifier finding 3: an owner equal to the skill id cannot show a dropped owner |
| T018 replaces the `--row-id` clause in place | T043 ends that sentence before `--json prints` | Verifier finding F2: the run-on read as if `--json` were a usage error too |
| T016 names one refusal line and two usage edits | The worker also added one comment sentence to `selectMode` in `score-command-transcripts.mjs` | Not asked for. The verifier judged it harmless |
| T036 changes rows 7, 14 and 15 and no other row | The working-tree diff of the parent `spec.md` also adds rows 16, 17 and 18 and three handoff rows | `tasks.md` does not record which step added them. The T040 row check counts the three T036 rows only |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build all 27 findings, one lane per work group, lanes in parallel | The operator chose it, and the lanes own disjoint files |
| Normalise curly apostrophes before the test at the shared pattern, and route `fusion.ts` through the helper | The operator chose one fix point for the attach path and the scorer, and `fusion.ts` tests the raw prompt at both gates |
| Keep the scope-limiting known limit | The operator chose to fail toward no offer |
| Put the two embed contract cases in `doctor-agents-md-contract.test.cjs` | That file already parses the embed workflow and route, so a new file would split one contract |
| Record `untrusted_checkout` on the line rather than refuse the whole backfill | The report asks for it on the line, and the rest of the log stays writable |
| Refuse `--row-id` in the scorer's session form | A locator already names one session, so a filter there has nothing to narrow |
| Narrow the no-edit pattern to `make no changes\|no changes yet` (T042) | The bare form took the command from change requests that limit their scope. Three such requests now read `false` in `command-attach-guards.vitest.ts`, and every floor held |
| End the `--row-id` sentence before `--json` (T043) | The run-on misdescribed `--json` |
| Extend the launch reader to twelve more shapes (T044) | Seven working launches read `hook-missing` and five non-launches read `ok`. Nine of the twelve new cases failed before the change |
| Give the plugin field test an owner that differs from its skill (T045) | The label did not change when the owner was dropped. A copy with the `ownerSkillId` line removed reports `fail 1`, per the T045 line in `tasks.md` |
| Leave the g2 run-line `fixture` write without a suite test | `probe-arm-fixture.mjs` covers it and prints `run line records the fixture: true` in `scratch/repro-after.txt` |
| Leave the literal marker path in `trustedCheckout` | It agrees with the arena builder, which makes a clone with a real `.git` folder, and a mismatch fails toward untrusted |
| Leave a busy code split across two writes counting as busy | `SQLITE_BUSY_SNAPSHOT` and its kin are busy variants, so the one retry is a fair outcome |
| Leave the four other skills' catalog pages that name `metadata.compiledRouteSummary` | They belong to other skills, and the advisor's hook path still carries that field |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `FLOOR` | Before and after: `{"correct":24,"total":44}`, `{"count":0,"total":35}`, `{"own":24,"attached":20,"combined":44,"total":44}` and `{"own":13,"attached":15,"combined":28,"total":45}`. `scratch/after.txt` ends `RESULT: every floor equals its before line` |
| `EVAL` | `[160,50,21,5]` before and after. This answers the spec's open question: the widened pattern moved no holdout aggregate |
| `A10Q` | Before `5/6 copies as expected, 1 pointer missing \| pass 3 \| reported 2`. After `3/6 copies as expected, 2 reported only, 1 pointer missing \| pass 3 \| reported 2` |
| Build and `TC` | `npm run build` exit 0 and `TC` exit 0, before and after |
| `VALL` | Before 183 files, 1758 passed, 6 skipped. After 184 files, 1796 passed, 6 skipped, 0 failed (`scratch/after-vall.log`) |
| Fallback envelope under `AI_SESSION_CHILD=1` | 1 file, 4 tests passed |
| `DALL`, `VSR`, `VP` | `DALL` pass 1189 to 1211, `VSR` pass 93 to 93, `VP` pass 42 to 43, each with `fail 0` |
| `DERIVE`, `RV`, `SRM`, `PBV` | `{"status":"fresh","changed":[]}`, `32 routes validated, 11 warnings` exit 0, `256 mirrors across 10 trees are in sync` exit 0 and `PASS package=system-skill-advisor tier=FAIL_CLOSED scenarios=50`, each before and after |
| Reproductions | All 18 probes exit 0 in both records. The T002 fixed-string count on `scratch/repro-before.txt` prints 17 and the T039 count on `scratch/repro-after.txt` prints 19 |
| T040 boundaries, close-out rerun | `git diff --quiet ec1869dae8 -- AGENTS.md` exits 0. The package diff stat, the label scan of the diff and of the new test file and the `/create:(sk-)?skill` scan each print nothing. The parent row count prints 3. Each of the 42 changed or new files under `.skilled` and `.opencode` is named by a task |
| Close-out reruns | `node --check` exits 0 on all 15 changed `.mjs`, `.cjs` and `.js` files. `NT $HWT` reads `pass 28`, `fail 0`. `node $HW --root .` prints `ok` for claude, codex, cursor and devin. The `rg` checks of T008, T016 to T021, T024 to T026, T030 and T042 to T043 print what their lines name |
| Strict validation | T041 ran `repair-derived.cjs --apply` and `validate.sh --strict` on this folder, which printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, with `AC_COVERAGE` at 30 of 30 cited and `AC_CLOSURE` at 30 of 30 met |
| Checklist | P0 15 of 15 and P1 8 of 8 verified. CHK-040 closed once `spec.md` REQ-001 named the narrowed pattern, and CHK-050 closed once the `advisor-status` suite removed its own temporary trees (folder count in the system temp folder 9408 before and after a run of that file) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The g2 run-line `fixture` write has no suite test.** `runArm` and `runTurn` are covered only by `probe-arm-fixture.mjs`, so a regression there would pass `VALL`.
2. **An arena built as a linked worktree reads untrusted.** `trustedCheckout` looks for the marker at a literal `<checkout>/.git/skilled-behaviour-arena`, while the runner's live check resolves it through `git rev-parse --git-path`. Such a line keeps null offer fields.
3. **A split extended busy code counts as busy.** A chunk ending `SQLITE_BUSY` followed by `_SNAPSHOT` in the next write triggers the one retry.
4. **Four catalog pages outside this skill still name `metadata.compiledRouteSummary`.** They sit under `sk-code`, `sk-doc`, `system-deep-loop` and `cli-external-orchestration`.
5. **A prompt that only limits scope keeps its skill and loses its command.** This is the known limit the operator kept.
6. **Parent map row 9 was corrected after the reproductions ran.** `scratch/repro-after.txt` prints `map=In Progress child=Complete` for row 9, because phase 009 closed during this phase. The coordinator set row 9 to `Complete` afterwards, so the recorded probe line is older than the map.
7. **The `sh` shell has no hook-wiring case of its own.** `bash` and `zsh` have cases, and the reader checks all three names from one list.
8. **The advisor-status suite left temporary folders until the close-out.** It now removes every tree it makes. The count of `advisor-status-*` folders in the system temp folder read 9408 before and after a run of that file. The folders from earlier runs were not deleted.
9. **`spec.md` REQ-001 was reworded after the close-out.** It now names `make no changes` and `no changes yet` and says why the bare form was dropped.
<!-- /ANCHOR:limitations -->

---
