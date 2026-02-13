---
name: goop-recall
description: Search and retrieve relevant memories from the persistent memory system
---

Search the persistent memory system for relevant context. Use this to:

- Find past decisions related to the current task
- Recall previous debugging insights
- Retrieve architectural patterns from earlier sessions
- Remember user preferences and project conventions

## Usage

`/goop-recall [query]` - Search memories for the given query
`/goop-recall recent` - Show recent memories
`/goop-recall decisions` - Show recent architectural decisions

## Instructions

When this command is invoked:

1. Use `memory_search` to find relevant memories matching the query
2. If query is "recent", use `memory_search` with a broad recent-focused query
3. If query is "decisions", search specifically for type "decision"
4. Present found memories in a clear, organized format:
   - Show memory title, type, and date
   - Include key facts and concepts
   - Show importance score
5. Suggest related searches if results are limited

## Example Output

```
## Found 3 Relevant Memories

### [decision] Use Zod for schema validation (Jan 15, 2026)
Importance: 8/10
Decided to use Zod over io-ts because of better TypeScript inference...
Tags: validation, zod, architecture

### [observation] ESLint flat config migration (Jan 14, 2026)
Importance: 6/10  
Migrated from .eslintrc to eslint.config.js...
Tags: eslint, config, migration
```

Provide actionable context that helps with the current task.
