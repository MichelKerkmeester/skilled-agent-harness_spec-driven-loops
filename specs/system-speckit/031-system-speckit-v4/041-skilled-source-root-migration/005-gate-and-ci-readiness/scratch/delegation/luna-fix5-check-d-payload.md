# Edits for unit luna-fix5-check-d

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    }
    if (part ~ /(^|[^A-Za-z0-9_.-])git[[:space:]]/) spec = 1
    varpaths(part, grp, spec)
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    rest = part
    while (match(rest, /\047\.(opencode|skilled)(\/[^\047]*)?\047/)) {
      record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
    }
    if (spec) {
      rest = part; sub(/.*[[:space:]]--([[:space:]]|$)/, "", rest); gsub(/\047[^\047]*\047/, "", rest); roots(rest, grp)
    } else {
      rest = part
      while (match(rest, /"\.(opencode|skilled)\/[^"]*"/)) {
~~~~

NEW:

~~~~text
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
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
WORKFLOW_AWK='
function emit(kind, tok) { hits++; print FNR "\t" kind "\t" tok }
function unread(part) { if (part ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
~~~~

NEW:

~~~~text
WORKFLOW_AWK='
function emit(kind, tok) { hits++; print FNR "\t" kind "\t" tok }
function finish() { return }
function unread(part) { if (part ~ /\.(opencode|skilled)/ && !hits) emit("miss", "segment") }
{
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    }
    line = part
    while (match(line, /(^|[^A-Za-z0-9_])\.opencode\/[A-Za-z0-9._*\/-]*/)) {
      tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != ".") tok = substr(tok, 2)
      emit("run", tok); line = substr(line, RSTART + RLENGTH)
    }
    line = part
~~~~

NEW:

~~~~text
    }
    line = part
    while (match(line, /(^|[^A-Za-z0-9_])\.opencode\/[][A-Za-z0-9._*?\/-]*/)) {
      tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != ".") tok = substr(tok, 2)
      line = substr(line, RSTART + RLENGTH)
      if (line ~ /^(\$|\{)/) emit("bare", tok)
      else emit("run", tok)
    }
    line = part
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
            if [[ -d "$ROOT/$owner" ]]; then DYNAMIC=$((DYNAMIC + 1))
            else fail workflow-inputs "$rel:$ln" "$tok is generated under $owner, which resolves nowhere"; fi ;;
          *\**)
            if compgen -G "$ROOT/$tok" >/dev/null; then RESOLVED=$((RESOLVED + 1))
            else fail workflow-inputs "$rel:$ln" "$tok matches nothing"; fi ;;
~~~~

NEW:

~~~~text
            if [[ -d "$ROOT/$owner" ]]; then DYNAMIC=$((DYNAMIC + 1))
            else fail workflow-inputs "$rel:$ln" "$tok is generated under $owner, which resolves nowhere"; fi ;;
          *\**|*\?*|*\[*)
            if compgen -G "$ROOT/$tok" >/dev/null; then RESOLVED=$((RESOLVED + 1))
            else fail workflow-inputs "$rel:$ln" "$tok matches nothing"; fi ;;
~~~~

## Edit 5

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text

# Dependabot directories, quoted or plain, grouped by the update entry that lists them.
# An entry opens at a list item that starts with a key.
DEPENDABOT_AWK='
{
  if ($0 ~ /^[[:space:]]*#/) next
  code = ($0 ~ /#/) ? uncomment($0) : $0
  if (code ~ /^[[:space:]]*-[[:space:]]+[A-Za-z_-]+:/) entry = FNR
  hits = 0; line = code
  while (match(line, /(^|[[:space:],"\047])\/\.(opencode|skilled)(\/[A-Za-z0-9._*\/-]*)?/)) {
~~~~

NEW:

~~~~text

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
~~~~
