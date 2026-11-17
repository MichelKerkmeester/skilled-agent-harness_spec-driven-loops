#!/bin/bash
# Throwaway review probe. Each case writes one throwaway checkout under mktemp,
# runs the shipped check against it, prints the verdict, and removes the folder.
set -u
REPO="/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
CHECK="$REPO/.skilled/commands/doctor/scripts/hook-wiring-check.cjs"
MARKER=".skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js"

run_case() {
  local label="$1"
  local command="$2"
  local root
  root="$(mktemp -d "${TMPDIR:-/tmp}/hookwiring-3c.XXXXXX")"
  mkdir -p "$root/.claude"
  node -e '
    const fs = require("fs");
    const [file, command] = process.argv.slice(1);
    fs.writeFileSync(file, JSON.stringify({ hooks: { UserPromptSubmit: [{ hooks: [{ type: "command", command }] }] } }, null, 2));
  ' "$root/.claude/settings.json" "$command"
  local out code
  out="$(node "$CHECK" --root "$root" 2>&1)"
  code=$?
  printf '%s\t%s\t%s\n' "$label" "$code" "$out"
  rm -rf "$root"
}

run_case "plain node"                    "node $MARKER"
run_case "env-file attached"             "node --env-file=.env $MARKER"
run_case "env-file separated"            "node --env-file .env $MARKER"
run_case "title separated"               "node --title hook $MARKER"
run_case "max-old-space separated"       "node --max-old-space-size 4096 $MARKER"
run_case "conditions attached"           "node --conditions=development $MARKER"
run_case "conditions separated"          "node --conditions development $MARKER"
run_case "bash pipefail -c"              "bash -o pipefail -c 'node $MARKER'"
run_case "bash -e -c"                    "bash -e -c 'node $MARKER'"
run_case "command node"                  "command node $MARKER"
run_case "env --chdir separated"         "env --chdir /tmp node $MARKER"
run_case "node dot-slash marker"         "node ./$MARKER"
