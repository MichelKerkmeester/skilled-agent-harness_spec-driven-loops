---
title: "Implementation Summary: Phase 14: fix-pre-existing-defects-found-by-migration"
description: "The node gate is fully green, every sk-doc script test passes and now runs in CI, test runs leave the tracked council database alone, and hook flags, search roots and plugin logs work under either source-root name."
trigger_phrases:
  - "pre-existing defects summary"
  - "node gate fully green"
  - "phase 14 results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/014-fix-pre-existing-defects-found-by-migration"
    last_updated_at: "2026-09-18T22:36:18Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Closed the phase on 23 green CI runs"
    next_safe_action: "None; phase 15 carries the open question"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py"
      - ".github/workflows/deep-loop-runtime.yml"
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which compiled-serving admission path should the next phase build? Phase 15 researched it and recommends a checker against routing gold"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-fix-pre-existing-defects-found-by-migration |
| **Completed** | 2026-09-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The node gate reports no failures, which it had not since this packet began. Every check this phase touched now runs somewhere that would notice if it broke.

### The scaffold version

The scaffolder copied each template's own frontmatter version into a new skill's `SKILL.md`, so a new hub started at `1.2.0.7` while its router files started at `1.0.0.0`, and the version check failed on every scaffolded hub. New skills now start at `1.0.0.0` whatever revision the template is at. The scaffolded benchmark reports index also stopped claiming the retired harness writes its rows.

### Tests nobody ran

No workflow ran the sk-doc script tests, and four of them had failed unseen. The durable-directory manifest predated 17 added and 12 removed directories, and its own count disagreed with its list. The README verdict baseline still listed a README phase 13 deleted. One test anchored on a heading both hub templates had renamed on 2026-09-07. The validator suite expected two README fixtures with a table of contents to pass, which the no-TOC rule now rejects, and two command fixtures lacked the section separators the separator rule requires. All four are fixed, and sk-doc Script Tests now runs them on every push. The manifest test names the directories that changed and takes `--write` to accept them.

The deep-loop runtime suites also ran only on a developer's machine, although they hold the check that caught phase 13's stale command contracts. Deep-Loop Runtime Tests now runs them when the deep-loop tree changes. Both workflows were run step for step in a clean clone under Node 22 first. That run showed two things a developer's checkout had hidden: the sk-doc tests need the spec-kit, sk-doc and deep-loop packages installed, and four deep-loop suites bind each event to the commit's parent, which a depth-one checkout does not have.

### The trigger index

Regenerating the index failed closed: phase 13 had put a restored paragraph on line 2 of a README, inside its frontmatter. The paragraph is back in the overview, no other file phase 13 edited has prose in its frontmatter, and the regenerated index lists no deleted file.

### The council database

Three suites spawn the council graph scripts, which always opened the database checked into the repository, so every test run left it modified. The module now honours `DEEP_LOOP_COUNCIL_DB_DIR`, the test helper points it at a scratch directory, and the council script suite fails if the tracked file changes.

### The Codex hooks

`~/.codex/hooks.json` had drifted in structure from what the installer writes. It was backed up and reinstalled from the main checkout; the same 18 managed hooks came back, and the operator's 26 other hooks were kept.

### The source-root name

Twenty-two hooks imported hook-flags by climbing to the repository root and back down into `.skilled`. They now climb only to their own source root, and each rewritten path was resolved from the location the hook runs from. Four session scripts source hook-flags relative to themselves, `hook-flags.sh` picks its config by the sentinel, and the dist-staleness checker by its own real path. The ripgrep wrapper searches the source root under the name the checkout gives it, and three OpenCode plugins log under the selected root instead of always creating `.skilled/logs`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modified | First version for new skills; truthful reports index |
| `.skilled/skills/sk-doc/scripts/tests/**` | Modified/Created | Four tests green, a refresh mode, a runner |
| `.skilled/skills/cli-external-orchestration/cli-cursor/benchmark/README.md` | Modified | Valid frontmatter |
| `.skilled/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts` and two tests | Modified | Scratch database for test runs |
| 22 hooks, four session scripts, `hook-flags.sh`, `check-dist-staleness.sh` | Modified | Hook flags under either root name |
| `rg-wrapper.mjs`, three plugins, and their tests | Modified/Created | Search roots and logs under either root name |
| Three workflows and the workflows README | Created/Modified | CI for the deep-loop and sk-doc suites |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twelve commits on `worktrees/055-skilled-source-root-migration`, each through the git hooks with no bypass variable: `bc81f0152d` (scaffold version), `b02eb86cdd` (sk-doc tests), `743b896393` (cli-cursor frontmatter), `f33b6cbb8e` (council database), `a099d0c93c` (source-root name), `975f672052`, `e8d117bbcf` and `672b1fdd2c` (CI), `18dfa1ee0f` (these records), `bb1d36a431` (trigger index), then `2bdf25f86d` and `c2c3fd42c0` (fixes CI found). The Codex hooks were reinstalled outside the repository. Every new test was run once against the code before its fix, where it failed.

The first push failed both new jobs, for three reasons the clean-clone run had not shown because that run used a developer's Python and PATH. Without PyYAML, `package_skill.py` falls back to a lenient frontmatter parser, so a test that expects a YAML error saw none; the sk-doc job now installs PyYAML. Five contract tests used BSD `sed -i ''`, which GNU sed reads as a file name; they now use a suffix both accept. Five fan-out tests launched the real `codex`, `claude` and `opencode` binaries, which the runner lacks; they now use stubs. The deep-loop suite then passed 153 of 153 files with those CLIs removed from PATH, and CI passed on the next push.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Test runs get a scratch council database; the tracked file stays tracked | Untracking it would delete it in every other checkout on the next pull, including the main one, and the approved fix was test isolation |
| Hook imports climb to their own root rather than select one by name | A path that never leaves the file's own tree cannot name the wrong root, and it needs no new code in 22 fail-open hooks |
| The sk-doc job runs on every push | Two of its tests walk the whole repository, so a path filter would let them go stale unseen again |
| The ten-minute rename harness runs in its own path-filtered workflow | Running it on every push would add ten minutes to every push |
| Pi extensions keep their paths | They load from `.pi/extensions/`, where no relative path can know the source root's name |
| The compiled-serving tool waits for its own phase | Restoring the retired parity path would bring back about 4,000 lines phase 13 removed, and a gold-agreement checker would change the admission bar; the choice is the operator's |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Node gate | 89 files, 1,007 pass, 0 fail. At the phase 13 tip: 88 files, 1,001 pass, 1 fail |
| Spec-kit `root` and `cli` projects | 254 files, 2,724 pass, 0 fail |
| Standalone deep-loop suite | 154 files, 2,684 pass, 8 skipped, 0 fail. The tracked council database was unchanged afterwards |
| sk-doc script tests | All 24 pass, in the worktree and in a clean clone |
| Deep-loop job in a clean clone | 150 of 154 files passed at depth one. The other four need the commit's parent and pass 86/86 with full history, which the job now fetches |
| Codex hooks | `install-codex-hooks.mjs --check` reports OK |
| Gate inputs | 159 inputs resolve, including the new workflows'. Every path filter names both roots |
| CI | All 23 runs on `c2c3fd42c0` pass on `main` and `skilled/v4.0.0.0`. The first push failed four runs, fixed as above |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The compiled-serving admission tool is not built.** Phase 15 researched it; building it waits on the operator's decision about the admission bar.
2. **About 180 code files still spell `.skilled`.** Many name both roots on purpose, such as the sentinel selection and the workflow path filters. `dist-freshness.cjs`, which lists the packages the freshness guard watches, is one that does not, and none was audited one by one.
3. **The main checkout's compiled hooks predate the import change** until its spec-kit and advisor runtimes are rebuilt. They still work, because the old paths name the tree that exists.
4. **Two phase 13 commit messages overclaim.** `30b2981762` says six scenario files where there were five, and `cafeff809e` says it removed every live pointer to the retired lane. Both are on the remote and are corrected in the phase 13 records.
<!-- /ANCHOR:limitations -->

---
