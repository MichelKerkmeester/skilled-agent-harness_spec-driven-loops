---
name: progress-tracking
description: Track and report progress across phases and tasks
category: core
triggers:
  - progress
  - status
  - track
  - todo
version: 0.1.0
requires:
  - goop-core
---

# Progress Tracking Skill

## State Hierarchy

```
Project
└── Milestone
    └── Phase
        └── Plan
            └── Task
                └── Todo
```

## Tracking Files

### STATE.md

Central state file at `.goopspec/STATE.md`:

```markdown
# Project State

**Status:** Active
**Current Phase:** 2
**Current Plan:** feature-auth

## Progress

| Phase | Status | Tasks | Completion |
|-------|--------|-------|------------|
| 1 | Complete | 5/5 | 100% |
| 2 | In Progress | 2/4 | 50% |
| 3 | Pending | 0/3 | 0% |

## Active Todos

- [ ] Implement login endpoint
- [x] Create user model
- [ ] Add session management
```

### Checkpoints

Saved at `.goopspec/checkpoints/{id}.json`:

```json
{
  "id": "chk-abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "phase": "2",
  "spec_file": ".goopspec/phases/phase-2/SPEC.md",
  "todos": [
    { "id": "1", "content": "Implement login", "status": "in_progress" }
  ],
  "modified_files": ["src/auth/login.ts"],
  "context_usage": 45
}
```

## Progress Updates

### After Each Task

1. Update todo status
2. Record modified files
3. Update STATE.md completion percentage
4. Save checkpoint if configured

### After Each Plan

1. Mark plan as complete in state
2. Generate SUMMARY.md
3. Update phase progress
4. Commit state changes

### After Each Phase

1. Run verification against must-haves
2. Generate phase summary
3. Update milestone progress
4. Confirm with user before next phase

## Using goop_checkpoint Tool

```typescript
// Save checkpoint
goop_checkpoint({
  action: "save",
  name: "Before auth implementation"
})

// Load checkpoint
goop_checkpoint({
  action: "load",
  checkpoint_id: "chk-abc123"
})

// List checkpoints
goop_checkpoint({
  action: "list"
})
```

## Progress Visualization

### Console Output

```
⬢ GoopSpec · Phase 2 Progress
──────────────────────────────────────────────────────

Plan: feature-auth (2/4 tasks)
████████████░░░░░░░░░░░░░░░░░ 50%

☑ Task 1: Create user model
◉ Task 2: Implement login
○ Task 3: Add session management
○ Task 4: Write auth tests

Time elapsed: 15m
Estimated remaining: 20m

──────────────────────────────────────────────────────
```

## Metrics

Track these metrics:
- Tasks completed per hour
- Average task duration
- Deviation frequency
- Checkpoint frequency
- Context usage over time

## Best Practices

1. **Atomic updates:** Update state after each task, not batch
2. **Checkpoint often:** Before risky operations
3. **Clear status:** Use unambiguous status values
4. **Verify completions:** Don't mark done until verified
5. **Time tracking:** Log start/end for estimates
