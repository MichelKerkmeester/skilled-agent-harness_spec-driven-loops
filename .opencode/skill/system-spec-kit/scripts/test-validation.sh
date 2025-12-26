#!/usr/bin/env bash
#
# test-validation.sh - Test runner for validate-spec.sh
#
# Runs validation tests against fixture spec folders to verify
# correct behavior for valid and invalid specs.
#
# VERSION: 2.0.0
# CREATED: 2024-12-24
# UPDATED: 2024-12-24 - Added categories, timing, verbose mode, single test run
#
# USAGE: 
#   ./test-validation.sh              # Run all tests
#   ./test-validation.sh -v           # Verbose mode (show output for passing tests)
#   ./test-validation.sh -t NAME      # Run single test by name (partial match)
#   ./test-validation.sh -c CATEGORY  # Run tests in category only
#   ./test-validation.sh -l           # List all tests and categories
#   ./test-validation.sh -h           # Show help
#
# EXIT CODES:
#   0 - All tests passed
#   1 - One or more tests failed
#
# COMPATIBILITY: bash 3.2+ (macOS default)
#

set -uo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATOR="$SCRIPT_DIR/validate-spec.sh"
FIXTURES="$SCRIPT_DIR/test-fixtures"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Global counters
PASSED=0
FAILED=0
SKIPPED=0
TOTAL_TIME=0

# Options
VERBOSE=false
SINGLE_TEST=""
SINGLE_CATEGORY=""
LIST_ONLY=false

# Category tracking (bash 3.2 compatible - using simple variables)
CURRENT_CATEGORY=""
CURRENT_CAT_PASSED=0
CURRENT_CAT_FAILED=0
CURRENT_CAT_SKIPPED=0
CURRENT_CAT_TIME=0

# Category summaries (newline-separated: name|passed|failed|skipped|time)
CATEGORY_SUMMARIES=""

# Test registry for listing (newline-separated)
TEST_LIST=""
CATEGORY_LIST=""

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

show_help() {
    cat << 'EOF'
validate-spec.sh Test Runner v2.0.0

USAGE:
  ./test-validation.sh [OPTIONS]

OPTIONS:
  -v, --verbose     Show output for passing tests (default: only show failures)
  -t, --test NAME   Run single test matching NAME (partial match, case-insensitive)
  -c, --category CAT Run only tests in category CAT (partial match)
  -l, --list        List all tests and categories without running
  -h, --help        Show this help message

EXAMPLES:
  ./test-validation.sh                    # Run all tests
  ./test-validation.sh -v                 # Run all with verbose output
  ./test-validation.sh -t "Level 1"       # Run test containing "Level 1"
  ./test-validation.sh -c positive        # Run all positive tests
  ./test-validation.sh -l                 # List available tests

EXIT CODES:
  0 - All tests passed
  1 - One or more tests failed
EOF
}

# Format milliseconds to human-readable
format_time() {
    local ms=$1
    if [ "$ms" -lt 1000 ]; then
        echo "${ms}ms"
    else
        local seconds=$((ms / 1000))
        local remaining_ms=$((ms % 1000))
        printf "%d.%03ds" "$seconds" "$remaining_ms"
    fi
}

# Get current time in milliseconds (portable)
get_time_ms() {
    if command -v gdate &> /dev/null; then
        # macOS with coreutils
        gdate +%s%3N
    elif command -v perl &> /dev/null; then
        # Perl fallback (common on macOS)
        perl -MTime::HiRes=time -e 'printf "%.0f\n", time * 1000'
    else
        # Fallback: seconds only (multiply by 1000)
        echo "$(($(date +%s) * 1000))"
    fi
}

# Lowercase a string (bash 3.2 compatible)
to_lower() {
    echo "$1" | tr '[:upper:]' '[:lower:]'
}

# Case-insensitive contains check
contains_ci() {
    local haystack="$1"
    local needle="$2"
    local lower_haystack
    local lower_needle
    lower_haystack=$(to_lower "$haystack")
    lower_needle=$(to_lower "$needle")
    
    case "$lower_haystack" in
        *"$lower_needle"*) return 0 ;;
        *) return 1 ;;
    esac
}

# save_category_summary()
# Save current category stats to summary string
save_category_summary() {
    if [ -n "$CURRENT_CATEGORY" ]; then
        local total=$((CURRENT_CAT_PASSED + CURRENT_CAT_FAILED + CURRENT_CAT_SKIPPED))
        if [ "$total" -gt 0 ]; then
            local time_fmt
            time_fmt=$(format_time "$CURRENT_CAT_TIME")
            # Format: name|passed|failed|skipped|time
            local entry="${CURRENT_CATEGORY}|${CURRENT_CAT_PASSED}|${CURRENT_CAT_FAILED}|${CURRENT_CAT_SKIPPED}|${time_fmt}"
            if [ -n "$CATEGORY_SUMMARIES" ]; then
                CATEGORY_SUMMARIES="${CATEGORY_SUMMARIES}
${entry}"
            else
                CATEGORY_SUMMARIES="$entry"
            fi
        fi
    fi
}

# ============================================================================
# CATEGORY FUNCTIONS
# ============================================================================

# begin_category()
# Start a new test category
# Args: $1 - category name
# Returns: 0 if category should run, 1 if filtered out
begin_category() {
    local name="$1"
    
    # Save previous category stats
    save_category_summary
    
    # Reset for new category
    CURRENT_CATEGORY="$name"
    CURRENT_CAT_PASSED=0
    CURRENT_CAT_FAILED=0
    CURRENT_CAT_SKIPPED=0
    CURRENT_CAT_TIME=0
    
    # Track for listing
    if [ -n "$CATEGORY_LIST" ]; then
        CATEGORY_LIST="${CATEGORY_LIST}
${name}"
    else
        CATEGORY_LIST="$name"
    fi
    
    # Check if we should skip this category
    if [ -n "$SINGLE_CATEGORY" ]; then
        if ! contains_ci "$name" "$SINGLE_CATEGORY"; then
            return 1  # Skip this category
        fi
    fi
    
    echo ""
    echo -e "${BLUE}${BOLD}$name:${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    return 0
}

# ============================================================================
# TEST FUNCTIONS
# ============================================================================

# run_test()
# Run a single test case
# Args: $1 - test name, $2 - fixture folder, $3 - expected result (pass/warn/fail)
run_test() {
    local name="$1"
    local fixture="$2"
    local expect="$3"  # "pass", "warn", or "fail"
    
    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [ -n "$TEST_LIST" ]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi
    
    # If list-only mode, skip execution
    if [ "$LIST_ONLY" = true ]; then
        return
    fi
    
    # Check if we should run this test (single test filter)
    if [ -n "$SINGLE_TEST" ]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then
            return  # Skip this test silently
        fi
    fi
    
    # Check if category is filtered out
    if [ -n "$SINGLE_CATEGORY" ]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then
            return  # Skip this test silently
        fi
    fi
    
    local fixture_path="$FIXTURES/$fixture"
    
    # Start timing
    local start_time
    start_time=$(get_time_ms)
    
    # Check fixture exists
    if [ ! -d "$fixture_path" ]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found: $fixture)${NC} ${DIM}[${elapsed}ms]${NC}"
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    # Check validator exists
    if [ ! -f "$VALIDATOR" ]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(validator not found)${NC} ${DIM}[${elapsed}ms]${NC}"
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    # Run validator
    local exit_code=0
    local output
    output=$("$VALIDATOR" "$fixture_path" 2>&1) || exit_code=$?
    
    # End timing
    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    
    # Update timing
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))
    
    # Determine actual result based on exit code
    # Exit 0 = pass, Exit 1 = warn, Exit 2 = fail
    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac
    
    # Compare
    if [ "$actual" = "$expect" ]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        
        # Show output in verbose mode
        if [ "$VERBOSE" = true ] && [ -n "$output" ]; then
            echo -e "${DIM}  Output:${NC}"
            echo "$output" | sed 's/^/    /' | head -20
            local line_count
            line_count=$(echo "$output" | wc -l | tr -d ' ')
            if [ "$line_count" -gt 20 ]; then
                echo -e "    ${DIM}... ($((line_count - 20)) more lines)${NC}"
            fi
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual (exit code: $exit_code)"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

# run_test_with_flags()
# Run a test case with custom validator flags and/or environment variables
# Args: $1 - test name, $2 - fixture folder, $3 - expected result (pass/warn/fail)
#       $4 - validator flags (optional), $5 - env vars (optional)
run_test_with_flags() {
    local name="$1"
    local fixture="$2"
    local expect="$3"  # "pass", "warn", or "fail"
    local flags="${4:-}"
    local env_vars="${5:-}"
    
    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [ -n "$TEST_LIST" ]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi
    
    if [ "$LIST_ONLY" = true ]; then return; fi
    
    if [ -n "$SINGLE_TEST" ]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then return; fi
    fi
    
    if [ -n "$SINGLE_CATEGORY" ]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then return; fi
    fi
    
    local fixture_path="$FIXTURES/$fixture"
    local start_time
    start_time=$(get_time_ms)
    
    if [ ! -d "$fixture_path" ]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found: $fixture)${NC}"
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    if [ ! -f "$VALIDATOR" ]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(validator not found)${NC}"
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    local exit_code=0
    local output
    if [ -n "$env_vars" ]; then
        output=$(env $env_vars "$VALIDATOR" "$fixture_path" $flags 2>&1) || exit_code=$?
    else
        output=$("$VALIDATOR" "$fixture_path" $flags 2>&1) || exit_code=$?
    fi
    
    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))
    
    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac
    
    if [ "$actual" = "$expect" ]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        if [ "$VERBOSE" = true ] && [ -n "$output" ]; then
            echo -e "${DIM}  Output:${NC}"
            echo "$output" | sed 's/^/    /' | head -15
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual (exit code: $exit_code)"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

# run_test_json_valid()
# Run a test and verify JSON output is valid with required fields
# Args: $1 - test name, $2 - fixture folder, $3 - expected result
run_test_json_valid() {
    local name="$1"
    local fixture="$2"
    local expect="$3"
    
    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [ -n "$TEST_LIST" ]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi
    
    if [ "$LIST_ONLY" = true ]; then return; fi
    
    if [ -n "$SINGLE_TEST" ]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then return; fi
    fi
    
    if [ -n "$SINGLE_CATEGORY" ]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then return; fi
    fi
    
    local fixture_path="$FIXTURES/$fixture"
    local start_time
    start_time=$(get_time_ms)
    
    if [ ! -d "$fixture_path" ]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found)${NC}"
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    local exit_code=0
    local output
    output=$("$VALIDATOR" "$fixture_path" --json 2>&1) || exit_code=$?
    
    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))
    
    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac
    
    # Validate JSON structure using python3
    local json_valid=false
    if echo "$output" | python3 -m json.tool > /dev/null 2>&1; then
        json_valid=true
    fi
    
    # Check required fields exist
    local has_fields="False"
    if [ "$json_valid" = true ]; then
        has_fields=$(echo "$output" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    required = ['version', 'folder', 'passed', 'results', 'summary']
    print('True' if all(k in d for k in required) else 'False')
except: print('False')
" 2>/dev/null || echo "False")
    fi
    
    if [ "$actual" = "$expect" ] && [ "$json_valid" = true ] && [ "$has_fields" = "True" ]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        if [ "$VERBOSE" = true ]; then
            echo -e "${DIM}  JSON (formatted):${NC}"
            echo "$output" | python3 -m json.tool 2>/dev/null | sed 's/^/    /' | head -15
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        [ "$actual" != "$expect" ] && echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual"
        [ "$json_valid" != true ] && echo -e "  ${RED}JSON validation failed${NC}"
        [ "$has_fields" != "True" ] && echo -e "  ${RED}Missing required JSON fields${NC}"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

# run_test_quiet()
# Run a test and verify quiet mode produces minimal output
# Args: $1 - test name, $2 - fixture folder, $3 - expected result
run_test_quiet() {
    local name="$1"
    local fixture="$2"
    local expect="$3"
    
    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [ -n "$TEST_LIST" ]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi
    
    if [ "$LIST_ONLY" = true ]; then return; fi
    
    if [ -n "$SINGLE_TEST" ]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then return; fi
    fi
    
    if [ -n "$SINGLE_CATEGORY" ]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then return; fi
    fi
    
    local fixture_path="$FIXTURES/$fixture"
    local start_time
    start_time=$(get_time_ms)
    
    if [ ! -d "$fixture_path" ]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found)${NC}"
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    local exit_code=0
    local output
    output=$("$VALIDATOR" "$fixture_path" --quiet 2>&1) || exit_code=$?
    
    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))
    
    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac
    
    # Count output lines (quiet mode should have minimal output)
    local line_count
    line_count=$(echo -n "$output" | wc -l | tr -d ' ')
    
    # Quiet mode should produce 0-2 lines max
    if [ "$actual" = "$expect" ] && [ "$line_count" -le 2 ]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        if [ "$VERBOSE" = true ]; then
            echo -e "${DIM}  Output lines: ${line_count}${NC}"
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        [ "$actual" != "$expect" ] && echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual"
        [ "$line_count" -gt 2 ] && echo -e "  ${RED}Quiet mode produced too much output (${line_count} lines)${NC}"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

# ============================================================================
# PARSE ARGUMENTS
# ============================================================================

while [ $# -gt 0 ]; do
    case $1 in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -t|--test)
            SINGLE_TEST="$2"
            shift 2
            ;;
        -c|--category)
            SINGLE_CATEGORY="$2"
            shift 2
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use -h for help"
            exit 1
            ;;
    esac
done

# ============================================================================
# HEADER
# ============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD}  validate-spec.sh Test Suite v2.0${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

if [ "$LIST_ONLY" = true ]; then
    echo -e "${DIM}  Mode: List only${NC}"
elif [ -n "$SINGLE_TEST" ]; then
    echo -e "${DIM}  Filter: test matching \"$SINGLE_TEST\"${NC}"
elif [ -n "$SINGLE_CATEGORY" ]; then
    echo -e "${DIM}  Filter: category matching \"$SINGLE_CATEGORY\"${NC}"
fi

if [ "$VERBOSE" = true ]; then
    echo -e "${DIM}  Verbose: enabled${NC}"
fi

# ============================================================================
# TEST CASES
# ============================================================================

# -----------------------------------------------------------------------------
# POSITIVE TESTS
# -----------------------------------------------------------------------------
if begin_category "Positive Tests (should PASS)"; then
    run_test "Valid Level 1 spec folder" "valid-level1" "pass"
    run_test "Valid Level 2 spec folder" "valid-level2" "pass"
    run_test "Valid Level 3 spec folder" "valid-level3" "pass"
    run_test "Valid spec with scratch/ (ignored)" "with-scratch" "pass"
    run_test "Valid spec with templates/ (skipped)" "with-templates" "pass"
    run_test "Valid priority tags (P0, P1, P2)" "valid-priority-tags" "pass"
    run_test "Valid evidence on P0/P1 completed items" "valid-evidence" "pass"
    run_test "Valid anchors in memory files" "valid-anchors" "pass"
    run_test "L1 with extra files (notes.md, research.md)" "with-extra-files" "pass"
    run_test "Valid sections in all files (L3)" "valid-sections" "pass"
fi

# -----------------------------------------------------------------------------
# LEVEL_DECLARED RULE TESTS
# -----------------------------------------------------------------------------
if begin_category "Level Declaration Tests (should PASS)"; then
    run_test "Explicit level declaration (| **Level** | 2 |)" "level-explicit" "pass"
    run_test "Inferred level (no level field, inferred from files)" "level-inferred" "pass"
    run_test "Level 0 (invalid, falls back to inferred)" "level-zero" "pass"
    run_test "Level 5 (out of range, falls back to inferred)" "level-out-of-range" "pass"
    run_test "Level without bold (| Level | 2 |, falls back to inferred)" "level-no-bold" "pass"
fi

# -----------------------------------------------------------------------------
# WARNING TESTS
# -----------------------------------------------------------------------------
if begin_category "Warning Tests (should WARN)"; then
    run_test "Invalid priority tags (unknown tags)" "invalid-priority-tags" "warn"
    run_test "Missing evidence on P0/P1 completed items" "missing-evidence" "warn"
fi

# -----------------------------------------------------------------------------
# SECTIONS_PRESENT RULE TESTS
# -----------------------------------------------------------------------------
if begin_category "Sections Present Tests (should WARN on missing)"; then
    run_test "Missing spec.md sections (no Problem Statement)" "missing-spec-sections" "warn"
    run_test "Missing plan.md sections (no Architecture)" "missing-plan-sections" "warn"
    run_test "Missing checklist.md sections (no P0/P1)" "missing-checklist-sections" "warn"
    run_test "Missing decision-record.md sections (no Consequences)" "missing-decision-sections" "warn"
fi

# -----------------------------------------------------------------------------
# NEGATIVE TESTS
# -----------------------------------------------------------------------------
if begin_category "Negative Tests (should FAIL)"; then
    run_test "Missing required files (no spec.md)" "missing-required-files" "fail"
    run_test "Unfilled placeholders" "unfilled-placeholders" "fail"
    run_test "Invalid anchors (unclosed, mismatched, orphaned)" "invalid-anchors" "fail"
    run_test "Empty folder (all L1 files missing)" "empty-folder" "fail"
    run_test "Missing plan.md (L1)" "missing-plan" "fail"
    run_test "Missing tasks.md (L1)" "missing-tasks" "fail"
    run_test "Level 2 missing checklist.md" "level2-missing-checklist" "fail"
    run_test "Level 3 missing decision-record.md" "level3-missing-decision" "fail"
fi

# -----------------------------------------------------------------------------
# PRIORITY_TAGS EDGE CASE TESTS
# -----------------------------------------------------------------------------
if begin_category "Priority Tags Edge Cases"; then
    # PASS cases
    run_test "Inline priority tags only [P0]/[P1]/[P2]" "priority-inline-tags" "pass"
    run_test "Mixed priority headers and inline tags" "priority-mixed-format" "pass"
    
    run_test "Items after non-priority header inherit context" "priority-context-reset" "pass"
    
    # WARN cases - priority context not recognized
    run_test "Lowercase priority headers (## p0)" "priority-lowercase" "warn"
    run_test "Invalid P3/P4 priority levels" "priority-p3-invalid" "warn"
fi

# -----------------------------------------------------------------------------
# ANCHOR EDGE CASE TESTS
# -----------------------------------------------------------------------------
if begin_category "Anchor Edge Cases"; then
    # PASS cases - anchors in valid edge case scenarios
    run_test "Nested anchors (outer contains inner)" "anchors-nested" "pass"
    run_test "Empty memory/ directory (skipped)" "anchors-empty-memory" "pass"
    run_test "No memory/ directory (skipped)" "anchors-no-memory" "pass"
    run_test "Duplicate anchor IDs, each properly closed" "anchors-duplicate-ids" "pass"
    
    # FAIL cases - anchor errors in multi-file scenarios
    run_test "Multiple memory files, one with error" "anchors-multiple-files" "fail"
fi

# -----------------------------------------------------------------------------
# EVIDENCE_CITED EDGE CASE TESTS
# -----------------------------------------------------------------------------
if begin_category "Evidence Edge Cases"; then
    # PASS cases - all evidence patterns recognized
    run_test "All 5 evidence patterns recognized" "evidence-all-patterns" "pass"
    run_test "Case-insensitive evidence tags" "evidence-case-variations" "pass"
    run_test "P2 items exempt from evidence" "evidence-p2-exempt" "pass"
    run_test "Both checkmark formats (✓ ✔)" "evidence-checkmark-formats" "pass"
    
    # WARN cases - invalid patterns detected
    run_test "Wrong suffix (complete/done/finished)" "evidence-wrong-suffix" "warn"
fi

# -----------------------------------------------------------------------------
# PLACEHOLDER_FILLED EDGE CASE TESTS
# -----------------------------------------------------------------------------
if begin_category "Placeholder Edge Cases"; then
    # PASS cases - placeholders should be ignored in these contexts
    run_test "Placeholder in fenced code block (ignored)" "placeholder-in-codeblock" "pass"
    run_test "Placeholder in inline code backticks (ignored)" "placeholder-in-inline-code" "pass"
    run_test "Placeholder in memory/ directory (skipped)" "with-memory-placeholders" "pass"
    
    # FAIL cases - placeholders should be detected
    run_test "Multiple placeholders across files (all detected)" "multiple-placeholders" "fail"
    run_test "Placeholder case variations (detected)" "placeholder-case-variations" "fail"
fi

# -----------------------------------------------------------------------------
# CLI OPTIONS TESTS
# -----------------------------------------------------------------------------
if begin_category "CLI Options Tests"; then
    # Test 1: --json output format (valid JSON with required fields)
    run_test_json_valid "--json produces valid JSON with required fields" "valid-level1" "pass"
    
    # Test 2: --strict mode (warnings become errors)
    # invalid-priority-tags normally returns WARN (exit 1), with --strict should FAIL (exit 2)
    run_test_with_flags "--strict mode: warnings become errors" "invalid-priority-tags" "fail" "--strict"
    
    # Test 3: --quiet mode (minimal output)
    run_test_quiet "--quiet mode: minimal output" "valid-level1" "pass"
    
    # Test 4: .speckit.yaml configuration (config file detection)
    # Note: Config file IS detected and shown in output, but YAML parsing for 
    # rule severity overrides is not yet implemented in validate-spec.sh
    # This test verifies config file detection; expect WARN due to unimplemented parsing
    run_test "Config file: .speckit.yaml detected (parsing TODO)" "with-config" "warn"
    
    # Test 5: Environment variable override (SPECKIT_STRICT=true)
    # invalid-priority-tags normally returns WARN, with SPECKIT_STRICT=true should FAIL
    run_test_with_flags "Env var: SPECKIT_STRICT=true" "invalid-priority-tags" "fail" "" "SPECKIT_STRICT=true"
    
    # Test 6: Rule execution order configuration
    # with-rule-order has .speckit.yaml with rule_order setting
    run_test "Rule order: .speckit.yaml rule_order" "with-rule-order" "pass"
fi

# Save final category
save_category_summary

# ============================================================================
# LIST MODE OUTPUT
# ============================================================================

if [ "$LIST_ONLY" = true ]; then
    echo ""
    echo -e "${BLUE}${BOLD}Available Categories:${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    echo "$CATEGORY_LIST" | while IFS= read -r cat; do
        [ -n "$cat" ] && echo "  • $cat"
    done
    
    echo ""
    echo -e "${BLUE}${BOLD}Available Tests:${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    echo "$TEST_LIST" | while IFS= read -r test; do
        [ -n "$test" ] && echo "  • $test"
    done
    
    cat_count=$(echo "$CATEGORY_LIST" | grep -c . || echo 0)
    test_count=$(echo "$TEST_LIST" | grep -c . || echo 0)
    
    echo ""
    echo -e "${DIM}Total: ${test_count} tests in ${cat_count} categories${NC}"
    echo ""
    exit 0
fi

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD}  Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Per-category breakdown
echo -e "${BOLD}By Category:${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [ -n "$CATEGORY_SUMMARIES" ]; then
    echo "$CATEGORY_SUMMARIES" | while IFS='|' read -r cat_name cat_p cat_f cat_s cat_time; do
        [ -z "$cat_name" ] && continue
        cat_total=$((cat_p + cat_f + cat_s))
        
        # Color-code based on results
        if [ "$cat_f" -gt 0 ]; then
            echo -e "  ${RED}●${NC} ${cat_name}: ${GREEN}${cat_p}${NC}/${cat_total} passed ${DIM}(${cat_time})${NC}"
        elif [ "$cat_s" -eq "$cat_total" ]; then
            echo -e "  ${YELLOW}●${NC} ${cat_name}: ${YELLOW}${cat_s}${NC} skipped ${DIM}(${cat_time})${NC}"
        else
            echo -e "  ${GREEN}●${NC} ${cat_name}: ${GREEN}${cat_p}${NC}/${cat_total} passed ${DIM}(${cat_time})${NC}"
        fi
    done
fi

echo ""
echo -e "${BOLD}Totals:${NC}"
echo "─────────────────────────────────────────────────────────────────"

TOTAL=$((PASSED + FAILED + SKIPPED))
TOTAL_TIME_FMT=$(format_time "$TOTAL_TIME")

echo -e "  ${GREEN}Passed:${NC}  $PASSED"
echo -e "  ${RED}Failed:${NC}  $FAILED"
echo -e "  ${YELLOW}Skipped:${NC} $SKIPPED"
echo -e "  ─────────────"
echo -e "  Total:   $TOTAL"
echo -e "  ${DIM}Time:    $TOTAL_TIME_FMT${NC}"
echo ""

# ============================================================================
# EXIT
# ============================================================================

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}${BOLD}RESULT: FAILED${NC}"
    echo ""
    exit 1
elif [ $SKIPPED -eq $TOTAL ] && [ $TOTAL -gt 0 ]; then
    echo -e "${YELLOW}${BOLD}RESULT: SKIPPED${NC}"
    echo "Validator or fixtures not found. Ensure validate-spec.sh exists."
    echo ""
    exit 0
elif [ $TOTAL -eq 0 ]; then
    echo -e "${YELLOW}${BOLD}RESULT: NO TESTS RUN${NC}"
    echo "No tests matched the filter criteria."
    echo ""
    exit 0
else
    echo -e "${GREEN}${BOLD}RESULT: PASSED${NC}"
    echo ""
    exit 0
fi
