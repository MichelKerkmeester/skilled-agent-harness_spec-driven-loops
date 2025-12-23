# Execution Methods - Save Context Workflows

> Three independent execution paths for memory operations, plus anchor-based retrieval for token-efficient context recovery.

**Core Principle:** Execute memory operations through whichever method fits your workflow - slash commands for convenience, direct scripts for control, helper scripts for automation. All paths produce identical output.

---

## 1. 📖 OVERVIEW

The memory system supports **2 independent execution paths**. Any method can be used standalone without dependencies on the others.

### Method Comparison

| Method            | AI Agent Required | Best For                           | Effort | Token Cost |
| ----------------- | ----------------- | ---------------------------------- | ------ | ---------- |
| **Slash Command** | Yes               | Interactive saves, manual triggers | Low    | ~200       |
| **Direct Script** | No                | Testing, debugging, CI/CD          | Medium | 0          |
| ~~Helper Script~~ | ~~No~~            | ~~(deprecated - script removed)~~  | ~~-~~  | ~~-~~      |

### Execution Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    MEMORY SAVE PATHWAYS                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   Slash Command                    Direct Script               │
│   ┌──────────┐                    ┌──────────┐                 │
│   │ /memory: │                    │  node    │                 │
│   │  save    │                    │ script.js│                 │
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
│                    │      .js        │                         │
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
/memory:search     # Dashboard, search, manage index, view recent, cleanup, triggers
```

### Execution Flow

1. Slash command expands to full prompt
2. AI agent analyzes conversation history
3. AI agent creates structured JSON summary
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
node .opencode/skill/system-memory/scripts/generate-context.js \
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
| Script exists      | `test -f .opencode/skill/system-memory/scripts/generate-context.js` | Check skill installation |
| JSON valid         | `jq . < input.json`                                    | Fix JSON syntax          |
| Spec folder exists | `test -d specs/###/`                                   | Create spec folder       |

---

## 5. 🏷️ ANCHOR RETRIEVAL

### Token Efficiency Comparison

| Approach          | Tokens  | Savings | Use Case              |
| ----------------- | ------- | ------- | --------------------- |
| Full file read    | ~12,000 | -       | Need complete context |
| Anchor extraction | ~800    | 93%     | Targeted retrieval    |
| Summary only      | ~400    | 97%     | Quick overview        |

### Anchor Format

```markdown
<!-- ANCHOR:category-keywords-spec# -->
Content goes here...
<!-- /ANCHOR:category-keywords-spec# -->
```

**Categories:**
- `implementation` - Code patterns, solutions
- `decision` - Architecture choices, trade-offs
- `guide` - How-to instructions
- `architecture` - System design
- `files` - File modifications, locations
- `discovery` - Learnings, insights
- `integration` - External system connections

### Quick Commands

```bash
# Find anchors by keyword (UPPERCASE format)
grep -l "ANCHOR:.*decision.*auth" specs/*/memory/*.md

# List all anchors in a file
grep "<!-- ANCHOR:" specs/049-*/memory/*.md

# Extract specific section
sed -n '/<!-- ANCHOR:decision-jwt-049 -->/,/<!-- \/ANCHOR:decision-jwt-049 -->/p' file.md

# Count anchors per spec folder
for d in specs/*/memory/; do
  echo "$(grep -r 'ANCHOR:' "$d" 2>/dev/null | wc -l) $d"
done | sort -rn
```

---

## 7. 🔄 CONTEXT RECOVERY

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
         │  grep -r "anchor:.*keyword" specs/     │
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
# Search within current spec folder
grep -r "anchor:.*keyword" specs/###-current-spec/memory/*.md

# Cross-spec search if broader context needed
grep -r "anchor:.*keyword" specs/*/memory/*.md

# Extract specific anchor directly (UPPERCASE format)
sed -n '/<!-- ANCHOR:decision-auth-049 -->/,/<!-- \/ANCHOR:decision-auth-049 -->/p' file.md
```

### Response Templates

**When context found:**
> "Based on prior decision in memory file [filename], I see that [summary]. I'll build on this by..."

**When no context found:**
> "No prior context found for [task keywords] - proceeding with fresh implementation."

### Validation Checkpoints

| Checkpoint           | Verification                | Action on Failure          |
| -------------------- | --------------------------- | -------------------------- |
| Memory folder exists | `test -d specs/###/memory/` | No prior context available |
| Memory files present | `ls specs/###/memory/*.md`  | No saves yet for this spec |
| Anchors searchable   | `grep "anchor:" ...`        | Files may lack anchors     |

---

## 8. 🔍 TROUBLESHOOTING

### Common Issues

| Issue                   | Cause               | Solution                           |
| ----------------------- | ------------------- | ---------------------------------- |
| "Spec folder not found" | Invalid folder name | Check `ls specs/` for correct name |
| "Permission denied"     | File permissions    | `chmod -R u+rw specs/###/memory/`  |
| "JSON parse error"      | Malformed input     | Validate with `jq . < input.json`  |
| "No anchors found"      | Empty or new memory | Normal for new specs               |
| "Script not found"      | Wrong path          | Verify skill installation          |

### Debug Commands

```bash
# Verify memory system installation
ls -la .opencode/skill/system-memory/scripts/

# Check spec folder structure
tree specs/###-name/

# Validate JSON input
cat input.json | jq .

# Test script execution
node .opencode/skill/system-memory/scripts/generate-context.js --help
```

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [SKILL.md](../SKILL.md) - Main workflow-memory skill documentation
- [troubleshooting.md](./troubleshooting.md) - Troubleshooting guide for memory operations
