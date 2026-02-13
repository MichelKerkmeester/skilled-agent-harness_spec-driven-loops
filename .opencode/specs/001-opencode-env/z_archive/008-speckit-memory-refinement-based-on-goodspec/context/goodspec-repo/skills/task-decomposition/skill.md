---
name: task-decomposition
description: Break down complex tasks into manageable units
category: core
triggers:
  - decompose
  - breakdown
  - split
  - tasks
version: 0.1.0
requires:
  - goop-core
---

# Task Decomposition Skill

## Decomposition Principles

### 1. Single Responsibility
Each task does one thing well.

### 2. Independently Testable
Each task can be verified in isolation.

### 3. Clear Boundaries
No ambiguity about where one task ends and another begins.

### 4. Reasonable Size
Tasks should take 15-60 minutes, not hours or days.

### 5. Dependency Awareness
Identify genuine dependencies, avoid false chains.

## Decomposition Process

### Step 1: Identify the Goal
What is the end state? What problem are we solving?

### Step 2: List Major Components
What are the big pieces that make up the solution?

### Step 3: Break Into Tasks
For each component, what specific work items exist?

### Step 4: Identify Dependencies
Which tasks must complete before others can start?

### Step 5: Estimate Complexity
Rate each task: Small (15m), Medium (30m), Large (60m)

### Step 6: Group Into Waves
Parallel tasks in same wave, sequential across waves.

## Task Granularity Guide

### Too Large
❌ "Implement authentication system"

### Just Right
✓ "Create user model with password hashing"
✓ "Implement login endpoint"
✓ "Add session management"
✓ "Write authentication tests"

### Too Small
❌ "Add email field to user model"
❌ "Import bcrypt library"

## Task Format

```xml
<task type="auto">
### Task 1: {Verb + Object}

**Description:**
{2-3 sentences explaining what and why}

**Files:**
- `path/to/file.ts`

**Verify:**
```bash
npm test -- --testPathPattern=feature
```

**Done:**
- [ ] Criterion 1
- [ ] Criterion 2
</task>
```

## Dependency Types

### Hard Dependency
Task B literally cannot start until Task A completes.
```
Task A: Create database schema
Task B: Implement repository (needs schema)
```

### Soft Dependency
Task B is easier if Task A completes first, but not required.
```
Task A: Set up linting
Task B: Implement feature (can work without linting)
```

### No Dependency
Tasks are completely independent.
```
Task A: Implement auth
Task B: Implement logging
```

## Wave Planning

```
Wave 1: Foundation (no dependencies)
├── Setup project structure
├── Configure database
└── Set up testing framework

Wave 2: Core Features (depends on Wave 1)
├── Implement user model
├── Implement auth endpoints
└── Implement session management

Wave 3: Integration (depends on Wave 2)
├── Connect frontend to auth
└── Write E2E tests
```

## Anti-Patterns

### Kitchen Sink Task
❌ Task includes too many unrelated items.

### Vague Task
❌ "Make it work" or "Fix the thing"

### Circular Dependencies
❌ Task A needs B, Task B needs A.

### Premature Optimization
❌ "Optimize database queries" before queries exist.

## Best Practices

1. **Start with verifiable tasks** - If you can't verify it, it's too vague
2. **Vertical slices** - Complete user-visible features
3. **Front-load risks** - Tackle uncertain tasks early
4. **Include verification** - Every task has a "done" check
5. **Buffer time** - Plan 80% capacity, leave room for surprises
