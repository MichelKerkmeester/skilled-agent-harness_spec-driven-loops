---
description: "Phase 3 mandatory browser verification including layout inspection, accessibility audit, testing matrix, and completion gate"
---
# Verification Workflow

Phase 3 of the development lifecycle. MANDATORY before any completion claim. No exceptions.

## The Gate Function

BEFORE claiming any status:

1. IDENTIFY: What command/action proves this claim?
2. OPEN: Launch actual browser
3. TEST: Execute the interaction
4. VERIFY: Does browser show expected behavior?
5. VERIFY: Multi-viewport check (mobile + desktop)
6. VERIFY: Cross-browser check (if critical)
7. RECORD: Note what you saw
8. ONLY THEN: Make the claim

## Browser Testing Matrix

### Minimum (ALWAYS REQUIRED)

- Chrome Desktop (1920px)
- Mobile emulation (375px)
- DevTools Console - No errors

### Standard (Production work)

- Chrome Desktop (1920px)
- Chrome Tablet emulation (991px)
- Chrome Mobile emulation (375px)
- DevTools console clear at all viewports

See `references/verification/verification_workflows.md` for complete requirements.

## Cross References
- [[how-it-works]] - Lifecycle overview and why Phase 3 is mandatory
- [[rules]] - ALWAYS/NEVER/ESCALATE rules for verification
- [[success-criteria]] - Performance targets and completion checklists
- [[debugging-workflow]] - Phase 2 if verification reveals issues