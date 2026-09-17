# Edits for unit luna-fix5-check-b

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
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
~~~~

NEW:

~~~~text
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
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  }
}
function varpaths(text, grp, pathspec,    tok, var, path) {
  while (match(text, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)(\/[A-Za-z0-9._\/-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); text = substr(text, RSTART + RLENGTH)
~~~~

NEW:

~~~~text
  }
}
function varpaths(text, grp, pathspec, array,    tok, var, path) {
  while (match(text, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)(\/[A-Za-z0-9._\/-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); text = substr(text, RSTART + RLENGTH)
~~~~
