# Data Extractors

> Specialized modules that extract structured data from conversations, code changes, and spec folders for memory generation, including PREFLIGHT/POSTFLIGHT learning delta tracking.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. EXTRACTOR DETAILS](#6--extractor-details)
- [7. DATA FLOW](#7--data-flow)
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

---

## 1. OVERVIEW

### What are Extractors?

Extractors are the data processing layer of the system-spec-kit memory system. Each extractor analyzes specific aspects of a development session and transforms them into structured, semantically-tagged data for template rendering and vector indexing. The latest version includes PREFLIGHT/POSTFLIGHT assessment tracking for measuring learning progress across sessions.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Extractor Modules | 8 | Each handles a specific data domain |
| Primary Data Types | 7 | Conversations, decisions, diagrams, files, sessions, implementation guides, learning metrics |
| Output Format | JSON | Structured objects with semantic metadata |
| New in v1.0.6 | 3 | Learning Index calculation, PREFLIGHT/POSTFLIGHT tracking, delta analysis |

### Key Features

| Feature | Description |
|---------|-------------|
| **Conversation Extraction** | Parses message threads, groups by topics, formats for memory storage |
| **Decision Tracking** | Extracts architectural and technical decisions with rationale and anchor IDs |
| **File Change Analysis** | Tracks modified files with semantic descriptions and role detection |
| **Session Metadata** | Captures project phase, context type, importance tier, active files |
| **Diagram Detection** | Identifies and extracts ASCII diagrams, flowcharts, and decision trees |
| **Implementation Guides** | Generates step-by-step guides from conversation patterns |
| **Learning Delta Tracking** | NEW: Calculates knowledge gain, uncertainty reduction, and context improvement |

### Requirements

| Requirement | Minimum | Used For |
|-------------|---------|----------|
| Node.js | 14+ | Module system and async/await |
| Parent Modules | core/, utils/, lib/ | Configuration, utilities, anchor generation |

---

## 2. QUICK START

### Basic Usage

Extractors are typically invoked by the core workflow, not directly:

```javascript
const {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractFilesFromData,
  collectSessionData
} = require('./extractors');

// Collect and process session data
const sessionData = await collectSessionData(collectedData, specFolderName);

// Extract specific data types
const conversations = await extractConversations(collectedData);
const decisions = await extractDecisions(collectedData);
```

### Import from Index

All extractors are re-exported from `index.js` for clean imports:

```javascript
// Single import for all extractors
const extractors = require('./extractors');

// Or destructure what you need
const {
  collectSessionData,
  extractConversations,
  extractDecisions,
  calculateLearningIndex
} = require('./extractors');
```

---

## 3. STRUCTURE

```
extractors/
├── index.js                           # Central re-export hub (1KB)
├── collect-session-data.js            # Main session data aggregation with PREFLIGHT/POSTFLIGHT (16KB)
├── conversation-extractor.js          # Message grouping and formatting (8KB)
├── decision-extractor.js              # Decision tracking with rationale (10KB)
├── decision-tree-generator.js         # ASCII decision tree visualization (7KB)
├── diagram-extractor.js               # ASCII diagram and flowchart extraction (8KB)
├── file-extractor.js                  # File change analysis with semantic descriptions (9KB)
├── implementation-guide-extractor.js  # Step-by-step guide generation (14KB)
├── session-extractor.js               # Session metadata and project state (14KB)
└── README.md                          # This documentation (14KB)
```

### Key Files

| File | Primary Export | Purpose |
|------|----------------|---------|
| `collect-session-data.js` | `collectSessionData()`, `calculateLearningIndex()` | Aggregates all session data; calculates learning metrics |
| `conversation-extractor.js` | `extractConversations()` | Parse message threads into grouped conversations |
| `decision-extractor.js` | `extractDecisions()` | Extract architectural decisions with anchor IDs |
| `file-extractor.js` | `extractFilesFromData()` | Analyze file changes with semantic descriptions |
| `session-extractor.js` | `extractSessionMetadata()` | Capture session state, phase, importance tier |
| `diagram-extractor.js` | `extractDiagrams()` | Identify and extract visual diagrams |
| `implementation-guide-extractor.js` | `buildImplementationGuideData()` | Generate implementation step guides |
| `decision-tree-generator.js` | `generateDecisionTree()` | Create ASCII decision tree visualizations |
| `index.js` | All exports | Central re-export hub for clean imports |

---

## 4. FEATURES

### PREFLIGHT/POSTFLIGHT Learning Delta (NEW in v1.0.6)

Tracks knowledge acquisition across sessions with quantitative metrics:

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **Knowledge Score** | Domain understanding level | 0-100 scale, higher = better |
| **Uncertainty Score** | Unknown factors remaining | 0-100 scale, lower = better |
| **Context Score** | Situational completeness | 0-100 scale, higher = better |
| **Learning Index** | Composite learning progress | (DeltaKnow * 0.4) + (UncertReduction * 0.35) + (DeltaContext * 0.25) |

**Delta Calculation:**
- Knowledge Delta = Postflight Score - Preflight Score (positive = learning)
- Uncertainty Reduction = Preflight Score - Postflight Score (positive = progress)
- Context Delta = Postflight Score - Preflight Score (positive = enrichment)

### Conversation Extraction

Parses message threads and groups related exchanges:

- Message timestamp formatting
- Tool use summarization
- Topic-based grouping
- Phase classification (Research, Planning, Implementation, Review)
- Auto-generated conversation flowcharts

### Decision Extraction

Captures architectural and technical decisions:

- Manual decision processing from input
- Decision tree generation with ASCII visualization
- Option comparison structuring
- Anchor uniqueness validation
- Confidence-based importance classification (high/medium/low)

### File Change Analysis

Tracks modified files with semantic context:

- Relative path conversion
- Semantic description enhancement
- Section categorization by file role
- Anchor ID generation per file
- Role detection (test, config, entry point, types, etc.)

### Session Metadata Extraction

Captures comprehensive project state:

- Session ID generation with timestamps
- Git branch detection (channel)
- Context type detection (research, implementation, decision, discovery)
- Importance tier classification (critical, important, normal, temporary)
- Project phase detection (RESEARCH, PLANNING, IMPLEMENTATION, REVIEW)
- Blocker extraction from narratives

### Diagram Extraction

Identifies and extracts visual diagrams:

- ASCII diagram pattern matching (box characters)
- Flowchart detection and classification
- Diagram complexity analysis
- Auto-generated conversation flowcharts
- Auto-generated decision trees

### Implementation Guide Generation

Generates step-by-step guides from session data:

- Implementation work detection
- Feature extraction with descriptions
- Key file role detection
- Extension guide generation
- Code pattern extraction (helper functions, validation, templates, etc.)

---

## 5. USAGE EXAMPLES

### Example 1: Collect Session Data with Learning Metrics

```javascript
const { collectSessionData } = require('./extractors');

// Input data with PREFLIGHT/POSTFLIGHT assessments
const collectedData = {
  SPEC_FOLDER: '077-speckit-upgrade',
  observations: [...],
  user_prompts: [...],
  preflight: {
    knowledgeScore: 45,
    uncertaintyScore: 60,
    contextScore: 40,
    timestamp: '2025-01-23T10:00:00Z',
    gaps: ['Unknown memory format', 'Template structure unclear']
  },
  postflight: {
    knowledgeScore: 75,
    uncertaintyScore: 30,
    contextScore: 70,
    gapsClosed: ['Memory format understood', 'Template structure documented'],
    newGaps: ['Performance optimization needed']
  }
};

const sessionData = await collectSessionData(collectedData, '077-speckit-upgrade');

// Output includes learning delta:
console.log(sessionData.LEARNING_INDEX);        // 42 (composite score)
console.log(sessionData.DELTA_KNOW_SCORE);      // "+30"
console.log(sessionData.DELTA_UNCERTAINTY_SCORE); // "+30" (reduction is good)
console.log(sessionData.LEARNING_SUMMARY);      // "Significant knowledge gain..."
```

### Example 2: Calculate Learning Index Directly

```javascript
const { calculateLearningIndex } = require('./extractors');

// Formula: (Knowledge * 0.4) + (Uncertainty Reduction * 0.35) + (Context * 0.25)
const learningIndex = calculateLearningIndex(
  30,  // Knowledge delta: +30 points
  30,  // Uncertainty reduction: 60 -> 30 = 30 points
  30   // Context delta: +30 points
);

console.log(learningIndex); // 30 (weighted average)
```

### Example 3: Extract All Data Types

```javascript
const {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractFilesFromData,
  buildImplementationGuideData
} = require('./extractors');

async function processSession(collectedData) {
  const observations = collectedData.observations || [];

  // Extract all structured data
  const conversations = await extractConversations(collectedData);
  const decisions = await extractDecisions(collectedData);
  const diagrams = await extractDiagrams(collectedData);
  const files = extractFilesFromData(collectedData, observations);
  const implGuide = buildImplementationGuideData(observations, files, 'spec-folder');

  return {
    conversations,
    decisions,
    diagrams,
    files,
    implementationGuide: implGuide
  };
}
```

### Example 4: Auto-Save Detection

```javascript
const { shouldAutoSave } = require('./extractors');

// Check if auto-save threshold reached
const messageCount = 50;
if (shouldAutoSave(messageCount)) {
  console.log('Auto-save triggered at message count threshold');
  const sessionData = await collectSessionData(collectedData);
  // Save to memory...
}
```

### Common Patterns

| Pattern | Function | When to Use |
|---------|----------|-------------|
| Full session collection | `collectSessionData()` | Memory saves, context preservation |
| Learning metrics | `calculateLearningIndex()` | Quantify session learning progress |
| Conversation grouping | `extractConversations()` | Format for template rendering |
| Decision documentation | `extractDecisions()` | Capture architectural choices |
| File tracking | `extractFilesFromData()` | Document file modifications |
| Implementation guides | `buildImplementationGuideData()` | Generate how-to documentation |

---

## 6. EXTRACTOR DETAILS

### collect-session-data.js

**Purpose**: Main session data aggregation with PREFLIGHT/POSTFLIGHT learning delta tracking

**Key Functions**:

| Function | Purpose | Returns |
|----------|---------|---------|
| `collectSessionData(data, folder)` | Aggregate all session data | Complete session object with learning metrics |
| `shouldAutoSave(messageCount)` | Check auto-save threshold | Boolean |
| `calculateLearningIndex(dk, du, dc)` | Compute composite learning score | Number (0-100) |
| `extractPreflightPostflightData(data)` | Process assessment data | Preflight/postflight template variables |
| `getScoreAssessment(score, metric)` | Generate human-readable assessment | String |
| `getTrendIndicator(delta, inverted)` | Get trend arrow for delta | String (arrow emoji) |
| `generateLearningSummary(dk, du, dc, li)` | Create narrative summary | String |

**Output Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `PREFLIGHT_KNOW_SCORE` | number | Initial knowledge assessment |
| `POSTFLIGHT_KNOW_SCORE` | number | Final knowledge assessment |
| `DELTA_KNOW_SCORE` | string | Formatted delta (e.g., "+30") |
| `DELTA_KNOW_TREND` | string | Trend indicator arrow |
| `LEARNING_INDEX` | number | Composite learning score (0-100) |
| `LEARNING_SUMMARY` | string | Human-readable summary |
| `GAPS_CLOSED` | array | Knowledge gaps resolved |
| `NEW_GAPS` | array | New gaps discovered |

### conversation-extractor.js

**Purpose**: Group and format message exchanges

**Key Operations**:
- Message timestamp formatting to readable format
- Tool use detection and summarization
- Topic-based grouping using time windows
- Phase classification (Research, Planning, Implementation, Review)
- Auto-generated conversation flowcharts

**Output Structure**:
```javascript
{
  MESSAGES: [...],
  MESSAGE_COUNT: 24,
  DURATION: '45m',
  FLOW_PATTERN: 'Sequential with Decision Points',
  PHASES: [{ PHASE_NAME: 'Implementation', DURATION: '30 min' }],
  AUTO_GENERATED_FLOW: '...'
}
```

### decision-extractor.js

**Purpose**: Capture architectural and technical decisions

**Key Operations**:
- Manual decision processing from `_manualDecisions` array
- MCP observation processing for decision-type observations
- Decision tree generation for complex decisions
- Anchor ID generation and uniqueness validation
- Confidence-based importance classification

**Output Structure**:
```javascript
{
  DECISIONS: [{
    INDEX: 1,
    TITLE: 'Use JWT for Authentication',
    RATIONALE: '...',
    OPTIONS: [...],
    CHOSEN: 'JWT Tokens',
    CONFIDENCE: 85,
    DECISION_ANCHOR_ID: 'decision-001-jwt-auth',
    DECISION_IMPORTANCE: 'high'
  }],
  DECISION_COUNT: 3,
  HIGH_CONFIDENCE_COUNT: 2
}
```

### file-extractor.js

**Purpose**: Track file changes with semantic context

**Key Operations**:
- Path normalization to relative paths
- Multiple source aggregation (FILES array, files_modified, observations)
- Semantic description cleaning and validation
- Observation type detection (bugfix, feature, refactor, decision, research, discovery)
- Anchor ID generation per file

**Exports**:
- `detectObservationType(obs)` - Classify observation by content analysis
- `extractFilesFromData(data, observations)` - Extract file list with descriptions
- `enhanceFilesWithSemanticDescriptions(files, semanticMap)` - Enhance descriptions
- `buildObservationsWithAnchors(observations, specFolder)` - Add anchor IDs to observations

### session-extractor.js

**Purpose**: Capture session state and metadata

**Key Operations**:
- Session ID generation with timestamp and random suffix
- Git branch detection for channel identification
- Context type detection based on tool usage patterns
- Importance tier classification based on file paths
- Project phase detection (RESEARCH, PLANNING, IMPLEMENTATION, REVIEW)
- Blocker extraction from observation narratives
- Related document detection in spec folder

**Exports**:
- `generateSessionId()` - Create unique session identifier
- `getChannel()` - Detect current Git branch
- `detectContextType(toolCounts, decisionCount)` - Classify session context
- `detectImportanceTier(files, contextType)` - Determine importance level
- `detectProjectPhase(toolCounts, observations, messageCount)` - Identify project phase
- `extractNextAction(observations, recentContext)` - Extract next steps from content
- `extractBlockers(observations)` - Find blocker mentions
- `detectRelatedDocs(specFolderPath)` - Find related spec folder documents
- `calculateSessionDuration(prompts, now)` - Compute session length
- `calculateExpiryEpoch(tier, createdAt)` - Set memory expiration

### diagram-extractor.js

**Purpose**: Identify and extract visual diagrams

**Key Operations**:
- ASCII box character detection (`|`, `-`, `+`, etc.)
- Flowchart pattern classification
- Diagram complexity analysis (simple, moderate, complex)
- Auto-generated conversation flowcharts
- Auto-generated decision trees from decision observations

**Exports**:
- `extractDiagrams(collectedData)` - Find and classify diagrams
- `extractPhasesFromData(collectedData)` - Extract conversation phases for flowchart

### implementation-guide-extractor.js

**Purpose**: Generate step-by-step guides from session data

**Key Operations**:
- Implementation work detection (requires 2+ signals: impl type, keywords, file changes)
- Main topic extraction from spec folder name or observations
- Feature extraction with deduplication
- Key file role detection (test, config, entry point, types, utils, etc.)
- Extension guide generation based on patterns
- Code pattern extraction (helper functions, validation, templates, caching, etc.)

**Exports**:
- `hasImplementationWork(observations, files)` - Check if session has implementation
- `extractMainTopic(observations, specFolder)` - Get primary topic
- `extractWhatBuilt(observations)` - List implemented features
- `extractKeyFilesWithRoles(files, observations)` - Assign roles to files
- `generateExtensionGuide(observations, files)` - Create extension suggestions
- `extractCodePatterns(observations, files)` - Identify code patterns used
- `buildImplementationGuideData(observations, files, specFolder)` - Build complete guide

### decision-tree-generator.js

**Purpose**: Generate ASCII decision tree visualizations

**Key Operations**:
- Legacy string-based API support
- Full decision object processing
- Option box formatting
- Chosen option highlighting
- Caveats and follow-up sections

**Output**: ASCII art decision tree with boxes, arrows, and annotations

---

## 7. DATA FLOW

### Extraction Pipeline

```
Raw Session Data (JSON input)
    │
    ├─► collect-session-data.js ─────────────────────────────────────────────┐
    │       │                                                                 │
    │       ├─► extractPreflightPostflightData() → Learning delta metrics     │
    │       ├─► calculateLearningIndex() → Composite learning score           │
    │       ├─► session-extractor.js → Session metadata                       │
    │       ├─► file-extractor.js → File change analysis                      │
    │       └─► implementation-guide-extractor.js → Implementation guide      │
    │                                                                         │
    ├─► conversation-extractor.js → Grouped conversations with anchors        │
    ├─► decision-extractor.js → Structured decisions with rationale           │
    ├─► diagram-extractor.js → Extracted visual diagrams                      │
    └─► decision-tree-generator.js → ASCII decision tree visualizations       │
                                                                              │
                                    ┌─────────────────────────────────────────┘
                                    │
                                    ▼
                         Structured Data Objects
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            renderers/ (template population)    mcp_server/ (vector indexing)
```

### Data Dependencies

| Extractor | Depends On | Provides To |
|-----------|------------|-------------|
| `collect-session-data.js` | All extractors, core/config | Core workflow, template renderer |
| `conversation-extractor.js` | message-utils, flowchart-generator | Template renderer |
| `decision-extractor.js` | anchor-generator, decision-tree-generator | Decision template |
| `file-extractor.js` | file-helpers, anchor-generator | File context template, impl-guide |
| `session-extractor.js` | core/config, Git | Session metadata template |
| `diagram-extractor.js` | flowchart-generator, decision-tree-generator | Diagram template |
| `implementation-guide-extractor.js` | file-extractor | Implementation guide template |
| `decision-tree-generator.js` | ascii-boxes | decision-extractor, diagram-extractor |

---

## 8. TROUBLESHOOTING

### Common Issues

#### Empty Extraction Results

**Symptom**: Extractors return empty arrays or null values

**Cause**: `collectedData` is missing required fields or malformed

**Solution**: Validate input structure before extraction

```javascript
// Check required fields
if (!collectedData.observations) {
  console.warn('Missing observations array');
}
if (!collectedData.user_prompts) {
  console.warn('Missing user_prompts array');
}
```

#### Learning Index Returns 0

**Symptom**: `LEARNING_INDEX` is 0 despite preflight/postflight data

**Cause**: Missing or non-numeric score values

**Solution**: Ensure both preflight and postflight have numeric scores

```javascript
// Verify numeric scores
const hasValidScores =
  typeof collectedData.preflight?.knowledgeScore === 'number' &&
  typeof collectedData.postflight?.knowledgeScore === 'number';

if (!hasValidScores) {
  console.warn('Learning metrics require numeric preflight/postflight scores');
}
```

#### Anchor ID Collisions

**Symptom**: `Error: Duplicate anchor ID detected`

**Cause**: Generated anchor IDs are not unique within spec folder

**Solution**: Ensure spec number extraction works correctly

```javascript
const { extractSpecNumber } = require('../lib/anchor-generator');
const specNum = extractSpecNumber(collectedData.SPEC_FOLDER);
console.log('Spec number:', specNum); // Should be "001", "002", etc.
```

#### Missing Semantic Descriptions

**Symptom**: File descriptions are generic ("Modified during session")

**Cause**: No semantic data in observations or FILES array

**Solution**: Provide descriptions in input data

```javascript
// Include descriptions in FILES array
collectedData.FILES = [
  { FILE_PATH: 'src/auth.js', DESCRIPTION: 'Added JWT validation' }
];
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Module import error | Use `require('./extractors')` not `require('./extractors/index')` |
| Timestamp format error | Verify `formatTimestamp()` from `message-utils` is available |
| Session ID not unique | Check system clock is advancing (not frozen in tests) |
| Decision tree empty | Verify manual decisions array in `collectedData._manualDecisions` |
| Learning metrics missing | Add preflight/postflight objects with numeric scores |
| Auto-save not triggering | Check MESSAGE_COUNT_TRIGGER in CONFIG (default: 50) |

### Diagnostic Commands

```bash
# Test extractor imports
node -e "const e = require('./.opencode/skill/system-spec-kit/scripts/extractors'); console.log(Object.keys(e))"

# Verify learning index calculation
node -e "const { calculateLearningIndex } = require('./.opencode/skill/system-spec-kit/scripts/extractors'); console.log(calculateLearningIndex(30, 30, 30))"

# Check anchor generator availability
node -e "const { generateAnchorId } = require('./.opencode/skill/system-spec-kit/scripts/lib/anchor-generator'); console.log(generateAnchorId('test', 'file', '001'))"

# Test session ID generation
node -e "const { generateSessionId } = require('./.opencode/skill/system-spec-kit/scripts/extractors'); console.log(generateSessionId())"
```

---

## 9. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../core/README.md](../core/README.md) | Core workflow that orchestrates extractors |
| [../README.md](../README.md) | Scripts directory overview |
| [../../SKILL.md](../../SKILL.md) | System-spec-kit skill documentation |
| [../../references/memory/memory_system.md](../../references/memory/memory_system.md) | Memory architecture and design |
| [../../templates/context_template.md](../../templates/context_template.md) | Template using extractor output |

### Related Modules

| Module | Purpose |
|--------|---------|
| `../lib/anchor-generator.js` | Generate unique anchor IDs for extracted data |
| `../lib/flowchart-generator.js` | Generate ASCII flowcharts from phases |
| `../lib/ascii-boxes.js` | Format ASCII boxes for decision trees |
| `../lib/simulation-factory.js` | Generate simulation data when input missing |
| `../utils/message-utils.js` | Timestamp formatting and message processing |
| `../utils/file-helpers.js` | Path normalization and description cleaning |
| `../utils/tool-detection.js` | Detect tool calls in conversation text |
| `../renderers/` | Populate templates with extracted data |

### Spec Folder Reference

| Spec | Relevance |
|------|-----------|
| `077-speckit-upgrade` | Added PREFLIGHT/POSTFLIGHT tracking, Learning Index calculation |

---

*Part of the system-spec-kit conversation memory and context preservation system. Last updated: 2025-01-23*
