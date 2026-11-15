#!/bin/bash
# Runs one guard fixture: a throwaway trusted project whose .vibe/hooks.toml is the given file,
# the repository's model config (or a fixture config) copied into a fresh VIBE_HOME, and one keyed
# print-mode turn. Prints the export verdict, then DENIED or NOT-DENIED from the session journal,
# where Vibe records a pre_tool deny as hook_completed with output type "skip". export.json never
# shows it.
# usage: run-fixture.sh <hooks.toml> <prompt> [model-alias] [config.toml]
set -u
HOOKS=$1; PROMPT=$2; MODEL=${3:-deepseek-flash}; CONFIG=${4:-}
REPO=$(cd "$(dirname "$0")/../../../.." && pwd -P)
# Trust is matched on the resolved path, so /var/folders must be spelled /private/var/folders.
PROJ=$(cd "$(mktemp -d)" && pwd -P); HOME_DIR=$(mktemp -d); OUT=$(cd "$(mktemp -d)" && pwd -P)
mkdir -p "$PROJ/.vibe"
# A guard that judges the project layout ships a tree/ beside its hooks.toml, copied in as the project.
[ -d "$(dirname "$HOOKS")/tree" ] && cp -R "$(dirname "$HOOKS")/tree/." "$PROJ/"
sed "s|@REPO@|$REPO|g" "$HOOKS" > "$PROJ/.vibe/hooks.toml"
# A fixture config replaces the repository's rows, so a probe can pin its own
# model window; without it the repository config is copied as before.
if [ -n "$CONFIG" ]; then
  sed "s|@REPO@|$REPO|g" "$CONFIG" > "$HOME_DIR/config.toml"
else
  cp "$REPO/.vibe/config.toml" "$HOME_DIR/config.toml"
fi
printf 'trusted = ["%s"]\nuntrusted = []\n' "$PROJ" > "$HOME_DIR/trusted_folders.toml"
(cd "$PROJ" && VIBE_HOME="$HOME_DIR" REPO_ROOT="$REPO" vibe -p "$PROMPT" --model "$MODEL" --auto-approve \
  --output-dir "$OUT/out" </dev/null >"$OUT/stdout" 2>"$OUT/stderr")
echo "exit=$? $(jq -r '"export_exit=\(.exit_code) outcome=\(.outcome)"' "$OUT/out/export.json" 2>/dev/null)"
# Walk every journal record as JSON: a deny reason can itself contain brackets or quotes.
DENY=$(cat "$OUT"/out/session/journal/*.jsonl 2>/dev/null | jq -r '
  .. | objects | select(.type? == "hook_completed" and .result.output.type? == "skip")
  | [.result.output.reason[]? | if type == "object" then .text // "" else tostring end] | join(" ")' 2>/dev/null | head -1)
if [ -n "$(cat "$OUT"/out/session/journal/*.jsonl 2>/dev/null | jq -c '.. | objects | select(.type? == "hook_completed" and .result.output.type? == "skip")' 2>/dev/null | head -1)" ]; then
  echo "DENIED: $DENY"
else
  echo "NOT-DENIED"
fi
# Every hook outcome, so a post_tool or session_start hook that only adds context is visible too.
echo "hooks: $(cat "$OUT"/out/session/journal/*.jsonl 2>/dev/null | jq -r '.. | objects | select(.type? == "hook_completed") | "\(.result.hook)=\(.result.output.type? // "none")"' 2>/dev/null | sort | uniq -c | tr -s ' ' | tr '\n' ';')"
echo "out=$OUT"
