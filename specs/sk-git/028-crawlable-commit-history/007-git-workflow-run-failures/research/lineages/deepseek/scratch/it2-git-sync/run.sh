#!/usr/bin/env bash
# R2.1-R2.4: git-sync diverged-tip cases in a throwaway repo with a bare origin.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it2-git-sync"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/origin.git" "$B/session" "$B/other"
mkdir -p "$B"
git init -q --bare "$B/origin.git"
git init -q -b main "$B/session"
cd "$B/session" || exit 9
printf 'line one\nline two\n' > shared.txt
printf 'other\n' > other.txt
git add -A
git commit -qm "chore(repro): seed"
git remote add origin "$B/origin.git"
git push -q origin main:live
git checkout -q -b session/one
printf 'line one\nline two\nsession change\n' > shared.txt
git commit -qam "feat(repro): session change"
SYNC="$R/.opencode/bin/git-sync.sh"

echo "########## R2.1 diverged, non-conflicting: rebase + publish ##########"
git clone -q "$B/origin.git" "$B/other"
cd "$B/other" || exit 9
git checkout -q live
printf 'other session\n' > other.txt
git commit -qam "fix(repro): other session change"
git push -q origin live
cd "$B/session" || exit 9
sha_before="$(git rev-parse HEAD)"
set +e
bash "$SYNC" --live live --remote origin 2>&1
echo "sync_rc=$?"
set -e
sha_after="$(git rev-parse HEAD)"
echo "sha_before=$sha_before"
echo "sha_after =$sha_after"
echo "session_head_rewritten=$([ "$sha_before" != "$sha_after" ] && echo yes || echo no)"

echo ""
echo "########## R2.2 diverged, conflicting: abort + pending ##########"
cd "$B/other" || exit 9
git fetch -q origin
git checkout -q -B live origin/live
printf 'line one\nline two CONFLICT from live\n' > shared.txt
git commit -qam "fix(repro): live edits shared"
git push -q origin live
cd "$B/session" || exit 9
printf 'line one\nline two session conflict\n' > shared.txt
git commit -qam "feat(repro): session edits shared"
sha_before2="$(git rev-parse HEAD)"
set +e
bash "$SYNC" --live live --remote origin 2>&1
echo "sync_rc=$?"
set -e
sha_after2="$(git rev-parse HEAD)"
echo "sha_unchanged=$([ "$sha_before2" = "$sha_after2" ] && echo yes || echo no)"
if [ -e .git/rebase-merge ] || [ -e .git/rebase-apply ]; then echo "rebase state LEFT BEHIND"; else echo "no rebase state left"; fi

echo ""
echo "########## R2.3 diverged with dirty TRACKED file: refuse ##########"
printf 'uncommitted local edit\n' >> shared.txt
set +e
bash "$SYNC" --live live --remote origin 2>&1
echo "sync_rc=$?"
set -e
git checkout -q -- shared.txt

echo ""
echo "########## R2.4 pre-existing rebase state: refuse to touch ##########"
mkdir -p .git/rebase-merge
set +e
bash "$SYNC" --live live --remote origin 2>&1
echo "sync_rc=$?"
set -e
rmdir .git/rebase-merge
