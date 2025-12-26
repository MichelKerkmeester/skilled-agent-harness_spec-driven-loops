#!/usr/bin/env bash
#
# recommend-level.sh
# SpecKit Level Recommendation Algorithm
#
# PURPOSE:
#   Automated level recommendation that replaces soft LOC guidance with
#   deterministic scoring. Analyzes task complexity factors and recommends
#   the appropriate SpecKit level (0-3).
#
# VERSION: 1.0.0
# CREATED: 2025-12-13
#
# USAGE:
#   recommend-level.sh [OPTIONS]
#
# OPTIONS:
#   --loc <number>       Lines of code estimate
#   --files <number>     Number of files to modify
#   --auth               Task involves authentication/authorization changes
#   --api                Task involves API changes
#   --db                 Task involves database changes
#   --architectural      Task involves architectural changes
#   --json, -j           Output in JSON format
#   --help, -h           Show this help message
#
# EXAMPLES:
#   recommend-level.sh --loc 50 --files 2
#   recommend-level.sh --loc 200 --files 5 --api --db
#   recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural
#   recommend-level.sh --loc 100 --files 3 --json
#
# SCORING ALGORITHM:
#   LOC Factor:        35% weight (0-35 points)
#   File Count:        20% weight (0-20 points)
#   Risk Factors:      25% weight (auth +10, api +8, db +7)
#   Complexity:        20% weight (architectural +20)
#
# LEVEL MAPPING:
#   <25 points  -> Level 0 (Quick)
#   25-44       -> Level 1 (Baseline)
#   45-69       -> Level 2 (Verification)
#   70+         -> Level 3 (Full)
#

set -euo pipefail

# ============================================================================
# CONFIGURATION
# ============================================================================

# Weight configuration (percentages)
readonly WEIGHT_LOC=35
readonly WEIGHT_FILES=20
readonly WEIGHT_RISK=25
readonly WEIGHT_COMPLEXITY=20

# Risk factor points (within WEIGHT_RISK budget)
readonly POINTS_AUTH=10
readonly POINTS_API=8
readonly POINTS_DB=7

# Complexity points (within WEIGHT_COMPLEXITY budget)
readonly POINTS_ARCHITECTURAL=20

# LOC thresholds for scoring
readonly LOC_THRESHOLD_LOW=50
readonly LOC_THRESHOLD_MED=150
readonly LOC_THRESHOLD_HIGH=400
readonly LOC_THRESHOLD_MAX=1000

# File count thresholds
readonly FILES_THRESHOLD_LOW=3
readonly FILES_THRESHOLD_MED=8
readonly FILES_THRESHOLD_HIGH=15
readonly FILES_THRESHOLD_MAX=30

# Level thresholds
readonly LEVEL_0_MAX=24
readonly LEVEL_1_MAX=44
readonly LEVEL_2_MAX=69
# 70+ = Level 3

# ============================================================================
# GLOBALS
# ============================================================================

LOC=0
FILES=0
HAS_AUTH=false
HAS_API=false
HAS_DB=false
HAS_ARCHITECTURAL=false
JSON_OUTPUT=false

# Calculated scores
SCORE_LOC=0
SCORE_FILES=0
SCORE_RISK=0
SCORE_COMPLEXITY=0
TOTAL_SCORE=0
RECOMMENDED_LEVEL=0
LEVEL_NAME=""
CONFIDENCE=0

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# show_help()
# Display usage information
show_help() {
  cat << 'EOF'
SpecKit Level Recommendation Algorithm

Analyzes task complexity factors and recommends the appropriate SpecKit level.

USAGE:
  recommend-level.sh [OPTIONS]

OPTIONS:
  --loc <number>       Lines of code estimate (required)
  --files <number>     Number of files to modify (required)
  --auth               Task involves authentication/authorization changes
  --api                Task involves API changes
  --db                 Task involves database changes
  --architectural      Task involves architectural changes
  --json, -j           Output in JSON format
  --help, -h           Show this help message

EXAMPLES:
  # Simple task
  recommend-level.sh --loc 50 --files 2

  # Medium complexity with API
  recommend-level.sh --loc 200 --files 5 --api

  # Complex full-stack feature
  recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural

  # JSON output for scripting
  recommend-level.sh --loc 100 --files 3 --json

LEVELS:
  Level 0 (Quick):        <25 points  - Trivial changes, no formal spec needed
  Level 1 (Baseline):     25-44       - Standard tasks, basic documentation
  Level 2 (Verification): 45-69       - Complex tasks, full verification needed
  Level 3 (Full):         70+         - Critical/architectural, comprehensive docs

EOF
  exit 0
}

# calculate_loc_score()
# Calculate points for LOC factor (0-35 points)
# Uses linear interpolation between thresholds
calculate_loc_score() {
  local loc=$1
  local score=0

  if [ "$loc" -le "$LOC_THRESHOLD_LOW" ]; then
    # 0-50 LOC: 0-8 points (linear)
    score=$((loc * 8 / LOC_THRESHOLD_LOW))
  elif [ "$loc" -le "$LOC_THRESHOLD_MED" ]; then
    # 51-150 LOC: 8-18 points
    local range=$((LOC_THRESHOLD_MED - LOC_THRESHOLD_LOW))
    local offset=$((loc - LOC_THRESHOLD_LOW))
    score=$((8 + (offset * 10 / range)))
  elif [ "$loc" -le "$LOC_THRESHOLD_HIGH" ]; then
    # 151-400 LOC: 18-28 points
    local range=$((LOC_THRESHOLD_HIGH - LOC_THRESHOLD_MED))
    local offset=$((loc - LOC_THRESHOLD_MED))
    score=$((18 + (offset * 10 / range)))
  elif [ "$loc" -le "$LOC_THRESHOLD_MAX" ]; then
    # 401-1000 LOC: 28-35 points
    local range=$((LOC_THRESHOLD_MAX - LOC_THRESHOLD_HIGH))
    local offset=$((loc - LOC_THRESHOLD_HIGH))
    score=$((28 + (offset * 7 / range)))
  else
    # >1000 LOC: max points
    score=$WEIGHT_LOC
  fi

  # Ensure score doesn't exceed weight
  if [ "$score" -gt "$WEIGHT_LOC" ]; then
    score=$WEIGHT_LOC
  fi

  echo "$score"
}

# calculate_files_score()
# Calculate points for file count factor (0-20 points)
calculate_files_score() {
  local files=$1
  local score=0

  if [ "$files" -le "$FILES_THRESHOLD_LOW" ]; then
    # 1-3 files: 0-5 points
    score=$((files * 5 / FILES_THRESHOLD_LOW))
  elif [ "$files" -le "$FILES_THRESHOLD_MED" ]; then
    # 4-8 files: 5-10 points
    local range=$((FILES_THRESHOLD_MED - FILES_THRESHOLD_LOW))
    local offset=$((files - FILES_THRESHOLD_LOW))
    score=$((5 + (offset * 5 / range)))
  elif [ "$files" -le "$FILES_THRESHOLD_HIGH" ]; then
    # 9-15 files: 10-16 points
    local range=$((FILES_THRESHOLD_HIGH - FILES_THRESHOLD_MED))
    local offset=$((files - FILES_THRESHOLD_MED))
    score=$((10 + (offset * 6 / range)))
  elif [ "$files" -le "$FILES_THRESHOLD_MAX" ]; then
    # 16-30 files: 16-20 points
    local range=$((FILES_THRESHOLD_MAX - FILES_THRESHOLD_HIGH))
    local offset=$((files - FILES_THRESHOLD_HIGH))
    score=$((16 + (offset * 4 / range)))
  else
    # >30 files: max points
    score=$WEIGHT_FILES
  fi

  # Ensure score doesn't exceed weight
  if [ "$score" -gt "$WEIGHT_FILES" ]; then
    score=$WEIGHT_FILES
  fi

  echo "$score"
}

# calculate_risk_score()
# Calculate points for risk factors (0-25 points)
calculate_risk_score() {
  local score=0

  if [ "$HAS_AUTH" = true ]; then
    score=$((score + POINTS_AUTH))
  fi

  if [ "$HAS_API" = true ]; then
    score=$((score + POINTS_API))
  fi

  if [ "$HAS_DB" = true ]; then
    score=$((score + POINTS_DB))
  fi

  # Cap at WEIGHT_RISK
  if [ "$score" -gt "$WEIGHT_RISK" ]; then
    score=$WEIGHT_RISK
  fi

  echo "$score"
}

# calculate_complexity_score()
# Calculate points for complexity factors (0-20 points)
calculate_complexity_score() {
  local score=0

  if [ "$HAS_ARCHITECTURAL" = true ]; then
    score=$((score + POINTS_ARCHITECTURAL))
  fi

  # Cap at WEIGHT_COMPLEXITY
  if [ "$score" -gt "$WEIGHT_COMPLEXITY" ]; then
    score=$WEIGHT_COMPLEXITY
  fi

  echo "$score"
}

# determine_level()
# Map total score to recommended level
determine_level() {
  local score=$1

  if [ "$score" -le "$LEVEL_0_MAX" ]; then
    RECOMMENDED_LEVEL=0
    LEVEL_NAME="Quick"
  elif [ "$score" -le "$LEVEL_1_MAX" ]; then
    RECOMMENDED_LEVEL=1
    LEVEL_NAME="Baseline"
  elif [ "$score" -le "$LEVEL_2_MAX" ]; then
    RECOMMENDED_LEVEL=2
    LEVEL_NAME="Verification"
  else
    RECOMMENDED_LEVEL=3
    LEVEL_NAME="Full"
  fi
}

# calculate_confidence()
# Calculate confidence percentage based on input completeness
calculate_confidence() {
  local base_confidence=60
  local bonus=0

  # More inputs = higher confidence
  if [ "$LOC" -gt 0 ]; then
    bonus=$((bonus + 15))
  fi

  if [ "$FILES" -gt 0 ]; then
    bonus=$((bonus + 15))
  fi

  # Risk factors add confidence when specified
  local risk_factors=0
  if [ "$HAS_AUTH" = true ]; then risk_factors=$((risk_factors + 1)); fi
  if [ "$HAS_API" = true ]; then risk_factors=$((risk_factors + 1)); fi
  if [ "$HAS_DB" = true ]; then risk_factors=$((risk_factors + 1)); fi
  if [ "$HAS_ARCHITECTURAL" = true ]; then risk_factors=$((risk_factors + 1)); fi

  # Each risk factor adds some confidence (shows thoroughness)
  bonus=$((bonus + risk_factors * 2))

  # If score is near threshold boundaries, reduce confidence
  local distance_to_boundary=100
  local boundaries=("$LEVEL_0_MAX" "$LEVEL_1_MAX" "$LEVEL_2_MAX")
  for boundary in "${boundaries[@]}"; do
    local diff=$((TOTAL_SCORE - boundary))
    if [ "$diff" -lt 0 ]; then diff=$((-diff)); fi
    if [ "$diff" -lt "$distance_to_boundary" ]; then
      distance_to_boundary=$diff
    fi
  done

  # Reduce confidence if very close to a boundary (within 5 points)
  if [ "$distance_to_boundary" -le 5 ]; then
    bonus=$((bonus - 10))
  fi

  CONFIDENCE=$((base_confidence + bonus))

  # Cap at 95% (never 100% certain)
  if [ "$CONFIDENCE" -gt 95 ]; then
    CONFIDENCE=95
  fi

  # Minimum 50%
  if [ "$CONFIDENCE" -lt 50 ]; then
    CONFIDENCE=50
  fi
}

# ============================================================================
# OUTPUT FUNCTIONS
# ============================================================================

# output_text()
# Output results in human-readable text format
output_text() {
  echo ""
  echo "Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})"
  echo "Score: ${TOTAL_SCORE}/100 | Confidence: ${CONFIDENCE}%"
  echo ""
  echo "Breakdown:"
  echo "- LOC (${LOC}): +${SCORE_LOC} points"
  echo "- Files (${FILES}): +${SCORE_FILES} points"
  echo -n "- API changes: "
  if [ "$HAS_API" = true ]; then
    echo "+${POINTS_API} points"
  else
    echo "+0 points"
  fi
  echo -n "- Auth changes: "
  if [ "$HAS_AUTH" = true ]; then
    echo "+${POINTS_AUTH} points"
  else
    echo "+0 points"
  fi
  echo -n "- DB changes: "
  if [ "$HAS_DB" = true ]; then
    echo "+${POINTS_DB} points"
  else
    echo "+0 points"
  fi
  echo -n "- Architectural: "
  if [ "$HAS_ARCHITECTURAL" = true ]; then
    echo "+${POINTS_ARCHITECTURAL} points"
  else
    echo "+0 points"
  fi
  echo ""
}

# output_json()
# Output results in JSON format
output_json() {
  local auth_points=0
  local api_points=0
  local db_points=0
  local arch_points=0

  if [ "$HAS_AUTH" = true ]; then auth_points=$POINTS_AUTH; fi
  if [ "$HAS_API" = true ]; then api_points=$POINTS_API; fi
  if [ "$HAS_DB" = true ]; then db_points=$POINTS_DB; fi
  if [ "$HAS_ARCHITECTURAL" = true ]; then arch_points=$POINTS_ARCHITECTURAL; fi

  cat << EOF
{
  "recommended_level": ${RECOMMENDED_LEVEL},
  "level_name": "${LEVEL_NAME}",
  "total_score": ${TOTAL_SCORE},
  "max_score": 100,
  "confidence": ${CONFIDENCE},
  "inputs": {
    "loc": ${LOC},
    "files": ${FILES},
    "auth": ${HAS_AUTH},
    "api": ${HAS_API},
    "db": ${HAS_DB},
    "architectural": ${HAS_ARCHITECTURAL}
  },
  "breakdown": {
    "loc_score": ${SCORE_LOC},
    "files_score": ${SCORE_FILES},
    "risk_score": ${SCORE_RISK},
    "complexity_score": ${SCORE_COMPLEXITY},
    "details": {
      "auth_points": ${auth_points},
      "api_points": ${api_points},
      "db_points": ${db_points},
      "architectural_points": ${arch_points}
    }
  },
  "thresholds": {
    "level_0_max": ${LEVEL_0_MAX},
    "level_1_max": ${LEVEL_1_MAX},
    "level_2_max": ${LEVEL_2_MAX}
  }
}
EOF
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --loc)
      if [[ -z "${2:-}" ]] || [[ "$2" =~ ^-- ]]; then
        echo "ERROR: --loc requires a numeric value" >&2
        exit 1
      fi
      LOC="$2"
      shift 2
      ;;
    --files)
      if [[ -z "${2:-}" ]] || [[ "$2" =~ ^-- ]]; then
        echo "ERROR: --files requires a numeric value" >&2
        exit 1
      fi
      FILES="$2"
      shift 2
      ;;
    --auth)
      HAS_AUTH=true
      shift
      ;;
    --api)
      HAS_API=true
      shift
      ;;
    --db)
      HAS_DB=true
      shift
      ;;
    --architectural)
      HAS_ARCHITECTURAL=true
      shift
      ;;
    --json|-j)
      JSON_OUTPUT=true
      shift
      ;;
    --help|-h)
      show_help
      ;;
    *)
      echo "ERROR: Unknown option: $1" >&2
      echo "Use --help for usage information" >&2
      exit 1
      ;;
  esac
done

# Validate numeric inputs first (before numeric comparison)
if ! [[ "$LOC" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --loc must be a positive integer" >&2
  exit 1
fi

if ! [[ "$FILES" =~ ^[0-9]+$ ]]; then
  echo "ERROR: --files must be a positive integer" >&2
  exit 1
fi

# Validate required inputs
if [ "$LOC" -eq 0 ] && [ "$FILES" -eq 0 ]; then
  echo "ERROR: At least --loc or --files must be provided" >&2
  echo "Use --help for usage information" >&2
  exit 1
fi

# ============================================================================
# CALCULATE SCORES
# ============================================================================

SCORE_LOC=$(calculate_loc_score "$LOC")
SCORE_FILES=$(calculate_files_score "$FILES")
SCORE_RISK=$(calculate_risk_score)
SCORE_COMPLEXITY=$(calculate_complexity_score)

TOTAL_SCORE=$((SCORE_LOC + SCORE_FILES + SCORE_RISK + SCORE_COMPLEXITY))

# Determine recommended level
determine_level "$TOTAL_SCORE"

# Calculate confidence
calculate_confidence

# ============================================================================
# OUTPUT RESULTS
# ============================================================================

if [ "$JSON_OUTPUT" = true ]; then
  output_json
else
  output_text
fi

exit 0
