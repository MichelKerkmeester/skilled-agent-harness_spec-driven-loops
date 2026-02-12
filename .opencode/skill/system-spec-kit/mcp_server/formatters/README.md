# MCP Server Formatters

> Output formatters for search results, token metrics, and MCP response formatting.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

<!-- ANCHOR:overview -->
## 1. 📖 OVERVIEW

**Purpose**: Formatters transform internal data structures into MCP-compliant responses. They handle search result formatting, token efficiency calculations (anchor-based filtering), and path validation.

**Key Features**:
- Search result formatting with anchor extraction support (SK-005)
- Token metrics calculation showing savings from anchor filtering
- Path validation for security (CWE-22 defense-in-depth)
- Safe JSON parsing with fallback values
- Constitutional memory highlighting in search results

**Core Responsibilities**:
- Format vector/hybrid search results for MCP responses
- Calculate and report token savings from anchor filtering
- Embed file content in search results when requested
- Validate file paths before reading (security layer)
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. 🚀 QUICK START

### Basic Usage

```typescript
import { formatSearchResults, estimateTokens } from './formatters';

// Format search results with content embedding
const response = await formatSearchResults(
  results,           // Search results from vector index
  'hybrid',          // Search type
  true,              // Include content
  ['summary'],       // Anchor IDs to extract
  memoryParser       // Parser for anchor extraction
);

// Calculate token metrics
const tokens = estimateTokens(text);
console.log(`Estimated tokens: ${tokens}`);
```
<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:structure -->
## 3. 📁 STRUCTURE

```
formatters/
├── index.ts              # Module exports aggregator (TypeScript barrel export)
├── search-results.ts     # Search result formatting with anchor support
└── token-metrics.ts      # Token estimation and metrics

dist/formatters/          # Compiled JavaScript output
├── index.js              # Compiled module aggregator
├── index.d.ts            # TypeScript declarations
├── search-results.js     # Compiled search result formatter
├── search-results.d.ts   # TypeScript declarations
├── token-metrics.js      # Compiled token metrics
└── token-metrics.d.ts    # TypeScript declarations
```

### Key Files

| File | Purpose |
|------|---------|
| `index.ts` | Aggregates and exports all formatter functions (TypeScript barrel export) |
| `search-results.ts` | Formats search results, handles anchor extraction, validates paths |
| `token-metrics.ts` | Token estimation using character-based approximation |
| `dist/formatters/*.js` | Compiled JavaScript output for runtime execution |
<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:features -->
## 4. ⚡ FEATURES

### Search Result Formatting

**Purpose**: Transform internal search results into MCP-compliant JSON responses

| Aspect | Details |
|--------|---------|
| **Content Embedding** | Optionally includes full file content in results |
| **Anchor Filtering** | Extracts specific anchor blocks for token efficiency (SK-005) |
| **Token Metrics** | Calculates original vs. filtered token counts and savings |
| **Security** | Validates file paths before reading (SEC-002) |

```typescript
import { formatSearchResults } from './formatters';

// Format with anchor filtering
const response = await formatSearchResults(
  searchResults,
  'hybrid',
  true,                    // Include content
  ['summary', 'context'],  // Only return these anchors
  memoryParser
);

// Response includes token metrics:
// {
//   results: [{
//     content: "...",
//     tokenMetrics: {
//       originalTokens: 1500,
//       returnedTokens: 200,
//       savingsPercent: 87,
//       anchorsRequested: 2,
//       anchorsFound: 2
//     }
//   }]
// }
```

### Token Metrics

**Purpose**: Estimate token counts for content filtering decisions

```typescript
import { estimateTokens } from './formatters';
import fs from 'fs';

const fullContent = fs.readFileSync('memory.md', 'utf-8');
const fullTokens = estimateTokens(fullContent);

const anchorsOnly = extractAnchors(fullContent, ['summary']);
const anchorTokens = estimateTokens(anchorsOnly);

const savings = Math.round((1 - anchorTokens / fullTokens) * 100);
console.log(`Token savings: ${savings}%`);
```

### Path Validation

**Purpose**: Security layer preventing path traversal attacks

```typescript
import { validateFilePathLocal } from './formatters';

// Validates against allowed base paths
const safePath = validateFilePathLocal('/path/to/memory.md');
// Throws on invalid paths (outside allowed directories, contains .., etc.)
```
<!-- /ANCHOR:features -->

---

<!-- ANCHOR:examples -->
## 5. 💡 USAGE EXAMPLES

### Example 1: Basic Search Result Formatting

```typescript
import { formatSearchResults } from './formatters';

// Format results without content embedding
const response = await formatSearchResults(
  vectorSearchResults,
  'vector',
  false  // Don't include content
);

// Response:
// {
//   content: [{
//     type: 'text',
//     text: JSON.stringify({
//       searchType: 'vector',
//       count: 5,
//       constitutionalCount: 1,
//       results: [...]
//     })
//   }]
// }
```

### Example 2: Anchor-Based Token Optimization

```typescript
import { formatSearchResults } from './formatters';

// Only return summary and decisions from search results
const response = await formatSearchResults(
  searchResults,
  'hybrid',
  true,
  ['summary', 'decisions'],  // Only these anchors
  memoryParser
);

// Each result shows token savings:
// tokenMetrics: {
//   originalTokens: 2000,
//   returnedTokens: 300,
//   savingsPercent: 85
// }
```

### Example 3: Constitutional Memory Highlighting

```typescript
import { formatSearchResults } from './formatters';

// Search results automatically highlight constitutional memories
const results = [
  { id: 1, title: 'Core Protocol', isConstitutional: true, ... },
  { id: 2, title: 'Feature Spec', isConstitutional: false, ... }
];

const response = await formatSearchResults(results, 'hybrid');

// Response includes:
// {
//   constitutionalCount: 1,  // Highlighted in response
//   results: [...]
// }
```

### Common Patterns

| Pattern | Usage | When to Use |
|---------|-------|-------------|
| `includeContent: false` | Metadata-only results | Browsing/filtering before full load |
| `anchors: ['summary']` | Extract specific sections | Token-efficient context loading |
| `anchors: undefined` | Full content | Initial investigation or small files |
| `estimateTokens()` | Calculate token counts | Pre-flight checks before API calls |
<!-- /ANCHOR:examples -->

---

<!-- ANCHOR:troubleshooting -->
## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Path Validation Error: "Access denied"

**Symptom**: `Error: Access denied: Path outside allowed directories`

**Cause**: File path is outside allowed base paths or contains invalid patterns (`..`)

**Solution**:
```typescript
// ALLOWED_BASE_PATHS is imported from core/config.ts (single source of truth)
// Default: process.cwd(), ~/.claude, MEMORY_BASE_PATH env var

// Set environment variable if needed:
process.env.MEMORY_BASE_PATH = '/path/to/your/specs';
```

#### Anchor Not Found Warning

**Symptom**: `WARNING: Requested anchors not found: summary, context`

**Cause**: Memory file doesn't contain requested anchor blocks

**Solution**: Check memory file for anchor formatting:
```markdown
<!-- ANCHOR:summary -->
Content here
<!-- /ANCHOR:summary -->
```

#### Token Metrics Missing

**Symptom**: `tokenMetrics` not present in response

**Cause**: `anchors` parameter not provided or `include_content` is false

**Solution**: Both flags required for token metrics:
```typescript
formatSearchResults(results, type, true, ['summary'], parser);
//                                 ^^^^  ^^^^^^^^^^^
//                      includeContent   anchors
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| `safeJsonParse` returns empty array | Check JSON format in database `trigger_phrases` column |
| Large token counts | Use anchor filtering: `anchors: ['summary']` |
| Constitutional count is 0 | Check database for `importance_tier = 'constitutional'` |
| Invalid path error | Verify path is absolute and within allowed directories |
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related -->
## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../handlers/README.md](../handlers/README.md) | Request handlers that use these formatters |
| [../lib/search/README.md](../lib/search/README.md) | Vector search that produces formatted results |
| [SK-005: Anchor System](../../references/memory/anchor_system.md) | Anchor-based token optimization spec |

### External Resources

| Resource | Description |
|----------|-------------|
| [MCP Protocol](https://spec.modelcontextprotocol.io/) | Model Context Protocol specification |
| [CWE-22](https://cwe.mitre.org/data/definitions/22.html) | Path traversal security guidance |
<!-- /ANCHOR:related -->

---

*Module version: 1.8.1 | Last updated: 2026-01-28*
