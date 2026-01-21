# Data Loaders

> Data loading utilities for conversation context from multiple sources with validation and normalization.

---

## 1. 📖 OVERVIEW

### What is the loaders/ Directory?

The `loaders/` directory contains utilities for loading conversation data from multiple sources with validation, normalization, and security checks. It provides a unified interface for importing context from JSON files, OpenCode sessions, or simulation fallbacks.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 2 | Data loader, index |
| Data Sources | 3 | JSON file, OpenCode capture, simulation |
| Security Checks | 6 | Path validation, directory traversal prevention |
| Supported Platforms | 2 | macOS (with /private/tmp handling), Linux/Unix |

### Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Source Loading** | Load from JSON file, OpenCode session, or simulation fallback |
| **Input Validation** | Schema validation for conversation data structure |
| **Security Hardened** | Path traversal mitigation (CWE-22) with allowed base directories |
| **Cross-Platform Temp** | Handles macOS /tmp symlink to /private/tmp automatically |
| **Normalized Output** | Consistent data structure regardless of source |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| File System Access | Read | Read/Write for temp files |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```javascript
// Import the loader
const { loadCollectedData } = require('./loaders');

// Load data (auto-detects source)
const data = await loadCollectedData();

// Data is ready to use
console.log(`Loaded ${data.messages?.length || 0} messages`);
```

### Verify Installation

```bash
# Check that loader modules exist
ls .opencode/skill/system-spec-kit/scripts/loaders/

# Expected output:
# data-loader.js  index.js  README.md
```

### First Use

```javascript
// In generate-context.js or similar script
const { loadCollectedData } = require('./loaders');

// Load with automatic source detection
const data = await loadCollectedData();

if (data._isSimulation) {
  console.log('Using simulation mode - placeholder data');
} else {
  console.log(`Loaded real conversation data`);
}
```

---

## 3. 📁 STRUCTURE

```
loaders/
├── data-loader.js      # Core loading logic with multi-source support
├── index.js            # Public API exports
└── README.md           # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `data-loader.js` | Multi-source data loading with validation and security checks |
| `index.js` | Public exports for loader module |

---

## 4. ⚡ FEATURES

### Multi-Source Loading

The loader attempts sources in priority order until successful:

| Priority | Source | When Used |
|----------|--------|-----------|
| **1** | JSON Data File | `CONFIG.DATA_FILE` provided via CLI argument |
| **2** | OpenCode Session | Active OpenCode conversation in project |
| **3** | Simulation Fallback | No other sources available (warning emitted) |

### Security Features

**Path Traversal Protection (CWE-22)**:

| Security Check | Purpose |
|----------------|---------|
| **Allowed Base Directories** | Restrict file access to safe paths only |
| **Path Sanitization** | Validate paths before file system access |
| **Cross-Platform Temp** | Handle macOS /tmp → /private/tmp symlink |

**Allowed base directories**:
- `os.tmpdir()` - System temp directory
- `/tmp` - macOS symlink
- `/private/tmp` - macOS actual temp location
- `process.cwd()` - Current working directory
- `specs/` - Spec folders
- `.opencode/` - OpenCode directory

### Input Validation

| Validation | Purpose |
|------------|---------|
| **Schema Validation** | Ensure required fields present |
| **JSON Parsing** | Catch syntax errors with position info |
| **Data Normalization** | Transform to consistent structure |
| **OpenCode Transform** | Convert OpenCode format to standard format |

### Error Handling

| Error Type | Handling |
|------------|----------|
| **File Not Found** | Warning logged, try next source |
| **Invalid JSON** | Warning with position info, try next source |
| **Path Security** | Error thrown, execution halted |
| **OpenCode Capture** | Warning logged, try next source |

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Load from JSON File

```javascript
const { loadCollectedData } = require('./loaders');

// Provide data file via CONFIG
process.env.DATA_FILE = '/tmp/save-context-data.json';

const data = await loadCollectedData();
console.log(`Loaded ${data.messages.length} messages from file`);
```

**Result**: Validated conversation data from JSON file

---

### Example 2: Load from OpenCode Session

```javascript
const { loadCollectedData } = require('./loaders');

// No CONFIG.DATA_FILE set - will try OpenCode capture
const data = await loadCollectedData();

if (!data._isSimulation) {
  console.log(`Session: ${data.sessionTitle}`);
  console.log(`Exchanges: ${data.exchanges.length}`);
}
```

**Result**: Live conversation data from OpenCode session

---

### Example 3: Simulation Fallback

```javascript
const { loadCollectedData } = require('./loaders');

// No data file, no OpenCode session available
const data = await loadCollectedData();

if (data._isSimulation) {
  console.warn('WARNING: Using placeholder data');
  console.log('To save real context:');
  console.log('  node generate-context.js /tmp/save-context-data.json');
}
```

**Result**: Placeholder data with warning

---

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Load any source | `await loadCollectedData()` | General use - auto-detect source |
| Check if simulation | `if (data._isSimulation)` | Warn user about placeholder data |
| Provide JSON file | Set `CONFIG.DATA_FILE` | Explicit data source control |
| OpenCode capture | No config, in OpenCode project | Live session context |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Security: Invalid data file path

**Symptom**: `Security: Invalid data file path: path traversal detected`

**Cause**: Data file path outside allowed base directories

**Solution**:
```bash
# Use allowed paths only
node generate-context.js /tmp/save-context-data.json        # ✅ Allowed
node generate-context.js specs/007-auth/context.json        # ✅ Allowed
node generate-context.js /etc/passwd                        # ❌ Blocked
```

---

#### Invalid JSON in data file

**Symptom**: `Invalid JSON in data file: Unexpected token } at position 456`

**Cause**: Malformed JSON syntax

**Solution**:
```bash
# Validate JSON before passing to loader
cat /tmp/save-context-data.json | jq . > /dev/null
# If jq succeeds, JSON is valid

# Or use Node.js
node -e "JSON.parse(require('fs').readFileSync('/tmp/save-context-data.json', 'utf-8'))"
```

---

#### OpenCode capture unavailable

**Symptom**: `OpenCode capture unavailable: Cannot find module 'opencode-capture'`

**Cause**: Optional dependency not available or not in OpenCode project

**Solution**: This is expected behavior. The loader will fall back to simulation mode. To use real data:

```bash
# Option 1: Provide JSON file explicitly
node generate-context.js /tmp/save-context-data.json

# Option 2: Run from within OpenCode conversation
# OpenCode will auto-detect and capture session
```

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Path security error | Move file to `/tmp/` or project directory |
| JSON parse error | Validate with `jq` or `JSON.parse()` |
| No data loaded | Provide JSON file path as argument |
| Simulation mode warning | Expected if no data file or OpenCode session |
| macOS temp path issues | Use `/tmp/` - symlink handled automatically |

---

### Diagnostic Commands

```bash
# Check environment configuration
node -e "console.log('CWD:', process.cwd()); console.log('TMPDIR:', require('os').tmpdir())"

# Validate JSON file
jq . /tmp/save-context-data.json

# Test loader import
node -e "require('.opencode/skill/system-spec-kit/scripts/loaders'); console.log('Import OK')"

# Check if in OpenCode project
ls -la .opencode/
```

---

## 9. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../utils/input-normalizer.js](../utils/input-normalizer.js) | Input validation and normalization logic |
| [../lib/opencode-capture.js](../lib/opencode-capture.js) | OpenCode session capture implementation |
| [generate-context.js](../memory/generate-context.js) | Main script using this loader |
| [../../SKILL.md](../../SKILL.md) | Parent skill documentation |

### External Resources

| Resource | Description |
|----------|-------------|
| [CWE-22](https://cwe.mitre.org/data/definitions/22.html) | Path Traversal vulnerability reference |
| [Node.js fs/promises](https://nodejs.org/api/fs.html#promises-api) | File system API documentation |
| [JSON Schema](https://json-schema.org/) | Validation schema standard |
