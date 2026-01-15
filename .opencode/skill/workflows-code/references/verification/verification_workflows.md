---
title: Verification Workflows - Phase 3 (MANDATORY)
description: Browser verification requirements for all completion claims - no exceptions.
---

# Verification Workflows - Phase 3 (MANDATORY)

Browser verification requirements for all completion claims - no exceptions.

---

## 1. 📖 OVERVIEW

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

## 2. 🚪 THE GATE FUNCTION

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
8. ONLY THEN: Make the claim
```

Skip any step = lying, not verifying.

---

## 2.5. 🤖 AUTOMATED VERIFICATION OPTIONS (MCP OR CLI)

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
   - url: "https://anobel.com"

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
   - url: "https://anobel.com"

2. Mobile viewport (375px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 375
   - height: 667
   [Use tool: mcp__chrome_devtools_2__take_screenshot]
   - Save screenshot for visual review

3. Tablet viewport (768px):
   [Use tool: mcp__chrome_devtools_2__resize_page]
   - width: 768
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
   - url: "https://anobel.com"

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
   - url: "https://anobel.com"

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
   - url: "https://anobel.com"

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

### Option 2: workflows-chrome-devtools (CLI-based)

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
bdg https://anobel.com 2>&1
bdg console logs 2>&1 | jq '.[] | select(.level=="error")' > errors.json
bdg stop 2>&1

# Review errors
cat errors.json
```

**Example Workflow - Multi-Viewport Screenshots**:
```bash
# Desktop screenshot (default viewport ~1920x1080)
bdg https://anobel.com 2>&1
bdg screenshot desktop.png 2>&1

# Mobile screenshot (set viewport first)
bdg cdp Emulation.setDeviceMetricsOverride '{"width":375,"height":667,"deviceScaleFactor":2,"mobile":true}' 2>&1
bdg screenshot mobile.png 2>&1

# Reset viewport (optional)
bdg cdp Emulation.clearDeviceMetricsOverride 2>&1
bdg stop 2>&1
```

**See**: .opencode/skill/workflows-chrome-devtools/SKILL.md for complete CLI automation workflows

**Decision: MCP vs CLI**:

| Factor | Chrome DevTools MCP | workflows-chrome-devtools (bdg) |
|--------|-------------------|--------------------------|
| Setup | MCP server required | npm install -g bdg |
| Execution | Via Code Mode (mcp-code-mode skill) | Direct Bash commands |
| Token Cost | Higher (tool marshalling overhead) | Lower (minimal context) |
| Discovery | Type definitions in IDE | Self-documenting (--list, --describe) |
| Workflow | IDE-based, multi-tool integration | Terminal-native, Unix pipes |
| Best For | Complex automation, IDE users | Quick tasks, CLI users |

---

## 3. 📋 VERIFICATION REQUIREMENTS

### Required For Every Claim

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Animation works | Browser test showing smooth animation, correct timing, no jank, `prefers-reduced-motion` support | Code review, "should work" |
| Layout fixed | Screenshot/description at key breakpoints | CSS looks correct |
| Feature complete | Browser test of full user flow, no console errors | Implementation matches spec |
| Video loads | Video playing in browser, correct quality | HLS.js code looks correct |
| Mobile responsive | Tested at 320px, 768px viewports minimum | Looks good at 1920px |
| Multi-viewport | Tested at 375px, 768px, 1920px via Chrome emulation | Tested at one viewport only |
| Form submits | Form successfully submits, see success state | JavaScript code complete |
| No console errors | DevTools console clear | Code looks clean |
| Performance acceptable | Animations at 60fps, page loads < 3s | Code refactored |
| Click handlers work | Clicked in browser, saw expected result | Event listener attached |

### Browser Testing Matrix

**Automated browser testing (MCP or CLI) enables testing at all viewports:**

**Minimum verification for any frontend claim:**
```markdown
□ Chrome Desktop (1920px) - Primary viewport
□ Chrome Mobile emulation (375px) - iPhone viewport
□ DevTools Console - No errors
```

**Standard verification for production-ready work:**
```markdown
□ Chrome Desktop (1920px)
□ Chrome Tablet emulation (768px) - iPad viewport
□ Chrome Mobile emulation (375px) - iPhone viewport
□ DevTools Console clear at all viewports
□ Network tab shows no failed requests
□ Performance acceptable (no jank, smooth animations)
```

**Note:** Testing can be done via automated tools (Chrome DevTools MCP or workflows-chrome-devtools) or manual browser testing. Cross-browser testing beyond Chrome is out of scope for automated tools.

**Critical fixes require:**
```markdown
□ All standard verification above
□ Real mobile device testing (if emulation insufficient)
□ Edge cases tested (slow network via emulation, ad blockers)
□ Animations tested at different viewport transitions (320px, 375px, 768px, 1920px)
```

---

## 4. 📖 RULES

### ✅ ALWAYS

- Open actual browser to verify (automated OR manual - not just code review)
  - Automated: Use `mcp__chrome_devtools_*__navigate_page`
  - Manual: Open Chrome browser directly
- Test in Chrome at minimum (primary browser)
  - Note: MCP tools use Chrome automatically
- Test mobile viewport (375px minimum)
  - Automated: Use `resize_page` with width: 375, height: 667
  - Manual: Toggle device toolbar
- Check DevTools console for errors
  - Automated: Use `list_console_messages` and filter for type === "error"
  - Manual: Open Console tab in DevTools
- Test interactive elements by clicking them
  - Automated: Use `click` tool for automated interaction
  - Manual: Click elements in browser
- Watch full animation cycle to verify timing
  - Automated: Use `take_screenshot` at intervals or `wait_for` text to appear
  - Manual: Watch animation play in browser
- Test at key responsive breakpoints (320px, 768px, 1920px)
  - Automated: Use `resize_page` + `take_screenshot` for each breakpoint
  - Manual: Resize browser window
- **Animation verification:**
  - Test `prefers-reduced-motion` support (enable in OS accessibility settings)
  - Verify CSS-first approach used where possible
  - Check Motion.dev animations include retry logic and cleanup
  - Confirm easing curves match standards ([0.22, 1, 0.36, 1] or [0.16, 1, 0.3, 1])
- Note what you tested in your claim
  - Include whether automated or manual verification used
- Take screenshot if visual change
  - Automated: `take_screenshot` automatically saves images
  - Manual: Use browser screenshot tools
- Record any limitations
- **Prefer automated testing for speed and consistency** where applicable

### ❌ NEVER

- Claim "works" without opening browser
- Say "should work" or "probably works" - test it
- Trust code review alone for visual/interactive features
- Test only at one viewport size
- Ignore console warnings as "not important"
- Skip animation timing verification
- Assume desktop testing covers mobile
- Claim "cross-browser" without testing multiple browsers
- Express satisfaction before verification ("Great!", "Perfect!", "Done!")
- Use phrases implying success without evidence

### ⚠️ ESCALATE IF

- Cannot test in required browsers
- Real device testing required but unavailable
- Issue only reproduces in production
- Performance testing requires specialized tools
- Accessibility testing needed but not equipped
- Chrome DevTools MCP tools unavailable or not functioning
- Automated testing shows different results than manual testing
- Need cross-browser testing beyond Chrome (MCP is Chrome-only)

---

## 5. 🚨 RED FLAGS - STOP

If you catch yourself thinking:
- "Quick fix for now, test later"
- "Code looks correct, should work"
- "Tested desktop, mobile probably fine"
- "One browser is enough for this"
- "Animation looks close enough"
- "That console warning isn't important"
- "Can verify after deploy"
- "Looks good to me" (without testing)
- **"About to use words like 'Done', 'Complete', 'Fixed', 'Working', 'Ready' without having just tested"**

**ALL of these mean: STOP. Open browser and verify.**

---

## 6. 💡 KEY PATTERNS

### Pattern 1: Layout Changes

✅ **CORRECT:**
"Opened Chrome DevTools, tested at 320px/768px/1920px.
Header spacing now 24px at mobile (tested at 375px),
32px at desktop (tested at 1920px). Transitions smooth at
all breakpoints. No console errors. Layout matches design."

❌ **INCORRECT:**
"CSS updated, spacing looks correct"
"Should be 24px on mobile now"

### Pattern 2: Animation Implementation

✅ **CORRECT:**
"Tested in Chrome at 1920px. Page loader fades out over 800ms,
timing feels natural. Tested page refresh 5 times, animation
consistent. No jank detected. DevTools Performance shows 60fps
throughout. No console errors."

❌ **INCORRECT:**
"Animation code looks good"
"Timing should be correct now"
"Works in my browser"

### Pattern 3: Interactive Features

✅ **CORRECT:**
"Tested in Chrome at desktop (1920px), tablet (768px), and mobile (375px) viewports via Chrome DevTools MCP.
Navigation dropdown opens on click, closes on outside click.
Menu items navigate correctly. Mobile hamburger menu works.
All tested interactions successful. DevTools console clear at all viewports."

❌ **INCORRECT:**
"Event handlers attached correctly"
"Navigation should work now"
"Code implements all interactions"

### Pattern 4: Video/Media

✅ **CORRECT:**
"Tested in Chrome at desktop (1920px) and mobile (375px) viewports via Chrome DevTools MCP.
Hero video loads and plays automatically at desktop. HLS.js switches
quality appropriately. Video poster shows before playback.
Mobile (375px): Video plays on interaction. No console errors
at any viewport. Network tab shows successful HLS manifest loads."

❌ **INCORRECT:**
"HLS.js configured correctly"
"Video code looks good"
"Should autoplay now"

### Pattern 5: Multi-Viewport Testing

✅ **CORRECT:**
"Tested in Chrome at all key viewports via Chrome DevTools MCP:
✓ Desktop (1920px): Animations smooth, no console errors
✓ Tablet (768px): Animations smooth, no console errors
✓ Mobile (375px): Animations smooth, no console errors
All viewport transitions clean. Feature works identically
across all tested viewports."

❌ **INCORRECT:**
"Multi-viewport compatible"
"Works at desktop so should work on mobile"
"Used responsive CSS, compatible"

---

## 7. ⛔ COMMON RATIONALIZATIONS

| Excuse | Reality |
|--------|---------|
| "Code looks correct" | Code correctness ≠ browser behavior. Test it. |
| "Quick test later" | "Later" never comes. Test now. |
| "Works on my machine" | Your machine isn't production. Test properly. |
| "Linter passed" | Linter doesn't test browser behavior. |
| "Tested desktop" | Mobile is 50%+ of traffic. Test mobile too. |
| "One browser enough" | Users use different browsers. Test multiple. |
| "Animation close enough" | "Close enough" looks unprofessional. Get it right. |
| "Console warning not critical" | Warnings often indicate real problems. Don't ignore. |
| "Will verify after deploy" | Verify BEFORE deploy. Production is not testing. |
| "No time to test" | Time to fix after deploy > time to test now. |

---

## 8. 🏆 SUCCESS CRITERIA

**Verification is successful when:**
- ✅ Opened actual browser (not just reviewed code)
- ✅ Tested in multiple viewports (mobile + desktop minimum)
- ✅ Checked DevTools console (no errors)
- ✅ Tested interactions by actually clicking/hovering
- ✅ Watched full animation cycle (if applicable)
- ✅ Tested in multiple browsers (if claiming cross-browser)
- ✅ Documented what was tested in claim
- ✅ Can describe exactly what was seen in browser
- ✅ Noted any limitations or remaining work

**Quality gates:**
- Can you describe what you saw in browser?
- Did you test at mobile viewport?
- Is DevTools console clear?
- Did you test the actual user interaction?
- Did you verify animation timing by watching it?
- Can you confidently say it works because you saw it work?

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Verify implementations work correctly
- [debugging_workflows.md](./debugging_workflows.md) - Verify fixes work after debugging
- [shared_patterns.md](./shared_patterns.md) - Use standard DevTools verification patterns

### Templates
- [verification_checklist.md](../../assets/checklists/verification_checklist.md) - Printable verification checklist

### Related Skills
- `workflows-chrome-devtools` - CLI-based browser automation via browser-debugger-cli (bdg)

---

## 10. ✅ VERIFICATION CHECKLIST

**Before claiming any work complete, verify:**

```markdown
BROWSER TESTING:
□ Opened actual browser or used Chrome DevTools MCP (not just code review)
□ Tested in Chrome (only browser supported by MCP)
□ Used automated testing via MCP tools when applicable

VIEWPORT TESTING:
□ Tested at mobile viewport (375px minimum)
□ Tested at tablet viewport (768px)
□ Tested at desktop viewport (1920px)
□ Verified responsive transitions smooth

FUNCTIONALITY:
□ Tested actual user interactions (clicks, hovers, etc.)
□ Watched full animation cycle if animations present
□ Verified form submissions if forms present
□ Tested video/media playback if media present

CONSOLE/ERRORS:
□ DevTools console checked - no errors
□ DevTools console checked - no warnings (or documented)
□ Network tab checked - no failed requests

DOCUMENTATION:
□ Noted what was tested in claim statement
□ Documented any browser-specific behaviors
□ Noted any limitations or remaining work
□ Included viewport sizes tested

EVIDENCE:
□ Can describe exactly what was seen
□ Can state timing/behavior observed
□ Can confirm expected vs. actual behavior matched
```

**If you cannot check ALL boxes, your claim is premature. Verify first, claim second.**

---

**See also:** [verification_checklist.md](../../assets/checklists/verification_checklist.md) for printable checklist