---
name: goop-execute
description: Begin wave-based execution
agent: goop-executor
spawn: true
phase: execute
next-step: "When all waves are complete, verify the work and request acceptance"
next-command: /goop-accept
alternatives:
  - command: /goop-status
    when: "To check current progress and wave status"
  - command: /goop-pause
    when: "To save a checkpoint and continue later"
---

# /goop-execute

**Start the Execution Phase.** Implement the blueprint using wave-based orchestration.

## Usage

```bash
/goop-execute
```

## How It Works

The **Orchestrator** takes control and manages the implementation process. It does not write code directly but delegates to the **Executor** agent.

### 1. Wave-Based Execution
Tasks are executed in sequential waves (vertical slices):
- **Wave 1:** Foundation (Core structure)
- **Wave 2:** Implementation (Main logic)
- **Wave 3:** Integration (Wiring it up)
- **Wave 4:** Polish (Refinement & fixes)

### 2. Orchestration Loop
For each task in `BLUEPRINT.md`:
1. **Delegate:** Send task to `goop-executor`.
2. **Monitor:** Watch for completion or blocks.
3. **Verify:** Run tests/checks.
4. **Update:** Mark task complete in `CHRONICLE.md`.

### 3. Deviation Handling
The Orchestrator applies rules for issues:
- **Rule 1-3 (Auto-fix):** Minor bugs, missing imports (fix and continue).
- **Rule 4 (Architectural):** Major blockers (PAUSE and ask user).

### 4. Checkpoints
If user input is needed, the system pauses and creates a checkpoint.
- **Decision:** User must choose between options (e.g., architecture trade-off).
- **Verification:** User must verify something (e.g., UI visual check).
- **Action:** User must perform an action (e.g., add API key).

## Output

- **Code:** Modified source files.
- **Commits:** Atomic commits per task.
- **Chronicle:** Updated `.goopspec/CHRONICLE.md`.

## Example

> **User:** `/goop-execute`
> **Agent:** "Starting Wave 1...
> [Task 1.1] Setup Auth Context... Done (commit: a1b2c3)
> [Task 1.2] Create Login Component... Done (commit: d4e5f6)
> Wave 1 Complete. Verification passed. Starting Wave 2..."

## Interactive Control
- Use `/goop-status` to check progress.
- Use `/goop-pause` to stop safely.
