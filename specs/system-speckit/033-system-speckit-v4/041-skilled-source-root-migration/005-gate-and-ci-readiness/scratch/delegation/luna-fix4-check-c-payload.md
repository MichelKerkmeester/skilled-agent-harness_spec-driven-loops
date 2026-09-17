# Edits for unit luna-fix4-check-c

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (!cont) { cmd = FNR; seg = 0; spec = 0 }
  cont = (raw ~ /\\$/)
  if (inarr) {
    if (code ~ /^[[:space:]]*\)/) { inarr = 0; next }
    hits = 0; varpaths(code, "array" arr, 0); roots(code, "array" arr); unread(code); next
  }
  if (code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
    if (code ~ /=\([[:space:]]*$/) { inarr = 1; arr = FNR; next }
    if (code ~ /\)[[:space:]]*$/) {
      inner = code; sub(/^[^(]*\(/, "", inner); sub(/\)[[:space:]]*$/, "", inner)
      hits = 0; varpaths(inner, "array" FNR, 0); roots(inner, "array" FNR); unread(code); next
    }
  }
  n = (code ~ /[;|&]/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
~~~~

NEW:

~~~~text
  if (!cont) { cmd = FNR; seg = 0; spec = 0 }
  cont = (raw ~ /\\$/)
  if (!inarr && code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
    inarr = 1; arr = FNR; sub(/^[^(]*\(/, "", code)
  }
  if (inarr) {
    endp = closing(code)
    elements = endp ? substr(code, 1, endp - 1) : code
    hits = 0; varpaths(elements, "array" arr, 0); roots(elements, "array" arr); unread(elements)
    if (!endp) next
    inarr = 0; code = substr(code, endp + 1); cmd = FNR; seg = 0; spec = 0
    if (code !~ /[^[:space:]]/) next
  }
  n = (code ~ /[;|&]|\$\(/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      continue
    }
    if (part ~ /^[[:space:]]*((local|export|readonly)[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?[[:space:]]*$/) {
      path = part; sub(/^[^=]*="?/, "", path); sub(/"?[[:space:]]*$/, "", path); emit("repo", path)
      continue
    }
    if (part ~ /(^|[[:space:]])git[[:space:]]/) spec = 1
    varpaths(part, grp, spec)
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    rest = part
    while (match(rest, /\047\.(opencode|skilled)\/[^\047]*\047/)) {
      record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
    }
~~~~

NEW:

~~~~text
      continue
    }
    if (part ~ /^[[:space:]]*((local|export|readonly|declare|typeset)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*="?\.opencode\/[A-Za-z0-9._\/-]+"?[[:space:]]*$/) {
      path = part; sub(/^[^=]*="?/, "", path); sub(/"?[[:space:]]*$/, "", path); emit("repo", path)
      continue
    }
    if (part ~ /(^|[^A-Za-z0-9_.-])git[[:space:]]/) spec = 1
    varpaths(part, grp, spec)
    if (part ~ /\\\.(opencode|skilled)\// || part ~ /(\(|\|)(opencode|skilled)(\||\))/) emit("note", "regex")
    rest = part
    while (match(rest, /\047\.(opencode|skilled)(\/[^\047]*)?\047/)) {
      record(substr(rest, RSTART + 1, RLENGTH - 2), grp); rest = substr(rest, RSTART + RLENGTH)
    }
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    if (spec) {
      rest = part; sub(/.*[[:space:]]--([[:space:]]|$)/, "", rest); gsub(/\047[^\047]*\047/, "", rest); roots(rest, grp)
    } else if (part ~ /"\.(opencode|skilled)\//) {
      emit("note", "argument")
    }
    unread(part)
~~~~

NEW:

~~~~text
    if (spec) {
      rest = part; sub(/.*[[:space:]]--([[:space:]]|$)/, "", rest); gsub(/\047[^\047]*\047/, "", rest); roots(rest, grp)
    } else {
      rest = part
      while (match(rest, /"\.(opencode|skilled)\/[^"]*"/)) {
        lit = substr(rest, RSTART + 1, RLENGTH - 2); rest = substr(rest, RSTART + RLENGTH)
        if (lit ~ /^\.opencode\/[A-Za-z0-9._\/-]+$/) emit("repo", lit)
        else emit("note", "argument")
      }
    }
    unread(part)
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (code ~ /^[ ]*(-[ ]+)?run:[ ]+"/) { sub(/run:[ ]+"/, "run: ", code); sub(/"$/, "", code); gsub(/\\"/, "\"", code) }
  else if (code ~ /^[ ]*(-[ ]+)?run:[ ]+\047/) { sub(/run:[ ]+\047/, "run: ", code); sub(/\047$/, "", code); gsub(/\047\047/, "\047", code) }
  n = (code ~ /[;|&]/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
~~~~

NEW:

~~~~text
  if (code ~ /^[ ]*(-[ ]+)?run:[ ]+"/) { sub(/run:[ ]+"/, "run: ", code); sub(/"$/, "", code); gsub(/\\"/, "\"", code) }
  else if (code ~ /^[ ]*(-[ ]+)?run:[ ]+\047/) { sub(/run:[ ]+\047/, "run: ", code); sub(/\047$/, "", code); gsub(/\047\047/, "\047", code) }
  n = (code ~ /[;|&]|\$\(/) ? segments(code, parts) : 1
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
~~~~
