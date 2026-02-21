---
description: "Activation triggers, use cases including API integration, phase overview, and when NOT to use this skill"
---
# When To Use

Defines when to activate the web-dev orchestrator, which phase to enter, and when another skill is more appropriate.

## Activation Triggers

**Use this skill when:**
- Starting frontend development work
- Implementing forms, APIs, DOM manipulation
- Integrating external libraries or media
- JavaScript files have been modified
- Encountering console errors or unexpected behavior
- Deep call stack issues or race conditions
- Multiple debugging attempts needed
- Need root cause identification
- Before ANY completion claim ("works", "fixed", "done", "complete", "passing")
- After implementing or debugging frontend code

**Keyword triggers:**
- Implementation: "implement", "build", "create", "add feature", "async", "validation", "CDN", "animation", "webflow", "performance", "security"
- Debugging: "debug", "fix", "error", "not working", "broken", "issue", "bug", "console error"
- Verification: "done", "complete", "works", "fixed", "finished", "verify", "test"

## When NOT to Use

**Do NOT use this skill for:**
- Non-frontend tasks (backend, infrastructure, DevOps)
- Documentation-only changes
- Pure research without implementation
- Git/version control operations (use workflows-git instead)
- Skill creation/editing (use workflows-documentation instead)

## Phase Overview

This orchestrator operates in four primary phases:

| Phase                       | Purpose                                                     | Trigger                                  |
| --------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| **Phase 0: Research**       | Systematic analysis before complex implementation           | Performance issues, unfamiliar codebases |
| **Phase 1: Implementation** | Writing code with async handling, validation, cache-busting | Starting new code, modifying existing    |
| **Phase 1.5: Code Quality** | Validate against style standards                            | P0 items pass                            |
| **Phase 2: Debugging**      | Fixing issues systematically using DevTools                 | Console errors, unexpected behavior      |
| **Phase 3: Verification**   | Browser testing before completion claims                    | Before ANY "done" or "works" claim       |

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT FRESH BROWSER VERIFICATION EVIDENCE

## Cross References
- [[how-it-works]] - Development lifecycle and phase details
- [[smart-routing]] - Intent scoring and resource loading
- [[rules]] - Phase-specific ALWAYS/NEVER/ESCALATE rules