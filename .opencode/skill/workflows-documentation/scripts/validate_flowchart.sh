#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: FLOWCHART VALIDATOR
# ───────────────────────────────────────────────────────────────
# Validate markdown flowcharts for common errors.
# Usage: ./validate_flowchart.sh <flowchart.md>

set -euo pipefail


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

FLOWCHART_FILE="$1"
ERRORS=0
WARNINGS=0

if [[ ! -f "$FLOWCHART_FILE" ]]; then
  echo "Usage: $0 <flowchart.md>"
  echo "Example: $0 specs/094-feature/flowchart.md"
  exit 1
fi


# ───────────────────────────────────────────────────────────────
# 2. VALIDATORS
# ───────────────────────────────────────────────────────────────

check_box_alignment() {
    echo "⏹️  Checking for misaligned boxes..."
    BOX_WIDTHS=$(grep -oE '─{2,}' "$FLOWCHART_FILE" | awk '{print length}' | sort -u)
    NUM_WIDTHS=$(echo "$BOX_WIDTHS" | wc -l | tr -d ' ')

    if [[ $NUM_WIDTHS -gt 5 ]]; then
      echo "   ❌ Error: Too many box width variations ($NUM_WIDTHS)"
      echo "   Tip: Standardize box widths for consistency"
      ((ERRORS++))
    elif [[ $NUM_WIDTHS -gt 3 ]]; then
      echo "   ⚠️  Warning: Multiple box widths detected (found $NUM_WIDTHS different widths)"
      echo "   Tip: Standardize box widths for consistency"
      ((WARNINGS++))
    else
      echo "   ✅ Box widths consistent"
    fi
}

check_arrows() {
    echo "➡️  Checking for arrow patterns..."
    ARROW_COUNT=$(grep -c '→\|↓\|├─\|└─' "$FLOWCHART_FILE" || echo "0")
    BOX_COUNT=$(grep -c '┌─\|┐\|└─\|┘' "$FLOWCHART_FILE" || echo "0")

    if [[ $ARROW_COUNT -eq 0 ]] && [[ $BOX_COUNT -gt 0 ]]; then
      echo "   ❌ Error: Found boxes but no arrows/connectors (broken flowchart)"
      echo "   Tip: Add arrows (→, ↓) or tree branches (├─, └─) to connect boxes"
      ((ERRORS++))
    else
      echo "   ✅ Arrows and connectors present"
    fi
}

check_decision_labels() {
    echo "🔀 Checking decision branch labels..."
    DECISION_COUNT=$(grep -ci 'decision\|if\|choice\|branch' "$FLOWCHART_FILE" || echo "0")
    YES_NO_COUNT=$(grep -ci '\[yes\]\|\[no\]\|✓\|✗' "$FLOWCHART_FILE" || echo "0")

    if [[ $DECISION_COUNT -gt 0 ]] && [[ $YES_NO_COUNT -eq 0 ]]; then
      echo "   ❌ Error: Decision points detected but no YES/NO labels found"
      echo "   Tip: Add [YES]/[NO] or ✓/✗ labels to decision branches"
      ((ERRORS++))
    else
      echo "   ✅ Decision branch labeling looks good"
    fi
}

check_nesting_depth() {
    echo "📊 Checking nesting depth..."
    MAX_INDENT=$(awk '{match($0, /^[ ]*/); print RLENGTH}' "$FLOWCHART_FILE" | sort -rn | head -1)
    DEPTH_LEVEL=$((MAX_INDENT / 2))

    if [[ $DEPTH_LEVEL -gt 6 ]]; then
      echo "   ⚠️  Warning: Deep nesting detected (level $DEPTH_LEVEL)"
      echo "   Tip: Consider breaking into multiple flowcharts or using swimlanes"
      ((WARNINGS++))
    elif [[ $DEPTH_LEVEL -gt 4 ]]; then
      echo "   ℹ️  Info: Moderate nesting (level $DEPTH_LEVEL)"
    else
      echo "   ✅ Nesting depth appropriate (level $DEPTH_LEVEL)"
    fi
}

check_size() {
    echo "📏 Checking flowchart size..."
    LINE_COUNT=$(wc -l < "$FLOWCHART_FILE" | tr -d ' ')

    if [[ $LINE_COUNT -gt 200 ]]; then
      echo "   ⚠️  Warning: Large flowchart ($LINE_COUNT lines)"
      echo "   Tip: Consider splitting into multiple diagrams for readability"
      ((WARNINGS++))
    elif [[ $LINE_COUNT -gt 100 ]]; then
      echo "   ℹ️  Info: Moderate size ($LINE_COUNT lines)"
    else
      echo "   ✅ Size appropriate ($LINE_COUNT lines)"
    fi
}


# ───────────────────────────────────────────────────────────────
# 3. MAIN
# ───────────────────────────────────────────────────────────────

echo "🔍 Validating flowchart: $FLOWCHART_FILE"
echo ""

check_box_alignment
check_arrows
check_decision_labels
check_nesting_depth
check_size

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ $ERRORS -eq 0 ]] && [[ $WARNINGS -eq 0 ]]; then
  echo "✅ Flowchart validation passed - No issues found"
  exit 0
elif [[ $ERRORS -eq 0 ]]; then
  echo "⚠️  Flowchart validation passed with $WARNINGS warning(s)"
  echo "   Consider addressing warnings for improved readability"
  exit 0
else
  echo "❌ Found $ERRORS error(s) and $WARNINGS warning(s)"
  exit 1
fi
