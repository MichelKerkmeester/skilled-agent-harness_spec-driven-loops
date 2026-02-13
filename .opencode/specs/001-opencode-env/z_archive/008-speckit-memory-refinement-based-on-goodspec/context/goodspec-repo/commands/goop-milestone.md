---
name: goop-milestone
description: Start a new milestone
---

# /goop-milestone

**Manage project milestones.** Group features into a larger goal.

## Usage

```bash
/goop-milestone [start|status|list] [name]
```

## How It Works

Milestones are containers for multiple features/tasks. They help track progress towards a larger release.

### Commands
- `/goop-milestone start "v1.0 Release"`: Begin a new milestone.
- `/goop-milestone status`: Show milestone progress (burndown).
- `/goop-milestone list`: Show history.

### Workflow
1. **Start:** Define the milestone goal.
2. **Execute:** Run multiple `/goop-plan` -> `/goop-execute` cycles within the milestone.
3. **Track:** Aggregates status across all contained features.
4. **Complete:** Run `/goop-complete` to finish the milestone.

## Artifacts
- `.goopspec/MILESTONE.md`: Tracks overall progress and contained features.

## Example
> **User:** `/goop-milestone start "User Dashboard"`
> **Agent:** "Milestone 'User Dashboard' started.
> Plan your first feature with `/goop-plan`."
