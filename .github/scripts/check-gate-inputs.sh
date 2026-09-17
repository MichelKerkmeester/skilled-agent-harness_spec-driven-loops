#!/usr/bin/env bash
# Independent gate-input check.
#
# The git hooks and CI workflows find their scripts under the source root and match
# changes by path. When that tree moves, a gate that can no longer find its script,
# or whose filter still names only one root, passes without checking anything. This
# check lives outside the source tree, so a move can neither carry it along nor break
# its path, and it reads the gate files and workflows as text instead of trusting any
# of them to run.
#
# Rules:
#   gate-files       every hook, hook library, the legacy helper and the SessionStart
#                    check exists under .opencode/ or .skilled/
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> in those files, and every
#                    variable assigned a literal .opencode/<path>, resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
#                    node_modules or dist path exists; echo and printf text runs nothing
#   filter-twins     every workflow path filter, dependabot directory, hook pathspec
#                    and regex that names one root also names the other, within the
#                    same filter, update entry, array or command
#   parser-miss      a file that names a root outside comments yields at least one
#                    input, so a parser that stops matching cannot report a pass
#
# Usage: bash .github/scripts/check-gate-inputs.sh [repo-root]
# Exit:  0 passed, 1 a rule failed, 2 usage error

set -uo pipefail

ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
if [[ -z "$ROOT" || ! -d "$ROOT" ]]; then
  echo "usage: bash .github/scripts/check-gate-inputs.sh [repo-root]" >&2
  exit 2
fi
ROOT="$(cd "$ROOT" && pwd -P)"

GATE_FILES="scripts/git-hooks/pre-commit scripts/git-hooks/pre-push scripts/git-hooks/prepare-commit-msg
scripts/git-hooks/commit-msg scripts/git-hooks/post-commit scripts/git-hooks/post-merge
scripts/git-hooks/post-rewrite scripts/git-hooks/lib/autostash-orphan-guard.sh
scripts/git-hooks/lib/mass-deletion-guard.sh hooks/git/pre-commit bin/check-git-hooks.sh"

FILES=0; RESOLVED=0; DYNAMIC=0; TWINS=0; FAILS=0

fail() { # fail <rule> <location> <detail>
  printf 'FAIL %s: %s %s\n' "$1" "$2" "$3"
  FAILS=$((FAILS + 1))
}

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

root_mentions() { # root_mentions <file>: non-comment lines that name a source root
  grep -nE '\.(opencode|skilled)' "$1" 2>/dev/null | grep -cvE '^[0-9]+:[[:space:]]*#'
}

# Regex groups such as (opencode|claude) and escaped single-root literals such as
# \.opencode/, which match one root however the rest of the pattern reads.
REGEX_AWK='
{
  if ($0 ~ /^[[:space:]]*#/) next
  line = $0
  while (match(line, /\([^()]*\)/)) {
    group = substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH)
    n = split(group, alts, "|"); has_o = 0; has_s = 0
    for (i = 1; i <= n; i++) { if (alts[i] == "opencode") has_o = 1; if (alts[i] == "skilled") has_s = 1 }
    if (has_o || has_s) print FNR "\t" (has_o && has_s ? "group-ok" : "group-one") "\t(" group ")"
  }
  if ($0 ~ /\\\.opencode\// && $0 !~ /\\\.skilled\//) print FNR "\tliteral-one\t\\.opencode/"
  if ($0 ~ /\\\.skilled\// && $0 !~ /\\\.opencode\//) print FNR "\tliteral-one\t\\.skilled/"
}'

check_regex() { # check_regex <relpath>; prints the number of regex items found
  local rel="$1" ln kind text count=0
  while IFS=$'\t' read -r ln kind text; do
    [[ -n "$ln" ]] || continue
    count=$((count + 1))
    case "$kind" in
      group-ok) TWINS=$((TWINS + 1)) ;;
      *) fail filter-twins "$rel:$ln" "regex $text matches one source root" ;;
    esac
  done < <(awk "$REGEX_AWK" "$ROOT/$rel")
  REGEX_ITEMS=$count
}

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
  while (match(line, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.opencode\/[A-Za-z0-9._\/-]*/)) {
    tok = substr(line, RSTART, RLENGTH); line = substr(line, RSTART + RLENGTH)
    var = tok; sub(/\/\.opencode\/.*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
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

scan_hook() { # scan_hook <relpath>
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
  check_regex "$rel"; items=$((items + REGEX_ITEMS))
  mentions="$(root_mentions "$ROOT/$rel")"
  if [[ "$mentions" -gt 0 && "$items" -eq 0 ]]; then
    fail parser-miss "$rel" "names a source root on $mentions line(s) but yielded no input"
  fi
}

# Workflow tokens: path filters, executable paths, and bare root mentions such as
# `npm --prefix .opencode`, which carry no path to resolve. A path filter may list its
# entries below the key at any indent or inline on one line, and any other shape fails
# closed, because a filter the parser cannot read would otherwise pass unchecked. A
# filter's entries form its group, and echo or printf text is a message, not an input.
WORKFLOW_AWK='
function emit(kind, tok) { print FNR "\t" kind "\t" tok }
{
  raw = $0
  if (raw ~ /^[[:space:]]*#/) next
  match(raw, /^[ ]*/); ind = RLENGTH
  if (inpaths) {
    if (raw ~ /^[ ]*-[ ]/ && ind >= pind) {
      val = raw; sub(/^[ ]*-[ ]*/, "", val); gsub(/[\047"]/, "", val); sub(/[ ]+#.*$/, "", val)
      if (val ~ /^\.(opencode|skilled)\//) record(val, pgrp)
      next
    }
    inpaths = 0
  }
  if (raw ~ /^[ ]*(paths|paths-ignore):[ ]*$/) { inpaths = 1; pind = ind; pgrp = FNR; next }
  if (raw ~ /^[ ]*(paths|paths-ignore):/) {
    val = raw; sub(/^[ ]*(paths|paths-ignore):[ ]*/, "", val); sub(/[ ]+#.*$/, "", val)
    if (val ~ /^\[.*\]$/) {
      gsub(/^\[|\]$/, "", val); n = split(val, items, ",")
      for (i = 1; i <= n; i++) {
        item = items[i]; gsub(/[\047" ]/, "", item)
        if (item ~ /^\.(opencode|skilled)\//) record(item, FNR)
      }
    } else {
      emit("shape", val)
    }
    next
  }
  if (raw ~ /^[ ]*-?[ ]*name:/) next
  if (raw ~ /^[ ]*(-[ ]+)?(run:[ ]+)?(echo|printf)[ ]/) next
  line = raw
  while (match(line, /(^|[^A-Za-z0-9_])\.opencode\/[A-Za-z0-9._*\/-]*/)) {
    tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != ".") tok = substr(tok, 2)
    emit("run", tok); line = substr(line, RSTART + RLENGTH)
  }
  line = raw
  while (match(line, /(^|[^A-Za-z0-9_\/.])\.opencode([^\/A-Za-z0-9_]|$)/)) {
    emit("bare", ".opencode"); line = substr(line, RSTART + RLENGTH)
  }
}'

scan_workflow() { # scan_workflow <relpath>
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
          *\**)
            if compgen -G "$ROOT/$tok" >/dev/null; then RESOLVED=$((RESOLVED + 1))
            else fail workflow-inputs "$rel:$ln" "$tok matches nothing"; fi ;;
          *)
            if [[ -e "$ROOT/$tok" ]]; then RESOLVED=$((RESOLVED + 1))
            else fail workflow-inputs "$rel:$ln" "$tok resolves nowhere"; fi ;;
        esac ;;
      bare) DYNAMIC=$((DYNAMIC + 1)) ;;
      shape) fail parser-miss "$rel:$ln" "path filter shape not recognized: $tok" ;;
    esac
  done < <(awk "$TWIN_AWK$WORKFLOW_AWK" "$ROOT/$rel")
  check_regex "$rel"; items=$((items + REGEX_ITEMS))
  mentions="$(root_mentions "$ROOT/$rel")"
  if [[ "$mentions" -gt 0 && "$items" -eq 0 ]]; then
    fail parser-miss "$rel" "names a source root on $mentions line(s) but yielded no input"
  fi
}

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
  mentions="$(root_mentions "$ROOT/$rel")"
  if [[ "$mentions" -gt 0 && "$items" -eq 0 ]]; then
    fail parser-miss "$rel" "names a source root on $mentions line(s) but yielded no input"
  fi
}

for gate in $GATE_FILES; do
  if [[ -f "$ROOT/.opencode/$gate" ]]; then rel=".opencode/$gate"
  elif [[ -f "$ROOT/.skilled/$gate" ]]; then rel=".skilled/$gate"
  else fail gate-files ".opencode/$gate" "is missing under .opencode/ and .skilled/"; continue
  fi
  FILES=$((FILES + 1))
  scan_hook "$rel"
done

for wf in "$ROOT"/.github/workflows/*.yml "$ROOT"/.github/workflows/*.yaml; do
  [[ -f "$wf" ]] || continue
  FILES=$((FILES + 1))
  scan_workflow "${wf#"$ROOT"/}"
done

if [[ -f "$ROOT/.github/dependabot.yml" ]]; then
  FILES=$((FILES + 1))
  scan_dependabot ".github/dependabot.yml"
fi

echo "files=$FILES inputs_resolved=$RESOLVED dynamic_inputs=$DYNAMIC twin_pairs=$TWINS failures=$FAILS"
if [[ "$FILES" -eq 0 ]]; then
  echo "FAIL parser-miss: $ROOT scanned no gate file or workflow"
  FAILS=$((FAILS + 1))
fi
if [[ "$FAILS" -eq 0 ]]; then
  echo "RESULT: PASSED"
  exit 0
fi
echo "RESULT: FAILED"
exit 1
