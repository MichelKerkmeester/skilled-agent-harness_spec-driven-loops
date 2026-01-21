# Data Extractors

> Specialized modules that extract structured data from conversations, code changes, and spec folders for memory generation.

---

## 1. 📖 OVERVIEW

### What are Extractors?

Extractors are the data processing layer of the system-spec-kit memory system. Each extractor is responsible for analyzing specific aspects of a development session and transforming them into structured, semantically-tagged data for template rendering and vector indexing.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Extractor Modules | 9 | Each handles a specific data domain |
| Primary Data Types | 6 | Conversations, decisions, diagrams, files, sessions, implementation guides |
| Output Format | JSON | Structured objects with semantic metadata |

### Key Features

| Feature | Description |
|---------|-------------|
| **Conversation Extraction** | Parses message threads, groups by topics, formats for memory storage |
| **Decision Tracking** | Extracts and structures architectural and technical decisions with rationale |
| **File Change Analysis** | Tracks modified files with semantic descriptions and change summaries |
| **Session Metadata** | Captures project phase, context type, importance tier, active files |
| **Diagram Detection** | Identifies and extracts ASCII diagrams, flowcharts, and visual aids |
| **Implementation Guides** | Generates step-by-step guides from conversation patterns |

### Requirements

| Requirement | Minimum | Used For |
|-------------|---------|----------|
| Node.js | 14+ | Module system and async/await |
| Parent Modules | core/, utils/, lib/ | Configuration, utilities, anchor generation |

---

## 2. 🚀 QUICK START

### Basic Usage

Extractors are typically invoked by the core workflow, not directly:

```javascript
const {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractFilesFromData
} = require('./extractors');

// Extract conversations from collected data
const conversations = await extractConversations(collectedData);

// Extract decisions with anchors
const decisions = await extractDecisions(collectedData);

// Extract file changes
const files = extractFilesFromData(collectedData);
```

### Import from Index

All extractors are re-exported from `index.js` for clean imports:

```javascript
// Single import for all extractors
const extractors = require('./extractors');

// Or destructure what you need
const {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractSessionMetadata
} = require('./extractors');
```

---

## 3. 📁 STRUCTURE

```
extractors/
├── index.js                           # Central re-export hub (1KB)
├── conversation-extractor.js          # Message grouping and formatting (7.6KB)
├── decision-extractor.js              # Decision tracking with rationale (10.5KB)
├── decision-tree-generator.js         # Decision tree visualization (6.6KB)
├── diagram-extractor.js               # ASCII diagram extraction (7.7KB)
├── file-extractor.js                  # File change analysis (9KB)
├── session-extractor.js               # Session metadata and state (14KB)
├── implementation-guide-extractor.js  # Step-by-step guide generation (13.5KB)
└── collect-session-data.js            # Session data collection (7.5KB)
```

### Key Files

| File | Primary Export | Purpose |
|------|----------------|---------|
| `conversation-extractor.js` | `extractConversations()` | Parse message threads into grouped conversations |
| `decision-extractor.js` | `extractDecisions()` | Extract architectural and technical decisions |
| `file-extractor.js` | `extractFilesFromData()` | Analyze file changes with semantic descriptions |
| `session-extractor.js` | `extractSessionMetadata()` | Capture session state, phase, importance tier |
| `diagram-extractor.js` | `extractDiagrams()` | Identify and extract visual diagrams |
| `implementation-guide-extractor.js` | `extractPhasesFromData()` | Generate implementation step guides |
| `collect-session-data.js` | `collectSessionData()` | Aggregate session data for processing |

---

## 4. ⚡ FEATURES

### Conversation Extraction

Parses message threads and groups related exchanges:

```javascript
const conversations = await extractConversations(collectedData);

// Output structure:
{
  CONVERSATION_NUMBER: 1,
  CONVERSATION_TITLE: "Authentication Implementation",
  MESSAGES: [
    {
      ROLE: "user",
      CONTENT: "Implement JWT authentication",
      TIMESTAMP: "2025-01-21T10:00:00Z"
    },
    {
      ROLE: "assistant",
      CONTENT: "I'll implement JWT authentication...",
      TOOL_USE_SUMMARY: "Read(auth.js), Edit(auth.js)"
    }
  ],
  ANCHOR_ID: "conv-001-authentication-implementation"
}
```

### Decision Extraction

Extracts decisions with structured rationale and options:

```javascript
const decisions = await extractDecisions(collectedData);

// Output structure:
{
  DECISION_NUMBER: 1,
  TITLE: "Use JWT for Authentication",
  PROBLEM_STATEMENT: "Need secure, stateless authentication",
  OPTIONS: [
    {
      OPTION_NUMBER: 1,
      LABEL: "JWT Tokens",
      DESCRIPTION: "Stateless token-based auth",
      SELECTED: true
    }
  ],
  RATIONALE: "JWT provides stateless authentication...",
  ANCHOR_ID: "decision-001-jwt-authentication"
}
```

### File Change Analysis

Tracks modified files with semantic context:

```javascript
const files = extractFilesFromData(collectedData);

// Output structure:
[
  {
    PATH: "src/auth.js",
    DESCRIPTION: "JWT authentication implementation with token validation",
    SECTIONS: ["Core Authentication", "Token Management"],
    ANCHOR_ID: "file-001-src-auth-js"
  }
]
```

### Session Metadata Extraction

Captures project state and context:

```javascript
const sessionData = extractSessionMetadata(collectedData);

// Output structure:
{
  sessionId: "session-1737462000000-abc123",
  channel: "main",
  contextType: "implementation",
  importanceTier: "important",
  projectPhase: "IMPLEMENTATION",
  activeFile: "src/auth.js",
  filesModified: ["src/auth.js", "src/middleware.js"]
}
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Extract All Data Types

```javascript
const {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractFilesFromData,
  extractSessionMetadata
} = require('./extractors');

async function processSession(collectedData) {
  // Extract all structured data
  const conversations = await extractConversations(collectedData);
  const decisions = await extractDecisions(collectedData);
  const diagrams = await extractDiagrams(collectedData);
  const files = extractFilesFromData(collectedData);
  const sessionData = extractSessionMetadata(collectedData);

  return {
    conversations,
    decisions,
    diagrams,
    files,
    sessionData
  };
}
```

### Example 2: Generate Implementation Guide

```javascript
const { extractPhasesFromData } = require('./extractors');

async function generateGuide(collectedData) {
  const phases = await extractPhasesFromData(collectedData);

  // Output: Array of implementation phases
  phases.forEach(phase => {
    console.log(`Phase ${phase.PHASE_NUMBER}: ${phase.TITLE}`);
    console.log(phase.STEPS.map(s => `  - ${s}`).join('\n'));
  });
}
```

### Example 3: Collect and Process Session Data

```javascript
const { collectSessionData, shouldAutoSave } = require('./extractors');

async function handleSession(conversationData) {
  // Check if auto-save is needed
  if (shouldAutoSave(conversationData)) {
    console.log('Auto-save triggered');

    // Collect session data
    const sessionData = await collectSessionData(conversationData);

    // Process with extractors
    return await processSession(sessionData);
  }
}
```

---

## 6. 🔧 EXTRACTOR DETAILS

### Conversation Extractor

**Purpose**: Group and format message exchanges

**Key Operations**:
- Message timestamp formatting
- Tool use summarization
- Topic-based grouping
- Anchor ID generation

**Output**: Array of conversation objects with messages

### Decision Extractor

**Purpose**: Capture architectural and technical decisions

**Key Operations**:
- Manual decision processing from input
- Decision tree generation
- Option comparison structuring
- Anchor uniqueness validation

**Output**: Array of decision objects with options and rationale

### File Extractor

**Purpose**: Track file changes with semantic context

**Key Operations**:
- Relative path conversion
- Semantic description enhancement
- Section categorization
- Anchor ID generation per file

**Output**: Array of file objects with descriptions

### Session Extractor

**Purpose**: Capture session state and metadata

**Key Operations**:
- Session ID generation
- Git branch detection (channel)
- Context type detection (research, implementation, etc.)
- Importance tier classification (critical, important, normal)
- Project phase detection (RESEARCH, PLANNING, IMPLEMENTATION, REVIEW)

**Output**: Session metadata object

### Diagram Extractor

**Purpose**: Identify and extract visual diagrams

**Key Operations**:
- ASCII diagram pattern matching
- Flowchart detection
- Diagram formatting preservation
- Anchor ID generation

**Output**: Array of diagram objects with content

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Empty Extraction Results

**Symptom**: Extractors return empty arrays or null values

**Cause**: `collectedData` is missing required fields or malformed

**Solution**: Validate input structure before extraction

```javascript
const { validateDataStructure } = require('../utils/data-validator');

// Validate before extraction
validateDataStructure(collectedData, 'conversations');
const conversations = await extractConversations(collectedData);
```

#### Anchor ID Collisions

**Symptom**: `Error: Duplicate anchor ID detected`

**Cause**: Generated anchor IDs are not unique within spec folder

**Solution**: Ensure spec number extraction works correctly

```javascript
// Check spec number extraction
const { extractSpecNumber } = require('../lib/anchor-generator');
const specNum = extractSpecNumber(collectedData.SPEC_FOLDER);
console.log('Spec number:', specNum); // Should be "001", "002", etc.
```

#### Missing Semantic Descriptions

**Symptom**: File descriptions are generic or empty

**Cause**: Semantic enhancement library not loaded or file content missing

**Solution**: Verify file content is captured in collected data

```javascript
// Check file data
console.log('Files:', collectedData.files);
console.log('File contents:', collectedData.files.map(f => f.content?.length));
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Module import error | Use `require('./extractors')` not `require('./extractors/index')` |
| Timestamp format error | Verify `formatTimestamp()` from `message-utils` is available |
| Session ID not unique | Check system clock is advancing (not frozen in tests) |
| Decision tree empty | Verify manual decisions array in `collectedData._manualDecisions` |

### Diagnostic Commands

```bash
# Test extractor imports
node -e "const e = require('./.opencode/skill/system-spec-kit/scripts/extractors'); console.log(Object.keys(e))"

# Verify anchor generator available
node -e "const { generateAnchorId } = require('./.opencode/skill/system-spec-kit/scripts/lib/anchor-generator'); console.log(generateAnchorId('test', 'file', '001'))"

# Check session ID generation
node -e "const { extractSessionMetadata } = require('./.opencode/skill/system-spec-kit/scripts/extractors'); console.log('Loaded')"
```

---

## 8. 📋 DATA FLOW

### Extraction Pipeline

```
Raw Session Data (collectedData)
    ├─► conversation-extractor.js → Grouped conversations with anchors
    ├─► decision-extractor.js     → Structured decisions with rationale
    ├─► diagram-extractor.js      → Extracted visual diagrams
    ├─► file-extractor.js         → Enhanced file descriptions
    ├─► session-extractor.js      → Session metadata and state
    └─► implementation-guide-extractor.js → Step-by-step guides

Structured Data Objects
    ├─► renderers/ (template population)
    └─► mcp_server/ (vector indexing)
```

### Data Dependencies

| Extractor | Depends On | Provides To |
|-----------|------------|-------------|
| `conversation-extractor.js` | `message-utils`, `anchor-generator` | Template renderer |
| `decision-extractor.js` | `anchor-generator`, `decision-tree-generator` | Decision template |
| `file-extractor.js` | `file-helpers`, `anchor-generator` | File context template |
| `session-extractor.js` | `core/config`, Git executable | Session metadata template |
| `collect-session-data.js` | All extractors | Core workflow |

---

## 9. 📚 RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [../core/README.md](../core/README.md) | Core workflow that orchestrates extractors |
| [../README.md](../README.md) | Scripts directory overview |
| [../../SKILL.md](../../SKILL.md) | System-spec-kit skill documentation |
| [system-spec-kit Memory System](../../references/memory/memory_system.md) | Memory architecture and design |

### Related Modules

| Module | Purpose |
|--------|---------|
| `../lib/anchor-generator.js` | Generate unique anchor IDs for extracted data |
| `../utils/message-utils.js` | Timestamp formatting and message processing |
| `../utils/data-validator.js` | Validate collected data structure |
| `../renderers/` | Populate templates with extracted data |

---

*Part of the system-spec-kit conversation memory and context preservation system.*
