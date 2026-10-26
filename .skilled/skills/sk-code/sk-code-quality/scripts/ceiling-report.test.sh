#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT="$SCRIPT_DIR/ceiling-report.sh"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

if [[ ! -f "$REPORT" ]]; then
  printf 'FAIL report script is missing: %s\n' "$REPORT" >&2
  exit 1
fi

# Writes one fixture file, runs the report on it and checks the marker line and the summary.
# The expected tags argument is the full bracketed field, or "none" when no marker line is expected.
run_case() {
  local name="$1"
  local extension="$2"
  local content="$3"
  local expected_tags="$4"
  local expected_summary="$5"
  local file_path="$TMP_DIR/${name}.${extension}"
  local output
  local actual_exit
  local ok=1

  printf '%s\n' "$content" > "$file_path"

  set +e
  output="$(python3 "$REPORT" "$file_path" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne 0 ]]; then
    ok=0
  fi
  if [[ "$expected_tags" == "none" ]]; then
    if [[ "$output" == *"$file_path:"* ]]; then
      ok=0
    fi
  elif ! grep -qxF -- "$file_path:1  $content  $expected_tags" <<< "$output"; then
    ok=0
  fi
  if ! grep -qxF -- "$expected_summary" <<< "$output"; then
    ok=0
  fi

  if [[ "$ok" -eq 1 ]]; then
    printf 'PASS %s\n' "$name"
  else
    printf 'FAIL %s: exit %s\n%s\n' "$name" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  fi
}

# Checks only the exit status of a run with the given arguments.
expect_exit() {
  local expected="$1"
  local name="$2"
  shift 2
  local actual

  set +e
  python3 "$REPORT" "$@" >/dev/null 2>&1
  actual=$?
  set -e

  if [[ "$actual" -eq "$expected" ]]; then
    printf 'PASS %s\n' "$name"
  else
    printf 'FAIL %s: expected exit %s, got %s\n' "$name" "$expected" "$actual" >&2
    failures=$((failures + 1))
  fi
}

# Runs the report on a file that already exists and checks the summary line and, when
# the case names one, one exact output line. The line argument is "none" when the marker
# line is not what the case is about.
run_file_case() {
  local name="$1"
  local file_path="$2"
  local expected_line="$3"
  local expected_summary="$4"
  local output
  local actual_exit
  local ok=1

  set +e
  output="$(python3 "$REPORT" "$file_path" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne 0 ]]; then
    ok=0
  fi
  if [[ "$expected_line" != "none" ]] && ! grep -qxF -- "$expected_line" <<< "$output"; then
    ok=0
  fi
  if ! grep -qxF -- "$expected_summary" <<< "$output"; then
    ok=0
  fi

  if [[ "$ok" -eq 1 ]]; then
    printf 'PASS %s\n' "$name"
  else
    printf 'FAIL %s: exit %s\n%s\n' "$name" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  fi
}

run_case "measurable" "js" '// ceiling: global lock; switch to per-account locks if throughput matters' "[]" "markers=1 no-trigger=0 no-signal=0"
run_case "no_trigger" "sh" '# ceiling: global lock' "[no-trigger]" "markers=1 no-trigger=1 no-signal=0"
run_case "no_signal" "js" '// ceiling: global lock; switch to per-account locks when the team agrees' "[no-signal]" "markers=1 no-trigger=0 no-signal=1"
run_case "prefix" "sh" '# intentional-limit: single writer; add a queue if rows arrive faster than 100 per second' "[]" "markers=1 no-trigger=0 no-signal=0"
run_case "prose" "js" '// the ceiling: a longer section' "none" "markers=0 no-trigger=0 no-signal=0"
# Each family's comment tokens come from the table, so an SQL marker counts and a Go raw string does not.
run_case "sql_marker" "sql" 'SELECT 1; -- ceiling: one scan; add an index past 10000 rows' "[]" "markers=1 no-trigger=0 no-signal=0"
run_case "go_raw_string" "go" 'var s = `// ceiling: quoted; past 10 rows`' "none" "markers=0 no-trigger=0 no-signal=0"

# The shebang names the language before the extension does, so a tool with no extension
# is read as Python, where a docstring body is comment text.
printf '#!/usr/bin/env python3\n"""\nceiling: one pass; split it past 10 rows\n"""\n' > "$TMP_DIR/tool"
run_file_case "shebang_language" "$TMP_DIR/tool" \
  "$TMP_DIR/tool:3  ceiling: one pass; split it past 10 rows  []" "markers=1 no-trigger=0 no-signal=0"

# A marker starts after an optional comment prefix, so a block body line carries one.
printf '/*\n ceiling: one pass; split it past 10 rows\n*/\n' > "$TMP_DIR/body.js"
run_file_case "block_body_marker" "$TMP_DIR/body.js" \
  "$TMP_DIR/body.js:2  ceiling: one pass; split it past 10 rows  []" "markers=1 no-trigger=0 no-signal=0"

# Text inside a string form is text, so a marker there never counts, except in a docstring, which
# documents the code. The block scalar, the template literal and the heredoc also hold a prefixed
# marker line, which a reading that misses the form would take as a comment.
printf '%s\n' 'script: |' '  ceiling: one pass' '  # ceiling: one pass' > "$TMP_DIR/yaml_block_scalar_marker.yml"
run_file_case "yaml_block_scalar_marker" "$TMP_DIR/yaml_block_scalar_marker.yml" \
  "none" "markers=0 no-trigger=0 no-signal=0"

printf '%s\n' '"""' 'ceiling: one pass' '"""' > "$TMP_DIR/py_docstring_marker.py"
run_file_case "py_docstring_marker" "$TMP_DIR/py_docstring_marker.py" \
  "$TMP_DIR/py_docstring_marker.py:2  ceiling: one pass  [no-trigger]" "markers=1 no-trigger=1 no-signal=0"

# A string in a data position is not documentation, so its text is read as no comment.
printf '%s\n' 'MESSAGE = """' 'ceiling: one pass' '"""' > "$TMP_DIR/py_data_string_marker.py"
run_file_case "py_data_string_marker" "$TMP_DIR/py_data_string_marker.py" \
  "none" "markers=0 no-trigger=0 no-signal=0"

printf '%s\n' 'const message = `' 'ceiling: one pass' '// ceiling: one pass' '`;' > "$TMP_DIR/js_template_literal_marker.js"
run_file_case "js_template_literal_marker" "$TMP_DIR/js_template_literal_marker.js" \
  "none" "markers=0 no-trigger=0 no-signal=0"

printf '%s\n' "cat <<'EOF'" 'ceiling: one pass' '# ceiling: one pass' 'EOF' > "$TMP_DIR/sh_heredoc_marker.sh"
run_file_case "sh_heredoc_marker" "$TMP_DIR/sh_heredoc_marker.sh" \
  "none" "markers=0 no-trigger=0 no-signal=0"

# The checker reads with universal newlines, so on a CRLF file the closing word must still end
# the heredoc, and the marker after it is still a marker rather than body text.
printf 'cat <<EOF\r\nbody\r\nEOF\r\n# ceiling: 10 rows; split past 10 rows\r\n' > "$TMP_DIR/sh_heredoc_crlf.sh"
run_file_case "crlf_heredoc_marker" "$TMP_DIR/sh_heredoc_crlf.sh" \
  "$TMP_DIR/sh_heredoc_crlf.sh:4  # ceiling: 10 rows; split past 10 rows  []" "markers=1 no-trigger=0 no-signal=0"

expect_exit 2 "missing_path" "$TMP_DIR/missing-probe.js"
expect_exit 2 "unknown_option" --bogus
expect_exit 2 "directory_path" "$TMP_DIR"

# The report reads comment text through the checker beside it, so a report copied out
# alone exits 2 with one message and no stack trace, whatever file it is asked about.
REPORT_ONLY="$TMP_DIR/report-only"
mkdir -p "$REPORT_ONLY"
cp "$REPORT" "$REPORT_ONLY/"
set +e
missing_output="$(python3 "$REPORT_ONLY/ceiling-report.sh" "$REPORT" 2>&1)"
missing_exit=$?
set -e
if [[ "$missing_exit" -eq 2 ]] \
  && grep -qF -- "ceiling-report: cannot load the comment-hygiene checker" <<< "$missing_output" \
  && grep -qF -- "$REPORT_ONLY/check-comment-hygiene.sh" <<< "$missing_output" \
  && ! grep -qF -- "Traceback" <<< "$missing_output"; then
  printf 'PASS missing_checker\n'
else
  printf 'FAIL missing_checker: exit %s\n%s\n' "$missing_exit" "$missing_output" >&2
  failures=$((failures + 1))
fi

# The table loader can fail with more than a read error or a bad value on a malformed table,
# and no failure of it may end in a traceback: one message on one line, and exit 2.
TABLE_CASE="$TMP_DIR/table-case"
mkdir -p "$TABLE_CASE/scripts" "$TABLE_CASE/assets"
cp "$REPORT" "$SCRIPT_DIR/check-comment-hygiene.sh" "$TABLE_CASE/scripts/"
printf '%s\n' \
  '{' \
  '  "schemaVersion": 1,' \
  '  "families": {"c": {"lineComment": ["//"]}},' \
  '  "languages": {"x": {"family": ["c"], "extensions": [".x"]}}' \
  '}' > "$TABLE_CASE/assets/comment-syntax.json"
set +e
table_output="$(python3 "$TABLE_CASE/scripts/ceiling-report.sh" "$REPORT" 2>&1)"
table_exit=$?
set -e
table_lines="$(printf '%s\n' "$table_output" | wc -l)"
table_first_line="$(printf '%s\n' "$table_output" | head -1)"
if [[ "$table_exit" -eq 2 ]] \
  && [[ "$table_lines" -eq 1 ]] \
  && [[ "$table_first_line" == "ceiling-report: cannot read the comment family table"* ]]; then
  printf 'PASS table_type_error\n'
else
  printf 'FAIL table_type_error: exit %s lines %s\n%s\n' "$table_exit" "$table_lines" "$table_output" >&2
  failures=$((failures + 1))
fi

# A valid table that carries no fallback family cannot serve a file of unknown language, so
# the report refuses it up front with one message and exit 2, rather than raising a traceback
# partway through a run that had already printed the markers before it.
FALLBACK_CASE="$TMP_DIR/fallback-case"
mkdir -p "$FALLBACK_CASE/scripts" "$FALLBACK_CASE/assets"
cp "$REPORT" "$SCRIPT_DIR/check-comment-hygiene.sh" "$FALLBACK_CASE/scripts/"
printf '%s\n' \
  '{' \
  '  "families": {"c": {"lineComment": ["//"]}},' \
  '  "languages": {"js": {"family": "c", "extensions": [".js"]}}' \
  '}' > "$FALLBACK_CASE/assets/comment-syntax.json"
printf '%s\n' '// ceiling: one writer; add a queue past 100 rows' > "$FALLBACK_CASE/known.js"
printf '%s\n' 'plain text, no marker here' > "$FALLBACK_CASE/unknown.zzz"
FALLBACK_REPORT="$FALLBACK_CASE/scripts/ceiling-report.sh"
set +e
fallback_output="$(python3 "$FALLBACK_REPORT" "$FALLBACK_CASE/known.js" "$FALLBACK_CASE/unknown.zzz" 2>&1)"
fallback_exit=$?
set -e
fallback_lines="$(printf '%s\n' "$fallback_output" | wc -l)"
if [[ "$fallback_exit" -eq 2 ]] \
  && [[ "$fallback_lines" -eq 1 ]] \
  && grep -qF -- "ceiling-report: the comment family table" <<< "$fallback_output" \
  && grep -qF -- "no hash family" <<< "$fallback_output" \
  && ! grep -qF -- "Traceback" <<< "$fallback_output"; then
  printf 'PASS table_missing_fallback_family\n'
else
  printf 'FAIL table_missing_fallback_family: exit %s lines %s\n%s\n' "$fallback_exit" "$fallback_lines" "$fallback_output" >&2
  failures=$((failures + 1))
fi

# With no arguments the report reads the repository around the working directory, not the one
# holding the script, so a run from a subfolder of another repository reports that repository's files.
REPO_DIR="$TMP_DIR/foreign-repo"
mkdir -p "$REPO_DIR/src/deep"
printf '%s\n' '// ceiling: one writer; add a queue past 100 rows per second' > "$REPO_DIR/src/deep/a.go"
git -C "$REPO_DIR" init -q
git -C "$REPO_DIR" add src/deep/a.go
set +e
repo_output="$(cd "$REPO_DIR/src/deep" && python3 "$REPORT" 2>&1)"
repo_exit=$?
set -e
if [[ "$repo_exit" -eq 0 ]] \
  && grep -qxF -- "src/deep/a.go:1  // ceiling: one writer; add a queue past 100 rows per second  []" <<< "$repo_output" \
  && grep -qxF -- "markers=1 no-trigger=0 no-signal=0" <<< "$repo_output"; then
  printf 'PASS subfolder_of_foreign_repo\n'
else
  printf 'FAIL subfolder_of_foreign_repo: exit %s\n%s\n' "$repo_exit" "$repo_output" >&2
  failures=$((failures + 1))
fi

# The report loads the checker as a module with bytecode writing off, so a run leaves no cache
# folder beside the scripts.
cache_dirs="$(find "$SCRIPT_DIR" -name __pycache__ -print)"
if [[ -z "$cache_dirs" ]]; then
  printf 'PASS no_bytecode_cache\n'
else
  printf 'FAIL no_bytecode_cache: %s\n' "$cache_dirs" >&2
  failures=$((failures + 1))
fi

if [[ "$failures" -gt 0 ]]; then
  printf '%s ceiling report test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All ceiling report test cases passed\n'
