---
description: "Development lifecycle overview, phase transitions, and Phase 0 research methodology"
---
# How It Works

Core development lifecycle from research through verification, including phase transitions and the optional research phase.

## Development Lifecycle

Frontend development flows through phases with a mandatory quality gate:

```
Research (optional) -> Implementation -> Code Quality Gate -> Debugging (if issues) -> Verification (MANDATORY)
```

## Phase 0: Research (Optional)

**When to Use:** Complex performance issues, unfamiliar codebases, architectural decisions.

### Performance Audit Workflow

Before implementing performance fixes, conduct systematic analysis:

1. **Capture Baseline Metrics**
   - Run PageSpeed Insights (Mobile + Desktop)
   - Record: LCP, FCP, TBT, CLS, Speed Index
   - Screenshot the waterfall diagram

2. **Identify Root Cause**
   - Use 10-agent research methodology for comprehensive analysis
   - Map the critical rendering path
   - Identify blocking resources

3. **Document Constraints**
   - Platform limitations (Webflow, CMS, etc.)
   - Third-party dependencies
   - Business requirements

### 10-Agent Research Methodology

For complex codebase analysis, dispatch parallel agents:

| Agent | Focus Area                  |
| ----- | --------------------------- |
| 1     | HTML loading strategy       |
| 2     | JavaScript bundle inventory |
| 3     | Third-party scripts         |
| 4     | CSS performance             |
| 5     | LCP/Images analysis         |
| 6     | Above-fold resources        |
| 7     | Animation performance       |
| 8     | Initialization patterns     |
| 9     | External libraries          |
| 10    | Network waterfall           |

See: `references/research/multi_agent_patterns.md`

### Skip Phase 0 When
- Simple, isolated fixes
- Clear requirements with known solution
- Time-critical hotfixes

## Phase Detection (Where Am I?)

| Phase                 | You're here if...                      | Exit criteria                      |
| --------------------- | -------------------------------------- | ---------------------------------- |
| **0: Research**       | Complex issue, unfamiliar codebase     | Constraints documented, plan ready |
| **1: Implementation** | Writing/modifying code                 | Code written, builds               |
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing               |
| **2: Debugging**      | Code has bugs/failing tests            | All tests passing                  |
| **3: Verification**   | Tests pass, final validation           | Verified in browser                |

**Transitions:** 0->1 (plan ready) | 1->2 (bugs found) | 2->1 (missing code) | 2->3 (fixed) | 3->1/2 (issues found). Always end with Phase 3.

## Cross References
- [[implementation-workflow]] - Phase 1 and Phase 1.5 details
- [[debugging-workflow]] - Phase 2 details
- [[verification-workflow]] - Phase 3 details
- [[when-to-use]] - Phase triggers and activation
