# Response Module

> Standardized response envelope for MCP tools: `{summary, data, hints, meta}`.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE](#4--usage)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The response module provides a standardized envelope format for all MCP tool responses. This ensures consistent structure across tools, enables token counting, and provides actionable hints for AI agents.

### Envelope Structure

```javascript
{
  summary: "Human-readable result summary",
  data: { /* Tool-specific payload */ },
  hints: ["Actionable suggestions for next steps"],
  meta: {
    tool: "tool_name",
    tokenCount: 150,
    latencyMs: 42,
    cacheHit: false
  }
}
```

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Consistency** | All tools return same structure |
| **Token Awareness** | Auto-calculates response token count |
| **Actionable Hints** | Guides AI agents on next steps |
| **Performance Tracking** | Latency and cache hit metrics |
| **Error Handling** | Structured error responses with recovery hints |

---

## 2. 📁 STRUCTURE

```
response/
├── index.js     # Module aggregator
└── envelope.js  # Response envelope factory functions
```

### Key Files

| File | Purpose |
|------|---------|
| `envelope.js` | Core envelope creation functions and MCP wrappers |
| `index.js` | Re-exports envelope for clean imports |

---

## 3. ⚡ FEATURES

### Core Envelope Functions

| Function | Purpose |
|----------|---------|
| `createResponse(options)` | Base envelope factory |
| `createSuccessResponse(options)` | Success with default hints |
| `createEmptyResponse(options)` | Empty results with helpful hints |
| `createErrorResponse(options)` | Error with recovery guidance |

### MCP Wrapper Functions

| Function | Purpose |
|----------|---------|
| `wrapForMCP(envelope)` | Wrap envelope in MCP content format |
| `createMCPResponse(options)` | Create + wrap in one call |
| `createMCPSuccessResponse(options)` | Success + MCP wrap |
| `createMCPEmptyResponse(options)` | Empty + MCP wrap |
| `createMCPErrorResponse(options)` | Error + MCP wrap (sets isError) |

### Default Hints

| Scenario | Hints |
|----------|-------|
| **Empty Results** | "Try broadening search", "Use memory_list()", "Check specFolder filter" |
| **Rate Limited** | "Wait before retrying", "Consider batching" |
| **Success** | (Empty by default) |

---

## 4. 💡 USAGE

### Basic Import

```javascript
const {
  createSuccessResponse,
  createEmptyResponse,
  createErrorResponse,
  createMCPResponse
} = require('./lib/response');
```

### Success Response

```javascript
const response = createSuccessResponse({
  tool: 'memory_search',
  summary: 'Found 5 matching memories',
  data: {
    count: 5,
    results: [/* ... */]
  },
  startTime: Date.now() - 42  // For latency calculation
});
```

### Empty Response

```javascript
const response = createEmptyResponse({
  tool: 'memory_search',
  summary: 'No memories matched query',
  startTime
});
// Automatically includes helpful hints for empty results
```

### Error Response

```javascript
const response = createErrorResponse({
  tool: 'memory_save',
  error: new Error('Validation failed'),
  code: 'E002',
  details: { field: 'content', reason: 'empty' },
  recovery: {
    hint: 'Provide non-empty content',
    actions: ['Check input format', 'Review validation rules'],
    severity: 'warning'
  }
});
```

### MCP-Wrapped Response

```javascript
// For direct return from MCP tool handlers
const mcpResponse = createMCPResponse({
  tool: 'memory_search',
  summary: 'Found 3 results',
  data: { count: 3, results: [...] }
});

// Returns: { content: [{ type: 'text', text: '...' }], isError: false }
```

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../architecture/](../architecture/) | Layer definitions and token budgets |
| [../cache/](../cache/) | Tool output caching |

### Related Modules

| Module | Relationship |
|--------|--------------|
| `context-server.js` | Uses envelope for all tool responses |
| `formatters/token-metrics.js` | Provides `estimate_tokens()` for meta |
| `lib/errors.js` | Error types used with createErrorResponse |
