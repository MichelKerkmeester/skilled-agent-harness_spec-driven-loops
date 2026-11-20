---
title: "Implementation Summary: Phase 5: barter-move-overlays-out-of-tree"
description: "Barter's overlay folder now sits at ai-speckit/overlays/, beside the vendored tree, and skilled/.skilled-overlays.json names ../overlays. Two ai-speckit commits carry it: the hooks learn both places first, then the folder moves and the hooks keep only the new place."
trigger_phrases:
  - "barter overlays moved to ai-speckit/overlays"
  - "barter move overlays summary"
  - "overlayDir ../overlays evidence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree"
    last_updated_at: "2026-11-20T17:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the two commits, the move and its verification"
    next_safe_action: "None; phase 5 is complete. Operator may fix the guard path wording in the overlay docs"
    blockers: []
    key_files:
      - "tasks.md"
      - "acceptance-criteria.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-summary-005-barter-move-overlays-out-of-tree"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-barter-move-overlays-out-of-tree |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Barter's overlay folder left the vendored tree. It moved from `ai-speckit/skilled/barter-overlays/` to `ai-speckit/overlays/`, and `skilled/.skilled-overlays.json` now reads `{ "overlayDir": "../overlays" }`. Status passes there with the same 487 in-sync files as before. The edit guard, the commit gate and the git-write gate answer as they did before the move.

### Two commits, hooks first

Commit `a954fc956ce` taught the three hooks to find the folder in either place while it still sat in the tree. Commit `2a8f454c8d1` ran `git mv`, fixed every path that assumed the old place and removed the hooks' old-location probe. Done in that order, no hook ever looked for a folder that was not there.

### Files Changed

All paths are in `ai-speckit`.

| File | Action | Purpose |
|------|--------|---------|
| Hook sources, their tests and destinations (19 files, commit `a954fc956ce`) | Modified | The guard core, pre-commit and git-write gate accept both places; beside-tree test cases; `definePlugin` import fix in both Barter OpenCode plugins |
| `skilled/barter-overlays/` to `overlays/` (565 renames, commit `2a8f454c8d1`) | Moved | The folder sits beside the tree |
| `skilled/.skilled-overlays.json` | Modified | Names `../overlays` |
| `overlays/overlay-manifest.json`, `overlays/sync-state.json` | Modified | Verify argv `../overlays/checks/...`, link targets `../../../overlays/framework/...`; sync-state written by apply |
| `overlays/checks/repin-survival.cjs`, `overlays/checks/compiled-routing-byte-parity.cjs`, `overlays/tests/compiled-route-guard.test.cjs` | Modified | `treeRoot` resolves to `<parent>/skilled` |
| The guard core, pre-commit, git-write gate and their four test files | Modified | Only the beside-tree probe left; in-tree fixtures removed |
| `init-repository.sh`, `sync-skilled-specs.mjs`, `tests/init-repository.test.sh`, `tests/node-version-policy.test.sh` | Modified | Point at `overlays/` |
| `.gitignore` | Modified | `/overlays/repin-runs/`, `overlays/framework/**/node_modules/`, `overlays/framework/**/dist/` |
| `overlays/README.md`, `root/REPO RULES.md`, `root/AGENTS.md`, `framework/repo-rules/barter-overlay-first.md`, 23 sk-git and sk-code docs, `README.md`, `CONTRIBUTING.md`, `developer-questions.md`, `skilled/README.md`, `skilled/CONTRIBUTING.md` | Modified | Name the new folder; layout diagrams redrawn |
| `skilled/.skilled/`, `skilled/.cursor/rules/repo-local.md` | Modified | Destinations rewritten by apply (32 changed), both changelog links relinked, the `/doctor:agents-md` embed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup recorded the baselines: `$SUM` printed `PASSED 0 0 487`, the git-write gate printed `ai-speckit` and `allow`, `core.hooksPath` read `skilled/.opencode/scripts/git-hooks`, run-all gave 8 PASS and the overlay tests 111 of 122. Step A changed the three hooks and their tests, applied them and committed `a954fc956ce`. The commit gate ran during that commit, and a recorded hook run before the move showed each hook still working with the folder in the tree. Step B ran `git mv`, then the setting, the manifest, the checks, the tests, the scripts, the ignore rules and the docs. The hook contraction was written by an Opus `@code` worker and its diff reviewed. Apply ran from the new place, the commit gate ran on the staged index, the old-name grep ran, and `2a8f454c8d1` landed. Verification reran status, the three hooks, a staged re-pin and both suites from the final state. Nothing was pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hooks first, in a commit of their own | Moved first, the edit guard fails open, the commit gate skips its checks and the git-write gate reads every session as `project`, which could refuse the move commit itself |
| Test gate is "no failure beyond the baseline set", not exit 0 | The 11 failing overlay tests failed before any change because they import modules that exist only at the destination, so exit 0 could never hold; phase 004 used the same gate |
| Fix the `dualPlugin` to `definePlugin` rename in commit 1 | Upstream `063daaee` renamed the export, so both Barter OpenCode plugins failed to load after the re-pin; the hook tests could not pass without it |
| Map a repo-root `TREE_ROOT` to `skilled/` in pre-commit | The hook can run from the repository root, where the manifest sits at `overlays/` rather than `../overlays` |
| Leave the empty operator folder `overlays/skilled/skills/mcp-code-mode/mcp-server` alone | Untracked, empty and the operator's own; it moved with the folder |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Status at the new place (T044) | PASS: `status --audit` `RESULT: PASSED AUDIT=0 in-sync=487 checked=135 ok=135 miss=0`; `status --json` offLayout=0 |
| Edit guard (T045, T046, T048) | PASS: refuses owned destinations naming `../overlays/framework/...`; allows `../overlays/README.md`; the live OpenCode plugin refuses |
| Commit gate (T041, T047) | PASS: staged and clean index exit 0, overlay status ran, `SPECKIT_SKIP_*` unset; an unowned staged change still refused |
| Git-write gate (T049) | PASS: `ai-speckit` and `allow`, as at baseline; refuses a session outside ai-speckit |
| Staged re-pin to the current pin (T050) | PASS: exit 0, `nothing to copy`, live hashes and the 1516-file `repin-runs` list unchanged, stage folder gone |
| `bash tests/run-all.sh` (T052) | PASS: exit 0, 8 PASS, 0 FAIL |
| Overlay `$TESTS` (T051) | Baseline-equal: exit 1, 126 tests, 115 pass, 11 fail, no failure outside the baseline set; `overlays/tests/` 10/10 |
| Hook suites after the contraction | PASS: 41 pass, 0 fail across the four hook test files |
| Old-name grep (T042, T053) | PASS with a deviation: the temp fixture name and 4 upstream-owned fixture lines only |
| `core.hooksPath` (T054) | PASS: `skilled/.opencode/scripts/git-hooks` |
| Working tree | PASS: `git status --short` equals the operator's 79-line baseline |
| Location matrix | Recorded in `plan.md`, FIX ADDENDUM: LOCATION MATRIX |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Guard path wording in the docs.** The overlay docs say the guard names `overlays/framework/...`. The engine prints the path from `skilled/`, so it prints `../overlays/framework/...`.
2. **Pre-existing test failures.** The 11 overlay test failures (4 missing `yaml`, 4 missing `hook-io.mjs`, 3 missing `014-runtime-engine` modules) fail the same way as before this phase. None is a regression.
3. **Upstream fixture name.** Upstream's `skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` keeps 4 `barter-overlays` lines. Barter does not own that file.
4. **Empty leftover folder.** `overlays/skilled/skills/mcp-code-mode/mcp-server` is untracked and empty, from 18 November, and was left alone.
<!-- /ANCHOR:limitations -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| `sh -n` on pre-commit (T008, CHK-010) | `bash -n`, exit 0 | The file is bash; `sh -n` exits 2 on its process substitution |
| `node --test $TESTS` exits 0 (T004, T051, AC-008) | Exit 1, the same 11 baseline failures | Destination-only imports run from source paths |
| `git diff overlays/sync-state.json` shows only the two link records (T040) | Also the new hashes of 30 applied files | Source edits rode with the move, which the plan did not expect |
| `git status --short` prints nothing (CHK-051) | Prints the operator's 79 baseline lines, unchanged | Those files are the operator's own |
| Old-name grep prints only the allowed lines (T042, AC-009) | Plus 4 upstream-owned fixture lines | The vendored upstream test names the old folder |
