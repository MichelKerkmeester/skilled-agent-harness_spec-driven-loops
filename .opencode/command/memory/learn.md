---
description: Capture explicit learning from session - patterns, mistakes, insights, optimizations, constraints. Also provides correction, undo, and history subcommands.
argument-hint: "[learning-description] | correct <id> <type> [replacement-id] | undo <id> | history"
allowed-tools: Read, Bash, spec_kit_memory_memory_save, spec_kit_memory_memory_search, spec_kit_memory_memory_update, spec_kit_memory_memory_list, spec_kit_memory_memory_delete
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**CRITICAL: For subcommands with `<required>` arguments, you MUST have explicit values.**

## 4 CRITICAL RULES

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

---

# 🚨 SUBCOMMAND ROUTING - CHECK FIRST

**After validating required arguments, route based on $ARGUMENTS:**

```
$ARGUMENTS
    │
    ├─ Starts with "correct":
    │   └─→ CORRECTION WORKFLOW (Section 17)
    │       Pattern: /memory:learn correct <id> <type> [replacement-id]
    │       Example: /memory:learn correct 42 superseded 67
    │
    ├─ Starts with "undo":
    │   └─→ UNDO WORKFLOW (Section 18)
    │       Pattern: /memory:learn undo <id>
    │       Example: /memory:learn undo 42
    │
    ├─ Equals "history":
    │   └─→ HISTORY VIEW (Section 19)
    │       Pattern: /memory:learn history
    │
    └─ Any other text or empty:
        └─→ DEFAULT LEARNING CAPTURE (Phase 1 below)
```

---

# 🚨 MANDATORY PHASE - BLOCKING ENFORCEMENT

**This phase MUST be passed before workflow execution. You CANNOT proceed until phase shows ✅ PASSED.**

---

## 🔒 PHASE 1: LEARNING EXTRACTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS contains learning description:
│   ├─ Store as: raw_learning
│   ├─ SET STATUS: ✅ PASSED → PROCEED TO PHASE 2
│
└─ IF $ARGUMENTS is empty:
    ├─ ⛔ HARD BLOCK - Cannot infer from conversation
    ├─ ASK: "What did you learn? Describe the lesson, pattern, or insight."
    ├─ WAIT for explicit response
    ├─ Store as: raw_learning
    └─ SET STATUS: ✅ PASSED → PROCEED TO PHASE 2

**STOP HERE** - Wait for user to provide learning description.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
```

**Phase 1 Output:** `raw_learning = ________________`

---

## 🔒 PHASE 2: LEARNING TYPE CLASSIFICATION

**STATUS: ☐ BLOCKED** (run after Phase 1)

```
CLASSIFICATION LOGIC:

├─ Analyze raw_learning content
├─ Classify into ONE primary type (5 categories per spec 082):
│
│   ├─ PATTERN: Reusable approach, code structure, or workflow
│   │   Keywords: "always", "use this when", "standard approach", "template"
│   │   Example: "Always use debounce for input handlers in Webflow"
│   │
│   ├─ MISTAKE: Something to avoid, anti-pattern, or failure mode
│   │   Keywords: "avoid", "don't", "mistake", "breaks when", "fails if"
│   │   Example: "Avoid synchronous localStorage access in async flows"
│   │   Note: Formerly "pitfall" - renamed for clarity
│   │
│   ├─ INSIGHT: Understanding gained, "aha" moment, or mental model
│   │   Keywords: "realized", "understand now", "why", "how it works"
│   │   Example: "FSRS retrievability drops exponentially after 7 days"
│   │
│   ├─ OPTIMIZATION: Performance improvement, efficiency gain, or resource reduction
│   │   Keywords: "faster", "reduce", "improve", "optimize", "efficient"
│   │   Example: "Batch DOM updates to reduce reflows by 60%"
│   │
│   └─ CONSTRAINT: Hard limit, requirement, or boundary condition
│       Keywords: "must", "cannot", "limit", "requires", "boundary"
│       Example: "Webflow custom code must be under 10KB per page"
│
├─ Store as: learning_type
├─ Generate structured title from learning (max 60 chars)
├─ Store as: learning_title
├─ Assign confidence score (auto-set to 85% for explicit captures)
└─ SET STATUS: ✅ PASSED → PROCEED TO PHASE 3

**Classification Confidence:**
- Explicit capture via /memory:learn → 85% confidence (auto-set)
- If classification confidence < 80% → ASK user to select type from menu
- Otherwise → Auto-classify and proceed

**STOP HERE** - Ensure classification is complete.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
```

**Phase 2 Output:**
```
learning_type: [pattern|mistake|insight|optimization|constraint]
learning_title: "________________"
classification_confidence: [0-100]%
learning_confidence: 85% (auto-set for explicit capture)
```

---

## 🔒 PHASE 3: SOURCE CONTEXT LINKING

**STATUS: ☐ BLOCKED** (run after Phase 2)

```
CONTEXT ASSOCIATION:

├─ Determine source context for learning:
│
│   ├─ IF learning came from current spec folder work:
│   │   ├─ Extract current spec folder from conversation
│   │   ├─ Store as: source_spec_folder
│   │   └─ SET link_to_source: true
│   │
│   ├─ IF learning came from prior memory/conversation:
│   │   ├─ Search for related memory:
│   │       spec_kit_memory_memory_search({
│   │         query: "<learning_title>",
│   │         limit: 3
│   │       })
│   │   ├─ IF match found → Store memory ID as: source_memory_id
│   │   └─ SET link_to_source: true
│   │
│   └─ IF learning is general/theoretical:
│       ├─ source_spec_folder: null
│       ├─ source_memory_id: null
│       └─ SET link_to_source: false
│
├─ Generate metadata for save:
│   {
│     learningType: "<learning_type>",
│     sourceFolder: "<source_spec_folder>",
│     sourceMemoryId: "<source_memory_id>",
│     capturedAt: "<ISO_timestamp>",
│     autoImportance: true
│   }
│
└─ SET STATUS: ✅ PASSED → PROCEED TO PHASE 4

**STOP HERE** - Ensure context linking is complete.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
```

**Phase 3 Output:**
```
source_spec_folder: ________________
source_memory_id: ________________
link_to_source: [true|false]
metadata: { ... }
```

---

## 🔒 PHASE 4: DESTINATION FOLDER SELECTION

**STATUS: ☐ BLOCKED** (run after Phase 3)

```
FOLDER ROUTING LOGIC:

├─ Determine where to save the learning:
│
│   ├─ IF source_spec_folder exists (from Phase 3):
│   │   ├─ DEFAULT destination: source_spec_folder
│   │   ├─ ASK: "Save learning to [source_spec_folder]? Or select different folder?"
│   │   ├─ OPTIONS: "[Y]es | [L]ist folders | [S]pecify folder"
│   │   └─ WAIT for response
│   │
│   ├─ IF source_spec_folder is null:
│   │   ├─ List recent spec folders from memory_stats()
│   │   ├─ ASK: "Which spec folder should this learning belong to?"
│   │   ├─ OPTIONS: Show top 5 recent + "[O]ther | [N]ew folder"
│   │   └─ WAIT for response
│   │
│   └─ IF user selects "New folder":
│       ├─ ASK: "Enter new spec folder name (e.g., '025-learnings')"
│       └─ WAIT for response
│
├─ Validate selected folder exists
├─ Store as: target_spec_folder
└─ SET STATUS: ✅ PASSED → PROCEED TO SAVE WORKFLOW

**STOP HERE** - Wait for user folder selection.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED
```

**Phase 4 Output:** `target_spec_folder = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to save workflow, verify all phases:**

| PHASE                   | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                 |
| ----------------------- | --------------- | ----------- | ---------------------------- |
| PHASE 1: EXTRACTION     | ✅ PASSED        | ______      | raw_learning: ______________ |
| PHASE 2: CLASSIFICATION | ✅ PASSED        | ______      | learning_type: _____________ |
| PHASE 3: LINKING        | ✅ PASSED        | ______      | source_spec_folder: ________ |
| PHASE 4: DESTINATION    | ✅ PASSED        | ______      | target_spec_folder: ________ |

```
VERIFICATION CHECK:
├─ All phases show ✅ PASSED?
│   ├─ YES → Proceed to SAVE WORKFLOW
│   └─ NO  → STOP and complete blocked phases
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Assumed learning description without explicit user input
- Auto-classified learning type without validation
- Skipped source context linking
- Assumed destination folder without asking user
- Proceeded to save without all phases passing

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I violated PHASE [N] by [specific action]. Correcting now."
3. RETURN to violated phase
4. COMPLETE the phase properly
5. RESUME only after phase passes verification
```

---

# Memory Learning Command

Capture explicit learnings from conversation sessions as high-importance semantic memories.

---

```yaml
role: Learning Capture Specialist
purpose: Transform session insights into searchable, high-value semantic memories
action: Classify learning, link to source, save with importance boost

operating_mode:
  workflow: phased_extraction_and_save
  workflow_compliance: MANDATORY
  approvals: folder_selection_only
  tracking: learning_metadata
```

---

## 1. 🎯 PURPOSE

Capture explicit learnings during sessions to build a personal knowledge base of:
- **Patterns**: Reusable approaches and templates
- **Mistakes**: Anti-patterns and failure modes to avoid (formerly "pitfalls")
- **Insights**: Deep understanding and mental models
- **Optimizations**: Performance improvements and efficiency gains
- **Constraints**: Hard limits, requirements, and boundary conditions

**Key Difference from `/memory:save`:**
- `/memory:save` = Full session context (episodic memory)
- `/memory:learn` = Distilled lesson (semantic memory with auto-boost)

**Confidence Scoring:**
- Learnings captured via `/memory:learn` receive 85% confidence (auto-set)
- This reflects intentional, explicit knowledge capture vs. passive extraction

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional learning description
**Outputs:** `STATUS=<OK|FAIL> LEARNING_TYPE=<type> FOLDER=<spec-folder>`

---

## 3. 📊 LEARNING TYPES

| Type           | When to Use                        | Importance Tier | Confidence | Examples                                               |
| -------------- | ---------------------------------- | --------------- | ---------- | ------------------------------------------------------ |
| `pattern`      | Reusable approach discovered       | **critical**    | 85%        | "Always debounce input handlers in Webflow"            |
| `mistake`      | Error made or anti-pattern hit     | **critical**    | 85%        | "Never use sync localStorage in async flow"            |
| `insight`      | Understanding gained               | **important**   | 85%        | "FSRS retrievability drops exponentially after 7 days" |
| `optimization` | Performance improvement identified | **important**   | 85%        | "Batch DOM updates to reduce reflows by 60%"           |
| `constraint`   | Hard limit or requirement found    | **critical**    | 85%        | "Webflow custom code must be under 10KB per page"      |

**Note:** `pitfall` renamed to `mistake` for clarity (spec 082 alignment).

**Importance Auto-Boost:**
- `pattern`, `mistake`, and `constraint` → `critical` tier (always surfaces in search)
- `insight` and `optimization` → `important` tier (high priority)

**Confidence Scoring:**
- All explicit learnings via `/memory:learn` receive 85% confidence (auto-set)
- This reflects intentional capture vs. passive extraction

---

## 4. ⚡ SAVE WORKFLOW

**After all phases pass (1-4), execute save:**

### Step 1: Structure Learning Content

```markdown
# LEARNING: <learning_title>

**Type:** <learning_type>
**Captured:** <ISO_timestamp>
**Source:** <source_spec_folder OR source_memory_id OR "General">

---

## The Learning

<raw_learning — user's description>

---

## Context

<Extracted from conversation:>
- Files involved: <if applicable>
- Problem solved: <if applicable>
- Related work: <if applicable>

---

## Application

<When/where to apply this learning — auto-generated based on type>

### Pattern:
Use this approach when: <conditions>
Template: <if code pattern>

### Mistake:
Avoid this when: <conditions>
Warning signs: <symptoms>
Recovery: <how to fix if encountered>

### Insight:
Mental model: <explanation>
Implications: <what this means>

### Optimization:
Apply when: <performance scenarios>
Expected gain: <quantified improvement>
Trade-offs: <any downsides>

### Constraint:
Hard limit: <specific boundary>
Applies to: <scope>
Violation consequence: <what breaks>
```

### Step 2: Generate Memory Save Data

```javascript
{
  title: "<learning_title>",
  content: "<structured_content_from_step_1>",
  specFolder: "<target_spec_folder>",
  importanceTier: "<auto_tier_from_learning_type>",
  contextType: "discovery",  // All learnings are discoveries
  triggerPhrases: [
    "<learning_type>",
    "<key_words_from_title>",
    "<domain_context>"
  ],
  metadata: {
    learningType: "<learning_type>",
    sourceFolder: "<source_spec_folder>",
    sourceMemoryId: "<source_memory_id>",
    capturedAt: "<ISO_timestamp>",
    autoImportance: true
  }
}
```

### Step 3: Execute Save

```javascript
spec_kit_memory_memory_save({
  title: "<learning_title>",
  content: "<structured_content>",
  specFolder: "<target_spec_folder>",
  importanceTier: "<critical|important|normal>",
  contextType: "discovery",
  triggerPhrases: [...],
  metadata: {...}
})
```

### Step 4: Display Confirmation

```
✅ Learning Captured

   Title: <learning_title>
   Type: <learning_type>
   Tier: <importance_tier>
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

## 5. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each step.

```
┌─────────────────────┬─────────────────────────────────────────┬──────────┬─────────────────┐
│ STEP                │ REQUIRED MCP CALLS                      │ MODE     │ ON FAILURE      │
├─────────────────────┼─────────────────────────────────────────┼──────────┼─────────────────┤
│ SOURCE LINKING      │ spec_kit_memory_memory_search({ query, limit: 3 })│ OPTIONAL │ Skip linking    │
├─────────────────────┼─────────────────────────────────────────┼──────────┼─────────────────┤
│ FOLDER SELECTION    │ spec_kit_memory_memory_list({ sortBy: "updated_at" })│ SINGLE   │ Ask user        │
├─────────────────────┼─────────────────────────────────────────┼──────────┼─────────────────┤
│ SAVE                │ spec_kit_memory_memory_save({ ... })    │ SINGLE   │ Show error msg  │
└─────────────────────┴─────────────────────────────────────────┴──────────┴─────────────────┘
```

**Tool Call Signatures:**

```javascript
spec_kit_memory_memory_search({ query: "<q>", limit: 3 })
spec_kit_memory_memory_list({ sortBy: "updated_at", limit: 10 })
spec_kit_memory_memory_save({
  title: "<title>",
  content: "<content>",
  specFolder: "<folder>",
  importanceTier: "<tier>",
  contextType: "discovery",
  triggerPhrases: [...],
  metadata: {...}
})
```

---

## 6. 🔍 EXAMPLES BY TYPE

### Example 1: PATTERN Learning

**User:** "/memory:learn Always use debounce for input handlers in Webflow to avoid performance issues"

**Command Flow:**

```
PHASE 1: ✅ PASSED (raw_learning extracted)
PHASE 2: ✅ PASSED (classified as PATTERN, confidence 95%)
         learning_title: "Debounce input handlers in Webflow"
         learning_confidence: 85% (auto-set)
PHASE 3: ✅ PASSED (source: 007-input-handler-optimization)
PHASE 4: User confirms → target_spec_folder: "007-input-handler-optimization"

SAVE:
  Title: "Debounce input handlers in Webflow"
  Type: pattern
  Tier: critical (auto-boosted)
  Confidence: 85%
  Triggers: ["pattern", "debounce", "input", "webflow", "performance"]

✅ Learning Captured
```

### Example 2: MISTAKE Learning

**User:** "I learned that sync localStorage access in async flows causes race conditions"

**Command Flow:**

```
PHASE 1: ✅ PASSED (raw_learning extracted)
PHASE 2: ✅ PASSED (classified as MISTAKE, confidence 92%)
         learning_title: "Avoid sync localStorage in async flows"
         learning_confidence: 85% (auto-set)
PHASE 3: ✅ PASSED (source: 012-storage-refactor)
PHASE 4: User confirms → target_spec_folder: "012-storage-refactor"

SAVE:
  Title: "Avoid sync localStorage in async flows"
  Type: mistake
  Tier: critical (auto-boosted)
  Confidence: 85%
  Triggers: ["mistake", "localStorage", "async", "race condition"]

✅ Learning Captured
```

### Example 3: INSIGHT Learning

**User:** "/memory:learn FSRS retrievability drops exponentially after 7 days without review"

**Command Flow:**

```
PHASE 1: ✅ PASSED (raw_learning extracted)
PHASE 2: ✅ PASSED (classified as INSIGHT, confidence 98%)
         learning_title: "FSRS retrievability decay timeline"
         learning_confidence: 85% (auto-set)
PHASE 3: ✅ PASSED (source: 082-speckit-reimagined)
PHASE 4: User confirms → target_spec_folder: "082-speckit-reimagined"

SAVE:
  Title: "FSRS retrievability decay timeline"
  Type: insight
  Tier: important
  Confidence: 85%
  Triggers: ["insight", "FSRS", "retrievability", "decay"]

✅ Learning Captured
```

### Example 4: OPTIMIZATION Learning

**User:** "/memory:learn Batch DOM updates to reduce reflows - saw 60% improvement in scroll performance"

**Command Flow:**

```
PHASE 1: ✅ PASSED (raw_learning extracted)
PHASE 2: ✅ PASSED (classified as OPTIMIZATION, confidence 94%)
         learning_title: "Batch DOM updates to reduce reflows"
         learning_confidence: 85% (auto-set)
PHASE 3: ✅ PASSED (source: 015-scroll-performance)
PHASE 4: User confirms → target_spec_folder: "015-scroll-performance"

SAVE:
  Title: "Batch DOM updates to reduce reflows"
  Type: optimization
  Tier: important
  Confidence: 85%
  Triggers: ["optimization", "DOM", "reflow", "performance", "batch"]

✅ Learning Captured
```

### Example 5: CONSTRAINT Learning

**User:** "/memory:learn Webflow custom code must be under 10KB per page or it won't load"

**Command Flow:**

```
PHASE 1: ✅ PASSED (raw_learning extracted)
PHASE 2: ✅ PASSED (classified as CONSTRAINT, confidence 98%)
         learning_title: "Webflow custom code 10KB limit"
         learning_confidence: 85% (auto-set)
PHASE 3: ✅ PASSED (source: 001-webflow-setup)
PHASE 4: User confirms → target_spec_folder: "001-webflow-setup"

SAVE:
  Title: "Webflow custom code 10KB limit"
  Type: constraint
  Tier: critical (auto-boosted)
  Confidence: 85%
  Triggers: ["constraint", "Webflow", "custom code", "10KB", "limit"]

✅ Learning Captured
```

---

## 7. 📌 QUICK REFERENCE

| Command                                             | Result                                      |
| --------------------------------------------------- | ------------------------------------------- |
| `/memory:learn`                                     | Prompt for learning description             |
| `/memory:learn [description]`                       | Auto-classify and save with folder prompt   |
| `/memory:learn [description] --folder:007-auth`     | Save to specified folder (skip Phase 4)     |
| `/memory:learn [description] --type:pattern`        | Override auto-classification                |
| `/memory:learn [description] --tier:constitutional` | Override auto-importance (use with caution) |

---

## 8. ⚠️ ERROR HANDLING

| Condition                       | Response                                          |
| ------------------------------- | ------------------------------------------------- |
| No learning description         | ASK user for description                          |
| Classification confidence < 80% | ASK user to select type from menu                 |
| Source folder not found         | Offer to create or select alternative             |
| Target folder validation fails  | List available folders, ask user to select        |
| Save operation fails            | Show error, suggest retry or manual save          |
| Duplicate learning detected     | WARN user, offer to update existing or create new |

---

## 9. 📌 BEST PRACTICES

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

**Auto-generated triggers include:**
- Learning type (pattern, mistake, insight, optimization, constraint)
- Key nouns from title (extracted automatically)
- Domain context (if detectable from source)

**Manual override example:**
```
/memory:learn "Use React.memo for expensive renders" --triggers:React,memo,performance,optimization
```

### Constitutional Tier Override

**Use ONLY for core principles that should ALWAYS surface:**
```
/memory:learn "Never commit secrets to git" --tier:constitutional
```

This will make the learning appear in EVERY search result (2000 token budget).

---

## 10. 🔗 RELATED COMMANDS

- `/memory:save` - Save full conversation context (episodic memory)
- `/memory:context` - Search and browse all memories
- `/memory:manage` - Manage memory database (tier changes, cleanup)

---

## 11. 📚 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-spec-kit/SKILL.md`

---

## 12. 🔍 LEARNING RETRIEVAL

**How saved learnings surface in future sessions:**

### Automatic Triggers
When conversation contains trigger phrases, memory system auto-loads related learnings:
```
User: "I'm implementing an input handler in Webflow"
System: 🧠 Surfaced learning: "Debounce input handlers in Webflow" (pattern, critical)
```

### Manual Search
```
/memory:context pattern debounce
→ Returns all pattern-type learnings about debounce
```

### Folder Context
Working in a spec folder auto-loads learnings from that folder:
```
User: Working in 007-input-handler-optimization
System: 🧠 Available learnings (2):
  - "Debounce input handlers in Webflow" (pattern)
  - "Event delegation vs direct binding" (insight)
```

### Importance Surfacing
- `critical` tier learnings surface in top 5 results
- `important` tier learnings surface in top 10 results
- `normal` tier learnings use standard retrieval

---

## 13. 🔧 CONSOLIDATION PIPELINE INTEGRATION

Learnings are automatically processed through the memory consolidation pipeline to maintain quality and reduce redundancy.

### Deduplication

When a new learning is saved:
1. **Similarity Check**: Vector search for semantically similar existing learnings
2. **Threshold**: If similarity > 0.85, flag as potential duplicate
3. **Resolution Options**:
   - Merge: Combine content, keep higher-tier version
   - Supersede: Mark old as superseded, boost new
   - Keep Both: If genuinely distinct (user confirms)

```javascript
// Deduplication check before save
const similar = await memory_search({
  query: learning_title,
  limit: 5,
  threshold: 0.85
});
if (similar.length > 0) {
  // Present merge/supersede/keep options to user
}
```

### Merge Over Time

Learnings consolidate based on access patterns:
- **Weekly**: Learnings accessed together >3 times → suggest merge
- **Monthly**: Learnings with <10% retrievability → suggest archive
- **Quarterly**: Orphan learnings (no access) → suggest deprecation

### Promotion Based on Access Frequency

| Access Frequency | Action                                      |
| ---------------- | ------------------------------------------- |
| High (>10/week)  | Promote to constitutional tier (if pattern) |
| Medium (3-10/wk) | Maintain current tier                       |
| Low (1-2/week)   | No change                                   |
| Rare (<1/month)  | Flag for review, potential deprecation      |

**Promotion Workflow:**
```
Access threshold exceeded → Suggest promotion
User confirms → memory_update({ importanceTier: "constitutional" })
System logs: "Learning promoted due to high access frequency"
```

### Pipeline Integration Points

| Stage         | MCP Tool                    | Purpose                 |
| ------------- | --------------------------- | ----------------------- |
| Pre-save      | `memory_search`             | Deduplication check     |
| Post-save     | *(Not Implemented)*         | Track learning patterns |
| Consolidation | `memory_update`             | Merge/promote/deprecate |
| Cleanup       | `memory_delete` (via admin) | Remove orphan learnings |

---

## 14. ⚠️ CONSTITUTIONAL LEARNING CAUTION

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

## 15. 📊 WORKFLOW INTEGRATION

### During Implementation

**Pattern Discovery:**
```
User: "This debounce approach worked great for the input handler"
AI: "Would you like to capture that as a reusable pattern?"
User: "/memory:learn Always use debounce for input handlers in Webflow"
```

### After Debugging

**Mistake Recording:**
```
User: "That race condition was caused by sync localStorage access"
AI: "Important lesson - should we save that to avoid it in the future?"
User: "/memory:learn Never use sync localStorage in async flows"
```

### Research Sessions

**Insight Capture:**
```
User: "I finally understand how FSRS retrieval decay works"
AI: "Want to preserve that understanding?"
User: "/memory:learn FSRS retrievability drops exponentially after 7 days"
```

### Performance Discovery

**Optimization Recording:**
```
User: "Batching those DOM updates made the page way faster"
AI: "Should we capture that optimization for future work?"
User: "/memory:learn Batch DOM updates to reduce reflows by 60%"
```

---

## 16. ⚡ ADVANCED USAGE

### Batch Learning Capture

**Scenario:** End of session with multiple learnings

```
User: "I learned three things today:
1. Debounce input handlers
2. Avoid sync localStorage in async
3. Webflow has a 10KB code limit"

AI: "I'll capture these as separate learnings:

1. /memory:learn "Debounce input handlers in Webflow" --type:pattern
2. /memory:learn "Avoid sync localStorage in async flows" --type:mistake
3. /memory:learn "Webflow custom code 10KB limit" --type:constraint

Proceed? [y]es, [e]dit, [c]ancel"
```

### Cross-Reference Learnings

**Scenario:** Learning builds on prior learning

```
User: "/memory:learn Event delegation is better than direct binding for dynamic content"

AI: "I found a related learning: 'Debounce input handlers in Webflow' (pattern)
     Should I cross-reference these learnings?"

User: "Yes"

AI: ✅ Learning Captured with cross-reference
    Related learnings: #47 (Debounce pattern)
```

### Learning Collections

**Scenario:** Group related learnings by theme

```
User: "Create a collection for 'Webflow Performance Patterns'"

AI: "Creating learning collection in 000-webflow-patterns:
     - Debounce input handlers (pattern)
     - Event delegation for dynamic content (technique)
     - Lazy load images (reference)

     These will share collection tag for grouped retrieval."
```

---

## 17. 🔧 CORRECTION SUBCOMMAND

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

2. **Load Original Memory**
   ```javascript
   spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
   // Find memory with matching ID
   ```

3. **Show Correction Preview**
   ```
   CORRECTION PREVIEW
   ────────────────────────────────────────────────────
   Original Memory: #42
     Title: OAuth token handling
     Tier: important
     Current stability: 85%

   Correction Type: superseded
     Penalty: 0.5x stability (85% → 42%)
     New tier: normal (downgrade)

   Replacement Memory: #67
     Title: OAuth2 PKCE flow implementation
     Boost: 1.2x stability (75% → 90%)

   ────────────────────────────────────────────────────
   Confirm? [y]es, [n]o, [e]dit
   ```

4. **Apply Correction (on confirmation)**
   ```javascript
   // Downgrade original
   spec_kit_memory_memory_update({
     id: 42,
     importanceTier: "normal",
     metadata: {
       correctionType: "superseded",
       replacedBy: 67,
       correctedAt: "<ISO_timestamp>",
       stabilityPenalty: 0.5
     }
   })

   // Boost replacement
   spec_kit_memory_memory_update({
     id: 67,
     importanceTier: "critical",
     metadata: {
       replacesMemory: 42,
       boostReason: "correction_replacement",
       stabilityBoost: 1.2
     }
   })
   ```

5. **Display Result**
   ```
   ✅ Correction Applied

      Original Memory: #42
        Status: Marked as superseded
        New tier: normal (downgrade)

      Replacement Memory: #67
        Status: Boosted
        New tier: critical (upgrade)

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

## 18. 🔧 UNDO SUBCOMMAND

**Trigger:** `/memory:learn undo <id>`

### Purpose

Reverse a correction if it was made in error.

### Workflow

1. **Load Correction Metadata**
   ```javascript
   spec_kit_memory_memory_list({ limit: 100, sortBy: "created_at" })
   // Find memory, check for correctedAt in metadata
   ```

2. **Show Undo Preview**
   ```
   UNDO CORRECTION
   ────────────────────────────────────────────────────
   Memory: #42
     Current tier: normal
     Original tier: important
     Penalty will be reversed: 42% → 85%

   Confirm undo? [y]es, [n]o
   ```

3. **Apply Reversal**
   ```javascript
   spec_kit_memory_memory_update({
     id: 42,
     importanceTier: "important",  // Restore original tier
     metadata: {
       correctionUndone: true,
       undoneAt: "<ISO_timestamp>"
     }
   })
   ```

4. **Display Result**
   ```
   ✅ Correction Undone

      Memory: #42
        Tier restored: normal → important
        Stability restored: 42% → 85%

   STATUS=OK UNDONE=42
   ```

---

## 19. 🔧 HISTORY SUBCOMMAND

**Trigger:** `/memory:learn history`

### Purpose

View all corrections applied to memories.

### Workflow

1. **Load Correction Records**
   ```javascript
   spec_kit_memory_memory_list({ limit: 100, sortBy: "updated_at" })
   // Filter for memories with correctionType metadata
   ```

2. **Display Correction Timeline**
   ```
   CORRECTION HISTORY
   ────────────────────────────────────────────────────

   Memory #42: OAuth token handling
     Dec 10, 2:30 PM - Marked as superseded
       Replaced by: #67 (OAuth2 PKCE flow)
       Penalty: 0.5x stability
       Applied by: /memory:learn correct

   Memory #38: Session management
     Dec 9, 11:00 AM - Marked as refined
       Clarified by: #65 (JWT session storage)
       Penalty: 0.7x stability

   Memory #12: Auth patterns
     Dec 8, 3:15 PM - Marked as deprecated
       Reason: Replaced by OAuth2
       Undone: Dec 8, 4:00 PM

   ────────────────────────────────────────────────────
   Total: 3 corrections (2 active, 1 undone)

   [#] view memory | [s]earch | [b]ack | [q]uit
   ```

### Analytics Summary

When no corrections exist:
```
CORRECTION HISTORY
────────────────────────────────────────────────────

No corrections recorded yet.

Use '/memory:learn correct <id> <type>' to mark a memory as corrected.

STATUS=OK
```
