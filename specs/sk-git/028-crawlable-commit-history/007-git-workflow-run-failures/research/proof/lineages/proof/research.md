# Deep Research Synthesis - Git Hooks and sk-git Scripts Inventory (proof lineage)

- Session: `fanout-proof-1789123034382-9ptgi0`
- Executor: cli-pi, model `deepseek-v4.1-flash`, reasoning max
- Topic: Proof run after the run-failure adjustments: in one iteration, read `.opencode/scripts/git-hooks/README.md` and `.opencode/skills/sk-git/scripts/commit-id-naming.sh`, list the five hook files and the three sk-git scripts by name with one line each on what they guard, and write the iteration file.
- Stop reason: `maxIterationsReached` (1/1; convergence was telemetry only)
- Evidence base: one read-only iteration (`iterations/iteration-001.md`). No fetches. No git write commands. Every file written stayed inside this lineage directory.
- Artifacts: `iterations/iteration-001.md`, `deltas/iter-001.jsonl`, `findings-registry.json`, `deep-research-state.jsonl`.

## Verdict

The requested inventory is complete. Five hook files are declared by the git-hooks README and all five exist: `pre-commit`, `post-commit`, `post-merge`, `post-rewrite` and `pre-push`. Two further installed hooks exist on disk, `commit-msg` and `prepare-commit-msg`, and the README topology and the installer header comment do not list them. Three sk-git scripts are executable: `worktree-naming.sh`, `commit-id-naming.sh` and `stamp-branch.sh`, while the scripts README names only `worktree-naming.sh` plus the non-executable one-shot `migrate-legacy-branch-names.sh`. The drift is documentation-level. No behavior defect was found in this pass.

## The five hook files (one line each)

1. `pre-commit` guards the staged commit with an advisory doc-model-reference drift check plus seven blocking sub-gates (comment hygiene, agent-mirror sync, mirror parity, prompt-card sync, MCP mutation-class, compiled-routing re-mint and spec derived-metadata re-mint), and the two re-mint gates repair their own derived artifact instead of refusing when the packet is dirty only in files they derive.
2. `post-commit` guards the completed commit's publication path, publishing it to the shared live branch only from a linked worktree in a launch-wrapper session that exports `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH`, and running the autostash orphan guard.
3. `post-merge` guards merge-time `--autostash` entries, anchoring any un-applied stash under `refs/autostash-rescue/<sha>` and printing recovery instructions. Best effort, never blocks.
4. `post-rewrite` runs the same autostash orphan guard after an amend or rebase, including the stash a `rebase --autostash` records before git re-applies it. Best effort, never blocks.
5. `pre-push` guards the remote boundary, blocking a mass deletion and blocking pushes to branches outside the allowlist unless this push is approved (`main`, `skilled/v*` and the allowlist file pass with nothing set, a new branch needs `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`, an update accepts a bare `=1`).

Two further hook files are installed by the same glob but absent from the README topology: `commit-msg` (blocks an empty message, a subject outside `type(scope): imperative summary`, a numeric-only scope and a four-or-more-path commit without a body, and warns on clarity issues) and `prepare-commit-msg` (mints the `Commit-Id:` trailer through the ordinal allocator when absent, re-mints on cherry-pick, keeps on amend, appends `Spec:` from `SPECKIT_COMMIT_SPEC`).

## The three sk-git scripts (one line each)

1. `worktree-naming.sh` guards the numbered-worktree namespace, allocating `worktrees/NNN-slug` and `branches/NNN-slug` numbers under a clone-wide lock, creating branch and directory together and owning the grammar validators that the pre-push hook sources.
2. `commit-id-naming.sh` guards the repository-wide commit ordinal, validating the seven-digit id, scanning the high-water cache plus every commit message across all refs, and reserving `max + 1` under a lock in the common Git dir without ever back-filling a gap.
3. `stamp-branch.sh` guards the rebase-pick hole in that sequence, minting one ordinal per unique commit in `<base>..<branch>` for picks that carry no `Commit-Id` and rewriting only that range in one `git filter-repo` pass.

## Drift notes (documentation only)

- git-hooks README: topology at lines 67-78 and key-files table at lines 100-107 describe five hooks, while the folder holds seven and the installer glob installs seven.
- `install-git-hooks.sh` header comment at lines 5-16 names six hooks and omits `prepare-commit-msg`, which its own matcher at lines 43-48 admits.
- sk-git scripts README: tree at lines 28-33 predates `commit-id-naming.sh` and `stamp-branch.sh`.
- `commit-id-naming.sh` shows the ownerless-lock grace reclaim (lines 120-133), consistent with the landed run-failure adjustment `48f06d6bc8`. Read only, no lock was taken.

---

# Iteration records

The single iteration file follows under its own heading.

---

## Iteration 1 - The five hook files and the three sk-git scripts, by name

Focus: read `.opencode/scripts/git-hooks/README.md` and `.opencode/skills/sk-git/scripts/commit-id-naming.sh`, then list the five hook files and the three sk-git scripts with one line each on what they guard. Read-only pass: no fetches, no git write commands, no writes outside this lineage directory.

### What was read

- `.opencode/scripts/git-hooks/README.md` (187 lines): section 1 overview lines 20-29; section 3 package topology lines 67-78 (the five-hook set); section 4 key-files table lines 100-107; section 7 validation lines 161-170.
- `.opencode/skills/sk-git/scripts/commit-id-naming.sh` (293 lines): repo resolution 30-35; validators 41-48; scan and allocation 54-71; lock acquisition with the ownerless-lock grace 95-152 (grace reclaim 120-133); high-water persistence 171-188; `allocate_ordinal` 191-233; `rebuild_highwater` 239-256; CLI dispatch 262-292.
- Read-only directory listings of `.opencode/scripts/git-hooks/` and `.opencode/skills/sk-git/scripts/`.
- Supporting reads: `.opencode/scripts/install-git-hooks.sh` (173 lines, hook eligibility 43-48, install loop 131-147); `.opencode/skills/sk-git/scripts/stamp-branch.sh` header 1-30; `.opencode/skills/sk-git/scripts/README.md` section 2 tree 28-33 and section 3 table 39-43.

### The five hook files (the README-declared set)

1. `pre-commit` guards the staged commit with an advisory doc-model-reference drift check plus seven blocking sub-gates (comment hygiene, agent-mirror sync, mirror parity, prompt-card sync, MCP mutation-class, compiled-routing re-mint and spec derived-metadata re-mint). The two re-mint gates repair their derived artifact and stage the repair instead of refusing when the packet is dirty only in files the gate itself derives.
2. `post-commit` guards the completed commit's publication path. It publishes the commit to the shared live branch only from a linked worktree in a launch-wrapper session that exports both `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH`, and it runs the autostash orphan guard.
3. `post-merge` guards merge-time `--autostash` entries. It anchors any un-applied stash object under `refs/autostash-rescue/<sha>` so garbage collection cannot lose it, and prints recovery instructions. Best effort, never blocks.
4. `post-rewrite` runs the same autostash orphan guard after an amend or rebase, including the stash object a `rebase --autostash` records before git re-applies it. Best effort, never blocks.
5. `pre-push` guards the remote boundary. It blocks a mass deletion and blocks any push to a branch outside the allowlist unless this push is approved: `main`, `skilled/v*` and the allowlist file pass with nothing set, a new branch needs `SPECKIT_ALLOW_REMOTE_PUSH=<branch>` and an update accepts a bare `=1`. The new-branch naming-grammar gate was removed from here because it never refused a push the remote gate would have allowed.

### Hook files beyond the README's five (found on disk, installed by the same glob)

6. `commit-msg` guards the message shape. It blocks an empty message, a subject outside `type(scope): imperative summary`, a numeric-only scope and a commit staging four or more paths without a body, and it warns on process language and overlong body lines. Blocks print the `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` bypass.
7. `prepare-commit-msg` guards the machine trailer paragraph. It mints a `Commit-Id:` through the sk-git ordinal allocator whenever one is absent, re-mints a fresh id on cherry-pick, keeps the existing id on amend, and appends `Spec:` only when `SPECKIT_COMMIT_SPEC` supplies the packet. It exits untouched outside this repository.

### The three sk-git scripts (the three executable files in the folder)

1. `worktree-naming.sh` guards the numbered-worktree namespace. It allocates numbers for two independent per-namespace counters (`worktrees/` and `branches/`) under a clone-wide lock, creates the branch and directory together and owns the grammar validators that the pre-push hook sources, so allocator and gate cannot drift apart.
2. `commit-id-naming.sh` guards the repository-wide commit ordinal. It validates the seven-digit id, scans the high-water cache plus every commit message across all refs for the maximum in use, and reserves `max + 1` under a lock in the common Git dir so linked worktrees share one sequence. Gaps are never back-filled.
3. `stamp-branch.sh` guards the rebase-pick hole in that sequence. Rebase picks do not run `prepare-commit-msg`, so it mints one ordinal per unique commit in `<base>..<branch>` and rewrites only that range in a single `git filter-repo` pass.

The folder also holds `migrate-legacy-branch-names.sh` (mode 0644, not executable), a one-shot renumberer for the pre-grammar owner-first branch names, and `remote-branch-allowlist.txt`, the allowlist data the pre-push remote gate reads.

### Findings

1. [confirmed] The five README-declared hook files are `pre-commit`, `post-commit`, `post-merge`, `post-rewrite` and `pre-push`, named in the package topology at `README.md:67-78` and the key-files table at `README.md:100-107`, and all five exist on disk with mode 0755. OBSERVED: README lines plus directory listing.
2. [confirmed] The folder holds seven git hook files, not five, and `commit-msg` appears nowhere in the README at all. `prepare-commit-msg` is covered in section 1 at `README.md:25` but omitted from the topology and from the section 4 table. OBSERVED: directory listing shows `commit-msg`, `pre-commit`, `prepare-commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-push`; the README text read in full contains no `commit-msg` token.
3. [derived] The installer installs all seven. Its install loop globs the source folder and installs every file whose basename passes `is_git_hook_name` (`install-git-hooks.sh:131-147`), and that case statement admits `commit-msg` and `prepare-commit-msg` (`install-git-hooks.sh:43-48`). The header comment names only six hooks and omits `prepare-commit-msg` (`install-git-hooks.sh:5-16`). DERIVED: loop and matcher read, installer not executed.
4. [confirmed] The sk-git scripts README names only `worktree-naming.sh` and `migrate-legacy-branch-names.sh` (`scripts/README.md:28-33`), while the folder holds four shell scripts. The three executable ones are `worktree-naming.sh`, `commit-id-naming.sh` and `stamp-branch.sh` at mode 0755. The fourth, `migrate-legacy-branch-names.sh`, is mode 0644 and one-shot by design.
5. [confirmed] `commit-id-naming.sh` carries an ownerless-lock grace reclaim: a lock directory with no readable owner is treated as stale after about two seconds and reclaimed through an atomic rename, and a stolen lock that turns out live is restored in place (`commit-id-naming.sh:120-133`, using `_ci_mtime` at 86-93). This matches the landed run-failure adjustment `48f06d6bc8` ("reclaim an ownerless lock"). Read only, no lock was taken and no git command was run.

### Adjustments proposed

1. [docs only] git-hooks README: extend the section 3 topology and the section 4 table to the seven installed hooks and give `commit-msg` a key-files row, because the installer installs seven.
2. [docs only] git-hooks installer header comment (`install-git-hooks.sh:5-16`): add `prepare-commit-msg` to the installed-hooks list so the comment matches the glob result.
3. [docs only] sk-git scripts README: add `commit-id-naming.sh` and `stamp-branch.sh` to the section 2 tree and a section 3 row each, noting that `prepare-commit-msg` sources the allocator and `stamp-branch.sh` sources `commit-id-naming.sh`.

No code change is proposed. Nothing in this pass shows a behavior defect.

### What this iteration could not settle

- Whether the live `.git/hooks` entries in this worktree resolve to these source files. Machine-wide `core.hooksPath` shadowing was a prior lineage finding and was not re-verified here.
- Whether `install-git-hooks.sh --status` would report drift today. It was not run because this pass is a read-only listing and the installer resolves a global hooks path.
- Whether a fresh install of `commit-msg` and `prepare-commit-msg` is currently desired. That is a packet decision, not a listing fact.
