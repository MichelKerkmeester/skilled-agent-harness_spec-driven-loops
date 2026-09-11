#!/usr/bin/env bash
# R5.1: a lock directory left by a killed allocator with no pid file wedges the next mint.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it5-locks"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/repo"
mkdir -p "$B/repo"
cd "$B/repo" || exit 9
git init -q -b main
printf 'seed\n' > f.txt
git add f.txt
git commit -qm "chore(repro): seed"
COMMON="$(git rev-parse --git-common-dir)"
ALLOC="$R/.opencode/skills/sk-git/scripts/commit-id-naming.sh"

echo "########## R5.1a lock dir with NO pid file (kill between mkdir and pid write) ##########"
mkdir "$COMMON/commit-id-number.lock"
start=$(date +%s)
set +e
bash "$ALLOC" allocate 2>&1
rc=$?
set -e
end=$(date +%s)
echo "allocate_rc=$rc elapsed_s=$((end - start))"
ls -la "$COMMON/commit-id-number.lock" 2>/dev/null | sed 's/^/  /' || echo "  lock dir gone"
rm -rf "$COMMON/commit-id-number.lock"

echo ""
echo "########## R5.1b lock owned by a LIVE unrelated pid ##########"
sleep 120 &
HOLDER=$!
mkdir "$COMMON/commit-id-number.lock"
printf '%s\n' "$HOLDER" > "$COMMON/commit-id-number.lock/pid"
start=$(date +%s)
set +e
bash "$ALLOC" allocate 2>&1
rc=$?
set -e
end=$(date +%s)
echo "allocate_rc=$rc elapsed_s=$((end - start))"
kill "$HOLDER" 2>/dev/null || true
rm -rf "$COMMON/commit-id-number.lock"

echo ""
echo "########## R5.1c clean mint after the stale lock is removed ##########"
bash "$ALLOC" allocate
