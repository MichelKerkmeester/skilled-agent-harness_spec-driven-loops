# Edits for unit luna-fix3-check-b

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    if (has_o || has_s) print FNR "\t" (has_o && has_s ? "group-ok" : "group-one") "\t(" group ")"
  }
  if ($0 ~ /\\\.opencode\// && $0 !~ /\\\.skilled\//) print FNR "\tliteral-one\t\\.opencode/"
  if ($0 ~ /\\\.skilled\// && $0 !~ /\\\.opencode\//) print FNR "\tliteral-one\t\\.skilled/"
}'

check_regex() { # check_regex <relpath>; sets REGEX_LINES to the lines that held a regex item
  local rel="$1" ln kind text out
  out="$(awk "$REGEX_AWK" "$ROOT/$rel")"
  while IFS=$'\t' read -r ln kind text; do
    [[ -n "$ln" ]] || continue
~~~~

NEW:

~~~~text
    if (has_o || has_s) print FNR "\t" (has_o && has_s ? "group-ok" : "group-one") "\t(" group ")"
  }
  if (code ~ /\\\.opencode\// && code !~ /\\\.skilled\//) print FNR "\tliteral-one\t\\.opencode/"
  if (code ~ /\\\.skilled\// && code !~ /\\\.opencode\//) print FNR "\tliteral-one\t\\.skilled/"
}'

check_regex() { # check_regex <relpath>
  local rel="$1" ln kind text
  run_parser "$rel" "$LEX_AWK$REGEX_AWK"
  while IFS=$'\t' read -r ln kind text; do
    [[ -n "$ln" ]] || continue
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      *) fail filter-twins "$rel:$ln" "regex $text matches one source root" ;;
    esac
  done <<<"$out"
  REGEX_LINES="$(printf '%s\n' "$out" | cut -f1)"
}

~~~~

NEW:

~~~~text
      *) fail filter-twins "$rel:$ln" "regex $text matches one source root" ;;
    esac
  done <<<"$PARSED"
}

~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
# Script paths a hook builds from a variable or assigns as a literal, and pathspecs it
# hands to git, grouped by the array or by the command segment that holds them. A root
# path in a git command is a pathspec with or without --, and a git command runs on
# over backslash continuation lines. Messages, a variable path to the root itself or
# to .skilled, and quoted arguments to other commands are read as notes: they resolve
# through the link, and they are not gate inputs.
HOOK_AWK='
function emit(kind, tok) { print FNR "\t" kind "\t" tok }
function roots(text, grp,    tok, c) {
  while (match(text, /(^|[^A-Za-z0-9_}\/$.])\.(opencode|skilled)\/[A-Za-z0-9._*\/$-]*/)) {
~~~~

NEW:

~~~~text
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
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  }
}
{
  raw = $0
~~~~

NEW:

~~~~text
  }
}
function varpaths(text, grp, pathspec,    tok, var, path) {
  while (match(text, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(opencode|skilled)(\/[A-Za-z0-9._\/-]*)?/)) {
    tok = substr(text, RSTART, RLENGTH); text = substr(text, RSTART + RLENGTH)
    var = tok; sub(/\/\.(opencode|skilled).*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
    if (pathspec && path ~ /\/./) record(path, grp)
    if (path ~ /^\.opencode\/./) emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
    else emit("note", "read")
  }
}
function unread(part) { if (part ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
  raw = $0
~~~~

## Edit 5

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (!cont) { cmd = FNR; seg = 0; spec = 0 }
  cont = (raw ~ /\\$/)
  line = code
  while (match(line, /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.opencode\/[A-Za-z0-9._\/-]*/)) {
    tok = substr(line, RSTART, RLENGTH); line = substr(line, RSTART + RLENGTH)
    var = tok; sub(/\/\.opencode\/.*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
    emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
  }
  if (code ~ /\$[{]?[A-Za-z_][A-Za-z0-9_]*[}]?\/\.(skilled\/|opencode([^\/]|$))/) emit("note", "read")
  if (code ~ /^[[:space:]]*((local|export|readonly)[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?[[:space:]]*$/) {
    path = code; sub(/^[^=]*="?/, "", path); sub(/"?[[:space:]]*$/, "", path); emit("repo", path)
  }
  if (inarr) {
    if (code ~ /^[[:space:]]*\)/) { inarr = 0; next }
    roots(code, "array" arr); next
  }
  if (code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
~~~~

NEW:

~~~~text
  if (!cont) { cmd = FNR; seg = 0; spec = 0 }
  cont = (raw ~ /\\$/)
  if (inarr) {
    if (code ~ /^[[:space:]]*\)/) { inarr = 0; next }
    hits = 0; varpaths(code, "array" arr, 0); roots(code, "array" arr); unread(code); next
  }
  if (code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
~~~~

## Edit 6

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    if (code ~ /\)[[:space:]]*$/) {
      inner = code; sub(/^[^(]*\(/, "", inner); sub(/\)[[:space:]]*$/, "", inner)
      roots(inner, "array" FNR); next
    }
  }
~~~~

NEW:

~~~~text
    if (code ~ /\)[[:space:]]*$/) {
      inner = code; sub(/^[^(]*\(/, "", inner); sub(/\)[[:space:]]*$/, "", inner)
      hits = 0; varpaths(inner, "array" FNR, 0); roots(inner, "array" FNR); unread(code); next
    }
  }
~~~~

## Edit 7

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  for (p = 1; p <= n; p++) {
    if (p > 1) { seg++; spec = 0 }
    part = parts[p]; grp = cmd ":" seg
    if (part ~ /^[[:space:]]*((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
      if (part ~ /\.(opencode|skilled)/) emit("note", "message")
~~~~

NEW:

~~~~text
  for (p = 1; p <= n; p++) {
    if (p > 1) { seg++; spec = 0 }
    part = parts[p]; grp = cmd ":" seg; hits = 0
    if (part ~ /^[[:space:]]*((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
      if (part ~ /\.(opencode|skilled)/) emit("note", "message")
~~~~
