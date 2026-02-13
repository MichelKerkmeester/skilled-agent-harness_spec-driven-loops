# Agent Dispatch Patterns

GoopSpec supports multiple patterns for spawning and coordinating specialized agents. Choose the right pattern based on task characteristics.

## The Dispatch Tool (CRITICAL)

**ALWAYS use the native `task` tool to dispatch agents.**

```typescript
// Correct: Use task tool directly
task({
  subagent_type: "goop-executor",  // Agent to spawn
  description: "Implement auth",    // 3-5 word summary
  prompt: `[Detailed task...]`      // Full context and instructions
})
```

### Do NOT Use

| Tool | Why Not |
|------|---------|
| `delegate` | Different system (async delegation), not GoopSpec |
| `goop_delegate` alone | Only composes prompts, doesn't execute |

### Optional: goop_delegate for Prompt Composition

If you need help composing a rich prompt with skills/references injected:

```typescript
// Step 1: Compose prompt (optional)
goop_delegate({ agent: "goop-executor", prompt: "..." })
// Returns: <goop_delegation> with composedPrompt

// Step 2: Execute with task (REQUIRED)
task({ subagent_type: "goop-executor", prompt: composedPrompt })
```

**Most cases: Just use `task` directly.**

## Dispatch Modes

### Sequential Dispatch

**When:** Tasks have strict dependencies, order matters.

**Pattern:**
```
Task A → Complete → Task B → Complete → Task C
```

**Use for:**
- Database migrations before schema-dependent code
- Build before deploy
- Test before commit
- Setup before configuration

**Example:**
```json
{
  "mode": "sequential",
  "agents": [
    { "agent": "planner", "task": "Create migration plan" },
    { "agent": "executor", "task": "Run migrations" },
    { "agent": "verifier", "task": "Verify schema" }
  ]
}
```

### Parallel Dispatch

**When:** Tasks are independent, can run concurrently.

**Pattern:**
```
       ┌─ Task A ─┐
Start ─┼─ Task B ─┼─ Merge
       └─ Task C ─┘
```

**Use for:**
- Independent feature implementations
- Multiple test suites
- Documentation + implementation
- Research across different domains

**Example:**
```json
{
  "mode": "parallel",
  "max_concurrent": 3,
  "agents": [
    { "agent": "executor", "task": "Implement auth module" },
    { "agent": "executor", "task": "Implement user module" },
    { "agent": "tester", "task": "Write integration tests" }
  ]
}
```

### Background Dispatch

**When:** Long-running tasks that shouldn't block main flow.

**Pattern:**
```
Main Flow ───────────────────────────────►
              ↓
         Background Task ──────► Notify on complete
```

**Use for:**
- Research tasks
- Large test suites
- Documentation generation
- Code analysis

**Example:**
```json
{
  "mode": "background",
  "agent": "researcher",
  "task": "Research authentication best practices",
  "notify_on_complete": true
}
```

## Agent Selection

### By Task Type

| Task Type | Primary Agent | Fallback |
|-----------|--------------|----------|
| Planning | goop-planner | goop-orchestrator |
| Implementation | goop-executor | goop-orchestrator |
| Verification | goop-verifier | goop-tester |
| Research | goop-researcher | goop-explorer |
| Documentation | goop-writer | goop-orchestrator |
| Debugging | goop-debugger | goop-executor |
| UI/UX | goop-designer | goop-executor |
| Testing | goop-tester | goop-verifier |

### By Complexity

| Complexity | Model Profile | Context Budget |
|------------|--------------|----------------|
| Simple | budget | 40% |
| Standard | balanced | 60% |
| Complex | quality | 80% |
| Critical | quality + thinking | 90% |

## Wave Execution

Plans are grouped into waves for efficient parallel execution:

```
Wave 1: Foundation (sequential dependencies)
  ├─ Plan A (infrastructure)
  └─ Plan B (database setup)

Wave 2: Features (parallel, depends on Wave 1)
  ├─ Plan C (auth feature)
  ├─ Plan D (user feature)
  └─ Plan E (API feature)

Wave 3: Integration (depends on Wave 2)
  └─ Plan F (integration tests)
```

### Wave Metadata

Each plan specifies its wave in frontmatter:
```yaml
---
wave: 2
depends_on: [plan-a, plan-b]
autonomous: true
---
```

## Fresh Context Strategy

**When to spawn fresh agents:**
1. Context usage exceeds 70%
2. Switching to different task domain
3. Starting a new phase
4. After checkpoint restoration

**Context handoff:**
- Pass essential state (phase, spec, todos)
- Include recent ADL decisions
- Summarize previous progress
- Exclude verbose logs

## Error Handling

### On Agent Failure

1. Log failure to state
2. Save checkpoint
3. Attempt recovery:
   - Retry with fresh context
   - Fallback to different agent
   - Escalate to user

### On Timeout

1. Check for partial progress
2. Save checkpoint with partial state
3. Notify user with options:
   - Resume from checkpoint
   - Retry task
   - Skip and continue
