/**
 * Phase 5: Confirm prompt section
 * @module agents/prompt-sections/confirm
 */

import type { PhaseGateMode } from "../../core/types.js";

export function buildConfirmSection(phaseGates: PhaseGateMode): string {
  const gateInstructions = buildGateInstructions(phaseGates);

  return `<Phase_5_Confirm>
## Phase 5: Confirm

**Goal**: Get explicit user confirmation that the work is complete and satisfactory.

### Memory-First Wrap-Up

Before presenting confirmation:
- Review CHRONICLE for completed tasks and checkpoints
- Check memory for recorded decisions or open items to close
- Ensure acceptance criteria are addressed

### Confirmation Gate Mode: ${phaseGates}

${gateInstructions}

### Final Confirmation Process

1. **Present Summary**
   \`\`\`
   "## Implementation Complete
   
   **Feature**: [Name]
   
   **What was implemented:**
   - [Summary of changes]
   
   **Files modified:**
   - [file list]
   
    **Verification status:**
    - All requirements met ✓
    - Tests passing ✓
    - Code quality verified ✓
    - UI checks verified (if applicable) ✓
   
   **Next steps:**
   - [Any follow-up tasks, if applicable]
   
   Is this implementation satisfactory?"
   \`\`\`

2. **Handle User Response**

    **If approved:**
    - Mark workflow as complete
    - Save final checkpoint
    - Update ADL with completion note
    - Persist outcome to memory
   
   **If changes requested:**
   - Clarify what needs adjustment
   - Determine if it's a fix or new scope
   - If fix: Return to appropriate phase
   - If new scope: Start new workflow

### Post-Completion Actions

After user confirms:

1. **Archive State**
   \`\`\`
   goop_checkpoint({
     action: "save",
     id: "completion-[timestamp]",
     context: { status: "completed", summary: "..." }
   })
   \`\`\`

2. **Update ADL**
   \`\`\`
   goop_adl({
     type: "decision",
     description: "Feature [X] completed",
     action: "Implementation approved by user"
   })
   \`\`\`

3. **Clean Up**
   - Clear workflow state
   - Ready for next task

### Workflow Complete

\`\`\`
"Feature [Name] is complete and confirmed.

Summary of work:
- [Brief summary]

ADL and checkpoints saved.
Ready for the next task!"
\`\`\`
</Phase_5_Confirm>`;
}

function buildGateInstructions(phaseGates: PhaseGateMode): string {
  switch (phaseGates) {
    case "strict":
      return `**Strict Mode**: User confirmation is REQUIRED at every phase transition.

- Phase 1 → Phase 2: User must approve requirements
- Phase 2 → Phase 3: User must approve plan
- Phase 3 → Phase 4: Automatic (audit is mandatory)
- Phase 4 → Phase 5: User must approve audit results

**Never skip confirmation gates in strict mode.**`;

    case "automatic":
      return `**Automatic Mode**: Flow through phases with checkpoints, minimal interruption.

- Save checkpoints at each phase transition
- User can interrupt at any time
- Final confirmation still required

**Proceed automatically unless blocked or user intervenes.**`;

    case "ask":
    default:
      return `**Ask Mode**: Determine gate behavior at project start.

At the beginning of each new feature/project, ask:
\`\`\`
"How would you like to handle phase transitions?

1. **Strict** - Confirm at each phase (recommended for critical features)
2. **Automatic** - Flow with checkpoints (faster, for trusted patterns)

Which mode for this feature?"
\`\`\`

Then follow the chosen mode for the duration of the workflow.`;
  }
}
