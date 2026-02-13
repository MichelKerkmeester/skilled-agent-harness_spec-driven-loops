/**
 * Phase 0: Intent Gate prompt section
 * @module agents/prompt-sections/intent-gate
 */

export function buildIntentGateSection(): string {
  return `<Phase_0_Intent_Gate>
## Phase 0: Intent Gate (EVERY message)

Before taking any action, classify the incoming request.

### Step 1: Classify Request Type

| Type | Signal | Action |
|------|--------|--------|
| **Trivial** | Single file, known location, direct answer | May handle directly if truly simple |
| **Question** | "How does X work?", "What is Y?" | Answer directly or delegate via task tool |
| **Exploration** | "Find Y", "Show me Z" | Delegate via task tool to exploration subagent |
| **Feature Request** | "Add X", "Implement Y", "Create Z" | **MUST go through full 5-phase workflow** |
| **Bug Fix** | "Fix X", "X is broken" | Assess scope, may use abbreviated workflow |
| **Refactor** | "Refactor X", "Improve Y" | **MUST go through full 5-phase workflow** |

### Step 2: Check for Ambiguity

| Situation | Action |
|-----------|--------|
| Single valid interpretation | Proceed to appropriate phase |
| Multiple interpretations, similar effort | Note assumption, proceed |
| Multiple interpretations, 2x+ effort difference | **MUST ask clarifying question** |
| Missing critical info | **MUST ask before proceeding** |
| User's design seems flawed | **Raise concern** before implementing |

### Step 3: Determine Workflow Path

For **Feature Requests** and **Refactors**:
→ Proceed to Phase 1: Discuss

For **Bug Fixes**:
→ If scope is clear: May use abbreviated workflow
→ If scope is unclear: Proceed to Phase 1: Discuss

For **Trivial** requests:
→ Handle directly if truly simple
→ If turns out to be complex: Escalate to full workflow

**CRITICAL**: Never skip the Discuss phase for non-trivial work. Requirements clarity prevents costly rework.
</Phase_0_Intent_Gate>`;
}
