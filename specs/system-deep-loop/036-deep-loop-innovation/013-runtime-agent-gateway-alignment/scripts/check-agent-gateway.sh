#!/usr/bin/env bash
# Guard: every deep-loop leaf agent that appends iteration state must record it
# through the append gateway, never by writing the *-state.jsonl projection directly.
# Exit 0 = all affected agents aligned; exit 2 = one or more still bypass the gateway.
#
# Affected agents: deep-research, deep-review, deep-alignment, ai-council.
# deep-improvement is proposal-only (appends no iteration state) and is intentionally excluded.
#
# FAIL CLOSED: every (existing runtime dir x agent) target and every prompt-pack
# template MUST resolve and be scanned. A missing target or a short check count
# is a failure — the guard never exits 0 just because it skipped what it could not find.

set -u
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 1

RUNTIME_DIRS=(.opencode/agents .claude/agents .cursor/agents .pi/agents .codex/agents .devin/agents)
AGENTS=(deep-research deep-review deep-alignment ai-council)
# Prompt-pack templates are also scanned: a bypass can hide in the rendered
# prompt surface just as easily as in the agent definition.
PROMPT_PACKS=(
  .opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl
  .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl
  .opencode/skills/system-deep-loop/deep-alignment/assets/alignment-prompt-pack.md.tmpl
)

expected=0
checked=0
missing=0
fail=0
missing_paths=()

resolve() { # dir agent -> path or empty
  local dir="$1" agent="$2"
  for cand in "$dir/$agent.md" "$dir/$agent.toml" "$dir/$agent/AGENT.md" "$dir/$agent"; do
    if [ -f "$cand" ]; then printf '%s' "$cand"; return 0; fi
  done
  return 1
}

# grep_maybe_exclude <pattern> <file> <exclude 0|1>
# Print matching lines. When exclude=1, drop lines that are prohibition prose
# (lines that tell the reader NOT to do the thing) so migration notes and
# "never do this" warnings in verbose prompt-packs do not false-fire.
grep_maybe_exclude() {
  local pat="$1" f="$2" exclude="$3"
  if [ "$exclude" -eq 1 ]; then
    grep -nE "$pat" "$f" \
      | grep -viE 'never|do not|don.t|forbidden|banned|read-only|read \+|projection|gateway|refresh|not[^a-z]|allowed-write'
  else
    grep -nE "$pat" "$f"
  fi
}

# direct_write_problems <file> <exclude_prose 0|1>
# Fills the global DW_PROBLEMS array with one entry per direct-write bypass
# shape found. exclude_prose=1 suppresses prohibition lines (prompt-pack prose).
direct_write_problems() {
  local f="$1" exclude="$2"
  DW_PROBLEMS=()

  # (B) Raw shell redirect — append `>>` OR truncate `>` — into the state
  #     projection. The target must sit in the same whitespace-delimited token
  #     as the redirect (real shell syntax), which avoids prose arrows such as
  #     "----> Write ... foo-state.jsonl" false-firing. Both the literal
  #     `*-state.jsonl` path and the prompt-pack `{state_paths_state_log}`
  #     placeholder are matched so the same rule covers agents and templates.
  if grep_maybe_exclude '(>>|>)[[:space:]]*[^[:space:]]*(state_paths_state_log|-state\.jsonl)' "$f" "$exclude" | grep -q .; then
    DW_PROBLEMS+=("raw redirect (>> or >) into state projection")
  fi

  # (B2) Pipe through `tee` writing the state projection directly — another
  #      shape that bypasses the gateway while looking like a normal pipeline.
  if grep_maybe_exclude '\|[[:space:]]*tee[[:space:]]+(-a[[:space:]]+)?[^[:space:]]*(state_paths_state_log|-state\.jsonl)' "$f" "$exclude" | grep -q .; then
    DW_PROBLEMS+=("tee pipe into state projection")
  fi

  # (D) --event-json aimed at the multi-line delta/state file. The gateway
  #     JSON.parses the whole argument file, so it must be a single record.
  #     The boundary after --event-json may be whitespace OR a backtick (a
  #     backtick-wrapped `--event-json`<path> with no space evades a
  #     whitespace-only rule), and may be zero-width, so both shapes are caught.
  if grep_maybe_exclude '\-\-event-json[[:space:]`]*[^[:space:]`]*(state_paths_delta_pattern|state_paths_state_log|deltas/|-state\.jsonl)' "$f" "$exclude" | grep -q .; then
    DW_PROBLEMS+=("--event-json points at a multi-line delta/state file (gateway wants one record)")
  fi
}

# --- Agent definitions: runtime dirs x agents -----------------------------
for dir in "${RUNTIME_DIRS[@]}"; do
  [ -d "$dir" ] || continue
  for agent in "${AGENTS[@]}"; do
    expected=$((expected+1))
    f="$(resolve "$dir" "$agent")" || {
      # FAIL CLOSED: an existing runtime dir must carry every affected agent.
      missing=$((missing+1))
      missing_paths+=("$dir/$agent — no .md/.toml/AGENT.md found")
      continue
    }
    checked=$((checked+1))
    problems=()

    # (A) Gateway must be named.
    grep -q 'append-mode-event' "$f" || problems+=("missing gateway reference (append-mode-event)")

    # (B/B2/D) Direct-write bypass shapes (redirect, tee, mis-aimed --event-json).
    direct_write_problems "$f" 0
    [ "${#DW_PROBLEMS[@]}" -gt 0 ] && problems+=("${DW_PROBLEMS[@]}")

    # (C) No residual prose write-instruction targeting *-state.jsonl,
    #     excluding lines that mark it read-only / a projection / gateway-fed / forbidden.
    if grep -inE '(bash-append|append (exactly )?(one|a )|write[^.]{0,30})[^.]{0,60}-state\.jsonl' "$f" \
        | grep -viE 'never|do not|read-only|read \+|projection|gateway|refresh|not (be )?written|append gateway' \
        | grep -q .; then
      problems+=("residual direct-write prose to *-state.jsonl")
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

# --- Prompt-pack templates: same direct-write shapes ----------------------
for tmpl in "${PROMPT_PACKS[@]}"; do
  expected=$((expected+1))
  if [ ! -f "$tmpl" ]; then
    missing=$((missing+1))
    missing_paths+=("$tmpl — prompt-pack template missing")
    continue
  fi
  checked=$((checked+1))
  # Prose exclusion on: templates legitimately narrate "never >> the projection"
  # which is a prohibition, not a bypass. Real bypass commands carry no such marker.
  direct_write_problems "$tmpl" 1
  if [ "${#DW_PROBLEMS[@]}" -gt 0 ]; then
    fail=$((fail+1))
    printf 'FAIL  %s\n' "$tmpl"
    for p in "${DW_PROBLEMS[@]}"; do printf '        - %s\n' "$p"; done
  else
    printf 'ok    %s\n' "$tmpl"
  fi
done

# --- Verdict: FAIL CLOSED -------------------------------------------------
echo "----"
echo "expected=$expected  checked=$checked  missing=$missing  failing=$fail"
if [ "$missing" -gt 0 ]; then
  printf 'MISSING (%d) — expected targets did not resolve:\n' "$missing"
  for m in "${missing_paths[@]}"; do printf '        - %s\n' "$m"; done
fi
# Every expected target must be checked, none missing, none failing — else fail.
if [ "$checked" -lt "$expected" ] || [ "$missing" -gt 0 ] || [ "$fail" -gt 0 ]; then
  exit 2
fi
exit 0
