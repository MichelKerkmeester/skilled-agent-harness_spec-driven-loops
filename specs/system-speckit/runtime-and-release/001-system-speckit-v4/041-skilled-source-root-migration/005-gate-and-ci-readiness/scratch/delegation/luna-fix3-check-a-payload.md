# Edits for unit luna-fix3-check-a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
#   gate-files       every hook, hook library, the legacy helper and the SessionStart
#                    check exists under .opencode/ or .skilled/
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> in those files, and every
#                    variable assigned a literal .opencode/<path>, resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
#                    node_modules or dist path exists. Echo and printf text runs nothing
#   filter-twins     every workflow path filter, dependabot directory, hook pathspec
#                    and regex that names one root also names the other, within the
#                    same filter, update entry, array or command
#   parser-miss      every line that names a root outside a comment is read by one of
#                    these rules or recognized as a message, a label or a path read
#                    through the link, so a shape the parsers do not know fails
#
# Usage: bash .github/scripts/check-gate-inputs.sh [repo-root]
~~~~

NEW:

~~~~text
#   gate-files       every hook, hook library, the legacy helper and the SessionStart
#                    check exists under .opencode/ or .skilled/
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> a hook command uses, and
#                    every variable assigned a literal .opencode/<path>, resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
#                    node_modules or dist path exists. Echo and printf text runs nothing
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
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# each root-naming entry with the group it belongs to, and the twin must sit in that
# group: matched anywhere in the file, a comment, a message or another event's filter
# could stand in for a twin the rule itself lacks.
TWIN_AWK='
function record(tok, grp) { nrec++; rline[nrec] = FNR; rtok[nrec] = tok; rgrp[nrec] = grp; have[grp, tok] = 1 }
function twin(tok) {
  if (tok ~ /^\/?\.opencode(\/|$)/) sub(/\.opencode/, ".skilled", tok)
  else sub(/\.skilled/, ".opencode", tok)
  return tok
~~~~

NEW:

~~~~text
# each root-naming entry with the group it belongs to, and the twin must sit in that
# group: matched anywhere in the file, a comment, a message or another event's filter
# could stand in for a twin the rule itself lacks. Every record and emitted item counts
# as a hit, which is how a parser tells a read segment from an unread one.
TWIN_AWK='
function record(tok, grp) { hits++; nrec++; rline[nrec] = FNR; rtok[nrec] = tok; rgrp[nrec] = grp; have[grp, tok] = 1 }
function twin(tok) {
  if (tok ~ /^!?\/?\.opencode(\/|$)/) sub(/\.opencode/, ".skilled", tok)
  else sub(/\.skilled/, ".opencode", tok)
  return tok
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
}'

# A root-naming line that no rule read fails, so a shape the parsers do not know
# cannot pass as a file that simply holds no gate input.
unread_lines() { # unread_lines <relpath> <line numbers the parsers read>
  local rel="$1" read="$2" ln text
  while IFS=: read -r ln text; do
    grep -qxF -- "$ln" <<<"$read" || fail parser-miss "$rel:$ln" "names a source root that no rule reads"
  done < <(grep -nE '\.(opencode|skilled)' "$ROOT/$rel" 2>/dev/null | grep -vE '^[0-9]+:[[:space:]]*#')
}

# Regex groups such as (opencode|claude) and escaped single-root literals such as
# \.opencode/, which match one root however the rest of the pattern reads.
REGEX_AWK='
{
  if ($0 ~ /^[[:space:]]*#/) next
  line = $0
  while (match(line, /\([^()]*\)/)) {
    group = substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH)
~~~~

NEW:

~~~~text
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
# comment is dropped first, as the parsers drop it.
REGEX_AWK='
{
  if ($0 ~ /^[[:space:]]*#/) next
  code = ($0 ~ /#/) ? uncomment($0) : $0
  line = code
  while (match(line, /\([^()]*\)/)) {
    group = substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH)
~~~~
