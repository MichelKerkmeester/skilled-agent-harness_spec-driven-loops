#!/usr/bin/env bash
# Negative control for the CP-003 step 1 teardown. Runs the committed block and the new block,
# each with the daemon idle timeout cut to one minute, then watches /tmp for the deleted sandbox
# to come back. Neither block is changed: each is extracted from its file and run as written.
# Env: NC_WORK_DIR (required, a scratch directory), NC_WATCH_SECONDS (default 200).
set -u
repo=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cd "$repo" || exit 1
scenario=.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md
work="${NC_WORK_DIR:?set NC_WORK_DIR to a scratch directory}"
watch_seconds="${NC_WATCH_SECONDS:-200}"
mkdir -p "$work"

# The first bash block after the test execution heading is step 1.
extract_step1='
import sys
text = sys.stdin.read()
body = text.split("## 3. TEST EXECUTION", 1)[1]
block = body.split("```bash\n", 1)[1].split("```", 1)[0]
sys.stdout.write(block)
'
git show HEAD:"$scenario" | python3 -c "$extract_step1" > "$work/committed-step1.sh"
python3 -c "$extract_step1" < "$scenario" > "$work/new-step1.sh"

export SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=1

snapshot() {
  ps -axo pid,ppid,command \
    | grep -E "system-skill-advisor-launcher|advisor-server|hf-model-server" | grep -v grep \
    | awk '{print "  pid=" $1, "ppid=" $2, $NF}'
}

run_case() {
  local name="$1" block="$2" rc sandbox t0 seen=""
  echo "== case: $name, started $(date -u +%H:%M:%SZ)"
  echo "-- step 1 block as run"
  sed 's/^/  | /' "$block"
  echo "-- advisor processes before"
  snapshot
  bash -x "$block" > "$work/$name.stdout" 2> "$work/$name.trace"
  rc=$?
  sandbox=$(grep -m1 -oE "SANDBOX=/tmp/cp003\.[A-Za-z0-9]+" "$work/$name.trace" | cut -d= -f2)
  echo "block exit=$rc sandbox=$sandbox, ended $(date -u +%H:%M:%SZ)"
  echo "-- block stdout, last 3 lines"
  tail -n 3 "$work/$name.stdout" | sed 's/^/  /'
  echo "-- advisor processes right after the block"
  snapshot
  t0=$(date +%s)
  while [ $(( $(date +%s) - t0 )) -lt "$watch_seconds" ]; do
    if [ -z "$seen" ] && [ -d "$sandbox" ]; then seen=$(( $(date +%s) - t0 )); fi
    sleep 5
  done
  if [ -n "$seen" ]; then
    echo "RESULT $name: $sandbox reappeared about ${seen}s after the block ended"
    find "$sandbox" -type f | sed 's/^/  file: /'
  else
    echo "RESULT $name: $sandbox did not reappear within ${watch_seconds}s"
  fi
  echo "-- advisor processes after the watch"
  snapshot
  if [ -d "$sandbox" ]; then rm -rf "$sandbox" && echo "removed the recreated $sandbox"; fi
  echo
}

echo "# CP-003 step 1 negative control, $(date -u +%Y-%m-%dT%H:%M:%SZ), HEAD $(git rev-parse --short HEAD)"
echo "# SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=1, watch ${watch_seconds}s per case"
echo
run_case committed "$work/committed-step1.sh"
run_case new "$work/new-step1.sh"
echo "# finished $(date -u +%Y-%m-%dT%H:%M:%SZ)"
