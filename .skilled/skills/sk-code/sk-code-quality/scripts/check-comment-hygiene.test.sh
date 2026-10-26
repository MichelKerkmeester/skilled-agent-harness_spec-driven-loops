#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKER="$SCRIPT_DIR/check-comment-hygiene.sh"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

run_case() {
  local expected_exit="$1"
  local name="$2"
  local extension="$3"
  local content="$4"
  local file_path="$TMP_DIR/${name}.${extension}"
  local output
  local actual_exit

  printf '%s\n' "$content" > "$file_path"

  set +e
  output="$(python3 "$CHECKER" "$file_path" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne "$expected_exit" ]]; then
    printf 'FAIL %s: expected exit %s, got %s\n%s\n' "$name" "$expected_exit" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$name"
  fi
}

run_case 1 "rc_ref" "js" "// RC-2 x"
run_case 1 "dr_single" "js" "// DR-005 x"
run_case 1 "phase_hyphen" "js" "// phase-004 x"
run_case 1 "council_seat" "js" "// P1-Seat2 x"
run_case 1 "adr_ref" "js" "// ADR-7 x"
run_case 1 "inline_req" "js" "const a = 1; // REQ-3"
run_case 1 "feature_catalog" "js" "// Feature catalog: cache invalidation"
run_case 1 "phase_path_short" "js" "// phase-19-gate"
run_case 1 "generic_phase_zero" "js" "// Phase 0 external artifact"
run_case 1 "generic_spec_zero_padded" "js" "// spec 019 external artifact"
# A platform prefix is ordinary comment text, so it never hides an ephemeral id.
run_case 1 "webflow_label_with_id" "js" "// WEBFLOW: see ADR-004"
run_case 1 "motion_label_with_id" "js" "// MOTION: added for T1234"
run_case 1 "lenis_label_with_id" "js" "// LENIS: stop scroll, see DR-005"

run_case 0 "cwe_allowed" "js" "// CWE-79"
run_case 0 "rfc_allowed" "js" "// RFC 2616"
run_case 0 "posix_allowed" "js" "// POSIX"
run_case 0 "schema_allowed" "js" "// V16: schema"
run_case 0 "rc_words_only" "js" "// RC tank"
run_case 0 "normal_comment" "js" "// a normal comment"
run_case 0 "platform_label_plain" "js" "// WEBFLOW: page transitions may re-run this script"
run_case 0 "hygiene_ok_inline" "js" "code(); // hygiene-ok DR-9"
run_case 0 "feature_catalog_without_pointer" "js" "// Feature catalog is a durable concept"
run_case 0 "durable_phase_label" "js" "// Phase 2 protocol stage"
run_case 0 "string_literal" "js" "const pointer = \"spec 019\";"
run_case 0 "url_literal" "js" "// See https://example.test/spec 019"

# Each language the family table names gets one violation case and one clean case.
# Every clean case also hides a label in a string, so a scanner that misses the
# language's quotes fails it.
run_case 1 "py_violation" "py" "x = 1  # ADR-12 x"
run_case 0 "py_clean" "py" "x = 'ADR-12 # in a string'  # keeps the lock short"
run_case 1 "sh_violation" "sh" "echo hi  # ADR-12 x"
run_case 0 "sh_clean" "sh" "echo 'ADR-12 # in a string'  # retries once"
run_case 1 "tsx_violation" "tsx" "export const a = 1; // ADR-12 x"
run_case 0 "tsx_clean" "tsx" "export const a = '// ADR-12'; // a normal comment"
run_case 1 "mts_violation" "mts" "export const a = 1; // ADR-12 x"
run_case 0 "mts_clean" "mts" "export const a = \`// ADR-12\`; // a normal comment"
run_case 1 "jsonc_violation" "jsonc" "{ \"a\": 1 } // ADR-12 x"
run_case 0 "jsonc_clean" "jsonc" "{ \"a\": \"// ADR-12\" } // a normal comment"
run_case 1 "go_violation" "go" "x := 1 // ADR-12 x"
run_case 0 "go_clean" "go" "x := \"// ADR-12\" // a normal comment"
run_case 1 "rs_violation" "rs" "fn a<'a>(x: &'a str) {} // ADR-12 x"
run_case 0 "rs_clean" "rs" "let s = \"// ADR-12\"; // a normal comment"
run_case 1 "yaml_violation" "yaml" "key: value # ADR-12 x"
run_case 0 "yaml_clean" "yaml" "key: 'a # ADR-12' # a normal comment"
run_case 1 "css_violation" "css" "a { color: red; } /* ADR-12 x */"
run_case 0 "css_clean" "css" "a { background: url(//cdn.test/ADR-12.png); } /* a normal comment */"
run_case 1 "toml_violation" "toml" "key = \"v\" # ADR-12 x"
run_case 0 "toml_clean" "toml" "key = \"a # ADR-12\" # a normal comment"
run_case 1 "sql_violation" "sql" "SELECT 1; -- ADR-12 x"
run_case 0 "sql_clean" "sql" "SELECT '-- ADR-12'; -- a normal comment"

# A URL is removed from the comment before the patterns run, so the rest of the line is still checked.
run_case 1 "url_beside_spec_path" "js" "// see https://example.test/a and specs/042-foo/x.md"
# Docstring text and block-comment bodies are comment text. A triple-quoted string
# that is assigned is data, and its closing quotes never open a docstring.
run_case 1 "py_docstring_body" "py" $'def f():\n    """\n    REQ-12 is covered here.\n    """\n    return 1'
run_case 1 "py_docstring_one_line" "py" $'"""Module note, see ADR-12."""'
run_case 0 "py_data_string" "py" $'TEXT = """\nREQ-12 is data here\n"""\nPATH = "specs/042-foo/x.md"'
# A triple-quoted string inside brackets is an argument or an item, never a docstring,
# even when it starts its own line.
run_case 0 "py_call_argument" "py" $'import textwrap\nUSAGE = textwrap.dedent(\n    """\n    see specs/foo/bar.md\n    """\n)'
run_case 0 "py_list_fixture" "py" $'FIXTURES = [\n    """// ADR-12""",\n]'
run_case 0 "py_string_after_code" "py" $'def f():\n    run()\n    """\n    ADR-12 is data\n    """'
run_case 1 "py_attribute_docstring" "py" $'class A:\n    LIMIT = 3\n    """Kept low, see ADR-12."""'
# TOML multi-line strings hold text, so a # line inside one is never a comment.
run_case 0 "toml_multiline_literal" "toml" $'text = \'\'\'\n# ADR-3 heading\n\'\'\'\nkey = 1 # a normal comment'
run_case 0 "toml_multiline_basic" "toml" $'text = """\nUse it # see T1234\n"""'
run_case 1 "toml_comment_after_string" "toml" $'text = """\nplain\n"""\nkey = 1 # ADR-12 x'
# A star opens a comment body line only in the C family, a Go raw string spans lines,
# a Rust char literal is not a string, and a block comment closed on its line leaves
# the code after it unchecked.
run_case 0 "css_universal_selector" "css" "* { content: 'T1234'; }"
run_case 0 "go_raw_string_lines" "go" $'var s = `\n// T1234 not comment\n`'
run_case 1 "rs_char_literal_quote" "rs" "let q = '\"'; // ADR-12"
run_case 0 "block_closed_then_string" "js" '/* note */ const s = "REQ-12";'
run_case 0 "block_closed_then_code" "js" $'/* a note\n*/\nconst p = "specs/042-foo/x.md";'
run_case 0 "opener_inside_string" "js" $'const s = "/* not a comment";\nconst p = "specs/042-foo/x.md";'
run_case 0 "opener_after_backslash" "js" $'const r = /a\\/*b/;\nconst p = "specs/042-foo/x.md";'
run_case 0 "glob_in_template_text" "mjs" $'const notes = `\n  - plugin/** holds the hooks\n  - see ADR-12 for the format\n`;'
# A YAML block scalar holds text, so a # heading inside it is never a comment. The
# block ends at the first line that is not deeper than its key, and comments resume there.
run_case 0 "yaml_block_scalar_heading" "yaml" $'templates:\n  decision_record_md: |\n    # Decision Record\n    <!-- ANCHOR:adr-001 --> ## ADR-001: [Decision Title]\n\n    ## Context\n  plan_md: plain # a normal comment'
run_case 1 "yaml_comment_after_block" "yaml" $'steps:\n  - run: >-\n      # ADR-12 is text in a folded block\n    # ADR-12 x'
run_case 0 "yaml_block_scalar_properties" "yaml" $'run: &a |\n  # T1234\ntext: !!str >-\n  # ADR-12'
# A shebang decides the language before the extension does.
run_case 1 "python_shebang_in_sh" "sh" $'#!/usr/bin/env python3\n"""REQ-12 in a docstring."""'
run_case 1 "issue_reference" "js" "// fixes issue #1234"
run_case 1 "closes_reference" "py" "# closes #12"
run_case 0 "issue_words_only" "js" "// fixes the race between two writers"
run_case 0 "ratio_not_packet" "js" "// retry ratio 100/250"
run_case 1 "zero_padded_packet" "js" "// ratio 042/003"
run_case 0 "standard_utf8" "js" "// decode as UTF-8"
run_case 0 "standard_sha256" "js" "// hash with SHA-256"
run_case 0 "standard_rfc" "js" "// follows RFC 7231"
run_case 0 "standard_http" "js" "// returns HTTP 404"
run_case 0 "standard_cwe" "js" "// guards CWE-79"
# A standard code is cut out of the text, so it never hides a label on the same line.
run_case 1 "standard_beside_label" "js" "// CWE-79 https://example.test and ADR-1"

# Checks one run of the checker: its exit code, and a substring its combined output must hold.
run_cli() {
  local expected_exit="$1"
  local name="$2"
  local expected_text="$3"
  shift 3
  local output
  local actual_exit

  set +e
  output="$("$@" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne "$expected_exit" ]]; then
    printf 'FAIL %s: expected exit %s, got %s\n%s\n' "$name" "$expected_exit" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  elif [[ -n "$expected_text" && "$output" != *"$expected_text"* ]]; then
    printf 'FAIL %s: output does not hold %s\n%s\n' "$name" "$expected_text" "$output" >&2
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$name"
  fi
}

printf '%s\n' "// see ADR-12" > "$TMP_DIR/reason.js"
run_cli 1 "reason_in_text" "reason.js:1: // see ADR-12 [ADR reference]" python3 "$CHECKER" "$TMP_DIR/reason.js"
run_cli 3 "usage_without_files" "Usage:" python3 "$CHECKER"
run_cli 3 "usage_unknown_option" "unknown option" python3 "$CHECKER" --bogus "$TMP_DIR/reason.js"

printf '#!/usr/bin/env bash\n# ADR-12 x\n' > "$TMP_DIR/tool"
run_cli 1 "shebang_without_extension" "[ADR reference]" python3 "$CHECKER" "$TMP_DIR/tool"

printf '%s\n' "// see JIRA-12" > "$TMP_DIR/jira.js"
run_cli 1 "ticket_prefix_added" "[issue or ticket reference]" python3 "$CHECKER" --ticket-prefix JIRA "$TMP_DIR/jira.js"
run_cli 0 "ticket_prefix_absent" "" python3 "$CHECKER" "$TMP_DIR/jira.js"
printf '%s\n' "// see ADR-12" > "$TMP_DIR/lib.zig"
run_cli 2 "extension_unknown" "" python3 "$CHECKER" "$TMP_DIR/lib.zig"
# A file that cannot be opened is skipped when its extension names no language.
ln -s "$TMP_DIR/no-such-target" "$TMP_DIR/dangling"
run_cli 2 "unreadable_unknown_language" "" python3 "$CHECKER" "$TMP_DIR/dangling"
run_cli 1 "extension_added" "[ADR reference]" python3 "$CHECKER" --extension .zig=c "$TMP_DIR/lib.zig"
run_cli 3 "extension_unknown_family" "EXT=FAMILY" python3 "$CHECKER" --extension .zig=nope "$TMP_DIR/lib.zig"
printf '%s\n' "// see TICKET_77" > "$TMP_DIR/extra.js"
run_cli 1 "extra_pattern_added" "[repository pattern]" python3 "$CHECKER" --extra-pattern 'TICKET_[0-9]+' "$TMP_DIR/extra.js"

# The blocking engine fails closed when it cannot read its family table.
mkdir -p "$TMP_DIR/no-table"
cp "$CHECKER" "$TMP_DIR/no-table/check-comment-hygiene.sh"
run_cli 3 "missing_table" "comment family table" python3 "$TMP_DIR/no-table/check-comment-hygiene.sh" "$TMP_DIR/reason.js"

# JSON lists every file with its status, and an unreadable file stays visible when another file violates.
printf '%s\n' "// a normal comment" > "$TMP_DIR/json_good.js"
printf '%s\n' "plain" > "$TMP_DIR/json_skip.txt"
set +e
json_output="$(python3 "$CHECKER" --json "$TMP_DIR/reason.js" "$TMP_DIR/json_good.js" "$TMP_DIR/json_skip.txt" "$TMP_DIR/absent.js" 2>/dev/null)"
json_exit=$?
set -e
if [[ "$json_exit" -eq 1 ]] && python3 -c '
import json, sys
doc = json.loads(sys.argv[1])
statuses = [record["status"] for record in doc["files"]]
finding = doc["files"][0]["findings"][0]
assert doc["schema"] == "comment-hygiene/v1" and doc["exit_code"] == 1
assert statuses == ["violation", "clean", "skipped", "unreadable"], statuses
assert finding["line"] == 1 and finding["rule"] == "adr" and finding["reason"] == "ADR reference"
' "$json_output"; then
  printf 'PASS json_document\n'
else
  printf 'FAIL json_document: exit %s\n%s\n' "$json_exit" "$json_output" >&2
  failures=$((failures + 1))
fi

# Several files in one run: any violation decides the exit, and each file is reported.
printf '%s\n' "// RC-2 x" > "$TMP_DIR/multi_bad.js"
printf '%s\n' "// a normal comment" > "$TMP_DIR/multi_good.js"
printf '%s\n' "plain" > "$TMP_DIR/multi_skip.txt"
set +e
multi_output="$(python3 "$CHECKER" "$TMP_DIR/multi_good.js" "$TMP_DIR/multi_bad.js" "$TMP_DIR/multi_skip.txt" 2>&1)"
multi_exit=$?
python3 "$CHECKER" "$TMP_DIR/multi_good.js" "$TMP_DIR/multi_skip.txt" >/dev/null 2>&1
clean_exit=$?
python3 "$CHECKER" "$TMP_DIR/multi_skip.txt" "$TMP_DIR/multi_skip.txt" >/dev/null 2>&1
skip_exit=$?
set -e
if [[ "$multi_exit" -eq 1 && "$multi_output" == *"multi_bad.js:1:"* && "$clean_exit" -eq 0 && "$skip_exit" -eq 2 ]]; then
  printf 'PASS multi_file\n'
else
  printf 'FAIL multi_file: exits %s/%s/%s\n%s\n' "$multi_exit" "$clean_exit" "$skip_exit" "$multi_output" >&2
  failures=$((failures + 1))
fi

if [[ "$failures" -gt 0 ]]; then
  printf '%s comment hygiene test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All comment hygiene test cases passed\n'
