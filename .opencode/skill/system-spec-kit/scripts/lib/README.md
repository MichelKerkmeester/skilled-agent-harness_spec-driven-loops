# Scripts Library

> Shared JavaScript and shell script libraries for embedding generation, content processing, and validation utilities.

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

The `lib/` directory contains shared JavaScript and shell script libraries used by `generate-context.js` and other spec-kit utilities. These modules handle embedding generation, content processing, semantic summarization, and validation output formatting.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| JavaScript Libraries | 8 | Core processing, embeddings, output formatting |
| Shell Libraries | 3 | Configuration, utilities, output helpers |
| Embedding Model | nomic-embed-text-v1.5 | 768-dimensional vectors |

### Key Features

| Feature | Description |
|---------|-------------|
| **Embedding Generation** | Local embedding via @xenova/transformers with timeout protection |
| **Semantic Summarization** | Extract key points and decisions from conversations |
| **Anchor Generation** | Create semantic ANCHOR tags for memory files |
| **ASCII Formatting** | Generate boxes, tables, and flowcharts |

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
const { generateEmbedding } = require('./lib/embeddings');
const { generateAnchor } = require('./lib/anchor-generator');
const { summarize } = require('./lib/semantic-summarizer');
```

### Verify Installation

```bash
# Check that all libraries exist
ls .opencode/skill/system-spec-kit/scripts/lib/

# Expected: 11 files (.js and .sh)
# anchor-generator.js, embeddings.js, semantic-summarizer.js, ...
```

### First Use

```javascript
// Generate an embedding
const embedding = await generateEmbedding('How does authentication work?');
console.log(`Embedding dimensions: ${embedding.length}`);
// Expected: Embedding dimensions: 768
```

---

## 3. 📁 STRUCTURE

```
lib/
├── JavaScript Libraries
│   ├── anchor-generator.js     # Semantic ANCHOR tag generation
│   ├── content-filter.js       # Content filtering and cleaning
│   ├── embeddings.js           # Embedding generation (nomic-embed-text-v1.5)
│   ├── semantic-summarizer.js  # Conversation summarization
│   ├── trigger-extractor.js    # Trigger phrase extraction
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

| File | Purpose |
|------|---------|
| `embeddings.js` | Core embedding generation with timeout and batch support |
| `anchor-generator.js` | Generate semantic anchors for memory file sections |
| `semantic-summarizer.js` | Summarize conversations for memory storage |
| `common.sh` | Shared validation utilities (log_pass, log_warn, log_error) |

---

## 4. ⚡ FEATURES

### JavaScript Libraries

#### Core Processing

| File | Purpose | Key Exports |
|------|---------|-------------|
| `anchor-generator.js` | Generate semantic ANCHOR tags | `generateAnchor()`, `validateAnchorFormat()` |
| `content-filter.js` | Filter and clean content | `filterContent()`, `removeBoilerplate()` |
| `semantic-summarizer.js` | Generate semantic summaries | `summarize()`, `extractKeyPoints()` |
| `trigger-extractor.js` | Extract trigger phrases | `extractTriggers()`, `rankTriggers()` |

#### Embedding & Vector

| File | Purpose | Key Exports |
|------|---------|-------------|
| `embeddings.js` | Generate embeddings (nomic-embed-text-v1.5) | `generateEmbedding()`, `generateBatchEmbeddings()`, `generateEmbeddingWithTimeout()` |
| `retry-manager.js` | Manage retry logic | `RetryManager`, `processWithRetry()` |

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

---

### Shell Libraries

| File | Purpose | Key Functions |
|------|---------|---------------|
| `common.sh` | Validation system utilities | `log_pass()`, `log_warn()`, `log_error()`, `log_info()`, `log_detail()` |
| `config.sh` | Configuration loading | Configuration defaults, template paths |
| `output.sh` | Formatted output helpers | Color definitions, box drawing |

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Generate Embedding

```javascript
const { generateEmbedding, generateEmbeddingWithTimeout } = require('./lib/embeddings');

// Simple embedding
const embedding = await generateEmbedding('How does authentication work?');

// With timeout protection (recommended)
const embedding = await generateEmbeddingWithTimeout(
  'How does authentication work?',
  30000  // 30 second timeout
);
```

**Result**: 768-dimensional Float32Array

---

### Example 2: Batch Embeddings

```javascript
const { generateBatchEmbeddings } = require('./lib/embeddings');

const embeddings = await generateBatchEmbeddings(
  ['text1', 'text2', 'text3'],
  { 
    batchSize: 5, 
    onProgress: (p) => console.log(`${p.completed}/${p.total}`) 
  }
);
```

**Result**: Array of 768-dimensional embeddings

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
| Embedding with timeout | `generateEmbeddingWithTimeout(text, 30000)` | Production use |
| Batch processing | `generateBatchEmbeddings(texts, opts)` | Multiple texts |
| Anchor generation | `generateAnchor({ type, content })` | Memory file sections |
| Validation logging | `log_pass()`, `log_warn()`, `log_error()` | Shell validators |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Embedding Model Not Found

**Symptom**: `Error: Could not load model nomic-embed-text-v1.5`

**Cause**: Model not downloaded or cache corrupted

**Solution**:
```bash
# Clear transformers cache and retry
rm -rf ~/.cache/huggingface/hub/models--nomic-ai--nomic-embed-text-v1.5
# Model will auto-download on next use
```

---

#### Timeout on First Embedding

**Symptom**: First embedding call times out

**Cause**: Model download/initialization takes time on first use

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
| Model timeout | Increase timeout to 60000ms |
| Batch failures | Reduce batchSize to 3 |
| Missing colors | Check terminal supports ANSI |
| Permission denied | `chmod +x lib/*.sh` |

---

### Diagnostic Commands

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Test embedding generation
node -e "require('./lib/embeddings').generateEmbedding('test').then(e => console.log('Dims:', e.length))"

# Check shell library syntax
bash -n lib/common.sh && echo "Syntax OK"
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [generate-context.js](../generate-context.js) | Main script using these libraries |
| [SKILL.md](../../SKILL.md) | Parent skill documentation |
| [mcp_server/lib/](../../mcp_server/lib/) | MCP server library modules |

### External Resources

| Resource | Description |
|----------|-------------|
| [@xenova/transformers](https://github.com/xenova/transformers.js) | JavaScript ML library |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Embedding model |

---

*Documentation version: 1.0 | Last updated: 2025-12-26*
