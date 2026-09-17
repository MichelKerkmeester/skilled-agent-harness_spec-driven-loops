Columns: path, line, column, hash, class and detail from the rule, text of the line.

~~~~tsv
.skilled/scripts/git-hooks/README.md	20	1	bb5264e2344cfbff	R1:path	`.opencode/scripts/git-hooks/` holds the hook scripts this repo installs into `.git/hooks/`. Hooks here are advisory-first: each one's primary check has its own bypass env var: with two exceptions whose headline check blocks by default: `pr
.skilled/scripts/git-hooks/README.md	30	37	907a8d39630c8c49	R3:directory	- Each gate finds its scripts under `.opencode/`, a path that keeps resolving once the tree moves to `.skilled/` and `.opencode` becomes a link to it, and every staged-path filter and pathspec names both roots. A checkout that ships the too
.skilled/scripts/git-hooks/README.md	30	118	907a8d39630c8c49	R3:segment	- Each gate finds its scripts under `.opencode/`, a path that keeps resolving once the tree moves to `.skilled/` and `.opencode` becomes a link to it, and every staged-path filter and pathspec names both roots. A checkout that ships the too
.skilled/scripts/git-hooks/README.md	85	14	2e646293f6cd3444	R1:path	post-commit → .opencode/hooks/shared/hook-flags.sh, .opencode/bin/git-sync.sh
.skilled/scripts/git-hooks/README.md	85	52	2e646293f6cd3444	R1:path	post-commit → .opencode/hooks/shared/hook-flags.sh, .opencode/bin/git-sync.sh
.skilled/scripts/git-hooks/README.md	86	13	ba16ae33d62c67d5	R1:path	pre-commit → .opencode/hooks/git/pre-commit, sk-doc validator, skill-advisor card-sync guard, doctor mutation-class guard, .opencode/bin/compiled-route-manifest.cjs
.skilled/scripts/git-hooks/README.md	86	123	ba16ae33d62c67d5	R1:path	pre-commit → .opencode/hooks/git/pre-commit, sk-doc validator, skill-advisor card-sync guard, doctor mutation-class guard, .opencode/bin/compiled-route-manifest.cjs
.skilled/scripts/git-hooks/README.md	87	11	a0ddf62c5e75265d	R1:path	pre-push → .opencode/skills/sk-git/scripts/worktree-naming.sh (sourced; validators only), lib/mass-deletion-guard.sh
.skilled/scripts/git-hooks/README.md	104	89	cfd84f48fd3ab95e	R1:path	| `post-commit` | Publishes the just-completed commit to the shared live branch through `.opencode/bin/git-sync.sh --auto --quiet`, and only from a linked worktree in a launch-wrapper session that exports both `SPECKIT_AUTOSYNC=1` and `SPEC
.skilled/scripts/git-hooks/README.md	107	408	ff7a03d4fc319d70	R1:path	| `lib/autostash-orphan-guard.sh` | Defines `autostash_orphan_guard()`, the one function `post-commit`, `post-merge` and `post-rewrite` source. Reads the sequencer's recorded autostash object, so a rebase autostash is anchored before git re
.skilled/scripts/git-hooks/README.md	143	5	ec5f0fe489fe66d5	R1:path	│ to .opencode/logs/autostash-orphan-alerts │
.skilled/scripts/git-hooks/README.md	152	5	cb2f84b6598f41d1	R1:path	bash .opencode/scripts/install-git-hooks.sh             # symlink all hooks in this folder into .git/hooks/
.skilled/scripts/git-hooks/README.md	153	5	2ba572c51e3a1c8b	R1:path	bash .opencode/scripts/install-git-hooks.sh --uninstall  # remove symlinks this installer created
.skilled/scripts/git-hooks/README.md	154	5	a40e4a2949dfb93e	R1:path	bash .opencode/scripts/install-git-hooks.sh --status     # report where each hook resolves
.skilled/scripts/git-hooks/README.md	164	8	f996b53b8d9b5d17	R1:path	bash -n .opencode/scripts/git-hooks/pre-commit
.skilled/scripts/git-hooks/README.md	165	8	86a1c77563261e84	R1:path	bash -n .opencode/scripts/git-hooks/post-commit
.skilled/scripts/git-hooks/README.md	166	8	8211c526070e64d7	R1:path	bash -n .opencode/scripts/git-hooks/post-merge
.skilled/scripts/git-hooks/README.md	167	8	1614540211c7879f	R1:path	bash -n .opencode/scripts/git-hooks/post-rewrite
.skilled/scripts/git-hooks/README.md	168	8	cc4ec4e27b2ba0a3	R1:path	bash -n .opencode/scripts/git-hooks/pre-push
.skilled/scripts/git-hooks/README.md	169	8	f6144205aae616fd	R1:path	bash -n .opencode/scripts/git-hooks/prepare-commit-msg
.skilled/scripts/git-hooks/README.md	170	8	bf76613a21662367	R1:path	bash -n .opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh
.skilled/scripts/git-hooks/lib/README.md	27	198	66a707f2f0eb8d39	R1:path	| [`autostash-orphan-guard.sh`](autostash-orphan-guard.sh) | Finds autostash entries, anchors each stash commit under `refs/autostash-rescue/`, prints recovery instructions and records an alert in `.opencode/logs/autostash-orphan-alerts.log
.skilled/scripts/git-hooks/lib/README.md	50	8	bf76613a21662367	R1:path	bash -n .opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh
.skilled/scripts/git-hooks/lib/README.md	51	8	21caee260102a4cd	R1:path	bash -n .opencode/scripts/git-hooks/lib/mass-deletion-guard.sh
.skilled/scripts/git-hooks/lib/README.md	57	5	269c51028dc237a7	R1:path	bash .opencode/scripts/git-hooks/tests/mass-deletion-guard.test.sh
~~~~
