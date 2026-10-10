---
title: "Implementation Summary"
description: "The leaf-manifest walk now skips the files git ignores, so a stray __pycache__ no longer makes a skill report STALE."
trigger_phrases:
  - "leaf generator ignores implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores"
    last_updated_at: "2026-10-10T05:26:27Z"
    last_updated_by: "builder"
    recent_action: "Built the git-ignore filter and verified the goal criteria"
    next_safe_action: "Orchestrator reviews the packet and decides on the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-leaf-generator-ignores"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-leaf-generator-ignores |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf-manifest walk now drops every file that git ignores. A skill that holds a stray `__pycache__` directory used to report STALE with no tracked change. With the probe file in place, the freshness gate went from `checked=14 fresh=13 failed=1` to `checked=14 fresh=14 failed=0`, and no committed `leaf-manifest.json` changed.

### Phase 2: leaf-generator-ignores

The walk in `generate-leaf-manifest.cjs` ends with one call to `dropGitIgnoredLeaves`. That helper sends the repository-relative paths of the walked files to a single `git check-ignore -z --stdin` call and removes the ones git reports. When git cannot answer, because the walk sits outside any work tree or check-ignore exits with a status other than 0 or 1, the helper falls back to name rules: any `__pycache__`, `node_modules` or `.DS_Store` path segment, and any file ending `.pyc`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modified | Adds the `spawnSync` import, the `fallbackIgnored`, `gitToplevel` and `dropGitIgnoredLeaves` helpers, and returns the filtered list from `walkLeafFiles`. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs` | Created | Two cases: a git-ignored leaf is dropped, and the fallback drops generated noise outside a work tree. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modified | One contents row for the new test file. |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/` | Modified | `tasks.md` evidence, the `goal.md` LOG section, this summary, and `scratch/` receipts. `spec.md` and `plan.md` are unchanged. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build followed `tasks.md` in order. Before the first edit, the freshness gate and the create-skill test loop were recorded, and the probe reproduced the STALE report. The generator was saved as a copy so the diff could be read later. After the edits, the new test file, the gate with and without the probe, the test loop (diffed against the baseline), and the comment-hygiene grep were each run and their output read. The change is in the worktree and has not been committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Git decides the ignore set, with one `check-ignore` call per walk | The ignore rules live in `.gitignore` files that this walker does not parse, and a process per file would cost far more than one call. |
| A leaf symlink is judged by its link path, so only the directory is resolved | git refuses paths that pass through a symlink, and a plain `realpathSync` would judge the target and drop a leaf the manifest lists under its link path. This departs from the brief's wording and is recorded in `goal.md`. |
| Exit status 1 means nothing is ignored, and any other failure falls back to name rules | Status 1 is a real answer. A status of 128, or a signal, means git cannot answer, so the walk must not guess from git. |
| Tracked files are never dropped | `git check-ignore` without `--no-index` does not report tracked files, so a tracked file that matches an ignore rule stays in its manifest (REQ-007). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| C1: `node tests/generate-leaf-manifest-ignores.test.cjs; echo exit=$?` | PASS. Prints `ok - git-ignored leaf is dropped`, `ok - fallback drops generated noise outside a work tree`, `[sk-doc] leaf-manifest ignore filtering coverage passed`, `exit=0`. |
| C2: `node ci-leaf-manifest-freshness.cjs; echo exit=$?`, and `git status --short -- '*/leaf-manifest.json'` | PASS. `checked=14 fresh=14 failed=0`, `exit=0`. The git status prints nothing. |
| C3: gate with the probe `.pyc` present, then the probe and its folder removed | PASS. With the probe: `checked=14 fresh=14 failed=0`, `exit=0`. After removal, `ls` prints `No such file or directory` and exits 1. Before the change the same probe gave `checked=14 fresh=13 failed=1`, `exit=1`. |
| C4: the create-skill `tests/*.test.cjs` loop prints no FAIL line | PASS. The FAIL loop prints nothing. Against the baseline, the diff adds only the new file's `exit=0` line. |
| C5: comment-hygiene grep over the two code files | PASS. No output, `exit=1`. |
| C6: `validate.sh <this folder> --strict` prints `RESULT: PASSED` | PASS. `RESULT: PASSED`, `Errors: 0  Warnings: 0`, `exit=0`, after `repair-derived.cjs --apply`. `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Name rules apply to a whole walk when git cannot answer.** A packet outside the work tree makes check-ignore exit 128 for the entire batch, so that walk uses name rules. No packet in this repository is outside the work tree today.
2. **The create-skill `.test.cjs` files run in no CI workflow.** The new file joins its siblings in the README. Wiring them into CI is an operator decision.
3. **The plan's risk table and its testing section disagree about the fallback case.** The build follows the testing section, so a TMPDIR inside a git work tree fails the precondition assert instead of passing. This environment is not affected. Details are in `goal.md` LOG.
4. **Leaf symlinks are judged by their link path.** A symlink whose target is ignored stays in the manifest. This is intended and departs from the brief's wording.
5. **Each walk adds two git calls, `rev-parse` and `check-ignore`.** Neither runs per file. No timing was measured, so the packet makes no performance claim.
<!-- /ANCHOR:limitations -->

---

