---
name: goop-debug
description: Debug with a systematic workflow
---

# /goop-debug

**Systematic debugging.** Solve hard bugs using the scientific method.

## Usage

```bash
/goop-debug [symptom description]
```

## How It Works

Enters a specialized debugging mode that enforces scientific rigor to prevent "flailing."

### The Protocol
1. **Observation:** "What exactly is happening?" (Gather evidence).
2. **Hypothesis:** "Why might this be happening?" (List possible causes).
3. **Experiment:** "How can we test that?" (Design falsifiable tests).
4. **Deduction:** "What does the result tell us?" (Eliminate possibilities).

### Features
- **Debug Session Log:** Creates `.goopspec/debug/SESSION-<id>.md`.
- **Constraint:** Forces changing *one variable at a time*.
- **Memory:** searches for similar past bugs.

### Output
- A resolution report with Root Cause and Fix.
- Updates persistent memory with the solution to prevent recurrence.

## Example
> **User:** `/goop-debug Login fails with 500 error only on production`
> **Agent:** "Starting debug session.
> Hypothesis 1: Env vars missing.
> Hypothesis 2: Database connection timeout.
> Let's test Hypothesis 1 first..."
