---
title: "Goal: move the authored tree under .skilled in rename-only commits"
description: "The durable directive for the phase that moves every tracked .opencode entry into .skilled through one verified rename commit and leaves .opencode resolvable in the shape phase 004 chose, and the criteria that decide when it is done."
trigger_phrases:
  - "skilled source root move goal"
  - "rename-only move completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/007-source-root-move"
    last_updated_at: "2026-09-17T13:58:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Moved the tree in two verified commits"
    next_safe_action: "Start phase 008 per the parent's D1 once this folder validates"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-007-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 004 chose L1: .opencode becomes one tracked link to .skilled"
      - "The operator chose phase 004 step 11's shape: the renames and the link share one commit"
---
# Goal: move the authored tree under .skilled in rename-only commits

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every tracked file under `.opencode/` sits at the same relative path under `.skilled/` after one rename-only commit with followable history, and `.opencode/` still resolves in the shape phase 004 chose.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Commits land in this order: placeholder removal, then one commit that holds a verified `git mv` per top-level entry together with the `.opencode -> .skilled` link, as phase 004's cutover step 11 has it. A `.gitignore` twin commit comes first only when no earlier phase added the twins. Amended 2026-09-17 by the operator, who chose step 11's single commit over a separate link commit |
| D2 | The orchestrator runs every `git mv`, `git add`, `git commit`, relocation and rebuild. DeepSeek V4.1 Flash on the parent's parallel lanes runs read-only census units with kebab-case outputs, and each is re-checked before its number is used. |
| D3 | Staging is by explicit path, never `git add -A`. This phase pushes nothing, keeps the move out of the main checkout, reinstalls no hook and sets no gate bypass variable. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git show -M --name-status --format=` on the move commit prints only `R100` lines, one per tracked file under `.opencode` at the start commit (17,773), plus the single `A .opencode` link
- [x] Comparing the pre-move `.opencode` tree with the committed `.skilled` tree by mode, blob id and path prints no difference
- [x] `git ls-files .opencode` lists exactly the compatibility entries phase 004 chose
- [x] `git log --follow` reaches pre-move history for one sample per moved top-level entry
- [x] No commit containing the move is on origin or in the main checkout, and the seven global hook links are unchanged
- [x] The phase validates PASSED on the main checkout's toolchain
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` authored 2026-09-16 against the worktree at `728c4f3efc`. The main checkout's `validate.sh --strict` passes every content rule and prints `Errors: 2  Warnings: 1`, `RESULT: FAILED`: both errors are generated metadata left for `repair-derived.cjs` (T048), and the warning sits in `implementation-summary.md` |
| Pre-move checks | Done | Phase 004 froze L1 (ADR-001 Accepted, no entry kept in place). Phases 003 to 006 print `RESULT: PASSED` from the main checkout. The index is clean, `SPECKIT_AUTOSYNC` is unset and every commit carries `SPECKIT_AUTOSYNC=0`, and `HEAD..origin/skilled/v4.0.0.0` counts 0. The main checkout's `pre-commit` names `skilled` 16 times |
| Open files | Cleared | A skill-advisor daemon started from this worktree's `.opencode/bin/system-skill-advisor-launcher.cjs` held 266 files under the tree. It stopped cleanly on SIGTERM to its launcher, which shuts its child down and clears its leases, and nothing holds a file under `.opencode/` since |
| Snapshot | Done | `skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite` and `skills/.state/advisor/skill-graph-generation.json`, copied after the daemon stopped to a dated session scratch directory outside the repository |
| Census | Done | 17,773 tracked files in 16 entries (17,185 under `skills`, 98 under `bin`, the rest as planned), 208 links (159 cross an entry, 48 stay inside one, 1 points outside), 8 dangling tracked links (4 inside the tree, 4 in past-run records under `specs/`), 10 empty-blob files and 18 ignored entries. A read-only DeepSeek unit on the Cline lane produced the numbers, and the orchestrator reproduced the file and dangling counts. Every ignored entry stays ignored at its `.skilled/` path through phase 006's twins or an unanchored rule, so C0 is not needed |
| Rehearsal | Green | In two disposable clones at `048d16d725` with no remote, the placeholder commit and all 16 verified `git mv`s passed the global hooks. The separate shape committed 17,773 `R100` then `A .opencode`, and the single-commit shape committed 17,773 `R100` plus `A .opencode`, each in 3 s. The route re-mint gate re-minted five hub manifests with identical bytes, no hook changed a file, and each commit carried its `Commit-Id` trailer |
| Commit shape | Decided | Phase 004's accepted step 11 and this goal's D1 disagreed on where the link lands. The operator chose step 11's single commit on 2026-09-17, so no commit in history lacks `.opencode` |
| Rollback record | Written before any state change | `PRE_MOVE_SHA=048d16d725bb698fe540b95f5ef9884e17c2591f`. R1, entries moved in the index but not committed: `rm .opencode` if the link exists, `git reset --hard "$C1_SHA"`, then move ignored trees that travelled back from `.skilled/` to the same relative paths under `.opencode/`, or rebuild them there, and restore the snapshot if a database changed. R2, move committed and nothing shared: `git reset --hard "$PRE_MOVE_SHA"`, then the same ignored-tree handling. R3, a commit containing the move is shared: `git revert --no-edit "$C2_SHA" "$C1_SHA"`, pushed through the deletion ceiling. The seven global hook links point at the main checkout's `.opencode/scripts/git-hooks/` copies of `commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-commit`, `pre-push` and `prepare-commit-msg` |
| Baseline | Recorded before C1 | `npm ls --depth=0` exits 0 in all seven packages, phase 005's `check-gate-inputs.sh` prints `RESULT: PASSED` with 132 inputs resolved and 0 failures, and the only tracked change is this file |
| C1 | Committed `a06f17bf52` | One `D` line, the placeholder. Hooks printed nothing, exit 0, `Commit-Id: 0009514`. `.skilled` held nothing on disk afterwards |
| Per-entry moves | Done | 16 `git mv`s, each path map identical to C1 before the next: `skills` 17,185, `hooks` 179, `commands` 162, `bin` 98, `changelog` 49, `plugins` 41, `scripts` 30, `agents` 13, `install-guides` 9 and 1 each for `logs`, `bun.lock`, `package.json`, `package-lock.json`, `vitest.config.bin.ts`, `manual-testing-playbook` and `specs`. The index held 17,773 `R100` lines and nothing under `.opencode` |
| Ignored trees, link and builds | Done | 17 of 18 ignored entries travelled inside their entry. `.opencode/node_modules` moved to `.skilled/node_modules` with `mv`, `.opencode` became a link to `.skilled` and the sentinel resolves. Dependency listings stayed identical after relocation and after both builds, the four `dist` packages report fresh, no tracked file changed, the only untracked path was the link and the gate-input check still passes |
| C2 | Committed `ec33385ae5` | Staged and committed 17,773 `R100` lines and one `A .opencode`, mode `120000`, no ignore match. Hooks exited 0 and printed five route re-mint lines for `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-doc` and `system-deep-loop`, whose manifests came out byte-identical. `Commit-Id: 0009515`, and `git status` under both roots prints nothing. Neither C1 nor C2 names a path outside `.gitignore`, `.skilled/` and `.opencode` |
| Verification units | Done, all re-checked | Seven read-only DeepSeek units after C2: path map 17,773 against 17,773 with 0 differences, rename census 17,773 `R100` and 1 `A` with 0 crossed pairs, `.opencode` tracked once as the link, 16 of 16 `--follow` samples reaching pre-move history, 8 dangling links identical to the pre-move set, 1 push deletion and a naming preview with no offender. The runner found HEAD, the index and status unchanged, Devin's read-only cross-check agreed with every headline and the orchestrator reproduced each number with a different command |
| Untouched surfaces | Confirmed | After `git fetch origin` (exit 0), no remote branch contains `ec33385ae5`, origin's `skilled/v4.0.0.0` and `main` are still `048d16d725`, the main checkout's `merge-base --is-ancestor` exits 1 and the seven hook links are unchanged. `git add --dry-run -- .opencode/skills/sk-git/SKILL.md` exits 128 with `beyond a symbolic link`. The gate-input check passes on the tip |
| Closure | Done | Spec documents amended to the single-commit shape and the measured counts, and census outputs removed from `scratch/`. The main checkout's `repair-derived.cjs --folder <this folder> --apply` ran with the worktree as its working directory, because it resolves the repository from there and refuses a folder outside it. The main checkout's `validate.sh --strict` then printed `RESULT: PASSED` with 0 errors and 0 warnings |

### Deviations and findings

| Item | Note |
|------|------|
| Runbook stages with `git add -A` after `git mv` | Replaced by explicit staging and a name-status gate before each commit. Untracked fan-out containment snapshots sit under `specs/` in this worktree and must never be committed |
| Runbook requires an empty `git status --porcelain` | Narrowed to no tracked change and nothing untracked under `.opencode/` or `.skilled/`, for the same snapshots |
| The brief says ignored trees do not move with `git mv` | The repository documents that (`.opencode/skills/sk-git/references/worktree-workflows.md:561-567`), but git renames a moved directory on disk as one unit, so ignored content inside an entry may travel. T030 records what actually happened |
| Four grandfathered snake_case names | The CI naming guard would have reported them as new at their `.skilled/` paths. Routed to phase 005, which settled it before this move |
| Pre-push deletion ceiling | Exact renames count 0 deletions under the guard's command, measured on `11471df9b1` and `01874dbf92`. The phase's own range counts 1, the placeholder, as expected |
| Naming preview expectation | Settled by phase 005: a rename that keeps its basename passes, and the preview since C1 reports no offender |
| Move script stopped once on a count format | The whole-index check compared `uniq -c` output with a leading space, and macOS prints none before a five-digit count. The index already held exactly 17,773 `R100` lines. The check now formats counts with `awk`, and the remaining steps ran as a separate stage that re-read the index before relocating anything |
| Tracked counts drifted since authoring | 17,767 files and 12 ignored entries at authoring became 17,773 and 18 at the move. Phase 006 added six test files, and the ignored census counts every tree present in this worktree |
| Units ran in parallel from the worktree | The plan said one unit at a time, dispatched from the main checkout. The parent's D3 names parallel lanes, so seven units ran two per Pi lane after C2 was committed, with absolute paths and `GIT_OPTIONAL_LOCKS=0`, and the runner confirmed HEAD, the index and status unchanged |
| Devin ran a file-reading unit | cli-devin documents that `accept-edits` prompts before shell commands, so Devin's unit read the seven outputs with its file tool instead of running a command |
| Hook output location | `commit-c1-hooks.txt` and `commit-c2-hooks.txt` went to the session scratch directory outside the repository, and their content is copied into the C1 and C2 rows above |
### Handoff notes

| Phase | Note |
|-------|------|
| 008 | The tree is at `ec33385ae5` in worktree 055. Tracked links under `.skilled` number 208, and the 8 dangling tracked links are the same 8 as before the move: `.skilled/changelog/sk-design-md-generator`, `.skilled/changelog/sk-doc/create-diagram`, `.skilled/plugins/sk-vision.js`, `.skilled/skills/sk-doc/scripts/validate-flowchart.sh` and four past-run records under `specs/`. Every other tracked link, including the 174 into `.opencode/`, resolves through the single link. No derived state was regenerated here: the builds refreshed ignored `dist` output only, and the route re-mint on C2 produced identical manifests. The skill-advisor daemon is still stopped, and its databases sit at `.skilled/skills/system-skill-advisor/runtime/database/` |
| 009 | Git refuses any pathspec beyond the link: `git add --dry-run -- .opencode/skills/sk-git/SKILL.md` exits 128 with `fatal: pathspec '.opencode/skills/sk-git/SKILL.md' is beyond a symbolic link`. Every tool that stages `.opencode/...` paths has to stage `.skilled/...` instead |
| 010 | Both commits ran the seven global hooks from the main checkout's bodies with the worktree as `REPO_ROOT`, and the helpers loaded through the link: C1 printed nothing, C2 printed five route re-mint lines, both exited 0 and both carry `Commit-Id:`. `readlink ~/.config/git/hooks/*` still shows all seven pointing into the main checkout's `.opencode/scripts/git-hooks/`, whose `pre-commit` names `skilled` 16 times. Phase 003 found that a dangling hook is skipped silently and that checking out the moved tree deletes ignored files under `.opencode/`, so the reinstall and the ignored-state plan precede the main checkout taking the move |
| 011 | Against `origin/skilled/v4.0.0.0` at `048d16d725`, `git diff --name-only --diff-filter=D` counts 1 deletion, the placeholder, with the configured and the default rename limit. The naming guard since C1 passes with no offender. If a later range counts above 100, list every counted path, confirm each is intended or has an `R` partner, then push once with `SPECKIT_ALLOW_MASS_DELETION=1` |
<!-- /ANCHOR:log -->
