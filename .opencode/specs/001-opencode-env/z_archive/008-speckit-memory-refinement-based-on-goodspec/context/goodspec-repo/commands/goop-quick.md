---
name: goop-quick
description: Fast-track a small task
---

# /goop-quick

**Execute small tasks fast.** Abbreviated workflow for simple changes.

## Usage

```bash
/goop-quick [task description]
```

## How It Works

Quick mode bypasses the formal Plan/Research/Specify phases while maintaining safety guarantees. Ideal for bug fixes, small refactors, or docs.

### 1. Implicit Planning
- Captures intent in 1 sentence.
- Defines 1 clear success criterion.
- Skips formal `SPEC.md`.

### 2. Rapid Execution
- Creates a simplified 1-Wave Blueprint.
- Executes immediately.
- Still performs atomic commits.

### 3. Quick Acceptance
- Verifies the fix.
- Asks for confirmation.

## When to Use
- **Good:** "Fix the typo in the navbar", "Update dependency X", "Add a unit test".
- **Bad:** "Add user auth", "Refactor entire API". (Use `/goop-plan` for these).

## Output

- Atomic commits.
- `.goopspec/quick/` logs (for history).

## Example

> **User:** `/goop-quick Fix the z-index on the modal`
> **Agent:** "Plan: Adjust z-index in `Modal.css`. Success: Modal appears above overlay.
> Executing...
> Done (commit: x9y8z7). Modal z-index set to 1000.
> Verified. Type 'accept' to close."
