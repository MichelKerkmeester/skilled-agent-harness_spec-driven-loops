---
name: memory-usage
description: How to effectively use the memory system to remember and recall information
category: core
triggers:
  - memory
  - remember
  - recall
  - save for later
  - persistent
version: 0.1.0
---

# Memory System Usage Guide

You have access to a persistent memory system that allows you to save and retrieve information across sessions. Use it wisely to provide better context-aware assistance.

## Available Tools

### `memory_save`
Save important information to persistent memory.

**When to use:**
- User expresses a preference ("I prefer TypeScript")
- You make an architectural decision
- You discover important patterns in the codebase
- You learn something that should persist

**Example:**
```
memory_save(
  title="User prefers functional React components",
  content="User explicitly stated preference for functional components with hooks over class components.",
  type="observation",
  facts=["User prefers functional components", "Hooks preferred over class lifecycle"],
  concepts=["react", "components", "preference"],
  importance=8
)
```

### `memory_search`
Search your memory for relevant information.

**When to use:**
- Before making decisions that might have prior context
- When user asks about previous work
- When you need to recall preferences or patterns
- At the start of new conversations about familiar topics

**Example:**
```
memory_search(
  query="user preferences for React components",
  limit=5,
  types=["observation", "decision"]
)
```

### `memory_note`
Quick way to save brief notes.

**When to use:**
- Quick observations that might be useful later
- Temporary reminders
- Brief insights

**Example:**
```
memory_note(
  note="The authentication service is in /src/services/auth.ts",
  concepts=["auth", "services"]
)
```

### `memory_decision`
Record important decisions with reasoning.

**When to use:**
- Architecture decisions
- Technology choices
- Design trade-offs
- Any decision that might need to be referenced later

**Example:**
```
memory_decision(
  decision="Use PostgreSQL for the database",
  reasoning="Better JSON support needed for storing user preferences, and we anticipate complex analytical queries",
  alternatives=["MySQL", "MongoDB"],
  impact="high",
  concepts=["database", "architecture"]
)
```

### `memory_forget`
Delete memories that are outdated or incorrect.

**When to use:**
- Information becomes outdated
- You stored something incorrect
- Cleaning up temporary notes

**Example:**
```
memory_forget(id=123)  // Delete by ID
memory_forget(query="outdated API endpoint", confirm=true)  // Delete by search
```

## Best Practices

### What to Remember

**HIGH PRIORITY (importance 8-10):**
- User preferences and coding style
- Project-specific decisions
- Architecture patterns
- Technology choices

**MEDIUM PRIORITY (importance 5-7):**
- Codebase patterns discovered
- Bug fixes and their solutions
- Feature implementation details
- Configuration details

**LOW PRIORITY (importance 3-4):**
- Routine observations
- Temporary context
- Session-specific notes

### What NOT to Remember

**NEVER store:**
- API keys, passwords, tokens
- Private keys or secrets
- Personal information
- Content inside `<private>` tags
- Large code blocks (store file paths instead)

### Memory Hygiene

1. **Be specific with titles** - They show up in search results
2. **Extract atomic facts** - Each fact should stand alone
3. **Use consistent concepts** - Helps with future searches
4. **Set appropriate importance** - Higher importance = more likely to surface
5. **Include source files** - Helps locate related code

## Search Strategy

1. **Before starting work:** Search for relevant context
   ```
   memory_search(query="<topic I'm about to work on>")
   ```

2. **After learning something:** Save it for later
   ```
   memory_save(title="...", content="...", ...)
   ```

3. **When asked about history:** Search first
   ```
   memory_search(query="previous work on <topic>")
   ```

## Integration with Goop Workflow

Memory integrates with the Goop workflow phases:

- **Discuss:** Search for relevant prior context
- **Plan:** Save important decisions and constraints
- **Execute:** Save observations about the codebase
- **Audit:** Note any issues discovered
- **Confirm:** Save summary of what was accomplished

## Privacy

Always respect privacy:
- Content in `<private>...</private>` tags is never stored
- Sensitive patterns (API keys, etc.) are automatically redacted
- When in doubt, ask before storing

## Examples of Good Memories

**User Preference:**
```
Title: User prefers tabs over spaces
Content: User explicitly stated preference for tabs (width 2) for indentation in all code.
Facts: ["Use tabs for indentation", "Tab width should be 2"]
Concepts: ["formatting", "preference", "style"]
Importance: 9
```

**Architecture Decision:**
```
Title: Chose event sourcing for order system
Content: Decided to use event sourcing pattern for the order management system to maintain complete audit history.
Facts: ["Order system uses event sourcing", "Full audit history required"]
Concepts: ["architecture", "event-sourcing", "orders"]
Importance: 8
```

**Codebase Pattern:**
```
Title: API routes follow RESTful naming convention
Content: All API routes in /src/api/ follow strict RESTful naming: GET /resources, GET /resources/:id, POST /resources, etc.
Facts: ["RESTful API naming", "Routes in /src/api/"]
Concepts: ["api", "rest", "conventions"]
Importance: 6
```
