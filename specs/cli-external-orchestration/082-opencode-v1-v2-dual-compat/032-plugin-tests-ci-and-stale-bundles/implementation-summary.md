---
title: "Implementation Summary"
description: "The 436 OpenCode plugin tests now run in a blocking workflow, a plugin-only change reruns the purity test, and provisioning rebuilds a built output whose tracked sources are newer than it."
trigger_phrases:
  - "plugin tests ci and stale bundles implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/032-plugin-tests-ci-and-stale-bundles"
    last_updated_at: "2026-10-20T15:48:16Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented the three parts and recorded local verification"
    next_safe_action: "Run Luna review round 1 on the worktree diff"
    blockers: []
    key_files:
      - ".github/workflows/opencode-plugin-tests.yml"
      - ".github/workflows/spec-kit-check.yml"
      - ".skilled/skills/sk-git/scripts/worktree-naming.sh"
      - ".skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-plugin-tests-ci-and-stale-bundles"
      parent_session_id: null
    completion_pct: 70
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
| **Spec Folder** | 032-plugin-tests-ci-and-stale-bundles |
| **Completed** | In progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode plugin suites ran nowhere but a developer's machine, so the inventory guard and the v2 registration test could not stop a bad change. They now run in their own blocking workflow. A plugin-only change also reruns Spec-Kit Check, which owns the plugins purity test. And provisioning no longer leaves a stale build in place: when the tracked sources a build consumed have changed since provisioning last built it, the next provision rebuilds it.

### Phase 32: plugin-tests-ci-and-stale-bundles

The new workflow provisions every tree the provision list names, the way the dual-version battery does, and runs `node --test '.opencode/plugins/tests/*.test.cjs'` on Node 22. It triggers on any change under `.skilled`, `.opencode` or `.pi`, because a trace of the suites showed them reading skill, command, hook and Pi files across all three roots.

`provision_worktree` keeps building a missing output and now also rebuilds one whose sources changed. After each successful build it records a stamp under the worktree's own git directory: a fingerprint of the git-tracked files in the package and in any extra source path its list line names. The next provision rebuilds when no stamp exists, when the fingerprint differs (an added, removed, renamed or committed change), or when a tracked file is newer than the stamp (an edit not yet staged). Only tracked files count, so the files a build writes for itself, such as nested `dist` folders and `tsbuildinfo`, never trigger it, and a build that writes nothing new still records its stamp, so it cannot rebuild on every run. If your main checkout still runs an old sk-vision bundle, its first `worktree-naming.sh provision` finds no stamps and rebuilds every listed output once.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/opencode-plugin-tests.yml` | Created | Runs the plugin suites in a blocking job |
| `.github/workflows/spec-kit-check.yml` | Modified | Reruns on a plugin-only change |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | Rebuilds a stale output and says why |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | Checks for the stamp rule, extra sources and a tree outside git |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modified | Header states the rule; three lines name the sources their builds compile |
| `.skilled/skills/sk-git/SKILL.md` | Modified | The provisioning rule states it |
| `.github/workflows/README.md` | Modified | Rows for the new workflow and `sk-code-script-tests.yml` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max thinking wrote the code, tests, workflow and doc edits from eight literal briefs; the spec docs and every check are the orchestrator's. Review, validation and the CI proof follow in `tasks.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new workflow, not a step in the dual-version battery | The suites need a trigger as wide as the three source roots; on the battery that would install both OpenCode families on nearly every commit |
| Trigger on `.skilled/**`, `.opencode/**` and `.pi/**` | The read trace reaches all three roots; a narrower list would miss a change that breaks a suite |
| Compare git-tracked files only | A build writes untracked files newer than its output; counting them would rebuild on every provision |
| Record a stamp of the tracked inputs after each build, under the git directory | Comparing file times with the output missed a deleted input, and looped when a build skipped emission; a fingerprint catches the first and a stamp rewritten on every build ends the second. Keeping it in the git directory keeps it per worktree and out of `git status` |
| Outside a git work tree, only a missing output builds | Keeps the old behavior where there is no tracked set to compare |
| List lines name the sources a build compiles outside its package | The spec-kit runtime, its CLI and the advisor runtime compile `shared`, `runtime` or the advisor's `hooks`; without these a change there would leave the output stale. Every other reader of the list ignores fields after the second |
| Trigger on `.claude`, `.codex`, `.cursor`, `.devin`, `.env.example` and one archived spec folder | A retrace that resolved relative reads found the goal checks reading files there |
| Pass a glob to `node --test` | Node 22, which CI runs, rejects a directory argument that Node 26 accepts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suites, Node 22.23.1, workflow command | PASS, 436 of 436 |
| Same command with one broken test | exit 1, 1 failing |
| `worktree-naming.test.sh` | PASS=144 FAIL=0 (109 before) |
| Stamp checks on the file-time script | FAIL=16, exit 1 |
| Mutant without the fingerprint comparison | FAIL=9, exit 1, the deletion checks among them |
| Mutant that never records a stamp | FAIL=11, exit 1, the loop check among them |
| Real worktree, provision with stamps recorded | 0 built (`scratch/real-stamp-provision-1.txt`) |
| `actionlint`, `check-gate-inputs.sh` | exit 0, RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Whole-second comparison on macOS, for unstaged edits only.** `/bin/bash` 3.2 compares modification times in whole seconds, so an unstaged edit made in the same second as the stamp is not seen as newer. Staged and committed changes go through the fingerprint, which has no clock.
2. **Nested packages rebuild their parent.** A tracked file under `runtime/cli` also counts for `runtime`, so changing it rebuilds both. That is an extra build, never a missed one.
3. **An unstaged deletion is not seen.** The fingerprint reads the index, so a file deleted from disk but not from the index changes nothing until the deletion is staged.
4. **Root-file probes are not triggers.** The suites also check that `esbuild.config.mjs`, `manifest.json`, `wrangler.toml` and `src/2_javascript` do not exist at the repository root, to tell this repository from a project one. Adding one of those files would not start the workflow; the next change under a source root would.
5. **The main checkout's bundle.** Nothing here touches the operator's checkout. Its stale sk-vision bundle refreshes the first time `worktree-naming.sh provision` runs there, which also rebuilds the other listed outputs once, because no stamps exist yet.
<!-- /ANCHOR:limitations -->

---
