---
title: "Implementation Plan: Phase 7: Source-Root Move"
description: "Delete the .skilled placeholder, move each top-level .opencode entry with its own verified git mv into one commit of exact renames that also adds the .opencode link phase 004 chose, and hand measured push, link and naming evidence to later phases."
trigger_phrases:
  - "source root move plan"
  - "per entry git mv verification"
  - "rename commit deletion ceiling"
  - "opencode compatibility commit"
  - "source root move rollback"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: Source-Root Move

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Git 2.50.1 (Apple Git-155), Bash, Python 3 for read-only census scripts, npm for dependency trees |
| **Framework** | The sk-git large-reorg runbook (`.opencode/skills/sk-git/references/large-reorg-playbook.md`) |
| **Storage** | Git object store. The rename commit adds tree objects only, no new blob |
| **Testing** | Path map by mode and blob id, R-status census, `git log --follow` samples, link census, phase 005's independent check, `validate.sh --strict` on the main checkout's toolchain |

### Overview

The phase lands two commits on `worktrees/055-skilled-source-root-migration`, three when the ignore twins are missing. C0 adds `.skilled/` twins of the ignore rules anchored at `.opencode/`, and only runs when no earlier phase added them. C1 deletes the `.skilled/` placeholder. C2 moves the 16 tracked top-level entries, one `git mv` each, every one verified in the index before the next, and commits them together with the `.opencode -> .skilled` link phase 004 chose, as its cutover step 11 has it. The operator chose that shape on 2026-09-17 over a separate link commit. Nothing is pushed, the main checkout never takes the move and the global hooks stay as they are.

Paths below use two roots: `WT` is `/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration` and `MAIN` is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 004 has frozen the `.opencode/` shape (option A, B or C in §3), its keep-list and the packet's rollback boundary
- [x] Phases 003 to 006 print `RESULT: PASSED` from `MAIN`'s `validate.sh --strict`
- [x] Phase 005's independent move check exists and passes on the pre-move tree
- [x] The index is empty and no tracked file is modified (T003)
- [x] `PRE_MOVE_SHA` and the rollback commands in §7 are written into `goal.md`'s log (T007)

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met` with observed evidence
- [x] C2 prints only `R100` lines apart from the link's `A` line, and the path map prints no difference
- [x] Handoff notes for phases 008, 010 and 011 are in `goal.md`'s log, and `scratch/` holds no census output
- [x] `MAIN`'s `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A rename wave with a compatibility layer: a preparation commit, then one commit of exact renames that also adds the compatibility link. Adding a link edits no moved file, so the runbook's rule that renames and edits never share a commit still holds (`.opencode/skills/sk-git/references/large-reorg-playbook.md:82-85`).

### Key Components

- **C0, ignore twins (conditional)**: `.gitignore` holds 56 rules anchored at `.opencode/`, 4 nested-only rules and 2 comments that name it. Without twins, the moved `skills/.state/advisor/skill-graph-generation.json` stops matching `.gitignore:108` and surfaces as an untracked file, and the other anchored rules, such as `.gitignore:79-84` for compiled files under `system-spec-kit/shared/`, stop applying at the new root.
- **C1, placeholder removal**: a commit of its own because the placeholder is the empty blob, like 10 files under `.opencode/`. In the rename commit, git could pair its deletion with one of those destinations and blur the R-status evidence.
- **C2, the rename commit**: one `git mv` per top-level entry, each checked in the index, one commit for all of them and the link.
- **The link**: 004's shape, `.opencode -> .skilled`, staged by explicit path into C2 once the renames are verified.
- **Census units**: read-only commands run by DeepSeek V4.1 Flash on the parent's lanes, outputs in `scratch/`, each re-checked by the orchestrator (§ Delegation).

### Commit Strategy: One Rename Commit

The decision is one rename commit, not one per top-level entry.

1. **Links cross entries.** 159 of the 208 tracked links inside `.opencode/` resolve into another top-level entry: `hooks` to `skills` 70, `changelog` to `skills` 49, `hooks` to `bin` 14, `hooks` to `plugins` 13, `install-guides` to `skills` 5, `hooks` to `scripts` 4, `skills` to `plugins` 2, `manual-testing-playbook` to `skills` 1 and `plugins` to `skills` 1. Another 48 stay inside their entry and 1 (`specs`) points outside `.opencode/`. Per-entry commits would leave every commit between the first and the last with dangling links and a half-moved tree that no design covers.
2. **Size does not force a split.** Git pairs exact renames before its rename limit applies. Measured on this repository's history with the pre-push guard's own command: commit `11471df9b1` renames 2,357 files and counts 0 deletions, and commit `01874dbf92` renames 7,942 files and counts 4. Both counts hold with `-c diff.renameLimit=1000`, git's default (`git help config`, `diff.renameLimit`), and rise to 2,357 and 7,946 with `--no-renames`.
3. **One commit, one revert.** The revert of an exact-rename commit is again exact renames, so it meets the push ceiling the same way.
4. **Granularity lives in verification.** Each `git mv` takes one source and is checked before the next, so a problem surfaces at the entry that caused it without putting broken states into history.

### Compatibility Shape by Phase 004 Option

Phase 004 had not frozen the shape when this plan was written, so each option carries its own steps. Phase 004 then froze option A, and T001 recorded it.

| Step | Option A: single link | Option B: link farm | Option C: runtime-only namespace |
|------|----------------------|---------------------|----------------------------------|
| Shape | `.opencode` is one tracked link to `.skilled` | `.opencode/` stays a directory, each moved entry `E` gets `.opencode/E -> ../.skilled/E` | `.opencode/` keeps only 004's keep-list, as real files or links |
| Excluded from the move | Nothing | Nothing | Entries 004 keeps as real files |
| Before C2, on disk | `find .opencode -mindepth 1 -maxdepth 1` prints nothing after T031, then `rmdir .opencode && ln -s .skilled .opencode` | `ln -s ../.skilled/E .opencode/E` for each entry | Links for kept link entries only |
| `.opencode/node_modules` | Relocates to `.skilled/node_modules` | Stays or relocates by phase 003's plugin-loading probe | Stays with the kept `package.json` if 004 keeps it |
| Staged with the renames | `git add -- .opencode` | `git add -- .opencode/E` per entry | `git add -- .opencode/E` per kept link |
| Expected link lines in C2 | One `A` line, mode `120000` | One `A` line per entry, all mode `120000` | One `A` line per kept link |
| Expected dangling links after C2 | The pre-move 8: 4 inside the tree, now at `.skilled/` paths, and 4 in past-run records under `specs/` | Same as A | The pre-move 8 plus every external link that resolves through a dropped entry. External links per entry at authoring: `commands` 66, `skills` 61, `hooks` 27, `bin` 15, `scripts` 4 and `agents` 1 (`../002-per-runtime-reference-map/research/maps/map-a-symlinks.tsv`). Phase 008 receives the resulting list |
| Staging beyond the link | Expected to be refused for `.opencode/...` paths. T046 records it for phase 009 | Same as A | Only for paths under kept links |
| Hook and guard lookups | Resolve two hops through the link | Same as A | If `scripts/` is dropped, `pre-push` stops sourcing the deletion guard and fails open (`.opencode/scripts/git-hooks/pre-push:34-47`), and the global hooks dangle once the main checkout takes the move |

The placeholder's own name records the operator's original intent, a move with a relative link back, which options A and B honour.

### Hooks During the Move

- Every commit in this phase runs the hooks in `~/.config/git/hooks/`, set globally through `core.hooksPath` in `~/.gitconfig`. All seven are absolute links into `MAIN/.opencode/scripts/git-hooks/` (`ls -la ~/.config/git/hooks/`). `MAIN` does not change in this phase, so the entry points keep resolving for every repository on the machine.
- The hook bodies are `MAIN`'s copies, and `REPO_ROOT` is `WT`, so each body loads its helpers from `WT/.opencode/`: the flag resolver (`.opencode/scripts/git-hooks/pre-commit:17-28`), six mirror checks that block on failure and skip when missing (`pre-commit:168-191`), the commit-id allocator (`.opencode/scripts/git-hooks/prepare-commit-msg:47-50`) and the autosync publisher (`.opencode/scripts/git-hooks/post-commit:32-56`). With the compatibility shape on disk before C2 (T033), they load through it and run against the moved tree. Without it they skip or fail open, and C2 would pass for the wrong reason.
- At authoring, `MAIN`'s `pre-commit` mentions `skilled` zero times. Whether phase 005's changes reach `MAIN`'s hook bodies before this phase runs is unknown, so T014 records it and the independent check in T034 is the evidence, not a green hook.
- A block from any gate halts the phase and the fix goes to 005 or 006. The documented bypass variables are not used.
- `install-git-hooks.sh` builds its source path from `$REPO_ROOT/.opencode/scripts/git-hooks` and links into `git rev-parse --git-path hooks` (`.opencode/scripts/install-git-hooks.sh:30-31`, `:145`), which is the global hooks path here. Run from `WT`, it would point every repository's hooks at worktree 055. It never runs in this phase.
- **Coordination with phase 010.** Phase 010 reinstalls the hooks, and the event it has to precede is `MAIN` taking C2. Under options A and B the absolute links still resolve afterwards, through `.opencode`. Under option C they dangle unless `scripts/` is kept. What git does with a dangling hook is still open (`../001-deep-research/research/research.md:164`). This phase hands 010 the observed hook output of C1 and C2 and the `readlink` record from T007.

### Data Flow

`C1_SHA:.opencode` is the source of truth. The index after the per-entry moves must equal it with the prefix rewritten, and C2 freezes that index. C2 also adds the link. Every census reads trees and the working tree and writes only to `scratch/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/**`, 17,773 tracked files | The authored tree, and the root sentinel `.opencode/skills/system-spec-kit/SKILL.md` (`.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs:27`) | Moved in C2 | AC-002, AC-003 |
| `.skilled/` placeholder | Marks the move as future work | Deleted in C1 | AC-001 |
| `.opencode` link | Absent before the move | Created in C2 under option A | AC-004 |
| 56 anchored `.gitignore` rules | Ignore runtime state and build output at `.opencode/` | Twinned for `.skilled/` in C0 when missing | T013, `git check-ignore -v --no-index` |
| 208 links inside `.opencode/` | 203 need no change, 4 already dangle, `specs` depends on layout (`../002-per-runtime-reference-map/research/research.md:20`, `:60`) | Moved unchanged | T041 |
| 174 links into `.opencode/` from runtime directories and `specs/` | Consumers of the tree | Unchanged, resolve through the link in C2 | T041 |
| Seven global hooks | Run on every commit, bodies from `MAIN` | Unchanged | T045 |
| Pre-push deletion ceiling | Blocks a range that deletes more than 100 tracked files | Not triggered in this phase, measured for 011 | T042 |
| CI naming guard | Reports newly introduced snake_case names on push to `skilled/v*` | Not triggered in this phase, previewed for 011 | T043 |
| `MAIN` | The operator's checkout on `skilled/v4.0.0.0` | Unchanged | T045 |

Required inventories for this move:
- **Invariant**: for every tracked path `.opencode/X` at `C1_SHA` outside 004's keep-list, `.skilled/X` exists at `C2_SHA` with the same mode and blob id, and C2 adds or removes no other path.
- **Matrix axes**: compatibility option (A, B, C) by entry kind (directory, file, link) by ignored-tree fate (travelled, left behind). T030 fills the fate column for the option T001 selected before C2 is committed.
- **Consumers**: the 174 external links from map A, the root sentinel, the seven hook bodies and the tools that stage `.opencode/...` paths.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Task state lives in `tasks.md`. The steps below give the commands and the expected output behind each task.

### Phase 1: Pre-move checks

1. **Layout decision (T001).** Read 004's decision and record option, keep-list and rollback boundary. Halt if 004 froze nothing.
2. **Predecessors (T002).** Phases 003 to 006 print `RESULT: PASSED` from `bash MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict`.
3. **Clean index (T003).** `git diff --cached --quiet` exits 0, `git status --porcelain --untracked-files=no` prints nothing and `git status --porcelain --untracked-files=all -- .opencode .skilled` prints nothing. The runbook asks for an empty `git status --porcelain` (`.opencode/skills/sk-git/references/large-reorg-playbook.md:55`). That cannot hold here, because untracked fan-out containment snapshots sit under `specs/`, so the check narrows to tracked changes and the two roots.
4. **Autosync off (T004).** `echo "${SPECKIT_AUTOSYNC:-0}"` prints `0`, and every commit below carries `SPECKIT_AUTOSYNC=0`.
5. **Base drift (T005).** `git rev-list --count HEAD..skilled/v4.0.0.0` prints 0, or `skilled/v4.0.0.0` is integrated first and T003 re-runs.
6. **No open files (T006).** `lsof -nP | grep -F "$WT/.opencode/"` prints nothing. A daemon holding a database under the tree would keep writing to a path that no longer exists.
7. **Rollback record (T007).** Write `PRE_MOVE_SHA=$(git rev-parse HEAD)`, the §7 commands and `readlink ~/.config/git/hooks/*` into `goal.md`'s log.
8. **Snapshot (T008).** Copy `skills/system-skill-advisor/runtime/database/skill-graph.sqlite`, `skill-graph-daemon-lease.sqlite` and `skills/.state/advisor/skill-graph-generation.json` to a dated directory outside the repository. `git reset` cannot restore an ignored file (`.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md:32`).
9. **Baseline census (T009 to T011).** Expected at authoring: 17,767 tracked files in 16 entries, 208 links (159 crossing entries, 48 inside one, 1 outside), 4 dangling links inside `.opencode/` and 4 more in past-run records under `specs/`, 12 ignored entries, 10 empty-blob files. Measured at `048d16d725`: 17,773 files and 18 ignored entries, the rest as at authoring.
10. **Placeholder only (T012).** `git ls-files .skilled` prints one path, and `find .skilled -mindepth 1` prints that path and its directory.
11. **Ignore coverage (T013).** For each ignored entry from the census, `git check-ignore -v --no-index <old path>` names the rule that ignores it today. A root `.gitignore` rule anchored at `.opencode/` needs a twin and schedules C0. A nested `.gitignore` inside the tree moves with it, and an unanchored rule such as `**/node_modules` (`.gitignore:44`) or `dist/` (`.gitignore:51`) applies unchanged. At authoring only the `.state` file depends on an anchored rule (`.gitignore:108`).
12. **Hook bodies (T014).** `grep -c skilled "$MAIN/.opencode/scripts/git-hooks/pre-commit"` is recorded. It prints 0 at authoring.

### Phase 2: Move and compatibility shape

1. **C0, conditional (T015).** Add a `.skilled/` twin for each of the 56 anchored rules, negations included. `git add -- .gitignore`, then `git diff --cached --name-status` prints only `M	.gitignore`. Commit with subject `chore(source-root): ignore runtime state and build output under .skilled`.
2. **C1 (T016).** `git rm -- .skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`. `git diff --cached --name-status` prints only that `D` line. Commit with subject `chore(source-root): remove the placeholder that would nest the tree move` and record `C1_SHA`.
3. **Parent directory (T017).** `git rm` removes the emptied directories, so confirm `.skilled` is absent or empty, then `mkdir -p .skilled`.
4. **Per-entry moves (T018 to T028).** Set `BASE=$C1_SHA` and run this for each entry, in the order of the table:

```bash
move_entry() {
  E="$1"
  git mv -- ".opencode/$E" ".skilled/$E" || return 1
  test -z "$(git ls-files -- ".opencode/$E")" || return 1
  diff \
    <(git -c core.quotePath=false ls-tree -r --format='%(objectmode) %(objectname) %(path)' "$BASE" -- ".opencode/$E" | sed 's# \.opencode/# #' | sort) \
    <(git -c core.quotePath=false ls-files --format='%(objectmode) %(objectname) %(path)' -- ".skilled/$E" | sed 's# \.skilled/# #' | sort) \
    || return 1
  git ls-files -- ".skilled/$E" | wc -l
}
```

| Order | Entry | Kind | Tracked files | Links out to other entries | External links in |
|-------|-------|------|---------------|----------------------------|-------------------|
| 1 | `skills` | directory | 17,185 | 2 | 61 |
| 2 | `hooks` | directory | 179 | 101 | 27 |
| 3 | `commands` | directory | 162 | 0 | 66 |
| 4 | `bin` | directory | 98 | 0 | 15 |
| 5 | `changelog` | directory | 49 | 49 | 0 |
| 6 | `plugins` | directory | 41 | 1 | 0 |
| 7 | `scripts` | directory | 30 | 0 | 4 |
| 8 | `agents` | directory | 13 | 0 | 1 |
| 9 | `install-guides` | directory | 9 | 5 | 0 |
| 10 | `logs` | directory | 1 | 0 | 0 |
| 11 | `package.json`, `package-lock.json`, `bun.lock`, `vitest.config.bin.ts` | files | 1 each | 0 | 0 |
| 12 | `manual-testing-playbook`, `specs` | links | 1 each | 1 and 0 (`specs` points outside) | 0 |

A non-zero return stops the sequence at that entry. Under option C, kept entries are skipped.

5. **Whole-index gate (T029).** `git diff --cached -M --name-status | cut -f1 | sort | uniq -c` prints one line, `R100` with the moved count. `git diff --cached --name-only | grep -c '^specs/'` prints 0. `git ls-files -- .opencode | wc -l` prints 0, or the kept count under option C.
6. **Ignored trees (T030 to T032).** `git ls-files --others --ignored --exclude-standard --directory -- .opencode .skilled` shows where each of the 18 entries now sits. Dependency trees and local state left at an old path move with a plain `mv` to the same relative path under `.skilled/`. `.opencode/node_modules` came from npm (`.opencode/node_modules/.package-lock.json` exists next to `.opencode/package-lock.json`), so each dependency tree is proven with `npm ls --depth=0` in its directory, with `npm ci` as the fallback. Build output is rebuilt rather than trusted: `npm run build` in `.skilled/skills/system-spec-kit` (`.opencode/skills/system-spec-kit/package.json:15`) and in `.skilled/skills/system-skill-advisor/runtime` (`.opencode/skills/system-skill-advisor/runtime/package.json:8`). Every tool runs by its `.skilled/` path, because an entry point reached through a link can exit 0 having done nothing (`.opencode/skills/sk-git/references/worktree-workflows.md:537-539`). Afterwards `git status --porcelain --untracked-files=all -- .skilled .opencode` prints nothing.
7. **Compatibility shape on disk (T033).** Build the option's shape from §3 without staging it. Under A and B, `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0.
8. **Independent check (T034).** Run 005's move check on the working tree and record output and exit status.
9. **C2 (T035).** Stage the link by explicit path with `git add -- .opencode`. `git diff --cached -M --name-status` then prints 17,773 `R100` lines and one `A` line, `git ls-files -s -- .opencode` shows mode `120000` and `git check-ignore -v --no-index` matches nothing. The global excludes file ignores `/.opencode/` as a directory (`~/.gitignore_global:16`), and a link is not a directory to git, which this check confirms. Commit with `SPECKIT_AUTOSYNC=0` and stderr captured to `scratch/commit-c2-hooks.txt`. Subject `refactor(source-root): move the authored asset tree from .opencode to .skilled`. `commit-msg` wants a body once four or more paths are staged (`.opencode/scripts/git-hooks/commit-msg:232-244`), so the body states the entry count, the file count, that every change is an exact rename and that the link keeps old paths resolving. Record exit status, `C2_SHA` and whether `git log -1 --format=%B` carries a `Commit-Id:` trailer. A block halts the phase.
10. **No C3 (T036).** The operator's single-commit choice on 2026-09-17 folded the link commit into C2.

### Phase 3: Verification and handoff

1. **Census units (T037 to T043).** Path map, R-status census, old-prefix scan, `--follow` samples, link census, push-ceiling count and naming-guard preview, each defined in § Delegation.
2. **Unit verification (T044).** The orchestrator recomputes one headline number per unit and rejects a unit whose number differs.
3. **Untouched surfaces (T045).** After `git fetch origin`, `git branch -r --contains "$C2_SHA"` prints nothing, `git -C "$MAIN" merge-base --is-ancestor "$C2_SHA" HEAD` exits 1 and `readlink ~/.config/git/hooks/*` matches the T007 record.
4. **Staging beyond a link (T046).** Under A or B, record whether `git add --dry-run -- .opencode/skills/sk-git/SKILL.md` is refused. Phase 009 needs this for every tool that stages `.opencode/...` paths.
5. **Handoff (T047).** Copy evidence into `goal.md`'s log and the acceptance rows. Write notes for 008 (link census, dangling set), 010 (hook output of C1 and C2, the `readlink` record, whether `MAIN`'s bodies carry 005's changes) and 011 (deletion count, naming preview, bypass rule). Remove `scratch/` outputs.
6. **Metadata and validation (T048).** `node "$MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs" --folder <this folder> --apply`, then `bash "$MAIN/.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh" <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:push-strategy -->
## PUSH STRATEGY THROUGH THE DELETION CEILING

No push happens in this phase. Phase 011 publishes, and this section is what it inherits.

### How the Ceiling Counts

- Gate 0 of `pre-push` runs for every updated branch, `skilled/v*` and `main` included (`.opencode/scripts/git-hooks/pre-push:97-119`). It counts `git diff --name-only --diff-filter=D <remote tip> <local tip>` (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:45-47`) and blocks above 100 (`mass-deletion-guard.sh:17`, `:21-27`, `:51-58`).
- It skips a branch that is new on origin (`pre-push:102`) and fails open when its library cannot be sourced (`pre-push:34-47`). Commits have no ceiling (`.opencode/scripts/git-hooks/pre-commit:34-35`).
- Renames do not count. `diff.renames = true` and `diff.renameLimit = 60000` sit in the common `.git/config` (lines 18 to 20), and exact renames pair before any limit applies:

| Commit | Exact renames | Deletions counted by the guard's command | Same, `-c diff.renameLimit=1000` | Same, `--no-renames` |
|--------|---------------|------------------------------------------|----------------------------------|----------------------|
| `11471df9b1` | 2,357 | 0 | 0 | 2,357 |
| `01874dbf92` | 7,942 | 4 | 4 | 7,946 |

- The blocks in the guard's audit log were real deletions. The range `4c32fb4c36..b8f74ba0f1` counted 1,064 deletions with 0 renames, and `5d93cf85d9..4570677ec7` counted 2,329 with 3 renames.

### What This Phase's Commits Will Count

C1 and C2 on their own are expected to count 1 deletion, the placeholder. The endpoint diff holds 11 empty-blob deletions (the placeholder and 10 files under `.opencode/`) against 10 empty-blob additions under `.skilled/`, so exactly one stays unpaired whichever way git pairs them. Git does pair empty files: `git diff -M --raw --no-abbrev` on `11471df9b1` reports 66 empty-blob renames as `R100`. T042 records the real number with the guard's own command.

### The Hazard

A push whose range joins C2 with phase 008 or 009 edits is compared endpoint to endpoint. An edited file then pairs only by similarity, and git's default threshold is 50% (`git help diff`, `-M`). A small file that is mostly rewritten paths can fall below it and count as a deletion, so a combined range can pass 100.

### The Documented Way Through

1. Run the guard's command against the exact remote tip before pushing. If `git merge-base --is-ancestor <remote tip> HEAD` fails, integrate first, because a push that is not a fast-forward is rejected anyway.
2. At 100 or fewer, push with no variable set.
3. Above 100, list every counted path and confirm each is an intended deletion or has an `R` partner in the same range. Only then run the push once as `SPECKIT_ALLOW_MASS_DELETION=1 git push ...`, the bypass the guard prints for one operation (`mass-deletion-guard.sh:18`, `:56`, `:70`), or with `SPECKIT_MASS_DELETION_THRESHOLD=<count+1>` (`mass-deletion-guard.sh:71`). Log the count and the range. The policy keeps the ceiling in force for autosync publishes too (`.opencode/skills/sk-git/references/remote-branch-policy.md:74`).
4. Pushing the worktree branch as a new remote branch would skip the ceiling (`pre-push:102`), but creating a remote branch needs a named approval (`pre-push:144-160`) that the parent's decisions do not give (`../goal.md:47`). It is not the route.

### Other Push-Time Gates Phase 011 Meets

- The skill-root metadata gate warns locally and CI enforces it on `main` and `skilled/v*` (`pre-push:208-231`).
- The compiled-routing guard blocks, and its commit-parity pathspecs name `.opencode/...` (`pre-push:250-307`).
- CI's naming guard compares rename destinations against every path at the base (`.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:142-177`, `:267-284`) on push to `skilled/v*` (`.github/workflows/naming-standard-guard.yml:3-7`, `:45-46`). Run at authoring with the guard's own functions over the 17,767 paths then tracked, it reported four grandfathered names as new: `commands/prompt/assets/prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`, `prompt_improve_presentation.txt` and `skills/system-spec-kit/runtime/cli/tests/fixtures/grep-convention/naming-exception/Spec_Draft.md`. Phase 005 owned the answer and gave it: a rename that keeps its basename passes, and the preview at `ec33385ae5` reports no offender.
<!-- /ANCHOR:push-strategy -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integrity | Mode, blob id and path per entry before C2, whole tree after C2 | `git ls-tree --format`, `git ls-files --format`, `diff` |
| Rename detection | R-status census of C2, one `--follow` sample per moved entry | `git show -M --name-status`, `git log --follow` |
| Integration | Root sentinel, 174 external links, 005's independent check, hooks on C1 and C2 | Python link census, 005's check, hook stderr |
| Gate preview | Deletion count, naming offenders | The guard's own commands |
| Documentation | This folder | `MAIN`'s `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 layout decision, keep-list and rollback boundary | Internal | Green: option A (L1) frozen, no entry kept in place | No compatibility branch, T001 halts |
| Phase 005 independent check and hook changes | Internal | Green: the gate-input check passes, and the main checkout's `pre-commit` names `skilled` 16 times | T034 cannot run and green hooks prove nothing |
| Phase 006 dual-root suites | Internal | Green: validated PASSED and published at `dadf2d19dd` | Mirror checks can block C2 |
| Phase 003 probes on linked plugin directories and dangling hooks | Internal | Green: validated PASSED, dangling hooks are skipped silently and plugins load through the whole-directory link | Option B's `.opencode/node_modules` placement is open |
| cli-pi with `llmgateway/deepseek-v4.1-flash` | External | Green: seven units returned on 2026-09-17, first live-verified 2026-09-10 (`.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:113`) | The orchestrator runs the census commands itself and logs the deviation |
| `MAIN`'s toolchain | Internal | Green | Validation and metadata regeneration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the path map shows a difference, the R-status census shows a line other than `R100`, a gate blocks and 005 or 006 cannot fix it within three repairs, the independent check fails or phase 004 changes its decision.
- **Procedure**: pick the row for the point reached.

| Point | State | Rollback |
|-------|-------|----------|
| R0 | Before C1 | Nothing to undo |
| R1 | Entries moved in the index, C2 not committed | Remove the unstaged compatibility shape (`rm .opencode` under A, the entry links under B and C), `git reset --hard "$C1_SHA"`, move travelled ignored trees back to `.opencode/` or rebuild them there, restore T008's snapshots if a database changed |
| R2 | C2 committed, nothing shared | `git reset --hard "$PRE_MOVE_SHA"` on the worktree branch, then the same ignored-tree handling. The reflog keeps the phase commits reachable |
| R3 | A commit containing C2 is shared | `git revert --no-edit "$C2_SHA" "$C1_SHA"`, newest first, pushed through the same ceiling. The revert of C2 is exact renames again plus the link's removal |

- **Point of no return**: the first time a commit containing C2 reaches a shared ref, meaning a push to origin or `MAIN` taking it by merge, fast-forward or pull. Before it, rollback leaves no trace. After it, rollback is a public revert. Once phase 010 has pointed the global hooks and home configs at `.skilled/`, reverting the tree alone breaks them again, so from there rollback starts with 010's recorded rollback, and the packet-wide boundary is phase 004's to name.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:delegation -->
## DELEGATION

Parent decision D3 (`../goal.md:48`) splits the work. The move is ordering-critical and hard to undo once shared, so the orchestrator runs every state change itself. DeepSeek V4.1 Flash runs bounded read-only units on the parent's parallel lanes: Pi through the LLM Gateway at `--thinking max`, Pi through Cline at `--thinking xhigh` and Devin at its max tier.

**Orchestrator only**: every `git mv`, `git rm`, `git add`, `git commit`, `git reset`, `git revert`, plain `mv`, `ln`, `rmdir` and `npm` command, the compatibility shape, and tasks T001 to T009, T011 to T036 and T044 to T048.

**DeepSeek units** (T010 and T037 to T043):

| Unit | Read-only commands | Output | Orchestrator check |
|------|--------------------|--------|--------------------|
| `pre-move-baseline` | `git ls-files`, `git ls-files -s`, `readlink` and `git ls-files --others --ignored --exclude-standard --directory` over `.opencode`, plus a dangling-link count over the six runtime directories and `specs` | `scratch/pre-move-baseline.tsv` | Re-run the total and the dangling count |
| `path-map-diff` | The `move_entry` comparison over the whole tree, `C1_SHA:.opencode` against `C2_SHA:.skilled` | `scratch/path-map-diff.txt` | Line count, 0 or the kept count |
| `r-status-census` | `git show -M --name-status --format= "$C2_SHA"`, counted by status and by top-level entry | `scratch/r-status-census.tsv` | Re-count `R100` |
| `old-prefix-scan` | `git ls-files -- .opencode`, `git ls-tree -r --name-only HEAD -- .opencode` | `scratch/old-prefix-scan.txt` | Compare with 004's list |
| `follow-samples` | `git log --follow --format=%h` and `git log --format=%h` for one unique-content path per moved entry | `scratch/follow-samples.tsv` | Re-run one sample |
| `link-census` | `os.path.exists` over every mode-120000 entry under `.skilled`, `.opencode`, `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes`, `.pi` and `specs` | `scratch/link-census.tsv` | Re-count dangling links |
| `push-ceiling-count` | `git diff --name-only --diff-filter=D <remote tip or merge base> HEAD` | `scratch/push-ceiling-count.txt` | Re-run the count |
| `naming-guard-preview` | `python3 .skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py --changed-since "$C1_SHA"`, keeping `.skilled/` lines | `scratch/naming-guard-preview.txt` | Re-count offenders |

**Dispatch rules**:
- Read `cli-pi/SKILL.md` before the first brief (T009).
- Dispatch with absolute paths in every command and the Pi agent directory outside the repository. The units ran from `WT` after C2, where `.pi/` resolves through the `.opencode` link.
- Model `llmgateway/deepseek-v4.1-flash` at `--thinking max` (`.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:103`, `:113`), print mode with `--offline` and stdin from `/dev/null` (`.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:189-195`), `AI_SESSION_CHILD=1` plus the child preamble (`SKILL.md:217`), and `GIT_OPTIONAL_LOCKS=0` so a status read never takes the index lock.
- Units run in parallel, two per lane, only after C2 is committed and never while the orchestrator stages or commits. The runner compares HEAD, the index and `git status` before and after. Devin's `accept-edits` mode prompts for shell commands, so a Devin unit reads files only.
- Brief shape, five lines at most: the literal commands, the kebab-case output path, "read-only, write nothing else" and "print DONE and the output's first line".
- A unit that writes anywhere else, or whose number the orchestrator cannot reproduce, is discarded and run by the orchestrator, and the log records why.
<!-- /ANCHOR:delegation -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Pre-move checks) --> Phase 2 (Move and compatibility shape) --> Phase 3 (Verification and handoff)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pre-move checks | Phases 003 to 006 validated, 004's decision frozen | Move and compatibility shape |
| Move and compatibility shape | Pre-move checks, rollback record written | Verification and handoff |
| Verification and handoff | C1 and C2 committed | Phase 008 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pre-move checks | Medium | 1 to 2 hours |
| Move and compatibility shape | Medium | 2 to 3 hours, most of it dependency installs and builds |
| Verification and handoff | Medium | 1 to 2 hours |
| **Total** | | **4 to 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `PRE_MOVE_SHA` and the R1 to R3 commands are in `goal.md`'s log (T007)
- [x] The ignored databases and state file are snapshotted outside the repository (T008)
- [x] Autosync is off in the executing shell (T004)

### Rollback Procedure
1. Stop at the failing step and record its output and exit status in `goal.md`'s log.
2. Find the point reached (R0 to R3 in §7) and run that row's commands.
3. Verify the rollback: `git ls-files .opencode | wc -l` prints 17,773 (or the integrated base's count), `git ls-files .skilled` prints the placeholder unless C1 stays and `test -f .opencode/skills/system-spec-kit/SKILL.md` exits 0.
4. Re-run the ignored-entry census from T010 and restore or rebuild any entry that differs.

### Data Reversal
- **Has data migrations?** No tracked data changes content. Ignored local databases may change location.
- **Reversal procedure**: move them back with `mv`, or restore T008's snapshots.
<!-- /ANCHOR:enhanced-rollback -->

---
