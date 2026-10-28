#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: RULE COPY CANARY TESTS
# ───────────────────────────────────────────────────────────────
set -euo pipefail

# Self-contained test for check-rule-copies.js. Runnable from anywhere — paths
# are resolved relative to this script, not the caller's CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHECKER="$SCRIPT_DIR/check-rule-copies.js"
FINAL_LINE_CHECKER="$SCRIPT_DIR/check-review-final-line.js"
FINDINGS_CHECKER="$SCRIPT_DIR/check-review-findings.js"
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
  ".skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md"
  ".skilled/skills/sk-code/sk-code-review/references/review-core.md"
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

# The findings checker keeps one numbering across the severity groups and needs a Case line on each finding.
FINDINGS_VALID="$TMP_DIR/findings_valid.md"
printf '## Findings\n\n### P0 - Critical\n1. src/a.ts:1 Title\n   - Case: x\n   - Risk: y\n\n### P1 - High\n2. src/b.ts:2 Title\n   - Case: z\n   - Risk: w\n\n## Removal/Iteration Plan\n' > "$FINDINGS_VALID"
run_case 0 "findings_valid" node "$FINDINGS_CHECKER" "$FINDINGS_VALID"

FINDINGS_MISSING_CASE="$TMP_DIR/findings_missing_case.md"
printf '## Findings\n\n### P0 - Critical\n1. src/a.ts:1 Title\n   - Case: x\n   - Risk: y\n\n### P1 - High\n2. src/b.ts:2 Title\n   - Risk: w\n\n## Removal/Iteration Plan\n' > "$FINDINGS_MISSING_CASE"
run_case 1 "findings_missing_case" node "$FINDINGS_CHECKER" "$FINDINGS_MISSING_CASE"
expect_output 'finding 2 has no Case: line' "findings_missing_case_output" node "$FINDINGS_CHECKER" "$FINDINGS_MISSING_CASE"

FINDINGS_RESTART_NUMBERING="$TMP_DIR/findings_restart_numbering.md"
printf '## Findings\n\n### P0 - Critical\n1. src/a.ts:1 Title\n   - Case: x\n\n### P1 - High\n1. src/b.ts:2 Title\n   - Case: z\n\n## Removal/Iteration Plan\n' > "$FINDINGS_RESTART_NUMBERING"
run_case 1 "findings_restart_numbering" node "$FINDINGS_CHECKER" "$FINDINGS_RESTART_NUMBERING"
expect_output 'finding numbers restart or skip: expected 2, found 1' "findings_restart_numbering_output" node "$FINDINGS_CHECKER" "$FINDINGS_RESTART_NUMBERING"

FINDINGS_NONE="$TMP_DIR/findings_no_findings.md"
printf '## Findings\n\n### P0 - Critical\nNo findings.\n\nNot checked: nothing material\n' > "$FINDINGS_NONE"
run_case 0 "findings_no_findings" node "$FINDINGS_CHECKER" "$FINDINGS_NONE"

FINAL_LINE_NOT_CHECKED_SPACES="$TMP_DIR/final_line_not_checked_two_spaces.md"
printf 'Findings\n\nNot checked:  two spaces after the colon\n\nReview status: APPROVED\n' > "$FINAL_LINE_NOT_CHECKED_SPACES"
run_case 0 "final_line_not_checked_two_spaces" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_NOT_CHECKED_SPACES"

# Both documented finding shapes run through both checkers, so neither shape can pass unchecked.
SHAPE_DIR="$SCRIPT_DIR/review-output-fixture"
for shape in list-shape-valid heading-shape-valid heading-shape-missing-case heading-shape-restart; do
  run_case 0 "shape_final_line_$shape" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/$shape.md"
done
run_case 0 "shape_findings_list_valid" node "$FINDINGS_CHECKER" "$SHAPE_DIR/list-shape-valid.md"
run_case 0 "shape_findings_heading_valid" node "$FINDINGS_CHECKER" "$SHAPE_DIR/heading-shape-valid.md"
expect_output 'OK: findings are numbered once and each carries a Case line' "shape_findings_heading_valid_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/heading-shape-valid.md"
run_case 1 "shape_findings_heading_missing_case" node "$FINDINGS_CHECKER" "$SHAPE_DIR/heading-shape-missing-case.md"
expect_output 'finding 2 has no Case: line' "shape_findings_heading_missing_case_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/heading-shape-missing-case.md"
run_case 1 "shape_findings_heading_restart" node "$FINDINGS_CHECKER" "$SHAPE_DIR/heading-shape-restart.md"
expect_output 'finding numbers restart or skip: expected 2, found 1' "shape_findings_heading_restart_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/heading-shape-restart.md"

# FAIL: a summary whose Overall assessment contradicts the final status line.
run_case 1 "shape_final_line_overall_contradicts_status" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/overall-contradicts-status.md"
expect_output 'Overall assessment "REQUESTED_CHANGES" contradicts the final status line "Review status: APPROVED"' "shape_final_line_overall_contradicts_status_output" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/overall-contradicts-status.md"

# FAIL: the same contradiction written as a list item or in title case, so a reworded header cannot slip past the comparison.
for variant in bulleted title-case; do
  run_case 1 "shape_final_line_overall_contradicts_status_$variant" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/overall-contradicts-status-$variant.md"
  expect_output 'Overall assessment "REQUESTED_CHANGES" contradicts the final status line "Review status: APPROVED"' "shape_final_line_overall_contradicts_status_${variant}_output" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/overall-contradicts-status-$variant.md"
done

# PASS: a bold, backticked Overall assessment that agrees with the status line, and a template placeholder, are both accepted.
FINAL_LINE_OVERALL_AGREES="$TMP_DIR/final_line_overall_agrees.md"
printf '**Overall assessment**: `COMMENTED`\n\nNot checked: nothing material\n\nReview status: COMMENTED\n' > "$FINAL_LINE_OVERALL_AGREES"
run_case 0 "final_line_overall_agrees" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_OVERALL_AGREES"
FINAL_LINE_OVERALL_PLACEHOLDER="$TMP_DIR/final_line_overall_placeholder.md"
printf '**Overall assessment**: [APPROVED / REQUESTED_CHANGES / COMMENTED]\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$FINAL_LINE_OVERALL_PLACEHOLDER"
run_case 0 "final_line_overall_placeholder" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_OVERALL_PLACEHOLDER"

# FAIL: the gate-recommendation tokens in the single-pass reference drift from the status-line vocabulary.
CASE_UX_VOCABULARY="$TMP_DIR/ux_vocabulary"
seed_tree "$CASE_UX_VOCABULARY"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("`REQUESTED_CHANGES`","`REQUEST_CHANGES`"));' \
  "$CASE_UX_VOCABULARY/.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md"
run_case 1 "ux_vocabulary_drift" node "$CHECKER" --root "$CASE_UX_VOCABULARY"
expect_output 'review-ux-single-pass.md: missing exact invariant string' "ux_vocabulary_drift_output" node "$CHECKER" --root "$CASE_UX_VOCABULARY"

# FAIL: an AGENTS.md evidence-floor label the review mode applies is renamed.
CASE_REVIEW_FLOOR="$TMP_DIR/review_floor_label"
seed_tree "$CASE_REVIEW_FLOOR"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("**Finding = hypothesis**","**Finding = claim**"));' \
  "$CASE_REVIEW_FLOOR/AGENTS.md"
run_case 1 "review_floor_label_drift" node "$CHECKER" --root "$CASE_REVIEW_FLOOR"
expect_output 'AGENTS.md: missing exact invariant string: "**Finding = hypothesis**"' "review_floor_label_drift_output" node "$CHECKER" --root "$CASE_REVIEW_FLOOR"

# FAIL: one extension floor is reworded inside its section.
CASE_EXTENSION_FLOOR="$TMP_DIR/extension_floor"
seed_tree "$CASE_EXTENSION_FLOOR"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("No review is approved while a P0 finding is unaddressed.","A review may be approved with a P0 finding open."));' \
  "$CASE_EXTENSION_FLOOR/.skilled/skills/sk-code/sk-code-review/SKILL.md"
run_case 1 "extension_floor_reworded" node "$CHECKER" --root "$CASE_EXTENSION_FLOOR"
expect_output 'extension floor missing from "### Extension Floors"' "extension_floor_reworded_output" node "$CHECKER" --root "$CASE_EXTENSION_FLOOR"

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

# FAIL: the Rule sources line format in review-core.md is reworded, and a review floor id is dropped from its table.
CASE_RULE_SOURCES="$TMP_DIR/rule_sources_format"
seed_tree "$CASE_RULE_SOURCES"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("Refused: <checklist file>. Ignored:","Ignored:"));' \
  "$CASE_RULE_SOURCES/.skilled/skills/sk-code/sk-code-review/references/review-core.md"
run_case 1 "rule_sources_format_reworded" node "$CHECKER" --root "$CASE_RULE_SOURCES"
expect_output 'review-core.md: missing exact invariant string: "Rule sources: <checklist file>' "rule_sources_format_reworded_output" node "$CHECKER" --root "$CASE_RULE_SOURCES"

CASE_REVIEW_FLOOR_ID="$TMP_DIR/review_floor_id"
seed_tree "$CASE_REVIEW_FLOOR_ID"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("| `review.reach` |","| `review.function-length` |"));' \
  "$CASE_REVIEW_FLOOR_ID/.skilled/skills/sk-code/sk-code-review/references/review-core.md"
run_case 1 "review_floor_id_dropped" node "$CHECKER" --root "$CASE_REVIEW_FLOOR_ID"
expect_output 'missing exact invariant string: "| `review.reach` |"' "review_floor_id_dropped_output" node "$CHECKER" --root "$CASE_REVIEW_FLOOR_ID"

# PASS: a report that carries the Rule sources line still passes both report checkers.
run_case 0 "shape_final_line_rule_sources" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/rule-sources-valid.md"
run_case 0 "shape_findings_rule_sources" node "$FINDINGS_CHECKER" "$SHAPE_DIR/rule-sources-valid.md"
expect_output 'OK: findings are numbered once and each carries a Case line' "shape_findings_rule_sources_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/rule-sources-valid.md"

# The review agent's PR shape carries a Recommendation line. It must agree with the status line and the findings.
run_case 0 "shape_final_line_pr_shape_valid" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/pr-shape-valid.md"
run_case 0 "shape_findings_pr_shape_valid" node "$FINDINGS_CHECKER" "$SHAPE_DIR/pr-shape-valid.md"
run_case 1 "shape_final_line_recommendation_contradicts_status" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/recommendation-contradicts-status.md"
expect_output 'Recommendation "APPROVED" contradicts the final status line "Review status: REQUESTED_CHANGES"' "shape_final_line_recommendation_contradicts_status_output" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/recommendation-contradicts-status.md"
run_case 0 "shape_final_line_recommendation_contradicts_findings" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/recommendation-contradicts-findings.md"
run_case 1 "shape_findings_recommendation_contradicts_findings" node "$FINDINGS_CHECKER" "$SHAPE_DIR/recommendation-contradicts-findings.md"
expect_output 'Recommendation "APPROVED" contradicts P1 finding 1, which blocks approval' "shape_findings_recommendation_contradicts_findings_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/recommendation-contradicts-findings.md"

# FAIL: an older report's BLOCK token still maps onto REQUESTED_CHANGES and is compared with the status line.
RECOMMENDATION_LEGACY="$TMP_DIR/recommendation_legacy_block.md"
printf '## PR Review: x\n\nRecommendation: BLOCK, Score: 40/100\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$RECOMMENDATION_LEGACY"
run_case 1 "final_line_recommendation_legacy_block" node "$FINAL_LINE_CHECKER" "$RECOMMENDATION_LEGACY"
expect_output 'Recommendation "BLOCK" contradicts the final status line "Review status: APPROVED"' "final_line_recommendation_legacy_block_output" node "$FINAL_LINE_CHECKER" "$RECOMMENDATION_LEGACY"

# FAIL: changes requested on P2 findings alone, the score-only block a P2 never justifies.
RECOMMENDATION_P2_ONLY="$TMP_DIR/recommendation_p2_only.md"
printf '**Recommendation**: REQUESTED_CHANGES\n\n## Findings\n\n### P2 - Suggestion\n1. src/a.ts:1 Long function\n   - Case: x\n\n## Next Steps\n' > "$RECOMMENDATION_P2_ONLY"
run_case 1 "findings_recommendation_p2_only" node "$FINDINGS_CHECKER" "$RECOMMENDATION_P2_ONLY"
expect_output 'requests changes with no P0 or P1 finding, and a P2 never blocks' "findings_recommendation_p2_only_output" node "$FINDINGS_CHECKER" "$RECOMMENDATION_P2_ONLY"

# PASS: a template line that lists the tokens is not a verdict.
RECOMMENDATION_TEMPLATE="$TMP_DIR/recommendation_template.md"
printf 'Recommendation: APPROVED / REQUESTED_CHANGES / COMMENTED\n\nNot checked: nothing material\n\nReview status: COMMENTED\n' > "$RECOMMENDATION_TEMPLATE"
run_case 0 "final_line_recommendation_template" node "$FINAL_LINE_CHECKER" "$RECOMMENDATION_TEMPLATE"

# PASS: a prose Recommendation sub-line is not a verdict, wherever it sits.
run_case 0 "shape_final_line_recommendation_prose" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/recommendation-prose-next-steps.md"
run_case 0 "shape_findings_recommendation_prose" node "$FINDINGS_CHECKER" "$SHAPE_DIR/recommendation-prose-next-steps.md"

# FAIL: the Focused File Review shape puts its Recommendation inside the Findings section, and it is still read.
run_case 1 "shape_final_line_focused_file_recommendation" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/focused-file-recommendation-contradicts.md"
expect_output 'Recommendation "APPROVED" contradicts the final status line "Review status: REQUESTED_CHANGES"' "shape_final_line_focused_file_recommendation_output" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/focused-file-recommendation-contradicts.md"
run_case 1 "shape_findings_focused_file_recommendation" node "$FINDINGS_CHECKER" "$SHAPE_DIR/focused-file-recommendation-contradicts.md"

# FAIL: the final status line follows severity too, so an open P1 under COMMENTED and changes requested over P2 alone both fail.
run_case 1 "shape_findings_status_commented_open_p1" node "$FINDINGS_CHECKER" "$SHAPE_DIR/status-commented-open-p1.md"
expect_output 'Review status "COMMENTED" contradicts P1 finding 1, which blocks approval' "shape_findings_status_commented_open_p1_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/status-commented-open-p1.md"
run_case 1 "shape_findings_status_requested_changes_p2_only" node "$FINDINGS_CHECKER" "$SHAPE_DIR/status-requested-changes-p2-only.md"
expect_output 'Review status "REQUESTED_CHANGES" requests changes with no P0 or P1 finding, and a P2 never blocks' "shape_findings_status_requested_changes_p2_only_output" node "$FINDINGS_CHECKER" "$SHAPE_DIR/status-requested-changes-p2-only.md"

# The Rule sources line is optional, and when present it must keep its five groups and entry shapes.
run_case 1 "shape_final_line_rule_sources_malformed" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/rule-sources-malformed.md"
expect_output 'Rule sources line has a malformed Overrides entry: "review.function-length dropped by .sk-code/checklists/house.md"' "shape_final_line_rule_sources_malformed_output" node "$FINAL_LINE_CHECKER" "$SHAPE_DIR/rule-sources-malformed.md"
# FAIL: an upper-case rule id breaks the shared linter's id grammar, which the checker reads from the linter.
RULE_SOURCES_UPPERCASE_ID="$TMP_DIR/rule_sources_uppercase_id.md"
printf 'Rule sources: a.md. Overrides: Review.KISS none from a.md. Refused: none. Ignored: none. Conflicts: none\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$RULE_SOURCES_UPPERCASE_ID"
run_case 1 "final_line_rule_sources_uppercase_id" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_UPPERCASE_ID"
expect_output 'Rule sources line has a malformed Overrides entry: "Review.KISS none from a.md"' "final_line_rule_sources_uppercase_id_output" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_UPPERCASE_ID"
RULE_SOURCES_GROUP_MISSING="$TMP_DIR/rule_sources_group_missing.md"
printf 'Rule sources: a.md. Overrides: none. Ignored: none. Conflicts: none\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$RULE_SOURCES_GROUP_MISSING"
run_case 1 "final_line_rule_sources_group_missing" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_GROUP_MISSING"
expect_output 'Rule sources line does not name its five groups in order' "final_line_rule_sources_group_missing_output" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_GROUP_MISSING"
RULE_SOURCES_TWICE="$TMP_DIR/rule_sources_twice.md"
printf 'Rule sources: none\nRule sources: none\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$RULE_SOURCES_TWICE"
run_case 1 "final_line_rule_sources_twice" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_TWICE"
expect_output 'more than one "Rule sources:" line in the output' "final_line_rule_sources_twice_output" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_TWICE"
RULE_SOURCES_NONE="$TMP_DIR/rule_sources_none.md"
printf 'Rule sources: none\n\nNot checked: nothing material\n\nReview status: APPROVED\n' > "$RULE_SOURCES_NONE"
run_case 0 "final_line_rule_sources_none" node "$FINAL_LINE_CHECKER" "$RULE_SOURCES_NONE"

# FAIL: the resolver step stops filtering deleted paths, so one missing path would stop the whole explain call.
CASE_DELETED_FILTER="$TMP_DIR/deleted_path_filter"
seed_tree "$CASE_DELETED_FILTER"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("--diff-filter=d <range>","<range>"));' \
  "$CASE_DELETED_FILTER/.skilled/skills/sk-code/sk-code-review/SKILL.md"
run_case 1 "resolver_deleted_path_filter_dropped" node "$CHECKER" --root "$CASE_DELETED_FILTER"
expect_output 'missing exact invariant string: "git diff --name-only --diff-filter=d <range>"' "resolver_deleted_path_filter_dropped_output" node "$CHECKER" --root "$CASE_DELETED_FILTER"

# --mode-only in a repository that installed the skill somewhere else and has no AGENTS.md.
# The install folder is outside this checkout, and the run starts from the foreign root.
FOREIGN_REPO="$TMP_DIR/foreign_repo"
FOREIGN_HUB="$FOREIGN_REPO/.agents/skills/sk-code"
install_foreign_skill() {
  local rel
  rm -rf "$FOREIGN_REPO"
  mkdir -p "$FOREIGN_REPO"
  for rel in "${TARGETS[@]}"; do
    case "$rel" in
      .skilled/skills/sk-code/*)
        mkdir -p "$FOREIGN_HUB/$(dirname "${rel#.skilled/skills/sk-code/}")"
        cp "$REPO_ROOT/$rel" "$FOREIGN_HUB/${rel#.skilled/skills/sk-code/}"
        ;;
    esac
  done
  mkdir -p "$FOREIGN_HUB/sk-code-review/scripts" "$FOREIGN_HUB/shared/scripts"
  cp "$CHECKER" "$FINAL_LINE_CHECKER" "$FOREIGN_HUB/sk-code-review/scripts/"
  # The final-line checker reads the rule id grammar from the shared linter.
  cp "$REPO_ROOT/.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs" "$FOREIGN_HUB/shared/scripts/"
}
foreign_run() {
  ( cd "$FOREIGN_REPO" && node "$FOREIGN_HUB/sk-code-review/scripts/check-rule-copies.js" "$@" )
}
install_foreign_skill
run_case 0 "mode_only_foreign_repo" foreign_run --mode-only
expect_output 'OK: mode rule invariants present (7 exact-string file(s) + 1 Iron Law file(s)' "mode_only_foreign_repo_ok_output" foreign_run --mode-only
expect_output 'SKIPPED: AGENTS.md exact strings, AGENTS.md Iron Law line, AGENTS.md delivery prefix' "mode_only_foreign_repo_skipped_output" foreign_run --mode-only
run_case 1 "full_mode_foreign_repo_still_needs_agents_md" foreign_run
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("No review is approved while a P0 finding is unaddressed.","A review may be approved with a P0 finding open."));' \
  "$FOREIGN_HUB/sk-code-review/SKILL.md"
run_case 1 "mode_only_foreign_repo_floor_reworded" foreign_run --mode-only
expect_output 'extension floor missing from "### Extension Floors"' "mode_only_foreign_repo_floor_reworded_output" foreign_run --mode-only

if [[ "$failures" -gt 0 ]]; then
  printf '%s rule-canary test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All rule-canary test cases passed\n'
