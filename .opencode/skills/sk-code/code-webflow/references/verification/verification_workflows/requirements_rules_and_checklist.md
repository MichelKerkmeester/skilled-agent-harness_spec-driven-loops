---
title: Requirements, Rules, Red Flags, Patterns & Checklist
description: Browser verification requirements for all completion claims - no exceptions. — Requirements, Rules, Red Flags, Patterns & Checklist.
trigger_phrases:
  - "requirements rules and checklist"
  - "requirements rules and checklist webflow"
  - "requirements rules and checklist reference"
importance_tier: normal
contextType: implementation
version: 3.5.0.8
---


# Requirements, Rules, Red Flags, Patterns & Checklist

Browser verification requirements for all completion claims - no exceptions.

---

## 1. OVERVIEW

### Purpose

Provides the detailed requirements, rules, red flags, patterns & checklist guidance for the broader Webflow workflow.

### When to Use

- Use this reference when applying or troubleshooting the documented requirements, rules, red flags, patterns & checklist practices.

---

## 2. VERIFICATION REQUIREMENTS

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
□ Chrome Tablet emulation (991px) - Webflow tablet breakpoint
□ Chrome Mobile emulation (375px) - iPhone viewport
□ DevTools Console clear at all viewports
□ Network tab shows no failed requests
□ Performance acceptable (no jank, smooth animations)
```

**Note:** Testing can be done via automated tools (Chrome DevTools MCP or mcp-chrome-devtools) or manual browser testing. Cross-browser testing beyond Chrome is out of scope for automated tools.

**Critical fixes require:**
```markdown
□ All standard verification above
□ Real mobile device testing (if emulation insufficient)
□ Edge cases tested (slow network via emulation, ad blockers)
□ Animations tested at different viewport transitions (320px, 375px, 768px, 1920px)
```

---

## 3. RULES

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

> **Cross-stack motion.dev reference**: For Motion API behavior, reduced-motion patterns, and animation regression checks that apply beyond Webflow, see [`../../animation/performance_and_pitfalls.md`](../../animation/performance_and_pitfalls.md) and [`../../animation/integration_patterns.md`](../../animation/integration_patterns.md). The Webflow verification rules here remain authoritative for browser evidence and Webflow-specific completion claims.

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

## 4. RED FLAGS - STOP

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

## 5. KEY PATTERNS

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

## 6. COMMON RATIONALIZATIONS

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

## 7. SUCCESS CRITERIA

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

## 8. VERIFICATION CHECKLIST

**Before claiming any work complete, verify:**

```markdown
BROWSER TESTING:
□ Opened actual browser or used Chrome DevTools MCP (not just code review)
□ Tested in Chrome (only browser supported by MCP)
□ Used automated testing via MCP tools when applicable

VIEWPORT TESTING:
□ Tested at mobile viewport (375px minimum)
□ Tested at tablet viewport (991px)
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

## 9. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](../../implementation/implementation_workflows/condition_based_waiting.md) - Verify implementations work correctly
- [debugging_workflows.md](../../debugging/debugging_workflows/systematic_four_phases.md) - Verify fixes work after debugging
- [dev_workflow.md](../../shared/dev_workflow/overview_nav_and_logging.md) - Use standard DevTools verification patterns

### Templates
- [verification_checklist.md](../../../assets/webflow-verification_checklist.md) - Printable verification checklist

### Related Skills
- `mcp-chrome-devtools` - CLI-based browser automation via browser-debugger-cli (bdg)

---

**See also:** [verification_checklist.md](../../../assets/webflow-verification_checklist.md) for printable checklist
