# Alignment Scoring - Spec Folder Matching Algorithm

> How save-context determines the best spec folder match for conversation context.

---

## 1. 📖 OVERVIEW

When saving context, the system calculates an **alignment score** (0-100%) to determine which spec folder best matches the conversation topic.

**Core Principle:** Match conversations to spec folders with 70% threshold confidence.

**Threshold**: 70% minimum for auto-selection (prompts user if below)

---

## 2. 📊 SCORING COMPONENTS

| Component | Weight | Description |
|-----------|--------|-------------|
| Topic Match | 40% | Keywords from conversation match spec folder name |
| File Context | 30% | Files discussed exist in spec folder |
| Phase Alignment | 20% | Conversation phase matches spec workflow |
| Recency | 10% | More recent folders score higher |

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

## 3. 🎯 SCORE INTERPRETATION

| Score Range | Meaning | Action |
|-------------|---------|--------|
| **≥70%** | Good alignment | Auto-proceed (no user action) |
| **50-69%** | Moderate alignment | Proceed with caution warning |
| **<50%** | Low alignment | Interactive prompt + top 3 alternatives |

### Threshold Configuration

These thresholds are defined in `generate-context.js`:

```javascript
const ALIGNMENT_CONFIG = {
  THRESHOLD: 70,           // Good alignment - proceed automatically
  WARNING_THRESHOLD: 50,   // Below this = interactive prompt with alternatives
};
```

### Example Scoring Walkthrough

**Scenario**: Conversation about "fix tab menu border styling"

```
Spec Folder: 006-code-refinement/002-tab-menu-border-fix/

Component Breakdown:
├─ Topic Match:    "tab menu border" ↔ "tab-menu-border-fix" = 95%
├─ File Context:   tab_menu.js discussed, exists in scope    = 80%
├─ Phase Alignment: debugging activity ↔ implementation      = 70%
└─ Recency:        modified 2 days ago                       = 85%

Weighted Calculation:
  (0.95 × 0.40) + (0.80 × 0.30) + (0.70 × 0.20) + (0.85 × 0.10)
= 0.38 + 0.24 + 0.14 + 0.085
= 0.845 → 84.5%

Result: Good match → Auto-selected
```

---

## 4. 🔍 KEYWORD EXTRACTION

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

## 5. 💬 INTERACTIVE PROMPT

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

## 6. ⚙️ BYPASS OPTIONS

### Environment Variable

```bash
# Skip alignment prompts, use most recent folder
AUTO_SAVE_MODE=true node .opencode/skill/system-memory/scripts/generate-context.js data.json
```

### Explicit Folder Argument

```bash
# Bypass scoring, use specified folder
node .opencode/skill/system-memory/scripts/generate-context.js data.json "122-specific-folder"
```

### Session Preferences

Users can set preferences that persist within a session:

| Phrase | Effect |
|--------|--------|
| `"auto-select"` | Skip prompts, use highest-scoring folder |
| `"always ask"` | Prompt even for high-confidence matches |
| `"new folder"` | Always create new spec folder |

---

## 8. 📝 USAGE EXAMPLES

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

### Quick Reference: Alignment Tier Actions

| Score | Tier | User Experience |
|-------|------|-----------------|
| **≥70%** | Good | Silent auto-proceed |
| **50-69%** | Moderate | Warning message, auto-proceed |
| **<50%** | Low | Interactive prompt with alternatives |

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [spec_folder_detection.md](./spec_folder_detection.md) - Routing logic and detection system versions

### Related Skills
- `system-spec-kit` - Spec folder creation and template management
- `system-memory` - Main skill documentation and context preservation workflows
