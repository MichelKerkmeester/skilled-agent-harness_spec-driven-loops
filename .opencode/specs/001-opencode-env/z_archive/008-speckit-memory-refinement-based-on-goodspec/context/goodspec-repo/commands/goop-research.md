---
name: goop-research
description: Launch research for unknowns or risks
agent: goop-researcher
spawn: true
phase: research
next-step: "Apply research findings to create or refine the plan"
next-command: /goop-plan
alternatives:
  - command: /goop-research
    when: "For additional research on related topics"
  - command: /goop-specify
    when: "If research confirms the plan is ready to lock"
---

# /goop-research

**Start the Research Phase.** Explore unknowns, compare options, and gather technical context.

## Usage

```bash
/goop-research [topic or question]
```

## How It Works

Research is an **opt-in** phase used when the path forward isn't clear. It prevents "coding in the dark."

### 1. Scope Definition
The agent confirms what needs to be learned:
- Technical feasibility
- Library/Tool selection
- Architectural patterns
- Bug root cause analysis

### 2. Investigation
The `goop-researcher` subagent performs:
- **Web Search:** For latest docs and libraries.
- **Code Search:** For examples and usage patterns.
- **Memory Search:** For past learnings.

### 3. Synthesis
Findings are compiled into a structured report with a clear recommendation.

## Output

- `.goopspec/RESEARCH.md`: Detailed findings and trade-offs.
- **Memory:** Key learnings are persisted for future recall.

## Transitions

- **Next Step:** `/goop-plan` to apply findings to a plan.
- **Loop:** `/goop-research` can be run multiple times for deep dives.

## Examples

**Library Selection:**
> **User:** `/goop-research best react animation library for minimal bundle size`
> **Agent:** "I'll compare Framer Motion, React Spring, and a CSS-only approach."

**Technical Feasibility:**
> **User:** `/goop-research can we use WebSockets on Vercel serverless?`
> **Agent:** "Investigating Vercel platform limits and workaround options like Pusher."
