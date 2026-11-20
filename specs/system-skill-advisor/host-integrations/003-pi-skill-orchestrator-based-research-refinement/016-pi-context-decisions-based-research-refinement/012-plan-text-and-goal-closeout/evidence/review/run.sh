#!/usr/bin/env bash
# Usage: run.sh <id> -- one read-only Opus medium review on the second Claude account.
set -u
ROOT=/Users/michelkerkmeester/worktrees/public/474-advisor-pasted-context-and-crash-fallback
D=$ROOT/tmp/review-briefs
ID=$1
CFG=/Users/michelkerkmeester/.claude-account2
TOKEN=$(cat "$CFG/.oauth-token")
PROMPT=$(cat "$D/prompt-$ID.txt")
cd "$ROOT" || exit 9
env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_CODE_SSE_PORT CLAUDE_CONFIG_DIR="$CFG" CLAUDE_CODE_OAUTH_TOKEN="$TOKEN" AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 claude -p "$PROMPT" --model claude-opus-5-5 --effort medium --permission-mode plan --agent review --output-format text </dev/null > "$D/out-$ID.txt" 2> "$D/err-$ID.log"
echo "$ID EXIT=$?" >> "$D/exits.txt"
