---
description: "ALWAYS/NEVER/ESCALATE rules for all development phases: implementation, code quality, debugging, and verification"
---
# Rules

Phase-specific behavioral rules governing what to always do, never do, and when to escalate.

## Phase 1: Implementation

### ALWAYS
- Wait for actual conditions, not arbitrary timeouts (include timeout limits)
- Validate all inputs: function parameters, API responses, DOM elements
- Sanitize user input before storing or displaying
- Update CDN versions after JavaScript modifications
- Use optional chaining (`?.`) and try/catch for safe access
- Log meaningful success/error messages
- Use validated timing constants: 64ms throttle (pointer), 180ms debounce (validation), 200ms debounce (resize), 0.1 IntersectionObserver threshold

### NEVER
- Use `setTimeout` without documenting WHY
- Assume data exists without checking
- Trust external data without validation
- Use innerHTML with unsanitized data
- Skip CDN version updates after JS changes

### ESCALATE IF
- Condition never becomes true (infinite wait)
- Validation logic becoming too complex
- Security concerns with XSS or injection attacks
- Script reports no HTML files found
- CDN version cannot be determined

See `references/implementation/implementation_workflows.md` for detailed rules.

## Phase 1.5: Code Quality Gate (MANDATORY for all code files)

### ALWAYS
- Load code_quality_checklist.md before claiming implementation complete
- Identify file type (JavaScript -> Sections 2-7, CSS -> Section 8)
- Validate all P0 items for the applicable file type
- Fix P0 violations before proceeding
- Document any P1/P2 deferrals with reasons
- Use code_style_enforcement.md for remediation guidance

### NEVER (JavaScript)
- Skip the quality gate for "simple" changes
- Claim completion with P0 violations
- Use commented-out code (delete it)
- Use camelCase for variables/functions (use snake_case)
- Skip file headers or section organization

### NEVER (CSS)
- Use generic custom property names without semantic prefixes
- Omit case-insensitivity flag `i` on data attribute selectors
- Use inconsistent BEM naming (mix snake_case, camelCase)
- Animate layout properties (width, height, top, left, padding, margin)
- Set `will-change` permanently in CSS (set dynamically via JS)

### ESCALATE IF
- Cannot fix a P0 violation
- Standard conflicts with existing code patterns
- Unclear whether code is compliant

See `assets/checklists/code_quality_checklist.md` and `references/standards/code_style_enforcement.md` for detailed rules.

## Phase 2: Debugging

### ALWAYS
- Open DevTools console BEFORE attempting fixes
- Read complete error messages and stack traces
- Test across multiple viewports (375px, 768px, 1920px)
- Test one change at a time
- Trace backward from symptom to root cause
- Document root cause in comments
- Remember: RAF auto-throttles to ~1fps in background tabs (no manual visibility checks needed)

### NEVER
- Skip console error messages
- Change multiple things simultaneously
- Proceed with 4th fix without questioning approach
- Fix only symptoms without tracing root cause
- Leave production console.log statements

### ESCALATE IF
- Bug only occurs in production
- Issue requires changing Webflow-generated code
- Cross-browser compatibility cannot be achieved
- Bug intermittent despite extensive logging
- Cannot trace backward (dead end)
- Root cause in third-party library

See `references/debugging/debugging_workflows.md` for detailed rules.

## Phase 3: Verification (MANDATORY)

### ALWAYS
- Open actual browser to verify (not just code review)
- Test mobile viewport (375px minimum)
- Check DevTools console for errors
- Test interactive elements by clicking them
- Note what you tested in your claim

### NEVER
- Claim "works" without opening browser
- Say "should work" or "probably works" - test it
- Test only at one viewport size
- Assume desktop testing covers mobile
- Express satisfaction before verification

### ESCALATE IF
- Cannot test in required browsers
- Real device testing required but unavailable
- Issue only reproduces in production
- Performance testing requires specialized tools

See `references/verification/verification_workflows.md` for detailed rules.

## Error Recovery

See `references/debugging/error_recovery.md` for CDN upload, minification, and version mismatch recovery procedures.

## Cross References
- [[implementation-workflow]] - Phase 1 and 1.5 workflow details
- [[debugging-workflow]] - Phase 2 workflow details
- [[verification-workflow]] - Phase 3 workflow details
- [[success-criteria]] - Completion gates that rules enforce
