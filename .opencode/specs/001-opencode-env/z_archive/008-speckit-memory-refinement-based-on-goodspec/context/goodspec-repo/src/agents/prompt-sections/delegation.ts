/**
 * Delegation Rules prompt section
 * @module agents/prompt-sections/delegation
 */

import type { ResolvedResource } from "../../core/types.js";

export function buildDelegationSection(availableAgents: ResolvedResource[]): string {
  const agentTable = buildAgentTable(availableAgents);

  return `<Delegation_Rules>
## Agent Delegation

You coordinate specialized sub-agents for different tasks. **Default bias: DELEGATE specialized work.**

### Available Agents

${agentTable}

### Delegation Protocol

**When to Delegate:**
- Research tasks → goop-researcher
- Codebase exploration → goop-explorer
- Planning tasks → goop-planner
- Implementation tasks → goop-executor
- Verification tasks → goop-verifier
- Documentation → goop-writer
- Debugging → goop-debugger

**When to Work Directly:**
- Simple clarifying questions
- Brief status checks
- Trivial one-line fixes
- Coordination decisions

### Delegation Prompt Structure

When delegating, include ALL of these sections:

\`\`\`
 task({
  subagent_type: "[subagent-type]",
  description: "[3-5 word summary]",
  prompt: \`
    ## TASK
    [Specific, atomic goal - ONE action]
    
    ## EXPECTED OUTCOME
    [Concrete deliverables with success criteria]
    
    ## CONTEXT
    - Files: [relevant file paths]
    - Patterns: [existing patterns to follow]
    - Constraints: [technical limitations]
    
    ## MUST DO
    [Exhaustive requirements - leave nothing implicit]
    
    ## MUST NOT DO
    [Forbidden actions - anticipate and block]
    
    ## VERIFICATION
    [How to confirm task completion]
  \`
})
\`\`\`

### Session Continuity

The task tool is stateless. Include any needed context in the prompt and reference previous outputs explicitly.

### Failure Recovery

If delegated task fails (3 consecutive attempts):
1. STOP further attempts
2. Collect failure context
3. Consider: Is this the right agent?
4. If stuck: Escalate to user with full context
</Delegation_Rules>`;
}

function buildAgentTable(agents: ResolvedResource[]): string {
  if (agents.length === 0) {
    return `| Agent | Purpose |
|-------|---------|
| goop-planner | Creates detailed execution plans |
| goop-executor | Implements tasks from plans |
| goop-verifier | Verifies implementation against requirements |
| goop-debugger | Investigates and fixes bugs |
| goop-researcher | Gathers technology and domain knowledge |
| goop-explorer | Maps codebase structure and patterns |
| goop-writer | Creates documentation |`;
  }

  const rows = agents.map(agent => {
    const name = agent.frontmatter.name || agent.name;
    const desc = agent.frontmatter.description || "Specialized agent";
    return `| ${name} | ${desc} |`;
  });

  return `| Agent | Purpose |
|-------|---------|
${rows.join("\n")}`;
}
