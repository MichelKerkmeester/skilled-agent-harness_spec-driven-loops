# Edits for unit luna-ci-check

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> in those files resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, and a
#                    glob matches something
#   filter-twins     every workflow path filter, dependabot directory, hook pathspec
#                    and regex that names one root also names the other
~~~~

NEW:

~~~~text
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> in those files, and every
#                    variable assigned a literal .opencode/<path>, resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
#                    node_modules or dist path exists; echo and printf text runs nothing
#   filter-twins     every workflow path filter, dependabot directory, hook pathspec
#                    and regex that names one root also names the other, within the
#                    same filter, update entry, array or command
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
swap_root() { # swap_root <token>: the same path under the other source root
  case "$1" in
    .opencode/*) printf '.skilled/%s' "${1#.opencode/}" ;;
    .skilled/*) printf '.opencode/%s' "${1#.skilled/}" ;;
    /.opencode/*) printf '/.skilled/%s' "${1#/.opencode/}" ;;
    /.skilled/*) printf '/.opencode/%s' "${1#/.skilled/}" ;;
  esac
}
~~~~

NEW:

~~~~text
# Twin matching shared by the hook, workflow and dependabot parsers. A parser records
# each root-naming entry with the group it belongs to, and the twin must sit in that
# group: matched anywhere in the file, a comment, a message or another event's filter
# could stand in for a twin the rule itself lacks.
TWIN_AWK='
function record(tok, grp) { nrec++; rline[nrec] = FNR; rtok[nrec] = tok; rgrp[nrec] = grp; have[grp, tok] = 1 }
function twin(tok) {
  if (tok ~ /^\/?\.opencode\//) sub(/\.opencode\//, ".skilled/", tok)
  else sub(/\.skilled\//, ".opencode/", tok)
  return tok
}
END {
  for (i = 1; i <= nrec; i++) {
    tw = twin(rtok[i])
    print rline[i] "\t" (((rgrp[i], tw) in have) ? "twin-ok" : "twin-one") "\t" rtok[i] "\t" tw
  }
}'
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# Script paths a hook builds from a variable, and pathspecs it hands to git.
HOOK_AWK='
function emit(kind, tok) { print FNR "\t" kind "\t" tok }
function roots(text, kind,    tok, c) {
  while (match(text, /(^|[^A-Za-z0-9_}\/$.])\.(opencode|skilled)\/[A-Za-z0-9._*\/$-]*/)) {
    tok = substr(text, RSTART, RLENGTH); c = substr(tok, 1, 1)
    if (c != ".") tok = substr(tok, 2)
    emit(kind, tok); text = substr(text, RSTART + RLENGTH)
  }
}
{
  raw = $0
  if (raw ~ /^[[:space:]]*#/) next
  line = raw
~~~~

NEW:

~~~~text
# Script paths a hook builds from a variable or assigns as a literal, and pathspecs it
# hands to git, grouped by the array or the command that holds them. A command runs on
# over backslash continuation lines.
HOOK_AWK='
function emit(kind, tok) { print FNR "\t" kind "\t" tok }
function roots(text, grp,    tok, c) {
  while (match(text, /(^|[^A-Za-z0-9_}\/$.])\.(opencode|skilled)\/[A-Za-z0-9._*\/$-]*/)) {
    tok = substr(text, RSTART, RLENGTH); c = substr(tok, 1, 1)
    if (c != ".") tok = substr(tok, 2)
    record(tok, grp); text = substr(text, RSTART + RLENGTH)
  }
}
{
  raw = $0
  if (raw ~ /^[[:space:]]*#/) next
  if (!cont) cmd = FNR
  cont = (raw ~ /\\$/)
  line = raw
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
  }
  if (inarr) {
    if (raw ~ /^[[:space:]]*\)/) { inarr = 0; next }
    roots(raw, "spec"); next
  }
  if (raw ~ /^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*=\([[:space:]]*$/) { inarr = 1; next }
  if (raw ~ /^[[:space:]]*(echo|printf)[[:space:]]/) next
  line = raw
  while (match(line, /\047\.(opencode|skilled)\/[^\047]*\047/)) {
    emit("spec", substr(line, RSTART + 1, RLENGTH - 2)); line = substr(line, RSTART + RLENGTH)
  }
  if (raw ~ /git / && raw ~ / -- /) { rest = raw; sub(/.* -- /, "", rest); gsub(/\047[^\047]*\047/, "", rest); roots(rest, "spec") }
}'
~~~~

NEW:

~~~~text
    emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
  }
  if (raw ~ /^[[:space:]]*((local|export|readonly)[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?([[:space:]]+#.*)?[[:space:]]*$/) {
    path = raw; sub(/^[^=]*="?/, "", path); sub(/"?([[:space:]]+#.*)?[[:space:]]*$/, "", path); emit("repo", path)
  }
  if (inarr) {
    if (raw ~ /^[[:space:]]*\)/) { inarr = 0; next }
    roots(raw, arr); next
  }
  if (raw ~ /^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*=\([[:space:]]*$/) { inarr = 1; arr = FNR; next }
  if (raw ~ /^[[:space:]]*(echo|printf)[[:space:]]/) next
  line = raw
  while (match(line, /\047\.(opencode|skilled)\/[^\047]*\047/)) {
    record(substr(line, RSTART + 1, RLENGTH - 2), cmd); line = substr(line, RSTART + RLENGTH)
  }
  if (raw ~ /git / && raw ~ / -- /) { rest = raw; sub(/.* -- /, "", rest); gsub(/\047[^\047]*\047/, "", rest); roots(rest, cmd) }
}'
~~~~

## Edit 5

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  local rel="$1" ln kind tok items=0 twin mentions
  while IFS=$'\t' read -r ln kind tok; do
    [[ -n "$ln" ]] || continue
    items=$((items + 1))
    case "$kind" in
      repo)
        if [[ -e "$ROOT/$tok" ]]; then RESOLVED=$((RESOLVED + 1))
        else fail hook-inputs "$rel:$ln" "\$REPO_ROOT/$tok resolves nowhere"; fi ;;
      var) DYNAMIC=$((DYNAMIC + 1)) ;;
      spec)
        twin="$(swap_root "$tok")"
        if grep -qF -- "$twin" "$ROOT/$rel"; then TWINS=$((TWINS + 1))
        else fail filter-twins "$rel:$ln" "pathspec $tok has no twin $twin"; fi ;;
    esac
  done < <(awk "$HOOK_AWK" "$ROOT/$rel")
~~~~

NEW:

~~~~text
  local rel="$1" ln kind tok items=0 twin mentions
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
    items=$((items + 1))
    case "$kind" in
      repo)
        if [[ -e "$ROOT/$tok" ]]; then RESOLVED=$((RESOLVED + 1))
        else fail hook-inputs "$rel:$ln" "\$REPO_ROOT/$tok resolves nowhere"; fi ;;
      var) DYNAMIC=$((DYNAMIC + 1)) ;;
      twin-ok) TWINS=$((TWINS + 1)) ;;
      twin-one) fail filter-twins "$rel:$ln" "pathspec $tok has no twin $twin" ;;
    esac
  done < <(awk "$TWIN_AWK$HOOK_AWK" "$ROOT/$rel")
~~~~

## Edit 6

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# closed, because a filter the parser cannot read would otherwise pass unchecked.
WORKFLOW_AWK='
~~~~

NEW:

~~~~text
# closed, because a filter the parser cannot read would otherwise pass unchecked. A
# filter's entries form its group, and echo or printf text is a message, not an input.
WORKFLOW_AWK='
~~~~

## Edit 7

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      if (val ~ /^\.(opencode|skilled)\//) emit("filter", val)
~~~~

NEW:

~~~~text
      if (val ~ /^\.(opencode|skilled)\//) record(val, pgrp)
~~~~

## Edit 8

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (raw ~ /^[ ]*(paths|paths-ignore):[ ]*$/) { inpaths = 1; pind = ind; next }
~~~~

NEW:

~~~~text
  if (raw ~ /^[ ]*(paths|paths-ignore):[ ]*$/) { inpaths = 1; pind = ind; pgrp = FNR; next }
~~~~

## Edit 9

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
        if (item ~ /^\.(opencode|skilled)\//) emit("filter", item)
~~~~

NEW:

~~~~text
        if (item ~ /^\.(opencode|skilled)\//) record(item, FNR)
~~~~

## Edit 10

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (raw ~ /^[ ]*-?[ ]*name:/) next
~~~~

NEW:

~~~~text
  if (raw ~ /^[ ]*-?[ ]*name:/) next
  if (raw ~ /^[ ]*(-[ ]+)?(run:[ ]+)?(echo|printf)[ ]/) next
~~~~

## Edit 11

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  local rel="$1" ln kind tok items=0 twin mentions
  while IFS=$'\t' read -r ln kind tok; do
    [[ -n "$ln" ]] || continue
    items=$((items + 1))
    case "$kind" in
      filter)
        twin="$(swap_root "$tok")"
        if grep -qF -- "$twin" "$ROOT/$rel"; then TWINS=$((TWINS + 1))
        else fail filter-twins "$rel:$ln" "path filter $tok has no twin $twin"; fi ;;
      run)
        tok="${tok%.}"
        case "$tok" in
          *node_modules*|*/dist/*|*/dist) DYNAMIC=$((DYNAMIC + 1)) ;;
~~~~

NEW:

~~~~text
  local rel="$1" ln kind tok items=0 twin owner mentions
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
    items=$((items + 1))
    case "$kind" in
      twin-ok) TWINS=$((TWINS + 1)) ;;
      twin-one) fail filter-twins "$rel:$ln" "path filter $tok has no twin $twin" ;;
      run)
        tok="${tok%.}"
        case "$tok" in
          *node_modules*|*/dist/*|*/dist)
            # A checkout holds no installed or built output, so only the directory that
            # installs or builds this path can be checked, and it must exist.
            owner="${tok%%/node_modules*}"; owner="${owner%%/dist/*}"; owner="${owner%/dist}"
            if [[ -d "$ROOT/$owner" ]]; then DYNAMIC=$((DYNAMIC + 1))
            else fail workflow-inputs "$rel:$ln" "$tok is generated under $owner, which resolves nowhere"; fi ;;
~~~~

## Edit 12

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  done < <(awk "$WORKFLOW_AWK" "$ROOT/$rel")
~~~~

NEW:

~~~~text
  done < <(awk "$TWIN_AWK$WORKFLOW_AWK" "$ROOT/$rel")
~~~~

## Edit 13

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
scan_dependabot() { # scan_dependabot <relpath>
  local rel="$1" ln tok items=0 twin mentions
  while IFS=$'\t' read -r ln tok; do
    [[ -n "$ln" ]] || continue
    items=$((items + 1))
    twin="$(swap_root "$tok")"
    if grep -qF -- "\"$twin\"" "$ROOT/$rel" || grep -qF -- "'$twin'" "$ROOT/$rel"; then TWINS=$((TWINS + 1))
    else fail filter-twins "$rel:$ln" "directory $tok has no twin $twin"; fi
  done < <(awk '$0 !~ /^[[:space:]]*#/ { line = $0; while (match(line, /["\047]\/\.(opencode|skilled)\/[^"\047]*["\047]/)) { print FNR "\t" substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH) } }' "$ROOT/$rel")
~~~~

NEW:

~~~~text
# Dependabot directories, grouped by the update entry that lists them. An entry opens
# at a list item that starts with a key.
DEPENDABOT_AWK='
{
  if ($0 ~ /^[[:space:]]*#/) next
  if ($0 ~ /^[[:space:]]*-[[:space:]]+[A-Za-z_-]+:/) entry = FNR
  line = $0
  while (match(line, /["\047]\/\.(opencode|skilled)\/[^"\047]*["\047]/)) {
    record(substr(line, RSTART + 1, RLENGTH - 2), entry); line = substr(line, RSTART + RLENGTH)
  }
}'

scan_dependabot() { # scan_dependabot <relpath>
  local rel="$1" ln kind tok items=0 twin mentions
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
    items=$((items + 1))
    if [[ "$kind" == "twin-ok" ]]; then TWINS=$((TWINS + 1))
    else fail filter-twins "$rel:$ln" "directory $tok has no twin $twin"; fi
  done < <(awk "$TWIN_AWK$DEPENDABOT_AWK" "$ROOT/$rel")
~~~~
