# Edits for unit luna-fix4-check-a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
#   gate-files       every hook, hook library, the legacy helper and the SessionStart
#                    check exists under .opencode/ or .skilled/
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> a hook command uses, and
#                    every variable assigned a literal .opencode/<path>, resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
~~~~

NEW:

~~~~text
#   gate-files       every hook, hook library, the legacy helper and the SessionStart
#                    check exists under .opencode/ or .skilled/
#   hook-inputs      every literal $REPO_ROOT/.opencode/<path> a hook command uses, every
#                    variable assigned a literal .opencode/<path> and every quoted literal
#                    .opencode/<path> handed to a command other than git resolves
#   workflow-inputs  every literal .opencode/<path> a workflow runs resolves, a glob
#                    matches something, and the directory that installs or builds a
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# Line helpers shared by the parsers. A comment starts at a # that follows whitespace
# outside quotes, and a command splits at ;, |, && and || outside quotes, so neither a
# trailing comment nor a second command can lend a twin to the first. Quote state does
# not carry across lines, and escaped quotes are not tracked.
LEX_AWK='
function uncomment(s,    i, n, c, q, prev, t) {
~~~~

NEW:

~~~~text
# Line helpers shared by the parsers. A comment starts at a # that follows whitespace
# outside quotes, and a command splits at ;, |, && and || outside quotes, so neither a
# trailing comment nor a second command can lend a twin to the first. A $( ... )
# substitution is a command of its own, even inside double quotes, so a git call nested
# in another command's arguments speaks only for its own. Quote state does not carry
# across lines, and escaped quotes are not tracked.
LEX_AWK='
function uncomment(s,    i, n, c, q, prev, t) {
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  return s
}
function segments(s, out,    i, n, c, nxt, q, k, cur) {
  n = length(s); k = 1; cur = ""; q = ""
  for (i = 1; i <= n; i++) {
    c = substr(s, i, 1); nxt = substr(s, i + 1, 1)
    if (q != "") { if (c == q) q = ""; cur = cur c; continue }
    if (c == "\047" || c == "\"") { q = c; cur = cur c; continue }
~~~~

NEW:

~~~~text
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
~~~~
