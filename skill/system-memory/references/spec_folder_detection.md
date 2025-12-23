# Spec Folder Detection - CLI-First Stateless Architecture

> Stateless spec folder routing via CLI arguments for context preservation.

**Core Principle:** Spec folder is passed explicitly as a CLI argument - no marker files, no state persistence between sessions.

---

## 1. 📖 OVERVIEW

The memory system uses a **stateless CLI-first architecture**. The spec folder path is passed directly to `generate-context.js` as an argument, eliminating the need for marker files.

### Architecture

| Aspect                  | Stateless (Current)         |
| ----------------------- | --------------------------- |
| **Spec folder source**  | CLI argument                |
| **State persistence**   | None                        |
| **Session isolation**   | Automatic (no shared state) |
| **Concurrent sessions** | No conflicts possible       |
| **Cleanup required**    | None                        |

### Key Benefits

- **Simplicity**: No marker file management
- **Reliability**: No stale state issues
- **Portability**: Works across environments
- **Transparency**: Explicit folder selection

---

## 2. 🔍 DETECTION LOGIC

### CLI-First Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPEC FOLDER DETECTION                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ STEP 1: CLI Argument Check    │
              │ Was spec folder passed?       │
              └───────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               [PROVIDED]          [NOT PROVIDED]
                    │                   │
                    ▼                   ▼
           ┌──────────────┐   ┌───────────────────────────┐
           │ Validate     │   │ STEP 2: User Prompt       │
           │ Path Exists  │   │ Ask for spec folder       │
           └──────────────┘   └───────────────────────────┘
                    │                   │
              [VALID]             [USER PROVIDES]
                    │                   │
                    └─────────┬─────────┘
                              ▼
               ┌───────────────────────────────┐
               │ STEP 3: Calculate             │
               │ Alignment Score               │
               └───────────────────────────────┘
                               │
                      ┌────────┴────────┐
                      │   Score ≥70%?   │
                      └────────┬────────┘
                         yes/  \no
                           /    \
                          ▼      ▼
             ┌──────────────┐  ┌────────────────┐
             │ PROCEED      │  │ Score ≥50%?    │
             │ (good align) │  └───────┬────────┘
             └──────────────┘     yes/  \no
                                   /    \
                                  ▼      ▼
                     ┌──────────────┐  ┌───────────────────┐
                     │ WARN USER    │  │ INTERACTIVE       │
                     │ (proceed)    │  │ PROMPT + OPTIONS  │
                     └──────────────┘  └───────────────────┘
```

### Detection Steps Summary

| Step | Action              | Mechanism                                     |
| ---- | ------------------- | --------------------------------------------- |
| 1    | Check CLI argument  | `generate-context.js data.json [spec-folder]` |
| 2    | Prompt if missing   | AI agent asks user for folder                 |
| 3    | Validate path       | Confirm `specs/###-name/` exists              |
| 4    | Calculate alignment | Score against conversation context            |
| 5    | Proceed or warn     | Low score triggers warning only               |

---

## 3. 💻 USAGE

### Command Format

```bash
# Explicit spec folder (recommended)
node generate-context.js data.json "006-opencode/014-stateless-alignment"

# With sub-folder
node generate-context.js data.json "122-skill-standardization/002-api-refactor"
```

### AI Agent Workflow

1. User says "save context" or `/memory:save`
2. AI agent determines spec folder from conversation context
3. AI agent calls script with explicit path:
   ```bash
   node generate-context.js /tmp/context.json "014-stateless-alignment"
   ```
4. Memory file written to `specs/014-stateless-alignment/memory/`

### Fallback Detection

When no spec folder is provided, the AI agent:

1. **Checks recent memory files** - `ls -t specs/*/memory/*.md | head -1`
2. **Asks user** - "Which spec folder should I save to?"
3. **Suggests highest-numbered** - `ls specs/ | grep "^[0-9]" | sort -rn | head -1`

---

## 4. 🎯 ALIGNMENT SCORING

When detecting the target folder, the system calculates an alignment score to validate the match quality.

### Score Components

| Component           | Weight | Description                     |
| ------------------- | ------ | ------------------------------- |
| **Topic Match**     | 40%    | Keyword overlap with spec topic |
| **File Context**    | 30%    | Referenced files in spec folder |
| **Phase Alignment** | 20%    | Current work phase matches spec |
| **Recency**         | 10%    | Recent activity in folder       |

### Threshold Behavior

| Score      | Action                                                     |
| ---------- | ---------------------------------------------------------- |
| **≥70%**   | Proceed automatically (good alignment)                     |
| **50-69%** | Log warning, proceed anyway (moderate alignment)           |
| **<50%**   | Interactive prompt with top 3 alternatives (low alignment) |

---

## 5. 📂 SUB-FOLDER ROUTING

### Sub-Folder Structure Example

```
specs/122-skill-standardization/
├── 001-api-integration/
│   └── memory/
│       └── 23-11-25_10-03__api-integration.md
├── 002-system-spec-kit/
│   └── memory/
│       └── 23-11-25_10-06__spec-kit.md
└── 003-spec-folder-versioning/  ← Pass this path via CLI
    └── memory/
        └── 23-11-25_15-30__versioning.md  ← Writes here
```

### Path Formats

| Format              | Example                                                      |
| ------------------- | ------------------------------------------------------------ |
| **Parent only**     | `122-skill-standardization`                                  |
| **With sub-folder** | `122-skill-standardization/003-spec-folder-versioning`       |
| **Full path**       | `specs/122-skill-standardization/003-spec-folder-versioning` |

### Routing Logic

| Step | Action             | Details                           |
| ---- | ------------------ | --------------------------------- |
| 1    | Parse CLI argument | Extract spec folder path          |
| 2    | Normalize path     | Remove `specs/` prefix if present |
| 3    | Validate exists    | `test -d specs/${path}`           |
| 4    | Determine target   | Full path including sub-folder    |
| 5    | Create memory dir  | `mkdir -p specs/${path}/memory/`  |
| 6    | Write context      | Save to memory folder             |

---

## 6. ⚠️ EDGE CASES

### No Spec Folder Provided

**Behavior:** AI agent prompts user for selection.

**Resolution:** User provides folder name or selects from list.

### Spec Folder Doesn't Exist

**Behavior:** Script fails with clear error message.

**Error Output:**
```
ERROR: Spec folder not found: specs/999-nonexistent/
Available folders:
  - 006-opencode
  - 007-anobel.com
  - 122-skill-standardization
```

**Resolution:** Create spec folder or correct the path.

### Alignment Score Below Threshold

**Behavior (three tiers):**
- **≥70%**: Proceed automatically with "Good alignment" message
- **50-69%**: Log "Moderate alignment - proceeding with caution" warning, proceed anyway
- **<50%**: Display interactive prompt with top 3 alternative folders

**Reasoning:** 
- High scores (≥70%) indicate confident match - no user intervention needed
- Moderate scores (50-69%) suggest possible mismatch - warn but trust user's explicit choice
- Low scores (<50%) require user confirmation - prevents accidental misrouting

### Sub-Folder Specified But Missing

**Behavior:** Create the sub-folder automatically.

**Example:**
```bash
# Folder 003-new-work doesn't exist yet
node generate-context.js data.json "122-feature/003-new-work"
# Creates: specs/122-feature/003-new-work/memory/
```

---

## 7. ✅ VALIDATION CHECKPOINTS

### Pre-Save Validation

| Check                     | Action on Failure                    |
| ------------------------- | ------------------------------------ |
| CLI argument provided     | Prompt user for folder               |
| Spec folder exists        | Error with available folders         |
| Memory directory writable | Error with permission details        |
| Alignment score ≥70%      | Proceed (good alignment)             |
| Alignment score 50-69%    | Log warning, proceed anyway          |
| Alignment score <50%      | Interactive prompt with alternatives |

### Post-Save Validation

| Check                     | Action on Failure      |
| ------------------------- | ---------------------- |
| File written successfully | Retry once, then error |
| File not empty            | Error with debug info  |
| ANCHOR format valid       | Warning in log         |

### Health Check Commands

```bash
# List all spec folders
ls -d specs/[0-9][0-9][0-9]-*/

# Find most recently modified memory file
ls -t specs/*/memory/*.md 2>/dev/null | head -1

# Count memories per spec folder
for d in specs/*/memory/; do
  echo "$(ls "$d" 2>/dev/null | wc -l) $d"
done | sort -rn

# Verify memory directory exists
test -d specs/###-name/memory/ && echo "OK" || echo "MISSING"
```

---

## 8. 🔄 MIGRATION FROM MARKER FILES

If migrating from a system that used `.spec-active` marker files:

### Cleanup Commands

```bash
# Remove legacy marker files (safe - they're no longer used)
rm -f .spec-active
rm -f .opencode/.spec-active.*
rm -f .opencode/.spec-actives.json

# Verify removal
find . -name ".spec-active*" -type f 2>/dev/null
```

### Behavior Changes

| Aspect                  | Old (Marker-Based)    | New (CLI-First) |
| ----------------------- | --------------------- | --------------- |
| **Folder tracking**     | Read from marker file | Pass via CLI    |
| **Session state**       | Persisted to disk     | None            |
| **Concurrent sessions** | Potential conflicts   | No conflicts    |
| **Stale state**         | Possible              | Impossible      |

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [alignment_scoring.md](./alignment_scoring.md) - Full scoring algorithm details
- [execution_methods.md](./execution_methods.md) - Save context workflows

### Related Skills
- `system-spec-kit` - Spec folder creation and template management
- `system-memory` - Main skill documentation

---

*Last Updated: 2025-12-22 | Architecture: Stateless CLI-First*
