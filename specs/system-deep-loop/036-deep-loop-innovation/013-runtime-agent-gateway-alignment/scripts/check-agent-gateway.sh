#!/usr/bin/env bash
# Guard: every deep-loop leaf agent that appends iteration state must record it
# through the append gateway, never by writing the *-state.jsonl projection directly.
# Exit 0 = all affected agents aligned; exit 2 = one or more still bypass the gateway.
#
# Affected agents: deep-research, deep-review, deep-alignment, ai-council.
# deep-improvement is proposal-only (appends no iteration state) and is intentionally excluded.

set -u
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 1

RUNTIME_DIRS=(.opencode/agents .claude/agents .cursor/agents .pi/agents .codex/agents .devin/agents)
AGENTS=(deep-research deep-review deep-alignment ai-council)

fail=0
checked=0

resolve() { # dir agent -> path or empty
  local dir="$1" agent="$2"
  for cand in "$dir/$agent.md" "$dir/$agent.toml" "$dir/$agent/AGENT.md" "$dir/$agent"; do
    if [ -f "$cand" ]; then printf '%s' "$cand"; return 0; fi
  done
  return 1
}

for dir in "${RUNTIME_DIRS[@]}"; do
  for agent in "${AGENTS[@]}"; do
    f="$(resolve "$dir" "$agent")" || continue
    checked=$((checked+1))
    problems=()

    # (A) Gateway must be named.
    grep -q 'append-mode-event' "$f" || problems+=("missing gateway reference (append-mode-event)")

    # (B) No raw shell redirect into a *-state.jsonl projection.
    if grep -qE '>>[[:space:]]*[^|`]*-state\.jsonl' "$f"; then
      problems+=("raw redirect '>> *-state.jsonl'")
    fi

    # (C) No residual prose write-instruction targeting *-state.jsonl,
    #     excluding lines that mark it read-only / a projection / gateway-fed / forbidden.
    if grep -inE '(bash-append|append (exactly )?(one|a )|write[^.]{0,30})[^.]{0,60}-state\.jsonl' "$f" \
        | grep -viE 'never|do not|read-only|read \+|projection|gateway|refresh|not (be )?written|append gateway' \
        | grep -q .; then
      problems+=("residual direct-write prose to *-state.jsonl")
    fi

    # (D) The gateway --event-json must be a single-record file, not the multi-line
    #     delta stream or the state projection (the gateway JSON.parses the whole file).
    if grep -inE '\-\-event-json[[:space:]]+[^ ]*(deltas/|-state\.jsonl)' "$f" | grep -q .; then
      problems+=("--event-json points at a multi-line delta/state file (gateway wants one record)")
    fi

    if [ "${#problems[@]}" -gt 0 ]; then
      fail=$((fail+1))
      printf 'FAIL  %s\n' "$f"
      for p in "${problems[@]}"; do printf '        - %s\n' "$p"; done
    else
      printf 'ok    %s\n' "$f"
    fi
  done
done

echo "----"
echo "checked=$checked  failing=$fail"
[ "$fail" -eq 0 ] && exit 0 || exit 2
