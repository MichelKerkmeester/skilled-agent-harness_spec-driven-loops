---
title: "Implementation Summary"
description: "The OpenCode-only goal command and the OpenCode plugins now live only under .opencode: .opencode/commands is a real directory of generated per-entry links plus goal-opencode.md, and the .skilled/plugins link is gone, with every live reference moved to the new paths."
trigger_phrases:
  - "opencode native surfaces implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/073-opencode-native-surfaces"
    last_updated_at: "2026-10-28T17:30:00Z"
    last_updated_by: "leaf-worker"
    recent_action: "Moved goal-opencode; deleted .skilled/plugins; verified"
    next_safe_action: "Commit and merge on operator approval"
    blockers: []
    key_files:
      - ".opencode/commands/goal-opencode.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-doc-073-opencode-native-surfaces"
      parent_session_id: null
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
| **Spec Folder** | 073-opencode-native-surfaces |
| **Completed** | 2026-10-28 on `worktrees/265-opencode-native-surfaces`, not committed |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves 3 archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`/goal-opencode` now lives in `.opencode/commands/goal-opencode.md`, and the OpenCode plugins are named only by `.opencode/plugins`. OpenCode still lists every shared command, because `.opencode/commands` holds one generated link per top-level entry of `.skilled/commands`.

### Move goal-opencode command into .opencode only and remove the .skilled/plugins symlink

`.opencode/commands` was one link to the whole shared tree, so an OpenCode-only command had to sit in `.skilled/commands`. It is now a real directory: the sync script writes and checks a relative link for each shared entry, and `command-scope.cjs` registers `goal-opencode.md` as the one native file there. The `.skilled/plugins` link is deleted, 19 browsability links now point at `.opencode/plugins/`, and the docs, tests, workflows and plugin comments that named the old paths now name the new ones. Released changelogs, benchmark reports and older specs keep the old paths as history.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/goal-opencode.md` | Moved | From `.skilled/commands/goal-opencode.md` (git rename) |
| `.opencode/commands/` | Modified | Whole-tree link replaced by a real directory of per-entry links |
| `.skilled/plugins` | Deleted | Link to `../.opencode/plugins` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modified | New `opencode-commands` tree; `.opencode/commands` must be a real directory |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs` | Modified | Registers the native command; empties `CANONICAL_MIRROR_EXCLUDES` |
| `.gitignore` | Modified | Ignores `/.opencode/commands/local-*` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` and its test | Modified | Treats `<repo>/.opencode/plugins` as hub plugin code; F21 tests rewritten |
| `audit_descriptions.py` | Modified | Counts real `.opencode/commands/*.md` files |
| `.opencode/SYNC.md`, `opencode-compat-layout.test.cjs`, `.skilled/commands/README.txt`, `README.md` | Modified | Inventory, layout assertions and location prose |
| About 100 docs, tests, workflows and plugin comments | Modified | Old path references replaced; 27 markdown links re-resolved |
| Catalog-check fixture, `check_readme_references.py` and pytest, `doctor-skill-budget.yaml`, sk-create-benchmark example | Modified | Leftover `/vision` examples renamed |
| Hermes skill copies, 56 frontmatter versions, trigger index | Regenerated | Keep generated surfaces in step |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Built in the git worktree `worktrees/265-opencode-native-surfaces`. Baselines were taken on main first, then the layout and references changed, then the mirror check, a negative control, the suites, the gate battery against main and a live OpenCode v2 listing ran. Nothing is committed, merged or pushed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Per-entry links instead of a whole-tree link | A real directory can hold the one native file, and the operator chose this approach on 2026-10-28 |
| Generate the links in `sync-runtime-mirrors.cjs` | The existing check then reports a missing or stray entry, as it already does for `.claude/commands` |
| Leave changelogs, benchmark reports and old specs unchanged | They record what was true when written |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `sync-runtime-mirrors.cjs --check` | PASS, 202 mirrors across 9 trees (main: 193 across 8) |
| Negative control, `.opencode/commands/deep` moved away | exit 1, `MISSING .opencode/commands/deep` |
| `sync-runtime-mirrors.test.mjs` | 3/3 |
| `node --test .opencode/plugins/tests/` | 557 pass, 0 fail (main: 557/0) |
| `quality-gate.test.cjs` | 93/0 (main 95/0; three old link tests became two) |
| `opencode-compat-layout.test.cjs` | 20 pass, 0 fail, 1 skipped |
| `command-catalog-mirror-check.cjs` | `STATUS=OK`; its test 13/13 |
| `opencode-version-battery.cjs --family=v2` | `PASS v2 command-listed: all 49 command files listed` |
| Gate battery G1-G20 and A1, main vs worktree | Identical after the trigger index rebuild; G12 fails on both |
| cli vitest (hook-registration-sync, sweep-memory-residue, trigger-index) | 97/97 on main and worktree |
| README checker pytest; advisor hooks-parity stress test | 28/28; 2/2 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Primary checkout needs one manual link after merge.** The git-ignored `.opencode/commands/local-skilled-alignment.md` link is not tracked, so create it in the primary checkout after the merge or run worktree provisioning.
2. **Not yet committed.** Commit, merge to main and push wait on the operator.
3. **Pre-existing failures remain.** `validate-command-references` reports three missing SQLite databases that a fresh worktree lacks, and the combined layout and bin run keeps main's single failure on the pinned gold-scenario count.
<!-- /ANCHOR:limitations -->

---


