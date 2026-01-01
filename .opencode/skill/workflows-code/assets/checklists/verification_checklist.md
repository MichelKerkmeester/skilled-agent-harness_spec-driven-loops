---
title: Browser Verification Checklist
description: Checklist for verifying work in browser before claiming completion
---

# Browser Verification Checklist

Use this checklist BEFORE claiming any work is complete, fixed, or working.

---

## 1. 📖 OVERVIEW

### Purpose

**The Iron Law**: Evidence in browser before claims, always. This checklist ensures all claims are backed by actual browser testing evidence.

### Usage

Use this checklist BEFORE claiming any work is complete, fixed, or working. Complete all applicable sections before making completion claims.

---

## 2. ⚠️ BEFORE CLAIMING ANYTHING

□ **I have opened an actual browser** (not just reviewed code)
□ **I have tested the actual functionality** (not assumed it works)
□ **I have seen it work with my own eyes** (not trusted code review)
□ **I can describe exactly what I saw** (have specific evidence)

**If you cannot check ALL four boxes above, your claim is premature.**

---

## 3. 🌐 BROWSER TESTING

### Minimum Requirements (ALWAYS REQUIRED)
□ Chrome Desktop (1920px) - Primary browser
□ Mobile emulation (375px) - iPhone viewport via DevTools
□ DevTools Console open and checked

### Standard Testing (Production Work)
□ Chrome Desktop (1920px)
□ Firefox Desktop (1920px)
□ Safari Desktop (1920px) - if macOS available
□ Mobile Chrome (375px) - via DevTools device emulation
□ Mobile Safari (375px) - via DevTools device emulation
□ Tablet viewport (768px) - iPad size

### Critical Fixes (High-Stakes Changes)
□ All standard testing above
□ Real mobile device (not just emulation)
□ Slow network simulation (Slow 3G in DevTools)
□ Different viewport transition points
- Edge cases (ad blockers, cache disabled)

---

## 4. 📱 VIEWPORT TESTING

□ Mobile viewport (375px minimum)
  - Tested actual interactions at this size
  - Scrolling smooth
  - No horizontal overflow
  - Touch targets large enough

□ Tablet viewport (768px)
  - Layout adapts correctly
  - Navigation usable
  - Content readable

□ Desktop viewport (1920px)
  - Full layout displays correctly
  - All features accessible
  - Performance acceptable

□ Breakpoint transitions (resize browser slowly)
  - 320px → 768px smooth
  - 768px → 1024px smooth
  - 1024px → 1920px smooth
  - No awkward intermediate states

---

## 5. 🎮 FUNCTIONALITY TESTING

### Interactive Elements
□ Clicked all buttons and links
□ Tested hover states
□ Tested focus states
□ Tested keyboard navigation
□ Verified tooltips appear
□ Tested dropdowns open/close

### Forms (if applicable)
□ Filled out all fields
□ Submitted form successfully
□ Saw success message
□ Tested validation errors
□ Tested error messages display

### Animations (if applicable)
□ Watched full animation cycle
□ Timing feels natural (not too fast/slow)
□ No jank or stuttering
□ Tested 3-5 times for consistency
□ Checked Performance tab shows 60fps

### Video/Media (if applicable)
□ Video loads and plays
□ Controls work correctly
□ Quality switches appropriately
□ Poster shows before playback
□ Mobile behavior correct (user-initiated play)
□ Tested in multiple browsers

### Navigation (if applicable)
□ All navigation links work
□ Mobile menu opens/closes
□ Transitions smooth
□ Back button works
□ Active states correct

---

## 6. 🐛 CONSOLE & ERRORS

### DevTools Console
□ Console open during all testing
□ **No red errors** (blocking failures)
□ **No yellow warnings** (or documented why acceptable)
□ No network errors in Console
□ Logged output makes sense

### Network Tab
□ All requests succeed (200, 304 status)
□ No 404 errors (missing resources)
□ No 500 errors (server failures)
□ No CORS errors
□ CDN resources load correctly
□ Timing acceptable

### Performance
□ Animations smooth (60fps target)
□ Page loads quickly (< 3 seconds target)
□ No janky scrolling
□ Images load progressively
□ No memory leaks during extended use

---

## 7. 📝 DOCUMENTATION

### Evidence Recorded
□ Noted which browsers tested
□ Listed viewport sizes tested
□ Described what was seen
□ Captured specific behavior observed
□ Documented timing/performance

### Claim Format
□ Stated what was tested explicitly
□ Example: "Tested in Chrome/Firefox at 1920px and 375px"
□ Included console status
□ Example: "DevTools console clear, no errors"
□ Noted any limitations
□ Example: "Safari not available, tested Chrome/Firefox only"

### Limitations
□ Documented browser-specific behaviors
□ Noted any remaining work
□ Listed what was NOT tested
□ Specified testing environment (local, staging, production)

---

## 8. 🚨 RED FLAGS AVOIDED

**Did NOT think:**
□ "Code looks correct, should work"
□ "Quick test later"
□ "Tested desktop, mobile probably fine"
□ "One browser is enough"
□ "Animation looks close enough"
□ "That console warning isn't important"
□ "Can verify after deploy"
□ "Looks good to me" (without actual testing)

**If you thought ANY of these → STOP and test properly.**

---

## 9. ✅ FINAL VERIFICATION

### Can You Answer These?
□ What exactly did you see in the browser?
□ Which browsers did you test?
□ What viewport sizes did you use?
□ Was the DevTools console clear?
□ Did you test the actual user interaction?
□ Can you describe the animation timing you observed?
□ Did you watch the full workflow from start to finish?

**If you cannot answer ALL questions above → Test more thoroughly.**

---

## 10. 💬 CLAIMING FORMAT

### ✅ CORRECT Claim:
```
Tested in Chrome at 1920px and 375px. Page loader fades out over
800ms, timing feels natural. Tested 5 page refreshes, animation
consistent. DevTools Performance shows 60fps. Console clear, no
errors. Mobile viewport transitions smooth.
```

### ❌ INCORRECT Claim:
```
Animation code looks good
Should work now
Timing appears correct
```

---

## 11. 💡 SPECIAL CASES

### Can't Open Browser
□ Described verification steps needed
□ Asked user to verify
□ Provided specific testing checklist
□ **Did NOT claim it works**
□ Stated limitation: "Code implemented but requires browser verification"

### Works Locally But Not Production
□ Hard refreshed (Cmd+Shift+R)
□ Verified CDN propagation
□ Checked different browser/incognito
□ Reviewed Webflow publish status
□ Compared local vs. production network requests

### Inconsistent Behavior
□ Hard refresh between tests
□ Tested in incognito mode
□ Added more logging
□ Checked Network tab timing
□ Used consistent viewport sizes

---

**Remember:** If you haven't tested it in a browser THIS SESSION, you cannot claim it works.

---

## 12. 🔗 RELATED RESOURCES

- [verification_workflows.md](../references/verification_workflows.md) - Full verification guide
- [quick_reference.md](../references/quick_reference.md) - Quick checklist
