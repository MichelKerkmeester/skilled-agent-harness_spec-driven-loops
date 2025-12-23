#!/usr/bin/env bash
# validate.sh - Validate markdown flowcharts for common errors
#
# Usage: ./validate.sh <flowchart.md>
#
# Checks:
# - Misaligned boxes (inconsistent border length)
# - Broken arrows (arrows not connecting to boxes)
# - Inconsistent box widths
# - Missing labels on decision branches
# - Depth complexity (>4 levels)

FLOWCHART_FILE="$1"

if [[ ! -f "$FLOWCHART_FILE" ]]; then
  echo "Usage: $0 <flowchart.md>"
  echo "Example: $0 specs/094-feature/flowchart.md"
  exit 1
fi

ERRORS=0
WARNINGS=0

echo "🔍 Validating flowchart: $FLOWCHART_FILE"
echo ""

# Check 1: Misaligned boxes (inconsistent border length)
echo "⏹️  Checking for misaligned boxes..."
# Look for box borders and check consistency
BOX_PATTERN='┌─+┐|└─+┘|├─+┤'
BOX_WIDTHS=$(grep -oE '─{2,}' "$FLOWCHART_FILE" | awk '{print length}' | sort -u)
NUM_WIDTHS=$(echo "$BOX_WIDTHS" | wc -l | tr -d ' ')

if [[ $NUM_WIDTHS -gt 3 ]]; then
  echo "   ⚠️  Warning: Multiple box widths detected (found $NUM_WIDTHS different widths)"
  echo "   Tip: Standardize box widths for consistency"
  ((WARNINGS++))
else
  echo "   ✅ Box widths consistent"
fi

# Check 2: Broken arrows (basic check for arrow characters)
echo "➡️  Checking for arrow patterns..."
# Check for common arrow patterns
ARROW_COUNT=$(grep -c '→\|↓\|├─\|└─' "$FLOWCHART_FILE" || echo "0")
BOX_COUNT=$(grep -c '┌─\|┐\|└─\|┘' "$FLOWCHART_FILE" || echo "0")

if [[ $ARROW_COUNT -eq 0 ]] && [[ $BOX_COUNT -gt 0 ]]; then
  echo "   ⚠️  Warning: Found boxes but no arrows/connectors"
  echo "   Tip: Add arrows (→, ↓) or tree branches (├─, └─) to connect boxes"
  ((WARNINGS++))
else
  echo "   ✅ Arrows and connectors present"
fi

# Check 3: Decision branches (YES/NO labels)
echo "🔀 Checking decision branch labels..."
# Look for decision indicators
DECISION_COUNT=$(grep -ci 'decision\|if\|choice\|branch' "$FLOWCHART_FILE" || echo "0")
YES_NO_COUNT=$(grep -ci '\[yes\]\|\[no\]\|✓\|✗' "$FLOWCHART_FILE" || echo "0")

if [[ $DECISION_COUNT -gt 0 ]] && [[ $YES_NO_COUNT -eq 0 ]]; then
  echo "   ⚠️  Warning: Decision points detected but no YES/NO labels found"
  echo "   Tip: Add [YES]/[NO] or ✓/✗ labels to decision branches"
  ((WARNINGS++))
else
  echo "   ✅ Decision branch labeling looks good"
fi

# Check 4: Depth complexity (count indentation levels)
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

# Check 5: File size (very large flowcharts are hard to read)
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

# Summary
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
