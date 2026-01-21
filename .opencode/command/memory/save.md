---
description: Save current conversation context to memory with semantic indexing
argument-hint: "<spec-folder>"
allowed-tools: Read, Bash, Task, spec_kit_memory_memory_save, spec_kit_memory_memory_index_scan, spec_kit_memory_memory_stats, spec_kit_memory_memory_update
---

# 🚨 MANDATORY PHASE - BLOCKING ENFORCEMENT

**This phase MUST be passed before workflow execution. You CANNOT proceed until phase shows ✅ PASSED.**

---

## 🔒 PHASE 1: SPEC FOLDER VALIDATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS contains spec folder (e.g., "011-memory" or "specs/011-memory"):
│   ├─ Validate folder exists
│   ├─ Store as: target_folder
│   ├─ → PROCEED TO PHASE 1B (Content Alignment Check)
│   └─ SET STATUS: ✅ PASSED (after alignment validated)
│
├─ IF $ARGUMENTS is empty:
│   ├─ ⛔ HARD BLOCK - Cannot assume from previous context
│   ├─ List recent/related spec folders
│   ├─ ASK user to select one
│   ├─ WAIT for explicit response
│   ├─ Store as: target_folder
│   ├─ → PROCEED TO PHASE 1B (Content Alignment Check)
│   └─ SET STATUS: ✅ PASSED (after alignment validated)
│
└─ IF folder invalid or not found:
    ├─ Show available folders
    ├─ ASK user to select or retry
    ├─ WAIT for response
    └─ SET STATUS: ✅ PASSED (after selection + alignment)

**STOP HERE** - Wait for user to confirm or provide a valid spec folder before saving context.

⛔ HARD STOP: DO NOT proceed to save workflow until STATUS = ✅ PASSED
```

**Phase 1 Output:** `target_folder = ________________`

---

## 🔒 PHASE 1B: CONTENT ALIGNMENT CHECK

**STATUS: ☐ BLOCKED** (run after Phase 1)

```
ALIGNMENT VALIDATION:

├─ Extract conversation topic from current session:
│   ├─ What is the PRIMARY subject being discussed?
│   ├─ What files/folders are being modified?
│   └─ What problem is being solved?
│
├─ Compare topic to target_folder name:
│   ├─ Does folder name relate to conversation topic?
│   │   ├─ YES (clear match) → SET STATUS: ✅ PASSED
│   │   ├─ UNCLEAR (ambiguous) → WARN + suggest alternatives
│   │   └─ NO (mismatch) → ⚠️ ALIGNMENT WARNING
│
├─ IF ALIGNMENT WARNING triggered:
│   ├─ STATE: "Potential mismatch detected"
│   ├─ SHOW: "Conversation topic: [topic]"
│   ├─ SHOW: "Selected folder: [target_folder]"
│   ├─ SUGGEST: Top 3 alternative folders that might match
│   ├─ ASK: "Continue with [target_folder] or select alternative?"
│   ├─ Options: [C]ontinue | [1] [2] [3] alternatives | [N]ew folder
│   └─ WAIT for explicit confirmation
│
└─ SET STATUS: ✅ PASSED (after alignment confirmed)

**STOP HERE** - Wait for user to confirm content alignment or select alternative folder before continuing.

⛔ HARD STOP: DO NOT proceed if alignment not validated
```

**Phase 1B Output:** `alignment_validated = ☐ YES | ☐ WARNED_CONFIRMED`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify phase status:**

| PHASE                   | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE             |
| ----------------------- | --------------- | ----------- | ------------------------ |
| PHASE 1: SPEC FOLDER    | ✅ PASSED        | ______      | target_folder: ______    |
| PHASE 1B: CONTENT ALIGN | ✅ PASSED        | ______      | alignment_validated: ___ |

```
VERIFICATION CHECK:
├─ Phase 1 shows ✅ PASSED?
│   ├─ YES → Check Phase 1B
│   └─ NO  → STOP and complete Phase 1
├─ Phase 1B shows ✅ PASSED?
│   ├─ YES → Proceed to "# Memory Save" section below
│   └─ NO  → STOP and complete Phase 1B (alignment check)
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

- Started saving context before phase passed
- Assumed a spec folder without validation
- **Assumed folder from previous session context without explicit argument**
- **Skipped Phase 1B alignment check when folder was provided**
- Skipped the alignment score check when no marker exists
- Did not present menu when scores were ambiguous
- Proceeded without user selection when required
- **Saved to wrong folder due to context contamination from prior session**

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately
2. STATE: "I violated PHASE 1/1B by [specific action]. Correcting now."
3. RETURN to phase validation
4. COMPLETE the phase properly
5. RESUME only after phase passes verification
```

---

# Memory Save

Save the current conversation context to a spec folder's memory directory with semantic indexing.

---

```yaml
role: Context Preservation Specialist
purpose: Save conversation context with intelligent folder detection
action: Determine target folder, analyze conversation, generate memory file

operating_mode:
  workflow: interactive_detection
  workflow_compliance: MANDATORY
  approvals: only_for_ambiguous_folders
  tracking: save_result
```

---

## MCP ENFORCEMENT MATRIX

**CRITICAL:** This command uses local scripts for context generation. Files are automatically indexed when the MCP server starts, or you can use MCP tools for immediate indexing.

```
┌─────────────────┬─────────────────────────────────────┬──────────┬─────────────────┐
│ SCREEN          │ REQUIRED CALLS                      │ MODE     │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ FOLDER DETECT   │ Bash (ls, CLI argument)             │ SINGLE   │ Prompt user     │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ CONTEXT SAVE    │ Bash (node generate-context.js)     │ SINGLE   │ Show error msg  │
├─────────────────┼─────────────────────────────────────┼──────────┼─────────────────┤
│ IMMEDIATE INDEX │ memory_save (optional)              │ SINGLE   │ Auto on restart │
└─────────────────┴─────────────────────────────────────┴──────────┴─────────────────┘
```

**Script Location:**
```
.opencode/skill/system-spec-kit/scripts/memory/generate-context.js
```

> **Tool Restriction (Gate 5 HARD BLOCK):** `Write` and `Edit` tools are intentionally excluded from this command's `allowed-tools`. Memory files MUST be created via the `generate-context.js` script to ensure proper ANCHOR tags (with opening AND closing markers), SESSION SUMMARY table, and MEMORY METADATA YAML block. Direct file creation bypasses these critical formatting features. See AGENTS.md Gate 5 for enforcement details.

**Auto-Indexing:** Memory files created in `specs/*/memory/` are automatically indexed when the Spec Kit Memory MCP server starts. For immediate indexing after creating a file, use `memory_save`:

```
spec_kit_memory_memory_save({
  filePath: "specs/<folder>/memory/<filename>.md"
})
```

---

## 1. 🎯 PURPOSE

Save the current conversation context to a spec folder's memory directory for future retrieval. Automatically detects the most relevant spec folder or prompts user when ambiguous.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` - Optional spec folder (e.g., "011-semantic-memory" or full path)
**Outputs:** `STATUS=<OK|FAIL> PATH=<saved_file_path>`

---

## 3. 📊 WORKFLOW OVERVIEW

| Step | Name              | Purpose                            | Output           |
| ---- | ----------------- | ---------------------------------- | ---------------- |
| 1    | Folder Detection  | Identify target spec folder        | target_folder    |
| 2    | Context Analysis  | Extract key information            | context_data     |
| 3    | Anchor Generation | Create section anchors (MANDATORY) | anchors[]        |
| 4    | JSON Data         | Structure data for processing      | json_payload     |
| 5    | File Generation   | Create memory file with metadata   | memory_file_path |
| 6    | Report            | Show results to user               | status_report    |

---

## 4. ⚡ INSTRUCTIONS

### Step 1: Folder Detection (PHASE 1 - Already Complete)

Use the `target_folder` value from Phase 1.

### Step 2: Context Analysis (AI MUST PERFORM)

**CRITICAL:** The AI agent MUST analyze the conversation and extract the following data. The script does NOT auto-extract from OpenCode - the AI constructs this data manually.

Extract from the current conversation:
- **Session summary**: 2-4 sentences describing what was accomplished
- **Key decisions**: Array of technical choices with rationale (format: "Decision: [choice] because [reason]")
- **Files modified**: Full paths to all files created/edited during session
- **Trigger phrases**: 5-10 keywords/phrases for future semantic search retrieval
- **Technical context**: Key technical details, patterns used, or implementation notes

### Step 3: Anchor Generation (MANDATORY)

Every memory file MUST include anchors for section-specific retrieval. This enables 93% token savings when loading specific sections.

**Anchor Format (matches MCP server extraction):**
```html
<!-- ANCHOR:anchor-id -->
Content for this section...
<!-- /ANCHOR:anchor-id -->
```

**CRITICAL:** 
- Use UPPERCASE `ANCHOR` (recommended, though lowercase works)
- **MUST include BOTH opening AND closing tags** - closing tag is REQUIRED
- No space after colon: `ANCHOR:id` not `ANCHOR: id`

**ANTI-PATTERN - THIS WILL BREAK ANCHOR LOADING:**
```html
<!-- WRONG: No closing tag = anchor extraction fails -->
<!-- anchor: summary -->
Session summary content...
<!-- Missing: <!-- /anchor: summary --> -->

<!-- CORRECT: Both opening AND closing tags present -->
<!-- ANCHOR:summary -->
Session summary content...
<!-- /ANCHOR:summary -->
```

**Why This Matters:** The MCP server extracts anchor content using regex that requires both tags. Without the closing tag, extraction fails silently.

**Anchor ID Pattern:** `[context-type]-[keywords]-[spec-number]`

| Context Type     | Use For                  | Example                             |
| ---------------- | ------------------------ | ----------------------------------- |
| `implementation` | Code patterns, solutions | `implementation-oauth-callback-049` |
| `decision`       | Architecture choices     | `decision-database-schema-005`      |
| `research`       | Investigation findings   | `research-lenis-scroll-006`         |
| `discovery`      | Learnings, insights      | `discovery-api-limits-011`          |
| `general`        | Mixed content            | `general-session-summary-049`       |

**Minimum Anchors Required:**
- 1 anchor: Primary section (session summary)
- Recommended: 2+ anchors (summary + decisions/implementation)

**Standard Anchor Set:**
```markdown
<!-- ANCHOR:summary-[spec#] -->
## Session Summary
...
<!-- /ANCHOR:summary-[spec#] -->

<!-- ANCHOR:decision-[topic]-[spec#] -->
## Key Decisions
...
<!-- /ANCHOR:decision-[topic]-[spec#] -->

<!-- ANCHOR:files-[spec#] -->
## Files Modified
...
<!-- /ANCHOR:files-[spec#] -->
```

**Retrieval via MCP:**
```javascript
// Search for memories with content included
memory_search({ query: "jwt auth", includeContent: true })
// Or use Read tool directly on the memory file path
```

### Step 4: Create JSON Data (AI CONSTRUCTS THIS)

**CRITICAL:** The AI MUST construct this JSON from Step 2 analysis. Without proper JSON input, the script falls back to simulation mode with placeholder data.

**Required JSON Structure:**
```json
{
  "specFolder": "005-memory/010-feature-name",
  "sessionSummary": "Comprehensive description of what was accomplished in this session. Include the problem solved, approach taken, and outcome achieved. This becomes the OVERVIEW section.",
  "keyDecisions": [
    "Decision 1: Chose X approach because Y reason - this provides Z benefit",
    "Decision 2: Selected A over B due to performance considerations"
  ],
  "filesModified": [
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.js",
    "specs/005-memory/010-feature-name/spec.md"
  ],
  "triggerPhrases": [
    "generate-context",
    "memory save",
    "JSON input",
    "simulation mode",
    "context preservation"
  ],
  "technicalContext": {
    "rootCause": "Description of the problem's root cause",
    "solution": "How it was solved",
    "patterns": "Key patterns or approaches used"
  }
}
```

**Field Guidelines:**
| Field              | Min Length | Purpose                             |
| ------------------ | ---------- | ----------------------------------- |
| `sessionSummary`   | 100+ chars | Becomes OVERVIEW - be comprehensive |
| `keyDecisions`     | 1+ items   | Each decision with rationale        |
| `filesModified`    | 0+ items   | Actual paths modified               |
| `triggerPhrases`   | 5-10 items | Keywords for semantic search        |
| `technicalContext` | Optional   | Additional technical details        |

### Step 5: Execute Processing Script

**Two Execution Modes:**

| Mode                                | Command                                                | Use When                                     |
| ----------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| **Mode 1: JSON File** (Recommended) | `node generate-context.js /tmp/save-context-data.json` | Rich context with decisions, files, triggers |
| **Mode 2: Direct Path**             | `node generate-context.js specs/005-memory`            | Minimal/placeholder content only             |

**Mode 1 (Recommended) - Write JSON to temp file, then execute:**
```bash
# 1. Write the JSON data to a temp file (use Write tool or heredoc)
cat > /tmp/save-context-data.json << 'EOF'
{
  "specFolder": "...",
  "sessionSummary": "...",
  ...
}
EOF

# 2. Execute the script with the JSON file
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js /tmp/save-context-data.json

# 3. Clean up temp file
rm /tmp/save-context-data.json
```

**Expected Output (Success):**
```
✓ Loaded conversation data
✓ Transformed manual format to MCP-compatible structure
✓ Found N messages
✓ Found N decisions
✓ Template populated (quality: 100/100)
✓ {filename}.md (300+ lines)
✓ Indexed as memory #NN
```

**If you see "simulation mode" warnings, the JSON was not loaded correctly.**

**Mode 2 (Direct Path) - Minimal save:**
```bash
# Pass spec folder path directly (creates placeholder content)
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/005-memory

# Or with nested folder
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/005-memory/010-feature
```

**When to use Mode 2:** Quick saves without rich context, testing, or when Mode 1 JSON construction fails.

### Step 6: Report Results

Display the completion report (see Section 9).

**Note:** The memory file is automatically indexed on MCP server restart. For immediate indexing, the `generate-context.js` script calls `memory_save` internally, or you can call it directly after manual file creation.

---

## 5. 📁 FILE OUTPUT

### File Naming

`{DD-MM-YY}_{HH-MM}__{topic}.md`

Example: `08-12-25_12-30__semantic-memory.md`

### File Location

```
specs/{spec-folder}/memory/{timestamp}__{topic}.md
```

---

## 6. 🔧 FAILURE RECOVERY

| Failure Type           | Recovery Action                                 |
| ---------------------- | ----------------------------------------------- |
| No spec folder found   | Prompt user to create one                       |
| Empty conversation     | Return `STATUS=FAIL ERROR="No context to save"` |
| Script execution fails | Show error, suggest manual save                 |
| Embedding fails        | File saved, will auto-index on MCP restart      |
| Indexing fails         | File saved, retry with `memory_save` MCP tool   |

---

## 7. ⚠️ ERROR HANDLING

| Condition              | Action                                          |
| ---------------------- | ----------------------------------------------- |
| No spec folder found   | Prompt user to create one                       |
| Empty conversation     | Return `STATUS=FAIL ERROR="No context to save"` |
| Script execution fails | Show error, suggest manual save                 |
| Embedding fails        | File saved, will auto-index on MCP restart      |
| MCP unavailable        | File saved, indexing deferred to restart        |

---

## 8. 🔍 QUICK REFERENCE

| Usage                                                  | Behavior                              |
| ------------------------------------------------------ | ------------------------------------- |
| `/memory:save`                                         | Auto-detect spec folder, save context |
| `/memory:save 011-memory`                              | Save to specific spec folder          |
| `/memory:save specs/006-semantic-memory/003-debugging` | Save to nested spec folder            |

---

## 9. 📊 COMPLETION REPORT

After successful save, display:

```
MEMORY SAVED
────────────────────────────────────────────────────
Spec folder: <target_folder>
File: specs/<folder>/memory/<filename>.md
Memory ID: #<id>

Anchors created:
  - summary-<spec#>
  - decision-<topic>-<spec#>
  - files-<spec#>

Trigger phrases extracted:
  <phrase1>, <phrase2>, <phrase3>, ...

────────────────────────────────────────────────────
[t]riggers edit | [a]nchors view | [d]one

STATUS=OK PATH=specs/<folder>/memory/<filename>.md ANCHORS=<count>
```

### Post-Save Actions

| Input | Action                                            |
| ----- | ------------------------------------------------- |
| t     | Edit trigger phrases for this memory (add/remove) |
| d     | Done, exit save workflow                          |

### Trigger Edit (if selected)

```
EDIT TRIGGERS: "<memory_title>"
────────────────────────────────────────────────────
Current triggers:
  1) <phrase1>
  2) <phrase2>
  3) <phrase3>

[a]dd trigger | [r]emove # | [s]ave | [d]one
```

| Input | Action                             |
| ----- | ---------------------------------- |
| a     | Prompt for new phrase, add to list |
| r     | Enter number to remove             |
| s     | Save changes via memory_update     |
| d     | Done (discard unsaved changes)     |

---

## 10. 📌 RELATED COMMANDS

- `/memory:search` - Unified memory dashboard (search, browse, cleanup, triggers)
- `/memory:checkpoint` - Create checkpoint before major changes

---

## 11. 🔄 INDEXING OPTIONS

Memory files can be indexed in multiple ways:

| Method                         | When It Happens  | Use Case                          |
| ------------------------------ | ---------------- | --------------------------------- |
| **Auto-indexing on startup**   | MCP server start | Default - no action needed        |
| **generate-context.js**        | Script execution | Standard /memory:save workflow    |
| **memory_save MCP tool**       | On demand        | Immediate indexing of single file |
| **memory_index_scan MCP tool** | On demand        | Bulk re-index of folder/all files |

### Full Parameter Reference: memory_save

| Parameter  | Type    | Default    | Description                                                                                                                                 |
| ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `filePath` | string  | *required* | Absolute path to the memory file (must be in `specs/**/memory/` or `.opencode/skill/*/constitutional/` directory)                           |
| `force`    | boolean | false      | Force re-index even if content hash unchanged. Use when you want to regenerate embeddings or update metadata without changing file content. |

**For manual file creation**, use `memory_save` for immediate indexing:
```
spec_kit_memory_memory_save({
  filePath: "specs/011-memory/memory/context.md",
  force: false  // Set true to force re-index unchanged files
})
```

### Full Parameter Reference: memory_index_scan

| Parameter    | Type    | Default | Description                                                                                   |
| ------------ | ------- | ------- | --------------------------------------------------------------------------------------------- |
| `specFolder` | string  | -       | Limit scan to specific spec folder (e.g., "005-memory"). Omit to scan all memory directories. |
| `force`      | boolean | false   | Force re-index all files, ignoring content hash. Useful for regenerating all embeddings.      |

**For bulk operations**, use `memory_index_scan`:
```
spec_kit_memory_memory_index_scan({
  specFolder: "011-memory",  // Optional: omit for full scan
  force: false               // Set true to force re-index all
})
```

---

## 12. 📚 FULL DOCUMENTATION

For comprehensive documentation:
`.opencode/skill/system-spec-kit/SKILL.md`

---

## 13. 🔀 SUB-AGENT DELEGATION

The memory save workflow delegates execution work to a sub-agent for token efficiency. The main agent handles folder validation and user interaction; the sub-agent handles context analysis and file generation.

### Delegation Architecture

```
Main Agent (reads command):
├── PHASE 1: Spec Folder Validation
├── PHASE 1B: Content Alignment Check
├── DISPATCH: Task tool with sub-agent
│   ├── Sub-agent analyzes conversation
│   ├── Sub-agent generates JSON data
│   ├── Sub-agent executes generate-context.js
│   └── Sub-agent returns result
├── FALLBACK (if Task unavailable):
│   └── Execute Steps 2-5 directly
└── Step 6: Report Results (always main agent)
```

### Sub-Agent Execution

**WHEN phases pass, dispatch to sub-agent:**

```
DISPATCH SUB-AGENT:
  tool: Task
  subagent_type: general
  description: "Save memory context"
  prompt: |
    Save conversation context to memory for spec folder: {target_folder}
    
    VALIDATED INPUTS:
    - target_folder: {target_folder}
    - alignment_validated: {YES/WARNED_CONFIRMED}
    
    TASKS TO EXECUTE:
    
    1. CONTEXT ANALYSIS - Extract from current conversation:
       - sessionSummary: 2-4 sentences describing what was accomplished
       - keyDecisions: Array of "Decision: [choice] because [reason]" strings
       - filesModified: Full paths to all files created/edited
       - triggerPhrases: 5-10 keywords/phrases for semantic search
       - technicalContext: { rootCause, solution, patterns }
    
    2. ANCHOR GENERATION - Create proper ANCHOR tags:
       - Use format: <!-- ANCHOR:anchor-id --> ... <!-- /ANCHOR:anchor-id -->
       - Include BOTH opening AND closing tags (CRITICAL)
       - Minimum: summary-{spec#} anchor
       - Recommended: also decision-{topic}-{spec#}, files-{spec#}
    
    3. BUILD JSON DATA - Create structure:
       {
         "specFolder": "{target_folder}",
         "sessionSummary": "[extracted summary]",
         "keyDecisions": ["Decision 1...", "Decision 2..."],
         "filesModified": ["path1", "path2"],
         "triggerPhrases": ["phrase1", "phrase2"],
         "technicalContext": { "rootCause": "...", "solution": "...", "patterns": "..." }
       }
    
    4. WRITE JSON to temp file:
       Write JSON to /tmp/save-context-data.json
    
    5. EXECUTE SCRIPT:
       node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js /tmp/save-context-data.json
    
    6. CLEANUP:
       rm /tmp/save-context-data.json
    
    RETURN (as your final message):
    ```json
    {
      "status": "OK",
      "file_path": "[full path to created memory file]",
      "memory_id": [ID if indexed, or null],
      "anchors_created": ["summary-049", "decision-topic-049"],
      "trigger_phrases": ["phrase1", "phrase2", "phrase3"],
      "spec_folder": "{target_folder}"
    }
    ```
    
    If any step fails, return:
    ```json
    {
      "status": "FAIL",
      "error": "[error description]"
    }
    ```
    
    Tools you can use: Read, Bash, Write (for temp JSON only), Glob
```

### Fallback Logic

**FALLBACK triggers if:**
- Task tool call returns error
- Task tool call times out
- Sub-agent returns `status: FAIL`

**FALLBACK behavior:**
```
WHEN fallback triggers:
├── Log: "Sub-agent unavailable, executing directly"
├── Execute Steps 2-5 directly (current workflow behavior)
│   ├── Step 2: Context Analysis (AI extracts data)
│   ├── Step 3: Anchor Generation
│   ├── Step 4: JSON Data Construction
│   └── Step 5: Execute generate-context.js
└── Continue to Step 6: Report Results
```

### Execution Flow

```
IF phases passed:
  TRY:
    result = Task(subagent_type="general", prompt=SUB_AGENT_PROMPT)
    IF result.status == "OK":
      file_path = result.file_path
      memory_id = result.memory_id
      anchors = result.anchors_created
      triggers = result.trigger_phrases
      → Proceed to Step 6: Report Results
    ELSE:
      → GOTO fallback
  CATCH (Task unavailable or error):
    → GOTO fallback

fallback:
  Log: "Fallback: executing save steps directly"
  Execute Step 2: Context Analysis
  Execute Step 3: Anchor Generation
  Execute Step 4: JSON Data Construction
  Execute Step 5: Execute Script
  → Proceed to Step 6: Report Results
```

### Why Sub-Agent?

| Benefit               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| Token efficiency      | Heavy context extraction happens in sub-agent context |
| Main agent responsive | Validation and reporting stay lightweight             |
| Fallback safety       | Commands always work, even without Task tool          |
| Better isolation      | Sub-agent focuses solely on save workflow             |

---

## 14. 🔗 COMMAND CHAIN

This command can be used with any workflow:

```
[Any workflow step] → /memory:save → [Continue workflow]
```

**Related commands:**
- `/memory:search` - Find saved memories
- `/memory:checkpoint` - Create restore point

---

## 15. 📌 NEXT STEPS

After context is saved, suggest relevant next steps:

| Condition                    | Suggested Command                          | Reason                        |
| ---------------------------- | ------------------------------------------ | ----------------------------- |
| Context saved, continue work | Return to previous task                    | Memory preserved, continue    |
| Ending session               | `/spec_kit:handover [spec-folder-path]`    | Create full handover document |
| Search saved memories        | `/memory:search [query]`                   | Find related context          |
| Start new work               | `/spec_kit:complete [feature-description]` | Begin new feature             |

**ALWAYS** end with: "Context saved. What would you like to do next?"