---
title: Config Style Guide
description: Formatting standards and conventions for JSON and JSONC configuration files in the OpenCode development environment.
---

# Config Style Guide

Formatting standards and conventions for JSON and JSONC configuration files in the OpenCode development environment.

---

## 1. 📖 OVERVIEW

### Purpose

Defines consistent styling rules for configuration files to ensure readability and maintainability across all OpenCode config files.

### Scope

Applies to all configuration files:
- `.opencode/skill/*/config/*.jsonc` - Skill configuration
- `.opencode/config/` - Global configuration
- `*.json`, `*.jsonc` - Project configuration files

### Key Sources

| File | Evidence |
|------|----------|
| `config/config.jsonc` | Header format, section comments, structure |

---

## 2. 📁 FILE STRUCTURE

### JSONC Header

Use the standard comment header for configuration files:

```jsonc
// ───────────────────────────────────────────────────────────────
// CONFIG: [CONFIG NAME]
// ───────────────────────────────────────────────────────────────
{
  // Configuration content
}
```

**Evidence**: `config/config.jsonc:1-3`

### Section Organization

Organize configuration into numbered sections:

```jsonc
{
  // ─────────────────────────────────────────────────────────────
  // 1. LEGACY SETTINGS
  // ─────────────────────────────────────────────────────────────
  "maxResultPreview": 500,
  "maxConversationMessages": 100,

  // ─────────────────────────────────────────────────────────────
  // 2. SEMANTIC SEARCH
  // ─────────────────────────────────────────────────────────────
  "semanticSearch": {
    "enabled": true,
    "minSimilarityScore": 50
  }
}
```

**Evidence**: `config/config.jsonc:5-24`

---

## 3. 🏷️ NAMING CONVENTIONS

### Property Keys

**Use**: `camelCase` for all property keys

```jsonc
{
  // Correct - camelCase
  "maxResultPreview": 500,
  "minSimilarityScore": 50,
  "autoRebuildOnSave": true,
  "databasePath": "./database.sqlite",

  // WRONG - other cases
  "max_result_preview": 500,    // snake_case
  "MaxResultPreview": 500,      // PascalCase
  "max-result-preview": 500     // kebab-case
}
```

**Evidence**: `config/config.jsonc` throughout

### Boolean Properties

Use positive naming (avoid double negatives):

```jsonc
{
  // Correct - positive naming
  "enabled": true,
  "verifyOnStartup": false,
  "autoRebuildOnSave": true,

  // WRONG - double negatives
  "disableVerification": true,  // Confusing
  "noAutoRebuild": false        // Double negative
}
```

### Nested Objects

Use descriptive names for nested configuration sections:

```jsonc
{
  "semanticSearch": {
    "enabled": true,
    "minSimilarityScore": 50,
    "maxResults": 10
  },
  "memoryIndex": {
    "databasePath": "./database.sqlite",
    "autoRebuildOnSave": true
  }
}
```

**Evidence**: `config/config.jsonc:19-30`

---

## 4. 📄 COMMENTS (JSONC)

### Section Headers

Use consistent section header format:

```jsonc
// ─────────────────────────────────────────────────────────────
// N. SECTION NAME
// ─────────────────────────────────────────────────────────────
```

The divider line should be 67 characters (same as header width).

**Evidence**: `config/config.jsonc:5-7`

### Inline Comments

Use inline comments to explain non-obvious values:

```jsonc
{
  "scaleDays": 90,              // Half-life ~ 62 days with this value
  "decayWeight": 0.3,           // Relative importance vs recency
  "rrfK": 60                    // RRF constant for rank fusion
}
```

### Documentation Comments

Add documentation comments for complex settings:

```jsonc
{
  // ─────────────────────────────────────────────────────────────
  // 3. MEMORY DECAY
  // ─────────────────────────────────────────────────────────────
  // Half-life ≈ 62 days with scaleDays=90
  "memoryDecay": {
    "enabled": true,
    "scaleDays": 90,
    "decayWeight": 0.3
  }
}
```

**Evidence**: `config/config.jsonc:39-47`

---

## 5. 📐 VALUE FORMATTING

### Strings

Use double quotes for all strings:

```jsonc
{
  "databasePath": ".opencode/database.sqlite",
  "embeddingModel": "voyage-4",
  "styleFallback": "minimal"
}
```

### Numbers

Use appropriate number types:

```jsonc
{
  "maxResults": 10,             // Integer
  "minSimilarityScore": 50,     // Integer percentage
  "decayWeight": 0.3,           // Float (0-1)
  "rrfK": 60                    // Algorithm constant
}
```

### Booleans

Use lowercase `true`/`false`:

```jsonc
{
  "enabled": true,
  "verifyOnStartup": false,
  "alwaysSurface": true
}
```

### Null Values

Use `null` for explicitly unset values:

```jsonc
{
  "autoExpireDays": null,       // No expiration
  "maxTokens": null             // No limit
}
```

---

## 6. 📁 STRUCTURE PATTERNS

### Feature Flags

```jsonc
{
  "featureName": {
    "enabled": true,
    "option1": "value",
    "option2": 100
  }
}
```

**Evidence**: `config/config.jsonc:19-24`

### Tier/Level Configuration

```jsonc
{
  "importanceTiers": {
    "constitutional": { "searchBoost": 3.0, "decay": false },
    "critical": { "searchBoost": 2.0, "decay": false },
    "important": { "searchBoost": 1.5, "decay": false },
    "normal": { "searchBoost": 1.0, "decay": true },
    "temporary": { "searchBoost": 0.5, "decay": true }
  }
}
```

**Evidence**: `config/config.jsonc:53-60`

### Rule Configuration

```jsonc
{
  "contextTypeDetection": {
    "enabled": true,
    "rules": {
      "research": { "readToolsThreshold": 0.5, "writeToolsMax": 0.1 },
      "implementation": { "writeToolsThreshold": 0.3 },
      "decision": { "requiresAskUser": true }
    },
    "defaultType": "general"
  }
}
```

**Evidence**: `config/config.jsonc:76-87`

---

## 7. 📐 SCHEMA REFERENCE

### Including Schema

Reference JSON Schema when available:

```jsonc
{
  "$schema": "https://json-schema.org/draft-07/schema",
  // or for VSCode settings
  "$schema": "vscode://schemas/settings/user"
}
```

### Common Schema Patterns

```jsonc
{
  // Type hints via comments when no schema
  "port": 3000,                 // number: 1-65535
  "logLevel": "info",           // enum: debug, info, warn, error
  "timeout": 30000              // number: milliseconds
}
```

---

## 8. 📌 INDENTATION AND SPACING

### Indentation

Use 2 spaces for indentation (consistent with JSON convention):

```jsonc
{
  "level1": {
    "level2": {
      "level3": "value"
    }
  }
}
```

### Spacing

- No trailing commas (JSON requirement, JSONC allows but avoid)
- One property per line
- Blank lines between sections

```jsonc
{
  // Section 1
  "property1": "value1",
  "property2": "value2",

  // Section 2
  "property3": "value3"
}
```

---

## 9. 🏷️ FILE NAMING

### Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Main config | `config.jsonc` | `config/config.jsonc` |
| Feature config | `[feature].jsonc` | `filters.jsonc` |
| Settings | `[scope]-config.jsonc` | `complexity-config.jsonc` |

### Location

```
.opencode/
├── config/
│   └── opencode.json         # Main OpenCode config
└── skill/
    └── [skill-name]/
        └── config/
            ├── config.jsonc        # Main skill config
            ├── filters.jsonc       # Feature-specific
            └── complexity-config.jsonc
```

---

## 10. 🔗 RELATED RESOURCES

### Internal References
- [quick_reference.md](./quick_reference.md) - Quick lookup for config patterns

### External Standards
- [JSON Specification](https://www.json.org/)
- [JSONC (JSON with Comments)](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
