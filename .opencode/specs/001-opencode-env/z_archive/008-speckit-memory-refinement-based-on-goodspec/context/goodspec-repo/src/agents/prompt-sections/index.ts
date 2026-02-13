/**
 * Prompt Section Composer
 * Builds the complete orchestrator prompt from modular sections
 * 
 * @module agents/prompt-sections/index
 */

import type { ResolvedResource, PhaseGateMode, WaveExecutionMode } from "../../core/types.js";
import { buildRoleSection } from "./role.js";
import { buildIntentGateSection } from "./intent-gate.js";
import { buildDiscussSection } from "./discuss.js";
import { buildPlanSection } from "./plan.js";
import { buildExecuteSection } from "./execute.js";
import { buildAuditSection } from "./audit.js";
import { buildConfirmSection } from "./confirm.js";
import { buildDelegationSection } from "./delegation.js";
import { buildConstraintsSection } from "./constraints.js";

export interface PromptBuildOptions {
  phaseGates: PhaseGateMode;
  waveExecution: WaveExecutionMode;
  availableAgents: ResolvedResource[];
  availableSkills: ResolvedResource[];
}

/**
 * Build the complete orchestrator prompt from modular sections
 */
export function buildOrchestratorPrompt(options: PromptBuildOptions): string {
  const { phaseGates, waveExecution, availableAgents, availableSkills } = options;

  const sections = [
    buildRoleSection(),
    buildWorkflowOverview(),
    buildIntentGateSection(),
    buildDiscussSection(),
    buildPlanSection(),
    buildExecuteSection(waveExecution),
    buildAuditSection(),
    buildConfirmSection(phaseGates),
    buildDelegationSection(availableAgents),
    buildSkillsSection(availableSkills),
    buildConstraintsSection(),
    buildToolsSection(),
  ];

  return sections.join("\n\n");
}

/**
 * Build workflow overview section
 */
function buildWorkflowOverview(): string {
  return `<Workflow_Overview>
## The 5-Phase Workflow

GoopSpec follows a structured spec-driven development workflow:

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Phase 1    │     │  Phase 2    │     │  Phase 3    │
│  DISCUSS    │ ──▶ │    PLAN     │ ──▶ │  EXECUTE    │
│ (Gather     │     │ (Create     │     │ (Wave-based │
│  reqs)      │     │  PLAN.md)   │     │  impl)      │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Phase 5    │     │  Phase 4    │
                    │  CONFIRM    │ ◀── │   AUDIT     │
                    │ (User       │     │ (Verify     │
                    │  approval)  │     │  against    │
                    └─────────────┘     │  spec)      │
                                        └─────────────┘
\`\`\`

**Phase 0**: Intent Gate (classify every incoming request)
**Phase 1**: Discuss (gather requirements, clarify scope)
**Phase 2**: Plan (create detailed execution plan)
**Phase 3**: Execute (wave-based implementation)
**Phase 4**: Audit (verify against requirements)
**Phase 5**: Confirm (get user approval)

### Key Principles

1. **Requirements First**: Never implement without clear requirements
2. **Plan Before Code**: Every feature needs a PLAN.md
3. **Verify Everything**: Audit ensures we built what was asked
4. **User Confirms**: Completion requires explicit approval
</Workflow_Overview>`;
}

/**
 * Build skills section based on available skills
 */
function buildSkillsSection(skills: ResolvedResource[]): string {
  if (skills.length === 0) {
    return `<Skills>
## Available Skills

Load domain knowledge with \`goop_skill\`:

\`\`\`
goop_skill({ skill: "skill-name" })
\`\`\`

Skills provide specialized knowledge for specific domains or technologies.
</Skills>`;
  }

  const skillList = skills
    .map(s => {
      const name = s.frontmatter.name || s.name;
      const desc = s.frontmatter.description || "Specialized knowledge";
      return `- **${name}**: ${desc}`;
    })
    .join("\n");

  return `<Skills>
## Available Skills

Load domain knowledge with \`goop_skill\`:

${skillList}

Usage:
\`\`\`
goop_skill({ skill: "skill-name" })
\`\`\`
</Skills>`;
}

/**
 * Build tools section
 */
function buildToolsSection(): string {
  return `<Tools>
## GoopSpec Tools

### goop_status
Check current workflow status:
\`\`\`
goop_status()
\`\`\`

### task
Delegate to specialized subagents:
\`\`\`
task({ subagent_type: "general", description: "Plan task", prompt: "..." })
\`\`\`

### goop_skill
Load domain knowledge:
\`\`\`
goop_skill({ skill: "skill-name" })
\`\`\`

### goop_checkpoint
Save/load execution state:
\`\`\`
goop_checkpoint({ action: "save", id: "checkpoint-id" })
goop_checkpoint({ action: "load", id: "checkpoint-id" })
\`\`\`

### goop_adl
Record architectural decisions:
\`\`\`
goop_adl({ 
  type: "decision",
  description: "Chose X over Y",
  action: "Using X because [reason]"
})
\`\`\`

### goop_spec
Read spec and plan files:
\`\`\`
goop_spec({ file: "SPEC.md" })
goop_spec({ file: "PLAN.md" })
\`\`\`

### Standard Tools
You also have access to standard tools:
- \`todowrite\` / \`todoread\` - Task tracking
- \`question\` - Ask user clarifying questions
- \`read\` / \`write\` / \`edit\` - File operations
- \`glob\` / \`grep\` - File searching
- \`bash\` - Command execution
- \`task\` - Native task delegation
</Tools>`;
}

// Re-export section builders for potential individual use
export { buildRoleSection } from "./role.js";
export { buildIntentGateSection } from "./intent-gate.js";
export { buildDiscussSection } from "./discuss.js";
export { buildPlanSection } from "./plan.js";
export { buildExecuteSection } from "./execute.js";
export { buildAuditSection } from "./audit.js";
export { buildConfirmSection } from "./confirm.js";
export { buildDelegationSection } from "./delegation.js";
export { buildConstraintsSection } from "./constraints.js";
