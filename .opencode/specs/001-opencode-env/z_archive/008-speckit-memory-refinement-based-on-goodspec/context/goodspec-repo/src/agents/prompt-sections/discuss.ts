/**
 * Phase 1: Discuss prompt section
 * @module agents/prompt-sections/discuss
 */

export function buildDiscussSection(): string {
  return `<Phase_1_Discuss>
## Phase 1: Discuss

**Goal**: Build complete understanding of requirements before any planning or implementation.

### Memory-First Questioning

Before asking questions, check for existing context:
- Use \`memory_search\` for related past decisions or patterns
- Read current planning files (SPEC/BLUEPRINT/CHRONICLE) if they exist
- Ask if this work extends a prior decision or archived milestone

### What to Gather

1. **Functional Requirements**
   - What should the feature/change DO?
   - What are the inputs and outputs?
   - What are the edge cases?
   - What happens on errors?

2. **Non-Functional Requirements**
   - Performance expectations?
   - Security considerations?
   - Accessibility needs?
   - Compatibility requirements?

3. **Context & Constraints**
   - Why is this needed? What problem does it solve?
   - What existing code/patterns should be followed?
   - Any technical constraints or limitations?
   - Timeline or priority considerations?

4. **Acceptance Criteria**
   - How will we know it's "done"?
   - What tests should pass?
   - What should the user experience be?

5. **UI/UX Requirements (if applicable)**
   - Visual direction or existing design system?
   - Key UI patterns (cards, tables, modals, forms, navigation)
   - States: loading, empty, error, success
   - Responsive targets (mobile/tablet/desktop)

### Discussion Techniques

**Ask Open-Ended Questions**:
\`\`\`
"Can you walk me through how a user would interact with this?"
"What happens if [edge case]?"
"Are there any existing patterns in the codebase we should follow?"
"Is there a preferred UI pattern or visual direction we should match?"
\`\`\`

**Validate Understanding**:
\`\`\`
"Let me make sure I understand correctly:
- The feature should [summary]
- It needs to handle [edge cases]
- Success looks like [acceptance criteria]

Is that accurate?"
\`\`\`

**Challenge Assumptions**:
\`\`\`
"I notice you mentioned X. Have you considered Y as an alternative? 
It might be simpler because [reason]."
\`\`\`

### Research During Discussion

Use tools to gather context:
- \`goop_skill\` - Load relevant domain knowledge
- Delegate via the \`task\` tool for technology research
- Delegate via the \`task\` tool to understand existing codebase

### Output

By end of Phase 1, you should have:
- Clear understanding of all requirements
- Identified edge cases and error handling needs
- Agreement on acceptance criteria
- Any technical research completed

### Transition to Phase 2

When requirements are clear:
\`\`\`
"I have a clear picture of what we need:
[Summary of requirements]

Ready to move to planning? I'll create a detailed PLAN.md 
that breaks this into executable tasks."
\`\`\`

**Wait for user confirmation before proceeding to Phase 2.**
</Phase_1_Discuss>`;
}
