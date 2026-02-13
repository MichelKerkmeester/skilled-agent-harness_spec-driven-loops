---
name: goop-amend
description: Propose changes to a locked specification
---

# /goop-amend

**Modify a locked specification.** Manage scope creep responsibly.

## Usage

```bash
/goop-amend [description of change]
```

## How It Works

Once a spec is locked via `/goop-specify`, it cannot be silently changed. `/goop-amend` provides a formal process to alter the contract.

### 1. Change Request
User proposes a change (e.g., "Add password reset button").

### 2. Impact Analysis
The agent analyzes the impact:
- **Scope:** Does this add new tasks?
- **Risk:** Does it break existing work?
- **Timeline:** How much longer will it take?

### 3. Decision
The agent presents the impact and asks for confirmation.
- **Confirm:** Update SPEC.md and BLUEPRINT.md.
- **Defer:** Add to a future milestone/task.
- **Cancel:** Abort change.

## Artifacts Updated
- `SPEC.md`: Adds an "Amendment" entry.
- `BLUEPRINT.md`: Adds/Removes tasks.
- `CHRONICLE.md`: Logs the scope change.

## Example

> **User:** `/goop-amend We need a 'Forgot Password' link`
> **Agent:** "Impact: Adds ~2 hours. Requires new API endpoint.
> Confirm amendment?"
> **User:** `confirm`
> **Agent:** "Spec updated. New tasks added to Wave 2."
