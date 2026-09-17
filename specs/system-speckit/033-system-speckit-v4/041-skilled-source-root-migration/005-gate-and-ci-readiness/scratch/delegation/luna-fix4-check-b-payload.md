# Edits for unit luna-fix4-check-b

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
}

# Script paths a hook builds from a variable or assigns as a literal, and pathspecs it
# hands to git, grouped by the array or by the command segment that holds them. A root
# path in a git command is a pathspec with or without --, written out or behind a
# variable, while a variable path in an array is a script path to resolve. A git
# command runs on over backslash continuation lines. Messages, a variable path to the
# root itself or to .skilled outside git, quoted arguments to other commands and
# regexes are read as notes, and any other segment that names a root is a miss.
HOOK_AWK='
function emit(kind, tok) { hits++; print FNR "\t" kind "\t" tok }
function roots(text, grp,    tok, c) {
  while (match(text, /(^|[^A-Za-z0-9_}\/$.])\.(opencode|skilled)\/[A-Za-z0-9._*\/$-]*/)) {
    tok = substr(text, RSTART, RLENGTH); c = substr(tok, 1, 1)
    if (c != ".") tok = substr(tok, 2)
    record(tok, grp); text = substr(text, RSTART + RLENGTH)
  }
}
~~~~

NEW:

~~~~text
}

# Script paths a hook builds from a variable, assigns or quotes as a literal, and
# pathspecs it hands to git, grouped by the array or by the command segment that holds
# them. git is recognized by its name at the end of any command path. A root path in a
# git command is a pathspec with or without --, written out or behind a variable, and
# the root directory itself counts, with or without its trailing slash. A variable path
# in an array is a script path to resolve, and a command that follows an array's closing
# paren on the same line is read as a command. A git command runs on over backslash
# continuation lines. Messages, a variable path to the root itself or to .skilled outside
# git, quoted arguments that hold a variable or a glob, and regexes are read as notes,
# and any other segment that names a root is a miss.
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
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  while (match(text, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)(\/[A-Za-z0-9._\/-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); text = substr(text, RSTART + RLENGTH)
    var = tok; sub(/\/\.(opencode|skilled).*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
    if (pathspec && path ~ /\/./) record(path, grp)
    if (path ~ /^\.opencode\/./) emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
    else emit("note", "read")
~~~~

NEW:

~~~~text
  while (match(text, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)(\/[A-Za-z0-9._\/-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); text = substr(text, RSTART + RLENGTH)
    if (text ~ /^[A-Za-z0-9_]/) continue
    var = tok; sub(/\/\.(opencode|skilled).*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
    if (pathspec) record(path, grp)
    if (path ~ /^\.opencode\/./) emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
    else emit("note", "read")
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  }
}
function unread(part) { if (part ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
  raw = $0
~~~~

NEW:

~~~~text
  }
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
~~~~
