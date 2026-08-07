#!/usr/bin/env bash
# Dispatch ONE read-only review seat and parse it into canonical artifacts.
# Usage: run-seat.sh <opencode|claude> <model> <label> <angle> <lineageDir> <iter> <global> <promptFile> [timeoutSec] [configDir|native]
set -uo pipefail

REPO=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
CLAUDE_BIN=/Users/michelkerkmeester/.superset/bin/claude
EXTRACT="$REPO/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75/extract-seat.cjs"

EXECUTOR="$1"; MODEL="$2"; LABEL="$3"; ANGLE="$4"; LINEAGE_DIR="$5"; ITER="$6"; GLOBAL="$7"; PROMPT_FILE="$8"
TO="${9:-600}"; CONFIG_DIR="${10:-$HOME/.claude-account2}"

cd "$REPO" || exit 3
mkdir -p "$LINEAGE_DIR/raw"
LOG="$LINEAGE_DIR/raw/iter-$ITER.log"
PROMPT="$(cat "$PROMPT_FILE")"

if [ "$EXECUTOR" = "opencode" ]; then
  gtimeout -k 15 "$TO" opencode run --model "$MODEL" --variant "${OPENCODE_VARIANT:-xhigh}" --format json --dir "$REPO" "$PROMPT" </dev/null >"$LOG" 2>&1
  RC=$?
else
  CLEANUP_DIR=""
  ENVDIR=()
  if [ "$CONFIG_DIR" = "isolated" ]; then
    # Per-seat lightweight config dir seeded from acct2 essentials (creds live in
    # the keychain, shared by user) — avoids the config-dir contention hang that
    # kills concurrent claude -p on a shared CLAUDE_CONFIG_DIR.
    CDIR=$(mktemp -d "${TMPDIR:-/tmp}/claude-seat.XXXXXX")
    cp "$HOME/.claude-account2/.claude.json" "$CDIR/" 2>/dev/null
    cp "$HOME/.claude-account2/.oauth-token" "$CDIR/" 2>/dev/null
    cp "$HOME/.claude-account2/CLAUDE.md" "$CDIR/" 2>/dev/null
    [ -f "$HOME/.claude-account2/.credentials.json" ] && cp "$HOME/.claude-account2/.credentials.json" "$CDIR/" 2>/dev/null
    # Creds live in the keychain (keyed to the original dir), so a copied dir is
    # "Not logged in". The acct2 OAuth token authenticates a fresh dir headlessly.
    TOK=$(cat "$HOME/.claude-account2/.oauth-token" 2>/dev/null)
    ENVDIR=(env "CLAUDE_CONFIG_DIR=$CDIR" "CLAUDE_CODE_OAUTH_TOKEN=$TOK")
    CLEANUP_DIR="$CDIR"
  elif [ "$CONFIG_DIR" != "native" ]; then
    ENVDIR=(env "CLAUDE_CONFIG_DIR=$CONFIG_DIR")
  fi
  "${ENVDIR[@]}" gtimeout -k 15 "$TO" "$CLAUDE_BIN" -p "$PROMPT" --model "$MODEL" --permission-mode plan --output-format text </dev/null >"$LOG" 2>&1
  RC=$?
  [ -n "$CLEANUP_DIR" ] && rm -rf "$CLEANUP_DIR" 2>/dev/null
fi

if [ "$RC" -eq 124 ] || [ "$RC" -eq 137 ]; then
  echo "SEAT $LABEL iter$ITER g#$GLOBAL STATUS=timeout rc=$RC (to=${TO}s)"
fi

node "$EXTRACT" --log "$LOG" --executor "$EXECUTOR" --label "$LABEL" --model "$MODEL" --angle "$ANGLE" --lineage-dir "$LINEAGE_DIR" --iter "$ITER" --global "$GLOBAL"
ERC=$?
if [ "$ERC" -eq 3 ]; then
  IMD="$LINEAGE_DIR/iterations/iteration-$(printf '%03d' "$ITER").md"
  [ -f "$IMD" ] && mv "$IMD" "$LINEAGE_DIR/raw/iter-$ITER.unparsed.md"
  touch "$LINEAGE_DIR/raw/iter-$ITER.FAILED"
  echo "SEAT $LABEL iter$ITER g#$GLOBAL FAILED (no parseable findings; will retry)"
fi
echo "  (rc=$RC erc=$ERC log=$LOG)"
# Surface a non-zero status when the dispatch failed OR parsing produced nothing,
# so the pool can route retries / trigger the claude->native fallback.
if [ "$RC" -ne 0 ]; then exit "$RC"; fi
exit "$ERC"
