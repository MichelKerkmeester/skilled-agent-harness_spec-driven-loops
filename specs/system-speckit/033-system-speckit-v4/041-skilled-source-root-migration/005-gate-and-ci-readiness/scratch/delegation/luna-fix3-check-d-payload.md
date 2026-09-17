# Edits for unit luna-fix3-check-d

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text

scan_workflow() { # scan_workflow <relpath>
  local rel="$1" out ln kind tok twin owner
  out="$(awk "$LEX_AWK$TWIN_AWK$WORKFLOW_AWK" "$ROOT/$rel")"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
~~~~

NEW:

~~~~text

scan_workflow() { # scan_workflow <relpath>
  local rel="$1" ln kind tok twin owner
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$WORKFLOW_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
      bare) DYNAMIC=$((DYNAMIC + 1)) ;;
      shape) fail parser-miss "$rel:$ln" "path filter shape not recognized: $tok" ;;
    esac
  done <<<"$out"
  check_regex "$rel"
  unread_lines "$rel" "$(printf '%s\n%s\n' "$out" "$REGEX_LINES" | cut -f1)"
}

~~~~

NEW:

~~~~text
      bare) DYNAMIC=$((DYNAMIC + 1)) ;;
      shape) fail parser-miss "$rel:$ln" "path filter shape not recognized: $tok" ;;
      miss) fail parser-miss "$rel:$ln" "names a source root that no rule reads" ;;
    esac
  done <<<"$PARSED"
  check_regex "$rel"
}

~~~~

## Edit 3

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
  code = ($0 ~ /#/) ? uncomment($0) : $0
  if (code ~ /^[[:space:]]*-[[:space:]]+[A-Za-z_-]+:/) entry = FNR
  line = code
  while (match(line, /(^|[[:space:],"\047])\/\.(opencode|skilled)(\/[A-Za-z0-9._*\/-]*)?/)) {
    tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != "/") tok = substr(tok, 2)
~~~~

NEW:

~~~~text
  code = ($0 ~ /#/) ? uncomment($0) : $0
  if (code ~ /^[[:space:]]*-[[:space:]]+[A-Za-z_-]+:/) entry = FNR
  hits = 0; line = code
  while (match(line, /(^|[[:space:],"\047])\/\.(opencode|skilled)(\/[A-Za-z0-9._*\/-]*)?/)) {
    tok = substr(line, RSTART, RLENGTH); if (substr(tok, 1, 1) != "/") tok = substr(tok, 2)
~~~~

## Edit 4

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text
    record(tok, entry); line = substr(line, RSTART + RLENGTH)
  }
}'

scan_dependabot() { # scan_dependabot <relpath>
  local rel="$1" out ln kind tok twin
  out="$(awk "$LEX_AWK$TWIN_AWK$DEPENDABOT_AWK" "$ROOT/$rel")"
  while IFS=$'\t' read -r ln kind tok twin; do
    [[ -n "$ln" ]] || continue
    if [[ "$kind" == "twin-ok" ]]; then TWINS=$((TWINS + 1))
    else fail filter-twins "$rel:$ln" "directory $tok has no twin $twin"; fi
  done <<<"$out"
  unread_lines "$rel" "$(printf '%s\n' "$out" | cut -f1)"
}

~~~~

NEW:

~~~~text
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

~~~~
