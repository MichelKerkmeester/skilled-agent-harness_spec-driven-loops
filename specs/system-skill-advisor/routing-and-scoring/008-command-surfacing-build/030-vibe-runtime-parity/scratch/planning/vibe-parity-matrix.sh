#!/usr/bin/env zsh
# Prints one line per Vibe gap this phase builds, from the repository root. Each line runs
# the surface the gap names and prints what a Vibe user or a measure of Vibe gets today.
# The scorer line scores the committed Vibe reader fixture through a one-line run log in a
# temporary folder under $TMPDIR. The brief and label lines run the probes beside this script
# under an isolated advisor scope, so no real flags file, socket or receipt takes part.
# Nothing in the checkout is written, and the temporary folder is removed.
set -u
HERE=${0:A:h}
ROOT=$(git rev-parse --show-toplevel)
RAD=$ROOT/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy
FX=$ROOT/.skilled/hooks/shared/tests/session-readers/fixtures/vibe/scratch-cwd
SID=$(jq -r .session_id $FX/meta.json)
TMP=$(mktemp -d "${TMPDIR:-/var/tmp/}vibe-matrix.XXXXXX")
trap 'rm -rf "$TMP"' EXIT

print -r -- "{\"runtime\":\"vibe\",\"rowId\":\"cmd-create-agent-plain-tune-01\",\"arm\":\"pre\",\"exit\":0,\"locator\":{\"sessionId\":\"$SID\",\"transcriptPath\":\"$FX\"}}" > $TMP/run-log.jsonl
print -r -- "G1 scorer      $(node $RAD/score-command-transcripts.mjs --summary $TMP/run-log.jsonl --json | jq -c '.vibe.pre | {scored, unscoredRuns}')"

argv_err=$(node $RAD/run-command-behaviour.mjs --print-argv vibe 2>&1 >/dev/null | head -1)
argv_rc=$(node $RAD/run-command-behaviour.mjs --print-argv vibe >/dev/null 2>&1; print $?)
print -r -- "G2 runner      exit=$argv_rc $argv_err"

wiring=$(node $ROOT/.skilled/commands/doctor/scripts/hook-wiring-check.cjs --root $ROOT --json | jq -c '[.checks[] | "\(.runtime):\(.status)"]')
print -r -- "G3 wiring      $wiring"

yaml_rows=$(rg -c 'cli/vibe/sync-(prompts|agents|skills)-vibe\.cjs' $ROOT/.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml || print 0)
route_rows=$(rg -c 'cli/vibe/sync-(prompts|agents|skills)-vibe\.cjs --check' $ROOT/.skilled/commands/doctor/_routes.yaml || print 0)
print -r -- "G5 mirrors     workflow-lines=$yaml_rows route-lines=$route_rows"

zsh $HERE/isolated-probe.sh $HERE/vibe-brief-probe.mjs "write a readme for the utils folder" "Check my git hooks setup" "my skilled install is broken, check its health" \
  | awk '/^--- prompt/ { n = $3; next } { print "G6 brief " n "     " $0 }'

zsh $HERE/isolated-probe.sh $HERE/policy-label-probe.mjs | rg 'lifecycle=startup' | sed 's/^/G11 label      /'
