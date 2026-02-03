# Parsing Modules

> Memory file parsing, trigger matching, and entity scope detection for the Spec Kit Memory system.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The parsing module provides core functionality for extracting structured data from memory files. It handles ANCHOR section extraction (enabling ~93% token savings), trigger phrase matching (<50ms for proactive surfacing), and entity scope detection for context filtering.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 5 | memory-parser, trigger-matcher, trigger-extractor, entity-scope, index |
| Supported Encodings | 3 | UTF-8, UTF-16 LE, UTF-16 BE (with BOM detection) |
| Trigger Match Target | <50ms | NFR-P03 performance requirement |

### Key Features

| Feature | Description |
|---------|-------------|
| **ANCHOR Extraction** | Parse `<!-- ANCHOR:id -->` sections for targeted retrieval |
| **Trigger Matching** | Match user prompts against cached trigger phrases with Unicode support |
| **Memory Type Inference** | Automatic classification (research, implementation, decision, discovery) |
| **Causal Link Extraction** | Parse relationship metadata (caused_by, supersedes, derived_from) |

---

## 2. 📁 STRUCTURE

```
parsing/
├── memory-parser.js      # Core memory file parsing with ANCHOR extraction
├── trigger-matcher.js    # Fast trigger phrase matching (<50ms target)
├── trigger-extractor.js  # TF-IDF + N-gram trigger phrase extraction
├── entity-scope.js       # Context type detection and scope filtering
└── index.js              # Barrel export aggregating all modules
```

### Key Files

| File | Purpose |
|------|---------|
| `memory-parser.js` | Parse memory files, extract metadata, titles, trigger phrases, anchors |
| `trigger-matcher.js` | Match prompts against trigger phrases with LRU regex caching |
| `trigger-extractor.js` | Extract trigger phrases using TF-IDF + pattern matching |
| `entity-scope.js` | Detect context types from content and tool usage patterns |

---

## 3. ⚡ FEATURES

### Memory Parser

**Purpose**: Extract structured data from markdown memory files

| Aspect | Details |
|--------|---------|
| **Encoding Support** | UTF-8, UTF-16 LE/BE with automatic BOM detection |
| **Metadata Extraction** | Title, spec folder, context type, importance tier |
| **ANCHOR Parsing** | Section-level content retrieval via `<!-- ANCHOR:id -->` tags |
| **Type Inference** | Automatic memory_type classification with confidence scores |

```javascript
const { parseMemoryFile } = require('./parsing');

const memory = parseMemoryFile('/path/to/memory.md');
// Returns: { filePath, specFolder, title, triggerPhrases, contextType,
//            importanceTier, memoryType, causalLinks, anchors, ... }
```

### Trigger Matcher

**Purpose**: Fast trigger phrase matching for proactive memory surfacing

| Aspect | Details |
|--------|---------|
| **Performance** | <50ms matching target (NFR-P03) |
| **Caching** | 60-second TTL cache with LRU regex cache (max 100) |
| **Unicode** | NFC normalization with optional accent stripping |
| **Word Boundaries** | Unicode-aware matching (Latin characters A-z, accented chars) |

```javascript
const { matchTriggerPhrases } = require('./parsing');

const matches = matchTriggerPhrases('How does authentication work?', 3);
// Returns: [{ memoryId, specFolder, title, matchedPhrases, importanceWeight }]
```

### Trigger Extractor

**Purpose**: Extract meaningful trigger phrases from content using TF-IDF + patterns

| Aspect | Details |
|--------|---------|
| **Extraction Types** | Problem terms, technical terms, decisions, actions, compounds |
| **N-gram Support** | Unigrams through quadgrams with length bonuses |
| **Performance** | <100ms for typical content (<10KB) |
| **Output Range** | 8-25 phrases per memory file |

### Entity Scope

**Purpose**: Detect context types and build scope filters for queries

| Aspect | Details |
|--------|---------|
| **Context Types** | research, implementation, decision, discovery, general |
| **Detection Sources** | Content patterns, tool usage ratios |
| **Scope Filtering** | SQL WHERE clause generation for specFolder, sessionId, contextTypes |

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Parse Memory File with Anchors

```javascript
const { parseMemoryFile, extractAnchors } = require('./parsing');

// Parse full memory file
const memory = parseMemoryFile('specs/007-auth/memory/session-001.md');

// Extract specific anchor content (~93% token savings)
const anchors = extractAnchors(memory.content);
const summary = anchors['summary'];  // Just the summary section
```

### Example 2: Match Trigger Phrases

```javascript
const { matchTriggerPhrasesWithStats } = require('./parsing');

const result = matchTriggerPhrasesWithStats('authentication login flow', 5);

console.log(`Found ${result.matches.length} memories`);
console.log(`Match time: ${result.stats.matchTimeMs}ms`);
// Logs: Found 3 memories, Match time: 12ms
```

### Example 3: Detect Context Type from Tools

```javascript
const { detect_context_type_from_tools } = require('./parsing');

const toolCalls = [
  { tool: 'Read' }, { tool: 'Grep' }, { tool: 'Read' },
  { tool: 'Write' }, { tool: 'Read' }
];

const contextType = detect_context_type_from_tools(toolCalls);
// Returns: 'research' (>50% Read/Grep/Glob calls)
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Full parse | `parseMemoryFile(path)` | Index new memories |
| Anchor-only | `extractAnchors(content)` | Targeted section retrieval |
| Trigger match | `matchTriggerPhrases(prompt, limit)` | Proactive surfacing |
| Scope filter | `build_scope_filter({ specFolder, sessionId })` | Query filtering |

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [cognitive/README.md](../cognitive/README.md) | Attention decay, working memory |
| [search/README.md](../search/README.md) | Vector search, hybrid search |

### External Resources

| Resource | Description |
|----------|-------------|
| [MCP Protocol](https://modelcontextprotocol.io/) | Model Context Protocol specification |

---

*Documentation version: 1.0 | Last updated: 2026-02-02*
