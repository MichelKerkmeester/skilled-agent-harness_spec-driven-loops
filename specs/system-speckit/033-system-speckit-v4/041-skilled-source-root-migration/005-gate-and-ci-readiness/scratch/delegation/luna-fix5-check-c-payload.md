# Edits for unit luna-fix5-check-c

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    var = tok; sub(/\/\.(opencode|skilled).*/, "", var); path = tok; sub(/^[^\/]*\//, "", path)
    if (pathspec) record(path, grp)
    if (path ~ /^\.opencode\/./) emit((var ~ /REPO_ROOT/ ? "repo" : "var"), path)
    else emit("note", "read")
  }
}
function closing(s,    i, n, c, q) {
~~~~

NEW:

~~~~text
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
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (raw ~ /^[[:space:]]*#/) next
  code = (raw ~ /#/) ? uncomment(raw) : raw
  if (!cont) { cmd = FNR; seg = 0; spec = 0 }
  cont = (raw ~ /\\$/)
  if (!inarr && code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
    inarr = 1; arr = FNR; sub(/^[^(]*\(/, "", code)
  }
~~~~

NEW:

~~~~text
  if (raw ~ /^[[:space:]]*#/) next
  code = (raw ~ /#/) ? uncomment(raw) : raw
  if (!cont) { cmd = FNR; seg = 0; spec = 0; after = 0 }
  cont = (raw ~ /\\$/)
  if (!inarr && code ~ /^[[:space:]]*((local|declare|typeset|readonly)([[:space:]]+-[A-Za-z]+)*[[:space:]]+)?[A-Za-z_][A-Za-z0-9_]*=\(/) {
    arrname = code; sub(/=\(.*/, "", arrname); sub(/.*[[:space:]]/, "", arrname)
    inarr = 1; arr = FNR; sub(/^[^(]*\(/, "", code)
  }
~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    endp = closing(code)
    elements = endp ? substr(code, 1, endp - 1) : code
    hits = 0; varpaths(elements, "array" arr, 0); roots(elements, "array" arr); unread(elements)
    if (!endp) next
    inarr = 0; code = substr(code, endp + 1); cmd = FNR; seg = 0; spec = 0
    if (code !~ /[^[:space:]]/) next
  }
~~~~

NEW:

~~~~text
    endp = closing(code)
    elements = endp ? substr(code, 1, endp - 1) : code
    hits = 0; varpaths(elements, "array" arr, 0, arrname); roots(elements, "array" arr); unread(elements)
    if (!endp) next
    inarr = 0; code = substr(code, endp + 1); cmd = FNR; seg = 0; spec = 0; after = 0
    if (code !~ /[^[:space:]]/) next
  }
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    if (p > 1) { seg++; spec = 0 }
    part = parts[p]; grp = cmd ":" seg; hits = 0
    if (part ~ /^[[:space:]]*((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
~~~~

NEW:

~~~~text
  if (n == 1) parts[1] = code
  for (p = 1; p <= n; p++) {
    if (p > 1) { seg++; spec = 0; after = 0 }
    part = parts[p]; grp = cmd ":" seg; hits = 0
    if (part ~ /^[[:space:]]*((!|then|else|do|\{|\()[[:space:]]*)?(echo|printf)([[:space:]]|$)/) {
~~~~
