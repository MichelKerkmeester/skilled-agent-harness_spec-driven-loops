---
title: "Implementation Summary"
description: "Planned, not built. Three doctor script limits from a vendoring project's first handover are still open, and this packet holds the plan for them."
trigger_phrases:
  - "fix barter 022 handover items for doctor scripts implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/012-fix-barter-022-handover-items-for-doctor-scripts"
    last_updated_at: "2026-11-16T13:22:17Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the three doctor script changes"
    next_safe_action: "Verify the Barter session knows which commit holds the changes"
    packet_purpose: "Purpose: A host hook has an accepted form in the git setup check, `apply --adopt` writes the manifest entry for an excluded path that has an overlay source, and a file a regenerate step rewrote is reported with the step's name."
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/skills/system-skilled-doctor/references/overlays.md"
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/012-fix-barter-022-handover-items-for-doctor-scripts/handover-to-barter.md"
    session_dedup:
      fingerprint: "sha256:b53f57ce523e9d40cfd69b2bcfaf2b1fec07b7ed296d437964f08db0bcef73a8"
      session_id: "scaffold-012-fix-barter-022-handover-items-for-doctor-scripts"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3912763e-4a15-47d7-994e-71d31bbf339f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T13:22:17Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-fix-barter-022-handover-items-for-doctor-scripts |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A host's own hook now passes the git setup check once its local config lists it under `skilled.hostHook`, and the passing row names it. `apply --adopt` takes a path under `repin.exclude` when its copy sits in the overlay folder. A file an overlay owns that a regenerate step rewrote is reported as `regenerated <path>` with the step's id, not as `upstream-moved`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Reads `skilled.hostHook` from local config and passes a listed installed hook with the note `<name>: host hook by skilled.hostHook` |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `adoptUnderLock` takes an excluded path that has an overlay copy and names the copy it looked for when there is none. `regenerate` hashes each overlay destination around every step and returns which step changed it. `applyUnderLock` prints a `regenerated` line for such a file |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Three tests: a listed host hook passes, an unlisted one fails, a value in global config fails |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | Two tests: adopt under `repin.exclude` with an overlay copy, and the refusal without one |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modified | One test: a live re-pin whose regenerate step rewrites an owned file names the step |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | The adopt rule for an excluded path and the `regenerated` line |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | The hooks check description names `skilled.hostHook` beside `skilled.omitHook` |
| `handover-to-barter.md` | Created | What the vendoring project runs after it re-pins |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The change was first built as a prototype and checked with the three target test files. It was then reverted and cut into eight briefs in `scratch/dispatch/`. Each brief was applied by DeepSeek v4.1 flash through the Mistral Vibe CLI. Every run's `export.json` records `exit_code 0` and `outcome finished`. After each run every edited file matched the expected text byte for byte, and the brief's check was rerun by hand. A test brief came before each code brief, and each test brief failed as expected before its code brief ran.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| A stage keeps skipping the regenerate steps | The operator chose this on 2026-11-16. A stage has no project install behind it |
| `skilled.hostHook`, one local config value per hook | The operator chose this on 2026-11-16. It mirrors `skilled.omitHook` |
| A host hook still has to be executable | Git skips a hook it cannot run, so a listed but non-executable hook gates nothing |
| The step is traced by hashing every overlay destination around each step | A step's `outputs` list does not change how a file is classified, and the old `changedOutputs` value was never read. Only a hash around each step tells which step wrote a file, whether or not the step lists it |
| No new sync state name | A new name would change the `stateSummary` counts many tests read. Only the printed line changes |
| `isVendoredKey` is unchanged | The write checks and the re-pin copy rely on an excluded path not being vendored. Only adopt widens what it takes |
| An excluded path with no overlay copy gets its own refusal | The old text said the path was not under a vendored root, which is false for such a path |
| The adopt rule that refuses when both the live file and the copy exist stays | Widening it was not in scope. The handover tells the vendoring project to remove the live copy first |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Baseline, whole folder on HEAD (orchestrator's run) | `tests 1183, pass 1183, fail 0` |
| Baseline, three target files on HEAD | `git-setup-check` 83/83, `overlay-engine-strict-writes` 17/17, `overlay-engine-repin` 26/26 |
| New tests on HEAD code | 1 of 4 host hook tests failed, both adopt tests failed, the regenerate test failed with `upstream-moved .skilled/skills/hub/SKILL.md` |
| Target files after the build | 86/86, 19/19 and 27/27 |
| `node --test .skilled/commands/doctor/scripts/tests` | `tests 1191, pass 1191, fail 0`, exit 0. Six new tests are this packet's. The other two are inferred to come from another packet built in the same checkout, not identified by name |
| `quality-gate.cjs --files` on the five changed code files | `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0` |
| `sk-code-setup-check.cjs` | `STATUS=OK legs=9` |
| `doctor-git-setup.yaml` parses | `yaml.safe_load` printed `yaml ok` |
| Vibe runs | 8 runs, each `exit_code 0` and `outcome finished`, each byte match |
| `validate.sh --strict` on this folder | `RESULT: PASSED (errors=0 warnings=2)` |
| Whole doctor test folder on the final tree, with the phase 011 review fix | `tests 1197`, `pass 1197`, `fail 0`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A stage still cannot see a regenerate step's rewrite.** Only a live run or a plain `apply` prints the `regenerated` line. Read the line and fix the overlay copy or the step, then run the live re-pin again.
2. **The `regenerated` line prints only in the run that ran the step.** A failed live re-pin writes no sync state, so a later `status` reports the same file as `upstream-moved` again. A probe in the builder's scratch folder showed this. After the failed re-pin, `status` exited 1 with `upstream-moved .skilled/skills/hub/SKILL.md`. The same probe showed that a plain `apply` whose write set off the step printed the `regenerated` line and exited 1. Read the failed run's output or its `report.json` lines for the step's name.
3. **Adopt still refuses when both the live file and the overlay copy exist.** For an excluded path, remove the live copy first. The apply that adopt runs writes it back.
4. **`skilled.hostHook` cannot check what the host script runs.** The passing row names each host hook so the operator can see it, and the references say the script must run the gates itself.
5. **The evidence for T001 to T003 is in `tasks.md` and here, not in `goal.md` section 4.** The build method for this packet leaves `goal.md` alone.
<!-- /ANCHOR:limitations -->

---

