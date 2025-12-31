---
title: Folder Routing & Alignment
description: Stateless spec folder routing with alignment scoring for context preservation.
---

# Folder Routing & Alignment

Stateless spec folder routing with alignment scoring for context preservation.

---

## 1. 📖 OVERVIEW

The memory system uses a **stateless CLI-first architecture**. The spec folder path is passed directly to `generate-context.js` as an argument, then validated with alignment scoring.

### Core Principle

Spec folder is passed explicitly as a CLI argument with alignment validation to ensure accurate routing.

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
- **Accuracy**: Alignment scoring prevents misrouting

---

## 2. 🔍 DETECTION LOGIC

### Complete Routing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPEC FOLDER ROUTING                          │
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

## 3. 📊 ALIGNMENT SCORING

When saving context, the system calculates an **alignment score** (0-100%) to determine which spec folder best matches the conversation topic.

### Score Components

| Component           | Weight | Description                     |
| ------------------- | ------ | ------------------------------- |
| **Topic Match**     | 40%    | Keyword overlap with spec topic |
| **File Context**    | 30%    | Referenced files in spec folder |
| **Phase Alignment** | 20%    | Current work phase matches spec |
| **Recency**         | 10%    | Recent activity in folder       |

### Calculation Formula

```python
def calculate_alignment_score(conversation, spec_folder):
    topic_score = match_keywords(conversation.topics, spec_folder.name) * 0.40
    file_score = match_files(conversation.files, spec_folder.files) * 0.30
    phase_score = match_phase(conversation.phase, spec_folder.workflow) * 0.20
    recency_score = calculate_recency(spec_folder.modified_date) * 0.10

    return (topic_score + file_score + phase_score + recency_score) * 100
```

### Component Details

**Topic Match (40%)**
- Extracts keywords from conversation
- Compares against spec folder name segments
- Uses fuzzy matching for partial matches

**File Context (30%)**
- Tracks files mentioned or modified in conversation
- Checks if files exist within spec folder's scope
- Higher weight for recently modified files

**Phase Alignment (20%)**
- Maps conversation activities to workflow phases
- Planning → spec.md, plan.md
- Implementation → code files, tasks.md
- Verification → checklist.md, testing

**Recency (10%)**
- Exponential decay based on last modification
- 7-day half-life
- Prevents stale folders from scoring high

---

## 4. 🎯 THRESHOLD BEHAVIOR

| Score      | Tier     | Action                                           |
| ---------- | -------- | ------------------------------------------------ |
| **≥70%**   | Good     | Proceed automatically (no user action)           |
| **50-69%** | Moderate | Proceed with caution warning                     |
| **<50%**   | Low      | Interactive prompt + top 3 alternatives          |

### Threshold Configuration

These thresholds are defined in `generate-context.js`:

```javascript
const ALIGNMENT_CONFIG = {
  THRESHOLD: 70,           // Good alignment - proceed automatically
  WARNING_THRESHOLD: 50,   // Below this = interactive prompt with alternatives
};
```

---

## 5. 🔍 KEYWORD EXTRACTION

Keywords are extracted from:

1. **Conversation request** - Initial user ask
2. **Observation titles** - Event summaries
3. **File names** - Modified files
4. **Technical terms** - Domain-specific language

### Extraction Process

```
Input: "Fix the tab menu border not showing on hover state"

Step 1: Tokenize
  ["Fix", "the", "tab", "menu", "border", "not", "showing", "on", "hover", "state"]

Step 2: Remove stop words
  ["Fix", "tab", "menu", "border", "showing", "hover", "state"]

Step 3: Normalize
  ["fix", "tab", "menu", "border", "showing", "hover", "state"]

Step 4: Extract meaningful terms
  ["tab", "menu", "border", "hover", "state"]

Output: Primary keywords for matching
```

### Stop Words (excluded)

```
the, a, an, is, are, was, were, be, been, being,
have, has, had, do, does, did, will, would, could,
should, may, might, must, shall, can, need, dare,
ought, used, to, of, in, for, on, with, at, by,
from, as, into, through, during, before, after,
above, below, between, under, again, further, then,
once, here, there, when, where, why, how, all, each,
few, more, most, other, some, such, no, nor, not,
only, own, same, so, than, too, very, just, also
```

---

## 6. 💻 USAGE

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

## 7. 📂 SUB-FOLDER ROUTING

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

## 8. 💬 INTERACTIVE PROMPT

When alignment **< 50%**, user sees an interactive prompt:

```
⚠️  LOW ALIGNMENT WARNING
    Selected folder: 020-page-loader
    Alignment score: 25%

📋 Top 3 alternative folders:
    1. 018-auth-improvements (85%)
    2. 017-authentication-refactor (82%)
    3. 019-login-flow (78%)

Choose: [1-3] select alternative | [c] continue anyway | [n] cancel
```

**Note:** When alignment is **50-69%** (moderate), the script shows a warning but proceeds automatically without prompting.

### Archive Filtering

Folders matching these patterns are automatically excluded:

- `z_*` (archive prefix)
- `*archive*` (contains "archive")
- `old*` (deprecated prefix)

---

## 9. ⚙️ BYPASS OPTIONS

### Environment Variable

```bash
# Skip alignment prompts, use most recent folder
AUTO_SAVE_MODE=true node .opencode/skill/system-spec-kit/scripts/generate-context.js data.json
```

### Explicit Folder Argument

```bash
# Bypass scoring, use specified folder
node .opencode/skill/system-spec-kit/scripts/generate-context.js data.json "122-specific-folder"
```

### Session Preferences

Users can set preferences that persist within a session:

| Phrase         | Effect                                   |
| -------------- | ---------------------------------------- |
| `"auto-select"`| Skip prompts, use highest-scoring folder |
| `"always ask"` | Prompt even for high-confidence matches  |
| `"new folder"` | Always create new spec folder            |

---

## 10. 📝 USAGE EXAMPLES

Three practical examples demonstrating each alignment tier and the expected behavior.

### Example 1: Good Alignment (≥70%) - Auto-Proceed

**Scenario:** Conversation about fixing memory alignment validation

```
Conversation Topic: "Fix memory alignment validation and add three-tier scoring"
Target Folder:      specs/005-memory/016-memory-alignment-fix/
```

**Keyword Analysis:**

```
Conversation keywords: ["memory", "alignment", "validation", "three-tier", "scoring"]
Folder keywords:       ["memory", "alignment", "fix"]
Overlap:               3/5 keywords match → HIGH
```

**Score Breakdown:**

```
Component Breakdown:
├─ Topic Match:    "memory alignment" ↔ "memory-alignment-fix" = 92%
├─ File Context:   generate-context.js discussed, in scope     = 88%
├─ Phase Alignment: implementation activity ↔ implementation   = 85%
└─ Recency:        modified today                              = 95%

Weighted Calculation:
  (0.92 × 0.40) + (0.88 × 0.30) + (0.85 × 0.20) + (0.95 × 0.10)
= 0.368 + 0.264 + 0.170 + 0.095
= 0.897 → 89.7%
```

**Console Output:**

```
📊 Alignment check: 89.7% (GOOD)
✅ Proceeding with folder: specs/005-memory/016-memory-alignment-fix/
```

**Result:** Auto-proceed without user intervention.

---

### Example 2: Moderate Alignment (50-69%) - Warning + Proceed

**Scenario:** Conversation about semantic search improvements saved to memory alignment folder

```
Conversation Topic: "Improve semantic memory search with better vector indexing"
Target Folder:      specs/005-memory/016-memory-alignment-fix/
```

**Keyword Analysis:**

```
Conversation keywords: ["semantic", "memory", "search", "vector", "indexing"]
Folder keywords:       ["memory", "alignment", "fix"]
Overlap:               1/5 keywords match ("memory") → PARTIAL
```

**Score Breakdown:**

```
Component Breakdown:
├─ Topic Match:    "memory" partial match only               = 45%
├─ File Context:   different memory files, partial overlap   = 55%
├─ Phase Alignment: research activity ↔ implementation       = 50%
└─ Recency:        modified 3 days ago                       = 75%

Weighted Calculation:
  (0.45 × 0.40) + (0.55 × 0.30) + (0.50 × 0.20) + (0.75 × 0.10)
= 0.180 + 0.165 + 0.100 + 0.075
= 0.520 → 52.0%
```

**Console Output:**

```
📊 Alignment check: 52.0% (MODERATE)
⚠️  MODERATE ALIGNMENT - proceeding with caution
    Selected folder: specs/005-memory/016-memory-alignment-fix/
    Consider: Is this the right folder for "semantic search" work?
✅ Proceeding with folder: specs/005-memory/016-memory-alignment-fix/
```

**Result:** Warning displayed but proceeds automatically. User can review if the folder choice seems wrong.

---

### Example 3: Low Alignment (<50%) - Interactive Prompt

**Scenario:** Conversation about CSS styling saved to unrelated memory folder

```
Conversation Topic: "Add CSS hover animation to download buttons"
Target Folder:      specs/005-memory/016-memory-alignment-fix/
```

**Keyword Analysis:**

```
Conversation keywords: ["CSS", "hover", "animation", "download", "buttons"]
Folder keywords:       ["memory", "alignment", "fix"]
Overlap:               0/5 keywords match → NONE
```

**Score Breakdown:**

```
Component Breakdown:
├─ Topic Match:    no keyword overlap                        = 12%
├─ File Context:   CSS files not in memory spec scope        = 8%
├─ Phase Alignment: implementation ↔ implementation (only)   = 70%
└─ Recency:        modified 5 days ago                       = 60%

Weighted Calculation:
  (0.12 × 0.40) + (0.08 × 0.30) + (0.70 × 0.20) + (0.60 × 0.10)
= 0.048 + 0.024 + 0.140 + 0.060
= 0.272 → 27.2%
```

**Console Output:**

```
📊 Alignment check: 27.2% (LOW)

⚠️  LOW ALIGNMENT WARNING
    Selected folder: specs/005-memory/016-memory-alignment-fix/
    Alignment score: 27%

📋 Top 3 alternative folders:
    1. specs/007-anobel.com/003-btn-download-alignment/ (78%)
    2. specs/007-anobel.com/006-video-play-pause-hover/ (65%)
    3. specs/001-css-components/005-button-animations/  (62%)

Choose: [1-3] select alternative | [c] continue anyway | [n] cancel
> _
```

**Result:** Interactive prompt requires user decision. Top 3 alternatives are suggested based on better keyword matches.

---

## 11. ⚠️ EDGE CASES

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

## 12. ✅ VALIDATION CHECKPOINTS

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

## 13. 🔄 MIGRATION FROM MARKER FILES

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

## 14. 🔗 RELATED RESOURCES

### Reference Files
- [execution_methods.md](./execution_methods.md) - Save context workflows
- [memory_system.md](./memory_system.md) - MCP tool reference

### Related Skills
- `system-spec-kit` - Spec folder creation and template management
- `system-spec-kit` - Main skill documentation

---

*Last Updated: 2025-12-25 | Architecture: Stateless CLI-First with Alignment Scoring*
