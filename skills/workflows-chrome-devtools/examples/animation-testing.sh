#!/bin/bash
# Animation Testing Script
# Purpose: Test animation performance and visual state with assertions
# Usage: ./animation-testing.sh [URL] [SELECTOR] [TRIGGER_CLASS]
# Example: ./animation-testing.sh https://anobel.com ".hero" "animate-in"

set -e  # Exit on error

# Configuration
URL="${1:-https://anobel.com}"
SELECTOR="${2:-.animated-element}"
TRIGGER_CLASS="${3:-animate}"
OUTPUT_DIR="animation-tests"
DATE_STAMP=$(date +%Y%m%d-%H%M%S)

# Performance thresholds
MAX_LAYOUT_COUNT=3
MAX_RECALC_COUNT=5
MAX_TASK_DURATION=200  # milliseconds

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🎬 Testing animation performance for: $URL"
echo "🎯 Target selector: $SELECTOR"
echo "🔄 Trigger class: $TRIGGER_CLASS"

# Start browser session
echo "🌐 Starting browser session..."
bdg "$URL" 2>&1

# Wait for page load
echo "⏳ Waiting for page load (2 seconds)..."
sleep 2

# Capture before animation
echo "📸 Capturing state before animation..."
bdg screenshot "$OUTPUT_DIR/animation-before-${DATE_STAMP}.png" 2>&1

# Clear performance metrics
bdg cdp Performance.enable 2>&1 > /dev/null

# Trigger animation
echo "🎬 Triggering animation..."
bdg js "document.querySelector('$SELECTOR').classList.add('$TRIGGER_CLASS')" 2>&1

# Wait for animation to complete (adjust based on your animation duration)
sleep 1

# Capture after animation
echo "📸 Capturing state after animation..."
bdg screenshot "$OUTPUT_DIR/animation-after-${DATE_STAMP}.png" 2>&1

# Get performance metrics
echo "📊 Capturing performance metrics..."
METRICS=$(bdg cdp Performance.getMetrics 2>&1)
echo "$METRICS" > "$OUTPUT_DIR/animation-metrics-${DATE_STAMP}.json"

# Capture console logs (check for errors)
echo "📝 Capturing console logs..."
bdg console logs 2>&1 > "$OUTPUT_DIR/animation-console-${DATE_STAMP}.json"

# Stop session
echo "🛑 Stopping browser session..."
bdg stop 2>&1

# Parse metrics
LAYOUT_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutCount") | .value' 2>/dev/null || echo "0")
RECALC_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="RecalcStyleCount") | .value' 2>/dev/null || echo "0")
TASK_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="TaskDuration") | .value' 2>/dev/null || echo "0")
LAYOUT_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutDuration") | .value' 2>/dev/null || echo "0")

# Check for console errors
CONSOLE_ERRORS=$(jq -r '.[] | select(.level=="error") | .text' "$OUTPUT_DIR/animation-console-${DATE_STAMP}.json" 2>/dev/null || echo "")

# Generate report
echo "📋 Generating performance report..."
cat > "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt" <<EOF
Animation Testing Report
Generated: $(date)
URL: $URL
Selector: $SELECTOR
Trigger Class: $TRIGGER_CLASS

Performance Metrics:
  Layout Count: $LAYOUT_COUNT (threshold: ≤$MAX_LAYOUT_COUNT)
  Style Recalc Count: $RECALC_COUNT (threshold: ≤$MAX_RECALC_COUNT)
  Task Duration: ${TASK_DURATION}ms (threshold: ≤${MAX_TASK_DURATION}ms)
  Layout Duration: ${LAYOUT_DURATION}ms

Visual Captures:
  Before: animation-before-${DATE_STAMP}.png
  After: animation-after-${DATE_STAMP}.png

Console Errors:
$(if [ -n "$CONSOLE_ERRORS" ]; then echo "$CONSOLE_ERRORS"; else echo "  No errors"; fi)

Performance Assessment:
EOF

# Run assertions
FAIL=0

echo "🔍 Running performance assertions..."

if [ "$LAYOUT_COUNT" -gt "$MAX_LAYOUT_COUNT" ]; then
  echo "  ❌ FAIL: Layout count exceeds threshold ($LAYOUT_COUNT > $MAX_LAYOUT_COUNT)" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
  FAIL=1
else
  echo "  ✅ PASS: Layout count within threshold ($LAYOUT_COUNT ≤ $MAX_LAYOUT_COUNT)" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
fi

if [ "$RECALC_COUNT" -gt "$MAX_RECALC_COUNT" ]; then
  echo "  ❌ FAIL: Style recalc count exceeds threshold ($RECALC_COUNT > $MAX_RECALC_COUNT)" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
  FAIL=1
else
  echo "  ✅ PASS: Style recalc count within threshold ($RECALC_COUNT ≤ $MAX_RECALC_COUNT)" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
fi

if [ "$(echo "$TASK_DURATION > $MAX_TASK_DURATION" | bc -l)" -eq 1 ]; then
  echo "  ❌ FAIL: Task duration exceeds threshold (${TASK_DURATION}ms > ${MAX_TASK_DURATION}ms)" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
  FAIL=1
else
  echo "  ✅ PASS: Task duration within threshold (${TASK_DURATION}ms ≤ ${MAX_TASK_DURATION}ms)" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
fi

if [ -n "$CONSOLE_ERRORS" ]; then
  echo "  ⚠️ WARN: Console errors detected during animation" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
fi

# Summary
echo "" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
if [ $FAIL -eq 0 ]; then
  echo "✅ Animation performance tests PASSED" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
else
  echo "❌ Animation performance tests FAILED" | tee -a "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"
fi

# Display full report
echo ""
echo "📋 Full Report:"
cat "$OUTPUT_DIR/animation-report-${DATE_STAMP}.txt"

echo ""
echo "📁 Results saved to: $OUTPUT_DIR/"

exit $FAIL
