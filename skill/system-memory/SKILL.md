---
name: system-memory
description: "Context preservation with semantic memory: six-tier importance system (constitutional/critical/important/normal/temporary/deprecated), hybrid search (FTS5 + vector), 90-day half-life decay for recency boosting, checkpoint save/restore for context safety, constitutional memories (always surfaced), confidence-based promotion (90% threshold), session validation logging, context type filtering (research/implementation/decision/discovery/general), auto-indexing (memory_save/memory_index_scan). Manual trigger via keywords or /memory:save command."
allowed-tools: ["*"]
version: 12.5.0
---

<!-- Keywords: memory, context-preservation, session-documentation, auto-save, semantic-search, anchor-retrieval, constitutional, importance-tier, decay, checkpoint -->

# 🧠 System Memory - Context Preservation & Semantic Search

Saves expanded conversation context with full dialogue, decision rationale, visual flowcharts, and file changes. Uses semantic vector search for intelligent retrieval across sessions. Creates `specs/###-feature/memory/{timestamp}.md` with comprehensive session documentation.

---

## 1. 🎯 WHEN TO USE

### Primary Use Cases

| Trigger                   | Example Phrase                                |
| ------------------------- | --------------------------------------------- |
| Feature complete          | "Just finished the payment integration"       |
| Complex discussion        | "We made 5 architecture decisions today"      |
| Session ending            | "Wrapping up for the day"                     |
| Research complete         | After investigation with findings to preserve |
| Before context compaction | Save before Claude's context limit            |

**Trigger Phrases:** "save context", "save conversation", "document this", "preserve context", "save session"

### Context Recovery (CRITICAL)

**Before implementing ANY changes** in a spec folder with memory files:

```typescript
// Semantic search (use MCP tool directly - MANDATORY)
memory_search({ query: "your search query", specFolder: "###-name" })

// Or use command: /memory:search "your search query"
```

**User Response Options:** `[1]`, `[2]`, `[3]` - Load specific | `[all]` - Load all | `[skip]` - Continue without loading

### When NOT to Use

- Simple typo fixes or trivial changes
- Context already documented in spec/plan files
- Conversations without spec folders (create one first)

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
User Request
    │
    ├─► Contains "save context", "preserve", "remember this"?
    │   └─► YES → Route to /memory:save
    │
    ├─► Contains "search", "find", "what did we", "prior work"?
    │   └─► YES → Route to /memory:search
    │
    ├─► Contains "checkpoint", "snapshot", "restore"?
    │   └─► YES → Route to /memory:checkpoint
    │
    ├─► Research task starting?
    │   └─► Auto-call memory_match_triggers() first
    │
    └─► Session ending or major milestone?
        └─► Suggest /memory:save
```

### Resource Router

**Task-Based Loading:**

| Task Context           | Load References                                                  | Execute                    | Output             |
| ---------------------- | ---------------------------------------------------------------- | -------------------------- | ------------------ |
| **Saving context**     | execution_methods.md, output_format.md, spec_folder_detection.md | generate-context.js        | `memory/*.md` file |
| **Searching memories** | semantic_memory.md                                               | memory_search, memory_load | Ranked results     |
| **Trigger matching**   | trigger_config.md                                                | memory_match_triggers      | Matched memories   |
| **Managing tiers**     | semantic_memory.md                                               | memory_update              | Updated metadata   |
| **Checkpoint ops**     | semantic_memory.md                                               | checkpoint_* tools         | Snapshot/restore   |
| **Debugging issues**   | troubleshooting.md, alignment_scoring.md                         | —                          | Diagnosis          |
| **Folder detection**   | spec_folder_detection.md, alignment_scoring.md                   | —                          | Spec folder path   |

**Command → Resource Mapping:**

| Command                    | Primary Resources                      | MCP Tools Used                        |
| -------------------------- | -------------------------------------- | ------------------------------------- |
| `/memory:save [folder]`    | execution_methods.md, output_format.md | memory_save, memory_index_scan        |
| `/memory:search`           | semantic_memory.md                     | memory_stats, memory_list             |
| `/memory:search "<query>"` | semantic_memory.md                     | memory_search, memory_load            |
| `/memory:search cleanup`   | semantic_memory.md                     | memory_delete, memory_list            |
| `/memory:search triggers`  | trigger_config.md                      | memory_match_triggers                 |
| `/memory:checkpoint *`     | semantic_memory.md                     | checkpoint_create/list/restore/delete |

### Resource Inventory

**References (`references/`):**

| File                     | Purpose                        | When to Load              |
| ------------------------ | ------------------------------ | ------------------------- |
| semantic_memory.md       | MCP tool reference, parameters | Search, manage operations |
| execution_methods.md     | Save workflow details          | Saving context            |
| output_format.md         | Memory file format             | Saving context            |
| spec_folder_detection.md | Folder detection logic         | Save, alignment           |
| alignment_scoring.md     | Content alignment algorithm    | Save validation           |
| trigger_config.md        | Trigger phrase configuration   | Trigger matching          |
| troubleshooting.md       | Common issues, fixes           | Debugging                 |

**Scripts (`scripts/`):**
- `generate-context.js` - Main context generation script
- `lib/` - Shared utilities

**Configuration:**
- `config.jsonc` - Main configuration (decay, search weights)
- `filters.jsonc` - Content filtering rules
- `templates/context_template.md` - Memory file template

**MCP Server (`mcp_server/`):**
- `semantic-memory.js` - MCP server implementation
- `lib/` - Vector index, embeddings, checkpoints

### Commands

| Command              | Args             | Purpose                                 |
| -------------------- | ---------------- | --------------------------------------- |
| `/memory:save`       | `[spec-folder]`  | Save current context to memory file     |
| `/memory:search`     | —                | Dashboard: stats + recent + suggestions |
| `/memory:search`     | `"<query>"`      | Semantic search with optional filters   |
| `/memory:search`     | `cleanup`        | Interactive removal of old memories     |
| `/memory:search`     | `triggers`       | View/manage trigger phrases             |
| `/memory:checkpoint` | `create <name>`  | Create named checkpoint                 |
| `/memory:checkpoint` | `list`           | List all checkpoints                    |
| `/memory:checkpoint` | `restore <name>` | Restore from checkpoint                 |
| `/memory:checkpoint` | `delete <name>`  | Delete checkpoint                       |

**Search Filters:**
- `--tier <tier>` - Filter by importance tier
- `--type <type>` - Filter by context type
- `--folder <folder>` - Limit to spec folder

### Automatic Behaviors

| Trigger                       | Action                                                     |
| ----------------------------- | ---------------------------------------------------------- |
| New user message              | Call `memory_match_triggers()` to surface relevant context |
| Research task                 | Search for prior work before starting                      |
| Session ending keywords       | Suggest `/memory:save`                                     |
| Major milestone               | Suggest `/memory:save`                                     |
| Spec folder selected (Gate 4) | Offer to load existing memories                            |

---

## 3. 🚨 GATE 4: MEMORY LOADING ENFORCEMENT

> **Full Gate 4 specification**: See AGENTS.md Section 2 - MANDATORY GATES.

### Quick Reference

**Trigger Conditions (ALL must be met):**
1. Gate 3 completed (user answered spec folder choice)
2. User selected Option A or C (existing/related folder)
3. Memory files exist in `memory/` directory

**If ANY condition is NOT met → Skip to task execution.**

### Options

| Option              | Description                 | Best For                   |
| ------------------- | --------------------------- | -------------------------- |
| `[1]`, `[2]`, `[3]` | Load specific numbered file | Targeted context recovery  |
| `[all]`             | Load all listed files       | Full context restoration   |
| `[skip]`            | Proceed without loading     | Fresh start (never blocks) |

### Override Phrases (Session-Persistent)

| Phrase                            | Effect                          |
| --------------------------------- | ------------------------------- |
| `"auto-load memories"`            | Load most recent automatically  |
| `"fresh start"` / `"skip memory"` | Skip all context loading        |
| `"ask about memories"`            | Revert to interactive selection |

**AI Behavior:** ASK user for choice → WAIT for response → NEVER auto-load without consent.

---

## 4. 🛠️ HOW IT WORKS

### Save Workflow

```
USER triggers save → DETECT spec folder (≥70% auto, 50-69% warn, <50% prompt)
                   → AI ANALYZES conversation (summary, decisions, files, triggers)
                   → AI WRITES JSON to /tmp/save-context-data.json
                   → AI EXECUTES: node generate-context.js /tmp/save-context-data.json
                   → SCRIPT generates markdown with anchors + vector embeddings
```

**CRITICAL:** AI must construct JSON from conversation analysis. Without JSON input, script uses placeholder data.

### JSON Input Format (REQUIRED)

```json
{
  "specFolder": "005-memory/008-feature-name",
  "sessionSummary": "Description of what was accomplished",
  "keyDecisions": ["Decision 1: Why we chose approach A"],
  "filesModified": ["/path/to/modified/file.js"],
  "triggerPhrases": ["keyword1", "keyword2"],
  "technicalContext": { "key": "Additional technical details" }
}
```

| Field              | Maps To                 | Notes                  |
| ------------------ | ----------------------- | ---------------------- |
| `specFolder`       | `SPEC_FOLDER`           | **REQUIRED**           |
| `sessionSummary`   | `observations[0]`       | 100+ chars recommended |
| `keyDecisions`     | `observations[]`        | type: "decision"       |
| `filesModified`    | `FILES[]`               | Actual paths           |
| `triggerPhrases`   | `_manualTriggerPhrases` | 5-10 keywords          |
| `technicalContext` | `observations[]`        | type: "technical"      |

**Execution:**
```bash
cat > /tmp/save-context-data.json << 'EOF'
{ "specFolder": "...", "sessionSummary": "...", ... }
EOF
node .opencode/skill/system-memory/scripts/generate-context.js /tmp/save-context-data.json
rm /tmp/save-context-data.json
```

**Output Files:** `{DD-MM-YY}_{HH-MM}__{topic}.md` + `metadata.json`

### Anchor-Based Retrieval (MANDATORY)

Memory files **MUST** include anchors for section-specific loading. Enables 93% token savings.

**Anchor Format (Definitive):**
```html
<!-- ANCHOR:anchor-id -->
Content for this section...
<!-- /ANCHOR:anchor-id -->
```

**Rules:**
- Case-insensitive (`ANCHOR` or `anchor`)
- **MUST include BOTH opening AND closing tags** (closing tag required for extraction)
- Optional space after colon: `ANCHOR:id` or `ANCHOR: id`
- Recommended: Use UPPERCASE for consistency

**ANTI-PATTERN:**
```html
<!-- WRONG: Missing closing tag - memory_load(anchorId) will FAIL -->
<!-- anchor: summary -->
Content here...
<!-- No closing tag = anchor extraction impossible! -->
```

**Anchor ID Pattern:** `[context-type]-[keywords]-[spec-number]`

| Context Type     | Example                             |
| ---------------- | ----------------------------------- |
| `implementation` | `implementation-oauth-callback-049` |
| `decision`       | `decision-database-schema-005`      |
| `research`       | `research-lenis-scroll-006`         |
| `discovery`      | `discovery-api-limits-011`          |
| `general`        | `general-session-summary-049`       |

**Requirements:** 1 anchor minimum per file, 2+ recommended (summary + decisions/implementation)

**Load via MCP:**
```typescript
memory_load({ specFolder: "049-auth", anchorId: "decision-jwt-049" })  // 93% token savings
```

### MCP Tools

**CRITICAL**: Call MCP tools directly - NEVER through Code Mode.

| Tool                    | Purpose                              | Key Parameters                     |
| ----------------------- | ------------------------------------ | ---------------------------------- |
| `memory_search`         | Semantic vector search               | query, specFolder, tier, useDecay  |
| `memory_load`           | Load memory by spec folder/anchor    | specFolder OR memoryId, anchorId   |
| `memory_match_triggers` | Fast trigger phrase matching (<50ms) | prompt, limit (default: 3)         |
| `memory_list`           | Browse memories with pagination      | specFolder, limit, offset          |
| `memory_update`         | Update importance/metadata           | id, importanceTier, triggerPhrases |
| `memory_delete`         | Delete by ID or spec folder          | id OR specFolder, confirm          |
| `memory_stats`          | System statistics                    | —                                  |
| `memory_validate`       | Record validation feedback           | id, wasUseful                      |
| `memory_save`           | Index single memory file             | filePath, force                    |
| `memory_index_scan`     | Bulk scan and index workspace        | specFolder, force                  |

**Key `memory_search` Parameters:**

| Parameter               | Type    | Default | Description                                                           |
| ----------------------- | ------- | ------- | --------------------------------------------------------------------- |
| `query`                 | string  | null    | Natural language search query                                         |
| `concepts`              | array   | null    | Multi-concept AND search (2-5 strings)                                |
| `specFolder`            | string  | null    | Limit to specific spec folder                                         |
| `tier`                  | string  | null    | Filter: constitutional/critical/important/normal/temporary/deprecated |
| `contextType`           | string  | null    | Filter: decision/implementation/research/discovery/general            |
| `useDecay`              | boolean | true    | Apply 90-day half-life decay                                          |
| `includeContiguity`     | boolean | false   | Include adjacent/temporal memories                                    |
| `includeConstitutional` | boolean | true    | Always include constitutional at top (~500 tokens max)                |

### When to Use Which Save Method

| Method                | Use When                              | Creates File? | Indexes? |
| --------------------- | ------------------------------------- | ------------- | -------- |
| `generate-context.js` | Creating NEW memory from conversation | Yes           | Yes      |
| `memory_save` MCP     | Indexing EXISTING .md files           | No            | Yes      |

**AGENTS.md Gate 5 requires `generate-context.js`** for all memory saves to ensure proper anchor format.

### Six-Tier Importance System

| Tier             | Boost | Decay  | Use Case                                   |
| ---------------- | ----- | ------ | ------------------------------------------ |
| `constitutional` | 3.0x  | None   | Always in dashboard (max 3), gate rules    |
| `critical`       | 2.0x  | None   | Architecture decisions, breaking changes   |
| `important`      | 1.5x  | None   | Key implementations, major features        |
| `normal`         | 1.0x  | 90-day | Standard development context               |
| `temporary`      | 0.5x  | 90-day | Debug sessions, experiments (7-day expiry) |
| `deprecated`     | 0.0x  | N/A    | Excluded from search, accessible via load  |

### Constitutional Tier

Reserved for memories that must ALWAYS surface:
- Gate enforcement rules (e.g., Gate 3 spec folder question)
- Project-wide constraints and coding standards
- Critical workflow reminders

**Create:** `memory_update({ id: X, importanceTier: "constitutional" })`

Constitutional memories appear at top of every `memory_search()` result. May include 20-40+ trigger phrases for comprehensive coverage via `memory_match_triggers()`.

### Memory Decay & Hybrid Search

**Decay Formula:** `decay_factor = 0.5 ^ (days_since_access / 90)`

| Days | Factor | Days | Factor |
| ---- | ------ | ---- | ------ |
| 0    | 1.00   | 90   | 0.50   |
| 30   | 0.79   | 180  | 0.25   |

**Bypass decay:** critical tier, historical keywords, or `useDecay: false`

**Hybrid Search Pipeline:**
```
Query → Vector Search (top 20) + FTS5 Search (top 20) → RRF Fusion → Decay Applied → Results
```

**Confidence-Based Promotion:** 90%+ accuracy after 5+ validations → promoted to `critical` tier.

### Checkpoint System

| Tool                           | Purpose               |
| ------------------------------ | --------------------- |
| `checkpoint_create({ name })`  | Save current state    |
| `checkpoint_list()`            | View all checkpoints  |
| `checkpoint_restore({ name })` | Restore to checkpoint |
| `checkpoint_delete({ name })`  | Delete a checkpoint   |

---

## 5. 📋 RULES

### ✅ ALWAYS

1. **Detect spec folder before creating documentation** (70% alignment threshold)
2. **Use single `memory/` folder** with timestamped files: `DD-MM-YY_HH-MM__topic.md`
3. **Search context before implementing** in folders with memory files
4. **Generate vector embeddings** for new memory files (enables semantic search)
5. **Call MCP tools directly** - NEVER through Code Mode

### ❌ NEVER

1. **Fabricate decisions** that weren't made - document only actual content
2. **Include sensitive data** - no passwords, API keys, tokens
3. **Proceed if spec folder detection fails** - prompt user first
4. **Skip context recovery** in folders with existing memory

### ⚠️ ESCALATE IF

1. **Spec folder detection fails** - ask user to create/select folder
2. **Vector embedding fails repeatedly** - check MCP server status
3. **Alignment score < 50%** - interactive prompt with top 3 alternatives

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
- [ ] Tier/decay filtering applied
- [ ] Context loaded and acknowledged

### Performance Targets

| Operation     | Target |
| ------------- | ------ |
| Save          | <3s    |
| Search        | <200ms |
| Cached search | <10ms  |
| Trigger match | <50ms  |

---

## 7. 🔗 INTEGRATION POINTS

### Related Skills

| Skill                     | Integration                        |
| ------------------------- | ---------------------------------- |
| `system-spec-kit`         | Spec folder creation and routing   |
| `workflows-git`           | Enhances commits with context SHAs |
| `workflows-documentation` | Flowchart generation patterns      |

### Component Locations

| Component       | Location                                                      |
| --------------- | ------------------------------------------------------------- |
| MCP Server      | `.opencode/skill/system-memory/mcp_server/semantic-memory.js` |
| Main Script     | `.opencode/skill/system-memory/scripts/generate-context.js`   |
| Memory Database | `.opencode/skill/system-memory/database/memory-index.sqlite`  |
| Server Config   | `opencode.json` → `mcp.semantic_memory`                       |

**Data Flow:** `Conversation → AI Analysis → JSON → Script → Markdown + Embeddings`

### Quick Reference

**Anchor Format:** `<!-- ANCHOR:category-keywords-spec# -->...<!-- /ANCHOR:category-keywords-spec# -->`

**Output:** `specs/###-feature/memory/{date}_{time}__{topic}.md`

### Troubleshooting

| Issue                    | Fix                                                                         |
| ------------------------ | --------------------------------------------------------------------------- |
| Missing spec folder      | `mkdir -p specs/###-feature/memory/`                                        |
| Vector search empty      | Run `memory_index_scan()` or restart MCP server                             |
| Decay hiding old results | Use `useDecay: false` parameter                                             |
| Stale results            | Delete database, restart OpenCode, run `memory_index_scan({ force: true })` |

**Database Reset:**
```bash
rm .opencode/skill/system-memory/database/memory-index.sqlite
# Restart OpenCode, then:
memory_index_scan({ force: true })
```

See [troubleshooting.md](./references/troubleshooting.md) for detailed issue resolution.