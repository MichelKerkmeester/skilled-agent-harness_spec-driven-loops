# Core System Scripts

> Core workflow orchestration and configuration modules for the system-spec-kit memory and context generation system.

---

## 1. 📖 OVERVIEW

### What is Core?

The `core/` directory contains the foundational modules that orchestrate the entire system-spec-kit workflow. This includes configuration management, the main workflow engine that coordinates context generation, and module exports for clean dependency management across the system.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Core Modules | 3 | workflow.js, config.js, index.js |
| Orchestration Phases | 6 | Setup, extraction, enhancement, rendering, validation, persistence |
| Dependencies | 4+ | extractors/, renderers/, lib/, mcp_server/ |

### Key Features

| Feature | Description |
|---------|-------------|
| **Workflow Orchestration** | Coordinates all extractors, renderers, and memory operations in correct sequence |
| **Configuration Management** | Loads and validates project-wide settings with JSONC comment support |
| **Atomic File Operations** | Ensures file writes are validated for placeholders and anchors before committing |
| **Database Integration** | Manages vector database updates and notification mechanisms |
| **Lazy Loading** | Defers heavy dependencies until needed for faster startup times |

### Requirements

| Requirement | Minimum | Used For |
|-------------|---------|----------|
| Node.js | 14+ | Module system and async/await |
| Dependencies | extractors/, lib/, renderers/ | Data processing and template rendering |

---

## 2. 🚀 QUICK START

### Running the Core Workflow

The core workflow is typically invoked through the main entry point, not directly:

```bash
# Generate context for a spec folder (invokes core workflow)
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/001-example/

# The workflow will:
# 1. Load configuration from config/config.jsonc
# 2. Detect the spec folder and setup context directory
# 3. Extract conversations, decisions, diagrams, files
# 4. Generate summaries and embeddings
# 5. Populate templates and write memory files atomically
# 6. Update vector database index
```

### Configuration

Configuration is loaded from `.opencode/skill/system-spec-kit/config/config.jsonc`:

```jsonc
{
  "maxResultPreview": 500,
  "maxConversationMessages": 100,
  "maxToolOutputLines": 100,
  "messageTimeWindow": 300000,      // 5 minutes
  "contextPreviewHeadLines": 50,
  "contextPreviewTailLines": 20,
  "timezoneOffsetHours": 0          // UTC default
}
```

---

## 3. 📁 STRUCTURE

```
core/
├── workflow.js           # Main orchestration engine (23KB)
├── config.js            # Configuration loader with JSONC support (6.5KB)
└── index.js             # Module exports for clean imports (1KB)
```

### Module Responsibilities

| Module | Exports | Used By |
|--------|---------|---------|
| `config.js` | `CONFIG`, `findActiveSpecsDir()` | All scripts needing project configuration |
| `workflow.js` | `runWorkflow()` | Memory generation entry points |
| `index.js` | Re-exports from `config.js` | Scripts importing from `core/` |

---

## 4. ⚡ FEATURES

### Workflow Orchestration

The `workflow.js` module coordinates the entire context generation pipeline:

| Phase | Operations | Output |
|-------|------------|--------|
| **1. Setup** | Detect spec folder, setup context directory, load config | Context directory structure |
| **2. Extraction** | Extract conversations, decisions, diagrams, files, sessions | Structured data objects |
| **3. Enhancement** | Generate semantic descriptions, implementation summaries | Enhanced data with embeddings |
| **4. Rendering** | Populate templates with extracted data | Markdown content |
| **5. Validation** | Check for leaked placeholders, validate anchors | Validation warnings |
| **6. Persistence** | Write files atomically, update database index | Memory files on disk |

### Configuration Management

**JSONC Support**: Load configuration files with inline comments:
```javascript
const { CONFIG } = require('./core/config');

// Access configuration values
console.log(CONFIG.maxConversationMessages); // 100
console.log(CONFIG.PROJECT_ROOT);            // Auto-detected project root
```

**Environment Detection**: Auto-detects project root and active specs directory.

### Atomic File Operations

All file writes go through validation:
- **Placeholder Detection**: Blocks writes with unreplaced `{{TEMPLATE_VAR}}` markers
- **Anchor Validation**: Checks for unclosed or orphaned anchor tags
- **Atomic Writes**: Ensures all files succeed or none are written

### Lazy Loading

Heavy dependencies are loaded only when needed:
```javascript
// Libraries loaded on-demand:
- flowchart-generator (when diagrams detected)
- semantic-summarizer (when file changes present)
- embeddings (when vector operations needed)
- vector-index (when database updates required)
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Importing Configuration

```javascript
const { CONFIG, findActiveSpecsDir } = require('./core');

console.log('Project root:', CONFIG.PROJECT_ROOT);
console.log('Active specs:', findActiveSpecsDir());
console.log('Max messages:', CONFIG.maxConversationMessages);
```

### Example 2: Running the Workflow Programmatically

```javascript
const { runWorkflow } = require('./core/workflow');

async function generateContext(specFolder) {
  try {
    const result = await runWorkflow({
      specFolder,
      sessionData: collectedData,
      options: { skipValidation: false }
    });
    console.log('Context generated:', result.files);
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
}
```

### Example 3: Custom Configuration Override

```javascript
const { CONFIG } = require('./core/config');

// Override defaults for specific use case
CONFIG.maxConversationMessages = 200;
CONFIG.contextPreviewHeadLines = 100;
```

---

## 6. 🔧 ARCHITECTURE

### Dependency Flow

```
workflow.js
    ├─► config.js (configuration)
    ├─► extractors/ (data extraction)
    │   ├─► conversation-extractor.js
    │   ├─► decision-extractor.js
    │   ├─► diagram-extractor.js
    │   ├─► file-extractor.js
    │   ├─► session-extractor.js
    │   └─► collect-session-data.js
    ├─► renderers/ (template population)
    ├─► lib/ (support libraries)
    │   ├─► semantic-summarizer.js
    │   ├─► embeddings.js
    │   ├─► flowchart-generator.js
    │   └─► trigger-extractor.js
    └─► mcp_server/lib/search/vector-index (database)
```

### Key Workflow Steps

1. **Initialization**: Load config, detect spec folder, setup context directory
2. **Data Collection**: Extract data from spec folder files and session metadata
3. **Processing**: Generate summaries, embeddings, semantic descriptions
4. **Validation**: Check placeholders, anchors, data structure
5. **Output**: Write memory files atomically, update vector database
6. **Notification**: Signal database updates via `.db-updated` file

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Leaked Placeholders Error

**Symptom**: `Error: Leaked placeholders in [filename]: {{VAR_NAME}}`

**Cause**: Template variable was not replaced during rendering

**Solution**: Check template population logic in `renderers/` - ensure all variables have values

```javascript
// Verify data before rendering
console.log('Template data:', templateData);
```

#### Unclosed Anchor Warning

**Symptom**: `Unclosed: context` or `Orphaned: /context`

**Cause**: Anchor tags don't have matching open/close pairs

**Solution**: Verify anchor format in templates:
```markdown
<!-- ANCHOR:context -->
Content here
<!-- /ANCHOR:context -->
```

#### Configuration Not Loading

**Symptom**: Using default values instead of custom config

**Cause**: `config.jsonc` has syntax errors or invalid JSON

**Solution**: Validate JSONC syntax (comments must use `//` not `/* */`)

```bash
# Check for syntax errors
cat .opencode/skill/system-spec-kit/config/config.jsonc
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Module not found | Check require path is `./core` not `../core` |
| Workflow hangs | Check for missing extractors in lazy load section |
| Database not updating | Verify `.db-updated` file permissions |

### Diagnostic Commands

```bash
# Check configuration is valid
node -e "console.log(require('./.opencode/skill/system-spec-kit/scripts/core/config').CONFIG)"

# Verify project root detection
node -e "const { findActiveSpecsDir } = require('./.opencode/skill/system-spec-kit/scripts/core'); console.log(findActiveSpecsDir())"

# Test workflow import
node -e "const { runWorkflow } = require('./.opencode/skill/system-spec-kit/scripts/core/workflow'); console.log('Workflow loaded')"
```

---

## 8. 📚 RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [extractors/README.md](../extractors/README.md) | Data extraction modules used by workflow |
| [../README.md](../README.md) | Scripts directory overview |
| [../../SKILL.md](../../SKILL.md) | System-spec-kit skill documentation |
| [config/config.jsonc](../../config/config.jsonc) | Project-wide configuration |

### Related Modules

| Module | Purpose |
|--------|---------|
| `renderers/` | Template population using extracted data |
| `lib/` | Support libraries for embeddings, summarization |
| `mcp_server/` | Vector database and search functionality |

---

*Part of the system-spec-kit conversation memory and context preservation system.*
