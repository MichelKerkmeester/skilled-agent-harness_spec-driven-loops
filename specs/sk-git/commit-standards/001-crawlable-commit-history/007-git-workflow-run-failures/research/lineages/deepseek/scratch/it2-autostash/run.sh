#!/usr/bin/env bash
# R2.5: a conflicted `git rebase --autostash` leaves an orphaned stash; the
# post-rewrite guard anchors it but nothing re-applies it.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it2-autostash"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/repo"
mkdir -p "$B/repo/.opencode/scripts/git-hooks/lib"
cp "$R/.opencode/scripts/git-hooks/post-rewrite" "$B/repo/.opencode/scripts/git-hooks/post-rewrite"
cp "$R/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh" "$B/repo/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh"
cd "$B/repo" || exit 9
git init -q -b main
printf 'base f\n' > f.txt
printf 'base g\n' > g.txt
git add -A
git commit -qm "chore(repro): base"
git checkout -q -b work
printf 'work changes f\n' > f.txt
git commit -qam "feat(repro): work changes f"
git checkout -q main
printf 'main changes g\n' > g.txt
git commit -qam "chore(repro): main changes g"
cp "$B/hook-wrapper.sh" .git/hooks/post-rewrite
chmod +x .git/hooks/post-rewrite
printf 'local uncommitted change\n' > f.txt

echo "########## R2.5 git rebase --autostash with a conflicting re-apply ##########"
set +e
git rebase --autostash work 2>&1
echo "rebase_rc=$?"
set -e
echo "--- stash list after rebase ---"
git stash list
echo "--- working tree status (dirty check for autosync) ---"
git status --porcelain
echo "--- f.txt content (the local edit is NOT here) ---"
cat f.txt
echo "--- post-rewrite invocation log ---"
cat .git/post-rewrite-invocations.log 2>/dev/null || echo "post-rewrite never ran"
echo "--- autostash rescue anchor ---"
git show-ref | grep autostash-rescue || echo "none"
echo "--- alert log ---"
cat .opencode/logs/autostash-orphan-alerts.log 2>/dev/null || echo "no log"
echo "--- manual guard run after the fact (stash entry now present) ---"
set +e
bash .opencode/scripts/git-hooks/post-rewrite rebase <<< "old new" 2>&1
echo "manual_guard_rc=$?"
set -e
git show-ref | grep autostash-rescue || echo "no anchor alone"
cat .opencode/logs/autostash-orphan-alerts.log 2>/dev/null || echo "no log"
