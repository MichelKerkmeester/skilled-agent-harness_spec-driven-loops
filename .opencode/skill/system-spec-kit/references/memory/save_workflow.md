---
title: Memory Save Workflow
description: Complete guide to saving conversation context including execution methods, output format, and retrieval.
---

# Memory Save Workflow - Context Preservation Methods

Complete guide to saving conversation context, execution methods, and retrieval.

---

## 1. 📖 OVERVIEW

### Core Principle

Execute memory operations through whichever method fits your workflow - slash commands for convenience, direct scripts for control. All paths produce identical output with consistent naming for reliable retrieval and index into the same 5-source memory system (schema v13).

### Execution Paths

The memory system supports **2 independent execution paths**. Any method can be used standalone.

### Method Comparison

| Method            | AI Agent Required | Best For                           | Effort | Token Cost |
| ----------------- | ----------------- | ---------------------------------- | ------ | ---------- |
| **Slash Command** | Yes               | Interactive saves, manual triggers | Low    | ~200       |
| **Direct Script** | No                | Testing, debugging, CI/CD          | Medium | 0          |

### Execution Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    MEMORY SAVE PATHWAYS                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   Slash Command                    Direct Script               │
│   ┌──────────┐                    ┌──────────┐                 │
│   │ /memory: │                    │  node    │                 │
│   │  save    │                    │ script.ts│                 │
│   └────┬─────┘                    └────┬─────┘                 │
│        │                               │                       │
│        ▼                               ▼                       │
│   ┌──────────┐                    ┌──────────┐                 │
│   │ AI Agent │                    │   JSON   │                 │
│   │ Analysis │                    │   Input  │                 │
│   └────┬─────┘                    └────┬─────┘                 │
│        │                               │                       │
│        └───────────────────────────────┘                       │
│                              │                                 │
│                              ▼                                 │
│                    ┌─────────────────┐                         │
│                    │ generate-context│                         │
│                    │      .ts        │                         │
│                    └────────┬────────┘                         │
│                             │                                  │
│                             ▼                                  │
│                    ┌─────────────────┐                         │
│                    │ specs/###/      │                         │
│                    │ memory/*.md     │                         │
│                    └─────────────────┘                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. 🎯 METHOD SELECTION

### Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│              WHICH METHOD SHOULD I USE?                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ Is an AI agent active in      │
              │ the current conversation?     │
              └───────────────┬───────────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
              YES                           NO
               │                             │
               ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│ Need automatic          │   │ Prepare JSON, then use  │
│ conversation analysis?  │   │ Direct Script method    │
└────────────┬────────────┘   └─────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
     YES           NO
      │             │
      ▼             ▼
┌───────────┐ ┌───────────┐
│   SLASH   │ │  DIRECT   │
│  COMMAND  │ │  SCRIPT   │
│           │ │ (custom   │
│ /memory:  │ │  JSON)    │
│   save    │ │           │
└───────────┘ └───────────┘
```

### Quick Selection Guide

| Scenario                                  | Recommended Method |
| ----------------------------------------- | ------------------ |
| End of work session, want AI to summarize | **Slash Command**  |
| CI/CD pipeline, automated saves           | **Direct Script**  |
| Quick manual save, no AI available        | **Direct Script**  |
| Testing memory system functionality       | **Direct Script**  |
| Batch processing multiple saves           | **Direct Script**  |
| Interactive session with full context     | **Slash Command**  |

---

## 3. 💻 SLASH COMMANDS

**When to Use:** Manual save with AI-powered conversation analysis
**Requirement:** Slash command files exist in `.opencode/command/memory/`

### Available Commands

```
/memory:save       # Save current conversation context
/memory:context    # Dashboard, search, manage index, view recent, cleanup, triggers
```

### Execution Flow

1. Slash command expands to full prompt
2. AI agent analyzes conversation history
3. AI agent creates structured JSON summary (any agent can invoke generate-context.js for memory — this is an exception to the @speckit exclusivity rule)
4. AI agent calls `generate-context.js` with JSON data
5. Context saved to active spec folder's `memory/` directory

### Validation Checkpoints

| Checkpoint       | Verification                   | Action on Failure         |
| ---------------- | ------------------------------ | ------------------------- |
| Command exists   | `ls .opencode/command/memory/` | Create command file       |
| AI agent active  | Check response capability      | Use Direct Script instead |
| Spec folder arg  | Passed via CLI argument        | Specify folder manually   |
| Write permission | `test -w specs/###/memory/`    | Check folder permissions  |

### Example Output

```
✓ Context analyzed (12 exchanges detected)
✓ Spec folder: 049-anchor-context-retrieval
✓ Memory file: 28_11_25_14-30__context-save.md
✓ 3 anchors generated
✓ Summary: 847 tokens
```

---

## 4. 📜 DIRECT SCRIPT

**When to Use:** Testing, debugging, custom workflows, CI/CD pipelines
**Requirement:** Node.js installed

### Usage Pattern

```bash
# Create minimal JSON data file
cat > /tmp/test-save-context.json << 'EOF'
{
  "SPEC_FOLDER": "049-anchor-context-retrieval",
  "recent_context": [{
    "request": "Test save-context execution",
    "completed": "Verified system works standalone",
    "learning": "Direct script execution requires minimal JSON",
    "duration": "5m",
    "date": "2025-11-28T18:30:00Z"
  }],
  "observations": [{
    "type": "discovery",
    "title": "Standalone execution test",
    "narrative": "Testing direct script invocation",
    "timestamp": "2025-11-28T18:30:00Z",
    "files": [],
    "facts": ["Standalone execution works", "Minimal data sufficient"]
  }],
  "user_prompts": [{
    "prompt": "Test save-context standalone",
    "timestamp": "2025-11-28T18:30:00Z"
  }]
}
EOF

# Execute script directly
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  /tmp/test-save-context.json \
  "049-anchor-context-retrieval"
```

### Required JSON Fields

| Field            | Type   | Required | Description               |
| ---------------- | ------ | -------- | ------------------------- |
| `SPEC_FOLDER`    | string | Yes      | Target spec folder name   |
| `recent_context` | array  | Yes      | Array of context objects  |
| `observations`   | array  | No       | Discoveries and learnings |
| `user_prompts`   | array  | No       | Original user requests    |

### Validation Checkpoints

| Checkpoint         | Verification                                           | Action on Failure        |
| ------------------ | ------------------------------------------------------ | ------------------------ |
| Node.js installed  | `node --version`                                       | Install Node.js          |
| Script exists      | `test -f .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Check skill installation |
| JSON valid         | `jq . < input.json`                                    | Fix JSON syntax          |
| Spec folder exists | `test -d specs/###/`                                   | Create spec folder       |

---

## 5. 📄 OUTPUT FORMAT

### File Naming

**Primary Document Format**: `{date}_{time}__{topic}.md`

| Component | Format | Example |
|-----------|--------|---------|
| Date | DD-MM-YY | 07-12-25 |
| Time | HH-MM | 14-30 |
| Separator | `__` (double underscore) | __ |
| Topic | kebab-case from spec folder | oauth-implementation |

**Full Example**: `07-12-25_14-30__oauth-implementation.md`

**Metadata File**: `metadata.json` (alongside primary document)

### Naming Rules

1. **Date first** - Enables chronological sorting
2. **Double underscore** - Clear delimiter between timestamp and topic
3. **Kebab-case** - Consistent, URL-safe topic names
4. **No spaces** - Prevents path resolution issues

### Output Location

```
specs/###-feature-name/
└── memory/
    ├── 07-12-25_14-30__feature-name.md   # Primary document
    └── metadata.json                      # Session statistics
```

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

## 6. 📝 DOCUMENT STRUCTURE

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

Each section includes HTML comment anchors for targeted retrieval (implemented in v1.7.2):

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

### All Indexed Content Sources (5)

This workflow writes memory files in `specs/*/memory/` (source 1). During `memory_index_scan()`, the memory system indexes all 5 sources:

| Content Type | Location | Weight | Indexed By |
|-------------|----------|--------|------------|
| Memory files | `specs/*/memory/*.{md,txt}` | 0.5 | `findMemoryFiles()` |
| Constitutional rules | `.opencode/skill/*/constitutional/*.md` | 1.0 | `findConstitutionalFiles()` |
| Skill READMEs | `.opencode/skill/**/README.{md,txt}` | 0.3 | `findSkillReadmes()` |
| Project READMEs | Root `README.md` + key directory `README.{md,txt}` files | 0.4 | `findProjectReadmes()` |
| Spec documents | `.opencode/specs/**/*.md` | Per-type multiplier | `findSpecDocuments()` |

README types are controlled by the `includeReadmes` parameter in `memory_index_scan()`. Spec documents are controlled by the `includeSpecDocs` parameter (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable. Spec documents use 11 document types with scoring multipliers (e.g., spec: 1.4x, plan: 1.3x, constitutional: 2.0x) and schema v13 fields (`document_type`, `spec_level`).

For retrieval, `memory_context()` routes queries across 7 intents (including `find_spec` and `find_decision`) and applies intent-aware weighting.

> **Tip:** Add `<!-- ANCHOR:name -->` tags to README files to enable section-level memory retrieval.

---

## 7. 🗃️ METADATA

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

### Timestamp Formats

| Context | Format | Example |
|---------|--------|---------|
| Filename date | DD-MM-YY | 07-12-25 |
| Filename time | HH-MM | 14-30 |
| JSON timestamp | ISO 8601 | 2025-12-07T14:30:00Z |
| Conversation flow | HH:MM:SS | 14:30:45 |

**Timezone Handling:**
- **Filenames**: Local timezone (user's system)
- **JSON metadata**: Always UTC (ISO 8601 with Z suffix)
- **Conversation flow**: Local timezone with optional offset notation

---

## 8. 🏷️ ANCHOR RETRIEVAL

### Token Efficiency Comparison

| Approach          | Tokens  | Savings | Use Case              | Status           |
| ----------------- | ------- | ------- | --------------------- | ---------------- |
| Full file read    | ~12,000 | -       | Need complete context | Implemented      |
| Anchor extraction | ~800    | ~58-90% | Targeted retrieval    | **Implemented**  |
| Summary only      | ~400    | ~97%    | Quick overview        | Not implemented  |

> **Implemented (v1.7.2):** ANCHOR tags are now indexed and support section-level retrieval. Use the `anchors` parameter in `memory_search()` to retrieve specific sections. Token savings of 58-90% depending on content structure.

### Quick Commands

```bash
# Find anchors by keyword (UPPERCASE format)
grep -l "ANCHOR:.*decision.*auth" specs/*/memory/*.{md,txt}

# List all anchors in a file
grep "<!-- ANCHOR:" specs/049-*/memory/*.{md,txt}

# Extract specific section
sed -n '/<!-- ANCHOR:decision-jwt-049 -->/,/<!-- \/ANCHOR:decision-jwt-049 -->/p' file.md

# Count anchors per spec folder
for d in specs/*/memory/; do
  echo "$(grep -r 'ANCHOR:' "$d" 2>/dev/null | wc -l) $d"
done | sort -rn
```

---

## 9. 🔄 CONTEXT RECOVERY

**CRITICAL:** Before implementing ANY changes in a spec folder with memory files, you MUST search for relevant anchors.

### Recovery Protocol

```
┌─────────────────────────────────────────────────────────────────┐
│               CONTEXT RECOVERY PROTOCOL                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │  STEP 1: Extract Keywords              │
         │  Identify 2-4 key terms from task      │
         └───────────────────┬────────────────────┘
                             │
                             ▼
         ┌────────────────────────────────────────┐
         │  STEP 2: Search Anchors                │
         │  grep -r "ANCHOR:.*keyword" specs/     │
         └───────────────────┬────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
          MATCHES                       NO MATCHES
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│  STEP 3a: Load Context  │   │  STEP 3b: Acknowledge   │
│  Extract relevant       │   │  "No prior context      │
│  sections via script    │   │   found for [keywords]" │
└────────────┬────────────┘   └────────────┬────────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
                            ▼
         ┌────────────────────────────────────────┐
         │  STEP 4: Proceed with Implementation   │
         │  Reference loaded context as needed    │
         └────────────────────────────────────────┘
```

### Search Commands

```bash
# Search within current spec folder (UPPERCASE format)
grep -r "ANCHOR:.*keyword" specs/###-current-spec/memory/*.{md,txt}

# Cross-spec search if broader context needed
grep -r "ANCHOR:.*keyword" specs/*/memory/*.{md,txt}

# Extract specific anchor directly (UPPERCASE format)
sed -n '/<!-- ANCHOR:decision-auth-049 -->/,/<!-- \/ANCHOR:decision-auth-049 -->/p' file.md
```

### Response Templates

**When context found:**
> "Based on prior decision in memory file [filename], I see that [summary]. I'll build on this by..."

**When no context found:**
> "No prior context found for [task keywords] - proceeding with fresh implementation."

---

## 10. ✅ VALIDATION CHECKLISTS

### File Naming

```
□ Date format: DD-MM-YY (not YYYY-MM-DD)
□ Time format: HH-MM (24-hour, no seconds)
□ Double underscore separator between time and topic
□ Topic in kebab-case (no spaces, no special characters)
□ Extension: .md
```

### Output Location

```
□ File placed in specs/###-name/memory/ directory
□ memory/ subdirectory created if missing
□ metadata.json updated or created alongside
□ No files in spec folder root (use memory/)
```

### Document Structure

```
□ All required sections present (Overview, Key Decisions, Conversation Flow, Metadata)
□ Anchor tags properly formatted with opening and closing comments
□ Category keywords match allowed list
□ Spec folder number included in anchor IDs
```

---

## 11. 🔍 TROUBLESHOOTING

### Common Issues

| Issue                   | Cause               | Solution                           |
| ----------------------- | ------------------- | ---------------------------------- |
| "Spec folder not found" | Invalid folder name | Check `ls specs/` for correct name |
| "Permission denied"     | File permissions    | `chmod -R u+rw specs/###/memory/`  |
| "JSON parse error"      | Malformed input     | Validate with `jq . < input.json`  |
| "No anchors found"      | Empty or new memory | Normal for new specs               |
| "Script not found"      | Wrong path          | Verify skill installation          |
| `Invalid date format`   | Wrong separator/order | Use DD-MM-YY with hyphens        |
| `Topic contains spaces` | Space in filename   | Convert to kebab-case              |
| `Missing anchor closing`| Incomplete anchor   | Add `<!-- /ANCHOR:... -->`         |
| `metadata.json parse error` | Invalid JSON    | Validate JSON syntax               |

### Debug Commands

```bash
# Verify memory system installation
ls -la .opencode/skill/system-spec-kit/scripts/

# Check spec folder structure
tree specs/###-name/

# Validate JSON input
cat input.json | jq .

# Test script execution
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
```

---

## 12. 🔗 RELATED RESOURCES

### Reference Files
- [SKILL.md](../../SKILL.md) - Main workflow-memory skill documentation
- [troubleshooting.md](../debugging/troubleshooting.md) - Troubleshooting guide for memory operations

### Templates
- [context_template.md](../../templates/context_template.md) - Context document template structure
