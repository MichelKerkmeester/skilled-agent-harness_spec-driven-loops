---
title: Config Quick Reference
description: Fast lookup for JSON/JSONC configuration patterns and common structures in OpenCode.
---

# Config Quick Reference

Fast lookup for JSON/JSONC configuration patterns and common structures in OpenCode.

---

## 1. 📖 OVERVIEW

### Purpose

Quick-access reference card for configuration file patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation

---

## 2. 📋 FILE TEMPLATE

```jsonc
// ───────────────────────────────────────────────────────────────
// CONFIG: [CONFIG NAME]
// ───────────────────────────────────────────────────────────────
{
  // ─────────────────────────────────────────────────────────────
  // 1. CORE SETTINGS
  // ─────────────────────────────────────────────────────────────
  "maxResults": 100,
  "timeout": 30000,

  // ─────────────────────────────────────────────────────────────
  // 2. FEATURE CONFIGURATION
  // ─────────────────────────────────────────────────────────────
  "featureName": {
    "enabled": true,
    "option1": "value",
    "option2": 100
  },

  // ─────────────────────────────────────────────────────────────
  // 3. ADVANCED SETTINGS
  // ─────────────────────────────────────────────────────────────
  "advanced": {
    "debugMode": false,
    "logLevel": "info"
  }
}
```

---

## 3. 🏷️ NAMING CONVENTIONS

| Element | Convention | Example |
|---------|------------|---------|
| Property keys | camelCase | `maxResults`, `minScore` |
| Boolean props | Positive naming | `enabled`, `autoSave` |
| Nested objects | Descriptive | `semanticSearch`, `memoryIndex` |
| Files | kebab-case | `config.jsonc`, `filters.jsonc` |

---

## 4. 📄 SECTION HEADERS

### Standard Format

```jsonc
// ─────────────────────────────────────────────────────────────
// N. SECTION NAME
// ─────────────────────────────────────────────────────────────
```

### With Documentation

```jsonc
// ─────────────────────────────────────────────────────────────
// 3. MEMORY DECAY
// ─────────────────────────────────────────────────────────────
// Half-life ≈ 62 days with scaleDays=90
// Controls how old memories lose relevance
```

---

## 5. 💡 COMMON PATTERNS

### Feature Toggle

```jsonc
{
  "featureName": {
    "enabled": true,
    "setting1": "value",
    "setting2": 100
  }
}
```

### Threshold Configuration

```jsonc
{
  "thresholds": {
    "low": 1,
    "medium": 5,
    "high": 10
  }
}
```

### Tier System

```jsonc
{
  "tiers": {
    "tier1": { "boost": 3.0, "decay": false },
    "tier2": { "boost": 2.0, "decay": false },
    "tier3": { "boost": 1.0, "decay": true }
  }
}
```

### Rule-Based Config

```jsonc
{
  "rules": {
    "ruleType1": { "threshold": 0.5, "maxValue": 0.1 },
    "ruleType2": { "threshold": 0.3 },
    "ruleType3": { "required": true }
  },
  "defaultRule": "ruleType1"
}
```

### Path Configuration

```jsonc
{
  "paths": {
    "database": ".opencode/database.sqlite",
    "templates": "templates/",
    "output": "./output"
  }
}
```

---

## 6. 🏷️ VALUE TYPES

### Strings

```jsonc
{
  "path": ".opencode/config.json",
  "model": "voyage-4",
  "style": "minimal"
}
```

### Numbers

```jsonc
{
  "count": 10,              // Integer
  "score": 50,              // Integer percentage
  "weight": 0.3,            // Float (0-1)
  "timeout": 30000          // Milliseconds
}
```

### Booleans

```jsonc
{
  "enabled": true,
  "verifyOnStartup": false
}
```

### Null

```jsonc
{
  "autoExpireDays": null,   // No expiration
  "limit": null             // No limit
}
```

### Arrays

```jsonc
{
  "validTypes": ["a", "b", "c"],
  "excludePatterns": ["*.tmp", "*.log"]
}
```

---

## 7. 📄 COMMENTS (JSONC ONLY)

### Inline Comments

```jsonc
{
  "scaleDays": 90,          // Half-life ~ 62 days
  "decayWeight": 0.3        // Relative importance
}
```

### Block Comments

```jsonc
{
  /*
   * Multi-line explanation
   * for complex settings
   */
  "complexSetting": { }
}
```

### Documentation Comments

```jsonc
// Behavior documented in separate file
// Actual implementation in importance-tiers.js
"importanceTiers": { }
```

---

## 8. 📌 VALIDATION RULES

### P0 - Required

```markdown
[ ] Valid JSON/JSONC syntax
[ ] No trailing commas (JSON)
[ ] All strings double-quoted
[ ] Proper nesting/brackets
```

### P1 - Should Have

```markdown
[ ] $schema reference (when available)
[ ] Section comments for organization
[ ] Inline comments for non-obvious values
```

### P2 - Recommended

```markdown
[ ] Logical key ordering
[ ] Consistent indentation (2 spaces)
[ ] Documentation for complex settings
```

---

## 9. 📐 SCHEMA REFERENCE

### Adding Schema

```jsonc
{
  "$schema": "https://json-schema.org/draft-07/schema",
  // ... rest of config
}
```

### VSCode Settings Schema

```jsonc
{
  "$schema": "vscode://schemas/settings/user"
}
```

---

## 10. 📌 FILE LOCATIONS

```
.opencode/
├── config/
│   └── opencode.json
└── skill/
    └── [skill-name]/
        └── config/
            ├── config.jsonc
            ├── filters.jsonc
            └── complexity-config.jsonc
```

---

## 11. ✅ QUALITY CHECKLIST

```markdown
P0 - Must Fix:
[ ] Valid JSON syntax
[ ] Proper string quoting
[ ] Correct bracket matching
[ ] No trailing commas

P1 - Should Have:
[ ] $schema reference
[ ] Section comments
[ ] camelCase keys
[ ] Inline documentation

P2 - Nice to Have:
[ ] Logical ordering
[ ] 2-space indent
[ ] Blank lines between sections
```

---

## 12. 🔗 RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Detailed style documentation
- [JSON Specification](https://www.json.org/)
