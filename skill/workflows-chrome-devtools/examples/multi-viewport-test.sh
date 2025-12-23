#!/bin/bash
# Multi-Viewport Testing Script
# Purpose: Test page rendering and animations across multiple viewports
# Usage: ./multi-viewport-test.sh [URL] [SELECTOR] [TRIGGER_CLASS]
# Example: ./multi-viewport-test.sh https://anobel.com ".hero" "animate-in"

set -e  # Exit on error

# Configuration
URL="${1:-https://anobel.com}"
SELECTOR="${2:-.animated-element}"
TRIGGER_CLASS="${3:-animate}"
OUTPUT_DIR="viewport-tests"
DATE_STAMP=$(date +%Y%m%d-%H%M%S)

# Define viewports (width:height:name:mobile)
VIEWPORTS=(
  "1920:1080:desktop:false"
  "1366:768:laptop:false"
  "768:1024:tablet:false"
  "375:667:mobile:true"
  "414:896:mobile-large:true"
)

# Create output directory
mkdir -p "$OUTPUT_DIR/$DATE_STAMP"

echo "🖥️  Multi-Viewport Testing for: $URL"
echo "🎯 Target selector: $SELECTOR"
echo "📁 Output: $OUTPUT_DIR/$DATE_STAMP/"
echo ""

# Summary tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test each viewport
for viewport in "${VIEWPORTS[@]}"; do
  IFS=':' read -r width height name mobile <<< "$viewport"

  TOTAL_TESTS=$((TOTAL_TESTS + 1))

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📱 Testing $name viewport (${width}x${height})"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Start browser session
  bdg "$URL" 2>&1

  # Wait for page load
  sleep 2

  # Set viewport
  echo "  🔧 Setting viewport to ${width}x${height} (mobile: $mobile)..."
  bdg cdp Emulation.setDeviceMetricsOverride "{\"width\":$width,\"height\":$height,\"deviceScaleFactor\":2,\"mobile\":$mobile}" 2>&1

  # Capture initial state
  echo "  📸 Capturing initial state..."
  bdg screenshot "$OUTPUT_DIR/$DATE_STAMP/${name}-initial.png" 2>&1

  # Check if target element exists
  ELEMENT_EXISTS=$(bdg js "document.querySelector('$SELECTOR') !== null" 2>&1)

  if [ "$ELEMENT_EXISTS" = "true" ]; then
    echo "  ✅ Target element found: $SELECTOR"

    # Trigger animation (if selector and class provided)
    if [ -n "$TRIGGER_CLASS" ] && [ "$TRIGGER_CLASS" != "none" ]; then
      echo "  🎬 Triggering animation..."
      bdg js "document.querySelector('$SELECTOR').classList.add('$TRIGGER_CLASS')" 2>&1
      sleep 1

      # Capture after animation
      echo "  📸 Capturing animated state..."
      bdg screenshot "$OUTPUT_DIR/$DATE_STAMP/${name}-animated.png" 2>&1
    fi

    # Get performance metrics
    echo "  📊 Capturing performance metrics..."
    bdg cdp Performance.getMetrics 2>&1 > "$OUTPUT_DIR/$DATE_STAMP/${name}-metrics.json"

    # Get console logs
    bdg console logs 2>&1 > "$OUTPUT_DIR/$DATE_STAMP/${name}-console.json"

    # Check for console errors
    ERROR_COUNT=$(jq '[.[] | select(.level=="error")] | length' "$OUTPUT_DIR/$DATE_STAMP/${name}-console.json" 2>/dev/null || echo "0")

    if [ "$ERROR_COUNT" -gt 0 ]; then
      echo "  ⚠️ WARNING: $ERROR_COUNT console error(s) detected"
      FAILED_TESTS=$((FAILED_TESTS + 1))
    else
      echo "  ✅ No console errors"
      PASSED_TESTS=$((PASSED_TESTS + 1))
    fi
  else
    echo "  ❌ Target element not found: $SELECTOR"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi

  # Clear viewport override
  bdg cdp Emulation.clearDeviceMetricsOverride 2>&1

  # Stop session
  bdg stop 2>&1

  echo ""
done

# Generate summary report
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > "$OUTPUT_DIR/$DATE_STAMP/summary.txt" <<EOF
Multi-Viewport Testing Summary
Generated: $(date)
URL: $URL
Selector: $SELECTOR
Trigger Class: $TRIGGER_CLASS

Test Results:
  Total Tests: $TOTAL_TESTS
  Passed: $PASSED_TESTS
  Failed: $FAILED_TESTS

Viewports Tested:
EOF

for viewport in "${VIEWPORTS[@]}"; do
  IFS=':' read -r width height name mobile <<< "$viewport"
  echo "  - $name: ${width}x${height} (mobile: $mobile)" >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt"
done

cat >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt" <<EOF

Files Generated:
EOF

# List all generated files
for viewport in "${VIEWPORTS[@]}"; do
  IFS=':' read -r width height name mobile <<< "$viewport"
  echo "  $name viewport:" >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt"
  echo "    - ${name}-initial.png (Initial state screenshot)" >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt"
  if [ -f "$OUTPUT_DIR/$DATE_STAMP/${name}-animated.png" ]; then
    echo "    - ${name}-animated.png (Animated state screenshot)" >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt"
  fi
  echo "    - ${name}-metrics.json (Performance metrics)" >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt"
  echo "    - ${name}-console.json (Console logs)" >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt"
done

cat >> "$OUTPUT_DIR/$DATE_STAMP/summary.txt" <<EOF

Next Steps:
  1. Review screenshots for visual consistency across viewports
  2. Compare performance metrics to identify viewport-specific issues
  3. Check console logs for errors or warnings
  4. Use image diff tools to detect visual regressions
EOF

# Display summary
cat "$OUTPUT_DIR/$DATE_STAMP/summary.txt"

echo ""
echo "📁 Results saved to: $OUTPUT_DIR/$DATE_STAMP/"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo "✅ All viewport tests PASSED"
  exit 0
else
  echo "❌ $FAILED_TESTS viewport test(s) FAILED"
  exit 1
fi
