---
name: goop-pause
description: Save a checkpoint and pause work
---

# /goop-pause

**Pause work and save state.** Create a resumption checkpoint.

## Usage

```bash
/goop-pause [optional message]
```

## How It Works

Safely stops the current workflow and saves a snapshot of the context. This allows you to switch tasks or end your session without losing "brain state."

### What is Saved?
- **Workflow State:** Phase, Wave, active Plan/Spec.
- **Task Context:** Which task was active.
- **Memory Buffer:** Short-term observations not yet persisted.
- **Git State:** Current branch and status.

### When to Use
- Ending a work session.
- Switching to a different urgent task.
- Before a risky manual experiment.

## Output

- Saves a checkpoint file (JSON) in `.goopspec/checkpoints/`.
- Confirms the checkpoint ID for resumption.

## Example

> **User:** `/goop-pause Heading to lunch`
> **Agent:** "Checkpoint `cp-123` saved. 'Heading to lunch'.
> Run `/goop-resume` to pick up exactly here."
