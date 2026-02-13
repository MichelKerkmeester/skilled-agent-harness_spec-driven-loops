---
name: goop-remember
description: Save important context, decisions, or notes to persistent memory
---

Save important information to the persistent memory system for future sessions. Use this to:

- Log architectural decisions with reasoning
- Store project conventions and patterns
- Note important discoveries and insights
- Save user preferences for future reference

## Usage

`/goop-remember [content]` - Save a memory with auto-detected type
`/goop-remember decision: [content]` - Log an architectural decision
`/goop-remember note: [content]` - Quick note
`/goop-remember todo: [content]` - Create a durable task

## Instructions

When this command is invoked:

1. Parse the content to determine the memory type:
   - If starts with "decision:", use `memory_decision`
   - If starts with "note:", use `memory_note`
   - If starts with "todo:", use `memory_save` with type "todo"
   - Otherwise, infer the best type based on content

2. Extract key information:
   - Create a clear, concise title
   - Identify facts (atomic pieces of knowledge)
   - Extract concepts/tags for semantic grouping
   - Assess importance (1-10)

3. Save to memory using appropriate tool:
   - For decisions: Use `memory_decision` with reasoning
   - For notes: Use `memory_note` 
   - For others: Use `memory_save`

4. Confirm what was saved:
   - Show the memory ID
   - Display the title and type
   - List extracted concepts/tags

## Example Usage

```
/goop-remember decision: Use TypeScript strict mode for all new files. Reasoning: Catches more bugs at compile time and improves refactoring safety.

> Saved memory #42:
> Title: Use TypeScript strict mode for all new files
> Type: decision
> Importance: 8/10
> Reasoning: Catches more bugs at compile time and improves refactoring safety
> Tags: typescript, config, code-quality
```

```
/goop-remember note: The auth system uses JWT with refresh tokens. Access tokens expire in 15 minutes.

> Saved memory #43:
> Title: Auth system uses JWT with refresh tokens
> Type: note
> Facts:
>   - Access tokens expire in 15 minutes
>   - Uses refresh token pattern
> Tags: auth, jwt, security
```

Make information persist across sessions for continuity.
