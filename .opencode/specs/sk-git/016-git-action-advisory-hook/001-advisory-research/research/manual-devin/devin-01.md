# Devin-01: Enumeration of Mutating Git Operations and Pre-Execution Evaluability

**Pass:** 1 of 10 — `manual-devin/devin-01`
**Focus:** Enumerate EVERY mutating git operation available in this repository and classify whether an advisory could evaluate its risk BEFORE execution.
**Scope:** Findings only. No rule encoding, no hook code.

---

## 0. Methodology and Measurement Caveat

**Noise was NOT measured against this repository's history.** All `git log` / `git reflog` / `git status` inspection attempts were rejected by the non-interactive shell (`Running in non-interactive mode. Use --permission-mode dangerous to auto-approve all tools`). Noise estimates below are therefore **inferred from git's command semantics and the operator's documented workflow**, not counted. Where inference is the basis, the Noise column says `inferred, not measured` and the Confidence column says `inferred`. A follow-up pass with shell access should replace these with real counts.

**Pre-evaluability definition.** A rule is *fully pre-evaluable* when every input it needs is available from `git` plumbing commands run BEFORE the target command executes (e.g. `git status --porcelain`, `git rev-parse`, `git symbolic-ref`, `git config`, `git worktree list`, `git for-each-ref`, `git stash list`, `git submodule status`, `gh auth status`). It is *partially pre-evaluable* when some risk signal is available pre-execution but a load-bearing input is only knowable after the fact (name what is missing). It is *post-hoc only* when the risk cannot be read until the command has run — such a rule cannot be a preflight advisory and must be flagged as such.

**Engine reality.** The current `CHECKS` in `dispatch-rule-checks.mjs` are pure functions of the command string only. They do not invoke git. A rule that needs repo state requires the engine to run git plumbing inside the check (or the PreToolUse hook to inject a state snapshot). That is a phase-002/003 design decision; this pass only classifies whether the state *exists* pre-execution, not whether the engine currently reads it.

**Enforcement territory excluded from advisory candidates.** The repo already ships blocking hooks: `pre-push` (naming + remote-allowlist permission gates), `pre-commit` (4 blocking sub-gates), `commit-msg` (structure), `post-merge`/`post-rewrite` (drift markers), `autostash-orphan-guard`. An advisory that duplicates a blocking hook is pure noise. The table marks such overlap in the "Overlap with enforcement" column and excludes them from advisory candidacy unless the advisory covers a gap the hook does not.

**Confidence legend.**
- **confirmed** — I read the source or ran a verification (file paths cited).
- **inferred** — I reasoned from git semantics and the documented workflow; not verified against this repo's state.

---

## 1. Classification Table — Every Mutating Git Operation

Columns:
- **Op** — the git invocation shape.
- **Pre-evaluable** — `full` / `partial` / `post-hoc`.
- **Pre-exec state read** — the specific state the rule would read (and the plumbing command that exposes it).
- **Missing for partial** — for `partial` only, the load-bearing input unavailable before execution.
- **Noise estimate** — how often an advisory would fire. `inferred, not measured` unless otherwise stated.
- **Source** — existing sk-git prose (rule named), observed incident, or `new` (with justification).
- **Overlap w/ enforcement** — `none` / names the hook that already blocks it.
- **Confidence** — `confirmed` / `inferred`.

### 1a. Index / Worktree Mutations

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git add <pathspec>` | full | `git status --porcelain` (existing staged set, dirty count, dir-vs-file pathspec), `git diff --cached --name-only` (what is already staged by other sessions) | — | High on directory pathspecs in a shared/dirty tree; low on single explicit files. **inferred, not measured** | Incident #1; ALWAYS #13 (scope-the-commit) | none | inferred |
| `git add -A` / `git add .` | full | `git status --porcelain` (full dirty set + count) | — | High whenever tree is non-empty; near-constant in active sessions. **inferred, not measured** | ALWAYS #13 (never blind `git add -A`); NEVER #5 (secrets) | pre-commit catches secrets post-stage, not pre-stage | inferred |
| `git add -u` | full | `git status --porcelain` (tracked-but-modified set) | — | Lower than `-A` (no untracked sweep), still high in dirty trees. **inferred, not measured** | ALWAYS #13 | none | inferred |
| `git add -p` | partial | `git status --porcelain` (candidate hunks) | The hunk-by-hunk selection is interactive; the rule can warn about the *starting* dirty set but not which hunks were accepted | Low — interactive, operator is engaged. **inferred, not measured** | new (interactive ops are low-noise by construction) | none | inferred |
| `git rm <paths>` | full | `git ls-files <paths>` (tracked?), `git status --porcelain` (staged state) | — | Low — explicit paths. **inferred, not measured** | new (deletion of tracked files is explicit and rare) | none | inferred |
| `git rm -r <dir>` | full | `git ls-files <dir>` (count of tracked files under dir), `git status --porcelain` | — | Low; the recursive flag is the signal. **inferred, not measured** | new | none | inferred |
| `git mv <src> <dst>` | full | `git ls-files <src>`, `git status --porcelain` (is src staged by another session?) | — | Low. **inferred, not measured** | ALWAYS #10 (rename history preserved) | none | inferred |
| `git restore <paths>` (unstaged discard) | full | `git status --porcelain`, `git diff --name-only` (what would be lost) | — | Medium — discards are routine but lossy. **inferred, not measured** | new (discard of uncommitted work) | none | inferred |
| `git restore --staged <paths>` | full | `git diff --cached --name-only` (what is currently staged), `git status --porcelain` | — | Low-medium; unstage is reversible (content stays in working tree). **inferred, not measured** | new (named in briefing's rare-but-expensive list) | none | inferred |
| `git restore --source=<ref> <paths>` | full | `git rev-parse --verify <ref>`, `git status --porcelain` (dirty?), `git diff <ref> HEAD -- <paths>` (what changes) | — | Low; explicit source ref is the signal. **inferred, not measured** | new | none | inferred |
| `git reset` (mixed, default) | full | `git diff --cached --name-only` (staged set being unstaged), `git status --porcelain` | — | Medium; common but unstaging is reversible. **inferred, not measured** | new | none | inferred |
| `git reset --soft` | full | `git rev-parse HEAD`, `git diff --cached --name-only` | — | Low; non-destructive to tree. **inferred, not measured** | new | none | inferred |
| `git reset --hard [<ref>]` | full | `git status --porcelain` (dirty count — the loss surface), `git stash list` (is there a safety net?), `git rev-parse HEAD` vs `<ref>` (divergence) | — | Low frequency, high stakes. The advisory value is the dirty-count + uncommitted-work warning. **inferred, not measured** | new (named in briefing's rare-but-expensive list) | none | inferred |
| `git reset --merge` / `--keep` | full | `git status --porcelain`, `git rev-parse HEAD` | — | Low. **inferred, not measured** | new | none | inferred |
| `git clean -f` | full | `git status --porcelain --untracked-files=all` (untracked set being deleted), `git clean -nd` (dry-run of exactly what would go) | — | Low; `-f` is the explicit signal. **inferred, not measured** | new | none | inferred |
| `git clean -fd` | full | `git clean -nd` (dry-run), `git status --porcelain --untracked-files=all` | — | Low. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git clean -fdx` | full | `git clean -ndx` (dry-run — includes ignored files), `git check-ignore` list | — | Low frequency; `-x` wiping ignored files (build artifacts, `.env`?) is the high-stakes signal. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git clean -i` | partial | `git clean -nd` (candidate set) | Interactive selection; rule can warn about the candidate set, not the accepted subset | Very low — interactive. **inferred, not measured** | new | none | inferred |

### 1b. Commit Mutations

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git commit` (plain) | partial | `git diff --cached --name-only` (staged set + count), `git status --porcelain` (is there unstaged WIP being left behind?), `git log -1` (is HEAD already pushed?) | Whether the message will be conventional — that is knowable from `-m`/`-F` args but not from a template editor session | High — fires on every commit. **This is the noise trap.** **inferred, not measured** | ALWAYS #1, #5, #13 | commit-msg enforces structure; pre-commit enforces content gates | inferred |
| `git commit --amend` | full | `git log -1 --pretty=%H` then `git branch -r --contains <sha>` (is HEAD on a remote? was it pushed?), `git status --porcelain` | — | Low frequency; high stakes when HEAD is pushed. **inferred, not measured** | NEVER #10 (no amend of pushed/merged commit) | none — commit-msg runs but does not block amend-of-pushed | inferred |
| `git commit --only <paths>` / `-o` | partial | `git diff --name-only -- <paths>` (do paths exist & have changes?), `git status --porcelain` (full dirty set — to warn that OTHER staged paths will be excluded) | Whether the operator intended to commit only a subset vs. forgot a path — intent is not in the state | Medium; the failure mode (silently dropping a named path that isn't staged) is the briefing's incident #5. **inferred, not measured** | Incident #5 (no rule today) | none | inferred |
| `git commit --include <paths>` / `-i` | partial | `git status --porcelain`, `git diff --name-only -- <paths>` | Same intent gap as `--only` | Low-medium. **inferred, not measured** | new | none | inferred |
| `git commit -C <sha>` / `-c <sha>` | full | `git log -1 --pretty=%B <sha>` (reused message — does it match conventional format?), `git log -1 --pretty=%H <sha>` then `git branch -r --contains` (was source pushed?) | — | Low. **inferred, not measured** | ALWAYS #1 (commit format) | commit-msg validates the reused message | inferred |
| `git cherry-pick <sha>` | full | `git log -1 <sha>`, `git status --porcelain` (must be clean to start), `git cherry <branch>` (is it already applied?) | — | Low; explicit sha. **inferred, not measured** | new (cherry-pick from worktree is incident #2's context) | none | inferred |
| `git cherry-pick --continue` / `--abort` | partial | `git status --porcelain` (conflict state), `CHERRY_PICK_HEAD` existence | Whether the resolution is correct | Low. **inferred, not measured** | new | none | inferred |
| `git revert <sha>` | full | `git log -1 <sha>`, `git status --porcelain` (clean?) | — | Low; revert is the safe alternative ALWAYS #10 points to. **inferred, not measured** | NEVER #10 (revert instead of amend) | none | inferred |

### 1c. Branch / Ref Mutations

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git branch <name>` (create, no checkout) | full | `git rev-parse --verify <name>` (exists?), `git symbolic-ref HEAD` (current branch) | — | Low; but ALWAYS #4 + NEVER #2 say use worktree instead. **inferred, not measured** | NEVER #2 (never create branches directly) | none — pre-push only fires on push | inferred |
| `git branch -d <name>` | full | `git rev-parse --verify <name>`, `git branch --merged <target>` (is it merged?), `git worktree list` (is it checked out?) | — | Low; `-d` refuses unmerged. **inferred, not measured** | ALWAYS #6 (clean up after merge) | none | inferred |
| `git branch -D <name>` | full | `git branch --merged <target>` (is it merged? `-D` bypasses the check), `git rev-parse <name>` (tip sha — is it reachable from any ref?), `git reflog --all --format=%H \| grep <sha>` (is the tip reachable from reflog?), `git worktree list` | — | Low frequency, high stakes — `-D` can lose unmerged commits permanently if not in reflog. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git branch -m <old> <new>` / `-M` | full | `git rev-parse --verify <old>`, `git for-each-ref --format='%(refname)' refs/remotes` (does a remote already have `<old>`? rename breaks upstream tracking) | — | Low. **inferred, not measured** | new | none | inferred |
| `git checkout -b <name>` | full | `git rev-parse --verify <name>` (exists?), `git status --porcelain` (dirty?) | — | Low; NEVER #2. **inferred, not measured** | NEVER #2 | none | inferred |
| `git switch -c <name>` | full | same as `checkout -b` | — | Low; NEVER #2. **inferred, not measured** | NEVER #2 | none | inferred |
| `git checkout <branch>` / `git switch <branch>` | full | `git status --porcelain` (dirty? will checkout carry changes?), `git stash list`, `git rev-parse HEAD` vs `<branch>` (divergence) | — | Medium — routine but dirty-tree checkout is the autostash trap (ALWAYS #14). **inferred, not measured** | ALWAYS #14 (autostash-prone op) | none | inferred |
| `git checkout -- <paths>` / `git checkout HEAD -- <paths>` | full | `git status --porcelain`, `git diff --name-only -- <paths>` (what is lost) | — | Medium; lossy discard. **inferred, not measured** | new (same class as `git restore`) | none | inferred |
| `git checkout <sha>` (detached) | full | `git rev-parse --verify <sha>`, `git status --porcelain`, `git symbolic-ref HEAD` (am I already detached?) | — | Low; detached HEAD is incident #2's context. **inferred, not measured** | Incident #2 context (ALWAYS #15) | none | inferred |

### 1d. Merge / Rebase / Pull

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git merge <branch>` | full | `git status --porcelain` (clean?), `git rev-parse HEAD` vs `<branch>` (ff / diverged?), `git merge-base`, `git log --oneline HEAD..<branch>` (incoming count) | — | Medium; routine but the dirty-tree + autostash combination is incident #4. **inferred, not measured** | ALWAYS #14 | none | inferred |
| `git merge --squash <branch>` | full | `git status --porcelain`, `git rev-parse HEAD` vs `<branch>` | — | Low; ALWAYS #7. **inferred, not measured** | ALWAYS #7 | none | inferred |
| `git merge --no-ff` / `--ff-only` | full | `git rev-parse HEAD` vs `<branch>` (ff-only will refuse non-ff) | — | Low. **inferred, not measured** | new | none | inferred |
| `git merge --autostash` | full | `git status --porcelain` (dirty count — the autostash orphan surface), `git stash list` | — | Low frequency, high stakes — this is the ALWAYS #14 trap. **inferred, not measured** | ALWAYS #14 | autostash-orphan-guard is post-hoc safety net, not preflight | inferred |
| `git rebase <upstream>` | full | `git status --porcelain` (clean?), `git log --oneline <upstream>..HEAD` (commits to rewrite — are any pushed?), `git branch -r --contains HEAD` (is HEAD published?), `git rev-parse --git-dir` (rebase in progress?) | — | Medium; NEVER #8 (no rebase of public branches). **inferred, not measured** | NEVER #8 | none | inferred |
| `git rebase -i <upstream>` | partial | `git log --oneline <upstream>..HEAD` (candidate commits), `git branch -r --contains HEAD` | The todo-list edits are interactive; rule can warn about pushed commits in the range, not the reorder/squash choices | Low-medium. **inferred, not measured** | NEVER #8 | none | inferred |
| `git rebase --onto <new> <old> <branch>` | full | `git log --oneline <old>..<branch>` (range being moved), `git branch -r --contains <branch>` | — | Low; explicit and rare. **inferred, not measured** | new | none | inferred |
| `git rebase --autostash` | full | `git status --porcelain` (dirty count), `git stash list` | — | Low frequency, high stakes — ALWAYS #14. **inferred, not measured** | ALWAYS #14 | autostash-orphan-guard is post-hoc | inferred |
| `git rebase --abort` / `--continue` / `--skip` | partial | `git status --porcelain`, `git rev-parse --git-dir/rebase-merge` (rebase state) | Whether the resolution is correct | Low. **inferred, not measured** | new | none | inferred |
| `git pull` (default merge) | full | `git status --porcelain`, `git rev-parse HEAD` vs `@{u}` (divergence), `git config pull.rebase`, `git log --oneline @{u}..HEAD` (local commits) | — | High — pull is routine; advisory would be near-constant noise unless gated on dirty tree. **inferred, not measured** | new | none | inferred |
| `git pull --rebase` | full | `git status --porcelain`, `git log --oneline @{u}..HEAD` (commits to rewrite — pushed?), `git branch -r --contains HEAD` | — | Medium; combines NEVER #8 risk with routine pull. **inferred, not measured** | NEVER #8 | none | inferred |
| `git pull --autostash` | full | `git status --porcelain` (dirty count), `git stash list` | — | Low frequency, high stakes — ALWAYS #14. **inferred, not measured** | ALWAYS #14 | autostash-orphan-guard is post-hoc | inferred |

### 1e. Remote / Push / Fetch

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git push [<remote> <ref>]` | full | `git for-each-ref refs/remotes` (does remote branch exist? new vs update), `git log --oneline <remote>/<branch>..HEAD` (outgoing commits), `gh auth status` (active account — incident #3), `git remote get-url origin` (owner match), `git config branch.<name>.remote` | — | High — every push. Advisory must be gated to fire only on a *signal* (non-allowlisted branch, account mismatch, force flag) or it is pure noise. **inferred, not measured** | ALWAYS #18, ESCALATE #2 | pre-push blocks non-allowlisted + bad naming; advisory covers the *account-mismatch* gap pre-push cannot see | inferred |
| `git push --force` | full | `git log --oneline <remote>/<branch>..HEAD` (what is being rewritten), `git for-each-ref refs/remotes` (does remote branch exist?), `git rev-parse <remote>/<branch>` (remote tip — what gets discarded), `git branch -r --contains <remote>/<branch>` (downstream consumers) | — | Low frequency, high stakes. **inferred, not measured** | NEVER #1 (no force to main/master), NEVER #8, ESCALATE #4 | pre-push naming/permission; force-to-protected is NOT blocked by current pre-push | inferred |
| `git push --force-with-lease` | full | `git rev-parse <remote>/<branch>` (expected remote tip — the lease basis), `git fetch <remote> <branch>` then compare (is the lease stale?), `git log --oneline` (rewritten range) | Whether someone else pushed since last fetch — `--force-with-lease` itself checks this at push time, but the rule can pre-warn if the local remote-tracking ref is stale | Low; the safer force variant. Advisory value is "you are still rewriting public history." **inferred, not measured** | new (named in briefing: --force-with-lease vs --force) | none | inferred |
| `git push --force-with-lease=<ref>:<sha>` | full | `git rev-parse <ref>` (lease sha matches?), `git for-each-ref` | — | Low. **inferred, not measured** | new | none | inferred |
| `git push --tags` | full | `git for-each-ref refs/tags` (tags being pushed), `git ls-remote --tags <remote>` (do they exist remotely?) | — | Low. **inferred, not measured** | new | none | inferred |
| `git push --mirror` | full | `git for-each-ref` (full ref set — mirror overwrites EVERYTHING), `git ls-remote <remote>` (what would be deleted) | — | Very low frequency, catastrophic stakes. **inferred, not measured** | new | none | inferred |
| `git push --delete <remote> <ref>` | full | `git ls-remote <remote> <ref>` (exists?), `git for-each-ref refs/remotes/<remote>/<ref>` (local tracking) | — | Low; explicit deletion. **inferred, not measured** | new | none | inferred |
| `git push origin HEAD:<branch>` (from detached/worktree) | full | `git symbolic-ref HEAD` (detached?), `git worktree list` (am I in a linked worktree?), `git rev-parse <branch>` (does local `<branch>` ref point at the sha being pushed? — incident #2) | — | Low frequency, high stakes — the "work is on origin but invisible to primary checkout" trap. **inferred, not measured** | Incident #2; ALWAYS #15 | none | inferred |
| `git fetch [<remote>]` | partial | `git remote -v`, `git config remote.<remote>.prune` | What the remote actually has — fetch is the act of learning that. A rule can warn about `--prune` deleting refs but not about incoming content | High if ungated; fetch is routine. Advisory only useful on `--prune` or `--force`. **inferred, not measured** | new | none | inferred |
| `git fetch --prune` | full | `git for-each-ref refs/remotes/<remote>` (which tracking refs would be pruned — `git remote prune <remote> --dry-run`) | — | Low; `--prune` deletes stale tracking refs. **inferred, not measured** | new | none | inferred |
| `git fetch --force` / `--force-with-lease` | full | `git for-each-ref refs/remotes` | — | Low. **inferred, not measured** | new | none | inferred |

### 1f. Worktree

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git worktree add [-b <branch>] <path> <ref>` | full | `git rev-parse --verify <ref>`, `git worktree list` (does path exist?), `git for-each-ref` (does branch exist?), `git status --porcelain` of the source tree | — | Low; ALWAYS #4 (owner-first naming). **inferred, not measured** | ALWAYS #4; NEVER #2 | pre-push naming gate fires later on push, not here | inferred |
| `git worktree remove <path>` | full | `git worktree list`, `git -C <path> status --porcelain` (is the worktree dirty?), `git -C <path> rev-parse HEAD` vs merge target (is its branch merged? — ALWAYS #17) | — | Low; ALWAYS #17 (reap worktrees before branches). **inferred, not measured** | ALWAYS #17 | none | inferred |
| `git worktree move <old> <new>` | full | `git worktree list`, filesystem check of `<new>` | — | Very low. **inferred, not measured** | new | none | inferred |
| `git worktree prune` | full | `git worktree list --porcelain` (which worktrees are stale/missing) | — | Very low; housekeeping. **inferred, not measured** | new | none | inferred |

### 1g. Stash

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git stash` / `git stash push` | full | `git status --porcelain` (what is being stashed), `git stash list` (stack depth — deep stacks are the orphan risk) | — | High — routine. Advisory only useful if stashing over an existing deep stack or untracked files (`-u`). **inferred, not measured** | new | none | inferred |
| `git stash pop` | full | `git stash list` (is there a stash?), `git stash show -p stash@{0}` (will it conflict with current tree?), `git status --porcelain` (dirty?) | — | Medium; pop conflicts strand the stash. **inferred, not measured** | ALWAYS #14 (autostash re-apply conflict) | none | inferred |
| `git stash apply` | full | `git stash list`, `git stash show -p`, `git status --porcelain` | — | Low; non-consuming. **inferred, not measured** | new | none | inferred |
| `git stash drop <stash>` | full | `git stash list` (depth), `git stash show -p <stash>` (what is being dropped — is it applied elsewhere?) | — | Low frequency, high stakes — dropped stash with no other copy is data loss. **inferred, not measured** | ALWAYS #14 (the autostash-drop-aways-from-loss warning) | none | inferred |
| `git stash clear` | full | `git stash list` (count — the loss surface) | — | Very low frequency, catastrophic stakes. **inferred, not measured** | ALWAYS #14 | none | inferred |
| `git stash branch <branch> <stash>` | full | `git stash list`, `git rev-parse --verify <branch>` | — | Very low. **inferred, not measured** | new | none | inferred |

### 1h. Submodule

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git submodule update [--init]` | full | `git submodule status`, `git config --file .gitmodules`, `git status --porcelain` (is the superproject dirty?) | — | Low; routine init. **inferred, not measured** | ESCALATE #7 (submodule conflicts) | none | inferred |
| `git submodule update --remote` | full | `git submodule status`, `git -C <sub> log --oneline` (what commits is it advancing to?), `git for-each-ref` (are those commits pushed?) | — | Low; advances submodule to remote tip — can rewrite the superproject's pinned sha. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git submodule deinit <path>` | full | `git submodule status`, `git -C <path> status --porcelain` (uncommitted submodule work?) | — | Very low; loses uncommitted submodule work. **inferred, not measured** | new | none | inferred |

### 1i. History Rewrite (Dangerous)

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git filter-branch ...` | full | `git rev-parse HEAD`, `git branch -r --contains HEAD` (is any of this history public?), `git for-each-ref` (refs that would be rewritten) | — | Very low frequency, catastrophic. git itself prints a warning. Advisory value: confirm no published refs in scope. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git filter-repo ...` | full | `git filter-repo --analyze` (dry-run), `git branch -r --contains HEAD` | — | Very low. **inferred, not measured** | new | none | inferred |
| `git reflog expire --expire=<time>` | full | `git reflog` (entries that would be dropped), `git reflog --all` | — | Very low; narrows the recovery window for `-D`'d commits. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git reflog expire --expire-unreachable=<time> --all` | full | `git reflog --all`, `git fsck --unreachable` (what becomes unreachable after expire) | — | Very low; the explicit `--all` + `--expire-unreachable` is the high-stakes signal. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git gc` | full | `git count-objects -v` (loose object count), `git reflog` (will reflog be preserved?) | — | Low; routine housekeeping. Advisory only useful if `gc` would prune reachable-via-reflog objects. **inferred, not measured** | new | none | inferred |
| `git gc --prune=now` | full | `git fsck --unreachable` (what would be pruned — is anything only-reachable-via-reflog?), `git reflog --all` | — | Low frequency, high stakes — `--prune=now` bypasses the 2-week grace. **inferred, not measured** | new (named in briefing) | none | inferred |
| `git gc --aggressive` | full | `git count-objects -v` | — | Very low; slow but not lossy. **inferred, not measured** | new | none | inferred |
| `git notes add` / `git notes remove` | full | `git notes --ref <ref> list` | — | Very low. **inferred, not measured** | new | none | inferred |

### 1j. Config / Remote / Tag

| Op | Pre-eval | Pre-exec state read | Missing for partial | Noise estimate | Source | Overlap w/ enforcement | Conf. |
|---|---|---|---|---|---|---|---|
| `git config <key> <value>` | full | `git config --get <key>` (current value), `git config --list` | — | Low; but mutating `pull.rebase`, `rebase.autoStash`, `branch.<name>.protected` changes the risk profile of OTHER ops. **inferred, not measured** | new (config mutation that silently enables autostash is an ALWAYS #14 vector) | none | inferred |
| `git remote add <name> <url>` | full | `git remote -v`, `git ls-remote <url>` (reachable?) | — | Very low. **inferred, not measured** | new | none | inferred |
| `git remote remove <name>` | full | `git remote -v`, `git for-each-ref refs/remotes/<name>` (tracking refs that go away) | — | Very low. **inferred, not measured** | new | none | inferred |
| `git remote set-url <name> <url>` | full | `git remote get-url <name>` (current), `git ls-remote <url>` | — | Very low; the incident #3 account-mismatch can be set here. **inferred, not measured** | Incident #3 context | none | inferred |
| `git tag <name>` | full | `git for-each-ref refs/tags/<name>` (exists?), `git rev-parse HEAD` | — | Low. **inferred, not measured** | new | none | inferred |
| `git tag -d <name>` | full | `git for-each-ref refs/tags/<name>`, `git ls-remote --tags origin <name>` (is it pushed?) | — | Low; deleting a pushed tag breaks downstream. **inferred, not measured** | new | none | inferred |
| `git tag -f <name>` | full | `git for-each-ref refs/tags/<name>` (old sha), `git ls-remote --tags origin <name>` | — | Very low; force-move of a pushed tag. **inferred, not measured** | new | none | inferred |

---

## 2. The Five Known Incidents — Mapped or Explained

| Incident | Mapped candidate | Status |
|---|---|---|
| `git add <dir>` swept another session's staged deletions | Row `git add <pathspec>` (1a) — pre-eval `full` via `git diff --cached --name-only` showing pre-existing staged paths | **Mapped.** The rule reads the existing staged set before `add` runs. |
| Pushed from cherry-pick worktree; primary never moved | Row `git push origin HEAD:<branch>` from detached/worktree (1e) — pre-eval `full` via `git symbolic-ref HEAD` + `git worktree list` + `git rev-parse <branch>` | **Mapped.** ALWAYS #15. |
| Push rejected 403; active `gh` account ≠ remote owner | Row `git push` (1e) — pre-eval `full` via `gh auth status` + `git remote get-url origin` | **Mapped.** ESCALATE #2. The pre-push hook does NOT see auth identity; this is the advisory's unique value. |
| Nearly ran autostash-prone op against 93-file dirty tree | Rows `git merge --autostash`, `git rebase --autostash`, `git pull --autostash` (1d) — pre-eval `full` via `git status --porcelain \| wc -l` | **Mapped.** ALWAYS #14. The autostash-orphan-guard is post-hoc; the advisory is the only preflight layer. |
| `git commit --only <paths>` silently dropped a named path | Row `git commit --only <paths>` (1b) — pre-eval `partial` | **Mapped (partial).** The rule can warn that the full staged set is not being committed and that named paths not currently staged will be silently excluded; it cannot read operator intent. |

All five mapped. No incident is "unadvisable."

---

## 3. Noise Threshold Reasoning

**The trap.** An advisory that fires on every commit, every push, every pull teaches the operator to skim past it. The briefing names this as the failure mode this packet exists to avoid. The table above shows that the highest-frequency operations (`git commit`, `git push`, `git pull`, `git stash`, `git add -A`) are exactly the ones where an ungated advisory is pure noise.

**Proposed threshold (inferred, not measured — to be validated against real history in a later pass):**

1. **Default-silent unless a signal is present.** An advisory fires only when a pre-exec state read returns a non-benign signal. Examples:
   - `git commit` → silent unless (staged set is empty) OR (unstaged WIP exists and staged set is non-empty and `--only`/`--include` not present) OR (HEAD is pushed and `--amend`).
   - `git push` → silent unless (branch not in allowlist) OR (force flag) OR (account mismatch) OR (detached/worktree HEAD with `HEAD:<branch>`).
   - `git pull` → silent unless (dirty count > threshold) AND (autostash configured or `--autostash` flag).
   - `git add -A`/`git add .` → silent unless (dirty count > threshold, e.g. > 20) OR (a directory pathspec) OR (pre-existing staged paths from another session).

2. **Threshold for dirty-count rules.** ALWAYS #14 incident was a 93-file dirty tree. A threshold of `> 20` dirty files for autostash-prone ops would have caught it. Below 20, autostash re-apply conflicts are recoverable; above, the orphan-stash loss surface is large. **This number is inferred, not measured.** A history-measurement pass should count dirty-file distributions at `merge`/`pull`/`rebase` invocations to set it on evidence.

3. **Rare-but-expensive ops fire unconditionally.** `reset --hard`, `clean -fdx`, `filter-branch`, `reflog expire --expire-unreachable --all`, `gc --prune=now`, `push --force`, `push --mirror`, `branch -D`, `stash clear`, `submodule deinit` fire on every invocation regardless of state. Their baseline frequency is low enough that an unconditional one-liner is not noise; it is a speed bump on a rarely-correct operation.

4. **Operations that look dangerous but are routine — DO NOT advise.** `git merge` (plain, no autostash, clean tree), `git rebase` on local-only commits, `git fetch` (no prune), `git pull` (clean tree, no autostash config), `git stash push` (empty stack), `git tag` (new), `git branch -d` (merged). These are the noise generators; the signal-gating rule above keeps them silent.

---

## 4. Findings Beyond the Briefing's Floor

The briefing asked for what the five-incident table misses. Candidates not in the incident list:

1. **`git push --mirror`** (1e) — catastrophic, very low frequency, no enforcement. High advisory value, near-zero noise.
2. **`git clean -fdx`** (1a) — wipes ignored files including possibly `.env`/secrets. NEVER #5 covers secrets at commit time, not at clean time.
3. **`git branch -D`** (1c) — bypasses the merged-check `-d` enforces. Reflog reachability is the recovery window; an advisory can name the reflog expiry state.
4. **`git stash clear`** (1g) — drops the entire stack. ALWAYS #14 names the autostash-drop case but not the explicit `clear`.
5. **`git config` mutating `pull.rebase`/`rebase.autoStash`** (1j) — silently turns future routine ops into ALWAYS #14 traps. This is a *meta* rule: the mutation is low-noise but it arms the autostash trap for every later `pull`/`rebase`.
6. **`git tag -d` / `git tag -f` on a pushed tag** (1j) — breaks downstream; no enforcement.
7. **`git remote set-url`** (1j) — the account-mismatch from incident #3 can be *introduced* here, not just exposed at push.
8. **`git restore --source=<ref>`** (1a) — silent time-travel discard; rarer than `restore` but lossy.
9. **`git reset --hard` on a dirty tree with no stash** (1a) — the loss surface is the entire dirty set; `git stash list` empty means no recovery.
10. **`git fetch --prune`** (1e) — deletes tracking refs; low noise but the dry-run (`git remote prune --dry-run`) makes the advisory precise.

---

## 5. Open Questions for Later Passes

- **Engine capability.** The current `CHECKS` are pure functions of the command string. A rule that reads repo state needs the engine to invoke git plumbing (or receive a state snapshot from the PreToolUse hook). Is that in phase 002/003 scope, or does it constrain which rules here are actually buildable? (This pass classifies state *availability*, not engine *support*.)
- **History measurement.** Every noise estimate above is `inferred, not measured`. A pass with shell access should run `git log --all --pretty=...`, reflog analysis, and a dirty-file-count distribution at historical merge/pull/rebase commits to convert inference into counts.
- **Intent gap for `--only`/`--include`.** The partial-evaluable rows all share the same gap: the rule can describe the state, not the operator's intent. Is a "you are committing a subset, here is what is excluded" advisory useful, or is it noise on every scoped commit?
- **Account-mismatch scope.** Incident #3 compares active `gh` account to remote owner. Should the rule compare against the remote *owner* (parsed from URL) or against an explicit allowlist? Spec.md Open Question #2 raises this; this pass does not answer it.
- **Which candidates belong in pre-push as enforcement, not here as advice?** Spec.md Open Question #3. `push --force` to a protected branch and `push --mirror` are enforcement candidates; the advisory is the fallback when enforcement is bypassed or absent.

---

## 6. Confidence Summary

- **confirmed:** 0 findings. I read the source (sk-git SKILL.md, dispatch-rule-checks.mjs, pre-push, README) but did not run any git-state verification — shell was non-interactive.
- **inferred:** all 60+ operation rows. Each is reasoned from git command semantics + documented workflow + the existing enforcement surface I read.
- **not measured:** every noise estimate. Stated explicitly in each row and in §0.

The next pass with shell access should downgrade these `inferred` rows to either `confirmed` (state read verified) or `measured` (noise counted), and should challenge the §3 threshold numbers with real distributions.
