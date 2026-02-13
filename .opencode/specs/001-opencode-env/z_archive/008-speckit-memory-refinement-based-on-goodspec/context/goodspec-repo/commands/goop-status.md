---
name: goop-status
description: Show current GoopSpec status
---

# /goop-status

**Show project status.** View progress, active phase, and pending tasks.

## Usage

```bash
/goop-status [--verbose]
```

## How It Works

Displays a dashboard of the current GoopSpec session.

### Information Shown
- **Project State:** Initialized? Active Milestone?
- **Current Phase:** Discuss, Plan, Research, Specify, Execute, or Accept.
- **Progress:** Wave completion (e.g., "Wave 2 of 4").
- **Task Status:** Current active task and recent completions.
- **Gates:** Spec locked? Acceptance pending?

### Interactive Actions
From the status view, the agent often suggests the logical next command (e.g., "Execution complete. Run `/goop-accept` to verify.").

## Example Output

```
⬢ GoopSpec Status
─────────────────
Phase:    EXECUTE (Wave 2/4)
Task:     [2.1] Implement Login Handler (In Progress)
Milestone: Auth System v1

Progress:
[✓] Wave 1: Foundation
[→] Wave 2: Core Logic
    [✓] 2.1 Define types
    [→] 2.2 Implement handler
    [ ] 2.3 Add tests
[ ] Wave 3: Integration

Next: Finish Task 2.2
```

## Flags
- `--verbose`: Show full task history, memory stats, and recent deviations.
