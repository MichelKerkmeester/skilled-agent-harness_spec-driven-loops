# Output Format - File Naming & Document Structure

> Timestamp formats, file naming conventions, and output structure for context preservation.

**Core Principle:** Consistent naming enables reliable retrieval across sessions.

---

## 1. 📖 OVERVIEW

Save-context generates structured documentation files with consistent naming conventions and predictable output locations. This reference details the format specifications for all output files.

**Key Components:**
- **File Naming** - Timestamped, topic-based naming for chronological organization
- **Output Location** - Predictable paths within spec folder structure
- **Document Structure** - Anchored sections for targeted retrieval
- **Metadata** - JSON statistics for session tracking

---

## 2. 📄 FILE NAMING

### Primary Document

**Format**: `{date}_{time}__{topic}.md`

| Component | Format | Example |
|-----------|--------|---------|
| Date | DD-MM-YY | 07-12-25 |
| Time | HH-MM | 14-30 |
| Separator | `__` (double underscore) | __ |
| Topic | kebab-case from spec folder | oauth-implementation |

**Full Example**: `07-12-25_14-30__oauth-implementation.md`

### Metadata File

**Format**: `metadata.json`

Located alongside the primary document in the `memory/` folder.

### Naming Rules

1. **Date first** - Enables chronological sorting
2. **Double underscore** - Clear delimiter between timestamp and topic
3. **Kebab-case** - Consistent, URL-safe topic names
4. **No spaces** - Prevents path resolution issues

---

## 3. 📂 OUTPUT LOCATION

```
specs/###-feature-name/
└── memory/
    ├── 07-12-25_14-30__feature-name.md   # Primary document
    └── metadata.json                      # Session statistics
```

### Path Resolution

1. Check if in `/specs/###-*/` directory
2. Find most recent spec folder if not
3. Create `memory/` subdirectory if missing
4. Generate timestamped filename

### Multiple Sessions

When multiple saves occur in the same spec folder:

```
specs/049-oauth-implementation/
└── memory/
    ├── 07-12-25_09-15__oauth-implementation.md  # Morning session
    ├── 07-12-25_14-30__oauth-implementation.md  # Afternoon session
    ├── 08-12-25_10-00__oauth-implementation.md  # Next day
    └── metadata.json                             # Latest session stats
```

---

## 4. 📝 DOCUMENT STRUCTURE

### Primary Document Sections

```markdown
# Session Summary

## Overview
[Brief session description]

## Key Decisions
<!-- ANCHOR:decisions-{spec#} -->
[Decision documentation]
<!-- /ANCHOR:decisions-{spec#} -->

## Implementation Details
<!-- ANCHOR:implementation-{spec#} -->
[What was built]
<!-- /ANCHOR:implementation-{spec#} -->

## Conversation Flow
[Full dialogue with timestamps]

## Files Modified
[List of changed files]

## Session Metadata
[Statistics and timing]
```

### Anchor Tags

Each section includes HTML comment anchors for targeted retrieval:

```html
<!-- ANCHOR:category-keywords-spec# -->
Content here...
<!-- /ANCHOR:category-keywords-spec# -->
```

**Categories**: `implementation`, `decision`, `guide`, `architecture`, `files`, `discovery`, `integration`

### Section Requirements

| Section | Required | Purpose |
|---------|----------|---------|
| Overview | Yes | Quick context summary |
| Key Decisions | Yes | Searchable decision log |
| Implementation Details | Conditional | When code was written |
| Conversation Flow | Yes | Full dialogue preservation |
| Files Modified | Conditional | When files changed |
| Session Metadata | Yes | Statistics and timing |

---

## 5. 🗃️ METADATA

### JSON Structure

```json
{
  "timestamp": "2025-12-07T14:30:00Z",
  "specFolder": "049-oauth-implementation",
  "messageCount": 45,
  "decisionCount": 3,
  "diagramCount": 2,
  "duration": "2h 15m",
  "topics": ["oauth", "jwt", "authentication"]
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 | Save time in UTC |
| `specFolder` | string | Associated spec folder name |
| `messageCount` | number | Total conversation messages |
| `decisionCount` | number | Documented decisions |
| `diagramCount` | number | ASCII diagrams included |
| `duration` | string | Human-readable session length |
| `topics` | array | Extracted topic keywords |

---

## 6. ⏱️ TIMESTAMPS

### Format Reference

| Context | Format | Example |
|---------|--------|---------|
| Filename date | DD-MM-YY | 07-12-25 |
| Filename time | HH-MM | 14-30 |
| JSON timestamp | ISO 8601 | 2025-12-07T14:30:00Z |
| Conversation flow | HH:MM:SS | 14:30:45 |

### Timezone Handling

- **Filenames**: Local timezone (user's system)
- **JSON metadata**: Always UTC (ISO 8601 with Z suffix)
- **Conversation flow**: Local timezone with optional offset notation

---

## 7. ✅ VALIDATION

### File Naming Checklist

```
□ Date format: DD-MM-YY (not YYYY-MM-DD)
□ Time format: HH-MM (24-hour, no seconds)
□ Double underscore separator between time and topic
□ Topic in kebab-case (no spaces, no special characters)
□ Extension: .md
```

### Output Location Checklist

```
□ File placed in specs/###-name/memory/ directory
□ memory/ subdirectory created if missing
□ metadata.json updated or created alongside
□ No files in spec folder root (use memory/)
```

### Document Structure Checklist

```
□ All required sections present (Overview, Key Decisions, Conversation Flow, Metadata)
□ Anchor tags properly formatted with opening and closing comments
□ Category keywords match allowed list
□ Spec folder number included in anchor IDs
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid date format` | Wrong separator or order | Use DD-MM-YY with hyphens |
| `Topic contains spaces` | Space in filename | Convert to kebab-case |
| `Missing anchor closing` | Incomplete anchor tag | Add `<!-- /anchor: ... -->` |
| `metadata.json parse error` | Invalid JSON | Validate JSON syntax |

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [SKILL.md](../SKILL.md) - Main workflow-memory skill documentation

### Templates
- [context_template.md](../templates/context_template.md) - Context document template structure
