---
description: Capture explicit learning from session - patterns, mistakes, insights, optimizations, constraints. Also provides correction, undo, and history subcommands.
argument-hint: "[learning-description] | correct <id> <type> [replacement-id] | undo <id> | history"
allowed-tools: Read, Bash, spec_kit_memory_memory_save, spec_kit_memory_memory_search, spec_kit_memory_memory_update, spec_kit_memory_memory_list, spec_kit_memory_memory_delete
---

# /memory:learn

Capture explicit learnings as high-importance semantic memories (85% confidence, auto-boosted).

---

## 1. 🚨 ARGUMENT VALIDATION

**CRITICAL: For subcommands with `<required>` arguments, you MUST have explicit values.**

### 4 Critical Rules

1. **NEVER assume or infer** `<id>`, `<type>`, or `<replacement-id>` values
2. **NEVER proceed** without explicit user-provided values for required arguments
3. **ALWAYS ask** if a required argument is missing from $ARGUMENTS
4. **STOP and request** missing values before any workflow execution

```
ARGUMENT VALIDATION:
├─ IF $ARGUMENTS contains "correct":
│   ├─ REQUIRE: <id> (memory ID to correct)
│   ├─ REQUIRE: <type> (superseded|deprecated|refined|merged)
│   ├─ OPTIONAL: [replacement-id]
│   └─ IF missing required → ASK user, do not proceed
│
├─ IF $ARGUMENTS contains "undo":
│   ├─ REQUIRE: <id> (memory ID to undo)
│   └─ IF missing required → ASK user, do not proceed
│
└─ OTHERWISE: Proceed to subcommand routing
```

--- calc(var(--number) * 1%) Set "-1" for no max width

## 2. 🔀 SUBCOMMAND ROUTING

**After validating required arguments, route based on $ARGUMENTS:**

```
$ARGUMENTS
    ├─ "correct <id> <type> [rid]" → Section 10: CORRECTION WORKFLOW
    ├─ "undo <id>"                 → Section 11: UNDO WORKFLOW
    ├─ "history"                   → Section 12: HISTORY VIEW
    └─ Any other text or empty     → DEFAULT LEARNING CAPTURE (Phase 1 below)
```

---

## 3. 📝 CONTRACT

```yaml
role: Learning Capture Specialist
purpose: Transform session insights into searchable, high-value semantic memories
action: Classify learning, link to source, save with importance boost
```

**Inputs:** `$ARGUMENTS` — Optional learning description
**Outputs:** `STATUS=<OK|FAIL> LEARNING_TYPE=<type> FOLDER=<spec-folder>`

**Key Difference from `/memory:save`:**
- `/memory:save` = Full session context (episodic memory)
- `/memory:learn` = Distilled lesson (semantic memory with auto-boost)

---

## 4. 📋 LEARNING TYPES

| Type           | When to Use                        | Importance Tier | Confidence | Examples                                               |
| -------------- | ---------------------------------- | --------------- | ---------- | ------------------------------------------------------ |
| `pattern`      | Reusable approach discovered       | **critical**    | 85%        | "Always debounce input handlers in Webflow"            |
| `mistake`      | Error made or anti-pattern hit     | **critical**    | 85%        | "Never use sync localStorage in async flow"            |
| `insight`      | Understanding gained               | **important**   | 85%        | "FSRS retrievability drops exponentially after 7 days" |
| `optimization` | Performance improvement identified | **important**   | 85%        | "Batch DOM updates to reduce reflows by 60%"           |
| `constraint`   | Hard limit or requirement found    | **critical**    | 85%        | "Webflow custom code must be under 10KB per page"      |

**Note:** `pitfall` renamed to `mistake` for clarity (spec 082 alignment).

**Importance Auto-Boost:**
- `pattern`, `mistake`, `constraint` → `critical` tier (always surfaces in search)
- `insight`, `optimization` → `important` tier (high priority)

**Confidence:** All explicit learnings via `/memory:learn` receive 85% (auto-set). If classification confidence < 80% → ASK user to select type from menu.

---

## 5. 📊 CORE WORKFLOW (Phases 1-4)

### Phase 1: Learning Extraction

```
├─ IF $ARGUMENTS contains learning description:
│   ├─ Store as: raw_learning → PROCEED TO PHASE 2
│
└─ IF $ARGUMENTS is empty:
    ├─ HARD BLOCK - Cannot infer from conversation
    ├─ ASK: "What did you learn? Describe the lesson, pattern, or insight."
    └─ WAIT for explicit response → Store as raw_learning → PROCEED
```

### Phase 2: Learning Type Classification

```
├─ Analyze raw_learning content
├─ Classify into ONE primary type:
│   ├─ PATTERN: Keywords "always", "use this when", "standard approach"
│   ├─ MISTAKE: Keywords "avoid", "don't", "breaks when", "fails if"
│   ├─ INSIGHT: Keywords "realized", "understand now", "why", "how it works"
│   ├─ OPTIMIZATION: Keywords "faster", "reduce", "improve", "optimize"
│   └─ CONSTRAINT: Keywords "must", "cannot", "limit", "requires", "boundary"
│
├─ Generate structured title (max 60 chars)
├─ Assign confidence score (auto-set 85% for explicit captures)
└─ If classification confidence < 80% → ASK user to select type
```

**Phase 2 Output:**
```
learning_type: [pattern|mistake|insight|optimization|constraint]
learning_title: "________________"
classification_confidence: [0-100]%
```

### Phase 3: Source Context Linking

```
├─ IF learning from current spec folder work:
│   ├─ Extract current spec folder → source_spec_folder
│   └─ link_to_source: true
│
├─ IF learning from prior memory/conversation:
│   ├─ Search: memory_search({ query: "<title>", limit: 3 })
│   ├─ IF match → source_memory_id
│   └─ link_to_source: true
│
└─ IF general/theoretical:
    ├─ source_spec_folder: null
    └─ link_to_source: false
```

### Phase 4: Destination Folder Selection

```
├─ IF source_spec_folder exists:
│   ├─ DEFAULT destination: source_spec_folder
│   ├─ ASK: "Save learning to [source_spec_folder]? Or select different folder?"
│   └─ OPTIONS: "[Y]es | [L]ist folders | [S]pecify folder"
│
├─ IF source_spec_folder is null:
│   ├─ List recent spec folders from memory_stats()
│   ├─ ASK: "Which spec folder should this learning belong to?"
│   └─ OPTIONS: Show top 5 recent + "[O]ther | [N]ew folder"
│
└─ IF user selects "New folder":
    └─ ASK: "Enter new spec folder name (e.g., '025-learnings')"
```

---

## 6. ⚡ SAVE WORKFLOW

**After all phases pass (1-4), execute save:**

### Step 1: Structure Learning Content

```markdown
# LEARNING: <learning_title>

**Type:** <learning_type>
**Captured:** <ISO_timestamp>
**Source:** <source_spec_folder OR source_memory_id OR "General">

## The Learning
<raw_learning>

## Context
- Files involved: <if applicable>
- Problem solved: <if applicable>
- Related work: <if applicable>

## Application
<!-- Type-specific guidance: -->
- Pattern: When to use, template/approach
- Mistake: When to avoid, warning signs, recovery
- Insight: Mental model, implications
- Optimization: When to apply, expected gain, trade-offs
- Constraint: Hard limit, scope, violation consequence
```

### Step 2: Execute Save

```bash
# Create the memory file
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <target_spec_folder>
```

```javascript
// Index the file into the memory database
spec_kit_memory_memory_save({
  filePath: "specs/<target_spec_folder>/memory/<generated_filename>.md",
  force: false
})
```

### Step 3: Display Confirmation

```
Learning Captured

   Title: <learning_title>
   Type: <learning_type>
   Tier: <importance_tier>
   Confidence: 85%
   Folder: <target_spec_folder>

   Trigger phrases:
   - <phrase1>
   - <phrase2>
   - <phrase3>

   This learning will surface when:
   - Searching for related topics
   - Working in <target_spec_folder>
   - Trigger phrases mentioned in conversation

STATUS=OK LEARNING_TYPE=<type> FOLDER=<target_spec_folder>
```

---

## 7. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each step.

| Step             | Required MCP Call                                                    | Mode     | On Failure   |
| ---------------- | -------------------------------------------------------------------- | -------- | ------------ |
| SOURCE LINKING   | `memory_search({ query, limit: 3 })`                                 | OPTIONAL | Skip linking |
| FOLDER SELECTION | `memory_list({ sortBy: "updated_at", limit: 10 })`                   | SINGLE   | Ask user     |
| SAVE             | `memory_save({ filePath: "specs/.../memory/....md", force: false })` | SINGLE   | Show error   |

**Tool Call Signatures:**

```javascript
spec_kit_memory_memory_search({ query: "<q>", limit: 3 })
spec_kit_memory_memory_list({ sortBy: "updated_at", limit: 10 })
spec_kit_memory_memory_save({
  filePath: "specs/<folder>/memory/<filename>.md",
  force: false,
  dryRun: false,       // Validate only without saving
  skipPreflight: false  // Skip pre-flight validation (not recommended)
})
```

---

## 8. 🔍 EXAMPLES

### Example 1: PATTERN Learning

**User:** `/memory:learn Always use debounce for input handlers in Webflow to avoid performance issues`

```
PHASE 1: raw_learning extracted
PHASE 2: Classified as PATTERN (confidence 95%)
         Title: "Debounce input handlers in Webflow"
PHASE 3: Source: 007-input-handler-optimization
PHASE 4: User confirms → target: "007-input-handler-optimization"

SAVE:
  Title: "Debounce input handlers in Webflow"
  Type: pattern | Tier: critical | Confidence: 85%
  Triggers: ["pattern", "debounce", "input", "webflow", "performance"]
```

### Example 2: MISTAKE Learning

**User:** `I learned that sync localStorage access in async flows causes race conditions`

```
PHASE 1: raw_learning extracted
PHASE 2: Classified as MISTAKE (confidence 92%)
         Title: "Avoid sync localStorage in async flows"
PHASE 3: Source: 012-storage-refactor
PHASE 4: User confirms → target: "012-storage-refactor"

SAVE:
  Title: "Avoid sync localStorage in async flows"
  Type: mistake | Tier: critical | Confidence: 85%
  Triggers: ["mistake", "localStorage", "async", "race condition"]
```

---

## 9. 🔍 QUICK REFERENCE

| Command                                             | Result                                      |
| --------------------------------------------------- | ------------------------------------------- |
| `/memory:learn`                                     | Prompt for learning description             |
| `/memory:learn [description]`                       | Auto-classify and save with folder prompt   |
| `/memory:learn [description] --folder:007-auth`     | Save to specified folder (skip Phase 4)     |
| `/memory:learn [description] --type:pattern`        | Override auto-classification                |
| `/memory:learn [description] --tier:constitutional` | Override auto-importance (use with caution) |

---

## 10. 🔧 CORRECTION SUBCOMMAND

**Trigger:** `/memory:learn correct <id> <type> [replacement-id]`

### Purpose

Learn from mistakes by marking memories as corrected, applying stability penalties, and boosting replacement memories.

### Correction Types

| Type       | Description                   | Penalty | Boost | Use When                        |
| ---------- | ----------------------------- | ------- | ----- | ------------------------------- |
| superseded | Replaced by newer information | 0.5x    | 1.2x  | Newer version exists            |
| deprecated | No longer valid               | 0.5x    | N/A   | Decision/pattern obsolete       |
| refined    | Clarified or improved         | 0.7x    | 1.1x  | Original was incomplete/unclear |
| merged     | Combined with another memory  | 0.6x    | 1.15x | Redundant content consolidated  |

### Workflow

1. **Parse Arguments**
   ```
   /memory:learn correct 42 superseded 67
   → memory_id: 42, correction_type: superseded, replacement_id: 67
   ```

2. **Load Original Memory** via `memory_list({ limit: 100, sortBy: "created_at" })`

3. **Show Correction Preview**
   ```
   CORRECTION PREVIEW
   ──────────────────────────────────────
   Original Memory: #42
     Title: OAuth token handling
     Tier: important | Stability: 85%

   Correction Type: superseded
     Penalty: 0.5x stability (85% → 42%)
     New tier: normal (downgrade)

   Replacement Memory: #67
     Title: OAuth2 PKCE flow implementation
     Boost: 1.2x stability (75% → 90%)
   ──────────────────────────────────────
   Confirm? [y]es, [n]o, [e]dit
   ```

4. **Apply Correction (on confirmation)**
   ```javascript
   // Downgrade original
   spec_kit_memory_memory_update({
     id: 42,
     importanceTier: "normal"
   })

   // Boost replacement (if provided)
   spec_kit_memory_memory_update({
     id: 67,
     importanceTier: "critical"
   })
   ```

5. **Display Result**
   ```
   Correction Applied
      Original: #42 → superseded (tier: normal)
      Replacement: #67 → boosted (tier: critical)
   STATUS=OK CORRECTED=42 TYPE=superseded REPLACED_BY=67
   ```

### Examples

```
/memory:learn correct 42 superseded 67   # Replace old with new
/memory:learn correct 42 deprecated      # Mark as obsolete (no replacement)
/memory:learn correct 42 refined 68      # Clarify with improved version
/memory:learn correct 42 merged 69       # Consolidate redundant content
```

---

## 11. 🔧 UNDO SUBCOMMAND

**Trigger:** `/memory:learn undo <id>`

Reverses a correction if made in error.

### Workflow

1. **Load Correction Metadata** via `memory_list` — find memory, check for correction metadata
2. **Show Undo Preview**
   ```
   UNDO CORRECTION
   ──────────────────────────────────────
   Memory: #42
     Current tier: normal → Original tier: important
     Stability restored: 42% → 85%
   Confirm undo? [y]es, [n]o
   ```
3. **Apply Reversal**
   ```javascript
   spec_kit_memory_memory_update({
     id: 42,
     importanceTier: "important"  // Restore original tier
   })
   ```
4. **Display Result**
   ```
   Correction Undone
      Memory: #42 — Tier restored: normal → important
   STATUS=OK UNDONE=42
   ```

---

## 12. 🔧 HISTORY SUBCOMMAND

**Trigger:** `/memory:learn history`

View all corrections applied to memories.

### Workflow

1. **Load Records** via `memory_list({ limit: 100, sortBy: "updated_at" })` — filter for memories with correction metadata
2. **Display Timeline**
   ```
   CORRECTION HISTORY
   ──────────────────────────────────────

   Memory #42: OAuth token handling
     Dec 10, 2:30 PM - Marked as superseded
       Replaced by: #67 (OAuth2 PKCE flow)
       Penalty: 0.5x stability

   Memory #38: Session management
     Dec 9, 11:00 AM - Marked as refined
       Clarified by: #65 (JWT session storage)
       Penalty: 0.7x stability

   ──────────────────────────────────────
   Total: 2 corrections (2 active, 0 undone)
   ```

When no corrections exist:
```
No corrections recorded yet.
Use '/memory:learn correct <id> <type>' to mark a memory as corrected.
STATUS=OK
```

---

## 13. ⚠️ ERROR HANDLING

| Condition                       | Response                                          |
| ------------------------------- | ------------------------------------------------- |
| No learning description         | ASK user for description                          |
| Classification confidence < 80% | ASK user to select type from menu                 |
| Source folder not found         | Offer to create or select alternative             |
| Target folder validation fails  | List available folders, ask user to select        |
| Save operation fails            | Show error, suggest retry or manual save          |
| Duplicate learning detected     | WARN user, offer to update existing or create new |
| Missing required argument       | ASK user, do not proceed                          |

---

## 14. 🔍 LEARNING RETRIEVAL

**How saved learnings surface in future sessions:**

### Automatic Triggers
When conversation contains trigger phrases, memory system auto-loads related learnings:
```
User: "I'm implementing an input handler in Webflow"
System: Surfaced learning: "Debounce input handlers in Webflow" (pattern, critical)
```

### Manual Search
```
/memory:context pattern debounce
→ Returns all pattern-type learnings about debounce
```

### Folder Context
Working in a spec folder auto-loads its learnings:
```
User: Working in 007-input-handler-optimization
System: Available learnings (2):
  - "Debounce input handlers in Webflow" (pattern)
  - "Event delegation vs direct binding" (insight)
```

### Importance Surfacing
- `critical` tier → top 5 results
- `important` tier → top 10 results
- `normal` tier → standard retrieval

---

## 15. 🔄 CONSOLIDATION PIPELINE

Learnings are processed through the memory consolidation pipeline to maintain quality and reduce redundancy.

### Deduplication

When a new learning is saved:
1. **Similarity Check**: Vector search for semantically similar existing learnings
2. **Threshold**: If similarity > 0.85, flag as potential duplicate
3. **Resolution**: Merge (combine, keep higher-tier) | Supersede (mark old, boost new) | Keep Both (user confirms distinct)

### Promotion Based on Access Frequency

| Access Frequency | Action                                      |
| ---------------- | ------------------------------------------- |
| High (>10/week)  | Promote to constitutional tier (if pattern) |
| Medium (3-10/wk) | Maintain current tier                       |
| Low (1-2/week)   | No change                                   |
| Rare (<1/month)  | Flag for review, potential deprecation      |

### Pipeline Integration Points

| Stage         | MCP Tool        | Purpose                 |
| ------------- | --------------- | ----------------------- |
| Pre-save      | `memory_search` | Deduplication check     |
| Consolidation | `memory_update` | Merge/promote/deprecate |
| Cleanup       | `memory_delete` | Remove orphan learnings |

---

## 16. 🚨 CONSTITUTIONAL LEARNING CAUTION

**IMPORTANT:** Setting a learning to constitutional tier means it will appear in EVERY search result.

**Only use constitutional tier for:**
- Core security principles (e.g., "Never commit secrets")
- Critical safety rules (e.g., "Always backup before destructive ops")
- Mandatory project constraints (e.g., "Match Webflow's async patterns")

**Budget:** ~2000 tokens max for all constitutional learnings combined.

**Override syntax:**
```
/memory:learn "Never commit secrets to git" --tier:constitutional
```

---

## 17. 📌 BEST PRACTICES

### When to Use `/memory:learn`

**DO use when:**
- You discover a reusable **pattern** or approach
- You hit a **mistake** or anti-pattern worth remembering
- You gain understanding of a complex system (**insight**)
- You identify a performance **optimization**
- You discover a hard limit or **constraint**

**DON'T use when:**
- Saving full session context (use `/memory:save` instead)
- Recording routine task completion (not a learning)
- Documenting implementation details (use spec folder docs)
- Storing temporary notes (use scratch folder)

### Trigger Phrase Strategy

Auto-generated triggers include:
- Learning type (pattern, mistake, insight, optimization, constraint)
- Key nouns from title (extracted automatically)
- Domain context (if detectable from source)

Manual override: `/memory:learn "Use React.memo for expensive renders" --triggers:React,memo,performance`

### Batch Learning Capture

End-of-session with multiple learnings — list them, AI captures as separate learnings with type classification, user confirms batch.

---

## 18. 🔗 RELATED COMMANDS

- `/memory:save` — Save full conversation context (episodic memory)
- `/memory:context` — Search and browse all memories
- `/memory:manage` — Manage memory database (tier changes, cleanup)

**Full documentation:** `.opencode/skill/system-spec-kit/SKILL.md`
