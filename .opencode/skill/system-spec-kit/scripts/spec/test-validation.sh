#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: VALIDATION TEST SUITE
# ───────────────────────────────────────────────────────────────
# Tests validation rules and expected exit code behavior.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATE_SCRIPT="${SCRIPT_DIR}/../spec/validate.sh"
TEST_DIR="/tmp/speckit-validation-tests"
TEST_RESULTS="${TEST_DIR}/test-results.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Setup test environment
setup_test_env() {
  rm -rf "${TEST_DIR}"
  mkdir -p "${TEST_DIR}"
  echo "Validation Test Suite - $(date)" > "${TEST_RESULTS}"
  echo "=====================================" >> "${TEST_RESULTS}"
  echo ""
}

# Cleanup test environment
cleanup_test_env() {
  # Keep test results for inspection
  echo ""
  echo "Test results saved to: ${TEST_RESULTS}"
}

# Run a test case
run_test() {
  local test_name="$1"
  local expected_exit_code="$2"
  local test_spec_folder="$3"
  local actual_exit_code=0
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -n "  Testing: ${test_name}... "
  echo "" >> "${TEST_RESULTS}"
  echo "TEST: ${test_name}" >> "${TEST_RESULTS}"
  echo "Expected exit code: ${expected_exit_code}" >> "${TEST_RESULTS}"
  
  # Run validation
  set +e
  "${VALIDATE_SCRIPT}" "${test_spec_folder}" >> "${TEST_RESULTS}" 2>&1
  actual_exit_code=$?
  set -e
  
  echo "Actual exit code: ${actual_exit_code}" >> "${TEST_RESULTS}"
  
  # Check result
  if [ "${actual_exit_code}" -eq "${expected_exit_code}" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "Result: PASS" >> "${TEST_RESULTS}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}✗ FAIL${NC} (expected ${expected_exit_code}, got ${actual_exit_code})"
    echo "Result: FAIL" >> "${TEST_RESULTS}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

# Create test spec folder: all valid
create_test_valid() {
  local folder="${TEST_DIR}/001-test-valid"
  mkdir -p "${folder}"
  
  cat > "${folder}/spec.md" << 'EOF'
# Test Spec

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
Valid content
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## Problem
Valid content
<!-- /ANCHOR:problem -->
EOF

  cat > "${folder}/plan.md" << 'EOF'
# Test Plan

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:approach -->
## Approach
Valid content
<!-- /ANCHOR:approach -->
EOF

  cat > "${folder}/tasks.md" << 'EOF'
# Test Tasks

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:tasks -->
## Tasks
Valid content
<!-- /ANCHOR:tasks -->
EOF

  cat > "${folder}/implementation-summary.md" << 'EOF'
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:summary -->
## Summary
Valid content
<!-- /ANCHOR:summary -->
EOF
  
  echo "${folder}"
}

# Create test spec folder: missing template header
create_test_missing_header() {
  local folder="${TEST_DIR}/002-missing-header"
  mkdir -p "${folder}"
  
  cat > "${folder}/spec.md" << 'EOF'
# Test Spec

<!-- SPECKIT_LEVEL: 1 -->
<!-- Missing SPECKIT_TEMPLATE_SOURCE header -->

<!-- ANCHOR:metadata -->
## Metadata
Valid content
<!-- /ANCHOR:metadata -->
EOF

  cat > "${folder}/plan.md" << 'EOF'
# Test Plan
<!-- Missing header completely -->

<!-- ANCHOR:approach -->
## Approach
Valid content
<!-- /ANCHOR:approach -->
EOF

  cat > "${folder}/tasks.md" << 'EOF'
# Test Tasks

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:tasks -->
## Tasks
Valid content
<!-- /ANCHOR:tasks -->
EOF

  cat > "${folder}/implementation-summary.md" << 'EOF'
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:summary -->
## Summary
Valid content
<!-- /ANCHOR:summary -->
EOF
  
  echo "${folder}"
}

# Create test spec folder: missing ANCHOR tags
create_test_missing_anchors() {
  local folder="${TEST_DIR}/003-missing-anchors"
  mkdir -p "${folder}"
  
  cat > "${folder}/spec.md" << 'EOF'
# Test Spec

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## Metadata
No ANCHOR tags at all

## Problem
Still no ANCHOR tags
EOF

  cat > "${folder}/plan.md" << 'EOF'
# Test Plan

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:approach -->
## Approach
Valid content
<!-- /ANCHOR:approach -->
EOF

  cat > "${folder}/tasks.md" << 'EOF'
# Test Tasks

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:tasks -->
## Tasks
Valid content
<!-- /ANCHOR:tasks -->
EOF

  cat > "${folder}/implementation-summary.md" << 'EOF'
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:summary -->
## Summary
Valid content
<!-- /ANCHOR:summary -->
EOF
  
  echo "${folder}"
}

# Create test spec folder: unclosed ANCHOR tag
create_test_unclosed_anchor() {
  local folder="${TEST_DIR}/004-unclosed-anchor"
  mkdir -p "${folder}"
  
  cat > "${folder}/spec.md" << 'EOF'
# Test Spec

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
Valid content
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## Problem
Missing closing tag!
EOF

  cat > "${folder}/plan.md" << 'EOF'
# Test Plan

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:approach -->
## Approach
Valid content
<!-- /ANCHOR:approach -->
EOF

  cat > "${folder}/tasks.md" << 'EOF'
# Test Tasks

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:tasks -->
## Tasks
Valid content
<!-- /ANCHOR:tasks -->
EOF

  cat > "${folder}/implementation-summary.md" << 'EOF'
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:summary -->
## Summary
Valid content
<!-- /ANCHOR:summary -->
EOF
  
  echo "${folder}"
}

# Create test spec folder: empty file
create_test_empty_file() {
  local folder="${TEST_DIR}/005-empty-file"
  mkdir -p "${folder}"
  
  touch "${folder}/spec.md"  # Empty file
  
  cat > "${folder}/plan.md" << 'EOF'
# Test Plan

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:approach -->
## Approach
Valid content
<!-- /ANCHOR:approach -->
EOF

  cat > "${folder}/tasks.md" << 'EOF'
# Test Tasks

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:tasks -->
## Tasks
Valid content
<!-- /ANCHOR:tasks -->
EOF

  cat > "${folder}/implementation-summary.md" << 'EOF'
# Implementation Summary

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:summary -->
## Summary
Valid content
<!-- /ANCHOR:summary -->
EOF
  
  echo "${folder}"
}

# Main test execution
main() {
  echo "Validation Test Suite"
  echo "===================="
  echo ""
  
  setup_test_env
  
  echo "## Exit Code Tests"
  echo ""
  
  # Test 1: Valid spec folder with minimal content (exit 1 - warnings acceptable)
  test_folder=$(create_test_valid)
  run_test "Valid spec folder - warnings allowed" 1 "${test_folder}"
  
  # Test 2: Missing template header (exit 2 - errors)
  test_folder=$(create_test_missing_header)
  run_test "Missing template header - should error" 2 "${test_folder}"
  
  # Test 3: Missing ANCHOR tags (exit 2 - errors)
  test_folder=$(create_test_missing_anchors)
  run_test "Missing ANCHOR tags - should error" 2 "${test_folder}"
  
  # Test 4: Unclosed ANCHOR tag (exit 2 - errors)
  test_folder=$(create_test_unclosed_anchor)
  run_test "Unclosed ANCHOR tag - should error" 2 "${test_folder}"
  
  # Test 5: Empty file (exit 2 - errors)
  test_folder=$(create_test_empty_file)
  run_test "Empty spec file - should error" 2 "${test_folder}"
  
  # Summary
  echo ""
  echo "## Test Summary"
  echo "==============="
  echo "Total tests: ${TOTAL_TESTS}"
  echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
  echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"
  echo ""
  
  echo "" >> "${TEST_RESULTS}"
  echo "SUMMARY" >> "${TEST_RESULTS}"
  echo "=======" >> "${TEST_RESULTS}"
  echo "Total: ${TOTAL_TESTS}" >> "${TEST_RESULTS}"
  echo "Passed: ${PASSED_TESTS}" >> "${TEST_RESULTS}"
  echo "Failed: ${FAILED_TESTS}" >> "${TEST_RESULTS}"
  
  cleanup_test_env
  
  if [ ${FAILED_TESTS} -gt 0 ]; then
    exit 1
  fi
  
  exit 0
}

main "$@"
