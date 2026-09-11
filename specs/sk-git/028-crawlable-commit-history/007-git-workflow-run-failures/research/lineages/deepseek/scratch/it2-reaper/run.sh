#!/usr/bin/env bash
# R2.6-R2.7: reaper target resolution and removal under a live child process.
# Fixture naming follows the wrapper: dir <runtime>-<slug>, branch work/<runtime>/<slug>,
# marker <runtime>-<slug>.pid, socket dir <runtime>-<slug>.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it2-reaper"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
export HOME="$B/fakehome"
rm -rf "$B/repo" "$B/custom-base" "$B/fakehome"
mkdir -p "$B/repo" "$B/custom-base" "$B/fakehome"
cd "$B/repo" || exit 9
git init -q -b main
printf 'seed\n' > seed.txt
git add -A
git commit -qm "chore(repro): seed"
COMMON="$(git rev-parse --git-common-dir)"
MARKERS="$COMMON/worktree-sessions"
mkdir -p "$MARKERS"
REAPER="$R/.opencode/bin/worktree-reaper.sh"

SLUG="20260101-000000-1111"
WT="$B/custom-base/pi-$SLUG"
git worktree add -q -b "work/pi/$SLUG" "$WT"
printf '999999\n' > "$MARKERS/pi-$SLUG.pid"

echo "########## R2.6a reaper WITHOUT SPECKIT_WORKTREE_BASE: live worktree's socket dir pruned ##########"
mkdir -p "$B/fakehome/.spk-wt-sock/pi-$SLUG"
printf 'socket fixture\n' > "$B/fakehome/.spk-wt-sock/pi-$SLUG/daemon.sock.fixture"
set +e
bash "$REAPER" 2>&1
echo "reaper_rc=$?"
set -e
echo "worktree dir still exists: $([ -d "$WT" ] && echo yes || echo NO)"
echo "socket dir still exists:   $([ -d "$B/fakehome/.spk-wt-sock/pi-$SLUG" ] && echo yes || echo NO)"
echo "marker still exists:       $([ -f "$MARKERS/pi-$SLUG.pid" ] && echo yes || echo NO)"

echo ""
echo "########## R2.6b reaper WITH the base env and a LIVE marker: worktree kept ##########"
mkdir -p "$B/fakehome/.spk-wt-sock/pi-$SLUG"
printf 'socket fixture\n' > "$B/fakehome/.spk-wt-sock/pi-$SLUG/daemon.sock.fixture"
sleep 120 &
HOLDER=$!
printf '%s\n' "$HOLDER" > "$MARKERS/pi-$SLUG.pid"
set +e
SPECKIT_WORKTREE_BASE="$B/custom-base" bash "$REAPER" 2>&1
echo "reaper_rc=$?"
set -e
echo "worktree dir still exists: $([ -d "$WT" ] && echo yes || echo NO)"
echo "socket dir still exists:   $([ -d "$B/fakehome/.spk-wt-sock/pi-$SLUG" ] && echo yes || echo NO)"
kill "$HOLDER" 2>/dev/null || true

echo ""
echo "########## R2.6c same mis-resolution with a LIVE pid marker: marker still pruned ##########"
sleep 120 &
HOLDER2=$!
printf '%s\n' "$HOLDER2" > "$MARKERS/pi-$SLUG.pid"
echo "holder pid alive: $(kill -0 "$HOLDER2" 2>/dev/null && echo yes || echo no)"
set +e
bash "$REAPER" 2>&1
set -e
echo "marker still exists:       $([ -f "$MARKERS/pi-$SLUG.pid" ] && echo yes || echo NO)"
kill "$HOLDER2" 2>/dev/null || true

echo ""
echo "########## R2.7 dead marker but a live child with cwd inside: worktree removed ##########"
SLUG2="20260101-000000-2222"
WT2="$B/repo/.worktrees/pi-$SLUG2"
mkdir -p "$B/repo/.worktrees"
git worktree add -q -b "work/pi/$SLUG2" "$WT2"
printf '999999\n' > "$MARKERS/pi-$SLUG2.pid"
bash -c "cd '$WT2' && exec sleep 120" &
CHILD=$!
sleep 1
echo "child_pid=$CHILD alive_before=$(kill -0 "$CHILD" 2>/dev/null && echo yes || echo no)"
echo "child cwd exists before: $([ -d "$WT2" ] && echo yes || echo NO)"
set +e
bash "$REAPER" 2>&1
echo "reaper_rc=$?"
set -e
echo "worktree dir after reaper: $([ -d "$WT2" ] && echo yes || echo NO)"
echo "branch work/pi/$SLUG2 after: $(git branch --list "work/pi/$SLUG2" | wc -l | tr -d ' ')"
echo "child still alive after:   $(kill -0 "$CHILD" 2>/dev/null && echo yes || echo no)"
kill "$CHILD" 2>/dev/null || true
