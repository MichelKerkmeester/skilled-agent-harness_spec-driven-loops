# Workflow: Plan Phase

**GoopSpec Voice:** Direct, Purposeful, Memory-First.

The Plan phase captures user intent and establishes the foundation for all subsequent work. It answers: **What does the user want and why?**

## Position in Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    PLAN     │ ──▶ │  RESEARCH   │ ──▶ │   SPECIFY   │
│  (Intent)   │     │  (Explore)  │     │ (Contract)  │
└─────────────┘     └─────────────┘     └─────────────┘
     ↑
(You are here)
```

## Core Protocol

### 1. Memory-First Context Loading
**Before** asking the user anything, the agent **MUST** search memory.

```javascript
// Search for similar past requests, preferences, and project context
memory_search({ query: "intent similar requests [project_name]" })
```

### 2. Intent Capture
Extract the core intent using the **Interactive Questioning Protocol**.

*   **Goal:** Move from "vague request" to "structured intent".
*   **Method:** Progressive Disclosure.

**Example Interaction:**
```text
⬢ User Request: "I need a login page."

⬢ Memory Recall: You prefer **Auth0** for authentication (Confidence: High).
  Proceed with Auth0? [Y/n]
```

### 3. The "Why" and "Success"
Every plan must have a defined outcome.

*   **Intent:** Action + Target + Context.
*   **Motivation:** Why now? What problem does this solve?
*   **Success Criteria:** Observable outcomes (e.g., "User can log in", "Response time < 200ms").

## Clarifying Questions Protocol

**Rule:** Only ask if it resolves ambiguity that changes effort by 2x+.

1.  **Search:** Do I already know this?
2.  **Skill:** Can I deduce this? (e.g., "Standard practice for React is...")
3.  **Ask:** If neither, ask a **Structured Prompt**.

```text
⬢ Decision Required: UI Framework
  
  1. Tailwind CSS (Consistent with project)
  2. CSS Modules (Used in legacy components)
  
  ► Select [1-2]:
```

## Output: PLAN.md

The result of this phase is a clear `PLAN.md` (internal state) or simple structured context.

```markdown
# Plan: [Feature Name]

## Intent
**User wants to:** Create a login page
**Because:** Users need to access private dashboards
**Success:** Successful login redirects to /dashboard

## Requirements
### Must Have
- Email/Password form
- "Forgot Password" link

### Constraints
- Must use existing Auth0 tenant
- Mobile responsive
```

## The Research Gate

The transition to Research is a formal **Decision Gate**.

```text
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🚩 RESEARCH GATE                                  │
│                                                    │
│  I understand the intent. How should we proceed?   │
│                                                    │
│  1. ⚡ Quick Mode                                  │
│     Skip research. Use standard patterns.          │
│     Best for: Simple fixes, standard features.     │
│                                                    │
│  2. 🔍 Deep Research                               │
│     Explore options, read docs, map codebase.      │
│     Best for: New tech, complex feats, unknown.    │
│                                                    │
│  ► Select [1-2]:                                   │
│                                                    │
╰────────────────────────────────────────────────────╯
```

## Commands

| Command | Effect |
| :--- | :--- |
| `/goop-plan [intent]` | Start Plan phase with initial intent. |
| `/goop-discuss` | Open-ended discussion to clarify vague intent. |
| `/goop-status` | Check current phase status. |

## Memory Triggers

*   **Save:** User preferences discovered during questioning.
*   **Save:** The finalized "Project Intent" for future reference.

```javascript
memory_save({
  type: "note",
  title: "Project Intent: [Name]",
  content: "User wants to... [Summary]",
  concepts: ["intent", "scope"]
})
```
