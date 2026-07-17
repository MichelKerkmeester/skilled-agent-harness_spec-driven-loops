#!/usr/bin/env bash
# WHY: the agent-task lane in one runnable file — run a natural-language task
# under the selected account, optionally continuing a prior session. Tasks can
# pause on approvals, MFA, CAPTCHA, or vault unlock; those pauses are
# human-only boundaries, so this script reports them instead of retrying.

set -euo pipefail

command -v aside >/dev/null 2>&1 || { echo "aside not found — see INSTALL-GUIDE.md" >&2; exit 1; }

usage() {
  cat <<'EOF'
Usage: agent-task-session.sh "<task prompt>" [--session <id>] [--account <id>]

Examples:
  agent-task-session.sh "Open https://example.com and summarize the page"
  agent-task-session.sh "Continue: download the report we found" --session <id>
  agent-task-session.sh "Check my dashboard" --account <id>

Notes:
  - --session continues a prior agent task (account-scoped state).
  - --account selects an account for this direct task; it is documented for
    direct tasks and `aside exec` only, never for `aside repl` or `aside mcp`.
EOF
}

[ $# -ge 1 ] || { usage; exit 1; }
TASK_PROMPT="$1"; shift

SESSION_ID=""
ACCOUNT_ID=""
while [ $# -gt 0 ]; do
  case "$1" in
    --session) SESSION_ID="${2:?--session needs an id}"; shift ;;
    --account) ACCOUNT_ID="${2:?--account needs an id}"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
  shift
done

# Preflight: version fixture plus read-only account state. Built-in models
# fail closed when signed out, so surface that before burning a task run.
echo "== Preflight =="
aside --version 2>&1
if ! aside account status 2>&1; then
  echo "WARN: account status failed — built-in models fail closed when signed out." >&2
  echo "Recover with 'aside account use <id>' or pass --account." >&2
fi

cmd=(aside)
[ -n "$SESSION_ID" ] && cmd+=(--session "$SESSION_ID")
[ -n "$ACCOUNT_ID" ] && cmd+=(--account "$ACCOUNT_ID")
cmd+=("$TASK_PROMPT")

echo ""
echo "== Running agent task =="
printf 'Command: %q ' "${cmd[@]}"; echo ""
echo ""

# Capture stderr with stdout: pause/approval notices arrive there too.
if "${cmd[@]}" 2>&1; then
  echo ""
  echo "Task run returned. Verify the user-visible outcome yourself — a clean"
  echo "exit is not proof the goal was met."
else
  rc=$?
  echo "" >&2
  echo "Task exited non-zero ($rc). If output mentions an approval, MFA," >&2
  echo "CAPTCHA, identity check, or vault unlock, a human must act in the" >&2
  echo "Aside app and then resume; do not retry blindly." >&2
  exit "$rc"
fi
exit 0
