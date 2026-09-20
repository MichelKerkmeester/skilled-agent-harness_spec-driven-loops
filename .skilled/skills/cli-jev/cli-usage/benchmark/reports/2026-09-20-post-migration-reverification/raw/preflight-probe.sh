#!/usr/bin/env bash
# Live dispatch-gate probes from the migrated hub home.
#
# Each probe feeds one Claude-shaped tool call to the preflight lint and prints the
# lint's exit status with its decision. The migration repointed the audit row's
# packetPath at cli-jev/cli-usage/SKILL.md, so these are the rows whose behavior the
# move changed: before the repoint the hard rules were read from a path that no longer
# existed and the lint failed open.

set -u

LINT=.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs

probe() {
  local label="$1" command="$2"
  local payload out rc
  payload=$(python3 -c 'import json,sys; print(json.dumps({"tool_name":"Bash","tool_input":{"command":sys.argv[1]}}))' "$command")
  out=$(printf '%s' "$payload" | node "$LINT" 2>&1)
  rc=$?
  printf '### %s\nCMD: %s\nRC: %s\nOUT: %s\n\n' "$label" "$command" "$rc" "${out:-<empty>}"
}

probe "violating-value-with-run"      'jev run @request.json --value'
probe "clean-run"                     'jev run @request.json'
probe "clean-noul"                    'jev noul -q "Is it urgent?" -s "Restore service today."'
probe "inline-credential"             'JEV_API_KEY=sk-live-abc jev noul -q "Is it?" -s "x"'
probe "prose-mention"                 'echo "remember to run jev run @request.json --value later"'
probe "unrelated-bash"                'git status --short'
