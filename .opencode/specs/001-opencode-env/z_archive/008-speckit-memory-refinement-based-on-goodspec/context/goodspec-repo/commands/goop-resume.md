---
name: goop-resume
description: Resume from a saved checkpoint
---

# /goop-resume

**Resume from a checkpoint.** Restore context and continue work.

## Usage

```bash
/goop-resume [checkpoint-id]
```

## How It Works

Loads a saved state, restores the workflow context, and prepares the agent to continue exactly where it left off.

### Behavior
- **No ID:** Resumes the most recent checkpoint.
- **With ID:** Resumes specific checkpoint (e.g., `/goop-resume cp-123`).

### What Happens
1. **Load State:** Reads the checkpoint JSON.
2. **Restore Context:** Re-initializes the Orchestrator at the correct phase/wave.
3. **Status Check:** Runs a quick status check to confirm environment matches.
4. **Prompt:** Reminds user of the next pending task.

## Example

> **User:** `/goop-resume`
> **Agent:** "Resuming session from 2 hours ago.
> Phase: Execute (Wave 2).
> Next Task: [2.2] Implement handler.
> Ready to continue?"
