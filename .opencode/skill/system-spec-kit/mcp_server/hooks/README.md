---
title: "Hooks"
description: "Automatic memory surfacing hooks for context injection."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
importance_tier: "normal"
---

# Hooks

> Automatic memory surfacing hooks for context injection.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

**Purpose**: Hooks provide automatic memory surfacing for memory-aware tools. They inject constitutional and triggered memories into tool responses before execution, improving context awareness without explicit search calls.

**SK-004 Memory Surface Hook**: This module implements the Memory Surface Hook pattern, which automatically surfaces relevant memories based on tool invocation context.

**Key Features**:
- Automatic constitutional memory surfacing (always included)
- Fast trigger phrase matching for context-relevant memories
- Tool-aware activation (only for memory-related tools)
- Constitutional memory caching (1-minute TTL)
- Context hint extraction from tool arguments

**How It Works**:
```
Tool Invoked → Extract Context → Surface Constitutional + Triggered → Inject into Response
```

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### Basic Hook Usage

```typescript
import * as hooks from './hooks';

// Extract context from tool arguments
const contextHint = hooks.extract_context_hint({
  query: 'authentication workflow',
  specFolder: 'specs/auth'
});

// Auto-surface memories based on context
const surfaced = await hooks.auto_surface_memories(contextHint);

// Response includes:
// {
//   constitutional: [...],      // Always surfaced
//   triggered: [...],           // Context-matched
//   surfaced_at: '2026-01-21T...',
//   latency_ms: 12
// }
```

### Check Tool Awareness

```typescript
// Check if a tool should trigger memory surfacing
const isAware = hooks.is_memory_aware_tool('memory_search');
// Returns: true

const notAware = hooks.is_memory_aware_tool('file_read');
// Returns: false
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
hooks/
├── index.ts              # Module exports and backward compatibility
└── memory-surface.ts     # Memory surface hook implementation (SK-004)
```

### Key Files

| File | Purpose |
|------|---------|
| `index.ts` | Exports all hook functions with camelCase aliases |
| `memory-surface.ts` | Core implementation of memory surfacing logic |

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### Automatic Memory Surfacing

**Purpose**: Inject relevant memories into tool responses without explicit search calls.

| Component | Behavior | Cache TTL |
|-----------|----------|-----------|
| **Constitutional Memories** | Always surfaced, highest priority | 1 minute |
| **Triggered Memories** | Matched via fast phrase matching | No cache |
| **Context Extraction** | From `query`, `prompt`, `specFolder`, `filePath`, `concepts` | N/A |

```typescript
// Automatic surfacing on tool invocation
const result = await auto_surface_memories('authentication workflow');

// Returns:
// {
//   constitutional: [
//     {
//       id: 'mem_001',
//       specFolder: 'specs/protocols',
//       title: 'Core Authentication Protocol',
//       importanceTier: 'constitutional'
//     }
//   ],
//   triggered: [
//     {
//       memory_id: 'mem_042',
//       spec_folder: 'specs/auth',
//       title: 'Login Workflow Implementation',
//       matched_phrases: ['authentication', 'workflow']
//     }
//   ],
//   latency_ms: 8
// }
```

### Context Extraction

**Purpose**: Automatically extract search hints from tool arguments.

```typescript
// Extracts from multiple fields
const hint1 = extract_context_hint({ query: 'authentication' });
// Returns: 'authentication'

const hint2 = extract_context_hint({ specFolder: 'specs/auth' });
// Returns: 'specs/auth'

const hint3 = extract_context_hint({ concepts: ['login', 'errors'] });
// Returns: 'login errors'

const hint4 = extract_context_hint({});
// Returns: null
```

### Constitutional Memory Caching

**Purpose**: Reduce database queries for frequently surfaced constitutional memories.

```typescript
// First call: fetches from database
const constitutional1 = await get_constitutional_memories();
// Query time: ~5ms

// Subsequent calls within 1 minute: returns cached
const constitutional2 = await get_constitutional_memories();
// Query time: ~0.1ms

// Clear cache when memories updated
clear_constitutional_cache();
```

<!-- /ANCHOR:features -->

---

## 5. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: Tool Integration Pattern

```typescript
import * as hooks from './hooks';

// In MCP server tool handler
async function handle_tool_call(toolName: string, args: any) {
  let surfaced = null;

  // Auto-surface for memory-aware tools
  if (hooks.is_memory_aware_tool(toolName)) {
    const contextHint = hooks.extract_context_hint(args);
    if (contextHint) {
      surfaced = await hooks.auto_surface_memories(contextHint);
    }
  }

  // Execute actual tool
  const result = await executeTool(toolName, args);

  // Inject surfaced context if available
  if (surfaced) {
    result.surfacedContext = surfaced;
  }

  return result;
}
```

### Example 2: Constitutional Memory Loading

```typescript
import * as hooks from './hooks';

// Load constitutional memories with caching
const constitutional = await hooks.get_constitutional_memories();

// Use in prompt augmentation
const systemPrompt = `
Always follow these constitutional protocols:
${constitutional.map(m => `- ${m.title} (${m.specFolder})`).join('\n')}

User query: ${userQuery}
`;
```

### Example 3: Manual Context Surfacing

```typescript
import * as hooks from './hooks';

// Surface memories for custom context
const customContext = 'git commit workflow validation';
const surfaced = await hooks.auto_surface_memories(customContext);

if (surfaced) {
  console.log(`Surfaced ${surfaced.constitutional.length} constitutional`);
  console.log(`Surfaced ${surfaced.triggered.length} triggered`);
  console.log(`Latency: ${surfaced.latency_ms}ms`);
}
```

### Common Patterns

| Pattern | Usage | When to Use |
|---------|-------|-------------|
| `is_memory_aware_tool()` | Check before surfacing | Tool routing logic |
| `extract_context_hint()` | Get search context | Before auto-surface |
| `auto_surface_memories()` | Surface all relevant | Main hook entry point |
| `clear_constitutional_cache()` | Reset cache | After memory updates/deletes |

<!-- /ANCHOR:examples -->

---

## 6. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### No Memories Surfaced

**Symptom**: `auto_surface_memories()` returns `null`

**Cause**: No constitutional memories and no trigger matches

**Solution**:
```typescript
import * as hooks from './hooks';
import { vectorIndex } from '../lib/search/vector-index';

// Check constitutional memories exist
const constitutional = await hooks.get_constitutional_memories();
console.log(`Constitutional count: ${constitutional.length}`);

// Verify trigger phrases in database
const db = vectorIndex.getDb();
const triggerCount = db.prepare(`
  SELECT COUNT(*) as count
  FROM memory_index
  WHERE trigger_phrases IS NOT NULL
  AND trigger_phrases != '[]'
`).get();
console.log(`Memories with triggers: ${triggerCount.count}`);
```

#### Constitutional Cache Stale

**Symptom**: Updated constitutional memories not appearing

**Cause**: Cache not cleared after database updates

**Solution**:
```typescript
import * as hooks from './hooks';

// Clear cache after memory updates
await handle_memory_update({ id: 'mem_123', importanceTier: 'constitutional' });
hooks.clear_constitutional_cache();  // Force refresh

// Verify cleared
const fresh = await hooks.get_constitutional_memories();
```

#### High Latency on Surface

**Symptom**: `latency_ms > 50ms`

**Cause**: Database not indexed or large trigger phrase tables

**Solution**:
```bash
# Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_importance_tier
  ON memory_index(importance_tier, embedding_status, created_at);

# Limit trigger phrase count per memory
UPDATE memory_index
SET trigger_phrases = json_extract(trigger_phrases, '$[0:5]')
WHERE json_array_length(trigger_phrases) > 5;
```

#### Tool Not Triggering Hook

**Symptom**: Memory-aware tool not surfacing context

**Cause**: Tool name not in `MEMORY_AWARE_TOOLS` set

**Solution**:
```typescript
import * as hooks from './hooks';

// Check if tool is registered
const isRegistered = hooks.is_memory_aware_tool('my_tool');

// Add to MEMORY_AWARE_TOOLS set in memory-surface.ts
const MEMORY_AWARE_TOOLS = new Set([
  'memory_search',
  'memory_match_triggers',
  'my_tool'  // Add here
]);
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| No constitutional memories | Create memory with `importanceTier: 'constitutional'` |
| Stale cache | Call `clear_constitutional_cache()` |
| Context hint null | Verify tool args contain `query`, `prompt`, or `specFolder` |
| High latency | Check database indexes, reduce trigger phrase count |
| Tool not triggering | Add to `MEMORY_AWARE_TOOLS` set |

<!-- /ANCHOR:troubleshooting -->

---

## 7. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../handlers/memory-triggers.ts](../handlers/memory-triggers.ts) | Trigger phrase matching implementation |
| [../lib/parsing/trigger-matcher.ts](../lib/parsing/trigger-matcher.ts) | Fast phrase matching algorithm |
| [../../references/memory/memory_system.md](../../references/memory/memory_system.md) | Memory system architecture |
| [SK-004 Spec](../../specs/SK-004-memory-surface-hook/) | Memory Surface Hook design spec |

### External Resources

| Resource | Description |
|----------|-------------|
| [MCP Hooks](https://spec.modelcontextprotocol.io/specification/server/hooks/) | MCP hook pattern documentation |
| [Constitutional Memories](../../references/memory/tier_system.md) | Importance tier system reference |

---

*Module version: 1.8.0 | Last updated: 2026-01-27*

<!-- /ANCHOR:related -->
