#!/bin/sh
# ───────────────────────────────────────────────────────────────
# COMPONENT: Post-Agent Capture Fixture
# ───────────────────────────────────────────────────────────────
# Records one post_agent invocation as a single JSON line: the stdin payload, a
# listing of the session root, and the journal state the hook can see when it
# starts. The journal is snapshotted before anything else is read, because the
# engine keeps writing while the hook runs; a later read would answer the wrong
# question. DENY_MODE=once denies the first invocation only; always denies all.
set -u

CAPTURE_LOG=${CAPTURE_LOG:-${TMPDIR:-/tmp}/vibe-post-agent-capture.log}
payload=$(cat)
[ -n "$payload" ] || payload='{}'
transcript_path=$(printf '%s' "$payload" | jq -r '.transcript_path // ""' 2>/dev/null || printf '')
journal="$transcript_path/journal"

listing() {
  if [ -n "$1" ] && [ -d "$1" ]; then
    ls -la "$1" 2>/dev/null | jq -R -s 'split("\n") | map(select(length > 0))'
  else
    printf '[]'
  fi
}

# The first read is the snapshot, so the reply state and the listing describe the
# same moment. A torn final line is dropped rather than failing the capture.
invocation=0
[ -f "$CAPTURE_LOG" ] && invocation=$(wc -l < "$CAPTURE_LOG" | tr -d ' ')
snapshot="$CAPTURE_LOG.snapshot.$((invocation + 1))"
cat "$journal"/*.jsonl 2>/dev/null > "$snapshot" || :
summary=$(jq -R -s '
  split("\n") | map(select(length > 0) | (fromjson? // empty)) as $records
  | {
      journal_records: ($records | length),
      completion_succeeded: ([$records[] | .. | objects | select(.type? == "completion_succeeded")] | length),
      last_assistant_text: ([ $records[]
          | select(.type == "projection_delta") | .payload.delta[]?
          | select(.op == "append_entry") | .entry
          | select(.type == "message" and .role == "assistant") ]
        | last | if . == null then "" else ([.content[]? | select(.type == "text") | .text] | join("")) end),
      last_turn_id: ([ $records[] | .. | objects | select(.turn_id? != null) | .turn_id ] | last // "")
    }' "$snapshot" 2>/dev/null || printf '{}')

jq -cn \
  --arg at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --argjson payload "$payload" \
  --arg transcriptPath "$transcript_path" \
  --arg snapshot "$snapshot" \
  --argjson summary "$summary" \
  --argjson sessionListing "$(listing "$transcript_path")" \
  --argjson journalListing "$(listing "$journal")" \
  '{at: $at, payload: $payload, transcript_path: $transcriptPath, snapshot: $snapshot,
    session_listing: $sessionListing, journal_listing: $journalListing} + $summary' \
  >> "$CAPTURE_LOG"

case "${DENY_MODE:-}" in
  always)
    printf '%s\n' '{"decision": "deny", "reason": "post-agent fixture: revise the reply"}'
    ;;
  once)
    marker="$CAPTURE_LOG.once"
    if [ ! -f "$marker" ]; then
      : > "$marker"
      printf '%s\n' '{"decision": "deny", "reason": "post-agent fixture: revise the reply"}'
    fi
    ;;
esac
exit 0
