---
title: Config Style Guide
description: Formatting standards and conventions for JSONC behavior config and strict-JSON machine descriptors in the OpenCode development environment.
trigger_phrases:
  - "opencode config style guide"
  - "jsonc formatting standards"
  - "config section organization"
  - "json style conventions"
importance_tier: normal
contextType: implementation
version: 1.0.0.12
---

# Config Style Guide

Formatting standards and conventions for JSONC behavior config and strict-JSON machine descriptors in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Defines consistent styling rules for configuration files to ensure readability and maintainability across OpenCode behavior config and machine descriptor files.

### Scope

Applies to two config genres:
- **JSONC behavior config** — human-maintained runtime settings such as `.opencode/skills/system-spec-kit/config/config.jsonc`. Comments and trailing commas are syntactically allowed; keep comments purposeful and follow the local file's existing comma style.
- **Strict-JSON machine descriptors** — no comments and no trailing commas. This includes advisor descriptors (`description.json`), skill-graph identity (`graph-metadata.json`), hub registries (`mode-registry.json`), and the root OpenCode runtime config (`opencode.json`).

### Key Sources

| File | Evidence |
|------|----------|
| `.opencode/skills/system-spec-kit/config/config.jsonc` | Header format, section comments, structure |
| `.opencode/skills/sk-code/description.json` | Advisor descriptor shape |
| `.opencode/skills/sk-code/graph-metadata.json` | Skill-graph identity shape |
| `.opencode/skills/sk-code/mode-registry.json` | Hub registry shape |
| `opencode.json` | Root OpenCode runtime config shape |

---

## 2. FILE STRUCTURE

Use JSONC structure rules only for JSONC behavior config. Strict-JSON machine descriptors must stay parseable as plain JSON: no comments, no trailing commas, and no header blocks.

### JSONC Header

Use the standard comment header for JSONC behavior config files:

```jsonc
// ───────────────────────────────────────────────────────────────
// CONFIG: [CONFIG NAME]
// ───────────────────────────────────────────────────────────────
{
  // Configuration content
}
```

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:1-3`

### Section Organization

Organize JSONC behavior configuration into numbered sections:

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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:5-24`

---

## 3. NAMING CONVENTIONS

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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc` throughout

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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:19-30`

---

## 4. COMMENTS (JSONC)

Comments belong only in JSONC behavior config. Strict-JSON machine descriptors (`description.json`, `graph-metadata.json`, `mode-registry.json`, `opencode.json`) cannot contain comments.

### Section Headers

Use consistent section header format:

```jsonc
// ─────────────────────────────────────────────────────────────
// N. SECTION NAME
// ─────────────────────────────────────────────────────────────
```

The divider line should be 67 characters (same as header width).

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:5-7`

### Inline Comments

Use inline comments to explain non-obvious values:

1. **Quantity limit:** Maximum 3 comments per 10 lines in JSONC blocks
2. **Purposeful semantics only:** Explain WHY, not WHAT
3. **No narrative/mechanical comments** such as "set value" or "loop through"

```jsonc
{
  "scaleDays": 90,              // Half-life ~ 62 days with this value
  "enabled": true,              // Explicit opt-out avoids implicit defaults
  "decayWeight": 0.3,           // Balances recency vs relevance drift
  "rrfK": 60                    // Fixed RRF constant for rank fusion
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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:39-47`

---

## 5. VALUE FORMATTING

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

## 6. STRUCTURE PATTERNS

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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:19-24`

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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:53-60`

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

**Evidence**: `.opencode/skills/system-spec-kit/config/config.jsonc:76-87`

---

## 7. SCHEMA REFERENCE

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

## 8. INDENTATION AND SPACING

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

- Strict JSON: no trailing commas
- JSONC behavior config: trailing commas are syntactically allowed, but follow the existing file's comma style
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

## 9. FILE NAMING

### Conventions

| Type | Pattern | Example |
|------|---------|---------|
| JSONC behavior config | `config.jsonc` | `.opencode/skills/system-spec-kit/config/config.jsonc` |
| Advisor descriptor | `description.json` | `.opencode/skills/sk-code/description.json` |
| Skill-graph identity | `graph-metadata.json` | `.opencode/skills/sk-code/graph-metadata.json` |
| Hub registry | `mode-registry.json` | `.opencode/skills/sk-code/mode-registry.json` |
| Root OpenCode runtime config | `opencode.json` | `opencode.json` |
| Command route assets | `*.yaml` | `.opencode/commands/create/assets/create_skill_auto.yaml` |

### Location

```
opencode.json                         # Root OpenCode runtime config (strict JSON)
.opencode/
├── commands/
│   ├── doctor/_routes.yaml           # Command router table (YAML)
│   └── [command]/assets/
│       └── [route]_{auto,confirm}.yaml
├── plugins/
│   └── *.js                          # OpenCode plugin entrypoints
└── skills/
    ├── sk-code/
    │   ├── description.json          # Advisor descriptor (strict JSON)
    │   ├── graph-metadata.json       # Skill-graph identity (strict JSON)
    │   └── mode-registry.json        # Hub registry (strict JSON)
    └── system-spec-kit/config/
        └── config.jsonc              # JSONC behavior config
```

---

## 10. RELATED RESOURCES

### Internal References
- [quick_reference.md](./quick_reference.md) - Quick lookup for config patterns

### External Standards
- [JSON Specification](https://www.json.org/)
- [JSONC (JSON with Comments)](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
