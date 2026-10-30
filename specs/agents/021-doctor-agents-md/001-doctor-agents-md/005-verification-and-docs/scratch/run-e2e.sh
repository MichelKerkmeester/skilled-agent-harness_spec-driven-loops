#!/usr/bin/env bash
# End-to-end runner for the shipped instruction fixtures.
#
# Each fixture is a recipe, so a copy is composed into the throwaway run root, checked,
# planned, applied with the digest that plan printed, checked again and then restored and
# compared against the pristine copy. One transcript per fixture lands beside this script.
# Every absolute path from this checkout is shortened on the way into a transcript, so a
# committed transcript carries no consumer path. The backup folder is redirected into the
# same throwaway root because a composed tree is not a git repository.
set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../../.." && pwd)"
FIXTURES="$REPO_ROOT/.skilled/commands/doctor/scripts/tests/fixtures/agents-md"
SCRIPTS="$REPO_ROOT/.skilled/commands/doctor/scripts"
OUT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/e2e"
WORK=/Users/michelkerkmeester/worktrees/public/.scratch-dc90/021-15
RUNS="$WORK/runs"
TMP="$WORK/tmp"

mkdir -p "$OUT" "$RUNS" "$TMP"

shorten() {
  sed -e "s|$RUNS/||g" -e "s|$TMP|<tmp>|g" -e "s|$REPO_ROOT|<repo>|g"
}

# Runs one command from the repository root and records its own exit status, not the
# status of whatever reformatted its output.
emit() {
  local output status
  output="$( ( cd "$REPO_ROOT" && TMPDIR="$TMP" "$@" ) 2>&1 )"
  status=$?
  printf '%s\n' "$output" | shorten
  echo "exit=$status"
  return 0
}

for fixture in absent adopted claude-only foreign forked over-budget pure shadowed-pin stale; do
  run="$RUNS/$fixture"
  pristine="$RUNS/$fixture-pristine"
  transcript="$OUT/$fixture.txt"
  plan_out="$RUNS/$fixture-plan.txt"
  rm -rf "$run" "$pristine"
  mkdir -p "$run"

  {
    echo "# Fixture: $fixture"
    echo "# Composed from .skilled/commands/doctor/scripts/tests/fixtures/agents-md/$fixture/fixture.json"
    echo "# Absolute paths are shortened: this checkout to <repo>, the run root to the fixture"
    echo "# name, and the throwaway backup root to <tmp>. Nothing else is edited."
    echo

    echo "\$ node .skilled/commands/doctor/scripts/tests/fixtures/agents-md/compose-fixture.cjs $fixture <run>"
    emit node "$FIXTURES/compose-fixture.cjs" "$fixture" "$run"
    echo
    cp -a "$run" "$pristine"

    echo "\$ node .skilled/commands/doctor/scripts/agents-md-check.cjs --root <run>"
    emit node "$SCRIPTS/agents-md-check.cjs" --root "$run"

    echo
    echo "\$ node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan --root <run>"
    plan_output="$( ( cd "$REPO_ROOT" && TMPDIR="$TMP" node "$SCRIPTS/agents-md-embed.cjs" plan --root "$run" ) 2>&1 )"
    plan_status=$?
    printf '%s\n' "$plan_output" >"$plan_out"
    printf '%s\n' "$plan_output" | shorten
    echo "exit=$plan_status"

    digest="$(sed -n 's/^plan-digest: //p' "$plan_out" | head -1)"
    run_dir="$(sed -n 's/^backup: //p' "$plan_out" | head -1)"

    if [ -n "$digest" ]; then
      echo
      echo "\$ node .skilled/commands/doctor/scripts/agents-md-embed.cjs apply --plan-digest $digest --root <run>"
      emit node "$SCRIPTS/agents-md-embed.cjs" apply --plan-digest "$digest" --root "$run"

      echo
      echo "\$ node .skilled/commands/doctor/scripts/agents-md-check.cjs --root <run>"
      emit node "$SCRIPTS/agents-md-check.cjs" --root "$run"

      echo
      echo "\$ node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan --root <run>   # the reconfigured tree"
      emit node "$SCRIPTS/agents-md-embed.cjs" plan --root "$run"

      echo
      echo "\$ node .skilled/commands/doctor/scripts/agents-md-embed.cjs restore --run=<backup> --yes"
      emit node "$SCRIPTS/agents-md-embed.cjs" restore --run="$run_dir" --yes

      echo
      echo "\$ diff -r <pristine-run> <run>"
      diff_output="$(diff -r "$pristine" "$run" 2>&1)"
      diff_status=$?
      printf '%s\n' "$diff_output" | shorten
      echo "exit=$diff_status"
    else
      echo
      echo "\$ diff -r <pristine-run> <run>   # the plan wrote nothing, so there is nothing to restore"
      diff_output="$(diff -r "$pristine" "$run" 2>&1)"
      diff_status=$?
      printf '%s\n' "$diff_output" | shorten
      echo "exit=$diff_status"
    fi
  } >"$transcript" 2>&1

  rm -rf "$pristine"
  echo "wrote $transcript"
done
