---
name: system-memory
description: "Context preservation with semantic memory: six-tier importance system (constitutional/critical/important/normal/temporary/deprecated), hybrid search (FTS5 + vector), 90-day half-life decay for recency boosting, checkpoint save/restore for context safety, constitutional memories (always surfaced), confidence-based promotion (90% threshold), session validation logging, context type filtering (research/implementation/decision/discovery/general), auto-indexing (memory_save/memory_index_scan). Manual trigger via keywords or /memory:save command."
allowed-tools: ["*"]
version: 12.4.0
---

<!-- Keywords: memory, context-preservation, session-documentation, auto-save, semantic-search, anchor-retrieval, constitutional, importance-tier, decay, checkpoint -->

# 🧠 System Memory - Context Preservation & Semantic Search

Saves expanded conversation context with full dialogue, decision rationale, visual flowcharts, and file changes. Uses semantic vector search for intelligent retrieval across sessions. Creates `specs/###-feature/memory/{timestamp}.md` with comprehensive session documentation.

---

## 1. 🎯 WHEN TO USE

### Primary Use Cases

**Use when:**
- Feature complete: "Just finished the payment integration"
- Complex discussion: "We made 5 architecture decisions today"
- Team sharing: "Need to document this for the team"
- Session ending: "Wrapping up for the day"
- Research complete: After investigation with findings to preserve
- Before context compaction: Save before Claude's context limit

**Trigger Phrases:**

| Phrase          | Also Works             |
| --------------- | ---------------------- |
| "save context"  | "save conversation"    |
| "document this" | "preserve context"     |
| "save session"  | "save this discussion" |

### Context Recovery (CRITICAL)

**Before implementing ANY changes** in a spec folder with memory files:

```bash
# Semantic search (use MCP tool directly - MANDATORY)
memory_search({ query: "your search query", specFolder: "###-name" })

# Or use command
/memory:search "your search query"
```

**User Response Options:**
- `[1]`, `[2]`, `[3]` - Load specific memory
- `[all]` - Load all listed memories
- `[skip]` - Continue without loading (instant, never blocks)

### When NOT to Use

- Simple typo fixes or trivial changes
- Context already documented in spec/plan files
- Conversations without spec folders (create one first)

---

## 2. 🧭 SMART ROUTING & REFERENCES

### Task Context Detection

```
TASK CONTEXT
    │
    ├─► Saving conversation context
    │   └─► Load: execution_methods.md, output_format.md, spec_folder_detection.md
    │   └─► Execute: generate-context.js script
    │
    ├─► Searching / retrieving memories
    │   └─► Load: semantic_memory.md
    │   └─► Use: memory_search(), memory_load(), memory_match_triggers()
    │
    ├─► Managing memory system (cleanup, tiers, triggers)
    │   └─► Load: semantic_memory.md, trigger_config.md
    │   └─► Use: memory_update(), memory_delete(), memory_validate()
    │
    ├─► Creating checkpoints / restoring state
    │   └─► Load: semantic_memory.md
    │   └─► Use: checkpoint_create(), checkpoint_restore(), checkpoint_list()
    │
    └─► Debugging memory issues
        └─► Load: troubleshooting.md, semantic_memory.md
        └─► Check: Index health, embedding status, alignment scoring
```

### Resource Router

```python
def route_memory_resources(task):
    """
    Resource Router for system-memory skill
    Load references based on task context
    
    References (7 files):
    ├── semantic_memory.md       → MCP tools, hybrid search, tiers, decay
    ├── execution_methods.md     → Script invocation, anchor retrieval
    ├── spec_folder_detection.md → Folder routing, alignment scoring
    ├── output_format.md         → File naming, timestamps, metadata
    ├── trigger_config.md        → Keywords, manual triggers
    ├── troubleshooting.md       → Issue resolution, debugging
    └── alignment_scoring.md     → Topic matching weights (STATIC)
    """

    # ──────────────────────────────────────────────────────────────────
    # Context Save
    # Trigger: /memory:save, "save context", generating memory files
    # ──────────────────────────────────────────────────────────────────
    if task.saving_context or task.generating_context:
        load("references/execution_methods.md")      # Script usage
        load("references/output_format.md")          # File naming
        load("references/spec_folder_detection.md")  # Folder routing
        return execute("scripts/generate-context.js")

    # ──────────────────────────────────────────────────────────────────
    # Memory Search
    # Trigger: /memory:search, memory_search(), retrieving context
    # ──────────────────────────────────────────────────────────────────
    if task.searching or task.retrieving:
        return load("references/semantic_memory.md")

    # ──────────────────────────────────────────────────────────────────
    # Memory Management
    # Trigger: /memory:search cleanup, /memory:search triggers, updating tiers
    # ──────────────────────────────────────────────────────────────────
    if task.managing_memories or task.editing_triggers or task.updating_tiers:
        load("references/semantic_memory.md")
        return load("references/trigger_config.md")

    # ──────────────────────────────────────────────────────────────────
    # Checkpoint Operations
    # Trigger: /memory:checkpoint, backup/restore state
    # ──────────────────────────────────────────────────────────────────
    if task.checkpoint_operations:
        return load("references/semantic_memory.md")

    # ──────────────────────────────────────────────────────────────────
    # Troubleshooting
    # Trigger: Search issues, embedding failures, index problems
    # ──────────────────────────────────────────────────────────────────
    if task.debugging or task.has_issues:
        load("references/troubleshooting.md")
        load("references/alignment_scoring.md")  # For score debugging
        return load("references/semantic_memory.md")

    # ──────────────────────────────────────────────────────────────────
    # Spec Folder Detection (standalone)
    # Trigger: Determining target folder for memory save
    # ──────────────────────────────────────────────────────────────────
    if task.folder_detection:
        load("references/spec_folder_detection.md")
        return load("references/alignment_scoring.md")

    # ──────────────────────────────────────────────────────────────────
    # Default: Basic operations covered by SKILL.md
    # ──────────────────────────────────────────────────────────────────
    return None  # SKILL.md has sufficient info

# ──────────────────────────────────────────────────────────────────────
# STATIC RESOURCES (always available, not conditionally loaded)
# ──────────────────────────────────────────────────────────────────────
# templates/context_template.md    → Output format template
# config.jsonc                     → Runtime configuration
# filters.jsonc                    → Content filtering rules

# Output: specs/###-feature/memory/{timestamp}__{topic}.md
# Alignment thresholds: 70% (proceed), 50% (interactive prompt)
```

### Command Entry Points

```
/memory:search [args]             ← UNIFIED DASHBOARD COMMAND
    │
    ├─► No args
    │   └─► DASHBOARD: Stats + Recent + Suggested
    │       ├─► Quick stats [via: memory_stats]
    │       ├─► Recent memories [via: memory_list]
    │       ├─► Suggested [via: memory_match_triggers]
    │       └─► Actions: [1-5] [a-c] [s]earch [t]riggers [c]leanup [q]uit
    │
    ├─► "<query>" (search text)
    │   └─► SEARCH MODE: Semantic search with filters
    │       └─► Options: --tier:<tier> --type:<type> --concepts:<a,b,c>
    │
    ├─► "cleanup"
    │   └─► CLEANUP MODE: Interactive removal of old/unused memories
    │       └─► Gate blocks until candidates reviewed
    │       └─► [a]ll, [r]eview each, [n]one, [b]ack
    │
    └─► "triggers"
        └─► TRIGGERS VIEW: Global trigger phrase overview
            └─► [#] edit, [s]earch by trigger, [b]ack

/memory:save [spec-folder]        ← SAVE CONTEXT COMMAND
    │
    └─► SAVE ACTION: Generate context documentation
        ├─► Interactive folder detection if no arg provided
        ├─► Create memory file with embeddings
        └─► Post-save: [t]riggers edit | [d]one

/memory:checkpoint [action]       ← CHECKPOINT MANAGEMENT
    │
    ├─► "create <name>"
    │   └─► Save current memory state
    │
    ├─► "list"
    │   └─► Show all checkpoints
    │
    ├─► "restore <name>"
    │   └─► Restore to checkpoint state
    │
    └─► "delete <name>"
        └─► Delete a checkpoint
```

---

## 3. 🚨 MEMORY LOADING CHOICE ENFORCEMENT

**MANDATORY**: The AI must NEVER autonomously decide whether to load memory files, which ones to load, or skip loading entirely. This is defined in **AGENTS.md Gate 4**.

### Enforcement (Manual)

The AI must follow this workflow manually and ask the user before loading any memory context.

### Trigger Conditions

Memory loading choice is **CONDITIONAL** - it only triggers when ALL of these conditions are met:

1. **Gate 3 completed** - User already answered Q1 (Spec Folder choice)
2. **User selected Option A or C** - Working in existing or related spec folder
3. **Memory files exist** - The spec folder has files in `memory/` directory

If ANY condition is NOT met, skip directly to task execution.

### Options Table

When triggered, the AI **MUST ask** the user to explicitly choose:

| Option            | Description                        | Best For                            |
| ----------------- | ---------------------------------- | ----------------------------------- |
| **[1], [2], [3]** | Load specific numbered memory file | Targeted context recovery           |
| **[all]**         | Load all listed memory files       | Full context restoration            |
| **[skip]**        | Proceed without loading context    | Fresh start, instant (never blocks) |

### AI Behavior Requirements

1. **ASK** user for memory loading choice when trigger conditions met
2. **WAIT** for explicit user selection - DO NOT proceed until answer received
3. **NEVER** assume which memories the user wants to load
4. **NEVER** auto-load memories without user consent (unless override phrase used)
5. **RESPECT** the user's choice throughout the session
6. If user has already set session preference, reuse their choice unless explicitly changed

### AGENTS.md Cross-Reference

This enforcement is defined in **AGENTS.md Section 2: MANDATORY GATES - Gate 4**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 4: MEMORY LOADING [SOFT BLOCK]                                         │
│ Trigger: User selected A or C in Gate 3 AND memory files exist              │
│ Action:  Display [1] [2] [3] [all] [skip] → Wait for user choice            │
│ Block:   SOFT - User can [skip] to proceed immediately                      │
│ Note:    Display memory options after user responds to Gate 3               │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Soft Block**: Unlike Gate 3 (hard block), Gate 4 allows `[skip]` for instant continuation. Memory loading NEVER blocks task execution if user chooses to skip.

### Override Phrases (Power Users)

Users can state preference explicitly to bypass the interactive prompt:

| Phrase                            | Effect                                | Duration          |
| --------------------------------- | ------------------------------------- | ----------------- |
| `"auto-load memories"`            | Load most recent memory automatically | Session (~1 hour) |
| `"fresh start"` / `"skip memory"` | Skip all context loading              | Session (~1 hour) |
| `"ask about memories"`            | Revert to interactive selection       | Session (~1 hour) |

### Session Persistence

Once user sets a preference, reuse it for the session (~1 hour) unless:
- User explicitly requests a different option
- User uses a different override phrase
- New conversation begins
- User changes spec folder (new Gate 3 selection)

### Question Format

Present the question clearly after Gate 3 completion:

```markdown
🧠 **Memory files found in [spec-folder-name]/memory/**

Found N previous session file(s):
  [1] DD-MM-YY_HH-MM__topic-1.md
  [2] DD-MM-YY_HH-MM__topic-2.md
  [3] DD-MM-YY_HH-MM__topic-3.md

**Load previous session context?**
  [1] [2] [3] - Load specific file
  [all] - Load all listed files
  [skip] - Proceed without context (start fresh)

Reply with number, "all", or "skip".
```

### Integration with Gate 3 (Spec Folder Choice)

Memory loading is the **second stage** of context setup:

```
Gate 3 (Q1): Spec Folder Choice
    │
    ├─► Option A (Use existing) ──────┐
    │                                  │
    ├─► Option B (Create new) ────────┼──► Skip Gate 4 (no memories yet)
    │                                  │
    ├─► Option C (Update related) ────┤
    │                                  │
    └─► Option D (Skip) ──────────────┴──► Skip Gate 4 (no spec folder)
                                       │
                                       ▼
Gate 4: Memory Loading Choice
    │
    ├─► [1] [2] [3] - Load specific ──► Read selected file(s)
    │
    ├─► [all] - Load all ─────────────► Read all listed files
    │
    └─► [skip] - Start fresh ─────────► Proceed without context
```

---

## 4. 🛠️ HOW IT WORKS

### Quick Overview

| Action          | Method                   | When to Use           |
| --------------- | ------------------------ | --------------------- |
| Manual save     | `/memory:save`           | Explicit control      |
| Dashboard       | `/memory:search`         | Stats, recent, manage |
| Semantic search | `/memory:search "query"` | Find prior context    |
| MCP tool        | `memory_search()`        | AI agent integration  |

### Save Workflow

**CRITICAL:** The AI agent MUST construct JSON data from conversation analysis. The script does NOT auto-extract session data.

```
USER triggers save (keyword or command)
        ↓
DETECT spec folder (≥70% auto, 50-69% warn, <50% prompt)
        ↓
AI ANALYZES conversation and extracts:
    ├─ Session summary (what was accomplished)
    ├─ Key decisions (choices + rationale)
    ├─ Files modified (actual paths)
    └─ Trigger phrases (5-10 keywords)
        ↓
AI CONSTRUCTS JSON with extracted data
        ↓
AI WRITES JSON to /tmp/save-context-data.json
        ↓
AI EXECUTES: node generate-context.js /tmp/save-context-data.json
        ↓
SCRIPT generates 300+ line markdown with anchors
        ↓
SCRIPT creates vector embeddings for semantic search
        ↓
SCRIPT extracts trigger phrases for fast matching
```

**Without JSON input, script falls back to simulation mode with placeholder data.**

### JSON Input Format (REQUIRED)

**The AI agent MUST construct this JSON** when saving context. This is the standard input format processed by `normalizeInputData()`:

```json
{
  "specFolder": "005-memory/008-feature-name",
  "sessionSummary": "Description of what was accomplished",
  "keyDecisions": [
    "Decision 1: Why we chose approach A",
    "Decision 2: Implementation detail rationale"
  ],
  "filesModified": [
    "/path/to/modified/file.js"
  ],
  "triggerPhrases": [
    "keyword1",
    "keyword2"
  ],
  "technicalContext": {
    "key": "Additional technical details"
  }
}
```

**Field Mappings:**

| Manual Field       | Maps To                 | Description                      |
| ------------------ | ----------------------- | -------------------------------- |
| `specFolder`       | `SPEC_FOLDER`           | Target spec folder path          |
| `sessionSummary`   | `observations[0]`       | Main session narrative           |
| `keyDecisions`     | `observations[]`        | Decision-type observations       |
| `filesModified`    | `FILES[]`               | Modified file paths              |
| `triggerPhrases`   | `_manualTriggerPhrases` | Search trigger phrases           |
| `technicalContext` | `observations[]`        | Technical implementation details |

**Usage Notes:**
- `specFolder` is REQUIRED - all other fields optional but recommended
- `sessionSummary` should be 100+ chars for comprehensive output
- `keyDecisions` array items become individual observations with `type: "decision"`
- `technicalContext` object is flattened into observations with `type: "technical"`
- `triggerPhrases` bypass auto-extraction when provided manually

**Execution Command:**
```bash
# Write JSON, execute script, clean up
cat > /tmp/save-context-data.json << 'EOF'
{ "specFolder": "...", "sessionSummary": "...", ... }
EOF
node .opencode/skill/system-memory/scripts/generate-context.js /tmp/save-context-data.json
rm /tmp/save-context-data.json
```

### Output Files

| File                        | Content                    |
| --------------------------- | -------------------------- |
| `{date}_{time}__{topic}.md` | Full session documentation |
| `metadata.json`             | Session statistics         |

**Naming**: `DD-MM-YY_HH-MM__topic.md` (e.g., `07-12-25_14-30__oauth.md`)

See [execution_methods.md](./references/execution_methods.md) for detailed script usage.

### Anchor-Based Retrieval (MANDATORY)

Memory files **MUST** include anchors for section-specific loading. This enables 93% token savings vs full file reads.

**Anchor Format:**
```html
<!-- ANCHOR:anchor-id -->
Content for this section...
<!-- /ANCHOR:anchor-id -->
```

**Format Rules:**
- Both `ANCHOR` and `anchor` (case-insensitive) are supported
- **MUST include BOTH opening AND closing tags** (closing tag required for extraction)
- Optional space after colon: `ANCHOR:id` or `ANCHOR: id` both work
- **Recommended**: Use UPPERCASE for consistency with templates

**ANTI-PATTERN (WILL BREAK ANCHOR LOADING):**
```html
<!-- WRONG: Missing closing tag - memory_load(anchorId) will FAIL -->
<!-- anchor: summary -->
Content here...
<!-- No closing tag = anchor extraction impossible! -->

<!-- CORRECT: Has both opening AND closing tags -->
<!-- ANCHOR:summary -->
Content here...
<!-- /ANCHOR:summary -->
```

**Why Closing Tags Are Required:**
The MCP server uses regex to extract anchor content: `<!-- ANCHOR:id -->...<!-- /ANCHOR:id -->`. Without the closing tag, the server cannot determine where the section ends and returns "Anchor not found".

**Anchor ID Pattern:** `[context-type]-[keywords]-[spec-number]`

| Context Type     | Use For                  | Example                             |
| ---------------- | ------------------------ | ----------------------------------- |
| `implementation` | Code patterns, solutions | `implementation-oauth-callback-049` |
| `decision`       | Architecture choices     | `decision-database-schema-005`      |
| `research`       | Investigation findings   | `research-lenis-scroll-006`         |
| `discovery`      | Learnings, insights      | `discovery-api-limits-011`          |
| `general`        | Mixed content            | `general-session-summary-049`       |

**Minimum Requirements:**
- 1 anchor per file (primary section)
- Recommended: 2+ anchors (summary + decisions/implementation)

**Load via MCP:**
```typescript
// Load specific section only (93% token savings)
memory_load({ specFolder: "049-auth", anchorId: "decision-jwt-049" })
```

```bash
# Find anchors by keyword
grep -l "ANCHOR:.*decision.*auth" specs/*/memory/*.md
```

### MCP Tools (for AI Agents)

**CRITICAL**: Call MCP tools directly - NEVER through Code Mode.

| Tool                    | Purpose                              | Key Parameters           |
| ----------------------- | ------------------------------------ | ------------------------ |
| `memory_search`         | Semantic vector search               | query, specFolder, tier  |
| `memory_load`           | Load memory by spec folder/anchor    | specFolder, **anchorId** |
| `memory_match_triggers` | Fast trigger phrase matching (<50ms) | prompt                   |
| `memory_list`           | Browse memories with pagination      | specFolder, limit        |
| `memory_update`         | Update importance/metadata           | id, importanceTier       |
| `memory_delete`         | Delete by ID or spec folder          | id OR specFolder         |
| `memory_stats`          | System statistics                    | -                        |
| `memory_validate`       | Record validation feedback           | id, wasUseful            |
| `memory_save`           | Index single memory file             | filePath                 |
| `memory_index_scan`     | Bulk scan and index workspace        | specFolder, force        |

**`memory_load` with Anchor Retrieval:**
```typescript
// Load entire memory file
memory_load({ specFolder: "049-auth" })

// Load specific section (93% token savings)
memory_load({ specFolder: "049-auth", anchorId: "decision-jwt-049" })
```

*Note: `memory_load` requires `specFolder` (always required). `memoryId` is optional for direct ID access.*

**Key `memory_search` Parameters:**

| Parameter               | Type    | Default | Description                                                                            |
| ----------------------- | ------- | ------- | -------------------------------------------------------------------------------------- |
| `query`                 | string  | null    | Natural language search query                                                          |
| `concepts`              | array   | null    | Multi-concept AND search (2-5 strings, all must match)                                 |
| `specFolder`            | string  | null    | Limit search to specific spec folder                                                   |
| `limit`                 | number  | 10      | Maximum results to return                                                              |
| `tier`                  | string  | null    | Filter: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| `contextType`           | string  | null    | Filter: `decision`, `implementation`, `research`, `discovery`, `general`               |
| `useDecay`              | boolean | true    | Apply 90-day half-life decay to scores                                                 |
| `includeContiguity`     | boolean | false   | Include adjacent/contiguous memories                                                   |
| `includeConstitutional` | boolean | true    | Always include constitutional tier at top                                              |

**Parameter Details:**

- **`includeContiguity`**: When enabled, returns memories that were created in temporal proximity (within the same session or close timestamps). Useful for recovering full session context when you find one relevant memory but need its surrounding context.

- **`includeConstitutional`**: Constitutional tier memories are always surfaced at the top of search results (max ~500 tokens). These are "always-on" memories that provide critical project context regardless of the search query.

### Auto-Indexing

Memory files are automatically indexed when:
1. **Startup**: MCP server indexes new/changed files on start
2. **File Watcher**: `npm run watch` monitors for changes (optional)
3. **MCP Tools**: Use `memory_save()` or `memory_index_scan()` for manual control

```typescript
// Index single file
memory_save({ filePath: "/path/to/memory.md", force: false })

// Bulk scan workspace
memory_index_scan({ specFolder: "005-memory", force: false })
```

### Six-Tier Importance System

| Tier             | Boost | Decay  | Use Case                                         |
| ---------------- | ----- | ------ | ------------------------------------------------ |
| `constitutional` | 3.0x  | None   | Always in dashboard (max 3 entries)              |
| `critical`       | 2.0x  | None   | Architecture decisions, breaking changes         |
| `important`      | 1.5x  | None   | Key implementations, major features              |
| `normal`         | 1.0x  | 90-day | Standard development context                     |
| `temporary`      | 0.5x  | 90-day | Debug sessions, experiments (auto-expire 7 days) |
| `deprecated`     | 0.0x  | N/A    | Excluded from search, accessible via memory_load |

### Plugin Dashboard Injection (OPTIONAL)

> **Note**: The plugin is an **optional enhancement**. All memory functionality (14 MCP tools) works without the plugin. The plugin only adds automatic dashboard injection.

The Memory Context Plugin injects a **compact ASCII dashboard** (~500-800 tokens) into the system prompt at session start. This replaces the previous approach of injecting full constitutional memory content (~2,000-5,000 tokens).

**Dashboard Features:**
- Shows memories by tier: Constitutional (★), Critical (◆), Important (◇), Recent (○)
- Displays memory IDs for on-demand loading via `memory_load({ memoryId: # })`
- Limits: 3 constitutional + 3 critical + 3 important + 5 recent = **14 max entries**
- Token budget: ~500-800 tokens (vs 2,000-5,000 for full content injection)
- Empty sections are hidden automatically
- Shows "Showing X of Y memories" stats at footer

**On-Demand Loading:**
Full memory content is NOT injected automatically. Users load specific memories as needed:
```typescript
// Load full memory content when needed
memory_load({ memoryId: 42 })
```

This approach provides:
- **75-85% token savings** compared to full content injection
- **Awareness without bloat** - AI knows what memories exist
- **User control** - explicit loading prevents unwanted context

**Without the plugin**: All MCP tools (`memory_search`, `memory_load`, `memory_save`, etc.) work normally. You simply won't have the automatic dashboard at session start - use `memory_search()` or `memory_list()` to discover memories manually.

### Memory Decay System

**Formula**: `decay_factor = 0.5 ^ (days_since_access / 90)`

| Days | Decay Factor |
| ---- | ------------ |
| 0    | 1.00         |
| 30   | 0.79         |
| 90   | 0.50         |
| 180  | 0.25         |

**Bypass decay**: critical tier, historical keywords ("original", "initial"), or `use_decay: false`

### Hybrid Search Pipeline

```
Query → [Vector Search] → Top 20
      → [FTS5 Search]   → Top 20
      → [RRF Fusion]    → Combined ranking
      → [Decay Applied] → Final results
```

### Confidence-Based Promotion

Memories with 90%+ accuracy after 5+ validations are promoted to `critical` tier.

```typescript
// Validate memory accuracy
memory_validate({ id: 123, wasUseful: true })
```

### Checkpoint System

Save/restore database state for safe experimentation:

| Command                        | Purpose               |
| ------------------------------ | --------------------- |
| `checkpoint_create({ name })`  | Save current state    |
| `checkpoint_list()`            | View all checkpoints  |
| `checkpoint_restore({ name })` | Restore to checkpoint |
| `checkpoint_delete({ name })`  | Delete a checkpoint   |

See [semantic_memory.md](./references/semantic_memory.md) for complete documentation.

---

## 5. 📋 RULES

### ✅ ALWAYS

1. **ALWAYS detect spec folder before creating documentation**
   - Use 70% alignment threshold
   - Prompt user if uncertain

2. **ALWAYS use single `memory/` folder with timestamped files**
   - Format: `DD-MM-YY_HH-MM__topic.md`
   - Include `metadata.json` with session stats

3. **ALWAYS search context before implementing in folders with memory**
   - Run `memory_search()` or `/memory:search "query"` first
   - Load and acknowledge relevant context

4. **ALWAYS generate vector embeddings for new memory files**
   - Enables semantic search
   - Extract trigger phrases for fast matching

5. **ALWAYS call MCP tools directly (NEVER through Code Mode)**
   - `memory_search()` - correct
   - `call_tool_chain(semantic_memory...)` - WRONG

### ❌ NEVER

1. **NEVER fabricate decisions that weren't made**
   - Document only actual conversation content
   - Mark uncertainties explicitly

2. **NEVER include sensitive data**
   - No passwords, API keys, tokens
   - Filter before saving

3. **NEVER proceed if spec folder detection fails**
   - Prompt user to create/select folder
   - No orphaned memory files

4. **NEVER skip context recovery in folders with existing memory**
   - Search before implementing
   - Acknowledge prior context

### ⚠️ ESCALATE IF

1. **ESCALATE IF spec folder detection fails**
   - Ask user to create or select folder
   - Cannot proceed without valid target

2. **ESCALATE IF vector embedding generation fails repeatedly**
   - Check MCP server status
   - May need index rebuild

3. **ESCALATE IF alignment score < 50%**
   - Interactive prompt shows top 3 alternatives
   - User must confirm folder selection
   - Note: 50-69% shows warning but proceeds automatically

---

## 6. ✅ SUCCESS CRITERIA

### Save Complete When

- [ ] Spec folder auto-detected (70%+ alignment)
- [ ] Memory file created: `{timestamp}__{topic}.md`
- [ ] Metadata file created: `metadata.json`
- [ ] Vector embeddings generated
- [ ] Trigger phrases extracted

### Search Complete When

- [ ] Results returned with similarity scores
- [ ] Tier filtering applied (if specified)
- [ ] Decay calculation applied (unless disabled)
- [ ] Context loaded and acknowledged

### Performance Targets

| Operation         | Target |
| ----------------- | ------ |
| Save              | <3s    |
| Search            | <200ms |
| Cached search     | <10ms  |
| Trigger match     | <50ms  |
| Context surfacing | <1s    |

---

## 7. 🔗 INTEGRATION POINTS

### Related Skills

| Skill                     | Integration                        |
| ------------------------- | ---------------------------------- |
| `system-spec-kit`         | Spec folder creation and routing   |
| `workflows-git`           | Enhances commits with context SHAs |
| `workflows-documentation` | Flowchart generation patterns      |

### Data Flow

```
Conversation → AI Analysis → JSON → Script → Markdown + Embeddings
```

### Component Locations

| Component       | Location                                                       | Required |
| --------------- | -------------------------------------------------------------- | -------- |
| MCP Server      | `.opencode/skill/system-memory/mcp_server/semantic-memory.js` | **Yes**  |
| Main script     | `.opencode/skill/system-memory/scripts/generate-context.js`   | **Yes**  |
| Memory Database | `.opencode/skill/system-memory/database/memory-index.sqlite`  | **Yes**  |
| Server Config   | `opencode.json` → `mcp.semantic_memory`                        | **Yes**  |
**Architecture Note:** The MCP server is bundled within this skill folder for self-contained deployment. When copying this skill to a new project, update the `opencode.json` path to match the new project location.

### Quick Reference

**Commands:**

| Command                   | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `/memory:search`          | Unified dashboard (search, triggers, cleanup) |
| `/memory:search <query>`  | Semantic search                               |
| `/memory:search cleanup`  | Interactive cleanup (Gate 1 required)         |
| `/memory:search triggers` | View/manage trigger phrases                   |
| `/memory:save`            | Save current context                          |
| `/memory:checkpoint`      | Create/restore memory checkpoints             |

**Output**: `specs/###-feature/memory/{date}_{time}__{topic}.md`

**Anchor Format**: `<!-- ANCHOR:category-keywords-spec# -->...<!-- /ANCHOR:category-keywords-spec# -->` (case-insensitive)

---

**Common Fixes:**
1. **Missing spec folder**: `mkdir -p specs/###-feature/memory/`
2. **Vector search empty**: Run `memory_index_scan()` or restart MCP server
3. **Decay hiding old results**: Use `use_decay: false` parameter

### Database Reset/Rebuild Procedure

When the memory index becomes corrupted or needs a fresh start:

```bash
# 1. Stop OpenCode/MCP server

# 2. Delete the database file
rm .opencode/skill/system-memory/database/memory-index.sqlite

# 3. Restart OpenCode (this clears the MCP server's in-memory cache)

# 4. Re-index all memory files
memory_index_scan({ force: true })
```

**When to reset:**
- Search returns stale/incorrect results after server restart
- Embedding generation failures persist
- Database file becomes corrupted
- After major memory file reorganization

**Note:** Deleting the database removes all indexed memories. The files in `specs/*/memory/` remain intact and will be re-indexed by `memory_index_scan()`.

See [troubleshooting.md](./references/troubleshooting.md) for detailed issue resolution.