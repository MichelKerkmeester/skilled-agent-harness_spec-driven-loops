---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "codex hook check merge implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge"
    last_updated_at: "2026-11-15T17:17:56Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 2: folders merged, nine criteria Met, review APPROVED"
    next_safe_action: "Run /speckit:plan on the 003-literal-hook-renames folder"
    packet_purpose: "Purpose: One folder, `.skilled/hooks/codex-global-hooks-check/`, holds both checks, and its README states which runtime runs the check and when."
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge/implementation-summary.md"
      - "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge/tasks.md"
      - "specs/hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/002-codex-hook-check-merge/acceptance-criteria.md"
      - ".skilled/hooks/codex-global-hooks-check/README.md"
      - ".skilled/hooks/coverage-rationale.md"
    session_dedup:
      fingerprint: "sha256:b717ebea8dc50398fc2588c9cee555cd33d5ff5e7ecd0da9cbb7ac2fe15ee4a1"
      session_id: "scaffold-002-codex-hook-check-merge"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "ce043f84-fd6a-406c-8615-f204cfb30e30"
      workspace: "/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup"
      savedAt: "2026-11-15T17:17:56Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-codex-hook-check-merge |
| **Completed** | 2026-11-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One folder, `.skilled/hooks/codex-global-hooks-check/`, now indexes the check that keeps Codex's user-global hook file free of this repository's hooks. It replaces `codex-watchdog/` and `hook-install/`, which indexed the same check from different runtimes. The hooks tree holds 27 folders, down from 28.

### Phase 2: codex-hook-check-merge

You can now open one folder and read one README to learn how this repository watches `~/.codex/hooks.json`. The README says which runtime runs `install-codex-hooks.mjs --check`, on which event and under which switch. It was written from `hook-registry.json`, the OpenCode plugin and the installer, not from the two old READMEs.

That corrected three facts. The old installer README said the check was "explicitly invoked" and "not run on every turn". The registry runs it at SessionStart on Claude, Cursor and Devin. The old watchdog README wrote the plugin link target as `../../../plugins/...`. The real target is `../../../../.opencode/plugins/codex-hooks-watchdog.js`. Neither README said that Pi and DSH run the check too.

Both concern keys and both switches work as before. `hook-install` and `SYSTEM_HOOK_INSTALL_DISABLED` gate the installer. `codex-watchdog` and `CODEX_HOOKS_WATCHDOG_DISABLED` gate the OpenCode plugin. No code, registry entry or runtime registration changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/codex-watchdog/opencode/` (2 files) | Moved | To `.skilled/hooks/codex-global-hooks-check/opencode/`. The link target is unchanged and resolves. |
| `.skilled/hooks/hook-install/claude/`, `cursor/`, `devin/` (6 files) | Moved | To `.skilled/hooks/codex-global-hooks-check/`. The three link targets are unchanged and resolve. |
| `.skilled/hooks/hook-install/README.md` | Moved and rewritten | Now `.skilled/hooks/codex-global-hooks-check/README.md`. It covers both checks, both concern keys and both switches. |
| `.skilled/hooks/codex-watchdog/README.md` | Deleted | Its content is in the new feature README. |
| `.skilled/hooks/codex-global-hooks-check/*/README.md` (4 files) | Modified | The title and the overview name the new folder. Nothing else changed. |
| `.skilled/hooks/README.md` | Modified | The folder list on line 215 names the new folder and says where its links lead. |
| `.skilled/hooks/coverage-rationale.md` | Modified | The section once headed `codex-watchdog` is headed with the new folder and states which runtimes hold a folder. |
| `README.md` | Modified | The core list in "Shared Hook Cores" names the new folder once. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json` and its three fixture files | Regenerated | Each pinned list was rebuilt with its own writer. |
| `scratch/baseline/baseline.sh` in the parent packet | Modified | The row for the installer test that phase 1 deleted is removed. |

### Deviations from the plan

1. The overview line of each leaf README writes the full path, `.skilled/hooks/codex-global-hooks-check/<runtime>/`. The plan said to correct only the folder name. The short form did not resolve in `check_readme_references.py` before or after the move, and T012 expects all seven READMEs to pass.
2. The `coverage-rationale.md` section was rewritten in full, three lines, not only its heading. The old body said only a long-lived OpenCode plugin can poll Codex's hooks. The plugin runs the check once on `session.created` and does not poll.
3. `.skilled/hooks/README.md:215` got one more sentence. The review found that the line lists the folder among those whose links lead into a skill. Its links lead to `.skilled/bin/` and `.opencode/plugins/`, so the folder moved to a sentence that says so. The old `codex-watchdog/` entry carried the same error.
4. `git mv` left `hook-install/` behind as an empty folder. `rmdir` removed it.
5. The human-voice failures among the hook READMEs fell from 27 to 25. The plan only required that the count not rise.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The bare-name counts were saved first. Then the four runtime folders and the installer README moved with `git mv`, and the watchdog README was removed with `git rm`. The feature README was written next, each runtime row from its source file. `--check`, the kill switch, `--dry-run` and the plugin import were each run before their expected output went into the README. The three doc lines followed, and the pinned lists last.

Every gate was rerun from the final state through `scratch/baseline/baseline.sh`. The review gate then ran once and returned APPROVED, with no P0 or P1 finding and three suggestions:

1. The new README had dropped two search phrases the old ones carried, `codex hook installer` and `codex hook health`. Both are back, and a lookup for the first now returns the new README first.
2. The last column of the runtime table was headed "On a failed check", but Pi and DSH show the check's output on a pass too. The column is now "What the runtime shows" and the Pi and DSH cells say so.
3. The line 215 point in deviation 3.

All three were applied. The hook test suites ran before those edits, which touched two READMEs and no tested file. The README checkers, the parity and manifest tests, both sync checks and the trigger index were rerun after them.

Nothing is committed, merged or pushed. The change lives in the worktree on branch `worktrees/411-hook-library-cleanup`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep both concern keys and both switches | An operator's `hook-flags.env` may hold either switch, and five code callers read the keys. Only the two index folders merge. |
| Move the leaf READMEs with their links | The folder keeps the shape every other symlink-only concern has until phase 4 folds them all. |
| Build the feature README on the `hook-install` file | It documented the installer's modes and flags, and `git status` still reports the rewrite as a rename, so history follows the file. |
| State the worktree refusal in the README | From a linked worktree `--check` exits 1, so a session there gets a warning while the target is clean. A reader who sees that warning needs the reason. |
| Document what Pi and DSH show, not what they should show | Both adapters pass on the check's `OK` line. The README states that behaviour and the possible defect is reported at packet close. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `find .skilled/hooks/codex-global-hooks-check -type l` and the dangling-link `find` | 4 links listed. Nothing printed by the second. |
| `git ls-files .skilled/hooks/codex-watchdog .skilled/hooks/hook-install` | Nothing printed. It printed 10 lines before the move. |
| Old-folder search (`SEARCH` in `tasks.md`) | Nothing printed. It printed 42 lines before the move. |
| Bare-name counts (`BARE` in `tasks.md`) | 13 lines. Only `coverage-rationale.md`, `.skilled/hooks/README.md` and the root `README.md` differ from the 14 lines saved before the move. |
| `git diff --stat HEAD` on `hook-flags.cjs`, the plugin, the installer and `hook-registry.json` | Nothing printed. |
| Feature README: `validate_document.py`, `hvr_scan.py`, `check_readme_references.py`, `check_derived_readme_counts.py` | `VALID` with 0 issues, `hard blockers: 0`, `references=50 unresolved=0`, `claims=0 failures=0`. |
| `check_readme_references.py` on the seven READMEs this phase wrote or edited | `SUMMARY files=7 pass=7 fail=0`. |
| Sentence lengths in the feature README | Median 8 words, longest 18, none over 30, no paragraph over 80 words. |
| Hook Vitest tree | `Test Files 9 passed (9)`, `Tests 501 passed (501)`. |
| Hook `node --test` suites | `tests 1839`, `pass 1838`, `fail 1`. The failing case is the older one at `hook-stdin-deadline.test.mjs:172`. |
| OpenCode plugin tests | `tests 591`, `pass 591`, `fail 0`. |
| `sync-hook-registrations.cjs --check`, `sync-runtime-mirrors.cjs --check` | PASS with the 35-hook registry. PASS with 257 mirrors across 10 trees. |
| `check-gate-inputs.sh` and the three bash test files | `files=46` and `RESULT: PASSED`. Then 61, 152 and 56 passed, each with `0 failed`. |
| `test_readme_manifest.py` | `manifest=reproducible`, 920 directories. |
| `test_readme_verdict_parity.py` | `PARITY baseline_files=1141 post_files=1141 diff_entries=0` and `PARITY PASS`. |
| `generate-trigger-index.mjs --check` | `trigger index matches the corpus`, 0 stale documents and 0 obsolete paths. |
| Hook READMEs: `validate_document.py` and `hvr_scan.py` | 183 pass and 0 fail. 158 pass and 25 fail. |
| Review gate | APPROVED on the first run. 0 P0, 0 P1, 3 P2, all applied. |

Acceptance: 9 criteria, 9 Met, none waived or superseded. The tasks.md checklist holds 8 of 8 P0, 13 of 13 P1 and 2 of 2 P2 items. See `acceptance-criteria.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A session in a linked worktree gets a false warning.** The installer refuses to run there, so `--check` exits 1 while the Codex file is clean. Run `node .skilled/bin/install-codex-hooks.mjs --check --allow-worktree` to see the real state. The behaviour is older than this phase and is reported at packet close.
2. **Pi and DSH show the `OK` line at session start.** Both adapters pass on whatever the check prints. This is read from the two adapter files and was not run on either runtime. Reported at packet close.
3. **The header comment in `codex-hooks-watchdog.js` disagrees with the installer.** It says Codex reads hooks only from the user-global file. The installer and `.codex/README.md` say Codex loads the project file. No code changes in this phase, so the comment stays and is reported at packet close.
4. **The four leaf READMEs fail `check_derived_readme_counts.py`.** Each says the check "compares the two files", a sentence this phase did not change. Phase 4 folds and deletes those READMEs.
5. **`coverage-rationale.md` fails `check_readme_references.py` on four lines.** Lines 79, 93, 101 and 105 name paths that do not resolve. All four are outside the section this phase edited.
<!-- /ANCHOR:limitations -->

---
