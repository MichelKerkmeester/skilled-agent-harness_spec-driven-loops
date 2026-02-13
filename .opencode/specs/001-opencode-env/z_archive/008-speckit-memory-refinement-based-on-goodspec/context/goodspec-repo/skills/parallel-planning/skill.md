---
name: parallel-planning
description: Plan for parallel execution and wave-based scheduling
category: core
triggers:
  - parallel
  - wave
  - concurrent
  - batch
version: 0.1.0
requires:
  - goop-core
  - task-decomposition
---

# Parallel Planning Skill

## Wave-Based Execution Model

```
Wave 1    Wave 2    Wave 3
[A]       [C]       [F]
[B]       [D]       
          [E]       

A,B parallel → C,D,E parallel → F sequential
```

## Identifying Parallelism

### Independent Tasks
Tasks with no shared:
- Files being modified
- Database tables being changed
- External resources being accessed
- State being mutated

### Parallel Candidates
- Different feature modules
- Read-only operations
- Documentation tasks
- Test suites for different modules

### Sequential Requirements
- Schema migration before data access
- Build before deploy
- Tests before commit

## Plan Frontmatter

```yaml
---
phase: 1
plan: feature-auth
wave: 2
depends_on: [setup-db, config-env]
autonomous: true
files_modified:
  - src/auth/login.ts
  - src/auth/session.ts
---
```

## Wave Assignment Rules

### Wave 1: Foundation
- No external dependencies
- Setup and configuration
- Schema definitions

### Wave 2: Core Implementation
- Depends on Wave 1
- Main feature development
- Can be parallel within wave

### Wave 3: Integration
- Depends on Wave 2
- Cross-cutting concerns
- E2E tests

### Wave N: Cleanup
- Final polish
- Documentation
- Performance optimization

## Conflict Detection

### File Conflicts
Two plans modifying same file cannot be parallel.

```yaml
# Plan A
files_modified: [src/user.ts, src/auth.ts]

# Plan B
files_modified: [src/auth.ts, src/session.ts]

# Conflict: src/auth.ts - must be sequential
```

### Resource Conflicts
Two plans using same external resource.

```yaml
# Plan A: Migrate database
# Plan B: Seed test data

# Conflict: Both modify database - sequential
```

## Execution Strategies

### Conservative (Default)
- Maximum 2 parallel agents
- Wait for wave completion
- Checkpoint between waves

### Aggressive
- Maximum 4 parallel agents
- Start next wave early when possible
- Minimal checkpoints

### Budget
- Sequential execution only
- Minimize resource usage
- Maximum checkpoints

## Using goop_wave_execute

```typescript
goop_wave_execute({
  phase: "1",
  gaps_only: false,
  max_parallel: 3
})
```

Response:
```json
{
  "waves": [
    {
      "wave": 1,
      "plans": ["setup-PLAN", "config-PLAN"],
      "description": "Foundation setup"
    },
    {
      "wave": 2,
      "plans": ["auth-PLAN", "user-PLAN"],
      "description": "Core features"
    }
  ]
}
```

## Merge Strategy

After parallel execution:
1. Verify no conflicts in modified files
2. Run all tests to catch integration issues
3. Resolve any merge conflicts
4. Create consolidated checkpoint

## Best Practices

1. **Conservative parallelism** - Start with 2 parallel, increase if stable
2. **Clear boundaries** - No file overlap between parallel plans
3. **Fail fast** - Stop wave on first failure
4. **Checkpoint between waves** - Recovery points
5. **Monitor resources** - Don't exceed API limits
