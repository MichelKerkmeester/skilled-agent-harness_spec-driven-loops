/**
 * Phase 3: Execute prompt section
 * @module agents/prompt-sections/execute
 */

import type { WaveExecutionMode } from "../../core/types.js";

export function buildExecuteSection(waveExecution: WaveExecutionMode): string {
  const executionStrategy = waveExecution === "sequential" 
    ? buildSequentialStrategy() 
    : buildParallelStrategy();

  return `<Phase_3_Execute>
## Phase 3: Execute

**Goal**: Implement the plan through systematic wave-based execution.

### Memory-First Checks

Before executing a wave:
- Review SPEC/BLUEPRINT/CHRONICLE for scope and constraints
- Search memory for related implementations or decisions
- Confirm the spec is locked before proceeding

### Execution Strategy: ${waveExecution === "sequential" ? "Sequential Waves" : "Parallel Execution"}

${executionStrategy}

### Wave Execution Protocol

For each wave:

1. **Announce Wave Start**
   \`\`\`
   "Starting Wave [N]: [Description]
   Tasks: [list of tasks]"
   \`\`\`

2. **Execute Tasks**
   - Delegate via \`goop_delegate\` to **goop-executor** for implementation
   - Track progress with todo tools
   - Save checkpoints with \`goop_checkpoint\`

3. **Verify Wave Completion**
   - All tasks in wave marked complete
   - Tests pass (if applicable)
   - No regression introduced

4. **Report Wave Status**
   \`\`\`
   "Wave [N] Complete:
   - [Task 1]: Done
   - [Task 2]: Done
   
   Ready for Wave [N+1]?"
   \`\`\`

### Delegation via goop_delegate

When delegating tasks:
\`\`\`
goop_delegate({
  agent: "goop-executor",
  prompt: "Execute Task [X.Y]: [Name]",
  context: "\
Context:\n- [Relevant context from plan]\n\nRequirements:\n- [Specific requirements]\n- [UI patterns or design system guidance, if applicable]\n\nFiles to modify:\n- [file paths]\n\nAcceptance criteria:\n- [How to verify completion]\n\nConstraints:\n- Follow existing code patterns\n- Write clean, tested code\n- Document decisions in ADL\n- Respect decision gates; do not bypass Specify/Accept\n"
})
\`\`\`

### Handling Execution Issues

**If task fails or is blocked:**
1. Assess the issue
2. Check if it's a deviation (see Deviation Rules)
3. If auto-fixable: Apply fix, continue
4. If architectural: STOP, return to user for decision

**If scope creep detected:**
1. Note the additional work needed
2. Complete current task as specified
3. Report scope creep to user
4. Add to backlog or create new plan

### Progress Tracking

Maintain execution state:
- Use \`goop_status\` to check current state
- Use \`goop_checkpoint\` to save progress
- Use \`goop_adl\` to record decisions

### Transition to Phase 4

After all waves complete:
\`\`\`
"All waves executed:
- Wave 1: [summary] ✓
- Wave 2: [summary] ✓
- Wave 3: [summary] ✓

Moving to audit phase to verify against requirements."
\`\`\`

**Proceed to Phase 4 automatically (audit is required).**
</Phase_3_Execute>`;
}

function buildSequentialStrategy(): string {
  return `**Sequential Wave Execution** (Recommended)

Execute one wave at a time, verify before proceeding:

\`\`\`
Wave 1 → Verify → Wave 2 → Verify → Wave 3 → Verify → ...
\`\`\`

Benefits:
- Issues caught early before they compound
- Clear progress checkpoints
- Easier to rollback if needed
- Dependencies naturally satisfied

Rules:
- Complete ALL tasks in a wave before moving to next
- Verify each wave before proceeding
- If wave verification fails, fix before continuing`;
}

function buildParallelStrategy(): string {
  return `**Parallel Wave Execution** (Advanced)

Execute independent tasks in parallel, grouped by dependencies:

\`\`\`
Wave 1 (sequential - foundation)
  ↓
Wave 2 (parallel tasks within wave)
  ↓
Wave 3 (parallel tasks within wave)
\`\`\`

Benefits:
- Faster execution for large features
- Better resource utilization

Rules:
- Only parallelize tasks WITHOUT dependencies
- Still verify after each wave
- Merge conflicts are YOUR responsibility to resolve`;
}
