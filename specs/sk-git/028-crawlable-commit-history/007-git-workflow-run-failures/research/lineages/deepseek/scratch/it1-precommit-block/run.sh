#!/usr/bin/env bash
# R1.2 + R1.3 reproduction: real pre-commit hook copied into a throwaway repo.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-precommit-block"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/repo"
mkdir -p "$B/repo/specs/x/001-p" "$B/repo/.opencode/scripts/git-hooks"
cp "$R/.opencode/scripts/git-hooks/pre-commit" "$B/repo/.opencode/scripts/git-hooks/pre-commit"
cp "$R/.opencode/scripts/git-hooks/commit-msg" "$B/repo/.opencode/scripts/git-hooks/commit-msg"
cd "$B/repo" || exit 9
git init -q -b main
printf '# packet spec\n\nseed body\n' > specs/x/001-p/spec.md
printf '{"fingerprint":"seed"}\n' > specs/x/001-p/graph-metadata.json
printf 'seed\n' > base.txt
git add -A
git commit -qm "chore(repro): seed packet"
mkdir -p .git/hooks
cp .opencode/scripts/git-hooks/pre-commit .git/hooks/pre-commit
cp .opencode/scripts/git-hooks/commit-msg .git/hooks/commit-msg
chmod +x .git/hooks/pre-commit .git/hooks/commit-msg

echo "########## R1.2: stage spec.md, leave derived graph-metadata.json dirty, then commit ##########"
printf '\nmore spec text\n' >> specs/x/001-p/spec.md
git add specs/x/001-p/spec.md
printf '{"fingerprint":"stale-from-previous-gate-run"}\n' > specs/x/001-p/graph-metadata.json
set +e
git commit -m "docs(x): update packet spec" 2>&1
rc=$?
set -e
echo "commit_rc=$rc"
echo "staged-after-block:"
git diff --cached --name-only | sed 's/^/  /'

echo ""
echo "########## R1.3: narrowed commit (git commit -- <pathspec>) with a staged spec doc ##########"
git checkout -- .
git reset -q
printf '\nthird edit\n' >> specs/x/001-p/spec.md
git add specs/x/001-p/spec.md
set +e
git commit -m "docs(x): narrowed commit" -- specs/x/001-p/spec.md 2>&1
rc=$?
set -e
echo "commit_rc=$rc"
