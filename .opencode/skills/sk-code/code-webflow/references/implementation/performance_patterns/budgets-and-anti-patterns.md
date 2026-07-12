---
title: Performance Budgets, Anti-Patterns & Related
description: Performance optimization checklist covering animations, assets, requests, and Core Web Vitals budgets. — Performance Budgets, Anti-Patterns & Related.
importance_tier: normal
contextType: implementation
version: 3.5.0.17
---

# Performance Budgets, Anti-Patterns & Related

## 3. PERFORMANCE BUDGETS

**Target metrics:**
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.8s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1

**Measure with:**
- Chrome DevTools Lighthouse tab
- Performance tab (record + analyze)
- Network tab (check waterfall)

### Automated Performance Measurement (MCP & CLI)

**Automate performance budget enforcement for regression detection:**

#### Option 1: Chrome DevTools MCP

**Core Web Vitals Monitoring:**
```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Start performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]

3. Wait for page load and interaction

4. Stop trace and analyze:
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]

5. Extract metrics:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - Total Blocking Time (TBT)
```

#### Option 2: mcp-chrome-devtools (Terminal-based)

**Performance Budget Assertion Script:**
```bash
#!/bin/bash
# Enforce performance budgets with assertions

URL="https://example.com"

echo "Testing performance for: $URL"

# Start session
bdg "$URL" 2>&1

# Wait for page load
sleep 3

# Get performance metrics
METRICS=$(bdg cdp Performance.getMetrics 2>&1)

# Stop session
bdg stop 2>&1

# Extract key metrics
LAYOUT_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutDuration") | .value')
SCRIPT_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="ScriptDuration") | .value')
TASK_DURATION=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="TaskDuration") | .value')

echo "Performance Metrics:"
echo "  Layout Duration: ${LAYOUT_DURATION}ms"
echo "  Script Duration: ${SCRIPT_DURATION}ms"
echo "  Task Duration: ${TASK_DURATION}ms"

# Assert budgets (example thresholds)
FAIL=0

if (( $(echo "$TASK_DURATION > 3000" | bc -l) )); then
  echo "❌ FAIL: Task duration exceeds budget (${TASK_DURATION}ms > 3000ms)"
  FAIL=1
fi

if (( $(echo "$SCRIPT_DURATION > 2000" | bc -l) )); then
  echo "❌ FAIL: Script duration exceeds budget (${SCRIPT_DURATION}ms > 2000ms)"
  FAIL=1
fi

if [ $FAIL -eq 0 ]; then
  echo "✅ PASS: All performance budgets met"
else
  echo "❌ FAIL: Performance budget violations detected"
  exit 1
fi
```

**Network Performance Analysis:**
```bash
# Capture HAR file
bdg https://example.com 2>&1
bdg har export performance.har 2>&1
bdg stop 2>&1

# Calculate page load time
PAGE_LOAD=$(jq '[.log.entries[].time] | add' performance.har)
echo "Page load time: ${PAGE_LOAD}ms"

# Find slow requests (>500ms)
echo "Slow requests:"
jq '.log.entries[] | select(.time > 500) | {url: .request.url, time}' performance.har

# Calculate total transfer size
TOTAL_SIZE=$(jq '[.log.entries[].response.bodySize] | add' performance.har)
echo "Total transfer size: $((TOTAL_SIZE / 1024))KB"

# Assert budgets
if (( $(echo "$PAGE_LOAD > 3000" | bc -l) )); then
  echo "❌ FAIL: Page load exceeds budget (${PAGE_LOAD}ms > 3000ms)"
  exit 1
fi

if (( $(echo "$TOTAL_SIZE > 1000000" | bc -l) )); then
  echo "❌ FAIL: Transfer size exceeds budget ($((TOTAL_SIZE / 1024))KB > 1000KB)"
  exit 1
fi

echo "✅ PASS: Network performance budgets met"
```

**Animation Performance Check:**
```bash
# Check animation performance (from animation_workflows.md)
bdg https://example.com 2>&1

# Trigger animation
bdg js "document.querySelector('.animated-element').classList.add('animate')" 2>&1
sleep 1

# Get layout metrics
METRICS=$(bdg cdp Performance.getMetrics 2>&1)
bdg stop 2>&1

LAYOUT_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="LayoutCount") | .value')
RECALC_COUNT=$(echo "$METRICS" | jq '.result.metrics[] | select(.name=="RecalcStyleCount") | .value')

echo "Animation Metrics:"
echo "  Layout count: $LAYOUT_COUNT"
echo "  Style recalc count: $RECALC_COUNT"

# Assert animation budgets
if [ "$LAYOUT_COUNT" -gt 3 ]; then
  echo "❌ FAIL: Too many layouts during animation ($LAYOUT_COUNT > 3)"
  exit 1
fi

if [ "$RECALC_COUNT" -gt 5 ]; then
  echo "❌ FAIL: Too many style recalculations ($RECALC_COUNT > 5)"
  exit 1
fi

echo "✅ PASS: Animation performance budgets met"
```

**CI/CD Integration**: These performance checks could be automated with shell scripts in your CI pipeline. Use the patterns above as a starting point.

**See:** `.opencode/skills/mcp-tooling/mcp-chrome-devtools/` for complete CLI automation patterns

---

## 4. ANTI-PATTERNS

**Never:**
- ❌ Animate width/height/top/left (triggers layout)
- ❌ Use synchronous XHR requests
- ❌ Load large libraries without code splitting
- ❌ Leave will-change active after animation
- ❌ Skip lazy loading for below-the-fold content
- ❌ Ignore mobile performance (test on throttled CPU)

---

## 5. RELATED RESOURCES

### Topical performance deep-dives (`webflow/performance/`)

This file is the high-level checklist + budgets + anti-patterns index. For deep-dive topical guidance on each performance area, load the matching file under [`../performance/`](../performance/):

- [`../../performance/cwv_remediation.md`](../../performance/cwv_remediation.md) — LCP / FCP / TBT / CLS deep remediation playbook with measurement tooling and per-metric implementation checklists
- [`../../performance/resource_loading.md`](../../performance/resource_loading.md) — preconnect, dns-prefetch, preload, prefetch, async CSS loading, script loading patterns (referenced by §2 "Asset Optimization" + "Request Optimization" above)
- [`../../performance/third_party.md`](../../performance/third_party.md) — GTM delay, analytics deferral, consent scripts, external font loading, third-party priority matrix
- [`../../performance/interaction_gated_loading.md`](../../performance/interaction_gated_loading.md) — defer-until-interaction patterns, gate selection, non-deferrable exclusions, anti-patterns
- [`../../performance/webflow_constraints.md`](../../performance/webflow_constraints.md) — Typekit / jQuery / Webflow.js / CSS generation / custom code injection constraints (what Webflow controls vs what you can change)

### Reference Files (sibling implementation patterns)
- [debugging_workflows.md](../../debugging/debugging_workflows/systematic_four_phases.md) - Performance debugging workflows for identifying bottlenecks
- [verification_workflows.md](../../verification/verification_workflows/gate_and_automated_options.md) - Browser testing and verification workflows
- [animation_workflows.md](../animation_workflows/overview-decision-tree-and-css.md) - Animation performance patterns for GPU-accelerated properties
- [webflow_patterns.md](../webflow_patterns/overview-limits-and-collection-lists.md) - Webflow-specific performance considerations for collection lists

### Per-language quality patterns
- [`../../javascript/quality_standards/init-dom-error-and-async.md`](../../javascript/quality_standards/init-dom-error-and-async.md) — JS-side performance patterns (RequestAnimationFrame, GPU acceleration hints, debounced resize, event delegation)
- [`../../css/quality_standards/patterns_and_naming_enforcement.md`](../../css/quality_standards/patterns_and_naming_enforcement.md) — CSS-side performance patterns (will-change management, GPU-accelerated properties, easing standards, fluid typography)

### Cross-stack
- [`../../animation/performance_and_pitfalls.md`](../../animation/performance_and_pitfalls.md) — Motion.dev performance and pitfalls (will-change cleanup, GPU acceleration, frame-rate gotchas)

### Related Skills
- `mcp-chrome-devtools` - Automated performance budget enforcement via CLI for regression detection

### Standards
- **Integration**: Apply during Phase 1 (Implementation checklist), Phase 2 (Performance debugging), Phase 3 (Lighthouse verification)
