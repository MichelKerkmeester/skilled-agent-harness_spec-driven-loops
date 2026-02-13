# Workflow: Execute Phase

**GoopSpec Voice:** Industrial, Atomic, Transparent.

The Execute phase answers: **Build exactly what the spec says.** Implementation happens in **Waves**.

## Position in Workflow

```
┌─────────────┐     ┌─────────────┐
│   EXECUTE   │ ──▶ │   ACCEPT    │
│   (Build)   │     │  (Verify)   │
└─────────────┘     └─────────────┘
       ↑
 (You are here)
```

## Core Protocol: The Wave Cycle

Execution is not a monolith. It is a series of controlled loops.

**1. The Wave:** A logical grouping of tasks (e.g., "Foundation", "Core", "Polish").
**2. The Task:** A single, atomic unit of work (one commit).
**3. The Checkpoint:** A mandatory pause for verification or decision.

### Orchestrator's Role (The Conductor)
*   **Delegate:** Hand tasks to `goop-executor` (Subagent).
*   **Track:** Update `CHRONICLE.md`.
*   **Verify:** Ensure tests pass between tasks.
*   **Correct:** Apply Deviation Rules (Auto-fix vs. Ask).

## Interaction Patterns

### 1. Progress Updates
Keep the user informed without spamming. Use "Inline Notices".

```text
⬢ Wave 1: Foundation
  ├─ ⚡ Task 1.1: Setup Provider... [DONE] (abc1234)
  └─ ⚡ Task 1.2: Login Component... [IN PROGRESS]
```

### 2. The Checkpoint Gate
When the blueprint calls for a pause, or a **Rule 4 (Architectural Decision)** is triggered.

```text
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🚧 CHECKPOINT REACHED                             │
│                                                    │
│  Task: Configure OAuth Callbacks                   │
│                                                    │
│  I need a callback URL for the production env.     │
│  Currently using: localhost:3000                   │
│                                                    │
│  ► Please provide the Production URL:              │
│                                                    │
╰────────────────────────────────────────────────────╯
```

### 3. Deviation Handling
*   **Rule 1-3 (Minor):** Auto-fix and log.
    *   `⬢ Notice: Auto-fixed missing import in auth.ts`
*   **Rule 4 (Major):** Stop and Ask (Checkpoint Gate).

## Output: CHRONICLE.md

The living history of execution.

```markdown
# Chronicle
## Wave 1 [COMPLETE]
- [x] Task 1.1 (commit: 7f8a9d)
- [x] Task 1.2 (commit: 3b2c1a)

## Wave 2 [IN PROGRESS]
- [ ] Task 2.1
```

## Commit Protocol

*   **Atomic:** One task = One commit.
*   **Conventional:** `feat(auth): add login form`.
*   **Verified:** Tests MUST pass (or be skipped with reason) before commit.

## Commands

| Command | Effect |
| :--- | :--- |
| `/goop-execute` | Start or resume execution. |
| `/goop-pause` | Pause at next safe checkpoint. |
| `/goop-status` | Show current Wave/Task progress. |
| `/goop-checkpoint` | Force a checkpoint save. |

## Memory Triggers

*   **Note:** Implementation details ("Used X library version Y").
*   **Observation:** Issues encountered and how they were fixed.

```javascript
memory_note({
  note: "Fixed build error in Task 1.2 by upgrading dependency Z."
})
```
