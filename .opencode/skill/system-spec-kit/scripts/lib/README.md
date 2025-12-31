# Scripts Library

> JavaScript and shell script libraries for CLI utilities including content processing, summarization, and validation.

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

## 1. 📖 OVERVIEW

### What is the lib/ Directory?

The `lib/` directory contains JavaScript and shell script libraries used by `generate-context.js` and other spec-kit CLI utilities. These modules handle content processing, semantic summarization, and validation output formatting.

### Shared Library Architecture

As of 2024-12-31, the following modules are **re-exports** from the shared `lib/` directory:

| Module | Canonical Source | This Location |
|--------|-----------------|---------------|
| `embeddings.js` | `../shared/embeddings.js` | Re-export wrapper |
| `trigger-extractor.js` | `../shared/trigger-extractor.js` | Re-export wrapper |

This consolidation ensures consistent behavior between CLI scripts and MCP server.

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED LIB/ ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    scripts/lib/                       lib/ (CANONICAL)          │
│    ┌─────────────┐                   ┌─────────────┐            │
│    │embeddings.js│ ──re-export────► │embeddings.js│            │
│    │trigger-     │                   │trigger-     │            │
│    │extractor.js │ ──re-export────► │extractor.js │            │
│    └─────────────┘                   │embeddings/  │            │
│                                       └─────────────┘            │
│    Local modules:                                                │
│    anchor-generator.js, semantic-summarizer.js, etc.            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Local JavaScript Libraries | 8 | Content processing, summarization, formatting |
| Re-exported Modules | 2 | embeddings.js, trigger-extractor.js |
| Shell Libraries | 3 | Configuration, utilities, output helpers |
| Embedding Providers | 3 | Voyage, OpenAI, HF Local (multi-provider support) |

### Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Provider Embeddings** | Voyage, OpenAI, HF local with 768/1024/1536 dimensions |
| **Semantic Summarization** | Extract key points and decisions from conversations |
| **Anchor Generation** | Create semantic ANCHOR tags for memory files |
| **ASCII Formatting** | Generate boxes, tables, and flowcharts |
| **TF-IDF Triggers** | Advanced trigger phrase extraction (v11) |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| Bash | 3.2+ | 5.0+ |
| @xenova/transformers | 2.0+ | Latest |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```javascript
// Import libraries in your Node.js script
const { generateEmbedding, getProviderMetadata } = require('./lib/embeddings');
const { extractTriggerPhrases } = require('./lib/trigger-extractor');
const { generateAnchor } = require('./lib/anchor-generator');
const { summarize } = require('./lib/semantic-summarizer');
```

### Verify Installation

```bash
# Check that all libraries exist
ls .opencode/skill/system-spec-kit/scripts/lib/

# Expected: 13 files (.js and .sh)
# anchor-generator.js, embeddings.js, trigger-extractor.js, ...
```

### First Use

```javascript
// Check embedding provider
const meta = getProviderMetadata();
console.log(`Provider: ${meta.provider}, Dimensions: ${meta.dim}`);
// Example: "Provider: voyage, Dimensions: 1024"

// Generate an embedding
const embedding = await generateEmbedding('How does authentication work?');
console.log(`Embedding dimensions: ${embedding.length}`);
// Dimensions depend on provider: 768 (HF), 1024 (Voyage), 1536 (OpenAI)
```

---

## 3. 📁 STRUCTURE

```
lib/
├── Re-exported Modules (from ../shared/)
│   ├── embeddings.js           # → ../shared/embeddings.js (multi-provider)
│   └── trigger-extractor.js    # → ../shared/trigger-extractor.js (v11)
│
├── Local JavaScript Libraries
│   ├── anchor-generator.js     # Semantic ANCHOR tag generation
│   ├── content-filter.js       # Content filtering and cleaning
│   ├── semantic-summarizer.js  # Conversation summarization
│   ├── retry-manager.js        # Retry logic for operations
│   ├── ascii-boxes.js          # ASCII box diagram generation
│   ├── flowchart-generator.js  # ASCII flowchart generation
│   ├── opencode-capture.js     # OpenCode session capture
│   └── simulation-factory.js   # Test data generation
│
├── Shell Libraries
│   ├── common.sh               # Validation system utilities
│   ├── config.sh               # Configuration loading
│   └── output.sh               # Formatted output helpers
│
└── README.md                   # This file
```

### Key Files

| File | Purpose | Source |
|------|---------|--------|
| `embeddings.js` | Multi-provider embedding generation | Re-export from `../shared/` |
| `trigger-extractor.js` | TF-IDF trigger phrase extraction | Re-export from `../shared/` |
| `anchor-generator.js` | Generate semantic anchors for memory file sections | Local |
| `semantic-summarizer.js` | Summarize conversations for memory storage | Local |
| `common.sh` | Shared validation utilities (log_pass, log_warn, log_error) | Local |

---

## 4. ⚡ FEATURES

### Re-exported Modules

These modules are re-exports from the shared `../shared/` directory:

#### embeddings.js (Re-export)

| Feature | Details |
|---------|---------|
| **Providers** | Voyage AI (recommended), OpenAI, HuggingFace local |
| **Dimensions** | 768 (HF), 1024 (Voyage), 1536/3072 (OpenAI) |
| **Auto-Detection** | Selects provider based on API keys |
| **Task-Specific** | Document, query, clustering embeddings |

See [../shared/README.md](../shared/README.md) for full documentation.

#### trigger-extractor.js (Re-export)

| Feature | Details |
|---------|---------|
| **Algorithm** | TF-IDF + N-gram hybrid |
| **Version** | v11.0.0 |
| **Priority Extraction** | Problem terms (3x), technical terms (2.5x), decisions (2x) |
| **Performance** | <100ms for typical content (<10KB) |

See [../shared/README.md](../shared/README.md) for full documentation.

---

### Local JavaScript Libraries

#### Core Processing

| File | Purpose | Key Exports |
|------|---------|-------------|
| `anchor-generator.js` | Generate semantic ANCHOR tags | `generateAnchor()`, `validateAnchorFormat()` |
| `content-filter.js` | Filter and clean content | `filterContent()`, `removeBoilerplate()` |
| `semantic-summarizer.js` | Generate semantic summaries | `summarize()`, `extractKeyPoints()` |

#### Output & Formatting

| File | Purpose | Key Exports |
|------|---------|-------------|
| `ascii-boxes.js` | Generate ASCII box diagrams | `createBox()`, `createTable()` |
| `flowchart-generator.js` | Generate ASCII flowcharts | `generateFlowchart()`, `parseFlowDefinition()` |

#### Integration

| File | Purpose | Key Exports |
|------|---------|-------------|
| `opencode-capture.js` | Capture OpenCode session data | `captureSession()`, `parseMessages()` |
| `simulation-factory.js` | Generate test data | `createSimulation()`, `mockConversation()` |
| `retry-manager.js` | Manage retry logic | `RetryManager`, `processWithRetry()` |

---

### Shell Libraries

| File | Purpose | Key Functions |
|------|---------|---------------|
| `common.sh` | Validation system utilities | `log_pass()`, `log_warn()`, `log_error()`, `log_info()`, `log_detail()` |
| `config.sh` | Configuration loading | Configuration defaults, template paths |
| `output.sh` | Formatted output helpers | Color definitions, box drawing |

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Generate Embedding (Multi-Provider)

```javascript
const { 
  generateDocumentEmbedding, 
  generateQueryEmbedding,
  getProviderMetadata 
} = require('./lib/embeddings');

// Check active provider
const meta = getProviderMetadata();
console.log(`Using ${meta.provider} (${meta.dim} dimensions)`);

// For indexing documents
const docEmbedding = await generateDocumentEmbedding('Authentication flow details...');

// For search queries  
const queryEmbedding = await generateQueryEmbedding('How does auth work?');
```

**Result**: Float32Array with provider-specific dimensions (768/1024/1536)

---

### Example 2: Extract Trigger Phrases

```javascript
const { extractTriggerPhrases, extractTriggerPhrasesWithStats } = require('./lib/trigger-extractor');

// Simple extraction
const triggers = extractTriggerPhrases(memoryContent);
console.log(triggers);
// ['memory search', 'trigger extraction', 'problem detection', ...]

// With stats for debugging
const result = extractTriggerPhrasesWithStats(memoryContent);
console.log(result.stats.extractionTimeMs);  // <100ms target
console.log(result.breakdown.problemTerms);   // Count by type
```

**Result**: 8-25 normalized trigger phrases

---

### Example 3: Generate Anchor

```javascript
const { generateAnchor } = require('./lib/anchor-generator');

const anchor = generateAnchor({
  type: 'implementation',     // decision, research, implementation, etc.
  content: 'OAuth callback handling...',
  specFolder: 'specs/007-auth'
});

// Returns: "implementation-oauth-callback-a3f8b2c1"
```

---

### Example 4: Summarize Conversation

```javascript
const { summarize } = require('./lib/semantic-summarizer');

const summary = summarize({
  messages: conversationMessages,
  maxLength: 500,
  focusOn: ['decisions', 'implementations']
});
```

---

### Example 5: Shell Logging

```bash
# Source the common library
source "$(dirname "$0")/lib/common.sh"

# Use logging functions
log_pass "FILE_EXISTS" "All required files present"
log_warn "SECTIONS_PRESENT" "Missing 2 recommended sections"
log_error "PLACEHOLDER_FILLED" "Found 3 unfilled placeholders"
```

---

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Document embedding | `generateDocumentEmbedding(text)` | Indexing content |
| Query embedding | `generateQueryEmbedding(text)` | Search queries |
| Check provider | `getProviderMetadata()` | Debugging, logging |
| Extract triggers | `extractTriggerPhrases(text)` | Memory indexing |
| Anchor generation | `generateAnchor({ type, content })` | Memory file sections |
| Validation logging | `log_pass()`, `log_warn()`, `log_error()` | Shell validators |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Provider Not Loading

**Symptom**: `Error: Provider not initialized`

**Cause**: Provider failed to initialize or API key invalid

**Solution**:
```javascript
// Pre-warm the model on startup
const { preWarmModel, getProviderMetadata } = require('./lib/embeddings');
await preWarmModel();
console.log(getProviderMetadata());  // Check which provider loaded
```

---

#### Dimension Mismatch

**Symptom**: `Error: dimension mismatch (expected 768, got 1024)`

**Cause**: Changed providers without updating database

**Solution**: Per-profile databases should prevent this. Delete old database if needed:
```bash
rm .opencode/skill/system-spec-kit/database/context-index.sqlite
```

---

#### Slow First Embedding

**Symptom**: First embedding call takes 30+ seconds

**Cause**: HF local downloads ~274MB model on first use

**Solution**:
```javascript
// Pre-warm the model on startup
const { preWarmModel } = require('./lib/embeddings');
await preWarmModel();  // Call once at startup
```

---

#### Shell Library Not Found

**Symptom**: `source: lib/common.sh: No such file or directory`

**Cause**: Running from wrong directory

**Solution**:
```bash
# Use script-relative path
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"
```

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Provider not detected | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
| Wrong provider | Set `EMBEDDINGS_PROVIDER` explicitly |
| Slow triggers | Ensure content is <10KB for <100ms |
| Missing colors | Check terminal supports ANSI |
| Permission denied | `chmod +x lib/*.sh` |

---

### Diagnostic Commands

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check environment
echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"

# Test embedding generation
node -e "require('./lib/embeddings').generateDocumentEmbedding('test').then(e => console.log('Dims:', e.length))"

# Test trigger extraction
node -e "console.log(require('./lib/trigger-extractor').extractTriggerPhrases('memory search trigger extraction'))"

# Check shell library syntax
bash -n lib/common.sh && echo "Syntax OK"
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../shared/README.md](../shared/README.md) | **Shared lib/ documentation** (canonical source for embeddings, triggers) |
| [../shared/embeddings/README.md](../shared/embeddings/README.md) | Embeddings factory detailed docs |
| [generate-context.js](../generate-context.js) | Main script using these libraries |
| [SKILL.md](../../SKILL.md) | Parent skill documentation |
| [mcp_server/lib/](../../mcp_server/lib/) | MCP server library modules |

### External Resources

| Resource | Description |
|----------|-------------|
| [@xenova/transformers](https://github.com/xenova/transformers.js) | JavaScript ML library for HF local |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Default HF embedding model |
| [Voyage AI](https://www.voyageai.com/) | Recommended embedding provider |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) | OpenAI embedding API docs |

---

*Documentation version: 1.1 | Last updated: 2024-12-31*
