---
title: "CLI Chrome DevTools - Example Scripts"
description: "Production-ready bash scripts for browser debugging, testing and automation using browser-debugger-cli (bdg)"
trigger_phrases:
  - "chrome devtools examples"
  - "bdg example scripts"
  - "browser automation scripts"
---

# CLI Chrome DevTools - Example Scripts

> Production-ready bash scripts for browser debugging, testing and automation using `browser-debugger-cli` (bdg).

---

   - 3.1 [performance-baseline.sh](#31-performance-baselinesh)
   - 3.2 [animation-testing.sh](#32-animation-testingsh)
   - 3.3 [multi-viewport-test.sh](#33-multi-viewport-testsh)

---

## 1. OVERVIEW

This directory contains production-ready bash scripts demonstrating practical browser debugging, automation, performance testing and visual regression workflows using the browser-debugger-cli (bdg) tool.

When these scripts support a Spec Kit packet, route packet recovery back through `/speckit:resume`. Canonical continuity still comes from `handover.md`, then `_memory.continuity`, then the remaining spec docs, with generated memory artifacts treated as support only.

### Key Features

**Performance Testing**
- Comprehensive baseline capture with metrics, HAR traces and screenshots
- Animation performance validation with configurable thresholds
- Multi-viewport responsive testing across 5+ device sizes

**Visual Regression**
- Before/after screenshot capture for visual diffs
- Console log monitoring for error detection
- DOM statistics and network trace collection

**CI/CD Integration**
- Exit code support for pipeline integration
- Configurable thresholds for automated validation
- Timestamped output for historical comparison

---

## 2. PREREQUISITES

```bash
# Install browser-debugger-cli
npm install -g browser-debugger-cli@alpha

# Verify installation
bdg --version

# Required tools
command -v jq >/dev/null || echo "Install jq for JSON parsing"
command -v bc >/dev/null || echo "Install bc for calculations"
```

---

## 3. AVAILABLE SCRIPTS

### 3.1 performance-baseline.sh

**Purpose:** Create comprehensive performance baseline for regression testing

**Usage:**
```bash
# Default URL (https://example.com)
./performance-baseline.sh

# Custom URL
./performance-baseline.sh https://example.com

# Custom output directory
./performance-baseline.sh https://example.com ./<my-baselines-dir>
```

**What it captures:**
- Performance metrics (Layout, Script, Task durations)
- Network HAR trace (all requests)
- Screenshot (visual baseline)
- Console logs (errors and warnings)
- DOM statistics (node counts, images, scripts)
- Summary report (formatted text)

**Output:**
```
performance-baselines/
├── metrics-20241127-143022.json
├── network-20241127-143022.har
├── screenshot-20241127-143022.png
├── console-20241127-143022.json
└── summary-20241127-143022.txt
```

**Use cases:**
- Pre-deployment performance validation
- Before/after comparison for optimizations
- Regression testing in CI/CD pipelines
- Performance monitoring over time

---

### 3.2 animation-testing.sh

**Purpose:** Test animation performance with assertions and visual captures

**Usage:**
```bash
# Default: Test .animated-element with "animate" class
./animation-testing.sh

# Custom selector and trigger class
./animation-testing.sh https://example.com ".hero" "animate-in"

# Test without triggering animation (visual only)
./animation-testing.sh https://example.com ".element" ""
```

**What it tests:**
- Layout count (threshold: 3 or fewer)
- Style recalc count (threshold: 5 or fewer)
- Task duration (threshold: 200ms or less)
- Before/after visual states
- Console errors during animation

**Exit codes:**
- `0` - All assertions passed
- `1` - One or more assertions failed

**Use cases:**
- Pre-deployment animation validation
- Performance regression testing
- Visual diff generation
- CI/CD animation checks

---

### 3.3 multi-viewport-test.sh

**Purpose:** Test page rendering across desktop, laptop, tablet and mobile viewports

**Usage:**
```bash
# Default: Test page rendering
./multi-viewport-test.sh

# With animation testing
./multi-viewport-test.sh https://example.com ".hero" "animate-in"

# Visual testing only (no animation)
./multi-viewport-test.sh https://example.com "" "none"
```

**Viewports tested:**
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile: 375x667 (mobile: true)
- Mobile Large: 414x896 (mobile: true)

**What it captures per viewport:**
- Initial state screenshot
- Animated state screenshot (if triggered)
- Performance metrics
- Console logs (checks for errors)

**Output:**
```
viewport-tests/20241127-143022/
├── desktop-initial.png
├── desktop-animated.png
├── desktop-metrics.json
├── desktop-console.json
├── mobile-initial.png
├── mobile-animated.png
├── mobile-metrics.json
├── mobile-console.json
└── summary.txt
```

**Exit codes:**
- `0` - All viewport tests passed (no console errors)
- `1` - One or more viewport tests failed

**Use cases:**
- Cross-device visual consistency testing
- Responsive design validation
- Mobile-specific issue detection
- Visual regression across viewports

---

## 4. COMMON PATTERNS

### Chaining Scripts in CI/CD

```bash
#!/bin/bash
# ci-visual-tests.sh - Run all visual tests in CI

set -e  # Exit on first failure

echo "Running visual regression tests..."

# 1. Capture current baseline
./performance-baseline.sh https://staging.example.com ./<baselines>/current

# 2. Test animations
./animation-testing.sh https://staging.example.com ".hero" "animate-in"

# 3. Multi-viewport testing
./multi-viewport-test.sh https://staging.example.com ".hero" "animate-in"

echo "All visual tests passed"
```

### Performance Comparison

```bash
# Before optimization
./performance-baseline.sh https://staging.example.com ./<baselines>/before

# After optimization
./performance-baseline.sh https://staging.example.com ./<baselines>/after

# Compare metrics
echo "Before: $(jq '.result.metrics[] | select(.name=="TaskDuration") | .value' ./<baselines>/before/metrics-*.json)"
echo "After: $(jq '.result.metrics[] | select(.name=="TaskDuration") | .value' ./<baselines>/after/metrics-*.json)"
```

### Visual Diff Workflow

```bash
# Capture baseline
./multi-viewport-test.sh https://production.example.com "" "none"
mv viewport-tests/*/desktop-initial.png baseline-desktop.png

# Capture current state
./multi-viewport-test.sh https://staging.example.com "" "none"
mv viewport-tests/*/desktop-initial.png current-desktop.png

# Visual diff (requires ImageMagick)
compare baseline-desktop.png current-desktop.png diff.png
```

---

## 5. CUSTOMIZATION TIPS

### Adjusting Performance Thresholds

Edit `animation-testing.sh` to customize thresholds:

```bash
# Performance thresholds
MAX_LAYOUT_COUNT=3        # Increase for complex animations
MAX_RECALC_COUNT=5        # Increase if many style changes
MAX_TASK_DURATION=200     # Increase for slower devices
```

### Adding More Viewports

Edit `multi-viewport-test.sh` to add custom viewports:

```bash
VIEWPORTS=(
  "1920:1080:desktop:false"
  "1440:900:laptop:false"       # Added
  "768:1024:tablet:false"
  "390:844:iphone-14:true"      # Added
  "375:667:mobile:true"
)
```

### Custom Animation Wait Times

Adjust sleep duration based on your animation timing:

```bash
# For faster animations (300ms)
sleep 0.3

# For longer animations (2s)
sleep 2
```

---

## 6. TROUBLESHOOTING

### Script fails immediately

```bash
# Check bdg installation
bdg --version

# Test basic command
bdg https://example.com 2>&1
bdg stop 2>&1
```

### JSON parsing errors

```bash
# Verify jq is installed
command -v jq || brew install jq  # macOS
command -v jq || sudo apt install jq  # Linux
```

### Viewport not changing

```bash
# Verify CDP command syntax
bdg https://example.com 2>&1
bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1
bdg dom screenshot test.png 2>&1
bdg stop 2>&1
```

### Screenshots not captured

```bash
# Check output directory permissions
mkdir -p ./<test-output>
chmod 755 ./<test-output>

# Test screenshot command
bdg https://example.com 2>&1
bdg dom screenshot ./<test-output>/test.png 2>&1
bdg stop 2>&1
```

---

## 7. SEE ALSO

### Skill Documentation

**CLI Chrome DevTools**:
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` - Main skill documentation
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/` - Additional reference materials

### Workflow Integration

**sk-code References**:
- `debugging_workflows.md` - Systematic debugging patterns
- `animation_workflows.md` - Animation performance validation
- `performance_patterns.md` - Performance optimization strategies
- `verification_workflows.md` - Browser testing requirements
- `frontend_patterns.md` - frontend-specific patterns (ID duplication detection)

### Related Skills

- **sk-code** - Development workflow orchestration
- **sk-doc** - Documentation creation and validation

---

## 8. CONTRIBUTING

To add new example scripts:

1. Follow the existing pattern (usage, configuration, assertions)
2. Make script executable: `chmod +x script-name.sh`
3. Add comprehensive help text in script header
4. Update this README with usage examples
5. Reference relevant workflow documentation

---

**Directory Version**: 1.0.0
**Last Updated**: 2025-01-27
**Maintained By**: AI Documentation
