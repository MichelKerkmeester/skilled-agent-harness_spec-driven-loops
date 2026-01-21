# Spec Folder Utilities

> JavaScript modules for spec folder detection, alignment validation, and directory setup.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)

---

## 1. 📖 OVERVIEW

### What are Spec Folder Utilities?

The `scripts/spec-folder/` directory contains Node.js modules that handle intelligent spec folder detection and alignment validation. These utilities ensure memory context is saved to the correct spec folder by analyzing conversation topics, validating alignment scores, and managing directory setup.

### Key Features

| Feature                     | Description                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------- |
| **Smart Detection**         | Auto-detect appropriate spec folder from CLI args, prompts, or conversation context |
| **Alignment Validation**    | Calculate alignment scores between conversation topics and spec folder names        |
| **Archive Filtering**       | Automatically exclude archived folders (z_, archive, old patterns)                  |
| **Multi-Directory Support** | Handle both `specs/` and `.opencode/specs/` locations                               |
| **Topic Extraction**        | Extract keywords from conversation context and observations                         |

### Requirements

| Requirement | Minimum | Details                            |
| ----------- | ------- | ---------------------------------- |
| Node.js     | 16+     | ES modules and async/await support |
| npm         | 8+      | Package manager                    |

---

## 2. 🚀 QUICK START

### Using in Memory Save Workflow

```javascript
const { detectSpecFolder, validateContentAlignment } = require('./spec-folder');

// Auto-detect spec folder from conversation context
const specFolder = await detectSpecFolder(collectedData);

// Validate alignment between conversation and folder
const alignment = await validateContentAlignment(
  collectedData,
  '042-feature-name',
  '/path/to/specs'
);

console.log(`Alignment score: ${alignment.score}%`);
```

### Standalone Usage

```javascript
const { filterArchiveFolders, setupContextDirectory } = require('./spec-folder');

// Filter out archived folders
const activeFolders = filterArchiveFolders([
  '042-feature',
  'z_old-feature',
  '043-new-feature'
]);
// Returns: ['042-feature', '043-new-feature']

// Setup memory directory
await setupContextDirectory('specs/042-feature');
// Creates: specs/042-feature/memory/
```

### Topic Extraction

```javascript
const { extractConversationTopics } = require('./spec-folder');

const topics = extractConversationTopics({
  recent_context: [{
    request: 'Fix authentication issues in login flow'
  }],
  observations: [
    { title: 'Auth token validation error' }
  ]
});
// Returns: ['authentication', 'login', 'flow', 'auth', 'token', 'validation', 'error']
```

---

## 3. 📁 STRUCTURE

```
scripts/spec-folder/
├── index.js                  # Module exports and public API
├── folder-detector.js        # Spec folder detection logic
├── alignment-validator.js    # Topic alignment scoring
└── directory-setup.js        # Directory creation and validation
```

### Key Files

| File                     | Purpose                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `index.js`               | Central export point for all spec-folder utilities                                  |
| `folder-detector.js`     | Detects appropriate spec folder from CLI args, prompts, or context analysis         |
| `alignment-validator.js` | Validates alignment between conversation topics and folder names, calculates scores |
| `directory-setup.js`     | Creates and validates `memory/` directory within spec folders                       |

---

## 4. 🛠️ TROUBLESHOOTING

### Common Issues

#### Spec folder detection fails

**Symptom**: `Error: Spec folder not found: 042-feature`

**Cause**: Spec folder doesn't exist or path format is incorrect

**Solution**:
```bash
# Check available spec folders
ls -la specs/

# Use correct format: ###-feature-name
node generate-context.js 042-feature  # Not "specs/042-feature"
```

#### Alignment score is low despite correct folder

**Symptom**: Script suggests alternative folder when current is correct

**Cause**: Conversation topics don't match folder name keywords

**Solution**: Manually confirm correct folder when prompted or use CLI argument:
```bash
# Force specific folder with CLI arg
node generate-context.js /tmp/context.json 042-feature
```

#### Multiple specs directories warning

**Symptom**: `⚠️ Multiple specs directories found`

**Cause**: Both `specs/` and `.opencode/specs/` exist

**Solution**: This is informational - the script uses priority order (specs/ first):
```javascript
// Priority order:
// 1. specs/ (if exists)
// 2. .opencode/specs/ (fallback)
```

### Quick Fixes

| Problem                        | Quick Fix                                       |
| ------------------------------ | ----------------------------------------------- |
| Module not found               | `npm install` in project root                   |
| Permission denied on memory/   | `chmod 755 specs/042-feature`                   |
| Archive pattern false positive | Rename folder without z_, archive, old patterns |
| Wrong folder selected          | Use CLI argument to override detection          |

### Diagnostic Commands

```bash
# Test folder detection
node -e "require('./scripts/spec-folder').detectSpecFolder().then(console.log)"

# Check available specs directories
ls -la specs/ .opencode/specs/

# Validate alignment manually
node -e "
  const { calculateAlignmentScore } = require('./scripts/spec-folder');
  const score = calculateAlignmentScore(['auth', 'login'], '042-auth-fix');
  console.log('Score:', score);
"
```

---

## 5. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document                                                                                   | Purpose                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| [system-spec-kit/SKILL.md](../../SKILL.md)                                                 | Parent skill documentation                        |
| [scripts/memory/generate-context.js](../memory/generate-context.js)                        | Main memory save script that uses these utilities |
| [references/memory/save_workflow.md](../../references/memory/save_workflow.md)             | Memory save workflow reference                    |
| [references/structure/folder_structure.md](../../references/structure/folder_structure.md) | Spec folder structure reference                   |

### External Resources

| Resource                                                | Description                           |
| ------------------------------------------------------- | ------------------------------------- |
| [Node.js File System](https://nodejs.org/api/fs.html)   | Node.js fs/promises API documentation |
| [CommonJS Modules](https://nodejs.org/api/modules.html) | Module system reference               |

---

*Documentation version: 1.0 | Last updated: 2026-01-21*