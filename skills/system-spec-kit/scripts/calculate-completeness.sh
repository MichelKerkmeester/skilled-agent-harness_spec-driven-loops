#!/usr/bin/env bash
#
# calculate-completeness.sh
# SpecKit Completeness Calculator
#
# PURPOSE:
#   Calculate the percentage of template placeholders that have been replaced
#   with real content in spec folders. Provides objective progress tracking.
#
# VERSION: 1.0.0
# CREATED: 2025-11-24
# SPEC: specs/003-speckit-rework/003-template-enforcement/
#
# USER STORY: US19 - Completeness Calculator
#
# USAGE:
#   calculate-completeness.sh [OPTIONS] [SPEC_FOLDER]
#
# OPTIONS:
#   --verbose, -v     Show detailed per-file breakdown
#   --json, -j        Output in JSON format
#   --file <path>, -f <path>  Calculate for single file
#   --quality, -q     Enable content quality checks (word count, required sections)
#   --help, -h        Show this help message
#
# EXAMPLES:
#   calculate-completeness.sh specs/001-feature-name/
#   calculate-completeness.sh --verbose specs/001-feature-name/
#   calculate-completeness.sh --json specs/001-feature-name/
#   calculate-completeness.sh --file specs/001-feature-name/spec.md
#   calculate-completeness.sh --quality specs/001-feature-name/
#

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

# Placeholder patterns (regex)
declare -a PLACEHOLDER_PATTERNS=(
  '\[PLACEHOLDER\]'
  '\[TODO:.*\]'
  '\[NEEDS CLARIFICATION:.*\]'
  '\[TBD\]'
  '\[XXX\]'
  '\[FIXME\]'
)

# Template files to analyze
declare -a TEMPLATE_FILES=(
  'spec.md'
  'plan.md'
  'tasks.md'
  'checklist.md'
  'research.md'
  'research-spike-*.md'
  'decision-record-*.md'
)

# ============================================================================
# QUALITY CHECK CONFIGURATION
# ============================================================================

# Minimum words per file type
MIN_WORDS_SPEC=100
MIN_WORDS_PLAN=80
MIN_WORDS_TASKS=50
MIN_WORDS_CHECKLIST=30
MIN_WORDS_RESEARCH=150
MIN_WORDS_DEFAULT=50

# Required sections per file type (patterns to grep for)
# Note: Using simple patterns for grep compatibility

# ============================================================================
# GLOBALS
# ============================================================================

VERBOSE=false
JSON_OUTPUT=false
QUALITY_CHECK=false
SINGLE_FILE=""
SPEC_FOLDER=""

# Quality warnings tracking
QUALITY_WARNINGS=()
QUALITY_WARNING_COUNT=0

# Statistics tracking (bash 3.2 compatible - using temp files)
# Use TMPDIR if available, fallback to /tmp (macOS compatibility)
STATS_DIR="${TMPDIR:-/tmp}/speckit-completeness-$$"
if ! mkdir -p "$STATS_DIR" 2>/dev/null; then
  echo "ERROR: Cannot create temp directory: $STATS_DIR" >&2
  exit 1
fi

# Cleanup on exit
trap 'rm -rf "$STATS_DIR"' EXIT

# Global stats
TOTAL_PLACEHOLDERS=0
TOTAL_LINES=0
OVERALL_PERCENTAGE=100
FILES_ANALYZED=0

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# show_help()
# Display usage information
show_help() {
  cat << 'EOF'
SpecKit Completeness Calculator

Calculate the percentage of template placeholders replaced with real content.

USAGE:
  calculate-completeness.sh [OPTIONS] [SPEC_FOLDER]

OPTIONS:
  --verbose, -v              Show detailed per-file breakdown
  --json, -j                 Output in JSON format
  --file <path>, -f <path>   Calculate for single file only
  --quality, -q              Enable content quality checks
  --help, -h                 Show this help message

EXAMPLES:
  # Calculate for entire spec folder
  calculate-completeness.sh specs/001-feature-name/

  # Verbose output with per-file details
  calculate-completeness.sh --verbose specs/001-feature-name/

  # JSON output for programmatic use
  calculate-completeness.sh --json specs/001-feature-name/

  # Calculate for single file
  calculate-completeness.sh --file specs/001-feature-name/spec.md

  # Enable quality checks (word count, required sections)
  calculate-completeness.sh --quality specs/001-feature-name/

EOF
  exit 0
}

# ============================================================================
# QUALITY CHECK FUNCTIONS
# ============================================================================

# add_quality_warning()
# Add a warning to the quality warnings list
# Args: $1 - warning message
add_quality_warning() {
  local warning="$1"
  QUALITY_WARNINGS+=("$warning")
  QUALITY_WARNING_COUNT=$((QUALITY_WARNING_COUNT + 1))
}

# get_min_words_for_file()
# Get minimum word count requirement for a file type
# Args: $1 - file path
# Returns: Minimum word count on stdout
get_min_words_for_file() {
  local file="$1"
  local basename
  basename=$(basename "$file" .md)

  case "$basename" in
    spec)
      echo "$MIN_WORDS_SPEC"
      ;;
    plan)
      echo "$MIN_WORDS_PLAN"
      ;;
    tasks)
      echo "$MIN_WORDS_TASKS"
      ;;
    checklist)
      echo "$MIN_WORDS_CHECKLIST"
      ;;
    research|research-spike-*)
      echo "$MIN_WORDS_RESEARCH"
      ;;
    *)
      echo "$MIN_WORDS_DEFAULT"
      ;;
  esac
}

# validate_word_count()
# Check if file meets minimum word count requirement
# Args: $1 - file path
# Returns: 0 if passes, 1 if fails (also adds warning)
validate_word_count() {
  local file="$1"

  if [ ! -f "$file" ]; then
    return 0
  fi

  local min_words
  min_words=$(get_min_words_for_file "$file")

  local word_count
  word_count=$(wc -w < "$file" | tr -d ' ')

  if [ "$word_count" -lt "$min_words" ]; then
    local basename
    basename=$(basename "$file")
    add_quality_warning "LOW WORD COUNT: $basename has only $word_count words (minimum: $min_words)"
    return 1
  fi
  return 0
}

# check_required_sections()
# Verify file contains required sections for its type
# Args: $1 - file path
# Returns: 0 if all sections present, 1 if missing (also adds warnings)
check_required_sections() {
  local file="$1"
  local missing_count=0

  if [ ! -f "$file" ]; then
    return 0
  fi

  local basename
  basename=$(basename "$file" .md)
  local file_display
  file_display=$(basename "$file")

  # Define required sections based on file type
  local -a required_sections=()

  case "$basename" in
    spec)
      required_sections=(
        "## 1\."
        "## 2\."
        "## 3\."
        "Success Criteria"
      )
      ;;
    plan)
      required_sections=(
        "## 1\."
        "## 2\."
        "Implementation"
        "Testing"
      )
      ;;
    tasks)
      required_sections=(
        "## "
        "\- \[ \]"
      )
      ;;
    checklist)
      required_sections=(
        "\- \[ \]"
      )
      ;;
    research|research-spike-*)
      required_sections=(
        "## "
        "Finding"
      )
      ;;
    *)
      # No specific requirements for other files
      return 0
      ;;
  esac

  # Check each required section
  for section in "${required_sections[@]}"; do
    if ! grep -qE "$section" "$file" 2>/dev/null; then
      # Clean up regex for display
      local display_section
      display_section=$(echo "$section" | sed 's/\\//g')
      add_quality_warning "MISSING SECTION: '$display_section' not found in $file_display"
      missing_count=$((missing_count + 1))
    fi
  done

  if [ "$missing_count" -gt 0 ]; then
    return 1
  fi
  return 0
}

# run_quality_checks()
# Run all quality checks on a file
# Args: $1 - file path
# Returns: 0 if all checks pass, 1 if any fail
run_quality_checks() {
  local file="$1"
  local failed=0

  validate_word_count "$file" || failed=1
  check_required_sections "$file" || failed=1

  return $failed
}

# count_placeholders()
# Count placeholder occurrences in a file
# Args: $1 - file path
# Returns: Count on stdout
count_placeholders() {
  local file="$1"
  local count=0

  if [ ! -f "$file" ]; then
    echo "0"
    return 0
  fi

  for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
    local matches
    matches=$(grep -c "$pattern" "$file" 2>/dev/null || echo "0")
    matches=$(echo "$matches" | tr -d '\n\r' | tr -d ' ')
    count=$((count + matches))
  done

  echo "$count"
}

# count_total_lines()
# Count non-empty, non-comment lines in a file
# Args: $1 - file path
# Returns: Count on stdout
count_total_lines() {
  local file="$1"

  if [ ! -f "$file" ]; then
    echo "0"
    return 0
  fi

  # Count lines that are not empty and not HTML comments
  grep -v '^[[:space:]]*$' "$file" | grep -v '^[[:space:]]*<!--' | wc -l | tr -d ' '
}

# calculate_file_completeness()
# Calculate completeness for a single file
# Args: $1 - file path
# Creates: Stats file in $STATS_DIR
calculate_file_completeness() {
  local file="$1"
  local basename
  basename=$(basename "$file")
  local stats_file="${STATS_DIR}/${basename}.stats"

  if [ ! -f "$file" ]; then
    echo "exists=false" > "$stats_file"
    return 0
  fi

  local placeholders
  placeholders=$(count_placeholders "$file")

  local total_lines
  total_lines=$(count_total_lines "$file")

  # Calculate percentage (avoid division by zero)
  local percentage=100
  if [ "$total_lines" -gt 0 ] && [ "$placeholders" -gt 0 ]; then
    # Percentage = (1 - placeholders/lines) * 100
    # Use bc for floating point math
    percentage=$(echo "scale=2; (1 - $placeholders / $total_lines) * 100" | bc)
    # Round to integer
    percentage=$(printf "%.0f" "$percentage")
  elif [ "$placeholders" -gt 0 ]; then
    # File has placeholders but no countable lines (edge case)
    percentage=0
  fi

  # Run quality checks if enabled
  local quality_passed=true
  if [ "$QUALITY_CHECK" = true ]; then
    run_quality_checks "$file" || quality_passed=false
  fi

  # Write stats to file
  cat > "$stats_file" << EOF
exists=true
placeholders=$placeholders
lines=$total_lines
percentage=$percentage
quality_passed=$quality_passed
EOF
}

# calculate_spec_completeness()
# Calculate completeness for entire spec folder
# Args: $1 - spec folder path
# Sets: Global variables
calculate_spec_completeness() {
  local spec_folder="$1"

  if [ ! -d "$spec_folder" ]; then
    echo "ERROR: Spec folder not found: ${spec_folder}" >&2
    return 1
  fi

  TOTAL_PLACEHOLDERS=0
  TOTAL_LINES=0
  FILES_ANALYZED=0

  # Analyze each template file type
  for template_pattern in "${TEMPLATE_FILES[@]}"; do
    # Find files matching pattern
    while IFS= read -r -d '' file; do
      calculate_file_completeness "$file"

      local basename
      basename=$(basename "$file")
      local stats_file="${STATS_DIR}/${basename}.stats"

      if [ -f "$stats_file" ]; then
        source "$stats_file"
        if [ "$exists" = "true" ]; then
          TOTAL_PLACEHOLDERS=$((TOTAL_PLACEHOLDERS + placeholders))
          TOTAL_LINES=$((TOTAL_LINES + lines))
          FILES_ANALYZED=$((FILES_ANALYZED + 1))
        fi
      fi
    done < <(find "$spec_folder" -maxdepth 1 -name "$template_pattern" -type f -print0 2>/dev/null)
  done

  # Calculate overall percentage
  OVERALL_PERCENTAGE=100
  if [ "$TOTAL_LINES" -gt 0 ] && [ "$TOTAL_PLACEHOLDERS" -gt 0 ]; then
    OVERALL_PERCENTAGE=$(echo "scale=2; (1 - $TOTAL_PLACEHOLDERS / $TOTAL_LINES) * 100" | bc)
    OVERALL_PERCENTAGE=$(printf "%.0f" "$OVERALL_PERCENTAGE")
  elif [ "$TOTAL_PLACEHOLDERS" -gt 0 ]; then
    OVERALL_PERCENTAGE=0
  fi
}

# ============================================================================
# OUTPUT FUNCTIONS
# ============================================================================

# output_text()
# Output results in human-readable text format
output_text() {
  echo ""
  echo "╔════════════════════════════════════════════════════════════════════╗"
  echo "║         SpecKit Completeness Calculator - Results                  ║"
  echo "╚════════════════════════════════════════════════════════════════════╝"
  echo ""

  if [ -n "$SINGLE_FILE" ]; then
    # Single file mode
    local basename
    basename=$(basename "$SINGLE_FILE")
    local stats_file="${STATS_DIR}/${basename}.stats"

    if [ ! -f "$stats_file" ]; then
      echo "File: ${SINGLE_FILE}"
      echo "Status: NOT FOUND"
      echo ""
      return 0
    fi

    source "$stats_file"

    if [ "$exists" = "false" ]; then
      echo "File: ${SINGLE_FILE}"
      echo "Status: NOT FOUND"
      echo ""
      return 0
    fi

    echo "File: ${SINGLE_FILE}"
    echo "Placeholders Remaining: ${placeholders}"
    echo "Total Content Lines: ${lines}"
    echo "Completion: ${percentage}%"
    echo ""

  else
    # Spec folder mode
    echo "Spec Folder: ${SPEC_FOLDER}"
    echo "Files Analyzed: ${FILES_ANALYZED}"
    echo ""
    echo "─────────────────────────────────────────────────────────────────────"
    echo "Overall Completion: ${OVERALL_PERCENTAGE}%"
    echo "─────────────────────────────────────────────────────────────────────"
    echo "Total Placeholders: ${TOTAL_PLACEHOLDERS}"
    echo "Total Content Lines: ${TOTAL_LINES}"
    echo ""

    if [ "$VERBOSE" = true ]; then
      echo "═════════════════════════════════════════════════════════════════════"
      echo "Per-File Breakdown:"
      echo "═════════════════════════════════════════════════════════════════════"
      echo ""

      # Show stats for each file found
      for stats_file in "$STATS_DIR"/*.stats; do
        [ -f "$stats_file" ] || continue

        source "$stats_file"
        if [ "$exists" = "true" ]; then
          local basename
          basename=$(basename "$stats_file" .stats)

          printf "%-30s %3d%% (%d placeholders, %d lines)\n" \
            "${basename}:" "$percentage" "$placeholders" "$lines"
        fi
      done
      echo ""
    fi
  fi

  # Completion status indicator
  local percentage
  if [ -n "$SINGLE_FILE" ]; then
    local basename
    basename=$(basename "$SINGLE_FILE")
    local stats_file="${STATS_DIR}/${basename}.stats"
    if [ -f "$stats_file" ]; then
      source "$stats_file"
    fi
    percentage=${percentage:-0}
  else
    percentage=${OVERALL_PERCENTAGE}
  fi

  echo "─────────────────────────────────────────────────────────────────────"
  if [ "$percentage" -ge 90 ]; then
    echo "Status: ✅ Excellent - Nearly complete"
  elif [ "$percentage" -ge 70 ]; then
    echo "Status: ✅ Good - Well underway"
  elif [ "$percentage" -ge 50 ]; then
    echo "Status: ⚠️  Fair - Half complete"
  elif [ "$percentage" -ge 30 ]; then
    echo "Status: ⚠️  Poor - Needs more work"
  else
    echo "Status: ❌ Very Low - Just starting"
  fi
  echo "─────────────────────────────────────────────────────────────────────"
  echo ""

  # Display quality warnings if quality checks were enabled
  if [ "$QUALITY_CHECK" = true ] && [ "$QUALITY_WARNING_COUNT" -gt 0 ]; then
    echo "═════════════════════════════════════════════════════════════════════"
    echo "Quality Warnings ($QUALITY_WARNING_COUNT):"
    echo "═════════════════════════════════════════════════════════════════════"
    echo ""
    for warning in "${QUALITY_WARNINGS[@]}"; do
      echo "  ⚠️  $warning"
    done
    echo ""
    echo "─────────────────────────────────────────────────────────────────────"
    echo "Quality Status: ❌ Issues found - Address warnings above"
    echo "─────────────────────────────────────────────────────────────────────"
    echo ""
  elif [ "$QUALITY_CHECK" = true ]; then
    echo "─────────────────────────────────────────────────────────────────────"
    echo "Quality Status: ✅ All quality checks passed"
    echo "─────────────────────────────────────────────────────────────────────"
    echo ""
  fi
}

# output_json()
# Output results in JSON format
output_json() {
  if [ -n "$SINGLE_FILE" ]; then
    # Single file JSON output
    local basename
    basename=$(basename "$SINGLE_FILE")
    local stats_file="${STATS_DIR}/${basename}.stats"

    local exists=false
    local placeholders=0
    local lines=0
    local percentage=0

    if [ -f "$stats_file" ]; then
      source "$stats_file"
    fi

    # Build quality section for JSON if enabled
    local quality_json=""
    if [ "$QUALITY_CHECK" = true ]; then
      quality_json=",
  \"quality\": {
    \"enabled\": true,
    \"warning_count\": ${QUALITY_WARNING_COUNT},
    \"passed\": $([ "$QUALITY_WARNING_COUNT" -eq 0 ] && echo "true" || echo "false"),
    \"warnings\": ["
      local first_warn=true
      for warning in "${QUALITY_WARNINGS[@]}"; do
        if [ "$first_warn" = false ]; then
          quality_json+=","
        fi
        first_warn=false
        # Escape quotes in warning message
        local escaped_warning
        escaped_warning=$(echo "$warning" | sed 's/"/\\"/g')
        quality_json+="\"${escaped_warning}\""
      done
      quality_json+="]
  }"
    fi

    cat << EOF
{
  "file": "${SINGLE_FILE}",
  "exists": ${exists},
  "placeholders": ${placeholders},
  "total_lines": ${lines},
  "completion_percentage": ${percentage}${quality_json}
}
EOF
  else
    # Spec folder JSON output
    echo "{"
    echo "  \"spec_folder\": \"${SPEC_FOLDER}\","
    echo "  \"files_analyzed\": ${FILES_ANALYZED},"
    echo "  \"overall_completion\": ${OVERALL_PERCENTAGE},"
    echo "  \"total_placeholders\": ${TOTAL_PLACEHOLDERS},"
    echo "  \"total_lines\": ${TOTAL_LINES},"

    if [ "$VERBOSE" = true ]; then
      echo "  \"files\": {"

      local first=true
      for stats_file in "$STATS_DIR"/*.stats; do
        [ -f "$stats_file" ] || continue

        source "$stats_file"
        if [ "$exists" = "true" ]; then
          local basename
          basename=$(basename "$stats_file" .stats)

          if [ "$first" = false ]; then
            echo ","
          fi
          first=false

          echo -n "    \"${basename}\": {"
          echo -n "\"completion\": ${percentage}, "
          echo -n "\"placeholders\": ${placeholders}, "
          echo -n "\"lines\": ${lines}"
          echo -n "}"
        fi
      done

      echo ""
      echo "  },"
    else
      echo "  \"files\": {},"
    fi

    # Add quality section if enabled
    if [ "$QUALITY_CHECK" = true ]; then
      echo "  \"quality\": {"
      echo "    \"enabled\": true,"
      echo "    \"warning_count\": ${QUALITY_WARNING_COUNT},"
      echo "    \"passed\": $([ "$QUALITY_WARNING_COUNT" -eq 0 ] && echo "true" || echo "false"),"
      echo -n "    \"warnings\": ["

      local first_warn=true
      for warning in "${QUALITY_WARNINGS[@]}"; do
        if [ "$first_warn" = false ]; then
          echo -n ","
        fi
        first_warn=false
        # Escape quotes in warning message
        local escaped_warning
        escaped_warning=$(echo "$warning" | sed 's/"/\\"/g')
        echo -n "\"${escaped_warning}\""
      done

      echo "]"
      echo "  }"
    else
      echo "  \"quality\": {"
      echo "    \"enabled\": false"
      echo "  }"
    fi

    echo "}"
  fi
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose|-v)
      VERBOSE=true
      shift
      ;;
    --json|-j)
      JSON_OUTPUT=true
      shift
      ;;
    --quality|-q)
      QUALITY_CHECK=true
      shift
      ;;
    --file|-f)
      SINGLE_FILE="$2"
      shift 2
      ;;
    --help|-h)
      show_help
      ;;
    *)
      if [ -z "$SPEC_FOLDER" ] && [ -z "$SINGLE_FILE" ]; then
        SPEC_FOLDER="$1"
      else
        echo "ERROR: Unexpected argument: $1" >&2
        echo "Use --help for usage information" >&2
        exit 1
      fi
      shift
      ;;
  esac
done

# Validate inputs
if [ -z "$SPEC_FOLDER" ] && [ -z "$SINGLE_FILE" ]; then
  echo "ERROR: Either spec folder or --file must be specified" >&2
  echo "Use --help for usage information" >&2
  exit 1
fi

# Check for bc (required for percentage calculations)
if ! command -v bc &>/dev/null; then
  echo "ERROR: 'bc' command not found. Install bc for percentage calculations." >&2
  exit 1
fi

# Calculate completeness
if [ -n "$SINGLE_FILE" ]; then
  calculate_file_completeness "$SINGLE_FILE"
else
  calculate_spec_completeness "$SPEC_FOLDER"
fi

# Output results
if [ "$JSON_OUTPUT" = true ]; then
  output_json
else
  output_text
fi

exit 0
