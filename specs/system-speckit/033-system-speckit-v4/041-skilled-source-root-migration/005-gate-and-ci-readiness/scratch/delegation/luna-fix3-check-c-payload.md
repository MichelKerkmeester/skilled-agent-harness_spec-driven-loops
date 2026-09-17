# Edits for unit luna-fix3-check-c

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      continue
    }
    rest = part
    while (match(rest, /\047\.(opencode|skilled)\/[^\047]*\047/)) {
~~~~

NEW:

~~~~text
      continue
    }
    if (part ~ /^[[:space:]]*((local|export|readonly)[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?[[:space:]]*$/) {
      path = part; sub(/^[^=]*="?/, "", path); sub(/"?[[:space:]]*$/, "", path); emit("repo", path)
      continue
    }
    if (part ~ /(^|[[:space:]])git[[:space:]]/) spec = 1
    varpaths(part, grp, spec)
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    rest = part
    while (match(rest, /\047\.(opencode|skilled)\/[^\047]*\047/)) {
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
    }
    if (part ~ /(^|[[:space:]])git[[:space:]]/) {
      spec = 1; rest = part; sub(/.*[[:space:]]--([[:space:]]|$)/, "", rest)
    } else if (spec) {
      rest = part
    } else {
      if (part ~ /"\.(opencode|skilled)\//) emit("note", "argument")
      continue
    }
    gsub(/\047[^\047]*\047/, "", rest); roots(rest, grp)
  }
}'
~~~~

NEW:

~~~~text
      record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
    }
    if (spec) {
      rest = part; sub(/.*[[:space:]]--([[:space:]]|$)/, "", rest); gsub(/\047[^\047]*\047/, "", rest); roots(rest, grp)
    } else if (part ~ /"\.(opencode|skilled)\//) {
      emit("note", "argument")
    }
    unread(part)
  }
}'
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text

scan_hook() { # scan_hook <relpath>
  local rel="$1" out ln kind tok twin
  out="$(awk "$LEX_AWK$TWIN_AWK$HOOK_AWK" "$ROOT/$rel")"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
~~~~

NEW:

~~~~text

scan_hook() { # scan_hook <relpath>
  local rel="$1" ln kind tok twin
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$HOOK_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      twin-ok) TWINS=$((TWINS + 1)) ;;
      twin-one) fail filter-twins "$rel:$ln" "pathspec $tok has no twin $twin" ;;
    esac
  done <<<"$out"
  check_regex "$rel"
  unread_lines "$rel" "$(printf '%s\n%s\n' "$out" "$REGEX_LINES" | cut -f1)"
}

~~~~

NEW:

~~~~text
      twin-ok) TWINS=$((TWINS + 1)) ;;
      twin-one) fail filter-twins "$rel:$ln" "pathspec $tok has no twin $twin" ;;
      miss) fail parser-miss "$rel:$ln" "names a source root that no rule reads" ;;
    esac
  done <<<"$PARSED"
  check_regex "$rel"
}

~~~~

## Edit 5

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# Workflow tokens: path filters, executable paths, and bare root mentions such as
# `npm --prefix .opencode`, which carry no path to resolve. A path filter may list its
# entries below the key at any indent or inline on one line, and any other shape fails
# closed, because a filter the parser cannot read would otherwise pass unchecked. A
# filter's entries form its group. A quoted run scalar is unwrapped to its shell text,
# and an echo or printf command in it is a message, while the commands beside it are
# still read.
WORKFLOW_AWK='
function emit(kind, tok) { print FNR "\t" kind "\t" tok }
{
  raw = $0
~~~~

NEW:

~~~~text
# Workflow tokens: path filters, executable paths, and bare root mentions such as
# `npm --prefix .opencode`, which carry no path to resolve. A path filter may list its
# entries below the key at any indent or inline on one line, negated or not, and any
# other shape fails closed, because a filter the parser cannot read would otherwise pass
# unchecked. A filter's entries form its group. A quoted run scalar is unwrapped to its
# shell text, and an echo or printf command in it is a message, while the commands
# beside it are still read.
WORKFLOW_AWK='
function emit(kind, tok) { hits++; print FNR "\t" kind "\t" tok }
function unread(part) { if (part ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
  raw = $0
~~~~

## Edit 6

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  code = (raw ~ /#/) ? uncomment(raw) : raw
  match(code, /^[ ]*/); ind = RLENGTH
  if (inpaths) {
    if (code ~ /^[ ]*-[ ]/ && ind >= pind) {
      val = code; sub(/^[ ]*-[ ]*/, "", val); gsub(/[\047"]/, "", val); sub(/[ ]+$/, "", val)
      if (val ~ /^\.(opencode|skilled)\//) record(val, pgrp)
      next
    }
~~~~

NEW:

~~~~text
  code = (raw ~ /#/) ? uncomment(raw) : raw
  match(code, /^[ ]*/); ind = RLENGTH
  hits = 0
  if (inpaths) {
    if (code ~ /^[ ]*-[ ]/ && ind >= pind) {
      val = code; sub(/^[ ]*-[ ]*/, "", val); gsub(/[\047"]/, "", val); sub(/[ ]+$/, "", val)
      if (val ~ /^!?\.(opencode|skilled)\//) record(val, pgrp)
      unread(code)
      next
    }
~~~~

## Edit 7

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      for (i = 1; i <= n; i++) {
        item = items[i]; gsub(/[\047" ]/, "", item)
        if (item ~ /^\.(opencode|skilled)\//) record(item, FNR)
      }
    } else {
~~~~

NEW:

~~~~text
      for (i = 1; i <= n; i++) {
        item = items[i]; gsub(/[\047" ]/, "", item)
        if (item ~ /^!?\.(opencode|skilled)\//) record(item, FNR)
        else if (item ~ /\.(opencode|skilled)/) emit("miss", "filter")
      }
    } else {
~~~~

## Edit 8

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    part = parts[p]
    if (part ~ /^[[:space:]]*(-[[:space:]]+)?(run:[[:space:]]+)?((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
      if (part ~ /\.(opencode|skilled)/) emit("note", "message")
~~~~

NEW:

~~~~text
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    part = parts[p]; hits = 0
    if (part ~ /^[[:space:]]*(-[[:space:]]+)?(run:[[:space:]]+)?((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
      if (part ~ /\.(opencode|skilled)/) emit("note", "message")
~~~~

## Edit 9

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      emit("bare", ".opencode"); line = substr(line, RSTART + RLENGTH)
    }
  }
}'
~~~~

NEW:

~~~~text
      emit("bare", ".opencode"); line = substr(line, RSTART + RLENGTH)
    }
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    unread(part)
  }
}'
~~~~
