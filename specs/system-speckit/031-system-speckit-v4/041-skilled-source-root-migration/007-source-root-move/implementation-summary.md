---
title: "Implementation Summary: Phase 7: source-root-move"
description: "The authored tree now lives under .skilled: a placeholder commit and one move commit of 17,773 exact renames plus the .opencode -> .skilled link, proven by a path map, a rename census, follow samples and a link census, committed in worktree 055 and not pushed."
trigger_phrases:
  - "source root move implementation summary"
  - "skilled tree move results"
  - "source-root-move verification evidence"
  - "rename commit handoff notes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move"
    last_updated_at: "2026-09-17T13:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Moved the tree in two verified commits"
    next_safe_action: "Validate the phase strictly, then start phase 008 per D1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-007-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 004 chose L1, so the only compatibility entry is the .opencode link"
      - "The operator chose one commit for the renames and the link"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-source-root-move |
| **Completed** | 2026-09-17, committed at `ec33385ae5` on `worktrees/055-skilled-source-root-migration`, not pushed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every tracked file that sat under `.opencode/` now sits at the same relative path under `.skilled/`, and `.opencode` is one tracked link to `.skilled`, so every path written with the old name still resolves. Two commits did it. `a06f17bf52` removed the placeholder that would have nested the tree, and `ec33385ae5` holds 17,773 exact renames and the link. Nothing is pushed, and the main checkout and the machine's hooks are unchanged, so phase 008 can retarget links against a tree that already works.

### The move

Each of the 16 tracked top-level entries moved with its own `git mv`. Before the next entry moved, its index entries were compared with the placeholder commit by mode, blob id and path, and each comparison printed no difference.

| Entry | Files | Entry | Files |
|-------|-------|-------|-------|
| `skills` | 17,185 | `install-guides` | 9 |
| `hooks` | 179 | `bun.lock` | 1 |
| `commands` | 162 | `logs` | 1 |
| `bin` | 98 | `manual-testing-playbook` (link) | 1 |
| `changelog` | 49 | `package-lock.json` | 1 |
| `plugins` | 41 | `package.json` | 1 |
| `scripts` | 30 | `specs` (link) | 1 |
| `agents` | 13 | `vitest.config.bin.ts` | 1 |

### Ignored trees

Git renames a moved directory on disk as one unit, so 17 of the 18 ignored entries travelled inside their entry: seven `node_modules` trees, four `dist` trees, both skill-graph databases, the advisor's generation file, the `.node-version-marker`, the test sandboxes and a Python bytecode cache. Only `.opencode/node_modules` sat at the root, and a plain `mv` put it at `.skilled/node_modules`. After that, the ignored set at the new root matches the pre-move census path for path, and `git status` under both roots prints nothing.

### The link

`.opencode -> .skilled` went into the move commit, as phase 004's cutover step 11 has it, so no commit in history lacks `.opencode`. The root sentinel resolves through it, the 8 dangling tracked links are the same 8 as before the move, and the hooks loaded their helpers through it while committing. Staging a path under the link fails with `beyond a symbolic link`, which phase 009 needs for every tool that stages `.opencode/...` paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep` | Deleted | C1, so no `git mv` could nest the tree |
| `.opencode/**`, 17,773 tracked files | Renamed to `.skilled/**` | C2, the move itself |
| `.opencode` | Created, link to `.skilled` | C2, keeps every old path resolvable |
| `goal.md`, `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Modified | Evidence, handoff notes and the single-commit amendment |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before any state change, the phase stopped a skill-advisor daemon that held 266 files under the tree, snapshotted its databases outside the repository, took a census and wrote the rollback record. The move then ran twice in disposable clones with no remote, once per commit shape, and both passed the machine's hooks.

In the worktree, a script outside the repository ran the move in stages and stopped at the first failed check. A baseline stage recorded dependency listings for seven packages, phase 005's gate-input check and the tracked changes. C1 followed. The move stage ran the 16 checked `git mv`s. The finish stage re-read the index, relocated `node_modules`, created the link, rebuilt both TypeScript packages and compared all three baselines again. C2 staged the link by explicit path and refused to commit unless the staged set was exactly 17,773 `R100` lines and one `A` line.

### Delegation

The orchestrator ran every `git mv`, `git rm`, `git add`, `git commit`, `mv`, `ln` and `npm` command. DeepSeek V4.1 Flash ran seven read-only units after C2 was committed, two workers per lane: three on Pi through the LLM Gateway at `--thinking max` and four on Pi through Cline at `--thinking xhigh`. Each unit ran one literal command with `GIT_OPTIONAL_LOCKS=0`. The runner compared HEAD, the index and `git status` before and after all seven and found no change beyond their output files. Devin's `accept-edits` mode prompts for shell commands, so Devin ran a read-only cross-check of the seven outputs with its file-reading tool instead. The orchestrator then recomputed every headline number with a different command.

### Commits

| Commit | Subject | Staged set | Trailers |
|--------|---------|------------|----------|
| `a06f17bf52` | `chore(source-root): remove the placeholder that would nest the tree move` | 1 `D` | `Spec:`, `Commit-Id: 0009514` |
| `ec33385ae5` | `refactor(source-root): move the authored asset tree from .opencode to .skilled` | 17,773 `R100`, 1 `A` | `Spec:`, `Commit-Id: 0009515` |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The renames and the link share one commit | Phase 004's accepted step 11 and this phase's original D1 disagreed. The operator chose step 11 on 2026-09-17, so every commit in history has a resolvable `.opencode` |
| No ignore-twin commit | Every ignored entry already stayed ignored at its `.skilled/` path through phase 006's twins or an unanchored rule |
| Baselines before the move, comparisons after it | A green commit only proves the gates ran. Dependency listings, the gate-input check and the tracked-change list show the moved tree behaves like the old one |
| `SPECKIT_COMMIT_SPEC` on both commits | It only stamps the `Spec:` trailer, as on every phase 006 commit, and bypasses no gate |
| Read-only units in parallel, after C2 | The parent's D3 names parallel lanes. Nothing staged or committed while they ran, and none of them takes the index lock |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Path map, C1 `.opencode` against C2 `.skilled` by mode, blob id and path | PASS. 17,773 against 17,773, 0 differences in the unit and in the acceptance command re-run |
| Rename census of C2 | PASS. 17,773 `R100` and 1 `A`, every rename at the same relative path, 0 crossed pairs |
| What `.opencode` tracks | PASS. The index and HEAD each hold one entry, `120000 .opencode`, whose blob is `.skilled` |
| `git log --follow` samples | PASS. 16 of 16 unique-content samples reach pre-move history, and two re-runs match |
| Link census | PASS. 8 dangling, the same 8 paths as before the move after the prefix rewrite, and 208 tracked links under `.skilled` |
| Ignored entries | PASS. 18 at the same relative paths, and `git status --porcelain --untracked-files=all -- .skilled .opencode` prints nothing |
| Dependencies | PASS. `npm ls --depth=0` exits 0 in all 7 packages, with identical listings before the move, after relocation and after the builds |
| Builds | PASS. Both builds exit 0, and the four `dist` packages report fresh |
| Phase 005 gate-input check | PASS. `RESULT: PASSED`, exit 0, before the move, on the moved working tree and on the tip, each with 132 inputs resolved and 0 failures |
| Hooks | PASS. C1 printed nothing. C2 printed five route re-mint lines whose manifests came out byte-identical, and both commits carry `Commit-Id:` |
| Push deletion count against `origin/skilled/v4.0.0.0` | 1, the placeholder, with the configured and the default rename limit |
| Naming guard preview | PASS, exit 0 and no offender, because phase 005 lets a rename that keeps its basename through |
| Origin, main checkout and hook links | PASS. After `git fetch origin`, no remote branch contains C2, the main checkout's `--is-ancestor` check exits 1 and all seven hook links are unchanged |
| Staging beyond the link | Refused, exit 128, `fatal: pathspec '.opencode/skills/sk-git/SKILL.md' is beyond a symbolic link` |
| `validate.sh --strict` on the main checkout's toolchain | PASS. `RESULT: PASSED` with 0 errors and 0 warnings after `repair-derived.cjs --apply` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The move exists only in worktree 055.** Origin and the main checkout still hold `.opencode/` as a directory until phase 011 publishes. Rolling back before then is `git reset --hard` in the worktree, as the log's rollback record says.
2. **Tools that stage `.opencode/...` paths now fail.** Git refuses a pathspec beyond a link, so phase 009 rewrites those paths to `.skilled/`.
3. **The skill-advisor daemon is still stopped.** Its databases travelled with `skills/` to `.skilled/skills/system-skill-advisor/runtime/database/`, nothing in this phase restarted it and the pre-move snapshot stays outside the repository.
4. **The `specs` sample counts directory history.** `git log --follow` on `.skilled/specs` reaches 4,849 commits because that path was a directory before it became a link, so the sample proves reach, not the link's own history.
5. **The hooks still run from the main checkout.** Their bodies live under the main checkout's `.opencode/scripts/git-hooks/`, and phase 010 reinstalls them before the main checkout takes the move.
<!-- /ANCHOR:limitations -->

---
