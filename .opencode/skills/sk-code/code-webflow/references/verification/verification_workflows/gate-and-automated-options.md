---
title: Verification Workflows - Phase 3 (MANDATORY)
description: Browser verification requirements for all completion claims - no exceptions.
trigger_phrases:
  - "webflow verification workflows"
  - "browser verification mandatory"
  - "iron law evidence"
  - "gate function completion claims"
importance_tier: important
contextType: implementation
version: 3.5.0.8
---

# Verification Workflows - Phase 3 (MANDATORY)

Browser verification requirements for all completion claims - no exceptions.

---

## 1. OVERVIEW

### Purpose
**The Iron Law**: Evidence in browser before claims, always. Claiming work is complete without browser verification is dishonesty, not efficiency. "Works on my machine" is not verification.

### When to Use
**Use BEFORE claiming**:
- Animation is working correctly
- Layout issue is fixed
- JavaScript feature is complete
- Video/media loads properly
- Form submission works
- Navigation functions correctly
- Mobile responsive layout is correct
- Cross-browser compatibility achieved
- Performance meets standards
- **ANY statement of completion or success**

### The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH BROWSER VERIFICATION EVIDENCE
```

If you haven't opened the browser and tested in this message, you cannot claim it works.

---

## 2. THE GATE FUNCTION

**BEFORE claiming any status or expressing satisfaction:**

```markdown
1. IDENTIFY: What command/action proves this claim?
2. OPEN: Launch actual browser (not just reading code)
3. TEST: Execute the user interaction or view the result
4. VERIFY: Does browser show expected behavior?
   - Visual: Does it look correct?
   - Interactive: Do clicks/hovers work?
   - Animation: Does timing feel right?
   - Console: No errors in DevTools?
   - Responsive: Works on all viewport sizes?
5. VERIFY: Multi-viewport check (mobile + desktop minimum via Chrome emulation)
6. RECORD: Note what you saw
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
7. ONLY THEN: Make the claim
```

Skip any step = lying, not verifying.

---

## 2.5. AUTOMATED VERIFICATION OPTIONS (MCP OR CLI)

**Automated browser testing enables faster, repeatable verification.**

**Two automation approaches available:**

### Option 1: Chrome DevTools MCP (IDE-based)

### Why Use Automated Verification

**Benefits:**
- ✅ Faster than manual browser testing
- ✅ Repeatable and consistent results
- ✅ Structured data output (JSON-like responses)
- ✅ Multi-viewport testing without manual resizing
- ✅ Objective performance metrics (Core Web Vitals)
- ✅ Programmatic error detection

**When to use automated:**
- Console error checking
- Multi-viewport screenshot capture
- Performance measurement
- Network request validation
- Regression testing

**When to use manual (browser DevTools):**
- Visual quality assessment (colors, spacing, polish)
- Animation smoothness perception (does 60fps "feel" right?)
- Interactive responsiveness (click/hover tactile feel)
- Accessibility testing (screen readers)
- Real device testing (not emulation)

### Available Chrome DevTools MCP Tools

**Two instances available for multi-agent concurrency:**
- `mcp__chrome_devtools_1__*` - Instance 1 (26 tools)
- `mcp__chrome_devtools_2__*` - Instance 2 (26 tools)

**Key tools for verification:**
- `navigate_page` - Navigate to URL
- `take_screenshot` - Capture screenshot
- `resize_page` - Set viewport dimensions
- `list_console_messages` - Get all console messages
- `list_network_requests` - Get all network requests
- `performance_start_trace` / `performance_stop_trace` - Measure Core Web Vitals
- `evaluate_script` - Execute JavaScript in page context

### Automated Workflow Examples

#### Example 1: Console Error Checking

**Check for console errors automatically:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List console messages:
   [Use tool: mcp__chrome_devtools_2__list_console_messages]

3. Filter for errors in response:
   - Look for messages where type === "error"
   - Report any errors found with file + line number

Expected result: Empty error array = no console errors ✅
```

**What you'll see:**
- Console messages listed with type, text, source, line number
- Structured data easy to filter programmatically
- Stack traces included for errors

#### Example 2: Multi-Viewport Screenshot Testing

**Capture screenshots at all breakpoints automatically:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Mobile viewport (375px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 375
   - height: 667
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save screenshot for visual review

3. Tablet viewport (991px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 991
   - height: 1024
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save screenshot for visual review

4. Desktop viewport (1920px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 1920
   - height: 1080
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save screenshot for visual review

5. Review all screenshots for visual correctness
```

**What you'll see:**
- Three screenshots at exact dimensions
- Consistent viewport sizes across tests
- Screenshots saved for documentation

#### Example 3: Performance Measurement

**Measure Core Web Vitals automatically:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Start performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]

3. Stop performance trace:
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]

4. Analyze results:
   - LCP (Largest Contentful Paint): Target <2500ms
   - FID (First Input Delay): Target <100ms
   - CLS (Cumulative Layout Shift): Target <0.1
```

**What you'll see:**
- Objective Core Web Vitals metrics
- Performance insights and recommendations
- Structured data for trend analysis

#### Example 4: Network Request Validation

**Check for failed network requests automatically:**

```markdown
1. Navigate to page:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. List network requests:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]

3. Filter for failures in response:
   - Look for requests where status >= 400
   - Look for requests where status === 0 (blocked)
   - Report failed requests with URL + status

Expected result: No failed requests ✅
```

**What you'll see:**
- All network requests listed
- Status codes, URLs, types, sizes
- Easy identification of 404s, 500s, blocked resources

#### Example 5: Complete Automated Verification Workflow

**Full verification in one workflow:**

```markdown
1. Navigate once:
   [Use tool: mcp__chrome_devtools_2__navigate_page]
   - url: "https://example.com"

2. Check console errors:
   [Use tool: mcp__chrome_devtools_2__list_console_messages]
   - Filter for type === "error"
   - Report: ✅ No errors or ❌ Errors found

3. Check network failures:
   [Use tool: mcp__chrome_devtools_2__list_network_requests]
   - Filter for status >= 400 or status === 0
   - Report: ✅ No failures or ❌ Failures found

4. Measure performance:
   [Use tool: mcp__chrome_devtools_2__performance_start_trace]
   [Use tool: mcp__chrome_devtools_2__performance_stop_trace]
   - Check LCP < 2500ms
   - Check FID < 100ms
   - Check CLS < 0.1
   - Report: ✅ Pass or ⚠️ Warning with metrics

5. Capture all viewports:
   [Resize to 375x667 → Screenshot (mobile)]
   [Resize to 768x1024 → Screenshot (tablet)]
   [Resize to 1920x1080 → Screenshot (desktop)]
   - Save all screenshots for review

6. Final report:
   - Console: ✅/❌
   - Network: ✅/❌
   - Performance: ✅/⚠️ (with metrics)
   - Screenshots: Review manually
```

### Integration with "The Gate Function"

**Updated Gate Function (Section 2) with automation option:**

```markdown
1. IDENTIFY: What command/action proves this claim?
2. OPEN: Launch browser (automated OR manual)
   - Automated: Use mcp__chrome_devtools_2__navigate_page
   - Manual: Open Chrome browser and navigate
3. TEST: Execute the interaction (automated OR manual)
   - Automated: Use click, fill, evaluate_script tools
   - Manual: Interact with browser directly
4. VERIFY: Check behavior (automated AND manual)
   - Automated: Use list_console_messages, list_network_requests
   - Manual: Visual inspection of browser
5. VERIFY: Multi-viewport (automated OR manual)
   - Automated: Use resize_page + take_screenshot
   - Manual: Toggle device toolbar
6. RECORD: Document findings (automated provides structured data)
7. ONLY THEN: Make the claim
```

**The Iron Law still applies:** Evidence before claims. Automated tools provide evidence faster and more consistently than manual testing.

### Multi-Agent Concurrency

**Multiple agents can verify simultaneously using different instances:**

```markdown
Agent 1: Use mcp__chrome_devtools_1__* tools
Agent 2: Use mcp__chrome_devtools_2__* tools

Both agents can navigate, screenshot, and test without conflicts.
```

---

### Option 2: mcp-chrome-devtools (CLI-based)

**Lightweight terminal-based verification using browser-debugger-cli (bdg):**

**Benefits**:
- ✅ No MCP infrastructure required
- ✅ Direct Bash execution (faster than MCP calls)
- ✅ Self-documenting tool discovery (--list, --describe, --search)
- ✅ Unix composability for workflows
- ✅ Token efficient (minimal context overhead)

**Example Workflow - Console Error Checking**:
```bash
# Navigate and capture console
bdg https://example.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")' > errors.json
bdg stop 2>&1

# Review errors
cat errors.json
```

**Example Workflow - Multi-Viewport Screenshots**:
```bash
# Desktop screenshot (default viewport ~1920x1080)
bdg https://example.com 2>&1
bdg screenshot desktop.png 2>&1

# Mobile screenshot (set viewport first)
bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1
bdg screenshot mobile.png 2>&1

# Reset viewport (optional)
bdg cdp Emulation.clearDeviceMetricsOverride 2>&1
bdg stop 2>&1
```

**See**: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md for complete CLI automation workflows

**Decision: MCP vs CLI**:

| Factor | Chrome DevTools MCP | mcp-chrome-devtools (bdg) |
|--------|-------------------|--------------------------|
| Setup | MCP server required | npm install -g bdg |
| Execution | Via Code Mode (mcp-code-mode skill) | Direct Bash commands |
| Token Cost | Higher (tool marshalling overhead) | Lower (minimal context) |
| Discovery | Type definitions in IDE | Self-documenting (--list, --describe) |
| Workflow | IDE-based, multi-tool integration | Terminal-native, Unix pipes |
| Best For | Complex automation, IDE users | Quick tasks, CLI users |

---
