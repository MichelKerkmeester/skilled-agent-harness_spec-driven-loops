---
description: Save current conversation context to memory with semantic indexing
argument-hint: "<spec-folder>"
allowed-tools: Read, Bash, mcp__semantic_memory__memory_save, mcp__semantic_memory__memory_index_scan, mcp__semantic_memory__memory_stats, mcp__semantic_memory__memory_update
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

⛔ HARD STOP: DO NOT proceed if alignment not validated
```

**Phase 1B Output:** `alignment_validated = ☐ YES | ☐ WARNED_CONFIRMED`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify phase status:**

| PHASE                     | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE             |
| ------------------------- | --------------- | ----------- | ------------------------ |
| PHASE 1: SPEC FOLDER      | ✅ PASSED        | ______      | target_folder: ______    |
| PHASE 1B: CONTENT ALIGN   | ✅ PASSED        | ______      | alignment_validated: ___ |

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
.opencode/skill/system-memory/scripts/generate-context.js
```

> **Tool Restriction (Gate 5 HARD BLOCK):** `Write` and `Edit` tools are intentionally excluded from this command's `allowed-tools`. Memory files MUST be created via the `generate-context.js` script to ensure proper ANCHOR tags (with opening AND closing markers), SESSION SUMMARY table, and MEMORY METADATA YAML block. Direct file creation bypasses these critical formatting features and will cause `memory_load(anchorId)` failures. See AGENTS.md Gate 5 for enforcement details.

**Auto-Indexing:** Memory files created in `specs/*/memory/` are automatically indexed when the semantic memory MCP server starts. For immediate indexing after creating a file, use `memory_save`:

```
mcp__semantic_memory__memory_save({
  filePath: "specs/<folder>/memory/<filename>.md"
})
```

---

## 1. 📋 PURPOSE

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
<!-- WRONG: No closing tag = memory_load(anchorId) returns "Anchor not found" -->
<!-- anchor: summary -->
Session summary content...
<!-- Missing: <!-- /anchor: summary --> -->

<!-- CORRECT: Both opening AND closing tags present -->
<!-- ANCHOR:summary -->
Session summary content...
<!-- /ANCHOR:summary -->
```

**Why This Matters:** The MCP server extracts anchor content using regex that requires both tags. Without the closing tag, extraction fails silently and `memory_load({ anchorId: "summary" })` returns error.

**Anchor ID Pattern:** `[context-type]-[keywords]-[spec-number]`

| Context Type | Use For | Example |
|--------------|---------|---------|
| `implementation` | Code patterns, solutions | `implementation-oauth-callback-049` |
| `decision` | Architecture choices | `decision-database-schema-005` |
| `research` | Investigation findings | `research-lenis-scroll-006` |
| `discovery` | Learnings, insights | `discovery-api-limits-011` |
| `general` | Mixed content | `general-session-summary-049` |

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
// Load specific section only (93% token savings)
memory_load({ specFolder: "049-auth", anchorId: "decision-jwt-049" })
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
    ".opencode/skill/system-memory/scripts/generate-context.js",
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
| Field | Min Length | Purpose |
|-------|------------|---------|
| `sessionSummary` | 100+ chars | Becomes OVERVIEW - be comprehensive |
| `keyDecisions` | 1+ items | Each decision with rationale |
| `filesModified` | 0+ items | Actual paths modified |
| `triggerPhrases` | 5-10 items | Keywords for semantic search |
| `technicalContext` | Optional | Additional technical details |

### Step 5: Execute Processing Script

**Write JSON to temp file, then execute:**
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
node .opencode/skill/system-memory/scripts/generate-context.js /tmp/save-context-data.json

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

| Usage                                                   | Behavior                              |
| ------------------------------------------------------- | ------------------------------------- |
| `/memory:save`                                          | Auto-detect spec folder, save context |
| `/memory:save 011-memory`                               | Save to specific spec folder          |
| `/memory:save specs/006-semantic-memory/003-debugging`  | Save to nested spec folder            |

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

| Input | Action |
|-------|--------|
| t | Edit trigger phrases for this memory (add/remove) |
| d | Done, exit save workflow |

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

| Input | Action |
|-------|--------|
| a | Prompt for new phrase, add to list |
| r | Enter number to remove |
| s | Save changes via memory_update |
| d | Done (discard unsaved changes) |

---

## 10. 📌 RELATED COMMANDS

- `/memory/search` - Unified memory dashboard (search, browse, cleanup, triggers)
- `/memory/checkpoint` - Create checkpoint before major changes

---

## 11. 🔄 INDEXING OPTIONS

Memory files can be indexed in multiple ways:

| Method | When It Happens | Use Case |
| ------ | --------------- | -------- |
| **Auto-indexing on startup** | MCP server start | Default - no action needed |
| **generate-context.js** | Script execution | Standard /memory/save workflow |
| **memory_save MCP tool** | On demand | Immediate indexing of single file |
| **memory_index_scan MCP tool** | On demand | Bulk re-index of folder/all files |

**For manual file creation**, use `memory_save` for immediate indexing:
```
mcp__semantic_memory__memory_save({
  filePath: "specs/011-memory/memory/context.md"
})
```

**For bulk operations**, use `memory_index_scan`:
```
mcp__semantic_memory__memory_index_scan({
  specFolder: "011-memory"  // Optional: omit for full scan
})
```

---

## 12. 📚 FULL DOCUMENTATION

For comprehensive documentation:
`.opencode/skill/system-memory/SKILL.md`
