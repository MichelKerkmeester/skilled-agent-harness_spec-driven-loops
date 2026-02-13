---
name: goop-accept
description: Verify work and request acceptance
phase: accept
next-step: "Once accepted, the workflow is complete and returns to idle"
next-command: /goop-complete
alternatives:
  - command: /goop-execute
    when: "If issues are found that need to be fixed"
  - command: /goop-milestone
    when: "To start a new milestone for the next phase of work"
---

# /goop-accept

**Verify and accept work.** The final gate before completion.

## Usage

```bash
/goop-accept
```

## How It Works

This command triggers the **Verification Protocol** to ensure the implemented work matches the locked specification.

### 1. Verification
The `goop-verifier` agent runs:
- **Automated Checks:** `bun test`, `bun run build`.
- **Spec Compliance:** Verifies "Must Haves" against evidence.
- **Security Scan:** Checks for common vulnerabilities.

### 2. The Acceptance Gate
The agent presents a report:
- **Pass:** All checks green.
- **Fail:** Gaps found (lists specifics).

### 3. User Decision
The user **MUST** type "accept" to close the task.
- If issues are found, user types "issues: [details]" to send it back to Execute phase.

## Output

- Verification Report (Pass/Fail).
- If accepted: Archives the plan and updates history.
- **State Transition:** `execute` -> `idle` (or `milestone` if part of one).

## Example

> **User:** `/goop-accept`
> **Agent:** 
> ```
> ✓ VERIFICATION PASSED
> 
> Must Haves:
> [x] Login works
> [x] Tests pass (24/24)
> 
> Type "accept" to complete.
> ```
> **User:** `accept`
> **Agent:** "Accepted. Task archived."
