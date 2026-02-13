---
name: goop-specify
description: Lock the specification contract
phase: specify
next-step: "Once the spec is locked and confirmed, begin implementation"
next-command: /goop-execute
alternatives:
  - command: /goop-amend
    when: "If you need to modify the locked specification"
  - command: /goop-pause
    when: "To save progress and continue later"
---

# /goop-specify

**Lock the specification.** Create a binding contract between user and agent.

## Usage

```bash
/goop-specify
```

## How It Works

This command marks the transition from planning to commitment. It generates the `SPEC.md` and `BLUEPRINT.md` files and presents them for user confirmation.

### 1. Artifact Generation
Based on the plan (and optional research), the agent generates:
- **SPEC.md:** The requirements contract.
- **BLUEPRINT.md:** The execution plan (Waves & Tasks).

### 2. The Contract Gate
The agent displays a summary of the contract:
- **Must Haves:** Guaranteed deliverables.
- **Nice to Haves:** Best-effort items.
- **Out of Scope:** Explicit exclusions.

### 3. User Confirmation
The user **MUST** type "confirm" to lock the spec. 
- If the user types "amend", the agent enters amendment mode to adjust requirements.

## Output

- `.goopspec/SPEC.md` (Locked)
- `.goopspec/BLUEPRINT.md` (Ready for execution)
- **State Transition:** `plan` -> `execute`

## Example Interaction

> **User:** `/goop-specify`
> **Agent:** 
> ```
> 🔒 CONTRACT GATE
> 
> MUST HAVES:
> • Email/Password Login
> • Session Persistence
> 
> OUT OF SCOPE:
> • OAuth (Google/Github)
> 
> Type "confirm" to lock, or "amend" to change.
> ```
> **User:** `confirm`
> **Agent:** "Spec locked. Ready to execute."

## Quick Mode
For `/goop-quick` tasks, this phase is skipped. The intent captured in the plan serves as the implicit spec.
