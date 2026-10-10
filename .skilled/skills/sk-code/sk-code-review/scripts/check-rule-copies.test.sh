#!/usr/bin/env bash
set -euo pipefail

# Self-contained test for check-rule-copies.js. Runnable from anywhere — paths
# are resolved relative to this script, not the caller's CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKER="$SCRIPT_DIR/check-rule-copies.js"
FINAL_LINE_CHECKER="$SCRIPT_DIR/check-review-final-line.js"
# scripts -> review -> sk-code -> skills -> .skilled -> repo root
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

# Real target files the canary reads. The tamper cases seed ALL of them into a
# throwaway tree so the resulting failure is attributable to the one mutation,
# not to incidentally-missing files.
TARGETS=(
  ".skilled/skills/sk-code/sk-code-review/SKILL.md"
  ".skilled/skills/sk-code/sk-code-review/README.md"
  ".skilled/skills/sk-code/sk-code-review/changelog/v1.3.0.0.md"
  ".skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md"
  ".skilled/skills/sk-code/shared/references/workflow-verify.md"
  "AGENTS.md"
  ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
)

seed_tree() {
  local dest="$1"
  local rel
  for rel in "${TARGETS[@]}"; do
    mkdir -p "$dest/$(dirname "$rel")"
    cp "$REPO_ROOT/$rel" "$dest/$rel"
  done
}

run_case() {
  local expected_exit="$1"
  local name="$2"
  shift 2
  local output
  local actual_exit

  set +e
  output="$("$@" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne "$expected_exit" ]]; then
    printf 'FAIL %s: expected exit %s, got %s\n%s\n' "$name" "$expected_exit" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$name"
  fi
}

# PASS: the real, consistent repo tree (exercises the default-CWD root path).
real_repo_run() {
  ( cd "$REPO_ROOT" && node "$CHECKER" )
}
run_case 0 "real_repo_root_consistent" real_repo_run

# FAIL: tampered tree with an exact-substring invariant deleted.
CASE_DELETED="$TMP_DIR/deleted_status"
seed_tree "$CASE_DELETED"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("Review status: APPROVED",""));' \
  "$CASE_DELETED/.skilled/skills/sk-code/sk-code-review/SKILL.md"
run_case 1 "missing_review_status_approved" node "$CHECKER" --root "$CASE_DELETED"

# FAIL: tampered tree whose AGENTS.md Iron Law line is reworded to drop "verification".
CASE_REWORDED="$TMP_DIR/reworded_iron_law"
seed_tree "$CASE_REWORDED"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("stack-appropriate verification","stack-appropriate checks"));' \
  "$CASE_REWORDED/AGENTS.md"
run_case 1 "iron_law_dropped_verification" node "$CHECKER" --root "$CASE_REWORDED"

# FAIL with a named anchor: text inserted at the top pushes binding clauses past
# the delivery prefix, so the guard must report which anchor moved out.
expect_output() {
  local pattern="$1"
  local name="$2"
  shift 2
  local output
  set +e
  output="$("$@" 2>&1)"
  set -e
  if printf '%s' "$output" | grep -qF -- "$pattern"; then
    printf 'PASS %s\n' "$name"
  else
    printf 'FAIL %s: output lacks "%s"\n%s\n' "$name" "$pattern" "$output" >&2
    failures=$((failures + 1))
  fi
}

CASE_PAST_CUT="$TMP_DIR/anchor_past_cut"
seed_tree "$CASE_PAST_CUT"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, "x".repeat(17000) + "\n" + fs.readFileSync(f,"utf8"));' \
  "$CASE_PAST_CUT/AGENTS.md"
run_case 1 "delivery_prefix_anchor_past_cut" node "$CHECKER" --root "$CASE_PAST_CUT"
expect_output '"#### The Four Laws" ends at byte' "delivery_prefix_names_anchor" node "$CHECKER" --root "$CASE_PAST_CUT"

# FAIL: a file over the Codex ceiling, even with every anchor still in the prefix.
CASE_OVERSIZE="$TMP_DIR/oversize"
seed_tree "$CASE_OVERSIZE"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8") + "\n" + "y".repeat(33000) + "\n");' \
  "$CASE_OVERSIZE/AGENTS.md"
run_case 1 "delivery_prefix_over_ceiling" node "$CHECKER" --root "$CASE_OVERSIZE"
expect_output 'exceeds the 32768-byte ceiling' "delivery_prefix_names_ceiling" node "$CHECKER" --root "$CASE_OVERSIZE"

# PASS: an untampered seeded tree. This proves TARGETS holds every file the
# canary reads, so each tamper case fails for its own mutation alone.
CASE_SEEDED="$TMP_DIR/seeded_untampered"
seed_tree "$CASE_SEEDED"
run_case 0 "seeded_tree_consistent" node "$CHECKER" --root "$CASE_SEEDED"

# FAIL: each item the restraint ladder may never cut, deleted one at a time.
NEVER_CUT_PINS=(
  'never cuts a P0 item'
  'anything the user asked for'
  '**Input validation**'
  '**No silent failures**'
  '**No hardcoded secrets**'
  '**Accessibility**'
)
pin_index=0
for pin in "${NEVER_CUT_PINS[@]}"; do
  pin_index=$((pin_index + 1))
  CASE_PIN="$TMP_DIR/never_cut_$pin_index"
  seed_tree "$CASE_PIN"
  PIN="$pin" node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").split(process.env.PIN).join(""));' \
    "$CASE_PIN/.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
  run_case 1 "never_cut_removed_$pin_index" node "$CHECKER" --root "$CASE_PIN"
  expect_output "missing exact invariant string: \"$pin\"" "never_cut_names_$pin_index" node "$CHECKER" --root "$CASE_PIN"
done

# These cases guard the final-line contract for full reviews, skips and result blocks.
FINAL_LINE_CLEAN="$TMP_DIR/final_line_clean.md"
printf 'Findings\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$FINAL_LINE_CLEAN"
run_case 0 "final_line_clean" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_CLEAN"

FINAL_LINE_RESULT_BEFORE="$TMP_DIR/final_line_result_block_before_status.md"
printf 'Findings\n\nAGENT_IO_RESULT v1\nschema_version: agent-io/v1\nstatus: pass\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$FINAL_LINE_RESULT_BEFORE"
run_case 0 "final_line_result_block_before_status" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_RESULT_BEFORE"

FINAL_LINE_SKIP_M1="$TMP_DIR/final_line_skip_m1.md"
printf 'Review status: COMMENTED (no changes since last review at abc1234)\n' > "$FINAL_LINE_SKIP_M1"
run_case 0 "final_line_skip_m1" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_SKIP_M1"

FINAL_LINE_SKIP_M2="$TMP_DIR/final_line_skip_m2.md"
printf 'Review status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)\n' > "$FINAL_LINE_SKIP_M2"
run_case 0 "final_line_skip_m2" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_SKIP_M2"

FINAL_LINE_TEXT_AFTER="$TMP_DIR/final_line_text_after_status.md"
printf 'Findings\n\nNot checked: nothing material\n\nReview status: APPROVED\nThanks\n' > "$FINAL_LINE_TEXT_AFTER"
run_case 1 "final_line_text_after_status" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TEXT_AFTER"
expect_output 'final line is not an exact status line' "final_line_text_after_status_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TEXT_AFTER"

FINAL_LINE_RESULT_AFTER="$TMP_DIR/final_line_result_block_after_status.md"
printf 'Findings\n\nNot checked: nothing material\n\nReview status: APPROVED\n\nAGENT_IO_RESULT v1\nschema_version: agent-io/v1\nstatus: pass\n' > "$FINAL_LINE_RESULT_AFTER"
run_case 1 "final_line_result_block_after_status" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_RESULT_AFTER"
expect_output 'AGENT_IO_RESULT block follows the status line' "final_line_result_block_after_status_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_RESULT_AFTER"

FINAL_LINE_TRAILING_WHITESPACE="$TMP_DIR/final_line_trailing_whitespace.md"
printf 'Not checked: nothing material\n\nReview status: APPROVED \n' > "$FINAL_LINE_TRAILING_WHITESPACE"
run_case 1 "final_line_trailing_whitespace" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TRAILING_WHITESPACE"
expect_output 'final line is not an exact status line' "final_line_trailing_whitespace_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TRAILING_WHITESPACE"

FINAL_LINE_BLANK_AFTER_STATUS="$TMP_DIR/final_line_blank_after_status.md"
printf 'Findings\n\nNot checked: nothing material\n\nReview status: APPROVED\n\n' > "$FINAL_LINE_BLANK_AFTER_STATUS"
run_case 1 "final_line_blank_after_status" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_BLANK_AFTER_STATUS"
expect_output 'blank line after the status line' "final_line_blank_after_status_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_BLANK_AFTER_STATUS"

FINAL_LINE_MISSING_NOT_CHECKED="$TMP_DIR/final_line_missing_not_checked.md"
printf 'Findings\n\nReview status: APPROVED\n' > "$FINAL_LINE_MISSING_NOT_CHECKED"
run_case 1 "final_line_missing_not_checked" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_MISSING_NOT_CHECKED"
expect_output 'no "Not checked:" line above the status line' "final_line_missing_not_checked_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_MISSING_NOT_CHECKED"

FINAL_LINE_SKIP_AFTER_BODY="$TMP_DIR/final_line_skip_after_body.md"
printf 'Findings\n\nNot checked: nothing material\n\nReview status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)\n' > "$FINAL_LINE_SKIP_AFTER_BODY"
run_case 1 "final_line_skip_after_body" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_SKIP_AFTER_BODY"
expect_output 'skip status must be the whole output' "final_line_skip_after_body_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_SKIP_AFTER_BODY"

FINAL_LINE_NO_BLANK_ABOVE_STATUS="$TMP_DIR/final_line_no_blank_above_status.md"
printf 'Findings\nNot checked: nothing material\nReview status: APPROVED\n' > "$FINAL_LINE_NO_BLANK_ABOVE_STATUS"
run_case 1 "final_line_no_blank_above_status" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_NO_BLANK_ABOVE_STATUS"
expect_output 'no blank line above the status line' "final_line_no_blank_above_status_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_NO_BLANK_ABOVE_STATUS"

FINAL_LINE_TWO_BLANK_ABOVE_STATUS="$TMP_DIR/final_line_two_blank_above_status.md"
printf 'Findings\n\nNot checked: nothing material\n\n\nReview status: APPROVED\n' > "$FINAL_LINE_TWO_BLANK_ABOVE_STATUS"
run_case 1 "final_line_two_blank_above_status" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TWO_BLANK_ABOVE_STATUS"
expect_output 'more than one blank line above the status line' "final_line_two_blank_above_status_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TWO_BLANK_ABOVE_STATUS"

FINAL_LINE_TWO_NOT_CHECKED="$TMP_DIR/final_line_two_not_checked.md"
printf 'Not checked: a\n\nNot checked: b\n\nReview status: APPROVED\n' > "$FINAL_LINE_TWO_NOT_CHECKED"
run_case 1 "final_line_two_not_checked" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TWO_NOT_CHECKED"
expect_output 'more than one "Not checked:" line in the output' "final_line_two_not_checked_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_TWO_NOT_CHECKED"

FINAL_LINE_UNREADABLE="$TMP_DIR/no-such-file.md"
run_case 2 "final_line_unreadable_file" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_UNREADABLE"
expect_output "cannot read $FINAL_LINE_UNREADABLE: " "final_line_unreadable_file_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_UNREADABLE"

# Seeded examples ensure the canary rejects content after status and missing context.
CASE_EXAMPLE_TEXT_AFTER="$TMP_DIR/example_text_after_status"
seed_tree "$CASE_EXAMPLE_TEXT_AFTER"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("Review status: REQUESTED_CHANGES\n\x60\x60\x60","Review status: REQUESTED_CHANGES\nThanks\n\x60\x60\x60"));' \
  "$CASE_EXAMPLE_TEXT_AFTER/.skilled/skills/sk-code/sk-code-review/README.md"
run_case 1 "canary_example_text_after_status" node "$CHECKER" --root "$CASE_EXAMPLE_TEXT_AFTER"
expect_output 'example after "**Step 2: Run the primary workflow.**"' "canary_example_text_after_status_output" node "$CHECKER" --root "$CASE_EXAMPLE_TEXT_AFTER"

CASE_EXAMPLE_MISSING_NOT_CHECKED="$TMP_DIR/example_missing_not_checked"
seed_tree "$CASE_EXAMPLE_MISSING_NOT_CHECKED"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace(/^Not checked: behavior under concurrent writes.*\n/m, ""));' \
  "$CASE_EXAMPLE_MISSING_NOT_CHECKED/.skilled/skills/sk-code/sk-code-review/SKILL.md"
run_case 1 "canary_example_missing_not_checked" node "$CHECKER" --root "$CASE_EXAMPLE_MISSING_NOT_CHECKED"
expect_output 'no "Not checked:" line above the status line' "canary_example_missing_not_checked_output" node "$CHECKER" --root "$CASE_EXAMPLE_MISSING_NOT_CHECKED"

if [[ "$failures" -gt 0 ]]; then
  printf '%s rule-canary test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All rule-canary test cases passed\n'
