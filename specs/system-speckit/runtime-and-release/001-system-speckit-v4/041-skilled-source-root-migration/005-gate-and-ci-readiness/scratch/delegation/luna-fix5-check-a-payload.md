# Edits for unit luna-fix5-check-a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
#                    .opencode/<path> handed to a command other than git resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
#                    node_modules or dist path exists. Echo and printf text runs nothing
#   filter-twins     every workflow path filter, negated or not, dependabot directory,
#                    hook pathspec and regex that names one root also names the other,
~~~~

NEW:

~~~~text
#                    .opencode/<path> handed to a command other than git resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    with *, ? or brackets matches something, and the directory that
#                    installs or builds a node_modules or dist path exists. A path that
#                    continues into a variable is dynamic, and echo and printf text runs
#                    nothing
#   filter-twins     every workflow path filter, negated or not, dependabot directory,
#                    hook pathspec and regex that names one root also names the other,
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# group: matched anywhere in the file, a comment, a message or another event's filter
# could stand in for a twin the rule itself lacks. Every record and emitted item counts
# as a hit, which is how a parser tells a read segment from an unread one.
TWIN_AWK='
function record(tok, grp) { hits++; nrec++; rline[nrec] = FNR; rtok[nrec] = tok; rgrp[nrec] = grp; have[grp, tok] = 1 }
function twin(tok) {
  if (tok ~ /^!?\/?\.opencode(\/|$)/) sub(/\.opencode/, ".skilled", tok)
~~~~

NEW:

~~~~text
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
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
}
END {
  for (i = 1; i <= nrec; i++) {
    tw = twin(rtok[i])
~~~~

NEW:

~~~~text
}
END {
  finish()
  for (i = 1; i <= nrec; i++) {
    tw = twin(rtok[i])
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# Regex groups such as (opencode|claude) and escaped single-root literals such as
# \.opencode/, which match one root however the rest of the pattern reads. A trailing
# comment is dropped first, as the parsers drop it.
REGEX_AWK='
{
~~~~

NEW:

~~~~text
# Regex groups such as (opencode|claude) and escaped single-root literals such as
# \.opencode/, which match one root however the rest of the pattern reads. A trailing
# comment is dropped first, as the parsers drop it, and each command segment is judged
# on its own, so a second command's regex cannot supply the other root.
REGEX_AWK='
{
~~~~

## Edit 5

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if ($0 ~ /^[[:space:]]*#/) next
  code = ($0 ~ /#/) ? uncomment($0) : $0
  line = code
  while (match(line, /\([^()]*\)/)) {
    group = substr(line, RSTART + 1, RLENGTH - 2); line = substr(line, RSTART + RLENGTH)
    n = split(group, alts, "|"); has_o = 0; has_s = 0
    for (i = 1; i <= n; i++) { if (alts[i] == "opencode") has_o = 1; if (alts[i] == "skilled") has_s = 1 }
    if (has_o || has_s) print FNR "\t" (has_o && has_s ? "group-ok" : "group-one") "\t(" group ")"
  }
  if (code ~ /\\\.opencode\// && code !~ /\\\.skilled\//) print FNR "\tliteral-one\t\\.opencode/"
  if (code ~ /\\\.skilled\// && code !~ /\\\.opencode\//) print FNR "\tliteral-one\t\\.skilled/"
}'

~~~~

NEW:

~~~~text
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

~~~~
