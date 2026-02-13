---
name: task-delegation
description: Patterns for delegating tasks to specialized agents
category: core
triggers:
  - delegate
  - spawn
  - subagent
  - task
version: 0.1.0
requires:
  - goop-core
---

# Task Delegation Skill

## When to Delegate

Delegate when:
- Task requires specialized expertise (testing, security, documentation)
- Context is getting bloated (>70% usage)
- Task can run in parallel with other work
- Fresh perspective needed

Don't delegate when:
- Task is trivial (<5 minutes)
- Heavy context sharing required
- Sequential dependency on current work

## Delegation Patterns

### Sequential Delegation

```json
{
  "mode": "sequential",
  "tasks": [
    { "agent": "planner", "task": "Create plan" },
    { "agent": "executor", "task": "Implement plan" },
    { "agent": "verifier", "task": "Verify implementation" }
  ]
}
```

### Parallel Delegation

```json
{
  "mode": "parallel",
  "max_concurrent": 3,
  "tasks": [
    { "agent": "executor", "task": "Implement feature A" },
    { "agent": "executor", "task": "Implement feature B" },
    { "agent": "tester", "task": "Write tests" }
  ]
}
```

### Background Delegation

```json
{
  "mode": "background",
  "agent": "researcher",
  "task": "Research best practices",
  "notify_on_complete": true
}
```

## Agent Selection

| Task Type | Agent | Model Tier |
|-----------|-------|------------|
| Planning | goop-planner | quality |
| Implementation | goop-executor | balanced |
| Verification | goop-verifier | quality |
| Research | goop-researcher | balanced |
| Documentation | goop-writer | budget |
| Testing | goop-tester | balanced |
| Debugging | goop-debugger | quality |
| Security | goop-verifier | quality |

## Context Handoff

When delegating, pass:
1. **Essential state:** Current phase, spec, todos
2. **Relevant files:** Only files the agent needs
3. **Recent decisions:** Last 3-5 ADL entries
4. **Constraints:** Boundaries, deadlines, blockers

Don't pass:
- Full conversation history
- Verbose logs
- Unrelated file contents
- Completed task details

## The Dispatch Tool (CRITICAL)

**ALWAYS use the native `task` tool to dispatch agents.**

```typescript
task({
  subagent_type: "goop-executor",  // Use goop-[agent-name]
  description: "Implement authentication",
  prompt: `
    ## TASK
    Implement user authentication

    ## CONTEXT
    - SPEC: .goopspec/SPEC.md
    - BLUEPRINT: .goopspec/BLUEPRINT.md
    
    ## REQUIREMENTS
    [Specific requirements from SPEC.md]
    
    ## VERIFICATION
    [How to confirm task completion]
  `
})
```

### Available subagent_types

| subagent_type | Use For |
|---------------|---------|
| `goop-executor` | Code implementation, features, fixes |
| `goop-explorer` | Fast codebase mapping, pattern detection |
| `goop-researcher` | Deep domain research, technology evaluation |
| `goop-planner` | Architecture design, blueprint creation |
| `goop-verifier` | Verification against spec, security audit |
| `goop-debugger` | Bug investigation, scientific debugging |
| `goop-tester` | Test writing, coverage analysis |
| `goop-designer` | UI/UX design, component architecture |
| `goop-writer` | Documentation, technical writing |
| `goop-librarian` | Code/docs search, information retrieval |
| `general` | Fallback for any task |

### Do NOT Use These Tools for Delegation

| Tool | Why NOT |
|------|---------|
| `delegate` | Different system (async delegation), NOT GoopSpec agents |
| `goop_delegate` alone | Only composes prompts, doesn't execute - must follow with `task` |

### Optional: goop_delegate for Rich Prompts

Use `goop_delegate` only when you need skills/references auto-injected:

```typescript
// Step 1: Compose prompt with goop_delegate (optional)
const result = goop_delegate({ agent: "goop-executor", prompt: "..." })
// Returns: <goop_delegation> JSON with composedPrompt

// Step 2: Execute with task (REQUIRED)
task({ subagent_type: "goop-executor", prompt: composedPrompt })
```

**For most cases: Just use `task` directly.**

## Error Handling

If delegated task fails:
1. Check error type (timeout, crash, assertion)
2. Save partial progress as checkpoint
3. Decide: retry, reassign, or escalate
4. Log failure to ADL if significant

## Best Practices

1. **Clear instructions:** Specific, unambiguous task descriptions
2. **Scoped context:** Only relevant information
3. **Defined success:** Clear verification criteria
4. **Timeout limits:** Set reasonable time bounds
5. **Progress tracking:** Monitor via todos/checkpoints
