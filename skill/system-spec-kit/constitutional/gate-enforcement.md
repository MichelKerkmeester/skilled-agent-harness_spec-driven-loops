<!-- TEMPLATE: constitutional_memory.md v1.0 -->
---
title: "CRITICAL GATES (0, 3, 5, 6) - HARD BLOCK ENFORCEMENT"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # Gate 0 - Compaction
  - continue
  - left off
  - continue conversation
  - handover
  - resume
  - compaction
  - where we left
  - pick up where
  # Gate 3 - File Modification
  - fix
  - implement
  - create
  - modify
  - update
  - change
  - edit
  - refactor
  - write
  - add
  - remove
  - delete
  - rename
  - move
  - spec folder
  - gate 3
  - comprehensive
  - all bugs
  - fix all
  - everything
  # Gate 5 - Memory Save
  - save context
  - save memory
  - memory save
  - preserve context
  - gate 5
  # Gate 6 - Completion
  - done
  - complete
  - finished
  - works
  - completed
  - all done
  - gate 6
  # Memory Retrieval
  - search memory
  - find context
  - prior work
  - previous session
---

<!-- ANCHOR:constitutional-gate-enforcement -->

# CRITICAL GATES - HARD BLOCK ENFORCEMENT

> Constitutional memory for the 4 HARD BLOCK gates. Always surfaces at top of memory search.

These rules are HARD BLOCKS. No exceptions. No "I'll do it after."

---

## GATE 0: COMPACTION CHECK [HARD BLOCK]

**TRIGGER:** System message "Please continue the conversation from where we left it off..."

### Detection
Context compaction occurred. AI has lost prior context.

### Required Action
1. **STOP** immediately
2. Display handover protocol:
   ```
   ⚠️ CONTEXT COMPACTION DETECTED
   
   Start new conversation with handoff:
   CONTINUATION - Attempt [N]
   Spec: [CURRENT_SPEC_PATH]
   Last: [COMPLETED_TASK]
   Next: [PENDING_TASK]
   
   Run /spec_kit:handover first
   ```
3. **WAIT** for user confirmation

### Violation = Session Corruption
Proceeding without handover risks repeating work or losing context.

---

## GATE 3: SPEC FOLDER BEFORE FILE MODIFICATIONS

**TRIGGER:** Any intent to create, edit, delete, fix, implement, update, rename, or move files.

### REQUIRED ACTION

STOP and ASK before using Read/Edit/Write/Bash:

> **Spec Folder:** A) Existing | B) New | C) Update related | D) Skip

WAIT for user's answer. THEN proceed.

### VIOLATION = HARD BLOCK

- DO NOT analyze code first
- DO NOT "just check" files first  
- DO NOT start on "exciting" tasks without asking
- ASK FIRST, always

---

## GATE 5: USE SCRIPT FOR MEMORY SAVES

**TRIGGER:** "save context", "save memory", `/memory:save`, or any memory file creation.

### REQUIRED ACTION

ONLY use this command to save context:

```bash
node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]
```

Or with JSON input for rich context:
```bash
node .opencode/skill/system-memory/scripts/generate-context.js /tmp/save-context-data.json
```

### VIOLATION = HARD BLOCK

- NEVER manually create memory files with Write/Edit tools
- NEVER write to `memory/*.md` paths directly
- If violation detected: DELETE the file and re-run via script
- Script ensures: proper anchors, format, embeddings, indexing

---

## GATE 6: COMPLETION VERIFICATION [HARD BLOCK]

**TRIGGER:** Claiming "done", "complete", "finished", "works"

### Required Action
1. Load `checklist.md` from spec folder
2. Verify ALL items addressed
3. Mark each `[x]` with evidence
4. Only THEN claim completion

### Exception
Level 1 tasks (<100 LOC) may skip if no checklist.md exists.

### Violation = False Completion
Never claim "done" without verification. Users lose trust.

---

## MEMORY RETRIEVAL: SEARCH + READ

**TRIGGER:** Need prior context, previous decisions, or session history.

### WORKFLOW

```
memory_search({ query: "topic" })  →  Results with filePaths
         ↓
Read(result.filePath)  →  Full content
```

### KEY POINTS

1. **Search is your entry point** - no separate "load" command
2. **Constitutional memories always surface first** in search results
3. **Use Read tool** to get full file content from search results
4. **Trigger matching** - `memory_match_triggers(prompt)` for proactive surfacing

### EXAMPLE

```javascript
// Find prior work
memory_search({ query: "authentication implementation", limit: 5 })
// Returns: [{ id: 42, filePath: "/path/to/memory.md", title: "..." }, ...]

// Read the content
Read("/path/to/memory.md")
// Returns: Full memory file content
```

---

## Quick Reference

| Gate  | Trigger                  | Action                   | Violation            |
| ----- | ------------------------ | ------------------------ | -------------------- |
| **0** | Compaction message       | STOP → Handover protocol | Session corruption   |
| **3** | File modification intent | Ask A/B/C/D spec folder  | Undocumented changes |
| **5** | "save context/memory"    | Use generate-context.js  | Malformed memory     |
| **6** | "done/complete/finished" | Verify checklist.md      | False completion     |

---

## Self-Check (Before ANY Action)

```
□ Compaction detected? → Gate 0: Display handover protocol
□ File modification planned? → Gate 3: Ask spec folder question FIRST
□ Saving memory/context? → Gate 5: Use generate-context.js script
□ Claiming completion? → Gate 6: Verify checklist.md with evidence
□ Need prior context? → Search memory, then Read files
```

<!-- /ANCHOR:constitutional-gate-enforcement -->

---

*Constitutional Memory - Always surfaces at top of search results*
*Location: .opencode/skill/system-memory/constitutional/*