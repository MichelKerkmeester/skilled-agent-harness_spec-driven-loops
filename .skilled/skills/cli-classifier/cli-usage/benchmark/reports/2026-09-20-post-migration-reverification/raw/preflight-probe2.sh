#!/usr/bin/env bash
# Second dispatch-gate probe pass: one attempt per hard rule, plus the boundaries of the
# stdin rule that the first pass surfaced (a quoted state value is not read as inline).

set -uo pipefail

LINT=.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs

probe() {
  local label="$1" command="$2"
  local payload out
  payload=$(python3 -c 'import json,sys; print(json.dumps({"tool_name":"Bash","tool_input":{"command":sys.argv[1]}}))' "$command")
  out=$(printf '%s' "$payload" | node "$LINT" 2>&1)
  printf '### %s\nCMD: %s\nOUT: %s\n\n' "$label" "$command" "${out:-<approved>}"
}

# Injectable state forms: only an unquoted inline value counts as inline.
probe "quoted-state-no-close"       'jev noul -q "Is it urgent?" -s "Restore service today."'
probe "quoted-state-with-close"     'jev noul -q "Is it urgent?" -s "Restore service today." </dev/null'
probe "unquoted-at-file"            'jev noul -q "Is it urgent?" -s @state.txt'
probe "dash-state-no-close"         'jev noul -q "Is it urgent?" -s -'
probe "dash-state-with-close"       'jev noul -q "Is it urgent?" -s - </dev/null'
probe "run-dash-no-close"           'jev run -'
# Declared violations of the remaining rules.
probe "choice-one-option"           'jev choice -q "Which queue?" -s @state.txt -o only=the only option'
probe "score-one-level"             'jev score -q "How severe?" -s @state.txt -l only'
probe "custom-no-endpoint"          'jev noul -q "Is it?" -s @state.txt --provider custom'
probe "inline-credential"           'TYPESAFE_API_KEY=sk-live-abc jev noul -q "Is it?" -s @state.txt </dev/null'
probe "mcp-nonloopback"             'jev-mcp --host 0.0.0.0'
# Controls: declared-legal shapes.
probe "choice-two-options"          'jev choice -q "Which queue?" -s @state.txt -o a=first -o b=second'
probe "score-two-levels"            'jev score -q "How severe?" -s @state.txt -l low -l high'
probe "custom-with-endpoint"        'jev noul -q "Is it?" -s @state.txt --provider custom --endpoint https://127.0.0.1:1/v1/systemone'
probe "mcp-loopback"                'jev-mcp'
