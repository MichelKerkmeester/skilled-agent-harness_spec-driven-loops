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
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> a hook command uses, every
#                    variable assigned a literal .opencode/<path> and every quoted literal
#                    .opencode/<path> handed to a command other than git resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    with *, ? or brackets matches something, and the directory that
#                    installs or builds a node_modules or dist path exists. A path that
#                    continues into a variable is dynamic, and echo and printf text runs
#                    nothing
#   filter-twins     every workflow path filter, negated or not, dependabot directory,
#                    hook pathspec and regex that names one root also names the other,
#                    within the same filter, update entry, array or command
#   parser-miss      every command, array entry, filter or directory that names a root
#                    outside a comment is read by one of these rules or recognized as a
#                    message, a label or a path read through the link, so a shape the
#                    parsers do not know fails
#
# The check reads roots written out as .opencode or .skilled. A root spelled in pieces,
# such as a regex that puts syntax between the dot and the name or a variable that
# holds the name, is beyond what text can read. The hook test scripts stage .skilled
# paths through each gate and cover that behavior instead.
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

# Line helpers shared by the parsers. A comment starts at a # that follows whitespace
# outside quotes, and a command splits at ;, |, && and || outside quotes, so neither a
# trailing comment nor a second command can lend a twin to the first. A $( ... )
# substitution is a command of its own, even inside double quotes, so a git call nested
# in another command's arguments speaks only for its own. Quote state does not carry
# across lines, and escaped quotes are not tracked.
LEX_AWK='
function uncomment(s,    i, n, c, q, prev, t) {
  n = length(s); q = ""; prev = " "
  for (i = 1; i <= n; i++) {
    c = substr(s, i, 1)
    if (q != "") { if (c == q) q = "" }
    else if (c == "\047" || c == "\"") q = c
    else if (c == "#" && prev ~ /[[:space:]]/) { t = substr(s, 1, i - 1); sub(/[[:space:]]+$/, "", t); return t }
    prev = c
  }
  return s
}
function segments(s, out,    i, n, c, nxt, q, k, cur, depth, saved) {
  n = length(s); k = 1; cur = ""; q = ""; depth = 0
  for (i = 1; i <= n; i++) {
    c = substr(s, i, 1); nxt = substr(s, i + 1, 1)
    if (q == "\047") { if (c == q) q = ""; cur = cur c; continue }
    if (c == "$" && nxt == "(") { saved[++depth] = q; q = ""; out[k++] = cur; cur = ""; i++; continue }
    if (c == ")" && depth > 0 && q == "") { q = saved[depth--]; out[k++] = cur; cur = ""; continue }
    if (q != "") { if (c == q) q = ""; cur = cur c; continue }
    if (c == "\047" || c == "\"") { q = c; cur = cur c; continue }
    if (c == ";" || c == "|" || (c == "&" && nxt == "&")) {
      out[k++] = cur; cur = ""
      if (nxt == c) i++
      continue
    }
    cur = cur c
  }
  out[k] = cur
  return k
}'

# Twin matching shared by the hook, workflow and dependabot parsers. A parser records
# each root-naming entry with the group it belongs to, and the twin must sit in that
# group: matched anywhere in the file, a comment, a message or another event's filter
# could stand in for a twin the rule itself lacks. Every record and emitted item counts
# as a hit, which is how a parser tells a read segment from an unread one. Each parser
# defines finish(), which runs before the verdicts, so a parser can record what only
# the whole file decides.
TWIN_AWK='
function record(tok, grp) { recordat(tok, grp, FNR) }
function recordat(tok, grp, line) { hits++; nrec++; rline[nrec] = line; rtok[nrec] = tok; rgrp[nrec] = grp; have[grp, tok] = 1 }
function twin(tok) {
  if (tok ~ /^!?\/?\.opencode(\/|$)/) sub(/\.opencode/, ".skilled", tok)
  else sub(/\.skilled/, ".opencode", tok)
  return tok
}
END {
  finish()
  for (i = 1; i <= nrec; i++) {
    tw = twin(rtok[i])
    print rline[i] "\t" (((rgrp[i], tw) in have) ? "twin-ok" : "twin-one") "\t" rtok[i] "\t" tw
  }
}'

# Runs a parser over one file and fails closed when awk itself fails, because a parser
# that never ran reads nothing and would otherwise report nothing wrong.
run_parser() { # run_parser <relpath> <awk program>; sets PARSED
  if ! PARSED="$(awk "$2" "$ROOT/$1")"; then
    fail parser-miss "$1" "could not be parsed"
    PARSED=""
  fi
}

# Regex groups such as (opencode|claude) and escaped single-root literals such as
# \.opencode/, which match one root however the rest of the pattern reads. A trailing
# comment is dropped first, as the parsers drop it, and each command segment is judged
# on its own, so a second command's regex cannot supply the other root.
REGEX_AWK='
{
  if ($0 ~ /^[[:space:]]*#/) next
  code = ($0 ~ /#/) ? uncomment($0) : $0
  n = (code ~ /[;|&]|\$\(/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    line = parts[p]
    while (match(line, /\([^()]*\)/)) {
      group = substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH)
      k = split(group, alts, "|"); has_o = 0; has_s = 0
      for (i = 1; i <= k; i++) { if (alts[i] == "opencode") has_o = 1; if (alts[i] == "skilled") has_s = 1 }
      if (has_o || has_s) print FNR "\t" (has_o && has_s ? "group-ok" : "group-one") "\t(" group ")"
    }
    if (parts[p] ~ /\\\.opencode\// && parts[p] !~ /\\\.skilled\//) print FNR "\tliteral-one\t\\.opencode/"
    if (parts[p] ~ /\\\.skilled\// && parts[p] !~ /\\\.opencode\//) print FNR "\tliteral-one\t\\.skilled/"
  }
}'

check_regex() { # check_regex <relpath>
  local rel="$1" ln kind text
  run_parser "$rel" "$LEX_AWK$REGEX_AWK"
  while IFS=$'\t' read -r ln kind text; do
    [[ -n "$ln" ]] || continue
    case "$kind" in
      group-ok) TWINS=$((TWINS + 1)) ;;
      *) fail filter-twins "$rel:$ln" "regex $text matches one source root" ;;
    esac
  done <<<"$PARSED"
}

# Script paths a hook builds from a variable, assigns or quotes as a literal, and
# pathspecs it hands to git, grouped by the array or by the command segment that holds
# them. git is recognized by its name at the end of any command path. In a git command,
# roots after -- are pathspecs, while before -- only a command with no -- at all has
# pathspecs, and an option value such as --format='.skilled/x' never is one. The root
# directory itself counts, with or without its trailing slash, written out or behind a
# variable. A variable path in an array is a script path to resolve, unless the file
# expands that array into a git command, which makes its entries pathspecs. A variable
# or glob after a literal root prefix makes the input dynamic rather than resolved. A
# command that follows an array's closing paren is read as a command, and a git command
# runs on over backslash continuation lines. Messages, a variable path to the root
# itself or to .skilled outside git, quoted arguments that hold a variable or a glob,
# and regexes are read as notes, and any other segment that names a root is a miss.
HOOK_AWK='
function emit(kind, tok) { hits++; print FNR "\t" kind "\t" tok }
function roots(text, grp,    tok, c) {
  while (match(text, /(^|[^A-Za-z0-9_}\/$.])\.(opencode|skilled)(\/[A-Za-z0-9._*\/$-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); c = substr(tok, 1, 1); text = substr(text, RSTART + RLENGTH)
    if (text ~ /^[A-Za-z0-9_]/) continue
    if (c != ".") tok = substr(tok, 2)
    record(tok, grp)
  }
}
function varpaths(text, grp, pathspec, array,    tok, var, path) {
  while (match(text, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)(\/[A-Za-z0-9._\/-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); text = substr(text, RSTART + RLENGTH)
    if (text ~ /^[A-Za-z0-9_]/) continue
    var = tok; sub(/\/\.(opencode|skilled).*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
    if (pathspec) record(path, grp)
    else if (array != "") { ncand++; cline[ncand] = FNR; cpath[ncand] = path; carr[ncand] = array; cgrp[ncand] = grp }
    if (path !~ /^\.opencode\/./) emit("note", "read")
    else if (text ~ /^(\$|\*|\?|\[|\{)/) emit("var", path)
    else emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
  }
}
function optvalues(text,    val) {
  while (match(text, /--?[A-Za-z0-9][A-Za-z0-9-]*=("[^"]*"|\047[^\047]*\047|[^[:space:]]*)/)) {
    val = substr(text, RSTART, RLENGTH); text = substr(text, 1, RSTART - 1) " " substr(text, RSTART + RLENGTH)
    if (val ~ /\.(opencode|skilled)/) emit("note", "option")
  }
  return text
}
function pathspecs(text, grp,    rest) {
  text = optvalues(text)
  varpaths(text, grp, 1, "")
  rest = text
  while (match(rest, /\047\.(opencode|skilled)(\/[^\047]*)?\047/)) {
    record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
  }
  rest = text; gsub(/\047[^\047]*\047/, "", rest); roots(rest, grp)
}
function options(text, grp) {
  text = optvalues(text)
  varpaths(text, grp, 0, "")
  if (text ~ /\.(opencode|skilled)/) emit("note", "option")
}
function arrays(text,    name) {
  while (match(text, /\$\{[A-Za-z_][A-Za-z0-9_]*\[[@*]\]\}/)) {
    name = substr(text, RSTART + 2, RLENGTH - 2); sub(/\[.*/, "", name); gitarr[name] = 1
    text = substr(text, RSTART + RLENGTH)
  }
}
function finish(    i) {
  for (i = 1; i <= ncand; i++) if (carr[i] in gitarr) recordat(cpath[i], cgrp[i], cline[i])
}
function closing(s,    i, n, c, q) {
  n = length(s); q = ""
  for (i = 1; i <= n; i++) {
    c = substr(s, i, 1)
    if (q != "") { if (c == q) q = ""; continue }
    if (c == "\047" || c == "\"") q = c
    else if (c == ")") return i
  }
  return 0
}
function unread(text) { if (text ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
  raw = $0
  if (raw ~ /^[[:space:]]*#/) next
  code = (raw ~ /#/) ? uncomment(raw) : raw
  if (!cont) { cmd = FNR; seg = 0; spec = 0; after = 0 }
  cont = (raw ~ /\\$/)
  if (!inarr && code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
    arrname = code; sub(/=\(.*/, "", arrname); sub(/.*[[:space:]]/, "", arrname)
    inarr = 1; arr = FNR; sub(/^[^(]*\(/, "", code)
  }
  if (inarr) {
    endp = closing(code)
    elements = endp ? substr(code, 1, endp - 1) : code
    hits = 0; varpaths(elements, "array" arr, 0, arrname); roots(elements, "array" arr); unread(elements)
    if (!endp) next
    inarr = 0; code = substr(code, endp + 1); cmd = FNR; seg = 0; spec = 0; after = 0
    if (code !~ /[^[:space:]]/) next
  }
  n = (code ~ /[;|&]|\$\(/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    if (p > 1) { seg++; spec = 0; after = 0 }
    part = parts[p]; grp = cmd ":" seg; hits = 0
    if (part ~ /^[[:space:]]*((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
      if (part ~ /\.(opencode|skilled)/) emit("note", "message")
      continue
    }
    if (part ~ /^[[:space:]]*((local|export|readonly|declare|typeset)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?[[:space:]]*$/) {
      path = part; sub(/^[^=]*="?/, "", path); sub(/"?[[:space:]]*$/, "", path); emit("repo", path)
      continue
    }
    if (part ~ /(^|[^A-Za-z0-9_.-])git[[:space:]]/) spec = 1
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    if (spec) {
      arrays(part)
      if (!after && match(part, /[[:space:]]--([[:space:]]|$)/)) {
        head = substr(part, 1, RSTART); tail = substr(part, RSTART + RLENGTH); after = 1
        options(head, grp); pathspecs(tail, grp)
      } else {
        pathspecs(part, grp)
      }
    } else {
      varpaths(part, grp, 0, "")
      rest = part
      while (match(rest, /\047\.(opencode|skilled)(\/[^\047]*)?\047/)) {
        record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
      }
      rest = part
      while (match(rest, /"\.(opencode|skilled)\/[^"]*"/)) {
        lit = substr(rest, RSTART + 1, RLENGTH - 2); rest = substr(rest, RSTART + RLENGTH)
        if (lit ~ /^\.opencode\/[A-Za-z0-9._\/-]+$/) emit("repo", lit)
        else emit("note", "argument")
      }
    }
    unread(part)
  }
}'

scan_hook() { # scan_hook <relpath>
  local rel="$1" ln kind tok twin
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$HOOK_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
    case "$kind" in
      repo)
        if [[ -e "$ROOT/$tok" ]]; then RESOLVED=$((RESOLVED + 1))
        else fail hook-inputs "$rel:$ln" "\$REPO_ROOT/$tok resolves nowhere"; fi ;;
      var) DYNAMIC=$((DYNAMIC + 1)) ;;
      twin-ok) TWINS=$((TWINS + 1)) ;;
      twin-one) fail filter-twins "$rel:$ln" "pathspec $tok has no twin $twin" ;;
      miss) fail parser-miss "$rel:$ln" "names a source root that no rule reads" ;;
    esac
  done <<<"$PARSED"
  check_regex "$rel"
}

# Workflow tokens: path filters, executable paths, and bare root mentions such as
# `npm --prefix .opencode`, which carry no path to resolve. A path filter may list its
# entries below the key at any indent or inline on one line, negated or not, and any
# other shape fails closed, because a filter the parser cannot read would otherwise pass
# unchecked. A filter's entries form its group. A quoted run scalar is unwrapped to its
# shell text, and an echo or printf command in it is a message, while the commands
# beside it are still read.
WORKFLOW_AWK='
function emit(kind, tok) { hits++; print FNR "\t" kind "\t" tok }
function finish() { return }
function unread(part) { if (part ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
  raw = $0
  if (raw ~ /^[[:space:]]*#/) next
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
    inpaths = 0
  }
  if (code ~ /^[ ]*(paths|paths-ignore):[ ]*$/) { inpaths = 1; pind = ind; pgrp = FNR; next }
  if (code ~ /^[ ]*(paths|paths-ignore):/) {
    val = code; sub(/^[ ]*(paths|paths-ignore):[ ]*/, "", val)
    if (val ~ /^\[.*\]$/) {
      gsub(/^\[|\]$/, "", val); n = split(val, items, ",")
      for (i = 1; i <= n; i++) {
        item = items[i]; gsub(/[\047" ]/, "", item)
        if (item ~ /^!?\.(opencode|skilled)\//) record(item, FNR)
        else if (item ~ /\.(opencode|skilled)/) emit("miss", "filter")
      }
    } else {
      emit("shape", val)
    }
    next
  }
  if (code ~ /^[ ]*-?[ ]*name:/) { if (code ~ /\.(opencode|skilled)/) emit("note", "label"); next }
  if (code ~ /^[ ]*(-[ ]+)?run:[ ]+"/) { sub(/run:[ ]+"/, "run: ", code); sub(/"$/, "", code); gsub(/\\"/, "\"", code) }
  else if (code ~ /^[ ]*(-[ ]+)?run:[ ]+\047/) { sub(/run:[ ]+\047/, "run: ", code); sub(/\047$/, "", code); gsub(/\047\047/, "\047", code) }
  n = (code ~ /[;|&]|\$\(/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    part = parts[p]; hits = 0
    if (part ~ /^[[:space:]]*(-[[:space:]]+)?(run:[[:space:]]+)?((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
      if (part ~ /\.(opencode|skilled)/) emit("note", "message")
      continue
    }
    line = part
    while (match(line, /(^|[^A-Za-z0-9_])\.(opencode|skilled)\/[][A-Za-z0-9._*?\/-]*/)) {
      tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != ".") tok = substr(tok, 2)
      line = substr(line, RSTART + RLENGTH)
      if (line ~ /^(\$|\{)/) emit("bare", tok)
      else emit("run", tok)
    }
    line = part
    while (match(line, /(^|[^A-Za-z0-9_\/.])\.(opencode|skilled)([^\/A-Za-z0-9_]|$)/)) {
      tok = substr(line, RSTART, RLENGTH)
      sub(/^[^.]*/, "", tok); sub(/[^A-Za-z0-9_].*$/, "", tok)
      emit("bare", tok); line = substr(line, RSTART + RLENGTH)
    }
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    unread(part)
  }
}'

scan_workflow() { # scan_workflow <relpath>
  local rel="$1" ln kind tok twin owner
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$WORKFLOW_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
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
          *\**|*\?*|*\[*)
            if compgen -G "$ROOT/$tok" >/dev/null; then RESOLVED=$((RESOLVED + 1))
            else fail workflow-inputs "$rel:$ln" "$tok matches nothing"; fi ;;
          *)
            if [[ -e "$ROOT/$tok" ]]; then RESOLVED=$((RESOLVED + 1))
            else fail workflow-inputs "$rel:$ln" "$tok resolves nowhere"; fi ;;
        esac ;;
      bare) DYNAMIC=$((DYNAMIC + 1)) ;;
      shape) fail parser-miss "$rel:$ln" "path filter shape not recognized: $tok" ;;
      miss) fail parser-miss "$rel:$ln" "names a source root that no rule reads" ;;
    esac
  done <<<"$PARSED"
  check_regex "$rel"
}

# Dependabot directories, quoted or plain, grouped by the update entry that lists them.
# An entry opens at a list item that starts with a key or a flow-style mapping.
DEPENDABOT_AWK='
function finish() { return }
{
  if ($0 ~ /^[[:space:]]*#/) next
  code = ($0 ~ /#/) ? uncomment($0) : $0
  if (code ~ /^[[:space:]]*-[[:space:]]+(\{|[A-Za-z_-]+:)/) entry = FNR
  hits = 0; line = code
  while (match(line, /(^|[[:space:],"\047])\/\.(opencode|skilled)(\/[A-Za-z0-9._*\/-]*)?/)) {
    tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != "/") tok = substr(tok, 2)
    record(tok, entry); line = substr(line, RSTART + RLENGTH)
  }
  if (code ~ /\.(opencode|skilled)/ && !hits) print FNR "\tmiss\tdirectory"
}'

scan_dependabot() { # scan_dependabot <relpath>
  local rel="$1" ln kind tok twin
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$DEPENDABOT_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
    case "$kind" in
      twin-ok) TWINS=$((TWINS + 1)) ;;
      twin-one) fail filter-twins "$rel:$ln" "directory $tok has no twin $twin" ;;
      miss) fail parser-miss "$rel:$ln" "names a source root that no rule reads" ;;
    esac
  done <<<"$PARSED"
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
