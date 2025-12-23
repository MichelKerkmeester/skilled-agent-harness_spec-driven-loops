#!/bin/bash
# Performance Baseline Capture Script
# Purpose: Create comprehensive performance baseline for regression testing
# Usage: ./performance-baseline.sh [URL] [OUTPUT_DIR]
# Example: ./performance-baseline.sh https://anobel.com ./baselines

set -e  # Exit on error

# Configuration
URL="${1:-https://anobel.com}"
OUTPUT_DIR="${2:-performance-baselines}"
DATE_STAMP=$(date +%Y%m%d-%H%M%S)

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🔍 Creating performance baseline for: $URL"
echo "📁 Output directory: $OUTPUT_DIR"

# Start browser session
echo "🌐 Starting browser session..."
bdg "$URL" 2>&1

# Wait for page load
echo "⏳ Waiting for page load (3 seconds)..."
sleep 3

# Capture performance metrics
echo "📊 Capturing performance metrics..."
bdg cdp Performance.getMetrics 2>&1 > "$OUTPUT_DIR/metrics-${DATE_STAMP}.json"

# Capture network HAR
echo "🌐 Capturing network trace..."
bdg har export "$OUTPUT_DIR/network-${DATE_STAMP}.har" 2>&1

# Capture screenshot
echo "📸 Capturing screenshot..."
bdg screenshot "$OUTPUT_DIR/screenshot-${DATE_STAMP}.png" 2>&1

# Capture DOM statistics
echo "📐 Capturing DOM statistics..."
DOM_NODES=$(bdg js "document.getElementsByTagName('*').length" 2>&1)
IMAGE_COUNT=$(bdg js "document.images.length" 2>&1)
SCRIPT_COUNT=$(bdg js "document.scripts.length" 2>&1)
STYLESHEET_COUNT=$(bdg js "document.styleSheets.length" 2>&1)

# Capture console logs
echo "📝 Capturing console logs..."
bdg console logs 2>&1 > "$OUTPUT_DIR/console-${DATE_STAMP}.json"

# Stop session
echo "🛑 Stopping browser session..."
bdg stop 2>&1

# Generate summary report
echo "📋 Generating summary report..."
cat > "$OUTPUT_DIR/summary-${DATE_STAMP}.txt" <<EOF
Performance Baseline Summary
Generated: $(date)
URL: $URL

DOM Statistics:
  Total Nodes: $DOM_NODES
  Images: $IMAGE_COUNT
  Scripts: $SCRIPT_COUNT
  Stylesheets: $STYLESHEET_COUNT

Files Captured:
  - metrics-${DATE_STAMP}.json (Performance metrics)
  - network-${DATE_STAMP}.har (Network trace)
  - screenshot-${DATE_STAMP}.png (Visual baseline)
  - console-${DATE_STAMP}.json (Console logs)

Key Metrics:
$(jq -r '.result.metrics[] | select(.name | contains("Layout") or contains("Script") or contains("Task")) | "  \(.name): \(.value)"' "$OUTPUT_DIR/metrics-${DATE_STAMP}.json")

Network Summary:
  Total Requests: $(jq '.log.entries | length' "$OUTPUT_DIR/network-${DATE_STAMP}.har")
  Total Transfer Size: $(jq '[.log.entries[].response.bodySize] | add' "$OUTPUT_DIR/network-${DATE_STAMP}.har") bytes
  Page Load Time: $(jq '[.log.entries[].time] | add' "$OUTPUT_DIR/network-${DATE_STAMP}.har")ms

Console Errors:
$(jq -r '.[] | select(.level=="error") | "  [\(.level)] \(.text)"' "$OUTPUT_DIR/console-${DATE_STAMP}.json" 2>/dev/null || echo "  No errors")
EOF

# Display summary
cat "$OUTPUT_DIR/summary-${DATE_STAMP}.txt"

echo ""
echo "✅ Performance baseline captured successfully!"
echo "📁 Location: $OUTPUT_DIR/"
echo ""
echo "Next steps:"
echo "  1. Review summary-${DATE_STAMP}.txt for baseline metrics"
echo "  2. Store baselines in version control for regression testing"
echo "  3. Compare future captures against this baseline"
