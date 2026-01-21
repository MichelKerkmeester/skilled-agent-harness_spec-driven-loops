# MCP Server Formatters

> Output formatters for search results, token metrics, and MCP response formatting.

---

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

---

## 2. 🚀 QUICK START

### Basic Usage

```javascript
const formatters = require('./formatters');

// Format search results with content embedding
const response = await formatters.format_search_results(
  results,           // Search results from vector index
  'hybrid',          // Search type
  true,              // Include content
  ['summary'],       // Anchor IDs to extract
  memoryParser       // Parser for anchor extraction
);

// Calculate token metrics
const tokens = formatters.estimate_tokens(text);
console.log(`Estimated tokens: ${tokens}`);
```

---

## 3. 📁 STRUCTURE

```
formatters/
├── index.js              # Module exports aggregator
├── search-results.js     # Search result formatting with anchor support
└── token-metrics.js      # Token estimation and metrics
```

### Key Files

| File | Purpose |
|------|---------|
| `index.js` | Aggregates and exports all formatter functions |
| `search-results.js` | Formats search results, handles anchor extraction, validates paths |
| `token-metrics.js` | Token estimation using character-based approximation |

---

## 4. ⚡ FEATURES

### Search Result Formatting

**Purpose**: Transform internal search results into MCP-compliant JSON responses

| Aspect | Details |
|--------|---------|
| **Content Embedding** | Optionally includes full file content in results |
| **Anchor Filtering** | Extracts specific anchor blocks for token efficiency (SK-005) |
| **Token Metrics** | Calculates original vs. filtered token counts and savings |
| **Security** | Validates file paths before reading (SEC-002) |

```javascript
// Format with anchor filtering
const response = await format_search_results(
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

```javascript
const { estimate_tokens } = require('./formatters');

const fullContent = fs.readFileSync('memory.md', 'utf-8');
const fullTokens = estimate_tokens(fullContent);

const anchorsOnly = extractAnchors(fullContent, ['summary']);
const anchorTokens = estimate_tokens(anchorsOnly);

const savings = Math.round((1 - anchorTokens / fullTokens) * 100);
console.log(`Token savings: ${savings}%`);
```

### Path Validation

**Purpose**: Security layer preventing path traversal attacks

```javascript
// Validates against allowed base paths
const safePath = validate_file_path_local('/path/to/memory.md');
// Throws on invalid paths (outside allowed directories, contains .., etc.)
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Basic Search Result Formatting

```javascript
const formatters = require('./formatters');

// Format results without content embedding
const response = await formatters.format_search_results(
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

```javascript
// Only return summary and decisions from search results
const response = await formatters.format_search_results(
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

```javascript
// Search results automatically highlight constitutional memories
const results = [
  { id: 1, title: 'Core Protocol', isConstitutional: true, ... },
  { id: 2, title: 'Feature Spec', isConstitutional: false, ... }
];

const response = await formatters.format_search_results(results, 'hybrid');

// Response includes:
// {
//   constitutionalCount: 1,  // Highlighted in response
//   results: [...]
// }
```

### Common Patterns

| Pattern | Usage | When to Use |
|---------|-------|-------------|
| `include_content: false` | Metadata-only results | Browsing/filtering before full load |
| `anchors: ['summary']` | Extract specific sections | Token-efficient context loading |
| `anchors: null` | Full content | Initial investigation or small files |
| `estimate_tokens()` | Calculate token counts | Pre-flight checks before API calls |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Path Validation Error: "Access denied"

**Symptom**: `Error: Access denied: Path outside allowed directories`

**Cause**: File path is outside allowed base paths or contains invalid patterns (`..`)

**Solution**:
```javascript
// Check ALLOWED_BASE_PATHS in search-results.js
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
```javascript
format_search_results(results, type, true, ['summary'], parser);
//                                   ^^^^  ^^^^^^^^^^^
//                        include_content   anchors
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| `safe_json_parse` returns empty array | Check JSON format in database `trigger_phrases` column |
| Large token counts | Use anchor filtering: `anchors: ['summary']` |
| Constitutional count is 0 | Check database for `importance_tier = 'constitutional'` |
| Invalid path error | Verify path is absolute and within allowed directories |

---

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

---

*Module version: 1.7.2 | Last updated: 2026-01-21*
