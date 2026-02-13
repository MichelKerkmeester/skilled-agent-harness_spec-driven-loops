# Workflow: Research Phase

**GoopSpec Voice:** Analytical, Thorough, Skill-Backed.

The Research phase answers: **How should we build this?** It explores the problem space *before* we commit to a contract.

## Position in Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    PLAN     │ ──▶ │  RESEARCH   │ ──▶ │   SPECIFY   │
│  (Intent)   │     │  (Explore)  │     │ (Contract)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          ↑
                    (You are here)
```

## Entry Criteria
*   Plan phase complete.
*   User selected **Deep Research** (or default for complex tasks).
*   *Note: Quick Mode skips this phase entirely.*

## Research Modes

### 1. The Explorer (Codebase Map)
**Skill:** `octocode-research`
*   **Goal:** Understand existing patterns.
*   **Action:** Map relevant files, check conventions, find integration points.

```text
⬢ Exploring Codebase...
  └─ ⚡ Mapped "src/auth/" (Found 3 files)
  └─ ⚡ Identified pattern: "Repository Pattern"
```

### 2. The Scholar (External Knowledge)
**Skill:** `exa_web_search`, `context7_query-docs`
*   **Goal:** Find best practices and documentation.
*   **Action:** Read docs, find libraries, compare options.

```text
⬢ Researching: "Auth0 React SDK vs NextAuth"
  └─ ⚡ Reading documentation...
  └─ ⚡ Comparing community usage...
```

## Research Output: RESEARCH.md

Findings are consolidated into a structured document.

```markdown
# Research: [Feature Name]

## Analysis
*   **Pattern:** Repository Pattern (matches codebase)
*   **Library:** Auth0 SDK (matches preference)

## Options
| Option | Pros | Cons | Recommendation |
| :--- | :--- | :--- | :--- |
| **A: Auth0 SDK** | Native support, secure | Vendor lock-in | ✅ Recommended |
| **B: NextAuth** | Flexible provider | More setup | |

## Risks
*   Risk: API Rate limits on free tier.
*   Mitigation: Implement caching.
```

## Interactive Decision Protocol

When research reveals a fork in the road, use a **Skill-Backed Question**.

```text
⬢ Decision Required: State Management

  I found two viable patterns for this feature:
  
  1. **Zustand** (Used in 'Settings' module, simpler)
  2. **Redux** (Used in 'Core', but verbose)
  
  ► Recommendation: Zustand (Lower complexity).
  ► Select [1-2]:
```

## The Specification Gate

The transition to Specify is a formal handoff.

```text
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🚩 SPECIFICATION GATE                             │
│                                                    │
│  Research complete. I have a recommended approach. │
│                                                    │
│  • Approach: Use Auth0 SDK with Context API        │
│  • Key Decision: Zustand for local state           │
│  • Risks: None blocking                            │
│                                                    │
│  ► Type "proceed" to Draft Specification.          │
│  ► Type "discuss" to review findings in detail.    │
│                                                    │
╰────────────────────────────────────────────────────╯
```

## Commands

| Command | Effect |
| :--- | :--- |
| `/goop-research` | Start deep research. |
| `/goop-map-codebase` | Trigger specific codebase mapping task. |
| `/goop-recall [query]` | Search past research. |

## Memory Triggers

*   **Save:** New technology choices and rationale.
*   **Save:** Discovered codebase patterns (for future "Explorer" runs).

```javascript
memory_save({
  type: "observation",
  title: "Research: Auth0 Pattern",
  content: "Project uses Auth0 SDK wrapped in a custom provider.",
  concepts: ["auth", "pattern", "react"]
})
```
